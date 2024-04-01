import {
  getDecimalPlaces,
  roundToMaxDecimalPlaces,
} from './index';

describe('floating point utils', () => {
  describe('getDecimalPlaces', () => {
    it('should calculate decimal places for a float', async () => {
      const n = getDecimalPlaces(5.001);
      expect(n).toBe(3);
    });

    it('should return no decimal places for a whole number', async () => {
      const n = getDecimalPlaces(5);
      expect(n).toBe(0);
    });
  });

  describe('roundToMaxDecimalPlaces', () => {
    it('should round to the highest number of places as references', async () => {
      const n = roundToMaxDecimalPlaces(
        5.12345,
        1.12,
        2.123
      );
      expect(n).toBe(5.123);
    });
  });
});
