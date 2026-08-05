import { describe, expect, it } from 'vitest';

import { createInMemoryContext } from '../src/context.js';
import { angularStandaloneImports } from '../src/migrations/v9/angular-standalone-imports.js';

const migration = angularStandaloneImports;

/** Build a context with a single TS file and return the context + a text reader. */
function withFile(text: string, name = 'app.component.ts') {
  const ctx = createInMemoryContext({ [name]: text });
  const read = () => ctx.project.getSourceFileOrThrow(`${ctx.rootDir}/${name}`).getFullText();
  // Findings report project-relative paths.
  return { ctx, read, filePath: name };
}

describe('angular-standalone-imports', () => {
  it('rewrites a lazy `@ionic/angular` import to `@ionic/angular/lazy`', () => {
    const { ctx, read } = withFile(`import { IonButton } from '@ionic/angular';\n`);

    migration.fix!(ctx);

    expect(read()).toBe(`import { IonButton } from '@ionic/angular/lazy';\n`);
  });

  it('rewrites a `@ionic/angular/standalone` import to `@ionic/angular`', () => {
    const { ctx, read } = withFile(`import { IonButton } from '@ionic/angular/standalone';\n`);

    migration.fix!(ctx);

    expect(read()).toBe(`import { IonButton } from '@ionic/angular';\n`);
  });

  it('migrates both import paths in one file without double-rewriting', () => {
    const { ctx, read } = withFile(
      `import { IonButton } from '@ionic/angular/standalone';\n` +
        `import { NavController } from '@ionic/angular';\n`
    );

    migration.fix!(ctx);

    // The standalone import must become bare `@ionic/angular` and NOT then be
    // re-caught and pushed on to `/lazy`; the lazy import becomes `/lazy`.
    expect(read()).toBe(
      `import { IonButton } from '@ionic/angular';\n` +
        `import { NavController } from '@ionic/angular/lazy';\n`
    );
  });

  it('leaves string literals, comments, and unrelated specifiers untouched', () => {
    const input =
      `// import { IonButton } from '@ionic/angular';\n` +
      `import { AngularToolkit } from '@ionic/angular-toolkit';\n` +
      `const pkg = '@ionic/angular';\n`;
    const { ctx, read } = withFile(input);

    migration.fix!(ctx);

    expect(read()).toBe(input);
  });

  it('reports a finding, with line and detail, for each import it would rewrite', () => {
    const { ctx, filePath } = withFile(
      `import { IonButton } from '@ionic/angular/standalone';\n` +
        `import { AngularToolkit } from '@ionic/angular-toolkit';\n` +
        `import { NavController } from '@ionic/angular';\n`
    );

    const findings = migration.detect(ctx);

    expect(findings).toEqual([
      { filePath, line: 1, detail: `'@ionic/angular/standalone' -> '@ionic/angular'` },
      { filePath, line: 3, detail: `'@ionic/angular' -> '@ionic/angular/lazy'` },
    ]);
  });
});
