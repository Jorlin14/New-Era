'use client';

import { useAuth } from '@/context/AuthContext';
import Link from 'next/link';

export default function AdminDashboardPage() {
  const { user } = useAuth();

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <header>
        <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">
          ¡Hola, {user?.name?.split(' ')[0] ?? ''}! 👋
        </h1>
        <p className="text-slate-500 dark:text-slate-400 mt-2 text-lg">
          Este es el panel de control de administración. Aquí puedes gestionar tu catálogo y operaciones.
        </p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <DashboardCard 
          title="Productos" 
          description="Gestiona el inventario y precios" 
          icon="📦" 
          href="/dashboard/admin/products"
          color="bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400"
        />
        <DashboardCard 
          title="Categorías" 
          description="Organiza tus productos" 
          icon="🏷️" 
          href="/dashboard/admin/categories"
          color="bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400"
        />
        <DashboardCard 
          title="Usuarios" 
          description="Roles y permisos de la plataforma" 
          icon="👥" 
          href="/dashboard/admin/users"
          color="bg-purple-50 text-purple-600 dark:bg-purple-500/10 dark:text-purple-400"
        />
        <DashboardCard 
          title="Órdenes" 
          description="Pedidos recientes y estados" 
          icon="🛒" 
          href="/dashboard/admin/orders"
          color="bg-amber-50 text-amber-600 dark:bg-amber-500/10 dark:text-amber-400"
        />
      </div>

      {/* Aquí luego podemos añadir gráficas o métricas recientes */}
      <section className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-200 dark:border-slate-700">
        <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-4">Actividad Reciente</h2>
        <div className="text-center py-12">
          <p className="text-slate-500 dark:text-slate-400">Las métricas se implementarán pronto.</p>
        </div>
      </section>
    </div>
  );
}

function DashboardCard({ title, description, icon, href, color }: { title: string, description: string, icon: string, href: string, color: string }) {
  return (
    <Link href={href} className="block group">
      <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 hover:border-[#1c6554]/30 dark:hover:border-[#1c6554]/50">
        <div className={`w-14 h-14 rounded-xl flex items-center justify-center text-2xl mb-4 ${color}`}>
          {icon}
        </div>
        <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-1 group-hover:text-[#1c6554] transition-colors">{title}</h3>
        <p className="text-sm text-slate-500 dark:text-slate-400">{description}</p>
      </div>
    </Link>
  );
}
