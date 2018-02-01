
import { NgZone } from '@angular/core';
import { DateTime } from '../datetime';
import { Form } from '../../../util/form';
import { Picker } from '../../picker/picker';
import { PickerController } from '../../picker/picker-controller';
import * as datetimeUtil from '../../../util/datetime-util';
import { mockApp, mockConfig, mockElementRef, mockRenderer } from '../../../util/mock-providers';


describe('DateTime', () => {
  // TODO
  // pass commonInputTest()

  describe('validate', () => {

    it('should restrict January 1-14, 2000 from selection, then allow it, and restrict December 15-31, 2001', () => {
      datetime.max = '2001-12-15';
      datetime.min = '2000-01-15';
      datetime.pickerFormat = 'MM DD YYYY';
      datetime.generate();

      var columns = picker.getColumns();
      columns[0].selectedIndex = 0; // January
      columns[1].selectedIndex = 0; // January 1st
      columns[2].selectedIndex = 1; // January 1st, 2000

      datetime.validate();

      expect(columns[1].options[0].disabled).toEqual(true);
      expect(columns[1].options[13].disabled).toEqual(true);
      expect(columns[1].options[14].disabled).toEqual(false);

      columns[0].selectedIndex = 11; // December
      columns[2].selectedIndex = 0; // December 1st, 2001

      datetime.validate();

      expect(columns[0].options[11].disabled).toEqual(false);

      expect(columns[1].options[14].disabled).toEqual(false);
      expect(columns[1].options[15].disabled).toEqual(true);
      expect(columns[1].options[30].disabled).toEqual(true);
    });

    it('should restrict January 2000 from selection, then allow it, and restrict December 2010', () => {
      datetime.max = '2010-11-15';
      datetime.min = '2000-02-15';
      datetime.pickerFormat = 'MM DD YYYY';
      datetime.generate();

      var columns = picker.getColumns();
      columns[0].selectedIndex = 1; // February
      columns[1].selectedIndex = 0; // February 1st
      columns[2].selectedIndex = columns[2].options.length - 1; // February 1st, 2000

      datetime.validate();

      expect(columns[0].options[0].disabled).toEqual(true);
      expect(columns[0].options[1].disabled).toEqual(false);
      expect(columns[0].options[11].disabled).toEqual(false);

      columns[2].selectedIndex = 0; // December 1st, 2010

      datetime.validate();

      expect(columns[0].options[0].disabled).toEqual(false);
      expect(columns[0].options[10].disabled).toEqual(false);
      expect(columns[0].options[11].disabled).toEqual(true);
    });

    it('should only show 31 valid days in the selected 31 day month, then reset for 28 day, then to 30', () => {
      datetime.max = '2010-12-31';
      datetime.min = '2000-01-01';
      datetime.pickerFormat = 'MM DD YYYY';

      datetime.generate();

      var columns = picker.getColumns();
      columns[0].selectedIndex = 0; // January
      columns[1].selectedIndex = 0; // January 1st
      columns[2].selectedIndex = 0; // January 1st, 2010

      datetime.validate();

      for (var i = 0; i < 31; i++) {
        expect(columns[1].options[i].disabled).toEqual(false);
      }

      columns[0].selectedIndex = 1; // February
      datetime.validate();

      for (let i = 0; i < 28; i++) {
        expect(columns[1].options[i].disabled).toEqual(false);
      }
      expect(columns[1].options[28].disabled).toEqual(true);
      expect(columns[1].options[29].disabled).toEqual(true);
      expect(columns[1].options[30].disabled).toEqual(true);

      columns[0].selectedIndex = 3; // April
      datetime.validate();

      for (let i = 0; i < 30; i++) {
        expect(columns[1].options[i].disabled).toEqual(false);
      }
      expect(columns[1].options[30].disabled).toEqual(true);
    });

    it('should enable all of the values given', () => {
      datetime.monthValues = '6,7,8';
      datetime.dayValues = '01,02,03,04,05,06,08,09,10, 11, 12, 13, 31';
      datetime.yearValues = '2014,2015';

      datetime.pickerFormat = 'MM DD YYYY';

      datetime.generate();

      var columns = picker.getColumns();

      expect(columns[0].options.length).toEqual(3); // months
      expect(columns[1].options.length).toEqual(13); // days
      expect(columns[2].options.length).toEqual(2); // years

      columns[0].selectedIndex = 1; // July
      datetime.validate();

      // Months
      for (var i = 0; i < columns[0].options.length; i++) {
        expect(columns[0].options[i].disabled).toEqual(false);
      }

      // // Days
      for (let i = 0; i < columns[1].options.length; i++) {
        expect(columns[1].options[i].disabled).toEqual(false);
      }

      columns[0].selectedIndex = 0; // June
      datetime.validate();

      expect(columns[1].options[12].disabled).toEqual(true);
    });

    it('should always return a string', () => {
      datetime.monthValues = '6,7,8';
      datetime.dayValues = '01,02,03,04,05,06,08,09,10, 11, 12, 13, 31';
      datetime.yearValues = '2014,2015';

      datetime.registerOnChange((value: string) => {
        expect(value).toEqual(jasmine.any(String));
      });
    });

    it('should return a string when setValue is passed an object', zoned(() => {
      const dateTimeData = {
        hour: {
          text: '12',
          value: 12,
        },
        minute: {
          text: '09',
          value: 9,
        },
        ampm: {
          text: 'pm',
          value: 'pm',
        },
      };

      datetime.setValue(dateTimeData);

      datetime.registerOnChange((value: string) => {
        expect(value).toEqual(jasmine.any(String));
      });
    }));
  });

  describe('writeValue', () => {

    it('should updateText with default MMM D, YYYY when no displayFormat or pickerFormat', zoned(() => {
      datetime.ngAfterContentInit();
      datetime.writeValue('1994-12-15T13:47:20.789Z');

      expect(datetime._text).toEqual('Dec 15, 1994');
    }));

    it('should updateText with pickerFormat when no displayFormat', zoned(() => {
      datetime.pickerFormat = 'YYYY';
      datetime.ngAfterContentInit();
      datetime.writeValue('1994-12-15T13:47:20.789Z');

      expect(datetime._text).toEqual('1994');
    }));

    it('should updateText with displayFormat when no pickerFormat', zoned(() => {
      datetime.displayFormat = 'YYYY';
      datetime.ngAfterContentInit();
      datetime.writeValue('1994-12-15T13:47:20.789Z');

      expect(datetime._text).toEqual('1994');
    }));

  });

  describe('generate', () => {

    it('should generate with default MMM D, YYYY when no displayFormat or pickerFormat', zoned(() => {
      datetime.monthShortNames = customLocale.monthShortNames;
      datetime.ngAfterContentInit();
      datetime.setValue('1994-12-15T13:47:20.789Z');

      datetime.generate();
      var columns = picker.getColumns();

      expect(columns.length).toEqual(3);
      expect(columns[0].name).toEqual('month');
      expect(columns[1].name).toEqual('day');
      expect(columns[2].name).toEqual('year');
    }));

    it('should generate with only displayFormat', zoned(() => {
      datetime.monthShortNames = customLocale.monthShortNames;
      datetime.ngAfterContentInit();
      datetime.displayFormat = 'YYYY';
      datetime.setValue('1994-12-15T13:47:20.789Z');

      datetime.generate();
      var columns = picker.getColumns();

      expect(columns.length).toEqual(1);
      expect(columns[0].name).toEqual('year');
    }));

    it('should generate with only pickerFormat', zoned(() => {
      datetime.monthShortNames = customLocale.monthShortNames;
      datetime.ngAfterContentInit();
      datetime.pickerFormat = 'YYYY';
      datetime.setValue('1994-12-15T13:47:20.789Z');

      datetime.generate();
      var columns = picker.getColumns();

      expect(columns.length).toEqual(1);
      expect(columns[0].name).toEqual('year');
    }));

    it('should generate with custom locale short month names from input property', zoned(() => {
      datetime.monthShortNames = customLocale.monthShortNames;
      datetime.ngAfterContentInit();
      datetime.pickerFormat = 'MMM YYYY';
      datetime.setValue('1994-12-15T13:47:20.789Z');

      datetime.generate();
      var columns = picker.getColumns();

      expect(columns.length).toEqual(2);
      expect(columns[0].name).toEqual('month');
      expect(columns[0].options[0].value).toEqual(1);
      expect(columns[0].options[0].text).toEqual('jan');
    }));

    it('should generate with custom locale full month names from input property', zoned(() => {
      datetime.monthNames = customLocale.monthNames;
      datetime.ngAfterContentInit();
      datetime.pickerFormat = 'MMMM YYYY';
      datetime.setValue('1994-12-15T13:47:20.789Z');

      datetime.generate();
      var columns = picker.getColumns();

      expect(columns.length).toEqual(2);
      expect(columns[0].name).toEqual('month');
      expect(columns[0].options[0].value).toEqual(1);
      expect(columns[0].options[0].text).toEqual('janeiro');
    }));

    it('should replace a picker format with both a day name and a numeric day to use only the numeric day', zoned(() => {
      datetime.pickerFormat = 'DDDD D M YYYY';
      datetime.setValue('1994-12-15T13:47:20.789Z');

      datetime.generate();
      var columns = picker.getColumns();

      expect(columns.length).toEqual(3);
      expect(columns[0].name).toEqual('day');
      expect(columns[0].options[0].value).toEqual(1);
      expect(columns[0].options[0].text).toEqual('1');
    }));

    it('should replace a picker format with only a day name to use a numeric day instead', zoned(() => {
      datetime.pickerFormat = 'DDDD M YYYY';
      datetime.setValue('1994-12-15T13:47:20.789Z');

      datetime.generate();
      var columns = picker.getColumns();

      expect(columns.length).toEqual(3);
      expect(columns[0].name).toEqual('day');
      expect(columns[0].options[0].value).toEqual(1);
      expect(columns[0].options[0].text).toEqual('1');
    }));

    it('should generate MM DD YYYY pickerFormat with min/max', () => {
      datetime.max = '2010-12-31';
      datetime.min = '2000-01-01';
      datetime.pickerFormat = 'MM DD YYYY';

      datetime.generate();
      var columns = picker.getColumns();

      expect(columns.length).toEqual(3);
      expect(columns[0].options.length).toEqual(12);
      expect(columns[0].options[0].value).toEqual(1);
      expect(columns[0].options[11].value).toEqual(12);

      expect(columns[1].options.length).toEqual(31);
      expect(columns[1].options[0].value).toEqual(1);
      expect(columns[1].options[30].value).toEqual(31);

      expect(columns[2].options.length).toEqual(11);
      expect(columns[2].options[0].value).toEqual(2010);
      expect(columns[2].options[10].value).toEqual(2000);
    });

    it('should generate YYYY pickerFormat with min/max', () => {
      datetime.max = '2010-01-01';
      datetime.min = '2000-01-01';
      datetime.pickerFormat = 'YYYY';

      datetime.generate();
      var columns = picker.getColumns();

      expect(columns.length).toEqual(1);
      expect(columns[0].options.length).toEqual(11);
      expect(columns[0].options[0].value).toEqual(2010);
      expect(columns[0].options[10].value).toEqual(2000);
    });

  });

  describe('calcMinMax', () => {

    it('should max date with no max input, but has yearValues input', () => {
      datetime.yearValues = '2000,1996,1992';
      datetime.calcMinMax();
      expect(datetime._max.year).toEqual(2000);
      expect(datetime._max.month).toEqual(12);
      expect(datetime._max.day).toEqual(31);
      expect(datetime._max.hour).toEqual(23);
      expect(datetime._max.minute).toEqual(59);
      expect(datetime._max.second).toEqual(59);
    });

    it('should min date with no min input, but has yearValues input', () => {
      datetime.yearValues = '2000,1996,1992';
      datetime.calcMinMax();
      expect(datetime._min.year).toEqual(1992);
      expect(datetime._min.month).toEqual(1);
      expect(datetime._min.day).toEqual(1);
      expect(datetime._min.hour).toEqual(0);
      expect(datetime._min.minute).toEqual(0);
      expect(datetime._min.second).toEqual(0);
    });

    it('should min date with only YYYY', () => {
      datetime.min = '1994';
      datetime.calcMinMax();
      expect(datetime._min.year).toEqual(1994);
      expect(datetime._min.month).toEqual(1);
      expect(datetime._min.day).toEqual(1);
      expect(datetime._min.hour).toEqual(0);
      expect(datetime._min.minute).toEqual(0);
      expect(datetime._min.second).toEqual(0);
    });

    it('should max date with only YYYY', () => {
      datetime.max = '1994';
      datetime.calcMinMax();
      expect(datetime._max.year).toEqual(1994);
      expect(datetime._max.month).toEqual(12);
      expect(datetime._max.day).toEqual(31);
      expect(datetime._max.hour).toEqual(23);
      expect(datetime._max.minute).toEqual(59);
      expect(datetime._max.second).toEqual(59);
    });

    it('should set max and min date when neither set', () => {
      const todaysDate = new Date();
      todaysDate.setFullYear(1994);

      datetime.calcMinMax(todaysDate);

      expect(datetime._min.year).toEqual(1894);
      expect(datetime._max.year).toEqual(1994);
    });

    it('should set max date when min date far back in time, and only min set', () => {
      const todaysDate = new Date();
      todaysDate.setFullYear(1994);

      datetime.min = '1776';
      datetime.calcMinMax(todaysDate);

      expect(datetime._min.year).toEqual(1776);
      expect(datetime._max.year).toEqual(1994);
    });

    it('should reset min.day when greater than max.day and the same year and month', () => {
      datetime.min = '1994-12-18T13:47:20.789Z';
      datetime.max = '1994-12-15T13:47:20.789Z';
      datetime.calcMinMax();

      expect(datetime._min.year).toEqual(1994);
      expect(datetime._min.month).toEqual(12);
      expect(datetime._min.day).toEqual(1);
      expect(datetime._max.year).toEqual(1994);
      expect(datetime._max.month).toEqual(12);
      expect(datetime._max.day).toEqual(15);
    });

    it('should reset min.month when greater than max.month and the same year', () => {
      datetime.min = '1994-12-15T13:47:20.789Z';
      datetime.max = '1994-10-15T13:47:20.789Z';
      datetime.calcMinMax();

      expect(datetime._min.year).toEqual(1994);
      expect(datetime._min.month).toEqual(1);
      expect(datetime._max.year).toEqual(1994);
      expect(datetime._max.month).toEqual(10);
    });

    it('should reset min.year when greater than max.year', () => {
      datetime.min = '1876';
      datetime.max = '1776';
      datetime.calcMinMax();

      expect(datetime._min.year).toEqual(1676);
      expect(datetime._max.year).toEqual(1776);
    });

    it('should set min date when max date far back in time, and only max set', () => {
      datetime.max = '1776';
      datetime.calcMinMax();

      expect(datetime._min.year).toEqual(1676);
      expect(datetime._max.year).toEqual(1776);
    });

    it('should max date from max input string', () => {
      datetime.max = '1994-12-15T13:47:20.789Z';
      datetime.calcMinMax();
      expect(datetime._max.year).toEqual(1994);
      expect(datetime._max.month).toEqual(12);
      expect(datetime._max.day).toEqual(15);
      expect(datetime._max.hour).toEqual(13);
      expect(datetime._max.minute).toEqual(47);
      expect(datetime._max.second).toEqual(20);
      expect(datetime._max.millisecond).toEqual(789);
    });

    it('should min date from max input string', () => {
      datetime.min = '0123-01-05T00:05:00.009Z';
      datetime.calcMinMax();
      expect(datetime._min.year).toEqual(123);
      expect(datetime._min.month).toEqual(1);
      expect(datetime._min.day).toEqual(5);
      expect(datetime._min.hour).toEqual(0);
      expect(datetime._min.minute).toEqual(5);
      expect(datetime._min.second).toEqual(0);
      expect(datetime._min.millisecond).toEqual(9);
    });

    it('should default max date when not set', () => {
      datetime.calcMinMax();
      expect(datetime._max.year).toEqual(new Date().getFullYear());
      expect(datetime._max.month).toEqual(12);
      expect(datetime._max.day).toEqual(31);
      expect(datetime._max.hour).toEqual(23);
      expect(datetime._max.minute).toEqual(59);
      expect(datetime._max.second).toEqual(59);
    });

    it('should default min date when not set', () => {
      datetime.calcMinMax();
      expect(datetime._min.year).toEqual(new Date().getFullYear() - 100);
      expect(datetime._min.month).toEqual(1);
      expect(datetime._min.day).toEqual(1);
      expect(datetime._min.hour).toEqual(0);
      expect(datetime._min.minute).toEqual(0);
      expect(datetime._min.second).toEqual(0);
    });

  });

  describe('defaultValue', () => {
    it('should default to now if no initial value or bounds supplied', () => {
      const now = datetimeUtil.parseDate(new Date().toISOString());
      datetime.pickerFormat = 'YYYY-MM-DDThh:mm';
      datetime.generate();
      var columns = picker.getColumns();
      expect(columns[0].options[columns[0].selectedIndex].value).toEqual(now.year);
      expect(columns[1].options[columns[1].selectedIndex].value).toEqual(now.month);
      expect(columns[2].options[columns[2].selectedIndex].value).toEqual(now.day);
      expect(columns[3].options[columns[3].selectedIndex].value).toEqual(now.hour % 12);
      expect(columns[4].options[columns[4].selectedIndex].value).toEqual(now.minute);
    });

    it('should default to max if no initial value supplied but max specified and max before current', () => {
      datetime.max = '1987-10-19';
      datetime.generate();
      var columns = picker.getColumns();
      expect(columns[0].options[columns[0].selectedIndex].value).toEqual(10);
      expect(columns[1].options[columns[1].selectedIndex].value).toEqual(19);
      expect(columns[2].options[columns[2].selectedIndex].value).toEqual(1987);
    });

    it('should default to current if no initial value supplied but max specified and max after current', () => {
      const now = datetimeUtil.parseDate(new Date().toISOString());
      datetime.max = '2100-10-19';
      datetime.generate();
      var columns = picker.getColumns();
      expect(columns[0].options[columns[0].selectedIndex].value).toEqual(now.month);
      expect(columns[1].options[columns[1].selectedIndex].value).toEqual(now.day);
      expect(columns[2].options[columns[2].selectedIndex].value).toEqual(now.year);
    });

    it('should use pickerDefault if has no value', zoned(() => {
      datetime.max = '2100-12-31';
      datetime.pickerFormat = 'DD MMMM YYYY';
      datetime.initialValue = '2004-08-06';

      datetime.generate();
      var columns = picker.getColumns();

      expect(columns[0].options[columns[0].selectedIndex].value).toEqual(6);
      expect(columns[1].options[columns[1].selectedIndex].value).toEqual(8);
      expect(columns[2].options[columns[2].selectedIndex].value).toEqual(2004);
    }));

  });

  describe('setValue', () => {

    it('should update existing time value with 12-hour PM DateTimeData value', zoned(() => {
      var d = '13:47:20.789Z';
      datetime.setValue(d);

      var dateTimeData = {
        hour: {
          text: '12',
          value: 12,
        },
        minute: {
          text: '09',
          value: 9,
        },
        ampm: {
          text: 'pm',
          value: 'pm',
        },
      };
      datetime.setValue(dateTimeData);

      expect(datetime.getValue().hour).toEqual(12);
      expect(datetime.getValue().minute).toEqual(9);
      expect(datetime.getValue().second).toEqual(20);

      dateTimeData.hour.value = 1;
      datetime.setValue(dateTimeData);

      expect(datetime.getValue().hour).toEqual(13);
      expect(datetime.getValue().minute).toEqual(9);
      expect(datetime.getValue().second).toEqual(20);
    }));

    it('should update existing time value with 12-hour AM DateTimeData value', zoned(() => {
      var d = '13:47:20.789Z';
      datetime.setValue(d);

      var dateTimeData = {
        hour: {
          text: '12',
          value: 12,
        },
        minute: {
          text: '09',
          value: 9,
        },
        ampm: {
          text: 'am',
          value: 'am',
        },
      };
      datetime.setValue(dateTimeData);

      expect(datetime.getValue().hour).toEqual(0);
      expect(datetime.getValue().minute).toEqual(9);
      expect(datetime.getValue().second).toEqual(20);

      dateTimeData.hour.value = 11;
      datetime.setValue(dateTimeData);

      expect(datetime.getValue().hour).toEqual(11);
      expect(datetime.getValue().minute).toEqual(9);
      expect(datetime.getValue().second).toEqual(20);
    }));

    it('should update existing time value with new DateTimeData value', zoned(() => {
      var d = '13:47:20.789Z';
      datetime.setValue(d);

      expect(datetime.getValue().hour).toEqual(13);
      expect(datetime.getValue().minute).toEqual(47);
      expect(datetime.getValue().second).toEqual(20);

      var dateTimeData = {
        hour: {
          text: '15',
          value: 15,
        },
        minute: {
          text: '09',
          value: 9,
        },
      };
      datetime.setValue(dateTimeData);

      expect(datetime.getValue().year).toEqual(null);
      expect(datetime.getValue().month).toEqual(null);
      expect(datetime.getValue().day).toEqual(null);
      expect(datetime.getValue().hour).toEqual(15);
      expect(datetime.getValue().minute).toEqual(9);
      expect(datetime.getValue().second).toEqual(20);
    }));

    it('should update existing DateTimeData value with new DateTimeData value', zoned(() => {
      var d = '1994-12-15T13:47:20.789Z';
      datetime.setValue(d);

      expect(datetime.getValue().year).toEqual(1994);

      var dateTimeData = {
        year: {
          text: '1995',
          value: 1995,
        },
        month: {
          text: 'December',
          value: 12,
        },
        day: {
          text: '20',
          value: 20
        },
        whatevaIDoWhatIWant: -99,
      };
      datetime.setValue(dateTimeData);

      expect(datetime.getValue().year).toEqual(1995);
      expect(datetime.getValue().month).toEqual(12);
      expect(datetime.getValue().day).toEqual(20);
      expect(datetime.getValue().hour).toEqual(13);
      expect(datetime.getValue().minute).toEqual(47);
    }));

    it('should parse a ISO date string with no existing DateTimeData value', zoned(() => {
      var d = '1994-12-15T13:47:20.789Z';
      datetime.setValue(d);
      expect(datetime.getValue().year).toEqual(1994);
      expect(datetime.getValue().month).toEqual(12);
      expect(datetime.getValue().day).toEqual(15);
    }));

    it('should not parse a Date object', zoned(() => {
      var d = new Date(1994, 11, 15);
      datetime.setValue(d);
      expect(datetime.getValue()).toEqual({});
    }));

    it('should not parse a value with bad data', zoned(() => {
      var d = 'umm 1994 i think';
      datetime.setValue(d);
      expect(datetime.getValue()).toEqual({});
    }));

    it('should clear out existing value with blank value', zoned(() => {
      datetime.setValue('1994-12-15T13:47:20.789Z');
      datetime.setValue(null);
      expect(datetime.getValue()).toEqual({});

      datetime.setValue('1994-12-15T13:47:20.789Z');
      datetime.setValue('');
      expect(datetime.getValue()).toEqual({});
    }));

    it('should not parse a value with blank value', zoned(() => {
      datetime.setValue(null);
      expect(datetime.getValue()).toEqual({});

      datetime.setValue(undefined);
      expect(datetime.getValue()).toEqual({});

      datetime.setValue('');
      expect(datetime.getValue()).toEqual({});
    }));

  });

  describe('hasValue', () => {

    it('should return false if value is not set, and return true if value is set', zoned(() => {
      expect(datetime.hasValue()).toEqual(false);

      datetime.setValue('1994-12-15T13:47:20.789Z');
      expect(datetime.hasValue()).toEqual(true);

      datetime.setValue('');
      expect(datetime.hasValue()).toEqual(false);
    }));

  });

  var datetime: DateTime;
  var picker: Picker;

  beforeEach(() => {
    datetime = new DateTime(new Form(), mockConfig(), mockElementRef(), mockRenderer(), null, <PickerController>{});
    datetime._picker = picker = new Picker(mockApp(), null, mockConfig());
  });

  console.warn = function() {};

  // pt-br
  var customLocale: datetimeUtil.LocaleData = {
    dayNames: [
      'domingo',
      'segunda-feira',
      'ter\u00e7a-feira',
      'quarta-feira',
      'quinta-feira',
      'sexta-feira',
      's\u00e1bado'
    ],
    dayShortNames: [
      'dom',
      'seg',
      'ter',
      'qua',
      'qui',
      'sex',
      's\u00e1b'
    ],
    monthNames: [
      'janeiro',
      'fevereiro',
      'mar\u00e7o',
      'abril',
      'maio',
      'junho',
      'julho',
      'agosto',
      'setembro',
      'outubro',
      'novembro',
      'dezembro'
    ],
    monthShortNames: [
      'jan',
      'fev',
      'mar',
      'abr',
      'mai',
      'jun',
      'jul',
      'ago',
      'set',
      'out',
      'nov',
      'dez'
    ],
  };

});

function zoned(fn: () => any): (done: DoneFn) => void {
  return () => {
    const zone = new NgZone({enableLongStackTrace: false});
    zone.run(fn);
  };
}
