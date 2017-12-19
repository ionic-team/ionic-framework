import { queryParam } from '../platform-configs';

describe('QueryParam', () => {
  it('should read the url for a queryParam', () => {
    let qp = queryParam('?boolean=false', 'boolean');
    expect(qp).toBeDefined();
    expect(qp).toEqual('false');
  });

  it('should get the value of  queryParam', () => {
    let qp = queryParam('?keyValue=b', 'keyValue');
    expect(qp).toEqual('b');
  });

  it('should show nullfor a queryParam this is not passed', () => {
    let qp = queryParam('', 'ionicanimate');
    expect(qp).toBeNull();
  });
});
