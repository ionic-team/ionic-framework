import { createConfigController } from '../config-controller';

describe('Config', () => {
  it('should get a value from the config', () => {
    const config = createConfigController({ name: 'Doc Brown' }, null);
    expect(config.get('name')).toEqual('Doc Brown');
  });
});
