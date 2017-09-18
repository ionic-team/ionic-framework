import { register, render } from '@stencil/core/testing';
import { Navbar } from '../navbar';

describe('navbar', () => {
  let plt: any;
  beforeEach(() => {
    plt = register([{
      tagNameMeta: 'ion-navbar',
      componentModule: Navbar
    }])
  });

  it('exists', () => {
    const nb = new Navbar();
    expect(nb).toBeTruthy();
  });

  it('renders', async () => {
    const btn = await render(plt, '<ion-navbar></ion-navbar>');
    // expect(btn.innerHTML).toBeTruthy; // so it would be nice if this worked, but currently having h() undefined issues
    expect(btn.outerHTML).toEqual('<ion-navbar class="💎"></ion-navbar>');
  });

  describe('backButtonClick', () => {
    let navbar: Navbar;
    beforeEach(() => {
      navbar = new Navbar();
    });

    it('calls preventDefault', () => {
      const evt = new UIEvent('click');
      evt.preventDefault = jest.fn();
      navbar.backButtonClick(evt);
      expect(evt.preventDefault).toHaveBeenCalledTimes(1);
    });

    it('calls stopPropagation', () => {
      const evt = new UIEvent('click');
      evt.stopPropagation = jest.fn();
      navbar.backButtonClick(evt);
      expect(evt.stopPropagation).toHaveBeenCalledTimes(1);
    });
  });
});
