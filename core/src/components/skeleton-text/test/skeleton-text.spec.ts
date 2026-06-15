import { newSpecPage } from '@stencil/core/testing';

import { config } from '../../../global/config';
import { SkeletonText } from '../skeleton-text';

describe('ion-skeleton-text: class', () => {
  beforeEach(() => config.reset({}));
  afterEach(() => config.reset({}));

  it('adds skeleton-text-animated when animated and animations are enabled', async () => {
    const page = await newSpecPage({
      components: [SkeletonText],
      html: `<ion-skeleton-text animated></ion-skeleton-text>`,
    });

    const skeleton = page.body.querySelector('ion-skeleton-text')!;
    expect(skeleton.classList.contains('skeleton-text-animated')).toBe(true);
  });

  it('does not animate when the global animated config is false', async () => {
    config.reset({ animated: false });

    const page = await newSpecPage({
      components: [SkeletonText],
      html: `<ion-skeleton-text animated></ion-skeleton-text>`,
    });

    const skeleton = page.body.querySelector('ion-skeleton-text')!;
    expect(skeleton.classList.contains('skeleton-text-animated')).toBe(false);
  });
});
