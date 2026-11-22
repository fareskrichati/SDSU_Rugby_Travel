// Next.js may construct Request.url with an internal hostname behind a proxy.
// Compare browser Origin with the actual request Host instead.
export function hasSameOrigin(request) {
  try {
    const origin = new URL(request.headers.get('origin') || '');
    return ['http:', 'https:'].includes(origin.protocol) && origin.host === request.headers.get('host');
  } catch { return false; }
}
