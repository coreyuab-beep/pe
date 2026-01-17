import { eq, and, sql, like, desc, SQL } from "drizzle-orm";
import { getDb } from "coze-coding-dev-sdk";
import {
  formulas,
  insertFormulaSchema,
  updateFormulaSchema,
  formulaMaterials,
} from "./shared/schema";
import type { Formula, InsertFormula, UpdateFormula } from "./shared/schema";

export class FormulaManager {
  /**
   * 创建配方
   */
  async createFormula(data: InsertFormula): Promise<Formula> {
    const db = await getDb();
    const validated = insertFormulaSchema.parse(data);
    const [formula] = await db.insert(formulas).values(validated).returning();
    return formula;
  }

  /**
   * 获取配方列表
   */
  async getFormulas(options: {
    skip?: number;
    limit?: number;
    filters?: Partial<Pick<Formula, 'id' | 'code' | 'category' | 'isPublished'>>;
    search?: string;
  } = {}): Promise<Formula[]> {
    const { skip = 0, limit = 100, filters = {}, search } = options;
    const db = await getDb();

    const conditions: SQL[] = [];

    if (filters.id !== undefined) {
      conditions.push(eq(formulas.id, filters.id));
    }
    if (filters.code !== undefined) {
      conditions.push(eq(formulas.code, filters.code));
    }
    if (filters.category !== undefined) {
      conditions.push(eq(formulas.category, filters.category));
    }
    if (filters.isPublished !== undefined) {
      conditions.push(eq(formulas.isPublished, filters.isPublished));
    }

    if (search) {
      conditions.push(
        sql`(${formulas.name} ILIKE ${`%${search}%`} OR ${formulas.code} ILIKE ${`%${search}%`})`
      );
    }

    let query = db.select().from(formulas);

    if (conditions.length > 0) {
      query = query.where(and(...conditions));
    }

    return query.orderBy(desc(formulas.createdAt)).limit(limit).offset(skip);
  }

  /**
   * 根据ID获取配方
   */
  async getFormulaById(id: string): Promise<Formula | null> {
    const db = await getDb();
    const [formula] = await db.select().from(formulas).where(eq(formulas.id, id));
    return formula || null;
  }

  /**
   * 根据编号获取配方
   */
  async getFormulaByCode(code: string): Promise<Formula | null> {
    const db = await getDb();
    const [formula] = await db.select().from(formulas).where(eq(formulas.code, code));
    return formula || null;
  }

  /**
   * 更新配方
   */
  async updateFormula(id: string, data: UpdateFormula): Promise<Formula | null> {
    const db = await getDb();
    const validated = updateFormulaSchema.parse(data);
    const [formula] = await db
      .update(formulas)
      .set({ ...validated, updatedAt: new Date() })
      .where(eq(formulas.id, id))
      .returning();
    return formula || null;
  }

  /**
   * 删除配方
   */
  async deleteFormula(id: string): Promise<boolean> {
    const db = await getDb();
    const result = await db.delete(formulas).where(eq(formulas.id, id));
    return (result.rowCount ?? 0) > 0;
  }

  /**
   * 获取配方统计
   */
  async getFormulaStats(): Promise<{
    total: number;
    published: number;
    draft: number;
  }> {
    const db = await getDb();

    const [total] = await db.select({ count: sql<number>`count(*)` }).from(formulas);
    const [published] = await db
      .select({ count: sql<number>`count(*)` })
      .from(formulas)
      .where(eq(formulas.isPublished, true));
    const [draft] = await db
      .select({ count: sql<number>`count(*)` })
      .from(formulas)
      .where(eq(formulas.isPublished, false));

    return {
      total: Number(total.count),
      published: Number(published.count),
      draft: Number(draft.count),
    };
  }

  /**
   * 获取配方材料
   */
  async getFormulaMaterials(formulaId: string) {
    const db = await getDb();
    return db.select().from(formulaMaterials).where(eq(formulaMaterials.formulaId, formulaId));
  }

  /**
   * 获取配方选项（下拉选择）
   */
  async getFormulaOptions(): Promise<{ id: string; code: string; name: string; version: string }[]> {
    const db = await getDb();
    return db
      .select({
        id: formulas.id,
        code: formulas.code,
        name: formulas.name,
        version: formulas.version,
      })
      .from(formulas)
      .where(eq(formulas.isPublished, true))
      .orderBy(formulas.name);
  }
}

export const formulaManager = new FormulaManager();
