# Generator Migration

This guide shows how to migrate an E2E test to use the new generator architecture.

## Steps to Migrate

1. Import `configs` from `@utils/test/playwright`.

```typescript
/**
 * test should already have been imported
 * for the existing E2E test.
 */
import { configs, test } from '@utils/test/playwright';
```

2. Inside of the `test.describe` block, call `configs` and pass in any of your configuration. This should replace any `skip.rtl` or `skip.mode` calls. `skip.browser` calls can remain in place. If you are not using `skip.rtl` or `skip.mode` then you can call `configs` without passing an options (i.e. `configs().forEach(...)`).

```typescript
import { configs, test } from '@utils/test/playwright';

test.describe('accordion: basic', () => {
  configs({ modes: ['ios'], directions: ['ltr'] }).forEach(({ config, title, screenshot }) => {
    ...
  });
});
```

:warning: Be careful when replacing `skip.rtl` and `skip.mode` with `configs`. For example, `skip.mode('md')` means that the test should _skip_ MD mode and only run in iOS mode **not** that the test should only run in MD mode. Similarly, `skip.rtl()` means that the test should only run in the LTR direction.

3. Update the title of each test to use the `title` function.

```typescript
import { configs, test } from '@utils/test/playwright';

test.describe('accordion: basic', () => {
  configs({ modes: ['ios'], directions: ['ltr'] }).forEach(({ config, title, screenshot }) => {
    test(title('should not have visual regressions'), async ({ page }) => {
      ...
    });
  });
});
```

4. Pass the `config` object to either `page.goto` or `page.setContent`.

```typescript
import { configs, test } from '@utils/test/playwright';

test.describe('accordion: basic', () => {
  configs({ modes: ['ios'], directions: ['ltr'] }).forEach(({ config, title, screenshot }) => {
    test(title('should not have visual regressions'), async ({ page }) => {
      await page.goto('/src/components/accordion/test/basic', config);
      
      /**
       * If using setContent:
       * await page.setContent('...', config);
       */
    });
  });
});
```

5. If taking a screenshot, replace `page.getSnapshotSettings()` with the `screenshot` function.

```typescript
import { configs, test } from '@utils/test/playwright';

test.describe('accordion: basic', () => {
  configs({ modes: ['ios'], directions: ['ltr'] }).forEach(({ config, title, screenshot }) => {
    test(title('should not have visual regressions'), async ({ page }) => {
      await page.goto('/src/components/accordion/test/basic', config);
      
      /**
       * The `screenshot` function will automatically add ".png"
       * as well as the test config.
       */
      await expect(page).toHaveScreenshot(screenshot('accordion-basic'));
    });
  });
});
```

6. Rename your `*.e2e-legacy.ts` file to `*.e2e.ts`.

**Example:** `accordion.e2e-legacy.ts` becomes `accordion.e2e.ts`

7. If the test has a screenshots directory, rename the `*.e2e-legacy.ts-snapshots` directory to `*.e2e.ts-snapshots`.

**Example:** `accordion.e2e-legacy.ts-snapshots` becomes `accordion.e2e.ts-snapshots`

8. Run `git add .` to stage your changes.

:warning: It is very important that you also stage the screenshot files when renaming the directory. The screenshot files are gitignored to prevent team members from accidentally overwriting the ground truth screenshots. As a result, you will need to bypass the gitignore to add the screenshots using the `--force` (`-f`) flag:

`git add -f src/components/[name of component]/test/[test directory]/**/*-linux.png`

This will forcibly stage only the screenshots generated on CI (due to the use of `-linux.png`).

**Example:** `git add -f src/components/accordion/test/basic/**/*-linux.png`

9. Review your changes. **There should be no deleted or added screenshots.** Instead, the screenshots should be listed as "renamed".

**Example:**

```
renamed:    src/components/accordion/test/basic/accordion.e2e-legacy.ts -> src/components/accordion/test/basic/accordion.e2e.ts
renamed:    src/components/accordion/test/basic/accordion.e2e-legacy.ts-snapshots/accordion-basic-ios-ltr-Mobile-Chrome-linux.png -> src/components/accordion/test/basic/accordion.e2e.ts-snapshots/accordion-basic-ios-ltr-Mobile-Chrome-linux.png
renamed:    src/components/accordion/test/basic/accordion.e2e-legacy.ts-snapshots/accordion-basic-ios-ltr-Mobile-Firefox-linux.png -> src/components/accordion/test/basic/accordion.e2e.ts-snapshots/accordion-basic-ios-ltr-Mobile-Firefox-linux.png
renamed:    src/components/accordion/test/basic/accordion.e2e-legacy.ts-snapshots/accordion-basic-ios-ltr-Mobile-Safari-linux.png -> src/components/accordion/test/basic/accordion.e2e.ts-snapshots/accordion-basic-ios-ltr-Mobile-Safari-linux.png
```

10. Commit your changes using the following format: `test([component]): migrate [test directory] to generators`

**Example:** `test(accordion): migrate basic to generators`

11. Push your changes.