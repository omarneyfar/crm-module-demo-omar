import { IsEnum, IsOptional } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { PaginationQueryDto } from '../../../common/dto/pagination-query.dto';
import { OpportunityStage } from './create-opportunity.dto';
import { ClientType } from '../../client/dto/create-client.dto';

export class FindOpportunitiesQueryDto extends PaginationQueryDto {
  @ApiPropertyOptional({ enum: OpportunityStage })
  @IsOptional() @IsEnum(OpportunityStage)
  stage?: OpportunityStage;

  @ApiPropertyOptional({ enum: ClientType })
  @IsOptional() @IsEnum(ClientType)
  clientType?: ClientType;
}
