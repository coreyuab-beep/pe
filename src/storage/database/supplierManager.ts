import { eq, and, sql, like, desc, SQL } from "drizzle-orm";
import { getDb } from "coze-coding-dev-sdk";
import {
  suppliers,
  insertSupplierSchema,
  updateSupplierSchema,
} from "./shared/schema";
import type { Supplier, InsertSupplier, UpdateSupplier } from "./shared/schema";

export class SupplierManager {
  /**
   * 创建供应商
   */
  async createSupplier(data: InsertSupplier): Promise<Supplier> {
    const db = await getDb();
    const validated = insertSupplierSchema.parse(data);
    const [supplier] = await db.insert(suppliers).values(validated).returning();
    return supplier;
  }

  /**
   * 获取供应商列表
   */
  async getSuppliers(options: {
    skip?: number;
    limit?: number;
    filters?: Partial<Pick<Supplier, 'id' | 'code' | 'status'>>;
    search?: string;
  } = {}): Promise<Supplier[]> {
    const { skip = 0, limit = 100, filters = {}, search } = options;
    const db = await getDb();

    const conditions: SQL[] = [];

    if (filters.id !== undefined) {
      conditions.push(eq(suppliers.id, filters.id));
    }
    if (filters.code !== undefined) {
      conditions.push(eq(suppliers.code, filters.code));
    }
    if (filters.status !== undefined) {
      conditions.push(eq(suppliers.status, filters.status));
    }

    if (search) {
      conditions.push(
        sql`(${suppliers.name} ILIKE ${`%${search}%`} OR ${suppliers.code} ILIKE ${`%${search}%`})`
      );
    }

    let query = db.select().from(suppliers);

    if (conditions.length > 0) {
      query = query.where(and(...conditions));
    }

    return query.orderBy(suppliers.name).limit(limit).offset(skip);
  }

  /**
   * 根据ID获取供应商
   */
  async getSupplierById(id: string): Promise<Supplier | null> {
    const db = await getDb();
    const [supplier] = await db.select().from(suppliers).where(eq(suppliers.id, id));
    return supplier || null;
  }

  /**
   * 根据编号获取供应商
   */
  async getSupplierByCode(code: string): Promise<Supplier | null> {
    const db = await getDb();
    const [supplier] = await db.select().from(suppliers).where(eq(suppliers.code, code));
    return supplier || null;
  }

  /**
   * 更新供应商
   */
  async updateSupplier(id: string, data: UpdateSupplier): Promise<Supplier | null> {
    const db = await getDb();
    const validated = updateSupplierSchema.parse(data);
    const [supplier] = await db
      .update(suppliers)
      .set({ ...validated, updatedAt: new Date() })
      .where(eq(suppliers.id, id))
      .returning();
    return supplier || null;
  }

  /**
   * 删除供应商
   */
  async deleteSupplier(id: string): Promise<boolean> {
    const db = await getDb();
    const result = await db.delete(suppliers).where(eq(suppliers.id, id));
    return (result.rowCount ?? 0) > 0;
  }

  /**
   * 获取供应商选项（下拉选择）
   */
  async getSupplierOptions(): Promise<{ id: string; code: string; name: string }[]> {
    const db = await getDb();
    return db
      .select({
        id: suppliers.id,
        code: suppliers.code,
        name: suppliers.name,
      })
      .from(suppliers)
      .where(eq(suppliers.status, "active"))
      .orderBy(suppliers.name);
  }
}

export const supplierManager = new SupplierManager();
