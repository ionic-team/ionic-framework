import { E2EPage, newE2EPage } from '@stencil/core/testing';


describe('picker-column-internal', () => {

  let page: E2EPage;

  describe('default', () => {

    beforeEach(async () => {
      page = await newE2EPage({
        url: '/src/components/picker-column-internal/test/basic?ionic:_testing=true'
      });
    });

    it('should render a picker item for each item', async () => {
      const columns = await page.findAll('ion-picker-column-internal >>> .picker-item:not(.picker-item-empty)');
      expect(columns.length).toEqual(24);
    });

    it('should render 6 empty picker items', async () => {
      const columns = await page.findAll('ion-picker-column-internal >>> .picker-item-empty');
      expect(columns.length).toEqual(6);
    });

    it('should not have an active item when value is not set', async () => {
      const activeColumn = await page.findAll('ion-picker-column-internal >>> .picker-item-active');
      expect(activeColumn.length).toEqual(0);
    });

    it('should have an active item when value is set', async () => {
      await page.$eval('ion-picker-column-internal#default', (el: any) => {
        el.value = '12';
      });
      await page.waitForChanges();

      const activeColumn = await page.find('ion-picker-column-internal >>> .picker-item-active');

      expect(activeColumn).not.toBeNull();
    });

    it('scrolling should change the active item', async () => {
      await page.$eval('ion-picker-column-internal#default', (el: any) => {
        el.scrollTop = 801;
      });

      await page.waitForChanges();

      const activeColumn = await page.find('ion-picker-column-internal >>> .picker-item-active');

      expect(activeColumn.innerText).toEqual('23');
    });

    it('should not emit ionChange when the value is modified externally', async () => {
      const pickerColumn = await page.find('#default');
      const ionChangeSpy = await pickerColumn.spyOnEvent('ionChange');

      await page.$eval('#default', (el: any) => {
        el.value = '12';
      });

      expect(ionChangeSpy).not.toHaveReceivedEvent();
    });

    it('should emit ionChange when the picker is scrolled', async () => {
      const pickerColumn = await page.find('#default');
      const ionChangeSpy = await pickerColumn.spyOnEvent('ionChange');

      await page.$eval('#default', (el: any) => {
        el.scrollTo(0, el.scrollHeight);
      });

      await ionChangeSpy.next();

      expect(ionChangeSpy).toHaveReceivedEvent();
    });

  });

});
