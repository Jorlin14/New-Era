'use client';

import { useAuth } from '@/context/AuthContext';
import { useRouter, usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import Link from 'next/link';

// NAV CONFIG BY ROLE
const NAV_CONFIG: Record<string, { name: string; path: string; icon: string }[]> = {
  ADMIN: [
    { name: 'Resumen', path: '', icon: '📊' },
    { name: 'Productos', path: '/products', icon: '📦' },
    { name: 'Categorías', path: '/categories', icon: '🏷️' },
    { name: 'Usuarios', path: '/users', icon: '👥' },
    { name: 'Órdenes', path: '/orders', icon: '🛒' },
  ],
  CUSTOMER: [
    { name: 'Mi Perfil', path: '', icon: '👤' },
    { name: 'Mis Órdenes', path: '/orders', icon: '🛍️' },
  ],
  DELIVERER: [
    { name: 'Mis Entregas', path: '', icon: '🚚' },
  ],
  CASHIER: [
    { name: 'Punto de Venta', path: '', icon: '💵' },
    { name: 'Órdenes Activas', path: '/orders', icon: '📋' },
  ],
};

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { user, isAuthenticated, isLoading, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // REDIRECT UNAUTHENTICATED
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/auth');
    }
  }, [isLoading, isAuthenticated, router]);

  if (isLoading || !isAuthenticated || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-900">
        <div className="w-10 h-10 border-4 border-[#1c6554] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const base = `/dashboard/${user.role.toLowerCase()}`;
  const navLinks = (NAV_CONFIG[user.role] ?? []).map((link) => ({
    ...link,
    path: `${base}${link.path}`,
  }));

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex">
      {/* SIDEBAR OVERLAY (MOBILE) */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* SIDEBAR */}
      <aside className={`fixed lg:static inset-y-0 left-0 w-64 bg-white dark:bg-slate-800 border-r border-slate-200 dark:border-slate-700 z-50 transform transition-transform duration-300 ease-in-out ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>
        <div className="h-16 flex items-center justify-between px-6 border-b border-slate-200 dark:border-slate-700">
          <Link href="/" className="text-xl font-black text-[#1c6554] tracking-tight">
            NEW ERA
          </Link>
          <button className="lg:hidden text-slate-500" onClick={() => setIsSidebarOpen(false)}>
            ✕
          </button>
        </div>

        {/* USER INFO */}
        <div className="p-4 border-b border-slate-200 dark:border-slate-700 flex items-center gap-3">
          <div className="w-10 h-10 bg-slate-100 dark:bg-slate-700 rounded-full flex items-center justify-center text-lg font-bold text-[#1c6554]">
            {user.name.charAt(0).toUpperCase()}
          </div>
          <div>
            <p className="text-sm font-bold text-slate-900 dark:text-white line-clamp-1">{user.name}</p>
            <p className="text-xs text-slate-500 dark:text-slate-400 capitalize">{user.role.toLowerCase()}</p>
          </div>
        </div>

        {/* NAV LINKS */}
        <nav className="p-4 space-y-1">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              href={link.path}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                pathname === link.path
                  ? 'bg-[#1c6554]/10 text-[#1c6554] dark:bg-[#1c6554]/20 dark:text-[#25826c]'
                  : 'text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700/50 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <span className="text-lg">{link.icon}</span>
              {link.name}
            </Link>
          ))}
        </nav>

        {/* LOGOUT */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-slate-200 dark:border-slate-700">
          <button
            onClick={logout}
            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-slate-100 hover:bg-red-50 text-slate-700 hover:text-red-600 dark:bg-slate-800 dark:hover:bg-red-500/10 dark:text-slate-300 dark:hover:text-red-500 text-sm font-bold rounded-lg transition-colors"
          >
            Cerrar sesión
          </button>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <div className="flex-1 flex flex-col min-h-screen overflow-hidden">
        {/* TOPBAR (MOBILE) */}
        <header className="lg:hidden h-16 bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 flex items-center px-4">
          <button
            onClick={() => setIsSidebarOpen(true)}
            className="p-2 -ml-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg"
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          <span className="ml-4 font-bold text-slate-900 dark:text-white">Panel de Control</span>
        </header>

        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
