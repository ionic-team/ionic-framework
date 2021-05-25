import {
  getNumDaysInMonth
} from '../utils/helpers';

describe('daysInMonth()', () => {
  it('should return correct days in month for month and year', () => {
    expect(getNumDaysInMonth(1, 2019)).toBe(31);
    expect(getNumDaysInMonth(2, 2019)).toBe(28);
    expect(getNumDaysInMonth(3, 2019)).toBe(31);
    expect(getNumDaysInMonth(4, 2019)).toBe(30);
    expect(getNumDaysInMonth(5, 2019)).toBe(31);
    expect(getNumDaysInMonth(6, 2019)).toBe(30);
    expect(getNumDaysInMonth(7, 2019)).toBe(31);
    expect(getNumDaysInMonth(8, 2019)).toBe(31);
    expect(getNumDaysInMonth(9, 2019)).toBe(30);
    expect(getNumDaysInMonth(10, 2019)).toBe(31);
    expect(getNumDaysInMonth(11, 2019)).toBe(30);
    expect(getNumDaysInMonth(12, 2019)).toBe(31);
    expect(getNumDaysInMonth(2, 2020)).toBe(29);
  });
});
