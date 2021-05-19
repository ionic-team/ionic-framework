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
  isDayDisabled,
  getNextWeek,
  getPreviousWeek,
  getNextDay,
  getPreviousDay,
  getStartOfWeek,
  getEndOfWeek,
  convert12HourTo24Hour,
  generateTime,
  calculateHourFromAMPM,
  isBefore,
  isAfter
} from '../datetime.utils';

describe('calculateHourFromAMPM()', () => {
  it('should correctly convert from AM to PM', () => {
    expect(calculateHourFromAMPM({ hour: 12, ampm: 'am' }, 'pm')).toEqual(12);
    expect(calculateHourFromAMPM({ hour: 1, ampm: 'am' }, 'pm')).toEqual(13);
    expect(calculateHourFromAMPM({ hour: 2, ampm: 'am' }, 'pm')).toEqual(14);
    expect(calculateHourFromAMPM({ hour: 3, ampm: 'am' }, 'pm')).toEqual(15);
    expect(calculateHourFromAMPM({ hour: 4, ampm: 'am' }, 'pm')).toEqual(16);
    expect(calculateHourFromAMPM({ hour: 5, ampm: 'am' }, 'pm')).toEqual(17);
    expect(calculateHourFromAMPM({ hour: 6, ampm: 'am' }, 'pm')).toEqual(18);
    expect(calculateHourFromAMPM({ hour: 7, ampm: 'am' }, 'pm')).toEqual(19);
    expect(calculateHourFromAMPM({ hour: 8, ampm: 'am' }, 'pm')).toEqual(20);
    expect(calculateHourFromAMPM({ hour: 9, ampm: 'am' }, 'pm')).toEqual(21);
    expect(calculateHourFromAMPM({ hour: 10, ampm: 'am' }, 'pm')).toEqual(22);
    expect(calculateHourFromAMPM({ hour: 11, ampm: 'am' }, 'pm')).toEqual(23);

    expect(calculateHourFromAMPM({ hour: 13, ampm: 'pm' }, 'am')).toEqual(1);
    expect(calculateHourFromAMPM({ hour: 14, ampm: 'pm' }, 'am')).toEqual(2);
    expect(calculateHourFromAMPM({ hour: 15, ampm: 'pm' }, 'am')).toEqual(3);
    expect(calculateHourFromAMPM({ hour: 16, ampm: 'pm' }, 'am')).toEqual(4);
    expect(calculateHourFromAMPM({ hour: 17, ampm: 'pm' }, 'am')).toEqual(5);
    expect(calculateHourFromAMPM({ hour: 18, ampm: 'pm' }, 'am')).toEqual(6);
    expect(calculateHourFromAMPM({ hour: 19, ampm: 'pm' }, 'am')).toEqual(7);
    expect(calculateHourFromAMPM({ hour: 20, ampm: 'pm' }, 'am')).toEqual(8);
    expect(calculateHourFromAMPM({ hour: 21, ampm: 'pm' }, 'am')).toEqual(9);
    expect(calculateHourFromAMPM({ hour: 22, ampm: 'pm' }, 'am')).toEqual(10);
    expect(calculateHourFromAMPM({ hour: 23, ampm: 'pm' }, 'am')).toEqual(11);
    expect(calculateHourFromAMPM({ hour: 0, ampm: 'pm' }, 'am')).toEqual(12);
  })
});

