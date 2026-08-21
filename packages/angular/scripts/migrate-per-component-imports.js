/**
 * Rewrites barrel imports from `@ionic/angular` into per-component entryx points
 * so bundlers can code-split on a per-component basis.
 * Run from the root of an Angular project that depends on `@ionic/angular`.
 * E.g.
 *   import { IonButton, IonItem, Platform } from '@ionic/angular';
 * becomes
 *   import { Platform } from '@ionic/angular';
 *   import { IonButton } from '@ionic/angular/ion-button';
 *   import { IonItem } from '@ionic/angular/ion-item';
 * 
 * The symbol -> entry point map is read from the project's own installed copy of
 * @ionic/angular (its `exports` map + the matching `.d.ts` files), so it always matches
 * the version in use rather than a hardcoded list. Symbols that have no dedicated entry
 * point are left on the barrel import.
 */

const fs = require('fs');
const path = require('path');

const PACKAGE_NAME = '@ionic/angular';
const DEFAULT_EXTENSIONS = ['.ts', '.tsx', '.mts', '.cts', '.js', '.jsx', '.mjs', '.cjs'];
const SKIPPED_SUBPATHS = new Set(['./package.json', './lazy', './common']);
const SKIPPED_DIRECTORIES = new Set([
  '.angular',
  '.git',
  '.next',
  '.nx',
  '.yarn',
  'android',
  'build',
  'coverage',
  'dist',
  'ios',
  'node_modules',
  'out-tsc',
  'platforms',
  'tmp',
  'www',
]);

function parseArgs(argv) {
  const options = {
    dryRun: false,
    verbose: false,
    help: false,
    printMap: false,
    paths: [],
  };

  for (const arg of argv) {
    switch (arg) {
      case '--dry-run':
      case '-n':
        options.dryRun = true;
        break;
      case '--verbose':
      case '-v':
        options.verbose = true;
        break;
      case '--print-map':
        options.printMap = true;
        break;
      case '--help':
      case '-h':
        options.help = true;
        break;
      default:
        if (arg.startsWith('-')) {
          throw new Error(`Unknown option "${arg}". Run with --help for usage.`);
        }
        options.paths.push(arg);
    }
  }

  return options;
}

function printHelp() {
  console.log(`Usage: node migrate-per-component-imports.js [options] [paths...]

Splits ${PACKAGE_NAME} barrel imports into per-component entry points, one import per line.
Run from the root of the project you want to migrate. Defaults to every source file under
the current directory.

Options:
  -n, --dry-run       Report the changes without writing any files
  -v, --verbose       Print every rewritten import statement
      --print-map     Print the symbol -> entry point map and exit
  -h, --help          Show this message`);
}

function findInstalledIonicAngular(projectRoot) {
  try {
    return path.dirname(require.resolve(`${PACKAGE_NAME}/package.json`, { paths: [projectRoot] }));
  } catch {
    let dir = projectRoot;
    while (true) {
      const candidate = path.join(dir, 'node_modules', ...PACKAGE_NAME.split('/'));
      if (fs.existsSync(path.join(candidate, 'package.json'))) {
        return candidate;
      }
      const parent = path.dirname(dir);
      if (parent === dir) {
        return null;
      }
      dir = parent;
    }
  }
}

function resolveExportTarget(value) {
  if (typeof value === 'string') {
    return value;
  }
  if (value && typeof value === 'object') {
    for (const condition of ['types', 'default', 'import', 'module', 'require']) {
      if (value[condition] !== undefined) {
        const resolved = resolveExportTarget(value[condition]);
        if (resolved !== null) {
          return resolved;
        }
      }
    }
  }
  return null;
}

/** Collects the names a `.d.ts` file exports. */
function readExportedNames(declarationFile) {
  const names = new Set();
  if (!fs.existsSync(declarationFile)) {
    return names;
  }
  const source = fs.readFileSync(declarationFile, 'utf8');

  const declarations =
    /^export\s+(?:declare\s+)?(?:abstract\s+)?(?:class|const|let|var|function|interface|type|enum)\s+([A-Za-z_$][\w$]*)/gm;
  let match;
  while ((match = declarations.exec(source)) !== null) {
    names.add(match[1]);
  }

  const exportLists = /^export\s+(?:type\s+)?\{([^}]*)\}/gm;
  while ((match = exportLists.exec(source)) !== null) {
    for (const entry of splitSpecifiers(match[1])) {
      const exported = entry.split(/\s+as\s+/).pop().trim();
      if (exported && exported !== 'default') {
        names.add(exported);
      }
    }
  }

  return names;
}

