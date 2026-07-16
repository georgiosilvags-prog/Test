// Inicializa o carrinho buscando dados salvos no LocalStorage ou cria uma lista vazia
let carrinho = JSON.parse(localStorage.getItem('devshop_carrinho')) || [];

// Banco de Dados focado em E-books, Templates e PDFs
const productDatabase = {
    "ebook-js": {
        id: "ebook-js",
        name: "E-book: JavaScript do Zero ao Mestre",
        badge: "PDF DIGITAL",
        desc: "Domine a linguagem de programação mais popular do mundo. Guia prático com projetos reais, exercícios resolvidos e acesso a atualizações vitalícias.",
        oldPrice: "R$ 97,00",
        currentPrice: "R$ 47,00",
        priceValue: 47.00,
        hotmartUrl: "https://pay.hotmart.com/PRODUTO_EBOOK_JS_AQUI", // Insira seu Link da Hotmart aqui
        images: [
            "https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=600&q=80",
            "https://images.unsplash.com/photo-1532012197267-da84d127e765?auto=format&fit=crop&w=600&q=80"
        ]
    },
    "template-notion": {
        id: "template-notion",
        name: "Template Notion: Produtividade Extrema",
        badge: "TEMPLATE EDITÁVEL",
        desc: "O sistema definitivo de organização pessoal e profissional. Controle suas tarefas, finanças, estudos e projetos em um único painel minimalista.",
        oldPrice: "R$ 79,00",
        currentPrice: "R$ 29,90",
        priceValue: 29.90,
        hotmartUrl: "https://pay.hotmart.com/PRODUTO_TEMPL_NOTION_AQUI", // Insira seu Link da Hotmart aqui
        images: [
            "https://images.unsplash.com/photo-1531403009284-440f080d1e12?auto=format&fit=crop&w=600&q=80",
            "https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&w=600&q=80"
        ]
    },
    "guia-arquitetura": {
        id: "guia-arquitetura",
        name: "PDF: Guia Prático de Arquitetura Limpa",
        badge: "E-BOOK COMPLETO",
        desc: "Aprenda a estruturar aplicações escaláveis, fáceis de testar e com baixo acoplamento usando princípios SOLID e Clean Architecture.",
        oldPrice: "R$ 149,00",
        currentPrice: "R$ 89,00",
        priceValue: 89.00,
        hotmartUrl: "https://pay.hotmart.com/PRODUTO_ARCH_GUIDE_AQUI", // Insira seu Link da Hotmart aqui
        images: [
            "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=600&q=80",
            "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?auto=format&fit=crop&w=600&q=80"
        ]
    }
};

// Salvar carrinho localmente
function salvarCarrinho() {
    localStorage.setItem('devshop_carrinho', JSON.stringify(carrinho));
}

// Adicionar produto ao carrinho
function adicionarAoCarrinho(productId) {
    const produtoInfo = productDatabase[productId];
    if (!produtoInfo) return;

    // Se já estiver no carrinho, avisa que o limite é 1 (já que é produto digital)
    const existe = carrinho.find(item => item.id === productId);
    if (existe) {
        alert("Este produto digital já está no seu carrinho!");
        return;
    }

    carrinho.push({ id: productId, quantidade: 1 });
    salvarCarrinho();
    alert(`"${produtoInfo.name}" foi adicionado ao carrinho!`);
}

// Renderiza os produtos na página principal e de catálogo
document.addEventListener("DOMContentLoaded", () => {
    const grid = document.querySelector(".product-grid");
    if (grid) {
        grid.innerHTML = "";
        Object.values(productDatabase).forEach(product => {
            const card = document.createElement("div");
            card.className = "product-card";
            card.setAttribute("data-id", product.id);
            card.innerHTML = `
                <div class="badge-discount">${product.badge}</div>
                <img src="${product.images[0]}" alt="${product.name}" class="product-img open-details">
                <div class="product-info">
                    <h3 class="product-title open-details">${product.name}</h3>
                    <p class="product-desc">${product.desc.substring(0, 75)}...</p>
                    <div class="product-price">
                        <span class="old-price">${product.oldPrice}</span>
                        <span class="current-price">${product.currentPrice}</span>
                    </div>
                    <div style="display: flex; gap: 8px;">
                        <button class="btn-buy open-details" style="background: #334155;">Ver Detalhes</button>
                        <a href="${product.hotmartUrl}" target="_blank" class="btn-buy" style="text-align: center; text-decoration: none; background: #f04e23; border: none; display: flex; align-items: center; justify-content: center;">Comprar Agora 🔥</a>
                    </div>
                </div>
            `;
            grid.appendChild(card);
        });

        // Evento para abrir modal de detalhes ao clicar na imagem ou título
        grid.addEventListener("click", (e) => {
            if (e.target.classList.contains("open-details")) {
                const card = e.target.closest(".product-card");
                const id = card.getAttribute("data-id");
                if (productDatabase[id]) {
                    openProductModal(productDatabase[id]);
                }
            }
        });
    }

    // Renderizar itens na página do Carrinho
    const carrinhoContainer = document.getElementById("carrinho-container");
    if (carrinhoContainer) {
        renderizarCarrinho();
    }
});

