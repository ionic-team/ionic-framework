// @vitest-environment stencil

import type { BackButtonEvent } from '../../../src/interface';
import { startHardwareBackButton } from '../hardware-back-button';
import { config } from '../../global/config';
import { win } from '@utils/browser';

describe('Hardware Back Button', () => {
  beforeEach(() => startHardwareBackButton());
  it('should call handler', () => {
    const cbSpy = vi.fn();
    document.addEventListener(
      'ionBackButton',
      (ev) => {
        (ev as BackButtonEvent).detail.register(0, cbSpy);
      },
      { once: true }
    );

    dispatchBackButtonEvent();
    expect(cbSpy).toHaveBeenCalled();
  });

  it('should call handlers in order of priority', () => {
    const cbSpy = vi.fn();
    const cbSpyTwo = vi.fn();
    document.addEventListener(
      'ionBackButton',
      (ev) => {
        (ev as BackButtonEvent).detail.register(100, cbSpy);
        (ev as BackButtonEvent).detail.register(99, cbSpyTwo);
      },
      { once: true }
    );

    dispatchBackButtonEvent();
    expect(cbSpy).toHaveBeenCalled();
    expect(cbSpyTwo).not.toHaveBeenCalled();
  });

  it('should only call last handler to be added for handlers with same priority', () => {
    const cbSpy = vi.fn();
    const cbSpyTwo = vi.fn();
    document.addEventListener(
      'ionBackButton',
      (ev) => {
        (ev as BackButtonEvent).detail.register(100, cbSpy);
        (ev as BackButtonEvent).detail.register(100, cbSpyTwo);
      },
      { once: true }
    );

    dispatchBackButtonEvent();
    expect(cbSpy).not.toHaveBeenCalled();
    expect(cbSpyTwo).toHaveBeenCalled();
  });

  it('should call multiple callbacks', () => {
    const cbSpy = (processNextHandler: () => void) => {
      processNextHandler();
    };
    const cbSpyTwo = vi.fn();
    document.addEventListener(
      'ionBackButton',
      (ev) => {
        (ev as BackButtonEvent).detail.register(100, cbSpy);
        (ev as BackButtonEvent).detail.register(99, cbSpyTwo);
      },
      { once: true }
    );

    dispatchBackButtonEvent();
    expect(cbSpyTwo).toHaveBeenCalled();
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

    const cbSpy = vi.fn();
    document.addEventListener('ionBackButton', cbSpy);

    // Call onclose on Ionic's actual instance of CloseWatcher (the one `new`'d by
    // production code), not a fresh unrelated object from calling the mock again.
    mockAPI.mock.results[0].value.onclose();

    expect(cbSpy).toHaveBeenCalled();
  });
});

const mockCloseWatcher = () => {
  // A regular (non-arrow) function that returns an object works correctly whether
  // the mock is invoked with `new` (production code) or as a plain call (this test
  // file) - arrow functions can never be used as constructors, and `mockReturnValue`
  // isn't supported for constructor-style mocks.
  const mockCloseWatcher = vi.fn().mockImplementation(function () {
    return {
      requestClose: () => null,
      close: () => null,
      destroy: () => null,
      oncancel: () => null,
      onclose: () => null,
    };
  });
  (win as any).CloseWatcher = mockCloseWatcher;

  return mockCloseWatcher;
};

const dispatchBackButtonEvent = () => {
  const ev = new Event('backbutton');
  document.dispatchEvent(ev);
};
