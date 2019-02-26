import { Range } from '../range';

let sharedRange;
describe('Range', () => {
  beforeEach(() => {
    sharedRange = new Range();
  });
  describe('ensureValueInBounds()', () => {
    it('should return the clamped value for a range single knob component', () => {
      sharedRange.min = 0;
      sharedRange.max = 100;
      
      const valueTests = [
        [50, 50],
        [-100, 0],
        [1000, 100],
        [0, 0],
        [100, 100]
      ];
      
      valueTests.forEach(test => {
        expect(sharedRange.ensureValueInBounds(test[0])).toBe(test[1]);
      });
    });
    
    it('should return the clamped value for a range dual knob component', () => {
      sharedRange.min = 0;
      sharedRange.max = 100;
      sharedRange.dualKnobs = true;
      
      const valueTests = [
        [{ lower: 0, upper: 0}, { lower: 0, upper: 0}],
        [{ lower: -100, upper: 0}, { lower: 0, upper: 0}],
        [{ lower: 0, upper: 10000}, { lower: 0, upper: 100}],
        [{ lower: -100, upper: 200}, { lower: 0, upper: 100}],
        [{ lower: 0, upper: 100}, { lower: 0, upper: 100}],
        [{ lower: 200, upper: -100}, { lower: 100, upper: 0}],
      ];
      
      valueTests.forEach(test => {
        expect(sharedRange.ensureValueInBounds(test[0])).toEqual(test[1]);
      });
    });
  });
});