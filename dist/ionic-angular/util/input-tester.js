import { NgZone } from '@angular/core';
var /** @type {?} */ lorem_ipsum = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi maximus nisl lobortis interdum condimentum. Cras volutpat, massa quis vehicula eleifend, turpis mauris sodales erat, ut varius ligula ipsum et turpis. Aliquam erat volutpat. Maecenas sodales pellentesque auctor. Suspendisse faucibus a erat sit amet pretium. Vestibulum nec tempus tellus. Mauris fringilla faucibus dui sed vestibulum. Curabitur porttitor consectetur nisl. Nulla porta, neque sed congue tempus, erat nunc rutrum diam, eu elementum sapien leo quis eros. Donec non convallis felis. Nam eu pharetra sapien.';
export var /** @type {?} */ TEXT_CORPUS = [
    ['hola', 'hola'],
    ['', ''],
    ['   ', '   '],
    ['adiós', 'adiós'],
    ['hola y adiós', 'hola y adiós'],
    [lorem_ipsum, lorem_ipsum]
];
export var /** @type {?} */ NUMBER_CORPUS = [
    [-1, -1],
    [0, 0],
    [-123456789, -123456789],
    [1.1234, 1.1234],
    [123456789, 123456789],
    ['1.1234', 1.1234],
    ['123456789', 123456789],
    ['-123456789', -123456789]
];
export var /** @type {?} */ BOOLEAN_CORPUS = [
    [true, true],
    [false, false],
    ['', true],
    ['false', false],
    ['true', true],
];
export var /** @type {?} */ ANY_CORPUS = [
    [true, true],
    [false, false],
    [0, 0],
    ['', ''],
    [' ', ' '],
    ['hola', 'hola']
];
/**
 * @template T
 * @param {?} input
 * @param {?} config
 * @return {?}
 */
export function commonInputTest(input, config) {
    // TODO test form register/deregister
    // TODO test item classes
    // TODO test disable
    var /** @type {?} */ zone = new NgZone(true);
    zone.run(function () {
        if (config.testItem === true && !input._item) {
            (void 0) /* assert */;
        }
        if (config.testForm === true && !input._form) {
            (void 0) /* assert */;
        }
        // Run tests before initialization
        testInput(input, config, false);
        input.ngAfterContentInit();
        ((input)).ngAfterViewInit && ((input)).ngAfterViewInit();
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
        (void 0) /* assert */;
    });
}
/**
 * @template T
 * @param {?} input
 * @param {?} config
 * @param {?} isInit
 * @return {?}
 */
function testInput(input, config, isInit) {
    testState(input, config, isInit);
    testWriteValue(input, config, isInit);
    testNgModelChange(input, config, isInit);
}
/**
 * @template T
 * @param {?} input
 * @param {?} config
 * @param {?} isInit
 * @return {?}
 */
function testState(input, config, isInit) {
    assertEqual(input._init, isInit, 'input must be init');
    assertEqual(input._isFocus, false, 'should not be focus');
    assertEqual(input.isFocus(), false, 'should not be focus');
    assertEqual(input.value, config.defaultValue, 'default value is wrong');
    if (isInit) {
        var /** @type {?} */ blurCount_1 = 0;
        var /** @type {?} */ focusCount_1 = 0;
        var /** @type {?} */ subBlur = input.ionBlur.subscribe(function (ev) {
            assertEqual(ev, input, 'ionBlur argument is wrong');
            blurCount_1++;
            if (config.onFocusChange && config.onFocusChange(false) !== true) {
                (void 0) /* assert */;
            }
        });
        var /** @type {?} */ subFocus = input.ionFocus.subscribe(function (ev) {
            assertEqual(ev, input, 'ionFocus argument is wrong');
            focusCount_1++;
            if (config.onFocusChange && config.onFocusChange(true) !== true) {
                (void 0) /* assert */;
            }
        });
        input._fireFocus();
        assertEqual(input._isFocus, true, 'should be focus');
        assertEqual(input.isFocus(), true, 'should be focus');
        input._fireFocus();
        input._fireBlur();
        assertEqual(input._isFocus, false, 'should be not focus');
        assertEqual(input.isFocus(), false, 'should be not focus');
        input._fireBlur(); // it should not crash
        assertEqual(focusCount_1, 1, 'ionFocus was not called correctly');
        assertEqual(blurCount_1, 1, 'ionBlur was not called correctly');
        subBlur.unsubscribe();
        subFocus.unsubscribe();
    }
}
/**
 * @template T
 * @param {?} input
 * @param {?} config
 * @param {?} isInit
 * @return {?}
 */
