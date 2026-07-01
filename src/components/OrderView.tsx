import React from 'react';
import { useNavigate } from 'react-router-dom';
import type { Order, OrderExtra } from '../types/order';
import { formatPrice } from '../types/product';

interface OrderViewProps {
  order: Order | OrderExtra;
  translations: Record<string, string>;
}

const OrderView: React.FC<OrderViewProps> = ({ order, translations }) => {
  const navigate = useNavigate();

  const isAwaitingPayment = order.state === 'awaiting_payment' && !!order.payment_url;
  const headerTitle =
    order.state === 'completed'
      ? translations['order.title.completed']
      : isAwaitingPayment
      ? translations['order.title.awaiting_payment']
      : translations['order.default_title'];

  return (
    <div className="min-h-screen bg-[#F5F5F5]">
      <div className="max-w-2xl mx-auto px-4 pt-6 pb-28 md:pb-8">

        {/* Header */}
        <h1 className="text-[#2C2C2C] font-bold text-lg text-center mb-6">
          {headerTitle}
        </h1>

        {/* Order Detail */}
        <div className="bg-white rounded-[12px] p-4 mb-4">
          <p className="text-xs text-gray-500 mb-1">
            {translations['order.order_detail.order_number']}
          </p>
          <p className="text-[#2C2C2C] font-bold text-2xl mb-4 break-all">
            {order.order_number}
          </p>
          <div className="flex justify-between text-sm text-[#2C2C2C]">
            <span className="font-medium">{translations['order.order_detail.order_time']}</span>
            <span>{new Date(order.created_on * 1000).toLocaleString()}</span>
          </div>
        </div>

        {/* Customer Detail */}
        <div className="bg-white rounded-[12px] p-4 mb-4">
          <p className="text-[#2C2C2C] font-bold text-sm mb-3">
            {translations['order.customer_detail']}
          </p>
          <div className="flex flex-col gap-2 text-sm text-[#2C2C2C]">
            <div className="flex justify-between">
              <span className="font-medium">{translations['order.customer_detail.name']}:</span>
              <span>{order.billing_address?.name ?? '—'}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium">{translations['order.customer_detail.telephone']}:</span>
              <span>{order.billing_address?.telephone ?? '—'}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium">{translations['order.customer_detail.email']}:</span>
              <span className="break-all">{order.billing_address?.email ?? '—'}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium">{translations['order.order_detail.payment_method']}:</span>
              <span>{order.payment_channel ?? order.payment_service ?? '—'}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium">{translations['order.order_detail.shipping_method']}:</span>
              <span>{order.shipping_name ?? '—'}</span>
            </div>
          </div>
        </div>

        {/* Item Stack */}
        {order.contents.length > 0 && (
          <div className="flex flex-col gap-3 mb-4">
            {order.contents.map((item) => (
              <div key={item.product_id} className="bg-white rounded-[12px] p-3 flex items-center gap-3">
                <img
                  src={item.image ?? ''}
                  alt={item.title ?? item.name ?? ''}
                  className="w-16 h-16 object-cover rounded-[8px] shrink-0 bg-gray-100"
                />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-[#2C2C2C] break-words">
                    {item.title ?? item.name}
                  </p>
                  <div className="flex items-center gap-3 mt-1">
                    <span className="text-sm text-[#2C2C2C]">
                      {formatPrice(item.price, item.currency)}
                    </span>
                    <span className="text-xs text-gray-500">
                      {translations['order.quantity']}: {item.amount}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Desktop in-flow buttons */}
        <div className="hidden md:flex justify-center gap-3 mt-4">
          <button
            onClick={() => navigate('/')}
            className="px-6 py-3 rounded-[4px] bg-[#C69A5E] text-[#050505] font-semibold text-sm hover:opacity-90 transition-opacity cursor-pointer"
          >
            {translations['order.return_to_store_btn']}
          </button>
          {isAwaitingPayment && (
            <button
              onClick={() => window.open(order.payment_url, '_blank')}
              className="px-6 py-3 rounded-[12px] bg-[#1E88E5] text-white font-semibold text-sm hover:opacity-90 transition-opacity cursor-pointer"
            >
              {translations['order.pay_now_btn']}
            </button>
          )}
        </div>
      </div>

      {/* Mobile only: persistent fixed bottom panel */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-gray-200 px-4 pt-4 pb-6 shadow-lg">
        <div className="w-full flex justify-center gap-3">
          <button
            onClick={() => navigate('/')}
            className="flex-1 py-3 rounded-[4px] bg-[#C69A5E] text-[#050505] font-semibold text-sm hover:opacity-90 transition-opacity cursor-pointer"
          >
            {translations['order.return_to_store_btn']}
          </button>
          {isAwaitingPayment && (
            <button
              onClick={() => window.open(order.payment_url, '_blank')}
              className="flex-1 py-3 rounded-[12px] bg-[#1E88E5] text-white font-semibold text-sm hover:opacity-90 transition-opacity cursor-pointer"
            >
              {translations['order.pay_now_btn']}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default OrderView;
