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

    await button.click();
    await page.waitForChanges();

    expect(input.type).toBe('text');

    await button.click();
    await page.waitForChanges();

    expect(input.type).toBe('password');
  });

  it.skip('should inherit the mode and color to internal ionic components', async () => {
    const page = await newSpecPage({
      components: [Input, InputPasswordToggle, Button],
      template: () => (
        <ion-input type="password" mode="md" color="primary">
          <ion-input-password-toggle slot="end" mode="ios" color="danger"></ion-input-password-toggle>
        </ion-input>
      ),
    });

    const inputPasswordToggle = page.body.querySelector('ion-input-password-toggle')!;
    const button = inputPasswordToggle.shadowRoot!.querySelector('ion-button')!;

    await page.waitForChanges();

    expect(button.mode).toBe('ios');
    expect(button.color).toBe('danger');
  });
});
