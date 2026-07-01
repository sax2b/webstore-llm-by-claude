import React, { useState } from 'react';
import { Trash2, Minus, Plus } from 'lucide-react';
import type { CartItem } from '../types/cart';
import { formatPrice } from '../types/product';
import { UpdateCartContents } from '../api/api';

interface CartItemCardProps {
  item: CartItem;
  onUpdate: () => void;
}

const CartItemCard: React.FC<CartItemCardProps> = ({ item, onUpdate }) => {
  const [qty, setQty] = useState(item.amount);
  const [busy, setBusy] = useState(false);

  const handleAction = async (newAmount: number) => {
    if (busy) return;
    setBusy(true);
    const prev = qty;
    setQty(newAmount);
    try {
      await UpdateCartContents(item.product_id, newAmount);
      onUpdate();
    } catch {
      setQty(prev);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="relative flex items-start gap-3 bg-white rounded-[12px] p-4">
      <img
        src={item.image ?? '/placeholder.png'}
        alt={item.title ?? item.name ?? ''}
        className="w-20 h-20 rounded-[12px] object-cover flex-shrink-0"
      />

      <div className="flex-1 min-w-0 pr-16 pb-10">
        <p className="text-[#2C2C2C] font-semibold text-sm leading-snug break-words">
          {item.title ?? item.name}
        </p>
        <p className="text-[#1E88E5] font-bold text-sm mt-1">
          {formatPrice(item.price, item.currency)}
        </p>
      </div>

      <button
        onClick={() => handleAction(0)}
        disabled={busy}
        className="absolute top-2 right-2 p-1.5 rounded-[4px] text-gray-400 hover:text-[#EF5350] hover:bg-red-50 transition-colors cursor-pointer disabled:opacity-50"
      >
        <Trash2 className="w-4 h-4" />
      </button>

      <div className="absolute bottom-2 right-2 flex items-center gap-2">
        <button
          onClick={() => handleAction(qty - 1)}
          disabled={busy || qty <= 1}
          className="p-1 rounded-[4px] border border-gray-200 hover:border-[#1E88E5] transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Minus className="w-3 h-3 text-[#2C2C2C]" />
        </button>
        <span className="text-[#2C2C2C] font-semibold text-sm w-6 text-center">
          {qty}
        </span>
        <button
          onClick={() => handleAction(qty + 1)}
          disabled={busy}
          className="p-1 rounded-[4px] border border-gray-200 hover:border-[#1E88E5] transition-colors cursor-pointer disabled:opacity-50"
        >
          <Plus className="w-3 h-3 text-[#2C2C2C]" />
        </button>
      </div>
    </div>
  );
};

export default CartItemCard;
