# Playwright Test Utils

The testing directory within Ionic's codebase contains utilities that can be used to more easily test Stencil projects with Playwright.

## Table of Contents

- [`test` function](#test-function)
- [`page` fixture](#page-fixture)
- [Generators](#generators)
- [Matchers](#matchers)

## `test` Function

The default [`test` function](https://playwright.dev/docs/api/class-test) has been extended to provide two custom options.

| Fixture | Type | Description |
| ------- | ---- | ----------- |
| page    | [E2EPage](https://github.com/ionic-team/ionic-framework/blob/main/core/src/utils/test/playwright/playwright-declarations.ts) | An extension of the base `page` test fixture within Playwright |
| skip    | [E2ESkip](https://github.com/ionic-team/ionic-framework/blob/main/core/src/utils/test/playwright/playwright-declarations.ts) | Used to skip tests based on text direction, mode, or browser |

<details>
  
<summary>Usage</summary>

**`page`**

```typescript
import { configs, test } from '@utils/test/playwright';

configs().forEach(({ config, title }) => {
  test.describe(title('my test block'), () => {
    test('my custom test', ({ page }) => {
      await page.goto('path/to/file', config);
    });
  });
});
```

**`skip.mode` (DEPRECATED)**

Deprecated: Use a [generator](#generators) instead.

```typescript
import { test } from '@utils/test/playwright';

test('my custom test', ({ page, skip }) => {
  skip.mode('md', 'This test is iOS-specific.');

  await page.goto('path/to/file');
});
```

**`skip.rtl` (DEPRECATED)**

Deprecated: Use a [generator](#generators) instead.

```typescript
import { test } from '@utils/test/playwright';

test('my custom test', ({ page, skip }) => {
  skip.rtl('This test does not have RTL-specific behaviors.');

  await page.goto('path/to/file');
});
```

**`skip.browser`**
```typescript
import { configs, test } from '@utils/test/playwright';

configs().forEach(({ config, title }) => {
  test.describe(title('my test block'), () => {
    test('my custom test', ({ page, skip }) => {
      skip.browser('webkit', 'This test does not work in WebKit yet.');
  
      await page.goto('path/to/file', config);
    });
  });
});
```

**`skip.browser` with callback**
```typescript
import { configs, test } from '@utils/test/playwright';

configs().forEach(({ config, title }) => {
  test.describe(title('my test block'), () => {
    test('my custom test', ({ page, skip }) => {
      skip.browser((browserName: string) => browserName !== 'webkit', 'This tests a WebKit-specific behavior.');
  
      await page.goto('path/to/file', config);
    });
  });
});
```

</details>

## `page` fixture

The [page fixture](https://playwright.dev/docs/test-fixtures) has been extended to provide additional methods:

| Method | Description |
| - | - |
| `goto` | The [page.goto](https://playwright.dev/docs/api/class-page#page-goto) method extended to support a config from a [generator](#generators) and to automatically wait for Stencil components to initialize. |
| `setContent` | The [page.setContent](https://playwright.dev/docs/api/class-page#page-set-content) method extended to support a config from a [generator](#generators) and to automatically wait for Stencil components to initialize. |
| `locator` | The [page.locator](https://playwright.dev/docs/api/class-page#page-locator) method extended to support `spyOnEvent`. |
| `setIonViewport` | Resizes the browser window to fit the entire height of `ion-content` on screen. Only needed when taking fullsize screenshots with `ion-content`. |
| `waitForChanges` | Waits for Stencil to re-render before proceeeding. This is typically only needed when you update a property on a component. |
| `spyOnEvent` | Creates an event spy that can be used to wait for a [CustomEvent](https://developer.mozilla.org/en-US/docs/Web/API/CustomEvent) to be emitted. |

<details>
  
<summary>Usage</summary>

### Using `goto`

```typescript
import { configs, test } from '@utils/test/playwright';

configs().forEach(({ config, title }) => {
  test.describe(title('my test block'), () => {
    test('my custom test', ({ page }) => {
      await page.goto('src/components/test/alert/test/basic', config);
    });
  });
});
```

### Using `setContent`

`setContent` should be used when you only need to render a small amount of markup.

```typescript
import { configs, test } from '@utils/test/playwright';

configs().forEach(({ config, title }) => {
  test.describe(title('my test block'), () => {
    test('my custom test', ({ page }) => {
      await page.setContent(`
        <ion-button>My Button</ion-button>
        <style>
          ion-button {
            --background: green;
          }
        </style>
      `, config);
    });
  });
});
```

### Using `locator`

Locators can be used even if the target element is not in the DOM yet.

```typescript
import { configs, test } from '@utils/test/playwright';

configs().forEach(({ config, title }) => {
  test.describe(title('my test block'), () => {
    test('my custom test', ({ page }) => {
      await page.goto('src/components/test/alert/test/basic', config);
      
      // Alert is not in the DOM yet
      const alert = page.locator('ion-alert');
      
      await page.click('#open-alert');
      
      // Alert is in the DOM
      await expect(alert).toBeVisible();
    });
  });
});
```

### Using `setIonViewport`

`setIonViewport` is only needed when a) you are using `ion-content` and b) you need to take a screenshot of the full page (including content that may overflow offscreen).

```typescript
import { configs, test } from '@utils/test/playwright';

configs().forEach(({ config, screenshot, title }) => {
  test.describe(title('my test block'), () => {
    test('my custom test', ({ page }) => {
      await page.goto('src/components/test/alert/test/basic', config);
      
      await page.setIonViewport();
      
      await expect(page).toHaveScreenshot(screenshot('alert'));  
    });
  });
});
```

### Using `waitForChanges`

`waitForChanges` is only needed when you must wait for Stencil to re-render before proceeding. This is commonly used when manually updating properties on Stencil components.

```typescript
import { configs, test } from '@utils/test/playwright';

configs().forEach(({ config, title }) => {
  test.describe(title('my test block'), () => {
    test('my custom test', ({ page }) => {
      await page.goto('src/components/test/modal/test/basic', config);
      
      const modal = page.locator('ion-modal');
      
      await modal.evaluate((el: HTMLIonModalElement) => el.canDismiss = false);
      
      // Wait for Stencil to re-render with the canDismiss changes
      await page.waitForChanges();
    });
  });
});
```

### Using `spyOnEvent`

```typescript
import { configs, test } from '@utils/test/playwright';

configs().forEach(({ config, screenshot, title }) => {
  test.describe(title('my test block'), () => {
    test('my custom test', ({ page }) => {
      await page.goto('src/components/test/modal/test/basic', config);
      
      // Create spy to listen for event
      const ionModalDidPresent = await page.spyOnEvent('ionModalDidPresent');
      
      await page.click('#present-modal');
      
      // Wait for the next emission of `ionModalDidPresent`
      await ionModalDidPresent.next();
    });
  });
});
```

</details>

## Generators

Ionic generates tests to test different modes (iOS or MD), layouts (LTR or RTL), and themes (default or dark).

### Customizing the test configs

The `configs` function accepts an object containing all the configurations you want to test. It then returns an array of each individual configuration combination. This result is iterated over and one or more tests are generated in each iteration.

<details>
  
<summary>Usage</summary>

**Example 1: Default config**
```typescript
import { configs, test } from '@utils/test/playwright';

/**
 * This will generate the following test configs
 * iOS, LTR
 * iOS, RTL
 * Material Design, LTR
 * Material Design, RTL
 */
configs().forEach(({ config, title }) => {
  test.describe(title('my test block'), () => {
    test('my custom test', ({ page }) => {
      ...
    });
  });
});
```

**Example 2: Configuring the mode**
```typescript
import { configs, test } from '@utils/test/playwright';

/**
 * This will generate the following test configs
 * iOS, LTR
 * iOS, RTL
 */
configs({ mode: ['ios'] }).forEach(({ config, title }) => {
  test.describe(title('my test block'), () => {
    test('my custom test', ({ page }) => {
      ...
    });
  });
});
```

**Example 3: Configuring the direction**
```typescript
import { configs, test } from '@utils/test/playwright';

/**
 * This will generate the following test configs
 * Material Design, RTL
 * iOS, RTL
 */
configs({ directions: ['rtl'] }).forEach(({ config, title }) => {
  test.describe(title('my test block'), () => {
    test('my custom test', ({ page }) => {
      ...
    });
  });
});
```

</details>

### Using the return value from each configuration

Each value in the array returns by `configs` contains the following information:

| Name | Description |
| - | - |
| `config` | An object containing a single test configuration. This gets passed to `page.goto` or `page.setContent`. |
| `screenshot` | A helper function that generates a unique screenshot name based on the test configuration. |
| `title` | A helper function that generates a unique test title based on the test configuration. Playwright requires that each test has a unique title since it uses that to generate a test ID. |

<details>
  
<summary>Usage</summary>

**Example**
```typescript
import { configs, test } from '@utils/test/playwright';

configs().forEach(({ config, title }) => {
  /**
   * Use the "title" function to generate 
   * a "my test block" title with the test 
   * config appended to make it unique.
   * Example: my test block ios/ltr
   * Using "title" on the describe block
   * avoids the need to use "title" on each
   * inner test block.
   */
  test.describe(title('my test block'), () => {
    test('my custom test', ({ page }) => {
      
      /**
       * Pass a single config object to
       * load the page with the correct mode,
       * text direction, and theme.
       */
      await page.goto('/src/components/alert/test/basic', config);
      
      /**
       * Use the "screenshot" function to generate
       * a "alert" screenshot title with the test
       * config appended to make it unique. Playwright
       * will also append the browser and platform.
       * Example: alert-ios-ltr-chrome-linux.png
       */
      await expect(page).toHaveScreenshot(screenshot('alert'));  
    });
  });
});
```

</details>

## Matchers

Playwright comes with [a set of matchers to do test assertions](https://playwright.dev/docs/test-assertions). However, Ionic has additional custom assertions.

| Assertion | Description |
| - | - |
| `toHaveReceivedEvent` | Ensures an event has received an event at least once. |
| `toHaveReceviedEventDetail` | Ensures an event has been received with a specified [CustomEvent.detail](https://developer.mozilla.org/en-US/docs/Web/API/CustomEvent/detail) payload. |
| `toHaveReceivedEventTimes` | Ensures an event has been received a certain number of times. |

<details>
  
<summary>Usage</summary>

### Using `toHaveReceivedEvent`

```typescript
import { configs, test } from '@utils/test/playwright';

configs().forEach(({ config, screenshot, title }) => {
  test.describe(title('my test block'), () => {
    test('my custom test', ({ page }) => {
      await page.setContent(`
        <ion-input label="Email"></ion-input>
      `, config);
      
      const ionChange = await page.spyOnEvent('ionChange');
      const input = page.locator('ion-input');
      
      await input.type('hi@ionic.io');
  
      // In this case you can also use await ionChange.next();
      await expect(ionChange).toHaveReceivedEvent();
    });
  });
});
```

### Using `toHaveReceivedEventDetail`

```typescript
import { configs, test } from '@utils/test/playwright';

configs().forEach(({ config, screenshot, title }) => {
  test.describe(title('my test block'), () => {
    test('my custom test', ({ page }) => {
      await page.setContent(`
        <ion-input label="Email"></ion-input>
      `, config);
      
      const ionChange = await page.spyOnEvent('ionChange');
      const input = page.locator('ion-input');
      
      await input.type('hi@ionic.io');
  
      await ionChange.next();
      await expect(ionChange).toHaveReceivedEventDetail({ value: 'hi@ionic.io' });
    });
  });
});
```

### Using `toHaveReceivedEventTimes`

```typescript
import { configs, test } from '@utils/test/playwright';

configs().forEach(({ config, screenshot, title }) => {
  test.describe(title('my test block'), () => {
    test('my custom test', ({ page }) => {
      await page.setContent(`
        <ion-input label="Email"></ion-input>
      `, config);
      
      const ionChange = await page.spyOnEvent('ionChange');
      const input = page.locator('ion-input');
      
      await input.type('hi@ionic.io');
  
      await ionChange.next();
      
      await input.type('goodbye@ionic.io');
      
      await ionChange.next();
      
      await expect(ionChange).toHaveReceivedEventTimes(2);
    });
  });
});
```

</details>
