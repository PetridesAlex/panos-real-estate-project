/**
 * POST target for website → Sanity inquiry creation.
 * - Production: same-origin `/api/inquiries` (Vercel serverless).
 * - Local Vite dev: Vite has no `/api` handler — POST to deployed origin instead.
 *   Set `VITE_INQUIRY_API_URL` or it defaults to production (no secret in browser).
 */
export function getInquiryPostUrl() {
  const path = '/api/inquiries'
  if (typeof import.meta === 'undefined' || !import.meta.env?.DEV) {
    return path
  }
  const explicit =
    (typeof import.meta.env?.VITE_INQUIRY_API_URL === 'string'
      ? import.meta.env.VITE_INQUIRY_API_URL.trim()
      : '') ||
    (typeof import.meta.env?.VITE_INQUIRY_API_ORIGIN === 'string'
      ? import.meta.env.VITE_INQUIRY_API_ORIGIN.trim()
      : '')
  const origin =
    explicit.replace(/\/+$/, '') || 'https://www.unitedproperties.eu'
  return `${origin}${path}`
}
