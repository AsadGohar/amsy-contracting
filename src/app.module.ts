import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { OrdersModule } from './orders/orders.module';
import { ItemsModule } from './items/items.module';
import { PicturesModule } from './pictures/pictures.module';

@Module({
  imports: [UsersModule, OrdersModule, ItemsModule, PicturesModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
