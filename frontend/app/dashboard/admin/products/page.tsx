import { getProducts } from '@/lib/api/products';
import ProductsTable from '@/components/dashboard/ProductsTable';

export const dynamic = 'force-dynamic';

export default async function AdminProductsPage() {
  const products = await getProducts();

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <header>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
          Gestión de Productos
        </h1>
        <p className="text-slate-500 dark:text-slate-400 mt-1">
          Administra el inventario, precios y estados de los productos de la tienda.
        </p>
      </header>

      <ProductsTable initialProducts={products} />
    </div>
  );
}
