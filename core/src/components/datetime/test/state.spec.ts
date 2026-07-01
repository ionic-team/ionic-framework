import { getCalendarDayState, isDayDisabled, isNextMonthDisabled, isPrevMonthDisabled } from '../utils/state';

describe('getCalendarDayState()', () => {
  it('should return correct state', () => {
    const refA = { month: 1, day: 1, year: 2019 };
    const refB = { month: 1, day: 1, year: 2021 };
    const refC = { month: 1, day: 1, year: 2023 };

    expect(getCalendarDayState('en-US', refA, refB, refC)).toEqual({
      isActive: false,
      isToday: false,
      disabled: false,
      isRangeStart: false,
      isInRange: false,
      isRangeEnd: false,
      ariaSelected: null,
      ariaLabel: 'Tuesday, January 1',
      text: '1',
    });

    expect(getCalendarDayState('en-US', refA, refA, refC)).toEqual({
      isActive: true,
      isToday: false,
      disabled: false,
      isRangeStart: false,
      isInRange: false,
      isRangeEnd: false,
      ariaSelected: 'true',
      ariaLabel: 'Tuesday, January 1',
      text: '1',
    });

    expect(getCalendarDayState('en-US', refA, refB, refA)).toEqual({
      isActive: false,
      isToday: true,
      disabled: false,
      isRangeStart: false,
      isInRange: false,
      isRangeEnd: false,
      ariaSelected: null,
      ariaLabel: 'Today, Tuesday, January 1',
      text: '1',
    });

    expect(getCalendarDayState('en-US', refA, refA, refA)).toEqual({
      isActive: true,
      isToday: true,
      disabled: false,
      isRangeStart: false,
      isInRange: false,
      isRangeEnd: false,
      ariaSelected: 'true',
      ariaLabel: 'Today, Tuesday, January 1',
      text: '1',
    });

    expect(getCalendarDayState('en-US', refA, refA, refA, undefined, undefined, [1])).toEqual({
      isActive: true,
      isToday: true,
      disabled: false,
      isRangeStart: false,
      isInRange: false,
      isRangeEnd: false,
      ariaSelected: 'true',
      ariaLabel: 'Today, Tuesday, January 1',
      text: '1',
    });

    expect(getCalendarDayState('en-US', refA, refA, refA, undefined, undefined, [2])).toEqual({
      isActive: true,
      isToday: true,
      disabled: true,
      isRangeStart: false,
      isInRange: false,
      isRangeEnd: false,
      ariaSelected: 'true',
      ariaLabel: 'Today, Tuesday, January 1',
      text: '1',
    });
  });

  describe('with rangeParts', () => {
    const today = { month: 1, day: 15, year: 2025 };

    const startParts = { month: 1, day: 10, year: 2025 };
    const endParts = { month: 1, day: 20, year: 2025 };

    it('should mark the start day as isRangeStart and isActive', () => {
      const state = getCalendarDayState('en-US', startParts, [], today, undefined, undefined, undefined, {
        start: startParts,
        end: endParts,
      });
      expect(state.isRangeStart).toBe(true);
      expect(state.isRangeEnd).toBe(false);
      expect(state.isInRange).toBe(false);
      expect(state.isActive).toBe(true);
      expect(state.ariaSelected).toBe('true');
    });

    it('should mark the end day as isRangeEnd and isActive', () => {
      const state = getCalendarDayState('en-US', endParts, [], today, undefined, undefined, undefined, {
        start: startParts,
        end: endParts,
      });
      expect(state.isRangeEnd).toBe(true);
      expect(state.isRangeStart).toBe(false);
      expect(state.isInRange).toBe(false);
      expect(state.isActive).toBe(true);
      expect(state.ariaSelected).toBe('true');
    });

    it('should mark a day strictly between start and end as isInRange', () => {
      const between = { month: 1, day: 15, year: 2025 };
      const state = getCalendarDayState('en-US', between, [], today, undefined, undefined, undefined, {
        start: startParts,
        end: endParts,
      });
      expect(state.isInRange).toBe(true);
      expect(state.isRangeStart).toBe(false);
      expect(state.isRangeEnd).toBe(false);
      expect(state.isActive).toBe(false);
    });

    it('should not mark a day outside the range', () => {
      const outside = { month: 1, day: 5, year: 2025 };
      const state = getCalendarDayState('en-US', outside, [], today, undefined, undefined, undefined, {
        start: startParts,
        end: endParts,
      });
      expect(state.isRangeStart).toBe(false);
      expect(state.isInRange).toBe(false);
      expect(state.isRangeEnd).toBe(false);
      expect(state.isActive).toBe(false);
    });

    it('should not mark in-range when only start is set (partial range)', () => {
      const between = { month: 1, day: 15, year: 2025 };
      const state = getCalendarDayState('en-US', between, [], today, undefined, undefined, undefined, {
        start: startParts,
        // end is undefined — partial range
      });
      expect(state.isInRange).toBe(false);
    });

    it('should not mark disabled days as in-range', () => {
      const between = { month: 1, day: 15, year: 2025 };
      const minAfterBetween = { month: 1, day: 16, year: 2025 };
      const state = getCalendarDayState(
        'en-US',
        between,
        [],
        today,
        minAfterBetween, // min is after `between`, so it is disabled
        undefined,
        undefined,
        { start: startParts, end: endParts }
      );
      expect(state.disabled).toBe(true);
      expect(state.isInRange).toBe(false);
    });

    it('should have no range state when rangeParts is not provided', () => {
      const state = getCalendarDayState('en-US', startParts, [startParts], today);
      expect(state.isRangeStart).toBe(false);
      expect(state.isInRange).toBe(false);
      expect(state.isRangeEnd).toBe(false);
      // isActive is still set through the activeParts array path
      expect(state.isActive).toBe(true);
    });
  });
});

