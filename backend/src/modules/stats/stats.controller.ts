import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { StatsService } from './stats.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';

@ApiTags('stats')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('stats')
export class StatsController {
  constructor(private statsService: StatsService) {}

  @Get('dashboard')
  @ApiOperation({ summary: 'Full dashboard stats for current user' })
  getDashboard(@CurrentUser('id') userId: string) {
    return this.statsService.getDashboard(userId);
  }

  @Get('year-comparison')
  @ApiOperation({ summary: 'Year-over-year comparison' })
  getYearComparison(@CurrentUser('id') userId: string) {
    return this.statsService.getYearComparison(userId);
  }

  @Get('heatmap')
  @ApiOperation({ summary: 'Activity heatmap — daily counts for the past 52 weeks' })
  getHeatmap(@CurrentUser('id') userId: string) {
    return this.statsService.getHeatmap(userId);
  }

  @Get('personal-bests')
  @ApiOperation({ summary: 'Personal bests — hardest onsight/flash/redpoint, longest route, most-visited crag' })
  getPersonalBests(@CurrentUser('id') userId: string) {
    return this.statsService.getPersonalBests(userId);
  }
}
