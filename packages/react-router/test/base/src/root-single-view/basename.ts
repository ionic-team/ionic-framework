/**
 * The prefix the root single view app is served under, appended to Vite's base so
 * previews keep working.
 *
 * Kept apart from the app itself so Main.tsx can link to it without pulling a second
 * IonReactRouter into App's module graph.
 */
export const ROOT_SINGLE_VIEW_BASENAME = `${import.meta.env?.BASE_URL?.replace(/\/$/, '') || ''}/root-single-view`;
