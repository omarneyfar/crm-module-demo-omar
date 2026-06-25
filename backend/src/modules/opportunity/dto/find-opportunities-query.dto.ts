import { IsEnum, IsOptional, IsString } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { PaginationQueryDto } from '../../../common/dto/pagination-query.dto';
import { OpportunityStage } from './create-opportunity.dto';
import { ClientType } from '../../client/dto/create-client.dto';

export enum OpportunityStatus {
  LATE = 'LATE',
  STAGNANT = 'STAGNANT',
  PROBLEM = 'PROBLEM',
  ON_TRACK = 'ON_TRACK',
}

export class FindOpportunitiesQueryDto extends PaginationQueryDto {
  @ApiPropertyOptional({ enum: OpportunityStage })
  @IsOptional() @IsEnum(OpportunityStage)
  stage?: OpportunityStage;

  @ApiPropertyOptional({ enum: ClientType })
  @IsOptional() @IsEnum(ClientType)
  clientType?: ClientType;

  @ApiPropertyOptional({ enum: OpportunityStatus, description: 'Filter by problem status' })
  @IsOptional() @IsEnum(OpportunityStatus)
  status?: OpportunityStatus;

  @ApiPropertyOptional({ description: 'Search by client name or email' })
  @IsOptional() @IsString()
  search?: string;
}
