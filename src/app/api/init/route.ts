import { NextResponse } from "next/server";
import seedDatabase from "@/lib/seed-data";

/**
 * POST /api/init - 初始化数据库数据
 */
export async function POST() {
  try {
    await seedDatabase();

    return NextResponse.json({
      success: true,
      message: "数据库初始化成功",
    });
  } catch (error) {
    console.error("数据库初始化失败:", error);
    return NextResponse.json(
      {
        success: false,
        message: error instanceof Error ? error.message : "数据库初始化失败",
      },
      { status: 500 }
    );
  }
}
