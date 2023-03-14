import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TezosModule } from './tezos/tezos.module';
import { ShowModule } from './show/show.module';
import { AdminModule } from './admin/admin.module';
import { Admin } from './admin/admin.entity';
import { Show } from './show/show.entity';

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
        entities: [
            Admin,
            Show
        ],
        synchronize: process.env.DB_SYNC === 'true',
      }),
    TezosModule,
    ShowModule,
    AdminModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
