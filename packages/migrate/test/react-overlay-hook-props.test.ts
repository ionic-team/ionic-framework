import { describe, expect, it } from 'vitest';

import { allMigrations } from '../src/migrations/index.js';
import { reactOverlayHookProps as migration } from '../src/migrations/v9/react-overlay-hook-props.js';
import { reactOverlayHookPropsManual } from '../src/migrations/v9/react-overlay-hook-props-manual.js';
import { selectMigrations } from '../src/registry.js';
import { readSource, reactProject } from './helpers/react.js';

/** A page whose single hook call is `body`. */
function page(body: string): Record<string, string> {
  return {
    'src/Page.tsx': `
import { useIonModal } from '@ionic/react';

export const Page = () => {
  ${body}
  return null as any;
};
`,
  };
}

describe('react-overlay-hook-props', () => {
  it('annotates an inline component from the props it is passed', () => {
    const ctx = reactProject(page(`const [present] = useIonModal(({ name }) => name as any, { name: 'Dave' });`));

    migration.fix!(ctx);

    expect(readSource(ctx, 'src/Page.tsx')).toContain(
      `useIonModal(({ name }: { name: string }) => name as any, { name: 'Dave' })`
    );
  });

  it('quotes a prop name that is not a valid identifier', () => {
    const ctx = reactProject(
      page(`const [present] = useIonModal(({ 'data-test': id }) => id as any, { 'data-test': 'x' });`)
    );

    migration.fix!(ctx);

    expect(readSource(ctx, 'src/Page.tsx')).toContain(`({ 'data-test': id }: { 'data-test': string })`);
  });

  it('parenthesizes a bare parameter it annotates', () => {
    const ctx = reactProject(page(`const [present] = useIonModal(props => props.name as any, { name: 'Dave' });`));

    migration.fix!(ctx);

    expect(readSource(ctx, 'src/Page.tsx')).toContain(
      `useIonModal((props: { name: string }) => props.name as any, { name: 'Dave' })`
    );
  });

  it('leaves nothing for the report-only migration to say about a call it fixed', () => {
    const ctx = reactProject(page(`const [present] = useIonModal(({ name }) => name as any, { name: 'Dave' });`));

    migration.fix!(ctx);

    expect(reactOverlayHookPropsManual.detect(ctx)).toEqual([]);
  });

  it('runs before the report-only migration that covers the same calls', () => {
    const selected = selectMigrations(allMigrations, {
      fromMajor: 8,
      toMajor: 9,
      frameworks: ['react'],
      includeExperimental: true,
    }).map((selectedMigration) => selectedMigration.id);

    expect(selected.indexOf(migration.id)).toBeLessThan(selected.indexOf(reactOverlayHookPropsManual.id));
  });

  it('declines a prop whose type is not in scope at the call', () => {
    // The `Person` type is never imported here, so it prints as a module path and
    // would not compile as an annotation.
    const ctx = reactProject({
      'src/internal.ts': `export interface Person { name: string }`,
      'src/api.ts': `
import type { Person } from './internal';
export const person: Person = { name: 'Dave' };
`,
      'src/Page.tsx': `
import { useIonModal } from '@ionic/react';
import { person } from './api';

export const Page = () => {
  const [present] = useIonModal(({ owner }) => owner as any, { owner: person });
  return null as any;
};
`,
    });

    expect(migration.detect(ctx)).toEqual([]);
  });

  it('declines when the props passed do not cover what the component reads', () => {
    // Annotating from `{ other: 1 }` would leave `name` unreadable on the new
    // type: a different compile error, and one the report would no longer see.
    const ctx = reactProject(page(`const [present] = useIonModal(({ name }) => name as any, { other: 1 });`));

    expect(migration.detect(ctx)).toEqual([]);
  });

  it('declines a call that pins Props with a type argument', () => {
    // The type argument is what the hook checks against, so an annotation
    // derived from componentProps could contradict it.
    const ctx = reactProject({
      'src/Page.tsx': `
import { useIonModal } from '@ionic/react';

interface Pinned {
  name: number;
}

export const Page = () => {
  const [present] = useIonModal<Pinned>(({ name }) => name as any, { name: 'Dave' });
  return null as any;
};
`,
    });

    expect(migration.detect(ctx)).toEqual([]);
  });

  it('declines an inline component that reads nothing', () => {
    const ctx = reactProject(page(`const [present] = useIonModal((props) => 'literal' as any, { anything: 1 });`));

    expect(migration.detect(ctx)).toEqual([]);
  });

  it('declines props spread from elsewhere', () => {
    const ctx = reactProject(
      page(`
    const extra = { name: 'Dave' };
    const [present] = useIonModal(({ name }) => name as any, { ...extra });`)
    );

    expect(migration.detect(ctx)).toEqual([]);
  });
});
