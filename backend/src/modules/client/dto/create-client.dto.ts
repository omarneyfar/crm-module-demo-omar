import { IsEmail, IsString, IsOptional, IsEnum, ValidateIf } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export enum ClientType {
  COMPANY = 'COMPANY',
  INDIVIDUAL = 'INDIVIDUAL',
}

export class CreateClientDto {
  @ApiProperty({ enum: ClientType })
  @IsEnum(ClientType)
  type!: ClientType;

  @ApiPropertyOptional()
  @IsOptional() @IsEmail()
  email?: string;

  @ApiPropertyOptional()
  @IsOptional() @IsString()
  phone?: string;

  // required only for COMPANY
  @ApiPropertyOptional()
  @ValidateIf((o) => o.type === ClientType.COMPANY)
  @IsString()
  companyName?: string;

  @ApiPropertyOptional()
  @ValidateIf((o) => o.type === ClientType.COMPANY)
  @IsOptional() @IsString()
  siret?: string;

  // required only for INDIVIDUAL
  @ApiPropertyOptional()
  @ValidateIf((o) => o.type === ClientType.INDIVIDUAL)
  @IsString()
  firstName?: string;

  @ApiPropertyOptional()
  @ValidateIf((o) => o.type === ClientType.INDIVIDUAL)
  @IsString()
  lastName?: string;
}
