import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserBadge } from './entities/user-badge.entity';
import { BadgesService } from './badges.service';
import { BadgesController } from './badges.controller';
import { BadgeEngineService } from './badge-engine.service';

@Module({
  imports: [TypeOrmModule.forFeature([UserBadge])],
  providers: [BadgesService, BadgeEngineService],
  controllers: [BadgesController],
  exports: [BadgeEngineService],
})
export class BadgesModule {}
