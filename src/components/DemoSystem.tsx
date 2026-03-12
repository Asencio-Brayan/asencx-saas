import { useState } from 'react';
import {
  ShoppingCart, Package, Users,
  TrendingUp, DollarSign, Search, Bell,
  Plus, Minus, Trash2, Check, X,
  BarChart3, ArrowUpRight,
  CreditCard, Receipt, User
} from 'lucide-react';
import { Button } from '@/components/ui/button';

// Productos de ejemplo
const sampleProducts = [
  { id: 1, name: 'Hamburguesa Clásica', price: 120, category: 'Comida', stock: 45 },
  { id: 2, name: 'Pizza Pepperoni', price: 180, category: 'Comida', stock: 32 },
  { id: 3, name: 'Coca Cola 600ml', price: 25, category: 'Bebidas', stock: 100 },
  { id: 4, name: 'Agua Natural', price: 18, category: 'Bebidas', stock: 80 },
  { id: 5, name: 'Papas Fritas', price: 45, category: 'Comida', stock: 60 },
  { id: 6, name: 'Ensalada César', price: 95, category: 'Comida', stock: 25 },
];

// Datos de ventas para el gráfico
const salesData = [
  { day: 'Lun', amount: 2400 },
  { day: 'Mar', amount: 3200 },
  { day: 'Mie', amount: 2800 },
  { day: 'Jue', amount: 4100 },
  { day: 'Vie', amount: 5200 },
  { day: 'Sab', amount: 6800 },
  { day: 'Dom', amount: 5900 },
];

// Transacciones recientes
const recentTransactions = [
  { id: '#001245', customer: 'Juan Pérez', amount: 245, time: '2 min ago', status: 'completed' },
  { id: '#001244', customer: 'María López', amount: 180, time: '5 min ago', status: 'completed' },
  { id: '#001243', customer: 'Carlos Ruiz', amount: 320, time: '12 min ago', status: 'pending' },
  { id: '#001242', customer: 'Ana Torres', amount: 95, time: '18 min ago', status: 'completed' },
];

