import { eq, and, sql, like, SQL } from "drizzle-orm";
import { getDb } from "coze-coding-dev-sdk";
import { users, insertUserSchema } from "./shared/schema";
import type { User, InsertUser } from "./shared/schema";
import { hashPassword } from "@/lib/auth-utils";

export class UserManager {
  /**
   * 创建用户
   */
  async createUser(data: InsertUser): Promise<User> {
    const db = await getDb();
    const validated = insertUserSchema.parse({
      ...data,
      password: hashPassword(data.password),
    });
    const [user] = await db.insert(users).values(validated).returning();
    return user;
  }

  /**
   * 获取用户列表
   */
  async getUsers(options: {
    skip?: number;
    limit?: number;
    filters?: Partial<Pick<User, "id" | "username" | "email" | "role">>;
    search?: string;
  } = {}): Promise<User[]> {
    const { skip = 0, limit = 100, filters = {}, search } = options;
    const db = await getDb();

    const conditions: SQL[] = [];

    if (filters.id !== undefined) {
      conditions.push(eq(users.id, filters.id));
    }
    if (filters.username !== undefined) {
      conditions.push(eq(users.username, filters.username));
    }
    if (filters.email !== undefined) {
      conditions.push(eq(users.email, filters.email));
    }
    if (filters.role !== undefined) {
      conditions.push(eq(users.role, filters.role));
    }

    if (search) {
      conditions.push(
        sql`(${users.username} ILIKE ${`%${search}%`} OR ${users.email} ILIKE ${`%${search}%`})`
      );
    }

    let query = db.select().from(users);

    if (conditions.length > 0) {
      query = query.where(and(...conditions));
    }

    return query.orderBy(users.createdAt).limit(limit).offset(skip);
  }

  /**
   * 根据用户名获取用户
   */
  async getUserByUsername(username: string): Promise<User | null> {
    const db = await getDb();
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user || null;
  }

  /**
   * 根据ID获取用户
   */
  async getUserById(id: string): Promise<User | null> {
    const db = await getDb();
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || null;
  }

  /**
   * 验证密码
   */
  async verifyPassword(username: string, password: string): Promise<boolean> {
    const user = await this.getUserByUsername(username);
    if (!user) return false;

    return user.password === hashPassword(password);
  }

  /**
   * 更新密码
   */
  async updatePassword(username: string, newPassword: string): Promise<boolean> {
    const db = await getDb();
    const [user] = await db
      .update(users)
      .set({ password: hashPassword(newPassword), updatedAt: new Date() })
      .where(eq(users.username, username))
      .returning();
    return !!user;
  }

  /**
   * 删除用户
   */
  async deleteUser(id: string): Promise<boolean> {
    const db = await getDb();
    const result = await db.delete(users).where(eq(users.id, id));
    return (result.rowCount ?? 0) > 0;
  }

  /**
   * 初始化默认管理员用户
   */
  async initializeDefaultAdmin(): Promise<void> {
    const existingAdmin = await this.getUserByUsername("admin");
    if (!existingAdmin) {
      await this.createUser({
        username: "admin",
        password: "admin123",
        email: "admin@passiveedge.com",
        role: "admin",
      });
    }
  }
}

export const userManager = new UserManager();
