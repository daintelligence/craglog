import { Controller, Get, Post, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { BadgesService } from './badges.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { Public } from '../../common/decorators/public.decorator';

@ApiTags('badges')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('badges')
export class BadgesController {
  constructor(private badgesService: BadgesService) {}

  @Get()
  @Public()
  @ApiOperation({ summary: 'Get all possible badges' })
  getAllBadges() {
    return this.badgesService.getAllBadges();
  }

  @Get('mine')
  @ApiOperation({ summary: 'Get badges earned by current user' })
  getUserBadges(@CurrentUser('id') userId: string) {
    return this.badgesService.getUserBadges(userId);
  }

  @Post('evaluate')
  @ApiOperation({ summary: 'Evaluate and award any newly earned badges' })
  evaluate(@CurrentUser('id') userId: string) {
    return this.badgesService.evaluateForUser(userId);
  }
}
