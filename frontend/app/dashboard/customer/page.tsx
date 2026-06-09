'use client';

import { useAuth } from '@/context/AuthContext';
import Link from 'next/link';

export default function CustomerDashboardPage() {
  const { user } = useAuth();

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <header>
        <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">
          ¡Hola, {user?.name?.split(' ')[0] ?? ''}! 👋
        </h1>
        <p className="text-slate-500 dark:text-slate-400 mt-2 text-lg">
          Bienvenido a tu perfil. Aquí puedes revisar tus compras y configurar tu cuenta.
        </p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Link href="/dashboard/customer/orders" className="block group">
          <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 hover:border-[#1c6554]/30">
            <div className="w-14 h-14 rounded-xl flex items-center justify-center text-2xl mb-4 bg-[#1c6554]/10 text-[#1c6554]">
              🛍️
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-1 group-hover:text-[#1c6554] transition-colors">Mis Órdenes</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400">Revisa el historial de tus compras y su estado de entrega.</p>
          </div>
        </Link>
        
        <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 transition-all duration-300">
            <div className="w-14 h-14 rounded-xl flex items-center justify-center text-2xl mb-4 bg-blue-500/10 text-blue-500">
              👤
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-1">Información Personal</h3>
            <div className="text-sm text-slate-500 dark:text-slate-400 mt-4 space-y-2">
              <p><strong>Nombre:</strong> {user?.name}</p>
              <p><strong>Email:</strong> {user?.email}</p>
              <p className="mt-4 text-xs italic">La edición de perfil estará disponible próximamente.</p>
            </div>
        </div>
      </div>

      <section className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-200 dark:border-slate-700">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">Órdenes Recientes</h2>
          <Link href="/dashboard/customer/orders" className="text-[#1c6554] font-medium text-sm hover:underline">
            Ver todas
          </Link>
        </div>
        <div className="text-center py-12 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-dashed border-slate-300 dark:border-slate-700">
          <p className="text-slate-500 dark:text-slate-400">Aún no has realizado ninguna orden.</p>
          <Link href="/#productos" className="inline-block mt-4 px-6 py-2 bg-[#1c6554] text-white rounded-md font-semibold text-sm hover:bg-[#1c6554]/90 transition-colors">
            Explorar Productos
          </Link>
        </div>
      </section>
    </div>
  );
}
