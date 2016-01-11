import * as util from 'ionic/util';

export function run() {
  describe('extend', function() {

    it('should extend simple', () => {
      var obj = { a: '0', c: '0' };
      expect( util.assign(obj, { a: '1', b: '2' }) ).toBe(obj);
      expect(obj).toEqual({ a: '1', b: '2', c: '0' });
    });

    it('should extend complex', () => {
      expect(util.assign(
        { a: '0', b: '0' },
        { b: '1', c: '1' },
        { c: '2', d: '2' }
      )).toEqual({
        a: '0',
        b: '1',
        c: '2',
        d: '2'
      });
    });

  });

  describe('defaults', function() {

    it('should simple defaults', () => {
      var obj = { a: '1' };
      expect(util.defaults(obj, { a: '2', b: '2' })).toBe(obj);
      expect(obj).toEqual({
        a: '1', b: '2'
      });
    });

    it('should complex defaults', () => {
      expect(util.defaults(
        { a: '0', b: '0' },
        { b: '1', c: '1', e: '1' },
        { c: '2', d: '2' }
      )).toEqual({
        a: '0',
        b: '0',
        c: '2',
        d: '2',
        e: '1'
      });
    });

  });
}
