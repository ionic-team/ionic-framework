import { Project, QuoteKind } from 'ts-morph';

/** ts-morph should emit single-quoted strings to match Ionic/Angular style. */
const MANIPULATION_SETTINGS = { quoteKind: QuoteKind.Single } as const;

/** Join a root dir and a relative path using posix separators. */
function join(root: string, rel: string): string {
  return `${root.replace(/\/$/, '')}/${rel.replace(/^\//, '')}`;
}

/**
 * Build/vendor directories that no glob or source load should descend into, at
 * any depth. `node_modules` in particular nests in monorepos, so these must
 * match wherever they appear.
 */
const EXCLUDE_DIRS = ['node_modules', 'dist', 'www', '.angular', '.git'];

/**
 * Excludes anchored to the project root only. Capacitor's `ios`/`android`
 * platforms and the `build/` output dir sit at the root, and their `public/`
 * folders hold a copy of the built (minified) web bundle - scanning those
 * produces false matches against bundled Ionic code, not the app's own source.
 * Root-anchored so an app source folder that merely shares one of these names
 * deeper in the tree (e.g. `src/theme/ios/`) is still scanned.
 */
const ROOT_EXCLUDE_DIRS = ['ios', 'android', 'build'];

/** Matches a path under any excluded directory, derived from the lists above. */
const EXCLUDE_RE = new RegExp(
  `(^|/)(${EXCLUDE_DIRS.map((d) => d.replace(/\./g, '\\.')).join('|')})/` +
    `|^(${ROOT_EXCLUDE_DIRS.map((d) => d.replace(/\./g, '\\.')).join('|')})/`
);

