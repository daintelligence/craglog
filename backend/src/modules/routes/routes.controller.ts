import { Controller, Get, Param, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiQuery } from '@nestjs/swagger';
import { RoutesService } from './routes.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { Public } from '../../common/decorators/public.decorator';

@ApiTags('routes')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('routes')
export class RoutesController {
  constructor(private routesService: RoutesService) {}

  @Get('search')
  @Public()
  @ApiOperation({ summary: 'Full-text route search across all crags' })
  @ApiQuery({ name: 'q', required: true })
  search(@Query('q') q: string) {
    return this.routesService.search(q);
  }

  @Get('by-buttress/:buttressId')
  @Public()
  @ApiOperation({ summary: 'Get all routes for a buttress' })
  findByButtress(@Param('buttressId') buttressId: string) {
    return this.routesService.findByButtress(buttressId);
  }

  @Get(':id')
  @Public()
  @ApiOperation({ summary: 'Get route detail' })
  findById(@Param('id') id: string) {
    return this.routesService.findById(id);
  }
}
