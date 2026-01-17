import { testManager } from "@/storage/database";
import { orderManager } from "@/storage/database";
import { formulaManager } from "@/storage/database";
import type { InsertTestRecord, TestRecord, Order, Formula } from "@/storage/database";

export interface TestCreationResult {
  testRecord: TestRecord;
  orderStatusUpdated?: string;
  warnings: string[];
}

export class TestService {
  /**
   * 创建测试记录
   */
  async createTestRecord(data: InsertTestRecord): Promise<TestCreationResult> {
    const warnings: string[] = [];
    const testRecord = await testManager.createTestRecord(data);

    return {
      testRecord,
      warnings,
    };
  }

  /**
   * 更新测试状态并联动订单
   */
  async updateTestStatus(
    testId: string,
    newStatus: string,
    conclusion?: string
  ): Promise<{ success: boolean; message: string; orderUpdated?: boolean }> {
    const testRecord = await testManager.getTestRecordById(testId);
    if (!testRecord) {
      return { success: false, message: "测试记录不存在" };
    }

    const oldStatus = testRecord.status;

    // 1. 更新测试状态
    await testManager.updateTestStatus(testId, {
      status: newStatus,
      conclusion,
    });

    let orderUpdated = false;

    // 2. 如果测试完成且关联了订单，更新订单状态
    if (oldStatus !== "completed" && newStatus === "completed" && testRecord.orderId) {
      const order = await orderManager.getOrderById(testRecord.orderId);
      if (order && order.status === "processing") {
        await orderManager.updateOrder(order.id, {
          status: "completed",
        });
        orderUpdated = true;
      }
    }

    return {
      success: true,
      message: "测试状态更新成功" + (orderUpdated ? "，订单状态已同步" : ""),
      orderUpdated,
    };
  }

  /**
   * 为订单创建测试记录
   */
  async createTestForOrder(
    orderId: string,
    testType: string,
    tester: string,
    createdBy: string
  ): Promise<TestCreationResult> {
    const order = await orderManager.getOrderById(orderId);
    if (!order) {
      throw new Error("订单不存在");
    }

    if (!order.formulaId) {
      throw new Error("订单未关联配方");
    }

    const formula = await formulaManager.getFormulaById(order.formulaId);
    if (!formula) {
      throw new Error("配方不存在");
    }

    // 生成测试编号：T-YYYYMMDD-XXX
    const date = new Date().toISOString().slice(0, 10).replace(/-/g, "");
    const random = Math.random().toString(36).substring(2, 5).toUpperCase();
    const testNo = `T-${date}-${random}`;

    const testRecord = await testManager.createTestRecord({
      testNo,
      formulaId: formula.id,
      formulaName: formula.name,
      formulaVersion: formula.version,
      orderId: order.id,
      orderNo: order.orderNo,
      testType,
      status: "pending",
      tester,
      createdBy,
    });

    return {
      testRecord,
      warnings: [],
    };
  }

  /**
   * 批量创建订单测试
   */
  async createBatchTestsForOrder(
    orderId: string,
    testTypes: string[],
    tester: string,
    createdBy: string
  ): Promise<TestRecord[]> {
    const testRecords: TestRecord[] = [];

    for (const testType of testTypes) {
      try {
        const result = await this.createTestForOrder(orderId, testType, tester, createdBy);
        testRecords.push(result.testRecord);
      } catch (error) {
        console.error(`创建测试失败: ${testType}`, error);
      }
    }

    return testRecords;
  }

  /**
   * 获取订单的所有测试记录
   */
  async getOrderTests(orderId: string): Promise<TestRecord[]> {
    return testManager.getTestRecords({
      filters: { orderId },
    });
  }

  /**
   * 获取配方的所有测试记录
   */
  async getFormulaTests(formulaId: string): Promise<TestRecord[]> {
    return testManager.getTestRecords({
      filters: { formulaId },
    });
  }
}

export const testService = new TestService();
