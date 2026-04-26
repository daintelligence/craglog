import { IsString, IsEnum, IsOptional, IsInt, Min, Max, MaxLength } from 'class-validator';
import { FeedbackCategory } from '../entities/feedback.entity';

export class CreateFeedbackDto {
  @IsEnum(FeedbackCategory)
  category: FeedbackCategory;

  @IsString()
  @MaxLength(2000)
  message: string;

  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(5)
  rating?: number;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  context?: string;
}
