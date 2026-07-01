import React from 'react';
import { useNavigate } from 'react-router-dom';
import { formatPrice } from '../types/product';
import type { Product } from '../types/product';

interface ProductGridProps {
  products: Product[];
  translations: Record<string, string>;
}

const ProductGrid: React.FC<ProductGridProps> = ({ products, translations }) => {
  const navigate = useNavigate();

  if (!products || products.length === 0) {
    return (
      <div className="flex items-center justify-center py-16">
        <p className="text-[#2C2C2C] text-base">{translations['product.empty']}</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {products.map((product) => (
        <div
          key={product.id}
          onClick={() => navigate(`/item?id=${product.id}`)}
          className="bg-white rounded-[12px] overflow-hidden cursor-pointer hover:shadow-md transition-all hover:scale-[1.02] border border-gray-100"
        >
          <div className="relative">
            <img
              src={product.image}
              alt={product.title ?? product.name}
              className="w-full aspect-square object-cover"
            />

            {product.state === 'inactive' && (
              <span className="absolute top-2 right-2 bg-[#C69A5E] text-[#050505] text-xs font-semibold px-2 py-1 rounded-[4px]">
                {translations['product.coming_soon']}
              </span>
            )}

            {product.available === 0 && (
              <div className="absolute bottom-0 left-0 right-0 bg-black/60 text-white text-xs font-semibold text-center py-2">
                {translations['product.unavailable']}
              </div>
            )}
          </div>

          <div className="p-3">
            <p className="text-[#2C2C2C] font-semibold text-sm leading-snug line-clamp-1">
              {product.title ?? product.name}
            </p>
            <p className="text-[#1E88E5] font-bold text-sm mt-1">
              {formatPrice(product.price, product.currency)}
            </p>
            <p className="text-gray-500 text-xs mt-1 line-clamp-2 leading-relaxed">
              {product.description}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ProductGrid;
