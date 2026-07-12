// Inicializa o carrinho buscando dados salvos no LocalStorage ou cria uma lista vazia
let carrinho = JSON.parse(localStorage.getItem('devshop_carrinho')) || [];

// Sistema de Notificação Toast não bloqueante
function mostrarNotificacao(mensagem) {
    const toast = document.createElement('div');
    toast.className = 'toast-notification';
    toast.innerText = mensaje || mensagem;

    document.body.appendChild(toast);

    setTimeout(() => {
        toast.classList.add('show');
    }, 50);

    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => {
            toast.remove();
        }, 400);
    }, 3000);
}

// Adiciona um item ao carrinho preservando os parâmetros dinâmicos
function adicionarAoCarrinho(nome, preco, img) {
    const itemExistente = carrinho.find(item => item.nome === nome);

    if (itemExistente) {
        itemExistente.quantidade += 1;
    } else {
        carrinho.push({ nome, preco, img, quantidade: 1 });
    }

    localStorage.setItem('devshop_carrinho', JSON.stringify(carrinho));
    mostrarNotificacao(`${nome} adicionado ao carrinho!`);
    if (window.location.pathname.includes('carrinho.html')) {
        renderizarCarrinho();
    }
}

// Alterna a exibição visual dos campos na tela de pagamento
function alternarMetodoPagamento(metodo) {
    document.getElementById('area-pix').style.display = 'none';
    document.getElementById('area-cartao').style.display = 'none';
    document.getElementById('area-boleto').style.display = 'none';

    if (metodo === 'pix') {
        document.getElementById('area-pix').style.display = 'block';
    } else if (metodo === 'cartao') {
        document.getElementById('area-cartao').style.display = 'block';
    } else if (metodo === 'boleto') {
        document.getElementById('area-boleto').style.display = 'block';
    }
}

// Renderização dinâmica dos itens na aba carrinho.html
function renderizarCarrinho() {
    const container = document.getElementById('carrinho-container');
    const totalElemento = document.getElementById('carrinho-total');

    if (!container) return;

    if (carrinho.length === 0) {
        container.innerHTML = '<p style="text-align: center; color: #64748b; padding: 2rem 0;">Seu carrinho está vazio.</p>';
        if (totalElemento) totalElemento.innerText = 'R$ 0,00';
        return;
    }

    container.innerHTML = '';
    let total = 0;

    carrinho.forEach((item, index) => {
        total += item.preco * item.quantidade;
        container.innerHTML += `
            <div class="cart-item">
                <img src="${item.img || 'https://via.placeholder.com/70'}" alt="${item.nome}">
                <div class="cart-item-info">
                    <h4 style="margin-bottom: 4px; color:#0f172a;">${item.nome}</h4>
                    <span style="color:#4f46e5; font-weight:700;">R$ ${item.preco.toFixed(2).replace('.', ',')}</span>
                </div>
                <div class="cart-item-actions">
                    <button class="btn-qty" onclick="alterarQuantidade(${index}, -1)">-</button>
                    <span style="font-weight: 600;">${item.quantidade}</span>
                    <button class="btn-qty" onclick="alterarQuantidade(${index}, 1)">+</button>
                    <button class="btn-remove" onclick="removerItem(${index})" style="margin-left: 10px;">🗑️</button>
                </div>
            </div>
        `;
    });

    if (totalElemento) totalElemento.innerText = `R$ ${total.toFixed(2).replace('.', ',')}`;
}

function alterarQuantidade(index, valor) {
    carrinho[index].quantidade += valor;
    if (carrinho[index].quantidade <= 0) {
        carrinho.splice(index, 1);
    }
    localStorage.setItem('devshop_carrinho', JSON.stringify(carrinho));
    renderizarCarrinho();
}

function removerItem(index) {
    carrinho.splice(index, 1);
    localStorage.setItem('devshop_carrinho', JSON.stringify(carrinho));
    renderizarCarrinho();
}

function finalizarCompra() {
    if (carrinho.length === 0) {
        mostrarNotificacao('Adicione itens ao carrinho primeiro!');
        return;
    }
    window.location.href = 'pagamento.html';
}

