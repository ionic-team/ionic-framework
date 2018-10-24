import { newE2EPage } from '@stencil/core/testing';

it('alert: standalone', async () => {
  const page = await newE2EPage({
    url: '/src/components/alert/test/standalone?ionic:_testing=true'
  });

  const alerts = [
    ['#basic'],
    ['#longMessage', 'long message'],
    ['#multipleButtons', 'multiple buttons'],
    ['#noMessage', 'no message'],
    ['#confirm', 'confirm'],
    ['#prompt', 'prompt'],
    ['#radio', 'radio'],
    ['#checkbox', 'checkbox']
  ];

  for (const [buttonSelector, message] of alerts) {
    await page.click(buttonSelector);

    const alert = await page.find('ion-alert');
    expect(alert).not.toBe(null);
    await alert.waitForVisible();
    await page.waitFor(250);

    const compare = await page.compareScreenshot(message);
    expect(compare).toMatchScreenshot();
    await alert.callMethod('dismiss');
  }

});
