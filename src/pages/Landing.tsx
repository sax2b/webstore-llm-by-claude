import React, { useEffect, useRef, useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { useShop } from '../context/ShopContext';
import { useCart } from '../context/CartContext';
import Header from '../components/Header';
import ProductGrid from '../components/ProductGrid';
import LoadingIndicator from '../components/LoadingIndicator';
import { ListProducts, GetCart } from '../api/api';
import type { Product } from '../types/product';

interface LandingProps {
  translations: Record<string, string>;
  currentLocale: string;
  setCurrentLocale: (locale: string) => void;
}

const Landing: React.FC<LandingProps> = ({ translations, currentLocale, setCurrentLocale }) => {
  const { shopData } = useShop();
  const { setCartCount } = useCart();
  const [products, setProducts] = useState<Product[]>([]);
  const [productsLoading, setProductsLoading] = useState(true);
  const productsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    ListProducts()
      .then((data) => {
        setProducts(data);
        setProductsLoading(false);
      })
      .catch(() => {
        setProducts([]);
        setProductsLoading(false);
      });
  }, [currentLocale]);

  useEffect(() => {
    GetCart()
      .then((cart) => {
        const total = cart.contents.reduce((sum, i) => sum + i.amount, 0);
        setCartCount(total);
      })
      .catch(() => {});
  }, [setCartCount]);

  if (productsLoading) {
    return <LoadingIndicator fullPage />;
  }

  const heroTextColor = shopData?.storefront_background_image_url ? 'text-white' : 'text-[#2C2C2C]';

  return (
    <div className="min-h-screen bg-[#F5F5F5] flex flex-col">
      <Header
        currentLocale={currentLocale}
        setCurrentLocale={setCurrentLocale}
        translations={translations}
      />

      <div className="relative w-full min-h-screen bg-[#F5F5F5] flex flex-col items-center justify-center px-6 text-center overflow-hidden mb-4">
        {shopData?.storefront_background_image_url && (
          <>
            <img
              src={shopData.storefront_background_image_url}
              alt=""
              className="absolute inset-0 w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/60" />
          </>
        )}
        <div className={`relative z-10 flex flex-col items-center ${heroTextColor}`}>
          <h1 className="text-4xl md:text-6xl font-bold">
            {translations['hero.title']}
          </h1>
          <p className="text-base max-w-xl mx-auto mt-3">
            {translations['hero.slogan']}
          </p>
        </div>

        <button
          onClick={() => productsRef.current?.scrollIntoView({ behavior: 'smooth' })}
          className={`absolute bottom-32 left-1/2 -translate-x-1/2 animate-bounce cursor-pointer ${heroTextColor}`}
          aria-label={translations['product.header']}
        >
          <ChevronDown className="w-8 h-8" />
        </button>
      </div>

      <div ref={productsRef} className="px-4 pb-12 max-w-7xl mx-auto scroll-mt-20">
        <h2 className="text-[#2C2C2C] text-lg font-bold mb-4">
          {translations['product.header']}
        </h2>
        <ProductGrid products={products} translations={translations} />
      </div>
    </div>
  );
};

export default Landing;
