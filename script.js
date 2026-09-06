class TechStore {
    constructor() {
        this.products = [];
        this.inputQtys = {};

        const savedCart = localStorage.getItem('nextech_cart');
        this.cart = savedCart ? JSON.parse(savedCart) : {};

        this.init();
    }

    async init() {
        try {
            const response = await fetch('produtos.json');
            this.products = await response.json();

            this.products.forEach(p => this.inputQtys[p.id] = 1);
            this.renderProducts();
            this.updateCartDropdown();
            this.setupGlobalEventListeners();
        } catch (error) {
            console.error("Erro ao carregar os produtos:", error);
            document.getElementById('product-list').innerHTML = '<p>Erro ao carregar os produtos. Verifique se você está rodando um servidor local.</p>';
        }
    }

    saveCart() {
        localStorage.setItem('nextech_cart', JSON.stringify(this.cart));
    }

    formatBRL(value) {
        return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
    }

    setupGlobalEventListeners() {
        document.getElementById('cart-toggle-btn').addEventListener('click', () => this.toggleCart());
        document.getElementById('btn-checkout').addEventListener('click', () => this.processCheckout());

        document.addEventListener('click', (e) => {
            const cartContainer = document.getElementById('cart-container');
            const cartDropdown = document.getElementById('cart-dropdown');
            // e.composedPath() verifica a origem do clique mesmo se o elemento foi removido do HTML (evita fechar o carrinho ao renderizar)
            if (!e.composedPath().includes(cartContainer)) {
                cartDropdown.classList.add('hidden');
            }
        });

        document.getElementById('modal-overlay').addEventListener('click', (e) => {
            if (e.target.id === 'modal-overlay') this.closeModal();
        });

        // Delegação de Eventos: Lista de Produtos
        document.getElementById('product-list').addEventListener('click', (e) => {
            const btn = e.target.closest('[data-action]');
            if (!btn) return;

            const action = btn.dataset.action;
            const id = parseInt(btn.dataset.id);

            if (action === 'scroll-up') this.scrollCarousel(id, -1);
            if (action === 'scroll-down') this.scrollCarousel(id, 1);
            if (action === 'qty-dec') this.updateInputQty(id, -1);
            if (action === 'qty-inc') this.updateInputQty(id, 1);
            if (action === 'add-cart') this.addToCart(id);
            if (action === 'set-media') {
                const index = parseInt(btn.dataset.index);
                this.setMainMedia(id, index, btn);
            }
        });

        // Delegação de Eventos: Ações dentro do Carrinho (+, -)
        document.getElementById('cart-dropdown').addEventListener('click', (e) => {
            const btn = e.target.closest('[data-action]');
            if (!btn) return;

            const action = btn.dataset.action;
            const id = parseInt(btn.dataset.id);

            if (action === 'cart-qty-dec') this.updateCartItemQty(id, -1);
            if (action === 'cart-qty-inc') this.updateCartItemQty(id, 1);
        });
    }

    renderProducts() {
        const listElement = document.getElementById('product-list');
        listElement.innerHTML = '';

        this.products.forEach(product => {
            const card = document.createElement('article');
            card.className = 'product-card';

            const thumbsHTML = product.media.map((item, index) => {
                const isVideo = item.type === 'video';
                const imgSrc = isVideo ? item.thumb : item.src;
                return `
                    <div class="${isVideo ? 'thumb-video-icon' : ''}">
                        <img src="${imgSrc}" class="thumb ${index === 0 ? 'active' : ''}" 
                             alt="Miniatura ${index + 1} de ${product.name}"
                             data-action="set-media" data-id="${product.id}" data-index="${index}" tabindex="0">
                    </div>
                `;
            }).join('');

            const firstMedia = product.media[0];
            const mainMediaHTML = `
                <div class="video-badge" aria-hidden="true">▶ Passar o mouse para ver</div>
                <video src="${firstMedia.src}" muted loop id="media-${product.id}" aria-label="Vídeo demonstrativo"></video>
            `;

            card.innerHTML = `
                <div class="product-gallery">
                    <div class="carousel-wrapper-vertical">
                        <button class="carousel-btn up" data-action="scroll-up" data-id="${product.id}" aria-label="Rolar imagens para cima">&#9650;</button>
                        <div class="thumbnails-track-vertical" id="track-${product.id}">
                            ${thumbsHTML}
                        </div>
                        <button class="carousel-btn down" data-action="scroll-down" data-id="${product.id}" aria-label="Rolar imagens para baixo">&#9660;</button>
                    </div>
                    
                    <div class="main-media-container" id="container-${product.id}">
                        ${mainMediaHTML}
                    </div>
                </div>

                <div class="product-info">
                    <h3 class="product-title">${product.name}</h3>
                    <p class="product-desc">${product.description}</p>
                    
                    <div class="product-price-box">
                        <div class="product-price">${this.formatBRL(product.price)}</div>
                    </div>
                    
                    <div class="shopee-qty-row">
                        <span class="lbl" id="lbl-qty-${product.id}">Quantidade</span>
                        <div class="qty-controls">
                            <button class="btn-qty" data-action="qty-dec" data-id="${product.id}" aria-label="Diminuir quantidade de ${product.name}">-</button>
                            <input type="text" class="qty-display" id="input-qty-${product.id}" value="${this.inputQtys[product.id]}" aria-labelledby="lbl-qty-${product.id}" readonly>
                            <button class="btn-qty" data-action="qty-inc" data-id="${product.id}" aria-label="Aumentar quantidade de ${product.name}">+</button>
                        </div>
                    </div>

                    <div class="shopee-action-buttons">
                        <button class="btn-add-cart-shopee" data-action="add-cart" data-id="${product.id}" aria-label="Adicionar ${product.name} ao Carrinho">
                            <svg aria-hidden="true" viewBox="0 0 24 24"><path d="M7 18c-1.1 0-1.99.9-1.99 2S5.9 22 7 22s2-.9 2-2-.9-2-2-2zM1 2v2h2l3.6 7.59-1.35 2.45c-.16.28-.25.61-.25.96 0 1.1.9 2 2 2h12v-2H7.42c-.14 0-.25-.11-.25-.25l.03-.12.9-1.63h7.45c.75 0 1.41-.41 1.75-1.03l3.58-6.49c.08-.14.12-.31.12-.48 0-.55-.45-1-1-1H5.21l-.94-2H1zm16 16c-1.1 0-1.99.9-1.99 2s.89 2 1.99 2 2-.9 2-2-.9-2-2-2z"/></svg>
                            Adicionar ao Carrinho
                        </button>
                    </div>
                </div>
            `;
            listElement.appendChild(card);

            const container = card.querySelector(`#container-${product.id}`);
            container.addEventListener('mouseenter', () => this.handleMediaHover(product.id, true));
            container.addEventListener('mouseleave', () => this.handleMediaHover(product.id, false));
            container.addEventListener('mousemove', (e) => this.zoomImage(e, container, product.id));
        });
    }

    setMainMedia(productId, mediaIndex, thumbElement) {
        const product = this.products.find(p => p.id === productId);
        const media = product.media[mediaIndex];
        const container = document.getElementById(`container-${productId}`);

        if (media.type === 'video') {
            container.innerHTML = `<div class="video-badge" aria-hidden="true">▶ Passar o mouse para ver</div><video src="${media.src}" muted loop id="media-${productId}"></video>`;
        } else {
            container.innerHTML = `<img src="${media.src}" id="media-${productId}" alt="${product.name} em foco">`;
        }

        const track = document.getElementById(`track-${productId}`);
        track.querySelectorAll('.thumb').forEach(t => t.classList.remove('active'));
        thumbElement.classList.add('active');
    }

    handleMediaHover(productId, isHover) {
        const mediaElement = document.getElementById(`media-${productId}`);
        if (mediaElement && mediaElement.tagName === 'VIDEO') {
            isHover ? mediaElement.play() : mediaElement.pause();
        } else if (!isHover && mediaElement && mediaElement.tagName === 'IMG') {
            mediaElement.style.transformOrigin = `center center`;
            mediaElement.style.transform = 'scale(1)';
        }
    }

    zoomImage(e, container, productId) {
        const mediaElement = document.getElementById(`media-${productId}`);
        if (mediaElement && mediaElement.tagName === 'IMG') {
            const { left, top, width, height } = container.getBoundingClientRect();
            const x = ((e.clientX - left) / width) * 100;
            const y = ((e.clientY - top) / height) * 100;
            mediaElement.style.transformOrigin = `${x}% ${y}%`;
            mediaElement.style.transform = 'scale(2.5)';
        }
    }

    scrollCarousel(productId, direction) {
        const track = document.getElementById(`track-${productId}`);
        track.scrollBy({ top: 100 * direction, behavior: 'smooth' });
    }

    updateInputQty(productId, change) {
        const currentQty = this.inputQtys[productId];
        if (currentQty + change >= 1) {
            this.inputQtys[productId] = currentQty + change;
            document.getElementById(`input-qty-${productId}`).value = this.inputQtys[productId];
        }
    }

    addToCart(productId) {
        const qtyToAdd = this.inputQtys[productId];
        this.cart[productId] = (this.cart[productId] || 0) + qtyToAdd;

        this.inputQtys[productId] = 1;
        document.getElementById(`input-qty-${productId}`).value = 1;

        this.saveCart();
        this.updateCartDropdown();

        const p = this.products.find(p => p.id === productId);
        this.showToast(`✅ ${p.name} adicionado ao carrinho!`);
    }

    updateCartItemQty(productId, change) {
        if (this.cart[productId]) {
            const newQty = this.cart[productId] + change;
            if (newQty > 0) {
                this.cart[productId] = newQty;
            } else {
                // Se a quantidade chegar a 0, exclui automaticamente o item
                delete this.cart[productId];
                this.showToast(`🗑️ Item removido do carrinho`);
            }
            this.saveCart();
            this.updateCartDropdown();
        }
    }

    toggleCart() {
        const cartDropdown = document.getElementById('cart-dropdown');
        cartDropdown.classList.toggle('hidden');
    }

    updateCartDropdown() {
        const cartList = document.getElementById('cart-items-list');
        const checkoutArea = document.getElementById('cart-checkout-area');
        const badge = document.getElementById('cart-badge');

        let totalItems = 0;
        let totalPrice = 0;
        cartList.innerHTML = '';

        if (Object.keys(this.cart).length === 0) {
            cartList.innerHTML = '<div class="empty-cart-msg">Seu carrinho de compras está vazio</div>';
            checkoutArea.style.display = 'none';
            badge.textContent = 0;
            return;
        }

        checkoutArea.style.display = 'block';

        for (const [id, qty] of Object.entries(this.cart)) {
            const p = this.products.find(p => p.id === parseInt(id));
            if (!p) continue;

            const subtotal = p.price * qty;
            totalItems += qty;
            totalPrice += subtotal;

            const imgSrc = p.media.find(m => m.type === 'image') ? p.media.find(m => m.type === 'image').src : p.media[0].thumb;

            cartList.innerHTML += `
                <div class="cart-item">
                    <img src="${imgSrc}" alt="Produto ${p.name}">
                    <div class="cart-item-info">
                        <div class="cart-item-title">${p.name}</div>
                        <div class="cart-item-actions">
                            <div class="qty-controls cart-qty-controls">
                                <button class="btn-qty" data-action="cart-qty-dec" data-id="${p.id}" aria-label="Diminuir quantidade">-</button>
                                <input type="text" class="qty-display" value="${qty}" readonly>
                                <button class="btn-qty" data-action="cart-qty-inc" data-id="${p.id}" aria-label="Aumentar quantidade">+</button>
                            </div>
                        </div>
                    </div>
                    <div class="cart-item-price">${this.formatBRL(subtotal)}</div>
                </div>
            `;
        }

        badge.textContent = totalItems;
        document.getElementById('dropdown-total').textContent = this.formatBRL(totalPrice);
    }

    processCheckout() {
        const selectElement = document.getElementById('payment-method-select');
        const paymentCode = parseInt(selectElement.value);

        if (isNaN(paymentCode)) {
            alert("Por favor, selecione uma forma de pagamento no carrinho.");
            return;
        }

        const paymentName = selectElement.options[selectElement.selectedIndex].text.split(' - ')[1].split(' (')[0];
        let totalCompra = 0;
        let receiptRows = '';

        for (const [id, qty] of Object.entries(this.cart)) {
            const p = this.products.find(p => p.id === parseInt(id));
            const subtotal = p.price * qty;
            totalCompra += subtotal;
            receiptRows += `
                <tr>
                    <td><strong>${qty}x</strong> ${p.name.split(',')[0]}</td>
                    <td>${this.formatBRL(p.price)}</td>
                    <td>${this.formatBRL(subtotal)}</td>
                </tr>
            `;
        }

        let desconto = (totalCompra >= 5000 && paymentCode === 1) ? (totalCompra * 0.10) : 0;
        const totalPagar = totalCompra - desconto;

        const summaryHTML = `
            <h2 id="modal-title" style="margin-bottom: 20px; font-weight: 500;">Obrigado pela sua compra!</h2>
            <table class="receipt-table">
                <thead><tr><th>Produto</th><th>Preço Un.</th><th>Subtotal</th></tr></thead>
                <tbody>${receiptRows}</tbody>
            </table>
            
            <div style="background: #fafafa; padding: 20px; border: 1px solid var(--border);">
                <div class="summary-row"><span>Forma de Pagamento:</span><strong>${paymentName}</strong></div>
                <div class="summary-row"><span>Total dos Produtos:</span><span>${this.formatBRL(totalCompra)}</span></div>
                ${desconto > 0 ? `<div class="summary-row" style="color: #00bfa5; font-weight:600;"><span>Desconto (10%):</span><span>- ${this.formatBRL(desconto)}</span></div>` : ''}
                
                <div class="summary-row" style="font-size: 24px; font-weight: 700; color: var(--primary); margin-top: 20px; padding-top: 20px; border-top: 1px solid var(--border);">      <span>Total Pago:</span><span>${this.formatBRL(totalPagar)}</span>
                </div>
            </div>
            <button class="btn-checkout-final" id="btn-finish-modal" style="width: 100%; margin-top: 20px;">Finalizar e Limpar Carrinho</button>
        `;

        document.getElementById('modal-content').innerHTML = summaryHTML;
        document.getElementById('modal-overlay').classList.remove('hidden');
        this.toggleCart();

        document.getElementById('btn-finish-modal').addEventListener('click', () => {
            this.cart = {};
            this.saveCart();
            location.reload();
        });
    }

    closeModal() {
        document.getElementById('modal-overlay').classList.add('hidden');
    }

    showToast(message) {
        const toast = document.getElementById('toast');
        toast.textContent = message;
        toast.classList.remove('hidden');
        setTimeout(() => toast.classList.add('hidden'), 2500);
    }
}

const store = new TechStore();