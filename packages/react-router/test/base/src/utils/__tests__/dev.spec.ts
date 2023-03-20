import { isDevMode } from '../dev';

describe('isDevMode', () => {
  it('by default, should return false since we are in test', () => {
    const isDev = isDevMode();
    expect(isDev).toBeFalsy();
  });
  it('when in dev mode, should return true', () => {
    process.env.NODE_ENV = 'development';
    const isDev = isDevMode();
    expect(isDev).toBeTruthy();
  });
});
