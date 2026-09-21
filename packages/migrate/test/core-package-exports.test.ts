import { describe, expect, it } from 'vitest';

import { createInMemoryContext } from '../src/context.js';
import { corePackageExports } from '../src/migrations/v9/core-package-exports.js';

describe('core-package-exports', () => {
  it('flags an import from a path the exports field does not expose', () => {
    const ctx = createInMemoryContext({
      'app.ts': `import { Foo } from '@ionic/core/internal/utils';\n`,
    });

    const findings = corePackageExports.detect(ctx);

    expect(findings).toHaveLength(1);
    expect(findings[0].detail).toContain('@ionic/core/internal/utils');
  });

  it('allows every key the exports map declares, wildcards included', () => {
    // Mirrors core/package.json, which is broader than the guide's table.
    const ctx = createInMemoryContext({
      'app.ts':
        `import { modalController } from '@ionic/core';\n` +
        `import { IonButton } from '@ionic/core/components';\n` +
        `import { defineCustomElement } from '@ionic/core/components/ion-button.js';\n` +
        `import { defineCustomElements } from '@ionic/core/loader';\n` +
        `import { x } from '@ionic/core/loader/index.js';\n` +
        `import { y } from '@ionic/core/hydrate/index.mjs';\n` +
        `import { z } from '@ionic/core/dist/types/components';\n` +
        `import pkg from '@ionic/core/package.json';\n` +
        `import '@ionic/core/css/core.css';\n`,
    });

    expect(corePackageExports.detect(ctx)).toEqual([]);
  });

  it('ignores imports from other packages that merely start the same way', () => {
    const ctx = createInMemoryContext({
      'app.ts': `import { x } from '@ionic/core-utils/deep/path';\n`,
    });

    expect(corePackageExports.detect(ctx)).toEqual([]);
  });
});
