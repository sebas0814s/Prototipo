import jwt from 'jsonwebtoken';
import { db } from '../../config/database';
import { User, UserRow } from './user.model';
import { ENV } from '../../config/env';
import { JwtPayload } from '../../shared/types';

export interface RegisterDto {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  phone?: string;
}

export interface LoginDto {
  email: string;
  password: string;
}

/** Service layer handling authentication and user profile management */
export class UserService {
  public async register(dto: RegisterDto): Promise<{ user: User; token: string }> {
    const existing = await this.findByEmail(dto.email);
    if (existing) throw new Error('Email is already registered');

    const passwordHash = await User.hashPassword(dto.password);
    const user = new User({ ...dto, passwordHash });

    await db.query(
      `INSERT INTO users (id, first_name, last_name, email, password_hash, role, phone)
       VALUES ($1, $2, $3, $4, $5, $6, $7)`,
      [user.id, user.firstName, user.lastName, user.email, passwordHash, user.role, user.phone ?? null]
    );

    const token = this.generateToken(user);
    return { user, token };
  }

  public async login(dto: LoginDto): Promise<{ user: User; token: string }> {
    const user = await this.findByEmail(dto.email);
    if (!user) throw new Error('Invalid email or password');

    const valid = await user.verifyPassword(dto.password);
    if (!valid) throw new Error('Invalid email or password');

    if (!user.isActive) throw new Error('Account is deactivated');

    const token = this.generateToken(user);
    return { user, token };
  }

  public async findById(id: string): Promise<User | null> {
    const rows = await db.query<UserRow>('SELECT * FROM users WHERE id = $1', [id]);
    return rows.length ? User.fromRow(rows[0]) : null;
  }

  public async updateProfile(userId: string, data: Partial<RegisterDto>): Promise<User> {
    const user = await this.findById(userId);
    if (!user) throw new Error('User not found');

    await db.query(
      'UPDATE users SET first_name=$2, last_name=$3, phone=$4, updated_at=NOW() WHERE id=$1',
      [userId, data.firstName ?? user.firstName, data.lastName ?? user.lastName, data.phone ?? user.phone]
    );

    return (await this.findById(userId))!;
  }

  private async findByEmail(email: string): Promise<User | null> {
    const rows = await db.query<UserRow>('SELECT * FROM users WHERE email = $1', [email]);
    return rows.length ? User.fromRow(rows[0]) : null;
  }

  private generateToken(user: User): string {
    const payload: JwtPayload = { userId: user.id, email: user.email, role: user.role };
    return jwt.sign(payload, ENV.JWT_SECRET, { expiresIn: ENV.JWT_EXPIRES_IN as jwt.SignOptions['expiresIn'] });
  }
}
