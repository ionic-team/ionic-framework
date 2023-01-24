import { expect } from '@playwright/test';
import { test } from '@utils/test/playwright';

test.describe('textarea: autogrow', () => {
  test('should not have visual regressions', async ({ page }) => {
    await page.goto(`/src/components/textarea/test/legacy/autogrow`);

    await page.setIonViewport();

    expect(await page.screenshot()).toMatchSnapshot(`textarea-autogrow-diff-${page.getSnapshotSettings()}.png`);
  });

  test('should grow when typing', async ({ page }) => {
    await page.setContent(
      `
      <ion-app>
        <ion-content>
          <ion-list>
            <ion-item>
              <ion-textarea auto-grow="true" legacy="true"></ion-textarea>
            </ion-item>
          </ion-list>
        </ion-content>
      </ion-app>`
    );

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

    expect(await textarea.screenshot()).toMatchSnapshot(`textarea-autogrow-after-${page.getSnapshotSettings()}.png`);
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
            legacy="true"
            auto-grow="true"
            value="abcdefghijklmnopqrstuvwxyzabcdefghijklmnopqrstuvwxyzabcdefghijklmnopqrstuvwxyzabcdefghijklmnopqrstuvwxyzabcdefghijklmnopqrstuvwxyzabcdefghijklmnopqrstuvwxyzabcdefghijklmnopqrstuvwxyzabcdefghijklmnopqrstuvwxyzabcdefghijklmnopqrstuvwxyzabcdefghijklmnopqrstuvwxyzabcdefghijklmnopqrstuvwxyzabcdefghijklmnopqrstuvwxyzabcdefghijklmnopqrstuvwxyzabcdefghijklmnopqrstuvwxyzabcdefghijklmnopqrstuvwxyzabcdefghijklmnopqrstuvwxyzabcdefghijklmnopqrstuvwxyzabcdefghijklmnopqrstuvwxyz">
          </ion-textarea>
        </ion-content>
      </ion-app>`
    );

    const textarea = await page.locator('ion-textarea');

    expect(await textarea.screenshot()).toMatchSnapshot(
      `textarea-autogrow-word-break-${page.getSnapshotSettings()}.png`
    );
  });
});
