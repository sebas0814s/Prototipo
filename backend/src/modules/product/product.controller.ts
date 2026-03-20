import { Request, Response, NextFunction } from 'express';
import { ProductService } from './product.service';
import { successResponse, errorResponse } from '../../shared/utils';

/**
 * HTTP layer for the Product module.
 * Delegates all business logic to ProductService.
 */
export class ProductController {
  private productService: ProductService;

  constructor() {
    this.productService = new ProductService();
  }

  public getAll = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { categoryId, material, minPrice, maxPrice, inStockOnly, page, limit } = req.query;
      const result = await this.productService.findAll({
        categoryId: categoryId as string,
        material: material as never,
        minPrice: minPrice ? Number(minPrice) : undefined,
        maxPrice: maxPrice ? Number(maxPrice) : undefined,
        inStockOnly: inStockOnly === 'true',
        page: page ? Number(page) : 1,
        limit: limit ? Number(limit) : 12,
      });

      res.json({
        ...successResponse(result.items),
        total: result.total,
      });
    } catch (err) {
      next(err);
    }
  };

  public getById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const product = await this.productService.findById(req.params.id);
      if (!product) {
        res.status(404).json(errorResponse('Product not found'));
        return;
      }
      res.json(successResponse(product));
    } catch (err) {
      next(err);
    }
  };

  public create = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const product = await this.productService.create(req.body);
      res.status(201).json(successResponse(product, 'Product created successfully'));
    } catch (err) {
      next(err);
    }
  };

  public update = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const product = await this.productService.update(req.params.id, req.body);
      res.json(successResponse(product, 'Product updated successfully'));
    } catch (err) {
      next(err);
    }
  };

  public delete = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      await this.productService.softDelete(req.params.id);
      res.json(successResponse(null, 'Product deleted successfully'));
    } catch (err) {
      next(err);
    }
  };
}