// Modal dinâmico com link seguro direto da Hotmart
function openProductModal(product) {
    const modal = document.getElementById("product-modal");
    const mainImg = document.getElementById("modal-main-img");
    const thumbBar = document.getElementById("modal-thumbnails");
    
    document.getElementById("modal-product-name").innerText = product.name;
    document.getElementById("modal-product-badge").innerText = product.badge;
    document.getElementById("modal-product-desc").innerText = product.desc;
    document.getElementById("modal-old-price").innerText = product.oldPrice;
    document.getElementById("modal-current-price").innerText = product.currentPrice;
    
    mainImg.src = product.images[0];
    thumbBar.innerHTML = "";
    
    product.images.forEach((imgUrl, index) => {
        const thumb = document.createElement("img");
        thumb.src = imgUrl;
        thumb.alt = `Ângulo ${index + 1}`;
        thumb.classList.add("thumb-img");
        if (index === 0) thumb.classList.add("active");
        
        thumb.addEventListener("click", () => {
            mainImg.src = imgUrl;
            document.querySelectorAll(".thumb-img").forEach(t => t.classList.remove("active"));
            thumb.classList.add("active");
        });
        
        thumbBar.appendChild(thumb);
    });
    
    // Configura o botão do modal para direcionar direto à Hotmart
    const btnBuy = document.getElementById("modal-btn-buy");
    btnBuy.innerText = "Comprar via Hotmart 🔥";
    btnBuy.style.background = "#f04e23"; // Cor icônica da Hotmart
    btnBuy.onclick = () => {
        window.open(product.hotmartUrl, '_blank');
    };
    
    modal.style.display = "flex";
}

// Fechar modal ao clicar fora ou no botão de fechar
document.addEventListener("DOMContentLoaded", () => {
    const modal = document.getElementById("product-modal");
    if (modal) {
        const closeBtn = document.querySelector(".close-modal");
        if (closeBtn) {
            closeBtn.addEventListener("click", () => modal.style.display = "none");
        }
        window.addEventListener("click", (e) => {
            if (e.target === modal) modal.style.display = "none";
        });
    }
});

// Renderizar itens no Carrinho interno
function renderizarCarrinho() {
    const container = document.getElementById("carrinho-container");
    const totalEl = document.getElementById("carrinho-total");
    if (!container) return;

    if (carrinho.length === 0) {
        container.innerHTML = `<p style="text-align: center; font-size: 1.2rem; color: #64748b; padding: 2rem 0;">Seu carrinho está vazio. Escolha um de nossos infoprodutos!</p>`;
        if (totalEl) totalEl.innerText = "R$ 0,00";
        return;
    }

    container.innerHTML = "";
    let somaTotal = 0;

    carrinho.forEach(item => {
        const prod = productDatabase[item.id];
        if (!prod) return;

        somaTotal += prod.priceValue;

        const cartItem = document.createElement("div");
        cartItem.className = "cart-item";
        cartItem.style = "display: flex; align-items: center; justify-content: space-between; background: #fff; padding: 15px; border-radius: 12px; margin-bottom: 15px; box-shadow: 0 4px 6px rgba(0,0,0,0.05);";
        cartItem.innerHTML = `
            <div style="display: flex; align-items: center; gap: 15px;">
                <img src="${prod.images[0]}" style="width: 70px; height: 70px; object-fit: cover; border-radius: 8px;">
                <div>
                    <h4 style="margin: 0 0 5px 0;">${prod.name}</h4>
                    <span class="current-price" style="color: #f04e23; font-weight: bold;">${prod.currentPrice}</span>
                </div>
            </div>
            <div style="display: flex; gap: 10px; align-items: center;">
                <a href="${prod.hotmartUrl}" target="_blank" class="btn-buy" style="background: #f04e23; text-decoration: none; font-size: 0.9rem; padding: 8px 15px;">Pagar Seguro Hotmart 💳</a>
                <button onclick="removerDoCarrinho('${prod.id}')" style="background: #ef4444; color: white; border: none; padding: 8px 12px; border-radius: 6px; cursor: pointer;">Remover</button>
            </div>
        `;
        container.appendChild(cartItem);
    });

    if (totalEl) {
        totalEl.innerText = `R$ ${somaTotal.toFixed(2).replace('.', ',')}`;
    }
}

function removerDoCarrinho(productId) {
    carrinho = carrinho.filter(item => item.id !== productId);
    salvarCarrinho();
    renderizarCarrinho();
}

// Se o usuário tentar "Finalizar Compra" no Carrinho, vamos guiá-lo para pagar individualmente os produtos
function finalizarCompra() {
    if (carrinho.length === 0) {
        alert("Seu carrinho está vazio!");
        return;
    }
    
    alert("Como os produtos digitais são entregues de forma 100% segura pela Hotmart, clique no botão vermelho 'Pagar Seguro Hotmart' ao lado de cada produto para concluir o seu acesso!");
}