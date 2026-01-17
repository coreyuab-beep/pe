import { NextRequest, NextResponse } from "next/server";
import { materialManager } from "@/storage/database";

/**
 * POST /api/materials/[id]/stock - 更新物料库存
 */
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();

    const { quantity, operation, reason, referenceNo, approvedBy, createdBy } = body;

    if (!quantity || !operation || !reason || !approvedBy || !createdBy) {
      return NextResponse.json(
        { success: false, message: "缺少必要参数" },
        { status: 400 }
      );
    }

    const material = await materialManager.updateStock(
      id,
      Number(quantity),
      operation,
      reason,
      referenceNo,
      approvedBy,
      createdBy
    );

    if (!material) {
      return NextResponse.json(
        { success: false, message: "物料不存在" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: material });
  } catch (error) {
    console.error("更新库存失败:", error);
    return NextResponse.json(
      { success: false, message: error instanceof Error ? error.message : "更新库存失败" },
      { status: 500 }
    );
  }
}
