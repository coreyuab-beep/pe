import { eq, and, sql, like, desc, SQL } from "drizzle-orm";
import { getDb } from "coze-coding-dev-sdk";
import { orders, insertOrderSchema, updateOrderSchema } from "./shared/schema";
import type { Order, InsertOrder, UpdateOrder } from "./shared/schema";

export class OrderManager {
  /**
   * 创建订单
   */
  async createOrder(data: InsertOrder): Promise<Order> {
    const db = await getDb();
    const validated = insertOrderSchema.parse(data);
    const [order] = await db.insert(orders).values(validated).returning();
    return order;
  }

  /**
   * 获取订单列表
   */
  async getOrders(options: {
    skip?: number;
    limit?: number;
    filters?: Partial<Pick<Order, 'id' | 'orderNo' | 'customerName' | 'status' | 'type'>>;
    search?: string;
  } = {}): Promise<Order[]> {
    const { skip = 0, limit = 100, filters = {}, search } = options;
    const db = await getDb();

    const conditions: SQL[] = [];

    if (filters.id !== undefined) {
      conditions.push(eq(orders.id, filters.id));
    }
    if (filters.orderNo !== undefined) {
      conditions.push(eq(orders.orderNo, filters.orderNo));
    }
    if (filters.customerName !== undefined) {
      conditions.push(like(orders.customerName, `%${filters.customerName}%`));
    }
    if (filters.status !== undefined) {
      conditions.push(eq(orders.status, filters.status));
    }
    if (filters.type !== undefined) {
      conditions.push(eq(orders.type, filters.type));
    }

    if (search) {
      conditions.push(
        sql`(${orders.customerName} ILIKE ${`%${search}%`} OR ${orders.orderNo} ILIKE ${`%${search}%`})`
      );
    }

    let query = db.select().from(orders);

    if (conditions.length > 0) {
      query = query.where(and(...conditions));
    }

    return query.orderBy(desc(orders.createdAt)).limit(limit).offset(skip);
  }

  /**
   * 根据ID获取订单
   */
  async getOrderById(id: string): Promise<Order | null> {
    const db = await getDb();
    const [order] = await db.select().from(orders).where(eq(orders.id, id));
    return order || null;
  }

  /**
   * 根据订单号获取订单
   */
  async getOrderByOrderNo(orderNo: string): Promise<Order | null> {
    const db = await getDb();
    const [order] = await db.select().from(orders).where(eq(orders.orderNo, orderNo));
    return order || null;
  }

  /**
   * 更新订单
   */
  async updateOrder(id: string, data: UpdateOrder): Promise<Order | null> {
    const db = await getDb();
    const validated = updateOrderSchema.parse(data);
    const [order] = await db
      .update(orders)
      .set({ ...validated, updatedAt: new Date() })
      .where(eq(orders.id, id))
      .returning();
    return order || null;
  }

  /**
   * 删除订单
   */
  async deleteOrder(id: string): Promise<boolean> {
    const db = await getDb();
    const result = await db.delete(orders).where(eq(orders.id, id));
    return (result.rowCount ?? 0) > 0;
  }

  /**
   * 获取订单统计
   */
  async getOrderStats(): Promise<{
    total: number;
    pending: number;
    processing: number;
    completed: number;
    cancelled: number;
  }> {
    const db = await getDb();

    const [total] = await db.select({ count: sql<number>`count(*)` }).from(orders);
    const [pending] = await db
      .select({ count: sql<number>`count(*)` })
      .from(orders)
      .where(eq(orders.status, "pending"));
    const [processing] = await db
      .select({ count: sql<number>`count(*)` })
      .from(orders)
      .where(eq(orders.status, "processing"));
    const [completed] = await db
      .select({ count: sql<number>`count(*)` })
      .from(orders)
      .where(eq(orders.status, "completed"));
    const [cancelled] = await db
      .select({ count: sql<number>`count(*)` })
      .from(orders)
      .where(eq(orders.status, "cancelled"));

    return {
      total: Number(total.count),
      pending: Number(pending.count),
      processing: Number(processing.count),
      completed: Number(completed.count),
      cancelled: Number(cancelled.count),
    };
  }

  /**
   * 获取订单选项（下拉选择）
   */
  async getOrderOptions(): Promise<{ id: string; orderNo: string; customerName: string }[]> {
    const db = await getDb();
    return db
      .select({
        id: orders.id,
        orderNo: orders.orderNo,
        customerName: orders.customerName,
      })
      .from(orders)
      .where(eq(orders.status, "pending"))
      .orderBy(orders.createdAt);
  }
}

export const orderManager = new OrderManager();
