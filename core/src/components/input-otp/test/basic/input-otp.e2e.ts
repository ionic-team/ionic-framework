import { expect } from '@playwright/test';
import type { Locator } from '@playwright/test';
import { configs, test } from '@utils/test/playwright';

/**
 * Simulates an autofill event in an input element with the given value
 */
async function simulateAutofill(input: any, value: string) {
  await input.evaluate((input: any, value: string) => {
    (input as HTMLInputElement).value = value;
    input.dispatchEvent(new Event('input', { bubbles: true }));
  }, value);
}

/**
 * Simulates a paste event in an input element with the given value
 */
async function simulatePaste(input: any, value: string) {
  await input.evaluate((input: any, value: string) => {
    const event = new ClipboardEvent('paste', {
      bubbles: true,
      cancelable: true,
      clipboardData: new DataTransfer(),
    });
    if (event.clipboardData) {
      event.clipboardData.setData('text', value);
    }
    input.dispatchEvent(event);
  }, value);
}

/**
 * Helper function to verify input values in both the input
 * boxes and the input-otp component's value property
 */
async function verifyInputValues(inputOtp: Locator, expectedValues: string[]) {
  const inputBoxes = inputOtp.locator('input');
  for (let i = 0; i < expectedValues.length; i++) {
    await expect(inputBoxes.nth(i)).toHaveValue(expectedValues[i]);
  }

  // Concatenate the expected values and check the JS property
  const concatenatedValue = expectedValues.join('');
  await expect(inputOtp).toHaveJSProperty('value', concatenatedValue);
}

/**
 * Functionality is the same across modes
 */
