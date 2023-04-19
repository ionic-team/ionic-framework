# Playwright Test Utils

This directory contains utilities that can be used to more easily test Stencil projects with Playwright.

## Test Function

The default `test` function has been extended to provide two custom options.

| Fixture | Type | Description |
| ------- | ---- | ----------- |
| page    | [E2EPage](https://github.com/ionic-team/ionic-framework/blob/main/core/src/utils/test/playwright/playwright-declarations.ts) | An extension of the base `page` test fixture within Playwright |
| skip    | [E2ESkip](https://github.com/ionic-team/ionic-framework/blob/main/core/src/utils/test/playwright/playwright-declarations.ts) | Used to skip tests based on text direction, mode, or browser |

### Usage

**`page`**

```typescript
import { configs, test } from '@utils/test/playwright';

configs().forEach(({ config, title }) => {
  test(title('my custom test'), ({ page }) => {
    await page.goto('path/to/file', config);
  });
});
```

**`skip.mode` (DEPRECATED)**

```typescript
import { test } from '@utils/test/playwright';

test('my custom test', ({ page, skip }) => {
  skip.mode('md', 'This test is iOS-specific.');

  await page.goto('path/to/file');
});
```

Deprecated: Use a generator instead.

**`skip.rtl` (DEPRECATED)**
```typescript
import { test } from '@utils/test/playwright';

test('my custom test', ({ page, skip }) => {
  skip.rtl('This test does not have RTL-specific behaviors.');

  await page.goto('path/to/file');
});
```

Deprecated: Use a generator instead.

**`skip.browser`**
```typescript
import { configs, test } from '@utils/test/playwright';

configs().forEach(({ config, title }) => {
  test(title('my custom test'), ({ page, skip }) => {
    skip.browser('webkit', 'This test does not work in WebKit yet.');

    await page.goto('path/to/file', config);
  });
});
```

**`skip.browser` with callback**
```typescript
import { configs, test } from '@utils/test/playwright';

configs().forEach(({ config, title }) => {
  test(title('my custom test'), ({ page, skip }) => {
    skip.browser((browserName: string) => browserName !== 'webkit', 'This tests a WebKit-specific behavior.');

    await page.goto('path/to/file', config);
  });
});
```

## `page` fixture

The [page fixture](https://playwright.dev/docs/test-fixtures) has been extended to provide additional methods:

| Method | Description |
| - | - |
| `goto` | The [page.goto](https://playwright.dev/docs/api/class-page#page-goto) method extended to support a config from a generator. |
| `setContent` | The [page.setContent](https://playwright.dev/docs/api/class-page#page-set-content) method extended to support a config from a generator. |
| `locator` | The [page.locator](https://playwright.dev/docs/api/class-page#page-locator) method extended to support `spyOnEvent` for generator results. |
| `setIonViewport` | Resizes the browser window to fit the entire height of `ion-content` on screen. Only needed when taking fullsize screenshots with `ion-content`. |
| `waitForChanges` | Waits for Stencil to re-render before proceeeding. This is typically only needed when you update a property on a component. |
| `spyOnEvent` | Creates an event spy that can be used to wait for a [CustomEvent](https://developer.mozilla.org/en-US/docs/Web/API/CustomEvent) to be emitted. |
| `getSnapshotSettings` (DEPRECATED) | Returns information about the current test (such as mode or direction) to generate a unique screenshot name. Deprecated: Use the `screenshot` function provided by the test generator instead. |

### Using `goto`

```typescript
import { configs, test } from '@utils/test/playwright';

configs().forEach(({ config, title }) => {
  test(title('my custom test'), ({ page }) => {
    await page.goto('src/components/test/alert/test/basic', config);
  });
});
```

### Using `setContent`

`setContent` should be used when you only need to render a small amount of markup.

```typescript
import { configs, test } from '@utils/test/playwright';

configs().forEach(({ config, title }) => {
  test(title('my custom test'), ({ page }) => {
    await page.setContenet(`
      <ion-button>My Button</ion-button>
      <style>
        ion-button {
          --background: green;
        }
      </style>
    `, config);
  });
});
```

### Using `locator`

Locators can be used even if the target element is not in the DOM yet.

```typescript
import { configs, test } from '@utils/test/playwright';

configs().forEach(({ config, title }) => {
  test(title('my custom test'), ({ page }) => {
    await page.goto('src/components/test/alert/test/basic', config);
    
    // Alert is not in the DOM yet
    const alert = page.locator('ion-alert');
    
    await page.click('#open-alert');
    
    // Alert is in the DOM
    await expect(alert).toBeVisible();
  });
});
```

### Using `setIonViewport`

`setIonViewport` is only needed when a) you are using `ion-content` and b) you need to take a screenshot of the full page (including content that may overflow offscreen).

```typescript
import { configs, test } from '@utils/test/playwright';

configs().forEach(({ config, screenshot, title }) => {
  test(title('my custom test'), ({ page }) => {
    await page.goto('src/components/test/alert/test/basic', config);
    
    await page.setIonViewport();
    
    await expect(page).toHaveScreenshot(screenshot('alert'));  
  });
});
```

### Using `waitForChanges`

`waitForChanges` is only needed when you must wait for Stencil to re-render before proceeding. This is commonly used when manually updating properties on Stencil components.

```typescript
import { configs, test } from '@utils/test/playwright';

configs().forEach(({ config, title }) => {
  test(title('my custom test'), ({ page }) => {
    await page.goto('src/components/test/modal/test/basic', config);
    
    const modal = page.locator('ion-modal');
    
    await modal.evaluate((el: HTMLIonModalElement) => el.canDismiss = false);
    
    // Wait for Stencil to re-render with the canDismiss changes
    await page.waitForChanges();
  });
});
```

### Using `spyOnEvent`

```typescript
import { configs, test } from '@utils/test/playwright';

configs().forEach(({ config, screenshot, title }) => {
  test(title('my custom test'), ({ page }) => {
    await page.goto('src/components/test/modal/test/basic', config);
    
    // Create spy to listen for event
    const ionModalDidPresent = await page.spyOnEvent('ionModalDidPresent');
    
    await page.click('#present-modal');
    
    // Wait for the next emission of `ionModalDidPresent`
    await ionModalDidPresent.next();
  });
});
```