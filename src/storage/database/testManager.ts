import { eq, and, sql, like, desc, SQL } from "drizzle-orm";
import { getDb } from "coze-coding-dev-sdk";
import {
  testRecords,
  insertTestRecordSchema,
  updateTestRecordSchema,
} from "./shared/schema";
import type { TestRecord, InsertTestRecord, UpdateTestRecord } from "./shared/schema";

export class TestManager {
  /**
   * 创建测试记录
   */
  async createTestRecord(data: InsertTestRecord): Promise<TestRecord> {
    const db = await getDb();
    const validated = insertTestRecordSchema.parse(data);
    const [testRecord] = await db.insert(testRecords).values(validated).returning();
    return testRecord;
  }

  /**
   * 获取测试记录列表
   */
  async getTestRecords(options: {
    skip?: number;
    limit?: number;
    filters?: Partial<Pick<TestRecord, 'id' | 'testNo' | 'formulaId' | 'orderId' | 'status'>>;
    search?: string;
  } = {}): Promise<TestRecord[]> {
    const { skip = 0, limit = 100, filters = {}, search } = options;
    const db = await getDb();

    const conditions: SQL[] = [];

    if (filters.id !== undefined) {
      conditions.push(eq(testRecords.id, filters.id));
    }
    if (filters.testNo !== undefined) {
      conditions.push(eq(testRecords.testNo, filters.testNo));
    }
    if (filters.formulaId !== undefined) {
      conditions.push(eq(testRecords.formulaId, filters.formulaId));
    }
    if (filters.orderId !== undefined) {
      conditions.push(eq(testRecords.orderId, filters.orderId));
    }
    if (filters.status !== undefined) {
      conditions.push(eq(testRecords.status, filters.status));
    }

    if (search) {
      conditions.push(
        sql`(${testRecords.testNo} ILIKE ${`%${search}%`} OR ${testRecords.formulaName} ILIKE ${`%${search}%`})`
      );
    }

    let query = db.select().from(testRecords);

    if (conditions.length > 0) {
      query = query.where(and(...conditions));
    }

    return query.orderBy(desc(testRecords.createdAt)).limit(limit).offset(skip);
  }

  /**
   * 根据ID获取测试记录
   */
  async getTestRecordById(id: string): Promise<TestRecord | null> {
    const db = await getDb();
    const [testRecord] = await db.select().from(testRecords).where(eq(testRecords.id, id));
    return testRecord || null;
  }

  /**
   * 根据测试编号获取测试记录
   */
  async getTestRecordByTestNo(testNo: string): Promise<TestRecord | null> {
    const db = await getDb();
    const [testRecord] = await db.select().from(testRecords).where(eq(testRecords.testNo, testNo));
    return testRecord || null;
  }

  /**
   * 更新测试记录
   */
  async updateTestRecord(id: string, data: UpdateTestRecord): Promise<TestRecord | null> {
    const db = await getDb();
    const validated = updateTestRecordSchema.parse(data);
    const [testRecord] = await db
      .update(testRecords)
      .set({ ...validated, updatedAt: new Date() })
      .where(eq(testRecords.id, id))
      .returning();
    return testRecord || null;
  }

  /**
   * 删除测试记录
   */
  async deleteTestRecord(id: string): Promise<boolean> {
    const db = await getDb();
    const result = await db.delete(testRecords).where(eq(testRecords.id, id));
    return (result.rowCount ?? 0) > 0;
  }

  /**
   * 获取测试统计
   */
  async getTestStats(): Promise<{
    total: number;
    pending: number;
    testing: number;
    completed: number;
    failed: number;
  }> {
    const db = await getDb();

    const [total] = await db.select({ count: sql<number>`count(*)` }).from(testRecords);
    const [pending] = await db
      .select({ count: sql<number>`count(*)` })
      .from(testRecords)
      .where(eq(testRecords.status, "pending"));
    const [testing] = await db
      .select({ count: sql<number>`count(*)` })
      .from(testRecords)
      .where(eq(testRecords.status, "testing"));
    const [completed] = await db
      .select({ count: sql<number>`count(*)` })
      .from(testRecords)
      .where(eq(testRecords.status, "completed"));
    const [failed] = await db
      .select({ count: sql<number>`count(*)` })
      .from(testRecords)
      .where(eq(testRecords.status, "failed"));

    return {
      total: Number(total.count),
      pending: Number(pending.count),
      testing: Number(testing.count),
      completed: Number(completed.count),
      failed: Number(failed.count),
    };
  }
}

export const testManager = new TestManager();
