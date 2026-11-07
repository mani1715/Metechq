/** Restrict persisted project links to web URLs and same-site relative paths. */
export function safeProjectUrl(value) {
  if (typeof value !== 'string') return '';
  const url = value.trim();
  if (!url || /[\u0000-\u001f\\]/.test(url)) return '';
  if (url.startsWith('/') && !url.startsWith('//')) return url;
  try {
    const parsed = new URL(url);
    return ['http:', 'https:'].includes(parsed.protocol) && !parsed.username && !parsed.password ? url : '';
  } catch { return ''; }
}
