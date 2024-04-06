import { Module } from '@nestjs/common';
import { ItemsService } from './items.service';
import { ItemsController } from './items.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Order } from 'src/orders/entities/order.entity';
import { Picture } from 'src/pictures/entities/picture.entity';
import { User } from 'src/users/entities/user.entity';
import { JwtService } from '@nestjs/jwt';
import { Item } from './entities/item.entity';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { ConfigService } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';

@Module({
  imports: [
    ThrottlerModule.forRootAsync({
      useFactory: (configService: ConfigService) => ({
        throttlers: [
          {
            ttl: configService.getOrThrow('UPLOAD_RATE_TTL'),
            limit: configService.getOrThrow('UPLOAD_RATE_LIMIT'),
          },
        ],
      }),
      inject: [ConfigService],
    }),
    TypeOrmModule.forFeature([Order, Item, Picture, User]),
  ],
  controllers: [ItemsController],
  providers: [
    ItemsService,
    JwtService,
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class ItemsModule {}
