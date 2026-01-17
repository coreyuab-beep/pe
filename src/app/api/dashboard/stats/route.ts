import { NextResponse } from "next/server";
import { orderManager } from "@/storage/database";
import { formulaManager } from "@/storage/database";
import { materialManager } from "@/storage/database";
import { testManager } from "@/storage/database";

/**
 * GET /api/dashboard/stats - 获取仪表盘统计数据
 */
export async function GET() {
  try {
    const [orderStats, formulaStats, materialStats, testStats] = await Promise.all([
      orderManager.getOrderStats(),
      formulaManager.getFormulaStats(),
      materialManager.getMaterialStats(),
      testManager.getTestStats(),
    ]);

    // 获取低库存物料
    const lowStockMaterials = await materialManager.getLowStockMaterials();

    // 获取待处理订单
    const pendingOrders = await orderManager.getOrders({
      filters: { status: "pending" },
      limit: 5,
    });

    // 获取待测试记录
    const pendingTests = await testManager.getTestRecords({
      filters: { status: "pending" },
      limit: 5,
    });

    return NextResponse.json({
      success: true,
      data: {
        orders: orderStats,
        formulas: formulaStats,
        materials: materialStats,
        tests: testStats,
        lowStockMaterials: lowStockMaterials.slice(0, 10), // 限制返回数量
        pendingOrders: pendingOrders.slice(0, 5),
        pendingTests: pendingTests.slice(0, 5),
      },
    });
  } catch (error) {
    console.error("获取仪表盘统计数据失败:", error);
    return NextResponse.json(
      { success: false, message: "获取仪表盘统计数据失败" },
      { status: 500 }
    );
  }
}
