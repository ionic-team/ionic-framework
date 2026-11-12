import { newSpecPage } from '@stencil/core/testing';

import { config } from '../../../global/config';
import { RouterLink } from '../router-link';

describe('router-link: hue', () => {
  afterEach(() => {
    config.reset({});
  });

  it('should default to the bold hue', async () => {
    const page = await newSpecPage({
      components: [RouterLink],
      html: `<ion-router-link>Link</ion-router-link>`,
    });

    expect(page.root).toHaveClass('router-link-hue-bold');
  });

  it('should use the hue from the config', async () => {
    config.reset({
      customTheme: { config: { components: { IonRouterLink: { hue: 'subtle' } } } },
    });

    const page = await newSpecPage({
      components: [RouterLink],
      html: `<ion-router-link>Link</ion-router-link>`,
    });

    expect(page.root).toHaveClass('router-link-hue-subtle');
  });

  it('should prefer the hue property over the config', async () => {
    config.reset({
      customTheme: { config: { components: { IonRouterLink: { hue: 'subtle' } } } },
    });

    const page = await newSpecPage({
      components: [RouterLink],
      html: `<ion-router-link hue="bold">Link</ion-router-link>`,
    });

    expect(page.root).toHaveClass('router-link-hue-bold');
  });
});

describe('router-link', () => {
  it('should pass href, rel and target to the anchor', async () => {
    const page = await newSpecPage({
      components: [RouterLink],
      html: `<ion-router-link href="/page" rel="external" target="_blank">Link</ion-router-link>`,
    });

    const anchor = page.root!.shadowRoot!.querySelector('a')!;

    expect(anchor.getAttribute('href')).toBe('/page');
    expect(anchor.getAttribute('rel')).toBe('external');
    expect(anchor.getAttribute('target')).toBe('_blank');
  });

  it('should add color classes when color is set', async () => {
    const page = await newSpecPage({
      components: [RouterLink],
      html: `<ion-router-link color="danger">Link</ion-router-link>`,
    });

    expect(page.root).toHaveClasses(['ion-color', 'ion-color-danger', 'ion-activatable']);
  });

  it('should not add color classes when color is not set', async () => {
    const page = await newSpecPage({
      components: [RouterLink],
      html: `<ion-router-link>Link</ion-router-link>`,
    });

    expect(page.root).not.toHaveClass('ion-color');
    expect(page.root).toHaveClass('ion-activatable');
  });

  it('should add the ion-focusable class', async () => {
    const page = await newSpecPage({
      components: [RouterLink],
      html: `<ion-router-link href="/page">Link</ion-router-link>`,
    });

    expect(page.root).toHaveClass('ion-focusable');
  });

  describe('click', () => {
    const setup = async (href: string) => {
      const page = await newSpecPage({
        components: [RouterLink],
        html: `
          <ion-router></ion-router>
          <ion-router-link href="${href}" router-direction="back">Link</ion-router-link>
        `,
      });

      const router = page.body.querySelector('ion-router') as any;
      router.push = jest.fn();

      const link = page.body.querySelector('ion-router-link')!;
      const animation = jest.fn();
      link.routerAnimation = animation;
      await page.waitForChanges();

      return { link, router, animation };
    };

    it('should navigate with the router direction and animation', async () => {
      const { link, router, animation } = await setup('/page');

      const ev = new MouseEvent('click', { bubbles: true, cancelable: true });
      link.dispatchEvent(ev);

      expect(router.push).toHaveBeenCalledWith('/page', 'back', animation);
      expect(ev.defaultPrevented).toBe(true);
    });

    it('should not use the router for a fragment link', async () => {
      const { link, router } = await setup('#section');

      const ev = new MouseEvent('click', { bubbles: true, cancelable: true });
      link.dispatchEvent(ev);

      expect(router.push).not.toHaveBeenCalled();
      expect(ev.defaultPrevented).toBe(false);
    });

    it('should not use the router for an external link', async () => {
      const { link, router } = await setup('https://ionicframework.com');

      const ev = new MouseEvent('click', { bubbles: true, cancelable: true });
      link.dispatchEvent(ev);

      expect(router.push).not.toHaveBeenCalled();
      expect(ev.defaultPrevented).toBe(false);
    });
  });
});
