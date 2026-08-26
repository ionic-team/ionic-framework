const fs = require('fs');
const path = require('path');

/**
 * Verify that every component declares a change detection strategy.
 *
 * An Angular 22 linker fills in an undeclared strategy as OnPush when our own
 * emitted declaration is stamped 22 or later, so bumping this package's Angular
 * version can silently flip a component for every Angular 22 consumer (#31406).
 */

// Shared with the normalize step so both walk the same dist and agree on the name.
const { DIST_DIR, PORTABLE_NAME, listDistJsFiles } = require('./normalize-change-detection');

/**
 * Names every linker in the peer range understands. Allowlisting rather than
 * blocklisting `Eager` means a future rename fails here instead of as a
 * FatalLinkerError in a consumer's build.
 */
const PORTABLE_NAMES = ['OnPush', PORTABLE_NAME.split('.').pop()];

/**
 * The only components allowed to link eager, and how many times each is emitted
 * (once for lazy, once for standalone). Routed pages are created inside these
 * components' own views, so OnPush would strand them (#31406).
 */
const EAGER_COMPONENTS = { IonRouterOutlet: 2, IonTabs: 2 };

const DECLARE_FN = 'ɵɵngDeclareComponent(';

/**
 * Returns the source of each `ɵɵngDeclareComponent(...)` call. They embed
 * templates and styles, so brackets are matched while skipping string literals
 * rather than matching a pattern.
 */
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
  const match = declaration.match(/\bchangeDetection:\s*[A-Za-z0-9_$]+\.ChangeDetectionStrategy\.([A-Za-z0-9_$]+)/);
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
        // Distinct files, so two lazy emissions can't mask a missing standalone one.
        eager[name] = eager[name] ?? new Set();
        eager[name].add(relativePath);
      }
    }
  }

  const eagerCount = (name) => (Object.hasOwn(eager, name) ? eager[name].size : 0);
  const expectedCount = (name) => (Object.hasOwn(EAGER_COMPONENTS, name) ? EAGER_COMPONENTS[name] : 0);
  const eagerDrift = Object.keys({ ...EAGER_COMPONENTS, ...eager })
    .filter((name) => expectedCount(name) !== eagerCount(name))
    .map((name) => `${name}: expected ${expectedCount(name)} eager, found ${eagerCount(name)}`);

  if (componentCount === 0) {
    console.error('No components found in dist. build.ng emitted nothing.');
    process.exitCode = 1;
    return;
  }

  if (undeclared.length > 0) {
    console.error('Components must declare a change detection strategy:');
    for (const offender of undeclared) {
      console.error(`  ${offender}`);
    }
    console.error(
      '\nAdd `changeDetection: ChangeDetectionStrategy.OnPush` to the @Component decorator, or `.Default` if the component creates routed pages in its own view.'
    );
  }

  if (unportable.length > 0) {
    console.error(`\nOnly ${PORTABLE_NAMES.join(' and ')} link across the whole peer range:`);
    for (const offender of unportable) {
      console.error(`  ${offender}`);
    }
    console.error('\nTeach scripts/normalize-change-detection.js to rewrite the new name.');
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
