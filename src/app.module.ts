import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';

const defaultDbConf = {
    host: 'localhost',
    port: 5432,
    username: 'user',
    password: 'pass',
    database: 'justicket'
}

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot({
        type: 'postgres',
        host: process.env.DB_HOST || defaultDbConf.host,
        port: parseInt(process.env.DB_PORT) || defaultDbConf.port,
        username: process.env.DB_USER || defaultDbConf.username,
        password: process.env.DB_PASSWORD || defaultDbConf.password,
        database: process.env.DB_NAME || defaultDbConf.database,
        entities: [],
        synchronize: process.env.DB_SYNC === 'true',
      }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
