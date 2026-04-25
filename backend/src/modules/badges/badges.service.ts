import { Injectable } from '@nestjs/common';
import { BadgeEngineService } from './badge-engine.service';

@Injectable()
export class BadgesService {
  constructor(private engine: BadgeEngineService) {}

  getUserBadges(userId: string) {
    return this.engine.getUserBadges(userId);
  }

  getAllBadges() {
    return this.engine.getAllBadges();
  }
}
