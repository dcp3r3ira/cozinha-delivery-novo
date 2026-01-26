import { database } from './firebaseConfig';
import { ref, set, get, onValue } from 'firebase/database';

// Serviço de gerenciamento de configurações
class SettingsService {
  constructor() {
    this.settingsRef = ref(database, 'settings');
    this.menuRef = ref(database, 'menu');
    this.passwordsRef = ref(database, 'passwords');
  }

  // Configurações padrão
  getDefaultSettings() {
    return {
      deliveryFee: 8.00,
      isOpen: true,
      openingHours: '18:00',
      closingHours: '23:00',
      statusMessage: 'Aberto para pedidos!',
      soundEnabled: true,
      soundVolume: 50,
      autoRefresh: true,
      refreshInterval: 5000,
      theme: 'light'
    };
  }

  // Obter configurações
  async getSettings() {
    try {
      const snapshot = await get(this.settingsRef);
      if (snapshot.exists()) {
        return snapshot.val();
      }
      return this.getDefaultSettings();
    } catch (error) {
      console.error('Erro ao carregar configurações:', error);
      return this.getDefaultSettings();
    }
  }

  // Salvar configurações
  async saveSettings(settings) {
    try {
      await set(this.settingsRef, settings);
      return true;
    } catch (error) {
      console.error('Erro ao salvar configurações:', error);
      return false;
    }
  }

  // Escutar mudanças em tempo real
  onSettingsChange(callback) {
    onValue(this.settingsRef, (snapshot) => {
      if (snapshot.exists()) {
        callback(snapshot.val());
      } else {
        callback(this.getDefaultSettings());
      }
    });
  }

  // Obter menu
  async getMenu() {
    try {
      const snapshot = await get(this.menuRef);
      if (snapshot.exists()) {
        return Object.entries(snapshot.val()).map(([key, value]) => ({
          firebaseKey: key,
          ...value
        }));
      }
      return [];
    } catch (error) {
      console.error('Erro ao carregar menu:', error);
      return [];
    }
  }

  // Salvar item do menu
  async saveMenuItem(item) {
    try {
      const itemRef = ref(database, `menu/${item.firebaseKey || item.id}`);
      await set(itemRef, {
        id: item.id,
        name: item.name,
        description: item.description,
        price: item.price,
        category: item.category,
        image: item.image,
        available: item.available !== false
      });
      return true;
    } catch (error) {
      console.error('Erro ao salvar item:', error);
      return false;
    }
  }

  // Deletar item do menu
  async deleteMenuItem(firebaseKey) {
    try {
      const itemRef = ref(database, `menu/${firebaseKey}`);
      await set(itemRef, null);
      return true;
    } catch (error) {
      console.error('Erro ao deletar item:', error);
      return false;
    }
  }

  // Escutar mudanças no menu em tempo real
  onMenuChange(callback) {
    onValue(this.menuRef, (snapshot) => {
      if (snapshot.exists()) {
        const menuArray = Object.entries(snapshot.val()).map(([key, value]) => ({
          firebaseKey: key,
          ...value
        }));
        callback(menuArray);
      } else {
        callback([]);
      }
    });
  }

  // Gerenciamento de senhas
  async getPasswords() {
    try {
      const snapshot = await get(this.passwordsRef);
      if (snapshot.exists()) {
        return snapshot.val();
      }
      return {
        adminUsername: 'admin',
        adminPassword: 'admin123',
        kitchenUsername: 'cozinha',
        kitchenPassword: 'cozinha123'
      };
    } catch (error) {
      console.error('Erro ao carregar senhas:', error);
      return null;
    }
  }

  async savePasswords(passwordData) {
    try {
      const currentPasswords = await this.getPasswords();
      
      const updatedPasswords = {
        adminUsername: passwordData.adminUsername,
        adminPassword: passwordData.adminPassword || currentPasswords.adminPassword,
        kitchenUsername: passwordData.kitchenUsername,
        kitchenPassword: passwordData.kitchenPassword || currentPasswords.kitchenPassword
      };

      await set(this.passwordsRef, updatedPasswords);
      return true;
    } catch (error) {
      console.error('Erro ao salvar senhas:', error);
      return false;
    }
  }
}

const settingsService = new SettingsService();
export default settingsService;
