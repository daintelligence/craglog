import {
  Controller, Get, Post, Patch, Body, Param, UseGuards, Request,
} from '@nestjs/common';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { Public } from '../../common/decorators/public.decorator';
import { FeedbackService } from './feedback.service';
import { CreateFeedbackDto } from './dto/create-feedback.dto';

@ApiTags('feedback')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('feedback')
export class FeedbackController {
  constructor(private service: FeedbackService) {}

  @Public()
  @Post()
  create(@Body() dto: CreateFeedbackDto, @Request() req: any) {
    const userId: string | undefined = req.user?.id;
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
