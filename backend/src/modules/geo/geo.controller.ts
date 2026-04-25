import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiQuery } from '@nestjs/swagger';
import { GeoService } from './geo.service';
import { Public } from '../../common/decorators/public.decorator';

@ApiTags('geo')
@Controller('geo')
export class GeoController {
  constructor(private geoService: GeoService) {}

  @Get('nearby')
  @Public()
  @ApiOperation({ summary: 'Get nearest crags by GPS coordinates' })
  @ApiQuery({ name: 'lat', required: true })
  @ApiQuery({ name: 'lng', required: true })
  @ApiQuery({ name: 'radiusKm', required: false, example: 25 })
  @ApiQuery({ name: 'limit', required: false, example: 5 })
  getNearbyCrags(
    @Query('lat') lat: number,
    @Query('lng') lng: number,
    @Query('radiusKm') radiusKm = 25,
    @Query('limit') limit = 5,
  ) {
    return this.geoService.getNearbyCrags(+lat, +lng, +radiusKm, +limit);
  }

  @Get('bounds')
  @Public()
  @ApiOperation({ summary: 'Get geographic bounds of all crags (for map initialisation)' })
  getCragBounds() {
    return this.geoService.getCragBounds();
  }
}
