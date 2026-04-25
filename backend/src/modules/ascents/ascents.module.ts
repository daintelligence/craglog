import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Ascent } from './entities/ascent.entity';
import { Route } from '../routes/entities/route.entity';
import { AscentsService } from './ascents.service';
import { AscentsController } from './ascents.controller';
import { BadgesModule } from '../badges/badges.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Ascent, Route]),
    BadgesModule,
  ],
  providers: [AscentsService],
  controllers: [AscentsController],
  exports: [AscentsService],
})
export class AscentsModule {}
