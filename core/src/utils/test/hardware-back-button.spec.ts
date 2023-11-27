import type { BackButtonEvent } from '../../../src/interface';
import { startHardwareBackButton } from '../hardware-back-button';

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
});

const dispatchBackButtonEvent = () => {
  const ev = new Event('backbutton');
  document.dispatchEvent(ev);
};
