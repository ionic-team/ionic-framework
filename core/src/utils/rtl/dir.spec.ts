// @vitest-environment stencil

import { isRTL } from './dir';

describe('rtl: dir', () => {
  /**
   * Renders the given markup and returns the element with `id="target"`.
   */
  const render = (html: string): Element => {
    document.body.innerHTML = html;

    const target = document.body.querySelector('#target');
    if (target === null) {
      throw new Error('Test markup must contain an element with id="target".');
    }

    return target;
  };

  beforeEach(() => {
    /**
     * Reset to the state of a document that never set a direction, rather than
     * to `ltr`, so that tests relying on the default are not masked.
     */
    document.dir = '';
    document.body.innerHTML = '';
  });

  describe('with a host element', () => {
    it('should use the dir on the element itself', () => {
      expect(isRTL(render('<div id="target" dir="rtl"></div>'))).toBe(true);
      expect(isRTL(render('<div id="target" dir="ltr"></div>'))).toBe(false);
    });

    it('should use the nearest ancestor that declares a dir', () => {
      expect(isRTL(render('<div dir="rtl"><div><div id="target"></div></div></div>'))).toBe(true);
      expect(isRTL(render('<div dir="ltr"><div><div id="target"></div></div></div>'))).toBe(false);
    });

    it('should let an inner dir override an outer one', () => {
      expect(isRTL(render('<div dir="rtl"><div dir="ltr" id="target"></div></div>'))).toBe(false);
      expect(isRTL(render('<div dir="ltr"><div dir="rtl" id="target"></div></div>'))).toBe(true);
    });

    it('should ignore casing', () => {
      expect(isRTL(render('<div id="target" dir="RTL"></div>'))).toBe(true);
      expect(isRTL(render('<div dir="RTL"><div id="target" dir="LTR"></div></div>'))).toBe(false);
    });

    it('should skip values that do not declare a direction', () => {
      /**
       * `dir=""`, `dir="auto"` and unknown values are not used as a direction,
       * so the nearest ancestor that does declare one still wins.
       */
      expect(isRTL(render('<div dir="rtl"><div id="target" dir=""></div></div>'))).toBe(true);
      expect(isRTL(render('<div dir="rtl"><div id="target" dir="auto"></div></div>'))).toBe(true);
      expect(isRTL(render('<div dir="rtl"><div id="target" dir="sideways"></div></div>'))).toBe(true);
    });
  });

  describe('falling back to the document', () => {
    it('should use the document dir when no ancestor declares one', () => {
      document.dir = 'rtl';
      expect(isRTL(render('<div><div id="target"></div></div>'))).toBe(true);

      document.dir = 'ltr';
      expect(isRTL(render('<div><div id="target"></div></div>'))).toBe(false);
    });

    it('should use the document dir for a detached element', () => {
      document.dir = 'rtl';
      expect(isRTL(document.createElement('div'))).toBe(true);
    });

    it('should default to ltr when no dir is set anywhere', () => {
      // Ensure the default is actually being tested rather than a
      // value left behind by another test.
      expect(document.dir).toBe('');

      expect(isRTL()).toBe(false);
      expect(isRTL(null)).toBe(false);
      expect(isRTL(document.createElement('div'))).toBe(false);
      expect(isRTL(render('<div><div id="target"></div></div>'))).toBe(false);
    });
  });

  describe('without a host element', () => {
    it('should use the document dir', () => {
      document.dir = 'rtl';
      expect(isRTL()).toBe(true);

      document.dir = 'ltr';
      expect(isRTL()).toBe(false);
    });
  });
});
