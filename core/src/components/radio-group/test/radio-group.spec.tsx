import { h } from '@stencil/core';
import { newSpecPage } from '@stencil/core/testing';

import { Radio } from '../../radio/radio';
import { RadioGroup } from '../radio-group';

describe('ion-radio-group', () => {
  it('should correctly set value when using compareWith string', async () => {
    const page = await newSpecPage({
      components: [Radio, RadioGroup],
      template: () => (
        <ion-radio-group
          compareWith="value"
          value={{
            label: 'Blue',
            value: 'blue',
          }}
        >
          <ion-radio
            value={{
              label: 'Red',
              value: 'red',
            }}
          >
            Red
          </ion-radio>
          <ion-radio
            value={{
              label: 'Blue',
              value: 'blue',
            }}
          >
            Blue
          </ion-radio>
          <ion-radio
            value={{
              label: 'Green',
              value: 'green',
            }}
          >
            Green
          </ion-radio>
        </ion-radio-group>
      ),
    });

    const radioGroup =
      page.body.querySelector(
        'ion-radio-group'
      )!;
    const radios =
      document.querySelectorAll(
        'ion-radio'
      )!;

    await radios[2].click();
    await page.waitForChanges();

    expect(
      radios[2].getAttribute(
        'aria-checked'
      )
    ).toBe('true');
    expect(radioGroup.value).toEqual({
      label: 'Green',
      value: 'green',
    });
  });

  it('should correctly set value when using compareWith function', async () => {
    const page = await newSpecPage({
      components: [Radio, RadioGroup],
      template: () => (
        <ion-radio-group
          value={{
            label: 'Blue',
            value: 'blue',
          }}
        >
          <ion-radio
            value={{
              label: 'Red',
              value: 'red',
            }}
          >
            Red
          </ion-radio>
          <ion-radio
            value={{
              label: 'Blue',
              value: 'blue',
            }}
          >
            Blue
          </ion-radio>
          <ion-radio
            value={{
              label: 'Green',
              value: 'green',
            }}
          >
            Green
          </ion-radio>
        </ion-radio-group>
      ),
    });

    const radioGroup =
      page.body.querySelector(
        'ion-radio-group'
      )!;
    const radios =
      document.querySelectorAll(
        'ion-radio'
      )!;
    radioGroup.compareWith = (a, b) =>
      a.value === b.value;

    await radios[2].click();
    await page.waitForChanges();

    expect(
      radios[2].getAttribute(
        'aria-checked'
      )
    ).toBe('true');
    expect(radioGroup.value).toEqual({
      label: 'Green',
      value: 'green',
    });
  });

  it('should correctly set value when using compareWith null', async () => {
    const page = await newSpecPage({
      components: [RadioGroup, Radio],
      template: () => (
        <ion-radio-group
          compareWith={null}
          value="blue"
        >
          <ion-radio value="red">
            Red
          </ion-radio>
          <br />
          <ion-radio value="blue">
            Blue
          </ion-radio>
          <br />
          <ion-radio value="green">
            Green
          </ion-radio>
        </ion-radio-group>
      ),
    });

    const radioGroup =
      page.body.querySelector(
        'ion-radio-group'
      )!;
    const radios =
      document.querySelectorAll(
        'ion-radio'
      )!;

    await radios[2].click();
    await page.waitForChanges();

    expect(
      radios[2].getAttribute(
        'aria-checked'
      )
    ).toBe('true');
    expect(radioGroup.value).toEqual(
      'green'
    );
  });

  it('should work with different parameter types', async () => {
    const page = await newSpecPage({
      components: [Radio, RadioGroup],
      template: () => (
        <ion-radio-group value={2}>
          <ion-radio value={1}>
            Option #1
          </ion-radio>
          <ion-radio value={2}>
            Option #2
          </ion-radio>
          <ion-radio value={3}>
            Option #3
          </ion-radio>
        </ion-radio-group>
      ),
    });

    const radioGroup =
      page.body.querySelector(
        'ion-radio-group'
      )!;
    radioGroup.compareWith = (
      val1,
      val2
    ) => {
      // convert val1 to a number
      return +val1 === val2;
    };

    const radios =
      document.querySelectorAll(
        'ion-radio'
      )!;

    await expect(
      radios[1].getAttribute(
        'aria-checked'
      )
    ).toBe('true');

    await radios[2].click();
    await page.waitForChanges();

    expect(
      radios[2].getAttribute(
        'aria-checked'
      )
    ).toBe('true');
    expect(radioGroup.value).toEqual(3);
  });
});
