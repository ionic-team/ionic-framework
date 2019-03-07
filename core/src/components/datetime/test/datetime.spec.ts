import { convertFormatStringToUnicodeTokens } from '../datetime-util';

describe('Datetime', () => {
  describe('convertFormatStringToUnicodeTokens()', () => {
    it('should properly clean format strings accoring to the date-fns syntax', () => {
      const dateFormats = [
        ['YYYY', 'yyyy'],
        ['YYYY-MM-DD', 'yyyy-MM-dd'],
        ['YYYY-MM-DDTHH:mm', "yyyy-MM-dd'T'HH:mm"],
        ['YYYY-MM-DDTHH:mm:ssTZD', "yyyy-MM-dd'T'HH:mm:ssXXX"],
        ['DD-dd-DD', "dd-dd-dd"],
      ]
      
      dateFormats.forEach(format => {
        expect(convertFormatStringToUnicodeTokens(format[0])).toEqual(format[1]);
      })
    });
  });
});