import { users, type User, type InsertUser } from "@shared/schema";
import bcrypt from 'bcrypt';

// Constants for security configuration
const SALT_ROUNDS = 10;

// modify the interface with any CRUD methods
// you might need

export interface IStorage {
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  validatePassword(user: User, password: string): Promise<boolean>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  currentId: number;

  constructor() {
    this.users = new Map();
    this.currentId = 1;
  }

  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    // Hash the password before storing
    const hashedPassword = await bcrypt.hash(insertUser.password, SALT_ROUNDS);
    
    const id = this.currentId++;
    const user: User = { 
      ...insertUser, 
      id,
      password: hashedPassword // Store the hashed password instead of plaintext 
    };
    
    this.users.set(id, user);
    return user;
  }
  
  /**
   * Validates a password against a user's stored (hashed) password
   * @param user The user object containing the hashed password
   * @param password The plaintext password to validate
   * @returns A promise that resolves to true if the password is valid
   */
  async validatePassword(user: User, password: string): Promise<boolean> {
    return bcrypt.compare(password, user.password);
  }
}

export const storage = new MemStorage();
