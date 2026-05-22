import {
  Controller, Patch, Post, Get, Body, Param, UseGuards,
  HttpCode, HttpStatus, BadRequestException, UnauthorizedException,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import * as bcrypt from 'bcryptjs';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { UsersService } from './users.service';

@ApiTags('users')
@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  /** Public — no auth required */
  @Get('profile/:username')
  @ApiOperation({ summary: 'Get public profile by username' })
  async publicProfile(@Param('username') username: string) {
    return this.usersService.getPublicProfile(username);
  }

  @Patch('me')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update own profile' })
  async updateProfile(
    @CurrentUser('id') userId: string,
    @Body() body: { name?: string; bio?: string; avatarUrl?: string; username?: string; isPublic?: boolean },
  ) {
    const updates: Record<string, any> = {};
    if (body.name      !== undefined) updates.name      = body.name.trim();
    if (body.bio       !== undefined) updates.bio       = body.bio.trim();
    if (body.avatarUrl !== undefined) updates.avatarUrl = body.avatarUrl;
    if (body.username  !== undefined) updates.username  = body.username.trim().toLowerCase();
    if (body.isPublic  !== undefined) updates.isPublic  = body.isPublic;
    if (!Object.keys(updates).length) return this.usersService.findById(userId);
    return this.usersService.update(userId, updates);
  }

  @Post('me/password')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Change own password' })
  async changePassword(
    @CurrentUser('id') userId: string,
    @Body() body: { currentPassword: string; newPassword: string },
  ) {
    if (!body.currentPassword || !body.newPassword)
      throw new BadRequestException('currentPassword and newPassword are required');
    if (body.newPassword.length < 8)
      throw new BadRequestException('New password must be at least 8 characters');

    const user = await this.usersService.findById(userId);
    const valid = await bcrypt.compare(body.currentPassword, user.password);
    if (!valid) throw new UnauthorizedException('Current password is incorrect');

    const hash = await bcrypt.hash(body.newPassword, 12);
    await this.usersService.update(userId, { password: hash });
  }
}