describe('isDayDisabled()', () => {
  it('should correctly return whether or not a day is disabled', () => {
    const refDate = { month: 5, day: 12, year: 2021 };

    expect(isDayDisabled(refDate, undefined, undefined)).toEqual(false);
    expect(isDayDisabled(refDate, { month: 5, day: 12, year: 2021 }, undefined)).toEqual(false);
    expect(isDayDisabled(refDate, { month: 6, day: 12, year: 2021 }, undefined)).toEqual(true);
    expect(isDayDisabled(refDate, { month: 5, day: 13, year: 2022 }, undefined)).toEqual(true);

    expect(isDayDisabled(refDate, undefined, { month: 5, day: 12, year: 2021 })).toEqual(false);
    expect(isDayDisabled(refDate, undefined, { month: 4, day: 12, year: 2021 })).toEqual(true);
    expect(isDayDisabled(refDate, undefined, { month: 5, day: 11, year: 2021 })).toEqual(true);
  });
});

describe('isPrevMonthDisabled()', () => {
  it('should return true', () => {
    // Date month is before min month, in the same year
    expect(isPrevMonthDisabled({ month: 5, year: 2021, day: null }, { month: 6, year: 2021, day: null })).toEqual(true);
    // Date month and year is the same as min month and year
    expect(isPrevMonthDisabled({ month: 1, year: 2021, day: null }, { month: 1, year: 2021, day: null })).toEqual(true);
    // Date year is the same as min year (month not provided)
    expect(
      isPrevMonthDisabled({ month: 1, year: 2021, day: null }, { year: 2021, month: null, day: null } as any)
    ).toEqual(true);
    // Date year is less than the min year (month not provided)
    expect(
      isPrevMonthDisabled({ month: 5, year: 2021, day: null }, { year: 2022, month: null, day: null } as any)
    ).toEqual(true);

    // Date is above the maximum bounds and the previous month does not does not fall within the
    // min-max range.
    expect(
      isPrevMonthDisabled(
        { month: 12, year: 2021, day: null },
        { month: 9, year: 2021, day: null },
        { month: 10, year: 2021, day: null }
      )
    ).toEqual(true);

    // Date is above the maximum bounds and a year ahead of the max range. The previous month/year
    // does not fall within the min-max range.
    expect(
      isPrevMonthDisabled(
        { month: 1, year: 2022, day: null },
        { month: 9, year: 2021, day: null },
        { month: 10, year: 2021, day: null }
      )
    ).toEqual(true);
  });

  it('should return false', () => {
    // No min range provided
    expect(isPrevMonthDisabled({ month: 12, year: 2021, day: null })).toEqual(false);
    // Date year is the same as min year,
    // but can navigate to a previous month without reducing the year.
    expect(
      isPrevMonthDisabled({ month: 12, year: 2021, day: null }, { year: 2021, month: null, day: null } as any)
    ).toEqual(false);
    expect(
      isPrevMonthDisabled({ month: 2, year: 2021, day: null }, { year: 2021, month: null, day: null } as any)
    ).toEqual(false);
  });
});

describe('isNextMonthDisabled()', () => {
  it('should return true', () => {
    // Date month is the same as max month (in the same year)
    expect(isNextMonthDisabled({ month: 10, year: 2021, day: null }, { month: 10, year: 2021, day: null })).toEqual(
      true
    );
    // Date month is after the max month (in the same year)
    expect(isNextMonthDisabled({ month: 10, year: 2021, day: null }, { month: 9, year: 2021, day: null })).toEqual(
      true
    );
    // Date year is after the max month and year
    expect(isNextMonthDisabled({ month: 10, year: 2022, day: null }, { month: 12, year: 2021, day: null })).toEqual(
      true
    );
  });

  it('should return false', () => {
    // No max range provided
    expect(isNextMonthDisabled({ month: 10, year: 2021, day: null })).toBe(false);
    // Date month is before max month and is the previous month,
    // so that navigating the next month would re-enter the max range
    expect(isNextMonthDisabled({ month: 10, year: 2021, day: null }, { month: 11, year: 2021, day: null })).toEqual(
      false
    );
  });
});
