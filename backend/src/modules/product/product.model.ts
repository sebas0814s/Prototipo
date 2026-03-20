import { v4 as uuidv4 } from 'uuid';

/** Allowed materials for a custom furniture piece */
export type FurnitureMaterial = 'wood' | 'metal' | 'glass' | 'fabric' | 'leather' | 'mixed';

/** Three-dimensional measurements in centimeters */
export interface Dimensions {
  widthCm: number;
  heightCm: number;
  depthCm: number;
}

/** Raw data shape returned from the database */
export interface FurnitureRow {
  id: string;
  name: string;
  description: string;
  material: FurnitureMaterial;
  price: number;
  stock: number;
  category_id: string;
  width_cm: number;
  height_cm: number;
  depth_cm: number;
  images: string[];
  is_active: boolean;
  created_at: Date;
  updated_at: Date;
}

/**
 * Domain entity representing a customizable furniture product.
 * Encapsulates business rules such as stock validation and price formatting.
 */
export class Furniture {
  public readonly id: string;
  public name: string;
  public description: string;
  public material: FurnitureMaterial;
  public price: number;
  public stock: number;
  public categoryId: string;
  public dimensions: Dimensions;
  public images: string[];
  public isActive: boolean;
  public readonly createdAt: Date;
  public updatedAt: Date;

  constructor(params: {
    id?: string;
    name: string;
    description: string;
    material: FurnitureMaterial;
    price: number;
    stock: number;
    categoryId: string;
    dimensions: Dimensions;
    images?: string[];
    isActive?: boolean;
    createdAt?: Date;
    updatedAt?: Date;
  }) {
    this.id = params.id ?? uuidv4();
    this.name = params.name;
    this.description = params.description;
    this.material = params.material;
    this.price = params.price;
    this.stock = params.stock;
    this.categoryId = params.categoryId;
    this.dimensions = params.dimensions;
    this.images = params.images ?? [];
    this.isActive = params.isActive ?? true;
    this.createdAt = params.createdAt ?? new Date();
    this.updatedAt = params.updatedAt ?? new Date();
  }

  /** Returns true when at least one unit is available for purchase */
  public isInStock(): boolean {
    return this.stock > 0;
  }

  /** Decrements stock after a successful order; throws if insufficient */
  public reserveStock(quantity: number): void {
    if (quantity > this.stock) {
      throw new Error(
        `Insufficient stock for "${this.name}". Available: ${this.stock}, requested: ${quantity}.`
      );
    }
    this.stock -= quantity;
    this.updatedAt = new Date();
  }

  /** Returns price formatted as currency string */
  public getFormattedPrice(currency = 'COP'): string {
    return new Intl.NumberFormat('es-CO', { style: 'currency', currency }).format(this.price);
  }

  /** Hydrates a domain entity from a raw database row */
  public static fromRow(row: FurnitureRow): Furniture {
    return new Furniture({
      id: row.id,
      name: row.name,
      description: row.description,
      material: row.material,
      price: Number(row.price),
      stock: row.stock,
      categoryId: row.category_id,
      dimensions: {
        widthCm: Number(row.width_cm),
        heightCm: Number(row.height_cm),
        depthCm: Number(row.depth_cm),
      },
      images: row.images ?? [],
      isActive: row.is_active,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    });
  }

  /** Serializes the entity to a plain object for API responses */
  public toJSON(): Record<string, unknown> {
    return {
      id: this.id,
      name: this.name,
      description: this.description,
      material: this.material,
      price: this.price,
      stock: this.stock,
      categoryId: this.categoryId,
      dimensions: this.dimensions,
      images: this.images,
      isActive: this.isActive,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
  }
}
