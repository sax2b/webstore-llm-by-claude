import React, { useEffect, useState, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';
import CartItemCard from '../components/CartItemCard';
import LoadingIndicator from '../components/LoadingIndicator';
import { useCart } from '../context/CartContext';
import {
  GetCart,
  ListShippingConfigs,
  ListPaymentConfigs,
  UpdateCart,
  CheckoutOrder,
} from '../api/api';
import type { ShoppingCart } from '../types/cart';
import type { ShippingConfig } from '../types/shipping_config';
import type { PaymentConfig } from '../types/payment_config';
import { formatPrice } from '../types/product';
import type { Order } from '../types/order';
import OrderView from '../components/OrderView';

type CartView = 'cart' | 'checkout' | 'shipping_info' | 'order';

interface CartProps {
  translations: Record<string, string>;
}

const Cart: React.FC<CartProps> = ({ translations }) => {
  const navigate = useNavigate();
  const { setCartCount, setHideNav } = useCart();

  const [cart, setCart] = useState<ShoppingCart | null>(null);
  const [loading, setLoading] = useState(true);

  const [view, setView] = useState<CartView>('cart');
  const prevView = useRef<CartView>('cart');

  const [shippingConfigs, setShippingConfigs] = useState<ShippingConfig[]>([]);
  const [paymentConfigs, setPaymentConfigs] = useState<PaymentConfig[]>([]);
  const [selectedShippingId, setSelectedShippingId] = useState('');
  const [selectedPaymentId, setSelectedPaymentId] = useState('');
  const [shippingNote, setShippingNote] = useState('');

  const [name, setName] = useState('');
  const [telephone, setTelephone] = useState('');
  const [email, setEmail] = useState('');

  const [order, setOrder] = useState<Order | null>(null);

  const [checkoutLoading, setCheckoutLoading] = useState(false);
  const [orderLoading, setOrderLoading] = useState(false);
  const [saveLoading, setSaveLoading] = useState(false);

  const navigateTo = (next: CartView, from?: CartView) => {
    if (from !== undefined) prevView.current = from;
    setView(next);
    if (next === 'cart') {
      setHideNav(false);
    } else {
      setHideNav(true);
    }
  };

  useEffect(() => {
    GetCart()
      .then((data) => {
        setCart(data);
        const total = (data.contents ?? []).reduce((sum, item) => sum + item.amount, 0);
        setCartCount(total);
        if (data.billing_address) {
          setName(data.billing_address.name ?? '');
          setTelephone(data.billing_address.telephone ?? '');
          setEmail(data.billing_address.email ?? '');
        }
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });
  }, [setCartCount]);

  const refreshCart = useCallback(() => {
    GetCart()
      .then((data) => {
        setCart(data);
        const total = (data.contents ?? []).reduce((sum, item) => sum + item.amount, 0);
        setCartCount(total);
      })
      .catch(() => {});
  }, [setCartCount]);

  const handleCheckoutClick = async () => {
    if (!cart || checkoutLoading) return;
    setCheckoutLoading(true);
    try {
      const [sc, pc] = await Promise.all([ListShippingConfigs(), ListPaymentConfigs()]);
      setShippingConfigs(sc);
      setPaymentConfigs(pc);
      if (!cart.billing_address || !cart.billing_address.name) {
        navigateTo('shipping_info', 'cart');
      } else {
        navigateTo('checkout', 'cart');
      }
    } catch {
      // silent fail
    } finally {
      setCheckoutLoading(false);
    }
  };

  const handleSave = async () => {
    if (saveLoading) return;
    setSaveLoading(true);
    try {
      await UpdateCart({ billing_address: { name, telephone, email } });
      const updated = await GetCart();
      setCart(updated);
      navigateTo('checkout', 'shipping_info');
    } catch {
      // silent fail
    } finally {
      setSaveLoading(false);
    }
  };

  const handlePlaceOrder = async () => {
    if (orderLoading) return;
    setOrderLoading(true);
    try {
      await UpdateCart({
        shipping_id: selectedShippingId,
        payment_id: selectedPaymentId,
        shipping_notes: shippingNote,
      });
      const result = await CheckoutOrder();
      setOrder(result);
      setCartCount(0);
      navigateTo('order');
    } catch {
      // silent fail
    } finally {
      setOrderLoading(false);
    }
  };

  if (loading) return <LoadingIndicator fullPage />;

  if (view === 'order' && order) {
    return <OrderView order={order} translations={translations} />;
  }

  const hasItems = cart && (cart.contents ?? []).length > 0;

  const canPlaceOrder =
    !!name.trim() &&
    !!telephone.trim() &&
    !!email.trim() &&
    !!hasItems &&
    !!selectedShippingId &&
    !!selectedPaymentId;

  // ─── CART VIEW ───────────────────────────────────────────────────────────────
  if (view === 'cart') {
    return (
      <div className="min-h-screen bg-[#F5F5F5]">
        <div className="max-w-2xl md:max-w-5xl mx-auto px-4 pt-6 pb-72 md:pb-8">

          {/* Go back button — in-flow, above title, all viewports */}
          <div className="flex items-center mb-4">
            <button
              onClick={() => window.history.length > 1 ? navigate(-1) : navigate('/')}
              className="flex items-center gap-1 text-[#2C2C2C] hover:text-[#1E88E5] transition-colors cursor-pointer"
            >
              <ChevronLeft className="w-5 h-5" />
              <span className="text-sm font-bold">{translations['go_back_btn']}</span>
            </button>
          </div>

          {/* Page title — left aligned, all viewports */}
          <h1 className="text-[#2C2C2C] font-bold text-lg mb-4">
            {translations['cart.title']}
          </h1>

          {/* Two-column content area */}
          <div className="md:flex md:gap-2 md:items-start">

            {/* LEFT COLUMN: item list */}
            <div className="md:flex-1 md:min-w-0">
              {hasItems ? (
                <div className="flex flex-col gap-3">
                  {cart.contents.map((item) => (
                    <CartItemCard key={item.product_id} item={item} onUpdate={refreshCart} />
                  ))}
                </div>
              ) : (
                <div className="flex items-center justify-center py-16">
                  <p className="text-gray-400 text-base">{translations['cart.empty']}</p>
                </div>
              )}
            </div>

            {/* RIGHT COLUMN: desktop-only in-flow sticky price summary */}
            {hasItems && (
              <div className="hidden md:block w-72 shrink-0 sticky top-6 self-start bg-white rounded-[12px] border border-gray-200 px-4 pt-4 pb-4 shadow-sm">
                <p className="text-[#2C2C2C] font-bold text-base mb-3">
                  {translations['cart.price_summary']}
                </p>
                <div className="flex flex-col gap-2 mb-4">
                  <div className="flex justify-between text-sm text-[#2C2C2C]">
                    <span>{translations['cart.subtotal']}</span>
                    <span>{formatPrice(cart.subtotal, cart.currency)}</span>
                  </div>
                  <div className="flex justify-between text-sm text-[#2C2C2C]">
                    <span>{translations['cart.vat']}</span>
                    <span>{formatPrice(cart.vat, cart.currency)}</span>
                  </div>
                  <div className="flex justify-between font-bold text-lg text-[#2C2C2C] border-t border-gray-100 pt-2">
                    <span>{translations['cart.total']}</span>
                    <span>{formatPrice(cart.total, cart.currency)}</span>
                  </div>
                </div>
                <button
                  onClick={handleCheckoutClick}
                  disabled={checkoutLoading}
                  className="w-full py-3 rounded-[12px] bg-[#1E88E5] text-white font-semibold text-sm hover:opacity-90 transition-opacity cursor-pointer disabled:opacity-70 flex items-center justify-center"
                >
                  {checkoutLoading ? <LoadingIndicator /> : translations['cart.checkout']}
                </button>
              </div>
            )}
          </div>
        </div>

        {/* MOBILE ONLY: fixed bottom price summary panel */}
        {hasItems && (
          <div className="md:hidden fixed bottom-14 left-0 right-0 z-40 bg-white border-t border-gray-200 px-4 pt-4 pb-4 shadow-lg">
            <p className="text-[#2C2C2C] font-bold text-base mb-3">
              {translations['cart.price_summary']}
            </p>
            <div className="flex flex-col gap-2 mb-4">
              <div className="flex justify-between text-sm text-[#2C2C2C]">
                <span>{translations['cart.subtotal']}</span>
                <span>{formatPrice(cart.subtotal, cart.currency)}</span>
              </div>
              <div className="flex justify-between text-sm text-[#2C2C2C]">
                <span>{translations['cart.vat']}</span>
                <span>{formatPrice(cart.vat, cart.currency)}</span>
              </div>
              <div className="flex justify-between font-bold text-lg text-[#2C2C2C] border-t border-gray-100 pt-2">
                <span>{translations['cart.total']}</span>
                <span>{formatPrice(cart.total, cart.currency)}</span>
              </div>
            </div>
            <button
              onClick={handleCheckoutClick}
              disabled={checkoutLoading}
              className="w-full py-3 rounded-[12px] bg-[#1E88E5] text-white font-semibold text-sm hover:opacity-90 transition-opacity cursor-pointer disabled:opacity-70 flex items-center justify-center"
            >
              {checkoutLoading ? <LoadingIndicator /> : translations['cart.checkout']}
            </button>
          </div>
        )}
      </div>
    );
  }

  // ─── CHECKOUT VIEW ────────────────────────────────────────────────────────────
  if (view === 'checkout') {
    const shippingConfigCard = (
      <div className="bg-white rounded-[12px] p-4">
        <p className="text-[#2C2C2C] font-bold text-sm mb-3">
          {translations['checkout.shipping_config_option']}
        </p>
        <select
          value={selectedShippingId}
          onChange={(e) => setSelectedShippingId(e.target.value)}
          className="w-full border border-[#CCCCCC] rounded-[12px] px-3 py-2 text-sm text-[#2C2C2C] bg-white outline-none cursor-pointer mb-3"
        >
          <option value="" disabled>—</option>
          {shippingConfigs.map((sc) => (
            <option key={sc.id} value={sc.id}>{sc.name}</option>
          ))}
        </select>
        <div className="flex items-center gap-3">
          <span className="text-sm text-[#2C2C2C] shrink-0">
            {translations['checkout.shipping_note']}
          </span>
          <input
            type="text"
            value={shippingNote}
            onChange={(e) => setShippingNote(e.target.value)}
            placeholder={translations['checkout.shipping_note_placeholder']}
            className="flex-1 border border-[#CCCCCC] rounded-[12px] px-3 py-2 text-sm text-[#2C2C2C] outline-none"
          />
        </div>
      </div>
    );

    const paymentConfigCard = (
      <div className="bg-white rounded-[12px] p-4">
        <p className="text-[#2C2C2C] font-bold text-sm mb-3">
          {translations['checkout.payment_config_option']}
        </p>
        <select
          value={selectedPaymentId}
          onChange={(e) => setSelectedPaymentId(e.target.value)}
          className="w-full border border-[#CCCCCC] rounded-[12px] px-3 py-2 text-sm text-[#2C2C2C] bg-white outline-none cursor-pointer"
        >
          <option value="" disabled>—</option>
          {paymentConfigs.map((pc) => (
            <option key={pc.id} value={pc.id}>{pc.name}</option>
          ))}
        </select>
      </div>
    );

    return (
      <div className="min-h-screen bg-[#F5F5F5]">
        <div className="max-w-2xl md:max-w-5xl mx-auto px-4 pt-6 pb-72 md:pb-8">
          {/* Go back button */}
          <div className="flex items-center mb-4">
            <button
              onClick={() => navigateTo('cart')}
              className="flex items-center gap-1 text-[#2C2C2C] hover:text-[#1E88E5] transition-colors cursor-pointer"
            >
              <ChevronLeft className="w-5 h-5" />
              <span className="text-sm font-bold">{translations['go_back_btn']}</span>
            </button>
          </div>
          {/* Page title — left aligned */}
          <h1 className="text-[#2C2C2C] font-bold text-lg mb-6">
            {translations['checkout.title']}
          </h1>

          {/* Two-column area */}
          <div className="md:flex md:gap-6 md:items-start">

            {/* LEFT COLUMN */}
            <div className="md:flex-1 md:min-w-0">
              {/* Address section */}
              <div
                className="bg-[#1E88E5] rounded-[12px] p-4 mb-4 cursor-pointer"
                onClick={() => navigateTo('shipping_info', 'checkout')}
              >
                <p className="text-white font-bold text-sm mb-3">
                  {translations['checkout.delivery_address_title']}
                </p>
                <div className="flex flex-col gap-2">
                  <div>
                    <p className="text-white text-xs mb-1">
                      {translations['shipping_info.customer_detail.name']}
                    </p>
                    <input
                      type="text"
                      readOnly
                      value={name}
                      className="w-full bg-white/20 text-white placeholder-white/60 rounded-[12px] px-3 py-2 text-sm border border-white/30 cursor-pointer outline-none"
                      placeholder={translations['shipping_info.customer_detail.name']}
                    />
                  </div>
                  <div className="flex gap-2">
                    <div className="flex-1">
                      <p className="text-white text-xs mb-1">
                        {translations['shipping_info.customer_detail.telephone']}
                      </p>
                      <input
                        type="tel"
                        readOnly
                        value={telephone}
                        className="w-full bg-white/20 text-white placeholder-white/60 rounded-[12px] px-3 py-2 text-sm border border-white/30 cursor-pointer outline-none"
                        placeholder={translations['shipping_info.customer_detail.telephone']}
                      />
                    </div>
                    <div className="flex-1">
                      <p className="text-white text-xs mb-1">
                        {translations['shipping_info.customer_detail.email']}
                      </p>
                      <input
                        type="email"
                        readOnly
                        value={email}
                        className="w-full bg-white/20 text-white placeholder-white/60 rounded-[12px] px-3 py-2 text-sm border border-white/30 cursor-pointer outline-none"
                        placeholder={translations['shipping_info.customer_detail.email']}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Cart items */}
              {cart && (cart.contents ?? []).length > 0 && (
                <div className="flex flex-col gap-3 mb-4">
                  {cart.contents.map((item) => (
                    <CartItemCard key={item.product_id} item={item} onUpdate={refreshCart} />
                  ))}
                </div>
              )}

              {/* Mobile-only: shipping + payment configs */}
              <div className="md:hidden flex flex-col gap-4">
                {shippingConfigCard}
                {paymentConfigCard}
              </div>
            </div>

            {/* RIGHT COLUMN — desktop only */}
            <div className="hidden md:flex flex-col w-80 shrink-0 sticky top-6 self-start gap-4">
              {shippingConfigCard}
              {paymentConfigCard}
              {/* Desktop in-flow price summary + place order */}
              <div className="bg-white rounded-[12px] border border-gray-200 px-4 pt-4 pb-4 shadow-sm">
                <p className="text-[#2C2C2C] font-bold text-base mb-3">
                  {translations['cart.price_summary']}
                </p>
                {cart && (
                  <div className="flex flex-col gap-2 mb-4">
                    <div className="flex justify-between text-sm text-[#2C2C2C]">
                      <span>{translations['cart.subtotal']}</span>
                      <span>{formatPrice(cart.subtotal, cart.currency)}</span>
                    </div>
                    <div className="flex justify-between text-sm text-[#2C2C2C]">
                      <span>{translations['cart.vat']}</span>
                      <span>{formatPrice(cart.vat, cart.currency)}</span>
                    </div>
                    <div className="flex justify-between font-bold text-lg text-[#2C2C2C] border-t border-gray-100 pt-2">
                      <span>{translations['cart.total']}</span>
                      <span>{formatPrice(cart.total, cart.currency)}</span>
                    </div>
                  </div>
                )}
                <button
                  onClick={handlePlaceOrder}
                  disabled={!canPlaceOrder || orderLoading}
                  className="w-full py-3 rounded-[12px] bg-[#1E88E5] text-white font-semibold text-sm hover:opacity-90 transition-opacity cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                >
                  {orderLoading ? <LoadingIndicator /> : translations['checkout.place_order_btn']}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile fixed bottom: price summary + place order */}
        <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-gray-200 px-4 pt-4 pb-4 shadow-lg">
          <p className="text-[#2C2C2C] font-bold text-base mb-3">
            {translations['cart.price_summary']}
          </p>
          {cart && (
            <div className="flex flex-col gap-2 mb-4">
              <div className="flex justify-between text-sm text-[#2C2C2C]">
                <span>{translations['cart.subtotal']}</span>
                <span>{formatPrice(cart.subtotal, cart.currency)}</span>
              </div>
              <div className="flex justify-between text-sm text-[#2C2C2C]">
                <span>{translations['cart.vat']}</span>
                <span>{formatPrice(cart.vat, cart.currency)}</span>
              </div>
              <div className="flex justify-between font-bold text-lg text-[#2C2C2C] border-t border-gray-100 pt-2">
                <span>{translations['cart.total']}</span>
                <span>{formatPrice(cart.total, cart.currency)}</span>
              </div>
            </div>
          )}
          <button
            onClick={handlePlaceOrder}
            disabled={!canPlaceOrder || orderLoading}
            className="w-full py-3 rounded-[12px] bg-[#1E88E5] text-white font-semibold text-sm hover:opacity-90 transition-opacity cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
          >
            {orderLoading ? <LoadingIndicator /> : translations['checkout.place_order_btn']}
          </button>
        </div>
      </div>
    );
  }

  // ─── EDIT SHIPPING INFO VIEW ──────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-[#F5F5F5]">
      <div className="max-w-2xl mx-auto px-4 pt-6 pb-40 md:pb-8">
        {/* Go back button */}
        <div className="flex items-center mb-4">
          <button
            onClick={() => navigateTo(prevView.current)}
            className="flex items-center gap-1 text-[#2C2C2C] hover:text-[#1E88E5] transition-colors cursor-pointer"
          >
            <ChevronLeft className="w-5 h-5" />
            <span className="text-sm font-bold">{translations['go_back_btn']}</span>
          </button>
        </div>
        {/* Page title — left aligned */}
        <h1 className="text-[#2C2C2C] font-bold text-lg mb-6">
          {translations['shipping_info.title']}
        </h1>

        {/* Customer Detail section */}
        <div className="bg-white rounded-[12px] p-4 mb-4">
          <p className="text-[#2C2C2C] font-bold text-sm mb-3">
            {translations['shipping_info.customer_detail']}
          </p>
          <div className="flex flex-col gap-3">
            <div>
              <label className="block text-xs text-[#2C2C2C] mb-1">
                {translations['shipping_info.customer_detail.name']}
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full border border-[#CCCCCC] rounded-[12px] px-3 py-2 text-sm text-[#2C2C2C] outline-none focus:border-[#1E88E5]"
              />
            </div>
            <div>
              <label className="block text-xs text-[#2C2C2C] mb-1">
                {translations['shipping_info.customer_detail.telephone']}
              </label>
              <input
                type="tel"
                value={telephone}
                onChange={(e) => setTelephone(e.target.value)}
                className="w-full border border-[#CCCCCC] rounded-[12px] px-3 py-2 text-sm text-[#2C2C2C] outline-none focus:border-[#1E88E5]"
              />
            </div>
            <div>
              <label className="block text-xs text-[#2C2C2C] mb-1">
                {translations['shipping_info.customer_detail.email']}
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full border border-[#CCCCCC] rounded-[12px] px-3 py-2 text-sm text-[#2C2C2C] outline-none focus:border-[#1E88E5]"
              />
            </div>
          </div>
        </div>

        {/* Desktop: inline save button below the form */}
        <div className="hidden md:block">
          <button
            onClick={handleSave}
            disabled={saveLoading}
            className="w-full py-3 rounded-[12px] bg-[#1E88E5] text-white font-semibold text-sm hover:opacity-90 transition-opacity cursor-pointer disabled:opacity-70 flex items-center justify-center"
          >
            {saveLoading ? <LoadingIndicator /> : translations['shipping_info.save_btn']}
          </button>
        </div>
      </div>

      {/* Mobile only: sticky Save button at bottom */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-gray-200 px-4 pt-4 pb-4 shadow-lg">
        <button
          onClick={handleSave}
          disabled={saveLoading}
          className="w-full py-3 rounded-[12px] bg-[#1E88E5] text-white font-semibold text-sm hover:opacity-90 transition-opacity cursor-pointer disabled:opacity-70 flex items-center justify-center"
        >
          {saveLoading ? <LoadingIndicator /> : translations['shipping_info.save_btn']}
        </button>
      </div>
    </div>
  );
};

export default Cart;
