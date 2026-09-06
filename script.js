// =========================================================
// 1. DADOS EXATOS DO EXERCÍCIO (Com imagens reais do Unsplash)
// =========================================================
const dbProdutos = [
    { id: 1, nome: "Fone de Ouvido", preco: 250.00, img: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&q=80" },
    { id: 2, nome: "Notebook", preco: 3500.00, img: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400&q=80" },
    { id: 3, nome: "Smart TV", preco: 2800.00, img: "https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=400&q=80" },
    { id: 4, nome: "Caixa de Som", preco: 650.00, img: "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=400&q=80" },
    { id: 5, nome: "Videogame", preco: 2500.00, img: "https://images.unsplash.com/photo-1486401899868-0e435ed85128?w=400&q=80" }
];

// =========================================================
// 2. ESTADO REATIVO COM PROXY
// =========================================================
// Inicia o carrinho com quantidade 0 para todos os produtos
const estadoInicialCarrinho = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };

const state = new Proxy({
    cart: { ...estadoInicialCarrinho }
}, {
    set(target, property, value) {
        target[property] = value;
        if (property === 'cart') {
            renderProdutos(); // Atualiza a tela quando a quantidade muda
        }
        return true;
    }
});

// =========================================================
// 3. UTILITÁRIOS
// =========================================================
const formatarMoeda = (valor) => valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

// =========================================================
// 4. RENDERIZAÇÃO DA VITRINE (Componentes)
// =========================================================
const renderProdutos = () => {
    const app = document.getElementById('app');
    
    let html = `<div class="grid-produtos">`;
    
    dbProdutos.forEach(p => {
        const qtd = state.cart[p.id];
        html += `
            <div class="produto-card">
                <img src="${p.img}" alt="${p.nome}" class="produto-img">
                <div class="produto-info">
                    <h2>${p.nome}</h2>
                    <p class="produto-preco">${formatarMoeda(p.preco)}</p>
                    
                    <div class="controle-qtd">
                        <button class="btn-qtd" data-action="mudar-qtd" data-id="${p.id}" data-delta="-1">-</button>
                        <span class="qtd-display">${qtd}</span>
                        <button class="btn-qtd" data-action="mudar-qtd" data-id="${p.id}" data-delta="1">+</button>
                    </div>
                </div>
            </div>
        `;
    });

    html += `</div>
             <div class="area-finalizar">
                <button class="btn-finalizar" data-action="finalizar">Finalizar Compra</button>
             </div>`;
             
    app.innerHTML = html;
};

// =========================================================
// 5. LÓGICA DE NEGÓCIO (Regras do Professor)
// =========================================================
const processarCompra = () => {
    // 1. Verificar se pelo menos um produto foi selecionado
    const totalItens = Object.values(state.cart).reduce((acc, qtd) => acc + qtd, 0);
    
    if (totalItens === 0) {
        alert("Nenhum produto foi selecionado.");
        return;
    }

    // 2. Solicitar e validar a forma de pagamento
    let formaPagamento = "";
    let opcaoValida = false;
    const opcoesNomes = { '1': 'À vista', '2': 'Cartão de débito', '3': 'Cartão de crédito' };

    while (!opcaoValida) {
        formaPagamento = prompt("Informe a forma de pagamento:\n1 – À vista\n2 – Cartão de débito\n3 – Cartão de crédito");
        
        if (formaPagamento === null) return; // Se o usuário cancelar o prompt
        
        if (['1', '2', '3'].includes(formaPagamento)) {
            opcaoValida = true;
        } else {
            alert("Opção inválida! Por favor, digite 1, 2 ou 3.");
        }
    }

    // 3. Calcular valores
    let valorTotal = 0;
    const produtosComprados = [];

    dbProdutos.forEach(p => {
        const qtd = state.cart[p.id];
        if (qtd > 0) {
            const subtotal = p.preco * qtd;
            valorTotal += subtotal;
            produtosComprados.push({
                nome: p.nome,
                qtd: qtd,
                precoUnidade: p.preco,
                subtotal: subtotal
            });
        }
    });

    // 4. Aplicar Regra Promocional (>= 5000 E pagamento à vista (1))
    let valorDesconto = 0;
    if (valorTotal >= 5000 && formaPagamento === '1') {
        valorDesconto = valorTotal * 0.10; // 10% de desconto
    }

    const totalAPagar = valorTotal - valorDesconto;

    // 5. Exibir o Resumo da Compra
    renderResumo(produtosComprados, opcoesNomes[formaPagamento], valorTotal, valorDesconto, totalAPagar);
};

// =========================================================
// 6. RENDERIZAÇÃO DO RESUMO
// =========================================================
const renderResumo = (produtos, pagamento, total, desconto, totalFinal) => {
    const app = document.getElementById('app');
    
    let html = `
        <div class="resumo-container">
            <h2>🧾 Resumo da Compra</h2>
            <table class="tabela-resumo">
                <thead>
                    <tr>
                        <th>Produto</th>
                        <th>Qtd</th>
                        <th>Preço Unit.</th>
                        <th>Subtotal</th>
                    </tr>
                </thead>
                <tbody>
    `;

    produtos.forEach(p => {
        html += `
            <tr>
                <td>${p.nome}</td>
                <td>${p.qtd}</td>
                <td>${formatarMoeda(p.precoUnidade)}</td>
                <td>${formatarMoeda(p.subtotal)}</td>
            </tr>
        `;
    });

    html += `
                </tbody>
            </table>
            
            <div class="totais-box">
                <p><strong>Forma de Pagamento:</strong> ${pagamento}</p>
                <p><strong>Total da Compra:</strong> ${formatarMoeda(total)}</p>
                <p class="desconto"><strong>Desconto aplicado:</strong> - ${formatarMoeda(desconto)}</p>
                <h3 class="total-final">Total a Pagar: ${formatarMoeda(totalFinal)}</h3>
            </div>
            
            <button class="btn-voltar" onclick="location.reload()">Fazer nova compra</button>
        </div>
    `;

    app.innerHTML = html;
};

// =========================================================
// 7. DELEGAÇÃO DE EVENTOS (Cliques)
// =========================================================
document.addEventListener('click', (e) => {
    const btn = e.target.closest('[data-action]');
    if (!btn) return;

    const action = btn.dataset.action;

    if (action === 'mudar-qtd') {
        const id = btn.dataset.id;
        const delta = parseInt(btn.dataset.delta);
        const currentQtd = state.cart[id];
        const novaQtd = currentQtd + delta;

        // O sistema não deverá permitir que a quantidade fique negativa
        if (novaQtd >= 0) {
            state.cart = { ...state.cart, [id]: novaQtd };
        }
    }

    if (action === 'finalizar') {
        processarCompra();
    }
});

// Inicializa a aplicação
renderProdutos();