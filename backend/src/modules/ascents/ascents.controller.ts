import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiQuery } from '@nestjs/swagger';
import { AscentsService } from './ascents.service';
import { CreateAscentDto, BulkCreateAscentDto } from './dto/create-ascent.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';

@ApiTags('ascents')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('ascents')
export class AscentsController {
  constructor(private ascentsService: AscentsService) {}

  @Post()
  @ApiOperation({ summary: 'Log a new ascent — returns earned badges' })
  create(@CurrentUser('id') userId: string, @Body() dto: CreateAscentDto) {
    return this.ascentsService.create(userId, dto);
  }

  @Post('bulk')
  @ApiOperation({ summary: 'Sync offline ascent queue — bulk create' })
  bulkCreate(@CurrentUser('id') userId: string, @Body() dto: BulkCreateAscentDto) {
    return this.ascentsService.bulkCreate(userId, dto);
  }

  @Get()
  @ApiOperation({ summary: 'Get climbing log with filters' })
  @ApiQuery({ name: 'startDate', required: false })
  @ApiQuery({ name: 'endDate', required: false })
  @ApiQuery({ name: 'cragId', required: false })
  @ApiQuery({ name: 'ascentType', required: false })
  @ApiQuery({ name: 'climbingType', required: false })
  @ApiQuery({ name: 'limit', required: false })
  @ApiQuery({ name: 'offset', required: false })
  findAll(
    @CurrentUser('id') userId: string,
    @Query() filter: any,
  ) {
    return this.ascentsService.findAll(userId, filter);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get single ascent' })
  findById(@CurrentUser('id') userId: string, @Param('id') id: string) {
    return this.ascentsService.findById(id, userId);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update ascent' })
  update(
    @CurrentUser('id') userId: string,
    @Param('id') id: string,
    @Body() dto: Partial<CreateAscentDto>,
  ) {
    return this.ascentsService.update(id, userId, dto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete ascent' })
  delete(@CurrentUser('id') userId: string, @Param('id') id: string) {
    return this.ascentsService.delete(id, userId);
  }
}
