import { newSpecPage } from '@stencil/core/testing';
import { Datetime } from '../datetime.tsx';
import { Popover } from '../../popover/popover.tsx';

it('should not render buttons or title with inline datetime', async () => {
  const { doc } = await newSpecPage({
    components: [Datetime],
    html: `<ion-datetime></ion-datetime>`
  });

  const datetime = doc.querySelector('ion-datetime');

  expect(datetime.shadowRoot.querySelector('slot[name="title"]').innerText).toEqual('');
  expect(datetime.shadowRoot.querySelector('slot[name="buttons"]').innerText).toEqual('');
});

it('should not render buttons or title by default with popover datetime', async () => {
  const { doc } = await newSpecPage({
    components: [Datetime, Popover],
    html: `
      <ion-popover>
        <ion-datetime></ion-datetime>
      </ion-popover>
    `
  });

  const datetime = doc.querySelector('ion-datetime');

  expect(datetime.shadowRoot.querySelector('slot[name="title"]').innerText).toEqual('');
  expect(datetime.shadowRoot.querySelector('slot[name="buttons"]').innerText).toEqual('');
});
