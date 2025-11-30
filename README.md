<<<<<<< HEAD
# Doce Encomenda - Website

## Project info

This is the official repository for Doce Encomenda, a bakery specializing in custom artisan cakes.

## How can I edit this code?

There are several ways of editing your application.

**Use your preferred IDE**

If you want to work locally using your own IDE, you can clone this repo and push changes.

The only requirement is having Node.js & npm installed - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

Follow these steps:

```sh
# Step 1: Clone the repository using the project's Git URL.
git clone <YOUR_GIT_URL>

# Step 2: Navigate to the project directory.
cd <YOUR_PROJECT_NAME>

# Step 3: Install the necessary dependencies.
npm i

# Step 4: Start the development server with auto-reloading and an instant preview.
npm run dev
```

**Edit a file directly in GitHub**

- Navigate to the desired file(s).
- Click the "Edit" button (pencil icon) at the top right of the file view.
- Make your changes and commit the changes.

**Use GitHub Codespaces**

- Navigate to the main page of your repository.
- Click on the "Code" button (green button) near the top right.
- Select the "Codespaces" tab.
- Click on "New codespace" to launch a new Codespace environment.
- Edit files directly within the Codespace and commit and push your changes once you're done.

## What technologies are used for this project?

This project is built with:

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS

## How can I deploy this project?

To deploy this project, you can use any static hosting service like Netlify, Vercel, or GitHub Pages.

1. Build the project using `npm run build`
2. Upload the contents of the `dist` folder to your hosting provider

## Custom Domain Setup

Most hosting providers offer custom domain setup. Check their documentation for specific instructions on connecting your domain.
=======
# Doce Encomenda - Plataforma Web para Encomendas de Bolos Personalizados

**NOME DO SISTEMA:**  
Doce Encomenda - Plataforma Web para Encomendas de Bolos Personalizados

**DISCENTE E MATRÍCULA:**  
Rosivânia da Silva Viana  
Matrícula: 20240065375

Emanoel Silva Lima  
Matrícula: 2020034224

---

## 📖 Sobre o Projeto

O **Doce Encomenda** é uma plataforma web completa desenvolvida para facilitar o processo de encomenda de bolos personalizados e prontos. O sistema oferece uma experiência intuitiva tanto para clientes quanto para administradores, permitindo customização completa de bolos, gerenciamento de carrinho de compras e integração com WhatsApp para finalização de pedidos.

### 🎯 Objetivo

Criar uma solução digital moderna e responsiva que simplifique o processo de encomenda de bolos, oferecendo:
- Interface amigável e intuitiva
- Personalização completa de produtos
- Gestão eficiente de pedidos
- Painel administrativo para gerenciamento

---

## 🚀 Começando

### 📋 Pré-requisitos

Antes de começar, certifique-se de ter instalado em sua máquina:

