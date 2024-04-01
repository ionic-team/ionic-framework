import { h } from '@stencil/core';
import { newSpecPage } from '@stencil/core/testing';

import { ActionSheet } from '../../action-sheet';

describe('action sheet: htmlAttributes inheritance', () => {
  it('should correctly inherit attributes on host', async () => {
    const page = await newSpecPage({
      components: [ActionSheet],
      template: () => (
        <ion-action-sheet
          htmlAttributes={{
            'data-testid':
              'basic-action-sheet',
          }}
          overlayIndex={1}
        ></ion-action-sheet>
      ),
    });

    const actionSheet =
      page.body.querySelector(
        'ion-action-sheet'
      )!;

    await expect(
      actionSheet.getAttribute(
        'data-testid'
      )
    ).toBe('basic-action-sheet');
  });
});
