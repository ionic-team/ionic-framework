import { expect } from '@playwright/test';
import { configs, test } from '@utils/test/playwright';

/**
 * Functionality is the same across modes & directions
 */
configs({ modes: ['ios'], directions: ['ltr'] }).forEach(({ title, config }) => {
  test.describe(title('input-otp: basic functionality'), () => {
    test('should render with 4 input boxes and a default value', async ({ page }) => {
      await page.setContent(
        `
        <ion-input-otp value="12">Description</ion-input-otp>
      `,
        config
      );

      const inputBoxes = page.locator('ion-input-otp input');
      await expect(inputBoxes).toHaveCount(4);

      await expect(inputBoxes.nth(0)).toHaveValue('1');
      await expect(inputBoxes.nth(1)).toHaveValue('2');

      const inputOtp = page.locator('ion-input-otp');
      await expect(inputOtp).toHaveAttribute('value', '12');
    });

    test('should render with 8 input boxes when length is set to 8 and a default value', async ({ page }) => {
      await page.setContent(
        `
        <ion-input-otp length="8" value="12345678">Description</ion-input-otp>
      `,
        config
      );

      const inputBoxes = page.locator('ion-input-otp input');
      await expect(inputBoxes).toHaveCount(8);

      await expect(inputBoxes.nth(0)).toHaveValue('1');
      await expect(inputBoxes.nth(1)).toHaveValue('2');
      await expect(inputBoxes.nth(2)).toHaveValue('3');
      await expect(inputBoxes.nth(3)).toHaveValue('4');
      await expect(inputBoxes.nth(4)).toHaveValue('5');
      await expect(inputBoxes.nth(5)).toHaveValue('6');
      await expect(inputBoxes.nth(6)).toHaveValue('7');
      await expect(inputBoxes.nth(7)).toHaveValue('8');

      const inputOtp = page.locator('ion-input-otp');
      await expect(inputOtp).toHaveAttribute('value', '12345678');
    });

    test('should accept numbers only by default', async ({ page }) => {
      await page.setContent(
        `
        <ion-input-otp>Description</ion-input-otp>
      `,
        config
      );

      const firstInput = page.locator('ion-input-otp input').first();
      await firstInput.focus();

      await page.keyboard.type('A2e468');

      const inputBoxes = page.locator('ion-input-otp input');
      await expect(inputBoxes.nth(0)).toHaveValue('2');
      await expect(inputBoxes.nth(1)).toHaveValue('4');
      await expect(inputBoxes.nth(2)).toHaveValue('6');
      await expect(inputBoxes.nth(3)).toHaveValue('8');
    });

    test('should accept text and numbers when type is set to text', async ({ page }) => {
      await page.setContent(
        `
        <ion-input-otp type="text">Description</ion-input-otp>
      `,
        config
      );

      const firstInput = page.locator('ion-input-otp input').first();
      await firstInput.focus();

      await page.keyboard.type('A2-B5');

      const inputBoxes = page.locator('ion-input-otp input');
      await expect(inputBoxes.nth(0)).toHaveValue('A');
      await expect(inputBoxes.nth(1)).toHaveValue('2');
      await expect(inputBoxes.nth(2)).toHaveValue('B');
      await expect(inputBoxes.nth(3)).toHaveValue('5');
    });

    test('should accept custom pattern when pattern is set', async ({ page }) => {
      await page.setContent(
        `
        <ion-input-otp type="text" pattern="[a-fA-F]">Description</ion-input-otp>
      `,
        config
      );

      const firstInput = page.locator('ion-input-otp input').first();
      await firstInput.focus();

      await page.keyboard.type('AGBZFD');

      const inputBoxes = page.locator('ion-input-otp input');
      await expect(inputBoxes.nth(0)).toHaveValue('A');
      await expect(inputBoxes.nth(1)).toHaveValue('B');
      await expect(inputBoxes.nth(2)).toHaveValue('F');
      await expect(inputBoxes.nth(3)).toHaveValue('D');
    });
  });

  test.describe(title('input-otp: input functionality'), () => {
    test('should update the input value when typing 4 digits from the 1st box', async ({ page }) => {
      await page.setContent(
        `
        <ion-input-otp>Description</ion-input-otp>
      `,
        config
      );

      const firstInput = page.locator('ion-input-otp input').first();
      await firstInput.focus();

      const inputOtp = page.locator('ion-input-otp');
      const inputBoxes = page.locator('ion-input-otp input');

      await expect(inputOtp).toHaveJSProperty('value', '');
      await expect(inputBoxes.nth(0)).toHaveValue('');
      await expect(inputBoxes.nth(1)).toHaveValue('');
      await expect(inputBoxes.nth(2)).toHaveValue('');
      await expect(inputBoxes.nth(3)).toHaveValue('');

      await page.keyboard.type('12');

      await expect(inputOtp).toHaveJSProperty('value', '12');
      await expect(inputBoxes.nth(0)).toHaveValue('1');
      await expect(inputBoxes.nth(1)).toHaveValue('2');
      await expect(inputBoxes.nth(2)).toHaveValue('');
      await expect(inputBoxes.nth(3)).toHaveValue('');

      await page.keyboard.type('34');

      await expect(inputOtp).toHaveJSProperty('value', '1234');
      await expect(inputBoxes.nth(0)).toHaveValue('1');
      await expect(inputBoxes.nth(1)).toHaveValue('2');
      await expect(inputBoxes.nth(2)).toHaveValue('3');
      await expect(inputBoxes.nth(3)).toHaveValue('4');
    });

    test('should update the 1st input value when typing in the 3rd box', async ({ page }) => {
      await page.setContent(
        `
        <ion-input-otp>Description</ion-input-otp>
      `,
        config
      );

      const thirdInput = page.locator('ion-input-otp input').nth(2);
      await thirdInput.focus();

      const inputOtp = page.locator('ion-input-otp');
      const inputBoxes = page.locator('ion-input-otp input');

      await page.keyboard.type('1');

      await expect(inputBoxes.nth(0)).toHaveValue('1');
      await expect(inputBoxes.nth(1)).toHaveValue('');
      await expect(inputBoxes.nth(2)).toHaveValue('');
      await expect(inputBoxes.nth(3)).toHaveValue('');
      await expect(inputOtp).toHaveJSProperty('value', '1');

      // Focus should be on the 2nd input box
      const secondInput = page.locator('ion-input-otp input').nth(1);
      await expect(secondInput).toBeFocused();
    });

    test('should update the 3rd input value and shift the values to the right when typing in the 3rd box containing a value', async ({ page }) => {
      await page.setContent(
        `
        <ion-input-otp value="123">Description</ion-input-otp>
      `,
        config
      );

      const thirdInput = page.locator('ion-input-otp input').nth(2);
      await thirdInput.focus();

      const inputOtp = page.locator('ion-input-otp');
      const inputBoxes = page.locator('ion-input-otp input');

      await page.keyboard.type('9');

      await expect(inputBoxes.nth(0)).toHaveValue('1');
      await expect(inputBoxes.nth(1)).toHaveValue('2');
      await expect(inputBoxes.nth(2)).toHaveValue('9');
      await expect(inputBoxes.nth(3)).toHaveValue('3');
      await expect(inputOtp).toHaveJSProperty('value', '1293');

      // Focus should remain on the 3rd input box
      await expect(thirdInput).toBeFocused();
    });

    test('should update the 2nd input value when typing in the 2nd box containing a value', async ({ page }) => {
      await page.setContent(
        `
        <ion-input-otp value="1234">Description</ion-input-otp>
      `,
        config
      );

      const secondInput = page.locator('ion-input-otp input').nth(1);
      await secondInput.focus();

      const inputOtp = page.locator('ion-input-otp');
      const inputBoxes = page.locator('ion-input-otp input');

      await page.keyboard.type('9');

      await expect(inputBoxes.nth(0)).toHaveValue('1');
      await expect(inputBoxes.nth(1)).toHaveValue('9');
      await expect(inputBoxes.nth(2)).toHaveValue('3');
      await expect(inputBoxes.nth(3)).toHaveValue('4');
      await expect(inputOtp).toHaveJSProperty('value', '1934');

      // Focus should remain on the 2nd input box
      await expect(secondInput).toBeFocused();
    });
  });

  test.describe(title('input-otp: focus functionality'), () => {
    test('should focus the first input box when tabbed to', async ({ page }) => {
      await page.setContent(
        `
        <ion-input-otp>Description</ion-input-otp>
      `,
        config
      );

      await page.keyboard.press('Tab');

      const firstInput = page.locator('ion-input-otp input').first();
      await expect(firstInput).toBeFocused();
    });

    test('should focus the third input box when tabbed to with a default value of 2 digits', async ({ page }) => {
      await page.setContent(
        `
        <ion-input-otp value="12">Description</ion-input-otp>
      `,
        config
      );

      await page.keyboard.press('Tab');

      const thirdInput = page.locator('ion-input-otp input').nth(2);
      await expect(thirdInput).toBeFocused();
    });

    test('should focus the last input box when tabbed to with a default value of 4 digits', async ({ page }) => {
      await page.setContent(
        `
        <ion-input-otp value="1234">Description</ion-input-otp>
      `,
        config
      );

      await page.keyboard.press('Tab');

      const lastInput = page.locator('ion-input-otp input').last();
      await expect(lastInput).toBeFocused();
    });
  });

  test.describe(title('input-otp: backspace functionality'), () => {
    test('should backspace the first input box when backspace is pressed twice from the 2nd input box and the first input box has a value', async ({
      page,
    }) => {
      await page.setContent(
        `
        <ion-input-otp value="1">Description</ion-input-otp>
      `,
        config
      );

      await page.keyboard.press('Tab');
      await page.keyboard.press('Backspace');
      await page.keyboard.press('Backspace');

      const inputBoxes = page.locator('ion-input-otp input');
      await expect(inputBoxes.nth(0)).toHaveValue('');
      await expect(inputBoxes.nth(1)).toHaveValue('');
      await expect(inputBoxes.nth(2)).toHaveValue('');
      await expect(inputBoxes.nth(3)).toHaveValue('');
    });

    test('should backspace the last input box when backspace is pressed and all values are filled', async ({
      page,
    }) => {
      await page.setContent(
        `
        <ion-input-otp value="1234">Description</ion-input-otp>
      `,
        config
      );

      await page.keyboard.press('Tab');
      await page.keyboard.press('Backspace');

      const inputBoxes = page.locator('ion-input-otp input');
      await expect(inputBoxes.nth(0)).toHaveValue('1');
      await expect(inputBoxes.nth(1)).toHaveValue('2');
      await expect(inputBoxes.nth(2)).toHaveValue('3');
      await expect(inputBoxes.nth(3)).toHaveValue('');
    });

    test('should backspace the 2nd input box and fill it with the 3rd value when backspace is pressed and 3 values are filled', async ({
      page,
    }) => {
      await page.setContent(
        `
        <ion-input-otp value="123">Description</ion-input-otp>
      `,
        config
      );

      await page.keyboard.press('Tab');
      await page.keyboard.press('ArrowLeft');
      await page.keyboard.press('ArrowLeft');
      await page.keyboard.press('Backspace');

      const inputBoxes = page.locator('ion-input-otp input');
      await expect(inputBoxes.nth(0)).toHaveValue('1');
      await expect(inputBoxes.nth(1)).toHaveValue('3');
      await expect(inputBoxes.nth(2)).toHaveValue('');
      await expect(inputBoxes.nth(3)).toHaveValue('');
    });
  });

  test.describe(title('input-otp: paste functionality'), () => {
    test('should paste text into the first and second input box when pasting 2 digits', async ({ page }) => {
      await page.setContent(`<ion-input-otp>Description</ion-input-otp>`, config);

      const firstInput = page.locator('ion-input-otp input').first();
      await firstInput.focus();
      await firstInput.evaluate((input, value) => {
        const event = new ClipboardEvent('paste', {
          bubbles: true,
          cancelable: true,
          clipboardData: new DataTransfer(),
        });
        if (event.clipboardData) {
          event.clipboardData.setData('text', value);
        }
        input.dispatchEvent(event);
      }, '12');

      const inputBoxes = page.locator('ion-input-otp input');
      await expect(inputBoxes.nth(0)).toHaveValue('1');
      await expect(inputBoxes.nth(1)).toHaveValue('2');
      await expect(inputBoxes.nth(2)).toHaveValue('');
      await expect(inputBoxes.nth(3)).toHaveValue('');

      // Focus should be on the 3rd input box
      await expect(inputBoxes.nth(2)).toBeFocused();
    });

    test('should paste text into all input boxes when pasting 4 digits', async ({ page }) => {
      await page.setContent(`<ion-input-otp>Description</ion-input-otp>`, config);

      const firstInput = page.locator('ion-input-otp input').first();
      await firstInput.focus();
      await firstInput.evaluate((input, value) => {
        const event = new ClipboardEvent('paste', {
          bubbles: true,
          cancelable: true,
          clipboardData: new DataTransfer(),
        });
        if (event.clipboardData) {
          event.clipboardData.setData('text', value);
        }
        input.dispatchEvent(event);
      }, '1234');

      const inputBoxes = page.locator('ion-input-otp input');
      await expect(inputBoxes.nth(0)).toHaveValue('1');
      await expect(inputBoxes.nth(1)).toHaveValue('2');
      await expect(inputBoxes.nth(2)).toHaveValue('3');
      await expect(inputBoxes.nth(3)).toHaveValue('4');

      // Focus should be on the 4th input box
      await expect(inputBoxes.nth(3)).toBeFocused();
    });

    test('should paste text into the first and second input box when pasting 2 digits in the 3rd box', async ({
      page,
    }) => {
      await page.setContent(`<ion-input-otp>Description</ion-input-otp>`, config);

      const thirdInput = page.locator('ion-input-otp input').nth(2);
      await thirdInput.focus();
      await thirdInput.evaluate((input, value) => {
        const event = new ClipboardEvent('paste', {
          bubbles: true,
          cancelable: true,
          clipboardData: new DataTransfer(),
        });
        if (event.clipboardData) {
          event.clipboardData.setData('text', value);
        }
        input.dispatchEvent(event);
      }, '12');

      const inputBoxes = page.locator('ion-input-otp input');
      await expect(inputBoxes.nth(0)).toHaveValue('1');
      await expect(inputBoxes.nth(1)).toHaveValue('2');
      await expect(inputBoxes.nth(2)).toHaveValue('');
      await expect(inputBoxes.nth(3)).toHaveValue('');
    });

    test('should paste text into the last two input boxes when pasting 2 digits after typing 2 digits', async ({
      page,
    }) => {
      await page.setContent(`<ion-input-otp>Description</ion-input-otp>`, config);

      const firstInput = page.locator('ion-input-otp input').first();
      await firstInput.focus();

      await page.keyboard.type('12');

      await firstInput.evaluate((input, value) => {
        const event = new ClipboardEvent('paste', {
          bubbles: true,
          cancelable: true,
          clipboardData: new DataTransfer(),
        });
        if (event.clipboardData) {
          event.clipboardData.setData('text', value);
        }
        input.dispatchEvent(event);
      }, '34');

      const inputBoxes = page.locator('ion-input-otp input');
      await expect(inputBoxes.nth(0)).toHaveValue('1');
      await expect(inputBoxes.nth(1)).toHaveValue('2');
      await expect(inputBoxes.nth(2)).toHaveValue('3');
      await expect(inputBoxes.nth(3)).toHaveValue('4');
    });

    test('should paste text into all input boxes when pasting 4 digits after typing 4 digits', async ({ page }) => {
      await page.setContent(`<ion-input-otp>Description</ion-input-otp>`, config);

      const firstInput = page.locator('ion-input-otp input').first();
      await firstInput.focus();

      await page.keyboard.type('9999');

      await firstInput.evaluate((input, value) => {
        const event = new ClipboardEvent('paste', {
          bubbles: true,
          cancelable: true,
          clipboardData: new DataTransfer(),
        });
        if (event.clipboardData) {
          event.clipboardData.setData('text', value);
        }
        input.dispatchEvent(event);
      }, '1234');

      const inputBoxes = page.locator('ion-input-otp input');
      await expect(inputBoxes.nth(0)).toHaveValue('1');
      await expect(inputBoxes.nth(1)).toHaveValue('2');
      await expect(inputBoxes.nth(2)).toHaveValue('3');
      await expect(inputBoxes.nth(3)).toHaveValue('4');
    });
  });
});