describe('generateTime()', () => {
  it('should not filter and hours/minutes when no bounds set', () => {
    const today = {
      day: 19,
      month: 5,
      year: 2021,
      hour: 5,
      minute: 43
    }
    const { hours, minutes, use24Hour } = generateTime('en-US', today);

    expect(hours.length).toEqual(12);
    expect(minutes.length).toEqual(60);
    expect(use24Hour).toEqual(false);
  });
  it('should filter according to min', () => {
    const today = {
      day: 19,
      month: 5,
      year: 2021,
      hour: 5,
      minute: 43
    }
    const min = {
      day: 19,
      month: 5,
      year: 2021,
      hour: 2,
      minute: 40
    }
    const { hours, minutes, use24Hour } = generateTime('en-US', today, min);

    expect(hours.length).toEqual(11);
    expect(minutes.length).toEqual(20);
    expect(use24Hour).toEqual(false);
  })
  it('should not filter according to min if not on reference day', () => {
    const today = {
      day: 20,
      month: 5,
      year: 2021,
      hour: 5,
      minute: 43
    }
    const min = {
      day: 19,
      month: 5,
      year: 2021,
      hour: 2,
      minute: 40
    }
    const { hours, minutes, use24Hour } = generateTime('en-US', today, min);

    expect(hours.length).toEqual(12);
    expect(minutes.length).toEqual(60);
    expect(use24Hour).toEqual(false);
  })
  it('should filter according to max', () => {
    const today = {
      day: 19,
      month: 5,
      year: 2021,
      hour: 5,
      minute: 43
    }
    const max = {
      day: 19,
      month: 5,
      year: 2021,
      hour: 7,
      minute: 44
    }
    const { hours, minutes, use24Hour } = generateTime('en-US', today, undefined, max);

    expect(hours.length).toEqual(7);
    expect(minutes.length).toEqual(45);
    expect(use24Hour).toEqual(false);
  })
  it('should not filter according to min if not on reference day', () => {
    const today = {
      day: 20,
      month: 5,
      year: 2021,
      hour: 5,
      minute: 43
    }
    const max = {
      day: 21,
      month: 5,
      year: 2021,
      hour: 2,
      minute: 40
    }
    const { hours, minutes, use24Hour } = generateTime('en-US', today, undefined, max);

    expect(hours.length).toEqual(12);
    expect(minutes.length).toEqual(60);
    expect(use24Hour).toEqual(false);
  })
  it('should return no values for a day less than the min', () => {
    const today = {
      day: 20,
      month: 5,
      year: 2021,
      hour: 5,
      minute: 43
    }
    const min = {
      day: 21,
      month: 5,
      year: 2021,
      hour: 2,
      minute: 40
    }
    const { hours, minutes, use24Hour } = generateTime('en-US', today, min);

    expect(hours.length).toEqual(0);
    expect(minutes.length).toEqual(0);
    expect(use24Hour).toEqual(false);
  })
  it('should return no values for a day greater than the max', () => {
    const today = {
      day: 22,
      month: 5,
      year: 2021,
      hour: 5,
      minute: 43
    }
    const max = {
      day: 21,
      month: 5,
      year: 2021,
      hour: 2,
      minute: 40
    }
    const { hours, minutes, use24Hour } = generateTime('en-US', today, undefined, max);

    expect(hours.length).toEqual(0);
    expect(minutes.length).toEqual(0);
    expect(use24Hour).toEqual(false);
  })

})

describe('convert12HourTo24Hour()', () => {
  it('should correctly convert 12 hour to 24 hour', () => {
    expect(convert12HourTo24Hour(12, 'am')).toEqual(0);
    expect(convert12HourTo24Hour(1, 'am')).toEqual(1);
    expect(convert12HourTo24Hour(2, 'am')).toEqual(2);
    expect(convert12HourTo24Hour(3, 'am')).toEqual(3);
    expect(convert12HourTo24Hour(4, 'am')).toEqual(4);
    expect(convert12HourTo24Hour(5, 'am')).toEqual(5);
    expect(convert12HourTo24Hour(6, 'am')).toEqual(6);
    expect(convert12HourTo24Hour(7, 'am')).toEqual(7);
    expect(convert12HourTo24Hour(8, 'am')).toEqual(8);
    expect(convert12HourTo24Hour(9, 'am')).toEqual(9);
    expect(convert12HourTo24Hour(10, 'am')).toEqual(10);
    expect(convert12HourTo24Hour(11, 'am')).toEqual(11);

    expect(convert12HourTo24Hour(12, 'pm')).toEqual(12);
    expect(convert12HourTo24Hour(1, 'pm')).toEqual(13);
    expect(convert12HourTo24Hour(2, 'pm')).toEqual(14);
    expect(convert12HourTo24Hour(3, 'pm')).toEqual(15);
    expect(convert12HourTo24Hour(4, 'pm')).toEqual(16);
    expect(convert12HourTo24Hour(5, 'pm')).toEqual(17);
    expect(convert12HourTo24Hour(6, 'pm')).toEqual(18);
    expect(convert12HourTo24Hour(7, 'pm')).toEqual(19);
    expect(convert12HourTo24Hour(8, 'pm')).toEqual(20);
    expect(convert12HourTo24Hour(9, 'pm')).toEqual(21);
    expect(convert12HourTo24Hour(10, 'pm')).toEqual(22);
    expect(convert12HourTo24Hour(11, 'pm')).toEqual(23);
  })
})

