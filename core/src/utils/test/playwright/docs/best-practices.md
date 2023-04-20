# Best Practices

This guide details best practices that should be followed when writing E2E tests.

## Use the customized `test` function

Do not import the `test` fixture from `@playwright/test`. Instead, use the `test` fixture defined in `@utils/test/playwright`. This is a custom Playwright fixture that extends the built-in `test` fixture and has logic to wait for the Stencil app to load before proceeding with the test. If you do not use this test fixture, your screenshots will likely be blank.

Since this fixture extends the built in `test` fixture, all of the normal methods found in the Playwright documentation still apply.

This is the only custom fixture you need. All of the other fixtures such as `expect` can be imported from `@playwright/test`.

**Note**: `@utils` is an alias defined in `tsconfig.json` that points to `/src/utils`. This lets us avoid doing `../../../../` if we are several folders deep when importing.

## Break up test directories per-feature

Tests should be broken up per-feature. This makes it easy for team members to quickly find tests for a particular feature. Additionally, the names of test directories should use kebab-case.

At a minimum, each component with a `tests` directory must also have a `basic` directory with an `index.html` file. This is done so team members can easily paste usage examples to test out when developing or reviewing PRs. The `basic` directory may have E2E tests, but they should be limited to testing the default (or basic) behavior of a component.

```diff
basic/component.e2e.ts
feature-a/component.e2e.ts
feature-b/component.e2e.ts
feature-c/component.e2e.ts
```

**Example:**

[Datetime Tests](https://github.com/ionic-team/ionic-framework/tree/main/core/src/components/datetime/test)

The `first-day-of-week` directory has all the tests for the `firstDayOfWeek` property on `ion-datetime`, and the `color` directory has all the tests for the `color` property usage.

Some features can be combined together, and so it is acceptable in this instance to test features together in a single directory.

## Follow the [component name].e2e.ts format

E2E test files should follow this format: 

```tsx
[component name].e2e.ts
```

It is recommended to have one E2E test file per directory.

**Example:**

```tsx
/basic
  button.e2e.ts
/anchor
  button.e2e.ts
/form
  button.e2e.ts
```

In the event you need multiple E2E files per directory, add a modifier to the file that makes it unique.

**Example:**

```tsx

/basic
  modal-controller.e2e.ts // E2E tests for ion-modal via modalController
  modal-inline.e2e.ts  // E2E tests for ion-modal via <ion-modal>
```

## Use `test.describe` blocks to describe groups of tests

Each E2E test file should have at least 1 `test.describe` block which defines the component and the feature you are testing.

**Example:**

```tsx
// src/components/button/test/basic/button.e2e.ts

import { configs, test } from '@utils/test/playwright';

configs().forEach(({ title }) => {
  test.describe(title('button: disabled state'), () => {
    ...
  });
});
```

There should be one or more `test` blocks which have individual tests. The test name describes what the test should do.

**Example:**

```jsx
 // src/components/button/test/basic/button.e2e.ts

import { configs, test } from '@utils/test/playwright';

configs().forEach(({ title }) => {
  test.describe(title('button: disabled state'), () => {
    test('should not have any visual regressions', async ({ page }) => {
      ...
    });
  });
});
```

## Place `configs` generator outside the `test.describe` block

The `configs()` generator should be done outside of the `test.describe` block. The benefit of this is it lets you use `test.beforeEach` to run a common `page.goto` or `page.setContent` while passing in the correct config. It also lets you use the `title` function just on the `test.describe` block instead of each `test` inside the block.

❌ Incorrect

```typescript
import { configs test } from '@utils/test/playwright';

test.describe('button: disabled state', () => {
  configs().forEach(({ config, title }) => {
    /**
     * This will generate a `test.beforeEach` for each test
     * config, and all of the generated `test.beforeEach` blocks
     * will be run on each test.
     */
    test.beforeEach(async ({ page }) => {
      await page.goto('/src/components/button/test', config);
    });
    
    test(title('should not have any visual regressions'), async ({ page }) => {
      ...
    });
  });
});
```

✅ Correct

```typescript
import { configs test } from '@utils/test/playwright';

configs().forEach(({ config, title }) => {
  test.describe(title('button: disabled state'), () => {
    /**
     * This will generate one `test.beforeEach` for
     * each `test.describe` block rather than for
     * each `test` inside of the `test.describe` block.
     */
    test.beforeEach(async ({ page }) => {
      await page.goto('/src/components/button/test', config);
    });
    
    /**
     * Test title is still unique because of our use of title()
     * on the test.describe block.
     */
    test('should not have any visual regressions', async ({ page }) => {
      ...
    });
  });
});
```

## Use standard viewport sizes

By default, we run tests on mobile viewports only (think iPhone sized viewports). However, there are some components that have different layouts on tablet viewports. Two examples are `ion-split-pane` and the card variant of `ion-modal`.

For this scenario, developers must write tests that target the tablet viewport. This can be done by  using [page.setViewportSize](https://playwright.dev/docs/api/class-page#page-set-viewport-size). The Playwright test utils directory also contains a `TabletViewport` constant which can be used to take consistent tablet-sized screenshots.

**Example:** 

```javascript
import { test, TabletViewport } from '@utils/test/playwright';

...

test('it should do a thing on tablet viewports', async ({ page }) => {
  await page.setViewportSize(TabletViewport);

  ...

  // test logic goes here
});
````
