import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ThrottlerModule } from '@nestjs/throttler';
import { CacheModule } from '@nestjs/cache-manager';
import { LoggerModule } from 'nestjs-pino';
import configuration, { validationSchema } from './config/configuration';
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { CragsModule } from './modules/crags/crags.module';
import { RoutesModule } from './modules/routes/routes.module';
import { AscentsModule } from './modules/ascents/ascents.module';
import { GeoModule } from './modules/geo/geo.module';
import { BadgesModule } from './modules/badges/badges.module';
import { StatsModule } from './modules/stats/stats.module';
import { ExportModule } from './modules/export/export.module';
import { HealthModule } from './modules/health/health.module';
import { ProjectsModule } from './modules/projects/projects.module';
import { FeedbackModule } from './modules/feedback/feedback.module';
import { InvitesModule } from './modules/invites/invites.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
      validationSchema,
    }),

    LoggerModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        pinoHttp: {
          level: config.get('env') === 'production' ? 'info' : 'debug',
          transport:
            config.get('env') !== 'production'
              ? { target: 'pino-pretty', options: { colorize: true, singleLine: true } }
              : undefined,
          serializers: {
            req: (req: any) => ({ method: req.method, url: req.url }),
            res: (res: any) => ({ statusCode: res.statusCode }),
          },
          redact: ['req.headers.authorization'],
        },
      }),
    }),

    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: 'postgres',
        url: config.get<string>('database.url'),
        entities: [__dirname + '/modules/**/*.entity{.ts,.js}'],
        // TYPEORM_SYNC=true enables synchronize for first-deploy schema creation
        synchronize:
          config.get<string>('env') !== 'production' ||
          process.env.TYPEORM_SYNC === 'true',
        logging: false,
        extra: { max: 20 },
      }),
    }),

    CacheModule.register({
      isGlobal: true,
      ttl: 60 * 1000,
      max: 100,
    }),

    ThrottlerModule.forRoot([
      { name: 'short', ttl: 1000, limit: 10 },
      { name: 'medium', ttl: 10000, limit: 50 },
      { name: 'long', ttl: 60000, limit: 200 },
    ]),

    AuthModule,
    UsersModule,
    CragsModule,
    RoutesModule,
    AscentsModule,
    GeoModule,
    BadgesModule,
    StatsModule,
    ExportModule,
    HealthModule,
    ProjectsModule,
    FeedbackModule,
    InvitesModule,
  ],
})
export class AppModule {}
