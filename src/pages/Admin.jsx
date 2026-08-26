import React, { useState } from 'react';
import { Plus, Trash2, Edit, RefreshCw, CheckCircle, XCircle, ShoppingBag, Coffee, List, Shield, ArrowUpDown, Eye } from 'lucide-react';
import { useProducts } from '../context/ProductContext';
import { formatIDR, formatDate } from '../utils/formatters';

export default function Admin() {
  const {
    products,
    orders,
    addProduct,
    updateProduct,
    deleteProduct,
    toggleStatus,
    resetToDefaultProducts
  } = useProducts();

  const [activeTab, setActiveTab] = useState('products'); // 'products' | 'orders'
  
  // Product Form State
  const [editingProductId, setEditingProductId] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    category: 'Single-Origin Beans',
    price: '',
    notes: '',
    description: '',
    image: '',
    status: 'AVAILABLE',
    isFeatured: false
  });

  const categories = [
    'Single-Origin Beans',
    'Hand-Pour Brews',
    'Espresso-Based',
    'Desserts'
  ];

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.price) {
      alert('Please provide at least a Product Name and Price');
      return;
    }

    const payload = {
      ...formData,
      price: Number(formData.price),
      image:
        formData.image.trim() ||
        'https://images.unsplash.com/photo-1559056199-641a0ac8b55e?q=80&w=800&auto=format&fit=crop'
    };

    if (editingProductId) {
      updateProduct({ id: editingProductId, ...payload });
      setEditingProductId(null);
    } else {
      addProduct(payload);
    }

    // Reset Form
    setFormData({
      name: '',
      category: 'Single-Origin Beans',
      price: '',
      notes: '',
      description: '',
      image: '',
      status: 'AVAILABLE',
      isFeatured: false
    });
  };

  const handleEditClick = (product) => {
    setEditingProductId(product.id);
    setFormData({
      name: product.name,
      category: product.category,
      price: product.price,
      notes: product.notes || '',
      description: product.description || '',
      image: product.image || '',
      status: product.status || 'AVAILABLE',
      isFeatured: Boolean(product.isFeatured)
    });
    // scroll to form
    const formElement = document.getElementById('admin-product-form');
    if (formElement) {
      formElement.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleCancelEdit = () => {
    setEditingProductId(null);
    setFormData({
      name: '',
      category: 'Single-Origin Beans',
      price: '',
      notes: '',
      description: '',
      image: '',
      status: 'AVAILABLE',
      isFeatured: false
    });
  };

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
              Admin &amp; Operations Portal
            </h1>
            <p className="text-xs sm:text-sm text-coffee-brown/70 dark:text-warm-sand/70">
              Manage live product inventory, pricing, availability toggles, and review customer order logs.
            </p>
          </div>

          {/* Tab buttons */}
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

        {/* TAB 1: PRODUCT MANAGEMENT */}
        {activeTab === 'products' && (
          <div className="space-y-10">
            
            {/* Form Tambah/Edit Produk */}
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
                  {/* Name */}
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

                  {/* Category Dropdown */}
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider mb-1">
                      Category *
                    </label>
                    <select
                      name="category"
                      value={formData.category}
                      onChange={handleInputChange}
                      className="w-full px-3.5 py-2 rounded-xl border border-warm-sand/40 dark:border-dark-slate/60 bg-cream-main/40 dark:bg-dark-slate/60 text-xs text-coffee-brown dark:text-cream-main focus:outline-none focus:border-amber-gold cursor-pointer"
                    >
                      {categories.map((c) => (
                        <option key={c} value={c}>{c}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {/* Price */}
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

                  {/* Tasting Notes */}
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-semibold uppercase tracking-wider mb-1">
                      Tasting Notes
                    </label>
                    <input
                      type="text"
                      name="notes"
                      placeholder="e.g. Dark Plum, Brown Sugar, Cedarwood"
                      value={formData.notes}
                      onChange={handleInputChange}
                      className="w-full px-3.5 py-2 rounded-xl border border-warm-sand/40 dark:border-dark-slate/60 bg-cream-main/40 dark:bg-dark-slate/60 text-xs text-coffee-brown dark:text-cream-main focus:outline-none focus:border-amber-gold"
                    />
                  </div>
                </div>

                {/* Description */}
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider mb-1">
                    Description
                  </label>
                  <textarea
                    rows={2}
                    name="description"
                    placeholder="Short summary of roast profile, origin, or brewing recommendations..."
                    value={formData.description}
                    onChange={handleInputChange}
                    className="w-full px-3.5 py-2 rounded-xl border border-warm-sand/40 dark:border-dark-slate/60 bg-cream-main/40 dark:bg-dark-slate/60 text-xs text-coffee-brown dark:text-cream-main focus:outline-none focus:border-amber-gold"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-center">
                  {/* Image URL */}
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

                  {/* Status & Featured */}
                  <div className="flex items-center gap-4 pt-4 sm:pt-2">
                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wider mb-1">
                        Status
                      </label>
                      <select
                        name="status"
                        value={formData.status}
                        onChange={handleInputChange}
                        className="px-3 py-1.5 rounded-lg border border-warm-sand/40 dark:border-dark-slate/60 bg-cream-main/40 dark:bg-dark-slate/60 text-xs text-coffee-brown dark:text-cream-main"
                      >
                        <option value="AVAILABLE">AVAILABLE</option>
                        <option value="SOLD OUT">SOLD OUT</option>
                      </select>
                    </div>

                    <div className="flex items-center gap-2 pt-4">
                      <input
                        type="checkbox"
                        id="isFeatured"
                        name="isFeatured"
                        checked={formData.isFeatured}
                        onChange={handleInputChange}
                        className="w-4 h-4 rounded text-amber-gold accent-amber-gold"
                      />
                      <label htmlFor="isFeatured" className="text-xs font-medium cursor-pointer">
                        Featured Drop
                      </label>
                    </div>
                  </div>
                </div>

                <div className="pt-2 flex justify-end gap-3">
                  <button
                    type="submit"
                    id="save-product-btn"
                    className="px-6 py-2.5 rounded-xl bg-amber-gold text-dark-roasted font-bold text-xs uppercase tracking-wider hover:bg-amber-gold/90 transition shadow-sm cursor-pointer"
                  >
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
                  <p className="text-xs text-coffee-brown/60 dark:text-warm-sand/60">
                    Click status to immediately toggle Available / Sold Out.
                  </p>
                </div>

                <button
                  onClick={resetToDefaultProducts}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-warm-sand/40 text-xs font-semibold text-coffee-brown/80 dark:text-warm-sand/80 hover:bg-warm-sand/20 dark:hover:bg-dark-slate/50 transition cursor-pointer self-start sm:self-auto"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>Restore Initial Mock Items</span>
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-warm-sand/20 dark:bg-dark-slate/60 text-coffee-brown/80 dark:text-warm-sand/80 uppercase font-semibold">
                    <tr>
                      <th className="py-3.5 px-4">Item</th>
                      <th className="py-3.5 px-4">Category</th>
                      <th className="py-3.5 px-4">Price</th>
                      <th className="py-3.5 px-4">Tasting Notes</th>
                      <th className="py-3.5 px-4 text-center">Status</th>
                      <th className="py-3.5 px-4 text-center">Featured</th>
                      <th className="py-3.5 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-warm-sand/20 dark:divide-dark-slate/60">
                    {products.map((p) => (
                      <tr key={p.id} className="hover:bg-warm-sand/10 dark:hover:bg-dark-slate/30 transition">
                        <td className="py-3.5 px-4 flex items-center gap-3">
                          <img
                            src={p.image}
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
                          {p.category}
                        </td>
                        <td className="py-3.5 px-4 whitespace-nowrap font-bold text-amber-gold">
                          {formatIDR(p.price)}
                        </td>
                        <td className="py-3.5 px-4 max-w-xs truncate text-coffee-brown/70 dark:text-warm-sand/70">
                          {p.notes || '-'}
                        </td>
                        <td className="py-3.5 px-4 text-center whitespace-nowrap">
                          <button
                            id={`toggle-status-${p.id}`}
                            onClick={() => toggleStatus(p.id)}
                            className={`px-2.5 py-1 rounded-full text-[10px] font-bold tracking-wider uppercase transition cursor-pointer ${
                              p.status === 'AVAILABLE'
                                ? 'bg-sage-green/20 text-coffee-brown dark:text-sage-green hover:bg-sage-green/30'
                                : 'bg-red-500/20 text-red-600 dark:text-red-400 hover:bg-red-500/30'
                            }`}
                          >
                            {p.status}
                          </button>
                        </td>
                        <td className="py-3.5 px-4 text-center whitespace-nowrap">
                          {p.isFeatured ? (
                            <span className="px-2 py-0.5 rounded bg-amber-gold/20 text-coffee-brown dark:text-amber-gold font-semibold text-[10px]">
                              YES
                            </span>
                          ) : (
                            <span className="text-coffee-brown/40 dark:text-warm-sand/40 text-[10px]">No</span>
                          )}
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
                            onClick={() => {
                              if (window.confirm(`Are you sure you want to delete ${p.name}?`)) {
                                deleteProduct(p.id);
                              }
                            }}
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
            <div className="p-5 border-b border-warm-sand/20 dark:border-dark-slate/60 bg-warm-sand/10 dark:bg-dark-slate/20">
              <h3 className="font-bold text-base text-coffee-brown dark:text-cream-main font-poppins">
                Transaction &amp; Order History Logs ({orders.length})
              </h3>
              <p className="text-xs text-coffee-brown/60 dark:text-warm-sand/60">
                Real-time synchronized transactions logged from the live cart checkout.
              </p>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-warm-sand/20 dark:bg-dark-slate/60 text-coffee-brown/80 dark:text-warm-sand/80 uppercase font-semibold">
                  <tr>
                    <th className="py-3.5 px-4">Order ID</th>
                    <th className="py-3.5 px-4">Customer &amp; Note</th>
                    <th className="py-3.5 px-4">Ordered Items</th>
                    <th className="py-3.5 px-4">Payment Method</th>
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
                      <td className="py-3.5 px-4">
                        <p className="font-bold text-coffee-brown dark:text-cream-main">{ord.customerName}</p>
                        <p className="text-[11px] text-coffee-brown/60 dark:text-warm-sand/60">
                          {ord.customerAddress || ord.customerPhone || ord.customerEmail || 'Kissaten Table'}
                        </p>
                      </td>
                      <td className="py-3.5 px-4 max-w-xs">
                        <ul className="list-disc list-inside space-y-0.5 text-coffee-brown/80 dark:text-warm-sand/80 text-[11px]">
                          {ord.items && ord.items.map((it, idx) => (
                            <li key={idx} className="truncate">
                              {it.quantity}x {it.name}
                            </li>
                          ))}
                        </ul>
                      </td>
                      <td className="py-3.5 px-4 whitespace-nowrap text-coffee-brown/80 dark:text-warm-sand/80">
                        {ord.paymentMethod || 'Midtrans Snap Mock'}
                      </td>
                      <td className="py-3.5 px-4 whitespace-nowrap font-bold text-coffee-brown dark:text-cream-main">
                        {formatIDR(ord.totalPrice)}
                      </td>
                      <td className="py-3.5 px-4 whitespace-nowrap text-[11px] text-coffee-brown/60 dark:text-warm-sand/60">
                        {formatDate(ord.createdAt)}
                      </td>
                      <td className="py-3.5 px-4 text-center whitespace-nowrap">
                        <span className="px-2.5 py-1 rounded-full bg-sage-green/20 text-coffee-brown dark:text-sage-green font-bold text-[10px]">
                          {ord.status || 'PAID'}
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
