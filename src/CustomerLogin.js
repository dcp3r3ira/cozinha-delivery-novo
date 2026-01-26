import React, { useState } from 'react';
import { User, Phone, MapPin, ArrowRight } from 'lucide-react';
import customerService from './customerService';

const CustomerLogin = ({ onLoginSuccess }) => {
  const [step, setStep] = useState(1); // 1: login, 2: cadastro
  const [phone, setPhone] = useState('');
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

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
  };

  const handleCheckPhone = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const customer = await customerService.getCustomerByPhone(phone);
      
      if (customer) {
        // Cliente encontrado, fazer login
        onLoginSuccess(customer);
      } else {
        // Cliente novo, ir para cadastro
        setStep(2);
      }
    } catch (err) {
      setError('Erro ao verificar telefone. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const customer = await customerService.registerCustomer({
        name,
        phone,
        address
      });
      
      onLoginSuccess(customer);
    } catch (err) {
      setError('Erro ao cadastrar. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md">
        <div className="text-center mb-8">
          <div className="bg-orange-600 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
            <User size={40} className="text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            {step === 1 ? 'Bem-vindo!' : 'Cadastro'}
          </h1>
          <p className="text-gray-600">
            {step === 1 ? 'Digite seu telefone para continuar' : 'Complete seu cadastro'}
          </p>
        </div>

        {step === 1 ? (
          // Tela de Login
          <form onSubmit={handleCheckPhone} className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Telefone
              </label>
              <div className="relative">
                <Phone size={20} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="tel"
                  value={phone}
                  onChange={handlePhoneChange}
                  className="w-full pl-10 pr-4 py-3 border-2 border-gray-300 rounded-lg focus:border-orange-500 outline-none transition"
                  placeholder="(11) 98765-4321"
                  required
                  maxLength={15}
                />
              </div>
            </div>

            {error && (
              <div className="bg-red-100 border-2 border-red-300 text-red-700 px-4 py-3 rounded-lg text-sm">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading || phone.replace(/\D/g, '').length < 10}
              className="w-full bg-orange-600 text-white py-3 rounded-lg font-bold hover:bg-orange-700 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? 'Verificando...' : 'Continuar'}
              <ArrowRight size={20} />
            </button>

            <p className="text-xs text-gray-500 text-center mt-4">
              Novo por aqui? Não se preocupe, vamos te cadastrar! 😊
            </p>
          </form>
        ) : (
          // Tela de Cadastro
          <form onSubmit={handleRegister} className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Nome Completo
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

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Telefone
              </label>
              <div className="relative">
                <Phone size={20} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="tel"
                  value={phone}
                  disabled
                  className="w-full pl-10 pr-4 py-3 border-2 border-gray-300 rounded-lg bg-gray-100"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Endereço Completo
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

            {error && (
              <div className="bg-red-100 border-2 border-red-300 text-red-700 px-4 py-3 rounded-lg text-sm">
                {error}
              </div>
            )}

            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="flex-1 bg-gray-300 text-gray-700 py-3 rounded-lg font-bold hover:bg-gray-400 transition"
              >
                Voltar
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex-1 bg-orange-600 text-white py-3 rounded-lg font-bold hover:bg-orange-700 transition disabled:opacity-50"
              >
                {loading ? 'Cadastrando...' : 'Cadastrar'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default CustomerLogin;
