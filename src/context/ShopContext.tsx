/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useContext } from 'react';
import type { Shop } from '../types/shop';

interface ShopContextType {
  shopData: Shop | null;
}

const ShopContext = createContext<ShopContextType>({ shopData: null });

export const useShop = () => useContext(ShopContext);

export const ShopProvider: React.FC<{ shopData: Shop | null; children: React.ReactNode }> = ({
  shopData,
  children,
}) => {
  return <ShopContext.Provider value={{ shopData }}>{children}</ShopContext.Provider>;
};
