# Best Practices

This guide details best practices that should be followed when writing E2E tests.

## Table of Contents

- [Use the customized `test` function](#practice-test)
- [Break up test directories per-feature](#practice-per-feature)
- [Follow the file format](#practice-file-format)
- [Ensure each component has a `basic` test directory with an `index.html` file](#practice-basic)
- [Use `test.describe` blocks to describe groups of tests](#practice-test-describe)
- [Place `configs` generator outside the `test.describe` block](#practice-config-describe)
- [Test rendering and functionality in separate `test.describe` blocks](#practice-describe-type)
- [Break up large or slow-running tests across multiple files](#practice-slow-tests)
- [Use standard viewport sizes](#practice-viewport)
- [Avoid using screenshots as a way of verifying functionality](#practice-screenshot-functionality)
- [Avoid tests that compare computed values](#practice-test-computed)
- [Test for positive and negative cases](#practice-positive-negative)
- [Start your test with the configuration or layout in place if possible](#practice-test-config)
- [Place your test closest to the fix or feature](#practice-test-close)
- [Account for different locales when writing tests](#practice-locales)

<h2 id="practice-test">Use the customized `test` function</h2>

Do not import the `test` fixture from `@playwright/test`. Instead, use the `test` fixture defined in `@utils/test/playwright`. This is a custom Playwright fixture that extends the built-in `test` fixture and has logic to wait for the Stencil app to load before proceeding with the test. If you do not use this test fixture, your screenshots will likely be blank.

Since this fixture extends the built in `test` fixture, all of the normal methods found in the Playwright documentation still apply.

This is the only custom fixture you need. All of the other fixtures such as `expect` can be imported from `@playwright/test`.

**Note**: `@utils` is an alias defined in `tsconfig.json` that points to `/src/utils`. This lets us avoid doing `../../../../` if we are several folders deep when importing.

<h2 id="practice-per-feature">Break up test directories per-feature</h2>

Tests should be broken up per-feature. This makes it easy for team members to quickly find tests for a particular feature. Additionally, the names of test directories should use kebab-case.

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

<h2 id="practice-file-format">Follow the file format</h2>

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

<h2 id="practice-basic">Ensure each component has a `basic` test directory with an `index.html` file</h2>

At a minimum, each component with a `tests` directory must also have a `basic` directory with an `index.html` file. This is done so team members can easily paste usage examples to test out when developing or reviewing PRs. The `basic` directory may have E2E tests, but they should be limited to testing the default (or basic) behavior of a component.

<h2 id="practice-test-describe">Use `test.describe` blocks to describe groups of tests</h2>

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

<h2 id="practice-config-describe">Place `configs` generator outside the `test.describe` block</h2>

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
<h2 id="practice-describe-type">Test rendering and functionality in separate `test.describe` blocks</h2>

Avoid mixing tests that take screenshots with tests that check functionality. These types of tests often have different requirements that can make a single `test.describe` block hard to understand. For example, a screenshot test might check both iOS and MD modes with LTR and RTL text directions, but a functionality test may not need that if the functionality is consistent across modes and directions.

If using multiple `test.describe` blocks creates a large test file, consider breaking up these tests across multiple files.

<h2 id="practice-slow-tests">Break up large or slow-running tests across multiple files</h2>

Tests are distributed across many test runners on continuous integration (CI) to improve performance. However, Playwright [distributes tests](https://playwright.dev/docs/test-parallel) based on test file, not individual test. This means test files that are particularly slow will negatively impact the overall CI performance.

<h2 id="practice-viewport">Use standard viewport sizes</h2>

By default, we run tests on mobile viewports only (think iPhone sized viewports). However, there are some components that have different layouts on tablet viewports. Two examples are `ion-split-pane` and the card variant of `ion-modal`.

For this scenario, developers must write tests that target the tablet viewport. This can be done by using [page.setViewportSize](https://playwright.dev/docs/api/class-page#page-set-viewport-size). The Playwright test utils directory also contains a `Viewports` constant which contains some common viewport presets. Developers should feel free to add new viewports to this as is applicable.

**Example:** 

```javascript
import { configs, test, Viewports } from '@utils/test/playwright';

configs().forEach(({ config, title }) => {
  test.describe(title('thing: rendering'), () => {
    test('it should do a thing on tablet viewports', async ({ page }) => {
      await page.setViewportSize(Viewports.tablet.portrait);

      ...

      // test logic goes here
    });
  });
});
````

<h2 id="practice-screenshot-functionality">Avoid using screenshots as a way of verifying functionality</h2>

Screenshots are great for verifying visual differences, but using it to verify functionality can lead to issues. Instead, try testing for the existence of elements in the DOM, events emitted, etc.

❌ Incorrect

This test ensures that the `isOpen` property opens a modal when `true`. It does not verify that the inner contents of a modal are rendered as expected as that is outside the scope of this test. As a result, using a screenshot would not be appropriate here.

```typescript
configs().forEach(({ config, title }) => {
  test.describe(title('modal: rendering') => {
    test('it should open a modal', async ({ page }) => {
      await page.setContent('<ion-modal is-open="true">...</ion-modal>', config);
      
      await expect(page).toHaveScreenshot(screenshot('modal-open'));
    });
  });
});
````

✅ Correct

Instead, we can use a `toBeVisible` assertion to verify that `isOpen` does present a modal when `true`.

```typescript
configs().forEach(({ config, title }) => {
  test.describe(title('modal: rendering') => {
    test('it should open a modal', async ({ page }) => {
      await page.setContent('<ion-modal is-open="true">...</ion-modal>', config);
      
      const modal = page.locator('ion-modal');
      await expect(modal).toBeVisible();
    });
  });
});
````

<h2 id="practice-test-computed">Avoid tests that compare computed values</h2>

All browsers render web content in slightly different manners. Instead of testing computed values such as exact pixel values, screenshots are a great way to ensure that elements are being rendered in a consistent manner across browsers.

<h2 id="practice-positive-negative">Test for positive and negative cases</h2>

It’s important to test that your code works when the API is used as intended, but what happens if someone makes a mistake? While some errors are fine, incorrect usage should not cause catastrophic failures such as data loss. While TypeScript helps catch incorrect usages, not everyone uses TypeScript in Ionic apps. Additionally, developers will sometimes typecast as `any`.

<h2 id="practice-test-config">Start your test with the configuration or layout in place if possible</h2>

This allows tests to remain fast on CI as we can focus on the test itself instead of navigating to the state where the test begins. For example, a simple [scrollIntoViewIfNeeded in Playwright](https://playwright.dev/docs/api/class-locator#locator-scroll-into-view-if-needed) can take around 300ms on CI. Since we run a single test for multiple configurations, that 300ms can add up quickly. Consider setting up your test in a way that the element you want to test is already in view when the test starts.

<h2 id="practice-test-close">Place your test closest to the fix or feature</h2>

Tests should be placed closest to where the fix or feature was implemented. This means that if a fix was written for `ion-button`, then the test should be placed in `src/components/button/tests`.

<h2 id="practice-locales">Account for different locales when writing tests</h2>

Tests ran on CI may not run on the same locale as your local machine. It's always a good idea to apply locale considerations to components that support it, when writing tests (i.e. `ion-datetime` should specify `locale="en-US"`).