function testWriteValue(input, config, isInit) {
    var /** @type {?} */ test;
    var /** @type {?} */ i;
    var /** @type {?} */ ionChangeCalled = 0;
    var /** @type {?} */ OnChangeCalled = 0;
    var /** @type {?} */ OnTouchedCalled = 0;
    var /** @type {?} */ ngModelValue;
    // Test ionChange
    var /** @type {?} */ sub = input.ionChange.subscribe(function (ev) {
        assertEqual(ionChangeCalled, 0, 'ionChange: internal error');
        assertEqual(ev, input, 'ionChange: ev is not the input');
        assertEqual(ev.value, test[1], 'ionChange: value does not match');
        assertEqual(ngModelValue, test[1], 'ionChange: ngmodel was not updated');
        ionChangeCalled++;
    });
    // Test registerOnChange
    input.registerOnChange(function (ev) {
        assertEqual(OnChangeCalled, 0, 'registerOnChange: internal error');
        assertEqual(input.value, ev, 'registerOnChange: ev output does not match');
        assertEqual(input.value, test[1], 'registerOnChange: value does not match');
        ngModelValue = ev;
        OnChangeCalled++;
    });
    // Test registerOnChange
    input.registerOnTouched(function () {
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
                (void 0) /* assert */;
            }
        }
        else {
            assertEqual(ionChangeCalled, 0, 'loop: ionChange error');
        }
        assertEqual(OnChangeCalled, 1, 'loop: OnChangeCalled was not called');
        assertEqual(OnTouchedCalled, 1, 'loop: OnTouchedCalled was not called');
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
    assertEqual(OnTouchedCalled, 1, 'null: OnTouchedCalled was not called');
    input.registerOnChange(null);
    input.registerOnTouched(null);
    sub.unsubscribe();
}
/**
 * @template T
 * @param {?} input
 * @param {?} config
 * @param {?} isInit
 * @return {?}
 */
function testNgModelChange(input, config, isInit) {
    var /** @type {?} */ test;
    var /** @type {?} */ i;
    var /** @type {?} */ ionChangeCalled = 0;
    var /** @type {?} */ OnChangeCalled = 0;
    var /** @type {?} */ OnTouchedCalled = 0;
    // Test ionChange
    var /** @type {?} */ sub = input.ionChange.subscribe(function (ev) {
        assertEqual(ionChangeCalled, 0, 'internal error');
        assertEqual(ev, input, 'ev output does not match');
        assertEqual(test[1], ev.value, 'value does not match');
        ionChangeCalled++;
    });
    // Test registerOnChange
    input.registerOnChange(function () {
        OnChangeCalled++;
    });
    // Test registerOnChange
    input.registerOnTouched(function () {
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
                (void 0) /* assert */;
            }
        }
        else {
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
/**
 * @param {?} a
 * @param {?} b
 * @param {?} message
 * @return {?}
 */
function assertEqual(a, b, message) {
    if (!equal(a, b)) {
        (void 0) /* assert */;
    }
}
/**
 * @param {?} a
 * @param {?} b
 * @return {?}
 */
function equal(a, b) {
    if (a === b) {
        return true;
    }
    // return false;
    return JSON.stringify(a) === JSON.stringify(b);
}
//# sourceMappingURL=input-tester.js.map