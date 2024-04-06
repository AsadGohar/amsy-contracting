import { IsNotEmpty, IsNumber, IsDateString, IsOptional } from 'class-validator';

export class CreateItemDto {
  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  description: string;

  @IsNumber()
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
  price_category: string;

  @IsOptional()
  supplier_contact: string;

  @IsOptional()
  pictures: any[];
}
