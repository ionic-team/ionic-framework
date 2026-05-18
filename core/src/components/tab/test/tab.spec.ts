import { newSpecPage } from '@stencil/core/testing';

import type { FrameworkDelegate } from '../../../interface';
import { Tab } from '../tab';

const mockDelegate = (attachViewToDom: FrameworkDelegate['attachViewToDom']): FrameworkDelegate => ({
  attachViewToDom,
  removeViewFromDom: jest.fn().mockResolvedValue(undefined),
});

describe('ion-tab: lazy loading', () => {
  it('should attach the component only once across multiple setActive calls', async () => {
    const page = await newSpecPage({
      components: [Tab],
      html: '<ion-tab tab="home" component="ion-content"></ion-tab>',
    });

    const tabEl = page.body.querySelector('ion-tab') as any;
    const attachViewToDom = jest.fn().mockResolvedValue(document.createElement('div'));
    tabEl.delegate = mockDelegate(attachViewToDom);

    await tabEl.setActive();
    await tabEl.setActive();

    expect(attachViewToDom).toHaveBeenCalledTimes(1);
  });

  // TODO(FW-7296): Flip to assert retry once the failed-attach lockout is fixed
  it('documents current behavior: a failed first attach is not retried', async () => {
    const page = await newSpecPage({
      components: [Tab],
      html: '<ion-tab tab="home" component="ion-content"></ion-tab>',
    });

    const tabEl = page.body.querySelector('ion-tab') as any;
    const attachViewToDom = jest.fn().mockRejectedValue(new Error('attach failed'));
    tabEl.delegate = mockDelegate(attachViewToDom);

    await expect(tabEl.setActive()).rejects.toThrow('attach failed');
    await tabEl.setActive();

    expect(attachViewToDom).toHaveBeenCalledTimes(1);
  });
});
