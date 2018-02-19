import { readQueryParam } from '../platform-configs';

describe('readQueryParam', () => {
  it('should read the url for a queryParam', () => {
    const qp = readQueryParam('?boolean=false', 'boolean');
    expect(qp).toBeDefined();
    expect(qp).toEqual('false');
  });

  it('should get the value of  queryParam', () => {
    const qp = readQueryParam('?keyValue=b', 'keyValue');
    expect(qp).toEqual('b');
  });

  it('should show null for a queryParam this is not passed', () => {
    const qp = readQueryParam('', 'ionicanimate');
    expect(qp).toBeNull();
  });

  it('should get some params', () => {
    const url = 'http://www.google.com/blah?taco=yum&burrito=yesplease&enchillada=dope';
    expect(readQueryParam(url, 'taco')).toEqual('yum');
    expect(readQueryParam(url, 'burrito')).toEqual('yesplease');
    expect(readQueryParam(url, 'enchillada')).toEqual('dope');
  });
});
