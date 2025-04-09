import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  NotFoundException,
  UseGuards,
} from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/createProduct.dto';
import { UpdateProductDto } from './dto/updateProduct.dto';
import { ApiResponse } from '../../types';
import { jwtGuard } from 'src/auth/jwt.guard';
import { adminGuard } from 'src/auth/admin.guard';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  // Admin
  @UseGuards(jwtGuard, adminGuard)
  @Post()
  async createANewProduct(
    @Body() productData: CreateProductDto,
  ): Promise<ApiResponse<object>> {
    const product = await this.productsService.createProduct(productData);
    return {
      message: 'Product created successfully',
      statusCode: 201,
      data: product,
    };
  }

  @UseGuards(jwtGuard)
  @Get()
  async getAllProducts(): Promise<ApiResponse<object[]>> {
    const products = await this.productsService.findAllProducts();
    return {
      message: 'Products retrieved successfully',
      statusCode: 200,
      data: products,
    };
  }

  // Admin
  @UseGuards(jwtGuard, adminGuard)
  @Put('/:id')
  async updateProductById(
    @Param('id') id: string,
    @Body() updateData: UpdateProductDto,
  ): Promise<ApiResponse<object>> {
    const updated = await this.productsService.updateProductById(
      id,
      updateData,
    );
    if (!updated) throw new NotFoundException('Product not found');

    return {
      message: `Product with ID ${id} updated successfully`,
      statusCode: 200,
      data: updated,
    };
  }

  // Admin
  @UseGuards(jwtGuard, adminGuard)
  @Delete('/:id')
  async deleteProductById(@Param('id') id: string): Promise<ApiResponse<null>> {
    const deleted = await this.productsService.deleteProductById(id);
    if (!deleted) throw new NotFoundException('Product not found');

    return {
      message: `ProductID:: ${id} deleted`,
      statusCode: 200,
      data: null,
    };
  }
}
