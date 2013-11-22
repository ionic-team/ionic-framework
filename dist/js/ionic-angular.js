/**
 * Copyright 2013 Drifty Co.
 * http://drifty.com/

 * Ionic - a powerful HTML5 mobile app framework.
 * http://ionicframework.com/
 *
 *
 * By @maxlynch, @helloimben, @adamdbradley <3
 *
 * Licensed under the MIT license. Please see LICENSE for more information.
 * 
 */
;
/**
 * @license AngularJS v1.2.1
 * (c) 2010-2012 Google, Inc. http://angularjs.org
 * License: MIT
 */
(function(window, document, undefined) {'use strict';

/**
 * @description
 *
 * This object provides a utility for producing rich Error messages within
 * Angular. It can be called as follows:
 *
 * var exampleMinErr = minErr('example');
 * throw exampleMinErr('one', 'This {0} is {1}', foo, bar);
 *
 * The above creates an instance of minErr in the example namespace. The
 * resulting error will have a namespaced error code of example.one.  The
 * resulting error will replace {0} with the value of foo, and {1} with the
 * value of bar. The object is not restricted in the number of arguments it can
 * take.
 *
 * If fewer arguments are specified than necessary for interpolation, the extra
 * interpolation markers will be preserved in the final string.
 *
 * Since data will be parsed statically during a build step, some restrictions
 * are applied with respect to how minErr instances are created and called.
 * Instances should have names of the form namespaceMinErr for a minErr created
 * using minErr('namespace') . Error codes, namespaces and template strings
 * should all be static strings, not variables or general expressions.
 *
 * @param {string} module The namespace to use for the new minErr instance.
 * @returns {function(string, string, ...): Error} instance
 */

function minErr(module) {
  return function () {
    var code = arguments[0],
      prefix = '[' + (module ? module + ':' : '') + code + '] ',
      template = arguments[1],
      templateArgs = arguments,
      stringify = function (obj) {
        if (typeof obj === 'function') {
          return obj.toString().replace(/ \{[\s\S]*$/, '');
        } else if (typeof obj === 'undefined') {
          return 'undefined';
        } else if (typeof obj !== 'string') {
          return JSON.stringify(obj);
        }
        return obj;
      },
      message, i;

    message = prefix + template.replace(/\{\d+\}/g, function (match) {
      var index = +match.slice(1, -1), arg;

      if (index + 2 < templateArgs.length) {
        arg = templateArgs[index + 2];
        if (typeof arg === 'function') {
          return arg.toString().replace(/ ?\{[\s\S]*$/, '');
        } else if (typeof arg === 'undefined') {
          return 'undefined';
        } else if (typeof arg !== 'string') {
          return toJson(arg);
        }
        return arg;
      }
      return match;
    });

    message = message + '\nhttp://errors.angularjs.org/1.2.1/' +
      (module ? module + '/' : '') + code;
    for (i = 2; i < arguments.length; i++) {
      message = message + (i == 2 ? '?' : '&') + 'p' + (i-2) + '=' +
        encodeURIComponent(stringify(arguments[i]));
    }

    return new Error(message);
  };
}

/* We need to tell jshint what variables are being exported */
/* global
    -angular,
    -msie,
    -jqLite,
    -jQuery,
    -slice,
    -push,
    -toString,
    -ngMinErr,
    -_angular,
    -angularModule,
    -nodeName_,
    -uid,

    -lowercase,
    -uppercase,
    -manualLowercase,
    -manualUppercase,
    -nodeName_,
    -isArrayLike,
    -forEach,
    -sortedKeys,
    -forEachSorted,
    -reverseParams,
    -nextUid,
    -setHashKey,
    -extend,
    -int,
    -inherit,
    -noop,
    -identity,
    -valueFn,
    -isUndefined,
    -isDefined,
    -isObject,
    -isString,
    -isNumber,
    -isDate,
    -isArray,
    -isFunction,
    -isRegExp,
    -isWindow,
    -isScope,
    -isFile,
    -isBoolean,
    -trim,
    -isElement,
    -makeMap,
    -map,
    -size,
    -includes,
    -indexOf,
    -arrayRemove,
    -isLeafNode,
    -copy,
    -shallowCopy,
    -equals,
    -csp,
    -concat,
    -sliceArgs,
    -bind,
    -toJsonReplacer,
    -toJson,
    -fromJson,
    -toBoolean,
    -startingTag,
    -tryDecodeURIComponent,
    -parseKeyValue,
    -toKeyValue,
    -encodeUriSegment,
    -encodeUriQuery,
    -angularInit,
    -bootstrap,
    -snake_case,
    -bindJQuery,
    -assertArg,
    -assertArgFn,
    -assertNotHasOwnProperty,
    -getter,
    -getBlockElements

*/

////////////////////////////////////

/**
 * @ngdoc function
 * @name angular.lowercase
 * @function
 *
 * @description Converts the specified string to lowercase.
 * @param {string} string String to be converted to lowercase.
 * @returns {string} Lowercased string.
 */
var lowercase = function(string){return isString(string) ? string.toLowerCase() : string;};


/**
 * @ngdoc function
 * @name angular.uppercase
 * @function
 *
 * @description Converts the specified string to uppercase.
 * @param {string} string String to be converted to uppercase.
 * @returns {string} Uppercased string.
 */
var uppercase = function(string){return isString(string) ? string.toUpperCase() : string;};


var manualLowercase = function(s) {
  /* jshint bitwise: false */
  return isString(s)
      ? s.replace(/[A-Z]/g, function(ch) {return String.fromCharCode(ch.charCodeAt(0) | 32);})
      : s;
};
var manualUppercase = function(s) {
  /* jshint bitwise: false */
  return isString(s)
      ? s.replace(/[a-z]/g, function(ch) {return String.fromCharCode(ch.charCodeAt(0) & ~32);})
      : s;
};


// String#toLowerCase and String#toUpperCase don't produce correct results in browsers with Turkish
// locale, for this reason we need to detect this case and redefine lowercase/uppercase methods
// with correct but slower alternatives.
if ('i' !== 'I'.toLowerCase()) {
  lowercase = manualLowercase;
  uppercase = manualUppercase;
}


var /** holds major version number for IE or NaN for real browsers */
    msie,
    jqLite,           // delay binding since jQuery could be loaded after us.
    jQuery,           // delay binding
    slice             = [].slice,
    push              = [].push,
    toString          = Object.prototype.toString,
    ngMinErr          = minErr('ng'),


    _angular          = window.angular,
    /** @name angular */
    angular           = window.angular || (window.angular = {}),
    angularModule,
    nodeName_,
    uid               = ['0', '0', '0'];

/**
 * IE 11 changed the format of the UserAgent string.
 * See http://msdn.microsoft.com/en-us/library/ms537503.aspx
 */
msie = int((/msie (\d+)/.exec(lowercase(navigator.userAgent)) || [])[1]);
if (isNaN(msie)) {
  msie = int((/trident\/.*; rv:(\d+)/.exec(lowercase(navigator.userAgent)) || [])[1]);
}


/**
 * @private
 * @param {*} obj
 * @return {boolean} Returns true if `obj` is an array or array-like object (NodeList, Arguments,
 *                   String ...)
 */
function isArrayLike(obj) {
  if (obj == null || isWindow(obj)) {
    return false;
  }

  var length = obj.length;

  if (obj.nodeType === 1 && length) {
    return true;
  }

  return isString(obj) || isArray(obj) || length === 0 ||
         typeof length === 'number' && length > 0 && (length - 1) in obj;
}

/**
 * @ngdoc function
 * @name angular.forEach
 * @function
 *
 * @description
 * Invokes the `iterator` function once for each item in `obj` collection, which can be either an
 * object or an array. The `iterator` function is invoked with `iterator(value, key)`, where `value`
 * is the value of an object property or an array element and `key` is the object property key or
 * array element index. Specifying a `context` for the function is optional.
 *
 * Note: this function was previously known as `angular.foreach`.
 *
   <pre>
     var values = {name: 'misko', gender: 'male'};
     var log = [];
     angular.forEach(values, function(value, key){
       this.push(key + ': ' + value);
     }, log);
     expect(log).toEqual(['name: misko', 'gender:male']);
   </pre>
 *
 * @param {Object|Array} obj Object to iterate over.
 * @param {Function} iterator Iterator function.
 * @param {Object=} context Object to become context (`this`) for the iterator function.
 * @returns {Object|Array} Reference to `obj`.
 */
function forEach(obj, iterator, context) {
  var key;
  if (obj) {
    if (isFunction(obj)){
      for (key in obj) {
        if (key != 'prototype' && key != 'length' && key != 'name' && obj.hasOwnProperty(key)) {
          iterator.call(context, obj[key], key);
        }
      }
    } else if (obj.forEach && obj.forEach !== forEach) {
      obj.forEach(iterator, context);
    } else if (isArrayLike(obj)) {
      for (key = 0; key < obj.length; key++)
        iterator.call(context, obj[key], key);
    } else {
      for (key in obj) {
        if (obj.hasOwnProperty(key)) {
          iterator.call(context, obj[key], key);
        }
      }
    }
  }
  return obj;
}

function sortedKeys(obj) {
  var keys = [];
  for (var key in obj) {
    if (obj.hasOwnProperty(key)) {
      keys.push(key);
    }
  }
  return keys.sort();
}

function forEachSorted(obj, iterator, context) {
  var keys = sortedKeys(obj);
  for ( var i = 0; i < keys.length; i++) {
    iterator.call(context, obj[keys[i]], keys[i]);
  }
  return keys;
}


/**
 * when using forEach the params are value, key, but it is often useful to have key, value.
 * @param {function(string, *)} iteratorFn
 * @returns {function(*, string)}
 */
function reverseParams(iteratorFn) {
  return function(value, key) { iteratorFn(key, value); };
}

/**
 * A consistent way of creating unique IDs in angular. The ID is a sequence of alpha numeric
 * characters such as '012ABC'. The reason why we are not using simply a number counter is that
 * the number string gets longer over time, and it can also overflow, where as the nextId
 * will grow much slower, it is a string, and it will never overflow.
 *
 * @returns an unique alpha-numeric string
 */
function nextUid() {
  var index = uid.length;
  var digit;

  while(index) {
    index--;
    digit = uid[index].charCodeAt(0);
    if (digit == 57 /*'9'*/) {
      uid[index] = 'A';
      return uid.join('');
    }
    if (digit == 90  /*'Z'*/) {
      uid[index] = '0';
    } else {
      uid[index] = String.fromCharCode(digit + 1);
      return uid.join('');
    }
  }
  uid.unshift('0');
  return uid.join('');
}


/**
 * Set or clear the hashkey for an object.
 * @param obj object
 * @param h the hashkey (!truthy to delete the hashkey)
 */
function setHashKey(obj, h) {
  if (h) {
    obj.$$hashKey = h;
  }
  else {
    delete obj.$$hashKey;
  }
}

/**
 * @ngdoc function
 * @name angular.extend
 * @function
 *
 * @description
 * Extends the destination object `dst` by copying all of the properties from the `src` object(s)
 * to `dst`. You can specify multiple `src` objects.
 *
 * @param {Object} dst Destination object.
 * @param {...Object} src Source object(s).
 * @returns {Object} Reference to `dst`.
 */
function extend(dst) {
  var h = dst.$$hashKey;
  forEach(arguments, function(obj){
    if (obj !== dst) {
      forEach(obj, function(value, key){
        dst[key] = value;
      });
    }
  });

  setHashKey(dst,h);
  return dst;
}

function int(str) {
  return parseInt(str, 10);
}


function inherit(parent, extra) {
  return extend(new (extend(function() {}, {prototype:parent}))(), extra);
}

/**
 * @ngdoc function
 * @name angular.noop
 * @function
 *
 * @description
 * A function that performs no operations. This function can be useful when writing code in the
 * functional style.
   <pre>
     function foo(callback) {
       var result = calculateResult();
       (callback || angular.noop)(result);
     }
   </pre>
 */
function noop() {}
noop.$inject = [];


/**
 * @ngdoc function
 * @name angular.identity
 * @function
 *
 * @description
 * A function that returns its first argument. This function is useful when writing code in the
 * functional style.
 *
   <pre>
     function transformer(transformationFn, value) {
       return (transformationFn || angular.identity)(value);
     };
   </pre>
 */
function identity($) {return $;}
identity.$inject = [];


function valueFn(value) {return function() {return value;};}

/**
 * @ngdoc function
 * @name angular.isUndefined
 * @function
 *
 * @description
 * Determines if a reference is undefined.
 *
 * @param {*} value Reference to check.
 * @returns {boolean} True if `value` is undefined.
 */
function isUndefined(value){return typeof value == 'undefined';}


/**
 * @ngdoc function
 * @name angular.isDefined
 * @function
 *
 * @description
 * Determines if a reference is defined.
 *
 * @param {*} value Reference to check.
 * @returns {boolean} True if `value` is defined.
 */
function isDefined(value){return typeof value != 'undefined';}


/**
 * @ngdoc function
 * @name angular.isObject
 * @function
 *
 * @description
 * Determines if a reference is an `Object`. Unlike `typeof` in JavaScript, `null`s are not
 * considered to be objects.
 *
 * @param {*} value Reference to check.
 * @returns {boolean} True if `value` is an `Object` but not `null`.
 */
function isObject(value){return value != null && typeof value == 'object';}


/**
 * @ngdoc function
 * @name angular.isString
 * @function
 *
 * @description
 * Determines if a reference is a `String`.
 *
 * @param {*} value Reference to check.
 * @returns {boolean} True if `value` is a `String`.
 */
function isString(value){return typeof value == 'string';}


/**
 * @ngdoc function
 * @name angular.isNumber
 * @function
 *
 * @description
 * Determines if a reference is a `Number`.
 *
 * @param {*} value Reference to check.
 * @returns {boolean} True if `value` is a `Number`.
 */
function isNumber(value){return typeof value == 'number';}


/**
 * @ngdoc function
 * @name angular.isDate
 * @function
 *
 * @description
 * Determines if a value is a date.
 *
 * @param {*} value Reference to check.
 * @returns {boolean} True if `value` is a `Date`.
 */
function isDate(value){
  return toString.apply(value) == '[object Date]';
}


/**
 * @ngdoc function
 * @name angular.isArray
 * @function
 *
 * @description
 * Determines if a reference is an `Array`.
 *
 * @param {*} value Reference to check.
 * @returns {boolean} True if `value` is an `Array`.
 */
function isArray(value) {
  return toString.apply(value) == '[object Array]';
}


/**
 * @ngdoc function
 * @name angular.isFunction
 * @function
 *
 * @description
 * Determines if a reference is a `Function`.
 *
 * @param {*} value Reference to check.
 * @returns {boolean} True if `value` is a `Function`.
 */
function isFunction(value){return typeof value == 'function';}


/**
 * Determines if a value is a regular expression object.
 *
 * @private
 * @param {*} value Reference to check.
 * @returns {boolean} True if `value` is a `RegExp`.
 */
function isRegExp(value) {
  return toString.apply(value) == '[object RegExp]';
}


/**
 * Checks if `obj` is a window object.
 *
 * @private
 * @param {*} obj Object to check
 * @returns {boolean} True if `obj` is a window obj.
 */
function isWindow(obj) {
  return obj && obj.document && obj.location && obj.alert && obj.setInterval;
}


function isScope(obj) {
  return obj && obj.$evalAsync && obj.$watch;
}


function isFile(obj) {
  return toString.apply(obj) === '[object File]';
}


function isBoolean(value) {
  return typeof value == 'boolean';
}


var trim = (function() {
  // native trim is way faster: http://jsperf.com/angular-trim-test
  // but IE doesn't have it... :-(
  // TODO: we should move this into IE/ES5 polyfill
  if (!String.prototype.trim) {
    return function(value) {
      return isString(value) ? value.replace(/^\s*/, '').replace(/\s*$/, '') : value;
    };
  }
  return function(value) {
    return isString(value) ? value.trim() : value;
  };
})();


/**
 * @ngdoc function
 * @name angular.isElement
 * @function
 *
 * @description
 * Determines if a reference is a DOM element (or wrapped jQuery element).
 *
 * @param {*} value Reference to check.
 * @returns {boolean} True if `value` is a DOM element (or wrapped jQuery element).
 */
function isElement(node) {
  return node &&
    (node.nodeName  // we are a direct element
    || (node.on && node.find));  // we have an on and find method part of jQuery API
}

/**
 * @param str 'key1,key2,...'
 * @returns {object} in the form of {key1:true, key2:true, ...}
 */
function makeMap(str){
  var obj = {}, items = str.split(","), i;
  for ( i = 0; i < items.length; i++ )
    obj[ items[i] ] = true;
  return obj;
}


if (msie < 9) {
  nodeName_ = function(element) {
    element = element.nodeName ? element : element[0];
    return (element.scopeName && element.scopeName != 'HTML')
      ? uppercase(element.scopeName + ':' + element.nodeName) : element.nodeName;
  };
} else {
  nodeName_ = function(element) {
    return element.nodeName ? element.nodeName : element[0].nodeName;
  };
}


function map(obj, iterator, context) {
  var results = [];
  forEach(obj, function(value, index, list) {
    results.push(iterator.call(context, value, index, list));
  });
  return results;
}


/**
 * @description
 * Determines the number of elements in an array, the number of properties an object has, or
 * the length of a string.
 *
 * Note: This function is used to augment the Object type in Angular expressions. See
 * {@link angular.Object} for more information about Angular arrays.
 *
 * @param {Object|Array|string} obj Object, array, or string to inspect.
 * @param {boolean} [ownPropsOnly=false] Count only "own" properties in an object
 * @returns {number} The size of `obj` or `0` if `obj` is neither an object nor an array.
 */
function size(obj, ownPropsOnly) {
  var count = 0, key;

  if (isArray(obj) || isString(obj)) {
    return obj.length;
  } else if (isObject(obj)){
    for (key in obj)
      if (!ownPropsOnly || obj.hasOwnProperty(key))
        count++;
  }

  return count;
}


function includes(array, obj) {
  return indexOf(array, obj) != -1;
}

function indexOf(array, obj) {
  if (array.indexOf) return array.indexOf(obj);

  for ( var i = 0; i < array.length; i++) {
    if (obj === array[i]) return i;
  }
  return -1;
}

function arrayRemove(array, value) {
  var index = indexOf(array, value);
  if (index >=0)
    array.splice(index, 1);
  return value;
}

function isLeafNode (node) {
  if (node) {
    switch (node.nodeName) {
    case "OPTION":
    case "PRE":
    case "TITLE":
      return true;
    }
  }
  return false;
}

/**
 * @ngdoc function
 * @name angular.copy
 * @function
 *
 * @description
 * Creates a deep copy of `source`, which should be an object or an array.
 *
 * * If no destination is supplied, a copy of the object or array is created.
 * * If a destination is provided, all of its elements (for array) or properties (for objects)
 *   are deleted and then all elements/properties from the source are copied to it.
 * * If `source` is not an object or array (inc. `null` and `undefined`), `source` is returned.
 * * If `source` is identical to 'destination' an exception will be thrown.
 *
 * @param {*} source The source that will be used to make a copy.
 *                   Can be any type, including primitives, `null`, and `undefined`.
 * @param {(Object|Array)=} destination Destination into which the source is copied. If
 *     provided, must be of the same type as `source`.
 * @returns {*} The copy or updated `destination`, if `destination` was specified.
 *
 * @example
 <doc:example>
 <doc:source>
 <div ng-controller="Controller">
 <form novalidate class="simple-form">
 Name: <input type="text" ng-model="user.name" /><br />
 E-mail: <input type="email" ng-model="user.email" /><br />
 Gender: <input type="radio" ng-model="user.gender" value="male" />male
 <input type="radio" ng-model="user.gender" value="female" />female<br />
 <button ng-click="reset()">RESET</button>
 <button ng-click="update(user)">SAVE</button>
 </form>
 <pre>form = {{user | json}}</pre>
 <pre>master = {{master | json}}</pre>
 </div>

 <script>
 function Controller($scope) {
    $scope.master= {};

    $scope.update = function(user) {
      // Example with 1 argument
      $scope.master= angular.copy(user);
    };

    $scope.reset = function() {
      // Example with 2 arguments
      angular.copy($scope.master, $scope.user);
    };

    $scope.reset();
  }
 </script>
 </doc:source>
 </doc:example>
 */
function copy(source, destination){
  if (isWindow(source) || isScope(source)) {
    throw ngMinErr('cpws',
      "Can't copy! Making copies of Window or Scope instances is not supported.");
  }

  if (!destination) {
    destination = source;
    if (source) {
      if (isArray(source)) {
        destination = copy(source, []);
      } else if (isDate(source)) {
        destination = new Date(source.getTime());
      } else if (isRegExp(source)) {
        destination = new RegExp(source.source);
      } else if (isObject(source)) {
        destination = copy(source, {});
      }
    }
  } else {
    if (source === destination) throw ngMinErr('cpi',
      "Can't copy! Source and destination are identical.");
    if (isArray(source)) {
      destination.length = 0;
      for ( var i = 0; i < source.length; i++) {
        destination.push(copy(source[i]));
      }
    } else {
      var h = destination.$$hashKey;
      forEach(destination, function(value, key){
        delete destination[key];
      });
      for ( var key in source) {
        destination[key] = copy(source[key]);
      }
      setHashKey(destination,h);
    }
  }
  return destination;
}

/**
 * Create a shallow copy of an object
 */
function shallowCopy(src, dst) {
  dst = dst || {};

  for(var key in src) {
    // shallowCopy is only ever called by $compile nodeLinkFn, which has control over src
    // so we don't need to worry hasOwnProperty here
    if (src.hasOwnProperty(key) && key.substr(0, 2) !== '$$') {
      dst[key] = src[key];
    }
  }

  return dst;
}


/**
 * @ngdoc function
 * @name angular.equals
 * @function
 *
 * @description
 * Determines if two objects or two values are equivalent. Supports value types, regular
 * expressions, arrays and objects.
 *
 * Two objects or values are considered equivalent if at least one of the following is true:
 *
 * * Both objects or values pass `===` comparison.
 * * Both objects or values are of the same type and all of their properties are equal by
 *   comparing them with `angular.equals`.
 * * Both values are NaN. (In JavaScript, NaN == NaN => false. But we consider two NaN as equal)
 * * Both values represent the same regular expression (In JavasScript,
 *   /abc/ == /abc/ => false. But we consider two regular expressions as equal when their textual
 *   representation matches).
 *
 * During a property comparison, properties of `function` type and properties with names
 * that begin with `$` are ignored.
 *
 * Scope and DOMWindow objects are being compared only by identify (`===`).
 *
 * @param {*} o1 Object or value to compare.
 * @param {*} o2 Object or value to compare.
 * @returns {boolean} True if arguments are equal.
 */
function equals(o1, o2) {
  if (o1 === o2) return true;
  if (o1 === null || o2 === null) return false;
  if (o1 !== o1 && o2 !== o2) return true; // NaN === NaN
  var t1 = typeof o1, t2 = typeof o2, length, key, keySet;
  if (t1 == t2) {
    if (t1 == 'object') {
      if (isArray(o1)) {
        if (!isArray(o2)) return false;
        if ((length = o1.length) == o2.length) {
          for(key=0; key<length; key++) {
            if (!equals(o1[key], o2[key])) return false;
          }
          return true;
        }
      } else if (isDate(o1)) {
        return isDate(o2) && o1.getTime() == o2.getTime();
      } else if (isRegExp(o1) && isRegExp(o2)) {
        return o1.toString() == o2.toString();
      } else {
        if (isScope(o1) || isScope(o2) || isWindow(o1) || isWindow(o2) || isArray(o2)) return false;
        keySet = {};
        for(key in o1) {
          if (key.charAt(0) === '$' || isFunction(o1[key])) continue;
          if (!equals(o1[key], o2[key])) return false;
          keySet[key] = true;
        }
        for(key in o2) {
          if (!keySet.hasOwnProperty(key) &&
              key.charAt(0) !== '$' &&
              o2[key] !== undefined &&
              !isFunction(o2[key])) return false;
        }
        return true;
      }
    }
  }
  return false;
}


function csp() {
  return (document.securityPolicy && document.securityPolicy.isActive) ||
      (document.querySelector &&
      !!(document.querySelector('[ng-csp]') || document.querySelector('[data-ng-csp]')));
}


function concat(array1, array2, index) {
  return array1.concat(slice.call(array2, index));
}

function sliceArgs(args, startIndex) {
  return slice.call(args, startIndex || 0);
}


/* jshint -W101 */
/**
 * @ngdoc function
 * @name angular.bind
 * @function
 *
 * @description
 * Returns a function which calls function `fn` bound to `self` (`self` becomes the `this` for
 * `fn`). You can supply optional `args` that are prebound to the function. This feature is also
 * known as [partial application](http://en.wikipedia.org/wiki/Partial_application), as
 * distinguished from [function currying](http://en.wikipedia.org/wiki/Currying#Contrast_with_partial_function_application).
 *
 * @param {Object} self Context which `fn` should be evaluated in.
 * @param {function()} fn Function to be bound.
 * @param {...*} args Optional arguments to be prebound to the `fn` function call.
 * @returns {function()} Function that wraps the `fn` with all the specified bindings.
 */
/* jshint +W101 */
function bind(self, fn) {
  var curryArgs = arguments.length > 2 ? sliceArgs(arguments, 2) : [];
  if (isFunction(fn) && !(fn instanceof RegExp)) {
    return curryArgs.length
      ? function() {
          return arguments.length
            ? fn.apply(self, curryArgs.concat(slice.call(arguments, 0)))
            : fn.apply(self, curryArgs);
        }
      : function() {
          return arguments.length
            ? fn.apply(self, arguments)
            : fn.call(self);
        };
  } else {
    // in IE, native methods are not functions so they cannot be bound (note: they don't need to be)
    return fn;
  }
}


function toJsonReplacer(key, value) {
  var val = value;

  if (typeof key === 'string' && key.charAt(0) === '$') {
    val = undefined;
  } else if (isWindow(value)) {
    val = '$WINDOW';
  } else if (value &&  document === value) {
    val = '$DOCUMENT';
  } else if (isScope(value)) {
    val = '$SCOPE';
  }

  return val;
}


/**
 * @ngdoc function
 * @name angular.toJson
 * @function
 *
 * @description
 * Serializes input into a JSON-formatted string. Properties with leading $ characters will be
 * stripped since angular uses this notation internally.
 *
 * @param {Object|Array|Date|string|number} obj Input to be serialized into JSON.
 * @param {boolean=} pretty If set to true, the JSON output will contain newlines and whitespace.
 * @returns {string|undefined} JSON-ified string representing `obj`.
 */
function toJson(obj, pretty) {
  if (typeof obj === 'undefined') return undefined;
  return JSON.stringify(obj, toJsonReplacer, pretty ? '  ' : null);
}


/**
 * @ngdoc function
 * @name angular.fromJson
 * @function
 *
 * @description
 * Deserializes a JSON string.
 *
 * @param {string} json JSON string to deserialize.
 * @returns {Object|Array|Date|string|number} Deserialized thingy.
 */
function fromJson(json) {
  return isString(json)
      ? JSON.parse(json)
      : json;
}


function toBoolean(value) {
  if (value && value.length !== 0) {
    var v = lowercase("" + value);
    value = !(v == 'f' || v == '0' || v == 'false' || v == 'no' || v == 'n' || v == '[]');
  } else {
    value = false;
  }
  return value;
}

/**
 * @returns {string} Returns the string representation of the element.
 */
function startingTag(element) {
  element = jqLite(element).clone();
  try {
    // turns out IE does not let you set .html() on elements which
    // are not allowed to have children. So we just ignore it.
    element.html('');
  } catch(e) {}
  // As Per DOM Standards
  var TEXT_NODE = 3;
  var elemHtml = jqLite('<div>').append(element).html();
  try {
    return element[0].nodeType === TEXT_NODE ? lowercase(elemHtml) :
        elemHtml.
          match(/^(<[^>]+>)/)[1].
          replace(/^<([\w\-]+)/, function(match, nodeName) { return '<' + lowercase(nodeName); });
  } catch(e) {
    return lowercase(elemHtml);
  }

}


/////////////////////////////////////////////////

/**
 * Tries to decode the URI component without throwing an exception.
 *
 * @private
 * @param str value potential URI component to check.
 * @returns {boolean} True if `value` can be decoded
 * with the decodeURIComponent function.
 */
function tryDecodeURIComponent(value) {
  try {
    return decodeURIComponent(value);
  } catch(e) {
    // Ignore any invalid uri component
  }
}


/**
 * Parses an escaped url query string into key-value pairs.
 * @returns Object.<(string|boolean)>
 */
function parseKeyValue(/**string*/keyValue) {
  var obj = {}, key_value, key;
  forEach((keyValue || "").split('&'), function(keyValue){
    if ( keyValue ) {
      key_value = keyValue.split('=');
      key = tryDecodeURIComponent(key_value[0]);
      if ( isDefined(key) ) {
        var val = isDefined(key_value[1]) ? tryDecodeURIComponent(key_value[1]) : true;
        if (!obj[key]) {
          obj[key] = val;
        } else if(isArray(obj[key])) {
          obj[key].push(val);
        } else {
          obj[key] = [obj[key],val];
        }
      }
    }
  });
  return obj;
}

function toKeyValue(obj) {
  var parts = [];
  forEach(obj, function(value, key) {
    if (isArray(value)) {
      forEach(value, function(arrayValue) {
        parts.push(encodeUriQuery(key, true) +
                   (arrayValue === true ? '' : '=' + encodeUriQuery(arrayValue, true)));
      });
    } else {
    parts.push(encodeUriQuery(key, true) +
               (value === true ? '' : '=' + encodeUriQuery(value, true)));
    }
  });
  return parts.length ? parts.join('&') : '';
}


/**
 * We need our custom method because encodeURIComponent is too aggressive and doesn't follow
 * http://www.ietf.org/rfc/rfc3986.txt with regards to the character set (pchar) allowed in path
 * segments:
 *    segment       = *pchar
 *    pchar         = unreserved / pct-encoded / sub-delims / ":" / "@"
 *    pct-encoded   = "%" HEXDIG HEXDIG
 *    unreserved    = ALPHA / DIGIT / "-" / "." / "_" / "~"
 *    sub-delims    = "!" / "$" / "&" / "'" / "(" / ")"
 *                     / "*" / "+" / "," / ";" / "="
 */
function encodeUriSegment(val) {
  return encodeUriQuery(val, true).
             replace(/%26/gi, '&').
             replace(/%3D/gi, '=').
             replace(/%2B/gi, '+');
}


/**
 * This method is intended for encoding *key* or *value* parts of query component. We need a custom
 * method because encodeURIComponent is too aggressive and encodes stuff that doesn't have to be
 * encoded per http://tools.ietf.org/html/rfc3986:
 *    query       = *( pchar / "/" / "?" )
 *    pchar         = unreserved / pct-encoded / sub-delims / ":" / "@"
 *    unreserved    = ALPHA / DIGIT / "-" / "." / "_" / "~"
 *    pct-encoded   = "%" HEXDIG HEXDIG
 *    sub-delims    = "!" / "$" / "&" / "'" / "(" / ")"
 *                     / "*" / "+" / "," / ";" / "="
 */
function encodeUriQuery(val, pctEncodeSpaces) {
  return encodeURIComponent(val).
             replace(/%40/gi, '@').
             replace(/%3A/gi, ':').
             replace(/%24/g, '$').
             replace(/%2C/gi, ',').
             replace(/%20/g, (pctEncodeSpaces ? '%20' : '+'));
}


/**
 * @ngdoc directive
 * @name ng.directive:ngApp
 *
 * @element ANY
 * @param {angular.Module} ngApp an optional application
 *   {@link angular.module module} name to load.
 *
 * @description
 *
 * Use this directive to auto-bootstrap an application. Only
 * one ngApp directive can be used per HTML document. The directive
 * designates the root of the application and is typically placed
 * at the root of the page.
 *
 * The first ngApp found in the document will be auto-bootstrapped. To use multiple applications in
 * an HTML document you must manually bootstrap them using {@link angular.bootstrap}.
 * Applications cannot be nested.
 *
 * In the example below if the `ngApp` directive were not placed
 * on the `html` element then the document would not be compiled
 * and the `{{ 1+2 }}` would not be resolved to `3`.
 *
 * `ngApp` is the easiest way to bootstrap an application.
 *
 <doc:example>
   <doc:source>
    I can add: 1 + 2 =  {{ 1+2 }}
   </doc:source>
 </doc:example>
 *
 */
function angularInit(element, bootstrap) {
  var elements = [element],
      appElement,
      module,
      names = ['ng:app', 'ng-app', 'x-ng-app', 'data-ng-app'],
      NG_APP_CLASS_REGEXP = /\sng[:\-]app(:\s*([\w\d_]+);?)?\s/;

  function append(element) {
    element && elements.push(element);
  }

  forEach(names, function(name) {
    names[name] = true;
    append(document.getElementById(name));
    name = name.replace(':', '\\:');
    if (element.querySelectorAll) {
      forEach(element.querySelectorAll('.' + name), append);
      forEach(element.querySelectorAll('.' + name + '\\:'), append);
      forEach(element.querySelectorAll('[' + name + ']'), append);
    }
  });

  forEach(elements, function(element) {
    if (!appElement) {
      var className = ' ' + element.className + ' ';
      var match = NG_APP_CLASS_REGEXP.exec(className);
      if (match) {
        appElement = element;
        module = (match[2] || '').replace(/\s+/g, ',');
      } else {
        forEach(element.attributes, function(attr) {
          if (!appElement && names[attr.name]) {
            appElement = element;
            module = attr.value;
          }
        });
      }
    }
  });
  if (appElement) {
    bootstrap(appElement, module ? [module] : []);
  }
}

/**
 * @ngdoc function
 * @name angular.bootstrap
 * @description
 * Use this function to manually start up angular application.
 *
 * See: {@link guide/bootstrap Bootstrap}
 *
 * Note that ngScenario-based end-to-end tests cannot use this function to bootstrap manually.
 * They must use {@link api/ng.directive:ngApp ngApp}.
 *
 * @param {Element} element DOM element which is the root of angular application.
 * @param {Array<String|Function|Array>=} modules an array of modules to load into the application.
 *     Each item in the array should be the name of a predefined module or a (DI annotated)
 *     function that will be invoked by the injector as a run block.
 *     See: {@link angular.module modules}
 * @returns {AUTO.$injector} Returns the newly created injector for this app.
 */
function bootstrap(element, modules) {
  var doBootstrap = function() {
    element = jqLite(element);

    if (element.injector()) {
      var tag = (element[0] === document) ? 'document' : startingTag(element);
      throw ngMinErr('btstrpd', "App Already Bootstrapped with this Element '{0}'", tag);
    }

    modules = modules || [];
    modules.unshift(['$provide', function($provide) {
      $provide.value('$rootElement', element);
    }]);
    modules.unshift('ng');
    var injector = createInjector(modules);
    injector.invoke(['$rootScope', '$rootElement', '$compile', '$injector', '$animate',
       function(scope, element, compile, injector, animate) {
        scope.$apply(function() {
          element.data('$injector', injector);
          compile(element)(scope);
        });
      }]
    );
    return injector;
  };

  var NG_DEFER_BOOTSTRAP = /^NG_DEFER_BOOTSTRAP!/;

  if (window && !NG_DEFER_BOOTSTRAP.test(window.name)) {
    return doBootstrap();
  }

  window.name = window.name.replace(NG_DEFER_BOOTSTRAP, '');
  angular.resumeBootstrap = function(extraModules) {
    forEach(extraModules, function(module) {
      modules.push(module);
    });
    doBootstrap();
  };
}

var SNAKE_CASE_REGEXP = /[A-Z]/g;
function snake_case(name, separator){
  separator = separator || '_';
  return name.replace(SNAKE_CASE_REGEXP, function(letter, pos) {
    return (pos ? separator : '') + letter.toLowerCase();
  });
}

function bindJQuery() {
  // bind to jQuery if present;
  jQuery = window.jQuery;
  // reset to jQuery or default to us.
  if (jQuery) {
    jqLite = jQuery;
    extend(jQuery.fn, {
      scope: JQLitePrototype.scope,
      isolateScope: JQLitePrototype.isolateScope,
      controller: JQLitePrototype.controller,
      injector: JQLitePrototype.injector,
      inheritedData: JQLitePrototype.inheritedData
    });
    // Method signature:
    //     jqLitePatchJQueryRemove(name, dispatchThis, filterElems, getterIfNoArguments)
    jqLitePatchJQueryRemove('remove', true, true, false);
    jqLitePatchJQueryRemove('empty', false, false, false);
    jqLitePatchJQueryRemove('html', false, false, true);
  } else {
    jqLite = JQLite;
  }
  angular.element = jqLite;
}

/**
 * throw error if the argument is falsy.
 */
function assertArg(arg, name, reason) {
  if (!arg) {
    throw ngMinErr('areq', "Argument '{0}' is {1}", (name || '?'), (reason || "required"));
  }
  return arg;
}

function assertArgFn(arg, name, acceptArrayAnnotation) {
  if (acceptArrayAnnotation && isArray(arg)) {
      arg = arg[arg.length - 1];
  }

  assertArg(isFunction(arg), name, 'not a function, got ' +
      (arg && typeof arg == 'object' ? arg.constructor.name || 'Object' : typeof arg));
  return arg;
}

/**
 * throw error if the name given is hasOwnProperty
 * @param  {String} name    the name to test
 * @param  {String} context the context in which the name is used, such as module or directive
 */
function assertNotHasOwnProperty(name, context) {
  if (name === 'hasOwnProperty') {
    throw ngMinErr('badname', "hasOwnProperty is not a valid {0} name", context);
  }
}

/**
 * Return the value accessible from the object by path. Any undefined traversals are ignored
 * @param {Object} obj starting object
 * @param {string} path path to traverse
 * @param {boolean=true} bindFnToScope
 * @returns value as accessible by path
 */
//TODO(misko): this function needs to be removed
function getter(obj, path, bindFnToScope) {
  if (!path) return obj;
  var keys = path.split('.');
  var key;
  var lastInstance = obj;
  var len = keys.length;

  for (var i = 0; i < len; i++) {
    key = keys[i];
    if (obj) {
      obj = (lastInstance = obj)[key];
    }
  }
  if (!bindFnToScope && isFunction(obj)) {
    return bind(lastInstance, obj);
  }
  return obj;
}

/**
 * Return the siblings between `startNode` and `endNode`, inclusive
 * @param {Object} object with `startNode` and `endNode` properties
 * @returns jQlite object containing the elements
 */
function getBlockElements(block) {
  if (block.startNode === block.endNode) {
    return jqLite(block.startNode);
  }

  var element = block.startNode;
  var elements = [element];

  do {
    element = element.nextSibling;
    if (!element) break;
    elements.push(element);
  } while (element !== block.endNode);

  return jqLite(elements);
}

/**
 * @ngdoc interface
 * @name angular.Module
 * @description
 *
 * Interface for configuring angular {@link angular.module modules}.
 */

function setupModuleLoader(window) {

  var $injectorMinErr = minErr('$injector');
  var ngMinErr = minErr('ng');

  function ensure(obj, name, factory) {
    return obj[name] || (obj[name] = factory());
  }

  return ensure(ensure(window, 'angular', Object), 'module', function() {
    /** @type {Object.<string, angular.Module>} */
    var modules = {};

    /**
     * @ngdoc function
     * @name angular.module
     * @description
     *
     * The `angular.module` is a global place for creating, registering and retrieving Angular
     * modules.
     * All modules (angular core or 3rd party) that should be available to an application must be
     * registered using this mechanism.
     *
     * When passed two or more arguments, a new module is created.  If passed only one argument, an
     * existing module (the name passed as the first argument to `module`) is retrieved.
     *
     *
     * # Module
     *
     * A module is a collection of services, directives, filters, and configuration information.
     * `angular.module` is used to configure the {@link AUTO.$injector $injector}.
     *
     * <pre>
     * // Create a new module
     * var myModule = angular.module('myModule', []);
     *
     * // register a new service
     * myModule.value('appName', 'MyCoolApp');
     *
     * // configure existing services inside initialization blocks.
     * myModule.config(function($locationProvider) {
     *   // Configure existing providers
     *   $locationProvider.hashPrefix('!');
     * });
     * </pre>
     *
     * Then you can create an injector and load your modules like this:
     *
     * <pre>
     * var injector = angular.injector(['ng', 'MyModule'])
     * </pre>
     *
     * However it's more likely that you'll just use
     * {@link ng.directive:ngApp ngApp} or
     * {@link angular.bootstrap} to simplify this process for you.
     *
     * @param {!string} name The name of the module to create or retrieve.
     * @param {Array.<string>=} requires If specified then new module is being created. If
     *        unspecified then the the module is being retrieved for further configuration.
     * @param {Function} configFn Optional configuration function for the module. Same as
     *        {@link angular.Module#methods_config Module#config()}.
     * @returns {module} new module with the {@link angular.Module} api.
     */
    return function module(name, requires, configFn) {
      var assertNotHasOwnProperty = function(name, context) {
        if (name === 'hasOwnProperty') {
          throw ngMinErr('badname', 'hasOwnProperty is not a valid {0} name', context);
        }
      };

      assertNotHasOwnProperty(name, 'module');
      if (requires && modules.hasOwnProperty(name)) {
        modules[name] = null;
      }
      return ensure(modules, name, function() {
        if (!requires) {
          throw $injectorMinErr('nomod', "Module '{0}' is not available! You either misspelled " +
             "the module name or forgot to load it. If registering a module ensure that you " +
             "specify the dependencies as the second argument.", name);
        }

        /** @type {!Array.<Array.<*>>} */
        var invokeQueue = [];

        /** @type {!Array.<Function>} */
        var runBlocks = [];

        var config = invokeLater('$injector', 'invoke');

        /** @type {angular.Module} */
        var moduleInstance = {
          // Private state
          _invokeQueue: invokeQueue,
          _runBlocks: runBlocks,

          /**
           * @ngdoc property
           * @name angular.Module#requires
           * @propertyOf angular.Module
           * @returns {Array.<string>} List of module names which must be loaded before this module.
           * @description
           * Holds the list of modules which the injector will load before the current module is
           * loaded.
           */
          requires: requires,

          /**
           * @ngdoc property
           * @name angular.Module#name
           * @propertyOf angular.Module
           * @returns {string} Name of the module.
           * @description
           */
          name: name,


          /**
           * @ngdoc method
           * @name angular.Module#provider
           * @methodOf angular.Module
           * @param {string} name service name
           * @param {Function} providerType Construction function for creating new instance of the
           *                                service.
           * @description
           * See {@link AUTO.$provide#provider $provide.provider()}.
           */
          provider: invokeLater('$provide', 'provider'),

          /**
           * @ngdoc method
           * @name angular.Module#factory
           * @methodOf angular.Module
           * @param {string} name service name
           * @param {Function} providerFunction Function for creating new instance of the service.
           * @description
           * See {@link AUTO.$provide#factory $provide.factory()}.
           */
          factory: invokeLater('$provide', 'factory'),

          /**
           * @ngdoc method
           * @name angular.Module#service
           * @methodOf angular.Module
           * @param {string} name service name
           * @param {Function} constructor A constructor function that will be instantiated.
           * @description
           * See {@link AUTO.$provide#service $provide.service()}.
           */
          service: invokeLater('$provide', 'service'),

          /**
           * @ngdoc method
           * @name angular.Module#value
           * @methodOf angular.Module
           * @param {string} name service name
           * @param {*} object Service instance object.
           * @description
           * See {@link AUTO.$provide#value $provide.value()}.
           */
          value: invokeLater('$provide', 'value'),

          /**
           * @ngdoc method
           * @name angular.Module#constant
           * @methodOf angular.Module
           * @param {string} name constant name
           * @param {*} object Constant value.
           * @description
           * Because the constant are fixed, they get applied before other provide methods.
           * See {@link AUTO.$provide#constant $provide.constant()}.
           */
          constant: invokeLater('$provide', 'constant', 'unshift'),

          /**
           * @ngdoc method
           * @name angular.Module#animation
           * @methodOf angular.Module
           * @param {string} name animation name
           * @param {Function} animationFactory Factory function for creating new instance of an
           *                                    animation.
           * @description
           *
           * **NOTE**: animations take effect only if the **ngAnimate** module is loaded.
           *
           *
           * Defines an animation hook that can be later used with
           * {@link ngAnimate.$animate $animate} service and directives that use this service.
           *
           * <pre>
           * module.animation('.animation-name', function($inject1, $inject2) {
           *   return {
           *     eventName : function(element, done) {
           *       //code to run the animation
           *       //once complete, then run done()
           *       return function cancellationFunction(element) {
           *         //code to cancel the animation
           *       }
           *     }
           *   }
           * })
           * </pre>
           *
           * See {@link ngAnimate.$animateProvider#register $animateProvider.register()} and
           * {@link ngAnimate ngAnimate module} for more information.
           */
          animation: invokeLater('$animateProvider', 'register'),

          /**
           * @ngdoc method
           * @name angular.Module#filter
           * @methodOf angular.Module
           * @param {string} name Filter name.
           * @param {Function} filterFactory Factory function for creating new instance of filter.
           * @description
           * See {@link ng.$filterProvider#register $filterProvider.register()}.
           */
          filter: invokeLater('$filterProvider', 'register'),

          /**
           * @ngdoc method
           * @name angular.Module#controller
           * @methodOf angular.Module
           * @param {string|Object} name Controller name, or an object map of controllers where the
           *    keys are the names and the values are the constructors.
           * @param {Function} constructor Controller constructor function.
           * @description
           * See {@link ng.$controllerProvider#register $controllerProvider.register()}.
           */
          controller: invokeLater('$controllerProvider', 'register'),

          /**
           * @ngdoc method
           * @name angular.Module#directive
           * @methodOf angular.Module
           * @param {string|Object} name Directive name, or an object map of directives where the
           *    keys are the names and the values are the factories.
           * @param {Function} directiveFactory Factory function for creating new instance of
           * directives.
           * @description
           * See {@link ng.$compileProvider#methods_directive $compileProvider.directive()}.
           */
          directive: invokeLater('$compileProvider', 'directive'),

          /**
           * @ngdoc method
           * @name angular.Module#config
           * @methodOf angular.Module
           * @param {Function} configFn Execute this function on module load. Useful for service
           *    configuration.
           * @description
           * Use this method to register work which needs to be performed on module loading.
           */
          config: config,

          /**
           * @ngdoc method
           * @name angular.Module#run
           * @methodOf angular.Module
           * @param {Function} initializationFn Execute this function after injector creation.
           *    Useful for application initialization.
           * @description
           * Use this method to register work which should be performed when the injector is done
           * loading all modules.
           */
          run: function(block) {
            runBlocks.push(block);
            return this;
          }
        };

        if (configFn) {
          config(configFn);
        }

        return  moduleInstance;

        /**
         * @param {string} provider
         * @param {string} method
         * @param {String=} insertMethod
         * @returns {angular.Module}
         */
        function invokeLater(provider, method, insertMethod) {
          return function() {
            invokeQueue[insertMethod || 'push']([provider, method, arguments]);
            return moduleInstance;
          };
        }
      });
    };
  });

}

/* global
    angularModule: true,
    version: true,
    
    $LocaleProvider,
    $CompileProvider,
    
    htmlAnchorDirective,
    inputDirective,
    inputDirective,
    formDirective,
    scriptDirective,
    selectDirective,
    styleDirective,
    optionDirective,
    ngBindDirective,
    ngBindHtmlDirective,
    ngBindTemplateDirective,
    ngClassDirective,
    ngClassEvenDirective,
    ngClassOddDirective,
    ngCspDirective,
    ngCloakDirective,
    ngControllerDirective,
    ngFormDirective,
    ngHideDirective,
    ngIfDirective,
    ngIncludeDirective,
    ngInitDirective,
    ngNonBindableDirective,
    ngPluralizeDirective,
    ngRepeatDirective,
    ngShowDirective,
    ngStyleDirective,
    ngSwitchDirective,
    ngSwitchWhenDirective,
    ngSwitchDefaultDirective,
    ngOptionsDirective,
    ngTranscludeDirective,
    ngModelDirective,
    ngListDirective,
    ngChangeDirective,
    requiredDirective,
    requiredDirective,
    ngValueDirective,
    ngAttributeAliasDirectives,
    ngEventDirectives,

    $AnchorScrollProvider,
    $AnimateProvider,
    $BrowserProvider,
    $CacheFactoryProvider,
    $ControllerProvider,
    $DocumentProvider,
    $ExceptionHandlerProvider,
    $FilterProvider,
    $InterpolateProvider,
    $IntervalProvider,
    $HttpProvider,
    $HttpBackendProvider,
    $LocationProvider,
    $LogProvider,
    $ParseProvider,
    $RootScopeProvider,
    $QProvider,
    $SceProvider,
    $SceDelegateProvider,
    $SnifferProvider,
    $TemplateCacheProvider,
    $TimeoutProvider,
    $WindowProvider
*/


/**
 * @ngdoc property
 * @name angular.version
 * @description
 * An object that contains information about the current AngularJS version. This object has the
 * following properties:
 *
 * - `full` – `{string}` – Full version string, such as "0.9.18".
 * - `major` – `{number}` – Major version number, such as "0".
 * - `minor` – `{number}` – Minor version number, such as "9".
 * - `dot` – `{number}` – Dot version number, such as "18".
 * - `codeName` – `{string}` – Code name of the release, such as "jiggling-armfat".
 */
var version = {
  full: '1.2.1',    // all of these placeholder strings will be replaced by grunt's
  major: 1,    // package task
  minor: 2,
  dot: 1,
  codeName: 'underscore-empathy'
};


function publishExternalAPI(angular){
  extend(angular, {
    'bootstrap': bootstrap,
    'copy': copy,
    'extend': extend,
    'equals': equals,
    'element': jqLite,
    'forEach': forEach,
    'injector': createInjector,
    'noop':noop,
    'bind':bind,
    'toJson': toJson,
    'fromJson': fromJson,
    'identity':identity,
    'isUndefined': isUndefined,
    'isDefined': isDefined,
    'isString': isString,
    'isFunction': isFunction,
    'isObject': isObject,
    'isNumber': isNumber,
    'isElement': isElement,
    'isArray': isArray,
    'version': version,
    'isDate': isDate,
    'lowercase': lowercase,
    'uppercase': uppercase,
    'callbacks': {counter: 0},
    '$$minErr': minErr,
    '$$csp': csp
  });

  angularModule = setupModuleLoader(window);
  try {
    angularModule('ngLocale');
  } catch (e) {
    angularModule('ngLocale', []).provider('$locale', $LocaleProvider);
  }

  angularModule('ng', ['ngLocale'], ['$provide',
    function ngModule($provide) {
      $provide.provider('$compile', $CompileProvider).
        directive({
            a: htmlAnchorDirective,
            input: inputDirective,
            textarea: inputDirective,
            form: formDirective,
            script: scriptDirective,
            select: selectDirective,
            style: styleDirective,
            option: optionDirective,
            ngBind: ngBindDirective,
            ngBindHtml: ngBindHtmlDirective,
            ngBindTemplate: ngBindTemplateDirective,
            ngClass: ngClassDirective,
            ngClassEven: ngClassEvenDirective,
            ngClassOdd: ngClassOddDirective,
            ngCloak: ngCloakDirective,
            ngController: ngControllerDirective,
            ngForm: ngFormDirective,
            ngHide: ngHideDirective,
            ngIf: ngIfDirective,
            ngInclude: ngIncludeDirective,
            ngInit: ngInitDirective,
            ngNonBindable: ngNonBindableDirective,
            ngPluralize: ngPluralizeDirective,
            ngRepeat: ngRepeatDirective,
            ngShow: ngShowDirective,
            ngStyle: ngStyleDirective,
            ngSwitch: ngSwitchDirective,
            ngSwitchWhen: ngSwitchWhenDirective,
            ngSwitchDefault: ngSwitchDefaultDirective,
            ngOptions: ngOptionsDirective,
            ngTransclude: ngTranscludeDirective,
            ngModel: ngModelDirective,
            ngList: ngListDirective,
            ngChange: ngChangeDirective,
            required: requiredDirective,
            ngRequired: requiredDirective,
            ngValue: ngValueDirective
        }).
        directive(ngAttributeAliasDirectives).
        directive(ngEventDirectives);
      $provide.provider({
        $anchorScroll: $AnchorScrollProvider,
        $animate: $AnimateProvider,
        $browser: $BrowserProvider,
        $cacheFactory: $CacheFactoryProvider,
        $controller: $ControllerProvider,
        $document: $DocumentProvider,
        $exceptionHandler: $ExceptionHandlerProvider,
        $filter: $FilterProvider,
        $interpolate: $InterpolateProvider,
        $interval: $IntervalProvider,
        $http: $HttpProvider,
        $httpBackend: $HttpBackendProvider,
        $location: $LocationProvider,
        $log: $LogProvider,
        $parse: $ParseProvider,
        $rootScope: $RootScopeProvider,
        $q: $QProvider,
        $sce: $SceProvider,
        $sceDelegate: $SceDelegateProvider,
        $sniffer: $SnifferProvider,
        $templateCache: $TemplateCacheProvider,
        $timeout: $TimeoutProvider,
        $window: $WindowProvider
      });
    }
  ]);
}

/* global

  -JQLitePrototype,
  -addEventListenerFn,
  -removeEventListenerFn,
  -BOOLEAN_ATTR
*/

//////////////////////////////////
//JQLite
//////////////////////////////////

/**
 * @ngdoc function
 * @name angular.element
 * @function
 *
 * @description
 * Wraps a raw DOM element or HTML string as a [jQuery](http://jquery.com) element.
 *
 * If jQuery is available, `angular.element` is an alias for the
 * [jQuery](http://api.jquery.com/jQuery/) function. If jQuery is not available, `angular.element`
 * delegates to Angular's built-in subset of jQuery, called "jQuery lite" or "jqLite."
 *
 * <div class="alert alert-success">jqLite is a tiny, API-compatible subset of jQuery that allows
 * Angular to manipulate the DOM in a cross-browser compatible way. **jqLite** implements only the most
 * commonly needed functionality with the goal of having a very small footprint.</div>
 *
 * To use jQuery, simply load it before `DOMContentLoaded` event fired.
 *
 * <div class="alert">**Note:** all element references in Angular are always wrapped with jQuery or
 * jqLite; they are never raw DOM references.</div>
 *
 * ## Angular's jqLite
 * jqLite provides only the following jQuery methods:
 *
 * - [`addClass()`](http://api.jquery.com/addClass/)
 * - [`after()`](http://api.jquery.com/after/)
 * - [`append()`](http://api.jquery.com/append/)
 * - [`attr()`](http://api.jquery.com/attr/)
 * - [`bind()`](http://api.jquery.com/on/) - Does not support namespaces, selectors or eventData
 * - [`children()`](http://api.jquery.com/children/) - Does not support selectors
 * - [`clone()`](http://api.jquery.com/clone/)
 * - [`contents()`](http://api.jquery.com/contents/)
 * - [`css()`](http://api.jquery.com/css/)
 * - [`data()`](http://api.jquery.com/data/)
 * - [`eq()`](http://api.jquery.com/eq/)
 * - [`find()`](http://api.jquery.com/find/) - Limited to lookups by tag name
 * - [`hasClass()`](http://api.jquery.com/hasClass/)
 * - [`html()`](http://api.jquery.com/html/)
 * - [`next()`](http://api.jquery.com/next/) - Does not support selectors
 * - [`on()`](http://api.jquery.com/on/) - Does not support namespaces, selectors or eventData
 * - [`off()`](http://api.jquery.com/off/) - Does not support namespaces or selectors
 * - [`parent()`](http://api.jquery.com/parent/) - Does not support selectors
 * - [`prepend()`](http://api.jquery.com/prepend/)
 * - [`prop()`](http://api.jquery.com/prop/)
 * - [`ready()`](http://api.jquery.com/ready/)
 * - [`remove()`](http://api.jquery.com/remove/)
 * - [`removeAttr()`](http://api.jquery.com/removeAttr/)
 * - [`removeClass()`](http://api.jquery.com/removeClass/)
 * - [`removeData()`](http://api.jquery.com/removeData/)
 * - [`replaceWith()`](http://api.jquery.com/replaceWith/)
 * - [`text()`](http://api.jquery.com/text/)
 * - [`toggleClass()`](http://api.jquery.com/toggleClass/)
 * - [`triggerHandler()`](http://api.jquery.com/triggerHandler/) - Passes a dummy event object to handlers.
 * - [`unbind()`](http://api.jquery.com/off/) - Does not support namespaces
 * - [`val()`](http://api.jquery.com/val/)
 * - [`wrap()`](http://api.jquery.com/wrap/)
 *
 * ## jQuery/jqLite Extras
 * Angular also provides the following additional methods and events to both jQuery and jqLite:
 *
 * ### Events
 * - `$destroy` - AngularJS intercepts all jqLite/jQuery's DOM destruction apis and fires this event
 *    on all DOM nodes being removed.  This can be used to clean up any 3rd party bindings to the DOM
 *    element before it is removed.
 *
 * ### Methods
 * - `controller(name)` - retrieves the controller of the current element or its parent. By default
 *   retrieves controller associated with the `ngController` directive. If `name` is provided as
 *   camelCase directive name, then the controller for this directive will be retrieved (e.g.
 *   `'ngModel'`).
 * - `injector()` - retrieves the injector of the current element or its parent.
 * - `scope()` - retrieves the {@link api/ng.$rootScope.Scope scope} of the current
 *   element or its parent.
 * - `isolateScope()` - retrieves an isolate {@link api/ng.$rootScope.Scope scope} if one is attached directly to the
 *   current element. This getter should be used only on elements that contain a directive which starts a new isolate
 *   scope. Calling `scope()` on this element always returns the original non-isolate scope.
 * - `inheritedData()` - same as `data()`, but walks up the DOM until a value is found or the top
 *   parent element is reached.
 *
 * @param {string|DOMElement} element HTML string or DOMElement to be wrapped into jQuery.
 * @returns {Object} jQuery object.
 */

var jqCache = JQLite.cache = {},
    jqName = JQLite.expando = 'ng-' + new Date().getTime(),
    jqId = 1,
    addEventListenerFn = (window.document.addEventListener
      ? function(element, type, fn) {element.addEventListener(type, fn, false);}
      : function(element, type, fn) {element.attachEvent('on' + type, fn);}),
    removeEventListenerFn = (window.document.removeEventListener
      ? function(element, type, fn) {element.removeEventListener(type, fn, false); }
      : function(element, type, fn) {element.detachEvent('on' + type, fn); });

function jqNextId() { return ++jqId; }


var SPECIAL_CHARS_REGEXP = /([\:\-\_]+(.))/g;
var MOZ_HACK_REGEXP = /^moz([A-Z])/;
var jqLiteMinErr = minErr('jqLite');

/**
 * Converts snake_case to camelCase.
 * Also there is special case for Moz prefix starting with upper case letter.
 * @param name Name to normalize
 */
function camelCase(name) {
  return name.
    replace(SPECIAL_CHARS_REGEXP, function(_, separator, letter, offset) {
      return offset ? letter.toUpperCase() : letter;
    }).
    replace(MOZ_HACK_REGEXP, 'Moz$1');
}

/////////////////////////////////////////////
// jQuery mutation patch
//
// In conjunction with bindJQuery intercepts all jQuery's DOM destruction apis and fires a
// $destroy event on all DOM nodes being removed.
//
/////////////////////////////////////////////

function jqLitePatchJQueryRemove(name, dispatchThis, filterElems, getterIfNoArguments) {
  var originalJqFn = jQuery.fn[name];
  originalJqFn = originalJqFn.$original || originalJqFn;
  removePatch.$original = originalJqFn;
  jQuery.fn[name] = removePatch;

  function removePatch(param) {
    // jshint -W040
    var list = filterElems && param ? [this.filter(param)] : [this],
        fireEvent = dispatchThis,
        set, setIndex, setLength,
        element, childIndex, childLength, children;

    if (!getterIfNoArguments || param != null) {
      while(list.length) {
        set = list.shift();
        for(setIndex = 0, setLength = set.length; setIndex < setLength; setIndex++) {
          element = jqLite(set[setIndex]);
          if (fireEvent) {
            element.triggerHandler('$destroy');
          } else {
            fireEvent = !fireEvent;
          }
          for(childIndex = 0, childLength = (children = element.children()).length;
              childIndex < childLength;
              childIndex++) {
            list.push(jQuery(children[childIndex]));
          }
        }
      }
    }
    return originalJqFn.apply(this, arguments);
  }
}

/////////////////////////////////////////////
function JQLite(element) {
  if (element instanceof JQLite) {
    return element;
  }
  if (!(this instanceof JQLite)) {
    if (isString(element) && element.charAt(0) != '<') {
      throw jqLiteMinErr('nosel', 'Looking up elements via selectors is not supported by jqLite! See: http://docs.angularjs.org/api/angular.element');
    }
    return new JQLite(element);
  }

  if (isString(element)) {
    var div = document.createElement('div');
    // Read about the NoScope elements here:
    // http://msdn.microsoft.com/en-us/library/ms533897(VS.85).aspx
    div.innerHTML = '<div>&#160;</div>' + element; // IE insanity to make NoScope elements work!
    div.removeChild(div.firstChild); // remove the superfluous div
    jqLiteAddNodes(this, div.childNodes);
    var fragment = jqLite(document.createDocumentFragment());
    fragment.append(this); // detach the elements from the temporary DOM div.
  } else {
    jqLiteAddNodes(this, element);
  }
}

function jqLiteClone(element) {
  return element.cloneNode(true);
}

function jqLiteDealoc(element){
  jqLiteRemoveData(element);
  for ( var i = 0, children = element.childNodes || []; i < children.length; i++) {
    jqLiteDealoc(children[i]);
  }
}

function jqLiteOff(element, type, fn, unsupported) {
  if (isDefined(unsupported)) throw jqLiteMinErr('offargs', 'jqLite#off() does not support the `selector` argument');

  var events = jqLiteExpandoStore(element, 'events'),
      handle = jqLiteExpandoStore(element, 'handle');

  if (!handle) return; //no listeners registered

  if (isUndefined(type)) {
    forEach(events, function(eventHandler, type) {
      removeEventListenerFn(element, type, eventHandler);
      delete events[type];
    });
  } else {
    forEach(type.split(' '), function(type) {
      if (isUndefined(fn)) {
        removeEventListenerFn(element, type, events[type]);
        delete events[type];
      } else {
        arrayRemove(events[type] || [], fn);
      }
    });
  }
}

function jqLiteRemoveData(element, name) {
  var expandoId = element[jqName],
      expandoStore = jqCache[expandoId];

  if (expandoStore) {
    if (name) {
      delete jqCache[expandoId].data[name];
      return;
    }

    if (expandoStore.handle) {
      expandoStore.events.$destroy && expandoStore.handle({}, '$destroy');
      jqLiteOff(element);
    }
    delete jqCache[expandoId];
    element[jqName] = undefined; // ie does not allow deletion of attributes on elements.
  }
}

function jqLiteExpandoStore(element, key, value) {
  var expandoId = element[jqName],
      expandoStore = jqCache[expandoId || -1];

  if (isDefined(value)) {
    if (!expandoStore) {
      element[jqName] = expandoId = jqNextId();
      expandoStore = jqCache[expandoId] = {};
    }
    expandoStore[key] = value;
  } else {
    return expandoStore && expandoStore[key];
  }
}

function jqLiteData(element, key, value) {
  var data = jqLiteExpandoStore(element, 'data'),
      isSetter = isDefined(value),
      keyDefined = !isSetter && isDefined(key),
      isSimpleGetter = keyDefined && !isObject(key);

  if (!data && !isSimpleGetter) {
    jqLiteExpandoStore(element, 'data', data = {});
  }

  if (isSetter) {
    data[key] = value;
  } else {
    if (keyDefined) {
      if (isSimpleGetter) {
        // don't create data in this case.
        return data && data[key];
      } else {
        extend(data, key);
      }
    } else {
      return data;
    }
  }
}

function jqLiteHasClass(element, selector) {
  if (!element.getAttribute) return false;
  return ((" " + (element.getAttribute('class') || '') + " ").replace(/[\n\t]/g, " ").
      indexOf( " " + selector + " " ) > -1);
}

function jqLiteRemoveClass(element, cssClasses) {
  if (cssClasses && element.setAttribute) {
    forEach(cssClasses.split(' '), function(cssClass) {
      element.setAttribute('class', trim(
          (" " + (element.getAttribute('class') || '') + " ")
          .replace(/[\n\t]/g, " ")
          .replace(" " + trim(cssClass) + " ", " "))
      );
    });
  }
}

function jqLiteAddClass(element, cssClasses) {
  if (cssClasses && element.setAttribute) {
    var existingClasses = (' ' + (element.getAttribute('class') || '') + ' ')
                            .replace(/[\n\t]/g, " ");

    forEach(cssClasses.split(' '), function(cssClass) {
      cssClass = trim(cssClass);
      if (existingClasses.indexOf(' ' + cssClass + ' ') === -1) {
        existingClasses += cssClass + ' ';
      }
    });

    element.setAttribute('class', trim(existingClasses));
  }
}

function jqLiteAddNodes(root, elements) {
  if (elements) {
    elements = (!elements.nodeName && isDefined(elements.length) && !isWindow(elements))
      ? elements
      : [ elements ];
    for(var i=0; i < elements.length; i++) {
      root.push(elements[i]);
    }
  }
}

function jqLiteController(element, name) {
  return jqLiteInheritedData(element, '$' + (name || 'ngController' ) + 'Controller');
}

function jqLiteInheritedData(element, name, value) {
  element = jqLite(element);

  // if element is the document object work with the html element instead
  // this makes $(document).scope() possible
  if(element[0].nodeType == 9) {
    element = element.find('html');
  }
  var names = isArray(name) ? name : [name];

  while (element.length) {

    for (var i = 0, ii = names.length; i < ii; i++) {
      if ((value = element.data(names[i])) !== undefined) return value;
    }
    element = element.parent();
  }
}

//////////////////////////////////////////
// Functions which are declared directly.
//////////////////////////////////////////
var JQLitePrototype = JQLite.prototype = {
  ready: function(fn) {
    var fired = false;

    function trigger() {
      if (fired) return;
      fired = true;
      fn();
    }

    // check if document already is loaded
    if (document.readyState === 'complete'){
      setTimeout(trigger);
    } else {
      this.on('DOMContentLoaded', trigger); // works for modern browsers and IE9
      // we can not use jqLite since we are not done loading and jQuery could be loaded later.
      // jshint -W064
      JQLite(window).on('load', trigger); // fallback to window.onload for others
      // jshint +W064
    }
  },
  toString: function() {
    var value = [];
    forEach(this, function(e){ value.push('' + e);});
    return '[' + value.join(', ') + ']';
  },

  eq: function(index) {
      return (index >= 0) ? jqLite(this[index]) : jqLite(this[this.length + index]);
  },

  length: 0,
  push: push,
  sort: [].sort,
  splice: [].splice
};

//////////////////////////////////////////
// Functions iterating getter/setters.
// these functions return self on setter and
// value on get.
//////////////////////////////////////////
var BOOLEAN_ATTR = {};
forEach('multiple,selected,checked,disabled,readOnly,required,open'.split(','), function(value) {
  BOOLEAN_ATTR[lowercase(value)] = value;
});
var BOOLEAN_ELEMENTS = {};
forEach('input,select,option,textarea,button,form,details'.split(','), function(value) {
  BOOLEAN_ELEMENTS[uppercase(value)] = true;
});

function getBooleanAttrName(element, name) {
  // check dom last since we will most likely fail on name
  var booleanAttr = BOOLEAN_ATTR[name.toLowerCase()];

  // booleanAttr is here twice to minimize DOM access
  return booleanAttr && BOOLEAN_ELEMENTS[element.nodeName] && booleanAttr;
}

forEach({
  data: jqLiteData,
  inheritedData: jqLiteInheritedData,

  scope: function(element) {
    // Can't use jqLiteData here directly so we stay compatible with jQuery!
    return jqLite(element).data('$scope') || jqLiteInheritedData(element.parentNode || element, ['$isolateScope', '$scope']);
  },

  isolateScope: function(element) {
    // Can't use jqLiteData here directly so we stay compatible with jQuery!
    return jqLite(element).data('$isolateScope') || jqLite(element).data('$isolateScopeNoTemplate');
  },

  controller: jqLiteController ,

  injector: function(element) {
    return jqLiteInheritedData(element, '$injector');
  },

  removeAttr: function(element,name) {
    element.removeAttribute(name);
  },

  hasClass: jqLiteHasClass,

  css: function(element, name, value) {
    name = camelCase(name);

    if (isDefined(value)) {
      element.style[name] = value;
    } else {
      var val;

      if (msie <= 8) {
        // this is some IE specific weirdness that jQuery 1.6.4 does not sure why
        val = element.currentStyle && element.currentStyle[name];
        if (val === '') val = 'auto';
      }

      val = val || element.style[name];

      if (msie <= 8) {
        // jquery weirdness :-/
        val = (val === '') ? undefined : val;
      }

      return  val;
    }
  },

  attr: function(element, name, value){
    var lowercasedName = lowercase(name);
    if (BOOLEAN_ATTR[lowercasedName]) {
      if (isDefined(value)) {
        if (!!value) {
          element[name] = true;
          element.setAttribute(name, lowercasedName);
        } else {
          element[name] = false;
          element.removeAttribute(lowercasedName);
        }
      } else {
        return (element[name] ||
                 (element.attributes.getNamedItem(name)|| noop).specified)
               ? lowercasedName
               : undefined;
      }
    } else if (isDefined(value)) {
      element.setAttribute(name, value);
    } else if (element.getAttribute) {
      // the extra argument "2" is to get the right thing for a.href in IE, see jQuery code
      // some elements (e.g. Document) don't have get attribute, so return undefined
      var ret = element.getAttribute(name, 2);
      // normalize non-existing attributes to undefined (as jQuery)
      return ret === null ? undefined : ret;
    }
  },

  prop: function(element, name, value) {
    if (isDefined(value)) {
      element[name] = value;
    } else {
      return element[name];
    }
  },

  text: (function() {
    var NODE_TYPE_TEXT_PROPERTY = [];
    if (msie < 9) {
      NODE_TYPE_TEXT_PROPERTY[1] = 'innerText';    /** Element **/
      NODE_TYPE_TEXT_PROPERTY[3] = 'nodeValue';    /** Text **/
    } else {
      NODE_TYPE_TEXT_PROPERTY[1] =                 /** Element **/
      NODE_TYPE_TEXT_PROPERTY[3] = 'textContent';  /** Text **/
    }
    getText.$dv = '';
    return getText;

    function getText(element, value) {
      var textProp = NODE_TYPE_TEXT_PROPERTY[element.nodeType];
      if (isUndefined(value)) {
        return textProp ? element[textProp] : '';
      }
      element[textProp] = value;
    }
  })(),

  val: function(element, value) {
    if (isUndefined(value)) {
      if (nodeName_(element) === 'SELECT' && element.multiple) {
        var result = [];
        forEach(element.options, function (option) {
          if (option.selected) {
            result.push(option.value || option.text);
          }
        });
        return result.length === 0 ? null : result;
      }
      return element.value;
    }
    element.value = value;
  },

  html: function(element, value) {
    if (isUndefined(value)) {
      return element.innerHTML;
    }
    for (var i = 0, childNodes = element.childNodes; i < childNodes.length; i++) {
      jqLiteDealoc(childNodes[i]);
    }
    element.innerHTML = value;
  }
}, function(fn, name){
  /**
   * Properties: writes return selection, reads return first value
   */
  JQLite.prototype[name] = function(arg1, arg2) {
    var i, key;

    // jqLiteHasClass has only two arguments, but is a getter-only fn, so we need to special-case it
    // in a way that survives minification.
    if (((fn.length == 2 && (fn !== jqLiteHasClass && fn !== jqLiteController)) ? arg1 : arg2) === undefined) {
      if (isObject(arg1)) {

        // we are a write, but the object properties are the key/values
        for(i=0; i < this.length; i++) {
          if (fn === jqLiteData) {
            // data() takes the whole object in jQuery
            fn(this[i], arg1);
          } else {
            for (key in arg1) {
              fn(this[i], key, arg1[key]);
            }
          }
        }
        // return self for chaining
        return this;
      } else {
        // we are a read, so read the first child.
        var value = fn.$dv;
        // Only if we have $dv do we iterate over all, otherwise it is just the first element.
        var jj = (value === undefined) ? Math.min(this.length, 1) : this.length;
        for (var j = 0; j < jj; j++) {
          var nodeValue = fn(this[j], arg1, arg2);
          value = value ? value + nodeValue : nodeValue;
        }
        return value;
      }
    } else {
      // we are a write, so apply to all children
      for(i=0; i < this.length; i++) {
        fn(this[i], arg1, arg2);
      }
      // return self for chaining
      return this;
    }
  };
});

function createEventHandler(element, events) {
  var eventHandler = function (event, type) {
    if (!event.preventDefault) {
      event.preventDefault = function() {
        event.returnValue = false; //ie
      };
    }

    if (!event.stopPropagation) {
      event.stopPropagation = function() {
        event.cancelBubble = true; //ie
      };
    }

    if (!event.target) {
      event.target = event.srcElement || document;
    }

    if (isUndefined(event.defaultPrevented)) {
      var prevent = event.preventDefault;
      event.preventDefault = function() {
        event.defaultPrevented = true;
        prevent.call(event);
      };
      event.defaultPrevented = false;
    }

    event.isDefaultPrevented = function() {
      return event.defaultPrevented || event.returnValue === false;
    };

    forEach(events[type || event.type], function(fn) {
      fn.call(element, event);
    });

    // Remove monkey-patched methods (IE),
    // as they would cause memory leaks in IE8.
    if (msie <= 8) {
      // IE7/8 does not allow to delete property on native object
      event.preventDefault = null;
      event.stopPropagation = null;
      event.isDefaultPrevented = null;
    } else {
      // It shouldn't affect normal browsers (native methods are defined on prototype).
      delete event.preventDefault;
      delete event.stopPropagation;
      delete event.isDefaultPrevented;
    }
  };
  eventHandler.elem = element;
  return eventHandler;
}

//////////////////////////////////////////
// Functions iterating traversal.
// These functions chain results into a single
// selector.
//////////////////////////////////////////
forEach({
  removeData: jqLiteRemoveData,

  dealoc: jqLiteDealoc,

  on: function onFn(element, type, fn, unsupported){
    if (isDefined(unsupported)) throw jqLiteMinErr('onargs', 'jqLite#on() does not support the `selector` or `eventData` parameters');

    var events = jqLiteExpandoStore(element, 'events'),
        handle = jqLiteExpandoStore(element, 'handle');

    if (!events) jqLiteExpandoStore(element, 'events', events = {});
    if (!handle) jqLiteExpandoStore(element, 'handle', handle = createEventHandler(element, events));

    forEach(type.split(' '), function(type){
      var eventFns = events[type];

      if (!eventFns) {
        if (type == 'mouseenter' || type == 'mouseleave') {
          var contains = document.body.contains || document.body.compareDocumentPosition ?
          function( a, b ) {
            // jshint bitwise: false
            var adown = a.nodeType === 9 ? a.documentElement : a,
            bup = b && b.parentNode;
            return a === bup || !!( bup && bup.nodeType === 1 && (
              adown.contains ?
              adown.contains( bup ) :
              a.compareDocumentPosition && a.compareDocumentPosition( bup ) & 16
              ));
            } :
            function( a, b ) {
              if ( b ) {
                while ( (b = b.parentNode) ) {
                  if ( b === a ) {
                    return true;
                  }
                }
              }
              return false;
            };

          events[type] = [];

          // Refer to jQuery's implementation of mouseenter & mouseleave
          // Read about mouseenter and mouseleave:
          // http://www.quirksmode.org/js/events_mouse.html#link8
          var eventmap = { mouseleave : "mouseout", mouseenter : "mouseover"};

          onFn(element, eventmap[type], function(event) {
            var target = this, related = event.relatedTarget;
            // For mousenter/leave call the handler if related is outside the target.
            // NB: No relatedTarget if the mouse left/entered the browser window
            if ( !related || (related !== target && !contains(target, related)) ){
              handle(event, type);
            }
          });

        } else {
          addEventListenerFn(element, type, handle);
          events[type] = [];
        }
        eventFns = events[type];
      }
      eventFns.push(fn);
    });
  },

  off: jqLiteOff,

  replaceWith: function(element, replaceNode) {
    var index, parent = element.parentNode;
    jqLiteDealoc(element);
    forEach(new JQLite(replaceNode), function(node){
      if (index) {
        parent.insertBefore(node, index.nextSibling);
      } else {
        parent.replaceChild(node, element);
      }
      index = node;
    });
  },

  children: function(element) {
    var children = [];
    forEach(element.childNodes, function(element){
      if (element.nodeType === 1)
        children.push(element);
    });
    return children;
  },

  contents: function(element) {
    return element.childNodes || [];
  },

  append: function(element, node) {
    forEach(new JQLite(node), function(child){
      if (element.nodeType === 1 || element.nodeType === 11) {
        element.appendChild(child);
      }
    });
  },

  prepend: function(element, node) {
    if (element.nodeType === 1) {
      var index = element.firstChild;
      forEach(new JQLite(node), function(child){
        element.insertBefore(child, index);
      });
    }
  },

  wrap: function(element, wrapNode) {
    wrapNode = jqLite(wrapNode)[0];
    var parent = element.parentNode;
    if (parent) {
      parent.replaceChild(wrapNode, element);
    }
    wrapNode.appendChild(element);
  },

  remove: function(element) {
    jqLiteDealoc(element);
    var parent = element.parentNode;
    if (parent) parent.removeChild(element);
  },

  after: function(element, newElement) {
    var index = element, parent = element.parentNode;
    forEach(new JQLite(newElement), function(node){
      parent.insertBefore(node, index.nextSibling);
      index = node;
    });
  },

  addClass: jqLiteAddClass,
  removeClass: jqLiteRemoveClass,

  toggleClass: function(element, selector, condition) {
    if (isUndefined(condition)) {
      condition = !jqLiteHasClass(element, selector);
    }
    (condition ? jqLiteAddClass : jqLiteRemoveClass)(element, selector);
  },

  parent: function(element) {
    var parent = element.parentNode;
    return parent && parent.nodeType !== 11 ? parent : null;
  },

  next: function(element) {
    if (element.nextElementSibling) {
      return element.nextElementSibling;
    }

    // IE8 doesn't have nextElementSibling
    var elm = element.nextSibling;
    while (elm != null && elm.nodeType !== 1) {
      elm = elm.nextSibling;
    }
    return elm;
  },

  find: function(element, selector) {
    return element.getElementsByTagName(selector);
  },

  clone: jqLiteClone,

  triggerHandler: function(element, eventName, eventData) {
    var eventFns = (jqLiteExpandoStore(element, 'events') || {})[eventName];

    eventData = eventData || [];

    var event = [{
      preventDefault: noop,
      stopPropagation: noop
    }];

    forEach(eventFns, function(fn) {
      fn.apply(element, event.concat(eventData));
    });
  }
}, function(fn, name){
  /**
   * chaining functions
   */
  JQLite.prototype[name] = function(arg1, arg2, arg3) {
    var value;
    for(var i=0; i < this.length; i++) {
      if (isUndefined(value)) {
        value = fn(this[i], arg1, arg2, arg3);
        if (isDefined(value)) {
          // any function which returns a value needs to be wrapped
          value = jqLite(value);
        }
      } else {
        jqLiteAddNodes(value, fn(this[i], arg1, arg2, arg3));
      }
    }
    return isDefined(value) ? value : this;
  };

  // bind legacy bind/unbind to on/off
  JQLite.prototype.bind = JQLite.prototype.on;
  JQLite.prototype.unbind = JQLite.prototype.off;
});

/**
 * Computes a hash of an 'obj'.
 * Hash of a:
 *  string is string
 *  number is number as string
 *  object is either result of calling $$hashKey function on the object or uniquely generated id,
 *         that is also assigned to the $$hashKey property of the object.
 *
 * @param obj
 * @returns {string} hash string such that the same input will have the same hash string.
 *         The resulting string key is in 'type:hashKey' format.
 */
function hashKey(obj) {
  var objType = typeof obj,
      key;

  if (objType == 'object' && obj !== null) {
    if (typeof (key = obj.$$hashKey) == 'function') {
      // must invoke on object to keep the right this
      key = obj.$$hashKey();
    } else if (key === undefined) {
      key = obj.$$hashKey = nextUid();
    }
  } else {
    key = obj;
  }

  return objType + ':' + key;
}

/**
 * HashMap which can use objects as keys
 */
function HashMap(array){
  forEach(array, this.put, this);
}
HashMap.prototype = {
  /**
   * Store key value pair
   * @param key key to store can be any type
   * @param value value to store can be any type
   */
  put: function(key, value) {
    this[hashKey(key)] = value;
  },

  /**
   * @param key
   * @returns the value for the key
   */
  get: function(key) {
    return this[hashKey(key)];
  },

  /**
   * Remove the key/value pair
   * @param key
   */
  remove: function(key) {
    var value = this[key = hashKey(key)];
    delete this[key];
    return value;
  }
};

/**
 * @ngdoc function
 * @name angular.injector
 * @function
 *
 * @description
 * Creates an injector function that can be used for retrieving services as well as for
 * dependency injection (see {@link guide/di dependency injection}).
 *

 * @param {Array.<string|Function>} modules A list of module functions or their aliases. See
 *        {@link angular.module}. The `ng` module must be explicitly added.
 * @returns {function()} Injector function. See {@link AUTO.$injector $injector}.
 *
 * @example
 * Typical usage
 * <pre>
 *   // create an injector
 *   var $injector = angular.injector(['ng']);
 *
 *   // use the injector to kick off your application
 *   // use the type inference to auto inject arguments, or use implicit injection
 *   $injector.invoke(function($rootScope, $compile, $document){
 *     $compile($document)($rootScope);
 *     $rootScope.$digest();
 *   });
 * </pre>
 */


/**
 * @ngdoc overview
 * @name AUTO
 * @description
 *
 * Implicit module which gets automatically added to each {@link AUTO.$injector $injector}.
 */

var FN_ARGS = /^function\s*[^\(]*\(\s*([^\)]*)\)/m;
var FN_ARG_SPLIT = /,/;
var FN_ARG = /^\s*(_?)(\S+?)\1\s*$/;
var STRIP_COMMENTS = /((\/\/.*$)|(\/\*[\s\S]*?\*\/))/mg;
var $injectorMinErr = minErr('$injector');
function annotate(fn) {
  var $inject,
      fnText,
      argDecl,
      last;

  if (typeof fn == 'function') {
    if (!($inject = fn.$inject)) {
      $inject = [];
      if (fn.length) {
        fnText = fn.toString().replace(STRIP_COMMENTS, '');
        argDecl = fnText.match(FN_ARGS);
        forEach(argDecl[1].split(FN_ARG_SPLIT), function(arg){
          arg.replace(FN_ARG, function(all, underscore, name){
            $inject.push(name);
          });
        });
      }
      fn.$inject = $inject;
    }
  } else if (isArray(fn)) {
    last = fn.length - 1;
    assertArgFn(fn[last], 'fn');
    $inject = fn.slice(0, last);
  } else {
    assertArgFn(fn, 'fn', true);
  }
  return $inject;
}

///////////////////////////////////////

/**
 * @ngdoc object
 * @name AUTO.$injector
 * @function
 *
 * @description
 *
 * `$injector` is used to retrieve object instances as defined by
 * {@link AUTO.$provide provider}, instantiate types, invoke methods,
 * and load modules.
 *
 * The following always holds true:
 *
 * <pre>
 *   var $injector = angular.injector();
 *   expect($injector.get('$injector')).toBe($injector);
 *   expect($injector.invoke(function($injector){
 *     return $injector;
 *   }).toBe($injector);
 * </pre>
 *
 * # Injection Function Annotation
 *
 * JavaScript does not have annotations, and annotations are needed for dependency injection. The
 * following are all valid ways of annotating function with injection arguments and are equivalent.
 *
 * <pre>
 *   // inferred (only works if code not minified/obfuscated)
 *   $injector.invoke(function(serviceA){});
 *
 *   // annotated
 *   function explicit(serviceA) {};
 *   explicit.$inject = ['serviceA'];
 *   $injector.invoke(explicit);
 *
 *   // inline
 *   $injector.invoke(['serviceA', function(serviceA){}]);
 * </pre>
 *
 * ## Inference
 *
 * In JavaScript calling `toString()` on a function returns the function definition. The definition
 * can then be parsed and the function arguments can be extracted. *NOTE:* This does not work with
 * minification, and obfuscation tools since these tools change the argument names.
 *
 * ## `$inject` Annotation
 * By adding a `$inject` property onto a function the injection parameters can be specified.
 *
 * ## Inline
 * As an array of injection names, where the last item in the array is the function to call.
 */

/**
 * @ngdoc method
 * @name AUTO.$injector#get
 * @methodOf AUTO.$injector
 *
 * @description
 * Return an instance of the service.
 *
 * @param {string} name The name of the instance to retrieve.
 * @return {*} The instance.
 */

/**
 * @ngdoc method
 * @name AUTO.$injector#invoke
 * @methodOf AUTO.$injector
 *
 * @description
 * Invoke the method and supply the method arguments from the `$injector`.
 *
 * @param {!function} fn The function to invoke. Function parameters are injected according to the
 *   {@link guide/di $inject Annotation} rules.
 * @param {Object=} self The `this` for the invoked method.
 * @param {Object=} locals Optional object. If preset then any argument names are read from this
 *                         object first, before the `$injector` is consulted.
 * @returns {*} the value returned by the invoked `fn` function.
 */

/**
 * @ngdoc method
 * @name AUTO.$injector#has
 * @methodOf AUTO.$injector
 *
 * @description
 * Allows the user to query if the particular service exist.
 *
 * @param {string} Name of the service to query.
 * @returns {boolean} returns true if injector has given service.
 */

/**
 * @ngdoc method
 * @name AUTO.$injector#instantiate
 * @methodOf AUTO.$injector
 * @description
 * Create a new instance of JS type. The method takes a constructor function invokes the new
 * operator and supplies all of the arguments to the constructor function as specified by the
 * constructor annotation.
 *
 * @param {function} Type Annotated constructor function.
 * @param {Object=} locals Optional object. If preset then any argument names are read from this
 * object first, before the `$injector` is consulted.
 * @returns {Object} new instance of `Type`.
 */

/**
 * @ngdoc method
 * @name AUTO.$injector#annotate
 * @methodOf AUTO.$injector
 *
 * @description
 * Returns an array of service names which the function is requesting for injection. This API is
 * used by the injector to determine which services need to be injected into the function when the
 * function is invoked. There are three ways in which the function can be annotated with the needed
 * dependencies.
 *
 * # Argument names
 *
 * The simplest form is to extract the dependencies from the arguments of the function. This is done
 * by converting the function into a string using `toString()` method and extracting the argument
 * names.
 * <pre>
 *   // Given
 *   function MyController($scope, $route) {
 *     // ...
 *   }
 *
 *   // Then
 *   expect(injector.annotate(MyController)).toEqual(['$scope', '$route']);
 * </pre>
 *
 * This method does not work with code minification / obfuscation. For this reason the following
 * annotation strategies are supported.
 *
 * # The `$inject` property
 *
 * If a function has an `$inject` property and its value is an array of strings, then the strings
 * represent names of services to be injected into the function.
 * <pre>
 *   // Given
 *   var MyController = function(obfuscatedScope, obfuscatedRoute) {
 *     // ...
 *   }
 *   // Define function dependencies
 *   MyController.$inject = ['$scope', '$route'];
 *
 *   // Then
 *   expect(injector.annotate(MyController)).toEqual(['$scope', '$route']);
 * </pre>
 *
 * # The array notation
 *
 * It is often desirable to inline Injected functions and that's when setting the `$inject` property
 * is very inconvenient. In these situations using the array notation to specify the dependencies in
 * a way that survives minification is a better choice:
 *
 * <pre>
 *   // We wish to write this (not minification / obfuscation safe)
 *   injector.invoke(function($compile, $rootScope) {
 *     // ...
 *   });
 *
 *   // We are forced to write break inlining
 *   var tmpFn = function(obfuscatedCompile, obfuscatedRootScope) {
 *     // ...
 *   };
 *   tmpFn.$inject = ['$compile', '$rootScope'];
 *   injector.invoke(tmpFn);
 *
 *   // To better support inline function the inline annotation is supported
 *   injector.invoke(['$compile', '$rootScope', function(obfCompile, obfRootScope) {
 *     // ...
 *   }]);
 *
 *   // Therefore
 *   expect(injector.annotate(
 *      ['$compile', '$rootScope', function(obfus_$compile, obfus_$rootScope) {}])
 *    ).toEqual(['$compile', '$rootScope']);
 * </pre>
 *
 * @param {function|Array.<string|Function>} fn Function for which dependent service names need to
 * be retrieved as described above.
 *
 * @returns {Array.<string>} The names of the services which the function requires.
 */




/**
 * @ngdoc object
 * @name AUTO.$provide
 *
 * @description
 *
 * The {@link AUTO.$provide $provide} service has a number of methods for registering components
 * with the {@link AUTO.$injector $injector}. Many of these functions are also exposed on
 * {@link angular.Module}.
 *
 * An Angular **service** is a singleton object created by a **service factory**.  These **service
 * factories** are functions which, in turn, are created by a **service provider**.
 * The **service providers** are constructor functions. When instantiated they must contain a
 * property called `$get`, which holds the **service factory** function.
 *
 * When you request a service, the {@link AUTO.$injector $injector} is responsible for finding the
 * correct **service provider**, instantiating it and then calling its `$get` **service factory**
 * function to get the instance of the **service**.
 *
 * Often services have no configuration options and there is no need to add methods to the service
 * provider.  The provider will be no more than a constructor function with a `$get` property. For
 * these cases the {@link AUTO.$provide $provide} service has additional helper methods to register
 * services without specifying a provider.
 *
 * * {@link AUTO.$provide#methods_provider provider(provider)} - registers a **service provider** with the
 *     {@link AUTO.$injector $injector}
 * * {@link AUTO.$provide#methods_constant constant(obj)} - registers a value/object that can be accessed by
 *     providers and services.
 * * {@link AUTO.$provide#methods_value value(obj)} - registers a value/object that can only be accessed by
 *     services, not providers.
 * * {@link AUTO.$provide#methods_factory factory(fn)} - registers a service **factory function**, `fn`,
 *     that will be wrapped in a **service provider** object, whose `$get` property will contain the
 *     given factory function.
 * * {@link AUTO.$provide#methods_service service(class)} - registers a **constructor function**, `class` that
 *     that will be wrapped in a **service provider** object, whose `$get` property will instantiate
 *      a new object using the given constructor function.
 *
 * See the individual methods for more information and examples.
 */

/**
 * @ngdoc method
 * @name AUTO.$provide#provider
 * @methodOf AUTO.$provide
 * @description
 *
 * Register a **provider function** with the {@link AUTO.$injector $injector}. Provider functions
 * are constructor functions, whose instances are responsible for "providing" a factory for a
 * service.
 *
 * Service provider names start with the name of the service they provide followed by `Provider`.
 * For example, the {@link ng.$log $log} service has a provider called
 * {@link ng.$logProvider $logProvider}.
 *
 * Service provider objects can have additional methods which allow configuration of the provider
 * and its service. Importantly, you can configure what kind of service is created by the `$get`
 * method, or how that service will act. For example, the {@link ng.$logProvider $logProvider} has a
 * method {@link ng.$logProvider#debugEnabled debugEnabled}
 * which lets you specify whether the {@link ng.$log $log} service will log debug messages to the
 * console or not.
 *
 * @param {string} name The name of the instance. NOTE: the provider will be available under `name +
                        'Provider'` key.
 * @param {(Object|function())} provider If the provider is:
 *
 *   - `Object`: then it should have a `$get` method. The `$get` method will be invoked using
 *               {@link AUTO.$injector#invoke $injector.invoke()} when an instance needs to be
 *               created.
 *   - `Constructor`: a new instance of the provider will be created using
 *               {@link AUTO.$injector#instantiate $injector.instantiate()}, then treated as
 *               `object`.
 *
 * @returns {Object} registered provider instance

 * @example
 *
 * The following example shows how to create a simple event tracking service and register it using
 * {@link AUTO.$provide#methods_provider $provide.provider()}.
 *
 * <pre>
 *  // Define the eventTracker provider
 *  function EventTrackerProvider() {
 *    var trackingUrl = '/track';
 *
 *    // A provider method for configuring where the tracked events should been saved
 *    this.setTrackingUrl = function(url) {
 *      trackingUrl = url;
 *    };
 *
 *    // The service factory function
 *    this.$get = ['$http', function($http) {
 *      var trackedEvents = {};
 *      return {
 *        // Call this to track an event
 *        event: function(event) {
 *          var count = trackedEvents[event] || 0;
 *          count += 1;
 *          trackedEvents[event] = count;
 *          return count;
 *        },
 *        // Call this to save the tracked events to the trackingUrl
 *        save: function() {
 *          $http.post(trackingUrl, trackedEvents);
 *        }
 *      };
 *    }];
 *  }
 *
 *  describe('eventTracker', function() {
 *    var postSpy;
 *
 *    beforeEach(module(function($provide) {
 *      // Register the eventTracker provider
 *      $provide.provider('eventTracker', EventTrackerProvider);
 *    }));
 *
 *    beforeEach(module(function(eventTrackerProvider) {
 *      // Configure eventTracker provider
 *      eventTrackerProvider.setTrackingUrl('/custom-track');
 *    }));
 *
 *    it('tracks events', inject(function(eventTracker) {
 *      expect(eventTracker.event('login')).toEqual(1);
 *      expect(eventTracker.event('login')).toEqual(2);
 *    }));
 *
 *    it('saves to the tracking url', inject(function(eventTracker, $http) {
 *      postSpy = spyOn($http, 'post');
 *      eventTracker.event('login');
 *      eventTracker.save();
 *      expect(postSpy).toHaveBeenCalled();
 *      expect(postSpy.mostRecentCall.args[0]).not.toEqual('/track');
 *      expect(postSpy.mostRecentCall.args[0]).toEqual('/custom-track');
 *      expect(postSpy.mostRecentCall.args[1]).toEqual({ 'login': 1 });
 *    }));
 *  });
 * </pre>
 */

/**
 * @ngdoc method
 * @name AUTO.$provide#factory
 * @methodOf AUTO.$provide
 * @description
 *
 * Register a **service factory**, which will be called to return the service instance.
 * This is short for registering a service where its provider consists of only a `$get` property,
 * which is the given service factory function.
 * You should use {@link AUTO.$provide#factory $provide.factory(getFn)} if you do not need to
 * configure your service in a provider.
 *
 * @param {string} name The name of the instance.
 * @param {function()} $getFn The $getFn for the instance creation. Internally this is a short hand
 *                            for `$provide.provider(name, {$get: $getFn})`.
 * @returns {Object} registered provider instance
 *
 * @example
 * Here is an example of registering a service
 * <pre>
 *   $provide.factory('ping', ['$http', function($http) {
 *     return function ping() {
 *       return $http.send('/ping');
 *     };
 *   }]);
 * </pre>
 * You would then inject and use this service like this:
 * <pre>
 *   someModule.controller('Ctrl', ['ping', function(ping) {
 *     ping();
 *   }]);
 * </pre>
 */


/**
 * @ngdoc method
 * @name AUTO.$provide#service
 * @methodOf AUTO.$provide
 * @description
 *
 * Register a **service constructor**, which will be invoked with `new` to create the service
 * instance.
 * This is short for registering a service where its provider's `$get` property is the service
 * constructor function that will be used to instantiate the service instance.
 *
 * You should use {@link AUTO.$provide#methods_service $provide.service(class)} if you define your service
 * as a type/class. This is common when using {@link http://coffeescript.org CoffeeScript}.
 *
 * @param {string} name The name of the instance.
 * @param {Function} constructor A class (constructor function) that will be instantiated.
 * @returns {Object} registered provider instance
 *
 * @example
 * Here is an example of registering a service using
 * {@link AUTO.$provide#methods_service $provide.service(class)} that is defined as a CoffeeScript class.
 * <pre>
 *   class Ping
 *     constructor: (@$http)->
 *     send: ()=>
 *       @$http.get('/ping')
 *
 *   $provide.service('ping', ['$http', Ping])
 * </pre>
 * You would then inject and use this service like this:
 * <pre>
 *   someModule.controller 'Ctrl', ['ping', (ping)->
 *     ping.send()
 *   ]
 * </pre>
 */


/**
 * @ngdoc method
 * @name AUTO.$provide#value
 * @methodOf AUTO.$provide
 * @description
 *
 * Register a **value service** with the {@link AUTO.$injector $injector}, such as a string, a
 * number, an array, an object or a function.  This is short for registering a service where its
 * provider's `$get` property is a factory function that takes no arguments and returns the **value
 * service**.
 *
 * Value services are similar to constant services, except that they cannot be injected into a
 * module configuration function (see {@link angular.Module#config}) but they can be overridden by
 * an Angular
 * {@link AUTO.$provide#decorator decorator}.
 *
 * @param {string} name The name of the instance.
 * @param {*} value The value.
 * @returns {Object} registered provider instance
 *
 * @example
 * Here are some examples of creating value services.
 * <pre>
 *   $provide.constant('ADMIN_USER', 'admin');
 *
 *   $provide.constant('RoleLookup', { admin: 0, writer: 1, reader: 2 });
 *
 *   $provide.constant('halfOf', function(value) {
 *     return value / 2;
 *   });
 * </pre>
 */


/**
 * @ngdoc method
 * @name AUTO.$provide#constant
 * @methodOf AUTO.$provide
 * @description
 *
 * Register a **constant service**, such as a string, a number, an array, an object or a function,
 * with the {@link AUTO.$injector $injector}. Unlike {@link AUTO.$provide#value value} it can be
 * injected into a module configuration function (see {@link angular.Module#config}) and it cannot
 * be overridden by an Angular {@link AUTO.$provide#decorator decorator}.
 *
 * @param {string} name The name of the constant.
 * @param {*} value The constant value.
 * @returns {Object} registered instance
 *
 * @example
 * Here a some examples of creating constants:
 * <pre>
 *   $provide.constant('SHARD_HEIGHT', 306);
 *
 *   $provide.constant('MY_COLOURS', ['red', 'blue', 'grey']);
 *
 *   $provide.constant('double', function(value) {
 *     return value * 2;
 *   });
 * </pre>
 */


/**
 * @ngdoc method
 * @name AUTO.$provide#decorator
 * @methodOf AUTO.$provide
 * @description
 *
 * Register a **service decorator** with the {@link AUTO.$injector $injector}. A service decorator
 * intercepts the creation of a service, allowing it to override or modify the behaviour of the
 * service. The object returned by the decorator may be the original service, or a new service
 * object which replaces or wraps and delegates to the original service.
 *
 * @param {string} name The name of the service to decorate.
 * @param {function()} decorator This function will be invoked when the service needs to be
 *    instantiated and should return the decorated service instance. The function is called using
 *    the {@link AUTO.$injector#invoke injector.invoke} method and is therefore fully injectable.
 *    Local injection arguments:
 *
 *    * `$delegate` - The original service instance, which can be monkey patched, configured,
 *      decorated or delegated to.
 *
 * @example
 * Here we decorate the {@link ng.$log $log} service to convert warnings to errors by intercepting
 * calls to {@link ng.$log#error $log.warn()}.
 * <pre>
 *   $provider.decorator('$log', ['$delegate', function($delegate) {
 *     $delegate.warn = $delegate.error;
 *     return $delegate;
 *   }]);
 * </pre>
 */


function createInjector(modulesToLoad) {
  var INSTANTIATING = {},
      providerSuffix = 'Provider',
      path = [],
      loadedModules = new HashMap(),
      providerCache = {
        $provide: {
            provider: supportObject(provider),
            factory: supportObject(factory),
            service: supportObject(service),
            value: supportObject(value),
            constant: supportObject(constant),
            decorator: decorator
          }
      },
      providerInjector = (providerCache.$injector =
          createInternalInjector(providerCache, function() {
            throw $injectorMinErr('unpr', "Unknown provider: {0}", path.join(' <- '));
          })),
      instanceCache = {},
      instanceInjector = (instanceCache.$injector =
          createInternalInjector(instanceCache, function(servicename) {
            var provider = providerInjector.get(servicename + providerSuffix);
            return instanceInjector.invoke(provider.$get, provider);
          }));


  forEach(loadModules(modulesToLoad), function(fn) { instanceInjector.invoke(fn || noop); });

  return instanceInjector;

  ////////////////////////////////////
  // $provider
  ////////////////////////////////////

  function supportObject(delegate) {
    return function(key, value) {
      if (isObject(key)) {
        forEach(key, reverseParams(delegate));
      } else {
        return delegate(key, value);
      }
    };
  }

  function provider(name, provider_) {
    assertNotHasOwnProperty(name, 'service');
    if (isFunction(provider_) || isArray(provider_)) {
      provider_ = providerInjector.instantiate(provider_);
    }
    if (!provider_.$get) {
      throw $injectorMinErr('pget', "Provider '{0}' must define $get factory method.", name);
    }
    return providerCache[name + providerSuffix] = provider_;
  }

  function factory(name, factoryFn) { return provider(name, { $get: factoryFn }); }

  function service(name, constructor) {
    return factory(name, ['$injector', function($injector) {
      return $injector.instantiate(constructor);
    }]);
  }

  function value(name, val) { return factory(name, valueFn(val)); }

  function constant(name, value) {
    assertNotHasOwnProperty(name, 'constant');
    providerCache[name] = value;
    instanceCache[name] = value;
  }

  function decorator(serviceName, decorFn) {
    var origProvider = providerInjector.get(serviceName + providerSuffix),
        orig$get = origProvider.$get;

    origProvider.$get = function() {
      var origInstance = instanceInjector.invoke(orig$get, origProvider);
      return instanceInjector.invoke(decorFn, null, {$delegate: origInstance});
    };
  }

  ////////////////////////////////////
  // Module Loading
  ////////////////////////////////////
  function loadModules(modulesToLoad){
    var runBlocks = [], moduleFn, invokeQueue, i, ii;
    forEach(modulesToLoad, function(module) {
      if (loadedModules.get(module)) return;
      loadedModules.put(module, true);

      try {
        if (isString(module)) {
          moduleFn = angularModule(module);
          runBlocks = runBlocks.concat(loadModules(moduleFn.requires)).concat(moduleFn._runBlocks);

          for(invokeQueue = moduleFn._invokeQueue, i = 0, ii = invokeQueue.length; i < ii; i++) {
            var invokeArgs = invokeQueue[i],
                provider = providerInjector.get(invokeArgs[0]);

            provider[invokeArgs[1]].apply(provider, invokeArgs[2]);
          }
        } else if (isFunction(module)) {
            runBlocks.push(providerInjector.invoke(module));
        } else if (isArray(module)) {
            runBlocks.push(providerInjector.invoke(module));
        } else {
          assertArgFn(module, 'module');
        }
      } catch (e) {
        if (isArray(module)) {
          module = module[module.length - 1];
        }
        if (e.message && e.stack && e.stack.indexOf(e.message) == -1) {
          // Safari & FF's stack traces don't contain error.message content
          // unlike those of Chrome and IE
          // So if stack doesn't contain message, we create a new string that contains both.
          // Since error.stack is read-only in Safari, I'm overriding e and not e.stack here.
          /* jshint -W022 */
          e = e.message + '\n' + e.stack;
        }
        throw $injectorMinErr('modulerr', "Failed to instantiate module {0} due to:\n{1}",
                  module, e.stack || e.message || e);
      }
    });
    return runBlocks;
  }

  ////////////////////////////////////
  // internal Injector
  ////////////////////////////////////

  function createInternalInjector(cache, factory) {

    function getService(serviceName) {
      if (cache.hasOwnProperty(serviceName)) {
        if (cache[serviceName] === INSTANTIATING) {
          throw $injectorMinErr('cdep', 'Circular dependency found: {0}', path.join(' <- '));
        }
        return cache[serviceName];
      } else {
        try {
          path.unshift(serviceName);
          cache[serviceName] = INSTANTIATING;
          return cache[serviceName] = factory(serviceName);
        } finally {
          path.shift();
        }
      }
    }

    function invoke(fn, self, locals){
      var args = [],
          $inject = annotate(fn),
          length, i,
          key;

      for(i = 0, length = $inject.length; i < length; i++) {
        key = $inject[i];
        if (typeof key !== 'string') {
          throw $injectorMinErr('itkn',
                  'Incorrect injection token! Expected service name as string, got {0}', key);
        }
        args.push(
          locals && locals.hasOwnProperty(key)
          ? locals[key]
          : getService(key)
        );
      }
      if (!fn.$inject) {
        // this means that we must be an array.
        fn = fn[length];
      }


      // Performance optimization: http://jsperf.com/apply-vs-call-vs-invoke
      switch (self ? -1 : args.length) {
        case  0: return fn();
        case  1: return fn(args[0]);
        case  2: return fn(args[0], args[1]);
        case  3: return fn(args[0], args[1], args[2]);
        case  4: return fn(args[0], args[1], args[2], args[3]);
        case  5: return fn(args[0], args[1], args[2], args[3], args[4]);
        case  6: return fn(args[0], args[1], args[2], args[3], args[4], args[5]);
        case  7: return fn(args[0], args[1], args[2], args[3], args[4], args[5], args[6]);
        case  8: return fn(args[0], args[1], args[2], args[3], args[4], args[5], args[6], args[7]);
        case  9: return fn(args[0], args[1], args[2], args[3], args[4], args[5], args[6], args[7],
          args[8]);
        case 10: return fn(args[0], args[1], args[2], args[3], args[4], args[5], args[6], args[7],
          args[8], args[9]);
        default: return fn.apply(self, args);
      }
    }

    function instantiate(Type, locals) {
      var Constructor = function() {},
          instance, returnedValue;

      // Check if Type is annotated and use just the given function at n-1 as parameter
      // e.g. someModule.factory('greeter', ['$window', function(renamed$window) {}]);
      Constructor.prototype = (isArray(Type) ? Type[Type.length - 1] : Type).prototype;
      instance = new Constructor();
      returnedValue = invoke(Type, instance, locals);

      return isObject(returnedValue) || isFunction(returnedValue) ? returnedValue : instance;
    }

    return {
      invoke: invoke,
      instantiate: instantiate,
      get: getService,
      annotate: annotate,
      has: function(name) {
        return providerCache.hasOwnProperty(name + providerSuffix) || cache.hasOwnProperty(name);
      }
    };
  }
}

/**
 * @ngdoc function
 * @name ng.$anchorScroll
 * @requires $window
 * @requires $location
 * @requires $rootScope
 *
 * @description
 * When called, it checks current value of `$location.hash()` and scroll to related element,
 * according to rules specified in
 * {@link http://dev.w3.org/html5/spec/Overview.html#the-indicated-part-of-the-document Html5 spec}.
 *
 * It also watches the `$location.hash()` and scrolls whenever it changes to match any anchor.
 * This can be disabled by calling `$anchorScrollProvider.disableAutoScrolling()`.
 * 
 * @example
   <example>
     <file name="index.html">
       <div id="scrollArea" ng-controller="ScrollCtrl">
         <a ng-click="gotoBottom()">Go to bottom</a>
         <a id="bottom"></a> You're at the bottom!
       </div>
     </file>
     <file name="script.js">
       function ScrollCtrl($scope, $location, $anchorScroll) {
         $scope.gotoBottom = function (){
           // set the location.hash to the id of
           // the element you wish to scroll to.
           $location.hash('bottom');
           
           // call $anchorScroll()
           $anchorScroll();
         }
       }
     </file>
     <file name="style.css">
       #scrollArea {
         height: 350px;
         overflow: auto;
       }

       #bottom {
         display: block;
         margin-top: 2000px;
       }
     </file>
   </example>
 */
function $AnchorScrollProvider() {

  var autoScrollingEnabled = true;

  this.disableAutoScrolling = function() {
    autoScrollingEnabled = false;
  };

  this.$get = ['$window', '$location', '$rootScope', function($window, $location, $rootScope) {
    var document = $window.document;

    // helper function to get first anchor from a NodeList
    // can't use filter.filter, as it accepts only instances of Array
    // and IE can't convert NodeList to an array using [].slice
    // TODO(vojta): use filter if we change it to accept lists as well
    function getFirstAnchor(list) {
      var result = null;
      forEach(list, function(element) {
        if (!result && lowercase(element.nodeName) === 'a') result = element;
      });
      return result;
    }

    function scroll() {
      var hash = $location.hash(), elm;

      // empty hash, scroll to the top of the page
      if (!hash) $window.scrollTo(0, 0);

      // element with given id
      else if ((elm = document.getElementById(hash))) elm.scrollIntoView();

      // first anchor with given name :-D
      else if ((elm = getFirstAnchor(document.getElementsByName(hash)))) elm.scrollIntoView();

      // no element and hash == 'top', scroll to the top of the page
      else if (hash === 'top') $window.scrollTo(0, 0);
    }

    // does not scroll when user clicks on anchor link that is currently on
    // (no url change, no $location.hash() change), browser native does scroll
    if (autoScrollingEnabled) {
      $rootScope.$watch(function autoScrollWatch() {return $location.hash();},
        function autoScrollWatchAction() {
          $rootScope.$evalAsync(scroll);
        });
    }

    return scroll;
  }];
}

var $animateMinErr = minErr('$animate');

/**
 * @ngdoc object
 * @name ng.$animateProvider
 *
 * @description
 * Default implementation of $animate that doesn't perform any animations, instead just
 * synchronously performs DOM
 * updates and calls done() callbacks.
 *
 * In order to enable animations the ngAnimate module has to be loaded.
 *
 * To see the functional implementation check out src/ngAnimate/animate.js
 */
var $AnimateProvider = ['$provide', function($provide) {

  
  this.$$selectors = {};


  /**
   * @ngdoc function
   * @name ng.$animateProvider#register
   * @methodOf ng.$animateProvider
   *
   * @description
   * Registers a new injectable animation factory function. The factory function produces the
   * animation object which contains callback functions for each event that is expected to be
   * animated.
   *
   *   * `eventFn`: `function(Element, doneFunction)` The element to animate, the `doneFunction`
   *   must be called once the element animation is complete. If a function is returned then the
   *   animation service will use this function to cancel the animation whenever a cancel event is
   *   triggered.
   *
   *
   *<pre>
   *   return {
     *     eventFn : function(element, done) {
     *       //code to run the animation
     *       //once complete, then run done()
     *       return function cancellationFunction() {
     *         //code to cancel the animation
     *       }
     *     }
     *   }
   *</pre>
   *
   * @param {string} name The name of the animation.
   * @param {function} factory The factory function that will be executed to return the animation
   *                           object.
   */
  this.register = function(name, factory) {
    var key = name + '-animation';
    if (name && name.charAt(0) != '.') throw $animateMinErr('notcsel',
        "Expecting class selector starting with '.' got '{0}'.", name);
    this.$$selectors[name.substr(1)] = key;
    $provide.factory(key, factory);
  };

  this.$get = ['$timeout', function($timeout) {

    /**
     *
     * @ngdoc object
     * @name ng.$animate
     * @description The $animate service provides rudimentary DOM manipulation functions to
     * insert, remove and move elements within the DOM, as well as adding and removing classes.
     * This service is the core service used by the ngAnimate $animator service which provides
     * high-level animation hooks for CSS and JavaScript.
     *
     * $animate is available in the AngularJS core, however, the ngAnimate module must be included
     * to enable full out animation support. Otherwise, $animate will only perform simple DOM
     * manipulation operations.
     *
     * To learn more about enabling animation support, click here to visit the {@link ngAnimate
     * ngAnimate module page} as well as the {@link ngAnimate.$animate ngAnimate $animate service
     * page}.
     */
    return {

      /**
       *
       * @ngdoc function
       * @name ng.$animate#enter
       * @methodOf ng.$animate
       * @function
       * @description Inserts the element into the DOM either after the `after` element or within
       *   the `parent` element. Once complete, the done() callback will be fired (if provided).
       * @param {jQuery/jqLite element} element the element which will be inserted into the DOM
       * @param {jQuery/jqLite element} parent the parent element which will append the element as
       *   a child (if the after element is not present)
       * @param {jQuery/jqLite element} after the sibling element which will append the element
       *   after itself
       * @param {function=} done callback function that will be called after the element has been
       *   inserted into the DOM
       */
      enter : function(element, parent, after, done) {
        var afterNode = after && after[after.length - 1];
        var parentNode = parent && parent[0] || afterNode && afterNode.parentNode;
        // IE does not like undefined so we have to pass null.
        var afterNextSibling = (afterNode && afterNode.nextSibling) || null;
        forEach(element, function(node) {
          parentNode.insertBefore(node, afterNextSibling);
        });
        done && $timeout(done, 0, false);
      },

      /**
       *
       * @ngdoc function
       * @name ng.$animate#leave
       * @methodOf ng.$animate
       * @function
       * @description Removes the element from the DOM. Once complete, the done() callback will be
       *   fired (if provided).
       * @param {jQuery/jqLite element} element the element which will be removed from the DOM
       * @param {function=} done callback function that will be called after the element has been
       *   removed from the DOM
       */
      leave : function(element, done) {
        element.remove();
        done && $timeout(done, 0, false);
      },

      /**
       *
       * @ngdoc function
       * @name ng.$animate#move
       * @methodOf ng.$animate
       * @function
       * @description Moves the position of the provided element within the DOM to be placed
       * either after the `after` element or inside of the `parent` element. Once complete, the
       * done() callback will be fired (if provided).
       * 
       * @param {jQuery/jqLite element} element the element which will be moved around within the
       *   DOM
       * @param {jQuery/jqLite element} parent the parent element where the element will be
       *   inserted into (if the after element is not present)
       * @param {jQuery/jqLite element} after the sibling element where the element will be
       *   positioned next to
       * @param {function=} done the callback function (if provided) that will be fired after the
       *   element has been moved to its new position
       */
      move : function(element, parent, after, done) {
        // Do not remove element before insert. Removing will cause data associated with the
        // element to be dropped. Insert will implicitly do the remove.
        this.enter(element, parent, after, done);
      },

      /**
       *
       * @ngdoc function
       * @name ng.$animate#addClass
       * @methodOf ng.$animate
       * @function
       * @description Adds the provided className CSS class value to the provided element. Once
       * complete, the done() callback will be fired (if provided).
       * @param {jQuery/jqLite element} element the element which will have the className value
       *   added to it
       * @param {string} className the CSS class which will be added to the element
       * @param {function=} done the callback function (if provided) that will be fired after the
       *   className value has been added to the element
       */
      addClass : function(element, className, done) {
        className = isString(className) ?
                      className :
                      isArray(className) ? className.join(' ') : '';
        forEach(element, function (element) {
          jqLiteAddClass(element, className);
        });
        done && $timeout(done, 0, false);
      },

      /**
       *
       * @ngdoc function
       * @name ng.$animate#removeClass
       * @methodOf ng.$animate
       * @function
       * @description Removes the provided className CSS class value from the provided element.
       * Once complete, the done() callback will be fired (if provided).
       * @param {jQuery/jqLite element} element the element which will have the className value
       *   removed from it
       * @param {string} className the CSS class which will be removed from the element
       * @param {function=} done the callback function (if provided) that will be fired after the
       *   className value has been removed from the element
       */
      removeClass : function(element, className, done) {
        className = isString(className) ?
                      className :
                      isArray(className) ? className.join(' ') : '';
        forEach(element, function (element) {
          jqLiteRemoveClass(element, className);
        });
        done && $timeout(done, 0, false);
      },

      enabled : noop
    };
  }];
}];

/**
 * ! This is a private undocumented service !
 *
 * @name ng.$browser
 * @requires $log
 * @description
 * This object has two goals:
 *
 * - hide all the global state in the browser caused by the window object
 * - abstract away all the browser specific features and inconsistencies
 *
 * For tests we provide {@link ngMock.$browser mock implementation} of the `$browser`
 * service, which can be used for convenient testing of the application without the interaction with
 * the real browser apis.
 */
/**
 * @param {object} window The global window object.
 * @param {object} document jQuery wrapped document.
 * @param {function()} XHR XMLHttpRequest constructor.
 * @param {object} $log console.log or an object with the same interface.
 * @param {object} $sniffer $sniffer service
 */
function Browser(window, document, $log, $sniffer) {
  var self = this,
      rawDocument = document[0],
      location = window.location,
      history = window.history,
      setTimeout = window.setTimeout,
      clearTimeout = window.clearTimeout,
      pendingDeferIds = {};

  self.isMock = false;

  var outstandingRequestCount = 0;
  var outstandingRequestCallbacks = [];

  // TODO(vojta): remove this temporary api
  self.$$completeOutstandingRequest = completeOutstandingRequest;
  self.$$incOutstandingRequestCount = function() { outstandingRequestCount++; };

  /**
   * Executes the `fn` function(supports currying) and decrements the `outstandingRequestCallbacks`
   * counter. If the counter reaches 0, all the `outstandingRequestCallbacks` are executed.
   */
  function completeOutstandingRequest(fn) {
    try {
      fn.apply(null, sliceArgs(arguments, 1));
    } finally {
      outstandingRequestCount--;
      if (outstandingRequestCount === 0) {
        while(outstandingRequestCallbacks.length) {
          try {
            outstandingRequestCallbacks.pop()();
          } catch (e) {
            $log.error(e);
          }
        }
      }
    }
  }

  /**
   * @private
   * Note: this method is used only by scenario runner
   * TODO(vojta): prefix this method with $$ ?
   * @param {function()} callback Function that will be called when no outstanding request
   */
  self.notifyWhenNoOutstandingRequests = function(callback) {
    // force browser to execute all pollFns - this is needed so that cookies and other pollers fire
    // at some deterministic time in respect to the test runner's actions. Leaving things up to the
    // regular poller would result in flaky tests.
    forEach(pollFns, function(pollFn){ pollFn(); });

    if (outstandingRequestCount === 0) {
      callback();
    } else {
      outstandingRequestCallbacks.push(callback);
    }
  };

  //////////////////////////////////////////////////////////////
  // Poll Watcher API
  //////////////////////////////////////////////////////////////
  var pollFns = [],
      pollTimeout;

  /**
   * @name ng.$browser#addPollFn
   * @methodOf ng.$browser
   *
   * @param {function()} fn Poll function to add
   *
   * @description
   * Adds a function to the list of functions that poller periodically executes,
   * and starts polling if not started yet.
   *
   * @returns {function()} the added function
   */
  self.addPollFn = function(fn) {
    if (isUndefined(pollTimeout)) startPoller(100, setTimeout);
    pollFns.push(fn);
    return fn;
  };

  /**
   * @param {number} interval How often should browser call poll functions (ms)
   * @param {function()} setTimeout Reference to a real or fake `setTimeout` function.
   *
   * @description
   * Configures the poller to run in the specified intervals, using the specified
   * setTimeout fn and kicks it off.
   */
  function startPoller(interval, setTimeout) {
    (function check() {
      forEach(pollFns, function(pollFn){ pollFn(); });
      pollTimeout = setTimeout(check, interval);
    })();
  }

  //////////////////////////////////////////////////////////////
  // URL API
  //////////////////////////////////////////////////////////////

  var lastBrowserUrl = location.href,
      baseElement = document.find('base'),
      newLocation = null;

  /**
   * @name ng.$browser#url
   * @methodOf ng.$browser
   *
   * @description
   * GETTER:
   * Without any argument, this method just returns current value of location.href.
   *
   * SETTER:
   * With at least one argument, this method sets url to new value.
   * If html5 history api supported, pushState/replaceState is used, otherwise
   * location.href/location.replace is used.
   * Returns its own instance to allow chaining
   *
   * NOTE: this api is intended for use only by the $location service. Please use the
   * {@link ng.$location $location service} to change url.
   *
   * @param {string} url New url (when used as setter)
   * @param {boolean=} replace Should new url replace current history record ?
   */
  self.url = function(url, replace) {
    // Android Browser BFCache causes location reference to become stale.
    if (location !== window.location) location = window.location;

    // setter
    if (url) {
      if (lastBrowserUrl == url) return;
      lastBrowserUrl = url;
      if ($sniffer.history) {
        if (replace) history.replaceState(null, '', url);
        else {
          history.pushState(null, '', url);
          // Crazy Opera Bug: http://my.opera.com/community/forums/topic.dml?id=1185462
          baseElement.attr('href', baseElement.attr('href'));
        }
      } else {
        newLocation = url;
        if (replace) {
          location.replace(url);
        } else {
          location.href = url;
        }
      }
      return self;
    // getter
    } else {
      // - newLocation is a workaround for an IE7-9 issue with location.replace and location.href
      //   methods not updating location.href synchronously.
      // - the replacement is a workaround for https://bugzilla.mozilla.org/show_bug.cgi?id=407172
      return newLocation || location.href.replace(/%27/g,"'");
    }
  };

  var urlChangeListeners = [],
      urlChangeInit = false;

  function fireUrlChange() {
    newLocation = null;
    if (lastBrowserUrl == self.url()) return;

    lastBrowserUrl = self.url();
    forEach(urlChangeListeners, function(listener) {
      listener(self.url());
    });
  }

  /**
   * @name ng.$browser#onUrlChange
   * @methodOf ng.$browser
   * @TODO(vojta): refactor to use node's syntax for events
   *
   * @description
   * Register callback function that will be called, when url changes.
   *
   * It's only called when the url is changed by outside of angular:
   * - user types different url into address bar
   * - user clicks on history (forward/back) button
   * - user clicks on a link
   *
   * It's not called when url is changed by $browser.url() method
   *
   * The listener gets called with new url as parameter.
   *
   * NOTE: this api is intended for use only by the $location service. Please use the
   * {@link ng.$location $location service} to monitor url changes in angular apps.
   *
   * @param {function(string)} listener Listener function to be called when url changes.
   * @return {function(string)} Returns the registered listener fn - handy if the fn is anonymous.
   */
  self.onUrlChange = function(callback) {
    if (!urlChangeInit) {
      // We listen on both (hashchange/popstate) when available, as some browsers (e.g. Opera)
      // don't fire popstate when user change the address bar and don't fire hashchange when url
      // changed by push/replaceState

      // html5 history api - popstate event
      if ($sniffer.history) jqLite(window).on('popstate', fireUrlChange);
      // hashchange event
      if ($sniffer.hashchange) jqLite(window).on('hashchange', fireUrlChange);
      // polling
      else self.addPollFn(fireUrlChange);

      urlChangeInit = true;
    }

    urlChangeListeners.push(callback);
    return callback;
  };

  //////////////////////////////////////////////////////////////
  // Misc API
  //////////////////////////////////////////////////////////////

  /**
   * @name ng.$browser#baseHref
   * @methodOf ng.$browser
   * 
   * @description
   * Returns current <base href>
   * (always relative - without domain)
   *
   * @returns {string=} current <base href>
   */
  self.baseHref = function() {
    var href = baseElement.attr('href');
    return href ? href.replace(/^https?\:\/\/[^\/]*/, '') : '';
  };

  //////////////////////////////////////////////////////////////
  // Cookies API
  //////////////////////////////////////////////////////////////
  var lastCookies = {};
  var lastCookieString = '';
  var cookiePath = self.baseHref();

  /**
   * @name ng.$browser#cookies
   * @methodOf ng.$browser
   *
   * @param {string=} name Cookie name
   * @param {string=} value Cookie value
   *
   * @description
   * The cookies method provides a 'private' low level access to browser cookies.
   * It is not meant to be used directly, use the $cookie service instead.
   *
   * The return values vary depending on the arguments that the method was called with as follows:
   * 
   * - cookies() -> hash of all cookies, this is NOT a copy of the internal state, so do not modify
   *   it
   * - cookies(name, value) -> set name to value, if value is undefined delete the cookie
   * - cookies(name) -> the same as (name, undefined) == DELETES (no one calls it right now that
   *   way)
   * 
   * @returns {Object} Hash of all cookies (if called without any parameter)
   */
  self.cookies = function(name, value) {
    /* global escape: false, unescape: false */
    var cookieLength, cookieArray, cookie, i, index;

    if (name) {
      if (value === undefined) {
        rawDocument.cookie = escape(name) + "=;path=" + cookiePath +
                                ";expires=Thu, 01 Jan 1970 00:00:00 GMT";
      } else {
        if (isString(value)) {
          cookieLength = (rawDocument.cookie = escape(name) + '=' + escape(value) +
                                ';path=' + cookiePath).length + 1;

          // per http://www.ietf.org/rfc/rfc2109.txt browser must allow at minimum:
          // - 300 cookies
          // - 20 cookies per unique domain
          // - 4096 bytes per cookie
          if (cookieLength > 4096) {
            $log.warn("Cookie '"+ name +
              "' possibly not set or overflowed because it was too large ("+
              cookieLength + " > 4096 bytes)!");
          }
        }
      }
    } else {
      if (rawDocument.cookie !== lastCookieString) {
        lastCookieString = rawDocument.cookie;
        cookieArray = lastCookieString.split("; ");
        lastCookies = {};

        for (i = 0; i < cookieArray.length; i++) {
          cookie = cookieArray[i];
          index = cookie.indexOf('=');
          if (index > 0) { //ignore nameless cookies
            name = unescape(cookie.substring(0, index));
            // the first value that is seen for a cookie is the most
            // specific one.  values for the same cookie name that
            // follow are for less specific paths.
            if (lastCookies[name] === undefined) {
              lastCookies[name] = unescape(cookie.substring(index + 1));
            }
          }
        }
      }
      return lastCookies;
    }
  };


  /**
   * @name ng.$browser#defer
   * @methodOf ng.$browser
   * @param {function()} fn A function, who's execution should be deferred.
   * @param {number=} [delay=0] of milliseconds to defer the function execution.
   * @returns {*} DeferId that can be used to cancel the task via `$browser.defer.cancel()`.
   *
   * @description
   * Executes a fn asynchronously via `setTimeout(fn, delay)`.
   *
   * Unlike when calling `setTimeout` directly, in test this function is mocked and instead of using
   * `setTimeout` in tests, the fns are queued in an array, which can be programmatically flushed
   * via `$browser.defer.flush()`.
   *
   */
  self.defer = function(fn, delay) {
    var timeoutId;
    outstandingRequestCount++;
    timeoutId = setTimeout(function() {
      delete pendingDeferIds[timeoutId];
      completeOutstandingRequest(fn);
    }, delay || 0);
    pendingDeferIds[timeoutId] = true;
    return timeoutId;
  };


  /**
   * @name ng.$browser#defer.cancel
   * @methodOf ng.$browser.defer
   *
   * @description
   * Cancels a deferred task identified with `deferId`.
   *
   * @param {*} deferId Token returned by the `$browser.defer` function.
   * @returns {boolean} Returns `true` if the task hasn't executed yet and was successfully
   *                    canceled.
   */
  self.defer.cancel = function(deferId) {
    if (pendingDeferIds[deferId]) {
      delete pendingDeferIds[deferId];
      clearTimeout(deferId);
      completeOutstandingRequest(noop);
      return true;
    }
    return false;
  };

}

function $BrowserProvider(){
  this.$get = ['$window', '$log', '$sniffer', '$document',
      function( $window,   $log,   $sniffer,   $document){
        return new Browser($window, $document, $log, $sniffer);
      }];
}

/**
 * @ngdoc object
 * @name ng.$cacheFactory
 *
 * @description
 * Factory that constructs cache objects and gives access to them.
 * 
 * <pre>
 * 
 *  var cache = $cacheFactory('cacheId');
 *  expect($cacheFactory.get('cacheId')).toBe(cache);
 *  expect($cacheFactory.get('noSuchCacheId')).not.toBeDefined();
 *
 *  cache.put("key", "value");
 *  cache.put("another key", "another value");
 *
 *  // We've specified no options on creation
 *  expect(cache.info()).toEqual({id: 'cacheId', size: 2}); 
 * 
 * </pre>
 *
 *
 * @param {string} cacheId Name or id of the newly created cache.
 * @param {object=} options Options object that specifies the cache behavior. Properties:
 *
 *   - `{number=}` `capacity` — turns the cache into LRU cache.
 *
 * @returns {object} Newly created cache object with the following set of methods:
 *
 * - `{object}` `info()` — Returns id, size, and options of cache.
 * - `{{*}}` `put({string} key, {*} value)` — Puts a new key-value pair into the cache and returns
 *   it.
 * - `{{*}}` `get({string} key)` — Returns cached value for `key` or undefined for cache miss.
 * - `{void}` `remove({string} key)` — Removes a key-value pair from the cache.
 * - `{void}` `removeAll()` — Removes all cached values.
 * - `{void}` `destroy()` — Removes references to this cache from $cacheFactory.
 *
 */
function $CacheFactoryProvider() {

  this.$get = function() {
    var caches = {};

    function cacheFactory(cacheId, options) {
      if (cacheId in caches) {
        throw minErr('$cacheFactory')('iid', "CacheId '{0}' is already taken!", cacheId);
      }

      var size = 0,
          stats = extend({}, options, {id: cacheId}),
          data = {},
          capacity = (options && options.capacity) || Number.MAX_VALUE,
          lruHash = {},
          freshEnd = null,
          staleEnd = null;

      return caches[cacheId] = {

        put: function(key, value) {
          var lruEntry = lruHash[key] || (lruHash[key] = {key: key});

          refresh(lruEntry);

          if (isUndefined(value)) return;
          if (!(key in data)) size++;
          data[key] = value;

          if (size > capacity) {
            this.remove(staleEnd.key);
          }

          return value;
        },


        get: function(key) {
          var lruEntry = lruHash[key];

          if (!lruEntry) return;

          refresh(lruEntry);

          return data[key];
        },


        remove: function(key) {
          var lruEntry = lruHash[key];

          if (!lruEntry) return;

          if (lruEntry == freshEnd) freshEnd = lruEntry.p;
          if (lruEntry == staleEnd) staleEnd = lruEntry.n;
          link(lruEntry.n,lruEntry.p);

          delete lruHash[key];
          delete data[key];
          size--;
        },


        removeAll: function() {
          data = {};
          size = 0;
          lruHash = {};
          freshEnd = staleEnd = null;
        },


        destroy: function() {
          data = null;
          stats = null;
          lruHash = null;
          delete caches[cacheId];
        },


        info: function() {
          return extend({}, stats, {size: size});
        }
      };


      /**
       * makes the `entry` the freshEnd of the LRU linked list
       */
      function refresh(entry) {
        if (entry != freshEnd) {
          if (!staleEnd) {
            staleEnd = entry;
          } else if (staleEnd == entry) {
            staleEnd = entry.n;
          }

          link(entry.n, entry.p);
          link(entry, freshEnd);
          freshEnd = entry;
          freshEnd.n = null;
        }
      }


      /**
       * bidirectionally links two entries of the LRU linked list
       */
      function link(nextEntry, prevEntry) {
        if (nextEntry != prevEntry) {
          if (nextEntry) nextEntry.p = prevEntry; //p stands for previous, 'prev' didn't minify
          if (prevEntry) prevEntry.n = nextEntry; //n stands for next, 'next' didn't minify
        }
      }
    }


  /**
   * @ngdoc method
   * @name ng.$cacheFactory#info
   * @methodOf ng.$cacheFactory
   *
   * @description
   * Get information about all the of the caches that have been created
   *
   * @returns {Object} - key-value map of `cacheId` to the result of calling `cache#info`
   */
    cacheFactory.info = function() {
      var info = {};
      forEach(caches, function(cache, cacheId) {
        info[cacheId] = cache.info();
      });
      return info;
    };


  /**
   * @ngdoc method
   * @name ng.$cacheFactory#get
   * @methodOf ng.$cacheFactory
   *
   * @description
   * Get access to a cache object by the `cacheId` used when it was created.
   *
   * @param {string} cacheId Name or id of a cache to access.
   * @returns {object} Cache object identified by the cacheId or undefined if no such cache.
   */
    cacheFactory.get = function(cacheId) {
      return caches[cacheId];
    };


    return cacheFactory;
  };
}

/**
 * @ngdoc object
 * @name ng.$templateCache
 *
 * @description
 * The first time a template is used, it is loaded in the template cache for quick retrieval. You
 * can load templates directly into the cache in a `script` tag, or by consuming the
 * `$templateCache` service directly.
 * 
 * Adding via the `script` tag:
 * <pre>
 * <html ng-app>
 * <head>
 * <script type="text/ng-template" id="templateId.html">
 *   This is the content of the template
 * </script>
 * </head>
 *   ...
 * </html>
 * </pre>
 * 
 * **Note:** the `script` tag containing the template does not need to be included in the `head` of
 * the document, but it must be below the `ng-app` definition.
 * 
 * Adding via the $templateCache service:
 * 
 * <pre>
 * var myApp = angular.module('myApp', []);
 * myApp.run(function($templateCache) {
 *   $templateCache.put('templateId.html', 'This is the content of the template');
 * });
 * </pre>
 * 
 * To retrieve the template later, simply use it in your HTML:
 * <pre>
 * <div ng-include=" 'templateId.html' "></div>
 * </pre>
 * 
 * or get it via Javascript:
 * <pre>
 * $templateCache.get('templateId.html')
 * </pre>
 * 
 * See {@link ng.$cacheFactory $cacheFactory}.
 *
 */
function $TemplateCacheProvider() {
  this.$get = ['$cacheFactory', function($cacheFactory) {
    return $cacheFactory('templates');
  }];
}

/* ! VARIABLE/FUNCTION NAMING CONVENTIONS THAT APPLY TO THIS FILE!
 *
 * DOM-related variables:
 *
 * - "node" - DOM Node
 * - "element" - DOM Element or Node
 * - "$node" or "$element" - jqLite-wrapped node or element
 *
 *
 * Compiler related stuff:
 *
 * - "linkFn" - linking fn of a single directive
 * - "nodeLinkFn" - function that aggregates all linking fns for a particular node
 * - "childLinkFn" -  function that aggregates all linking fns for child nodes of a particular node
 * - "compositeLinkFn" - function that aggregates all linking fns for a compilation root (nodeList)
 */


/**
 * @ngdoc function
 * @name ng.$compile
 * @function
 *
 * @description
 * Compiles a piece of HTML string or DOM into a template and produces a template function, which
 * can then be used to link {@link ng.$rootScope.Scope `scope`} and the template together.
 *
 * The compilation is a process of walking the DOM tree and matching DOM elements to
 * {@link ng.$compileProvider#methods_directive directives}.
 *
 * <div class="alert alert-warning">
 * **Note:** This document is an in-depth reference of all directive options.
 * For a gentle introduction to directives with examples of common use cases,
 * see the {@link guide/directive directive guide}.
 * </div>
 *
 * ## Comprehensive Directive API
 *
 * There are many different options for a directive.
 *
 * The difference resides in the return value of the factory function.
 * You can either return a "Directive Definition Object" (see below) that defines the directive properties,
 * or just the `postLink` function (all other properties will have the default values).
 *
 * <div class="alert alert-success">
 * **Best Practice:** It's recommended to use the "directive definition object" form.
 * </div>
 *
 * Here's an example directive declared with a Directive Definition Object:
 *
 * <pre>
 *   var myModule = angular.module(...);
 *
 *   myModule.directive('directiveName', function factory(injectables) {
 *     var directiveDefinitionObject = {
 *       priority: 0,
 *       template: '<div></div>', // or // function(tElement, tAttrs) { ... },
 *       // or
 *       // templateUrl: 'directive.html', // or // function(tElement, tAttrs) { ... },
 *       replace: false,
 *       transclude: false,
 *       restrict: 'A',
 *       scope: false,
 *       controller: function($scope, $element, $attrs, $transclude, otherInjectables) { ... },
 *       require: 'siblingDirectiveName', // or // ['^parentDirectiveName', '?optionalDirectiveName', '?^optionalParent'],
 *       compile: function compile(tElement, tAttrs, transclude) {
 *         return {
 *           pre: function preLink(scope, iElement, iAttrs, controller) { ... },
 *           post: function postLink(scope, iElement, iAttrs, controller) { ... }
 *         }
 *         // or
 *         // return function postLink( ... ) { ... }
 *       },
 *       // or
 *       // link: {
 *       //  pre: function preLink(scope, iElement, iAttrs, controller) { ... },
 *       //  post: function postLink(scope, iElement, iAttrs, controller) { ... }
 *       // }
 *       // or
 *       // link: function postLink( ... ) { ... }
 *     };
 *     return directiveDefinitionObject;
 *   });
 * </pre>
 *
 * <div class="alert alert-warning">
 * **Note:** Any unspecified options will use the default value. You can see the default values below.
 * </div>
 *
 * Therefore the above can be simplified as:
 *
 * <pre>
 *   var myModule = angular.module(...);
 *
 *   myModule.directive('directiveName', function factory(injectables) {
 *     var directiveDefinitionObject = {
 *       link: function postLink(scope, iElement, iAttrs) { ... }
 *     };
 *     return directiveDefinitionObject;
 *     // or
 *     // return function postLink(scope, iElement, iAttrs) { ... }
 *   });
 * </pre>
 *
 *
 *
 * ### Directive Definition Object
 *
 * The directive definition object provides instructions to the {@link api/ng.$compile
 * compiler}. The attributes are:
 *
 * #### `priority`
 * When there are multiple directives defined on a single DOM element, sometimes it
 * is necessary to specify the order in which the directives are applied. The `priority` is used
 * to sort the directives before their `compile` functions get called. Priority is defined as a
 * number. Directives with greater numerical `priority` are compiled first. Pre-link functions
 * are also run in priority order, but post-link functions are run in reverse order. The order
 * of directives with the same priority is undefined. The default priority is `0`.
 *
 * #### `terminal`
 * If set to true then the current `priority` will be the last set of directives
 * which will execute (any directives at the current priority will still execute
 * as the order of execution on same `priority` is undefined).
 *
 * #### `scope`
 * **If set to `true`,** then a new scope will be created for this directive. If multiple directives on the
 * same element request a new scope, only one new scope is created. The new scope rule does not
 * apply for the root of the template since the root of the template always gets a new scope.
 *
 * **If set to `{}` (object hash),** then a new "isolate" scope is created. The 'isolate' scope differs from
 * normal scope in that it does not prototypically inherit from the parent scope. This is useful
 * when creating reusable components, which should not accidentally read or modify data in the
 * parent scope.
 *
 * The 'isolate' scope takes an object hash which defines a set of local scope properties
 * derived from the parent scope. These local properties are useful for aliasing values for
 * templates. Locals definition is a hash of local scope property to its source:
 *
 * * `@` or `@attr` - bind a local scope property to the value of DOM attribute. The result is
 *   always a string since DOM attributes are strings. If no `attr` name is specified  then the
 *   attribute name is assumed to be the same as the local name.
 *   Given `<widget my-attr="hello {{name}}">` and widget definition
 *   of `scope: { localName:'@myAttr' }`, then widget scope property `localName` will reflect
 *   the interpolated value of `hello {{name}}`. As the `name` attribute changes so will the
 *   `localName` property on the widget scope. The `name` is read from the parent scope (not
 *   component scope).
 *
 * * `=` or `=attr` - set up bi-directional binding between a local scope property and the
 *   parent scope property of name defined via the value of the `attr` attribute. If no `attr`
 *   name is specified then the attribute name is assumed to be the same as the local name.
 *   Given `<widget my-attr="parentModel">` and widget definition of
 *   `scope: { localModel:'=myAttr' }`, then widget scope property `localModel` will reflect the
 *   value of `parentModel` on the parent scope. Any changes to `parentModel` will be reflected
 *   in `localModel` and any changes in `localModel` will reflect in `parentModel`. If the parent
 *   scope property doesn't exist, it will throw a NON_ASSIGNABLE_MODEL_EXPRESSION exception. You
 *   can avoid this behavior using `=?` or `=?attr` in order to flag the property as optional.
 *
 * * `&` or `&attr` - provides a way to execute an expression in the context of the parent scope.
 *   If no `attr` name is specified then the attribute name is assumed to be the same as the
 *   local name. Given `<widget my-attr="count = count + value">` and widget definition of
 *   `scope: { localFn:'&myAttr' }`, then isolate scope property `localFn` will point to
 *   a function wrapper for the `count = count + value` expression. Often it's desirable to
 *   pass data from the isolated scope via an expression and to the parent scope, this can be
 *   done by passing a map of local variable names and values into the expression wrapper fn.
 *   For example, if the expression is `increment(amount)` then we can specify the amount value
 *   by calling the `localFn` as `localFn({amount: 22})`.
 *
 *
 *
 * #### `controller`
 * Controller constructor function. The controller is instantiated before the
 * pre-linking phase and it is shared with other directives (see
 * `require` attribute). This allows the directives to communicate with each other and augment
 * each other's behavior. The controller is injectable (and supports bracket notation) with the following locals:
 *
 * * `$scope` - Current scope associated with the element
 * * `$element` - Current element
 * * `$attrs` - Current attributes object for the element
 * * `$transclude` - A transclude linking function pre-bound to the correct transclusion scope.
 *    The scope can be overridden by an optional first argument.
 *   `function([scope], cloneLinkingFn)`.
 *
 *
 * #### `require`
 * Require another directive and inject its controller as the fourth argument to the linking function. The
 * `require` takes a string name (or array of strings) of the directive(s) to pass in. If an array is used, the
 * injected argument will be an array in corresponding order. If no such directive can be
 * found, or if the directive does not have a controller, then an error is raised. The name can be prefixed with:
 *
 * * (no prefix) - Locate the required controller on the current element. Throw an error if not found.
 * * `?` - Attempt to locate the required controller or pass `null` to the `link` fn if not found.
 * * `^` - Locate the required controller by searching the element's parents. Throw an error if not found.
 * * `?^` - Attempt to locate the required controller by searching the element's parentsor pass `null` to the
 *   `link` fn if not found.
 *
 *
 * #### `controllerAs`
 * Controller alias at the directive scope. An alias for the controller so it
 * can be referenced at the directive template. The directive needs to define a scope for this
 * configuration to be used. Useful in the case when directive is used as component.
 *
 *
 * #### `restrict`
 * String of subset of `EACM` which restricts the directive to a specific directive
 * declaration style. If omitted, the default (attributes only) is used.
 *
 * * `E` - Element name: `<my-directive></my-directive>`
 * * `A` - Attribute (default): `<div my-directive="exp"></div>`
 * * `C` - Class: `<div class="my-directive: exp;"></div>`
 * * `M` - Comment: `<!-- directive: my-directive exp -->`
 *
 *
 * #### `template`
 * replace the current element with the contents of the HTML. The replacement process
 * migrates all of the attributes / classes from the old element to the new one. See the
 * {@link guide/directive#creating-custom-directives_creating-directives_template-expanding-directive
 * Directives Guide} for an example.
 *
 * You can specify `template` as a string representing the template or as a function which takes
 * two arguments `tElement` and `tAttrs` (described in the `compile` function api below) and
 * returns a string value representing the template.
 *
 *
 * #### `templateUrl`
 * Same as `template` but the template is loaded from the specified URL. Because
 * the template loading is asynchronous the compilation/linking is suspended until the template
 * is loaded.
 *
 * You can specify `templateUrl` as a string representing the URL or as a function which takes two
 * arguments `tElement` and `tAttrs` (described in the `compile` function api below) and returns
 * a string value representing the url.  In either case, the template URL is passed through {@link
 * api/ng.$sce#methods_getTrustedResourceUrl $sce.getTrustedResourceUrl}.
 *
 *
 * #### `replace`
 * specify where the template should be inserted. Defaults to `false`.
 *
 * * `true` - the template will replace the current element.
 * * `false` - the template will replace the contents of the current element.
 *
 *
 * #### `transclude`
 * compile the content of the element and make it available to the directive.
 * Typically used with {@link api/ng.directive:ngTransclude
 * ngTransclude}. The advantage of transclusion is that the linking function receives a
 * transclusion function which is pre-bound to the correct scope. In a typical setup the widget
 * creates an `isolate` scope, but the transclusion is not a child, but a sibling of the `isolate`
 * scope. This makes it possible for the widget to have private state, and the transclusion to
 * be bound to the parent (pre-`isolate`) scope.
 *
 * * `true` - transclude the content of the directive.
 * * `'element'` - transclude the whole element including any directives defined at lower priority.
 *
 *
 * #### `compile`
 *
 * <pre>
 *   function compile(tElement, tAttrs, transclude) { ... }
 * </pre>
 *
 * The compile function deals with transforming the template DOM. Since most directives do not do
 * template transformation, it is not used often. Examples that require compile functions are
 * directives that transform template DOM, such as {@link
 * api/ng.directive:ngRepeat ngRepeat}, or load the contents
 * asynchronously, such as {@link api/ngRoute.directive:ngView ngView}. The
 * compile function takes the following arguments.
 *
 *   * `tElement` - template element - The element where the directive has been declared. It is
 *     safe to do template transformation on the element and child elements only.
 *
 *   * `tAttrs` - template attributes - Normalized list of attributes declared on this element shared
 *     between all directive compile functions.
 *
 *   * `transclude` -  [*DEPRECATED*!] A transclude linking function: `function(scope, cloneLinkingFn)`
 *
 * <div class="alert alert-warning">
 * **Note:** The template instance and the link instance may be different objects if the template has
 * been cloned. For this reason it is **not** safe to do anything other than DOM transformations that
 * apply to all cloned DOM nodes within the compile function. Specifically, DOM listener registration
 * should be done in a linking function rather than in a compile function.
 * </div>
 *
 * <div class="alert alert-error">
 * **Note:** The `transclude` function that is passed to the compile function is deperecated, as it
 *   e.g. does not know about the right outer scope. Please use the transclude function that is passed
 *   to the link function instead.
 * </div>

 * A compile function can have a return value which can be either a function or an object.
 *
 * * returning a (post-link) function - is equivalent to registering the linking function via the
 *   `link` property of the config object when the compile function is empty.
 *
 * * returning an object with function(s) registered via `pre` and `post` properties - allows you to
 *   control when a linking function should be called during the linking phase. See info about
 *   pre-linking and post-linking functions below.
 *
 *
 * #### `link`
 * This property is used only if the `compile` property is not defined.
 *
 * <pre>
 *   function link(scope, iElement, iAttrs, controller, transcludeFn) { ... }
 * </pre>
 *
 * The link function is responsible for registering DOM listeners as well as updating the DOM. It is
 * executed after the template has been cloned. This is where most of the directive logic will be
 * put.
 *
 *   * `scope` - {@link api/ng.$rootScope.Scope Scope} - The scope to be used by the
 *     directive for registering {@link api/ng.$rootScope.Scope#methods_$watch watches}.
 *
 *   * `iElement` - instance element - The element where the directive is to be used. It is safe to
 *     manipulate the children of the element only in `postLink` function since the children have
 *     already been linked.
 *
 *   * `iAttrs` - instance attributes - Normalized list of attributes declared on this element shared
 *     between all directive linking functions.
 *
 *   * `controller` - a controller instance - A controller instance if at least one directive on the
 *     element defines a controller. The controller is shared among all the directives, which allows
 *     the directives to use the controllers as a communication channel.
 *
 *   * `transcludeFn` - A transclude linking function pre-bound to the correct transclusion scope.
 *     The scope can be overridden by an optional first argument. This is the same as the `$transclude`
 *     parameter of directive controllers.
 *     `function([scope], cloneLinkingFn)`.
 *
 *
 * #### Pre-linking function
 *
 * Executed before the child elements are linked. Not safe to do DOM transformation since the
 * compiler linking function will fail to locate the correct elements for linking.
 *
 * #### Post-linking function
 *
 * Executed after the child elements are linked. It is safe to do DOM transformation in the post-linking function.
 *
 * <a name="Attributes"></a>
 * ### Attributes
 *
 * The {@link api/ng.$compile.directive.Attributes Attributes} object - passed as a parameter in the
 * `link()` or `compile()` functions. It has a variety of uses.
 *
 * accessing *Normalized attribute names:*
 * Directives like 'ngBind' can be expressed in many ways: 'ng:bind', `data-ng-bind`, or 'x-ng-bind'.
 * the attributes object allows for normalized access to
 *   the attributes.
 *
 * * *Directive inter-communication:* All directives share the same instance of the attributes
 *   object which allows the directives to use the attributes object as inter directive
 *   communication.
 *
 * * *Supports interpolation:* Interpolation attributes are assigned to the attribute object
 *   allowing other directives to read the interpolated value.
 *
 * * *Observing interpolated attributes:* Use `$observe` to observe the value changes of attributes
 *   that contain interpolation (e.g. `src="{{bar}}"`). Not only is this very efficient but it's also
 *   the only way to easily get the actual value because during the linking phase the interpolation
 *   hasn't been evaluated yet and so the value is at this time set to `undefined`.
 *
 * <pre>
 * function linkingFn(scope, elm, attrs, ctrl) {
 *   // get the attribute value
 *   console.log(attrs.ngModel);
 *
 *   // change the attribute
 *   attrs.$set('ngModel', 'new value');
 *
 *   // observe changes to interpolated attribute
 *   attrs.$observe('ngModel', function(value) {
 *     console.log('ngModel has changed value to ' + value);
 *   });
 * }
 * </pre>
 *
 * Below is an example using `$compileProvider`.
 *
 * <div class="alert alert-warning">
 * **Note**: Typically directives are registered with `module.directive`. The example below is
 * to illustrate how `$compile` works.
 * </div>
 *
 <doc:example module="compile">
   <doc:source>
    <script>
      angular.module('compile', [], function($compileProvider) {
        // configure new 'compile' directive by passing a directive
        // factory function. The factory function injects the '$compile'
        $compileProvider.directive('compile', function($compile) {
          // directive factory creates a link function
          return function(scope, element, attrs) {
            scope.$watch(
              function(scope) {
                 // watch the 'compile' expression for changes
                return scope.$eval(attrs.compile);
              },
              function(value) {
                // when the 'compile' expression changes
                // assign it into the current DOM
                element.html(value);

                // compile the new DOM and link it to the current
                // scope.
                // NOTE: we only compile .childNodes so that
                // we don't get into infinite loop compiling ourselves
                $compile(element.contents())(scope);
              }
            );
          };
        })
      });

      function Ctrl($scope) {
        $scope.name = 'Angular';
        $scope.html = 'Hello {{name}}';
      }
    </script>
    <div ng-controller="Ctrl">
      <input ng-model="name"> <br>
      <textarea ng-model="html"></textarea> <br>
      <div compile="html"></div>
    </div>
   </doc:source>
   <doc:scenario>
     it('should auto compile', function() {
       expect(element('div[compile]').text()).toBe('Hello Angular');
       input('html').enter('{{name}}!');
       expect(element('div[compile]').text()).toBe('Angular!');
     });
   </doc:scenario>
 </doc:example>

 *
 *
 * @param {string|DOMElement} element Element or HTML string to compile into a template function.
 * @param {function(angular.Scope[, cloneAttachFn]} transclude function available to directives.
 * @param {number} maxPriority only apply directives lower then given priority (Only effects the
 *                 root element(s), not their children)
 * @returns {function(scope[, cloneAttachFn])} a link function which is used to bind template
 * (a DOM element/tree) to a scope. Where:
 *
 *  * `scope` - A {@link ng.$rootScope.Scope Scope} to bind to.
 *  * `cloneAttachFn` - If `cloneAttachFn` is provided, then the link function will clone the
 *  `template` and call the `cloneAttachFn` function allowing the caller to attach the
 *  cloned elements to the DOM document at the appropriate place. The `cloneAttachFn` is
 *  called as: <br> `cloneAttachFn(clonedElement, scope)` where:
 *
 *      * `clonedElement` - is a clone of the original `element` passed into the compiler.
 *      * `scope` - is the current scope with which the linking function is working with.
 *
 * Calling the linking function returns the element of the template. It is either the original
 * element passed in, or the clone of the element if the `cloneAttachFn` is provided.
 *
 * After linking the view is not updated until after a call to $digest which typically is done by
 * Angular automatically.
 *
 * If you need access to the bound view, there are two ways to do it:
 *
 * - If you are not asking the linking function to clone the template, create the DOM element(s)
 *   before you send them to the compiler and keep this reference around.
 *   <pre>
 *     var element = $compile('<p>{{total}}</p>')(scope);
 *   </pre>
 *
 * - if on the other hand, you need the element to be cloned, the view reference from the original
 *   example would not point to the clone, but rather to the original template that was cloned. In
 *   this case, you can access the clone via the cloneAttachFn:
 *   <pre>
 *     var templateHTML = angular.element('<p>{{total}}</p>'),
 *         scope = ....;
 *
 *     var clonedElement = $compile(templateHTML)(scope, function(clonedElement, scope) {
 *       //attach the clone to DOM document at the right place
 *     });
 *
 *     //now we have reference to the cloned DOM via `clone`
 *   </pre>
 *
 *
 * For information on how the compiler works, see the
 * {@link guide/compiler Angular HTML Compiler} section of the Developer Guide.
 */

var $compileMinErr = minErr('$compile');

/**
 * @ngdoc service
 * @name ng.$compileProvider
 * @function
 *
 * @description
 */
$CompileProvider.$inject = ['$provide'];
function $CompileProvider($provide) {
  var hasDirectives = {},
      Suffix = 'Directive',
      COMMENT_DIRECTIVE_REGEXP = /^\s*directive\:\s*([\d\w\-_]+)\s+(.*)$/,
      CLASS_DIRECTIVE_REGEXP = /(([\d\w\-_]+)(?:\:([^;]+))?;?)/,
      aHrefSanitizationWhitelist = /^\s*(https?|ftp|mailto|tel|file):/,
      imgSrcSanitizationWhitelist = /^\s*(https?|ftp|file):|data:image\//;

  // Ref: http://developers.whatwg.org/webappapis.html#event-handler-idl-attributes
  // The assumption is that future DOM event attribute names will begin with
  // 'on' and be composed of only English letters.
  var EVENT_HANDLER_ATTR_REGEXP = /^(on[a-z]+|formaction)$/;

  /**
   * @ngdoc function
   * @name ng.$compileProvider#directive
   * @methodOf ng.$compileProvider
   * @function
   *
   * @description
   * Register a new directive with the compiler.
   *
   * @param {string|Object} name Name of the directive in camel-case (i.e. <code>ngBind</code> which
   *    will match as <code>ng-bind</code>), or an object map of directives where the keys are the
   *    names and the values are the factories.
   * @param {function|Array} directiveFactory An injectable directive factory function. See
   *    {@link guide/directive} for more info.
   * @returns {ng.$compileProvider} Self for chaining.
   */
   this.directive = function registerDirective(name, directiveFactory) {
    assertNotHasOwnProperty(name, 'directive');
    if (isString(name)) {
      assertArg(directiveFactory, 'directiveFactory');
      if (!hasDirectives.hasOwnProperty(name)) {
        hasDirectives[name] = [];
        $provide.factory(name + Suffix, ['$injector', '$exceptionHandler',
          function($injector, $exceptionHandler) {
            var directives = [];
            forEach(hasDirectives[name], function(directiveFactory, index) {
              try {
                var directive = $injector.invoke(directiveFactory);
                if (isFunction(directive)) {
                  directive = { compile: valueFn(directive) };
                } else if (!directive.compile && directive.link) {
                  directive.compile = valueFn(directive.link);
                }
                directive.priority = directive.priority || 0;
                directive.index = index;
                directive.name = directive.name || name;
                directive.require = directive.require || (directive.controller && directive.name);
                directive.restrict = directive.restrict || 'A';
                directives.push(directive);
              } catch (e) {
                $exceptionHandler(e);
              }
            });
            return directives;
          }]);
      }
      hasDirectives[name].push(directiveFactory);
    } else {
      forEach(name, reverseParams(registerDirective));
    }
    return this;
  };


  /**
   * @ngdoc function
   * @name ng.$compileProvider#aHrefSanitizationWhitelist
   * @methodOf ng.$compileProvider
   * @function
   *
   * @description
   * Retrieves or overrides the default regular expression that is used for whitelisting of safe
   * urls during a[href] sanitization.
   *
   * The sanitization is a security measure aimed at prevent XSS attacks via html links.
   *
   * Any url about to be assigned to a[href] via data-binding is first normalized and turned into
   * an absolute url. Afterwards, the url is matched against the `aHrefSanitizationWhitelist`
   * regular expression. If a match is found, the original url is written into the dom. Otherwise,
   * the absolute url is prefixed with `'unsafe:'` string and only then is it written into the DOM.
   *
   * @param {RegExp=} regexp New regexp to whitelist urls with.
   * @returns {RegExp|ng.$compileProvider} Current RegExp if called without value or self for
   *    chaining otherwise.
   */
  this.aHrefSanitizationWhitelist = function(regexp) {
    if (isDefined(regexp)) {
      aHrefSanitizationWhitelist = regexp;
      return this;
    }
    return aHrefSanitizationWhitelist;
  };


  /**
   * @ngdoc function
   * @name ng.$compileProvider#imgSrcSanitizationWhitelist
   * @methodOf ng.$compileProvider
   * @function
   *
   * @description
   * Retrieves or overrides the default regular expression that is used for whitelisting of safe
   * urls during img[src] sanitization.
   *
   * The sanitization is a security measure aimed at prevent XSS attacks via html links.
   *
   * Any url about to be assigned to img[src] via data-binding is first normalized and turned into
   * an absolute url. Afterwards, the url is matched against the `imgSrcSanitizationWhitelist`
   * regular expression. If a match is found, the original url is written into the dom. Otherwise,
   * the absolute url is prefixed with `'unsafe:'` string and only then is it written into the DOM.
   *
   * @param {RegExp=} regexp New regexp to whitelist urls with.
   * @returns {RegExp|ng.$compileProvider} Current RegExp if called without value or self for
   *    chaining otherwise.
   */
  this.imgSrcSanitizationWhitelist = function(regexp) {
    if (isDefined(regexp)) {
      imgSrcSanitizationWhitelist = regexp;
      return this;
    }
    return imgSrcSanitizationWhitelist;
  };


  this.$get = [
            '$injector', '$interpolate', '$exceptionHandler', '$http', '$templateCache', '$parse',
            '$controller', '$rootScope', '$document', '$sce', '$animate',
    function($injector,   $interpolate,   $exceptionHandler,   $http,   $templateCache,   $parse,
             $controller,   $rootScope,   $document,   $sce,   $animate) {

    var Attributes = function(element, attr) {
      this.$$element = element;
      this.$attr = attr || {};
    };

    Attributes.prototype = {
      $normalize: directiveNormalize,


      /**
       * @ngdoc function
       * @name ng.$compile.directive.Attributes#$addClass
       * @methodOf ng.$compile.directive.Attributes
       * @function
       *
       * @description
       * Adds the CSS class value specified by the classVal parameter to the element. If animations
       * are enabled then an animation will be triggered for the class addition.
       *
       * @param {string} classVal The className value that will be added to the element
       */
      $addClass : function(classVal) {
        if(classVal && classVal.length > 0) {
          $animate.addClass(this.$$element, classVal);
        }
      },

      /**
       * @ngdoc function
       * @name ng.$compile.directive.Attributes#$removeClass
       * @methodOf ng.$compile.directive.Attributes
       * @function
       *
       * @description
       * Removes the CSS class value specified by the classVal parameter from the element. If
       * animations are enabled then an animation will be triggered for the class removal.
       *
       * @param {string} classVal The className value that will be removed from the element
       */
      $removeClass : function(classVal) {
        if(classVal && classVal.length > 0) {
          $animate.removeClass(this.$$element, classVal);
        }
      },

      /**
       * Set a normalized attribute on the element in a way such that all directives
       * can share the attribute. This function properly handles boolean attributes.
       * @param {string} key Normalized key. (ie ngAttribute)
       * @param {string|boolean} value The value to set. If `null` attribute will be deleted.
       * @param {boolean=} writeAttr If false, does not write the value to DOM element attribute.
       *     Defaults to true.
       * @param {string=} attrName Optional none normalized name. Defaults to key.
       */
      $set: function(key, value, writeAttr, attrName) {
        //special case for class attribute addition + removal
        //so that class changes can tap into the animation
        //hooks provided by the $animate service
        if(key == 'class') {
          value = value || '';
          var current = this.$$element.attr('class') || '';
          this.$removeClass(tokenDifference(current, value).join(' '));
          this.$addClass(tokenDifference(value, current).join(' '));
        } else {
          var booleanKey = getBooleanAttrName(this.$$element[0], key),
              normalizedVal,
              nodeName;

          if (booleanKey) {
            this.$$element.prop(key, value);
            attrName = booleanKey;
          }

          this[key] = value;

          // translate normalized key to actual key
          if (attrName) {
            this.$attr[key] = attrName;
          } else {
            attrName = this.$attr[key];
            if (!attrName) {
              this.$attr[key] = attrName = snake_case(key, '-');
            }
          }

          nodeName = nodeName_(this.$$element);

          // sanitize a[href] and img[src] values
          if ((nodeName === 'A' && key === 'href') ||
              (nodeName === 'IMG' && key === 'src')) {
            // NOTE: urlResolve() doesn't support IE < 8 so we don't sanitize for that case.
            if (!msie || msie >= 8 ) {
              normalizedVal = urlResolve(value).href;
              if (normalizedVal !== '') {
                if ((key === 'href' && !normalizedVal.match(aHrefSanitizationWhitelist)) ||
                    (key === 'src' && !normalizedVal.match(imgSrcSanitizationWhitelist))) {
                  this[key] = value = 'unsafe:' + normalizedVal;
                }
              }
            }
          }

          if (writeAttr !== false) {
            if (value === null || value === undefined) {
              this.$$element.removeAttr(attrName);
            } else {
              this.$$element.attr(attrName, value);
            }
          }
        }

        // fire observers
        var $$observers = this.$$observers;
        $$observers && forEach($$observers[key], function(fn) {
          try {
            fn(value);
          } catch (e) {
            $exceptionHandler(e);
          }
        });

        function tokenDifference(str1, str2) {
          var values = [],
              tokens1 = str1.split(/\s+/),
              tokens2 = str2.split(/\s+/);

          outer:
          for(var i=0;i<tokens1.length;i++) {
            var token = tokens1[i];
            for(var j=0;j<tokens2.length;j++) {
              if(token == tokens2[j]) continue outer;
            }
            values.push(token);
          }
          return values;
        }
      },


      /**
       * @ngdoc function
       * @name ng.$compile.directive.Attributes#$observe
       * @methodOf ng.$compile.directive.Attributes
       * @function
       *
       * @description
       * Observes an interpolated attribute.
       *
       * The observer function will be invoked once during the next `$digest` following
       * compilation. The observer is then invoked whenever the interpolated value
       * changes.
       *
       * @param {string} key Normalized key. (ie ngAttribute) .
       * @param {function(interpolatedValue)} fn Function that will be called whenever
                the interpolated value of the attribute changes.
       *        See the {@link guide/directive#Attributes Directives} guide for more info.
       * @returns {function()} the `fn` parameter.
       */
      $observe: function(key, fn) {
        var attrs = this,
            $$observers = (attrs.$$observers || (attrs.$$observers = {})),
            listeners = ($$observers[key] || ($$observers[key] = []));

        listeners.push(fn);
        $rootScope.$evalAsync(function() {
          if (!listeners.$$inter) {
            // no one registered attribute interpolation function, so lets call it manually
            fn(attrs[key]);
          }
        });
        return fn;
      }
    };

    var startSymbol = $interpolate.startSymbol(),
        endSymbol = $interpolate.endSymbol(),
        denormalizeTemplate = (startSymbol == '{{' || endSymbol  == '}}')
            ? identity
            : function denormalizeTemplate(template) {
              return template.replace(/\{\{/g, startSymbol).replace(/}}/g, endSymbol);
        },
        NG_ATTR_BINDING = /^ngAttr[A-Z]/;


    return compile;

    //================================

    function compile($compileNodes, transcludeFn, maxPriority, ignoreDirective,
                        previousCompileContext) {
      if (!($compileNodes instanceof jqLite)) {
        // jquery always rewraps, whereas we need to preserve the original selector so that we can
        // modify it.
        $compileNodes = jqLite($compileNodes);
      }
      // We can not compile top level text elements since text nodes can be merged and we will
      // not be able to attach scope data to them, so we will wrap them in <span>
      forEach($compileNodes, function(node, index){
        if (node.nodeType == 3 /* text node */ && node.nodeValue.match(/\S+/) /* non-empty */ ) {
          $compileNodes[index] = node = jqLite(node).wrap('<span></span>').parent()[0];
        }
      });
      var compositeLinkFn =
              compileNodes($compileNodes, transcludeFn, $compileNodes,
                           maxPriority, ignoreDirective, previousCompileContext);
      return function publicLinkFn(scope, cloneConnectFn, transcludeControllers){
        assertArg(scope, 'scope');
        // important!!: we must call our jqLite.clone() since the jQuery one is trying to be smart
        // and sometimes changes the structure of the DOM.
        var $linkNode = cloneConnectFn
          ? JQLitePrototype.clone.call($compileNodes) // IMPORTANT!!!
          : $compileNodes;

        forEach(transcludeControllers, function(instance, name) {
          $linkNode.data('$' + name + 'Controller', instance);
        });

        // Attach scope only to non-text nodes.
        for(var i = 0, ii = $linkNode.length; i<ii; i++) {
          var node = $linkNode[i];
          if (node.nodeType == 1 /* element */ || node.nodeType == 9 /* document */) {
            $linkNode.eq(i).data('$scope', scope);
          }
        }
        safeAddClass($linkNode, 'ng-scope');
        if (cloneConnectFn) cloneConnectFn($linkNode, scope);
        if (compositeLinkFn) compositeLinkFn(scope, $linkNode, $linkNode);
        return $linkNode;
      };
    }

    function safeAddClass($element, className) {
      try {
        $element.addClass(className);
      } catch(e) {
        // ignore, since it means that we are trying to set class on
        // SVG element, where class name is read-only.
      }
    }

    /**
     * Compile function matches each node in nodeList against the directives. Once all directives
     * for a particular node are collected their compile functions are executed. The compile
     * functions return values - the linking functions - are combined into a composite linking
     * function, which is the a linking function for the node.
     *
     * @param {NodeList} nodeList an array of nodes or NodeList to compile
     * @param {function(angular.Scope[, cloneAttachFn]} transcludeFn A linking function, where the
     *        scope argument is auto-generated to the new child of the transcluded parent scope.
     * @param {DOMElement=} $rootElement If the nodeList is the root of the compilation tree then
     *        the rootElement must be set the jqLite collection of the compile root. This is
     *        needed so that the jqLite collection items can be replaced with widgets.
     * @param {number=} max directive priority
     * @returns {?function} A composite linking function of all of the matched directives or null.
     */
    function compileNodes(nodeList, transcludeFn, $rootElement, maxPriority, ignoreDirective,
                            previousCompileContext) {
      var linkFns = [],
          nodeLinkFn, childLinkFn, directives, attrs, linkFnFound;

      for(var i = 0; i < nodeList.length; i++) {
        attrs = new Attributes();

        // we must always refer to nodeList[i] since the nodes can be replaced underneath us.
        directives = collectDirectives(nodeList[i], [], attrs, i === 0 ? maxPriority : undefined,
                                        ignoreDirective);

        nodeLinkFn = (directives.length)
            ? applyDirectivesToNode(directives, nodeList[i], attrs, transcludeFn, $rootElement,
                                      null, [], [], previousCompileContext)
            : null;

        childLinkFn = (nodeLinkFn && nodeLinkFn.terminal ||
                      !nodeList[i].childNodes ||
                      !nodeList[i].childNodes.length)
            ? null
            : compileNodes(nodeList[i].childNodes,
                 nodeLinkFn ? nodeLinkFn.transclude : transcludeFn);

        linkFns.push(nodeLinkFn);
        linkFns.push(childLinkFn);
        linkFnFound = (linkFnFound || nodeLinkFn || childLinkFn);
        //use the previous context only for the first element in the virtual group
        previousCompileContext = null;
      }

      // return a linking function if we have found anything, null otherwise
      return linkFnFound ? compositeLinkFn : null;

      function compositeLinkFn(scope, nodeList, $rootElement, boundTranscludeFn) {
        var nodeLinkFn, childLinkFn, node, $node, childScope, childTranscludeFn, i, ii, n;

        // copy nodeList so that linking doesn't break due to live list updates.
        var stableNodeList = [];
        for (i = 0, ii = nodeList.length; i < ii; i++) {
          stableNodeList.push(nodeList[i]);
        }

        for(i = 0, n = 0, ii = linkFns.length; i < ii; n++) {
          node = stableNodeList[n];
          nodeLinkFn = linkFns[i++];
          childLinkFn = linkFns[i++];
          $node = jqLite(node);

          if (nodeLinkFn) {
            if (nodeLinkFn.scope) {
              childScope = scope.$new();
              $node.data('$scope', childScope);
              safeAddClass($node, 'ng-scope');
            } else {
              childScope = scope;
            }
            childTranscludeFn = nodeLinkFn.transclude;
            if (childTranscludeFn || (!boundTranscludeFn && transcludeFn)) {
              nodeLinkFn(childLinkFn, childScope, node, $rootElement,
                createBoundTranscludeFn(scope, childTranscludeFn || transcludeFn)
              );
            } else {
              nodeLinkFn(childLinkFn, childScope, node, undefined, boundTranscludeFn);
            }
          } else if (childLinkFn) {
            childLinkFn(scope, node.childNodes, undefined, boundTranscludeFn);
          }
        }
      }
    }

    function createBoundTranscludeFn(scope, transcludeFn) {
      return function boundTranscludeFn(transcludedScope, cloneFn, controllers) {
        var scopeCreated = false;

        if (!transcludedScope) {
          transcludedScope = scope.$new();
          transcludedScope.$$transcluded = true;
          scopeCreated = true;
        }

        var clone = transcludeFn(transcludedScope, cloneFn, controllers);
        if (scopeCreated) {
          clone.on('$destroy', bind(transcludedScope, transcludedScope.$destroy));
        }
        return clone;
      };
    }

    /**
     * Looks for directives on the given node and adds them to the directive collection which is
     * sorted.
     *
     * @param node Node to search.
     * @param directives An array to which the directives are added to. This array is sorted before
     *        the function returns.
     * @param attrs The shared attrs object which is used to populate the normalized attributes.
     * @param {number=} maxPriority Max directive priority.
     */
    function collectDirectives(node, directives, attrs, maxPriority, ignoreDirective) {
      var nodeType = node.nodeType,
          attrsMap = attrs.$attr,
          match,
          className;

      switch(nodeType) {
        case 1: /* Element */
          // use the node name: <directive>
          addDirective(directives,
              directiveNormalize(nodeName_(node).toLowerCase()), 'E', maxPriority, ignoreDirective);

          // iterate over the attributes
          for (var attr, name, nName, ngAttrName, value, nAttrs = node.attributes,
                   j = 0, jj = nAttrs && nAttrs.length; j < jj; j++) {
            var attrStartName = false;
            var attrEndName = false;

            attr = nAttrs[j];
            if (!msie || msie >= 8 || attr.specified) {
              name = attr.name;
              // support ngAttr attribute binding
              ngAttrName = directiveNormalize(name);
              if (NG_ATTR_BINDING.test(ngAttrName)) {
                name = snake_case(ngAttrName.substr(6), '-');
              }

              var directiveNName = ngAttrName.replace(/(Start|End)$/, '');
              if (ngAttrName === directiveNName + 'Start') {
                attrStartName = name;
                attrEndName = name.substr(0, name.length - 5) + 'end';
                name = name.substr(0, name.length - 6);
              }

              nName = directiveNormalize(name.toLowerCase());
              attrsMap[nName] = name;
              attrs[nName] = value = trim((msie && name == 'href')
                ? decodeURIComponent(node.getAttribute(name, 2))
                : attr.value);
              if (getBooleanAttrName(node, nName)) {
                attrs[nName] = true; // presence means true
              }
              addAttrInterpolateDirective(node, directives, value, nName);
              addDirective(directives, nName, 'A', maxPriority, ignoreDirective, attrStartName,
                            attrEndName);
            }
          }

          // use class as directive
          className = node.className;
          if (isString(className) && className !== '') {
            while (match = CLASS_DIRECTIVE_REGEXP.exec(className)) {
              nName = directiveNormalize(match[2]);
              if (addDirective(directives, nName, 'C', maxPriority, ignoreDirective)) {
                attrs[nName] = trim(match[3]);
              }
              className = className.substr(match.index + match[0].length);
            }
          }
          break;
        case 3: /* Text Node */
          addTextInterpolateDirective(directives, node.nodeValue);
          break;
        case 8: /* Comment */
          try {
            match = COMMENT_DIRECTIVE_REGEXP.exec(node.nodeValue);
            if (match) {
              nName = directiveNormalize(match[1]);
              if (addDirective(directives, nName, 'M', maxPriority, ignoreDirective)) {
                attrs[nName] = trim(match[2]);
              }
            }
          } catch (e) {
            // turns out that under some circumstances IE9 throws errors when one attempts to read
            // comment's node value.
            // Just ignore it and continue. (Can't seem to reproduce in test case.)
          }
          break;
      }

      directives.sort(byPriority);
      return directives;
    }

    /**
     * Given a node with an directive-start it collects all of the siblings until it finds
     * directive-end.
     * @param node
     * @param attrStart
     * @param attrEnd
     * @returns {*}
     */
    function groupScan(node, attrStart, attrEnd) {
      var nodes = [];
      var depth = 0;
      if (attrStart && node.hasAttribute && node.hasAttribute(attrStart)) {
        var startNode = node;
        do {
          if (!node) {
            throw $compileMinErr('uterdir',
                      "Unterminated attribute, found '{0}' but no matching '{1}' found.",
                      attrStart, attrEnd);
          }
          if (node.nodeType == 1 /** Element **/) {
            if (node.hasAttribute(attrStart)) depth++;
            if (node.hasAttribute(attrEnd)) depth--;
          }
          nodes.push(node);
          node = node.nextSibling;
        } while (depth > 0);
      } else {
        nodes.push(node);
      }

      return jqLite(nodes);
    }

    /**
     * Wrapper for linking function which converts normal linking function into a grouped
     * linking function.
     * @param linkFn
     * @param attrStart
     * @param attrEnd
     * @returns {Function}
     */
    function groupElementsLinkFnWrapper(linkFn, attrStart, attrEnd) {
      return function(scope, element, attrs, controllers, transcludeFn) {
        element = groupScan(element[0], attrStart, attrEnd);
        return linkFn(scope, element, attrs, controllers, transcludeFn);
      };
    }

    /**
     * Once the directives have been collected, their compile functions are executed. This method
     * is responsible for inlining directive templates as well as terminating the application
     * of the directives if the terminal directive has been reached.
     *
     * @param {Array} directives Array of collected directives to execute their compile function.
     *        this needs to be pre-sorted by priority order.
     * @param {Node} compileNode The raw DOM node to apply the compile functions to
     * @param {Object} templateAttrs The shared attribute function
     * @param {function(angular.Scope[, cloneAttachFn]} transcludeFn A linking function, where the
     *                                                  scope argument is auto-generated to the new
     *                                                  child of the transcluded parent scope.
     * @param {JQLite} jqCollection If we are working on the root of the compile tree then this
     *                              argument has the root jqLite array so that we can replace nodes
     *                              on it.
     * @param {Object=} originalReplaceDirective An optional directive that will be ignored when
     *                                           compiling the transclusion.
     * @param {Array.<Function>} preLinkFns
     * @param {Array.<Function>} postLinkFns
     * @param {Object} previousCompileContext Context used for previous compilation of the current
     *                                        node
     * @returns linkFn
     */
    function applyDirectivesToNode(directives, compileNode, templateAttrs, transcludeFn,
                                   jqCollection, originalReplaceDirective, preLinkFns, postLinkFns,
                                   previousCompileContext) {
      previousCompileContext = previousCompileContext || {};

      var terminalPriority = -Number.MAX_VALUE,
          newScopeDirective,
          controllerDirectives = previousCompileContext.controllerDirectives,
          newIsolateScopeDirective = previousCompileContext.newIsolateScopeDirective,
          templateDirective = previousCompileContext.templateDirective,
          nonTlbTranscludeDirective = previousCompileContext.nonTlbTranscludeDirective,
          hasTranscludeDirective = false,
          hasElementTranscludeDirective = false,
          $compileNode = templateAttrs.$$element = jqLite(compileNode),
          directive,
          directiveName,
          $template,
          replaceDirective = originalReplaceDirective,
          childTranscludeFn = transcludeFn,
          linkFn,
          directiveValue;

      // executes all directives on the current element
      for(var i = 0, ii = directives.length; i < ii; i++) {
        directive = directives[i];
        var attrStart = directive.$$start;
        var attrEnd = directive.$$end;

        // collect multiblock sections
        if (attrStart) {
          $compileNode = groupScan(compileNode, attrStart, attrEnd);
        }
        $template = undefined;

        if (terminalPriority > directive.priority) {
          break; // prevent further processing of directives
        }

        if (directiveValue = directive.scope) {
          newScopeDirective = newScopeDirective || directive;

          // skip the check for directives with async templates, we'll check the derived sync
          // directive when the template arrives
          if (!directive.templateUrl) {
            assertNoDuplicate('new/isolated scope', newIsolateScopeDirective, directive,
                              $compileNode);
            if (isObject(directiveValue)) {
              newIsolateScopeDirective = directive;
            }
          }
        }

        directiveName = directive.name;

        if (!directive.templateUrl && directive.controller) {
          directiveValue = directive.controller;
          controllerDirectives = controllerDirectives || {};
          assertNoDuplicate("'" + directiveName + "' controller",
              controllerDirectives[directiveName], directive, $compileNode);
          controllerDirectives[directiveName] = directive;
        }

        if (directiveValue = directive.transclude) {
          hasTranscludeDirective = true;

          // Special case ngIf and ngRepeat so that we don't complain about duplicate transclusion.
          // This option should only be used by directives that know how to how to safely handle element transclusion,
          // where the transcluded nodes are added or replaced after linking.
          if (!directive.$$tlb) {
            assertNoDuplicate('transclusion', nonTlbTranscludeDirective, directive, $compileNode);
            nonTlbTranscludeDirective = directive;
          }

          if (directiveValue == 'element') {
            hasElementTranscludeDirective = true;
            terminalPriority = directive.priority;
            $template = groupScan(compileNode, attrStart, attrEnd);
            $compileNode = templateAttrs.$$element =
                jqLite(document.createComment(' ' + directiveName + ': ' +
                                              templateAttrs[directiveName] + ' '));
            compileNode = $compileNode[0];
            replaceWith(jqCollection, jqLite(sliceArgs($template)), compileNode);

            childTranscludeFn = compile($template, transcludeFn, terminalPriority,
                                        replaceDirective && replaceDirective.name, {
                                          // Don't pass in:
                                          // - controllerDirectives - otherwise we'll create duplicates controllers
                                          // - newIsolateScopeDirective or templateDirective - combining templates with
                                          //   element transclusion doesn't make sense.
                                          //
                                          // We need only nonTlbTranscludeDirective so that we prevent putting transclusion
                                          // on the same element more than once.
                                          nonTlbTranscludeDirective: nonTlbTranscludeDirective
                                        });
          } else {
            $template = jqLite(jqLiteClone(compileNode)).contents();
            $compileNode.html(''); // clear contents
            childTranscludeFn = compile($template, transcludeFn);
          }
        }

        if (directive.template) {
          assertNoDuplicate('template', templateDirective, directive, $compileNode);
          templateDirective = directive;

          directiveValue = (isFunction(directive.template))
              ? directive.template($compileNode, templateAttrs)
              : directive.template;

          directiveValue = denormalizeTemplate(directiveValue);

          if (directive.replace) {
            replaceDirective = directive;
            $template = jqLite('<div>' +
                                 trim(directiveValue) +
                               '</div>').contents();
            compileNode = $template[0];

            if ($template.length != 1 || compileNode.nodeType !== 1) {
              throw $compileMinErr('tplrt',
                  "Template for directive '{0}' must have exactly one root element. {1}",
                  directiveName, '');
            }

            replaceWith(jqCollection, $compileNode, compileNode);

            var newTemplateAttrs = {$attr: {}};

            // combine directives from the original node and from the template:
            // - take the array of directives for this element
            // - split it into two parts, those that already applied (processed) and those that weren't (unprocessed)
            // - collect directives from the template and sort them by priority
            // - combine directives as: processed + template + unprocessed
            var templateDirectives = collectDirectives(compileNode, [], newTemplateAttrs);
            var unprocessedDirectives = directives.splice(i + 1, directives.length - (i + 1));

            if (newIsolateScopeDirective) {
              markDirectivesAsIsolate(templateDirectives);
            }
            directives = directives.concat(templateDirectives).concat(unprocessedDirectives);
            mergeTemplateAttributes(templateAttrs, newTemplateAttrs);

            ii = directives.length;
          } else {
            $compileNode.html(directiveValue);
          }
        }

        if (directive.templateUrl) {
          assertNoDuplicate('template', templateDirective, directive, $compileNode);
          templateDirective = directive;

          if (directive.replace) {
            replaceDirective = directive;
          }

          nodeLinkFn = compileTemplateUrl(directives.splice(i, directives.length - i), $compileNode,
              templateAttrs, jqCollection, childTranscludeFn, preLinkFns, postLinkFns, {
                controllerDirectives: controllerDirectives,
                newIsolateScopeDirective: newIsolateScopeDirective,
                templateDirective: templateDirective,
                nonTlbTranscludeDirective: nonTlbTranscludeDirective
              });
          ii = directives.length;
        } else if (directive.compile) {
          try {
            linkFn = directive.compile($compileNode, templateAttrs, childTranscludeFn);
            if (isFunction(linkFn)) {
              addLinkFns(null, linkFn, attrStart, attrEnd);
            } else if (linkFn) {
              addLinkFns(linkFn.pre, linkFn.post, attrStart, attrEnd);
            }
          } catch (e) {
            $exceptionHandler(e, startingTag($compileNode));
          }
        }

        if (directive.terminal) {
          nodeLinkFn.terminal = true;
          terminalPriority = Math.max(terminalPriority, directive.priority);
        }

      }

      nodeLinkFn.scope = newScopeDirective && newScopeDirective.scope === true;
      nodeLinkFn.transclude = hasTranscludeDirective && childTranscludeFn;

      // might be normal or delayed nodeLinkFn depending on if templateUrl is present
      return nodeLinkFn;

      ////////////////////

      function addLinkFns(pre, post, attrStart, attrEnd) {
        if (pre) {
          if (attrStart) pre = groupElementsLinkFnWrapper(pre, attrStart, attrEnd);
          pre.require = directive.require;
          if (newIsolateScopeDirective === directive || directive.$$isolateScope) {
            pre = cloneAndAnnotateFn(pre, {isolateScope: true});
          }
          preLinkFns.push(pre);
        }
        if (post) {
          if (attrStart) post = groupElementsLinkFnWrapper(post, attrStart, attrEnd);
          post.require = directive.require;
          if (newIsolateScopeDirective === directive || directive.$$isolateScope) {
            post = cloneAndAnnotateFn(post, {isolateScope: true});
          }
          postLinkFns.push(post);
        }
      }


      function getControllers(require, $element, elementControllers) {
        var value, retrievalMethod = 'data', optional = false;
        if (isString(require)) {
          while((value = require.charAt(0)) == '^' || value == '?') {
            require = require.substr(1);
            if (value == '^') {
              retrievalMethod = 'inheritedData';
            }
            optional = optional || value == '?';
          }
          value = null;

          if (elementControllers && retrievalMethod === 'data') {
            value = elementControllers[require];
          }
          value = value || $element[retrievalMethod]('$' + require + 'Controller');

          if (!value && !optional) {
            throw $compileMinErr('ctreq',
                "Controller '{0}', required by directive '{1}', can't be found!",
                require, directiveName);
          }
          return value;
        } else if (isArray(require)) {
          value = [];
          forEach(require, function(require) {
            value.push(getControllers(require, $element, elementControllers));
          });
        }
        return value;
      }


      function nodeLinkFn(childLinkFn, scope, linkNode, $rootElement, boundTranscludeFn) {
        var attrs, $element, i, ii, linkFn, controller, isolateScope, elementControllers = {}, transcludeFn;

        if (compileNode === linkNode) {
          attrs = templateAttrs;
        } else {
          attrs = shallowCopy(templateAttrs, new Attributes(jqLite(linkNode), templateAttrs.$attr));
        }
        $element = attrs.$$element;

        if (newIsolateScopeDirective) {
          var LOCAL_REGEXP = /^\s*([@=&])(\??)\s*(\w*)\s*$/;
          var $linkNode = jqLite(linkNode);

          isolateScope = scope.$new(true);

          if (templateDirective && (templateDirective === newIsolateScopeDirective.$$originalDirective)) {
            $linkNode.data('$isolateScope', isolateScope) ;
          } else {
            $linkNode.data('$isolateScopeNoTemplate', isolateScope);
          }



          safeAddClass($linkNode, 'ng-isolate-scope');

          forEach(newIsolateScopeDirective.scope, function(definition, scopeName) {
            var match = definition.match(LOCAL_REGEXP) || [],
                attrName = match[3] || scopeName,
                optional = (match[2] == '?'),
                mode = match[1], // @, =, or &
                lastValue,
                parentGet, parentSet;

            isolateScope.$$isolateBindings[scopeName] = mode + attrName;

            switch (mode) {

              case '@':
                attrs.$observe(attrName, function(value) {
                  isolateScope[scopeName] = value;
                });
                attrs.$$observers[attrName].$$scope = scope;
                if( attrs[attrName] ) {
                  // If the attribute has been provided then we trigger an interpolation to ensure
                  // the value is there for use in the link fn
                  isolateScope[scopeName] = $interpolate(attrs[attrName])(scope);
                }
                break;

              case '=':
                if (optional && !attrs[attrName]) {
                  return;
                }
                parentGet = $parse(attrs[attrName]);
                parentSet = parentGet.assign || function() {
                  // reset the change, or we will throw this exception on every $digest
                  lastValue = isolateScope[scopeName] = parentGet(scope);
                  throw $compileMinErr('nonassign',
                      "Expression '{0}' used with directive '{1}' is non-assignable!",
                      attrs[attrName], newIsolateScopeDirective.name);
                };
                lastValue = isolateScope[scopeName] = parentGet(scope);
                isolateScope.$watch(function parentValueWatch() {
                  var parentValue = parentGet(scope);

                  if (parentValue !== isolateScope[scopeName]) {
                    // we are out of sync and need to copy
                    if (parentValue !== lastValue) {
                      // parent changed and it has precedence
                      lastValue = isolateScope[scopeName] = parentValue;
                    } else {
                      // if the parent can be assigned then do so
                      parentSet(scope, parentValue = lastValue = isolateScope[scopeName]);
                    }
                  }
                  return parentValue;
                });
                break;

              case '&':
                parentGet = $parse(attrs[attrName]);
                isolateScope[scopeName] = function(locals) {
                  return parentGet(scope, locals);
                };
                break;

              default:
                throw $compileMinErr('iscp',
                    "Invalid isolate scope definition for directive '{0}'." +
                    " Definition: {... {1}: '{2}' ...}",
                    newIsolateScopeDirective.name, scopeName, definition);
            }
          });
        }
        transcludeFn = boundTranscludeFn && controllersBoundTransclude;
        if (controllerDirectives) {
          forEach(controllerDirectives, function(directive) {
            var locals = {
              $scope: directive === newIsolateScopeDirective || directive.$$isolateScope ? isolateScope : scope,
              $element: $element,
              $attrs: attrs,
              $transclude: transcludeFn
            }, controllerInstance;

            controller = directive.controller;
            if (controller == '@') {
              controller = attrs[directive.name];
            }

            controllerInstance = $controller(controller, locals);
            // For directives with element transclusion the element is a comment,
            // but jQuery .data doesn't support attaching data to comment nodes as it's hard to
            // clean up (http://bugs.jquery.com/ticket/8335).
            // Instead, we save the controllers for the element in a local hash and attach to .data
            // later, once we have the actual element.
            elementControllers[directive.name] = controllerInstance;
            if (!hasElementTranscludeDirective) {
              $element.data('$' + directive.name + 'Controller', controllerInstance);
            }

            if (directive.controllerAs) {
              locals.$scope[directive.controllerAs] = controllerInstance;
            }
          });
        }

        // PRELINKING
        for(i = 0, ii = preLinkFns.length; i < ii; i++) {
          try {
            linkFn = preLinkFns[i];
            linkFn(linkFn.isolateScope ? isolateScope : scope, $element, attrs,
                linkFn.require && getControllers(linkFn.require, $element, elementControllers), transcludeFn);
          } catch (e) {
            $exceptionHandler(e, startingTag($element));
          }
        }

        // RECURSION
        // We only pass the isolate scope, if the isolate directive has a template,
        // otherwise the child elements do not belong to the isolate directive.
        var scopeToChild = scope;
        if (newIsolateScopeDirective && (newIsolateScopeDirective.template || newIsolateScopeDirective.templateUrl === null)) {
          scopeToChild = isolateScope;
        }
        childLinkFn && childLinkFn(scopeToChild, linkNode.childNodes, undefined, boundTranscludeFn);

        // POSTLINKING
        for(i = postLinkFns.length - 1; i >= 0; i--) {
          try {
            linkFn = postLinkFns[i];
            linkFn(linkFn.isolateScope ? isolateScope : scope, $element, attrs,
                linkFn.require && getControllers(linkFn.require, $element, elementControllers), transcludeFn);
          } catch (e) {
            $exceptionHandler(e, startingTag($element));
          }
        }

        // This is the function that is injected as `$transclude`.
        function controllersBoundTransclude(scope, cloneAttachFn) {
          var transcludeControllers;

          // no scope passed
          if (arguments.length < 2) {
            cloneAttachFn = scope;
            scope = undefined;
          }

          if (hasElementTranscludeDirective) {
            transcludeControllers = elementControllers;
          }

          return boundTranscludeFn(scope, cloneAttachFn, transcludeControllers);
        }
      }
    }

    function markDirectivesAsIsolate(directives) {
      // mark all directives as needing isolate scope.
      for (var j = 0, jj = directives.length; j < jj; j++) {
        directives[j] = inherit(directives[j], {$$isolateScope: true});
      }
    }

    /**
     * looks up the directive and decorates it with exception handling and proper parameters. We
     * call this the boundDirective.
     *
     * @param {string} name name of the directive to look up.
     * @param {string} location The directive must be found in specific format.
     *   String containing any of theses characters:
     *
     *   * `E`: element name
     *   * `A': attribute
     *   * `C`: class
     *   * `M`: comment
     * @returns true if directive was added.
     */
    function addDirective(tDirectives, name, location, maxPriority, ignoreDirective, startAttrName,
                          endAttrName) {
      if (name === ignoreDirective) return null;
      var match = null;
      if (hasDirectives.hasOwnProperty(name)) {
        for(var directive, directives = $injector.get(name + Suffix),
            i = 0, ii = directives.length; i<ii; i++) {
          try {
            directive = directives[i];
            if ( (maxPriority === undefined || maxPriority > directive.priority) &&
                 directive.restrict.indexOf(location) != -1) {
              if (startAttrName) {
                directive = inherit(directive, {$$start: startAttrName, $$end: endAttrName});
              }
              tDirectives.push(directive);
              match = directive;
            }
          } catch(e) { $exceptionHandler(e); }
        }
      }
      return match;
    }


    /**
     * When the element is replaced with HTML template then the new attributes
     * on the template need to be merged with the existing attributes in the DOM.
     * The desired effect is to have both of the attributes present.
     *
     * @param {object} dst destination attributes (original DOM)
     * @param {object} src source attributes (from the directive template)
     */
    function mergeTemplateAttributes(dst, src) {
      var srcAttr = src.$attr,
          dstAttr = dst.$attr,
          $element = dst.$$element;

      // reapply the old attributes to the new element
      forEach(dst, function(value, key) {
        if (key.charAt(0) != '$') {
          if (src[key]) {
            value += (key === 'style' ? ';' : ' ') + src[key];
          }
          dst.$set(key, value, true, srcAttr[key]);
        }
      });

      // copy the new attributes on the old attrs object
      forEach(src, function(value, key) {
        if (key == 'class') {
          safeAddClass($element, value);
          dst['class'] = (dst['class'] ? dst['class'] + ' ' : '') + value;
        } else if (key == 'style') {
          $element.attr('style', $element.attr('style') + ';' + value);
          dst['style'] = (dst['style'] ? dst['style'] + ';' : '') + value;
          // `dst` will never contain hasOwnProperty as DOM parser won't let it.
          // You will get an "InvalidCharacterError: DOM Exception 5" error if you
          // have an attribute like "has-own-property" or "data-has-own-property", etc.
        } else if (key.charAt(0) != '$' && !dst.hasOwnProperty(key)) {
          dst[key] = value;
          dstAttr[key] = srcAttr[key];
        }
      });
    }


    function compileTemplateUrl(directives, $compileNode, tAttrs,
        $rootElement, childTranscludeFn, preLinkFns, postLinkFns, previousCompileContext) {
      var linkQueue = [],
          afterTemplateNodeLinkFn,
          afterTemplateChildLinkFn,
          beforeTemplateCompileNode = $compileNode[0],
          origAsyncDirective = directives.shift(),
          // The fact that we have to copy and patch the directive seems wrong!
          derivedSyncDirective = extend({}, origAsyncDirective, {
            templateUrl: null, transclude: null, replace: null, $$originalDirective: origAsyncDirective
          }),
          templateUrl = (isFunction(origAsyncDirective.templateUrl))
              ? origAsyncDirective.templateUrl($compileNode, tAttrs)
              : origAsyncDirective.templateUrl;

      $compileNode.html('');

      $http.get($sce.getTrustedResourceUrl(templateUrl), {cache: $templateCache}).
        success(function(content) {
          var compileNode, tempTemplateAttrs, $template, childBoundTranscludeFn;

          content = denormalizeTemplate(content);

          if (origAsyncDirective.replace) {
            $template = jqLite('<div>' + trim(content) + '</div>').contents();
            compileNode = $template[0];

            if ($template.length != 1 || compileNode.nodeType !== 1) {
              throw $compileMinErr('tplrt',
                  "Template for directive '{0}' must have exactly one root element. {1}",
                  origAsyncDirective.name, templateUrl);
            }

            tempTemplateAttrs = {$attr: {}};
            replaceWith($rootElement, $compileNode, compileNode);
            var templateDirectives = collectDirectives(compileNode, [], tempTemplateAttrs);

            if (isObject(origAsyncDirective.scope)) {
              markDirectivesAsIsolate(templateDirectives);
            }
            directives = templateDirectives.concat(directives);
            mergeTemplateAttributes(tAttrs, tempTemplateAttrs);
          } else {
            compileNode = beforeTemplateCompileNode;
            $compileNode.html(content);
          }

          directives.unshift(derivedSyncDirective);

          afterTemplateNodeLinkFn = applyDirectivesToNode(directives, compileNode, tAttrs,
              childTranscludeFn, $compileNode, origAsyncDirective, preLinkFns, postLinkFns,
              previousCompileContext);
          forEach($rootElement, function(node, i) {
            if (node == compileNode) {
              $rootElement[i] = $compileNode[0];
            }
          });
          afterTemplateChildLinkFn = compileNodes($compileNode[0].childNodes, childTranscludeFn);


          while(linkQueue.length) {
            var scope = linkQueue.shift(),
                beforeTemplateLinkNode = linkQueue.shift(),
                linkRootElement = linkQueue.shift(),
                boundTranscludeFn = linkQueue.shift(),
                linkNode = $compileNode[0];

            if (beforeTemplateLinkNode !== beforeTemplateCompileNode) {
              // it was cloned therefore we have to clone as well.
              linkNode = jqLiteClone(compileNode);
              replaceWith(linkRootElement, jqLite(beforeTemplateLinkNode), linkNode);
            }
            if (afterTemplateNodeLinkFn.transclude) {
              childBoundTranscludeFn = createBoundTranscludeFn(scope, afterTemplateNodeLinkFn.transclude);
            } else {
              childBoundTranscludeFn = boundTranscludeFn;
            }
            afterTemplateNodeLinkFn(afterTemplateChildLinkFn, scope, linkNode, $rootElement,
              childBoundTranscludeFn);
          }
          linkQueue = null;
        }).
        error(function(response, code, headers, config) {
          throw $compileMinErr('tpload', 'Failed to load template: {0}', config.url);
        });

      return function delayedNodeLinkFn(ignoreChildLinkFn, scope, node, rootElement, boundTranscludeFn) {
        if (linkQueue) {
          linkQueue.push(scope);
          linkQueue.push(node);
          linkQueue.push(rootElement);
          linkQueue.push(boundTranscludeFn);
        } else {
          afterTemplateNodeLinkFn(afterTemplateChildLinkFn, scope, node, rootElement, boundTranscludeFn);
        }
      };
    }


    /**
     * Sorting function for bound directives.
     */
    function byPriority(a, b) {
      var diff = b.priority - a.priority;
      if (diff !== 0) return diff;
      if (a.name !== b.name) return (a.name < b.name) ? -1 : 1;
      return a.index - b.index;
    }


    function assertNoDuplicate(what, previousDirective, directive, element) {
      if (previousDirective) {
        throw $compileMinErr('multidir', 'Multiple directives [{0}, {1}] asking for {2} on: {3}',
            previousDirective.name, directive.name, what, startingTag(element));
      }
    }


    function addTextInterpolateDirective(directives, text) {
      var interpolateFn = $interpolate(text, true);
      if (interpolateFn) {
        directives.push({
          priority: 0,
          compile: valueFn(function textInterpolateLinkFn(scope, node) {
            var parent = node.parent(),
                bindings = parent.data('$binding') || [];
            bindings.push(interpolateFn);
            safeAddClass(parent.data('$binding', bindings), 'ng-binding');
            scope.$watch(interpolateFn, function interpolateFnWatchAction(value) {
              node[0].nodeValue = value;
            });
          })
        });
      }
    }


    function getTrustedContext(node, attrNormalizedName) {
      // maction[xlink:href] can source SVG.  It's not limited to <maction>.
      if (attrNormalizedName == "xlinkHref" ||
          (nodeName_(node) != "IMG" && (attrNormalizedName == "src" ||
                                        attrNormalizedName == "ngSrc"))) {
        return $sce.RESOURCE_URL;
      }
    }


    function addAttrInterpolateDirective(node, directives, value, name) {
      var interpolateFn = $interpolate(value, true);

      // no interpolation found -> ignore
      if (!interpolateFn) return;


      if (name === "multiple" && nodeName_(node) === "SELECT") {
        throw $compileMinErr("selmulti",
            "Binding to the 'multiple' attribute is not supported. Element: {0}",
            startingTag(node));
      }

      directives.push({
        priority: 100,
        compile: function() {
            return {
              pre: function attrInterpolatePreLinkFn(scope, element, attr) {
                var $$observers = (attr.$$observers || (attr.$$observers = {}));

                if (EVENT_HANDLER_ATTR_REGEXP.test(name)) {
                  throw $compileMinErr('nodomevents',
                      "Interpolations for HTML DOM event attributes are disallowed.  Please use the " +
                          "ng- versions (such as ng-click instead of onclick) instead.");
                }

                // we need to interpolate again, in case the attribute value has been updated
                // (e.g. by another directive's compile function)
                interpolateFn = $interpolate(attr[name], true, getTrustedContext(node, name));

                // if attribute was updated so that there is no interpolation going on we don't want to
                // register any observers
                if (!interpolateFn) return;

                // TODO(i): this should likely be attr.$set(name, iterpolateFn(scope) so that we reset the
                // actual attr value
                attr[name] = interpolateFn(scope);
                ($$observers[name] || ($$observers[name] = [])).$$inter = true;
                (attr.$$observers && attr.$$observers[name].$$scope || scope).
                    $watch(interpolateFn, function interpolateFnWatchAction(value) {
                      attr.$set(name, value);
                    });
              }
            };
          }
      });
    }


    /**
     * This is a special jqLite.replaceWith, which can replace items which
     * have no parents, provided that the containing jqLite collection is provided.
     *
     * @param {JqLite=} $rootElement The root of the compile tree. Used so that we can replace nodes
     *                               in the root of the tree.
     * @param {JqLite} elementsToRemove The jqLite element which we are going to replace. We keep
     *                                  the shell, but replace its DOM node reference.
     * @param {Node} newNode The new DOM node.
     */
    function replaceWith($rootElement, elementsToRemove, newNode) {
      var firstElementToRemove = elementsToRemove[0],
          removeCount = elementsToRemove.length,
          parent = firstElementToRemove.parentNode,
          i, ii;

      if ($rootElement) {
        for(i = 0, ii = $rootElement.length; i < ii; i++) {
          if ($rootElement[i] == firstElementToRemove) {
            $rootElement[i++] = newNode;
            for (var j = i, j2 = j + removeCount - 1,
                     jj = $rootElement.length;
                 j < jj; j++, j2++) {
              if (j2 < jj) {
                $rootElement[j] = $rootElement[j2];
              } else {
                delete $rootElement[j];
              }
            }
            $rootElement.length -= removeCount - 1;
            break;
          }
        }
      }

      if (parent) {
        parent.replaceChild(newNode, firstElementToRemove);
      }
      var fragment = document.createDocumentFragment();
      fragment.appendChild(firstElementToRemove);
      newNode[jqLite.expando] = firstElementToRemove[jqLite.expando];
      for (var k = 1, kk = elementsToRemove.length; k < kk; k++) {
        var element = elementsToRemove[k];
        jqLite(element).remove(); // must do this way to clean up expando
        fragment.appendChild(element);
        delete elementsToRemove[k];
      }

      elementsToRemove[0] = newNode;
      elementsToRemove.length = 1;
    }


    function cloneAndAnnotateFn(fn, annotation) {
      return extend(function() { return fn.apply(null, arguments); }, fn, annotation);
    }
  }];
}

var PREFIX_REGEXP = /^(x[\:\-_]|data[\:\-_])/i;
/**
 * Converts all accepted directives format into proper directive name.
 * All of these will become 'myDirective':
 *   my:Directive
 *   my-directive
 *   x-my-directive
 *   data-my:directive
 *
 * Also there is special case for Moz prefix starting with upper case letter.
 * @param name Name to normalize
 */
function directiveNormalize(name) {
  return camelCase(name.replace(PREFIX_REGEXP, ''));
}

/**
 * @ngdoc object
 * @name ng.$compile.directive.Attributes
 *
 * @description
 * A shared object between directive compile / linking functions which contains normalized DOM
 * element attributes. The values reflect current binding state `{{ }}`. The normalization is
 * needed since all of these are treated as equivalent in Angular:
 *
 *    <span ng:bind="a" ng-bind="a" data-ng-bind="a" x-ng-bind="a">
 */

/**
 * @ngdoc property
 * @name ng.$compile.directive.Attributes#$attr
 * @propertyOf ng.$compile.directive.Attributes
 * @returns {object} A map of DOM element attribute names to the normalized name. This is
 *                   needed to do reverse lookup from normalized name back to actual name.
 */


/**
 * @ngdoc function
 * @name ng.$compile.directive.Attributes#$set
 * @methodOf ng.$compile.directive.Attributes
 * @function
 *
 * @description
 * Set DOM element attribute value.
 *
 *
 * @param {string} name Normalized element attribute name of the property to modify. The name is
 *          revers translated using the {@link ng.$compile.directive.Attributes#$attr $attr}
 *          property to the original name.
 * @param {string} value Value to set the attribute to. The value can be an interpolated string.
 */



/**
 * Closure compiler type information
 */

function nodesetLinkingFn(
  /* angular.Scope */ scope,
  /* NodeList */ nodeList,
  /* Element */ rootElement,
  /* function(Function) */ boundTranscludeFn
){}

function directiveLinkingFn(
  /* nodesetLinkingFn */ nodesetLinkingFn,
  /* angular.Scope */ scope,
  /* Node */ node,
  /* Element */ rootElement,
  /* function(Function) */ boundTranscludeFn
){}

/**
 * @ngdoc object
 * @name ng.$controllerProvider
 * @description
 * The {@link ng.$controller $controller service} is used by Angular to create new
 * controllers.
 *
 * This provider allows controller registration via the
 * {@link ng.$controllerProvider#methods_register register} method.
 */
function $ControllerProvider() {
  var controllers = {},
      CNTRL_REG = /^(\S+)(\s+as\s+(\w+))?$/;


  /**
   * @ngdoc function
   * @name ng.$controllerProvider#register
   * @methodOf ng.$controllerProvider
   * @param {string|Object} name Controller name, or an object map of controllers where the keys are
   *    the names and the values are the constructors.
   * @param {Function|Array} constructor Controller constructor fn (optionally decorated with DI
   *    annotations in the array notation).
   */
  this.register = function(name, constructor) {
    assertNotHasOwnProperty(name, 'controller');
    if (isObject(name)) {
      extend(controllers, name);
    } else {
      controllers[name] = constructor;
    }
  };


  this.$get = ['$injector', '$window', function($injector, $window) {

    /**
     * @ngdoc function
     * @name ng.$controller
     * @requires $injector
     *
     * @param {Function|string} constructor If called with a function then it's considered to be the
     *    controller constructor function. Otherwise it's considered to be a string which is used
     *    to retrieve the controller constructor using the following steps:
     *
     *    * check if a controller with given name is registered via `$controllerProvider`
     *    * check if evaluating the string on the current scope returns a constructor
     *    * check `window[constructor]` on the global `window` object
     *
     * @param {Object} locals Injection locals for Controller.
     * @return {Object} Instance of given controller.
     *
     * @description
     * `$controller` service is responsible for instantiating controllers.
     *
     * It's just a simple call to {@link AUTO.$injector $injector}, but extracted into
     * a service, so that one can override this service with {@link https://gist.github.com/1649788
     * BC version}.
     */
    return function(expression, locals) {
      var instance, match, constructor, identifier;

      if(isString(expression)) {
        match = expression.match(CNTRL_REG),
        constructor = match[1],
        identifier = match[3];
        expression = controllers.hasOwnProperty(constructor)
            ? controllers[constructor]
            : getter(locals.$scope, constructor, true) || getter($window, constructor, true);

        assertArgFn(expression, constructor, true);
      }

      instance = $injector.instantiate(expression, locals);

      if (identifier) {
        if (!(locals && typeof locals.$scope == 'object')) {
          throw minErr('$controller')('noscp',
              "Cannot export controller '{0}' as '{1}'! No $scope object provided via `locals`.",
              constructor || expression.name, identifier);
        }

        locals.$scope[identifier] = instance;
      }

      return instance;
    };
  }];
}

/**
 * @ngdoc object
 * @name ng.$document
 * @requires $window
 *
 * @description
 * A {@link angular.element jQuery (lite)}-wrapped reference to the browser's `window.document`
 * element.
 */
function $DocumentProvider(){
  this.$get = ['$window', function(window){
    return jqLite(window.document);
  }];
}

/**
 * @ngdoc function
 * @name ng.$exceptionHandler
 * @requires $log
 *
 * @description
 * Any uncaught exception in angular expressions is delegated to this service.
 * The default implementation simply delegates to `$log.error` which logs it into
 * the browser console.
 * 
 * In unit tests, if `angular-mocks.js` is loaded, this service is overridden by
 * {@link ngMock.$exceptionHandler mock $exceptionHandler} which aids in testing.
 *
 * ## Example:
 * 
 * <pre>
 *   angular.module('exceptionOverride', []).factory('$exceptionHandler', function () {
 *     return function (exception, cause) {
 *       exception.message += ' (caused by "' + cause + '")';
 *       throw exception;
 *     };
 *   });
 * </pre>
 * 
 * This example will override the normal action of `$exceptionHandler`, to make angular
 * exceptions fail hard when they happen, instead of just logging to the console.
 *
 * @param {Error} exception Exception associated with the error.
 * @param {string=} cause optional information about the context in which
 *       the error was thrown.
 *
 */
function $ExceptionHandlerProvider() {
  this.$get = ['$log', function($log) {
    return function(exception, cause) {
      $log.error.apply($log, arguments);
    };
  }];
}

/**
 * Parse headers into key value object
 *
 * @param {string} headers Raw headers as a string
 * @returns {Object} Parsed headers as key value object
 */
function parseHeaders(headers) {
  var parsed = {}, key, val, i;

  if (!headers) return parsed;

  forEach(headers.split('\n'), function(line) {
    i = line.indexOf(':');
    key = lowercase(trim(line.substr(0, i)));
    val = trim(line.substr(i + 1));

    if (key) {
      if (parsed[key]) {
        parsed[key] += ', ' + val;
      } else {
        parsed[key] = val;
      }
    }
  });

  return parsed;
}


/**
 * Returns a function that provides access to parsed headers.
 *
 * Headers are lazy parsed when first requested.
 * @see parseHeaders
 *
 * @param {(string|Object)} headers Headers to provide access to.
 * @returns {function(string=)} Returns a getter function which if called with:
 *
 *   - if called with single an argument returns a single header value or null
 *   - if called with no arguments returns an object containing all headers.
 */
function headersGetter(headers) {
  var headersObj = isObject(headers) ? headers : undefined;

  return function(name) {
    if (!headersObj) headersObj =  parseHeaders(headers);

    if (name) {
      return headersObj[lowercase(name)] || null;
    }

    return headersObj;
  };
}


/**
 * Chain all given functions
 *
 * This function is used for both request and response transforming
 *
 * @param {*} data Data to transform.
 * @param {function(string=)} headers Http headers getter fn.
 * @param {(function|Array.<function>)} fns Function or an array of functions.
 * @returns {*} Transformed data.
 */
function transformData(data, headers, fns) {
  if (isFunction(fns))
    return fns(data, headers);

  forEach(fns, function(fn) {
    data = fn(data, headers);
  });

  return data;
}


function isSuccess(status) {
  return 200 <= status && status < 300;
}


function $HttpProvider() {
  var JSON_START = /^\s*(\[|\{[^\{])/,
      JSON_END = /[\}\]]\s*$/,
      PROTECTION_PREFIX = /^\)\]\}',?\n/,
      CONTENT_TYPE_APPLICATION_JSON = {'Content-Type': 'application/json;charset=utf-8'};

  var defaults = this.defaults = {
    // transform incoming response data
    transformResponse: [function(data) {
      if (isString(data)) {
        // strip json vulnerability protection prefix
        data = data.replace(PROTECTION_PREFIX, '');
        if (JSON_START.test(data) && JSON_END.test(data))
          data = fromJson(data);
      }
      return data;
    }],

    // transform outgoing request data
    transformRequest: [function(d) {
      return isObject(d) && !isFile(d) ? toJson(d) : d;
    }],

    // default headers
    headers: {
      common: {
        'Accept': 'application/json, text/plain, */*'
      },
      post:   CONTENT_TYPE_APPLICATION_JSON,
      put:    CONTENT_TYPE_APPLICATION_JSON,
      patch:  CONTENT_TYPE_APPLICATION_JSON
    },

    xsrfCookieName: 'XSRF-TOKEN',
    xsrfHeaderName: 'X-XSRF-TOKEN'
  };

  /**
   * Are ordered by request, i.e. they are applied in the same order as the
   * array, on request, but reverse order, on response.
   */
  var interceptorFactories = this.interceptors = [];

  /**
   * For historical reasons, response interceptors are ordered by the order in which
   * they are applied to the response. (This is the opposite of interceptorFactories)
   */
  var responseInterceptorFactories = this.responseInterceptors = [];

  this.$get = ['$httpBackend', '$browser', '$cacheFactory', '$rootScope', '$q', '$injector',
      function($httpBackend, $browser, $cacheFactory, $rootScope, $q, $injector) {

    var defaultCache = $cacheFactory('$http');

    /**
     * Interceptors stored in reverse order. Inner interceptors before outer interceptors.
     * The reversal is needed so that we can build up the interception chain around the
     * server request.
     */
    var reversedInterceptors = [];

    forEach(interceptorFactories, function(interceptorFactory) {
      reversedInterceptors.unshift(isString(interceptorFactory)
          ? $injector.get(interceptorFactory) : $injector.invoke(interceptorFactory));
    });

    forEach(responseInterceptorFactories, function(interceptorFactory, index) {
      var responseFn = isString(interceptorFactory)
          ? $injector.get(interceptorFactory)
          : $injector.invoke(interceptorFactory);

      /**
       * Response interceptors go before "around" interceptors (no real reason, just
       * had to pick one.) But they are already reversed, so we can't use unshift, hence
       * the splice.
       */
      reversedInterceptors.splice(index, 0, {
        response: function(response) {
          return responseFn($q.when(response));
        },
        responseError: function(response) {
          return responseFn($q.reject(response));
        }
      });
    });


    /**
     * @ngdoc function
     * @name ng.$http
     * @requires $httpBackend
     * @requires $browser
     * @requires $cacheFactory
     * @requires $rootScope
     * @requires $q
     * @requires $injector
     *
     * @description
     * The `$http` service is a core Angular service that facilitates communication with the remote
     * HTTP servers via the browser's {@link https://developer.mozilla.org/en/xmlhttprequest
     * XMLHttpRequest} object or via {@link http://en.wikipedia.org/wiki/JSONP JSONP}.
     *
     * For unit testing applications that use `$http` service, see
     * {@link ngMock.$httpBackend $httpBackend mock}.
     *
     * For a higher level of abstraction, please check out the {@link ngResource.$resource
     * $resource} service.
     *
     * The $http API is based on the {@link ng.$q deferred/promise APIs} exposed by
     * the $q service. While for simple usage patterns this doesn't matter much, for advanced usage
     * it is important to familiarize yourself with these APIs and the guarantees they provide.
     *
     *
     * # General usage
     * The `$http` service is a function which takes a single argument — a configuration object —
     * that is used to generate an HTTP request and returns  a {@link ng.$q promise}
     * with two $http specific methods: `success` and `error`.
     *
     * <pre>
     *   $http({method: 'GET', url: '/someUrl'}).
     *     success(function(data, status, headers, config) {
     *       // this callback will be called asynchronously
     *       // when the response is available
     *     }).
     *     error(function(data, status, headers, config) {
     *       // called asynchronously if an error occurs
     *       // or server returns response with an error status.
     *     });
     * </pre>
     *
     * Since the returned value of calling the $http function is a `promise`, you can also use
     * the `then` method to register callbacks, and these callbacks will receive a single argument –
     * an object representing the response. See the API signature and type info below for more
     * details.
     *
     * A response status code between 200 and 299 is considered a success status and
     * will result in the success callback being called. Note that if the response is a redirect,
     * XMLHttpRequest will transparently follow it, meaning that the error callback will not be
     * called for such responses.
     * 
     * # Calling $http from outside AngularJS
     * The `$http` service will not actually send the request until the next `$digest()` is
     * executed. Normally this is not an issue, since almost all the time your call to `$http` will
     * be from within a `$apply()` block.
     * If you are calling `$http` from outside Angular, then you should wrap it in a call to
     * `$apply` to cause a $digest to occur and also to handle errors in the block correctly.
     *
     * ```
     * $scope.$apply(function() {
     *   $http(...);
     * });
     * ```
     *
     * # Writing Unit Tests that use $http
     * When unit testing you are mostly responsible for scheduling the `$digest` cycle. If you do
     * not trigger a `$digest` before calling `$httpBackend.flush()` then the request will not have
     * been made and `$httpBackend.expect(...)` expectations will fail.  The solution is to run the
     * code that calls the `$http()` method inside a $apply block as explained in the previous
     * section.
     *
     * ```
     * $httpBackend.expectGET(...);
     * $scope.$apply(function() {
     *   $http.get(...);
     * });
     * $httpBackend.flush();
     * ```
     *
     * # Shortcut methods
     *
     * Since all invocations of the $http service require passing in an HTTP method and URL, and
     * POST/PUT requests require request data to be provided as well, shortcut methods
     * were created:
     *
     * <pre>
     *   $http.get('/someUrl').success(successCallback);
     *   $http.post('/someUrl', data).success(successCallback);
     * </pre>
     *
     * Complete list of shortcut methods:
     *
     * - {@link ng.$http#methods_get $http.get}
     * - {@link ng.$http#methods_head $http.head}
     * - {@link ng.$http#methods_post $http.post}
     * - {@link ng.$http#methods_put $http.put}
     * - {@link ng.$http#methods_delete $http.delete}
     * - {@link ng.$http#methods_jsonp $http.jsonp}
     *
     *
     * # Setting HTTP Headers
     *
     * The $http service will automatically add certain HTTP headers to all requests. These defaults
     * can be fully configured by accessing the `$httpProvider.defaults.headers` configuration
     * object, which currently contains this default configuration:
     *
     * - `$httpProvider.defaults.headers.common` (headers that are common for all requests):
     *   - `Accept: application/json, text/plain, * / *`
     * - `$httpProvider.defaults.headers.post`: (header defaults for POST requests)
     *   - `Content-Type: application/json`
     * - `$httpProvider.defaults.headers.put` (header defaults for PUT requests)
     *   - `Content-Type: application/json`
     *
     * To add or overwrite these defaults, simply add or remove a property from these configuration
     * objects. To add headers for an HTTP method other than POST or PUT, simply add a new object
     * with the lowercased HTTP method name as the key, e.g.
     * `$httpProvider.defaults.headers.get = { 'My-Header' : 'value' }.
     *
     * The defaults can also be set at runtime via the `$http.defaults` object in the same
     * fashion. In addition, you can supply a `headers` property in the config object passed when
     * calling `$http(config)`, which overrides the defaults without changing them globally.
     *
     *
     * # Transforming Requests and Responses
     *
     * Both requests and responses can be transformed using transform functions. By default, Angular
     * applies these transformations:
     *
     * Request transformations:
     *
     * - If the `data` property of the request configuration object contains an object, serialize it
     *   into JSON format.
     *
     * Response transformations:
     *
     *  - If XSRF prefix is detected, strip it (see Security Considerations section below).
     *  - If JSON response is detected, deserialize it using a JSON parser.
     *
     * To globally augment or override the default transforms, modify the
     * `$httpProvider.defaults.transformRequest` and `$httpProvider.defaults.transformResponse`
     * properties. These properties are by default an array of transform functions, which allows you
     * to `push` or `unshift` a new transformation function into the transformation chain. You can
     * also decide to completely override any default transformations by assigning your
     * transformation functions to these properties directly without the array wrapper.
     *
     * Similarly, to locally override the request/response transforms, augment the
     * `transformRequest` and/or `transformResponse` properties of the configuration object passed
     * into `$http`.
     *
     *
     * # Caching
     *
     * To enable caching, set the request configuration `cache` property to `true` (to use default
     * cache) or to a custom cache object (built with {@link ng.$cacheFactory `$cacheFactory`}).
     * When the cache is enabled, `$http` stores the response from the server in the specified
     * cache. The next time the same request is made, the response is served from the cache without
     * sending a request to the server.
     *
     * Note that even if the response is served from cache, delivery of the data is asynchronous in
     * the same way that real requests are.
     *
     * If there are multiple GET requests for the same URL that should be cached using the same
     * cache, but the cache is not populated yet, only one request to the server will be made and
     * the remaining requests will be fulfilled using the response from the first request.
     *
     * You can change the default cache to a new object (built with
     * {@link ng.$cacheFactory `$cacheFactory`}) by updating the
     * {@link ng.$http#properties_defaults `$http.defaults.cache`} property. All requests who set
     * their `cache` property to `true` will now use this cache object.
     *
     * If you set the default cache to `false` then only requests that specify their own custom
     * cache object will be cached.
     *
     * # Interceptors
     *
     * Before you start creating interceptors, be sure to understand the
     * {@link ng.$q $q and deferred/promise APIs}.
     *
     * For purposes of global error handling, authentication, or any kind of synchronous or
     * asynchronous pre-processing of request or postprocessing of responses, it is desirable to be
     * able to intercept requests before they are handed to the server and
     * responses before they are handed over to the application code that
     * initiated these requests. The interceptors leverage the {@link ng.$q
     * promise APIs} to fulfill this need for both synchronous and asynchronous pre-processing.
     *
     * The interceptors are service factories that are registered with the `$httpProvider` by
     * adding them to the `$httpProvider.interceptors` array. The factory is called and
     * injected with dependencies (if specified) and returns the interceptor.
     *
     * There are two kinds of interceptors (and two kinds of rejection interceptors):
     *
     *   * `request`: interceptors get called with http `config` object. The function is free to
     *     modify the `config` or create a new one. The function needs to return the `config`
     *     directly or as a promise.
     *   * `requestError`: interceptor gets called when a previous interceptor threw an error or
     *     resolved with a rejection.
     *   * `response`: interceptors get called with http `response` object. The function is free to
     *     modify the `response` or create a new one. The function needs to return the `response`
     *     directly or as a promise.
     *   * `responseError`: interceptor gets called when a previous interceptor threw an error or
     *     resolved with a rejection.
     *
     *
     * <pre>
     *   // register the interceptor as a service
     *   $provide.factory('myHttpInterceptor', function($q, dependency1, dependency2) {
     *     return {
     *       // optional method
     *       'request': function(config) {
     *         // do something on success
     *         return config || $q.when(config);
     *       },
     *
     *       // optional method
     *      'requestError': function(rejection) {
     *         // do something on error
     *         if (canRecover(rejection)) {
     *           return responseOrNewPromise
     *         }
     *         return $q.reject(rejection);
     *       },
     *
     *
     *
     *       // optional method
     *       'response': function(response) {
     *         // do something on success
     *         return response || $q.when(response);
     *       },
     *
     *       // optional method
     *      'responseError': function(rejection) {
     *         // do something on error
     *         if (canRecover(rejection)) {
     *           return responseOrNewPromise
     *         }
     *         return $q.reject(rejection);
     *       };
     *     }
     *   });
     *
     *   $httpProvider.interceptors.push('myHttpInterceptor');
     *
     *
     *   // register the interceptor via an anonymous factory
     *   $httpProvider.interceptors.push(function($q, dependency1, dependency2) {
     *     return {
     *      'request': function(config) {
     *          // same as above
     *       },
     *       'response': function(response) {
     *          // same as above
     *       }
     *     };
     *   });
     * </pre>
     *
     * # Response interceptors (DEPRECATED)
     *
     * Before you start creating interceptors, be sure to understand the
     * {@link ng.$q $q and deferred/promise APIs}.
     *
     * For purposes of global error handling, authentication or any kind of synchronous or
     * asynchronous preprocessing of received responses, it is desirable to be able to intercept
     * responses for http requests before they are handed over to the application code that
     * initiated these requests. The response interceptors leverage the {@link ng.$q
     * promise apis} to fulfil this need for both synchronous and asynchronous preprocessing.
     *
     * The interceptors are service factories that are registered with the $httpProvider by
     * adding them to the `$httpProvider.responseInterceptors` array. The factory is called and
     * injected with dependencies (if specified) and returns the interceptor  — a function that
     * takes a {@link ng.$q promise} and returns the original or a new promise.
     *
     * <pre>
     *   // register the interceptor as a service
     *   $provide.factory('myHttpInterceptor', function($q, dependency1, dependency2) {
     *     return function(promise) {
     *       return promise.then(function(response) {
     *         // do something on success
     *         return response;
     *       }, function(response) {
     *         // do something on error
     *         if (canRecover(response)) {
     *           return responseOrNewPromise
     *         }
     *         return $q.reject(response);
     *       });
     *     }
     *   });
     *
     *   $httpProvider.responseInterceptors.push('myHttpInterceptor');
     *
     *
     *   // register the interceptor via an anonymous factory
     *   $httpProvider.responseInterceptors.push(function($q, dependency1, dependency2) {
     *     return function(promise) {
     *       // same as above
     *     }
     *   });
     * </pre>
     *
     *
     * # Security Considerations
     *
     * When designing web applications, consider security threats from:
     *
     * - {@link http://haacked.com/archive/2008/11/20/anatomy-of-a-subtle-json-vulnerability.aspx
     *   JSON vulnerability}
     * - {@link http://en.wikipedia.org/wiki/Cross-site_request_forgery XSRF}
     *
     * Both server and the client must cooperate in order to eliminate these threats. Angular comes
     * pre-configured with strategies that address these issues, but for this to work backend server
     * cooperation is required.
     *
     * ## JSON Vulnerability Protection
     *
     * A {@link http://haacked.com/archive/2008/11/20/anatomy-of-a-subtle-json-vulnerability.aspx
     * JSON vulnerability} allows third party website to turn your JSON resource URL into
     * {@link http://en.wikipedia.org/wiki/JSONP JSONP} request under some conditions. To
     * counter this your server can prefix all JSON requests with following string `")]}',\n"`.
     * Angular will automatically strip the prefix before processing it as JSON.
     *
     * For example if your server needs to return:
     * <pre>
     * ['one','two']
     * </pre>
     *
     * which is vulnerable to attack, your server can return:
     * <pre>
     * )]}',
     * ['one','two']
     * </pre>
     *
     * Angular will strip the prefix, before processing the JSON.
     *
     *
     * ## Cross Site Request Forgery (XSRF) Protection
     *
     * {@link http://en.wikipedia.org/wiki/Cross-site_request_forgery XSRF} is a technique by which
     * an unauthorized site can gain your user's private data. Angular provides a mechanism
     * to counter XSRF. When performing XHR requests, the $http service reads a token from a cookie
     * (by default, `XSRF-TOKEN`) and sets it as an HTTP header (`X-XSRF-TOKEN`). Since only
     * JavaScript that runs on your domain could read the cookie, your server can be assured that
     * the XHR came from JavaScript running on your domain. The header will not be set for
     * cross-domain requests.
     *
     * To take advantage of this, your server needs to set a token in a JavaScript readable session
     * cookie called `XSRF-TOKEN` on the first HTTP GET request. On subsequent XHR requests the
     * server can verify that the cookie matches `X-XSRF-TOKEN` HTTP header, and therefore be sure
     * that only JavaScript running on your domain could have sent the request. The token must be
     * unique for each user and must be verifiable by the server (to prevent the JavaScript from
     * making up its own tokens). We recommend that the token is a digest of your site's
     * authentication cookie with a {@link https://en.wikipedia.org/wiki/Salt_(cryptography) salt}
     * for added security.
     *
     * The name of the headers can be specified using the xsrfHeaderName and xsrfCookieName
     * properties of either $httpProvider.defaults, or the per-request config object.
     *
     *
     * @param {object} config Object describing the request to be made and how it should be
     *    processed. The object has following properties:
     *
     *    - **method** – `{string}` – HTTP method (e.g. 'GET', 'POST', etc)
     *    - **url** – `{string}` – Absolute or relative URL of the resource that is being requested.
     *    - **params** – `{Object.<string|Object>}` – Map of strings or objects which will be turned
     *      to `?key1=value1&key2=value2` after the url. If the value is not a string, it will be
     *      JSONified.
     *    - **data** – `{string|Object}` – Data to be sent as the request message data.
     *    - **headers** – `{Object}` – Map of strings or functions which return strings representing
     *      HTTP headers to send to the server. If the return value of a function is null, the
     *      header will not be sent.
     *    - **xsrfHeaderName** – `{string}` – Name of HTTP header to populate with the XSRF token.
     *    - **xsrfCookieName** – `{string}` – Name of cookie containing the XSRF token.
     *    - **transformRequest** –
     *      `{function(data, headersGetter)|Array.<function(data, headersGetter)>}` –
     *      transform function or an array of such functions. The transform function takes the http
     *      request body and headers and returns its transformed (typically serialized) version.
     *    - **transformResponse** –
     *      `{function(data, headersGetter)|Array.<function(data, headersGetter)>}` –
     *      transform function or an array of such functions. The transform function takes the http
     *      response body and headers and returns its transformed (typically deserialized) version.
     *    - **cache** – `{boolean|Cache}` – If true, a default $http cache will be used to cache the
     *      GET request, otherwise if a cache instance built with
     *      {@link ng.$cacheFactory $cacheFactory}, this cache will be used for
     *      caching.
     *    - **timeout** – `{number|Promise}` – timeout in milliseconds, or {@link ng.$q promise}
     *      that should abort the request when resolved.
     *    - **withCredentials** - `{boolean}` - whether to to set the `withCredentials` flag on the
     *      XHR object. See {@link https://developer.mozilla.org/en/http_access_control#section_5
     *      requests with credentials} for more information.
     *    - **responseType** - `{string}` - see {@link
     *      https://developer.mozilla.org/en-US/docs/DOM/XMLHttpRequest#responseType requestType}.
     *
     * @returns {HttpPromise} Returns a {@link ng.$q promise} object with the
     *   standard `then` method and two http specific methods: `success` and `error`. The `then`
     *   method takes two arguments a success and an error callback which will be called with a
     *   response object. The `success` and `error` methods take a single argument - a function that
     *   will be called when the request succeeds or fails respectively. The arguments passed into
     *   these functions are destructured representation of the response object passed into the
     *   `then` method. The response object has these properties:
     *
     *   - **data** – `{string|Object}` – The response body transformed with the transform
     *     functions.
     *   - **status** – `{number}` – HTTP status code of the response.
     *   - **headers** – `{function([headerName])}` – Header getter function.
     *   - **config** – `{Object}` – The configuration object that was used to generate the request.
     *
     * @property {Array.<Object>} pendingRequests Array of config objects for currently pending
     *   requests. This is primarily meant to be used for debugging purposes.
     *
     *
     * @example
<example>
<file name="index.html">
  <div ng-controller="FetchCtrl">
    <select ng-model="method">
      <option>GET</option>
      <option>JSONP</option>
    </select>
    <input type="text" ng-model="url" size="80"/>
    <button ng-click="fetch()">fetch</button><br>
    <button ng-click="updateModel('GET', 'http-hello.html')">Sample GET</button>
    <button
      ng-click="updateModel('JSONP',
                    'http://angularjs.org/greet.php?callback=JSON_CALLBACK&name=Super%20Hero')">
      Sample JSONP
    </button>
    <button
      ng-click="updateModel('JSONP', 'http://angularjs.org/doesntexist&callback=JSON_CALLBACK')">
        Invalid JSONP
      </button>
    <pre>http status code: {{status}}</pre>
    <pre>http response data: {{data}}</pre>
  </div>
</file>
<file name="script.js">
  function FetchCtrl($scope, $http, $templateCache) {
    $scope.method = 'GET';
    $scope.url = 'http-hello.html';

    $scope.fetch = function() {
      $scope.code = null;
      $scope.response = null;

      $http({method: $scope.method, url: $scope.url, cache: $templateCache}).
        success(function(data, status) {
          $scope.status = status;
          $scope.data = data;
        }).
        error(function(data, status) {
          $scope.data = data || "Request failed";
          $scope.status = status;
      });
    };

    $scope.updateModel = function(method, url) {
      $scope.method = method;
      $scope.url = url;
    };
  }
</file>
<file name="http-hello.html">
  Hello, $http!
</file>
<file name="scenario.js">
  it('should make an xhr GET request', function() {
    element(':button:contains("Sample GET")').click();
    element(':button:contains("fetch")').click();
    expect(binding('status')).toBe('200');
    expect(binding('data')).toMatch(/Hello, \$http!/);
  });

  it('should make a JSONP request to angularjs.org', function() {
    element(':button:contains("Sample JSONP")').click();
    element(':button:contains("fetch")').click();
    expect(binding('status')).toBe('200');
    expect(binding('data')).toMatch(/Super Hero!/);
  });

  it('should make JSONP request to invalid URL and invoke the error handler',
      function() {
    element(':button:contains("Invalid JSONP")').click();
    element(':button:contains("fetch")').click();
    expect(binding('status')).toBe('0');
    expect(binding('data')).toBe('Request failed');
  });
</file>
</example>
     */
    function $http(requestConfig) {
      var config = {
        transformRequest: defaults.transformRequest,
        transformResponse: defaults.transformResponse
      };
      var headers = mergeHeaders(requestConfig);

      extend(config, requestConfig);
      config.headers = headers;
      config.method = uppercase(config.method);

      var xsrfValue = urlIsSameOrigin(config.url)
          ? $browser.cookies()[config.xsrfCookieName || defaults.xsrfCookieName]
          : undefined;
      if (xsrfValue) {
        headers[(config.xsrfHeaderName || defaults.xsrfHeaderName)] = xsrfValue;
      }


      var serverRequest = function(config) {
        headers = config.headers;
        var reqData = transformData(config.data, headersGetter(headers), config.transformRequest);

        // strip content-type if data is undefined
        if (isUndefined(config.data)) {
          forEach(headers, function(value, header) {
            if (lowercase(header) === 'content-type') {
                delete headers[header];
            }
          });
        }

        if (isUndefined(config.withCredentials) && !isUndefined(defaults.withCredentials)) {
          config.withCredentials = defaults.withCredentials;
        }

        // send request
        return sendReq(config, reqData, headers).then(transformResponse, transformResponse);
      };

      var chain = [serverRequest, undefined];
      var promise = $q.when(config);

      // apply interceptors
      forEach(reversedInterceptors, function(interceptor) {
        if (interceptor.request || interceptor.requestError) {
          chain.unshift(interceptor.request, interceptor.requestError);
        }
        if (interceptor.response || interceptor.responseError) {
          chain.push(interceptor.response, interceptor.responseError);
        }
      });

      while(chain.length) {
        var thenFn = chain.shift();
        var rejectFn = chain.shift();

        promise = promise.then(thenFn, rejectFn);
      }

      promise.success = function(fn) {
        promise.then(function(response) {
          fn(response.data, response.status, response.headers, config);
        });
        return promise;
      };

      promise.error = function(fn) {
        promise.then(null, function(response) {
          fn(response.data, response.status, response.headers, config);
        });
        return promise;
      };

      return promise;

      function transformResponse(response) {
        // make a copy since the response must be cacheable
        var resp = extend({}, response, {
          data: transformData(response.data, response.headers, config.transformResponse)
        });
        return (isSuccess(response.status))
          ? resp
          : $q.reject(resp);
      }

      function mergeHeaders(config) {
        var defHeaders = defaults.headers,
            reqHeaders = extend({}, config.headers),
            defHeaderName, lowercaseDefHeaderName, reqHeaderName;

        defHeaders = extend({}, defHeaders.common, defHeaders[lowercase(config.method)]);

        // execute if header value is function
        execHeaders(defHeaders);
        execHeaders(reqHeaders);

        // using for-in instead of forEach to avoid unecessary iteration after header has been found
        defaultHeadersIteration:
        for (defHeaderName in defHeaders) {
          lowercaseDefHeaderName = lowercase(defHeaderName);

          for (reqHeaderName in reqHeaders) {
            if (lowercase(reqHeaderName) === lowercaseDefHeaderName) {
              continue defaultHeadersIteration;
            }
          }

          reqHeaders[defHeaderName] = defHeaders[defHeaderName];
        }

        return reqHeaders;

        function execHeaders(headers) {
          var headerContent;

          forEach(headers, function(headerFn, header) {
            if (isFunction(headerFn)) {
              headerContent = headerFn();
              if (headerContent != null) {
                headers[header] = headerContent;
              } else {
                delete headers[header];
              }
            }
          });
        }
      }
    }

    $http.pendingRequests = [];

    /**
     * @ngdoc method
     * @name ng.$http#get
     * @methodOf ng.$http
     *
     * @description
     * Shortcut method to perform `GET` request.
     *
     * @param {string} url Relative or absolute URL specifying the destination of the request
     * @param {Object=} config Optional configuration object
     * @returns {HttpPromise} Future object
     */

    /**
     * @ngdoc method
     * @name ng.$http#delete
     * @methodOf ng.$http
     *
     * @description
     * Shortcut method to perform `DELETE` request.
     *
     * @param {string} url Relative or absolute URL specifying the destination of the request
     * @param {Object=} config Optional configuration object
     * @returns {HttpPromise} Future object
     */

    /**
     * @ngdoc method
     * @name ng.$http#head
     * @methodOf ng.$http
     *
     * @description
     * Shortcut method to perform `HEAD` request.
     *
     * @param {string} url Relative or absolute URL specifying the destination of the request
     * @param {Object=} config Optional configuration object
     * @returns {HttpPromise} Future object
     */

    /**
     * @ngdoc method
     * @name ng.$http#jsonp
     * @methodOf ng.$http
     *
     * @description
     * Shortcut method to perform `JSONP` request.
     *
     * @param {string} url Relative or absolute URL specifying the destination of the request.
     *                     Should contain `JSON_CALLBACK` string.
     * @param {Object=} config Optional configuration object
     * @returns {HttpPromise} Future object
     */
    createShortMethods('get', 'delete', 'head', 'jsonp');

    /**
     * @ngdoc method
     * @name ng.$http#post
     * @methodOf ng.$http
     *
     * @description
     * Shortcut method to perform `POST` request.
     *
     * @param {string} url Relative or absolute URL specifying the destination of the request
     * @param {*} data Request content
     * @param {Object=} config Optional configuration object
     * @returns {HttpPromise} Future object
     */

    /**
     * @ngdoc method
     * @name ng.$http#put
     * @methodOf ng.$http
     *
     * @description
     * Shortcut method to perform `PUT` request.
     *
     * @param {string} url Relative or absolute URL specifying the destination of the request
     * @param {*} data Request content
     * @param {Object=} config Optional configuration object
     * @returns {HttpPromise} Future object
     */
    createShortMethodsWithData('post', 'put');

        /**
         * @ngdoc property
         * @name ng.$http#defaults
         * @propertyOf ng.$http
         *
         * @description
         * Runtime equivalent of the `$httpProvider.defaults` property. Allows configuration of
         * default headers, withCredentials as well as request and response transformations.
         *
         * See "Setting HTTP Headers" and "Transforming Requests and Responses" sections above.
         */
    $http.defaults = defaults;


    return $http;


    function createShortMethods(names) {
      forEach(arguments, function(name) {
        $http[name] = function(url, config) {
          return $http(extend(config || {}, {
            method: name,
            url: url
          }));
        };
      });
    }


    function createShortMethodsWithData(name) {
      forEach(arguments, function(name) {
        $http[name] = function(url, data, config) {
          return $http(extend(config || {}, {
            method: name,
            url: url,
            data: data
          }));
        };
      });
    }


    /**
     * Makes the request.
     *
     * !!! ACCESSES CLOSURE VARS:
     * $httpBackend, defaults, $log, $rootScope, defaultCache, $http.pendingRequests
     */
    function sendReq(config, reqData, reqHeaders) {
      var deferred = $q.defer(),
          promise = deferred.promise,
          cache,
          cachedResp,
          url = buildUrl(config.url, config.params);

      $http.pendingRequests.push(config);
      promise.then(removePendingReq, removePendingReq);


      if ((config.cache || defaults.cache) && config.cache !== false && config.method == 'GET') {
        cache = isObject(config.cache) ? config.cache
              : isObject(defaults.cache) ? defaults.cache
              : defaultCache;
      }

      if (cache) {
        cachedResp = cache.get(url);
        if (isDefined(cachedResp)) {
          if (cachedResp.then) {
            // cached request has already been sent, but there is no response yet
            cachedResp.then(removePendingReq, removePendingReq);
            return cachedResp;
          } else {
            // serving from cache
            if (isArray(cachedResp)) {
              resolvePromise(cachedResp[1], cachedResp[0], copy(cachedResp[2]));
            } else {
              resolvePromise(cachedResp, 200, {});
            }
          }
        } else {
          // put the promise for the non-transformed response into cache as a placeholder
          cache.put(url, promise);
        }
      }

      // if we won't have the response in cache, send the request to the backend
      if (isUndefined(cachedResp)) {
        $httpBackend(config.method, url, reqData, done, reqHeaders, config.timeout,
            config.withCredentials, config.responseType);
      }

      return promise;


      /**
       * Callback registered to $httpBackend():
       *  - caches the response if desired
       *  - resolves the raw $http promise
       *  - calls $apply
       */
      function done(status, response, headersString) {
        if (cache) {
          if (isSuccess(status)) {
            cache.put(url, [status, response, parseHeaders(headersString)]);
          } else {
            // remove promise from the cache
            cache.remove(url);
          }
        }

        resolvePromise(response, status, headersString);
        if (!$rootScope.$$phase) $rootScope.$apply();
      }


      /**
       * Resolves the raw $http promise.
       */
      function resolvePromise(response, status, headers) {
        // normalize internal statuses to 0
        status = Math.max(status, 0);

        (isSuccess(status) ? deferred.resolve : deferred.reject)({
          data: response,
          status: status,
          headers: headersGetter(headers),
          config: config
        });
      }


      function removePendingReq() {
        var idx = indexOf($http.pendingRequests, config);
        if (idx !== -1) $http.pendingRequests.splice(idx, 1);
      }
    }


    function buildUrl(url, params) {
          if (!params) return url;
          var parts = [];
          forEachSorted(params, function(value, key) {
            if (value === null || isUndefined(value)) return;
            if (!isArray(value)) value = [value];

            forEach(value, function(v) {
              if (isObject(v)) {
                v = toJson(v);
              }
              parts.push(encodeUriQuery(key) + '=' +
                         encodeUriQuery(v));
            });
          });
          return url + ((url.indexOf('?') == -1) ? '?' : '&') + parts.join('&');
        }


  }];
}

var XHR = window.XMLHttpRequest || function() {
  /* global ActiveXObject */
  try { return new ActiveXObject("Msxml2.XMLHTTP.6.0"); } catch (e1) {}
  try { return new ActiveXObject("Msxml2.XMLHTTP.3.0"); } catch (e2) {}
  try { return new ActiveXObject("Msxml2.XMLHTTP"); } catch (e3) {}
  throw minErr('$httpBackend')('noxhr', "This browser does not support XMLHttpRequest.");
};


/**
 * @ngdoc object
 * @name ng.$httpBackend
 * @requires $browser
 * @requires $window
 * @requires $document
 *
 * @description
 * HTTP backend used by the {@link ng.$http service} that delegates to
 * XMLHttpRequest object or JSONP and deals with browser incompatibilities.
 *
 * You should never need to use this service directly, instead use the higher-level abstractions:
 * {@link ng.$http $http} or {@link ngResource.$resource $resource}.
 *
 * During testing this implementation is swapped with {@link ngMock.$httpBackend mock
 * $httpBackend} which can be trained with responses.
 */
function $HttpBackendProvider() {
  this.$get = ['$browser', '$window', '$document', function($browser, $window, $document) {
    return createHttpBackend($browser, XHR, $browser.defer, $window.angular.callbacks,
        $document[0], $window.location.protocol.replace(':', ''));
  }];
}

function createHttpBackend($browser, XHR, $browserDefer, callbacks, rawDocument, locationProtocol) {
  // TODO(vojta): fix the signature
  return function(method, url, post, callback, headers, timeout, withCredentials, responseType) {
    var status;
    $browser.$$incOutstandingRequestCount();
    url = url || $browser.url();

    if (lowercase(method) == 'jsonp') {
      var callbackId = '_' + (callbacks.counter++).toString(36);
      callbacks[callbackId] = function(data) {
        callbacks[callbackId].data = data;
      };

      var jsonpDone = jsonpReq(url.replace('JSON_CALLBACK', 'angular.callbacks.' + callbackId),
          function() {
        if (callbacks[callbackId].data) {
          completeRequest(callback, 200, callbacks[callbackId].data);
        } else {
          completeRequest(callback, status || -2);
        }
        delete callbacks[callbackId];
      });
    } else {
      var xhr = new XHR();
      xhr.open(method, url, true);
      forEach(headers, function(value, key) {
        if (isDefined(value)) {
            xhr.setRequestHeader(key, value);
        }
      });

      // In IE6 and 7, this might be called synchronously when xhr.send below is called and the
      // response is in the cache. the promise api will ensure that to the app code the api is
      // always async
      xhr.onreadystatechange = function() {
        if (xhr.readyState == 4) {
          var responseHeaders = xhr.getAllResponseHeaders();

          // responseText is the old-school way of retrieving response (supported by IE8 & 9)
          // response/responseType properties were introduced in XHR Level2 spec (supported by IE10)
          completeRequest(callback,
              status || xhr.status,
              (xhr.responseType ? xhr.response : xhr.responseText),
              responseHeaders);
        }
      };

      if (withCredentials) {
        xhr.withCredentials = true;
      }

      if (responseType) {
        xhr.responseType = responseType;
      }

      xhr.send(post || null);
    }

    if (timeout > 0) {
      var timeoutId = $browserDefer(timeoutRequest, timeout);
    } else if (timeout && timeout.then) {
      timeout.then(timeoutRequest);
    }


    function timeoutRequest() {
      status = -1;
      jsonpDone && jsonpDone();
      xhr && xhr.abort();
    }

    function completeRequest(callback, status, response, headersString) {
      var protocol = locationProtocol || urlResolve(url).protocol;

      // cancel timeout and subsequent timeout promise resolution
      timeoutId && $browserDefer.cancel(timeoutId);
      jsonpDone = xhr = null;

      // fix status code for file protocol (it's always 0)
      status = (protocol == 'file') ? (response ? 200 : 404) : status;

      // normalize IE bug (http://bugs.jquery.com/ticket/1450)
      status = status == 1223 ? 204 : status;

      callback(status, response, headersString);
      $browser.$$completeOutstandingRequest(noop);
    }
  };

  function jsonpReq(url, done) {
    // we can't use jQuery/jqLite here because jQuery does crazy shit with script elements, e.g.:
    // - fetches local scripts via XHR and evals them
    // - adds and immediately removes script elements from the document
    var script = rawDocument.createElement('script'),
        doneWrapper = function() {
          rawDocument.body.removeChild(script);
          if (done) done();
        };

    script.type = 'text/javascript';
    script.src = url;

    if (msie) {
      script.onreadystatechange = function() {
        if (/loaded|complete/.test(script.readyState)) doneWrapper();
      };
    } else {
      script.onload = script.onerror = doneWrapper;
    }

    rawDocument.body.appendChild(script);
    return doneWrapper;
  }
}

var $interpolateMinErr = minErr('$interpolate');

/**
 * @ngdoc object
 * @name ng.$interpolateProvider
 * @function
 *
 * @description
 *
 * Used for configuring the interpolation markup. Defaults to `{{` and `}}`.
 *
 * @example
<doc:example module="customInterpolationApp">
<doc:source>
<script>
  var customInterpolationApp = angular.module('customInterpolationApp', []);

  customInterpolationApp.config(function($interpolateProvider) {
    $interpolateProvider.startSymbol('//');
    $interpolateProvider.endSymbol('//');
  });


  customInterpolationApp.controller('DemoController', function DemoController() {
      this.label = "This binding is brought you by // interpolation symbols.";
  });
</script>
<div ng-app="App" ng-controller="DemoController as demo">
    //demo.label//
</div>
</doc:source>
<doc:scenario>
 it('should interpolate binding with custom symbols', function() {
  expect(binding('demo.label')).toBe('This binding is brought you by // interpolation symbols.');
 });
</doc:scenario>
</doc:example>
 */
function $InterpolateProvider() {
  var startSymbol = '{{';
  var endSymbol = '}}';

  /**
   * @ngdoc method
   * @name ng.$interpolateProvider#startSymbol
   * @methodOf ng.$interpolateProvider
   * @description
   * Symbol to denote start of expression in the interpolated string. Defaults to `{{`.
   *
   * @param {string=} value new value to set the starting symbol to.
   * @returns {string|self} Returns the symbol when used as getter and self if used as setter.
   */
  this.startSymbol = function(value){
    if (value) {
      startSymbol = value;
      return this;
    } else {
      return startSymbol;
    }
  };

  /**
   * @ngdoc method
   * @name ng.$interpolateProvider#endSymbol
   * @methodOf ng.$interpolateProvider
   * @description
   * Symbol to denote the end of expression in the interpolated string. Defaults to `}}`.
   *
   * @param {string=} value new value to set the ending symbol to.
   * @returns {string|self} Returns the symbol when used as getter and self if used as setter.
   */
  this.endSymbol = function(value){
    if (value) {
      endSymbol = value;
      return this;
    } else {
      return endSymbol;
    }
  };


  this.$get = ['$parse', '$exceptionHandler', '$sce', function($parse, $exceptionHandler, $sce) {
    var startSymbolLength = startSymbol.length,
        endSymbolLength = endSymbol.length;

    /**
     * @ngdoc function
     * @name ng.$interpolate
     * @function
     *
     * @requires $parse
     * @requires $sce
     *
     * @description
     *
     * Compiles a string with markup into an interpolation function. This service is used by the
     * HTML {@link ng.$compile $compile} service for data binding. See
     * {@link ng.$interpolateProvider $interpolateProvider} for configuring the
     * interpolation markup.
     *
     *
       <pre>
         var $interpolate = ...; // injected
         var exp = $interpolate('Hello {{name}}!');
         expect(exp({name:'Angular'}).toEqual('Hello Angular!');
       </pre>
     *
     *
     * @param {string} text The text with markup to interpolate.
     * @param {boolean=} mustHaveExpression if set to true then the interpolation string must have
     *    embedded expression in order to return an interpolation function. Strings with no
     *    embedded expression will return null for the interpolation function.
     * @param {string=} trustedContext when provided, the returned function passes the interpolated
     *    result through {@link ng.$sce#methods_getTrusted $sce.getTrusted(interpolatedResult,
     *    trustedContext)} before returning it.  Refer to the {@link ng.$sce $sce} service that
     *    provides Strict Contextual Escaping for details.
     * @returns {function(context)} an interpolation function which is used to compute the
     *    interpolated string. The function has these parameters:
     *
     *    * `context`: an object against which any expressions embedded in the strings are evaluated
     *      against.
     *
     */
    function $interpolate(text, mustHaveExpression, trustedContext) {
      var startIndex,
          endIndex,
          index = 0,
          parts = [],
          length = text.length,
          hasInterpolation = false,
          fn,
          exp,
          concat = [];

      while(index < length) {
        if ( ((startIndex = text.indexOf(startSymbol, index)) != -1) &&
             ((endIndex = text.indexOf(endSymbol, startIndex + startSymbolLength)) != -1) ) {
          (index != startIndex) && parts.push(text.substring(index, startIndex));
          parts.push(fn = $parse(exp = text.substring(startIndex + startSymbolLength, endIndex)));
          fn.exp = exp;
          index = endIndex + endSymbolLength;
          hasInterpolation = true;
        } else {
          // we did not find anything, so we have to add the remainder to the parts array
          (index != length) && parts.push(text.substring(index));
          index = length;
        }
      }

      if (!(length = parts.length)) {
        // we added, nothing, must have been an empty string.
        parts.push('');
        length = 1;
      }

      // Concatenating expressions makes it hard to reason about whether some combination of
      // concatenated values are unsafe to use and could easily lead to XSS.  By requiring that a
      // single expression be used for iframe[src], object[src], etc., we ensure that the value
      // that's used is assigned or constructed by some JS code somewhere that is more testable or
      // make it obvious that you bound the value to some user controlled value.  This helps reduce
      // the load when auditing for XSS issues.
      if (trustedContext && parts.length > 1) {
          throw $interpolateMinErr('noconcat',
              "Error while interpolating: {0}\nStrict Contextual Escaping disallows " +
              "interpolations that concatenate multiple expressions when a trusted value is " +
              "required.  See http://docs.angularjs.org/api/ng.$sce", text);
      }

      if (!mustHaveExpression  || hasInterpolation) {
        concat.length = length;
        fn = function(context) {
          try {
            for(var i = 0, ii = length, part; i<ii; i++) {
              if (typeof (part = parts[i]) == 'function') {
                part = part(context);
                if (trustedContext) {
                  part = $sce.getTrusted(trustedContext, part);
                } else {
                  part = $sce.valueOf(part);
                }
                if (part === null || isUndefined(part)) {
                  part = '';
                } else if (typeof part != 'string') {
                  part = toJson(part);
                }
              }
              concat[i] = part;
            }
            return concat.join('');
          }
          catch(err) {
            var newErr = $interpolateMinErr('interr', "Can't interpolate: {0}\n{1}", text,
                err.toString());
            $exceptionHandler(newErr);
          }
        };
        fn.exp = text;
        fn.parts = parts;
        return fn;
      }
    }


    /**
     * @ngdoc method
     * @name ng.$interpolate#startSymbol
     * @methodOf ng.$interpolate
     * @description
     * Symbol to denote the start of expression in the interpolated string. Defaults to `{{`.
     *
     * Use {@link ng.$interpolateProvider#startSymbol $interpolateProvider#startSymbol} to change
     * the symbol.
     *
     * @returns {string} start symbol.
     */
    $interpolate.startSymbol = function() {
      return startSymbol;
    };


    /**
     * @ngdoc method
     * @name ng.$interpolate#endSymbol
     * @methodOf ng.$interpolate
     * @description
     * Symbol to denote the end of expression in the interpolated string. Defaults to `}}`.
     *
     * Use {@link ng.$interpolateProvider#endSymbol $interpolateProvider#endSymbol} to change
     * the symbol.
     *
     * @returns {string} start symbol.
     */
    $interpolate.endSymbol = function() {
      return endSymbol;
    };

    return $interpolate;
  }];
}

function $IntervalProvider() {
  this.$get = ['$rootScope', '$window', '$q',
       function($rootScope,   $window,   $q) {
    var intervals = {};


     /**
      * @ngdoc function
      * @name ng.$interval
      *
      * @description
      * Angular's wrapper for `window.setInterval`. The `fn` function is executed every `delay`
      * milliseconds.
      *
      * The return value of registering an interval function is a promise. This promise will be
      * notified upon each tick of the interval, and will be resolved after `count` iterations, or
      * run indefinitely if `count` is not defined. The value of the notification will be the
      * number of iterations that have run.
      * To cancel an interval, call `$interval.cancel(promise)`.
      *
      * In tests you can use {@link ngMock.$interval#methods_flush `$interval.flush(millis)`} to
      * move forward by `millis` milliseconds and trigger any functions scheduled to run in that
      * time.
      *
      * @param {function()} fn A function that should be called repeatedly.
      * @param {number} delay Number of milliseconds between each function call.
      * @param {number=} [count=0] Number of times to repeat. If not set, or 0, will repeat
      *   indefinitely.
      * @param {boolean=} [invokeApply=true] If set to `false` skips model dirty checking, otherwise
      *   will invoke `fn` within the {@link ng.$rootScope.Scope#methods_$apply $apply} block.
      * @returns {promise} A promise which will be notified on each iteration.
      */
    function interval(fn, delay, count, invokeApply) {
      var setInterval = $window.setInterval,
          clearInterval = $window.clearInterval,
          deferred = $q.defer(),
          promise = deferred.promise,
          iteration = 0,
          skipApply = (isDefined(invokeApply) && !invokeApply);
      
      count = isDefined(count) ? count : 0,

      promise.then(null, null, fn);

      promise.$$intervalId = setInterval(function tick() {
        deferred.notify(iteration++);

        if (count > 0 && iteration >= count) {
          deferred.resolve(iteration);
          clearInterval(promise.$$intervalId);
          delete intervals[promise.$$intervalId];
        }

        if (!skipApply) $rootScope.$apply();

      }, delay);

      intervals[promise.$$intervalId] = deferred;

      return promise;
    }


     /**
      * @ngdoc function
      * @name ng.$interval#cancel
      * @methodOf ng.$interval
      *
      * @description
      * Cancels a task associated with the `promise`.
      *
      * @param {number} promise Promise returned by the `$interval` function.
      * @returns {boolean} Returns `true` if the task was successfully canceled.
      */
    interval.cancel = function(promise) {
      if (promise && promise.$$intervalId in intervals) {
        intervals[promise.$$intervalId].reject('canceled');
        clearInterval(promise.$$intervalId);
        delete intervals[promise.$$intervalId];
        return true;
      }
      return false;
    };

    return interval;
  }];
}

/**
 * @ngdoc object
 * @name ng.$locale
 *
 * @description
 * $locale service provides localization rules for various Angular components. As of right now the
 * only public api is:
 *
 * * `id` – `{string}` – locale id formatted as `languageId-countryId` (e.g. `en-us`)
 */
function $LocaleProvider(){
  this.$get = function() {
    return {
      id: 'en-us',

      NUMBER_FORMATS: {
        DECIMAL_SEP: '.',
        GROUP_SEP: ',',
        PATTERNS: [
          { // Decimal Pattern
            minInt: 1,
            minFrac: 0,
            maxFrac: 3,
            posPre: '',
            posSuf: '',
            negPre: '-',
            negSuf: '',
            gSize: 3,
            lgSize: 3
          },{ //Currency Pattern
            minInt: 1,
            minFrac: 2,
            maxFrac: 2,
            posPre: '\u00A4',
            posSuf: '',
            negPre: '(\u00A4',
            negSuf: ')',
            gSize: 3,
            lgSize: 3
          }
        ],
        CURRENCY_SYM: '$'
      },

      DATETIME_FORMATS: {
        MONTH:
            'January,February,March,April,May,June,July,August,September,October,November,December'
            .split(','),
        SHORTMONTH:  'Jan,Feb,Mar,Apr,May,Jun,Jul,Aug,Sep,Oct,Nov,Dec'.split(','),
        DAY: 'Sunday,Monday,Tuesday,Wednesday,Thursday,Friday,Saturday'.split(','),
        SHORTDAY: 'Sun,Mon,Tue,Wed,Thu,Fri,Sat'.split(','),
        AMPMS: ['AM','PM'],
        medium: 'MMM d, y h:mm:ss a',
        short: 'M/d/yy h:mm a',
        fullDate: 'EEEE, MMMM d, y',
        longDate: 'MMMM d, y',
        mediumDate: 'MMM d, y',
        shortDate: 'M/d/yy',
        mediumTime: 'h:mm:ss a',
        shortTime: 'h:mm a'
      },

      pluralCat: function(num) {
        if (num === 1) {
          return 'one';
        }
        return 'other';
      }
    };
  };
}

var PATH_MATCH = /^([^\?#]*)(\?([^#]*))?(#(.*))?$/,
    DEFAULT_PORTS = {'http': 80, 'https': 443, 'ftp': 21};
var $locationMinErr = minErr('$location');


/**
 * Encode path using encodeUriSegment, ignoring forward slashes
 *
 * @param {string} path Path to encode
 * @returns {string}
 */
function encodePath(path) {
  var segments = path.split('/'),
      i = segments.length;

  while (i--) {
    segments[i] = encodeUriSegment(segments[i]);
  }

  return segments.join('/');
}

function parseAbsoluteUrl(absoluteUrl, locationObj, appBase) {
  var parsedUrl = urlResolve(absoluteUrl, appBase);

  locationObj.$$protocol = parsedUrl.protocol;
  locationObj.$$host = parsedUrl.hostname;
  locationObj.$$port = int(parsedUrl.port) || DEFAULT_PORTS[parsedUrl.protocol] || null;
}


function parseAppUrl(relativeUrl, locationObj, appBase) {
  var prefixed = (relativeUrl.charAt(0) !== '/');
  if (prefixed) {
    relativeUrl = '/' + relativeUrl;
  }
  var match = urlResolve(relativeUrl, appBase);
  locationObj.$$path = decodeURIComponent(prefixed && match.pathname.charAt(0) === '/' ?
      match.pathname.substring(1) : match.pathname);
  locationObj.$$search = parseKeyValue(match.search);
  locationObj.$$hash = decodeURIComponent(match.hash);

  // make sure path starts with '/';
  if (locationObj.$$path && locationObj.$$path.charAt(0) != '/') {
    locationObj.$$path = '/' + locationObj.$$path;
  }
}


/**
 *
 * @param {string} begin
 * @param {string} whole
 * @returns {string} returns text from whole after begin or undefined if it does not begin with
 *                   expected string.
 */
function beginsWith(begin, whole) {
  if (whole.indexOf(begin) === 0) {
    return whole.substr(begin.length);
  }
}


function stripHash(url) {
  var index = url.indexOf('#');
  return index == -1 ? url : url.substr(0, index);
}


function stripFile(url) {
  return url.substr(0, stripHash(url).lastIndexOf('/') + 1);
}

/* return the server only (scheme://host:port) */
function serverBase(url) {
  return url.substring(0, url.indexOf('/', url.indexOf('//') + 2));
}


/**
 * LocationHtml5Url represents an url
 * This object is exposed as $location service when HTML5 mode is enabled and supported
 *
 * @constructor
 * @param {string} appBase application base URL
 * @param {string} basePrefix url path prefix
 */
function LocationHtml5Url(appBase, basePrefix) {
  this.$$html5 = true;
  basePrefix = basePrefix || '';
  var appBaseNoFile = stripFile(appBase);
  parseAbsoluteUrl(appBase, this, appBase);


  /**
   * Parse given html5 (regular) url string into properties
   * @param {string} newAbsoluteUrl HTML5 url
   * @private
   */
  this.$$parse = function(url) {
    var pathUrl = beginsWith(appBaseNoFile, url);
    if (!isString(pathUrl)) {
      throw $locationMinErr('ipthprfx', 'Invalid url "{0}", missing path prefix "{1}".', url,
          appBaseNoFile);
    }

    parseAppUrl(pathUrl, this, appBase);

    if (!this.$$path) {
      this.$$path = '/';
    }

    this.$$compose();
  };

  /**
   * Compose url and update `absUrl` property
   * @private
   */
  this.$$compose = function() {
    var search = toKeyValue(this.$$search),
        hash = this.$$hash ? '#' + encodeUriSegment(this.$$hash) : '';

    this.$$url = encodePath(this.$$path) + (search ? '?' + search : '') + hash;
    this.$$absUrl = appBaseNoFile + this.$$url.substr(1); // first char is always '/'
  };

  this.$$rewrite = function(url) {
    var appUrl, prevAppUrl;

    if ( (appUrl = beginsWith(appBase, url)) !== undefined ) {
      prevAppUrl = appUrl;
      if ( (appUrl = beginsWith(basePrefix, appUrl)) !== undefined ) {
        return appBaseNoFile + (beginsWith('/', appUrl) || appUrl);
      } else {
        return appBase + prevAppUrl;
      }
    } else if ( (appUrl = beginsWith(appBaseNoFile, url)) !== undefined ) {
      return appBaseNoFile + appUrl;
    } else if (appBaseNoFile == url + '/') {
      return appBaseNoFile;
    }
  };
}


/**
 * LocationHashbangUrl represents url
 * This object is exposed as $location service when developer doesn't opt into html5 mode.
 * It also serves as the base class for html5 mode fallback on legacy browsers.
 *
 * @constructor
 * @param {string} appBase application base URL
 * @param {string} hashPrefix hashbang prefix
 */
function LocationHashbangUrl(appBase, hashPrefix) {
  var appBaseNoFile = stripFile(appBase);

  parseAbsoluteUrl(appBase, this, appBase);


  /**
   * Parse given hashbang url into properties
   * @param {string} url Hashbang url
   * @private
   */
  this.$$parse = function(url) {
    var withoutBaseUrl = beginsWith(appBase, url) || beginsWith(appBaseNoFile, url);
    var withoutHashUrl = withoutBaseUrl.charAt(0) == '#'
        ? beginsWith(hashPrefix, withoutBaseUrl)
        : (this.$$html5)
          ? withoutBaseUrl
          : '';

    if (!isString(withoutHashUrl)) {
      throw $locationMinErr('ihshprfx', 'Invalid url "{0}", missing hash prefix "{1}".', url,
          hashPrefix);
    }
    parseAppUrl(withoutHashUrl, this, appBase);
    this.$$compose();
  };

  /**
   * Compose hashbang url and update `absUrl` property
   * @private
   */
  this.$$compose = function() {
    var search = toKeyValue(this.$$search),
        hash = this.$$hash ? '#' + encodeUriSegment(this.$$hash) : '';

    this.$$url = encodePath(this.$$path) + (search ? '?' + search : '') + hash;
    this.$$absUrl = appBase + (this.$$url ? hashPrefix + this.$$url : '');
  };

  this.$$rewrite = function(url) {
    if(stripHash(appBase) == stripHash(url)) {
      return url;
    }
  };
}


/**
 * LocationHashbangUrl represents url
 * This object is exposed as $location service when html5 history api is enabled but the browser
 * does not support it.
 *
 * @constructor
 * @param {string} appBase application base URL
 * @param {string} hashPrefix hashbang prefix
 */
function LocationHashbangInHtml5Url(appBase, hashPrefix) {
  this.$$html5 = true;
  LocationHashbangUrl.apply(this, arguments);

  var appBaseNoFile = stripFile(appBase);

  this.$$rewrite = function(url) {
    var appUrl;

    if ( appBase == stripHash(url) ) {
      return url;
    } else if ( (appUrl = beginsWith(appBaseNoFile, url)) ) {
      return appBase + hashPrefix + appUrl;
    } else if ( appBaseNoFile === url + '/') {
      return appBaseNoFile;
    }
  };
}


LocationHashbangInHtml5Url.prototype =
  LocationHashbangUrl.prototype =
  LocationHtml5Url.prototype = {

  /**
   * Are we in html5 mode?
   * @private
   */
  $$html5: false,

  /**
   * Has any change been replacing ?
   * @private
   */
  $$replace: false,

  /**
   * @ngdoc method
   * @name ng.$location#absUrl
   * @methodOf ng.$location
   *
   * @description
   * This method is getter only.
   *
   * Return full url representation with all segments encoded according to rules specified in
   * {@link http://www.ietf.org/rfc/rfc3986.txt RFC 3986}.
   *
   * @return {string} full url
   */
  absUrl: locationGetter('$$absUrl'),

  /**
   * @ngdoc method
   * @name ng.$location#url
   * @methodOf ng.$location
   *
   * @description
   * This method is getter / setter.
   *
   * Return url (e.g. `/path?a=b#hash`) when called without any parameter.
   *
   * Change path, search and hash, when called with parameter and return `$location`.
   *
   * @param {string=} url New url without base prefix (e.g. `/path?a=b#hash`)
   * @param {string=} replace The path that will be changed
   * @return {string} url
   */
  url: function(url, replace) {
    if (isUndefined(url))
      return this.$$url;

    var match = PATH_MATCH.exec(url);
    if (match[1]) this.path(decodeURIComponent(match[1]));
    if (match[2] || match[1]) this.search(match[3] || '');
    this.hash(match[5] || '', replace);

    return this;
  },

  /**
   * @ngdoc method
   * @name ng.$location#protocol
   * @methodOf ng.$location
   *
   * @description
   * This method is getter only.
   *
   * Return protocol of current url.
   *
   * @return {string} protocol of current url
   */
  protocol: locationGetter('$$protocol'),

  /**
   * @ngdoc method
   * @name ng.$location#host
   * @methodOf ng.$location
   *
   * @description
   * This method is getter only.
   *
   * Return host of current url.
   *
   * @return {string} host of current url.
   */
  host: locationGetter('$$host'),

  /**
   * @ngdoc method
   * @name ng.$location#port
   * @methodOf ng.$location
   *
   * @description
   * This method is getter only.
   *
   * Return port of current url.
   *
   * @return {Number} port
   */
  port: locationGetter('$$port'),

  /**
   * @ngdoc method
   * @name ng.$location#path
   * @methodOf ng.$location
   *
   * @description
   * This method is getter / setter.
   *
   * Return path of current url when called without any parameter.
   *
   * Change path when called with parameter and return `$location`.
   *
   * Note: Path should always begin with forward slash (/), this method will add the forward slash
   * if it is missing.
   *
   * @param {string=} path New path
   * @return {string} path
   */
  path: locationGetterSetter('$$path', function(path) {
    return path.charAt(0) == '/' ? path : '/' + path;
  }),

  /**
   * @ngdoc method
   * @name ng.$location#search
   * @methodOf ng.$location
   *
   * @description
   * This method is getter / setter.
   *
   * Return search part (as object) of current url when called without any parameter.
   *
   * Change search part when called with parameter and return `$location`.
   *
   * @param {string|Object.<string>|Object.<Array.<string>>} search New search params - string or
   * hash object. Hash object may contain an array of values, which will be decoded as duplicates in
   * the url.
   *
   * @param {(string|Array<string>)=} paramValue If `search` is a string, then `paramValue` will override only a
   * single search parameter. If `paramValue` is an array, it will set the parameter as a
   * comma-separated value. If `paramValue` is `null`, the parameter will be deleted.
   *
   * @return {string} search
   */
  search: function(search, paramValue) {
    switch (arguments.length) {
      case 0:
        return this.$$search;
      case 1:
        if (isString(search)) {
          this.$$search = parseKeyValue(search);
        } else if (isObject(search)) {
          this.$$search = search;
        } else {
          throw $locationMinErr('isrcharg',
              'The first argument of the `$location#search()` call must be a string or an object.');
        }
        break;
      default:
        if (isUndefined(paramValue) || paramValue === null) {
          delete this.$$search[search];
        } else {
          this.$$search[search] = paramValue;
        }
    }

    this.$$compose();
    return this;
  },

  /**
   * @ngdoc method
   * @name ng.$location#hash
   * @methodOf ng.$location
   *
   * @description
   * This method is getter / setter.
   *
   * Return hash fragment when called without any parameter.
   *
   * Change hash fragment when called with parameter and return `$location`.
   *
   * @param {string=} hash New hash fragment
   * @return {string} hash
   */
  hash: locationGetterSetter('$$hash', identity),

  /**
   * @ngdoc method
   * @name ng.$location#replace
   * @methodOf ng.$location
   *
   * @description
   * If called, all changes to $location during current `$digest` will be replacing current history
   * record, instead of adding new one.
   */
  replace: function() {
    this.$$replace = true;
    return this;
  }
};

function locationGetter(property) {
  return function() {
    return this[property];
  };
}


function locationGetterSetter(property, preprocess) {
  return function(value) {
    if (isUndefined(value))
      return this[property];

    this[property] = preprocess(value);
    this.$$compose();

    return this;
  };
}


/**
 * @ngdoc object
 * @name ng.$location
 *
 * @requires $browser
 * @requires $sniffer
 * @requires $rootElement
 *
 * @description
 * The $location service parses the URL in the browser address bar (based on the
 * {@link https://developer.mozilla.org/en/window.location window.location}) and makes the URL
 * available to your application. Changes to the URL in the address bar are reflected into
 * $location service and changes to $location are reflected into the browser address bar.
 *
 * **The $location service:**
 *
 * - Exposes the current URL in the browser address bar, so you can
 *   - Watch and observe the URL.
 *   - Change the URL.
 * - Synchronizes the URL with the browser when the user
 *   - Changes the address bar.
 *   - Clicks the back or forward button (or clicks a History link).
 *   - Clicks on a link.
 * - Represents the URL object as a set of methods (protocol, host, port, path, search, hash).
 *
 * For more information see {@link guide/dev_guide.services.$location Developer Guide: Angular
 * Services: Using $location}
 */

/**
 * @ngdoc object
 * @name ng.$locationProvider
 * @description
 * Use the `$locationProvider` to configure how the application deep linking paths are stored.
 */
function $LocationProvider(){
  var hashPrefix = '',
      html5Mode = false;

  /**
   * @ngdoc property
   * @name ng.$locationProvider#hashPrefix
   * @methodOf ng.$locationProvider
   * @description
   * @param {string=} prefix Prefix for hash part (containing path and search)
   * @returns {*} current value if used as getter or itself (chaining) if used as setter
   */
  this.hashPrefix = function(prefix) {
    if (isDefined(prefix)) {
      hashPrefix = prefix;
      return this;
    } else {
      return hashPrefix;
    }
  };

  /**
   * @ngdoc property
   * @name ng.$locationProvider#html5Mode
   * @methodOf ng.$locationProvider
   * @description
   * @param {boolean=} mode Use HTML5 strategy if available.
   * @returns {*} current value if used as getter or itself (chaining) if used as setter
   */
  this.html5Mode = function(mode) {
    if (isDefined(mode)) {
      html5Mode = mode;
      return this;
    } else {
      return html5Mode;
    }
  };

  /**
   * @ngdoc event
   * @name ng.$location#$locationChangeStart
   * @eventOf ng.$location
   * @eventType broadcast on root scope
   * @description
   * Broadcasted before a URL will change. This change can be prevented by calling
   * `preventDefault` method of the event. See {@link ng.$rootScope.Scope#$on} for more
   * details about event object. Upon successful change
   * {@link ng.$location#$locationChangeSuccess $locationChangeSuccess} is fired.
   *
   * @param {Object} angularEvent Synthetic event object.
   * @param {string} newUrl New URL
   * @param {string=} oldUrl URL that was before it was changed.
   */

  /**
   * @ngdoc event
   * @name ng.$location#$locationChangeSuccess
   * @eventOf ng.$location
   * @eventType broadcast on root scope
   * @description
   * Broadcasted after a URL was changed.
   *
   * @param {Object} angularEvent Synthetic event object.
   * @param {string} newUrl New URL
   * @param {string=} oldUrl URL that was before it was changed.
   */

  this.$get = ['$rootScope', '$browser', '$sniffer', '$rootElement',
      function( $rootScope,   $browser,   $sniffer,   $rootElement) {
    var $location,
        LocationMode,
        baseHref = $browser.baseHref(), // if base[href] is undefined, it defaults to ''
        initialUrl = $browser.url(),
        appBase;

    if (html5Mode) {
      appBase = serverBase(initialUrl) + (baseHref || '/');
      LocationMode = $sniffer.history ? LocationHtml5Url : LocationHashbangInHtml5Url;
    } else {
      appBase = stripHash(initialUrl);
      LocationMode = LocationHashbangUrl;
    }
    $location = new LocationMode(appBase, '#' + hashPrefix);
    $location.$$parse($location.$$rewrite(initialUrl));

    $rootElement.on('click', function(event) {
      // TODO(vojta): rewrite link when opening in new tab/window (in legacy browser)
      // currently we open nice url link and redirect then

      if (event.ctrlKey || event.metaKey || event.which == 2) return;

      var elm = jqLite(event.target);

      // traverse the DOM up to find first A tag
      while (lowercase(elm[0].nodeName) !== 'a') {
        // ignore rewriting if no A tag (reached root element, or no parent - removed from document)
        if (elm[0] === $rootElement[0] || !(elm = elm.parent())[0]) return;
      }

      var absHref = elm.prop('href');
      var rewrittenUrl = $location.$$rewrite(absHref);

      if (absHref && !elm.attr('target') && rewrittenUrl && !event.isDefaultPrevented()) {
        event.preventDefault();
        if (rewrittenUrl != $browser.url()) {
          // update location manually
          $location.$$parse(rewrittenUrl);
          $rootScope.$apply();
          // hack to work around FF6 bug 684208 when scenario runner clicks on links
          window.angular['ff-684208-preventDefault'] = true;
        }
      }
    });


    // rewrite hashbang url <> html5 url
    if ($location.absUrl() != initialUrl) {
      $browser.url($location.absUrl(), true);
    }

    // update $location when $browser url changes
    $browser.onUrlChange(function(newUrl) {
      if ($location.absUrl() != newUrl) {
        if ($rootScope.$broadcast('$locationChangeStart', newUrl,
                                  $location.absUrl()).defaultPrevented) {
          $browser.url($location.absUrl());
          return;
        }
        $rootScope.$evalAsync(function() {
          var oldUrl = $location.absUrl();

          $location.$$parse(newUrl);
          afterLocationChange(oldUrl);
        });
        if (!$rootScope.$$phase) $rootScope.$digest();
      }
    });

    // update browser
    var changeCounter = 0;
    $rootScope.$watch(function $locationWatch() {
      var oldUrl = $browser.url();
      var currentReplace = $location.$$replace;

      if (!changeCounter || oldUrl != $location.absUrl()) {
        changeCounter++;
        $rootScope.$evalAsync(function() {
          if ($rootScope.$broadcast('$locationChangeStart', $location.absUrl(), oldUrl).
              defaultPrevented) {
            $location.$$parse(oldUrl);
          } else {
            $browser.url($location.absUrl(), currentReplace);
            afterLocationChange(oldUrl);
          }
        });
      }
      $location.$$replace = false;

      return changeCounter;
    });

    return $location;

    function afterLocationChange(oldUrl) {
      $rootScope.$broadcast('$locationChangeSuccess', $location.absUrl(), oldUrl);
    }
}];
}

/**
 * @ngdoc object
 * @name ng.$log
 * @requires $window
 *
 * @description
 * Simple service for logging. Default implementation safely writes the message
 * into the browser's console (if present).
 * 
 * The main purpose of this service is to simplify debugging and troubleshooting.
 *
 * The default is not to log `debug` messages. You can use
 * {@link ng.$logProvider ng.$logProvider#debugEnabled} to change this.
 *
 * @example
   <example>
     <file name="script.js">
       function LogCtrl($scope, $log) {
         $scope.$log = $log;
         $scope.message = 'Hello World!';
       }
     </file>
     <file name="index.html">
       <div ng-controller="LogCtrl">
         <p>Reload this page with open console, enter text and hit the log button...</p>
         Message:
         <input type="text" ng-model="message"/>
         <button ng-click="$log.log(message)">log</button>
         <button ng-click="$log.warn(message)">warn</button>
         <button ng-click="$log.info(message)">info</button>
         <button ng-click="$log.error(message)">error</button>
       </div>
     </file>
   </example>
 */

/**
 * @ngdoc object
 * @name ng.$logProvider
 * @description
 * Use the `$logProvider` to configure how the application logs messages
 */
function $LogProvider(){
  var debug = true,
      self = this;
  
  /**
   * @ngdoc property
   * @name ng.$logProvider#debugEnabled
   * @methodOf ng.$logProvider
   * @description
   * @param {string=} flag enable or disable debug level messages
   * @returns {*} current value if used as getter or itself (chaining) if used as setter
   */
  this.debugEnabled = function(flag) {
    if (isDefined(flag)) {
      debug = flag;
    return this;
    } else {
      return debug;
    }
  };
  
  this.$get = ['$window', function($window){
    return {
      /**
       * @ngdoc method
       * @name ng.$log#log
       * @methodOf ng.$log
       *
       * @description
       * Write a log message
       */
      log: consoleLog('log'),

      /**
       * @ngdoc method
       * @name ng.$log#info
       * @methodOf ng.$log
       *
       * @description
       * Write an information message
       */
      info: consoleLog('info'),

      /**
       * @ngdoc method
       * @name ng.$log#warn
       * @methodOf ng.$log
       *
       * @description
       * Write a warning message
       */
      warn: consoleLog('warn'),

      /**
       * @ngdoc method
       * @name ng.$log#error
       * @methodOf ng.$log
       *
       * @description
       * Write an error message
       */
      error: consoleLog('error'),
      
      /**
       * @ngdoc method
       * @name ng.$log#debug
       * @methodOf ng.$log
       * 
       * @description
       * Write a debug message
       */
      debug: (function () {
        var fn = consoleLog('debug');

        return function() {
          if (debug) {
            fn.apply(self, arguments);
          }
        };
      }())
    };

    function formatError(arg) {
      if (arg instanceof Error) {
        if (arg.stack) {
          arg = (arg.message && arg.stack.indexOf(arg.message) === -1)
              ? 'Error: ' + arg.message + '\n' + arg.stack
              : arg.stack;
        } else if (arg.sourceURL) {
          arg = arg.message + '\n' + arg.sourceURL + ':' + arg.line;
        }
      }
      return arg;
    }

    function consoleLog(type) {
      var console = $window.console || {},
          logFn = console[type] || console.log || noop;

      if (logFn.apply) {
        return function() {
          var args = [];
          forEach(arguments, function(arg) {
            args.push(formatError(arg));
          });
          return logFn.apply(console, args);
        };
      }

      // we are IE which either doesn't have window.console => this is noop and we do nothing,
      // or we are IE where console.log doesn't have apply so we log at least first 2 args
      return function(arg1, arg2) {
        logFn(arg1, arg2 == null ? '' : arg2);
      };
    }
  }];
}

var $parseMinErr = minErr('$parse');
var promiseWarningCache = {};
var promiseWarning;

// Sandboxing Angular Expressions
// ------------------------------
// Angular expressions are generally considered safe because these expressions only have direct
// access to $scope and locals. However, one can obtain the ability to execute arbitrary JS code by
// obtaining a reference to native JS functions such as the Function constructor.
//
// As an example, consider the following Angular expression:
//
//   {}.toString.constructor(alert("evil JS code"))
//
// We want to prevent this type of access. For the sake of performance, during the lexing phase we
// disallow any "dotted" access to any member named "constructor".
//
// For reflective calls (a[b]) we check that the value of the lookup is not the Function constructor
// while evaluating the expression, which is a stronger but more expensive test. Since reflective
// calls are expensive anyway, this is not such a big deal compared to static dereferencing.
//
// This sandboxing technique is not perfect and doesn't aim to be. The goal is to prevent exploits
// against the expression language, but not to prevent exploits that were enabled by exposing
// sensitive JavaScript or browser apis on Scope. Exposing such objects on a Scope is never a good
// practice and therefore we are not even trying to protect against interaction with an object
// explicitly exposed in this way.
//
// A developer could foil the name check by aliasing the Function constructor under a different
// name on the scope.
//
// In general, it is not possible to access a Window object from an angular expression unless a
// window or some DOM object that has a reference to window is published onto a Scope.

function ensureSafeMemberName(name, fullExpression) {
  if (name === "constructor") {
    throw $parseMinErr('isecfld',
        'Referencing "constructor" field in Angular expressions is disallowed! Expression: {0}',
        fullExpression);
  }
  return name;
}

function ensureSafeObject(obj, fullExpression) {
  // nifty check if obj is Function that is fast and works across iframes and other contexts
  if (obj && obj.constructor === obj) {
    throw $parseMinErr('isecfn',
        'Referencing Function in Angular expressions is disallowed! Expression: {0}',
        fullExpression);
  } else if (// isWindow(obj)
      obj && obj.document && obj.location && obj.alert && obj.setInterval) {
    throw $parseMinErr('isecwindow',
        'Referencing the Window in Angular expressions is disallowed! Expression: {0}',
        fullExpression);
  } else if (// isElement(obj)
      obj && (obj.nodeName || (obj.on && obj.find))) {
    throw $parseMinErr('isecdom',
        'Referencing DOM nodes in Angular expressions is disallowed! Expression: {0}',
        fullExpression);
  } else {
    return obj;
  }
}

var OPERATORS = {
    /* jshint bitwise : false */
    'null':function(){return null;},
    'true':function(){return true;},
    'false':function(){return false;},
    undefined:noop,
    '+':function(self, locals, a,b){
      a=a(self, locals); b=b(self, locals);
      if (isDefined(a)) {
        if (isDefined(b)) {
          return a + b;
        }
        return a;
      }
      return isDefined(b)?b:undefined;},
    '-':function(self, locals, a,b){
          a=a(self, locals); b=b(self, locals);
          return (isDefined(a)?a:0)-(isDefined(b)?b:0);
        },
    '*':function(self, locals, a,b){return a(self, locals)*b(self, locals);},
    '/':function(self, locals, a,b){return a(self, locals)/b(self, locals);},
    '%':function(self, locals, a,b){return a(self, locals)%b(self, locals);},
    '^':function(self, locals, a,b){return a(self, locals)^b(self, locals);},
    '=':noop,
    '===':function(self, locals, a, b){return a(self, locals)===b(self, locals);},
    '!==':function(self, locals, a, b){return a(self, locals)!==b(self, locals);},
    '==':function(self, locals, a,b){return a(self, locals)==b(self, locals);},
    '!=':function(self, locals, a,b){return a(self, locals)!=b(self, locals);},
    '<':function(self, locals, a,b){return a(self, locals)<b(self, locals);},
    '>':function(self, locals, a,b){return a(self, locals)>b(self, locals);},
    '<=':function(self, locals, a,b){return a(self, locals)<=b(self, locals);},
    '>=':function(self, locals, a,b){return a(self, locals)>=b(self, locals);},
    '&&':function(self, locals, a,b){return a(self, locals)&&b(self, locals);},
    '||':function(self, locals, a,b){return a(self, locals)||b(self, locals);},
    '&':function(self, locals, a,b){return a(self, locals)&b(self, locals);},
//    '|':function(self, locals, a,b){return a|b;},
    '|':function(self, locals, a,b){return b(self, locals)(self, locals, a(self, locals));},
    '!':function(self, locals, a){return !a(self, locals);}
};
/* jshint bitwise: true */
var ESCAPE = {"n":"\n", "f":"\f", "r":"\r", "t":"\t", "v":"\v", "'":"'", '"':'"'};


/////////////////////////////////////////


/**
 * @constructor
 */
var Lexer = function (options) {
  this.options = options;
};

Lexer.prototype = {
  constructor: Lexer,

  lex: function (text) {
    this.text = text;

    this.index = 0;
    this.ch = undefined;
    this.lastCh = ':'; // can start regexp

    this.tokens = [];

    var token;
    var json = [];

    while (this.index < this.text.length) {
      this.ch = this.text.charAt(this.index);
      if (this.is('"\'')) {
        this.readString(this.ch);
      } else if (this.isNumber(this.ch) || this.is('.') && this.isNumber(this.peek())) {
        this.readNumber();
      } else if (this.isIdent(this.ch)) {
        this.readIdent();
        // identifiers can only be if the preceding char was a { or ,
        if (this.was('{,') && json[0] === '{' &&
            (token = this.tokens[this.tokens.length - 1])) {
          token.json = token.text.indexOf('.') === -1;
        }
      } else if (this.is('(){}[].,;:?')) {
        this.tokens.push({
          index: this.index,
          text: this.ch,
          json: (this.was(':[,') && this.is('{[')) || this.is('}]:,')
        });
        if (this.is('{[')) json.unshift(this.ch);
        if (this.is('}]')) json.shift();
        this.index++;
      } else if (this.isWhitespace(this.ch)) {
        this.index++;
        continue;
      } else {
        var ch2 = this.ch + this.peek();
        var ch3 = ch2 + this.peek(2);
        var fn = OPERATORS[this.ch];
        var fn2 = OPERATORS[ch2];
        var fn3 = OPERATORS[ch3];
        if (fn3) {
          this.tokens.push({index: this.index, text: ch3, fn: fn3});
          this.index += 3;
        } else if (fn2) {
          this.tokens.push({index: this.index, text: ch2, fn: fn2});
          this.index += 2;
        } else if (fn) {
          this.tokens.push({
            index: this.index,
            text: this.ch,
            fn: fn,
            json: (this.was('[,:') && this.is('+-'))
          });
          this.index += 1;
        } else {
          this.throwError('Unexpected next character ', this.index, this.index + 1);
        }
      }
      this.lastCh = this.ch;
    }
    return this.tokens;
  },

  is: function(chars) {
    return chars.indexOf(this.ch) !== -1;
  },

  was: function(chars) {
    return chars.indexOf(this.lastCh) !== -1;
  },

  peek: function(i) {
    var num = i || 1;
    return (this.index + num < this.text.length) ? this.text.charAt(this.index + num) : false;
  },

  isNumber: function(ch) {
    return ('0' <= ch && ch <= '9');
  },

  isWhitespace: function(ch) {
    // IE treats non-breaking space as \u00A0
    return (ch === ' ' || ch === '\r' || ch === '\t' ||
            ch === '\n' || ch === '\v' || ch === '\u00A0');
  },

  isIdent: function(ch) {
    return ('a' <= ch && ch <= 'z' ||
            'A' <= ch && ch <= 'Z' ||
            '_' === ch || ch === '$');
  },

  isExpOperator: function(ch) {
    return (ch === '-' || ch === '+' || this.isNumber(ch));
  },

  throwError: function(error, start, end) {
    end = end || this.index;
    var colStr = (isDefined(start)
            ? 's ' + start +  '-' + this.index + ' [' + this.text.substring(start, end) + ']'
            : ' ' + end);
    throw $parseMinErr('lexerr', 'Lexer Error: {0} at column{1} in expression [{2}].',
        error, colStr, this.text);
  },

  readNumber: function() {
    var number = '';
    var start = this.index;
    while (this.index < this.text.length) {
      var ch = lowercase(this.text.charAt(this.index));
      if (ch == '.' || this.isNumber(ch)) {
        number += ch;
      } else {
        var peekCh = this.peek();
        if (ch == 'e' && this.isExpOperator(peekCh)) {
          number += ch;
        } else if (this.isExpOperator(ch) &&
            peekCh && this.isNumber(peekCh) &&
            number.charAt(number.length - 1) == 'e') {
          number += ch;
        } else if (this.isExpOperator(ch) &&
            (!peekCh || !this.isNumber(peekCh)) &&
            number.charAt(number.length - 1) == 'e') {
          this.throwError('Invalid exponent');
        } else {
          break;
        }
      }
      this.index++;
    }
    number = 1 * number;
    this.tokens.push({
      index: start,
      text: number,
      json: true,
      fn: function() { return number; }
    });
  },

  readIdent: function() {
    var parser = this;

    var ident = '';
    var start = this.index;

    var lastDot, peekIndex, methodName, ch;

    while (this.index < this.text.length) {
      ch = this.text.charAt(this.index);
      if (ch === '.' || this.isIdent(ch) || this.isNumber(ch)) {
        if (ch === '.') lastDot = this.index;
        ident += ch;
      } else {
        break;
      }
      this.index++;
    }

    //check if this is not a method invocation and if it is back out to last dot
    if (lastDot) {
      peekIndex = this.index;
      while (peekIndex < this.text.length) {
        ch = this.text.charAt(peekIndex);
        if (ch === '(') {
          methodName = ident.substr(lastDot - start + 1);
          ident = ident.substr(0, lastDot - start);
          this.index = peekIndex;
          break;
        }
        if (this.isWhitespace(ch)) {
          peekIndex++;
        } else {
          break;
        }
      }
    }


    var token = {
      index: start,
      text: ident
    };

    // OPERATORS is our own object so we don't need to use special hasOwnPropertyFn
    if (OPERATORS.hasOwnProperty(ident)) {
      token.fn = OPERATORS[ident];
      token.json = OPERATORS[ident];
    } else {
      var getter = getterFn(ident, this.options, this.text);
      token.fn = extend(function(self, locals) {
        return (getter(self, locals));
      }, {
        assign: function(self, value) {
          return setter(self, ident, value, parser.text, parser.options);
        }
      });
    }

    this.tokens.push(token);

    if (methodName) {
      this.tokens.push({
        index:lastDot,
        text: '.',
        json: false
      });
      this.tokens.push({
        index: lastDot + 1,
        text: methodName,
        json: false
      });
    }
  },

  readString: function(quote) {
    var start = this.index;
    this.index++;
    var string = '';
    var rawString = quote;
    var escape = false;
    while (this.index < this.text.length) {
      var ch = this.text.charAt(this.index);
      rawString += ch;
      if (escape) {
        if (ch === 'u') {
          var hex = this.text.substring(this.index + 1, this.index + 5);
          if (!hex.match(/[\da-f]{4}/i))
            this.throwError('Invalid unicode escape [\\u' + hex + ']');
          this.index += 4;
          string += String.fromCharCode(parseInt(hex, 16));
        } else {
          var rep = ESCAPE[ch];
          if (rep) {
            string += rep;
          } else {
            string += ch;
          }
        }
        escape = false;
      } else if (ch === '\\') {
        escape = true;
      } else if (ch === quote) {
        this.index++;
        this.tokens.push({
          index: start,
          text: rawString,
          string: string,
          json: true,
          fn: function() { return string; }
        });
        return;
      } else {
        string += ch;
      }
      this.index++;
    }
    this.throwError('Unterminated quote', start);
  }
};


/**
 * @constructor
 */
var Parser = function (lexer, $filter, options) {
  this.lexer = lexer;
  this.$filter = $filter;
  this.options = options;
};

Parser.ZERO = function () { return 0; };

Parser.prototype = {
  constructor: Parser,

  parse: function (text, json) {
    this.text = text;

    //TODO(i): strip all the obsolte json stuff from this file
    this.json = json;

    this.tokens = this.lexer.lex(text);

    if (json) {
      // The extra level of aliasing is here, just in case the lexer misses something, so that
      // we prevent any accidental execution in JSON.
      this.assignment = this.logicalOR;

      this.functionCall =
      this.fieldAccess =
      this.objectIndex =
      this.filterChain = function() {
        this.throwError('is not valid json', {text: text, index: 0});
      };
    }

    var value = json ? this.primary() : this.statements();

    if (this.tokens.length !== 0) {
      this.throwError('is an unexpected token', this.tokens[0]);
    }

    value.literal = !!value.literal;
    value.constant = !!value.constant;

    return value;
  },

  primary: function () {
    var primary;
    if (this.expect('(')) {
      primary = this.filterChain();
      this.consume(')');
    } else if (this.expect('[')) {
      primary = this.arrayDeclaration();
    } else if (this.expect('{')) {
      primary = this.object();
    } else {
      var token = this.expect();
      primary = token.fn;
      if (!primary) {
        this.throwError('not a primary expression', token);
      }
      if (token.json) {
        primary.constant = true;
        primary.literal = true;
      }
    }

    var next, context;
    while ((next = this.expect('(', '[', '.'))) {
      if (next.text === '(') {
        primary = this.functionCall(primary, context);
        context = null;
      } else if (next.text === '[') {
        context = primary;
        primary = this.objectIndex(primary);
      } else if (next.text === '.') {
        context = primary;
        primary = this.fieldAccess(primary);
      } else {
        this.throwError('IMPOSSIBLE');
      }
    }
    return primary;
  },

  throwError: function(msg, token) {
    throw $parseMinErr('syntax',
        'Syntax Error: Token \'{0}\' {1} at column {2} of the expression [{3}] starting at [{4}].',
          token.text, msg, (token.index + 1), this.text, this.text.substring(token.index));
  },

  peekToken: function() {
    if (this.tokens.length === 0)
      throw $parseMinErr('ueoe', 'Unexpected end of expression: {0}', this.text);
    return this.tokens[0];
  },

  peek: function(e1, e2, e3, e4) {
    if (this.tokens.length > 0) {
      var token = this.tokens[0];
      var t = token.text;
      if (t === e1 || t === e2 || t === e3 || t === e4 ||
          (!e1 && !e2 && !e3 && !e4)) {
        return token;
      }
    }
    return false;
  },

  expect: function(e1, e2, e3, e4){
    var token = this.peek(e1, e2, e3, e4);
    if (token) {
      if (this.json && !token.json) {
        this.throwError('is not valid json', token);
      }
      this.tokens.shift();
      return token;
    }
    return false;
  },

  consume: function(e1){
    if (!this.expect(e1)) {
      this.throwError('is unexpected, expecting [' + e1 + ']', this.peek());
    }
  },

  unaryFn: function(fn, right) {
    return extend(function(self, locals) {
      return fn(self, locals, right);
    }, {
      constant:right.constant
    });
  },

  ternaryFn: function(left, middle, right){
    return extend(function(self, locals){
      return left(self, locals) ? middle(self, locals) : right(self, locals);
    }, {
      constant: left.constant && middle.constant && right.constant
    });
  },

  binaryFn: function(left, fn, right) {
    return extend(function(self, locals) {
      return fn(self, locals, left, right);
    }, {
      constant:left.constant && right.constant
    });
  },

  statements: function() {
    var statements = [];
    while (true) {
      if (this.tokens.length > 0 && !this.peek('}', ')', ';', ']'))
        statements.push(this.filterChain());
      if (!this.expect(';')) {
        // optimize for the common case where there is only one statement.
        // TODO(size): maybe we should not support multiple statements?
        return (statements.length === 1)
            ? statements[0]
            : function(self, locals) {
                var value;
                for (var i = 0; i < statements.length; i++) {
                  var statement = statements[i];
                  if (statement) {
                    value = statement(self, locals);
                  }
                }
                return value;
              };
      }
    }
  },

  filterChain: function() {
    var left = this.expression();
    var token;
    while (true) {
      if ((token = this.expect('|'))) {
        left = this.binaryFn(left, token.fn, this.filter());
      } else {
        return left;
      }
    }
  },

  filter: function() {
    var token = this.expect();
    var fn = this.$filter(token.text);
    var argsFn = [];
    while (true) {
      if ((token = this.expect(':'))) {
        argsFn.push(this.expression());
      } else {
        var fnInvoke = function(self, locals, input) {
          var args = [input];
          for (var i = 0; i < argsFn.length; i++) {
            args.push(argsFn[i](self, locals));
          }
          return fn.apply(self, args);
        };
        return function() {
          return fnInvoke;
        };
      }
    }
  },

  expression: function() {
    return this.assignment();
  },

  assignment: function() {
    var left = this.ternary();
    var right;
    var token;
    if ((token = this.expect('='))) {
      if (!left.assign) {
        this.throwError('implies assignment but [' +
            this.text.substring(0, token.index) + '] can not be assigned to', token);
      }
      right = this.ternary();
      return function(scope, locals) {
        return left.assign(scope, right(scope, locals), locals);
      };
    }
    return left;
  },

  ternary: function() {
    var left = this.logicalOR();
    var middle;
    var token;
    if ((token = this.expect('?'))) {
      middle = this.ternary();
      if ((token = this.expect(':'))) {
        return this.ternaryFn(left, middle, this.ternary());
      } else {
        this.throwError('expected :', token);
      }
    } else {
      return left;
    }
  },

  logicalOR: function() {
    var left = this.logicalAND();
    var token;
    while (true) {
      if ((token = this.expect('||'))) {
        left = this.binaryFn(left, token.fn, this.logicalAND());
      } else {
        return left;
      }
    }
  },

  logicalAND: function() {
    var left = this.equality();
    var token;
    if ((token = this.expect('&&'))) {
      left = this.binaryFn(left, token.fn, this.logicalAND());
    }
    return left;
  },

  equality: function() {
    var left = this.relational();
    var token;
    if ((token = this.expect('==','!=','===','!=='))) {
      left = this.binaryFn(left, token.fn, this.equality());
    }
    return left;
  },

  relational: function() {
    var left = this.additive();
    var token;
    if ((token = this.expect('<', '>', '<=', '>='))) {
      left = this.binaryFn(left, token.fn, this.relational());
    }
    return left;
  },

  additive: function() {
    var left = this.multiplicative();
    var token;
    while ((token = this.expect('+','-'))) {
      left = this.binaryFn(left, token.fn, this.multiplicative());
    }
    return left;
  },

  multiplicative: function() {
    var left = this.unary();
    var token;
    while ((token = this.expect('*','/','%'))) {
      left = this.binaryFn(left, token.fn, this.unary());
    }
    return left;
  },

  unary: function() {
    var token;
    if (this.expect('+')) {
      return this.primary();
    } else if ((token = this.expect('-'))) {
      return this.binaryFn(Parser.ZERO, token.fn, this.unary());
    } else if ((token = this.expect('!'))) {
      return this.unaryFn(token.fn, this.unary());
    } else {
      return this.primary();
    }
  },

  fieldAccess: function(object) {
    var parser = this;
    var field = this.expect().text;
    var getter = getterFn(field, this.options, this.text);

    return extend(function(scope, locals, self) {
      return getter(self || object(scope, locals), locals);
    }, {
      assign: function(scope, value, locals) {
        return setter(object(scope, locals), field, value, parser.text, parser.options);
      }
    });
  },

  objectIndex: function(obj) {
    var parser = this;

    var indexFn = this.expression();
    this.consume(']');

    return extend(function(self, locals) {
      var o = obj(self, locals),
          i = indexFn(self, locals),
          v, p;

      if (!o) return undefined;
      v = ensureSafeObject(o[i], parser.text);
      if (v && v.then && parser.options.unwrapPromises) {
        p = v;
        if (!('$$v' in v)) {
          p.$$v = undefined;
          p.then(function(val) { p.$$v = val; });
        }
        v = v.$$v;
      }
      return v;
    }, {
      assign: function(self, value, locals) {
        var key = indexFn(self, locals);
        // prevent overwriting of Function.constructor which would break ensureSafeObject check
        var safe = ensureSafeObject(obj(self, locals), parser.text);
        return safe[key] = value;
      }
    });
  },

  functionCall: function(fn, contextGetter) {
    var argsFn = [];
    if (this.peekToken().text !== ')') {
      do {
        argsFn.push(this.expression());
      } while (this.expect(','));
    }
    this.consume(')');

    var parser = this;

    return function(scope, locals) {
      var args = [];
      var context = contextGetter ? contextGetter(scope, locals) : scope;

      for (var i = 0; i < argsFn.length; i++) {
        args.push(argsFn[i](scope, locals));
      }
      var fnPtr = fn(scope, locals, context) || noop;

      ensureSafeObject(context, parser.text);
      ensureSafeObject(fnPtr, parser.text);

      // IE stupidity! (IE doesn't have apply for some native functions)
      var v = fnPtr.apply
            ? fnPtr.apply(context, args)
            : fnPtr(args[0], args[1], args[2], args[3], args[4]);

      return ensureSafeObject(v, parser.text);
    };
  },

  // This is used with json array declaration
  arrayDeclaration: function () {
    var elementFns = [];
    var allConstant = true;
    if (this.peekToken().text !== ']') {
      do {
        var elementFn = this.expression();
        elementFns.push(elementFn);
        if (!elementFn.constant) {
          allConstant = false;
        }
      } while (this.expect(','));
    }
    this.consume(']');

    return extend(function(self, locals) {
      var array = [];
      for (var i = 0; i < elementFns.length; i++) {
        array.push(elementFns[i](self, locals));
      }
      return array;
    }, {
      literal: true,
      constant: allConstant
    });
  },

  object: function () {
    var keyValues = [];
    var allConstant = true;
    if (this.peekToken().text !== '}') {
      do {
        var token = this.expect(),
        key = token.string || token.text;
        this.consume(':');
        var value = this.expression();
        keyValues.push({key: key, value: value});
        if (!value.constant) {
          allConstant = false;
        }
      } while (this.expect(','));
    }
    this.consume('}');

    return extend(function(self, locals) {
      var object = {};
      for (var i = 0; i < keyValues.length; i++) {
        var keyValue = keyValues[i];
        object[keyValue.key] = keyValue.value(self, locals);
      }
      return object;
    }, {
      literal: true,
      constant: allConstant
    });
  }
};


//////////////////////////////////////////////////
// Parser helper functions
//////////////////////////////////////////////////

function setter(obj, path, setValue, fullExp, options) {
  //needed?
  options = options || {};

  var element = path.split('.'), key;
  for (var i = 0; element.length > 1; i++) {
    key = ensureSafeMemberName(element.shift(), fullExp);
    var propertyObj = obj[key];
    if (!propertyObj) {
      propertyObj = {};
      obj[key] = propertyObj;
    }
    obj = propertyObj;
    if (obj.then && options.unwrapPromises) {
      promiseWarning(fullExp);
      if (!("$$v" in obj)) {
        (function(promise) {
          promise.then(function(val) { promise.$$v = val; }); }
        )(obj);
      }
      if (obj.$$v === undefined) {
        obj.$$v = {};
      }
      obj = obj.$$v;
    }
  }
  key = ensureSafeMemberName(element.shift(), fullExp);
  obj[key] = setValue;
  return setValue;
}

var getterFnCache = {};

/**
 * Implementation of the "Black Hole" variant from:
 * - http://jsperf.com/angularjs-parse-getter/4
 * - http://jsperf.com/path-evaluation-simplified/7
 */
function cspSafeGetterFn(key0, key1, key2, key3, key4, fullExp, options) {
  ensureSafeMemberName(key0, fullExp);
  ensureSafeMemberName(key1, fullExp);
  ensureSafeMemberName(key2, fullExp);
  ensureSafeMemberName(key3, fullExp);
  ensureSafeMemberName(key4, fullExp);

  return !options.unwrapPromises
      ? function cspSafeGetter(scope, locals) {
          var pathVal = (locals && locals.hasOwnProperty(key0)) ? locals : scope;

          if (pathVal === null || pathVal === undefined) return pathVal;
          pathVal = pathVal[key0];

          if (!key1 || pathVal === null || pathVal === undefined) return pathVal;
          pathVal = pathVal[key1];

          if (!key2 || pathVal === null || pathVal === undefined) return pathVal;
          pathVal = pathVal[key2];

          if (!key3 || pathVal === null || pathVal === undefined) return pathVal;
          pathVal = pathVal[key3];

          if (!key4 || pathVal === null || pathVal === undefined) return pathVal;
          pathVal = pathVal[key4];

          return pathVal;
        }
      : function cspSafePromiseEnabledGetter(scope, locals) {
          var pathVal = (locals && locals.hasOwnProperty(key0)) ? locals : scope,
              promise;

          if (pathVal === null || pathVal === undefined) return pathVal;

          pathVal = pathVal[key0];
          if (pathVal && pathVal.then) {
            promiseWarning(fullExp);
            if (!("$$v" in pathVal)) {
              promise = pathVal;
              promise.$$v = undefined;
              promise.then(function(val) { promise.$$v = val; });
            }
            pathVal = pathVal.$$v;
          }
          if (!key1 || pathVal === null || pathVal === undefined) return pathVal;

          pathVal = pathVal[key1];
          if (pathVal && pathVal.then) {
            promiseWarning(fullExp);
            if (!("$$v" in pathVal)) {
              promise = pathVal;
              promise.$$v = undefined;
              promise.then(function(val) { promise.$$v = val; });
            }
            pathVal = pathVal.$$v;
          }
          if (!key2 || pathVal === null || pathVal === undefined) return pathVal;

          pathVal = pathVal[key2];
          if (pathVal && pathVal.then) {
            promiseWarning(fullExp);
            if (!("$$v" in pathVal)) {
              promise = pathVal;
              promise.$$v = undefined;
              promise.then(function(val) { promise.$$v = val; });
            }
            pathVal = pathVal.$$v;
          }
          if (!key3 || pathVal === null || pathVal === undefined) return pathVal;

          pathVal = pathVal[key3];
          if (pathVal && pathVal.then) {
            promiseWarning(fullExp);
            if (!("$$v" in pathVal)) {
              promise = pathVal;
              promise.$$v = undefined;
              promise.then(function(val) { promise.$$v = val; });
            }
            pathVal = pathVal.$$v;
          }
          if (!key4 || pathVal === null || pathVal === undefined) return pathVal;

          pathVal = pathVal[key4];
          if (pathVal && pathVal.then) {
            promiseWarning(fullExp);
            if (!("$$v" in pathVal)) {
              promise = pathVal;
              promise.$$v = undefined;
              promise.then(function(val) { promise.$$v = val; });
            }
            pathVal = pathVal.$$v;
          }
          return pathVal;
        };
}

function getterFn(path, options, fullExp) {
  // Check whether the cache has this getter already.
  // We can use hasOwnProperty directly on the cache because we ensure,
  // see below, that the cache never stores a path called 'hasOwnProperty'
  if (getterFnCache.hasOwnProperty(path)) {
    return getterFnCache[path];
  }

  var pathKeys = path.split('.'),
      pathKeysLength = pathKeys.length,
      fn;

  if (options.csp) {
    if (pathKeysLength < 6) {
      fn = cspSafeGetterFn(pathKeys[0], pathKeys[1], pathKeys[2], pathKeys[3], pathKeys[4], fullExp,
                          options);
    } else {
      fn = function(scope, locals) {
        var i = 0, val;
        do {
          val = cspSafeGetterFn(pathKeys[i++], pathKeys[i++], pathKeys[i++], pathKeys[i++],
                                pathKeys[i++], fullExp, options)(scope, locals);

          locals = undefined; // clear after first iteration
          scope = val;
        } while (i < pathKeysLength);
        return val;
      };
    }
  } else {
    var code = 'var l, fn, p;\n';
    forEach(pathKeys, function(key, index) {
      ensureSafeMemberName(key, fullExp);
      code += 'if(s === null || s === undefined) return s;\n' +
              'l=s;\n' +
              's='+ (index
                      // we simply dereference 's' on any .dot notation
                      ? 's'
                      // but if we are first then we check locals first, and if so read it first
                      : '((k&&k.hasOwnProperty("' + key + '"))?k:s)') + '["' + key + '"]' + ';\n' +
              (options.unwrapPromises
                ? 'if (s && s.then) {\n' +
                  ' pw("' + fullExp.replace(/\"/g, '\\"') + '");\n' +
                  ' if (!("$$v" in s)) {\n' +
                    ' p=s;\n' +
                    ' p.$$v = undefined;\n' +
                    ' p.then(function(v) {p.$$v=v;});\n' +
                    '}\n' +
                  ' s=s.$$v\n' +
                '}\n'
                : '');
    });
    code += 'return s;';

    /* jshint -W054 */
    var evaledFnGetter = new Function('s', 'k', 'pw', code); // s=scope, k=locals, pw=promiseWarning
    /* jshint +W054 */
    evaledFnGetter.toString = function() { return code; };
    fn = function(scope, locals) {
      return evaledFnGetter(scope, locals, promiseWarning);
    };
  }

  // Only cache the value if it's not going to mess up the cache object
  // This is more performant that using Object.prototype.hasOwnProperty.call
  if (path !== 'hasOwnProperty') {
    getterFnCache[path] = fn;
  }
  return fn;
}

///////////////////////////////////

/**
 * @ngdoc function
 * @name ng.$parse
 * @function
 *
 * @description
 *
 * Converts Angular {@link guide/expression expression} into a function.
 *
 * <pre>
 *   var getter = $parse('user.name');
 *   var setter = getter.assign;
 *   var context = {user:{name:'angular'}};
 *   var locals = {user:{name:'local'}};
 *
 *   expect(getter(context)).toEqual('angular');
 *   setter(context, 'newValue');
 *   expect(context.user.name).toEqual('newValue');
 *   expect(getter(context, locals)).toEqual('local');
 * </pre>
 *
 *
 * @param {string} expression String expression to compile.
 * @returns {function(context, locals)} a function which represents the compiled expression:
 *
 *    * `context` – `{object}` – an object against which any expressions embedded in the strings
 *      are evaluated against (typically a scope object).
 *    * `locals` – `{object=}` – local variables context object, useful for overriding values in
 *      `context`.
 *
 *    The returned function also has the following properties:
 *      * `literal` – `{boolean}` – whether the expression's top-level node is a JavaScript
 *        literal.
 *      * `constant` – `{boolean}` – whether the expression is made entirely of JavaScript
 *        constant literals.
 *      * `assign` – `{?function(context, value)}` – if the expression is assignable, this will be
 *        set to a function to change its value on the given context.
 *
 */


/**
 * @ngdoc object
 * @name ng.$parseProvider
 * @function
 *
 * @description
 * `$parseProvider` can be used for configuring the default behavior of the {@link ng.$parse $parse}
 *  service.
 */
function $ParseProvider() {
  var cache = {};

  var $parseOptions = {
    csp: false,
    unwrapPromises: false,
    logPromiseWarnings: true
  };


  /**
   * @deprecated Promise unwrapping via $parse is deprecated and will be removed in the future.
   *
   * @ngdoc method
   * @name ng.$parseProvider#unwrapPromises
   * @methodOf ng.$parseProvider
   * @description
   *
   * **This feature is deprecated, see deprecation notes below for more info**
   *
   * If set to true (default is false), $parse will unwrap promises automatically when a promise is
   * found at any part of the expression. In other words, if set to true, the expression will always
   * result in a non-promise value.
   *
   * While the promise is unresolved, it's treated as undefined, but once resolved and fulfilled,
   * the fulfillment value is used in place of the promise while evaluating the expression.
   *
   * **Deprecation notice**
   *
   * This is a feature that didn't prove to be wildly useful or popular, primarily because of the
   * dichotomy between data access in templates (accessed as raw values) and controller code
   * (accessed as promises).
   *
   * In most code we ended up resolving promises manually in controllers anyway and thus unifying
   * the model access there.
   *
   * Other downsides of automatic promise unwrapping:
   *
   * - when building components it's often desirable to receive the raw promises
   * - adds complexity and slows down expression evaluation
   * - makes expression code pre-generation unattractive due to the amount of code that needs to be
   *   generated
   * - makes IDE auto-completion and tool support hard
   *
   * **Warning Logs**
   *
   * If the unwrapping is enabled, Angular will log a warning about each expression that unwraps a
   * promise (to reduce the noise, each expression is logged only once). To disable this logging use
   * `$parseProvider.logPromiseWarnings(false)` api.
   *
   *
   * @param {boolean=} value New value.
   * @returns {boolean|self} Returns the current setting when used as getter and self if used as
   *                         setter.
   */
  this.unwrapPromises = function(value) {
    if (isDefined(value)) {
      $parseOptions.unwrapPromises = !!value;
      return this;
    } else {
      return $parseOptions.unwrapPromises;
    }
  };


  /**
   * @deprecated Promise unwrapping via $parse is deprecated and will be removed in the future.
   *
   * @ngdoc method
   * @name ng.$parseProvider#logPromiseWarnings
   * @methodOf ng.$parseProvider
   * @description
   *
   * Controls whether Angular should log a warning on any encounter of a promise in an expression.
   *
   * The default is set to `true`.
   *
   * This setting applies only if `$parseProvider.unwrapPromises` setting is set to true as well.
   *
   * @param {boolean=} value New value.
   * @returns {boolean|self} Returns the current setting when used as getter and self if used as
   *                         setter.
   */
 this.logPromiseWarnings = function(value) {
    if (isDefined(value)) {
      $parseOptions.logPromiseWarnings = value;
      return this;
    } else {
      return $parseOptions.logPromiseWarnings;
    }
  };


  this.$get = ['$filter', '$sniffer', '$log', function($filter, $sniffer, $log) {
    $parseOptions.csp = $sniffer.csp;

    promiseWarning = function promiseWarningFn(fullExp) {
      if (!$parseOptions.logPromiseWarnings || promiseWarningCache.hasOwnProperty(fullExp)) return;
      promiseWarningCache[fullExp] = true;
      $log.warn('[$parse] Promise found in the expression `' + fullExp + '`. ' +
          'Automatic unwrapping of promises in Angular expressions is deprecated.');
    };

    return function(exp) {
      var parsedExpression;

      switch (typeof exp) {
        case 'string':

          if (cache.hasOwnProperty(exp)) {
            return cache[exp];
          }

          var lexer = new Lexer($parseOptions);
          var parser = new Parser(lexer, $filter, $parseOptions);
          parsedExpression = parser.parse(exp, false);

          if (exp !== 'hasOwnProperty') {
            // Only cache the value if it's not going to mess up the cache object
            // This is more performant that using Object.prototype.hasOwnProperty.call
            cache[exp] = parsedExpression;
          }

          return parsedExpression;

        case 'function':
          return exp;

        default:
          return noop;
      }
    };
  }];
}

/**
 * @ngdoc service
 * @name ng.$q
 * @requires $rootScope
 *
 * @description
 * A promise/deferred implementation inspired by [Kris Kowal's Q](https://github.com/kriskowal/q).
 *
 * [The CommonJS Promise proposal](http://wiki.commonjs.org/wiki/Promises) describes a promise as an
 * interface for interacting with an object that represents the result of an action that is
 * performed asynchronously, and may or may not be finished at any given point in time.
 *
 * From the perspective of dealing with error handling, deferred and promise APIs are to
 * asynchronous programming what `try`, `catch` and `throw` keywords are to synchronous programming.
 *
 * <pre>
 *   // for the purpose of this example let's assume that variables `$q` and `scope` are
 *   // available in the current lexical scope (they could have been injected or passed in).
 *
 *   function asyncGreet(name) {
 *     var deferred = $q.defer();
 *
 *     setTimeout(function() {
 *       // since this fn executes async in a future turn of the event loop, we need to wrap
 *       // our code into an $apply call so that the model changes are properly observed.
 *       scope.$apply(function() {
 *         deferred.notify('About to greet ' + name + '.');
 *
 *         if (okToGreet(name)) {
 *           deferred.resolve('Hello, ' + name + '!');
 *         } else {
 *           deferred.reject('Greeting ' + name + ' is not allowed.');
 *         }
 *       });
 *     }, 1000);
 *
 *     return deferred.promise;
 *   }
 *
 *   var promise = asyncGreet('Robin Hood');
 *   promise.then(function(greeting) {
 *     alert('Success: ' + greeting);
 *   }, function(reason) {
 *     alert('Failed: ' + reason);
 *   }, function(update) {
 *     alert('Got notification: ' + update);
 *   });
 * </pre>
 *
 * At first it might not be obvious why this extra complexity is worth the trouble. The payoff
 * comes in the way of guarantees that promise and deferred APIs make, see
 * https://github.com/kriskowal/uncommonjs/blob/master/promises/specification.md.
 *
 * Additionally the promise api allows for composition that is very hard to do with the
 * traditional callback ([CPS](http://en.wikipedia.org/wiki/Continuation-passing_style)) approach.
 * For more on this please see the [Q documentation](https://github.com/kriskowal/q) especially the
 * section on serial or parallel joining of promises.
 *
 *
 * # The Deferred API
 *
 * A new instance of deferred is constructed by calling `$q.defer()`.
 *
 * The purpose of the deferred object is to expose the associated Promise instance as well as APIs
 * that can be used for signaling the successful or unsuccessful completion, as well as the status
 * of the task.
 *
 * **Methods**
 *
 * - `resolve(value)` – resolves the derived promise with the `value`. If the value is a rejection
 *   constructed via `$q.reject`, the promise will be rejected instead.
 * - `reject(reason)` – rejects the derived promise with the `reason`. This is equivalent to
 *   resolving it with a rejection constructed via `$q.reject`.
 * - `notify(value)` - provides updates on the status of the promises execution. This may be called
 *   multiple times before the promise is either resolved or rejected.
 *
 * **Properties**
 *
 * - promise – `{Promise}` – promise object associated with this deferred.
 *
 *
 * # The Promise API
 *
 * A new promise instance is created when a deferred instance is created and can be retrieved by
 * calling `deferred.promise`.
 *
 * The purpose of the promise object is to allow for interested parties to get access to the result
 * of the deferred task when it completes.
 *
 * **Methods**
 *
 * - `then(successCallback, errorCallback, notifyCallback)` – regardless of when the promise was or
 *   will be resolved or rejected, `then` calls one of the success or error callbacks asynchronously
 *   as soon as the result is available. The callbacks are called with a single argument: the result
 *   or rejection reason. Additionally, the notify callback may be called zero or more times to
 *   provide a progress indication, before the promise is resolved or rejected.
 *
 *   This method *returns a new promise* which is resolved or rejected via the return value of the
 *   `successCallback`, `errorCallback`. It also notifies via the return value of the
 *   `notifyCallback` method. The promise can not be resolved or rejected from the notifyCallback
 *   method.
 *
 * - `catch(errorCallback)` – shorthand for `promise.then(null, errorCallback)`
 *
 * - `finally(callback)` – allows you to observe either the fulfillment or rejection of a promise,
 *   but to do so without modifying the final value. This is useful to release resources or do some
 *   clean-up that needs to be done whether the promise was rejected or resolved. See the [full
 *   specification](https://github.com/kriskowal/q/wiki/API-Reference#promisefinallycallback) for
 *   more information.
 *
 *   Because `finally` is a reserved word in JavaScript and reserved keywords are not supported as
 *   property names by ES3, you'll need to invoke the method like `promise['finally'](callback)` to
 *   make your code IE8 compatible.
 *
 * # Chaining promises
 *
 * Because calling the `then` method of a promise returns a new derived promise, it is easily
 * possible to create a chain of promises:
 *
 * <pre>
 *   promiseB = promiseA.then(function(result) {
 *     return result + 1;
 *   });
 *
 *   // promiseB will be resolved immediately after promiseA is resolved and its value
 *   // will be the result of promiseA incremented by 1
 * </pre>
 *
 * It is possible to create chains of any length and since a promise can be resolved with another
 * promise (which will defer its resolution further), it is possible to pause/defer resolution of
 * the promises at any point in the chain. This makes it possible to implement powerful APIs like
 * $http's response interceptors.
 *
 *
 * # Differences between Kris Kowal's Q and $q
 *
 *  There are three main differences:
 *
 * - $q is integrated with the {@link ng.$rootScope.Scope} Scope model observation
 *   mechanism in angular, which means faster propagation of resolution or rejection into your
 *   models and avoiding unnecessary browser repaints, which would result in flickering UI.
 * - Q has many more features than $q, but that comes at a cost of bytes. $q is tiny, but contains
 *   all the important functionality needed for common async tasks.
 *
 *  # Testing
 *
 *  <pre>
 *    it('should simulate promise', inject(function($q, $rootScope) {
 *      var deferred = $q.defer();
 *      var promise = deferred.promise;
 *      var resolvedValue;
 *
 *      promise.then(function(value) { resolvedValue = value; });
 *      expect(resolvedValue).toBeUndefined();
 *
 *      // Simulate resolving of promise
 *      deferred.resolve(123);
 *      // Note that the 'then' function does not get called synchronously.
 *      // This is because we want the promise API to always be async, whether or not
 *      // it got called synchronously or asynchronously.
 *      expect(resolvedValue).toBeUndefined();
 *
 *      // Propagate promise resolution to 'then' functions using $apply().
 *      $rootScope.$apply();
 *      expect(resolvedValue).toEqual(123);
 *    }));
 *  </pre>
 */
function $QProvider() {

  this.$get = ['$rootScope', '$exceptionHandler', function($rootScope, $exceptionHandler) {
    return qFactory(function(callback) {
      $rootScope.$evalAsync(callback);
    }, $exceptionHandler);
  }];
}


/**
 * Constructs a promise manager.
 *
 * @param {function(function)} nextTick Function for executing functions in the next turn.
 * @param {function(...*)} exceptionHandler Function into which unexpected exceptions are passed for
 *     debugging purposes.
 * @returns {object} Promise manager.
 */
function qFactory(nextTick, exceptionHandler) {

  /**
   * @ngdoc
   * @name ng.$q#defer
   * @methodOf ng.$q
   * @description
   * Creates a `Deferred` object which represents a task which will finish in the future.
   *
   * @returns {Deferred} Returns a new instance of deferred.
   */
  var defer = function() {
    var pending = [],
        value, deferred;

    deferred = {

      resolve: function(val) {
        if (pending) {
          var callbacks = pending;
          pending = undefined;
          value = ref(val);

          if (callbacks.length) {
            nextTick(function() {
              var callback;
              for (var i = 0, ii = callbacks.length; i < ii; i++) {
                callback = callbacks[i];
                value.then(callback[0], callback[1], callback[2]);
              }
            });
          }
        }
      },


      reject: function(reason) {
        deferred.resolve(reject(reason));
      },


      notify: function(progress) {
        if (pending) {
          var callbacks = pending;

          if (pending.length) {
            nextTick(function() {
              var callback;
              for (var i = 0, ii = callbacks.length; i < ii; i++) {
                callback = callbacks[i];
                callback[2](progress);
              }
            });
          }
        }
      },


      promise: {
        then: function(callback, errback, progressback) {
          var result = defer();

          var wrappedCallback = function(value) {
            try {
              result.resolve((isFunction(callback) ? callback : defaultCallback)(value));
            } catch(e) {
              result.reject(e);
              exceptionHandler(e);
            }
          };

          var wrappedErrback = function(reason) {
            try {
              result.resolve((isFunction(errback) ? errback : defaultErrback)(reason));
            } catch(e) {
              result.reject(e);
              exceptionHandler(e);
            }
          };

          var wrappedProgressback = function(progress) {
            try {
              result.notify((isFunction(progressback) ? progressback : defaultCallback)(progress));
            } catch(e) {
              exceptionHandler(e);
            }
          };

          if (pending) {
            pending.push([wrappedCallback, wrappedErrback, wrappedProgressback]);
          } else {
            value.then(wrappedCallback, wrappedErrback, wrappedProgressback);
          }

          return result.promise;
        },

        "catch": function(callback) {
          return this.then(null, callback);
        },

        "finally": function(callback) {

          function makePromise(value, resolved) {
            var result = defer();
            if (resolved) {
              result.resolve(value);
            } else {
              result.reject(value);
            }
            return result.promise;
          }

          function handleCallback(value, isResolved) {
            var callbackOutput = null;
            try {
              callbackOutput = (callback ||defaultCallback)();
            } catch(e) {
              return makePromise(e, false);
            }
            if (callbackOutput && isFunction(callbackOutput.then)) {
              return callbackOutput.then(function() {
                return makePromise(value, isResolved);
              }, function(error) {
                return makePromise(error, false);
              });
            } else {
              return makePromise(value, isResolved);
            }
          }

          return this.then(function(value) {
            return handleCallback(value, true);
          }, function(error) {
            return handleCallback(error, false);
          });
        }
      }
    };

    return deferred;
  };


  var ref = function(value) {
    if (value && isFunction(value.then)) return value;
    return {
      then: function(callback) {
        var result = defer();
        nextTick(function() {
          result.resolve(callback(value));
        });
        return result.promise;
      }
    };
  };


  /**
   * @ngdoc
   * @name ng.$q#reject
   * @methodOf ng.$q
   * @description
   * Creates a promise that is resolved as rejected with the specified `reason`. This api should be
   * used to forward rejection in a chain of promises. If you are dealing with the last promise in
   * a promise chain, you don't need to worry about it.
   *
   * When comparing deferreds/promises to the familiar behavior of try/catch/throw, think of
   * `reject` as the `throw` keyword in JavaScript. This also means that if you "catch" an error via
   * a promise error callback and you want to forward the error to the promise derived from the
   * current promise, you have to "rethrow" the error by returning a rejection constructed via
   * `reject`.
   *
   * <pre>
   *   promiseB = promiseA.then(function(result) {
   *     // success: do something and resolve promiseB
   *     //          with the old or a new result
   *     return result;
   *   }, function(reason) {
   *     // error: handle the error if possible and
   *     //        resolve promiseB with newPromiseOrValue,
   *     //        otherwise forward the rejection to promiseB
   *     if (canHandle(reason)) {
   *      // handle the error and recover
   *      return newPromiseOrValue;
   *     }
   *     return $q.reject(reason);
   *   });
   * </pre>
   *
   * @param {*} reason Constant, message, exception or an object representing the rejection reason.
   * @returns {Promise} Returns a promise that was already resolved as rejected with the `reason`.
   */
  var reject = function(reason) {
    return {
      then: function(callback, errback) {
        var result = defer();
        nextTick(function() {
          try {
            result.resolve((isFunction(errback) ? errback : defaultErrback)(reason));
          } catch(e) {
            result.reject(e);
            exceptionHandler(e);
          }
        });
        return result.promise;
      }
    };
  };


  /**
   * @ngdoc
   * @name ng.$q#when
   * @methodOf ng.$q
   * @description
   * Wraps an object that might be a value or a (3rd party) then-able promise into a $q promise.
   * This is useful when you are dealing with an object that might or might not be a promise, or if
   * the promise comes from a source that can't be trusted.
   *
   * @param {*} value Value or a promise
   * @returns {Promise} Returns a promise of the passed value or promise
   */
  var when = function(value, callback, errback, progressback) {
    var result = defer(),
        done;

    var wrappedCallback = function(value) {
      try {
        return (isFunction(callback) ? callback : defaultCallback)(value);
      } catch (e) {
        exceptionHandler(e);
        return reject(e);
      }
    };

    var wrappedErrback = function(reason) {
      try {
        return (isFunction(errback) ? errback : defaultErrback)(reason);
      } catch (e) {
        exceptionHandler(e);
        return reject(e);
      }
    };

    var wrappedProgressback = function(progress) {
      try {
        return (isFunction(progressback) ? progressback : defaultCallback)(progress);
      } catch (e) {
        exceptionHandler(e);
      }
    };

    nextTick(function() {
      ref(value).then(function(value) {
        if (done) return;
        done = true;
        result.resolve(ref(value).then(wrappedCallback, wrappedErrback, wrappedProgressback));
      }, function(reason) {
        if (done) return;
        done = true;
        result.resolve(wrappedErrback(reason));
      }, function(progress) {
        if (done) return;
        result.notify(wrappedProgressback(progress));
      });
    });

    return result.promise;
  };


  function defaultCallback(value) {
    return value;
  }


  function defaultErrback(reason) {
    return reject(reason);
  }


  /**
   * @ngdoc
   * @name ng.$q#all
   * @methodOf ng.$q
   * @description
   * Combines multiple promises into a single promise that is resolved when all of the input
   * promises are resolved.
   *
   * @param {Array.<Promise>|Object.<Promise>} promises An array or hash of promises.
   * @returns {Promise} Returns a single promise that will be resolved with an array/hash of values,
   *   each value corresponding to the promise at the same index/key in the `promises` array/hash.
   *   If any of the promises is resolved with a rejection, this resulting promise will be rejected
   *   with the same rejection value.
   */
  function all(promises) {
    var deferred = defer(),
        counter = 0,
        results = isArray(promises) ? [] : {};

    forEach(promises, function(promise, key) {
      counter++;
      ref(promise).then(function(value) {
        if (results.hasOwnProperty(key)) return;
        results[key] = value;
        if (!(--counter)) deferred.resolve(results);
      }, function(reason) {
        if (results.hasOwnProperty(key)) return;
        deferred.reject(reason);
      });
    });

    if (counter === 0) {
      deferred.resolve(results);
    }

    return deferred.promise;
  }

  return {
    defer: defer,
    reject: reject,
    when: when,
    all: all
  };
}

/**
 * DESIGN NOTES
 *
 * The design decisions behind the scope are heavily favored for speed and memory consumption.
 *
 * The typical use of scope is to watch the expressions, which most of the time return the same
 * value as last time so we optimize the operation.
 *
 * Closures construction is expensive in terms of speed as well as memory:
 *   - No closures, instead use prototypical inheritance for API
 *   - Internal state needs to be stored on scope directly, which means that private state is
 *     exposed as $$____ properties
 *
 * Loop operations are optimized by using while(count--) { ... }
 *   - this means that in order to keep the same order of execution as addition we have to add
 *     items to the array at the beginning (shift) instead of at the end (push)
 *
 * Child scopes are created and removed often
 *   - Using an array would be slow since inserts in middle are expensive so we use linked list
 *
 * There are few watches then a lot of observers. This is why you don't want the observer to be
 * implemented in the same way as watch. Watch requires return of initialization function which
 * are expensive to construct.
 */


/**
 * @ngdoc object
 * @name ng.$rootScopeProvider
 * @description
 *
 * Provider for the $rootScope service.
 */

/**
 * @ngdoc function
 * @name ng.$rootScopeProvider#digestTtl
 * @methodOf ng.$rootScopeProvider
 * @description
 *
 * Sets the number of `$digest` iterations the scope should attempt to execute before giving up and
 * assuming that the model is unstable.
 *
 * The current default is 10 iterations.
 *
 * In complex applications it's possible that the dependencies between `$watch`s will result in
 * several digest iterations. However if an application needs more than the default 10 digest
 * iterations for its model to stabilize then you should investigate what is causing the model to
 * continuously change during the digest.
 *
 * Increasing the TTL could have performance implications, so you should not change it without
 * proper justification.
 *
 * @param {number} limit The number of digest iterations.
 */


/**
 * @ngdoc object
 * @name ng.$rootScope
 * @description
 *
 * Every application has a single root {@link ng.$rootScope.Scope scope}.
 * All other scopes are descendant scopes of the root scope. Scopes provide separation
 * between the model and the view, via a mechanism for watching the model for changes.
 * They also provide an event emission/broadcast and subscription facility. See the
 * {@link guide/scope developer guide on scopes}.
 */
function $RootScopeProvider(){
  var TTL = 10;
  var $rootScopeMinErr = minErr('$rootScope');

  this.digestTtl = function(value) {
    if (arguments.length) {
      TTL = value;
    }
    return TTL;
  };

  this.$get = ['$injector', '$exceptionHandler', '$parse', '$browser',
      function( $injector,   $exceptionHandler,   $parse,   $browser) {

    /**
     * @ngdoc function
     * @name ng.$rootScope.Scope
     *
     * @description
     * A root scope can be retrieved using the {@link ng.$rootScope $rootScope} key from the
     * {@link AUTO.$injector $injector}. Child scopes are created using the
     * {@link ng.$rootScope.Scope#methods_$new $new()} method. (Most scopes are created automatically when
     * compiled HTML template is executed.)
     *
     * Here is a simple scope snippet to show how you can interact with the scope.
     * <pre>
     * <file src="./test/ng/rootScopeSpec.js" tag="docs1" />
     * </pre>
     *
     * # Inheritance
     * A scope can inherit from a parent scope, as in this example:
     * <pre>
         var parent = $rootScope;
         var child = parent.$new();

         parent.salutation = "Hello";
         child.name = "World";
         expect(child.salutation).toEqual('Hello');

         child.salutation = "Welcome";
         expect(child.salutation).toEqual('Welcome');
         expect(parent.salutation).toEqual('Hello');
     * </pre>
     *
     *
     * @param {Object.<string, function()>=} providers Map of service factory which need to be
     *                                       provided for the current scope. Defaults to {@link ng}.
     * @param {Object.<string, *>=} instanceCache Provides pre-instantiated services which should
     *                              append/override services provided by `providers`. This is handy
     *                              when unit-testing and having the need to override a default
     *                              service.
     * @returns {Object} Newly created scope.
     *
     */
    function Scope() {
      this.$id = nextUid();
      this.$$phase = this.$parent = this.$$watchers =
                     this.$$nextSibling = this.$$prevSibling =
                     this.$$childHead = this.$$childTail = null;
      this['this'] = this.$root =  this;
      this.$$destroyed = false;
      this.$$asyncQueue = [];
      this.$$postDigestQueue = [];
      this.$$listeners = {};
      this.$$isolateBindings = {};
    }

    /**
     * @ngdoc property
     * @name ng.$rootScope.Scope#$id
     * @propertyOf ng.$rootScope.Scope
     * @returns {number} Unique scope ID (monotonically increasing alphanumeric sequence) useful for
     *   debugging.
     */


    Scope.prototype = {
      constructor: Scope,
      /**
       * @ngdoc function
       * @name ng.$rootScope.Scope#$new
       * @methodOf ng.$rootScope.Scope
       * @function
       *
       * @description
       * Creates a new child {@link ng.$rootScope.Scope scope}.
       *
       * The parent scope will propagate the {@link ng.$rootScope.Scope#$digest $digest()} and
       * {@link ng.$rootScope.Scope#$digest $digest()} events. The scope can be removed from the
       * scope hierarchy using {@link ng.$rootScope.Scope#$destroy $destroy()}.
       *
       * {@link ng.$rootScope.Scope#$destroy $destroy()} must be called on a scope when it is
       * desired for the scope and its child scopes to be permanently detached from the parent and
       * thus stop participating in model change detection and listener notification by invoking.
       *
       * @param {boolean} isolate If true, then the scope does not prototypically inherit from the
       *         parent scope. The scope is isolated, as it can not see parent scope properties.
       *         When creating widgets, it is useful for the widget to not accidentally read parent
       *         state.
       *
       * @returns {Object} The newly created child scope.
       *
       */
      $new: function(isolate) {
        var Child,
            child;

        if (isolate) {
          child = new Scope();
          child.$root = this.$root;
          // ensure that there is just one async queue per $rootScope and its children
          child.$$asyncQueue = this.$$asyncQueue;
          child.$$postDigestQueue = this.$$postDigestQueue;
        } else {
          Child = function() {}; // should be anonymous; This is so that when the minifier munges
            // the name it does not become random set of chars. This will then show up as class
            // name in the debugger.
          Child.prototype = this;
          child = new Child();
          child.$id = nextUid();
        }
        child['this'] = child;
        child.$$listeners = {};
        child.$parent = this;
        child.$$watchers = child.$$nextSibling = child.$$childHead = child.$$childTail = null;
        child.$$prevSibling = this.$$childTail;
        if (this.$$childHead) {
          this.$$childTail.$$nextSibling = child;
          this.$$childTail = child;
        } else {
          this.$$childHead = this.$$childTail = child;
        }
        return child;
      },

      /**
       * @ngdoc function
       * @name ng.$rootScope.Scope#$watch
       * @methodOf ng.$rootScope.Scope
       * @function
       *
       * @description
       * Registers a `listener` callback to be executed whenever the `watchExpression` changes.
       *
       * - The `watchExpression` is called on every call to {@link ng.$rootScope.Scope#$digest
       *   $digest()} and should return the value that will be watched. (Since
       *   {@link ng.$rootScope.Scope#$digest $digest()} reruns when it detects changes the
       *   `watchExpression` can execute multiple times per
       *   {@link ng.$rootScope.Scope#$digest $digest()} and should be idempotent.)
       * - The `listener` is called only when the value from the current `watchExpression` and the
       *   previous call to `watchExpression` are not equal (with the exception of the initial run,
       *   see below). The inequality is determined according to
       *   {@link angular.equals} function. To save the value of the object for later comparison,
       *   the {@link angular.copy} function is used. It also means that watching complex options
       *   will have adverse memory and performance implications.
       * - The watch `listener` may change the model, which may trigger other `listener`s to fire.
       *   This is achieved by rerunning the watchers until no changes are detected. The rerun
       *   iteration limit is 10 to prevent an infinite loop deadlock.
       *
       *
       * If you want to be notified whenever {@link ng.$rootScope.Scope#$digest $digest} is called,
       * you can register a `watchExpression` function with no `listener`. (Since `watchExpression`
       * can execute multiple times per {@link ng.$rootScope.Scope#$digest $digest} cycle when a
       * change is detected, be prepared for multiple calls to your listener.)
       *
       * After a watcher is registered with the scope, the `listener` fn is called asynchronously
       * (via {@link ng.$rootScope.Scope#$evalAsync $evalAsync}) to initialize the
       * watcher. In rare cases, this is undesirable because the listener is called when the result
       * of `watchExpression` didn't change. To detect this scenario within the `listener` fn, you
       * can compare the `newVal` and `oldVal`. If these two values are identical (`===`) then the
       * listener was called due to initialization.
       *
       * The example below contains an illustration of using a function as your $watch listener
       *
       *
       * # Example
       * <pre>
           // let's assume that scope was dependency injected as the $rootScope
           var scope = $rootScope;
           scope.name = 'misko';
           scope.counter = 0;

           expect(scope.counter).toEqual(0);
           scope.$watch('name', function(newValue, oldValue) {
             scope.counter = scope.counter + 1;
           });
           expect(scope.counter).toEqual(0);

           scope.$digest();
           // no variable change
           expect(scope.counter).toEqual(0);

           scope.name = 'adam';
           scope.$digest();
           expect(scope.counter).toEqual(1);



           // Using a listener function 
           var food;
           scope.foodCounter = 0;
           expect(scope.foodCounter).toEqual(0);
           scope.$watch(
             // This is the listener function
             function() { return food; },
             // This is the change handler
             function(newValue, oldValue) {
               if ( newValue !== oldValue ) {
                 // Only increment the counter if the value changed
                 scope.foodCounter = scope.foodCounter + 1;
               }
             }
           );
           // No digest has been run so the counter will be zero
           expect(scope.foodCounter).toEqual(0);

           // Run the digest but since food has not changed cout will still be zero
           scope.$digest();
           expect(scope.foodCounter).toEqual(0);

           // Update food and run digest.  Now the counter will increment
           food = 'cheeseburger';
           scope.$digest();
           expect(scope.foodCounter).toEqual(1);  

       * </pre>
       *
       *
       *
       * @param {(function()|string)} watchExpression Expression that is evaluated on each
       *    {@link ng.$rootScope.Scope#$digest $digest} cycle. A change in the return value triggers
       *    a call to the `listener`.
       *
       *    - `string`: Evaluated as {@link guide/expression expression}
       *    - `function(scope)`: called with current `scope` as a parameter.
       * @param {(function()|string)=} listener Callback called whenever the return value of
       *   the `watchExpression` changes.
       *
       *    - `string`: Evaluated as {@link guide/expression expression}
       *    - `function(newValue, oldValue, scope)`: called with current and previous values as
       *      parameters.
       *
       * @param {boolean=} objectEquality Compare object for equality rather than for reference.
       * @returns {function()} Returns a deregistration function for this listener.
       */
      $watch: function(watchExp, listener, objectEquality) {
        var scope = this,
            get = compileToFn(watchExp, 'watch'),
            array = scope.$$watchers,
            watcher = {
              fn: listener,
              last: initWatchVal,
              get: get,
              exp: watchExp,
              eq: !!objectEquality
            };

        // in the case user pass string, we need to compile it, do we really need this ?
        if (!isFunction(listener)) {
          var listenFn = compileToFn(listener || noop, 'listener');
          watcher.fn = function(newVal, oldVal, scope) {listenFn(scope);};
        }

        if (typeof watchExp == 'string' && get.constant) {
          var originalFn = watcher.fn;
          watcher.fn = function(newVal, oldVal, scope) {
            originalFn.call(this, newVal, oldVal, scope);
            arrayRemove(array, watcher);
          };
        }

        if (!array) {
          array = scope.$$watchers = [];
        }
        // we use unshift since we use a while loop in $digest for speed.
        // the while loop reads in reverse order.
        array.unshift(watcher);

        return function() {
          arrayRemove(array, watcher);
        };
      },


      /**
       * @ngdoc function
       * @name ng.$rootScope.Scope#$watchCollection
       * @methodOf ng.$rootScope.Scope
       * @function
       *
       * @description
       * Shallow watches the properties of an object and fires whenever any of the properties change
       * (for arrays, this implies watching the array items; for object maps, this implies watching
       * the properties). If a change is detected, the `listener` callback is fired.
       *
       * - The `obj` collection is observed via standard $watch operation and is examined on every
       *   call to $digest() to see if any items have been added, removed, or moved.
       * - The `listener` is called whenever anything within the `obj` has changed. Examples include
       *   adding, removing, and moving items belonging to an object or array.
       *
       *
       * # Example
       * <pre>
          $scope.names = ['igor', 'matias', 'misko', 'james'];
          $scope.dataCount = 4;

          $scope.$watchCollection('names', function(newNames, oldNames) {
            $scope.dataCount = newNames.length;
          });

          expect($scope.dataCount).toEqual(4);
          $scope.$digest();

          //still at 4 ... no changes
          expect($scope.dataCount).toEqual(4);

          $scope.names.pop();
          $scope.$digest();

          //now there's been a change
          expect($scope.dataCount).toEqual(3);
       * </pre>
       *
       *
       * @param {string|Function(scope)} obj Evaluated as {@link guide/expression expression}. The
       *    expression value should evaluate to an object or an array which is observed on each
       *    {@link ng.$rootScope.Scope#$digest $digest} cycle. Any shallow change within the
       *    collection will trigger a call to the `listener`.
       *
       * @param {function(newCollection, oldCollection, scope)} listener a callback function that is
       *    fired with both the `newCollection` and `oldCollection` as parameters.
       *    The `newCollection` object is the newly modified data obtained from the `obj` expression
       *    and the `oldCollection` object is a copy of the former collection data.
       *    The `scope` refers to the current scope.
       *
       * @returns {function()} Returns a de-registration function for this listener. When the
       *    de-registration function is executed, the internal watch operation is terminated.
       */
      $watchCollection: function(obj, listener) {
        var self = this;
        var oldValue;
        var newValue;
        var changeDetected = 0;
        var objGetter = $parse(obj);
        var internalArray = [];
        var internalObject = {};
        var oldLength = 0;

        function $watchCollectionWatch() {
          newValue = objGetter(self);
          var newLength, key;

          if (!isObject(newValue)) {
            if (oldValue !== newValue) {
              oldValue = newValue;
              changeDetected++;
            }
          } else if (isArrayLike(newValue)) {
            if (oldValue !== internalArray) {
              // we are transitioning from something which was not an array into array.
              oldValue = internalArray;
              oldLength = oldValue.length = 0;
              changeDetected++;
            }

            newLength = newValue.length;

            if (oldLength !== newLength) {
              // if lengths do not match we need to trigger change notification
              changeDetected++;
              oldValue.length = oldLength = newLength;
            }
            // copy the items to oldValue and look for changes.
            for (var i = 0; i < newLength; i++) {
              if (oldValue[i] !== newValue[i]) {
                changeDetected++;
                oldValue[i] = newValue[i];
              }
            }
          } else {
            if (oldValue !== internalObject) {
              // we are transitioning from something which was not an object into object.
              oldValue = internalObject = {};
              oldLength = 0;
              changeDetected++;
            }
            // copy the items to oldValue and look for changes.
            newLength = 0;
            for (key in newValue) {
              if (newValue.hasOwnProperty(key)) {
                newLength++;
                if (oldValue.hasOwnProperty(key)) {
                  if (oldValue[key] !== newValue[key]) {
                    changeDetected++;
                    oldValue[key] = newValue[key];
                  }
                } else {
                  oldLength++;
                  oldValue[key] = newValue[key];
                  changeDetected++;
                }
              }
            }
            if (oldLength > newLength) {
              // we used to have more keys, need to find them and destroy them.
              changeDetected++;
              for(key in oldValue) {
                if (oldValue.hasOwnProperty(key) && !newValue.hasOwnProperty(key)) {
                  oldLength--;
                  delete oldValue[key];
                }
              }
            }
          }
          return changeDetected;
        }

        function $watchCollectionAction() {
          listener(newValue, oldValue, self);
        }

        return this.$watch($watchCollectionWatch, $watchCollectionAction);
      },

      /**
       * @ngdoc function
       * @name ng.$rootScope.Scope#$digest
       * @methodOf ng.$rootScope.Scope
       * @function
       *
       * @description
       * Processes all of the {@link ng.$rootScope.Scope#$watch watchers} of the current scope and
       * its children. Because a {@link ng.$rootScope.Scope#$watch watcher}'s listener can change
       * the model, the `$digest()` keeps calling the {@link ng.$rootScope.Scope#$watch watchers}
       * until no more listeners are firing. This means that it is possible to get into an infinite
       * loop. This function will throw `'Maximum iteration limit exceeded.'` if the number of
       * iterations exceeds 10.
       *
       * Usually, you don't call `$digest()` directly in
       * {@link ng.directive:ngController controllers} or in
       * {@link ng.$compileProvider#methods_directive directives}.
       * Instead, you should call {@link ng.$rootScope.Scope#$apply $apply()} (typically from within
       * a {@link ng.$compileProvider#methods_directive directives}), which will force a `$digest()`.
       *
       * If you want to be notified whenever `$digest()` is called,
       * you can register a `watchExpression` function with
       * {@link ng.$rootScope.Scope#$watch $watch()} with no `listener`.
       *
       * In unit tests, you may need to call `$digest()` to simulate the scope life cycle.
       *
       * # Example
       * <pre>
           var scope = ...;
           scope.name = 'misko';
           scope.counter = 0;

           expect(scope.counter).toEqual(0);
           scope.$watch('name', function(newValue, oldValue) {
             scope.counter = scope.counter + 1;
           });
           expect(scope.counter).toEqual(0);

           scope.$digest();
           // no variable change
           expect(scope.counter).toEqual(0);

           scope.name = 'adam';
           scope.$digest();
           expect(scope.counter).toEqual(1);
       * </pre>
       *
       */
      $digest: function() {
        var watch, value, last,
            watchers,
            asyncQueue = this.$$asyncQueue,
            postDigestQueue = this.$$postDigestQueue,
            length,
            dirty, ttl = TTL,
            next, current, target = this,
            watchLog = [],
            logIdx, logMsg, asyncTask;

        beginPhase('$digest');

        do { // "while dirty" loop
          dirty = false;
          current = target;

          while(asyncQueue.length) {
            try {
              asyncTask = asyncQueue.shift();
              asyncTask.scope.$eval(asyncTask.expression);
            } catch (e) {
              $exceptionHandler(e);
            }
          }

          do { // "traverse the scopes" loop
            if ((watchers = current.$$watchers)) {
              // process our watches
              length = watchers.length;
              while (length--) {
                try {
                  watch = watchers[length];
                  // Most common watches are on primitives, in which case we can short
                  // circuit it with === operator, only when === fails do we use .equals
                  if (watch && (value = watch.get(current)) !== (last = watch.last) &&
                      !(watch.eq
                          ? equals(value, last)
                          : (typeof value == 'number' && typeof last == 'number'
                             && isNaN(value) && isNaN(last)))) {
                    dirty = true;
                    watch.last = watch.eq ? copy(value) : value;
                    watch.fn(value, ((last === initWatchVal) ? value : last), current);
                    if (ttl < 5) {
                      logIdx = 4 - ttl;
                      if (!watchLog[logIdx]) watchLog[logIdx] = [];
                      logMsg = (isFunction(watch.exp))
                          ? 'fn: ' + (watch.exp.name || watch.exp.toString())
                          : watch.exp;
                      logMsg += '; newVal: ' + toJson(value) + '; oldVal: ' + toJson(last);
                      watchLog[logIdx].push(logMsg);
                    }
                  }
                } catch (e) {
                  $exceptionHandler(e);
                }
              }
            }

            // Insanity Warning: scope depth-first traversal
            // yes, this code is a bit crazy, but it works and we have tests to prove it!
            // this piece should be kept in sync with the traversal in $broadcast
            if (!(next = (current.$$childHead || (current !== target && current.$$nextSibling)))) {
              while(current !== target && !(next = current.$$nextSibling)) {
                current = current.$parent;
              }
            }
          } while ((current = next));

          if(dirty && !(ttl--)) {
            clearPhase();
            throw $rootScopeMinErr('infdig',
                '{0} $digest() iterations reached. Aborting!\n' +
                'Watchers fired in the last 5 iterations: {1}',
                TTL, toJson(watchLog));
          }
        } while (dirty || asyncQueue.length);

        clearPhase();

        while(postDigestQueue.length) {
          try {
            postDigestQueue.shift()();
          } catch (e) {
            $exceptionHandler(e);
          }
        }
      },


      /**
       * @ngdoc event
       * @name ng.$rootScope.Scope#$destroy
       * @eventOf ng.$rootScope.Scope
       * @eventType broadcast on scope being destroyed
       *
       * @description
       * Broadcasted when a scope and its children are being destroyed.
       *
       * Note that, in AngularJS, there is also a `$destroy` jQuery event, which can be used to
       * clean up DOM bindings before an element is removed from the DOM.
       */

      /**
       * @ngdoc function
       * @name ng.$rootScope.Scope#$destroy
       * @methodOf ng.$rootScope.Scope
       * @function
       *
       * @description
       * Removes the current scope (and all of its children) from the parent scope. Removal implies
       * that calls to {@link ng.$rootScope.Scope#$digest $digest()} will no longer
       * propagate to the current scope and its children. Removal also implies that the current
       * scope is eligible for garbage collection.
       *
       * The `$destroy()` is usually used by directives such as
       * {@link ng.directive:ngRepeat ngRepeat} for managing the
       * unrolling of the loop.
       *
       * Just before a scope is destroyed, a `$destroy` event is broadcasted on this scope.
       * Application code can register a `$destroy` event handler that will give it a chance to
       * perform any necessary cleanup.
       *
       * Note that, in AngularJS, there is also a `$destroy` jQuery event, which can be used to
       * clean up DOM bindings before an element is removed from the DOM.
       */
      $destroy: function() {
        // we can't destroy the root scope or a scope that has been already destroyed
        if ($rootScope == this || this.$$destroyed) return;
        var parent = this.$parent;

        this.$broadcast('$destroy');
        this.$$destroyed = true;

        if (parent.$$childHead == this) parent.$$childHead = this.$$nextSibling;
        if (parent.$$childTail == this) parent.$$childTail = this.$$prevSibling;
        if (this.$$prevSibling) this.$$prevSibling.$$nextSibling = this.$$nextSibling;
        if (this.$$nextSibling) this.$$nextSibling.$$prevSibling = this.$$prevSibling;

        // This is bogus code that works around Chrome's GC leak
        // see: https://github.com/angular/angular.js/issues/1313#issuecomment-10378451
        this.$parent = this.$$nextSibling = this.$$prevSibling = this.$$childHead =
            this.$$childTail = null;
      },

      /**
       * @ngdoc function
       * @name ng.$rootScope.Scope#$eval
       * @methodOf ng.$rootScope.Scope
       * @function
       *
       * @description
       * Executes the `expression` on the current scope and returns the result. Any exceptions in
       * the expression are propagated (uncaught). This is useful when evaluating Angular
       * expressions.
       *
       * # Example
       * <pre>
           var scope = ng.$rootScope.Scope();
           scope.a = 1;
           scope.b = 2;

           expect(scope.$eval('a+b')).toEqual(3);
           expect(scope.$eval(function(scope){ return scope.a + scope.b; })).toEqual(3);
       * </pre>
       *
       * @param {(string|function())=} expression An angular expression to be executed.
       *
       *    - `string`: execute using the rules as defined in  {@link guide/expression expression}.
       *    - `function(scope)`: execute the function with the current `scope` parameter.
       * 
       * @param {(object)=} locals Local variables object, useful for overriding values in scope.
       * @returns {*} The result of evaluating the expression.
       */
      $eval: function(expr, locals) {
        return $parse(expr)(this, locals);
      },

      /**
       * @ngdoc function
       * @name ng.$rootScope.Scope#$evalAsync
       * @methodOf ng.$rootScope.Scope
       * @function
       *
       * @description
       * Executes the expression on the current scope at a later point in time.
       *
       * The `$evalAsync` makes no guarantees as to when the `expression` will be executed, only
       * that:
       *
       *   - it will execute after the function that scheduled the evaluation (preferably before DOM
       *     rendering).
       *   - at least one {@link ng.$rootScope.Scope#$digest $digest cycle} will be performed after
       *     `expression` execution.
       *
       * Any exceptions from the execution of the expression are forwarded to the
       * {@link ng.$exceptionHandler $exceptionHandler} service.
       *
       * __Note:__ if this function is called outside of a `$digest` cycle, a new `$digest` cycle
       * will be scheduled. However, it is encouraged to always call code that changes the model
       * from within an `$apply` call. That includes code evaluated via `$evalAsync`.
       *
       * @param {(string|function())=} expression An angular expression to be executed.
       *
       *    - `string`: execute using the rules as defined in {@link guide/expression expression}.
       *    - `function(scope)`: execute the function with the current `scope` parameter.
       *
       */
      $evalAsync: function(expr) {
        // if we are outside of an $digest loop and this is the first time we are scheduling async
        // task also schedule async auto-flush
        if (!$rootScope.$$phase && !$rootScope.$$asyncQueue.length) {
          $browser.defer(function() {
            if ($rootScope.$$asyncQueue.length) {
              $rootScope.$digest();
            }
          });
        }

        this.$$asyncQueue.push({scope: this, expression: expr});
      },

      $$postDigest : function(fn) {
        this.$$postDigestQueue.push(fn);
      },

      /**
       * @ngdoc function
       * @name ng.$rootScope.Scope#$apply
       * @methodOf ng.$rootScope.Scope
       * @function
       *
       * @description
       * `$apply()` is used to execute an expression in angular from outside of the angular
       * framework. (For example from browser DOM events, setTimeout, XHR or third party libraries).
       * Because we are calling into the angular framework we need to perform proper scope life
       * cycle of {@link ng.$exceptionHandler exception handling},
       * {@link ng.$rootScope.Scope#$digest executing watches}.
       *
       * ## Life cycle
       *
       * # Pseudo-Code of `$apply()`
       * <pre>
           function $apply(expr) {
             try {
               return $eval(expr);
             } catch (e) {
               $exceptionHandler(e);
             } finally {
               $root.$digest();
             }
           }
       * </pre>
       *
       *
       * Scope's `$apply()` method transitions through the following stages:
       *
       * 1. The {@link guide/expression expression} is executed using the
       *    {@link ng.$rootScope.Scope#$eval $eval()} method.
       * 2. Any exceptions from the execution of the expression are forwarded to the
       *    {@link ng.$exceptionHandler $exceptionHandler} service.
       * 3. The {@link ng.$rootScope.Scope#$watch watch} listeners are fired immediately after the
       *    expression was executed using the {@link ng.$rootScope.Scope#$digest $digest()} method.
       *
       *
       * @param {(string|function())=} exp An angular expression to be executed.
       *
       *    - `string`: execute using the rules as defined in {@link guide/expression expression}.
       *    - `function(scope)`: execute the function with current `scope` parameter.
       *
       * @returns {*} The result of evaluating the expression.
       */
      $apply: function(expr) {
        try {
          beginPhase('$apply');
          return this.$eval(expr);
        } catch (e) {
          $exceptionHandler(e);
        } finally {
          clearPhase();
          try {
            $rootScope.$digest();
          } catch (e) {
            $exceptionHandler(e);
            throw e;
          }
        }
      },

      /**
       * @ngdoc function
       * @name ng.$rootScope.Scope#$on
       * @methodOf ng.$rootScope.Scope
       * @function
       *
       * @description
       * Listens on events of a given type. See {@link ng.$rootScope.Scope#$emit $emit} for
       * discussion of event life cycle.
       *
       * The event listener function format is: `function(event, args...)`. The `event` object
       * passed into the listener has the following attributes:
       *
       *   - `targetScope` - `{Scope}`: the scope on which the event was `$emit`-ed or
       *     `$broadcast`-ed.
       *   - `currentScope` - `{Scope}`: the current scope which is handling the event.
       *   - `name` - `{string}`: name of the event.
       *   - `stopPropagation` - `{function=}`: calling `stopPropagation` function will cancel
       *     further event propagation (available only for events that were `$emit`-ed).
       *   - `preventDefault` - `{function}`: calling `preventDefault` sets `defaultPrevented` flag
       *     to true.
       *   - `defaultPrevented` - `{boolean}`: true if `preventDefault` was called.
       *
       * @param {string} name Event name to listen on.
       * @param {function(event, args...)} listener Function to call when the event is emitted.
       * @returns {function()} Returns a deregistration function for this listener.
       */
      $on: function(name, listener) {
        var namedListeners = this.$$listeners[name];
        if (!namedListeners) {
          this.$$listeners[name] = namedListeners = [];
        }
        namedListeners.push(listener);

        return function() {
          namedListeners[indexOf(namedListeners, listener)] = null;
        };
      },


      /**
       * @ngdoc function
       * @name ng.$rootScope.Scope#$emit
       * @methodOf ng.$rootScope.Scope
       * @function
       *
       * @description
       * Dispatches an event `name` upwards through the scope hierarchy notifying the
       * registered {@link ng.$rootScope.Scope#$on} listeners.
       *
       * The event life cycle starts at the scope on which `$emit` was called. All
       * {@link ng.$rootScope.Scope#$on listeners} listening for `name` event on this scope get
       * notified. Afterwards, the event traverses upwards toward the root scope and calls all
       * registered listeners along the way. The event will stop propagating if one of the listeners
       * cancels it.
       *
       * Any exception emitted from the {@link ng.$rootScope.Scope#$on listeners} will be passed
       * onto the {@link ng.$exceptionHandler $exceptionHandler} service.
       *
       * @param {string} name Event name to emit.
       * @param {...*} args Optional set of arguments which will be passed onto the event listeners.
       * @return {Object} Event object (see {@link ng.$rootScope.Scope#$on}).
       */
      $emit: function(name, args) {
        var empty = [],
            namedListeners,
            scope = this,
            stopPropagation = false,
            event = {
              name: name,
              targetScope: scope,
              stopPropagation: function() {stopPropagation = true;},
              preventDefault: function() {
                event.defaultPrevented = true;
              },
              defaultPrevented: false
            },
            listenerArgs = concat([event], arguments, 1),
            i, length;

        do {
          namedListeners = scope.$$listeners[name] || empty;
          event.currentScope = scope;
          for (i=0, length=namedListeners.length; i<length; i++) {

            // if listeners were deregistered, defragment the array
            if (!namedListeners[i]) {
              namedListeners.splice(i, 1);
              i--;
              length--;
              continue;
            }
            try {
              //allow all listeners attached to the current scope to run
              namedListeners[i].apply(null, listenerArgs);
            } catch (e) {
              $exceptionHandler(e);
            }
          }
          //if any listener on the current scope stops propagation, prevent bubbling
          if (stopPropagation) return event;
          //traverse upwards
          scope = scope.$parent;
        } while (scope);

        return event;
      },


      /**
       * @ngdoc function
       * @name ng.$rootScope.Scope#$broadcast
       * @methodOf ng.$rootScope.Scope
       * @function
       *
       * @description
       * Dispatches an event `name` downwards to all child scopes (and their children) notifying the
       * registered {@link ng.$rootScope.Scope#$on} listeners.
       *
       * The event life cycle starts at the scope on which `$broadcast` was called. All
       * {@link ng.$rootScope.Scope#$on listeners} listening for `name` event on this scope get
       * notified. Afterwards, the event propagates to all direct and indirect scopes of the current
       * scope and calls all registered listeners along the way. The event cannot be canceled.
       *
       * Any exception emitted from the {@link ng.$rootScope.Scope#$on listeners} will be passed
       * onto the {@link ng.$exceptionHandler $exceptionHandler} service.
       *
       * @param {string} name Event name to broadcast.
       * @param {...*} args Optional set of arguments which will be passed onto the event listeners.
       * @return {Object} Event object, see {@link ng.$rootScope.Scope#$on}
       */
      $broadcast: function(name, args) {
        var target = this,
            current = target,
            next = target,
            event = {
              name: name,
              targetScope: target,
              preventDefault: function() {
                event.defaultPrevented = true;
              },
              defaultPrevented: false
            },
            listenerArgs = concat([event], arguments, 1),
            listeners, i, length;

        //down while you can, then up and next sibling or up and next sibling until back at root
        do {
          current = next;
          event.currentScope = current;
          listeners = current.$$listeners[name] || [];
          for (i=0, length = listeners.length; i<length; i++) {
            // if listeners were deregistered, defragment the array
            if (!listeners[i]) {
              listeners.splice(i, 1);
              i--;
              length--;
              continue;
            }

            try {
              listeners[i].apply(null, listenerArgs);
            } catch(e) {
              $exceptionHandler(e);
            }
          }

          // Insanity Warning: scope depth-first traversal
          // yes, this code is a bit crazy, but it works and we have tests to prove it!
          // this piece should be kept in sync with the traversal in $digest
          if (!(next = (current.$$childHead || (current !== target && current.$$nextSibling)))) {
            while(current !== target && !(next = current.$$nextSibling)) {
              current = current.$parent;
            }
          }
        } while ((current = next));

        return event;
      }
    };

    var $rootScope = new Scope();

    return $rootScope;


    function beginPhase(phase) {
      if ($rootScope.$$phase) {
        throw $rootScopeMinErr('inprog', '{0} already in progress', $rootScope.$$phase);
      }

      $rootScope.$$phase = phase;
    }

    function clearPhase() {
      $rootScope.$$phase = null;
    }

    function compileToFn(exp, name) {
      var fn = $parse(exp);
      assertArgFn(fn, name);
      return fn;
    }

    /**
     * function used as an initial value for watchers.
     * because it's unique we can easily tell it apart from other values
     */
    function initWatchVal() {}
  }];
}

var $sceMinErr = minErr('$sce');

var SCE_CONTEXTS = {
  HTML: 'html',
  CSS: 'css',
  URL: 'url',
  // RESOURCE_URL is a subtype of URL used in contexts where a privileged resource is sourced from a
  // url.  (e.g. ng-include, script src, templateUrl)
  RESOURCE_URL: 'resourceUrl',
  JS: 'js'
};

// Helper functions follow.

// Copied from:
// http://docs.closure-library.googlecode.com/git/closure_goog_string_string.js.source.html#line962
// Prereq: s is a string.
function escapeForRegexp(s) {
  return s.replace(/([-()\[\]{}+?*.$\^|,:#<!\\])/g, '\\$1').
           replace(/\x08/g, '\\x08');
}


function adjustMatcher(matcher) {
  if (matcher === 'self') {
    return matcher;
  } else if (isString(matcher)) {
    // Strings match exactly except for 2 wildcards - '*' and '**'.
    // '*' matches any character except those from the set ':/.?&'.
    // '**' matches any character (like .* in a RegExp).
    // More than 2 *'s raises an error as it's ill defined.
    if (matcher.indexOf('***') > -1) {
      throw $sceMinErr('iwcard',
          'Illegal sequence *** in string matcher.  String: {0}', matcher);
    }
    matcher = escapeForRegexp(matcher).
                  replace('\\*\\*', '.*').
                  replace('\\*', '[^:/.?&;]*');
    return new RegExp('^' + matcher + '$');
  } else if (isRegExp(matcher)) {
    // The only other type of matcher allowed is a Regexp.
    // Match entire URL / disallow partial matches.
    // Flags are reset (i.e. no global, ignoreCase or multiline)
    return new RegExp('^' + matcher.source + '$');
  } else {
    throw $sceMinErr('imatcher',
        'Matchers may only be "self", string patterns or RegExp objects');
  }
}


function adjustMatchers(matchers) {
  var adjustedMatchers = [];
  if (isDefined(matchers)) {
    forEach(matchers, function(matcher) {
      adjustedMatchers.push(adjustMatcher(matcher));
    });
  }
  return adjustedMatchers;
}


/**
 * @ngdoc service
 * @name ng.$sceDelegate
 * @function
 *
 * @description
 *
 * `$sceDelegate` is a service that is used by the `$sce` service to provide {@link ng.$sce Strict
 * Contextual Escaping (SCE)} services to AngularJS.
 *
 * Typically, you would configure or override the {@link ng.$sceDelegate $sceDelegate} instead of
 * the `$sce` service to customize the way Strict Contextual Escaping works in AngularJS.  This is
 * because, while the `$sce` provides numerous shorthand methods, etc., you really only need to
 * override 3 core functions (`trustAs`, `getTrusted` and `valueOf`) to replace the way things
 * work because `$sce` delegates to `$sceDelegate` for these operations.
 *
 * Refer {@link ng.$sceDelegateProvider $sceDelegateProvider} to configure this service.
 *
 * The default instance of `$sceDelegate` should work out of the box with little pain.  While you
 * can override it completely to change the behavior of `$sce`, the common case would
 * involve configuring the {@link ng.$sceDelegateProvider $sceDelegateProvider} instead by setting
 * your own whitelists and blacklists for trusting URLs used for loading AngularJS resources such as
 * templates.  Refer {@link ng.$sceDelegateProvider#methods_resourceUrlWhitelist
 * $sceDelegateProvider.resourceUrlWhitelist} and {@link
 * ng.$sceDelegateProvider#methods_resourceUrlBlacklist $sceDelegateProvider.resourceUrlBlacklist}
 */

/**
 * @ngdoc object
 * @name ng.$sceDelegateProvider
 * @description
 *
 * The `$sceDelegateProvider` provider allows developers to configure the {@link ng.$sceDelegate
 * $sceDelegate} service.  This allows one to get/set the whitelists and blacklists used to ensure
 * that the URLs used for sourcing Angular templates are safe.  Refer {@link
 * ng.$sceDelegateProvider#methods_resourceUrlWhitelist $sceDelegateProvider.resourceUrlWhitelist} and
 * {@link ng.$sceDelegateProvider#methods_resourceUrlBlacklist $sceDelegateProvider.resourceUrlBlacklist}
 *
 * For the general details about this service in Angular, read the main page for {@link ng.$sce
 * Strict Contextual Escaping (SCE)}.
 *
 * **Example**:  Consider the following case. <a name="example"></a>
 *
 * - your app is hosted at url `http://myapp.example.com/`
 * - but some of your templates are hosted on other domains you control such as
 *   `http://srv01.assets.example.com/`,  `http://srv02.assets.example.com/`, etc.
 * - and you have an open redirect at `http://myapp.example.com/clickThru?...`.
 *
 * Here is what a secure configuration for this scenario might look like:
 *
 * <pre class="prettyprint">
 *    angular.module('myApp', []).config(function($sceDelegateProvider) {
 *      $sceDelegateProvider.resourceUrlWhitelist([
 *        // Allow same origin resource loads.
 *        'self',
 *        // Allow loading from our assets domain.  Notice the difference between * and **.
 *        'http://srv*.assets.example.com/**']);
 *
 *      // The blacklist overrides the whitelist so the open redirect here is blocked.
 *      $sceDelegateProvider.resourceUrlBlacklist([
 *        'http://myapp.example.com/clickThru**']);
 *      });
 * </pre>
 */

function $SceDelegateProvider() {
  this.SCE_CONTEXTS = SCE_CONTEXTS;

  // Resource URLs can also be trusted by policy.
  var resourceUrlWhitelist = ['self'],
      resourceUrlBlacklist = [];

  /**
   * @ngdoc function
   * @name ng.sceDelegateProvider#resourceUrlWhitelist
   * @methodOf ng.$sceDelegateProvider
   * @function
   *
   * @param {Array=} whitelist When provided, replaces the resourceUrlWhitelist with the value
   *     provided.  This must be an array or null.  A snapshot of this array is used so further
   *     changes to the array are ignored.
   *
   *     Follow {@link ng.$sce#resourceUrlPatternItem this link} for a description of the items
   *     allowed in this array.
   *
   *     Note: **an empty whitelist array will block all URLs**!
   *
   * @return {Array} the currently set whitelist array.
   *
   * The **default value** when no whitelist has been explicitly set is `['self']` allowing only
   * same origin resource requests.
   *
   * @description
   * Sets/Gets the whitelist of trusted resource URLs.
   */
  this.resourceUrlWhitelist = function (value) {
    if (arguments.length) {
      resourceUrlWhitelist = adjustMatchers(value);
    }
    return resourceUrlWhitelist;
  };

  /**
   * @ngdoc function
   * @name ng.sceDelegateProvider#resourceUrlBlacklist
   * @methodOf ng.$sceDelegateProvider
   * @function
   *
   * @param {Array=} blacklist When provided, replaces the resourceUrlBlacklist with the value
   *     provided.  This must be an array or null.  A snapshot of this array is used so further
   *     changes to the array are ignored.
   *
   *     Follow {@link ng.$sce#resourceUrlPatternItem this link} for a description of the items
   *     allowed in this array.
   *
   *     The typical usage for the blacklist is to **block
   *     [open redirects](http://cwe.mitre.org/data/definitions/601.html)** served by your domain as
   *     these would otherwise be trusted but actually return content from the redirected domain.
   *
   *     Finally, **the blacklist overrides the whitelist** and has the final say.
   *
   * @return {Array} the currently set blacklist array.
   *
   * The **default value** when no whitelist has been explicitly set is the empty array (i.e. there
   * is no blacklist.)
   *
   * @description
   * Sets/Gets the blacklist of trusted resource URLs.
   */

  this.resourceUrlBlacklist = function (value) {
    if (arguments.length) {
      resourceUrlBlacklist = adjustMatchers(value);
    }
    return resourceUrlBlacklist;
  };

  this.$get = ['$log', '$document', '$injector', function(
                $log,   $document,   $injector) {

    var htmlSanitizer = function htmlSanitizer(html) {
      throw $sceMinErr('unsafe', 'Attempting to use an unsafe value in a safe context.');
    };

    if ($injector.has('$sanitize')) {
      htmlSanitizer = $injector.get('$sanitize');
    }


    function matchUrl(matcher, parsedUrl) {
      if (matcher === 'self') {
        return urlIsSameOrigin(parsedUrl);
      } else {
        // definitely a regex.  See adjustMatchers()
        return !!matcher.exec(parsedUrl.href);
      }
    }

    function isResourceUrlAllowedByPolicy(url) {
      var parsedUrl = urlResolve(url.toString());
      var i, n, allowed = false;
      // Ensure that at least one item from the whitelist allows this url.
      for (i = 0, n = resourceUrlWhitelist.length; i < n; i++) {
        if (matchUrl(resourceUrlWhitelist[i], parsedUrl)) {
          allowed = true;
          break;
        }
      }
      if (allowed) {
        // Ensure that no item from the blacklist blocked this url.
        for (i = 0, n = resourceUrlBlacklist.length; i < n; i++) {
          if (matchUrl(resourceUrlBlacklist[i], parsedUrl)) {
            allowed = false;
            break;
          }
        }
      }
      return allowed;
    }

    function generateHolderType(Base) {
      var holderType = function TrustedValueHolderType(trustedValue) {
        this.$$unwrapTrustedValue = function() {
          return trustedValue;
        };
      };
      if (Base) {
        holderType.prototype = new Base();
      }
      holderType.prototype.valueOf = function sceValueOf() {
        return this.$$unwrapTrustedValue();
      };
      holderType.prototype.toString = function sceToString() {
        return this.$$unwrapTrustedValue().toString();
      };
      return holderType;
    }

    var trustedValueHolderBase = generateHolderType(),
        byType = {};

    byType[SCE_CONTEXTS.HTML] = generateHolderType(trustedValueHolderBase);
    byType[SCE_CONTEXTS.CSS] = generateHolderType(trustedValueHolderBase);
    byType[SCE_CONTEXTS.URL] = generateHolderType(trustedValueHolderBase);
    byType[SCE_CONTEXTS.JS] = generateHolderType(trustedValueHolderBase);
    byType[SCE_CONTEXTS.RESOURCE_URL] = generateHolderType(byType[SCE_CONTEXTS.URL]);

    /**
     * @ngdoc method
     * @name ng.$sceDelegate#trustAs
     * @methodOf ng.$sceDelegate
     *
     * @description
     * Returns an object that is trusted by angular for use in specified strict
     * contextual escaping contexts (such as ng-html-bind-unsafe, ng-include, any src
     * attribute interpolation, any dom event binding attribute interpolation
     * such as for onclick,  etc.) that uses the provided value.
     * See {@link ng.$sce $sce} for enabling strict contextual escaping.
     *
     * @param {string} type The kind of context in which this value is safe for use.  e.g. url,
     *   resourceUrl, html, js and css.
     * @param {*} value The value that that should be considered trusted/safe.
     * @returns {*} A value that can be used to stand in for the provided `value` in places
     * where Angular expects a $sce.trustAs() return value.
     */
    function trustAs(type, trustedValue) {
      var Constructor = (byType.hasOwnProperty(type) ? byType[type] : null);
      if (!Constructor) {
        throw $sceMinErr('icontext',
            'Attempted to trust a value in invalid context. Context: {0}; Value: {1}',
            type, trustedValue);
      }
      if (trustedValue === null || trustedValue === undefined || trustedValue === '') {
        return trustedValue;
      }
      // All the current contexts in SCE_CONTEXTS happen to be strings.  In order to avoid trusting
      // mutable objects, we ensure here that the value passed in is actually a string.
      if (typeof trustedValue !== 'string') {
        throw $sceMinErr('itype',
            'Attempted to trust a non-string value in a content requiring a string: Context: {0}',
            type);
      }
      return new Constructor(trustedValue);
    }

    /**
     * @ngdoc method
     * @name ng.$sceDelegate#valueOf
     * @methodOf ng.$sceDelegate
     *
     * @description
     * If the passed parameter had been returned by a prior call to {@link ng.$sceDelegate#methods_trustAs
     * `$sceDelegate.trustAs`}, returns the value that had been passed to {@link
     * ng.$sceDelegate#methods_trustAs `$sceDelegate.trustAs`}.
     *
     * If the passed parameter is not a value that had been returned by {@link
     * ng.$sceDelegate#methods_trustAs `$sceDelegate.trustAs`}, returns it as-is.
     *
     * @param {*} value The result of a prior {@link ng.$sceDelegate#methods_trustAs `$sceDelegate.trustAs`}
     *      call or anything else.
     * @returns {*} The value the was originally provided to {@link ng.$sceDelegate#methods_trustAs
     *     `$sceDelegate.trustAs`} if `value` is the result of such a call.  Otherwise, returns
     *     `value` unchanged.
     */
    function valueOf(maybeTrusted) {
      if (maybeTrusted instanceof trustedValueHolderBase) {
        return maybeTrusted.$$unwrapTrustedValue();
      } else {
        return maybeTrusted;
      }
    }

    /**
     * @ngdoc method
     * @name ng.$sceDelegate#getTrusted
     * @methodOf ng.$sceDelegate
     *
     * @description
     * Takes the result of a {@link ng.$sceDelegate#methods_trustAs `$sceDelegate.trustAs`} call and
     * returns the originally supplied value if the queried context type is a supertype of the
     * created type.  If this condition isn't satisfied, throws an exception.
     *
     * @param {string} type The kind of context in which this value is to be used.
     * @param {*} maybeTrusted The result of a prior {@link ng.$sceDelegate#methods_trustAs
     *     `$sceDelegate.trustAs`} call.
     * @returns {*} The value the was originally provided to {@link ng.$sceDelegate#methods_trustAs
     *     `$sceDelegate.trustAs`} if valid in this context.  Otherwise, throws an exception.
     */
    function getTrusted(type, maybeTrusted) {
      if (maybeTrusted === null || maybeTrusted === undefined || maybeTrusted === '') {
        return maybeTrusted;
      }
      var constructor = (byType.hasOwnProperty(type) ? byType[type] : null);
      if (constructor && maybeTrusted instanceof constructor) {
        return maybeTrusted.$$unwrapTrustedValue();
      }
      // If we get here, then we may only take one of two actions.
      // 1. sanitize the value for the requested type, or
      // 2. throw an exception.
      if (type === SCE_CONTEXTS.RESOURCE_URL) {
        if (isResourceUrlAllowedByPolicy(maybeTrusted)) {
          return maybeTrusted;
        } else {
          throw $sceMinErr('insecurl',
              'Blocked loading resource from url not allowed by $sceDelegate policy.  URL: {0}',
              maybeTrusted.toString());
        }
      } else if (type === SCE_CONTEXTS.HTML) {
        return htmlSanitizer(maybeTrusted);
      }
      throw $sceMinErr('unsafe', 'Attempting to use an unsafe value in a safe context.');
    }

    return { trustAs: trustAs,
             getTrusted: getTrusted,
             valueOf: valueOf };
  }];
}


/**
 * @ngdoc object
 * @name ng.$sceProvider
 * @description
 *
 * The $sceProvider provider allows developers to configure the {@link ng.$sce $sce} service.
 * -   enable/disable Strict Contextual Escaping (SCE) in a module
 * -   override the default implementation with a custom delegate
 *
 * Read more about {@link ng.$sce Strict Contextual Escaping (SCE)}.
 */

/* jshint maxlen: false*/

/**
 * @ngdoc service
 * @name ng.$sce
 * @function
 *
 * @description
 *
 * `$sce` is a service that provides Strict Contextual Escaping services to AngularJS.
 *
 * # Strict Contextual Escaping
 *
 * Strict Contextual Escaping (SCE) is a mode in which AngularJS requires bindings in certain
 * contexts to result in a value that is marked as safe to use for that context.  One example of
 * such a context is binding arbitrary html controlled by the user via `ng-bind-html`.  We refer
 * to these contexts as privileged or SCE contexts.
 *
 * As of version 1.2, Angular ships with SCE enabled by default.
 *
 * Note:  When enabled (the default), IE8 in quirks mode is not supported.  In this mode, IE8 allows
 * one to execute arbitrary javascript by the use of the expression() syntax.  Refer
 * <http://blogs.msdn.com/b/ie/archive/2008/10/16/ending-expressions.aspx> to learn more about them.
 * You can ensure your document is in standards mode and not quirks mode by adding `<!doctype html>`
 * to the top of your HTML document.
 *
 * SCE assists in writing code in way that (a) is secure by default and (b) makes auditing for
 * security vulnerabilities such as XSS, clickjacking, etc. a lot easier.
 *
 * Here's an example of a binding in a privileged context:
 *
 * <pre class="prettyprint">
 *     <input ng-model="userHtml">
 *     <div ng-bind-html="userHtml">
 * </pre>
 *
 * Notice that `ng-bind-html` is bound to `userHtml` controlled by the user.  With SCE
 * disabled, this application allows the user to render arbitrary HTML into the DIV.
 * In a more realistic example, one may be rendering user comments, blog articles, etc. via
 * bindings.  (HTML is just one example of a context where rendering user controlled input creates
 * security vulnerabilities.)
 *
 * For the case of HTML, you might use a library, either on the client side, or on the server side,
 * to sanitize unsafe HTML before binding to the value and rendering it in the document.
 *
 * How would you ensure that every place that used these types of bindings was bound to a value that
 * was sanitized by your library (or returned as safe for rendering by your server?)  How can you
 * ensure that you didn't accidentally delete the line that sanitized the value, or renamed some
 * properties/fields and forgot to update the binding to the sanitized value?
 *
 * To be secure by default, you want to ensure that any such bindings are disallowed unless you can
 * determine that something explicitly says it's safe to use a value for binding in that
 * context.  You can then audit your code (a simple grep would do) to ensure that this is only done
 * for those values that you can easily tell are safe - because they were received from your server,
 * sanitized by your library, etc.  You can organize your codebase to help with this - perhaps
 * allowing only the files in a specific directory to do this.  Ensuring that the internal API
 * exposed by that code doesn't markup arbitrary values as safe then becomes a more manageable task.
 *
 * In the case of AngularJS' SCE service, one uses {@link ng.$sce#methods_trustAs $sce.trustAs} 
 * (and shorthand methods such as {@link ng.$sce#methods_trustAsHtml $sce.trustAsHtml}, etc.) to
 * obtain values that will be accepted by SCE / privileged contexts.
 *
 *
 * ## How does it work?
 *
 * In privileged contexts, directives and code will bind to the result of {@link ng.$sce#methods_getTrusted
 * $sce.getTrusted(context, value)} rather than to the value directly.  Directives use {@link
 * ng.$sce#methods_parse $sce.parseAs} rather than `$parse` to watch attribute bindings, which performs the
 * {@link ng.$sce#methods_getTrusted $sce.getTrusted} behind the scenes on non-constant literals.
 *
 * As an example, {@link ng.directive:ngBindHtml ngBindHtml} uses {@link
 * ng.$sce#methods_parseAsHtml $sce.parseAsHtml(binding expression)}.  Here's the actual code (slightly
 * simplified):
 *
 * <pre class="prettyprint">
 *   var ngBindHtmlDirective = ['$sce', function($sce) {
 *     return function(scope, element, attr) {
 *       scope.$watch($sce.parseAsHtml(attr.ngBindHtml), function(value) {
 *         element.html(value || '');
 *       });
 *     };
 *   }];
 * </pre>
 *
 * ## Impact on loading templates
 *
 * This applies both to the {@link ng.directive:ngInclude `ng-include`} directive as well as
 * `templateUrl`'s specified by {@link guide/directive directives}.
 *
 * By default, Angular only loads templates from the same domain and protocol as the application
 * document.  This is done by calling {@link ng.$sce#methods_getTrustedResourceUrl
 * $sce.getTrustedResourceUrl} on the template URL.  To load templates from other domains and/or
 * protocols, you may either either {@link ng.$sceDelegateProvider#methods_resourceUrlWhitelist whitelist
 * them} or {@link ng.$sce#methods_trustAsResourceUrl wrap it} into a trusted value.
 *
 * *Please note*:
 * The browser's
 * {@link https://code.google.com/p/browsersec/wiki/Part2#Same-origin_policy_for_XMLHttpRequest
 * Same Origin Policy} and {@link http://www.w3.org/TR/cors/ Cross-Origin Resource Sharing (CORS)}
 * policy apply in addition to this and may further restrict whether the template is successfully
 * loaded.  This means that without the right CORS policy, loading templates from a different domain
 * won't work on all browsers.  Also, loading templates from `file://` URL does not work on some
 * browsers.
 *
 * ## This feels like too much overhead for the developer?
 *
 * It's important to remember that SCE only applies to interpolation expressions.
 *
 * If your expressions are constant literals, they're automatically trusted and you don't need to
 * call `$sce.trustAs` on them.  (e.g.
 * `<div ng-html-bind-unsafe="'<b>implicitly trusted</b>'"></div>`) just works.
 *
 * Additionally, `a[href]` and `img[src]` automatically sanitize their URLs and do not pass them
 * through {@link ng.$sce#methods_getTrusted $sce.getTrusted}.  SCE doesn't play a role here.
 *
 * The included {@link ng.$sceDelegate $sceDelegate} comes with sane defaults to allow you to load
 * templates in `ng-include` from your application's domain without having to even know about SCE.
 * It blocks loading templates from other domains or loading templates over http from an https
 * served document.  You can change these by setting your own custom {@link
 * ng.$sceDelegateProvider#methods_resourceUrlWhitelist whitelists} and {@link
 * ng.$sceDelegateProvider#methods_resourceUrlBlacklist blacklists} for matching such URLs.
 *
 * This significantly reduces the overhead.  It is far easier to pay the small overhead and have an
 * application that's secure and can be audited to verify that with much more ease than bolting
 * security onto an application later.
 *
 * <a name="contexts"></a>
 * ## What trusted context types are supported?
 *
 * | Context             | Notes          |
 * |---------------------|----------------|
 * | `$sce.HTML`         | For HTML that's safe to source into the application.  The {@link ng.directive:ngBindHtml ngBindHtml} directive uses this context for bindings. |
 * | `$sce.CSS`          | For CSS that's safe to source into the application.  Currently unused.  Feel free to use it in your own directives. |
 * | `$sce.URL`          | For URLs that are safe to follow as links.  Currently unused (`<a href=` and `<img src=` sanitize their urls and don't consititute an SCE context. |
 * | `$sce.RESOURCE_URL` | For URLs that are not only safe to follow as links, but whose contens are also safe to include in your application.  Examples include `ng-include`, `src` / `ngSrc` bindings for tags other than `IMG` (e.g. `IFRAME`, `OBJECT`, etc.)  <br><br>Note that `$sce.RESOURCE_URL` makes a stronger statement about the URL than `$sce.URL` does and therefore contexts requiring values trusted for `$sce.RESOURCE_URL` can be used anywhere that values trusted for `$sce.URL` are required. |
 * | `$sce.JS`           | For JavaScript that is safe to execute in your application's context.  Currently unused.  Feel free to use it in your own directives. |
 *
 * ## Format of items in {@link ng.$sceDelegateProvider#methods_resourceUrlWhitelist resourceUrlWhitelist}/{@link ng.$sceDelegateProvider#methods_resourceUrlBlacklist Blacklist} <a name="resourceUrlPatternItem"></a>
 *
 *  Each element in these arrays must be one of the following:
 *
 *  - **'self'**
 *    - The special **string**, `'self'`, can be used to match against all URLs of the **same
 *      domain** as the application document using the **same protocol**.
 *  - **String** (except the special value `'self'`)
 *    - The string is matched against the full *normalized / absolute URL* of the resource
 *      being tested (substring matches are not good enough.)
 *    - There are exactly **two wildcard sequences** - `*` and `**`.  All other characters
 *      match themselves.
 *    - `*`: matches zero or more occurances of any character other than one of the following 6
 *      characters: '`:`', '`/`', '`.`', '`?`', '`&`' and ';'.  It's a useful wildcard for use
 *      in a whitelist.
 *    - `**`: matches zero or more occurances of *any* character.  As such, it's not
 *      not appropriate to use in for a scheme, domain, etc. as it would match too much.  (e.g.
 *      http://**.example.com/ would match http://evil.com/?ignore=.example.com/ and that might
 *      not have been the intention.)  It's usage at the very end of the path is ok.  (e.g.
 *      http://foo.example.com/templates/**).
 *  - **RegExp** (*see caveat below*)
 *    - *Caveat*:  While regular expressions are powerful and offer great flexibility,  their syntax
 *      (and all the inevitable escaping) makes them *harder to maintain*.  It's easy to
 *      accidentally introduce a bug when one updates a complex expression (imho, all regexes should
 *      have good test coverage.).  For instance, the use of `.` in the regex is correct only in a
 *      small number of cases.  A `.` character in the regex used when matching the scheme or a
 *      subdomain could be matched against a `:` or literal `.` that was likely not intended.   It
 *      is highly recommended to use the string patterns and only fall back to regular expressions
 *      if they as a last resort.
 *    - The regular expression must be an instance of RegExp (i.e. not a string.)  It is
 *      matched against the **entire** *normalized / absolute URL* of the resource being tested
 *      (even when the RegExp did not have the `^` and `$` codes.)  In addition, any flags
 *      present on the RegExp (such as multiline, global, ignoreCase) are ignored.
 *    - If you are generating your Javascript from some other templating engine (not
 *      recommended, e.g. in issue [#4006](https://github.com/angular/angular.js/issues/4006)),
 *      remember to escape your regular expression (and be aware that you might need more than
 *      one level of escaping depending on your templating engine and the way you interpolated
 *      the value.)  Do make use of your platform's escaping mechanism as it might be good
 *      enough before coding your own.  e.g. Ruby has
 *      [Regexp.escape(str)](http://www.ruby-doc.org/core-2.0.0/Regexp.html#method-c-escape)
 *      and Python has [re.escape](http://docs.python.org/library/re.html#re.escape).
 *      Javascript lacks a similar built in function for escaping.  Take a look at Google
 *      Closure library's [goog.string.regExpEscape(s)](
 *      http://docs.closure-library.googlecode.com/git/closure_goog_string_string.js.source.html#line962).
 *
 * Refer {@link ng.$sceDelegateProvider $sceDelegateProvider} for an example.
 *
 * ## Show me an example using SCE.
 *
 * @example
<example module="mySceApp">
<file name="index.html">
  <div ng-controller="myAppController as myCtrl">
    <i ng-bind-html="myCtrl.explicitlyTrustedHtml" id="explicitlyTrustedHtml"></i><br><br>
    <b>User comments</b><br>
    By default, HTML that isn't explicitly trusted (e.g. Alice's comment) is sanitized when
    $sanitize is available.  If $sanitize isn't available, this results in an error instead of an
    exploit.
    <div class="well">
      <div ng-repeat="userComment in myCtrl.userComments">
        <b>{{userComment.name}}</b>:
        <span ng-bind-html="userComment.htmlComment" class="htmlComment"></span>
        <br>
      </div>
    </div>
  </div>
</file>

<file name="script.js">
  var mySceApp = angular.module('mySceApp', ['ngSanitize']);

  mySceApp.controller("myAppController", function myAppController($http, $templateCache, $sce) {
    var self = this;
    $http.get("test_data.json", {cache: $templateCache}).success(function(userComments) {
      self.userComments = userComments;
    });
    self.explicitlyTrustedHtml = $sce.trustAsHtml(
        '<span onmouseover="this.textContent=&quot;Explicitly trusted HTML bypasses ' +
        'sanitization.&quot;">Hover over this text.</span>');
  });
</file>

<file name="test_data.json">
[
  { "name": "Alice",
    "htmlComment":
        "<span onmouseover='this.textContent=\"PWN3D!\"'>Is <i>anyone</i> reading this?</span>"
  },
  { "name": "Bob",
    "htmlComment": "<i>Yes!</i>  Am I the only other one?"
  }
]
</file>

<file name="scenario.js">
  describe('SCE doc demo', function() {
    it('should sanitize untrusted values', function() {
      expect(element('.htmlComment').html()).toBe('<span>Is <i>anyone</i> reading this?</span>');
    });
    it('should NOT sanitize explicitly trusted values', function() {
      expect(element('#explicitlyTrustedHtml').html()).toBe(
          '<span onmouseover="this.textContent=&quot;Explicitly trusted HTML bypasses ' +
          'sanitization.&quot;">Hover over this text.</span>');
    });
  });
</file>
</example>
 *
 *
 *
 * ## Can I disable SCE completely?
 *
 * Yes, you can.  However, this is strongly discouraged.  SCE gives you a lot of security benefits
 * for little coding overhead.  It will be much harder to take an SCE disabled application and
 * either secure it on your own or enable SCE at a later stage.  It might make sense to disable SCE
 * for cases where you have a lot of existing code that was written before SCE was introduced and
 * you're migrating them a module at a time.
 *
 * That said, here's how you can completely disable SCE:
 *
 * <pre class="prettyprint">
 *   angular.module('myAppWithSceDisabledmyApp', []).config(function($sceProvider) {
 *     // Completely disable SCE.  For demonstration purposes only!
 *     // Do not use in new projects.
 *     $sceProvider.enabled(false);
 *   });
 * </pre>
 *
 */
/* jshint maxlen: 100 */

function $SceProvider() {
  var enabled = true;

  /**
   * @ngdoc function
   * @name ng.sceProvider#enabled
   * @methodOf ng.$sceProvider
   * @function
   *
   * @param {boolean=} value If provided, then enables/disables SCE.
   * @return {boolean} true if SCE is enabled, false otherwise.
   *
   * @description
   * Enables/disables SCE and returns the current value.
   */
  this.enabled = function (value) {
    if (arguments.length) {
      enabled = !!value;
    }
    return enabled;
  };


  /* Design notes on the default implementation for SCE.
   *
   * The API contract for the SCE delegate
   * -------------------------------------
   * The SCE delegate object must provide the following 3 methods:
   *
   * - trustAs(contextEnum, value)
   *     This method is used to tell the SCE service that the provided value is OK to use in the
   *     contexts specified by contextEnum.  It must return an object that will be accepted by
   *     getTrusted() for a compatible contextEnum and return this value.
   *
   * - valueOf(value)
   *     For values that were not produced by trustAs(), return them as is.  For values that were
   *     produced by trustAs(), return the corresponding input value to trustAs.  Basically, if
   *     trustAs is wrapping the given values into some type, this operation unwraps it when given
   *     such a value.
   *
   * - getTrusted(contextEnum, value)
   *     This function should return the a value that is safe to use in the context specified by
   *     contextEnum or throw and exception otherwise.
   *
   * NOTE: This contract deliberately does NOT state that values returned by trustAs() must be
   * opaque or wrapped in some holder object.  That happens to be an implementation detail.  For
   * instance, an implementation could maintain a registry of all trusted objects by context.  In
   * such a case, trustAs() would return the same object that was passed in.  getTrusted() would
   * return the same object passed in if it was found in the registry under a compatible context or
   * throw an exception otherwise.  An implementation might only wrap values some of the time based
   * on some criteria.  getTrusted() might return a value and not throw an exception for special
   * constants or objects even if not wrapped.  All such implementations fulfill this contract.
   *
   *
   * A note on the inheritance model for SCE contexts
   * ------------------------------------------------
   * I've used inheritance and made RESOURCE_URL wrapped types a subtype of URL wrapped types.  This
   * is purely an implementation details.
   *
   * The contract is simply this:
   *
   *     getTrusted($sce.RESOURCE_URL, value) succeeding implies that getTrusted($sce.URL, value)
   *     will also succeed.
   *
   * Inheritance happens to capture this in a natural way.  In some future, we
   * may not use inheritance anymore.  That is OK because no code outside of
   * sce.js and sceSpecs.js would need to be aware of this detail.
   */

  this.$get = ['$parse', '$document', '$sceDelegate', function(
                $parse,   $document,   $sceDelegate) {
    // Prereq: Ensure that we're not running in IE8 quirks mode.  In that mode, IE allows
    // the "expression(javascript expression)" syntax which is insecure.
    if (enabled && msie) {
      var documentMode = $document[0].documentMode;
      if (documentMode !== undefined && documentMode < 8) {
        throw $sceMinErr('iequirks',
          'Strict Contextual Escaping does not support Internet Explorer version < 9 in quirks ' +
          'mode.  You can fix this by adding the text <!doctype html> to the top of your HTML ' +
          'document.  See http://docs.angularjs.org/api/ng.$sce for more information.');
      }
    }

    var sce = copy(SCE_CONTEXTS);

    /**
     * @ngdoc function
     * @name ng.sce#isEnabled
     * @methodOf ng.$sce
     * @function
     *
     * @return {Boolean} true if SCE is enabled, false otherwise.  If you want to set the value, you
     * have to do it at module config time on {@link ng.$sceProvider $sceProvider}.
     *
     * @description
     * Returns a boolean indicating if SCE is enabled.
     */
    sce.isEnabled = function () {
      return enabled;
    };
    sce.trustAs = $sceDelegate.trustAs;
    sce.getTrusted = $sceDelegate.getTrusted;
    sce.valueOf = $sceDelegate.valueOf;

    if (!enabled) {
      sce.trustAs = sce.getTrusted = function(type, value) { return value; };
      sce.valueOf = identity;
    }

    /**
     * @ngdoc method
     * @name ng.$sce#parse
     * @methodOf ng.$sce
     *
     * @description
     * Converts Angular {@link guide/expression expression} into a function.  This is like {@link
     * ng.$parse $parse} and is identical when the expression is a literal constant.  Otherwise, it
     * wraps the expression in a call to {@link ng.$sce#methods_getTrusted $sce.getTrusted(*type*,
     * *result*)}
     *
     * @param {string} type The kind of SCE context in which this result will be used.
     * @param {string} expression String expression to compile.
     * @returns {function(context, locals)} a function which represents the compiled expression:
     *
     *    * `context` – `{object}` – an object against which any expressions embedded in the strings
     *      are evaluated against (typically a scope object).
     *    * `locals` – `{object=}` – local variables context object, useful for overriding values in
     *      `context`.
     */
    sce.parseAs = function sceParseAs(type, expr) {
      var parsed = $parse(expr);
      if (parsed.literal && parsed.constant) {
        return parsed;
      } else {
        return function sceParseAsTrusted(self, locals) {
          return sce.getTrusted(type, parsed(self, locals));
        };
      }
    };

    /**
     * @ngdoc method
     * @name ng.$sce#trustAs
     * @methodOf ng.$sce
     *
     * @description
     * Delegates to {@link ng.$sceDelegate#methods_trustAs `$sceDelegate.trustAs`}.  As such,
     * returns an objectthat is trusted by angular for use in specified strict contextual
     * escaping contexts (such as ng-html-bind-unsafe, ng-include, any src attribute
     * interpolation, any dom event binding attribute interpolation such as for onclick,  etc.)
     * that uses the provided value.  See * {@link ng.$sce $sce} for enabling strict contextual
     * escaping.
     *
     * @param {string} type The kind of context in which this value is safe for use.  e.g. url,
     *   resource_url, html, js and css.
     * @param {*} value The value that that should be considered trusted/safe.
     * @returns {*} A value that can be used to stand in for the provided `value` in places
     * where Angular expects a $sce.trustAs() return value.
     */

    /**
     * @ngdoc method
     * @name ng.$sce#trustAsHtml
     * @methodOf ng.$sce
     *
     * @description
     * Shorthand method.  `$sce.trustAsHtml(value)` →
     *     {@link ng.$sceDelegate#methods_trustAs `$sceDelegate.trustAs($sce.HTML, value)`}
     *
     * @param {*} value The value to trustAs.
     * @returns {*} An object that can be passed to {@link ng.$sce#methods_getTrustedHtml
     *     $sce.getTrustedHtml(value)} to obtain the original value.  (privileged directives
     *     only accept expressions that are either literal constants or are the
     *     return value of {@link ng.$sce#methods_trustAs $sce.trustAs}.)
     */

    /**
     * @ngdoc method
     * @name ng.$sce#trustAsUrl
     * @methodOf ng.$sce
     *
     * @description
     * Shorthand method.  `$sce.trustAsUrl(value)` →
     *     {@link ng.$sceDelegate#methods_trustAs `$sceDelegate.trustAs($sce.URL, value)`}
     *
     * @param {*} value The value to trustAs.
     * @returns {*} An object that can be passed to {@link ng.$sce#methods_getTrustedUrl
     *     $sce.getTrustedUrl(value)} to obtain the original value.  (privileged directives
     *     only accept expressions that are either literal constants or are the
     *     return value of {@link ng.$sce#methods_trustAs $sce.trustAs}.)
     */

    /**
     * @ngdoc method
     * @name ng.$sce#trustAsResourceUrl
     * @methodOf ng.$sce
     *
     * @description
     * Shorthand method.  `$sce.trustAsResourceUrl(value)` →
     *     {@link ng.$sceDelegate#methods_trustAs `$sceDelegate.trustAs($sce.RESOURCE_URL, value)`}
     *
     * @param {*} value The value to trustAs.
     * @returns {*} An object that can be passed to {@link ng.$sce#methods_getTrustedResourceUrl
     *     $sce.getTrustedResourceUrl(value)} to obtain the original value.  (privileged directives
     *     only accept expressions that are either literal constants or are the return
     *     value of {@link ng.$sce#methods_trustAs $sce.trustAs}.)
     */

    /**
     * @ngdoc method
     * @name ng.$sce#trustAsJs
     * @methodOf ng.$sce
     *
     * @description
     * Shorthand method.  `$sce.trustAsJs(value)` →
     *     {@link ng.$sceDelegate#methods_trustAs `$sceDelegate.trustAs($sce.JS, value)`}
     *
     * @param {*} value The value to trustAs.
     * @returns {*} An object that can be passed to {@link ng.$sce#methods_getTrustedJs
     *     $sce.getTrustedJs(value)} to obtain the original value.  (privileged directives
     *     only accept expressions that are either literal constants or are the
     *     return value of {@link ng.$sce#methods_trustAs $sce.trustAs}.)
     */

    /**
     * @ngdoc method
     * @name ng.$sce#getTrusted
     * @methodOf ng.$sce
     *
     * @description
     * Delegates to {@link ng.$sceDelegate#methods_getTrusted `$sceDelegate.getTrusted`}.  As such,
     * takes the result of a {@link ng.$sce#methods_trustAs `$sce.trustAs`}() call and returns the
     * originally supplied value if the queried context type is a supertype of the created type.
     * If this condition isn't satisfied, throws an exception.
     *
     * @param {string} type The kind of context in which this value is to be used.
     * @param {*} maybeTrusted The result of a prior {@link ng.$sce#methods_trustAs `$sce.trustAs`}
     *                         call.
     * @returns {*} The value the was originally provided to
     *              {@link ng.$sce#methods_trustAs `$sce.trustAs`} if valid in this context.
     *              Otherwise, throws an exception.
     */

    /**
     * @ngdoc method
     * @name ng.$sce#getTrustedHtml
     * @methodOf ng.$sce
     *
     * @description
     * Shorthand method.  `$sce.getTrustedHtml(value)` →
     *     {@link ng.$sceDelegate#methods_getTrusted `$sceDelegate.getTrusted($sce.HTML, value)`}
     *
     * @param {*} value The value to pass to `$sce.getTrusted`.
     * @returns {*} The return value of `$sce.getTrusted($sce.HTML, value)`
     */

    /**
     * @ngdoc method
     * @name ng.$sce#getTrustedCss
     * @methodOf ng.$sce
     *
     * @description
     * Shorthand method.  `$sce.getTrustedCss(value)` →
     *     {@link ng.$sceDelegate#methods_getTrusted `$sceDelegate.getTrusted($sce.CSS, value)`}
     *
     * @param {*} value The value to pass to `$sce.getTrusted`.
     * @returns {*} The return value of `$sce.getTrusted($sce.CSS, value)`
     */

    /**
     * @ngdoc method
     * @name ng.$sce#getTrustedUrl
     * @methodOf ng.$sce
     *
     * @description
     * Shorthand method.  `$sce.getTrustedUrl(value)` →
     *     {@link ng.$sceDelegate#methods_getTrusted `$sceDelegate.getTrusted($sce.URL, value)`}
     *
     * @param {*} value The value to pass to `$sce.getTrusted`.
     * @returns {*} The return value of `$sce.getTrusted($sce.URL, value)`
     */

    /**
     * @ngdoc method
     * @name ng.$sce#getTrustedResourceUrl
     * @methodOf ng.$sce
     *
     * @description
     * Shorthand method.  `$sce.getTrustedResourceUrl(value)` →
     *     {@link ng.$sceDelegate#methods_getTrusted `$sceDelegate.getTrusted($sce.RESOURCE_URL, value)`}
     *
     * @param {*} value The value to pass to `$sceDelegate.getTrusted`.
     * @returns {*} The return value of `$sce.getTrusted($sce.RESOURCE_URL, value)`
     */

    /**
     * @ngdoc method
     * @name ng.$sce#getTrustedJs
     * @methodOf ng.$sce
     *
     * @description
     * Shorthand method.  `$sce.getTrustedJs(value)` →
     *     {@link ng.$sceDelegate#methods_getTrusted `$sceDelegate.getTrusted($sce.JS, value)`}
     *
     * @param {*} value The value to pass to `$sce.getTrusted`.
     * @returns {*} The return value of `$sce.getTrusted($sce.JS, value)`
     */

    /**
     * @ngdoc method
     * @name ng.$sce#parseAsHtml
     * @methodOf ng.$sce
     *
     * @description
     * Shorthand method.  `$sce.parseAsHtml(expression string)` →
     *     {@link ng.$sce#methods_parse `$sce.parseAs($sce.HTML, value)`}
     *
     * @param {string} expression String expression to compile.
     * @returns {function(context, locals)} a function which represents the compiled expression:
     *
     *    * `context` – `{object}` – an object against which any expressions embedded in the strings
     *      are evaluated against (typically a scope object).
     *    * `locals` – `{object=}` – local variables context object, useful for overriding values in
     *      `context`.
     */

    /**
     * @ngdoc method
     * @name ng.$sce#parseAsCss
     * @methodOf ng.$sce
     *
     * @description
     * Shorthand method.  `$sce.parseAsCss(value)` →
     *     {@link ng.$sce#methods_parse `$sce.parseAs($sce.CSS, value)`}
     *
     * @param {string} expression String expression to compile.
     * @returns {function(context, locals)} a function which represents the compiled expression:
     *
     *    * `context` – `{object}` – an object against which any expressions embedded in the strings
     *      are evaluated against (typically a scope object).
     *    * `locals` – `{object=}` – local variables context object, useful for overriding values in
     *      `context`.
     */

    /**
     * @ngdoc method
     * @name ng.$sce#parseAsUrl
     * @methodOf ng.$sce
     *
     * @description
     * Shorthand method.  `$sce.parseAsUrl(value)` →
     *     {@link ng.$sce#methods_parse `$sce.parseAs($sce.URL, value)`}
     *
     * @param {string} expression String expression to compile.
     * @returns {function(context, locals)} a function which represents the compiled expression:
     *
     *    * `context` – `{object}` – an object against which any expressions embedded in the strings
     *      are evaluated against (typically a scope object).
     *    * `locals` – `{object=}` – local variables context object, useful for overriding values in
     *      `context`.
     */

    /**
     * @ngdoc method
     * @name ng.$sce#parseAsResourceUrl
     * @methodOf ng.$sce
     *
     * @description
     * Shorthand method.  `$sce.parseAsResourceUrl(value)` →
     *     {@link ng.$sce#methods_parse `$sce.parseAs($sce.RESOURCE_URL, value)`}
     *
     * @param {string} expression String expression to compile.
     * @returns {function(context, locals)} a function which represents the compiled expression:
     *
     *    * `context` – `{object}` – an object against which any expressions embedded in the strings
     *      are evaluated against (typically a scope object).
     *    * `locals` – `{object=}` – local variables context object, useful for overriding values in
     *      `context`.
     */

    /**
     * @ngdoc method
     * @name ng.$sce#parseAsJs
     * @methodOf ng.$sce
     *
     * @description
     * Shorthand method.  `$sce.parseAsJs(value)` →
     *     {@link ng.$sce#methods_parse `$sce.parseAs($sce.JS, value)`}
     *
     * @param {string} expression String expression to compile.
     * @returns {function(context, locals)} a function which represents the compiled expression:
     *
     *    * `context` – `{object}` – an object against which any expressions embedded in the strings
     *      are evaluated against (typically a scope object).
     *    * `locals` – `{object=}` – local variables context object, useful for overriding values in
     *      `context`.
     */

    // Shorthand delegations.
    var parse = sce.parseAs,
        getTrusted = sce.getTrusted,
        trustAs = sce.trustAs;

    forEach(SCE_CONTEXTS, function (enumValue, name) {
      var lName = lowercase(name);
      sce[camelCase("parse_as_" + lName)] = function (expr) {
        return parse(enumValue, expr);
      };
      sce[camelCase("get_trusted_" + lName)] = function (value) {
        return getTrusted(enumValue, value);
      };
      sce[camelCase("trust_as_" + lName)] = function (value) {
        return trustAs(enumValue, value);
      };
    });

    return sce;
  }];
}

/**
 * !!! This is an undocumented "private" service !!!
 *
 * @name ng.$sniffer
 * @requires $window
 * @requires $document
 *
 * @property {boolean} history Does the browser support html5 history api ?
 * @property {boolean} hashchange Does the browser support hashchange event ?
 * @property {boolean} transitions Does the browser support CSS transition events ?
 * @property {boolean} animations Does the browser support CSS animation events ?
 *
 * @description
 * This is very simple implementation of testing browser's features.
 */
function $SnifferProvider() {
  this.$get = ['$window', '$document', function($window, $document) {
    var eventSupport = {},
        android =
          int((/android (\d+)/.exec(lowercase(($window.navigator || {}).userAgent)) || [])[1]),
        boxee = /Boxee/i.test(($window.navigator || {}).userAgent),
        document = $document[0] || {},
        vendorPrefix,
        vendorRegex = /^(Moz|webkit|O|ms)(?=[A-Z])/,
        bodyStyle = document.body && document.body.style,
        transitions = false,
        animations = false,
        match;

    if (bodyStyle) {
      for(var prop in bodyStyle) {
        if(match = vendorRegex.exec(prop)) {
          vendorPrefix = match[0];
          vendorPrefix = vendorPrefix.substr(0, 1).toUpperCase() + vendorPrefix.substr(1);
          break;
        }
      }

      if(!vendorPrefix) {
        vendorPrefix = ('WebkitOpacity' in bodyStyle) && 'webkit';
      }

      transitions = !!(('transition' in bodyStyle) || (vendorPrefix + 'Transition' in bodyStyle));
      animations  = !!(('animation' in bodyStyle) || (vendorPrefix + 'Animation' in bodyStyle));

      if (android && (!transitions||!animations)) {
        transitions = isString(document.body.style.webkitTransition);
        animations = isString(document.body.style.webkitAnimation);
      }
    }


    return {
      // Android has history.pushState, but it does not update location correctly
      // so let's not use the history API at all.
      // http://code.google.com/p/android/issues/detail?id=17471
      // https://github.com/angular/angular.js/issues/904

      // older webit browser (533.9) on Boxee box has exactly the same problem as Android has
      // so let's not use the history API also
      // We are purposefully using `!(android < 4)` to cover the case when `android` is undefined
      // jshint -W018
      history: !!($window.history && $window.history.pushState && !(android < 4) && !boxee),
      // jshint +W018
      hashchange: 'onhashchange' in $window &&
                  // IE8 compatible mode lies
                  (!document.documentMode || document.documentMode > 7),
      hasEvent: function(event) {
        // IE9 implements 'input' event it's so fubared that we rather pretend that it doesn't have
        // it. In particular the event is not fired when backspace or delete key are pressed or
        // when cut operation is performed.
        if (event == 'input' && msie == 9) return false;

        if (isUndefined(eventSupport[event])) {
          var divElm = document.createElement('div');
          eventSupport[event] = 'on' + event in divElm;
        }

        return eventSupport[event];
      },
      csp: csp(),
      vendorPrefix: vendorPrefix,
      transitions : transitions,
      animations : animations,
      msie : msie
    };
  }];
}

function $TimeoutProvider() {
  this.$get = ['$rootScope', '$browser', '$q', '$exceptionHandler',
       function($rootScope,   $browser,   $q,   $exceptionHandler) {
    var deferreds = {};


     /**
      * @ngdoc function
      * @name ng.$timeout
      * @requires $browser
      *
      * @description
      * Angular's wrapper for `window.setTimeout`. The `fn` function is wrapped into a try/catch
      * block and delegates any exceptions to
      * {@link ng.$exceptionHandler $exceptionHandler} service.
      *
      * The return value of registering a timeout function is a promise, which will be resolved when
      * the timeout is reached and the timeout function is executed.
      *
      * To cancel a timeout request, call `$timeout.cancel(promise)`.
      *
      * In tests you can use {@link ngMock.$timeout `$timeout.flush()`} to
      * synchronously flush the queue of deferred functions.
      *
      * @param {function()} fn A function, whose execution should be delayed.
      * @param {number=} [delay=0] Delay in milliseconds.
      * @param {boolean=} [invokeApply=true] If set to `false` skips model dirty checking, otherwise
      *   will invoke `fn` within the {@link ng.$rootScope.Scope#methods_$apply $apply} block.
      * @returns {Promise} Promise that will be resolved when the timeout is reached. The value this
      *   promise will be resolved with is the return value of the `fn` function.
      * 
      * @example
      <doc:example module="time">
        <doc:source>
          <script>
            function Ctrl2($scope,$timeout) {
              $scope.format = 'M/d/yy h:mm:ss a';
              $scope.blood_1 = 100;
              $scope.blood_2 = 120;

              var stop;
              $scope.fight = function() {
                stop = $timeout(function() {
                  if ($scope.blood_1 > 0 && $scope.blood_2 > 0) {
                      $scope.blood_1 = $scope.blood_1 - 3;
                      $scope.blood_2 = $scope.blood_2 - 4;
                      $scope.fight();
                  } else {
                      $timeout.cancel(stop);
                  }
                }, 100);
              };

              $scope.stopFight = function() {
                $timeout.cancel(stop);
              };

              $scope.resetFight = function() {
                $scope.blood_1 = 100;
                $scope.blood_2 = 120;
              }
            }

            angular.module('time', [])
              // Register the 'myCurrentTime' directive factory method.
              // We inject $timeout and dateFilter service since the factory method is DI.
              .directive('myCurrentTime', function($timeout, dateFilter) {
                // return the directive link function. (compile function not needed)
                return function(scope, element, attrs) {
                  var format,  // date format
                  timeoutId; // timeoutId, so that we can cancel the time updates

                  // used to update the UI
                  function updateTime() {
                    element.text(dateFilter(new Date(), format));
                  }

                  // watch the expression, and update the UI on change.
                  scope.$watch(attrs.myCurrentTime, function(value) {
                    format = value;
                    updateTime();
                  });

                  // schedule update in one second
                  function updateLater() {
                    // save the timeoutId for canceling
                    timeoutId = $timeout(function() {
                      updateTime(); // update DOM
                      updateLater(); // schedule another update
                    }, 1000);
                  }

                  // listen on DOM destroy (removal) event, and cancel the next UI update
                  // to prevent updating time ofter the DOM element was removed.
                  element.bind('$destroy', function() {
                    $timeout.cancel(timeoutId);
                  });

                  updateLater(); // kick off the UI update process.
                }
              });
          </script>

          <div>
            <div ng-controller="Ctrl2">
              Date format: <input ng-model="format"> <hr/>
              Current time is: <span my-current-time="format"></span>
              <hr/>
              Blood 1 : <font color='red'>{{blood_1}}</font>
              Blood 2 : <font color='red'>{{blood_2}}</font>
              <button type="button" data-ng-click="fight()">Fight</button>
              <button type="button" data-ng-click="stopFight()">StopFight</button>
              <button type="button" data-ng-click="resetFight()">resetFight</button>
            </div>
          </div>

        </doc:source>
      </doc:example>
      */
    function timeout(fn, delay, invokeApply) {
      var deferred = $q.defer(),
          promise = deferred.promise,
          skipApply = (isDefined(invokeApply) && !invokeApply),
          timeoutId;

      timeoutId = $browser.defer(function() {
        try {
          deferred.resolve(fn());
        } catch(e) {
          deferred.reject(e);
          $exceptionHandler(e);
        }
        finally {
          delete deferreds[promise.$$timeoutId];
        }

        if (!skipApply) $rootScope.$apply();
      }, delay);

      promise.$$timeoutId = timeoutId;
      deferreds[timeoutId] = deferred;

      return promise;
    }


     /**
      * @ngdoc function
      * @name ng.$timeout#cancel
      * @methodOf ng.$timeout
      *
      * @description
      * Cancels a task associated with the `promise`. As a result of this, the promise will be
      * resolved with a rejection.
      *
      * @param {Promise=} promise Promise returned by the `$timeout` function.
      * @returns {boolean} Returns `true` if the task hasn't executed yet and was successfully
      *   canceled.
      */
    timeout.cancel = function(promise) {
      if (promise && promise.$$timeoutId in deferreds) {
        deferreds[promise.$$timeoutId].reject('canceled');
        delete deferreds[promise.$$timeoutId];
        return $browser.defer.cancel(promise.$$timeoutId);
      }
      return false;
    };

    return timeout;
  }];
}

// NOTE:  The usage of window and document instead of $window and $document here is
// deliberate.  This service depends on the specific behavior of anchor nodes created by the
// browser (resolving and parsing URLs) that is unlikely to be provided by mock objects and
// cause us to break tests.  In addition, when the browser resolves a URL for XHR, it
// doesn't know about mocked locations and resolves URLs to the real document - which is
// exactly the behavior needed here.  There is little value is mocking these out for this
// service.
var urlParsingNode = document.createElement("a");
/*
Matches paths for file protocol on windows,
such as /C:/foo/bar, and captures only /foo/bar.
*/
var windowsFilePathExp = /^\/?.*?:(\/.*)/;
var originUrl = urlResolve(window.location.href, true);


/**
 *
 * Implementation Notes for non-IE browsers
 * ----------------------------------------
 * Assigning a URL to the href property of an anchor DOM node, even one attached to the DOM,
 * results both in the normalizing and parsing of the URL.  Normalizing means that a relative
 * URL will be resolved into an absolute URL in the context of the application document.
 * Parsing means that the anchor node's host, hostname, protocol, port, pathname and related
 * properties are all populated to reflect the normalized URL.  This approach has wide
 * compatibility - Safari 1+, Mozilla 1+, Opera 7+,e etc.  See
 * http://www.aptana.com/reference/html/api/HTMLAnchorElement.html
 *
 * Implementation Notes for IE
 * ---------------------------
 * IE >= 8 and <= 10 normalizes the URL when assigned to the anchor node similar to the other
 * browsers.  However, the parsed components will not be set if the URL assigned did not specify
 * them.  (e.g. if you assign a.href = "foo", then a.protocol, a.host, etc. will be empty.)  We
 * work around that by performing the parsing in a 2nd step by taking a previously normalized
 * URL (e.g. by assigning to a.href) and assigning it a.href again.  This correctly populates the
 * properties such as protocol, hostname, port, etc.
 *
 * IE7 does not normalize the URL when assigned to an anchor node.  (Apparently, it does, if one
 * uses the inner HTML approach to assign the URL as part of an HTML snippet -
 * http://stackoverflow.com/a/472729)  However, setting img[src] does normalize the URL.
 * Unfortunately, setting img[src] to something like "javascript:foo" on IE throws an exception.
 * Since the primary usage for normalizing URLs is to sanitize such URLs, we can't use that
 * method and IE < 8 is unsupported.
 *
 * References:
 *   http://developer.mozilla.org/en-US/docs/Web/API/HTMLAnchorElement
 *   http://www.aptana.com/reference/html/api/HTMLAnchorElement.html
 *   http://url.spec.whatwg.org/#urlutils
 *   https://github.com/angular/angular.js/pull/2902
 *   http://james.padolsey.com/javascript/parsing-urls-with-the-dom/
 *
 * @function
 * @param {string} url The URL to be parsed.
 * @description Normalizes and parses a URL.
 * @returns {object} Returns the normalized URL as a dictionary.
 *
 *   | member name   | Description    |
 *   |---------------|----------------|
 *   | href          | A normalized version of the provided URL if it was not an absolute URL |
 *   | protocol      | The protocol including the trailing colon                              |
 *   | host          | The host and port (if the port is non-default) of the normalizedUrl    |
 *   | search        | The search params, minus the question mark                             |
 *   | hash          | The hash string, minus the hash symbol
 *   | hostname      | The hostname
 *   | port          | The port, without ":"
 *   | pathname      | The pathname, beginning with "/"
 *
 */
function urlResolve(url, base) {
  var href = url,
      pathname;

  if (msie) {
    // Normalize before parse.  Refer Implementation Notes on why this is
    // done in two steps on IE.
    urlParsingNode.setAttribute("href", href);
    href = urlParsingNode.href;
  }

  urlParsingNode.setAttribute('href', href);

  /*
   * In Windows, on an anchor node on documents loaded from
   * the filesystem, the browser will return a pathname
   * prefixed with the drive name ('/C:/path') when a
   * pathname without a drive is set:
   *  * a.setAttribute('href', '/foo')
   *   * a.pathname === '/C:/foo' //true
   *
   * Inside of Angular, we're always using pathnames that
   * do not include drive names for routing.
   */

  pathname = removeWindowsDriveName(urlParsingNode.pathname, url, base);
  pathname = (pathname.charAt(0) === '/') ? pathname : '/' + pathname;

  // urlParsingNode provides the UrlUtils interface - http://url.spec.whatwg.org/#urlutils
  return {
    href: urlParsingNode.href,
    protocol: urlParsingNode.protocol ? urlParsingNode.protocol.replace(/:$/, '') : '',
    host: urlParsingNode.host,
    search: urlParsingNode.search ? urlParsingNode.search.replace(/^\?/, '') : '',
    hash: urlParsingNode.hash ? urlParsingNode.hash.replace(/^#/, '') : '',
    hostname: urlParsingNode.hostname,
    port: urlParsingNode.port,
    pathname: pathname
  };
}


/**
 * Parse a request URL and determine whether this is a same-origin request as the application document.
 *
 * @param {string|object} requestUrl The url of the request as a string that will be resolved
 * or a parsed URL object.
 * @returns {boolean} Whether the request is for the same origin as the application document.
 */
function urlIsSameOrigin(requestUrl) {
  var parsed = (isString(requestUrl)) ? urlResolve(requestUrl) : requestUrl;
  return (parsed.protocol === originUrl.protocol &&
          parsed.host === originUrl.host);
}

function removeWindowsDriveName (path, url, base) {
  var firstPathSegmentMatch;

  //Get the relative path from the input URL.
  if (url.indexOf(base) === 0) {
    url = url.replace(base, '');
  }

  /*
   * The input URL intentionally contains a
   * first path segment that ends with a colon.
   */
  if (windowsFilePathExp.exec(url)) {
    return path;
  }

  firstPathSegmentMatch = windowsFilePathExp.exec(path);
  return firstPathSegmentMatch ? firstPathSegmentMatch[1] : path;
}

/**
 * @ngdoc object
 * @name ng.$window
 *
 * @description
 * A reference to the browser's `window` object. While `window`
 * is globally available in JavaScript, it causes testability problems, because
 * it is a global variable. In angular we always refer to it through the
 * `$window` service, so it may be overridden, removed or mocked for testing.
 *
 * Expressions, like the one defined for the `ngClick` directive in the example
 * below, are evaluated with respect to the current scope.  Therefore, there is
 * no risk of inadvertently coding in a dependency on a global value in such an
 * expression.
 *
 * @example
   <doc:example>
     <doc:source>
       <script>
         function Ctrl($scope, $window) {
           $scope.$window = $window;
           $scope.greeting = 'Hello, World!';
         }
       </script>
       <div ng-controller="Ctrl">
         <input type="text" ng-model="greeting" />
         <button ng-click="$window.alert(greeting)">ALERT</button>
       </div>
     </doc:source>
     <doc:scenario>
      it('should display the greeting in the input box', function() {
       input('greeting').enter('Hello, E2E Tests');
       // If we click the button it will block the test runner
       // element(':button').click();
      });
     </doc:scenario>
   </doc:example>
 */
function $WindowProvider(){
  this.$get = valueFn(window);
}

/**
 * @ngdoc object
 * @name ng.$filterProvider
 * @description
 *
 * Filters are just functions which transform input to an output. However filters need to be
 * Dependency Injected. To achieve this a filter definition consists of a factory function which is
 * annotated with dependencies and is responsible for creating a filter function.
 *
 * <pre>
 *   // Filter registration
 *   function MyModule($provide, $filterProvider) {
 *     // create a service to demonstrate injection (not always needed)
 *     $provide.value('greet', function(name){
 *       return 'Hello ' + name + '!';
 *     });
 *
 *     // register a filter factory which uses the
 *     // greet service to demonstrate DI.
 *     $filterProvider.register('greet', function(greet){
 *       // return the filter function which uses the greet service
 *       // to generate salutation
 *       return function(text) {
 *         // filters need to be forgiving so check input validity
 *         return text && greet(text) || text;
 *       };
 *     });
 *   }
 * </pre>
 *
 * The filter function is registered with the `$injector` under the filter name suffix with
 * `Filter`.
 * 
 * <pre>
 *   it('should be the same instance', inject(
 *     function($filterProvider) {
 *       $filterProvider.register('reverse', function(){
 *         return ...;
 *       });
 *     },
 *     function($filter, reverseFilter) {
 *       expect($filter('reverse')).toBe(reverseFilter);
 *     });
 * </pre>
 *
 *
 * For more information about how angular filters work, and how to create your own filters, see
 * {@link guide/filter Filters} in the Angular Developer Guide.
 */
/**
 * @ngdoc method
 * @name ng.$filterProvider#register
 * @methodOf ng.$filterProvider
 * @description
 * Register filter factory function.
 *
 * @param {String} name Name of the filter.
 * @param {function} fn The filter factory function which is injectable.
 */


/**
 * @ngdoc function
 * @name ng.$filter
 * @function
 * @description
 * Filters are used for formatting data displayed to the user.
 *
 * The general syntax in templates is as follows:
 *
 *         {{ expression [| filter_name[:parameter_value] ... ] }}
 *
 * @param {String} name Name of the filter function to retrieve
 * @return {Function} the filter function
 */
$FilterProvider.$inject = ['$provide'];
function $FilterProvider($provide) {
  var suffix = 'Filter';

  /**
   * @ngdoc function
   * @name ng.$controllerProvider#register
   * @methodOf ng.$controllerProvider
   * @param {string|Object} name Name of the filter function, or an object map of filters where
   *    the keys are the filter names and the values are the filter factories.
   * @returns {Object} Registered filter instance, or if a map of filters was provided then a map
   *    of the registered filter instances.
   */
  function register(name, factory) {
    if(isObject(name)) {
      var filters = {};
      forEach(name, function(filter, key) {
        filters[key] = register(key, filter);
      });
      return filters;
    } else {
      return $provide.factory(name + suffix, factory);
    }
  }
  this.register = register;

  this.$get = ['$injector', function($injector) {
    return function(name) {
      return $injector.get(name + suffix);
    };
  }];

  ////////////////////////////////////////
  
  /* global
    currencyFilter: false,
    dateFilter: false,
    filterFilter: false,
    jsonFilter: false,
    limitToFilter: false,
    lowercaseFilter: false,
    numberFilter: false,
    orderByFilter: false,
    uppercaseFilter: false,
  */

  register('currency', currencyFilter);
  register('date', dateFilter);
  register('filter', filterFilter);
  register('json', jsonFilter);
  register('limitTo', limitToFilter);
  register('lowercase', lowercaseFilter);
  register('number', numberFilter);
  register('orderBy', orderByFilter);
  register('uppercase', uppercaseFilter);
}

/**
 * @ngdoc filter
 * @name ng.filter:filter
 * @function
 *
 * @description
 * Selects a subset of items from `array` and returns it as a new array.
 *
 * @param {Array} array The source array.
 * @param {string|Object|function()} expression The predicate to be used for selecting items from
 *   `array`.
 *
 *   Can be one of:
 *
 *   - `string`: Predicate that results in a substring match using the value of `expression`
 *     string. All strings or objects with string properties in `array` that contain this string
 *     will be returned. The predicate can be negated by prefixing the string with `!`.
 *
 *   - `Object`: A pattern object can be used to filter specific properties on objects contained
 *     by `array`. For example `{name:"M", phone:"1"}` predicate will return an array of items
 *     which have property `name` containing "M" and property `phone` containing "1". A special
 *     property name `$` can be used (as in `{$:"text"}`) to accept a match against any
 *     property of the object. That's equivalent to the simple substring match with a `string`
 *     as described above.
 *
 *   - `function`: A predicate function can be used to write arbitrary filters. The function is
 *     called for each element of `array`. The final result is an array of those elements that
 *     the predicate returned true for.
 *
 * @param {function(expected, actual)|true|undefined} comparator Comparator which is used in
 *     determining if the expected value (from the filter expression) and actual value (from
 *     the object in the array) should be considered a match.
 *
 *   Can be one of:
 *
 *     - `function(expected, actual)`:
 *       The function will be given the object value and the predicate value to compare and
 *       should return true if the item should be included in filtered result.
 *
 *     - `true`: A shorthand for `function(expected, actual) { return angular.equals(expected, actual)}`.
 *       this is essentially strict comparison of expected and actual.
 *
 *     - `false|undefined`: A short hand for a function which will look for a substring match in case
 *       insensitive way.
 *
 * @example
   <doc:example>
     <doc:source>
       <div ng-init="friends = [{name:'John', phone:'555-1276'},
                                {name:'Mary', phone:'800-BIG-MARY'},
                                {name:'Mike', phone:'555-4321'},
                                {name:'Adam', phone:'555-5678'},
                                {name:'Julie', phone:'555-8765'},
                                {name:'Juliette', phone:'555-5678'}]"></div>

       Search: <input ng-model="searchText">
       <table id="searchTextResults">
         <tr><th>Name</th><th>Phone</th></tr>
         <tr ng-repeat="friend in friends | filter:searchText">
           <td>{{friend.name}}</td>
           <td>{{friend.phone}}</td>
         </tr>
       </table>
       <hr>
       Any: <input ng-model="search.$"> <br>
       Name only <input ng-model="search.name"><br>
       Phone only <input ng-model="search.phone"><br>
       Equality <input type="checkbox" ng-model="strict"><br>
       <table id="searchObjResults">
         <tr><th>Name</th><th>Phone</th></tr>
         <tr ng-repeat="friend in friends | filter:search:strict">
           <td>{{friend.name}}</td>
           <td>{{friend.phone}}</td>
         </tr>
       </table>
     </doc:source>
     <doc:scenario>
       it('should search across all fields when filtering with a string', function() {
         input('searchText').enter('m');
         expect(repeater('#searchTextResults tr', 'friend in friends').column('friend.name')).
           toEqual(['Mary', 'Mike', 'Adam']);

         input('searchText').enter('76');
         expect(repeater('#searchTextResults tr', 'friend in friends').column('friend.name')).
           toEqual(['John', 'Julie']);
       });

       it('should search in specific fields when filtering with a predicate object', function() {
         input('search.$').enter('i');
         expect(repeater('#searchObjResults tr', 'friend in friends').column('friend.name')).
           toEqual(['Mary', 'Mike', 'Julie', 'Juliette']);
       });
       it('should use a equal comparison when comparator is true', function() {
         input('search.name').enter('Julie');
         input('strict').check();
         expect(repeater('#searchObjResults tr', 'friend in friends').column('friend.name')).
           toEqual(['Julie']);
       });
     </doc:scenario>
   </doc:example>
 */
function filterFilter() {
  return function(array, expression, comparator) {
    if (!isArray(array)) return array;

    var comparatorType = typeof(comparator),
        predicates = [];

    predicates.check = function(value) {
      for (var j = 0; j < predicates.length; j++) {
        if(!predicates[j](value)) {
          return false;
        }
      }
      return true;
    };

    if (comparatorType !== 'function') {
      if (comparatorType === 'boolean' && comparator) {
        comparator = function(obj, text) {
          return angular.equals(obj, text);
        };
      } else {
        comparator = function(obj, text) {
          text = (''+text).toLowerCase();
          return (''+obj).toLowerCase().indexOf(text) > -1;
        };
      }
    }

    var search = function(obj, text){
      if (typeof text == 'string' && text.charAt(0) === '!') {
        return !search(obj, text.substr(1));
      }
      switch (typeof obj) {
        case "boolean":
        case "number":
        case "string":
          return comparator(obj, text);
        case "object":
          switch (typeof text) {
            case "object":
              return comparator(obj, text);
            default:
              for ( var objKey in obj) {
                if (objKey.charAt(0) !== '$' && search(obj[objKey], text)) {
                  return true;
                }
              }
              break;
          }
          return false;
        case "array":
          for ( var i = 0; i < obj.length; i++) {
            if (search(obj[i], text)) {
              return true;
            }
          }
          return false;
        default:
          return false;
      }
    };
    switch (typeof expression) {
      case "boolean":
      case "number":
      case "string":
        // Set up expression object and fall through
        expression = {$:expression};
        // jshint -W086
      case "object":
        // jshint +W086
        for (var key in expression) {
          if (key == '$') {
            (function() {
              if (!expression[key]) return;
              var path = key;
              predicates.push(function(value) {
                return search(value, expression[path]);
              });
            })();
          } else {
            (function() {
              if (typeof(expression[key]) == 'undefined') { return; }
              var path = key;
              predicates.push(function(value) {
                return search(getter(value,path), expression[path]);
              });
            })();
          }
        }
        break;
      case 'function':
        predicates.push(expression);
        break;
      default:
        return array;
    }
    var filtered = [];
    for ( var j = 0; j < array.length; j++) {
      var value = array[j];
      if (predicates.check(value)) {
        filtered.push(value);
      }
    }
    return filtered;
  };
}

/**
 * @ngdoc filter
 * @name ng.filter:currency
 * @function
 *
 * @description
 * Formats a number as a currency (ie $1,234.56). When no currency symbol is provided, default
 * symbol for current locale is used.
 *
 * @param {number} amount Input to filter.
 * @param {string=} symbol Currency symbol or identifier to be displayed.
 * @returns {string} Formatted number.
 *
 *
 * @example
   <doc:example>
     <doc:source>
       <script>
         function Ctrl($scope) {
           $scope.amount = 1234.56;
         }
       </script>
       <div ng-controller="Ctrl">
         <input type="number" ng-model="amount"> <br>
         default currency symbol ($): {{amount | currency}}<br>
         custom currency identifier (USD$): {{amount | currency:"USD$"}}
       </div>
     </doc:source>
     <doc:scenario>
       it('should init with 1234.56', function() {
         expect(binding('amount | currency')).toBe('$1,234.56');
         expect(binding('amount | currency:"USD$"')).toBe('USD$1,234.56');
       });
       it('should update', function() {
         input('amount').enter('-1234');
         expect(binding('amount | currency')).toBe('($1,234.00)');
         expect(binding('amount | currency:"USD$"')).toBe('(USD$1,234.00)');
       });
     </doc:scenario>
   </doc:example>
 */
currencyFilter.$inject = ['$locale'];
function currencyFilter($locale) {
  var formats = $locale.NUMBER_FORMATS;
  return function(amount, currencySymbol){
    if (isUndefined(currencySymbol)) currencySymbol = formats.CURRENCY_SYM;
    return formatNumber(amount, formats.PATTERNS[1], formats.GROUP_SEP, formats.DECIMAL_SEP, 2).
                replace(/\u00A4/g, currencySymbol);
  };
}

/**
 * @ngdoc filter
 * @name ng.filter:number
 * @function
 *
 * @description
 * Formats a number as text.
 *
 * If the input is not a number an empty string is returned.
 *
 * @param {number|string} number Number to format.
 * @param {(number|string)=} fractionSize Number of decimal places to round the number to.
 * If this is not provided then the fraction size is computed from the current locale's number
 * formatting pattern. In the case of the default locale, it will be 3.
 * @returns {string} Number rounded to decimalPlaces and places a “,” after each third digit.
 *
 * @example
   <doc:example>
     <doc:source>
       <script>
         function Ctrl($scope) {
           $scope.val = 1234.56789;
         }
       </script>
       <div ng-controller="Ctrl">
         Enter number: <input ng-model='val'><br>
         Default formatting: {{val | number}}<br>
         No fractions: {{val | number:0}}<br>
         Negative number: {{-val | number:4}}
       </div>
     </doc:source>
     <doc:scenario>
       it('should format numbers', function() {
         expect(binding('val | number')).toBe('1,234.568');
         expect(binding('val | number:0')).toBe('1,235');
         expect(binding('-val | number:4')).toBe('-1,234.5679');
       });

       it('should update', function() {
         input('val').enter('3374.333');
         expect(binding('val | number')).toBe('3,374.333');
         expect(binding('val | number:0')).toBe('3,374');
         expect(binding('-val | number:4')).toBe('-3,374.3330');
       });
     </doc:scenario>
   </doc:example>
 */


numberFilter.$inject = ['$locale'];
function numberFilter($locale) {
  var formats = $locale.NUMBER_FORMATS;
  return function(number, fractionSize) {
    return formatNumber(number, formats.PATTERNS[0], formats.GROUP_SEP, formats.DECIMAL_SEP,
      fractionSize);
  };
}

var DECIMAL_SEP = '.';
function formatNumber(number, pattern, groupSep, decimalSep, fractionSize) {
  if (isNaN(number) || !isFinite(number)) return '';

  var isNegative = number < 0;
  number = Math.abs(number);
  var numStr = number + '',
      formatedText = '',
      parts = [];

  var hasExponent = false;
  if (numStr.indexOf('e') !== -1) {
    var match = numStr.match(/([\d\.]+)e(-?)(\d+)/);
    if (match && match[2] == '-' && match[3] > fractionSize + 1) {
      numStr = '0';
    } else {
      formatedText = numStr;
      hasExponent = true;
    }
  }

  if (!hasExponent) {
    var fractionLen = (numStr.split(DECIMAL_SEP)[1] || '').length;

    // determine fractionSize if it is not specified
    if (isUndefined(fractionSize)) {
      fractionSize = Math.min(Math.max(pattern.minFrac, fractionLen), pattern.maxFrac);
    }

    var pow = Math.pow(10, fractionSize);
    number = Math.round(number * pow) / pow;
    var fraction = ('' + number).split(DECIMAL_SEP);
    var whole = fraction[0];
    fraction = fraction[1] || '';

    var i, pos = 0,
        lgroup = pattern.lgSize,
        group = pattern.gSize;

    if (whole.length >= (lgroup + group)) {
      pos = whole.length - lgroup;
      for (i = 0; i < pos; i++) {
        if ((pos - i)%group === 0 && i !== 0) {
          formatedText += groupSep;
        }
        formatedText += whole.charAt(i);
      }
    }

    for (i = pos; i < whole.length; i++) {
      if ((whole.length - i)%lgroup === 0 && i !== 0) {
        formatedText += groupSep;
      }
      formatedText += whole.charAt(i);
    }

    // format fraction part.
    while(fraction.length < fractionSize) {
      fraction += '0';
    }

    if (fractionSize && fractionSize !== "0") formatedText += decimalSep + fraction.substr(0, fractionSize);
  } else {

    if (fractionSize > 0 && number > -1 && number < 1) {
      formatedText = number.toFixed(fractionSize);
    }
  }

  parts.push(isNegative ? pattern.negPre : pattern.posPre);
  parts.push(formatedText);
  parts.push(isNegative ? pattern.negSuf : pattern.posSuf);
  return parts.join('');
}

function padNumber(num, digits, trim) {
  var neg = '';
  if (num < 0) {
    neg =  '-';
    num = -num;
  }
  num = '' + num;
  while(num.length < digits) num = '0' + num;
  if (trim)
    num = num.substr(num.length - digits);
  return neg + num;
}


function dateGetter(name, size, offset, trim) {
  offset = offset || 0;
  return function(date) {
    var value = date['get' + name]();
    if (offset > 0 || value > -offset)
      value += offset;
    if (value === 0 && offset == -12 ) value = 12;
    return padNumber(value, size, trim);
  };
}

function dateStrGetter(name, shortForm) {
  return function(date, formats) {
    var value = date['get' + name]();
    var get = uppercase(shortForm ? ('SHORT' + name) : name);

    return formats[get][value];
  };
}

function timeZoneGetter(date) {
  var zone = -1 * date.getTimezoneOffset();
  var paddedZone = (zone >= 0) ? "+" : "";

  paddedZone += padNumber(Math[zone > 0 ? 'floor' : 'ceil'](zone / 60), 2) +
                padNumber(Math.abs(zone % 60), 2);

  return paddedZone;
}

function ampmGetter(date, formats) {
  return date.getHours() < 12 ? formats.AMPMS[0] : formats.AMPMS[1];
}

var DATE_FORMATS = {
  yyyy: dateGetter('FullYear', 4),
    yy: dateGetter('FullYear', 2, 0, true),
     y: dateGetter('FullYear', 1),
  MMMM: dateStrGetter('Month'),
   MMM: dateStrGetter('Month', true),
    MM: dateGetter('Month', 2, 1),
     M: dateGetter('Month', 1, 1),
    dd: dateGetter('Date', 2),
     d: dateGetter('Date', 1),
    HH: dateGetter('Hours', 2),
     H: dateGetter('Hours', 1),
    hh: dateGetter('Hours', 2, -12),
     h: dateGetter('Hours', 1, -12),
    mm: dateGetter('Minutes', 2),
     m: dateGetter('Minutes', 1),
    ss: dateGetter('Seconds', 2),
     s: dateGetter('Seconds', 1),
     // while ISO 8601 requires fractions to be prefixed with `.` or `,`
     // we can be just safely rely on using `sss` since we currently don't support single or two digit fractions
   sss: dateGetter('Milliseconds', 3),
  EEEE: dateStrGetter('Day'),
   EEE: dateStrGetter('Day', true),
     a: ampmGetter,
     Z: timeZoneGetter
};

var DATE_FORMATS_SPLIT = /((?:[^yMdHhmsaZE']+)|(?:'(?:[^']|'')*')|(?:E+|y+|M+|d+|H+|h+|m+|s+|a|Z))(.*)/,
    NUMBER_STRING = /^\-?\d+$/;

/**
 * @ngdoc filter
 * @name ng.filter:date
 * @function
 *
 * @description
 *   Formats `date` to a string based on the requested `format`.
 *
 *   `format` string can be composed of the following elements:
 *
 *   * `'yyyy'`: 4 digit representation of year (e.g. AD 1 => 0001, AD 2010 => 2010)
 *   * `'yy'`: 2 digit representation of year, padded (00-99). (e.g. AD 2001 => 01, AD 2010 => 10)
 *   * `'y'`: 1 digit representation of year, e.g. (AD 1 => 1, AD 199 => 199)
 *   * `'MMMM'`: Month in year (January-December)
 *   * `'MMM'`: Month in year (Jan-Dec)
 *   * `'MM'`: Month in year, padded (01-12)
 *   * `'M'`: Month in year (1-12)
 *   * `'dd'`: Day in month, padded (01-31)
 *   * `'d'`: Day in month (1-31)
 *   * `'EEEE'`: Day in Week,(Sunday-Saturday)
 *   * `'EEE'`: Day in Week, (Sun-Sat)
 *   * `'HH'`: Hour in day, padded (00-23)
 *   * `'H'`: Hour in day (0-23)
 *   * `'hh'`: Hour in am/pm, padded (01-12)
 *   * `'h'`: Hour in am/pm, (1-12)
 *   * `'mm'`: Minute in hour, padded (00-59)
 *   * `'m'`: Minute in hour (0-59)
 *   * `'ss'`: Second in minute, padded (00-59)
 *   * `'s'`: Second in minute (0-59)
 *   * `'.sss' or ',sss'`: Millisecond in second, padded (000-999)
 *   * `'a'`: am/pm marker
 *   * `'Z'`: 4 digit (+sign) representation of the timezone offset (-1200-+1200)
 *
 *   `format` string can also be one of the following predefined
 *   {@link guide/i18n localizable formats}:
 *
 *   * `'medium'`: equivalent to `'MMM d, y h:mm:ss a'` for en_US locale
 *     (e.g. Sep 3, 2010 12:05:08 pm)
 *   * `'short'`: equivalent to `'M/d/yy h:mm a'` for en_US  locale (e.g. 9/3/10 12:05 pm)
 *   * `'fullDate'`: equivalent to `'EEEE, MMMM d,y'` for en_US  locale
 *     (e.g. Friday, September 3, 2010)
 *   * `'longDate'`: equivalent to `'MMMM d, y'` for en_US  locale (e.g. September 3, 2010)
 *   * `'mediumDate'`: equivalent to `'MMM d, y'` for en_US  locale (e.g. Sep 3, 2010)
 *   * `'shortDate'`: equivalent to `'M/d/yy'` for en_US locale (e.g. 9/3/10)
 *   * `'mediumTime'`: equivalent to `'h:mm:ss a'` for en_US locale (e.g. 12:05:08 pm)
 *   * `'shortTime'`: equivalent to `'h:mm a'` for en_US locale (e.g. 12:05 pm)
 *
 *   `format` string can contain literal values. These need to be quoted with single quotes (e.g.
 *   `"h 'in the morning'"`). In order to output single quote, use two single quotes in a sequence
 *   (e.g. `"h 'o''clock'"`).
 *
 * @param {(Date|number|string)} date Date to format either as Date object, milliseconds (string or
 *    number) or various ISO 8601 datetime string formats (e.g. yyyy-MM-ddTHH:mm:ss.SSSZ and its
 *    shorter versions like yyyy-MM-ddTHH:mmZ, yyyy-MM-dd or yyyyMMddTHHmmssZ). If no timezone is
 *    specified in the string input, the time is considered to be in the local timezone.
 * @param {string=} format Formatting rules (see Description). If not specified,
 *    `mediumDate` is used.
 * @returns {string} Formatted string or the input if input is not recognized as date/millis.
 *
 * @example
   <doc:example>
     <doc:source>
       <span ng-non-bindable>{{1288323623006 | date:'medium'}}</span>:
           {{1288323623006 | date:'medium'}}<br>
       <span ng-non-bindable>{{1288323623006 | date:'yyyy-MM-dd HH:mm:ss Z'}}</span>:
          {{1288323623006 | date:'yyyy-MM-dd HH:mm:ss Z'}}<br>
       <span ng-non-bindable>{{1288323623006 | date:'MM/dd/yyyy @ h:mma'}}</span>:
          {{'1288323623006' | date:'MM/dd/yyyy @ h:mma'}}<br>
     </doc:source>
     <doc:scenario>
       it('should format date', function() {
         expect(binding("1288323623006 | date:'medium'")).
            toMatch(/Oct 2\d, 2010 \d{1,2}:\d{2}:\d{2} (AM|PM)/);
         expect(binding("1288323623006 | date:'yyyy-MM-dd HH:mm:ss Z'")).
            toMatch(/2010\-10\-2\d \d{2}:\d{2}:\d{2} (\-|\+)?\d{4}/);
         expect(binding("'1288323623006' | date:'MM/dd/yyyy @ h:mma'")).
            toMatch(/10\/2\d\/2010 @ \d{1,2}:\d{2}(AM|PM)/);
       });
     </doc:scenario>
   </doc:example>
 */
dateFilter.$inject = ['$locale'];
function dateFilter($locale) {


  var R_ISO8601_STR = /^(\d{4})-?(\d\d)-?(\d\d)(?:T(\d\d)(?::?(\d\d)(?::?(\d\d)(?:\.(\d+))?)?)?(Z|([+-])(\d\d):?(\d\d))?)?$/;
                     // 1        2       3         4          5          6          7          8  9     10      11
  function jsonStringToDate(string) {
    var match;
    if (match = string.match(R_ISO8601_STR)) {
      var date = new Date(0),
          tzHour = 0,
          tzMin  = 0,
          dateSetter = match[8] ? date.setUTCFullYear : date.setFullYear,
          timeSetter = match[8] ? date.setUTCHours : date.setHours;

      if (match[9]) {
        tzHour = int(match[9] + match[10]);
        tzMin = int(match[9] + match[11]);
      }
      dateSetter.call(date, int(match[1]), int(match[2]) - 1, int(match[3]));
      var h = int(match[4]||0) - tzHour;
      var m = int(match[5]||0) - tzMin;
      var s = int(match[6]||0);
      var ms = Math.round(parseFloat('0.' + (match[7]||0)) * 1000);
      timeSetter.call(date, h, m, s, ms);
      return date;
    }
    return string;
  }


  return function(date, format) {
    var text = '',
        parts = [],
        fn, match;

    format = format || 'mediumDate';
    format = $locale.DATETIME_FORMATS[format] || format;
    if (isString(date)) {
      if (NUMBER_STRING.test(date)) {
        date = int(date);
      } else {
        date = jsonStringToDate(date);
      }
    }

    if (isNumber(date)) {
      date = new Date(date);
    }

    if (!isDate(date)) {
      return date;
    }

    while(format) {
      match = DATE_FORMATS_SPLIT.exec(format);
      if (match) {
        parts = concat(parts, match, 1);
        format = parts.pop();
      } else {
        parts.push(format);
        format = null;
      }
    }

    forEach(parts, function(value){
      fn = DATE_FORMATS[value];
      text += fn ? fn(date, $locale.DATETIME_FORMATS)
                 : value.replace(/(^'|'$)/g, '').replace(/''/g, "'");
    });

    return text;
  };
}


/**
 * @ngdoc filter
 * @name ng.filter:json
 * @function
 *
 * @description
 *   Allows you to convert a JavaScript object into JSON string.
 *
 *   This filter is mostly useful for debugging. When using the double curly {{value}} notation
 *   the binding is automatically converted to JSON.
 *
 * @param {*} object Any JavaScript object (including arrays and primitive types) to filter.
 * @returns {string} JSON string.
 *
 *
 * @example:
   <doc:example>
     <doc:source>
       <pre>{{ {'name':'value'} | json }}</pre>
     </doc:source>
     <doc:scenario>
       it('should jsonify filtered objects', function() {
         expect(binding("{'name':'value'}")).toMatch(/\{\n  "name": ?"value"\n}/);
       });
     </doc:scenario>
   </doc:example>
 *
 */
function jsonFilter() {
  return function(object) {
    return toJson(object, true);
  };
}


/**
 * @ngdoc filter
 * @name ng.filter:lowercase
 * @function
 * @description
 * Converts string to lowercase.
 * @see angular.lowercase
 */
var lowercaseFilter = valueFn(lowercase);


/**
 * @ngdoc filter
 * @name ng.filter:uppercase
 * @function
 * @description
 * Converts string to uppercase.
 * @see angular.uppercase
 */
var uppercaseFilter = valueFn(uppercase);

/**
 * @ngdoc function
 * @name ng.filter:limitTo
 * @function
 *
 * @description
 * Creates a new array or string containing only a specified number of elements. The elements
 * are taken from either the beginning or the end of the source array or string, as specified by
 * the value and sign (positive or negative) of `limit`.
 *
 * @param {Array|string} input Source array or string to be limited.
 * @param {string|number} limit The length of the returned array or string. If the `limit` number 
 *     is positive, `limit` number of items from the beginning of the source array/string are copied.
 *     If the number is negative, `limit` number  of items from the end of the source array/string 
 *     are copied. The `limit` will be trimmed if it exceeds `array.length`
 * @returns {Array|string} A new sub-array or substring of length `limit` or less if input array
 *     had less than `limit` elements.
 *
 * @example
   <doc:example>
     <doc:source>
       <script>
         function Ctrl($scope) {
           $scope.numbers = [1,2,3,4,5,6,7,8,9];
           $scope.letters = "abcdefghi";
           $scope.numLimit = 3;
           $scope.letterLimit = 3;
         }
       </script>
       <div ng-controller="Ctrl">
         Limit {{numbers}} to: <input type="integer" ng-model="numLimit">
         <p>Output numbers: {{ numbers | limitTo:numLimit }}</p>
         Limit {{letters}} to: <input type="integer" ng-model="letterLimit">
         <p>Output letters: {{ letters | limitTo:letterLimit }}</p>
       </div>
     </doc:source>
     <doc:scenario>
       it('should limit the number array to first three items', function() {
         expect(element('.doc-example-live input[ng-model=numLimit]').val()).toBe('3');
         expect(element('.doc-example-live input[ng-model=letterLimit]').val()).toBe('3');
         expect(binding('numbers | limitTo:numLimit')).toEqual('[1,2,3]');
         expect(binding('letters | limitTo:letterLimit')).toEqual('abc');
       });

       it('should update the output when -3 is entered', function() {
         input('numLimit').enter(-3);
         input('letterLimit').enter(-3);
         expect(binding('numbers | limitTo:numLimit')).toEqual('[7,8,9]');
         expect(binding('letters | limitTo:letterLimit')).toEqual('ghi');
       });

       it('should not exceed the maximum size of input array', function() {
         input('numLimit').enter(100);
         input('letterLimit').enter(100);
         expect(binding('numbers | limitTo:numLimit')).toEqual('[1,2,3,4,5,6,7,8,9]');
         expect(binding('letters | limitTo:letterLimit')).toEqual('abcdefghi');
       });
     </doc:scenario>
   </doc:example>
 */
function limitToFilter(){
  return function(input, limit) {
    if (!isArray(input) && !isString(input)) return input;
    
    limit = int(limit);

    if (isString(input)) {
      //NaN check on limit
      if (limit) {
        return limit >= 0 ? input.slice(0, limit) : input.slice(limit, input.length);
      } else {
        return "";
      }
    }

    var out = [],
      i, n;

    // if abs(limit) exceeds maximum length, trim it
    if (limit > input.length)
      limit = input.length;
    else if (limit < -input.length)
      limit = -input.length;

    if (limit > 0) {
      i = 0;
      n = limit;
    } else {
      i = input.length + limit;
      n = input.length;
    }

    for (; i<n; i++) {
      out.push(input[i]);
    }

    return out;
  };
}

/**
 * @ngdoc function
 * @name ng.filter:orderBy
 * @function
 *
 * @description
 * Orders a specified `array` by the `expression` predicate.
 *
 * @param {Array} array The array to sort.
 * @param {function(*)|string|Array.<(function(*)|string)>} expression A predicate to be
 *    used by the comparator to determine the order of elements.
 *
 *    Can be one of:
 *
 *    - `function`: Getter function. The result of this function will be sorted using the
 *      `<`, `=`, `>` operator.
 *    - `string`: An Angular expression which evaluates to an object to order by, such as 'name'
 *      to sort by a property called 'name'. Optionally prefixed with `+` or `-` to control
 *      ascending or descending sort order (for example, +name or -name).
 *    - `Array`: An array of function or string predicates. The first predicate in the array
 *      is used for sorting, but when two items are equivalent, the next predicate is used.
 *
 * @param {boolean=} reverse Reverse the order the array.
 * @returns {Array} Sorted copy of the source array.
 *
 * @example
   <doc:example>
     <doc:source>
       <script>
         function Ctrl($scope) {
           $scope.friends =
               [{name:'John', phone:'555-1212', age:10},
                {name:'Mary', phone:'555-9876', age:19},
                {name:'Mike', phone:'555-4321', age:21},
                {name:'Adam', phone:'555-5678', age:35},
                {name:'Julie', phone:'555-8765', age:29}]
           $scope.predicate = '-age';
         }
       </script>
       <div ng-controller="Ctrl">
         <pre>Sorting predicate = {{predicate}}; reverse = {{reverse}}</pre>
         <hr/>
         [ <a href="" ng-click="predicate=''">unsorted</a> ]
         <table class="friend">
           <tr>
             <th><a href="" ng-click="predicate = 'name'; reverse=false">Name</a>
                 (<a href="" ng-click="predicate = '-name'; reverse=false">^</a>)</th>
             <th><a href="" ng-click="predicate = 'phone'; reverse=!reverse">Phone Number</a></th>
             <th><a href="" ng-click="predicate = 'age'; reverse=!reverse">Age</a></th>
           </tr>
           <tr ng-repeat="friend in friends | orderBy:predicate:reverse">
             <td>{{friend.name}}</td>
             <td>{{friend.phone}}</td>
             <td>{{friend.age}}</td>
           </tr>
         </table>
       </div>
     </doc:source>
     <doc:scenario>
       it('should be reverse ordered by aged', function() {
         expect(binding('predicate')).toBe('-age');
         expect(repeater('table.friend', 'friend in friends').column('friend.age')).
           toEqual(['35', '29', '21', '19', '10']);
         expect(repeater('table.friend', 'friend in friends').column('friend.name')).
           toEqual(['Adam', 'Julie', 'Mike', 'Mary', 'John']);
       });

       it('should reorder the table when user selects different predicate', function() {
         element('.doc-example-live a:contains("Name")').click();
         expect(repeater('table.friend', 'friend in friends').column('friend.name')).
           toEqual(['Adam', 'John', 'Julie', 'Mary', 'Mike']);
         expect(repeater('table.friend', 'friend in friends').column('friend.age')).
           toEqual(['35', '10', '29', '19', '21']);

         element('.doc-example-live a:contains("Phone")').click();
         expect(repeater('table.friend', 'friend in friends').column('friend.phone')).
           toEqual(['555-9876', '555-8765', '555-5678', '555-4321', '555-1212']);
         expect(repeater('table.friend', 'friend in friends').column('friend.name')).
           toEqual(['Mary', 'Julie', 'Adam', 'Mike', 'John']);
       });
     </doc:scenario>
   </doc:example>
 */
orderByFilter.$inject = ['$parse'];
function orderByFilter($parse){
  return function(array, sortPredicate, reverseOrder) {
    if (!isArray(array)) return array;
    if (!sortPredicate) return array;
    sortPredicate = isArray(sortPredicate) ? sortPredicate: [sortPredicate];
    sortPredicate = map(sortPredicate, function(predicate){
      var descending = false, get = predicate || identity;
      if (isString(predicate)) {
        if ((predicate.charAt(0) == '+' || predicate.charAt(0) == '-')) {
          descending = predicate.charAt(0) == '-';
          predicate = predicate.substring(1);
        }
        get = $parse(predicate);
      }
      return reverseComparator(function(a,b){
        return compare(get(a),get(b));
      }, descending);
    });
    var arrayCopy = [];
    for ( var i = 0; i < array.length; i++) { arrayCopy.push(array[i]); }
    return arrayCopy.sort(reverseComparator(comparator, reverseOrder));

    function comparator(o1, o2){
      for ( var i = 0; i < sortPredicate.length; i++) {
        var comp = sortPredicate[i](o1, o2);
        if (comp !== 0) return comp;
      }
      return 0;
    }
    function reverseComparator(comp, descending) {
      return toBoolean(descending)
          ? function(a,b){return comp(b,a);}
          : comp;
    }
    function compare(v1, v2){
      var t1 = typeof v1;
      var t2 = typeof v2;
      if (t1 == t2) {
        if (t1 == "string") {
           v1 = v1.toLowerCase();
           v2 = v2.toLowerCase();
        }
        if (v1 === v2) return 0;
        return v1 < v2 ? -1 : 1;
      } else {
        return t1 < t2 ? -1 : 1;
      }
    }
  };
}

function ngDirective(directive) {
  if (isFunction(directive)) {
    directive = {
      link: directive
    };
  }
  directive.restrict = directive.restrict || 'AC';
  return valueFn(directive);
}

/**
 * @ngdoc directive
 * @name ng.directive:a
 * @restrict E
 *
 * @description
 * Modifies the default behavior of the html A tag so that the default action is prevented when
 * the href attribute is empty.
 *
 * This change permits the easy creation of action links with the `ngClick` directive
 * without changing the location or causing page reloads, e.g.:
 * `<a href="" ng-click="list.addItem()">Add Item</a>`
 */
var htmlAnchorDirective = valueFn({
  restrict: 'E',
  compile: function(element, attr) {

    if (msie <= 8) {

      // turn <a href ng-click="..">link</a> into a stylable link in IE
      // but only if it doesn't have name attribute, in which case it's an anchor
      if (!attr.href && !attr.name) {
        attr.$set('href', '');
      }

      // add a comment node to anchors to workaround IE bug that causes element content to be reset
      // to new attribute content if attribute is updated with value containing @ and element also
      // contains value with @
      // see issue #1949
      element.append(document.createComment('IE fix'));
    }

    return function(scope, element) {
      element.on('click', function(event){
        // if we have no href url, then don't navigate anywhere.
        if (!element.attr('href')) {
          event.preventDefault();
        }
      });
    };
  }
});

/**
 * @ngdoc directive
 * @name ng.directive:ngHref
 * @restrict A
 *
 * @description
 * Using Angular markup like `{{hash}}` in an href attribute will
 * make the link go to the wrong URL if the user clicks it before
 * Angular has a chance to replace the `{{hash}}` markup with its
 * value. Until Angular replaces the markup the link will be broken
 * and will most likely return a 404 error.
 *
 * The `ngHref` directive solves this problem.
 *
 * The wrong way to write it:
 * <pre>
 * <a href="http://www.gravatar.com/avatar/{{hash}}"/>
 * </pre>
 *
 * The correct way to write it:
 * <pre>
 * <a ng-href="http://www.gravatar.com/avatar/{{hash}}"/>
 * </pre>
 *
 * @element A
 * @param {template} ngHref any string which can contain `{{}}` markup.
 *
 * @example
 * This example shows various combinations of `href`, `ng-href` and `ng-click` attributes
 * in links and their different behaviors:
    <doc:example>
      <doc:source>
        <input ng-model="value" /><br />
        <a id="link-1" href ng-click="value = 1">link 1</a> (link, don't reload)<br />
        <a id="link-2" href="" ng-click="value = 2">link 2</a> (link, don't reload)<br />
        <a id="link-3" ng-href="/{{'123'}}">link 3</a> (link, reload!)<br />
        <a id="link-4" href="" name="xx" ng-click="value = 4">anchor</a> (link, don't reload)<br />
        <a id="link-5" name="xxx" ng-click="value = 5">anchor</a> (no link)<br />
        <a id="link-6" ng-href="{{value}}">link</a> (link, change location)
      </doc:source>
      <doc:scenario>
        it('should execute ng-click but not reload when href without value', function() {
          element('#link-1').click();
          expect(input('value').val()).toEqual('1');
          expect(element('#link-1').attr('href')).toBe("");
        });

        it('should execute ng-click but not reload when href empty string', function() {
          element('#link-2').click();
          expect(input('value').val()).toEqual('2');
          expect(element('#link-2').attr('href')).toBe("");
        });

        it('should execute ng-click and change url when ng-href specified', function() {
          expect(element('#link-3').attr('href')).toBe("/123");

          element('#link-3').click();
          expect(browser().window().path()).toEqual('/123');
        });

        it('should execute ng-click but not reload when href empty string and name specified', function() {
          element('#link-4').click();
          expect(input('value').val()).toEqual('4');
          expect(element('#link-4').attr('href')).toBe('');
        });

        it('should execute ng-click but not reload when no href but name specified', function() {
          element('#link-5').click();
          expect(input('value').val()).toEqual('5');
          expect(element('#link-5').attr('href')).toBe(undefined);
        });

        it('should only change url when only ng-href', function() {
          input('value').enter('6');
          expect(element('#link-6').attr('href')).toBe('6');

          element('#link-6').click();
          expect(browser().location().url()).toEqual('/6');
        });
      </doc:scenario>
    </doc:example>
 */

/**
 * @ngdoc directive
 * @name ng.directive:ngSrc
 * @restrict A
 *
 * @description
 * Using Angular markup like `{{hash}}` in a `src` attribute doesn't
 * work right: The browser will fetch from the URL with the literal
 * text `{{hash}}` until Angular replaces the expression inside
 * `{{hash}}`. The `ngSrc` directive solves this problem.
 *
 * The buggy way to write it:
 * <pre>
 * <img src="http://www.gravatar.com/avatar/{{hash}}"/>
 * </pre>
 *
 * The correct way to write it:
 * <pre>
 * <img ng-src="http://www.gravatar.com/avatar/{{hash}}"/>
 * </pre>
 *
 * @element IMG
 * @param {template} ngSrc any string which can contain `{{}}` markup.
 */

/**
 * @ngdoc directive
 * @name ng.directive:ngSrcset
 * @restrict A
 *
 * @description
 * Using Angular markup like `{{hash}}` in a `srcset` attribute doesn't
 * work right: The browser will fetch from the URL with the literal
 * text `{{hash}}` until Angular replaces the expression inside
 * `{{hash}}`. The `ngSrcset` directive solves this problem.
 *
 * The buggy way to write it:
 * <pre>
 * <img srcset="http://www.gravatar.com/avatar/{{hash}} 2x"/>
 * </pre>
 *
 * The correct way to write it:
 * <pre>
 * <img ng-srcset="http://www.gravatar.com/avatar/{{hash}} 2x"/>
 * </pre>
 *
 * @element IMG
 * @param {template} ngSrcset any string which can contain `{{}}` markup.
 */

/**
 * @ngdoc directive
 * @name ng.directive:ngDisabled
 * @restrict A
 *
 * @description
 *
 * The following markup will make the button enabled on Chrome/Firefox but not on IE8 and older IEs:
 * <pre>
 * <div ng-init="scope = { isDisabled: false }">
 *  <button disabled="{{scope.isDisabled}}">Disabled</button>
 * </div>
 * </pre>
 *
 * The HTML specification does not require browsers to preserve the values of boolean attributes
 * such as disabled. (Their presence means true and their absence means false.)
 * This prevents the Angular compiler from retrieving the binding expression.
 * The `ngDisabled` directive solves this problem for the `disabled` attribute.
 *
 * @example
    <doc:example>
      <doc:source>
        Click me to toggle: <input type="checkbox" ng-model="checked"><br/>
        <button ng-model="button" ng-disabled="checked">Button</button>
      </doc:source>
      <doc:scenario>
        it('should toggle button', function() {
          expect(element('.doc-example-live :button').prop('disabled')).toBeFalsy();
          input('checked').check();
          expect(element('.doc-example-live :button').prop('disabled')).toBeTruthy();
        });
      </doc:scenario>
    </doc:example>
 *
 * @element INPUT
 * @param {expression} ngDisabled If the {@link guide/expression expression} is truthy, 
 *     then special attribute "disabled" will be set on the element
 */


/**
 * @ngdoc directive
 * @name ng.directive:ngChecked
 * @restrict A
 *
 * @description
 * The HTML specification does not require browsers to preserve the values of boolean attributes
 * such as checked. (Their presence means true and their absence means false.)
 * This prevents the Angular compiler from retrieving the binding expression.
 * The `ngChecked` directive solves this problem for the `checked` attribute.
 * @example
    <doc:example>
      <doc:source>
        Check me to check both: <input type="checkbox" ng-model="master"><br/>
        <input id="checkSlave" type="checkbox" ng-checked="master">
      </doc:source>
      <doc:scenario>
        it('should check both checkBoxes', function() {
          expect(element('.doc-example-live #checkSlave').prop('checked')).toBeFalsy();
          input('master').check();
          expect(element('.doc-example-live #checkSlave').prop('checked')).toBeTruthy();
        });
      </doc:scenario>
    </doc:example>
 *
 * @element INPUT
 * @param {expression} ngChecked If the {@link guide/expression expression} is truthy, 
 *     then special attribute "checked" will be set on the element
 */


/**
 * @ngdoc directive
 * @name ng.directive:ngReadonly
 * @restrict A
 *
 * @description
 * The HTML specification does not require browsers to preserve the values of boolean attributes
 * such as readonly. (Their presence means true and their absence means false.)
 * This prevents the Angular compiler from retrieving the binding expression.
 * The `ngReadonly` directive solves this problem for the `readonly` attribute.
 * @example
    <doc:example>
      <doc:source>
        Check me to make text readonly: <input type="checkbox" ng-model="checked"><br/>
        <input type="text" ng-readonly="checked" value="I'm Angular"/>
      </doc:source>
      <doc:scenario>
        it('should toggle readonly attr', function() {
          expect(element('.doc-example-live :text').prop('readonly')).toBeFalsy();
          input('checked').check();
          expect(element('.doc-example-live :text').prop('readonly')).toBeTruthy();
        });
      </doc:scenario>
    </doc:example>
 *
 * @element INPUT
 * @param {expression} ngReadonly If the {@link guide/expression expression} is truthy, 
 *     then special attribute "readonly" will be set on the element
 */


/**
 * @ngdoc directive
 * @name ng.directive:ngSelected
 * @restrict A
 *
 * @description
 * The HTML specification does not require browsers to preserve the values of boolean attributes
 * such as selected. (Their presence means true and their absence means false.)
 * This prevents the Angular compiler from retrieving the binding expression.
 * The `ngSelected` directive solves this problem for the `selected` atttribute.
 * @example
    <doc:example>
      <doc:source>
        Check me to select: <input type="checkbox" ng-model="selected"><br/>
        <select>
          <option>Hello!</option>
          <option id="greet" ng-selected="selected">Greetings!</option>
        </select>
      </doc:source>
      <doc:scenario>
        it('should select Greetings!', function() {
          expect(element('.doc-example-live #greet').prop('selected')).toBeFalsy();
          input('selected').check();
          expect(element('.doc-example-live #greet').prop('selected')).toBeTruthy();
        });
      </doc:scenario>
    </doc:example>
 *
 * @element OPTION
 * @param {expression} ngSelected If the {@link guide/expression expression} is truthy, 
 *     then special attribute "selected" will be set on the element
 */

/**
 * @ngdoc directive
 * @name ng.directive:ngOpen
 * @restrict A
 *
 * @description
 * The HTML specification does not require browsers to preserve the values of boolean attributes
 * such as open. (Their presence means true and their absence means false.)
 * This prevents the Angular compiler from retrieving the binding expression.
 * The `ngOpen` directive solves this problem for the `open` attribute.
 *
 * @example
     <doc:example>
       <doc:source>
         Check me check multiple: <input type="checkbox" ng-model="open"><br/>
         <details id="details" ng-open="open">
            <summary>Show/Hide me</summary>
         </details>
       </doc:source>
       <doc:scenario>
         it('should toggle open', function() {
           expect(element('#details').prop('open')).toBeFalsy();
           input('open').check();
           expect(element('#details').prop('open')).toBeTruthy();
         });
       </doc:scenario>
     </doc:example>
 *
 * @element DETAILS
 * @param {expression} ngOpen If the {@link guide/expression expression} is truthy, 
 *     then special attribute "open" will be set on the element
 */

var ngAttributeAliasDirectives = {};


// boolean attrs are evaluated
forEach(BOOLEAN_ATTR, function(propName, attrName) {
  // binding to multiple is not supported
  if (propName == "multiple") return;

  var normalized = directiveNormalize('ng-' + attrName);
  ngAttributeAliasDirectives[normalized] = function() {
    return {
      priority: 100,
      compile: function() {
        return function(scope, element, attr) {
          scope.$watch(attr[normalized], function ngBooleanAttrWatchAction(value) {
            attr.$set(attrName, !!value);
          });
        };
      }
    };
  };
});


// ng-src, ng-srcset, ng-href are interpolated
forEach(['src', 'srcset', 'href'], function(attrName) {
  var normalized = directiveNormalize('ng-' + attrName);
  ngAttributeAliasDirectives[normalized] = function() {
    return {
      priority: 99, // it needs to run after the attributes are interpolated
      link: function(scope, element, attr) {
        attr.$observe(normalized, function(value) {
          if (!value)
             return;

          attr.$set(attrName, value);

          // on IE, if "ng:src" directive declaration is used and "src" attribute doesn't exist
          // then calling element.setAttribute('src', 'foo') doesn't do anything, so we need
          // to set the property as well to achieve the desired effect.
          // we use attr[attrName] value since $set can sanitize the url.
          if (msie) element.prop(attrName, attr[attrName]);
        });
      }
    };
  };
});

/* global -nullFormCtrl */
var nullFormCtrl = {
  $addControl: noop,
  $removeControl: noop,
  $setValidity: noop,
  $setDirty: noop,
  $setPristine: noop
};

/**
 * @ngdoc object
 * @name ng.directive:form.FormController
 *
 * @property {boolean} $pristine True if user has not interacted with the form yet.
 * @property {boolean} $dirty True if user has already interacted with the form.
 * @property {boolean} $valid True if all of the containing forms and controls are valid.
 * @property {boolean} $invalid True if at least one containing control or form is invalid.
 *
 * @property {Object} $error Is an object hash, containing references to all invalid controls or
 *  forms, where:
 *
 *  - keys are validation tokens (error names) — such as `required`, `url` or `email`,
 *  - values are arrays of controls or forms that are invalid with given error.
 *
 * @description
 * `FormController` keeps track of all its controls and nested forms as well as state of them,
 * such as being valid/invalid or dirty/pristine.
 *
 * Each {@link ng.directive:form form} directive creates an instance
 * of `FormController`.
 *
 */
//asks for $scope to fool the BC controller module
FormController.$inject = ['$element', '$attrs', '$scope'];
function FormController(element, attrs) {
  var form = this,
      parentForm = element.parent().controller('form') || nullFormCtrl,
      invalidCount = 0, // used to easily determine if we are valid
      errors = form.$error = {},
      controls = [];

  // init state
  form.$name = attrs.name || attrs.ngForm;
  form.$dirty = false;
  form.$pristine = true;
  form.$valid = true;
  form.$invalid = false;

  parentForm.$addControl(form);

  // Setup initial state of the control
  element.addClass(PRISTINE_CLASS);
  toggleValidCss(true);

  // convenience method for easy toggling of classes
  function toggleValidCss(isValid, validationErrorKey) {
    validationErrorKey = validationErrorKey ? '-' + snake_case(validationErrorKey, '-') : '';
    element.
      removeClass((isValid ? INVALID_CLASS : VALID_CLASS) + validationErrorKey).
      addClass((isValid ? VALID_CLASS : INVALID_CLASS) + validationErrorKey);
  }

  /**
   * @ngdoc function
   * @name ng.directive:form.FormController#$addControl
   * @methodOf ng.directive:form.FormController
   *
   * @description
   * Register a control with the form.
   *
   * Input elements using ngModelController do this automatically when they are linked.
   */
  form.$addControl = function(control) {
    // Breaking change - before, inputs whose name was "hasOwnProperty" were quietly ignored
    // and not added to the scope.  Now we throw an error.
    assertNotHasOwnProperty(control.$name, 'input');
    controls.push(control);

    if (control.$name) {
      form[control.$name] = control;
    }
  };

  /**
   * @ngdoc function
   * @name ng.directive:form.FormController#$removeControl
   * @methodOf ng.directive:form.FormController
   *
   * @description
   * Deregister a control from the form.
   *
   * Input elements using ngModelController do this automatically when they are destroyed.
   */
  form.$removeControl = function(control) {
    if (control.$name && form[control.$name] === control) {
      delete form[control.$name];
    }
    forEach(errors, function(queue, validationToken) {
      form.$setValidity(validationToken, true, control);
    });

    arrayRemove(controls, control);
  };

  /**
   * @ngdoc function
   * @name ng.directive:form.FormController#$setValidity
   * @methodOf ng.directive:form.FormController
   *
   * @description
   * Sets the validity of a form control.
   *
   * This method will also propagate to parent forms.
   */
  form.$setValidity = function(validationToken, isValid, control) {
    var queue = errors[validationToken];

    if (isValid) {
      if (queue) {
        arrayRemove(queue, control);
        if (!queue.length) {
          invalidCount--;
          if (!invalidCount) {
            toggleValidCss(isValid);
            form.$valid = true;
            form.$invalid = false;
          }
          errors[validationToken] = false;
          toggleValidCss(true, validationToken);
          parentForm.$setValidity(validationToken, true, form);
        }
      }

    } else {
      if (!invalidCount) {
        toggleValidCss(isValid);
      }
      if (queue) {
        if (includes(queue, control)) return;
      } else {
        errors[validationToken] = queue = [];
        invalidCount++;
        toggleValidCss(false, validationToken);
        parentForm.$setValidity(validationToken, false, form);
      }
      queue.push(control);

      form.$valid = false;
      form.$invalid = true;
    }
  };

  /**
   * @ngdoc function
   * @name ng.directive:form.FormController#$setDirty
   * @methodOf ng.directive:form.FormController
   *
   * @description
   * Sets the form to a dirty state.
   *
   * This method can be called to add the 'ng-dirty' class and set the form to a dirty
   * state (ng-dirty class). This method will also propagate to parent forms.
   */
  form.$setDirty = function() {
    element.removeClass(PRISTINE_CLASS).addClass(DIRTY_CLASS);
    form.$dirty = true;
    form.$pristine = false;
    parentForm.$setDirty();
  };

  /**
   * @ngdoc function
   * @name ng.directive:form.FormController#$setPristine
   * @methodOf ng.directive:form.FormController
   *
   * @description
   * Sets the form to its pristine state.
   *
   * This method can be called to remove the 'ng-dirty' class and set the form to its pristine
   * state (ng-pristine class). This method will also propagate to all the controls contained
   * in this form.
   *
   * Setting a form back to a pristine state is often useful when we want to 'reuse' a form after
   * saving or resetting it.
   */
  form.$setPristine = function () {
    element.removeClass(DIRTY_CLASS).addClass(PRISTINE_CLASS);
    form.$dirty = false;
    form.$pristine = true;
    forEach(controls, function(control) {
      control.$setPristine();
    });
  };
}


/**
 * @ngdoc directive
 * @name ng.directive:ngForm
 * @restrict EAC
 *
 * @description
 * Nestable alias of {@link ng.directive:form `form`} directive. HTML
 * does not allow nesting of form elements. It is useful to nest forms, for example if the validity of a
 * sub-group of controls needs to be determined.
 *
 * @param {string=} ngForm|name Name of the form. If specified, the form controller will be published into
 *                       related scope, under this name.
 *
 */

 /**
 * @ngdoc directive
 * @name ng.directive:form
 * @restrict E
 *
 * @description
 * Directive that instantiates
 * {@link ng.directive:form.FormController FormController}.
 *
 * If the `name` attribute is specified, the form controller is published onto the current scope under
 * this name.
 *
 * # Alias: {@link ng.directive:ngForm `ngForm`}
 *
 * In Angular forms can be nested. This means that the outer form is valid when all of the child
 * forms are valid as well. However, browsers do not allow nesting of `<form>` elements, so
 * Angular provides the {@link ng.directive:ngForm `ngForm`} directive which behaves identically to
 * `<form>` but can be nested.  This allows you to have nested forms, which is very useful when
 * using Angular validation directives in forms that are dynamically generated using the
 * {@link ng.directive:ngRepeat `ngRepeat`} directive. Since you cannot dynamically generate the `name`
 * attribute of input elements using interpolation, you have to wrap each set of repeated inputs in an
 * `ngForm` directive and nest these in an outer `form` element.
 *
 *
 * # CSS classes
 *  - `ng-valid` Is set if the form is valid.
 *  - `ng-invalid` Is set if the form is invalid.
 *  - `ng-pristine` Is set if the form is pristine.
 *  - `ng-dirty` Is set if the form is dirty.
 *
 *
 * # Submitting a form and preventing the default action
 *
 * Since the role of forms in client-side Angular applications is different than in classical
 * roundtrip apps, it is desirable for the browser not to translate the form submission into a full
 * page reload that sends the data to the server. Instead some javascript logic should be triggered
 * to handle the form submission in an application-specific way.
 *
 * For this reason, Angular prevents the default action (form submission to the server) unless the
 * `<form>` element has an `action` attribute specified.
 *
 * You can use one of the following two ways to specify what javascript method should be called when
 * a form is submitted:
 *
 * - {@link ng.directive:ngSubmit ngSubmit} directive on the form element
 * - {@link ng.directive:ngClick ngClick} directive on the first
  *  button or input field of type submit (input[type=submit])
 *
 * To prevent double execution of the handler, use only one of the {@link ng.directive:ngSubmit ngSubmit}
 * or {@link ng.directive:ngClick ngClick} directives.
 * This is because of the following form submission rules in the HTML specification:
 *
 * - If a form has only one input field then hitting enter in this field triggers form submit
 * (`ngSubmit`)
 * - if a form has 2+ input fields and no buttons or input[type=submit] then hitting enter
 * doesn't trigger submit
 * - if a form has one or more input fields and one or more buttons or input[type=submit] then
 * hitting enter in any of the input fields will trigger the click handler on the *first* button or
 * input[type=submit] (`ngClick`) *and* a submit handler on the enclosing form (`ngSubmit`)
 *
 * @param {string=} name Name of the form. If specified, the form controller will be published into
 *                       related scope, under this name.
 *
 * @example
    <doc:example>
      <doc:source>
       <script>
         function Ctrl($scope) {
           $scope.userType = 'guest';
         }
       </script>
       <form name="myForm" ng-controller="Ctrl">
         userType: <input name="input" ng-model="userType" required>
         <span class="error" ng-show="myForm.input.$error.required">Required!</span><br>
         <tt>userType = {{userType}}</tt><br>
         <tt>myForm.input.$valid = {{myForm.input.$valid}}</tt><br>
         <tt>myForm.input.$error = {{myForm.input.$error}}</tt><br>
         <tt>myForm.$valid = {{myForm.$valid}}</tt><br>
         <tt>myForm.$error.required = {{!!myForm.$error.required}}</tt><br>
        </form>
      </doc:source>
      <doc:scenario>
        it('should initialize to model', function() {
         expect(binding('userType')).toEqual('guest');
         expect(binding('myForm.input.$valid')).toEqual('true');
        });

        it('should be invalid if empty', function() {
         input('userType').enter('');
         expect(binding('userType')).toEqual('');
         expect(binding('myForm.input.$valid')).toEqual('false');
        });
      </doc:scenario>
    </doc:example>
 */
var formDirectiveFactory = function(isNgForm) {
  return ['$timeout', function($timeout) {
    var formDirective = {
      name: 'form',
      restrict: isNgForm ? 'EAC' : 'E',
      controller: FormController,
      compile: function() {
        return {
          pre: function(scope, formElement, attr, controller) {
            if (!attr.action) {
              // we can't use jq events because if a form is destroyed during submission the default
              // action is not prevented. see #1238
              //
              // IE 9 is not affected because it doesn't fire a submit event and try to do a full
              // page reload if the form was destroyed by submission of the form via a click handler
              // on a button in the form. Looks like an IE9 specific bug.
              var preventDefaultListener = function(event) {
                event.preventDefault
                  ? event.preventDefault()
                  : event.returnValue = false; // IE
              };

              addEventListenerFn(formElement[0], 'submit', preventDefaultListener);

              // unregister the preventDefault listener so that we don't not leak memory but in a
              // way that will achieve the prevention of the default action.
              formElement.on('$destroy', function() {
                $timeout(function() {
                  removeEventListenerFn(formElement[0], 'submit', preventDefaultListener);
                }, 0, false);
              });
            }

            var parentFormCtrl = formElement.parent().controller('form'),
                alias = attr.name || attr.ngForm;

            if (alias) {
              setter(scope, alias, controller, alias);
            }
            if (parentFormCtrl) {
              formElement.on('$destroy', function() {
                parentFormCtrl.$removeControl(controller);
                if (alias) {
                  setter(scope, alias, undefined, alias);
                }
                extend(controller, nullFormCtrl); //stop propagating child destruction handlers upwards
              });
            }
          }
        };
      }
    };

    return formDirective;
  }];
};

var formDirective = formDirectiveFactory();
var ngFormDirective = formDirectiveFactory(true);

/* global

    -VALID_CLASS,
    -INVALID_CLASS,
    -PRISTINE_CLASS,
    -DIRTY_CLASS
*/

var URL_REGEXP = /^(ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?$/;
var EMAIL_REGEXP = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,6}$/;
var NUMBER_REGEXP = /^\s*(\-|\+)?(\d+|(\d*(\.\d*)))\s*$/;

var inputType = {

  /**
   * @ngdoc inputType
   * @name ng.directive:input.text
   *
   * @description
   * Standard HTML text input with angular data binding.
   *
   * @param {string} ngModel Assignable angular expression to data-bind to.
   * @param {string=} name Property name of the form under which the control is published.
   * @param {string=} required Adds `required` validation error key if the value is not entered.
   * @param {string=} ngRequired Adds `required` attribute and `required` validation constraint to
   *    the element when the ngRequired expression evaluates to true. Use `ngRequired` instead of
   *    `required` when you want to data-bind to the `required` attribute.
   * @param {number=} ngMinlength Sets `minlength` validation error key if the value is shorter than
   *    minlength.
   * @param {number=} ngMaxlength Sets `maxlength` validation error key if the value is longer than
   *    maxlength.
   * @param {string=} ngPattern Sets `pattern` validation error key if the value does not match the
   *    RegExp pattern expression. Expected value is `/regexp/` for inline patterns or `regexp` for
   *    patterns defined as scope expressions.
   * @param {string=} ngChange Angular expression to be executed when input changes due to user
   *    interaction with the input element.
   * @param {boolean=} [ngTrim=true] If set to false Angular will not automatically trim the input.
   *
   * @example
      <doc:example>
        <doc:source>
         <script>
           function Ctrl($scope) {
             $scope.text = 'guest';
             $scope.word = /^\s*\w*\s*$/;
           }
         </script>
         <form name="myForm" ng-controller="Ctrl">
           Single word: <input type="text" name="input" ng-model="text"
                               ng-pattern="word" required ng-trim="false">
           <span class="error" ng-show="myForm.input.$error.required">
             Required!</span>
           <span class="error" ng-show="myForm.input.$error.pattern">
             Single word only!</span>

           <tt>text = {{text}}</tt><br/>
           <tt>myForm.input.$valid = {{myForm.input.$valid}}</tt><br/>
           <tt>myForm.input.$error = {{myForm.input.$error}}</tt><br/>
           <tt>myForm.$valid = {{myForm.$valid}}</tt><br/>
           <tt>myForm.$error.required = {{!!myForm.$error.required}}</tt><br/>
          </form>
        </doc:source>
        <doc:scenario>
          it('should initialize to model', function() {
            expect(binding('text')).toEqual('guest');
            expect(binding('myForm.input.$valid')).toEqual('true');
          });

          it('should be invalid if empty', function() {
            input('text').enter('');
            expect(binding('text')).toEqual('');
            expect(binding('myForm.input.$valid')).toEqual('false');
          });

          it('should be invalid if multi word', function() {
            input('text').enter('hello world');
            expect(binding('myForm.input.$valid')).toEqual('false');
          });

          it('should not be trimmed', function() {
            input('text').enter('untrimmed ');
            expect(binding('text')).toEqual('untrimmed ');
            expect(binding('myForm.input.$valid')).toEqual('true');
          });
        </doc:scenario>
      </doc:example>
   */
  'text': textInputType,


  /**
   * @ngdoc inputType
   * @name ng.directive:input.number
   *
   * @description
   * Text input with number validation and transformation. Sets the `number` validation
   * error if not a valid number.
   *
   * @param {string} ngModel Assignable angular expression to data-bind to.
   * @param {string=} name Property name of the form under which the control is published.
   * @param {string=} min Sets the `min` validation error key if the value entered is less than `min`.
   * @param {string=} max Sets the `max` validation error key if the value entered is greater than `max`.
   * @param {string=} required Sets `required` validation error key if the value is not entered.
   * @param {string=} ngRequired Adds `required` attribute and `required` validation constraint to
   *    the element when the ngRequired expression evaluates to true. Use `ngRequired` instead of
   *    `required` when you want to data-bind to the `required` attribute.
   * @param {number=} ngMinlength Sets `minlength` validation error key if the value is shorter than
   *    minlength.
   * @param {number=} ngMaxlength Sets `maxlength` validation error key if the value is longer than
   *    maxlength.
   * @param {string=} ngPattern Sets `pattern` validation error key if the value does not match the
   *    RegExp pattern expression. Expected value is `/regexp/` for inline patterns or `regexp` for
   *    patterns defined as scope expressions.
   * @param {string=} ngChange Angular expression to be executed when input changes due to user
   *    interaction with the input element.
   *
   * @example
      <doc:example>
        <doc:source>
         <script>
           function Ctrl($scope) {
             $scope.value = 12;
           }
         </script>
         <form name="myForm" ng-controller="Ctrl">
           Number: <input type="number" name="input" ng-model="value"
                          min="0" max="99" required>
           <span class="error" ng-show="myForm.input.$error.required">
             Required!</span>
           <span class="error" ng-show="myForm.input.$error.number">
             Not valid number!</span>
           <tt>value = {{value}}</tt><br/>
           <tt>myForm.input.$valid = {{myForm.input.$valid}}</tt><br/>
           <tt>myForm.input.$error = {{myForm.input.$error}}</tt><br/>
           <tt>myForm.$valid = {{myForm.$valid}}</tt><br/>
           <tt>myForm.$error.required = {{!!myForm.$error.required}}</tt><br/>
          </form>
        </doc:source>
        <doc:scenario>
          it('should initialize to model', function() {
           expect(binding('value')).toEqual('12');
           expect(binding('myForm.input.$valid')).toEqual('true');
          });

          it('should be invalid if empty', function() {
           input('value').enter('');
           expect(binding('value')).toEqual('');
           expect(binding('myForm.input.$valid')).toEqual('false');
          });

          it('should be invalid if over max', function() {
           input('value').enter('123');
           expect(binding('value')).toEqual('');
           expect(binding('myForm.input.$valid')).toEqual('false');
          });
        </doc:scenario>
      </doc:example>
   */
  'number': numberInputType,


  /**
   * @ngdoc inputType
   * @name ng.directive:input.url
   *
   * @description
   * Text input with URL validation. Sets the `url` validation error key if the content is not a
   * valid URL.
   *
   * @param {string} ngModel Assignable angular expression to data-bind to.
   * @param {string=} name Property name of the form under which the control is published.
   * @param {string=} required Sets `required` validation error key if the value is not entered.
   * @param {string=} ngRequired Adds `required` attribute and `required` validation constraint to
   *    the element when the ngRequired expression evaluates to true. Use `ngRequired` instead of
   *    `required` when you want to data-bind to the `required` attribute.
   * @param {number=} ngMinlength Sets `minlength` validation error key if the value is shorter than
   *    minlength.
   * @param {number=} ngMaxlength Sets `maxlength` validation error key if the value is longer than
   *    maxlength.
   * @param {string=} ngPattern Sets `pattern` validation error key if the value does not match the
   *    RegExp pattern expression. Expected value is `/regexp/` for inline patterns or `regexp` for
   *    patterns defined as scope expressions.
   * @param {string=} ngChange Angular expression to be executed when input changes due to user
   *    interaction with the input element.
   *
   * @example
      <doc:example>
        <doc:source>
         <script>
           function Ctrl($scope) {
             $scope.text = 'http://google.com';
           }
         </script>
         <form name="myForm" ng-controller="Ctrl">
           URL: <input type="url" name="input" ng-model="text" required>
           <span class="error" ng-show="myForm.input.$error.required">
             Required!</span>
           <span class="error" ng-show="myForm.input.$error.url">
             Not valid url!</span>
           <tt>text = {{text}}</tt><br/>
           <tt>myForm.input.$valid = {{myForm.input.$valid}}</tt><br/>
           <tt>myForm.input.$error = {{myForm.input.$error}}</tt><br/>
           <tt>myForm.$valid = {{myForm.$valid}}</tt><br/>
           <tt>myForm.$error.required = {{!!myForm.$error.required}}</tt><br/>
           <tt>myForm.$error.url = {{!!myForm.$error.url}}</tt><br/>
          </form>
        </doc:source>
        <doc:scenario>
          it('should initialize to model', function() {
            expect(binding('text')).toEqual('http://google.com');
            expect(binding('myForm.input.$valid')).toEqual('true');
          });

          it('should be invalid if empty', function() {
            input('text').enter('');
            expect(binding('text')).toEqual('');
            expect(binding('myForm.input.$valid')).toEqual('false');
          });

          it('should be invalid if not url', function() {
            input('text').enter('xxx');
            expect(binding('myForm.input.$valid')).toEqual('false');
          });
        </doc:scenario>
      </doc:example>
   */
  'url': urlInputType,


  /**
   * @ngdoc inputType
   * @name ng.directive:input.email
   *
   * @description
   * Text input with email validation. Sets the `email` validation error key if not a valid email
   * address.
   *
   * @param {string} ngModel Assignable angular expression to data-bind to.
   * @param {string=} name Property name of the form under which the control is published.
   * @param {string=} required Sets `required` validation error key if the value is not entered.
   * @param {string=} ngRequired Adds `required` attribute and `required` validation constraint to
   *    the element when the ngRequired expression evaluates to true. Use `ngRequired` instead of
   *    `required` when you want to data-bind to the `required` attribute.
   * @param {number=} ngMinlength Sets `minlength` validation error key if the value is shorter than
   *    minlength.
   * @param {number=} ngMaxlength Sets `maxlength` validation error key if the value is longer than
   *    maxlength.
   * @param {string=} ngPattern Sets `pattern` validation error key if the value does not match the
   *    RegExp pattern expression. Expected value is `/regexp/` for inline patterns or `regexp` for
   *    patterns defined as scope expressions.
   * @param {string=} ngChange Angular expression to be executed when input changes due to user
   *    interaction with the input element.
   *
   * @example
      <doc:example>
        <doc:source>
         <script>
           function Ctrl($scope) {
             $scope.text = 'me@example.com';
           }
         </script>
           <form name="myForm" ng-controller="Ctrl">
             Email: <input type="email" name="input" ng-model="text" required>
             <span class="error" ng-show="myForm.input.$error.required">
               Required!</span>
             <span class="error" ng-show="myForm.input.$error.email">
               Not valid email!</span>
             <tt>text = {{text}}</tt><br/>
             <tt>myForm.input.$valid = {{myForm.input.$valid}}</tt><br/>
             <tt>myForm.input.$error = {{myForm.input.$error}}</tt><br/>
             <tt>myForm.$valid = {{myForm.$valid}}</tt><br/>
             <tt>myForm.$error.required = {{!!myForm.$error.required}}</tt><br/>
             <tt>myForm.$error.email = {{!!myForm.$error.email}}</tt><br/>
           </form>
        </doc:source>
        <doc:scenario>
          it('should initialize to model', function() {
            expect(binding('text')).toEqual('me@example.com');
            expect(binding('myForm.input.$valid')).toEqual('true');
          });

          it('should be invalid if empty', function() {
            input('text').enter('');
            expect(binding('text')).toEqual('');
            expect(binding('myForm.input.$valid')).toEqual('false');
          });

          it('should be invalid if not email', function() {
            input('text').enter('xxx');
            expect(binding('myForm.input.$valid')).toEqual('false');
          });
        </doc:scenario>
      </doc:example>
   */
  'email': emailInputType,


  /**
   * @ngdoc inputType
   * @name ng.directive:input.radio
   *
   * @description
   * HTML radio button.
   *
   * @param {string} ngModel Assignable angular expression to data-bind to.
   * @param {string} value The value to which the expression should be set when selected.
   * @param {string=} name Property name of the form under which the control is published.
   * @param {string=} ngChange Angular expression to be executed when input changes due to user
   *    interaction with the input element.
   *
   * @example
      <doc:example>
        <doc:source>
         <script>
           function Ctrl($scope) {
             $scope.color = 'blue';
           }
         </script>
         <form name="myForm" ng-controller="Ctrl">
           <input type="radio" ng-model="color" value="red">  Red <br/>
           <input type="radio" ng-model="color" value="green"> Green <br/>
           <input type="radio" ng-model="color" value="blue"> Blue <br/>
           <tt>color = {{color}}</tt><br/>
          </form>
        </doc:source>
        <doc:scenario>
          it('should change state', function() {
            expect(binding('color')).toEqual('blue');

            input('color').select('red');
            expect(binding('color')).toEqual('red');
          });
        </doc:scenario>
      </doc:example>
   */
  'radio': radioInputType,


  /**
   * @ngdoc inputType
   * @name ng.directive:input.checkbox
   *
   * @description
   * HTML checkbox.
   *
   * @param {string} ngModel Assignable angular expression to data-bind to.
   * @param {string=} name Property name of the form under which the control is published.
   * @param {string=} ngTrueValue The value to which the expression should be set when selected.
   * @param {string=} ngFalseValue The value to which the expression should be set when not selected.
   * @param {string=} ngChange Angular expression to be executed when input changes due to user
   *    interaction with the input element.
   *
   * @example
      <doc:example>
        <doc:source>
         <script>
           function Ctrl($scope) {
             $scope.value1 = true;
             $scope.value2 = 'YES'
           }
         </script>
         <form name="myForm" ng-controller="Ctrl">
           Value1: <input type="checkbox" ng-model="value1"> <br/>
           Value2: <input type="checkbox" ng-model="value2"
                          ng-true-value="YES" ng-false-value="NO"> <br/>
           <tt>value1 = {{value1}}</tt><br/>
           <tt>value2 = {{value2}}</tt><br/>
          </form>
        </doc:source>
        <doc:scenario>
          it('should change state', function() {
            expect(binding('value1')).toEqual('true');
            expect(binding('value2')).toEqual('YES');

            input('value1').check();
            input('value2').check();
            expect(binding('value1')).toEqual('false');
            expect(binding('value2')).toEqual('NO');
          });
        </doc:scenario>
      </doc:example>
   */
  'checkbox': checkboxInputType,

  'hidden': noop,
  'button': noop,
  'submit': noop,
  'reset': noop
};


function textInputType(scope, element, attr, ctrl, $sniffer, $browser) {

  var listener = function() {
    var value = element.val();

    // By default we will trim the value
    // If the attribute ng-trim exists we will avoid trimming
    // e.g. <input ng-model="foo" ng-trim="false">
    if (toBoolean(attr.ngTrim || 'T')) {
      value = trim(value);
    }

    if (ctrl.$viewValue !== value) {
      scope.$apply(function() {
        ctrl.$setViewValue(value);
      });
    }
  };

  // if the browser does support "input" event, we are fine - except on IE9 which doesn't fire the
  // input event on backspace, delete or cut
  if ($sniffer.hasEvent('input')) {
    element.on('input', listener);
  } else {
    var timeout;

    var deferListener = function() {
      if (!timeout) {
        timeout = $browser.defer(function() {
          listener();
          timeout = null;
        });
      }
    };

    element.on('keydown', function(event) {
      var key = event.keyCode;

      // ignore
      //    command            modifiers                   arrows
      if (key === 91 || (15 < key && key < 19) || (37 <= key && key <= 40)) return;

      deferListener();
    });

    // if user paste into input using mouse, we need "change" event to catch it
    element.on('change', listener);

    // if user modifies input value using context menu in IE, we need "paste" and "cut" events to catch it
    if ($sniffer.hasEvent('paste')) {
      element.on('paste cut', deferListener);
    }
  }


  ctrl.$render = function() {
    element.val(ctrl.$isEmpty(ctrl.$viewValue) ? '' : ctrl.$viewValue);
  };

  // pattern validator
  var pattern = attr.ngPattern,
      patternValidator,
      match;

  var validate = function(regexp, value) {
    if (ctrl.$isEmpty(value) || regexp.test(value)) {
      ctrl.$setValidity('pattern', true);
      return value;
    } else {
      ctrl.$setValidity('pattern', false);
      return undefined;
    }
  };

  if (pattern) {
    match = pattern.match(/^\/(.*)\/([gim]*)$/);
    if (match) {
      pattern = new RegExp(match[1], match[2]);
      patternValidator = function(value) {
        return validate(pattern, value);
      };
    } else {
      patternValidator = function(value) {
        var patternObj = scope.$eval(pattern);

        if (!patternObj || !patternObj.test) {
          throw minErr('ngPattern')('noregexp',
            'Expected {0} to be a RegExp but was {1}. Element: {2}', pattern,
            patternObj, startingTag(element));
        }
        return validate(patternObj, value);
      };
    }

    ctrl.$formatters.push(patternValidator);
    ctrl.$parsers.push(patternValidator);
  }

  // min length validator
  if (attr.ngMinlength) {
    var minlength = int(attr.ngMinlength);
    var minLengthValidator = function(value) {
      if (!ctrl.$isEmpty(value) && value.length < minlength) {
        ctrl.$setValidity('minlength', false);
        return undefined;
      } else {
        ctrl.$setValidity('minlength', true);
        return value;
      }
    };

    ctrl.$parsers.push(minLengthValidator);
    ctrl.$formatters.push(minLengthValidator);
  }

  // max length validator
  if (attr.ngMaxlength) {
    var maxlength = int(attr.ngMaxlength);
    var maxLengthValidator = function(value) {
      if (!ctrl.$isEmpty(value) && value.length > maxlength) {
        ctrl.$setValidity('maxlength', false);
        return undefined;
      } else {
        ctrl.$setValidity('maxlength', true);
        return value;
      }
    };

    ctrl.$parsers.push(maxLengthValidator);
    ctrl.$formatters.push(maxLengthValidator);
  }
}

function numberInputType(scope, element, attr, ctrl, $sniffer, $browser) {
  textInputType(scope, element, attr, ctrl, $sniffer, $browser);

  ctrl.$parsers.push(function(value) {
    var empty = ctrl.$isEmpty(value);
    if (empty || NUMBER_REGEXP.test(value)) {
      ctrl.$setValidity('number', true);
      return value === '' ? null : (empty ? value : parseFloat(value));
    } else {
      ctrl.$setValidity('number', false);
      return undefined;
    }
  });

  ctrl.$formatters.push(function(value) {
    return ctrl.$isEmpty(value) ? '' : '' + value;
  });

  if (attr.min) {
    var minValidator = function(value) {
      var min = parseFloat(attr.min);
      if (!ctrl.$isEmpty(value) && value < min) {
        ctrl.$setValidity('min', false);
        return undefined;
      } else {
        ctrl.$setValidity('min', true);
        return value;
      }
    };

    ctrl.$parsers.push(minValidator);
    ctrl.$formatters.push(minValidator);
  }

  if (attr.max) {
    var maxValidator = function(value) {
      var max = parseFloat(attr.max);
      if (!ctrl.$isEmpty(value) && value > max) {
        ctrl.$setValidity('max', false);
        return undefined;
      } else {
        ctrl.$setValidity('max', true);
        return value;
      }
    };

    ctrl.$parsers.push(maxValidator);
    ctrl.$formatters.push(maxValidator);
  }

  ctrl.$formatters.push(function(value) {

    if (ctrl.$isEmpty(value) || isNumber(value)) {
      ctrl.$setValidity('number', true);
      return value;
    } else {
      ctrl.$setValidity('number', false);
      return undefined;
    }
  });
}

function urlInputType(scope, element, attr, ctrl, $sniffer, $browser) {
  textInputType(scope, element, attr, ctrl, $sniffer, $browser);

  var urlValidator = function(value) {
    if (ctrl.$isEmpty(value) || URL_REGEXP.test(value)) {
      ctrl.$setValidity('url', true);
      return value;
    } else {
      ctrl.$setValidity('url', false);
      return undefined;
    }
  };

  ctrl.$formatters.push(urlValidator);
  ctrl.$parsers.push(urlValidator);
}

function emailInputType(scope, element, attr, ctrl, $sniffer, $browser) {
  textInputType(scope, element, attr, ctrl, $sniffer, $browser);

  var emailValidator = function(value) {
    if (ctrl.$isEmpty(value) || EMAIL_REGEXP.test(value)) {
      ctrl.$setValidity('email', true);
      return value;
    } else {
      ctrl.$setValidity('email', false);
      return undefined;
    }
  };

  ctrl.$formatters.push(emailValidator);
  ctrl.$parsers.push(emailValidator);
}

function radioInputType(scope, element, attr, ctrl) {
  // make the name unique, if not defined
  if (isUndefined(attr.name)) {
    element.attr('name', nextUid());
  }

  element.on('click', function() {
    if (element[0].checked) {
      scope.$apply(function() {
        ctrl.$setViewValue(attr.value);
      });
    }
  });

  ctrl.$render = function() {
    var value = attr.value;
    element[0].checked = (value == ctrl.$viewValue);
  };

  attr.$observe('value', ctrl.$render);
}

function checkboxInputType(scope, element, attr, ctrl) {
  var trueValue = attr.ngTrueValue,
      falseValue = attr.ngFalseValue;

  if (!isString(trueValue)) trueValue = true;
  if (!isString(falseValue)) falseValue = false;

  element.on('click', function() {
    scope.$apply(function() {
      ctrl.$setViewValue(element[0].checked);
    });
  });

  ctrl.$render = function() {
    element[0].checked = ctrl.$viewValue;
  };

  // Override the standard `$isEmpty` because a value of `false` means empty in a checkbox.
  ctrl.$isEmpty = function(value) {
    return value !== trueValue;
  };

  ctrl.$formatters.push(function(value) {
    return value === trueValue;
  });

  ctrl.$parsers.push(function(value) {
    return value ? trueValue : falseValue;
  });
}


/**
 * @ngdoc directive
 * @name ng.directive:textarea
 * @restrict E
 *
 * @description
 * HTML textarea element control with angular data-binding. The data-binding and validation
 * properties of this element are exactly the same as those of the
 * {@link ng.directive:input input element}.
 *
 * @param {string} ngModel Assignable angular expression to data-bind to.
 * @param {string=} name Property name of the form under which the control is published.
 * @param {string=} required Sets `required` validation error key if the value is not entered.
 * @param {string=} ngRequired Adds `required` attribute and `required` validation constraint to
 *    the element when the ngRequired expression evaluates to true. Use `ngRequired` instead of
 *    `required` when you want to data-bind to the `required` attribute.
 * @param {number=} ngMinlength Sets `minlength` validation error key if the value is shorter than
 *    minlength.
 * @param {number=} ngMaxlength Sets `maxlength` validation error key if the value is longer than
 *    maxlength.
 * @param {string=} ngPattern Sets `pattern` validation error key if the value does not match the
 *    RegExp pattern expression. Expected value is `/regexp/` for inline patterns or `regexp` for
 *    patterns defined as scope expressions.
 * @param {string=} ngChange Angular expression to be executed when input changes due to user
 *    interaction with the input element.
 */


/**
 * @ngdoc directive
 * @name ng.directive:input
 * @restrict E
 *
 * @description
 * HTML input element control with angular data-binding. Input control follows HTML5 input types
 * and polyfills the HTML5 validation behavior for older browsers.
 *
 * @param {string} ngModel Assignable angular expression to data-bind to.
 * @param {string=} name Property name of the form under which the control is published.
 * @param {string=} required Sets `required` validation error key if the value is not entered.
 * @param {boolean=} ngRequired Sets `required` attribute if set to true
 * @param {number=} ngMinlength Sets `minlength` validation error key if the value is shorter than
 *    minlength.
 * @param {number=} ngMaxlength Sets `maxlength` validation error key if the value is longer than
 *    maxlength.
 * @param {string=} ngPattern Sets `pattern` validation error key if the value does not match the
 *    RegExp pattern expression. Expected value is `/regexp/` for inline patterns or `regexp` for
 *    patterns defined as scope expressions.
 * @param {string=} ngChange Angular expression to be executed when input changes due to user
 *    interaction with the input element.
 *
 * @example
    <doc:example>
      <doc:source>
       <script>
         function Ctrl($scope) {
           $scope.user = {name: 'guest', last: 'visitor'};
         }
       </script>
       <div ng-controller="Ctrl">
         <form name="myForm">
           User name: <input type="text" name="userName" ng-model="user.name" required>
           <span class="error" ng-show="myForm.userName.$error.required">
             Required!</span><br>
           Last name: <input type="text" name="lastName" ng-model="user.last"
             ng-minlength="3" ng-maxlength="10">
           <span class="error" ng-show="myForm.lastName.$error.minlength">
             Too short!</span>
           <span class="error" ng-show="myForm.lastName.$error.maxlength">
             Too long!</span><br>
         </form>
         <hr>
         <tt>user = {{user}}</tt><br/>
         <tt>myForm.userName.$valid = {{myForm.userName.$valid}}</tt><br>
         <tt>myForm.userName.$error = {{myForm.userName.$error}}</tt><br>
         <tt>myForm.lastName.$valid = {{myForm.lastName.$valid}}</tt><br>
         <tt>myForm.lastName.$error = {{myForm.lastName.$error}}</tt><br>
         <tt>myForm.$valid = {{myForm.$valid}}</tt><br>
         <tt>myForm.$error.required = {{!!myForm.$error.required}}</tt><br>
         <tt>myForm.$error.minlength = {{!!myForm.$error.minlength}}</tt><br>
         <tt>myForm.$error.maxlength = {{!!myForm.$error.maxlength}}</tt><br>
       </div>
      </doc:source>
      <doc:scenario>
        it('should initialize to model', function() {
          expect(binding('user')).toEqual('{"name":"guest","last":"visitor"}');
          expect(binding('myForm.userName.$valid')).toEqual('true');
          expect(binding('myForm.$valid')).toEqual('true');
        });

        it('should be invalid if empty when required', function() {
          input('user.name').enter('');
          expect(binding('user')).toEqual('{"last":"visitor"}');
          expect(binding('myForm.userName.$valid')).toEqual('false');
          expect(binding('myForm.$valid')).toEqual('false');
        });

        it('should be valid if empty when min length is set', function() {
          input('user.last').enter('');
          expect(binding('user')).toEqual('{"name":"guest","last":""}');
          expect(binding('myForm.lastName.$valid')).toEqual('true');
          expect(binding('myForm.$valid')).toEqual('true');
        });

        it('should be invalid if less than required min length', function() {
          input('user.last').enter('xx');
          expect(binding('user')).toEqual('{"name":"guest"}');
          expect(binding('myForm.lastName.$valid')).toEqual('false');
          expect(binding('myForm.lastName.$error')).toMatch(/minlength/);
          expect(binding('myForm.$valid')).toEqual('false');
        });

        it('should be invalid if longer than max length', function() {
          input('user.last').enter('some ridiculously long name');
          expect(binding('user'))
            .toEqual('{"name":"guest"}');
          expect(binding('myForm.lastName.$valid')).toEqual('false');
          expect(binding('myForm.lastName.$error')).toMatch(/maxlength/);
          expect(binding('myForm.$valid')).toEqual('false');
        });
      </doc:scenario>
    </doc:example>
 */
var inputDirective = ['$browser', '$sniffer', function($browser, $sniffer) {
  return {
    restrict: 'E',
    require: '?ngModel',
    link: function(scope, element, attr, ctrl) {
      if (ctrl) {
        (inputType[lowercase(attr.type)] || inputType.text)(scope, element, attr, ctrl, $sniffer,
                                                            $browser);
      }
    }
  };
}];

var VALID_CLASS = 'ng-valid',
    INVALID_CLASS = 'ng-invalid',
    PRISTINE_CLASS = 'ng-pristine',
    DIRTY_CLASS = 'ng-dirty';

/**
 * @ngdoc object
 * @name ng.directive:ngModel.NgModelController
 *
 * @property {string} $viewValue Actual string value in the view.
 * @property {*} $modelValue The value in the model, that the control is bound to.
 * @property {Array.<Function>} $parsers Array of functions to execute, as a pipeline, whenever
       the control reads value from the DOM.  Each function is called, in turn, passing the value
       through to the next. Used to sanitize / convert the value as well as validation.
       For validation, the parsers should update the validity state using
       {@link ng.directive:ngModel.NgModelController#methods_$setValidity $setValidity()},
       and return `undefined` for invalid values.

 *
 * @property {Array.<Function>} $formatters Array of functions to execute, as a pipeline, whenever
       the model value changes. Each function is called, in turn, passing the value through to the
       next. Used to format / convert values for display in the control and validation.
 *      <pre>
 *      function formatter(value) {
 *        if (value) {
 *          return value.toUpperCase();
 *        }
 *      }
 *      ngModel.$formatters.push(formatter);
 *      </pre>
 *
 * @property {Array.<Function>} $viewChangeListeners Array of functions to execute whenever the
 *     view value has changed. It is called with no arguments, and its return value is ignored.
 *     This can be used in place of additional $watches against the model value.
 *
 * @property {Object} $error An object hash with all errors as keys.
 *
 * @property {boolean} $pristine True if user has not interacted with the control yet.
 * @property {boolean} $dirty True if user has already interacted with the control.
 * @property {boolean} $valid True if there is no error.
 * @property {boolean} $invalid True if at least one error on the control.
 *
 * @description
 *
 * `NgModelController` provides API for the `ng-model` directive. The controller contains
 * services for data-binding, validation, CSS updates, and value formatting and parsing. It
 * purposefully does not contain any logic which deals with DOM rendering or listening to
 * DOM events. Such DOM related logic should be provided by other directives which make use of
 * `NgModelController` for data-binding.
 *
 * ## Custom Control Example
 * This example shows how to use `NgModelController` with a custom control to achieve
 * data-binding. Notice how different directives (`contenteditable`, `ng-model`, and `required`)
 * collaborate together to achieve the desired result.
 *
 * Note that `contenteditable` is an HTML5 attribute, which tells the browser to let the element
 * contents be edited in place by the user.  This will not work on older browsers.
 *
 * <example module="customControl">
    <file name="style.css">
      [contenteditable] {
        border: 1px solid black;
        background-color: white;
        min-height: 20px;
      }

      .ng-invalid {
        border: 1px solid red;
      }

    </file>
    <file name="script.js">
      angular.module('customControl', []).
        directive('contenteditable', function() {
          return {
            restrict: 'A', // only activate on element attribute
            require: '?ngModel', // get a hold of NgModelController
            link: function(scope, element, attrs, ngModel) {
              if(!ngModel) return; // do nothing if no ng-model

              // Specify how UI should be updated
              ngModel.$render = function() {
                element.html(ngModel.$viewValue || '');
              };

              // Listen for change events to enable binding
              element.on('blur keyup change', function() {
                scope.$apply(read);
              });
              read(); // initialize

              // Write data to the model
              function read() {
                var html = element.html();
                // When we clear the content editable the browser leaves a <br> behind
                // If strip-br attribute is provided then we strip this out
                if( attrs.stripBr && html == '<br>' ) {
                  html = '';
                }
                ngModel.$setViewValue(html);
              }
            }
          };
        });
    </file>
    <file name="index.html">
      <form name="myForm">
       <div contenteditable
            name="myWidget" ng-model="userContent"
            strip-br="true"
            required>Change me!</div>
        <span ng-show="myForm.myWidget.$error.required">Required!</span>
       <hr>
       <textarea ng-model="userContent"></textarea>
      </form>
    </file>
    <file name="scenario.js">
      it('should data-bind and become invalid', function() {
        var contentEditable = element('[contenteditable]');

        expect(contentEditable.text()).toEqual('Change me!');
        input('userContent').enter('');
        expect(contentEditable.text()).toEqual('');
        expect(contentEditable.prop('className')).toMatch(/ng-invalid-required/);
      });
    </file>
 * </example>
 *
 * ## Isolated Scope Pitfall
 *
 * Note that if you have a directive with an isolated scope, you cannot require `ngModel`
 * since the model value will be looked up on the isolated scope rather than the outer scope.
 * When the directive updates the model value, calling `ngModel.$setViewValue()` the property
 * on the outer scope will not be updated. However you can get around this by using $parent.
 *
 * Here is an example of this situation.  You'll notice that the first div is not updating the input.
 * However the second div can update the input properly.
 *
 * <example module="badIsolatedDirective">
    <file name="script.js">
		angular.module('badIsolatedDirective', []).directive('isolate', function() {
      return {
        require: 'ngModel',
        scope: { },
        template: '<input ng-model="innerModel">',
        link: function(scope, element, attrs, ngModel) {
          scope.$watch('innerModel', function(value) {
            console.log(value);
            ngModel.$setViewValue(value);
          });
        }
      };
		});
    </file>
    <file name="index.html">
        <input ng-model="someModel"/>
        <div isolate ng-model="someModel"></div>
        <div isolate ng-model="$parent.someModel"></div>
    </file>
 * </example>
 *
 *
 */
var NgModelController = ['$scope', '$exceptionHandler', '$attrs', '$element', '$parse',
    function($scope, $exceptionHandler, $attr, $element, $parse) {
  this.$viewValue = Number.NaN;
  this.$modelValue = Number.NaN;
  this.$parsers = [];
  this.$formatters = [];
  this.$viewChangeListeners = [];
  this.$pristine = true;
  this.$dirty = false;
  this.$valid = true;
  this.$invalid = false;
  this.$name = $attr.name;

  var ngModelGet = $parse($attr.ngModel),
      ngModelSet = ngModelGet.assign;

  if (!ngModelSet) {
    throw minErr('ngModel')('nonassign', "Expression '{0}' is non-assignable. Element: {1}",
        $attr.ngModel, startingTag($element));
  }

  /**
   * @ngdoc function
   * @name ng.directive:ngModel.NgModelController#$render
   * @methodOf ng.directive:ngModel.NgModelController
   *
   * @description
   * Called when the view needs to be updated. It is expected that the user of the ng-model
   * directive will implement this method.
   */
  this.$render = noop;

  /**
   * @ngdoc function
   * @name { ng.directive:ngModel.NgModelController#$isEmpty
   * @methodOf ng.directive:ngModel.NgModelController
   *
   * @description
   * This is called when we need to determine if the value of the input is empty.
   *
   * For instance, the required directive does this to work out if the input has data or not.
   * The default `$isEmpty` function checks whether the value is `undefined`, `''`, `null` or `NaN`.
   *
   * You can override this for input directives whose concept of being empty is different to the
   * default. The `checkboxInputType` directive does this because in its case a value of `false`
   * implies empty.
   */
  this.$isEmpty = function(value) {
    return isUndefined(value) || value === '' || value === null || value !== value;
  };

  var parentForm = $element.inheritedData('$formController') || nullFormCtrl,
      invalidCount = 0, // used to easily determine if we are valid
      $error = this.$error = {}; // keep invalid keys here


  // Setup initial state of the control
  $element.addClass(PRISTINE_CLASS);
  toggleValidCss(true);

  // convenience method for easy toggling of classes
  function toggleValidCss(isValid, validationErrorKey) {
    validationErrorKey = validationErrorKey ? '-' + snake_case(validationErrorKey, '-') : '';
    $element.
      removeClass((isValid ? INVALID_CLASS : VALID_CLASS) + validationErrorKey).
      addClass((isValid ? VALID_CLASS : INVALID_CLASS) + validationErrorKey);
  }

  /**
   * @ngdoc function
   * @name ng.directive:ngModel.NgModelController#$setValidity
   * @methodOf ng.directive:ngModel.NgModelController
   *
   * @description
   * Change the validity state, and notifies the form when the control changes validity. (i.e. it
   * does not notify form if given validator is already marked as invalid).
   *
   * This method should be called by validators - i.e. the parser or formatter functions.
   *
   * @param {string} validationErrorKey Name of the validator. the `validationErrorKey` will assign
   *        to `$error[validationErrorKey]=isValid` so that it is available for data-binding.
   *        The `validationErrorKey` should be in camelCase and will get converted into dash-case
   *        for class name. Example: `myError` will result in `ng-valid-my-error` and `ng-invalid-my-error`
   *        class and can be bound to as  `{{someForm.someControl.$error.myError}}` .
   * @param {boolean} isValid Whether the current state is valid (true) or invalid (false).
   */
  this.$setValidity = function(validationErrorKey, isValid) {
    // Purposeful use of ! here to cast isValid to boolean in case it is undefined
    // jshint -W018
    if ($error[validationErrorKey] === !isValid) return;
    // jshint +W018

    if (isValid) {
      if ($error[validationErrorKey]) invalidCount--;
      if (!invalidCount) {
        toggleValidCss(true);
        this.$valid = true;
        this.$invalid = false;
      }
    } else {
      toggleValidCss(false);
      this.$invalid = true;
      this.$valid = false;
      invalidCount++;
    }

    $error[validationErrorKey] = !isValid;
    toggleValidCss(isValid, validationErrorKey);

    parentForm.$setValidity(validationErrorKey, isValid, this);
  };

  /**
   * @ngdoc function
   * @name ng.directive:ngModel.NgModelController#$setPristine
   * @methodOf ng.directive:ngModel.NgModelController
   *
   * @description
   * Sets the control to its pristine state.
   *
   * This method can be called to remove the 'ng-dirty' class and set the control to its pristine
   * state (ng-pristine class).
   */
  this.$setPristine = function () {
    this.$dirty = false;
    this.$pristine = true;
    $element.removeClass(DIRTY_CLASS).addClass(PRISTINE_CLASS);
  };

  /**
   * @ngdoc function
   * @name ng.directive:ngModel.NgModelController#$setViewValue
   * @methodOf ng.directive:ngModel.NgModelController
   *
   * @description
   * Update the view value.
   *
   * This method should be called when the view value changes, typically from within a DOM event handler.
   * For example {@link ng.directive:input input} and
   * {@link ng.directive:select select} directives call it.
   *
   * It will update the $viewValue, then pass this value through each of the functions in `$parsers`,
   * which includes any validators. The value that comes out of this `$parsers` pipeline, be applied to
   * `$modelValue` and the **expression** specified in the `ng-model` attribute.
   * 
   * Lastly, all the registered change listeners, in the `$viewChangeListeners` list, are called.
   *
   * Note that calling this function does not trigger a `$digest`.
   *
   * @param {string} value Value from the view.
   */
  this.$setViewValue = function(value) {
    this.$viewValue = value;

    // change to dirty
    if (this.$pristine) {
      this.$dirty = true;
      this.$pristine = false;
      $element.removeClass(PRISTINE_CLASS).addClass(DIRTY_CLASS);
      parentForm.$setDirty();
    }

    forEach(this.$parsers, function(fn) {
      value = fn(value);
    });

    if (this.$modelValue !== value) {
      this.$modelValue = value;
      ngModelSet($scope, value);
      forEach(this.$viewChangeListeners, function(listener) {
        try {
          listener();
        } catch(e) {
          $exceptionHandler(e);
        }
      });
    }
  };

  // model -> value
  var ctrl = this;

  $scope.$watch(function ngModelWatch() {
    var value = ngModelGet($scope);

    // if scope model value and ngModel value are out of sync
    if (ctrl.$modelValue !== value) {

      var formatters = ctrl.$formatters,
          idx = formatters.length;

      ctrl.$modelValue = value;
      while(idx--) {
        value = formatters[idx](value);
      }

      if (ctrl.$viewValue !== value) {
        ctrl.$viewValue = value;
        ctrl.$render();
      }
    }
  });
}];


/**
 * @ngdoc directive
 * @name ng.directive:ngModel
 *
 * @element input
 *
 * @description
 * The `ngModel` directive binds an `input`,`select`, `textarea` (or custom form control) to a
 * property on the scope using {@link ng.directive:ngModel.NgModelController NgModelController},
 * which is created and exposed by this directive.
 *
 * `ngModel` is responsible for:
 *
 * - Binding the view into the model, which other directives such as `input`, `textarea` or `select`
 *   require.
 * - Providing validation behavior (i.e. required, number, email, url).
 * - Keeping the state of the control (valid/invalid, dirty/pristine, validation errors).
 * - Setting related css classes on the element (`ng-valid`, `ng-invalid`, `ng-dirty`, `ng-pristine`).
 * - Registering the control with its parent {@link ng.directive:form form}.
 *
 * Note: `ngModel` will try to bind to the property given by evaluating the expression on the
 * current scope. If the property doesn't already exist on this scope, it will be created
 * implicitly and added to the scope.
 *
 * For best practices on using `ngModel`, see:
 *
 *  - {@link https://github.com/angular/angular.js/wiki/Understanding-Scopes}
 *
 * For basic examples, how to use `ngModel`, see:
 *
 *  - {@link ng.directive:input input}
 *    - {@link ng.directive:input.text text}
 *    - {@link ng.directive:input.checkbox checkbox}
 *    - {@link ng.directive:input.radio radio}
 *    - {@link ng.directive:input.number number}
 *    - {@link ng.directive:input.email email}
 *    - {@link ng.directive:input.url url}
 *  - {@link ng.directive:select select}
 *  - {@link ng.directive:textarea textarea}
 *
 */
var ngModelDirective = function() {
  return {
    require: ['ngModel', '^?form'],
    controller: NgModelController,
    link: function(scope, element, attr, ctrls) {
      // notify others, especially parent forms

      var modelCtrl = ctrls[0],
          formCtrl = ctrls[1] || nullFormCtrl;

      formCtrl.$addControl(modelCtrl);

      scope.$on('$destroy', function() {
        formCtrl.$removeControl(modelCtrl);
      });
    }
  };
};


/**
 * @ngdoc directive
 * @name ng.directive:ngChange
 *
 * @description
 * Evaluate given expression when user changes the input.
 * The expression is not evaluated when the value change is coming from the model.
 *
 * Note, this directive requires `ngModel` to be present.
 *
 * @element input
 * @param {expression} ngChange {@link guide/expression Expression} to evaluate upon change
 * in input value.
 *
 * @example
 * <doc:example>
 *   <doc:source>
 *     <script>
 *       function Controller($scope) {
 *         $scope.counter = 0;
 *         $scope.change = function() {
 *           $scope.counter++;
 *         };
 *       }
 *     </script>
 *     <div ng-controller="Controller">
 *       <input type="checkbox" ng-model="confirmed" ng-change="change()" id="ng-change-example1" />
 *       <input type="checkbox" ng-model="confirmed" id="ng-change-example2" />
 *       <label for="ng-change-example2">Confirmed</label><br />
 *       debug = {{confirmed}}<br />
 *       counter = {{counter}}
 *     </div>
 *   </doc:source>
 *   <doc:scenario>
 *     it('should evaluate the expression if changing from view', function() {
 *       expect(binding('counter')).toEqual('0');
 *       element('#ng-change-example1').click();
 *       expect(binding('counter')).toEqual('1');
 *       expect(binding('confirmed')).toEqual('true');
 *     });
 *
 *     it('should not evaluate the expression if changing from model', function() {
 *       element('#ng-change-example2').click();
 *       expect(binding('counter')).toEqual('0');
 *       expect(binding('confirmed')).toEqual('true');
 *     });
 *   </doc:scenario>
 * </doc:example>
 */
var ngChangeDirective = valueFn({
  require: 'ngModel',
  link: function(scope, element, attr, ctrl) {
    ctrl.$viewChangeListeners.push(function() {
      scope.$eval(attr.ngChange);
    });
  }
});


var requiredDirective = function() {
  return {
    require: '?ngModel',
    link: function(scope, elm, attr, ctrl) {
      if (!ctrl) return;
      attr.required = true; // force truthy in case we are on non input element

      var validator = function(value) {
        if (attr.required && ctrl.$isEmpty(value)) {
          ctrl.$setValidity('required', false);
          return;
        } else {
          ctrl.$setValidity('required', true);
          return value;
        }
      };

      ctrl.$formatters.push(validator);
      ctrl.$parsers.unshift(validator);

      attr.$observe('required', function() {
        validator(ctrl.$viewValue);
      });
    }
  };
};


/**
 * @ngdoc directive
 * @name ng.directive:ngList
 *
 * @description
 * Text input that converts between a delimited string and an array of strings. The delimiter
 * can be a fixed string (by default a comma) or a regular expression.
 *
 * @element input
 * @param {string=} ngList optional delimiter that should be used to split the value. If
 *   specified in form `/something/` then the value will be converted into a regular expression.
 *
 * @example
    <doc:example>
      <doc:source>
       <script>
         function Ctrl($scope) {
           $scope.names = ['igor', 'misko', 'vojta'];
         }
       </script>
       <form name="myForm" ng-controller="Ctrl">
         List: <input name="namesInput" ng-model="names" ng-list required>
         <span class="error" ng-show="myForm.namesInput.$error.required">
           Required!</span>
         <br>
         <tt>names = {{names}}</tt><br/>
         <tt>myForm.namesInput.$valid = {{myForm.namesInput.$valid}}</tt><br/>
         <tt>myForm.namesInput.$error = {{myForm.namesInput.$error}}</tt><br/>
         <tt>myForm.$valid = {{myForm.$valid}}</tt><br/>
         <tt>myForm.$error.required = {{!!myForm.$error.required}}</tt><br/>
        </form>
      </doc:source>
      <doc:scenario>
        it('should initialize to model', function() {
          expect(binding('names')).toEqual('["igor","misko","vojta"]');
          expect(binding('myForm.namesInput.$valid')).toEqual('true');
          expect(element('span.error').css('display')).toBe('none');
        });

        it('should be invalid if empty', function() {
          input('names').enter('');
          expect(binding('names')).toEqual('');
          expect(binding('myForm.namesInput.$valid')).toEqual('false');
          expect(element('span.error').css('display')).not().toBe('none');
        });
      </doc:scenario>
    </doc:example>
 */
var ngListDirective = function() {
  return {
    require: 'ngModel',
    link: function(scope, element, attr, ctrl) {
      var match = /\/(.*)\//.exec(attr.ngList),
          separator = match && new RegExp(match[1]) || attr.ngList || ',';

      var parse = function(viewValue) {
        // If the viewValue is invalid (say required but empty) it will be `undefined`
        if (isUndefined(viewValue)) return;

        var list = [];

        if (viewValue) {
          forEach(viewValue.split(separator), function(value) {
            if (value) list.push(trim(value));
          });
        }

        return list;
      };

      ctrl.$parsers.push(parse);
      ctrl.$formatters.push(function(value) {
        if (isArray(value)) {
          return value.join(', ');
        }

        return undefined;
      });

      // Override the standard $isEmpty because an empty array means the input is empty.
      ctrl.$isEmpty = function(value) {
        return !value || !value.length;
      };
    }
  };
};


var CONSTANT_VALUE_REGEXP = /^(true|false|\d+)$/;
/**
 * @ngdoc directive
 * @name ng.directive:ngValue
 *
 * @description
 * Binds the given expression to the value of `input[select]` or `input[radio]`, so
 * that when the element is selected, the `ngModel` of that element is set to the
 * bound value.
 *
 * `ngValue` is useful when dynamically generating lists of radio buttons using `ng-repeat`, as
 * shown below.
 *
 * @element input
 * @param {string=} ngValue angular expression, whose value will be bound to the `value` attribute
 *   of the `input` element
 *
 * @example
    <doc:example>
      <doc:source>
       <script>
          function Ctrl($scope) {
            $scope.names = ['pizza', 'unicorns', 'robots'];
            $scope.my = { favorite: 'unicorns' };
          }
       </script>
        <form ng-controller="Ctrl">
          <h2>Which is your favorite?</h2>
            <label ng-repeat="name in names" for="{{name}}">
              {{name}}
              <input type="radio"
                     ng-model="my.favorite"
                     ng-value="name"
                     id="{{name}}"
                     name="favorite">
            </label>
          </span>
          <div>You chose {{my.favorite}}</div>
        </form>
      </doc:source>
      <doc:scenario>
        it('should initialize to model', function() {
          expect(binding('my.favorite')).toEqual('unicorns');
        });
        it('should bind the values to the inputs', function() {
          input('my.favorite').select('pizza');
          expect(binding('my.favorite')).toEqual('pizza');
        });
      </doc:scenario>
    </doc:example>
 */
var ngValueDirective = function() {
  return {
    priority: 100,
    compile: function(tpl, tplAttr) {
      if (CONSTANT_VALUE_REGEXP.test(tplAttr.ngValue)) {
        return function ngValueConstantLink(scope, elm, attr) {
          attr.$set('value', scope.$eval(attr.ngValue));
        };
      } else {
        return function ngValueLink(scope, elm, attr) {
          scope.$watch(attr.ngValue, function valueWatchAction(value) {
            attr.$set('value', value);
          });
        };
      }
    }
  };
};

/**
 * @ngdoc directive
 * @name ng.directive:ngBind
 * @restrict AC
 *
 * @description
 * The `ngBind` attribute tells Angular to replace the text content of the specified HTML element
 * with the value of a given expression, and to update the text content when the value of that
 * expression changes.
 *
 * Typically, you don't use `ngBind` directly, but instead you use the double curly markup like
 * `{{ expression }}` which is similar but less verbose.
 *
 * It is preferrable to use `ngBind` instead of `{{ expression }}` when a template is momentarily
 * displayed by the browser in its raw state before Angular compiles it. Since `ngBind` is an
 * element attribute, it makes the bindings invisible to the user while the page is loading.
 *
 * An alternative solution to this problem would be using the
 * {@link ng.directive:ngCloak ngCloak} directive.
 *
 *
 * @element ANY
 * @param {expression} ngBind {@link guide/expression Expression} to evaluate.
 *
 * @example
 * Enter a name in the Live Preview text box; the greeting below the text box changes instantly.
   <doc:example>
     <doc:source>
       <script>
         function Ctrl($scope) {
           $scope.name = 'Whirled';
         }
       </script>
       <div ng-controller="Ctrl">
         Enter name: <input type="text" ng-model="name"><br>
         Hello <span ng-bind="name"></span>!
       </div>
     </doc:source>
     <doc:scenario>
       it('should check ng-bind', function() {
         expect(using('.doc-example-live').binding('name')).toBe('Whirled');
         using('.doc-example-live').input('name').enter('world');
         expect(using('.doc-example-live').binding('name')).toBe('world');
       });
     </doc:scenario>
   </doc:example>
 */
var ngBindDirective = ngDirective(function(scope, element, attr) {
  element.addClass('ng-binding').data('$binding', attr.ngBind);
  scope.$watch(attr.ngBind, function ngBindWatchAction(value) {
    // We are purposefully using == here rather than === because we want to
    // catch when value is "null or undefined"
    // jshint -W041
    element.text(value == undefined ? '' : value);
  });
});


/**
 * @ngdoc directive
 * @name ng.directive:ngBindTemplate
 *
 * @description
 * The `ngBindTemplate` directive specifies that the element
 * text content should be replaced with the interpolation of the template
 * in the `ngBindTemplate` attribute.
 * Unlike `ngBind`, the `ngBindTemplate` can contain multiple `{{` `}}`
 * expressions. This directive is needed since some HTML elements
 * (such as TITLE and OPTION) cannot contain SPAN elements.
 *
 * @element ANY
 * @param {string} ngBindTemplate template of form
 *   <tt>{{</tt> <tt>expression</tt> <tt>}}</tt> to eval.
 *
 * @example
 * Try it here: enter text in text box and watch the greeting change.
   <doc:example>
     <doc:source>
       <script>
         function Ctrl($scope) {
           $scope.salutation = 'Hello';
           $scope.name = 'World';
         }
       </script>
       <div ng-controller="Ctrl">
        Salutation: <input type="text" ng-model="salutation"><br>
        Name: <input type="text" ng-model="name"><br>
        <pre ng-bind-template="{{salutation}} {{name}}!"></pre>
       </div>
     </doc:source>
     <doc:scenario>
       it('should check ng-bind', function() {
         expect(using('.doc-example-live').binding('salutation')).
           toBe('Hello');
         expect(using('.doc-example-live').binding('name')).
           toBe('World');
         using('.doc-example-live').input('salutation').enter('Greetings');
         using('.doc-example-live').input('name').enter('user');
         expect(using('.doc-example-live').binding('salutation')).
           toBe('Greetings');
         expect(using('.doc-example-live').binding('name')).
           toBe('user');
       });
     </doc:scenario>
   </doc:example>
 */
var ngBindTemplateDirective = ['$interpolate', function($interpolate) {
  return function(scope, element, attr) {
    // TODO: move this to scenario runner
    var interpolateFn = $interpolate(element.attr(attr.$attr.ngBindTemplate));
    element.addClass('ng-binding').data('$binding', interpolateFn);
    attr.$observe('ngBindTemplate', function(value) {
      element.text(value);
    });
  };
}];


/**
 * @ngdoc directive
 * @name ng.directive:ngBindHtml
 *
 * @description
 * Creates a binding that will innerHTML the result of evaluating the `expression` into the current
 * element in a secure way.  By default, the innerHTML-ed content will be sanitized using the {@link
 * ngSanitize.$sanitize $sanitize} service.  To utilize this functionality, ensure that `$sanitize`
 * is available, for example, by including {@link ngSanitize} in your module's dependencies (not in
 * core Angular.)  You may also bypass sanitization for values you know are safe. To do so, bind to
 * an explicitly trusted value via {@link ng.$sce#methods_trustAsHtml $sce.trustAsHtml}.  See the example
 * under {@link ng.$sce#Example Strict Contextual Escaping (SCE)}.
 *
 * Note: If a `$sanitize` service is unavailable and the bound value isn't explicitly trusted, you
 * will have an exception (instead of an exploit.)
 *
 * @element ANY
 * @param {expression} ngBindHtml {@link guide/expression Expression} to evaluate.
 *
 * @example
   Try it here: enter text in text box and watch the greeting change.
 
   <example module="ngBindHtmlExample" deps="angular-sanitize.js">
     <file name="index.html">
       <div ng-controller="ngBindHtmlCtrl">
        <p ng-bind-html="myHTML"></p>
       </div>
     </file>
     
     <file name="script.js">
       angular.module('ngBindHtmlExample', ['ngSanitize'])

       .controller('ngBindHtmlCtrl', ['$scope', function ngBindHtmlCtrl($scope) {
         $scope.myHTML =
            'I am an <code>HTML</code>string with <a href="#">links!</a> and other <em>stuff</em>';
       }]);
     </file>

     <file name="scenario.js">
       it('should check ng-bind-html', function() {
         expect(using('.doc-example-live').binding('myHTML')).
           toBe(
           'I am an <code>HTML</code>string with <a href="#">links!</a> and other <em>stuff</em>'
           );
       });
     </file>
   </example>
 */
var ngBindHtmlDirective = ['$sce', '$parse', function($sce, $parse) {
  return function(scope, element, attr) {
    element.addClass('ng-binding').data('$binding', attr.ngBindHtml);

    var parsed = $parse(attr.ngBindHtml);
    function getStringValue() { return (parsed(scope) || '').toString(); }

    scope.$watch(getStringValue, function ngBindHtmlWatchAction(value) {
      element.html($sce.getTrustedHtml(parsed(scope)) || '');
    });
  };
}];

function classDirective(name, selector) {
  name = 'ngClass' + name;
  return function() {
    return {
      restrict: 'AC',
      link: function(scope, element, attr) {
        var oldVal;

        scope.$watch(attr[name], ngClassWatchAction, true);

        attr.$observe('class', function(value) {
          ngClassWatchAction(scope.$eval(attr[name]));
        });


        if (name !== 'ngClass') {
          scope.$watch('$index', function($index, old$index) {
            // jshint bitwise: false
            var mod = $index & 1;
            if (mod !== old$index & 1) {
              if (mod === selector) {
                addClass(scope.$eval(attr[name]));
              } else {
                removeClass(scope.$eval(attr[name]));
              }
            }
          });
        }


        function ngClassWatchAction(newVal) {
          if (selector === true || scope.$index % 2 === selector) {
            if (oldVal && !equals(newVal,oldVal)) {
              removeClass(oldVal);
            }
            addClass(newVal);
          }
          oldVal = copy(newVal);
        }


        function removeClass(classVal) {
          attr.$removeClass(flattenClasses(classVal));
        }


        function addClass(classVal) {
          attr.$addClass(flattenClasses(classVal));
        }

        function flattenClasses(classVal) {
          if(isArray(classVal)) {
            return classVal.join(' ');
          } else if (isObject(classVal)) {
            var classes = [], i = 0;
            forEach(classVal, function(v, k) {
              if (v) {
                classes.push(k);
              }
            });
            return classes.join(' ');
          }

          return classVal;
        }
      }
    };
  };
}

/**
 * @ngdoc directive
 * @name ng.directive:ngClass
 * @restrict AC
 *
 * @description
 * The `ngClass` directive allows you to dynamically set CSS classes on an HTML element by databinding
 * an expression that represents all classes to be added.
 *
 * The directive won't add duplicate classes if a particular class was already set.
 *
 * When the expression changes, the previously added classes are removed and only then the
 * new classes are added.
 *
 * @animations
 * add - happens just before the class is applied to the element
 * remove - happens just before the class is removed from the element
 *
 * @element ANY
 * @param {expression} ngClass {@link guide/expression Expression} to eval. The result
 *   of the evaluation can be a string representing space delimited class
 *   names, an array, or a map of class names to boolean values. In the case of a map, the
 *   names of the properties whose values are truthy will be added as css classes to the
 *   element.
 *
 * @example Example that demonstrates basic bindings via ngClass directive.
   <example>
     <file name="index.html">
       <p ng-class="{strike: deleted, bold: important, red: error}">Map Syntax Example</p>
       <input type="checkbox" ng-model="deleted"> deleted (apply "strike" class)<br>
       <input type="checkbox" ng-model="important"> important (apply "bold" class)<br>
       <input type="checkbox" ng-model="error"> error (apply "red" class)
       <hr>
       <p ng-class="style">Using String Syntax</p>
       <input type="text" ng-model="style" placeholder="Type: bold strike red">
       <hr>
       <p ng-class="[style1, style2, style3]">Using Array Syntax</p>
       <input ng-model="style1" placeholder="Type: bold, strike or red"><br>
       <input ng-model="style2" placeholder="Type: bold, strike or red"><br>
       <input ng-model="style3" placeholder="Type: bold, strike or red"><br>
     </file>
     <file name="style.css">
       .strike {
         text-decoration: line-through;
       }
       .bold {
           font-weight: bold;
       }
       .red {
           color: red;
       }
     </file>
     <file name="scenario.js">
       it('should let you toggle the class', function() {

         expect(element('.doc-example-live p:first').prop('className')).not().toMatch(/bold/);
         expect(element('.doc-example-live p:first').prop('className')).not().toMatch(/red/);

         input('important').check();
         expect(element('.doc-example-live p:first').prop('className')).toMatch(/bold/);

         input('error').check();
         expect(element('.doc-example-live p:first').prop('className')).toMatch(/red/);
       });

       it('should let you toggle string example', function() {
         expect(element('.doc-example-live p:nth-of-type(2)').prop('className')).toBe('');
         input('style').enter('red');
         expect(element('.doc-example-live p:nth-of-type(2)').prop('className')).toBe('red');
       });

       it('array example should have 3 classes', function() {
         expect(element('.doc-example-live p:last').prop('className')).toBe('');
         input('style1').enter('bold');
         input('style2').enter('strike');
         input('style3').enter('red');
         expect(element('.doc-example-live p:last').prop('className')).toBe('bold strike red');
       });
     </file>
   </example>

   ## Animations

   The example below demonstrates how to perform animations using ngClass.

   <example animations="true">
     <file name="index.html">
      <input type="button" value="set" ng-click="myVar='my-class'">
      <input type="button" value="clear" ng-click="myVar=''">
      <br>
      <span class="base-class" ng-class="myVar">Sample Text</span>
     </file>
     <file name="style.css">
       .base-class {
         -webkit-transition:all cubic-bezier(0.250, 0.460, 0.450, 0.940) 0.5s;
         transition:all cubic-bezier(0.250, 0.460, 0.450, 0.940) 0.5s;
       }

       .base-class.my-class {
         color: red;
         font-size:3em;
       }
     </file>
     <file name="scenario.js">
       it('should check ng-class', function() {
         expect(element('.doc-example-live span').prop('className')).not().
           toMatch(/my-class/);

         using('.doc-example-live').element(':button:first').click();

         expect(element('.doc-example-live span').prop('className')).
           toMatch(/my-class/);

         using('.doc-example-live').element(':button:last').click();

         expect(element('.doc-example-live span').prop('className')).not().
           toMatch(/my-class/);
       });
     </file>
   </example>


   ## ngClass and pre-existing CSS3 Transitions/Animations
   The ngClass directive still supports CSS3 Transitions/Animations even if they do not follow the ngAnimate CSS naming structure.
   Upon animation ngAnimate will apply supplementary CSS classes to track the start and end of an animation, but this will not hinder
   any pre-existing CSS transitions already on the element. To get an idea of what happens during a class-based animation, be sure
   to view the step by step details of {@link ngAnimate.$animate#methods_addclass $animate.addClass} and
   {@link ngAnimate.$animate#methods_removeclass $animate.removeClass}.
 */
var ngClassDirective = classDirective('', true);

/**
 * @ngdoc directive
 * @name ng.directive:ngClassOdd
 * @restrict AC
 *
 * @description
 * The `ngClassOdd` and `ngClassEven` directives work exactly as
 * {@link ng.directive:ngClass ngClass}, except they work in
 * conjunction with `ngRepeat` and take effect only on odd (even) rows.
 *
 * This directive can be applied only within the scope of an
 * {@link ng.directive:ngRepeat ngRepeat}.
 *
 * @element ANY
 * @param {expression} ngClassOdd {@link guide/expression Expression} to eval. The result
 *   of the evaluation can be a string representing space delimited class names or an array.
 *
 * @example
   <example>
     <file name="index.html">
        <ol ng-init="names=['John', 'Mary', 'Cate', 'Suz']">
          <li ng-repeat="name in names">
           <span ng-class-odd="'odd'" ng-class-even="'even'">
             {{name}}
           </span>
          </li>
        </ol>
     </file>
     <file name="style.css">
       .odd {
         color: red;
       }
       .even {
         color: blue;
       }
     </file>
     <file name="scenario.js">
       it('should check ng-class-odd and ng-class-even', function() {
         expect(element('.doc-example-live li:first span').prop('className')).
           toMatch(/odd/);
         expect(element('.doc-example-live li:last span').prop('className')).
           toMatch(/even/);
       });
     </file>
   </example>
 */
var ngClassOddDirective = classDirective('Odd', 0);

/**
 * @ngdoc directive
 * @name ng.directive:ngClassEven
 * @restrict AC
 *
 * @description
 * The `ngClassOdd` and `ngClassEven` directives work exactly as
 * {@link ng.directive:ngClass ngClass}, except they work in
 * conjunction with `ngRepeat` and take effect only on odd (even) rows.
 *
 * This directive can be applied only within the scope of an
 * {@link ng.directive:ngRepeat ngRepeat}.
 *
 * @element ANY
 * @param {expression} ngClassEven {@link guide/expression Expression} to eval. The
 *   result of the evaluation can be a string representing space delimited class names or an array.
 *
 * @example
   <example>
     <file name="index.html">
        <ol ng-init="names=['John', 'Mary', 'Cate', 'Suz']">
          <li ng-repeat="name in names">
           <span ng-class-odd="'odd'" ng-class-even="'even'">
             {{name}} &nbsp; &nbsp; &nbsp;
           </span>
          </li>
        </ol>
     </file>
     <file name="style.css">
       .odd {
         color: red;
       }
       .even {
         color: blue;
       }
     </file>
     <file name="scenario.js">
       it('should check ng-class-odd and ng-class-even', function() {
         expect(element('.doc-example-live li:first span').prop('className')).
           toMatch(/odd/);
         expect(element('.doc-example-live li:last span').prop('className')).
           toMatch(/even/);
       });
     </file>
   </example>
 */
var ngClassEvenDirective = classDirective('Even', 1);

/**
 * @ngdoc directive
 * @name ng.directive:ngCloak
 * @restrict AC
 *
 * @description
 * The `ngCloak` directive is used to prevent the Angular html template from being briefly
 * displayed by the browser in its raw (uncompiled) form while your application is loading. Use this
 * directive to avoid the undesirable flicker effect caused by the html template display.
 *
 * The directive can be applied to the `<body>` element, but the preferred usage is to apply
 * multiple `ngCloak` directives to small portions of the page to permit progressive rendering
 * of the browser view.
 *
 * `ngCloak` works in cooperation with the following css rule embedded within `angular.js` and
 * `angular.min.js`.
 * For CSP mode please add `angular-csp.css` to your html file (see {@link ng.directive:ngCsp ngCsp}).
 *
 * <pre>
 * [ng\:cloak], [ng-cloak], [data-ng-cloak], [x-ng-cloak], .ng-cloak, .x-ng-cloak {
 *   display: none !important;
 * }
 * </pre>
 *
 * When this css rule is loaded by the browser, all html elements (including their children) that
 * are tagged with the `ngCloak` directive are hidden. When Angular encounters this directive
 * during the compilation of the template it deletes the `ngCloak` element attribute, making
 * the compiled element visible.
 *
 * For the best result, the `angular.js` script must be loaded in the head section of the html
 * document; alternatively, the css rule above must be included in the external stylesheet of the
 * application.
 *
 * Legacy browsers, like IE7, do not provide attribute selector support (added in CSS 2.1) so they
 * cannot match the `[ng\:cloak]` selector. To work around this limitation, you must add the css
 * class `ngCloak` in addition to the `ngCloak` directive as shown in the example below.
 *
 * @element ANY
 *
 * @example
   <doc:example>
     <doc:source>
        <div id="template1" ng-cloak>{{ 'hello' }}</div>
        <div id="template2" ng-cloak class="ng-cloak">{{ 'hello IE7' }}</div>
     </doc:source>
     <doc:scenario>
       it('should remove the template directive and css class', function() {
         expect(element('.doc-example-live #template1').attr('ng-cloak')).
           not().toBeDefined();
         expect(element('.doc-example-live #template2').attr('ng-cloak')).
           not().toBeDefined();
       });
     </doc:scenario>
   </doc:example>
 *
 */
var ngCloakDirective = ngDirective({
  compile: function(element, attr) {
    attr.$set('ngCloak', undefined);
    element.removeClass('ng-cloak');
  }
});

/**
 * @ngdoc directive
 * @name ng.directive:ngController
 *
 * @description
 * The `ngController` directive attaches a controller class to the view. This is a key aspect of how angular
 * supports the principles behind the Model-View-Controller design pattern.
 *
 * MVC components in angular:
 *
 * * Model — The Model is scope properties; scopes are attached to the DOM where scope properties
 *   are accessed through bindings.
 * * View — The template (HTML with data bindings) that is rendered into the View.
 * * Controller — The `ngController` directive specifies a Controller class; the class contains business
 *   logic behind the application to decorate the scope with functions and values
 *
 * Note that you can also attach controllers to the DOM by declaring it in a route definition
 * via the {@link ngRoute.$route $route} service. A common mistake is to declare the controller
 * again using `ng-controller` in the template itself.  This will cause the controller to be attached
 * and executed twice.
 *
 * @element ANY
 * @scope
 * @param {expression} ngController Name of a globally accessible constructor function or an
 *     {@link guide/expression expression} that on the current scope evaluates to a
 *     constructor function. The controller instance can be published into a scope property
 *     by specifying `as propertyName`.
 *
 * @example
 * Here is a simple form for editing user contact information. Adding, removing, clearing, and
 * greeting are methods declared on the controller (see source tab). These methods can
 * easily be called from the angular markup. Notice that the scope becomes the `this` for the
 * controller's instance. This allows for easy access to the view data from the controller. Also
 * notice that any changes to the data are automatically reflected in the View without the need
 * for a manual update. The example is shown in two different declaration styles you may use
 * according to preference.
   <doc:example>
     <doc:source>
      <script>
        function SettingsController1() {
          this.name = "John Smith";
          this.contacts = [
            {type: 'phone', value: '408 555 1212'},
            {type: 'email', value: 'john.smith@example.org'} ];
          };

        SettingsController1.prototype.greet = function() {
          alert(this.name);
        };

        SettingsController1.prototype.addContact = function() {
          this.contacts.push({type: 'email', value: 'yourname@example.org'});
        };

        SettingsController1.prototype.removeContact = function(contactToRemove) {
         var index = this.contacts.indexOf(contactToRemove);
          this.contacts.splice(index, 1);
        };

        SettingsController1.prototype.clearContact = function(contact) {
          contact.type = 'phone';
          contact.value = '';
        };
      </script>
      <div id="ctrl-as-exmpl" ng-controller="SettingsController1 as settings">
        Name: <input type="text" ng-model="settings.name"/>
        [ <a href="" ng-click="settings.greet()">greet</a> ]<br/>
        Contact:
        <ul>
          <li ng-repeat="contact in settings.contacts">
            <select ng-model="contact.type">
               <option>phone</option>
               <option>email</option>
            </select>
            <input type="text" ng-model="contact.value"/>
            [ <a href="" ng-click="settings.clearContact(contact)">clear</a>
            | <a href="" ng-click="settings.removeContact(contact)">X</a> ]
          </li>
          <li>[ <a href="" ng-click="settings.addContact()">add</a> ]</li>
       </ul>
      </div>
     </doc:source>
     <doc:scenario>
       it('should check controller as', function() {
         expect(element('#ctrl-as-exmpl>:input').val()).toBe('John Smith');
         expect(element('#ctrl-as-exmpl li:nth-child(1) input').val())
           .toBe('408 555 1212');
         expect(element('#ctrl-as-exmpl li:nth-child(2) input').val())
           .toBe('john.smith@example.org');

         element('#ctrl-as-exmpl li:first a:contains("clear")').click();
         expect(element('#ctrl-as-exmpl li:first input').val()).toBe('');

         element('#ctrl-as-exmpl li:last a:contains("add")').click();
         expect(element('#ctrl-as-exmpl li:nth-child(3) input').val())
           .toBe('yourname@example.org');
       });
     </doc:scenario>
   </doc:example>
    <doc:example>
     <doc:source>
      <script>
        function SettingsController2($scope) {
          $scope.name = "John Smith";
          $scope.contacts = [
            {type:'phone', value:'408 555 1212'},
            {type:'email', value:'john.smith@example.org'} ];

          $scope.greet = function() {
           alert(this.name);
          };

          $scope.addContact = function() {
           this.contacts.push({type:'email', value:'yourname@example.org'});
          };

          $scope.removeContact = function(contactToRemove) {
           var index = this.contacts.indexOf(contactToRemove);
           this.contacts.splice(index, 1);
          };

          $scope.clearContact = function(contact) {
           contact.type = 'phone';
           contact.value = '';
          };
        }
      </script>
      <div id="ctrl-exmpl" ng-controller="SettingsController2">
        Name: <input type="text" ng-model="name"/>
        [ <a href="" ng-click="greet()">greet</a> ]<br/>
        Contact:
        <ul>
          <li ng-repeat="contact in contacts">
            <select ng-model="contact.type">
               <option>phone</option>
               <option>email</option>
            </select>
            <input type="text" ng-model="contact.value"/>
            [ <a href="" ng-click="clearContact(contact)">clear</a>
            | <a href="" ng-click="removeContact(contact)">X</a> ]
          </li>
          <li>[ <a href="" ng-click="addContact()">add</a> ]</li>
       </ul>
      </div>
     </doc:source>
     <doc:scenario>
       it('should check controller', function() {
         expect(element('#ctrl-exmpl>:input').val()).toBe('John Smith');
         expect(element('#ctrl-exmpl li:nth-child(1) input').val())
           .toBe('408 555 1212');
         expect(element('#ctrl-exmpl li:nth-child(2) input').val())
           .toBe('john.smith@example.org');

         element('#ctrl-exmpl li:first a:contains("clear")').click();
         expect(element('#ctrl-exmpl li:first input').val()).toBe('');

         element('#ctrl-exmpl li:last a:contains("add")').click();
         expect(element('#ctrl-exmpl li:nth-child(3) input').val())
           .toBe('yourname@example.org');
       });
     </doc:scenario>
   </doc:example>

 */
var ngControllerDirective = [function() {
  return {
    scope: true,
    controller: '@'
  };
}];

/**
 * @ngdoc directive
 * @name ng.directive:ngCsp
 *
 * @element html
 * @description
 * Enables [CSP (Content Security Policy)](https://developer.mozilla.org/en/Security/CSP) support.
 *
 * This is necessary when developing things like Google Chrome Extensions.
 *
 * CSP forbids apps to use `eval` or `Function(string)` generated functions (among other things).
 * For us to be compatible, we just need to implement the "getterFn" in $parse without violating
 * any of these restrictions.
 *
 * AngularJS uses `Function(string)` generated functions as a speed optimization. Applying the `ngCsp`
 * directive will cause Angular to use CSP compatibility mode. When this mode is on AngularJS will
 * evaluate all expressions up to 30% slower than in non-CSP mode, but no security violations will
 * be raised.
 *
 * CSP forbids JavaScript to inline stylesheet rules. In non CSP mode Angular automatically
 * includes some CSS rules (e.g. {@link ng.directive:ngCloak ngCloak}).
 * To make those directives work in CSP mode, include the `angular-csp.css` manually.
 *
 * In order to use this feature put the `ngCsp` directive on the root element of the application.
 *
 * *Note: This directive is only available in the `ng-csp` and `data-ng-csp` attribute form.*
 *
 * @example
 * This example shows how to apply the `ngCsp` directive to the `html` tag.
   <pre>
     <!doctype html>
     <html ng-app ng-csp>
     ...
     ...
     </html>
   </pre>
 */

// ngCsp is not implemented as a proper directive any more, because we need it be processed while we bootstrap
// the system (before $parse is instantiated), for this reason we just have a csp() fn that looks for ng-csp attribute
// anywhere in the current doc

/**
 * @ngdoc directive
 * @name ng.directive:ngClick
 *
 * @description
 * The ngClick directive allows you to specify custom behavior when
 * an element is clicked.
 *
 * @element ANY
 * @param {expression} ngClick {@link guide/expression Expression} to evaluate upon
 * click. (Event object is available as `$event`)
 *
 * @example
   <doc:example>
     <doc:source>
      <button ng-click="count = count + 1" ng-init="count=0">
        Increment
      </button>
      count: {{count}}
     </doc:source>
     <doc:scenario>
       it('should check ng-click', function() {
         expect(binding('count')).toBe('0');
         element('.doc-example-live :button').click();
         expect(binding('count')).toBe('1');
       });
     </doc:scenario>
   </doc:example>
 */
/*
 * A directive that allows creation of custom onclick handlers that are defined as angular
 * expressions and are compiled and executed within the current scope.
 *
 * Events that are handled via these handler are always configured not to propagate further.
 */
var ngEventDirectives = {};
forEach(
  'click dblclick mousedown mouseup mouseover mouseout mousemove mouseenter mouseleave keydown keyup keypress submit focus blur copy cut paste'.split(' '),
  function(name) {
    var directiveName = directiveNormalize('ng-' + name);
    ngEventDirectives[directiveName] = ['$parse', function($parse) {
      return {
        compile: function($element, attr) {
          var fn = $parse(attr[directiveName]);
          return function(scope, element, attr) {
            element.on(lowercase(name), function(event) {
              scope.$apply(function() {
                fn(scope, {$event:event});
              });
            });
          };
        }
      };
    }];
  }
);

/**
 * @ngdoc directive
 * @name ng.directive:ngDblclick
 *
 * @description
 * The `ngDblclick` directive allows you to specify custom behavior on a dblclick event.
 *
 * @element ANY
 * @param {expression} ngDblclick {@link guide/expression Expression} to evaluate upon
 * a dblclick. (The Event object is available as `$event`)
 *
 * @example
 * See {@link ng.directive:ngClick ngClick}
 */


/**
 * @ngdoc directive
 * @name ng.directive:ngMousedown
 *
 * @description
 * The ngMousedown directive allows you to specify custom behavior on mousedown event.
 *
 * @element ANY
 * @param {expression} ngMousedown {@link guide/expression Expression} to evaluate upon
 * mousedown. (Event object is available as `$event`)
 *
 * @example
 * See {@link ng.directive:ngClick ngClick}
 */


/**
 * @ngdoc directive
 * @name ng.directive:ngMouseup
 *
 * @description
 * Specify custom behavior on mouseup event.
 *
 * @element ANY
 * @param {expression} ngMouseup {@link guide/expression Expression} to evaluate upon
 * mouseup. (Event object is available as `$event`)
 *
 * @example
 * See {@link ng.directive:ngClick ngClick}
 */

/**
 * @ngdoc directive
 * @name ng.directive:ngMouseover
 *
 * @description
 * Specify custom behavior on mouseover event.
 *
 * @element ANY
 * @param {expression} ngMouseover {@link guide/expression Expression} to evaluate upon
 * mouseover. (Event object is available as `$event`)
 *
 * @example
 * See {@link ng.directive:ngClick ngClick}
 */


/**
 * @ngdoc directive
 * @name ng.directive:ngMouseenter
 *
 * @description
 * Specify custom behavior on mouseenter event.
 *
 * @element ANY
 * @param {expression} ngMouseenter {@link guide/expression Expression} to evaluate upon
 * mouseenter. (Event object is available as `$event`)
 *
 * @example
 * See {@link ng.directive:ngClick ngClick}
 */


/**
 * @ngdoc directive
 * @name ng.directive:ngMouseleave
 *
 * @description
 * Specify custom behavior on mouseleave event.
 *
 * @element ANY
 * @param {expression} ngMouseleave {@link guide/expression Expression} to evaluate upon
 * mouseleave. (Event object is available as `$event`)
 *
 * @example
 * See {@link ng.directive:ngClick ngClick}
 */


/**
 * @ngdoc directive
 * @name ng.directive:ngMousemove
 *
 * @description
 * Specify custom behavior on mousemove event.
 *
 * @element ANY
 * @param {expression} ngMousemove {@link guide/expression Expression} to evaluate upon
 * mousemove. (Event object is available as `$event`)
 *
 * @example
 * See {@link ng.directive:ngClick ngClick}
 */


/**
 * @ngdoc directive
 * @name ng.directive:ngKeydown
 *
 * @description
 * Specify custom behavior on keydown event.
 *
 * @element ANY
 * @param {expression} ngKeydown {@link guide/expression Expression} to evaluate upon
 * keydown. (Event object is available as `$event` and can be interrogated for keyCode, altKey, etc.)
 *
 * @example
 * See {@link ng.directive:ngClick ngClick}
 */


/**
 * @ngdoc directive
 * @name ng.directive:ngKeyup
 *
 * @description
 * Specify custom behavior on keyup event.
 *
 * @element ANY
 * @param {expression} ngKeyup {@link guide/expression Expression} to evaluate upon
 * keyup. (Event object is available as `$event` and can be interrogated for keyCode, altKey, etc.)
 *
 * @example
 * See {@link ng.directive:ngClick ngClick}
 */


/**
 * @ngdoc directive
 * @name ng.directive:ngKeypress
 *
 * @description
 * Specify custom behavior on keypress event.
 *
 * @element ANY
 * @param {expression} ngKeypress {@link guide/expression Expression} to evaluate upon
 * keypress. (Event object is available as `$event` and can be interrogated for keyCode, altKey, etc.)
 *
 * @example
 * See {@link ng.directive:ngClick ngClick}
 */


/**
 * @ngdoc directive
 * @name ng.directive:ngSubmit
 *
 * @description
 * Enables binding angular expressions to onsubmit events.
 *
 * Additionally it prevents the default action (which for form means sending the request to the
 * server and reloading the current page) **but only if the form does not contain an `action`
 * attribute**.
 *
 * @element form
 * @param {expression} ngSubmit {@link guide/expression Expression} to eval. (Event object is available as `$event`)
 *
 * @example
   <doc:example>
     <doc:source>
      <script>
        function Ctrl($scope) {
          $scope.list = [];
          $scope.text = 'hello';
          $scope.submit = function() {
            if (this.text) {
              this.list.push(this.text);
              this.text = '';
            }
          };
        }
      </script>
      <form ng-submit="submit()" ng-controller="Ctrl">
        Enter text and hit enter:
        <input type="text" ng-model="text" name="text" />
        <input type="submit" id="submit" value="Submit" />
        <pre>list={{list}}</pre>
      </form>
     </doc:source>
     <doc:scenario>
       it('should check ng-submit', function() {
         expect(binding('list')).toBe('[]');
         element('.doc-example-live #submit').click();
         expect(binding('list')).toBe('["hello"]');
         expect(input('text').val()).toBe('');
       });
       it('should ignore empty strings', function() {
         expect(binding('list')).toBe('[]');
         element('.doc-example-live #submit').click();
         element('.doc-example-live #submit').click();
         expect(binding('list')).toBe('["hello"]');
       });
     </doc:scenario>
   </doc:example>
 */

/**
 * @ngdoc directive
 * @name ng.directive:ngFocus
 *
 * @description
 * Specify custom behavior on focus event.
 *
 * @element window, input, select, textarea, a
 * @param {expression} ngFocus {@link guide/expression Expression} to evaluate upon
 * focus. (Event object is available as `$event`)
 *
 * @example
 * See {@link ng.directive:ngClick ngClick}
 */

/**
 * @ngdoc directive
 * @name ng.directive:ngBlur
 *
 * @description
 * Specify custom behavior on blur event.
 *
 * @element window, input, select, textarea, a
 * @param {expression} ngBlur {@link guide/expression Expression} to evaluate upon
 * blur. (Event object is available as `$event`)
 *
 * @example
 * See {@link ng.directive:ngClick ngClick}
 */

/**
 * @ngdoc directive
 * @name ng.directive:ngCopy
 *
 * @description
 * Specify custom behavior on copy event.
 *
 * @element window, input, select, textarea, a
 * @param {expression} ngCopy {@link guide/expression Expression} to evaluate upon
 * copy. (Event object is available as `$event`)
 *
 * @example
 * See {@link ng.directive:ngClick ngClick}
 */

/**
 * @ngdoc directive
 * @name ng.directive:ngCut
 *
 * @description
 * Specify custom behavior on cut event.
 *
 * @element window, input, select, textarea, a
 * @param {expression} ngCut {@link guide/expression Expression} to evaluate upon
 * cut. (Event object is available as `$event`)
 *
 * @example
 * See {@link ng.directive:ngClick ngClick}
 */

/**
 * @ngdoc directive
 * @name ng.directive:ngPaste
 *
 * @description
 * Specify custom behavior on paste event.
 *
 * @element window, input, select, textarea, a
 * @param {expression} ngPaste {@link guide/expression Expression} to evaluate upon
 * paste. (Event object is available as `$event`)
 *
 * @example
 * See {@link ng.directive:ngClick ngClick}
 */

/**
 * @ngdoc directive
 * @name ng.directive:ngIf
 * @restrict A
 *
 * @description
 * The `ngIf` directive removes or recreates a portion of the DOM tree based on an
 * {expression}. If the expression assigned to `ngIf` evaluates to a false
 * value then the element is removed from the DOM, otherwise a clone of the
 * element is reinserted into the DOM.
 *
 * `ngIf` differs from `ngShow` and `ngHide` in that `ngIf` completely removes and recreates the
 * element in the DOM rather than changing its visibility via the `display` css property.  A common
 * case when this difference is significant is when using css selectors that rely on an element's
 * position within the DOM, such as the `:first-child` or `:last-child` pseudo-classes.
 *
 * Note that when an element is removed using `ngIf` its scope is destroyed and a new scope
 * is created when the element is restored.  The scope created within `ngIf` inherits from
 * its parent scope using
 * {@link https://github.com/angular/angular.js/wiki/The-Nuances-of-Scope-Prototypal-Inheritance prototypal inheritance}.
 * An important implication of this is if `ngModel` is used within `ngIf` to bind to
 * a javascript primitive defined in the parent scope. In this case any modifications made to the
 * variable within the child scope will override (hide) the value in the parent scope.
 *
 * Also, `ngIf` recreates elements using their compiled state. An example of this behavior
 * is if an element's class attribute is directly modified after it's compiled, using something like
 * jQuery's `.addClass()` method, and the element is later removed. When `ngIf` recreates the element
 * the added class will be lost because the original compiled state is used to regenerate the element.
 *
 * Additionally, you can provide animations via the `ngAnimate` module to animate the `enter`
 * and `leave` effects.
 *
 * @animations
 * enter - happens just after the ngIf contents change and a new DOM element is created and injected into the ngIf container
 * leave - happens just before the ngIf contents are removed from the DOM
 *
 * @element ANY
 * @scope
 * @priority 600
 * @param {expression} ngIf If the {@link guide/expression expression} is falsy then
 *     the element is removed from the DOM tree. If it is truthy a copy of the compiled
 *     element is added to the DOM tree.
 *
 * @example
  <example animations="true">
    <file name="index.html">
      Click me: <input type="checkbox" ng-model="checked" ng-init="checked=true" /><br/>
      Show when checked:
      <span ng-if="checked" class="animate-if">
        I'm removed when the checkbox is unchecked.
      </span>
    </file>
    <file name="animations.css">
      .animate-if {
        background:white;
        border:1px solid black;
        padding:10px;
      }

      /&#42;
        The transition styles can also be placed on the CSS base class above
      &#42;/
      .animate-if.ng-enter, .animate-if.ng-leave {
        -webkit-transition:all cubic-bezier(0.250, 0.460, 0.450, 0.940) 0.5s;
        transition:all cubic-bezier(0.250, 0.460, 0.450, 0.940) 0.5s;
      }

      .animate-if.ng-enter,
      .animate-if.ng-leave.ng-leave-active {
        opacity:0;
      }

      .animate-if.ng-leave,
      .animate-if.ng-enter.ng-enter-active {
        opacity:1;
      }
    </file>
  </example>
 */
var ngIfDirective = ['$animate', function($animate) {
  return {
    transclude: 'element',
    priority: 600,
    terminal: true,
    restrict: 'A',
    $$tlb: true,
    link: function ($scope, $element, $attr, ctrl, $transclude) {
        var block, childScope;
        $scope.$watch($attr.ngIf, function ngIfWatchAction(value) {

          if (toBoolean(value)) {
            if (!childScope) {
              childScope = $scope.$new();
              $transclude(childScope, function (clone) {
                block = {
                  startNode: clone[0],
                  endNode: clone[clone.length++] = document.createComment(' end ngIf: ' + $attr.ngIf + ' ')
                };
                $animate.enter(clone, $element.parent(), $element);
              });
            }
          } else {

            if (childScope) {
              childScope.$destroy();
              childScope = null;
            }

            if (block) {
              $animate.leave(getBlockElements(block));
              block = null;
            }
          }
        });
    }
  };
}];

/**
 * @ngdoc directive
 * @name ng.directive:ngInclude
 * @restrict ECA
 *
 * @description
 * Fetches, compiles and includes an external HTML fragment.
 *
 * By default, the template URL is restricted to the same domain and protocol as the
 * application document. This is done by calling {@link ng.$sce#methods_getTrustedResourceUrl
 * $sce.getTrustedResourceUrl} on it. To load templates from other domains or protocols
 * you may either {@link ng.$sceDelegateProvider#methods_resourceUrlWhitelist whitelist them} or
 * {@link ng.$sce#methods_trustAsResourceUrl wrap them} as trusted values. Refer to Angular's {@link
 * ng.$sce Strict Contextual Escaping}.
 *
 * In addition, the browser's
 * {@link https://code.google.com/p/browsersec/wiki/Part2#Same-origin_policy_for_XMLHttpRequest
 * Same Origin Policy} and {@link http://www.w3.org/TR/cors/ Cross-Origin Resource Sharing
 * (CORS)} policy may further restrict whether the template is successfully loaded.
 * For example, `ngInclude` won't work for cross-domain requests on all browsers and for `file://`
 * access on some browsers.
 *
 * @animations
 * enter - animation is used to bring new content into the browser.
 * leave - animation is used to animate existing content away.
 *
 * The enter and leave animation occur concurrently.
 *
 * @scope
 * @priority 400
 *
 * @param {string} ngInclude|src angular expression evaluating to URL. If the source is a string constant,
 *                 make sure you wrap it in quotes, e.g. `src="'myPartialTemplate.html'"`.
 * @param {string=} onload Expression to evaluate when a new partial is loaded.
 *
 * @param {string=} autoscroll Whether `ngInclude` should call {@link ng.$anchorScroll
 *                  $anchorScroll} to scroll the viewport after the content is loaded.
 *
 *                  - If the attribute is not set, disable scrolling.
 *                  - If the attribute is set without value, enable scrolling.
 *                  - Otherwise enable scrolling only if the expression evaluates to truthy value.
 *
 * @example
  <example animations="true">
    <file name="index.html">
     <div ng-controller="Ctrl">
       <select ng-model="template" ng-options="t.name for t in templates">
        <option value="">(blank)</option>
       </select>
       url of the template: <tt>{{template.url}}</tt>
       <hr/>
       <div class="slide-animate-container">
         <div class="slide-animate" ng-include="template.url"></div>
       </div>
     </div>
    </file>
    <file name="script.js">
      function Ctrl($scope) {
        $scope.templates =
          [ { name: 'template1.html', url: 'template1.html'}
          , { name: 'template2.html', url: 'template2.html'} ];
        $scope.template = $scope.templates[0];
      }
     </file>
    <file name="template1.html">
      Content of template1.html
    </file>
    <file name="template2.html">
      Content of template2.html
    </file>
    <file name="animations.css">
      .slide-animate-container {
        position:relative;
        background:white;
        border:1px solid black;
        height:40px;
        overflow:hidden;
      }

      .slide-animate {
        padding:10px;
      }

      .slide-animate.ng-enter, .slide-animate.ng-leave {
        -webkit-transition:all cubic-bezier(0.250, 0.460, 0.450, 0.940) 0.5s;
        transition:all cubic-bezier(0.250, 0.460, 0.450, 0.940) 0.5s;

        position:absolute;
        top:0;
        left:0;
        right:0;
        bottom:0;
        display:block;
        padding:10px;
      }

      .slide-animate.ng-enter {
        top:-50px;
      }
      .slide-animate.ng-enter.ng-enter-active {
        top:0;
      }

      .slide-animate.ng-leave {
        top:0;
      }
      .slide-animate.ng-leave.ng-leave-active {
        top:50px;
      }
    </file>
    <file name="scenario.js">
      it('should load template1.html', function() {
       expect(element('.doc-example-live [ng-include]').text()).
         toMatch(/Content of template1.html/);
      });
      it('should load template2.html', function() {
       select('template').option('1');
       expect(element('.doc-example-live [ng-include]').text()).
         toMatch(/Content of template2.html/);
      });
      it('should change to blank', function() {
       select('template').option('');
       expect(element('.doc-example-live [ng-include]')).toBe(undefined);
      });
    </file>
  </example>
 */


/**
 * @ngdoc event
 * @name ng.directive:ngInclude#$includeContentRequested
 * @eventOf ng.directive:ngInclude
 * @eventType emit on the scope ngInclude was declared in
 * @description
 * Emitted every time the ngInclude content is requested.
 */


/**
 * @ngdoc event
 * @name ng.directive:ngInclude#$includeContentLoaded
 * @eventOf ng.directive:ngInclude
 * @eventType emit on the current ngInclude scope
 * @description
 * Emitted every time the ngInclude content is reloaded.
 */
var ngIncludeDirective = ['$http', '$templateCache', '$anchorScroll', '$compile', '$animate', '$sce',
                  function($http,   $templateCache,   $anchorScroll,   $compile,   $animate,   $sce) {
  return {
    restrict: 'ECA',
    priority: 400,
    terminal: true,
    transclude: 'element',
    compile: function(element, attr) {
      var srcExp = attr.ngInclude || attr.src,
          onloadExp = attr.onload || '',
          autoScrollExp = attr.autoscroll;

      return function(scope, $element, $attr, ctrl, $transclude) {
        var changeCounter = 0,
            currentScope,
            currentElement;

        var cleanupLastIncludeContent = function() {
          if (currentScope) {
            currentScope.$destroy();
            currentScope = null;
          }
          if(currentElement) {
            $animate.leave(currentElement);
            currentElement = null;
          }
        };

        scope.$watch($sce.parseAsResourceUrl(srcExp), function ngIncludeWatchAction(src) {
          var afterAnimation = function() {
            if (isDefined(autoScrollExp) && (!autoScrollExp || scope.$eval(autoScrollExp))) {
              $anchorScroll();
            }
          };
          var thisChangeId = ++changeCounter;

          if (src) {
            $http.get(src, {cache: $templateCache}).success(function(response) {
              if (thisChangeId !== changeCounter) return;
              var newScope = scope.$new();

              $transclude(newScope, function(clone) {
                cleanupLastIncludeContent();

                currentScope = newScope;
                currentElement = clone;

                currentElement.html(response);
                $animate.enter(currentElement, null, $element, afterAnimation);
                $compile(currentElement.contents())(currentScope);
                currentScope.$emit('$includeContentLoaded');
                scope.$eval(onloadExp);
              });
            }).error(function() {
              if (thisChangeId === changeCounter) cleanupLastIncludeContent();
            });
            scope.$emit('$includeContentRequested');
          } else {
            cleanupLastIncludeContent();
          }
        });
      };
    }
  };
}];

/**
 * @ngdoc directive
 * @name ng.directive:ngInit
 * @restrict AC
 *
 * @description
 * The `ngInit` directive allows you to evaluate an expression in the
 * current scope.
 *
 * <div class="alert alert-error">
 * The only appropriate use of `ngInit` for aliasing special properties of
 * {@link api/ng.directive:ngRepeat `ngRepeat`}, as seen in the demo below. Besides this case, you
 * should use {@link guide/controller controllers} rather than `ngInit`
 * to initialize values on a scope.
 * </div>
 *
 * @element ANY
 * @param {expression} ngInit {@link guide/expression Expression} to eval.
 *
 * @example
   <doc:example>
     <doc:source>
   <script>
     function Ctrl($scope) {
       $scope.list = [['a', 'b'], ['c', 'd']];
     }
   </script>
   <div ng-controller="Ctrl">
     <div ng-repeat="innerList in list" ng-init="outerIndex = $index">
       <div ng-repeat="value in innerList" ng-init="innerIndex = $index">
          <span class="example-init">list[ {{outerIndex}} ][ {{innerIndex}} ] = {{value}};</span>
       </div>
     </div>
   </div>
     </doc:source>
     <doc:scenario>
       it('should alias index positions', function() {
         expect(element('.example-init').text())
           .toBe('list[ 0 ][ 0 ] = a;' +
                 'list[ 0 ][ 1 ] = b;' +
                 'list[ 1 ][ 0 ] = c;' +
                 'list[ 1 ][ 1 ] = d;');
       });
     </doc:scenario>
   </doc:example>
 */
var ngInitDirective = ngDirective({
  compile: function() {
    return {
      pre: function(scope, element, attrs) {
        scope.$eval(attrs.ngInit);
      }
    };
  }
});

/**
 * @ngdoc directive
 * @name ng.directive:ngNonBindable
 * @restrict AC
 * @priority 1000
 *
 * @description
 * The `ngNonBindable` directive tells Angular not to compile or bind the contents of the current
 * DOM element. This is useful if the element contains what appears to be Angular directives and
 * bindings but which should be ignored by Angular. This could be the case if you have a site that
 * displays snippets of code, for instance.
 *
 * @element ANY
 *
 * @example
 * In this example there are two locations where a simple interpolation binding (`{{}}`) is present,
 * but the one wrapped in `ngNonBindable` is left alone.
 *
 * @example
    <doc:example>
      <doc:source>
        <div>Normal: {{1 + 2}}</div>
        <div ng-non-bindable>Ignored: {{1 + 2}}</div>
      </doc:source>
      <doc:scenario>
       it('should check ng-non-bindable', function() {
         expect(using('.doc-example-live').binding('1 + 2')).toBe('3');
         expect(using('.doc-example-live').element('div:last').text()).
           toMatch(/1 \+ 2/);
       });
      </doc:scenario>
    </doc:example>
 */
var ngNonBindableDirective = ngDirective({ terminal: true, priority: 1000 });

/**
 * @ngdoc directive
 * @name ng.directive:ngPluralize
 * @restrict EA
 *
 * @description
 * # Overview
 * `ngPluralize` is a directive that displays messages according to en-US localization rules.
 * These rules are bundled with angular.js, but can be overridden
 * (see {@link guide/i18n Angular i18n} dev guide). You configure ngPluralize directive
 * by specifying the mappings between
 * {@link http://unicode.org/repos/cldr-tmp/trunk/diff/supplemental/language_plural_rules.html
 * plural categories} and the strings to be displayed.
 *
 * # Plural categories and explicit number rules
 * There are two
 * {@link http://unicode.org/repos/cldr-tmp/trunk/diff/supplemental/language_plural_rules.html
 * plural categories} in Angular's default en-US locale: "one" and "other".
 *
 * While a plural category may match many numbers (for example, in en-US locale, "other" can match
 * any number that is not 1), an explicit number rule can only match one number. For example, the
 * explicit number rule for "3" matches the number 3. There are examples of plural categories
 * and explicit number rules throughout the rest of this documentation.
 *
 * # Configuring ngPluralize
 * You configure ngPluralize by providing 2 attributes: `count` and `when`.
 * You can also provide an optional attribute, `offset`.
 *
 * The value of the `count` attribute can be either a string or an {@link guide/expression
 * Angular expression}; these are evaluated on the current scope for its bound value.
 *
 * The `when` attribute specifies the mappings between plural categories and the actual
 * string to be displayed. The value of the attribute should be a JSON object.
 *
 * The following example shows how to configure ngPluralize:
 *
 * <pre>
 * <ng-pluralize count="personCount"
                 when="{'0': 'Nobody is viewing.',
 *                      'one': '1 person is viewing.',
 *                      'other': '{} people are viewing.'}">
 * </ng-pluralize>
 *</pre>
 *
 * In the example, `"0: Nobody is viewing."` is an explicit number rule. If you did not
 * specify this rule, 0 would be matched to the "other" category and "0 people are viewing"
 * would be shown instead of "Nobody is viewing". You can specify an explicit number rule for
 * other numbers, for example 12, so that instead of showing "12 people are viewing", you can
 * show "a dozen people are viewing".
 *
 * You can use a set of closed braces(`{}`) as a placeholder for the number that you want substituted
 * into pluralized strings. In the previous example, Angular will replace `{}` with
 * <span ng-non-bindable>`{{personCount}}`</span>. The closed braces `{}` is a placeholder
 * for <span ng-non-bindable>{{numberExpression}}</span>.
 *
 * # Configuring ngPluralize with offset
 * The `offset` attribute allows further customization of pluralized text, which can result in
 * a better user experience. For example, instead of the message "4 people are viewing this document",
 * you might display "John, Kate and 2 others are viewing this document".
 * The offset attribute allows you to offset a number by any desired value.
 * Let's take a look at an example:
 *
 * <pre>
 * <ng-pluralize count="personCount" offset=2
 *               when="{'0': 'Nobody is viewing.',
 *                      '1': '{{person1}} is viewing.',
 *                      '2': '{{person1}} and {{person2}} are viewing.',
 *                      'one': '{{person1}}, {{person2}} and one other person are viewing.',
 *                      'other': '{{person1}}, {{person2}} and {} other people are viewing.'}">
 * </ng-pluralize>
 * </pre>
 *
 * Notice that we are still using two plural categories(one, other), but we added
 * three explicit number rules 0, 1 and 2.
 * When one person, perhaps John, views the document, "John is viewing" will be shown.
 * When three people view the document, no explicit number rule is found, so
 * an offset of 2 is taken off 3, and Angular uses 1 to decide the plural category.
 * In this case, plural category 'one' is matched and "John, Marry and one other person are viewing"
 * is shown.
 *
 * Note that when you specify offsets, you must provide explicit number rules for
 * numbers from 0 up to and including the offset. If you use an offset of 3, for example,
 * you must provide explicit number rules for 0, 1, 2 and 3. You must also provide plural strings for
 * plural categories "one" and "other".
 *
 * @param {string|expression} count The variable to be bounded to.
 * @param {string} when The mapping between plural category to its corresponding strings.
 * @param {number=} offset Offset to deduct from the total number.
 *
 * @example
    <doc:example>
      <doc:source>
        <script>
          function Ctrl($scope) {
            $scope.person1 = 'Igor';
            $scope.person2 = 'Misko';
            $scope.personCount = 1;
          }
        </script>
        <div ng-controller="Ctrl">
          Person 1:<input type="text" ng-model="person1" value="Igor" /><br/>
          Person 2:<input type="text" ng-model="person2" value="Misko" /><br/>
          Number of People:<input type="text" ng-model="personCount" value="1" /><br/>

          <!--- Example with simple pluralization rules for en locale --->
          Without Offset:
          <ng-pluralize count="personCount"
                        when="{'0': 'Nobody is viewing.',
                               'one': '1 person is viewing.',
                               'other': '{} people are viewing.'}">
          </ng-pluralize><br>

          <!--- Example with offset --->
          With Offset(2):
          <ng-pluralize count="personCount" offset=2
                        when="{'0': 'Nobody is viewing.',
                               '1': '{{person1}} is viewing.',
                               '2': '{{person1}} and {{person2}} are viewing.',
                               'one': '{{person1}}, {{person2}} and one other person are viewing.',
                               'other': '{{person1}}, {{person2}} and {} other people are viewing.'}">
          </ng-pluralize>
        </div>
      </doc:source>
      <doc:scenario>
        it('should show correct pluralized string', function() {
          expect(element('.doc-example-live ng-pluralize:first').text()).
                                             toBe('1 person is viewing.');
          expect(element('.doc-example-live ng-pluralize:last').text()).
                                                toBe('Igor is viewing.');

          using('.doc-example-live').input('personCount').enter('0');
          expect(element('.doc-example-live ng-pluralize:first').text()).
                                               toBe('Nobody is viewing.');
          expect(element('.doc-example-live ng-pluralize:last').text()).
                                              toBe('Nobody is viewing.');

          using('.doc-example-live').input('personCount').enter('2');
          expect(element('.doc-example-live ng-pluralize:first').text()).
                                            toBe('2 people are viewing.');
          expect(element('.doc-example-live ng-pluralize:last').text()).
                              toBe('Igor and Misko are viewing.');

          using('.doc-example-live').input('personCount').enter('3');
          expect(element('.doc-example-live ng-pluralize:first').text()).
                                            toBe('3 people are viewing.');
          expect(element('.doc-example-live ng-pluralize:last').text()).
                              toBe('Igor, Misko and one other person are viewing.');

          using('.doc-example-live').input('personCount').enter('4');
          expect(element('.doc-example-live ng-pluralize:first').text()).
                                            toBe('4 people are viewing.');
          expect(element('.doc-example-live ng-pluralize:last').text()).
                              toBe('Igor, Misko and 2 other people are viewing.');
        });

        it('should show data-binded names', function() {
          using('.doc-example-live').input('personCount').enter('4');
          expect(element('.doc-example-live ng-pluralize:last').text()).
              toBe('Igor, Misko and 2 other people are viewing.');

          using('.doc-example-live').input('person1').enter('Di');
          using('.doc-example-live').input('person2').enter('Vojta');
          expect(element('.doc-example-live ng-pluralize:last').text()).
              toBe('Di, Vojta and 2 other people are viewing.');
        });
      </doc:scenario>
    </doc:example>
 */
var ngPluralizeDirective = ['$locale', '$interpolate', function($locale, $interpolate) {
  var BRACE = /{}/g;
  return {
    restrict: 'EA',
    link: function(scope, element, attr) {
      var numberExp = attr.count,
          whenExp = attr.$attr.when && element.attr(attr.$attr.when), // we have {{}} in attrs
          offset = attr.offset || 0,
          whens = scope.$eval(whenExp) || {},
          whensExpFns = {},
          startSymbol = $interpolate.startSymbol(),
          endSymbol = $interpolate.endSymbol(),
          isWhen = /^when(Minus)?(.+)$/;

      forEach(attr, function(expression, attributeName) {
        if (isWhen.test(attributeName)) {
          whens[lowercase(attributeName.replace('when', '').replace('Minus', '-'))] =
            element.attr(attr.$attr[attributeName]);
        }
      });
      forEach(whens, function(expression, key) {
        whensExpFns[key] =
          $interpolate(expression.replace(BRACE, startSymbol + numberExp + '-' +
            offset + endSymbol));
      });

      scope.$watch(function ngPluralizeWatch() {
        var value = parseFloat(scope.$eval(numberExp));

        if (!isNaN(value)) {
          //if explicit number rule such as 1, 2, 3... is defined, just use it. Otherwise,
          //check it against pluralization rules in $locale service
          if (!(value in whens)) value = $locale.pluralCat(value - offset);
           return whensExpFns[value](scope, element, true);
        } else {
          return '';
        }
      }, function ngPluralizeWatchAction(newVal) {
        element.text(newVal);
      });
    }
  };
}];

/**
 * @ngdoc directive
 * @name ng.directive:ngRepeat
 *
 * @description
 * The `ngRepeat` directive instantiates a template once per item from a collection. Each template
 * instance gets its own scope, where the given loop variable is set to the current collection item,
 * and `$index` is set to the item index or key.
 *
 * Special properties are exposed on the local scope of each template instance, including:
 *
 * | Variable  | Type            | Details                                                                     |
 * |-----------|-----------------|-----------------------------------------------------------------------------|
 * | `$index`  | {@type number}  | iterator offset of the repeated element (0..length-1)                       |
 * | `$first`  | {@type boolean} | true if the repeated element is first in the iterator.                      |
 * | `$middle` | {@type boolean} | true if the repeated element is between the first and last in the iterator. |
 * | `$last`   | {@type boolean} | true if the repeated element is last in the iterator.                       |
 * | `$even`   | {@type boolean} | true if the iterator position `$index` is even (otherwise false).           |
 * | `$odd`    | {@type boolean} | true if the iterator position `$index` is odd (otherwise false).            |
 *
 *
 * # Special repeat start and end points
 * To repeat a series of elements instead of just one parent element, ngRepeat (as well as other ng directives) supports extending
 * the range of the repeater by defining explicit start and end points by using **ng-repeat-start** and **ng-repeat-end** respectively.
 * The **ng-repeat-start** directive works the same as **ng-repeat**, but will repeat all the HTML code (including the tag it's defined on)
 * up to and including the ending HTML tag where **ng-repeat-end** is placed.
 *
 * The example below makes use of this feature:
 * <pre>
 *   <header ng-repeat-start="item in items">
 *     Header {{ item }}
 *   </header>
 *   <div class="body">
 *     Body {{ item }}
 *   </div>
 *   <footer ng-repeat-end>
 *     Footer {{ item }}
 *   </footer>
 * </pre>
 *
 * And with an input of {@type ['A','B']} for the items variable in the example above, the output will evaluate to:
 * <pre>
 *   <header>
 *     Header A
 *   </header>
 *   <div class="body">
 *     Body A
 *   </div>
 *   <footer>
 *     Footer A
 *   </footer>
 *   <header>
 *     Header B
 *   </header>
 *   <div class="body">
 *     Body B
 *   </div>
 *   <footer>
 *     Footer B
 *   </footer>
 * </pre>
 *
 * The custom start and end points for ngRepeat also support all other HTML directive syntax flavors provided in AngularJS (such
 * as **data-ng-repeat-start**, **x-ng-repeat-start** and **ng:repeat-start**).
 *
 * @animations
 * enter - when a new item is added to the list or when an item is revealed after a filter
 * leave - when an item is removed from the list or when an item is filtered out
 * move - when an adjacent item is filtered out causing a reorder or when the item contents are reordered
 *
 * @element ANY
 * @scope
 * @priority 1000
 * @param {repeat_expression} ngRepeat The expression indicating how to enumerate a collection. These
 *   formats are currently supported:
 *
 *   * `variable in expression` – where variable is the user defined loop variable and `expression`
 *     is a scope expression giving the collection to enumerate.
 *
 *     For example: `album in artist.albums`.
 *
 *   * `(key, value) in expression` – where `key` and `value` can be any user defined identifiers,
 *     and `expression` is the scope expression giving the collection to enumerate.
 *
 *     For example: `(name, age) in {'adam':10, 'amalie':12}`.
 *
 *   * `variable in expression track by tracking_expression` – You can also provide an optional tracking function
 *     which can be used to associate the objects in the collection with the DOM elements. If no tracking function
 *     is specified the ng-repeat associates elements by identity in the collection. It is an error to have
 *     more than one tracking function to resolve to the same key. (This would mean that two distinct objects are
 *     mapped to the same DOM element, which is not possible.)  Filters should be applied to the expression,
 *     before specifying a tracking expression.
 *
 *     For example: `item in items` is equivalent to `item in items track by $id(item)'. This implies that the DOM elements
 *     will be associated by item identity in the array.
 *
 *     For example: `item in items track by $id(item)`. A built in `$id()` function can be used to assign a unique
 *     `$$hashKey` property to each item in the array. This property is then used as a key to associated DOM elements
 *     with the corresponding item in the array by identity. Moving the same object in array would move the DOM
 *     element in the same way ian the DOM.
 *
 *     For example: `item in items track by item.id` is a typical pattern when the items come from the database. In this
 *     case the object identity does not matter. Two objects are considered equivalent as long as their `id`
 *     property is same.
 *
 *     For example: `item in items | filter:searchText track by item.id` is a pattern that might be used to apply a filter
 *     to items in conjunction with a tracking expression.
 *
 * @example
 * This example initializes the scope to a list of names and
 * then uses `ngRepeat` to display every person:
  <example animations="true">
    <file name="index.html">
      <div ng-init="friends = [
        {name:'John', age:25, gender:'boy'},
        {name:'Jessie', age:30, gender:'girl'},
        {name:'Johanna', age:28, gender:'girl'},
        {name:'Joy', age:15, gender:'girl'},
        {name:'Mary', age:28, gender:'girl'},
        {name:'Peter', age:95, gender:'boy'},
        {name:'Sebastian', age:50, gender:'boy'},
        {name:'Erika', age:27, gender:'girl'},
        {name:'Patrick', age:40, gender:'boy'},
        {name:'Samantha', age:60, gender:'girl'}
      ]">
        I have {{friends.length}} friends. They are:
        <input type="search" ng-model="q" placeholder="filter friends..." />
        <ul class="example-animate-container">
          <li class="animate-repeat" ng-repeat="friend in friends | filter:q">
            [{{$index + 1}}] {{friend.name}} who is {{friend.age}} years old.
          </li>
        </ul>
      </div>
    </file>
    <file name="animations.css">
      .example-animate-container {
        background:white;
        border:1px solid black;
        list-style:none;
        margin:0;
        padding:0 10px;
      }

      .animate-repeat {
        line-height:40px;
        list-style:none;
        box-sizing:border-box;
      }

      .animate-repeat.ng-move,
      .animate-repeat.ng-enter,
      .animate-repeat.ng-leave {
        -webkit-transition:all linear 0.5s;
        transition:all linear 0.5s;
      }

      .animate-repeat.ng-leave.ng-leave-active,
      .animate-repeat.ng-move,
      .animate-repeat.ng-enter {
        opacity:0;
        max-height:0;
      }

      .animate-repeat.ng-leave,
      .animate-repeat.ng-move.ng-move-active,
      .animate-repeat.ng-enter.ng-enter-active {
        opacity:1;
        max-height:40px;
      }
    </file>
    <file name="scenario.js">
       it('should render initial data set', function() {
         var r = using('.doc-example-live').repeater('ul li');
         expect(r.count()).toBe(10);
         expect(r.row(0)).toEqual(["1","John","25"]);
         expect(r.row(1)).toEqual(["2","Jessie","30"]);
         expect(r.row(9)).toEqual(["10","Samantha","60"]);
         expect(binding('friends.length')).toBe("10");
       });

       it('should update repeater when filter predicate changes', function() {
         var r = using('.doc-example-live').repeater('ul li');
         expect(r.count()).toBe(10);

         input('q').enter('ma');

         expect(r.count()).toBe(2);
         expect(r.row(0)).toEqual(["1","Mary","28"]);
         expect(r.row(1)).toEqual(["2","Samantha","60"]);
       });
      </file>
    </example>
 */
var ngRepeatDirective = ['$parse', '$animate', function($parse, $animate) {
  var NG_REMOVED = '$$NG_REMOVED';
  var ngRepeatMinErr = minErr('ngRepeat');
  return {
    transclude: 'element',
    priority: 1000,
    terminal: true,
    $$tlb: true,
    link: function($scope, $element, $attr, ctrl, $transclude){
        var expression = $attr.ngRepeat;
        var match = expression.match(/^\s*(.+)\s+in\s+(.*?)\s*(\s+track\s+by\s+(.+)\s*)?$/),
          trackByExp, trackByExpGetter, trackByIdExpFn, trackByIdArrayFn, trackByIdObjFn,
          lhs, rhs, valueIdentifier, keyIdentifier,
          hashFnLocals = {$id: hashKey};

        if (!match) {
          throw ngRepeatMinErr('iexp', "Expected expression in form of '_item_ in _collection_[ track by _id_]' but got '{0}'.",
            expression);
        }

        lhs = match[1];
        rhs = match[2];
        trackByExp = match[4];

        if (trackByExp) {
          trackByExpGetter = $parse(trackByExp);
          trackByIdExpFn = function(key, value, index) {
            // assign key, value, and $index to the locals so that they can be used in hash functions
            if (keyIdentifier) hashFnLocals[keyIdentifier] = key;
            hashFnLocals[valueIdentifier] = value;
            hashFnLocals.$index = index;
            return trackByExpGetter($scope, hashFnLocals);
          };
        } else {
          trackByIdArrayFn = function(key, value) {
            return hashKey(value);
          };
          trackByIdObjFn = function(key) {
            return key;
          };
        }

        match = lhs.match(/^(?:([\$\w]+)|\(([\$\w]+)\s*,\s*([\$\w]+)\))$/);
        if (!match) {
          throw ngRepeatMinErr('iidexp', "'_item_' in '_item_ in _collection_' should be an identifier or '(_key_, _value_)' expression, but got '{0}'.",
                                                                    lhs);
        }
        valueIdentifier = match[3] || match[1];
        keyIdentifier = match[2];

        // Store a list of elements from previous run. This is a hash where key is the item from the
        // iterator, and the value is objects with following properties.
        //   - scope: bound scope
        //   - element: previous element.
        //   - index: position
        var lastBlockMap = {};

        //watch props
        $scope.$watchCollection(rhs, function ngRepeatAction(collection){
          var index, length,
              previousNode = $element[0],     // current position of the node
              nextNode,
              // Same as lastBlockMap but it has the current state. It will become the
              // lastBlockMap on the next iteration.
              nextBlockMap = {},
              arrayLength,
              childScope,
              key, value, // key/value of iteration
              trackById,
              trackByIdFn,
              collectionKeys,
              block,       // last object information {scope, element, id}
              nextBlockOrder = [],
              elementsToRemove;


          if (isArrayLike(collection)) {
            collectionKeys = collection;
            trackByIdFn = trackByIdExpFn || trackByIdArrayFn;
          } else {
            trackByIdFn = trackByIdExpFn || trackByIdObjFn;
            // if object, extract keys, sort them and use to determine order of iteration over obj props
            collectionKeys = [];
            for (key in collection) {
              if (collection.hasOwnProperty(key) && key.charAt(0) != '$') {
                collectionKeys.push(key);
              }
            }
            collectionKeys.sort();
          }

          arrayLength = collectionKeys.length;

          // locate existing items
          length = nextBlockOrder.length = collectionKeys.length;
          for(index = 0; index < length; index++) {
           key = (collection === collectionKeys) ? index : collectionKeys[index];
           value = collection[key];
           trackById = trackByIdFn(key, value, index);
           assertNotHasOwnProperty(trackById, '`track by` id');
           if(lastBlockMap.hasOwnProperty(trackById)) {
             block = lastBlockMap[trackById];
             delete lastBlockMap[trackById];
             nextBlockMap[trackById] = block;
             nextBlockOrder[index] = block;
           } else if (nextBlockMap.hasOwnProperty(trackById)) {
             // restore lastBlockMap
             forEach(nextBlockOrder, function(block) {
               if (block && block.startNode) lastBlockMap[block.id] = block;
             });
             // This is a duplicate and we need to throw an error
             throw ngRepeatMinErr('dupes', "Duplicates in a repeater are not allowed. Use 'track by' expression to specify unique keys. Repeater: {0}, Duplicate key: {1}",
                                                                                                                                                    expression,       trackById);
           } else {
             // new never before seen block
             nextBlockOrder[index] = { id: trackById };
             nextBlockMap[trackById] = false;
           }
         }

          // remove existing items
          for (key in lastBlockMap) {
            // lastBlockMap is our own object so we don't need to use special hasOwnPropertyFn
            if (lastBlockMap.hasOwnProperty(key)) {
              block = lastBlockMap[key];
              elementsToRemove = getBlockElements(block);
              $animate.leave(elementsToRemove);
              forEach(elementsToRemove, function(element) { element[NG_REMOVED] = true; });
              block.scope.$destroy();
            }
          }

          // we are not using forEach for perf reasons (trying to avoid #call)
          for (index = 0, length = collectionKeys.length; index < length; index++) {
            key = (collection === collectionKeys) ? index : collectionKeys[index];
            value = collection[key];
            block = nextBlockOrder[index];
            if (nextBlockOrder[index - 1]) previousNode = nextBlockOrder[index - 1].endNode;

            if (block.startNode) {
              // if we have already seen this object, then we need to reuse the
              // associated scope/element
              childScope = block.scope;

              nextNode = previousNode;
              do {
                nextNode = nextNode.nextSibling;
              } while(nextNode && nextNode[NG_REMOVED]);

              if (block.startNode != nextNode) {
                // existing item which got moved
                $animate.move(getBlockElements(block), null, jqLite(previousNode));
              }
              previousNode = block.endNode;
            } else {
              // new item which we don't know about
              childScope = $scope.$new();
            }

            childScope[valueIdentifier] = value;
            if (keyIdentifier) childScope[keyIdentifier] = key;
            childScope.$index = index;
            childScope.$first = (index === 0);
            childScope.$last = (index === (arrayLength - 1));
            childScope.$middle = !(childScope.$first || childScope.$last);
            // jshint bitwise: false
            childScope.$odd = !(childScope.$even = (index&1) === 0);
            // jshint bitwise: true

            if (!block.startNode) {
              $transclude(childScope, function(clone) {
                clone[clone.length++] = document.createComment(' end ngRepeat: ' + expression + ' ');
                $animate.enter(clone, null, jqLite(previousNode));
                previousNode = clone;
                block.scope = childScope;
                block.startNode = previousNode && previousNode.endNode ? previousNode.endNode : clone[0];
                block.endNode = clone[clone.length - 1];
                nextBlockMap[block.id] = block;
              });
            }
          }
          lastBlockMap = nextBlockMap;
        });
    }
  };
}];

/**
 * @ngdoc directive
 * @name ng.directive:ngShow
 *
 * @description
 * The `ngShow` directive shows or hides the given HTML element based on the expression
 * provided to the ngShow attribute. The element is shown or hidden by removing or adding
 * the `ng-hide` CSS class onto the element. The `.ng-hide` CSS class is predefined
 * in AngularJS and sets the display style to none (using an !important flag).
 * For CSP mode please add `angular-csp.css` to your html file (see {@link ng.directive:ngCsp ngCsp}).
 *
 * <pre>
 * <!-- when $scope.myValue is truthy (element is visible) -->
 * <div ng-show="myValue"></div>
 *
 * <!-- when $scope.myValue is falsy (element is hidden) -->
 * <div ng-show="myValue" class="ng-hide"></div>
 * </pre>
 *
 * When the ngShow expression evaluates to false then the ng-hide CSS class is added to the class attribute
 * on the element causing it to become hidden. When true, the ng-hide CSS class is removed
 * from the element causing the element not to appear hidden.
 *
 * ## Why is !important used?
 *
 * You may be wondering why !important is used for the .ng-hide CSS class. This is because the `.ng-hide` selector
 * can be easily overridden by heavier selectors. For example, something as simple
 * as changing the display style on a HTML list item would make hidden elements appear visible.
 * This also becomes a bigger issue when dealing with CSS frameworks.
 *
 * By using !important, the show and hide behavior will work as expected despite any clash between CSS selector
 * specificity (when !important isn't used with any conflicting styles). If a developer chooses to override the
 * styling to change how to hide an element then it is just a matter of using !important in their own CSS code.
 *
 * ### Overriding .ng-hide
 *
 * If you wish to change the hide behavior with ngShow/ngHide then this can be achieved by
 * restating the styles for the .ng-hide class in CSS:
 * <pre>
 * .ng-hide {
 *   //!annotate CSS Specificity|Not to worry, this will override the AngularJS default...
 *   display:block!important;
 *
 *   //this is just another form of hiding an element
 *   position:absolute;
 *   top:-9999px;
 *   left:-9999px;
 * }
 * </pre>
 *
 * Just remember to include the important flag so the CSS override will function.
 *
 * ## A note about animations with ngShow
 *
 * Animations in ngShow/ngHide work with the show and hide events that are triggered when the directive expression
 * is true and false. This system works like the animation system present with ngClass except that
 * you must also include the !important flag to override the display property
 * so that you can perform an animation when the element is hidden during the time of the animation.
 *
 * <pre>
 * //
 * //a working example can be found at the bottom of this page
 * //
 * .my-element.ng-hide-add, .my-element.ng-hide-remove {
 *   transition:0.5s linear all;
 *   display:block!important;
 * }
 *
 * .my-element.ng-hide-add { ... }
 * .my-element.ng-hide-add.ng-hide-add-active { ... }
 * .my-element.ng-hide-remove { ... }
 * .my-element.ng-hide-remove.ng-hide-remove-active { ... }
 * </pre>
 *
 * @animations
 * addClass: .ng-hide - happens after the ngShow expression evaluates to a truthy value and the just before contents are set to visible
 * removeClass: .ng-hide - happens after the ngShow expression evaluates to a non truthy value and just before the contents are set to hidden
 *
 * @element ANY
 * @param {expression} ngShow If the {@link guide/expression expression} is truthy
 *     then the element is shown or hidden respectively.
 *
 * @example
  <example animations="true">
    <file name="index.html">
      Click me: <input type="checkbox" ng-model="checked"><br/>
      <div>
        Show:
        <div class="check-element animate-show" ng-show="checked">
          <span class="icon-thumbs-up"></span> I show up when your checkbox is checked.
        </div>
      </div>
      <div>
        Hide:
        <div class="check-element animate-show" ng-hide="checked">
          <span class="icon-thumbs-down"></span> I hide when your checkbox is checked.
        </div>
      </div>
    </file>
    <file name="animations.css">
      .animate-show {
        -webkit-transition:all linear 0.5s;
        transition:all linear 0.5s;
        line-height:20px;
        opacity:1;
        padding:10px;
        border:1px solid black;
        background:white;
      }

      .animate-show.ng-hide-add,
      .animate-show.ng-hide-remove {
        display:block!important;
      }

      .animate-show.ng-hide {
        line-height:0;
        opacity:0;
        padding:0 10px;
      }

      .check-element {
        padding:10px;
        border:1px solid black;
        background:white;
      }
    </file>
    <file name="scenario.js">
       it('should check ng-show / ng-hide', function() {
         expect(element('.doc-example-live span:first:hidden').count()).toEqual(1);
         expect(element('.doc-example-live span:last:visible').count()).toEqual(1);

         input('checked').check();

         expect(element('.doc-example-live span:first:visible').count()).toEqual(1);
         expect(element('.doc-example-live span:last:hidden').count()).toEqual(1);
       });
    </file>
  </example>
 */
var ngShowDirective = ['$animate', function($animate) {
  return function(scope, element, attr) {
    scope.$watch(attr.ngShow, function ngShowWatchAction(value){
      $animate[toBoolean(value) ? 'removeClass' : 'addClass'](element, 'ng-hide');
    });
  };
}];


/**
 * @ngdoc directive
 * @name ng.directive:ngHide
 *
 * @description
 * The `ngHide` directive shows or hides the given HTML element based on the expression
 * provided to the ngHide attribute. The element is shown or hidden by removing or adding
 * the `ng-hide` CSS class onto the element. The `.ng-hide` CSS class is predefined
 * in AngularJS and sets the display style to none (using an !important flag).
 * For CSP mode please add `angular-csp.css` to your html file (see {@link ng.directive:ngCsp ngCsp}).
 *
 * <pre>
 * <!-- when $scope.myValue is truthy (element is hidden) -->
 * <div ng-hide="myValue"></div>
 *
 * <!-- when $scope.myValue is falsy (element is visible) -->
 * <div ng-hide="myValue" class="ng-hide"></div>
 * </pre>
 *
 * When the ngHide expression evaluates to true then the .ng-hide CSS class is added to the class attribute
 * on the element causing it to become hidden. When false, the ng-hide CSS class is removed
 * from the element causing the element not to appear hidden.
 *
 * ## Why is !important used?
 *
 * You may be wondering why !important is used for the .ng-hide CSS class. This is because the `.ng-hide` selector
 * can be easily overridden by heavier selectors. For example, something as simple
 * as changing the display style on a HTML list item would make hidden elements appear visible.
 * This also becomes a bigger issue when dealing with CSS frameworks.
 *
 * By using !important, the show and hide behavior will work as expected despite any clash between CSS selector
 * specificity (when !important isn't used with any conflicting styles). If a developer chooses to override the
 * styling to change how to hide an element then it is just a matter of using !important in their own CSS code.
 *
 * ### Overriding .ng-hide
 *
 * If you wish to change the hide behavior with ngShow/ngHide then this can be achieved by
 * restating the styles for the .ng-hide class in CSS:
 * <pre>
 * .ng-hide {
 *   //!annotate CSS Specificity|Not to worry, this will override the AngularJS default...
 *   display:block!important;
 *
 *   //this is just another form of hiding an element
 *   position:absolute;
 *   top:-9999px;
 *   left:-9999px;
 * }
 * </pre>
 *
 * Just remember to include the important flag so the CSS override will function.
 *
 * ## A note about animations with ngHide
 *
 * Animations in ngShow/ngHide work with the show and hide events that are triggered when the directive expression
 * is true and false. This system works like the animation system present with ngClass, except that
 * you must also include the !important flag to override the display property so
 * that you can perform an animation when the element is hidden during the time of the animation.
 *
 * <pre>
 * //
 * //a working example can be found at the bottom of this page
 * //
 * .my-element.ng-hide-add, .my-element.ng-hide-remove {
 *   transition:0.5s linear all;
 *   display:block!important;
 * }
 *
 * .my-element.ng-hide-add { ... }
 * .my-element.ng-hide-add.ng-hide-add-active { ... }
 * .my-element.ng-hide-remove { ... }
 * .my-element.ng-hide-remove.ng-hide-remove-active { ... }
 * </pre>
 *
 * @animations
 * removeClass: .ng-hide - happens after the ngHide expression evaluates to a truthy value and just before the contents are set to hidden
 * addClass: .ng-hide - happens after the ngHide expression evaluates to a non truthy value and just before the contents are set to visible
 *
 * @element ANY
 * @param {expression} ngHide If the {@link guide/expression expression} is truthy then
 *     the element is shown or hidden respectively.
 *
 * @example
  <example animations="true">
    <file name="index.html">
      Click me: <input type="checkbox" ng-model="checked"><br/>
      <div>
        Show:
        <div class="check-element animate-hide" ng-show="checked">
          <span class="icon-thumbs-up"></span> I show up when your checkbox is checked.
        </div>
      </div>
      <div>
        Hide:
        <div class="check-element animate-hide" ng-hide="checked">
          <span class="icon-thumbs-down"></span> I hide when your checkbox is checked.
        </div>
      </div>
    </file>
    <file name="animations.css">
      .animate-hide {
        -webkit-transition:all linear 0.5s;
        transition:all linear 0.5s;
        line-height:20px;
        opacity:1;
        padding:10px;
        border:1px solid black;
        background:white;
      }

      .animate-hide.ng-hide-add,
      .animate-hide.ng-hide-remove {
        display:block!important;
      }

      .animate-hide.ng-hide {
        line-height:0;
        opacity:0;
        padding:0 10px;
      }

      .check-element {
        padding:10px;
        border:1px solid black;
        background:white;
      }
    </file>
    <file name="scenario.js">
       it('should check ng-show / ng-hide', function() {
         expect(element('.doc-example-live .check-element:first:hidden').count()).toEqual(1);
         expect(element('.doc-example-live .check-element:last:visible').count()).toEqual(1);

         input('checked').check();

         expect(element('.doc-example-live .check-element:first:visible').count()).toEqual(1);
         expect(element('.doc-example-live .check-element:last:hidden').count()).toEqual(1);
       });
    </file>
  </example>
 */
var ngHideDirective = ['$animate', function($animate) {
  return function(scope, element, attr) {
    scope.$watch(attr.ngHide, function ngHideWatchAction(value){
      $animate[toBoolean(value) ? 'addClass' : 'removeClass'](element, 'ng-hide');
    });
  };
}];

/**
 * @ngdoc directive
 * @name ng.directive:ngStyle
 * @restrict AC
 *
 * @description
 * The `ngStyle` directive allows you to set CSS style on an HTML element conditionally.
 *
 * @element ANY
 * @param {expression} ngStyle {@link guide/expression Expression} which evals to an
 *      object whose keys are CSS style names and values are corresponding values for those CSS
 *      keys.
 *
 * @example
   <example>
     <file name="index.html">
        <input type="button" value="set" ng-click="myStyle={color:'red'}">
        <input type="button" value="clear" ng-click="myStyle={}">
        <br/>
        <span ng-style="myStyle">Sample Text</span>
        <pre>myStyle={{myStyle}}</pre>
     </file>
     <file name="style.css">
       span {
         color: black;
       }
     </file>
     <file name="scenario.js">
       it('should check ng-style', function() {
         expect(element('.doc-example-live span').css('color')).toBe('rgb(0, 0, 0)');
         element('.doc-example-live :button[value=set]').click();
         expect(element('.doc-example-live span').css('color')).toBe('rgb(255, 0, 0)');
         element('.doc-example-live :button[value=clear]').click();
         expect(element('.doc-example-live span').css('color')).toBe('rgb(0, 0, 0)');
       });
     </file>
   </example>
 */
var ngStyleDirective = ngDirective(function(scope, element, attr) {
  scope.$watch(attr.ngStyle, function ngStyleWatchAction(newStyles, oldStyles) {
    if (oldStyles && (newStyles !== oldStyles)) {
      forEach(oldStyles, function(val, style) { element.css(style, '');});
    }
    if (newStyles) element.css(newStyles);
  }, true);
});

/**
 * @ngdoc directive
 * @name ng.directive:ngSwitch
 * @restrict EA
 *
 * @description
 * The ngSwitch directive is used to conditionally swap DOM structure on your template based on a scope expression.
 * Elements within ngSwitch but without ngSwitchWhen or ngSwitchDefault directives will be preserved at the location
 * as specified in the template.
 *
 * The directive itself works similar to ngInclude, however, instead of downloading template code (or loading it
 * from the template cache), ngSwitch simply choses one of the nested elements and makes it visible based on which element
 * matches the value obtained from the evaluated expression. In other words, you define a container element
 * (where you place the directive), place an expression on the **on="..." attribute**
 * (or the **ng-switch="..." attribute**), define any inner elements inside of the directive and place
 * a when attribute per element. The when attribute is used to inform ngSwitch which element to display when the on
 * expression is evaluated. If a matching expression is not found via a when attribute then an element with the default
 * attribute is displayed.
 *
 * @animations
 * enter - happens after the ngSwitch contents change and the matched child element is placed inside the container
 * leave - happens just after the ngSwitch contents change and just before the former contents are removed from the DOM
 *
 * @usage
 * <ANY ng-switch="expression">
 *   <ANY ng-switch-when="matchValue1">...</ANY>
 *   <ANY ng-switch-when="matchValue2">...</ANY>
 *   <ANY ng-switch-default>...</ANY>
 * </ANY>
 *
 * @scope
 * @priority 800
 * @param {*} ngSwitch|on expression to match against <tt>ng-switch-when</tt>.
 * @paramDescription
 * On child elements add:
 *
 * * `ngSwitchWhen`: the case statement to match against. If match then this
 *   case will be displayed. If the same match appears multiple times, all the
 *   elements will be displayed.
 * * `ngSwitchDefault`: the default case when no other case match. If there
 *   are multiple default cases, all of them will be displayed when no other
 *   case match.
 *
 *
 * @example
  <example animations="true">
    <file name="index.html">
      <div ng-controller="Ctrl">
        <select ng-model="selection" ng-options="item for item in items">
        </select>
        <tt>selection={{selection}}</tt>
        <hr/>
        <div class="animate-switch-container"
          ng-switch on="selection">
            <div class="animate-switch" ng-switch-when="settings">Settings Div</div>
            <div class="animate-switch" ng-switch-when="home">Home Span</div>
            <div class="animate-switch" ng-switch-default>default</div>
        </div>
      </div>
    </file>
    <file name="script.js">
      function Ctrl($scope) {
        $scope.items = ['settings', 'home', 'other'];
        $scope.selection = $scope.items[0];
      }
    </file>
    <file name="animations.css">
      .animate-switch-container {
        position:relative;
        background:white;
        border:1px solid black;
        height:40px;
        overflow:hidden;
      }

      .animate-switch {
        padding:10px;
      }

      .animate-switch.ng-animate {
        -webkit-transition:all cubic-bezier(0.250, 0.460, 0.450, 0.940) 0.5s;
        transition:all cubic-bezier(0.250, 0.460, 0.450, 0.940) 0.5s;

        position:absolute;
        top:0;
        left:0;
        right:0;
        bottom:0;
      }

      .animate-switch.ng-leave.ng-leave-active,
      .animate-switch.ng-enter {
        top:-50px;
      }
      .animate-switch.ng-leave,
      .animate-switch.ng-enter.ng-enter-active {
        top:0;
      }
    </file>
    <file name="scenario.js">
      it('should start in settings', function() {
        expect(element('.doc-example-live [ng-switch]').text()).toMatch(/Settings Div/);
      });
      it('should change to home', function() {
        select('selection').option('home');
        expect(element('.doc-example-live [ng-switch]').text()).toMatch(/Home Span/);
      });
      it('should select default', function() {
        select('selection').option('other');
        expect(element('.doc-example-live [ng-switch]').text()).toMatch(/default/);
      });
    </file>
  </example>
 */
var ngSwitchDirective = ['$animate', function($animate) {
  return {
    restrict: 'EA',
    require: 'ngSwitch',

    // asks for $scope to fool the BC controller module
    controller: ['$scope', function ngSwitchController() {
     this.cases = {};
    }],
    link: function(scope, element, attr, ngSwitchController) {
      var watchExpr = attr.ngSwitch || attr.on,
          selectedTranscludes,
          selectedElements,
          selectedScopes = [];

      scope.$watch(watchExpr, function ngSwitchWatchAction(value) {
        for (var i= 0, ii=selectedScopes.length; i<ii; i++) {
          selectedScopes[i].$destroy();
          $animate.leave(selectedElements[i]);
        }

        selectedElements = [];
        selectedScopes = [];

        if ((selectedTranscludes = ngSwitchController.cases['!' + value] || ngSwitchController.cases['?'])) {
          scope.$eval(attr.change);
          forEach(selectedTranscludes, function(selectedTransclude) {
            var selectedScope = scope.$new();
            selectedScopes.push(selectedScope);
            selectedTransclude.transclude(selectedScope, function(caseElement) {
              var anchor = selectedTransclude.element;

              selectedElements.push(caseElement);
              $animate.enter(caseElement, anchor.parent(), anchor);
            });
          });
        }
      });
    }
  };
}];

var ngSwitchWhenDirective = ngDirective({
  transclude: 'element',
  priority: 800,
  require: '^ngSwitch',
  compile: function(element, attrs) {
    return function(scope, element, attr, ctrl, $transclude) {
      ctrl.cases['!' + attrs.ngSwitchWhen] = (ctrl.cases['!' + attrs.ngSwitchWhen] || []);
      ctrl.cases['!' + attrs.ngSwitchWhen].push({ transclude: $transclude, element: element });
    };
  }
});

var ngSwitchDefaultDirective = ngDirective({
  transclude: 'element',
  priority: 800,
  require: '^ngSwitch',
  link: function(scope, element, attr, ctrl, $transclude) {
    ctrl.cases['?'] = (ctrl.cases['?'] || []);
    ctrl.cases['?'].push({ transclude: $transclude, element: element });
   }
});

/**
 * @ngdoc directive
 * @name ng.directive:ngTransclude
 * @restrict AC
 *
 * @description
 * Directive that marks the insertion point for the transcluded DOM of the nearest parent directive that uses transclusion.
 *
 * Any existing content of the element that this directive is placed on will be removed before the transcluded content is inserted.
 *
 * @element ANY
 *
 * @example
   <doc:example module="transclude">
     <doc:source>
       <script>
         function Ctrl($scope) {
           $scope.title = 'Lorem Ipsum';
           $scope.text = 'Neque porro quisquam est qui dolorem ipsum quia dolor...';
         }

         angular.module('transclude', [])
          .directive('pane', function(){
             return {
               restrict: 'E',
               transclude: true,
               scope: { title:'@' },
               template: '<div style="border: 1px solid black;">' +
                           '<div style="background-color: gray">{{title}}</div>' +
                           '<div ng-transclude></div>' +
                         '</div>'
             };
         });
       </script>
       <div ng-controller="Ctrl">
         <input ng-model="title"><br>
         <textarea ng-model="text"></textarea> <br/>
         <pane title="{{title}}">{{text}}</pane>
       </div>
     </doc:source>
     <doc:scenario>
        it('should have transcluded', function() {
          input('title').enter('TITLE');
          input('text').enter('TEXT');
          expect(binding('title')).toEqual('TITLE');
          expect(binding('text')).toEqual('TEXT');
        });
     </doc:scenario>
   </doc:example>
 *
 */
var ngTranscludeDirective = ngDirective({
  controller: ['$element', '$transclude', function($element, $transclude) {
    if (!$transclude) {
      throw minErr('ngTransclude')('orphan',
          'Illegal use of ngTransclude directive in the template! ' +
          'No parent directive that requires a transclusion found. ' +
          'Element: {0}',
          startingTag($element));
    }

    // remember the transclusion fn but call it during linking so that we don't process transclusion before directives on
    // the parent element even when the transclusion replaces the current element. (we can't use priority here because
    // that applies only to compile fns and not controllers
    this.$transclude = $transclude;
  }],

  link: function($scope, $element, $attrs, controller) {
    controller.$transclude(function(clone) {
      $element.html('');
      $element.append(clone);
    });
  }
});

/**
 * @ngdoc directive
 * @name ng.directive:script
 * @restrict E
 *
 * @description
 * Load content of a script tag, with type `text/ng-template`, into `$templateCache`, so that the
 * template can be used by `ngInclude`, `ngView` or directive templates.
 *
 * @param {'text/ng-template'} type must be set to `'text/ng-template'`
 *
 * @example
  <doc:example>
    <doc:source>
      <script type="text/ng-template" id="/tpl.html">
        Content of the template.
      </script>

      <a ng-click="currentTpl='/tpl.html'" id="tpl-link">Load inlined template</a>
      <div id="tpl-content" ng-include src="currentTpl"></div>
    </doc:source>
    <doc:scenario>
      it('should load template defined inside script tag', function() {
        element('#tpl-link').click();
        expect(element('#tpl-content').text()).toMatch(/Content of the template/);
      });
    </doc:scenario>
  </doc:example>
 */
var scriptDirective = ['$templateCache', function($templateCache) {
  return {
    restrict: 'E',
    terminal: true,
    compile: function(element, attr) {
      if (attr.type == 'text/ng-template') {
        var templateUrl = attr.id,
            // IE is not consistent, in scripts we have to read .text but in other nodes we have to read .textContent
            text = element[0].text;

        $templateCache.put(templateUrl, text);
      }
    }
  };
}];

var ngOptionsMinErr = minErr('ngOptions');
/**
 * @ngdoc directive
 * @name ng.directive:select
 * @restrict E
 *
 * @description
 * HTML `SELECT` element with angular data-binding.
 *
 * # `ngOptions`
 *
 * The `ngOptions` attribute can be used to dynamically generate a list of `<option>`
 * elements for the `<select>` element using the array or object obtained by evaluating the
 * `ngOptions` comprehension_expression.
 *
 * When an item in the `<select>` menu is selected, the array element or object property
 * represented by the selected option will be bound to the model identified by the `ngModel`
 * directive.
 *
 * Optionally, a single hard-coded `<option>` element, with the value set to an empty string, can
 * be nested into the `<select>` element. This element will then represent the `null` or "not selected"
 * option. See example below for demonstration.
 *
 * Note: `ngOptions` provides iterator facility for `<option>` element which should be used instead
 * of {@link ng.directive:ngRepeat ngRepeat} when you want the
 * `select` model to be bound to a non-string value. This is because an option element can only
 * be bound to string values at present.
 *
 * @param {string} ngModel Assignable angular expression to data-bind to.
 * @param {string=} name Property name of the form under which the control is published.
 * @param {string=} required The control is considered valid only if value is entered.
 * @param {string=} ngRequired Adds `required` attribute and `required` validation constraint to
 *    the element when the ngRequired expression evaluates to true. Use `ngRequired` instead of
 *    `required` when you want to data-bind to the `required` attribute.
 * @param {comprehension_expression=} ngOptions in one of the following forms:
 *
 *   * for array data sources:
 *     * `label` **`for`** `value` **`in`** `array`
 *     * `select` **`as`** `label` **`for`** `value` **`in`** `array`
 *     * `label`  **`group by`** `group` **`for`** `value` **`in`** `array`
 *     * `select` **`as`** `label` **`group by`** `group` **`for`** `value` **`in`** `array` **`track by`** `trackexpr`
 *   * for object data sources:
 *     * `label` **`for (`**`key` **`,`** `value`**`) in`** `object`
 *     * `select` **`as`** `label` **`for (`**`key` **`,`** `value`**`) in`** `object`
 *     * `label` **`group by`** `group` **`for (`**`key`**`,`** `value`**`) in`** `object`
 *     * `select` **`as`** `label` **`group by`** `group`
 *         **`for` `(`**`key`**`,`** `value`**`) in`** `object`
 *
 * Where:
 *
 *   * `array` / `object`: an expression which evaluates to an array / object to iterate over.
 *   * `value`: local variable which will refer to each item in the `array` or each property value
 *      of `object` during iteration.
 *   * `key`: local variable which will refer to a property name in `object` during iteration.
 *   * `label`: The result of this expression will be the label for `<option>` element. The
 *     `expression` will most likely refer to the `value` variable (e.g. `value.propertyName`).
 *   * `select`: The result of this expression will be bound to the model of the parent `<select>`
 *      element. If not specified, `select` expression will default to `value`.
 *   * `group`: The result of this expression will be used to group options using the `<optgroup>`
 *      DOM element.
 *   * `trackexpr`: Used when working with an array of objects. The result of this expression will be
 *      used to identify the objects in the array. The `trackexpr` will most likely refer to the
 *     `value` variable (e.g. `value.propertyName`).
 *
 * @example
    <doc:example>
      <doc:source>
        <script>
        function MyCntrl($scope) {
          $scope.colors = [
            {name:'black', shade:'dark'},
            {name:'white', shade:'light'},
            {name:'red', shade:'dark'},
            {name:'blue', shade:'dark'},
            {name:'yellow', shade:'light'}
          ];
          $scope.color = $scope.colors[2]; // red
        }
        </script>
        <div ng-controller="MyCntrl">
          <ul>
            <li ng-repeat="color in colors">
              Name: <input ng-model="color.name">
              [<a href ng-click="colors.splice($index, 1)">X</a>]
            </li>
            <li>
              [<a href ng-click="colors.push({})">add</a>]
            </li>
          </ul>
          <hr/>
          Color (null not allowed):
          <select ng-model="color" ng-options="c.name for c in colors"></select><br>

          Color (null allowed):
          <span  class="nullable">
            <select ng-model="color" ng-options="c.name for c in colors">
              <option value="">-- choose color --</option>
            </select>
          </span><br/>

          Color grouped by shade:
          <select ng-model="color" ng-options="c.name group by c.shade for c in colors">
          </select><br/>


          Select <a href ng-click="color={name:'not in list'}">bogus</a>.<br>
          <hr/>
          Currently selected: {{ {selected_color:color}  }}
          <div style="border:solid 1px black; height:20px"
               ng-style="{'background-color':color.name}">
          </div>
        </div>
      </doc:source>
      <doc:scenario>
         it('should check ng-options', function() {
           expect(binding('{selected_color:color}')).toMatch('red');
           select('color').option('0');
           expect(binding('{selected_color:color}')).toMatch('black');
           using('.nullable').select('color').option('');
           expect(binding('{selected_color:color}')).toMatch('null');
         });
      </doc:scenario>
    </doc:example>
 */

var ngOptionsDirective = valueFn({ terminal: true });
// jshint maxlen: false
var selectDirective = ['$compile', '$parse', function($compile,   $parse) {
                         //0000111110000000000022220000000000000000000000333300000000000000444444444444444000000000555555555555555000000066666666666666600000000000000007777000000000000000000088888
  var NG_OPTIONS_REGEXP = /^\s*(.*?)(?:\s+as\s+(.*?))?(?:\s+group\s+by\s+(.*))?\s+for\s+(?:([\$\w][\$\w]*)|(?:\(\s*([\$\w][\$\w]*)\s*,\s*([\$\w][\$\w]*)\s*\)))\s+in\s+(.*?)(?:\s+track\s+by\s+(.*?))?$/,
      nullModelCtrl = {$setViewValue: noop};
// jshint maxlen: 100

  return {
    restrict: 'E',
    require: ['select', '?ngModel'],
    controller: ['$element', '$scope', '$attrs', function($element, $scope, $attrs) {
      var self = this,
          optionsMap = {},
          ngModelCtrl = nullModelCtrl,
          nullOption,
          unknownOption;


      self.databound = $attrs.ngModel;


      self.init = function(ngModelCtrl_, nullOption_, unknownOption_) {
        ngModelCtrl = ngModelCtrl_;
        nullOption = nullOption_;
        unknownOption = unknownOption_;
      };


      self.addOption = function(value) {
        assertNotHasOwnProperty(value, '"option value"');
        optionsMap[value] = true;

        if (ngModelCtrl.$viewValue == value) {
          $element.val(value);
          if (unknownOption.parent()) unknownOption.remove();
        }
      };


      self.removeOption = function(value) {
        if (this.hasOption(value)) {
          delete optionsMap[value];
          if (ngModelCtrl.$viewValue == value) {
            this.renderUnknownOption(value);
          }
        }
      };


      self.renderUnknownOption = function(val) {
        var unknownVal = '? ' + hashKey(val) + ' ?';
        unknownOption.val(unknownVal);
        $element.prepend(unknownOption);
        $element.val(unknownVal);
        unknownOption.prop('selected', true); // needed for IE
      };


      self.hasOption = function(value) {
        return optionsMap.hasOwnProperty(value);
      };

      $scope.$on('$destroy', function() {
        // disable unknown option so that we don't do work when the whole select is being destroyed
        self.renderUnknownOption = noop;
      });
    }],

    link: function(scope, element, attr, ctrls) {
      // if ngModel is not defined, we don't need to do anything
      if (!ctrls[1]) return;

      var selectCtrl = ctrls[0],
          ngModelCtrl = ctrls[1],
          multiple = attr.multiple,
          optionsExp = attr.ngOptions,
          nullOption = false, // if false, user will not be able to select it (used by ngOptions)
          emptyOption,
          // we can't just jqLite('<option>') since jqLite is not smart enough
          // to create it in <select> and IE barfs otherwise.
          optionTemplate = jqLite(document.createElement('option')),
          optGroupTemplate =jqLite(document.createElement('optgroup')),
          unknownOption = optionTemplate.clone();

      // find "null" option
      for(var i = 0, children = element.children(), ii = children.length; i < ii; i++) {
        if (children[i].value === '') {
          emptyOption = nullOption = children.eq(i);
          break;
        }
      }

      selectCtrl.init(ngModelCtrl, nullOption, unknownOption);

      // required validator
      if (multiple && (attr.required || attr.ngRequired)) {
        var requiredValidator = function(value) {
          ngModelCtrl.$setValidity('required', !attr.required || (value && value.length));
          return value;
        };

        ngModelCtrl.$parsers.push(requiredValidator);
        ngModelCtrl.$formatters.unshift(requiredValidator);

        attr.$observe('required', function() {
          requiredValidator(ngModelCtrl.$viewValue);
        });
      }

      if (optionsExp) setupAsOptions(scope, element, ngModelCtrl);
      else if (multiple) setupAsMultiple(scope, element, ngModelCtrl);
      else setupAsSingle(scope, element, ngModelCtrl, selectCtrl);


      ////////////////////////////



      function setupAsSingle(scope, selectElement, ngModelCtrl, selectCtrl) {
        ngModelCtrl.$render = function() {
          var viewValue = ngModelCtrl.$viewValue;

          if (selectCtrl.hasOption(viewValue)) {
            if (unknownOption.parent()) unknownOption.remove();
            selectElement.val(viewValue);
            if (viewValue === '') emptyOption.prop('selected', true); // to make IE9 happy
          } else {
            if (isUndefined(viewValue) && emptyOption) {
              selectElement.val('');
            } else {
              selectCtrl.renderUnknownOption(viewValue);
            }
          }
        };

        selectElement.on('change', function() {
          scope.$apply(function() {
            if (unknownOption.parent()) unknownOption.remove();
            ngModelCtrl.$setViewValue(selectElement.val());
          });
        });
      }

      function setupAsMultiple(scope, selectElement, ctrl) {
        var lastView;
        ctrl.$render = function() {
          var items = new HashMap(ctrl.$viewValue);
          forEach(selectElement.find('option'), function(option) {
            option.selected = isDefined(items.get(option.value));
          });
        };

        // we have to do it on each watch since ngModel watches reference, but
        // we need to work of an array, so we need to see if anything was inserted/removed
        scope.$watch(function selectMultipleWatch() {
          if (!equals(lastView, ctrl.$viewValue)) {
            lastView = copy(ctrl.$viewValue);
            ctrl.$render();
          }
        });

        selectElement.on('change', function() {
          scope.$apply(function() {
            var array = [];
            forEach(selectElement.find('option'), function(option) {
              if (option.selected) {
                array.push(option.value);
              }
            });
            ctrl.$setViewValue(array);
          });
        });
      }

      function setupAsOptions(scope, selectElement, ctrl) {
        var match;

        if (! (match = optionsExp.match(NG_OPTIONS_REGEXP))) {
          throw ngOptionsMinErr('iexp',
            "Expected expression in form of " +
            "'_select_ (as _label_)? for (_key_,)?_value_ in _collection_'" +
            " but got '{0}'. Element: {1}",
            optionsExp, startingTag(selectElement));
        }

        var displayFn = $parse(match[2] || match[1]),
            valueName = match[4] || match[6],
            keyName = match[5],
            groupByFn = $parse(match[3] || ''),
            valueFn = $parse(match[2] ? match[1] : valueName),
            valuesFn = $parse(match[7]),
            track = match[8],
            trackFn = track ? $parse(match[8]) : null,
            // This is an array of array of existing option groups in DOM.
            // We try to reuse these if possible
            // - optionGroupsCache[0] is the options with no option group
            // - optionGroupsCache[?][0] is the parent: either the SELECT or OPTGROUP element
            optionGroupsCache = [[{element: selectElement, label:''}]];

        if (nullOption) {
          // compile the element since there might be bindings in it
          $compile(nullOption)(scope);

          // remove the class, which is added automatically because we recompile the element and it
          // becomes the compilation root
          nullOption.removeClass('ng-scope');

          // we need to remove it before calling selectElement.html('') because otherwise IE will
          // remove the label from the element. wtf?
          nullOption.remove();
        }

        // clear contents, we'll add what's needed based on the model
        selectElement.html('');

        selectElement.on('change', function() {
          scope.$apply(function() {
            var optionGroup,
                collection = valuesFn(scope) || [],
                locals = {},
                key, value, optionElement, index, groupIndex, length, groupLength, trackIndex;

            if (multiple) {
              value = [];
              for (groupIndex = 0, groupLength = optionGroupsCache.length;
                   groupIndex < groupLength;
                   groupIndex++) {
                // list of options for that group. (first item has the parent)
                optionGroup = optionGroupsCache[groupIndex];

                for(index = 1, length = optionGroup.length; index < length; index++) {
                  if ((optionElement = optionGroup[index].element)[0].selected) {
                    key = optionElement.val();
                    if (keyName) locals[keyName] = key;
                    if (trackFn) {
                      for (trackIndex = 0; trackIndex < collection.length; trackIndex++) {
                        locals[valueName] = collection[trackIndex];
                        if (trackFn(scope, locals) == key) break;
                      }
                    } else {
                      locals[valueName] = collection[key];
                    }
                    value.push(valueFn(scope, locals));
                  }
                }
              }
            } else {
              key = selectElement.val();
              if (key == '?') {
                value = undefined;
              } else if (key === ''){
                value = null;
              } else {
                if (trackFn) {
                  for (trackIndex = 0; trackIndex < collection.length; trackIndex++) {
                    locals[valueName] = collection[trackIndex];
                    if (trackFn(scope, locals) == key) {
                      value = valueFn(scope, locals);
                      break;
                    }
                  }
                } else {
                  locals[valueName] = collection[key];
                  if (keyName) locals[keyName] = key;
                  value = valueFn(scope, locals);
                }
              }
            }
            ctrl.$setViewValue(value);
          });
        });

        ctrl.$render = render;

        // TODO(vojta): can't we optimize this ?
        scope.$watch(render);

        function render() {
              // Temporary location for the option groups before we render them
          var optionGroups = {'':[]},
              optionGroupNames = [''],
              optionGroupName,
              optionGroup,
              option,
              existingParent, existingOptions, existingOption,
              modelValue = ctrl.$modelValue,
              values = valuesFn(scope) || [],
              keys = keyName ? sortedKeys(values) : values,
              key,
              groupLength, length,
              groupIndex, index,
              locals = {},
              selected,
              selectedSet = false, // nothing is selected yet
              lastElement,
              element,
              label;

          if (multiple) {
            if (trackFn && isArray(modelValue)) {
              selectedSet = new HashMap([]);
              for (var trackIndex = 0; trackIndex < modelValue.length; trackIndex++) {
                locals[valueName] = modelValue[trackIndex];
                selectedSet.put(trackFn(scope, locals), modelValue[trackIndex]);
              }
            } else {
              selectedSet = new HashMap(modelValue);
            }
          }

          // We now build up the list of options we need (we merge later)
          for (index = 0; length = keys.length, index < length; index++) {
            
            key = index;
            if (keyName) {
              key = keys[index];
              if ( key.charAt(0) === '$' ) continue;
              locals[keyName] = key;
            }

            locals[valueName] = values[key];

            optionGroupName = groupByFn(scope, locals) || '';
            if (!(optionGroup = optionGroups[optionGroupName])) {
              optionGroup = optionGroups[optionGroupName] = [];
              optionGroupNames.push(optionGroupName);
            }
            if (multiple) {
              selected = isDefined(
                selectedSet.remove(trackFn ? trackFn(scope, locals) : valueFn(scope, locals))
              );
            } else {
              if (trackFn) {
                var modelCast = {};
                modelCast[valueName] = modelValue;
                selected = trackFn(scope, modelCast) === trackFn(scope, locals);
              } else {
                selected = modelValue === valueFn(scope, locals);
              }
              selectedSet = selectedSet || selected; // see if at least one item is selected
            }
            label = displayFn(scope, locals); // what will be seen by the user

            // doing displayFn(scope, locals) || '' overwrites zero values
            label = isDefined(label) ? label : '';
            optionGroup.push({
              // either the index into array or key from object
              id: trackFn ? trackFn(scope, locals) : (keyName ? keys[index] : index),
              label: label,
              selected: selected                   // determine if we should be selected
            });
          }
          if (!multiple) {
            if (nullOption || modelValue === null) {
              // insert null option if we have a placeholder, or the model is null
              optionGroups[''].unshift({id:'', label:'', selected:!selectedSet});
            } else if (!selectedSet) {
              // option could not be found, we have to insert the undefined item
              optionGroups[''].unshift({id:'?', label:'', selected:true});
            }
          }

          // Now we need to update the list of DOM nodes to match the optionGroups we computed above
          for (groupIndex = 0, groupLength = optionGroupNames.length;
               groupIndex < groupLength;
               groupIndex++) {
            // current option group name or '' if no group
            optionGroupName = optionGroupNames[groupIndex];

            // list of options for that group. (first item has the parent)
            optionGroup = optionGroups[optionGroupName];

            if (optionGroupsCache.length <= groupIndex) {
              // we need to grow the optionGroups
              existingParent = {
                element: optGroupTemplate.clone().attr('label', optionGroupName),
                label: optionGroup.label
              };
              existingOptions = [existingParent];
              optionGroupsCache.push(existingOptions);
              selectElement.append(existingParent.element);
            } else {
              existingOptions = optionGroupsCache[groupIndex];
              existingParent = existingOptions[0];  // either SELECT (no group) or OPTGROUP element

              // update the OPTGROUP label if not the same.
              if (existingParent.label != optionGroupName) {
                existingParent.element.attr('label', existingParent.label = optionGroupName);
              }
            }

            lastElement = null;  // start at the beginning
            for(index = 0, length = optionGroup.length; index < length; index++) {
              option = optionGroup[index];
              if ((existingOption = existingOptions[index+1])) {
                // reuse elements
                lastElement = existingOption.element;
                if (existingOption.label !== option.label) {
                  lastElement.text(existingOption.label = option.label);
                }
                if (existingOption.id !== option.id) {
                  lastElement.val(existingOption.id = option.id);
                }
                // lastElement.prop('selected') provided by jQuery has side-effects
                if (lastElement[0].selected !== option.selected) {
                  lastElement.prop('selected', (existingOption.selected = option.selected));
                }
              } else {
                // grow elements

                // if it's a null option
                if (option.id === '' && nullOption) {
                  // put back the pre-compiled element
                  element = nullOption;
                } else {
                  // jQuery(v1.4.2) Bug: We should be able to chain the method calls, but
                  // in this version of jQuery on some browser the .text() returns a string
                  // rather then the element.
                  (element = optionTemplate.clone())
                      .val(option.id)
                      .attr('selected', option.selected)
                      .text(option.label);
                }

                existingOptions.push(existingOption = {
                    element: element,
                    label: option.label,
                    id: option.id,
                    selected: option.selected
                });
                if (lastElement) {
                  lastElement.after(element);
                } else {
                  existingParent.element.append(element);
                }
                lastElement = element;
              }
            }
            // remove any excessive OPTIONs in a group
            index++; // increment since the existingOptions[0] is parent element not OPTION
            while(existingOptions.length > index) {
              existingOptions.pop().element.remove();
            }
          }
          // remove any excessive OPTGROUPs from select
          while(optionGroupsCache.length > groupIndex) {
            optionGroupsCache.pop()[0].element.remove();
          }
        }
      }
    }
  };
}];

var optionDirective = ['$interpolate', function($interpolate) {
  var nullSelectCtrl = {
    addOption: noop,
    removeOption: noop
  };

  return {
    restrict: 'E',
    priority: 100,
    compile: function(element, attr) {
      if (isUndefined(attr.value)) {
        var interpolateFn = $interpolate(element.text(), true);
        if (!interpolateFn) {
          attr.$set('value', element.text());
        }
      }

      return function (scope, element, attr) {
        var selectCtrlName = '$selectController',
            parent = element.parent(),
            selectCtrl = parent.data(selectCtrlName) ||
              parent.parent().data(selectCtrlName); // in case we are in optgroup

        if (selectCtrl && selectCtrl.databound) {
          // For some reason Opera defaults to true and if not overridden this messes up the repeater.
          // We don't want the view to drive the initialization of the model anyway.
          element.prop('selected', false);
        } else {
          selectCtrl = nullSelectCtrl;
        }

        if (interpolateFn) {
          scope.$watch(interpolateFn, function interpolateWatchAction(newVal, oldVal) {
            attr.$set('value', newVal);
            if (newVal !== oldVal) selectCtrl.removeOption(oldVal);
            selectCtrl.addOption(newVal);
          });
        } else {
          selectCtrl.addOption(attr.value);
        }

        element.on('$destroy', function() {
          selectCtrl.removeOption(attr.value);
        });
      };
    }
  };
}];

var styleDirective = valueFn({
  restrict: 'E',
  terminal: true
});

  //try to bind to jquery now so that one can write angular.element().read()
  //but we will rebind on bootstrap again.
  bindJQuery();

  publishExternalAPI(angular);

  jqLite(document).ready(function() {
    angularInit(document, bootstrap);
  });

})(window, document);

!angular.$$csp() && angular.element(document).find('head').prepend('<style type="text/css">@charset "UTF-8";[ng\\:cloak],[ng-cloak],[data-ng-cloak],[x-ng-cloak],.ng-cloak,.x-ng-cloak,.ng-hide{display:none !important;}ng\\:form{display:block;}.ng-animate-start{clip:rect(0,auto,auto,0);-ms-zoom:1.0001;}.ng-animate-active{clip:rect(-1px,auto,auto,0);-ms-zoom:1;}</style>');;
/**
 * @license AngularJS v1.2.1
 * (c) 2010-2012 Google, Inc. http://angularjs.org
 * License: MIT
 */
(function(window, angular, undefined) {'use strict';

/* jshint maxlen: false */

/**
 * @ngdoc overview
 * @name ngAnimate
 * @description
 *
 * # ngAnimate
 *
 * The `ngAnimate` module provides support for JavaScript, CSS3 transition and CSS3 keyframe animation hooks within existing core and custom directives.
 *
 * {@installModule animate}
 *
 * <div doc-module-components="ngAnimate"></div>
 *
 * # Usage
 *
 * To see animations in action, all that is required is to define the appropriate CSS classes
 * or to register a JavaScript animation via the myModule.animation() function. The directives that support animation automatically are:
 * `ngRepeat`, `ngInclude`, `ngIf`, `ngSwitch`, `ngShow`, `ngHide`, `ngView` and `ngClass`. Custom directives can take advantage of animation
 * by using the `$animate` service.
 *
 * Below is a more detailed breakdown of the supported animation events provided by pre-existing ng directives:
 *
 * | Directive                                                 | Supported Animations                               |
 * |---------------------------------------------------------- |----------------------------------------------------|
 * | {@link ng.directive:ngRepeat#usage_animations ngRepeat}         | enter, leave and move                              |
 * | {@link ngRoute.directive:ngView#usage_animations ngView}        | enter and leave                                    |
 * | {@link ng.directive:ngInclude#usage_animations ngInclude}       | enter and leave                                    |
 * | {@link ng.directive:ngSwitch#usage_animations ngSwitch}         | enter and leave                                    |
 * | {@link ng.directive:ngIf#usage_animations ngIf}                 | enter and leave                                    |
 * | {@link ng.directive:ngClass#usage_animations ngClass}           | add and remove                                     |
 * | {@link ng.directive:ngShow#usage_animations ngShow & ngHide}    | add and remove (the ng-hide class value)           |
 *
 * You can find out more information about animations upon visiting each directive page.
 *
 * Below is an example of how to apply animations to a directive that supports animation hooks:
 *
 * <pre>
 * <style type="text/css">
 * .slide.ng-enter, .slide.ng-leave {
 *   -webkit-transition:0.5s linear all;
 *   transition:0.5s linear all;
 * }
 *
 * .slide.ng-enter { }        /&#42; starting animations for enter &#42;/
 * .slide.ng-enter-active { } /&#42; terminal animations for enter &#42;/
 * .slide.ng-leave { }        /&#42; starting animations for leave &#42;/
 * .slide.ng-leave-active { } /&#42; terminal animations for leave &#42;/
 * </style>
 *
 * <!--
 * the animate service will automatically add .ng-enter and .ng-leave to the element
 * to trigger the CSS transition/animations
 * -->
 * <ANY class="slide" ng-include="..."></ANY>
 * </pre>
 *
 * Keep in mind that if an animation is running, any child elements cannot be animated until the parent element's
 * animation has completed.
 *
 * <h2>CSS-defined Animations</h2>
 * The animate service will automatically apply two CSS classes to the animated element and these two CSS classes
 * are designed to contain the start and end CSS styling. Both CSS transitions and keyframe animations are supported
 * and can be used to play along with this naming structure.
 *
 * The following code below demonstrates how to perform animations using **CSS transitions** with Angular:
 *
 * <pre>
 * <style type="text/css">
 * /&#42;
 *  The animate class is apart of the element and the ng-enter class
 *  is attached to the element once the enter animation event is triggered
 * &#42;/
 * .reveal-animation.ng-enter {
 *  -webkit-transition: 1s linear all; /&#42; Safari/Chrome &#42;/
 *  transition: 1s linear all; /&#42; All other modern browsers and IE10+ &#42;/
 *
 *  /&#42; The animation preparation code &#42;/
 *  opacity: 0;
 * }
 *
 * /&#42;
 *  Keep in mind that you want to combine both CSS
 *  classes together to avoid any CSS-specificity
 *  conflicts
 * &#42;/
 * .reveal-animation.ng-enter.ng-enter-active {
 *  /&#42; The animation code itself &#42;/
 *  opacity: 1;
 * }
 * </style>
 *
 * <div class="view-container">
 *   <div ng-view class="reveal-animation"></div>
 * </div>
 * </pre>
 *
 * The following code below demonstrates how to perform animations using **CSS animations** with Angular:
 *
 * <pre>
 * <style type="text/css">
 * .reveal-animation.ng-enter {
 *   -webkit-animation: enter_sequence 1s linear; /&#42; Safari/Chrome &#42;/
 *   animation: enter_sequence 1s linear; /&#42; IE10+ and Future Browsers &#42;/
 * }
 * &#64-webkit-keyframes enter_sequence {
 *   from { opacity:0; }
 *   to { opacity:1; }
 * }
 * &#64keyframes enter_sequence {
 *   from { opacity:0; }
 *   to { opacity:1; }
 * }
 * </style>
 *
 * <div class="view-container">
 *   <div ng-view class="reveal-animation"></div>
 * </div>
 * </pre>
 *
 * Both CSS3 animations and transitions can be used together and the animate service will figure out the correct duration and delay timing.
 *
 * Upon DOM mutation, the event class is added first (something like `ng-enter`), then the browser prepares itself to add
 * the active class (in this case `ng-enter-active`) which then triggers the animation. The animation module will automatically
 * detect the CSS code to determine when the animation ends. Once the animation is over then both CSS classes will be
 * removed from the DOM. If a browser does not support CSS transitions or CSS animations then the animation will start and end
 * immediately resulting in a DOM element that is at its final state. This final state is when the DOM element
 * has no CSS transition/animation classes applied to it.
 *
 * <h3>CSS Staggering Animations</h3>
 * A Staggering animation is a collection of animations that are issued with a slight delay in between each successive operation resulting in a
 * curtain-like effect. The ngAnimate module, as of 1.2.0, supports staggering animations and the stagger effect can be
 * performed by creating a **ng-EVENT-stagger** CSS class and attaching that class to the base CSS class used for
 * the animation. The style property expected within the stagger class can either be a **transition-delay** or an
 * **animation-delay** property (or both if your animation contains both transitions and keyframe animations).
 *
 * <pre>
 * .my-animation.ng-enter {
 *   /&#42; standard transition code &#42;/
 *   -webkit-transition: 1s linear all;
 *   transition: 1s linear all;
 *   opacity:0;
 * }
 * .my-animation.ng-enter-stagger {
 *   /&#42; this will have a 100ms delay between each successive leave animation &#42;/
 *   -webkit-transition-delay: 0.1s;
 *   transition-delay: 0.1s;
 *
 *   /&#42; in case the stagger doesn't work then these two values
 *    must be set to 0 to avoid an accidental CSS inheritance &#42;/
 *   -webkit-transition-duration: 0s;
 *   transition-duration: 0s;
 * }
 * .my-animation.ng-enter.ng-enter-active {
 *   /&#42; standard transition styles &#42;/
 *   opacity:1;
 * }
 * </pre>
 *
 * Staggering animations work by default in ngRepeat (so long as the CSS class is defiend). Outside of ngRepeat, to use staggering animations
 * on your own, they can be triggered by firing multiple calls to the same event on $animate. However, the restrictions surrounding this
 * are that each of the elements must have the same CSS className value as well as the same parent element. A stagger operation
 * will also be reset if more than 10ms has passed after the last animation has been fired.
 *
 * The following code will issue the **ng-leave-stagger** event on the element provided:
 *
 * <pre>
 * var kids = parent.children();
 *
 * $animate.leave(kids[0]); //stagger index=0
 * $animate.leave(kids[1]); //stagger index=1
 * $animate.leave(kids[2]); //stagger index=2
 * $animate.leave(kids[3]); //stagger index=3
 * $animate.leave(kids[4]); //stagger index=4
 *
 * $timeout(function() {
 *   //stagger has reset itself
 *   $animate.leave(kids[5]); //stagger index=0
 *   $animate.leave(kids[6]); //stagger index=1
 * }, 100, false);
 * </pre>
 *
 * Stagger animations are currently only supported within CSS-defined animations.
 *
 * <h2>JavaScript-defined Animations</h2>
 * In the event that you do not want to use CSS3 transitions or CSS3 animations or if you wish to offer animations on browsers that do not
 * yet support CSS transitions/animations, then you can make use of JavaScript animations defined inside of your AngularJS module.
 *
 * <pre>
 * //!annotate="YourApp" Your AngularJS Module|Replace this or ngModule with the module that you used to define your application.
 * var ngModule = angular.module('YourApp', []);
 * ngModule.animation('.my-crazy-animation', function() {
 *   return {
 *     enter: function(element, done) {
 *       //run the animation here and call done when the animation is complete
 *       return function(cancelled) {
 *         //this (optional) function will be called when the animation
 *         //completes or when the animation is cancelled (the cancelled
 *         //flag will be set to true if cancelled).
 *       }
 *     }
 *     leave: function(element, done) { },
 *     move: function(element, done) { },
 *
 *     //animation that can be triggered before the class is added
 *     beforeAddClass: function(element, className, done) { },
 *
 *     //animation that can be triggered after the class is added
 *     addClass: function(element, className, done) { },
 *
 *     //animation that can be triggered before the class is removed
 *     beforeRemoveClass: function(element, className, done) { },
 *
 *     //animation that can be triggered after the class is removed
 *     removeClass: function(element, className, done) { }
 *   }
 * });
 * </pre>
 *
 * JavaScript-defined animations are created with a CSS-like class selector and a collection of events which are set to run
 * a javascript callback function. When an animation is triggered, $animate will look for a matching animation which fits
 * the element's CSS class attribute value and then run the matching animation event function (if found).
 * In other words, if the CSS classes present on the animated element match any of the JavaScript animations then the callback function
 * be executed. It should be also noted that only simple, single class selectors are allowed (compound class selectors are not supported).
 *
 * Within a JavaScript animation, an object containing various event callback animation functions is expected to be returned.
 * As explained above, these callbacks are triggered based on the animation event. Therefore if an enter animation is run,
 * and the JavaScript animation is found, then the enter callback will handle that animation (in addition to the CSS keyframe animation
 * or transition code that is defined via a stylesheet).
 *
 */

angular.module('ngAnimate', ['ng'])

  /**
   * @ngdoc object
   * @name ngAnimate.$animateProvider
   * @description
   *
   * The `$animateProvider` allows developers to register JavaScript animation event handlers directly inside of a module.
   * When an animation is triggered, the $animate service will query the $animate service to find any animations that match
   * the provided name value.
   *
   * Requires the {@link ngAnimate `ngAnimate`} module to be installed.
   *
   * Please visit the {@link ngAnimate `ngAnimate`} module overview page learn more about how to use animations in your application.
   *
   */
  .config(['$provide', '$animateProvider', function($provide, $animateProvider) {
    var noop = angular.noop;
    var forEach = angular.forEach;
    var selectors = $animateProvider.$$selectors;

    var ELEMENT_NODE = 1;
    var NG_ANIMATE_STATE = '$$ngAnimateState';
    var NG_ANIMATE_CLASS_NAME = 'ng-animate';
    var rootAnimateState = {running: true};

    $provide.decorator('$animate', ['$delegate', '$injector', '$sniffer', '$rootElement', '$timeout', '$rootScope', '$document',
                            function($delegate,   $injector,   $sniffer,   $rootElement,   $timeout,   $rootScope,   $document) {

      $rootElement.data(NG_ANIMATE_STATE, rootAnimateState);

      // disable animations during bootstrap, but once we bootstrapped, enable animations
      $rootScope.$$postDigest(function() {
        rootAnimateState.running = false;
      });

      function lookup(name) {
        if (name) {
          var matches = [],
              flagMap = {},
              classes = name.substr(1).split('.');

          //the empty string value is the default animation
          //operation which performs CSS transition and keyframe
          //animations sniffing. This is always included for each
          //element animation procedure if the browser supports
          //transitions and/or keyframe animations
          if ($sniffer.transitions || $sniffer.animations) {
            classes.push('');
          }

          for(var i=0; i < classes.length; i++) {
            var klass = classes[i],
                selectorFactoryName = selectors[klass];
            if(selectorFactoryName && !flagMap[klass]) {
              matches.push($injector.get(selectorFactoryName));
              flagMap[klass] = true;
            }
          }
          return matches;
        }
      }

      /**
       * @ngdoc object
       * @name ngAnimate.$animate
       * @function
       *
       * @description
       * The `$animate` service provides animation detection support while performing DOM operations (enter, leave and move) as well as during addClass and removeClass operations.
       * When any of these operations are run, the $animate service
       * will examine any JavaScript-defined animations (which are defined by using the $animateProvider provider object)
       * as well as any CSS-defined animations against the CSS classes present on the element once the DOM operation is run.
       *
       * The `$animate` service is used behind the scenes with pre-existing directives and animation with these directives
       * will work out of the box without any extra configuration.
       *
       * Requires the {@link ngAnimate `ngAnimate`} module to be installed.
       *
       * Please visit the {@link ngAnimate `ngAnimate`} module overview page learn more about how to use animations in your application.
       *
       */
      return {
        /**
         * @ngdoc function
         * @name ngAnimate.$animate#enter
         * @methodOf ngAnimate.$animate
         * @function
         *
         * @description
         * Appends the element to the parentElement element that resides in the document and then runs the enter animation. Once
         * the animation is started, the following CSS classes will be present on the element for the duration of the animation:
         *
         * Below is a breakdown of each step that occurs during enter animation:
         *
         * | Animation Step                                                                               | What the element class attribute looks like |
         * |----------------------------------------------------------------------------------------------|---------------------------------------------|
         * | 1. $animate.enter(...) is called                                                             | class="my-animation"                        |
         * | 2. element is inserted into the parentElement element or beside the afterElement element     | class="my-animation"                        |
         * | 3. $animate runs any JavaScript-defined animations on the element                            | class="my-animation ng-animate"             |
         * | 4. the .ng-enter class is added to the element                                               | class="my-animation ng-animate ng-enter"    |
         * | 5. $animate scans the element styles to get the CSS transition/animation duration and delay  | class="my-animation ng-animate ng-enter"    |
         * | 6. $animate waits for 10ms (this performs a reflow)                                          | class="my-animation ng-animate ng-enter"    |
         * | 7. the .ng-enter-active and .ng-animate-active classes are added (this triggers the CSS transition/animation) | class="my-animation ng-animate ng-animate-active ng-enter ng-enter-active" |
         * | 8. $animate waits for X milliseconds for the animation to complete                           | class="my-animation ng-animate ng-animate-active ng-enter ng-enter-active" |
         * | 9. The animation ends and all generated CSS classes are removed from the element             | class="my-animation"                        |
         * | 10. The doneCallback() callback is fired (if provided)                                       | class="my-animation"                        |
         *
         * @param {jQuery/jqLite element} element the element that will be the focus of the enter animation
         * @param {jQuery/jqLite element} parentElement the parent element of the element that will be the focus of the enter animation
         * @param {jQuery/jqLite element} afterElement the sibling element (which is the previous element) of the element that will be the focus of the enter animation
         * @param {function()=} doneCallback the callback function that will be called once the animation is complete
        */
        enter : function(element, parentElement, afterElement, doneCallback) {
          this.enabled(false, element);
          $delegate.enter(element, parentElement, afterElement);
          $rootScope.$$postDigest(function() {
            performAnimation('enter', 'ng-enter', element, parentElement, afterElement, noop, doneCallback);
          });
        },

        /**
         * @ngdoc function
         * @name ngAnimate.$animate#leave
         * @methodOf ngAnimate.$animate
         * @function
         *
         * @description
         * Runs the leave animation operation and, upon completion, removes the element from the DOM. Once
         * the animation is started, the following CSS classes will be added for the duration of the animation:
         *
         * Below is a breakdown of each step that occurs during enter animation:
         *
         * | Animation Step                                                                               | What the element class attribute looks like |
         * |----------------------------------------------------------------------------------------------|---------------------------------------------|
         * | 1. $animate.leave(...) is called                                                             | class="my-animation"                        |
         * | 2. $animate runs any JavaScript-defined animations on the element                            | class="my-animation ng-animate"             |
         * | 3. the .ng-leave class is added to the element                                               | class="my-animation ng-animate ng-leave"    |
         * | 4. $animate scans the element styles to get the CSS transition/animation duration and delay  | class="my-animation ng-animate ng-leave"    |
         * | 5. $animate waits for 10ms (this performs a reflow)                                          | class="my-animation ng-animate ng-leave"    |
         * | 6. the .ng-leave-active and .ng-animate-active classes is added (this triggers the CSS transition/animation) | class="my-animation ng-animate ng-animate-active ng-leave ng-leave-active" |
         * | 7. $animate waits for X milliseconds for the animation to complete                           | class="my-animation ng-animate ng-animate-active ng-leave ng-leave-active" |
         * | 8. The animation ends and all generated CSS classes are removed from the element             | class="my-animation"                        |
         * | 9. The element is removed from the DOM                                                       | ...                                         |
         * | 10. The doneCallback() callback is fired (if provided)                                       | ...                                         |
         *
         * @param {jQuery/jqLite element} element the element that will be the focus of the leave animation
         * @param {function()=} doneCallback the callback function that will be called once the animation is complete
        */
        leave : function(element, doneCallback) {
          cancelChildAnimations(element);
          this.enabled(false, element);
          $rootScope.$$postDigest(function() {
            performAnimation('leave', 'ng-leave', element, null, null, function() {
              $delegate.leave(element);
            }, doneCallback);
          });
        },

        /**
         * @ngdoc function
         * @name ngAnimate.$animate#move
         * @methodOf ngAnimate.$animate
         * @function
         *
         * @description
         * Fires the move DOM operation. Just before the animation starts, the animate service will either append it into the parentElement container or
         * add the element directly after the afterElement element if present. Then the move animation will be run. Once
         * the animation is started, the following CSS classes will be added for the duration of the animation:
         *
         * Below is a breakdown of each step that occurs during move animation:
         *
         * | Animation Step                                                                               | What the element class attribute looks like |
         * |----------------------------------------------------------------------------------------------|---------------------------------------------|
         * | 1. $animate.move(...) is called                                                              | class="my-animation"                        |
         * | 2. element is moved into the parentElement element or beside the afterElement element        | class="my-animation"                        |
         * | 3. $animate runs any JavaScript-defined animations on the element                            | class="my-animation ng-animate"             |
         * | 4. the .ng-move class is added to the element                                                | class="my-animation ng-animate ng-move"     |
         * | 5. $animate scans the element styles to get the CSS transition/animation duration and delay  | class="my-animation ng-animate ng-move"     |
         * | 6. $animate waits for 10ms (this performs a reflow)                                          | class="my-animation ng-animate ng-move"     |
         * | 7. the .ng-move-active and .ng-animate-active classes is added (this triggers the CSS transition/animation) | class="my-animation ng-animate ng-animate-active ng-move ng-move-active" |
         * | 8. $animate waits for X milliseconds for the animation to complete                           | class="my-animation ng-animate ng-animate-active ng-move ng-move-active" |
         * | 9. The animation ends and all generated CSS classes are removed from the element             | class="my-animation"                        |
         * | 10. The doneCallback() callback is fired (if provided)                                       | class="my-animation"                        |
         *
         * @param {jQuery/jqLite element} element the element that will be the focus of the move animation
         * @param {jQuery/jqLite element} parentElement the parentElement element of the element that will be the focus of the move animation
         * @param {jQuery/jqLite element} afterElement the sibling element (which is the previous element) of the element that will be the focus of the move animation
         * @param {function()=} doneCallback the callback function that will be called once the animation is complete
        */
        move : function(element, parentElement, afterElement, doneCallback) {
          cancelChildAnimations(element);
          this.enabled(false, element);
          $delegate.move(element, parentElement, afterElement);
          $rootScope.$$postDigest(function() {
            performAnimation('move', 'ng-move', element, parentElement, afterElement, noop, doneCallback);
          });
        },

        /**
         * @ngdoc function
         * @name ngAnimate.$animate#addClass
         * @methodOf ngAnimate.$animate
         *
         * @description
         * Triggers a custom animation event based off the className variable and then attaches the className value to the element as a CSS class.
         * Unlike the other animation methods, the animate service will suffix the className value with {@type -add} in order to provide
         * the animate service the setup and active CSS classes in order to trigger the animation (this will be skipped if no CSS transitions
         * or keyframes are defined on the -add or base CSS class).
         *
         * Below is a breakdown of each step that occurs during addClass animation:
         *
         * | Animation Step                                                                                 | What the element class attribute looks like |
         * |------------------------------------------------------------------------------------------------|---------------------------------------------|
         * | 1. $animate.addClass(element, 'super') is called                                               | class="my-animation"                        |
         * | 2. $animate runs any JavaScript-defined animations on the element                              | class="my-animation ng-animate"             |
         * | 3. the .super-add class are added to the element                                               | class="my-animation ng-animate super-add"   |
         * | 4. $animate scans the element styles to get the CSS transition/animation duration and delay    | class="my-animation ng-animate super-add"   |
         * | 5. $animate waits for 10ms (this performs a reflow)                                            | class="my-animation ng-animate super-add"   |
         * | 6. the .super, .super-add-active and .ng-animate-active classes are added (this triggers the CSS transition/animation) | class="my-animation ng-animate ng-animate-active super super-add super-add-active"          |
         * | 7. $animate waits for X milliseconds for the animation to complete                             | class="my-animation super-add super-add-active"  |
         * | 8. The animation ends and all generated CSS classes are removed from the element               | class="my-animation super"                  |
         * | 9. The super class is kept on the element                                                      | class="my-animation super"                  |
         * | 10. The doneCallback() callback is fired (if provided)                                         | class="my-animation super"                  |
         *
         * @param {jQuery/jqLite element} element the element that will be animated
         * @param {string} className the CSS class that will be added to the element and then animated
         * @param {function()=} doneCallback the callback function that will be called once the animation is complete
        */
        addClass : function(element, className, doneCallback) {
          performAnimation('addClass', className, element, null, null, function() {
            $delegate.addClass(element, className);
          }, doneCallback);
        },

        /**
         * @ngdoc function
         * @name ngAnimate.$animate#removeClass
         * @methodOf ngAnimate.$animate
         *
         * @description
         * Triggers a custom animation event based off the className variable and then removes the CSS class provided by the className value
         * from the element. Unlike the other animation methods, the animate service will suffix the className value with {@type -remove} in
         * order to provide the animate service the setup and active CSS classes in order to trigger the animation (this will be skipped if
         * no CSS transitions or keyframes are defined on the -remove or base CSS classes).
         *
         * Below is a breakdown of each step that occurs during removeClass animation:
         *
         * | Animation Step                                                                                | What the element class attribute looks like     |
         * |-----------------------------------------------------------------------------------------------|---------------------------------------------|
         * | 1. $animate.removeClass(element, 'super') is called                                           | class="my-animation super"                  |
         * | 2. $animate runs any JavaScript-defined animations on the element                             | class="my-animation super ng-animate"       |
         * | 3. the .super-remove class are added to the element                                           | class="my-animation super ng-animate super-remove"|
         * | 4. $animate scans the element styles to get the CSS transition/animation duration and delay   | class="my-animation super ng-animate super-remove"   |
         * | 5. $animate waits for 10ms (this performs a reflow)                                           | class="my-animation super ng-animate super-remove"   |
         * | 6. the .super-remove-active and .ng-animate-active classes are added and .super is removed (this triggers the CSS transition/animation) | class="my-animation ng-animate ng-animate-active super-remove super-remove-active"          |
         * | 7. $animate waits for X milliseconds for the animation to complete                            | class="my-animation ng-animate ng-animate-active super-remove super-remove-active"   |
         * | 8. The animation ends and all generated CSS classes are removed from the element              | class="my-animation"                        |
         * | 9. The doneCallback() callback is fired (if provided)                                         | class="my-animation"                        |
         *
         *
         * @param {jQuery/jqLite element} element the element that will be animated
         * @param {string} className the CSS class that will be animated and then removed from the element
         * @param {function()=} doneCallback the callback function that will be called once the animation is complete
        */
        removeClass : function(element, className, doneCallback) {
          performAnimation('removeClass', className, element, null, null, function() {
            $delegate.removeClass(element, className);
          }, doneCallback);
        },

        /**
         * @ngdoc function
         * @name ngAnimate.$animate#enabled
         * @methodOf ngAnimate.$animate
         * @function
         *
         * @param {boolean=} value If provided then set the animation on or off.
         * @return {boolean} Current animation state.
         *
         * @description
         * Globally enables/disables animations.
         *
        */
        enabled : function(value, element) {
          switch(arguments.length) {
            case 2:
              if(value) {
                cleanup(element);
              } else {
                var data = element.data(NG_ANIMATE_STATE) || {};
                data.disabled = true;
                element.data(NG_ANIMATE_STATE, data);
              }
            break;

            case 1:
              rootAnimateState.disabled = !value;
            break;

            default:
              value = !rootAnimateState.disabled;
            break;
          }
          return !!value;
         }
      };

      /*
        all animations call this shared animation triggering function internally.
        The animationEvent variable refers to the JavaScript animation event that will be triggered
        and the className value is the name of the animation that will be applied within the
        CSS code. Element, parentElement and afterElement are provided DOM elements for the animation
        and the onComplete callback will be fired once the animation is fully complete.
      */
      function performAnimation(animationEvent, className, element, parentElement, afterElement, domOperation, doneCallback) {
        var classes = (element.attr('class') || '') + ' ' + className;
        var animationLookup = (' ' + classes).replace(/\s+/g,'.');
        if (!parentElement) {
          parentElement = afterElement ? afterElement.parent() : element.parent();
        }

        var matches = lookup(animationLookup);
        var isClassBased = animationEvent == 'addClass' || animationEvent == 'removeClass';
        var ngAnimateState = element.data(NG_ANIMATE_STATE) || {};

        //skip the animation if animations are disabled, a parent is already being animated,
        //the element is not currently attached to the document body or then completely close
        //the animation if any matching animations are not found at all.
        //NOTE: IE8 + IE9 should close properly (run closeAnimation()) in case a NO animation is not found.
        if (animationsDisabled(element, parentElement) || matches.length === 0) {
          domOperation();
          closeAnimation();
          return;
        }

        var animations = [];
        //only add animations if the currently running animation is not structural
        //or if there is no animation running at all
        if(!ngAnimateState.running || !(isClassBased && ngAnimateState.structural)) {
          forEach(matches, function(animation) {
            //add the animation to the queue to if it is allowed to be cancelled
            if(!animation.allowCancel || animation.allowCancel(element, animationEvent, className)) {
              var beforeFn, afterFn = animation[animationEvent];

              //Special case for a leave animation since there is no point in performing an
              //animation on a element node that has already been removed from the DOM
              if(animationEvent == 'leave') {
                beforeFn = afterFn;
                afterFn = null; //this must be falsy so that the animation is skipped for leave
              } else {
                beforeFn = animation['before' + animationEvent.charAt(0).toUpperCase() + animationEvent.substr(1)];
              }
              animations.push({
                before : beforeFn,
                after : afterFn
              });
            }
          });
        }

        //this would mean that an animation was not allowed so let the existing
        //animation do it's thing and close this one early
        if(animations.length === 0) {
          domOperation();
          fireDoneCallbackAsync();
          return;
        }

        if(ngAnimateState.running) {
          //if an animation is currently running on the element then lets take the steps
          //to cancel that animation and fire any required callbacks
          $timeout.cancel(ngAnimateState.closeAnimationTimeout);
          cleanup(element);
          cancelAnimations(ngAnimateState.animations);
          (ngAnimateState.done || noop)(true);
        }

        //There is no point in perform a class-based animation if the element already contains
        //(on addClass) or doesn't contain (on removeClass) the className being animated.
        //The reason why this is being called after the previous animations are cancelled
        //is so that the CSS classes present on the element can be properly examined.
        if((animationEvent == 'addClass'    && element.hasClass(className)) ||
           (animationEvent == 'removeClass' && !element.hasClass(className))) {
          domOperation();
          fireDoneCallbackAsync();
          return;
        }

        //the ng-animate class does nothing, but it's here to allow for
        //parent animations to find and cancel child animations when needed
        element.addClass(NG_ANIMATE_CLASS_NAME);

        element.data(NG_ANIMATE_STATE, {
          running:true,
          structural:!isClassBased,
          animations:animations,
          done:onBeforeAnimationsComplete
        });

        //first we run the before animations and when all of those are complete
        //then we perform the DOM operation and run the next set of animations
        invokeRegisteredAnimationFns(animations, 'before', onBeforeAnimationsComplete);

        function onBeforeAnimationsComplete(cancelled) {
          domOperation();
          if(cancelled === true) {
            closeAnimation();
            return;
          }

          //set the done function to the final done function
          //so that the DOM event won't be executed twice by accident
          //if the after animation is cancelled as well
          var data = element.data(NG_ANIMATE_STATE);
          if(data) {
            data.done = closeAnimation;
            element.data(NG_ANIMATE_STATE, data);
          }
          invokeRegisteredAnimationFns(animations, 'after', closeAnimation);
        }

        function invokeRegisteredAnimationFns(animations, phase, allAnimationFnsComplete) {
          var endFnName = phase + 'End';
          forEach(animations, function(animation, index) {
            var animationPhaseCompleted = function() {
              progress(index, phase);
            };

            //there are no before functions for enter + move since the DOM
            //operations happen before the performAnimation method fires
            if(phase == 'before' && (animationEvent == 'enter' || animationEvent == 'move')) {
              animationPhaseCompleted();
              return;
            }

            if(animation[phase]) {
              animation[endFnName] = isClassBased ?
                animation[phase](element, className, animationPhaseCompleted) :
                animation[phase](element, animationPhaseCompleted);
            } else {
              animationPhaseCompleted();
            }
          });

          function progress(index, phase) {
            var phaseCompletionFlag = phase + 'Complete';
            var currentAnimation = animations[index];
            currentAnimation[phaseCompletionFlag] = true;
            (currentAnimation[endFnName] || noop)();

            for(var i=0;i<animations.length;i++) {
              if(!animations[i][phaseCompletionFlag]) return;
            }

            allAnimationFnsComplete();
          }
        }

        function fireDoneCallbackAsync() {
          doneCallback && $timeout(doneCallback, 0, false);
        }

        function closeAnimation() {
          if(!closeAnimation.hasBeenRun) {
            closeAnimation.hasBeenRun = true;
            var data = element.data(NG_ANIMATE_STATE);
            if(data) {
              /* only structural animations wait for reflow before removing an
                 animation, but class-based animations don't. An example of this
                 failing would be when a parent HTML tag has a ng-class attribute
                 causing ALL directives below to skip animations during the digest */
              if(isClassBased) {
                cleanup(element);
              } else {
                data.closeAnimationTimeout = $timeout(function() {
                  cleanup(element);
                }, 0, false);
                element.data(NG_ANIMATE_STATE, data);
              }
            }
            fireDoneCallbackAsync();
          }
        }
      }

      function cancelChildAnimations(element) {
        var node = element[0];
        if(node.nodeType != ELEMENT_NODE) {
          return;
        }

        forEach(node.querySelectorAll('.' + NG_ANIMATE_CLASS_NAME), function(element) {
          element = angular.element(element);
          var data = element.data(NG_ANIMATE_STATE);
          if(data) {
            cancelAnimations(data.animations);
            cleanup(element);
          }
        });
      }

      function cancelAnimations(animations) {
        var isCancelledFlag = true;
        forEach(animations, function(animation) {
          if(!animations['beforeComplete']) {
            (animation.beforeEnd || noop)(isCancelledFlag);
          }
          if(!animations['afterComplete']) {
            (animation.afterEnd || noop)(isCancelledFlag);
          }
        });
      }

      function cleanup(element) {
        if(element[0] == $rootElement[0]) {
          if(!rootAnimateState.disabled) {
            rootAnimateState.running = false;
            rootAnimateState.structural = false;
          }
        } else {
          element.removeClass(NG_ANIMATE_CLASS_NAME);
          element.removeData(NG_ANIMATE_STATE);
        }
      }

      function animationsDisabled(element, parentElement) {
        if (rootAnimateState.disabled) return true;

        if(element[0] == $rootElement[0]) {
          return rootAnimateState.disabled || rootAnimateState.running;
        }

        do {
          //the element did not reach the root element which means that it
          //is not apart of the DOM. Therefore there is no reason to do
          //any animations on it
          if(parentElement.length === 0) break;

          var isRoot = parentElement[0] == $rootElement[0];
          var state = isRoot ? rootAnimateState : parentElement.data(NG_ANIMATE_STATE);
          var result = state && (!!state.disabled || !!state.running);
          if(isRoot || result) {
            return result;
          }

          if(isRoot) return true;
        }
        while(parentElement = parentElement.parent());

        return true;
      }
    }]);

    $animateProvider.register('', ['$window', '$sniffer', '$timeout', function($window, $sniffer, $timeout) {
      // Detect proper transitionend/animationend event names.
      var CSS_PREFIX = '', TRANSITION_PROP, TRANSITIONEND_EVENT, ANIMATION_PROP, ANIMATIONEND_EVENT;

      // If unprefixed events are not supported but webkit-prefixed are, use the latter.
      // Otherwise, just use W3C names, browsers not supporting them at all will just ignore them.
      // Note: Chrome implements `window.onwebkitanimationend` and doesn't implement `window.onanimationend`
      // but at the same time dispatches the `animationend` event and not `webkitAnimationEnd`.
      // Register both events in case `window.onanimationend` is not supported because of that,
      // do the same for `transitionend` as Safari is likely to exhibit similar behavior.
      // Also, the only modern browser that uses vendor prefixes for transitions/keyframes is webkit
      // therefore there is no reason to test anymore for other vendor prefixes: http://caniuse.com/#search=transition
      if (window.ontransitionend === undefined && window.onwebkittransitionend !== undefined) {
        CSS_PREFIX = '-webkit-';
        TRANSITION_PROP = 'WebkitTransition';
        TRANSITIONEND_EVENT = 'webkitTransitionEnd transitionend';
      } else {
        TRANSITION_PROP = 'transition';
        TRANSITIONEND_EVENT = 'transitionend';
      }

      if (window.onanimationend === undefined && window.onwebkitanimationend !== undefined) {
        CSS_PREFIX = '-webkit-';
        ANIMATION_PROP = 'WebkitAnimation';
        ANIMATIONEND_EVENT = 'webkitAnimationEnd animationend';
      } else {
        ANIMATION_PROP = 'animation';
        ANIMATIONEND_EVENT = 'animationend';
      }

      var DURATION_KEY = 'Duration';
      var PROPERTY_KEY = 'Property';
      var DELAY_KEY = 'Delay';
      var ANIMATION_ITERATION_COUNT_KEY = 'IterationCount';
      var NG_ANIMATE_PARENT_KEY = '$$ngAnimateKey';
      var NG_ANIMATE_CSS_DATA_KEY = '$$ngAnimateCSS3Data';
      var NG_ANIMATE_FALLBACK_CLASS_NAME = 'ng-animate-start';
      var NG_ANIMATE_FALLBACK_ACTIVE_CLASS_NAME = 'ng-animate-active';

      var lookupCache = {};
      var parentCounter = 0;

      var animationReflowQueue = [], animationTimer, timeOut = false;
      function afterReflow(callback) {
        animationReflowQueue.push(callback);
        $timeout.cancel(animationTimer);
        animationTimer = $timeout(function() {
          forEach(animationReflowQueue, function(fn) {
            fn();
          });
          animationReflowQueue = [];
          animationTimer = null;
          lookupCache = {};
        }, 10, false);
      }

      function applyStyle(node, style) {
        var oldStyle = node.getAttribute('style') || '';
        var newStyle = (oldStyle.length > 0 ? '; ' : '') + style;
        node.setAttribute('style', newStyle);
        return oldStyle;
      }

      function getElementAnimationDetails(element, cacheKey) {
        var data = cacheKey ? lookupCache[cacheKey] : null;
        if(!data) {
          var transitionDuration = 0;
          var transitionDelay = 0;
          var animationDuration = 0;
          var animationDelay = 0;
          var transitionDelayStyle;
          var animationDelayStyle;
          var transitionDurationStyle;
          var transitionPropertyStyle;

          //we want all the styles defined before and after
          forEach(element, function(element) {
            if (element.nodeType == ELEMENT_NODE) {
              var elementStyles = $window.getComputedStyle(element) || {};

              transitionDurationStyle = elementStyles[TRANSITION_PROP + DURATION_KEY];

              transitionDuration = Math.max(parseMaxTime(transitionDurationStyle), transitionDuration);

              transitionPropertyStyle = elementStyles[TRANSITION_PROP + PROPERTY_KEY];

              transitionDelayStyle = elementStyles[TRANSITION_PROP + DELAY_KEY];

              transitionDelay  = Math.max(parseMaxTime(transitionDelayStyle), transitionDelay);

              animationDelayStyle = elementStyles[ANIMATION_PROP + DELAY_KEY];

              animationDelay   = Math.max(parseMaxTime(animationDelayStyle), animationDelay);

              var aDuration  = parseMaxTime(elementStyles[ANIMATION_PROP + DURATION_KEY]);

              if(aDuration > 0) {
                aDuration *= parseInt(elementStyles[ANIMATION_PROP + ANIMATION_ITERATION_COUNT_KEY], 10) || 1;
              }

              animationDuration = Math.max(aDuration, animationDuration);
            }
          });
          data = {
            total : 0,
            transitionPropertyStyle: transitionPropertyStyle,
            transitionDurationStyle: transitionDurationStyle,
            transitionDelayStyle: transitionDelayStyle,
            transitionDelay: transitionDelay,
            transitionDuration: transitionDuration,
            animationDelayStyle: animationDelayStyle,
            animationDelay: animationDelay,
            animationDuration: animationDuration
          };
          if(cacheKey) {
            lookupCache[cacheKey] = data;
          }
        }
        return data;
      }

      function parseMaxTime(str) {
        var maxValue = 0;
        var values = angular.isString(str) ?
          str.split(/\s*,\s*/) :
          [];
        forEach(values, function(value) {
          maxValue = Math.max(parseFloat(value) || 0, maxValue);
        });
        return maxValue;
      }

      function getCacheKey(element) {
        var parentElement = element.parent();
        var parentID = parentElement.data(NG_ANIMATE_PARENT_KEY);
        if(!parentID) {
          parentElement.data(NG_ANIMATE_PARENT_KEY, ++parentCounter);
          parentID = parentCounter;
        }
        return parentID + '-' + element[0].className;
      }

      function animateSetup(element, className) {
        var cacheKey = getCacheKey(element);
        var eventCacheKey = cacheKey + ' ' + className;
        var stagger = {};
        var ii = lookupCache[eventCacheKey] ? ++lookupCache[eventCacheKey].total : 0;

        if(ii > 0) {
          var staggerClassName = className + '-stagger';
          var staggerCacheKey = cacheKey + ' ' + staggerClassName;
          var applyClasses = !lookupCache[staggerCacheKey];

          applyClasses && element.addClass(staggerClassName);

          stagger = getElementAnimationDetails(element, staggerCacheKey);

          applyClasses && element.removeClass(staggerClassName);
        }

        element.addClass(className);

        var timings = getElementAnimationDetails(element, eventCacheKey);

        /* there is no point in performing a reflow if the animation
           timeout is empty (this would cause a flicker bug normally
           in the page. There is also no point in performing an animation
           that only has a delay and no duration */
        var maxDuration = Math.max(timings.transitionDuration, timings.animationDuration);
        if(maxDuration === 0) {
          element.removeClass(className);
          return false;
        }

        var node = element[0];
        //temporarily disable the transition so that the enter styles
        //don't animate twice (this is here to avoid a bug in Chrome/FF).
        var activeClassName = '';
        if(timings.transitionDuration > 0) {
          element.addClass(NG_ANIMATE_FALLBACK_CLASS_NAME);
          activeClassName += NG_ANIMATE_FALLBACK_ACTIVE_CLASS_NAME + ' ';
          node.style[TRANSITION_PROP + PROPERTY_KEY] = 'none';
        }

        forEach(className.split(' '), function(klass, i) {
          activeClassName += (i > 0 ? ' ' : '') + klass + '-active';
        });

        element.data(NG_ANIMATE_CSS_DATA_KEY, {
          className : className,
          activeClassName : activeClassName,
          maxDuration : maxDuration,
          classes : className + ' ' + activeClassName,
          timings : timings,
          stagger : stagger,
          ii : ii
        });

        return true;
      }

      function animateRun(element, className, activeAnimationComplete) {
        var data = element.data(NG_ANIMATE_CSS_DATA_KEY);
        if(!element.hasClass(className) || !data) {
          activeAnimationComplete();
          return;
        }

        var node = element[0];
        var timings = data.timings;
        var stagger = data.stagger;
        var maxDuration = data.maxDuration;
        var activeClassName = data.activeClassName;
        var maxDelayTime = Math.max(timings.transitionDelay, timings.animationDelay) * 1000;
        var startTime = Date.now();
        var css3AnimationEvents = ANIMATIONEND_EVENT + ' ' + TRANSITIONEND_EVENT;
        var formerStyle;
        var ii = data.ii;

        var applyFallbackStyle, style = '';
        if(timings.transitionDuration > 0) {
          node.style[TRANSITION_PROP + PROPERTY_KEY] = '';

          var propertyStyle = timings.transitionPropertyStyle;
          if(propertyStyle.indexOf('all') == -1) {
            applyFallbackStyle = true;
            var fallbackProperty = $sniffer.msie ? '-ms-zoom' : 'clip';
            style += CSS_PREFIX + 'transition-property: ' + propertyStyle + ', ' + fallbackProperty + '; ';
            style += CSS_PREFIX + 'transition-duration: ' + timings.transitionDurationStyle + ', ' + timings.transitionDuration + 's; ';
          }
        }

        if(ii > 0) {
          if(stagger.transitionDelay > 0 && stagger.transitionDuration === 0) {
            var delayStyle = timings.transitionDelayStyle;
            if(applyFallbackStyle) {
              delayStyle += ', ' + timings.transitionDelay + 's';
            }

            style += CSS_PREFIX + 'transition-delay: ' +
                     prepareStaggerDelay(delayStyle, stagger.transitionDelay, ii) + '; ';
          }

          if(stagger.animationDelay > 0 && stagger.animationDuration === 0) {
            style += CSS_PREFIX + 'animation-delay: ' +
                     prepareStaggerDelay(timings.animationDelayStyle, stagger.animationDelay, ii) + '; ';
          }
        }

        if(style.length > 0) {
          formerStyle = applyStyle(node, style);
        }

        element.on(css3AnimationEvents, onAnimationProgress);
        element.addClass(activeClassName);

        // This will automatically be called by $animate so
        // there is no need to attach this internally to the
        // timeout done method.
        return function onEnd(cancelled) {
          element.off(css3AnimationEvents, onAnimationProgress);
          element.removeClass(activeClassName);
          animateClose(element, className);
          if(formerStyle != null) {
            formerStyle.length > 0 ?
              node.setAttribute('style', formerStyle) :
              node.removeAttribute('style');
          }
        };

        function onAnimationProgress(event) {
          event.stopPropagation();
          var ev = event.originalEvent || event;
          var timeStamp = ev.$manualTimeStamp || ev.timeStamp || Date.now();
          /* $manualTimeStamp is a mocked timeStamp value which is set
           * within browserTrigger(). This is only here so that tests can
           * mock animations properly. Real events fallback to event.timeStamp,
           * or, if they don't, then a timeStamp is automatically created for them.
           * We're checking to see if the timeStamp surpasses the expected delay,
           * but we're using elapsedTime instead of the timeStamp on the 2nd
           * pre-condition since animations sometimes close off early */
          if(Math.max(timeStamp - startTime, 0) >= maxDelayTime && ev.elapsedTime >= maxDuration) {
            activeAnimationComplete();
          }
        }
      }

      function prepareStaggerDelay(delayStyle, staggerDelay, index) {
        var style = '';
        forEach(delayStyle.split(','), function(val, i) {
          style += (i > 0 ? ',' : '') +
                   (index * staggerDelay + parseInt(val, 10)) + 's';
        });
        return style;
      }

      function animateBefore(element, className) {
        if(animateSetup(element, className)) {
          return function(cancelled) {
            cancelled && animateClose(element, className);
          };
        }
      }

      function animateAfter(element, className, afterAnimationComplete) {
        if(element.data(NG_ANIMATE_CSS_DATA_KEY)) {
          return animateRun(element, className, afterAnimationComplete);
        } else {
          animateClose(element, className);
          afterAnimationComplete();
        }
      }

      function animate(element, className, animationComplete) {
        //If the animateSetup function doesn't bother returning a
        //cancellation function then it means that there is no animation
        //to perform at all
        var preReflowCancellation = animateBefore(element, className);
        if(!preReflowCancellation) {
          animationComplete();
          return;
        }

        //There are two cancellation functions: one is before the first
        //reflow animation and the second is during the active state
        //animation. The first function will take care of removing the
        //data from the element which will not make the 2nd animation
        //happen in the first place
        var cancel = preReflowCancellation;
        afterReflow(function() {
          //once the reflow is complete then we point cancel to
          //the new cancellation function which will remove all of the
          //animation properties from the active animation
          cancel = animateAfter(element, className, animationComplete);
        });

        return function(cancelled) {
          (cancel || noop)(cancelled);
        };
      }

      function animateClose(element, className) {
        element.removeClass(className);
        element.removeClass(NG_ANIMATE_FALLBACK_CLASS_NAME);
        element.removeData(NG_ANIMATE_CSS_DATA_KEY);
      }

      return {
        allowCancel : function(element, animationEvent, className) {
          //always cancel the current animation if it is a
          //structural animation
          var oldClasses = (element.data(NG_ANIMATE_CSS_DATA_KEY) || {}).classes;
          if(!oldClasses || ['enter','leave','move'].indexOf(animationEvent) >= 0) {
            return true;
          }

          var parentElement = element.parent();
          var clone = angular.element(element[0].cloneNode());

          //make the element super hidden and override any CSS style values
          clone.attr('style','position:absolute; top:-9999px; left:-9999px');
          clone.removeAttr('id');
          clone.html('');

          forEach(oldClasses.split(' '), function(klass) {
            clone.removeClass(klass);
          });

          var suffix = animationEvent == 'addClass' ? '-add' : '-remove';
          clone.addClass(suffixClasses(className, suffix));
          parentElement.append(clone);

          var timings = getElementAnimationDetails(clone);
          clone.remove();

          return Math.max(timings.transitionDuration, timings.animationDuration) > 0;
        },

        enter : function(element, animationCompleted) {
          return animate(element, 'ng-enter', animationCompleted);
        },

        leave : function(element, animationCompleted) {
          return animate(element, 'ng-leave', animationCompleted);
        },

        move : function(element, animationCompleted) {
          return animate(element, 'ng-move', animationCompleted);
        },

        beforeAddClass : function(element, className, animationCompleted) {
          var cancellationMethod = animateBefore(element, suffixClasses(className, '-add'));
          if(cancellationMethod) {
            afterReflow(animationCompleted);
            return cancellationMethod;
          }
          animationCompleted();
        },

        addClass : function(element, className, animationCompleted) {
          return animateAfter(element, suffixClasses(className, '-add'), animationCompleted);
        },

        beforeRemoveClass : function(element, className, animationCompleted) {
          var cancellationMethod = animateBefore(element, suffixClasses(className, '-remove'));
          if(cancellationMethod) {
            afterReflow(animationCompleted);
            return cancellationMethod;
          }
          animationCompleted();
        },

        removeClass : function(element, className, animationCompleted) {
          return animateAfter(element, suffixClasses(className, '-remove'), animationCompleted);
        }
      };

      function suffixClasses(classes, suffix) {
        var className = '';
        classes = angular.isArray(classes) ? classes : classes.split(/\s+/);
        forEach(classes, function(klass, i) {
          if(klass && klass.length > 0) {
            className += (i > 0 ? ' ' : '') + klass + suffix;
          }
        });
        return className;
      }
    }]);
  }]);


})(window, window.angular);
;
/**
 * @license AngularJS v1.2.1
 * (c) 2010-2012 Google, Inc. http://angularjs.org
 * License: MIT
 */
(function(window, angular, undefined) {'use strict';

var $resourceMinErr = angular.$$minErr('$resource');

// Helper functions and regex to lookup a dotted path on an object
// stopping at undefined/null.  The path must be composed of ASCII
// identifiers (just like $parse)
var MEMBER_NAME_REGEX = /^(\.[a-zA-Z_$][0-9a-zA-Z_$]*)+$/;

function isValidDottedPath(path) {
  return (path != null && path !== '' && path !== 'hasOwnProperty' &&
      MEMBER_NAME_REGEX.test('.' + path));
}

function lookupDottedPath(obj, path) {
  if (!isValidDottedPath(path)) {
    throw $resourceMinErr('badmember', 'Dotted member path "@{0}" is invalid.', path);
  }
  var keys = path.split('.');
  for (var i = 0, ii = keys.length; i < ii && obj !== undefined; i++) {
    var key = keys[i];
    obj = (obj !== null) ? obj[key] : undefined;
  }
  return obj;
}

/**
 * @ngdoc overview
 * @name ngResource
 * @description
 *
 * # ngResource
 *
 * The `ngResource` module provides interaction support with RESTful services
 * via the $resource service.
 *
 * {@installModule resource}
 *
 * <div doc-module-components="ngResource"></div>
 *
 * See {@link ngResource.$resource `$resource`} for usage.
 */

/**
 * @ngdoc object
 * @name ngResource.$resource
 * @requires $http
 *
 * @description
 * A factory which creates a resource object that lets you interact with
 * [RESTful](http://en.wikipedia.org/wiki/Representational_State_Transfer) server-side data sources.
 *
 * The returned resource object has action methods which provide high-level behaviors without
 * the need to interact with the low level {@link ng.$http $http} service.
 *
 * Requires the {@link ngResource `ngResource`} module to be installed.
 *
 * @param {string} url A parametrized URL template with parameters prefixed by `:` as in
 *   `/user/:username`. If you are using a URL with a port number (e.g.
 *   `http://example.com:8080/api`), it will be respected.
 *
 *   If you are using a url with a suffix, just add the suffix, like this:
 *   `$resource('http://example.com/resource.json')` or `$resource('http://example.com/:id.json')`
 *   or even `$resource('http://example.com/resource/:resource_id.:format')`
 *   If the parameter before the suffix is empty, :resource_id in this case, then the `/.` will be
 *   collapsed down to a single `.`.  If you need this sequence to appear and not collapse then you
 *   can escape it with `/\.`.
 *
 * @param {Object=} paramDefaults Default values for `url` parameters. These can be overridden in
 *   `actions` methods. If any of the parameter value is a function, it will be executed every time
 *   when a param value needs to be obtained for a request (unless the param was overridden).
 *
 *   Each key value in the parameter object is first bound to url template if present and then any
 *   excess keys are appended to the url search query after the `?`.
 *
 *   Given a template `/path/:verb` and parameter `{verb:'greet', salutation:'Hello'}` results in
 *   URL `/path/greet?salutation=Hello`.
 *
 *   If the parameter value is prefixed with `@` then the value of that parameter is extracted from
 *   the data object (useful for non-GET operations).
 *
 * @param {Object.<Object>=} actions Hash with declaration of custom action that should extend the
 *   default set of resource actions. The declaration should be created in the format of {@link
 *   ng.$http#usage_parameters $http.config}:
 *
 *       {action1: {method:?, params:?, isArray:?, headers:?, ...},
 *        action2: {method:?, params:?, isArray:?, headers:?, ...},
 *        ...}
 *
 *   Where:
 *
 *   - **`action`** – {string} – The name of action. This name becomes the name of the method on
 *     your resource object.
 *   - **`method`** – {string} – HTTP request method. Valid methods are: `GET`, `POST`, `PUT`,
 *     `DELETE`, and `JSONP`.
 *   - **`params`** – {Object=} – Optional set of pre-bound parameters for this action. If any of
 *     the parameter value is a function, it will be executed every time when a param value needs to
 *     be obtained for a request (unless the param was overridden).
 *   - **`url`** – {string} – action specific `url` override. The url templating is supported just
 *     like for the resource-level urls.
 *   - **`isArray`** – {boolean=} – If true then the returned object for this action is an array,
 *     see `returns` section.
 *   - **`transformRequest`** –
 *     `{function(data, headersGetter)|Array.<function(data, headersGetter)>}` –
 *     transform function or an array of such functions. The transform function takes the http
 *     request body and headers and returns its transformed (typically serialized) version.
 *   - **`transformResponse`** –
 *     `{function(data, headersGetter)|Array.<function(data, headersGetter)>}` –
 *     transform function or an array of such functions. The transform function takes the http
 *     response body and headers and returns its transformed (typically deserialized) version.
 *   - **`cache`** – `{boolean|Cache}` – If true, a default $http cache will be used to cache the
 *     GET request, otherwise if a cache instance built with
 *     {@link ng.$cacheFactory $cacheFactory}, this cache will be used for
 *     caching.
 *   - **`timeout`** – `{number|Promise}` – timeout in milliseconds, or {@link ng.$q promise} that
 *     should abort the request when resolved.
 *   - **`withCredentials`** - `{boolean}` - whether to set the `withCredentials` flag on the
 *     XHR object. See {@link https://developer.mozilla.org/en/http_access_control#section_5
 *     requests with credentials} for more information.
 *   - **`responseType`** - `{string}` - see {@link
 *     https://developer.mozilla.org/en-US/docs/DOM/XMLHttpRequest#responseType requestType}.
 *   - **`interceptor`** - `{Object=}` - The interceptor object has two optional methods -
 *     `response` and `responseError`. Both `response` and `responseError` interceptors get called
 *     with `http response` object. See {@link ng.$http $http interceptors}.
 *
 * @returns {Object} A resource "class" object with methods for the default set of resource actions
 *   optionally extended with custom `actions`. The default set contains these actions:
 *
 *       { 'get':    {method:'GET'},
 *         'save':   {method:'POST'},
 *         'query':  {method:'GET', isArray:true},
 *         'remove': {method:'DELETE'},
 *         'delete': {method:'DELETE'} };
 *
 *   Calling these methods invoke an {@link ng.$http} with the specified http method,
 *   destination and parameters. When the data is returned from the server then the object is an
 *   instance of the resource class. The actions `save`, `remove` and `delete` are available on it
 *   as  methods with the `$` prefix. This allows you to easily perform CRUD operations (create,
 *   read, update, delete) on server-side data like this:
 *   <pre>
        var User = $resource('/user/:userId', {userId:'@id'});
        var user = User.get({userId:123}, function() {
          user.abc = true;
          user.$save();
        });
     </pre>
 *
 *   It is important to realize that invoking a $resource object method immediately returns an
 *   empty reference (object or array depending on `isArray`). Once the data is returned from the
 *   server the existing reference is populated with the actual data. This is a useful trick since
 *   usually the resource is assigned to a model which is then rendered by the view. Having an empty
 *   object results in no rendering, once the data arrives from the server then the object is
 *   populated with the data and the view automatically re-renders itself showing the new data. This
 *   means that in most cases one never has to write a callback function for the action methods.
 *
 *   The action methods on the class object or instance object can be invoked with the following
 *   parameters:
 *
 *   - HTTP GET "class" actions: `Resource.action([parameters], [success], [error])`
 *   - non-GET "class" actions: `Resource.action([parameters], postData, [success], [error])`
 *   - non-GET instance actions:  `instance.$action([parameters], [success], [error])`
 *
 *   Success callback is called with (value, responseHeaders) arguments. Error callback is called
 *   with (httpResponse) argument.
 *
 *   Class actions return empty instance (with additional properties below).
 *   Instance actions return promise of the action.
 *
 *   The Resource instances and collection have these additional properties:
 *
 *   - `$promise`: the {@link ng.$q promise} of the original server interaction that created this
 *     instance or collection.
 *
 *     On success, the promise is resolved with the same resource instance or collection object,
 *     updated with data from server. This makes it easy to use in
 *     {@link ngRoute.$routeProvider resolve section of $routeProvider.when()} to defer view
 *     rendering until the resource(s) are loaded.
 *
 *     On failure, the promise is resolved with the {@link ng.$http http response} object, without
 *     the `resource` property.
 *
 *   - `$resolved`: `true` after first server interaction is completed (either with success or
 *      rejection), `false` before that. Knowing if the Resource has been resolved is useful in
 *      data-binding.
 *
 * @example
 *
 * # Credit card resource
 *
 * <pre>
     // Define CreditCard class
     var CreditCard = $resource('/user/:userId/card/:cardId',
      {userId:123, cardId:'@id'}, {
       charge: {method:'POST', params:{charge:true}}
      });

     // We can retrieve a collection from the server
     var cards = CreditCard.query(function() {
       // GET: /user/123/card
       // server returns: [ {id:456, number:'1234', name:'Smith'} ];

       var card = cards[0];
       // each item is an instance of CreditCard
       expect(card instanceof CreditCard).toEqual(true);
       card.name = "J. Smith";
       // non GET methods are mapped onto the instances
       card.$save();
       // POST: /user/123/card/456 {id:456, number:'1234', name:'J. Smith'}
       // server returns: {id:456, number:'1234', name: 'J. Smith'};

       // our custom method is mapped as well.
       card.$charge({amount:9.99});
       // POST: /user/123/card/456?amount=9.99&charge=true {id:456, number:'1234', name:'J. Smith'}
     });

     // we can create an instance as well
     var newCard = new CreditCard({number:'0123'});
     newCard.name = "Mike Smith";
     newCard.$save();
     // POST: /user/123/card {number:'0123', name:'Mike Smith'}
     // server returns: {id:789, number:'01234', name: 'Mike Smith'};
     expect(newCard.id).toEqual(789);
 * </pre>
 *
 * The object returned from this function execution is a resource "class" which has "static" method
 * for each action in the definition.
 *
 * Calling these methods invoke `$http` on the `url` template with the given `method`, `params` and
 * `headers`.
 * When the data is returned from the server then the object is an instance of the resource type and
 * all of the non-GET methods are available with `$` prefix. This allows you to easily support CRUD
 * operations (create, read, update, delete) on server-side data.

   <pre>
     var User = $resource('/user/:userId', {userId:'@id'});
     var user = User.get({userId:123}, function() {
       user.abc = true;
       user.$save();
     });
   </pre>
 *
 * It's worth noting that the success callback for `get`, `query` and other methods gets passed
 * in the response that came from the server as well as $http header getter function, so one
 * could rewrite the above example and get access to http headers as:
 *
   <pre>
     var User = $resource('/user/:userId', {userId:'@id'});
     User.get({userId:123}, function(u, getResponseHeaders){
       u.abc = true;
       u.$save(function(u, putResponseHeaders) {
         //u => saved user object
         //putResponseHeaders => $http header getter
       });
     });
   </pre>
 */
angular.module('ngResource', ['ng']).
  factory('$resource', ['$http', '$q', function($http, $q) {

    var DEFAULT_ACTIONS = {
      'get':    {method:'GET'},
      'save':   {method:'POST'},
      'query':  {method:'GET', isArray:true},
      'remove': {method:'DELETE'},
      'delete': {method:'DELETE'}
    };
    var noop = angular.noop,
        forEach = angular.forEach,
        extend = angular.extend,
        copy = angular.copy,
        isFunction = angular.isFunction;

    /**
     * We need our custom method because encodeURIComponent is too aggressive and doesn't follow
     * http://www.ietf.org/rfc/rfc3986.txt with regards to the character set (pchar) allowed in path
     * segments:
     *    segment       = *pchar
     *    pchar         = unreserved / pct-encoded / sub-delims / ":" / "@"
     *    pct-encoded   = "%" HEXDIG HEXDIG
     *    unreserved    = ALPHA / DIGIT / "-" / "." / "_" / "~"
     *    sub-delims    = "!" / "$" / "&" / "'" / "(" / ")"
     *                     / "*" / "+" / "," / ";" / "="
     */
    function encodeUriSegment(val) {
      return encodeUriQuery(val, true).
        replace(/%26/gi, '&').
        replace(/%3D/gi, '=').
        replace(/%2B/gi, '+');
    }


    /**
     * This method is intended for encoding *key* or *value* parts of query component. We need a
     * custom method because encodeURIComponent is too aggressive and encodes stuff that doesn't
     * have to be encoded per http://tools.ietf.org/html/rfc3986:
     *    query       = *( pchar / "/" / "?" )
     *    pchar         = unreserved / pct-encoded / sub-delims / ":" / "@"
     *    unreserved    = ALPHA / DIGIT / "-" / "." / "_" / "~"
     *    pct-encoded   = "%" HEXDIG HEXDIG
     *    sub-delims    = "!" / "$" / "&" / "'" / "(" / ")"
     *                     / "*" / "+" / "," / ";" / "="
     */
    function encodeUriQuery(val, pctEncodeSpaces) {
      return encodeURIComponent(val).
        replace(/%40/gi, '@').
        replace(/%3A/gi, ':').
        replace(/%24/g, '$').
        replace(/%2C/gi, ',').
        replace(/%20/g, (pctEncodeSpaces ? '%20' : '+'));
    }

    function Route(template, defaults) {
      this.template = template;
      this.defaults = defaults || {};
      this.urlParams = {};
    }

    Route.prototype = {
      setUrlParams: function(config, params, actionUrl) {
        var self = this,
            url = actionUrl || self.template,
            val,
            encodedVal;

        var urlParams = self.urlParams = {};
        forEach(url.split(/\W/), function(param){
          if (param === 'hasOwnProperty') {
            throw $resourceMinErr('badname', "hasOwnProperty is not a valid parameter name.");
          }
          if (!(new RegExp("^\\d+$").test(param)) && param &&
               (new RegExp("(^|[^\\\\]):" + param + "(\\W|$)").test(url))) {
            urlParams[param] = true;
          }
        });
        url = url.replace(/\\:/g, ':');

        params = params || {};
        forEach(self.urlParams, function(_, urlParam){
          val = params.hasOwnProperty(urlParam) ? params[urlParam] : self.defaults[urlParam];
          if (angular.isDefined(val) && val !== null) {
            encodedVal = encodeUriSegment(val);
            url = url.replace(new RegExp(":" + urlParam + "(\\W|$)", "g"), encodedVal + "$1");
          } else {
            url = url.replace(new RegExp("(\/?):" + urlParam + "(\\W|$)", "g"), function(match,
                leadingSlashes, tail) {
              if (tail.charAt(0) == '/') {
                return tail;
              } else {
                return leadingSlashes + tail;
              }
            });
          }
        });

        // strip trailing slashes and set the url
        url = url.replace(/\/+$/, '');
        // then replace collapse `/.` if found in the last URL path segment before the query
        // E.g. `http://url.com/id./format?q=x` becomes `http://url.com/id.format?q=x`
        url = url.replace(/\/\.(?=\w+($|\?))/, '.');
        // replace escaped `/\.` with `/.`
        config.url = url.replace(/\/\\\./, '/.');


        // set params - delegate param encoding to $http
        forEach(params, function(value, key){
          if (!self.urlParams[key]) {
            config.params = config.params || {};
            config.params[key] = value;
          }
        });
      }
    };


    function resourceFactory(url, paramDefaults, actions) {
      var route = new Route(url);

      actions = extend({}, DEFAULT_ACTIONS, actions);

      function extractParams(data, actionParams){
        var ids = {};
        actionParams = extend({}, paramDefaults, actionParams);
        forEach(actionParams, function(value, key){
          if (isFunction(value)) { value = value(); }
          ids[key] = value && value.charAt && value.charAt(0) == '@' ?
            lookupDottedPath(data, value.substr(1)) : value;
        });
        return ids;
      }

      function defaultResponseInterceptor(response) {
        return response.resource;
      }

      function Resource(value){
        copy(value || {}, this);
      }

      forEach(actions, function(action, name) {
        var hasBody = /^(POST|PUT|PATCH)$/i.test(action.method);

        Resource[name] = function(a1, a2, a3, a4) {
          var params = {}, data, success, error;

          /* jshint -W086 */ /* (purposefully fall through case statements) */
          switch(arguments.length) {
          case 4:
            error = a4;
            success = a3;
            //fallthrough
          case 3:
          case 2:
            if (isFunction(a2)) {
              if (isFunction(a1)) {
                success = a1;
                error = a2;
                break;
              }

              success = a2;
              error = a3;
              //fallthrough
            } else {
              params = a1;
              data = a2;
              success = a3;
              break;
            }
          case 1:
            if (isFunction(a1)) success = a1;
            else if (hasBody) data = a1;
            else params = a1;
            break;
          case 0: break;
          default:
            throw $resourceMinErr('badargs',
              "Expected up to 4 arguments [params, data, success, error], got {0} arguments",
              arguments.length);
          }
          /* jshint +W086 */ /* (purposefully fall through case statements) */

          var isInstanceCall = data instanceof Resource;
          var value = isInstanceCall ? data : (action.isArray ? [] : new Resource(data));
          var httpConfig = {};
          var responseInterceptor = action.interceptor && action.interceptor.response ||
                                    defaultResponseInterceptor;
          var responseErrorInterceptor = action.interceptor && action.interceptor.responseError ||
                                    undefined;

          forEach(action, function(value, key) {
            if (key != 'params' && key != 'isArray' && key != 'interceptor') {
              httpConfig[key] = copy(value);
            }
          });

          if (hasBody) httpConfig.data = data;
          route.setUrlParams(httpConfig,
                             extend({}, extractParams(data, action.params || {}), params),
                             action.url);

          var promise = $http(httpConfig).then(function(response) {
            var data = response.data,
                promise = value.$promise;

            if (data) {
              // Need to convert action.isArray to boolean in case it is undefined
              // jshint -W018
              if ( angular.isArray(data) !== (!!action.isArray) ) {
                throw $resourceMinErr('badcfg', 'Error in resource configuration. Expected ' +
                  'response to contain an {0} but got an {1}',
                  action.isArray?'array':'object', angular.isArray(data)?'array':'object');
              }
              // jshint +W018
              if (action.isArray) {
                value.length = 0;
                forEach(data, function(item) {
                  value.push(new Resource(item));
                });
              } else {
                copy(data, value);
                value.$promise = promise;
              }
            }

            value.$resolved = true;

            response.resource = value;

            return response;
          }, function(response) {
            value.$resolved = true;

            (error||noop)(response);

            return $q.reject(response);
          });

          promise = promise.then(
              function(response) {
                var value = responseInterceptor(response);
                (success||noop)(value, response.headers);
                return value;
              },
              responseErrorInterceptor);

          if (!isInstanceCall) {
            // we are creating instance / collection
            // - set the initial promise
            // - return the instance / collection
            value.$promise = promise;
            value.$resolved = false;

            return value;
          }

          // instance call
          return promise;
        };


        Resource.prototype['$' + name] = function(params, success, error) {
          if (isFunction(params)) {
            error = success; success = params; params = {};
          }
          var result = Resource[name](params, this, success, error);
          return result.$promise || result;
        };
      });

      Resource.bind = function(additionalParamDefaults){
        return resourceFactory(url, extend({}, paramDefaults, additionalParamDefaults), actions);
      };

      return Resource;
    }

    return resourceFactory;
  }]);


})(window, window.angular);
;
/**
 * @license AngularJS v1.2.1
 * (c) 2010-2012 Google, Inc. http://angularjs.org
 * License: MIT
 */
(function(window, angular, undefined) {'use strict';

var $sanitizeMinErr = angular.$$minErr('$sanitize');

/**
 * @ngdoc overview
 * @name ngSanitize
 * @description
 *
 * # ngSanitize
 *
 * The `ngSanitize` module provides functionality to sanitize HTML.
 *
 * {@installModule sanitize}
 *
 * <div doc-module-components="ngSanitize"></div>
 *
 * See {@link ngSanitize.$sanitize `$sanitize`} for usage.
 */

/*
 * HTML Parser By Misko Hevery (misko@hevery.com)
 * based on:  HTML Parser By John Resig (ejohn.org)
 * Original code by Erik Arvidsson, Mozilla Public License
 * http://erik.eae.net/simplehtmlparser/simplehtmlparser.js
 *
 * // Use like so:
 * htmlParser(htmlString, {
 *     start: function(tag, attrs, unary) {},
 *     end: function(tag) {},
 *     chars: function(text) {},
 *     comment: function(text) {}
 * });
 *
 */


/**
 * @ngdoc service
 * @name ngSanitize.$sanitize
 * @function
 *
 * @description
 *   The input is sanitized by parsing the html into tokens. All safe tokens (from a whitelist) are
 *   then serialized back to properly escaped html string. This means that no unsafe input can make
 *   it into the returned string, however, since our parser is more strict than a typical browser
 *   parser, it's possible that some obscure input, which would be recognized as valid HTML by a
 *   browser, won't make it through the sanitizer.
 *
 * @param {string} html Html input.
 * @returns {string} Sanitized html.
 *
 * @example
   <doc:example module="ngSanitize">
   <doc:source>
     <script>
       function Ctrl($scope, $sce) {
         $scope.snippet =
           '<p style="color:blue">an html\n' +
           '<em onmouseover="this.textContent=\'PWN3D!\'">click here</em>\n' +
           'snippet</p>';
         $scope.deliberatelyTrustDangerousSnippet = function() {
           return $sce.trustAsHtml($scope.snippet);
         };
       }
     </script>
     <div ng-controller="Ctrl">
        Snippet: <textarea ng-model="snippet" cols="60" rows="3"></textarea>
       <table>
         <tr>
           <td>Directive</td>
           <td>How</td>
           <td>Source</td>
           <td>Rendered</td>
         </tr>
         <tr id="bind-html-with-sanitize">
           <td>ng-bind-html</td>
           <td>Automatically uses $sanitize</td>
           <td><pre>&lt;div ng-bind-html="snippet"&gt;<br/>&lt;/div&gt;</pre></td>
           <td><div ng-bind-html="snippet"></div></td>
         </tr>
         <tr id="bind-html-with-trust">
           <td>ng-bind-html</td>
           <td>Bypass $sanitize by explicitly trusting the dangerous value</td>
           <td>
           <pre>&lt;div ng-bind-html="deliberatelyTrustDangerousSnippet()"&gt;
&lt;/div&gt;</pre>
           </td>
           <td><div ng-bind-html="deliberatelyTrustDangerousSnippet()"></div></td>
         </tr>
         <tr id="bind-default">
           <td>ng-bind</td>
           <td>Automatically escapes</td>
           <td><pre>&lt;div ng-bind="snippet"&gt;<br/>&lt;/div&gt;</pre></td>
           <td><div ng-bind="snippet"></div></td>
         </tr>
       </table>
       </div>
   </doc:source>
   <doc:scenario>
     it('should sanitize the html snippet by default', function() {
       expect(using('#bind-html-with-sanitize').element('div').html()).
         toBe('<p>an html\n<em>click here</em>\nsnippet</p>');
     });

     it('should inline raw snippet if bound to a trusted value', function() {
       expect(using('#bind-html-with-trust').element("div").html()).
         toBe("<p style=\"color:blue\">an html\n" +
              "<em onmouseover=\"this.textContent='PWN3D!'\">click here</em>\n" +
              "snippet</p>");
     });

     it('should escape snippet without any filter', function() {
       expect(using('#bind-default').element('div').html()).
         toBe("&lt;p style=\"color:blue\"&gt;an html\n" +
              "&lt;em onmouseover=\"this.textContent='PWN3D!'\"&gt;click here&lt;/em&gt;\n" +
              "snippet&lt;/p&gt;");
     });

     it('should update', function() {
       input('snippet').enter('new <b onclick="alert(1)">text</b>');
       expect(using('#bind-html-with-sanitize').element('div').html()).toBe('new <b>text</b>');
       expect(using('#bind-html-with-trust').element('div').html()).toBe(
         'new <b onclick="alert(1)">text</b>');
       expect(using('#bind-default').element('div').html()).toBe(
         "new &lt;b onclick=\"alert(1)\"&gt;text&lt;/b&gt;");
     });
   </doc:scenario>
   </doc:example>
 */
var $sanitize = function(html) {
  var buf = [];
    htmlParser(html, htmlSanitizeWriter(buf));
    return buf.join('');
};


// Regular Expressions for parsing tags and attributes
var START_TAG_REGEXP =
       /^<\s*([\w:-]+)((?:\s+[\w:-]+(?:\s*=\s*(?:(?:"[^"]*")|(?:'[^']*')|[^>\s]+))?)*)\s*(\/?)\s*>/,
  END_TAG_REGEXP = /^<\s*\/\s*([\w:-]+)[^>]*>/,
  ATTR_REGEXP = /([\w:-]+)(?:\s*=\s*(?:(?:"((?:[^"])*)")|(?:'((?:[^'])*)')|([^>\s]+)))?/g,
  BEGIN_TAG_REGEXP = /^</,
  BEGING_END_TAGE_REGEXP = /^<\s*\//,
  COMMENT_REGEXP = /<!--(.*?)-->/g,
  DOCTYPE_REGEXP = /<!DOCTYPE([^>]*?)>/i,
  CDATA_REGEXP = /<!\[CDATA\[(.*?)]]>/g,
  URI_REGEXP = /^((ftp|https?):\/\/|mailto:|tel:|#)/i,
  // Match everything outside of normal chars and " (quote character)
  NON_ALPHANUMERIC_REGEXP = /([^\#-~| |!])/g;


// Good source of info about elements and attributes
// http://dev.w3.org/html5/spec/Overview.html#semantics
// http://simon.html5.org/html-elements

// Safe Void Elements - HTML5
// http://dev.w3.org/html5/spec/Overview.html#void-elements
var voidElements = makeMap("area,br,col,hr,img,wbr");

// Elements that you can, intentionally, leave open (and which close themselves)
// http://dev.w3.org/html5/spec/Overview.html#optional-tags
var optionalEndTagBlockElements = makeMap("colgroup,dd,dt,li,p,tbody,td,tfoot,th,thead,tr"),
    optionalEndTagInlineElements = makeMap("rp,rt"),
    optionalEndTagElements = angular.extend({},
                                            optionalEndTagInlineElements,
                                            optionalEndTagBlockElements);

// Safe Block Elements - HTML5
var blockElements = angular.extend({}, optionalEndTagBlockElements, makeMap("address,article," +
        "aside,blockquote,caption,center,del,dir,div,dl,figure,figcaption,footer,h1,h2,h3,h4,h5," +
        "h6,header,hgroup,hr,ins,map,menu,nav,ol,pre,script,section,table,ul"));

// Inline Elements - HTML5
var inlineElements = angular.extend({}, optionalEndTagInlineElements, makeMap("a,abbr,acronym,b," +
        "bdi,bdo,big,br,cite,code,del,dfn,em,font,i,img,ins,kbd,label,map,mark,q,ruby,rp,rt,s," +
        "samp,small,span,strike,strong,sub,sup,time,tt,u,var"));


// Special Elements (can contain anything)
var specialElements = makeMap("script,style");

var validElements = angular.extend({},
                                   voidElements,
                                   blockElements,
                                   inlineElements,
                                   optionalEndTagElements);

//Attributes that have href and hence need to be sanitized
var uriAttrs = makeMap("background,cite,href,longdesc,src,usemap");
var validAttrs = angular.extend({}, uriAttrs, makeMap(
    'abbr,align,alt,axis,bgcolor,border,cellpadding,cellspacing,class,clear,'+
    'color,cols,colspan,compact,coords,dir,face,headers,height,hreflang,hspace,'+
    'ismap,lang,language,nohref,nowrap,rel,rev,rows,rowspan,rules,'+
    'scope,scrolling,shape,span,start,summary,target,title,type,'+
    'valign,value,vspace,width'));

function makeMap(str) {
  var obj = {}, items = str.split(','), i;
  for (i = 0; i < items.length; i++) obj[items[i]] = true;
  return obj;
}


/**
 * @example
 * htmlParser(htmlString, {
 *     start: function(tag, attrs, unary) {},
 *     end: function(tag) {},
 *     chars: function(text) {},
 *     comment: function(text) {}
 * });
 *
 * @param {string} html string
 * @param {object} handler
 */
function htmlParser( html, handler ) {
  var index, chars, match, stack = [], last = html;
  stack.last = function() { return stack[ stack.length - 1 ]; };

  while ( html ) {
    chars = true;

    // Make sure we're not in a script or style element
    if ( !stack.last() || !specialElements[ stack.last() ] ) {

      // Comment
      if ( html.indexOf("<!--") === 0 ) {
        // comments containing -- are not allowed unless they terminate the comment
        index = html.indexOf("--", 4);

        if ( index >= 0 && html.lastIndexOf("-->", index) === index) {
          if (handler.comment) handler.comment( html.substring( 4, index ) );
          html = html.substring( index + 3 );
          chars = false;
        }
      // DOCTYPE
      } else if ( DOCTYPE_REGEXP.test(html) ) {
        match = html.match( DOCTYPE_REGEXP );

        if ( match ) {
          html = html.replace( match[0] , '');
          chars = false;
        }
      // end tag
      } else if ( BEGING_END_TAGE_REGEXP.test(html) ) {
        match = html.match( END_TAG_REGEXP );

        if ( match ) {
          html = html.substring( match[0].length );
          match[0].replace( END_TAG_REGEXP, parseEndTag );
          chars = false;
        }

      // start tag
      } else if ( BEGIN_TAG_REGEXP.test(html) ) {
        match = html.match( START_TAG_REGEXP );

        if ( match ) {
          html = html.substring( match[0].length );
          match[0].replace( START_TAG_REGEXP, parseStartTag );
          chars = false;
        }
      }

      if ( chars ) {
        index = html.indexOf("<");

        var text = index < 0 ? html : html.substring( 0, index );
        html = index < 0 ? "" : html.substring( index );

        if (handler.chars) handler.chars( decodeEntities(text) );
      }

    } else {
      html = html.replace(new RegExp("(.*)<\\s*\\/\\s*" + stack.last() + "[^>]*>", 'i'),
        function(all, text){
          text = text.replace(COMMENT_REGEXP, "$1").replace(CDATA_REGEXP, "$1");

          if (handler.chars) handler.chars( decodeEntities(text) );

          return "";
      });

      parseEndTag( "", stack.last() );
    }

    if ( html == last ) {
      throw $sanitizeMinErr('badparse', "The sanitizer was unable to parse the following block " +
                                        "of html: {0}", html);
    }
    last = html;
  }

  // Clean up any remaining tags
  parseEndTag();

  function parseStartTag( tag, tagName, rest, unary ) {
    tagName = angular.lowercase(tagName);
    if ( blockElements[ tagName ] ) {
      while ( stack.last() && inlineElements[ stack.last() ] ) {
        parseEndTag( "", stack.last() );
      }
    }

    if ( optionalEndTagElements[ tagName ] && stack.last() == tagName ) {
      parseEndTag( "", tagName );
    }

    unary = voidElements[ tagName ] || !!unary;

    if ( !unary )
      stack.push( tagName );

    var attrs = {};

    rest.replace(ATTR_REGEXP,
      function(match, name, doubleQuotedValue, singleQuotedValue, unquotedValue) {
        var value = doubleQuotedValue
          || singleQuotedValue
          || unquotedValue
          || '';

        attrs[name] = decodeEntities(value);
    });
    if (handler.start) handler.start( tagName, attrs, unary );
  }

  function parseEndTag( tag, tagName ) {
    var pos = 0, i;
    tagName = angular.lowercase(tagName);
    if ( tagName )
      // Find the closest opened tag of the same type
      for ( pos = stack.length - 1; pos >= 0; pos-- )
        if ( stack[ pos ] == tagName )
          break;

    if ( pos >= 0 ) {
      // Close all the open elements, up the stack
      for ( i = stack.length - 1; i >= pos; i-- )
        if (handler.end) handler.end( stack[ i ] );

      // Remove the open elements from the stack
      stack.length = pos;
    }
  }
}

/**
 * decodes all entities into regular string
 * @param value
 * @returns {string} A string with decoded entities.
 */
var hiddenPre=document.createElement("pre");
function decodeEntities(value) {
  hiddenPre.innerHTML=value.replace(/</g,"&lt;");
  return hiddenPre.innerText || hiddenPre.textContent || '';
}

/**
 * Escapes all potentially dangerous characters, so that the
 * resulting string can be safely inserted into attribute or
 * element text.
 * @param value
 * @returns escaped text
 */
function encodeEntities(value) {
  return value.
    replace(/&/g, '&amp;').
    replace(NON_ALPHANUMERIC_REGEXP, function(value){
      return '&#' + value.charCodeAt(0) + ';';
    }).
    replace(/</g, '&lt;').
    replace(/>/g, '&gt;');
}

/**
 * create an HTML/XML writer which writes to buffer
 * @param {Array} buf use buf.jain('') to get out sanitized html string
 * @returns {object} in the form of {
 *     start: function(tag, attrs, unary) {},
 *     end: function(tag) {},
 *     chars: function(text) {},
 *     comment: function(text) {}
 * }
 */
function htmlSanitizeWriter(buf){
  var ignore = false;
  var out = angular.bind(buf, buf.push);
  return {
    start: function(tag, attrs, unary){
      tag = angular.lowercase(tag);
      if (!ignore && specialElements[tag]) {
        ignore = tag;
      }
      if (!ignore && validElements[tag] === true) {
        out('<');
        out(tag);
        angular.forEach(attrs, function(value, key){
          var lkey=angular.lowercase(key);
          if (validAttrs[lkey]===true && (uriAttrs[lkey]!==true || value.match(URI_REGEXP))) {
            out(' ');
            out(key);
            out('="');
            out(encodeEntities(value));
            out('"');
          }
        });
        out(unary ? '/>' : '>');
      }
    },
    end: function(tag){
        tag = angular.lowercase(tag);
        if (!ignore && validElements[tag] === true) {
          out('</');
          out(tag);
          out('>');
        }
        if (tag == ignore) {
          ignore = false;
        }
      },
    chars: function(chars){
        if (!ignore) {
          out(encodeEntities(chars));
        }
      }
  };
}


// define ngSanitize module and register $sanitize service
angular.module('ngSanitize', []).value('$sanitize', $sanitize);

/* global htmlSanitizeWriter: false */

/**
 * @ngdoc filter
 * @name ngSanitize.filter:linky
 * @function
 *
 * @description
 * Finds links in text input and turns them into html links. Supports http/https/ftp/mailto and
 * plain email address links.
 *
 * Requires the {@link ngSanitize `ngSanitize`} module to be installed.
 *
 * @param {string} text Input text.
 * @param {string} target Window (_blank|_self|_parent|_top) or named frame to open links in.
 * @returns {string} Html-linkified text.
 *
 * @usage
   <span ng-bind-html="linky_expression | linky"></span>
 *
 * @example
   <doc:example module="ngSanitize">
     <doc:source>
       <script>
         function Ctrl($scope) {
           $scope.snippet =
             'Pretty text with some links:\n'+
             'http://angularjs.org/,\n'+
             'mailto:us@somewhere.org,\n'+
             'another@somewhere.org,\n'+
             'and one more: ftp://127.0.0.1/.';
           $scope.snippetWithTarget = 'http://angularjs.org/';
         }
       </script>
       <div ng-controller="Ctrl">
       Snippet: <textarea ng-model="snippet" cols="60" rows="3"></textarea>
       <table>
         <tr>
           <td>Filter</td>
           <td>Source</td>
           <td>Rendered</td>
         </tr>
         <tr id="linky-filter">
           <td>linky filter</td>
           <td>
             <pre>&lt;div ng-bind-html="snippet | linky"&gt;<br>&lt;/div&gt;</pre>
           </td>
           <td>
             <div ng-bind-html="snippet | linky"></div>
           </td>
         </tr>
         <tr id="linky-target">
          <td>linky target</td>
          <td>
            <pre>&lt;div ng-bind-html="snippetWithTarget | linky:'_blank'"&gt;<br>&lt;/div&gt;</pre>
          </td>
          <td>
            <div ng-bind-html="snippetWithTarget | linky:'_blank'"></div>
          </td>
         </tr>
         <tr id="escaped-html">
           <td>no filter</td>
           <td><pre>&lt;div ng-bind="snippet"&gt;<br>&lt;/div&gt;</pre></td>
           <td><div ng-bind="snippet"></div></td>
         </tr>
       </table>
     </doc:source>
     <doc:scenario>
       it('should linkify the snippet with urls', function() {
         expect(using('#linky-filter').binding('snippet | linky')).
           toBe('Pretty text with some links:&#10;' +
                '<a href="http://angularjs.org/">http://angularjs.org/</a>,&#10;' +
                '<a href="mailto:us@somewhere.org">us@somewhere.org</a>,&#10;' +
                '<a href="mailto:another@somewhere.org">another@somewhere.org</a>,&#10;' +
                'and one more: <a href="ftp://127.0.0.1/">ftp://127.0.0.1/</a>.');
       });

       it ('should not linkify snippet without the linky filter', function() {
         expect(using('#escaped-html').binding('snippet')).
           toBe("Pretty text with some links:\n" +
                "http://angularjs.org/,\n" +
                "mailto:us@somewhere.org,\n" +
                "another@somewhere.org,\n" +
                "and one more: ftp://127.0.0.1/.");
       });

       it('should update', function() {
         input('snippet').enter('new http://link.');
         expect(using('#linky-filter').binding('snippet | linky')).
           toBe('new <a href="http://link">http://link</a>.');
         expect(using('#escaped-html').binding('snippet')).toBe('new http://link.');
       });

       it('should work with the target property', function() {
        expect(using('#linky-target').binding("snippetWithTarget | linky:'_blank'")).
          toBe('<a target="_blank" href="http://angularjs.org/">http://angularjs.org/</a>');
       });
     </doc:scenario>
   </doc:example>
 */
angular.module('ngSanitize').filter('linky', function() {
  var LINKY_URL_REGEXP =
        /((ftp|https?):\/\/|(mailto:)?[A-Za-z0-9._%+-]+@)\S*[^\s.;,(){}<>]/,
      MAILTO_REGEXP = /^mailto:/;

  return function(text, target) {
    if (!text) return text;
    var match;
    var raw = text;
    var html = [];
    // TODO(vojta): use $sanitize instead
    var writer = htmlSanitizeWriter(html);
    var url;
    var i;
    var properties = {};
    if (angular.isDefined(target)) {
      properties.target = target;
    }
    while ((match = raw.match(LINKY_URL_REGEXP))) {
      // We can not end in these as they are sometimes found at the end of the sentence
      url = match[0];
      // if we did not match ftp/http/mailto then assume mailto
      if (match[2] == match[3]) url = 'mailto:' + url;
      i = match.index;
      writer.chars(raw.substr(0, i));
      properties.href = url;
      writer.start('a', properties);
      writer.chars(match[0].replace(MAILTO_REGEXP, ''));
      writer.end('a');
      raw = raw.substring(i + match[0].length);
    }
    writer.chars(raw);
    return html.join('');
  };
});


})(window, window.angular);
;
/**
 * @license AngularJS v1.2.1
 * (c) 2010-2012 Google, Inc. http://angularjs.org
 * License: MIT
 */
(function(window, angular, undefined) {'use strict';

/**
 * @ngdoc overview
 * @name ngTouch
 * @description
 *
 * # ngTouch
 *
 * The `ngTouch` module provides touch events and other helpers for touch-enabled devices.
 * The implementation is based on jQuery Mobile touch event handling 
 * ([jquerymobile.com](http://jquerymobile.com/)).
 *
 * {@installModule touch}
 *
 * See {@link ngTouch.$swipe `$swipe`} for usage.
 *
 * <div doc-module-components="ngTouch"></div>
 *
 */

// define ngTouch module
/* global -ngTouch */
var ngTouch = angular.module('ngTouch', []);

/* global ngTouch: false */

    /**
     * @ngdoc object
     * @name ngTouch.$swipe
     *
     * @description
     * The `$swipe` service is a service that abstracts the messier details of hold-and-drag swipe
     * behavior, to make implementing swipe-related directives more convenient.
     *
     * Requires the {@link ngTouch `ngTouch`} module to be installed.
     *
     * `$swipe` is used by the `ngSwipeLeft` and `ngSwipeRight` directives in `ngTouch`, and by
     * `ngCarousel` in a separate component.
     *
     * # Usage
     * The `$swipe` service is an object with a single method: `bind`. `bind` takes an element
     * which is to be watched for swipes, and an object with four handler functions. See the
     * documentation for `bind` below.
     */

ngTouch.factory('$swipe', [function() {
  // The total distance in any direction before we make the call on swipe vs. scroll.
  var MOVE_BUFFER_RADIUS = 10;

  function getCoordinates(event) {
    var touches = event.touches && event.touches.length ? event.touches : [event];
    var e = (event.changedTouches && event.changedTouches[0]) ||
        (event.originalEvent && event.originalEvent.changedTouches &&
            event.originalEvent.changedTouches[0]) ||
        touches[0].originalEvent || touches[0];

    return {
      x: e.clientX,
      y: e.clientY
    };
  }

  return {
    /**
     * @ngdoc method
     * @name ngTouch.$swipe#bind
     * @methodOf ngTouch.$swipe
     *
     * @description
     * The main method of `$swipe`. It takes an element to be watched for swipe motions, and an
     * object containing event handlers.
     *
     * The four events are `start`, `move`, `end`, and `cancel`. `start`, `move`, and `end`
     * receive as a parameter a coordinates object of the form `{ x: 150, y: 310 }`.
     *
     * `start` is called on either `mousedown` or `touchstart`. After this event, `$swipe` is
     * watching for `touchmove` or `mousemove` events. These events are ignored until the total
     * distance moved in either dimension exceeds a small threshold.
     *
     * Once this threshold is exceeded, either the horizontal or vertical delta is greater.
     * - If the horizontal distance is greater, this is a swipe and `move` and `end` events follow.
     * - If the vertical distance is greater, this is a scroll, and we let the browser take over.
     *   A `cancel` event is sent.
     *
     * `move` is called on `mousemove` and `touchmove` after the above logic has determined that
     * a swipe is in progress.
     *
     * `end` is called when a swipe is successfully completed with a `touchend` or `mouseup`.
     *
     * `cancel` is called either on a `touchcancel` from the browser, or when we begin scrolling
     * as described above.
     *
     */
    bind: function(element, eventHandlers) {
      // Absolute total movement, used to control swipe vs. scroll.
      var totalX, totalY;
      // Coordinates of the start position.
      var startCoords;
      // Last event's position.
      var lastPos;
      // Whether a swipe is active.
      var active = false;

      element.on('touchstart mousedown', function(event) {
        startCoords = getCoordinates(event);
        active = true;
        totalX = 0;
        totalY = 0;
        lastPos = startCoords;
        eventHandlers['start'] && eventHandlers['start'](startCoords, event);
      });

      element.on('touchcancel', function(event) {
        active = false;
        eventHandlers['cancel'] && eventHandlers['cancel'](event);
      });

      element.on('touchmove mousemove', function(event) {
        if (!active) return;

        // Android will send a touchcancel if it thinks we're starting to scroll.
        // So when the total distance (+ or - or both) exceeds 10px in either direction,
        // we either:
        // - On totalX > totalY, we send preventDefault() and treat this as a swipe.
        // - On totalY > totalX, we let the browser handle it as a scroll.

        if (!startCoords) return;
        var coords = getCoordinates(event);

        totalX += Math.abs(coords.x - lastPos.x);
        totalY += Math.abs(coords.y - lastPos.y);

        lastPos = coords;

        if (totalX < MOVE_BUFFER_RADIUS && totalY < MOVE_BUFFER_RADIUS) {
          return;
        }

        // One of totalX or totalY has exceeded the buffer, so decide on swipe vs. scroll.
        if (totalY > totalX) {
          // Allow native scrolling to take over.
          active = false;
          eventHandlers['cancel'] && eventHandlers['cancel'](event);
          return;
        } else {
          // Prevent the browser from scrolling.
          event.preventDefault();
          eventHandlers['move'] && eventHandlers['move'](coords, event);
        }
      });

      element.on('touchend mouseup', function(event) {
        if (!active) return;
        active = false;
        eventHandlers['end'] && eventHandlers['end'](getCoordinates(event), event);
      });
    }
  };
}]);

/* global ngTouch: false */

/**
 * @ngdoc directive
 * @name ngTouch.directive:ngClick
 *
 * @description
 * A more powerful replacement for the default ngClick designed to be used on touchscreen
 * devices. Most mobile browsers wait about 300ms after a tap-and-release before sending
 * the click event. This version handles them immediately, and then prevents the
 * following click event from propagating.
 *
 * Requires the {@link ngTouch `ngTouch`} module to be installed.
 *
 * This directive can fall back to using an ordinary click event, and so works on desktop
 * browsers as well as mobile.
 *
 * This directive also sets the CSS class `ng-click-active` while the element is being held
 * down (by a mouse click or touch) so you can restyle the depressed element if you wish.
 *
 * @element ANY
 * @param {expression} ngClick {@link guide/expression Expression} to evaluate
 * upon tap. (Event object is available as `$event`)
 *
 * @example
    <doc:example>
      <doc:source>
        <button ng-click="count = count + 1" ng-init="count=0">
          Increment
        </button>
        count: {{ count }}
      </doc:source>
    </doc:example>
 */

ngTouch.config(['$provide', function($provide) {
  $provide.decorator('ngClickDirective', ['$delegate', function($delegate) {
    // drop the default ngClick directive
    $delegate.shift();
    return $delegate;
  }]);
}]);

ngTouch.directive('ngClick', ['$parse', '$timeout', '$rootElement',
    function($parse, $timeout, $rootElement) {
  var TAP_DURATION = 750; // Shorter than 750ms is a tap, longer is a taphold or drag.
  var MOVE_TOLERANCE = 12; // 12px seems to work in most mobile browsers.
  var PREVENT_DURATION = 2500; // 2.5 seconds maximum from preventGhostClick call to click
  var CLICKBUSTER_THRESHOLD = 25; // 25 pixels in any dimension is the limit for busting clicks.

  var ACTIVE_CLASS_NAME = 'ng-click-active';
  var lastPreventedTime;
  var touchCoordinates;


  // TAP EVENTS AND GHOST CLICKS
  //
  // Why tap events?
  // Mobile browsers detect a tap, then wait a moment (usually ~300ms) to see if you're
  // double-tapping, and then fire a click event.
  //
  // This delay sucks and makes mobile apps feel unresponsive.
  // So we detect touchstart, touchmove, touchcancel and touchend ourselves and determine when
  // the user has tapped on something.
  //
  // What happens when the browser then generates a click event?
  // The browser, of course, also detects the tap and fires a click after a delay. This results in
  // tapping/clicking twice. So we do "clickbusting" to prevent it.
  //
  // How does it work?
  // We attach global touchstart and click handlers, that run during the capture (early) phase.
  // So the sequence for a tap is:
  // - global touchstart: Sets an "allowable region" at the point touched.
  // - element's touchstart: Starts a touch
  // (- touchmove or touchcancel ends the touch, no click follows)
  // - element's touchend: Determines if the tap is valid (didn't move too far away, didn't hold
  //   too long) and fires the user's tap handler. The touchend also calls preventGhostClick().
  // - preventGhostClick() removes the allowable region the global touchstart created.
  // - The browser generates a click event.
  // - The global click handler catches the click, and checks whether it was in an allowable region.
  //     - If preventGhostClick was called, the region will have been removed, the click is busted.
  //     - If the region is still there, the click proceeds normally. Therefore clicks on links and
  //       other elements without ngTap on them work normally.
  //
  // This is an ugly, terrible hack!
  // Yeah, tell me about it. The alternatives are using the slow click events, or making our users
  // deal with the ghost clicks, so I consider this the least of evils. Fortunately Angular
  // encapsulates this ugly logic away from the user.
  //
  // Why not just put click handlers on the element?
  // We do that too, just to be sure. The problem is that the tap event might have caused the DOM
  // to change, so that the click fires in the same position but something else is there now. So
  // the handlers are global and care only about coordinates and not elements.

  // Checks if the coordinates are close enough to be within the region.
  function hit(x1, y1, x2, y2) {
    return Math.abs(x1 - x2) < CLICKBUSTER_THRESHOLD && Math.abs(y1 - y2) < CLICKBUSTER_THRESHOLD;
  }

  // Checks a list of allowable regions against a click location.
  // Returns true if the click should be allowed.
  // Splices out the allowable region from the list after it has been used.
  function checkAllowableRegions(touchCoordinates, x, y) {
    for (var i = 0; i < touchCoordinates.length; i += 2) {
      if (hit(touchCoordinates[i], touchCoordinates[i+1], x, y)) {
        touchCoordinates.splice(i, i + 2);
        return true; // allowable region
      }
    }
    return false; // No allowable region; bust it.
  }

  // Global click handler that prevents the click if it's in a bustable zone and preventGhostClick
  // was called recently.
  function onClick(event) {
    if (Date.now() - lastPreventedTime > PREVENT_DURATION) {
      return; // Too old.
    }

    var touches = event.touches && event.touches.length ? event.touches : [event];
    var x = touches[0].clientX;
    var y = touches[0].clientY;
    // Work around desktop Webkit quirk where clicking a label will fire two clicks (on the label
    // and on the input element). Depending on the exact browser, this second click we don't want
    // to bust has either (0,0) or negative coordinates.
    if (x < 1 && y < 1) {
      return; // offscreen
    }

    // Look for an allowable region containing this click.
    // If we find one, that means it was created by touchstart and not removed by
    // preventGhostClick, so we don't bust it.
    if (checkAllowableRegions(touchCoordinates, x, y)) {
      return;
    }

    // If we didn't find an allowable region, bust the click.
    event.stopPropagation();
    event.preventDefault();

    // Blur focused form elements
    event.target && event.target.blur();
  }


  // Global touchstart handler that creates an allowable region for a click event.
  // This allowable region can be removed by preventGhostClick if we want to bust it.
  function onTouchStart(event) {
    var touches = event.touches && event.touches.length ? event.touches : [event];
    var x = touches[0].clientX;
    var y = touches[0].clientY;
    touchCoordinates.push(x, y);

    $timeout(function() {
      // Remove the allowable region.
      for (var i = 0; i < touchCoordinates.length; i += 2) {
        if (touchCoordinates[i] == x && touchCoordinates[i+1] == y) {
          touchCoordinates.splice(i, i + 2);
          return;
        }
      }
    }, PREVENT_DURATION, false);
  }

  // On the first call, attaches some event handlers. Then whenever it gets called, it creates a
  // zone around the touchstart where clicks will get busted.
  function preventGhostClick(x, y) {
    if (!touchCoordinates) {
      $rootElement[0].addEventListener('click', onClick, true);
      $rootElement[0].addEventListener('touchstart', onTouchStart, true);
      touchCoordinates = [];
    }

    lastPreventedTime = Date.now();

    checkAllowableRegions(touchCoordinates, x, y);
  }

  // Actual linking function.
  return function(scope, element, attr) {
    var clickHandler = $parse(attr.ngClick),
        tapping = false,
        tapElement,  // Used to blur the element after a tap.
        startTime,   // Used to check if the tap was held too long.
        touchStartX,
        touchStartY;

    function resetState() {
      tapping = false;
      element.removeClass(ACTIVE_CLASS_NAME);
    }

    element.on('touchstart', function(event) {
      tapping = true;
      tapElement = event.target ? event.target : event.srcElement; // IE uses srcElement.
      // Hack for Safari, which can target text nodes instead of containers.
      if(tapElement.nodeType == 3) {
        tapElement = tapElement.parentNode;
      }

      element.addClass(ACTIVE_CLASS_NAME);

      startTime = Date.now();

      var touches = event.touches && event.touches.length ? event.touches : [event];
      var e = touches[0].originalEvent || touches[0];
      touchStartX = e.clientX;
      touchStartY = e.clientY;
    });

    element.on('touchmove', function(event) {
      resetState();
    });

    element.on('touchcancel', function(event) {
      resetState();
    });

    element.on('touchend', function(event) {
      var diff = Date.now() - startTime;

      var touches = (event.changedTouches && event.changedTouches.length) ? event.changedTouches :
          ((event.touches && event.touches.length) ? event.touches : [event]);
      var e = touches[0].originalEvent || touches[0];
      var x = e.clientX;
      var y = e.clientY;
      var dist = Math.sqrt( Math.pow(x - touchStartX, 2) + Math.pow(y - touchStartY, 2) );

      if (tapping && diff < TAP_DURATION && dist < MOVE_TOLERANCE) {
        // Call preventGhostClick so the clickbuster will catch the corresponding click.
        preventGhostClick(x, y);

        // Blur the focused element (the button, probably) before firing the callback.
        // This doesn't work perfectly on Android Chrome, but seems to work elsewhere.
        // I couldn't get anything to work reliably on Android Chrome.
        if (tapElement) {
          tapElement.blur();
        }

        if (!angular.isDefined(attr.disabled) || attr.disabled === false) {
          element.triggerHandler('click', [event]);
        }
      }

      resetState();
    });

    // Hack for iOS Safari's benefit. It goes searching for onclick handlers and is liable to click
    // something else nearby.
    element.onclick = function(event) { };

    // Actual click handler.
    // There are three different kinds of clicks, only two of which reach this point.
    // - On desktop browsers without touch events, their clicks will always come here.
    // - On mobile browsers, the simulated "fast" click will call this.
    // - But the browser's follow-up slow click will be "busted" before it reaches this handler.
    // Therefore it's safe to use this directive on both mobile and desktop.
    element.on('click', function(event, touchend) {
      scope.$apply(function() {
        clickHandler(scope, {$event: (touchend || event)});
      });
    });

    element.on('mousedown', function(event) {
      element.addClass(ACTIVE_CLASS_NAME);
    });

    element.on('mousemove mouseup', function(event) {
      element.removeClass(ACTIVE_CLASS_NAME);
    });

  };
}]);

/* global ngTouch: false */

/**
 * @ngdoc directive
 * @name ngTouch.directive:ngSwipeLeft
 *
 * @description
 * Specify custom behavior when an element is swiped to the left on a touchscreen device.
 * A leftward swipe is a quick, right-to-left slide of the finger.
 * Though ngSwipeLeft is designed for touch-based devices, it will work with a mouse click and drag
 * too.
 *
 * Requires the {@link ngTouch `ngTouch`} module to be installed.
 *
 * @element ANY
 * @param {expression} ngSwipeLeft {@link guide/expression Expression} to evaluate
 * upon left swipe. (Event object is available as `$event`)
 *
 * @example
    <doc:example>
      <doc:source>
        <div ng-show="!showActions" ng-swipe-left="showActions = true">
          Some list content, like an email in the inbox
        </div>
        <div ng-show="showActions" ng-swipe-right="showActions = false">
          <button ng-click="reply()">Reply</button>
          <button ng-click="delete()">Delete</button>
        </div>
      </doc:source>
    </doc:example>
 */

/**
 * @ngdoc directive
 * @name ngTouch.directive:ngSwipeRight
 *
 * @description
 * Specify custom behavior when an element is swiped to the right on a touchscreen device.
 * A rightward swipe is a quick, left-to-right slide of the finger.
 * Though ngSwipeRight is designed for touch-based devices, it will work with a mouse click and drag
 * too.
 *
 * Requires the {@link ngTouch `ngTouch`} module to be installed.
 *
 * @element ANY
 * @param {expression} ngSwipeRight {@link guide/expression Expression} to evaluate
 * upon right swipe. (Event object is available as `$event`)
 *
 * @example
    <doc:example>
      <doc:source>
        <div ng-show="!showActions" ng-swipe-left="showActions = true">
          Some list content, like an email in the inbox
        </div>
        <div ng-show="showActions" ng-swipe-right="showActions = false">
          <button ng-click="reply()">Reply</button>
          <button ng-click="delete()">Delete</button>
        </div>
      </doc:source>
    </doc:example>
 */

function makeSwipeDirective(directiveName, direction, eventName) {
  ngTouch.directive(directiveName, ['$parse', '$swipe', function($parse, $swipe) {
    // The maximum vertical delta for a swipe should be less than 75px.
    var MAX_VERTICAL_DISTANCE = 75;
    // Vertical distance should not be more than a fraction of the horizontal distance.
    var MAX_VERTICAL_RATIO = 0.3;
    // At least a 30px lateral motion is necessary for a swipe.
    var MIN_HORIZONTAL_DISTANCE = 30;

    return function(scope, element, attr) {
      var swipeHandler = $parse(attr[directiveName]);

      var startCoords, valid;

      function validSwipe(coords) {
        // Check that it's within the coordinates.
        // Absolute vertical distance must be within tolerances.
        // Horizontal distance, we take the current X - the starting X.
        // This is negative for leftward swipes and positive for rightward swipes.
        // After multiplying by the direction (-1 for left, +1 for right), legal swipes
        // (ie. same direction as the directive wants) will have a positive delta and
        // illegal ones a negative delta.
        // Therefore this delta must be positive, and larger than the minimum.
        if (!startCoords) return false;
        var deltaY = Math.abs(coords.y - startCoords.y);
        var deltaX = (coords.x - startCoords.x) * direction;
        return valid && // Short circuit for already-invalidated swipes.
            deltaY < MAX_VERTICAL_DISTANCE &&
            deltaX > 0 &&
            deltaX > MIN_HORIZONTAL_DISTANCE &&
            deltaY / deltaX < MAX_VERTICAL_RATIO;
      }

      $swipe.bind(element, {
        'start': function(coords, event) {
          startCoords = coords;
          valid = true;
        },
        'cancel': function(event) {
          valid = false;
        },
        'end': function(coords, event) {
          if (validSwipe(coords)) {
            scope.$apply(function() {
              element.triggerHandler(eventName);
              swipeHandler(scope, {$event: event});
            });
          }
        }
      });
    };
  }]);
}

// Left is negative X-coordinate, right is positive.
makeSwipeDirective('ngSwipeLeft', -1, 'swipeleft');
makeSwipeDirective('ngSwipeRight', 1, 'swiperight');



})(window, window.angular);
;
/**
 * @license AngularJS v1.2.1
 * (c) 2010-2012 Google, Inc. http://angularjs.org
 * License: MIT
 */
(function(window, angular, undefined) {'use strict';

/**
 * @ngdoc overview
 * @name ngRoute
 * @description
 *
 * # ngRoute
 *
 * The `ngRoute` module provides routing and deeplinking services and directives for angular apps.
 *
 * {@installModule route}
 *
 * <div doc-module-components="ngRoute"></div>
 */
 /* global -ngRouteModule */
var ngRouteModule = angular.module('ngRoute', ['ng']).
                        provider('$route', $RouteProvider);

/**
 * @ngdoc object
 * @name ngRoute.$routeProvider
 * @function
 *
 * @description
 *
 * Used for configuring routes. See {@link ngRoute.$route $route} for an example.
 *
 * Requires the {@link ngRoute `ngRoute`} module to be installed.
 */
function $RouteProvider(){
  function inherit(parent, extra) {
    return angular.extend(new (angular.extend(function() {}, {prototype:parent}))(), extra);
  }

  var routes = {};

  /**
   * @ngdoc method
   * @name ngRoute.$routeProvider#when
   * @methodOf ngRoute.$routeProvider
   *
   * @param {string} path Route path (matched against `$location.path`). If `$location.path`
   *    contains redundant trailing slash or is missing one, the route will still match and the
   *    `$location.path` will be updated to add or drop the trailing slash to exactly match the
   *    route definition.
   *
   *      * `path` can contain named groups starting with a colon (`:name`). All characters up
   *        to the next slash are matched and stored in `$routeParams` under the given `name`
   *        when the route matches.
   *      * `path` can contain named groups starting with a colon and ending with a star (`:name*`).
   *        All characters are eagerly stored in `$routeParams` under the given `name`
   *        when the route matches.
   *      * `path` can contain optional named groups with a question mark (`:name?`).
   *
   *    For example, routes like `/color/:color/largecode/:largecode*\/edit` will match
   *    `/color/brown/largecode/code/with/slashs/edit` and extract:
   *
   *      * `color: brown`
   *      * `largecode: code/with/slashs`.
   *
   *
   * @param {Object} route Mapping information to be assigned to `$route.current` on route
   *    match.
   *
   *    Object properties:
   *
   *    - `controller` – `{(string|function()=}` – Controller fn that should be associated with
   *      newly created scope or the name of a {@link angular.Module#controller registered
   *      controller} if passed as a string.
   *    - `controllerAs` – `{string=}` – A controller alias name. If present the controller will be
   *      published to scope under the `controllerAs` name.
   *    - `template` – `{string=|function()=}` – html template as a string or a function that
   *      returns an html template as a string which should be used by {@link
   *      ngRoute.directive:ngView ngView} or {@link ng.directive:ngInclude ngInclude} directives.
   *      This property takes precedence over `templateUrl`.
   *
   *      If `template` is a function, it will be called with the following parameters:
   *
   *      - `{Array.<Object>}` - route parameters extracted from the current
   *        `$location.path()` by applying the current route
   *
   *    - `templateUrl` – `{string=|function()=}` – path or function that returns a path to an html
   *      template that should be used by {@link ngRoute.directive:ngView ngView}.
   *
   *      If `templateUrl` is a function, it will be called with the following parameters:
   *
   *      - `{Array.<Object>}` - route parameters extracted from the current
   *        `$location.path()` by applying the current route
   *
   *    - `resolve` - `{Object.<string, function>=}` - An optional map of dependencies which should
   *      be injected into the controller. If any of these dependencies are promises, the router
   *      will wait for them all to be resolved or one to be rejected before the controller is
   *      instantiated.
   *      If all the promises are resolved successfully, the values of the resolved promises are
   *      injected and {@link ngRoute.$route#$routeChangeSuccess $routeChangeSuccess} event is
   *      fired. If any of the promises are rejected the
   *      {@link ngRoute.$route#$routeChangeError $routeChangeError} event is fired. The map object
   *      is:
   *
   *      - `key` – `{string}`: a name of a dependency to be injected into the controller.
   *      - `factory` - `{string|function}`: If `string` then it is an alias for a service.
   *        Otherwise if function, then it is {@link api/AUTO.$injector#invoke injected}
   *        and the return value is treated as the dependency. If the result is a promise, it is
   *        resolved before its value is injected into the controller. Be aware that
   *        `ngRoute.$routeParams` will still refer to the previous route within these resolve
   *        functions.  Use `$route.current.params` to access the new route parameters, instead.
   *
   *    - `redirectTo` – {(string|function())=} – value to update
   *      {@link ng.$location $location} path with and trigger route redirection.
   *
   *      If `redirectTo` is a function, it will be called with the following parameters:
   *
   *      - `{Object.<string>}` - route parameters extracted from the current
   *        `$location.path()` by applying the current route templateUrl.
   *      - `{string}` - current `$location.path()`
   *      - `{Object}` - current `$location.search()`
   *
   *      The custom `redirectTo` function is expected to return a string which will be used
   *      to update `$location.path()` and `$location.search()`.
   *
   *    - `[reloadOnSearch=true]` - {boolean=} - reload route when only `$location.search()`
   *      or `$location.hash()` changes.
   *
   *      If the option is set to `false` and url in the browser changes, then
   *      `$routeUpdate` event is broadcasted on the root scope.
   *
   *    - `[caseInsensitiveMatch=false]` - {boolean=} - match routes without being case sensitive
   *
   *      If the option is set to `true`, then the particular route can be matched without being
   *      case sensitive
   *
   * @returns {Object} self
   *
   * @description
   * Adds a new route definition to the `$route` service.
   */
  this.when = function(path, route) {
    routes[path] = angular.extend(
      {reloadOnSearch: true},
      route,
      path && pathRegExp(path, route)
    );

    // create redirection for trailing slashes
    if (path) {
      var redirectPath = (path[path.length-1] == '/')
            ? path.substr(0, path.length-1)
            : path +'/';

      routes[redirectPath] = angular.extend(
        {redirectTo: path},
        pathRegExp(redirectPath, route)
      );
    }

    return this;
  };

   /**
    * @param path {string} path
    * @param opts {Object} options
    * @return {?Object}
    *
    * @description
    * Normalizes the given path, returning a regular expression
    * and the original path.
    *
    * Inspired by pathRexp in visionmedia/express/lib/utils.js.
    */
  function pathRegExp(path, opts) {
    var insensitive = opts.caseInsensitiveMatch,
        ret = {
          originalPath: path,
          regexp: path
        },
        keys = ret.keys = [];

    path = path
      .replace(/([().])/g, '\\$1')
      .replace(/(\/)?:(\w+)([\?|\*])?/g, function(_, slash, key, option){
        var optional = option === '?' ? option : null;
        var star = option === '*' ? option : null;
        keys.push({ name: key, optional: !!optional });
        slash = slash || '';
        return ''
          + (optional ? '' : slash)
          + '(?:'
          + (optional ? slash : '')
          + (star && '(.+?)' || '([^/]+)')
          + (optional || '')
          + ')'
          + (optional || '');
      })
      .replace(/([\/$\*])/g, '\\$1');

    ret.regexp = new RegExp('^' + path + '$', insensitive ? 'i' : '');
    return ret;
  }

  /**
   * @ngdoc method
   * @name ngRoute.$routeProvider#otherwise
   * @methodOf ngRoute.$routeProvider
   *
   * @description
   * Sets route definition that will be used on route change when no other route definition
   * is matched.
   *
   * @param {Object} params Mapping information to be assigned to `$route.current`.
   * @returns {Object} self
   */
  this.otherwise = function(params) {
    this.when(null, params);
    return this;
  };


  this.$get = ['$rootScope',
               '$location',
               '$routeParams',
               '$q',
               '$injector',
               '$http',
               '$templateCache',
               '$sce',
      function($rootScope, $location, $routeParams, $q, $injector, $http, $templateCache, $sce) {

    /**
     * @ngdoc object
     * @name ngRoute.$route
     * @requires $location
     * @requires $routeParams
     *
     * @property {Object} current Reference to the current route definition.
     * The route definition contains:
     *
     *   - `controller`: The controller constructor as define in route definition.
     *   - `locals`: A map of locals which is used by {@link ng.$controller $controller} service for
     *     controller instantiation. The `locals` contain
     *     the resolved values of the `resolve` map. Additionally the `locals` also contain:
     *
     *     - `$scope` - The current route scope.
     *     - `$template` - The current route template HTML.
     *
     * @property {Array.<Object>} routes Array of all configured routes.
     *
     * @description
     * `$route` is used for deep-linking URLs to controllers and views (HTML partials).
     * It watches `$location.url()` and tries to map the path to an existing route definition.
     *
     * Requires the {@link ngRoute `ngRoute`} module to be installed.
     *
     * You can define routes through {@link ngRoute.$routeProvider $routeProvider}'s API.
     *
     * The `$route` service is typically used in conjunction with the
     * {@link ngRoute.directive:ngView `ngView`} directive and the
     * {@link ngRoute.$routeParams `$routeParams`} service.
     *
     * @example
       This example shows how changing the URL hash causes the `$route` to match a route against the
       URL, and the `ngView` pulls in the partial.

       Note that this example is using {@link ng.directive:script inlined templates}
       to get it working on jsfiddle as well.

     <example module="ngViewExample" deps="angular-route.js">
       <file name="index.html">
         <div ng-controller="MainCntl">
           Choose:
           <a href="Book/Moby">Moby</a> |
           <a href="Book/Moby/ch/1">Moby: Ch1</a> |
           <a href="Book/Gatsby">Gatsby</a> |
           <a href="Book/Gatsby/ch/4?key=value">Gatsby: Ch4</a> |
           <a href="Book/Scarlet">Scarlet Letter</a><br/>

           <div ng-view></div>
           <hr />

           <pre>$location.path() = {{$location.path()}}</pre>
           <pre>$route.current.templateUrl = {{$route.current.templateUrl}}</pre>
           <pre>$route.current.params = {{$route.current.params}}</pre>
           <pre>$route.current.scope.name = {{$route.current.scope.name}}</pre>
           <pre>$routeParams = {{$routeParams}}</pre>
         </div>
       </file>

       <file name="book.html">
         controller: {{name}}<br />
         Book Id: {{params.bookId}}<br />
       </file>

       <file name="chapter.html">
         controller: {{name}}<br />
         Book Id: {{params.bookId}}<br />
         Chapter Id: {{params.chapterId}}
       </file>

       <file name="script.js">
         angular.module('ngViewExample', ['ngRoute'])

         .config(function($routeProvider, $locationProvider) {
           $routeProvider.when('/Book/:bookId', {
             templateUrl: 'book.html',
             controller: BookCntl,
             resolve: {
               // I will cause a 1 second delay
               delay: function($q, $timeout) {
                 var delay = $q.defer();
                 $timeout(delay.resolve, 1000);
                 return delay.promise;
               }
             }
           });
           $routeProvider.when('/Book/:bookId/ch/:chapterId', {
             templateUrl: 'chapter.html',
             controller: ChapterCntl
           });

           // configure html5 to get links working on jsfiddle
           $locationProvider.html5Mode(true);
         });

         function MainCntl($scope, $route, $routeParams, $location) {
           $scope.$route = $route;
           $scope.$location = $location;
           $scope.$routeParams = $routeParams;
         }

         function BookCntl($scope, $routeParams) {
           $scope.name = "BookCntl";
           $scope.params = $routeParams;
         }

         function ChapterCntl($scope, $routeParams) {
           $scope.name = "ChapterCntl";
           $scope.params = $routeParams;
         }
       </file>

       <file name="scenario.js">
         it('should load and compile correct template', function() {
           element('a:contains("Moby: Ch1")').click();
           var content = element('.doc-example-live [ng-view]').text();
           expect(content).toMatch(/controller\: ChapterCntl/);
           expect(content).toMatch(/Book Id\: Moby/);
           expect(content).toMatch(/Chapter Id\: 1/);

           element('a:contains("Scarlet")').click();
           sleep(2); // promises are not part of scenario waiting
           content = element('.doc-example-live [ng-view]').text();
           expect(content).toMatch(/controller\: BookCntl/);
           expect(content).toMatch(/Book Id\: Scarlet/);
         });
       </file>
     </example>
     */

    /**
     * @ngdoc event
     * @name ngRoute.$route#$routeChangeStart
     * @eventOf ngRoute.$route
     * @eventType broadcast on root scope
     * @description
     * Broadcasted before a route change. At this  point the route services starts
     * resolving all of the dependencies needed for the route change to occurs.
     * Typically this involves fetching the view template as well as any dependencies
     * defined in `resolve` route property. Once  all of the dependencies are resolved
     * `$routeChangeSuccess` is fired.
     *
     * @param {Object} angularEvent Synthetic event object.
     * @param {Route} next Future route information.
     * @param {Route} current Current route information.
     */

    /**
     * @ngdoc event
     * @name ngRoute.$route#$routeChangeSuccess
     * @eventOf ngRoute.$route
     * @eventType broadcast on root scope
     * @description
     * Broadcasted after a route dependencies are resolved.
     * {@link ngRoute.directive:ngView ngView} listens for the directive
     * to instantiate the controller and render the view.
     *
     * @param {Object} angularEvent Synthetic event object.
     * @param {Route} current Current route information.
     * @param {Route|Undefined} previous Previous route information, or undefined if current is
     * first route entered.
     */

    /**
     * @ngdoc event
     * @name ngRoute.$route#$routeChangeError
     * @eventOf ngRoute.$route
     * @eventType broadcast on root scope
     * @description
     * Broadcasted if any of the resolve promises are rejected.
     *
     * @param {Object} angularEvent Synthetic event object
     * @param {Route} current Current route information.
     * @param {Route} previous Previous route information.
     * @param {Route} rejection Rejection of the promise. Usually the error of the failed promise.
     */

    /**
     * @ngdoc event
     * @name ngRoute.$route#$routeUpdate
     * @eventOf ngRoute.$route
     * @eventType broadcast on root scope
     * @description
     *
     * The `reloadOnSearch` property has been set to false, and we are reusing the same
     * instance of the Controller.
     */

    var forceReload = false,
        $route = {
          routes: routes,

          /**
           * @ngdoc method
           * @name ngRoute.$route#reload
           * @methodOf ngRoute.$route
           *
           * @description
           * Causes `$route` service to reload the current route even if
           * {@link ng.$location $location} hasn't changed.
           *
           * As a result of that, {@link ngRoute.directive:ngView ngView}
           * creates new scope, reinstantiates the controller.
           */
          reload: function() {
            forceReload = true;
            $rootScope.$evalAsync(updateRoute);
          }
        };

    $rootScope.$on('$locationChangeSuccess', updateRoute);

    return $route;

    /////////////////////////////////////////////////////

    /**
     * @param on {string} current url
     * @param route {Object} route regexp to match the url against
     * @return {?Object}
     *
     * @description
     * Check if the route matches the current url.
     *
     * Inspired by match in
     * visionmedia/express/lib/router/router.js.
     */
    function switchRouteMatcher(on, route) {
      var keys = route.keys,
          params = {};

      if (!route.regexp) return null;

      var m = route.regexp.exec(on);
      if (!m) return null;

      for (var i = 1, len = m.length; i < len; ++i) {
        var key = keys[i - 1];

        var val = 'string' == typeof m[i]
              ? decodeURIComponent(m[i])
              : m[i];

        if (key && val) {
          params[key.name] = val;
        }
      }
      return params;
    }

    function updateRoute() {
      var next = parseRoute(),
          last = $route.current;

      if (next && last && next.$$route === last.$$route
          && angular.equals(next.pathParams, last.pathParams)
          && !next.reloadOnSearch && !forceReload) {
        last.params = next.params;
        angular.copy(last.params, $routeParams);
        $rootScope.$broadcast('$routeUpdate', last);
      } else if (next || last) {
        forceReload = false;
        $rootScope.$broadcast('$routeChangeStart', next, last);
        $route.current = next;
        if (next) {
          if (next.redirectTo) {
            if (angular.isString(next.redirectTo)) {
              $location.path(interpolate(next.redirectTo, next.params)).search(next.params)
                       .replace();
            } else {
              $location.url(next.redirectTo(next.pathParams, $location.path(), $location.search()))
                       .replace();
            }
          }
        }

        $q.when(next).
          then(function() {
            if (next) {
              var locals = angular.extend({}, next.resolve),
                  template, templateUrl;

              angular.forEach(locals, function(value, key) {
                locals[key] = angular.isString(value) ?
                    $injector.get(value) : $injector.invoke(value);
              });

              if (angular.isDefined(template = next.template)) {
                if (angular.isFunction(template)) {
                  template = template(next.params);
                }
              } else if (angular.isDefined(templateUrl = next.templateUrl)) {
                if (angular.isFunction(templateUrl)) {
                  templateUrl = templateUrl(next.params);
                }
                templateUrl = $sce.getTrustedResourceUrl(templateUrl);
                if (angular.isDefined(templateUrl)) {
                  next.loadedTemplateUrl = templateUrl;
                  template = $http.get(templateUrl, {cache: $templateCache}).
                      then(function(response) { return response.data; });
                }
              }
              if (angular.isDefined(template)) {
                locals['$template'] = template;
              }
              return $q.all(locals);
            }
          }).
          // after route change
          then(function(locals) {
            if (next == $route.current) {
              if (next) {
                next.locals = locals;
                angular.copy(next.params, $routeParams);
              }
              $rootScope.$broadcast('$routeChangeSuccess', next, last);
            }
          }, function(error) {
            if (next == $route.current) {
              $rootScope.$broadcast('$routeChangeError', next, last, error);
            }
          });
      }
    }


    /**
     * @returns the current active route, by matching it against the URL
     */
    function parseRoute() {
      // Match a route
      var params, match;
      angular.forEach(routes, function(route, path) {
        if (!match && (params = switchRouteMatcher($location.path(), route))) {
          match = inherit(route, {
            params: angular.extend({}, $location.search(), params),
            pathParams: params});
          match.$$route = route;
        }
      });
      // No route matched; fallback to "otherwise" route
      return match || routes[null] && inherit(routes[null], {params: {}, pathParams:{}});
    }

    /**
     * @returns interpolation of the redirect path with the parameters
     */
    function interpolate(string, params) {
      var result = [];
      angular.forEach((string||'').split(':'), function(segment, i) {
        if (i === 0) {
          result.push(segment);
        } else {
          var segmentMatch = segment.match(/(\w+)(.*)/);
          var key = segmentMatch[1];
          result.push(params[key]);
          result.push(segmentMatch[2] || '');
          delete params[key];
        }
      });
      return result.join('');
    }
  }];
}

ngRouteModule.provider('$routeParams', $RouteParamsProvider);


/**
 * @ngdoc object
 * @name ngRoute.$routeParams
 * @requires $route
 *
 * @description
 * The `$routeParams` service allows you to retrieve the current set of route parameters.
 *
 * Requires the {@link ngRoute `ngRoute`} module to be installed.
 *
 * The route parameters are a combination of {@link ng.$location `$location`}'s
 * {@link ng.$location#methods_search `search()`} and {@link ng.$location#methods_path `path()`}.
 * The `path` parameters are extracted when the {@link ngRoute.$route `$route`} path is matched.
 *
 * In case of parameter name collision, `path` params take precedence over `search` params.
 *
 * The service guarantees that the identity of the `$routeParams` object will remain unchanged
 * (but its properties will likely change) even when a route change occurs.
 *
 * Note that the `$routeParams` are only updated *after* a route change completes successfully.
 * This means that you cannot rely on `$routeParams` being correct in route resolve functions.
 * Instead you can use `$route.current.params` to access the new route's parameters.
 *
 * @example
 * <pre>
 *  // Given:
 *  // URL: http://server.com/index.html#/Chapter/1/Section/2?search=moby
 *  // Route: /Chapter/:chapterId/Section/:sectionId
 *  //
 *  // Then
 *  $routeParams ==> {chapterId:1, sectionId:2, search:'moby'}
 * </pre>
 */
function $RouteParamsProvider() {
  this.$get = function() { return {}; };
}

ngRouteModule.directive('ngView', ngViewFactory);

/**
 * @ngdoc directive
 * @name ngRoute.directive:ngView
 * @restrict ECA
 *
 * @description
 * # Overview
 * `ngView` is a directive that complements the {@link ngRoute.$route $route} service by
 * including the rendered template of the current route into the main layout (`index.html`) file.
 * Every time the current route changes, the included view changes with it according to the
 * configuration of the `$route` service.
 *
 * Requires the {@link ngRoute `ngRoute`} module to be installed.
 *
 * @animations
 * enter - animation is used to bring new content into the browser.
 * leave - animation is used to animate existing content away.
 *
 * The enter and leave animation occur concurrently.
 *
 * @scope
 * @priority 400
 * @example
    <example module="ngViewExample" deps="angular-route.js" animations="true">
      <file name="index.html">
        <div ng-controller="MainCntl as main">
          Choose:
          <a href="Book/Moby">Moby</a> |
          <a href="Book/Moby/ch/1">Moby: Ch1</a> |
          <a href="Book/Gatsby">Gatsby</a> |
          <a href="Book/Gatsby/ch/4?key=value">Gatsby: Ch4</a> |
          <a href="Book/Scarlet">Scarlet Letter</a><br/>

          <div class="view-animate-container">
            <div ng-view class="view-animate"></div>
          </div>
          <hr />

          <pre>$location.path() = {{main.$location.path()}}</pre>
          <pre>$route.current.templateUrl = {{main.$route.current.templateUrl}}</pre>
          <pre>$route.current.params = {{main.$route.current.params}}</pre>
          <pre>$route.current.scope.name = {{main.$route.current.scope.name}}</pre>
          <pre>$routeParams = {{main.$routeParams}}</pre>
        </div>
      </file>

      <file name="book.html">
        <div>
          controller: {{book.name}}<br />
          Book Id: {{book.params.bookId}}<br />
        </div>
      </file>

      <file name="chapter.html">
        <div>
          controller: {{chapter.name}}<br />
          Book Id: {{chapter.params.bookId}}<br />
          Chapter Id: {{chapter.params.chapterId}}
        </div>
      </file>

      <file name="animations.css">
        .view-animate-container {
          position:relative;
          height:100px!important;
          position:relative;
          background:white;
          border:1px solid black;
          height:40px;
          overflow:hidden;
        }

        .view-animate {
          padding:10px;
        }

        .view-animate.ng-enter, .view-animate.ng-leave {
          -webkit-transition:all cubic-bezier(0.250, 0.460, 0.450, 0.940) 1.5s;
          transition:all cubic-bezier(0.250, 0.460, 0.450, 0.940) 1.5s;

          display:block;
          width:100%;
          border-left:1px solid black;

          position:absolute;
          top:0;
          left:0;
          right:0;
          bottom:0;
          padding:10px;
        }

        .view-animate.ng-enter {
          left:100%;
        }
        .view-animate.ng-enter.ng-enter-active {
          left:0;
        }
        .view-animate.ng-leave.ng-leave-active {
          left:-100%;
        }
      </file>

      <file name="script.js">
        angular.module('ngViewExample', ['ngRoute', 'ngAnimate'],
          function($routeProvider, $locationProvider) {
            $routeProvider.when('/Book/:bookId', {
              templateUrl: 'book.html',
              controller: BookCntl,
              controllerAs: 'book'
            });
            $routeProvider.when('/Book/:bookId/ch/:chapterId', {
              templateUrl: 'chapter.html',
              controller: ChapterCntl,
              controllerAs: 'chapter'
            });

            // configure html5 to get links working on jsfiddle
            $locationProvider.html5Mode(true);
        });

        function MainCntl($route, $routeParams, $location) {
          this.$route = $route;
          this.$location = $location;
          this.$routeParams = $routeParams;
        }

        function BookCntl($routeParams) {
          this.name = "BookCntl";
          this.params = $routeParams;
        }

        function ChapterCntl($routeParams) {
          this.name = "ChapterCntl";
          this.params = $routeParams;
        }
      </file>

      <file name="scenario.js">
        it('should load and compile correct template', function() {
          element('a:contains("Moby: Ch1")').click();
          var content = element('.doc-example-live [ng-view]').text();
          expect(content).toMatch(/controller\: ChapterCntl/);
          expect(content).toMatch(/Book Id\: Moby/);
          expect(content).toMatch(/Chapter Id\: 1/);

          element('a:contains("Scarlet")').click();
          content = element('.doc-example-live [ng-view]').text();
          expect(content).toMatch(/controller\: BookCntl/);
          expect(content).toMatch(/Book Id\: Scarlet/);
        });
      </file>
    </example>
 */


/**
 * @ngdoc event
 * @name ngRoute.directive:ngView#$viewContentLoaded
 * @eventOf ngRoute.directive:ngView
 * @eventType emit on the current ngView scope
 * @description
 * Emitted every time the ngView content is reloaded.
 */
ngViewFactory.$inject = ['$route', '$anchorScroll', '$compile', '$controller', '$animate'];
function ngViewFactory(   $route,   $anchorScroll,   $compile,   $controller,   $animate) {
  return {
    restrict: 'ECA',
    terminal: true,
    priority: 400,
    transclude: 'element',
    link: function(scope, $element, attr, ctrl, $transclude) {
        var currentScope,
            currentElement,
            autoScrollExp = attr.autoscroll,
            onloadExp = attr.onload || '';

        scope.$on('$routeChangeSuccess', update);
        update();

        function cleanupLastView() {
          if (currentScope) {
            currentScope.$destroy();
            currentScope = null;
          }
          if(currentElement) {
            $animate.leave(currentElement);
            currentElement = null;
          }
        }

        function update() {
          var locals = $route.current && $route.current.locals,
              template = locals && locals.$template;

          if (template) {
            var newScope = scope.$new();
            $transclude(newScope, function(clone) {
              clone.html(template);
              $animate.enter(clone, null, currentElement || $element, function onNgViewEnter () {
                if (angular.isDefined(autoScrollExp)
                  && (!autoScrollExp || scope.$eval(autoScrollExp))) {
                  $anchorScroll();
                }
              });

              cleanupLastView();

              var link = $compile(clone.contents()),
                  current = $route.current;

              currentScope = current.scope = newScope;
              currentElement = clone;

              if (current.controller) {
                locals.$scope = currentScope;
                var controller = $controller(current.controller, locals);
                if (current.controllerAs) {
                  currentScope[current.controllerAs] = controller;
                }
                clone.data('$ngControllerController', controller);
                clone.children().data('$ngControllerController', controller);
              }

              link(currentScope);
              currentScope.$emit('$viewContentLoaded');
              currentScope.$eval(onloadExp);
            });
          } else {
            cleanupLastView();
          }
        }
    }
  };
}


})(window, window.angular);
;
/**
 * Create a wrapping module to ease having to include too many
 * modules.
 */
angular.module('ionic.service', [
  'ionic.service.platform',
  'ionic.service.actionSheet',
  'ionic.service.gesture',
  'ionic.service.loading',
  'ionic.service.modal',
  'ionic.service.popup',
  'ionic.service.templateLoad'
]);

angular.module('ionic.ui', [
                            'ionic.ui.content',
                            'ionic.ui.tabs',
                            'ionic.ui.navRouter',
                            'ionic.ui.header',
                            'ionic.ui.sideMenu',
                            'ionic.ui.slideBox',
                            'ionic.ui.list',
                            'ionic.ui.checkbox',
                            'ionic.ui.toggle',
                            'ionic.ui.radio'
                           ]);

angular.module('ionic', [
    'ionic.service',
    'ionic.ui',
    
    // Angular deps
    'ngAnimate',
    'ngRoute',
    'ngTouch',
    'ngSanitize'
]);
;
angular.module('ionic.service.actionSheet', ['ionic.service.templateLoad', 'ionic.ui.actionSheet', 'ngAnimate'])

.factory('ActionSheet', ['$rootScope', '$document', '$compile', '$animate', '$timeout', 'TemplateLoader',
    function($rootScope, $document, $compile, $animate, $timeout, TemplateLoader) {

  return {
    /**
     * Load an action sheet with the given template string.
     *
     * A new isolated scope will be created for the 
     * action sheet and the new element will be appended into the body.
     *
     * @param {object} opts the options for this ActionSheet (see docs)
     */
    show: function(opts) {
      var scope = $rootScope.$new(true);

      angular.extend(scope, opts);


      // Compile the template
      var element = $compile('<action-sheet buttons="buttons"></action-sheet>')(scope);

      // Grab the sheet element for animation
      var sheetEl = angular.element(element[0].querySelector('.action-sheet'));

      var hideSheet = function(didCancel) {
        $animate.leave(sheetEl, function() {
          if(didCancel) {
            opts.cancel();
          }
        });
        
        $timeout(function() {
          $animate.removeClass(element, 'active', function() {
            scope.$destroy();
          });
        });
      };

      scope.cancel = function() {
        hideSheet(true);
      };

      scope.buttonClicked = function(index) {
        // Check if the button click event returned true, which means
        // we can close the action sheet
        if((opts.buttonClicked && opts.buttonClicked(index)) === true) {
          hideSheet(false);
        }
      };

      scope.destructiveButtonClicked = function() {
        // Check if the destructive button click event returned true, which means
        // we can close the action sheet
        if((opts.destructiveButtonClicked && opts.destructiveButtonClicked()) === true) {
          hideSheet(false);
        }
      };

      $document[0].body.appendChild(element[0]);

      var sheet = new ionic.views.ActionSheet({el: element[0] });
      scope.sheet = sheet;

      $animate.addClass(element, 'active');
      $animate.enter(sheetEl, element, function() {
      });

      return sheet;
    }
  };

}]);
;
angular.module('ionic.service.gesture', [])

.factory('Gesture', [function() {
  return {
    on: function(eventType, cb, $element) {
      return window.ionic.onGesture(eventType, cb, $element[0]);
    },
    off: function(gesture, eventType, cb) {
      return window.ionic.offGesture(gesture, eventType, cb);
    }
  };
}]);
;
angular.module('ionic.service.loading', ['ionic.ui.loading'])

.factory('Loading', ['$rootScope', '$document', '$compile', function($rootScope, $document, $compile) {
  return {
    /**
     * Load an action sheet with the given template string.
     *
     * A new isolated scope will be created for the 
     * action sheet and the new element will be appended into the body.
     *
     * @param {object} opts the options for this ActionSheet (see docs)
     */
    show: function(opts) {
      var defaults = {
        content: '',
        animation: 'fade-in',
        showBackdrop: true,
        maxWidth: 200,
        showDelay: 2000
      };

      opts = angular.extend(defaults, opts);

      var scope = $rootScope.$new(true);
      angular.extend(scope, opts);

      // Make sure there is only one loading element on the page at one point in time
      var existing = angular.element($document[0].querySelector('.loading-backdrop'));
      if(existing.length) {
        var scope = existing.scope();
        if(scope.loading) {
          scope.loading.show();
          return scope.loading;
        }
      }

      // Compile the template
      var element = $compile('<loading>' + opts.content + '</loading>')(scope);

      $document[0].body.appendChild(element[0]);

      var loading = new ionic.views.Loading({
        el: element[0],
        maxWidth: opts.maxWidth,
        showDelay: opts.showDelay
      });

      loading.show();

      scope.loading = loading;

      return loading;
    }
  };
}]);
;
angular.module('ionic.service.modal', ['ionic.service.templateLoad', 'ngAnimate'])


.factory('Modal', ['$rootScope', '$document', '$compile', '$animate', '$q', 'TemplateLoader', function($rootScope, $document, $compile, $animate, $q, TemplateLoader) {
  var ModalView = ionic.views.Modal.inherit({
    initialize: function(opts) {
      ionic.views.Modal.prototype.initialize.call(this, opts);
      this.animation = opts.animation || 'slide-in-up';
    },
    // Show the modal
    show: function() {
      var _this = this;
      var element = angular.element(this.el);
      if(!element.parent().length) {
        $animate.enter(element, angular.element($document[0].body), null, function() {
          ionic.views.Modal.prototype.show.call(_this);
        });
      } 
      $animate.addClass(element, this.animation, function() {
      });
    },
    // Hide the modal
    hide: function() {
      var element = angular.element(this.el);
      $animate.removeClass(element, this.animation);

      ionic.views.Modal.prototype.hide.call(this);
    },

    // Remove and destroy the modal scope
    remove: function() {
      var element = angular.element(this.el);
      $animate.leave(angular.element(this.el), function() {
        scope.$destroy();
      });
    }
  });

  var createModal = function(templateString, options) {
    // Create a new scope for the modal
    var scope = options.scope && options.scope.$new() || $rootScope.$new(true);

    // Compile the template
    var element = $compile(templateString)(scope);

    options.el = element[0];
    var modal = new ModalView(options);

    // If this wasn't a defined scope, we can assign 'modal' to the isolated scope
    // we created
    if(!options.scope) {
      scope.modal = modal;
    }

    return modal;
  };

  return {
    /**
     * Load a modal with the given template string.
     *
     * A new isolated scope will be created for the 
     * modal and the new element will be appended into the body.
     */
    fromTemplate: function(templateString, options) {
      var modal = createModal(templateString, options || {});
      return modal;
    },
    fromTemplateUrl: function(url, cb, options) {
      TemplateLoader.load(url).then(function(templateString) {
        var modal = createModal(templateString, options || {});
        cb(modal);
      });
    },
  };
}]);
;
(function() {
'use strict';

angular.module('ionic.service.platform', [])

/**
 * The platformProvider makes it easy to set and detect which platform
 * the app is currently running on. It has some auto detection built in
 * for PhoneGap and Cordova. This provider also takes care of
 * initializing some defaults that depend on the platform, such as the
 * height of header bars on iOS 7.
 */
.provider('Platform', function() {
  var platform = 'web';
  var isPlatformReady = false;

  if(window.cordova || window.PhoneGap || window.phonegap) {
    platform = 'cordova';
  }

  var isReady = function() {
    if(platform == 'cordova') {
      return window.device || window.Cordova;
    }
    return true;
  };

  // We need to do some stuff as soon as we know the platform,
  // like adjust header margins for iOS 7, etc.
  setTimeout(function afterReadyWait() {
    if(isReady()) {
      ionic.Platform.detect();
    } else {
      setTimeout(afterReadyWait, 50);
    }
  }, 10);

  return {
    setPlatform: function(p) {
      platform = p;
    },
    $get: ['$q', '$timeout', function($q, $timeout) {
      return {
        /**
         * Some platforms have hardware back buttons, so this is one way to bind to it.
         *
         * @param {function} cb the callback to trigger when this event occurs
         */
        onHardwareBackButton: function(cb) {
          this.ready(function() {
            document.addEventListener('backbutton', cb, false);
          });
        },

        /**
         * Remove an event listener for the backbutton.
         *
         * @param {function} fn the listener function that was originally bound.
         */
        offHardwareBackButton: function(fn) {
          this.ready(function() {
            document.removeEventListener('backbutton', fn);
          });
        },

        /**
         * Trigger a callback once the device is ready, or immediately if the device is already
         * ready.
         */
        ready: function(cb) {
          var self = this;
          var q = $q.defer();

          $timeout(function readyWait() {
            if(isReady()) {
              isPlatformReady = true;
              q.resolve();
              cb();
            } else {
              $timeout(readyWait, 50);
            }
          }, 50);

          return q.promise;
        }
      };
    }]
  };
});

})(ionic);
;
angular.module('ionic.service.popup', ['ionic.service.templateLoad'])


.factory('Popup', ['$rootScope', '$document', '$compile', 'TemplateLoader', function($rootScope, $document, $compile, TemplateLoader) {

  var getPopup = function() {
    // Make sure there is only one loading element on the page at one point in time
    var existing = angular.element($document[0].querySelector('.popup'));
    if(existing.length) {
      var scope = existing.scope();
      if(scope.popup) {
        return scope;
      }
    }
  };

  return {
    alert: function(message, $scope) {

      // If there is an existing popup, just show that one
      var existing = getPopup();
      if(existing) {
        return existing.popup.alert(message);
      }

      var defaults = {
        title: message,
        animation: 'fade-in',
      };

      opts = angular.extend(defaults, opts);

      var scope = $scope && $scope.$new() || $rootScope.$new(true);
      angular.extend(scope, opts);

      // Compile the template
      var element = $compile('<popup>' + opts.content + '</popup>')(scope);
      $document[0].body.appendChild(element[0]);

      var popup = new ionic.views.Popup({el: element[0] });
      popup.alert(message);

      scope.popup = popup;

      return popup;
    },
    confirm: function(cb) {
    },
    prompt: function(cb) {
    },
    show: function(data) {
      // data.title
      // data.template
      // data.buttons
    }
  };
}]);
;
angular.module('ionic.service.templateLoad', [])

.factory('TemplateLoader', ['$q', '$http', '$templateCache', function($q, $http, $templateCache) {
  return {
    load: function(url) {
      var deferred = $q.defer();

      $http({
        method: 'GET',
        url: url,
        cache: $templateCache
      }).success(function(html) {
        deferred.resolve(html && html.trim());
      }).error(function(err) {
        deferred.reject(err);
      });

      return deferred.promise;
    }
  };
}]);
;
(function() {
'use strict';

angular.module('ionic.ui.actionSheet', [])

.directive('actionSheet', function($document) {
  return {
    restrict: 'E',
    scope: true,
    replace: true,
    link: function($scope, $element){
      var keyUp = function(e) {
        if(e.which == 27) {
          $scope.cancel();
          $scope.$apply();
        }
      };

      var backdropClick = function(e) {
        if(e.target == $element[0]) {
          $scope.cancel();
          $scope.$apply();
        }
      };
      $scope.$on('$destroy', function() {
        $element.remove();
        $document.unbind('keyup', keyUp);
        $element.unbind('click', backdropClick);
      });

      $document.bind('keyup', keyUp);
      $element.bind('click', backdropClick);
    },
    template: '<div class="action-sheet-backdrop">' +
                '<div class="action-sheet action-sheet-up">' +
                  '<div class="action-sheet-group">' +
                    '<div class="action-sheet-title" ng-if="titleText">{{titleText}}</div>' +
                    '<button class="button" ng-click="buttonClicked($index)" ng-repeat="button in buttons">{{button.text}}</button>' +
                  '</div>' +
                  '<div class="action-sheet-group" ng-if="destructiveText">' +
                    '<button class="button destructive" ng-click="destructiveButtonClicked()">{{destructiveText}}</button>' +
                  '</div>' +
                  '<div class="action-sheet-group" ng-if="cancelText">' +
                    '<button class="button" ng-click="cancel()">{{cancelText}}</button>' +
                  '</div>' +
                '</div>' +
              '</div>'
  };
});

})();
;
(function(ionic) {
'use strict';

angular.module('ionic.ui.header', ['ngAnimate'])


.directive('headerBar', function() {
  return {
    restrict: 'E',
    replace: true,
    transclude: true,
    template: '<header class="bar bar-header">\
                <div class="buttons">\
                  <button ng-repeat="button in leftButtons" class="button" ng-class="button.type" ng-click="button.click($event, $index)" ng-bind-html="button.content">\
                  </button>\
                </div>\
                <h1 class="title" ng-bind-html="title"></h1>\
                <div class="buttons">\
                  <button ng-repeat="button in rightButtons" class="button" ng-class="button.type" ng-click="button.click($event, $index)" ng-bind-html="button.content">\
                  </button>\
                </div>\
              </header>',

    scope: {
      leftButtons: '=',
      rightButtons: '=',
      title: '=',
      type: '@',
      alignTitle: '@'
    },

    link: function($scope, $element, $attr) {
      var hb = new ionic.views.HeaderBar({
        el: $element[0],
        alignTitle: $scope.alignTitle || 'center'
      });

      $element.addClass($scope.type);

      $scope.headerBarView = hb;

      $scope.$watch('leftButtons', function(val) {
        // Resize the title since the buttons have changed
        hb.align();
      });

      $scope.$watch('rightButtons', function(val) {
        // Resize the title since the buttons have changed
        hb.align();
      });

      $scope.$watch('title', function(val) {
        // Resize the title since the title has changed
        console.log('Title changed');
        hb.align();
      });

      $scope.$on('$destroy', function() {
        //
      });
    }
  };
})

.directive('footerBar', function() {
  return {
    restrict: 'E',
    replace: true,
    transclude: true,
    template: '<footer class="bar bar-footer" ng-transclude>\
              </footer>',

    scope: {
      type: '@',
    },

    link: function($scope, $element, $attr) {
      $element.addClass($scope.type);
    }
  };
});

})(ionic);
;
(function() {
'use strict';

angular.module('ionic.ui.checkbox', [])


.directive('checkbox', function() {
  return {
    restrict: 'E',
    replace: true,
    require: '?ngModel',
    scope: {},
    transclude: true,
    template: '<label ng-click="tapHandler($event)" class="checkbox"><input type="checkbox"><div ng-transclude></div></label>',
  

    link: function($scope, $element, $attr, ngModel) {
      var checkbox;

      if(!ngModel) { return; }

      checkbox = $element.children().eq(0);

      if(!checkbox.length) { return; }

      $scope.tapHandler = function(e) {
        if(e.type != 'click') {
          checkbox[0].checked = !checkbox[0].checked;
        }
        ngModel.$setViewValue(checkbox[0].checked);
        e.alreadyHandled = true;
      };

      var clickHandler = function(e) {
        checkbox[0].checked = !checkbox[0].checked;
        $scope.$apply(function() {
          ngModel.$setViewValue(checkbox[0].checked);
        });
      };

      if(ngModel) {
        ngModel.$render = function() {
          checkbox[0].checked = ngModel.$viewValue;
        };
      }
    }
  };
});

})();
;
(function() {
'use strict';

angular.module('ionic.ui.content', [])

/**
 * Panel is a simple 100% width and height, fixed panel. It's meant for content to be
 * added to it, or animated around.
 */
.directive('pane', function() {
  return {
    restrict: 'E',
    link: function(scope, element, attr) {
      element.addClass('pane');
    }
  }
})

// The content directive is a core scrollable content area
// that is part of many View hierarchies
.directive('content', ['$parse', function($parse) {
  return {
    restrict: 'E',
    replace: true,
    template: '<div class="scroll-content"><div class="scroll"></div></div>',
    transclude: true,
    scope: {
      onRefresh: '&',
      onRefreshOpening: '&',
      refreshComplete: '=',
      scroll: '@'
    },
    compile: function(element, attr, transclude) {
      return function($scope, $element, $attr) {
        var c = $element.eq(0);

        var scroll = $element[0].querySelector('.scroll');

        if(scroll && attr.padding) {
          scroll.classList.add('padding');
        }

        if(attr.hasHeader == "true") {
          c.addClass('has-header');
        }
        if(attr.hasSubheader == "true") {
          c.addClass('has-subheader');
        }
        if(attr.hasFooter == "true") {
          c.addClass('has-footer');
        }
        if(attr.hasTabs == "true") {
          c.addClass('has-tabs');
        }

        if(attr.refreshComplete) {
          $scope.refreshComplete = function() {
            if($scope.scrollView) {
              $scope.scrollView.doneRefreshing();
              $scope.$parent.$broadcast('scroll.onRefreshComplete');
            }
          };
        }

        // If they want plain overflow scrolling, add that as a class
        if($scope.scroll === "false") {
        } else if(attr.overflowScroll === "true") {
          c.addClass('overflow-scroll');
        } else {
          // Otherwise, supercharge this baby!
          var sv = new ionic.views.Scroll({
            el: $element[0].firstElementChild,
            hasPullToRefresh: (typeof $scope.onRefresh !== 'undefined'),
            onRefresh: function() {
              $scope.onRefresh();
              $scope.$parent.$broadcast('scroll.onRefresh');
            },
            onRefreshOpening: function(amt) {
              $scope.onRefreshOpening({amount: amt});
              $scope.$parent.$broadcast('scroll.onRefreshOpening', amt);
            }
          });
          // Let child scopes access this 
          $scope.scrollView = sv;
        }

        // Pass the parent scope down to the child
        var clone = transclude($scope.$parent);
        angular.element($element[0].firstElementChild).append(clone);
      };
    }
  };
}])

.directive('refresher', function() {
  return {
    restrict: 'E',
    replace: true,
    require: ['^?content', '^?list'],
    template: '<div class="scroll-refresher"><div class="ionic-refresher-content"><div class="ionic-refresher"></div></div></div>',
    scope: true,
    link: function($scope, $element, $attr, scrollCtrl) {
      var icon = $element[0].querySelector('.ionic-refresher');

      // Scale up the refreshing icon
      var onRefreshOpening = ionic.throttle(function(e, amt) {
        icon.style[ionic.CSS.TRANSFORM] = 'scale(' + Math.min((1 + amt), 2) + ')';
      }, 100);

      $scope.$on('scroll.onRefresh', function(e) {
        icon.style[ionic.CSS.TRANSFORM] = 'scale(2)';
      });

      $scope.$on('scroll.onRefreshOpening', onRefreshOpening);
    }
  }
})

.directive('scroll-refresher', function() {
  return {
    restrict: 'E',
    replace: true,
    transclude: true,
    template: '<div class="scroll-refresher"><div class="scroll-refresher-content"></div></div>'
  }
});


})();
;
(function() {
'use strict';

angular.module('ionic.ui.list', ['ngAnimate'])

.directive('linkItem', ['$timeout', function($timeout) {
  return {
    restrict: 'E',
    require: ['?^list'],
    replace: true,
    transclude: true,
    scope: {
      item: '=',
      onSelect: '&',
      onDelete: '&',
      canDelete: '@',
      canReorder: '@',
      canSwipe: '@',
      buttons: '=',
      type: '@',
      href: '@'
    },
    template: '<a href="{{href}}" class="item">\
            <div class="item-edit" ng-if="canDelete && isEditing">\
              <button class="button button-icon" ng-click="onDelete()"><i ng-class="deleteIcon"></i></button>\
            </div>\
            <div class="item-content slide-left" ng-transclude>\
            </div>\
             <div class="item-drag" ng-if="canReorder && isEditing">\
               <button data-ionic-action="reorder" class="button button-icon"><i ng-class="reorderIcon"></i></button>\
             </div>\
            <div class="item-options" ng-if="canSwipe && !isEditing && showOptions">\
             <button ng-click="buttonClicked(button)" class="button" ng-class="button.type" ng-repeat="button in buttons">{{button.text}}</button>\
           </div>\
          </a>',

    link: function($scope, $element, $attr, list) {
      // Grab the parent list controller
      if(list[0]) {
        list = list[0];
      } else if(list[1]) {
        list = list[1];
      }

      $attr.$observe('href', function(value) {
        $scope.href = value;
      });

      // Add the list item type class
      $element.addClass($attr.type || 'item-complex');

      if($attr.type !== 'item-complex') {
        $scope.canSwipe = false;
      }

      $scope.isEditing = false;
      $scope.deleteIcon = list.scope.deleteIcon;
      $scope.reorderIcon = list.scope.reorderIcon;
      $scope.showOptions = true;

      $scope.buttonClicked = function(button) {
        button.onButtonClicked && button.onButtonClicked($scope.item, button);
      };

      list.scope.$watch('isEditing', function(v) {
        $scope.isEditing = v;

        // Add a delay before we allow the options layer to show, to avoid any odd
        // animation issues
        if(!v) {
          $timeout(function() {
            $scope.showOptions = true;
          }, 200);
        } else {
          $scope.showOptions = false;
        }
      });
    }
  };
}])

.directive('item', ['$timeout', function($timeout) {
  return {
    restrict: 'E',
    require: ['?^list'],
    replace: true,
    transclude: true,
    scope: {
      item: '=',
      onSelect: '&',
      onDelete: '&',
      canDelete: '@',
      canReorder: '@',
      canSwipe: '@',
      buttons: '=',
      type: '@',
    },
    template: '<li class="item">\
            <div class="item-edit" ng-if="canDelete && isEditing">\
              <button class="button button-icon" ng-click="onDelete()"><i ng-class="deleteIcon"></i></button>\
            </div>\
            <div class="item-content slide-left" ng-transclude>\
            </div>\
             <div class="item-drag" ng-if="canReorder && isEditing">\
               <button data-ionic-action="reorder" class="button button-icon"><i ng-class="reorderIcon"></i></button>\
             </div>\
            <div class="item-options" ng-if="canSwipe && !isEditing && showOptions">\
             <button ng-click="buttonClicked(button)" class="button" ng-class="button.type" ng-repeat="button in buttons">{{button.text}}</button>\
           </div>\
          </li>',

    link: function($scope, $element, $attr, list) {
      // Grab the parent list controller
      if(list[0]) {
        list = list[0];
      } else if(list[1]) {
        list = list[1];
      }

      // Add the list item type class
      $element.addClass($attr.type || 'item-complex');

      if($attr.type !== 'item-complex') {
        $scope.canSwipe = false;
      }

      $scope.isEditing = false;
      $scope.deleteIcon = list.scope.deleteIcon;
      $scope.reorderIcon = list.scope.reorderIcon;
      $scope.showOptions = true;

      $scope.buttonClicked = function(button) {
        button.onButtonClicked && button.onButtonClicked($scope.item, button);
      };

      list.scope.$watch('isEditing', function(v) {
        $scope.isEditing = v;

        // Add a delay before we allow the options layer to show, to avoid any odd
        // animation issues
        if(!v) {
          $timeout(function() {
            $scope.showOptions = true;
          }, 200);
        } else {
          $scope.showOptions = false;
        }
      });
    }
  };
}])

.directive('list', function() {
  return {
    restrict: 'E',
    replace: true,
    transclude: true,

    scope: {
      isEditing: '=',
      deleteIcon: '@',
      reorderIcon: '@',
      hasPullToRefresh: '@',
      onRefresh: '&',
      onRefreshOpening: '&',
      onReorder: '&',
      refreshComplete: '='
    },

    controller: function($scope) {
      var _this = this;

      this.scope = $scope;

      $scope.$watch('isEditing', function(v) {
        _this.isEditing = true;
      });
    },

    template: '<ul class="list" ng-class="{\'list-editing\': isEditing}" ng-transclude>\
              </ul>',

    link: function($scope, $element, $attr) {
      var lv = new ionic.views.ListView({
        el: $element[0],
        listEl: $element[0].children[0],
        hasPullToRefresh: ($scope.hasPullToRefresh !== 'false'),
        onRefresh: function() {
          $scope.onRefresh();
          $scope.$parent.$broadcast('scroll.onRefresh');
        },
        onRefreshOpening: function(amt) {
          $scope.onRefreshOpening({amount: amt});
          $scope.$parent.$broadcast('scroll.onRefreshOpening', amt);
        },
        onReorder: function(el, oldIndex, newIndex) {
          console.log('Moved', el,oldIndex,newIndex);
          $scope.$apply(function() {
            $scope.onReorder({el: el, start: oldIndex, end: newIndex});
          });
        }
      });

      $scope.listView = lv;

      if($attr.refreshComplete) {
        $scope.refreshComplete = function() {
          lv.doneRefreshing();
          $scope.$parent.$broadcast('scroll.onRefreshComplete');
        };
      }

      if($attr.animation) {
        $element.addClass($attr.animation);
      }
    }
  };
});

})();
;
(function() {
'use strict';

angular.module('ionic.ui.loading', [])

.directive('loading', function() {
  return {
    restrict: 'E',
    replace: true,
    transclude: true,
    link: function($scope, $element){
      $scope.$on('$destroy', function() {
        $element.remove();
      });
      $element.addClass($scope.animation || '');
    },
    template: '<div class="loading-backdrop" ng-class="{enabled: showBackdrop}">' + 
                '<div class="loading" ng-transclude>' +
                '</div>' +
              '</div>'
  };
});

})();
;
(function() {
'use strict';

/**
 * Note: currently unused
 */

/**
 * @description
 * The NavController is a navigation stack View Controller modelled off of 
 * UINavigationController from Cocoa Touch. With the Nav Controller, you can
 * "push" new "pages" on to the navigation stack, and then pop them off to go
 * back. The NavController controls a navigation bar with a back button and title
 * which updates as the pages switch.
 *
 * The NavController makes sure to not recycle scopes of old pages
 * so that a pop will still show the same state that the user left.
 *
 * However, once a page is popped, its scope is destroyed and will have to be
 * recreated then next time it is pushed.
 *
 */
angular.module('ionic.ui.nav', ['ionic.service.templateLoad', 'ionic.service.gesture', 'ionic.service.platform', 'ngAnimate'])

.controller('NavCtrl', ['$scope', '$element', '$animate', '$compile', '$timeout', 'TemplateLoader', 'Platform', function($scope, $element, $animate, $compile, $timeout, TemplateLoader, Platform) {
  var _this = this;

  angular.extend(this, ionic.controllers.NavController.prototype);

  var pushInAnimation = $scope.pushInAnimation || 'slide-in-left';
  var pushOutAnimation = $scope.pushOutAnimation || 'slide-out-left';
  var popInAnimation = $scope.popInAnimation || 'slide-in-right';
  var popOutAnimation = $scope.popOutAnimation || 'slide-out-right';

  // Remove some push classnames
  var cleanElementAnimations = function(el) {
    el.removeClass(pushInAnimation);
    el.removeClass(pushOutAnimation);
    el.removeClass(popInAnimation);
    el.removeClass(popOutAnimation);
  }

  /**
   * Push a template onto the navigation stack.
   * @param {string} templateUrl the URL of the template to load.
   */
  this.pushFromTemplate = function(templateUrl) {
    var childScope = $scope.$new();
    var last = _this.getTopController();

    // Load the given template
    TemplateLoader.load(templateUrl).then(function(templateString) {

      // Compile the template with the new scope, and append
      // it to the navigation's content area
      var el = $compile(templateString)(childScope, function(cloned, scope) {

        // If there was a last controller, remove it and mark the new
        // one to animate
        if(last) {
          // Push animate
          cleanElementAnimations(last.element);
          $animate.addClass(last.element, pushOutAnimation, function() {
            last.element[0].style.display = 'none';
            last.element.removeClass(pushOutAnimation);
          });

        }


        if(last) {
          // We will need to animate in the new page since we have an old page
          cloned.addClass(pushInAnimation);
          $animate.addClass(cloned, pushInAnimation);
        }

        $animate.enter(cloned, $element, null, function() {
        });

      });
    });
  };

  // Pop function
  this.popController = function() {
    var last = _this.pop();

    var next = _this.getTopController();

    if(last) {

      cleanElementAnimations(last.element);
      $animate.addClass(last.element, popOutAnimation, function() {
        last.scope.$destroy();
        last.element.remove();
      });
    }

    // Animate the next one in
    if(next) {
      cleanElementAnimations(next.element);
      $animate.addClass(next.element, popInAnimation)
      next.element[0].style.display = 'block';
    }

    $scope.$parent.$broadcast('navigation.pop');
  };


  // Extend the low-level navigation controller
  // for this angular controller
  ionic.controllers.NavController.call(this, {
    content: {
    },
    navBar: {
      shouldGoBack: function() {
      },
      show: function() {
        this.isVisible = true;
      },
      hide: function() {
        this.isVisible = false;
      },
      setTitle: function(title) {
        $scope.navController.title = title;
      },
      showBackButton: function(show) {
      },
    }
  });

  // Support Android hardware back button (native only, not mobile web)
  var onHardwareBackButton = function(e) {
    $scope.$apply(function() {
      _this.popController();
    });
  }
  Platform.onHardwareBackButton(onHardwareBackButton);


  this.handleDrag = function(e) {
    // TODO: Support dragging between pages
  };

  this.endDrag = function(e) {
  };

  /**
   * Push a controller to the stack. This is called by the child
   * nav-content directive when it is linked to a scope on the page.
   */
  $scope.pushController = function(scope, element) {
    _this.push({
      scope: scope,
      element: element
    });
    $scope.$parent.$broadcast('navigation.push', scope);
  };

  this.pushController = function(scope, element) {
    _this.push({
      scope: scope,
      element: element
    });
    $scope.$parent.$broadcast('navigation.push', scope);
  };

  $scope.navController = this;

  $scope.$on('$destroy', function() {
    // Remove back button listener
    Platform.offHardwareBackButton(onHardwareBackButton);
  });
}])

/**
 * The main directive for the controller.
 */
.directive('navigation', function() {
  return {
    restrict: 'E',
    replace: true,
    transclude: true,
    controller: 'NavCtrl',
    //templateUrl: 'ext/angular/tmpl/ionicTabBar.tmpl.html',
    template: '<div class="view" ng-transclude></div>',
    scope: {
      first: '@',
      pushAnimation: '@',
      popAnimation: '@'
    },
    link: function($scope, $element, $attr, navCtrl) {
      $scope.pushAnimation = $scope.pushAnimation || 'slide-in-left';
      $scope.popAnimation = $scope.popAnimation || 'slide-out-left';

      if($scope.first) {
        navCtrl.pushFromTemplate($scope.first);
      }
    }
  };
})

/**
 * Our Nav Bar directive which updates as the controller state changes.
 */
.directive('navBar', function() {
  return {
    restrict: 'E',
    require: '^navigation',
    replace: true,
    scope: {
      type: '@',
      backButtonType: '@',
      backButtonLabel: '@',
      backButtonIcon: '@',
      alignTitle: '@'
    },
    template: '<header class="bar bar-header nav-bar" ng-class="{hidden: !navController.navBar.isVisible}">' + 
        '<button ng-click="goBack()" class="button" ng-if="navController.controllers.length > 1" ng-class="backButtonType" ng-bind-html="backButtonContent"></button>' +
        '<h1 class="title">{{navController.getTopController().scope.title}}</h1>' + 
      '</header>',
    link: function($scope, $element, $attr, navCtrl) {
      var backButton;

      $scope.backButtonContent = '';

      if($scope.backButtonIcon) {
        $scope.backButtonContent += '<i class="icon ' + $scope.backButtonIcon + '"></i>';
      }
      if($scope.backButtonLabel) {
        $scope.backButtonContent += ' ' + $scope.backButtonLabel
      }


      $scope.navController = navCtrl;

      $scope.goBack = function() {
        navCtrl.popController();
      };


      var hb = new ionic.views.HeaderBar({
        el: $element[0],
        alignTitle: $scope.alignTitle || 'center'
      });

      $element.addClass($scope.type);

      $scope.headerBarView = hb;

      $scope.$parent.$on('navigation.push', function() {
        backButton = angular.element($element[0].querySelector('.button'));
        backButton.addClass($scope.backButtonType);
        hb.align();
      });
      $scope.$parent.$on('navigation.pop', function() {
        hb.align();
      });

      $scope.$on('$destroy', function() {
        //
      });
    }
  };
})

.directive('navPage', ['Gesture', '$animate', '$compile', function(Gesture, $animate, $compile) {

  return {
    restrict: 'AC',
    require: '^navigation',
    link: function($scope, $element, $attr, navCtrl) {
      var lastParent, lastIndex, childScope, childElement;

      // Store that we should go forwards on the animation. This toggles
      // based on the visibility sequence (to support reverse transitions)
      var lastDirection = null;

      $scope.title = $attr.title;

      if($attr.navBar === "false") {
        navCtrl.hideNavBar();
      } else {
        navCtrl.showNavBar();
      }

      $scope.$on('$destroy', function() {
        if(childElement) {
          childElement.remove();
        }
      });
    
      // Push this controller onto the stack
      navCtrl.pushController($scope, $element);
    }
  }
}])

/**
 * Tell the nav controller in the current scope to push a new
 * controller onto the stack, with the given template URL.
 */
.directive('navPush', function() {
  return {
    restrict: 'A',
    link: function($scope, $element, $attr) {
      var templateUrl = $attr.navPush;

      var pushTemplate = ionic.throttle(function(e) {
        $scope.$apply(function() {
          $scope.navController && $scope.navController.pushFromTemplate(templateUrl);
        });
        return false;
      }, 300, {
        trailing: false
      });

      $element.bind('tap', pushTemplate);

      $scope.$on('$destroy', function() {
        $element.unbind('tap', pushTemplate);
      });
    }
  }
})

/**
 * Tell the nav controller in the current scope to pop the top controller
 * and go back in the stack.
 */
.directive('navPop', function() {
  return {
    restrict: 'A',
    link: function($scope, $element, $attr, navCtrl) {
      var popTemplate = ionic.throttle(function(e) {
        $scope.$apply(function() {
          $scope.navController && navController.pop();
        });
        return false;
      }, 300, {
        trailing: false
      });

      $element.bind('tap', popTemplate);

      $scope.$on('$destroy', function() {
        $element.unbind('tap', popTemplate);
      });
    }
  }
})

})();
;
(function() {
'use strict';

/**
 * @description
 * The NavController is a navigation stack View Controller modelled off of 
 * UINavigationController from Cocoa Touch. With the Nav Controller, you can
 * "push" new "pages" on to the navigation stack, and then pop them off to go
 * back. The NavController controls a navigation bar with a back button and title
 * which updates as the pages switch.
 *
 * The NavController makes sure to not recycle scopes of old pages
 * so that a pop will still show the same state that the user left.
 *
 * However, once a page is popped, its scope is destroyed and will have to be
 * recreated then next time it is pushed.
 *
 */

var actualLocation = null;

angular.module('ionic.ui.navRouter', ['ionic.service.gesture'])

.run(['$rootScope', function($rootScope) {
  $rootScope.stackCursorPosition = 0;
}])

.directive('navRouter', ['$rootScope', '$timeout', '$location', '$window', '$route', function($rootScope, $timeout, $location, $window, $route) {
  return {
    restrict: 'AC',
    // So you can require being under this
    controller: ['$scope', '$element', function($scope, $element) {
      this.navBar = {
        isVisible: true
      };
      $scope.navController = this;
    }],

    link: function($scope, $element, $attr) {
      $scope.animation = $attr.animation;

      $element.addClass('noop-animation');

      var isFirst = true;

      var initTransition = function() {
        //$element.addClass($scope.animation);
      };

      var reverseTransition = function() {
        $element.removeClass('noop-animation');
        $element.addClass($scope.animation);
        $element.addClass('reverse');
      };

      var forwardTransition = function() {
        $element.removeClass('noop-animation');
        $element.removeClass('reverse');
        $element.addClass($scope.animation);
      };

      $scope.$on('$routeChangeSuccess', function(e, a) {
      });
      $scope.$on('$routeChangeStart', function(e, next, current) {
        var back, historyState = $window.history.state;

        back = !!(historyState && historyState.position <= $rootScope.stackCursorPosition);

        if(isFirst || (next && next.$$route.originalPath === "")) {
          // Don't animate
          return;
        }

        if(back) {
          reverseTransition();
        } else {
          forwardTransition();
        }
      });

      $scope.$on('$locationChangeSuccess', function(a, b, c) {
        // Store the new location
        $rootScope.actualLocation = $location.path();
        if(isFirst && $location.path() !== '/') {
          isFirst = false;
        }
      });  


      // Keep track of location changes and update a stack pointer that tracks whether we are
      // going forwards or back
      $scope.$watch(function () { return $location.path() }, function (newLocation, oldLocation) {
        if($rootScope.actualLocation === newLocation) {

          if(oldLocation == '' && newLocation == '/') {
            // initial route, skip this
            return;
          }

          var back, historyState = $window.history.state;

          back = !!(historyState && historyState.position <= $rootScope.stackCursorPosition);

          if (back) {
            //back button
            $rootScope.stackCursorPosition--;
          } else {
            //forward button
            $rootScope.stackCursorPosition++;
          }

        } else {
          var currentRouteBeforeChange = $route.current;

          if (currentRouteBeforeChange) {

            $window.history.replaceState({
              position: $rootScope.stackCursorPosition
            });

            $rootScope.stackCursorPosition++;
          }
        }
      });
    }
  }
}])

/**
 * Our Nav Bar directive which updates as the controller state changes.
 */
.directive('navBar', ['$rootScope', '$animate', '$compile', function($rootScope, $animate, $compile) {

  /**
   * Perform an animation between one tab bar state and the next.
   * Right now this just animates the titles.
   */
  var animate = function($scope, $element, oldTitle, data, cb) {
    var title, nTitle, oTitle, titles = $element[0].querySelectorAll('.title');

    var newTitle = data.title;
    if(!oldTitle || oldTitle === newTitle) {
      cb();
      return;
    }

    // Clone the old title and add a new one so we can show two animating in and out
    title = angular.element(titles[0]);
    oTitle = $compile('<h1 class="title" ng-bind="oldTitle"></h1>')($scope);
    title.replaceWith(oTitle);
    nTitle = $compile('<h1 class="title" ng-bind="currentTitle"></h1>')($scope);

    var insert = $element[0].firstElementChild || null;

    // Insert the new title
    $animate.enter(nTitle, $element, insert && angular.element(insert), function() {
      cb();
    });

    // Remove the old title
    $animate.leave(angular.element(oTitle), function() {
    });
  };

  return {
    restrict: 'E',
    require: '^navRouter',
    replace: true,
    scope: {
      type: '@',
      backButtonType: '@',
      backButtonLabel: '@',
      backButtonIcon: '@',
      alignTitle: '@',
    },
    template: '<header class="bar bar-header nav-bar" ng-class="{hidden: !navController.navBar.isVisible}">' + 
        '<div class="buttons"> ' +
          '<button nav-back class="button" ng-if="enableBackButton && showBackButton" ng-class="backButtonType" ng-bind-html="backButtonContent"></button>' +
          '<button ng-click="button.tap($event)" ng-repeat="button in leftButtons" class="button {{button.type}}" ng-bind="button.text"></button>' + 
        '</div>' +
        '<h1 class="title" ng-bind="currentTitle"></h1>' + 
        '<div class="buttons"> ' +
          '<button ng-click="button.tap($event)" ng-repeat="button in rightButtons" class="button {{button.type}}" ng-bind="button.text"></button>' + 
        '</div>' +
      '</header>',
    link: function($scope, $element, $attr, navCtrl) {
      var backButton;

      $element.addClass($attr.animation);

      // Create the back button content and show/hide it based on scope settings
      $scope.enableBackButton = true;
      $scope.backButtonContent = '';
      if($scope.backButtonIcon) {
        $scope.backButtonContent += '<i class="icon ' + $scope.backButtonIcon + '"></i>';
      }
      if($scope.backButtonLabel) {
        $scope.backButtonContent += ' ' + $scope.backButtonLabel
      }

      // Listen for changes in the stack cursor position to indicate whether a back
      // button should be shown (this can still be disabled by the $scope.enableBackButton
      $rootScope.$watch('stackCursorPosition', function(value) {
        if(value > 0) {
          $scope.showBackButton = true;
        } else {
          $scope.showBackButton = false;
        }
      });

      // Store a reference to our nav controller
      $scope.navController = navCtrl;

      // Initialize our header bar view which will handle resizing and aligning our title labels
      var hb = new ionic.views.HeaderBar({
        el: $element[0],
        alignTitle: $scope.alignTitle || 'center'
      });
      $scope.headerBarView = hb;

      // Add the type of header bar class to this element
      $element.addClass($scope.type);

      var updateHeaderData = function(data) {
        console.log('Header data changed', data);

        var oldTitle = $scope.currentTitle;
        $scope.oldTitle = oldTitle;

        if(typeof data.title !== 'undefined') {
          $scope.currentTitle = data.title;
        }

        $scope.leftButtons = data.leftButtons;
        $scope.rightButtons = data.rightButtons;

        if(typeof data.hideBackButton !== 'undefined') {
          $scope.enableBackButton = data.hideBackButton !== true;
        }

        if(data.animate !== false && typeof data.title !== 'undefined') {
          animate($scope, $element, oldTitle, data, function() {
            hb.align();
          });
        } else {
          hb.align();
        }
      };

      // Listen for changes on title change, and update the title
      $scope.$parent.$on('navRouter.pageChanged', function(e, data) {
        updateHeaderData(data);
      });

      $scope.$parent.$on('navRouter.pageShown', function(e, data) {
        updateHeaderData(data);
      });

      $scope.$parent.$on('navRouter.titleChanged', function(e, data) {
        var oldTitle = $scope.currentTitle;
        $scope.oldTitle = oldTitle;

         if(typeof data.title !== 'undefined') {
          $scope.currentTitle = data.title;
        }

        if(data.animate !== false && typeof data.title !== 'undefined') {
          animate($scope, $element, oldTitle, data, function() {
            hb.align();
          });
        } else {
          hb.align();
        }
      });


      /*
      $scope.$parent.$on('navigation.push', function() {
        backButton = angular.element($element[0].querySelector('.button'));
        backButton.addClass($scope.backButtonType);
        hb.align();
      });
      $scope.$parent.$on('navigation.pop', function() {
        hb.align();
      });
      */

      $scope.$on('$destroy', function() {
        //
      });
    }
  };
}])

.directive('navPage', ['$parse', function($parse) {
  return {
    restrict: 'E',
    scope: true,
    require: '^navRouter',
    link: function($scope, $element, $attr, navCtrl) {
      $element.addClass('pane');

      $scope.icon = $attr.icon;
      $scope.iconOn = $attr.iconOn;
      $scope.iconOff = $attr.iconOff;

      // Should we hide a back button when this tab is shown
      $scope.hideBackButton = $scope.$eval($attr.hideBackButton);

      // Whether we should animate on tab change, also impacts whether we
      // tell any parent nav controller to animate
      $scope.animate = $scope.$eval($attr.animate);

      // Grab whether we should update any parent nav router on tab changes
      $scope.doesUpdateNavRouter = $scope.$eval($attr.doesUpdateNavRouter) || true;

      // watch for changes in the left buttons
      var leftButtonsGet = $parse($attr.leftButtons);
      $scope.$watch(leftButtonsGet, function(value) {
        $scope.leftButtons = value;
        if($scope.doesUpdateNavRouter) {
          $scope.$emit('navRouter.leftButtonsChanged', $scope.rightButtons);
        }
      });

      // watch for changes in the right buttons
      var rightButtonsGet = $parse($attr.rightButtons);
      $scope.$watch(rightButtonsGet, function(value) {
        $scope.rightButtons = value;
      });

      // watch for changes in the title
      var titleGet = $parse($attr.title);
      $scope.$watch(titleGet, function(value) {
        $scope.title = value;
        $scope.$emit('navRouter.titleChanged', {
          title: value,
          animate: $scope.animate
        });
      });

    }
  }
}])

.directive('navBack', ['$window', '$rootScope', 'Gesture', function($window, $rootScope, Gesture) {
  return {
    restrict: 'AC',
    require: '^?navRouter',
    link: function($scope, $element, $attr, navCtrl) {
      var goBack = function(e) {
        // Only trigger back if the stack is greater than zero
        if($rootScope.stackCursorPosition > 0) {
          $window.history.back();
        }
      };
      var tapGesture = Gesture.on('tap', goBack, $element);
      $element.bind('click', goBack);

      $scope.$on('$destroy', function() {
        Gesture.off(tapGesture, 'tap', goBack);
        $element.unbind('click', goBack);
      });
    }
  }
}]);

})();
;
(function(ionic) {
'use strict';

angular.module('ionic.ui.radio', [])

// The radio button is a radio powered element with only
// one possible selection in a set of options.
.directive('radio', function() {
  return {
    restrict: 'E',
    replace: true,
    require: '?ngModel',
    scope: {
      value: '@'
    },
    transclude: true,
    template: '<label ng-click="tapHandler($event)" class="item item-radio">\
                <input type="radio" name="group">\
                <div class="item-content" ng-transclude>\
                </div>\
                <i class="radio-icon icon ion-checkmark"></i>\
              </label>',

    link: function($scope, $element, $attr, ngModel) {
      var radio;

      if(!ngModel) { return; }

      radio = $element.children().eq(0);

      if(!radio.length) { return; }

      $scope.tapHandler = function(e) {
        radio[0].checked = true;
        ngModel.$setViewValue($scope.$eval($attr.ngValue));
        e.alreadyHandled = true;
      };

      var clickHandler = function(e) {
        ngModel.$setViewValue($scope.$eval($attr.ngValue));
      };

      $scope.$on('$destroy', function() {
        $element.unbind('tap', tapHandler);
        $element.unbind('click', clickHandler);
      });

      if(ngModel) {
        //$element.bind('tap', tapHandler);
        $element.bind('click', clickHandler);

        ngModel.$render = function() {
          var val = $scope.$eval($attr.ngValue);
          if(val === ngModel.$viewValue) {
            radio.attr('checked', 'checked');
          } else {
            radio.removeAttr('checked');
          }
        };
      }
    }
  };
});

})(window.ionic);
;
(function() {
'use strict';

/**
 * @description
 * The sideMenuCtrl lets you quickly have a draggable side
 * left and/or right menu, which a center content area.
 */

angular.module('ionic.ui.sideMenu', ['ionic.service.gesture'])

/**
 * The internal controller for the side menu controller. This
 * extends our core Ionic side menu controller and exposes
 * some side menu stuff on the current scope.
 */
.controller('SideMenuCtrl', function($scope) {
  var _this = this;

  angular.extend(this, ionic.controllers.SideMenuController.prototype);

  ionic.controllers.SideMenuController.call(this, {
    // Our quick implementation of the left side menu
    left: {
      width: 270,
    },

    // Our quick implementation of the right side menu
    right: {
      width: 270,
    }
  });

  $scope.sideMenuContentTranslateX = 0;

  $scope.sideMenuController = this;
})

.directive('sideMenus', function() {
  return {
    restrict: 'ECA',
    controller: 'SideMenuCtrl',
    replace: true,
    transclude: true,
    template: '<div class="pane" ng-transclude></div>'
  };
})

.directive('sideMenuContent', ['Gesture', function(Gesture) {
  return {
    restrict: 'AC',
    require: '^sideMenus',
    scope: true,
    compile: function(element, attr, transclude) {
      return function($scope, $element, $attr, sideMenuCtrl) {

        $element.addClass('menu-content');

        var defaultPrevented = false;

        ionic.on('mousedown', function(e) {
          // If the child element prevented the drag, don't drag
          defaultPrevented = e.defaultPrevented;
        });

        var dragFn = function(e) {
          if(defaultPrevented) {
            return;
          }
          sideMenuCtrl._handleDrag(e);
        };

        var dragGesture = Gesture.on('drag', dragFn, $element);

        var dragReleaseFn = function(e) {
          if(!defaultPrevented) {
            sideMenuCtrl._endDrag(e);
          }
          defaultPrevented = false;
        };

        var releaseGesture = Gesture.on('release', dragReleaseFn, $element);

        sideMenuCtrl.setContent({
          onDrag: function(e) {},
          endDrag: function(e) {},
          getTranslateX: function() {
            return $scope.sideMenuContentTranslateX || 0;
          },
          setTranslateX: function(amount) {
            $scope.sideMenuContentTranslateX = amount;
            $element[0].style.webkitTransform = 'translate3d(' + amount + 'px, 0, 0)';
          },
          enableAnimation: function() {
            //this.el.classList.add(this.animateClass);
            $scope.animationEnabled = true;
            $element[0].classList.add('menu-animated');
          },
          disableAnimation: function() {
            //this.el.classList.remove(this.animateClass);
            $scope.animationEnabled = false;
            $element[0].classList.remove('menu-animated');
          }
        });

        // Cleanup
        $scope.$on('$destroy', function() {
          Gesture.off(dragGesture, 'drag', dragFn);
          Gesture.off(releaseGesture, 'release', dragReleaseFn);
        });
      };
    }
  };
}])


.directive('sideMenu', function() {
  return {
    restrict: 'E',
    require: '^sideMenus',
    replace: true,
    transclude: true,
    scope: true,
    template: '<div class="menu menu-{{side}}"></div>',
    compile: function(element, attr, transclude) {
      return function($scope, $element, $attr, sideMenuCtrl) {
        $scope.side = $attr.side;

        if($scope.side == 'left') {
          sideMenuCtrl.left.isEnabled = true;
          sideMenuCtrl.left.pushDown = function() {
            $element[0].style.zIndex = -1;
          };
          sideMenuCtrl.left.bringUp = function() {
            $element[0].style.zIndex = 0;
          };
        } else if($scope.side == 'right') {
          sideMenuCtrl.right.isEnabled = true;
          sideMenuCtrl.right.pushDown = function() {
            $element[0].style.zIndex = -1;
          };
          sideMenuCtrl.right.bringUp = function() {
            $element[0].style.zIndex = 0;
          };
        }

        $element.append(transclude($scope));
      };
    }
  };
});
})();
;
(function() {
'use strict';

/**
 * @description
 * The sideMenuCtrl lets you quickly have a draggable side
 * left and/or right menu, which a center content area.
 */

angular.module('ionic.ui.slideBox', [])

/**
 * The internal controller for the side menu controller. This
 * extends our core Ionic side menu controller and exposes
 * some side menu stuff on the current scope.
 */
.controller('SlideBoxCtrl', ['$scope', '$element', function($scope, $element) {
  $scope.slides = [];
  this.slideAdded = function() {
    $scope.slides.push({});
  };
}])

.directive('slideBox', ['$compile', function($compile) {
  return {
    restrict: 'E',
    replace: true,
    transclude: true,
    controller: 'SlideBoxCtrl',
    scope: {},
    template: '<div class="slide-box">\
            <div class="slide-box-slides" ng-transclude>\
            </div>\
          </div>',

    link: function($scope, $element, $attr, slideBoxCtrl) {
      // If the pager should show, append it to the slide box
      if($attr.showPager !== "false") {
        var childScope = $scope.$new();
        var pager = $compile('<pager></pager>')(childScope);
        $element.append(pager);

        $scope.slideBox = new ionic.views.SlideBox({
          el: $element[0],
          slideChanged: function(slideIndex) {
            $scope.$parent.$broadcast('slideBox.slideChanged', slideIndex);
          }
        });
      }
    }
  }
}])

.directive('slide', function() {
  return {
    restrict: 'E',
    replace: true,
    require: '^slideBox',
    transclude: true,
    template: '<div class="slide-box-slide" ng-transclude></div>',
    compile: function(element, attr, transclude) {
      return function($scope, $element, $attr, slideBoxCtrl) {
        slideBoxCtrl.slideAdded();
      }
    }
  }
})

.directive('pager', function() {
  return {
    restrict: 'E',
    replace: true,
    require: '^slideBox',
    template: '<div class="slide-box-pager"><span ng-repeat="slide in slides"><i class="icon-record"></i></span></div>'
  }

});

})();
;
angular.module('ionic.ui.tabs', ['ngAnimate'])

/**
 * @description
 *
 * The Tab Controller renders a set of pages that switch based on taps
 * on a tab bar. Modelled off of UITabBarController.
 */

.controller('TabsCtrl', ['$scope', '$element', '$animate', function($scope, $element, $animate) {
  var _this = this;

  angular.extend(this, ionic.controllers.TabBarController.prototype);

  ionic.controllers.TabBarController.call(this, {
    controllerChanged: function(oldC, oldI, newC, newI) {
      $scope.controllerChanged && $scope.controllerChanged({
        oldController: oldC,
        oldIndex: oldI,
        newController: newC,
        newIndex: newI
      });
    },
    tabBar: {
      tryTabSelect: function() {},
      setSelectedItem: function(index) {},
      addItem: function(item) {}
    }
  });

  this.add = function(controller) {
    this.addController(controller);
    this.select(0);
  };

  this.select = function(controllerIndex) {
    $scope.activeAnimation = $scope.animation;
    _this.selectController(controllerIndex);
  };

  $scope.controllers = this.controllers;

  $scope.tabsController = this;
}])

.directive('tabs', function() {
  return {
    restrict: 'E',
    replace: true,
    scope: true,
    transclude: true,
    controller: 'TabsCtrl',
    //templateUrl: 'ext/angular/tmpl/ionicTabBar.tmpl.html',
    template: '<div class="content"><tab-controller-bar></tab-controller-bar></div>',
    compile: function(element, attr, transclude, tabsCtrl) {
      return function($scope, $element, $attr) {
        var tabs = $element[0].querySelector('.tabs');

        $scope.tabsType = $attr.tabsType || 'tabs-positive';
        $scope.tabsStyle = $attr.tabsStyle;
        $scope.animation = $attr.animation;

        $scope.animateNav = $scope.$eval($attr.animateNav);
        if($scope.animateNav !== false) {
          $scope.animateNav = true;
        }

        $attr.$observe('tabsStyle', function(val) {
          if(tabs) {
            angular.element(tabs).addClass($attr.tabsStyle);
          }
        });

        $attr.$observe('tabsType', function(val) {
          if(tabs) {
            angular.element(tabs).addClass($attr.tabsType);
          }
        });

        $scope.$watch('activeAnimation', function(value) {
          //$element.removeClass($scope.animation + ' ' + $scope.animation + '-reverse');
          $element.addClass($scope.activeAnimation);
        });
        transclude($scope, function(cloned) {
          $element.prepend(cloned);
        });
      };
    }
  };
})

// Generic controller directive
.directive('tab', ['$animate', '$parse', function($animate, $parse) {
  return {
    restrict: 'E',
    replace: true,
    require: '^tabs',
    scope: true,
    transclude: 'element',
    compile: function(element, attr, transclude) {
      return function($scope, $element, $attr, tabsCtrl) {
        var childScope, childElement;

        $scope.title = $attr.title;
        $scope.icon = $attr.icon;
        $scope.iconOn = $attr.iconOn;
        $scope.iconOff = $attr.iconOff;

        // Should we hide a back button when this tab is shown
        $scope.hideBackButton = $scope.$eval($attr.hideBackButton);

        if($scope.hideBackButton !== true) {
          $scope.hideBackButton = false;
        }

        // Whether we should animate on tab change, also impacts whether we
        // tell any parent nav controller to animate
        $scope.animate = $scope.$eval($attr.animate);

        // Grab whether we should update any parent nav router on tab changes
        $scope.doesUpdateNavRouter = $scope.$eval($attr.doesUpdateNavRouter);
        if($scope.doesUpdateNavRouter !== false) {
          $scope.doesUpdateNavRouter = true;
        }

        var leftButtonsGet = $parse($attr.leftButtons);
        $scope.$watch(leftButtonsGet, function(value) {
          $scope.leftButtons = value;
          if($scope.doesUpdateNavRouter) {
            $scope.$emit('navRouter.leftButtonsChanged', $scope.rightButtons);
          }
        });

        var rightButtonsGet = $parse($attr.rightButtons);
        $scope.$watch(rightButtonsGet, function(value) {
          $scope.rightButtons = value;
        });

        tabsCtrl.add($scope);
        
        $scope.$watch('isVisible', function(value) {
          if(childElement) {
            $animate.leave(childElement);
            $scope.$broadcast('tab.hidden');
            childElement = undefined;
          }
          if(childScope) {
            childScope.$destroy();
            childScope = undefined;
          }
          if(value) {
            childScope = $scope.$new();
            transclude(childScope, function(clone) {
              childElement = clone;
              $animate.enter(clone, $element.parent(), $element);

              if($scope.title) {
                // Send the title up in case we are inside of a nav controller
                if($scope.doesUpdateNavRouter) {
                  $scope.$emit('navRouter.pageShown', {
                    title: $scope.title,
                    rightButtons: $scope.rightButtons,
                    leftButtons: $scope.leftButtons,
                    hideBackButton: $scope.hideBackButton,
                    animate: $scope.animateNav
                  });
                }
                //$scope.$emit('navRouter.titleChanged', $scope.title);
              }
              $scope.$broadcast('tab.shown');
            });
          }
        });
      }
    }
  };
}])


.directive('tabControllerBar', function() {
  return {
    restrict: 'E',
    require: '^tabs',
    transclude: true,
    replace: true,
    scope: true,
    template: '<div class="tabs">' + 
      '<tab-controller-item title="{{controller.title}}" icon="{{controller.icon}}" icon-on="{{controller.iconOn}}" icon-off="{{controller.iconOff}}" active="controller.isVisible" index="$index" ng-repeat="controller in controllers"></tab-controller-item>' + 
    '</div>',
    link: function($scope, $element, $attr, tabsCtrl) {
      $element.addClass($scope.tabsType);
      $element.addClass($scope.tabsStyle);
    }
  };
})

.directive('tabControllerItem', function() {
  return {
    restrict: 'E',
    replace: true,
    require: '^tabs',
    scope: {
      title: '@',
      icon: '@',
      iconOn: '@',
      iconOff: '@',
      active: '=',
      tabSelected: '@',
      index: '='
    },
    link: function(scope, element, attrs, tabsCtrl) {
      if(attrs.icon) {
        scope.iconOn = scope.iconOff = attrs.icon;
      }
      scope.selectTab = function(index) {
        tabsCtrl.select(scope.index);
      };
    },
    template: 
      '<a ng-class="{active:active}" ng-click="selectTab()" class="tab-item">' +
        '<i class="{{icon}}" ng-if="icon"></i>' +
        '<i class="{{iconOn}}" ng-if="active"></i>' +
        '<i class="{{iconOff}}" ng-if="!active"></i> {{title}}' +
      '</a>'
  };
})

.directive('tabBar', function() {
  return {
    restrict: 'E',
    replace: true,
    transclude: true,
    template: '<div class="tabs tabs-primary" ng-transclude>' + 
    '</div>'
  }
});

;
(function(ionic) {
'use strict';

angular.module('ionic.ui.toggle', [])

// The Toggle directive is a toggle switch that can be tapped to change
// its value
.directive('toggle', function() {
  return {
    restrict: 'E',
    replace: true,
    require: '?ngModel',
    scope: true,
    template: '<div class="toggle"><input type="checkbox"><div class="track"><div class="handle"></div></div></div>',

    link: function($scope, $element, $attr, ngModel) {
      var checkbox, handle;

      if(!ngModel) { return; }

      checkbox = $element.children().eq(0);
      handle = $element.children().eq(1);

      if(!checkbox.length || !handle.length) { return; }

      $scope.toggle = new ionic.views.Toggle({ 
        el: $element[0],
        checkbox: checkbox[0],
        handle: handle[0]
      });

      $element.bind('click', function(e) {
        $scope.toggle.tap(e);
        $scope.$apply(function() {
          ngModel.$setViewValue(checkbox[0].checked);
        });
      });

      ngModel.$render = function() {
        $scope.toggle.val(ngModel.$viewValue);
      };
    }
  };
});

})(window.ionic);
;
(function() {
'use strict';

angular.module('ionic.ui.virtRepeat', [])

.directive('virtRepeat', function() {
  return {
    require: ['?ngModel', '^virtualList'],
    transclude: 'element',
    priority: 1000,
    terminal: true,
    compile: function(element, attr, transclude) {
      return function($scope, $element, $attr, ctrls) {
        var virtualList = ctrls[1];
        var _this = this;

        virtualList.listView.renderViewport = function(high, low, start, end) {
        }
      }
    }
  }
});
})(ionic);
;

(function() {
'use strict';

// Turn the expression supplied to the directive:
//
//     a in b
//
// into `{ value: "a", collection: "b" }`
function parseRepeatExpression(expression){
  var match = expression.match(/^\s*([\$\w]+)\s+in\s+(\S*)\s*$/);
  if (! match) {
    throw new Error("Expected sfVirtualRepeat in form of '_item_ in _collection_' but got '" +
                    expression + "'.");
  }
  return {
    value: match[1],
    collection: match[2]
  };
}

// Utility to filter out elements by tag name
function isTagNameInList(element, list){
  var t, tag = element.tagName.toUpperCase();
  for( t = 0; t < list.length; t++ ){
    if( list[t] === tag ){
      return true;
    }
  }
  return false;
}


// Utility to find the viewport/content elements given the start element:
function findViewportAndContent(startElement){
  /*jshint eqeqeq:false, curly:false */
  var root = $rootElement[0];
  var e, n;
  // Somewhere between the grandparent and the root node
  for( e = startElement.parent().parent()[0]; e !== root; e = e.parentNode ){
    // is an element
    if( e.nodeType != 1 ) break;
    // that isn't in the blacklist (tables etc.),
    if( isTagNameInList(e, DONT_WORK_AS_VIEWPORTS) ) continue;
    // has a single child element (the content),
    if( e.childElementCount != 1 ) continue;
    // which is not in the blacklist
    if( isTagNameInList(e.firstElementChild, DONT_WORK_AS_CONTENT) ) continue;
    // and no text.
    for( n = e.firstChild; n; n = n.nextSibling ){
      if( n.nodeType == 3 && /\S/g.test(n.textContent) ){
        break;
      }
    }
    if( n == null ){
      // That element should work as a viewport.
      return {
        viewport: angular.element(e),
        content: angular.element(e.firstElementChild)
      };
    }
  }
  throw new Error("No suitable viewport element");
}

// Apply explicit height and overflow styles to the viewport element.
//
// If the viewport has a max-height (inherited or otherwise), set max-height.
// Otherwise, set height from the current computed value or use
// window.innerHeight as a fallback
//
function setViewportCss(viewport){
  var viewportCss = {'overflow': 'auto'},
      style = window.getComputedStyle ?
        window.getComputedStyle(viewport[0]) :
        viewport[0].currentStyle,
      maxHeight = style && style.getPropertyValue('max-height'),
      height = style && style.getPropertyValue('height');

  if( maxHeight && maxHeight !== '0px' ){
    viewportCss.maxHeight = maxHeight;
  }else if( height && height !== '0px' ){
    viewportCss.height = height;
  }else{
    viewportCss.height = window.innerHeight;
  }
  viewport.css(viewportCss);
}

// Apply explicit styles to the content element to prevent pesky padding
// or borders messing with our calculations:
function setContentCss(content){
  var contentCss = {
    margin: 0,
    padding: 0,
    border: 0,
    'box-sizing': 'border-box'
  };
  content.css(contentCss);
}

// TODO: compute outerHeight (padding + border unless box-sizing is border)
function computeRowHeight(element){
  var style = window.getComputedStyle ? window.getComputedStyle(element)
                                      : element.currentStyle,
      maxHeight = style && style.getPropertyValue('max-height'),
      height = style && style.getPropertyValue('height');

  if( height && height !== '0px' && height !== 'auto' ){
    $log.info('Row height is "%s" from css height', height);
  }else if( maxHeight && maxHeight !== '0px' && maxHeight !== 'none' ){
    height = maxHeight;
    $log.info('Row height is "%s" from css max-height', height);
  }else if( element.clientHeight ){
    height = element.clientHeight+'px';
    $log.info('Row height is "%s" from client height', height);
  }else{
    throw new Error("Unable to compute height of row");
  }
  angular.element(element).css('height', height);
  return parseInt(height, 10);
}

angular.module('ionic.ui.virtualRepeat', [])

/**
 * A replacement for ng-repeat that supports virtual lists.
 * This is not a 1 to 1 replacement for ng-repeat. However, in situations
 * where you have huge lists, this repeater will work with our virtual
 * scrolling to only render items that are showing or will be showing
 * if a scroll is made.
 */
.directive('virtualRepeat', ['$log', function($log) {
    return {
      require: ['?ngModel, ^virtualList'],
      transclude: 'element',
      priority: 1000,
      terminal: true,
      compile: function(element, attr, transclude) {
        var ident = parseRepeatExpression(attr.sfVirtualRepeat);

        return function(scope, iterStartElement, attrs, ctrls, b) {
          var virtualList = ctrls[1];

          var rendered = [];
          var rowHeight = 0;
          var sticky = false;

          var dom = virtualList.element;
          //var dom = findViewportAndContent(iterStartElement);

          // The list structure is controlled by a few simple (visible) variables:
          var state = 'ngModel' in attrs ? scope.$eval(attrs.ngModel) : {};

          function makeNewScope (idx, collection, containerScope) {
            var childScope = containerScope.$new();
            childScope[ident.value] = collection[idx];
            childScope.$index = idx;
            childScope.$first = (idx === 0);
            childScope.$last = (idx === (collection.length - 1));
            childScope.$middle = !(childScope.$first || childScope.$last);
            childScope.$watch(function updateChildScopeItem(){
              childScope[ident.value] = collection[idx];
            });
            return childScope;
          }

          // Given the collection and a start and end point, add the current
          function addElements (start, end, collection, containerScope, insPoint) {
            var frag = document.createDocumentFragment();
            var newElements = [], element, idx, childScope;
            for( idx = start; idx !== end; idx ++ ){
              childScope = makeNewScope(idx, collection, containerScope);
              element = linker(childScope, angular.noop);
              //setElementCss(element);
              newElements.push(element);
              frag.appendChild(element[0]);
            }
            insPoint.after(frag);
            return newElements;
          }

          function recomputeActive() {
            // We want to set the start to the low water mark unless the current
            // start is already between the low and high water marks.
            var start = clip(state.firstActive, state.firstVisible - state.lowWater, state.firstVisible - state.highWater);
            // Similarly for the end
            var end = clip(state.firstActive + state.active,
                           state.firstVisible + state.visible + state.lowWater,
                           state.firstVisible + state.visible + state.highWater );
            state.firstActive = Math.max(0, start);
            state.active = Math.min(end, state.total) - state.firstActive;
          }

          function sfVirtualRepeatOnScroll(evt){
            if( !rowHeight ){
              return;
            }
            // Enter the angular world for the state change to take effect.
            scope.$apply(function(){
              state.firstVisible = Math.floor(evt.target.scrollTop / rowHeight);
              state.visible = Math.ceil(dom.viewport[0].clientHeight / rowHeight);
              $log.log('scroll to row %o', state.firstVisible);
              sticky = evt.target.scrollTop + evt.target.clientHeight >= evt.target.scrollHeight;
              recomputeActive();
              $log.log(' state is now %o', state);
              $log.log(' sticky = %o', sticky);
            });
          }

          function sfVirtualRepeatWatchExpression(scope){
            var coll = scope.$eval(ident.collection);
            if( coll.length !== state.total ){
              state.total = coll.length;
              recomputeActive();
            }
            return {
              start: state.firstActive,
              active: state.active,
              len: coll.length
            };
          }

          function destroyActiveElements (action, count) {
            var dead, ii, remover = Array.prototype[action];
            for( ii = 0; ii < count; ii++ ){
              dead = remover.call(rendered);
              dead.scope().$destroy();
              dead.remove();
            }
          }

          // When the watch expression for the repeat changes, we may need to add
          // and remove scopes and elements
          function sfVirtualRepeatListener(newValue, oldValue, scope){
            var oldEnd = oldValue.start + oldValue.active,
                collection = scope.$eval(ident.collection),
                newElements;
            if(newValue === oldValue) {
              $log.info('initial listen');
              newElements = addElements(newValue.start, oldEnd, collection, scope, iterStartElement);
              rendered = newElements;
              if(rendered.length) {
                rowHeight = computeRowHeight(newElements[0][0]);
              }
            } else {
              var newEnd = newValue.start + newValue.active;
              var forward = newValue.start >= oldValue.start;
              var delta = forward ? newValue.start - oldValue.start
                                  : oldValue.start - newValue.start;
              var endDelta = newEnd >= oldEnd ? newEnd - oldEnd : oldEnd - newEnd;
              var contiguous = delta < (forward ? oldValue.active : newValue.active);
              $log.info('change by %o,%o rows %s', delta, endDelta, forward ? 'forward' : 'backward');
              if(!contiguous) {
                $log.info('non-contiguous change');
                destroyActiveElements('pop', rendered.length);
                rendered = addElements(newValue.start, newEnd, collection, scope, iterStartElement);
              } else {
                if(forward) {
                  $log.info('need to remove from the top');
                  destroyActiveElements('shift', delta);
                } else if(delta) {
                  $log.info('need to add at the top');
                  newElements = addElements(
                    newValue.start,
                    oldValue.start,
                    collection, scope, iterStartElement);
                  rendered = newElements.concat(rendered);
                }

                if(newEnd < oldEnd) {
                  $log.info('need to remove from the bottom');
                  destroyActiveElements('pop', oldEnd - newEnd);
                } else if(endDelta) {
                  var lastElement = rendered[rendered.length-1];
                  $log.info('need to add to the bottom');
                  newElements = addElements(
                    oldEnd,
                    newEnd,
                    collection, scope, lastElement);
                  rendered = rendered.concat(newElements);
                }
              }
              if(!rowHeight && rendered.length) {
                rowHeight = computeRowHeight(rendered[0][0]);
              }
              dom.content.css({'padding-top': newValue.start * rowHeight + 'px'});
            }
            dom.content.css({'height': newValue.len * rowHeight + 'px'});
            if(sticky) {
              dom.viewport[0].scrollTop = dom.viewport[0].clientHeight + dom.viewport[0].scrollHeight;
            }
          }

          //  - The index of the first active element
          state.firstActive = 0;
          //  - The index of the first visible element
          state.firstVisible = 0;
          //  - The number of elements visible in the viewport.
          state.visible = 0;
          // - The number of active elements
          state.active = 0;
          // - The total number of elements
          state.total = 0;
          // - The point at which we add new elements
          state.lowWater = state.lowWater || 100;
          // - The point at which we remove old elements
          state.highWater = state.highWater || 300;
          // TODO: now watch the water marks

          setContentCss(dom.content);
          setViewportCss(dom.viewport);
          // When the user scrolls, we move the `state.firstActive`
          dom.bind('momentumScrolled', sfVirtualRepeatOnScroll);

          // The watch on the collection is just a watch on the length of the
          // collection. We don't care if the content changes.
          scope.$watch(sfVirtualRepeatWatchExpression, sfVirtualRepeatListener, true);
        }
      }
    };
  }]);

})(ionic);
