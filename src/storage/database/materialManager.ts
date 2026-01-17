import { eq, and, sql, like, desc, SQL, lt } from "drizzle-orm";
import { getDb } from "coze-coding-dev-sdk";
import {
  materials,
  insertMaterialSchema,
  updateMaterialSchema,
  stockOperations,
} from "./shared/schema";
import type { Material, InsertMaterial, UpdateMaterial } from "./shared/schema";

export class MaterialManager {
  /**
   * 创建物料
   */
  async createMaterial(data: InsertMaterial): Promise<Material> {
    const db = await getDb();
    const validated = insertMaterialSchema.parse(data);
    const [material] = await db.insert(materials).values(validated).returning();
    return material;
  }

  /**
   * 获取物料列表
   */
  async getMaterials(options: {
    skip?: number;
    limit?: number;
    filters?: Partial<Pick<Material, 'id' | 'code' | 'category' | 'status'>>;
    search?: string;
    lowStockOnly?: boolean;
  } = {}): Promise<Material[]> {
    const { skip = 0, limit = 100, filters = {}, search, lowStockOnly } = options;
    const db = await getDb();

    const conditions: SQL[] = [];

    if (filters.id !== undefined) {
      conditions.push(eq(materials.id, filters.id));
    }
    if (filters.code !== undefined) {
      conditions.push(eq(materials.code, filters.code));
    }
    if (filters.category !== undefined) {
      conditions.push(eq(materials.category, filters.category));
    }
    if (filters.status !== undefined) {
      conditions.push(eq(materials.status, filters.status));
    }

    if (search) {
      conditions.push(
        sql`(${materials.code} ILIKE ${`%${search}%`} OR ${materials.name} ILIKE ${`%${search}%`})`
      );
    }

    if (lowStockOnly) {
      conditions.push(sql`${materials.currentStock} < ${materials.minStock}`);
    }

    let query = db.select().from(materials);

    if (conditions.length > 0) {
      query = query.where(and(...conditions));
    }

    return query.orderBy(materials.code).limit(limit).offset(skip);
  }

  /**
   * 根据ID获取物料
   */
  async getMaterialById(id: string): Promise<Material | null> {
    const db = await getDb();
    const [material] = await db.select().from(materials).where(eq(materials.id, id));
    return material || null;
  }

  /**
   * 根据编号获取物料
   */
  async getMaterialByCode(code: string): Promise<Material | null> {
    const db = await getDb();
    const [material] = await db.select().from(materials).where(eq(materials.code, code));
    return material || null;
  }

  /**
   * 更新物料
   */
  async updateMaterial(id: string, data: UpdateMaterial): Promise<Material | null> {
    const db = await getDb();
    const validated = updateMaterialSchema.parse(data);
    const [material] = await db
      .update(materials)
      .set({ ...validated, updatedAt: new Date() })
      .where(eq(materials.id, id))
      .returning();
    return material || null;
  }

  /**
   * 删除物料
   */
  async deleteMaterial(id: string): Promise<boolean> {
    const db = await getDb();
    const result = await db.delete(materials).where(eq(materials.id, id));
    return (result.rowCount ?? 0) > 0;
  }

  /**
   * 更新物料库存
   */
  async updateStock(
    materialId: string,
    quantity: number,
    operation: "in" | "out" | "adjust",
    reason: string,
    referenceNo?: string,
    approvedBy: string,
    createdBy: string
  ): Promise<Material | null> {
    const db = await getDb();

    // 获取当前物料
    const [material] = await db.select().from(materials).where(eq(materials.id, materialId));
    if (!material) return null;

    const beforeStock = Number(material.currentStock);
    let afterStock = beforeStock;

    if (operation === "in") {
      afterStock = beforeStock + quantity;
    } else if (operation === "out") {
      afterStock = beforeStock - quantity;
      if (afterStock < 0) {
        throw new Error("库存不足");
      }
    } else {
      afterStock = quantity;
    }

    // 更新物料库存
    const [updatedMaterial] = await db
      .update(materials)
      .set({
        currentStock: afterStock.toString(),
        updatedAt: new Date(),
        status: afterStock <= 0 ? "out_of_stock" : afterStock < Number(material.minStock) ? "low_stock" : "normal",
      })
      .where(eq(materials.id, materialId))
      .returning();

    // 记录库存操作
    await db.insert(stockOperations).values({
      materialId,
      materialName: material.name || material.code,
      materialCode: material.code,
      type: operation,
      quantity: quantity.toString(),
      beforeStock: beforeStock.toString(),
      afterStock: afterStock.toString(),
      reason,
      referenceNo,
      approvedBy,
      createdBy,
    });

    return updatedMaterial;
  }

  /**
   * 获取低库存物料
   */
  async getLowStockMaterials(): Promise<Material[]> {
    const db = await getDb();
    return db
      .select()
      .from(materials)
      .where(sql`${materials.currentStock} < ${materials.minStock}`);
  }

  /**
   * 获取物料统计
   */
  async getMaterialStats(): Promise<{
    total: number;
    normal: number;
    lowStock: number;
    outOfStock: number;
  }> {
    const db = await getDb();

    const [total] = await db.select({ count: sql<number>`count(*)` }).from(materials);
    const [normal] = await db
      .select({ count: sql<number>`count(*)` })
      .from(materials)
      .where(eq(materials.status, "normal"));
    const [lowStock] = await db
      .select({ count: sql<number>`count(*)` })
      .from(materials)
      .where(eq(materials.status, "low_stock"));
    const [outOfStock] = await db
      .select({ count: sql<number>`count(*)` })
      .from(materials)
      .where(eq(materials.status, "out_of_stock"));

    return {
      total: Number(total.count),
      normal: Number(normal.count),
      lowStock: Number(lowStock.count),
      outOfStock: Number(outOfStock.count),
    };
  }

  /**
   * 获取物料选项（下拉选择）
   */
  async getMaterialOptions(): Promise<{ id: string; code: string; name: string; currentStock: string }[]> {
    const db = await getDb();
    return db
      .select({
        id: materials.id,
        code: materials.code,
        name: materials.name,
        currentStock: materials.currentStock,
      })
      .from(materials)
      .where(eq(materials.status, "normal"))
      .orderBy(materials.code);
  }
}

export const materialManager = new MaterialManager();
