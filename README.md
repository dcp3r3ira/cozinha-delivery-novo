# Cozinha Delivery - Sistema de Entrega

Um sistema completo de gerenciamento de delivery com painel administrativo, tela de cozinha e interface de clientes. Construído com React 19, Vite e Firebase Realtime Database.

## 🚀 Sobre o Projeto

Este é um sistema web moderno para gerenciamento de pedidos de delivery, com:

- **Menu Interativo**: Exibição dinâmica de produtos com categorias
- **Carrinho de Compras**: Sistema de carrinho flutuante e checkout
- **Painel de Admin**: Gestão completa de pedidos, menu e configurações
- **Tela de Cozinha**: Visualização dedicada para preparação de pedidos
- **Gestão de Clientes**: Histórico de compras e estatísticas
- **Integração Firebase**: Sincronização em tempo real

## 💻 Tecnologias

- **React 19.2.3** - Framework UI
- **Vite 5.1** - Build tool de nova geração
- **Firebase 12.8** - Backend e realtime database
- **Tailwind CSS 3.4** - Framework de CSS utilitário
- **Lucide React** - Ícones SVG
- **Node.js ES Modules** - Módulos JavaScript modernos

## 📋 Pré-requisitos

- Node.js 18+ instalado
- npm ou yarn
- Conta Firebase com Realtime Database configurado

## ⚙️ Instalação

1. Clone ou extraia o projeto:
```bash
cd cozinha-delivery-novo
```

2. Instale as dependências:
```bash
npm install
```

3. Configure as variáveis de ambiente:
```bash
cp .env.example .env
```

4. Edite `.env` com suas credenciais Firebase:
```env
VITE_FIREBASE_API_KEY=sua_api_key
VITE_FIREBASE_AUTH_DOMAIN=seu_auth_domain
VITE_FIREBASE_DATABASE_URL=sua_database_url
VITE_FIREBASE_PROJECT_ID=seu_project_id
VITE_FIREBASE_STORAGE_BUCKET=seu_storage_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=seu_messaging_sender_id
VITE_FIREBASE_APP_ID=seu_app_id
```

## 🎯 Scripts Disponíveis

- `npm run dev` - Inicia o servidor de desenvolvimento (porta 3000)
- `npm run build` - Compila o projeto para produção
- `npm run preview` - Visualiza o build de produção localmente
- `npm run test` - Executa testes (Vitest)

## 🏗️ Estrutura do Projeto

```
src/
├── App.jsx                  # Componente principal
├── Menu.jsx                 # Cardápio e carrinho
├── Login.jsx                # Tela de autenticação
├── Kitchen.jsx              # Painel da cozinha
├── AdminPanel.jsx           # Painel administrativo
├── CustomersPanel.jsx       # Gestão de clientes
├── SettingsPanel.jsx        # Configurações do sistema
├── CustomerLogin.jsx        # Login de clientes
├── firebaseConfig.js        # Configuração Firebase
├── orderService.js          # Gerenciamento de pedidos
├── customerService.js       # Gerenciamento de clientes
├── settingsService.js       # Configurações da aplicação
├── main.jsx                 # Entry point
├── index.css                # Estilos Tailwind
└── App.css                  # Estilos adicionais
```

## 🔐 Credenciais Padrão

Ao iniciar a aplicação:
- **Admin**: `admin` / `admin123`
- **Cozinha**: `cozinha` / `cozinha123`

Altere as credenciais no painel de configurações!

## 🎨 Funcionalidades

### Menu Público
- Visualização de produtos por categoria
- Carrinho de compras flutuante
- Checkout com dados de entrega
- Duas formas de pagamento (PIX e Dinheiro)
- Som de notificação ao confirmar pedido

### Painel Admin
- Dashboard com estatísticas de pedidos
- Gerenciamento completo do cardápio
- Gestão de clientes e histórico de compras
- Configurações de sistema (horários, taxa, notificações)
- Gerenciamento de credenciais

### Tela de Cozinha
- Visualização otimizada para preparação
- Filtros por status (Em Preparo / Prontos)
- Atualizações em tempo real de pedidos
- Som e notificações de novos pedidos

### Gestão de Clientes
- Busca por nome ou telefone
- Detalhes completos do cliente
- Histórico de pedidos
- Estatísticas (total gasto, ticket médio)
- Badge de cliente VIP (10+ pedidos)

## 📦 Integração Firebase

### Estrutura de Dados

```
database/
├── orders/           # Pedidos em tempo real
├── menu/             # Itens do cardápio
├── customers/        # Dados dos clientes
├── settings/         # Configurações do sistema
└── passwords/        # Credenciais de acesso
```

## 🚀 Deploy

### Build para Produção
```bash
npm run build
```

A pasta `dist/` contém os arquivos prontos para deploy.

### Opções de Hosting
- Vercel (recomendado para Vite)
- Netlify
- Firebase Hosting
- GitHub Pages

## 📱 Responsividade

O projeto é totalmente responsivo para:
- Desktop (1920px+)
- Tablet (768px - 1024px)
- Mobile (320px - 767px)

## 🔔 Som de Notificação

O sistema usa Web Audio API para reproduzir sons de notificação ao:
- Novo pedido chegar (somente em modo Admin/Cozinha)
- Confirmar pedido (modo Cliente)

Volume e status podem ser configurados no painel de settings.

## 📝 Migração de Create React App para Vite

Este projeto foi migrado de Create React App para Vite:

- ✅ Remoção de `react-scripts`
- ✅ Conversão de `.js` para `.jsx` (componentes)
- ✅ Atualização de imports para ES Modules
- ✅ Configuração de Vite com plugin React
- ✅ Mantido Tailwind CSS e PostCSS
- ✅ Todas as funcionalidades preservadas

## 🐛 Troubleshooting

### Firebase não conecta
- Verificar credenciais em `.env`
- Confirmar Realtime Database está ativo
- Validar regras de segurança do Firebase

### Estilo não aparece
- Executar `npm run build` para compilar
- Limpar cache do navegador (Ctrl+Shift+Del)
- Verificar console do navegador

### Porta 3000 já está em uso
- Mudar porta em `vite.config.js`
- Ou encerrar processo: `lsof -i :3000` (Linux/Mac)

## 📄 Licença

Projeto desenvolvido para uso educacional e comercial.

## 👨‍💻 Autor

Desenvolvido com ❤️ para sistemas de delivery modernos.

---

**Versão**: 1.0.0 (Migrado para Vite)  
**Última atualização**: Fevereiro 2026
