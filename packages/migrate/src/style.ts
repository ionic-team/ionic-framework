/**
 * Minimal ANSI styling, enabled only on an interactive TTY with `NO_COLOR`
 * unset (https://no-color.org: present regardless of value disables color).
 * Piped output stays plain text; each helper is a no-op passthrough when color
 * is off, so callers can wrap freely without branching.
 */
const colorEnabled = Boolean(process.stdout.isTTY) && process.env.NO_COLOR === undefined;

/** Wrap text in an ANSI SGR pair, or return it unchanged when color is off. */
function sgr(open: number, close: number): (text: string) => string {
  return (text: string) => (colorEnabled ? `\x1b[${open}m${text}\x1b[${close}m` : text);
}

export const bold = sgr(1, 22);
export const dim = sgr(2, 22);
export const green = sgr(32, 39);
export const yellow = sgr(33, 39);
export const cyan = sgr(36, 39);
export const brightBlue = sgr(94, 39);
