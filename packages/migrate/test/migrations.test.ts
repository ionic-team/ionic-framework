import { describe, expect, it } from 'vitest';

import { createInMemoryContext } from '../src/context.js';
import { IONIC_V9_VERSION } from '../src/versions.js';
import { angularDeps } from '../src/migrations/v9/angular-deps.js';
import { reactDeps } from '../src/migrations/v9/react-deps.js';
import { reactRouter6Code } from '../src/migrations/v9/react-router-6-code.js';
import { vueDeps } from '../src/migrations/v9/vue-deps.js';
import { vueRouterNextGuard } from '../src/migrations/v9/vue-router-next-guard.js';
import { coreLegacyPicker } from '../src/migrations/v9/core-legacy-picker.js';
import { coreIonImg } from '../src/migrations/v9/core-ion-img.js';

describe('react-deps', () => {
  it('bumps @ionic/react + router deps and drops @types/react-router*', () => {
    const ctx = createInMemoryContext({
      'package.json': JSON.stringify(
        {
          dependencies: {
            '@ionic/react': '^8.4.0',
            '@ionic/react-router': '^8.4.0',
            'react-router': '^5.3.0',
            'react-router-dom': '^5.3.0',
          },
          devDependencies: { '@types/react-router-dom': '^5.3.0' },
        },
        null,
        2
      ),
    });

    reactDeps.fix!(ctx);
    const pkg = JSON.parse(ctx.readFile('package.json')!);

    expect(pkg.dependencies['@ionic/react']).toBe(IONIC_V9_VERSION);
    expect(pkg.dependencies['react-router']).toBe('^6.0.0');
    expect(pkg.dependencies['react-router-dom']).toBe('^6.0.0');
    expect(pkg.devDependencies['@types/react-router-dom']).toBeUndefined();
  });

  it('does nothing when already on v9/v6 (version gate is closed)', () => {
    const ctx = createInMemoryContext({
      'package.json': JSON.stringify(
        { dependencies: { '@ionic/react': IONIC_V9_VERSION, 'react-router-dom': '^6.4.0' } },
        null,
        2
      ),
    });

    expect(reactDeps.detect(ctx)).toEqual([]);
  });
});

describe('angular-deps', () => {
  it('bumps @ionic/angular to v9', () => {
    const ctx = createInMemoryContext({
      'package.json': JSON.stringify({ dependencies: { '@ionic/angular': '^8.4.0' } }, null, 2),
    });

    angularDeps.fix!(ctx);
    const pkg = JSON.parse(ctx.readFile('package.json')!);

    expect(pkg.dependencies['@ionic/angular']).toBe(IONIC_V9_VERSION);
  });
});

describe('vue-deps', () => {
  it('bumps @ionic/vue and vue-router to their v9 targets', () => {
    const ctx = createInMemoryContext({
      'package.json': JSON.stringify(
        { dependencies: { '@ionic/vue': '^8.4.0', vue: '^3.4.0', 'vue-router': '^4.2.0' } },
        null,
        2
      ),
    });

    vueDeps.fix!(ctx);
    const pkg = JSON.parse(ctx.readFile('package.json')!);

    expect(pkg.dependencies['@ionic/vue']).toBe(IONIC_V9_VERSION);
    expect(pkg.dependencies['vue-router']).toBe('^5.0.0');
    // Vue must be raised to the 3.5+ floor v9 requires; a 3.4 pin is below it.
    expect(pkg.dependencies['vue']).toBe('^3.5.0');
  });

  it('does not downgrade a Vue pin already at or above the 3.5 floor', () => {
    const ctx = createInMemoryContext({
      'package.json': JSON.stringify(
        { dependencies: { '@ionic/vue': IONIC_V9_VERSION, vue: '^3.6.0', 'vue-router': '^5.0.0' } },
        null,
        2
      ),
    });

    expect(vueDeps.detect(ctx)).toEqual([]);
  });

  it('leaves a non-semver Vue range (workspace/catalog/latest) untouched', () => {
    for (const range of [
      'workspace:*',
      'catalog:',
      'catalog:vue3',
      'workspace:~3.4.0',
      'npm:vue@3.4.0',
      'git+https://github.com/vuejs/core.git#v3.4.0',
      'latest',
      '*',
    ]) {
      const ctx = createInMemoryContext({
        'package.json': JSON.stringify({ dependencies: { '@ionic/vue': '^8.4.0', vue: range } }, null, 2),
      });

      const vueChange = vueDeps.detect(ctx).find((f) => f.detail.includes(' vue '));
      expect(vueChange, `range ${range} should not be rewritten`).toBeUndefined();
    }
  });
});

