import { newSpecPage } from '@stencil/core/testing';

import { Input } from '../../input';

describe('input: password toggle button', () => {
  it('should toggle the input type when pressed', async () => {
    const page = await newSpecPage({
        components: [Input],
        html: '<ion-input value="abc" type="password" show-password-toggle="true"></ion-input>',
      });

    const input = page.body.querySelector('ion-input .native-input')!;
    const passwordToggleButton = page.body.querySelector<HTMLButtonElement>('ion-input .input-password-toggle')!;

    passwordToggleButton.click();
    await page.waitForChanges();

    await expect(input.getAttribute('type')).toBe('text');

    passwordToggleButton.click();
    await page.waitForChanges();

    await expect(input.getAttribute('type')).toBe('password');
  });
  it('should change icon when using showPasswordIcon and hidePasswordIcon props', async () => {
    const page = await newSpecPage({
        components: [Input],
        html: `
            <ion-input 
                value="abc" 
                type="password" 
                clear-input="true" 
                show-password-toggle="true"
                show-password-icon="bus"
                hide-password-icon="cafe"
            ></ion-input>
        `,
    });

    const passwordToggleButton = page.body.querySelector<HTMLButtonElement>('ion-input .input-password-toggle')!;
    const passwordToggleIcon = page.body.querySelector<HTMLButtonElement>('ion-input .input-password-toggle ion-icon')!;

    await expect(passwordToggleIcon.getAttribute('icon')).toBe('bus');

    passwordToggleButton.click();
    await page.waitForChanges();

    await expect(passwordToggleIcon.getAttribute('icon')).toBe('cafe');
  });
});
