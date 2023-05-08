import type { ElementState } from '../types/mask-interface';

import { areElementStatesEqual, areElementValuesEqual } from './element-states-equality';

describe('areElementValuesEqual', () => {
  it('should return true if the values of the given states are equal', () => {
    const sampleState = { value: 'a', selection: [0, 0] } as ElementState;
    const states = [{ value: 'a', selection: [0, 0] }] as ElementState[];

    expect(areElementValuesEqual(sampleState, ...states)).toBe(true);
  });

  it('should return false if the values of the given states are not equal', () => {
    const sampleState = { value: 'a', selection: [0, 0] } as ElementState;
    const states = [{ value: 'b', selection: [0, 0] }] as ElementState[];

    expect(areElementValuesEqual(sampleState, ...states)).toBe(false);
  });
});

describe('areElementStatesEqual', () => {
  it('should return true if the states are equal', () => {
    const sampleState = { value: 'a', selection: [0, 0] } as ElementState;
    const states = [{ value: 'a', selection: [0, 0] }] as ElementState[];

    expect(areElementStatesEqual(sampleState, ...states)).toBe(true);
  });

  it('should return false if the state values are not equal', () => {
    const sampleState = { value: 'a', selection: [0, 0] } as ElementState;
    const states = [{ value: 'b', selection: [0, 0] }] as ElementState[];

    expect(areElementStatesEqual(sampleState, ...states)).toBe(false);
  });

  it('should return false if the state selections are not equal', () => {
    const sampleState = { value: 'a', selection: [0, 0] } as ElementState;
    const states = [{ value: 'a', selection: [0, 1] }] as ElementState[];

    expect(areElementStatesEqual(sampleState, ...states)).toBe(false);
  });
});
