import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
import { OpportunityService } from './opportunity.service';
import { CreateOpportunityDto } from './dto/create-opportunity.dto';
import { UpdateOpportunityDto } from './dto/update-opportunity.dto';
import { FindOpportunitiesQueryDto } from './dto/find-opportunities-query.dto';
import { OpportunityEntity } from './entities/opportunity.entity';
import { ApiPaginatedResponse } from '../../common/decorators/api-paginated-response.decorator';

@ApiTags('opportunities')
@Controller('opportunities')
export class OpportunityController {
  constructor(private readonly opportunityService: OpportunityService) {}

  @Post()
  @ApiOperation({ summary: 'Create an opportunity' })
  @ApiResponse({
    status: 201,
    description: 'The opportunity has been created.',
  })
  @ApiResponse({ status: 400, description: 'Invalid input.' })
  create(@Body() createOpportunityDto: CreateOpportunityDto) {
    return this.opportunityService.create(createOpportunityDto);
  }

  @Get()
  @ApiOperation({
    summary: 'List opportunities (filter by stage / client type, paginated)',
  })
  @ApiPaginatedResponse(OpportunityEntity)
  findAll(@Query() query: FindOpportunitiesQueryDto) {
    return this.opportunityService.findAll(query);
  }

  @Get('pipeline')
  @ApiOperation({ summary: 'Pipeline recap (totals + per-stage breakdown)' })
  pipeline() {
    return this.opportunityService.pipeline();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get an opportunity by id' })
  @ApiParam({ name: 'id', format: 'uuid' })
  @ApiResponse({ status: 200, description: 'The opportunity.' })
  @ApiResponse({ status: 404, description: 'Opportunity not found.' })
  findOne(@Param('id') id: string) {
    return this.opportunityService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update an opportunity' })
  @ApiParam({ name: 'id', format: 'uuid' })
  @ApiResponse({ status: 200, description: 'The updated opportunity.' })
  @ApiResponse({ status: 404, description: 'Opportunity not found.' })
  update(
    @Param('id') id: string,
    @Body() updateOpportunityDto: UpdateOpportunityDto,
  ) {
    return this.opportunityService.update(id, updateOpportunityDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete an opportunity' })
  @ApiParam({ name: 'id', format: 'uuid' })
  @ApiResponse({
    status: 200,
    description: 'The opportunity has been deleted.',
  })
  @ApiResponse({ status: 404, description: 'Opportunity not found.' })
  remove(@Param('id') id: string) {
    return this.opportunityService.remove(id);
  }
}
