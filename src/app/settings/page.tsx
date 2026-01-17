'use client';

import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';

export default function SettingsPage() {
  const { user, logout } = useAuth();
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);

    if (newPassword !== confirmPassword) {
      setMessage({ type: 'error', text: '两次输入的密码不一致' });
      return;
    }

    if (newPassword.length < 6) {
      setMessage({ type: 'error', text: '新密码长度不能少于6位' });
      return;
    }

    setIsLoading(true);

    try {
      await logout();
      await (useAuth().updatePassword)(oldPassword, newPassword);
      setMessage({ type: 'success', text: '密码修改成功，请重新登录' });
      setTimeout(() => {
        window.location.href = '/login';
      }, 2000);
    } catch (err) {
      setMessage({ type: 'error', text: err instanceof Error ? err.message : '密码修改失败' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">系统设置</h1>
        <p className="text-slate-500 mt-2">管理系统配置和用户信息</p>
      </div>

      <div className="grid gap-6">
        {/* 用户信息 */}
        <Card>
          <CardHeader>
            <CardTitle>用户信息</CardTitle>
            <CardDescription>当前登录用户的详细信息</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-slate-500">用户名</Label>
                <p className="text-lg font-semibold mt-1">{user?.username}</p>
              </div>
              <div>
                <Label className="text-slate-500">角色</Label>
                <p className="text-lg font-semibold mt-1">
                  {user?.role === 'admin' ? '管理员' : '普通用户'}
                </p>
              </div>
              <div>
                <Label className="text-slate-500">用户ID</Label>
                <p className="text-sm text-slate-600 mt-1">{user?.id}</p>
              </div>
              <div>
                <Label className="text-slate-500">注册时间</Label>
                <p className="text-sm text-slate-600 mt-1">
                  {user?.createdAt ? new Date(user.createdAt).toLocaleString('zh-CN') : '-'}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 修改密码 */}
        <Card>
          <CardHeader>
            <CardTitle>修改密码</CardTitle>
            <CardDescription>更新您的登录密码以保障账户安全</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handlePasswordChange} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="oldPassword">当前密码</Label>
                <Input
                  id="oldPassword"
                  type="password"
                  placeholder="请输入当前密码"
                  value={oldPassword}
                  onChange={(e) => setOldPassword(e.target.value)}
                  required
                  disabled={isLoading}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="newPassword">新密码</Label>
                <Input
                  id="newPassword"
                  type="password"
                  placeholder="请输入新密码（至少6位）"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                  disabled={isLoading}
                  minLength={6}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">确认新密码</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  placeholder="请再次输入新密码"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  disabled={isLoading}
                />
              </div>
              {message && (
                <Alert variant={message.type === 'error' ? 'destructive' : 'default'}>
                  <AlertDescription>{message.text}</AlertDescription>
                </Alert>
              )}
              <Button type="submit" disabled={isLoading}>
                {isLoading ? '提交中...' : '修改密码'}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
