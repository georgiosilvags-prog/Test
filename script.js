// Inicializa o carrinho buscando dados salvos no LocalStorage ou cria uma lista vazia
let carrinho = JSON.parse(localStorage.getItem('devshop_carrinho')) || [];

// Sistema de Notificação Toast não bloqueante (Substituição de alert)
function mostrarNotificacao(mensagem) {
    const toast = document.createElement('div');
    toast.className = 'toast-notification';
    toast.innerText = mensagem;

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

// Alterna a exibição visual dos campos do formulário de pagamento com base na escolha
function alternarMetodoPagamento(metodo) {
    document.getElementById('area-pix').style.display = 'none';
    document.getElementById('area-cartao').style.display = 'none';
    document.getElementById('area-boleto').style.display = 'none';

    const inputsCartao = document.querySelectorAll('#area-cartao input');
    inputsCartao.forEach(input => input.removeAttribute('required'));

    if (metodo === 'pix') {
        document.getElementById('area-pix').style.display = 'block';
    } else if (metodo === 'cartao') {
        document.getElementById('area-cartao').style.display = 'block';
        inputsCartao.forEach(input => input.setAttribute('required', 'true'));
    } else if (metodo === 'boleto') {
        document.getElementById('area-boleto').style.display = 'block';
    }
}

// Adiciona um item ao carrinho
function adicionarAoCarrinho(nome, preco, imagem) {
    const itemExistente = carrinho.find(item => item.nome === nome);

    if (itemExistente) {
        itemExistente.quantidade += 1;
    } else {
        carrinho.push({
            nome: nome,
            preco: preco,
            imagem: imagem,
            quantidade: 1
        });
    }

    localStorage.setItem('devshop_carrinho', JSON.stringify(carrinho));
    mostrarNotificacao(`${nome} adicionado ao carrinho!`);
}

// Redireciona o usuário do carrinho para a página de pagamento
function finalizarCompra() {
    if (carrinho.length === 0) {
        mostrarNotificacao('Seu carrinho está vazio!');
        return;
    }
    window.location.href = 'pagamento.html';
}

// Renderiza os itens na página de carrinho.html
function renderizarCarrinho() {
    const container = document.getElementById('carrinho-container');
    const totalElemento = document.getElementById('carrinho-total');
    if (!container || !totalElemento) return;

    if (carrinho.length === 0) {
        container.innerHTML = '<p style="text-align:center; padding: 2rem; color: #64748b;">Seu carrinho está vazio.</p>';
        totalElemento.innerText = 'R$ 0,00';
        return;
    }

    container.innerHTML = '';
    let totalGeral = 0;

    carrinho.forEach((item, index) => {
        const subtotal = item.preco * item.quantidade;
        totalGeral += subtotal;

        container.innerHTML += `
            <div class="contact-form" style="max-width: 100%; margin-bottom: 15px; display: flex; justify-content: space-between; align-items: center; gap: 15px; flex-wrap: wrap;">
                <div style="display: flex; align-items: center; gap: 15px;">
                    <img src="${item.imagem}" alt="${item.nome}" style="width: 60px; height: 60px; object-fit: cover; border-radius: 8px;">
                    <div>
                        <h4 style="margin: 0; color: #0f172a;">${item.nome}</h4>
                        <p style="margin: 5px 0 0 0; color: #64748b; font-size: 0.9rem;">R$ ${item.preco.toFixed(2).replace('.', ',')} cada</p>
                    </div>
                </div>
                <div style="display: flex; align-items: center; gap: 15px;">
                    <span style="font-size: 0.95rem;">Qtd: <strong>${item.quantidade}</strong></span>
                    <span style="font-weight: 600; color: #0f172a;">R$ ${subtotal.toFixed(2).replace('.', ',')}</span>
                    <button onclick="removerDoCarrinho(${index})" style="background: #ef4444; color: white; border: none; padding: 5px 10px; border-radius: 4px; cursor: pointer; font-size: 0.85rem;">Remover</button>
                </div>
            </div>
        `;
    });

    totalElemento.innerText = `R$ ${totalGeral.toFixed(2).replace('.', ',')}`;
}

// Remove um item específico do carrinho
function removerDoCarrinho(index) {
    carrinho.splice(index, 1);
    localStorage.setItem('devshop_carrinho', JSON.stringify(carrinho));
    renderizarCarrinho();
}

// Carrega os dados na tela de pagamento lateral (pagamento.html)
function carregarResumoPagamento() {
    const container = document.getElementById('resumo-itens-pagamento');
    const totalElemento = document.getElementById('total-pagamento');
    if (!container || !totalElemento) return;

    container.innerHTML = '';
    let totalGeral = 0;

    carrinho.forEach(item => {
        const subtotal = item.preco * item.quantidade;
        totalGeral += subtotal;
        container.innerHTML += `
            <div style="display: flex; justify-content: space-between; font-size: 0.95rem;">
                <span>${item.quantidade}x ${item.nome}</span>
                <span style="font-weight:600;">R$ ${subtotal.toFixed(2).replace('.', ',')}</span>
            </div>
        `;
    });

    totalElemento.innerText = `R$ ${totalGeral.toFixed(2).replace('.', ',')}`;
}

// Salva a compra concluída no Histórico, identificando a opção de pagamento escolhida
function processarPagamentoSimulado(event) {
    event.preventDefault();

    if (carrinho.length === 0) {
        mostrarNotificacao("Erro: Seu carrinho está vazio!");
        setTimeout(() => { window.location.href = 'index.html'; }, 1500);
        return;
    }

    const metodoSelecionado = document.querySelector('input[name="forma-pagamento"]:checked').value;
    let totalCalculado = carrinho.reduce((acc, item) => acc + (item.preco * item.quantidade), 0);
    
    if (metodoSelecionado === 'pix') {
        totalCalculado = totalCalculado * 0.95; // Aplica o desconto de 5% estruturado
    }

    let historico = JSON.parse(localStorage.getItem('devshop_historico')) || [];

    const novoPedido = {
        id: Math.floor(100000 + Math.random() * 900000),
        data: new Date().toLocaleDateString('pt-BR') + ' às ' + new Date().toLocaleTimeString('pt-BR', {hour: '2-digit', minute:'2-digit'}),
        itens: [...carrinho],
        total: totalCalculado,
        metodo: metodoSelecionado.toUpperCase()
    };

    historico.unshift(novoPedido);
    localStorage.setItem('devshop_historico', JSON.stringify(historico));

    carrinho = [];
    localStorage.removeItem('devshop_carrinho');

    if (metodoSelecionado === 'pix') {
        mostrarNotificacao('Chave Pix copiada com sucesso! Aguardando confirmação...');
    } else if (metodoSelecionado === 'boleto') {
        mostrarNotificacao('Boleto Emitido! Código enviado ao e-mail.');
    } else {
        mostrarNotificacao('Transação Aprovada na operadora do cartão!');
    }
    
    setTimeout(() => {
        window.location.href = 'historico.html';
    }, 2000);
}

// Renderiza a lista de recibos na página historico.html
function renderizarHistorico() {
    const container = document.getElementById('historico-container');
    if (!container) return;

    let historico = JSON.parse(localStorage.getItem('devshop_historico')) || [];

    if (historico.length === 0) {
        container.innerHTML = '<p style="text-align:center; padding: 2rem; color: #64748b;">Você ainda não realizou nenhuma compra.</p>';
        return;
    }

    container.innerHTML = '';

    historico.forEach(pedido => {
        let itensHTML = '';
        pedido.itens.forEach(item => {
            itensHTML += `<li>${item.quantidade}x ${item.nome} - R$ ${(item.preco * item.quantidade).toFixed(2).replace('.', ',')}</li>`;
        });

        const labelMetodo = pedido.metodo || 'CARTÃO';

        container.innerHTML += `
            <div class="contact-form" style="max-width: 100%; margin: 0; border-left: 5px solid #25d366; background: #fff; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1);">
                <div style="display: flex; justify-content: space-between; flex-wrap: wrap; margin-bottom: 1rem; border-bottom: 1px dashed #cbd5e1; padding-bottom: 0.5rem;">
                    <strong>Pedido: #${pedido.id} (${labelMetodo})</strong>
                    <span style="color: #64748b; font-size: 0.9rem;">${pedido.data}</span>
                </div>
                <ul style="list-style-position: inside; color: #475569; margin-bottom: 1rem; display:flex; flex-direction:column; gap:5px; padding-left: 0;">
                    ${itensHTML}
                </ul>
                <div style="text-align: right; font-weight: 700; font-size: 1.1rem; color: #0f172a;">
                    Status: <span style="color: #25d366; margin-right: 15px;">✔ Processado</span>
                    Total: <span style="color: #4f46e5;">R$ ${pedido.total.toFixed(2).replace('.', ',')}</span>
                </div>
            </div>
        `;
    });
}