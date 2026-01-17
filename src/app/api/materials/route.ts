import { NextRequest, NextResponse } from "next/server";
import { materialManager } from "@/storage/database";
import type { InsertMaterial } from "@/storage/database";

/**
 * GET /api/materials - 获取物料列表
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;

    const skip = parseInt(searchParams.get("skip") || "0");
    const limit = parseInt(searchParams.get("limit") || "100");
    const category = searchParams.get("category") || undefined;
    const status = searchParams.get("status") || undefined;
    const search = searchParams.get("search") || undefined;
    const lowStockOnly = searchParams.get("lowStockOnly") === "true";

    const materials = await materialManager.getMaterials({
      skip,
      limit,
      filters: {
        category,
        status,
      },
      search,
      lowStockOnly,
    });

    return NextResponse.json({ success: true, data: materials });
  } catch (error) {
    console.error("获取物料列表失败:", error);
    return NextResponse.json(
      { success: false, message: "获取物料列表失败" },
      { status: 500 }
    );
  }
}

/**
 * POST /api/materials - 创建物料
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const material = await materialManager.createMaterial(body as InsertMaterial);

    return NextResponse.json({ success: true, data: material });
  } catch (error) {
    console.error("创建物料失败:", error);
    return NextResponse.json(
      { success: false, message: error instanceof Error ? error.message : "创建物料失败" },
      { status: 500 }
    );
  }
}
