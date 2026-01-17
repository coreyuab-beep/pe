import { NextRequest, NextResponse } from "next/server";
import { orderManager } from "@/storage/database";
import { orderService } from "@/lib/order-service";
import type { InsertOrder } from "@/storage/database";

/**
 * GET /api/orders - 获取订单列表
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;

    const skip = parseInt(searchParams.get("skip") || "0");
    const limit = parseInt(searchParams.get("limit") || "100");
    const status = searchParams.get("status") || undefined;
    const type = searchParams.get("type") || undefined;
    const search = searchParams.get("search") || undefined;

    const orders = await orderManager.getOrders({
      skip,
      limit,
      filters: {
        status: status as any,
        type: type as any,
      },
      search,
    });

    return NextResponse.json({ success: true, data: orders });
  } catch (error) {
    console.error("获取订单列表失败:", error);
    return NextResponse.json(
      { success: false, message: "获取订单列表失败" },
      { status: 500 }
    );
  }
}

/**
 * POST /api/orders - 创建订单
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const creatorCode = request.headers.get("x-creator-code") || undefined;

    const result = await orderService.createOrderWithStockCheck(body as InsertOrder, creatorCode);

    return NextResponse.json({
      success: true,
      data: result.order,
      materialRequirements: result.materialRequirements,
      warnings: result.warnings,
    });
  } catch (error) {
    console.error("创建订单失败:", error);
    return NextResponse.json(
      { success: false, message: error instanceof Error ? error.message : "创建订单失败" },
      { status: 500 }
    );
  }
}
