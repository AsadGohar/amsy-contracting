import { IsNotEmpty, IsNumber, IsOptional } from 'class-validator';
import { Column } from 'typeorm';

export class CreateItemDto {
  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  description: string;

  @IsNumber()
  @IsNotEmpty()
  quantity: number;

  @IsOptional()
  quotation_date: Date;

  @IsOptional()
  payment_date: Date;

  @IsOptional()
  purchase_date: Date;

  @IsOptional()
  in_route_date: Date;

  @IsOptional()
  supplier_name: string;

  @IsOptional()
  price: number;

  @IsOptional()
  price_category: string;

  @IsOptional()
  supplier_contact: string;

  @IsOptional()
  pictures: any[];
}
