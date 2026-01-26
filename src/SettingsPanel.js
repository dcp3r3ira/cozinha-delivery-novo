import React, { useState, useEffect } from 'react';
import { Settings, DollarSign, Clock, Bell, Palette, UtensilsCrossed, Plus, Edit2, Trash2, Check, X, Volume2, VolumeX, Power } from 'lucide-react';
import settingsService from './settingsService';

const SettingsPanel = ({ onClose }) => {
  const [activeTab, setActiveTab] = useState('general');
  const [settings, setSettings] = useState(null);
  const [menuItems, setMenuItems] = useState([]);
  const [editingItem, setEditingItem] = useState(null);
  const [saving, setSaving] = useState(false);
  
  // Gerenciamento de senhas
  const [showPasswordSection, setShowPasswordSection] = useState(false);
  const [passwords, setPasswords] = useState({
    adminUsername: 'admin',
    adminPassword: '',
    adminPasswordConfirm: '',
    kitchenUsername: 'cozinha',
    kitchenPassword: '',
    kitchenPasswordConfirm: ''
  });

  useEffect(() => {
    const initialize = async () => {
      await loadSettings();
      await loadMenu();
      await loadPasswords();
    };
    initialize();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loadSettings = async () => {
    const data = await settingsService.getSettings();
    setSettings(data);
  };

  const loadMenu = async () => {
    const data = await settingsService.getMenu();
    setMenuItems(data);
  };

  const handleInitializeDefaultMenu = async () => {
    if (!window.confirm('Isso irá adicionar os itens padrão ao menu. Continuar?')) {
      return;
    }

    setSaving(true);
    
    const defaultMenu = [
      {
        id: 1,
        name: 'Pizza Margherita',
        description: 'Molho de tomate, mussarela, manjericão e azeite',
        price: 35.00,
        category: 'Pizzas',
        image: 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=400&h=300&fit=crop',
        available: true
      },
      {
        id: 2,
        name: 'Pizza Calabresa',
        description: 'Molho de tomate, mussarela, calabresa e cebola',
        price: 38.00,
        category: 'Pizzas',
        image: 'https://images.unsplash.com/photo-1628840042765-356cda07504e?w=400&h=300&fit=crop',
        available: true
      },
      {
        id: 3,
        name: 'Hambúrguer Artesanal',
        description: 'Pão brioche, blend 180g, queijo, alface, tomate e molho especial',
        price: 32.00,
        category: 'Hambúrgueres',
        image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&h=300&fit=crop',
        available: true
      },
      {
        id: 4,
        name: 'Hambúrguer Bacon',
        description: 'Pão brioche, blend 180g, bacon crocante, cheddar e cebola caramelizada',
        price: 36.00,
        category: 'Hambúrgueres',
        image: 'https://images.unsplash.com/photo-1550547660-d9450f859349?w=400&h=300&fit=crop',
        available: true
      },
      {
        id: 5,
        name: 'Salada Caesar',
        description: 'Alface romana, frango grelhado, croutons, parmesão e molho caesar',
        price: 28.00,
        category: 'Saladas',
        image: 'https://images.unsplash.com/photo-1546793665-c74683f339c1?w=400&h=300&fit=crop',
        available: true
      },
      {
        id: 6,
        name: 'Batata Frita',
        description: 'Porção individual de batatas fritas crocantes',
        price: 15.00,
        category: 'Acompanhamentos',
        image: 'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=400&h=300&fit=crop',
        available: true
      },
      {
        id: 7,
        name: 'Refrigerante Lata',
        description: 'Coca-Cola, Guaraná, Sprite ou Fanta - 350ml',
        price: 6.00,
        category: 'Bebidas',
        image: 'https://images.unsplash.com/photo-1629203851122-3726ecdf080e?w=400&h=300&fit=crop',
        available: true
      },
      {
        id: 8,
        name: 'Suco Natural',
        description: 'Laranja, limão ou morango - 500ml',
        price: 12.00,
        category: 'Bebidas',
        image: 'https://images.unsplash.com/photo-1600271886742-f049cd451bba?w=400&h=300&fit=crop',
        available: true
      }
    ];

    try {
      for (const item of defaultMenu) {
        await settingsService.saveMenuItem(item);
      }
      
      await loadMenu();
      alert('✅ Menu padrão inicializado com sucesso!\n\n8 itens foram adicionados ao cardápio.');
    } catch (error) {
      console.error('Erro ao inicializar menu:', error);
      alert('❌ Erro ao inicializar menu. Verifique o console.');
    } finally {
      setSaving(false);
    }
  };

  const loadPasswords = async () => {
    const data = await settingsService.getPasswords();
    if (data) {
      setPasswords({
        ...passwords,
        adminUsername: data.adminUsername || 'admin',
        kitchenUsername: data.kitchenUsername || 'cozinha'
      });
    }
  };

  const handleSaveSettings = async () => {
    setSaving(true);
    const success = await settingsService.saveSettings(settings);
    setSaving(false);
    if (success) {
      alert('✅ Configurações salvas com sucesso!');
    } else {
      alert('❌ Erro ao salvar configurações.');
    }
  };

  const handleSavePasswords = async () => {
    // Validações
    if (passwords.adminPassword && passwords.adminPassword !== passwords.adminPasswordConfirm) {
      alert('❌ As senhas do Admin não coincidem!');
      return;
    }
    
    if (passwords.kitchenPassword && passwords.kitchenPassword !== passwords.kitchenPasswordConfirm) {
      alert('❌ As senhas da Cozinha não coincidem!');
      return;
    }

    if (!passwords.adminUsername.trim() || !passwords.kitchenUsername.trim()) {
      alert('❌ Os nomes de usuário não podem estar vazios!');
      return;
    }

    setSaving(true);
    const passwordData = {
      adminUsername: passwords.adminUsername,
      adminPassword: passwords.adminPassword || undefined,
      kitchenUsername: passwords.kitchenUsername,
      kitchenPassword: passwords.kitchenPassword || undefined
    };

    const success = await settingsService.savePasswords(passwordData);
    setSaving(false);

    if (success) {
      alert('✅ Credenciais atualizadas com sucesso!\n\n⚠️ Importante: Anote as novas credenciais!');
      setPasswords({
        ...passwords,
        adminPassword: '',
        adminPasswordConfirm: '',
        kitchenPassword: '',
        kitchenPasswordConfirm: ''
      });
      setShowPasswordSection(false);
    } else {
      alert('❌ Erro ao salvar credenciais.');
    }
  };

  const handleSaveMenuItem = async (item) => {
    if (!item.name.trim() || !item.description.trim()) {
      alert('❌ Nome e descrição são obrigatórios!');
      return;
    }

    if (item.price <= 0) {
      alert('❌ O preço deve ser maior que zero!');
      return;
    }

    const success = await settingsService.saveMenuItem(item);
    if (success) {
      loadMenu();
      setEditingItem(null);
      alert('✅ Item salvo com sucesso!');
    } else {
      alert('❌ Erro ao salvar item.');
    }
  };

  const handleDeleteMenuItem = async (firebaseKey) => {
    if (window.confirm('Tem certeza que deseja excluir este item?')) {
      const success = await settingsService.deleteMenuItem(firebaseKey);
      if (success) {
        loadMenu();
        alert('✅ Item excluído com sucesso!');
      } else {
        alert('❌ Erro ao excluir item.');
      }
    }
  };

  const handleToggleAvailability = async (item) => {
    await handleSaveMenuItem({
      ...item,
      available: !item.available
    });
  };

  if (!settings) return <div>Carregando...</div>;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Settings size={32} />
              <div>
                <h2 className="text-2xl font-bold">Configurações</h2>
                <p className="text-blue-100 text-sm">Gerencie seu sistema</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="hover:bg-white hover:bg-opacity-20 p-2 rounded-lg transition"
            >
              <X size={24} />
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="border-b bg-gray-50 px-6 overflow-x-auto">
          <div className="flex gap-2 min-w-max">
            {            [
              { id: 'general', label: 'Geral', icon: Settings },
              { id: 'menu', label: 'Cardápio', icon: UtensilsCrossed },
              { id: 'system', label: 'Sistema', icon: Bell },
              { id: 'security', label: 'Segurança', icon: () => (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              )},
              { id: 'appearance', label: 'Aparência', icon: Palette }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-3 border-b-2 transition whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'border-blue-600 text-blue-600 font-semibold'
                    : 'border-transparent text-gray-600 hover:text-gray-800'
                }`}
              >
                {typeof tab.icon === 'function' ? <tab.icon /> : <tab.icon size={18} />}
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {/* ABA GERAL */}
          {activeTab === 'general' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                  <DollarSign size={20} />
                  Configurações de Entrega
                </h3>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Taxa de Entrega (R$)
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      value={settings.deliveryFee}
                      onChange={(e) => setSettings({...settings, deliveryFee: parseFloat(e.target.value)})}
                      className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-blue-500 outline-none"
                    />
                  </div>

                  <div>
                    <label className="flex items-center gap-3 p-4 border-2 rounded-lg cursor-pointer hover:bg-gray-50">
                      <input
                        type="checkbox"
                        checked={settings.isOpen}
                        onChange={(e) => setSettings({...settings, isOpen: e.target.checked})}
                        className="w-5 h-5"
                      />
                      <Power size={20} className={settings.isOpen ? 'text-green-600' : 'text-red-600'} />
                      <div className="flex-1">
                        <p className="font-semibold">Aceitando Pedidos</p>
                        <p className="text-sm text-gray-600">
                          {settings.isOpen ? 'Restaurante aberto' : 'Restaurante fechado'}
                        </p>
                      </div>
                    </label>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                  <Clock size={20} />
                  Horário de Funcionamento
                </h3>
                
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Abertura
                    </label>
                    <input
                      type="time"
                      value={settings.openingHours}
                      onChange={(e) => setSettings({...settings, openingHours: e.target.value})}
                      className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-blue-500 outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Fechamento
                    </label>
                    <input
                      type="time"
                      value={settings.closingHours}
                      onChange={(e) => setSettings({...settings, closingHours: e.target.value})}
                      className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-blue-500 outline-none"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Mensagem de Status
                </label>
                <input
                  type="text"
                  value={settings.statusMessage}
                  onChange={(e) => setSettings({...settings, statusMessage: e.target.value})}
                  className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-blue-500 outline-none"
                  placeholder="Ex: Aberto para pedidos!"
                />
              </div>
            </div>
          )}

          {/* ABA CARDÁPIO */}
          {activeTab === 'menu' && (
            <div>
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-bold">Gerenciar Cardápio</h3>
                <div className="flex gap-2">
                  {menuItems.length === 0 && (
                    <button
                      onClick={handleInitializeDefaultMenu}
                      disabled={saving}
                      className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 flex items-center gap-2 disabled:opacity-50"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                      </svg>
                      {saving ? 'Inicializando...' : 'Carregar Menu Padrão'}
                    </button>
                  )}
                  <button
                    onClick={() => setEditingItem({
                      id: Date.now(),
                      name: '',
                      description: '',
                      price: 0,
                      category: 'Pizzas',
                      image: '',
                      available: true
                    })}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2"
                  >
                    <Plus size={18} />
                    Novo Item
                  </button>
                </div>
              </div>

              {editingItem && (
                <div className="bg-blue-50 border-2 border-blue-300 rounded-lg p-4 mb-6">
                  <h4 className="font-bold mb-4">
                    {editingItem.firebaseKey ? 'Editar Item' : 'Novo Item'}
                  </h4>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold mb-2">Nome</label>
                      <input
                        type="text"
                        value={editingItem.name}
                        onChange={(e) => setEditingItem({...editingItem, name: e.target.value})}
                        className="w-full px-3 py-2 border-2 rounded-lg outline-none focus:border-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold mb-2">Preço (R$)</label>
                      <input
                        type="number"
                        step="0.01"
                        value={editingItem.price}
                        onChange={(e) => setEditingItem({...editingItem, price: parseFloat(e.target.value)})}
                        className="w-full px-3 py-2 border-2 rounded-lg outline-none focus:border-blue-500"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-semibold mb-2">Descrição</label>
                      <textarea
                        value={editingItem.description}
                        onChange={(e) => setEditingItem({...editingItem, description: e.target.value})}
                        className="w-full px-3 py-2 border-2 rounded-lg outline-none focus:border-blue-500"
                        rows="2"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold mb-2">Categoria</label>
                      <select
                        value={editingItem.category}
                        onChange={(e) => setEditingItem({...editingItem, category: e.target.value})}
                        className="w-full px-3 py-2 border-2 rounded-lg outline-none focus:border-blue-500"
                      >
                        <option>Pizzas</option>
                        <option>Hambúrgueres</option>
                        <option>Saladas</option>
                        <option>Acompanhamentos</option>
                        <option>Bebidas</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-semibold mb-2">URL da Imagem</label>
                      <input
                        type="text"
                        value={editingItem.image}
                        onChange={(e) => setEditingItem({...editingItem, image: e.target.value})}
                        className="w-full px-3 py-2 border-2 rounded-lg outline-none focus:border-blue-500"
                      />
                    </div>
                  </div>
                  <div className="flex gap-2 mt-4">
                    <button
                      onClick={() => setEditingItem(null)}
                      className="flex-1 bg-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-400"
                    >
                      Cancelar
                    </button>
                    <button
                      onClick={() => handleSaveMenuItem(editingItem)}
                      className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                    >
                      Salvar
                    </button>
                  </div>
                </div>
              )}

              <div className="space-y-3">
                {menuItems.length === 0 ? (
                  <p className="text-center text-gray-500 py-8">
                    Nenhum item no cardápio. Adicione o primeiro!
                  </p>
                ) : (
                  menuItems.map(item => (
                    <div
                      key={item.firebaseKey}
                      className={`border-2 rounded-lg p-4 ${
                        item.available === false ? 'bg-gray-100 opacity-60' : 'bg-white'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <h4 className="font-bold">{item.name}</h4>
                          <p className="text-sm text-gray-600">{item.description}</p>
                          <div className="flex items-center gap-4 mt-2">
                            <span className="text-blue-600 font-bold">R$ {item.price?.toFixed(2)}</span>
                            <span className="text-xs bg-gray-200 px-2 py-1 rounded">{item.category}</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleToggleAvailability(item)}
                            className={`px-3 py-2 rounded-lg text-sm font-semibold ${
                              item.available === false
                                ? 'bg-green-100 text-green-700 hover:bg-green-200'
                                : 'bg-yellow-100 text-yellow-700 hover:bg-yellow-200'
                            }`}
                          >
                            {item.available === false ? 'Ativar' : 'Desativar'}
                          </button>
                          <button
                            onClick={() => setEditingItem(item)}
                            className="p-2 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200"
                          >
                            <Edit2 size={18} />
                          </button>
                          <button
                            onClick={() => handleDeleteMenuItem(item.firebaseKey)}
                            className="p-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {/* ABA SISTEMA */}
          {activeTab === 'system' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                  <Bell size={20} />
                  Notificações
                </h3>
                
                <div className="space-y-4">
                  <label className="flex items-center gap-3 p-4 border-2 rounded-lg cursor-pointer hover:bg-gray-50">
                    <input
                      type="checkbox"
                      checked={settings.soundEnabled}
                      onChange={(e) => setSettings({...settings, soundEnabled: e.target.checked})}
                      className="w-5 h-5"
                    />
                    {settings.soundEnabled ? <Volume2 size={20} /> : <VolumeX size={20} />}
                    <div className="flex-1">
                      <p className="font-semibold">Som de Notificação</p>
                      <p className="text-sm text-gray-600">Tocar som quando chegar novo pedido</p>
                    </div>
                  </label>

                  {settings.soundEnabled && (
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Volume: {settings.soundVolume}%
                      </label>
                      <input
                        type="range"
                        min="0"
                        max="100"
                        value={settings.soundVolume}
                        onChange={(e) => setSettings({...settings, soundVolume: parseInt(e.target.value)})}
                        className="w-full"
                      />
                    </div>
                  )}
                </div>
              </div>

              <div>
                <h3 className="text-lg font-bold mb-4">Atualização Automática</h3>
                
                <label className="flex items-center gap-3 p-4 border-2 rounded-lg cursor-pointer hover:bg-gray-50">
                  <input
                    type="checkbox"
                    checked={settings.autoRefresh}
                    onChange={(e) => setSettings({...settings, autoRefresh: e.target.checked})}
                    className="w-5 h-5"
                  />
                  <div className="flex-1">
                    <p className="font-semibold">Auto-atualização</p>
                    <p className="text-sm text-gray-600">Atualizar pedidos automaticamente</p>
                  </div>
                </label>

                {settings.autoRefresh && (
                  <div className="mt-4">
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Intervalo de atualização (segundos)
                    </label>
                    <select
                      value={settings.refreshInterval}
                      onChange={(e) => setSettings({...settings, refreshInterval: parseInt(e.target.value)})}
                      className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-blue-500 outline-none"
                    >
                      <option value="3000">3 segundos</option>
                      <option value="5000">5 segundos</option>
                      <option value="10000">10 segundos</option>
                      <option value="30000">30 segundos</option>
                    </select>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ABA SEGURANÇA */}
          {activeTab === 'security' && (
            <div className="space-y-6">
              <div className="bg-yellow-50 border-2 border-yellow-300 rounded-lg p-4 mb-4">
                <p className="text-sm text-yellow-800">
                  ⚠️ <strong>Importante:</strong> Anote suas novas credenciais em local seguro. Não há como recuperá-las!
                </p>
              </div>

              {!showPasswordSection ? (
                <button
                  onClick={() => setShowPasswordSection(true)}
                  className="w-full bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 font-semibold"
                >
                  🔐 Alterar Credenciais de Acesso
                </button>
              ) : (
                <div className="space-y-6">
                  {/* Admin */}
                  <div className="border-2 border-blue-200 rounded-lg p-4 bg-blue-50">
                    <h3 className="text-lg font-bold mb-4 text-blue-800">👨‍💼 Administrador</h3>
                    
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Nome de Usuário
                        </label>
                        <input
                          type="text"
                          value={passwords.adminUsername}
                          onChange={(e) => setPasswords({...passwords, adminUsername: e.target.value})}
                          className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-blue-500 outline-none"
                          placeholder="admin"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Nova Senha
                        </label>
                        <input
                          type="password"
                          value={passwords.adminPassword}
                          onChange={(e) => setPasswords({...passwords, adminPassword: e.target.value})}
                          className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-blue-500 outline-none"
                          placeholder="Deixe em branco para manter a atual"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Confirmar Nova Senha
                        </label>
                        <input
                          type="password"
                          value={passwords.adminPasswordConfirm}
                          onChange={(e) => setPasswords({...passwords, adminPasswordConfirm: e.target.value})}
                          className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-blue-500 outline-none"
                          placeholder="Repita a nova senha"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Kitchen */}
                  <div className="border-2 border-green-200 rounded-lg p-4 bg-green-50">
                    <h3 className="text-lg font-bold mb-4 text-green-800">👨‍🍳 Cozinha</h3>
                    
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Nome de Usuário
                        </label>
                        <input
                          type="text"
                          value={passwords.kitchenUsername}
                          onChange={(e) => setPasswords({...passwords, kitchenUsername: e.target.value})}
                          className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-green-500 outline-none"
                          placeholder="cozinha"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Nova Senha
                        </label>
                        <input
                          type="password"
                          value={passwords.kitchenPassword}
                          onChange={(e) => setPasswords({...passwords, kitchenPassword: e.target.value})}
                          className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-green-500 outline-none"
                          placeholder="Deixe em branco para manter a atual"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Confirmar Nova Senha
                        </label>
                        <input
                          type="password"
                          value={passwords.kitchenPasswordConfirm}
                          onChange={(e) => setPasswords({...passwords, kitchenPasswordConfirm: e.target.value})}
                          className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-green-500 outline-none"
                          placeholder="Repita a nova senha"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Botões */}
                  <div className="flex gap-3">
                    <button
                      onClick={() => {
                        setShowPasswordSection(false);
                        setPasswords({
                          ...passwords,
                          adminPassword: '',
                          adminPasswordConfirm: '',
                          kitchenPassword: '',
                          kitchenPasswordConfirm: ''
                        });
                      }}
                      className="flex-1 bg-gray-300 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-400 font-semibold"
                    >
                      Cancelar
                    </button>
                    <button
                      onClick={handleSavePasswords}
                      disabled={saving}
                      className="flex-1 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 font-semibold disabled:opacity-50"
                    >
                      {saving ? 'Salvando...' : 'Salvar Credenciais'}
                    </button>
                  </div>
                </div>
              )}

              <div className="mt-8 border-t pt-6">
                <h3 className="text-lg font-bold mb-4">Credenciais Atuais</h3>
                <div className="bg-gray-100 rounded-lg p-4 space-y-2">
                  <div className="flex justify-between">
                    <span className="font-semibold">Admin:</span>
                    <span className="font-mono">{passwords.adminUsername}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-semibold">Cozinha:</span>
                    <span className="font-mono">{passwords.kitchenUsername}</span>
                  </div>
                  <p className="text-xs text-gray-600 mt-2">
                    * As senhas não são exibidas por segurança
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* ABA APARÊNCIA */}
          {activeTab === 'appearance' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                  <Palette size={20} />
                  Tema
                </h3>
                
                <div className="grid grid-cols-2 gap-4">
                  <label className="border-2 rounded-lg p-4 cursor-pointer hover:border-blue-500 transition">
                    <input
                      type="radio"
                      name="theme"
                      value="light"
                      checked={settings.theme === 'light'}
                      onChange={(e) => setSettings({...settings, theme: e.target.value})}
                      className="mb-3"
                    />
                    <div className="bg-white border-2 rounded-lg p-4 mb-2">
                      <div className="h-2 bg-gray-200 rounded mb-2"></div>
                      <div className="h-2 bg-gray-200 rounded w-2/3"></div>
                    </div>
                    <p className="font-semibold text-center">Claro</p>
                  </label>

                  <label className="border-2 rounded-lg p-4 cursor-pointer hover:border-blue-500 transition">
                    <input
                      type="radio"
                      name="theme"
                      value="dark"
                      checked={settings.theme === 'dark'}
                      onChange={(e) => setSettings({...settings, theme: e.target.value})}
                      className="mb-3"
                    />
                    <div className="bg-gray-800 border-2 rounded-lg p-4 mb-2">
                      <div className="h-2 bg-gray-600 rounded mb-2"></div>
                      <div className="h-2 bg-gray-600 rounded w-2/3"></div>
                    </div>
                    <p className="font-semibold text-center">Escuro</p>
                  </label>
                </div>
              </div>

              <div className="bg-yellow-50 border-2 border-yellow-300 rounded-lg p-4">
                <p className="text-sm text-yellow-800">
                  ℹ️ <strong>Nota:</strong> O tema escuro será implementado em uma próxima versão.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="border-t p-4 bg-gray-50 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-6 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 font-semibold"
          >
            Fechar
          </button>
          <button
            onClick={handleSaveSettings}
            disabled={saving}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-semibold flex items-center gap-2 disabled:opacity-50"
          >
            {saving ? 'Salvando...' : (
              <>
                <Check size={18} />
                Salvar Alterações
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default SettingsPanel;
