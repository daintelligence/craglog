import { Controller, Get, Patch, Param, Body, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { AwardsService } from './awards.service';
import { UpdateSkillsDto } from './dto/update-skills.dto';

@ApiTags('awards')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('awards')
export class AwardsController {
  constructor(private readonly svc: AwardsService) {}

  @Get('definitions')
  getDefinitions() {
    return this.svc.getDefinitions();
  }

  @Get('me')
  getMyProgress(@CurrentUser('id') userId: string) {
    return this.svc.getUserProgress(userId);
  }

  @Patch('me/:awardType/skills')
  updateSkills(
    @CurrentUser('id') userId: string,
    @Param('awardType') awardType: string,
    @Body() dto: UpdateSkillsDto,
  ) {
    return this.svc.updateSkills(userId, awardType, dto.skills);
  }
}
