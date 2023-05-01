
import type { ElementState } from '../types/mask-interface';

import { getNotEmptySelection } from './get-not-empty-selection';

describe('getNotEmptySelection', () => {
  it('should return the same selection when selection positions are not equal', () => {
    const elementStateStub: ElementState = {
      value: 'testValue',
      selection: [1, 3],
    };

    expect(getNotEmptySelection(elementStateStub, true)).toEqual(
      elementStateStub.selection,
    );
    expect(getNotEmptySelection(elementStateStub, false)).toEqual(
      elementStateStub.selection,
    );
  });

  describe('backward direction', () => {
    it('should decrease by one start position value', () => {
      const elementStateStub: ElementState = {
        value: 'testValue',
        selection: [4, 4],
      };

      expect(getNotEmptySelection(elementStateStub, false)).toEqual([3, 4]);
    });

    it('should not change everything when start value is 0', () => {
      const elementStateStub: ElementState = {
        value: 'testValue',
        selection: [0, 4],
      };

      expect(getNotEmptySelection(elementStateStub, false)).toEqual([0, 4]);
    });

    it('should decrease by one start value', () => {
      const elementStateStub: ElementState = {
        value: 'testValue',
        selection: [1, 1],
      };

      expect(getNotEmptySelection(elementStateStub, false)).toEqual([0, 1]);
    });
  });

  describe('forward direction', () => {
    it('should increase by one end position, when value`s length more then end position', () => {
      const elementStateStub: ElementState = {
        value: 'testValue',
        selection: [2, 2],
      };

      expect(getNotEmptySelection(elementStateStub, true)).toEqual([2, 3]);
    });

    it('should return value length as end position, when value`s length less or equal then end position ', () => {
      const elementStateStub: ElementState = {
        value: 'sx',
        selection: [4, 4],
      };

      expect(getNotEmptySelection(elementStateStub, true)).toEqual([2, 2]);
    });

    it('should increase by one end position, when value`s length equal end position increased by one', () => {
      const elementStateStub: ElementState = {
        value: 'test1',
        selection: [4, 4],
      };

      expect(getNotEmptySelection(elementStateStub, true)).toEqual([4, 5]);
    });
  });
});
