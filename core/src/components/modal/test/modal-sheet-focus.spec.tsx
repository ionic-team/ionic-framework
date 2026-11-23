import { h } from '@stencil/core';
import { newSpecPage } from '@stencil/core/testing';

import { Modal } from '../modal';

/**
 * Regression tests for ionic-team/ionic-framework#31757: two sheet modals
 * presented back to back overflow the call stack.
 *
 * When the focus trap moves focus between the sheets, the covered sheet's
 * `onModalFocus` redirected focus to its own drag handle, the trap moved
 * focus back again, and the two ping-ponged until the stack overflowed.
 * Only the topmost presented modal may redirect focus to its handle.
 *
 * The `overlay-hidden` class is removed from both hosts to simulate
 * presentation (`present()` removes it); the spec harness does not run the
 * full presentation flow.
 */
describe('modal sheet focus', () => {
  const setup = async () => {
    const page = await newSpecPage({
      components: [Modal],
      template: () => (
        <div>
          <ion-modal breakpoints={[0, 0.5, 1]} initialBreakpoint={0.5} handleBehavior="cycle" overlayIndex={1} />
          <ion-modal breakpoints={[0, 0.5, 1]} initialBreakpoint={0.5} handleBehavior="cycle" overlayIndex={2} />
        </div>
      ),
    });
    const [first, second] = Array.from(page.body.querySelectorAll('ion-modal'));
    // Simulate presentation: present() removes `overlay-hidden`, which is
    // what makes getPresentedOverlay() count a modal as presented.
    first.classList.remove('overlay-hidden');
    second.classList.remove('overlay-hidden');
    const firstHandle = first.shadowRoot!.querySelector('.modal-handle') as HTMLElement;
    const secondHandle = second.shadowRoot!.querySelector('.modal-handle') as HTMLElement;
    const focusFirstHandle = jest.spyOn(firstHandle, 'focus');
    const focusSecondHandle = jest.spyOn(secondHandle, 'focus');

    return { first, second, focusFirstHandle, focusSecondHandle };
  };

  it('should not redirect focus to the covered sheet modal handle', async () => {
    const { first, focusFirstHandle } = await setup();

    first.dispatchEvent(new FocusEvent('focus'));

    expect(focusFirstHandle).not.toHaveBeenCalled();
  });

  it('should still redirect focus to the topmost sheet modal handle', async () => {
    const { second, focusSecondHandle } = await setup();

    second.dispatchEvent(new FocusEvent('focus'));

    expect(focusSecondHandle).toHaveBeenCalled();
  });
});
