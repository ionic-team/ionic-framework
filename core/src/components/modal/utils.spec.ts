import { getBackdropValueForSheet } from './utils';

describe('getBackdropValueForSheet()', () => {
  it('should return a valid integer when backdropBreakpoint is 1', () => {
    /**
     * Issue: https://github.com/ionic-team/ionic-framework/issues/25402
     */
    const backdropBreakpoint = 1;
    expect(
      getBackdropValueForSheet(
        1,
        backdropBreakpoint
      )
    ).toBe(0);
  });
});
