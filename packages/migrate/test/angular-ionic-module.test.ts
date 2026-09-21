import { describe, expect, it } from 'vitest';

import { createInMemoryContext } from '../src/context.js';
import { angularIonicModule as migration } from '../src/migrations/v9/angular-ionic-module.js';

describe('angular-ionic-module', () => {
  it('flags the IonicModule.forRoot() bootstrap once per file', () => {
    // The import line and the imports array both mention it.
    const ctx = createInMemoryContext({
      'app.module.ts':
        `import { IonicModule } from '@ionic/angular';\n` +
        `@NgModule({ imports: [IonicModule.forRoot()] })\n` +
        `export class AppModule {}\n`,
    });

    const findings = migration.detect(ctx);

    expect(findings).toHaveLength(1);
    expect(findings[0].detail).toContain('provideIonicAngular');
    expect(findings[0].line).toBe(1);
  });

  it('flags a feature module importing IonicModule', () => {
    const ctx = createInMemoryContext({
      'home.module.ts':
        `import { IonicModule } from '@ionic/angular';\n` +
        `@NgModule({ imports: [IonicModule] })\n` +
        `export class HomeModule {}\n`,
    });

    expect(migration.detect(ctx)).not.toEqual([]);
  });

  it('does not flag an app that already uses provideIonicAngular', () => {
    const ctx = createInMemoryContext({
      'main.ts':
        `import { provideIonicAngular } from '@ionic/angular';\n` +
        `bootstrapApplication(AppComponent, { providers: [provideIonicAngular()] });\n`,
    });

    expect(migration.detect(ctx)).toEqual([]);
  });

  it('does not flag an unrelated identifier that merely contains the name', () => {
    const ctx = createInMemoryContext({
      'shared.ts': `export class MyIonicModuleHelper {}\n`,
    });

    expect(migration.detect(ctx)).toEqual([]);
  });
});
