/**
 * orders.js - Lógica de CRUD de pedidos e manipulação da UI
 */

// ============ CARDÁPIO DA LANCHONETE ============
const MENU = [
  { id: '1001', name: '🍔 X-Burguer',          price: 1800 },
  { id: '1002', name: '🍔 X-Salada',           price: 2000 },
  { id: '1003', name: '🍔 X-Bacon',            price: 2400 },
  { id: '1004', name: '🍔 X-Tudo',             price: 2800 },
  { id: '1005', name: '🍔 Smash Burger',       price: 2200 },
  { id: '1006', name: '🍔 Burger Duplo',       price: 3200 },
  { id: '2001', name: '🍟 Batata Frita P',     price: 800 },
  { id: '2002', name: '🍟 Batata Frita G',     price: 1200 },
  { id: '2003', name: '🧅 Onion Rings',        price: 1000 },
  { id: '2004', name: '🥗 Salada',             price: 700 },
  { id: '3001', name: '🥤 Refrigerante',       price: 600 },
  { id: '3002', name: '🧃 Suco Natural',       price: 800 },
  { id: '3003', name: '🍺 Água Mineral',       price: 400 },
  { id: '3004', name: '🥛 Milkshake',          price: 1400 },
  { id: '4001', name: '🍰 Pudim',              price: 900 },
  { id: '4002', name: '🍨 Sundae',             price: 1100 },
];

// Gera <options> do cardápio
function menuOptionsHtml() {
  const categories = {
    '🍔 Lanches': MENU.filter(i => i.id.startsWith('10')),
    '🍟 Acompanhamentos': MENU.filter(i => i.id.startsWith('20')),
    '🥤 Bebidas': MENU.filter(i => i.id.startsWith('30')),
    '🍰 Sobremesas': MENU.filter(i => i.id.startsWith('40')),
  };
  let html = '<option value="">Selecione um item...</option>';
  for (const [cat, items] of Object.entries(categories)) {
    html += `<optgroup label="${cat}">`;
    items.forEach(i => {
      html += `<option value="${i.id}" data-price="${i.price}">${i.name} — ${formatCurrency(i.price)}</option>`;
    });
    html += '</optgroup>';
  }
  return html;
}

// ============ CRIAR PEDIDO ============

// Adicionar nova linha de item no formulário
function addItem() {
  const container = document.getElementById('itemsContainer');
  const row = document.createElement('div');
  row.className = 'item-row';
  row.innerHTML = buildItemRowHtml();
  bindItemRowEvents(row);
  container.appendChild(row);
  recalcTotal();
}

// Gera HTML de uma linha de item
function buildItemRowHtml() {
  return `
    <div class="form-group fg-item-select">
      <label>Item do Cardápio</label>
      <select class="item-id">${menuOptionsHtml()}</select>
    </div>
    <div class="form-group fg-qty">
      <label>Qtd</label>
      <input type="number" class="item-qty" value="1" min="1">
    </div>
    <div class="form-group fg-price">
      <label>Unit. (R$)</label>
      <input type="number" class="item-price" value="" min="0" readonly>
    </div>
    <div class="form-group fg-subtotal">
      <label>Subtotal</label>
      <span class="item-subtotal">R$ 0,00</span>
    </div>
    <button class="btn btn-danger btn-sm btn-icon" onclick="removeItem(this)" title="Remover">✕</button>
  `;
}

// Vincula eventos de change/input em uma row
function bindItemRowEvents(row) {
  const select = row.querySelector('.item-id');
  const qtyInput = row.querySelector('.item-qty');
  const priceInput = row.querySelector('.item-price');

  select.addEventListener('change', () => {
    const opt = select.options[select.selectedIndex];
    const price = Number(opt.dataset.price || 0);
    priceInput.value = price || '';
    updateRowSubtotal(row);
    recalcTotal();
  });

  qtyInput.addEventListener('input', () => {
    updateRowSubtotal(row);
    recalcTotal();
  });
}

// Atualiza subtotal visual de uma row
function updateRowSubtotal(row) {
  const qty = Number(row.querySelector('.item-qty').value) || 0;
  const price = Number(row.querySelector('.item-price').value) || 0;
  row.querySelector('.item-subtotal').textContent = formatCurrency(qty * price);
}

