import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Feedback } from './entities/feedback.entity';
import { CreateFeedbackDto } from './dto/create-feedback.dto';

@Injectable()
export class FeedbackService {
  constructor(
    @InjectRepository(Feedback) private repo: Repository<Feedback>,
  ) {}

  create(dto: CreateFeedbackDto, userId?: string): Promise<Feedback> {
    const feedback = this.repo.create({
      ...dto,
      userId: userId ?? null,
    });
    return this.repo.save(feedback);
  }

  findAll(): Promise<Feedback[]> {
    return this.repo.find({
      order: { createdAt: 'DESC' },
      relations: ['user'],
    });
  }

  async resolve(id: string): Promise<void> {
    await this.repo.update(id, { resolved: true });
  }
}
