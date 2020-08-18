import { copyVisualViewport, setKeyboardClose, setKeyboardOpen, keyboardDidClose, keyboardDidOpen, keyboardDidResize, resetKeyboardAssist, startKeyboardAssist, trackViewportChanges, KEYBOARD_DID_OPEN, KEYBOARD_DID_CLOSE } from '../keyboard';

const mockVisualViewport = (win: Window, visualViewport: any = { width: 320, height: 568 }, layoutViewport = { innerWidth: 320, innerHeight: 568 }): any => {
  win.visualViewport = {
    width: 320,
    height: 568,
    offsetTop: 0,
    offsetLeft: 0,
    pageTop: 0,
    pageLeft: 0,
    scale: 1,
    onresize: undefined,
    onscroll: undefined
  };

  win.visualViewport = Object.assign(win.visualViewport, visualViewport);
  win = Object.assign(win, layoutViewport);
  win.dispatchEvent = jest.fn(() => {});

  trackViewportChanges(win);

  return win;
}

const resizeVisualViewport = (win: Window, visualViewport: any = {}) => {
  win.visualViewport = Object.assign(win.visualViewport, visualViewport);

  if (win.visualViewport.onresize) {
    win.visualViewport.onresize();
  } else {
    trackViewportChanges(win);
  }
}

const resizeLayoutViewport = (win: Window, layoutViewport: any = {}) => {
  win = Object.assign(win, { innerWidth: layoutViewport.width, innerHeight: layoutViewport.height });
}

describe('Keyboard Assist Tests', () => {

  describe('copyVisualViewport()', () => {
    it('should properly copy the visual viewport', () => {
      const visualViewport = {
        width: 100,
        height: 200,
        offsetTop: 5,
        offsetLeft: 10,
        pageTop: 0,
        pageLeft: 0,
        scale: 2
      };

      const copiedViewport = copyVisualViewport(visualViewport);

      visualViewport.width = 400;
      visualViewport.height = 800;
      visualViewport.scale = 3;
      visualViewport.offsetTop = 0;

      expect(copiedViewport.width).toEqual(100);
      expect(copiedViewport.height).toEqual(200);
      expect(copiedViewport.scale).toEqual(2);
      expect(copiedViewport.offsetTop).toEqual(5);
    });
  });

  describe('setKeyboardOpen()', () => {
    it('should dispatch the keyboard open event on the window', () => {
      window.dispatchEvent = jest.fn(() => {});

      setKeyboardOpen(window);

      expect(window.dispatchEvent.mock.calls.length).toEqual(1);
      expect(window.dispatchEvent.mock.calls[0][0].type).toEqual(KEYBOARD_DID_OPEN);
    });
  });

  describe('setKeyboardClose()', () => {
    it('should dispatch the keyboard close event on the window', () => {
      window.dispatchEvent = jest.fn(() => {});

      setKeyboardClose(window);

      expect(window.dispatchEvent.mock.calls.length).toEqual(1);
      expect(window.dispatchEvent.mock.calls[0][0].type).toEqual(KEYBOARD_DID_CLOSE);
    });
  });

  describe('keyboardDidOpen()', () => {
    beforeEach(() => {
      resetKeyboardAssist(window);
      mockVisualViewport(window);
    });

    it('should return true when visual viewport height < layout viewport height and meets or exceeds the keyboard threshold', () => {
      resizeVisualViewport(window, { height: 200 });

      expect(keyboardDidOpen(window)).toEqual(true);
    });

    it('should return true if the layout and visual viewports resize', () => {
      resizeLayoutViewport(window, { width: 320, height: 300 });
      resizeVisualViewport(window, { width: 320, height: 300 });

      expect(keyboardDidOpen(window)).toEqual(true);
    });

    it('should return false when visual viewport height < layout viewport heigh but does not meet the keyboard threshold', () => {
      resizeVisualViewport(window, { height: 500 });

      expect(keyboardDidOpen(window)).toEqual(false);
    });

    it('should return false on orientation change', () => {
      resizeVisualViewport(window, { width: 320, height: 250 });
      resizeVisualViewport(window, { width: 250, height: 320 });

      expect(keyboardDidOpen(window)).toEqual(false);
    });

    it('should return false when both the visual and layout viewports change', () => {
      resizeVisualViewport(window, { width: 250, height: 320 }, { innerWidth: 250, innerHeight: 320 });

      expect(keyboardDidOpen(window)).toEqual(false);
    });

    it('should return true when the keyboard shows even if the user is zoomed in', () => {
      // User zooms in
      resizeVisualViewport(window, { width: 160, height: 284, scale: 2 });

      // User taps input and keyboard appears
      resizeVisualViewport(window, { width: 160, height: 184, scale: 2 });

      expect(keyboardDidOpen(window)).toEqual(true);
    });
  });

  describe('keyboardDidClose()', () => {
    beforeEach(() => {
      resetKeyboardAssist(window);
      mockVisualViewport(window);
    });

    it('should return false when keyboard is not open', () => {
      expect(keyboardDidClose(window)).toEqual(false);
    });

    it('should return false when keyboard is open but visual viewport !== layout viewport', () => {
      resizeVisualViewport(window, { width: 320, height: 250 });

      setKeyboardOpen(window);

      expect(keyboardDidClose(window)).toEqual(false);
    });

    it('should return true when keyboard is open and viewport === layout viewport', () => {
      resizeVisualViewport(window, { width: 320, height: 250 });

      setKeyboardOpen(window);

      resizeVisualViewport(window, { width: 320, height: 568 });

      expect(keyboardDidClose(window)).toEqual(true);
    });

    it('should return false on orientation change', () => {
      resizeVisualViewport(window, { width: 320, height: 250 });

      setKeyboardOpen(window);

      resizeVisualViewport(window, { width: 250, height: 320 });

      expect(keyboardDidClose(window)).toEqual(false);
    });
  });

  describe('keyboardDidResize()', () => {
    it('should return true when the keyboard is open but did not close', () => {
      mockVisualViewport(window, { width: 250, height: 320 });
      setKeyboardOpen(window);

      mockVisualViewport(window, { width: 250, height: 300 });

      expect(keyboardDidResize(window)).toEqual(true);
    });

    it('should return false when the keyboard is not open', () => {
      mockVisualViewport(window);

      expect(keyboardDidResize(window)).toEqual(false);
    });

    it('should return false when the keyboard has closed', () => {
      mockVisualViewport(window, { width: 320, height: 250 });
      setKeyboardOpen(window);
      setKeyboardClose(window);

      expect(keyboardDidResize(window)).toEqual(false);
    });
  });
});

