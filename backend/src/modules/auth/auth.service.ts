import { Injectable, ConflictException, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { createHash, randomBytes } from 'crypto';
import * as bcrypt from 'bcryptjs';
import { UsersService } from '../users/users.service';
import { InvitesService } from '../invites/invites.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private configService: ConfigService,
    private invitesService: InvitesService,
  ) {}

  async register(dto: RegisterDto) {
    const existing = await this.usersService.findByEmail(dto.email);
    if (existing) throw new ConflictException('Email already registered');

    const { inviteToken, ...userData } = dto;
    const user = await this.usersService.create(userData);

    if (inviteToken) {
      await this.invitesService.markUsed(inviteToken, user.id);
    }

    return this.issueTokens(user.id, user.email, user);
  }

  async login(dto: LoginDto) {
    const user = await this.usersService.findByEmail(dto.email);
    if (!user) throw new UnauthorizedException('Invalid credentials');

    const valid = await user.validatePassword(dto.password);
    if (!valid) throw new UnauthorizedException('Invalid credentials');

    return this.issueTokens(user.id, user.email, user);
  }

  async refresh(rawRefreshToken: string) {
    let payload: { sub: string; email: string };
    try {
      payload = this.jwtService.verify(rawRefreshToken, {
        secret: this.configService.get<string>('jwt.refreshSecret'),
      });
    } catch {
      throw new UnauthorizedException('Invalid refresh token');
    }

    const user = await this.usersService.findById(payload.sub);
    if (!user?.refreshTokenHash) throw new UnauthorizedException('Session expired');

    const incoming = this.hashToken(rawRefreshToken);
    if (incoming !== user.refreshTokenHash) throw new UnauthorizedException('Invalid refresh token');

    return this.issueTokens(user.id, user.email, user);
  }

  async forgotPassword(email: string): Promise<void> {
    const user = await this.usersService.findByEmail(email);
    if (!user) return; // don't reveal whether email exists

    const token = randomBytes(32).toString('hex');
    const expiry = new Date(Date.now() + 60 * 60 * 1000); // 1 hour
    await this.usersService.update(user.id, {
      resetTokenHash: this.hashToken(token),
      resetTokenExpiry: expiry,
    });

    const frontendUrl = this.configService.get<string>('FRONTEND_URL') ?? 'http://localhost:3000';
    const resetUrl = `${frontendUrl}/reset-password?token=${token}`;
    const resendKey = this.configService.get<string>('RESEND_API_KEY');

    if (resendKey) {
      await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: { Authorization: `Bearer ${resendKey}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({
          from: 'CragLog <noreply@craglog.app>',
          to: email,
          subject: 'Reset your CragLog password',
          html: `<p>Hi ${user.name},</p><p>Click below to reset your password. This link expires in 1 hour.</p><p><a href="${resetUrl}" style="background:#9c6b40;color:white;padding:12px 24px;border-radius:8px;text-decoration:none;font-weight:600;">Reset password</a></p><p>If you didn't request this, you can safely ignore this email.</p>`,
        }),
      });
    } else {
      console.log(`[DEV] Password reset link for ${email}: ${resetUrl}`);
    }
  }

  async resetPassword(token: string, newPassword: string): Promise<void> {
    const user = await this.usersService.findByResetToken(this.hashToken(token));
    if (!user || !user.resetTokenExpiry || user.resetTokenExpiry < new Date()) {
      throw new BadRequestException('Invalid or expired reset link');
    }
    const hashed = await bcrypt.hash(newPassword, 12);
    await this.usersService.update(user.id, {
      password: hashed,
      resetTokenHash: null,
      resetTokenExpiry: null,
      refreshTokenHash: null, // invalidate all existing sessions
    });
  }

  async logout(userId: string): Promise<void> {
    await this.usersService.update(userId, { refreshTokenHash: null });
  }

  async getProfile(userId: string) {
    const user = await this.usersService.findById(userId);
    return this.sanitize(user);
  }

  private async issueTokens(userId: string, email: string, user: any) {
    const accessToken = this.signAccessToken(userId, email);
    const refreshToken = this.signRefreshToken(userId, email);

    await this.usersService.update(userId, {
      refreshTokenHash: this.hashToken(refreshToken),
    });

    return {
      accessToken,
      refreshToken,
      user: this.sanitize(user),
    };
  }

  private signAccessToken(userId: string, email: string): string {
    return this.jwtService.sign(
      { sub: userId, email },
      {
        secret: this.configService.get<string>('jwt.secret'),
        expiresIn: this.configService.get<string>('jwt.expiresIn') ?? '15m',
      },
    );
  }

  private signRefreshToken(userId: string, email: string): string {
    return this.jwtService.sign(
      { sub: userId, email },
      {
        secret: this.configService.get<string>('jwt.refreshSecret'),
        expiresIn: this.configService.get<string>('jwt.refreshExpiresIn') ?? '7d',
      },
    );
  }

  private hashToken(token: string): string {
    return createHash('sha256').update(token).digest('hex');
  }

  private sanitize(user: any) {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, refreshTokenHash, ...safe } = user;
    return safe;
  }
}
