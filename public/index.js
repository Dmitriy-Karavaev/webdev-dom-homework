import { commentsData } from './data.js';
import { renderComments } from './render.js';
import { escapeHtml, formatReplyQuote } from './utils.js';

document.addEventListener('DOMContentLoaded', () => {
  renderComments('.comments', commentsData);

  const nameInput = document.querySelector('.add-form-name');
  const commentInput = document.querySelector('.add-form-text');
  const submitBtn = document.querySelector('.add-form-button');

  if (!nameInput || !commentInput || !submitBtn) {
    console.warn('Элементы формы не найдены. Проверьте классы в index.html');
    return;
  }

  submitBtn.addEventListener('click', (e) => {
    e.preventDefault(); // Важно: не даем форме перезагружать страницу

    const name = nameInput.value.trim();
    const text = commentInput.value.trim();

    if (!name || !text) {
      alert('Пожалуйста, заполните имя и текст комментария');
      return;
    }

    commentsData.push({
      id: Date.now(),
      name,
      text,
      date: new Date().toLocaleString('ru-RU'),
      likesCount: 0,       
      isLiked: false,
      parentId: null       
    });

    renderComments('.comments', commentsData);

    nameInput.value = '';
    commentInput.value = '';
  });
});