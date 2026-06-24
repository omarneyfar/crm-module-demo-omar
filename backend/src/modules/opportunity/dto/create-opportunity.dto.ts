import {
  IsString,
  IsUUID,
  IsNumber,
  IsEnum,
  IsDateString,
  IsOptional,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export enum OpportunityStage {
  LEAD = 'LEAD',
  CONTACTED = 'CONTACTED',
  PROPOSAL = 'PROPOSAL',
  NEGOTIATION = 'NEGOTIATION',
  WON = 'WON',
  LOST = 'LOST',
}

export class CreateOpportunityDto {
  @ApiProperty({ format: 'uuid' })
  @IsUUID()
  clientId!: string;

  @ApiProperty()
  @IsString()
  title!: string;

  @ApiProperty({ example: 1000.0 })
  @IsNumber()
  amount!: number;

  @ApiPropertyOptional({ enum: OpportunityStage })
  @IsOptional()
  @IsEnum(OpportunityStage)
  stage?: OpportunityStage;

  @ApiProperty({ example: '2026-06-24' })
  @IsDateString()
  expectedCloseDate!: string;
}
