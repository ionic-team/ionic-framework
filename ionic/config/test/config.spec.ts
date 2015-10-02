import {IonicConfig, IonicPlatform} from 'ionic/ionic';

export function run() {

  it('should set setting object', () => {
    let config = new IonicConfig();
    config.setting({
      name: 'Doc Brown',
      occupation: 'Weather Man'
    });

    expect(config.setting('name')).toEqual('Doc Brown');
    expect(config.setting('name')).toEqual('Doc Brown');
    expect(config.setting('occupation')).toEqual('Weather Man');
    expect(config.setting('occupation')).toEqual('Weather Man');
  });

  it('should get null setting', () => {
    let config = new IonicConfig();

    expect(config.setting('name')).toEqual(null);
    expect(config.setting('name')).toEqual(null);
    expect(config.setting('occupation')).toEqual(null);
    expect(config.setting('occupation')).toEqual(null);
  });

  it('should set/get single setting', () => {
    let config = new IonicConfig();
    config.setting('name', 'Doc Brown');
    config.setting('occupation', 'Weather Man');

    expect(config.setting('name')).toEqual('Doc Brown');
    expect(config.setting('name')).toEqual('Doc Brown');
    expect(config.setting('occupation')).toEqual('Weather Man');
    expect(config.setting('occupation')).toEqual('Weather Man');
  });

  it('should init w/ given config settings', () => {
    let config = new IonicConfig({
      name: 'Doc Brown',
      occupation: 'Weather Man'
    });
    expect(config.setting('name')).toEqual('Doc Brown');
    expect(config.setting('occupation')).toEqual('Weather Man');
  });

  it('should get settings object', () => {
    let config = new IonicConfig({
      name: 'Doc Brown',
      occupation: 'Weather Man'
    });

    expect(config.setting()).toEqual({
      name: 'Doc Brown',
      occupation: 'Weather Man'
    });
  });

}
