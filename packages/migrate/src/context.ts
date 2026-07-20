import { Project } from 'ts-morph';

/** Join a root dir and a relative path using posix separators. */
function join(root: string, rel: string): string {
  return `${root.replace(/\/$/, '')}/${rel.replace(/^\//, '')}`;
}

/** Build/vendor directories that no glob or source load should descend into. */
const EXCLUDE_DIRS = ['node_modules', 'dist', 'www', '.angular', '.git'];

/** Matches a path under any {@link EXCLUDE_DIRS} entry, derived from that list. */
const EXCLUDE_RE = new RegExp(`(^|/)(${EXCLUDE_DIRS.map((d) => d.replace(/\./g, '\\.')).join('|')})/`);

/** Negative glob patterns (one per {@link EXCLUDE_DIRS} entry) rooted at `root`. */
function EXCLUDE_GLOBS(root: string): string[] {
  return EXCLUDE_DIRS.map((dir) => `!${join(root, `**/${dir}/**`)}`);
}

/**
 * The surface a migration operates on. TypeScript/TSX transforms use
 * {@link project} (ts-morph); config, CSS, HTML, and Vue-SFC edits use
 * {@link readFile}/{@link writeFile}. Both are backed by a single filesystem
 * (in-memory for tests, real disk for the CLI). Note the two views are not
 * auto-synced: ts-morph caches the text of files it has loaded, so a
 * {@link writeFile} to a `.ts`/`.tsx` file ts-morph also holds will be clobbered
 * by the next {@link save}. Today no migration edits a loaded file both ways, so
 * a given file is only ever touched through one view.
 */
export interface MigrationContext {
  /** Project root; all relative paths resolve against it. */
  readonly rootDir: string;
  /** ts-morph project holding the loaded `.ts`/`.tsx` source files. */
  readonly project: Project;
  /** Read a file's text, or `undefined` if it does not exist. */
  readFile(relPath: string): string | undefined;
  /** Write a file's text, creating it if needed. */
  writeFile(relPath: string, content: string): void;
  /** Return paths (relative to {@link rootDir}) matching the given glob patterns. */
  glob(patterns: string[]): string[];
  /** Convert an absolute path to one relative to {@link rootDir}. */
  relative(absPath: string): string;
  /** Persist any pending ts-morph edits to the underlying filesystem. */
  save(): void;
}

function buildContext(rootDir: string, project: Project): MigrationContext {
  const fs = project.getFileSystem();
  return {
    rootDir,
    project,
    readFile(relPath) {
      const abs = join(rootDir, relPath);
      return fs.fileExistsSync(abs) ? fs.readFileSync(abs) : undefined;
    },
    writeFile(relPath, content) {
      fs.writeFileSync(join(rootDir, relPath), content);
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
    relative(absPath) {
      const prefix = `${rootDir.replace(/\/$/, '')}/`;
      return absPath.startsWith(prefix) ? absPath.slice(prefix.length) : absPath;
    },
    save() {
      project.saveSync();
    },
  };
}

/**
 * Build a context whose filesystem lives entirely in memory. `.ts`/`.tsx`
 * entries are loaded as ts-morph source files; everything else is written as a
 * plain file. Used by tests.
 */
export function createInMemoryContext(files: Record<string, string>, rootDir = '/app'): MigrationContext {
  const project = new Project({ useInMemoryFileSystem: true });
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
