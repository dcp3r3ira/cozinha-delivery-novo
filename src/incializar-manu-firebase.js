// Script para inicializar o menu no Firebase
// Execute este código UMA VEZ no console do navegador (F12)

import settingsService from './settingsService';

const menuInicial = [
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

// Função para inicializar
async function inicializarMenu() {
  console.log('Iniciando upload do menu para o Firebase...');
  
  for (const item of menuInicial) {
    await settingsService.saveMenuItem(item);
    console.log(`✓ ${item.name} salvo`);
  }
  
  console.log('✅ Menu inicializado com sucesso!');
}

// Executar
inicializarMenu();
