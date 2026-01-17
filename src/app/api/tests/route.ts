import { NextRequest, NextResponse } from "next/server";
import { testManager } from "@/storage/database";
import { testService } from "@/lib/test-service";
import type { InsertTestRecord } from "@/storage/database";

/**
 * GET /api/tests - 获取测试记录列表
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;

    const skip = parseInt(searchParams.get("skip") || "0");
    const limit = parseInt(searchParams.get("limit") || "100");
    const status = searchParams.get("status") || undefined;
    const formulaId = searchParams.get("formulaId") || undefined;
    const orderId = searchParams.get("orderId") || undefined;
    const search = searchParams.get("search") || undefined;

    const tests = await testManager.getTestRecords({
      skip,
      limit,
      filters: {
        status,
        formulaId,
        orderId,
      },
      search,
    });

    return NextResponse.json({ success: true, data: tests });
  } catch (error) {
    console.error("获取测试记录失败:", error);
    return NextResponse.json(
      { success: false, message: "获取测试记录失败" },
      { status: 500 }
    );
  }
}

/**
 * POST /api/tests - 创建测试记录
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const result = await testService.createTestRecord(body as InsertTestRecord);

    return NextResponse.json({
      success: true,
      data: result.testRecord,
      warnings: result.warnings,
    });
  } catch (error) {
    console.error("创建测试记录失败:", error);
    return NextResponse.json(
      { success: false, message: error instanceof Error ? error.message : "创建测试记录失败" },
      { status: 500 }
    );
  }
}
