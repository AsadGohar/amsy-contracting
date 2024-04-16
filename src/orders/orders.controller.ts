import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  UseGuards,
  Request,
  ValidationPipe,
  UseInterceptors,
  UploadedFiles,
} from '@nestjs/common';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { PartialOrderDto } from './dto/partial-order.dto';
import { AuthGuard } from 'src/guards/auth.guards';
import { AnyFilesInterceptor } from '@nestjs/platform-express';

@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post()
  @UseGuards(AuthGuard)
  @UseInterceptors(AnyFilesInterceptor())
  create(
    @Body(new ValidationPipe()) dto: CreateOrderDto,
    @UploadedFiles() files: Array<Express.Multer.File>,
    @Request() request,
  ) {
    const separatedFiles: { [key: number]: Express.Multer.File[] } = {};

    files.forEach((file) => {
      const fieldName = file.fieldname;
      const match = fieldName.match(/items-picture-(\d+)/);
      if (match && match.length === 2) {
        const itemIndex = parseInt(match[1], 10);
        if (!separatedFiles[itemIndex]) {
          separatedFiles[itemIndex] = [];
        }
        separatedFiles[itemIndex].push(file);
      }
    });

    return this.ordersService.create(
      dto,
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
