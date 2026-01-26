import { database } from './firebaseConfig';
import { ref, set, push, onValue, update, remove } from 'firebase/database';

// Serviço de gerenciamento de pedidos com Firebase Realtime Database
class OrderService {
  constructor() {
    this.ordersRef = ref(database, 'orders');
  }

  // Adicionar novo pedido
  async addOrder(orderData) {
    try {
      const newOrderRef = push(this.ordersRef);
      const orderId = Date.now(); // Usar timestamp como ID
      
      const order = {
        id: orderId,
        ...orderData,
        createdAt: new Date().toISOString()
      };

      await set(newOrderRef, order);
      return order;
    } catch (error) {
      console.error('Erro ao adicionar pedido:', error);
      throw error;
    }
  }

  // Atualizar status do pedido
  async updateOrderStatus(firebaseKey, orderId, newStatus) {
    try {
      const orderRef = ref(database, `orders/${firebaseKey}`);
      await update(orderRef, { status: newStatus });
    } catch (error) {
      console.error('Erro ao atualizar status:', error);
      throw error;
    }
  }

  // Deletar pedido
  async deleteOrder(firebaseKey) {
    try {
      const orderRef = ref(database, `orders/${firebaseKey}`);
      await remove(orderRef);
    } catch (error) {
      console.error('Erro ao deletar pedido:', error);
      throw error;
    }
  }

  // Escutar mudanças em tempo real
  onOrdersChange(callback) {
    onValue(this.ordersRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        // Converter objeto do Firebase para array
        const ordersArray = Object.entries(data).map(([key, value]) => ({
          firebaseKey: key,
          ...value
        }));
        // Ordenar por ID (mais recente primeiro)
        ordersArray.sort((a, b) => b.id - a.id);
        callback(ordersArray);
      } else {
        callback([]);
      }
    });
  }

  // Carregar pedidos iniciais
  async getOrders() {
    return new Promise((resolve) => {
      onValue(this.ordersRef, (snapshot) => {
        const data = snapshot.val();
        if (data) {
          const ordersArray = Object.entries(data).map(([key, value]) => ({
            firebaseKey: key,
            ...value
          }));
          ordersArray.sort((a, b) => b.id - a.id);
          resolve(ordersArray);
        } else {
          resolve([]);
        }
      }, { onlyOnce: true });
    });
  }
}

const orderService = new OrderService();
export default orderService;
