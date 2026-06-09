import OrdersTable from '@/components/dashboard/OrdersTable';

export const dynamic = 'force-dynamic';

async function getCustomerOrders() {
  try {
    // Aquí iría la llamada al endpoint de órdenes del cliente (filtrado por su ID en el backend)
    // const res = await api.get('/orders/my-orders');
    // return res.data.data;
    
    return [];
  } catch (error) {
    return [];
  }
}

export default async function CustomerOrdersPage() {
  const orders = await getCustomerOrders();

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <header>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
          Mis Órdenes
        </h1>
        <p className="text-slate-500 dark:text-slate-400 mt-1">
          Historial completo de tus compras.
        </p>
      </header>

      <OrdersTable initialOrders={orders} />
    </div>
  );
}
