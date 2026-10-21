export function escapeHtml(str) {
  if (!str) return '';
  return str
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
}

export function formatReplyQuote(name, text) {
  const escapedName = escapeHtml(name);
  const escapedText = escapeHtml(text);
  return `> ${escapedName}: ${escapedText}\n\n`;
}
