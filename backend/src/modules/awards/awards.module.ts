import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserAward } from './entities/user-award.entity';
import { AwardsService } from './awards.service';
import { AwardsController } from './awards.controller';

@Module({
  imports: [TypeOrmModule.forFeature([UserAward])],
  providers: [AwardsService],
  controllers: [AwardsController],
  exports: [AwardsService],
})
export class AwardsModule {}
