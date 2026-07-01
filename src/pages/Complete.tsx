import React, { useEffect, useState } from 'react';
import { useSearchParams, Navigate } from 'react-router-dom';
import LoadingIndicator from '../components/LoadingIndicator';
import OrderView from '../components/OrderView';
import { useCart } from '../context/CartContext';
import { GetOrder } from '../api/api';
import type { OrderExtra } from '../types/order';

interface CompleteProps {
  translations: Record<string, string>;
}

const Complete: React.FC<CompleteProps> = ({ translations }) => {
  const [searchParams] = useSearchParams();
  const { setHideNav } = useCart();

  const emailParam = searchParams.get('e');
  const orderParam = searchParams.get('o');
  const hasParams = !!emailParam && !!orderParam;

  const [order, setOrder] = useState<OrderExtra | null>(null);
  const [loading, setLoading] = useState(hasParams);

  useEffect(() => {
    if (!hasParams) return;
    setHideNav(true);
    GetOrder(emailParam!, orderParam!)
      .then((data) => {
        setOrder(data);
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });
    return () => setHideNav(false);
  }, [emailParam, orderParam, hasParams, setHideNav]);

  if (!hasParams) return <Navigate to="/order" replace />;
  if (loading) return <LoadingIndicator fullPage />;
  if (order) return <OrderView order={order} translations={translations} />;

  return (
    <div className="min-h-screen bg-[#F5F5F5] flex items-center justify-center px-4">
      <p className="text-gray-400 text-sm">Order not found.</p>
    </div>
  );
};

export default Complete;
