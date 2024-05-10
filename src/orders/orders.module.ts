import { Module } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { OrdersController } from './orders.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Order } from './entities/order.entity';
import { Item } from 'src/items/entities/item.entity';
import { Picture } from 'src/pictures/entities/picture.entity';
import { User } from 'src/users/entities/user.entity';
import { JwtService } from '@nestjs/jwt';
import { FirebaseService } from 'src/notification/firebase.service.utils';

@Module({
  imports: [
    TypeOrmModule.forFeature([Order, Item, Picture, User]),
  ],
  controllers: [OrdersController],
  providers: [OrdersService, JwtService, FirebaseService],
})
export class OrdersModule {}
