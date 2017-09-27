import { render, flush } from '@stencil/core/testing';
import { Button } from '../button';


describe('button', () => {

  it('should render button inner text', async () => {
    const root = await render({
      components: [Button],
      html: '<ion-button>Button Inner Text</ion-button>'
    });

    expect(root.textContent).toBe('Button Inner Text');
    expect(root.querySelector('button').hasAttribute('disabled')).toBe(false);

    root.disabled = true;
    await flush(root);

    expect(root.querySelector('button').hasAttribute('disabled')).toBe(true);
  });

  it('should default itemButton to false', () => {
    const btn = new Button();
    expect(btn.itemButton).toBe(false);
  });

});