// Recalcula valor total do pedido
function recalcTotal() {
  let total = 0;
  document.querySelectorAll('.item-row').forEach(row => {
    const qty = Number(row.querySelector('.item-qty').value) || 0;
    const price = Number(row.querySelector('.item-price').value) || 0;
    total += qty * price;
  });
  document.getElementById('valorTotal').value = total;
  document.getElementById('valorTotalDisplay').textContent = formatCurrency(total);
}

// Remover linha de item
function removeItem(btn) {
  const container = document.getElementById('itemsContainer');
  if (container.children.length > 1) {
    btn.parentElement.remove();
    recalcTotal();
  } else {
    showToast('O pedido deve ter pelo menos um item', 'error');
  }
}

// Coletar itens do formulário
function getItemsFromForm() {
  const rows = document.querySelectorAll('.item-row');
  const items = [];

  rows.forEach(row => {
    const id = row.querySelector('.item-id').value;
    const qty = Number(row.querySelector('.item-qty').value);
    const price = Number(row.querySelector('.item-price').value);
    if (id && qty && price) {
      items.push({
        idItem: id,
        quantidadeItem: qty,
        valorItem: price
      });
    }
  });

  return items;
}

// Inicializa a primeira row do formulário (chamada no DOMContentLoaded)
function initFirstItemRow() {
  const container = document.getElementById('itemsContainer');
  container.innerHTML = '';
  const row = document.createElement('div');
  row.className = 'item-row';
  row.innerHTML = buildItemRowHtml();
  bindItemRowEvents(row);
  container.appendChild(row);
  recalcTotal();
}

// Criar pedido via API
async function createOrder() {
  const numeroPedido = document.getElementById('numeroPedido').value.trim();
  const valorTotal = Number(document.getElementById('valorTotal').value);
  const dataCriacaoInput = document.getElementById('dataCriacao').value;
  const items = getItemsFromForm();

  if (!numeroPedido || !valorTotal || !dataCriacaoInput || items.length === 0) {
    showToast('Preencha todos os campos e adicione pelo menos um item', 'error');
    return;
  }

  const dataCriacao = new Date(dataCriacaoInput).toISOString();

  const data = await apiRequest('/order', {
    method: 'POST',
    body: JSON.stringify({ numeroPedido, valorTotal, dataCriacao, items })
  });

  if (data) {
    showToast('Pedido criado com sucesso! 🎉');

    // Limpa formulário e sugere próximo número
    document.getElementById('numeroPedido').value = '';
    setDefaultDate();
    suggestNextOrderId();
    initFirstItemRow();

    // Atualiza listagem
    loadOrders();

    // Muda para aba de pedidos
    switchTab('orders');
  }
}

// Retorna nome do item do cardápio pelo ID
function getMenuItemName(id) {
  const item = MENU.find(m => m.id === String(id));
  return item ? item.name : `Item #${escapeHtml(id)}`;
}

// ============ BUSCA FUZZY (Levenshtein simplificado) ============

let cachedOrders = [];

// Distância de Levenshtein
function levenshtein(a, b) {
  const m = a.length, n = b.length;
  const dp = Array.from({length: m + 1}, (_, i) => {
    const row = new Array(n + 1);
    row[0] = i;
    return row;
  });
  for (let j = 1; j <= n; j++) dp[0][j] = j;
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      dp[i][j] = a[i-1] === b[j-1]
        ? dp[i-1][j-1]
        : 1 + Math.min(dp[i-1][j], dp[i][j-1], dp[i-1][j-1]);
    }
  }
  return dp[m][n];
}

// Fuzzy match: substring match OU distância levenshtein aceitável
function fuzzyMatch(text, query) {
  text = text.toLowerCase();
  query = query.toLowerCase();
  if (text.includes(query)) return true;
  // para queries curtas, tolerância menor
  const tolerance = query.length <= 3 ? 1 : Math.floor(query.length * 0.4);
  // checa cada janela do tamanho da query dentro do texto
  for (let i = 0; i <= text.length - query.length; i++) {
    const window = text.substring(i, i + query.length);
    if (levenshtein(window, query) <= tolerance) return true;
  }
  return false;
}

