import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Kudos } from './entities/kudos.entity';
import { KudosService } from './kudos.service';
import { KudosController } from './kudos.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Kudos])],
  providers: [KudosService],
  controllers: [KudosController],
  exports: [KudosService],
})
export class KudosModule {}
