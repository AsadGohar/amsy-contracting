import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { OrdersModule } from './orders/orders.module';
import { ItemsModule } from './items/items.module';
import { PicturesModule } from './pictures/pictures.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './users/entities/user.entity';
import { Item } from './items/entities/item.entity';
import { Order } from './orders/entities/order.entity';
import { Picture } from './pictures/entities/picture.entity';
import { ConfigModule } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { FirebaseService } from './notification/firebase.service.utils';
@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT, 10),
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_DATABASE,
      entities: [User, Order, Item, Picture],
      synchronize: true,
      // ssl: false,
      ssl:{
        rejectUnauthorized:false
      },
    }),
    UsersModule,
    OrdersModule,
    ItemsModule,
    PicturesModule,
  ],
  controllers: [AppController],
  providers: [AppService, JwtService, FirebaseService],
})
export class AppModule {}
