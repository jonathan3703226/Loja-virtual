// Dados simulados
const produtos = [
    { id: 1, nome: "Fone de Ouvido Bluetooth", preco: 250.00, desc: "Fone over-ear com cancelamento de ruído ativo, bateria de 40 horas de duração e conexão Bluetooth 5.0. Ideal para trabalho e viagens." },
    { id: 2, nome: "Notebook 8GB RAM 512GB SSD", preco: 3500.00, desc: "Processador de última geração, tela Full HD antirreflexo de 15.6 polegadas. Perfeito para estudos, programação e tarefas corporativas." },
    { id: 3, nome: "Smart TV 55 polegadas 4K", preco: 2800.00, desc: "Sistema operacional inteligente, suporte a comandos de voz, bordas ultrafinas e tecnologia HDR para cores mais vivas e contraste profundo." },
    { id: 4, nome: "Caixa de Som Portátil", preco: 650.00, desc: "À prova d'água (IPX7), bateria de 12 horas, graves potentes e pareamento simultâneo com múltiplos dispositivos." },
    { id: 5, nome: "Videogame Última Geração", preco: 2500.00, desc: "Console com SSD ultrarrápido, suporte a 4K e 120Hz. Acompanha um controle com resposta tátil aprimorada." }
];

// Gerenciamento do LocalStorage
function obterCarrinho() {
    const carrinhoSalvo = localStorage.getItem('meuCarrinho');
    return carrinhoSalvo ? JSON.parse(carrinhoSalvo) : {};
}

function salvarCarrinho(carrinho) {
    localStorage.setItem('meuCarrinho', JSON.stringify(carrinho));
    atualizarBadge();
}

function formatarMoeda(valor) {
    return valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

// -----------------------------------------
// LÓGICA DA PÁGINA: INDEX.HTML
// -----------------------------------------
const divProdutos = document.getElementById('produtos-lista');

if (divProdutos) {
    produtos.forEach(produto => {
        divProdutos.innerHTML += `
            <div class="produto-card">
                <div class="produto-topo">
                    <div class="produto-info">
                        <h2>${produto.nome}</h2>
                        <p class="produto-preco">${formatarMoeda(produto.preco)}</p>
                    </div>
                    <button class="btn-add" onclick="adicionarAoCarrinho(${produto.id})">Adicionar</button>
                </div>
                
                <div class="produto-desc-area">
                    <button class="btn-expandir" onclick="alternarDescricao(${produto.id})">Ler descrição ▼</button>
                    <div id="desc-${produto.id}" class="desc-conteudo">
                        <p>${produto.desc}</p>
                    </div>
                </div>
            </div>
        `;
    });
}

// Função de expansão (Acordeão) - Mostra domínio de manipulação de classes JS
function alternarDescricao(id) {
    const elementoDesc = document.getElementById(`desc-${id}`);
    elementoDesc.classList.toggle('aberto');
}

function adicionarAoCarrinho(id) {
    const carrinho = obterCarrinho();
    carrinho[id] = (carrinho[id] || 0) + 1;
    salvarCarrinho(carrinho);
    
    // Mostra notificação
    const toast = document.getElementById('toast');
    toast.classList.add('show');
    setTimeout(() => toast.classList.remove('show'), 2000);
}

// -----------------------------------------
// LÓGICA DA PÁGINA: CARRINHO.HTML
// -----------------------------------------
const divCarrinho = document.getElementById('carrinho-lista');

if (divCarrinho) {
    renderizarCarrinho();
}

function renderizarCarrinho() {
    const carrinho = obterCarrinho();
    divCarrinho.innerHTML = '';
    let total = 0;
    
    const idsNoCarrinho = Object.keys(carrinho);
    
    if (idsNoCarrinho.length === 0) {
        divCarrinho.innerHTML = '<p>Seu carrinho está vazio.</p>';
        document.getElementById('total-valor').innerText = formatarMoeda(0);
        return;
    }

    idsNoCarrinho.forEach(id => {
        const qtd = carrinho[id];
        const produto = produtos.find(p => p.id == id);
        total += produto.preco * qtd;

        divCarrinho.innerHTML += `
            <div class="item-carrinho">
                <div>
                    <strong>${produto.nome}</strong><br>
                    ${formatarMoeda(produto.preco)}
                </div>
                <div class="item-controles">
                    <button class="btn-qtd" onclick="mudarQtd(${id}, -1)">-</button>
                    <span>${qtd}</span>
                    <button class="btn-qtd" onclick="mudarQtd(${id}, 1)">+</button>
                </div>
            </div>
        `;
    });

    document.getElementById('total-valor').innerText = formatarMoeda(total);
}

function mudarQtd(id, delta) {
    const carrinho = obterCarrinho();
    if (carrinho[id] + delta > 0) {
        carrinho[id] += delta;
    } else {
        delete carrinho[id];
    }
    salvarCarrinho(carrinho);
    renderizarCarrinho(); // Atualiza a tela imediatamente
}

function limparCarrinho() {
    localStorage.removeItem('meuCarrinho');
    alert("Compra finalizada com sucesso! Seu carrinho foi esvaziado.");
    window.location.href = "index.html";
}

// -----------------------------------------
// COMPARTILHADO EM AMBAS AS PÁGINAS
// -----------------------------------------
function atualizarBadge() {
    const badge = document.getElementById('cart-badge');
    if (badge) {
        const carrinho = obterCarrinho();
        const totalItens = Object.values(carrinho).reduce((acc, curr) => acc + curr, 0);
        badge.innerText = totalItens;
    }
}

// Atualiza a bolinha do carrinho assim que qualquer página carrega
atualizarBadge();