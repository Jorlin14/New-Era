'use client';

import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';

export default function DelivererDashboardPage() {
  const { user } = useAuth();

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <header className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">
            Panel de Entregas 🚚
          </h1>
          <p className="text-slate-500 dark:text-slate-400 mt-2 text-lg">
            Hola {user?.name?.split(' ')[0] ?? ''}, aquí están las órdenes asignadas a tu ruta.
          </p>
        </div>
        <div className="text-right">
          <span className="inline-block px-4 py-2 bg-emerald-100 text-emerald-700 font-bold rounded-full text-sm shadow-sm">
            Estado: En Ruta
          </span>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">Órdenes Pendientes</h2>
          {/* Aquí cargaremos la lista real de órdenes */}
          <div className="bg-white dark:bg-slate-800 rounded-xl p-6 border border-slate-200 dark:border-slate-700 shadow-sm">
            <div className="flex justify-between items-center pb-4 border-b border-slate-100 dark:border-slate-700">
              <div>
                <p className="text-sm text-slate-500 font-semibold">ORD-998877</p>
                <h3 className="font-bold text-lg">Cliente: Carlos Ruiz</h3>
              </div>
              <span className="px-3 py-1 bg-amber-100 text-amber-700 text-xs font-bold rounded-full">
                Pendiente de entrega
              </span>
            </div>
            <div className="pt-4 text-sm text-slate-600 dark:text-slate-400">
              <p>📍 Dirección: Calle 45 # 12-34, Barrio Central</p>
              <p>📞 Teléfono: 312 456 7890</p>
            </div>
            <div className="mt-6 flex gap-3">
              <Button className="flex-1 bg-[#1c6554] hover:bg-[#1c6554]/90 text-white">Marcar como Entregado</Button>
              <Button variant="outline" className="flex-1">Ver Ruta en Mapa</Button>
            </div>
          </div>
          
          <div className="text-center py-6 text-slate-500 text-sm">
            No tienes más órdenes pendientes en este momento.
          </div>
        </div>

        <div className="space-y-4">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">Resumen del Día</h2>
          <div className="bg-slate-100 dark:bg-slate-800/50 rounded-xl p-6 border border-slate-200 dark:border-slate-700">
            <div className="space-y-4">
              <div className="flex justify-between">
                <span className="text-slate-500">Entregas exitosas</span>
                <span className="font-bold text-emerald-600">4</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Pendientes</span>
                <span className="font-bold text-amber-600">1</span>
              </div>
              <div className="w-full h-px bg-slate-200 dark:bg-slate-700"></div>
              <div className="flex justify-between">
                <span className="text-slate-500">Total asignadas</span>
                <span className="font-bold">5</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
