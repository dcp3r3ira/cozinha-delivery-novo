import React, { useState, useEffect } from 'react';
import Menu from './Menu';
import Login from './Login';
import AdminPanel from './AdminPanel';
import Kitchen from './Kitchen';
import orderService from './orderService';

// Componente de Alerta de Novo Pedido
const NewOrderAlert = ({ order, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 5000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl p-8 shadow-2xl max-w-md w-full animate-bounce">
        <div className="bg-green-500 text-white rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-4">
          <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
          </svg>
        </div>
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-4">🔔 NOVO PEDIDO!</h2>
        <div className="bg-gray-50 p-4 rounded-lg mb-4">
          <p className="font-bold text-xl text-center text-orange-600">Pedido #{order.id}</p>
          <p className="text-center text-gray-600 mt-2">{order.items.length} {order.items.length === 1 ? 'item' : 'itens'}</p>
          <p className="text-center text-2xl font-bold text-green-600 mt-2">R$ {order.total.toFixed(2)}</p>
        </div>
        <button
          onClick={onClose}
          className="w-full bg-green-600 text-white py-3 rounded-lg font-bold text-lg hover:bg-green-700 transition"
        >
          Ver Pedido
        </button>
      </div>
    </div>
  );
};

// Componente Principal
const App = () => {
  const [orders, setOrders] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [newOrderAlert, setNewOrderAlert] = useState(null);
  const [isFirebaseConnected, setIsFirebaseConnected] = useState(false);
  const [previousOrdersCount, setPreviousOrdersCount] = useState(0);

  // Inicializar Firebase e escutar mudanças em tempo real
  useEffect(() => {
    let unsubscribe;

    const initializeOrders = async () => {
      try {
        // Carregar pedidos iniciais
        const initialOrders = await orderService.getOrders();
        setOrders(initialOrders);
        setPreviousOrdersCount(initialOrders.length);
        setIsFirebaseConnected(true);

        // Escutar mudanças em tempo real
        orderService.onOrdersChange((updatedOrders) => {
          setOrders(updatedOrders);
          
          // Detectar novos pedidos
          if (updatedOrders.length > previousOrdersCount) {
            const latestOrder = updatedOrders[0];
            
            // Verificar se é realmente um novo pedido (status pending)
            if (latestOrder.status === 'pending' && (currentUser === 'kitchen' || currentUser === 'admin')) {
              setNewOrderAlert(latestOrder);
              playNotificationSound();
            }
          }
          
          setPreviousOrdersCount(updatedOrders.length);
        });

      } catch (error) {
        console.error('Erro ao conectar com Firebase:', error);
        setIsFirebaseConnected(false);
        
        // Fallback para dados locais se Firebase falhar
        const defaultOrders = [
          { id: 1, customer: 'João Silva', items: ['Pizza Margherita', 'Refrigerante'], status: 'pending', time: '10:30', total: 45.00, address: 'Rua das Flores, 123', paymentMethod: 'pix', firebaseKey: 'default1' },
          { id: 2, customer: 'Maria Santos', items: ['Hambúrguer Artesanal', 'Batata Frita'], status: 'preparing', time: '10:35', total: 38.50, address: 'Av. Principal, 456', paymentMethod: 'dinheiro', firebaseKey: 'default2' },
          { id: 3, customer: 'Pedro Costa', items: ['Salada Caesar', 'Suco Natural'], status: 'ready', time: '10:20', total: 32.00, address: 'Rua do Comércio, 789', paymentMethod: 'pix', firebaseKey: 'default3' },
        ];
        setOrders(defaultOrders);
      }
    };

    initializeOrders();

    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, [currentUser, previousOrdersCount]);

  const playNotificationSound = () => {
    try {
      const audioContext = new (window.AudioContext || window.webkitAudioContext)();
      
      const playBell = (frequency, startTime, duration) => {
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        
        oscillator.frequency.value = frequency;
        oscillator.type = 'sine';
        
        gainNode.gain.setValueAtTime(0.4, startTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, startTime + duration);
        
        oscillator.start(startTime);
        oscillator.stop(startTime + duration);
      };
      
      const now = audioContext.currentTime;
      playBell(800, now, 0.3);
      playBell(600, now + 0.35, 0.4);
    } catch (error) {
      console.error('Erro ao reproduzir som:', error);
    }
  };

  const handleLogin = (role) => {
    setCurrentUser(role);
  };

  const handleLogout = () => {
    setCurrentUser(null);
  };

  const handleNewOrder = async (orderData) => {
    try {
      const newOrder = {
        customer: orderData.customerName || 'Cliente Web',
        customerPhone: orderData.customerPhone || '',
        items: orderData.items.map(item => `${item.quantity}x ${item.name}`),
        status: 'pending',
        time: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
        total: orderData.total,
        address: orderData.address,
        paymentMethod: orderData.paymentMethod
      };

      await orderService.addOrder(newOrder);
      playNotificationSound();
      
    } catch (error) {
      console.error('Erro ao criar pedido:', error);
      alert('Erro ao enviar pedido. Tente novamente.');
    }
  };

  const handleStatusChange = async (firebaseKey, orderId, newStatus) => {
    try {
      await orderService.updateOrderStatus(firebaseKey, orderId, newStatus);
    } catch (error) {
      console.error('Erro ao atualizar status:', error);
      alert('Erro ao atualizar pedido. Tente novamente.');
    }
  };

  const handleCancel = async (firebaseKey) => {
    if (window.confirm('Tem certeza que deseja cancelar/excluir este pedido?')) {
      try {
        await orderService.deleteOrder(firebaseKey);
      } catch (error) {
        console.error('Erro ao cancelar pedido:', error);
        alert('Erro ao cancelar pedido. Tente novamente.');
      }
    }
  };

  // Indicador de conexão Firebase (apenas em desenvolvimento)
  const FirebaseStatus = () => (
    <div className={`fixed bottom-4 left-4 px-3 py-1 rounded-full text-xs font-semibold ${
      isFirebaseConnected ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
    }`}>
      {isFirebaseConnected ? '🔥 Firebase Conectado' : '⚠️ Firebase Desconectado'}
    </div>
  );

  // Menu Público
  if (!currentUser) {
    return (
      <>
        <Menu onNewOrder={handleNewOrder} onAccessInternal={() => setCurrentUser('login')} />
        <FirebaseStatus />
      </>
    );
  }

  // Tela de Login
  if (currentUser === 'login') {
    return <Login onLogin={handleLogin} />;
  }

  // Painel Admin
  if (currentUser === 'admin') {
    return (
      <>
        {newOrderAlert && (
          <NewOrderAlert 
            order={newOrderAlert} 
            onClose={() => setNewOrderAlert(null)} 
          />
        )}
        <AdminPanel
          orders={orders}
          onStatusChange={handleStatusChange}
          onCancel={handleCancel}
          onLogout={handleLogout}
        />
        <FirebaseStatus />
      </>
    );
  }

  // Tela da Cozinha
  if (currentUser === 'kitchen') {
    return (
      <>
        {newOrderAlert && (
          <NewOrderAlert 
            order={newOrderAlert} 
            onClose={() => setNewOrderAlert(null)} 
          />
        )}
        <Kitchen
          orders={orders}
          onStatusChange={handleStatusChange}
          onLogout={handleLogout}
        />
        <FirebaseStatus />
      </>
    );
  }

  return null;
};

export default App;
