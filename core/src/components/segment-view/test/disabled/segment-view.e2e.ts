import { expect } from '@playwright/test';
import { configs, test } from '@utils/test/playwright';

/**
 * This behavior does not vary across directions
 */
configs({ directions: ['ltr'] }).forEach(({ title, screenshot, config }) => {
  test.describe(title('segment-view: disabled'), () => {
    test('should not have visual regressions', async ({ page }) => {
      await page.goto('/src/components/segment-view/test/disabled', config);

      await expect(page).toHaveScreenshot(screenshot(`segment-view-disabled`));
    });
  });
});

/**
 * This behavior does not vary across modes/directions
 */
configs({ modes: ['md'], directions: ['ltr'] }).forEach(({ title, config }) => {
  test.describe(title('segment-view: disabled'), () => {
    test('should keep button enabled even when disabled prop is set', async ({ page }) => {
      await page.setContent(
        `
        <ion-segment>
          <ion-segment-button content-id="paid" value="paid">
            <ion-label>Paid</ion-label>
          </ion-segment-button>
          <ion-segment-button disabled content-id="free" value="free">
            <ion-label>Free</ion-label>
          </ion-segment-button>
          <ion-segment-button content-id="top" value="top">
            <ion-label>Top</ion-label>
          </ion-segment-button>
        </ion-segment>
        <ion-segment-view>
          <ion-segment-content disabled id="paid">Paid</ion-segment-content>
          <ion-segment-content id="free">Free</ion-segment-content>
          <ion-segment-content id="top">Top</ion-segment-content>
        </ion-segment-view>
      `,
        config
      );

      const segmentButton = page.locator('ion-segment-button[value="free"]');
      await expect(segmentButton).not.toHaveClass(/segment-button-disabled/);
    });
  });
});

/**
 * Frameworks that assign element props after inserting the element have set neither
 * `contentId` nor `disabled` while `connectedCallback` runs, so the check that keeps a
 * button enabled has to happen later.
 *
 * The shared harness page is used because it loads the custom elements build, which is
 * where that ordering applies.
 *
 * This behavior does not vary across modes or directions.
 */
configs({ modes: ['ios'], directions: ['ltr'] }).forEach(({ title, config }) => {
  test.describe(title('segment-view: disabled'), () => {
    [false, true].forEach((lateProps) => {
      const when = lateProps ? 'after connecting' : 'before connecting';

      test(`should only re-enable the developer-disabled button when props are assigned ${when}`, async ({ page }) => {
        const warnings: string[] = [];

        page.on('console', (msg) => {
          if (msg.type() === 'warning') {
            warnings.push(msg.text());
          }
        });

        await page.goto('/src/utils/test/late-props', config);
        await page.waitForFunction(() => (window as any).harnessReady === true);

        await page.evaluate(
          (late: boolean) =>
            (window as any).mountLateProps(
              ['ion-segment', 'ion-segment-button', 'ion-segment-view', 'ion-segment-content', 'ion-label'],
              {
                tag: 'div',
                children: [
                  {
                    // The developer disabled the second button, which has to be forced back on.
                    tag: 'ion-segment',
                    props: { value: 'first' },
                    children: [
                      {
                        tag: 'ion-segment-button',
                        props: { value: 'first', contentId: 'first-content' },
                        children: [{ tag: 'ion-label', children: ['First'] }],
                      },
                      {
                        tag: 'ion-segment-button',
                        props: { value: 'second', contentId: 'second-content', disabled: true },
                        children: [{ tag: 'ion-label', children: ['Second'] }],
                      },
                    ],
                  },
                  {
                    tag: 'ion-segment-view',
                    children: [
                      { tag: 'ion-segment-content', attrs: { id: 'first-content' }, children: ['First'] },
                      { tag: 'ion-segment-content', attrs: { id: 'second-content' }, children: ['Second'] },
                    ],
                  },
                  {
                    // This whole segment is disabled, so its buttons stay off.
                    tag: 'ion-segment',
                    props: { value: 'third', disabled: true },
                    children: [
                      {
                        tag: 'ion-segment-button',
                        props: { value: 'third', contentId: 'third-content' },
                        children: [{ tag: 'ion-label', children: ['Third'] }],
                      },
                      {
                        tag: 'ion-segment-button',
                        props: { value: 'fourth', contentId: 'fourth-content' },
                        children: [{ tag: 'ion-label', children: ['Fourth'] }],
                      },
                    ],
                  },
                  {
                    tag: 'ion-segment-view',
                    children: [
                      { tag: 'ion-segment-content', attrs: { id: 'third-content' }, children: ['Third'] },
                      { tag: 'ion-segment-content', attrs: { id: 'fourth-content' }, children: ['Fourth'] },
                    ],
                  },
                ],
              },
              late
            ),
          lateProps
        );
        await page.waitForChanges();

        const disabled = await page
          .locator('ion-segment')
          .evaluateAll((segments: HTMLIonSegmentElement[]) =>
            segments.map((segment) =>
              Array.from(segment.querySelectorAll('ion-segment-button')).map((button) => button.disabled)
            )
          );

        expect(disabled).toEqual([
          [false, false],
          [true, true],
        ]);
        expect(warnings.join('\n')).toContain(
          '[ion-segment-button] - Segment buttons cannot be disabled when associated with an <ion-segment-content>.'
        );
      });
    });
  });
});
