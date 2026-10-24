import { delay } from './api.js';

export function renderComments(selector, data) {
  const commentsList = document.querySelector(selector);
  if (!commentsList) return;

  commentsList.innerHTML = '';
  const fragment = document.createDocumentFragment();

  data.forEach((comment) => {
    const li = document.createElement('li');
    li.className = 'comment';
    li.dataset.id = comment.id;

    // ... остальной код создания заголовка и тела комментария ...

    const footer = document.createElement('div');
    footer.className = 'comment-footer';
    
    // Блок с лайками
    const likesBlock = document.createElement('div');
    likesBlock.className = 'likes';
    
    const likeBtn = document.createElement('button');
    likeBtn.className = 'like-button';
    likeBtn.type = 'button';
    likeBtn.dataset.id = comment.id;
    likeBtn.dataset.liked = comment.isLiked ? 'true' : 'false';

    // обработчик клика
    likeBtn.addEventListener('click', () => {
      // Проверяем, не крутится ли уже анимация
      if (likeBtn.classList.contains('loading-like')) return;

      // анимациz
      likeBtn.classList.add('loading-like');

      // Имитируем запрос к серверу
      delay(1000) // задержка 1 секунда
        .then(() => {
          // Меняем состояние лайка
          comment.isLiked = !comment.isLiked;
          comment.likes = comment.isLiked ? comment.likes + 1 : comment.likes - 1;

          // Обновляем классы и данные
          if (comment.isLiked) {
            likeBtn.classList.add('active-like');
            likeBtn.dataset.liked = 'true';
          } else {
            likeBtn.classList.remove('active-like');
            likeBtn.dataset.liked = 'false';
          }

          // Обновляем счетчик лайков
          const likeCount = likeBtn.previousElementSibling;
          if (likeCount) {
            likeCount.textContent = comment.likes;
          }
        })
        .finally(() => {
          // Убираем анимацию загрузки
          likeBtn.classList.remove('loading-like');
        });
    });

    const likeCount = document.createElement('span');
    likeCount.className = 'likes-counter';
    likeCount.textContent = comment.likes || 0;

    // Добавляем элементы в DOM
    likesBlock.appendChild(likeCount);
    likesBlock.appendChild(likeBtn);
    footer.appendChild(likesBlock);

    li.appendChild(header);
    li.appendChild(body);
    li.appendChild(footer);
    fragment.appendChild(li);
  });

  commentsList.appendChild(fragment);
}

function escapeHtml(str) {
  if (!str) return '';
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function formatDate(dateString) {
  if (!dateString) return '';
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return '';
  return date.toLocaleString('ru-RU', {
    day: 'numeric',
    month: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
}