describe('react-router-6-code (report-only)', () => {
  it('reports removed imports and the render prop, but not the auto-fixed exact/component', () => {
    const ctx = createInMemoryContext({
      'App.tsx':
        `import { Redirect, useHistory } from 'react-router-dom';\n` +
        `export const App = () => <Route path="/" component={Home} exact render={() => <X />} />;\n`,
    });

    const details = reactRouter6Code.detect(ctx).map((f) => f.detail);

    expect(details.some((d) => d.includes('Redirect removed'))).toBe(true);
    expect(details.some((d) => d.includes('useHistory removed'))).toBe(true);
    expect(details.some((d) => d.includes('"render" prop removed'))).toBe(true);
    // exact/component are owned by react-router-6-routes and must not be double-reported here.
    expect(details.some((d) => d.includes('"component" prop removed'))).toBe(false);
    expect(details.some((d) => d.includes('"exact" prop removed'))).toBe(false);
  });

  it('reports a component prop react-router-6-routes cannot auto-fix (non-identifier initializer)', () => {
    const ctx = createInMemoryContext({
      'App.tsx': `export const App = () => <Route path="/" component={Views.Home} />;\n`,
    });

    const details = reactRouter6Code.detect(ctx).map((f) => f.detail);

    // A bare `component={X}` is left to react-router-6-routes, but a member-access
    // initializer it can't rewrite must still be surfaced here.
    expect(details.some((d) => d.includes('"component" prop removed'))).toBe(true);
  });

  it('ignores non-router imports and non-Route elements', () => {
    const ctx = createInMemoryContext({
      'App.tsx':
        `import { useState } from 'react';\n` + `export const App = () => <Home render={() => null} />;\n`,
    });

    expect(reactRouter6Code.detect(ctx)).toEqual([]);
  });
});

describe('core report-only migrations', () => {
  it('core-legacy-picker flags legacy picker and controller usage', () => {
    const ctx = createInMemoryContext({
      'page.html': `<ion-picker-legacy></ion-picker-legacy>\n`,
      'page.ts': `const p = await pickerController.create();\n`,
    });

    expect(coreLegacyPicker.detect(ctx)).toHaveLength(2);
  });

  it('core-legacy-picker flags removed picker type imports', () => {
    const ctx = createInMemoryContext({
      'page.ts': `import type { PickerOptions, PickerButton } from '@ionic/angular';\n`,
    });

    expect(coreLegacyPicker.detect(ctx)).toHaveLength(1);
  });

  it('core-ion-img flags ion-img usage', () => {
    const ctx = createInMemoryContext({ 'page.html': `<ion-img src="x.png"></ion-img>\n` });

    expect(coreIonImg.detect(ctx)).toHaveLength(1);
  });

  it('does not flag when nothing matches', () => {
    const ctx = createInMemoryContext({ 'page.html': `<ion-button>Hi</ion-button>\n` });

    expect(coreLegacyPicker.detect(ctx)).toEqual([]);
    expect(coreIonImg.detect(ctx)).toEqual([]);
  });
});

describe('vue-router-next-guard (report-only)', () => {
  it('flags router-qualified navigation guards', () => {
    const ctx = createInMemoryContext({
      'router.ts': `router.beforeEach((to, from, next) => { next(); });\n`,
    });

    expect(vueRouterNextGuard.detect(ctx)).toHaveLength(1);
  });

  it('does not flag bare or Playwright beforeEach hooks', () => {
    const ctx = createInMemoryContext({
      'component.spec.ts': `beforeEach(() => { setup(); });\n`,
      'e2e.spec.ts': `test.beforeEach(async ({ page }) => { await page.goto('/'); });\n`,
    });

    expect(vueRouterNextGuard.detect(ctx)).toEqual([]);
  });

  it('flags Vue-specific component navigation guards on their own', () => {
    const ctx = createInMemoryContext({
      'view.ts': `onBeforeRouteLeave((to, from, next) => next());\n`,
    });

    expect(vueRouterNextGuard.detect(ctx)).toHaveLength(1);
  });
});
