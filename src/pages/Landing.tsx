import React, { useEffect, useState } from 'react';
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

  return (
    <div className="min-h-screen bg-[#F5F5F5]">
      <Header
        currentLocale={currentLocale}
        setCurrentLocale={setCurrentLocale}
      />

      <div className="relative w-full bg-[#F5F5F5] py-12 px-6 mb-6 text-center overflow-hidden">
        {shopData?.storefront_background_image_url && (
          <img
            src={shopData.storefront_background_image_url}
            alt=""
            className="absolute inset-0 w-full h-full object-cover"
          />
        )}
        <div className="relative z-10">
          <h1 className="text-[#2C2C2C] font-bold mb-3">
            {translations['hero.title']}
          </h1>
          <p className="text-[#2C2C2C] text-base max-w-xl mx-auto">
            {translations['hero.slogan']}
          </p>
        </div>
      </div>

      <div className="px-4 pb-12 max-w-7xl mx-auto">
        <h2 className="text-[#2C2C2C] font-bold mb-4">
          {translations['product.header']}
        </h2>
        <ProductGrid products={products} translations={translations} />
      </div>
    </div>
  );
};

export default Landing;