describe('getStartOfWeek()', () => {
  it('should correctly return the start of the week', () => {
    expect(getStartOfWeek({
      month: 5,
      day: 17,
      year: 2021,
      dayOfWeek: 1
    })).toEqual({
      month: 5,
      day: 16,
      year: 2021
    });

    expect(getStartOfWeek({
      month: 5,
      day: 1,
      year: 2021,
      dayOfWeek: 6
    })).toEqual({
      month: 4,
      day: 25,
      year: 2021,
    });

    expect(getStartOfWeek({
      month: 1,
      day: 2,
      year: 2021,
      dayOfWeek: 6
    })).toEqual({
      month: 12,
      day: 27,
      year: 2020
    });
  })
});

describe('getEndOfWeek()', () => {
  it('should correctly return the end of the week', () => {
    expect(getEndOfWeek({
      month: 5,
      day: 17,
      year: 2021,
      dayOfWeek: 1
    })).toEqual({
      month: 5,
      day: 22,
      year: 2021
    });

    expect(getEndOfWeek({
      month: 5,
      day: 31,
      year: 2021,
      dayOfWeek: 1
    })).toEqual({
      month: 6,
      day: 5,
      year: 2021,
    });

    expect(getEndOfWeek({
      month: 12,
      day: 29,
      year: 2021,
      dayOfWeek: 3
    })).toEqual({
      month: 1,
      day: 1,
      year: 2022
    });
  })
});

describe('getNextWeek()', () => {
  it('should correctly return the next week', () => {
    expect(getNextWeek({
      month: 5,
      day: 17,
      year: 2021
    })).toEqual({
      month: 5,
      day: 24,
      year: 2021
    });

    expect(getNextWeek({
      month: 5,
      day: 31,
      year: 2021
    })).toEqual({
      month: 6,
      day: 7,
      year: 2021
    });

    expect(getNextWeek({
      month: 12,
      day: 29,
      year: 2021
    })).toEqual({
      month: 1,
      day: 5,
      year: 2022
    });
  })
})

describe('getPreviousWeek()', () => {
  it('should correctly return the previous week', () => {
    expect(getPreviousWeek({
      month: 5,
      day: 17,
      year: 2021
    })).toEqual({
      month: 5,
      day: 10,
      year: 2021
    });

    expect(getPreviousWeek({
      month: 5,
      day: 1,
      year: 2021
    })).toEqual({
      month: 4,
      day: 24,
      year: 2021
    });

    expect(getPreviousWeek({
      month: 1,
      day: 4,
      year: 2021
    })).toEqual({
      month: 12,
      day: 28,
      year: 2020
    });
  })
})

describe('getNextDay()', () => {
  it('should correctly return the next day', () => {
    expect(getNextDay({
      month: 5,
      day: 17,
      year: 2021
    })).toEqual({
      month: 5,
      day: 18,
      year: 2021
    });

    expect(getNextDay({
      month: 5,
      day: 31,
      year: 2021
    })).toEqual({
      month: 6,
      day: 1,
      year: 2021
    });

    expect(getNextDay({
      month: 12,
      day: 31,
      year: 2021
    })).toEqual({
      month: 1,
      day: 1,
      year: 2022
    });
  })
})

describe('getPreviousDay()', () => {
  it('should correctly return the previous day', () => {
    expect(getPreviousDay({
      month: 5,
      day: 17,
      year: 2021
    })).toEqual({
      month: 5,
      day: 16,
      year: 2021
    });

    expect(getPreviousDay({
      month: 5,
      day: 1,
      year: 2021
    })).toEqual({
      month: 4,
      day: 30,
      year: 2021
    });

    expect(getPreviousDay({
      month: 1,
      day: 1,
      year: 2021
    })).toEqual({
      month: 12,
      day: 31,
      year: 2020
    });
  })
})

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
});

