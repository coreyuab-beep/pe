import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// 不需要认证的路由
const publicRoutes = ['/login', '/api/auth'];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // 检查是否是公开路由
  const isPublicRoute = publicRoutes.some(route => pathname.startsWith(route));
  
  // 获取认证令牌
  const token = request.cookies.get('auth_token');
  const isAuthenticated = !!token;
  
  // 如果是登录页面且已登录，重定向到首页
  if (pathname === '/login' && isAuthenticated) {
    return NextResponse.redirect(new URL('/', request.url));
  }
  
  // 如果不是公开路由且未登录，重定向到登录页面
  if (!isPublicRoute && !isAuthenticated) {
    return NextResponse.redirect(new URL('/login', request.url));
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * 匹配所有路径除了:
     * - _next/static (静态文件)
     * - _next/image (图片优化)
     * - favicon.ico (网站图标)
     * - public 文件夹
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
