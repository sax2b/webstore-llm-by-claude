import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { ArrowLeft, Minus, Plus } from 'lucide-react';
import type { Product } from '../types/product';
import { formatPrice } from '../types/product';
import LoadingIndicator from '../components/LoadingIndicator';
import Header from '../components/Header';
import { useCart } from '../context/CartContext';
import { GetProduct, UpdateCartContents, GetCart } from '../api/api';

interface ItemProps {
  translations: Record<string, string>;
  currentLocale: string;
  setCurrentLocale: (locale: string) => void;
}

const Item: React.FC<ItemProps> = ({ translations, currentLocale, setCurrentLocale }) => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const id = searchParams.get('id');
  const { setCartCount } = useCart();

  const [loading, setLoading] = useState(true);
  const [product, setProduct] = useState<Product | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (!id) {
      navigate('/');
      return;
    }

    GetProduct(id)
      .then((p) => {
        setProduct(p);
        setLoading(false);
      })
      .catch(() => {
        navigate('/');
      });
  }, [id, navigate]);

  const handleBack = () => {
    if (window.history.state?.idx > 0) {
      navigate(-1);
    } else {
      navigate('/');
    }
  };

  const isDisabled = !product || product.state === 'inactive' || product.available === 0;

  const handleAddToCart = async () => {
    if (!product || busy) return;
    setBusy(true);
    try {
      await UpdateCartContents(product.id, quantity);
      const cart = await GetCart();
      const total = cart.contents.reduce((sum, item) => sum + item.amount, 0);
      setCartCount(total);
    } catch {
      // silent fail
    } finally {
      setBusy(false);
    }
  };

  if (loading) {
    return <LoadingIndicator fullPage />;
  }

  if (!product) {
    return null;
  }

  const AddToCartButton = (
    <button
      onClick={handleAddToCart}
      disabled={isDisabled || busy}
      className={`w-full py-3 rounded-[12px] font-semibold text-sm transition-all flex items-center justify-center ${
        isDisabled || busy
          ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
          : 'bg-[#1E88E5] text-white hover:opacity-90 cursor-pointer'
      }`}
    >
      {busy ? <LoadingIndicator /> : translations['product.add_to_cart_btn']}
    </button>
  );

  const QuantitySelector = (
    <div className="flex items-center gap-3">
      <button
        onClick={() => setQuantity((q) => Math.max(1, q - 1))}
        className="p-2 rounded-[12px] border border-gray-200 hover:border-[#1E88E5] transition-colors cursor-pointer"
      >
        <Minus className="w-4 h-4 text-[#2C2C2C]" />
      </button>
      <span className="text-[#2C2C2C] font-semibold w-8 text-center">{quantity}</span>
      <button
        onClick={() => setQuantity((q) => Math.min(product.available, q + 1))}
        className="p-2 rounded-[12px] border border-gray-200 hover:border-[#1E88E5] transition-colors cursor-pointer"
      >
        <Plus className="w-4 h-4 text-[#2C2C2C]" />
      </button>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#F5F5F5]">
      <Header
        currentLocale={currentLocale}
        setCurrentLocale={setCurrentLocale}
      />

      <button
        onClick={handleBack}
        className="fixed top-20 left-4 z-40 p-2 bg-white rounded-[12px] shadow-md hover:shadow-lg transition-shadow cursor-pointer"
      >
        <ArrowLeft className="w-5 h-5 text-[#2C2C2C]" />
      </button>

      {/* Desktop layout */}
      <div className="hidden md:flex max-w-5xl mx-auto px-6 py-8 gap-8 h-[calc(100vh-64px)]">
        <div className="flex-1 flex items-center justify-center">
          <img
            src={product.image}
            alt={product.title ?? product.name}
            className="w-full max-w-md rounded-[12px] object-cover aspect-square"
          />
        </div>

        <div className="flex-1 flex flex-col h-full overflow-hidden">
          <div className="flex-none pb-4 border-b border-gray-200">
            <h1 className="text-[#2C2C2C] font-bold mb-2">{product.title ?? product.name}</h1>
            <p className="text-[#1E88E5] font-bold text-xl mb-1">
              {formatPrice(product.price, product.currency)}
            </p>
            <p className="text-gray-500 text-sm">
              {product.available > 0 ? `${product.available} in stock` : 'Out of stock'}
            </p>
          </div>

          <div className="flex-1 overflow-y-auto py-4">
            <p className="text-[#2C2C2C] text-sm leading-relaxed">{product.description}</p>
          </div>

          <div className="flex-none pt-4 border-t border-gray-200 space-y-4">
            {QuantitySelector}
            {AddToCartButton}
          </div>
        </div>
      </div>

      {/* Mobile layout */}
      <div className="md:hidden flex flex-col pb-32">
        <div className="w-full">
          <img
            src={product.image}
            alt={product.title ?? product.name}
            className="w-full aspect-square object-cover"
          />
        </div>

        <div className="px-4 pt-4 pb-2 border-b border-gray-200">
          <h1 className="text-[#2C2C2C] font-bold mb-1">{product.title ?? product.name}</h1>
          <p className="text-[#1E88E5] font-bold text-xl mb-1">
            {formatPrice(product.price, product.currency)}
          </p>
          <p className="text-gray-500 text-sm">
            {product.available > 0 ? `${product.available} in stock` : 'Out of stock'}
          </p>
        </div>

        <div className="px-4 py-4 overflow-y-auto">
          <p className="text-[#2C2C2C] text-sm leading-relaxed">{product.description}</p>
        </div>
      </div>

      {/* Mobile sticky footer */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-4 py-3 flex items-center gap-3 z-[55]">
        {QuantitySelector}
        <div className="flex-1">{AddToCartButton}</div>
      </div>
    </div>
  );
};

export default Item;
