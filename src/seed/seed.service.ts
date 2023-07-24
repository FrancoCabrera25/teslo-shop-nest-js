import { Injectable } from '@nestjs/common';
import { ProductsService } from '../products/products.service';
import { initialData } from './data/seed-tada';

@Injectable()
export class SeedService {
  constructor(private readonly productService: ProductsService) {}

  async runSeed() {
    this.insertNewProducts();
    return 'SEED EXECUTED';
  }

  private async insertNewProducts() {
    try {
      await this.productService.deleteAllProducts();

      const products = initialData.products;

      const insertPromises = [];
      products.forEach((product) => {
        insertPromises.push(this.productService.create(product));
      });

      await Promise.all(insertPromises);
    } catch (error) {}
    return true;
  }
}
