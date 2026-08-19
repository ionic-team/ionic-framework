import { describe, expect, it } from 'vitest';

import { createInMemoryContext } from '../src/context.js';
import { reactRouter6Routes as migration } from '../src/migrations/v9/react-router-6-routes.js';
import { V9_DOCS } from '../src/migrations/v9/docs.js';

function withTsx(text: string, name = 'App.tsx') {
  const ctx = createInMemoryContext({ [name]: text });
  const read = () => ctx.project.getSourceFileOrThrow(`${ctx.rootDir}/${name}`).getFullText();
  return { ctx, read };
}

describe('react-router-6-routes', () => {
  it('rewrites `component={X}` to `element={<X />}`', () => {
    const { ctx, read } = withTsx(`const a = <Route path="/" component={Home} />;\n`);

    migration.fix!(ctx);

    expect(read()).toBe(`const a = <Route path="/" element={<Home />} />;\n`);
  });

  it('removes the `exact` prop', () => {
    const { ctx, read } = withTsx(`const a = <Route path="/" exact />;\n`);

    migration.fix!(ctx);

    expect(read()).toBe(`const a = <Route path="/" />;\n`);
  });

  it('handles component and exact on the same element', () => {
    const { ctx, read } = withTsx(`const a = <Route path="/" component={Home} exact />;\n`);

    migration.fix!(ctx);

    expect(read()).toBe(`const a = <Route path="/" element={<Home />} />;\n`);
  });

  it('handles IonRoute the same as Route', () => {
    const { ctx, read } = withTsx(`const a = <IonRoute path="/" component={Home} />;\n`);

    migration.fix!(ctx);

    expect(read()).toBe(`const a = <IonRoute path="/" element={<Home />} />;\n`);
  });

  it('reports a finding for each attribute it will change', () => {
    const { ctx } = withTsx(`const a = <Route path="/" component={Home} exact />;\n`);

    const details = migration.detect(ctx).map((f) => f.detail);

    expect(details).toContain('component={Home} -> element={<Home />}');
    expect(details).toContain('remove `exact` (v6 matches exactly by default)');
  });

  it('anchors each attribute change at its own docs subsection', () => {
    // Both are route changes, but the guide gives `exact` its own heading, so
    // they must not collapse to one link.
    const { ctx } = withTsx(`const a = <Route path="/" component={Home} exact />;\n`);

    const anchors = new Set(migration.detect(ctx).map((f) => f.docsUrl));

    expect(anchors).toEqual(
      new Set([`${V9_DOCS}#exact-prop-removed`, `${V9_DOCS}#route-definition-changes`])
    );
  });

  it('fixes a nested Route once, without walking it via the outer Route attributes', () => {
    // The inner Route is a real Route and gets fixed on its own. The outer walk
    // must not also collect the inner attrs (that double-collection would throw
    // on the second apply against an already-removed node).
    const { ctx, read } = withTsx(
      `const a = <Route path="/" render={() => <Route component={Inner} exact />} />;\n`
    );

    migration.fix!(ctx);

    expect(read()).toBe(`const a = <Route path="/" render={() => <Route element={<Inner />} />} />;\n`);
  });

  it('leaves a non-identifier component initializer untouched (not fixed, not reported)', () => {
    const input = `const a = <Route path="/" component={cond ? A : B} />;\n`;
    const { ctx, read } = withTsx(input);

    expect(migration.detect(ctx)).toEqual([]);
    migration.fix!(ctx);
    expect(read()).toBe(input);
  });

  it('ignores non-Route elements and other props (e.g. render)', () => {
    const input =
      `const a = <Home component={X} exact />;\n` + `const b = <Route path="/" render={() => <X />} />;\n`;
    const { ctx, read } = withTsx(input);

    expect(migration.detect(ctx)).toEqual([]);
    migration.fix!(ctx);
    expect(read()).toBe(input);
  });
});
