import { newSpecPage } from '@stencil/core/testing';

import { Button } from '../../button';

describe('Button: Hidden Form Button', () => {
  it('should not add multiple buttons to the form', async () => {
    const page = await newSpecPage({
      components: [Button],
      html: `
        <form id="my-form"></form>
        <ion-button form="my-form" type="submit">Submit</ion-button>
      `,
    });

    const getButtons = () => {
      return page.body.querySelectorAll(
        'form button'
      );
    };

    const button =
      page.body.querySelector(
        'ion-button'
      )!;

    await page.waitForChanges();

    expect(getButtons().length).toEqual(
      1
    );

    // Re-render the component
    button.color = 'danger';
    await page.waitForChanges();

    expect(getButtons().length).toEqual(
      1
    );
  });
});