// Filtra pedidos na tabela (client-side)
function filterOrders(query) {
  query = query.trim().toLowerCase();
  if (!query) {
    renderOrdersTable(cachedOrders);
    return;
  }
  const filtered = cachedOrders.filter(order => {
    const itemNames = order.items.map(i => getMenuItemName(i.idItem)).join(' ');
    const itemIds = order.items.map(i => String(i.idItem)).join(' ');
    // Extrai só números do pedido para match numérico (ex: "1" match "PED-0001")
    const orderNum = order.numeroPedido.replace(/\D/g, '');
    const queryNum = query.replace(/\D/g, '');
    const searchable = [
      order.numeroPedido,
      orderNum,
      formatCurrency(order.valorTotal),
      formatDate(order.dataCriacao),
      itemNames,
      itemIds
    ].join(' ').toLowerCase();

    // Substring simples primeiro
    if (searchable.includes(query)) return true;
    // Match numérico: "1" encontra pedido cujo número termina em "1"
    if (queryNum && orderNum.includes(queryNum)) return true;
    // Fuzzy levenshtein apenas para queries maiores
    if (query.length >= 3) return fuzzyMatch(searchable, query);
    return false;
  });
  renderOrdersTable(filtered);
}

// ============ LISTAR PEDIDOS ============

async function loadOrders() {
  const data = await apiRequest('/order/list');
  if (!data) return;

  cachedOrders = data.orders;

  // Atualiza stats
  const totalOrders = cachedOrders.length;
  const totalValue = cachedOrders.reduce((sum, o) => sum + o.valorTotal, 0);
  const totalItems = cachedOrders.reduce((sum, o) => sum + o.items.length, 0);

  document.getElementById('statTotal').textContent = totalOrders;
  document.getElementById('statValue').textContent = formatCurrency(totalValue);
  document.getElementById('statItems').textContent = totalItems;

  // Aplica filtro se houver texto na busca
  const searchInput = document.getElementById('orderSearchInput');
  if (searchInput && searchInput.value.trim()) {
    filterOrders(searchInput.value);
  } else {
    renderOrdersTable(cachedOrders);
  }
}

// Renderiza array de pedidos na tabela
function renderOrdersTable(orders) {
  const tbody = document.getElementById('ordersTable');

  if (orders.length > 0) {
    tbody.innerHTML = orders.map(order => `
      <tr>
        <td class="order-id-cell">${escapeHtml(order.numeroPedido)}</td>
        <td class="value-cell">${formatCurrency(order.valorTotal)}</td>
        <td>${formatDate(order.dataCriacao)}</td>
        <td><span class="items-badge">🍔 ${order.items.map(i => getMenuItemName(i.idItem)).join(', ')}</span></td>
        <td class="actions">
          <button class="btn btn-danger btn-sm" onclick="deleteOrder('${escapeHtml(order.numeroPedido)}')">🗑️ Excluir</button>
        </td>
      </tr>
    `).join('');
  } else {
    tbody.innerHTML = `
      <tr>
        <td colspan="5">
          <div class="empty-state">
            <div class="empty-icon">🍟</div>
            <p>Nenhum pedido encontrado</p>
            <p style="font-size:0.78rem;margin-top:5px;color:#ddd">Crie seu primeiro pedido na aba "Novo Pedido"</p>
          </div>
        </td>
      </tr>
    `;
  }
}

// ============ DELETAR PEDIDO ============

async function deleteOrder(orderId) {
  if (!confirm(`Deseja realmente excluir o pedido "${orderId}"?`)) return;

  const data = await apiRequest(`/order/${encodeURIComponent(orderId)}`, { method: 'DELETE' });
  if (data) {
    showToast('Pedido excluído com sucesso! 🗑️');
    loadOrders();
  }
}

// ============ HELPERS ============

// Busca sugestão do próximo número de pedido
async function suggestNextOrderId() {
  const data = await apiRequest('/order/next-id');
  if (data && data.nextOrderId) {
    const input = document.getElementById('numeroPedido');
    if (!input.value) {
      input.value = data.nextOrderId;
      input.placeholder = data.nextOrderId;
    }
  }
}

function setDefaultDate() {
  const now = new Date();
  const offset = now.getTimezoneOffset() * 60000;
  const local = new Date(now - offset);
  document.getElementById('dataCriacao').value = local.toISOString().slice(0, 16);
}
