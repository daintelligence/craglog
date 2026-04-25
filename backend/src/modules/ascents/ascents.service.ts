import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource, Between } from 'typeorm';
import { Ascent } from './entities/ascent.entity';
import { CreateAscentDto, BulkCreateAscentDto } from './dto/create-ascent.dto';
import { Route } from '../routes/entities/route.entity';
import { BadgeEngineService } from '../badges/badge-engine.service';

export interface AscentFilter {
  startDate?: string;
  endDate?: string;
  cragId?: string;
  ascentType?: string;
  climbingType?: string;
  limit?: number;
  offset?: number;
}

@Injectable()
export class AscentsService {
  constructor(
    @InjectRepository(Ascent) private ascentRepo: Repository<Ascent>,
    @InjectRepository(Route) private routeRepo: Repository<Route>,
    private dataSource: DataSource,
    private badgeEngine: BadgeEngineService,
  ) {}

  async create(userId: string, dto: CreateAscentDto): Promise<{ ascent: Ascent; newBadges: any[] }> {
    const route = await this.routeRepo.findOne({
      where: { id: dto.routeId },
      relations: ['buttress', 'buttress.crag'],
    });
    if (!route) throw new NotFoundException('Route not found');

    const cragId = dto.cragId || route.buttress?.cragId;

    const ascent = this.ascentRepo.create({
      ...dto,
      userId,
      cragId,
    });

    const saved = await this.ascentRepo.save(ascent);

    const newBadges = await this.badgeEngine.evaluateForUser(userId);

    return {
      ascent: await this.findById(saved.id, userId),
      newBadges,
    };
  }

  async bulkCreate(userId: string, dto: BulkCreateAscentDto): Promise<{ count: number; newBadges: any[] }> {
    const ascents = [];
    for (const item of dto.ascents) {
      const route = await this.routeRepo.findOne({
        where: { id: item.routeId },
        relations: ['buttress'],
      });
      if (!route) continue;
      ascents.push(
        this.ascentRepo.create({
          ...item,
          userId,
          cragId: item.cragId || route.buttress?.cragId,
        }),
      );
    }

    await this.ascentRepo.save(ascents);
    const newBadges = await this.badgeEngine.evaluateForUser(userId);
    return { count: ascents.length, newBadges };
  }

  async findAll(userId: string, filter: AscentFilter = {}) {
    const qb = this.ascentRepo
      .createQueryBuilder('a')
      .leftJoinAndSelect('a.route', 'r')
      .leftJoinAndSelect('r.buttress', 'b')
      .leftJoinAndSelect('b.crag', 'c')
      .leftJoinAndSelect('c.region', 'reg')
      .where('a.userId = :userId', { userId })
      .orderBy('a.date', 'DESC')
      .addOrderBy('a.createdAt', 'DESC');

    if (filter.startDate) qb.andWhere('a.date >= :sd', { sd: filter.startDate });
    if (filter.endDate) qb.andWhere('a.date <= :ed', { ed: filter.endDate });
    if (filter.cragId) qb.andWhere('a.cragId = :cragId', { cragId: filter.cragId });
    if (filter.ascentType) qb.andWhere('a.ascentType = :at', { at: filter.ascentType });
    if (filter.climbingType) qb.andWhere('r.climbingType = :ct', { ct: filter.climbingType });

    const total = await qb.getCount();

    qb.limit(filter.limit || 50).offset(filter.offset || 0);

    const ascents = await qb.getMany();
    return { ascents, total };
  }

  async findById(id: string, userId: string): Promise<Ascent> {
    const ascent = await this.ascentRepo.findOne({
      where: { id, userId },
      relations: ['route', 'route.buttress', 'route.buttress.crag', 'crag'],
    });
    if (!ascent) throw new NotFoundException('Ascent not found');
    return ascent;
  }

  async update(id: string, userId: string, data: Partial<CreateAscentDto>): Promise<Ascent> {
    const ascent = await this.ascentRepo.findOne({ where: { id } });
    if (!ascent) throw new NotFoundException('Ascent not found');
    if (ascent.userId !== userId) throw new ForbiddenException();

    await this.ascentRepo.update(id, data as any);
    return this.findById(id, userId);
  }

  async delete(id: string, userId: string): Promise<void> {
    const ascent = await this.ascentRepo.findOne({ where: { id } });
    if (!ascent) throw new NotFoundException('Ascent not found');
    if (ascent.userId !== userId) throw new ForbiddenException();
    await this.ascentRepo.remove(ascent);
  }

  async getForExport(userId: string, startDate?: string, endDate?: string): Promise<Ascent[]> {
    const qb = this.ascentRepo
      .createQueryBuilder('a')
      .leftJoinAndSelect('a.route', 'r')
      .leftJoinAndSelect('r.buttress', 'b')
      .leftJoinAndSelect('b.crag', 'c')
      .leftJoinAndSelect('c.region', 'reg')
      .where('a.userId = :userId', { userId })
      .orderBy('a.date', 'ASC');

    if (startDate) qb.andWhere('a.date >= :sd', { sd: startDate });
    if (endDate) qb.andWhere('a.date <= :ed', { ed: endDate });

    return qb.getMany();
  }
}
