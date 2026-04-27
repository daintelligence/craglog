import {
  Controller, Get, Post, Patch, Body, Param, UseGuards,
} from '@nestjs/common';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { FeedbackService } from './feedback.service';
import { CreateFeedbackDto } from './dto/create-feedback.dto';

@ApiTags('feedback')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('feedback')
export class FeedbackController {
  constructor(private service: FeedbackService) {}

  @Post()
  create(@CurrentUser('id') userId: string, @Body() dto: CreateFeedbackDto) {
    return this.service.create(dto, userId);
  }

  @Get('mine')
  findMine(@CurrentUser('id') userId: string) {
    return this.service.findMine(userId);
  }

  @Get()
  findAll() {
    return this.service.findAll();
  }

  @Patch(':id/resolve')
  resolve(@Param('id') id: string) {
    return this.service.resolve(id);
  }
}
