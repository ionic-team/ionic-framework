import { QueryParams } from '../query-params';


describe('QueryParams', () => {

  it('should get case insensitive querystring value', () => {
    let qp = new QueryParams();
    qp.parseUrl('/?KEY=value');
    expect(qp.get('key')).toEqual('value');
  });

  it('should get querystring value', () => {
    let qp = new QueryParams();
    qp.parseUrl('/?key=value');
    expect(qp.get('key')).toEqual('value');
  });

  it('should have no entries for empty url', () => {
    let qp = new QueryParams();
    qp.parseUrl('');
    expect(qp.data).toEqual({});

    qp = new QueryParams();
    qp.parseUrl(null);
    expect(qp.data).toEqual({});

    qp = new QueryParams();
    qp.parseUrl(undefined);
    expect(qp.data).toEqual({});
  });

  it('should have no entries when without ?', () => {
    let qp = new QueryParams();
    qp.parseUrl('http://localhost:1234/');
    expect(qp.data).toEqual({});
  });

  it('should have no entries with only ?', () => {
    let qp = new QueryParams();
    qp.parseUrl('http://localhost:1234/?');
    expect(qp.data).toEqual({});
  });

  it('should have no entries for key with no =', () => {
    let qp = new QueryParams();
    qp.parseUrl('http://localhost:1234/?key');
    expect(qp.data).toEqual({});
  });

  it('should have no entries with only #?', () => {
    let qp = new QueryParams();
    qp.parseUrl('http://localhost:1234/#?');
    expect(qp.data).toEqual({});
  });

  it('should have no entries with only #?=', () => {
    let qp = new QueryParams();
    qp.parseUrl('http://localhost:1234/#?=');
    expect(qp.data).toEqual({});
  });

  it('should have no entries for url with no "?" character', () => {
    let qp = new QueryParams();
    qp.parseUrl('http://localhost:1234/#key1=1&key2=2');
    expect(qp.data).toEqual({});
  });

  it('should contain key/value entries for all the parameters after "?" character', () => {
    let qp = new QueryParams();
    qp.parseUrl('http://localhost:1234/#key1=1&key2x=2x?key3=3&key4=4');
    expect(qp.data).toEqual({
      key3: '3',
      key4: '4'
    });
  });

  it('should lowercase param keys', () => {
    let qp = new QueryParams();
    qp.parseUrl('http://localhost:1234/#?KEY1=1&kEy2=2');
    expect(qp.data).toEqual({
      key1: '1',
      key2: '2'
    });
  });

  it('should not include any values when # comes after ?', () => {
    let qp = new QueryParams();
    qp.parseUrl('http://localhost:1234/?key1=1#key2=2');
    expect(qp.data).toEqual({
      key1: '1'
    });
  });

  it('should ignore empty ?& and &&', () => {
    let qp = new QueryParams();
    qp.parseUrl('http://localhost:1234/#?&&');
    expect(qp.data).toEqual({});

    qp = new QueryParams();
    qp.parseUrl('http://localhost:1234/#?&&key1=1&key2=2&&');
    expect(qp.data).toEqual({
      key1: '1',
      key2: '2'
    });
  });

  it('should get "" when key has no value', () => {
    let qp = new QueryParams();
    qp.parseUrl('http://localhost:1234/#?key=');
    expect(qp.data).toEqual({
      key: ''
    });
  });

});
