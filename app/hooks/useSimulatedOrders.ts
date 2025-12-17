'use client';

import { useState, useEffect, useCallback } from 'react';

export interface SimulatedOrder {
  id: string;
  realOrderTemplate?: string;
  product: {
    id: string;
    title: string;
    price: number;
    imageUrl?: string;
    sku?: string;
  };
  buyer: {
    name: string;
    id: string;
    nickname: string;
  };
  billing: {
    docType: 'DNI' | 'CUIT';
    docNumber: string;
    taxpayerType: string;
    canReceiveFacturaA: boolean;
  };
  shipping: {
    id: string;
    status: 'pending' | 'shipped' | 'in_transit' | 'delivered' | 'not_delivered';
    carrier: 'mercadoenvios' | 'flex' | 'treggo';
    logisticType: string;
    trackingNumber?: string;
    dateShipped?: string;
    dateDelivered?: string;
    failedAttempts?: number;
  };
  scenario: {
    id: string;
    name: string;
    description: string;
    icon: string;
  };
  createdAt: string;
  messages: SimulatedMessage[];
}

export interface SimulatedMessage {
  id: string;
  role: 'buyer' | 'seller' | 'system';
  content: string;
  timestamp: string;
  toolUsed?: string;
}

export interface TestScenario {
  id: string;
  name: string;
  description: string;
  icon: string;
  shipping_status: string;
  billing_type: 'DNI' | 'CUIT';
  can_receive_factura_a: boolean;
  days_since_delivery: number | null;
  has_claim: boolean;
  carrier: string;
  is_flex?: boolean;
  failed_attempts?: number;
  suggested_questions: string[];
}

const STORAGE_KEY = 'simulated_orders';
const PRELOADED_KEY = 'preloaded_orders_loaded';
const PRELOADED_VERSION = '2.0'; // Bump this to force reload of preloaded orders