describe('getNextMonth()', () => {
  it('should return correct next month', () => {
    expect(getNextMonth({ month: 5, year: 2021, day: 1 })).toEqual({
      month: 6,
      year: 2021,
      day: 1
    });
    expect(getNextMonth({ month: 12, year: 2021, day: 30 })).toEqual({
      month: 1,
      year: 2022,
      day: 30
    });
    expect(getNextMonth({ month: 12, year: 1999, day: 30 })).toEqual({
      month: 1,
      year: 2000,
      day: 30
    });
  });
});

describe('getPreviousMonth()', () => {
  it('should return correct previous month', () => {
    expect(getPreviousMonth({ month: 5, year: 2021, day: 1 })).toEqual({
      month: 4,
      year: 2021,
      day: 1
    });
    expect(getPreviousMonth({ month: 1, year: 2021, day: 30 })).toEqual({
      month: 12,
      year: 2020,
      day: 30
    });
    expect(getPreviousMonth({ month: 1, year: 2000, day: 30 })).toEqual({
      month: 12,
      year: 1999,
      day: 30
    });
  });
});

describe('generateMonths()', () => {
  it('should generate correct month data', () => {
    expect(generateMonths({ month: 5, year: 2021, day: 1 })).toEqual([
      { month: 4, year: 2021, day: 1 },
      { month: 5, year: 2021, day: 1 },
      { month: 6, year: 2021, day: 1 }
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
      disabled: false,
      ariaSelected: null,
      ariaLabel: 'Tuesday, January 1'
    });

    expect(getCalendarDayState('en-US', refA, refA, refC)).toEqual({
      isActive: true,
      isToday: false,
      disabled: false,
      ariaSelected: 'true',
      ariaLabel: 'Tuesday, January 1'
    });

    expect(getCalendarDayState('en-US', refA, refB, refA)).toEqual({
      isActive: false,
      isToday: true,
      disabled: false,
      ariaSelected: null,
      ariaLabel: 'Today, Tuesday, January 1'
    });

    expect(getCalendarDayState('en-US', refA, refA, refA)).toEqual({
      isActive: true,
      isToday: true,
      disabled: false,
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

<<<<<<< HEAD
describe('isBefore()', () => {
  it('should return correct results for month, day, and year', () => {
    const reference = { month: 1, day: 1, year: 2021 }

    expect(isBefore(reference, { month: 1, day: 1, year: 2021 })).toEqual(false);
    expect(isBefore(reference, { month: 2, day: 1, year: 2021 })).toEqual(true);
    expect(isBefore(reference, { month: 1, day: 2, year: 2021 })).toEqual(true);
    expect(isBefore(reference, { month: 1, day: 1, year: 2022 })).toEqual(true);
    expect(isBefore(reference, { month: 1, day: 1, year: 2020 })).toEqual(false);
    expect(isBefore(reference, { month: 0, day: 0, year: 0 })).toEqual(false);
    expect(isBefore(reference, { month: null, day: null, year: null })).toEqual(false);
  })
})

describe('isAfter()', () => {
  it('should return correct results for month, day, and year', () => {
    const reference = { month: 2, day: 2, year: 2021 }

    expect(isAfter(reference, { month: 2, day: 2, year: 2021 })).toEqual(false);
    expect(isAfter(reference, { month: 2, day: 1, year: 2021 })).toEqual(true);
    expect(isAfter(reference, { month: 1, day: 2, year: 2021 })).toEqual(true);
    expect(isAfter(reference, { month: 1, day: 1, year: 2020 })).toEqual(true);
    expect(isAfter(reference, { month: 1, day: 1, year: 2022 })).toEqual(false);
    expect(isAfter(reference, { month: 0, day: 0, year: 0 })).toEqual(true);

    /**
     * 2021 > undefined === false
     * 2021 > null === true
     */
    expect(isAfter(reference, { month: null, day: null, year: null })).toEqual(true);
  })
})

=======
>>>>>>> origin/next-datetime
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
<<<<<<< HEAD

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

=======

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

>>>>>>> origin/next-datetime
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
