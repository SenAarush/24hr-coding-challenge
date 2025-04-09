import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Product, ProductDocument } from '../schemas/product.schema';
import { CreateProductDto } from './dto/createProduct.dto';
import { UpdateProductDto } from './dto/updateProduct.dto';

@Injectable()
export class ProductsService {
  constructor(
    @InjectModel(Product.name)
    private readonly productModel: Model<ProductDocument>,
  ) {}

  async createProduct(dto: CreateProductDto): Promise<Product> {
    const newProduct = new this.productModel(dto);
    return await newProduct.save();
  }

  async findAllProducts(): Promise<Product[]> {
    return await this.productModel.find().exec();
  }

  async updateProductById(
    id: string,
    dto: UpdateProductDto,
  ): Promise<Product | null> {
    const updated = await this.productModel.findByIdAndUpdate(id, dto, {
      new: true,
    });
    return updated;
  }

  async deleteProductById(id: string): Promise<boolean> {
    const result = await this.productModel.findByIdAndDelete(id);
    return !!result;
  }
}
