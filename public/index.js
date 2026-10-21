import { commentsData } from './data.js';
import { renderComments } from './render.js';
import { escapeHtml, formatReplyQuote } from './utils.js';

renderComments('.comments', commentsData);
