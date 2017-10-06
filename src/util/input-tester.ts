
import { NgZone } from '@angular/core';
import { BaseInput } from './base-input';
import { assert } from './util';

const lorem_ipsum = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi maximus nisl lobortis interdum condimentum. Cras volutpat, massa quis vehicula eleifend, turpis mauris sodales erat, ut varius ligula ipsum et turpis. Aliquam erat volutpat. Maecenas sodales pellentesque auctor. Suspendisse faucibus a erat sit amet pretium. Vestibulum nec tempus tellus. Mauris fringilla faucibus dui sed vestibulum. Curabitur porttitor consectetur nisl. Nulla porta, neque sed congue tempus, erat nunc rutrum diam, eu elementum sapien leo quis eros. Donec non convallis felis. Nam eu pharetra sapien.';

export const TEXT_CORPUS: any = [
  ['hola', 'hola'],
  ['', ''],
  ['   ', '   '],
  ['adiós', 'adiós'],
  ['hola y adiós', 'hola y adiós'],
  [lorem_ipsum, lorem_ipsum]
];

export const NUMBER_CORPUS: any[] = [
  [-1, -1],
  [0, 0],
  [-123456789, -123456789],
  [1.1234, 1.1234],
  [123456789, 123456789],
  ['1.1234', 1.1234],
  ['123456789', 123456789],
  ['-123456789', -123456789]
];

export const BOOLEAN_CORPUS: any[] = [
  [true, true],
  [false, false],
  ['', true],
  ['false', false],
  ['true', true],
];

export const ANY_CORPUS: any[] = [
  [true, true],
  [false, false],
  [0, 0],
  ['', ''],
  [' ', ' '],
  ['hola', 'hola']
];

export interface TestConfig {
  defaultValue: any;
  corpus: any;
  testItem?: boolean;
  testForm?: boolean;
  onValueChange?: (value: any) => boolean;
  onFocusChange?: (isFocused: boolean) => boolean;
}


export function commonInputTest<T>(input: BaseInput<T>, config: TestConfig) {
  // TODO test form register/deregister
  // TODO test item classes
  // TODO test disable
  const zone = new NgZone({ enableLongStackTrace: true });
  zone.run(() => {
    if (config.testItem === true && !input._item) {
      assert(false, 'input is invalid');
    }
    if (config.testForm === true && !input._form) {
      assert(false, 'form is invalid');
    }

    // Run tests before initialization
    testInput(input, config, false);

    input.ngAfterContentInit();
    (<any>input).ngAfterViewInit && (<any>input).ngAfterViewInit();

    // Run tests after initialization
    testInput(input, config, true);

    // Run tests without item
    if (config.testItem === true && !input._item) {
      input._item = undefined;
      testInput(input, config, true);
    }

    // Run tests without item
    if (config.testForm === true && !input._form) {
      input._form = undefined;
      testInput(input, config, true);
    }

    testInput(input, config, true);
    input.ngOnDestroy();
    assert(!input._init, 'input was not destroyed correctly');
  });
}

function testInput<T>(input: BaseInput<T>, config: TestConfig, isInit: boolean) {
  testState(input, config, isInit);
  testWriteValue(input, config, isInit);
  testNgModelChange(input, config, isInit);
}

function testState<T>(input: BaseInput<T>, config: TestConfig, isInit: boolean) {
  assertEqual(input._init, isInit, 'input must be init');
  assertEqual(input._isFocus, false, 'should not be focus');
  assertEqual(input.isFocus(), false, 'should not be focus');
  assertEqual(input.value, config.defaultValue, 'default value is wrong');

  if (isInit) {
    let blurCount = 0;
    let focusCount = 0;
    let onTouchedCalled = 0;
    const subBlur = input.ionBlur.subscribe((ev: any) => {
      assertEqual(ev, input, 'ionBlur argument is wrong');
      blurCount++;
      if (config.onFocusChange && config.onFocusChange(false) !== true) {
        assert(false, 'onFocusChange test failed');
      }
    });
    const subFocus = input.ionFocus.subscribe((ev: any) => {
      assertEqual(ev, input, 'ionFocus argument is wrong');
      focusCount++;
      if (config.onFocusChange && config.onFocusChange(true) !== true) {
        assert(false, 'onFocusChange test failed');
      }
    });
    input.registerOnTouched(() => {
      assertEqual(onTouchedCalled, 0, 'registerOnTouched: internal error');
      onTouchedCalled++;
    });

    input._fireBlur();
    assertEqual(blurCount, 0, 'blur should not have been emitted');
    assertEqual(onTouchedCalled, 0, 'touched should not have been called');

    input._fireFocus();
    assertEqual(input._isFocus, true, 'should be focus');
    assertEqual(input.isFocus(), true, 'should be focus');
    input._fireFocus();

    input._fireBlur();
    assertEqual(input._isFocus, false, 'should be not focus');
    assertEqual(input.isFocus(), false, 'should be not focus');
    assertEqual(onTouchedCalled, 1, 'touched should have been called');
    input._fireBlur(); // it should not crash

    assertEqual(focusCount, 1, 'ionFocus was not called correctly');
    assertEqual(blurCount, 1, 'ionBlur was not called correctly');

    subBlur.unsubscribe();
    subFocus.unsubscribe();
  }
}

