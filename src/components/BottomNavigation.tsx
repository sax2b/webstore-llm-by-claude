import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ShoppingBag, Package, ShoppingCart, ClipboardList } from 'lucide-react';
import { useCart } from '../context/CartContext';

interface BottomNavigationProps {
  translations: Record<string, string>;
}

const BottomNavigation: React.FC<BottomNavigationProps> = ({ translations }) => {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const { hideNav } = useCart();

  if (hideNav) return null;

  const tabs = [
    { path: '/', icon: ShoppingBag, label: translations['nav.shop'] },
    { path: '/products', icon: Package, label: translations['nav.product'] },
    { path: '/cart', icon: ShoppingCart, label: translations['nav.cart'] },
    { path: '/order', icon: ClipboardList, label: translations['nav.order'] },
  ];

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 h-14 bg-white border-t border-gray-200">
      <div className="flex justify-around items-center h-full">
        {tabs.map(({ path, icon: Icon, label }) => {
          const active = pathname === path;
          return (
            <button
              key={path}
              onClick={() => navigate(path)}
              className={`flex flex-col items-center gap-1 px-4 py-1 cursor-pointer transition-colors ${
                active ? 'text-[#1E88E5]' : 'text-gray-400'
              }`}
            >
              <Icon className="w-5 h-5" />
              <span className="text-xs font-medium">{label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};

export default BottomNavigation;
