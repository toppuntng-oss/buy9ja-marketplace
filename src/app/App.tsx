import { useState } from "react";
import {
  ShoppingCart,
  Search,
  MapPin,
  X,
  ChevronDown,
  ArrowLeft,
  ChevronRight,
  Store,
  Plus,
  Minus,
  Trash2,
} from "lucide-react";
import { PaystackButton } from "./components/PaystackButton";
import { Footer } from "./components/Footer";
import {
  categories,
  vendors,
  products,
  getVendorsByCategory,
  getVendorsBySubcategory,
  getProductsByVendor,
  getCategoryById,
  getSubcategoryById,
  type Category,
  type Subcategory,
  type Vendor,
  type Product,
} from "@/services/marketplaceData";

interface CartItemType {
  id: string;
  name: string;
  price: number;
  quantity: number;
}

interface Order {
  id: string;
  status: "preparing" | "on-the-way" | "delivered";
  estimatedTime: string;
  items: CartItemType[];
  total: number;
}

type View = "home" | "category" | "subcategory" | "vendor" | "orders";

export default function App() {
  const [currentView, setCurrentView] = useState<View>("home");
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [selectedSubcategory, setSelectedSubcategory] = useState<Subcategory | null>(null);
  const [selectedVendor, setSelectedVendor] = useState<Vendor | null>(null);
  const [cart, setCart] = useState<CartItemType[]>([]);
  const [showCart, setShowCart] = useState(false);
  const [orders, setOrders] = useState<Order[]>([]);
  const [searchQuery, setSearchQuery] = useState("");

  // Navigation handlers
  const handleCategoryClick = (category: Category) => {
    setSelectedCategory(category);
    setSelectedSubcategory(null);
    setSelectedVendor(null);
    setCurrentView("category");
  };

  const handleSubcategoryClick = (subcategory: Subcategory) => {
    setSelectedSubcategory(subcategory);
    setSelectedVendor(null);
    setCurrentView("subcategory");
  };

  const handleVendorClick = (vendor: Vendor) => {
    setSelectedVendor(vendor);
    setCurrentView("vendor");
  };

  const handleBackToHome = () => {
    setCurrentView("home");
    setSelectedCategory(null);
    setSelectedSubcategory(null);
    setSelectedVendor(null);
  };

  const handleBackToCategory = () => {
    setCurrentView("category");
    setSelectedSubcategory(null);
    setSelectedVendor(null);
  };

  const handleBackToSubcategory = () => {
    setCurrentView("subcategory");
    setSelectedVendor(null);
  };

  // Cart handlers
  const handleAddToCart = (product: Product) => {
    setCart((prevCart) => {
      const existingItem = prevCart.find((item) => item.id === product.id);
      if (existingItem) {
        return prevCart.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [
        ...prevCart,
        {
          id: product.id,
          name: product.name,
          price: product.price,
          quantity: 1,
        },
      ];
    });
  };

  const incrementCart = (id: string) => {
    setCart((prevCart) =>
      prevCart.map((item) =>
        item.id === id ? { ...item, quantity: item.quantity + 1 } : item
      )
    );
  };

  const decrementCart = (id: string) => {
    setCart((prevCart) =>
      prevCart
        .map((item) =>
          item.id === id ? { ...item, quantity: item.quantity - 1 } : item
        )
        .filter((item) => item.quantity > 0)
    );
  };

  const removeFromCart = (id: string) => {
    setCart((prevCart) => prevCart.filter((item) => item.id !== id));
  };

  const calculateTotal = () => {
    return cart.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  const handleCheckout = () => {
    if (cart.length === 0) return;

    const newOrder: Order = {
      id: `ORD${Date.now().toString().slice(-6)}`,
      status: "preparing",
      estimatedTime: "25-35 min",
      items: [...cart],
      total: calculateTotal() + 500,
    };

    setOrders((prevOrders) => [newOrder, ...prevOrders]);
    setCart([]);
    setShowCart(false);
    setCurrentView("orders");

    setTimeout(() => {
      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order.id === newOrder.id ? { ...order, status: "on-the-way" } : order
        )
      );
    }, 5000);
  };

  const handlePaymentSuccess = (response: any) => {
    console.log("Payment successful!", response);
    handleCheckout();
  };

  const handlePaymentClose = () => {
    console.log("Payment popup closed");
  };

  // Get current vendors based on view
  const getCurrentVendors = () => {
    if (selectedSubcategory) {
      return getVendorsBySubcategory(selectedSubcategory.id);
    }
    if (selectedCategory) {
      return getVendorsByCategory(selectedCategory.id);
    }
    return [];
  };

  // Search filter
  const filteredVendors = getCurrentVendors().filter((vendor) =>
    vendor.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const cartItemCount = cart.reduce((count, item) => count + item.quantity, 0);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div
              className="flex items-center gap-4 cursor-pointer"
              onClick={handleBackToHome}
            >
              <div>
                <h1 className="text-xl font-bold text-green-600">Buy9ja</h1>
                <div className="flex items-center gap-1 text-sm text-gray-600">
                  <MapPin className="w-4 h-4" />
                  <span>Enugu, Nigeria</span>
                  <ChevronDown className="w-4 h-4" />
                </div>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <button
                onClick={() => setCurrentView("orders")}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  currentView === "orders"
                    ? "bg-green-100 text-green-600"
                    : "hover:bg-gray-100"
                }`}
              >
                Orders
              </button>
              <button
                onClick={() => setShowCart(!showCart)}
                className="relative p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ShoppingCart className="w-6 h-6" />
                {cartItemCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-green-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {cartItemCount}
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-6">
        {/* Home View - Categories */}
        {currentView === "home" && (
          <div>
            <div className="mb-8">
              <h2 className="mb-2">Welcome to Buy9ja Marketplace</h2>
              <p className="text-gray-600">
                Everything you need, delivered to your door
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {categories.map((category) => (
                <div
                  key={category.id}
                  onClick={() => handleCategoryClick(category)}
                  className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-all cursor-pointer group"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="text-5xl">{category.icon}</div>
                    <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-green-600 transition-colors" />
                  </div>
                  <h3 className="mb-2 group-hover:text-green-600 transition-colors">
                    {category.name}
                  </h3>
                  <p className="text-sm text-gray-600">{category.description}</p>
                  <div className="mt-4 text-sm text-gray-500">
                    {category.subcategories.length} subcategories
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Category View - Subcategories */}
        {currentView === "category" && selectedCategory && (
          <div>
            <button
              onClick={handleBackToHome}
              className="flex items-center gap-2 mb-6 text-gray-600 hover:text-gray-900 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              <span>Back to categories</span>
            </button>

            <div className="mb-8">
              <div className="flex items-center gap-3 mb-2">
                <span className="text-4xl">{selectedCategory.icon}</span>
                <h2>{selectedCategory.name}</h2>
              </div>
              <p className="text-gray-600">{selectedCategory.description}</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {selectedCategory.subcategories.map((subcategory) => {
                const vendorCount = getVendorsBySubcategory(subcategory.id).length;
                return (
                  <div
                    key={subcategory.id}
                    onClick={() => handleSubcategoryClick(subcategory)}
                    className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-all cursor-pointer group"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <Store className="w-8 h-8 text-green-600" />
                      <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-green-600 transition-colors" />
                    </div>
                    <h4 className="mb-2 group-hover:text-green-600 transition-colors">
                      {subcategory.name}
                    </h4>
                    <p className="text-sm text-gray-600 mb-4">
                      {subcategory.description}
                    </p>
                    <div className="text-sm text-gray-500">
                      {vendorCount} {vendorCount === 1 ? "vendor" : "vendors"} available
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Subcategory View - Vendors */}
        {currentView === "subcategory" && selectedSubcategory && (
          <div>
            <button
              onClick={handleBackToCategory}
              className="flex items-center gap-2 mb-6 text-gray-600 hover:text-gray-900 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              <span>Back to {selectedCategory?.name}</span>
            </button>

            <div className="mb-6">
              <h2 className="mb-2">{selectedSubcategory.name}</h2>
              <p className="text-gray-600">{selectedSubcategory.description}</p>
            </div>

            {/* Search */}
            <div className="mb-6">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search vendors..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredVendors.map((vendor) => (
                <div
                  key={vendor.id}
                  onClick={() => handleVendorClick(vendor)}
                  className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all cursor-pointer"
                >
                  <div className="h-48 overflow-hidden">
                    <img
                      src={vendor.image}
                      alt={vendor.name}
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <div className="p-4">
                    <div className="flex items-start justify-between mb-2">
                      <h4>{vendor.name}</h4>
                      {vendor.isOpen && (
                        <span className="text-xs bg-green-100 text-green-600 px-2 py-1 rounded">
                          Open
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-gray-600 mb-3">
                      {vendor.description}
                    </p>
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-1">
                        <span>⭐</span>
                        <span>{vendor.rating}</span>
                      </div>
                      <div className="text-gray-600">{vendor.deliveryTime}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Vendor View - Products */}
        {currentView === "vendor" && selectedVendor && (
          <div>
            <button
              onClick={handleBackToSubcategory}
              className="flex items-center gap-2 mb-6 text-gray-600 hover:text-gray-900 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              <span>Back to vendors</span>
            </button>

            {/* Vendor Header */}
            <div className="bg-white rounded-xl p-6 shadow-sm mb-6">
              <div className="flex items-start justify-between">
                <div>
                  <h2 className="mb-1">{selectedVendor.name}</h2>
                  <p className="text-gray-600 mb-2">{selectedVendor.description}</p>
                  <div className="flex items-center gap-4 text-sm">
                    <div className="flex items-center gap-1">
                      <span>⭐</span>
                      <span>{selectedVendor.rating}</span>
                    </div>
                    <div className="text-gray-600">
                      🕐 {selectedVendor.deliveryTime}
                    </div>
                  </div>
                </div>
                {selectedVendor.isOpen && (
                  <span className="bg-green-100 text-green-600 px-3 py-1 rounded-lg text-sm">
                    Open Now
                  </span>
                )}
              </div>
            </div>

            {/* Products */}
            <div>
              <h3 className="mb-4">Available Products</h3>
              {getProductsByVendor(selectedVendor.id).length === 0 ? (
                <div className="bg-white rounded-xl p-12 text-center text-gray-500">
                  No products available
                </div>
              ) : (
                <div className="space-y-4">
                  {getProductsByVendor(selectedVendor.id).map((product) => (
                    <div
                      key={product.id}
                      className="bg-white rounded-lg p-4 flex gap-4 shadow-sm hover:shadow-md transition-shadow"
                    >
                      <div className="flex-1">
                        <h4 className="mb-1">{product.name}</h4>
                        <p className="text-sm text-gray-600 mb-2">
                          {product.description}
                        </p>
                        <p className="font-semibold text-lg">
                          ₦{product.price.toFixed(2)}
                          {product.unit && (
                            <span className="text-sm text-gray-500 ml-1">
                              {product.unit}
                            </span>
                          )}
                        </p>
                      </div>
                      <div className="flex flex-col items-center gap-2">
                        <div className="w-24 h-24 rounded-lg overflow-hidden">
                          <img
                            src={product.image}
                            alt={product.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <button
                          onClick={() => handleAddToCart(product)}
                          disabled={!product.inStock}
                          className="bg-green-600 text-white p-2 rounded-lg hover:bg-green-700 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Orders View */}
        {currentView === "orders" && (
          <div>
            <h2 className="mb-6">Your Orders</h2>
            {orders.length === 0 ? (
              <div className="bg-white rounded-xl p-12 text-center">
                <p className="text-gray-500 mb-4">No orders yet</p>
                <p className="text-sm text-gray-400">
                  Start shopping from our marketplace!
                </p>
              </div>
            ) : (
              <div className="space-y-6">
                {orders.map((order) => (
                  <div key={order.id} className="bg-white rounded-xl p-6 shadow-sm">
                    <div className="mb-4">
                      <h3 className="mb-1">Order #{order.id}</h3>
                      <p className="text-sm text-gray-600">
                        Status: <span className="capitalize">{order.status}</span>
                      </p>
                      {order.estimatedTime && order.status !== "delivered" && (
                        <p className="text-sm text-gray-600">
                          Estimated: {order.estimatedTime}
                        </p>
                      )}
                    </div>
                    <div className="space-y-2 mb-4">
                      {order.items.map((item) => (
                        <div
                          key={item.id}
                          className="flex justify-between text-sm"
                        >
                          <span>
                            {item.name} x {item.quantity}
                          </span>
                          <span>₦{(item.price * item.quantity).toFixed(2)}</span>
                        </div>
                      ))}
                    </div>
                    <div className="border-t pt-4">
                      <div className="flex justify-between font-semibold">
                        <span>Total</span>
                        <span>₦{order.total.toFixed(2)}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </main>

      {/* Cart Sidebar */}
      {showCart && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          <div
            className="absolute inset-0 bg-black bg-opacity-50"
            onClick={() => setShowCart(false)}
          />
          <div className="absolute right-0 top-0 bottom-0 w-full max-w-md bg-white shadow-xl">
            <div className="h-full flex flex-col">
              {/* Cart Header */}
              <div className="flex items-center justify-between p-4 border-b">
                <h3>Your Cart</h3>
                <button
                  onClick={() => setShowCart(false)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Cart Items */}
              <div className="flex-1 overflow-y-auto p-4">
                {cart.length === 0 ? (
                  <div className="text-center py-12 text-gray-500">
                    Your cart is empty
                  </div>
                ) : (
                  <div className="space-y-2">
                    {cart.map((item) => (
                      <div
                        key={item.id}
                        className="flex items-center justify-between py-3 border-b border-gray-100"
                      >
                        <div className="flex-1">
                          <h4 className="font-medium mb-1">{item.name}</h4>
                          <p className="text-sm text-gray-600">
                            ₦{item.price.toFixed(2)}
                          </p>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="flex items-center gap-2 bg-gray-100 rounded-lg">
                            <button
                              onClick={() => decrementCart(item.id)}
                              className="p-2 hover:bg-gray-200 rounded-lg transition-colors"
                            >
                              <Minus className="w-4 h-4" />
                            </button>
                            <span className="w-8 text-center font-medium">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() => incrementCart(item.id)}
                              className="p-2 hover:bg-gray-200 rounded-lg transition-colors"
                            >
                              <Plus className="w-4 h-4" />
                            </button>
                          </div>
                          <button
                            onClick={() => removeFromCart(item.id)}
                            className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Cart Footer */}
              {cart.length > 0 && (
                <div className="border-t p-4 space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Subtotal</span>
                    <span className="font-semibold">
                      ₦{calculateTotal().toFixed(2)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Delivery Fee</span>
                    <span className="font-semibold">₦500.00</span>
                  </div>
                  <div className="border-t pt-4 flex items-center justify-between">
                    <span>Total</span>
                    <span className="text-xl">
                      ₦{(calculateTotal() + 500).toFixed(2)}
                    </span>
                  </div>
                  <PaystackButton
                    amount={(calculateTotal() + 500) * 100}
                    email="customer@example.com"
                    onSuccess={handlePaymentSuccess}
                    onClose={handlePaymentClose}
                    reference={`PAY-${Date.now()}`}
                  >
                    Checkout - Pay with Paystack
                  </PaystackButton>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <Footer />
    </div>
  );
}

