import { IsNotEmpty, IsNumber, IsPositive, IsString } from 'class-validator';

export class CreateProductDto {
  @IsString({ message: 'Name must be a string' })
  @IsNotEmpty({ message: 'Name is required' })
  name: string;

  @IsString({ message: 'Description must be a string' })
  @IsNotEmpty({ message: 'Description is required' })
  desc: string;

  // @IsArray({ message: 'Category must be an array' })
  @IsString({ message: 'Category must be a string' })
  category: string;

  @IsNumber({}, { message: 'Price must be a number' })
  @IsPositive({ message: 'Price must be a positive number' })
  price: number;

  @IsNumber({}, { message: 'Rating must be a number' })
  @IsPositive({ message: 'Rating must be a positive number' })
  rating: number;
}
