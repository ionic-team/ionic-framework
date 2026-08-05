import { describe, expect, it } from 'vitest';

import { findOpeningTags, lineAt } from '../src/ast/markup.js';

describe('findOpeningTags', () => {
  it('finds the named tags and ignores others', () => {
    const src = `<div><ion-input name="a"></ion-input><input /></div>`;
    const tags = findOpeningTags(src, ['ion-input']);
    expect(tags.map((t) => t.name)).toEqual(['ion-input']);
    expect(tags[0].text).toBe(`<ion-input name="a">`);
  });

  it('does not end the tag on a `>` inside a quoted attribute value', () => {
    const src = `<ion-input [disabled]="a > b" autocorrect="off"></ion-input>`;
    const tags = findOpeningTags(src, ['ion-input']);
    expect(tags).toHaveLength(1);
    expect(tags[0].text).toBe(`<ion-input [disabled]="a > b" autocorrect="off">`);
  });

  it('handles self-closing tags and multiple matches', () => {
    const src = `<ion-searchbar />\n<ion-input\n  autocorrect="off"\n/>`;
    const tags = findOpeningTags(src, ['ion-input', 'ion-searchbar']);
    expect(tags.map((t) => t.name)).toEqual(['ion-searchbar', 'ion-input']);
  });

  it('reports 1-based line numbers', () => {
    const src = `line1\nline2\n<ion-input>`;
    expect(lineAt(src, src.indexOf('<ion-input'))).toBe(3);
  });
});
