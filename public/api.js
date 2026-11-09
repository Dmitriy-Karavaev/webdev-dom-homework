export const API_URL = 'https://wedev-api.sky.pro/api/v1/Dmitriy-Karavaev';
const AUTH_URL = 'https://wedev-api.sky.pro/api/user';

export async function authFetch(url, options = {}) {
  const token = localStorage.getItem('token');
  const headers = new Headers(options.headers);
  if (token) headers.set('Authorization', `Bearer ${token}`);

  const res = await fetch(url, { ...options, headers });

  if (res.status === 401) {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.hash = '#/login';
    window.location.reload();
    throw new Error('Сессия истекла, войдите снова');
  }
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || err.message || `Ошибка ${res.status}`);
  }
  return res;
}

export async function getUserProfile() {
  const res = await authFetch(`${API_URL}/profile`);
  return res.json();
}

export async function loadComments() {
  try {
    const res = await fetch(`${API_URL}/comments`);
    if (!res.ok) throw new Error('Не удалось загрузить комментарии');
    const data = await res.json();
    return Array.isArray(data) ? data : (data.comments || []);
  } catch (err) {
    console.error('Ошибка загрузки комментариев:', err);
    return [];
  }
}

export async function login(loginValue, password) {
  const res = await fetch(`${AUTH_URL}/login`, {
    method: 'POST',
    body: JSON.stringify({ login: loginValue, password }),
  });

  if (!res.ok) {
    const errData = await res.json().catch(() => ({}));
    throw new Error(errData.error || errData.message || 'Неверный логин или пароль');
  }
  const data = await res.json();
  return data.user;
}

export async function register(loginValue, password, name) {
  const response = await fetch(AUTH_URL, {
    method: 'POST',
    body: JSON.stringify({ login: loginValue, password, name }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || errorData.message || 'Ошибка регистрации');
  }

  return response.json();
}

export async function toggleLike(id) {
  const res = await authFetch(`${API_URL}/comments/${id}`, {
    method: 'PATCH',
    body: JSON.stringify({ isLiked: true }),
  });
  return await res.json();
}