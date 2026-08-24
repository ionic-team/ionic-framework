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

  it('should render the radio with shadow parts', async () => {
    const page = await newSpecPage({
      components: [Radio, RadioGroup],
      html: `
        <ion-radio-group>
          <ion-radio value="value"></ion-radio>
        </ion-radio-group>
      `,
    });

    const radio = page.body.querySelector('ion-radio')!;

    expect(radio).toHaveShadowPart('container');
    expect(radio).toHaveShadowPart('label');
    expect(radio).toHaveShadowPart('mark');
  });
});

describe('ion-radio: value', () => {
  const createRadio = async (markup = '<ion-radio></ion-radio>') => {
    const page = await newSpecPage({
      components: [Radio, RadioGroup],
      html: `
        <ion-radio-group>
          ${markup}
        </ion-radio-group>
      `,
    });

    return {
      page,
      radio: page.body.querySelector('ion-radio')!,
      radioGroup: page.body.querySelector('ion-radio-group')!,
    };
  };

  it('should keep a true value on the property', async () => {
    const { page, radio } = await createRadio();

    radio.value = true;

    await page.waitForChanges();

    expect(radio.value).toBe(true);
    expect(radio.getAttribute('value')).toBe('');
  });

  it('should report a non-string value to the radio group when selected', async () => {
    const { page, radio, radioGroup } = await createRadio();

    radio.value = true;

    await page.waitForChanges();

    radio.click();

    await page.waitForChanges();

    expect(radioGroup.value).toBe(true);
  });

  it('should keep a false value on the property', async () => {
    const { page, radio, radioGroup } = await createRadio();

    radio.value = false;

    await page.waitForChanges();

    expect(radio.value).toBe(false);
    expect(radio.hasAttribute('value')).toBe(false);

    radio.click();

    await page.waitForChanges();

    expect(radioGroup.value).toBe(false);
  });

  it('should not replace an undefined value with null', async () => {
    const { page, radio } = await createRadio();

    radio.value = undefined;

    await page.waitForChanges();

    expect(radio.value).toBe(undefined);
  });

  it('should check the radio when the group is given a matching non-string value', async () => {
    const { page, radio, radioGroup } = await createRadio();

    radio.value = true;

    await page.waitForChanges();

    radioGroup.value = true;

    await page.waitForChanges();

    expect(radio.classList.contains('radio-checked')).toBe(true);
  });

  it('should keep an object value on the property', async () => {
    const { page, radio } = await createRadio();
    const value = { id: 1 };

    radio.value = value;

    await page.waitForChanges();

    expect(radio.value).toBe(value);
  });

  it('should clear an object value when it is set back to null', async () => {
    const { page, radio } = await createRadio();

    radio.value = { id: 1 };

    await page.waitForChanges();

    radio.value = null;

    await page.waitForChanges();

    expect(radio.value).toBe(null);
    expect(radio.hasAttribute('value')).toBe(false);
  });

  it('should replace a non-string value with its string form', async () => {
    const { page, radio } = await createRadio();

    radio.value = 1;

    await page.waitForChanges();

    radio.value = '1';

    await page.waitForChanges();

    expect(radio.value).toBe('1');
  });

  it('should reflect a string value to the attribute', async () => {
    const { page, radio } = await createRadio();

    radio.value = 'a';

    await page.waitForChanges();

    expect(radio.getAttribute('value')).toBe('a');
  });

  it('should reflect a number value to the attribute', async () => {
    const { page, radio } = await createRadio();

    radio.value = 42;

    await page.waitForChanges();

    expect(radio.value).toBe(42);
    expect(radio.getAttribute('value')).toBe('42');
  });

  it('should clear an object value when the attribute is removed', async () => {
    const { page, radio } = await createRadio('<ion-radio value="a"></ion-radio>');

    radio.value = { id: 1 };

    await page.waitForChanges();

    radio.removeAttribute('value');

    await page.waitForChanges();

    expect(radio.value).toBe(null);
  });

  it('should update the property when the attribute changes on a non-string value', async () => {
    const { page, radio } = await createRadio();

    radio.value = true;

    await page.waitForChanges();

    radio.setAttribute('value', 'b');

    await page.waitForChanges();

    expect(radio.value).toBe('b');
  });

  it('should update the property when the attribute changes', async () => {
    const { page, radio } = await createRadio('<ion-radio value="a"></ion-radio>');

    radio.setAttribute('value', 'b');

    await page.waitForChanges();

    expect(radio.value).toBe('b');
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
