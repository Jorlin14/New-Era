import OrdersTable from '@/components/dashboard/OrdersTable';

export const dynamic = 'force-dynamic';

async function getOrders() {
  try {
    // Cuando el endpoint exista: 
    // const res = await api.get('/orders');
    // return res.data.data;
    
    // Por ahora retornamos datos falsos para ver la estructura
    return [
      { id: 'ORD-123456', customerName: 'Jorlin Cliente', totalAmount: 45000, status: 'PENDING', createdAt: new Date().toISOString() },
      { id: 'ORD-789012', customerName: 'María García', totalAmount: 12500, status: 'PREPARING', createdAt: new Date(Date.now() - 86400000).toISOString() },
      { id: 'ORD-345678', customerName: 'Carlos López', totalAmount: 89000, status: 'DELIVERED', createdAt: new Date(Date.now() - 172800000).toISOString() },
    ];
  } catch (error) {
    return [];
  }
}

export default async function AdminOrdersPage() {
  const orders = await getOrders();

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <header>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
          Gestión de Órdenes
        </h1>
        <p className="text-slate-500 dark:text-slate-400 mt-1">
          Visualiza los pedidos de los clientes y actualiza sus estados.
        </p>
      </header>

      <OrdersTable initialOrders={orders} />
    </div>
  );
}
