import React, { useState } from 'react'
import { ChefHat, Package, Clock, LogOut } from 'lucide-react'

// Componente de Pedido para a Cozinha
const OrderCard = ({ order, onStatusChange }) => {
  const statusColors = {
    pending: 'bg-yellow-100 border-yellow-300 text-yellow-800',
    preparing: 'bg-blue-100 border-blue-300 text-blue-800',
    ready: 'bg-green-100 border-green-300 text-green-800',
  }

  const statusLabels = {
    pending: 'Pendente',
    preparing: 'Preparando',
    ready: 'Pronto',
  }

  return (
    <div className={`border-2 rounded-lg p-4 ${statusColors[order.status]} transition-all`}>
      <div className="flex justify-between items-start mb-3">
        <div>
          <h3 className="font-bold text-xl">Pedido #{order.id}</h3>
          <p className="text-sm opacity-75 flex items-center gap-1 mt-1">
            <Clock size={14} /> {order.time}
          </p>
        </div>
        <span className="px-3 py-1 rounded-full text-xs font-semibold bg-white bg-opacity-50">
          {statusLabels[order.status]}
        </span>
      </div>
      
      <div className="mb-4">
        <p className="font-semibold mb-2">Itens do Pedido:</p>
        <ul className="space-y-1">
          {order.items.map((item, idx) => (
            <li key={idx} className="text-lg">✓ {item}</li>
          ))}
        </ul>
      </div>

      {order.address && (
        <div className="mb-3 text-sm opacity-75">
          <p>📍 {order.address}</p>
        </div>
      )}
      
      <div className="flex justify-between items-center pt-3 border-t border-current border-opacity-20">
        <span className="font-bold text-lg">R$ {order.total.toFixed(2)}</span>
        <div className="flex gap-2">
          {order.status === 'pending' && (
            <button
              onClick={() => onStatusChange(order.id, 'preparing')}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-bold"
            >
              Iniciar Preparo
            </button>
          )}
          {order.status === 'preparing' && (
            <button
              onClick={() => onStatusChange(order.id, 'ready')}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition font-bold"
            >
              Marcar como Pronto
            </button>
          )}
          {order.status === 'ready' && (
            <div className="px-4 py-2 bg-green-600 text-white rounded-lg font-bold">
              Aguardando Retirada
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

// Tela da Cozinha
const Kitchen = ({ orders, onStatusChange, onLogout }) => {
  const [filter, setFilter] = useState('active') // 'active' ou 'ready'

  const activeOrders = orders.filter(o => o.status === 'pending' || o.status === 'preparing')
  const readyOrders = orders.filter(o => o.status === 'ready')
  
  const displayOrders = filter === 'active' ? activeOrders : readyOrders

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
      {/* Header */}
      <header className="bg-white shadow-md sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <ChefHat size={40} className="text-blue-600" />
              <div>
                <h1 className="text-2xl font-bold text-gray-800">Tela da Cozinha</h1>
                <p className="text-sm text-gray-600">Gerenciamento de Pedidos</p>
              </div>
            </div>
            <button
              onClick={onLogout}
              className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
            >
              <LogOut size={20} />
              Sair
            </button>
          </div>
        </div>
      </header>

      {/* Filtros */}
      <div className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-3">
          <div className="flex gap-3">
            <button
              onClick={() => setFilter('active')}
              className={`px-6 py-2 rounded-lg font-semibold transition ${
                filter === 'active'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              Em Preparo ({activeOrders.length})
            </button>
            <button
              onClick={() => setFilter('ready')}
              className={`px-6 py-2 rounded-lg font-semibold transition ${
                filter === 'ready'
                  ? 'bg-green-600 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              Prontos ({readyOrders.length})
            </button>
          </div>
        </div>
      </div>

      {/* Pedidos */}
      <main className="container mx-auto px-4 py-6">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {displayOrders.length > 0 ? (
            displayOrders.map(order => (
              <OrderCard
                key={order.firebaseKey || order.id}
                order={order}
                onStatusChange={(orderId, status) => onStatusChange(order.firebaseKey, orderId, status)}
              />
            ))
          ) : (
            <div className="col-span-full text-center py-20 text-gray-500">
              <Package size={80} className="mx-auto mb-4 opacity-50" />
              <p className="text-2xl font-semibold">
                {filter === 'active' ? 'Nenhum pedido em preparo' : 'Nenhum pedido pronto'}
              </p>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}

export default Kitchen