configs({ modes: ['ios'] }).forEach(({ title, config }) => {
  test.describe(title('input-otp: basic functionality'), () => {
    test('should render with 4 input boxes and a default value', async ({ page }) => {
      await page.setContent(`<ion-input-otp value="12">Description</ion-input-otp>`, config);

      const inputOtp = page.locator('ion-input-otp');

      const inputBoxes = page.locator('ion-input-otp input');
      await expect(inputBoxes).toHaveCount(4);

      await verifyInputValues(inputOtp, ['1', '2', '', '']);
    });

    test('should render with 8 input boxes when length is set to 8 and a default value', async ({ page }) => {
      await page.setContent(`<ion-input-otp length="8" value="12345678">Description</ion-input-otp>`, config);

      const inputOtp = page.locator('ion-input-otp');

      const inputBoxes = page.locator('ion-input-otp input');
      await expect(inputBoxes).toHaveCount(8);

      await verifyInputValues(inputOtp, ['1', '2', '3', '4', '5', '6', '7', '8']);
    });

    test('should accept numbers only by default', async ({ page }) => {
      await page.setContent(`<ion-input-otp>Description</ion-input-otp>`, config);

      const inputOtp = page.locator('ion-input-otp');

      const firstInput = page.locator('ion-input-otp input').first();
      await firstInput.focus();

      await page.keyboard.type('A2e468');

      await verifyInputValues(inputOtp, ['2', '4', '6', '8']);
    });

    test('should accept Eastern Arabic numerals by default', async ({ page }) => {
      await page.setContent(`<ion-input-otp>Description</ion-input-otp>`, config);

      const inputOtp = page.locator('ion-input-otp');
      const firstInput = page.locator('ion-input-otp input').first();
      await firstInput.focus();

      await page.keyboard.type('١٢٣٤');

      // Because Arabic is a right-to-left script, JavaScript's handling of RTL text
      // causes the array values to be reversed while input boxes maintain LTR order.
      // We reverse our expected values to match this behavior.
      await verifyInputValues(inputOtp, ['٤', '٣', '٢', '١'].reverse());
    });

    test('should accept only Western Arabic numerals when pattern is set to [0-9]', async ({ page }) => {
      await page.setContent(`<ion-input-otp pattern="[0-9]">Description</ion-input-otp>`, config);

      const inputOtp = page.locator('ion-input-otp');
      const firstInput = page.locator('ion-input-otp input').first();
      await firstInput.focus();

      await page.keyboard.type('12٣٤34');

      await verifyInputValues(inputOtp, ['1', '2', '3', '4']);
    });

    test('should accept Latin characters when type is text', async ({ page }) => {
      await page.setContent(`<ion-input-otp type="text">Description</ion-input-otp>`, config);

      const inputOtp = page.locator('ion-input-otp');

      const firstInput = page.locator('ion-input-otp input').first();
      await firstInput.focus();

      await page.keyboard.type('A2-B5');

      await verifyInputValues(inputOtp, ['A', '2', 'B', '5']);
    });

    test('should accept accented Latin characters when type is text', async ({ page }) => {
      await page.setContent(`<ion-input-otp type="text">Description</ion-input-otp>`, config);

      const inputOtp = page.locator('ion-input-otp');
      const firstInput = page.locator('ion-input-otp input').first();
      await firstInput.focus();

      await page.keyboard.type('áéíó');

      await verifyInputValues(inputOtp, ['á', 'é', 'í', 'ó']);
    });

    test('should accept Cyrillic characters when type is text', async ({ page }) => {
      await page.setContent(`<ion-input-otp type="text">Description</ion-input-otp>`, config);

      const inputOtp = page.locator('ion-input-otp');
      const firstInput = page.locator('ion-input-otp input').first();
      await firstInput.focus();

      await page.keyboard.type('АбвГ');

      await verifyInputValues(inputOtp, ['А', 'б', 'в', 'Г']);
    });

    test('should accept Chinese characters when type is text', async ({ page }) => {
      await page.setContent(`<ion-input-otp type="text">Description</ion-input-otp>`, config);

      const inputOtp = page.locator('ion-input-otp');
      const firstInput = page.locator('ion-input-otp input').first();
      await firstInput.focus();

      await page.keyboard.type('中国北京');

      await verifyInputValues(inputOtp, ['中', '国', '北', '京']);
    });

    test('should accept Japanese characters when type is text', async ({ page }) => {
      await page.setContent(`<ion-input-otp type="text">Description</ion-input-otp>`, config);

      const inputOtp = page.locator('ion-input-otp');
      const firstInput = page.locator('ion-input-otp input').first();
      await firstInput.focus();

      await page.keyboard.type('ひらがな');

      await verifyInputValues(inputOtp, ['ひ', 'ら', 'が', 'な']);
    });

    test('should accept Korean characters when type is text', async ({ page }) => {
      await page.setContent(`<ion-input-otp type="text">Description</ion-input-otp>`, config);

      const inputOtp = page.locator('ion-input-otp');
      const firstInput = page.locator('ion-input-otp input').first();
      await firstInput.focus();

      await page.keyboard.type('안녕하세');

      await verifyInputValues(inputOtp, ['안', '녕', '하', '세']);
    });

    test('should accept Arabic characters when type is text', async ({ page }) => {
      await page.setContent(`<ion-input-otp type="text">Description</ion-input-otp>`, config);

      const inputOtp = page.locator('ion-input-otp');
      const firstInput = page.locator('ion-input-otp input').first();
      await firstInput.focus();

      await page.keyboard.type('أبجد');

      // Because Arabic is a right-to-left script, JavaScript's handling of RTL text
      // causes the array values to be reversed while input boxes maintain LTR order.
      // We reverse our expected values to match this behavior.
      await verifyInputValues(inputOtp, ['د', 'ج', 'ب', 'أ'].reverse());
    });

    test('should accept mixed language characters when type is text', async ({ page }) => {
      await page.setContent(`<ion-input-otp type="text">Description</ion-input-otp>`, config);

      const inputOtp = page.locator('ion-input-otp');
      const firstInput = page.locator('ion-input-otp input').first();
      await firstInput.focus();

      await page.keyboard.type('A漢字Б');

      await verifyInputValues(inputOtp, ['A', '漢', '字', 'Б']);
    });

    test('should reject special characters when type is text', async ({ page }) => {
      await page.setContent(`<ion-input-otp type="text">Description</ion-input-otp>`, config);

      const inputOtp = page.locator('ion-input-otp');
      const firstInput = page.locator('ion-input-otp input').first();
      await firstInput.focus();

      await page.keyboard.type('!@#$%^&*()-,:;./?+');

      await verifyInputValues(inputOtp, ['', '', '', '']);
    });

    test('should accept custom pattern of lowercase and uppercase letters when pattern is set', async ({ page }) => {
      await page.setContent(`<ion-input-otp type="text" pattern="[a-fA-F]">Description</ion-input-otp>`, config);

      const inputOtp = page.locator('ion-input-otp');

      const firstInput = page.locator('ion-input-otp input').first();
      await firstInput.focus();

      await page.keyboard.type('aGBZfD');

      await verifyInputValues(inputOtp, ['a', 'B', 'f', 'D']);
    });

    test('should accept custom pattern of uppercase letters only when pattern is set', async ({ page }) => {
      await page.setContent(`<ion-input-otp type="text" pattern="[D-L]">Description</ion-input-otp>`, config);

      const inputOtp = page.locator('ion-input-otp');

      const firstInput = page.locator('ion-input-otp input').first();
      await firstInput.focus();

      await page.keyboard.type('abcdABCDEFG');

      await verifyInputValues(inputOtp, ['D', 'E', 'F', 'G']);
    });

    test('should accept custom pattern of all characters when pattern is set', async ({ page }) => {
      await page.setContent(`<ion-input-otp type="text" pattern=".">Description</ion-input-otp>`, config);

      const inputOtp = page.locator('ion-input-otp');

      const firstInput = page.locator('ion-input-otp input').first();
      await firstInput.focus();

      await page.keyboard.type('*#.!');

      await verifyInputValues(inputOtp, ['*', '#', '.', '!']);
    });

    test('should accept only Latin characters and numbers when pattern is set', async ({ page }) => {
      await page.setContent(`<ion-input-otp type="text" pattern="[A-Za-z0-9]">Description</ion-input-otp>`, config);

      const inputOtp = page.locator('ion-input-otp');
      const firstInput = page.locator('ion-input-otp input').first();
      await firstInput.focus();

      await page.keyboard.type('Ab中国北京12');

      await verifyInputValues(inputOtp, ['A', 'b', '1', '2']);
    });

    test('should accept only Cyrillic characters when pattern is set', async ({ page }) => {
      await page.setContent(
        `<ion-input-otp type="text" pattern="[\\p{Script=Cyrillic}]">Description</ion-input-otp>`,
        config
      );

      const inputOtp = page.locator('ion-input-otp');
      const firstInput = page.locator('ion-input-otp input').first();
      await firstInput.focus();

      await page.keyboard.type('АбABC123вГ');

      await verifyInputValues(inputOtp, ['А', 'б', 'в', 'Г']);
    });

    test('should accept only Chinese characters when pattern is set', async ({ page }) => {
      await page.setContent(
        `<ion-input-otp type="text" pattern="[\\p{Script=Han}]">Description</ion-input-otp>`,
        config
      );

      const inputOtp = page.locator('ion-input-otp');
      const firstInput = page.locator('ion-input-otp input').first();
      await firstInput.focus();

      await page.keyboard.type('中国ABC123北京');

      await verifyInputValues(inputOtp, ['中', '国', '北', '京']);
    });

    test('should accept only Japanese characters when pattern is set', async ({ page }) => {
      await page.setContent(
        `<ion-input-otp type="text" pattern="\\p{Script=Hiragana}">Description</ion-input-otp>`,
        config
      );

      const inputOtp = page.locator('ion-input-otp');
      const firstInput = page.locator('ion-input-otp input').first();
      await firstInput.focus();

      await page.keyboard.type('ひらABC123がな');

      await verifyInputValues(inputOtp, ['ひ', 'ら', 'が', 'な']);
    });

    test('should accept only Korean characters when pattern is set', async ({ page }) => {
      await page.setContent(
        `<ion-input-otp type="text" pattern="\\p{Script=Hangul}">Description</ion-input-otp>`,
        config
      );

      const inputOtp = page.locator('ion-input-otp');
      const firstInput = page.locator('ion-input-otp input').first();
      await firstInput.focus();

      await page.keyboard.type('안녕ABC123하세');

      await verifyInputValues(inputOtp, ['안', '녕', '하', '세']);
    });

    test('should accept only Arabic characters when pattern is set', async ({ page }) => {
      await page.setContent(
        `<ion-input-otp type="text" pattern="\\p{Script=Arabic}">Description</ion-input-otp>`,
        config
      );

      const inputOtp = page.locator('ion-input-otp');
      const firstInput = page.locator('ion-input-otp input').first();
      await firstInput.focus();

      await page.keyboard.type('أبجد123');

      // Because Arabic is a right-to-left script, JavaScript's handling of RTL text
      // causes the array values to be reversed while input boxes maintain LTR order.
      // We reverse our expected values to match this behavior.
      await verifyInputValues(inputOtp, ['د', 'ج', 'ب', 'أ'].reverse());
    });
  });

  test.describe(title('input-otp: input functionality'), () => {
    test('should update the input value when typing 4 digits from the 1st box', async ({ page }) => {
      await page.setContent(`<ion-input-otp>Description</ion-input-otp>`, config);

      const firstInput = page.locator('ion-input-otp input').first();
      await firstInput.focus();

      const inputOtp = page.locator('ion-input-otp');

      await verifyInputValues(inputOtp, ['', '', '', '']);

      await page.keyboard.type('12');

      await verifyInputValues(inputOtp, ['1', '2', '', '']);

      await page.keyboard.type('34');

      await verifyInputValues(inputOtp, ['1', '2', '3', '4']);
    });

    test('should update the 1st input value when typing in the 3rd box', async ({ page }) => {
      await page.setContent(`<ion-input-otp>Description</ion-input-otp>`, config);

      const thirdInput = page.locator('ion-input-otp input').nth(2);
      await thirdInput.focus();

      const inputOtp = page.locator('ion-input-otp');
      const inputBoxes = page.locator('ion-input-otp input');

      await page.keyboard.type('1');

      await verifyInputValues(inputOtp, ['1', '', '', '']);

      // Focus should be on the 2nd input box
      await expect(inputBoxes.nth(1)).toBeFocused();
    });

    test('should update the 3rd input value and shift the values to the right when typing in the 3rd box containing a value', async ({
      page,
    }) => {
      await page.setContent(`<ion-input-otp value="123">Description</ion-input-otp>`, config);

      const thirdInput = page.locator('ion-input-otp input').nth(2);
      await thirdInput.focus();

      const inputOtp = page.locator('ion-input-otp');
      const inputBoxes = page.locator('ion-input-otp input');

      await page.keyboard.type('9');

      await verifyInputValues(inputOtp, ['1', '2', '9', '3']);

      // Focus should remain on the 3rd input box
      await expect(inputBoxes.nth(2)).toBeFocused();
    });

    test('should update the 2nd input value when typing in the 2nd box containing a value', async ({ page }) => {
      await page.setContent(`<ion-input-otp value="1234">Description</ion-input-otp>`, config);

      const secondInput = page.locator('ion-input-otp input').nth(1);
      await secondInput.focus();

      const inputOtp = page.locator('ion-input-otp');
      const inputBoxes = page.locator('ion-input-otp input');

      await page.keyboard.type('9');

      await verifyInputValues(inputOtp, ['1', '9', '3', '4']);

      // Focus should remain on the 2nd input box
      await expect(inputBoxes.nth(1)).toBeFocused();
    });

    test('should not shift values right when selecting the text in the 2nd input box', async ({ page }) => {
      await page.setContent(`<ion-input-otp value="123">Description</ion-input-otp>`, config);

      const secondInput = page.locator('ion-input-otp input').nth(1);
      await secondInput.focus();
      await secondInput.selectText();

      const inputOtp = page.locator('ion-input-otp');

      await page.keyboard.type('9');

      await verifyInputValues(inputOtp, ['1', '9', '3', '']);
    });
  });

  test.describe(title('input-otp: autofill functionality'), () => {
    test('should handle autofill correctly', async ({ page }) => {
      await page.setContent(`<ion-input-otp>Description</ion-input-otp>`, config);

      const firstInput = page.locator('ion-input-otp input').first();
      await firstInput.focus();

      await simulateAutofill(firstInput, '1234');

      const inputOtp = page.locator('ion-input-otp');
      await verifyInputValues(inputOtp, ['1', '2', '3', '4']);

      const lastInput = page.locator('ion-input-otp input').last();
      await expect(lastInput).toBeFocused();
    });

    test('should handle autofill correctly when it exceeds the length', async ({ page }) => {
      await page.setContent(`<ion-input-otp>Description</ion-input-otp>`, config);

      const firstInput = page.locator('ion-input-otp input').first();
      await firstInput.focus();

      await simulateAutofill(firstInput, '123456');

      const inputOtp = page.locator('ion-input-otp');
      await verifyInputValues(inputOtp, ['1', '2', '3', '4']);

      const lastInput = page.locator('ion-input-otp input').last();
      await expect(lastInput).toBeFocused();
    });

    test('should handle autofill correctly when it is less than the length', async ({ page }) => {
      await page.setContent(`<ion-input-otp>Description</ion-input-otp>`, config);

      const firstInput = page.locator('ion-input-otp input').first();
      await firstInput.focus();

      await simulateAutofill(firstInput, '12');

      const inputOtp = page.locator('ion-input-otp');
      await verifyInputValues(inputOtp, ['1', '2', '', '']);

      const thirdInput = page.locator('ion-input-otp input').nth(2);
      await expect(thirdInput).toBeFocused();
    });

    test('should handle autofill correctly when using autofill after typing 1 character', async ({ page }) => {
      await page.setContent(`<ion-input-otp>Description</ion-input-otp>`, config);

      const firstInput = page.locator('ion-input-otp input').first();
      await firstInput.focus();

      await page.keyboard.type('9');

      const secondInput = page.locator('ion-input-otp input').nth(1);
      await secondInput.focus();

      await simulateAutofill(secondInput, '1234');

      const inputOtp = page.locator('ion-input-otp');
      await verifyInputValues(inputOtp, ['1', '2', '3', '4']);

      const lastInput = page.locator('ion-input-otp input').last();
      await expect(lastInput).toBeFocused();
    });

    test('should handle autofill correctly when autofill value contains invalid characters', async ({ page }) => {
      await page.setContent(`<ion-input-otp pattern="[a-zA-Z]">Description</ion-input-otp>`, config);

      const firstInput = page.locator('ion-input-otp input').first();
      await firstInput.focus();

      await simulateAutofill(firstInput, '1234');

      const inputOtp = page.locator('ion-input-otp');
      await verifyInputValues(inputOtp, ['', '', '', '']);

      await expect(firstInput).toBeFocused();
    });
  });

  test.describe(title('input-otp: focus functionality'), () => {
    test('should focus the first input box when tabbed to', async ({ page }) => {
      await page.setContent(`<ion-input-otp>Description</ion-input-otp>`, config);

      await page.keyboard.press('Tab');

      const firstInput = page.locator('ion-input-otp input').first();
      await expect(firstInput).toBeFocused();
    });

    test('should focus the third input box when tabbed to with a default value of 2 digits', async ({ page }) => {
      await page.setContent(`<ion-input-otp value="12">Description</ion-input-otp>`, config);

      await page.keyboard.press('Tab');

      const thirdInput = page.locator('ion-input-otp input').nth(2);
      await expect(thirdInput).toBeFocused();
    });

    test('should focus the last input box when tabbed to with a default value of 4 digits', async ({ page }) => {
      await page.setContent(`<ion-input-otp value="1234">Description</ion-input-otp>`, config);

      await page.keyboard.press('Tab');

      const lastInput = page.locator('ion-input-otp input').last();
      await expect(lastInput).toBeFocused();
    });

    test('should focus the next input otp component when tabbed from the 2nd input box', async ({ page }) => {
      await page.setContent(
        `
        <ion-input-otp id="first" value="12">Description</ion-input-otp>
        <ion-input-otp id="second">Description</ion-input-otp>
      `,
        config
      );

      await page.keyboard.press('Tab');
      await page.keyboard.press('ArrowLeft');
      await page.keyboard.press('Tab');

      const secondInputOtpFirstInput = page.locator('#second input').first();
      await expect(secondInputOtpFirstInput).toBeFocused();
    });

    test('should focus the first input box when clicking on the 2nd input box without a value', async ({ page }) => {
      await page.setContent(`<ion-input-otp>Description</ion-input-otp>`, config);

      const secondInput = page.locator('ion-input-otp input').nth(1);
      await secondInput.click();

      const firstInput = page.locator('ion-input-otp input').first();
      await expect(firstInput).toBeFocused();
    });
  });

  test.describe(title('input-otp: backspace functionality'), () => {
    test('should backspace the first input box when backspace is pressed twice from the 2nd input box and the first input box has a value', async ({
      page,
    }) => {
      await page.setContent(`<ion-input-otp value="1">Description</ion-input-otp>`, config);

      const inputOtp = page.locator('ion-input-otp');

      await page.keyboard.press('Tab');
      await page.keyboard.press('Backspace');
      await page.keyboard.press('Backspace');

      await verifyInputValues(inputOtp, ['', '', '', '']);
    });

    test('should backspace the last input box when backspace is pressed and all values are filled', async ({
      page,
    }) => {
      await page.setContent(`<ion-input-otp value="1234">Description</ion-input-otp>`, config);

      const inputOtp = page.locator('ion-input-otp');

      await page.keyboard.press('Tab');
      await page.keyboard.press('Backspace');

      await verifyInputValues(inputOtp, ['1', '2', '3', '']);
    });

    test('should backspace the 2nd input box and fill it with the 3rd value when backspace is pressed and 3 values are filled', async ({
      page,
    }) => {
      await page.setContent(`<ion-input-otp value="123">Description</ion-input-otp>`, config);

      await page.keyboard.press('Tab');

      const isRTL = await page.evaluate(() => document.dir === 'rtl');
      if (isRTL) {
        await page.keyboard.press('ArrowRight');
        await page.keyboard.press('ArrowRight');
      } else {
        await page.keyboard.press('ArrowLeft');
        await page.keyboard.press('ArrowLeft');
      }
      await page.keyboard.press('Backspace');

      const inputOtp = page.locator('ion-input-otp');
      await verifyInputValues(inputOtp, ['1', '3', '', '']);
    });
  });

  test.describe(title('input-otp: paste functionality'), () => {
    test('should paste text into the first and second input box when pasting 2 digits', async ({ page }) => {
      await page.setContent(`<ion-input-otp>Description</ion-input-otp>`, config);

      const firstInput = page.locator('ion-input-otp input').first();
      await firstInput.focus();
      await simulatePaste(firstInput, '12');

      const inputOtp = page.locator('ion-input-otp');

      const inputBoxes = page.locator('ion-input-otp input');
      await verifyInputValues(inputOtp, ['1', '2', '', '']);

      // Focus should be on the 3rd input box
      await expect(inputBoxes.nth(2)).toBeFocused();
    });

    test('should paste text into all input boxes when pasting 4 digits', async ({ page }) => {
      await page.setContent(`<ion-input-otp>Description</ion-input-otp>`, config);

      const firstInput = page.locator('ion-input-otp input').first();
      await firstInput.focus();
      await simulatePaste(firstInput, '1234');

      const inputOtp = page.locator('ion-input-otp');
      const inputBoxes = page.locator('ion-input-otp input');
      await verifyInputValues(inputOtp, ['1', '2', '3', '4']);

      // Focus should be on the 4th input box
      await expect(inputBoxes.nth(3)).toBeFocused();
    });

    test('should paste text into the first and second input box when pasting 2 digits in the 3rd box', async ({
      page,
    }) => {
      await page.setContent(`<ion-input-otp>Description</ion-input-otp>`, config);

      const thirdInput = page.locator('ion-input-otp input').nth(2);
      await thirdInput.focus();
      await simulatePaste(thirdInput, '12');

      const inputOtp = page.locator('ion-input-otp');

      const inputBoxes = page.locator('ion-input-otp input');
      await verifyInputValues(inputOtp, ['1', '2', '', '']);

      // Focus should be on the 3rd input box
      await expect(inputBoxes.nth(2)).toBeFocused();
    });

    test('should paste text into the first two input boxes when pasting 2 digits after typing 2 digits', async ({
      page,
    }) => {
      await page.setContent(`<ion-input-otp>Description</ion-input-otp>`, config);

      const firstInput = page.locator('ion-input-otp input').first();
      await firstInput.focus();
      await page.keyboard.type('12');
      await simulatePaste(firstInput, '34');

      const inputOtp = page.locator('ion-input-otp');

      await verifyInputValues(inputOtp, ['3', '4', '', '']);
    });

    test('should paste text into all input boxes when pasting 4 digits after typing 4 digits', async ({ page }) => {
      await page.setContent(`<ion-input-otp>Description</ion-input-otp>`, config);

      const firstInput = page.locator('ion-input-otp input').first();
      await firstInput.focus();
      await page.keyboard.type('9999');
      await simulatePaste(firstInput, '1234');

      const inputOtp = page.locator('ion-input-otp');

      await verifyInputValues(inputOtp, ['1', '2', '3', '4']);
    });

    test('should paste mixed language text into all input boxes', async ({ page }) => {
      await page.setContent(`<ion-input-otp type="text" length="6">Description</ion-input-otp>`, config);

      const firstInput = page.locator('ion-input-otp input').first();
      await firstInput.focus();
      await simulatePaste(firstInput, 'أبجد123');

      const inputOtp = page.locator('ion-input-otp');

      await verifyInputValues(inputOtp, ['أ', 'ب', 'ج', 'د', '1', '2']);
    });
  });
});

