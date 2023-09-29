import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

import config from '@config/config';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [config],
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'mysql',
        host: configService.get('database.host'),
        port: configService.get('database.port'),
        username: configService.get('database.username'),
        password: configService.get('database.password'),
        database: configService.get('database.db'),
        entities: [
          configService.get('appEnv') === 'test'
            ? 'src/modules/**/entities/*.entity.ts'
            : 'dist/modules/**/entities/*.entity.js',
        ],
        logging: 'all',
        synchronize: false,
        autoLoadEntities: true,
        charset: 'utf8mb4_general_ci',
        supportBigNumbers: true,
        bigNumberStrings: false,
      }),
      inject: [ConfigService],
    }),
  ],
  providers: [],
})
export class SharedModule {}
