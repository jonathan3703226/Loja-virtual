# NexTech E-commerce Cart 🛒

<div align="center">
  <img src="https://img.shields.io/badge/HTML5-SEMÂNTICO-E34F26?style=for-the-badge&logo=html5&logoColor=white" alt="HTML5" />
  <img src="https://img.shields.io/badge/CSS3-RESPONSIVO-1572B6?style=for-the-badge&logo=css3&logoColor=white" alt="CSS3" />
  <img src="https://img.shields.io/badge/JavaScript-VANILLA_ES6-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black" alt="JavaScript" />
  <img src="https://img.shields.io/badge/LocalStorage-ESTADO_LOCAL__STORAGE-brightgreen?style=for-the-badge" alt="LocalStorage" />
  <img src="https://img.shields.io/badge/Status-Conclu%C3%ADdo-success?style=for-the-badge" alt="Status" />
</div>

E-commerce responsivo desenvolvido para simular a experiência de uma loja de tecnologia. O foco arquitetural do projeto foi a construção de um carrinho de compras funcional, consumo de dados assíncrono e manipulação dinâmica do DOM utilizando exclusivamente JavaScript puro (Vanilla JS), sem frameworks.

> Uma aplicação front-end focada em simular a interatividade de um carrinho de compras avançado, culminando em uma etapa simplificada de checkout, construída exclusivamente com Vanilla JavaScript, HTML5 e CSS3.

🔗 **[Acesse a aplicação em produção aqui](https://jonathan3703226.github.io/ecommerce-cart/)**


## 🚀 O Projeto

O NexTech é um estudo de caso focado no desenvolvimento de regras de negócio no lado do cliente (Client-side) sem o uso de frameworks modernos. O objetivo principal é demonstrar domínio na manipulação dinâmica do DOM, gerenciamento de estado do carrinho e na criação de interfaces responsivas e acessíveis.

**Diferencial de Portfólio (Refatoração e Arquitetura):**
Este repositório serve como um laboratório de refatoração. A base inicial do projeto foi gerada de forma monolítica por Inteligência Artificial (disponível na branch `v1-ai-generated`). O meu trabalho consistiu em atuar como Arquiteto de Software para reescrever, otimizar e decompor a aplicação. Apliquei princípios de Orientação a Objetos, Clean Code, separação clara de responsabilidades e melhorias substanciais de UX/UI.

## ✨ Funcionalidades (Features)

*   **Catálogo Dinâmico:** Consumo assíncrono (Fetch API) dos dados dos produtos a partir de um arquivo `produtos.json`.
*   **Carrinho Persistente:** Gerenciamento de estado que mantém os itens adicionados salvos no navegador do usuário utilizando `localStorage`, evitando perda de dados no recarregamento da página.
*   **UX/UI Avançada:**
    *   Galeria de mídia mista (fotos e vídeos) com suporte a *autoplay* inteligente usando `IntersectionObserver`.
    *   Cursor customizado com efeito de cor reversa (`mix-blend-mode`) para interação imersiva com vídeos.
    *   Efeito de lente de aumento (Zoom) nas imagens dos produtos, calculado dinamicamente com base nas coordenadas do cursor.
*   **Simulação de Checkout:** Modal interativo focado no aspecto financeiro (sem autenticação/endereço), realizando cálculo matemático em tempo real de subtotais, aplicação de descontos dinâmicos baseados na forma de pagamento e exibição de um recibo formatado.
*   **Feedback Visual Integrado:** Substituição de `alerts` e `prompts` nativos do navegador por componentes customizados de notificação (*Toasts*) e janelas modais.

## 🛠️ Tecnologias Utilizadas (Stack)

*   **HTML5:** Estruturação lógica com hierarquia correta de headings e uso de tags semânticas (`<header>`, `<main>`, `<article>`).
*   **CSS3:** Layouts construídos com Flexbox, padronização visual através de CSS Custom Properties (Variáveis) e Design 100% Responsivo adaptado via Media Queries.
*   **JavaScript (ES6+):**
    *   Arquitetura Orientada a Objetos com a classe `TechStore` para isolamento de escopo.
    *   Uso de Promises e `Async/Await` para requisições.
    *   Delegação de eventos globais (Event Delegation) para maior performance na manipulação do DOM.

## ⚙️ Como Executar Localmente

Por realizar requisições assíncronas (`fetch()`) para carregar o arquivo JSON, é necessário rodar o projeto através de um servidor HTTP local para evitar bloqueios de política de CORS do navegador.

1. Clone este repositório:

   ```bash
   git clone https://github.com/jonathan3703226/ecommerce-cart.git
   
2. Abra a pasta do projeto na sua IDE de preferência (ex: VS Code).

3. Inicie um servidor local. Recomendamos a extensão Live Server do VS Code (porta padrão 5500).

4. O navegador abrirá automaticamente a aplicação.


 Conecte-se comigo no 🔗 **[LinkedIn](https://www.linkedin.com/in/jonathan-oliveira-ads/)**

