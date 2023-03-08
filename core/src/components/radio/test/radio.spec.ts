import { Radio } from '../radio.tsx';
import { RadioGroup } from '../../radio-group/radio-group.tsx';
import { newSpecPage } from '@stencil/core/testing';

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

    const radio = page.root.querySelector('ion-radio');
    expect(radio.classList.contains('radio-checked')).toBe(false);

    radio.value = 'a';

    await page.waitForChanges();

    expect(radio.classList.contains('radio-checked')).toBe(true);
  });
});
