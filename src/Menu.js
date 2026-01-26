import React, { useState, useEffect } from 'react';
import { ShoppingCart, Plus, Minus, Trash2, MapPin, CreditCard, DollarSign, Check, X, User, Phone } from 'lucide-react';
import customerService from './customerService';
import settingsService from './settingsService';

const DELIVERY_FEE = 8.00;

// Componente do Item do Menu
const MenuItem = ({ item, onAdd }) => {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow">
      <img 
        src={item.image} 
        alt={item.name}
        className="w-full h-48 object-cover"
      />
      <div className="p-4">
        <h3 className="font-bold text-lg mb-1">{item.name}</h3>
        <p className="text-gray-600 text-sm mb-3 min-h-[40px]">{item.description}</p>
        <div className="flex items-center justify-between">
          <span className="text-xl font-bold text-orange-600">
            R$ {item.price.toFixed(2)}
          </span>
          <button
            onClick={() => onAdd(item)}
            className="bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700 transition flex items-center gap-2"
          >
            <Plus size={18} />
            Adicionar
          </button>
        </div>
      </div>
    </div>
  );
};

// Componente do Carrinho
const Cart = ({ cart, onUpdateQuantity, onRemove, onCheckout }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [showCheckout, setShowCheckout] = useState(false);
  
  // Dados do cliente
  const [phone, setPhone] = useState('');
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('');
  const [loading, setLoading] = useState(false);
  const [customerFound, setCustomerFound] = useState(false);

  const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const total = subtotal + DELIVERY_FEE;
  const itemCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  const formatPhone = (value) => {
    const numbers = value.replace(/\D/g, '');
    if (numbers.length <= 11) {
      return numbers.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
    }
    return value;
  };

  const handlePhoneChange = (e) => {
    const formatted = formatPhone(e.target.value);
    setPhone(formatted);
    setCustomerFound(false);
  };

  const handlePhoneBlur = async () => {
    if (phone.replace(/\D/g, '').length >= 10) {
      setLoading(true);
      try {
        const customer = await customerService.getCustomerByPhone(phone);
        if (customer) {
          setName(customer.name);
          setAddress(customer.address);
          setCustomerFound(true);
        }
      } catch (error) {
        console.error('Erro ao buscar cliente:', error);
      } finally {
        setLoading(false);
      }
    }
  };

  const handleFinishOrder = () => {
    if (cart.length === 0) {
      alert('Adicione itens ao carrinho!');
      return;
    }
    setShowCheckout(true);
  };

  const handleConfirmOrder = async () => {
    if (!name.trim()) {
      alert('Por favor, insira seu nome!');
      return;
    }
    if (phone.replace(/\D/g, '').length < 10) {
      alert('Por favor, insira um telefone válido!');
      return;
    }
    if (!address.trim()) {
      alert('Por favor, insira o endereço de entrega!');
      return;
    }
    if (!paymentMethod) {
      alert('Por favor, selecione a forma de pagamento!');
      return;
    }

    setLoading(true);
    
    try {
      // Registrar ou atualizar cliente
      await customerService.registerCustomer({
        name,
        phone,
        address
      });

      const order = {
        items: cart,
        address,
        paymentMethod,
        subtotal,
        deliveryFee: DELIVERY_FEE,
        total,
        timestamp: new Date().toISOString(),
        customerName: name,
        customerPhone: phone
      };

      // Atualizar estatísticas do cliente
      await customerService.updateCustomerStats(phone, total);

      onCheckout(order);
      
      // Limpar formulário
      setShowCheckout(false);
      setIsOpen(false);
      setPhone('');
      setName('');
      setAddress('');
      setPaymentMethod('');
      setCustomerFound(false);
      
    } catch (error) {
      console.error('Erro ao finalizar pedido:', error);
      alert('Erro ao finalizar pedido. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Botão flutuante do carrinho */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 bg-orange-600 text-white p-4 rounded-full shadow-lg hover:bg-orange-700 transition z-50"
      >
        <ShoppingCart size={28} />
        {itemCount > 0 && (
          <span className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-7 h-7 flex items-center justify-center text-sm font-bold">
            {itemCount}
          </span>
        )}
      </button>

      {/* Modal do Carrinho */}
      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-end md:items-center justify-center">
          <div className="bg-white w-full md:w-2/3 lg:w-1/2 md:rounded-lg max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-orange-600 text-white p-4 flex items-center justify-between">
              <h2 className="text-xl font-bold flex items-center gap-2">
                <ShoppingCart size={24} />
                Meu Carrinho ({itemCount} {itemCount === 1 ? 'item' : 'itens'})
              </h2>
              <button onClick={() => setIsOpen(false)} className="hover:bg-orange-700 p-2 rounded">
                <X size={24} />
              </button>
            </div>

            <div className="p-4">
              {cart.length === 0 ? (
                <div className="text-center py-12 text-gray-500">
                  <ShoppingCart size={64} className="mx-auto mb-4 opacity-50" />
                  <p>Seu carrinho está vazio</p>
                </div>
              ) : (
                <>
                  {/* Itens do Carrinho */}
                  <div className="space-y-3 mb-6">
                    {cart.map(item => (
                      <div key={item.id} className="flex items-center gap-4 bg-gray-50 p-3 rounded-lg">
                        <img src={item.image} alt={item.name} className="w-20 h-20 object-cover rounded" />
                        <div className="flex-1">
                          <h3 className="font-semibold">{item.name}</h3>
                          <p className="text-orange-600 font-bold">R$ {item.price.toFixed(2)}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
                            className="bg-gray-300 p-1 rounded hover:bg-gray-400"
                          >
                            <Minus size={16} />
                          </button>
                          <span className="font-bold w-8 text-center">{item.quantity}</span>
                          <button
                            onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                            className="bg-gray-300 p-1 rounded hover:bg-gray-400"
                          >
                            <Plus size={16} />
                          </button>
                          <button
                            onClick={() => onRemove(item.id)}
                            className="bg-red-500 text-white p-1 rounded hover:bg-red-600 ml-2"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Resumo de Preços */}
                  <div className="border-t pt-4 space-y-2 mb-6">
                    <div className="flex justify-between text-gray-700">
                      <span>Subtotal:</span>
                      <span>R$ {subtotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-gray-700">
                      <span>Taxa de entrega:</span>
                      <span>R$ {DELIVERY_FEE.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-xl font-bold border-t pt-2">
                      <span>Total:</span>
                      <span className="text-orange-600">R$ {total.toFixed(2)}</span>
                    </div>
                  </div>

                  {/* Checkout */}
                  {!showCheckout ? (
                    <button
                      onClick={handleFinishOrder}
                      className="w-full bg-green-600 text-white py-3 rounded-lg font-bold hover:bg-green-700 transition"
                    >
                      Finalizar Pedido
                    </button>
                  ) : (
                    <div className="space-y-4">
                      <h3 className="font-bold text-lg text-gray-800 mb-4">Dados para Entrega</h3>

                      {/* Telefone */}
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Telefone *
                        </label>
                        <div className="relative">
                          <Phone size={20} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                          <input
                            type="tel"
                            value={phone}
                            onChange={handlePhoneChange}
                            onBlur={handlePhoneBlur}
                            className="w-full pl-10 pr-4 py-3 border-2 border-gray-300 rounded-lg focus:border-orange-500 outline-none transition"
                            placeholder="(11) 98765-4321"
                            required
                            maxLength={15}
                          />
                        </div>
                        {customerFound && (
                          <p className="text-xs text-green-600 mt-1">✓ Dados encontrados! Confirme as informações abaixo.</p>
                        )}
                      </div>

                      {/* Nome */}
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Nome Completo *
                        </label>
                        <div className="relative">
                          <User size={20} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                          <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="w-full pl-10 pr-4 py-3 border-2 border-gray-300 rounded-lg focus:border-orange-500 outline-none transition"
                            placeholder="João Silva"
                            required
                          />
                        </div>
                      </div>

                      {/* Endereço */}
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Endereço de Entrega *
                        </label>
                        <div className="relative">
                          <MapPin size={20} className="absolute left-3 top-3 text-gray-400" />
                          <textarea
                            value={address}
                            onChange={(e) => setAddress(e.target.value)}
                            className="w-full pl-10 pr-4 py-3 border-2 border-gray-300 rounded-lg focus:border-orange-500 outline-none transition"
                            placeholder="Rua, número, bairro, complemento..."
                            rows="3"
                            required
                          />
                        </div>
                      </div>

                      {/* Forma de Pagamento */}
                      <div>
                        <label className="flex items-center gap-2 font-semibold mb-2">
                          <CreditCard size={20} />
                          Forma de Pagamento *
                        </label>
                        <div className="space-y-2">
                          <label className="flex items-center gap-3 p-3 border-2 rounded-lg cursor-pointer hover:bg-gray-50">
                            <input
                              type="radio"
                              name="payment"
                              value="pix"
                              checked={paymentMethod === 'pix'}
                              onChange={(e) => setPaymentMethod(e.target.value)}
                              className="w-5 h-5"
                            />
                            <CreditCard size={20} />
                            <span>PIX</span>
                          </label>
                          <label className="flex items-center gap-3 p-3 border-2 rounded-lg cursor-pointer hover:bg-gray-50">
                            <input
                              type="radio"
                              name="payment"
                              value="dinheiro"
                              checked={paymentMethod === 'dinheiro'}
                              onChange={(e) => setPaymentMethod(e.target.value)}
                              className="w-5 h-5"
                            />
                            <DollarSign size={20} />
                            <span>Dinheiro</span>
                          </label>
                        </div>
                      </div>

                      {/* Botões */}
                      <div className="flex gap-3">
                        <button
                          onClick={() => setShowCheckout(false)}
                          disabled={loading}
                          className="flex-1 bg-gray-300 text-gray-700 py-3 rounded-lg font-bold hover:bg-gray-400 transition disabled:opacity-50"
                        >
                          Voltar
                        </button>
                        <button
                          onClick={handleConfirmOrder}
                          disabled={loading}
                          className="flex-1 bg-green-600 text-white py-3 rounded-lg font-bold hover:bg-green-700 transition flex items-center justify-center gap-2 disabled:opacity-50"
                        >
                          {loading ? 'Processando...' : (
                            <>
                              <Check size={20} />
                              Confirmar Pedido
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

// Componente Principal do Menu
const Menu = ({ onNewOrder, onAccessInternal }) => {
  const [cart, setCart] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('Todas');
  const [menuItems, setMenuItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadMenu();
    
    // Escutar mudanças em tempo real
    const unsubscribe = settingsService.onMenuChange((items) => {
      setMenuItems(items.filter(item => item.available !== false));
    });

    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, []);

  const loadMenu = async () => {
    setLoading(true);
    try {
      const items = await settingsService.getMenu();
      // Filtrar apenas itens disponíveis
      setMenuItems(items.filter(item => item.available !== false));
    } catch (error) {
      console.error('Erro ao carregar menu:', error);
    } finally {
      setLoading(false);
    }
  };

  const categories = ['Todas', ...new Set(menuItems.map(item => item.category))];

  const filteredItems = selectedCategory === 'Todas'
    ? menuItems
    : menuItems.filter(item => item.category === selectedCategory);

  const handleAddToCart = (item) => {
    const existingItem = cart.find(cartItem => cartItem.id === item.id);
    if (existingItem) {
      setCart(cart.map(cartItem =>
        cartItem.id === item.id
          ? { ...cartItem, quantity: cartItem.quantity + 1 }
          : cartItem
      ));
    } else {
      setCart([...cart, { ...item, quantity: 1 }]);
    }
  };

  const handleUpdateQuantity = (itemId, newQuantity) => {
    if (newQuantity === 0) {
      handleRemoveFromCart(itemId);
    } else {
      setCart(cart.map(item =>
        item.id === itemId ? { ...item, quantity: newQuantity } : item
      ));
    }
  };

  const handleRemoveFromCart = (itemId) => {
    setCart(cart.filter(item => item.id !== itemId));
  };

  const handleCheckout = async (order) => {
    // Som de campainha
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    
    const playBell = (frequency, startTime, duration) => {
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      
      oscillator.frequency.value = frequency;
      oscillator.type = 'sine';
      
      gainNode.gain.setValueAtTime(0.3, startTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, startTime + duration);
      
      oscillator.start(startTime);
      oscillator.stop(startTime + duration);
    };
    
    const now = audioContext.currentTime;
    playBell(800, now, 0.3);
    playBell(600, now + 0.35, 0.4);

    // Enviar pedido para a cozinha
    onNewOrder(order);

    // Limpar carrinho
    setCart([]);
    
    alert('🎉 Pedido enviado com sucesso!\n\nVocê receberá uma confirmação em breve.');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-orange-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando cardápio...</p>
        </div>
      </div>
    );
  }

  if (menuItems.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50">
        {/* Header */}
        <header className="bg-white shadow-md">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <h1 className="text-2xl font-bold text-gray-800">🍕 Nosso Cardápio</h1>
              <button
                onClick={onAccessInternal}
                className="px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-800 transition text-sm"
              >
                Acesso Interno
              </button>
            </div>
          </div>
        </header>
        
        {/* Conteúdo Vazio */}
        <div className="flex items-center justify-center" style={{minHeight: 'calc(100vh - 80px)'}}>
          <div className="text-center">
            <div className="bg-orange-100 rounded-full w-24 h-24 flex items-center justify-center mx-auto mb-6">
              <svg className="w-12 h-12 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Cardápio Vazio</h2>
            <p className="text-gray-600 mb-6">O administrador precisa adicionar itens ao menu.</p>
            <p className="text-sm text-gray-500 bg-yellow-50 border border-yellow-200 rounded-lg p-4 inline-block">
              💡 <strong>Administrador:</strong> Clique em "Acesso Interno" acima para configurar o cardápio
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50">
      {/* Header */}
      <header className="bg-white shadow-md sticky top-0 z-40">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-gray-800">🍕 Nosso Cardápio</h1>
            <button
              onClick={onAccessInternal}
              className="px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-800 transition text-sm"
            >
              Acesso Interno
            </button>
          </div>
        </div>
      </header>

      {/* Categorias */}
      <div className="bg-white shadow-sm sticky top-[72px] z-30">
        <div className="container mx-auto px-4 py-3 overflow-x-auto">
          <div className="flex gap-2 min-w-max">
            {categories.map(category => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-lg transition whitespace-nowrap ${
                  selectedCategory === category
                    ? 'bg-orange-600 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Menu Items */}
      <main className="container mx-auto px-4 py-6">
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-24">
          {filteredItems.map(item => (
            <MenuItem key={item.id} item={item} onAdd={handleAddToCart} />
          ))}
        </div>
      </main>

      {/* Carrinho */}
      <Cart
        cart={cart}
        onUpdateQuantity={handleUpdateQuantity}
        onRemove={handleRemoveFromCart}
        onCheckout={handleCheckout}
      />
    </div>
  );
};

export default Menu;
