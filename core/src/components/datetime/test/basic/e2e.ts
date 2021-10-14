import { newE2EPage } from '@stencil/core/testing';
import { Datetime } from '../../datetime';

describe('Footer', () => {
  test('should render default buttons', async () => {
    const page = await newE2EPage({
      components: [Datetime],
      html: '<ion-datetime show-default-buttons="true"></ion-datetime>'
    });

    const cancelButton = await page.find('ion-datetime >>> #cancel-button');
    expect(cancelButton).toEqualText('Cancel');

    const confirmButton = await page.find('ion-datetime >>> #confirm-button');
    expect(confirmButton).toEqualText('Done');

    expect(await page.compareScreenshot()).toMatchScreenshot();
  });

  test('should render clear button', async () => {
    const page = await newE2EPage({
      components: [Datetime],
      html: '<ion-datetime show-clear-button="true"></ion-datetime>'
    });

    const clearButton = await page.find('ion-datetime >>> #clear-button');
    expect(clearButton).toEqualText('Clear');

    expect(await page.compareScreenshot()).toMatchScreenshot();
  });

  test('should render clear and default buttons', async () => {
    const page = await newE2EPage({
      components: [Datetime],
      html: '<ion-datetime show-default-buttons="true" show-clear-button="true"></ion-datetime>'
    });

    const cancelButton = await page.find('ion-datetime >>> #cancel-button');
    expect(cancelButton).toEqualText('Cancel');

    const confirmButton = await page.find('ion-datetime >>> #confirm-button');
    expect(confirmButton).toEqualText('Done');

    const clearButton = await page.find('ion-datetime >>> #clear-button');
    expect(clearButton).toEqualText('Clear');

    expect(await page.compareScreenshot()).toMatchScreenshot();
  });

  test('should render custom buttons', async () => {
    const page = await newE2EPage({
      components: [Datetime],
      html: `
        <ion-datetime show-default-buttons="true" show-clear-button="true">
          <ion-buttons slot="buttons">
            <ion-button id="custom-button">Hello!</ion-button>
          </ion-buttons>
        </ion-datetime>
      `
    });

    const customButton = await page.find('ion-datetime #custom-button');
    expect(customButton).not.toBeNull();

    expect(await page.compareScreenshot()).toMatchScreenshot();
  });

  test('should render custom buttons', async () => {
    const page = await newE2EPage({
      components: [Datetime],
      html: `
        <ion-datetime show-default-buttons="true" show-clear-button="true">
          <ion-buttons slot="buttons">
            <ion-button id="custom-button">Hello!</ion-button>
          </ion-buttons>
        </ion-datetime>
      `
    });

    const customButton = await page.find('ion-datetime #custom-button');
    expect(customButton).not.toBeNull();

    expect(await page.compareScreenshot()).toMatchScreenshot();
  });
});