/**
 * Events are the same across modes & directions
 */
configs({ modes: ['ios'], directions: ['ltr'] }).forEach(({ title, config }) => {
  test.describe(title('input-otp: events: ionInput'), () => {
    test('should emit ionInput event when typing', async ({ page }) => {
      await page.setContent(`<ion-input-otp>Description</ion-input-otp>`, config);

      const ionInput = await page.spyOnEvent('ionInput');

      const firstInput = page.locator('ion-input-otp input').first();
      await firstInput.focus();

      await page.keyboard.type('1');
      await ionInput.next();
      await expect(ionInput).toHaveReceivedEventDetail({ value: '1', event: { isTrusted: true } });
      await expect(ionInput).toHaveReceivedEventTimes(1);

      await page.keyboard.type('2');
      await ionInput.next();
      await expect(ionInput).toHaveReceivedEventDetail({ value: '12', event: { isTrusted: true } });
      await expect(ionInput).toHaveReceivedEventTimes(2);

      await page.keyboard.type('3');
      await ionInput.next();
      await expect(ionInput).toHaveReceivedEventDetail({ value: '123', event: { isTrusted: true } });
      await expect(ionInput).toHaveReceivedEventTimes(3);

      await page.keyboard.type('4');
      await ionInput.next();
      await expect(ionInput).toHaveReceivedEventDetail({ value: '1234', event: { isTrusted: true } });
      await expect(ionInput).toHaveReceivedEventTimes(4);
    });

    test('should emit ionInput event when backspacing', async ({ page }) => {
      await page.setContent(`<ion-input-otp value="1234">Description</ion-input-otp>`, config);

      const ionInput = await page.spyOnEvent('ionInput');

      await page.keyboard.press('Tab');

      await page.keyboard.press('Backspace');
      await ionInput.next();
      await expect(ionInput).toHaveReceivedEventDetail({ value: '123', event: { isTrusted: true } });
      await expect(ionInput).toHaveReceivedEventTimes(1);

      await page.keyboard.press('Backspace');
      await ionInput.next();
      await expect(ionInput).toHaveReceivedEventDetail({ value: '12', event: { isTrusted: true } });
      await expect(ionInput).toHaveReceivedEventTimes(2);

      await page.keyboard.press('Backspace');
      await ionInput.next();
      await expect(ionInput).toHaveReceivedEventDetail({ value: '1', event: { isTrusted: true } });
      await expect(ionInput).toHaveReceivedEventTimes(3);

      await page.keyboard.press('Backspace');
      await ionInput.next();
      await expect(ionInput).toHaveReceivedEventDetail({ value: '', event: { isTrusted: true } });
      await expect(ionInput).toHaveReceivedEventTimes(4);
    });

    test('should emit ionInput event when pasting', async ({ page }) => {
      await page.setContent(`<ion-input-otp>Description</ion-input-otp>`, config);

      const ionInput = await page.spyOnEvent('ionInput');

      const firstInput = page.locator('ion-input-otp input').first();
      await firstInput.focus();
      await simulatePaste(firstInput, '12');

      await ionInput.next();
      await expect(ionInput).toHaveReceivedEventDetail({ value: '12', event: { isTrusted: false } });
      await expect(ionInput).toHaveReceivedEventTimes(1);
    });

    test('should not emit ionInput event when programmatically setting the value', async ({ page }) => {
      await page.setContent(`<ion-input-otp>Description</ion-input-otp>`, config);

      const ionInput = await page.spyOnEvent('ionInput');

      const inputOtp = page.locator('ion-input-otp');
      await inputOtp.evaluate((el: HTMLIonInputOtpElement) => {
        el.value = '1234';
      });
      await verifyInputValues(inputOtp, ['1', '2', '3', '4']);

      await expect(ionInput).not.toHaveReceivedEvent();
    });
  });

  test.describe(title('input-otp: events: ionChange'), () => {
    test('should not emit ionChange event when typing', async ({ page }) => {
      await page.setContent(`<ion-input-otp>Description</ion-input-otp>`, config);

      const ionChange = await page.spyOnEvent('ionChange');

      const firstInput = page.locator('ion-input-otp input').first();
      await firstInput.focus();

      await page.keyboard.type('12');

      await expect(ionChange).not.toHaveReceivedEvent();
    });

    test('should emit ionChange event when pasting and then blurring', async ({ page }) => {
      await page.setContent(`<ion-input-otp>Description</ion-input-otp>`, config);

      const ionChange = await page.spyOnEvent('ionChange');

      const firstInput = page.locator('ion-input-otp input').first();
      await firstInput.focus();
      await simulatePaste(firstInput, '12');

      // Click outside the input to trigger the blur event
      await page.mouse.click(0, 0);

      await ionChange.next();
      await expect(ionChange).toHaveReceivedEventDetail({ value: '12', event: { isTrusted: true } });
      await expect(ionChange).toHaveReceivedEventTimes(1);
    });

    test('should emit ionChange event when blurring with a new value', async ({ page }) => {
      await page.setContent(`<ion-input-otp>Description</ion-input-otp>`, config);

      const ionChange = await page.spyOnEvent('ionChange');

      const firstInput = page.locator('ion-input-otp input').first();
      await firstInput.focus();

      await page.keyboard.type('12');

      // Click outside the input to trigger the blur event
      await page.mouse.click(0, 0);

      await ionChange.next();
      await expect(ionChange).toHaveReceivedEvent();
      await expect(ionChange).toHaveReceivedEventTimes(1);
    });

    test('should not emit ionChange event when blurring with the same value', async ({ page }) => {
      await page.setContent(`<ion-input-otp value="12">Description</ion-input-otp>`, config);

      const ionBlur = await page.spyOnEvent('ionBlur');
      const ionChange = await page.spyOnEvent('ionChange');

      const firstInput = page.locator('ion-input-otp input').first();
      await firstInput.focus();

      // Click outside the input to trigger the blur event
      await page.mouse.click(0, 0);

      await ionBlur.next();
      await expect(ionBlur).toHaveReceivedEvent();
      await expect(ionBlur).toHaveReceivedEventTimes(1);
      await expect(ionChange).not.toHaveReceivedEvent();
    });

    test('should not emit ionChange event when programmatically setting the value', async ({ page }) => {
      await page.setContent(`<ion-input-otp>Description</ion-input-otp>`, config);

      const ionChange = await page.spyOnEvent('ionChange');

      const inputOtp = page.locator('ion-input-otp');
      await inputOtp.evaluate((el: HTMLIonInputOtpElement) => {
        el.value = '1234';
      });
      await verifyInputValues(inputOtp, ['1', '2', '3', '4']);

      await expect(ionChange).not.toHaveReceivedEvent();
    });
  });

  test.describe(title('input-otp: events: ionComplete'), () => {
    test('should emit ionComplete event when all input boxes are filled', async ({ page }) => {
      await page.setContent(`<ion-input-otp>Description</ion-input-otp>`, config);

      const ionComplete = await page.spyOnEvent('ionComplete');

      const firstInput = page.locator('ion-input-otp input').first();
      await firstInput.focus();

      await page.keyboard.type('1234');

      await ionComplete.next();
      await expect(ionComplete).toHaveReceivedEventDetail({ value: '1234' });
      await expect(ionComplete).toHaveReceivedEventTimes(1);
    });
  });

  test.describe(title('input-otp: events: ionFocus'), () => {
    test('should emit ionFocus event when input box is focused', async ({ page }) => {
      await page.setContent(`<ion-input-otp>Description</ion-input-otp>`, config);

      const ionFocus = await page.spyOnEvent('ionFocus');

      const firstInput = page.locator('ion-input-otp input').first();
      await firstInput.focus();

      await ionFocus.next();
      await expect(ionFocus).toHaveReceivedEvent();
      await expect(ionFocus).toHaveReceivedEventTimes(1);
    });

    test('should not emit ionFocus event when focus is moved to another input in the same component', async ({
      page,
    }) => {
      await page.setContent(`<ion-input-otp value="1234">Description</ion-input-otp>`, config);

      const firstInput = page.locator('ion-input-otp input').first();
      await firstInput.focus();

      const ionFocus = await page.spyOnEvent('ionFocus');

      await page.keyboard.press('ArrowRight');

      await expect(ionFocus).not.toHaveReceivedEvent();
    });
  });

  test.describe(title('input-otp: events: ionBlur'), () => {
    test('should emit ionBlur event when focus leaves the component', async ({ page }) => {
      await page.setContent(`<ion-input-otp>Description</ion-input-otp>`, config);

      const ionBlur = await page.spyOnEvent('ionBlur');

      const firstInput = page.locator('ion-input-otp input').first();
      await firstInput.focus();

      // Click outside the input to trigger the blur event
      await page.mouse.click(0, 0);

      await ionBlur.next();
      await expect(ionBlur).toHaveReceivedEvent();
      await expect(ionBlur).toHaveReceivedEventTimes(1);
    });

    test('should not emit ionBlur event when focus is moved to another input in the same component', async ({
      page,
    }) => {
      await page.setContent(`<ion-input-otp value="1234">Description</ion-input-otp>`, config);

      const ionBlur = await page.spyOnEvent('ionBlur');

      const firstInput = page.locator('ion-input-otp input').first();
      await firstInput.focus();

      await page.keyboard.press('ArrowRight');

      await expect(ionBlur).not.toHaveReceivedEvent();
    });
  });
});