export function DemoSystem() {
  const [activeTab, setActiveTab] = useState<'pos' | 'inventory' | 'analytics'>('pos');
  const [cart, setCart] = useState<Array<{ id: number; name: string; price: number; qty: number }>>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showCheckout, setShowCheckout] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [notification, setNotification] = useState<string | null>(null);

  // Filtrar productos
  const filteredProducts = sampleProducts.filter(p =>
    p.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Agregar al carrito
  const addToCart = (product: typeof sampleProducts[0]) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        return prev.map(item =>
          item.id === product.id ? { ...item, qty: item.qty + 1 } : item
        );
      }
      return [...prev, { id: product.id, name: product.name, price: product.price, qty: 1 }];
    });
    showNotification(`${product.name} agregado`);
  };

  // Eliminar del carrito
  const removeFromCart = (id: number) => {
    setCart(prev => prev.filter(item => item.id !== id));
  };

  // Cambiar cantidad
  const updateQty = (id: number, delta: number) => {
    setCart(prev => prev.map(item => {
      if (item.id === id) {
        const newQty = Math.max(1, item.qty + delta);
        return { ...item, qty: newQty };
      }
      return item;
    }));
  };

  // Calcular total
  const total = cart.reduce((sum, item) => sum + (item.price * item.qty), 0);

  // Mostrar notificación
  const showNotification = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 2000);
  };

  // Procesar pago
  const processPayment = () => {
    showNotification('¡Pago procesado exitosamente!');
    setCart([]);
    setShowCheckout(false);
  };

  return (
    <div className="w-full bg-[#0A0A0A] rounded-2xl overflow-hidden border border-white/10 shadow-2xl">
      {/* Header del Demo */}
      <div className="bg-[#111111] border-b border-white/10 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-gradient-to-br from-[#00D9FF] to-[#8B5CF6] rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-sm">A</span>
          </div>
          <span className="text-white font-semibold">AsencX Demo</span>
        </div>
        <div className="flex items-center gap-4">
          <div className="relative">
            <Bell className="w-5 h-5 text-gray-400" />
            <span className="absolute -top-1 -right-1 w-4 h-4 bg-[#00D9FF] rounded-full text-[10px] flex items-center justify-center text-black font-bold">
              3
            </span>
          </div>
          <div className="w-8 h-8 bg-gradient-to-br from-gray-600 to-gray-800 rounded-full flex items-center justify-center">
            <User className="w-4 h-4 text-white" />
          </div>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row h-[calc(100vh-140px)] min-h-[500px] lg:h-[600px]">
        {/* Sidebar */}
        <div className="flex lg:flex-col items-center lg:items-stretch w-full lg:w-56 bg-[#111111] border-b lg:border-b-0 lg:border-r border-white/10 flex-shrink-0 overflow-x-auto lg:overflow-visible">
          <nav className="flex lg:flex-col p-2 gap-2 lg:gap-1 w-full lg:w-auto">
            {[
              { id: 'pos', icon: ShoppingCart, label: 'Punto de Venta' },
              { id: 'inventory', icon: Package, label: 'Inventario' },
              { id: 'analytics', icon: BarChart3, label: 'Analytics' },
            ].map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id as any)}
                className={`flex-1 lg:flex-none flex items-center justify-center lg:justify-start gap-3 px-3 py-2.5 rounded-lg transition-all duration-300 min-w-max ${activeTab === item.id
                  ? 'bg-gradient-to-r from-[#00D9FF]/20 to-[#8B5CF6]/20 text-white border border-[#00D9FF]/30'
                  : 'text-gray-400 hover:text-white hover:bg-white/5'
                  }`}
              >
                <item.icon className={`w-5 h-5 ${activeTab === item.id ? 'text-[#00D9FF]' : ''}`} />
                <span className="lg:block text-sm font-medium">{item.label}</span>
              </button>
            ))}
          </nav>

          <div className="hidden lg:block mt-auto p-4">
            <div className="bg-gradient-to-r from-[#00D9FF]/10 to-[#8B5CF6]/10 rounded-lg p-3 border border-white/5">
              <p className="text-xs text-gray-400 mb-1">Plan Professional</p>
              <p className="text-sm text-white font-semibold">$99/mes</p>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 relative overflow-hidden">
          {/* POS View */}
          {activeTab === 'pos' && (
            <div className="flex flex-col lg:flex-row h-full">
              {/* Products Grid */}
              <div className="flex-1 p-4 overflow-y-auto pb-24 lg:pb-4">
                {/* Search */}
                <div className="relative mb-4 sticky top-0 z-10">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                  <input
                    type="text"
                    placeholder="Buscar productos..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full bg-[#1A1A1A]/95 backdrop-blur border border-white/10 rounded-lg pl-10 pr-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-[#00D9FF]/50 shadow-lg"
                  />
                </div>

                {/* Products */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {filteredProducts.map((product) => (
                    <button
                      key={product.id}
                      onClick={() => addToCart(product)}
                      className="bg-[#1A1A1A] border border-white/10 rounded-xl p-4 text-left hover:border-[#00D9FF]/50 hover:bg-[#222] transition-all duration-300 group active:scale-95"
                    >
                      <div className="flex justify-between items-start mb-2">
                        <span className="text-xs text-[#00D9FF] bg-[#00D9FF]/10 px-2 py-0.5 rounded">
                          {product.category}
                        </span>
                        <span className={`text-xs ${product.stock < 30 ? 'text-red-400' : 'text-green-400'}`}>
                          Stock: {product.stock}
                        </span>
                      </div>
                      <h4 className="text-white font-medium text-sm mb-1 group-hover:text-[#00D9FF] transition-colors">
                        {product.name}
                      </h4>
                      <p className="text-xl font-bold text-white">
                        ${product.price}
                      </p>
                    </button>
                  ))}
                </div>
              </div>

              {/* Mobile Cart Trigger Button */}
              <div className="lg:hidden absolute bottom-4 left-4 right-4 z-20">
                <button
                  onClick={() => setIsCartOpen(true)}
                  className="w-full bg-[#111111] border border-white/20 rounded-xl p-4 flex items-center justify-between shadow-2xl active:scale-95 transition-transform"
                >
                  <div className="flex items-center gap-3">
                    <div className="bg-[#00D9FF] text-black w-8 h-8 rounded-full flex items-center justify-center font-bold">
                      {cart.reduce((sum, item) => sum + item.qty, 0)}
                    </div>
                    <span className="text-white font-medium">Ver Carrito</span>
                  </div>
                  <span className="text-[#00D9FF] font-bold text-lg">${total}</span>
                </button>
              </div>

              {/* Cart Panel (Desktop + Mobile Drawer) */}
              <>
                {/* Mobile Backdrop */}
                {isCartOpen && (
                  <div
                    className="lg:hidden absolute inset-0 bg-black/80 backdrop-blur-sm z-30"
                    onClick={() => setIsCartOpen(false)}
                  />
                )}

                <div className={`
                    fixed lg:static inset-x-0 bottom-0 z-40
                    w-full lg:w-80 
                    bg-[#111111] lg:bg-transparent
                    border-t lg:border-t-0 lg:border-l border-white/10 
                    p-4 flex flex-col
                    transition-transform duration-300 ease-out
                    ${isCartOpen ? 'translate-y-0' : 'translate-y-full lg:translate-y-0'}
                    h-[80vh] lg:h-auto rounded-t-2xl lg:rounded-none
                `}>
                  {/* Mobile Handle */}
                  <div className="lg:hidden w-12 h-1.5 bg-white/20 rounded-full mx-auto mb-6" />

                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-white font-semibold flex items-center gap-2">
                      <ShoppingCart className="w-5 h-5 text-[#00D9FF]" />
                      Carrito
                    </h3>
                    <button onClick={() => setIsCartOpen(false)} className="lg:hidden p-2 text-gray-400">
                      <X className="w-5 h-5" />
                    </button>
                  </div>

                  <div className="flex-1 overflow-y-auto space-y-2 mb-4 pr-1">
                    {cart.length === 0 ? (
                      <div className="text-center py-8 text-gray-500">
                        <ShoppingCart className="w-12 h-12 mx-auto mb-2 opacity-30" />
                        <p className="text-sm">Carrito vacío</p>
                        <p className="text-xs">Agrega productos</p>
                      </div>
                    ) : (
                      cart.map((item) => (
                        <div key={item.id} className="bg-[#1A1A1A] rounded-lg p-3">
                          <div className="flex justify-between items-start mb-2">
                            <span className="text-white text-sm font-medium">{item.name}</span>
                            <button
                              onClick={() => removeFromCart(item.id)}
                              className="text-red-400 hover:text-red-300"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => updateQty(item.id, -1)}
                                className="w-6 h-6 bg-white/10 rounded flex items-center justify-center hover:bg-white/20"
                              >
                                <Minus className="w-3 h-3 text-white" />
                              </button>
                              <span className="text-white w-6 text-center">{item.qty}</span>
                              <button
                                onClick={() => updateQty(item.id, 1)}
                                className="w-6 h-6 bg-white/10 rounded flex items-center justify-center hover:bg-white/20"
                              >
                                <Plus className="w-3 h-3 text-white" />
                              </button>
                            </div>
                            <span className="text-[#00D9FF] font-semibold">
                              ${item.price * item.qty}
                            </span>
                          </div>
                        </div>
                      ))
                    )}
                  </div>

                  {/* Total & Checkout */}
                  <div className="border-t border-white/10 pt-4 pb-[calc(1rem+env(safe-area-inset-bottom))] lg:pb-0">
                    <div className="flex justify-between items-center mb-4">
                      <span className="text-gray-400">Total</span>
                      <span className="text-2xl font-bold text-white">${total}</span>
                    </div>
                    <Button
                      onClick={() => {
                        if (cart.length > 0) {
                          setIsCartOpen(false);
                          setShowCheckout(true);
                        }
                      }}
                      disabled={cart.length === 0}
                      className="w-full bg-gradient-to-r from-[#00D9FF] to-[#8B5CF6] text-black font-semibold hover:opacity-90 disabled:opacity-30 h-12"
                    >
                      <CreditCard className="w-4 h-4 mr-2" />
                      Pagar
                    </Button>
                  </div>
                </div>
              </>
            </div>
          )}

          {/* Inventory View */}
          {activeTab === 'inventory' && (
            <div className="p-4 h-full overflow-y-auto">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-white font-semibold text-lg">Control de Inventario</h3>
                <Button className="bg-[#00D9FF]/20 text-[#00D9FF] hover:bg-[#00D9FF]/30">
                  <Plus className="w-4 h-4 mr-2" />
                  Agregar Producto
                </Button>
              </div>

              <div className="bg-[#111111] rounded-xl border border-white/10 overflow-hidden">
                <table className="w-full">
                  <thead className="bg-[#1A1A1A]">
                    <tr>
                      <th className="text-left text-gray-400 text-xs font-medium px-4 py-3">Producto</th>
                      <th className="text-left text-gray-400 text-xs font-medium px-4 py-3">Categoría</th>
                      <th className="text-left text-gray-400 text-xs font-medium px-4 py-3">Precio</th>
                      <th className="text-left text-gray-400 text-xs font-medium px-4 py-3">Stock</th>
                      <th className="text-left text-gray-400 text-xs font-medium px-4 py-3">Estado</th>
                    </tr>
                  </thead>
                  <tbody>
                    {sampleProducts.map((product) => (
                      <tr key={product.id} className="border-t border-white/5 hover:bg-white/5 transition-colors">
                        <td className="px-4 py-3 text-white text-sm">{product.name}</td>
                        <td className="px-4 py-3">
                          <span className="text-xs bg-white/10 text-gray-300 px-2 py-1 rounded">
                            {product.category}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-white text-sm">${product.price}</td>
                        <td className="px-4 py-3 text-white text-sm">{product.stock}</td>
                        <td className="px-4 py-3">
                          <span className={`text-xs px-2 py-1 rounded-full ${product.stock > 40 ? 'bg-green-500/20 text-green-400' :
                            product.stock > 20 ? 'bg-yellow-500/20 text-yellow-400' :
                              'bg-red-500/20 text-red-400'
                            }`}>
                            {product.stock > 40 ? 'Óptimo' : product.stock > 20 ? 'Medio' : 'Bajo'}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Analytics View */}
          {activeTab === 'analytics' && (
            <div className="p-4 h-full overflow-y-auto">
              <h3 className="text-white font-semibold text-lg mb-6">Dashboard de Ventas</h3>

              {/* Stats Cards */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                {[
                  { label: 'Ventas Hoy', value: '$8,420', change: '+12%', icon: DollarSign, color: 'from-[#00D9FF] to-[#00D9FF]/50' },
                  { label: 'Transacciones', value: '156', change: '+8%', icon: Receipt, color: 'from-[#8B5CF6] to-[#8B5CF6]/50' },
                  { label: 'Ticket Promedio', value: '$54', change: '+5%', icon: TrendingUp, color: 'from-green-400 to-green-400/50' },
                  { label: 'Clientes', value: '89', change: '+15%', icon: Users, color: 'from-orange-400 to-orange-400/50' },
                ].map((stat, i) => (
                  <div key={i} className="bg-[#111111] border border-white/10 rounded-xl p-4 hover:border-white/20 transition-colors">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-gray-400 text-xs">{stat.label}</span>
                      <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${stat.color} flex items-center justify-center`}>
                        <stat.icon className="w-4 h-4 text-white" />
                      </div>
                    </div>
                    <div className="text-2xl font-bold text-white mb-1">{stat.value}</div>
                    <div className="text-green-400 text-xs flex items-center gap-1">
                      <ArrowUpRight className="w-3 h-3" />
                      {stat.change} vs ayer
                    </div>
                  </div>
                ))}
              </div>

              {/* Chart */}
              <div className="bg-[#111111] border border-white/10 rounded-xl p-4 mb-4">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="text-white font-medium">Ventas Semanales</h4>
                  <div className="flex gap-2">
                    <button className="text-xs bg-[#00D9FF]/20 text-[#00D9FF] px-3 py-1 rounded">Semana</button>
                    <button className="text-xs text-gray-400 hover:text-white px-3 py-1">Mes</button>
                  </div>
                </div>
                <div className="flex items-end justify-between h-40 gap-2">
                  {salesData.map((day, i) => {
                    const max = Math.max(...salesData.map(d => d.amount));
                    const height = (day.amount / max) * 100;
                    return (
                      <div key={i} className="flex-1 flex flex-col items-center gap-2">
                        <div
                          className="w-full bg-gradient-to-t from-[#00D9FF] to-[#8B5CF6] rounded-t-lg transition-all duration-500 hover:opacity-80 relative group"
                          style={{ height: `${height}%` }}
                        >
                          <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-white text-black text-xs font-bold px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                            ${day.amount.toLocaleString()}
                          </div>
                        </div>
                        <span className="text-xs text-gray-500">{day.day}</span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Recent Transactions */}
              <div className="bg-[#111111] border border-white/10 rounded-xl p-4">
                <h4 className="text-white font-medium mb-4">Transacciones Recientes</h4>
                <div className="space-y-3">
                  {recentTransactions.map((tx) => (
                    <div key={tx.id} className="flex items-center justify-between py-2 border-b border-white/5 last:border-0">
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${tx.status === 'completed' ? 'bg-green-500/20' : 'bg-yellow-500/20'
                          }`}>
                          <Receipt className={`w-5 h-5 ${tx.status === 'completed' ? 'text-green-400' : 'text-yellow-400'
                            }`} />
                        </div>
                        <div>
                          <p className="text-white text-sm font-medium">{tx.customer}</p>
                          <p className="text-gray-500 text-xs">{tx.id} • {tx.time}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-white font-semibold">${tx.amount}</p>
                        <span className={`text-xs ${tx.status === 'completed' ? 'text-green-400' : 'text-yellow-400'
                          }`}>
                          {tx.status === 'completed' ? 'Completado' : 'Pendiente'}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Checkout Modal */}
      {showCheckout && (
        <div className="absolute inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-[#111111] border border-white/20 rounded-2xl p-6 w-96 max-w-[90%]">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-white font-semibold text-lg">Confirmar Pago</h3>
              <button onClick={() => setShowCheckout(false)} className="text-gray-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 mb-6">
              {cart.map((item) => (
                <div key={item.id} className="flex justify-between text-sm">
                  <span className="text-gray-400">{item.name} x{item.qty}</span>
                  <span className="text-white">${item.price * item.qty}</span>
                </div>
              ))}
              <div className="border-t border-white/10 pt-3 flex justify-between">
                <span className="text-white font-semibold">Total</span>
                <span className="text-[#00D9FF] font-bold text-xl">${total}</span>
              </div>
            </div>

            <div className="space-y-2">
              <Button
                onClick={processPayment}
                className="w-full bg-gradient-to-r from-[#00D9FF] to-[#8B5CF6] text-black font-semibold hover:opacity-90"
              >
                <CreditCard className="w-4 h-4 mr-2" />
                Pagar con Tarjeta
              </Button>
              <Button
                variant="outline"
                onClick={processPayment}
                className="w-full border-white/20 text-white hover:bg-white/10"
              >
                <DollarSign className="w-4 h-4 mr-2" />
                Pago en Efectivo
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Notification */}
      {notification && (
        <div className="absolute bottom-4 right-4 bg-gradient-to-r from-[#00D9FF] to-[#8B5CF6] text-black px-4 py-2 rounded-lg font-medium shadow-lg animate-bounce">
          <div className="flex items-center gap-2">
            <Check className="w-4 h-4" />
            {notification}
          </div>
        </div>
      )}
    </div>
  );
}
