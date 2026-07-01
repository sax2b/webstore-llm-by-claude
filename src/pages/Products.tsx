import React, { useEffect, useState } from 'react';
import { useCart } from '../context/CartContext';
import Header from '../components/Header';
import ProductGrid from '../components/ProductGrid';
import LoadingIndicator from '../components/LoadingIndicator';
import { ListProducts, GetCart } from '../api/api';
import type { Product } from '../types/product';

interface ProductsProps {
  translations: Record<string, string>;
  currentLocale: string;
  setCurrentLocale: (locale: string) => void;
}

const Products: React.FC<ProductsProps> = ({ translations, currentLocale, setCurrentLocale }) => {
  const { setCartCount } = useCart();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    ListProducts()
      .then((data) => {
        setProducts(data);
        setLoading(false);
      })
      .catch(() => {
        setProducts([]);
        setLoading(false);
      });
  }, [currentLocale]);

  useEffect(() => {
    GetCart()
      .then((cart) => {
        const total = (cart.contents ?? []).reduce((sum, i) => sum + i.amount, 0);
        setCartCount(total);
      })
      .catch(() => {});
  }, [setCartCount]);

  if (loading) {
    return <LoadingIndicator fullPage />;
  }

  return (
    <div className="min-h-screen bg-[#F5F5F5]">
      <Header
        currentLocale={currentLocale}
        setCurrentLocale={setCurrentLocale}
      />
      <div className="px-4 pb-20 pt-6 max-w-7xl mx-auto">
        <h2 className="text-[#2C2C2C] font-bold mb-4">
          {translations['product.header']}
        </h2>
        <ProductGrid products={products} translations={translations} />
      </div>
    </div>
  );
};

export default Products;
