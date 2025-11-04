# Doce Encomenda

Este é um projeto de site responsivo para uma confeitaria artesanal de bolos personalizados. O projeto foi criado para servir como um catálogo digital e uma ferramenta de solicitação de encomendas, otimizando o processo de seleção e personalização de bolos pelo cliente.

---

## Principais Funcionalidades

- Design Totalmente Responsivo: A interface se adapta perfeitamente a dispositivos móveis, tablets e desktops.
- Páginas Múltiplas: O site conta com 18 páginas HTML, cobrindo todo o fluxo do cliente e uma área administrativa.
- Catálogo de Produtos: Apresenta bolos pré-prontos com páginas de detalhes individuais.
- Personalizador de Bolos: Uma página dedicada ("Monte Seu Bolo") onde o cliente pode escolher tamanho, sabor, recheio, cobertura e outros detalhes.
- Fluxo de Encomenda: Inclui páginas de carrinho e checkout que coletam as informações do cliente.
- Integração com WhatsApp: Os formulários de pedido são configurados para enviar as informações coletadas diretamente para um número de WhatsApp, facilitando a comunicação.
- Área Administrativa: Um conjunto de páginas que simulam um painel de controle para gerenciamento de produtos e pedidos.
- Design Moderno: Utiliza uma paleta de cores coesa, gradientes suaves e uma tipografia limpa (Google Fonts - Inter).

---

## Tecnologias Utilizadas

- HTML5: Para a estruturação semântica de todas as páginas.
- CSS3: Para estilização, layout (Flexbox e Grid), responsividade e animações.
- Google Fonts: Para a fonte "Inter", utilizada em todo o site.

---

## Como Executar o Projeto

Como este é um projeto estático, você não precisa de um ambiente de servidor complexo. A maneira mais simples é abrir o arquivo `index.html` diretamente no seu navegador.

Para uma experiência mais próxima de um ambiente de produção (evitando possíveis problemas com requisições de arquivos locais), recomenda-se usar um servidor local simples. Se você tiver Python instalado, pode executar os seguintes comandos no terminal, dentro da pasta do projeto:

```bash
# Navegue até a pasta do projeto
cd /caminho/para/doce-encomenda

# Inicie um servidor local com Python 3
python3 -m http.server
```

Após executar o comando, acesse http://localhost:8000 no seu navegador para ver o site.

---

## Estrutura do Projeto

O projeto está organizado da seguinte forma para garantir clareza e manutenibilidade:

```
/doce-encomenda
│
├── 📄 index.html                      # Página Inicial (Landing Page)
├── 📄 sobre.html                      # Página "Sobre Nós"
├── 📄 catalogo.html                   # Página do catálogo de produtos
├── 📄 monte-seu-bolo.html             # Página de personalização de bolo
├── 📄 carrinho.html                   # Página do carrinho de compras (estático)
├── 📄 checkout.html                   # Página de finalização do pedido
│
├── 📄 produto-*.html                  # 8 páginas de detalhes para produtos específicos
│
├── 📄 admin-login.html                # Página de login da área administrativa
├── 📄 admin-dashboard.html            # Dashboard principal da área admin
├── 📄 admin-produtos.html             # Página de gerenciamento de produtos
├── 📄 admin-opcoes.html               # Página de gerenciamento de opções de personalização
│
├── 📂 css/
│   └── 📄 style.css                   # Arquivo de estilos principal
│
├── 📂 assets/
│   └── 🖼️ *.jpg                       # Imagens dos bolos e outros recursos visuais
│
└── 📄 README.md                       # Este arquivo
```

---

## Visão Geral das Páginas

O projeto contém um total de 18 páginas HTML que cobrem o fluxo completo do usuário e a simulação da área administrativa.

### Páginas do Cliente

| Arquivo | Descrição |
| :--- | :--- |
| `index.html` | A página inicial que apresenta o negócioo e direciona para o catálogo ou para a personalização. |
| `catalogo.html` | Exibe todos os modelos de bolos e um link para a página "Monte Seu Bolo". |
| `produto-*.html` | 8 páginas de detalhes, uma para cada bolo do catálogo (ex: `produto-chocolate-classico.html`). |
| `monte-seu-bolo.html` | Formulário completo para o cliente personalizar um bolo do zero, escolhendo todas as opções. |
| `carrinho.html` | Simula um carrinho de compras, exibindo os itens adicionados (conteúdo estático). |
| `checkout.html` | Formulário final para o cliente inserir seus dados de contato e entrega. |
| `sobre.html` | Página com informações sobre a história e os valores do negócio. |

### Páginas da Área Administrativa

| Arquivo | Descrição |
| :--- | :--- |
| `admin-login.html` | Página de login para acessar o painel de controle. Inclui credenciais de exemplo. |
| `admin-dashboard.html`| Painel principal que simula a visualização de pedidos recentes e navegação para outras seções. |
| `admin-produtos.html` | Simula a listagem e o gerenciamento de produtos cadastrados no catálogo. |
| `admin-opcoes.html` | Simula a gestão das opções de personalização (sabores, recheios, etc.). |

---

## ⚙️ Customização

Você pode facilmente personalizar as principais informações do site editando os arquivos HTML e CSS.

### 1. Modificar Cores e Estilos

Todas as cores, fontes e variáveis de design estão centralizadas no início do arquivo `css/style.css`, dentro do seletor `:root`.

```css
:root {
  --background: #f8f0f5;
  --foreground: #3d2540;
  --primary: #a855f7;
  --secondary: #f8d4e6;
  /* ... e outras variáveis ... */
}
```

Basta alterar os valores hexadecimais para aplicar um novo tema de cores a todo o site.

### 2. Adicionar Novos Produtos

Para adicionar um novo bolo ao catálogo:

1.  Adicione a imagem do novo bolo na pasta `/assets`.
2.  Crie uma nova página `produto-novo-bolo.html` (copiando a estrutura de uma existente).
3.  No arquivo `catalogo.html`, adicione um novo "product-card" apontando para a nova página e imagem.

### 3. Atualizar Informações do Negócio

As informações de contato, endereço e horário de funcionamento estão localizadas no rodapé (`<footer>`), que se repete em quase todas as páginas. Utilize a função "Buscar e Substituir" do seu editor de código para atualizar essas informações em todos os arquivos de uma só vez.

---

## Deploy (Publicação)

Por ser um site estático, você pode publicá-lo facilmente em diversas plataformas, muitas delas gratuitas:

- GitHub Pages: Faça o upload do projeto para um repositório no GitHub e ative o GitHub Pages nas configurações.
- Netlify: Conecte seu repositório do GitHub à Netlify para deploy contínuo e automático a cada `push`.
- Vercel: Similar à Netlify, oferece uma excelente plataforma para hospedagem de sites estáticos.
- Servidor Web Tradicional: Faça o upload dos arquivos para qualquer servidor que suporte hospedagem de sites (Apache, Nginx, etc.).

---

## 📄 Licença

Este projeto é de código aberto e foi criado como trabalho avaliativo para fins educacionais, demonstrando conceitos de desenvolvimento web front-end, design responsivo e experiência do usuário. Está disponível sob a licença MIT.
  
Versão: 1.0.0  
Data: Outubro de 2025

