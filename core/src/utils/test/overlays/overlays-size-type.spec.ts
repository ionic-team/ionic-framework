import { getOverlaySizeType } from '../../overlays';

describe('overlays: getOverlaySizeType', () => {
  it('should return fullscreen for a value that spans the viewport', () => {
    expect(getOverlaySizeType('100%')).toBe('fullscreen');
    expect(getOverlaySizeType('100vw')).toBe('fullscreen');
    expect(getOverlaySizeType('100vh')).toBe('fullscreen');
    expect(getOverlaySizeType('100dvw')).toBe('fullscreen');
    expect(getOverlaySizeType('100dvh')).toBe('fullscreen');
    expect(getOverlaySizeType('100svw')).toBe('fullscreen');
    expect(getOverlaySizeType('100svh')).toBe('fullscreen');
  });

  // getPropertyValue returns an empty string for a property that was never
  // set, and an overlay without an override spans the viewport.
  it('should return fullscreen when the property is unset', () => {
    expect(getOverlaySizeType('')).toBe('fullscreen');
  });

  it('should return content for a value that sizes to the content', () => {
    expect(getOverlaySizeType('auto')).toBe('content');
    expect(getOverlaySizeType('fit-content')).toBe('content');
    expect(getOverlaySizeType('min-content')).toBe('content');
    expect(getOverlaySizeType('max-content')).toBe('content');
  });

  it('should return content for a vendor prefixed value', () => {
    expect(getOverlaySizeType('-moz-fit-content')).toBe('content');
    expect(getOverlaySizeType('-webkit-fit-content')).toBe('content');
  });

  // CSS keywords are case-insensitive, while a custom property keeps the
  // case it was authored with.
  it('should match keywords written in any case', () => {
    expect(getOverlaySizeType('FIT-CONTENT')).toBe('content');
    expect(getOverlaySizeType('Auto')).toBe('content');
    expect(getOverlaySizeType('100VH')).toBe('fullscreen');
  });

  it('should ignore whitespace around a value', () => {
    expect(getOverlaySizeType('  fit-content  ')).toBe('content');
    expect(getOverlaySizeType('  100% ')).toBe('fullscreen');
  });

  it('should return definite for a length or percentage', () => {
    expect(getOverlaySizeType('300px')).toBe('definite');
    expect(getOverlaySizeType('50%')).toBe('definite');
    expect(getOverlaySizeType('20rem')).toBe('definite');
    expect(getOverlaySizeType('50vh')).toBe('definite');
    expect(getOverlaySizeType('calc(100% - 40px)')).toBe('definite');
  });
});
