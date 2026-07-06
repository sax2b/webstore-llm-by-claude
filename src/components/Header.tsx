import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ShoppingCart, ChevronDown } from 'lucide-react';
import { useShop } from '../context/ShopContext';
import { useCart } from '../context/CartContext';
import { localeDisplayMap } from '../i18n/i18n';
import { NAV_ITEMS } from './NavConfig';

interface HeaderProps {
  currentLocale: string;
  setCurrentLocale: (locale: string) => void;
  translations: Record<string, string>;
}

const Header: React.FC<HeaderProps> = ({ currentLocale, setCurrentLocale, translations }) => {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const { shopData } = useShop();
  const { cartCount } = useCart();
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const handleLocaleSelect = (locale: string) => {
    localStorage.setItem('lang', locale);
    setCurrentLocale(locale);
    setDropdownOpen(false);
  };

  const supportedLocales = (shopData?.supported_languages ?? []).filter(
    (l) => l in localeDisplayMap
  );

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-200 w-full px-4 py-3 flex items-center">
      <button
        onClick={() => navigate('/')}
        className="text-lg font-bold text-[#2C2C2C] cursor-pointer hover:text-[#1E88E5] transition-colors"
      >
        {shopData?.name ?? ''}
      </button>

      <nav className="hidden md:flex flex-1 justify-center items-center gap-6">
        {NAV_ITEMS.filter((item) => item.path !== '/').map(({ path, key }) => {
          const active = pathname === path;
          return (
            <button
              key={path}
              onClick={() => navigate(path)}
              className={`flex items-center gap-1.5 text-sm font-medium transition-colors cursor-pointer ${
                active ? 'text-[#1E88E5]' : 'text-[#2C2C2C] hover:text-[#1E88E5]'
              }`}
            >
              {/* <Icon className="w-4 h-4" /> */}
              {translations[key]}
            </button>
          );
        })}
      </nav>

      <div className="ml-auto flex items-center space-x-4">
        <div className="relative">
          <button
            onClick={() => setDropdownOpen((o) => !o)}
            className="flex items-center gap-1 px-3 py-1.5 rounded-[12px] border border-gray-200 text-sm text-[#2C2C2C] hover:border-[#1E88E5] transition-colors cursor-pointer"
          >
            {localeDisplayMap[currentLocale] ?? currentLocale}
            <ChevronDown className="w-3 h-3" />
          </button>

          {dropdownOpen && (
            <div className="absolute right-0 mt-1 bg-white border border-gray-200 rounded-[12px] shadow-md overflow-hidden z-50 min-w-[64px]">
              {supportedLocales.map((locale) => (
                <button
                  key={locale}
                  onClick={() => handleLocaleSelect(locale)}
                  className={`w-full px-4 py-2 text-sm text-left cursor-pointer transition-colors hover:bg-[#F5F5F5] ${
                    locale === currentLocale ? 'text-[#1E88E5] font-semibold' : 'text-[#2C2C2C]'
                  }`}
                >
                  {localeDisplayMap[locale]}
                </button>
              ))}
            </div>
          )}
        </div>

        <button
          onClick={() => navigate('/cart')}
          className="relative p-2 rounded-[12px] bg-[#1E88E5] text-white hover:opacity-90 transition-opacity cursor-pointer"
        >
          <ShoppingCart className="w-5 h-5" />
          {cartCount > 0 && (
            <span className="absolute -top-1 -right-1 bg-[#EF5350] text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
              {cartCount}
            </span>
          )}
        </button>
      </div>
    </header>
  );
};

export default Header;
