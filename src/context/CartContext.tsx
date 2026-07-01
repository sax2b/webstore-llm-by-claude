/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useContext, useState } from 'react';

interface CartContextType {
  cartCount: number;
  setCartCount: (n: number) => void;
  hideNav: boolean;
  setHideNav: (v: boolean) => void;
}

const CartContext = createContext<CartContextType>({
  cartCount: 0,
  setCartCount: () => {},
  hideNav: false,
  setHideNav: () => {},
});

export const useCart = () => useContext(CartContext);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cartCount, setCartCount] = useState(0);
  const [hideNav, setHideNav] = useState(false);
  return (
    <CartContext.Provider value={{ cartCount, setCartCount, hideNav, setHideNav }}>
      {children}
    </CartContext.Provider>
  );
};
