import {
  shouldRenderViewHeader,
  shouldRenderViewFooter,
  getCalendarDayState,
  isDayDisabled
} from '../utils/state';

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
  })
});
