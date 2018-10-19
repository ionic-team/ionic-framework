import { newE2EPage } from '@stencil/core/testing';

it('alert: basic', async () => {
  const page = await newE2EPage({
    url: '/src/components/alert/test/basic?ionic:_testing=true'
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
    console.log(buttonSelector);
    console.log(1);
    await page.click(buttonSelector);
    console.log(2);
    const alert = await page.find('ion-alert');
    console.log(3);
    const compare = await page.compareScreenshot(message);
    console.log(4);
    expect(alert).not.toBe(null);
    console.log(5);
    expect(compare).toMatchScreenshot();
    console.log(6);
    await alert.callMethod('dismiss');
    console.log(7);
  }

});
