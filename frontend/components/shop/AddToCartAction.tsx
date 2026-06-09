'use client';

import { useCart } from '@/context/CartContext';
import type { Product } from '@/lib/types';

interface AddToCartActionProps {
  product: Product;
}

export default function AddToCartAction({ product }: AddToCartActionProps) {
  const { items, addItem, updateQuantity } = useCart();
  const cartItem = items.find((item) => item.product.id === product.id);
  const isInCart = Boolean(cartItem);
  const isOutOfStock = product.stock <= 0;

  if (isOutOfStock) {
    return (
      <button
        type="button"
        disabled
        className="w-full sm:w-auto px-8 py-4 bg-slate-100 text-slate-400 text-lg font-medium cursor-not-allowed"
      >
        Agotado
      </button>
    );
  }

  if (isInCart && cartItem) {
    return (
      <div className="flex items-center gap-4">
        <button
          type="button"
          onClick={() => updateQuantity(product.id, cartItem.quantity - 1)}
          className="w-12 h-12 flex items-center justify-center border-2 border-slate-300 hover:border-slate-400 hover:bg-slate-50 text-slate-700 font-bold text-xl transition-all"
        >
          −
        </button>
        <span className="w-16 text-center font-bold text-2xl text-slate-900">
          {cartItem.quantity}
        </span>
        <button
          type="button"
          onClick={() => updateQuantity(product.id, cartItem.quantity + 1)}
          disabled={cartItem.quantity >= product.stock}
          className="w-12 h-12 flex items-center justify-center bg-[#1c6554] hover:bg-[#1c6554]/90 text-white font-bold text-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          +
        </button>
      </div>
    );
  }

  return (
    <button
      type="button"
      onClick={() => addItem(product)}
      className="w-full sm:w-auto flex items-center justify-center gap-3 px-8 py-4 bg-[#1c6554] hover:bg-[#1c6554]/90 text-white text-lg font-bold transition-all shadow-md hover:shadow-xl hover:-translate-y-1"
    >
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
      </svg>
      Agregar al carrito
    </button>
  );
}
