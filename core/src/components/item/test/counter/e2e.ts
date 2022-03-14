import { E2EPage, newE2EPage } from '@stencil/core/testing';

describe('item: counter', () => {

  it('should match existing visual screenshots', async () => {
    const page = await newE2EPage({
      url: '/src/components/item/test/counter?ionic:_testing=true'
    });

    const compare = await page.compareScreenshot();
    expect(compare).toMatchScreenshot();
  });

  describe('custom formatter', () => {

    let page: E2EPage;

    beforeEach(async () => {
      page = await newE2EPage({
        url: '/src/components/item/test/counter?ionic:_testing=true'
      });
    });

    it('should format on load', async () => {
      const itemCounter = await page.find('#customFormatter >>> .item-counter');

      expect(itemCounter.textContent).toBe('20 characters left');
    });

    it('should format on input', async () => {
      const input = await page.find('#customFormatter ion-input');

      await input.click();
      await input.type('abcde');

      await page.waitForChanges();

      const itemCounter = await page.find('#customFormatter >>> .item-counter');

      expect(itemCounter.textContent).toBe('15 characters left');
    });

    it('should format after changing the counterFormatter', async () => {
      let itemCounter = await page.find('#customFormatter >>> .item-counter');

      expect(itemCounter.textContent).toBe('20 characters left');

      await page.$eval('#customFormatter', (el: any) => {
        el.counterFormatter = () => {
          return 'test label';
        };
      });
      await page.waitForChanges();

      itemCounter = await page.find('#customFormatter >>> .item-counter');

      expect(itemCounter.textContent).toBe('test label');
    });

    describe('when an exception occurs', () => {

      const logs = [];

      beforeEach(async () => {
        page = await newE2EPage({
          html: `
          <ion-item counter="true"">
            <ion-input maxlength="20" value=""></ion-input>
          </ion-item>`
        });

        page.on('console', ev => {
          if (ev.type() === 'error') {
            logs.push(ev.text());
          }
        });

        let itemCounter = await page.find('ion-item >>> .item-counter');

        expect(itemCounter.textContent).toBe('0 / 20');

        await page.$eval('ion-item', (el: any) => {
          el.counterFormatter = () => {
            throw new Error('This is an expected error');
          };
        });
        await page.waitForChanges();

      });

      it('should default the formatting to length / maxlength', async () => {
        const input = await page.find('ion-input');

        await input.click();
        await input.type('abcde');

        const itemCounter = await page.find('ion-item >>> .item-counter');

        expect(itemCounter.textContent).toBe('5 / 20');
      });

      it('should log an error', () => {
        expect(logs.length).toBeGreaterThan(0);
        expect(logs[0]).toMatch('[Ionic Error]: Exception in provided `counterFormatter`.');
      });

    });

  });

})
