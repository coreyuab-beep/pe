import { NextResponse } from 'next/server';
import { hashPassword } from '@/lib/auth-utils';

// 这是一个临时的调试 API，用于重置用户数据
// 生产环境中应该移除此路由或添加访问控制
let users: any[] = [
  {
    id: 'admin-001',
    username: 'admin',
    role: 'admin',
    createdAt: new Date('2024-01-01'),
  },
];

let passwords: Record<string, string> = {
  admin: hashPassword('admin123'),
};

export async function GET() {
  return NextResponse.json({
    message: '用户数据已重置',
    users: users.map(u => ({ ...u, password: '***' })),
    passwordHash: passwords.admin,
    defaultUsername: 'admin',
    defaultPassword: 'admin123',
  });
}

export async function POST() {
  // 重置为默认值
  users = [
    {
      id: 'admin-001',
    username: 'admin',
    role: 'admin',
    createdAt: new Date('2024-01-01'),
  },
  ];

  passwords = {
    admin: hashPassword('admin123'),
  };

  return NextResponse.json({
    success: true,
    message: '用户数据已重置为默认值',
    defaultUsername: 'admin',
    defaultPassword: 'admin123',
    passwordHash: passwords.admin,
  });
}
