import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Crag } from './entities/crag.entity';
import { Buttress } from './entities/buttress.entity';
import { Region } from './entities/region.entity';
import { CragsService } from './crags.service';
import { CragsController } from './crags.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Crag, Buttress, Region])],
  providers: [CragsService],
  controllers: [CragsController],
  exports: [CragsService],
})
export class CragsModule {}
