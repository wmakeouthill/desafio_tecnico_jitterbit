/**
 * auth.js - Gerencia login, logout e controle de tela
 */

// Realiza o login e troca para a tela do app
async function handleLogin() {
  const username = document.getElementById('loginUser').value.trim();
  const password = document.getElementById('loginPass').value;
  const errorEl = document.getElementById('loginError');

  errorEl.textContent = '';

  if (!username || !password) {
    errorEl.textContent = 'Preencha usuário e senha';
    return;
  }

  try {
    const data = await requestToken(username, password);
    setAuthToken(data.token);

    // Atualiza UI do header com o nome do usuário
    document.getElementById('headerUsername').textContent = username;

    // Troca de tela: login → app
    document.getElementById('loginScreen').classList.remove('active');
    document.getElementById('appScreen').classList.add('active');

    showToast(`Bem-vindo, ${escapeHtml(username)}! 🍔`);

    // Carrega pedidos automaticamente
    loadOrders();
  } catch (err) {
    errorEl.textContent = err.message;
  }
}

// Faz logout e volta à tela de login
function handleLogout() {
  setAuthToken(null);
  document.getElementById('appScreen').classList.remove('active');
  document.getElementById('loginScreen').classList.add('active');
  document.getElementById('loginPass').value = '';
  document.getElementById('loginError').textContent = '';
  showToast('Logout realizado');
}

// Permite login ao pressionar Enter
function setupLoginEnterKey() {
  const inputs = document.querySelectorAll('#loginScreen input');
  inputs.forEach(input => {
    input.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') handleLogin();
    });
  });
}
