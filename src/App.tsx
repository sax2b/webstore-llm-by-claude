import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { fetchTranslations, SUPPORTED_LOCALES, DEFAULT_LOCALE } from './i18n/i18n';
import type { Shop } from './types/shop';
import { checkSession, fetchShopConfig } from './api/api';
import { ShopProvider } from './context/ShopContext';
import { CartProvider } from './context/CartContext';
import LoadingIndicator from './components/LoadingIndicator';
import Landing from './pages/Landing';
import Item from './pages/Item';
import Products from './pages/Products';
import Cart from './pages/Cart';
import Order from './pages/Order';
import Complete from './pages/Complete';
import BottomNavigation from './components/BottomNavigation';

export default function App() {
  const [currentLocale, setCurrentLocale] = useState<string>(
    localStorage.getItem('lang') ?? DEFAULT_LOCALE
  );
  const [translations, setTranslations] = useState<Record<string, string> | null>(null);
  const [shopConfig, setShopConfig] = useState<Shop | null>(null);

  useEffect(() => {
    const init = async () => {
      await checkSession();
      const shop = await fetchShopConfig();
      setShopConfig(shop);
    };
    init();
  }, []);

  useEffect(() => {
    fetchTranslations(currentLocale, SUPPORTED_LOCALES).then((t) => {
      setTranslations(t as Record<string, string>);
    });
  }, [currentLocale]);

  if (!translations || !shopConfig) {
    return <LoadingIndicator fullPage />;
  }

  return (
    <CartProvider>
      <ShopProvider shopData={shopConfig}>
      <BrowserRouter>
        <Routes>
          <Route
            path="/"
            element={
              <Landing
                translations={translations}
                currentLocale={currentLocale}
                setCurrentLocale={setCurrentLocale}
              />
            }
          />
          <Route
            path="/item"
            element={
              <Item
                translations={translations}
                currentLocale={currentLocale}
                setCurrentLocale={setCurrentLocale}
              />
            }
          />
          <Route
            path="/products"
            element={
              <Products
                translations={translations}
                currentLocale={currentLocale}
                setCurrentLocale={setCurrentLocale}
              />
            }
          />
          <Route
            path="/cart"
            element={
              <Cart
                translations={translations}
              />
            }
          />
          <Route
            path="/complete"
            element={<Complete translations={translations} />}
          />
          <Route
            path="/order"
            element={
              <Order
                translations={translations}
                currentLocale={currentLocale}
                setCurrentLocale={setCurrentLocale}
              />
            }
          />
        </Routes>
        <BottomNavigation translations={translations} />
      </BrowserRouter>
      </ShopProvider>
    </CartProvider>
  );
}
