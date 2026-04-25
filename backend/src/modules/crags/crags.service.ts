import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { Crag } from './entities/crag.entity';
import { Buttress } from './entities/buttress.entity';
import { Region } from './entities/region.entity';
import { SearchCragsDto } from './dto/search-crags.dto';

@Injectable()
export class CragsService {
  constructor(
    @InjectRepository(Crag) private cragRepo: Repository<Crag>,
    @InjectRepository(Buttress) private buttressRepo: Repository<Buttress>,
    @InjectRepository(Region) private regionRepo: Repository<Region>,
    private dataSource: DataSource,
  ) {}

  async findAll(dto: SearchCragsDto): Promise<{ crags: any[]; total: number }> {
    if (dto.lat !== undefined && dto.lng !== undefined) {
      return this.findByProximity(dto);
    }

    const qb = this.cragRepo
      .createQueryBuilder('c')
      .leftJoinAndSelect('c.region', 'r')
      .where('c.isActive = true');

    if (dto.q) {
      qb.andWhere('(c.name ILIKE :q OR r.name ILIKE :q)', { q: `%${dto.q}%` });
    }
    if (dto.regionId) {
      qb.andWhere('c.regionId = :regionId', { regionId: dto.regionId });
    }

    qb.orderBy('c.name', 'ASC').limit(dto.limit || 20);

    const [crags, total] = await qb.getManyAndCount();
    return { crags, total };
  }

  private async findByProximity(dto: SearchCragsDto) {
    const radiusMetres = (dto.radiusKm || 50) * 1000;
    const limit = Math.min(dto.limit || 20, 100);

    // Build parameterized query without template-literal SQL fragments
    const params: (string | number)[] = [dto.lng, dto.lat, radiusMetres];
    let nameFilter = '';
    if (dto.q) {
      params.push(`%${dto.q}%`);
      nameFilter = `AND c.name ILIKE $${params.length}`;
    }
    params.push(limit);
    const limitParam = `$${params.length}`;

    const raw = await this.dataSource.query(
      `SELECT c.*, r.name as region_name,
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
         ${nameFilter}
       ORDER BY distance_metres ASC
       LIMIT ${limitParam}`,
      params,
    );

    return {
      crags: raw.map((r: any) => ({
        id: r.id,
        name: r.name,
        latitude: parseFloat(r.latitude),
        longitude: parseFloat(r.longitude),
        rockType: r.rock_type,
        regionName: r.region_name,
        distanceMetres: Math.round(parseFloat(r.distance_metres)),
      })),
      total: raw.length,
    };
  }

  async findById(id: string): Promise<Crag> {
    const crag = await this.cragRepo.findOne({
      where: { id },
      relations: ['region', 'buttresses', 'buttresses.routes'],
    });
    if (!crag) throw new NotFoundException('Crag not found');
    return crag;
  }

  async findButtresses(cragId: string): Promise<Buttress[]> {
    return this.buttressRepo.find({
      where: { cragId },
      relations: ['routes'],
      order: { sortOrder: 'ASC', name: 'ASC' },
    });
  }

  async findRegions(): Promise<Region[]> {
    return this.regionRepo.find({ order: { name: 'ASC' } });
  }

  async getRouteCount(cragId: string): Promise<number> {
    const result = await this.dataSource.query(
      `SELECT COUNT(ro.id) as count
       FROM routes ro
       JOIN buttresses b ON b.id = ro.buttress_id
       WHERE b.crag_id = $1 AND ro.is_active = true`,
      [cragId],
    );
    return parseInt(result[0]?.count || '0', 10);
  }

  async getConditions(cragId: string): Promise<any> {
    const rows = await this.dataSource.query(
      `SELECT
        a.conditions,
        COUNT(*) as cnt,
        MAX(a.date) as last_date
       FROM ascents a
       WHERE a.crag_id = $1
         AND a.date::date >= CURRENT_DATE - INTERVAL '7 days'
         AND a.conditions IS NOT NULL
         AND a.conditions != ''
       GROUP BY a.conditions
       ORDER BY cnt DESC`,
      [cragId],
    );

    const [summary] = await this.dataSource.query(
      `SELECT COUNT(DISTINCT a.user_id) as climbers, COUNT(*) as ascents
       FROM ascents a
       WHERE a.crag_id = $1 AND a.date::date >= CURRENT_DATE - INTERVAL '7 days'`,
      [cragId],
    );

    const snippets = await this.dataSource.query(
      `SELECT a.conditions, a.date
       FROM ascents a
       WHERE a.crag_id = $1
         AND a.date::date >= CURRENT_DATE - INTERVAL '14 days'
         AND a.conditions IS NOT NULL
         AND a.conditions != ''
       ORDER BY a.date DESC
       LIMIT 5`,
      [cragId],
    );

    return {
      climbers: parseInt(summary.climbers, 10),
      ascents: parseInt(summary.ascents, 10),
      conditionCounts: rows.map((r: any) => ({
        condition: r.conditions,
        count: parseInt(r.cnt, 10),
        lastDate: r.last_date,
      })),
      recentConditionNotes: snippets.map((s: any) => ({
        condition: s.conditions,
        date: s.date,
      })),
    };
  }

  async findNearby(lat: number, lng: number, radiusKm = 30): Promise<any[]> {
    const radiusMetres = radiusKm * 1000;
    const raw = await this.dataSource.query(
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
       LIMIT 5`,
      [lng, lat, radiusMetres],
    );
    return raw.map((r: any) => ({
      id: r.id,
      name: r.name,
      latitude: parseFloat(r.latitude),
      longitude: parseFloat(r.longitude),
      rockType: r.rock_type,
      regionName: r.region_name,
      distanceKm: Math.round(parseFloat(r.distance_metres) / 100) / 10,
    }));
  }
}