// Lógica de Execução ao carregar as Telas de Pagamento ou Histórico
document.addEventListener('DOMContentLoaded', () => {
    if (window.location.pathname.includes('carrinho.html')) {
        renderizarCarrinho();
    }

    if (window.location.pathname.includes('pagamento.html')) {
        const resumoContainer = document.getElementById('resumo-itens-pagamento');
        const totalPagamento = document.getElementById('total-pagamento');

        if (resumoContainer) {
            let total = 0;
            resumoContainer.innerHTML = '';
            carrinho.forEach(item => {
                total += item.preco * item.quantidade;
                resumoContainer.innerHTML += `
                    <div style="display: flex; justify-content: space-between; font-size: 0.95rem; color: #475569;">
                        <span>${item.quantidade}x ${item.nome}</span>
                        <strong>R$ ${(item.preco * item.quantidade).toFixed(2).replace('.', ',')}</strong>
                    </div>
                `;
            });
            if (totalPagamento) totalPagamento.innerText = `R$ ${total.toFixed(2).replace('.', ',')}`;
        }
    }

    if (window.location.pathname.includes('historico.html')) {
        const container = document.getElementById('historico-container');
        const historico = JSON.parse(localStorage.getItem('devshop_historico')) || [];

        if (!container) return;

        if (historico.length === 0) {
            container.innerHTML = '<p style="text-align: center; color: #64748b;">Você ainda não realizou nenhum pedido.</p>';
        } else {
            container.innerHTML = '';
            historico.forEach(pedido => {
                let itensHTML = '';
                pedido.itens.forEach(item => {
                    itensHTML += `<li>${item.quantidade}x ${item.nome} - R$ ${(item.preco * item.quantidade).toFixed(2).replace('.', ',')}</li>`;
                });

                const labelMetodo = pedido.metodo || 'CARTÃO';
                const codigoRastreioFicticio = `BR${pedido.id}824CN`;

                container.innerHTML += `
                    <div class="contact-form" style="max-width: 100%; margin: 0; border-left: 5px solid #4f46e5; background: #fff; padding: 20px;">
                        <div style="display: flex; justify-content: space-between; flex-wrap: wrap; margin-bottom: 1rem; border-bottom: 1px dashed #cbd5e1; padding-bottom: 0.5rem;">
                            <strong>Pedido: #${pedido.id} (${labelMetodo})</strong>
                            <span style="color: #64748b; font-size: 0.9rem;">${pedido.data}</span>
                        </div>
                        <ul style="list-style-position: inside; color: #475569; margin-bottom: 1rem; display:flex; flex-direction:column; gap:5px; padding-left: 0;">
                            ${itensHTML}
                        </ul>
                        
                        <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; border-top: 1px solid #e2e8f0; padding-top: 10px;">
                            <div class="tracking-box">
                                <span style="color: #16a34a; font-weight: bold;">Status: ✓ Processado (A caminho)</span>
                                <span class="tracking-code" style="font-size: 0.9rem;">Código de Rastreio: <strong class="code-highlight">${codigoRastreioFicticio}</strong></span>
                            </div>
                            <div style="text-align: right; font-weight: 700; font-size: 1.1rem;">
                                Total: <span style="color: #4f46e5;">R$ ${pedido.total.toFixed(2).replace('.', ',')}</span>
                            </div>
                        </div>
                        <div class="tracking-action">
                            <a href="https://rastreamento.correios.com.br" target="_blank" class="btn-track">Acompanhar nos Correios</a>
                        </div>
                    </div>
                `;
            });
        }
    }
});

// Processamento final da compra e armazenamento no histórico local
function processarPagamento(event) {
    event.preventDefault();
    if (carrinho.length === 0) return;

    const historico = JSON.parse(localStorage.getItem('devshop_historico')) || [];
    const metodoSelecionado = document.querySelector('input[name="metodo_pagamento"]:checked').value;
    
    let total = 0;
    carrinho.forEach(item => total += item.preco * item.quantidade);

    const novoPedido = {
        id: Math.floor(100000 + Math.random() * 900000),
        data: new Date().toLocaleDateString('pt-BR') + ' às ' + new Date().toLocaleTimeString('pt-BR', {hour: '2-digit', minute:'2-digit'}),
        itens: [...carrinho],
        total: total,
        metodo: metodoSelecionado
    };

    historico.unshift(novoPedido);
    localStorage.setItem('devshop_historico', JSON.stringify(historico));
    
    // Limpa o carrinho após a transação concluída
    carrinho = [];
    localStorage.removeItem('devshop_carrinho');

    mostrarNotificacao('Pagamento Processado com Sucesso!');
    setTimeout(() => {
        window.location.href = 'historico.html';
    }, 1500);
}