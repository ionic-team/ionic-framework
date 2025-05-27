import { expect } from '@playwright/test';
import { configs, test } from '@utils/test/playwright';

/**
 * This behavior does not vary across modes/directions
 */
configs({ modes: ['md'], directions: ['ltr'] }).forEach(({ title, config }) => {
  test.describe(title('segment-view: basic'), () => {
    test('should show the first content with no initial value', async ({ page }) => {
      await page.setContent(
        `
        <ion-segment>
          <ion-segment-button content-id="paid" value="paid">
            <ion-label>Paid</ion-label>
          </ion-segment-button>
          <ion-segment-button content-id="free" value="free">
            <ion-label>Free</ion-label>
          </ion-segment-button>
          <ion-segment-button content-id="top" value="top">
            <ion-label>Top</ion-label>
          </ion-segment-button>
        </ion-segment>
        <ion-segment-view>
          <ion-segment-content id="paid">Paid</ion-segment-content>
          <ion-segment-content id="free">Free</ion-segment-content>
          <ion-segment-content id="top">Top</ion-segment-content>
        </ion-segment-view>
      `,
        config
      );

      const segmentContent = page.locator('ion-segment-content[id="paid"]');
      await expect(segmentContent).toBeInViewport();
    });

    test('should show the content matching the initial value', async ({ page }) => {
      await page.setContent(
        `
        <ion-segment value="free">
          <ion-segment-button content-id="paid" value="paid">
            <ion-label>Paid</ion-label>
          </ion-segment-button>
          <ion-segment-button content-id="free" value="free">
            <ion-label>Free</ion-label>
          </ion-segment-button>
          <ion-segment-button content-id="top" value="top">
            <ion-label>Top</ion-label>
          </ion-segment-button>
        </ion-segment>
        <ion-segment-view>
          <ion-segment-content id="paid">Paid</ion-segment-content>
          <ion-segment-content id="free">Free</ion-segment-content>
          <ion-segment-content id="top">Top</ion-segment-content>
        </ion-segment-view>
      `,
        config
      );

      const segmentContent = page.locator('ion-segment-content[id="free"]');
      await expect(segmentContent).toBeInViewport();
    });

    test('should update the content when changing the value by clicking a segment button', async ({ page }) => {
      await page.setContent(
        `
        <ion-segment value="free">
          <ion-segment-button content-id="paid" value="paid">
            <ion-label>Paid</ion-label>
          </ion-segment-button>
          <ion-segment-button content-id="free" value="free">
            <ion-label>Free</ion-label>
          </ion-segment-button>
          <ion-segment-button content-id="top" value="top">
            <ion-label>Top</ion-label>
          </ion-segment-button>
        </ion-segment>
        <ion-segment-view>
          <ion-segment-content id="paid">Paid</ion-segment-content>
          <ion-segment-content id="free">Free</ion-segment-content>
          <ion-segment-content id="top">Top</ion-segment-content>
        </ion-segment-view>
      `,
        config
      );

      await page.locator('ion-segment-button[value="top"]').click();

      const segmentContent = page.locator('ion-segment-content[id="top"]');
      await expect(segmentContent).toBeInViewport();
    });
  });

  test('should set correct segment button as checked when changing the value by scrolling the segment content', async ({
    page,
  }) => {
    await page.setContent(
      `
      <ion-segment value="free">
        <ion-segment-button content-id="paid" value="paid">
          <ion-label>Paid</ion-label>
        </ion-segment-button>
        <ion-segment-button content-id="free" value="free">
          <ion-label>Free</ion-label>
        </ion-segment-button>
        <ion-segment-button content-id="top" value="top">
          <ion-label>Top</ion-label>
        </ion-segment-button>
      </ion-segment>
      <ion-segment-view>
        <ion-segment-content id="paid">Paid</ion-segment-content>
        <ion-segment-content id="free">Free</ion-segment-content>
        <ion-segment-content id="top">Top</ion-segment-content>
      </ion-segment-view>
    `,
      config
    );

    await page
      .locator('ion-segment-view')
      .evaluate(
        (segmentView: HTMLIonSegmentViewElement) => !segmentView.classList.contains('segment-view-scroll-disabled')
      );

    await page.waitForChanges();

    await page.locator('ion-segment-content[id="top"]').scrollIntoViewIfNeeded();

    const segmentButton = page.locator('ion-segment-button[value="top"]');
    await expect(segmentButton).toHaveClass(/segment-button-checked/);
  });

  test('should set correct segment button as checked and show correct content when programmatically setting the segment vale', async ({
    page,
  }) => {
    await page.setContent(
      `
      <ion-segment value="free">
        <ion-segment-button content-id="paid" value="paid">
          <ion-label>Paid</ion-label>
        </ion-segment-button>
        <ion-segment-button content-id="free" value="free">
          <ion-label>Free</ion-label>
        </ion-segment-button>
        <ion-segment-button content-id="top" value="top">
          <ion-label>Top</ion-label>
        </ion-segment-button>
      </ion-segment>
      <ion-segment-view>
        <ion-segment-content id="paid">Paid</ion-segment-content>
        <ion-segment-content id="free">Free</ion-segment-content>
        <ion-segment-content id="top">Top</ion-segment-content>
      </ion-segment-view>
    `,
      config
    );

    await page
      .locator('ion-segment-view')
      .evaluate(
        (segmentView: HTMLIonSegmentViewElement) => !segmentView.classList.contains('segment-view-scroll-disabled')
      );

    await page.waitForChanges();

    await page.locator('ion-segment').evaluate((segment: HTMLIonSegmentElement) => (segment.value = 'top'));

    const segmentButton = page.locator('ion-segment-button[value="top"]');
    await expect(segmentButton).toHaveClass(/segment-button-checked/);

    const segmentContent = page.locator('ion-segment-content[id="top"]');
    await expect(segmentContent).toBeInViewport();
  });
});
