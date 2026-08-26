import React, { createContext, useContext, useState, useEffect } from 'react';
import initialProducts from '../data/initialProducts';

const ProductContext = createContext();

const initialOrdersData = [
  {
    id: "TRX-8821",
    customerName: "Kenji Sato",
    customerEmail: "kenji.sato@example.jp",
    customerPhone: "+62 812-3456-7890",
    items: [
      { id: "prod-1", name: "Tokyo Kissaten House Blend Beans 250g", price: 125000, quantity: 2 },
      { id: "prod-3", name: "Iced Amber Pour-Over", price: 40000, quantity: 1 }
    ],
    totalPrice: 290000,
    status: "PAID",
    paymentMethod: "QRIS / GoPay",
    createdAt: new Date(Date.now() - 3600000 * 4).toISOString()
  },
  {
    id: "TRX-8820",
    customerName: "Aiko Tanaka",
    customerEmail: "aiko.t@example.com",
    customerPhone: "+62 878-9876-5432",
    items: [
      { id: "prod-2", name: "Kyoto Matcha Espresso Latte", price: 45000, quantity: 2 },
      { id: "prod-5", name: "Fluffy Soufflé Pancake", price: 50000, quantity: 2 }
    ],
    totalPrice: 190000,
    status: "PAID",
    paymentMethod: "BCA Virtual Account",
    createdAt: new Date(Date.now() - 3600000 * 22).toISOString()
  },
  {
    id: "TRX-8819",
    customerName: "Rian Prasetyo",
    customerEmail: "rian.coffee@example.id",
    customerPhone: "+62 821-4455-6677",
    items: [
      { id: "prod-4", name: "Flores Bajawa Specialty Beans 200g", price: 110000, quantity: 1 }
    ],
    totalPrice: 110000,
    status: "PAID",
    paymentMethod: "Credit Card (Visa)",
    createdAt: new Date(Date.now() - 3600000 * 48).toISOString()
  }
];

export const ProductProvider = ({ children }) => {
  const [products, setProducts] = useState(() => {
    try {
      const saved = localStorage.getItem('neko_products');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
      return initialProducts;
    } catch (e) {
      console.error('Error reading neko_products from localStorage', e);
      return initialProducts;
    }
  });

  const [orders, setOrders] = useState(() => {
    try {
      const saved = localStorage.getItem('neko_orders');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          return parsed;
        }
      }
      return initialOrdersData;
    } catch (e) {
      console.error('Error reading neko_orders from localStorage', e);
      return initialOrdersData;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('neko_products', JSON.stringify(products));
    } catch (e) {
      console.error('Error saving neko_products to localStorage', e);
    }
  }, [products]);

  useEffect(() => {
    try {
      localStorage.setItem('neko_orders', JSON.stringify(orders));
    } catch (e) {
      console.error('Error saving neko_orders to localStorage', e);
    }
  }, [orders]);

  const addProduct = (newProduct) => {
    const productWithId = {
      ...newProduct,
      id: newProduct.id || `prod-${Date.now()}`,
      price: Number(newProduct.price) || 0,
      status: newProduct.status || 'AVAILABLE',
      isFeatured: Boolean(newProduct.isFeatured)
    };
    setProducts(prev => [productWithId, ...prev]);
    return productWithId;
  };

  const updateProduct = (updatedProduct) => {
    setProducts(prev =>
      prev.map(p => (p.id === updatedProduct.id ? { ...p, ...updatedProduct, price: Number(updatedProduct.price) || 0 } : p))
    );
  };

  const deleteProduct = (productId) => {
    setProducts(prev => prev.filter(p => p.id !== productId));
  };

  const toggleStatus = (productId) => {
    setProducts(prev =>
      prev.map(p => {
        if (p.id === productId) {
          const nextStatus = p.status === 'AVAILABLE' ? 'SOLD OUT' : 'AVAILABLE';
          return { ...p, status: nextStatus };
        }
        return p;
      })
    );
  };

  const createOrder = (orderData) => {
    const newOrder = {
      id: `TRX-${Math.floor(1000 + Math.random() * 9000)}`,
      createdAt: new Date().toISOString(),
      status: 'PAID',
      paymentMethod: orderData.paymentMethod || 'Midtrans Mock Snap',
      ...orderData
    };
    setOrders(prev => [newOrder, ...prev]);
    return newOrder;
  };

  const resetToDefaultProducts = () => {
    setProducts(initialProducts);
  };

  return (
    <ProductContext.Provider
      value={{
        products,
        orders,
        addProduct,
        updateProduct,
        deleteProduct,
        toggleStatus,
        createOrder,
        resetToDefaultProducts
      }}
    >
      {children}
    </ProductContext.Provider>
  );
};

export const useProducts = () => {
  const context = useContext(ProductContext);
  if (!context) {
    throw new Error('useProducts must be used within a ProductProvider');
  }
  return context;
};

export default ProductContext;
