import { newSpecPage } from '@stencil/core/testing';

import { List } from '../../../list/list';
import { RadioGroup } from '../../../radio-group/radio-group';
import { Radio } from '../../../radio/radio';
import { Item } from '../../item';

describe('ion-item', () => {
  it('should not have a role when used without list', async () => {
    const page = await newSpecPage({
      components: [Item],
      html: `<ion-item>Hello World</ion-item>`,
    });

    const item = page.body.querySelector('ion-item')!;
    expect(item.getAttribute('role')).toBe(null);
  });

  it('should have a listitem role when used inside list', async () => {
    const page = await newSpecPage({
      components: [Item, List],
      html: `
        <ion-list>
          <ion-item>
            Hello World
          </ion-item>
        </ion-list>
      `,
    });

    const item = page.body.querySelector('ion-item')!;
    expect(item.getAttribute('role')).toBe('listitem');
  });

  it('should not have a role when used inside radio group and list', async () => {
    const page = await newSpecPage({
      components: [Radio, RadioGroup, Item, List],
      html: `
        <ion-list>
          <ion-radio-group value="a">
            <ion-item>
              <ion-radio value="other-value" aria-label="my radio"></ion-radio>
            </ion-item>
          </ion-radio-group>
        </ion-list>
      `,
    });

    const item = page.body.querySelector('ion-item')!;
    expect(item.getAttribute('role')).toBe(null);
  });
});
