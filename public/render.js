import { escapeHtml } from './utils.js';
import { login, register, authFetch, toggleLike, API_URL } from './api.js';

export function renderLoginPage() {
  const app = document.getElementById('app');
  if (!app) return;

  app.innerHTML = `
    <div class="login-container">
      <h2 id="authTitle">Авторизация</h2>

      <form id="loginForm">
        <input id="login" type="text" placeholder="Логин" autocomplete="username" required>
        <input id="password" type="password" placeholder="Пароль" autocomplete="current-password" required>
        <button type="submit">Войти</button>
        <div id="error" class="form-error"></div>
      </form>

      <form id="registerForm" style="display:none">
        <input id="regName" type="text" placeholder="Имя" required>
        <input id="regLogin" type="text" placeholder="Придумайте логин" autocomplete="username" required>
        <input id="regPassword" type="password" placeholder="Придумайте пароль" autocomplete="new-password" required>
        <button type="submit">Зарегистрироваться</button>
        <div id="regError" class="form-error"></div>
      </form>

      <p><a href="#" id="toggleAuth">Нет аккаунта? Зарегистрироваться</a></p>
    </div>
  `;

  const loginForm = document.getElementById('loginForm');
  const registerForm = document.getElementById('registerForm');
  const toggle = document.getElementById('toggleAuth');
  const title = document.getElementById('authTitle');

  toggle.addEventListener('click', (e) => {
    e.preventDefault();
    const goingToRegister = registerForm.style.display === 'none';
    loginForm.style.display = goingToRegister ? 'none' : 'block';
    registerForm.style.display = goingToRegister ? 'block' : 'none';
    title.textContent = goingToRegister ? 'Регистрация' : 'Авторизация';
    toggle.textContent = goingToRegister
      ? 'Уже есть аккаунт? Войти'
      : 'Нет аккаунта? Зарегистрироваться';
  });

  // --- Вход ---
  loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const loginValue = document.getElementById('login').value.trim();
    const password = document.getElementById('password').value.trim();
    const errorEl = document.getElementById('error');
    errorEl.textContent = '';

    try {
      const user = await login(loginValue, password);
      localStorage.setItem('token', user.token);
      localStorage.setItem('user', JSON.stringify(user));
      window.location.hash = '#/comments';
      window.location.reload();
    } catch (err) {
      errorEl.textContent = err.message;
    }
  });

  // --- Регистрация ---
  registerForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const name = document.getElementById('regName').value.trim();
    const loginValue = document.getElementById('regLogin').value.trim();
    const password = document.getElementById('regPassword').value.trim();
    const errorEl = document.getElementById('regError');
    errorEl.textContent = '';

    if (password.length < 6) {
      errorEl.textContent = 'Пароль должен быть не короче 6 символов';
      return;
    }

    if (loginValue.length < 3) {
      errorEl.textContent = 'Логин должен быть не короче 3 символов';
      return;
    }

    try {
      const user = await register(loginValue, password, name);
      localStorage.setItem('token', user.token);
      localStorage.setItem('user', JSON.stringify(user));
      window.location.hash = '#/comments';
      window.location.reload();
    } catch (err) {
      errorEl.textContent = err.message;
    }
  });
}

export function renderFeedPage(comments, isAuth, user) {
  let formHtml = '';

  if (isAuth && user) {
    formHtml = `
      <div class="comment-form">
        <form id="commentForm">
          <input type="text" value="${escapeHtml(user.name)}" readonly>
          <textarea id="text" placeholder="Ваш комментарий" required></textarea>
          <button type="submit">Написать</button>
        </form>
      </div>
    `;
  } else {
    formHtml = `
      <div class="guest-card">
        <p class="guest-text">Чтобы добавить комментарий, нажмите:</p>
        <button id="js-login-btn" class="login-btn" type="button">Войти</button>
      </div>
    `;
  }

  const likedIds = JSON.parse(localStorage.getItem('likedComments') || '[]');

  const commentsHtml = comments.map(c => {
    const liked = likedIds.includes(c.id);
    const baseLikes = c.likes || 0;
    const displayedLikes = baseLikes + (liked ? 1 : 0);

    return `
    <li class="comment" data-id="${c.id}" data-likes="${baseLikes}">
      <div class="comment-header">
        <span>${escapeHtml(c.name)}</span>
        <span>${new Date(c.date).toLocaleString()}</span>
      </div>
      <div class="comment-body">
        <p>${escapeHtml(c.text)}</p>
      </div>
      <div class="comment-footer">
        <div class="likes">
          <span class="likes-counter">${displayedLikes}</span>
          <button type="button" class="like-button ${liked ? '-active-like' : ''}" aria-label="Лайк"></button>
        </div>
      </div>
    </li>
  `;
  }).join('');

  const appContainer = document.getElementById('app');
  if (!appContainer) {
    console.error('Контейнер #app не найден в HTML.');
    return;
  }

  appContainer.innerHTML = `
    <div class="comments-container">
      <div class="feed-header">
        ${isAuth && user
          ? `<span class="user-name">Вы вошли как: <b>${escapeHtml(user.name)}</b></span>
             <button type="button" id="logout-btn" class="logout-btn">Выйти</button>`
          : ''}
      </div>
      <h1>Лента комментариев</h1>
      <ul class="comments" id="comments-list">
        ${commentsHtml}
      </ul>
      ${formHtml}
    </div>
  `;

  // --- Форма комментария или кнопка входа ---
  if (isAuth && user) {
    const form = document.getElementById('commentForm');
    if (form) {
      form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const text = document.getElementById('text').value.trim();

        if (text.length < 3) {
          alert('Комментарий должен содержать минимум 3 символа!');
          return;
        }

        try {
          await authFetch(`${API_URL}/comments`, {
            method: 'POST',
            body: JSON.stringify({ name: user.name, text })
          });
          window.location.reload();
        } catch (err) {
          alert(err.message);
        }
      });
    }
  } else {
    const loginBtn = document.getElementById('js-login-btn');
    if (loginBtn) {
      loginBtn.addEventListener('click', () => {
        window.location.hash = '#/login';
      });
    }
  }

  // --- Лайки ---
  const commentsContainer = document.getElementById('comments-list');
  if (commentsContainer) {
    commentsContainer.addEventListener('click', (e) => {
      const btn = e.target.closest('.like-button');
      if (!btn) return;

      const commentEl = btn.closest('.comment');
      if (!commentEl) return;

      const id = Number(commentEl.dataset.id);
      if (!id) return;

      const counter = commentEl.querySelector('.likes-counter');
      if (!counter) return;

      const likedIds = JSON.parse(localStorage.getItem('likedComments') || '[]');
      const idx = likedIds.indexOf(id);

      if (idx === -1) {
        likedIds.push(id);
      } else {
        likedIds.splice(idx, 1);
      }
      localStorage.setItem('likedComments', JSON.stringify(likedIds));

      const baseLikes = Number(commentEl.dataset.likes) || 0;
      const liked = idx === -1;
      counter.textContent = baseLikes + (liked ? 1 : 0);
      btn.classList.toggle('-active-like', liked);
    });
  }

  // --- Выход из аккаунта ---
  const logoutBtn = document.getElementById('logout-btn');
  if (logoutBtn) {
    logoutBtn.addEventListener('click', () => {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.hash = '#/login';
      window.location.reload();
    });
  }
}
