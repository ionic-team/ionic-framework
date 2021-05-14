import {
  shouldRenderViewButtons,
  shouldRenderViewHeader,
  getDaysOfWeek,
  getMonthAndDay,
  getNumDaysInMonth,
  shouldRenderViewFooter,
  isSameDay,
  generateDayAriaLabel,
  getCalendarDayState,
  getNextMonth,
  getPreviousMonth,
  generateMonths,
  isDayDisabled
} from '../datetime.utils';

describe('isDayDisabled', () => {
  it('should correctly return whether or not a day is disabled', () => {
    const refDate = { month: 5, day: 12, year: 2021 };

    expect(isDayDisabled(refDate, undefined, undefined)).toEqual(false);
    expect(isDayDisabled(refDate, { month: 5, day: 12, year: 2021 }, undefined)).toEqual(false);
    expect(isDayDisabled(refDate, { month: 6, day: 12, year: 2021 }, undefined)).toEqual(true);
    expect(isDayDisabled(refDate, { month: 5, day: 13, year: 2022 }, undefined)).toEqual(true);

    expect(isDayDisabled(refDate, undefined, { month: 5, day: 12, year: 2021 })).toEqual(false);
    expect(isDayDisabled(refDate, undefined, { month: 4, day: 12, year: 2021 })).toEqual(true);
    expect(isDayDisabled(refDate, undefined, { month: 5, day: 11, year: 2021 })).toEqual(true);
  })
})

describe('getNextMonth()', () => {
  it('should return correct next month', () => {
    expect(getNextMonth({ month: 5, year: 2021, day: 1 })).toEqual({
      month: 6,
      year: 2021,
      day: null
    });
    expect(getNextMonth({ month: 12, year: 2021, day: 30 })).toEqual({
      month: 1,
      year: 2022,
      day: null
    });
    expect(getNextMonth({ month: 12, year: 1999, day: 30 })).toEqual({
      month: 1,
      year: 2000,
      day: null
    });
  });
});

describe('getPreviousMonth()', () => {
  it('should return correct previous month', () => {
    expect(getPreviousMonth({ month: 5, year: 2021, day: 1 })).toEqual({
      month: 4,
      year: 2021,
      day: null
    });
    expect(getPreviousMonth({ month: 1, year: 2021, day: 30 })).toEqual({
      month: 12,
      year: 2020,
      day: null
    });
    expect(getPreviousMonth({ month: 1, year: 2000, day: 30 })).toEqual({
      month: 12,
      year: 1999,
      day: null
    });
  });
});

describe('generateMonths()', () => {
  it('should generate correct month data', () => {
    expect(generateMonths({ month: 5, year: 2021, day: 1 })).toEqual([
      { month: 4, year: 2021, day: null },
      { month: 5, year: 2021, day: null },
      { month: 6, year: 2021, day: null }
    ]);
  });
});

describe('getCalendarDayState()', () => {
  it('should return correct state', () => {
    const refA = { month: 1, day: 1, year: 2019 };
    const refB = { month: 1, day: 1, year: 2021 };
    const refC = { month: 1, day: 1, year: 2023 };

    expect(getCalendarDayState('en-US', refA, refB, refC)).toEqual({
      isActive: false,
      isToday: false,
      ariaSelected: null,
      ariaLabel: 'Tuesday, January 1'
    });

    expect(getCalendarDayState('en-US', refA, refA, refC)).toEqual({
      isActive: true,
      isToday: false,
      ariaSelected: 'true',
      ariaLabel: 'Tuesday, January 1'
    });

    expect(getCalendarDayState('en-US', refA, refB, refA)).toEqual({
      isActive: false,
      isToday: true,
      ariaSelected: null,
      ariaLabel: 'Today, Tuesday, January 1'
    });

    expect(getCalendarDayState('en-US', refA, refA, refA)).toEqual({
      isActive: true,
      isToday: true,
      ariaSelected: 'true',
      ariaLabel: 'Today, Tuesday, January 1'
    });
  });
});

describe('generateDayAriaLabel()', () => {
  it('should return Wednesday, May 12', () => {
    const reference = { month: 5, day: 12, year: 2021 };

    expect(generateDayAriaLabel('en-US', false, reference)).toEqual('Wednesday, May 12');
  });
  it('should return Today, Wednesday, May 12', () => {
    const reference = { month: 5, day: 12, year: 2021 };

    expect(generateDayAriaLabel('en-US', true, reference)).toEqual('Today, Wednesday, May 12');
  });
  it('should return Saturday, May 1', () => {
    const reference = { month: 5, day: 1, year: 2021 };

    expect(generateDayAriaLabel('en-US', false, reference)).toEqual('Saturday, May 1');
  });
  it('should return Monday, May 31', () => {
    const reference = { month: 5, day: 31, year: 2021 };

    expect(generateDayAriaLabel('en-US', false, reference)).toEqual('Monday, May 31');
  });
});

describe('isSameDay()', () => {
  it('should return correct results for month, day, and year', () => {
    const reference = { month: 1, day: 1, year: 2021 }

    expect(isSameDay(reference, { month: 1, day: 1, year: 2021 })).toEqual(true);
    expect(isSameDay(reference, { month: 2, day: 1, year: 2021 })).toEqual(false);
    expect(isSameDay(reference, { month: 1, day: 2, year: 2021 })).toEqual(false);
    expect(isSameDay(reference, { month: 1, day: 1, year: 2022 })).toEqual(false);
    expect(isSameDay(reference, { month: 0, day: 0, year: 0 })).toEqual(false);
    expect(isSameDay(reference, { month: null, day: null, year: null })).toEqual(false);
  })
})

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

