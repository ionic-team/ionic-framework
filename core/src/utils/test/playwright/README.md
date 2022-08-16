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
import { test } from '@utils/test/playwright';

test('my custom test', ({ page }) => {
  await page.goto('path/to/file');
});
```

**`skip.mode`**

```typescript
import { test } from '@utils/test/playwright';

test('my custom test', ({ page, skip }) => {
  skip.mode('md', 'This test is iOS-specific.');

  await page.goto('path/to/file');
});
```

**`skip.rtl`**
```typescript
import { test } from '@utils/test/playwright';

test('my custom test', ({ page, skip }) => {
  skip.rtl('This test does not have RTL-specific behaviors.');

  await page.goto('path/to/file');
});
```

**`skip.browser`**
```typescript
import { test } from '@utils/test/playwright';

test('my custom test', ({ page, skip }) => {
  skip.browser('webkit', 'This test does not work in WebKit yet.');

  await page.goto('path/to/file');
});
```

**`skip.browser` with callback**
```typescript
import { test } from '@utils/test/playwright';

test('my custom test', ({ page, skip }) => {
  skip.browser((browserName: string) => browserName !== 'webkit', 'This tests a WebKit-specific behavior.');

  await page.goto('path/to/file');
});
```