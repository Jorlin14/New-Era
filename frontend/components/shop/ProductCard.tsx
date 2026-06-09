
'use client';

import { useCart } from '@/context/CartContext';
import { useCurrency } from '@/context/CurrencyContext';
import type { Product } from '@/lib/types';

interface ProductCardProps {
    product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const { items, addItem, updateQuantity } = useCart();
  const { formatPrice } = useCurrency();
  const cartItem = items.find((item) => item.product.id === product.id);
  const isInCart = Boolean(cartItem);
  const isOutOfStock = product.stock <= 0;

  return (
    <article className="group relative bg-white border border-slate-200 overflow-hidden transition-all duration-200 hover:shadow-lg hover:-translate-y-1">
      <div className="relative aspect-square bg-slate-100 flex items-center justify-center overflow-hidden">
        <svg 
          className="w-24 h-24 text-slate-300 transition-transform duration-300 group-hover:scale-110" 
          fill="none" 
          viewBox="0 0 24 24" 
          stroke="currentColor" 
          strokeWidth={1}
          aria-hidden="true"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
        </svg>

        {isOutOfStock && (
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center">
            <span className="px-4 py-2 bg-red-500 text-white text-sm font-semibold">Agotado</span>
          </div>
        )}

        {product.stock > 0 && product.stock <= 10 && (
          <div className="absolute top-3 right-3 px-2.5 py-1 bg-amber-500 text-white text-xs font-bold">
            ¡Solo {product.stock}!
          </div>
        )}

        {product.category && !isOutOfStock && (
          <div className="absolute top-3 left-3 px-2.5 py-1 bg-white/90 backdrop-blur-sm text-xs font-medium text-slate-600">
            {product.category.name}
          </div>
        )}
      </div>

      <div className="p-4">
        <h3 className="font-semibold text-slate-900 text-sm line-clamp-2 leading-snug min-h-[2.5rem]">
          {product.name}
        </h3>

        {product.description && (
          <p className="text-xs text-slate-500 mt-1 line-clamp-1">
            {product.description}
          </p>
        )}

        <div className="mt-3">
          <p className="text-xl font-bold text-[#1c6554]">
            {formatPrice(product.price)}
          </p>
          {product.stock > 10 && (
            <p className="text-xs text-slate-400 mt-0.5">Disponible</p>
          )}
        </div>

        <div className="mt-4">
          {isOutOfStock ? (
            <button
              type="button"
              disabled
              className="w-full py-2.5 bg-slate-100 text-slate-400 text-sm font-medium cursor-not-allowed"
            >
              Sin stock
            </button>
          ) : isInCart && cartItem ? (
            <QuantityControls
              quantity={cartItem.quantity}
              maxQuantity={product.stock}
              onDecrease={() => updateQuantity(product.id, cartItem.quantity - 1)}
              onIncrease={() => updateQuantity(product.id, cartItem.quantity + 1)}
            />
          ) : (
            <button
              type="button"
              onClick={() => addItem(product)}
              className="w-full py-2.5 bg-[#1c6554] hover:bg-[#1c6554]/90 text-white text-sm font-semibold transition-all hover-lift flex items-center justify-center gap-2 shadow-md hover:shadow-lg"
            >
              <PlusIcon />
              Agregar
            </button>
          )}
        </div>
      </div>
    </article>
  );
}

interface QuantityControlsProps {
    quantity: number;
    maxQuantity: number;
    onDecrease: () => void;
    onIncrease: () => void;
}

function QuantityControls({ quantity, maxQuantity, onDecrease, onIncrease }: QuantityControlsProps) {
  return (
    <div className="flex items-center gap-2">
      <button
        type="button"
        onClick={onDecrease}
        className="flex-1 py-2.5 border border-slate-300 hover:bg-slate-50 text-slate-700 font-semibold transition-colors"
        aria-label="Disminuir cantidad"
      >
        −
      </button>
      <span className="w-12 text-center font-bold text-slate-900">{quantity}</span>
      <button
        type="button"
        onClick={onIncrease}
        disabled={quantity >= maxQuantity}
        className="flex-1 py-2.5 bg-[#1c6554] hover:bg-[#1c6554]/90 text-white font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        aria-label="Aumentar cantidad"
      >
        +
      </button>
    </div>
  );
}

function PlusIcon() {
  return (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
    </svg>
  );
}
