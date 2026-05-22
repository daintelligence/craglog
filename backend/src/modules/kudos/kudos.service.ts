import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Kudos } from './entities/kudos.entity';

@Injectable()
export class KudosService {
  constructor(
    @InjectRepository(Kudos)
    private kudosRepo: Repository<Kudos>,
  ) {}

  async toggle(giverId: string, ascentId: string) {
    const existing = await this.kudosRepo.findOne({
      where: { giverId, ascentId },
    });

    if (existing) {
      await this.kudosRepo.delete(existing.id);
    } else {
      await this.kudosRepo.save(this.kudosRepo.create({ giverId, ascentId }));
    }

    const kudosCount = await this.kudosRepo.count({ where: { ascentId } });
    return { kudosCount, userHasKudos: !existing };
  }

  async getForAscent(ascentId: string, viewerId?: string) {
    const kudosCount = await this.kudosRepo.count({ where: { ascentId } });
    let userHasKudos = false;
    if (viewerId) {
      userHasKudos = !!(await this.kudosRepo.findOne({ where: { giverId: viewerId, ascentId } }));
    }
    return { kudosCount, userHasKudos };
  }
}
