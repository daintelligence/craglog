import {
  IsString,
  IsEnum,
  IsDateString,
  IsOptional,
  IsInt,
  Min,
  Max,
  IsBoolean,
  IsArray,
  MaxLength,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { AscentType } from '../entities/ascent.entity';

export class CreateAscentDto {
  @ApiProperty({ description: 'Route UUID', required: false })
  @IsOptional()
  @IsString()
  routeId?: string;

  @ApiProperty({ description: 'Crag UUID — auto-resolved from route if omitted', required: false })
  @IsOptional()
  @IsString()
  cragId?: string;

  @ApiProperty({ enum: AscentType, example: AscentType.ONSIGHT })
  @IsEnum(AscentType)
  ascentType: AscentType;

  @ApiProperty({ example: '2024-05-20' })
  @IsDateString()
  date: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  notes?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  partner?: string;

  @ApiProperty({ required: false, minimum: 1, maximum: 5 })
  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(5)
  starRating?: number;

  @ApiProperty({ required: false, default: false })
  @IsOptional()
  @IsBoolean()
  isFavourite?: boolean;

  @ApiProperty({ required: false, minimum: 1, default: 1 })
  @IsOptional()
  @IsInt()
  @Min(1)
  attempts?: number;

  @ApiProperty({ required: false, description: 'Conditions: sunny, cold, wet etc.' })
  @IsOptional()
  @IsString()
  conditions?: string;
}

export class BulkCreateAscentDto {
  @IsArray()
  ascents: CreateAscentDto[];
}

export class GymLogDto {
  @ApiProperty({ example: '6b+' })
  @IsString()
  @MaxLength(20)
  grade: string;

  @ApiProperty({ enum: ['lead', 'toprope', 'autobelay', 'boulder'] })
  @IsEnum(['lead', 'toprope', 'autobelay', 'boulder'])
  style: 'lead' | 'toprope' | 'autobelay' | 'boulder';

  @ApiProperty({ example: '2024-05-20' })
  @IsDateString()
  date: string;

  @ApiProperty({ enum: AscentType, required: false, default: AscentType.REDPOINT })
  @IsOptional()
  @IsEnum(AscentType)
  ascentType?: AscentType;
}
