// 1. BANCO DE DADOS REALISTA
const produtos = [
    { 
        id: 1, 
        nome: "Fone de Ouvido Bluetooth JBL Tune 520BT Preto - Bateria para até 57 horas", 
        preco: 250.90, 
        imagem: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&q=80",
        estrelas: "★★★★★", avaliacoes: 450, freteGratis: true
    },
    { 
        id: 2, 
        nome: "Notebook Gamer Acer Nitro 5 Intel Core i5 8GB RAM 512GB SSD 15.6' Win 11", 
        preco: 3500.00, 
        imagem: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400&q=80",
        estrelas: "★★★★☆", avaliacoes: 120, freteGratis: true
    },
    { 
        id: 3, 
        nome: "Smart TV 55 polegadas Samsung 4K Crystal UHD CU8000, Alexa built-in", 
        preco: 2800.00, 
        imagem: "https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=400&q=80",
        estrelas: "★★★★★", avaliacoes: 890, freteGratis: true
    },
    { 
        id: 4, 
        nome: "Caixa De Som Portátil Jbl Charge 5 Bluetooth À Prova D'água - Preta", 
        preco: 650.00, 
        imagem: "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=400&q=80",
        estrelas: "★★★★★", avaliacoes: 300, freteGratis: false
    },
    { 
        id: 5, 
        nome: "Console PlayStation 5 (PS5) com Leitor de Disco + Controle DualSense", 
        preco: 4200.00, 
        imagem: "https://images.unsplash.com/photo-1486401899868-0e435ed85128?w=400&q=80",
        estrelas: "★★★★★", avaliacoes: 2150, freteGratis: true
    }
];

// 2. ESTADO DO CARRINHO
let carrinho = {}; // Começa vazio. Exemplo de como ficará: { '1': 2, '3': 1 }

// 3. RENDERIZAR OS PRODUTOS
function renderizarProdutos() {
    const container = document.getElementById('produtos-container');
    container.innerHTML = '';

    produtos.forEach(produto => {
        // Operador ternário para mostrar ou não o Frete Grátis
        const tagFrete = produto.freteGratis ? `<p class="frete-gratis">⚡ Frete Grátis</p>` : `<p style="height: 25px;"></p>`;

        container.innerHTML += `
            <div class="produto-card">
                <img src="${produto.imagem}" alt="Imagem do produto" class="produto-img">
                <div class="produto-info">
                    <p class="produto-nome" title="${produto.nome}">${produto.nome}</p>
                    <p class="avaliacoes">${produto.estrelas} (${produto.avaliacoes})</p>
                    <p class="produto-preco">${formatarMoeda(produto.preco)}</p>
                    ${tagFrete}
                </div>
                <div class="botoes-acao">
                    <button class="btn-comprar" onclick="comprarAgora(${produto.id})">Comprar agora</button>
                    <button class="btn-adicionar" onclick="adicionarAoCarrinho(${produto.id})">Adicionar ao carrinho</button>
                </div>
            </div>
        `;
    });
}

