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

    //заголовок комментария
    const header = document.createElement('div');
    header.className = 'comment-header';

    const authorName = typeof comment.author === 'object' 
      ? (comment.author.name || comment.author.id) 
      : comment.author;

header.textContent = authorName || 'Анонимный пользователь';

    //тело комментария
    const body = document.createElement('div');
    body.className = 'comment-body';
    body.textContent = comment.text || 'Нет текста';

    const footer = document.createElement('div');
    footer.className = 'comment-footer';
    
    //Блок с лайками
    const likesBlock = document.createElement('div');
    likesBlock.className = 'likes';
    
    const likeBtn = document.createElement('button');
    likeBtn.className = 'like-button';
    likeBtn.type = 'button';
    likeBtn.dataset.id = comment.id;
    likeBtn.dataset.liked = comment.isLiked ? 'true' : 'false';

    //обработчик клика
    likeBtn.addEventListener('click', () => {
      if (likeBtn.classList.contains('loading-like')) return;

      likeBtn.classList.add('loading-like');

      delay(1000)
        .then(() => {
          comment.isLiked = !comment.isLiked;
          comment.likes = comment.isLiked ? comment.likes + 1 : comment.likes - 1;

          if (comment.isLiked) {
            likeBtn.classList.add('active-like');
            likeBtn.dataset.liked = 'true';
          } else {
            likeBtn.classList.remove('active-like');
            likeBtn.dataset.liked = 'false';
          }

          const likeCount = likeBtn.previousElementSibling;
          if (likeCount) {
            likeCount.textContent = comment.likes;
          }
        })
        .finally(() => {
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

    li.appendChild(header);    // добавляем заголовок
    li.appendChild(body);      // добавляем тело
    li.appendChild(footer);    // добавляем футер
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