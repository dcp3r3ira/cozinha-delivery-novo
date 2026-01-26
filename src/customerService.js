import { database } from './firebaseConfig';
import { ref, set, onValue, update, get } from 'firebase/database';

// Serviço de gerenciamento de clientes
class CustomerService {
  constructor() {
    this.customersRef = ref(database, 'customers');
  }

  // Registrar ou atualizar cliente
  async registerCustomer(customerData) {
    try {
      const { name, phone, address } = customerData;
      
      // Usar telefone como chave única (remover caracteres especiais)
      const phoneKey = phone.replace(/\D/g, '');
      
      const customerRef = ref(database, `customers/${phoneKey}`);
      
      // Verificar se cliente já existe
      const snapshot = await get(customerRef);
      
      if (snapshot.exists()) {
        // Cliente existe, atualizar apenas endereço se fornecido
        const existingData = snapshot.val();
        await update(customerRef, {
          address: address || existingData.address,
          lastUpdated: new Date().toISOString()
        });
        return { ...existingData, address: address || existingData.address };
      } else {
        // Novo cliente
        const newCustomer = {
          name,
          phone,
          address,
          createdAt: new Date().toISOString(),
          lastUpdated: new Date().toISOString(),
          totalOrders: 0,
          totalSpent: 0
        };
        
        await set(customerRef, newCustomer);
        return newCustomer;
      }
    } catch (error) {
      console.error('Erro ao registrar cliente:', error);
      throw error;
    }
  }

  // Buscar cliente por telefone
  async getCustomerByPhone(phone) {
    try {
      const phoneKey = phone.replace(/\D/g, '');
      const customerRef = ref(database, `customers/${phoneKey}`);
      const snapshot = await get(customerRef);
      
      if (snapshot.exists()) {
        return { phoneKey, ...snapshot.val() };
      }
      return null;
    } catch (error) {
      console.error('Erro ao buscar cliente:', error);
      return null;
    }
  }

  // Atualizar estatísticas do cliente após pedido
  async updateCustomerStats(phone, orderTotal) {
    try {
      const phoneKey = phone.replace(/\D/g, '');
      const customerRef = ref(database, `customers/${phoneKey}`);
      const snapshot = await get(customerRef);
      
      if (snapshot.exists()) {
        const customer = snapshot.val();
        await update(customerRef, {
          totalOrders: (customer.totalOrders || 0) + 1,
          totalSpent: (customer.totalSpent || 0) + orderTotal,
          lastOrderDate: new Date().toISOString()
        });
      }
    } catch (error) {
      console.error('Erro ao atualizar estatísticas do cliente:', error);
    }
  }

  // Obter todos os clientes (apenas para admin)
  async getAllCustomers() {
    return new Promise((resolve) => {
      onValue(this.customersRef, (snapshot) => {
        const data = snapshot.val();
        if (data) {
          const customersArray = Object.entries(data).map(([key, value]) => ({
            phoneKey: key,
            ...value
          }));
          // Ordenar por total gasto (clientes VIP primeiro)
          customersArray.sort((a, b) => (b.totalSpent || 0) - (a.totalSpent || 0));
          resolve(customersArray);
        } else {
          resolve([]);
        }
      }, { onlyOnce: true });
    });
  }

  // Escutar mudanças em clientes (tempo real)
  onCustomersChange(callback) {
    onValue(this.customersRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const customersArray = Object.entries(data).map(([key, value]) => ({
          phoneKey: key,
          ...value
        }));
        customersArray.sort((a, b) => (b.totalSpent || 0) - (a.totalSpent || 0));
        callback(customersArray);
      } else {
        callback([]);
      }
    });
  }

  // Obter histórico de pedidos de um cliente
  async getCustomerOrderHistory(phone) {
    try {
      const ordersRef = ref(database, 'orders');
      
      return new Promise((resolve) => {
        onValue(ordersRef, (snapshot) => {
          const data = snapshot.val();
          if (data) {
            const ordersArray = Object.entries(data)
              .map(([key, value]) => ({
                firebaseKey: key,
                ...value
              }))
              .filter(order => order.customerPhone === phone)
              .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
            
            resolve(ordersArray);
          } else {
            resolve([]);
          }
        }, { onlyOnce: true });
      });
    } catch (error) {
      console.error('Erro ao buscar histórico:', error);
      return [];
    }
  }
}

const customerService = new CustomerService();
export default customerService;
