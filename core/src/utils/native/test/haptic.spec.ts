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
  let haptics: {
    impact: jest.Mock;
    notification: jest.Mock;
    selectionStart: jest.Mock;
    selectionChanged: jest.Mock;
    selectionEnd: jest.Mock;
  };

  beforeEach(() => {
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
    delete (window as any).Capacitor;
    config.reset({});
  });

  it('should trigger haptics by default', () => {
    hapticSelection();

    expect(haptics.impact).toHaveBeenCalledTimes(1);
  });

  it('should not trigger haptics when the haptics config is false', () => {
    config.reset({ haptics: false });

    hapticSelection();
    hapticSelectionStart();
    hapticSelectionChanged();
    hapticSelectionEnd();
    hapticImpact({ style: ImpactStyle.Heavy });
    hapticNotification({ type: NotificationType.Success });

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

    hapticSelection();

    expect(haptics.impact).toHaveBeenCalledTimes(1);
  });
});
