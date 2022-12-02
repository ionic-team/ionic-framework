import { expect } from '@playwright/test';
import type { Locator } from '@playwright/test';
import type { E2EPage, E2EPageOptions, EventSpy } from '@utils/test/playwright';
import { test, configs } from '@utils/test/playwright';

class ToastFixture {
  readonly page: E2EPage;

  private ionToastDidPresent!: EventSpy;

  constructor(page: E2EPage) {
    this.page = page;
  }

  async goto(config: E2EPageOptions) {
    const { page } = this;
    await page.goto(`/src/components/toast/test/basic`, config);
    this.ionToastDidPresent = await page.spyOnEvent('ionToastDidPresent');
  }

  async openToast(selector: string) {
    const { page, ionToastDidPresent } = this;
    const button = page.locator(selector);
    await button.click();

    await ionToastDidPresent.next();

    return {
      toast: page.locator('ion-toast'),
      container: page.locator('ion-toast .toast-container'),
    };
  }

  async screenshot(screenshotModifier: string, el?: Locator) {
    const { page } = this;

    const reference = el !== undefined ? el : page;
    expect(await reference.screenshot()).toMatchSnapshot(
      `toast-${screenshotModifier}-${page.getSnapshotSettings()}.png`
    );
  }
}

test.describe('toast: rendering', () => {
  let toastFixture: ToastFixture;

  configs({ directions: ['ltr'] }).forEach(({ title, config }) => {
    test.describe('toast: position', () => {
      test.beforeEach(async ({ page }) => {
        toastFixture = new ToastFixture(page);
        await toastFixture.goto(config);
      });
      test(title('should render toast at the top'), async () => {
        await toastFixture.openToast('#show-top-toast');
        await toastFixture.screenshot('top');
      });
      test(title('should render toast at the middle'), async () => {
        await toastFixture.openToast('#show-middle-toast');
        await toastFixture.screenshot('middle');
      });
      test(title('should render toast at the bottom'), async () => {
        await toastFixture.openToast('#show-bottom-toast');
        await toastFixture.screenshot('bottom');
      });
    });
  });
  configs().forEach(({ title, config }) => {
    test(title('should set buttons correctly'), async ({ page }) => {
      const toastFixture = new ToastFixture(page);
      await toastFixture.goto(config);
      const { container } = await toastFixture.openToast('#custom-action-buttons-toast');
      await toastFixture.screenshot('buttons', container);
    });

    test(title('should set start/end positioning correctly'), async ({ page }) => {
      const toastFixture = new ToastFixture(page);
      await toastFixture.goto(config);
      const { container } = await toastFixture.openToast('#toast-start-and-end');
      await toastFixture.screenshot('start-end', container);
    });
  });
  configs({ directions: ['ltr'] }).forEach(({ title, config }) => {
    test(title('should wrap text correctly'), async ({ page }) => {
      const toastFixture = new ToastFixture(page);
      await toastFixture.goto(config);
      const { container } = await toastFixture.openToast('#two-line-toast');
      await toastFixture.screenshot('text', container);
    });

    test(title('should set color correctly'), async ({ page }) => {
      const toastFixture = new ToastFixture(page);
      await toastFixture.goto(config);
      const { container } = await toastFixture.openToast('#color-toast');
      await toastFixture.screenshot('color', container);
    });
  });

  configs({ modes: ['ios'], directions: ['ltr'] }).forEach(({ title, config }) => {
    test(title('should set translucency correctly'), async ({ page }) => {
      const toastFixture = new ToastFixture(page);
      await toastFixture.goto(config);
      const { container } = await toastFixture.openToast('#translucent-toast');
      await toastFixture.screenshot('translucent', container);
    });
  });
});
configs({ modes: ['ios'], directions: ['ltr'] }).forEach(({ title, config }) => {
  test.describe('toast: properties', () => {
    let toastFixture: ToastFixture;
    test.beforeEach(async ({ page }) => {
      toastFixture = new ToastFixture(page);

      await toastFixture.goto(config);
    });
    test(title('should correctly set htmlAttributes'), async () => {
      const { toast } = await toastFixture.openToast('#show-bottom-toast');
      await expect(toast).toHaveAttribute('data-testid', 'basic-toast');
    });

    test(title('should correctly set custom html'), async () => {
      const { toast } = await toastFixture.openToast('#toast-html');
      await expect(toast.locator('ion-button')).toBeVisible();
    });

    test(title('should correctly set custom class'), async () => {
      const { toast } = await toastFixture.openToast('#custom-class-toast');
      await expect(toast).toHaveClass(/my-custom-class/);
    });
  });
});
