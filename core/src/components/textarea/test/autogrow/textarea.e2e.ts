import { expect } from '@playwright/test';
import { test } from '@utils/test/playwright';

test.describe('textarea: autogrow', () => {
  test('should not have visual regressions', async ({ page }) => {
    await page.goto(`/src/components/textarea/test/autogrow`);

    await page.setIonViewport();

    await expect(page).toHaveScreenshot(`textarea-autogrow-diff-${page.getSnapshotSettings()}.png`);
  });

  test('should grow when typing', async ({ page }) => {
<<<<<<< HEAD
    await page.setContent(
      `
      <ion-app>
        <ion-content>
          <ion-list>
            <ion-textarea auto-grow="true"></ion-textarea>
          </ion-list>
        </ion-content>
      </ion-app>`
    );
=======
    await page.setContent(`
      <ion-textarea auto-grow="true"></ion-textarea>
    `);

    const ionTextarea = page.locator('ion-textarea');
    const nativeTextarea = ionTextarea.locator('textarea');

    await nativeTextarea.type('Now, this is a story all about how');

    await expect(ionTextarea).toHaveScreenshot(`textarea-autogrow-initial-${page.getSnapshotSettings()}.png`);
>>>>>>> origin/main

    const textarea = await page.waitForSelector('ion-textarea');

    await textarea.click();

    await page.waitForChanges();

    await textarea.type('Now, this is a story all about how');

    await page.setIonViewport();

    expect(await textarea.screenshot()).toMatchSnapshot(`textarea-autogrow-initial-${page.getSnapshotSettings()}.png`);

    await textarea.type(
      [
        `\nMy life got flipped-turned upside down`,
        `And I'd like to take a minute`,
        `Just sit right there`,
        `I'll tell you how I became the prince of a town called Bel-Air`,
      ].join('\n')
    );

<<<<<<< HEAD
    expect(await textarea.screenshot()).toMatchSnapshot(`textarea-autogrow-after-${page.getSnapshotSettings()}.png`);
=======
    await expect(ionTextarea).toHaveScreenshot(`textarea-autogrow-after-${page.getSnapshotSettings()}.png`);
>>>>>>> origin/main
  });

  test('should break long lines without white space', async ({ page }) => {
    test.info().annotations.push({
      type: 'issue',
      description: 'https://github.com/ionic-team/ionic-framework/issues/25893',
    });

    await page.setContent(
      `<ion-app>
        <ion-content>
          <ion-textarea
            auto-grow="true"
            value="abcdefghijklmnopqrstuvwxyzabcdefghijklmnopqrstuvwxyzabcdefghijklmnopqrstuvwxyzabcdefghijklmnopqrstuvwxyzabcdefghijklmnopqrstuvwxyzabcdefghijklmnopqrstuvwxyzabcdefghijklmnopqrstuvwxyzabcdefghijklmnopqrstuvwxyzabcdefghijklmnopqrstuvwxyzabcdefghijklmnopqrstuvwxyzabcdefghijklmnopqrstuvwxyzabcdefghijklmnopqrstuvwxyzabcdefghijklmnopqrstuvwxyzabcdefghijklmnopqrstuvwxyzabcdefghijklmnopqrstuvwxyzabcdefghijklmnopqrstuvwxyzabcdefghijklmnopqrstuvwxyzabcdefghijklmnopqrstuvwxyz">
          </ion-textarea>
        </ion-content>
      </ion-app>`
    );

    const textarea = await page.locator('ion-textarea');

    await expect(textarea).toHaveScreenshot(`textarea-autogrow-word-break-${page.getSnapshotSettings()}.png`);
  });
});
