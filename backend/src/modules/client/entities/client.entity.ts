import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { ClientType } from '../dto/create-client.dto';

/**
 * Response shape for a client (used to document Swagger responses).
 */
export class ClientEntity {
  @ApiProperty({ format: 'uuid' })
  id!: string;

  @ApiProperty({ enum: ClientType })
  type!: ClientType;

  @ApiPropertyOptional({ example: 'client@example.com', nullable: true })
  email!: string | null;

  @ApiPropertyOptional({ nullable: true })
  phone!: string | null;

  @ApiPropertyOptional({ description: 'COMPANY only', nullable: true })
  companyName!: string | null;

  @ApiPropertyOptional({ description: 'COMPANY only', nullable: true })
  siret!: string | null;

  @ApiPropertyOptional({ description: 'INDIVIDUAL only', nullable: true })
  firstName!: string | null;

  @ApiPropertyOptional({ description: 'INDIVIDUAL only', nullable: true })
  lastName!: string | null;

  @ApiProperty()
  createdAt!: Date;

  @ApiProperty()
  updatedAt!: Date;
}