describe('Keyboard Assist Integration', () => {
  beforeEach(() => {
    resetKeyboardAssist(window);
    mockVisualViewport(window);
    startKeyboardAssist(window);
  });

  it('should properly set the keyboard to be open', () => {
    resizeVisualViewport(window, { width: 320, height: 350 });

    expect(window.dispatchEvent.mock.calls.length).toEqual(1);
    expect(window.dispatchEvent.mock.calls[0][0].type).toEqual(KEYBOARD_DID_OPEN);
  });

  it('should properly set the keyboard to be closed', () => {
    resizeVisualViewport(window, { width: 320, height: 350 });
    resizeVisualViewport(window, { width: 320, height: 568 });

    expect(window.dispatchEvent.mock.calls.length).toEqual(2);
    expect(window.dispatchEvent.mock.calls[1][0].type).toEqual(KEYBOARD_DID_CLOSE);
  });

  it('should properly set the keyboard to be resized', () => {
    resizeVisualViewport(window, { width: 320, height: 350 });
    resizeVisualViewport(window, { width: 320, height: 360 });

    expect(window.dispatchEvent.mock.calls.length).toEqual(2);
    expect(window.dispatchEvent.mock.calls[0][0].type).toEqual(KEYBOARD_DID_OPEN);
    expect(window.dispatchEvent.mock.calls[1][0].type).toEqual(KEYBOARD_DID_OPEN);
  });

  it('should not set keyboard open on orientation change', () => {
    resizeVisualViewport(window, { width: 568, height: 320 });
    expect(window.dispatchEvent.mock.calls.length).toEqual(0);
  });
});
