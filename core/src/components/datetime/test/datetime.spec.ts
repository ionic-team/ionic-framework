import { shouldRenderViewButtons, shouldRenderViewHeader } from '../datetime.utils';

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
