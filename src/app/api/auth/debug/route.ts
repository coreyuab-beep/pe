import { NextResponse, NextRequest } from 'next/server';
import { getUserByUsername, verifyPassword, initializeUsers } from '@/lib/users';
import { hashPassword } from '@/lib/auth-utils';

export async function GET() {
  try {
    // 确保用户数据已初始化
    initializeUsers();

    const user = getUserByUsername('admin');

    if (!user) {
      return NextResponse.json({
        error: 'User not found',
        users: [],
        passwords: {},
      });
    }

    return NextResponse.json({
      user,
      passwordHash: hashPassword('admin123'),
      testPassword: 'admin123',
      testHash: hashPassword('admin123'),
    });
  } catch (error: any) {
    return NextResponse.json({
      error: error.message,
      stack: error.stack,
    }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const { username, password } = await request.json();

    // 确保用户数据已初始化
    initializeUsers();

    const user = getUserByUsername(username);

    if (!user) {
      return NextResponse.json({
        success: false,
        message: `User '${username}' not found`,
        debug: {
          username,
          passwordProvided: !!password,
          userExists: false,
        },
      }, { status: 401 });
    }

    const isValid = verifyPassword(username, password);

    if (!isValid) {
      return NextResponse.json({
        success: false,
        message: 'Invalid password',
        debug: {
          username,
          passwordProvided: !!password,
          userExists: true,
          passwordValid: false,
          expectedHash: hashPassword('admin123'),
          actualHash: hashPassword(password || ''),
        },
      }, { status: 401 });
    }

    return NextResponse.json({
      success: true,
      message: 'Login successful',
      user,
    });
  } catch (error: any) {
    return NextResponse.json({
      error: error.message,
      stack: error.stack,
    }, { status: 500 });
  }
}
