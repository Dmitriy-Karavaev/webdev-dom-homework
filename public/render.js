import { escapeHtml } from './utils.js';

export function renderComments(selector, data) {
  const commentsList = document.querySelector(selector);
  if (!commentsList) return;

  commentsList.innerHTML = '';

  data.forEach((comment) => {
    const activeClass = comment.isLiked ? 'liked' : '';

    const li = document.createElement('li');
    li.className = 'comment';
    li.dataset.id = comment.id;

    li.innerHTML = `
      <div class="comment-header">
        <div>${escapeHtml(comment.name)}</div>
        <div>${comment.date}</div>
      </div>
      <div class="comment-body">
        <div class="comment-text">
          ${escapeHtml(comment.text)}
        </div>
      </div>
      <div class="comment-footer">
        <div class="likes">
          <button class="like-button ${activeClass}" data-id="${comment.id}"></button>
          <span class="likes-counter">${comment.likesCount}</span>
        </div>
      </div>
    `;

    commentsList.appendChild(li);
  });
}
