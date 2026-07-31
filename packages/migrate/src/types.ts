import type { MigrationContext } from './context.js';

/**
 * A single location in the project where a migration applies. Findings drive
 * the "doctor" report and are passed back into {@link Migration.fix}.
 */
export interface Finding {
  /** Path of the file the finding was located in. */
  filePath: string;
  /** 1-based line number of the finding. */
  line: number;
  /** Human-readable description of what was found at this location. */
  detail: string;
  /**
   * Docs section for this finding specifically. Defaults to
   * {@link Migration.docsUrl}, which is right for a migration whose findings are
   * all the same breaking change. Set it where one migration spans several
   * (the React Router ones), so the report links the subsection that applies
   * instead of making the reader hunt through the whole section.
   */
  docsUrl?: string;
}

/** The framework a migration targets. `core` applies regardless of framework. */
export type Framework = 'angular' | 'react' | 'vue' | 'core';

/**
 * Status of a migration. `experimental` migrations are skipped unless the user
 * explicitly opts in, letting us ship transforms for changes that are not yet
 * settled.
 */
export type MigrationStatus = 'stable' | 'experimental';

/**
 * A single breaking-change migration. Migrations are version-scoped via
 * {@link fromMajor}/{@link toMajor} so the engine can chain major-version hops,
 * and are otherwise self-contained: they know how to locate where they apply
 * ({@link detect}) and, when safe, how to apply the change ({@link fix}).
 */
export interface Migration {
  /** Stable identifier, e.g. `angular-standalone-imports`. */
  id: string;
  /** Framework this migration targets. */
  framework: Framework;
  /** Major version the project is migrating from. */
  fromMajor: number;
  /** Major version the project is migrating to. */
  toMajor: number;
  /** Release status; `experimental` migrations require explicit opt-in. */
  status: MigrationStatus;
  /** URL of the docs section describing this change. */
  docsUrl: string;
  /** Locate every place this migration applies. */
  detect(ctx: MigrationContext): Finding[];
  /** Apply the change in place. Omitted when the change is report-only. */
  fix?(ctx: MigrationContext): void;
}
