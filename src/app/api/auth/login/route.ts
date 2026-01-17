import { NextRequest, NextResponse } from 'next/server';
import { getUserByUsername, verifyPassword } from '@/lib/users';
import { LoginResponse } from '@/types/auth';

export async function POST(request: NextRequest) {
  try {
    const { username, password } = await request.json();

    if (!username || !password) {
      return NextResponse.json<LoginResponse>(
        { success: false, message: '用户名和密码不能为空' },
        { status: 400 }
      );
    }

    const user = getUserByUsername(username);
    
    if (!user) {
      return NextResponse.json<LoginResponse>(
        { success: false, message: '用户名或密码错误' },
        { status: 401 }
      );
    }

    const isValid = verifyPassword(username, password);
    
    if (!isValid) {
      return NextResponse.json<LoginResponse>(
        { success: false, message: '用户名或密码错误' },
        { status: 401 }
      );
    }

    return NextResponse.json<LoginResponse>({
      success: true,
      user,
      message: '登录成功',
    });
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json<LoginResponse>(
      { success: false, message: '服务器错误' },
      { status: 500 }
    );
  }
}