/** Negative glob patterns (one per excluded directory) rooted at `root`. */
function EXCLUDE_GLOBS(root: string): string[] {
  return [
    ...EXCLUDE_DIRS.map((dir) => `!${join(root, `**/${dir}/**`)}`),
    ...ROOT_EXCLUDE_DIRS.map((dir) => `!${join(root, `${dir}/**`)}`),
  ];
}

/**
 * The surface a migration operates on. TypeScript/TSX transforms use
 * {@link project} (ts-morph); config, CSS, HTML, and Vue-SFC edits use
 * {@link readFile}/{@link writeFile}. Both are backed by a single filesystem
 * (in-memory for tests, real disk for the CLI). Note the two views are not
 * auto-synced: {@link writeFile} buffers text writes that {@link save} flushes
 * after the ts-morph save, so writing a `.ts`/`.tsx` file ts-morph also holds
 * would override its edits. Today no migration edits a loaded file both ways, so
 * a given file is only ever touched through one view.
 */
export interface MigrationContext {
  /** Project root; all relative paths resolve against it. */
  readonly rootDir: string;
  /** ts-morph project holding the loaded `.ts`/`.tsx` source files. */
  readonly project: Project;
  /** Read a file's text, or `undefined` if it does not exist. */
  readFile(relPath: string): string | undefined;
  /** Buffer a file's text (creating it if needed); persisted by {@link save}. */
  writeFile(relPath: string, content: string): void;
  /** Return paths (relative to {@link rootDir}) matching the given glob patterns. */
  glob(patterns: string[]): string[];
  /** Convert an absolute path to one relative to {@link rootDir}. */
  relative(absPath: string): string;
  /**
   * Paths (relative to {@link rootDir}) that this run has modified, via either
   * {@link writeFile} or a ts-morph {@link save}. Drives the post-run formatter.
   */
  readonly touchedFiles: ReadonlySet<string>;
  /** Persist pending ts-morph edits and buffered text writes to the filesystem. */
  save(): void;
}

function buildContext(rootDir: string, project: Project): MigrationContext {
  const fs = project.getFileSystem();
  const touched = new Set<string>();
  // Text writes are buffered here and flushed only by `save()`. A run that
  // throws partway (a later migration failing) never calls `save()`, so nothing
  // lands on disk. This keeps the package.json version bump - which closes the
  // re-run gate - from persisting unless every migration and the ts-morph save
  // succeeded.
  const pendingWrites = new Map<string, string>();
  const toRelative = (abs: string): string => {
    const prefix = `${rootDir.replace(/\/$/, '')}/`;
    return abs.startsWith(prefix) ? abs.slice(prefix.length) : abs;
  };
  return {
    rootDir,
    project,
    touchedFiles: touched,
    readFile(relPath) {
      if (pendingWrites.has(relPath)) return pendingWrites.get(relPath);
      const abs = join(rootDir, relPath);
      return fs.fileExistsSync(abs) ? fs.readFileSync(abs) : undefined;
    },
    writeFile(relPath, content) {
      pendingWrites.set(relPath, content);
      touched.add(relPath);
    },
    glob(patterns) {
      const prefix = `${rootDir.replace(/\/$/, '')}/`;
      // Pass the excludes as negative patterns so the walk is pruned at the
      // source (fast-glob honors `!` entries) rather than enumerating all of
      // node_modules before discarding it. The post-filter stays as a backstop
      // for filesystems whose glob ignores negative patterns (e.g. in-memory).
      return fs
        .globSync([...patterns.map((p) => join(rootDir, p)), ...EXCLUDE_GLOBS(rootDir)])
        .map((abs) => (abs.startsWith(prefix) ? abs.slice(prefix.length) : abs))
        .filter((rel) => !EXCLUDE_RE.test(rel));
    },
    relative: toRelative,
    save() {
      // Record files ts-morph is about to write so the formatter can find them.
      for (const file of project.getSourceFiles()) {
        if (!file.isSaved()) touched.add(toRelative(file.getFilePath()));
      }
      // ts-morph edits first, then the buffered text writes, so the gate-closing
      // package.json bump is the last thing to hit disk.
      project.saveSync();
      for (const [relPath, content] of pendingWrites) {
        fs.writeFileSync(join(rootDir, relPath), content);
      }
      pendingWrites.clear();
    },
  };
}

/**
 * Build a context whose filesystem lives entirely in memory. `.ts`/`.tsx`
 * entries are loaded as ts-morph source files. Everything else is written as a
 * plain file. Used by tests.
 */
export function createInMemoryContext(files: Record<string, string>, rootDir = '/app'): MigrationContext {
  const project = new Project({
    useInMemoryFileSystem: true,
    manipulationSettings: MANIPULATION_SETTINGS,
  });
  const fs = project.getFileSystem();
  // Write everything to the filesystem so glob/readFile see it, mirroring how
  // the disk context works, then load TS sources into ts-morph.
  for (const [relPath, content] of Object.entries(files)) {
    fs.writeFileSync(join(rootDir, relPath), content);
  }
  project.addSourceFilesAtPaths([
    join(rootDir, '**/*.ts'),
    join(rootDir, '**/*.tsx'),
    ...EXCLUDE_GLOBS(rootDir),
  ]);
  return buildContext(rootDir, project);
}

/**
 * Build a context backed by real files on disk, rooted at `rootDir`. Loads the
 * project's TypeScript sources into ts-morph.
 */
export function createDiskContext(rootDir: string): MigrationContext {
  const project = new Project({
    skipAddingFilesFromTsConfig: true,
    compilerOptions: { allowJs: false },
    manipulationSettings: MANIPULATION_SETTINGS,
  });
  // Load the whole tree (minus build/vendor dirs), not just `src/`, so AST
  // migrations cover files outside `src/` (Angular multi-project workspaces and
  // monorepos keep sources there too). AST migrations are scoped to `.ts`/`.tsx`
  // by design (allowJs: false); JS/JSX React projects get the text-scan
  // migrations but not the AST-based ones (e.g. react-router-6-code).
  project.addSourceFilesAtPaths([
    join(rootDir, '**/*.ts'),
    join(rootDir, '**/*.tsx'),
    ...EXCLUDE_GLOBS(rootDir),
  ]);
  return buildContext(rootDir, project);
}
