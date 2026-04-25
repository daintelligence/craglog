import { Module } from '@nestjs/common';
import { ExportService } from './export.service';
import { ExportController } from './export.controller';
import { AscentsModule } from '../ascents/ascents.module';

@Module({
  imports: [AscentsModule],
  providers: [ExportService],
  controllers: [ExportController],
})
export class ExportModule {}
