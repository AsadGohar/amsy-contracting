import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  UseGuards,
  Request,
  ValidationPipe,
} from '@nestjs/common';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { PartialOrderDto } from './dto/partial-order.dto';
import { AuthGuard } from 'src/guards/auth.guards';

@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post()
  @UseGuards(AuthGuard)
  create(@Body(ValidationPipe) dto: CreateOrderDto, @Request() request) {
    return this.ordersService.create(dto, request.decoded_data.user_id);
  }

  @Post()
  @UseGuards(AuthGuard)
  getOrderByStatus(@Body(ValidationPipe) dto: PartialOrderDto) {
    return this.ordersService.getOrderByStatus(dto);
  }

  @Post()
  @UseGuards(AuthGuard)
  updateStatus(@Body(ValidationPipe) dto: PartialOrderDto) {
    return this.ordersService.getOrderByStatus(dto);
  }

  @Get('all')
  @UseGuards(AuthGuard)
  findAll() {
    return this.ordersService.findAll();
  }

  @Get(':id')
  @UseGuards(AuthGuard)
  findOne(@Param('id') id: string) {
    return this.ordersService.findOne(+id);
  }

  @Get('user/:user_id')
  @UseGuards(AuthGuard)
  findByUserId(@Param('user_id') user_id: string) {
    return this.ordersService.findByUserId(+user_id);
  }
}
