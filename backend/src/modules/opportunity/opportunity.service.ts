import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateOpportunityDto } from './dto/create-opportunity.dto';
import { UpdateOpportunityDto } from './dto/update-opportunity.dto';

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

  findAll() {
    return this.prisma.opportunity.findMany();
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
    await this.findOne(id);
    const { expectedCloseDate, ...rest } = updateOpportunityDto;
    return this.prisma.opportunity.update({
      where: { id },
      data: {
        ...rest,
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
