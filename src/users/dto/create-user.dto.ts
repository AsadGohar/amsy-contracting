import { IsNotEmpty, IsEmail, IsEnum, IsOptional } from 'class-validator';

export class CreateUserDto {
  @IsNotEmpty()
  name: string;

  @IsEmail()
  email: string;

  @IsNotEmpty()
  password: string;

  @IsNotEmpty()
  phone_number: string;

  @IsNotEmpty()
  location: string;

  @IsOptional()
  profile_picture_url: string;

  @IsEnum(['procurement', 'engineer'])
  role: string;
}
