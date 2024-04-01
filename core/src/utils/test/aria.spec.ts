import { newSpecPage } from '@stencil/core/testing';

import { Item } from '../../components/item/item';
import { Label } from '../../components/label/label';
import { Toggle } from '../../components/toggle/toggle';
import { getAriaLabel } from '../helpers';

describe('getAriaLabel()', () => {
  it('should correctly link component to label', async () => {
    const page = await newSpecPage({
      components: [Item, Label, Toggle],
      html: `
        <ion-item>
          <ion-label>My Label</ion-label>
          <ion-toggle></ion-toggle>
        </ion-item>
      `,
    });

    const toggle =
      page.body.querySelector(
        'ion-toggle'
      )!;

    const {
      label,
      labelId,
      labelText,
    } = getAriaLabel(
      toggle,
      'ion-tg-0'
    );

    expect(labelText).toEqual(
      'My Label'
    );
    expect(labelId).toEqual(
      'ion-tg-0-lbl'
    );
    expect(label).toEqual(
      page.body.querySelector(
        'ion-label'
      )
    );
  });

  it('should correctly link component when using custom label', async () => {
    const page = await newSpecPage({
      components: [Toggle],
      html: `
        <div id="my-label">Hello World</div>
        <ion-toggle legacy="true" aria-labelledby="my-label"></ion-toggle>
      `,
    });

    const toggle =
      page.body.querySelector(
        'ion-toggle'
      )!;

    const {
      label,
      labelId,
      labelText,
    } = getAriaLabel(
      toggle,
      'ion-tg-0'
    );

    expect(labelText).toEqual(
      'Hello World'
    );
    expect(labelId).toEqual('my-label');
    expect(label).toEqual(
      page.body.querySelector(
        '#my-label'
      )
    );
  });

  it('should correctly link component when special characters are used', async () => {
    const page = await newSpecPage({
      components: [Toggle],
      html: `
        <div id="id.1">Hello World</div>
        <ion-toggle legacy="true" aria-labelledby="id.1"></ion-toggle>
      `,
    });

    const toggle =
      page.body.querySelector(
        'ion-toggle'
      )!;

    const { labelId, labelText } =
      getAriaLabel(toggle, 'ion-tg-0');

    expect(labelText).toEqual(
      'Hello World'
    );
    expect(labelId).toEqual('id.1');
  });

  it('should only set the label id if one was not set already', async () => {
    const page = await newSpecPage({
      components: [Toggle],
      html: `
        <label id="my-id" for="id.1">Hello World</label>
        <ion-toggle legacy="true" id="id.1"></ion-toggle>
      `,
    });

    const toggle =
      page.body.querySelector(
        'ion-toggle'
      )!;

    const { labelId, labelText } =
      getAriaLabel(toggle, 'ion-tg-0');

    expect(labelText).toEqual(
      'Hello World'
    );
    expect(labelId).toEqual('my-id');
  });

  it('should set label id', async () => {
    const page = await newSpecPage({
      components: [Toggle],
      html: `
        <label for="id.1">Hello World</label>
        <ion-toggle legacy="true" id="id.1"></ion-toggle>
      `,
    });

    const toggle =
      page.body.querySelector(
        'ion-toggle'
      )!;

    const { labelId, labelText } =
      getAriaLabel(toggle, 'ion-tg-0');

    expect(labelText).toEqual(
      'Hello World'
    );
    expect(labelId).toEqual('id.1-lbl');
  });
});
