export default function ShopCatalogPage() {
  return (
    <div className="container mx-auto p-4 md:flex gap-6">
      <aside className="w-full md:w-1/4 hidden md:block">
        <h2 className="text-lg font-semibold mb-4">Filtros por Categoría</h2>
        {/* Sidebar de filtros irá aquí */}
      </aside>
      <main className="flex-1">
        <h1 className="text-2xl font-bold mb-4">Catálogo Completo</h1>
        {/* Buscador y Paginación irán aquí */}
      </main>
    </div>
  );
}