export function useSimulatedOrders() {
  const [orders, setOrders] = useState<SimulatedOrder[]>([]);
  const [scenarios, setScenarios] = useState<TestScenario[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Load orders from localStorage and preloaded JSON
  useEffect(() => {
    const loadOrders = async () => {
      try {
        // Load from localStorage first
        const stored = localStorage.getItem(STORAGE_KEY);
        let localOrders: SimulatedOrder[] = [];
        if (stored) {
          try {
            localOrders = JSON.parse(stored);
          } catch (e) {
            console.error('Error parsing localStorage orders:', e);
          }
        }

        // Check if preloaded orders have been loaded before (with version check)
        const preloadedLoaded = localStorage.getItem(PRELOADED_KEY);

        if (preloadedLoaded !== PRELOADED_VERSION) {
          // Load preloaded orders from JSON file
          try {
            const response = await fetch('/data/preloaded-orders.json');
            if (response.ok) {
              const data = await response.json();
              const preloadedOrders: SimulatedOrder[] = data.orders || [];

              // Merge preloaded orders with local orders (preloaded at the end)
              const existingIds = new Set(localOrders.map(o => o.id));
              const newPreloaded = preloadedOrders.filter(o => !existingIds.has(o.id));

              const mergedOrders = [...localOrders, ...newPreloaded];
              localStorage.setItem(STORAGE_KEY, JSON.stringify(mergedOrders));
              localStorage.setItem(PRELOADED_KEY, PRELOADED_VERSION);
              setOrders(mergedOrders);
            } else {
              setOrders(localOrders);
            }
          } catch (e) {
            console.error('Error loading preloaded orders:', e);
            setOrders(localOrders);
          }
        } else {
          setOrders(localOrders);
        }
      } catch (e) {
        console.error('Error loading orders:', e);
      } finally {
        setIsLoading(false);
      }
    };

    loadOrders();
  }, []);

  // Load scenarios from JSON
  useEffect(() => {
    fetch('/data/test-scenarios.json')
      .then(res => res.json())
      .then(data => setScenarios(data.scenarios))
      .catch(err => console.error('Error loading scenarios:', err));
  }, []);

  // Save orders to localStorage
  const saveOrders = useCallback((newOrders: SimulatedOrder[]) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newOrders));
    setOrders(newOrders);
  }, []);

  // Create a new simulated order
  const createOrder = useCallback((
    product: SimulatedOrder['product'],
    scenario: TestScenario,
    customBuyer?: Partial<SimulatedOrder['buyer']>
  ): SimulatedOrder => {
    const now = new Date();
    const orderId = `SIM-${Date.now()}`;
    const shippingId = `SIM-SHP-${Date.now()}`;

    // Calculate dates based on scenario
    let dateDelivered: string | undefined;
    let dateShipped: string | undefined;

    if (scenario.days_since_delivery !== null) {
      const deliveryDate = new Date(now);
      deliveryDate.setDate(deliveryDate.getDate() - scenario.days_since_delivery);
      dateDelivered = deliveryDate.toISOString();

      const shipDate = new Date(deliveryDate);
      shipDate.setDate(shipDate.getDate() - 2);
      dateShipped = shipDate.toISOString();
    } else if (scenario.shipping_status === 'in_transit' || scenario.shipping_status === 'shipped') {
      const shipDate = new Date(now);
      shipDate.setDate(shipDate.getDate() - 1);
      dateShipped = shipDate.toISOString();
    }

    // Generate buyer data
    const buyerNames = [
      { name: 'Juan Pérez', nickname: 'JUANPEREZ' },
      { name: 'María García', nickname: 'MARIAGARCIA' },
      { name: 'Carlos López', nickname: 'CARLOSLOPEZ' },
      { name: 'Ana Martínez', nickname: 'ANAMARTINEZ' },
      { name: 'Pedro Sánchez', nickname: 'PEDROSANCHEZ' }
    ];
    const randomBuyer = buyerNames[Math.floor(Math.random() * buyerNames.length)];

    const newOrder: SimulatedOrder = {
      id: orderId,
      product: {
        ...product,
        imageUrl: product.imageUrl || `https://http2.mlstatic.com/D_NQ_NP_${product.id.replace('MLA', '')}-O.webp`
      },
      buyer: {
        id: `SIM-BUYER-${Date.now()}`,
        name: customBuyer?.name || randomBuyer.name,
        nickname: customBuyer?.nickname || randomBuyer.nickname
      },
      billing: {
        docType: scenario.billing_type,
        docNumber: scenario.billing_type === 'CUIT'
          ? `20-${Math.floor(10000000 + Math.random() * 90000000)}-${Math.floor(Math.random() * 10)}`
          : `${Math.floor(10000000 + Math.random() * 90000000)}`,
        taxpayerType: scenario.can_receive_factura_a ? 'Responsable Monotributo' : 'Consumidor Final',
        canReceiveFacturaA: scenario.can_receive_factura_a
      },
      shipping: {
        id: shippingId,
        status: scenario.shipping_status as SimulatedOrder['shipping']['status'],
        carrier: (scenario.is_flex ? 'flex' : scenario.carrier) as SimulatedOrder['shipping']['carrier'],
        logisticType: scenario.is_flex ? 'flex' : 'cross_docking',
        trackingNumber: `SIM-TRK-${Date.now()}`,
        dateShipped,
        dateDelivered,
        failedAttempts: scenario.failed_attempts
      },
      scenario: {
        id: scenario.id,
        name: scenario.name,
        description: scenario.description,
        icon: scenario.icon
      },
      createdAt: now.toISOString(),
      messages: []
    };

    const updatedOrders = [newOrder, ...orders];
    saveOrders(updatedOrders);
    return newOrder;
  }, [orders, saveOrders]);

  // Create a new simulated order with custom configuration
  interface CustomOrderConfig {
    shippingStatus: SimulatedOrder['shipping']['status'];
    billingType: 'DNI' | 'CUIT';
    canReceiveFacturaA: boolean;
    daysSinceDelivery: number | null;
    carrier: 'mercadoenvios' | 'flex' | 'treggo';
    failedAttempts: number;
    hasClaim: boolean;
  }

  const createOrderCustom = useCallback((
    product: SimulatedOrder['product'],
    scenario: TestScenario,
    customConfig: CustomOrderConfig,
    customBuyer?: Partial<SimulatedOrder['buyer']>
  ): SimulatedOrder => {
    const now = new Date();
    const orderId = `SIM-${Date.now()}`;
    const shippingId = `SIM-SHP-${Date.now()}`;

    // Calculate dates based on custom config
    let dateDelivered: string | undefined;
    let dateShipped: string | undefined;

    if (customConfig.daysSinceDelivery !== null && customConfig.shippingStatus === 'delivered') {
      const deliveryDate = new Date(now);
      deliveryDate.setDate(deliveryDate.getDate() - customConfig.daysSinceDelivery);
      dateDelivered = deliveryDate.toISOString();

      const shipDate = new Date(deliveryDate);
      shipDate.setDate(shipDate.getDate() - 2);
      dateShipped = shipDate.toISOString();
    } else if (customConfig.shippingStatus === 'in_transit' || customConfig.shippingStatus === 'shipped') {
      const shipDate = new Date(now);
      shipDate.setDate(shipDate.getDate() - 1);
      dateShipped = shipDate.toISOString();
    }

    // Generate buyer data
    const buyerNames = [
      { name: 'Juan Pérez', nickname: 'JUANPEREZ' },
      { name: 'María García', nickname: 'MARIAGARCIA' },
      { name: 'Carlos López', nickname: 'CARLOSLOPEZ' },
      { name: 'Ana Martínez', nickname: 'ANAMARTINEZ' },
      { name: 'Pedro Sánchez', nickname: 'PEDROSANCHEZ' }
    ];
    const randomBuyer = buyerNames[Math.floor(Math.random() * buyerNames.length)];

    const newOrder: SimulatedOrder = {
      id: orderId,
      product: {
        ...product,
        imageUrl: product.imageUrl || `https://http2.mlstatic.com/D_NQ_NP_${product.id.replace('MLA', '')}-O.webp`
      },
      buyer: {
        id: `SIM-BUYER-${Date.now()}`,
        name: customBuyer?.name || randomBuyer.name,
        nickname: customBuyer?.nickname || randomBuyer.nickname
      },
      billing: {
        docType: customConfig.billingType,
        docNumber: customConfig.billingType === 'CUIT'
          ? `20-${Math.floor(10000000 + Math.random() * 90000000)}-${Math.floor(Math.random() * 10)}`
          : `${Math.floor(10000000 + Math.random() * 90000000)}`,
        taxpayerType: customConfig.canReceiveFacturaA ? 'Responsable Monotributo' : 'Consumidor Final',
        canReceiveFacturaA: customConfig.canReceiveFacturaA
      },
      shipping: {
        id: shippingId,
        status: customConfig.shippingStatus,
        carrier: customConfig.carrier,
        logisticType: customConfig.carrier === 'flex' || customConfig.carrier === 'treggo' ? 'flex' : 'cross_docking',
        trackingNumber: `SIM-TRK-${Date.now()}`,
        dateShipped,
        dateDelivered,
        failedAttempts: customConfig.failedAttempts > 0 ? customConfig.failedAttempts : undefined
      },
      scenario: {
        id: scenario.id,
        name: scenario.name,
        description: scenario.description,
        icon: scenario.icon
      },
      createdAt: now.toISOString(),
      messages: []
    };

    const updatedOrders = [newOrder, ...orders];
    saveOrders(updatedOrders);
    return newOrder;
  }, [orders, saveOrders]);

  // Add message to order
  const addMessage = useCallback((
    orderId: string,
    message: Omit<SimulatedMessage, 'id' | 'timestamp'>
  ) => {
    const newMessage: SimulatedMessage = {
      ...message,
      id: `msg-${Date.now()}`,
      timestamp: new Date().toISOString()
    };

    const updatedOrders = orders.map(order => {
      if (order.id === orderId) {
        return {
          ...order,
          messages: [...order.messages, newMessage]
        };
      }
      return order;
    });

    saveOrders(updatedOrders);
    return newMessage;
  }, [orders, saveOrders]);

  // Delete order
  const deleteOrder = useCallback((orderId: string) => {
    const updatedOrders = orders.filter(o => o.id !== orderId);
    saveOrders(updatedOrders);
  }, [orders, saveOrders]);

  // Clear all orders
  const clearAllOrders = useCallback(() => {
    saveOrders([]);
  }, [saveOrders]);

  // Reset and reload preloaded orders
  const reloadPreloadedOrders = useCallback(async () => {
    try {
      localStorage.removeItem(PRELOADED_KEY);
      localStorage.removeItem(STORAGE_KEY);
      const response = await fetch('/data/preloaded-orders.json?v=' + Date.now());
      if (response.ok) {
        const data = await response.json();
        const preloadedOrders: SimulatedOrder[] = data.orders || [];
        localStorage.setItem(STORAGE_KEY, JSON.stringify(preloadedOrders));
        localStorage.setItem(PRELOADED_KEY, PRELOADED_VERSION);
        setOrders(preloadedOrders);
      }
    } catch (e) {
      console.error('Error reloading preloaded orders:', e);
    }
  }, []);

  // Get order by ID
  const getOrder = useCallback((orderId: string) => {
    return orders.find(o => o.id === orderId);
  }, [orders]);

  return {
    orders,
    scenarios,
    isLoading,
    createOrder,
    createOrderCustom,
    addMessage,
    deleteOrder,
    clearAllOrders,
    reloadPreloadedOrders,
    getOrder
  };
}
