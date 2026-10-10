import { newSpecPage } from '@stencil/core/testing';

import { config } from '../../../global/config';
import { ToolbarTitle } from '../../title/title';
import { Header } from '../header';

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
