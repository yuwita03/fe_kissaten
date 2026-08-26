import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Edit, RefreshCw, ShoppingBag, Coffee, Shield, AlertCircle, XCircle, Loader2 } from 'lucide-react';
import { useProducts } from '../context/ProductContext';
import useAuthStore from '../store/authStore';
import { formatIDR, formatDate } from '../utils/formatters';
import type { ProductResponse } from '../service/product.service';

export default function Admin() {
  const {
    products,
    categories,
    orders,
    isLoading,
    error,
    fetchProducts,
    fetchCategories,
    fetchOrders,
    addProduct,
    updateProduct,
    deleteProduct,
    clearError
  } = useProducts();
  const { user, isAuthenticated } = useAuthStore();

  const [activeTab, setActiveTab] = useState('products');
  const [editingProductId, setEditingProductId] = useState<number | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    categoryId: '',
    price: '',
    image: ''
  });
  const [formError, setFormError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (isAuthenticated && user?.role === 'ADMIN') {
      fetchProducts();
      fetchCategories();
      fetchOrders();
    }
  }, [isAuthenticated, user, fetchProducts, fetchCategories, fetchOrders]);

  useEffect(() => {
    if (error) {
      setFormError(error);
    }
  }, [error]);

const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
  const { name, value } = e.target;
  setFormData((prev) => ({ ...prev, [name]: value }));
  if (formError) setFormError('');
};

