/**
 * Base URL of the v9 upgrade guide, for per-finding anchors in the migrations
 * whose findings span several of its sections.
 *
 * `Migration.docsUrl` deliberately doesn't use it. Every migration spells that
 * link as a literal so it matches the `Refer to <url>` line in its own doc
 * comment, which can't interpolate.
 */
export const V9_DOCS = 'https://ionicframework.com/docs/updating/9-0';
