import { h } from '@stencil/core';
import { newSpecPage } from '@stencil/core/testing';

import { Input } from '../../input/input';
import { InputPasswordToggle } from '../input-password-toggle';
import { Button } from '../../button/button';

describe('input password toggle', () => {
  it('should toggle input type when clicked', async () => {
    const page = await newSpecPage({
      components: [Input, InputPasswordToggle, Button],
      template: () => (
        <ion-input type="password">
          <ion-input-password-toggle slot="end"></ion-input-password-toggle>
        </ion-input>
      ),
    });

    const inputPasswordToggle = page.body.querySelector('ion-input-password-toggle')!;
    const button = inputPasswordToggle.shadowRoot!.querySelector('ion-button')!;
    const input = page.body.querySelector('ion-input')!;

    expect(input.type).toBe('password');

    button.click();
    await page.waitForChanges();

    expect(input.type).toBe('text');

    button.click();
    await page.waitForChanges();

    expect(input.type).toBe('password');
  });

  it('should render custom icons', async () => {
    const page = await newSpecPage({
      components: [Input, InputPasswordToggle, Button],
      template: () => (
        <ion-input type="password">
          <ion-input-password-toggle showPasswordIcon="show" hidePasswordIcon="hide" slot="end"></ion-input-password-toggle>
        </ion-input>
      ),
    });

    const inputPasswordToggle = page.body.querySelector('ion-input-password-toggle')!;
    const button = inputPasswordToggle.shadowRoot!.querySelector('ion-button')!;
    const icon = inputPasswordToggle.shadowRoot!.querySelector('ion-icon')!;

    // Grab the attribute to test since we are not actually passing in a valid SVG
    expect(icon.getAttribute('icon')).toBe('show');

    button.click();
    await page.waitForChanges();

    expect(icon.getAttribute('icon')).toBe('hide');
  });

  it('changing the type on the input should update the icon used in password toggle', async () => {
    const page = await newSpecPage({
      components: [Input, InputPasswordToggle, Button],
      template: () => (
        <ion-input type="password">
          <ion-input-password-toggle showPasswordIcon="show" hidePasswordIcon="hide" slot="end"></ion-input-password-toggle>
        </ion-input>
      ),
    });

    const inputPasswordToggle = page.body.querySelector('ion-input-password-toggle')!;
    const input = page.body.querySelector('ion-input')!;
    const icon = inputPasswordToggle.shadowRoot!.querySelector('ion-icon')!;

    // Grab the attribute to test since we are not actually passing in a valid SVG
    expect(icon.getAttribute('icon')).toBe('show');

    input.type = "text";
    await page.waitForChanges();

    expect(icon.getAttribute('icon')).toBe('hide');

    input.type = "password";
    await page.waitForChanges();

    expect(icon.getAttribute('icon')).toBe('show');
  });

  it('should inherit the mode and color to internal ionic components', async () => {
    const page = await newSpecPage({
      components: [Input, InputPasswordToggle, Button],
      template: () => (
        <ion-input type="password" color="primary">
          <ion-input-password-toggle slot="end" mode="ios" color="danger"></ion-input-password-toggle>
        </ion-input>
      ),
    });

    const inputPasswordToggle = page.body.querySelector('ion-input-password-toggle')!;
    const button = inputPasswordToggle.shadowRoot!.querySelector('ion-button')!;

    await page.waitForChanges();

    // TODO fix me
    //expect(button.mode).toBe('ios');
    expect(button.color).toBe('danger');
  });
});