const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
  e.preventDefault();
  setFormError('');

  if (!formData.name || !formData.price || !formData.categoryId) {
    setFormError('Please provide Product Name, Price, and Category');
    return;
  }

  setIsSubmitting(true);
  try {
    const payload = {
      name: formData.name,
      categoryId: Number(formData.categoryId),
      price: Number(formData.price),
      image: formData.image.trim() || 'https://images.unsplash.com/photo-1559056199-641a0ac8b55e?q=80&w=800&auto=format&fit=crop'
    };

    if (editingProductId) {
      await updateProduct(editingProductId, payload);
      setEditingProductId(null);
    } else {
      await addProduct(payload);
    }

    setFormData({ name: '', categoryId: '', price: '', image: '' });
  } catch (err) {
    setFormError(err instanceof Error ? err.message : 'Failed to save product');
  } finally {
    setIsSubmitting(false);
  }
};

  const handleEditClick = (product: ProductResponse) => {
    setEditingProductId(product.id);
    setFormData({
      name: product.name,
      categoryId: String(product.categoryId),
      price: String(product.price),
      image: product.image || ''
    });
    const formElement = document.getElementById('admin-product-form');
    if (formElement) {
      formElement.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleCancelEdit = () => {
    setEditingProductId(null);
    setFormData({ name: '', categoryId: '', price: '', image: '' });
    setFormError('');
  };

const handleDeleteProduct = async (productId: number, productName: string) => {
  if (window.confirm(`Are you sure you want to delete ${productName}?`)) {
    try {
      await deleteProduct(productId);
    } catch (err) {
      setFormError(err instanceof Error ? err.message : 'Failed to delete product');
    }
  }
};

  if (!isAuthenticated || user?.role !== 'ADMIN') {
    return (
      <div id="admin-page" className="min-h-screen py-10 sm:py-16 flex items-center justify-center">
        <div className="max-w-md mx-auto px-4 text-center">
          <Shield className="w-16 h-16 mx-auto text-coffee-brown/30 dark:text-warm-sand/30 mb-4" />
          <h2 className="text-2xl font-bold text-coffee-brown dark:text-cream-main font-poppins mb-2">
            Admin Access Required
          </h2>
          <p className="text-coffee-brown/70 dark:text-warm-sand/70">
            This page is only accessible to administrators. Please log in with an admin account.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div id="admin-page" className="min-h-screen py-10 sm:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">

        {/* Admin Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-warm-sand/30 dark:border-dark-slate/60 pb-6">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-gold/20 text-coffee-brown dark:text-amber-gold text-xs font-semibold uppercase tracking-wider">
              <span>Kissaten Staff Management</span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-extrabold text-coffee-brown dark:text-cream-main font-poppins">
              Admin & Operations Portal
            </h1>
            <p className="text-xs sm:text-sm text-coffee-brown/70 dark:text-warm-sand/70">
              Manage live product inventory, pricing, and review customer order logs.
            </p>
          </div>

          <div className="flex items-center gap-2 bg-white dark:bg-dark-slate/50 p-1.5 rounded-2xl border border-warm-sand/30 dark:border-dark-slate/60 shadow-xs self-start md:self-auto">
            <button
              id="admin-tab-products"
              onClick={() => setActiveTab('products')}
              className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all cursor-pointer flex items-center gap-2 ${
                activeTab === 'products'
                  ? 'bg-amber-gold text-dark-roasted shadow-xs'
                  : 'text-coffee-brown/70 dark:text-warm-sand/70 hover:text-coffee-brown'
              }`}
            >
              <Coffee className="w-4 h-4" />
              <span>Products ({products.length})</span>
            </button>

            <button
              id="admin-tab-orders"
              onClick={() => setActiveTab('orders')}
              className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all cursor-pointer flex items-center gap-2 ${
                activeTab === 'orders'
                  ? 'bg-amber-gold text-dark-roasted shadow-xs'
                  : 'text-coffee-brown/70 dark:text-warm-sand/70 hover:text-coffee-brown'
              }`}
            >
              <ShoppingBag className="w-4 h-4" />
              <span>Orders ({orders.length})</span>
            </button>
          </div>
        </div>

        {/* Error Banner */}
        {formError && (
          <div className="flex items-center gap-3 p-4 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-400" role="alert">
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
            <p className="text-sm font-medium">{formError}</p>
            <button onClick={() => setFormError('')} className="ml-auto p-1 hover:bg-red-500/20 rounded">
              <XCircle className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* TAB 1: PRODUCT MANAGEMENT */}
        {activeTab === 'products' && (
          <div className="space-y-10">

            <div
              id="admin-product-form"
              className="rounded-3xl bg-white dark:bg-dark-slate/40 border border-warm-sand/30 dark:border-dark-slate/60 shadow-xs p-6 sm:p-8 space-y-6"
            >
              <div className="flex items-center justify-between border-b border-warm-sand/20 dark:border-dark-slate/60 pb-4">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-amber-gold/20 flex items-center justify-center text-amber-gold font-bold">
                    {editingProductId ? <Edit className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
                  </div>
                  <div>
                    <h3 className="font-bold text-base text-coffee-brown dark:text-cream-main font-poppins">
                      {editingProductId ? 'Edit Product Item' : 'Add New Specialty Product'}
                    </h3>
                    <p className="text-xs text-coffee-brown/60 dark:text-warm-sand/60">
                      {editingProductId ? `Updating product ID: ${editingProductId}` : 'Fill in the details to publish to catalog'}
                    </p>
                  </div>
                </div>

                {editingProductId && (
                  <button
                    type="button"
                    onClick={handleCancelEdit}
                    className="px-3 py-1.5 rounded-lg border border-warm-sand/40 text-xs font-semibold hover:bg-warm-sand/20"
                  >
                    Cancel Edit
                  </button>
                )}
              </div>

              <form onSubmit={handleFormSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-semibold uppercase tracking-wider mb-1">
                      Product Name *
                    </label>
                    <input
                      type="text"
                      name="name"
                      required
                      placeholder="e.g. Sumatra Mandheling Triple Pick 200g"
                      value={formData.name}
                      onChange={handleInputChange}
                      className="w-full px-3.5 py-2 rounded-xl border border-warm-sand/40 dark:border-dark-slate/60 bg-cream-main/40 dark:bg-dark-slate/60 text-xs text-coffee-brown dark:text-cream-main focus:outline-none focus:border-amber-gold"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider mb-1">
                      Category *
                    </label>
                    <select
                      name="categoryId"
                      value={formData.categoryId}
                      onChange={handleInputChange}
                      required
                      className="w-full px-3.5 py-2 rounded-xl border border-warm-sand/40 dark:border-dark-slate/60 bg-cream-main/40 dark:bg-dark-slate/60 text-xs text-coffee-brown dark:text-cream-main focus:outline-none focus:border-amber-gold cursor-pointer"
                    >
                      <option value="">Select Category</option>
                      {categories.map((c) => (
                        <option key={c.id} value={c.id}>{c.name}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider mb-1">
                      Price (IDR Number) *
                    </label>
                    <input
                      type="number"
                      name="price"
                      required
                      min="0"
                      step="500"
                      placeholder="e.g. 120000"
                      value={formData.price}
                      onChange={handleInputChange}
                      className="w-full px-3.5 py-2 rounded-xl border border-warm-sand/40 dark:border-dark-slate/60 bg-cream-main/40 dark:bg-dark-slate/60 text-xs text-coffee-brown dark:text-cream-main focus:outline-none focus:border-amber-gold"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-xs font-semibold uppercase tracking-wider mb-1">
                      Image URL (Unsplash or direct image link)
                    </label>
                    <input
                      type="url"
                      name="image"
                      placeholder="https://images.unsplash.com/..."
                      value={formData.image}
                      onChange={handleInputChange}
                      className="w-full px-3.5 py-2 rounded-xl border border-warm-sand/40 dark:border-dark-slate/60 bg-cream-main/40 dark:bg-dark-slate/60 text-xs text-coffee-brown dark:text-cream-main focus:outline-none focus:border-amber-gold"
                    />
                  </div>
                </div>

                <div className="pt-2 flex justify-end gap-3">
                  <button
                    type="submit"
                    id="save-product-btn"
                    disabled={isSubmitting}
                    className="px-6 py-2.5 rounded-xl bg-amber-gold text-dark-roasted font-bold text-xs uppercase tracking-wider hover:bg-amber-gold/90 transition shadow-sm cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                  >
                    {isSubmitting && <Loader2 className="w-4 h-4 animate-spin" />}
                    {editingProductId ? 'Save Changes' : '+ Add Product to Menu'}
                  </button>
                </div>
              </form>
            </div>

            {/* Tabel Produk */}
            <div className="rounded-3xl bg-white dark:bg-dark-slate/40 border border-warm-sand/30 dark:border-dark-slate/60 shadow-xs overflow-hidden">
              <div className="p-5 border-b border-warm-sand/20 dark:border-dark-slate/60 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-warm-sand/10 dark:bg-dark-slate/20">
                <div>
                  <h3 className="font-bold text-base text-coffee-brown dark:text-cream-main font-poppins">
                    Live Product Inventory ({products.length})
                  </h3>
                </div>

                <button
                  onClick={() => { fetchProducts(); fetchCategories(); }}
                  disabled={isLoading}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-warm-sand/40 text-xs font-semibold text-coffee-brown/80 dark:text-warm-sand/80 hover:bg-warm-sand/20 dark:hover:bg-dark-slate/50 transition cursor-pointer self-start sm:self-auto disabled:opacity-50"
                >
                  {isLoading && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>Refresh Data</span>
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-warm-sand/20 dark:bg-dark-slate/60 text-coffee-brown/80 dark:text-warm-sand/80 uppercase font-semibold">
                    <tr>
                      <th className="py-3.5 px-4">Item</th>
                      <th className="py-3.5 px-4">Category</th>
                      <th className="py-3.5 px-4">Price</th>
                      <th className="py-3.5 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-warm-sand/20 dark:divide-dark-slate/60">
                    {products.map((p) => (
                      <tr key={p.id} className="hover:bg-warm-sand/10 dark:hover:bg-dark-slate/30 transition">
                        <td className="py-3.5 px-4 flex items-center gap-3">
                          <img
                            src={p.image || 'https://images.unsplash.com/photo-1559056199-641a0ac8b55e?q=80&w=800&auto=format&fit=crop'}
                            alt={p.name}
                            referrerPolicy="no-referrer"
                            className="w-10 h-10 rounded-lg object-cover border border-warm-sand/30 shrink-0"
                          />
                          <div>
                            <p className="font-bold text-coffee-brown dark:text-cream-main line-clamp-1">{p.name}</p>
                            <p className="text-[10px] text-coffee-brown/50 dark:text-warm-sand/50 font-mono">{p.id}</p>
                          </div>
                        </td>
                        <td className="py-3.5 px-4 whitespace-nowrap text-coffee-brown/80 dark:text-warm-sand/80">
                          {p.categoryName}
                        </td>
                        <td className="py-3.5 px-4 whitespace-nowrap font-bold text-amber-gold">
                          {formatIDR(p.price)}
                        </td>
                        <td className="py-3.5 px-4 text-right whitespace-nowrap space-x-1">
                          <button
                            id={`edit-product-${p.id}`}
                            onClick={() => handleEditClick(p)}
                            className="p-1.5 rounded-lg hover:bg-warm-sand/20 dark:hover:bg-dark-slate/60 text-coffee-brown/80 dark:text-warm-sand/80 hover:text-amber-gold transition cursor-pointer"
                            title="Edit"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            id={`delete-product-${p.id}`}
                            onClick={() => handleDeleteProduct(p.id, p.name)}
                            className="p-1.5 rounded-lg hover:bg-red-500/10 text-coffee-brown/80 dark:text-warm-sand/80 hover:text-red-600 transition cursor-pointer"
                            title="Delete"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

          </div>
        )}

        {/* TAB 2: ORDER HISTORY LOGS */}
        {activeTab === 'orders' && (
          <div className="rounded-3xl bg-white dark:bg-dark-slate/40 border border-warm-sand/30 dark:border-dark-slate/60 shadow-xs overflow-hidden space-y-4">
            <div className="p-5 border-b border-warm-sand/20 dark:border-dark-slate/60 bg-warm-sand/10 dark:bg-dark-slate/20 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="font-bold text-base text-coffee-brown dark:text-cream-main font-poppins">
                  Transaction & Order History Logs ({orders.length})
                </h3>
              </div>
              <button
                onClick={() => fetchOrders()}
                disabled={isLoading}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-warm-sand/40 text-xs font-semibold text-coffee-brown/80 dark:text-warm-sand/80 hover:bg-warm-sand/20 dark:hover:bg-dark-slate/50 transition cursor-pointer self-start sm:self-auto disabled:opacity-50"
              >
                {isLoading && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Refresh</span>
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-warm-sand/20 dark:bg-dark-slate/60 text-coffee-brown/80 dark:text-warm-sand/80 uppercase font-semibold">
                  <tr>
                    <th className="py-3.5 px-4">Order ID</th>
                    <th className="py-3.5 px-4">Customer</th>
                    <th className="py-3.5 px-4">Ordered Items</th>
                    <th className="py-3.5 px-4">Total Amount</th>
                    <th className="py-3.5 px-4">Timestamp</th>
                    <th className="py-3.5 px-4 text-center">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-warm-sand/20 dark:divide-dark-slate/60">
                  {orders.map((ord) => (
                    <tr key={ord.id} className="hover:bg-warm-sand/10 dark:hover:bg-dark-slate/30 transition">
                      <td className="py-3.5 px-4 font-mono font-bold text-amber-gold whitespace-nowrap">
                        {ord.id}
                      </td>
                      <td className="py-3.5 px-4 font-bold text-coffee-brown dark:text-cream-main">
                        {ord.customerName || 'Guest'}
                      </td>
                      <td className="py-3.5 px-4 max-w-xs">
                        <ul className="list-disc list-inside space-y-0.5 text-coffee-brown/80 dark:text-warm-sand/80 text-[11px]">
                          {ord.items && ord.items.map((it, idx) => (
                            <li key={idx} className="truncate">
                              {it.qty}x {it.productName}
                            </li>
                          ))}
                        </ul>
                      </td>
                      <td className="py-3.5 px-4 whitespace-nowrap font-bold text-coffee-brown dark:text-cream-main">
                        {formatIDR(ord.totalAmount)}
                      </td>
                      <td className="py-3.5 px-4 whitespace-nowrap text-[11px] text-coffee-brown/60 dark:text-warm-sand/60">
                        {formatDate(ord.createdAt)}
                      </td>
                      <td className="py-3.5 px-4 text-center whitespace-nowrap">
                        <span className="px-2.5 py-1 rounded-full bg-sage-green/20 text-coffee-brown dark:text-sage-green font-bold text-[10px]">
                          {ord.paymentStatus || 'PAID'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}