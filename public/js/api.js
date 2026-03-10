/**
 * api.js - Camada de comunicação com a API REST
 */

const API_BASE = '';

// Define o token JWT e persiste em sessionStorage
function setAuthToken(token) {
  if (token) {
    sessionStorage.setItem('authToken', token);
  } else {
    sessionStorage.removeItem('authToken');
  }
}

// Retorna o token atual do sessionStorage
function getAuthToken() {
  return sessionStorage.getItem('authToken') || '';
}

// Faz requisição autenticada à API
async function apiRequest(url, options = {}) {
  const token = getAuthToken();
  if (!token) {
    showToast('Faça login primeiro!', 'error');
    return null;
  }

  options.headers = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`,
    ...options.headers
  };

  try {
    const res = await fetch(API_BASE + url, options);
    const data = await res.json();

    if (!res.ok) {
      showToast(data.error || 'Erro na requisição', 'error');
      return null;
    }

    return data;
  } catch (err) {
    showToast('Erro de conexão com a API', 'error');
    return null;
  }
}

// Solicita token JWT
async function requestToken(username, password) {
  const res = await fetch(API_BASE + '/auth/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password })
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.error || 'Credenciais inválidas');
  }

  return data;
}
