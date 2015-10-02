import {IonicConfig, IonicPlatform} from 'ionic/ionic';

export function run() {

  it('should set setting object', () => {
    let config = new IonicConfig();
    config.setting({
      name: 'Doc Brown',
      occupation: 'Weather Man'
    });

    expect(config.get('name')).toEqual('Doc Brown');
    expect(config.get('name')).toEqual('Doc Brown');
    expect(config.get('occupation')).toEqual('Weather Man');
    expect(config.get('occupation')).toEqual('Weather Man');
  });

  it('should get null setting', () => {
    let config = new IonicConfig();

    expect(config.get('name')).toEqual(null);
    expect(config.get('name')).toEqual(null);
    expect(config.get('occupation')).toEqual(null);
    expect(config.get('occupation')).toEqual(null);
  });

  it('should set/get single setting', () => {
    let config = new IonicConfig();
    config.setting('name', 'Doc Brown');
    config.setting('occupation', 'Weather Man');

    expect(config.get('name')).toEqual('Doc Brown');
    expect(config.get('name')).toEqual('Doc Brown');
    expect(config.get('occupation')).toEqual('Weather Man');
    expect(config.get('occupation')).toEqual('Weather Man');
  });

  it('should init w/ given config settings', () => {
    let config = new IonicConfig({
      name: 'Doc Brown',
      occupation: 'Weather Man'
    });
    expect(config.get('name')).toEqual('Doc Brown');
    expect(config.get('occupation')).toEqual('Weather Man');
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
