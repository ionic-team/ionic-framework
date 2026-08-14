import type { Finding, Migration } from '../../types.js';

/**
 * Ionic 9 raises its supported browser floors. The guide prints a replacement
 * `.browserslistrc` block, but this raises the version numbers in place:
 * overwriting the file would drop comments and queries unrelated to Ionic.
 *
 * Only entries this owns are touched - a named browser with a `>=` floor below
 * Ionic 9's.
 *
 * Refer to https://ionicframework.com/docs/updating/9-0#browser-support
 */
/** Minimum version Ionic 9 supports, by browserslist browser name. */
const FLOORS: Record<string, number> = {
  chrome: 89,
  chromeandroid: 89,
  firefox: 75,
  edge: 89,
  safari: 16,
  ios: 16,
};

/**
 * A `Name >=Version` entry, the shape the Ionic starters generate. The version
 * is captured whole so raising `Safari >=15.4` writes `>=16`, not `>=16.4`. The
 * optional `\r` keeps a CRLF checkout from matching nothing.
 */
const ENTRY = /^(\s*)([A-Za-z_]+)(\s*>=\s*)(\d+(?:\.\d+)*)(.*?)\r?$/;

const BROWSERSLIST_GLOBS = ['**/.browserslistrc', '**/browserslist'];

/**
 * The raised version of a browserslist line, or `undefined` when the line is not
 * an entry this owns or is already at or above the floor. Shared by detect/fix
 * so the report and the edit can never disagree.
 */
function raise(line: string): { name: string; from: string; to: number; line: string } | undefined {
  const m = ENTRY.exec(line);
  if (!m) return undefined;
  const [, indent, name, op, version, rest] = m;
  const floor = FLOORS[name.toLowerCase()];
  if (floor === undefined) return undefined;
  // Compare on the major alone, so `Safari >=16.3` counts as meeting a floor of 16.
  if (Number.parseInt(version, 10) >= floor) return undefined;
  const crlf = line.endsWith('\r') ? '\r' : '';
  return { name, from: version, to: floor, line: `${indent}${name}${op}${floor}${rest}${crlf}` };
}

export const coreBrowserslist: Migration = {
  id: 'core-browserslist',
  framework: 'core',
  fromMajor: 8,
  toMajor: 9,
  status: 'stable',
  docsUrl: 'https://ionicframework.com/docs/updating/9-0#browser-support',

  detect(ctx) {
    const findings: Finding[] = [];
    for (const filePath of ctx.glob(BROWSERSLIST_GLOBS)) {
      const text = ctx.readFile(filePath);
      if (text === undefined) continue;
      text.split('\n').forEach((line, i) => {
        const raised = raise(line);
        if (raised) {
          findings.push({
            filePath,
            line: i + 1,
            detail: `${raised.name} >=${raised.from} is below Ionic 9's floor. Raise it to >=${raised.to}`,
          });
        }
      });
    }
    return findings;
  },

  fix(ctx) {
    for (const filePath of ctx.glob(BROWSERSLIST_GLOBS)) {
      const text = ctx.readFile(filePath);
      if (text === undefined) continue;
      const next = text
        .split('\n')
        .map((line) => raise(line)?.line ?? line)
        .join('\n');
      if (next !== text) ctx.writeFile(filePath, next);
    }
  },
};
