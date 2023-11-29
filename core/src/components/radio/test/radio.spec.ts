import { newSpecPage } from '@stencil/core/testing';

import { RadioGroup } from '../../radio-group/radio-group';
import { Radio } from '../radio';

describe('ion-radio', () => {
  it('should set a default value', async () => {
    const radio = new Radio();

    await radio.connectedCallback();

    expect(radio.value).toEqual('ion-rb-0');
  });

  it('should update the checked state when updating the value', async () => {
    const page = await newSpecPage({
      components: [Radio, RadioGroup],
      html: `
        <ion-radio-group value="a">
          <ion-radio value="other-value"></ion-radio>
        </ion-radio-group>
      `,
    });

    const radio = page.body.querySelector('ion-radio')!;
    expect(radio.classList.contains('radio-checked')).toBe(false);

    radio.value = 'a';

    await page.waitForChanges();

    expect(radio.classList.contains('radio-checked')).toBe(true);
  });
});

describe('ion-radio: disabled', () => {
  it('clicking disabled radio should not set checked state', async () => {
    const page = await newSpecPage({
      components: [Radio, RadioGroup],
      html: `
        <ion-radio-group>
          <ion-radio disabled="true" value="a">Radio</ion-radio>
        </ion-radio-group>
      `,
    });

    const radio = page.body.querySelector('ion-radio')!;
    const radioGroup = page.body.querySelector('ion-radio-group')!;

    expect(radioGroup.value).toBe(undefined);

    radio.click();

    await page.waitForChanges();

    expect(radioGroup.value).toBe(undefined);
  });
});
