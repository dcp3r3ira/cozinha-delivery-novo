import React, { useState } from 'react';
import {
  ChefHat,
  Package,
  Clock,
  CheckCircle,
  BarChart3,
  Settings,
  LogOut,
  Trash2
} from 'lucide-react';
import CustomersPanel from './CustomersPanel';
import SettingsPanel from './SettingsPanel';

// Card de Pedido
const OrderCard = ({ order, onStatusChange, onCancel }) => {
  const statusColors = {
    pending: 'bg-yellow-100 border-yellow-300 text-yellow-800',
    preparing: 'bg-blue-100 border-blue-300 text-blue-800',
    ready: 'bg-green-100 border-green-300 text-green-800',
    completed: 'bg-gray-100 border-gray-300 text-gray-800'
  };

  const statusLabels = {
    pending: 'Pendente',
    preparing: 'Preparando',
    ready: 'Pronto',
    completed: 'Concluído'
  };

  return (
    <div className={`border-2 rounded-lg p-4 ${statusColors[order.status]}`}>
      <div className="flex justify-between items-start mb-3">
        <div>
          <h3 className="font-bold text-lg">#{order.id} - {order.customer}</h3>
          <p className="text-sm opacity-75 flex items-center gap-1">
            <Clock size={14} /> {order.time}
          </p>
          {order.address && <p className="text-sm opacity-75">📍 {order.address}</p>}
        </div>
        <span className="px-3 py-1 rounded-full text-xs font-semibold bg-white bg-opacity-50">
          {statusLabels[order.status]}
        </span>
      </div>

      <ul className="text-sm mb-3">
        {order.items.map((item, idx) => (
          <li key={idx}>• {item}</li>
        ))}
      </ul>

      <div className="flex justify-between items-center border-t pt-3">
        <span className="font-bold">R$ {order.total.toFixed(2)}</span>

        <div className="flex gap-2">
          {order.status === 'pending' && (
            <>
              <button
                onClick={() => onStatusChange(order.id, 'preparing')}
                className="bg-blue-600 text-white px-3 py-1 rounded"
              >
                Iniciar
              </button>
              <button
                onClick={onCancel}
                className="bg-red-600 text-white px-3 py-1 rounded"
              >
                Cancelar
              </button>
            </>
          )}

          {order.status === 'preparing' && (
            <button
              onClick={() => onStatusChange(order.id, 'ready')}
              className="bg-green-600 text-white px-3 py-1 rounded"
            >
              Finalizar
            </button>
          )}

          {order.status === 'ready' && (
            <button
              onClick={() => onStatusChange(order.id, 'completed')}
              className="bg-gray-600 text-white px-3 py-1 rounded"
            >
              Entregar
            </button>
          )}

          {order.status === 'completed' && (
            <button
              onClick={onCancel}
              className="bg-red-600 text-white px-3 py-1 rounded flex items-center gap-1"
            >
              <Trash2 size={14} />
              Excluir
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

// Dashboard
const StatsDashboard = ({ stats }) => (
  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
    {[
      { label: 'Pendentes', value: stats.pending, icon: Clock },
      { label: 'Preparando', value: stats.preparing, icon: ChefHat },
      { label: 'Prontos', value: stats.ready, icon: CheckCircle },
      { label: 'Concluídos', value: stats.completed, icon: Package }
    ].map((s, i) => (
      <div key={i} className="bg-white rounded shadow p-4">
        <div className="flex justify-between items-center">
          <div>
            <p className="text-sm text-gray-600">{s.label}</p>
            <p className="text-2xl font-bold">{s.value}</p>
          </div>
          <s.icon size={28} />
        </div>
      </div>
    ))}
  </div>
);

const AdminPanel = ({ orders, onStatusChange, onCancel, onLogout }) => {
  const [view, setView] = useState('orders');
  const [showSettings, setShowSettings] = useState(false);

  const stats = {
    pending: orders.filter(o => o.status === 'pending').length,
    preparing: orders.filter(o => o.status === 'preparing').length,
    ready: orders.filter(o => o.status === 'ready').length,
    completed: orders.filter(o => o.status === 'completed').length
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {showSettings && <SettingsPanel onClose={() => setShowSettings(false)} />}

      <header className="bg-white shadow p-4 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <ChefHat className="text-orange-600" />
          <h1 className="text-xl font-bold">Painel Administrativo</h1>
        </div>

        <div className="flex gap-2">
          <button onClick={() => setView('orders')}><Package /></button>
          <button onClick={() => setView('stats')}><BarChart3 /></button>
          <button onClick={() => setView('customers')}><Settings /></button>
          <button onClick={() => setShowSettings(true)}><Settings /></button>
          <button onClick={onLogout} className="text-red-600"><LogOut /></button>
        </div>
      </header>

      <main className="p-6">
        {view !== 'customers' && <StatsDashboard stats={stats} />}

        {view === 'orders' && (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {orders.map(order => (
              <OrderCard
                key={order.firebaseKey}
                order={order}
                onStatusChange={(id, status) =>
                  onStatusChange(order.firebaseKey, id, status)
                }
                onCancel={() => onCancel(order.firebaseKey)}
              />
            ))}
          </div>
        )}

        {view === 'customers' && <CustomersPanel />}
      </main>
    </div>
  );
};

export default AdminPanel;
