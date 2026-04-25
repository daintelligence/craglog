import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Route, GRADE_DIFFICULTY } from './entities/route.entity';

@Injectable()
export class RoutesService {
  constructor(
    @InjectRepository(Route) private routeRepo: Repository<Route>,
  ) {}

  async findByButtress(buttressId: string): Promise<Route[]> {
    return this.routeRepo.find({
      where: { buttressId, isActive: true },
      order: { sortOrder: 'ASC', gradeDifficulty: 'ASC', name: 'ASC' },
    });
  }

  async findById(id: string): Promise<Route> {
    const route = await this.routeRepo.findOne({
      where: { id },
      relations: ['buttress', 'buttress.crag'],
    });
    if (!route) throw new NotFoundException('Route not found');
    return route;
  }

  async search(q: string, limit = 20): Promise<Route[]> {
    return this.routeRepo
      .createQueryBuilder('r')
      .leftJoinAndSelect('r.buttress', 'b')
      .leftJoinAndSelect('b.crag', 'c')
      .where('r.name ILIKE :q', { q: `%${q}%` })
      .andWhere('r.isActive = true')
      .orderBy('r.name', 'ASC')
      .limit(limit)
      .getMany();
  }

  resolveGradeDifficulty(grade: string): number {
    const key = grade.trim();
    if (GRADE_DIFFICULTY[key] !== undefined) return GRADE_DIFFICULTY[key];
    const adjMatch = key.match(/^(E\d+|HVS|VS|HS|S|VD|D|M)/);
    if (adjMatch && GRADE_DIFFICULTY[adjMatch[1]]) return GRADE_DIFFICULTY[adjMatch[1]];
    return 0;
  }
}
