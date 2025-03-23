import { IsOptional, IsString, IsNotEmpty, MaxLength } from 'class-validator';

export class CreatePostDto {
    @IsString()
    @IsNotEmpty()
    @MaxLength(200, { message: 'Content cannot exceed 200 characters.' })
    content: string;

    @IsOptional()
    @IsString()
    comment?: string;

    @IsOptional()
    originalPostId?: number;
}
