import { register, render } from '@stencil/core/testing';
import { Button } from '../button';

describe('button', () => {
  let plt: any;
  beforeEach(() => {
    plt = register([{
      tagNameMeta: 'ion-button',
      componentModule: Button
    }])
  });

  it('exists', () => {
    const btn = new Button();
    expect(btn).toBeTruthy();
  });

  it('renders', async () => {
    const btn = await render(plt, '<ion-button></ion-button>');
    // expect(btn.innerHTML).toBeTruthy; // so it would be nice if this worked, but currently having h() undefined issues
    expect(btn.outerHTML).toEqual('<ion-button class="💎"></ion-button>');
  });
});
