class TechStore {
    constructor() {
        this.products = [];
        this.inputQtys = {};
        const savedCart = localStorage.getItem('nextech_cart');
        this.cart = savedCart ? JSON.parse(savedCart) : {};
        this.init();
    }

    async init() {
        // Renderiza o rodapé assim que a aplicação inicia
        this.renderFooter();

        try {
            const response = await fetch('produtos.json');
            this.products = await response.json();
            this.products.forEach(p => this.inputQtys[p.id] = 1);

            // Inicia a criação do cursor customizado de vídeo
            this.createCursor();

            this.renderProducts();
            this.updateCartDropdown();
            this.setupGlobalEventListeners();
        } catch (error) {
            console.error("Erro ao carregar:", error);
            document.getElementById('product-list').innerHTML = '<p>Erro ao carregar produtos.</p>';
        }
    }
    renderFooter() {
        if (document.querySelector('.site-footer')) return;

        const footer = document.createElement('footer');
        footer.className = 'site-footer';
        footer.innerHTML = `
            <div class="container footer-content">
                <div class="footer-signature">
                    <span>© Code by</span>
                    <a href="https://github.com/jonathan3703226" target="_blank" rel="noopener noreferrer" class="github-badge">
                        <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
                            <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/>
                        </svg>
                        <span class="author-name">JonathanCesar</span>
                    </a>
                </div>
            </div>
        `;

        document.body.appendChild(footer);
    }
    // Cria o cursor de vídeo customizado (efeito de cor reversa)
    createCursor() {
        let cursor = document.getElementById('video-cursor');
        if (!cursor) {
            cursor = document.createElement('div');
            cursor.id = 'video-cursor';
            cursor.className = 'video-cursor hidden';
            // Ícone de Play em SVG
            cursor.innerHTML = '<svg viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>';
            document.body.appendChild(cursor);

            document.addEventListener('mousemove', (e) => {
                cursor.style.left = e.clientX + 'px';
                cursor.style.top = e.clientY + 'px';
            });
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
    // Move a barra de miniaturas para cima ou para baixo
    scrollThumbs(productId, direction) {
        const track = document.getElementById(`track-${productId}`);
        const scrollAmount = 90; // Valor de rolagem aproximado de 1 miniatura
        track.scrollBy({ top: direction * scrollAmount, behavior: 'smooth' });
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
                ? `<video src="${firstMedia.src}" autoplay muted loop playsinline id="media-${product.id}"></video>`
                : `<img src="${firstMedia.src}" id="media-${product.id}" alt="${product.name}">`; card.innerHTML = `
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

            const mediaContent = card.querySelector(`#media-content-${product.id}`);

            // --- EVENTOS UNIFICADOS (DESKTOP E MOBILE) ---

            // 1. Mouse Enter (Apenas Desktop)
            mediaContent.addEventListener('mouseenter', () => {
                if (window.innerWidth <= 900) return;
                const mediaElement = document.getElementById(`media-${product.id}`);
                const cursor = document.getElementById('video-cursor');
                if (mediaElement && mediaElement.tagName === 'VIDEO' && cursor) {
                    cursor.classList.remove('hidden');
                    cursor.textContent = mediaElement.paused ? '▶' : '⏸';
                }
            });

            // 2. Mouse Leave (Apenas Desktop)
            mediaContent.addEventListener('mouseleave', () => {
                if (window.innerWidth <= 900) return;
                const mediaElement = document.getElementById(`media-${product.id}`);
                const cursor = document.getElementById('video-cursor');
                if (mediaElement && mediaElement.tagName === 'VIDEO' && cursor) {
                    cursor.classList.add('hidden');
                } else if (mediaElement && mediaElement.tagName === 'IMG') {
                    mediaElement.style.transform = 'scale(1)';
                }
            });

            // 3. Movimento do Mouse (Apenas Desktop - Faz o Cursor do vídeo seguir o ponteiro ou dá Zoom)
            mediaContent.addEventListener('mousemove', (e) => {
                if (window.innerWidth <= 900) return;
                const mediaElement = document.getElementById(`media-${product.id}`);
                const cursor = document.getElementById('video-cursor');

                if (e.target.closest('.thumbnails') || e.target.closest('button')) {
                    if (cursor) cursor.classList.add('hidden');
                    return;
                }

                const rect = mediaContent.getBoundingClientRect();
                if (mediaElement && mediaElement.tagName === 'VIDEO' && cursor) {
                    cursor.classList.remove('hidden');
                    cursor.style.left = `${e.clientX}px`;
                    cursor.style.top = `${e.clientY}px`;
                } else if (mediaElement && mediaElement.tagName === 'IMG') {
                    const x = ((e.clientX - rect.left) / rect.width) * 100;
                    const y = ((e.clientY - rect.top) / rect.height) * 100;
                    mediaElement.style.transformOrigin = `${x}% ${y}%`;
                    mediaElement.style.transform = 'scale(2.5)';
                }
            });

            // 4. Clique Principal (Funciona no Desktop e no Celular)
            mediaContent.addEventListener('click', () => {
                const mediaElement = document.getElementById(`media-${product.id}`);
                const cursor = document.getElementById('video-cursor');
                const isMobile = window.innerWidth <= 900;

                if (mediaElement && mediaElement.tagName === 'VIDEO') {
                    // Toca/Pausa o vídeo ao clicar
                    if (mediaElement.paused) {
                        mediaElement.play().catch(() => { });
                        if (cursor && !isMobile) cursor.textContent = '⏸';
                    } else {
                        mediaElement.pause();
                        if (cursor && !isMobile) cursor.textContent = '▶';
                    }
                } else if (mediaElement && mediaElement.tagName === 'IMG') {
                    // Se for imagem e estiver no mobile, abre a galeria Modal em tela cheia para Zoom com os dedos
                    if (isMobile) {
                        this.openImageFullscreen(mediaElement.src, product.name);
                    }
                }
            });
        });
        // --- COLOQUE ISSO NO FINAL DA FUNÇÃO renderProducts() ---

        // 1. Observer para animar os cards surgindo na tela
        const cards = document.querySelectorAll('.product-card');
        const cardObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('show-card');
                    cardObserver.unobserve(entry.target); // Anima apenas a primeira vez que aparece
                }
            });
        }, { threshold: 0.1 }); // Dispara quando 10% do card aparecer

        cards.forEach(card => cardObserver.observe(card));

        // 2. Observer para tocar/pausar vídeos automaticamente
        const videos = document.querySelectorAll('video');

        // Verifica se a tela é mobile (limite de 900px)
        const isMobile = window.innerWidth <= 900;

        // Define threshold de 40% para celular e 60% para computador
        const observerThreshold = isMobile ? 0.4 : 0.6;

        const videoObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    // Tenta dar play automaticamente
                    entry.target.play().catch(() => { console.log("Autoplay bloqueado pelo navegador"); });
                } else {
                    entry.target.pause();
                }
            });
        }, { threshold: observerThreshold }); // Usa a regra criada acima

        videos.forEach(video => videoObserver.observe(video));
    }

    setMainMedia(productId, mediaIndex, thumbElement = null) {
        const product = this.products.find(p => p.id === productId);
        const media = product.media[mediaIndex];
        const container = document.getElementById(`media-content-${productId}`);
        const parentContainer = document.getElementById(`container-${productId}`);

        parentContainer.dataset.currentIndex = mediaIndex;

        if (media.type === 'video') {
            // Cria o vídeo já com os atributos necessários
            container.innerHTML = `<video src="${media.src}" id="media-${productId}" autoplay loop muted playsinline></video>`;

            const newVideo = document.getElementById(`media-${productId}`);
            if (newVideo) {
                // Dá o play IMEDIATAMENTE após a criação, aproveitando o evento de clique original do usuário
                newVideo.play().catch(() => { console.log("Autoplay retido pelo navegador"); });

                // Observador para pausar o vídeo caso o usuário role a tela para longe dele
                new IntersectionObserver((entries) => {
                    entries.forEach(entry => {
                        if (entry.isIntersecting) {
                            entry.target.play().catch(() => { });
                        } else {
                            entry.target.pause();
                        }
                    });
                }, { threshold: 0.2 }).observe(newVideo);
            }

        } else {
            // Coloca a imagem normalmente
            container.innerHTML = `<img src="${media.src}" id="media-${productId}" alt="Produto">`;
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

    // Gerencia o hover da mídia principal (vídeo autoplay + cursor vs. imagem zoom)
    handleMediaHover(productId, isHover) {
        const mediaElement = document.getElementById(`media-${productId}`);
        const cursor = document.getElementById('video-cursor');

        if (mediaElement && mediaElement.tagName === 'VIDEO') {
            if (isHover) {
                mediaElement.play();
                cursor.classList.remove('hidden');
            } else {
                mediaElement.pause();
                cursor.classList.add('hidden');
            }
        } else {
            cursor.classList.add('hidden'); // Oculta o cursor em imagens
            if (!isHover && mediaElement && mediaElement.tagName === 'IMG') {
                mediaElement.style.transformOrigin = `center center`;
                mediaElement.style.transform = 'scale(1)';
            }
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
        // (O restante do loop for continua igual, não precisa alterar)
        for (const [id, qty] of Object.entries(this.cart)) {
            const p = this.products.find(p => p.id === parseInt(id));
            if (!p) continue;
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
        let totalCompra = 0;
        let receiptRows = '';

        // Calcula o total e monta a tabela de produtos
        for (const [id, qty] of Object.entries(this.cart)) {
            const p = this.products.find(p => p.id === parseInt(id));
            const subtotal = p.price * qty;
            totalCompra += subtotal;
            receiptRows += `<tr><td><strong>${qty}x</strong> ${p.name.split(',')[0]}</td><td>${this.formatBRL(p.price)}</td><td>${this.formatBRL(subtotal)}</td></tr>`;
        }

        // Monta o modal com o Select de pagamento dentro dele
        document.getElementById('modal-content').innerHTML = `
            <div class="modal-header">
                <h2>Resumo da Compra</h2>
                <button class="close-modal" id="btn-close-checkout">×</button>
            </div>
            <table class="receipt-table">
                <thead><tr><th>Produto</th><th>Preço Un.</th><th>Subtotal</th></tr></thead>
                <tbody>${receiptRows}</tbody>
            </table>
            
            <div style="background: #F8FAFC; padding: 20px; border-radius: 8px; margin-top: 15px;">
                <label for="modal-payment-select" style="display:block; margin-bottom: 8px; font-weight: 600; font-size: 14px;">Forma de Pagamento:</label>
                <select id="modal-payment-select" class="custom-select" style="margin-bottom: 20px;">
                    <option value="" disabled selected>-- Selecione para continuar --</option>
                    <option value="1">1 - À vista (10% OFF em compras > R$5.000)</option>
                    <option value="2">2 - Cartão de Débito</option>
                    <option value="3">3 - Cartão de Crédito</option>
                </select>

                <div class="summary-row"><span>Total Produtos:</span><span>${this.formatBRL(totalCompra)}</span></div>
                
                <div class="summary-row" id="discount-row" style="color:#059669; display: none;">
                    <span>Desconto:</span><span id="discount-value">R$ 0,00</span>
                </div>
                
                <div class="summary-row" style="font-size:22px; font-weight:700; color:var(--primary); margin-top:15px; padding-top:15px; border-top:1px solid var(--border);">
                    <span>Total a Pagar:</span><span id="final-total">${this.formatBRL(totalCompra)}</span>
                </div>
            </div>
            
            <button class="btn-add-cart-shopee" id="btn-finish-modal" style="margin-top:20px;" disabled>
                Finalizar Compra
            </button>
        `;

        document.getElementById('modal-overlay').classList.remove('hidden');
        this.toggleCart(); // Fecha o carrinho lateral

        // Elementos interativos do modal
        const paymentSelect = document.getElementById('modal-payment-select');
        const btnFinish = document.getElementById('btn-finish-modal');
        const discountRow = document.getElementById('discount-row');
        const discountValue = document.getElementById('discount-value');
        const finalTotal = document.getElementById('final-total');

        // Escuta a seleção de pagamento para calcular desconto e liberar o botão
        paymentSelect.addEventListener('change', (e) => {
            btnFinish.disabled = false; // Libera o botão

            let desconto = 0;
            if (e.target.value === '1' && totalCompra >= 5000) {
                desconto = totalCompra * 0.10;
            }

            if (desconto > 0) {
                discountRow.style.display = 'flex';
                discountValue.textContent = `- ${this.formatBRL(desconto)}`;
            } else {
                discountRow.style.display = 'none';
            }

            finalTotal.textContent = this.formatBRL(totalCompra - desconto);
        });

        // Fechar no X
        document.getElementById('btn-close-checkout').addEventListener('click', () => this.closeModal());

        btnFinish.addEventListener('click', () => {
            // 1. Limpa o carrinho
            this.cart = {};
            this.saveCart();
            this.updateCartDropdown();

            // 2. Substitui o conteúdo do modal pela tela de Sucesso
            document.getElementById('modal-content').innerHTML = `
                <div style="text-align: center; padding: 30px 20px;">
                    <div style="background: #10B981; color: white; width: 70px; height: 70px; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto 25px;">
                        <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
                            <polyline points="20 6 9 17 4 12"></polyline>
                        </svg>
                    </div>
                    <h2 style="font-size: 28px; color: var(--text-main); margin-bottom: 15px; letter-spacing: -0.5px;">Parabéns pela sua compra!</h2>
                    <p style="font-size: 16px; color: var(--text-muted); line-height: 1.6; margin-bottom: 35px;">
                        Seu pedido foi processado com sucesso. Em breve, você receberá todas as atualizações no seu e-mail.
                    </p>
                    <button class="btn-checkout-final" id="btn-close-success" style="width: 100%; padding: 16px; font-size: 16px;">
                        Voltar para a Loja
                    </button>
                </div>
            `;

            // 3. O botão final agora apenas fecha o modal e o usuário continua no site vazio
            document.getElementById('btn-close-success').addEventListener('click', () => this.closeModal());
        });
    }

    closeModal() { document.getElementById('modal-overlay').classList.add('hidden'); }

    showToast(msg) {
        const toast = document.getElementById('toast');
        toast.textContent = msg; toast.classList.remove('hidden');
        setTimeout(() => toast.classList.add('hidden'), 2500);
    }
    openImageFullscreen(imgSrc, altText) {
        const modalContent = document.getElementById('modal-content'); // Ajuste se o ID do seu modal for diferente
        modalContent.innerHTML = `
        <div class="modal-header">
            <h2>${altText}</h2>
            <button class="close-modal" id="btn-close-fullscreen">×</button>
        </div>
        <div class="fullscreen-img-wrapper">
            <img src="${imgSrc}" alt="${altText}" class="fullscreen-img">
        </div>
    `;

        document.getElementById('modal-overlay').classList.remove('hidden');
        document.getElementById('btn-close-fullscreen').addEventListener('click', () => this.closeModal());
    }
}


const store = new TechStore();