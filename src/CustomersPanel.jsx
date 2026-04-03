import React, { useState, useEffect } from 'react'
import { Users, Phone, MapPin, Package, DollarSign, Search, Award } from 'lucide-react'
import customerService from './customerService'

const CustomersPanel = () => {
  const [customers, setCustomers] = useState([])
  const [selectedCustomer, setSelectedCustomer] = useState(null)
  const [orderHistory, setOrderHistory] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadCustomers()
  }, [])

  const loadCustomers = async () => {
    setLoading(true)
    try {
      const data = await customerService.getAllCustomers()
      setCustomers(data)
    } catch (error) {
      console.error('Erro ao carregar clientes:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSelectCustomer = async (customer) => {
    setSelectedCustomer(customer)
    const history = await customerService.getCustomerOrderHistory(customer.phone)
    setOrderHistory(history)
  }

  const filteredCustomers = customers.filter(customer =>
    customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.phone.includes(searchTerm)
  )

  const totalCustomers = customers.length
  const totalRevenue = customers.reduce((sum, c) => sum + (c.totalSpent || 0), 0)
  const totalOrders = customers.reduce((sum, c) => sum + (c.totalOrders || 0), 0)

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 p-6">
      <div className="container mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-6 flex items-center gap-3">
          <Users size={36} className="text-purple-600" />
          Gestão de Clientes
        </h1>

        {/* Estatísticas */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-white rounded-lg shadow p-6 border-l-4 border-purple-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Total de Clientes</p>
                <p className="text-3xl font-bold mt-1">{totalCustomers}</p>
              </div>
              <Users size={40} className="text-purple-500 opacity-20" />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6 border-l-4 border-green-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Receita Total</p>
                <p className="text-3xl font-bold mt-1">R$ {totalRevenue.toFixed(2)}</p>
              </div>
              <DollarSign size={40} className="text-green-500 opacity-20" />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6 border-l-4 border-blue-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Total de Pedidos</p>
                <p className="text-3xl font-bold mt-1">{totalOrders}</p>
              </div>
              <Package size={40} className="text-blue-500 opacity-20" />
            </div>
          </div>
        </div>

        {/* Conteúdo Principal */}
        <div className="grid md:grid-cols-2 gap-6">
          {/* Lista de Clientes */}
          <div className="bg-white rounded-lg shadow">
            <div className="p-4 border-b">
              <div className="relative">
                <Search size={20} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border-2 border-gray-300 rounded-lg focus:border-purple-500 outline-none"
                  placeholder="Buscar por nome ou telefone..."
                />
              </div>
            </div>

            <div className="overflow-y-auto max-h-[600px]">
              {loading ? (
                <div className="text-center py-12 text-gray-500">
                  Carregando clientes...
                </div>
              ) : filteredCustomers.length === 0 ? (
                <div className="text-center py-12 text-gray-500">
                  <Users size={64} className="mx-auto mb-4 opacity-50" />
                  <p>Nenhum cliente encontrado</p>
                </div>
              ) : (
                filteredCustomers.map((customer) => (
                  <div
                    key={customer.phoneKey}
                    onClick={() => handleSelectCustomer(customer)}
                    className={`p-4 border-b hover:bg-purple-50 cursor-pointer transition ${
                      selectedCustomer?.phoneKey === customer.phoneKey ? 'bg-purple-100' : ''
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <h3 className="font-bold text-lg">{customer.name}</h3>
                          {customer.totalOrders >= 10 && (
                            <Award size={18} className="text-yellow-500" title="Cliente VIP" />
                          )}
                        </div>
                        <p className="text-sm text-gray-600 flex items-center gap-1 mt-1">
                          <Phone size={14} /> {customer.phone}
                        </p>
                        <p className="text-xs text-gray-500 flex items-center gap-1 mt-1">
                          <MapPin size={12} /> {customer.address}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-semibold text-purple-600">
                          {customer.totalOrders || 0} pedidos
                        </p>
                        <p className="text-xs text-gray-600">
                          R$ {(customer.totalSpent || 0).toFixed(2)}
                        </p>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Detalhes do Cliente */}
          <div className="bg-white rounded-lg shadow">
            {selectedCustomer ? (
              <>
                <div className="p-6 border-b bg-gradient-to-r from-purple-500 to-pink-500 text-white">
                  <div className="flex items-start justify-between">
                    <div>
                      <h2 className="text-2xl font-bold mb-2">{selectedCustomer.name}</h2>
                      <p className="text-purple-100 flex items-center gap-2">
                        <Phone size={16} /> {selectedCustomer.phone}
                      </p>
                      <p className="text-purple-100 flex items-center gap-2 mt-1">
                        <MapPin size={16} /> {selectedCustomer.address}
                      </p>
                    </div>
                    {selectedCustomer.totalOrders >= 10 && (
                      <Award size={48} className="text-yellow-300" />
                    )}
                  </div>

                  <div className="grid grid-cols-3 gap-4 mt-6">
                    <div className="bg-white bg-opacity-20 rounded-lg p-3">
                      <p className="text-xs text-purple-100">Pedidos</p>
                      <p className="text-2xl font-bold">{selectedCustomer.totalOrders || 0}</p>
                    </div>
                    <div className="bg-white bg-opacity-20 rounded-lg p-3">
                      <p className="text-xs text-purple-100">Total Gasto</p>
                      <p className="text-2xl font-bold">R$ {(selectedCustomer.totalSpent || 0).toFixed(0)}</p>
                    </div>
                    <div className="bg-white bg-opacity-20 rounded-lg p-3">
                      <p className="text-xs text-purple-100">Ticket Médio</p>
                      <p className="text-2xl font-bold">
                        R$ {selectedCustomer.totalOrders > 0 
                          ? ((selectedCustomer.totalSpent || 0) / selectedCustomer.totalOrders).toFixed(0)
                          : '0'}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Histórico de Pedidos */}
                <div className="p-4">
                  <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                    <Package size={20} />
                    Histórico de Pedidos
                  </h3>

                  <div className="space-y-3 max-h-[400px] overflow-y-auto">
                    {orderHistory.length === 0 ? (
                      <div className="text-center py-8 text-gray-500">
                        <Package size={48} className="mx-auto mb-2 opacity-50" />
                        <p>Nenhum pedido ainda</p>
                      </div>
                    ) : (
                      orderHistory.map((order) => (
                        <div
                          key={order.firebaseKey}
                          className="border-2 rounded-lg p-3 hover:border-purple-300 transition"
                        >
                          <div className="flex justify-between items-start mb-2">
                            <div>
                              <p className="font-semibold">Pedido #{order.id}</p>
                              <p className="text-xs text-gray-500">
                                {new Date(order.createdAt).toLocaleDateString('pt-BR')} às {order.time}
                              </p>
                            </div>
                            <span className={`px-2 py-1 rounded text-xs font-semibold ${
                              order.status === 'completed' ? 'bg-green-100 text-green-700' :
                              order.status === 'ready' ? 'bg-blue-100 text-blue-700' :
                              order.status === 'preparing' ? 'bg-yellow-100 text-yellow-700' :
                              'bg-gray-100 text-gray-700'
                            }`}>
                              {order.status === 'completed' ? 'Concluído' :
                               order.status === 'ready' ? 'Pronto' :
                               order.status === 'preparing' ? 'Preparando' : 'Pendente'}
                            </span>
                          </div>
                          <div className="text-sm space-y-1">
                            {order.items.map((item, idx) => (
                              <p key={idx} className="text-gray-600">• {item}</p>
                            ))}
                          </div>
                          <div className="mt-2 pt-2 border-t flex justify-between items-center">
                            <span className="text-xs text-gray-500">
                              {order.paymentMethod === 'pix' ? '💳 PIX' : '💵 Dinheiro'}
                            </span>
                            <span className="font-bold text-purple-600">
                              R$ {order.total.toFixed(2)}
                            </span>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </>
            ) : (
              <div className="text-center py-20 text-gray-500">
                <Users size={64} className="mx-auto mb-4 opacity-50" />
                <p>Selecione um cliente para ver os detalhes</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default CustomersPanel
