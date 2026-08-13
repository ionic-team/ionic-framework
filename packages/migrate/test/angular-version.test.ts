import { describe, expect, it } from 'vitest';

import { createInMemoryContext } from '../src/context.js';
import { angularVersion } from '../src/migrations/v9/angular-version.js';
import { V9_DOCS } from '../src/migrations/v9/docs.js';

function pkg(deps: Record<string, string>): Record<string, string> {
  return { 'package.json': JSON.stringify({ dependencies: deps }, null, 2) };
}

describe('angular-version', () => {
  it('reports an Angular below the supported floor', () => {
    const ctx = createInMemoryContext(pkg({ '@angular/core': '^17.3.0' }));

    const findings = angularVersion.detect(ctx);

    expect(findings).toHaveLength(1);
    expect(findings[0].detail).toContain('Angular 17');
    expect(findings[0].docsUrl).toBe(`${V9_DOCS}#angular`);
  });

  it('says nothing about a supported Angular in the middle of the range', () => {
    const ctx = createInMemoryContext(pkg({ '@angular/core': '^20.0.0' }));

    expect(angularVersion.detect(ctx)).toEqual([]);
  });

  it('warns about the OnPush default once the project is on Angular 22', () => {
    const ctx = createInMemoryContext(pkg({ '@angular/core': '^22.0.0' }));

    const findings = angularVersion.detect(ctx);

    expect(findings.some((f) => f.detail.includes('OnPush'))).toBe(true);
    expect(findings.find((f) => f.detail.includes('OnPush'))?.docsUrl).toBe(
      `${V9_DOCS}#onpush-change-detection-on-angular-22`
    );
  });

  it('flags @ionic/angular-toolkit, which versions on its own release line', () => {
    const ctx = createInMemoryContext(
      pkg({ '@angular/core': '^20.0.0', '@ionic/angular-toolkit': '^11.0.0' })
    );

    const findings = angularVersion.detect(ctx);

    expect(findings).toHaveLength(1);
    expect(findings[0].detail).toContain('@ionic/angular-toolkit');
  });

  it('stays quiet when Angular is absent or unreadable as a plain range', () => {
    const ctx = createInMemoryContext(pkg({ '@angular/core': 'workspace:*' }));

    expect(angularVersion.detect(ctx)).toEqual([]);
  });
});