/**
 * Methods are the same across modes & directions
 */
configs({ modes: ['ios'], directions: ['ltr'] }).forEach(({ title, config }) => {
  test.describe(title('input-otp: setFocus method'), () => {
    test('should not focus the specified input box when index is provided and value is not set', async ({ page }) => {
      await page.setContent(`<ion-input-otp>Description</ion-input-otp>`, config);

      const inputOtp = page.locator('ion-input-otp');
      await inputOtp.evaluate((el: HTMLIonInputOtpElement) => {
        el.setFocus(2);
      });

      const thirdInput = page.locator('ion-input-otp input').nth(2);
      await expect(thirdInput).not.toBeFocused();
    });

    test('should focus the specified input box when index is provided and value is set', async ({ page }) => {
      await page.setContent(`<ion-input-otp value="1234">Description</ion-input-otp>`, config);

      const inputOtp = page.locator('ion-input-otp');
      await inputOtp.evaluate((el: HTMLIonInputOtpElement) => {
        el.setFocus(2);
      });

      const thirdInput = page.locator('ion-input-otp input').nth(2);
      await expect(thirdInput).toBeFocused();
    });

    test('should focus first empty input when no index is provided and not all inputs are filled', async ({ page }) => {
      await page.setContent(`<ion-input-otp value="12">Description</ion-input-otp>`, config);

      const inputOtp = page.locator('ion-input-otp');
      await inputOtp.evaluate((el: HTMLIonInputOtpElement) => {
        el.setFocus();
      });

      const thirdInput = page.locator('ion-input-otp input').nth(2);
      await expect(thirdInput).toBeFocused();
    });

    test('should focus last input when no index is provided and all inputs are filled', async ({ page }) => {
      await page.setContent(`<ion-input-otp value="1234">Description</ion-input-otp>`, config);

      const inputOtp = page.locator('ion-input-otp');
      await inputOtp.evaluate((el: HTMLIonInputOtpElement) => {
        el.setFocus();
      });

      const lastInput = page.locator('ion-input-otp input').last();
      await expect(lastInput).toBeFocused();
    });

    test('should clamp invalid indices to valid range', async ({ page }) => {
      await page.setContent(`<ion-input-otp value="1234">Description</ion-input-otp>`, config);

      const inputOtp = page.locator('ion-input-otp');

      // Test negative index
      await inputOtp.evaluate((el: HTMLIonInputOtpElement) => {
        el.setFocus(-1);
      });
      const firstInput = page.locator('ion-input-otp input').first();
      await expect(firstInput).toBeFocused();

      // Test index beyond length
      await inputOtp.evaluate((el: HTMLIonInputOtpElement) => {
        el.setFocus(10);
      });
      const lastInput = page.locator('ion-input-otp input').last();
      await expect(lastInput).toBeFocused();
    });
  });
});
