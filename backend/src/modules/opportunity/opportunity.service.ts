import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateOpportunityDto } from './dto/create-opportunity.dto';
import { UpdateOpportunityDto } from './dto/update-opportunity.dto';
import { FindOpportunitiesQueryDto } from './dto/find-opportunities-query.dto';
import { PaginatedResponse } from 'src/common/dto/pagination-query.dto';
import { OpportunityStage } from 'generated/prisma/enums';
import { Prisma } from 'generated/prisma/client';

@Injectable()
export class OpportunityService {
  constructor(private readonly prisma: PrismaService) {}

  /** Days without a stage change before an OPEN deal is "stagnant", per stage. */
  private readonly STAGNANT_DAYS_BY_STAGE: Partial<
    Record<OpportunityStage, number>
  > = {
    LEAD: 7,
    CONTACTED: 10,
    PROPOSAL: 14,
    NEGOTIATION: 30,
  };
  private readonly DEFAULT_STAGNANT_DAYS = 14;

  private withStatus(o: {
    stage: OpportunityStage;
    expectedCloseDate: Date;
    lastStageChangedAt: Date;
  }) {
    const open = o.stage !== 'WON' && o.stage !== 'LOST';
    const now = Date.now();
    const isLate = open && o.expectedCloseDate.getTime() < now;
    const days =
      this.STAGNANT_DAYS_BY_STAGE[o.stage] ?? this.DEFAULT_STAGNANT_DAYS;
    const isStagnant =
      open && now - o.lastStageChangedAt.getTime() > days * 86_400_000;

    return { ...o, isLate, isStagnant, hasProblem: isLate || isStagnant };
  }

  create(createOpportunityDto: CreateOpportunityDto) {
    const { expectedCloseDate, ...rest } = createOpportunityDto;
    return this.prisma.opportunity.create({
      data: {
        ...rest,
        expectedCloseDate: new Date(expectedCloseDate),
      },
    });
  }

  async findAll(query: FindOpportunitiesQueryDto) {
    const { stage, clientType, status, search, page = 1, limit = 10 } = query;

    const now = new Date();
    // A deal is "late" if it's open and past its expected close date.
    const lateWhere: Prisma.OpportunityWhereInput = {
      stage: { notIn: [OpportunityStage.WON, OpportunityStage.LOST] },
      expectedCloseDate: { lt: now },
    };
    // "Stagnant" threshold differs per stage, so it's an OR over the open stages.
    const stagnantWhere: Prisma.OpportunityWhereInput = {
      OR: Object.entries(this.STAGNANT_DAYS_BY_STAGE).map(([s, days]) => ({
        stage: s as OpportunityStage,
        lastStageChangedAt: {
          lt: new Date(now.getTime() - days * 86_400_000),
        },
      })),
    };

    // Built once, reused by findMany + count so the filter stays consistent.
    const and: Prisma.OpportunityWhereInput[] = [];
    if (stage) and.push({ stage });
    if (clientType) and.push({ client: { type: clientType } });
    if (search) {
      and.push({
        client: {
          OR: [
            { companyName: { contains: search, mode: 'insensitive' } },
            { firstName: { contains: search, mode: 'insensitive' } },
            { lastName: { contains: search, mode: 'insensitive' } },
            { email: { contains: search, mode: 'insensitive' } },
          ],
        },
      });
    }
    if (status === 'LATE') and.push(lateWhere);
    else if (status === 'STAGNANT') and.push(stagnantWhere);
    else if (status === 'PROBLEM') and.push({ OR: [lateWhere, stagnantWhere] });
    else if (status === 'ON_TRACK') {
      and.push({ NOT: { OR: [lateWhere, stagnantWhere] } });
    }

    const where: Prisma.OpportunityWhereInput = and.length ? { AND: and } : {};

    const [data, total] = await Promise.all([
      this.prisma.opportunity.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.opportunity.count({ where }),
    ]);

    const items = data.map((o) => this.withStatus(o));
    return new PaginatedResponse(items, total, page, limit);
  }

  async findOne(id: string) {
    const opportunity = await this.prisma.opportunity.findUnique({
      where: { id },
    });
    if (!opportunity) {
      throw new NotFoundException(`Opportunity ${id} not found`);
    }
    return this.withStatus(opportunity);
  }

  async update(id: string, updateOpportunityDto: UpdateOpportunityDto) {
    const existing = await this.findOne(id);
    const { expectedCloseDate, stage, ...rest } = updateOpportunityDto;

    const stageChanged = stage !== undefined && stage !== existing.stage;

    return this.prisma.opportunity.update({
      where: { id },
      data: {
        ...rest,
        ...(stage !== undefined && { stage }),
        ...(stageChanged && { lastStageChangedAt: new Date() }),
        ...(expectedCloseDate && {
          expectedCloseDate: new Date(expectedCloseDate),
        }),
      },
    });
  }

  async pipeline() {
    const grouped = await this.prisma.opportunity.groupBy({
      by: ['stage'],
      _count: { _all: true },
      _sum: { amount: true },
    });

    const byStage = grouped.map((g) => ({
      stage: g.stage,
      count: g._count._all,
      totalAmount: g._sum.amount ?? 0,
    }));

    const WEIGHTS: Record<string, number> = {
      LEAD: 0.1, CONTACTED: 0.25, PROPOSAL: 0.5, NEGOTIATION: 0.75, WON: 1, LOST: 0,
    };
    const weightedForecast = byStage.reduce(
      (sum, s) => sum + Number(s.totalAmount) * (WEIGHTS[s.stage] ?? 0), 0,
    );
    const totalOpenValue = byStage
      .filter((s) => s.stage !== 'WON' && s.stage !== 'LOST')
      .reduce((sum, s) => sum + Number(s.totalAmount), 0);

    return { byStage, totalOpenValue, weightedForecast };
  }

  async remove(id: string) {
    await this.findOne(id);
    return this.prisma.opportunity.delete({ where: { id } });
  }
}
