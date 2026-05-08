import type { BackButtonEvent } from '../../../src/interface';
import { startHardwareBackButton } from '../hardware-back-button';
import { config } from '../../global/config';
import { win } from '@utils/browser';

describe('Hardware Back Button', () => {
  beforeEach(() => startHardwareBackButton());
  it('should call handler', () => {
    const cbSpy = jest.fn();
    document.addEventListener('ionBackButton', (ev) => {
      (ev as BackButtonEvent).detail.register(0, cbSpy);
    });

    dispatchBackButtonEvent();
    expect(cbSpy).toHaveBeenCalled();
  });

  it('should call handlers in order of priority', () => {
    const cbSpy = jest.fn();
    const cbSpyTwo = jest.fn();
    document.addEventListener('ionBackButton', (ev) => {
      (ev as BackButtonEvent).detail.register(100, cbSpy);
      (ev as BackButtonEvent).detail.register(99, cbSpyTwo);
    });

    dispatchBackButtonEvent();
    expect(cbSpy).toHaveBeenCalled();
    expect(cbSpyTwo).not.toHaveBeenCalled();
  });

  it('should only call last handler to be added for handlers with same priority', () => {
    const cbSpy = jest.fn();
    const cbSpyTwo = jest.fn();
    document.addEventListener('ionBackButton', (ev) => {
      (ev as BackButtonEvent).detail.register(100, cbSpy);
      (ev as BackButtonEvent).detail.register(100, cbSpyTwo);
    });

    dispatchBackButtonEvent();
    expect(cbSpy).not.toHaveBeenCalled();
    expect(cbSpyTwo).toHaveBeenCalled();
  });

  it('should call multiple callbacks', () => {
    const cbSpy = (processNextHandler: () => void) => {
      processNextHandler();
    };
    const cbSpyTwo = jest.fn();
    document.addEventListener('ionBackButton', (ev) => {
      (ev as BackButtonEvent).detail.register(100, cbSpy);
      (ev as BackButtonEvent).detail.register(99, cbSpyTwo);
    });

    dispatchBackButtonEvent();
    expect(cbSpyTwo).toHaveBeenCalled();
  });

  it('should fall back to history.back() when no handlers are registered', () => {
    const historyBackSpy = jest.fn();
    const originalBack = win?.history?.back;
    if (win?.history) {
      win.history.back = historyBackSpy;
    }

    // Don't register any ionBackButton handlers
    dispatchBackButtonEvent();

    expect(historyBackSpy).toHaveBeenCalled();

    // Restore original
    if (win?.history && originalBack) {
      win.history.back = originalBack;
    }
  });

  it('should not call history.back() when a handler is registered', () => {
    const historyBackSpy = jest.fn();
    const originalBack = win?.history?.back;
    if (win?.history) {
      win.history.back = historyBackSpy;
    }

    const cbSpy = jest.fn();
    document.addEventListener('ionBackButton', (ev) => {
      (ev as BackButtonEvent).detail.register(0, cbSpy);
    });

    dispatchBackButtonEvent();

    expect(cbSpy).toHaveBeenCalled();
    expect(historyBackSpy).not.toHaveBeenCalled();

    // Restore original
    if (win?.history && originalBack) {
      win.history.back = originalBack;
    }
  });
});

describe('Experimental Close Watcher', () => {
  test('should not use the Close Watcher API when available', () => {
    const mockAPI = mockCloseWatcher();

    config.reset({ experimentalCloseWatcher: false });

    startHardwareBackButton();

    expect(mockAPI.mock.calls).toHaveLength(0);
  });
  test('should use the Close Watcher API when available', () => {
    const mockAPI = mockCloseWatcher();

    config.reset({ experimentalCloseWatcher: true });

    startHardwareBackButton();

    expect(mockAPI.mock.calls).toHaveLength(1);
  });
  test('Close Watcher should dispatch ionBackButton events', () => {
    const mockAPI = mockCloseWatcher();

    config.reset({ experimentalCloseWatcher: true });

    startHardwareBackButton();

    const cbSpy = jest.fn();
    document.addEventListener('ionBackButton', cbSpy);

    // Call onclose on Ionic's instance of CloseWatcher
    mockAPI.getMockImplementation()!().onclose();

    expect(cbSpy).toHaveBeenCalled();
  });
});

const mockCloseWatcher = () => {
  const mockCloseWatcher = jest.fn();
  mockCloseWatcher.mockReturnValue({
    requestClose: () => null,
    close: () => null,
    destroy: () => null,
    oncancel: () => null,
    onclose: () => null,
  });
  (win as any).CloseWatcher = mockCloseWatcher;

  return mockCloseWatcher;
};

const dispatchBackButtonEvent = () => {
  const ev = new Event('backbutton');
  document.dispatchEvent(ev);
};
