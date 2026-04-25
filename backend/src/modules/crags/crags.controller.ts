import { Controller, Get, Param, Query, ParseFloatPipe, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiQuery } from '@nestjs/swagger';
import { CragsService } from './crags.service';
import { SearchCragsDto } from './dto/search-crags.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { Public } from '../../common/decorators/public.decorator';

@ApiTags('crags')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('crags')
export class CragsController {
  constructor(private cragsService: CragsService) {}

  @Get()
  @Public()
  @ApiOperation({ summary: 'Search crags — supports GPS proximity and text search' })
  findAll(@Query() dto: SearchCragsDto) {
    return this.cragsService.findAll(dto);
  }

  @Get('regions')
  @Public()
  @ApiOperation({ summary: 'List all regions' })
  findRegions() {
    return this.cragsService.findRegions();
  }

  @Get('nearby')
  @ApiOperation({ summary: 'Find up to 5 crags within 30km of a position' })
  @ApiQuery({ name: 'lat', type: Number })
  @ApiQuery({ name: 'lng', type: Number })
  @ApiQuery({ name: 'radiusKm', type: Number, required: false })
  findNearby(
    @Query('lat', ParseFloatPipe) lat: number,
    @Query('lng', ParseFloatPipe) lng: number,
    @Query('radiusKm') radiusKm?: number,
  ) {
    return this.cragsService.findNearby(lat, lng, radiusKm ? Number(radiusKm) : 30);
  }

  @Get(':id')
  @Public()
  @ApiOperation({ summary: 'Get crag with buttresses and routes' })
  findById(@Param('id') id: string) {
    return this.cragsService.findById(id);
  }

  @Get(':id/buttresses')
  @Public()
  @ApiOperation({ summary: 'Get buttresses with routes for a crag' })
  findButtresses(@Param('id') id: string) {
    return this.cragsService.findButtresses(id);
  }

  @Get(':id/conditions')
  @Public()
  @ApiOperation({ summary: 'Community conditions at a crag — last 7 days' })
  getConditions(@Param('id') id: string) {
    return this.cragsService.getConditions(id);
  }
}
