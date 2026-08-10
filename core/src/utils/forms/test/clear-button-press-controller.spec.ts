import { createClearButtonPressController } from '../clear-button-press-controller';

/**
 * jsdom does not implement `PointerEvent`, but the controller only reads
 * `button` and calls `preventDefault`, both of which `MouseEvent` provides.
 */
const pointerEvent = (type: string, button = 0) =>
  new MouseEvent(type, { button, bubbles: true, cancelable: true }) as unknown as PointerEvent;

describe('Clear Button Press Controller', () => {
  it('should mark a primary press as in flight', () => {
    const onPressChange = jest.fn();
    const controller = createClearButtonPressController(onPressChange);

    controller.onPointerDown(pointerEvent('pointerdown'));

    expect(onPressChange).toHaveBeenCalledWith(true);
  });

  it('should prevent the default press behavior that blurs the field', () => {
    const controller = createClearButtonPressController(jest.fn());
    const ev = pointerEvent('pointerdown');

    controller.onPointerDown(ev);

    expect(ev.defaultPrevented).toBe(true);
  });

  it('should ignore a non-primary press, which produces no click', () => {
    const onPressChange = jest.fn();
    const controller = createClearButtonPressController(onPressChange);

    controller.onPointerDown(pointerEvent('pointerdown', 2));
    document.dispatchEvent(pointerEvent('click'));

    expect(onPressChange).not.toHaveBeenCalled();
  });

  it('should release the press once the click it produced has dispatched', () => {
    const onPressChange = jest.fn();
    const controller = createClearButtonPressController(onPressChange);

    controller.onPointerDown(pointerEvent('pointerdown'));
    document.dispatchEvent(pointerEvent('click'));

    expect(onPressChange).toHaveBeenLastCalledWith(false);
  });

  it('should release an abandoned press', () => {
    const onPressChange = jest.fn();
    const controller = createClearButtonPressController(onPressChange);

    controller.onPointerDown(pointerEvent('pointerdown'));
    controller.release();

    expect(onPressChange).toHaveBeenLastCalledWith(false);
  });

  it('should not react to clicks elsewhere once the press has been released', () => {
    const onPressChange = jest.fn();
    const controller = createClearButtonPressController(onPressChange);

    controller.onPointerDown(pointerEvent('pointerdown'));
    controller.release();
    onPressChange.mockClear();

    document.dispatchEvent(pointerEvent('click'));

    expect(onPressChange).not.toHaveBeenCalled();
  });

  it('should track a second press on the same controller', () => {
    const onPressChange = jest.fn();
    const controller = createClearButtonPressController(onPressChange);

    controller.onPointerDown(pointerEvent('pointerdown'));
    controller.release();

    controller.onPointerDown(pointerEvent('pointerdown'));
    expect(onPressChange).toHaveBeenLastCalledWith(true);

    document.dispatchEvent(pointerEvent('click'));
    expect(onPressChange).toHaveBeenLastCalledWith(false);
  });

  it('should stop tracking a pending press when destroyed', () => {
    const onPressChange = jest.fn();
    const controller = createClearButtonPressController(onPressChange);

    controller.onPointerDown(pointerEvent('pointerdown'));
    controller.destroy();

    expect(onPressChange).toHaveBeenLastCalledWith(false);

    onPressChange.mockClear();
    document.dispatchEvent(pointerEvent('click'));

    expect(onPressChange).not.toHaveBeenCalled();
  });

  it('should stay usable after being destroyed, since the host can reconnect', () => {
    const onPressChange = jest.fn();
    const controller = createClearButtonPressController(onPressChange);

    controller.destroy();

    controller.onPointerDown(pointerEvent('pointerdown'));
    expect(onPressChange).toHaveBeenLastCalledWith(true);

    document.dispatchEvent(pointerEvent('click'));
    expect(onPressChange).toHaveBeenLastCalledWith(false);
  });
});
