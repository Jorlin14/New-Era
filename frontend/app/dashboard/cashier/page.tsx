'use client';

import { useAuth } from '@/context/AuthContext';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function CashierDashboardPage() {
  const { user } = useAuth();

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 h-[calc(100vh-8rem)] flex flex-col">
      <header className="flex justify-between items-center shrink-0">
        <div>
          <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">
            Punto de Venta 💵
          </h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">
            Caja Activa - Operador: {user?.name?.split(' ')[0] ?? ''}
          </p>
        </div>
        <div className="flex gap-4">
          <Link href="/dashboard/cashier/orders">
            <Button variant="outline" className="border-[#1c6554] text-[#1c6554] hover:bg-[#1c6554] hover:text-white">
              Ver Órdenes Activas
            </Button>
          </Link>
          <Button variant="destructive">Cerrar Turno</Button>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 flex-1 min-h-0">
        {/* Lado Izquierdo: Buscador y Productos Rápidos */}
        <div className="lg:col-span-2 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm flex flex-col overflow-hidden">
          <div className="p-4 border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/80">
            <div className="relative">
              <svg className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <Input 
                placeholder="Buscar por código de barras o nombre del producto..." 
                className="pl-10 h-12 text-lg"
                autoFocus
              />
            </div>
          </div>
          
          <div className="flex-1 overflow-y-auto p-6">
            <div className="grid grid-cols-3 md:grid-cols-4 gap-4">
              {/* Botones rápidos de productos comunes */}
              {['Manzana', 'Plátano', 'Leche', 'Pan Integral', 'Huevos', 'Arroz', 'Coca Cola', 'Agua'].map(p => (
                <button key={p} className="h-24 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 rounded-lg flex flex-col items-center justify-center p-2 text-center transition-colors border border-slate-200 dark:border-slate-600">
                  <span className="font-semibold text-slate-700 dark:text-slate-200 text-sm">{p}</span>
                  <span className="text-[#1c6554] dark:text-[#25826c] font-bold text-xs mt-1">$2,500</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Lado Derecho: Ticket / Carrito */}
        <div className="bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm flex flex-col overflow-hidden">
          <div className="p-4 border-b border-slate-200 dark:border-slate-700 bg-[#1c6554] text-white">
            <h2 className="font-bold text-lg text-center tracking-widest uppercase">Orden Actual</h2>
          </div>
          
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            <div className="flex justify-between items-center border-b border-slate-200 dark:border-slate-700 pb-3">
              <div>
                <p className="font-semibold text-slate-800 dark:text-white">Leche Entera 1L</p>
                <p className="text-xs text-slate-500">2 x $4,500</p>
              </div>
              <p className="font-bold text-slate-900 dark:text-white">$9,000</p>
            </div>
            <div className="flex justify-between items-center border-b border-slate-200 dark:border-slate-700 pb-3">
              <div>
                <p className="font-semibold text-slate-800 dark:text-white">Pan Integral</p>
                <p className="text-xs text-slate-500">1 x $6,000</p>
              </div>
              <p className="font-bold text-slate-900 dark:text-white">$6,000</p>
            </div>
          </div>
          
          <div className="p-6 bg-white dark:bg-slate-800 border-t border-slate-200 dark:border-slate-700">
            <div className="flex justify-between items-center mb-2 text-slate-500">
              <span>Subtotal</span>
              <span>$15,000</span>
            </div>
            <div className="flex justify-between items-center mb-6 text-2xl font-black text-[#1c6554] dark:text-[#25826c]">
              <span>TOTAL</span>
              <span>$15,000</span>
            </div>
            <Button className="w-full h-14 text-lg font-bold bg-[#1c6554] hover:bg-[#1c6554]/90 text-white shadow-lg">
              Procesar Pago
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
