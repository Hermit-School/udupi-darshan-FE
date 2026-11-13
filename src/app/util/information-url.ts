/** An internal navigation URL is not an external source of more information. */
export function informationUrl(value?: string | null, currentOrigin = globalThis.location?.origin): string | null {
  if (typeof value !== 'string' || !value.trim()) return null;
  try {
    const url = new URL(value.trim());
    if (!['https:', 'http:'].includes(url.protocol) || url.username || url.password) return null;
    const ownHosts = new Set(['udupi-darshan.web.app', 'udupi-darshan.firebaseapp.com']);
    if (currentOrigin) ownHosts.add(new URL(currentOrigin).hostname);
    return ownHosts.has(url.hostname) ? null : url.href;
  } catch { return null; }
}
