import { h } from '@stencil/core';
import { newSpecPage } from '@stencil/core/testing';

import { Button } from '../../button/button';
import { Nav } from '../../nav/nav';
import { NavLink } from '../nav-link';

describe('NavLink', () => {
  it('should not navigate when button is disabled', async () => {
    const page = await newSpecPage({
      components: [Nav, NavLink, Button],
      template: () => (
        <ion-nav>
          <ion-nav-link component="div">
            <ion-button disabled>Disabled</ion-button>
          </ion-nav-link>
        </ion-nav>
      ),
    });

    const mock = jest.fn();

    const nav = page.body.querySelector('ion-nav')!;
    const ionButton = page.body.querySelector('ion-button')!;

    nav.addEventListener('ionNavWillChange', mock);

    await ionButton.click();

    expect(mock).not.toHaveBeenCalled();
  });
});
