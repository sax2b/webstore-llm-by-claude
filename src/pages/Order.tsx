import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import LoadingIndicator from '../components/LoadingIndicator';
import OrderView from '../components/OrderView';
import Header from '../components/Header';
import { useCart } from '../context/CartContext';
import { GetOrder } from '../api/api';
import type { OrderExtra } from '../types/order';

interface OrderProps {
  translations: Record<string, string>;
  currentLocale: string;
  setCurrentLocale: (locale: string) => void;
}

const Order: React.FC<OrderProps> = ({ translations, currentLocale, setCurrentLocale }) => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { setHideNav } = useCart();

  const emailParam = searchParams.get('e');
  const orderParam = searchParams.get('o');
  const hasParams = !!emailParam && !!orderParam;

  const [order, setOrder] = useState<OrderExtra | null>(null);
  const [loading, setLoading] = useState(hasParams);
  const [email, setEmail] = useState('');
  const [orderNumber, setOrderNumber] = useState('');
  const [busySearch, setBusySearch] = useState(false);

  useEffect(() => {
    if (hasParams) {
      setHideNav(true);
      GetOrder(emailParam!, orderParam!)
        .then((data) => {
          setOrder(data);
          setLoading(false);
        })
        .catch(() => {
          setLoading(false);
        });
    } else {
      setHideNav(false);
    }
  }, [emailParam, orderParam, hasParams, setHideNav]);

  if (hasParams) {
    if (loading) return <LoadingIndicator fullPage />;
    if (order) return <OrderView order={order} translations={translations} />;
    return (
      <div className="min-h-screen bg-[#F5F5F5] flex items-center justify-center px-4">
        <p className="text-gray-400 text-sm">Order not found.</p>
      </div>
    );
  }

  const handleSearch = async () => {
    if (!email.trim() || !orderNumber.trim()) return;
    setBusySearch(true);
    try {
      const data = await GetOrder(email.trim(), orderNumber.trim());
      navigate(
        `/complete?e=${encodeURIComponent(email.trim())}&o=${encodeURIComponent(orderNumber.trim())}`,
        { state: { order: data } }
      );
    } catch {
      // keep form visible, user can retry
    } finally {
      setBusySearch(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F5F5F5] pb-14">
      <Header
        currentLocale={currentLocale}
        setCurrentLocale={setCurrentLocale}
        translations={translations}
      />
      <div className="max-w-md mx-auto px-4 pt-12">
        <div className="text-center mb-8">
          <h1 className="text-[#2C2C2C] font-bold text-lg mb-2">
            {translations['order.search_title']}
          </h1>
          <p className="text-sm text-gray-500">
            {translations['order.search_description']}
          </p>
        </div>

        <div className="flex flex-col gap-4">
          <div>
            <label className="block text-xs text-[#2C2C2C] font-medium mb-1">
              {translations['order.search_input.email']}
            </label>
            <input
              type="text"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border border-[#CCCCCC] rounded-[12px] px-3 py-2 text-sm text-[#2C2C2C] outline-none focus:border-[#1E88E5]"
            />
          </div>
          <div>
            <label className="block text-xs text-[#2C2C2C] font-medium mb-1">
              {translations['order.search_input.order_number']}
            </label>
            <input
              type="text"
              value={orderNumber}
              onChange={(e) => setOrderNumber(e.target.value)}
              className="w-full border border-[#CCCCCC] rounded-[12px] px-3 py-2 text-sm text-[#2C2C2C] outline-none focus:border-[#1E88E5]"
            />
          </div>
          <button
            onClick={handleSearch}
            disabled={!email.trim() || !orderNumber.trim() || busySearch}
            className="w-full py-3 rounded-[12px] bg-[#1E88E5] text-white font-semibold text-sm hover:opacity-90 transition-opacity cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
          >
            {busySearch ? <LoadingIndicator /> : translations['order.search_btn']}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Order;
