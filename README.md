# Doce Encomenda - Plataforma Web para Encomendas de Bolos Personalizados

**NOME DO SISTEMA:**  
Doce Encomenda - Plataforma Web para Encomendas de Bolos Personalizados

**DISCENTES E MATRÍCULAS:**  
Rosivânia da Silva Viana  
Matrícula: 20240065375

Emanoel Silva Lima  
Matrícula: 2020034224

---


#### Segue o link do video de apresentação da plataforma: https://www.youtube.com/watch?v=gNGPreDucZ8


---

## 📖 Sobre o Projeto

O Doce Encomenda é uma plataforma web completa desenvolvida para facilitar o processo de encomenda de bolos personalizados e prontos. O sistema oferece uma experiência intuitiva tanto para clientes quanto para administradores, permitindo customização completa de bolos, gerenciamento de carrinho de compras e integração com Telegram para finalização de pedidos.

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

3. **Configure as variáveis de ambiente**

   Crie um arquivo `.env` na raiz do projeto e informe as credenciais do banco de dados:

   ```env
   VITE_SUPABASE_URL=...
   VITE_SUPABASE_ANON_KEY=...

4. **Inicie o servidor de desenvolvimento**
   ```bash
   npm run dev
   ```
   ou
   ```bash
   yarn dev
   ```

5. **Acesse a aplicação**
   
   Abra seu navegador e acesse: `http://localhost:8080`

### 📂 Arquivo Inicial

**Arquivo principal para iniciar:** `src/main.tsx`

Este é o ponto de entrada da aplicação React. A partir dele, toda a estrutura de rotas e componentes é carregada.

---

## 🌐 Páginas Implementadas

### Páginas Públicas

1. **Home (`/`)**
<img src="site doce encomendas/src/assets/Home.png" alt="Tela inicial" width="500"/>

   - Página inicial com banner de boas-vindas
   - Destaques de produtos
   - Chamadas para catálogo e personalização

2. **Catálogo (`/catalogo`)**
<img src="site doce encomendas/src/assets/Catálogo.png" alt="Catálogo" width="500"/>

   - Listagem completa de produtos
   - Filtros por categoria e valor
   - Cards com imagens, descrições e preços
   - Botão de adicionar ao carrinho

3. **Produto (`/produto/:id`)**
   - Visualização detalhada do produto
   - Informações completas (descrição, preço, categoria)
   - Opção de adicionar ao carrinho

4. **Monte Seu Bolo (`/monte-seu-bolo`)**
<img src="site doce encomendas/src/assets/Monte seu bolo.png" alt="Monte seu bolo" width="500"/>

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
<img src="site doce encomendas/src/assets/Carrinho.png" alt="Carrinho" width="500"/>

   - Listagem de todos os itens
   - Quantidade editável
   - Remoção de itens
   - Cálculo de valores
   - Botão para checkout

6. **Checkout (`/checkout`)**
   - Formulário de dados do cliente:
     - Nome completo
     - Telefone
     - Endereço de entrega ou retirada no local
     - Observações
   - Resumo do pedido
   - Botão de finalização via Telegram

7. **Sobre (`/sobre`)**
   - História da confeitaria
   - Missão e valores
   - Informações de contato
   - Horários de funcionamento

### Páginas Administrativas

8. **Login Admin (`/admin/login`)**
   - Autenticação de administrador
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

### Página de Erro

11. **404 - Não Encontrado**
    - Página de erro personalizada

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

### Backend / Dados

* **Supabase** – Banco de dados e API para persistência das informações

### Estilização
- **Tailwind CSS** - Framework CSS utility-first
- **Shadcn/ui** - Coleção de componentes acessíveis e customizáveis baseados em Radix UI
- **Radix UI** - Componentes primitivos acessíveis (50+ componentes)
- **Lucide React** - Ícones SVG

### Gerenciamento de Estado
- **React Context API** - Gerenciamento de estado global
- **TanStack Query (React Query)** - Gerenciamento de estado assíncrono

### Formulários
- **React Hook Form** - Biblioteca para gerenciamento de formulários
- **Zod** - Validação de schemas TypeScript-first

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

### Banco de Dados

O sistema utiliza banco de dados para armazenar produtos, opções de personalização e configurações da confeitaria, permitindo persistência das informações entre sessões e ambiente administrativo funcional.

### Context API

#### CartContext

* Gerenciamento de itens do carrinho
* Atualização de quantidades
* Cálculo de totais

#### AdminContext

* Autenticação
* Controle de sessão
* Proteção de rotas administrativas

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
│               └── WhatsApp e/ou Telegram
│
├── Monte Seu Bolo
│   └── Carrinho
│       └── Checkout
│           └── WhatsApp e/ou Telegram
│
├── Sobre
│
└── Admin
    ├── Login
    └── Dashboard
        ├── Gestão de Produtos
        └── Gestão de Opções
```

---

## 📝 Licença

Este projeto foi desenvolvido para fins de avaliação em disciplina acadêmica.

---

**Data de Desenvolvimento:** Outubro de 2025  
**Versão:** 1.0.0
