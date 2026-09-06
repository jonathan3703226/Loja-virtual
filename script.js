// Banco de dados simulado com imagens (utilizando imagens gratuitas do Unsplash)
const produtos = [
    { id: 1, nome: "Fone de Ouvido", preco: 250, imagem: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&q=80" },
    { id: 2, nome: "Notebook", preco: 3500, imagem: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400&q=80" },
    { id: 3, nome: "Smart TV", preco: 2800, imagem: "https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=400&q=80" },
    { id: 4, nome: "Caixa de Som", preco: 650, imagem: "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=400&q=80" },
    { id: 5, nome: "Videogame", preco: 2500, imagem: "https://images.unsplash.com/photo-1486401899868-0e435ed85128?w=400&q=80" }
];

// Estado do carrinho (guarda a quantidade de cada ID)
let carrinho = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };

// Função para renderizar os produtos na tela
function renderizarProdutos() {
    const container = document.getElementById('produtos-container');
    container.innerHTML = '';

    produtos.forEach(produto => {
        container.innerHTML += `
            <div class="produto-card">
                <img src="${produto.imagem}" alt="${produto.nome}" class="produto-img">
                <div class="produto-info">
                    <h3>${produto.nome}</h3>
                    <p class="produto-preco">R$ ${produto.preco.toFixed(2).replace('.', ',')}</p>
                    
                    <div class="controles-qtd">
                        <button class="btn-qtd" onclick="alterarQuantidade(${produto.id}, -1)">-</button>
                        <span class="qtd-display" id="qtd-${produto.id}">${carrinho[produto.id]}</span>
                        <button class="btn-qtd" onclick="alterarQuantidade(${produto.id}, 1)">+</button>
                    </div>
                </div>
            </div>
        `;
    });
}

// Função para aumentar ou diminuir a quantidade
function alterarQuantidade(id, delta) {
    if (carrinho[id] + delta >= 0) {
        carrinho[id] += delta;
        document.getElementById(`qtd-${id}`).innerText = carrinho[id];
        atualizarBadgeCarrinho();
    }
}

// Atualiza o contador de itens no cabeçalho
function atualizarBadgeCarrinho() {
    const totalItens = Object.values(carrinho).reduce((acc, curr) => acc + curr, 0);
    document.getElementById('cart-badge').innerText = totalItens;
}

// Formata valores para o padrão Real (R$)
function formatarMoeda(valor) {
    return `R$ ${valor.toFixed(2).replace('.', ',')}`;
}

// Funções de manipulação do Modal
function abrirModal(htmlContent) {
    const overlay = document.getElementById('modal-overlay');
    const modalBody = document.getElementById('modal-body');
    modalBody.innerHTML = htmlContent;
    overlay.classList.add('active');
}

function fecharModal() {
    document.getElementById('modal-overlay').classList.remove('active');
}

// Fluxo de Checkout (Substitui o alert, o prompt e a injeção na div)
function abrirCheckout() {
    const totalItens = Object.values(carrinho).reduce((acc, curr) => acc + curr, 0);

    // Se o carrinho estiver vazio, mostra um alerta customizado
    if (totalItens === 0) {
        abrirModal(`
            <div class="modal-header">
                <h2>Carrinho Vazio</h2>
                <button class="btn-close" onclick="fecharModal()">&times;</button>
            </div>
            <p>Você precisa adicionar pelo menos um produto ao carrinho antes de finalizar a compra.</p>
        `);
        return;
    }

    let subtotalGeral = 0;
    let resumoHtml = `<div class="modal-header">
                        <h2>Resumo do Pedido</h2>
                        <button class="btn-close" onclick="fecharModal()">&times;</button>
                      </div>`;

    produtos.forEach(produto => {
        const qtd = carrinho[produto.id];
        if (qtd > 0) {
            const subtotalItem = qtd * produto.preco;
            subtotalGeral += subtotalItem;
            resumoHtml += `
                <div class="resumo-item">
                    <span>${qtd}x ${produto.nome}</span>
                    <span>${formatarMoeda(subtotalItem)}</span>
                </div>
            `;
        }
    });

    resumoHtml += `
        <div class="totais">
            <div class="resumo-item">
                <strong>Subtotal:</strong>
                <strong id="modal-subtotal" data-valor="${subtotalGeral}">${formatarMoeda(subtotalGeral)}</strong>
            </div>
            <div class="resumo-item text-success" id="linha-desconto" style="display: none;">
                <strong>Desconto (10% à vista):</strong>
                <strong id="modal-desconto">- R$ 0,00</strong>
            </div>
            <div class="resumo-item" style="font-size: 1.2rem; margin-top: 10px;">
                <strong>Total Final:</strong>
                <strong id="modal-total">${formatarMoeda(subtotalGeral)}</strong>
            </div>
        </div>

        <select id="forma-pagamento" class="select-pagamento" onchange="calcularDesconto()">
            <option value="0">Selecione o pagamento...</option>
            <option value="1">À vista (10% de desconto em compras acima de R$ 5k)</option>
            <option value="2">Cartão de Débito</option>
            <option value="3">Cartão de Crédito</option>
        </select>

        <button class="btn-finalizar" onclick="concluirCompra()">Confirmar Pagamento</button>
    `;

    abrirModal(resumoHtml);
}

// Calcula dinamicamente o desconto no modal com base na seleção
function calcularDesconto() {
    const opcao = document.getElementById('forma-pagamento').value;
    const subtotal = parseFloat(document.getElementById('modal-subtotal').getAttribute('data-valor'));
    
    let desconto = 0;
    
    // Regra: Compras a partir de 5000 pagos à vista (opção 1) recebem 10% de desconto
    if (subtotal >= 5000 && opcao === "1") {
        desconto = subtotal * 0.10;
        document.getElementById('linha-desconto').style.display = 'flex';
        document.getElementById('modal-desconto').innerText = `- ${formatarMoeda(desconto)}`;
    } else {
        document.getElementById('linha-desconto').style.display = 'none';
    }

    const totalFinal = subtotal - desconto;
    document.getElementById('modal-total').innerText = formatarMoeda(totalFinal);
}

// Tela de sucesso final
function concluirCompra() {
    const opcao = document.getElementById('forma-pagamento').value;
    if (opcao === "0") {
        alert("Por favor, selecione uma forma de pagamento para continuar."); // Alert simples de segurança
        return;
    }

    // Zera o carrinho após o sucesso
    carrinho = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
    renderizarProdutos();
    atualizarBadgeCarrinho();

    abrirModal(`
        <div class="modal-header">
            <h2 class="text-success">Compra Realizada! 🎉</h2>
            <button class="btn-close" onclick="fecharModal()">&times;</button>
        </div>
        <p>Obrigado por comprar na TechStore. O seu pedido está sendo processado e logo será enviado.</p>
    `);
}

// Inicia a aplicação renderizando os produtos
renderizarProdutos();