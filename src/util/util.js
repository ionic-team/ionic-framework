export function noop() {}

export function clamp(min, n, max) {
  return Math.max(min, Math.min(n, max));
}

export function extend(dest) {
  for (var i = 1, ii = arguments.length; i < ii; i++) {
    var source = arguments[i] || {};
    for (var key in source) {
      if (source.hasOwnProperty(key)) {
        dest[key] = source[key];
      }
    }
  }
  return dest;
}

export function defaults(dest) {
  for (let i = arguments.length - 1; i >= 1; i--) {
    let source = arguments[i] || {};
    for (let key in source) {
      if (source.hasOwnProperty(key) && !dest.hasOwnProperty(key)) {
        dest[key] = source[key];
      }
    }
  }
  return dest;
}

export const isString = val => typeof val === 'string'
export const isFunction = val => typeof val === 'function'
export const isDefined = val => typeof val === 'undefined'
export const isObject = val => typeof val === 'object'
export const isArray = Array.isArray

export function pascalCaseToDashCase(str = '') {
  return str.charAt(0).toLowerCase() + str.substring(1).replace(/[A-Z]/g, match => {
    return '-' + match.toLowerCase()
  })
}

export class Log {
  static log(...args) {
    console.log.apply(console, args)
  }
  static info(...args) {
    console.info.apply(console, args)
  }
  static warn(...args) {
    console.warn.apply(console, args)
  }
  static error(...args) {
    console.error.apply(console, args)
  }
}

export function readQueryParams() {
  var queryParams = {}
  const startIndex = window.location.href.indexOf('?')
  if (startIndex !== -1) {
    const queries = window.location.href.slice(startIndex + 1).split('&')
    if (queries.length) {
      queries.forEach((param) => {
        var split = param.split('=')
        queryParams[split[0]] = split[1]
      })
    }
  }
  return queryParams
}
