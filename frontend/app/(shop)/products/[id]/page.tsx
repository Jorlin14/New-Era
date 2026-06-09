import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getProductById } from '@/lib/api/products';
import PriceDisplay from '@/components/shop/PriceDisplay';
import AddToCartAction from '@/components/shop/AddToCartAction';

export default async function ProductDetailPage({ params }: { params: { id: string } }) {
  try {
    const product = await getProductById(params.id);

    if (!product) {
      notFound();
    }

    return (
      <main className="min-h-screen bg-slate-50 dark:bg-slate-900 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* BREADCRUMBS */}
          <nav className="mb-8 flex text-sm text-slate-500 dark:text-slate-400">
            <Link href="/" className="hover:text-[#1c6554] transition-colors">Inicio</Link>
            <span className="mx-2">/</span>
            <Link href="/#productos" className="hover:text-[#1c6554] transition-colors">Productos</Link>
            <span className="mx-2">/</span>
            {product.category && (
              <>
                <Link href="/#productos" className="hover:text-[#1c6554] transition-colors">
                  {product.category.name}
                </Link>
                <span className="mx-2">/</span>
              </>
            )}
            <span className="text-slate-900 dark:text-white font-medium">{product.name}</span>
          </nav>

          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl overflow-hidden border border-slate-100 dark:border-slate-700/50">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-0 lg:gap-8">
              {/* PRODUCT IMAGE */}
              <div className="bg-slate-100 dark:bg-slate-700/30 aspect-square lg:aspect-auto min-h-[400px] flex items-center justify-center p-12 relative">
                <svg
                  className="w-48 h-48 text-slate-300 dark:text-slate-600 drop-shadow-xl"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={1}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>

                {product.stock <= 0 && (
                  <div className="absolute top-6 right-6">
                    <span className="px-4 py-2 bg-red-500 text-white font-bold rounded-full text-sm shadow-lg uppercase tracking-wide">
                      Agotado
                    </span>
                  </div>
                )}
              </div>

              {/* PRODUCT INFO */}
              <div className="p-8 lg:p-12 flex flex-col justify-center">
                {product.category && (
                  <span className="inline-block px-3 py-1 bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 text-sm font-semibold rounded-full mb-4 w-fit">
                    {product.category.name}
                  </span>
                )}

                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 dark:text-white leading-tight mb-4 tracking-tight">
                  {product.name}
                </h1>

                <div className="flex items-end gap-4 mb-6">
                  <PriceDisplay price={product.price} className="text-4xl font-black text-[#1c6554] dark:text-[#25826c]" />
                  {product.stock > 0 && (
                    <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-1.5">
                      {product.stock} unidades en stock
                    </p>
                  )}
                </div>

                <div className="w-full h-px bg-slate-200 dark:bg-slate-700 my-6" />

                <div className="prose prose-slate dark:prose-invert max-w-none mb-10">
                  <h3 className="text-lg font-bold mb-2">Descripción del producto</h3>
                  <p className="text-slate-600 dark:text-slate-300 leading-relaxed text-lg">
                    {product.description || 'Este producto no cuenta con una descripción detallada por el momento.'}
                  </p>
                </div>

                {/* ADD TO CART */}
                <div className="mt-auto pt-6">
                  <AddToCartAction product={product} />

                  <div className="mt-6 flex items-center gap-6 text-sm text-slate-500 dark:text-slate-400">
                    <div className="flex items-center gap-2">
                      <svg className="w-5 h-5 text-[#1c6554]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      Garantía de calidad
                    </div>
                    <div className="flex items-center gap-2">
                      <svg className="w-5 h-5 text-[#1c6554]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      Entrega rápida
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    );
  } catch {
    notFound();
  }
}
