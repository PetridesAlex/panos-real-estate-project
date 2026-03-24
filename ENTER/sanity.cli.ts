import {defineCliConfig} from 'sanity/cli'

/**
 * Hosted Studio (same project d7j11dpu / production):
 * - Short link (redirects): https://unitedproperties-eu.sanity.studio
 * - Canonical Studio URL (use if the short link hangs in the browser):
 *   https://www.sanity.io/@oGxctQ0AW/studio/lcsp3cr8syu9em899qg7e2gb
 *
 * studioHost must stay unique across Sanity; change only if deploy says it is taken.
 */
export default defineCliConfig({
  api: {
    projectId: 'd7j11dpu',
    dataset: 'production',
  },
  /**
   * Required for non-interactive `sanity deploy` (CI / no TTY).
   * Also documents the canonical hosted Studio subdomain for this project.
   */
  studioHost: 'unitedproperties-eu',
  deployment: {
    /** Set by first successful `sanity deploy` — keeps future deploys non-interactive. */
    appId: 'lcsp3cr8syu9em899qg7e2gb',
    /**
     * Enable auto-updates for studios.
     * Learn more at https://www.sanity.io/docs/studio/latest-version-of-sanity#k47faf43faf56
     */
    autoUpdates: true,
  },
})
