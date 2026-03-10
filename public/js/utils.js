/**
 * utils.js - Utilitários compartilhados (toast, escapeHtml, formatação)
 */

// Escape HTML para prevenir XSS
function escapeHtml(text) {
  const div = document.createElement('div');
  div.appendChild(document.createTextNode(String(text)));
  return div.innerHTML;
}

// Formatar moeda BRL
function formatCurrency(value) {
  return Number(value).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

// Formatar data
function formatDate(dateStr) {
  return new Date(dateStr).toLocaleString('pt-BR');
}

// Debounce: executa fn somente após delay ms sem chamada
function debounce(fn, delay) {
  let timer;
  return function(...args) {
    clearTimeout(timer);
    timer = setTimeout(() => fn.apply(this, args), delay);
  };
}

// Mostra notificação toast
function showToast(message, type = 'success') {
  const icon = type === 'success' ? '✅' : '❌';
  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  toast.innerHTML = `<span>${icon}</span> ${escapeHtml(message)}`;
  document.body.appendChild(toast);

  setTimeout(() => {
    toast.style.animation = 'slideOut 0.3s ease forwards';
    setTimeout(() => toast.remove(), 300);
  }, 3000);
}
