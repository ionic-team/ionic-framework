import * as util from '../../../ionic/util';

export function run() {
  describe('extend', function() {

    describe('isCheckedProperty', function() {

      it('should test a=undefined', () => {
        expect(util.isCheckedProperty(undefined, undefined)).toBe(true);
        expect(util.isCheckedProperty(undefined, null)).toBe(true);
        expect(util.isCheckedProperty(undefined, '')).toBe(true);
        expect(util.isCheckedProperty(undefined, 'string')).toBe(false);
        expect(util.isCheckedProperty(undefined, 0)).toBe(false);
        expect(util.isCheckedProperty(undefined, '0')).toBe(false);
        expect(util.isCheckedProperty(undefined, 1000)).toBe(false);
        expect(util.isCheckedProperty(undefined, '1000')).toBe(false);
        expect(util.isCheckedProperty(undefined, -1)).toBe(false);
        expect(util.isCheckedProperty(undefined, true)).toBe(false);
        expect(util.isCheckedProperty(undefined, false)).toBe(false);
        expect(util.isCheckedProperty(undefined, 'true')).toBe(false);
        expect(util.isCheckedProperty(undefined, 'false')).toBe(false);
      });

      it('should test a=null', () => {
        expect(util.isCheckedProperty(null, undefined)).toBe(true);
        expect(util.isCheckedProperty(null, null)).toBe(true);
        expect(util.isCheckedProperty(null, '')).toBe(true);
        expect(util.isCheckedProperty(null, 'string')).toBe(false);
        expect(util.isCheckedProperty(null, 0)).toBe(false);
        expect(util.isCheckedProperty(null, '0')).toBe(false);
        expect(util.isCheckedProperty(null, 1000)).toBe(false);
        expect(util.isCheckedProperty(null, '1000')).toBe(false);
        expect(util.isCheckedProperty(null, -1)).toBe(false);
        expect(util.isCheckedProperty(null, true)).toBe(false);
        expect(util.isCheckedProperty(null, false)).toBe(false);
        expect(util.isCheckedProperty(null, 'true')).toBe(false);
        expect(util.isCheckedProperty(null, 'false')).toBe(false);
      });

      it('should test a=""', () => {
        expect(util.isCheckedProperty('', undefined)).toBe(true);
        expect(util.isCheckedProperty('', null)).toBe(true);
        expect(util.isCheckedProperty('', '')).toBe(true);
        expect(util.isCheckedProperty('', 'string')).toBe(false);
        expect(util.isCheckedProperty('', 0)).toBe(false);
        expect(util.isCheckedProperty('', '0')).toBe(false);
        expect(util.isCheckedProperty('', 1000)).toBe(false);
        expect(util.isCheckedProperty('', '1000')).toBe(false);
        expect(util.isCheckedProperty('', -1)).toBe(false);
        expect(util.isCheckedProperty('', true)).toBe(false);
        expect(util.isCheckedProperty('', false)).toBe(false);
        expect(util.isCheckedProperty('', 'true')).toBe(false);
        expect(util.isCheckedProperty('', 'false')).toBe(false);
      });

      it('should test a=true', () => {
        expect(util.isCheckedProperty(true, undefined)).toBe(false);
        expect(util.isCheckedProperty(true, null)).toBe(false);
        expect(util.isCheckedProperty(true, '')).toBe(false);
        expect(util.isCheckedProperty(true, 'string')).toBe(false);
        expect(util.isCheckedProperty(true, 0)).toBe(false);
        expect(util.isCheckedProperty(true, '0')).toBe(false);
        expect(util.isCheckedProperty(true, 1000)).toBe(false);
        expect(util.isCheckedProperty(true, '1000')).toBe(false);
        expect(util.isCheckedProperty(true, -1)).toBe(false);
        expect(util.isCheckedProperty(true, true)).toBe(true);
        expect(util.isCheckedProperty(true, false)).toBe(false);
        expect(util.isCheckedProperty(true, 'true')).toBe(true);
        expect(util.isCheckedProperty(true, 'false')).toBe(false);
      });

      it('should test a="true"', () => {
        expect(util.isCheckedProperty('true', undefined)).toBe(false);
        expect(util.isCheckedProperty('true', null)).toBe(false);
        expect(util.isCheckedProperty('true', '')).toBe(false);
        expect(util.isCheckedProperty('true', 'string')).toBe(false);
        expect(util.isCheckedProperty('true', 0)).toBe(false);
        expect(util.isCheckedProperty('true', '0')).toBe(false);
        expect(util.isCheckedProperty('true', 1000)).toBe(false);
        expect(util.isCheckedProperty('true', '1000')).toBe(false);
        expect(util.isCheckedProperty('true', -1)).toBe(false);
        expect(util.isCheckedProperty('true', true)).toBe(true);
        expect(util.isCheckedProperty('true', false)).toBe(false);
        expect(util.isCheckedProperty('true', 'true')).toBe(true);
        expect(util.isCheckedProperty('true', 'false')).toBe(false);
      });

      it('should test a=false', () => {
        expect(util.isCheckedProperty(false, undefined)).toBe(false);
        expect(util.isCheckedProperty(false, null)).toBe(false);
        expect(util.isCheckedProperty(false, '')).toBe(false);
        expect(util.isCheckedProperty(false, 'string')).toBe(false);
        expect(util.isCheckedProperty(false, 0)).toBe(false);
        expect(util.isCheckedProperty(false, '0')).toBe(false);
        expect(util.isCheckedProperty(false, 1000)).toBe(false);
        expect(util.isCheckedProperty(false, '1000')).toBe(false);
        expect(util.isCheckedProperty(false, -1)).toBe(false);
        expect(util.isCheckedProperty(false, true)).toBe(false);
        expect(util.isCheckedProperty(false, false)).toBe(true);
        expect(util.isCheckedProperty(false, 'true')).toBe(false);
        expect(util.isCheckedProperty(false, 'false')).toBe(true);
      });

      it('should test a="false"', () => {
        expect(util.isCheckedProperty('false', undefined)).toBe(false);
        expect(util.isCheckedProperty('false', null)).toBe(false);
        expect(util.isCheckedProperty('false', '')).toBe(false);
        expect(util.isCheckedProperty('false', 'string')).toBe(false);
        expect(util.isCheckedProperty('false', 0)).toBe(false);
        expect(util.isCheckedProperty('false', '0')).toBe(false);
        expect(util.isCheckedProperty('false', 1000)).toBe(false);
        expect(util.isCheckedProperty('false', '1000')).toBe(false);
        expect(util.isCheckedProperty('false', -1)).toBe(false);
        expect(util.isCheckedProperty('false', true)).toBe(false);
        expect(util.isCheckedProperty('false', false)).toBe(true);
        expect(util.isCheckedProperty('false', 'true')).toBe(false);
        expect(util.isCheckedProperty('false', 'false')).toBe(true);
      });

      it('should test a=0', () => {
        expect(util.isCheckedProperty(0, undefined)).toBe(false);
        expect(util.isCheckedProperty(0, null)).toBe(false);
        expect(util.isCheckedProperty(0, '')).toBe(false);
        expect(util.isCheckedProperty(0, 'string')).toBe(false);
        expect(util.isCheckedProperty(0, 0)).toBe(true);
        expect(util.isCheckedProperty(0, '0')).toBe(true);
        expect(util.isCheckedProperty(0, 1000)).toBe(false);
        expect(util.isCheckedProperty(0, '1000')).toBe(false);
        expect(util.isCheckedProperty(0, -1)).toBe(false);
        expect(util.isCheckedProperty(0, true)).toBe(false);
        expect(util.isCheckedProperty(0, false)).toBe(false);
        expect(util.isCheckedProperty(0, 'true')).toBe(false);
        expect(util.isCheckedProperty(0, 'false')).toBe(false);
      });

      it('should test a="0"', () => {
        expect(util.isCheckedProperty('0', undefined)).toBe(false);
        expect(util.isCheckedProperty('0', null)).toBe(false);
        expect(util.isCheckedProperty('0', '')).toBe(false);
        expect(util.isCheckedProperty('0', 'string')).toBe(false);
        expect(util.isCheckedProperty('0', 0)).toBe(true);
        expect(util.isCheckedProperty('0', '0')).toBe(true);
        expect(util.isCheckedProperty('0', 1000)).toBe(false);
        expect(util.isCheckedProperty('0', '1000')).toBe(false);
        expect(util.isCheckedProperty('0', -1)).toBe(false);
        expect(util.isCheckedProperty('0', true)).toBe(false);
        expect(util.isCheckedProperty('0', false)).toBe(false);
        expect(util.isCheckedProperty('0', 'true')).toBe(false);
        expect(util.isCheckedProperty('0', 'false')).toBe(false);
      });

      it('should test a=1000', () => {
        expect(util.isCheckedProperty(1000, undefined)).toBe(false);
        expect(util.isCheckedProperty(1000, null)).toBe(false);
        expect(util.isCheckedProperty(1000, '')).toBe(false);
        expect(util.isCheckedProperty(1000, 'string')).toBe(false);
        expect(util.isCheckedProperty(1000, 0)).toBe(false);
        expect(util.isCheckedProperty(1000, '0')).toBe(false);
        expect(util.isCheckedProperty(1000, 1000)).toBe(true);
        expect(util.isCheckedProperty(1000, '1000')).toBe(true);
        expect(util.isCheckedProperty(1000, -1)).toBe(false);
        expect(util.isCheckedProperty(1000, true)).toBe(false);
        expect(util.isCheckedProperty(1000, false)).toBe(false);
        expect(util.isCheckedProperty(1000, 'true')).toBe(false);
        expect(util.isCheckedProperty(1000, 'false')).toBe(false);
      });

      it('should test a="1000"', () => {
        expect(util.isCheckedProperty('1000', undefined)).toBe(false);
        expect(util.isCheckedProperty('1000', null)).toBe(false);
        expect(util.isCheckedProperty('1000', '')).toBe(false);
        expect(util.isCheckedProperty('1000', 'string')).toBe(false);
        expect(util.isCheckedProperty('1000', 0)).toBe(false);
        expect(util.isCheckedProperty('1000', '0')).toBe(false);
        expect(util.isCheckedProperty('1000', 1000)).toBe(true);
        expect(util.isCheckedProperty('1000', '1000')).toBe(true);
        expect(util.isCheckedProperty('1000', -1)).toBe(false);
        expect(util.isCheckedProperty('1000', true)).toBe(false);
        expect(util.isCheckedProperty('1000', false)).toBe(false);
        expect(util.isCheckedProperty('1000', 'true')).toBe(false);
        expect(util.isCheckedProperty('1000', 'false')).toBe(false);
      });

      it('should test a=-1', () => {
        expect(util.isCheckedProperty(-1, undefined)).toBe(false);
        expect(util.isCheckedProperty(-1, null)).toBe(false);
        expect(util.isCheckedProperty(-1, '')).toBe(false);
        expect(util.isCheckedProperty(-1, 'string')).toBe(false);
        expect(util.isCheckedProperty(-1, 0)).toBe(false);
        expect(util.isCheckedProperty(-1, '0')).toBe(false);
        expect(util.isCheckedProperty(-1, 1000)).toBe(false);
        expect(util.isCheckedProperty(-1, '1000')).toBe(false);
        expect(util.isCheckedProperty(-1, -1)).toBe(true);
        expect(util.isCheckedProperty(-1, true)).toBe(false);
        expect(util.isCheckedProperty(-1, false)).toBe(false);
        expect(util.isCheckedProperty(-1, 'true')).toBe(false);
        expect(util.isCheckedProperty(-1, 'false')).toBe(false);
      });

      it('should test a="-1"', () => {
        expect(util.isCheckedProperty('-1', undefined)).toBe(false);
        expect(util.isCheckedProperty('-1', null)).toBe(false);
        expect(util.isCheckedProperty('-1', '')).toBe(false);
        expect(util.isCheckedProperty('-1', 'string')).toBe(false);
        expect(util.isCheckedProperty('-1', 0)).toBe(false);
        expect(util.isCheckedProperty('-1', '0')).toBe(false);
        expect(util.isCheckedProperty('-1', 1000)).toBe(false);
        expect(util.isCheckedProperty('-1', '1000')).toBe(false);
        expect(util.isCheckedProperty('-1', -1)).toBe(true);
        expect(util.isCheckedProperty('-1', true)).toBe(false);
        expect(util.isCheckedProperty('-1', false)).toBe(false);
        expect(util.isCheckedProperty('-1', 'true')).toBe(false);
        expect(util.isCheckedProperty('-1', 'false')).toBe(false);
      });

      it('should test a="string"', () => {
        expect(util.isCheckedProperty('string', undefined)).toBe(false);
        expect(util.isCheckedProperty('string', null)).toBe(false);
        expect(util.isCheckedProperty('string', '')).toBe(false);
        expect(util.isCheckedProperty('string', 'string')).toBe(true);
        expect(util.isCheckedProperty('string', 'otherstring')).toBe(false);
        expect(util.isCheckedProperty('string', 0)).toBe(false);
        expect(util.isCheckedProperty('string', '0')).toBe(false);
        expect(util.isCheckedProperty('string', 1000)).toBe(false);
        expect(util.isCheckedProperty('string', '1000')).toBe(false);
        expect(util.isCheckedProperty('string', -1)).toBe(false);
        expect(util.isCheckedProperty('string', true)).toBe(false);
        expect(util.isCheckedProperty('string', false)).toBe(false);
        expect(util.isCheckedProperty('string', 'true')).toBe(false);
        expect(util.isCheckedProperty('string', 'false')).toBe(false);
      });

    });

    describe('getQuerystring', function() {
      it('should have no entries for empty url', () => {
        expect(util.getQuerystring('')).toEqual({});
        expect(util.getQuerystring(null)).toEqual({});
        expect(util.getQuerystring(undefined)).toEqual({});
      });

      it('should have no entries when without ?', () => {
        expect(util.getQuerystring('http://localhost:1234/')).toEqual({});
      });

      it('should have no entries with only ?', () => {
        expect(util.getQuerystring('http://localhost:1234/?')).toEqual({});
      });

      it('should have no entries for key with no =', () => {
        expect(util.getQuerystring('http://localhost:1234/?key')).toEqual({});
      });

      it('should have no entries with only #?', () => {
        expect(util.getQuerystring('http://localhost:1234/#?')).toEqual({});
      });

      it('should have no entries with only #?=', () => {
        expect(util.getQuerystring('http://localhost:1234/#?=')).toEqual({});
      });

      it('should have no entries for url with no "?" character', () => {
        expect(util.getQuerystring('http://localhost:1234/#key1=1&key2=2')).toEqual({});
      });

      it('should contain key/value entries for all the parameters after "?" character', () => {
        expect(util.getQuerystring('http://localhost:1234/#key1=1&key2x=2x?key3=3&key4=4')).toEqual({
          key3: '3',
          key4: '4'
        });
      });

      it('should lowercase param keys', () => {
        expect(util.getQuerystring('http://localhost:1234/#?KEY1=1&kEy2=2')).toEqual({
          key1: '1',
          key2: '2'
        });
      });

      it('should not include any values when # comes after ?', () => {
        expect(util.getQuerystring('http://localhost:1234/?key1=1#key2=2')).toEqual({
          key1: '1'
        });
      });

      it('should ignore empty ?& and &&', () => {
        expect(util.getQuerystring('http://localhost:1234/#?&&')).toEqual({});

        expect(util.getQuerystring('http://localhost:1234/#?&&key1=1&key2=2&&')).toEqual({
          key1: '1',
          key2: '2'
        });
      });

      it('should get "" when key has no value', () => {
        expect(util.getQuerystring('http://localhost:1234/#?key=')).toEqual({
          key: ''
        });
      });

    });

    describe('isTrueProperty', function() {

      it('should be true from boolean true', () => {
        expect(util.isTrueProperty(true)).toBe(true);
      });

      it('should be true from string "true"', () => {
        expect(util.isTrueProperty('true')).toBe(true);
        expect(util.isTrueProperty('TRUE')).toBe(true);
        expect(util.isTrueProperty(' true  ')).toBe(true);
      });

      it('should be true from string "on"', () => {
        expect(util.isTrueProperty(true)).toBe(true);
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

      it('should be false from string "off"', () => {
        expect(util.isTrueProperty(true)).toBe(true);
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
