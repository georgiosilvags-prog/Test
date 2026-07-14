// Inicializa o carrinho buscando dados salvos no LocalStorage ou cria uma lista vazia
let carrinho = JSON.parse(localStorage.getItem('devshop_carrinho')) || [];

// Banco de Dados contendo as informações e os preços REAIS de cada produto
const productDatabase = {
    "smartphone": {
        id: "smartphone",
        name: "Smartphone Alpha",
        badge: "ÚLTIMAS UNIDADES",
        desc: "Processador octa-core de última geração, 128GB de armazenamento interno expansível e câmara quádrupla ultra-nítida assistida por inteligência artificial.",
        oldPrice: "R$ 2.799,00",
        currentPrice: "R$ 1.999,00",
        priceValue: 1999.00,
        images: [
            "https://images.unsplash.com/photo-1598327105666-5b89351aff97?auto=format&fit=crop&w=600&q=80",
            "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=600&q=80",
            "https://images.unsplash.com/photo-1565849904461-09a7dfdb3556?auto=format&fit=crop&w=600&q=80",
            "https://images.unsplash.com/photo-1573148195900-7845dcb9b127?auto=format&fit=crop&w=600&q=80"
        ]
    },
    "notebook": {
        id: "notebook",
        name: "Notebook Pro Work",
        badge: "30% OFF",
        desc: "Ecrã de 15.6\" Full HD com painel IPS, 16GB de memória RAM DDR4 e SSD NVMe de 512GB. Ideal para desenvolvimento de software e alta produtividade.",
        oldPrice: "R$ 5.999,00",
        currentPrice: "R$ 4.299,00",
        priceValue: 4299.00,
        images: [
            "https://images.unsplash.com/photo-1496181130204-755241524eab?auto=format&fit=crop&w=600&q=80",
            "https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?auto=format&fit=crop&w=600&q=80",
            "https://images.unsplash.com/photo-1531297484001-80022131f5a1?auto=format&fit=crop&w=600&q=80",
            "https://images.unsplash.com/photo-1603302576837-37561b2e2302?auto=format&fit=crop&w=600&q=80"
        ]
    },
    "fone": {
        id: "fone",
        name: "Fone de Ouvido Bluetooth",
        badge: "OFERTA DO DIA",
        desc: "Cancelamento ativo de ruído inteligente (ANC), driver dinâmico de alta fidelidade e bateria interna com autonomia para até 40 horas de reprodução contínua.",
        oldPrice: "R$ 499,00",
        currentPrice: "R$ 299,00",
        priceValue: 299.00,
        images: [
            "https://images.unsplash.com/photo-1546435770-a3e426bf472b?auto=format&fit=crop&w=600&q=80",
            "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=600&q=80",
            "https://images.unsplash.com/photo-1484704849700-f032a568e944?auto=format&fit=crop&w=600&q=80",
            "https://images.unsplash.com/photo-1618384887929-16ec33fab9ef?auto=format&fit=crop&w=600&q=80"
        ]
    },
    "teclado": {
        id: "teclado",
        name: "Teclado Mecânico RGB",
        badge: "OFERTA RESTRITA",
        desc: "Switches mecânicos lineares ultra responsivos, retroiluminação RGB customizável via hardware e estrutura superior em alumínio aeronáutico escovado.",
        oldPrice: "R$ 499,00",
        currentPrice: "R$ 349,90",
        priceValue: 349.90,
        images: [
            "https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=600&q=80",
            "https://images.unsplash.com/photo-1595225476474-87563907a212?auto=format&fit=crop&w=600&q=80",
            "https://images.unsplash.com/photo-1626958390898-162d3577f593?auto=format&fit=crop&w=600&q=80",
            "https://images.unsplash.com/photo-1601445638532-3c6f6c3aa1d6?auto=format&fit=crop&w=600&q=80"
        ]
    },
    "cadeira": {
        id: "cadeira",
        name: "Cadeira Ergonômica Pro",
        badge: "40% DE DESCONTO",
        desc: "Certificação ergonômica avançada com suporte lombar dinâmico tridimensional, apoios de braço articulados em 3 eixos e inclinação de até 135 graus.",
        oldPrice: "R$ 1.499,00",
        currentPrice: "R$ 989,90",
        priceValue: 989.90,
        images: [
            "https://images.unsplash.com/photo-1505797149-43b0069ec26b?auto=format&fit=crop&w=600&q=80",
            "https://images.unsplash.com/photo-1580481072645-022f9a6dbf27?auto=format&fit=crop&w=600&q=80",
            "https://images.unsplash.com/photo-1506439773649-6e0eb8cfb237?auto=format&fit=crop&w=600&q=80",
            "https://images.unsplash.com/photo-1592078615290-033ee584e267?auto=format&fit=crop&w=600&q=80"
        ]
    }
};

