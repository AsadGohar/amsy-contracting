import { IsNotEmpty, IsDateString, IsEnum, IsOptional, IsArray } from 'class-validator';
import { CreateItemDto } from 'src/items/dto/create-item.dto';

export class CreateOrderDto {
  @IsDateString()
  delivery_date: Date;

  @IsNotEmpty()
  project_name: string;

  @IsNotEmpty()
  delivery_address: string;

  @IsNotEmpty()
  @IsEnum(['single', 'complete'])
  order_type: string;

  @IsOptional()
  @IsEnum(['denied', 'approved', 'inprogress'])
  status: string;

  @IsOptional()
  note: string;

  @IsArray()
  items: CreateItemDto[];
}
