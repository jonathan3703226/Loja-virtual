# NexTech E-commerce Cart (Vanilla JS/HTML/CSS)

![HTML5](https://img.shields.io/badge/HTML5-W3C_VALIDADO-brightgreen?style=for-the-badge&logo=html5)
![CSS3](https://img.shields.io/badge/CSS3-W3C_VALIDADO-brightgreen?style=for-the-badge&logo=css3)
![JAVASCRIPT](https://img.shields.io/badge/JAVASCRIPT-ZERO_DEPENDENCIES-brightgreen?style=for-the-badge&logo=javascript)

E-commerce responsivo desenvolvido para simular a experiência de uma loja de tecnologia. O foco arquitetural do projeto foi a construção de um carrinho de compras funcional, consumo de dados assíncrono e manipulação dinâmica do DOM utilizando exclusivamente JavaScript puro (Vanilla JS), sem frameworks.

[Acesse a aplicação em produção aqui](https://jonathan3703226.github.io/ecommerce-cart-js-html-css/)

## Arquitetura e Interatividade (Vanilla JS)

Comportamentos de e-commerce gerenciados integralmente no lado do cliente, utilizando sintaxe moderna de JavaScript e APIs nativas do navegador. As implementações incluem:

* **Carrinho Persistente:** Gerenciamento de estado e armazenamento de itens no navegador do usuário via `localStorage`[cite: 2].
* **Consumo Dinâmico (Fetch API):** Carregamento assíncrono do catálogo de produtos a partir de um arquivo `produtos.json`[cite: 1, 2].
* **Manipulação do DOM:** Injeção dinâmica de cards de produtos, modais de detalhes e atualização em tempo real dos valores do carrinho[cite: 2].
* **Interatividade Multimídia:** Efeito de zoom nativo em imagens por coordenadas do mouse e integração de vídeos na galeria com cursor customizado usando efeito de cor reversa (`mix-blend-mode`)[cite: 2, 3].
* **Checkout Simulado:** Modal de finalização de compra com cálculo matemático de totais, exibição em formato de recibo e descontos dinâmicos baseados na forma de pagamento selecionada[cite: 2].

## Stack Tecnológico

* **HTML5:** Foco em estruturação semântica[cite: 4].
* **CSS3:** Flexbox, Custom Properties (variáveis CSS), Media Queries e sobreposição de elementos (z-index, modais e tooltips)[cite: 3].
* **JavaScript (ES6+):** Classes (`class TechStore`), Async/Await, tratamento de erros, Array Methods (`map`, `forEach`, `find`) e Event Listeners globais[cite: 2].

## 🛠️ Qualidade do Código e Semântica

Para garantir as melhores práticas de desenvolvimento web e semântica estrutural, o código deste projeto foca em:

* **HTML5:** Estruturação lógica com correta hierarquia de headings e utilização de tags semânticas como `<header>`, `<main>` e `<article>` para a renderização individual dos produtos[cite: 4].
* **CSS3:** Modularização visual baseada em variáveis (`:root`) para padronização de cores e espaçamentos, garantindo um design responsivo sem repetição excessiva de regras[cite: 3].
* **JavaScript:** Arquitetura orientada a objetos (POO), garantindo separação de responsabilidades (renderização, cálculo matemático, controle de UI) dentro de um único escopo isolado, evitando poluição do escopo global[cite: 2].

## Estrutura do Projeto

* **Header / Carrinho:** Barra de navegação fixa com badge de notificação dinâmico e dropdown com a listagem de itens adicionados[cite: 4].
* **Vitrine (Product List):** Layout em formato de listagem detalhada renderizando os dados consumidos do arquivo JSON[cite: 2, 4].
* **Galeria Interativa:** Carrossel vertical contendo miniaturas de fotos e vídeos para cada produto[cite: 2, 3].
* **Modais Informativos:** Telas modais reaproveitáveis que injetam a ficha técnica completa ou os detalhes do produto sob demanda[cite: 2].
* **Resumo de Compra:** Tela final de checkout exibindo recibo em tabela e simulação de descontos[cite: 2].

## Execução Local

Por consumir dados de um arquivo JSON externo via `fetch()`, o projeto exige um servidor HTTP local para contornar a política de CORS dos navegadores[cite: 2].

1. Clone o repositório: `git clone [https://github.com/jonathan3703226/ecommerce-cart-js-html-css.git](https://github.com/jonathan3703226/ecommerce-cart-js-html-css.git)`
2. Abra a pasta do projeto em seu editor de código (como o VS Code).
3. Utilize uma extensão como o **Live Server** e inicie o servidor (geralmente na porta `5500`) para executar a aplicação no navegador.