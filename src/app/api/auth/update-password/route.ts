import { NextRequest, NextResponse } from 'next/server';
import { getUserByUsername, verifyPassword, updateUserPassword } from '@/lib/users';
import { UpdatePasswordResponse } from '@/types/auth';

export async function POST(request: NextRequest) {
  try {
    const { username, oldPassword, newPassword } = await request.json();

    if (!username || !oldPassword || !newPassword) {
      return NextResponse.json<UpdatePasswordResponse>(
        { success: false, message: '所有字段都不能为空' },
        { status: 400 }
      );
    }

    const user = getUserByUsername(username);
    
    if (!user) {
      return NextResponse.json<UpdatePasswordResponse>(
        { success: false, message: '用户不存在' },
        { status: 404 }
      );
    }

    // 验证旧密码
    const isOldPasswordValid = verifyPassword(username, oldPassword);
    
    if (!isOldPasswordValid) {
      return NextResponse.json<UpdatePasswordResponse>(
        { success: false, message: '当前密码错误' },
        { status: 401 }
      );
    }

    // 检查新密码长度
    if (newPassword.length < 6) {
      return NextResponse.json<UpdatePasswordResponse>(
        { success: false, message: '新密码长度不能少于6位' },
        { status: 400 }
      );
    }

    // 更新密码
    const success = updateUserPassword(username, newPassword);
    
    if (!success) {
      return NextResponse.json<UpdatePasswordResponse>(
        { success: false, message: '密码更新失败' },
        { status: 500 }
      );
    }

    return NextResponse.json<UpdatePasswordResponse>({
      success: true,
      message: '密码修改成功',
    });
  } catch (error) {
    console.error('Update password error:', error);
    return NextResponse.json<UpdatePasswordResponse>(
      { success: false, message: '服务器错误' },
      { status: 500 }
    );
  }
}