// Antievitação de XSS: Sanitiza dados strings vindos do LocalStorage
function escaparHTML(string) {
    const mapa = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#x27;',
        "/": '&#x2F;'
    };
    return String(string).replace(/[&<>"'/]/g, (s) => mapa[s]);
}

// Sistema de Notificação na Interface (Toast)
function mostrarNotificacao(mensagem) {
    const toast = document.createElement('div');
    toast.className = 'toast-notification';
    toast.innerText = mensagem; 
    document.body.appendChild(toast);
    setTimeout(() => toast.classList.add('show'), 50);
    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => toast.remove(), 400);
    }, 3000);
}

// Adiciona produtos ao carrinho mantendo referências fixas e seguras
function adicionarAoCarrinho(idProduto) {
    const produtoOriginal = productDatabase[idProduto];
    if (!produtoOriginal) return;

    const itemExistente = carrinho.find(item => item.id === idProduto);

    if (itemExistente) {
        itemExistente.quantidade += 1;
    } else {
        carrinho.push({ 
            id: idProduto,
            nome: produtoOriginal.name, 
            img: produtoOriginal.images[0], 
            quantidade: 1 
        });
    }

    localStorage.setItem('devshop_carrinho', JSON.stringify(carrinho));
    mostrarNotificacao(`${produtoOriginal.name} adicionado ao carrinho!`);
    
    if (window.location.pathname.includes('carrinho.html')) {
        renderizarCarrinho();
    }
}

// INTEGRAÇÃO COM CHECKOUT EXTERNO SEGURO
function finalizarCompra() {
    if (carrinho.length === 0) {
        mostrarNotificacao('Seu carrinho está vazio.');
        return;
    }

    let total = 0;
    const itensValidados = [];

    // Recalcula rigidamente com base no banco local para bloquear fraudes de alteração de preço
    carrinho.forEach(item => {
        const produtoOriginal = productDatabase[item.id];
        if (produtoOriginal) {
            total += produtoOriginal.priceValue * item.quantidade;
            itensValidados.push({
                id: produtoOriginal.id,
                nome: produtoOriginal.name,
                quantidade: item.quantidade,
                preco: produtoOriginal.priceValue
            });
        }
    });

    mostrarNotificacao('Redirecionando para o ambiente seguro de pagamento...');

    // CONFIGURAÇÃO DO SEU CHECKOUT DE DROPSHIPPING (Ex: Yampi, CartX ou Link do Mercado Pago)
    const URL_BASE_CHECKOUT = "https://sualoja.yampi.io/r/"; 

    // Cria os parâmetros de envio seguros no link
    const parametrosUrl = itensValidados.map(item => `${item.id}=${item.quantidade}`).join('&');
    const linkFinalCheckout = URL_BASE_CHECKOUT + "?" + parametrosUrl;

    setTimeout(() => {
        // Grava no histórico local do usuário que o pedido foi enviado para checkout externo
        const historico = JSON.parse(localStorage.getItem('devshop_historico')) || [];
        const novoPedidoPendente = {
            id: Math.floor(100000 + Math.random() * 900000),
            data: new Date().toLocaleDateString('pt-BR') + ' às ' + new Date().toLocaleTimeString('pt-BR', {hour: '2-digit', minute:'2-digit'}),
            itens: itensValidados,
            total: total,
            metodo: 'Checkout Cloud Seguro'
        };
        historico.unshift(novoPedidoPendente);
        localStorage.setItem('devshop_historico', JSON.stringify(historico));

        // Limpa o carrinho local para evitar duplicações
        localStorage.removeItem('devshop_carrinho');
        carrinho = [];

        // Redireciona para o checkout blindado externo
        window.location.href = linkFinalCheckout;
    }, 1500);
}

