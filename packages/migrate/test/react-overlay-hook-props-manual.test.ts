import { describe, expect, it } from 'vitest';

import { reactOverlayHookPropsManual as migration } from '../src/migrations/v9/react-overlay-hook-props-manual.js';
import { reactProject } from './helpers/react.js';

const BODY = `
import React from 'react';
export const Body: React.FC<{ title: string; count?: number }> = ({ title }) => null as any;
`;

/** A page whose single hook call is `body`, with `Body` in scope. */
function page(body: string): Record<string, string> {
  return {
    'src/Body.tsx': BODY,
    'src/Page.tsx': `
import { useIonModal } from '@ionic/react';
import { Body } from './Body';

export const Page = () => {
  ${body}
  return null as any;
};
`,
  };
}

describe('react-overlay-hook-props-manual', () => {
  it('reports a prop the component does not declare', () => {
    const ctx = reactProject({
      'src/Body.tsx': BODY,
      'src/Page.tsx': `
import { useIonModal } from '@ionic/react';
import { Body } from './Body';

export const Page = () => {
  const [present] = useIonModal(Body, { titel: 'Hello' });
  return null as any;
};
`,
    });

    const findings = migration.detect(ctx);

    expect(findings).toEqual([
      {
        filePath: 'src/Page.tsx',
        line: 6,
        detail: 'Body has no "titel" prop. Did you mean "title"?',
      },
    ]);
  });

  it('reports a required prop componentProps leaves out', () => {
    const ctx = reactProject(page(`const [present] = useIonModal(Body, { count: 1 });`));

    expect(migration.detect(ctx).map((finding) => finding.detail)).toEqual([
      'Body requires "title", which componentProps does not pass',
    ]);
  });

  it('collects every missing required prop into one finding per call', () => {
    const ctx = reactProject({
      'src/Page.tsx': `
import React from 'react';
import { useIonModal } from '@ionic/react';

const Body: React.FC<{ type: string; count: number; onIncrement: () => void }> = () => null as any;

export const Page = () => {
  const [present] = useIonModal(Body, {});
  return null as any;
};
`,
    });

    expect(migration.detect(ctx).map((finding) => finding.detail)).toEqual([
      'Body requires "type", "count" and "onIncrement", which componentProps does not pass',
    ]);
  });

  it('reports a prop whose value does not match the declared type', () => {
    const ctx = reactProject(page(`const [present] = useIonModal(Body, { title: 1 });`));

    expect(migration.detect(ctx).map((finding) => finding.detail)).toEqual([
      'Body\'s "title" prop is string, and componentProps passes number',
    ]);
  });

  it('says nothing about props passed to a component that declares none', () => {
    // Verified against tsc: a props-less component's Props resolves to `{}`, and
    // TypeScript skips excess-property checking against an empty target type, so
    // this compiles. It looks wrong and is not.
    const ctx = reactProject({
      'src/Page.tsx': `
import { useIonPopover } from '@ionic/react';

const Popover = () => null as any;

export const Page = () => {
  const [present, dismiss] = useIonPopover(Popover, { onDismiss: () => dismiss() });
  return null as any;
};
`,
    });

    expect(migration.detect(ctx)).toEqual([]);
  });

  it('says nothing about an extra key on a componentProps variable', () => {
    // Excess-property checking only applies to a fresh object literal. A variable
    // is assignable as long as it satisfies the declared props.
    const ctx = reactProject({
      'src/Page.tsx': `
import React from 'react';
import { useIonModal } from '@ionic/react';

const Body: React.FC<{ title?: string }> = () => null as any;

export const Page = () => {
  const props = { title: 'Hello', nope: 1 };
  const [present] = useIonModal(Body, props);
  return null as any;
};
`,
    });

    expect(migration.detect(ctx)).toEqual([]);
  });

  it('says nothing about an extra key that arrives through a spread', () => {
    const ctx = reactProject({
      'src/Page.tsx': `
import React from 'react';
import { useIonModal } from '@ionic/react';

const Body: React.FC<{ title?: string }> = () => null as any;

export const Page = () => {
  const extra = { title: 'Hello', nope: 1 };
  const [present] = useIonModal(Body, { ...extra });
  return null as any;
};
`,
    });

    expect(migration.detect(ctx)).toEqual([]);
  });

  it('reports a key written directly alongside a spread', () => {
    const ctx = reactProject({
      'src/Page.tsx': `
import React from 'react';
import { useIonModal } from '@ionic/react';

const Body: React.FC<{ title?: string }> = () => null as any;

export const Page = () => {
  const extra = { title: 'Hello' };
  const [present] = useIonModal(Body, { nope: 1, ...extra });
  return null as any;
};
`,
    });

    expect(migration.detect(ctx).map((finding) => finding.detail)).toEqual(['Body has no "nope" prop']);
  });

  it('reports a call that omits componentProps for a component that requires them', () => {
    const ctx = reactProject(page(`const [present] = useIonModal(Body);`));

    expect(migration.detect(ctx).map((finding) => finding.detail)).toEqual([
      'Body requires "title", so componentProps can no longer be omitted',
    ]);
  });

  it('says nothing about a call that already type checks', () => {
    const ctx = reactProject(page(`const [present] = useIonModal(Body, { title: 'Hello', count: 1 });`));

    expect(migration.detect(ctx)).toEqual([]);
  });

  it('reports an inline component that reads a prop off an unannotated parameter', () => {
    // Props are read from the component, so an unannotated parameter resolves to
    // `{}` and reading a name off it is the error.
    const ctx = reactProject(
      page(`const [present] = useIonModal(({ name }) => name as any, { name: 'Dave' });`)
    );

    expect(migration.detect(ctx).map((finding) => finding.detail)).toEqual([
      'The inline component reads "name" off an unannotated props parameter, which resolves to {}',
    ]);
  });

  it('reports an inline component reading props even when componentProps is empty', () => {
    // The error is in the component body, so it does not depend on what is
    // passed. Verified against tsc: this is TS2339 either way.
    const ctx = reactProject(page(`const [present] = useIonModal(({ name }) => name as any, {});`));

    expect(migration.detect(ctx).map((finding) => finding.detail)).toEqual([
      'The inline component reads "name" off an unannotated props parameter, which resolves to {}',
    ]);
  });

  it('reports an inline component reading a prop through its parameter name', () => {
    const ctx = reactProject(
      page(`const [present] = useIonModal((props) => props.name as any, { name: 'Dave' });`)
    );

    expect(migration.detect(ctx).map((finding) => finding.detail)).toEqual([
      'The inline component reads "name" off an unannotated props parameter, which resolves to {}',
    ]);
  });

  it('says nothing about an inline component that never reads its parameter', () => {
    // Nothing is read off `{}`, so this compiles however much is passed.
    const ctx = reactProject(page(`const [present] = useIonModal((props) => 'literal' as any, { anything: 1 });`));

    expect(migration.detect(ctx)).toEqual([]);
  });

  it('does not count a shadowed parameter in a nested function as a read', () => {
    const ctx = reactProject({
      'src/Page.tsx': `
import { useIonModal } from '@ionic/react';

export const Page = () => {
  const [present] = useIonModal((props) => {
    const inner = (props: { other: string }) => props.other;
    return inner({ other: 'x' }) as any;
  }, { anything: 1 });
  return null as any;
};
`,
    });

    expect(migration.detect(ctx)).toEqual([]);
  });

  it('says nothing about an inline component that only collects a rest object', () => {
    const ctx = reactProject(page(`const [present] = useIonModal(({ ...rest }) => rest as any, { anything: 1 });`));

    expect(migration.detect(ctx)).toEqual([]);
  });

  it('checks against an explicit type argument rather than the component', () => {
    const ctx = reactProject({
      'src/Body.tsx': BODY,
      'src/Page.tsx': `
import { useIonModal } from '@ionic/react';
import { Body } from './Body';

interface Pinned {
  heading: string;
}

export const Page = () => {
  const [present] = useIonModal<Pinned>(Body, { title: 'Hello' });
  return null as any;
};
`,
    });

    expect(migration.detect(ctx).map((finding) => finding.detail)).toEqual([
      'Body has no "title" prop',
      'Body requires "heading", which componentProps does not pass',
    ]);
  });

  it('follows a hook reached through a namespace import', () => {
    const ctx = reactProject({
      'src/Body.tsx': BODY,
      'src/Page.tsx': `
import * as Ionic from '@ionic/react';
import { Body } from './Body';

export const Page = () => {
  const [present] = Ionic.useIonModal(Body, { titel: 'Hello' });
  return null as any;
};
`,
    });

    expect(migration.detect(ctx).map((finding) => finding.detail)).toEqual([
      'Body has no "titel" prop. Did you mean "title"?',
    ]);
  });

  it('follows a hook renamed on import', () => {
    const ctx = reactProject({
      'src/Body.tsx': BODY,
      'src/Page.tsx': `
import { useIonModal as useModal } from '@ionic/react';
import { Body } from './Body';

export const Page = () => {
  const [present] = useModal(Body, { titel: 'Hello' });
  return null as any;
};
`,
    });

    expect(migration.detect(ctx).map((finding) => finding.detail)).toEqual([
      'Body has no "titel" prop. Did you mean "title"?',
    ]);
  });

  it("ignores an app's own function that shares a hook name", () => {
    const ctx = reactProject({
      'src/Body.tsx': BODY,
      'src/Page.tsx': `
import { Body } from './Body';

function useIonModal(component: any, componentProps?: any) {
  return [component, componentProps];
}

export const Page = () => {
  const [present] = useIonModal(Body, { titel: 'Hello' });
  return null as any;
};
`,
    });

    expect(migration.detect(ctx)).toEqual([]);
  });

  it('says nothing about a generic component whose prop types are not yet bound', () => {
    // The `value` prop is declared as `T`, which nothing is assignable to until
    // the hook instantiates it. Comparing against it would report a call that
    // compiles.
    const ctx = reactProject({
      'src/Page.tsx': `
import { useIonModal } from '@ionic/react';

function Generic<T>({ value }: { value: T }) {
  return value as any;
}

export const Page = () => {
  const [present] = useIonModal(Generic, { value: 1 });
  return null as any;
};
`,
    });

    expect(migration.detect(ctx)).toEqual([]);
  });

  it('still reports an unknown prop on a generic component', () => {
    // Only the prop types are unbound. Which props exist is still known.
    const ctx = reactProject({
      'src/Page.tsx': `
import { useIonModal } from '@ionic/react';

function Generic<T>({ value }: { value: T }) {
  return value as any;
}

export const Page = () => {
  const [present] = useIonModal(Generic, { valeu: 1 });
  return null as any;
};
`,
    });

    expect(migration.detect(ctx).map((finding) => finding.detail)).toEqual([
      'Generic has no "valeu" prop. Did you mean "value"?',
    ]);
  });

  it('says nothing when componentProps is passed as any', () => {
    // Passing `any` satisfies the signature, so the call still compiles, and there
    // is nothing to read the passed keys from either.
    const ctx = reactProject(page(`const [present] = useIonModal(Body, {} as any);`));

    expect(migration.detect(ctx)).toEqual([]);
  });

  it('reads through a component that is not a plain reference', () => {
    // A call expression, a conditional, and spread arguments all reach the
    // analysis. None of them may throw, whatever the type resolves to.
    const ctx = reactProject({
      'src/Page.tsx': `
import React from 'react';
import { useIonModal } from '@ionic/react';

const Body: React.FC<{ title: string }> = () => null as any;
const Other: React.FC<{ other: string }> = () => null as any;
declare const flag: boolean;
declare const args: unknown;
declare function getBody(): React.FC<{ title: string }>;

export const Page = () => {
  const [a] = useIonModal(getBody(), { titel: 'x' });
  const [b] = useIonModal(flag ? Body : Other, { title: 'x' });
  const [c] = useIonModal(...(args as [any, any]));
  return null as any;
};
`,
    });

    expect(migration.detect(ctx).map((finding) => finding.detail)).toEqual([
      'The component has no "titel" prop. Did you mean "title"?',
    ]);
  });

  it('says nothing about the JSX element form, whose props are already bound', () => {
    const ctx = reactProject(
      page(`const [present] = useIonModal(<Body title="Hello" />, { anything: true });`)
    );

    expect(migration.detect(ctx)).toEqual([]);
  });

  it('says nothing about a component typed with any, which stays permissive', () => {
    const ctx = reactProject({
      'src/Page.tsx': `
import React from 'react';
import { useIonModal } from '@ionic/react';

const Body: React.FC<any> = () => null as any;

export const Page = () => {
  const [present] = useIonModal(Body, { anything: true });
  return null as any;
};
`,
    });

    expect(migration.detect(ctx)).toEqual([]);
  });

  it('says nothing when the component type is out of reach', () => {
    // A component from a package with no types installed. Reporting a guess here
    // would be worse than the silence.
    const ctx = reactProject({
      'src/Page.tsx': `
import { useIonModal } from '@ionic/react';
import { Body } from 'some-untyped-package';

export const Page = () => {
  const [present] = useIonModal(Body, { title: 'Hello' });
  return null as any;
};
`,
    });

    expect(migration.detect(ctx)).toEqual([]);
  });

  it('says nothing about a component whose props are all optional', () => {
    const ctx = reactProject({
      'src/Page.tsx': `
import React from 'react';
import { useIonModal } from '@ionic/react';

const Body: React.FC<{ count?: number }> = () => null as any;

export const Page = () => {
  const [present] = useIonModal(Body);
  return null as any;
};
`,
    });

    expect(migration.detect(ctx)).toEqual([]);
  });
});
