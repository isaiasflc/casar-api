import { IsBooleanString, IsInt, IsOptional, IsPositive, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class GetPostsFeedQueryDto {
    @IsOptional()
    @Type(() => Number)
    @IsInt()
    @IsPositive()
    limit: number = 10;

    @IsOptional()
    @Type(() => Number)
    @IsInt()
    @Min(1)
    page: number = 1;

    @IsOptional()
    @IsBooleanString()
    following: string = 'false';
}
