import {
  Controller, Get, Post, Delete, Body, Param, UseGuards, HttpCode, HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { Public } from '../../common/decorators/public.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { InvitesService } from './invites.service';
import { CreateInviteDto } from './dto/create-invite.dto';

@ApiTags('invites')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('invites')
export class InvitesController {
  constructor(private service: InvitesService) {}

  @Post()
  @ApiOperation({ summary: 'Create an invite link (admin only)' })
  create(
    @Body() dto: CreateInviteDto,
    @CurrentUser('id') userId: string,
  ) {
    return this.service.create(dto, userId);
  }

  @Get()
  @ApiOperation({ summary: 'List your invites' })
  findAll(@CurrentUser('id') userId: string) {
    return this.service.findAll(userId);
  }

  @Get('validate/:token')
  @Public()
  @ApiOperation({ summary: 'Check if an invite token is valid' })
  validate(@Param('token') token: string) {
    return this.service.validate(token);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Revoke an invite' })
  revoke(@Param('id') id: string, @CurrentUser('id') userId: string) {
    return this.service.revoke(id, userId);
  }
}
