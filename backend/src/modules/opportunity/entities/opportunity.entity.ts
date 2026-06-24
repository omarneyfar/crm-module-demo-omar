import { ApiProperty } from '@nestjs/swagger';
import { OpportunityStage } from '../dto/create-opportunity.dto';

/**
 * Response shape for an opportunity (used to document Swagger responses).
 */
export class OpportunityEntity {
  @ApiProperty({ format: 'uuid' })
  id!: string;

  @ApiProperty({ format: 'uuid' })
  clientId!: string;

  @ApiProperty()
  title!: string;

  @ApiProperty({ example: '1000.00', description: 'Decimal serialized as string' })
  amount!: string;

  @ApiProperty({ enum: OpportunityStage })
  stage!: OpportunityStage;

  @ApiProperty({ format: 'date', example: '2026-12-31' })
  expectedCloseDate!: Date;

  @ApiProperty({ description: 'Timestamp of the last stage transition' })
  lastStageChangedAt!: Date;

  @ApiProperty()
  createdAt!: Date;

  @ApiProperty()
  updatedAt!: Date;
}
