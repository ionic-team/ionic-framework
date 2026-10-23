import { newSpecPage } from '@stencil/core/testing';

import { config } from '../../../global/config';
import { ToolbarTitle } from '../../title/title';
import { Toolbar } from '../../toolbar/toolbar';
import { Header } from '../header';
import { createHeaderIndex, getTitleOrigin, scaleLargeTitles } from '../header.utils';

describe('header: condense', () => {
  afterEach(() => {
    config.reset({});
  });

  it('should condense when the title size is large', async () => {
    const page = await newSpecPage({
      components: [Header, ToolbarTitle],
      html: `<ion-header scroll-effect="condense"><ion-title size="large">Title</ion-title></ion-header>`,
    });

    expect(page.root!.classList.contains('header-collapse-condense')).toBe(true);
  });

  it('should condense when the config sets a large title size', async () => {
    config.reset({
      customTheme: { config: { components: { IonTitle: { size: 'large' } } } },
    });

    const page = await newSpecPage({
      components: [Header, ToolbarTitle],
      html: `<ion-header scroll-effect="condense"><ion-title>Title</ion-title></ion-header>`,
    });

    expect(page.root!.classList.contains('header-collapse-condense')).toBe(true);
  });

  it('should hide the header when the title is not large', async () => {
    const page = await newSpecPage({
      components: [Header, ToolbarTitle],
      html: `<ion-header scroll-effect="condense"><ion-title>Title</ion-title></ion-header>`,
    });

    expect(page.root!.classList.contains('header-collapse-condense')).toBe(false);
    expect(page.root!.classList.contains('header-collapse-condense-hidden')).toBe(true);
  });
});

describe('header: large title origin', () => {
  it.each([
    ['start', 'ltr', 'left'],
    ['start', 'rtl', 'right'],
    ['end', 'ltr', 'right'],
    ['end', 'rtl', 'left'],
    ['left', 'ltr', 'left'],
    ['left', 'rtl', 'left'],
    ['right', 'ltr', 'right'],
    ['right', 'rtl', 'right'],
    ['center', 'ltr', 'center'],
    ['center', 'rtl', 'center'],
    ['-webkit-center', 'ltr', 'center'],
  ])('should grow a title aligned to %s in %s from the %s', (textAlign, direction, origin) => {
    expect(getTitleOrigin(textAlign, direction)).toBe(origin);
  });

  it('should set an origin when the title becomes large after the header loads', async () => {
    const page = await newSpecPage({
      components: [Header, Toolbar, ToolbarTitle],
      html: `<ion-header><ion-toolbar><ion-title>Title</ion-title></ion-toolbar></ion-header>`,
    });

    const headerIndex = createHeaderIndex(page.root)!;
    const title = page.body.querySelector('ion-title')!;

    title.size = 'large';
    await page.waitForChanges();

    scaleLargeTitles(headerIndex.toolbars, 1.1);

    const innerTitle = title.shadowRoot!.querySelector<HTMLElement>('.toolbar-title')!;
    expect(innerTitle.style.transformOrigin).not.toContain('undefined');
  });
});
