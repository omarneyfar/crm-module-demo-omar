import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateOpportunityDto } from './dto/create-opportunity.dto';
import { UpdateOpportunityDto } from './dto/update-opportunity.dto';
import { FindOpportunitiesQueryDto } from './dto/find-opportunities-query.dto';
import { PaginatedResponse } from 'src/common/dto/pagination-query.dto';

@Injectable()
export class OpportunityService {
  constructor(private readonly prisma: PrismaService) {}

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
    const { stage, clientType, page = 1, limit = 10 } = query;

    // built once, reused by findMany + count so the filter stays consistent
    const where = {
      ...(stage && { stage }),
      ...(clientType && { client: { type: clientType } }),
    };

    const [data, total] = await Promise.all([
      this.prisma.opportunity.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.opportunity.count({ where }),
    ]);

    return new PaginatedResponse(data, total, page, limit);
  }

  async findOne(id: string) {
    const opportunity = await this.prisma.opportunity.findUnique({
      where: { id },
    });
    if (!opportunity) {
      throw new NotFoundException(`Opportunity ${id} not found`);
    }
    return opportunity;
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

  async remove(id: string) {
    await this.findOne(id);
    return this.prisma.opportunity.delete({ where: { id } });
  }
}
