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
            console.error("Erro ao carregar:", error);
            document.getElementById('product-list').innerHTML = '<p>Erro ao carregar produtos.</p>';
        }
    }

    saveCart() { localStorage.setItem('nextech_cart', JSON.stringify(this.cart)); }
    formatBRL(value) { return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value); }

    setupGlobalEventListeners() {
        document.getElementById('cart-toggle-btn').addEventListener('click', () => this.toggleCart());
        document.getElementById('btn-checkout').addEventListener('click', () => this.processCheckout());

        document.addEventListener('click', (e) => {
            const cartContainer = document.getElementById('cart-container');
            const cartDropdown = document.getElementById('cart-dropdown');
            if (!e.composedPath().includes(cartContainer)) {
                cartDropdown.classList.add('hidden');
            }
        });

        document.getElementById('modal-overlay').addEventListener('click', (e) => {
            if (e.target.id === 'modal-overlay') this.closeModal();
        });

        document.getElementById('product-list').addEventListener('click', (e) => {
            const btn = e.target.closest('[data-action]');
            if (!btn) return;
            const action = btn.dataset.action;
            const id = parseInt(btn.dataset.id);

            if (action === 'qty-dec') this.updateInputQty(id, -1);
            if (action === 'qty-inc') this.updateInputQty(id, 1);
            if (action === 'add-cart') this.addToCart(id);
            if (action === 'set-media') this.setMainMedia(id, parseInt(btn.dataset.index), btn);
            if (action === 'prev-media') this.navigateMedia(id, -1);
            if (action === 'next-media') this.navigateMedia(id, 1);
            if (action === 'show-details') this.showModalInfo(id, 'details');
            if (action === 'show-specs') this.showModalInfo(id, 'specs');
        });

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
                             alt="Miniatura ${index + 1}" data-action="set-media" data-id="${product.id}" data-index="${index}">
                    </div>
                `;
            }).join('');

            const firstMedia = product.media[0];
            const isFirstVideo = firstMedia.type === 'video';
            const mainMediaInner = isFirstVideo 
                ? `<video src="${firstMedia.src}" muted loop id="media-${product.id}"></video>`
                : `<img src="${firstMedia.src}" id="media-${product.id}" alt="${product.name}">`;

            card.innerHTML = `
                <div class="product-gallery">
                    <div class="carousel-wrapper-vertical">
                        <div class="thumbnails-track-vertical" id="track-${product.id}">
                            ${thumbsHTML}
                        </div>
                    </div>
                    
                    <div class="main-media-container" id="container-${product.id}" data-current-index="0">
                        <button class="main-arrow prev" data-action="prev-media" data-id="${product.id}">❮</button>
                        <div class="media-content" id="media-content-${product.id}">
                            ${mainMediaInner}
                        </div>
                        <button class="main-arrow next" data-action="next-media" data-id="${product.id}">❯</button>
                    </div>
                </div>

                <div class="product-info">
                    <h3 class="product-title">${product.name}</h3>
                    <p class="product-desc">${product.description}</p>
                    
                    <div class="info-buttons">
                        <button class="btn-info" data-action="show-details" data-id="${product.id}">Ver Detalhes</button>
                        <button class="btn-info outline" data-action="show-specs" data-id="${product.id}">Ficha Técnica</button>
                    </div>
                    
                    <div class="product-price-box">
                        <div class="product-price">${this.formatBRL(product.price)}</div>
                    </div>
                    
                    <div class="shopee-qty-row">
                        <span class="lbl">Quantidade</span>
                        <div class="qty-controls">
                            <button class="btn-qty" data-action="qty-dec" data-id="${product.id}">-</button>
                            <input type="text" class="qty-display" id="input-qty-${product.id}" value="${this.inputQtys[product.id]}" readonly>
                            <button class="btn-qty" data-action="qty-inc" data-id="${product.id}">+</button>
                        </div>
                    </div>

                    <div class="shopee-action-buttons">
                        <button class="btn-add-cart-shopee" data-action="add-cart" data-id="${product.id}">
                            <svg viewBox="0 0 24 24"><path d="M7 18c-1.1 0-1.99.9-1.99 2S5.9 22 7 22s2-.9 2-2-.9-2-2-2zM1 2v2h2l3.6 7.59-1.35 2.45c-.16.28-.25.61-.25.96 0 1.1.9 2 2 2h12v-2H7.42c-.14 0-.25-.11-.25-.25l.03-.12.9-1.63h7.45c.75 0 1.41-.41 1.75-1.03l3.58-6.49c.08-.14.12-.31.12-.48 0-.55-.45-1-1-1H5.21l-.94-2H1zm16 16c-1.1 0-1.99.9-1.99 2s.89 2 1.99 2 2-.9 2-2-.9-2-2-2z"/></svg>
                            Adicionar ao Carrinho
                        </button>
                    </div>
                </div>
            `;
            listElement.appendChild(card);

            // Crosshair e autoplay de vídeos
            const mediaContent = card.querySelector(`#media-content-${product.id}`);
            mediaContent.addEventListener('mouseenter', () => this.handleMediaHover(product.id, true));
            mediaContent.addEventListener('mouseleave', () => this.handleMediaHover(product.id, false));
            mediaContent.addEventListener('mousemove', (e) => this.zoomImage(e, mediaContent, product.id));
        });
    }

    setMainMedia(productId, mediaIndex, thumbElement = null) {
        const product = this.products.find(p => p.id === productId);
        const media = product.media[mediaIndex];
        const container = document.getElementById(`media-content-${productId}`);
        const parentContainer = document.getElementById(`container-${productId}`);
        
        parentContainer.dataset.currentIndex = mediaIndex;
        
        if (media.type === 'video') {
            container.innerHTML = `<video src="${media.src}" muted loop id="media-${productId}"></video>`;
        } else {
            container.innerHTML = `<img src="${media.src}" id="media-${productId}" alt="${product.name}">`;
        }

        const track = document.getElementById(`track-${productId}`);
        const thumbs = track.querySelectorAll('.thumb');
        thumbs.forEach(t => t.classList.remove('active'));
        
        if (!thumbElement) thumbElement = thumbs[mediaIndex];
        if (thumbElement) thumbElement.classList.add('active');
    }

    navigateMedia(productId, direction) {
        const product = this.products.find(p => p.id === productId);
        const container = document.getElementById(`container-${productId}`);
        let currentIndex = parseInt(container.dataset.currentIndex || 0);
        
        currentIndex += direction;
        if (currentIndex < 0) currentIndex = product.media.length - 1;
        if (currentIndex >= product.media.length) currentIndex = 0;
        
        this.setMainMedia(productId, currentIndex);
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

    showModalInfo(productId, type) {
        const product = this.products.find(p => p.id === productId);
        let contentHTML = '';

        if (type === 'details') {
            contentHTML = `
                <div class="modal-header">
                    <h2 style="font-size: 24px; color: var(--text-main);">Detalhes do Produto</h2>
                    <button class="close-modal" id="btn-close-info">×</button>
                </div>
                <div class="modal-body" style="font-size: 16px; line-height: 1.7; color: var(--text-muted); margin-top: 15px;">
                    ${product.details || 'Detalhes não disponíveis.'}
                </div>
            `;
        } else if (type === 'specs') {
            let specsHTML = '';
            if (product.specs) {
                specsHTML = '<table class="specs-table"><tbody>';
                for (const [key, value] of Object.entries(product.specs)) {
                    specsHTML += `<tr><th>${key}</th><td>${value}</td></tr>`;
                }
                specsHTML += '</tbody></table>';
            }
            contentHTML = `
                <div class="modal-header">
                    <h2 style="font-size: 24px; color: var(--text-main);">Ficha Técnica</h2>
                    <button class="close-modal" id="btn-close-info">×</button>
                </div>
                <div class="modal-body" style="margin-top: 15px;">
                    ${specsHTML}
                </div>
            `;
        }

        document.getElementById('modal-content').innerHTML = contentHTML;
        document.getElementById('modal-overlay').classList.remove('hidden');
        document.getElementById('btn-close-info').addEventListener('click', () => this.closeModal());
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
        this.showToast(`✅ Adicionado ao carrinho!`);
    }

    updateCartItemQty(productId, change) {
        if (this.cart[productId]) {
            const newQty = this.cart[productId] + change;
            if (newQty > 0) this.cart[productId] = newQty;
            else delete this.cart[productId]; 
            this.saveCart();
            this.updateCartDropdown();
        }
    }

    toggleCart() { document.getElementById('cart-dropdown').classList.toggle('hidden'); }

    updateCartDropdown() {
        const cartList = document.getElementById('cart-items-list');
        const checkoutArea = document.getElementById('cart-checkout-area');
        const badge = document.getElementById('cart-badge');
        let totalItems = 0, totalPrice = 0;
        cartList.innerHTML = '';

        if (Object.keys(this.cart).length === 0) {
            cartList.innerHTML = '<div class="empty-cart-msg">Carrinho vazio</div>';
            checkoutArea.style.display = 'none';
            badge.textContent = 0;
            return;
        }

        checkoutArea.style.display = 'block';
        for (const [id, qty] of Object.entries(this.cart)) {
            const p = this.products.find(p => p.id === parseInt(id));
            if(!p) continue;
            const subtotal = p.price * qty;
            totalItems += qty; totalPrice += subtotal;
            const imgSrc = p.media.find(m => m.type === 'image') ? p.media.find(m => m.type === 'image').src : p.media[0].thumb;

            cartList.innerHTML += `
                <div class="cart-item">
                    <img src="${imgSrc}">
                    <div class="cart-item-info">
                        <div class="cart-item-title">${p.name}</div>
                        <div class="cart-item-actions">
                            <div class="qty-controls cart-qty-controls">
                                <button class="btn-qty" data-action="cart-qty-dec" data-id="${p.id}">-</button>
                                <input type="text" class="qty-display" value="${qty}" readonly style="width:30px; height:30px;">
                                <button class="btn-qty" data-action="cart-qty-inc" data-id="${p.id}">+</button>
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
        const select = document.getElementById('payment-method-select');
        if (!select.value) { alert("Selecione a forma de pagamento."); return; }
        
        const paymentCode = parseInt(select.value);
        const paymentName = select.options[select.selectedIndex].text.split(' - ')[1].split(' (')[0];
        let totalCompra = 0; let receiptRows = '';

        for (const [id, qty] of Object.entries(this.cart)) {
            const p = this.products.find(p => p.id === parseInt(id));
            const subtotal = p.price * qty;
            totalCompra += subtotal;
            receiptRows += `<tr><td><strong>${qty}x</strong> ${p.name.split(',')[0]}</td><td>${this.formatBRL(p.price)}</td><td>${this.formatBRL(subtotal)}</td></tr>`;
        }

        let desconto = (totalCompra >= 5000 && paymentCode === 1) ? (totalCompra * 0.10) : 0;
        const totalPagar = totalCompra - desconto;

        document.getElementById('modal-content').innerHTML = `
            <div class="modal-header">
                <h2>Obrigado pela compra!</h2>
                <button class="close-modal" id="btn-close-checkout">×</button>
            </div>
            <table class="receipt-table">
                <thead><tr><th>Produto</th><th>Preço Un.</th><th>Subtotal</th></tr></thead>
                <tbody>${receiptRows}</tbody>
            </table>
            <div style="background: #F8FAFC; padding: 20px; border-radius: 8px;">
                <div class="summary-row"><span>Formato:</span><strong>${paymentName}</strong></div>
                <div class="summary-row"><span>Total Produtos:</span><span>${this.formatBRL(totalCompra)}</span></div>
                ${desconto > 0 ? `<div class="summary-row" style="color:#059669;"><span>Desconto:</span><span>- ${this.formatBRL(desconto)}</span></div>` : ''}
                <div class="summary-row" style="font-size:22px; font-weight:700; color:var(--primary); margin-top:15px; padding-top:15px; border-top:1px solid var(--border);">
                    <span>Total Pago:</span><span>${this.formatBRL(totalPagar)}</span>
                </div>
            </div>
            <button class="btn-add-cart-shopee" id="btn-finish-modal" style="margin-top:20px;">Limpar Carrinho</button>
        `;
        document.getElementById('modal-overlay').classList.remove('hidden');
        this.toggleCart(); 

        document.getElementById('btn-close-checkout').addEventListener('click', () => this.closeModal());
        document.getElementById('btn-finish-modal').addEventListener('click', () => {
            this.cart = {}; this.saveCart(); location.reload();
        });
    }

    closeModal() { document.getElementById('modal-overlay').classList.add('hidden'); }
    showToast(msg) {
        const toast = document.getElementById('toast');
        toast.textContent = msg; toast.classList.remove('hidden');
        setTimeout(() => toast.classList.add('hidden'), 2500);
    }
}

const store = new TechStore();