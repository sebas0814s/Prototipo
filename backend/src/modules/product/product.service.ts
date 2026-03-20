import { db } from '../../config/database';
import { Furniture, FurnitureMaterial, FurnitureRow, Dimensions } from './product.model';

export interface CreateFurnitureDto {
  name: string;
  description: string;
  material: FurnitureMaterial;
  price: number;
  stock: number;
  categoryId: string;
  dimensions: Dimensions;
  images?: string[];
}

export interface UpdateFurnitureDto extends Partial<CreateFurnitureDto> {}

export interface FurnitureFilters {
  categoryId?: string;
  material?: FurnitureMaterial;
  minPrice?: number;
  maxPrice?: number;
  inStockOnly?: boolean;
  page?: number;
  limit?: number;
}

/**
 * Service layer for all product-related business logic.
 * Orchestrates between the domain model and the data access layer.
 */
export class ProductService {
  /** Retrieve a paginated, filtered list of active products */
  public async findAll(filters: FurnitureFilters = {}): Promise<{ items: Furniture[]; total: number }> {
    const { categoryId, material, minPrice, maxPrice, inStockOnly, page = 1, limit = 12 } = filters;
    const offset = (page - 1) * limit;
    const params: unknown[] = [];
    const conditions: string[] = ['f.is_active = true'];

    if (categoryId) {
      params.push(categoryId);
      conditions.push(`f.category_id = $${params.length}`);
    }
    if (material) {
      params.push(material);
      conditions.push(`f.material = $${params.length}`);
    }
    if (minPrice !== undefined) {
      params.push(minPrice);
      conditions.push(`f.price >= $${params.length}`);
    }
    if (maxPrice !== undefined) {
      params.push(maxPrice);
      conditions.push(`f.price <= $${params.length}`);
    }
    if (inStockOnly) {
      conditions.push('f.stock > 0');
    }

    const where = conditions.join(' AND ');

    params.push(limit, offset);
    const rows = await db.query<FurnitureRow>(
      `SELECT f.* FROM furniture f WHERE ${where} ORDER BY f.created_at DESC LIMIT $${params.length - 1} OFFSET $${params.length}`,
      params
    );

    const countParams = params.slice(0, params.length - 2);
    const [{ count }] = await db.query<{ count: string }>(
      `SELECT COUNT(*) FROM furniture f WHERE ${where}`,
      countParams
    );

    return {
      items: rows.map(Furniture.fromRow),
      total: parseInt(count, 10),
    };
  }

  /** Find a single product by its UUID */
  public async findById(id: string): Promise<Furniture | null> {
    const rows = await db.query<FurnitureRow>('SELECT * FROM furniture WHERE id = $1', [id]);
    if (rows.length === 0) return null;
    return Furniture.fromRow(rows[0]);
  }

  /** Persist a new furniture product */
  public async create(dto: CreateFurnitureDto): Promise<Furniture> {
    const furniture = new Furniture({ ...dto });

    const [row] = await db.query<FurnitureRow>(
      `INSERT INTO furniture
        (id, name, description, material, price, stock, category_id, width_cm, height_cm, depth_cm, images, is_active)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12)
       RETURNING *`,
      [
        furniture.id,
        furniture.name,
        furniture.description,
        furniture.material,
        furniture.price,
        furniture.stock,
        furniture.categoryId,
        furniture.dimensions.widthCm,
        furniture.dimensions.heightCm,
        furniture.dimensions.depthCm,
        furniture.images,
        furniture.isActive,
      ]
    );

    return Furniture.fromRow(row);
  }

  /** Update an existing product; throws 404 if not found */
  public async update(id: string, dto: UpdateFurnitureDto): Promise<Furniture> {
    const existing = await this.findById(id);
    if (!existing) throw new Error(`Product with id "${id}" not found`);

    const updated = new Furniture({
      ...existing,
      ...dto,
      dimensions: dto.dimensions ?? existing.dimensions,
      updatedAt: new Date(),
    });

    const [row] = await db.query<FurnitureRow>(
      `UPDATE furniture
       SET name=$2, description=$3, material=$4, price=$5, stock=$6,
           category_id=$7, width_cm=$8, height_cm=$9, depth_cm=$10, images=$11, updated_at=NOW()
       WHERE id=$1
       RETURNING *`,
      [
        updated.id,
        updated.name,
        updated.description,
        updated.material,
        updated.price,
        updated.stock,
        updated.categoryId,
        updated.dimensions.widthCm,
        updated.dimensions.heightCm,
        updated.dimensions.depthCm,
        updated.images,
      ]
    );

    return Furniture.fromRow(row);
  }

  /** Soft-delete a product by marking it inactive */
  public async softDelete(id: string): Promise<void> {
    const rows = await db.query<FurnitureRow>(
      'UPDATE furniture SET is_active = false, updated_at = NOW() WHERE id = $1 RETURNING id',
      [id]
    );
    if (rows.length === 0) throw new Error(`Product with id "${id}" not found`);
  }
}
