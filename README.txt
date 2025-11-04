================================================================================
                        DOCE ENCOMENDA - SISTEMA WEB
================================================================================

NOME DO SISTEMA:
    Doce Encomenda - Plataforma Web para Encomendas de Bolos Personalizados

DISCENTE E MATRÍCULA:
    Rosivânia da Silva Viana
    Matrícula: 20240065375

================================================================================
                        INSTRUÇÕES DE NAVEGAÇÃO
================================================================================

COMO EXECUTAR O PROJETO:

1. MÉTODO SIMPLES:
   - Abra o arquivo "index.html" diretamente no seu navegador
   - Este é o ponto de entrada principal do sistema

2. MÉTODO RECOMENDADO (Servidor Local):
   - Abra o terminal/prompt de comando na pasta do projeto
   - Execute: python3 -m http.server
   - Acesse no navegador: http://localhost:8000
   - Este método evita problemas com carregamento de recursos

ARQUIVO INICIAL:
    index.html (Página Inicial / Landing Page)

================================================================================
                        PÁGINAS IMPLEMENTADAS
================================================================================

ÁREA DO CLIENTE (13 páginas):

1.  index.html
    - Página inicial com apresentação do sistema e chamadas para ação

2.  catalogo.html
    - Catálogo completo com modelos de bolos e acesso ao personalizador

3.  monte-seu-bolo.html
    - Página de personalização completa de bolos (Monte Seu Bolo)

4.  carrinho.html
    - Carrinho de seleção com itens adicionados (exemplo estático)

5.  checkout.html
    - Finalização de pedido com formulário de dados para preenchimento do cliente

6.  sobre.html
    - Página "Sobre Nós" com informações do negócio

7.  produto-chocolate-classico.html
    - Página de detalhes do Bolo Chocolate Clássico

8.  produto-morango.html
    - Página de detalhes do Bolo Morango Delicioso

9.  produto-red-velvet.html
    - Página de detalhes do Bolo Red Velvet

10. produto-aniversario-personalizado.html
    - Página de detalhes do Bolo Aniversário Personalizado

11. produto-aniversario.html
    - Página de detalhes do Bolo de Aniversário

12. produto-casamento.html
    - Página de detalhes do Bolo de Casamento

13. produto-unicornio.html
    - Página de detalhes do Bolo Unicórnio

14. produto-3-andares-rosa.html
    - Página de detalhes do Bolo 3 Andares Rosa

ÁREA ADMINISTRATIVA (4 páginas):

15. admin-login.html
    - Página de login para acesso à área administrativa
    - Credenciais de teste: usuário "admin" / senha "doce123"

16. admin-dashboard.html
    - Dashboard principal com visualização de pedidos recentes

17. admin-produtos.html
    - Página de gerenciamento de produtos do catálogo

18. admin-opcoes.html
    - Página de gerenciamento de opções de personalização

TOTAL: 18 páginas HTML

================================================================================
                        ESTRUTURA DE ARQUIVOS
================================================================================

/doce-encomenda
│
├── index.html                      (Página inicial)
├── sobre.html                      (Sobre a confeitaria)
├── catalogo.html                   (Catálogo de produtos)
├── monte-seu-bolo.html             (Personalizador)
├── carrinho.html                   (Carrinho de compras)
├── checkout.html                   (Finalização)
├── produto-*.html                  (8 páginas de produtos)
├── admin-login.html                (Login administrativo)
├── admin-dashboard.html            (Dashboard admin)
├── admin-produtos.html             (Gestão de produtos)
├── admin-opcoes.html               (Gestão de opções)
│
├── css/
│   └── style.css                   (Estilos globais)
│
├── assets/
│   └── *.jpg                       (9 imagens de bolos)
│
├── README.md                       (Documentação completa)
└── README.txt                      (Este arquivo)

================================================================================
                        OBSERVAÇÕES RELEVANTES
================================================================================

TECNOLOGIAS UTILIZADAS:
    - HTML5 (estruturação semântica)
    - CSS3 (estilização, responsividade, animações)
    - Google Fonts (tipografia Inter)
    - Sem JavaScript ou frameworks externos

CARACTERÍSTICAS PRINCIPAIS:
    - Design totalmente responsivo (mobile, tablet, desktop)
    - Paleta de cores moderna com gradientes roxos e rosas
    - Integração com WhatsApp para envio de pedidos
    - Formulários funcionais de personalização
    - Área administrativa estática (protótipo visual)
    - Código limpo e bem organizado

FUNCIONALIDADES DO SISTEMA:
    - Visualização de catálogo de bolos
    - Personalização completa de bolos (tamanho, sabor, recheio, etc.)
    - Carrinho de seleção de produtos
    - Finalização de pedido com dados do cliente
    - Painel administrativo

LIMITAÇÕES DESSE PROTÓTIPO ESTÁTICO:
    - Não possui backend ou banco de dados
    - Carrinho e checkout são exemplos estáticos
    - Área administrativa é apenas visual (sem funcionalidades reais)
    - Pedidos são enviados via WhatsApp (não há processamento interno)
    - Não há autenticação real de usuários

CUSTOMIZAÇÃO:
   - Cores do tema: Editar variáveis CSS em css/style.css (seção :root)
    - Informações do Negócio: Buscar e substituir no rodapé de todas as páginas

NAVEGAÇÃO RECOMENDADA PARA TESTE:
    1. Comece em index.html (página inicial)
    2. Clique em "Ver Catálogo" para acessar catalogo.html
    3. Explore um produto clicando em "Personalizar"
    4. Teste o "Monte Seu Bolo" em monte-seu-bolo.html
    5. Visualize o carrinho em carrinho.html
    6. Finalize em checkout.html
    7. Acesse a área admin via admin-login.html

CONTEXTO ACADÊMICO:
    Este projeto foi desenvolvido como trabalho avaliativo para disciplina
    acadêmica, demonstrando conceitos de desenvolvimento web front-end,
    design responsivo, experiência do usuário e boas práticas de código.

LICENÇA:
    MIT License - Código aberto para uso educacional e comercial

Data de Desenvolvimento: Outubro de 2025
Versão: 1.0.0

================================================================================
                        FIM DO DOCUMENTO
================================================================================

