import { setMode } from '@stencil/core';
import { newSpecPage } from '@stencil/core/testing';
import { closeSharp } from 'ionicons/icons';

import { config } from '../../../global/config';
import { SelectModal } from '../select-modal';

/**
 * The cancel button only renders an icon when `cancelIcon` is set.
 */
describe('select-modal: cancel icon', () => {
  beforeEach(() => {
    config.reset({});
    setMode(() => 'md');
  });

  const newCancelIcon = async () => {
    const page = await newSpecPage({
      components: [SelectModal],
      html: `<ion-select-modal cancel-icon="true"></ion-select-modal>`,
    });

    return page.body.querySelector('ion-buttons ion-icon')!;
  };

  it('should use the default cancel icon', async () => {
    const cancelIcon = await newCancelIcon();

    expect(cancelIcon.getAttribute('icon')).toBe(closeSharp);
  });

  it('should use the cancel icon set in the config', async () => {
    config.reset({ selectModalCancelIcon: 'custom-cancel-icon' });

    const cancelIcon = await newCancelIcon();

    expect(cancelIcon.getAttribute('icon')).toBe('custom-cancel-icon');
  });
});
