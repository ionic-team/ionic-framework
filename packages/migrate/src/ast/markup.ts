/** An opening tag located in template/markup text. */
export interface OpeningTag {
  /** Lower-cased tag name. */
  name: string;
  /** Offset of the leading `<`. */
  start: number;
  /** Offset just past the closing `>`. */
  end: number;
  /** The full opening-tag text, e.g. `<ion-input autocorrect="off">`. */
  text: string;
}

/**
 * Find opening tags of the given names in template text (HTML, Vue `<template>`).
 *
 * The scan is quote-aware: it reads to the closing `>` while skipping over
 * quoted attribute values, so a `>` inside an attribute (e.g. an Angular
 * binding `[disabled]="a > b"`) does not end the tag early. This is enough to
 * safely locate and edit attributes on specific elements without a full HTML
 * parser. It is deliberately not a general-purpose parser.
 */
export function findOpeningTags(source: string, tagNames: string[]): OpeningTag[] {
  const names = new Set(tagNames.map((n) => n.toLowerCase()));
  const tags: OpeningTag[] = [];
  const tagStart = /<([a-zA-Z][\w-]*)/g;

  let match: RegExpExecArray | null;
  while ((match = tagStart.exec(source)) !== null) {
    if (!names.has(match[1].toLowerCase())) continue;

    let i = tagStart.lastIndex;
    let quote: string | null = null;
    while (i < source.length) {
      const ch = source[i];
      if (quote) {
        if (ch === quote) quote = null;
      } else if (ch === '"' || ch === "'") {
        quote = ch;
      } else if (ch === '>') {
        break;
      }
      i++;
    }

    const end = i + 1; // include the '>'
    tags.push({ name: match[1].toLowerCase(), start: match.index, end, text: source.slice(match.index, end) });
    tagStart.lastIndex = end;
  }
  return tags;
}

/** 1-based line number of an offset in `source`. */
export function lineAt(source: string, offset: number): number {
  let line = 1;
  for (let i = 0; i < offset && i < source.length; i++) {
    if (source[i] === '\n') line++;
  }
  return line;
}
