import type { ClickController } from '../click-controller';
import { createClickController, getSlottedClickContent } from '../click-controller';

/**
 * The controller clears its slotted click on an animation frame, so the
 * tests drive the frames by hand.
 */
let frames: Array<() => void>;

const flushFrames = () => {
  const batch = frames;
  frames = [];
  batch.forEach((callback) => callback());
};

/**
 * `raf` reads `requestAnimationFrame` off the global at call time, and
 * Stencil's mock window exposes it as a getter, so it has to be replaced on
 * `globalThis` rather than assigned or spied on.
 */
let originalRaf: PropertyDescriptor | undefined;

describe('Click Controller', () => {
  let host: HTMLElement;
  let slotted: HTMLElement;
  let nativeInput: HTMLInputElement;
  let controller: ClickController;

  // The target of every click that was allowed to reach the document.
  let propagated: string[];

  const click = (target: Element) => target.dispatchEvent(new MouseEvent('click', { bubbles: true }));

  const attach = (getNativeInput?: () => HTMLInputElement | undefined) => {
    controller = createClickController(host, getNativeInput);
    host.addEventListener('click', (ev) => controller.handleClickCapture(ev), { capture: true });
  };

  beforeEach(() => {
    frames = [];
    propagated = [];

    originalRaf = Object.getOwnPropertyDescriptor(globalThis, 'requestAnimationFrame');
    Object.defineProperty(globalThis, 'requestAnimationFrame', {
      value: (callback: FrameRequestCallback) => frames.push(() => callback(0)),
      configurable: true,
      writable: true,
    });

    host = document.createElement('div');
    host.id = 'host';

    slotted = document.createElement('div');
    slotted.id = 'slotted';
    slotted.setAttribute('slot', 'start');

    nativeInput = document.createElement('input');
    nativeInput.id = 'native';

    host.append(slotted, nativeInput);
    document.body.appendChild(host);

    document.addEventListener('click', (ev) => propagated.push((ev.target as Element).id));
  });

  afterEach(() => {
    host.remove();
    document.body.innerHTML = '';

    if (originalRaf) {
      Object.defineProperty(globalThis, 'requestAnimationFrame', originalRaf);
    } else {
      delete (globalThis as any).requestAnimationFrame;
    }
  });

  describe('getSlottedClickContent', () => {
    const eventFor = (target: Element) => ({ target } as unknown as Event);

    it('should return the slotted element the click started on', () => {
      expect(getSlottedClickContent(eventFor(slotted), host)).toBe(slotted);
    });

    it('should return the slotted ancestor when a descendant is clicked', () => {
      const nested = document.createElement('span');
      slotted.appendChild(nested);

      expect(getSlottedClickContent(eventFor(nested), host)).toBe(slotted);
    });

    it('should return null when the click did not start on slotted content', () => {
      expect(getSlottedClickContent(eventFor(nativeInput), host)).toBe(null);
    });

    it('should return null when the host itself carries the slot', () => {
      host.setAttribute('slot', 'end');

      expect(getSlottedClickContent(eventFor(host), host)).toBe(null);
    });

    it('should return null for slotted content outside the host', () => {
      const outside = document.createElement('div');
      outside.setAttribute('slot', 'start');
      document.body.appendChild(outside);

      expect(getSlottedClickContent(eventFor(outside), host)).toBe(null);
    });
  });

  /**
   * ion-input and ion-textarea wrap their content in a label pointing at a
   * native control, so the control's click is emitted from the host instead.
   */
  describe('with a native control', () => {
    beforeEach(() => attach(() => nativeInput));

    it('should emit a click on the native control from the host', () => {
      click(nativeInput);

      expect(propagated).toEqual(['host']);
    });

    it('should let a click on slotted content through untouched', () => {
      click(slotted);

      expect(propagated).toEqual(['slotted']);
    });

    it('should not emit the click the label forwards after slotted content', () => {
      click(slotted);
      click(nativeInput);

      expect(propagated).toEqual(['slotted']);
    });

    it('should emit again once the frame after a slotted click has passed', () => {
      click(slotted);
      flushFrames();

      click(nativeInput);

      expect(propagated).toEqual(['slotted', 'host']);
    });

    it('should leave a click on the host alone', () => {
      click(host);

      expect(propagated).toEqual(['host']);
    });
  });

  /**
   * ion-textarea keeps its native control in its shadow root, so its click is
   * retargeted to the host. The mock document doesn't retarget, so the
   * recorded target is still the control.
   */
  describe('with a native control in the shadow root', () => {
    let shadowInput: HTMLInputElement;

    const composedClick = (target: Element) =>
      target.dispatchEvent(new MouseEvent('click', { bubbles: true, composed: true }));

    beforeEach(() => {
      shadowInput = document.createElement('input');
      shadowInput.id = 'shadow-native';
      host.attachShadow({ mode: 'open' }).appendChild(shadowInput);

      attach(() => shadowInput);
    });

    it('should let the native control click through without emitting another', () => {
      composedClick(shadowInput);

      expect(propagated).toEqual(['shadow-native']);
    });

    it('should not emit the click the label forwards after slotted content', () => {
      click(slotted);
      composedClick(shadowInput);

      expect(propagated).toEqual(['slotted']);
    });
  });

  /**
   * ion-select has no labelable control of its own, so the browser
   * forwards to an internal control that re-bubbles targeting the host.
   * That forwarded click is swallowed rather than re-emitted.
   */
  describe('without a native control', () => {
    beforeEach(() => attach());

    it('should let a click on slotted content through untouched', () => {
      click(slotted);

      expect(propagated).toEqual(['slotted']);
    });

    it('should swallow the click that follows slotted content', () => {
      click(slotted);
      click(host);

      expect(propagated).toEqual(['slotted']);
    });

    it('should swallow only the first click that follows slotted content', () => {
      click(slotted);
      click(host);
      click(host);

      expect(propagated).toEqual(['slotted', 'host']);
    });

    it('should let a click through once the frame after a slotted click has passed', () => {
      click(slotted);
      flushFrames();

      click(host);

      expect(propagated).toEqual(['slotted', 'host']);
    });

    it('should leave a click through when no slotted click came first', () => {
      click(host);

      expect(propagated).toEqual(['host']);
    });
  });

  /**
   * ion-textarea uses `delegatesFocus`, so a press on its slotted content can
   * move focus to the native control. The mock document has no focus model, so
   * these don't check where focus ends up.
   */
  describe('focus rejection', () => {
    let slottedButton: HTMLButtonElement;

    const press = (target: Element, button = 0) =>
      target.dispatchEvent(new MouseEvent('mousedown', { bubbles: true, button }));

    const focusFrom = (relatedTarget: Element | null) => ({ relatedTarget } as unknown as FocusEvent);

    beforeEach(() => {
      slottedButton = document.createElement('button');
      slottedButton.setAttribute('slot', 'end');
      host.appendChild(slottedButton);

      attach(() => nativeInput);
      host.addEventListener('mousedown', (ev) => controller.handleMouseDown(ev as MouseEvent));
    });

    it('should reject focus after a press on interactive slotted content', () => {
      press(slottedButton);

      expect(controller.rejectFocus(focusFrom(null))).toBe(true);
    });

    it('should not reject focus after a press on non-interactive slotted content', () => {
      press(slotted);

      expect(controller.rejectFocus(focusFrom(null))).toBe(false);
    });

    it('should not reject focus after a secondary button press', () => {
      press(slottedButton, 2);

      expect(controller.rejectFocus(focusFrom(null))).toBe(false);
    });

    ['click', 'dragstart', 'pointercancel'].forEach((type) => {
      it(`should stop rejecting focus the frame after a ${type}`, () => {
        press(slottedButton);
        document.dispatchEvent(new Event(type));

        expect(controller.rejectFocus(focusFrom(null))).toBe(true);

        flushFrames();

        expect(controller.rejectFocus(focusFrom(null))).toBe(false);
      });
    });

    it('should stop rejecting focus as soon as the rejection is cancelled', () => {
      press(slottedButton);
      controller.cancelFocusRejection();

      expect(controller.rejectFocus(focusFrom(null))).toBe(false);
    });

    it('should return focus to the slotted content it came from', () => {
      const focus = jest.spyOn(slottedButton, 'focus');

      press(slottedButton);
      controller.rejectFocus(focusFrom(slottedButton));

      expect(focus).toHaveBeenCalled();
    });

    it('should not move focus to an element outside the host', () => {
      const outside = document.createElement('button');
      document.body.appendChild(outside);
      const focus = jest.spyOn(outside, 'focus');

      press(slottedButton);
      controller.rejectFocus(focusFrom(outside));

      expect(focus).not.toHaveBeenCalled();
    });
  });
});
