const getMode = jest.fn();
const getElement = jest.fn();

jest.mock('@stencil/core', () => {
  const original = jest.requireActual('@stencil/core');
  return {
    ...original,
    getMode,
    getElement,
  };
});

/**
 * The implementation needs to be mocked before the implementation is imported.
 */
// eslint-disable-next-line import/first
import { getIonTheme, getIonMode } from '../ionic-global';

describe('Ionic Global', () => {
  describe('getIonMode', () => {
    const parentRef = { mode: 'md' };
    const ref = { parentElement: parentRef };

    beforeEach(() => {
      getMode.mockImplementation((ref) => ref.mode ?? parentRef.mode);

      getElement.mockImplementation(() => ({
        closest: () => ({
          getAttribute: () => parentRef.mode,
        }),
      }));
    });

    afterEach(() => {
      getMode.mockReset();
      getElement.mockReset();
    });

    it('should return the mode value of the element reference', () => {
      const ref = { mode: 'ios' };

      getMode.mockImplementation((ref) => ref.mode);

      getElement.mockImplementation(() => ({
        closest: () => ({
          getAttribute: () => ref.mode,
        }),
      }));

      expect(getIonMode(ref)).toBe('ios');
    });

    it('should return the mode value of the closest parent with a valid mode', () => {
      expect(getIonMode(ref)).toBe('md');
    });

    it('should return the default mode if the mode cannot be determined', () => {
      expect(getIonMode()).toBe('md');
    });

    it('should return the default theme if no mode is found', () => {
      const ref = { mode: undefined };
      expect(getIonMode(ref)).toBe('md');
    });
  });

  describe('getIonTheme', () => {
    const parentRef = { mode: 'md' };

    beforeEach(() => {
      getMode.mockImplementation((ref) => ref?.mode ?? parentRef.mode);

      getElement.mockImplementation(() => ({
        closest: () => ({
          getAttribute: () => parentRef.mode,
        }),
      }));
    });

    afterEach(() => {
      getMode.mockReset();
      getElement.mockReset();
    });

    it('should return the theme value of the element reference', () => {
      const ref = { mode: 'ios' };
      expect(getIonTheme(ref)).toBe('ios');
    });

    it('should return the theme value of the closest parent with a valid theme', () => {
      getElement.mockImplementation(() => ({
        closest: () => ({
          getAttribute: () => 'ios',
        }),
      }));

      expect(getIonTheme()).toBe('ios');
    });

    it('should return the default theme if it cannot be determined', () => {
      getElement.mockImplementation(() => ({
        closest: () => ({
          getAttribute: () => null,
        }),
      }));

      expect(getIonTheme()).toBe('md');
    });
  });
});
