/**
 * The version the `@ionic/*` packages are pinned to when migrating to v9.
 *
 * v9 is not yet published under the `latest` dist-tag, so a caret range like
 * `^9.0.0` will not resolve. Until v9 ships, this pins a specific `major-9.0`
 * dev build. It is versioned `8.8.x-dev` (not `9.0.0-dev`) because the
 * `major-9.0` branch has not bumped its base version yet, but the code is v9.
 *
 * We pin the exact version rather than the `dev` dist-tag because that tag is
 * shared with `main`'s dev builds and moves whenever any dev build publishes.
 *
 * Swap this for `^9.0.0` (or `latest`) at GA.
 */
export const IONIC_V9_VERSION = '8.8.14-dev.11784563563.137a903a';
