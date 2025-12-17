'use client';

import { useState, useEffect, useCallback } from 'react';
import { createClient } from '@/lib/supabase/client';

export interface RealOrder {
  id: string;
  product: {
    id: string;
    title: string;
    price: number;
    sku?: string;
    category?: string;
  };
  buyer: {
    id: string;
    nickname: string;
    first_name: string;
    last_name: string;
  };
  shipping: {
    id: string;
    status: string;
    logistic_type: string;
    carrier: string;
    tracking_number?: string;
    date_shipped?: string;
    date_delivered?: string;
    receiver_city?: string;
    receiver_state?: string;
  };
  billing_info: {
    doc_type: 'DNI' | 'CUIT';
    doc_number: string;
    taxpayer_type: string;
    can_receive_factura_a: boolean;
  };
  date_created: string;
  tags: string[];
  has_mediation?: boolean;
  mediation_id?: string;
}

export interface RealOrderMessage {
  id: string;
  role: 'buyer' | 'seller' | 'system';
  content: string;
  timestamp: string;
  toolUsed?: string;
}

export interface RealOrderWithMessages extends RealOrder {
  messages: RealOrderMessage[];
}

const MESSAGES_STORAGE_KEY = 'real_orders_messages';

export function useRealOrders() {
  const [orders, setOrders] = useState<RealOrderWithMessages[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Load orders from Supabase and merge with stored messages
  useEffect(() => {
    const loadOrders = async () => {
      try {
        const supabase = createClient();
        const { data, error } = await supabase
          .from('orders')
          .select('*')
          .order('date_created', { ascending: false });

        if (error) {
          console.error('Error fetching orders from Supabase:', error);
          setIsLoading(false);
          return;
        }

        // Load stored messages
        const storedMessages = localStorage.getItem(MESSAGES_STORAGE_KEY);
        const messagesMap: Record<string, RealOrderMessage[]> = storedMessages
          ? JSON.parse(storedMessages)
          : {};

        // Map Supabase orders to expected format and merge with messages
        const ordersWithMessages: RealOrderWithMessages[] = (data || []).map((order: {
          external_id: string;
          product: { id?: string; sku?: string; title: string; price: number; category?: string };
          buyer: { id: string; nickname: string; first_name: string; last_name: string };
          shipping: { id: string; status: string; logistic_type: string; carrier: string; tracking_number?: string; date_shipped?: string; date_delivered?: string; receiver_city?: string; receiver_state?: string };
          billing: { doc_type: 'DNI' | 'CUIT'; doc_number: string; taxpayer_type: string; can_receive_factura_a: boolean };
          date_created: string;
          tags: string[];
        }) => ({
          id: order.external_id,
          product: {
            id: order.product?.id || order.product?.sku || order.external_id,
            title: order.product?.title || 'Producto',
            price: order.product?.price || 0,
            sku: order.product?.sku,
            category: order.product?.category
          },
          buyer: order.buyer || { id: '', nickname: '', first_name: '', last_name: '' },
          shipping: order.shipping || { id: '', status: '', logistic_type: '', carrier: '' },
          billing_info: order.billing || { doc_type: 'DNI', doc_number: '', taxpayer_type: '', can_receive_factura_a: false },
          date_created: order.date_created,
          tags: order.tags || [],
          has_mediation: false,
          mediation_id: undefined,
          messages: messagesMap[order.external_id] || []
        }));

        setOrders(ordersWithMessages);
      } catch (error) {
        console.error('Error loading orders from Supabase:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadOrders();
  }, []);

  // Save messages to localStorage
  const saveMessages = useCallback((orderId: string, messages: RealOrderMessage[]) => {
    const storedMessages = localStorage.getItem(MESSAGES_STORAGE_KEY);
    const messagesMap: Record<string, RealOrderMessage[]> = storedMessages
      ? JSON.parse(storedMessages)
      : {};

    messagesMap[orderId] = messages;
    localStorage.setItem(MESSAGES_STORAGE_KEY, JSON.stringify(messagesMap));
  }, []);

  // Add message to an order
  const addMessage = useCallback((
    orderId: string,
    message: Omit<RealOrderMessage, 'id' | 'timestamp'>
  ) => {
    const newMessage: RealOrderMessage = {
      ...message,
      id: `msg-${Date.now()}`,
      timestamp: new Date().toISOString()
    };

    setOrders(prevOrders => {
      const updatedOrders = prevOrders.map(order => {
        if (order.id === orderId) {
          const updatedMessages = [...order.messages, newMessage];
          saveMessages(orderId, updatedMessages);
          return { ...order, messages: updatedMessages };
        }
        return order;
      });
      return updatedOrders;
    });

    return newMessage;
  }, [saveMessages]);

  // Get order by ID
  const getOrder = useCallback((orderId: string) => {
    return orders.find(o => o.id === orderId);
  }, [orders]);

  // Clear messages for an order
  const clearMessages = useCallback((orderId: string) => {
    setOrders(prevOrders => {
      const updatedOrders = prevOrders.map(order => {
        if (order.id === orderId) {
          saveMessages(orderId, []);
          return { ...order, messages: [] };
        }
        return order;
      });
      return updatedOrders;
    });
  }, [saveMessages]);

  // Clear all messages
  const clearAllMessages = useCallback(() => {
    localStorage.removeItem(MESSAGES_STORAGE_KEY);
    setOrders(prevOrders => prevOrders.map(order => ({ ...order, messages: [] })));
  }, []);

  // Calculate days since delivery
  const getDaysSinceDelivery = useCallback((order: RealOrder): number | null => {
    if (!order.shipping.date_delivered) return null;
    const delivered = new Date(order.shipping.date_delivered);
    const now = new Date();
    return Math.floor((now.getTime() - delivered.getTime()) / (1000 * 60 * 60 * 24));
  }, []);

  return {
    orders,
    isLoading,
    addMessage,
    getOrder,
    clearMessages,
    clearAllMessages,
    getDaysSinceDelivery
  };
}
