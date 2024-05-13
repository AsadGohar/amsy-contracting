import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  UseInterceptors,
  UploadedFiles,
  Request,
} from '@nestjs/common';
import { ItemsService } from './items.service';
import { CreateItemDto } from './dto/create-item.dto';
import { UpdateItemDto } from './dto/update-item.dto';
import { AuthGuard } from 'src/guards/auth.guards';
import { AnyFilesInterceptor } from '@nestjs/platform-express';
import { formDataToJson } from 'src/utils/form.utils';
@Controller('items')
export class ItemsController {
  constructor(private readonly itemsService: ItemsService) {}

  @Post()
  @UseGuards(AuthGuard)
  @UseInterceptors(AnyFilesInterceptor())
  create(
    @Body() createItemDto: CreateItemDto,
    @UploadedFiles() files: Array<Express.Multer.File>,
  ) {
    return this.itemsService.create(createItemDto, files);
  }

  @Get()
  @UseGuards(AuthGuard)
  findAll() {
    return this.itemsService.findAll();
  }

  @Get(':id')
  @UseGuards(AuthGuard)
  findOne(@Param('id') id: string) {
    return this.itemsService.findOne(+id);
  }

  @Patch(':id')
  @UseGuards(AuthGuard)
  update(@Param('id') id: string, @Body('data') data: any) {

    const {quotation_date,payment_date, purchase_date, in_route_date, supplier_name, price,
      price_category, supplier_contact} = data
    // return this.itemsService.update(+id, updateItemDto);
    console.log(data, 'dass');
    // const new_data: any = formDataToJson(data);
    // console.log(new_data)
    return this.itemsService.addProcurementPicsToItem(+id, data.pictures, {quotation_date,payment_date, purchase_date, in_route_date, supplier_name, price,
      price_category, supplier_contact});
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.itemsService.remove(+id);
  }

  @Post('add/procurement')
  @UseGuards(AuthGuard)
  add(@Body('data') data: any) {
    const new_data: any = formDataToJson(data);

    console.log(new_data);
    // const separatedFiles = {};

    // new_data.items_pictures.forEach((file) => {
    //   const fieldName = file.fieldname;
    //   const match = fieldName.match(/^items-pictures-\d+$/);
    //   if (match && match.length === 1) {
    //     const itemIndex = parseInt(match.index, 10);
    //     if (!separatedFiles[itemIndex]) {
    //       separatedFiles[itemIndex] = [];
    //     }
    //     separatedFiles[itemIndex].push(file);
    //   }
    // });

    // return this.itemsService.addProcurementPicsToItem(
    //   new_data.item_id,
    //   separatedFiles,
    // );
  }
}
