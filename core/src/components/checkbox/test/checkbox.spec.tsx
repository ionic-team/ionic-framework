import { h } from '@stencil/core';
import { newSpecPage } from '@stencil/core/testing';

import { Checkbox } from '../checkbox';

describe('ion-checkbox', () => {
  it('click event is triggered once', async () => {
    const mockOnClick = jest.fn();

    const page = await newSpecPage({
      components: [Checkbox],
      template: () => <ion-checkbox onClick={mockOnClick}></ion-checkbox>,
    });

    const checkbox = page.body.querySelector('ion-checkbox');

    await checkbox.click();

    expect(mockOnClick).toHaveBeenCalledTimes(1);
  });
});
