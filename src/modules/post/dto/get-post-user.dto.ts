import { IsBooleanString, IsInt, IsOptional, IsPositive, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class GetPostsUserQueryDto {
    @IsOptional()
    @Type(() => Number)
    @IsInt()
    @IsPositive()
    limit: number = 5;

    @IsOptional()
    @Type(() => Number)
    @IsInt()
    @Min(1)
    page: number = 1;
}