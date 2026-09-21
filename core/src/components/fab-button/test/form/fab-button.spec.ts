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

    // Re-render the component
    fabButton.color = 'danger';
    await page.waitForChanges();

    expect(getButtons().length).toEqual(1);
  });

  it('should sync the type and disabled state to the hidden button', async () => {
    const page = await newSpecPage({
      components: [FabButton],
      html: `
        <form id="my-form"></form>
        <ion-fab-button form="my-form" type="submit">Submit</ion-fab-button>
      `,
    });

    const getHiddenButton = () => {
      return page.body.querySelector<HTMLButtonElement>('form button')!;
    };

    const fabButton = page.body.querySelector('ion-fab-button')!;

    await page.waitForChanges();

    expect(getHiddenButton().type).toEqual('submit');
    expect(getHiddenButton().disabled).toEqual(false);

    fabButton.type = 'reset';
    fabButton.disabled = true;
    await page.waitForChanges();

    expect(page.body.querySelectorAll('form button').length).toEqual(1);
    expect(getHiddenButton().type).toEqual('reset');
    expect(getHiddenButton().disabled).toEqual(true);
  });
});
