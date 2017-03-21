
import { BaseInput } from './base-input';
import { assert } from './util';

const lorem_ipsum = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi maximus nisl lobortis interdum condimentum. Cras volutpat, massa quis vehicula eleifend, turpis mauris sodales erat, ut varius ligula ipsum et turpis. Aliquam erat volutpat. Maecenas sodales pellentesque auctor. Suspendisse faucibus a erat sit amet pretium. Vestibulum nec tempus tellus. Mauris fringilla faucibus dui sed vestibulum. Curabitur porttitor consectetur nisl. Nulla porta, neque sed congue tempus, erat nunc rutrum diam, eu elementum sapien leo quis eros. Donec non convallis felis. Nam eu pharetra sapien.';

export const TEXT_CORPUS: any = [
  ['', ''],
  ['   ', '   '],
  ['hola', 'hola'],
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
  ['-123456789', -123456789],
];

export const BOOLEAN_CORPUS: any[] = [
  [true, true],
  [false, false],
  ['', true],
  ['false', false],
  ['true', true],
  ['hola', false]
];

export const ANY_CORPUS: any[] = [
  [true, true],
  [false, false],
  [null, null],
  [0, 0],
  ['', ''],
  [' ', ' '],
  ['hola', 'hola']
];

export interface TestConfig {
  defaultValue: any;
  corpus: any;
}


export function commonInputTest<T>(input: BaseInput<T>, config: TestConfig) {
  // TODO test form register/deregister
  // TODO test item classes

  testInput(input, config, false);
  input.ngAfterViewInit();
  testInput(input, config, true);
  input.ngOnDestroy();
  assert(!input._init, 'input was not destroyed correctly');
}

function testInput<T>(input: BaseInput<T>, config: TestConfig, isInit: boolean) {
  testState(input, config, isInit);
  testWriteValue(input, config, isInit);
  testNgModelChange(input, config, isInit);
}

function testState<T>(input: BaseInput<T>, config: TestConfig, isInit: boolean) {
  assert(input._init === isInit, 'input must be init');
  assert(!input._isFocus && !input.isFocus(), 'should not be focus');
  assert(input.value === config.defaultValue, 'default value is wrong');

  input._setFocus();
  assert(input._isFocus && input.isFocus(), 'should be focus');
  input._setFocus(); // it should not crash
  input._setBlur();
  assert(!input._isFocus && !input.isFocus(), 'should not be focus');
  input._setBlur(); // it should not crash
}

function testWriteValue<T>(input: BaseInput<T>, config: TestConfig, isInit: boolean) {
  let test: any;
  let i: number;
  let ionChangeCalled = 0;
  let OnChangeCalled = 0;
  let OnTouchedCalled = 0;

  input.value = config.defaultValue;

  // Test ionChange
  let sub = input.ionChange.subscribe((ev: any) => {
    assert(ionChangeCalled === 0, 'internal error');
    assert(ev === input, 'ev is not the input');
    assert(test[1] === ev.value, 'value does not match');
    ionChangeCalled++;
  });

  // Test registerOnChange
  input.registerOnChange((ev: any) => {
    assert(OnChangeCalled === 0, 'internal error');
    assert(ev === input.value, 'ev output does not match');
    assert(test[1] === input.value, 'value does not match');
    OnChangeCalled++;
  });

  // Test registerOnChange
  input.registerOnTouched(() => {
    assert(OnTouchedCalled === 0, 'internal error');
    OnTouchedCalled++;
  });

  // Run corpus
  for (i = 0; i < config.corpus.length; i++) {
    test = config.corpus[i];
    input.value = test[0];
    assert(input.value === test[1], 'input/output does not match');
    if (isInit) {
      assert(ionChangeCalled === 1, 'ionChange error');
    } else {
      assert(ionChangeCalled === 0, 'ionChange error');
    }
    assert(OnChangeCalled === 1, 'OnChangeCalled was not called');
    assert(OnTouchedCalled === 1, 'OnTouchedCalled was not called');
    OnTouchedCalled = OnChangeCalled = ionChangeCalled = 0;

    // Set same value (it should not redispatch)
    input.value = test[0];
    assert(ionChangeCalled === 0, 'ionChange should not be called');
    assert(OnChangeCalled === 0, 'OnChangeCalled should not be called');
    // TODO OnTouchedCalled?
    OnTouchedCalled = OnChangeCalled = ionChangeCalled = 0;
  }

  input.registerOnChange(null);
  input.registerOnTouched(null);
  sub.unsubscribe();
  input.value = config.defaultValue;
}

function testNgModelChange<T>(input: BaseInput<T>, config: TestConfig, isInit: boolean) {
  let test: any;
  let i: number;
  let ionChangeCalled = 0;
  let OnChangeCalled = 0;
  let OnTouchedCalled = 0;

  // Test ionChange
  let sub = input.ionChange.subscribe((ev: any) => {
    assert(ionChangeCalled === 0, 'internal error');
    assert(ev === input, 'ev output does not match');
    assert(test[1] === ev.value, 'value does not match');
    ionChangeCalled++;
  });

  // Test registerOnChange
  input.registerOnChange((ev: any) => {
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

    assert(input.value === test[1], 'input/output does not match');
    if (isInit) {
      assert(ionChangeCalled === 1, 'ionChange error');
    } else {
      assert(ionChangeCalled === 0, 'ionChange error');
    }
    assert(OnChangeCalled === 0, 'OnChangeCalled should not be called');
    assert(OnTouchedCalled === 0, 'OnTouchedCalled should not be called');
    OnTouchedCalled = OnChangeCalled = ionChangeCalled = 0;

    // Set same value (it should not redispatch)
    input.writeValue(test[0]);
    input.value = test[0];
    assert(ionChangeCalled === 0, 'ionChange should not be called');
    assert(OnChangeCalled === 0, 'OnChangeCalled should not be called');

    // TODO OnTouchedCalled?
    OnTouchedCalled = OnChangeCalled = ionChangeCalled = 0;
  }

  input.registerOnChange(null);
  input.registerOnTouched(null);
  sub.unsubscribe();
  input.value = config.defaultValue;
}





