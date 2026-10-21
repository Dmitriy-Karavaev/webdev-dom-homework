import { commentsData } from '../public/data.js';
import { formatReplyQuote } from './utils.js';
import { renderComments } from '../public/render.js';

document.querySelector('.comments').addEventListener('click', (event) => {
  const target = event.target.closest('.like-button');
  if (!target) return;

  const commentId = parseInt(target.dataset.id, 10);
  const comment = commentsData.find((c) => c.id === commentId);
  if (!comment) return;

  comment.isLiked = !comment.isLiked;
  comment.likesCount += comment.isLiked ? 1 : -1;

  renderComments('.comments', commentsData);
});

document.querySelector('.comments').addEventListener('click', (event) => {
  const card = event.target.closest('.comment');
  if (!card) return;

  const isLikeButton = event.target.closest('.like-button');
  if (isLikeButton) return;

  const commentId = parseInt(card.dataset.id, 10);
  const comment = commentsData.find((c) => c.id === commentId);
  if (!comment) return;

  startReply(comment);
});

function startReply(comment) {
  const textInput = document.querySelector('.add-form-text');
  const cancelBtn = document.querySelector('.cancel-reply-button');

  textInput.value = formatReplyQuote(comment.name, comment.text);
  textInput.dataset.replyTo = comment.id;
  cancelBtn.style.display = 'inline-block';
}

document.querySelector('.cancel-reply-button').addEventListener('click', () => {
  const textInput = document.querySelector('.add-form-text');
  const cancelBtn = document.querySelector('.cancel-reply-button');

  textInput.value = '';
  textInput.dataset.replyTo = '';
  cancelBtn.style.display = 'none';
});

const nameInput = document.querySelector('.add-form-name');
const commentInput = document.querySelector('.add-form-text');
const addBtn = document.querySelector('.add-form-button');

addBtn.addEventListener('click', () => {
  const name = nameInput.value.trim();
  const text = commentInput.value.trim();

  if (!name || !text) {
    alert('Пожалуйста, заполните и имя, и комментарий.');
    return;
  }

  const now = new Date();
  const day = String(now.getDate()).padStart(2, '0');
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const year = now.getFullYear().toString().slice(-2);
  const hours = String(now.getHours()).padStart(2, '0');
  const minutes = String(now.getMinutes()).padStart(2, '0');

  const dateString = `${day}.${month}.${year} ${hours}:\${minutes}`;

  const parentId = commentInput.dataset.replyTo
    ? parseInt(commentInput.dataset.replyTo, 10)
    : null;

  const newComment = {
    id: Date.now(),
    name,
    text,
    date: dateString,
    likesCount: 0,
    isLiked: false,
    parentId,
  };

  commentsData.unshift(newComment);

  nameInput.value = '';
  commentInput.value = '';
  commentInput.dataset.replyTo = '';
  document.querySelector('.cancel-reply-button').style.display = 'none';

  renderComments('.comments', commentsData);
});
