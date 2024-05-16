import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  UseGuards,
  Request,
  ValidationPipe,
  StreamableFile, Res
} from '@nestjs/common';
import { OrdersService } from './orders.service';
import { PartialOrderDto } from './dto/partial-order.dto';
import { AuthGuard } from 'src/guards/auth.guards';
import { formDataToJson } from 'src/utils/form.utils';
import { createReadStream } from 'fs';
import { join } from 'path';
import type { Response } from 'express';
import * as path from 'path';

@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post('new')
  @UseGuards(AuthGuard)
  create(@Body('data') data: any, @Request() request) {
    const new_data: any = formDataToJson(data);
    const separatedFiles = {};

    new_data.items_pictures.forEach((file) => {
      const fieldName = file.fieldname;
      const match = fieldName.match(/^items-pictures-\d+$/);
      if (match && match.length === 1) {
        const itemIndex = parseInt(match.index, 10);
        if (!separatedFiles[itemIndex]) {
          separatedFiles[itemIndex] = [];
        }
        separatedFiles[itemIndex].push(file);
      }
    });

    return this.ordersService.create(
      {
        delivery_date: new_data.delivery_date,
        project_name: new_data.project_name,
        delivery_address: new_data.delivery_address,
        note: new_data.note,
        items: new_data.items,
      },
      request.decoded_data.user_id,
      separatedFiles,
    );
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

  @Get('file')
  async generateCsv(@Res() res: Response){
    const filePath = path.join(__dirname, '../../', 'data.csv');

    await this.ordersService.generateCsvFile()

    res.download(filePath, (err) => {
      if (err) {
        console.error('Error downloading file:', err);
        res.status(500).send('Error downloading file');
      }
    });
  }

  @Post('update/:id')
  @UseGuards(AuthGuard)
  async updateOrder(
    @Param('id') id: string,
    @Body(ValidationPipe) updateOrderDto: PartialOrderDto,
    @Request() request
  ) {
    const orderId = parseInt(id, 10);
    return this.ordersService.update(orderId, updateOrderDto, request.decoded_data.user_id);
  }

  @Get('user/:user_id')
  @UseGuards(AuthGuard)
  findByUserId(@Param('user_id') user_id: string) {
    return this.ordersService.findByUserId(+user_id);
  }

  @Get(':id')
  @UseGuards(AuthGuard)
  findOne(@Param('id') id: string) {
    return this.ordersService.findOne(+id);
  }
  
}