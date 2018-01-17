import { queryParam } from '../platform-configs';

describe('QueryParam', () => {
  it('should read the url for a queryParam', () => {
    const qp = queryParam('?boolean=false', 'boolean');
    expect(qp).toBeDefined();
    expect(qp).toEqual('false');
  });

  it('should get the value of  queryParam', () => {
    const qp = queryParam('?keyValue=b', 'keyValue');
    expect(qp).toEqual('b');
  });

  it('should show nullfor a queryParam this is not passed', () => {
    const qp = queryParam('', 'ionicanimate');
    expect(qp).toBeNull();
  });
});