describe('getDaysOfWeek()', () => {
  it('should return English short names given a locale and mode', () => {
    expect(getDaysOfWeek('en-US', 'ios')).toEqual(['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']);
  });

  it('should return English narrow names given a locale and mode', () => {
    expect(getDaysOfWeek('en-US', 'md')).toEqual(['S', 'M', 'T', 'W', 'T', 'F', 'S']);
  });

  it('should return Spanish short names given a locale and mode', () => {
    expect(getDaysOfWeek('es-ES', 'ios')).toEqual(['dom', 'lun', 'mar', 'mié', 'jue', 'vie', 'sáb']);
  });

  it('should return Spanish narrow names given a locale and mode', () => {
    expect(getDaysOfWeek('es-ES', 'md')).toEqual(['D', 'L', 'M', 'X', 'J', 'V', 'S']);
  });
})

describe('getMonthAndDay()', () => {
  it('should return Tue, May 11', () => {
    expect(getMonthAndDay('en-US', { month: 5, day: 11, year: 2021 })).toEqual('Tue, May 11');
  });

  it('should return mar, 11 may', () => {
    expect(getMonthAndDay('es-ES', { month: 5, day: 11, year: 2021 })).toEqual('mar, 11 may');
  });
})

describe('shouldRenderViewButtons()', () => {
  it('should return true when running in md mode', () => {
    expect(shouldRenderViewButtons('md')).toEqual(true)
  });

  it('should return false when running in ios mode', () => {
    expect(shouldRenderViewButtons('ios')).toEqual(false)
  });
})

describe('shouldRenderViewHeader()', () => {
  it('should return true when in MD mode with a slotted title inline', () => {
    expect(shouldRenderViewHeader('md', 'inline', true)).toEqual(true)
  });

  it('should return true when in MD mode with a slotted title in a modal', () => {
    expect(shouldRenderViewHeader('md', 'modal', true)).toEqual(true)
  });

  it('should return true when in MD mode with a slotted title in a popover', () => {
    expect(shouldRenderViewHeader('md', 'popover', true)).toEqual(true)
  });

  it('should return true when in MD mode with no slotted title inline', () => {
    expect(shouldRenderViewHeader('md', 'inline', false)).toEqual(true)
  });

  it('should return true when in MD mode with no slotted title in a modal', () => {
    expect(shouldRenderViewHeader('md', 'modal', false)).toEqual(true)
  });

  it('should return false when in MD mode with no slotted title in a popover', () => {
    expect(shouldRenderViewHeader('md', 'popover', false)).toEqual(false)
  });

  it('should return true when in iOS mode with a slotted title inline', () => {
    expect(shouldRenderViewHeader('ios', 'inline', true)).toEqual(true)
  });

  it('should return true when in iOS mode with a slotted title in a modal', () => {
    expect(shouldRenderViewHeader('ios', 'modal', true)).toEqual(true)
  });

  it('should return true when in iOS mode with a slotted title in a popover', () => {
    expect(shouldRenderViewHeader('ios', 'popover', true)).toEqual(true)
  });

  it('should return true when in iOS mode with no slotted title inline', () => {
    expect(shouldRenderViewHeader('ios', 'inline', false)).toEqual(false)
  });

  it('should return true when in iOS mode with no slotted title in a modal', () => {
    expect(shouldRenderViewHeader('ios', 'modal', false)).toEqual(false)
  });

  it('should return false when in iOS mode with no slotted title in a popover', () => {
    expect(shouldRenderViewHeader('ios', 'popover', false)).toEqual(false)
  });
})

describe('shouldRenderViewFooter()', () => {
  it('should return true when in MD mode with a slotted button inline', () => {
    expect(shouldRenderViewFooter('md', 'inline', true)).toEqual(true)
  });

  it('should return true when in MD mode with a slotted button in a modal', () => {
    expect(shouldRenderViewFooter('md', 'modal', true)).toEqual(true)
  });

  it('should return true when in MD mode with a slotted button in a popover', () => {
    expect(shouldRenderViewFooter('md', 'popover', true)).toEqual(true)
  });

  it('should return true when in MD mode with no slotted button inline', () => {
    expect(shouldRenderViewFooter('md', 'inline', false)).toEqual(true)
  });

  it('should return true when in MD mode with no slotted button in a modal', () => {
    expect(shouldRenderViewFooter('md', 'modal', false)).toEqual(true)
  });

  it('should return false when in MD mode with no slotted button in a popover', () => {
    expect(shouldRenderViewFooter('md', 'popover', false)).toEqual(true)
  });

  it('should return true when in iOS mode with a slotted button inline', () => {
    expect(shouldRenderViewFooter('ios', 'inline', true)).toEqual(true)
  });

  it('should return true when in iOS mode with a slotted button in a modal', () => {
    expect(shouldRenderViewFooter('ios', 'modal', true)).toEqual(true)
  });

  it('should return true when in iOS mode with a slotted button in a popover', () => {
    expect(shouldRenderViewFooter('ios', 'popover', true)).toEqual(true)
  });

  it('should return true when in iOS mode with no slotted button inline', () => {
    expect(shouldRenderViewFooter('ios', 'inline', false)).toEqual(false)
  });

  it('should return true when in iOS mode with no slotted button in a modal', () => {
    expect(shouldRenderViewFooter('ios', 'modal', false)).toEqual(true)
  });

  it('should return false when in iOS mode with no slotted button in a popover', () => {
    expect(shouldRenderViewFooter('ios', 'popover', false)).toEqual(false)
  });
});
