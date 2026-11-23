import { config } from '@global/config';

import {
  ImpactStyle,
  NotificationType,
  hapticAvailable,
  hapticImpact,
  hapticNotification,
  hapticSelection,
  hapticSelectionChanged,
  hapticSelectionEnd,
  hapticSelectionStart,
} from '../haptic';

describe('haptics', () => {
  let el: HTMLElement;
  let haptics: {
    impact: jest.Mock;
    notification: jest.Mock;
    selectionStart: jest.Mock;
    selectionChanged: jest.Mock;
    selectionEnd: jest.Mock;
  };

  beforeEach(() => {
    el = document.createElement('ion-toggle');
    document.body.appendChild(el);
    haptics = {
      impact: jest.fn(),
      notification: jest.fn(),
      selectionStart: jest.fn(),
      selectionChanged: jest.fn(),
      selectionEnd: jest.fn(),
    };
    (window as any).Capacitor = {
      isPluginAvailable: (name: string) => name === 'Haptics',
      getPlatform: () => 'ios',
      Plugins: { Haptics: haptics },
    };
    config.reset({});
  });

  afterEach(() => {
    el.remove();
    delete (window as any).Capacitor;
    config.reset({});
  });

  it('should trigger haptics by default', () => {
    hapticSelection(el);

    expect(haptics.impact).toHaveBeenCalledTimes(1);
  });

  it('should not trigger haptics when the haptics config is false', () => {
    config.reset({ haptics: false });

    hapticSelection(el);
    hapticSelectionStart(el);
    hapticSelectionChanged(el);
    hapticSelectionEnd(el);
    hapticImpact(el, { style: ImpactStyle.Heavy });
    hapticNotification(el, { type: NotificationType.Success });

    Object.values(haptics).forEach((method) => expect(method).not.toHaveBeenCalled());
  });

  it('should report haptics as unavailable when the haptics config is false', () => {
    config.reset({ haptics: false });

    expect(hapticAvailable()).toBe(false);
  });

  it('should report haptics as unavailable when the haptics config is the string "false"', () => {
    config.reset({ haptics: 'false' as any });

    expect(hapticAvailable()).toBe(false);
  });

  it('should trigger haptics when the haptics config is true', () => {
    config.reset({ haptics: true });

    hapticSelection(el);

    expect(haptics.impact).toHaveBeenCalledTimes(1);
  });

  describe('ionHaptic event', () => {
    it('should dispatch ionHaptic when the haptics config is false', () => {
      config.reset({ haptics: false });
      const listener = jest.fn();
      el.addEventListener('ionHaptic', listener);

      hapticSelection(el);

      expect(listener).toHaveBeenCalledTimes(1);
      expect(haptics.impact).not.toHaveBeenCalled();
    });

    it('should dispatch ionHaptic when no haptic engine is available', () => {
      delete (window as any).Capacitor;
      const listener = jest.fn();
      el.addEventListener('ionHaptic', listener);

      hapticSelection(el);

      expect(listener).toHaveBeenCalledTimes(1);
    });

    it('should describe the haptic in the event detail', () => {
      const details: unknown[] = [];
      el.addEventListener('ionHaptic', (ev) => details.push((ev as CustomEvent).detail));

      hapticSelectionStart(el);
      hapticSelectionChanged(el);
      hapticSelectionEnd(el);
      hapticImpact(el, { style: ImpactStyle.Heavy });
      hapticNotification(el, { type: NotificationType.Warning });

      expect(details).toEqual([
        { type: 'selectionStart' },
        { type: 'selectionChanged' },
        { type: 'selectionEnd' },
        { type: 'impact', style: 'HEAVY' },
        { type: 'notification', notificationType: 'WARNING' },
      ]);
    });

    it('should skip the built-in haptic when the event is canceled', () => {
      el.addEventListener('ionHaptic', (ev) => ev.preventDefault());

      hapticSelection(el);

      expect(haptics.impact).not.toHaveBeenCalled();
    });

    it('should dispatch a bubbling ionHaptic event from the source element', () => {
      const listener = jest.fn();
      document.addEventListener('ionHaptic', listener);

      hapticSelection(el);

      document.removeEventListener('ionHaptic', listener);
      expect(listener).toHaveBeenCalledTimes(1);
      const ev = listener.mock.calls[0][0] as CustomEvent;
      expect(ev.target).toBe(el);
      expect(ev.detail).toEqual({ type: 'selection' });
    });
  });
});
