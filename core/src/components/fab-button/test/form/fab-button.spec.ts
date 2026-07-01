import { newSpecPage } from '@stencil/core/testing';

import { FabButton } from '../../fab-button';

describe('FabButton: Hidden Form Button', () => {
  it('should not add multiple buttons to the form on re-render', async () => {
    const page = await newSpecPage({
      components: [FabButton],
      html: `
        <form id="my-form"></form>
        <ion-fab-button form="my-form" type="submit">Submit</ion-fab-button>
      `,
    });

    const getButtons = () => {
      return page.body.querySelectorAll('form button');
    };

    const fabButton = page.body.querySelector('ion-fab-button')!;

    await page.waitForChanges();

    expect(getButtons().length).toEqual(1);

    // Re-render the component by changing a prop
    fabButton.color = 'danger';
    await page.waitForChanges();

    expect(getButtons().length).toEqual(1);
  });
});
