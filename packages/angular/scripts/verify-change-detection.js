const fs = require('fs');
const path = require('path');

/**
 * Verify that every component declares a change detection strategy.
 *
 * An Angular 22 linker fills in an undeclared strategy as OnPush when our own
 * emitted declaration is stamped 22 or later, so bumping this package's Angular
 * version can silently flip a component for every Angular 22 consumer (#31406).
 */

const { DIST_DIR, PORTABLE_NAME, listDistJsFiles } = require('./normalize-change-detection');

/**
 * Names every linker in the peer range understands. An allowlist means a future
 * rename fails here instead of as a FatalLinkerError in a consumer's build.
 */
const PORTABLE_NAMES = ['OnPush', PORTABLE_NAME.split('.').pop()];

/**
 * The only components allowed to link eager, and every file each is emitted
 * into. Routed pages are created inside these components' own views, so OnPush
 * would strand them (#31406). Listing the files rather than counting them
 * catches one entry point losing eager while an unrelated file gains it.
 */
const EAGER_COMPONENTS = {
  IonRouterOutlet: ['lazy/directives/navigation/ion-router-outlet.js', 'standalone/navigation/router-outlet.js'],
  IonTabs: ['lazy/directives/navigation/ion-tabs.js', 'standalone/navigation/tabs.js'],
};

/**
 * A tripwire for the scan seeing less of dist than it should, which a zero check
 * alone would miss. Lower it only when the emitted count genuinely drops.
 */
const MIN_COMPONENTS = 150;

const DECLARE_FN = 'ɵɵngDeclareComponent(';

// Declarations embed templates and styles, so match brackets rather than a pattern.
function findComponentDeclarations(source) {
  const declarations = [];
  let searchFrom = 0;

  for (;;) {
    const start = source.indexOf(DECLARE_FN, searchFrom);
    if (start === -1) return declarations;

    let index = start + DECLARE_FN.length;
    let depth = 1;
    let quote = null;

    while (index < source.length && depth > 0) {
      const char = source[index];

      if (quote !== null) {
        if (char === '\\') index++;
        else if (char === quote) quote = null;
      } else if (char === "'" || char === '"' || char === '`') {
        quote = char;
      } else if (char === '(' || char === '{' || char === '[') {
        depth++;
      } else if (char === ')' || char === '}' || char === ']') {
        depth--;
      }

      index++;
    }

    declarations.push(source.slice(start, index));
    searchFrom = index;
  }
}

function getComponentName(declaration) {
  const match = declaration.match(/\btype:\s*([A-Za-z0-9_$]+)/);
  return match ? match[1] : 'unknown component';
}

function getStrategyName(declaration) {
  // The namespace prefix is optional, so a change to it doesn't read every
  // component as undeclared.
  const match = declaration.match(
    /\bchangeDetection:\s*(?:[A-Za-z0-9_$]+\.)?ChangeDetectionStrategy\.([A-Za-z0-9_$]+)/
  );
  return match ? match[1] : null;
}

function verify() {
  const files = listDistJsFiles();

  const undeclared = [];
  const unportable = [];
  // Prototype-less so a component named after an `Object.prototype` member still counts.
  const eager = Object.create(null);
  let componentCount = 0;

  for (const file of files) {
    const source = fs.readFileSync(file, 'utf8');
    const relativePath = path.relative(DIST_DIR, file);

    for (const declaration of findComponentDeclarations(source)) {
      componentCount++;

      const name = getComponentName(declaration);
      const strategy = getStrategyName(declaration);
      if (strategy === null) {
        undeclared.push(`${name} (${relativePath})`);
      } else if (!PORTABLE_NAMES.includes(strategy)) {
        unportable.push(`${name} emits ${strategy} (${relativePath})`);
      } else if (strategy !== 'OnPush') {
        eager[name] = eager[name] ?? new Set();
        eager[name].add(relativePath.split(path.sep).join('/'));
      }
    }
  }

  const foundFiles = (name) => (Object.hasOwn(eager, name) ? [...eager[name]].sort() : []);
  const expectedFiles = (name) => (Object.hasOwn(EAGER_COMPONENTS, name) ? [...EAGER_COMPONENTS[name]].sort() : []);
  const sameFiles = (a, b) => a.length === b.length && a.every((file, index) => file === b[index]);
  const eagerDrift = Object.keys({ ...EAGER_COMPONENTS, ...eager })
    .filter((name) => !sameFiles(expectedFiles(name), foundFiles(name)))
    .map((name) => `${name}: expected eager in [${expectedFiles(name)}], found [${foundFiles(name)}]`);

  if (componentCount < MIN_COMPONENTS) {
    console.error(
      `Found ${componentCount} components in dist, fewer than the ${MIN_COMPONENTS} expected. Either build.ng emitted nothing, or this scan no longer sees the whole output.`
    );
    process.exitCode = 1;
    return;
  }

  if (undeclared.length > 0) {
    console.error('Components must declare a change detection strategy:');
    for (const offender of undeclared) {
      console.error(`  ${offender}`);
    }
    console.error(
      '\nAdd `changeDetection: ChangeDetectionStrategy.OnPush` to the @Component decorator, or `.Default` if the component creates routed pages in its own view.' +
        '\nFor a generated file (directives/proxies.ts, standalone/directives/ion-*.ts) the generator changed instead: fix or pin @stencil/angular-output-target in core/package.json.'
    );
  }

  if (unportable.length > 0) {
    console.error(`\nOnly ${PORTABLE_NAMES.join(' and ')} link across the whole peer range:`);
    for (const offender of unportable) {
      console.error(`  ${offender}`);
    }
    // Eager is the one name normalize already rewrites, so seeing it here means
    // that step was skipped.
    console.error(
      unportable.some((offender) => offender.includes('emits Eager'))
        ? '\nRun `npm run build.change-detection` first, which rewrites Eager to Default.'
        : '\nTeach scripts/normalize-change-detection.js to rewrite the new name.'
    );
  }

  // Skipped when a check above fired: those show as drift too, and the hint would mislead.
  if (eagerDrift.length > 0 && undeclared.length === 0 && unportable.length === 0) {
    console.error('\nUnexpected change detection strategy:');
    for (const offender of eagerDrift) {
      console.error(`  ${offender}`);
    }
    console.error(
      '\nOnly components that create routed pages in their own view may be eager (#31406).\nUpdate EAGER_COMPONENTS in this script if that set genuinely changed.'
    );
  }

  if (undeclared.length > 0 || unportable.length > 0 || eagerDrift.length > 0) {
    process.exitCode = 1;
    return;
  }

  console.log(`✅ verified change detection strategy on ${componentCount} components`);
}

if (require.main === module) {
  verify();
}
