import { describe, expect, it, vi } from 'vitest';

import { createInMemoryContext } from '../src/context.js';
import { formatTouched, type Formatter } from '../src/format.js';

/** A formatter that records what it was asked to format. */
function fakeFormatter(available = true): Formatter & { calls: string[][] } {
  const calls: string[][] = [];
  return { calls, available: () => available, run: (_root, files) => void calls.push(files) };
}

describe('formatTouched', () => {
  it('formats the touched files (sorted) when a formatter is available', () => {
    const ctx = createInMemoryContext({});
    ctx.writeFile('b.ts', '1');
    ctx.writeFile('a.ts', '1');
    const formatter = fakeFormatter();

    const formatted = formatTouched(ctx, formatter);

    expect(formatted).toEqual(['a.ts', 'b.ts']);
    expect(formatter.calls).toEqual([['a.ts', 'b.ts']]);
  });

  it('does nothing when there are no touched files', () => {
    const ctx = createInMemoryContext({});
    const formatter = fakeFormatter();
    const spy = vi.spyOn(formatter, 'run');

    expect(formatTouched(ctx, formatter)).toEqual([]);
    expect(spy).not.toHaveBeenCalled();
  });

  it('does nothing when no formatter is available', () => {
    const ctx = createInMemoryContext({});
    ctx.writeFile('a.ts', '1');
    const formatter = fakeFormatter(false);
    const spy = vi.spyOn(formatter, 'run');

    expect(formatTouched(ctx, formatter)).toEqual([]);
    expect(spy).not.toHaveBeenCalled();
  });
});