function formatarMoeda(valor) {
    return valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

// 4. LÓGICA DE CARRINHO E COMPRA
function adicionarAoCarrinho(idProduto) {
    // Se o produto já existe no carrinho, soma 1. Se não, cria com valor 1.
    if (carrinho[idProduto]) {
        carrinho[idProduto] += 1;
    } else {
        carrinho[idProduto] = 1;
    }
    atualizarBadge();
    mostrarToast();
}

function comprarAgora(idProduto) {
    adicionarAoCarrinho(idProduto);
    abrirCarrinho(); // Redireciona imediatamente para o carrinho/pagamento
}

function atualizarBadge() {
    // Soma todas as quantidades dentro do objeto carrinho
    const totalItens = Object.values(carrinho).reduce((acc, qtd) => acc + qtd, 0);
    document.getElementById('cart-badge').innerText = totalItens;
}

// 5. ANIMAÇÃO DO TOAST (Avisozinho verde na tela)
function mostrarToast() {
    const toast = document.getElementById('toast');
    toast.classList.add('show');
    setTimeout(() => {
        toast.classList.remove('show');
    }, 2500); // Some após 2.5 segundos
}

// 6. GESTÃO DO MODAL E CHECKOUT
function abrirModal(html) {
    document.getElementById('modal-body').innerHTML = html;
    document.getElementById('modal-overlay').classList.add('active');
}

function fecharModal() {
    document.getElementById('modal-overlay').classList.remove('active');
}

function abrirCarrinho() {
    const totalItens = Object.values(carrinho).reduce((acc, qtd) => acc + qtd, 0);

    if (totalItens === 0) {
        abrirModal(`
            <div class="modal-header"><h2>Seu carrinho está vazio</h2><button class="btn-close" onclick="fecharModal()">&times;</button></div>
            <p>Descubra as melhores ofertas na página inicial!</p>
        `);
        return;
    }

    let subtotal = 0;
    let htmlItens = '';

    // Passa pelos IDs no carrinho para gerar a lista
    for (const id in carrinho) {
        const quantidade = carrinho[id];
        // Procura o produto original pelo ID
        const produto = produtos.find(p => p.id == id);
        subtotal += produto.preco * quantidade;

        htmlItens += `
            <div class="item-carrinho">
                <div class="item-info">
                    <strong>${produto.nome.substring(0, 25)}...</strong><br>
                    ${formatarMoeda(produto.preco)}
                </div>
                <div class="item-controles">
                    <button class="btn-qtd" onclick="alterarQtdCarrinho(${id}, -1)">-</button>
                    <span>${quantidade}</span>
                    <button class="btn-qtd" onclick="alterarQtdCarrinho(${id}, 1)">+</button>
                </div>
            </div>
        `;
    }

    abrirModal(`
        <div class="modal-header">
            <h2>Carrinho de Compras</h2>
            <button class="btn-close" onclick="fecharModal()">&times;</button>
        </div>
        ${htmlItens}
        <div style="margin-top: 20px; font-size: 1.2rem; display: flex; justify-content: space-between;">
            <strong>Total:</strong> <strong>${formatarMoeda(subtotal)}</strong>
        </div>
        <button onclick="irParaPagamento()" style="width:100%; background:var(--primary-color); color:white; padding:15px; border:none; border-radius:8px; margin-top:15px; font-weight:bold; cursor:pointer;">Continuar Compra</button>
    `);
}

function alterarQtdCarrinho(id, delta) {
    if (carrinho[id] + delta > 0) {
        carrinho[id] += delta;
    } else {
        delete carrinho[id]; // Se chegar a 0, remove do carrinho
    }
    atualizarBadge();
    abrirCarrinho(); // Recarrega a tela do carrinho ao vivo
}

function irParaPagamento() {
    abrirModal(`
        <div class="modal-header">
            <h2>Pagamento</h2>
            <button class="btn-close" onclick="fecharModal()">&times;</button>
        </div>
        <p style="margin-bottom: 10px;">Como você prefere pagar?</p>
        <select id="forma-pag" style="width:100%; padding: 10px; border-radius:6px; border: 1px solid #ccc; margin-bottom: 20px;">
            <option value="pix">PIX (Aprovação imediata)</option>
            <option value="cartao">Cartão de Crédito (Até 12x)</option>
            <option value="boleto">Boleto Bancário</option>
        </select>
        <button onclick="finalizarCompraReal()" style="width:100%; background:var(--success-color); color:white; padding:15px; border:none; border-radius:8px; font-weight:bold; cursor:pointer;">Confirmar Pedido</button>
        <button onclick="abrirCarrinho()" style="width:100%; background:transparent; color:var(--primary-color); padding:10px; border:none; margin-top:10px; cursor:pointer;">Voltar ao Carrinho</button>
    `);
}

function finalizarCompraReal() {
    carrinho = {}; // Zera tudo
    atualizarBadge();
    abrirModal(`
        <div class="modal-header">
            <h2 style="color: var(--success-color)">Pedido Confirmado! 🎉</h2>
            <button class="btn-close" onclick="fecharModal()">&times;</button>
        </div>
        <p>Sua compra foi aprovada e já estamos separando o seu pacote.</p>
        <p style="margin-top: 10px; color: var(--text-muted);">Você receberá o código de rastreio por e-mail.</p>
    `);
}

// Inicia a aplicação
renderizarProdutos();