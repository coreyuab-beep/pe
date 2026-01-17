import { User } from '@/types/auth';
import { hashPassword } from '@/lib/auth-utils';

// 用户数据存储（实际项目中应该使用数据库）
let users: User[] = [
  {
    id: 'admin-001',
    username: 'admin',
    role: 'admin',
    createdAt: new Date('2024-01-01'),
  },
];

// 密码存储（实际项目中应该加密存储）
let passwords: Record<string, string> = {
  admin: hashPassword('admin123'),
};

// 初始化函数（确保数据始终存在）
export function initializeUsers() {
  if (users.length === 0) {
    users = [
      {
        id: 'admin-001',
        username: 'admin',
        role: 'admin',
        createdAt: new Date('2024-01-01'),
      },
    ];
  }

  if (!passwords['admin']) {
    passwords['admin'] = hashPassword('admin123');
  }
}

// 自动初始化
initializeUsers();

// 获取所有用户
export function getAllUsers(): User[] {
  return users;
}

// 根据用户名获取用户
export function getUserByUsername(username: string): User | undefined {
  return users.find(u => u.username === username);
}

// 验证密码
export function verifyPassword(username: string, password: string): boolean {
  const user = getUserByUsername(username);
  if (!user) return false;

  const hashedPassword = passwords[username];
  if (!hashedPassword) return false;

  return hashPassword(password) === hashedPassword;
}

// 更新密码
export function updateUserPassword(username: string, newPassword: string): boolean {
  const user = getUserByUsername(username);
  if (!user) return false;

  passwords[username] = hashPassword(newPassword);
  return true;
}

// 添加用户（可选功能）
export function addUser(username: string, role: 'admin' | 'user', password: string): User {
  const newUser: User = {
    id: `user-${Date.now()}`,
    username,
    role,
    createdAt: new Date(),
  };

  users.push(newUser);
  passwords[username] = hashPassword(password);

  return newUser;
}
