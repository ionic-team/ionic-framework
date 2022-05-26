import { dragElementBy } from '@utils/test/playwright';
import type { E2EPage, EventSpy } from '@utils/test/playwright';

export class CardModalPage {
  private ionModalDidPresent!: EventSpy;
  private ionModalDidDismiss!: EventSpy;
  private page: E2EPage;

  constructor(page: E2EPage) {
    this.page = page;
  }
  async navigate(url: string) {
    const { page } = this;
    await page.goto(url);
    this.ionModalDidPresent = await page.spyOnEvent('ionModalDidPresent');
    this.ionModalDidDismiss = await page.spyOnEvent('ionModalDidDismiss');
  }
  async openModalByTrigger(selector: string) {
    await this.page.click(selector);
    await this.ionModalDidPresent.next();

    return this.page.locator('ion-modal');
  }

  async swipeToCloseModal(selector: string, waitForDismiss = true, swipeY = 500) {
    const { page } = this;
    const elementRef = await page.locator(selector);
    await dragElementBy(elementRef, page, 0, swipeY);

    if (waitForDismiss) {
      await this.ionModalDidDismiss.next();
    }
  }
}
