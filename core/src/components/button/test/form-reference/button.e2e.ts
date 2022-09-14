import { expect } from '@playwright/test';
import { test } from '@utils/test/playwright';

test.describe('button: form', () => {
  test('should submit the form by id', async ({ page }) => {
    await page.setContent(`
      <form id="myForm"></form>
      <ion-button form="myForm" type="submit">Submit</ion-button>
    `);
  
    const submitEvent = await page.spyOnEvent('submit');

    await page.click('ion-button');
  
    expect(submitEvent).toHaveReceivedEvent();
  });

  test('should submit the form by reference', async({ page }) => {
    await page.setContent(`
      <form></form>
      <ion-button type="submit">Submit</ion-button>
      <script>
        const form = document.querySelector('form');
        const button = document.querySelector('ion-button');
  
        button.form = form;
      </script>
    `);
  
    const submitEvent = await page.spyOnEvent('submit');
    
    await page.click('ion-button');
  
    expect(submitEvent).toHaveReceivedEvent();
  });

  test('should submit the closest form', async({ page }) => {
    await page.setContent(`
      <form>
         <ion-button type="submit">Submit</ion-button>
      </form>
    `);
  
    const submitEvent = await page.spyOnEvent('submit');

    await page.click('ion-button');
  
    expect(submitEvent).toHaveReceivedEvent();
  });
});