import { IsObject } from 'class-validator';

export class UpdateSkillsDto {
  @IsObject()
  skills: Record<string, boolean>;
}