// Renderiza itens na página do carrinho
function renderizarCarrinho() {
    const container = document.getElementById('carrinho-container');
    const totalElement = document.getElementById('carrinho-total');
    if (!container) return;

    container.innerHTML = '';
    let total = 0;

    if (carrinho.length === 0) {
        container.innerHTML = '<p style="text-align:center; color:#64748b; padding:2rem 0;">Seu carrinho está vazio.</p>';
        totalElement.innerText = 'R$ 0,00';
        return;
    }

    carrinho.forEach((item, index) => {
        const produtoOriginal = productDatabase[item.id];
        const precoSeguro = produtoOriginal ? produtoOriginal.priceValue : 0;
        total += precoSeguro * item.quantidade;
        
        container.innerHTML += `
            <div class="product-card cart-card">
                <div class="cart-item-left">
                    <img src="${escaparHTML(item.img)}" style="width:70px; height:70px; object-fit:cover; border-radius:8px;">
                    <div style="text-align: left;">
                        <h4 style="margin:0 0 5px 0;">${escaparHTML(item.nome)}</h4>
                        <span style="color:#64748b; font-size:0.9rem;">R$ ${precoSeguro.toFixed(2)}</span>
                    </div>
                </div>
                <div class="cart-item-right">
                    <div style="display:flex; align-items:center; background:#f1f5f9; border-radius:8px; padding:2px;">
                        <button onclick="alterarQuantidade(${index}, -1)" style="border:none; background:none; padding:5px 10px; cursor:pointer; font-weight:bold;">-</button>
                        <span style="padding:0 10px;">${Number(item.quantidade)}</span>
                        <button onclick="alterarQuantidade(${index}, 1)" style="border:none; background:none; padding:5px 10px; cursor:pointer; font-weight:bold;">+</button>
                    </div>
                    <strong style="color:#4f46e5; min-width:80px; text-align:right;">R$ ${(precoSeguro * item.quantidade).toFixed(2)}</strong>
                </div>
            </div>
        `;
    });

    totalElement.innerText = `R$ ${total.toFixed(2)}`;
}

function alterarQuantidade(index, mudanca) {
    if(!carrinho[index]) return;
    carrinho[index].quantidade += mudanca;
    if (carrinho[index].quantidade <= 0) {
        carrinho.splice(index, 1);
    }
    localStorage.setItem('devshop_carrinho', JSON.stringify(carrinho));
    renderizarCarrinho();
}

// Gerenciador de inicialização das telas e histórico
document.addEventListener("DOMContentLoaded", () => {
    const modal = document.getElementById("product-modal");
    const closeModal = document.querySelector(".close-modal");
    
    document.querySelectorAll(".product-card").forEach(card => {
        const img = card.querySelector(".product-img");
        if(img) {
            img.addEventListener("click", () => {
                const productId = card.getAttribute("data-id");
                const product = productDatabase[productId];
                if (product) openProductModal(product);
            });
        }
    });

    if (closeModal) {
        closeModal.addEventListener("click", () => { modal.style.display = "none"; });
    }

    window.addEventListener("click", (e) => {
        if (e.target === modal) modal.style.display = "none";
    });

    if (window.location.pathname.includes('carrinho.html')) {
        renderizarCarrinho();
    }

    if (window.location.pathname.includes('historico.html')) {
        const historicoContainer = document.getElementById('historico-container');
        const historico = JSON.parse(localStorage.getItem('devshop_historico')) || [];

        if (historico.length === 0) {
            historicoContainer.innerHTML = `<p style="text-align:center; color:#64748b;">Nenhum pedido encontrado.</p>`;
        } else {
            historicoContainer.innerHTML = '';
            historico.forEach(pedido => {
                let itensHTML = '';
                pedido.itens.forEach(item => {
                    itensHTML += `<p style="font-size:0.95rem; margin:4px 0;">• ${escaparHTML(item.nome)} (x${Number(item.quantidade)}) - R$ ${(item.preco * item.quantidade).toFixed(2)}</p>`;
                });

                historicoContainer.innerHTML += `
                    <div class="product-card cart-card" style="padding: 20px; gap:10px;">
                        <div style="display:flex; justify-content:space-between; border-bottom:1px solid #cbd5e1; padding-bottom:8px; flex-wrap:wrap; width: 100%;">
                            <strong>Pedido #${Number(pedido.id)}</strong>
                            <span style="color:#64748b; font-size:0.9rem;">${escaparHTML(pedido.data)}</span>
                        </div>
                        <div style="width: 100%; text-align: left;">${itensHTML}</div>
                        <div style="display:flex; justify-content:space-between; align-items:center; margin-top:10px; flex-wrap:wrap; gap:10px; width: 100%;">
                            <div>Total: <strong style="color:#4f46e5; font-size:1.2rem;">R$ ${Number(pedido.total).toFixed(2)}</strong></div>
                            <span style="background:#e0f2fe; color:#0369a1; padding:4px 12px; border-radius:20px; font-size:0.85rem; font-weight:600;">Redirecionado ao Checkout</span>
                        </div>
                    </div>
                `;
            });
        }
    }
});

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
    
    const btnBuy = document.getElementById("modal-btn-buy");
    btnBuy.onclick = () => {
        adicionarAoCarrinho(product.id);
    };
    
    modal.style.display = "block";
}