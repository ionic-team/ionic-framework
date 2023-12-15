import { newSpecPage } from '@stencil/core/testing';

import { Header } from '../../header/header';
import { Toolbar } from '../../toolbar/toolbar';
import { ToolbarTitle } from '../title';

describe('title: a11y', () => {
  it('should add heading level 1 attributes when inside of a landmark', async () => {
    const page = await newSpecPage({
      components: [Header, Toolbar, ToolbarTitle],
      html: `
        <ion-header>
          <ion-toolbar>
            <ion-title>Title</ion-title>
          </ion-toolbar>
        </ion-header>
      `,
    });

    const title = page.body.querySelector('ion-title')!;

    expect(title.getAttribute('role')).toBe('heading');
    expect(title.getAttribute('aria-level')).toBe('1');
  });
  it('should not add heading level 1 attributes when outside of a landmark', async () => {
    const page = await newSpecPage({
      components: [Header, Toolbar, ToolbarTitle],
      html: `
        <ion-title>Title</ion-title>
      `,
    });

    const title = page.body.querySelector('ion-title')!;

    expect(title.hasAttribute('role')).toBe(false);
    expect(title.hasAttribute('aria-level')).toBe(false);
  });
  it('at most one ion-title should have level 1 attributes', async () => {
    const page = await newSpecPage({
      components: [Header, Toolbar, ToolbarTitle],
      html: `
        <ion-header>
          <ion-toolbar>
            <ion-title>Title 1</ion-title>
          </ion-toolbar>
        </ion-header>
        <ion-header>
          <ion-toolbar>
            <ion-title>Title 2</ion-title>
          </ion-toolbar>
        </ion-header>
      `,
    });

    const titles = page.body.querySelectorAll('ion-title');

    expect(titles[0].getAttribute('role')).toBe('heading');
    expect(titles[0].getAttribute('aria-level')).toBe('1');

    expect(titles[1].hasAttribute('role')).toBe(false);
    expect(titles[1].hasAttribute('aria-level')).toBe(false);
  });
  it('should not add level 1 attributes if other level 1 headings exist', async () => {
    const page = await newSpecPage({
      components: [Header, Toolbar, ToolbarTitle],
      html: `
        <h1>Title</h1>
        <ion-header>
          <ion-toolbar>
            <ion-title>Title 1</ion-title>
          </ion-toolbar>
        </ion-header>
      `,
    });

    const title = page.body.querySelector('ion-title')!;

    expect(title.hasAttribute('role')).toBe(false);
    expect(title.hasAttribute('aria-level')).toBe(false);
  });
  it('should not add level 1 attributes if other level 1 attributes exist', async () => {
    const page = await newSpecPage({
      components: [Header, Toolbar, ToolbarTitle],
      html: `
        <div role="heading" aria-level="1">Title</div>
        <ion-header>
          <ion-toolbar>
            <ion-title>Title 1</ion-title>
          </ion-toolbar>
        </ion-header>
      `,
    });

    const title = page.body.querySelector('ion-title')!;

    expect(title.hasAttribute('role')).toBe(false);
    expect(title.hasAttribute('aria-level')).toBe(false);
  });

  it('should have level 1 attributes even if there is a level 1 heading on another page', async () => {
    const page = await newSpecPage({
      components: [Header, Toolbar, ToolbarTitle],
      html: `
        <div class="ion-page">
          <ion-header>
            <ion-toolbar>
              <ion-title>Title 1</ion-title>
            </ion-toolbar>
          </ion-header>
        </div>

        <div class="ion-page">
          <ion-header>
            <ion-toolbar>
              <ion-title>Title 2</ion-title>
            </ion-toolbar>
          </ion-header>
        </div>
      `,
    });

    const pages = page.body.querySelectorAll('.ion-page');

    pages.forEach((page) => {
      const title = page.querySelector('ion-title')!;

      expect(title.getAttribute('role')).toBe('heading');
      expect(title.getAttribute('aria-level')).toBe('1');
    });
  });
});
