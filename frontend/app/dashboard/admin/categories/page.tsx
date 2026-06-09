import { getCategories } from '@/lib/api/categories';
import CategoriesTable from '@/components/dashboard/CategoriesTable';

export const dynamic = 'force-dynamic';

export default async function AdminCategoriesPage() {
  const categories = await getCategories();

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <header>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
          Gestión de Categorías
        </h1>
        <p className="text-slate-500 dark:text-slate-400 mt-1">
          Organiza y clasifica los productos en tu tienda.
        </p>
      </header>

      <CategoriesTable initialCategories={categories} />
    </div>
  );
}
