import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Project } from './entities/project.entity';
import { UpsertProjectDto, UpdateProjectDto } from './dto/upsert-project.dto';

@Injectable()
export class ProjectsService {
  constructor(
    @InjectRepository(Project) private repo: Repository<Project>,
  ) {}

  findAll(userId: string): Promise<Project[]> {
    return this.repo.find({
      where: { userId },
      relations: ['route', 'route.buttress', 'route.buttress.crag'],
      order: { createdAt: 'DESC' },
    });
  }

  async add(userId: string, dto: UpsertProjectDto): Promise<Project> {
    const existing = await this.repo.findOne({
      where: { userId, routeId: dto.routeId },
    });
    if (existing) throw new ConflictException('Route already in projects');

    const project = this.repo.create({
      userId,
      routeId: dto.routeId,
      priority: dto.priority ?? 'medium',
      notes: dto.notes ?? null,
    });
    return this.repo.save(project);
  }

  async update(userId: string, id: string, dto: UpdateProjectDto): Promise<Project> {
    const project = await this.repo.findOne({ where: { id, userId } });
    if (!project) throw new NotFoundException('Project not found');

    if (dto.priority !== undefined) project.priority = dto.priority;
    if (dto.notes !== undefined) project.notes = dto.notes;
    if (dto.attempts !== undefined) {
      project.attempts = dto.attempts;
      project.lastAttempted = new Date().toISOString().slice(0, 10);
    }
    return this.repo.save(project);
  }

  async incrementAttempts(userId: string, id: string): Promise<Project> {
    const project = await this.repo.findOne({ where: { id, userId } });
    if (!project) throw new NotFoundException('Project not found');
    project.attempts += 1;
    project.lastAttempted = new Date().toISOString().slice(0, 10);
    return this.repo.save(project);
  }

  async remove(userId: string, id: string): Promise<void> {
    const project = await this.repo.findOne({ where: { id, userId } });
    if (!project) throw new NotFoundException('Project not found');
    await this.repo.remove(project);
  }
}
