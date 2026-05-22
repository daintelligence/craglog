import { Controller, Post, Param, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { KudosService } from './kudos.service';

@ApiTags('kudos')
@Controller('kudos')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class KudosController {
  constructor(private kudosService: KudosService) {}

  @Post(':ascentId/toggle')
  @ApiOperation({ summary: 'Toggle kudos on an ascent' })
  async toggle(
    @CurrentUser('id') userId: string,
    @Param('ascentId') ascentId: string,
  ) {
    return this.kudosService.toggle(userId, ascentId);
  }
}
