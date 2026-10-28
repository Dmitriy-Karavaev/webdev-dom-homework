document.addEventListener('DOMContentLoaded', () => {
    const API_URL = 'https://wedev-api.sky.pro/api/v1/Dmitriy-Karavaev';
    const appContainer = document.getElementById('app'); // Ищем контейнер в HTML

    if (!appContainer) {
        console.error('Контейнер #app не найден в HTML. Добавьте <div id="app"></div> в body.');
        return;
    }

    function escapeHtml(str) {
        if (!str) return '';
        return str.replace(/[&<>"']/g, c => ({
            '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
        })[c]);
    }

    async function authFetch(url, options = {}) {
        const token = localStorage.getItem('token');
        const headers = new Headers(options.headers);
        if (token) headers.set('Authorization', `Bearer ${token}`);
        const res = await fetch(url, { ...options, headers });
        
        if (res.status === 401) {
            localStorage.removeItem('token');
            window.location.href = '/login';
            throw new Error('Сессия истекла');
        }
        if (!res.ok) {
            const err = await res.json().catch(() => ({}));
            throw new Error(err.message || `Ошибка ${res.status}`);
        }
        return res;
    }

    async function getUserProfile() {
        const res = await authFetch(`${API_URL}/profile`);
        return res.json();
    }

    async function loadComments() {
        try {
            const res = await fetch(`${API_URL}/comments`);
            if (!res.ok) throw new Error('Не удалось загрузить комментарии');
            const data = await res.json();
            return Array.isArray(data) ? data : (data.comments || '');
        } catch (err) {
            console.error('Ошибка загрузки комментариев:', err);
            return ;
        }
    }

    function renderLoginPage() {
        document.body.innerHTML = `
            <div class="login-container">
                <h2>Авторизация</h2>
                <form id="loginForm">
                    <input id="email" type="email" placeholder="Email" required>
                    <input id="password" type="password" placeholder="Пароль" required>
                    <button type="submit">Войти</button>
                    <div id="error" style="color:red"></div>
                </form>
            </div>
        `;

        const form = document.getElementById('loginForm');
        if (form) {
            form.addEventListener('submit', async (e) => {
                e.preventDefault();
                const email = document.getElementById('email').value.trim();
                const password = document.getElementById('password').value.trim();
                const errorEl = document.getElementById('error');
                errorEl.textContent = '';

                try {
                    const res = await fetch(`${API_URL}/login`, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ email, password })
                    });

                    if (!res.ok) {
                        const err = await res.json();
                        throw new Error(err.message || 'Неверный логин или пароль');
                    }

                    const { token } = await res.json();
                    localStorage.setItem('token', token);
                    window.location.href = '/';
                } catch (err) {
                    errorEl.textContent = err.message;
                }
            });
        }
    }

    function renderFeedPage(comments, isAuth, user) {
        const formHtml = isAuth && user
            ? `
                <div class="comment-form">
                    <form id="commentForm">
                        <input type="text" value="${escapeHtml(user.name)}" readonly>
                        <textarea id="text" placeholder="Ваш комментарий" required></textarea>
                        <button type="submit">Написать</button>
                    </form>
                </div>
              `
            : `
                <div class="login-link">
                    <p>Чтобы добавить комментарий, <a href="/login">авторизуйтесь</a></p>
                </div>
              `;

        const commentsHtml = comments.map(c => `
            <li class="comment">
                <div class="comment-header">
                    <span>${escapeHtml(c.name)}</span>
                    <span>${new Date(c.date).toLocaleString()}</span>
                </div>
                <div class="comment-body">
                    <p>${escapeHtml(c.text)}</p>
                </div>
                <div class="comment-footer">
                    <div class="likes">
                        <span class="likes-counter">0</span>
                        <button type="button" class="like-button" aria-label="Лайк"></button>
                    </div>
                </div>
            </li>
        `).join('');

        appContainer.innerHTML = `
            <div class="comments-container">
                <h1>Лента комментариев</h1>
                <ul class="comments" id="comments-list">
                    ${commentsHtml}
                </ul>
                ${formHtml}
            </div>
        `;

        // Навешиваем обработчик отправки формы ТОЛЬКО если пользователь авторизован
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
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({ name: user.name, text })
                        });

                        window.location.reload();
                    } catch (err) {
                        alert(err.message);
                    }
                });
            }
        }
    }

    async function init() {
        const path = window.location.pathname;
        
        if (path === '/login') {
            renderLoginPage();
        } else {
            const isAuth = !!localStorage.getItem('token');
            let user = null;

            if (isAuth) {
                try {
                    user = await getUserProfile();
                } catch (error) {
                    console.error('Ошибка получения профиля:', error);
                }
            }

            const comments = await loadComments();
            renderFeedPage(comments, isAuth, user);
        }
    }

    init();
});
