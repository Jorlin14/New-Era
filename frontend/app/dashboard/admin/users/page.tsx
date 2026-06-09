import UsersTable from '@/components/dashboard/UsersTable';
import api from '@/lib/api/axios';

export const dynamic = 'force-dynamic';

async function getUsers() {
  try {
    // Cuando el endpoint exista: 
    // const res = await api.get('/users');
    // return res.data.data;
    
    // Por ahora retornamos datos falsos para ver la estructura
    return [
      { id: '1', name: 'Admin User', email: 'admin@newera.com', role: 'ADMIN', isActive: true },
      { id: '2', name: 'Jorlin Cliente', email: 'jorlin@test.com', role: 'CUSTOMER', isActive: true },
      { id: '3', name: 'Repartidor 1', email: 'moto@newera.com', role: 'DELIVERER', isActive: true },
      { id: '4', name: 'Caja Principal', email: 'caja1@newera.com', role: 'CASHIER', isActive: true },
    ];
  } catch (error) {
    return [];
  }
}

export default async function AdminUsersPage() {
  const users = await getUsers();

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <header>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
          Gestión de Usuarios
        </h1>
        <p className="text-slate-500 dark:text-slate-400 mt-1">
          Administra los roles y cuentas de los clientes y empleados.
        </p>
      </header>

      <UsersTable initialUsers={users} />
    </div>
  );
}
