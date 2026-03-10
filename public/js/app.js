/**
 * app.js - Controlador principal da aplicação (navegação por abas)
 */

// Troca de aba ativa
function switchTab(tabName) {
  // Desativa todas as abas e painéis
  document.querySelectorAll('.nav-tab').forEach(t => t.classList.remove('active'));
  document.querySelectorAll('.tab-panel').forEach(p => p.classList.remove('active'));

  // Ativa a aba e painel selecionados
  document.querySelector(`[data-tab="${tabName}"]`).classList.add('active');
  document.getElementById(`panel-${tabName}`).classList.add('active');

  // Recarrega pedidos se for a aba de listagem
  if (tabName === 'orders') {
    loadOrders();
  }

  // Sugere próximo número ao abrir aba de novo pedido
  if (tabName === 'new-order') {
    suggestNextOrderId();
  }
}

// Inicialização
document.addEventListener('DOMContentLoaded', () => {
  // Verifica se já existe token no sessionStorage (sessão persistida)
  const savedToken = getAuthToken();
  if (savedToken) {
    document.getElementById('loginScreen').classList.remove('active');
    document.getElementById('appScreen').classList.add('active');
    loadOrders();
  }

  // Setup Enter key no login
  setupLoginEnterKey();

  // Seta data padrão no campo de criação
  setDefaultDate();

  // Inicializa primeira row de item com selects do cardápio
  initFirstItemRow();

  // Setup abas de navegação
  document.querySelectorAll('.nav-tab').forEach(tab => {
    tab.addEventListener('click', () => switchTab(tab.dataset.tab));
  });

  // Setup busca inline com debounce
  document.getElementById('orderSearchInput').addEventListener('input', debounce(() => {
    filterOrders(document.getElementById('orderSearchInput').value);
  }, 250));
});
