import * as util from '../../../ionic/util';

export function run() {
  describe('extend', function() {

    describe('isTrueProperty', function() {

      it('should be true from boolean true', () => {
        expect(util.isTrueProperty(true)).toBe(true);
      });

      it('should be true from string "true"', () => {
        expect(util.isTrueProperty('true')).toBe(true);
        expect(util.isTrueProperty('TRUE')).toBe(true);
        expect(util.isTrueProperty(' true  ')).toBe(true);
      });

      it('should be true from empty string ""', () => {
        expect(util.isTrueProperty('')).toBe(true);
        expect(util.isTrueProperty('  ')).toBe(true);
      });

      it('should be true from number greater than zero', () => {
        expect(util.isTrueProperty(1)).toBe(true);
        expect(util.isTrueProperty(999)).toBe(true);
      });

      it('should be false from boolean false', () => {
        expect(util.isTrueProperty(false)).toBe(false);
      });

      it('should be false from null', () => {
        expect(util.isTrueProperty(null)).toBe(false);
      });

      it('should be false from undefined', () => {
        expect(util.isTrueProperty(undefined)).toBe(false);
      });

      it('should be false from string "false"', () => {
        expect(util.isTrueProperty('false')).toBe(false);
        expect(util.isTrueProperty(' FALSE ')).toBe(false);
        expect(util.isTrueProperty('doesnt actually matter')).toBe(false);
      });

    });

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