function testWriteValue<T>(input: BaseInput<T>, config: TestConfig, isInit: boolean) {
  let test: any;
  let i: number;
  let ionChangeCalled = 0;
  let OnChangeCalled = 0;
  let OnTouchedCalled = 0;
  let ngModelValue: any;

  // Test ionChange
  let sub = input.ionChange.subscribe((ev: any) => {
    assertEqual(ionChangeCalled, 0, 'ionChange: internal error');
    assertEqual(ev, input, 'ionChange: ev is not the input');
    assertEqual(ev.value, test[1], 'ionChange: value does not match');
    assertEqual(ngModelValue, test[1], 'ionChange: ngmodel was not updated');

    ionChangeCalled++;
  });

  // Test registerOnChange
  input.registerOnChange((ev: any) => {
    assertEqual(OnChangeCalled, 0, 'registerOnChange: internal error');
    assertEqual(input.value, ev, 'registerOnChange: ev output does not match');
    assertEqual(input.value, test[1], 'registerOnChange: value does not match');
    ngModelValue = ev;
    OnChangeCalled++;
  });

  // Test registerOnTouched
  input.registerOnTouched(() => {
    assertEqual(OnTouchedCalled, 0, 'registerOnTouched: internal error');

    OnTouchedCalled++;
  });

  // Run corpus
  for (i = 0; i < config.corpus.length; i++) {
    test = config.corpus[i];
    input.value = test[0];
    assertEqual(input.value, test[1], 'loop: input/output does not match');
    if (isInit) {
      assertEqual(ionChangeCalled, 1, 'loop: ionChange error');
      if (config.onValueChange && config.onValueChange(test[1]) !== true) {
        assert(false, 'onValueChange() test failed');
      }
    } else {
      assertEqual(ionChangeCalled, 0, 'loop: ionChange error');
    }
    assertEqual(OnChangeCalled, 1, 'loop: OnChangeCalled was not called');
    assertEqual(OnTouchedCalled, 0, 'loop: OnTouchedCalled was called');

    OnTouchedCalled = OnChangeCalled = ionChangeCalled = 0;

    // Set same value (it should not redispatch)
    input.value = test[0];
    assertEqual(ionChangeCalled, 0, 'loop: ionChange should not be called');
    assertEqual(OnChangeCalled, 0, 'loop: OnChangeCalled should not be called');
    // TODO OnTouchedCalled?
    OnTouchedCalled = OnChangeCalled = ionChangeCalled = 0;
  }

  // Test undefined
  input.value = undefined;
  assertEqual(input.value, test[1], 'undefined should not change the value');
  assertEqual(ionChangeCalled, 0, 'undefined: ionChange should not be called');
  assertEqual(OnChangeCalled, 0, 'undefined: OnChangeCalled should not be called');
  assertEqual(OnTouchedCalled, 0, 'undefined: OnTouchedCalled should not be called');


  // Test null (reset)
  test = [null, config.defaultValue];
  input.value = null;
  assertEqual(input.value, config.defaultValue, 'null: wrong default value');
  assertEqual(OnChangeCalled, 1, 'null: OnChangeCalled was not called');
  assertEqual(OnTouchedCalled, 0, 'null: OnTouchedCalled was called');


  input.registerOnChange(null);
  input.registerOnTouched(null);
  sub.unsubscribe();
}

function testNgModelChange<T>(input: BaseInput<T>, config: TestConfig, isInit: boolean) {
  let test: any;
  let i: number;
  let ionChangeCalled = 0;
  let OnChangeCalled = 0;
  let OnTouchedCalled = 0;

  // Test ionChange
  let sub = input.ionChange.subscribe((ev: any) => {
    assertEqual(ionChangeCalled, 0, 'internal error');
    assertEqual(ev, input, 'ev output does not match');
    assertEqual(test[1], ev.value, 'value does not match');

    ionChangeCalled++;
  });

  // Test registerOnChange
  input.registerOnChange(() => {
    OnChangeCalled++;
  });

  // Test registerOnChange
  input.registerOnTouched(() => {
    OnTouchedCalled++;
  });

  // Run corpus
  for (i = 0; i < config.corpus.length; i++) {
    test = config.corpus[i];
    input.writeValue(test[0]);

    assertEqual(input.value, test[1], 'input/output does not match');
    if (isInit) {
      assertEqual(ionChangeCalled, 1, 'ionChange error');
      if (config.onValueChange && config.onValueChange(test[1]) !== true) {
        assert(false, 'onValueChange() test failed');
      }
    } else {
      assertEqual(ionChangeCalled, 0, 'ionChange error');
    }
    assertEqual(OnChangeCalled, 0, 'OnChangeCalled should not be called');
    assertEqual(OnTouchedCalled, 0, 'OnTouchedCalled should not be called');
    OnTouchedCalled = OnChangeCalled = ionChangeCalled = 0;

    // Set same value (it should not redispatch)
    input.writeValue(test[0]);
    input.value = test[0];
    assertEqual(ionChangeCalled, 0, 'ionChange should not be called');
    assertEqual(OnChangeCalled, 0, 'OnChangeCalled should not be called');

    // TODO OnTouchedCalled?
    OnTouchedCalled = OnChangeCalled = ionChangeCalled = 0;
  }

  input.registerOnChange(null);
  input.registerOnTouched(null);
  sub.unsubscribe();
  input.value = config.defaultValue;
}

function assertEqual(a: any, b: any, message: string) {
  if (!equal(a, b)) {
    assert(false, a + ' != ' + b + ' ' + message);
  }
}


function equal(a: any, b: any): boolean {
  if (a === b) {
    return true;
  }
  // return false;
  return JSON.stringify(a) === JSON.stringify(b);
}