/**
 * Builds `symbol -> entry point` from the installed package. A symbol exported by more
 * than one entry point is dropped so the migration never has to guess.
 */
function buildSymbolMap(packageDir, packageJson) {
  const symbolToEntryPoint = new Map();
  const ambiguous = new Set();

  for (const [subpath, value] of Object.entries(packageJson.exports || {})) {
    if (subpath === '.' || !subpath.startsWith('./') || subpath.includes('*')) continue;
    if (SKIPPED_SUBPATHS.has(subpath)) continue;

    const target = resolveExportTarget(value);
    if (!target || !target.endsWith('.js')) continue;

    const declarationFile = path.join(packageDir, target.replace(/\.js$/, '.d.ts'));
    const entryPoint = `${PACKAGE_NAME}/${subpath.slice(2)}`;

    for (const name of readExportedNames(declarationFile)) {
      const existing = symbolToEntryPoint.get(name);
      if (existing !== undefined && existing !== entryPoint) {
        ambiguous.add(name);
        symbolToEntryPoint.delete(name);
      } else if (!ambiguous.has(name)) {
        symbolToEntryPoint.set(name, entryPoint);
      }
    }
  }

  return { symbolToEntryPoint, ambiguous };
}

function splitSpecifiers(text) {
  return text
    .split(',')
    .map((entry) => entry.replace(/\s+/g, ' ').trim())
    .filter((entry) => entry.length > 0);
}

/** `type IonButton as Btn` -> `IonButton` */
function importedNameOf(specifier) {
  return specifier.replace(/^type\s+/, '').split(/\s+as\s+/)[0].trim();
}

function collectSourceFiles(targets) {
  const files = [];

  const walk = (dir) => {
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      const fullPath = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        if (!SKIPPED_DIRECTORIES.has(entry.name)) {
          walk(fullPath);
        }
      } else if (entry.isFile() && DEFAULT_EXTENSIONS.includes(path.extname(entry.name))) {
        files.push(fullPath);
      }
    }
  };

  for (const target of targets) {
    const stats = fs.statSync(target);
    if (stats.isDirectory()) {
      walk(target);
    } else if (stats.isFile()) {
      files.push(target);
    }
  }

  return files.sort();
}

/**
 * Rewrites every named import of `PACKAGE_NAME` in `source`, emitting one single-line
 * import statement per entry point.
 */
function rewriteSource(source, symbolToEntryPoint) {
  // Anchored to the start of a line so commented-out examples are left alone.
  const namedImport = new RegExp(
    `^([ \\t]*)import\\s+(type\\s+)?\\{([^}]*)\\}\\s*from\\s*(['"\`])${PACKAGE_NAME}\\4[ \\t]*;?`,
    'gm'
  );
  const anyReference = new RegExp(`(['"\`])${PACKAGE_NAME}\\1`, 'g');

  const rewrites = [];
  const unmapped = new Set();
  let handledReferences = 0;

  const output = source.replace(namedImport, (statement, indent, typeKeyword, body, quote) => {
    const specifiers = splitSpecifiers(body);
    if (specifiers.length === 0) {
      return statement;
    }

    const byEntryPoint = new Map();
    for (const specifier of specifiers) {
      const entryPoint = symbolToEntryPoint.get(importedNameOf(specifier)) || PACKAGE_NAME;
      if (entryPoint === PACKAGE_NAME) {
        unmapped.add(importedNameOf(specifier));
      }
      if (!byEntryPoint.has(entryPoint)) {
        byEntryPoint.set(entryPoint, []);
      }
      byEntryPoint.get(entryPoint).push(specifier);
    }

    if (byEntryPoint.size === 1 && byEntryPoint.has(PACKAGE_NAME)) {
      // Nothing to split out; leave the statement exactly as the author wrote it.
      handledReferences++;
      return statement;
    }

    // The leftover barrel import keeps the original position, the rest follow sorted.
    const entryPoints = [...byEntryPoint.keys()]
      .filter((entryPoint) => entryPoint !== PACKAGE_NAME)
      .sort();
    if (byEntryPoint.has(PACKAGE_NAME)) {
      entryPoints.unshift(PACKAGE_NAME);
    }

    const lines = entryPoints.map((entryPoint) => {
      let names = byEntryPoint.get(entryPoint);
      if (typeKeyword) {
        // `import type { type Foo }` is invalid, so inline modifiers are dropped.
        names = names.map((specifier) => specifier.replace(/^type\s+/, ''));
      }
      return `${indent}import ${typeKeyword ? 'type ' : ''}{ ${names.join(', ')} } from ${quote}${entryPoint}${quote};`;
    });

    const replacement = lines.join('\n');
    rewrites.push({ before: statement.trim(), after: replacement.trim() });
    handledReferences++;
    return replacement;
  });

  const totalReferences = (source.match(anyReference) || []).length;

  return {
    output,
    rewrites,
    unmapped,
    // Namespace imports, default imports, `export ... from`, dynamic imports: not rewritten.
    skippedReferences: Math.max(0, totalReferences - handledReferences),
  };
}

