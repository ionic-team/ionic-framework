const fs = require('fs');
const path = require('path');
const { SourceMapConsumer, SourceMapGenerator } = require('source-map');

/**
 * Rewrite `ChangeDetectionStrategy.Eager` to `Default` in the compiled output.
 *
 * Angular 22 renamed `Default` to `Eager`. Both names are the same value, but a
 * linker that doesn't know the new one fails the consumer's build on it. The
 * rename was backported to 21.2, so remove this once the peer range's lowest
 * version is 21.2 or higher. 21.0 and 21.1 still reject it.
 */

const DIST_DIR = path.join(__dirname, '../dist');
const ANGULAR_22_NAME = 'ChangeDetectionStrategy.Eager';
const PORTABLE_NAME = 'ChangeDetectionStrategy.Default';

function listDistJsFiles() {
  if (!fs.existsSync(DIST_DIR)) {
    throw new Error('dist does not exist. build.ng emitted nothing.');
  }

  // Any JS extension, so an emit that moves to .mjs isn't silently skipped here.
  return fs
    .readdirSync(DIST_DIR, { recursive: true })
    .filter((entry) => /\.(m|c)?js$/.test(entry))
    .map((entry) => path.join(DIST_DIR, entry));
}

function rewriteSource(source) {
  const replacements = new Map();
  const lines = source.split('\n');

  const rewritten = lines.map((line, index) => {
    let searchFrom = 0;
    let startColumn;

    while ((startColumn = line.indexOf(ANGULAR_22_NAME, searchFrom)) !== -1) {
      const lineNumber = index + 1;
      const lineReplacements = replacements.get(lineNumber) ?? [];
      lineReplacements.push({
        startColumn,
        endColumn: startColumn + ANGULAR_22_NAME.length,
        delta: PORTABLE_NAME.length - ANGULAR_22_NAME.length,
      });
      replacements.set(lineNumber, lineReplacements);
      searchFrom = startColumn + ANGULAR_22_NAME.length;
    }

    return line.split(ANGULAR_22_NAME).join(PORTABLE_NAME);
  });

  return { rewritten: rewritten.join('\n'), replacements };
}

function adjustGeneratedColumn(column, replacements) {
  return replacements.reduce(
    (adjusted, replacement) => (column >= replacement.endColumn ? adjusted + replacement.delta : adjusted),
    column
  );
}

async function rewriteSourceMap(file, replacements) {
  const mapFile = `${file}.map`;
  if (!fs.existsSync(mapFile)) {
    throw new Error(`Source map does not exist for ${path.relative(DIST_DIR, file)}.`);
  }

  const sourceMap = JSON.parse(fs.readFileSync(mapFile, 'utf8'));
  const consumer = await new SourceMapConsumer(sourceMap);

  try {
    const generator = new SourceMapGenerator({ file: sourceMap.file, sourceRoot: sourceMap.sourceRoot });
    const originalSources = new Map(
      consumer.sources.map((resolvedSource, index) => [resolvedSource, sourceMap.sources[index]])
    );

    consumer.eachMapping(
      (mapping) => {
        const lineReplacements = replacements.get(mapping.generatedLine) ?? [];
        const generated = {
          line: mapping.generatedLine,
          column: adjustGeneratedColumn(mapping.generatedColumn, lineReplacements),
        };

        if (mapping.source === null) {
          generator.addMapping({ generated });
        } else {
          generator.addMapping({
            generated,
            source: originalSources.get(mapping.source) ?? mapping.source,
            original: { line: mapping.originalLine, column: mapping.originalColumn },
            name: mapping.name ?? undefined,
          });
        }
      },
      null,
      SourceMapConsumer.GENERATED_ORDER
    );

    for (const source of consumer.sources) {
      const content = consumer.sourceContentFor(source, true);
      if (content !== null) generator.setSourceContent(source, content);
    }

    const rewrittenMap = JSON.parse(generator.toString());
    for (const [key, value] of Object.entries(sourceMap)) {
      if (!Object.hasOwn(rewrittenMap, key)) rewrittenMap[key] = value;
    }
    fs.writeFileSync(mapFile, JSON.stringify(rewrittenMap));
  } finally {
    consumer.destroy();
  }
}

async function normalize() {
  const files = listDistJsFiles();
  let rewritten = 0;

  for (const file of files) {
    const source = fs.readFileSync(file, 'utf8');
    if (!source.includes(ANGULAR_22_NAME)) continue;

    const normalized = rewriteSource(source);
    await rewriteSourceMap(file, normalized.replacements);
    fs.writeFileSync(file, normalized.rewritten);
    rewritten++;
  }

  console.log(`✅ normalized change detection strategy in ${rewritten} file(s)`);
}

module.exports = { DIST_DIR, PORTABLE_NAME, listDistJsFiles };

if (require.main === module) {
  normalize().catch((error) => {
    console.error(error);
    process.exitCode = 1;
  });
}
