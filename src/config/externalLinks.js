/**
 * Hosted Sanity Studio (Portal — team login).
 * Set `VITE_SANITY_STUDIO_URL` in `.env` to override without code changes.
 */
export const SANITY_STUDIO_URL =
  typeof import.meta !== 'undefined' && import.meta.env?.VITE_SANITY_STUDIO_URL
    ? String(import.meta.env.VITE_SANITY_STUDIO_URL)
    : 'https://www.sanity.io/@oGxctQ0AW/studio/lcsp3cr8syu9em899qg7e2gb/default/structure'