- **Node.js** (versão 16.x ou superior) - [Download](https://nodejs.org/)
- **npm** (normalmente vem com Node.js) ou **yarn**
- **Git** - [Download](https://git-scm.com/)
- Navegador web moderno (Chrome, Firefox, Edge, Safari)

### 🔧 Instalação

1. **Clone o repositório**
   ```bash
   git clone [URL_DO_REPOSITORIO]
   cd doce-encomenda
   ```

2. **Instale as dependências**
   ```bash
   npm install
   ```
   ou
   ```bash
   yarn install
   ```

3. **Inicie o servidor de desenvolvimento**
   ```bash
   npm run dev
   ```
   ou
   ```bash
   yarn dev
   ```

4. **Acesse a aplicação**
   
   Abra seu navegador e acesse: `http://localhost:5173`

### 📂 Arquivo Inicial

**Arquivo principal para iniciar:** `src/main.tsx`

Este é o ponto de entrada da aplicação React. A partir dele, toda a estrutura de rotas e componentes é carregada.

---

## 🌐 Páginas Implementadas

### Páginas Públicas

1. **Home (`/`)**
   - Página inicial com banner de boas-vindas
   - Destaques de produtos
   - Seções promocionais
   - Call-to-actions para catálogo e personalização

2. **Catálogo (`/catalogo`)**
   - Listagem completa de produtos
   - Filtros por categoria (Prontos, Personalizados)
   - Cards com imagens, descrições e preços
   - Botão de adicionar ao carrinho
   - Design em grid responsivo

3. **Produto (`/produto/:id`)**
   - Visualização detalhada do produto
   - Galeria de imagens
   - Informações completas (descrição, preço, categoria)
   - Opção de adicionar ao carrinho
   - Produtos relacionados

4. **Monte Seu Bolo (`/monte-seu-bolo`)**
   - Interface de personalização completa
   - Seleção de:
     - Tamanho (Pequeno, Médio, Grande, Gigante)
     - Sabor da massa
     - Recheio
     - Cobertura
     - Decoração
     - Número de andares
   - Cálculo dinâmico de preço
   - Visualização do resumo
   - Adicionar ao carrinho

5. **Carrinho (`/carrinho`)**
   - Listagem de todos os itens
   - Quantidade editável
   - Remoção de itens
   - Cálculo de subtotal e total
   - Botão para checkout

6. **Checkout (`/checkout`)**
   - Formulário de dados do cliente:
     - Nome completo
     - Telefone
     - Endereço de entrega
     - Observações
   - Resumo do pedido
   - Botão de finalização via WhatsApp

7. **Sobre (`/sobre`)**
   - História da confeitaria
   - Missão e valores
   - Informações de contato
   - Horários de funcionamento

### Páginas Administrativas

8. **Login Admin (`/admin/login`)**
   - Autenticação de administrador
   - Credenciais: `admin` / `admin123`
   - Validação de formulário

9. **Dashboard Admin (`/admin/dashboard`)**
   - Visão geral do sistema
   - Gestão de produtos:
     - Criar novo produto
     - Editar produto existente
     - Ativar/desativar produto
   - Gestão de opções de customização:
     - Criar novas opções
     - Editar opções existentes
     - Gerenciar preços e disponibilidade
   - Configurações da confeitaria
   - Preview de mensagens WhatsApp

10. **Preview WhatsApp (`/admin/whatsapp-preview`)**
    - Visualização de mensagens formatadas
    - Teste de formatação de pedidos

### Página de Erro

11. **404 - Não Encontrado (`/404` ou rotas inválidas)**
    - Página de erro personalizada
    - Redirecionamento para home

---

## 📁 Estrutura do Projeto

```
doce-encomenda/
├── public/                      # Arquivos públicos estáticos
│   ├── robots.txt              # Configuração para crawlers
│   └── favicon.ico             # Ícone da aplicação
│
├── src/                        # Código fonte principal
│   ├── assets/                 # Imagens e recursos estáticos
│   │   ├── bolo-aniversario.jpg
│   │   ├── bolo-casamento.jpg
│   │   ├── bolo-chocolate.jpg
│   │   └── ... (outras imagens de bolos)
│   │
│   ├── components/             # Componentes reutilizáveis
│   │   ├── ui/                # Componentes base (shadcn/ui)
│   │   │   ├── button.tsx
│   │   │   ├── card.tsx
│   │   │   ├── input.tsx
│   │   │   ├── form.tsx
│   │   │   └── ... (50+ componentes UI)
│   │   │
│   │   ├── admin/             # Componentes administrativos
│   │   │   ├── ProductForm.tsx
│   │   │   └── CustomizationOptionForm.tsx
│   │   │
│   │   ├── Navbar.tsx         # Barra de navegação
│   │   └── Footer.tsx         # Rodapé
│   │
│   ├── contexts/              # Contextos React (Estado Global)
│   │   ├── AdminContext.tsx   # Gerenciamento de autenticação admin
│   │   └── CartContext.tsx    # Gerenciamento do carrinho de compras
│   │
│   ├── data/                  # Dados da aplicação
│   │   └── mockData.ts        # Dados mock (produtos, opções, configurações)
│   │
│   ├── hooks/                 # Custom Hooks
│   │   ├── use-mobile.tsx     # Hook para detecção de mobile
│   │   ├── use-toast.ts       # Hook para notificações
│   │   ├── useBakerySettings.ts         # Hook para configurações
│   │   ├── useCustomizationOptions.ts   # Hook para opções de customização
│   │   └── useProducts.ts               # Hook para produtos
│   │
│   ├── pages/                 # Páginas da aplicação
│   │   ├── admin/             # Páginas administrativas
│   │   │   ├── Dashboard.tsx
│   │   │   ├── Login.tsx
│   │   │   └── WhatsAppPreview.tsx
│   │   │
│   │   ├── Home.tsx           # Página inicial
│   │   ├── Catalogo.tsx       # Catálogo de produtos
│   │   ├── Produto.tsx        # Detalhes do produto
│   │   ├── MonteSeuBolo.tsx   # Personalização de bolo
│   │   ├── Carrinho.tsx       # Carrinho de compras
│   │   ├── Checkout.tsx       # Finalização de pedido
│   │   ├── Sobre.tsx          # Sobre a confeitaria
│   │   └── NotFound.tsx       # Página 404
│   │
│   ├── lib/                   # Utilitários e bibliotecas
│   │   └── utils.ts           # Funções utilitárias
│   │
│   ├── App.tsx                # Componente principal com rotas
│   ├── App.css                # Estilos globais da aplicação
│   ├── index.css              # Estilos base e design system
│   ├── main.tsx               # Ponto de entrada da aplicação
│   └── vite-env.d.ts          # Definições de tipos do Vite
│
├── .env                       # Variáveis de ambiente (vazio nesta versão)
├── .gitignore                 # Arquivos ignorados pelo Git
├── eslint.config.js           # Configuração do ESLint
├── index.html                 # HTML raiz
├── package.json               # Dependências e scripts
├── package-lock.json          # Lockfile de dependências
├── postcss.config.js          # Configuração do PostCSS
├── tailwind.config.ts         # Configuração do Tailwind CSS
├── tsconfig.json              # Configuração do TypeScript
├── tsconfig.app.json          # Config TypeScript para app
├── tsconfig.node.json         # Config TypeScript para Node
├── vite.config.ts             # Configuração do Vite
├── components.json            # Configuração do shadcn/ui
└── README.md                  # Este arquivo
```

---

## 🛠️ Tecnologias Utilizadas

### Frontend Core
- **React 18.3.1** - Biblioteca JavaScript para construção de interfaces
- **TypeScript** - Superset JavaScript com tipagem estática
- **Vite** - Build tool moderna e rápida

### Estilização
- **Tailwind CSS** - Framework CSS utility-first
- **tailwindcss-animate** - Animações para Tailwind
- **class-variance-authority** - Gerenciamento de variantes de componentes
- **clsx** e **tailwind-merge** - Utilitários para classes CSS

### Componentes UI
- **Shadcn/ui** - Coleção de componentes acessíveis e customizáveis baseados em Radix UI
- **Radix UI** - Componentes primitivos acessíveis (50+ componentes)
- **Lucide React** - Ícones SVG

### Gerenciamento de Estado
- **React Context API** - Gerenciamento de estado global
- **TanStack Query (React Query)** - Gerenciamento de estado assíncrono

### Formulários
- **React Hook Form** - Biblioteca para gerenciamento de formulários
- **Zod** - Validação de schemas TypeScript-first
- **@hookform/resolvers** - Resolvers para React Hook Form

### Roteamento
- **React Router DOM** - Roteamento client-side

### Notificações
- **Sonner** - Biblioteca de toast/notificações

### Outras Bibliotecas
- **date-fns** - Manipulação de datas
- **embla-carousel-react** - Carrossel de imagens
- **recharts** - Biblioteca de gráficos

---

## 🎨 Design System

### Paleta de Cores

O projeto utiliza um design system consistente baseado em tokens semânticos HSL:

- **Primary**: Roxo vibrante (#8B5CF6)
- **Secondary**: Tom complementar
- **Accent**: Rosa/Roxo para destaques
- **Background**: Branco/Cinza claro
- **Foreground**: Textos principais
- **Muted**: Elementos secundários

### Componentes Reutilizáveis

Mais de 50 componentes UI prontos para uso:
- Botões (múltiplas variantes)
- Cards
- Formulários
- Diálogos e Modals
- Dropdowns
- Tabelas
- Tabs
- Tooltips
- E muito mais...

### Responsividade

- **Mobile First**: Design otimizado para dispositivos móveis
- **Breakpoints Tailwind**:
  - sm: 640px
  - md: 768px
  - lg: 1024px
  - xl: 1280px
  - 2xl: 1536px

---

## 🔐 Funcionalidades de Segurança

- **Autenticação Admin**: Sistema de login para acesso administrativo
- **Contexto de Admin**: Gerenciamento de estado de autenticação
- **Rotas Protegidas**: Páginas administrativas requerem autenticação
- **Validação de Formulários**: Validação client-side com Zod

---

## 💾 Gerenciamento de Dados

### Dados Mock (Local)

O sistema utiliza dados mock armazenados localmente em `src/data/mockData.ts`:

```typescript
// Estrutura de dados incluí:
- products: Array de produtos (prontos e personalizáveis)
- customizationOptions: Opções de personalização
  - sizes (tamanhos)
  - flavors (sabores)
  - fillings (recheios)
  - toppings (coberturas)
  - decorations (decorações)
  - layers (andares)
- bakerySettings: Configurações da confeitaria
```

### Context API

#### CartContext
- Adicionar/remover itens
- Atualizar quantidades
- Calcular totais
- Limpar carrinho

#### AdminContext
- Login/logout
- Verificação de autenticação
- Proteção de rotas

---

## 📊 Estrutura de Dados

### Produto
```typescript
{
  id: string;
  name: string;
  description: string;
  image: string;
  price: number;
  category: 'pronto' | 'personalizado';
  type: string;
  is_active: boolean;
}
```

### Opção de Customização
```typescript
{
  id: string;
  option_type: 'size' | 'flavor' | 'filling' | 'topping' | 'decoration' | 'layers';
  option_id: string;
  name: string;
  price: number;
  description?: string;
  is_active: boolean;
}
```

### Item do Carrinho
```typescript
{
  id: string;
  name: string;
  price: number;
  quantity: number;
  image?: string;
  customizations?: Record<string, any>;
}
```

---

## 🔄 Fluxo de Navegação

```
Home
├── Catálogo
│   └── Produto (detalhes)
│       └── Carrinho
│           └── Checkout
│               └── WhatsApp
│
├── Monte Seu Bolo
│   └── Carrinho
│       └── Checkout
│           └── WhatsApp
│
├── Sobre
│
└── Admin
    ├── Login
    └── Dashboard
        ├── Gestão de Produtos
        ├── Gestão de Opções
        └── WhatsApp Preview
```

---

## 📝 Licença

Este projeto foi desenvolvido para fins de avaliação em disciplina acadêmica.

---

**Data de Desenvolvimento:** Outubro de 2025  
**Versão:** 1.0.0
>>>>>>> a5f3e25425b43f1284c9f6eddb51fd037d4f240b
