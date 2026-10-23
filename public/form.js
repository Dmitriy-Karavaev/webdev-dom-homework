import { commentsData } from './data.js';
import { renderComments } from './render.js';

export function initForm() {
  const nameInput = document.querySelector('.add-form-name');
  const commentInput = document.querySelector('.add-form-text');
  const submitBtn = document.querySelector('.add-form-button');

  if (!nameInput || !commentInput || !submitBtn) {
    console.warn('⚠️ Элементы формы не найдены. Проверь классы в index.html');
    return;
  }

  submitBtn.addEventListener('click', (e) => {
    e.preventDefault();

    const name = nameInput.value.trim();
    const text = commentInput.value.trim();

    if (!name || !text) {
      alert('Пожалуйста, заполните и имя, и текст комментария');
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
}