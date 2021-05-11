import { shouldRenderViewButtons, shouldRenderViewHeader, getDaysOfWeek, getMonthAndDay } from '../datetime.utils';

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
    expect(getMonthAndDay('en-US', new Date('05/11/2021'))).toEqual('Tue, May 11');
  });

  it('should return mar, 11 may', () => {
    expect(getMonthAndDay('es-ES', new Date('05/11/2021'))).toEqual('mar, 11 may');
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

const hasSlot = (el: HTMLElement, slotName: string) => {
  const shadowRoot = el.shadowRoot;
  const slot = el.querySelector(`[slot=${slotName}]`);

  return !!slot;
}