function main() {
  const options = parseArgs(process.argv.slice(2));
  if (options.help) {
    printHelp();
    return;
  }

  const projectRoot = process.cwd();
  const packageDir = findInstalledIonicAngular(projectRoot);
  if (packageDir === null) {
    console.error(`Could not find ${PACKAGE_NAME} in ${projectRoot}. Run this from a project root, after npm install.`);
    process.exitCode = 1;
    return;
  }

  const packageJson = JSON.parse(fs.readFileSync(path.join(packageDir, 'package.json'), 'utf8'));
  const { symbolToEntryPoint, ambiguous } = buildSymbolMap(packageDir, packageJson);

  if (symbolToEntryPoint.size === 0) {
    console.error(
      `${PACKAGE_NAME}@${packageJson.version} does not expose per-component entry points. ` +
        `Upgrade to v9 or later before running this script.`
    );
    process.exitCode = 1;
    return;
  }

  if (options.printMap) {
    for (const symbol of [...symbolToEntryPoint.keys()].sort()) {
      console.log(`${symbol} -> ${symbolToEntryPoint.get(symbol)}`);
    }
    return;
  }

  const targets = options.paths.length > 0 ? options.paths.map((p) => path.resolve(projectRoot, p)) : [projectRoot];
  for (const target of targets) {
    if (!fs.existsSync(target)) {
      console.error(`No such file or directory: ${target}`);
      process.exitCode = 1;
      return;
    }
  }

  console.log(
    `Splitting '${PACKAGE_NAME}' imports using ${PACKAGE_NAME}@${packageJson.version} ` +
      `(${symbolToEntryPoint.size} symbols across per-component entry points)${options.dryRun ? ' [dry run]' : ''}`
  );

  const files = collectSourceFiles(targets);
  const unmapped = new Set();
  let changedFiles = 0;
  let rewrittenStatements = 0;
  let skippedReferences = 0;

  for (const file of files) {
    const source = fs.readFileSync(file, 'utf8');
    if (!source.includes(PACKAGE_NAME)) {
      continue;
    }

    const result = rewriteSource(source, symbolToEntryPoint);
    skippedReferences += result.skippedReferences;
    for (const symbol of result.unmapped) {
      unmapped.add(symbol);
    }
    if (result.rewrites.length === 0) {
      continue;
    }

    changedFiles++;
    rewrittenStatements += result.rewrites.length;

    const relativePath = path.relative(projectRoot, file) || file;
    console.log(`${options.dryRun ? 'would update' : 'updated'} ${relativePath} (${result.rewrites.length})`);
    if (options.verbose) {
      for (const { before, after } of result.rewrites) {
        console.log(`  - ${before}`);
        for (const line of after.split('\n')) {
          console.log(`  + ${line.trim()}`);
        }
      }
    }

    if (!options.dryRun) {
      fs.writeFileSync(file, result.output);
    }
  }

  console.log(
    `\n${rewrittenStatements} import statement(s) in ${changedFiles} file(s) ` +
      `${options.dryRun ? 'would be rewritten' : 'rewritten'}; ${files.length} file(s) scanned.`
  );

  if (unmapped.size > 0) {
    console.log(
      `Kept on '${PACKAGE_NAME}' (no per-component entry point): ${[...unmapped].sort().join(', ')}`
    );
  }
  if (ambiguous.size > 0) {
    console.log(`Skipped, exported by multiple entry points: ${[...ambiguous].sort().join(', ')}`);
  }
  if (skippedReferences > 0) {
    console.log(
      `${skippedReferences} reference(s) to '${PACKAGE_NAME}' were left alone ` +
        `(namespace/default imports, re-exports, or dynamic imports). Review them by hand.`
    );
  }
}

main();
