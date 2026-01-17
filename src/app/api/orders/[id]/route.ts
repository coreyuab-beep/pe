import { NextRequest, NextResponse } from "next/server";
import { orderManager } from "@/storage/database";
import { orderService } from "@/lib/order-service";

/**
 * GET /api/orders/[id] - 获取订单详情
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const order = await orderManager.getOrderById(id);

    if (!order) {
      return NextResponse.json(
        { success: false, message: "订单不存在" },
        { status: 404 }
      );
    }

    // 获取物料需求
    const materialRequirements = await orderService.getOrderMaterialRequirements(id);

    return NextResponse.json({
      success: true,
      data: order,
      materialRequirements,
    });
  } catch (error) {
    console.error("获取订单详情失败:", error);
    return NextResponse.json(
      { success: false, message: "获取订单详情失败" },
      { status: 500 }
    );
  }
}

/**
 * PATCH /api/orders/[id] - 更新订单
 */
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();

    // 如果更新的是状态，使用订单服务处理联动
    if (body.status) {
      const approvedBy = request.headers.get("x-approved-by") || "system";
      const result = await orderService.updateOrderStatus(id, body.status, approvedBy);
      return NextResponse.json(result);
    }

    // 普通更新
    const order = await orderManager.updateOrder(id, body);

    if (!order) {
      return NextResponse.json(
        { success: false, message: "订单不存在" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: order });
  } catch (error) {
    console.error("更新订单失败:", error);
    return NextResponse.json(
      { success: false, message: error instanceof Error ? error.message : "更新订单失败" },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/orders/[id] - 删除订单
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const success = await orderManager.deleteOrder(id);

    if (!success) {
      return NextResponse.json(
        { success: false, message: "订单不存在" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, message: "订单删除成功" });
  } catch (error) {
    console.error("删除订单失败:", error);
    return NextResponse.json(
      { success: false, message: "删除订单失败" },
      { status: 500 }
    );
  }
}
