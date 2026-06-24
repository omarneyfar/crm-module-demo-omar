import { IsOptional, IsInt, Min, Max } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

/**
 * Pagination DTO
 * Standard pagination query parameters
 */
export class PaginationQueryDto {
    @ApiPropertyOptional({ default: 1, minimum: 1, description: 'Page number' })
    @IsOptional()
    @Type(() => Number)
    @IsInt()
    @Min(1)
    page?: number = 1;

    @ApiPropertyOptional({
        default: 10,
        minimum: 1,
        maximum: 100,
        description: 'Items per page',
    })
    @IsOptional()
    @Type(() => Number)
    @IsInt()
    @Min(1)
    @Max(100)
    limit?: number = 10;
}

/**
 * Paginated Response
 * Standard format for paginated API responses
 */
export class PaginatedResponse<T> {
    @ApiProperty({ isArray: true, description: 'Items for the current page' })
    data: T[];

    @ApiProperty({ example: 42, description: 'Total number of matching items' })
    total: number;

    @ApiProperty({ example: 1, description: 'Current page' })
    page: number;

    @ApiProperty({ example: 10, description: 'Items per page' })
    limit: number;

    @ApiProperty({ example: 5, description: 'Total number of pages' })
    totalPages: number;

    @ApiProperty({ example: true, description: 'Whether a next page exists' })
    hasNext: boolean;

    @ApiProperty({ example: false, description: 'Whether a previous page exists' })
    hasPrevious: boolean;

    constructor(data: T[], total: number, page: number, limit: number) {
        this.data = data;
        this.total = total;
        this.page = page;
        this.limit = limit;
        this.totalPages = Math.ceil(total / limit);
        this.hasNext = page < this.totalPages;
        this.hasPrevious = page > 1;
    }
}