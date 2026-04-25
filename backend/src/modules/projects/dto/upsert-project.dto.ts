import { IsUUID, IsIn, IsString, IsOptional, MaxLength, IsInt, Min } from 'class-validator';

export class UpsertProjectDto {
  @IsUUID()
  routeId: string;

  @IsIn(['high', 'medium', 'low'])
  @IsOptional()
  priority?: 'high' | 'medium' | 'low';

  @IsString()
  @IsOptional()
  @MaxLength(1000)
  notes?: string;
}

export class UpdateProjectDto {
  @IsIn(['high', 'medium', 'low'])
  @IsOptional()
  priority?: 'high' | 'medium' | 'low';

  @IsString()
  @IsOptional()
  @MaxLength(1000)
  notes?: string;

  @IsInt()
  @Min(0)
  @IsOptional()
  attempts?: number;
}
