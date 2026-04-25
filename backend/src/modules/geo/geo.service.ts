import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';

@Injectable()
export class GeoService {
  constructor(private dataSource: DataSource) {}

  async getNearbyCrags(lat: number, lng: number, radiusKm = 25, limit = 5) {
    const radiusMetres = radiusKm * 1000;
    return this.dataSource.query(
      `SELECT c.id, c.name, c.latitude, c.longitude, c.rock_type,
              r.name as region_name,
              ST_Distance(
                ST_SetSRID(ST_MakePoint(c.longitude::float, c.latitude::float), 4326)::geography,
                ST_SetSRID(ST_MakePoint($1, $2), 4326)::geography
              ) as distance_metres
       FROM crags c
       LEFT JOIN regions r ON r.id = c.region_id
       WHERE c.is_active = true
         AND c.latitude IS NOT NULL
         AND ST_Distance(
           ST_SetSRID(ST_MakePoint(c.longitude::float, c.latitude::float), 4326)::geography,
           ST_SetSRID(ST_MakePoint($1, $2), 4326)::geography
         ) <= $3
       ORDER BY distance_metres ASC
       LIMIT $4`,
      [lng, lat, radiusMetres, limit],
    );
  }

  async getCragBounds() {
    const rows = await this.dataSource.query(
      `SELECT MIN(longitude::float) as min_lng,
              MAX(longitude::float) as max_lng,
              MIN(latitude::float) as min_lat,
              MAX(latitude::float) as max_lat
       FROM crags WHERE is_active = true AND latitude IS NOT NULL`,
    );
    return rows[0];
  }
}
