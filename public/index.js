import { commentsData } from './data.js';
import { renderComments } from './render.js';
import { escapeHtml, formatReplyQuote } from './utils.js';
import { initForm } from './form.js';

document.addEventListener('DOMContentLoaded', () => {
  
  renderComments('.comments', commentsData);

   initForm();
});