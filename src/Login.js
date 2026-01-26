import React, { useState, useEffect } from 'react';
import { ChefHat, Lock, User } from 'lucide-react';
import settingsService from './settingsService';

const Login = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [role, setRole] = useState('admin'); // 'admin' ou 'kitchen'
  const [credentials, setCredentials] = useState(null);

  useEffect(() => {
    loadCredentials();
  }, []);

  const loadCredentials = async () => {
    const data = await settingsService.getPasswords();
    setCredentials(data);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (!credentials) {
      setError('Erro ao carregar credenciais. Tente novamente.');
      return;
    }

    const validCredentials = {
      admin: { 
        username: credentials.adminUsername, 
        password: credentials.adminPassword 
      },
      kitchen: { 
        username: credentials.kitchenUsername, 
        password: credentials.kitchenPassword 
      }
    };

    if (username === validCredentials[role].username && password === validCredentials[role].password) {
      onLogin(role);
    } else {
      setError('Usuário ou senha incorretos!');
      setPassword('');
    }
  };

  if (!credentials) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50 flex items-center justify-center">
        <p>Carregando...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md">
        <div className="text-center mb-8">
          <div className="bg-orange-600 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
            <ChefHat size={40} className="text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Cozinha Delivery</h1>
          <p className="text-gray-600">Área Restrita</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Seletor de Perfil */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Tipo de Acesso
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setRole('admin')}
                className={`p-4 rounded-lg border-2 transition ${
                  role === 'admin'
                    ? 'border-orange-600 bg-orange-50 text-orange-600'
                    : 'border-gray-300 bg-white text-gray-700 hover:border-gray-400'
                }`}
              >
                <div className="font-semibold">Admin</div>
                <div className="text-xs mt-1">Painel Completo</div>
              </button>
              <button
                type="button"
                onClick={() => setRole('kitchen')}
                className={`p-4 rounded-lg border-2 transition ${
                  role === 'kitchen'
                    ? 'border-blue-600 bg-blue-50 text-blue-600'
                    : 'border-gray-300 bg-white text-gray-700 hover:border-gray-400'
                }`}
              >
                <div className="font-semibold">Cozinha</div>
                <div className="text-xs mt-1">Pedidos</div>
              </button>
            </div>
          </div>

          {/* Usuário */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Usuário
            </label>
            <div className="relative">
              <User size={20} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border-2 border-gray-300 rounded-lg focus:border-orange-500 outline-none transition"
                placeholder="Digite seu usuário"
                required
              />
            </div>
          </div>

          {/* Senha */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Senha
            </label>
            <div className="relative">
              <Lock size={20} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border-2 border-gray-300 rounded-lg focus:border-orange-500 outline-none transition"
                placeholder="Digite sua senha"
                required
              />
            </div>
          </div>

          {/* Erro */}
          {error && (
            <div className="bg-red-100 border-2 border-red-300 text-red-700 px-4 py-3 rounded-lg">
              {error}
            </div>
          )}

          {/* Botão */}
          <button
            type="submit"
            className="w-full bg-orange-600 text-white py-3 rounded-lg font-bold hover:bg-orange-700 transition"
          >
            Entrar
          </button>
        </form>

        {/* Credenciais de Teste */}
        <div className="mt-8 pt-6 border-t border-gray-200">
          <p className="text-xs text-gray-500 text-center mb-3 font-semibold">Credenciais de Teste:</p>
          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="bg-orange-50 p-3 rounded">
              <p className="font-semibold text-orange-700">Admin</p>
              <p className="text-gray-600">Usuário: {credentials.adminUsername}</p>
              <p className="text-gray-600">Senha: {credentials.adminPassword}</p>
            </div>
            <div className="bg-blue-50 p-3 rounded">
              <p className="font-semibold text-blue-700">Cozinha</p>
              <p className="text-gray-600">Usuário: {credentials.kitchenUsername}</p>
              <p className="text-gray-600">Senha: {credentials.kitchenPassword}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
