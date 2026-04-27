import {
  Controller, Post, Get, Body, UseGuards, HttpCode, HttpStatus,
  Req, Res, UnauthorizedException,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { Throttle } from '@nestjs/throttler';
import { Request, Response } from 'express';
import { ConfigService } from '@nestjs/config';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { Public } from '../../common/decorators/public.decorator';

const REFRESH_COOKIE = 'craglog_refresh';
const REFRESH_TTL_MS = 7 * 24 * 60 * 60 * 1000;

@ApiTags('auth')
@Controller('auth')
@UseGuards(JwtAuthGuard)
export class AuthController {
  constructor(
    private authService: AuthService,
    private configService: ConfigService,
  ) {}

  @Post('register')
  @Public()
  @Throttle({ short: { limit: 3, ttl: 60000 }, medium: { limit: 5, ttl: 300000 } })
  @ApiOperation({ summary: 'Register a new climber account' })
  async register(@Body() dto: RegisterDto, @Res({ passthrough: true }) res: Response) {
    const result = await this.authService.register(dto);
    this.setRefreshCookie(res, result.refreshToken);
    const { refreshToken: _rt, ...safe } = result;
    return safe;
  }

  @Post('login')
  @Public()
  @HttpCode(HttpStatus.OK)
  @Throttle({ short: { limit: 5, ttl: 60000 }, medium: { limit: 10, ttl: 300000 } })
  @ApiOperation({ summary: 'Login and receive JWT' })
  async login(@Body() dto: LoginDto, @Res({ passthrough: true }) res: Response) {
    const result = await this.authService.login(dto);
    this.setRefreshCookie(res, result.refreshToken);
    const { refreshToken: _rt, ...safe } = result;
    return safe;
  }

  @Post('refresh')
  @Public()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Refresh access token using httpOnly cookie' })
  async refresh(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
    const token = this.extractRefreshCookie(req);
    if (!token) throw new UnauthorizedException('No refresh token');

    const result = await this.authService.refresh(token);
    this.setRefreshCookie(res, result.refreshToken);
    const { refreshToken: _rt, ...safe } = result;
    return safe;
  }

  @Post('logout')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Logout and clear refresh token cookie' })
  async logout(
    @CurrentUser('id') userId: string,
    @Res({ passthrough: true }) res: Response,
  ) {
    await this.authService.logout(userId);
    res.clearCookie(REFRESH_COOKIE, this.cookieOptions());
  }

  @Get('me')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get current user profile' })
  getProfile(@CurrentUser('id') userId: string) {
    return this.authService.getProfile(userId);
  }

  // ── helpers ────────────────────────────────────────────────────────────────

  private setRefreshCookie(res: Response, token: string) {
    res.cookie(REFRESH_COOKIE, token, {
      ...this.cookieOptions(),
      maxAge: REFRESH_TTL_MS,
    });
  }

  private cookieOptions() {
    const isProd = this.configService.get<string>('env') === 'production';
    return {
      httpOnly: true,
      secure: isProd,
      sameSite: isProd ? ('none' as const) : ('lax' as const),
      path: '/api/auth',
    };
  }

  private extractRefreshCookie(req: Request): string | undefined {
    const header = req.headers['cookie'];
    if (!header) return undefined;
    const match = header.split(';').find((c) => c.trim().startsWith(`${REFRESH_COOKIE}=`));
    return match?.split('=').slice(1).join('=').trim();
  }
}
