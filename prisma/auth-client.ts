import 'dotenv/config';
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import bcrypt from 'bcrypt';
import logger from '../logger';

// Create Prisma client with adapter
const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

// Enhanced user methods with password hashing
class AuthClient {
  private client: PrismaClient;

  constructor() {
    this.client = prisma;
  }

  // Hash password before creating user
  async createUserWithHash(userData: {
    email: string;
    nombre: string;
    contraseña: string;
    admin?: boolean;
  }) {
    const hashedPassword = await bcrypt.hash(userData.contraseña, 10);
    
    try {
      const user = await this.client.usuario.create({
        data: {
          email: userData.email,
          nombre: userData.nombre,
          contraseña: hashedPassword,
          admin: userData.admin || false
        }
      });
      
      logger.info(`User created: ${user.email}`);
      return user;
    } catch (error: any) {
      logger.error('Error creating user:', error);
      throw new Error(`Failed to create user: ${error.message}`);
    }
  }

  // Alias for createUserWithHash for backward compatibility
  async createUser(userData: {
    email: string;
    nombre: string;
    contraseña: string;
    admin?: boolean;
  }) {
    return this.createUserWithHash(userData);
  }

  // Verify user credentials
  async verifyUser(email: string, contraseña: string) {
    try {
      const user = await this.client.usuario.findUnique({
        where: { email }
      });

      if (!user) {
        throw new Error('User not found');
      }

      const isValidPassword = await bcrypt.compare(contraseña, user.contraseña);
      
      if (!isValidPassword) {
        throw new Error('Invalid password');
      }

      logger.info(`User authenticated: ${user.email}`);
      return user;
    } catch (error: any) {
      logger.error(`Authentication failed for ${email}:`, error);
      throw error;
    }
  }

  // Update user password
  async updateUserPassword(email: string, newPassword: string) {
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    
    try {
      const user = await this.client.usuario.update({
        where: { email },
        data: { contraseña: hashedPassword }
      });
      
      logger.info(`Password updated for user: ${email}`);
      return user;
    } catch (error: any) {
      logger.error('Error updating password:', error);
      throw new Error(`Failed to update password: ${error.message}`);
    }
  }

  // Get user by email (without password)
  async getUserByEmail(email: string) {
    try {
      const user = await this.client.usuario.findUnique({
        where: { email },
        select: {
          email: true,
          nombre: true,
          admin: true,
          contraseña: false // Never return password
        }
      });

      return user;
    } catch (error: any) {
      logger.error('Error getting user by email:', error);
      throw new Error(`Failed to get user: ${error.message}`);
    }
  }

  // Access to original Prisma client methods
  get usuario() {
    return this.client.usuario;
  }

  get producto() {
    return this.client.producto;
  }

  // Expose other methods as needed
  async $disconnect() {
    return this.client.$disconnect();
  }
}

// Export the enhanced auth client
const authClient = new AuthClient();

export default authClient;
