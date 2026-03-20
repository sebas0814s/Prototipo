import { v4 as uuidv4 } from 'uuid';
import bcrypt from 'bcryptjs';
import { UserRole } from '../../shared/types';

export interface UserAddress {
  street: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
}

export interface UserRow {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  password_hash: string;
  role: UserRole;
  phone?: string;
  address?: UserAddress;
  is_active: boolean;
  created_at: Date;
  updated_at: Date;
}

/**
 * Domain entity representing a user account.
 * Keeps password hashing logic contained within the entity.
 */
export class User {
  public readonly id: string;
  public firstName: string;
  public lastName: string;
  public email: string;
  private passwordHash: string;
  public role: UserRole;
  public phone?: string;
  public address?: UserAddress;
  public isActive: boolean;
  public readonly createdAt: Date;
  public updatedAt: Date;

  constructor(params: {
    id?: string;
    firstName: string;
    lastName: string;
    email: string;
    passwordHash: string;
    role?: UserRole;
    phone?: string;
    address?: UserAddress;
    isActive?: boolean;
    createdAt?: Date;
    updatedAt?: Date;
  }) {
    this.id = params.id ?? uuidv4();
    this.firstName = params.firstName;
    this.lastName = params.lastName;
    this.email = params.email;
    this.passwordHash = params.passwordHash;
    this.role = params.role ?? 'customer';
    this.phone = params.phone;
    this.address = params.address;
    this.isActive = params.isActive ?? true;
    this.createdAt = params.createdAt ?? new Date();
    this.updatedAt = params.updatedAt ?? new Date();
  }

  public get fullName(): string {
    return `${this.firstName} ${this.lastName}`;
  }

  /** Hashes a plain-text password using bcrypt */
  public static async hashPassword(plainPassword: string): Promise<string> {
    return bcrypt.hash(plainPassword, 12);
  }

  /** Compares a candidate password against the stored hash */
  public async verifyPassword(candidate: string): Promise<boolean> {
    return bcrypt.compare(candidate, this.passwordHash);
  }

  public static fromRow(row: UserRow): User {
    return new User({
      id: row.id,
      firstName: row.first_name,
      lastName: row.last_name,
      email: row.email,
      passwordHash: row.password_hash,
      role: row.role,
      phone: row.phone,
      address: row.address,
      isActive: row.is_active,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    });
  }

  /** Returns safe user data — password hash is never exposed */
  public toPublicJSON(): Record<string, unknown> {
    return {
      id: this.id,
      firstName: this.firstName,
      lastName: this.lastName,
      fullName: this.fullName,
      email: this.email,
      role: this.role,
      phone: this.phone,
      address: this.address,
      isActive: this.isActive,
      createdAt: this.createdAt,
    };
  }
}
