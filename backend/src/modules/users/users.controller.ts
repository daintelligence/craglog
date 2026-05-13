import {
  Controller, Patch, Post, Body, UseGuards, HttpCode, HttpStatus,
  BadRequestException, UnauthorizedException,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import * as bcrypt from 'bcryptjs';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { UsersService } from './users.service';

@ApiTags('users')
@Controller('users')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Patch('me')
  @ApiOperation({ summary: 'Update own profile (name, bio)' })
  async updateProfile(
    @CurrentUser('id') userId: string,
    @Body() body: { name?: string; bio?: string },
  ) {
    const updates: Record<string, any> = {};
    if (body.name !== undefined) updates.name = body.name.trim();
    if (body.bio  !== undefined) updates.bio  = body.bio.trim();
    if (!Object.keys(updates).length) return this.usersService.findById(userId);
    return this.usersService.update(userId, updates);
  }

  @Post('me/password')
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
