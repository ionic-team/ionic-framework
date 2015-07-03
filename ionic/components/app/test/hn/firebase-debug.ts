/*! @license Firebase v2.2.4
    License: https://www.firebase.com/terms/terms-of-service.html */
var CLOSURE_NO_DEPS = true;
var COMPILED = false;
var goog = goog || {};
goog.global = this;
goog.global.CLOSURE_UNCOMPILED_DEFINES;
goog.global.CLOSURE_DEFINES;
goog.isDef = function(val) {
  return val !== void 0;
};
goog.exportPath_ = function(name, opt_object, opt_objectToExportTo) {
  var parts = name.split(".");
  var cur = opt_objectToExportTo || goog.global;
  if (!(parts[0] in cur) && cur.execScript) {
    cur.execScript("var " + parts[0]);
  }
  for (var part;parts.length && (part = parts.shift());) {
    if (!parts.length && goog.isDef(opt_object)) {
      cur[part] = opt_object;
    } else {
      if (cur[part]) {
        cur = cur[part];
      } else {
        cur = cur[part] = {};
      }
    }
  }
};
goog.define = function(name, defaultValue) {
  var value = defaultValue;
  if (!COMPILED) {
    if (goog.global.CLOSURE_UNCOMPILED_DEFINES && Object.prototype.hasOwnProperty.call(goog.global.CLOSURE_UNCOMPILED_DEFINES, name)) {
      value = goog.global.CLOSURE_UNCOMPILED_DEFINES[name];
    } else {
      if (goog.global.CLOSURE_DEFINES && Object.prototype.hasOwnProperty.call(goog.global.CLOSURE_DEFINES, name)) {
        value = goog.global.CLOSURE_DEFINES[name];
      }
    }
  }
  goog.exportPath_(name, value);
};
goog.define("goog.DEBUG", true);
goog.define("goog.LOCALE", "en");
goog.define("goog.TRUSTED_SITE", true);
goog.define("goog.STRICT_MODE_COMPATIBLE", false);
goog.define("goog.DISALLOW_TEST_ONLY_CODE", COMPILED && !goog.DEBUG);
goog.provide = function(name) {
  if (!COMPILED) {
    if (goog.isProvided_(name)) {
      throw Error('Namespace "' + name + '" already declared.');
    }
  }
  goog.constructNamespace_(name);
};
goog.constructNamespace_ = function(name, opt_obj) {
  if (!COMPILED) {
    delete goog.implicitNamespaces_[name];
    var namespace = name;
    while (namespace = namespace.substring(0, namespace.lastIndexOf("."))) {
      if (goog.getObjectByName(namespace)) {
        break;
      }
      goog.implicitNamespaces_[namespace] = true;
    }
  }
  goog.exportPath_(name, opt_obj);
};
goog.VALID_MODULE_RE_ = /^[a-zA-Z_$][a-zA-Z0-9._$]*$/;
goog.module = function(name) {
  if (!goog.isString(name) || !name || name.search(goog.VALID_MODULE_RE_) == -1) {
    throw Error("Invalid module identifier");
  }
  if (!goog.isInModuleLoader_()) {
    throw Error("Module " + name + " has been loaded incorrectly.");
  }
  if (goog.moduleLoaderState_.moduleName) {
    throw Error("goog.module may only be called once per module.");
  }
  goog.moduleLoaderState_.moduleName = name;
  if (!COMPILED) {
    if (goog.isProvided_(name)) {
      throw Error('Namespace "' + name + '" already declared.');
    }
    delete goog.implicitNamespaces_[name];
  }
};
goog.module.get = function(name) {
  return goog.module.getInternal_(name);
};
goog.module.getInternal_ = function(name) {
  if (!COMPILED) {
    if (goog.isProvided_(name)) {
      return name in goog.loadedModules_ ? goog.loadedModules_[name] : goog.getObjectByName(name);
    } else {
      return null;
    }
  }
};
goog.moduleLoaderState_ = null;
goog.isInModuleLoader_ = function() {
  return goog.moduleLoaderState_ != null;
};
goog.module.declareTestMethods = function() {
  if (!goog.isInModuleLoader_()) {
    throw new Error("goog.module.declareTestMethods must be called from " + "within a goog.module");
  }
  goog.moduleLoaderState_.declareTestMethods = true;
};
goog.module.declareLegacyNamespace = function() {
  if (!COMPILED && !goog.isInModuleLoader_()) {
    throw new Error("goog.module.declareLegacyNamespace must be called from " + "within a goog.module");
  }
  if (!COMPILED && !goog.moduleLoaderState_.moduleName) {
    throw Error("goog.module must be called prior to " + "goog.module.declareLegacyNamespace.");
  }
  goog.moduleLoaderState_.declareLegacyNamespace = true;
};
goog.setTestOnly = function(opt_message) {
  if (goog.DISALLOW_TEST_ONLY_CODE) {
    opt_message = opt_message || "";
    throw Error("Importing test-only code into non-debug environment" + (opt_message ? ": " + opt_message : "."));
  }
};
goog.forwardDeclare = function(name) {
};
if (!COMPILED) {
  goog.isProvided_ = function(name) {
    return name in goog.loadedModules_ || !goog.implicitNamespaces_[name] && goog.isDefAndNotNull(goog.getObjectByName(name));
  };
  goog.implicitNamespaces_ = {"goog.module":true};
}
goog.getObjectByName = function(name, opt_obj) {
  var parts = name.split(".");
  var cur = opt_obj || goog.global;
  for (var part;part = parts.shift();) {
    if (goog.isDefAndNotNull(cur[part])) {
      cur = cur[part];
    } else {
      return null;
    }
  }
  return cur;
};
goog.globalize = function(obj, opt_global) {
  var global = opt_global || goog.global;
  for (var x in obj) {
    global[x] = obj[x];
  }
};
goog.addDependency = function(relPath, provides, requires, opt_isModule) {
  if (goog.DEPENDENCIES_ENABLED) {
    var provide, require;
    var path = relPath.replace(/\\/g, "/");
    var deps = goog.dependencies_;
    for (var i = 0;provide = provides[i];i++) {
      deps.nameToPath[provide] = path;
      deps.pathIsModule[path] = !!opt_isModule;
    }
    for (var j = 0;require = requires[j];j++) {
      if (!(path in deps.requires)) {
        deps.requires[path] = {};
      }
      deps.requires[path][require] = true;
    }
  }
};
goog.define("goog.ENABLE_DEBUG_LOADER", true);
goog.logToConsole_ = function(msg) {
  if (goog.global.console) {
    goog.global.console["error"](msg);
  }
};
goog.require = function(name) {
  if (!COMPILED) {
    if (goog.ENABLE_DEBUG_LOADER && goog.IS_OLD_IE_) {
      goog.maybeProcessDeferredDep_(name);
    }
    if (goog.isProvided_(name)) {
      if (goog.isInModuleLoader_()) {
        return goog.module.getInternal_(name);
      } else {
        return null;
      }
    }
    if (goog.ENABLE_DEBUG_LOADER) {
      var path = goog.getPathFromDeps_(name);
      if (path) {
        goog.included_[path] = true;
        goog.writeScripts_();
        return null;
      }
    }
    var errorMessage = "goog.require could not find: " + name;
    goog.logToConsole_(errorMessage);
    throw Error(errorMessage);
  }
};
goog.basePath = "";
goog.global.CLOSURE_BASE_PATH;
goog.global.CLOSURE_NO_DEPS;
goog.global.CLOSURE_IMPORT_SCRIPT;
goog.nullFunction = function() {
};
goog.identityFunction = function(opt_returnValue, var_args) {
  return opt_returnValue;
};
goog.abstractMethod = function() {
  throw Error("unimplemented abstract method");
};
goog.addSingletonGetter = function(ctor) {
  ctor.getInstance = function() {
    if (ctor.instance_) {
      return ctor.instance_;
    }
    if (goog.DEBUG) {
      goog.instantiatedSingletons_[goog.instantiatedSingletons_.length] = ctor;
    }
    return ctor.instance_ = new ctor;
  };
};
goog.instantiatedSingletons_ = [];
goog.define("goog.LOAD_MODULE_USING_EVAL", true);
goog.define("goog.SEAL_MODULE_EXPORTS", goog.DEBUG);
goog.loadedModules_ = {};
goog.DEPENDENCIES_ENABLED = !COMPILED && goog.ENABLE_DEBUG_LOADER;
if (goog.DEPENDENCIES_ENABLED) {
  goog.included_ = {};
  goog.dependencies_ = {pathIsModule:{}, nameToPath:{}, requires:{}, visited:{}, written:{}, deferred:{}};
  goog.inHtmlDocument_ = function() {
    var doc = goog.global.document;
    return typeof doc != "undefined" && "write" in doc;
  };
  goog.findBasePath_ = function() {
    if (goog.global.CLOSURE_BASE_PATH) {
      goog.basePath = goog.global.CLOSURE_BASE_PATH;
      return;
    } else {
      if (!goog.inHtmlDocument_()) {
        return;
      }
    }
    var doc = goog.global.document;
    var scripts = doc.getElementsByTagName("script");
    for (var i = scripts.length - 1;i >= 0;--i) {
      var script = (scripts[i]);
      var src = script.src;
      var qmark = src.lastIndexOf("?");
      var l = qmark == -1 ? src.length : qmark;
      if (src.substr(l - 7, 7) == "base.js") {
        goog.basePath = src.substr(0, l - 7);
        return;
      }
    }
  };
  goog.importScript_ = function(src, opt_sourceText) {
    var importScript = goog.global.CLOSURE_IMPORT_SCRIPT || goog.writeScriptTag_;
    if (importScript(src, opt_sourceText)) {
      goog.dependencies_.written[src] = true;
    }
  };
  goog.IS_OLD_IE_ = !goog.global.atob && goog.global.document && goog.global.document.all;
  goog.importModule_ = function(src) {
    var bootstrap = 'goog.retrieveAndExecModule_("' + src + '");';
    if (goog.importScript_("", bootstrap)) {
      goog.dependencies_.written[src] = true;
    }
  };
  goog.queuedModules_ = [];
  goog.wrapModule_ = function(srcUrl, scriptText) {
    if (!goog.LOAD_MODULE_USING_EVAL || !goog.isDef(goog.global.JSON)) {
      return "" + "goog.loadModule(function(exports) {" + '"use strict";' + scriptText + "\n" + ";return exports" + "});" + "\n//# sourceURL=" + srcUrl + "\n";
    } else {
      return "" + "goog.loadModule(" + goog.global.JSON.stringify(scriptText + "\n//# sourceURL=" + srcUrl + "\n") + ");";
    }
  };
  goog.loadQueuedModules_ = function() {
    var count = goog.queuedModules_.length;
    if (count > 0) {
      var queue = goog.queuedModules_;
      goog.queuedModules_ = [];
      for (var i = 0;i < count;i++) {
        var path = queue[i];
        goog.maybeProcessDeferredPath_(path);
      }
    }
  };
  goog.maybeProcessDeferredDep_ = function(name) {
    if (goog.isDeferredModule_(name) && goog.allDepsAreAvailable_(name)) {
      var path = goog.getPathFromDeps_(name);
      goog.maybeProcessDeferredPath_(goog.basePath + path);
    }
  };
  goog.isDeferredModule_ = function(name) {
    var path = goog.getPathFromDeps_(name);
    if (path && goog.dependencies_.pathIsModule[path]) {
      var abspath = goog.basePath + path;
      return abspath in goog.dependencies_.deferred;
    }
    return false;
  };
  goog.allDepsAreAvailable_ = function(name) {
    var path = goog.getPathFromDeps_(name);
    if (path && path in goog.dependencies_.requires) {
      for (var requireName in goog.dependencies_.requires[path]) {
        if (!goog.isProvided_(requireName) && !goog.isDeferredModule_(requireName)) {
          return false;
        }
      }
    }
    return true;
  };
  goog.maybeProcessDeferredPath_ = function(abspath) {
    if (abspath in goog.dependencies_.deferred) {
      var src = goog.dependencies_.deferred[abspath];
      delete goog.dependencies_.deferred[abspath];
      goog.globalEval(src);
    }
  };
  goog.loadModule = function(moduleDef) {
    var previousState = goog.moduleLoaderState_;
    try {
      goog.moduleLoaderState_ = {moduleName:undefined, declareTestMethods:false};
      var exports;
      if (goog.isFunction(moduleDef)) {
        exports = moduleDef.call(goog.global, {});
      } else {
        if (goog.isString(moduleDef)) {
          exports = goog.loadModuleFromSource_.call(goog.global, moduleDef);
        } else {
          throw Error("Invalid module definition");
        }
      }
      var moduleName = goog.moduleLoaderState_.moduleName;
      if (!goog.isString(moduleName) || !moduleName) {
        throw Error('Invalid module name "' + moduleName + '"');
      }
      if (goog.moduleLoaderState_.declareLegacyNamespace) {
        goog.constructNamespace_(moduleName, exports);
      } else {
        if (goog.SEAL_MODULE_EXPORTS && Object.seal) {
          Object.seal(exports);
        }
      }
      goog.loadedModules_[moduleName] = exports;
      if (goog.moduleLoaderState_.declareTestMethods) {
        for (var entry in exports) {
          if (entry.indexOf("test", 0) === 0 || entry == "tearDown" || entry == "setUp" || entry == "setUpPage" || entry == "tearDownPage") {
            goog.global[entry] = exports[entry];
          }
        }
      }
    } finally {
      goog.moduleLoaderState_ = previousState;
    }
  };
  goog.loadModuleFromSource_ = function(source) {
    var exports = {};
    eval(arguments[0]);
    return exports;
  };
  goog.writeScriptTag_ = function(src, opt_sourceText) {
    if (goog.inHtmlDocument_()) {
      var doc = goog.global.document;
      if (doc.readyState == "complete") {
        var isDeps = /\bdeps.js$/.test(src);
        if (isDeps) {
          return false;
        } else {
          throw Error('Cannot write "' + src + '" after document load');
        }
      }
      var isOldIE = goog.IS_OLD_IE_;
      if (opt_sourceText === undefined) {
        if (!isOldIE) {
          doc.write('<script type="text/javascript" src="' + src + '"></' + "script>");
        } else {
          var state = " onreadystatechange='goog.onScriptLoad_(this, " + ++goog.lastNonModuleScriptIndex_ + ")' ";
          doc.write('<script type="text/javascript" src="' + src + '"' + state + "></" + "script>");
        }
      } else {
        doc.write('<script type="text/javascript">' + opt_sourceText + "</" + "script>");
      }
      return true;
    } else {
      return false;
    }
  };
  goog.lastNonModuleScriptIndex_ = 0;
  goog.onScriptLoad_ = function(script, scriptIndex) {
    if (script.readyState == "complete" && goog.lastNonModuleScriptIndex_ == scriptIndex) {
      goog.loadQueuedModules_();
    }
    return true;
  };
  goog.writeScripts_ = function() {
    var scripts = [];
    var seenScript = {};
    var deps = goog.dependencies_;
    function visitNode(path) {
      if (path in deps.written) {
        return;
      }
      if (path in deps.visited) {
        if (!(path in seenScript)) {
          seenScript[path] = true;
          scripts.push(path);
        }
        return;
      }
      deps.visited[path] = true;
      if (path in deps.requires) {
        for (var requireName in deps.requires[path]) {
          if (!goog.isProvided_(requireName)) {
            if (requireName in deps.nameToPath) {
              visitNode(deps.nameToPath[requireName]);
            } else {
              throw Error("Undefined nameToPath for " + requireName);
            }
          }
        }
      }
      if (!(path in seenScript)) {
        seenScript[path] = true;
        scripts.push(path);
      }
    }
    for (var path in goog.included_) {
      if (!deps.written[path]) {
        visitNode(path);
      }
    }
    for (var i = 0;i < scripts.length;i++) {
      var path = scripts[i];
      goog.dependencies_.written[path] = true;
    }
    var moduleState = goog.moduleLoaderState_;
    goog.moduleLoaderState_ = null;
    var loadingModule = false;
    for (var i = 0;i < scripts.length;i++) {
      var path = scripts[i];
      if (path) {
        if (!deps.pathIsModule[path]) {
          goog.importScript_(goog.basePath + path);
        } else {
          loadingModule = true;
          goog.importModule_(goog.basePath + path);
        }
      } else {
        goog.moduleLoaderState_ = moduleState;
        throw Error("Undefined script input");
      }
    }
    goog.moduleLoaderState_ = moduleState;
  };
  goog.getPathFromDeps_ = function(rule) {
    if (rule in goog.dependencies_.nameToPath) {
      return goog.dependencies_.nameToPath[rule];
    } else {
      return null;
    }
  };
  goog.findBasePath_();
  if (!goog.global.CLOSURE_NO_DEPS) {
    goog.importScript_(goog.basePath + "deps.js");
  }
}
goog.normalizePath_ = function(path) {
  var components = path.split("/");
  var i = 0;
  while (i < components.length) {
    if (components[i] == ".") {
      components.splice(i, 1);
    } else {
      if (i && components[i] == ".." && components[i - 1] && components[i - 1] != "..") {
        components.splice(--i, 2);
      } else {
        i++;
      }
    }
  }
  return components.join("/");
};
goog.retrieveAndExecModule_ = function(src) {
  if (!COMPILED) {
    var originalPath = src;
    src = goog.normalizePath_(src);
    var importScript = goog.global.CLOSURE_IMPORT_SCRIPT || goog.writeScriptTag_;
    var scriptText = null;
    var xhr = new goog.global["XMLHttpRequest"];
    xhr.onload = function() {
      scriptText = this.responseText;
    };
    xhr.open("get", src, false);
    xhr.send();
    scriptText = xhr.responseText;
    if (scriptText != null) {
      var execModuleScript = goog.wrapModule_(src, scriptText);
      var isOldIE = goog.IS_OLD_IE_;
      if (isOldIE) {
        goog.dependencies_.deferred[originalPath] = execModuleScript;
        goog.queuedModules_.push(originalPath);
      } else {
        importScript(src, execModuleScript);
      }
    } else {
      throw new Error("load of " + src + "failed");
    }
  }
};
goog.typeOf = function(value) {
  var s = typeof value;
  if (s == "object") {
    if (value) {
      if (value instanceof Array) {
        return "array";
      } else {
        if (value instanceof Object) {
          return s;
        }
      }
      var className = Object.prototype.toString.call((value));
      if (className == "[object Window]") {
        return "object";
      }
      if (className == "[object Array]" || typeof value.length == "number" && typeof value.splice != "undefined" && typeof value.propertyIsEnumerable != "undefined" && !value.propertyIsEnumerable("splice")) {
        return "array";
      }
      if (className == "[object Function]" || typeof value.call != "undefined" && typeof value.propertyIsEnumerable != "undefined" && !value.propertyIsEnumerable("call")) {
        return "function";
      }
    } else {
      return "null";
    }
  } else {
    if (s == "function" && typeof value.call == "undefined") {
      return "object";
    }
  }
  return s;
};
goog.isNull = function(val) {
  return val === null;
};
goog.isDefAndNotNull = function(val) {
  return val != null;
};
goog.isArray = function(val) {
  return goog.typeOf(val) == "array";
};
goog.isArrayLike = function(val) {
  var type = goog.typeOf(val);
  return type == "array" || type == "object" && typeof val.length == "number";
};
goog.isDateLike = function(val) {
  return goog.isObject(val) && typeof val.getFullYear == "function";
};
goog.isString = function(val) {
  return typeof val == "string";
};
goog.isBoolean = function(val) {
  return typeof val == "boolean";
};
goog.isNumber = function(val) {
  return typeof val == "number";
};
goog.isFunction = function(val) {
  return goog.typeOf(val) == "function";
};
goog.isObject = function(val) {
  var type = typeof val;
  return type == "object" && val != null || type == "function";
};
goog.getUid = function(obj) {
  return obj[goog.UID_PROPERTY_] || (obj[goog.UID_PROPERTY_] = ++goog.uidCounter_);
};
goog.hasUid = function(obj) {
  return!!obj[goog.UID_PROPERTY_];
};
goog.removeUid = function(obj) {
  if ("removeAttribute" in obj) {
    obj.removeAttribute(goog.UID_PROPERTY_);
  }
  try {
    delete obj[goog.UID_PROPERTY_];
  } catch (ex) {
  }
};
goog.UID_PROPERTY_ = "closure_uid_" + (Math.random() * 1E9 >>> 0);
goog.uidCounter_ = 0;
goog.getHashCode = goog.getUid;
goog.removeHashCode = goog.removeUid;
goog.cloneObject = function(obj) {
  var type = goog.typeOf(obj);
  if (type == "object" || type == "array") {
    if (obj.clone) {
      return obj.clone();
    }
    var clone = type == "array" ? [] : {};
    for (var key in obj) {
      clone[key] = goog.cloneObject(obj[key]);
    }
    return clone;
  }
  return obj;
};
goog.bindNative_ = function(fn, selfObj, var_args) {
  return(fn.call.apply(fn.bind, arguments));
};
goog.bindJs_ = function(fn, selfObj, var_args) {
  if (!fn) {
    throw new Error;
  }
  if (arguments.length > 2) {
    var boundArgs = Array.prototype.slice.call(arguments, 2);
    return function() {
      var newArgs = Array.prototype.slice.call(arguments);
      Array.prototype.unshift.apply(newArgs, boundArgs);
      return fn.apply(selfObj, newArgs);
    };
  } else {
    return function() {
      return fn.apply(selfObj, arguments);
    };
  }
};
goog.bind = function(fn, selfObj, var_args) {
  if (Function.prototype.bind && Function.prototype.bind.toString().indexOf("native code") != -1) {
    goog.bind = goog.bindNative_;
  } else {
    goog.bind = goog.bindJs_;
  }
  return goog.bind.apply(null, arguments);
};
goog.partial = function(fn, var_args) {
  var args = Array.prototype.slice.call(arguments, 1);
  return function() {
    var newArgs = args.slice();
    newArgs.push.apply(newArgs, arguments);
    return fn.apply(this, newArgs);
  };
};
goog.mixin = function(target, source) {
  for (var x in source) {
    target[x] = source[x];
  }
};
goog.now = goog.TRUSTED_SITE && Date.now || function() {
  return+new Date;
};
goog.globalEval = function(script) {
  if (goog.global.execScript) {
    goog.global.execScript(script, "JavaScript");
  } else {
    if (goog.global.eval) {
      if (goog.evalWorksForGlobals_ == null) {
        goog.global.eval("var _et_ = 1;");
        if (typeof goog.global["_et_"] != "undefined") {
          delete goog.global["_et_"];
          goog.evalWorksForGlobals_ = true;
        } else {
          goog.evalWorksForGlobals_ = false;
        }
      }
      if (goog.evalWorksForGlobals_) {
        goog.global.eval(script);
      } else {
        var doc = goog.global.document;
        var scriptElt = doc.createElement("script");
        scriptElt.type = "text/javascript";
        scriptElt.defer = false;
        scriptElt.appendChild(doc.createTextNode(script));
        doc.body.appendChild(scriptElt);
        doc.body.removeChild(scriptElt);
      }
    } else {
      throw Error("goog.globalEval not available");
    }
  }
};
goog.evalWorksForGlobals_ = null;
goog.cssNameMapping_;
goog.cssNameMappingStyle_;
goog.getCssName = function(className, opt_modifier) {
  var getMapping = function(cssName) {
    return goog.cssNameMapping_[cssName] || cssName;
  };
  var renameByParts = function(cssName) {
    var parts = cssName.split("-");
    var mapped = [];
    for (var i = 0;i < parts.length;i++) {
      mapped.push(getMapping(parts[i]));
    }
    return mapped.join("-");
  };
  var rename;
  if (goog.cssNameMapping_) {
    rename = goog.cssNameMappingStyle_ == "BY_WHOLE" ? getMapping : renameByParts;
  } else {
    rename = function(a) {
      return a;
    };
  }
  if (opt_modifier) {
    return className + "-" + rename(opt_modifier);
  } else {
    return rename(className);
  }
};
goog.setCssNameMapping = function(mapping, opt_style) {
  goog.cssNameMapping_ = mapping;
  goog.cssNameMappingStyle_ = opt_style;
};
goog.global.CLOSURE_CSS_NAME_MAPPING;
if (!COMPILED && goog.global.CLOSURE_CSS_NAME_MAPPING) {
  goog.cssNameMapping_ = goog.global.CLOSURE_CSS_NAME_MAPPING;
}
goog.getMsg = function(str, opt_values) {
  if (opt_values) {
    str = str.replace(/\{\$([^}]+)}/g, function(match, key) {
      return key in opt_values ? opt_values[key] : match;
    });
  }
  return str;
};
goog.getMsgWithFallback = function(a, b) {
  return a;
};
goog.exportSymbol = function(publicPath, object, opt_objectToExportTo) {
  goog.exportPath_(publicPath, object, opt_objectToExportTo);
};
goog.exportProperty = function(object, publicName, symbol) {
  object[publicName] = symbol;
};
goog.inherits = function(childCtor, parentCtor) {
  function tempCtor() {
  }
  tempCtor.prototype = parentCtor.prototype;
  childCtor.superClass_ = parentCtor.prototype;
  childCtor.prototype = new tempCtor;
  childCtor.prototype.constructor = childCtor;
  childCtor.base = function(me, methodName, var_args) {
    var args = new Array(arguments.length - 2);
    for (var i = 2;i < arguments.length;i++) {
      args[i - 2] = arguments[i];
    }
    return parentCtor.prototype[methodName].apply(me, args);
  };
};
goog.base = function(me, opt_methodName, var_args) {
  var caller = arguments.callee.caller;
  if (goog.STRICT_MODE_COMPATIBLE || goog.DEBUG && !caller) {
    throw Error("arguments.caller not defined.  goog.base() cannot be used " + "with strict mode code. See " + "http://www.ecma-international.org/ecma-262/5.1/#sec-C");
  }
  if (caller.superClass_) {
    var ctorArgs = new Array(arguments.length - 1);
    for (var i = 1;i < arguments.length;i++) {
      ctorArgs[i - 1] = arguments[i];
    }
    return caller.superClass_.constructor.apply(me, ctorArgs);
  }
  var args = new Array(arguments.length - 2);
  for (var i = 2;i < arguments.length;i++) {
    args[i - 2] = arguments[i];
  }
  var foundCaller = false;
  for (var ctor = me.constructor;ctor;ctor = ctor.superClass_ && ctor.superClass_.constructor) {
    if (ctor.prototype[opt_methodName] === caller) {
      foundCaller = true;
    } else {
      if (foundCaller) {
        return ctor.prototype[opt_methodName].apply(me, args);
      }
    }
  }
  if (me[opt_methodName] === caller) {
    return me.constructor.prototype[opt_methodName].apply(me, args);
  } else {
    throw Error("goog.base called from a method of one name " + "to a method of a different name");
  }
};
goog.scope = function(fn) {
  fn.call(goog.global);
};
if (!COMPILED) {
  goog.global["COMPILED"] = COMPILED;
}
goog.defineClass = function(superClass, def) {
  var constructor = def.constructor;
  var statics = def.statics;
  if (!constructor || constructor == Object.prototype.constructor) {
    constructor = function() {
      throw Error("cannot instantiate an interface (no constructor defined).");
    };
  }
  var cls = goog.defineClass.createSealingConstructor_(constructor, superClass);
  if (superClass) {
    goog.inherits(cls, superClass);
  }
  delete def.constructor;
  delete def.statics;
  goog.defineClass.applyProperties_(cls.prototype, def);
  if (statics != null) {
    if (statics instanceof Function) {
      statics(cls);
    } else {
      goog.defineClass.applyProperties_(cls, statics);
    }
  }
  return cls;
};
goog.defineClass.ClassDescriptor;
goog.define("goog.defineClass.SEAL_CLASS_INSTANCES", goog.DEBUG);
goog.defineClass.createSealingConstructor_ = function(ctr, superClass) {
  if (goog.defineClass.SEAL_CLASS_INSTANCES && Object.seal instanceof Function) {
    if (superClass && superClass.prototype && superClass.prototype[goog.UNSEALABLE_CONSTRUCTOR_PROPERTY_]) {
      return ctr;
    }
    var wrappedCtr = function() {
      var instance = ctr.apply(this, arguments) || this;
      instance[goog.UID_PROPERTY_] = instance[goog.UID_PROPERTY_];
      if (this.constructor === wrappedCtr) {
        Object.seal(instance);
      }
      return instance;
    };
    return wrappedCtr;
  }
  return ctr;
};
goog.defineClass.OBJECT_PROTOTYPE_FIELDS_ = ["constructor", "hasOwnProperty", "isPrototypeOf", "propertyIsEnumerable", "toLocaleString", "toString", "valueOf"];
goog.defineClass.applyProperties_ = function(target, source) {
  var key;
  for (key in source) {
    if (Object.prototype.hasOwnProperty.call(source, key)) {
      target[key] = source[key];
    }
  }
  for (var i = 0;i < goog.defineClass.OBJECT_PROTOTYPE_FIELDS_.length;i++) {
    key = goog.defineClass.OBJECT_PROTOTYPE_FIELDS_[i];
    if (Object.prototype.hasOwnProperty.call(source, key)) {
      target[key] = source[key];
    }
  }
};
goog.tagUnsealableClass = function(ctr) {
  if (!COMPILED && goog.defineClass.SEAL_CLASS_INSTANCES) {
    ctr.prototype[goog.UNSEALABLE_CONSTRUCTOR_PROPERTY_] = true;
  }
};
goog.UNSEALABLE_CONSTRUCTOR_PROPERTY_ = "goog_defineClass_legacy_unsealable";
goog.provide("goog.debug.Error");
goog.debug.Error = function(opt_msg) {
  if (Error.captureStackTrace) {
    Error.captureStackTrace(this, goog.debug.Error);
  } else {
    var stack = (new Error).stack;
    if (stack) {
      this.stack = stack;
    }
  }
  if (opt_msg) {
    this.message = String(opt_msg);
  }
};
goog.inherits(goog.debug.Error, Error);
goog.debug.Error.prototype.name = "CustomError";
goog.provide("goog.object");
goog.object.forEach = function(obj, f, opt_obj) {
  for (var key in obj) {
    f.call(opt_obj, obj[key], key, obj);
  }
};
goog.object.filter = function(obj, f, opt_obj) {
  var res = {};
  for (var key in obj) {
    if (f.call(opt_obj, obj[key], key, obj)) {
      res[key] = obj[key];
    }
  }
  return res;
};
goog.object.map = function(obj, f, opt_obj) {
  var res = {};
  for (var key in obj) {
    res[key] = f.call(opt_obj, obj[key], key, obj);
  }
  return res;
};
goog.object.some = function(obj, f, opt_obj) {
  for (var key in obj) {
    if (f.call(opt_obj, obj[key], key, obj)) {
      return true;
    }
  }
  return false;
};
goog.object.every = function(obj, f, opt_obj) {
  for (var key in obj) {
    if (!f.call(opt_obj, obj[key], key, obj)) {
      return false;
    }
  }
  return true;
};
goog.object.getCount = function(obj) {
  var rv = 0;
  for (var key in obj) {
    rv++;
  }
  return rv;
};
goog.object.getAnyKey = function(obj) {
  for (var key in obj) {
    return key;
  }
};
goog.object.getAnyValue = function(obj) {
  for (var key in obj) {
    return obj[key];
  }
};
goog.object.contains = function(obj, val) {
  return goog.object.containsValue(obj, val);
};
goog.object.getValues = function(obj) {
  var res = [];
  var i = 0;
  for (var key in obj) {
    res[i++] = obj[key];
  }
  return res;
};
goog.object.getKeys = function(obj) {
  var res = [];
  var i = 0;
  for (var key in obj) {
    res[i++] = key;
  }
  return res;
};
goog.object.getValueByKeys = function(obj, var_args) {
  var isArrayLike = goog.isArrayLike(var_args);
  var keys = isArrayLike ? var_args : arguments;
  for (var i = isArrayLike ? 0 : 1;i < keys.length;i++) {
    obj = obj[keys[i]];
    if (!goog.isDef(obj)) {
      break;
    }
  }
  return obj;
};
goog.object.containsKey = function(obj, key) {
  return key in obj;
};
goog.object.containsValue = function(obj, val) {
  for (var key in obj) {
    if (obj[key] == val) {
      return true;
    }
  }
  return false;
};
goog.object.findKey = function(obj, f, opt_this) {
  for (var key in obj) {
    if (f.call(opt_this, obj[key], key, obj)) {
      return key;
    }
  }
  return undefined;
};
goog.object.findValue = function(obj, f, opt_this) {
  var key = goog.object.findKey(obj, f, opt_this);
  return key && obj[key];
};
goog.object.isEmpty = function(obj) {
  for (var key in obj) {
    return false;
  }
  return true;
};
goog.object.clear = function(obj) {
  for (var i in obj) {
    delete obj[i];
  }
};
goog.object.remove = function(obj, key) {
  var rv;
  if (rv = key in obj) {
    delete obj[key];
  }
  return rv;
};
goog.object.add = function(obj, key, val) {
  if (key in obj) {
    throw Error('The object already contains the key "' + key + '"');
  }
  goog.object.set(obj, key, val);
};
goog.object.get = function(obj, key, opt_val) {
  if (key in obj) {
    return obj[key];
  }
  return opt_val;
};
goog.object.set = function(obj, key, value) {
  obj[key] = value;
};
goog.object.setIfUndefined = function(obj, key, value) {
  return key in obj ? obj[key] : obj[key] = value;
};
goog.object.setWithReturnValueIfNotSet = function(obj, key, f) {
  if (key in obj) {
    return obj[key];
  }
  var val = f();
  obj[key] = val;
  return val;
};
goog.object.equals = function(a, b) {
  for (var k in a) {
    if (!(k in b) || a[k] !== b[k]) {
      return false;
    }
  }
  for (var k in b) {
    if (!(k in a)) {
      return false;
    }
  }
  return true;
};
goog.object.clone = function(obj) {
  var res = {};
  for (var key in obj) {
    res[key] = obj[key];
  }
  return res;
};
goog.object.unsafeClone = function(obj) {
  var type = goog.typeOf(obj);
  if (type == "object" || type == "array") {
    if (obj.clone) {
      return obj.clone();
    }
    var clone = type == "array" ? [] : {};
    for (var key in obj) {
      clone[key] = goog.object.unsafeClone(obj[key]);
    }
    return clone;
  }
  return obj;
};
goog.object.transpose = function(obj) {
  var transposed = {};
  for (var key in obj) {
    transposed[obj[key]] = key;
  }
  return transposed;
};
goog.object.PROTOTYPE_FIELDS_ = ["constructor", "hasOwnProperty", "isPrototypeOf", "propertyIsEnumerable", "toLocaleString", "toString", "valueOf"];
goog.object.extend = function(target, var_args) {
  var key, source;
  for (var i = 1;i < arguments.length;i++) {
    source = arguments[i];
    for (key in source) {
      target[key] = source[key];
    }
    for (var j = 0;j < goog.object.PROTOTYPE_FIELDS_.length;j++) {
      key = goog.object.PROTOTYPE_FIELDS_[j];
      if (Object.prototype.hasOwnProperty.call(source, key)) {
        target[key] = source[key];
      }
    }
  }
};
goog.object.create = function(var_args) {
  var argLength = arguments.length;
  if (argLength == 1 && goog.isArray(arguments[0])) {
    return goog.object.create.apply(null, arguments[0]);
  }
  if (argLength % 2) {
    throw Error("Uneven number of arguments");
  }
  var rv = {};
  for (var i = 0;i < argLength;i += 2) {
    rv[arguments[i]] = arguments[i + 1];
  }
  return rv;
};
goog.object.createSet = function(var_args) {
  var argLength = arguments.length;
  if (argLength == 1 && goog.isArray(arguments[0])) {
    return goog.object.createSet.apply(null, arguments[0]);
  }
  var rv = {};
  for (var i = 0;i < argLength;i++) {
    rv[arguments[i]] = true;
  }
  return rv;
};
goog.object.createImmutableView = function(obj) {
  var result = obj;
  if (Object.isFrozen && !Object.isFrozen(obj)) {
    result = Object.create(obj);
    Object.freeze(result);
  }
  return result;
};
goog.object.isImmutableView = function(obj) {
  return!!Object.isFrozen && Object.isFrozen(obj);
};
goog.provide("goog.dom.NodeType");
goog.dom.NodeType = {ELEMENT:1, ATTRIBUTE:2, TEXT:3, CDATA_SECTION:4, ENTITY_REFERENCE:5, ENTITY:6, PROCESSING_INSTRUCTION:7, COMMENT:8, DOCUMENT:9, DOCUMENT_TYPE:10, DOCUMENT_FRAGMENT:11, NOTATION:12};
goog.provide("goog.json");
goog.provide("goog.json.Replacer");
goog.provide("goog.json.Reviver");
goog.provide("goog.json.Serializer");
goog.define("goog.json.USE_NATIVE_JSON", false);
goog.json.isValid = function(s) {
  if (/^\s*$/.test(s)) {
    return false;
  }
  var backslashesRe = /\\["\\\/bfnrtu]/g;
  var simpleValuesRe = /"[^"\\\n\r\u2028\u2029\x00-\x08\x0a-\x1f]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g;
  var openBracketsRe = /(?:^|:|,)(?:[\s\u2028\u2029]*\[)+/g;
  var remainderRe = /^[\],:{}\s\u2028\u2029]*$/;
  return remainderRe.test(s.replace(backslashesRe, "@").replace(simpleValuesRe, "]").replace(openBracketsRe, ""));
};
goog.json.parse = goog.json.USE_NATIVE_JSON ? (goog.global["JSON"]["parse"]) : function(s) {
  var o = String(s);
  if (goog.json.isValid(o)) {
    try {
      return(eval("(" + o + ")"));
    } catch (ex) {
    }
  }
  throw Error("Invalid JSON string: " + o);
};
goog.json.unsafeParse = goog.json.USE_NATIVE_JSON ? (goog.global["JSON"]["parse"]) : function(s) {
  return(eval("(" + s + ")"));
};
goog.json.Replacer;
goog.json.Reviver;
goog.json.serialize = goog.json.USE_NATIVE_JSON ? (goog.global["JSON"]["stringify"]) : function(object, opt_replacer) {
  return(new goog.json.Serializer(opt_replacer)).serialize(object);
};
goog.json.Serializer = function(opt_replacer) {
  this.replacer_ = opt_replacer;
};
goog.json.Serializer.prototype.serialize = function(object) {
  var sb = [];
  this.serializeInternal(object, sb);
  return sb.join("");
};
goog.json.Serializer.prototype.serializeInternal = function(object, sb) {
  switch(typeof object) {
    case "string":
      this.serializeString_((object), sb);
      break;
    case "number":
      this.serializeNumber_((object), sb);
      break;
    case "boolean":
      sb.push(object);
      break;
    case "undefined":
      sb.push("null");
      break;
    case "object":
      if (object == null) {
        sb.push("null");
        break;
      }
      if (goog.isArray(object)) {
        this.serializeArray((object), sb);
        break;
      }
      this.serializeObject_((object), sb);
      break;
    case "function":
      break;
    default:
      throw Error("Unknown type: " + typeof object);;
  }
};
goog.json.Serializer.charToJsonCharCache_ = {'"':'\\"', "\\":"\\\\", "/":"\\/", "\b":"\\b", "\f":"\\f", "\n":"\\n", "\r":"\\r", "\t":"\\t", "\x0B":"\\u000b"};
goog.json.Serializer.charsToReplace_ = /\uffff/.test("\uffff") ? /[\\\"\x00-\x1f\x7f-\uffff]/g : /[\\\"\x00-\x1f\x7f-\xff]/g;
goog.json.Serializer.prototype.serializeString_ = function(s, sb) {
  sb.push('"', s.replace(goog.json.Serializer.charsToReplace_, function(c) {
    if (c in goog.json.Serializer.charToJsonCharCache_) {
      return goog.json.Serializer.charToJsonCharCache_[c];
    }
    var cc = c.charCodeAt(0);
    var rv = "\\u";
    if (cc < 16) {
      rv += "000";
    } else {
      if (cc < 256) {
        rv += "00";
      } else {
        if (cc < 4096) {
          rv += "0";
        }
      }
    }
    return goog.json.Serializer.charToJsonCharCache_[c] = rv + cc.toString(16);
  }), '"');
};
goog.json.Serializer.prototype.serializeNumber_ = function(n, sb) {
  sb.push(isFinite(n) && !isNaN(n) ? n : "null");
};
goog.json.Serializer.prototype.serializeArray = function(arr, sb) {
  var l = arr.length;
  sb.push("[");
  var sep = "";
  for (var i = 0;i < l;i++) {
    sb.push(sep);
    var value = arr[i];
    this.serializeInternal(this.replacer_ ? this.replacer_.call(arr, String(i), value) : value, sb);
    sep = ",";
  }
  sb.push("]");
};
goog.json.Serializer.prototype.serializeObject_ = function(obj, sb) {
  sb.push("{");
  var sep = "";
  for (var key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      var value = obj[key];
      if (typeof value != "function") {
        sb.push(sep);
        this.serializeString_(key, sb);
        sb.push(":");
        this.serializeInternal(this.replacer_ ? this.replacer_.call(obj, key, value) : value, sb);
        sep = ",";
      }
    }
  }
  sb.push("}");
};
goog.provide("goog.string");
goog.provide("goog.string.Unicode");
goog.define("goog.string.DETECT_DOUBLE_ESCAPING", false);
goog.define("goog.string.FORCE_NON_DOM_HTML_UNESCAPING", false);
goog.string.Unicode = {NBSP:"\u00a0"};
goog.string.startsWith = function(str, prefix) {
  return str.lastIndexOf(prefix, 0) == 0;
};
goog.string.endsWith = function(str, suffix) {
  var l = str.length - suffix.length;
  return l >= 0 && str.indexOf(suffix, l) == l;
};
goog.string.caseInsensitiveStartsWith = function(str, prefix) {
  return goog.string.caseInsensitiveCompare(prefix, str.substr(0, prefix.length)) == 0;
};
goog.string.caseInsensitiveEndsWith = function(str, suffix) {
  return goog.string.caseInsensitiveCompare(suffix, str.substr(str.length - suffix.length, suffix.length)) == 0;
};
goog.string.caseInsensitiveEquals = function(str1, str2) {
  return str1.toLowerCase() == str2.toLowerCase();
};
goog.string.subs = function(str, var_args) {
  var splitParts = str.split("%s");
  var returnString = "";
  var subsArguments = Array.prototype.slice.call(arguments, 1);
  while (subsArguments.length && splitParts.length > 1) {
    returnString += splitParts.shift() + subsArguments.shift();
  }
  return returnString + splitParts.join("%s");
};
goog.string.collapseWhitespace = function(str) {
  return str.replace(/[\s\xa0]+/g, " ").replace(/^\s+|\s+$/g, "");
};
goog.string.isEmptyOrWhitespace = function(str) {
  return/^[\s\xa0]*$/.test(str);
};
goog.string.isEmptyString = function(str) {
  return str.length == 0;
};
goog.string.isEmpty = goog.string.isEmptyOrWhitespace;
goog.string.isEmptyOrWhitespaceSafe = function(str) {
  return goog.string.isEmptyOrWhitespace(goog.string.makeSafe(str));
};
goog.string.isEmptySafe = goog.string.isEmptyOrWhitespaceSafe;
goog.string.isBreakingWhitespace = function(str) {
  return!/[^\t\n\r ]/.test(str);
};
goog.string.isAlpha = function(str) {
  return!/[^a-zA-Z]/.test(str);
};
goog.string.isNumeric = function(str) {
  return!/[^0-9]/.test(str);
};
goog.string.isAlphaNumeric = function(str) {
  return!/[^a-zA-Z0-9]/.test(str);
};
goog.string.isSpace = function(ch) {
  return ch == " ";
};
goog.string.isUnicodeChar = function(ch) {
  return ch.length == 1 && ch >= " " && ch <= "~" || ch >= "\u0080" && ch <= "\ufffd";
};
goog.string.stripNewlines = function(str) {
  return str.replace(/(\r\n|\r|\n)+/g, " ");
};
goog.string.canonicalizeNewlines = function(str) {
  return str.replace(/(\r\n|\r|\n)/g, "\n");
};
goog.string.normalizeWhitespace = function(str) {
  return str.replace(/\xa0|\s/g, " ");
};
goog.string.normalizeSpaces = function(str) {
  return str.replace(/\xa0|[ \t]+/g, " ");
};
goog.string.collapseBreakingSpaces = function(str) {
  return str.replace(/[\t\r\n ]+/g, " ").replace(/^[\t\r\n ]+|[\t\r\n ]+$/g, "");
};
goog.string.trim = goog.TRUSTED_SITE && String.prototype.trim ? function(str) {
  return str.trim();
} : function(str) {
  return str.replace(/^[\s\xa0]+|[\s\xa0]+$/g, "");
};
goog.string.trimLeft = function(str) {
  return str.replace(/^[\s\xa0]+/, "");
};
goog.string.trimRight = function(str) {
  return str.replace(/[\s\xa0]+$/, "");
};
goog.string.caseInsensitiveCompare = function(str1, str2) {
  var test1 = String(str1).toLowerCase();
  var test2 = String(str2).toLowerCase();
  if (test1 < test2) {
    return-1;
  } else {
    if (test1 == test2) {
      return 0;
    } else {
      return 1;
    }
  }
};
goog.string.numerateCompareRegExp_ = /(\.\d+)|(\d+)|(\D+)/g;
goog.string.numerateCompare = function(str1, str2) {
  if (str1 == str2) {
    return 0;
  }
  if (!str1) {
    return-1;
  }
  if (!str2) {
    return 1;
  }
  var tokens1 = str1.toLowerCase().match(goog.string.numerateCompareRegExp_);
  var tokens2 = str2.toLowerCase().match(goog.string.numerateCompareRegExp_);
  var count = Math.min(tokens1.length, tokens2.length);
  for (var i = 0;i < count;i++) {
    var a = tokens1[i];
    var b = tokens2[i];
    if (a != b) {
      var num1 = parseInt(a, 10);
      if (!isNaN(num1)) {
        var num2 = parseInt(b, 10);
        if (!isNaN(num2) && num1 - num2) {
          return num1 - num2;
        }
      }
      return a < b ? -1 : 1;
    }
  }
  if (tokens1.length != tokens2.length) {
    return tokens1.length - tokens2.length;
  }
  return str1 < str2 ? -1 : 1;
};
goog.string.urlEncode = function(str) {
  return encodeURIComponent(String(str));
};
goog.string.urlDecode = function(str) {
  return decodeURIComponent(str.replace(/\+/g, " "));
};
goog.string.newLineToBr = function(str, opt_xml) {
  return str.replace(/(\r\n|\r|\n)/g, opt_xml ? "<br />" : "<br>");
};
goog.string.htmlEscape = function(str, opt_isLikelyToContainHtmlChars) {
  if (opt_isLikelyToContainHtmlChars) {
    str = str.replace(goog.string.AMP_RE_, "&amp;").replace(goog.string.LT_RE_, "&lt;").replace(goog.string.GT_RE_, "&gt;").replace(goog.string.QUOT_RE_, "&quot;").replace(goog.string.SINGLE_QUOTE_RE_, "&#39;").replace(goog.string.NULL_RE_, "&#0;");
    if (goog.string.DETECT_DOUBLE_ESCAPING) {
      str = str.replace(goog.string.E_RE_, "&#101;");
    }
    return str;
  } else {
    if (!goog.string.ALL_RE_.test(str)) {
      return str;
    }
    if (str.indexOf("&") != -1) {
      str = str.replace(goog.string.AMP_RE_, "&amp;");
    }
    if (str.indexOf("<") != -1) {
      str = str.replace(goog.string.LT_RE_, "&lt;");
    }
    if (str.indexOf(">") != -1) {
      str = str.replace(goog.string.GT_RE_, "&gt;");
    }
    if (str.indexOf('"') != -1) {
      str = str.replace(goog.string.QUOT_RE_, "&quot;");
    }
    if (str.indexOf("'") != -1) {
      str = str.replace(goog.string.SINGLE_QUOTE_RE_, "&#39;");
    }
    if (str.indexOf("\x00") != -1) {
      str = str.replace(goog.string.NULL_RE_, "&#0;");
    }
    if (goog.string.DETECT_DOUBLE_ESCAPING && str.indexOf("e") != -1) {
      str = str.replace(goog.string.E_RE_, "&#101;");
    }
    return str;
  }
};
goog.string.AMP_RE_ = /&/g;
goog.string.LT_RE_ = /</g;
goog.string.GT_RE_ = />/g;
goog.string.QUOT_RE_ = /"/g;
goog.string.SINGLE_QUOTE_RE_ = /'/g;
goog.string.NULL_RE_ = /\x00/g;
goog.string.E_RE_ = /e/g;
goog.string.ALL_RE_ = goog.string.DETECT_DOUBLE_ESCAPING ? /[\x00&<>"'e]/ : /[\x00&<>"']/;
goog.string.unescapeEntities = function(str) {
  if (goog.string.contains(str, "&")) {
    if (!goog.string.FORCE_NON_DOM_HTML_UNESCAPING && "document" in goog.global) {
      return goog.string.unescapeEntitiesUsingDom_(str);
    } else {
      return goog.string.unescapePureXmlEntities_(str);
    }
  }
  return str;
};
goog.string.unescapeEntitiesWithDocument = function(str, document) {
  if (goog.string.contains(str, "&")) {
    return goog.string.unescapeEntitiesUsingDom_(str, document);
  }
  return str;
};
goog.string.unescapeEntitiesUsingDom_ = function(str, opt_document) {
  var seen = {"&amp;":"&", "&lt;":"<", "&gt;":">", "&quot;":'"'};
  var div;
  if (opt_document) {
    div = opt_document.createElement("div");
  } else {
    div = goog.global.document.createElement("div");
  }
  return str.replace(goog.string.HTML_ENTITY_PATTERN_, function(s, entity) {
    var value = seen[s];
    if (value) {
      return value;
    }
    if (entity.charAt(0) == "#") {
      var n = Number("0" + entity.substr(1));
      if (!isNaN(n)) {
        value = String.fromCharCode(n);
      }
    }
    if (!value) {
      div.innerHTML = s + " ";
      value = div.firstChild.nodeValue.slice(0, -1);
    }
    return seen[s] = value;
  });
};
goog.string.unescapePureXmlEntities_ = function(str) {
  return str.replace(/&([^;]+);/g, function(s, entity) {
    switch(entity) {
      case "amp":
        return "&";
      case "lt":
        return "<";
      case "gt":
        return ">";
      case "quot":
        return'"';
      default:
        if (entity.charAt(0) == "#") {
          var n = Number("0" + entity.substr(1));
          if (!isNaN(n)) {
            return String.fromCharCode(n);
          }
        }
        return s;
    }
  });
};
goog.string.HTML_ENTITY_PATTERN_ = /&([^;\s<&]+);?/g;
goog.string.whitespaceEscape = function(str, opt_xml) {
  return goog.string.newLineToBr(str.replace(/  /g, " &#160;"), opt_xml);
};
goog.string.preserveSpaces = function(str) {
  return str.replace(/(^|[\n ]) /g, "$1" + goog.string.Unicode.NBSP);
};
goog.string.stripQuotes = function(str, quoteChars) {
  var length = quoteChars.length;
  for (var i = 0;i < length;i++) {
    var quoteChar = length == 1 ? quoteChars : quoteChars.charAt(i);
    if (str.charAt(0) == quoteChar && str.charAt(str.length - 1) == quoteChar) {
      return str.substring(1, str.length - 1);
    }
  }
  return str;
};
goog.string.truncate = function(str, chars, opt_protectEscapedCharacters) {
  if (opt_protectEscapedCharacters) {
    str = goog.string.unescapeEntities(str);
  }
  if (str.length > chars) {
    str = str.substring(0, chars - 3) + "...";
  }
  if (opt_protectEscapedCharacters) {
    str = goog.string.htmlEscape(str);
  }
  return str;
};
goog.string.truncateMiddle = function(str, chars, opt_protectEscapedCharacters, opt_trailingChars) {
  if (opt_protectEscapedCharacters) {
    str = goog.string.unescapeEntities(str);
  }
  if (opt_trailingChars && str.length > chars) {
    if (opt_trailingChars > chars) {
      opt_trailingChars = chars;
    }
    var endPoint = str.length - opt_trailingChars;
    var startPoint = chars - opt_trailingChars;
    str = str.substring(0, startPoint) + "..." + str.substring(endPoint);
  } else {
    if (str.length > chars) {
      var half = Math.floor(chars / 2);
      var endPos = str.length - half;
      half += chars % 2;
      str = str.substring(0, half) + "..." + str.substring(endPos);
    }
  }
  if (opt_protectEscapedCharacters) {
    str = goog.string.htmlEscape(str);
  }
  return str;
};
goog.string.specialEscapeChars_ = {"\x00":"\\0", "\b":"\\b", "\f":"\\f", "\n":"\\n", "\r":"\\r", "\t":"\\t", "\x0B":"\\x0B", '"':'\\"', "\\":"\\\\"};
goog.string.jsEscapeCache_ = {"'":"\\'"};
goog.string.quote = function(s) {
  s = String(s);
  if (s.quote) {
    return s.quote();
  } else {
    var sb = ['"'];
    for (var i = 0;i < s.length;i++) {
      var ch = s.charAt(i);
      var cc = ch.charCodeAt(0);
      sb[i + 1] = goog.string.specialEscapeChars_[ch] || (cc > 31 && cc < 127 ? ch : goog.string.escapeChar(ch));
    }
    sb.push('"');
    return sb.join("");
  }
};
goog.string.escapeString = function(str) {
  var sb = [];
  for (var i = 0;i < str.length;i++) {
    sb[i] = goog.string.escapeChar(str.charAt(i));
  }
  return sb.join("");
};
goog.string.escapeChar = function(c) {
  if (c in goog.string.jsEscapeCache_) {
    return goog.string.jsEscapeCache_[c];
  }
  if (c in goog.string.specialEscapeChars_) {
    return goog.string.jsEscapeCache_[c] = goog.string.specialEscapeChars_[c];
  }
  var rv = c;
  var cc = c.charCodeAt(0);
  if (cc > 31 && cc < 127) {
    rv = c;
  } else {
    if (cc < 256) {
      rv = "\\x";
      if (cc < 16 || cc > 256) {
        rv += "0";
      }
    } else {
      rv = "\\u";
      if (cc < 4096) {
        rv += "0";
      }
    }
    rv += cc.toString(16).toUpperCase();
  }
  return goog.string.jsEscapeCache_[c] = rv;
};
goog.string.contains = function(str, subString) {
  return str.indexOf(subString) != -1;
};
goog.string.caseInsensitiveContains = function(str, subString) {
  return goog.string.contains(str.toLowerCase(), subString.toLowerCase());
};
goog.string.countOf = function(s, ss) {
  return s && ss ? s.split(ss).length - 1 : 0;
};
goog.string.removeAt = function(s, index, stringLength) {
  var resultStr = s;
  if (index >= 0 && index < s.length && stringLength > 0) {
    resultStr = s.substr(0, index) + s.substr(index + stringLength, s.length - index - stringLength);
  }
  return resultStr;
};
goog.string.remove = function(s, ss) {
  var re = new RegExp(goog.string.regExpEscape(ss), "");
  return s.replace(re, "");
};
goog.string.removeAll = function(s, ss) {
  var re = new RegExp(goog.string.regExpEscape(ss), "g");
  return s.replace(re, "");
};
goog.string.regExpEscape = function(s) {
  return String(s).replace(/([-()\[\]{}+?*.$\^|,:#<!\\])/g, "\\$1").replace(/\x08/g, "\\x08");
};
goog.string.repeat = function(string, length) {
  return(new Array(length + 1)).join(string);
};
goog.string.padNumber = function(num, length, opt_precision) {
  var s = goog.isDef(opt_precision) ? num.toFixed(opt_precision) : String(num);
  var index = s.indexOf(".");
  if (index == -1) {
    index = s.length;
  }
  return goog.string.repeat("0", Math.max(0, length - index)) + s;
};
goog.string.makeSafe = function(obj) {
  return obj == null ? "" : String(obj);
};
goog.string.buildString = function(var_args) {
  return Array.prototype.join.call(arguments, "");
};
goog.string.getRandomString = function() {
  var x = 2147483648;
  return Math.floor(Math.random() * x).toString(36) + Math.abs(Math.floor(Math.random() * x) ^ goog.now()).toString(36);
};
goog.string.compareVersions = function(version1, version2) {
  var order = 0;
  var v1Subs = goog.string.trim(String(version1)).split(".");
  var v2Subs = goog.string.trim(String(version2)).split(".");
  var subCount = Math.max(v1Subs.length, v2Subs.length);
  for (var subIdx = 0;order == 0 && subIdx < subCount;subIdx++) {
    var v1Sub = v1Subs[subIdx] || "";
    var v2Sub = v2Subs[subIdx] || "";
    var v1CompParser = new RegExp("(\\d*)(\\D*)", "g");
    var v2CompParser = new RegExp("(\\d*)(\\D*)", "g");
    do {
      var v1Comp = v1CompParser.exec(v1Sub) || ["", "", ""];
      var v2Comp = v2CompParser.exec(v2Sub) || ["", "", ""];
      if (v1Comp[0].length == 0 && v2Comp[0].length == 0) {
        break;
      }
      var v1CompNum = v1Comp[1].length == 0 ? 0 : parseInt(v1Comp[1], 10);
      var v2CompNum = v2Comp[1].length == 0 ? 0 : parseInt(v2Comp[1], 10);
      order = goog.string.compareElements_(v1CompNum, v2CompNum) || goog.string.compareElements_(v1Comp[2].length == 0, v2Comp[2].length == 0) || goog.string.compareElements_(v1Comp[2], v2Comp[2]);
    } while (order == 0);
  }
  return order;
};
goog.string.compareElements_ = function(left, right) {
  if (left < right) {
    return-1;
  } else {
    if (left > right) {
      return 1;
    }
  }
  return 0;
};
goog.string.HASHCODE_MAX_ = 4294967296;
goog.string.hashCode = function(str) {
  var result = 0;
  for (var i = 0;i < str.length;++i) {
    result = 31 * result + str.charCodeAt(i);
    result %= goog.string.HASHCODE_MAX_;
  }
  return result;
};
goog.string.uniqueStringCounter_ = Math.random() * 2147483648 | 0;
goog.string.createUniqueString = function() {
  return "goog_" + goog.string.uniqueStringCounter_++;
};
goog.string.toNumber = function(str) {
  var num = Number(str);
  if (num == 0 && goog.string.isEmptyOrWhitespace(str)) {
    return NaN;
  }
  return num;
};
goog.string.isLowerCamelCase = function(str) {
  return/^[a-z]+([A-Z][a-z]*)*$/.test(str);
};
goog.string.isUpperCamelCase = function(str) {
  return/^([A-Z][a-z]*)+$/.test(str);
};
goog.string.toCamelCase = function(str) {
  return String(str).replace(/\-([a-z])/g, function(all, match) {
    return match.toUpperCase();
  });
};
goog.string.toSelectorCase = function(str) {
  return String(str).replace(/([A-Z])/g, "-$1").toLowerCase();
};
goog.string.toTitleCase = function(str, opt_delimiters) {
  var delimiters = goog.isString(opt_delimiters) ? goog.string.regExpEscape(opt_delimiters) : "\\s";
  delimiters = delimiters ? "|[" + delimiters + "]+" : "";
  var regexp = new RegExp("(^" + delimiters + ")([a-z])", "g");
  return str.replace(regexp, function(all, p1, p2) {
    return p1 + p2.toUpperCase();
  });
};
goog.string.capitalize = function(str) {
  return String(str.charAt(0)).toUpperCase() + String(str.substr(1)).toLowerCase();
};
goog.string.parseInt = function(value) {
  if (isFinite(value)) {
    value = String(value);
  }
  if (goog.isString(value)) {
    return/^\s*-?0x/i.test(value) ? parseInt(value, 16) : parseInt(value, 10);
  }
  return NaN;
};
goog.string.splitLimit = function(str, separator, limit) {
  var parts = str.split(separator);
  var returnVal = [];
  while (limit > 0 && parts.length) {
    returnVal.push(parts.shift());
    limit--;
  }
  if (parts.length) {
    returnVal.push(parts.join(separator));
  }
  return returnVal;
};
goog.string.editDistance = function(a, b) {
  var v0 = [];
  var v1 = [];
  if (a == b) {
    return 0;
  }
  if (!a.length || !b.length) {
    return Math.max(a.length, b.length);
  }
  for (var i = 0;i < b.length + 1;i++) {
    v0[i] = i;
  }
  for (var i = 0;i < a.length;i++) {
    v1[0] = i + 1;
    for (var j = 0;j < b.length;j++) {
      var cost = a[i] != b[j];
      v1[j + 1] = Math.min(v1[j] + 1, v0[j + 1] + 1, v0[j] + cost);
    }
    for (var j = 0;j < v0.length;j++) {
      v0[j] = v1[j];
    }
  }
  return v1[b.length];
};
goog.provide("goog.labs.userAgent.util");
goog.require("goog.string");
goog.labs.userAgent.util.getNativeUserAgentString_ = function() {
  var navigator = goog.labs.userAgent.util.getNavigator_();
  if (navigator) {
    var userAgent = navigator.userAgent;
    if (userAgent) {
      return userAgent;
    }
  }
  return "";
};
goog.labs.userAgent.util.getNavigator_ = function() {
  return goog.global.navigator;
};
goog.labs.userAgent.util.userAgent_ = goog.labs.userAgent.util.getNativeUserAgentString_();
goog.labs.userAgent.util.setUserAgent = function(opt_userAgent) {
  goog.labs.userAgent.util.userAgent_ = opt_userAgent || goog.labs.userAgent.util.getNativeUserAgentString_();
};
goog.labs.userAgent.util.getUserAgent = function() {
  return goog.labs.userAgent.util.userAgent_;
};
goog.labs.userAgent.util.matchUserAgent = function(str) {
  var userAgent = goog.labs.userAgent.util.getUserAgent();
  return goog.string.contains(userAgent, str);
};
goog.labs.userAgent.util.matchUserAgentIgnoreCase = function(str) {
  var userAgent = goog.labs.userAgent.util.getUserAgent();
  return goog.string.caseInsensitiveContains(userAgent, str);
};
goog.labs.userAgent.util.extractVersionTuples = function(userAgent) {
  var versionRegExp = new RegExp("(\\w[\\w ]+)" + "/" + "([^\\s]+)" + "\\s*" + "(?:\\((.*?)\\))?", "g");
  var data = [];
  var match;
  while (match = versionRegExp.exec(userAgent)) {
    data.push([match[1], match[2], match[3] || undefined]);
  }
  return data;
};
goog.provide("goog.labs.userAgent.platform");
goog.require("goog.labs.userAgent.util");
goog.require("goog.string");
goog.labs.userAgent.platform.isAndroid = function() {
  return goog.labs.userAgent.util.matchUserAgent("Android");
};
goog.labs.userAgent.platform.isIpod = function() {
  return goog.labs.userAgent.util.matchUserAgent("iPod");
};
goog.labs.userAgent.platform.isIphone = function() {
  return goog.labs.userAgent.util.matchUserAgent("iPhone") && !goog.labs.userAgent.util.matchUserAgent("iPod") && !goog.labs.userAgent.util.matchUserAgent("iPad");
};
goog.labs.userAgent.platform.isIpad = function() {
  return goog.labs.userAgent.util.matchUserAgent("iPad");
};
goog.labs.userAgent.platform.isIos = function() {
  return goog.labs.userAgent.platform.isIphone() || goog.labs.userAgent.platform.isIpad() || goog.labs.userAgent.platform.isIpod();
};
goog.labs.userAgent.platform.isMacintosh = function() {
  return goog.labs.userAgent.util.matchUserAgent("Macintosh");
};
goog.labs.userAgent.platform.isLinux = function() {
  return goog.labs.userAgent.util.matchUserAgent("Linux");
};
goog.labs.userAgent.platform.isWindows = function() {
  return goog.labs.userAgent.util.matchUserAgent("Windows");
};
goog.labs.userAgent.platform.isChromeOS = function() {
  return goog.labs.userAgent.util.matchUserAgent("CrOS");
};
goog.labs.userAgent.platform.getVersion = function() {
  var userAgentString = goog.labs.userAgent.util.getUserAgent();
  var version = "", re;
  if (goog.labs.userAgent.platform.isWindows()) {
    re = /Windows (?:NT|Phone) ([0-9.]+)/;
    var match = re.exec(userAgentString);
    if (match) {
      version = match[1];
    } else {
      version = "0.0";
    }
  } else {
    if (goog.labs.userAgent.platform.isIos()) {
      re = /(?:iPhone|iPod|iPad|CPU)\s+OS\s+(\S+)/;
      var match = re.exec(userAgentString);
      version = match && match[1].replace(/_/g, ".");
    } else {
      if (goog.labs.userAgent.platform.isMacintosh()) {
        re = /Mac OS X ([0-9_.]+)/;
        var match = re.exec(userAgentString);
        version = match ? match[1].replace(/_/g, ".") : "10";
      } else {
        if (goog.labs.userAgent.platform.isAndroid()) {
          re = /Android\s+([^\);]+)(\)|;)/;
          var match = re.exec(userAgentString);
          version = match && match[1];
        } else {
          if (goog.labs.userAgent.platform.isChromeOS()) {
            re = /(?:CrOS\s+(?:i686|x86_64)\s+([0-9.]+))/;
            var match = re.exec(userAgentString);
            version = match && match[1];
          }
        }
      }
    }
  }
  return version || "";
};
goog.labs.userAgent.platform.isVersionOrHigher = function(version) {
  return goog.string.compareVersions(goog.labs.userAgent.platform.getVersion(), version) >= 0;
};
goog.provide("goog.crypt.Hash");
goog.crypt.Hash = function() {
  this.blockSize = -1;
};
goog.crypt.Hash.prototype.reset = goog.abstractMethod;
goog.crypt.Hash.prototype.update = goog.abstractMethod;
goog.crypt.Hash.prototype.digest = goog.abstractMethod;
goog.provide("goog.crypt.Sha1");
goog.require("goog.crypt.Hash");
goog.crypt.Sha1 = function() {
  goog.crypt.Sha1.base(this, "constructor");
  this.blockSize = 512 / 8;
  this.chain_ = [];
  this.buf_ = [];
  this.W_ = [];
  this.pad_ = [];
  this.pad_[0] = 128;
  for (var i = 1;i < this.blockSize;++i) {
    this.pad_[i] = 0;
  }
  this.inbuf_ = 0;
  this.total_ = 0;
  this.reset();
};
goog.inherits(goog.crypt.Sha1, goog.crypt.Hash);
goog.crypt.Sha1.prototype.reset = function() {
  this.chain_[0] = 1732584193;
  this.chain_[1] = 4023233417;
  this.chain_[2] = 2562383102;
  this.chain_[3] = 271733878;
  this.chain_[4] = 3285377520;
  this.inbuf_ = 0;
  this.total_ = 0;
};
goog.crypt.Sha1.prototype.compress_ = function(buf, opt_offset) {
  if (!opt_offset) {
    opt_offset = 0;
  }
  var W = this.W_;
  if (goog.isString(buf)) {
    for (var i = 0;i < 16;i++) {
      W[i] = buf.charCodeAt(opt_offset) << 24 | buf.charCodeAt(opt_offset + 1) << 16 | buf.charCodeAt(opt_offset + 2) << 8 | buf.charCodeAt(opt_offset + 3);
      opt_offset += 4;
    }
  } else {
    for (var i = 0;i < 16;i++) {
      W[i] = buf[opt_offset] << 24 | buf[opt_offset + 1] << 16 | buf[opt_offset + 2] << 8 | buf[opt_offset + 3];
      opt_offset += 4;
    }
  }
  for (var i = 16;i < 80;i++) {
    var t = W[i - 3] ^ W[i - 8] ^ W[i - 14] ^ W[i - 16];
    W[i] = (t << 1 | t >>> 31) & 4294967295;
  }
  var a = this.chain_[0];
  var b = this.chain_[1];
  var c = this.chain_[2];
  var d = this.chain_[3];
  var e = this.chain_[4];
  var f, k;
  for (var i = 0;i < 80;i++) {
    if (i < 40) {
      if (i < 20) {
        f = d ^ b & (c ^ d);
        k = 1518500249;
      } else {
        f = b ^ c ^ d;
        k = 1859775393;
      }
    } else {
      if (i < 60) {
        f = b & c | d & (b | c);
        k = 2400959708;
      } else {
        f = b ^ c ^ d;
        k = 3395469782;
      }
    }
    var t = (a << 5 | a >>> 27) + f + e + k + W[i] & 4294967295;
    e = d;
    d = c;
    c = (b << 30 | b >>> 2) & 4294967295;
    b = a;
    a = t;
  }
  this.chain_[0] = this.chain_[0] + a & 4294967295;
  this.chain_[1] = this.chain_[1] + b & 4294967295;
  this.chain_[2] = this.chain_[2] + c & 4294967295;
  this.chain_[3] = this.chain_[3] + d & 4294967295;
  this.chain_[4] = this.chain_[4] + e & 4294967295;
};
goog.crypt.Sha1.prototype.update = function(bytes, opt_length) {
  if (bytes == null) {
    return;
  }
  if (!goog.isDef(opt_length)) {
    opt_length = bytes.length;
  }
  var lengthMinusBlock = opt_length - this.blockSize;
  var n = 0;
  var buf = this.buf_;
  var inbuf = this.inbuf_;
  while (n < opt_length) {
    if (inbuf == 0) {
      while (n <= lengthMinusBlock) {
        this.compress_(bytes, n);
        n += this.blockSize;
      }
    }
    if (goog.isString(bytes)) {
      while (n < opt_length) {
        buf[inbuf] = bytes.charCodeAt(n);
        ++inbuf;
        ++n;
        if (inbuf == this.blockSize) {
          this.compress_(buf);
          inbuf = 0;
          break;
        }
      }
    } else {
      while (n < opt_length) {
        buf[inbuf] = bytes[n];
        ++inbuf;
        ++n;
        if (inbuf == this.blockSize) {
          this.compress_(buf);
          inbuf = 0;
          break;
        }
      }
    }
  }
  this.inbuf_ = inbuf;
  this.total_ += opt_length;
};
goog.crypt.Sha1.prototype.digest = function() {
  var digest = [];
  var totalBits = this.total_ * 8;
  if (this.inbuf_ < 56) {
    this.update(this.pad_, 56 - this.inbuf_);
  } else {
    this.update(this.pad_, this.blockSize - (this.inbuf_ - 56));
  }
  for (var i = this.blockSize - 1;i >= 56;i--) {
    this.buf_[i] = totalBits & 255;
    totalBits /= 256;
  }
  this.compress_(this.buf_);
  var n = 0;
  for (var i = 0;i < 5;i++) {
    for (var j = 24;j >= 0;j -= 8) {
      digest[n] = this.chain_[i] >> j & 255;
      ++n;
    }
  }
  return digest;
};
goog.provide("goog.asserts");
goog.provide("goog.asserts.AssertionError");
goog.require("goog.debug.Error");
goog.require("goog.dom.NodeType");
goog.require("goog.string");
goog.define("goog.asserts.ENABLE_ASSERTS", goog.DEBUG);
goog.asserts.AssertionError = function(messagePattern, messageArgs) {
  messageArgs.unshift(messagePattern);
  goog.debug.Error.call(this, goog.string.subs.apply(null, messageArgs));
  messageArgs.shift();
  this.messagePattern = messagePattern;
};
goog.inherits(goog.asserts.AssertionError, goog.debug.Error);
goog.asserts.AssertionError.prototype.name = "AssertionError";
goog.asserts.DEFAULT_ERROR_HANDLER = function(e) {
  throw e;
};
goog.asserts.errorHandler_ = goog.asserts.DEFAULT_ERROR_HANDLER;
goog.asserts.doAssertFailure_ = function(defaultMessage, defaultArgs, givenMessage, givenArgs) {
  var message = "Assertion failed";
  if (givenMessage) {
    message += ": " + givenMessage;
    var args = givenArgs;
  } else {
    if (defaultMessage) {
      message += ": " + defaultMessage;
      args = defaultArgs;
    }
  }
  var e = new goog.asserts.AssertionError("" + message, args || []);
  goog.asserts.errorHandler_(e);
};
goog.asserts.setErrorHandler = function(errorHandler) {
  if (goog.asserts.ENABLE_ASSERTS) {
    goog.asserts.errorHandler_ = errorHandler;
  }
};
goog.asserts.assert = function(condition, opt_message, var_args) {
  if (goog.asserts.ENABLE_ASSERTS && !condition) {
    goog.asserts.doAssertFailure_("", null, opt_message, Array.prototype.slice.call(arguments, 2));
  }
  return condition;
};
goog.asserts.fail = function(opt_message, var_args) {
  if (goog.asserts.ENABLE_ASSERTS) {
    goog.asserts.errorHandler_(new goog.asserts.AssertionError("Failure" + (opt_message ? ": " + opt_message : ""), Array.prototype.slice.call(arguments, 1)));
  }
};
goog.asserts.assertNumber = function(value, opt_message, var_args) {
  if (goog.asserts.ENABLE_ASSERTS && !goog.isNumber(value)) {
    goog.asserts.doAssertFailure_("Expected number but got %s: %s.", [goog.typeOf(value), value], opt_message, Array.prototype.slice.call(arguments, 2));
  }
  return(value);
};
goog.asserts.assertString = function(value, opt_message, var_args) {
  if (goog.asserts.ENABLE_ASSERTS && !goog.isString(value)) {
    goog.asserts.doAssertFailure_("Expected string but got %s: %s.", [goog.typeOf(value), value], opt_message, Array.prototype.slice.call(arguments, 2));
  }
  return(value);
};
goog.asserts.assertFunction = function(value, opt_message, var_args) {
  if (goog.asserts.ENABLE_ASSERTS && !goog.isFunction(value)) {
    goog.asserts.doAssertFailure_("Expected function but got %s: %s.", [goog.typeOf(value), value], opt_message, Array.prototype.slice.call(arguments, 2));
  }
  return(value);
};
goog.asserts.assertObject = function(value, opt_message, var_args) {
  if (goog.asserts.ENABLE_ASSERTS && !goog.isObject(value)) {
    goog.asserts.doAssertFailure_("Expected object but got %s: %s.", [goog.typeOf(value), value], opt_message, Array.prototype.slice.call(arguments, 2));
  }
  return(value);
};
goog.asserts.assertArray = function(value, opt_message, var_args) {
  if (goog.asserts.ENABLE_ASSERTS && !goog.isArray(value)) {
    goog.asserts.doAssertFailure_("Expected array but got %s: %s.", [goog.typeOf(value), value], opt_message, Array.prototype.slice.call(arguments, 2));
  }
  return(value);
};
goog.asserts.assertBoolean = function(value, opt_message, var_args) {
  if (goog.asserts.ENABLE_ASSERTS && !goog.isBoolean(value)) {
    goog.asserts.doAssertFailure_("Expected boolean but got %s: %s.", [goog.typeOf(value), value], opt_message, Array.prototype.slice.call(arguments, 2));
  }
  return(value);
};
goog.asserts.assertElement = function(value, opt_message, var_args) {
  if (goog.asserts.ENABLE_ASSERTS && (!goog.isObject(value) || value.nodeType != goog.dom.NodeType.ELEMENT)) {
    goog.asserts.doAssertFailure_("Expected Element but got %s: %s.", [goog.typeOf(value), value], opt_message, Array.prototype.slice.call(arguments, 2));
  }
  return(value);
};
goog.asserts.assertInstanceof = function(value, type, opt_message, var_args) {
  if (goog.asserts.ENABLE_ASSERTS && !(value instanceof type)) {
    goog.asserts.doAssertFailure_("Expected instanceof %s but got %s.", [goog.asserts.getType_(type), goog.asserts.getType_(value)], opt_message, Array.prototype.slice.call(arguments, 3));
  }
  return value;
};
goog.asserts.assertObjectPrototypeIsIntact = function() {
  for (var key in Object.prototype) {
    goog.asserts.fail(key + " should not be enumerable in Object.prototype.");
  }
};
goog.asserts.getType_ = function(value) {
  if (value instanceof Function) {
    return value.displayName || value.name || "unknown type name";
  } else {
    if (value instanceof Object) {
      return value.constructor.displayName || value.constructor.name || Object.prototype.toString.call(value);
    } else {
      return value === null ? "null" : typeof value;
    }
  }
};
goog.provide("goog.array");
goog.provide("goog.array.ArrayLike");
goog.require("goog.asserts");
goog.define("goog.NATIVE_ARRAY_PROTOTYPES", goog.TRUSTED_SITE);
goog.define("goog.array.ASSUME_NATIVE_FUNCTIONS", false);
goog.array.ArrayLike;
goog.array.peek = function(array) {
  return array[array.length - 1];
};
goog.array.last = goog.array.peek;
goog.array.ARRAY_PROTOTYPE_ = Array.prototype;
goog.array.indexOf = goog.NATIVE_ARRAY_PROTOTYPES && (goog.array.ASSUME_NATIVE_FUNCTIONS || goog.array.ARRAY_PROTOTYPE_.indexOf) ? function(arr, obj, opt_fromIndex) {
  goog.asserts.assert(arr.length != null);
  return goog.array.ARRAY_PROTOTYPE_.indexOf.call(arr, obj, opt_fromIndex);
} : function(arr, obj, opt_fromIndex) {
  var fromIndex = opt_fromIndex == null ? 0 : opt_fromIndex < 0 ? Math.max(0, arr.length + opt_fromIndex) : opt_fromIndex;
  if (goog.isString(arr)) {
    if (!goog.isString(obj) || obj.length != 1) {
      return-1;
    }
    return arr.indexOf(obj, fromIndex);
  }
  for (var i = fromIndex;i < arr.length;i++) {
    if (i in arr && arr[i] === obj) {
      return i;
    }
  }
  return-1;
};
goog.array.lastIndexOf = goog.NATIVE_ARRAY_PROTOTYPES && (goog.array.ASSUME_NATIVE_FUNCTIONS || goog.array.ARRAY_PROTOTYPE_.lastIndexOf) ? function(arr, obj, opt_fromIndex) {
  goog.asserts.assert(arr.length != null);
  var fromIndex = opt_fromIndex == null ? arr.length - 1 : opt_fromIndex;
  return goog.array.ARRAY_PROTOTYPE_.lastIndexOf.call(arr, obj, fromIndex);
} : function(arr, obj, opt_fromIndex) {
  var fromIndex = opt_fromIndex == null ? arr.length - 1 : opt_fromIndex;
  if (fromIndex < 0) {
    fromIndex = Math.max(0, arr.length + fromIndex);
  }
  if (goog.isString(arr)) {
    if (!goog.isString(obj) || obj.length != 1) {
      return-1;
    }
    return arr.lastIndexOf(obj, fromIndex);
  }
  for (var i = fromIndex;i >= 0;i--) {
    if (i in arr && arr[i] === obj) {
      return i;
    }
  }
  return-1;
};
goog.array.forEach = goog.NATIVE_ARRAY_PROTOTYPES && (goog.array.ASSUME_NATIVE_FUNCTIONS || goog.array.ARRAY_PROTOTYPE_.forEach) ? function(arr, f, opt_obj) {
  goog.asserts.assert(arr.length != null);
  goog.array.ARRAY_PROTOTYPE_.forEach.call(arr, f, opt_obj);
} : function(arr, f, opt_obj) {
  var l = arr.length;
  var arr2 = goog.isString(arr) ? arr.split("") : arr;
  for (var i = 0;i < l;i++) {
    if (i in arr2) {
      f.call(opt_obj, arr2[i], i, arr);
    }
  }
};
goog.array.forEachRight = function(arr, f, opt_obj) {
  var l = arr.length;
  var arr2 = goog.isString(arr) ? arr.split("") : arr;
  for (var i = l - 1;i >= 0;--i) {
    if (i in arr2) {
      f.call(opt_obj, arr2[i], i, arr);
    }
  }
};
goog.array.filter = goog.NATIVE_ARRAY_PROTOTYPES && (goog.array.ASSUME_NATIVE_FUNCTIONS || goog.array.ARRAY_PROTOTYPE_.filter) ? function(arr, f, opt_obj) {
  goog.asserts.assert(arr.length != null);
  return goog.array.ARRAY_PROTOTYPE_.filter.call(arr, f, opt_obj);
} : function(arr, f, opt_obj) {
  var l = arr.length;
  var res = [];
  var resLength = 0;
  var arr2 = goog.isString(arr) ? arr.split("") : arr;
  for (var i = 0;i < l;i++) {
    if (i in arr2) {
      var val = arr2[i];
      if (f.call(opt_obj, val, i, arr)) {
        res[resLength++] = val;
      }
    }
  }
  return res;
};
goog.array.map = goog.NATIVE_ARRAY_PROTOTYPES && (goog.array.ASSUME_NATIVE_FUNCTIONS || goog.array.ARRAY_PROTOTYPE_.map) ? function(arr, f, opt_obj) {
  goog.asserts.assert(arr.length != null);
  return goog.array.ARRAY_PROTOTYPE_.map.call(arr, f, opt_obj);
} : function(arr, f, opt_obj) {
  var l = arr.length;
  var res = new Array(l);
  var arr2 = goog.isString(arr) ? arr.split("") : arr;
  for (var i = 0;i < l;i++) {
    if (i in arr2) {
      res[i] = f.call(opt_obj, arr2[i], i, arr);
    }
  }
  return res;
};
goog.array.reduce = goog.NATIVE_ARRAY_PROTOTYPES && (goog.array.ASSUME_NATIVE_FUNCTIONS || goog.array.ARRAY_PROTOTYPE_.reduce) ? function(arr, f, val, opt_obj) {
  goog.asserts.assert(arr.length != null);
  var params = [];
  for (var i = 1, l = arguments.length;i < l;i++) {
    params.push(arguments[i]);
  }
  if (opt_obj) {
    params[0] = goog.bind(f, opt_obj);
  }
  return goog.array.ARRAY_PROTOTYPE_.reduce.apply(arr, params);
} : function(arr, f, val, opt_obj) {
  var rval = val;
  goog.array.forEach(arr, function(val, index) {
    rval = f.call(opt_obj, rval, val, index, arr);
  });
  return rval;
};
goog.array.reduceRight = goog.NATIVE_ARRAY_PROTOTYPES && (goog.array.ASSUME_NATIVE_FUNCTIONS || goog.array.ARRAY_PROTOTYPE_.reduceRight) ? function(arr, f, val, opt_obj) {
  goog.asserts.assert(arr.length != null);
  if (opt_obj) {
    f = goog.bind(f, opt_obj);
  }
  return goog.array.ARRAY_PROTOTYPE_.reduceRight.call(arr, f, val);
} : function(arr, f, val, opt_obj) {
  var rval = val;
  goog.array.forEachRight(arr, function(val, index) {
    rval = f.call(opt_obj, rval, val, index, arr);
  });
  return rval;
};
goog.array.some = goog.NATIVE_ARRAY_PROTOTYPES && (goog.array.ASSUME_NATIVE_FUNCTIONS || goog.array.ARRAY_PROTOTYPE_.some) ? function(arr, f, opt_obj) {
  goog.asserts.assert(arr.length != null);
  return goog.array.ARRAY_PROTOTYPE_.some.call(arr, f, opt_obj);
} : function(arr, f, opt_obj) {
  var l = arr.length;
  var arr2 = goog.isString(arr) ? arr.split("") : arr;
  for (var i = 0;i < l;i++) {
    if (i in arr2 && f.call(opt_obj, arr2[i], i, arr)) {
      return true;
    }
  }
  return false;
};
goog.array.every = goog.NATIVE_ARRAY_PROTOTYPES && (goog.array.ASSUME_NATIVE_FUNCTIONS || goog.array.ARRAY_PROTOTYPE_.every) ? function(arr, f, opt_obj) {
  goog.asserts.assert(arr.length != null);
  return goog.array.ARRAY_PROTOTYPE_.every.call(arr, f, opt_obj);
} : function(arr, f, opt_obj) {
  var l = arr.length;
  var arr2 = goog.isString(arr) ? arr.split("") : arr;
  for (var i = 0;i < l;i++) {
    if (i in arr2 && !f.call(opt_obj, arr2[i], i, arr)) {
      return false;
    }
  }
  return true;
};
goog.array.count = function(arr, f, opt_obj) {
  var count = 0;
  goog.array.forEach(arr, function(element, index, arr) {
    if (f.call(opt_obj, element, index, arr)) {
      ++count;
    }
  }, opt_obj);
  return count;
};
goog.array.find = function(arr, f, opt_obj) {
  var i = goog.array.findIndex(arr, f, opt_obj);
  return i < 0 ? null : goog.isString(arr) ? arr.charAt(i) : arr[i];
};
goog.array.findIndex = function(arr, f, opt_obj) {
  var l = arr.length;
  var arr2 = goog.isString(arr) ? arr.split("") : arr;
  for (var i = 0;i < l;i++) {
    if (i in arr2 && f.call(opt_obj, arr2[i], i, arr)) {
      return i;
    }
  }
  return-1;
};
goog.array.findRight = function(arr, f, opt_obj) {
  var i = goog.array.findIndexRight(arr, f, opt_obj);
  return i < 0 ? null : goog.isString(arr) ? arr.charAt(i) : arr[i];
};
goog.array.findIndexRight = function(arr, f, opt_obj) {
  var l = arr.length;
  var arr2 = goog.isString(arr) ? arr.split("") : arr;
  for (var i = l - 1;i >= 0;i--) {
    if (i in arr2 && f.call(opt_obj, arr2[i], i, arr)) {
      return i;
    }
  }
  return-1;
};
goog.array.contains = function(arr, obj) {
  return goog.array.indexOf(arr, obj) >= 0;
};
goog.array.isEmpty = function(arr) {
  return arr.length == 0;
};
goog.array.clear = function(arr) {
  if (!goog.isArray(arr)) {
    for (var i = arr.length - 1;i >= 0;i--) {
      delete arr[i];
    }
  }
  arr.length = 0;
};
goog.array.insert = function(arr, obj) {
  if (!goog.array.contains(arr, obj)) {
    arr.push(obj);
  }
};
goog.array.insertAt = function(arr, obj, opt_i) {
  goog.array.splice(arr, opt_i, 0, obj);
};
goog.array.insertArrayAt = function(arr, elementsToAdd, opt_i) {
  goog.partial(goog.array.splice, arr, opt_i, 0).apply(null, elementsToAdd);
};
goog.array.insertBefore = function(arr, obj, opt_obj2) {
  var i;
  if (arguments.length == 2 || (i = goog.array.indexOf(arr, opt_obj2)) < 0) {
    arr.push(obj);
  } else {
    goog.array.insertAt(arr, obj, i);
  }
};
goog.array.remove = function(arr, obj) {
  var i = goog.array.indexOf(arr, obj);
  var rv;
  if (rv = i >= 0) {
    goog.array.removeAt(arr, i);
  }
  return rv;
};
goog.array.removeAt = function(arr, i) {
  goog.asserts.assert(arr.length != null);
  return goog.array.ARRAY_PROTOTYPE_.splice.call(arr, i, 1).length == 1;
};
goog.array.removeIf = function(arr, f, opt_obj) {
  var i = goog.array.findIndex(arr, f, opt_obj);
  if (i >= 0) {
    goog.array.removeAt(arr, i);
    return true;
  }
  return false;
};
goog.array.removeAllIf = function(arr, f, opt_obj) {
  var removedCount = 0;
  goog.array.forEachRight(arr, function(val, index) {
    if (f.call(opt_obj, val, index, arr)) {
      if (goog.array.removeAt(arr, index)) {
        removedCount++;
      }
    }
  });
  return removedCount;
};
goog.array.concat = function(var_args) {
  return goog.array.ARRAY_PROTOTYPE_.concat.apply(goog.array.ARRAY_PROTOTYPE_, arguments);
};
goog.array.join = function(var_args) {
  return goog.array.ARRAY_PROTOTYPE_.concat.apply(goog.array.ARRAY_PROTOTYPE_, arguments);
};
goog.array.toArray = function(object) {
  var length = object.length;
  if (length > 0) {
    var rv = new Array(length);
    for (var i = 0;i < length;i++) {
      rv[i] = object[i];
    }
    return rv;
  }
  return[];
};
goog.array.clone = goog.array.toArray;
goog.array.extend = function(arr1, var_args) {
  for (var i = 1;i < arguments.length;i++) {
    var arr2 = arguments[i];
    if (goog.isArrayLike(arr2)) {
      var len1 = arr1.length || 0;
      var len2 = arr2.length || 0;
      arr1.length = len1 + len2;
      for (var j = 0;j < len2;j++) {
        arr1[len1 + j] = arr2[j];
      }
    } else {
      arr1.push(arr2);
    }
  }
};
goog.array.splice = function(arr, index, howMany, var_args) {
  goog.asserts.assert(arr.length != null);
  return goog.array.ARRAY_PROTOTYPE_.splice.apply(arr, goog.array.slice(arguments, 1));
};
goog.array.slice = function(arr, start, opt_end) {
  goog.asserts.assert(arr.length != null);
  if (arguments.length <= 2) {
    return goog.array.ARRAY_PROTOTYPE_.slice.call(arr, start);
  } else {
    return goog.array.ARRAY_PROTOTYPE_.slice.call(arr, start, opt_end);
  }
};
goog.array.removeDuplicates = function(arr, opt_rv, opt_hashFn) {
  var returnArray = opt_rv || arr;
  var defaultHashFn = function(item) {
    return goog.isObject(current) ? "o" + goog.getUid(current) : (typeof current).charAt(0) + current;
  };
  var hashFn = opt_hashFn || defaultHashFn;
  var seen = {}, cursorInsert = 0, cursorRead = 0;
  while (cursorRead < arr.length) {
    var current = arr[cursorRead++];
    var key = hashFn(current);
    if (!Object.prototype.hasOwnProperty.call(seen, key)) {
      seen[key] = true;
      returnArray[cursorInsert++] = current;
    }
  }
  returnArray.length = cursorInsert;
};
goog.array.binarySearch = function(arr, target, opt_compareFn) {
  return goog.array.binarySearch_(arr, opt_compareFn || goog.array.defaultCompare, false, target);
};
goog.array.binarySelect = function(arr, evaluator, opt_obj) {
  return goog.array.binarySearch_(arr, evaluator, true, undefined, opt_obj);
};
goog.array.binarySearch_ = function(arr, compareFn, isEvaluator, opt_target, opt_selfObj) {
  var left = 0;
  var right = arr.length;
  var found;
  while (left < right) {
    var middle = left + right >> 1;
    var compareResult;
    if (isEvaluator) {
      compareResult = compareFn.call(opt_selfObj, arr[middle], middle, arr);
    } else {
      compareResult = compareFn(opt_target, arr[middle]);
    }
    if (compareResult > 0) {
      left = middle + 1;
    } else {
      right = middle;
      found = !compareResult;
    }
  }
  return found ? left : ~left;
};
goog.array.sort = function(arr, opt_compareFn) {
  arr.sort(opt_compareFn || goog.array.defaultCompare);
};
goog.array.stableSort = function(arr, opt_compareFn) {
  for (var i = 0;i < arr.length;i++) {
    arr[i] = {index:i, value:arr[i]};
  }
  var valueCompareFn = opt_compareFn || goog.array.defaultCompare;
  function stableCompareFn(obj1, obj2) {
    return valueCompareFn(obj1.value, obj2.value) || obj1.index - obj2.index;
  }
  goog.array.sort(arr, stableCompareFn);
  for (var i = 0;i < arr.length;i++) {
    arr[i] = arr[i].value;
  }
};
goog.array.sortByKey = function(arr, keyFn, opt_compareFn) {
  var keyCompareFn = opt_compareFn || goog.array.defaultCompare;
  goog.array.sort(arr, function(a, b) {
    return keyCompareFn(keyFn(a), keyFn(b));
  });
};
goog.array.sortObjectsByKey = function(arr, key, opt_compareFn) {
  goog.array.sortByKey(arr, function(obj) {
    return obj[key];
  }, opt_compareFn);
};
goog.array.isSorted = function(arr, opt_compareFn, opt_strict) {
  var compare = opt_compareFn || goog.array.defaultCompare;
  for (var i = 1;i < arr.length;i++) {
    var compareResult = compare(arr[i - 1], arr[i]);
    if (compareResult > 0 || compareResult == 0 && opt_strict) {
      return false;
    }
  }
  return true;
};
goog.array.equals = function(arr1, arr2, opt_equalsFn) {
  if (!goog.isArrayLike(arr1) || !goog.isArrayLike(arr2) || arr1.length != arr2.length) {
    return false;
  }
  var l = arr1.length;
  var equalsFn = opt_equalsFn || goog.array.defaultCompareEquality;
  for (var i = 0;i < l;i++) {
    if (!equalsFn(arr1[i], arr2[i])) {
      return false;
    }
  }
  return true;
};
goog.array.compare3 = function(arr1, arr2, opt_compareFn) {
  var compare = opt_compareFn || goog.array.defaultCompare;
  var l = Math.min(arr1.length, arr2.length);
  for (var i = 0;i < l;i++) {
    var result = compare(arr1[i], arr2[i]);
    if (result != 0) {
      return result;
    }
  }
  return goog.array.defaultCompare(arr1.length, arr2.length);
};
goog.array.defaultCompare = function(a, b) {
  return a > b ? 1 : a < b ? -1 : 0;
};
goog.array.inverseDefaultCompare = function(a, b) {
  return-goog.array.defaultCompare(a, b);
};
goog.array.defaultCompareEquality = function(a, b) {
  return a === b;
};
goog.array.binaryInsert = function(array, value, opt_compareFn) {
  var index = goog.array.binarySearch(array, value, opt_compareFn);
  if (index < 0) {
    goog.array.insertAt(array, value, -(index + 1));
    return true;
  }
  return false;
};
goog.array.binaryRemove = function(array, value, opt_compareFn) {
  var index = goog.array.binarySearch(array, value, opt_compareFn);
  return index >= 0 ? goog.array.removeAt(array, index) : false;
};
goog.array.bucket = function(array, sorter, opt_obj) {
  var buckets = {};
  for (var i = 0;i < array.length;i++) {
    var value = array[i];
    var key = sorter.call(opt_obj, value, i, array);
    if (goog.isDef(key)) {
      var bucket = buckets[key] || (buckets[key] = []);
      bucket.push(value);
    }
  }
  return buckets;
};
goog.array.toObject = function(arr, keyFunc, opt_obj) {
  var ret = {};
  goog.array.forEach(arr, function(element, index) {
    ret[keyFunc.call(opt_obj, element, index, arr)] = element;
  });
  return ret;
};
goog.array.range = function(startOrEnd, opt_end, opt_step) {
  var array = [];
  var start = 0;
  var end = startOrEnd;
  var step = opt_step || 1;
  if (opt_end !== undefined) {
    start = startOrEnd;
    end = opt_end;
  }
  if (step * (end - start) < 0) {
    return[];
  }
  if (step > 0) {
    for (var i = start;i < end;i += step) {
      array.push(i);
    }
  } else {
    for (var i = start;i > end;i += step) {
      array.push(i);
    }
  }
  return array;
};
goog.array.repeat = function(value, n) {
  var array = [];
  for (var i = 0;i < n;i++) {
    array[i] = value;
  }
  return array;
};
goog.array.flatten = function(var_args) {
  var CHUNK_SIZE = 8192;
  var result = [];
  for (var i = 0;i < arguments.length;i++) {
    var element = arguments[i];
    if (goog.isArray(element)) {
      for (var c = 0;c < element.length;c += CHUNK_SIZE) {
        var chunk = goog.array.slice(element, c, c + CHUNK_SIZE);
        var recurseResult = goog.array.flatten.apply(null, chunk);
        for (var r = 0;r < recurseResult.length;r++) {
          result.push(recurseResult[r]);
        }
      }
    } else {
      result.push(element);
    }
  }
  return result;
};
goog.array.rotate = function(array, n) {
  goog.asserts.assert(array.length != null);
  if (array.length) {
    n %= array.length;
    if (n > 0) {
      goog.array.ARRAY_PROTOTYPE_.unshift.apply(array, array.splice(-n, n));
    } else {
      if (n < 0) {
        goog.array.ARRAY_PROTOTYPE_.push.apply(array, array.splice(0, -n));
      }
    }
  }
  return array;
};
goog.array.moveItem = function(arr, fromIndex, toIndex) {
  goog.asserts.assert(fromIndex >= 0 && fromIndex < arr.length);
  goog.asserts.assert(toIndex >= 0 && toIndex < arr.length);
  var removedItems = goog.array.ARRAY_PROTOTYPE_.splice.call(arr, fromIndex, 1);
  goog.array.ARRAY_PROTOTYPE_.splice.call(arr, toIndex, 0, removedItems[0]);
};
goog.array.zip = function(var_args) {
  if (!arguments.length) {
    return[];
  }
  var result = [];
  for (var i = 0;true;i++) {
    var value = [];
    for (var j = 0;j < arguments.length;j++) {
      var arr = arguments[j];
      if (i >= arr.length) {
        return result;
      }
      value.push(arr[i]);
    }
    result.push(value);
  }
};
goog.array.shuffle = function(arr, opt_randFn) {
  var randFn = opt_randFn || Math.random;
  for (var i = arr.length - 1;i > 0;i--) {
    var j = Math.floor(randFn() * (i + 1));
    var tmp = arr[i];
    arr[i] = arr[j];
    arr[j] = tmp;
  }
};
goog.array.copyByIndex = function(arr, index_arr) {
  var result = [];
  goog.array.forEach(index_arr, function(index) {
    result.push(arr[index]);
  });
  return result;
};
goog.provide("goog.labs.userAgent.browser");
goog.require("goog.array");
goog.require("goog.labs.userAgent.util");
goog.require("goog.object");
goog.require("goog.string");
goog.labs.userAgent.browser.matchOpera_ = function() {
  return goog.labs.userAgent.util.matchUserAgent("Opera") || goog.labs.userAgent.util.matchUserAgent("OPR");
};
goog.labs.userAgent.browser.matchIE_ = function() {
  return goog.labs.userAgent.util.matchUserAgent("Trident") || goog.labs.userAgent.util.matchUserAgent("MSIE");
};
goog.labs.userAgent.browser.matchFirefox_ = function() {
  return goog.labs.userAgent.util.matchUserAgent("Firefox");
};
goog.labs.userAgent.browser.matchSafari_ = function() {
  return goog.labs.userAgent.util.matchUserAgent("Safari") && !(goog.labs.userAgent.browser.matchChrome_() || goog.labs.userAgent.browser.matchCoast_() || goog.labs.userAgent.browser.matchOpera_() || goog.labs.userAgent.browser.isSilk() || goog.labs.userAgent.util.matchUserAgent("Android"));
};
goog.labs.userAgent.browser.matchCoast_ = function() {
  return goog.labs.userAgent.util.matchUserAgent("Coast");
};
goog.labs.userAgent.browser.matchIosWebview_ = function() {
  return(goog.labs.userAgent.util.matchUserAgent("iPad") || goog.labs.userAgent.util.matchUserAgent("iPhone")) && !goog.labs.userAgent.browser.matchSafari_() && !goog.labs.userAgent.browser.matchChrome_() && !goog.labs.userAgent.browser.matchCoast_() && goog.labs.userAgent.util.matchUserAgent("AppleWebKit");
};
goog.labs.userAgent.browser.matchChrome_ = function() {
  return(goog.labs.userAgent.util.matchUserAgent("Chrome") || goog.labs.userAgent.util.matchUserAgent("CriOS")) && !goog.labs.userAgent.browser.matchOpera_();
};
goog.labs.userAgent.browser.matchAndroidBrowser_ = function() {
  return goog.labs.userAgent.util.matchUserAgent("Android") && !(goog.labs.userAgent.browser.isChrome() || goog.labs.userAgent.browser.isFirefox() || goog.labs.userAgent.browser.isOpera() || goog.labs.userAgent.browser.isSilk());
};
goog.labs.userAgent.browser.isOpera = goog.labs.userAgent.browser.matchOpera_;
goog.labs.userAgent.browser.isIE = goog.labs.userAgent.browser.matchIE_;
goog.labs.userAgent.browser.isFirefox = goog.labs.userAgent.browser.matchFirefox_;
goog.labs.userAgent.browser.isSafari = goog.labs.userAgent.browser.matchSafari_;
goog.labs.userAgent.browser.isCoast = goog.labs.userAgent.browser.matchCoast_;
goog.labs.userAgent.browser.isIosWebview = goog.labs.userAgent.browser.matchIosWebview_;
goog.labs.userAgent.browser.isChrome = goog.labs.userAgent.browser.matchChrome_;
goog.labs.userAgent.browser.isAndroidBrowser = goog.labs.userAgent.browser.matchAndroidBrowser_;
goog.labs.userAgent.browser.isSilk = function() {
  return goog.labs.userAgent.util.matchUserAgent("Silk");
};
goog.labs.userAgent.browser.getVersion = function() {
  var userAgentString = goog.labs.userAgent.util.getUserAgent();
  if (goog.labs.userAgent.browser.isIE()) {
    return goog.labs.userAgent.browser.getIEVersion_(userAgentString);
  }
  var versionTuples = goog.labs.userAgent.util.extractVersionTuples(userAgentString);
  var versionMap = {};
  goog.array.forEach(versionTuples, function(tuple) {
    var key = tuple[0];
    var value = tuple[1];
    versionMap[key] = value;
  });
  var versionMapHasKey = goog.partial(goog.object.containsKey, versionMap);
  function lookUpValueWithKeys(keys) {
    var key = goog.array.find(keys, versionMapHasKey);
    return versionMap[key] || "";
  }
  if (goog.labs.userAgent.browser.isOpera()) {
    return lookUpValueWithKeys(["Version", "Opera", "OPR"]);
  }
  if (goog.labs.userAgent.browser.isChrome()) {
    return lookUpValueWithKeys(["Chrome", "CriOS"]);
  }
  var tuple = versionTuples[2];
  return tuple && tuple[1] || "";
};
goog.labs.userAgent.browser.isVersionOrHigher = function(version) {
  return goog.string.compareVersions(goog.labs.userAgent.browser.getVersion(), version) >= 0;
};
goog.labs.userAgent.browser.getIEVersion_ = function(userAgent) {
  var rv = /rv: *([\d\.]*)/.exec(userAgent);
  if (rv && rv[1]) {
    return rv[1];
  }
  var version = "";
  var msie = /MSIE +([\d\.]+)/.exec(userAgent);
  if (msie && msie[1]) {
    var tridentVersion = /Trident\/(\d.\d)/.exec(userAgent);
    if (msie[1] == "7.0") {
      if (tridentVersion && tridentVersion[1]) {
        switch(tridentVersion[1]) {
          case "4.0":
            version = "8.0";
            break;
          case "5.0":
            version = "9.0";
            break;
          case "6.0":
            version = "10.0";
            break;
          case "7.0":
            version = "11.0";
            break;
        }
      } else {
        version = "7.0";
      }
    } else {
      version = msie[1];
    }
  }
  return version;
};
goog.provide("goog.labs.userAgent.engine");
goog.require("goog.array");
goog.require("goog.labs.userAgent.util");
goog.require("goog.string");
goog.labs.userAgent.engine.isPresto = function() {
  return goog.labs.userAgent.util.matchUserAgent("Presto");
};
goog.labs.userAgent.engine.isTrident = function() {
  return goog.labs.userAgent.util.matchUserAgent("Trident") || goog.labs.userAgent.util.matchUserAgent("MSIE");
};
goog.labs.userAgent.engine.isWebKit = function() {
  return goog.labs.userAgent.util.matchUserAgentIgnoreCase("WebKit");
};
goog.labs.userAgent.engine.isGecko = function() {
  return goog.labs.userAgent.util.matchUserAgent("Gecko") && !goog.labs.userAgent.engine.isWebKit() && !goog.labs.userAgent.engine.isTrident();
};
goog.labs.userAgent.engine.getVersion = function() {
  var userAgentString = goog.labs.userAgent.util.getUserAgent();
  if (userAgentString) {
    var tuples = goog.labs.userAgent.util.extractVersionTuples(userAgentString);
    var engineTuple = tuples[1];
    if (engineTuple) {
      if (engineTuple[0] == "Gecko") {
        return goog.labs.userAgent.engine.getVersionForKey_(tuples, "Firefox");
      }
      return engineTuple[1];
    }
    var browserTuple = tuples[0];
    var info;
    if (browserTuple && (info = browserTuple[2])) {
      var match = /Trident\/([^\s;]+)/.exec(info);
      if (match) {
        return match[1];
      }
    }
  }
  return "";
};
goog.labs.userAgent.engine.isVersionOrHigher = function(version) {
  return goog.string.compareVersions(goog.labs.userAgent.engine.getVersion(), version) >= 0;
};
goog.labs.userAgent.engine.getVersionForKey_ = function(tuples, key) {
  var pair = goog.array.find(tuples, function(pair) {
    return key == pair[0];
  });
  return pair && pair[1] || "";
};
goog.provide("goog.crypt");
goog.require("goog.array");
goog.require("goog.asserts");
goog.crypt.stringToByteArray = function(str) {
  var output = [], p = 0;
  for (var i = 0;i < str.length;i++) {
    var c = str.charCodeAt(i);
    while (c > 255) {
      output[p++] = c & 255;
      c >>= 8;
    }
    output[p++] = c;
  }
  return output;
};
goog.crypt.byteArrayToString = function(bytes) {
  var CHUNK_SIZE = 8192;
  if (bytes.length < CHUNK_SIZE) {
    return String.fromCharCode.apply(null, bytes);
  }
  var str = "";
  for (var i = 0;i < bytes.length;i += CHUNK_SIZE) {
    var chunk = goog.array.slice(bytes, i, i + CHUNK_SIZE);
    str += String.fromCharCode.apply(null, chunk);
  }
  return str;
};
goog.crypt.byteArrayToHex = function(array) {
  return goog.array.map(array, function(numByte) {
    var hexByte = numByte.toString(16);
    return hexByte.length > 1 ? hexByte : "0" + hexByte;
  }).join("");
};
goog.crypt.hexToByteArray = function(hexString) {
  goog.asserts.assert(hexString.length % 2 == 0, "Key string length must be multiple of 2");
  var arr = [];
  for (var i = 0;i < hexString.length;i += 2) {
    arr.push(parseInt(hexString.substring(i, i + 2), 16));
  }
  return arr;
};
goog.crypt.stringToUtf8ByteArray = function(str) {
  str = str.replace(/\r\n/g, "\n");
  var out = [], p = 0;
  for (var i = 0;i < str.length;i++) {
    var c = str.charCodeAt(i);
    if (c < 128) {
      out[p++] = c;
    } else {
      if (c < 2048) {
        out[p++] = c >> 6 | 192;
        out[p++] = c & 63 | 128;
      } else {
        out[p++] = c >> 12 | 224;
        out[p++] = c >> 6 & 63 | 128;
        out[p++] = c & 63 | 128;
      }
    }
  }
  return out;
};
goog.crypt.utf8ByteArrayToString = function(bytes) {
  var out = [], pos = 0, c = 0;
  while (pos < bytes.length) {
    var c1 = bytes[pos++];
    if (c1 < 128) {
      out[c++] = String.fromCharCode(c1);
    } else {
      if (c1 > 191 && c1 < 224) {
        var c2 = bytes[pos++];
        out[c++] = String.fromCharCode((c1 & 31) << 6 | c2 & 63);
      } else {
        var c2 = bytes[pos++];
        var c3 = bytes[pos++];
        out[c++] = String.fromCharCode((c1 & 15) << 12 | (c2 & 63) << 6 | c3 & 63);
      }
    }
  }
  return out.join("");
};
goog.crypt.xorByteArray = function(bytes1, bytes2) {
  goog.asserts.assert(bytes1.length == bytes2.length, "XOR array lengths must match");
  var result = [];
  for (var i = 0;i < bytes1.length;i++) {
    result.push(bytes1[i] ^ bytes2[i]);
  }
  return result;
};
goog.provide("goog.userAgent");
goog.require("goog.labs.userAgent.browser");
goog.require("goog.labs.userAgent.engine");
goog.require("goog.labs.userAgent.platform");
goog.require("goog.labs.userAgent.util");
goog.require("goog.string");
goog.define("goog.userAgent.ASSUME_IE", false);
goog.define("goog.userAgent.ASSUME_GECKO", false);
goog.define("goog.userAgent.ASSUME_WEBKIT", false);
goog.define("goog.userAgent.ASSUME_MOBILE_WEBKIT", false);
goog.define("goog.userAgent.ASSUME_OPERA", false);
goog.define("goog.userAgent.ASSUME_ANY_VERSION", false);
goog.userAgent.BROWSER_KNOWN_ = goog.userAgent.ASSUME_IE || goog.userAgent.ASSUME_GECKO || goog.userAgent.ASSUME_MOBILE_WEBKIT || goog.userAgent.ASSUME_WEBKIT || goog.userAgent.ASSUME_OPERA;
goog.userAgent.getUserAgentString = function() {
  return goog.labs.userAgent.util.getUserAgent();
};
goog.userAgent.getNavigator = function() {
  return goog.global["navigator"] || null;
};
goog.userAgent.OPERA = goog.userAgent.BROWSER_KNOWN_ ? goog.userAgent.ASSUME_OPERA : goog.labs.userAgent.browser.isOpera();
goog.userAgent.IE = goog.userAgent.BROWSER_KNOWN_ ? goog.userAgent.ASSUME_IE : goog.labs.userAgent.browser.isIE();
goog.userAgent.GECKO = goog.userAgent.BROWSER_KNOWN_ ? goog.userAgent.ASSUME_GECKO : goog.labs.userAgent.engine.isGecko();
goog.userAgent.WEBKIT = goog.userAgent.BROWSER_KNOWN_ ? goog.userAgent.ASSUME_WEBKIT || goog.userAgent.ASSUME_MOBILE_WEBKIT : goog.labs.userAgent.engine.isWebKit();
goog.userAgent.isMobile_ = function() {
  return goog.userAgent.WEBKIT && goog.labs.userAgent.util.matchUserAgent("Mobile");
};
goog.userAgent.MOBILE = goog.userAgent.ASSUME_MOBILE_WEBKIT || goog.userAgent.isMobile_();
goog.userAgent.SAFARI = goog.userAgent.WEBKIT;
goog.userAgent.determinePlatform_ = function() {
  var navigator = goog.userAgent.getNavigator();
  return navigator && navigator.platform || "";
};
goog.userAgent.PLATFORM = goog.userAgent.determinePlatform_();
goog.define("goog.userAgent.ASSUME_MAC", false);
goog.define("goog.userAgent.ASSUME_WINDOWS", false);
goog.define("goog.userAgent.ASSUME_LINUX", false);
goog.define("goog.userAgent.ASSUME_X11", false);
goog.define("goog.userAgent.ASSUME_ANDROID", false);
goog.define("goog.userAgent.ASSUME_IPHONE", false);
goog.define("goog.userAgent.ASSUME_IPAD", false);
goog.userAgent.PLATFORM_KNOWN_ = goog.userAgent.ASSUME_MAC || goog.userAgent.ASSUME_WINDOWS || goog.userAgent.ASSUME_LINUX || goog.userAgent.ASSUME_X11 || goog.userAgent.ASSUME_ANDROID || goog.userAgent.ASSUME_IPHONE || goog.userAgent.ASSUME_IPAD;
goog.userAgent.MAC = goog.userAgent.PLATFORM_KNOWN_ ? goog.userAgent.ASSUME_MAC : goog.labs.userAgent.platform.isMacintosh();
goog.userAgent.WINDOWS = goog.userAgent.PLATFORM_KNOWN_ ? goog.userAgent.ASSUME_WINDOWS : goog.labs.userAgent.platform.isWindows();
goog.userAgent.isLegacyLinux_ = function() {
  return goog.labs.userAgent.platform.isLinux() || goog.labs.userAgent.platform.isChromeOS();
};
goog.userAgent.LINUX = goog.userAgent.PLATFORM_KNOWN_ ? goog.userAgent.ASSUME_LINUX : goog.userAgent.isLegacyLinux_();
goog.userAgent.isX11_ = function() {
  var navigator = goog.userAgent.getNavigator();
  return!!navigator && goog.string.contains(navigator["appVersion"] || "", "X11");
};
goog.userAgent.X11 = goog.userAgent.PLATFORM_KNOWN_ ? goog.userAgent.ASSUME_X11 : goog.userAgent.isX11_();
goog.userAgent.ANDROID = goog.userAgent.PLATFORM_KNOWN_ ? goog.userAgent.ASSUME_ANDROID : goog.labs.userAgent.platform.isAndroid();
goog.userAgent.IPHONE = goog.userAgent.PLATFORM_KNOWN_ ? goog.userAgent.ASSUME_IPHONE : goog.labs.userAgent.platform.isIphone();
goog.userAgent.IPAD = goog.userAgent.PLATFORM_KNOWN_ ? goog.userAgent.ASSUME_IPAD : goog.labs.userAgent.platform.isIpad();
goog.userAgent.determineVersion_ = function() {
  var version = "", re;
  if (goog.userAgent.OPERA && goog.global["opera"]) {
    var operaVersion = goog.global["opera"].version;
    return goog.isFunction(operaVersion) ? operaVersion() : operaVersion;
  }
  if (goog.userAgent.GECKO) {
    re = /rv\:([^\);]+)(\)|;)/;
  } else {
    if (goog.userAgent.IE) {
      re = /\b(?:MSIE|rv)[: ]([^\);]+)(\)|;)/;
    } else {
      if (goog.userAgent.WEBKIT) {
        re = /WebKit\/(\S+)/;
      }
    }
  }
  if (re) {
    var arr = re.exec(goog.userAgent.getUserAgentString());
    version = arr ? arr[1] : "";
  }
  if (goog.userAgent.IE) {
    var docMode = goog.userAgent.getDocumentMode_();
    if (docMode > parseFloat(version)) {
      return String(docMode);
    }
  }
  return version;
};
goog.userAgent.getDocumentMode_ = function() {
  var doc = goog.global["document"];
  return doc ? doc["documentMode"] : undefined;
};
goog.userAgent.VERSION = goog.userAgent.determineVersion_();
goog.userAgent.compare = function(v1, v2) {
  return goog.string.compareVersions(v1, v2);
};
goog.userAgent.isVersionOrHigherCache_ = {};
goog.userAgent.isVersionOrHigher = function(version) {
  return goog.userAgent.ASSUME_ANY_VERSION || goog.userAgent.isVersionOrHigherCache_[version] || (goog.userAgent.isVersionOrHigherCache_[version] = goog.string.compareVersions(goog.userAgent.VERSION, version) >= 0);
};
goog.userAgent.isVersion = goog.userAgent.isVersionOrHigher;
goog.userAgent.isDocumentModeOrHigher = function(documentMode) {
  return goog.userAgent.IE && goog.userAgent.DOCUMENT_MODE >= documentMode;
};
goog.userAgent.isDocumentMode = goog.userAgent.isDocumentModeOrHigher;
goog.userAgent.DOCUMENT_MODE = function() {
  var doc = goog.global["document"];
  if (!doc || !goog.userAgent.IE) {
    return undefined;
  }
  var mode = goog.userAgent.getDocumentMode_();
  return mode || (doc["compatMode"] == "CSS1Compat" ? parseInt(goog.userAgent.VERSION, 10) : 5);
}();
goog.provide("goog.crypt.base64");
goog.require("goog.crypt");
goog.require("goog.userAgent");
goog.crypt.base64.byteToCharMap_ = null;
goog.crypt.base64.charToByteMap_ = null;
goog.crypt.base64.byteToCharMapWebSafe_ = null;
goog.crypt.base64.charToByteMapWebSafe_ = null;
goog.crypt.base64.ENCODED_VALS_BASE = "ABCDEFGHIJKLMNOPQRSTUVWXYZ" + "abcdefghijklmnopqrstuvwxyz" + "0123456789";
goog.crypt.base64.ENCODED_VALS = goog.crypt.base64.ENCODED_VALS_BASE + "+/=";
goog.crypt.base64.ENCODED_VALS_WEBSAFE = goog.crypt.base64.ENCODED_VALS_BASE + "-_.";
goog.crypt.base64.HAS_NATIVE_SUPPORT = goog.userAgent.GECKO || goog.userAgent.WEBKIT || goog.userAgent.OPERA || typeof goog.global.atob == "function";
goog.crypt.base64.encodeByteArray = function(input, opt_webSafe) {
  if (!goog.isArrayLike(input)) {
    throw Error("encodeByteArray takes an array as a parameter");
  }
  goog.crypt.base64.init_();
  var byteToCharMap = opt_webSafe ? goog.crypt.base64.byteToCharMapWebSafe_ : goog.crypt.base64.byteToCharMap_;
  var output = [];
  for (var i = 0;i < input.length;i += 3) {
    var byte1 = input[i];
    var haveByte2 = i + 1 < input.length;
    var byte2 = haveByte2 ? input[i + 1] : 0;
    var haveByte3 = i + 2 < input.length;
    var byte3 = haveByte3 ? input[i + 2] : 0;
    var outByte1 = byte1 >> 2;
    var outByte2 = (byte1 & 3) << 4 | byte2 >> 4;
    var outByte3 = (byte2 & 15) << 2 | byte3 >> 6;
    var outByte4 = byte3 & 63;
    if (!haveByte3) {
      outByte4 = 64;
      if (!haveByte2) {
        outByte3 = 64;
      }
    }
    output.push(byteToCharMap[outByte1], byteToCharMap[outByte2], byteToCharMap[outByte3], byteToCharMap[outByte4]);
  }
  return output.join("");
};
goog.crypt.base64.encodeString = function(input, opt_webSafe) {
  if (goog.crypt.base64.HAS_NATIVE_SUPPORT && !opt_webSafe) {
    return goog.global.btoa(input);
  }
  return goog.crypt.base64.encodeByteArray(goog.crypt.stringToByteArray(input), opt_webSafe);
};
goog.crypt.base64.decodeString = function(input, opt_webSafe) {
  if (goog.crypt.base64.HAS_NATIVE_SUPPORT && !opt_webSafe) {
    return goog.global.atob(input);
  }
  return goog.crypt.byteArrayToString(goog.crypt.base64.decodeStringToByteArray(input, opt_webSafe));
};
goog.crypt.base64.decodeStringToByteArray = function(input, opt_webSafe) {
  goog.crypt.base64.init_();
  var charToByteMap = opt_webSafe ? goog.crypt.base64.charToByteMapWebSafe_ : goog.crypt.base64.charToByteMap_;
  var output = [];
  for (var i = 0;i < input.length;) {
    var byte1 = charToByteMap[input.charAt(i++)];
    var haveByte2 = i < input.length;
    var byte2 = haveByte2 ? charToByteMap[input.charAt(i)] : 0;
    ++i;
    var haveByte3 = i < input.length;
    var byte3 = haveByte3 ? charToByteMap[input.charAt(i)] : 64;
    ++i;
    var haveByte4 = i < input.length;
    var byte4 = haveByte4 ? charToByteMap[input.charAt(i)] : 64;
    ++i;
    if (byte1 == null || byte2 == null || byte3 == null || byte4 == null) {
      throw Error();
    }
    var outByte1 = byte1 << 2 | byte2 >> 4;
    output.push(outByte1);
    if (byte3 != 64) {
      var outByte2 = byte2 << 4 & 240 | byte3 >> 2;
      output.push(outByte2);
      if (byte4 != 64) {
        var outByte3 = byte3 << 6 & 192 | byte4;
        output.push(outByte3);
      }
    }
  }
  return output;
};
goog.crypt.base64.init_ = function() {
  if (!goog.crypt.base64.byteToCharMap_) {
    goog.crypt.base64.byteToCharMap_ = {};
    goog.crypt.base64.charToByteMap_ = {};
    goog.crypt.base64.byteToCharMapWebSafe_ = {};
    goog.crypt.base64.charToByteMapWebSafe_ = {};
    for (var i = 0;i < goog.crypt.base64.ENCODED_VALS.length;i++) {
      goog.crypt.base64.byteToCharMap_[i] = goog.crypt.base64.ENCODED_VALS.charAt(i);
      goog.crypt.base64.charToByteMap_[goog.crypt.base64.byteToCharMap_[i]] = i;
      goog.crypt.base64.byteToCharMapWebSafe_[i] = goog.crypt.base64.ENCODED_VALS_WEBSAFE.charAt(i);
      goog.crypt.base64.charToByteMapWebSafe_[goog.crypt.base64.byteToCharMapWebSafe_[i]] = i;
      if (i >= goog.crypt.base64.ENCODED_VALS_BASE.length) {
        goog.crypt.base64.charToByteMap_[goog.crypt.base64.ENCODED_VALS_WEBSAFE.charAt(i)] = i;
        goog.crypt.base64.charToByteMapWebSafe_[goog.crypt.base64.ENCODED_VALS.charAt(i)] = i;
      }
    }
  }
};
goog.provide("fb.constants");
var NODE_CLIENT = false;
var CLIENT_VERSION = "0.0.0";
goog.provide("fb.util.obj");
fb.util.obj.contains = function(obj, key) {
  return Object.prototype.hasOwnProperty.call(obj, key);
};
fb.util.obj.get = function(obj, key) {
  if (Object.prototype.hasOwnProperty.call(obj, key)) {
    return obj[key];
  }
};
fb.util.obj.foreach = function(obj, fn) {
  for (var key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      fn(key, obj[key]);
    }
  }
};
fb.util.obj.clone = function(obj) {
  var clone = {};
  fb.util.obj.foreach(obj, function(key, value) {
    clone[key] = value;
  });
  return clone;
};
goog.provide("fb.util");
goog.require("fb.util.obj");
fb.util.querystring = function(querystringParams) {
  var params = [];
  fb.util.obj.foreach(querystringParams, function(key, value) {
    if (goog.isArray(value)) {
      goog.array.forEach(value, function(arrayVal) {
        params.push(encodeURIComponent(key) + "=" + encodeURIComponent(arrayVal));
      });
    } else {
      params.push(encodeURIComponent(key) + "=" + encodeURIComponent(value));
    }
  });
  return params.length ? "&" + params.join("&") : "";
};
fb.util.querystringDecode = function(querystring) {
  var obj = {};
  var tokens = querystring.replace(/^\?/, "").split("&");
  goog.array.forEach(tokens, function(token) {
    if (token) {
      var key = token.split("=");
      obj[key[0]] = key[1];
    }
  });
  return obj;
};
goog.provide("fb.util.validation");
fb.util.validation.validateArgCount = function(fnName, minCount, maxCount, argCount) {
  var argError;
  if (argCount < minCount) {
    argError = "at least " + minCount;
  } else {
    if (argCount > maxCount) {
      argError = maxCount === 0 ? "none" : "no more than " + maxCount;
    }
  }
  if (argError) {
    var error = fnName + " failed: Was called with " + argCount + (argCount === 1 ? " argument." : " arguments.") + " Expects " + argError + ".";
    throw new Error(error);
  }
};
fb.util.validation.errorPrefix = function(fnName, argumentNumber, optional) {
  var argName = "";
  switch(argumentNumber) {
    case 1:
      argName = optional ? "first" : "First";
      break;
    case 2:
      argName = optional ? "second" : "Second";
      break;
    case 3:
      argName = optional ? "third" : "Third";
      break;
    case 4:
      argName = optional ? "fourth" : "Fourth";
      break;
    default:
      throw new Error("errorPrefix called with argumentNumber > 4.  Need to update it?");;
  }
  var error = fnName + " failed: ";
  error += argName + " argument ";
  return error;
};
fb.util.validation.validateNamespace = function(fnName, argumentNumber, namespace, optional) {
  if (optional && !goog.isDef(namespace)) {
    return;
  }
  if (!goog.isString(namespace)) {
    throw new Error(fb.util.validation.errorPrefix(fnName, argumentNumber, optional) + "must be a valid firebase namespace.");
  }
};
fb.util.validation.validateCallback = function(fnName, argumentNumber, callback, optional) {
  if (optional && !goog.isDef(callback)) {
    return;
  }
  if (!goog.isFunction(callback)) {
    throw new Error(fb.util.validation.errorPrefix(fnName, argumentNumber, optional) + "must be a valid function.");
  }
};
fb.util.validation.validateContextObject = function(fnName, argumentNumber, context, optional) {
  if (optional && !goog.isDef(context)) {
    return;
  }
  if (!goog.isObject(context) || context === null) {
    throw new Error(fb.util.validation.errorPrefix(fnName, argumentNumber, optional) + "must be a valid context object.");
  }
};
goog.provide("fb.util.json");
goog.require("goog.json");
fb.util.json.eval = function(str) {
  if (typeof JSON !== "undefined" && goog.isDef(JSON.parse)) {
    return JSON.parse(str);
  } else {
    return goog.json.parse(str);
  }
};
fb.util.json.stringify = function(data) {
  if (typeof JSON !== "undefined" && goog.isDef(JSON.stringify)) {
    return JSON.stringify(data);
  } else {
    return goog.json.serialize(data);
  }
};
goog.provide("fb.core.SnapshotHolder");
fb.core.SnapshotHolder = function() {
  this.rootNode_ = fb.core.snap.EMPTY_NODE;
};
fb.core.SnapshotHolder.prototype.getNode = function(path) {
  return this.rootNode_.getChild(path);
};
fb.core.SnapshotHolder.prototype.updateSnapshot = function(path, newSnapshotNode) {
  this.rootNode_ = this.rootNode_.updateChild(path, newSnapshotNode);
};
if (goog.DEBUG) {
  fb.core.SnapshotHolder.prototype.toString = function() {
    return this.rootNode_.toString();
  };
}
;goog.provide("fb.core.view.CompleteChildSource");
fb.core.view.CompleteChildSource = function() {
};
fb.core.view.CompleteChildSource.prototype.getCompleteChild = function(childKey) {
};
fb.core.view.CompleteChildSource.prototype.getChildAfterChild = function(index, child, reverse) {
};
fb.core.view.NoCompleteChildSource_ = function() {
};
fb.core.view.NoCompleteChildSource_.prototype.getCompleteChild = function() {
  return null;
};
fb.core.view.NoCompleteChildSource_.prototype.getChildAfterChild = function() {
  return null;
};
fb.core.view.NO_COMPLETE_CHILD_SOURCE = new fb.core.view.NoCompleteChildSource_;
fb.core.view.WriteTreeCompleteChildSource = function(writes, viewCache, optCompleteServerCache) {
  this.writes_ = writes;
  this.viewCache_ = viewCache;
  this.optCompleteServerCache_ = optCompleteServerCache;
};
fb.core.view.WriteTreeCompleteChildSource.prototype.getCompleteChild = function(childKey) {
  var node = this.viewCache_.getEventCache();
  if (node.isCompleteForChild(childKey)) {
    return node.getNode().getImmediateChild(childKey);
  } else {
    var serverNode = this.optCompleteServerCache_ != null ? new fb.core.view.CacheNode(this.optCompleteServerCache_, true, false) : this.viewCache_.getServerCache();
    return this.writes_.calcCompleteChild(childKey, serverNode);
  }
};
fb.core.view.WriteTreeCompleteChildSource.prototype.getChildAfterChild = function(index, child, reverse) {
  var completeServerData = this.optCompleteServerCache_ != null ? this.optCompleteServerCache_ : this.viewCache_.getCompleteServerSnap();
  var nodes = this.writes_.calcIndexedSlice(completeServerData, child, 1, reverse, index);
  if (nodes.length === 0) {
    return null;
  } else {
    return nodes[0];
  }
};
goog.provide("fb.core.view.EventQueue");
fb.core.view.EventQueue = function() {
  this.eventLists_ = [];
  this.recursionDepth_ = 0;
};
fb.core.view.EventQueue.prototype.queueEvents = function(eventDataList) {
  var currList = null;
  for (var i = 0;i < eventDataList.length;i++) {
    var eventData = eventDataList[i];
    var eventPath = eventData.getPath();
    if (currList !== null && !eventPath.equals(currList.getPath())) {
      this.eventLists_.push(currList);
      currList = null;
    }
    if (currList === null) {
      currList = new fb.core.view.EventList(eventPath);
    }
    currList.add(eventData);
  }
  if (currList) {
    this.eventLists_.push(currList);
  }
};
fb.core.view.EventQueue.prototype.raiseEventsAtPath = function(path, eventDataList) {
  this.queueEvents(eventDataList);
  this.raiseQueuedEventsMatchingPredicate_(function(eventPath) {
    return eventPath.equals(path);
  });
};
fb.core.view.EventQueue.prototype.raiseEventsForChangedPath = function(changedPath, eventDataList) {
  this.queueEvents(eventDataList);
  this.raiseQueuedEventsMatchingPredicate_(function(eventPath) {
    return eventPath.contains(changedPath) || changedPath.contains(eventPath);
  });
};
fb.core.view.EventQueue.prototype.raiseQueuedEventsMatchingPredicate_ = function(predicate) {
  this.recursionDepth_++;
  var sentAll = true;
  for (var i = 0;i < this.eventLists_.length;i++) {
    var eventList = this.eventLists_[i];
    if (eventList) {
      var eventPath = eventList.getPath();
      if (predicate(eventPath)) {
        this.eventLists_[i].raise();
        this.eventLists_[i] = null;
      } else {
        sentAll = false;
      }
    }
  }
  if (sentAll) {
    this.eventLists_ = [];
  }
  this.recursionDepth_--;
};
fb.core.view.EventList = function(path) {
  this.path_ = path;
  this.events_ = [];
};
fb.core.view.EventList.prototype.add = function(eventData) {
  this.events_.push(eventData);
};
fb.core.view.EventList.prototype.raise = function() {
  for (var i = 0;i < this.events_.length;i++) {
    var eventData = this.events_[i];
    if (eventData !== null) {
      this.events_[i] = null;
      var eventFn = eventData.getEventRunner();
      if (fb.core.util.logger) {
        fb.core.util.log("event: " + eventData.toString());
      }
      fb.core.util.exceptionGuard(eventFn);
    }
  }
};
fb.core.view.EventList.prototype.getPath = function() {
  return this.path_;
};
goog.provide("fb.core.view.Change");
fb.core.view.Change = function(type, snapshotNode, childName, oldSnap, prevName) {
  this.type = type;
  this.snapshotNode = snapshotNode;
  this.childName = childName;
  this.oldSnap = oldSnap;
  this.prevName = prevName;
};
fb.core.view.Change.valueChange = function(snapshot) {
  return new fb.core.view.Change(fb.core.view.Change.VALUE, snapshot);
};
fb.core.view.Change.childAddedChange = function(childKey, snapshot) {
  return new fb.core.view.Change(fb.core.view.Change.CHILD_ADDED, snapshot, childKey);
};
fb.core.view.Change.childRemovedChange = function(childKey, snapshot) {
  return new fb.core.view.Change(fb.core.view.Change.CHILD_REMOVED, snapshot, childKey);
};
fb.core.view.Change.childChangedChange = function(childKey, newSnapshot, oldSnapshot) {
  return new fb.core.view.Change(fb.core.view.Change.CHILD_CHANGED, newSnapshot, childKey, oldSnapshot);
};
fb.core.view.Change.childMovedChange = function(childKey, snapshot) {
  return new fb.core.view.Change(fb.core.view.Change.CHILD_MOVED, snapshot, childKey);
};
fb.core.view.Change.prototype.changeWithPrevName = function(prevName) {
  return new fb.core.view.Change(this.type, this.snapshotNode, this.childName, this.oldSnap, prevName);
};
fb.core.view.Change.CHILD_ADDED = "child_added";
fb.core.view.Change.CHILD_REMOVED = "child_removed";
fb.core.view.Change.CHILD_CHANGED = "child_changed";
fb.core.view.Change.CHILD_MOVED = "child_moved";
fb.core.view.Change.VALUE = "value";
goog.provide("fb.core.view.Event");
fb.core.view.Event = function() {
};
fb.core.view.Event.prototype.getPath;
fb.core.view.Event.prototype.getEventType;
fb.core.view.Event.prototype.getEventRunner;
fb.core.view.Event.prototype.toString;
fb.core.view.DataEvent = function(eventType, eventRegistration, snapshot, prevName) {
  this.eventRegistration = eventRegistration;
  this.snapshot = snapshot;
  this.prevName = prevName;
  this.eventType = eventType;
};
fb.core.view.DataEvent.prototype.getPath = function() {
  var ref = this.snapshot.ref();
  if (this.eventType === "value") {
    return ref.path;
  } else {
    return ref.parent().path;
  }
};
fb.core.view.DataEvent.prototype.getEventType = function() {
  return this.eventType;
};
fb.core.view.DataEvent.prototype.getEventRunner = function() {
  return this.eventRegistration.getEventRunner(this);
};
fb.core.view.DataEvent.prototype.toString = function() {
  return this.getPath().toString() + ":" + this.eventType + ":" + fb.util.json.stringify(this.snapshot.exportVal());
};
fb.core.view.CancelEvent = function(eventRegistration, error, path) {
  this.eventRegistration = eventRegistration;
  this.error = error;
  this.path = path;
};
fb.core.view.CancelEvent.prototype.getPath = function() {
  return this.path;
};
fb.core.view.CancelEvent.prototype.getEventType = function() {
  return "cancel";
};
fb.core.view.CancelEvent.prototype.getEventRunner = function() {
  return this.eventRegistration.getEventRunner(this);
};
fb.core.view.CancelEvent.prototype.toString = function() {
  return this.path.toString() + ":cancel";
};
goog.provide("fb.core.view.CacheNode");
fb.core.view.CacheNode = function(node, fullyInitialized, filtered) {
  this.node_ = node;
  this.fullyInitialized_ = fullyInitialized;
  this.filtered_ = filtered;
};
fb.core.view.CacheNode.prototype.isFullyInitialized = function() {
  return this.fullyInitialized_;
};
fb.core.view.CacheNode.prototype.isFiltered = function() {
  return this.filtered_;
};
fb.core.view.CacheNode.prototype.isCompleteForPath = function(path) {
  if (path.isEmpty()) {
    return this.isFullyInitialized() && !this.filtered_;
  } else {
    var childKey = path.getFront();
    return this.isCompleteForChild(childKey);
  }
};
fb.core.view.CacheNode.prototype.isCompleteForChild = function(key) {
  return this.isFullyInitialized() && !this.filtered_ || this.node_.hasChild(key);
};
fb.core.view.CacheNode.prototype.getNode = function() {
  return this.node_;
};
goog.provide("fb.core.stats.StatsListener");
fb.core.stats.StatsListener = function(collection) {
  this.collection_ = collection;
  this.last_ = null;
};
fb.core.stats.StatsListener.prototype.get = function() {
  var newStats = this.collection_.get();
  var delta = goog.object.clone(newStats);
  if (this.last_) {
    for (var stat in this.last_) {
      delta[stat] = delta[stat] - this.last_[stat];
    }
  }
  this.last_ = newStats;
  return delta;
};
goog.provide("fb.core.stats.StatsReporter");
var FIRST_STATS_MIN_TIME = 10 * 1E3;
var FIRST_STATS_MAX_TIME = 30 * 1E3;
var REPORT_STATS_INTERVAL = 5 * 60 * 1E3;
fb.core.stats.StatsReporter = function(collection, connection) {
  this.statsToReport_ = {};
  this.statsListener_ = new fb.core.stats.StatsListener(collection);
  this.server_ = connection;
  var timeout = FIRST_STATS_MIN_TIME + (FIRST_STATS_MAX_TIME - FIRST_STATS_MIN_TIME) * Math.random();
  setTimeout(goog.bind(this.reportStats_, this), Math.floor(timeout));
};
fb.core.stats.StatsReporter.prototype.includeStat = function(stat) {
  this.statsToReport_[stat] = true;
};
fb.core.stats.StatsReporter.prototype.reportStats_ = function() {
  var stats = this.statsListener_.get();
  var reportedStats = {};
  var haveStatsToReport = false;
  for (var stat in stats) {
    if (stats[stat] > 0 && fb.util.obj.contains(this.statsToReport_, stat)) {
      reportedStats[stat] = stats[stat];
      haveStatsToReport = true;
    }
  }
  if (haveStatsToReport) {
    this.server_.reportStats(reportedStats);
  }
  setTimeout(goog.bind(this.reportStats_, this), Math.floor(Math.random() * 2 * REPORT_STATS_INTERVAL));
};
goog.provide("fb.core.stats.StatsCollection");
goog.require("fb.util.obj");
goog.require("goog.array");
goog.require("goog.object");
fb.core.stats.StatsCollection = function() {
  this.counters_ = {};
};
fb.core.stats.StatsCollection.prototype.incrementCounter = function(name, amount) {
  if (!goog.isDef(amount)) {
    amount = 1;
  }
  if (!fb.util.obj.contains(this.counters_, name)) {
    this.counters_[name] = 0;
  }
  this.counters_[name] += amount;
};
fb.core.stats.StatsCollection.prototype.get = function() {
  return goog.object.clone(this.counters_);
};
goog.provide("fb.core.stats.StatsManager");
goog.require("fb.core.stats.StatsCollection");
goog.require("fb.core.stats.StatsListener");
goog.require("fb.core.stats.StatsReporter");
fb.core.stats.StatsManager = {};
fb.core.stats.StatsManager.collections_ = {};
fb.core.stats.StatsManager.reporters_ = {};
fb.core.stats.StatsManager.getCollection = function(repoInfo) {
  var hashString = repoInfo.toString();
  if (!fb.core.stats.StatsManager.collections_[hashString]) {
    fb.core.stats.StatsManager.collections_[hashString] = new fb.core.stats.StatsCollection;
  }
  return fb.core.stats.StatsManager.collections_[hashString];
};
fb.core.stats.StatsManager.getOrCreateReporter = function(repoInfo, creatorFunction) {
  var hashString = repoInfo.toString();
  if (!fb.core.stats.StatsManager.reporters_[hashString]) {
    fb.core.stats.StatsManager.reporters_[hashString] = creatorFunction();
  }
  return fb.core.stats.StatsManager.reporters_[hashString];
};
goog.provide("fb.core.ServerActions");
fb.core.ServerActions = goog.defineClass(null, {listen:goog.abstractMethod, unlisten:goog.abstractMethod, put:goog.abstractMethod, merge:goog.abstractMethod, auth:goog.abstractMethod, unauth:goog.abstractMethod, onDisconnectPut:goog.abstractMethod, onDisconnectMerge:goog.abstractMethod, onDisconnectCancel:goog.abstractMethod, reportStats:goog.abstractMethod});
goog.provide("fb.core.snap.Node");
goog.provide("fb.core.snap.NamedNode");
fb.core.snap.Node = function() {
};
fb.core.snap.Node.prototype.isLeafNode;
fb.core.snap.Node.prototype.getPriority;
fb.core.snap.Node.prototype.updatePriority;
fb.core.snap.Node.prototype.getImmediateChild;
fb.core.snap.Node.prototype.getChild;
fb.core.snap.Node.prototype.getPredecessorChildName;
fb.core.snap.Node.prototype.updateImmediateChild;
fb.core.snap.Node.prototype.updateChild;
fb.core.snap.Node.prototype.hasChild;
fb.core.snap.Node.prototype.isEmpty;
fb.core.snap.Node.prototype.numChildren;
fb.core.snap.Node.prototype.val;
fb.core.snap.Node.prototype.hash;
fb.core.snap.Node.prototype.compareTo;
fb.core.snap.Node.prototype.equals;
fb.core.snap.Node.prototype.withIndex;
fb.core.snap.Node.prototype.isIndexed;
fb.core.snap.NamedNode = function(name, node) {
  this.name = name;
  this.node = node;
};
fb.core.snap.NamedNode.Wrap = function(name, node) {
  return new fb.core.snap.NamedNode(name, node);
};
goog.provide("fb.core.snap.comparators");
fb.core.snap.NAME_ONLY_COMPARATOR = function(left, right) {
  return fb.core.util.nameCompare(left.name, right.name);
};
fb.core.snap.NAME_COMPARATOR = function(left, right) {
  return fb.core.util.nameCompare(left, right);
};
goog.provide("fb.core.operation.Overwrite");
fb.core.operation.Overwrite = function(source, path, snap) {
  this.type = fb.core.OperationType.OVERWRITE;
  this.source = source;
  this.path = path;
  this.snap = snap;
};
fb.core.operation.Overwrite.prototype.operationForChild = function(childName) {
  if (this.path.isEmpty()) {
    return new fb.core.operation.Overwrite(this.source, fb.core.util.Path.Empty, this.snap.getImmediateChild(childName));
  } else {
    return new fb.core.operation.Overwrite(this.source, this.path.popFront(), this.snap);
  }
};
if (goog.DEBUG) {
  fb.core.operation.Overwrite.prototype.toString = function() {
    return "Operation(" + this.path + ": " + this.source.toString() + " overwrite: " + this.snap.toString() + ")";
  };
}
;goog.provide("fb.core.operation.AckUserWrite");
fb.core.operation.AckUserWrite = function(path, revert) {
  this.type = fb.core.OperationType.ACK_USER_WRITE;
  this.source = fb.core.OperationSource.User;
  this.path = path;
  this.revert = revert;
};
fb.core.operation.AckUserWrite.prototype.operationForChild = function(childName) {
  if (!this.path.isEmpty()) {
    return new fb.core.operation.AckUserWrite(this.path.popFront(), this.revert);
  } else {
    return this;
  }
};
if (goog.DEBUG) {
  fb.core.operation.AckUserWrite.prototype.toString = function() {
    return "Operation(" + this.path + ": " + this.source.toString() + " ack write revert=" + this.revert + ")";
  };
}
;goog.provide("fb.core.operation.ListenComplete");
fb.core.operation.ListenComplete = function(source, path) {
  this.type = fb.core.OperationType.LISTEN_COMPLETE;
  this.source = source;
  this.path = path;
};
fb.core.operation.ListenComplete.prototype.operationForChild = function(childName) {
  if (this.path.isEmpty()) {
    return new fb.core.operation.ListenComplete(this.source, fb.core.util.Path.Empty);
  } else {
    return new fb.core.operation.ListenComplete(this.source, this.path.popFront());
  }
};
if (goog.DEBUG) {
  fb.core.operation.ListenComplete.prototype.toString = function() {
    return "Operation(" + this.path + ": " + this.source.toString() + " listen_complete)";
  };
}
;goog.provide("fb.core.util.SortedMap");
goog.require("goog.array");
fb.Comparator;
fb.core.util.SortedMap = goog.defineClass(null, {constructor:function(comparator, opt_root) {
  this.comparator_ = comparator;
  this.root_ = opt_root ? opt_root : fb.core.util.SortedMap.EMPTY_NODE_;
}, insert:function(key, value) {
  return new fb.core.util.SortedMap(this.comparator_, this.root_.insert(key, value, this.comparator_).copy(null, null, fb.LLRBNode.BLACK, null, null));
}, remove:function(key) {
  return new fb.core.util.SortedMap(this.comparator_, this.root_.remove(key, this.comparator_).copy(null, null, fb.LLRBNode.BLACK, null, null));
}, get:function(key) {
  var cmp;
  var node = this.root_;
  while (!node.isEmpty()) {
    cmp = this.comparator_(key, node.key);
    if (cmp === 0) {
      return node.value;
    } else {
      if (cmp < 0) {
        node = node.left;
      } else {
        if (cmp > 0) {
          node = node.right;
        }
      }
    }
  }
  return null;
}, getPredecessorKey:function(key) {
  var cmp, node = this.root_, rightParent = null;
  while (!node.isEmpty()) {
    cmp = this.comparator_(key, node.key);
    if (cmp === 0) {
      if (!node.left.isEmpty()) {
        node = node.left;
        while (!node.right.isEmpty()) {
          node = node.right;
        }
        return node.key;
      } else {
        if (rightParent) {
          return rightParent.key;
        } else {
          return null;
        }
      }
    } else {
      if (cmp < 0) {
        node = node.left;
      } else {
        if (cmp > 0) {
          rightParent = node;
          node = node.right;
        }
      }
    }
  }
  throw new Error("Attempted to find predecessor key for a nonexistent key.  What gives?");
}, isEmpty:function() {
  return this.root_.isEmpty();
}, count:function() {
  return this.root_.count();
}, minKey:function() {
  return this.root_.minKey();
}, maxKey:function() {
  return this.root_.maxKey();
}, inorderTraversal:function(action) {
  return this.root_.inorderTraversal(action);
}, reverseTraversal:function(action) {
  return this.root_.reverseTraversal(action);
}, getIterator:function(opt_resultGenerator) {
  return new fb.core.util.SortedMapIterator(this.root_, null, this.comparator_, false, opt_resultGenerator);
}, getIteratorFrom:function(key, opt_resultGenerator) {
  return new fb.core.util.SortedMapIterator(this.root_, key, this.comparator_, false, opt_resultGenerator);
}, getReverseIteratorFrom:function(key, opt_resultGenerator) {
  return new fb.core.util.SortedMapIterator(this.root_, key, this.comparator_, true, opt_resultGenerator);
}, getReverseIterator:function(opt_resultGenerator) {
  return new fb.core.util.SortedMapIterator(this.root_, null, this.comparator_, true, opt_resultGenerator);
}});
fb.core.util.SortedMapIterator = goog.defineClass(null, {constructor:function(node, startKey, comparator, isReverse, opt_resultGenerator) {
  this.resultGenerator_ = opt_resultGenerator || null;
  this.isReverse_ = isReverse;
  this.nodeStack_ = [];
  var cmp = 1;
  while (!node.isEmpty()) {
    cmp = startKey ? comparator(node.key, startKey) : 1;
    if (isReverse) {
      cmp *= -1;
    }
    if (cmp < 0) {
      if (this.isReverse_) {
        node = node.left;
      } else {
        node = node.right;
      }
    } else {
      if (cmp === 0) {
        this.nodeStack_.push(node);
        break;
      } else {
        this.nodeStack_.push(node);
        if (this.isReverse_) {
          node = node.right;
        } else {
          node = node.left;
        }
      }
    }
  }
}, getNext:function() {
  if (this.nodeStack_.length === 0) {
    return null;
  }
  var node = this.nodeStack_.pop(), result;
  if (this.resultGenerator_) {
    result = this.resultGenerator_(node.key, node.value);
  } else {
    result = {key:node.key, value:node.value};
  }
  if (this.isReverse_) {
    node = node.left;
    while (!node.isEmpty()) {
      this.nodeStack_.push(node);
      node = node.right;
    }
  } else {
    node = node.right;
    while (!node.isEmpty()) {
      this.nodeStack_.push(node);
      node = node.left;
    }
  }
  return result;
}, hasNext:function() {
  return this.nodeStack_.length > 0;
}, peek:function() {
  if (this.nodeStack_.length === 0) {
    return null;
  }
  var node = goog.array.peek(this.nodeStack_);
  if (this.resultGenerator_) {
    return this.resultGenerator_(node.key, node.value);
  } else {
    return{key:node.key, value:node.value};
  }
}});
fb.LLRBNode = goog.defineClass(null, {constructor:function(key, value, color, opt_left, opt_right) {
  this.key = key;
  this.value = value;
  this.color = color != null ? color : fb.LLRBNode.RED;
  this.left = opt_left != null ? opt_left : fb.core.util.SortedMap.EMPTY_NODE_;
  this.right = opt_right != null ? opt_right : fb.core.util.SortedMap.EMPTY_NODE_;
}, statics:{RED:true, BLACK:false}, copy:function(key, value, color, left, right) {
  return new fb.LLRBNode(key != null ? key : this.key, value != null ? value : this.value, color != null ? color : this.color, left != null ? left : this.left, right != null ? right : this.right);
}, count:function() {
  return this.left.count() + 1 + this.right.count();
}, isEmpty:function() {
  return false;
}, inorderTraversal:function(action) {
  return this.left.inorderTraversal(action) || action(this.key, this.value) || this.right.inorderTraversal(action);
}, reverseTraversal:function(action) {
  return this.right.reverseTraversal(action) || action(this.key, this.value) || this.left.reverseTraversal(action);
}, min_:function() {
  if (this.left.isEmpty()) {
    return this;
  } else {
    return this.left.min_();
  }
}, minKey:function() {
  return this.min_().key;
}, maxKey:function() {
  if (this.right.isEmpty()) {
    return this.key;
  } else {
    return this.right.maxKey();
  }
}, insert:function(key, value, comparator) {
  var cmp, n;
  n = this;
  cmp = comparator(key, n.key);
  if (cmp < 0) {
    n = n.copy(null, null, null, n.left.insert(key, value, comparator), null);
  } else {
    if (cmp === 0) {
      n = n.copy(null, value, null, null, null);
    } else {
      n = n.copy(null, null, null, null, n.right.insert(key, value, comparator));
    }
  }
  return n.fixUp_();
}, removeMin_:function() {
  var n;
  if (this.left.isEmpty()) {
    return fb.core.util.SortedMap.EMPTY_NODE_;
  }
  n = this;
  if (!n.left.isRed_() && !n.left.left.isRed_()) {
    n = n.moveRedLeft_();
  }
  n = n.copy(null, null, null, n.left.removeMin_(), null);
  return n.fixUp_();
}, remove:function(key, comparator) {
  var n, smallest;
  n = this;
  if (comparator(key, n.key) < 0) {
    if (!n.left.isEmpty() && !n.left.isRed_() && !n.left.left.isRed_()) {
      n = n.moveRedLeft_();
    }
    n = n.copy(null, null, null, n.left.remove(key, comparator), null);
  } else {
    if (n.left.isRed_()) {
      n = n.rotateRight_();
    }
    if (!n.right.isEmpty() && !n.right.isRed_() && !n.right.left.isRed_()) {
      n = n.moveRedRight_();
    }
    if (comparator(key, n.key) === 0) {
      if (n.right.isEmpty()) {
        return fb.core.util.SortedMap.EMPTY_NODE_;
      } else {
        smallest = n.right.min_();
        n = n.copy(smallest.key, smallest.value, null, null, n.right.removeMin_());
      }
    }
    n = n.copy(null, null, null, null, n.right.remove(key, comparator));
  }
  return n.fixUp_();
}, isRed_:function() {
  return this.color;
}, fixUp_:function() {
  var n = this;
  if (n.right.isRed_() && !n.left.isRed_()) {
    n = n.rotateLeft_();
  }
  if (n.left.isRed_() && n.left.left.isRed_()) {
    n = n.rotateRight_();
  }
  if (n.left.isRed_() && n.right.isRed_()) {
    n = n.colorFlip_();
  }
  return n;
}, moveRedLeft_:function() {
  var n = this.colorFlip_();
  if (n.right.left.isRed_()) {
    n = n.copy(null, null, null, null, n.right.rotateRight_());
    n = n.rotateLeft_();
    n = n.colorFlip_();
  }
  return n;
}, moveRedRight_:function() {
  var n = this.colorFlip_();
  if (n.left.left.isRed_()) {
    n = n.rotateRight_();
    n = n.colorFlip_();
  }
  return n;
}, rotateLeft_:function() {
  var nl;
  nl = this.copy(null, null, fb.LLRBNode.RED, null, this.right.left);
  return this.right.copy(null, null, this.color, nl, null);
}, rotateRight_:function() {
  var nr;
  nr = this.copy(null, null, fb.LLRBNode.RED, this.left.right, null);
  return this.left.copy(null, null, this.color, null, nr);
}, colorFlip_:function() {
  var left, right;
  left = this.left.copy(null, null, !this.left.color, null, null);
  right = this.right.copy(null, null, !this.right.color, null, null);
  return this.copy(null, null, !this.color, left, right);
}, checkMaxDepth_:function() {
  var blackDepth;
  blackDepth = this.check_();
  if (Math.pow(2, blackDepth) <= this.count() + 1) {
    return true;
  } else {
    return false;
  }
}, check_:function() {
  var blackDepth;
  if (this.isRed_() && this.left.isRed_()) {
    throw new Error("Red node has red child(" + this.key + "," + this.value + ")");
  }
  if (this.right.isRed_()) {
    throw new Error("Right child of (" + this.key + "," + this.value + ") is red");
  }
  blackDepth = this.left.check_();
  if (blackDepth !== this.right.check_()) {
    throw new Error("Black depths differ");
  } else {
    return blackDepth + (this.isRed_() ? 0 : 1);
  }
}});
fb.LLRBEmptyNode = goog.defineClass(null, {constructor:function() {
}, copy:function() {
  return this;
}, insert:function(key, value, comparator) {
  return new fb.LLRBNode(key, value, null);
}, remove:function(key, comparator) {
  return this;
}, count:function() {
  return 0;
}, isEmpty:function() {
  return true;
}, inorderTraversal:function(action) {
  return false;
}, reverseTraversal:function(action) {
  return false;
}, minKey:function() {
  return null;
}, maxKey:function() {
  return null;
}, check_:function() {
  return 0;
}, isRed_:function() {
  return false;
}});
fb.core.util.SortedMap.EMPTY_NODE_ = new fb.LLRBEmptyNode;
goog.provide("fb.core.util.NodePatches");
(function() {
  if (NODE_CLIENT) {
    var version = process["version"];
    if (version === "v0.10.22" || version === "v0.10.23" || version === "v0.10.24") {
      var Writable = require("_stream_writable");
      Writable["prototype"]["write"] = function(chunk, encoding, cb) {
        var state = this["_writableState"];
        var ret = false;
        if (typeof encoding === "function") {
          cb = encoding;
          encoding = null;
        }
        if (Buffer["isBuffer"](chunk)) {
          encoding = "buffer";
        } else {
          if (!encoding) {
            encoding = state["defaultEncoding"];
          }
        }
        if (typeof cb !== "function") {
          cb = function() {
          };
        }
        if (state["ended"]) {
          writeAfterEnd(this, state, cb);
        } else {
          if (validChunk(this, state, chunk, cb)) {
            ret = writeOrBuffer(this, state, chunk, encoding, cb);
          }
        }
        return ret;
      };
      function writeAfterEnd(stream, state, cb) {
        var er = new Error("write after end");
        stream["emit"]("error", er);
        process["nextTick"](function() {
          cb(er);
        });
      }
      function validChunk(stream, state, chunk, cb) {
        var valid = true;
        if (!Buffer["isBuffer"](chunk) && "string" !== typeof chunk && chunk !== null && chunk !== undefined && !state["objectMode"]) {
          var er = new TypeError("Invalid non-string/buffer chunk");
          stream["emit"]("error", er);
          process["nextTick"](function() {
            cb(er);
          });
          valid = false;
        }
        return valid;
      }
      function writeOrBuffer(stream, state, chunk, encoding, cb) {
        chunk = decodeChunk(state, chunk, encoding);
        if (Buffer["isBuffer"](chunk)) {
          encoding = "buffer";
        }
        var len = state["objectMode"] ? 1 : chunk["length"];
        state["length"] += len;
        var ret = state["length"] < state["highWaterMark"];
        if (!ret) {
          state["needDrain"] = true;
        }
        if (state["writing"]) {
          state["buffer"]["push"](new WriteReq(chunk, encoding, cb));
        } else {
          doWrite(stream, state, len, chunk, encoding, cb);
        }
        return ret;
      }
      function decodeChunk(state, chunk, encoding) {
        if (!state["objectMode"] && state["decodeStrings"] !== false && typeof chunk === "string") {
          chunk = new Buffer(chunk, encoding);
        }
        return chunk;
      }
      function WriteReq(chunk, encoding, cb) {
        this["chunk"] = chunk;
        this["encoding"] = encoding;
        this["callback"] = cb;
      }
      function doWrite(stream, state, len, chunk, encoding, cb) {
        state["writelen"] = len;
        state["writecb"] = cb;
        state["writing"] = true;
        state["sync"] = true;
        stream["_write"](chunk, encoding, state["onwrite"]);
        state["sync"] = false;
      }
      var Duplex = require("_stream_duplex");
      Duplex["prototype"]["write"] = Writable["prototype"]["write"];
    }
  }
})();
goog.provide("fb.core.util.ServerValues");
fb.core.util.ServerValues.generateWithValues = function(values) {
  values = values || {};
  values["timestamp"] = values["timestamp"] || (new Date).getTime();
  return values;
};
fb.core.util.ServerValues.resolveDeferredValue = function(value, serverValues) {
  if (!value || typeof value !== "object") {
    return(value);
  } else {
    fb.core.util.assert(".sv" in value, "Unexpected leaf node or priority contents");
    return serverValues[value[".sv"]];
  }
};
fb.core.util.ServerValues.resolveDeferredValueTree = function(tree, serverValues) {
  var resolvedTree = new fb.core.SparseSnapshotTree;
  tree.forEachTree(new fb.core.util.Path(""), function(path, node) {
    resolvedTree.remember(path, fb.core.util.ServerValues.resolveDeferredValueSnapshot(node, serverValues));
  });
  return resolvedTree;
};
fb.core.util.ServerValues.resolveDeferredValueSnapshot = function(node, serverValues) {
  var rawPri = (node.getPriority().val()), priority = fb.core.util.ServerValues.resolveDeferredValue(rawPri, serverValues), newNode;
  if (node.isLeafNode()) {
    var leafNode = (node);
    var value = fb.core.util.ServerValues.resolveDeferredValue(leafNode.getValue(), serverValues);
    if (value !== leafNode.getValue() || priority !== leafNode.getPriority().val()) {
      return new fb.core.snap.LeafNode(value, fb.core.snap.NodeFromJSON(priority));
    } else {
      return node;
    }
  } else {
    var childrenNode = (node);
    newNode = childrenNode;
    if (priority !== childrenNode.getPriority().val()) {
      newNode = newNode.updatePriority(new fb.core.snap.LeafNode(priority));
    }
    childrenNode.forEachChild(fb.core.snap.PriorityIndex, function(childName, childNode) {
      var newChildNode = fb.core.util.ServerValues.resolveDeferredValueSnapshot(childNode, serverValues);
      if (newChildNode !== childNode) {
        newNode = newNode.updateImmediateChild(childName, newChildNode);
      }
    });
    return newNode;
  }
};
goog.provide("fb.core.util.Path");
goog.provide("fb.core.util.ValidationPath");
fb.core.util.Path = goog.defineClass(null, {constructor:function(pathOrString, opt_pieceNum) {
  if (arguments.length == 1) {
    this.pieces_ = pathOrString.split("/");
    var copyTo = 0;
    for (var i = 0;i < this.pieces_.length;i++) {
      if (this.pieces_[i].length > 0) {
        this.pieces_[copyTo] = this.pieces_[i];
        copyTo++;
      }
    }
    this.pieces_.length = copyTo;
    this.pieceNum_ = 0;
  } else {
    this.pieces_ = pathOrString;
    this.pieceNum_ = opt_pieceNum;
  }
}, getFront:function() {
  if (this.pieceNum_ >= this.pieces_.length) {
    return null;
  }
  return this.pieces_[this.pieceNum_];
}, getLength:function() {
  return this.pieces_.length - this.pieceNum_;
}, popFront:function() {
  var pieceNum = this.pieceNum_;
  if (pieceNum < this.pieces_.length) {
    pieceNum++;
  }
  return new fb.core.util.Path(this.pieces_, pieceNum);
}, getBack:function() {
  if (this.pieceNum_ < this.pieces_.length) {
    return this.pieces_[this.pieces_.length - 1];
  }
  return null;
}, toString:function() {
  var pathString = "";
  for (var i = this.pieceNum_;i < this.pieces_.length;i++) {
    if (this.pieces_[i] !== "") {
      pathString += "/" + this.pieces_[i];
    }
  }
  return pathString || "/";
}, toUrlEncodedString:function() {
  var pathString = "";
  for (var i = this.pieceNum_;i < this.pieces_.length;i++) {
    if (this.pieces_[i] !== "") {
      pathString += "/" + goog.string.urlEncode(this.pieces_[i]);
    }
  }
  return pathString || "/";
}, slice:function(opt_begin) {
  var begin = opt_begin || 0;
  return this.pieces_.slice(this.pieceNum_ + begin);
}, parent:function() {
  if (this.pieceNum_ >= this.pieces_.length) {
    return null;
  }
  var pieces = [];
  for (var i = this.pieceNum_;i < this.pieces_.length - 1;i++) {
    pieces.push(this.pieces_[i]);
  }
  return new fb.core.util.Path(pieces, 0);
}, child:function(childPathObj) {
  var pieces = [];
  for (var i = this.pieceNum_;i < this.pieces_.length;i++) {
    pieces.push(this.pieces_[i]);
  }
  if (childPathObj instanceof fb.core.util.Path) {
    for (i = childPathObj.pieceNum_;i < childPathObj.pieces_.length;i++) {
      pieces.push(childPathObj.pieces_[i]);
    }
  } else {
    var childPieces = childPathObj.split("/");
    for (i = 0;i < childPieces.length;i++) {
      if (childPieces[i].length > 0) {
        pieces.push(childPieces[i]);
      }
    }
  }
  return new fb.core.util.Path(pieces, 0);
}, isEmpty:function() {
  return this.pieceNum_ >= this.pieces_.length;
}, statics:{relativePath:function(outerPath, innerPath) {
  var outer = outerPath.getFront(), inner = innerPath.getFront();
  if (outer === null) {
    return innerPath;
  } else {
    if (outer === inner) {
      return fb.core.util.Path.relativePath(outerPath.popFront(), innerPath.popFront());
    } else {
      throw new Error("INTERNAL ERROR: innerPath (" + innerPath + ") is not within " + "outerPath (" + outerPath + ")");
    }
  }
}}, equals:function(other) {
  if (this.getLength() !== other.getLength()) {
    return false;
  }
  for (var i = this.pieceNum_, j = other.pieceNum_;i <= this.pieces_.length;i++, j++) {
    if (this.pieces_[i] !== other.pieces_[j]) {
      return false;
    }
  }
  return true;
}, contains:function(other) {
  var i = this.pieceNum_;
  var j = other.pieceNum_;
  if (this.getLength() > other.getLength()) {
    return false;
  }
  while (i < this.pieces_.length) {
    if (this.pieces_[i] !== other.pieces_[j]) {
      return false;
    }
    ++i;
    ++j;
  }
  return true;
}});
fb.core.util.Path.Empty = new fb.core.util.Path("");
fb.core.util.ValidationPath = goog.defineClass(null, {constructor:function(path, errorPrefix) {
  this.parts_ = path.slice();
  this.byteLength_ = Math.max(1, this.parts_.length);
  this.errorPrefix_ = errorPrefix;
  for (var i = 0;i < this.parts_.length;i++) {
    this.byteLength_ += fb.util.utf8.stringLength(this.parts_[i]);
  }
  this.checkValid_();
}, statics:{MAX_PATH_DEPTH:32, MAX_PATH_LENGTH_BYTES:768}, push:function(child) {
  if (this.parts_.length > 0) {
    this.byteLength_ += 1;
  }
  this.parts_.push(child);
  this.byteLength_ += fb.util.utf8.stringLength(child);
  this.checkValid_();
}, pop:function() {
  var last = this.parts_.pop();
  this.byteLength_ -= fb.util.utf8.stringLength(last);
  if (this.parts_.length > 0) {
    this.byteLength_ -= 1;
  }
}, checkValid_:function() {
  if (this.byteLength_ > fb.core.util.ValidationPath.MAX_PATH_LENGTH_BYTES) {
    throw new Error(this.errorPrefix_ + "has a key path longer than " + fb.core.util.ValidationPath.MAX_PATH_LENGTH_BYTES + " bytes (" + this.byteLength_ + ").");
  }
  if (this.parts_.length > fb.core.util.ValidationPath.MAX_PATH_DEPTH) {
    throw new Error(this.errorPrefix_ + "path specified exceeds the maximum depth that can be written (" + fb.core.util.ValidationPath.MAX_PATH_DEPTH + ") or object contains a cycle " + this.toErrorString());
  }
}, toErrorString:function() {
  if (this.parts_.length == 0) {
    return "";
  }
  return "in property '" + this.parts_.join(".") + "'";
}});
goog.provide("fb.core.storage.MemoryStorage");
goog.require("fb.util.obj");
goog.scope(function() {
  var obj = fb.util.obj;
  fb.core.storage.MemoryStorage = function() {
    this.cache_ = {};
  };
  var MemoryStorage = fb.core.storage.MemoryStorage;
  MemoryStorage.prototype.set = function(key, value) {
    if (value == null) {
      delete this.cache_[key];
    } else {
      this.cache_[key] = value;
    }
  };
  MemoryStorage.prototype.get = function(key) {
    if (obj.contains(this.cache_, key)) {
      return this.cache_[key];
    }
    return null;
  };
  MemoryStorage.prototype.remove = function(key) {
    delete this.cache_[key];
  };
  MemoryStorage.prototype.isInMemoryStorage = true;
});
goog.provide("fb.core.storage.DOMStorageWrapper");
goog.require("fb.util.obj");
goog.scope(function() {
  fb.core.storage.DOMStorageWrapper = function(domStorage) {
    this.domStorage_ = domStorage;
    this.prefix_ = "firebase:";
  };
  var DOMStorageWrapper = fb.core.storage.DOMStorageWrapper;
  DOMStorageWrapper.prototype.set = function(key, value) {
    if (value == null) {
      this.domStorage_.removeItem(this.prefixedName_(key));
    } else {
      this.domStorage_.setItem(this.prefixedName_(key), fb.util.json.stringify(value));
    }
  };
  DOMStorageWrapper.prototype.get = function(key) {
    var storedVal = this.domStorage_.getItem(this.prefixedName_(key));
    if (storedVal == null) {
      return null;
    } else {
      return fb.util.json.eval(storedVal);
    }
  };
  DOMStorageWrapper.prototype.remove = function(key) {
    this.domStorage_.removeItem(this.prefixedName_(key));
  };
  DOMStorageWrapper.prototype.isInMemoryStorage = false;
  DOMStorageWrapper.prototype.prefixedName_ = function(name) {
    return this.prefix_ + name;
  };
  DOMStorageWrapper.prototype.toString = function() {
    return this.domStorage_.toString();
  };
});
goog.provide("fb.core.storage");
goog.require("fb.core.storage.DOMStorageWrapper");
goog.require("fb.core.storage.MemoryStorage");
fb.core.storage.createStoragefor = function(domStorageName) {
  try {
    if (typeof window !== "undefined" && typeof window[domStorageName] !== "undefined") {
      var domStorage = window[domStorageName];
      domStorage.setItem("firebase:sentinel", "cache");
      domStorage.removeItem("firebase:sentinel");
      return new fb.core.storage.DOMStorageWrapper(domStorage);
    }
  } catch (e) {
  }
  return new fb.core.storage.MemoryStorage;
};
fb.core.storage.PersistentStorage = fb.core.storage.createStoragefor("localStorage");
fb.core.storage.SessionStorage = fb.core.storage.createStoragefor("sessionStorage");
goog.provide("fb.core.RepoInfo");
goog.require("fb.core.storage");
fb.core.RepoInfo = function(host, secure, namespace, webSocketOnly, persistenceKey) {
  this.host = host.toLowerCase();
  this.domain = this.host.substr(this.host.indexOf(".") + 1);
  this.secure = secure;
  this.namespace = namespace;
  this.webSocketOnly = webSocketOnly;
  this.persistenceKey = persistenceKey || "";
  this.internalHost = fb.core.storage.PersistentStorage.get("host:" + host) || this.host;
};
fb.core.RepoInfo.prototype.needsQueryParam = function() {
  return this.host !== this.internalHost;
};
fb.core.RepoInfo.prototype.isCacheableHost = function() {
  return this.internalHost.substr(0, 2) === "s-";
};
fb.core.RepoInfo.prototype.isDemoHost = function() {
  return this.domain === "firebaseio-demo.com";
};
fb.core.RepoInfo.prototype.isCustomHost = function() {
  return this.domain !== "firebaseio.com" && this.domain !== "firebaseio-demo.com";
};
fb.core.RepoInfo.prototype.updateHost = function(newHost) {
  if (newHost !== this.internalHost) {
    this.internalHost = newHost;
    if (this.isCacheableHost()) {
      fb.core.storage.PersistentStorage.set("host:" + this.host, this.internalHost);
    }
  }
};
fb.core.RepoInfo.prototype.toString = function() {
  var str = (this.secure ? "https://" : "http://") + this.host;
  if (this.persistenceKey) {
    str += "<" + this.persistenceKey + ">";
  }
  return str;
};
goog.provide("fb.core.util");
goog.require("fb.constants");
goog.require("fb.core.RepoInfo");
goog.require("fb.core.storage");
goog.require("fb.util.json");
goog.require("goog.crypt.Sha1");
goog.require("goog.crypt.base64");
goog.require("goog.object");
goog.require("goog.string");
fb.core.util.LUIDGenerator = function() {
  var id = 1;
  return function() {
    return id++;
  };
}();
fb.core.util.assert = function(assertion, message) {
  if (!assertion) {
    throw fb.core.util.assertionError(message);
  }
};
fb.core.util.assertionError = function(message) {
  return new Error("Firebase (" + Firebase.SDK_VERSION + ") INTERNAL ASSERT FAILED: " + message);
};
fb.core.util.assertWeak = function(assertion, message) {
  if (!assertion) {
    fb.core.util.error(message);
  }
};
fb.core.util.base64Encode = function(str) {
  var utf8Bytes = fb.util.utf8.stringToByteArray(str);
  return goog.crypt.base64.encodeByteArray(utf8Bytes, true);
};
fb.core.util.base64Decode = function(str) {
  try {
    if (NODE_CLIENT) {
      return(new Buffer(str, "base64")).toString("utf8");
    } else {
      if (typeof atob !== "undefined") {
        return atob(str);
      } else {
        return goog.crypt.base64.decodeString(str, true);
      }
    }
  } catch (e) {
    fb.core.util.log("base64Decode failed: ", e);
  }
  return null;
};
fb.core.util.sha1 = function(str) {
  var utf8Bytes = fb.util.utf8.stringToByteArray(str);
  var sha1 = new goog.crypt.Sha1;
  sha1.update(utf8Bytes);
  var sha1Bytes = sha1.digest();
  return goog.crypt.base64.encodeByteArray(sha1Bytes);
};
fb.core.util.buildLogMessage_ = function(var_args) {
  var message = "";
  for (var i = 0;i < arguments.length;i++) {
    if (goog.isArrayLike(arguments[i])) {
      message += fb.core.util.buildLogMessage_.apply(null, arguments[i]);
    } else {
      if (typeof arguments[i] === "object") {
        message += fb.util.json.stringify(arguments[i]);
      } else {
        message += arguments[i];
      }
    }
    message += " ";
  }
  return message;
};
fb.core.util.logger = null;
fb.core.util.firstLog_ = true;
fb.core.util.log = function(var_args) {
  if (fb.core.util.firstLog_ === true) {
    fb.core.util.firstLog_ = false;
    if (fb.core.util.logger === null && fb.core.storage.SessionStorage.get("logging_enabled") === true) {
      Firebase.enableLogging(true);
    }
  }
  if (fb.core.util.logger) {
    var message = fb.core.util.buildLogMessage_.apply(null, arguments);
    fb.core.util.logger(message);
  }
};
fb.core.util.logWrapper = function(prefix) {
  return function() {
    fb.core.util.log(prefix, arguments);
  };
};
fb.core.util.error = function(var_args) {
  if (typeof console !== "undefined") {
    var message = "FIREBASE INTERNAL ERROR: " + fb.core.util.buildLogMessage_.apply(null, arguments);
    if (typeof console.error !== "undefined") {
      console.error(message);
    } else {
      console.log(message);
    }
  }
};
fb.core.util.fatal = function(var_args) {
  var message = fb.core.util.buildLogMessage_.apply(null, arguments);
  throw new Error("FIREBASE FATAL ERROR: " + message);
};
fb.core.util.warn = function(var_args) {
  if (typeof console !== "undefined") {
    var message = "FIREBASE WARNING: " + fb.core.util.buildLogMessage_.apply(null, arguments);
    if (typeof console.warn !== "undefined") {
      console.warn(message);
    } else {
      console.log(message);
    }
  }
};
fb.core.util.warnIfPageIsSecure = function() {
  if (typeof window !== "undefined" && window.location && window.location.protocol && window.location.protocol.indexOf("https:") !== -1) {
    fb.core.util.warn("Insecure Firebase access from a secure page. " + "Please use https in calls to new Firebase().");
  }
};
fb.core.util.warnAboutUnsupportedMethod = function(methodName) {
  fb.core.util.warn(methodName + " is unsupported and will likely change soon.  " + "Please do not use.");
};
fb.core.util.parseRepoInfo = function(dataURL) {
  var parsedUrl = fb.core.util.parseURL(dataURL), namespace = parsedUrl.subdomain;
  if (parsedUrl.domain === "firebase") {
    fb.core.util.fatal(parsedUrl.host + " is no longer supported. " + "Please use <YOUR FIREBASE>.firebaseio.com instead");
  }
  if (!namespace) {
    fb.core.util.fatal("Cannot parse Firebase url. " + "Please use https://<YOUR FIREBASE>.firebaseio.com");
  }
  if (!parsedUrl.secure) {
    fb.core.util.warnIfPageIsSecure();
  }
  var webSocketOnly = parsedUrl.scheme === "ws" || parsedUrl.scheme === "wss";
  return{repoInfo:new fb.core.RepoInfo(parsedUrl.host, parsedUrl.secure, namespace, webSocketOnly), path:new fb.core.util.Path(parsedUrl.pathString)};
};
fb.core.util.parseURL = function(dataURL) {
  var host = "", domain = "", subdomain = "", pathString = "";
  var secure = true, scheme = "https", port = 443;
  if (goog.isString(dataURL)) {
    var colonInd = dataURL.indexOf("//");
    if (colonInd >= 0) {
      scheme = dataURL.substring(0, colonInd - 1);
      dataURL = dataURL.substring(colonInd + 2);
    }
    var slashInd = dataURL.indexOf("/");
    if (slashInd === -1) {
      slashInd = dataURL.length;
    }
    host = dataURL.substring(0, slashInd);
    pathString = fb.core.util.decodePath(dataURL.substring(slashInd));
    var parts = host.split(".");
    if (parts.length === 3) {
      domain = parts[1];
      subdomain = parts[0].toLowerCase();
    } else {
      if (parts.length === 2) {
        domain = parts[0];
      }
    }
    colonInd = host.indexOf(":");
    if (colonInd >= 0) {
      secure = scheme === "https" || scheme === "wss";
      port = goog.string.parseInt(host.substring(colonInd + 1));
    }
  }
  return{host:host, port:port, domain:domain, subdomain:subdomain, secure:secure, scheme:scheme, pathString:pathString};
};
fb.core.util.decodePath = function(pathString) {
  var pathStringDecoded = "";
  var pieces = pathString.split("/");
  for (var i = 0;i < pieces.length;i++) {
    if (pieces[i].length > 0) {
      var piece = pieces[i];
      try {
        piece = goog.string.urlDecode(piece);
      } catch (e) {
      }
      pathStringDecoded += "/" + piece;
    }
  }
  return pathStringDecoded;
};
fb.core.util.isInvalidJSONNumber = function(data) {
  return goog.isNumber(data) && (data != data || data == Number.POSITIVE_INFINITY || data == Number.NEGATIVE_INFINITY);
};
fb.core.util.executeWhenDOMReady = function(fn) {
  if (NODE_CLIENT || document.readyState === "complete") {
    fn();
  } else {
    var called = false;
    var wrappedFn = function() {
      if (!document.body) {
        setTimeout(wrappedFn, Math.floor(10));
        return;
      }
      if (!called) {
        called = true;
        fn();
      }
    };
    if (document.addEventListener) {
      document.addEventListener("DOMContentLoaded", wrappedFn, false);
      window.addEventListener("load", wrappedFn, false);
    } else {
      if (document.attachEvent) {
        document.attachEvent("onreadystatechange", function() {
          if (document.readyState === "complete") {
            wrappedFn();
          }
        });
        window.attachEvent("onload", wrappedFn);
      }
    }
  }
};
fb.core.util.MIN_NAME = "[MIN_NAME]";
fb.core.util.MAX_NAME = "[MAX_NAME]";
fb.core.util.nameCompare = function(a, b) {
  if (a === b) {
    return 0;
  } else {
    if (a === fb.core.util.MIN_NAME || b === fb.core.util.MAX_NAME) {
      return-1;
    } else {
      if (b === fb.core.util.MIN_NAME || a === fb.core.util.MAX_NAME) {
        return 1;
      } else {
        var aAsInt = fb.core.util.tryParseInt(a), bAsInt = fb.core.util.tryParseInt(b);
        if (aAsInt !== null) {
          if (bAsInt !== null) {
            return aAsInt - bAsInt == 0 ? a.length - b.length : aAsInt - bAsInt;
          } else {
            return-1;
          }
        } else {
          if (bAsInt !== null) {
            return 1;
          } else {
            return a < b ? -1 : 1;
          }
        }
      }
    }
  }
};
fb.core.util.stringCompare = function(a, b) {
  if (a === b) {
    return 0;
  } else {
    if (a < b) {
      return-1;
    } else {
      return 1;
    }
  }
};
fb.core.util.requireKey = function(key, obj) {
  if (obj && key in obj) {
    return obj[key];
  } else {
    throw new Error("Missing required key (" + key + ") in object: " + fb.util.json.stringify(obj));
  }
};
fb.core.util.ObjectToUniqueKey = function(obj) {
  if (typeof obj !== "object" || obj === null) {
    return fb.util.json.stringify(obj);
  }
  var keys = [];
  for (var k in obj) {
    keys.push(k);
  }
  keys.sort();
  var key = "{";
  for (var i = 0;i < keys.length;i++) {
    if (i !== 0) {
      key += ",";
    }
    key += fb.util.json.stringify(keys[i]);
    key += ":";
    key += fb.core.util.ObjectToUniqueKey(obj[keys[i]]);
  }
  key += "}";
  return key;
};
fb.core.util.splitStringBySize = function(str, segsize) {
  if (str.length <= segsize) {
    return[str];
  }
  var dataSegs = [];
  for (var c = 0;c < str.length;c += segsize) {
    if (c + segsize > str) {
      dataSegs.push(str.substring(c, str.length));
    } else {
      dataSegs.push(str.substring(c, c + segsize));
    }
  }
  return dataSegs;
};
fb.core.util.each = function(obj, fn) {
  if (goog.isArray(obj)) {
    for (var i = 0;i < obj.length;++i) {
      fn(i, obj[i]);
    }
  } else {
    goog.object.forEach(obj, fn);
  }
};
fb.core.util.bindCallback = function(callback, opt_context) {
  return opt_context ? goog.bind(callback, opt_context) : callback;
};
fb.core.util.doubleToIEEE754String = function(v) {
  fb.core.util.assert(!fb.core.util.isInvalidJSONNumber(v), "Invalid JSON number");
  var ebits = 11, fbits = 52;
  var bias = (1 << ebits - 1) - 1, s, e, f, ln, i, bits, str, bytes;
  if (v === 0) {
    e = 0;
    f = 0;
    s = 1 / v === -Infinity ? 1 : 0;
  } else {
    s = v < 0;
    v = Math.abs(v);
    if (v >= Math.pow(2, 1 - bias)) {
      ln = Math.min(Math.floor(Math.log(v) / Math.LN2), bias);
      e = ln + bias;
      f = Math.round(v * Math.pow(2, fbits - ln) - Math.pow(2, fbits));
    } else {
      e = 0;
      f = Math.round(v / Math.pow(2, 1 - bias - fbits));
    }
  }
  bits = [];
  for (i = fbits;i;i -= 1) {
    bits.push(f % 2 ? 1 : 0);
    f = Math.floor(f / 2);
  }
  for (i = ebits;i;i -= 1) {
    bits.push(e % 2 ? 1 : 0);
    e = Math.floor(e / 2);
  }
  bits.push(s ? 1 : 0);
  bits.reverse();
  str = bits.join("");
  var hexByteString = "";
  for (i = 0;i < 64;i += 8) {
    var hexByte = parseInt(str.substr(i, 8), 2).toString(16);
    if (hexByte.length === 1) {
      hexByte = "0" + hexByte;
    }
    hexByteString = hexByteString + hexByte;
  }
  return hexByteString.toLowerCase();
};
fb.core.util.isChromeExtensionContentScript = function() {
  return!!(typeof window === "object" && window["chrome"] && window["chrome"]["extension"] && !/^chrome/.test(window.location.href));
};
fb.core.util.isWindowsStoreApp = function() {
  return typeof Windows === "object" && typeof Windows.UI === "object";
};
fb.core.util.errorForServerCode = function(code) {
  var reason = "Unknown Error";
  if (code === "too_big") {
    reason = "The data requested exceeds the maximum size " + "that can be accessed with a single request.";
  } else {
    if (code == "permission_denied") {
      reason = "Client doesn't have permission to access the desired data.";
    } else {
      if (code == "unavailable") {
        reason = "The service is unavailable";
      }
    }
  }
  var error = new Error(code + ": " + reason);
  error.code = code.toUpperCase();
  return error;
};
fb.core.util.INTEGER_REGEXP_ = new RegExp("^-?\\d{1,10}$");
fb.core.util.tryParseInt = function(str) {
  if (fb.core.util.INTEGER_REGEXP_.test(str)) {
    var intVal = Number(str);
    if (intVal >= -2147483648 && intVal <= 2147483647) {
      return intVal;
    }
  }
  return null;
};
fb.core.util.exceptionGuard = function(fn) {
  try {
    fn();
  } catch (e) {
    setTimeout(function() {
      var stack = e.stack || "";
      fb.core.util.warn("Exception was thrown by user callback.", stack);
      throw e;
    }, Math.floor(0));
  }
};
fb.core.util.callUserCallback = function(opt_callback, var_args) {
  if (goog.isFunction(opt_callback)) {
    var args = Array.prototype.slice.call(arguments, 1);
    var newArgs = args.slice();
    fb.core.util.exceptionGuard(function() {
      opt_callback.apply(null, newArgs);
    });
  }
};
fb.core.util.beingCrawled = function() {
  var userAgent = typeof window === "object" && window["navigator"] && window["navigator"]["userAgent"] || "";
  return userAgent.search(/googlebot|google webmaster tools|bingbot|yahoo! slurp|baiduspider|yandexbot|duckduckbot/i) >= 0;
};
goog.provide("fb.util.utf8");
goog.require("fb.core.util");
fb.util.utf8.stringToByteArray = function(str) {
  var out = [], p = 0;
  for (var i = 0;i < str.length;i++) {
    var c = str.charCodeAt(i);
    if (c >= 55296 && c <= 56319) {
      var high = c - 55296;
      i++;
      fb.core.util.assert(i < str.length, "Surrogate pair missing trail surrogate.");
      var low = str.charCodeAt(i) - 56320;
      c = 65536 + (high << 10) + low;
    }
    if (c < 128) {
      out[p++] = c;
    } else {
      if (c < 2048) {
        out[p++] = c >> 6 | 192;
        out[p++] = c & 63 | 128;
      } else {
        if (c < 65536) {
          out[p++] = c >> 12 | 224;
          out[p++] = c >> 6 & 63 | 128;
          out[p++] = c & 63 | 128;
        } else {
          out[p++] = c >> 18 | 240;
          out[p++] = c >> 12 & 63 | 128;
          out[p++] = c >> 6 & 63 | 128;
          out[p++] = c & 63 | 128;
        }
      }
    }
  }
  return out;
};
fb.util.utf8.stringLength = function(str) {
  var p = 0;
  for (var i = 0;i < str.length;i++) {
    var c = str.charCodeAt(i);
    if (c < 128) {
      p++;
    } else {
      if (c < 2048) {
        p += 2;
      } else {
        if (c >= 55296 && c <= 56319) {
          p += 4;
          i++;
        } else {
          p += 3;
        }
      }
    }
  }
  return p;
};
goog.provide("fb.util.jwt");
goog.require("fb.core.util");
goog.require("fb.util.json");
goog.require("fb.util.obj");
goog.require("goog.crypt.base64");
goog.require("goog.json");
fb.util.jwt.decode = function(token) {
  var header = {}, claims = {}, data = {}, signature = "";
  try {
    var parts = token.split(".");
    header = fb.util.json.eval(fb.core.util.base64Decode(parts[0]) || "");
    claims = fb.util.json.eval(fb.core.util.base64Decode(parts[1]) || "");
    signature = parts[2];
    data = claims["d"] || {};
    delete claims["d"];
  } catch (e) {
  }
  return{header:header, claims:claims, data:data, signature:signature};
};
fb.util.jwt.isValidTimestamp = function(token) {
  var claims = fb.util.jwt.decode(token).claims, now = Math.floor((new Date).getTime() / 1E3), validSince, validUntil;
  if (typeof claims === "object") {
    if (claims.hasOwnProperty("nbf")) {
      validSince = fb.util.obj.get(claims, "nbf");
    } else {
      if (claims.hasOwnProperty("iat")) {
        validSince = fb.util.obj.get(claims, "iat");
      }
    }
    if (claims.hasOwnProperty("exp")) {
      validUntil = fb.util.obj.get(claims, "exp");
    } else {
      validUntil = validSince + 86400;
    }
  }
  return now && validSince && validUntil && now >= validSince && now <= validUntil;
};
fb.util.jwt.issuedAtTime = function(token) {
  var claims = fb.util.jwt.decode(token).claims;
  if (typeof claims === "object" && claims.hasOwnProperty("iat")) {
    return fb.util.obj.get(claims, "iat");
  }
  return null;
};
fb.util.jwt.isValidFormat = function(token) {
  var decoded = fb.util.jwt.decode(token), claims = decoded.claims;
  return!!decoded.signature && !!claims && typeof claims === "object" && claims.hasOwnProperty("iat");
};
fb.util.jwt.isAdmin = function(token) {
  var claims = fb.util.jwt.decode(token).claims;
  return typeof claims === "object" && fb.util.obj.get(claims, "admin") === true;
};
goog.provide("fb.core.view.EventGenerator");
goog.require("fb.core.snap.NamedNode");
goog.require("fb.core.util");
fb.core.view.EventGenerator = function(query) {
  this.query_ = query;
  this.index_ = query.getQueryParams().getIndex();
};
fb.core.view.EventGenerator.prototype.generateEventsForChanges = function(changes, eventCache, eventRegistrations) {
  var events = [], self = this;
  var moves = [];
  goog.array.forEach(changes, function(change) {
    if (change.type === fb.core.view.Change.CHILD_CHANGED && self.index_.indexedValueChanged((change.oldSnap), change.snapshotNode)) {
      moves.push(fb.core.view.Change.childMovedChange((change.childName), change.snapshotNode));
    }
  });
  this.generateEventsForType_(events, fb.core.view.Change.CHILD_REMOVED, changes, eventRegistrations, eventCache);
  this.generateEventsForType_(events, fb.core.view.Change.CHILD_ADDED, changes, eventRegistrations, eventCache);
  this.generateEventsForType_(events, fb.core.view.Change.CHILD_MOVED, moves, eventRegistrations, eventCache);
  this.generateEventsForType_(events, fb.core.view.Change.CHILD_CHANGED, changes, eventRegistrations, eventCache);
  this.generateEventsForType_(events, fb.core.view.Change.VALUE, changes, eventRegistrations, eventCache);
  return events;
};
fb.core.view.EventGenerator.prototype.generateEventsForType_ = function(events, eventType, changes, registrations, eventCache) {
  var filteredChanges = goog.array.filter(changes, function(change) {
    return change.type === eventType;
  });
  var self = this;
  goog.array.sort(filteredChanges, goog.bind(this.compareChanges_, this));
  goog.array.forEach(filteredChanges, function(change) {
    var materializedChange = self.materializeSingleChange_(change, eventCache);
    goog.array.forEach(registrations, function(registration) {
      if (registration.respondsTo(change.type)) {
        events.push(registration.createEvent(materializedChange, self.query_));
      }
    });
  });
};
fb.core.view.EventGenerator.prototype.materializeSingleChange_ = function(change, eventCache) {
  if (change.type === "value" || change.type === "child_removed") {
    return change;
  } else {
    change.prevName = eventCache.getPredecessorChildName((change.childName), change.snapshotNode, this.index_);
    return change;
  }
};
fb.core.view.EventGenerator.prototype.compareChanges_ = function(a, b) {
  if (a.childName == null || b.childName == null) {
    throw fb.core.util.assertionError("Should only compare child_ events.");
  }
  var aWrapped = new fb.core.snap.NamedNode(a.childName, a.snapshotNode);
  var bWrapped = new fb.core.snap.NamedNode(b.childName, b.snapshotNode);
  return this.index_.compare(aWrapped, bWrapped);
};
goog.provide("fb.core.view.ChildChangeAccumulator");
goog.require("fb.core.util");
fb.core.view.ChildChangeAccumulator = function() {
  this.changeMap_ = {};
};
fb.core.view.ChildChangeAccumulator.prototype.trackChildChange = function(change) {
  var Change = fb.core.view.Change;
  var type = change.type;
  var childKey = (change.childName);
  fb.core.util.assert(type == fb.core.view.Change.CHILD_ADDED || type == fb.core.view.Change.CHILD_CHANGED || type == fb.core.view.Change.CHILD_REMOVED, "Only child changes supported for tracking");
  fb.core.util.assert(childKey !== ".priority", "Only non-priority child changes can be tracked.");
  var oldChange = fb.util.obj.get(this.changeMap_, childKey);
  if (oldChange) {
    var oldType = oldChange.type;
    if (type == Change.CHILD_ADDED && oldType == Change.CHILD_REMOVED) {
      this.changeMap_[childKey] = Change.childChangedChange(childKey, change.snapshotNode, oldChange.snapshotNode);
    } else {
      if (type == Change.CHILD_REMOVED && oldType == Change.CHILD_ADDED) {
        delete this.changeMap_[childKey];
      } else {
        if (type == Change.CHILD_REMOVED && oldType == Change.CHILD_CHANGED) {
          this.changeMap_[childKey] = Change.childRemovedChange(childKey, (oldChange.oldSnap));
        } else {
          if (type == Change.CHILD_CHANGED && oldType == Change.CHILD_ADDED) {
            this.changeMap_[childKey] = Change.childAddedChange(childKey, change.snapshotNode);
          } else {
            if (type == Change.CHILD_CHANGED && oldType == Change.CHILD_CHANGED) {
              this.changeMap_[childKey] = Change.childChangedChange(childKey, change.snapshotNode, (oldChange.oldSnap));
            } else {
              throw fb.core.util.assertionError("Illegal combination of changes: " + change + " occurred after " + oldChange);
            }
          }
        }
      }
    }
  } else {
    this.changeMap_[childKey] = change;
  }
};
fb.core.view.ChildChangeAccumulator.prototype.getChanges = function() {
  return goog.object.getValues(this.changeMap_);
};
goog.provide("fb.core.view.EventRegistration");
goog.require("fb.core.view.Change");
goog.require("fb.core.view.Event");
goog.require("fb.core.util");
fb.core.view.EventRegistration = function() {
};
fb.core.view.EventRegistration.prototype.respondsTo;
fb.core.view.EventRegistration.prototype.createEvent;
fb.core.view.EventRegistration.prototype.getEventRunner;
fb.core.view.EventRegistration.prototype.createCancelEvent;
fb.core.view.EventRegistration.prototype.matches;
fb.core.view.EventRegistration.prototype.hasAnyCallback;
fb.core.view.ValueEventRegistration = function(callback, cancelCallback, context) {
  this.callback_ = callback;
  this.cancelCallback_ = cancelCallback;
  this.context_ = context || null;
};
fb.core.view.ValueEventRegistration.prototype.respondsTo = function(eventType) {
  return eventType === "value";
};
fb.core.view.ValueEventRegistration.prototype.createEvent = function(change, query) {
  var index = query.getQueryParams().getIndex();
  return new fb.core.view.DataEvent("value", this, new fb.api.DataSnapshot(change.snapshotNode, query.ref(), index));
};
fb.core.view.ValueEventRegistration.prototype.getEventRunner = function(eventData) {
  var ctx = this.context_;
  if (eventData.getEventType() === "cancel") {
    fb.core.util.assert(this.cancelCallback_, "Raising a cancel event on a listener with no cancel callback");
    var cancelCB = this.cancelCallback_;
    return function() {
      cancelCB.call(ctx, eventData.error);
    };
  } else {
    var cb = this.callback_;
    return function() {
      cb.call(ctx, eventData.snapshot);
    };
  }
};
fb.core.view.ValueEventRegistration.prototype.createCancelEvent = function(error, path) {
  if (this.cancelCallback_) {
    return new fb.core.view.CancelEvent(this, error, path);
  } else {
    return null;
  }
};
fb.core.view.ValueEventRegistration.prototype.matches = function(other) {
  if (!(other instanceof fb.core.view.ValueEventRegistration)) {
    return false;
  } else {
    if (!other.callback_ || !this.callback_) {
      return true;
    } else {
      return other.callback_ === this.callback_ && other.context_ === this.context_;
    }
  }
};
fb.core.view.ValueEventRegistration.prototype.hasAnyCallback = function() {
  return this.callback_ !== null;
};
fb.core.view.ChildEventRegistration = function(callbacks, cancelCallback, context) {
  this.callbacks_ = callbacks;
  this.cancelCallback_ = cancelCallback;
  this.context_ = context;
};
fb.core.view.ChildEventRegistration.prototype.respondsTo = function(eventType) {
  var eventToCheck = eventType === "children_added" ? "child_added" : eventType;
  eventToCheck = eventToCheck === "children_removed" ? "child_removed" : eventToCheck;
  return goog.object.containsKey(this.callbacks_, eventToCheck);
};
fb.core.view.ChildEventRegistration.prototype.createCancelEvent = function(error, path) {
  if (this.cancelCallback_) {
    return new fb.core.view.CancelEvent(this, error, path);
  } else {
    return null;
  }
};
fb.core.view.ChildEventRegistration.prototype.createEvent = function(change, query) {
  fb.core.util.assert(change.childName != null, "Child events should have a childName.");
  var ref = query.ref().child((change.childName));
  var index = query.getQueryParams().getIndex();
  return new fb.core.view.DataEvent(change.type, this, new fb.api.DataSnapshot(change.snapshotNode, ref, index), change.prevName);
};
fb.core.view.ChildEventRegistration.prototype.getEventRunner = function(eventData) {
  var ctx = this.context_;
  if (eventData.getEventType() === "cancel") {
    fb.core.util.assert(this.cancelCallback_, "Raising a cancel event on a listener with no cancel callback");
    var cancelCB = this.cancelCallback_;
    return function() {
      cancelCB.call(ctx, eventData.error);
    };
  } else {
    var cb = this.callbacks_[eventData.eventType];
    return function() {
      cb.call(ctx, eventData.snapshot, eventData.prevName);
    };
  }
};
fb.core.view.ChildEventRegistration.prototype.matches = function(other) {
  if (other instanceof fb.core.view.ChildEventRegistration) {
    if (!this.callbacks_ || !other.callbacks_) {
      return true;
    } else {
      if (this.context_ === other.context_) {
        var otherCount = goog.object.getCount(other.callbacks_);
        var thisCount = goog.object.getCount(this.callbacks_);
        if (otherCount === thisCount) {
          if (otherCount === 1) {
            var otherKey = (goog.object.getAnyKey(other.callbacks_));
            var thisKey = (goog.object.getAnyKey(this.callbacks_));
            return thisKey === otherKey && (!other.callbacks_[otherKey] || !this.callbacks_[thisKey] || other.callbacks_[otherKey] === this.callbacks_[thisKey]);
          } else {
            return goog.object.every(this.callbacks_, function(cb, eventType) {
              return other.callbacks_[eventType] === cb;
            });
          }
        }
      }
    }
  }
  return false;
};
fb.core.view.ChildEventRegistration.prototype.hasAnyCallback = function() {
  return this.callbacks_ !== null;
};
goog.provide("fb.core.view.filter.IndexedFilter");
goog.require("fb.core.util");
fb.core.view.filter.IndexedFilter = function(index) {
  this.index_ = index;
};
fb.core.view.filter.IndexedFilter.prototype.updateChild = function(snap, key, newChild, source, optChangeAccumulator) {
  var Change = fb.core.view.Change;
  fb.core.util.assert(snap.isIndexed(this.index_), "A node must be indexed if only a child is updated");
  var oldChild = snap.getImmediateChild(key);
  if (oldChild.equals(newChild)) {
    return snap;
  }
  if (optChangeAccumulator != null) {
    if (newChild.isEmpty()) {
      if (snap.hasChild(key)) {
        optChangeAccumulator.trackChildChange(Change.childRemovedChange(key, oldChild));
      } else {
        fb.core.util.assert(snap.isLeafNode(), "A child remove without an old child only makes sense on a leaf node");
      }
    } else {
      if (oldChild.isEmpty()) {
        optChangeAccumulator.trackChildChange(Change.childAddedChange(key, newChild));
      } else {
        optChangeAccumulator.trackChildChange(Change.childChangedChange(key, newChild, oldChild));
      }
    }
  }
  if (snap.isLeafNode() && newChild.isEmpty()) {
    return snap;
  } else {
    return snap.updateImmediateChild(key, newChild).withIndex(this.index_);
  }
};
fb.core.view.filter.IndexedFilter.prototype.updateFullNode = function(oldSnap, newSnap, optChangeAccumulator) {
  var Change = fb.core.view.Change;
  if (optChangeAccumulator != null) {
    if (!oldSnap.isLeafNode()) {
      oldSnap.forEachChild(fb.core.snap.PriorityIndex, function(key, childNode) {
        if (!newSnap.hasChild(key)) {
          optChangeAccumulator.trackChildChange(Change.childRemovedChange(key, childNode));
        }
      });
    }
    if (!newSnap.isLeafNode()) {
      newSnap.forEachChild(fb.core.snap.PriorityIndex, function(key, childNode) {
        if (oldSnap.hasChild(key)) {
          var oldChild = oldSnap.getImmediateChild(key);
          if (!oldChild.equals(childNode)) {
            optChangeAccumulator.trackChildChange(Change.childChangedChange(key, childNode, oldChild));
          }
        } else {
          optChangeAccumulator.trackChildChange(Change.childAddedChange(key, childNode));
        }
      });
    }
  }
  return newSnap.withIndex(this.index_);
};
fb.core.view.filter.IndexedFilter.prototype.updatePriority = function(oldSnap, newPriority) {
  if (oldSnap.isEmpty()) {
    return fb.core.snap.EMPTY_NODE;
  } else {
    return oldSnap.updatePriority(newPriority);
  }
};
fb.core.view.filter.IndexedFilter.prototype.filtersNodes = function() {
  return false;
};
fb.core.view.filter.IndexedFilter.prototype.getIndexedFilter = function() {
  return this;
};
fb.core.view.filter.IndexedFilter.prototype.getIndex = function() {
  return this.index_;
};
goog.provide("fb.core.view.filter.RangedFilter");
goog.require("fb.core.view.filter.IndexedFilter");
fb.core.view.filter.RangedFilter = function(params) {
  this.indexedFilter_ = new fb.core.view.filter.IndexedFilter(params.getIndex());
  this.index_ = params.getIndex();
  this.startPost_ = this.getStartPost_(params);
  this.endPost_ = this.getEndPost_(params);
};
fb.core.view.filter.RangedFilter.prototype.getStartPost = function() {
  return this.startPost_;
};
fb.core.view.filter.RangedFilter.prototype.getEndPost = function() {
  return this.endPost_;
};
fb.core.view.filter.RangedFilter.prototype.matches = function(node) {
  return this.index_.compare(this.getStartPost(), node) <= 0 && this.index_.compare(node, this.getEndPost()) <= 0;
};
fb.core.view.filter.RangedFilter.prototype.updateChild = function(snap, key, newChild, source, optChangeAccumulator) {
  if (!this.matches(new fb.core.snap.NamedNode(key, newChild))) {
    newChild = fb.core.snap.EMPTY_NODE;
  }
  return this.indexedFilter_.updateChild(snap, key, newChild, source, optChangeAccumulator);
};
fb.core.view.filter.RangedFilter.prototype.updateFullNode = function(oldSnap, newSnap, optChangeAccumulator) {
  if (newSnap.isLeafNode()) {
    newSnap = fb.core.snap.EMPTY_NODE;
  }
  var filtered = newSnap.withIndex(this.index_);
  filtered = filtered.updatePriority(fb.core.snap.EMPTY_NODE);
  var self = this;
  newSnap.forEachChild(fb.core.snap.PriorityIndex, function(key, childNode) {
    if (!self.matches(new fb.core.snap.NamedNode(key, childNode))) {
      filtered = filtered.updateImmediateChild(key, fb.core.snap.EMPTY_NODE);
    }
  });
  return this.indexedFilter_.updateFullNode(oldSnap, filtered, optChangeAccumulator);
};
fb.core.view.filter.RangedFilter.prototype.updatePriority = function(oldSnap, newPriority) {
  return oldSnap;
};
fb.core.view.filter.RangedFilter.prototype.filtersNodes = function() {
  return true;
};
fb.core.view.filter.RangedFilter.prototype.getIndexedFilter = function() {
  return this.indexedFilter_;
};
fb.core.view.filter.RangedFilter.prototype.getIndex = function() {
  return this.index_;
};
fb.core.view.filter.RangedFilter.prototype.getStartPost_ = function(params) {
  if (params.hasStart()) {
    var startName = params.getIndexStartName();
    return params.getIndex().makePost(params.getIndexStartValue(), startName);
  } else {
    return params.getIndex().minPost();
  }
};
fb.core.view.filter.RangedFilter.prototype.getEndPost_ = function(params) {
  if (params.hasEnd()) {
    var endName = params.getIndexEndName();
    return params.getIndex().makePost(params.getIndexEndValue(), endName);
  } else {
    return params.getIndex().maxPost();
  }
};
goog.provide("fb.core.view.filter.NodeFilter");
goog.require("fb.core.view.ChildChangeAccumulator");
goog.require("fb.core.view.CompleteChildSource");
fb.core.view.filter.NodeFilter = function() {
};
fb.core.view.filter.NodeFilter.prototype.updateChild = function(snap, key, newChild, source, optChangeAccumulator) {
};
fb.core.view.filter.NodeFilter.prototype.updateFullNode = function(oldSnap, newSnap, optChangeAccumulator) {
};
fb.core.view.filter.NodeFilter.prototype.updatePriority = function(oldSnap, newPriority) {
};
fb.core.view.filter.NodeFilter.prototype.filtersNodes = function() {
};
fb.core.view.filter.NodeFilter.prototype.getIndexedFilter = function() {
};
fb.core.view.filter.NodeFilter.prototype.getIndex = function() {
};
goog.provide("fb.core.view.filter.LimitedFilter");
goog.require("fb.core.snap.NamedNode");
goog.require("fb.core.view.filter.RangedFilter");
goog.require("fb.core.util");
fb.core.view.filter.LimitedFilter = function(params) {
  this.rangedFilter_ = new fb.core.view.filter.RangedFilter(params);
  this.index_ = params.getIndex();
  this.limit_ = params.getLimit();
  this.reverse_ = !params.isViewFromLeft();
};
fb.core.view.filter.LimitedFilter.prototype.updateChild = function(snap, key, newChild, source, optChangeAccumulator) {
  if (!this.rangedFilter_.matches(new fb.core.snap.NamedNode(key, newChild))) {
    newChild = fb.core.snap.EMPTY_NODE;
  }
  if (snap.getImmediateChild(key).equals(newChild)) {
    return snap;
  } else {
    if (snap.numChildren() < this.limit_) {
      return this.rangedFilter_.getIndexedFilter().updateChild(snap, key, newChild, source, optChangeAccumulator);
    } else {
      return this.fullLimitUpdateChild_(snap, key, newChild, source, optChangeAccumulator);
    }
  }
};
fb.core.view.filter.LimitedFilter.prototype.updateFullNode = function(oldSnap, newSnap, optChangeAccumulator) {
  var filtered;
  if (newSnap.isLeafNode() || newSnap.isEmpty()) {
    filtered = fb.core.snap.EMPTY_NODE.withIndex(this.index_);
  } else {
    if (this.limit_ * 2 < newSnap.numChildren() && newSnap.isIndexed(this.index_)) {
      filtered = fb.core.snap.EMPTY_NODE.withIndex(this.index_);
      var iterator;
      newSnap = (newSnap);
      if (this.reverse_) {
        iterator = newSnap.getReverseIteratorFrom(this.rangedFilter_.getEndPost(), this.index_);
      } else {
        iterator = newSnap.getIteratorFrom(this.rangedFilter_.getStartPost(), this.index_);
      }
      var count = 0;
      while (iterator.hasNext() && count < this.limit_) {
        var next = iterator.getNext();
        var inRange;
        if (this.reverse_) {
          inRange = this.index_.compare(this.rangedFilter_.getStartPost(), next) <= 0;
        } else {
          inRange = this.index_.compare(next, this.rangedFilter_.getEndPost()) <= 0;
        }
        if (inRange) {
          filtered = filtered.updateImmediateChild(next.name, next.node);
          count++;
        } else {
          break;
        }
      }
    } else {
      filtered = newSnap.withIndex(this.index_);
      filtered = (filtered.updatePriority(fb.core.snap.EMPTY_NODE));
      var startPost;
      var endPost;
      var cmp;
      if (this.reverse_) {
        iterator = filtered.getReverseIterator(this.index_);
        startPost = this.rangedFilter_.getEndPost();
        endPost = this.rangedFilter_.getStartPost();
        var indexCompare = this.index_.getCompare();
        cmp = function(a, b) {
          return indexCompare(b, a);
        };
      } else {
        iterator = filtered.getIterator(this.index_);
        startPost = this.rangedFilter_.getStartPost();
        endPost = this.rangedFilter_.getEndPost();
        cmp = this.index_.getCompare();
      }
      count = 0;
      var foundStartPost = false;
      while (iterator.hasNext()) {
        next = iterator.getNext();
        if (!foundStartPost && cmp(startPost, next) <= 0) {
          foundStartPost = true;
        }
        inRange = foundStartPost && count < this.limit_ && cmp(next, endPost) <= 0;
        if (inRange) {
          count++;
        } else {
          filtered = filtered.updateImmediateChild(next.name, fb.core.snap.EMPTY_NODE);
        }
      }
    }
  }
  return this.rangedFilter_.getIndexedFilter().updateFullNode(oldSnap, filtered, optChangeAccumulator);
};
fb.core.view.filter.LimitedFilter.prototype.updatePriority = function(oldSnap, newPriority) {
  return oldSnap;
};
fb.core.view.filter.LimitedFilter.prototype.filtersNodes = function() {
  return true;
};
fb.core.view.filter.LimitedFilter.prototype.getIndexedFilter = function() {
  return this.rangedFilter_.getIndexedFilter();
};
fb.core.view.filter.LimitedFilter.prototype.getIndex = function() {
  return this.index_;
};
fb.core.view.filter.LimitedFilter.prototype.fullLimitUpdateChild_ = function(snap, childKey, childSnap, source, optChangeAccumulator) {
  var Change = fb.core.view.Change;
  var cmp;
  if (this.reverse_) {
    var indexCmp = this.index_.getCompare();
    cmp = function(a, b) {
      return indexCmp(b, a);
    };
  } else {
    cmp = this.index_.getCompare();
  }
  var oldEventCache = (snap);
  fb.core.util.assert(oldEventCache.numChildren() == this.limit_, "");
  var newChildNamedNode = new fb.core.snap.NamedNode(childKey, childSnap);
  var windowBoundary = (this.reverse_ ? oldEventCache.getFirstChild(this.index_) : oldEventCache.getLastChild(this.index_));
  var inRange = this.rangedFilter_.matches(newChildNamedNode);
  if (oldEventCache.hasChild(childKey)) {
    var oldChildSnap = oldEventCache.getImmediateChild(childKey);
    var nextChild = source.getChildAfterChild(this.index_, windowBoundary, this.reverse_);
    if (nextChild != null && nextChild.name == childKey) {
      nextChild = source.getChildAfterChild(this.index_, nextChild, this.reverse_);
    }
    var compareNext = nextChild == null ? 1 : cmp(nextChild, newChildNamedNode);
    var remainsInWindow = inRange && !childSnap.isEmpty() && compareNext >= 0;
    if (remainsInWindow) {
      if (optChangeAccumulator != null) {
        optChangeAccumulator.trackChildChange(Change.childChangedChange(childKey, childSnap, oldChildSnap));
      }
      return oldEventCache.updateImmediateChild(childKey, childSnap);
    } else {
      if (optChangeAccumulator != null) {
        optChangeAccumulator.trackChildChange(Change.childRemovedChange(childKey, oldChildSnap));
      }
      var newEventCache = oldEventCache.updateImmediateChild(childKey, fb.core.snap.EMPTY_NODE);
      var nextChildInRange = nextChild != null && this.rangedFilter_.matches(nextChild);
      if (nextChildInRange) {
        if (optChangeAccumulator != null) {
          optChangeAccumulator.trackChildChange(Change.childAddedChange(nextChild.name, nextChild.node));
        }
        return newEventCache.updateImmediateChild(nextChild.name, nextChild.node);
      } else {
        return newEventCache;
      }
    }
  } else {
    if (childSnap.isEmpty()) {
      return snap;
    } else {
      if (inRange) {
        if (cmp(windowBoundary, newChildNamedNode) >= 0) {
          if (optChangeAccumulator != null) {
            optChangeAccumulator.trackChildChange(Change.childRemovedChange(windowBoundary.name, windowBoundary.node));
            optChangeAccumulator.trackChildChange(Change.childAddedChange(childKey, childSnap));
          }
          return oldEventCache.updateImmediateChild(childKey, childSnap).updateImmediateChild(windowBoundary.name, fb.core.snap.EMPTY_NODE);
        } else {
          return snap;
        }
      } else {
        return snap;
      }
    }
  }
};
goog.provide("fb.core.view.ViewProcessor");
goog.require("fb.core.view.CompleteChildSource");
goog.require("fb.core.util");
fb.core.view.ProcessorResult = function(viewCache, changes) {
  this.viewCache = viewCache;
  this.changes = changes;
};
fb.core.view.ViewProcessor = function(filter) {
  this.filter_ = filter;
};
fb.core.view.ViewProcessor.prototype.assertIndexed = function(viewCache) {
  fb.core.util.assert(viewCache.getEventCache().getNode().isIndexed(this.filter_.getIndex()), "Event snap not indexed");
  fb.core.util.assert(viewCache.getServerCache().getNode().isIndexed(this.filter_.getIndex()), "Server snap not indexed");
};
fb.core.view.ViewProcessor.prototype.applyOperation = function(oldViewCache, operation, writesCache, optCompleteCache) {
  var accumulator = new fb.core.view.ChildChangeAccumulator;
  var newViewCache, constrainNode;
  if (operation.type === fb.core.OperationType.OVERWRITE) {
    var overwrite = (operation);
    if (overwrite.source.fromUser) {
      newViewCache = this.applyUserOverwrite_(oldViewCache, overwrite.path, overwrite.snap, writesCache, optCompleteCache, accumulator);
    } else {
      fb.core.util.assert(overwrite.source.fromServer, "Unknown source.");
      constrainNode = overwrite.source.tagged;
      newViewCache = this.applyServerOverwrite_(oldViewCache, overwrite.path, overwrite.snap, writesCache, optCompleteCache, constrainNode, accumulator);
    }
  } else {
    if (operation.type === fb.core.OperationType.MERGE) {
      var merge = (operation);
      if (merge.source.fromUser) {
        newViewCache = this.applyUserMerge_(oldViewCache, merge.path, merge.children, writesCache, optCompleteCache, accumulator);
      } else {
        fb.core.util.assert(merge.source.fromServer, "Unknown source.");
        constrainNode = merge.source.tagged;
        newViewCache = this.applyServerMerge_(oldViewCache, merge.path, merge.children, writesCache, optCompleteCache, constrainNode, accumulator);
      }
    } else {
      if (operation.type === fb.core.OperationType.ACK_USER_WRITE) {
        var ackUserWrite = (operation);
        if (!ackUserWrite.revert) {
          newViewCache = this.ackUserWrite_(oldViewCache, ackUserWrite.path, writesCache, optCompleteCache, accumulator);
        } else {
          newViewCache = this.revertUserWrite_(oldViewCache, ackUserWrite.path, writesCache, optCompleteCache, accumulator);
        }
      } else {
        if (operation.type === fb.core.OperationType.LISTEN_COMPLETE) {
          newViewCache = this.listenComplete_(oldViewCache, operation.path, writesCache, optCompleteCache, accumulator);
        } else {
          throw fb.core.util.assertionError("Unknown operation type: " + operation.type);
        }
      }
    }
  }
  var changes = accumulator.getChanges();
  this.maybeAddValueEvent_(oldViewCache, newViewCache, changes);
  return new fb.core.view.ProcessorResult(newViewCache, changes);
};
fb.core.view.ViewProcessor.prototype.maybeAddValueEvent_ = function(oldViewCache, newViewCache, accumulator) {
  var eventSnap = newViewCache.getEventCache();
  if (eventSnap.isFullyInitialized()) {
    var isLeafOrEmpty = eventSnap.getNode().isLeafNode() || eventSnap.getNode().isEmpty();
    var oldCompleteSnap = oldViewCache.getCompleteEventSnap();
    if (accumulator.length > 0 || !oldViewCache.getEventCache().isFullyInitialized() || isLeafOrEmpty && !eventSnap.getNode().equals((oldCompleteSnap)) || !eventSnap.getNode().getPriority().equals(oldCompleteSnap.getPriority())) {
      accumulator.push(fb.core.view.Change.valueChange((newViewCache.getCompleteEventSnap())));
    }
  }
};
fb.core.view.ViewProcessor.prototype.generateEventCacheAfterServerEvent_ = function(viewCache, changePath, writesCache, source, accumulator) {
  var oldEventSnap = viewCache.getEventCache();
  if (writesCache.shadowingWrite(changePath) != null) {
    return viewCache;
  } else {
    var newEventCache, serverNode;
    if (changePath.isEmpty()) {
      fb.core.util.assert(viewCache.getServerCache().isFullyInitialized(), "If change path is empty, we must have complete server data");
      if (viewCache.getServerCache().isFiltered()) {
        var serverCache = viewCache.getCompleteServerSnap();
        var completeChildren = serverCache instanceof fb.core.snap.ChildrenNode ? serverCache : fb.core.snap.EMPTY_NODE;
        var completeEventChildren = writesCache.calcCompleteEventChildren(completeChildren);
        newEventCache = this.filter_.updateFullNode(viewCache.getEventCache().getNode(), completeEventChildren, accumulator);
      } else {
        var completeNode = (writesCache.calcCompleteEventCache(viewCache.getCompleteServerSnap()));
        newEventCache = this.filter_.updateFullNode(viewCache.getEventCache().getNode(), completeNode, accumulator);
      }
    } else {
      var childKey = changePath.getFront();
      if (childKey == ".priority") {
        fb.core.util.assert(changePath.getLength() == 1, "Can't have a priority with additional path components");
        var oldEventNode = oldEventSnap.getNode();
        serverNode = viewCache.getServerCache().getNode();
        var updatedPriority = writesCache.calcEventCacheAfterServerOverwrite(changePath, oldEventNode, serverNode);
        if (updatedPriority != null) {
          newEventCache = this.filter_.updatePriority(oldEventNode, updatedPriority);
        } else {
          newEventCache = oldEventSnap.getNode();
        }
      } else {
        var childChangePath = changePath.popFront();
        var newEventChild;
        if (oldEventSnap.isCompleteForChild(childKey)) {
          serverNode = viewCache.getServerCache().getNode();
          var eventChildUpdate = writesCache.calcEventCacheAfterServerOverwrite(changePath, oldEventSnap.getNode(), serverNode);
          if (eventChildUpdate != null) {
            newEventChild = oldEventSnap.getNode().getImmediateChild(childKey).updateChild(childChangePath, eventChildUpdate);
          } else {
            newEventChild = oldEventSnap.getNode().getImmediateChild(childKey);
          }
        } else {
          newEventChild = writesCache.calcCompleteChild(childKey, viewCache.getServerCache());
        }
        if (newEventChild != null) {
          newEventCache = this.filter_.updateChild(oldEventSnap.getNode(), childKey, newEventChild, source, accumulator);
        } else {
          newEventCache = oldEventSnap.getNode();
        }
      }
    }
    return viewCache.updateEventSnap(newEventCache, oldEventSnap.isFullyInitialized() || changePath.isEmpty(), this.filter_.filtersNodes());
  }
};
fb.core.view.ViewProcessor.prototype.applyServerOverwrite_ = function(oldViewCache, changePath, changedSnap, writesCache, optCompleteCache, constrainServerNode, accumulator) {
  var oldServerSnap = oldViewCache.getServerCache();
  var newServerCache;
  var serverFilter = constrainServerNode ? this.filter_ : this.filter_.getIndexedFilter();
  if (changePath.isEmpty()) {
    newServerCache = serverFilter.updateFullNode(oldServerSnap.getNode(), changedSnap, null);
  } else {
    if (serverFilter.filtersNodes() && !oldServerSnap.isFiltered()) {
      var newServerNode = oldServerSnap.getNode().updateChild(changePath, changedSnap);
      newServerCache = serverFilter.updateFullNode(oldServerSnap.getNode(), newServerNode, null);
    } else {
      var childKey = changePath.getFront();
      if (!oldServerSnap.isCompleteForPath(changePath) && changePath.getLength() > 1) {
        return oldViewCache;
      }
      var childNode = oldServerSnap.getNode().getImmediateChild(childKey);
      var newChildNode = childNode.updateChild(changePath.popFront(), changedSnap);
      if (childKey == ".priority") {
        newServerCache = serverFilter.updatePriority(oldServerSnap.getNode(), newChildNode);
      } else {
        newServerCache = serverFilter.updateChild(oldServerSnap.getNode(), childKey, newChildNode, fb.core.view.NO_COMPLETE_CHILD_SOURCE, null);
      }
    }
  }
  var newViewCache = oldViewCache.updateServerSnap(newServerCache, oldServerSnap.isFullyInitialized() || changePath.isEmpty(), serverFilter.filtersNodes());
  var source = new fb.core.view.WriteTreeCompleteChildSource(writesCache, newViewCache, optCompleteCache);
  return this.generateEventCacheAfterServerEvent_(newViewCache, changePath, writesCache, source, accumulator);
};
fb.core.view.ViewProcessor.prototype.applyUserOverwrite_ = function(oldViewCache, changePath, changedSnap, writesCache, optCompleteCache, accumulator) {
  var oldEventSnap = oldViewCache.getEventCache();
  var newViewCache, newEventCache;
  var source = new fb.core.view.WriteTreeCompleteChildSource(writesCache, oldViewCache, optCompleteCache);
  if (changePath.isEmpty()) {
    newEventCache = this.filter_.updateFullNode(oldViewCache.getEventCache().getNode(), changedSnap, accumulator);
    newViewCache = oldViewCache.updateEventSnap(newEventCache, true, this.filter_.filtersNodes());
  } else {
    var childKey = changePath.getFront();
    if (childKey === ".priority") {
      newEventCache = this.filter_.updatePriority(oldViewCache.getEventCache().getNode(), changedSnap);
      newViewCache = oldViewCache.updateEventSnap(newEventCache, oldEventSnap.isFullyInitialized(), oldEventSnap.isFiltered());
    } else {
      var childChangePath = changePath.popFront();
      var oldChild = oldEventSnap.getNode().getImmediateChild(childKey);
      var newChild;
      if (childChangePath.isEmpty()) {
        newChild = changedSnap;
      } else {
        var childNode = source.getCompleteChild(childKey);
        if (childNode != null) {
          if (childChangePath.getBack() === ".priority" && childNode.getChild((childChangePath.parent())).isEmpty()) {
            newChild = childNode;
          } else {
            newChild = childNode.updateChild(childChangePath, changedSnap);
          }
        } else {
          newChild = fb.core.snap.EMPTY_NODE;
        }
      }
      if (!oldChild.equals(newChild)) {
        var newEventSnap = this.filter_.updateChild(oldEventSnap.getNode(), childKey, newChild, source, accumulator);
        newViewCache = oldViewCache.updateEventSnap(newEventSnap, oldEventSnap.isFullyInitialized(), this.filter_.filtersNodes());
      } else {
        newViewCache = oldViewCache;
      }
    }
  }
  return newViewCache;
};
fb.core.view.ViewProcessor.cacheHasChild_ = function(viewCache, childKey) {
  return viewCache.getEventCache().isCompleteForChild(childKey);
};
fb.core.view.ViewProcessor.prototype.applyUserMerge_ = function(viewCache, path, changedChildren, writesCache, serverCache, accumulator) {
  var self = this;
  var curViewCache = viewCache;
  changedChildren.foreach(function(relativePath, childNode) {
    var writePath = path.child(relativePath);
    if (fb.core.view.ViewProcessor.cacheHasChild_(viewCache, writePath.getFront())) {
      curViewCache = self.applyUserOverwrite_(curViewCache, writePath, childNode, writesCache, serverCache, accumulator);
    }
  });
  changedChildren.foreach(function(relativePath, childNode) {
    var writePath = path.child(relativePath);
    if (!fb.core.view.ViewProcessor.cacheHasChild_(viewCache, writePath.getFront())) {
      curViewCache = self.applyUserOverwrite_(curViewCache, writePath, childNode, writesCache, serverCache, accumulator);
    }
  });
  return curViewCache;
};
fb.core.view.ViewProcessor.prototype.applyMerge_ = function(node, merge) {
  merge.foreach(function(relativePath, childNode) {
    node = node.updateChild(relativePath, childNode);
  });
  return node;
};
fb.core.view.ViewProcessor.prototype.applyServerMerge_ = function(viewCache, path, changedChildren, writesCache, serverCache, constrainServerNode, accumulator) {
  if (viewCache.getServerCache().getNode().isEmpty() && !viewCache.getServerCache().isFullyInitialized()) {
    return viewCache;
  }
  var curViewCache = viewCache;
  var viewMergeTree;
  if (path.isEmpty()) {
    viewMergeTree = changedChildren;
  } else {
    viewMergeTree = fb.core.util.ImmutableTree.Empty.setTree(path, changedChildren);
  }
  var serverNode = viewCache.getServerCache().getNode();
  var self = this;
  viewMergeTree.children.inorderTraversal(function(childKey, childTree) {
    if (serverNode.hasChild(childKey)) {
      var serverChild = viewCache.getServerCache().getNode().getImmediateChild(childKey);
      var newChild = self.applyMerge_(serverChild, childTree);
      curViewCache = self.applyServerOverwrite_(curViewCache, new fb.core.util.Path(childKey), newChild, writesCache, serverCache, constrainServerNode, accumulator);
    }
  });
  viewMergeTree.children.inorderTraversal(function(childKey, childMergeTree) {
    var isUnknownDeepMerge = !viewCache.getServerCache().isFullyInitialized() && childMergeTree.value == null;
    if (!serverNode.hasChild(childKey) && !isUnknownDeepMerge) {
      var serverChild = viewCache.getServerCache().getNode().getImmediateChild(childKey);
      var newChild = self.applyMerge_(serverChild, childMergeTree);
      curViewCache = self.applyServerOverwrite_(curViewCache, new fb.core.util.Path(childKey), newChild, writesCache, serverCache, constrainServerNode, accumulator);
    }
  });
  return curViewCache;
};
fb.core.view.ViewProcessor.prototype.ackUserWrite_ = function(viewCache, ackPath, writesCache, optCompleteCache, accumulator) {
  if (writesCache.shadowingWrite(ackPath) != null) {
    return viewCache;
  } else {
    var source = new fb.core.view.WriteTreeCompleteChildSource(writesCache, viewCache, optCompleteCache);
    var oldEventCache = viewCache.getEventCache().getNode();
    var newEventCache = oldEventCache;
    var eventCacheComplete;
    if (viewCache.getServerCache().isFullyInitialized()) {
      if (ackPath.isEmpty()) {
        var update = (writesCache.calcCompleteEventCache(viewCache.getCompleteServerSnap()));
        newEventCache = this.filter_.updateFullNode(viewCache.getEventCache().getNode(), update, accumulator);
      } else {
        if (ackPath.getFront() === ".priority") {
          var updatedPriority = writesCache.calcCompleteChild(ackPath.getFront(), viewCache.getServerCache());
          if (updatedPriority != null && !oldEventCache.isEmpty() && !oldEventCache.getPriority().equals(updatedPriority)) {
            newEventCache = this.filter_.updatePriority(oldEventCache, updatedPriority);
          }
        } else {
          var childKey = ackPath.getFront();
          var updatedChild = writesCache.calcCompleteChild(childKey, viewCache.getServerCache());
          if (updatedChild != null) {
            newEventCache = this.filter_.updateChild(viewCache.getEventCache().getNode(), childKey, updatedChild, source, accumulator);
          }
        }
      }
      eventCacheComplete = true;
    } else {
      if (viewCache.getEventCache().isFullyInitialized() || ackPath.isEmpty()) {
        newEventCache = oldEventCache;
        var completeEventSnap = viewCache.getEventCache().getNode();
        if (!completeEventSnap.isLeafNode()) {
          var self = this;
          completeEventSnap = (completeEventSnap);
          completeEventSnap.forEachChild(fb.core.snap.PriorityIndex, function(key, childNode) {
            var completeChild = writesCache.calcCompleteChild(key, viewCache.getServerCache());
            if (completeChild != null) {
              newEventCache = self.filter_.updateChild(newEventCache, key, completeChild, source, accumulator);
            }
          });
        }
        eventCacheComplete = viewCache.getEventCache().isFullyInitialized();
      } else {
        var childKey = ackPath.getFront();
        if (ackPath.getLength() == 1 || viewCache.getEventCache().isCompleteForChild(childKey)) {
          var completeChild = writesCache.calcCompleteChild(childKey, viewCache.getServerCache());
          if (completeChild != null) {
            newEventCache = this.filter_.updateChild(oldEventCache, childKey, completeChild, source, accumulator);
          }
        }
        eventCacheComplete = false;
      }
    }
    return viewCache.updateEventSnap(newEventCache, eventCacheComplete, this.filter_.filtersNodes());
  }
};
fb.core.view.ViewProcessor.prototype.revertUserWrite_ = function(viewCache, path, writesCache, optCompleteServerCache, accumulator) {
  var complete;
  if (writesCache.shadowingWrite(path) != null) {
    return viewCache;
  } else {
    var source = new fb.core.view.WriteTreeCompleteChildSource(writesCache, viewCache, optCompleteServerCache);
    var oldEventCache = viewCache.getEventCache().getNode();
    var newEventCache;
    if (path.isEmpty() || path.getFront() === ".priority") {
      var newNode;
      if (viewCache.getServerCache().isFullyInitialized()) {
        newNode = writesCache.calcCompleteEventCache(viewCache.getCompleteServerSnap());
      } else {
        var serverChildren = viewCache.getServerCache().getNode();
        fb.core.util.assert(serverChildren instanceof fb.core.snap.ChildrenNode, "serverChildren would be complete if leaf node");
        newNode = writesCache.calcCompleteEventChildren((serverChildren));
      }
      newNode = (newNode);
      newEventCache = this.filter_.updateFullNode(oldEventCache, newNode, accumulator);
    } else {
      var childKey = path.getFront();
      var newChild = writesCache.calcCompleteChild(childKey, viewCache.getServerCache());
      if (newChild == null && viewCache.getServerCache().isCompleteForChild(childKey)) {
        newChild = oldEventCache.getImmediateChild(childKey);
      }
      if (newChild != null) {
        newEventCache = this.filter_.updateChild(oldEventCache, childKey, newChild, source, accumulator);
      } else {
        if (viewCache.getEventCache().getNode().hasChild(childKey)) {
          newEventCache = this.filter_.updateChild(oldEventCache, childKey, fb.core.snap.EMPTY_NODE, source, accumulator);
        } else {
          newEventCache = oldEventCache;
        }
      }
      if (newEventCache.isEmpty() && viewCache.getServerCache().isFullyInitialized()) {
        complete = writesCache.calcCompleteEventCache(viewCache.getCompleteServerSnap());
        if (complete.isLeafNode()) {
          newEventCache = this.filter_.updateFullNode(newEventCache, complete, accumulator);
        }
      }
    }
    complete = viewCache.getServerCache().isFullyInitialized() || writesCache.shadowingWrite(fb.core.util.Path.Empty) != null;
    return viewCache.updateEventSnap(newEventCache, complete, this.filter_.filtersNodes());
  }
};
fb.core.view.ViewProcessor.prototype.listenComplete_ = function(viewCache, path, writesCache, serverCache, accumulator) {
  var oldServerNode = viewCache.getServerCache();
  var newViewCache = viewCache.updateServerSnap(oldServerNode.getNode(), oldServerNode.isFullyInitialized() || path.isEmpty(), oldServerNode.isFiltered());
  return this.generateEventCacheAfterServerEvent_(newViewCache, path, writesCache, fb.core.view.NO_COMPLETE_CHILD_SOURCE, accumulator);
};
goog.provide("fb.core.snap.Index");
goog.provide("fb.core.snap.PriorityIndex");
goog.provide("fb.core.snap.SubKeyIndex");
goog.require("fb.core.snap.comparators");
goog.require("fb.core.util");
fb.core.snap.Index = function() {
};
fb.core.snap.Index.FallbackType;
fb.core.snap.Index.Fallback = {};
fb.core.snap.Index.prototype.compare = goog.abstractMethod;
fb.core.snap.Index.prototype.isDefinedOn = goog.abstractMethod;
fb.core.snap.Index.prototype.getCompare = function() {
  return goog.bind(this.compare, this);
};
fb.core.snap.Index.prototype.indexedValueChanged = function(oldNode, newNode) {
  var oldWrapped = new fb.core.snap.NamedNode(fb.core.util.MIN_NAME, oldNode);
  var newWrapped = new fb.core.snap.NamedNode(fb.core.util.MIN_NAME, newNode);
  return this.compare(oldWrapped, newWrapped) !== 0;
};
fb.core.snap.Index.prototype.minPost = function() {
  return fb.core.snap.NamedNode.MIN;
};
fb.core.snap.Index.prototype.maxPost = goog.abstractMethod;
fb.core.snap.Index.prototype.makePost = goog.abstractMethod;
fb.core.snap.Index.prototype.toString = goog.abstractMethod;
fb.core.snap.SubKeyIndex = function(indexKey) {
  fb.core.snap.Index.call(this);
  this.indexKey_ = indexKey;
};
goog.inherits(fb.core.snap.SubKeyIndex, fb.core.snap.Index);
fb.core.snap.SubKeyIndex.prototype.extractChild = function(snap) {
  return snap.getImmediateChild(this.indexKey_);
};
fb.core.snap.SubKeyIndex.prototype.isDefinedOn = function(node) {
  return!node.getImmediateChild(this.indexKey_).isEmpty();
};
fb.core.snap.SubKeyIndex.prototype.compare = function(a, b) {
  var aChild = this.extractChild(a.node);
  var bChild = this.extractChild(b.node);
  var indexCmp = aChild.compareTo(bChild);
  if (indexCmp === 0) {
    return fb.core.util.nameCompare(a.name, b.name);
  } else {
    return indexCmp;
  }
};
fb.core.snap.SubKeyIndex.prototype.makePost = function(indexValue, name) {
  var valueNode = fb.core.snap.NodeFromJSON(indexValue);
  var node = fb.core.snap.EMPTY_NODE.updateImmediateChild(this.indexKey_, valueNode);
  return new fb.core.snap.NamedNode(name, node);
};
fb.core.snap.SubKeyIndex.prototype.maxPost = function() {
  var node = fb.core.snap.EMPTY_NODE.updateImmediateChild(this.indexKey_, fb.core.snap.MAX_NODE);
  return new fb.core.snap.NamedNode(fb.core.util.MAX_NAME, node);
};
fb.core.snap.SubKeyIndex.prototype.toString = function() {
  return this.indexKey_;
};
fb.core.snap.PriorityIndex_ = function() {
  fb.core.snap.Index.call(this);
};
goog.inherits(fb.core.snap.PriorityIndex_, fb.core.snap.Index);
fb.core.snap.PriorityIndex_.prototype.compare = function(a, b) {
  var aPriority = a.node.getPriority();
  var bPriority = b.node.getPriority();
  var indexCmp = aPriority.compareTo(bPriority);
  if (indexCmp === 0) {
    return fb.core.util.nameCompare(a.name, b.name);
  } else {
    return indexCmp;
  }
};
fb.core.snap.PriorityIndex_.prototype.isDefinedOn = function(node) {
  return!node.getPriority().isEmpty();
};
fb.core.snap.PriorityIndex_.prototype.indexedValueChanged = function(oldNode, newNode) {
  return!oldNode.getPriority().equals(newNode.getPriority());
};
fb.core.snap.PriorityIndex_.prototype.minPost = function() {
  return fb.core.snap.NamedNode.MIN;
};
fb.core.snap.PriorityIndex_.prototype.maxPost = function() {
  return new fb.core.snap.NamedNode(fb.core.util.MAX_NAME, new fb.core.snap.LeafNode("[PRIORITY-POST]", fb.core.snap.MAX_NODE));
};
fb.core.snap.PriorityIndex_.prototype.makePost = function(indexValue, name) {
  var priorityNode = fb.core.snap.NodeFromJSON(indexValue);
  return new fb.core.snap.NamedNode(name, new fb.core.snap.LeafNode("[PRIORITY-POST]", priorityNode));
};
fb.core.snap.PriorityIndex_.prototype.toString = function() {
  return ".priority";
};
fb.core.snap.PriorityIndex = new fb.core.snap.PriorityIndex_;
fb.core.snap.KeyIndex_ = function() {
  fb.core.snap.Index.call(this);
};
goog.inherits(fb.core.snap.KeyIndex_, fb.core.snap.Index);
fb.core.snap.KeyIndex_.prototype.compare = function(a, b) {
  return fb.core.util.nameCompare(a.name, b.name);
};
fb.core.snap.KeyIndex_.prototype.isDefinedOn = function(node) {
  throw fb.core.util.assertionError("KeyIndex.isDefinedOn not expected to be called.");
};
fb.core.snap.KeyIndex_.prototype.indexedValueChanged = function(oldNode, newNode) {
  return false;
};
fb.core.snap.KeyIndex_.prototype.minPost = function() {
  return fb.core.snap.NamedNode.MIN;
};
fb.core.snap.KeyIndex_.prototype.maxPost = function() {
  return new fb.core.snap.NamedNode(fb.core.util.MAX_NAME, fb.core.snap.EMPTY_NODE);
};
fb.core.snap.KeyIndex_.prototype.makePost = function(indexValue, name) {
  fb.core.util.assert(goog.isString(indexValue), "KeyIndex indexValue must always be a string.");
  return new fb.core.snap.NamedNode((indexValue), fb.core.snap.EMPTY_NODE);
};
fb.core.snap.KeyIndex_.prototype.toString = function() {
  return ".key";
};
fb.core.snap.KeyIndex = new fb.core.snap.KeyIndex_;
fb.core.snap.ValueIndex_ = function() {
  fb.core.snap.Index.call(this);
};
goog.inherits(fb.core.snap.ValueIndex_, fb.core.snap.Index);
fb.core.snap.ValueIndex_.prototype.compare = function(a, b) {
  var indexCmp = a.node.compareTo(b.node);
  if (indexCmp === 0) {
    return fb.core.util.nameCompare(a.name, b.name);
  } else {
    return indexCmp;
  }
};
fb.core.snap.ValueIndex_.prototype.isDefinedOn = function(node) {
  return true;
};
fb.core.snap.ValueIndex_.prototype.indexedValueChanged = function(oldNode, newNode) {
  return!oldNode.equals(newNode);
};
fb.core.snap.ValueIndex_.prototype.minPost = function() {
  return fb.core.snap.NamedNode.MIN;
};
fb.core.snap.ValueIndex_.prototype.maxPost = function() {
  return fb.core.snap.NamedNode.MAX;
};
fb.core.snap.ValueIndex_.prototype.makePost = function(indexValue, name) {
  var valueNode = fb.core.snap.NodeFromJSON(indexValue);
  return new fb.core.snap.NamedNode(name, valueNode);
};
fb.core.snap.ValueIndex_.prototype.toString = function() {
  return ".value";
};
fb.core.snap.ValueIndex = new fb.core.snap.ValueIndex_;
goog.provide("fb.core.view.QueryParams");
goog.require("fb.core.snap.Index");
goog.require("fb.core.snap.PriorityIndex");
goog.require("fb.core.util");
goog.require("fb.core.view.filter.IndexedFilter");
goog.require("fb.core.view.filter.LimitedFilter");
goog.require("fb.core.view.filter.NodeFilter");
goog.require("fb.core.view.filter.RangedFilter");
fb.core.view.QueryParams = function() {
  this.limitSet_ = false;
  this.startSet_ = false;
  this.startNameSet_ = false;
  this.endSet_ = false;
  this.endNameSet_ = false;
  this.limit_ = 0;
  this.viewFrom_ = "";
  this.indexStartValue_ = null;
  this.indexStartName_ = "";
  this.indexEndValue_ = null;
  this.indexEndName_ = "";
  this.index_ = fb.core.snap.PriorityIndex;
};
fb.core.view.QueryParams.WIRE_PROTOCOL_CONSTANTS_ = {INDEX_START_VALUE:"sp", INDEX_START_NAME:"sn", INDEX_END_VALUE:"ep", INDEX_END_NAME:"en", LIMIT:"l", VIEW_FROM:"vf", VIEW_FROM_LEFT:"l", VIEW_FROM_RIGHT:"r", INDEX:"i"};
fb.core.view.QueryParams.REST_QUERY_CONSTANTS_ = {ORDER_BY:"orderBy", PRIORITY_INDEX:"$priority", VALUE_INDEX:"$value", START_AT:"startAt", END_AT:"endAt", LIMIT_TO_FIRST:"limitToFirst", LIMIT_TO_LAST:"limitToLast"};
fb.core.view.QueryParams.DEFAULT = new fb.core.view.QueryParams;
fb.core.view.QueryParams.prototype.hasStart = function() {
  return this.startSet_;
};
fb.core.view.QueryParams.prototype.isViewFromLeft = function() {
  if (this.viewFrom_ === "") {
    return this.startSet_;
  } else {
    return this.viewFrom_ === fb.core.view.QueryParams.WIRE_PROTOCOL_CONSTANTS_.VIEW_FROM_LEFT;
  }
};
fb.core.view.QueryParams.prototype.getIndexStartValue = function() {
  fb.core.util.assert(this.startSet_, "Only valid if start has been set");
  return this.indexStartValue_;
};
fb.core.view.QueryParams.prototype.getIndexStartName = function() {
  fb.core.util.assert(this.startSet_, "Only valid if start has been set");
  if (this.startNameSet_) {
    return this.indexStartName_;
  } else {
    return fb.core.util.MIN_NAME;
  }
};
fb.core.view.QueryParams.prototype.hasEnd = function() {
  return this.endSet_;
};
fb.core.view.QueryParams.prototype.getIndexEndValue = function() {
  fb.core.util.assert(this.endSet_, "Only valid if end has been set");
  return this.indexEndValue_;
};
fb.core.view.QueryParams.prototype.getIndexEndName = function() {
  fb.core.util.assert(this.endSet_, "Only valid if end has been set");
  if (this.endNameSet_) {
    return this.indexEndName_;
  } else {
    return fb.core.util.MAX_NAME;
  }
};
fb.core.view.QueryParams.prototype.hasLimit = function() {
  return this.limitSet_;
};
fb.core.view.QueryParams.prototype.hasAnchoredLimit = function() {
  return this.limitSet_ && this.viewFrom_ !== "";
};
fb.core.view.QueryParams.prototype.getLimit = function() {
  fb.core.util.assert(this.limitSet_, "Only valid if limit has been set");
  return this.limit_;
};
fb.core.view.QueryParams.prototype.getIndex = function() {
  return this.index_;
};
fb.core.view.QueryParams.prototype.copy_ = function() {
  var copy = new fb.core.view.QueryParams;
  copy.limitSet_ = this.limitSet_;
  copy.limit_ = this.limit_;
  copy.startSet_ = this.startSet_;
  copy.indexStartValue_ = this.indexStartValue_;
  copy.startNameSet_ = this.startNameSet_;
  copy.indexStartName_ = this.indexStartName_;
  copy.endSet_ = this.endSet_;
  copy.indexEndValue_ = this.indexEndValue_;
  copy.endNameSet_ = this.endNameSet_;
  copy.indexEndName_ = this.indexEndName_;
  copy.index_ = this.index_;
  return copy;
};
fb.core.view.QueryParams.prototype.limit = function(newLimit) {
  var newParams = this.copy_();
  newParams.limitSet_ = true;
  newParams.limit_ = newLimit;
  newParams.viewFrom_ = "";
  return newParams;
};
fb.core.view.QueryParams.prototype.limitToFirst = function(newLimit) {
  var newParams = this.copy_();
  newParams.limitSet_ = true;
  newParams.limit_ = newLimit;
  newParams.viewFrom_ = fb.core.view.QueryParams.WIRE_PROTOCOL_CONSTANTS_.VIEW_FROM_LEFT;
  return newParams;
};
fb.core.view.QueryParams.prototype.limitToLast = function(newLimit) {
  var newParams = this.copy_();
  newParams.limitSet_ = true;
  newParams.limit_ = newLimit;
  newParams.viewFrom_ = fb.core.view.QueryParams.WIRE_PROTOCOL_CONSTANTS_.VIEW_FROM_RIGHT;
  return newParams;
};
fb.core.view.QueryParams.prototype.startAt = function(indexValue, key) {
  var newParams = this.copy_();
  newParams.startSet_ = true;
  if (!goog.isDef(indexValue)) {
    indexValue = null;
  }
  newParams.indexStartValue_ = indexValue;
  if (key != null) {
    newParams.startNameSet_ = true;
    newParams.indexStartName_ = key;
  } else {
    newParams.startNameSet_ = false;
    newParams.indexStartName_ = "";
  }
  return newParams;
};
fb.core.view.QueryParams.prototype.endAt = function(indexValue, key) {
  var newParams = this.copy_();
  newParams.endSet_ = true;
  if (!goog.isDef(indexValue)) {
    indexValue = null;
  }
  newParams.indexEndValue_ = indexValue;
  if (goog.isDef(key)) {
    newParams.endNameSet_ = true;
    newParams.indexEndName_ = key;
  } else {
    newParams.startEndSet_ = false;
    newParams.indexEndName_ = "";
  }
  return newParams;
};
fb.core.view.QueryParams.prototype.orderBy = function(index) {
  var newParams = this.copy_();
  newParams.index_ = index;
  return newParams;
};
fb.core.view.QueryParams.prototype.getQueryObject = function() {
  var WIRE_PROTOCOL_CONSTANTS = fb.core.view.QueryParams.WIRE_PROTOCOL_CONSTANTS_;
  var obj = {};
  if (this.startSet_) {
    obj[WIRE_PROTOCOL_CONSTANTS.INDEX_START_VALUE] = this.indexStartValue_;
    if (this.startNameSet_) {
      obj[WIRE_PROTOCOL_CONSTANTS.INDEX_START_NAME] = this.indexStartName_;
    }
  }
  if (this.endSet_) {
    obj[WIRE_PROTOCOL_CONSTANTS.INDEX_END_VALUE] = this.indexEndValue_;
    if (this.endNameSet_) {
      obj[WIRE_PROTOCOL_CONSTANTS.INDEX_END_NAME] = this.indexEndName_;
    }
  }
  if (this.limitSet_) {
    obj[WIRE_PROTOCOL_CONSTANTS.LIMIT] = this.limit_;
    var viewFrom = this.viewFrom_;
    if (viewFrom === "") {
      if (this.isViewFromLeft()) {
        viewFrom = WIRE_PROTOCOL_CONSTANTS.VIEW_FROM_LEFT;
      } else {
        viewFrom = WIRE_PROTOCOL_CONSTANTS.VIEW_FROM_RIGHT;
      }
    }
    obj[WIRE_PROTOCOL_CONSTANTS.VIEW_FROM] = viewFrom;
  }
  if (this.index_ !== fb.core.snap.PriorityIndex) {
    obj[WIRE_PROTOCOL_CONSTANTS.INDEX] = this.index_.toString();
  }
  return obj;
};
fb.core.view.QueryParams.prototype.loadsAllData = function() {
  return!(this.startSet_ || this.endSet_ || this.limitSet_);
};
fb.core.view.QueryParams.prototype.isDefault = function() {
  return this.loadsAllData() && this.index_ == fb.core.snap.PriorityIndex;
};
fb.core.view.QueryParams.prototype.getNodeFilter = function() {
  if (this.loadsAllData()) {
    return new fb.core.view.filter.IndexedFilter(this.getIndex());
  } else {
    if (this.hasLimit()) {
      return new fb.core.view.filter.LimitedFilter(this);
    } else {
      return new fb.core.view.filter.RangedFilter(this);
    }
  }
};
fb.core.view.QueryParams.prototype.toRestQueryStringParameters = function() {
  var REST_CONSTANTS = fb.core.view.QueryParams.REST_QUERY_CONSTANTS_;
  var qs = {};
  if (this.isDefault()) {
    return qs;
  }
  var orderBy;
  if (this.index_ === fb.core.snap.PriorityIndex) {
    orderBy = REST_CONSTANTS.PRIORITY_INDEX;
  } else {
    if (this.index_ === fb.core.snap.ValueIndex) {
      orderBy = REST_CONSTANTS.VALUE_INDEX;
    } else {
      fb.core.util.assert(this.index_ instanceof fb.core.snap.SubKeyIndex, "Unrecognized index type!");
      orderBy = this.index_.toString();
    }
  }
  qs[REST_CONSTANTS.ORDER_BY] = fb.util.json.stringify(orderBy);
  if (this.startSet_) {
    qs[REST_CONSTANTS.START_AT] = fb.util.json.stringify(this.indexStartValue_);
    if (this.startNameSet_) {
      qs[REST_CONSTANTS.START_AT] += "," + fb.util.json.stringify(this.indexStartName_);
    }
  }
  if (this.endSet_) {
    qs[REST_CONSTANTS.END_AT] = fb.util.json.stringify(this.indexEndValue_);
    if (this.endNameSet_) {
      qs[REST_CONSTANTS.END_AT] += "," + fb.util.json.stringify(this.indexEndName_);
    }
  }
  if (this.limitSet_) {
    if (this.isViewFromLeft()) {
      qs[REST_CONSTANTS.LIMIT_TO_FIRST] = this.limit_;
    } else {
      qs[REST_CONSTANTS.LIMIT_TO_LAST] = this.limit_;
    }
  }
  return qs;
};
if (goog.DEBUG) {
  fb.core.view.QueryParams.prototype.toString = function() {
    return fb.util.json.stringify(this.getQueryObject());
  };
}
;goog.provide("fb.core.snap.IndexMap");
goog.require("fb.core.snap.Index");
goog.require("fb.core.util");
fb.core.snap.IndexMap = function(indexes, indexSet) {
  this.indexes_ = indexes;
  this.indexSet_ = indexSet;
};
fb.core.snap.IndexMap.prototype.get = function(indexKey) {
  var sortedMap = fb.util.obj.get(this.indexes_, indexKey);
  if (!sortedMap) {
    throw new Error("No index defined for " + indexKey);
  }
  if (sortedMap === fb.core.snap.Index.Fallback) {
    return null;
  } else {
    return sortedMap;
  }
};
fb.core.snap.IndexMap.prototype.hasIndex = function(indexDefinition) {
  return goog.object.contains(this.indexSet_, indexDefinition.toString());
};
fb.core.snap.IndexMap.prototype.addIndex = function(indexDefinition, existingChildren) {
  fb.core.util.assert(indexDefinition !== fb.core.snap.KeyIndex, "KeyIndex always exists and isn't meant to be added to the IndexMap.");
  var childList = [];
  var sawIndexedValue = false;
  var iter = existingChildren.getIterator(fb.core.snap.NamedNode.Wrap);
  var next = iter.getNext();
  while (next) {
    sawIndexedValue = sawIndexedValue || indexDefinition.isDefinedOn(next.node);
    childList.push(next);
    next = iter.getNext();
  }
  var newIndex;
  if (sawIndexedValue) {
    newIndex = fb.core.snap.buildChildSet(childList, indexDefinition.getCompare());
  } else {
    newIndex = fb.core.snap.Index.Fallback;
  }
  var indexName = indexDefinition.toString();
  var newIndexSet = goog.object.clone(this.indexSet_);
  newIndexSet[indexName] = indexDefinition;
  var newIndexes = goog.object.clone(this.indexes_);
  newIndexes[indexName] = newIndex;
  return new fb.core.snap.IndexMap(newIndexes, newIndexSet);
};
fb.core.snap.IndexMap.prototype.addToIndexes = function(namedNode, existingChildren) {
  var self = this;
  var newIndexes = goog.object.map(this.indexes_, function(indexedChildren, indexName) {
    var index = fb.util.obj.get(self.indexSet_, indexName);
    fb.core.util.assert(index, "Missing index implementation for " + indexName);
    if (indexedChildren === fb.core.snap.Index.Fallback) {
      if (index.isDefinedOn(namedNode.node)) {
        var childList = [];
        var iter = existingChildren.getIterator(fb.core.snap.NamedNode.Wrap);
        var next = iter.getNext();
        while (next) {
          if (next.name != namedNode.name) {
            childList.push(next);
          }
          next = iter.getNext();
        }
        childList.push(namedNode);
        return fb.core.snap.buildChildSet(childList, index.getCompare());
      } else {
        return fb.core.snap.Index.Fallback;
      }
    } else {
      var existingSnap = existingChildren.get(namedNode.name);
      var newChildren = indexedChildren;
      if (existingSnap) {
        newChildren = newChildren.remove(new fb.core.snap.NamedNode(namedNode.name, existingSnap));
      }
      return newChildren.insert(namedNode, namedNode.node);
    }
  });
  return new fb.core.snap.IndexMap(newIndexes, this.indexSet_);
};
fb.core.snap.IndexMap.prototype.removeFromIndexes = function(namedNode, existingChildren) {
  var newIndexes = goog.object.map(this.indexes_, function(indexedChildren) {
    if (indexedChildren === fb.core.snap.Index.Fallback) {
      return indexedChildren;
    } else {
      var existingSnap = existingChildren.get(namedNode.name);
      if (existingSnap) {
        return indexedChildren.remove(new fb.core.snap.NamedNode(namedNode.name, existingSnap));
      } else {
        return indexedChildren;
      }
    }
  });
  return new fb.core.snap.IndexMap(newIndexes, this.indexSet_);
};
fb.core.snap.IndexMap.Default = new fb.core.snap.IndexMap({".priority":fb.core.snap.Index.Fallback}, {".priority":fb.core.snap.PriorityIndex});
goog.provide("fb.core.snap.LeafNode");
goog.require("fb.core.snap.Node");
goog.require("fb.core.util");
fb.core.snap.LeafNode = function(value, opt_priorityNode) {
  this.value_ = value;
  fb.core.util.assert(goog.isDef(this.value_) && this.value_ !== null, "LeafNode shouldn't be created with null/undefined value.");
  this.priorityNode_ = opt_priorityNode || fb.core.snap.EMPTY_NODE;
  fb.core.snap.validatePriorityNode(this.priorityNode_);
  this.lazyHash_ = null;
};
fb.core.snap.LeafNode.prototype.isLeafNode = function() {
  return true;
};
fb.core.snap.LeafNode.prototype.getPriority = function() {
  return this.priorityNode_;
};
fb.core.snap.LeafNode.prototype.updatePriority = function(newPriorityNode) {
  return new fb.core.snap.LeafNode(this.value_, newPriorityNode);
};
fb.core.snap.LeafNode.prototype.getImmediateChild = function(childName) {
  if (childName === ".priority") {
    return this.priorityNode_;
  } else {
    return fb.core.snap.EMPTY_NODE;
  }
};
fb.core.snap.LeafNode.prototype.getChild = function(path) {
  if (path.isEmpty()) {
    return this;
  } else {
    if (path.getFront() === ".priority") {
      return this.priorityNode_;
    } else {
      return fb.core.snap.EMPTY_NODE;
    }
  }
};
fb.core.snap.LeafNode.prototype.hasChild = function() {
  return false;
};
fb.core.snap.LeafNode.prototype.getPredecessorChildName = function(childName, childNode) {
  return null;
};
fb.core.snap.LeafNode.prototype.updateImmediateChild = function(childName, newChildNode) {
  if (childName === ".priority") {
    return this.updatePriority(newChildNode);
  } else {
    if (newChildNode.isEmpty() && childName !== ".priority") {
      return this;
    } else {
      return fb.core.snap.EMPTY_NODE.updateImmediateChild(childName, newChildNode).updatePriority(this.priorityNode_);
    }
  }
};
fb.core.snap.LeafNode.prototype.updateChild = function(path, newChildNode) {
  var front = path.getFront();
  if (front === null) {
    return newChildNode;
  } else {
    if (newChildNode.isEmpty() && front !== ".priority") {
      return this;
    } else {
      fb.core.util.assert(front !== ".priority" || path.getLength() === 1, ".priority must be the last token in a path");
      return this.updateImmediateChild(front, fb.core.snap.EMPTY_NODE.updateChild(path.popFront(), newChildNode));
    }
  }
};
fb.core.snap.LeafNode.prototype.isEmpty = function() {
  return false;
};
fb.core.snap.LeafNode.prototype.numChildren = function() {
  return 0;
};
fb.core.snap.LeafNode.prototype.val = function(opt_exportFormat) {
  if (opt_exportFormat && !this.getPriority().isEmpty()) {
    return{".value":this.getValue(), ".priority":this.getPriority().val()};
  } else {
    return this.getValue();
  }
};
fb.core.snap.LeafNode.prototype.hash = function() {
  if (this.lazyHash_ === null) {
    var toHash = "";
    if (!this.priorityNode_.isEmpty()) {
      toHash += "priority:" + fb.core.snap.priorityHashText((this.priorityNode_.val())) + ":";
    }
    var type = typeof this.value_;
    toHash += type + ":";
    if (type === "number") {
      toHash += fb.core.util.doubleToIEEE754String((this.value_));
    } else {
      toHash += this.value_;
    }
    this.lazyHash_ = fb.core.util.sha1(toHash);
  }
  return(this.lazyHash_);
};
fb.core.snap.LeafNode.prototype.getValue = function() {
  return this.value_;
};
fb.core.snap.LeafNode.prototype.compareTo = function(other) {
  if (other === fb.core.snap.EMPTY_NODE) {
    return 1;
  } else {
    if (other instanceof fb.core.snap.ChildrenNode) {
      return-1;
    } else {
      fb.core.util.assert(other.isLeafNode(), "Unknown node type");
      return this.compareToLeafNode_((other));
    }
  }
};
fb.core.snap.LeafNode.VALUE_TYPE_ORDER = ["object", "boolean", "number", "string"];
fb.core.snap.LeafNode.prototype.compareToLeafNode_ = function(otherLeaf) {
  var otherLeafType = typeof otherLeaf.value_;
  var thisLeafType = typeof this.value_;
  var otherIndex = goog.array.indexOf(fb.core.snap.LeafNode.VALUE_TYPE_ORDER, otherLeafType);
  var thisIndex = goog.array.indexOf(fb.core.snap.LeafNode.VALUE_TYPE_ORDER, thisLeafType);
  fb.core.util.assert(otherIndex >= 0, "Unknown leaf type: " + otherLeafType);
  fb.core.util.assert(thisIndex >= 0, "Unknown leaf type: " + thisLeafType);
  if (otherIndex === thisIndex) {
    if (thisLeafType === "object") {
      return 0;
    } else {
      if (this.value_ < otherLeaf.value_) {
        return-1;
      } else {
        if (this.value_ === otherLeaf.value_) {
          return 0;
        } else {
          return 1;
        }
      }
    }
  } else {
    return thisIndex - otherIndex;
  }
};
fb.core.snap.LeafNode.prototype.withIndex = function() {
  return this;
};
fb.core.snap.LeafNode.prototype.isIndexed = function() {
  return true;
};
fb.core.snap.LeafNode.prototype.equals = function(other) {
  if (other === this) {
    return true;
  } else {
    if (other.isLeafNode()) {
      var otherLeaf = (other);
      return this.value_ === otherLeaf.value_ && this.priorityNode_.equals(otherLeaf.priorityNode_);
    } else {
      return false;
    }
  }
};
if (goog.DEBUG) {
  fb.core.snap.LeafNode.prototype.toString = function() {
    return fb.util.json.stringify(this.val(true));
  };
}
;goog.provide("fb.core.snap.ChildrenNode");
goog.require("fb.core.snap.IndexMap");
goog.require("fb.core.snap.LeafNode");
goog.require("fb.core.snap.NamedNode");
goog.require("fb.core.snap.Node");
goog.require("fb.core.snap.PriorityIndex");
goog.require("fb.core.snap.comparators");
goog.require("fb.core.util");
goog.require("fb.core.util.SortedMap");
fb.core.snap.ChildrenNode = function(children, priorityNode, indexMap) {
  this.children_ = children;
  this.priorityNode_ = priorityNode;
  if (this.priorityNode_) {
    fb.core.snap.validatePriorityNode(this.priorityNode_);
  }
  if (children.isEmpty()) {
    fb.core.util.assert(!this.priorityNode_ || this.priorityNode_.isEmpty(), "An empty node cannot have a priority");
  }
  this.indexMap_ = indexMap;
  this.lazyHash_ = null;
};
fb.core.snap.ChildrenNode.prototype.isLeafNode = function() {
  return false;
};
fb.core.snap.ChildrenNode.prototype.getPriority = function() {
  return this.priorityNode_ || fb.core.snap.EMPTY_NODE;
};
fb.core.snap.ChildrenNode.prototype.updatePriority = function(newPriorityNode) {
  if (this.children_.isEmpty()) {
    return this;
  } else {
    return new fb.core.snap.ChildrenNode(this.children_, newPriorityNode, this.indexMap_);
  }
};
fb.core.snap.ChildrenNode.prototype.getImmediateChild = function(childName) {
  if (childName === ".priority") {
    return this.getPriority();
  } else {
    var child = this.children_.get(childName);
    return child === null ? fb.core.snap.EMPTY_NODE : child;
  }
};
fb.core.snap.ChildrenNode.prototype.getChild = function(path) {
  var front = path.getFront();
  if (front === null) {
    return this;
  }
  return this.getImmediateChild(front).getChild(path.popFront());
};
fb.core.snap.ChildrenNode.prototype.hasChild = function(childName) {
  return this.children_.get(childName) !== null;
};
fb.core.snap.ChildrenNode.prototype.updateImmediateChild = function(childName, newChildNode) {
  fb.core.util.assert(newChildNode, "We should always be passing snapshot nodes");
  if (childName === ".priority") {
    return this.updatePriority(newChildNode);
  } else {
    var namedNode = new fb.core.snap.NamedNode(childName, newChildNode);
    var newChildren, newIndexMap, newPriority;
    if (newChildNode.isEmpty()) {
      newChildren = this.children_.remove(childName);
      newIndexMap = this.indexMap_.removeFromIndexes(namedNode, this.children_);
    } else {
      newChildren = this.children_.insert(childName, newChildNode);
      newIndexMap = this.indexMap_.addToIndexes(namedNode, this.children_);
    }
    newPriority = newChildren.isEmpty() ? fb.core.snap.EMPTY_NODE : this.priorityNode_;
    return new fb.core.snap.ChildrenNode(newChildren, newPriority, newIndexMap);
  }
};
fb.core.snap.ChildrenNode.prototype.updateChild = function(path, newChildNode) {
  var front = path.getFront();
  if (front === null) {
    return newChildNode;
  } else {
    fb.core.util.assert(path.getFront() !== ".priority" || path.getLength() === 1, ".priority must be the last token in a path");
    var newImmediateChild = this.getImmediateChild(front).updateChild(path.popFront(), newChildNode);
    return this.updateImmediateChild(front, newImmediateChild);
  }
};
fb.core.snap.ChildrenNode.prototype.isEmpty = function() {
  return this.children_.isEmpty();
};
fb.core.snap.ChildrenNode.prototype.numChildren = function() {
  return this.children_.count();
};
fb.core.snap.ChildrenNode.INTEGER_REGEXP_ = /^(0|[1-9]\d*)$/;
fb.core.snap.ChildrenNode.prototype.val = function(opt_exportFormat) {
  if (this.isEmpty()) {
    return null;
  }
  var obj = {};
  var numKeys = 0, maxKey = 0, allIntegerKeys = true;
  this.forEachChild(fb.core.snap.PriorityIndex, function(key, childNode) {
    obj[key] = childNode.val(opt_exportFormat);
    numKeys++;
    if (allIntegerKeys && fb.core.snap.ChildrenNode.INTEGER_REGEXP_.test(key)) {
      maxKey = Math.max(maxKey, Number(key));
    } else {
      allIntegerKeys = false;
    }
  });
  if (!opt_exportFormat && allIntegerKeys && maxKey < 2 * numKeys) {
    var array = [];
    for (var key in obj) {
      array[key] = obj[key];
    }
    return array;
  } else {
    if (opt_exportFormat && !this.getPriority().isEmpty()) {
      obj[".priority"] = this.getPriority().val();
    }
    return obj;
  }
};
fb.core.snap.ChildrenNode.prototype.hash = function() {
  if (this.lazyHash_ === null) {
    var toHash = "";
    if (!this.getPriority().isEmpty()) {
      toHash += "priority:" + fb.core.snap.priorityHashText((this.getPriority().val())) + ":";
    }
    this.forEachChild(fb.core.snap.PriorityIndex, function(key, childNode) {
      var childHash = childNode.hash();
      if (childHash !== "") {
        toHash += ":" + key + ":" + childHash;
      }
    });
    this.lazyHash_ = toHash === "" ? "" : fb.core.util.sha1(toHash);
  }
  return this.lazyHash_;
};
fb.core.snap.ChildrenNode.prototype.getPredecessorChildName = function(childName, childNode, index) {
  var idx = this.resolveIndex_(index);
  if (idx) {
    var predecessor = idx.getPredecessorKey(new fb.core.snap.NamedNode(childName, childNode));
    return predecessor ? predecessor.name : null;
  } else {
    return this.children_.getPredecessorKey(childName);
  }
};
fb.core.snap.ChildrenNode.prototype.getFirstChildName = function(indexDefinition) {
  var idx = this.resolveIndex_(indexDefinition);
  if (idx) {
    var minKey = idx.minKey();
    return minKey && minKey.name;
  } else {
    return this.children_.minKey();
  }
};
fb.core.snap.ChildrenNode.prototype.getFirstChild = function(indexDefinition) {
  var minKey = this.getFirstChildName(indexDefinition);
  if (minKey) {
    return new fb.core.snap.NamedNode(minKey, this.children_.get(minKey));
  } else {
    return null;
  }
};
fb.core.snap.ChildrenNode.prototype.getLastChildName = function(indexDefinition) {
  var idx = this.resolveIndex_(indexDefinition);
  if (idx) {
    var maxKey = idx.maxKey();
    return maxKey && maxKey.name;
  } else {
    return this.children_.maxKey();
  }
};
fb.core.snap.ChildrenNode.prototype.getLastChild = function(indexDefinition) {
  var maxKey = this.getLastChildName(indexDefinition);
  if (maxKey) {
    return new fb.core.snap.NamedNode(maxKey, this.children_.get(maxKey));
  } else {
    return null;
  }
};
fb.core.snap.ChildrenNode.prototype.forEachChild = function(index, action) {
  var idx = this.resolveIndex_(index);
  if (idx) {
    return idx.inorderTraversal(function(wrappedNode) {
      return action(wrappedNode.name, wrappedNode.node);
    });
  } else {
    return this.children_.inorderTraversal(action);
  }
};
fb.core.snap.ChildrenNode.prototype.getIterator = function(indexDefinition) {
  return this.getIteratorFrom(indexDefinition.minPost(), indexDefinition);
};
fb.core.snap.ChildrenNode.prototype.getIteratorFrom = function(startPost, indexDefinition) {
  var idx = this.resolveIndex_(indexDefinition);
  if (idx) {
    return idx.getIteratorFrom(startPost, function(key) {
      return key;
    });
  } else {
    var iterator = this.children_.getIteratorFrom(startPost.name, fb.core.snap.NamedNode.Wrap);
    var next = iterator.peek();
    while (next != null && indexDefinition.compare(next, startPost) < 0) {
      iterator.getNext();
      next = iterator.peek();
    }
    return iterator;
  }
};
fb.core.snap.ChildrenNode.prototype.getReverseIterator = function(indexDefinition) {
  return this.getReverseIteratorFrom(indexDefinition.maxPost(), indexDefinition);
};
fb.core.snap.ChildrenNode.prototype.getReverseIteratorFrom = function(endPost, indexDefinition) {
  var idx = this.resolveIndex_(indexDefinition);
  if (idx) {
    return idx.getReverseIteratorFrom(endPost, function(key) {
      return key;
    });
  } else {
    var iterator = this.children_.getReverseIteratorFrom(endPost.name, fb.core.snap.NamedNode.Wrap);
    var next = iterator.peek();
    while (next != null && indexDefinition.compare(next, endPost) > 0) {
      iterator.getNext();
      next = iterator.peek();
    }
    return iterator;
  }
};
fb.core.snap.ChildrenNode.prototype.compareTo = function(other) {
  if (this.isEmpty()) {
    if (other.isEmpty()) {
      return 0;
    } else {
      return-1;
    }
  } else {
    if (other.isLeafNode() || other.isEmpty()) {
      return 1;
    } else {
      if (other === fb.core.snap.MAX_NODE) {
        return-1;
      } else {
        return 0;
      }
    }
  }
};
fb.core.snap.ChildrenNode.prototype.withIndex = function(indexDefinition) {
  if (indexDefinition === fb.core.snap.KeyIndex || this.indexMap_.hasIndex(indexDefinition)) {
    return this;
  } else {
    var newIndexMap = this.indexMap_.addIndex(indexDefinition, this.children_);
    return new fb.core.snap.ChildrenNode(this.children_, this.priorityNode_, newIndexMap);
  }
};
fb.core.snap.ChildrenNode.prototype.isIndexed = function(index) {
  return index === fb.core.snap.KeyIndex || this.indexMap_.hasIndex(index);
};
fb.core.snap.ChildrenNode.prototype.equals = function(other) {
  if (other === this) {
    return true;
  } else {
    if (other.isLeafNode()) {
      return false;
    } else {
      var otherChildrenNode = (other);
      if (!this.getPriority().equals(otherChildrenNode.getPriority())) {
        return false;
      } else {
        if (this.children_.count() === otherChildrenNode.children_.count()) {
          var thisIter = this.getIterator(fb.core.snap.PriorityIndex);
          var otherIter = otherChildrenNode.getIterator(fb.core.snap.PriorityIndex);
          var thisCurrent = thisIter.getNext();
          var otherCurrent = otherIter.getNext();
          while (thisCurrent && otherCurrent) {
            if (thisCurrent.name !== otherCurrent.name || !thisCurrent.node.equals(otherCurrent.node)) {
              return false;
            }
            thisCurrent = thisIter.getNext();
            otherCurrent = otherIter.getNext();
          }
          return thisCurrent === null && otherCurrent === null;
        } else {
          return false;
        }
      }
    }
  }
};
fb.core.snap.ChildrenNode.prototype.resolveIndex_ = function(indexDefinition) {
  if (indexDefinition === fb.core.snap.KeyIndex) {
    return null;
  } else {
    return this.indexMap_.get(indexDefinition.toString());
  }
};
if (goog.DEBUG) {
  fb.core.snap.ChildrenNode.prototype.toString = function() {
    return fb.util.json.stringify(this.val(true));
  };
}
;goog.provide("fb.core.snap");
goog.require("fb.core.snap.ChildrenNode");
goog.require("fb.core.snap.IndexMap");
goog.require("fb.core.snap.LeafNode");
goog.require("fb.core.util");
var USE_HINZE = true;
fb.core.snap.NodeFromJSON = function(json, opt_priority) {
  if (json === null) {
    return fb.core.snap.EMPTY_NODE;
  }
  var priority = null;
  if (typeof json === "object" && ".priority" in json) {
    priority = json[".priority"];
  } else {
    if (typeof opt_priority !== "undefined") {
      priority = opt_priority;
    }
  }
  fb.core.util.assert(priority === null || typeof priority === "string" || typeof priority === "number" || typeof priority === "object" && ".sv" in priority, "Invalid priority type found: " + typeof priority);
  if (typeof json === "object" && ".value" in json && json[".value"] !== null) {
    json = json[".value"];
  }
  if (typeof json !== "object" || ".sv" in json) {
    var jsonLeaf = (json);
    return new fb.core.snap.LeafNode(jsonLeaf, fb.core.snap.NodeFromJSON(priority));
  }
  if (!(json instanceof Array) && USE_HINZE) {
    var children = [];
    var childrenHavePriority = false;
    var hinzeJsonObj = (json);
    fb.util.obj.foreach(hinzeJsonObj, function(key, child) {
      if (typeof key !== "string" || key.substring(0, 1) !== ".") {
        var childNode = fb.core.snap.NodeFromJSON(hinzeJsonObj[key]);
        if (!childNode.isEmpty()) {
          childrenHavePriority = childrenHavePriority || !childNode.getPriority().isEmpty();
          children.push(new fb.core.snap.NamedNode(key, childNode));
        }
      }
    });
    if (children.length == 0) {
      return fb.core.snap.EMPTY_NODE;
    }
    var childSet = (fb.core.snap.buildChildSet(children, fb.core.snap.NAME_ONLY_COMPARATOR, function(namedNode) {
      return namedNode.name;
    }, fb.core.snap.NAME_COMPARATOR));
    if (childrenHavePriority) {
      var sortedChildSet = fb.core.snap.buildChildSet(children, fb.core.snap.PriorityIndex.getCompare());
      return new fb.core.snap.ChildrenNode(childSet, fb.core.snap.NodeFromJSON(priority), new fb.core.snap.IndexMap({".priority":sortedChildSet}, {".priority":fb.core.snap.PriorityIndex}));
    } else {
      return new fb.core.snap.ChildrenNode(childSet, fb.core.snap.NodeFromJSON(priority), fb.core.snap.IndexMap.Default);
    }
  } else {
    var node = fb.core.snap.EMPTY_NODE;
    var jsonObj = (json);
    goog.object.forEach(jsonObj, function(childData, key) {
      if (fb.util.obj.contains(jsonObj, key)) {
        if (key.substring(0, 1) !== ".") {
          var childNode = fb.core.snap.NodeFromJSON(childData);
          if (childNode.isLeafNode() || !childNode.isEmpty()) {
            node = node.updateImmediateChild(key, childNode);
          }
        }
      }
    });
    return node.updatePriority(fb.core.snap.NodeFromJSON(priority));
  }
};
var LOG_2 = Math.log(2);
fb.core.snap.Base12Num = function(length) {
  var logBase2 = function(num) {
    return parseInt(Math.log(num) / LOG_2, 10);
  };
  var bitMask = function(bits) {
    return parseInt(Array(bits + 1).join("1"), 2);
  };
  this.count = logBase2(length + 1);
  this.current_ = this.count - 1;
  var mask = bitMask(this.count);
  this.bits_ = length + 1 & mask;
};
fb.core.snap.Base12Num.prototype.nextBitIsOne = function() {
  var result = !(this.bits_ & 1 << this.current_);
  this.current_--;
  return result;
};
fb.core.snap.buildChildSet = function(childList, cmp, keyFn, mapSortFn) {
  childList.sort(cmp);
  var buildBalancedTree = function(low, high) {
    var length = high - low;
    if (length == 0) {
      return null;
    } else {
      if (length == 1) {
        var namedNode = childList[low];
        var key = keyFn ? keyFn(namedNode) : namedNode;
        return new fb.LLRBNode(key, namedNode.node, fb.LLRBNode.BLACK, null, null);
      } else {
        var middle = parseInt(length / 2, 10) + low;
        var left = buildBalancedTree(low, middle);
        var right = buildBalancedTree(middle + 1, high);
        namedNode = childList[middle];
        key = keyFn ? keyFn(namedNode) : namedNode;
        return new fb.LLRBNode(key, namedNode.node, fb.LLRBNode.BLACK, left, right);
      }
    }
  };
  var buildFrom12Array = function(base12) {
    var node = null;
    var root = null;
    var index = childList.length;
    var buildPennant = function(chunkSize, color) {
      var low = index - chunkSize;
      var high = index;
      index -= chunkSize;
      var childTree = buildBalancedTree(low + 1, high);
      var namedNode = childList[low];
      var key = keyFn ? keyFn(namedNode) : namedNode;
      attachPennant(new fb.LLRBNode(key, namedNode.node, color, null, childTree));
    };
    var attachPennant = function(pennant) {
      if (node) {
        node.left = pennant;
        node = pennant;
      } else {
        root = pennant;
        node = pennant;
      }
    };
    for (var i = 0;i < base12.count;++i) {
      var isOne = base12.nextBitIsOne();
      var chunkSize = Math.pow(2, base12.count - (i + 1));
      if (isOne) {
        buildPennant(chunkSize, fb.LLRBNode.BLACK);
      } else {
        buildPennant(chunkSize, fb.LLRBNode.BLACK);
        buildPennant(chunkSize, fb.LLRBNode.RED);
      }
    }
    return root;
  };
  var base12 = new fb.core.snap.Base12Num(childList.length);
  var root = buildFrom12Array(base12);
  if (root !== null) {
    return new fb.core.util.SortedMap(mapSortFn || cmp, root);
  } else {
    return new fb.core.util.SortedMap(mapSortFn || cmp);
  }
};
fb.core.snap.priorityHashText = function(priority) {
  if (typeof priority === "number") {
    return "number:" + fb.core.util.doubleToIEEE754String(priority);
  } else {
    return "string:" + priority;
  }
};
fb.core.snap.validatePriorityNode = function(priorityNode) {
  if (priorityNode.isLeafNode()) {
    var val = priorityNode.val();
    fb.core.util.assert(typeof val === "string" || typeof val === "number" || typeof val === "object" && fb.util.obj.contains(val, ".sv"), "Priority must be a string or number.");
  } else {
    fb.core.util.assert(priorityNode === fb.core.snap.MAX_NODE || priorityNode.isEmpty(), "priority of unexpected type.");
  }
  fb.core.util.assert(priorityNode === fb.core.snap.MAX_NODE || priorityNode.getPriority().isEmpty(), "Priority nodes can't have a priority of their own.");
};
fb.core.snap.EMPTY_NODE = new fb.core.snap.ChildrenNode(new fb.core.util.SortedMap(fb.core.snap.NAME_COMPARATOR), null, fb.core.snap.IndexMap.Default);
fb.core.snap.MAX_NODE_ = function() {
  fb.core.snap.ChildrenNode.call(this, new fb.core.util.SortedMap(fb.core.snap.NAME_COMPARATOR), fb.core.snap.EMPTY_NODE, fb.core.snap.IndexMap.Default);
};
goog.inherits(fb.core.snap.MAX_NODE_, fb.core.snap.ChildrenNode);
fb.core.snap.MAX_NODE_.prototype.compareTo = function(other) {
  if (other === this) {
    return 0;
  } else {
    return 1;
  }
};
fb.core.snap.MAX_NODE_.prototype.equals = function(other) {
  return other === this;
};
fb.core.snap.MAX_NODE_.prototype.getPriority = function() {
  return this;
};
fb.core.snap.MAX_NODE_.prototype.getImmediateChild = function(childName) {
  return fb.core.snap.EMPTY_NODE;
};
fb.core.snap.MAX_NODE_.prototype.isEmpty = function() {
  return false;
};
fb.core.snap.MAX_NODE = new fb.core.snap.MAX_NODE_;
fb.core.snap.NamedNode.MIN = new fb.core.snap.NamedNode(fb.core.util.MIN_NAME, fb.core.snap.EMPTY_NODE);
fb.core.snap.NamedNode.MAX = new fb.core.snap.NamedNode(fb.core.util.MAX_NAME, fb.core.snap.MAX_NODE);
goog.provide("fb.core.view.ViewCache");
goog.require("fb.core.view.CacheNode");
goog.require("fb.core.snap");
fb.core.view.ViewCache = function(eventCache, serverCache) {
  this.eventCache_ = eventCache;
  this.serverCache_ = serverCache;
};
fb.core.view.ViewCache.Empty = new fb.core.view.ViewCache(new fb.core.view.CacheNode(fb.core.snap.EMPTY_NODE, false, false), new fb.core.view.CacheNode(fb.core.snap.EMPTY_NODE, false, false));
fb.core.view.ViewCache.prototype.updateEventSnap = function(eventSnap, complete, filtered) {
  return new fb.core.view.ViewCache(new fb.core.view.CacheNode(eventSnap, complete, filtered), this.serverCache_);
};
fb.core.view.ViewCache.prototype.updateServerSnap = function(serverSnap, complete, filtered) {
  return new fb.core.view.ViewCache(this.eventCache_, new fb.core.view.CacheNode(serverSnap, complete, filtered));
};
fb.core.view.ViewCache.prototype.getEventCache = function() {
  return this.eventCache_;
};
fb.core.view.ViewCache.prototype.getCompleteEventSnap = function() {
  return this.eventCache_.isFullyInitialized() ? this.eventCache_.getNode() : null;
};
fb.core.view.ViewCache.prototype.getServerCache = function() {
  return this.serverCache_;
};
fb.core.view.ViewCache.prototype.getCompleteServerSnap = function() {
  return this.serverCache_.isFullyInitialized() ? this.serverCache_.getNode() : null;
};
goog.provide("fb.core.view.View");
goog.require("fb.core.view.EventGenerator");
goog.require("fb.core.view.ViewCache");
goog.require("fb.core.view.ViewProcessor");
goog.require("fb.core.util");
fb.core.view.View = function(query, initialViewCache) {
  this.query_ = query;
  var params = query.getQueryParams();
  var indexFilter = new fb.core.view.filter.IndexedFilter(params.getIndex());
  var filter = params.getNodeFilter();
  this.processor_ = new fb.core.view.ViewProcessor(filter);
  var initialServerCache = initialViewCache.getServerCache();
  var initialEventCache = initialViewCache.getEventCache();
  var serverSnap = indexFilter.updateFullNode(fb.core.snap.EMPTY_NODE, initialServerCache.getNode(), null);
  var eventSnap = filter.updateFullNode(fb.core.snap.EMPTY_NODE, initialEventCache.getNode(), null);
  var newServerCache = new fb.core.view.CacheNode(serverSnap, initialServerCache.isFullyInitialized(), indexFilter.filtersNodes());
  var newEventCache = new fb.core.view.CacheNode(eventSnap, initialEventCache.isFullyInitialized(), filter.filtersNodes());
  this.viewCache_ = new fb.core.view.ViewCache(newEventCache, newServerCache);
  this.eventRegistrations_ = [];
  this.eventGenerator_ = new fb.core.view.EventGenerator(query);
};
fb.core.view.View.prototype.getQuery = function() {
  return this.query_;
};
fb.core.view.View.prototype.getServerCache = function() {
  return this.viewCache_.getServerCache().getNode();
};
fb.core.view.View.prototype.getCompleteServerCache = function(path) {
  var cache = this.viewCache_.getCompleteServerSnap();
  if (cache) {
    if (this.query_.getQueryParams().loadsAllData() || !path.isEmpty() && !cache.getImmediateChild(path.getFront()).isEmpty()) {
      return cache.getChild(path);
    }
  }
  return null;
};
fb.core.view.View.prototype.isEmpty = function() {
  return this.eventRegistrations_.length === 0;
};
fb.core.view.View.prototype.addEventRegistration = function(eventRegistration) {
  this.eventRegistrations_.push(eventRegistration);
};
fb.core.view.View.prototype.removeEventRegistration = function(eventRegistration, cancelError) {
  var cancelEvents = [];
  if (cancelError) {
    fb.core.util.assert(eventRegistration == null, "A cancel should cancel all event registrations.");
    var path = this.query_.path;
    goog.array.forEach(this.eventRegistrations_, function(registration) {
      cancelError = (cancelError);
      var maybeEvent = registration.createCancelEvent(cancelError, path);
      if (maybeEvent) {
        cancelEvents.push(maybeEvent);
      }
    });
  }
  if (eventRegistration) {
    var remaining = [];
    for (var i = 0;i < this.eventRegistrations_.length;++i) {
      var existing = this.eventRegistrations_[i];
      if (!existing.matches(eventRegistration)) {
        remaining.push(existing);
      } else {
        if (eventRegistration.hasAnyCallback()) {
          remaining = remaining.concat(this.eventRegistrations_.slice(i + 1));
          break;
        }
      }
    }
    this.eventRegistrations_ = remaining;
  } else {
    this.eventRegistrations_ = [];
  }
  return cancelEvents;
};
fb.core.view.View.prototype.applyOperation = function(operation, writesCache, optCompleteServerCache) {
  if (operation.type === fb.core.OperationType.MERGE && operation.source.queryId !== null) {
    fb.core.util.assert(this.viewCache_.getCompleteServerSnap(), "We should always have a full cache before handling merges");
    fb.core.util.assert(this.viewCache_.getCompleteEventSnap(), "Missing event cache, even though we have a server cache");
  }
  var oldViewCache = this.viewCache_;
  var result = this.processor_.applyOperation(oldViewCache, operation, writesCache, optCompleteServerCache);
  this.processor_.assertIndexed(result.viewCache);
  fb.core.util.assert(result.viewCache.getServerCache().isFullyInitialized() || !oldViewCache.getServerCache().isFullyInitialized(), "Once a server snap is complete, it should never go back");
  this.viewCache_ = result.viewCache;
  return this.generateEventsForChanges_(result.changes, result.viewCache.getEventCache().getNode(), null);
};
fb.core.view.View.prototype.getInitialEvents = function(registration) {
  var eventSnap = this.viewCache_.getEventCache();
  var initialChanges = [];
  if (!eventSnap.getNode().isLeafNode()) {
    var eventNode = (eventSnap.getNode());
    eventNode.forEachChild(fb.core.snap.PriorityIndex, function(key, childNode) {
      initialChanges.push(fb.core.view.Change.childAddedChange(key, childNode));
    });
  }
  if (eventSnap.isFullyInitialized()) {
    initialChanges.push(fb.core.view.Change.valueChange(eventSnap.getNode()));
  }
  return this.generateEventsForChanges_(initialChanges, eventSnap.getNode(), registration);
};
fb.core.view.View.prototype.generateEventsForChanges_ = function(changes, eventCache, opt_eventRegistration) {
  var registrations = opt_eventRegistration ? [opt_eventRegistration] : this.eventRegistrations_;
  return this.eventGenerator_.generateEventsForChanges(changes, eventCache, registrations);
};
goog.provide("fb.core.operation.Merge");
goog.require("fb.core.util");
fb.core.operation.Merge = function(source, path, children) {
  this.type = fb.core.OperationType.MERGE;
  this.source = source;
  this.path = path;
  this.children = children;
};
fb.core.operation.Merge.prototype.operationForChild = function(childName) {
  if (this.path.isEmpty()) {
    var childTree = this.children.subtree(new fb.core.util.Path(childName));
    if (childTree.isEmpty()) {
      return null;
    } else {
      if (childTree.value) {
        return new fb.core.operation.Overwrite(this.source, fb.core.util.Path.Empty, childTree.value);
      } else {
        return new fb.core.operation.Merge(this.source, fb.core.util.Path.Empty, childTree);
      }
    }
  } else {
    fb.core.util.assert(this.path.getFront() === childName, "Can't get a merge for a child not on the path of the operation");
    return new fb.core.operation.Merge(this.source, this.path.popFront(), this.children);
  }
};
if (goog.DEBUG) {
  fb.core.operation.Merge.prototype.toString = function() {
    return "Operation(" + this.path + ": " + this.source.toString() + " merge: " + this.children.toString() + ")";
  };
}
;goog.provide("fb.core.Operation");
goog.require("fb.core.operation.AckUserWrite");
goog.require("fb.core.operation.Merge");
goog.require("fb.core.operation.Overwrite");
goog.require("fb.core.operation.ListenComplete");
goog.require("fb.core.util");
fb.core.OperationType = {OVERWRITE:0, MERGE:1, ACK_USER_WRITE:2, LISTEN_COMPLETE:3};
fb.core.Operation = function() {
};
fb.core.Operation.prototype.source;
fb.core.Operation.prototype.type;
fb.core.Operation.prototype.path;
fb.core.Operation.prototype.operationForChild = goog.abstractMethod;
fb.core.OperationSource = function(fromUser, fromServer, queryId, tagged) {
  this.fromUser = fromUser;
  this.fromServer = fromServer;
  this.queryId = queryId;
  this.tagged = tagged;
  fb.core.util.assert(!tagged || fromServer, "Tagged queries must be from server.");
};
fb.core.OperationSource.User = new fb.core.OperationSource(true, false, null, false);
fb.core.OperationSource.Server = new fb.core.OperationSource(false, true, null, false);
fb.core.OperationSource.forServerTaggedQuery = function(queryId) {
  return new fb.core.OperationSource(false, true, queryId, true);
};
if (goog.DEBUG) {
  fb.core.OperationSource.prototype.toString = function() {
    return this.fromUser ? "user" : this.tagged ? "server(queryID=" + this.queryId + ")" : "server";
  };
}
;goog.provide("fb.core.ReadonlyRestClient");
goog.require("fb.core.util");
goog.require("fb.util");
goog.require("fb.util.json");
goog.require("fb.util.jwt");
goog.require("fb.util.obj");
fb.core.ReadonlyRestClient = goog.defineClass(null, {constructor:function(repoInfo, onDataUpdate) {
  this.log_ = fb.core.util.logWrapper("p:rest:");
  this.repoInfo_ = repoInfo;
  this.onDataUpdate_ = onDataUpdate;
  this.credential_ = null;
  this.listens_ = {};
}, listen:function(query, currentHashFn, tag, onComplete) {
  var pathString = query.path.toString();
  this.log_("Listen called for " + pathString + " " + query.queryIdentifier());
  var listenId = fb.core.ReadonlyRestClient.getListenId_(query, tag);
  var thisListen = new Object;
  this.listens_[listenId] = thisListen;
  var queryStringParamaters = query.getQueryParams().toRestQueryStringParameters();
  var self = this;
  this.restRequest_(pathString + ".json", queryStringParamaters, function(error, result) {
    var data = result;
    if (error === 404) {
      data = null;
      error = null;
    }
    if (error === null) {
      self.onDataUpdate_(pathString, data, false, tag);
    }
    if (fb.util.obj.get(self.listens_, listenId) === thisListen) {
      var status;
      if (!error) {
        status = "ok";
      } else {
        if (error == 401) {
          status = "permission_denied";
        } else {
          status = "rest_error:" + error;
        }
      }
      onComplete(status, null);
    }
  });
}, unlisten:function(query, tag) {
  var listenId = fb.core.ReadonlyRestClient.getListenId_(query, tag);
  delete this.listens_[listenId];
}, auth:function(cred, opt_callback, opt_cancelCallback) {
  this.credential_ = cred;
  var res = fb.util.jwt.decode(cred);
  var auth = res.data;
  var expires = res.claims && res.claims["exp"];
  if (opt_callback) {
    opt_callback("ok", {"auth":auth, "expires":expires});
  }
}, unauth:function(onComplete) {
  this.credential_ = null;
  onComplete("ok", null);
}, onDisconnectPut:function(pathString, data, opt_onComplete) {
}, onDisconnectMerge:function(pathString, data, opt_onComplete) {
}, onDisconnectCancel:function(pathString, opt_onComplete) {
}, put:function(pathString, data, opt_onComplete, opt_hash) {
}, merge:function(pathString, data, onComplete, opt_hash) {
}, reportStats:function(stats) {
}, restRequest_:function(pathString, queryStringParameters, callback) {
  queryStringParameters = queryStringParameters || {};
  queryStringParameters["format"] = "export";
  if (this.credential_) {
    queryStringParameters["auth"] = this.credential_;
  }
  var url = (this.repoInfo_.secure ? "https://" : "http://") + this.repoInfo_.host + pathString + "?" + fb.util.querystring(queryStringParameters);
  this.log_("Sending REST request for " + url);
  var xhr = new XMLHttpRequest;
  var self = this;
  xhr.onreadystatechange = function() {
    if (callback && xhr.readyState === 4) {
      self.log_("REST Response for " + url + " received. status:", xhr.status, "response:", xhr.responseText);
      var res = null;
      if (xhr.status >= 200 && xhr.status < 300) {
        try {
          res = fb.util.json.eval(xhr.responseText);
        } catch (e) {
          fb.core.util.warn("Failed to parse JSON response for " + url + ": " + xhr.responseText);
        }
        callback(null, res);
      } else {
        if (xhr.status !== 401 && xhr.status !== 404) {
          fb.core.util.warn("Got unsuccessful REST response for " + url + " Status: " + xhr.status);
        }
        callback(xhr.status);
      }
      callback = null;
    }
  };
  xhr.open("GET", url, true);
  xhr.send();
}, statics:{getListenId_:function(query, opt_tag) {
  if (goog.isDef(opt_tag)) {
    return "tag$" + opt_tag;
  } else {
    fb.core.util.assert(query.getQueryParams().isDefault(), "should have a tag if it's not a default query.");
    return query.path.toString();
  }
}}});
goog.provide("fb.core.util.ImmutableTree");
goog.require("fb.core.util");
goog.require("fb.core.util.Path");
goog.require("fb.core.util.SortedMap");
goog.require("fb.util.json");
goog.require("fb.util.obj");
goog.require("goog.object");
fb.core.util.ImmutableTree = goog.defineClass(null, {constructor:function(value, opt_children) {
  this.value = value;
  this.children = opt_children || fb.core.util.ImmutableTree.EmptyChildren_;
}, statics:{EmptyChildren_:new fb.core.util.SortedMap(fb.core.util.stringCompare), fromObject:function(obj) {
  var tree = fb.core.util.ImmutableTree.Empty;
  goog.object.forEach(obj, function(childSnap, childPath) {
    tree = tree.set(new fb.core.util.Path(childPath), childSnap);
  });
  return tree;
}}, isEmpty:function() {
  return this.value === null && this.children.isEmpty();
}, findRootMostMatchingPathAndValue:function(relativePath, predicate) {
  if (this.value != null && predicate(this.value)) {
    return{path:fb.core.util.Path.Empty, value:this.value};
  } else {
    if (relativePath.isEmpty()) {
      return null;
    } else {
      var front = relativePath.getFront();
      var child = this.children.get(front);
      if (child !== null) {
        var childExistingPathAndValue = child.findRootMostMatchingPathAndValue(relativePath.popFront(), predicate);
        if (childExistingPathAndValue != null) {
          var fullPath = (new fb.core.util.Path(front)).child(childExistingPathAndValue.path);
          return{path:fullPath, value:childExistingPathAndValue.value};
        } else {
          return null;
        }
      } else {
        return null;
      }
    }
  }
}, findRootMostValueAndPath:function(relativePath) {
  return this.findRootMostMatchingPathAndValue(relativePath, function() {
    return true;
  });
}, subtree:function(relativePath) {
  if (relativePath.isEmpty()) {
    return this;
  } else {
    var front = relativePath.getFront();
    var childTree = this.children.get(front);
    if (childTree !== null) {
      return childTree.subtree(relativePath.popFront());
    } else {
      return fb.core.util.ImmutableTree.Empty;
    }
  }
}, set:function(relativePath, toSet) {
  if (relativePath.isEmpty()) {
    return new fb.core.util.ImmutableTree(toSet, this.children);
  } else {
    var front = relativePath.getFront();
    var child = this.children.get(front) || fb.core.util.ImmutableTree.Empty;
    var newChild = child.set(relativePath.popFront(), toSet);
    var newChildren = this.children.insert(front, newChild);
    return new fb.core.util.ImmutableTree(this.value, newChildren);
  }
}, remove:function(relativePath) {
  if (relativePath.isEmpty()) {
    if (this.children.isEmpty()) {
      return fb.core.util.ImmutableTree.Empty;
    } else {
      return new fb.core.util.ImmutableTree(null, this.children);
    }
  } else {
    var front = relativePath.getFront();
    var child = this.children.get(front);
    if (child) {
      var newChild = child.remove(relativePath.popFront());
      var newChildren;
      if (newChild.isEmpty()) {
        newChildren = this.children.remove(front);
      } else {
        newChildren = this.children.insert(front, newChild);
      }
      if (this.value === null && newChildren.isEmpty()) {
        return fb.core.util.ImmutableTree.Empty;
      } else {
        return new fb.core.util.ImmutableTree(this.value, newChildren);
      }
    } else {
      return this;
    }
  }
}, get:function(relativePath) {
  if (relativePath.isEmpty()) {
    return this.value;
  } else {
    var front = relativePath.getFront();
    var child = this.children.get(front);
    if (child) {
      return child.get(relativePath.popFront());
    } else {
      return null;
    }
  }
}, setTree:function(relativePath, newTree) {
  if (relativePath.isEmpty()) {
    return newTree;
  } else {
    var front = relativePath.getFront();
    var child = this.children.get(front) || fb.core.util.ImmutableTree.Empty;
    var newChild = child.setTree(relativePath.popFront(), newTree);
    var newChildren;
    if (newChild.isEmpty()) {
      newChildren = this.children.remove(front);
    } else {
      newChildren = this.children.insert(front, newChild);
    }
    return new fb.core.util.ImmutableTree(this.value, newChildren);
  }
}, fold:function(fn) {
  return this.fold_(fb.core.util.Path.Empty, fn);
}, fold_:function(pathSoFar, fn) {
  var accum = {};
  this.children.inorderTraversal(function(childKey, childTree) {
    accum[childKey] = childTree.fold_(pathSoFar.child(childKey), fn);
  });
  return fn(pathSoFar, this.value, accum);
}, findOnPath:function(path, f) {
  return this.findOnPath_(path, fb.core.util.Path.Empty, f);
}, findOnPath_:function(pathToFollow, pathSoFar, f) {
  var result = this.value ? f(pathSoFar, this.value) : false;
  if (result) {
    return result;
  } else {
    if (pathToFollow.isEmpty()) {
      return null;
    } else {
      var front = pathToFollow.getFront();
      var nextChild = this.children.get(front);
      if (nextChild) {
        return nextChild.findOnPath_(pathToFollow.popFront(), pathSoFar.child(front), f);
      } else {
        return null;
      }
    }
  }
}, foreachOnPathWhile:function(path, f) {
  return this.foreachOnPathWhile_(path, fb.core.util.Path.Empty, f);
}, foreachOnPathWhile_:function(pathToFollow, currentRelativePath, f) {
  if (pathToFollow.isEmpty()) {
    return currentRelativePath;
  } else {
    var shouldContinue = true;
    if (this.value) {
      shouldContinue = f(currentRelativePath, this.value);
    }
    if (shouldContinue === true) {
      var front = pathToFollow.getFront();
      var nextChild = this.children.get(front);
      if (nextChild) {
        return nextChild.foreachOnPath_(pathToFollow.popFront(), currentRelativePath.child(front), f);
      } else {
        return currentRelativePath;
      }
    } else {
      return currentRelativePath;
    }
  }
}, foreachOnPath:function(path, f) {
  return this.foreachOnPath_(path, fb.core.util.Path.Empty, f);
}, foreachOnPath_:function(pathToFollow, currentRelativePath, f) {
  if (pathToFollow.isEmpty()) {
    return this;
  } else {
    if (this.value) {
      f(currentRelativePath, this.value);
    }
    var front = pathToFollow.getFront();
    var nextChild = this.children.get(front);
    if (nextChild) {
      return nextChild.foreachOnPath_(pathToFollow.popFront(), currentRelativePath.child(front), f);
    } else {
      return fb.core.util.ImmutableTree.Empty;
    }
  }
}, foreach:function(f) {
  this.foreach_(fb.core.util.Path.Empty, f);
}, foreach_:function(currentRelativePath, f) {
  this.children.inorderTraversal(function(childName, childTree) {
    childTree.foreach_(currentRelativePath.child(childName), f);
  });
  if (this.value) {
    f(currentRelativePath, this.value);
  }
}, foreachChild:function(f) {
  this.children.inorderTraversal(function(childName, childTree) {
    if (childTree.value) {
      f(childName, childTree.value);
    }
  });
}});
fb.core.util.ImmutableTree.Empty = new fb.core.util.ImmutableTree(null);
if (goog.DEBUG) {
  fb.core.util.ImmutableTree.prototype.toString = function() {
    var json = {};
    this.foreach(function(relativePath, value) {
      var pathString = relativePath.toString();
      json[pathString] = value.toString();
    });
    return fb.util.json.stringify(json);
  };
}
;goog.provide("fb.core.CompoundWrite");
goog.require("fb.core.snap.Node");
goog.require("fb.core.util");
goog.require("fb.core.util.ImmutableTree");
fb.core.CompoundWrite = function(writeTree) {
  this.writeTree_ = writeTree;
};
fb.core.CompoundWrite.Empty = new fb.core.CompoundWrite((new fb.core.util.ImmutableTree(null)));
fb.core.CompoundWrite.prototype.addWrite = function(path, node) {
  if (path.isEmpty()) {
    return new fb.core.CompoundWrite(new fb.core.util.ImmutableTree(node));
  } else {
    var rootmost = this.writeTree_.findRootMostValueAndPath(path);
    if (rootmost != null) {
      var rootMostPath = rootmost.path, value = rootmost.value;
      var relativePath = fb.core.util.Path.relativePath(rootMostPath, path);
      value = value.updateChild(relativePath, node);
      return new fb.core.CompoundWrite(this.writeTree_.set(rootMostPath, value));
    } else {
      var subtree = new fb.core.util.ImmutableTree(node);
      var newWriteTree = this.writeTree_.setTree(path, subtree);
      return new fb.core.CompoundWrite(newWriteTree);
    }
  }
};
fb.core.CompoundWrite.prototype.addWrites = function(path, updates) {
  var newWrite = this;
  fb.util.obj.foreach(updates, function(childKey, node) {
    newWrite = newWrite.addWrite(path.child(childKey), node);
  });
  return newWrite;
};
fb.core.CompoundWrite.prototype.removeWrite = function(path) {
  if (path.isEmpty()) {
    return fb.core.CompoundWrite.Empty;
  } else {
    var newWriteTree = this.writeTree_.setTree(path, fb.core.util.ImmutableTree.Empty);
    return new fb.core.CompoundWrite(newWriteTree);
  }
};
fb.core.CompoundWrite.prototype.hasCompleteWrite = function(path) {
  return this.getCompleteNode(path) != null;
};
fb.core.CompoundWrite.prototype.getCompleteNode = function(path) {
  var rootmost = this.writeTree_.findRootMostValueAndPath(path);
  if (rootmost != null) {
    return this.writeTree_.get(rootmost.path).getChild(fb.core.util.Path.relativePath(rootmost.path, path));
  } else {
    return null;
  }
};
fb.core.CompoundWrite.prototype.getCompleteChildren = function() {
  var children = [];
  var node = this.writeTree_.value;
  if (node != null) {
    if (!node.isLeafNode()) {
      node = (node);
      node.forEachChild(fb.core.snap.PriorityIndex, function(childName, childNode) {
        children.push(new fb.core.snap.NamedNode(childName, childNode));
      });
    }
  } else {
    this.writeTree_.children.inorderTraversal(function(childName, childTree) {
      if (childTree.value != null) {
        children.push(new fb.core.snap.NamedNode(childName, childTree.value));
      }
    });
  }
  return children;
};
fb.core.CompoundWrite.prototype.childCompoundWrite = function(path) {
  if (path.isEmpty()) {
    return this;
  } else {
    var shadowingNode = this.getCompleteNode(path);
    if (shadowingNode != null) {
      return new fb.core.CompoundWrite(new fb.core.util.ImmutableTree(shadowingNode));
    } else {
      return new fb.core.CompoundWrite(this.writeTree_.subtree(path));
    }
  }
};
fb.core.CompoundWrite.prototype.isEmpty = function() {
  return this.writeTree_.isEmpty();
};
fb.core.CompoundWrite.prototype.apply = function(node) {
  return fb.core.CompoundWrite.applySubtreeWrite_(fb.core.util.Path.Empty, this.writeTree_, node);
};
fb.core.CompoundWrite.applySubtreeWrite_ = function(relativePath, writeTree, node) {
  if (writeTree.value != null) {
    return node.updateChild(relativePath, writeTree.value);
  } else {
    var priorityWrite = null;
    writeTree.children.inorderTraversal(function(childKey, childTree) {
      if (childKey === ".priority") {
        fb.core.util.assert(childTree.value !== null, "Priority writes must always be leaf nodes");
        priorityWrite = childTree.value;
      } else {
        node = fb.core.CompoundWrite.applySubtreeWrite_(relativePath.child(childKey), childTree, node);
      }
    });
    if (!node.getChild(relativePath).isEmpty() && priorityWrite !== null) {
      node = node.updateChild(relativePath.child(".priority"), (priorityWrite));
    }
    return node;
  }
};
goog.provide("fb.core.WriteTree");
goog.require("fb.core.CompoundWrite");
goog.require("fb.core.util");
goog.require("fb.core.view.CacheNode");
fb.core.WriteRecord;
fb.core.WriteTree = function() {
  this.visibleWrites_ = (fb.core.CompoundWrite.Empty);
  this.allWrites_ = [];
  this.lastWriteId_ = -1;
};
fb.core.WriteTree.prototype.childWrites = function(path) {
  return new fb.core.WriteTreeRef(path, this);
};
fb.core.WriteTree.prototype.addOverwrite = function(path, snap, writeId, visible) {
  fb.core.util.assert(writeId > this.lastWriteId_, "Stacking an older write on top of newer ones");
  if (!goog.isDef(visible)) {
    visible = true;
  }
  this.allWrites_.push({path:path, snap:snap, writeId:writeId, visible:visible});
  if (visible) {
    this.visibleWrites_ = this.visibleWrites_.addWrite(path, snap);
  }
  this.lastWriteId_ = writeId;
};
fb.core.WriteTree.prototype.addMerge = function(path, changedChildren, writeId) {
  fb.core.util.assert(writeId > this.lastWriteId_, "Stacking an older merge on top of newer ones");
  this.allWrites_.push({path:path, children:changedChildren, writeId:writeId, visible:true});
  this.visibleWrites_ = this.visibleWrites_.addWrites(path, changedChildren);
  this.lastWriteId_ = writeId;
};
fb.core.WriteTree.prototype.removeWrite = function(writeId) {
  var idx = goog.array.findIndex(this.allWrites_, function(s) {
    return s.writeId === writeId;
  });
  fb.core.util.assert(idx >= 0, "removeWrite called with nonexistent writeId.");
  var writeToRemove = this.allWrites_[idx];
  this.allWrites_.splice(idx, 1);
  var removedWriteWasVisible = writeToRemove.visible;
  var removedWriteOverlapsWithOtherWrites = false;
  var i = this.allWrites_.length - 1;
  while (removedWriteWasVisible && i >= 0) {
    var currentWrite = this.allWrites_[i];
    if (currentWrite.visible) {
      if (i >= idx && this.recordContainsPath_(currentWrite, writeToRemove.path)) {
        removedWriteWasVisible = false;
      } else {
        if (writeToRemove.path.contains(currentWrite.path)) {
          removedWriteOverlapsWithOtherWrites = true;
        }
      }
    }
    i--;
  }
  if (!removedWriteWasVisible) {
    return null;
  } else {
    if (removedWriteOverlapsWithOtherWrites) {
      this.resetTree_();
      return writeToRemove.path;
    } else {
      if (writeToRemove.snap) {
        this.visibleWrites_ = this.visibleWrites_.removeWrite(writeToRemove.path);
      } else {
        var children = writeToRemove.children;
        var self = this;
        goog.object.forEach(children, function(childSnap, childName) {
          self.visibleWrites_ = self.visibleWrites_.removeWrite(writeToRemove.path.child(childName));
        });
      }
      return writeToRemove.path;
    }
  }
};
fb.core.WriteTree.prototype.getCompleteWriteData = function(path) {
  return this.visibleWrites_.getCompleteNode(path);
};
fb.core.WriteTree.prototype.calcCompleteEventCache = function(treePath, completeServerCache, writeIdsToExclude, includeHiddenWrites) {
  if (!writeIdsToExclude && !includeHiddenWrites) {
    var shadowingNode = this.visibleWrites_.getCompleteNode(treePath);
    if (shadowingNode != null) {
      return shadowingNode;
    } else {
      var subMerge = this.visibleWrites_.childCompoundWrite(treePath);
      if (subMerge.isEmpty()) {
        return completeServerCache;
      } else {
        if (completeServerCache == null && !subMerge.hasCompleteWrite(fb.core.util.Path.Empty)) {
          return null;
        } else {
          var layeredCache = completeServerCache || fb.core.snap.EMPTY_NODE;
          return subMerge.apply(layeredCache);
        }
      }
    }
  } else {
    var merge = this.visibleWrites_.childCompoundWrite(treePath);
    if (!includeHiddenWrites && merge.isEmpty()) {
      return completeServerCache;
    } else {
      if (!includeHiddenWrites && completeServerCache == null && !merge.hasCompleteWrite(fb.core.util.Path.Empty)) {
        return null;
      } else {
        var filter = function(write) {
          return(write.visible || includeHiddenWrites) && (!writeIdsToExclude || !goog.array.contains(writeIdsToExclude, write.writeId)) && (write.path.contains(treePath) || treePath.contains(write.path));
        };
        var mergeAtPath = fb.core.WriteTree.layerTree_(this.allWrites_, filter, treePath);
        layeredCache = completeServerCache || fb.core.snap.EMPTY_NODE;
        return mergeAtPath.apply(layeredCache);
      }
    }
  }
};
fb.core.WriteTree.prototype.calcCompleteEventChildren = function(treePath, completeServerChildren) {
  var completeChildren = fb.core.snap.EMPTY_NODE;
  var topLevelSet = this.visibleWrites_.getCompleteNode(treePath);
  if (topLevelSet) {
    if (!topLevelSet.isLeafNode()) {
      topLevelSet.forEachChild(fb.core.snap.PriorityIndex, function(childName, childSnap) {
        completeChildren = completeChildren.updateImmediateChild(childName, childSnap);
      });
    }
    return completeChildren;
  } else {
    if (completeServerChildren) {
      var merge = this.visibleWrites_.childCompoundWrite(treePath);
      completeServerChildren.forEachChild(fb.core.snap.PriorityIndex, function(childName, childNode) {
        var node = merge.childCompoundWrite(new fb.core.util.Path(childName)).apply(childNode);
        completeChildren = completeChildren.updateImmediateChild(childName, node);
      });
      goog.array.forEach(merge.getCompleteChildren(), function(namedNode) {
        completeChildren = completeChildren.updateImmediateChild(namedNode.name, namedNode.node);
      });
      return completeChildren;
    } else {
      merge = this.visibleWrites_.childCompoundWrite(treePath);
      goog.array.forEach(merge.getCompleteChildren(), function(namedNode) {
        completeChildren = completeChildren.updateImmediateChild(namedNode.name, namedNode.node);
      });
      return completeChildren;
    }
  }
};
fb.core.WriteTree.prototype.calcEventCacheAfterServerOverwrite = function(treePath, childPath, existingEventSnap, existingServerSnap) {
  fb.core.util.assert(existingEventSnap || existingServerSnap, "Either existingEventSnap or existingServerSnap must exist");
  var path = treePath.child(childPath);
  if (this.visibleWrites_.hasCompleteWrite(path)) {
    return null;
  } else {
    var childMerge = this.visibleWrites_.childCompoundWrite(path);
    if (childMerge.isEmpty()) {
      return existingServerSnap.getChild(childPath);
    } else {
      return childMerge.apply(existingServerSnap.getChild(childPath));
    }
  }
};
fb.core.WriteTree.prototype.calcCompleteChild = function(treePath, childKey, existingServerSnap) {
  var path = treePath.child(childKey);
  var shadowingNode = this.visibleWrites_.getCompleteNode(path);
  if (shadowingNode != null) {
    return shadowingNode;
  } else {
    if (existingServerSnap.isCompleteForChild(childKey)) {
      var childMerge = this.visibleWrites_.childCompoundWrite(path);
      return childMerge.apply(existingServerSnap.getNode().getImmediateChild(childKey));
    } else {
      return null;
    }
  }
};
fb.core.WriteTree.prototype.shadowingWrite = function(path) {
  return this.visibleWrites_.getCompleteNode(path);
};
fb.core.WriteTree.prototype.calcIndexedSlice = function(treePath, completeServerData, startPost, count, reverse, index) {
  var toIterate;
  var merge = this.visibleWrites_.childCompoundWrite(treePath);
  var shadowingNode = merge.getCompleteNode(fb.core.util.Path.Empty);
  if (shadowingNode != null) {
    toIterate = shadowingNode;
  } else {
    if (completeServerData != null) {
      toIterate = merge.apply(completeServerData);
    } else {
      return[];
    }
  }
  toIterate = toIterate.withIndex(index);
  if (!toIterate.isEmpty() && !toIterate.isLeafNode()) {
    var nodes = [];
    var cmp = index.getCompare();
    var iter = reverse ? toIterate.getReverseIteratorFrom(startPost, index) : toIterate.getIteratorFrom(startPost, index);
    var next = iter.getNext();
    while (next && nodes.length < count) {
      if (cmp(next, startPost) !== 0) {
        nodes.push(next);
      }
      next = iter.getNext();
    }
    return nodes;
  } else {
    return[];
  }
};
fb.core.WriteTree.prototype.recordContainsPath_ = function(writeRecord, path) {
  if (writeRecord.snap) {
    return writeRecord.path.contains(path);
  } else {
    return!!goog.object.findKey(writeRecord.children, function(childSnap, childName) {
      return writeRecord.path.child(childName).contains(path);
    });
  }
};
fb.core.WriteTree.prototype.resetTree_ = function() {
  this.visibleWrites_ = fb.core.WriteTree.layerTree_(this.allWrites_, fb.core.WriteTree.DefaultFilter_, fb.core.util.Path.Empty);
  if (this.allWrites_.length > 0) {
    this.lastWriteId_ = this.allWrites_[this.allWrites_.length - 1].writeId;
  } else {
    this.lastWriteId_ = -1;
  }
};
fb.core.WriteTree.DefaultFilter_ = function(write) {
  return write.visible;
};
fb.core.WriteTree.layerTree_ = function(writes, filter, treeRoot) {
  var compoundWrite = fb.core.CompoundWrite.Empty;
  for (var i = 0;i < writes.length;++i) {
    var write = writes[i];
    if (filter(write)) {
      var writePath = write.path;
      var relativePath;
      if (write.snap) {
        if (treeRoot.contains(writePath)) {
          relativePath = fb.core.util.Path.relativePath(treeRoot, writePath);
          compoundWrite = compoundWrite.addWrite(relativePath, write.snap);
        } else {
          if (writePath.contains(treeRoot)) {
            relativePath = fb.core.util.Path.relativePath(writePath, treeRoot);
            compoundWrite = compoundWrite.addWrite(fb.core.util.Path.Empty, write.snap.getChild(relativePath));
          } else {
          }
        }
      } else {
        if (write.children) {
          if (treeRoot.contains(writePath)) {
            relativePath = fb.core.util.Path.relativePath(treeRoot, writePath);
            compoundWrite = compoundWrite.addWrites(relativePath, write.children);
          } else {
            if (writePath.contains(treeRoot)) {
              relativePath = fb.core.util.Path.relativePath(writePath, treeRoot);
              if (relativePath.isEmpty()) {
                compoundWrite = compoundWrite.addWrites(fb.core.util.Path.Empty, write.children);
              } else {
                var child = fb.util.obj.get(write.children, relativePath.getFront());
                if (child) {
                  var deepNode = child.getChild(relativePath.popFront());
                  compoundWrite = compoundWrite.addWrite(fb.core.util.Path.Empty, deepNode);
                }
              }
            } else {
            }
          }
        } else {
          throw fb.core.util.assertionError("WriteRecord should have .snap or .children");
        }
      }
    }
  }
  return compoundWrite;
};
fb.core.WriteTreeRef = function(path, writeTree) {
  this.treePath_ = path;
  this.writeTree_ = writeTree;
};
fb.core.WriteTreeRef.prototype.calcCompleteEventCache = function(completeServerCache, writeIdsToExclude, includeHiddenWrites) {
  return this.writeTree_.calcCompleteEventCache(this.treePath_, completeServerCache, writeIdsToExclude, includeHiddenWrites);
};
fb.core.WriteTreeRef.prototype.calcCompleteEventChildren = function(completeServerChildren) {
  return this.writeTree_.calcCompleteEventChildren(this.treePath_, completeServerChildren);
};
fb.core.WriteTreeRef.prototype.calcEventCacheAfterServerOverwrite = function(path, existingEventSnap, existingServerSnap) {
  return this.writeTree_.calcEventCacheAfterServerOverwrite(this.treePath_, path, existingEventSnap, existingServerSnap);
};
fb.core.WriteTreeRef.prototype.shadowingWrite = function(path) {
  return this.writeTree_.shadowingWrite(this.treePath_.child(path));
};
fb.core.WriteTreeRef.prototype.calcIndexedSlice = function(completeServerData, startPost, count, reverse, index) {
  return this.writeTree_.calcIndexedSlice(this.treePath_, completeServerData, startPost, count, reverse, index);
};
fb.core.WriteTreeRef.prototype.calcCompleteChild = function(childKey, existingServerCache) {
  return this.writeTree_.calcCompleteChild(this.treePath_, childKey, existingServerCache);
};
fb.core.WriteTreeRef.prototype.child = function(childName) {
  return new fb.core.WriteTreeRef(this.treePath_.child(childName), this.writeTree_);
};
goog.provide("fb.core.SyncPoint");
goog.require("fb.core.util");
goog.require("fb.core.util.ImmutableTree");
goog.require("fb.core.view.ViewCache");
goog.require("fb.core.view.EventRegistration");
goog.require("fb.core.view.View");
goog.require("goog.array");
fb.core.SyncPoint = function() {
  this.views_ = {};
};
fb.core.SyncPoint.prototype.isEmpty = function() {
  return goog.object.isEmpty(this.views_);
};
fb.core.SyncPoint.prototype.applyOperation = function(operation, writesCache, optCompleteServerCache) {
  var queryId = operation.source.queryId;
  if (queryId !== null) {
    var view = fb.util.obj.get(this.views_, queryId);
    fb.core.util.assert(view != null, "SyncTree gave us an op for an invalid query.");
    return view.applyOperation(operation, writesCache, optCompleteServerCache);
  } else {
    var events = [];
    goog.object.forEach(this.views_, function(view) {
      events = events.concat(view.applyOperation(operation, writesCache, optCompleteServerCache));
    });
    return events;
  }
};
fb.core.SyncPoint.prototype.addEventRegistration = function(query, eventRegistration, writesCache, serverCache, serverCacheComplete) {
  var queryId = query.queryIdentifier();
  var view = fb.util.obj.get(this.views_, queryId);
  if (!view) {
    var eventCache = writesCache.calcCompleteEventCache(serverCacheComplete ? serverCache : null);
    var eventCacheComplete = false;
    if (eventCache) {
      eventCacheComplete = true;
    } else {
      if (serverCache instanceof fb.core.snap.ChildrenNode) {
        eventCache = writesCache.calcCompleteEventChildren(serverCache);
        eventCacheComplete = false;
      } else {
        eventCache = fb.core.snap.EMPTY_NODE;
        eventCacheComplete = false;
      }
    }
    var viewCache = new fb.core.view.ViewCache(new fb.core.view.CacheNode((eventCache), eventCacheComplete, false), new fb.core.view.CacheNode((serverCache), serverCacheComplete, false));
    view = new fb.core.view.View(query, viewCache);
    this.views_[queryId] = view;
  }
  view.addEventRegistration(eventRegistration);
  return view.getInitialEvents(eventRegistration);
};
fb.core.SyncPoint.prototype.removeEventRegistration = function(query, eventRegistration, cancelError) {
  var queryId = query.queryIdentifier();
  var removed = [];
  var cancelEvents = [];
  var hadCompleteView = this.hasCompleteView();
  if (queryId === "default") {
    var self = this;
    goog.object.forEach(this.views_, function(view, viewQueryId) {
      cancelEvents = cancelEvents.concat(view.removeEventRegistration(eventRegistration, cancelError));
      if (view.isEmpty()) {
        delete self.views_[viewQueryId];
        if (!view.getQuery().getQueryParams().loadsAllData()) {
          removed.push(view.getQuery());
        }
      }
    });
  } else {
    var view = fb.util.obj.get(this.views_, queryId);
    if (view) {
      cancelEvents = cancelEvents.concat(view.removeEventRegistration(eventRegistration, cancelError));
      if (view.isEmpty()) {
        delete this.views_[queryId];
        if (!view.getQuery().getQueryParams().loadsAllData()) {
          removed.push(view.getQuery());
        }
      }
    }
  }
  if (hadCompleteView && !this.hasCompleteView()) {
    removed.push(new Firebase(query.repo, query.path));
  }
  return{removed:removed, events:cancelEvents};
};
fb.core.SyncPoint.prototype.getQueryViews = function() {
  return goog.array.filter(goog.object.getValues(this.views_), function(view) {
    return!view.getQuery().getQueryParams().loadsAllData();
  });
};
fb.core.SyncPoint.prototype.getCompleteServerCache = function(path) {
  var serverCache = null;
  goog.object.forEach(this.views_, function(view) {
    serverCache = serverCache || view.getCompleteServerCache(path);
  });
  return serverCache;
};
fb.core.SyncPoint.prototype.viewForQuery = function(query) {
  var params = query.getQueryParams();
  if (params.loadsAllData()) {
    return this.getCompleteView();
  } else {
    var queryId = query.queryIdentifier();
    return fb.util.obj.get(this.views_, queryId);
  }
};
fb.core.SyncPoint.prototype.viewExistsForQuery = function(query) {
  return this.viewForQuery(query) != null;
};
fb.core.SyncPoint.prototype.hasCompleteView = function() {
  return this.getCompleteView() != null;
};
fb.core.SyncPoint.prototype.getCompleteView = function() {
  var completeView = goog.object.findValue(this.views_, function(view) {
    return view.getQuery().getQueryParams().loadsAllData();
  });
  return completeView || null;
};
goog.provide("fb.core.SyncTree");
goog.require("fb.core.Operation");
goog.require("fb.core.SyncPoint");
goog.require("fb.core.WriteTree");
goog.require("fb.core.util");
fb.core.ListenProvider;
fb.core.SyncTree = function(listenProvider) {
  this.syncPointTree_ = fb.core.util.ImmutableTree.Empty;
  this.pendingWriteTree_ = new fb.core.WriteTree;
  this.tagToQueryMap_ = {};
  this.queryToTagMap_ = {};
  this.listenProvider_ = listenProvider;
};
fb.core.SyncTree.prototype.applyUserOverwrite = function(path, newData, writeId, visible) {
  this.pendingWriteTree_.addOverwrite(path, newData, writeId, visible);
  if (!visible) {
    return[];
  } else {
    return this.applyOperationToSyncPoints_(new fb.core.operation.Overwrite(fb.core.OperationSource.User, path, newData));
  }
};
fb.core.SyncTree.prototype.applyUserMerge = function(path, changedChildren, writeId) {
  this.pendingWriteTree_.addMerge(path, changedChildren, writeId);
  var changeTree = fb.core.util.ImmutableTree.fromObject(changedChildren);
  return this.applyOperationToSyncPoints_(new fb.core.operation.Merge(fb.core.OperationSource.User, path, changeTree));
};
fb.core.SyncTree.prototype.ackUserWrite = function(writeId, revert) {
  revert = revert || false;
  var pathToReevaluate = this.pendingWriteTree_.removeWrite(writeId);
  if (pathToReevaluate == null) {
    return[];
  } else {
    return this.applyOperationToSyncPoints_(new fb.core.operation.AckUserWrite(pathToReevaluate, revert));
  }
};
fb.core.SyncTree.prototype.applyServerOverwrite = function(path, newData) {
  return this.applyOperationToSyncPoints_(new fb.core.operation.Overwrite(fb.core.OperationSource.Server, path, newData));
};
fb.core.SyncTree.prototype.applyServerMerge = function(path, changedChildren) {
  var changeTree = fb.core.util.ImmutableTree.fromObject(changedChildren);
  return this.applyOperationToSyncPoints_(new fb.core.operation.Merge(fb.core.OperationSource.Server, path, changeTree));
};
fb.core.SyncTree.prototype.applyListenComplete = function(path) {
  return this.applyOperationToSyncPoints_(new fb.core.operation.ListenComplete(fb.core.OperationSource.Server, path));
};
fb.core.SyncTree.prototype.applyTaggedQueryOverwrite = function(path, snap, tag) {
  var queryKey = this.queryKeyForTag_(tag);
  if (queryKey != null) {
    var r = this.parseQueryKey_(queryKey);
    var queryPath = r.path, queryId = r.queryId;
    var relativePath = fb.core.util.Path.relativePath(queryPath, path);
    var op = new fb.core.operation.Overwrite(fb.core.OperationSource.forServerTaggedQuery(queryId), relativePath, snap);
    return this.applyTaggedOperation_(queryPath, queryId, op);
  } else {
    return[];
  }
};
fb.core.SyncTree.prototype.applyTaggedQueryMerge = function(path, changedChildren, tag) {
  var queryKey = this.queryKeyForTag_(tag);
  if (queryKey) {
    var r = this.parseQueryKey_(queryKey);
    var queryPath = r.path, queryId = r.queryId;
    var relativePath = fb.core.util.Path.relativePath(queryPath, path);
    var changeTree = fb.core.util.ImmutableTree.fromObject(changedChildren);
    var op = new fb.core.operation.Merge(fb.core.OperationSource.forServerTaggedQuery(queryId), relativePath, changeTree);
    return this.applyTaggedOperation_(queryPath, queryId, op);
  } else {
    return[];
  }
};
fb.core.SyncTree.prototype.applyTaggedListenComplete = function(path, tag) {
  var queryKey = this.queryKeyForTag_(tag);
  if (queryKey) {
    var r = this.parseQueryKey_(queryKey);
    var queryPath = r.path, queryId = r.queryId;
    var relativePath = fb.core.util.Path.relativePath(queryPath, path);
    var op = new fb.core.operation.ListenComplete(fb.core.OperationSource.forServerTaggedQuery(queryId), relativePath);
    return this.applyTaggedOperation_(queryPath, queryId, op);
  } else {
    return[];
  }
};
fb.core.SyncTree.prototype.addEventRegistration = function(query, eventRegistration) {
  var path = query.path;
  var serverCache = null;
  var foundAncestorDefaultView = false;
  this.syncPointTree_.foreachOnPathWhile(path, function(pathToSyncPoint, sp) {
    var relativePath = fb.core.util.Path.relativePath(pathToSyncPoint, path);
    serverCache = sp.getCompleteServerCache(relativePath);
    foundAncestorDefaultView = foundAncestorDefaultView || sp.hasCompleteView();
    return!serverCache;
  });
  var syncPoint = this.syncPointTree_.get(path);
  if (!syncPoint) {
    syncPoint = new fb.core.SyncPoint;
    this.syncPointTree_ = this.syncPointTree_.set(path, syncPoint);
  } else {
    foundAncestorDefaultView = foundAncestorDefaultView || syncPoint.hasCompleteView();
    serverCache = serverCache || syncPoint.getCompleteServerCache(fb.core.util.Path.Empty);
  }
  var serverCacheComplete;
  if (serverCache != null) {
    serverCacheComplete = true;
  } else {
    serverCacheComplete = false;
    serverCache = fb.core.snap.EMPTY_NODE;
    var subtree = this.syncPointTree_.subtree(path);
    subtree.foreachChild(function(childName, childSyncPoint) {
      var completeCache = childSyncPoint.getCompleteServerCache(fb.core.util.Path.Empty);
      if (completeCache) {
        serverCache = serverCache.updateImmediateChild(childName, completeCache);
      }
    });
  }
  var viewAlreadyExists = syncPoint.viewExistsForQuery(query);
  if (!viewAlreadyExists && !query.getQueryParams().loadsAllData()) {
    var queryKey = this.makeQueryKey_(query);
    fb.core.util.assert(!goog.object.containsKey(this.queryToTagMap_, queryKey), "View does not exist, but we have a tag");
    var tag = fb.core.SyncTree.getNextQueryTag_();
    this.queryToTagMap_[queryKey] = tag;
    this.tagToQueryMap_["_" + tag] = queryKey;
  }
  var writesCache = this.pendingWriteTree_.childWrites(path);
  var events = syncPoint.addEventRegistration(query, eventRegistration, writesCache, serverCache, serverCacheComplete);
  if (!viewAlreadyExists && !foundAncestorDefaultView) {
    var view = (syncPoint.viewForQuery(query));
    events = events.concat(this.setupListener_(query, view));
  }
  return events;
};
fb.core.SyncTree.prototype.removeEventRegistration = function(query, eventRegistration, cancelError) {
  var path = query.path;
  var maybeSyncPoint = this.syncPointTree_.get(path);
  var cancelEvents = [];
  if (maybeSyncPoint && (query.queryIdentifier() === "default" || maybeSyncPoint.viewExistsForQuery(query))) {
    var removedAndEvents = maybeSyncPoint.removeEventRegistration(query, eventRegistration, cancelError);
    if (maybeSyncPoint.isEmpty()) {
      this.syncPointTree_ = this.syncPointTree_.remove(path);
    }
    var removed = removedAndEvents.removed;
    cancelEvents = removedAndEvents.events;
    var removingDefault = -1 !== goog.array.findIndex(removed, function(query) {
      return query.getQueryParams().loadsAllData();
    });
    var covered = this.syncPointTree_.findOnPath(path, function(relativePath, parentSyncPoint) {
      return parentSyncPoint.hasCompleteView();
    });
    if (removingDefault && !covered) {
      var subtree = this.syncPointTree_.subtree(path);
      if (!subtree.isEmpty()) {
        var newViews = this.collectDistinctViewsForSubTree_(subtree);
        for (var i = 0;i < newViews.length;++i) {
          var view = newViews[i], newQuery = view.getQuery();
          var listener = this.createListenerForView_(view);
          this.listenProvider_.startListening(newQuery, this.tagForQuery_(newQuery), listener.hashFn, listener.onComplete);
        }
      } else {
      }
    }
    if (!covered && removed.length > 0 && !cancelError) {
      if (removingDefault) {
        var defaultTag = null;
        this.listenProvider_.stopListening(query, defaultTag);
      } else {
        var self = this;
        goog.array.forEach(removed, function(queryToRemove) {
          var queryIdToRemove = queryToRemove.queryIdentifier();
          var tagToRemove = self.queryToTagMap_[self.makeQueryKey_(queryToRemove)];
          self.listenProvider_.stopListening(queryToRemove, tagToRemove);
        });
      }
    }
    this.removeTags_(removed);
  } else {
  }
  return cancelEvents;
};
fb.core.SyncTree.prototype.calcCompleteEventCache = function(path, writeIdsToExclude) {
  var includeHiddenSets = true;
  var writeTree = this.pendingWriteTree_;
  var serverCache = this.syncPointTree_.findOnPath(path, function(pathSoFar, syncPoint) {
    var relativePath = fb.core.util.Path.relativePath(pathSoFar, path);
    var serverCache = syncPoint.getCompleteServerCache(relativePath);
    if (serverCache) {
      return serverCache;
    }
  });
  return writeTree.calcCompleteEventCache(path, serverCache, writeIdsToExclude, includeHiddenSets);
};
fb.core.SyncTree.prototype.collectDistinctViewsForSubTree_ = function(subtree) {
  return subtree.fold(function(relativePath, maybeChildSyncPoint, childMap) {
    if (maybeChildSyncPoint && maybeChildSyncPoint.hasCompleteView()) {
      var completeView = maybeChildSyncPoint.getCompleteView();
      return[completeView];
    } else {
      var views = [];
      if (maybeChildSyncPoint) {
        views = maybeChildSyncPoint.getQueryViews();
      }
      goog.object.forEach(childMap, function(childViews) {
        views = views.concat(childViews);
      });
      return views;
    }
  });
};
fb.core.SyncTree.prototype.removeTags_ = function(queries) {
  for (var j = 0;j < queries.length;++j) {
    var removedQuery = queries[j];
    if (!removedQuery.getQueryParams().loadsAllData()) {
      var removedQueryKey = this.makeQueryKey_(removedQuery);
      var removedQueryTag = this.queryToTagMap_[removedQueryKey];
      delete this.queryToTagMap_[removedQueryKey];
      delete this.tagToQueryMap_["_" + removedQueryTag];
    }
  }
};
fb.core.SyncTree.prototype.setupListener_ = function(query, view) {
  var path = query.path;
  var tag = this.tagForQuery_(query);
  var listener = this.createListenerForView_(view);
  var events = this.listenProvider_.startListening(query, tag, listener.hashFn, listener.onComplete);
  var subtree = this.syncPointTree_.subtree(path);
  if (tag) {
    fb.core.util.assert(!subtree.value.hasCompleteView(), "If we're adding a query, it shouldn't be shadowed");
  } else {
    var queriesToStop = subtree.fold(function(relativePath, maybeChildSyncPoint, childMap) {
      if (!relativePath.isEmpty() && maybeChildSyncPoint && maybeChildSyncPoint.hasCompleteView()) {
        return[maybeChildSyncPoint.getCompleteView().getQuery()];
      } else {
        var queries = [];
        if (maybeChildSyncPoint) {
          queries = queries.concat(goog.array.map(maybeChildSyncPoint.getQueryViews(), function(view) {
            return view.getQuery();
          }));
        }
        goog.object.forEach(childMap, function(childQueries) {
          queries = queries.concat(childQueries);
        });
        return queries;
      }
    });
    for (var i = 0;i < queriesToStop.length;++i) {
      var queryToStop = queriesToStop[i];
      this.listenProvider_.stopListening(queryToStop, this.tagForQuery_(queryToStop));
    }
  }
  return events;
};
fb.core.SyncTree.prototype.createListenerForView_ = function(view) {
  var self = this;
  var query = view.getQuery();
  var tag = this.tagForQuery_(query);
  return{hashFn:function() {
    var cache = view.getServerCache() || fb.core.snap.EMPTY_NODE;
    return cache.hash();
  }, onComplete:function(status, data) {
    if (status === "ok") {
      if (tag) {
        return self.applyTaggedListenComplete(query.path, tag);
      } else {
        return self.applyListenComplete(query.path);
      }
    } else {
      var error = fb.core.util.errorForServerCode(status);
      return self.removeEventRegistration(query, null, error);
    }
  }};
};
fb.core.SyncTree.prototype.makeQueryKey_ = function(query) {
  return query.path.toString() + "$" + query.queryIdentifier();
};
fb.core.SyncTree.prototype.parseQueryKey_ = function(queryKey) {
  var splitIndex = queryKey.indexOf("$");
  fb.core.util.assert(splitIndex !== -1 && splitIndex < queryKey.length - 1, "Bad queryKey.");
  return{queryId:queryKey.substr(splitIndex + 1), path:new fb.core.util.Path(queryKey.substr(0, splitIndex))};
};
fb.core.SyncTree.prototype.queryKeyForTag_ = function(tag) {
  return goog.object.get(this.tagToQueryMap_, "_" + tag);
};
fb.core.SyncTree.prototype.tagForQuery_ = function(query) {
  var queryKey = this.makeQueryKey_(query);
  return fb.util.obj.get(this.queryToTagMap_, queryKey);
};
fb.core.SyncTree.nextQueryTag_ = 1;
fb.core.SyncTree.getNextQueryTag_ = function() {
  return fb.core.SyncTree.nextQueryTag_++;
};
fb.core.SyncTree.prototype.applyTaggedOperation_ = function(queryPath, queryId, operation) {
  var syncPoint = this.syncPointTree_.get(queryPath);
  fb.core.util.assert(syncPoint, "Missing sync point for query tag that we're tracking");
  var writesCache = this.pendingWriteTree_.childWrites(queryPath);
  return syncPoint.applyOperation(operation, writesCache, null);
};
fb.core.SyncTree.prototype.applyOperationToSyncPoints_ = function(operation) {
  return this.applyOperationHelper_(operation, this.syncPointTree_, null, this.pendingWriteTree_.childWrites(fb.core.util.Path.Empty));
};
fb.core.SyncTree.prototype.applyOperationHelper_ = function(operation, syncPointTree, serverCache, writesCache) {
  if (operation.path.isEmpty()) {
    return this.applyOperationDescendantsHelper_(operation, syncPointTree, serverCache, writesCache);
  } else {
    var syncPoint = syncPointTree.get(fb.core.util.Path.Empty);
    if (serverCache == null && syncPoint != null) {
      serverCache = syncPoint.getCompleteServerCache(fb.core.util.Path.Empty);
    }
    var events = [];
    var childName = operation.path.getFront();
    var childOperation = operation.operationForChild(childName);
    var childTree = syncPointTree.children.get(childName);
    if (childTree && childOperation) {
      var childServerCache = serverCache ? serverCache.getImmediateChild(childName) : null;
      var childWritesCache = writesCache.child(childName);
      events = events.concat(this.applyOperationHelper_(childOperation, childTree, childServerCache, childWritesCache));
    }
    if (syncPoint) {
      events = events.concat(syncPoint.applyOperation(operation, writesCache, serverCache));
    }
    return events;
  }
};
fb.core.SyncTree.prototype.applyOperationDescendantsHelper_ = function(operation, syncPointTree, serverCache, writesCache) {
  var syncPoint = syncPointTree.get(fb.core.util.Path.Empty);
  if (serverCache == null && syncPoint != null) {
    serverCache = syncPoint.getCompleteServerCache(fb.core.util.Path.Empty);
  }
  var events = [];
  var self = this;
  syncPointTree.children.inorderTraversal(function(childName, childTree) {
    var childServerCache = serverCache ? serverCache.getImmediateChild(childName) : null;
    var childWritesCache = writesCache.child(childName);
    var childOperation = operation.operationForChild(childName);
    if (childOperation) {
      events = events.concat(self.applyOperationDescendantsHelper_(childOperation, childTree, childServerCache, childWritesCache));
    }
  });
  if (syncPoint) {
    events = events.concat(syncPoint.applyOperation(operation, writesCache, serverCache));
  }
  return events;
};
goog.provide("fb.core.util.Tree");
goog.require("fb.core.util");
goog.require("fb.core.util.Path");
goog.require("fb.util.obj");
goog.require("goog.object");
fb.core.util.TreeNode = goog.defineClass(null, {constructor:function() {
  this.children = {};
  this.childCount = 0;
  this.value = null;
}});
fb.core.util.Tree = goog.defineClass(null, {constructor:function(opt_name, opt_parent, opt_node) {
  this.name_ = opt_name ? opt_name : "";
  this.parent_ = opt_parent ? opt_parent : null;
  this.node_ = opt_node ? opt_node : new fb.core.util.TreeNode;
}, subTree:function(pathObj) {
  var path = pathObj instanceof fb.core.util.Path ? pathObj : new fb.core.util.Path(pathObj);
  var child = this, next;
  while ((next = path.getFront()) !== null) {
    var childNode = fb.util.obj.get(child.node_.children, next) || new fb.core.util.TreeNode;
    child = new fb.core.util.Tree(next, child, childNode);
    path = path.popFront();
  }
  return child;
}, getValue:function() {
  return this.node_.value;
}, setValue:function(value) {
  fb.core.util.assert(typeof value !== "undefined", "Cannot set value to undefined");
  this.node_.value = value;
  this.updateParents_();
}, clear:function() {
  this.node_.value = null;
  this.node_.children = {};
  this.node_.childCount = 0;
  this.updateParents_();
}, hasChildren:function() {
  return this.node_.childCount > 0;
}, isEmpty:function() {
  return this.getValue() === null && !this.hasChildren();
}, forEachChild:function(action) {
  var self = this;
  goog.object.forEach(this.node_.children, function(childTree, child) {
    action(new fb.core.util.Tree(child, self, childTree));
  });
}, forEachDescendant:function(action, opt_includeSelf, opt_childrenFirst) {
  if (opt_includeSelf && !opt_childrenFirst) {
    action(this);
  }
  this.forEachChild(function(child) {
    child.forEachDescendant(action, true, opt_childrenFirst);
  });
  if (opt_includeSelf && opt_childrenFirst) {
    action(this);
  }
}, forEachAncestor:function(action, opt_includeSelf) {
  var node = opt_includeSelf ? this : this.parent();
  while (node !== null) {
    if (action(node)) {
      return true;
    }
    node = node.parent();
  }
  return false;
}, forEachImmediateDescendantWithValue:function(action) {
  this.forEachChild(function(child) {
    if (child.getValue() !== null) {
      action(child);
    } else {
      child.forEachImmediateDescendantWithValue(action);
    }
  });
}, path:function() {
  return new fb.core.util.Path(this.parent_ === null ? this.name_ : this.parent_.path() + "/" + this.name_);
}, name:function() {
  return this.name_;
}, parent:function() {
  return this.parent_;
}, updateParents_:function() {
  if (this.parent_ !== null) {
    this.parent_.updateChild_(this.name_, this);
  }
}, updateChild_:function(childName, child) {
  var childEmpty = child.isEmpty();
  var childExists = fb.util.obj.contains(this.node_.children, childName);
  if (childEmpty && childExists) {
    delete this.node_.children[childName];
    this.node_.childCount--;
    this.updateParents_();
  } else {
    if (!childEmpty && !childExists) {
      this.node_.children[childName] = child.node_;
      this.node_.childCount++;
      this.updateParents_();
    }
  }
}});
goog.provide("fb.core.util.EventEmitter");
goog.require("fb.core.util");
goog.require("goog.array");
fb.core.util.EventEmitter = goog.defineClass(null, {constructor:function(allowedEvents) {
  fb.core.util.assert(goog.isArray(allowedEvents) && allowedEvents.length > 0, "Requires a non-empty array");
  this.allowedEvents_ = allowedEvents;
  this.listeners_ = {};
}, getInitialEvent:goog.abstractMethod, trigger:function(eventType, var_args) {
  var listeners = this.listeners_[eventType] || [];
  for (var i = 0;i < listeners.length;i++) {
    listeners[i].callback.apply(listeners[i].context, Array.prototype.slice.call(arguments, 1));
  }
}, on:function(eventType, callback, context) {
  this.validateEventType_(eventType);
  this.listeners_[eventType] = this.listeners_[eventType] || [];
  this.listeners_[eventType].push({callback:callback, context:context});
  var eventData = this.getInitialEvent(eventType);
  if (eventData) {
    callback.apply(context, eventData);
  }
}, off:function(eventType, callback, context) {
  this.validateEventType_(eventType);
  var listeners = this.listeners_[eventType] || [];
  for (var i = 0;i < listeners.length;i++) {
    if (listeners[i].callback === callback && (!context || context === listeners[i].context)) {
      listeners.splice(i, 1);
      return;
    }
  }
}, validateEventType_:function(eventType) {
  fb.core.util.assert(goog.array.find(this.allowedEvents_, function(et) {
    return et === eventType;
  }), "Unknown event: " + eventType);
}});
goog.provide("fb.core.util.nextPushId");
goog.require("fb.core.util");
fb.core.util.nextPushId = function() {
  var PUSH_CHARS = "-0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ_abcdefghijklmnopqrstuvwxyz";
  var lastPushTime = 0;
  var lastRandChars = [];
  return function(now) {
    var duplicateTime = now === lastPushTime;
    lastPushTime = now;
    var timeStampChars = new Array(8);
    for (var i = 7;i >= 0;i--) {
      timeStampChars[i] = PUSH_CHARS.charAt(now % 64);
      now = Math.floor(now / 64);
    }
    fb.core.util.assert(now === 0, "Cannot push at time == 0");
    var id = timeStampChars.join("");
    if (!duplicateTime) {
      for (i = 0;i < 12;i++) {
        lastRandChars[i] = Math.floor(Math.random() * 64);
      }
    } else {
      for (i = 11;i >= 0 && lastRandChars[i] === 63;i--) {
        lastRandChars[i] = 0;
      }
      lastRandChars[i]++;
    }
    for (i = 0;i < 12;i++) {
      id += PUSH_CHARS.charAt(lastRandChars[i]);
    }
    fb.core.util.assert(id.length === 20, "nextPushId: Length should be 20.");
    return id;
  };
}();
goog.provide("fb.core.util.OnlineMonitor");
goog.require("fb.core.util");
goog.require("fb.core.util.EventEmitter");
fb.core.util.OnlineMonitor = goog.defineClass(fb.core.util.EventEmitter, {constructor:function() {
  fb.core.util.EventEmitter.call(this, ["online"]);
  this.online_ = true;
  if (typeof window !== "undefined" && typeof window.addEventListener !== "undefined") {
    var self = this;
    window.addEventListener("online", function() {
      if (!self.online_) {
        self.online_ = true;
        self.trigger("online", true);
      }
    }, false);
    window.addEventListener("offline", function() {
      if (self.online_) {
        self.online_ = false;
        self.trigger("online", false);
      }
    }, false);
  }
}, getInitialEvent:function(eventType) {
  fb.core.util.assert(eventType === "online", "Unknown event type: " + eventType);
  return[this.online_];
}, currentlyOnline:function() {
  return this.online_;
}});
goog.addSingletonGetter(fb.core.util.OnlineMonitor);
goog.provide("fb.core.util.VisibilityMonitor");
goog.require("fb.core.util");
goog.require("fb.core.util.EventEmitter");
fb.core.util.VisibilityMonitor = goog.defineClass(fb.core.util.EventEmitter, {constructor:function() {
  fb.core.util.EventEmitter.call(this, ["visible"]);
  var hidden, visibilityChange;
  if (typeof document !== "undefined" && typeof document.addEventListener !== "undefined") {
    if (typeof document["hidden"] !== "undefined") {
      visibilityChange = "visibilitychange";
      hidden = "hidden";
    } else {
      if (typeof document["mozHidden"] !== "undefined") {
        visibilityChange = "mozvisibilitychange";
        hidden = "mozHidden";
      } else {
        if (typeof document["msHidden"] !== "undefined") {
          visibilityChange = "msvisibilitychange";
          hidden = "msHidden";
        } else {
          if (typeof document["webkitHidden"] !== "undefined") {
            visibilityChange = "webkitvisibilitychange";
            hidden = "webkitHidden";
          }
        }
      }
    }
  }
  this.visible_ = true;
  if (visibilityChange) {
    var self = this;
    document.addEventListener(visibilityChange, function() {
      var visible = !document[hidden];
      if (visible !== self.visible_) {
        self.visible_ = visible;
        self.trigger("visible", visible);
      }
    }, false);
  }
}, getInitialEvent:function(eventType) {
  fb.core.util.assert(eventType === "visible", "Unknown event type: " + eventType);
  return[this.visible_];
}});
goog.addSingletonGetter(fb.core.util.VisibilityMonitor);
goog.provide("fb.core.util.validation");
goog.require("fb.core.util");
goog.require("fb.core.util.Path");
goog.require("fb.core.util.ValidationPath");
goog.require("fb.util.obj");
goog.require("fb.util.utf8");
goog.require("fb.util.validation");
fb.core.util.validation = {INVALID_KEY_REGEX_:/[\[\].#$\/\u0000-\u001F\u007F]/, INVALID_PATH_REGEX_:/[\[\].#$\u0000-\u001F\u007F]/, MAX_LEAF_SIZE_:10 * 1024 * 1024, isValidKey:function(key) {
  return goog.isString(key) && key.length !== 0 && !fb.core.util.validation.INVALID_KEY_REGEX_.test(key);
}, isValidPathString:function(pathString) {
  return goog.isString(pathString) && pathString.length !== 0 && !fb.core.util.validation.INVALID_PATH_REGEX_.test(pathString);
}, isValidRootPathString:function(pathString) {
  if (pathString) {
    pathString = pathString.replace(/^\/*\.info(\/|$)/, "/");
  }
  return fb.core.util.validation.isValidPathString(pathString);
}, isValidPriority:function(priority) {
  return priority === null || goog.isString(priority) || goog.isNumber(priority) && !fb.core.util.isInvalidJSONNumber(priority) || goog.isObject(priority) && fb.util.obj.contains(priority, ".sv");
}, validateFirebaseDataArg:function(fnName, argumentNumber, data, path, optional) {
  if (optional && !goog.isDef(data)) {
    return;
  }
  fb.core.util.validation.validateFirebaseData(fb.util.validation.errorPrefix(fnName, argumentNumber, optional), data, path);
}, validateFirebaseData:function(errorPrefix, data, path) {
  if (path instanceof fb.core.util.Path) {
    path = new fb.core.util.ValidationPath(path, errorPrefix);
  }
  if (!goog.isDef(data)) {
    throw new Error(errorPrefix + "contains undefined " + path.toErrorString());
  }
  if (goog.isFunction(data)) {
    throw new Error(errorPrefix + "contains a function " + path.toErrorString() + " with contents: " + data.toString());
  }
  if (fb.core.util.isInvalidJSONNumber(data)) {
    throw new Error(errorPrefix + "contains " + data.toString() + " " + path.toErrorString());
  }
  if (goog.isString(data) && data.length > fb.core.util.validation.MAX_LEAF_SIZE_ / 3 && fb.util.utf8.stringLength(data) > fb.core.util.validation.MAX_LEAF_SIZE_) {
    throw new Error(errorPrefix + "contains a string greater than " + fb.core.util.validation.MAX_LEAF_SIZE_ + " utf8 bytes " + path.toErrorString() + " ('" + data.substring(0, 50) + "...')");
  }
  if (goog.isObject(data)) {
    var hasDotValue = false, hasActualChild = false;
    fb.util.obj.foreach(data, function(key, value) {
      if (key === ".value") {
        hasDotValue = true;
      } else {
        if (key !== ".priority" && key !== ".sv") {
          hasActualChild = true;
          if (!fb.core.util.validation.isValidKey(key)) {
            throw new Error(errorPrefix + " contains an invalid key (" + key + ") " + path.toErrorString() + ".  Keys must be non-empty strings " + 'and can\'t contain ".", "#", "$", "/", "[", or "]"');
          }
        }
      }
      path.push(key);
      fb.core.util.validation.validateFirebaseData(errorPrefix, value, path);
      path.pop();
    });
    if (hasDotValue && hasActualChild) {
      throw new Error(errorPrefix + ' contains ".value" child ' + path.toErrorString() + " in addition to actual children.");
    }
  }
}, validateFirebaseMergeDataArg:function(fnName, argumentNumber, data, path, optional) {
  if (optional && !goog.isDef(data)) {
    return;
  }
  if (!goog.isObject(data) || goog.isArray(data)) {
    throw new Error(fb.util.validation.errorPrefix(fnName, argumentNumber, optional) + " must be an Object containing " + "the children to replace.");
  }
  if (fb.util.obj.contains(data, ".value")) {
    throw new Error(fb.util.validation.errorPrefix(fnName, argumentNumber, optional) + ' must not contain ".value".  ' + "To overwrite with a leaf value, just use .set() instead.");
  }
  fb.core.util.validation.validateFirebaseDataArg(fnName, argumentNumber, data, path, optional);
}, validatePriority:function(fnName, argumentNumber, priority, optional) {
  if (optional && !goog.isDef(priority)) {
    return;
  }
  if (fb.core.util.isInvalidJSONNumber(priority)) {
    throw new Error(fb.util.validation.errorPrefix(fnName, argumentNumber, optional) + "is " + priority.toString() + ", but must be a valid Firebase priority (a string, finite number, " + "server value, or null).");
  }
  if (!fb.core.util.validation.isValidPriority(priority)) {
    throw new Error(fb.util.validation.errorPrefix(fnName, argumentNumber, optional) + "must be a valid Firebase priority " + "(a string, finite number, server value, or null).");
  }
}, validateEventType:function(fnName, argumentNumber, eventType, optional) {
  if (optional && !goog.isDef(eventType)) {
    return;
  }
  switch(eventType) {
    case "value":
    ;
    case "child_added":
    ;
    case "child_removed":
    ;
    case "child_changed":
    ;
    case "child_moved":
      break;
    default:
      throw new Error(fb.util.validation.errorPrefix(fnName, argumentNumber, optional) + 'must be a valid event type: "value", "child_added", "child_removed", ' + '"child_changed", or "child_moved".');;
  }
}, validateKey:function(fnName, argumentNumber, key, optional) {
  if (optional && !goog.isDef(key)) {
    return;
  }
  if (!fb.core.util.validation.isValidKey(key)) {
    throw new Error(fb.util.validation.errorPrefix(fnName, argumentNumber, optional) + 'was an invalid key: "' + key + '".  Firebase keys must be non-empty strings and ' + 'can\'t contain ".", "#", "$", "/", "[", or "]").');
  }
}, validatePathString:function(fnName, argumentNumber, pathString, optional) {
  if (optional && !goog.isDef(pathString)) {
    return;
  }
  if (!fb.core.util.validation.isValidPathString(pathString)) {
    throw new Error(fb.util.validation.errorPrefix(fnName, argumentNumber, optional) + 'was an invalid path: "' + pathString + '". Paths must be non-empty strings and ' + 'can\'t contain ".", "#", "$", "[", or "]"');
  }
}, validateRootPathString:function(fnName, argumentNumber, pathString, optional) {
  if (pathString) {
    pathString = pathString.replace(/^\/*\.info(\/|$)/, "/");
  }
  fb.core.util.validation.validatePathString(fnName, argumentNumber, pathString, optional);
}, validateWritablePath:function(fnName, path) {
  if (path.getFront() === ".info") {
    throw new Error(fnName + " failed: Can't modify data under /.info/");
  }
}, validateUrl:function(fnName, argumentNumber, parsedUrl) {
  var pathString = parsedUrl.path.toString();
  if (!goog.isString(parsedUrl.repoInfo.host) || parsedUrl.repoInfo.host.length === 0 || !fb.core.util.validation.isValidKey(parsedUrl.repoInfo.namespace) || pathString.length !== 0 && !fb.core.util.validation.isValidRootPathString(pathString)) {
    throw new Error(fb.util.validation.errorPrefix(fnName, argumentNumber, false) + "must be a valid firebase URL and " + 'the path can\'t contain ".", "#", "$", "[", or "]".');
  }
}, validateCredential:function(fnName, argumentNumber, cred, optional) {
  if (optional && !goog.isDef(cred)) {
    return;
  }
  if (!goog.isString(cred)) {
    throw new Error(fb.util.validation.errorPrefix(fnName, argumentNumber, optional) + "must be a valid credential (a string).");
  }
}, validateBoolean:function(fnName, argumentNumber, bool, optional) {
  if (optional && !goog.isDef(bool)) {
    return;
  }
  if (!goog.isBoolean(bool)) {
    throw new Error(fb.util.validation.errorPrefix(fnName, argumentNumber, optional) + "must be a boolean.");
  }
}, validateString:function(fnName, argumentNumber, string, optional) {
  if (optional && !goog.isDef(string)) {
    return;
  }
  if (!goog.isString(string)) {
    throw new Error(fb.util.validation.errorPrefix(fnName, argumentNumber, optional) + "must be a valid string.");
  }
}, validateObject:function(fnName, argumentNumber, obj, optional) {
  if (optional && !goog.isDef(obj)) {
    return;
  }
  if (!goog.isObject(obj) || obj === null) {
    throw new Error(fb.util.validation.errorPrefix(fnName, argumentNumber, optional) + "must be a valid object.");
  }
}, validateObjectContainsKey:function(fnName, argumentNumber, obj, key, optional, opt_type) {
  if (optional && !goog.isDef(obj)) {
    return;
  }
  if (!goog.isObject(obj) || obj === null || !fb.util.obj.contains(obj, key)) {
    throw new Error(fb.util.validation.errorPrefix(fnName, argumentNumber, optional) + 'must contain the key "' + key + '"');
  }
  if (opt_type) {
    var val = fb.util.obj.get(obj, key);
    if (opt_type === "string" && !goog.isString(val) || opt_type === "boolean" && !goog.isBoolean(val) || opt_type === "function" && !goog.isFunction(val) || opt_type === "object" && !goog.isObject(val)) {
      throw new Error(fb.util.validation.errorPrefix(fnName, argumentNumber, optional) + 'must contain the key "' + key + '" with type "' + opt_type + '"');
    }
  }
}};
goog.provide("fb.core.util.CountedSet");
goog.require("fb.core.util");
goog.require("fb.util.obj");
goog.require("goog.object");
fb.core.util.CountedSet = goog.defineClass(null, {constructor:function() {
  this.set = {};
}, add:function(item, val) {
  this.set[item] = val !== null ? val : true;
}, contains:function(key) {
  return fb.util.obj.contains(this.set, key);
}, get:function(item) {
  return this.contains(item) ? this.set[item] : undefined;
}, remove:function(item) {
  delete this.set[item];
}, clear:function() {
  this.set = {};
}, isEmpty:function() {
  return goog.object.isEmpty(this.set);
}, count:function() {
  return goog.object.getCount(this.set);
}, each:function(fn) {
  goog.object.forEach(this.set, function(v, k) {
    fn(k, v);
  });
}, keys:function() {
  var keys = [];
  goog.object.forEach(this.set, function(v, k) {
    keys.push(k);
  });
  return keys;
}});
goog.provide("fb.core.SparseSnapshotTree");
goog.require("fb.core.snap.Node");
goog.require("fb.core.snap.PriorityIndex");
goog.require("fb.core.util.CountedSet");
goog.require("fb.core.util.Path");
fb.core.SparseSnapshotTree = function() {
  this.value_ = null;
  this.children_ = null;
};
fb.core.SparseSnapshotTree.prototype.find = function(path) {
  if (this.value_ != null) {
    return this.value_.getChild(path);
  } else {
    if (!path.isEmpty() && this.children_ != null) {
      var childKey = path.getFront();
      path = path.popFront();
      if (this.children_.contains(childKey)) {
        var childTree = this.children_.get(childKey);
        return childTree.find(path);
      } else {
        return null;
      }
    } else {
      return null;
    }
  }
};
fb.core.SparseSnapshotTree.prototype.remember = function(path, data) {
  if (path.isEmpty()) {
    this.value_ = data;
    this.children_ = null;
  } else {
    if (this.value_ !== null) {
      this.value_ = this.value_.updateChild(path, data);
    } else {
      if (this.children_ == null) {
        this.children_ = new fb.core.util.CountedSet;
      }
      var childKey = path.getFront();
      if (!this.children_.contains(childKey)) {
        this.children_.add(childKey, new fb.core.SparseSnapshotTree);
      }
      var child = this.children_.get(childKey);
      path = path.popFront();
      child.remember(path, data);
    }
  }
};
fb.core.SparseSnapshotTree.prototype.forget = function(path) {
  if (path.isEmpty()) {
    this.value_ = null;
    this.children_ = null;
    return true;
  } else {
    if (this.value_ !== null) {
      if (this.value_.isLeafNode()) {
        return false;
      } else {
        var value = this.value_;
        this.value_ = null;
        var self = this;
        value.forEachChild(fb.core.snap.PriorityIndex, function(key, tree) {
          self.remember(new fb.core.util.Path(key), tree);
        });
        return this.forget(path);
      }
    } else {
      if (this.children_ !== null) {
        var childKey = path.getFront();
        path = path.popFront();
        if (this.children_.contains(childKey)) {
          var safeToRemove = this.children_.get(childKey).forget(path);
          if (safeToRemove) {
            this.children_.remove(childKey);
          }
        }
        if (this.children_.isEmpty()) {
          this.children_ = null;
          return true;
        } else {
          return false;
        }
      } else {
        return true;
      }
    }
  }
};
fb.core.SparseSnapshotTree.prototype.forEachTree = function(prefixPath, func) {
  if (this.value_ !== null) {
    func(prefixPath, this.value_);
  } else {
    this.forEachChild(function(key, tree) {
      var path = new fb.core.util.Path(prefixPath.toString() + "/" + key);
      tree.forEachTree(path, func);
    });
  }
};
fb.core.SparseSnapshotTree.prototype.forEachChild = function(func) {
  if (this.children_ !== null) {
    this.children_.each(function(key, tree) {
      func(key, tree);
    });
  }
};
goog.provide("fb.login.Constants");
fb.login.Constants = {SESSION_PERSISTENCE_KEY_PREFIX:"session", DEFAULT_SERVER_HOST:"auth.firebase.com", SERVER_HOST:"auth.firebase.com", API_VERSION:"v2", POPUP_PATH_TO_CHANNEL:"/auth/channel", POPUP_RELAY_FRAME_NAME:"__winchan_relay_frame", POPUP_CLOSE_CMD:"die", JSONP_CALLBACK_NAMESPACE:"__firebase_auth_jsonp", REDIR_REQUEST_ID_KEY:"redirect_request_id", REDIR_REQUEST_COMPLETION_KEY:"__firebase_request_key", REDIR_CLIENT_OPTIONS_KEY:"redirect_client_options", INTERNAL_REDIRECT_SENTINAL_PATH:"/blank/page.html", 
CLIENT_OPTION_SESSION_PERSISTENCE:"remember", CLIENT_OPTION_REDIRECT_TO:"redirectTo"};
goog.provide("fb.login.RequestInfo");
goog.require("fb.login.Constants");
fb.login.RequestInfo = function(opt_clientOptions, opt_transportOptions, opt_serverParams) {
  this.clientOptions = opt_clientOptions || {};
  this.transportOptions = opt_transportOptions || {};
  this.serverParams = opt_serverParams || {};
  if (!this.clientOptions[fb.login.Constants.CLIENT_OPTION_SESSION_PERSISTENCE]) {
    this.clientOptions[fb.login.Constants.CLIENT_OPTION_SESSION_PERSISTENCE] = "default";
  }
};
fb.login.RequestInfo.CLIENT_OPTIONS = [fb.login.Constants.CLIENT_OPTION_SESSION_PERSISTENCE, fb.login.Constants.CLIENT_OPTION_REDIRECT_TO];
fb.login.RequestInfo.fromParams = function(opt_params) {
  var clientOptions = {}, serverParams = {};
  fb.util.obj.foreach(opt_params || {}, function(param, value) {
    if (goog.array.contains(fb.login.RequestInfo.CLIENT_OPTIONS, param)) {
      clientOptions[param] = value;
    } else {
      serverParams[param] = value;
    }
  });
  return new fb.login.RequestInfo(clientOptions, {}, serverParams);
};
goog.provide("fb.login.SessionManager");
goog.require("fb.core.storage");
goog.require("fb.login.Constants");
goog.require("fb.util.json");
goog.require("fb.util.jwt");
fb.login.SessionManager = function(repoInfo, stores) {
  this.persistenceKey_ = [fb.login.Constants.SESSION_PERSISTENCE_KEY_PREFIX, repoInfo.persistenceKey, repoInfo.namespace].join(":");
  this.stores_ = stores;
};
fb.login.SessionManager.prototype.set = function(data, store) {
  if (!store) {
    if (this.stores_.length) {
      store = this.stores_[0];
    } else {
      throw new Error("fb.login.SessionManager : No storage options available!");
    }
  }
  store.set(this.persistenceKey_, data);
};
fb.login.SessionManager.prototype.get = function() {
  var sessions = goog.array.map(this.stores_, goog.bind(this.getFromStore_, this));
  sessions = goog.array.filter(sessions, function(session) {
    return session !== null;
  });
  goog.array.sort(sessions, function(a, b) {
    return fb.util.jwt.issuedAtTime(b["token"]) - fb.util.jwt.issuedAtTime(a["token"]);
  });
  if (sessions.length > 0) {
    return sessions.shift();
  }
  return null;
};
fb.login.SessionManager.prototype.getFromStore_ = function(store) {
  try {
    var session = store.get(this.persistenceKey_);
    if (session && session["token"]) {
      return session;
    }
  } catch (e) {
  }
  return null;
};
fb.login.SessionManager.prototype.clear = function(store) {
  var stores = store ? [store] : this.stores_, self = this;
  goog.array.forEach(this.stores_, function(store) {
    store.remove(self.persistenceKey_);
  });
};
goog.provide("fb.login.util.environment");
fb.login.util.environment.isMobileWrapper = function() {
  return fb.login.util.environment.isMobileCordova() || fb.login.util.environment.isMobileWindows() || fb.login.util.environment.isIosWebview();
};
fb.login.util.environment.isMobileCordova = function() {
  return typeof window !== "undefined" && !!(window["cordova"] || window["phonegap"] || window["PhoneGap"]) && /ios|iphone|ipod|ipad|android|blackberry|iemobile/i.test(navigator["userAgent"]);
};
fb.login.util.environment.isMobileWindows = function() {
  return typeof navigator !== "undefined" && (!!navigator["userAgent"].match(/Windows Phone/) || !!window["Windows"] && /^ms-appx:/.test(location.href));
};
fb.login.util.environment.isMobileFirefox = function() {
  return typeof navigator !== "undefined" && (navigator["userAgent"].indexOf("Fennec/") !== -1 || navigator["userAgent"].indexOf("Firefox/") !== -1 && navigator["userAgent"].indexOf("Android") !== -1);
};
fb.login.util.environment.isIosWebview = function() {
  return typeof navigator !== "undefined" && typeof window !== "undefined" && !!(navigator["userAgent"].match(/(iPhone|iPod|iPad).*AppleWebKit(?!.*Safari)/i) || navigator["userAgent"].match(/CriOS/) || navigator["userAgent"].match(/Twitter for iPhone/) || navigator["userAgent"].match(/FBAN\/FBIOS/) || window["navigator"]["standalone"]);
};
fb.login.util.environment.isHeadlessBrowser = function() {
  return typeof navigator !== "undefined" && !!navigator["userAgent"].match(/PhantomJS/);
};
fb.login.util.environment.isLocalFile = function() {
  return typeof location !== "undefined" && /^file:\//.test(location.href);
};
fb.login.util.environment.isIE = function() {
  return typeof navigator !== "undefined" && !!(navigator["userAgent"].match(/MSIE/) || navigator["userAgent"].match(/Trident/));
};
fb.login.util.environment.isModernIE = function() {
  if (typeof navigator === "undefined") {
    return false;
  }
  var ua = navigator["userAgent"], match;
  if (navigator["appName"] === "Microsoft Internet Explorer") {
    match = ua.match(/MSIE ([0-9]{1,}[\.0-9]{0,})/);
    if (match && match.length > 1) {
      return parseFloat(match[1]) >= 8;
    }
  } else {
    if (ua.indexOf("Trident") > -1) {
      match = ua.match(/rv:([0-9]{2,2}[\.0-9]{0,})/);
      if (match && match.length > 1) {
        return parseFloat(match[1]) >= 8;
      }
    }
  }
  return false;
};
goog.provide("fb.login.transports.util");
goog.require("fb.login.Constants");
goog.require("fb.util");
fb.login.transports.util.findRelay = function() {
  var loc = window["location"], frames = window["opener"]["frames"], i;
  for (i = frames.length - 1;i >= 0;i--) {
    try {
      if (frames[i]["location"]["protocol"] === window["location"]["protocol"] && frames[i]["location"]["host"] === window["location"]["host"] && frames[i]["name"] === fb.login.Constants.POPUP_RELAY_FRAME_NAME) {
        return frames[i];
      }
    } catch (e) {
    }
  }
  return null;
};
fb.login.transports.util.addListener = function(target, event, cb) {
  if (target["attachEvent"]) {
    target["attachEvent"]("on" + event, cb);
  } else {
    if (target["addEventListener"]) {
      target["addEventListener"](event, cb, false);
    }
  }
};
fb.login.transports.util.removeListener = function(target, event, cb) {
  if (target["detachEvent"]) {
    target["detachEvent"]("on" + event, cb);
  } else {
    if (target["removeEventListener"]) {
      target["removeEventListener"](event, cb, false);
    }
  }
};
fb.login.transports.util.extractOrigin = function(url) {
  if (!/^https?:\/\//.test(url)) {
    url = window["location"]["href"];
  }
  var m = /^(https?:\/\/[\-_a-zA-Z\.0-9:]+)/.exec(url);
  if (m) {
    return m[1];
  }
  return url;
};
fb.login.transports.util.extractRedirectCompletionHash = function(hashStr) {
  var hash = "";
  try {
    hashStr = hashStr.replace("#", "");
    var hashObj = fb.util.querystringDecode(hashStr);
    if (hashObj && fb.util.obj.contains(hashObj, fb.login.Constants.REDIR_REQUEST_COMPLETION_KEY)) {
      hash = fb.util.obj.get(hashObj, fb.login.Constants.REDIR_REQUEST_COMPLETION_KEY);
    }
  } catch (e) {
  }
  return hash;
};
fb.login.transports.util.replaceRedirectCompletionHash = function() {
  try {
    var exp = new RegExp("&" + fb.login.Constants.REDIR_REQUEST_COMPLETION_KEY + "=([a-zA-z0-9]*)");
    document.location.hash = document.location.hash.replace(exp, "");
  } catch (e) {
  }
};
fb.login.transports.util.getBaseUrl = function() {
  var parsedUrl = fb.core.util.parseURL(fb.login.Constants.SERVER_HOST);
  return parsedUrl.scheme + "://" + parsedUrl.host + "/" + fb.login.Constants.API_VERSION;
};
fb.login.transports.util.getPopupChannelUrl = function(namespace) {
  return fb.login.transports.util.getBaseUrl() + "/" + namespace + fb.login.Constants.POPUP_PATH_TO_CHANNEL;
};
goog.provide("fb.login.Transport");
fb.login.Transport = function(options) {
};
fb.login.Transport.isAvailable = function() {
};
fb.login.Transport.prototype.open = function(url, params, onComplete) {
};
fb.login.Transport.prototype.classification = function() {
};
goog.provide("fb.login.transports.PopupReceiver");
goog.require("fb.login.Constants");
goog.require("fb.login.Transport");
goog.require("fb.login.transports.util");
goog.require("fb.login.util.environment");
goog.require("fb.util.json");
fb.login.transports.PopupReceiver = function(cb) {
  var self = this;
  this.cb = cb;
  this.targetOrigin = "*";
  if (fb.login.util.environment.isModernIE()) {
    this.messageTarget = this.inboundTarget = fb.login.transports.util.findRelay();
  } else {
    this.messageTarget = window["opener"];
    this.inboundTarget = window;
  }
  if (!self.messageTarget) {
    throw "Unable to find relay frame";
  }
  fb.login.transports.util.addListener(this.inboundTarget, "message", goog.bind(this.onMessage_, this));
  fb.login.transports.util.addListener(this.inboundTarget, "message", goog.bind(this.onDie_, this));
  try {
    this.doPost_({"a":"ready"});
  } catch (e) {
    fb.login.transports.util.addListener(this.messageTarget, "load", function(e) {
      self.doPost_({"a":"ready"});
    });
  }
  fb.login.transports.util.addListener(window, "unload", goog.bind(this.onUnload_, this));
};
fb.login.transports.PopupReceiver.prototype.doPost_ = function(msg) {
  msg = fb.util.json.stringify(msg);
  if (fb.login.util.environment.isModernIE()) {
    this.messageTarget["doPost"](msg, this.targetOrigin);
  } else {
    this.messageTarget["postMessage"](msg, this.targetOrigin);
  }
};
fb.login.transports.PopupReceiver.prototype.onMessage_ = function(e) {
  var self = this, d;
  try {
    d = fb.util.json.eval(e["data"]);
  } catch (err) {
  }
  if (!d || d["a"] !== "request") {
    return;
  }
  fb.login.transports.util.removeListener(window, "message", this.onMessage_);
  this.targetOrigin = e["origin"];
  if (this.cb) {
    setTimeout(function() {
      self.cb(self.targetOrigin, d["d"], function(response, forceKeepWindowOpen) {
        self.autoClose = !forceKeepWindowOpen;
        self.cb = undefined;
        self.doPost_({"a":"response", "d":response, "forceKeepWindowOpen":forceKeepWindowOpen});
      });
    }, 0);
  }
};
fb.login.transports.PopupReceiver.prototype.onUnload_ = function() {
  try {
    fb.login.transports.util.removeListener(this.inboundTarget, "message", this.onDie_);
  } catch (err) {
  }
  if (this.cb) {
    this.doPost_({"a":"error", "d":"unknown closed window"});
    this.cb = undefined;
  }
  try {
    window.close();
  } catch (err) {
  }
};
fb.login.transports.PopupReceiver.prototype.onDie_ = function(e) {
  if (this.autoClose && e["data"] === fb.login.Constants.POPUP_CLOSE_CMD) {
    try {
      window.close();
    } catch (err) {
    }
  }
};
goog.provide("fb.login.transports.Redirect");
goog.require("fb.constants");
goog.require("fb.core.storage");
goog.require("fb.login.Transport");
goog.require("fb.login.transports.util");
goog.require("fb.util");
fb.login.transports.Redirect = function(options) {
  this.requestId_ = goog.string.getRandomString() + goog.string.getRandomString() + goog.string.getRandomString();
  this.options_ = options;
};
fb.login.transports.Redirect.prototype.open = function(url, params, cb) {
  fb.core.storage.SessionStorage.set(fb.login.Constants.REDIR_REQUEST_ID_KEY, this.requestId_);
  fb.core.storage.SessionStorage.set(fb.login.Constants.REDIR_REQUEST_ID_KEY, this.requestId_);
  params["requestId"] = this.requestId_;
  params["redirectTo"] = params["redirectTo"] || window["location"]["href"];
  url += (/\?/.test(url) ? "" : "?") + fb.util.querystring(params);
  window["location"] = url;
};
fb.login.transports.Redirect["isAvailable"] = function() {
  return!NODE_CLIENT && !fb.login.util.environment.isLocalFile() && !fb.login.util.environment.isMobileCordova();
};
fb.login.transports.Redirect.prototype.classification = function() {
  return "redirect";
};
goog.provide("fb.login.Errors");
var errors = {"NETWORK_ERROR":"Unable to contact the Firebase server.", "SERVER_ERROR":"An unknown server error occurred.", "TRANSPORT_UNAVAILABLE":"There are no login transports available for the requested method.", "REQUEST_INTERRUPTED":"The browser redirected the page before the login request could complete.", "USER_CANCELLED":"The user cancelled authentication."};
fb.login.Errors.get = function(code) {
  var msg = fb.util.obj.get(errors, code);
  var e = new Error(msg, code);
  e["code"] = code;
  return e;
};
goog.provide("fb.login.transports.Popup");
goog.require("fb.core.util");
goog.require("fb.login.Constants");
goog.require("fb.login.Errors");
goog.require("fb.login.Transport");
goog.require("fb.login.transports.util");
goog.require("fb.login.util.environment");
goog.require("fb.util");
goog.require("fb.util.json");
fb.login.transports.Popup = function(options) {
  if (!options["window_features"] || fb.login.util.environment.isMobileFirefox()) {
    options["window_features"] = undefined;
  }
  if (!options["window_name"]) {
    options["window_name"] = "_blank";
  }
  this.options = options;
};
fb.login.transports.Popup.prototype.open = function(url, params, cb) {
  var self = this, isIE = fb.login.util.environment.isModernIE(), iframe, messageTarget;
  if (!this.options["relay_url"]) {
    return cb(new Error("invalid arguments: origin of url and relay_url must match"));
  }
  var origin = fb.login.transports.util.extractOrigin(url);
  if (origin !== fb.login.transports.util.extractOrigin(self.options["relay_url"])) {
    if (cb) {
      setTimeout(function() {
        cb(new Error("invalid arguments: origin of url and relay_url must match"));
      }, 0);
    }
    return;
  }
  if (isIE) {
    iframe = document.createElement("iframe");
    iframe["setAttribute"]("src", self.options["relay_url"]);
    iframe["style"]["display"] = "none";
    iframe["setAttribute"]("name", fb.login.Constants.POPUP_RELAY_FRAME_NAME);
    document["body"]["appendChild"](iframe);
    messageTarget = iframe["contentWindow"];
  }
  url += (/\?/.test(url) ? "" : "?") + fb.util.querystring(params);
  var popup = window.open(url, self.options["window_name"], self.options["window_features"]);
  if (!messageTarget) {
    messageTarget = popup;
  }
  var closeInterval = setInterval(function() {
    if (popup && popup["closed"]) {
      cleanup(false);
      if (cb) {
        cb(fb.login.Errors.get("USER_CANCELLED"));
        cb = null;
      }
      return;
    }
  }, 500);
  var req = fb.util.json.stringify({"a":"request", "d":params});
  function cleanup(forceKeepWindowOpen) {
    if (iframe) {
      document["body"]["removeChild"](iframe);
      iframe = undefined;
    }
    if (closeInterval) {
      closeInterval = clearInterval(closeInterval);
    }
    fb.login.transports.util.removeListener(window, "message", onMessage);
    fb.login.transports.util.removeListener(window, "unload", cleanup);
    if (popup && !forceKeepWindowOpen) {
      try {
        popup["close"]();
      } catch (securityViolation) {
        messageTarget["postMessage"](fb.login.Constants.POPUP_CLOSE_CMD, origin);
      }
    }
    popup = messageTarget = undefined;
  }
  fb.login.transports.util.addListener(window, "unload", cleanup);
  function onMessage(e) {
    if (e["origin"] !== origin) {
      return;
    }
    try {
      var d = fb.util.json.eval(e["data"]);
      if (d["a"] === "ready") {
        messageTarget["postMessage"](req, origin);
      } else {
        if (d["a"] === "error") {
          cleanup(false);
          if (cb) {
            cb(d["d"]);
            cb = null;
          }
        } else {
          if (d["a"] === "response") {
            cleanup(d["forceKeepWindowOpen"]);
            if (cb) {
              cb(null, d["d"]);
              cb = null;
            }
          }
        }
      }
    } catch (err) {
    }
  }
  fb.login.transports.util.addListener(window, "message", onMessage);
};
fb.login.transports.Popup["isAvailable"] = function() {
  return!NODE_CLIENT && "postMessage" in window && !fb.login.util.environment.isLocalFile() && !fb.login.util.environment.isMobileWrapper() && !fb.login.util.environment.isHeadlessBrowser();
};
fb.login.transports.Popup.prototype.classification = function() {
  return "popup";
};
goog.provide("fb.login.transports.NodeHttp");
goog.require("fb.login.Constants");
goog.require("fb.login.Errors");
goog.require("fb.login.Transport");
goog.require("fb.login.transports.util");
goog.require("fb.login.util.environment");
goog.require("fb.util");
goog.require("fb.util.json");
fb.login.transports.NodeHttp = function(options) {
  if (!options["method"]) {
    options["method"] = "GET";
  }
  if (!options["headers"]) {
    options["headers"] = {};
  }
  if (!options["headers"]["content_type"]) {
    options["headers"]["content_type"] = "application/json";
  }
  options["headers"]["content_type"] = options["headers"]["content_type"].toLowerCase();
  this.options = options;
};
fb.login.transports.NodeHttp.prototype.open = function(url, params, cb) {
  var self = this, parsedUrl = fb.core.util.parseURL(url), http = parsedUrl.scheme === "http" ? require("http") : require("https"), method = this.options["method"], payload;
  var headers = {"Accept":"application/json;text/plain"};
  goog.object.extend(headers, this.options["headers"]);
  var requestOpts = {"host":parsedUrl.host.split(":")[0], "port":parsedUrl.port, "path":parsedUrl.pathString, "method":this.options["method"].toUpperCase()};
  if (method === "GET") {
    requestOpts["path"] += (/\?/.test(requestOpts["path"]) ? "" : "?") + fb.util.querystring(params);
    payload = null;
  } else {
    var contentType = this.options["headers"]["content_type"];
    if (contentType === "application/json") {
      payload = fb.util.json.stringify(params);
    }
    if (contentType === "application/x-www-form-urlencoded") {
      payload = fb.util.querystring(params);
    }
    headers["Content-Length"] = Buffer["byteLength"](payload, "utf8");
  }
  requestOpts["headers"] = headers;
  var req = http["request"](requestOpts, function(response) {
    var res = "";
    response["setEncoding"]("utf8");
    response["on"]("data", function(d) {
      res += d;
    });
    response["on"]("end", function() {
      try {
        res = fb.util.json.eval(res + "");
      } catch (e) {
      }
      if (cb) {
        cb(null, res);
        cb = null;
      }
    });
  });
  if (method !== "GET") {
    req["write"](payload);
  }
  req["on"]("error", function(e) {
    if (e && e["code"] && (e["code"] === "ENOTFOUND" || e["code"] === "ENETDOWN")) {
      cb(fb.login.Errors.get("NETWORK_ERROR"));
    } else {
      cb(fb.login.Errors.get("SERVER_ERROR"));
    }
    cb = null;
  });
  req["end"]();
};
fb.login.transports.NodeHttp["isAvailable"] = function() {
  return NODE_CLIENT;
};
fb.login.transports.NodeHttp.prototype.classification = function() {
  return "json";
};
goog.provide("fb.login.transports.XHR");
goog.require("fb.login.Constants");
goog.require("fb.login.Errors");
goog.require("fb.login.Transport");
goog.require("fb.login.transports.util");
goog.require("fb.login.util.environment");
goog.require("fb.util");
goog.require("fb.util.json");
fb.login.transports.XHR = function(options) {
  if (!options["method"]) {
    options["method"] = "GET";
  }
  if (!options["headers"]) {
    options["headers"] = {};
  }
  if (!options["headers"]["content_type"]) {
    options["headers"]["content_type"] = "application/json";
  }
  options["headers"]["content_type"] = options["headers"]["content_type"].toLowerCase();
  this.options = options;
};
fb.login.transports.XHR.prototype.open = function(url, params, cb) {
  var self = this;
  var xhr = new XMLHttpRequest, method = this.options["method"].toUpperCase(), payload;
  function handleInterrupt_(e) {
    if (cb) {
      cb(fb.login.Errors.get("REQUEST_INTERRUPTED"));
      cb = null;
    }
  }
  fb.login.transports.util.addListener(window, "beforeunload", handleInterrupt_);
  xhr.onreadystatechange = function() {
    if (cb && xhr.readyState === 4) {
      var res;
      if (xhr.status >= 200 && xhr.status < 300) {
        try {
          res = fb.util.json.eval(xhr.responseText);
        } catch (e) {
        }
        cb(null, res);
      } else {
        if (xhr.status >= 500 && xhr.status < 600) {
          cb(fb.login.Errors.get("SERVER_ERROR"));
        } else {
          cb(fb.login.Errors.get("NETWORK_ERROR"));
        }
      }
      cb = null;
      fb.login.transports.util.removeListener(window, "beforeunload", handleInterrupt_);
    }
  };
  if (method === "GET") {
    url += (/\?/.test(url) ? "" : "?") + fb.util.querystring(params);
    payload = null;
  } else {
    var contentType = this.options["headers"]["content_type"];
    if (contentType === "application/json") {
      payload = fb.util.json.stringify(params);
    }
    if (contentType === "application/x-www-form-urlencoded") {
      payload = fb.util.querystring(params);
    }
  }
  xhr.open(method, url, true);
  var headers = {"X-Requested-With":"XMLHttpRequest", "Accept":"application/json;text/plain"};
  goog.object.extend(headers, this.options["headers"]);
  for (var header in headers) {
    xhr.setRequestHeader(header, headers[header]);
  }
  xhr.send(payload);
};
fb.login.transports.XHR["isAvailable"] = function() {
  return!NODE_CLIENT && !!window["XMLHttpRequest"] && typeof(new XMLHttpRequest).responseType === "string" && (!fb.login.util.environment.isIE() || fb.login.util.environment.isModernIE());
};
fb.login.transports.XHR.prototype.classification = function() {
  return "json";
};
goog.provide("fb.login.transports.CordovaInAppBrowser");
goog.require("fb.core.util");
goog.require("fb.login.Constants");
goog.require("fb.login.Errors");
goog.require("fb.login.RequestInfo");
goog.require("fb.login.Transport");
goog.require("fb.login.transports.XHR");
goog.require("fb.login.transports.util");
goog.require("fb.login.util.environment");
goog.require("fb.util");
goog.require("fb.util.json");
fb.login.transports.CordovaInAppBrowser = function(options) {
  this.requestId_ = goog.string.getRandomString() + goog.string.getRandomString() + goog.string.getRandomString();
  this.options_ = options;
};
fb.login.transports.CordovaInAppBrowser.prototype.open = function(url, params, cb) {
  var self = this, parsedUrl = fb.core.util.parseURL(fb.login.Constants.SERVER_HOST), windowRef;
  function isSentinelPathMatch(url) {
    try {
      var a = document.createElement("a");
      a["href"] = url;
      return a["host"] === parsedUrl.host && a["pathname"] === fb.login.Constants.INTERNAL_REDIRECT_SENTINAL_PATH;
    } catch (e) {
    }
    return false;
  }
  function onClose_(e) {
    if (cb) {
      cb(fb.login.Errors.get("USER_CANCELLED"));
      cb = null;
    }
  }
  params["requestId"] = this.requestId_;
  params[fb.login.Constants.CLIENT_OPTION_REDIRECT_TO] = parsedUrl.scheme + "://" + parsedUrl.host + fb.login.Constants.INTERNAL_REDIRECT_SENTINAL_PATH;
  url += /\?/.test(url) ? "" : "?";
  url += fb.util.querystring(params);
  windowRef = window.open(url, "_blank", "location=no");
  if (!windowRef || !goog.isFunction(windowRef.addEventListener)) {
    cb(fb.login.Errors.get("TRANSPORT_UNAVAILABLE"));
    return;
  }
  windowRef.addEventListener("loadstart", function(e) {
    if (!e || !e["url"] || !isSentinelPathMatch(e["url"])) {
      return;
    }
    var reqKey = fb.login.transports.util.extractRedirectCompletionHash(e["url"]);
    windowRef.removeEventListener("exit", onClose_);
    windowRef.close();
    var path = "/auth/session";
    var requestInfo = new fb.login.RequestInfo(null, null, {"requestId":self.requestId_, "requestKey":reqKey});
    self.options_["requestWithCredential"](path, requestInfo, cb);
    cb = null;
  });
  windowRef.addEventListener("exit", onClose_);
};
fb.login.transports.CordovaInAppBrowser["isAvailable"] = function() {
  return!NODE_CLIENT && fb.login.util.environment.isMobileCordova();
};
fb.login.transports.CordovaInAppBrowser.prototype.classification = function() {
  return "redirect";
};
goog.provide("fb.login.transports.JSONP");
goog.require("fb.login.Constants");
goog.require("fb.login.Errors");
goog.require("fb.login.Transport");
goog.require("fb.login.transports.util");
goog.require("fb.util");
goog.require("fb.util.json");
fb.login.transports.JSONP = function(options) {
  if (!options["callback_parameter"]) {
    options["callback_parameter"] = "callback";
  }
  this.options = options;
  window[fb.login.Constants.JSONP_CALLBACK_NAMESPACE] = window[fb.login.Constants.JSONP_CALLBACK_NAMESPACE] || {};
};
fb.login.transports.JSONP.prototype.open = function(url, params, cb) {
  var id = "fn" + (new Date).getTime() + Math.floor(Math.random() * 99999);
  params[this.options["callback_parameter"]] = fb.login.Constants.JSONP_CALLBACK_NAMESPACE + "." + id;
  url += (/\?/.test(url) ? "" : "?") + fb.util.querystring(params);
  function handleInterrupt_(e) {
    if (cb) {
      cb(fb.login.Errors.get("REQUEST_INTERRUPTED"));
      cb = null;
    }
  }
  fb.login.transports.util.addListener(window, "beforeunload", handleInterrupt_);
  function cleanup_() {
    setTimeout(function() {
      window[fb.login.Constants.JSONP_CALLBACK_NAMESPACE][id] = undefined;
      if (goog.object.isEmpty(window[fb.login.Constants.JSONP_CALLBACK_NAMESPACE])) {
        window[fb.login.Constants.JSONP_CALLBACK_NAMESPACE] = undefined;
      }
      try {
        var el = document.getElementById(id);
        if (el) {
          el.parentNode.removeChild(el);
        }
      } catch (e) {
      }
    }, 1);
    fb.login.transports.util.removeListener(window, "beforeunload", handleInterrupt_);
  }
  function onload_(res) {
    if (cb) {
      cb(null, res);
      cb = null;
    }
    cleanup_();
  }
  window[fb.login.Constants.JSONP_CALLBACK_NAMESPACE][id] = onload_;
  this.writeScriptTag_(id, url, cb);
};
fb.login.transports.JSONP.prototype.writeScriptTag_ = function(id, url, cb) {
  setTimeout(function() {
    try {
      var js = document.createElement("script");
      js.type = "text/javascript";
      js.id = id;
      js.async = true;
      js.src = url;
      js.onerror = function() {
        var el = document.getElementById(id);
        if (el !== null) {
          el.parentNode.removeChild(el);
        }
        if (cb) {
          cb(fb.login.Errors.get("NETWORK_ERROR"));
        }
      };
      var ref;
      var headElements = document.getElementsByTagName("head");
      if (!headElements || goog.array.isEmpty(headElements)) {
        ref = document.documentElement;
      } else {
        ref = headElements[0];
      }
      ref.appendChild(js);
    } catch (e) {
      if (cb) {
        cb(fb.login.Errors.get("NETWORK_ERROR"));
      }
    }
  }, 0);
};
fb.login.transports.JSONP["isAvailable"] = function() {
  return!NODE_CLIENT;
};
fb.login.transports.JSONP.prototype.classification = function() {
  return "json";
};
goog.provide("fb.login.AuthenticationManager");
goog.require("fb.constants");
goog.require("fb.core.storage");
goog.require("fb.core.util");
goog.require("fb.core.util.EventEmitter");
goog.require("fb.login.Constants");
goog.require("fb.login.Errors");
goog.require("fb.login.RequestInfo");
goog.require("fb.login.SessionManager");
goog.require("fb.login.transports.CordovaInAppBrowser");
goog.require("fb.login.transports.JSONP");
goog.require("fb.login.transports.NodeHttp");
goog.require("fb.login.transports.Popup");
goog.require("fb.login.transports.Redirect");
goog.require("fb.login.transports.XHR");
fb.login.AuthenticationManager = function(repoInfo, auth, unauth, onAuthStatus) {
  fb.core.util.EventEmitter.call(this, ["auth_status"]);
  this.repoInfo_ = repoInfo;
  this.authConn_ = auth;
  this.unauthConn_ = unauth;
  this.onAuthStatus_ = onAuthStatus;
  this.sessionManager_ = new fb.login.SessionManager(repoInfo, [fb.core.storage.PersistentStorage, fb.core.storage.SessionStorage]);
  this.authData_ = null;
  this.redirectRestart_ = false;
  this.resumeSession();
};
goog.inherits(fb.login.AuthenticationManager, fb.core.util.EventEmitter);
fb.login.AuthenticationManager.prototype.getAuth = function() {
  return this.authData_ || null;
};
fb.login.AuthenticationManager.prototype.resumeSession = function() {
  var redirectRequestId = fb.core.storage.SessionStorage.get(fb.login.Constants.REDIR_REQUEST_ID_KEY), self = this;
  if (redirectRequestId) {
    this.finishOAuthRedirectLogin_();
  }
  var session = this.sessionManager_.get();
  if (session && session["token"]) {
    this.updateAuthStatus_(session);
    this.authConn_(session["token"], function(status, data) {
      self.authOnComplete_(status, data, false, session["token"], session);
    }, function(cancelStatus, cancelReason) {
      self.authOnCancel_("resumeSession()", cancelStatus, cancelReason);
    });
  } else {
    this.updateAuthStatus_(null);
  }
};
fb.login.AuthenticationManager.prototype.authenticate = function(cred, userProfile, clientOptions, opt_onComplete, opt_onCancel) {
  if (this.repoInfo_.isDemoHost()) {
    fb.core.util.warn("Firebase authentication is not supported on demo Firebases (*.firebaseio-demo.com). " + "To secure your Firebase, create a production Firebase at https://www.firebase.com.");
  }
  var self = this;
  this.authConn_(cred, function(status, data) {
    self.authOnComplete_(status, data, true, cred, userProfile, clientOptions || {}, opt_onComplete);
  }, function(cancelStatus, cancelReason) {
    self.authOnCancel_("auth()", cancelStatus, cancelReason, opt_onCancel);
  });
};
fb.login.AuthenticationManager.prototype.unauthenticate = function(opt_onComplete) {
  var self = this;
  this.sessionManager_.clear();
  self.updateAuthStatus_(null);
  this.unauthConn_(function(status, errorReason) {
    if (status === "ok") {
      fb.core.util.callUserCallback(opt_onComplete, null);
    } else {
      var code = (status || "error").toUpperCase();
      var message = code;
      if (errorReason) {
        message += ": " + errorReason;
      }
      var error = new Error(message);
      error["code"] = code;
      fb.core.util.callUserCallback(opt_onComplete, error);
    }
  });
};
fb.login.AuthenticationManager.prototype.authOnComplete_ = function(status, authConnResult, newSession, cred, authData, opt_clientOptions, opt_onComplete) {
  if (status === "ok") {
    if (newSession) {
      var tokenPayload = authConnResult["auth"];
      authData["auth"] = tokenPayload;
      authData["expires"] = authConnResult["expires"];
      authData["token"] = fb.util.jwt.isValidFormat(cred) ? cred : "";
      var uid = null;
      if (tokenPayload && fb.util.obj.contains(tokenPayload, "uid")) {
        uid = fb.util.obj.get(tokenPayload, "uid");
      } else {
        if (fb.util.obj.contains(authData, "uid")) {
          uid = fb.util.obj.get(authData, "uid");
        }
      }
      authData["uid"] = uid;
      var provider = "custom";
      if (tokenPayload && fb.util.obj.contains(tokenPayload, "provider")) {
        provider = fb.util.obj.get(tokenPayload, "provider");
      } else {
        if (fb.util.obj.contains(authData, "provider")) {
          provider = fb.util.obj.get(authData, "provider");
        }
      }
      authData["provider"] = provider;
      this.sessionManager_.clear();
      if (fb.util.jwt.isValidFormat(cred)) {
        opt_clientOptions = opt_clientOptions || {};
        var store = fb.core.storage.PersistentStorage;
        if (opt_clientOptions[fb.login.Constants.CLIENT_OPTION_SESSION_PERSISTENCE] === "sessionOnly") {
          store = fb.core.storage.SessionStorage;
        }
        if (opt_clientOptions[fb.login.Constants.CLIENT_OPTION_SESSION_PERSISTENCE] !== "none") {
          this.sessionManager_.set(authData, store);
        }
      }
      this.updateAuthStatus_(authData);
    }
    fb.core.util.callUserCallback(opt_onComplete, null, authData);
    return;
  }
  this.handleBadAuthStatus_();
  var code = (status || "error").toUpperCase();
  var message = code;
  if (authConnResult) {
    message += ": " + authConnResult;
  }
  var error = new Error(message);
  error["code"] = code;
  fb.core.util.callUserCallback(opt_onComplete, error);
};
fb.login.AuthenticationManager.prototype.authOnCancel_ = function(fromFunction, cancelStatus, cancelReason, opt_onCancel) {
  fb.core.util.warn(fromFunction + " was canceled: " + cancelReason);
  this.handleBadAuthStatus_();
  var err = new Error(cancelReason);
  err["code"] = cancelStatus.toUpperCase();
  fb.core.util.callUserCallback(opt_onCancel, err);
};
fb.login.AuthenticationManager.prototype.handleBadAuthStatus_ = function() {
  this.sessionManager_.clear();
  this.updateAuthStatus_(null);
};
fb.login.AuthenticationManager.prototype.authWithCredential = function(provider, opt_params, opt_options, opt_onComplete) {
  this.checkServerSettingsOrThrow();
  var requestInfo = new fb.login.RequestInfo(opt_options || {}, {}, opt_params || {});
  var transports;
  if (NODE_CLIENT) {
    transports = [fb.login.transports.NodeHttp];
  } else {
    transports = [fb.login.transports.XHR, fb.login.transports.JSONP];
  }
  this.authWithTransports_(transports, "/auth/" + provider, requestInfo, opt_onComplete);
};
fb.login.AuthenticationManager.prototype.authWithPopup = function(provider, opt_params, opt_onComplete) {
  this.checkServerSettingsOrThrow();
  var transports = [fb.login.transports.Popup, fb.login.transports.CordovaInAppBrowser], requestInfo = fb.login.RequestInfo.fromParams(opt_params), width = 625, height = 625;
  if (provider === "anonymous" || provider === "password") {
    setTimeout(function() {
      fb.core.util.callUserCallback(opt_onComplete, fb.login.Errors.get("TRANSPORT_UNAVAILABLE"));
    }, 0);
    return;
  }
  requestInfo.transportOptions["window_features"] = "" + "menubar=yes," + "modal=yes," + "alwaysRaised=yes" + "location=yes," + "resizable=yes," + "scrollbars=yes," + "status=yes," + "height=" + height + "," + "width=" + width + "," + "top=" + (typeof screen === "object" ? (screen["height"] - height) * .5 : 0) + "," + "left=" + (typeof screen === "object" ? (screen["width"] - width) * .5 : 0);
  requestInfo.transportOptions["relay_url"] = fb.login.transports.util.getPopupChannelUrl(this.repoInfo_.namespace);
  requestInfo.transportOptions["requestWithCredential"] = goog.bind(this.requestWithCredential, this);
  this.authWithTransports_(transports, "/auth/" + provider, requestInfo, opt_onComplete);
};
fb.login.AuthenticationManager.prototype.authWithRedirect = function(provider, opt_params, opt_onErr) {
  this.checkServerSettingsOrThrow();
  var transports = [fb.login.transports.Redirect], requestInfo = fb.login.RequestInfo.fromParams(opt_params);
  if (provider === "anonymous" || provider === "firebase") {
    fb.core.util.callUserCallback(opt_onErr, fb.login.Errors.get("TRANSPORT_UNAVAILABLE"));
    return;
  }
  fb.core.storage.SessionStorage.set(fb.login.Constants.REDIR_CLIENT_OPTIONS_KEY, requestInfo.clientOptions);
  this.authWithTransports_(transports, "/auth/" + provider, requestInfo, opt_onErr);
};
fb.login.AuthenticationManager.prototype.finishOAuthRedirectLogin_ = function() {
  var redirectRequestId = fb.core.storage.SessionStorage.get(fb.login.Constants.REDIR_REQUEST_ID_KEY);
  if (redirectRequestId) {
    var clientOptions = fb.core.storage.SessionStorage.get(fb.login.Constants.REDIR_CLIENT_OPTIONS_KEY);
    fb.core.storage.SessionStorage.remove(fb.login.Constants.REDIR_REQUEST_ID_KEY);
    fb.core.storage.SessionStorage.remove(fb.login.Constants.REDIR_CLIENT_OPTIONS_KEY);
    var transports = [fb.login.transports.XHR, fb.login.transports.JSONP], serverParams = {"requestId":redirectRequestId, "requestKey":fb.login.transports.util.extractRedirectCompletionHash(document.location.hash)}, transportOptions = {}, requestInfo = new fb.login.RequestInfo(clientOptions, transportOptions, serverParams);
    this.redirectRestart_ = true;
    fb.login.transports.util.replaceRedirectCompletionHash();
    this.authWithTransports_(transports, "/auth/session", requestInfo, function(error) {
      this.redirectRestart_ = false;
    }.bind(this));
  }
};
fb.login.AuthenticationManager.prototype.createUser = function(params, opt_onComplete) {
  this.checkServerSettingsOrThrow();
  var path = "/users";
  var requestInfo = fb.login.RequestInfo.fromParams(params);
  requestInfo.serverParams["_method"] = "POST";
  this.requestWithCredential(path, requestInfo, function(err, res) {
    if (err) {
      fb.core.util.callUserCallback(opt_onComplete, err);
    } else {
      fb.core.util.callUserCallback(opt_onComplete, err, res);
    }
  });
};
fb.login.AuthenticationManager.prototype.removeUser = function(params, opt_onComplete) {
  var self = this;
  this.checkServerSettingsOrThrow();
  var path = "/users/" + encodeURIComponent(params["email"]);
  var requestInfo = fb.login.RequestInfo.fromParams(params);
  requestInfo.serverParams["_method"] = "DELETE";
  this.requestWithCredential(path, requestInfo, function(err, res) {
    if (!err && res && res["uid"]) {
      if (self.authData_ && self.authData_["uid"] && self.authData_["uid"] === res["uid"]) {
        self.unauthenticate();
      }
    }
    fb.core.util.callUserCallback(opt_onComplete, err);
  });
};
fb.login.AuthenticationManager.prototype.changePassword = function(params, opt_onComplete) {
  this.checkServerSettingsOrThrow();
  var path = "/users/" + encodeURIComponent(params["email"]) + "/password";
  var requestInfo = fb.login.RequestInfo.fromParams(params);
  requestInfo.serverParams["_method"] = "PUT";
  requestInfo.serverParams["password"] = params["newPassword"];
  this.requestWithCredential(path, requestInfo, function(err, res) {
    fb.core.util.callUserCallback(opt_onComplete, err);
  });
};
fb.login.AuthenticationManager.prototype.changeEmail = function(params, opt_onComplete) {
  this.checkServerSettingsOrThrow();
  var path = "/users/" + encodeURIComponent(params["oldEmail"]) + "/email";
  var requestInfo = fb.login.RequestInfo.fromParams(params);
  requestInfo.serverParams["_method"] = "PUT";
  requestInfo.serverParams["email"] = params["newEmail"];
  requestInfo.serverParams["password"] = params["password"];
  this.requestWithCredential(path, requestInfo, function(err, res) {
    fb.core.util.callUserCallback(opt_onComplete, err);
  });
};
fb.login.AuthenticationManager.prototype.resetPassword = function(params, opt_onComplete) {
  this.checkServerSettingsOrThrow();
  var path = "/users/" + encodeURIComponent(params["email"]) + "/password";
  var requestInfo = fb.login.RequestInfo.fromParams(params);
  requestInfo.serverParams["_method"] = "POST";
  this.requestWithCredential(path, requestInfo, function(err, res) {
    fb.core.util.callUserCallback(opt_onComplete, err);
  });
};
fb.login.AuthenticationManager.prototype.requestWithCredential = function(path, requestInfo, opt_onComplete) {
  var transports;
  if (NODE_CLIENT) {
    transports = [fb.login.transports.NodeHttp];
  } else {
    transports = [fb.login.transports.XHR, fb.login.transports.JSONP];
  }
  this.requestWithTransports_(transports, path, requestInfo, opt_onComplete);
};
fb.login.AuthenticationManager.prototype.authWithTransports_ = function(transports, path, requestInfo, opt_onComplete) {
  var self = this;
  this.requestWithTransports_(transports, path, requestInfo, function onLoginReturned(err, res) {
    if (err || !(res && res["token"] && res["uid"])) {
      fb.core.util.callUserCallback(opt_onComplete, err || fb.login.Errors.get("UNKNOWN_ERROR"));
    } else {
      res = (res);
      self.authenticate(res["token"], res, requestInfo.clientOptions, function(err, authData) {
        if (err) {
          fb.core.util.callUserCallback(opt_onComplete, err);
        } else {
          fb.core.util.callUserCallback(opt_onComplete, null, authData);
        }
      });
    }
  });
};
fb.login.AuthenticationManager.prototype.requestWithTransports_ = function(transports, path, requestInfo, opt_onComplete) {
  var availableTransports = goog.array.filter(transports, function(transport) {
    return typeof transport["isAvailable"] === "function" && transport["isAvailable"]();
  });
  if (availableTransports.length === 0) {
    setTimeout(function() {
      fb.core.util.callUserCallback(opt_onComplete, fb.login.Errors.get("TRANSPORT_UNAVAILABLE"));
    }, 0);
    return;
  }
  var transport = availableTransports.shift();
  var transportObj = new transport(requestInfo.transportOptions);
  var request = fb.util.obj.clone(requestInfo.serverParams);
  request["v"] = this.versionString();
  request["transport"] = transportObj.classification();
  request["suppress_status_codes"] = true;
  var url = fb.login.transports.util.getBaseUrl() + "/" + this.repoInfo_.namespace + path;
  transportObj.open(url, request, function onTransportReturned(err, res) {
    if (err) {
      fb.core.util.callUserCallback(opt_onComplete, err);
    } else {
      if (res && res["error"]) {
        var e = new Error(res["error"]["message"]);
        e["code"] = res["error"]["code"];
        e["details"] = res["error"]["details"];
        fb.core.util.callUserCallback(opt_onComplete, e);
      } else {
        fb.core.util.callUserCallback(opt_onComplete, null, res);
      }
    }
  });
};
fb.login.AuthenticationManager.prototype.updateAuthStatus_ = function(authData) {
  var stateChanged = this.authData_ !== null || authData !== null;
  this.authData_ = authData;
  if (stateChanged) {
    this.trigger("auth_status", authData);
  }
  this.onAuthStatus_(authData !== null);
};
fb.login.AuthenticationManager.prototype.getInitialEvent = function(event) {
  fb.core.util.assert(event === "auth_status", 'initial event must be of type "auth_status"');
  if (this.redirectRestart_) {
    return null;
  }
  return[this.authData_];
};
fb.login.AuthenticationManager.prototype.versionString = function() {
  return(NODE_CLIENT ? "node-" : "js-") + CLIENT_VERSION;
};
fb.login.AuthenticationManager.prototype.checkServerSettingsOrThrow = function() {
  if (this.repoInfo_.isCustomHost() && fb.login.Constants.SERVER_HOST === fb.login.Constants.DEFAULT_SERVER_HOST) {
    throw new Error("This custom Firebase server ('" + this.repoInfo_.domain + "') does not support delegated login.");
  }
};
goog.provide("fb.realtime.Transport");
goog.require("fb.core.RepoInfo");
fb.realtime.Transport = function(connId, repoInfo, sessionId) {
};
fb.realtime.Transport.prototype.open = function(onMessage, onDisconnect) {
};
fb.realtime.Transport.prototype.start = function() {
};
fb.realtime.Transport.prototype.close = function() {
};
fb.realtime.Transport.prototype.send = function(data) {
};
fb.realtime.Transport.prototype.bytesReceived;
fb.realtime.Transport.prototype.bytesSent;
goog.provide("fb.realtime.Constants");
fb.realtime.Constants = {PROTOCOL_VERSION:"5", VERSION_PARAM:"v", SESSION_PARAM:"s", REFERER_PARAM:"r", FORGE_REF:"f", FORGE_DOMAIN:"firebaseio.com"};
goog.provide("fb.realtime.polling.PacketReceiver");
fb.realtime.polling.PacketReceiver = function(onMessage) {
  this.onMessage_ = onMessage;
  this.pendingResponses = [];
  this.currentResponseNum = 0;
  this.closeAfterResponse = -1;
  this.onClose = null;
};
fb.realtime.polling.PacketReceiver.prototype.closeAfter = function(responseNum, callback) {
  this.closeAfterResponse = responseNum;
  this.onClose = callback;
  if (this.closeAfterResponse < this.currentResponseNum) {
    this.onClose();
    this.onClose = null;
  }
};
fb.realtime.polling.PacketReceiver.prototype.handleResponse = function(requestNum, data) {
  this.pendingResponses[requestNum] = data;
  while (this.pendingResponses[this.currentResponseNum]) {
    var toProcess = this.pendingResponses[this.currentResponseNum];
    delete this.pendingResponses[this.currentResponseNum];
    for (var i = 0;i < toProcess.length;++i) {
      if (toProcess[i]) {
        var self = this;
        fb.core.util.exceptionGuard(function() {
          self.onMessage_(toProcess[i]);
        });
      }
    }
    if (this.currentResponseNum === this.closeAfterResponse) {
      if (this.onClose) {
        clearTimeout(this.onClose);
        this.onClose();
        this.onClose = null;
      }
      break;
    }
    this.currentResponseNum++;
  }
};
goog.provide("fb.realtime.BrowserPollConnection");
goog.require("fb.constants");
goog.require("fb.core.stats.StatsManager");
goog.require("fb.core.util");
goog.require("fb.core.util.CountedSet");
goog.require("fb.realtime.Constants");
goog.require("fb.realtime.Transport");
goog.require("fb.realtime.polling.PacketReceiver");
goog.require("fb.util.json");
var FIREBASE_LONGPOLL_START_PARAM = "start";
var FIREBASE_LONGPOLL_CLOSE_COMMAND = "close";
var FIREBASE_LONGPOLL_COMMAND_CB_NAME = "pLPCommand";
var FIREBASE_LONGPOLL_DATA_CB_NAME = "pRTLPCB";
var FIREBASE_LONGPOLL_ID_PARAM = "id";
var FIREBASE_LONGPOLL_PW_PARAM = "pw";
var FIREBASE_LONGPOLL_SERIAL_PARAM = "ser";
var FIREBASE_LONGPOLL_CALLBACK_ID_PARAM = "cb";
var FIREBASE_LONGPOLL_SEGMENT_NUM_PARAM = "seg";
var FIREBASE_LONGPOLL_SEGMENTS_IN_PACKET = "ts";
var FIREBASE_LONGPOLL_DATA_PARAM = "d";
var FIREBASE_LONGPOLL_DISCONN_FRAME_PARAM = "disconn";
var FIREBASE_LONGPOLL_DISCONN_FRAME_REQUEST_PARAM = "dframe";
var MAX_URL_DATA_SIZE = 1870;
var SEG_HEADER_SIZE = 30;
var MAX_PAYLOAD_SIZE = MAX_URL_DATA_SIZE - SEG_HEADER_SIZE;
var KEEPALIVE_REQUEST_INTERVAL = 25E3;
var LP_CONNECT_TIMEOUT = 3E4;
fb.realtime.BrowserPollConnection = function(connId, repoInfo, sessionId) {
  this.connId = connId;
  this.log_ = fb.core.util.logWrapper(connId);
  this.repoInfo = repoInfo;
  this.bytesSent = 0;
  this.bytesReceived = 0;
  this.stats_ = fb.core.stats.StatsManager.getCollection(repoInfo);
  this.sessionId = sessionId;
  this.everConnected_ = false;
  this.urlFn = function(params) {
    if (repoInfo.needsQueryParam()) {
      params["ns"] = repoInfo.namespace;
    }
    var pairs = [];
    for (var k in params) {
      if (params.hasOwnProperty(k)) {
        pairs.push(k + "=" + params[k]);
      }
    }
    return(repoInfo.secure ? "https://" : "http://") + repoInfo.internalHost + "/.lp?" + pairs.join("&");
  };
};
fb.realtime.BrowserPollConnection.prototype.open = function(onMessage, onDisconnect) {
  this.curSegmentNum = 0;
  this.onDisconnect_ = onDisconnect;
  this.myPacketOrderer = new fb.realtime.polling.PacketReceiver(onMessage);
  this.isClosed_ = false;
  var self = this;
  this.connectTimeoutTimer_ = setTimeout(function() {
    self.log_("Timed out trying to connect.");
    self.onClosed_();
    self.connectTimeoutTimer_ = null;
  }, Math.floor(LP_CONNECT_TIMEOUT));
  fb.core.util.executeWhenDOMReady(function() {
    if (self.isClosed_) {
      return;
    }
    self.scriptTagHolder = new FirebaseIFrameScriptHolder(function(command, arg1, arg2, arg3, arg4) {
      self.incrementIncomingBytes_(arguments);
      if (!self.scriptTagHolder) {
        return;
      }
      if (self.connectTimeoutTimer_) {
        clearTimeout(self.connectTimeoutTimer_);
        self.connectTimeoutTimer_ = null;
      }
      self.everConnected_ = true;
      if (command == FIREBASE_LONGPOLL_START_PARAM) {
        self.id = arg1;
        self.password = arg2;
      } else {
        if (command === FIREBASE_LONGPOLL_CLOSE_COMMAND) {
          if (arg1) {
            self.scriptTagHolder.sendNewPolls = false;
            self.myPacketOrderer.closeAfter(arg1, function() {
              self.onClosed_();
            });
          } else {
            self.onClosed_();
          }
        } else {
          throw new Error("Unrecognized command received: " + command);
        }
      }
    }, function(pN, data) {
      self.incrementIncomingBytes_(arguments);
      self.myPacketOrderer.handleResponse(pN, data);
    }, function() {
      self.onClosed_();
    }, self.urlFn);
    var urlParams = {};
    urlParams[FIREBASE_LONGPOLL_START_PARAM] = "t";
    urlParams[FIREBASE_LONGPOLL_SERIAL_PARAM] = Math.floor(Math.random() * 1E8);
    if (self.scriptTagHolder.uniqueCallbackIdentifier) {
      urlParams[FIREBASE_LONGPOLL_CALLBACK_ID_PARAM] = self.scriptTagHolder.uniqueCallbackIdentifier;
    }
    urlParams[fb.realtime.Constants.VERSION_PARAM] = fb.realtime.Constants.PROTOCOL_VERSION;
    if (self.sessionId) {
      urlParams[fb.realtime.Constants.SESSION_PARAM] = self.sessionId;
    }
    if (!NODE_CLIENT && typeof location !== "undefined" && location.href && location.href.indexOf(fb.realtime.Constants.FORGE_DOMAIN) !== -1) {
      urlParams[fb.realtime.Constants.REFERER_PARAM] = fb.realtime.Constants.FORGE_REF;
    }
    var connectURL = self.urlFn(urlParams);
    self.log_("Connecting via long-poll to " + connectURL);
    self.scriptTagHolder.addTag(connectURL, function() {
    });
  });
};
fb.realtime.BrowserPollConnection.prototype.start = function() {
  this.scriptTagHolder.startLongPoll(this.id, this.password);
  this.addDisconnectPingFrame(this.id, this.password);
};
fb.realtime.BrowserPollConnection.forceAllow = function() {
  fb.realtime.BrowserPollConnection.forceAllow_ = true;
};
fb.realtime.BrowserPollConnection.forceDisallow = function() {
  fb.realtime.BrowserPollConnection.forceDisallow_ = true;
};
fb.realtime.BrowserPollConnection["isAvailable"] = function() {
  return!fb.realtime.BrowserPollConnection.forceDisallow_ && !fb.core.util.isChromeExtensionContentScript() && !fb.core.util.isWindowsStoreApp() && (fb.realtime.BrowserPollConnection.forceAllow_ || !NODE_CLIENT);
};
fb.realtime.BrowserPollConnection.prototype.markConnectionHealthy = function() {
};
fb.realtime.BrowserPollConnection.prototype.shutdown_ = function() {
  this.isClosed_ = true;
  if (this.scriptTagHolder) {
    this.scriptTagHolder.close();
    this.scriptTagHolder = null;
  }
  if (this.myDisconnFrame) {
    document.body.removeChild(this.myDisconnFrame);
    this.myDisconnFrame = null;
  }
  if (this.connectTimeoutTimer_) {
    clearTimeout(this.connectTimeoutTimer_);
    this.connectTimeoutTimer_ = null;
  }
};
fb.realtime.BrowserPollConnection.prototype.onClosed_ = function() {
  if (!this.isClosed_) {
    this.log_("Longpoll is closing itself");
    this.shutdown_();
    if (this.onDisconnect_) {
      this.onDisconnect_(this.everConnected_);
      this.onDisconnect_ = null;
    }
  }
};
fb.realtime.BrowserPollConnection.prototype.close = function() {
  if (!this.isClosed_) {
    this.log_("Longpoll is being closed.");
    this.shutdown_();
  }
};
fb.realtime.BrowserPollConnection.prototype.send = function(data) {
  var dataStr = fb.util.json.stringify(data);
  this.bytesSent += dataStr.length;
  this.stats_.incrementCounter("bytes_sent", dataStr.length);
  var base64data = fb.core.util.base64Encode(dataStr);
  var dataSegs = fb.core.util.splitStringBySize(base64data, MAX_PAYLOAD_SIZE);
  for (var i = 0;i < dataSegs.length;i++) {
    this.scriptTagHolder.enqueueSegment(this.curSegmentNum, dataSegs.length, dataSegs[i]);
    this.curSegmentNum++;
  }
};
fb.realtime.BrowserPollConnection.prototype.addDisconnectPingFrame = function(id, pw) {
  if (NODE_CLIENT) {
    return;
  }
  this.myDisconnFrame = document.createElement("iframe");
  var urlParams = {};
  urlParams[FIREBASE_LONGPOLL_DISCONN_FRAME_REQUEST_PARAM] = "t";
  urlParams[FIREBASE_LONGPOLL_ID_PARAM] = id;
  urlParams[FIREBASE_LONGPOLL_PW_PARAM] = pw;
  this.myDisconnFrame.src = this.urlFn(urlParams);
  this.myDisconnFrame.style.display = "none";
  document.body.appendChild(this.myDisconnFrame);
};
fb.realtime.BrowserPollConnection.prototype.incrementIncomingBytes_ = function(args) {
  var bytesReceived = fb.util.json.stringify(args).length;
  this.bytesReceived += bytesReceived;
  this.stats_.incrementCounter("bytes_received", bytesReceived);
};
function FirebaseIFrameScriptHolder(commandCB, onMessageCB, onDisconnectCB, urlFn) {
  this.urlFn = urlFn;
  this.onDisconnect = onDisconnectCB;
  this.outstandingRequests = new fb.core.util.CountedSet;
  this.pendingSegs = [];
  this.currentSerial = Math.floor(Math.random() * 1E8);
  this.sendNewPolls = true;
  if (!NODE_CLIENT) {
    this.uniqueCallbackIdentifier = fb.core.util.LUIDGenerator();
    window[FIREBASE_LONGPOLL_COMMAND_CB_NAME + this.uniqueCallbackIdentifier] = commandCB;
    window[FIREBASE_LONGPOLL_DATA_CB_NAME + this.uniqueCallbackIdentifier] = onMessageCB;
    this.myIFrame = this.createIFrame_();
    var script = "";
    if (this.myIFrame.src && this.myIFrame.src.substr(0, "javascript:".length) === "javascript:") {
      var currentDomain = document.domain;
      script = '<script>document.domain="' + currentDomain + '";\x3c/script>';
    }
    var iframeContents = "<html><body>" + script + "</body></html>";
    try {
      this.myIFrame.doc.open();
      this.myIFrame.doc.write(iframeContents);
      this.myIFrame.doc.close();
    } catch (e) {
      fb.core.util.log("frame writing exception");
      if (e.stack) {
        fb.core.util.log(e.stack);
      }
      fb.core.util.log(e);
    }
  } else {
    this.commandCB = commandCB;
    this.onMessageCB = onMessageCB;
  }
}
FirebaseIFrameScriptHolder.prototype.createIFrame_ = function() {
  var iframe = document.createElement("iframe");
  iframe.style.display = "none";
  if (document.body) {
    document.body.appendChild(iframe);
    try {
      var a = iframe.contentWindow.document;
      if (!a) {
        fb.core.util.log("No IE domain setting required");
      }
    } catch (e) {
      var domain = document.domain;
      iframe.src = "javascript:void((function(){document.open();document.domain='" + domain + "';document.close();})())";
    }
  } else {
    throw "Document body has not initialized. Wait to initialize Firebase until after the document is ready.";
  }
  if (iframe.contentDocument) {
    iframe.doc = iframe.contentDocument;
  } else {
    if (iframe.contentWindow) {
      iframe.doc = iframe.contentWindow.document;
    } else {
      if (iframe.document) {
        iframe.doc = iframe.document;
      }
    }
  }
  return iframe;
};
FirebaseIFrameScriptHolder.prototype.close = function() {
  this.alive = false;
  if (this.myIFrame) {
    this.myIFrame.doc.body.innerHTML = "";
    var self = this;
    setTimeout(function() {
      if (self.myIFrame !== null) {
        document.body.removeChild(self.myIFrame);
        self.myIFrame = null;
      }
    }, Math.floor(0));
  }
  if (NODE_CLIENT && this.myID) {
    var urlParams = {};
    urlParams[FIREBASE_LONGPOLL_DISCONN_FRAME_PARAM] = "t";
    urlParams[FIREBASE_LONGPOLL_ID_PARAM] = this.myID;
    urlParams[FIREBASE_LONGPOLL_PW_PARAM] = this.myPW;
    var theURL = this.urlFn(urlParams);
    FirebaseIFrameScriptHolder.nodeRestRequest(theURL);
  }
  var onDisconnect = this.onDisconnect;
  if (onDisconnect) {
    this.onDisconnect = null;
    onDisconnect();
  }
};
FirebaseIFrameScriptHolder.prototype.startLongPoll = function(id, pw) {
  this.myID = id;
  this.myPW = pw;
  this.alive = true;
  while (this.newRequest_()) {
  }
};
FirebaseIFrameScriptHolder.prototype.newRequest_ = function() {
  if (this.alive && this.sendNewPolls && this.outstandingRequests.count() < (this.pendingSegs.length > 0 ? 2 : 1)) {
    this.currentSerial++;
    var urlParams = {};
    urlParams[FIREBASE_LONGPOLL_ID_PARAM] = this.myID;
    urlParams[FIREBASE_LONGPOLL_PW_PARAM] = this.myPW;
    urlParams[FIREBASE_LONGPOLL_SERIAL_PARAM] = this.currentSerial;
    var theURL = this.urlFn(urlParams);
    var curDataString = "";
    var i = 0;
    while (this.pendingSegs.length > 0) {
      var nextSeg = this.pendingSegs[0];
      if (nextSeg.d.length + SEG_HEADER_SIZE + curDataString.length <= MAX_URL_DATA_SIZE) {
        var theSeg = this.pendingSegs.shift();
        curDataString = curDataString + "&" + FIREBASE_LONGPOLL_SEGMENT_NUM_PARAM + i + "=" + theSeg.seg + "&" + FIREBASE_LONGPOLL_SEGMENTS_IN_PACKET + i + "=" + theSeg.ts + "&" + FIREBASE_LONGPOLL_DATA_PARAM + i + "=" + theSeg.d;
        i++;
      } else {
        break;
      }
    }
    theURL = theURL + curDataString;
    this.addLongPollTag_(theURL, this.currentSerial);
    return true;
  } else {
    return false;
  }
};
FirebaseIFrameScriptHolder.prototype.enqueueSegment = function(segnum, totalsegs, data) {
  this.pendingSegs.push({seg:segnum, ts:totalsegs, d:data});
  if (this.alive) {
    this.newRequest_();
  }
};
FirebaseIFrameScriptHolder.prototype.addLongPollTag_ = function(url, serial) {
  var self = this;
  self.outstandingRequests.add(serial, 1);
  var doNewRequest = function() {
    self.outstandingRequests.remove(serial);
    self.newRequest_();
  };
  var keepaliveTimeout = setTimeout(doNewRequest, Math.floor(KEEPALIVE_REQUEST_INTERVAL));
  var readyStateCB = function() {
    clearTimeout(keepaliveTimeout);
    doNewRequest();
  };
  this.addTag(url, readyStateCB);
};
FirebaseIFrameScriptHolder.prototype.addTag = function(url, loadCB) {
  if (NODE_CLIENT) {
    this.doNodeLongPoll(url, loadCB);
  } else {
    var self = this;
    setTimeout(function() {
      try {
        if (!self.sendNewPolls) {
          return;
        }
        var newScript = self.myIFrame.doc.createElement("script");
        newScript.type = "text/javascript";
        newScript.async = true;
        newScript.src = url;
        newScript.onload = newScript.onreadystatechange = function() {
          var rstate = newScript.readyState;
          if (!rstate || rstate === "loaded" || rstate === "complete") {
            newScript.onload = newScript.onreadystatechange = null;
            if (newScript.parentNode) {
              newScript.parentNode.removeChild(newScript);
            }
            loadCB();
          }
        };
        newScript.onerror = function() {
          fb.core.util.log("Long-poll script failed to load: " + url);
          self.sendNewPolls = false;
          self.close();
        };
        self.myIFrame.doc.body.appendChild(newScript);
      } catch (e) {
      }
    }, Math.floor(1));
  }
};
if (typeof NODE_CLIENT !== "undefined" && NODE_CLIENT) {
  FirebaseIFrameScriptHolder.request = null;
  FirebaseIFrameScriptHolder.nodeRestRequest = function(req, onComplete) {
    if (!FirebaseIFrameScriptHolder.request) {
      FirebaseIFrameScriptHolder.request = (require("request"));
    }
    FirebaseIFrameScriptHolder.request(req, function(error, response, body) {
      if (error) {
        throw "Rest request for " + req.url + " failed.";
      }
      if (onComplete) {
        onComplete(body);
      }
    });
  };
  FirebaseIFrameScriptHolder.prototype.doNodeLongPoll = function(url, loadCB) {
    var self = this;
    FirebaseIFrameScriptHolder.nodeRestRequest({url:url, forever:true}, function(body) {
      self.evalBody(body);
      loadCB();
    });
  };
  FirebaseIFrameScriptHolder.prototype.evalBody = function(body) {
    eval("var jsonpCB = function(" + FIREBASE_LONGPOLL_COMMAND_CB_NAME + ", " + FIREBASE_LONGPOLL_DATA_CB_NAME + ") {" + body + "}");
    jsonpCB(this.commandCB, this.onMessageCB);
  };
}
;goog.provide("fb.realtime.WebSocketConnection");
goog.require("fb.constants");
goog.require("fb.core.stats.StatsManager");
goog.require("fb.core.storage");
goog.require("fb.core.util");
goog.require("fb.realtime.Constants");
goog.require("fb.realtime.Transport");
goog.require("fb.util.json");
var WEBSOCKET_MAX_FRAME_SIZE = 16384;
var WEBSOCKET_KEEPALIVE_INTERVAL = 45E3;
fb.WebSocket = null;
if (NODE_CLIENT) {
  goog.require("fb.core.util.NodePatches");
  fb.WebSocket = require("faye-websocket")["Client"];
} else {
  if (typeof MozWebSocket !== "undefined") {
    fb.WebSocket = MozWebSocket;
  } else {
    if (typeof WebSocket !== "undefined") {
      fb.WebSocket = WebSocket;
    }
  }
}
fb.realtime.WebSocketConnection = function(connId, repoInfo, sessionId) {
  this.connId = connId;
  this.log_ = fb.core.util.logWrapper(this.connId);
  this.keepaliveTimer = null;
  this.frames = null;
  this.totalFrames = 0;
  this.bytesSent = 0;
  this.bytesReceived = 0;
  this.stats_ = fb.core.stats.StatsManager.getCollection(repoInfo);
  this.connURL = (repoInfo.secure ? "wss://" : "ws://") + repoInfo.internalHost + "/.ws?" + fb.realtime.Constants.VERSION_PARAM + "=" + fb.realtime.Constants.PROTOCOL_VERSION;
  if (!NODE_CLIENT && typeof location !== "undefined" && location.href && location.href.indexOf(fb.realtime.Constants.FORGE_DOMAIN) !== -1) {
    this.connURL = this.connURL + "&" + fb.realtime.Constants.REFERER_PARAM + "=" + fb.realtime.Constants.FORGE_REF;
  }
  if (repoInfo.needsQueryParam()) {
    this.connURL = this.connURL + "&ns=" + repoInfo.namespace;
  }
  if (sessionId) {
    this.connURL = this.connURL + "&" + fb.realtime.Constants.SESSION_PARAM + "=" + sessionId;
  }
};
fb.realtime.WebSocketConnection.prototype.open = function(onMess, onDisconn) {
  this.onDisconnect = onDisconn;
  this.onMessage = onMess;
  this.log_("Websocket connecting to " + this.connURL);
  this.everConnected_ = false;
  fb.core.storage.PersistentStorage.set("previous_websocket_failure", true);
  try {
    if (NODE_CLIENT) {
      var options = {"headers":{"User-Agent":"Firebase/" + fb.realtime.Constants.PROTOCOL_VERSION + "/" + CLIENT_VERSION + "/" + process.platform + "/Node"}};
      this.mySock = new fb.WebSocket(this.connURL, [], options);
    } else {
      this.mySock = new fb.WebSocket(this.connURL);
    }
  } catch (e) {
    this.log_("Error instantiating WebSocket.");
    var error = e.message || e.data;
    if (error) {
      this.log_(error);
    }
    this.onClosed_();
    return;
  }
  var self = this;
  this.mySock.onopen = function() {
    self.log_("Websocket connected.");
    self.everConnected_ = true;
  };
  this.mySock.onclose = function() {
    self.log_("Websocket connection was disconnected.");
    self.mySock = null;
    self.onClosed_();
  };
  this.mySock.onmessage = function(m) {
    self.handleIncomingFrame(m);
  };
  this.mySock.onerror = function(e) {
    self.log_("WebSocket error.  Closing connection.");
    var error = e.message || e.data;
    if (error) {
      self.log_(error);
    }
    self.onClosed_();
  };
};
fb.realtime.WebSocketConnection.prototype.start = function() {
};
fb.realtime.WebSocketConnection.forceDisallow = function() {
  fb.realtime.WebSocketConnection.forceDisallow_ = true;
};
fb.realtime.WebSocketConnection["isAvailable"] = function() {
  var isOldAndroid = false;
  if (typeof navigator !== "undefined" && navigator.userAgent) {
    var oldAndroidRegex = /Android ([0-9]{0,}\.[0-9]{0,})/;
    var oldAndroidMatch = navigator.userAgent.match(oldAndroidRegex);
    if (oldAndroidMatch && oldAndroidMatch.length > 1) {
      if (parseFloat(oldAndroidMatch[1]) < 4.4) {
        isOldAndroid = true;
      }
    }
  }
  return!isOldAndroid && fb.WebSocket !== null && !fb.realtime.WebSocketConnection.forceDisallow_;
};
fb.realtime.WebSocketConnection["responsesRequiredToBeHealthy"] = 2;
fb.realtime.WebSocketConnection["healthyTimeout"] = 3E4;
fb.realtime.WebSocketConnection.previouslyFailed = function() {
  return fb.core.storage.PersistentStorage.isInMemoryStorage || fb.core.storage.PersistentStorage.get("previous_websocket_failure") === true;
};
fb.realtime.WebSocketConnection.prototype.markConnectionHealthy = function() {
  fb.core.storage.PersistentStorage.remove("previous_websocket_failure");
};
fb.realtime.WebSocketConnection.prototype.appendFrame_ = function(data) {
  this.frames.push(data);
  if (this.frames.length == this.totalFrames) {
    var fullMess = this.frames.join("");
    this.frames = null;
    var jsonMess = fb.util.json.eval(fullMess);
    this.onMessage(jsonMess);
  }
};
fb.realtime.WebSocketConnection.prototype.handleNewFrameCount_ = function(frameCount) {
  this.totalFrames = frameCount;
  this.frames = [];
};
fb.realtime.WebSocketConnection.prototype.extractFrameCount_ = function(data) {
  fb.core.util.assert(this.frames === null, "We already have a frame buffer");
  if (data.length <= 6) {
    var frameCount = Number(data);
    if (!isNaN(frameCount)) {
      this.handleNewFrameCount_(frameCount);
      return null;
    }
  }
  this.handleNewFrameCount_(1);
  return data;
};
fb.realtime.WebSocketConnection.prototype.handleIncomingFrame = function(mess) {
  if (this.mySock === null) {
    return;
  }
  var data = mess["data"];
  this.bytesReceived += data.length;
  this.stats_.incrementCounter("bytes_received", data.length);
  this.resetKeepAlive();
  if (this.frames !== null) {
    this.appendFrame_(data);
  } else {
    var remainingData = this.extractFrameCount_(data);
    if (remainingData !== null) {
      this.appendFrame_(remainingData);
    }
  }
};
fb.realtime.WebSocketConnection.prototype.send = function(data) {
  this.resetKeepAlive();
  var dataStr = fb.util.json.stringify(data);
  this.bytesSent += dataStr.length;
  this.stats_.incrementCounter("bytes_sent", dataStr.length);
  var dataSegs = fb.core.util.splitStringBySize(dataStr, WEBSOCKET_MAX_FRAME_SIZE);
  if (dataSegs.length > 1) {
    this.mySock.send(String(dataSegs.length));
  }
  for (var i = 0;i < dataSegs.length;i++) {
    this.mySock.send(dataSegs[i]);
  }
};
fb.realtime.WebSocketConnection.prototype.shutdown_ = function() {
  this.isClosed_ = true;
  if (this.keepaliveTimer) {
    clearInterval(this.keepaliveTimer);
    this.keepaliveTimer = null;
  }
  if (this.mySock) {
    this.mySock.close();
    this.mySock = null;
  }
};
fb.realtime.WebSocketConnection.prototype.onClosed_ = function() {
  if (!this.isClosed_) {
    this.log_("WebSocket is closing itself");
    this.shutdown_();
    if (this.onDisconnect) {
      this.onDisconnect(this.everConnected_);
      this.onDisconnect = null;
    }
  }
};
fb.realtime.WebSocketConnection.prototype.close = function() {
  if (!this.isClosed_) {
    this.log_("WebSocket is being closed");
    this.shutdown_();
  }
};
fb.realtime.WebSocketConnection.prototype.resetKeepAlive = function() {
  var self = this;
  clearInterval(this.keepaliveTimer);
  this.keepaliveTimer = setInterval(function() {
    if (self.mySock) {
      self.mySock.send("0");
    }
    self.resetKeepAlive();
  }, Math.floor(WEBSOCKET_KEEPALIVE_INTERVAL));
};
goog.require("fb.constants");
goog.require("fb.realtime.BrowserPollConnection");
goog.require("fb.realtime.Transport");
goog.provide("fb.realtime.TransportManager");
goog.require("fb.realtime.WebSocketConnection");
fb.realtime.TransportManager = function(repoInfo) {
  this.initTransports_(repoInfo);
};
fb.realtime.TransportManager.ALL_TRANSPORTS = [fb.realtime.BrowserPollConnection, fb.realtime.WebSocketConnection];
fb.realtime.TransportManager.prototype.initTransports_ = function(repoInfo) {
  var isWebSocketsAvailable = fb.realtime.WebSocketConnection && fb.realtime.WebSocketConnection["isAvailable"]();
  var isSkipPollConnection = isWebSocketsAvailable && !fb.realtime.WebSocketConnection.previouslyFailed();
  if (repoInfo.webSocketOnly) {
    if (!isWebSocketsAvailable) {
      fb.core.util.warn("wss:// URL used, but browser isn't known to support websockets.  Trying anyway.");
    }
    isSkipPollConnection = true;
  }
  if (isSkipPollConnection) {
    this.transports_ = [fb.realtime.WebSocketConnection];
  } else {
    var transports = this.transports_ = [];
    fb.core.util.each(fb.realtime.TransportManager.ALL_TRANSPORTS, function(i, transport) {
      if (transport && transport["isAvailable"]()) {
        transports.push(transport);
      }
    });
  }
};
fb.realtime.TransportManager.prototype.initialTransport = function() {
  if (this.transports_.length > 0) {
    return this.transports_[0];
  } else {
    throw new Error("No transports available");
  }
};
fb.realtime.TransportManager.prototype.upgradeTransport = function() {
  if (this.transports_.length > 1) {
    return this.transports_[1];
  } else {
    return null;
  }
};
goog.provide("fb.realtime.Connection");
goog.require("fb.core.storage");
goog.require("fb.core.util");
goog.require("fb.realtime.Constants");
goog.require("fb.realtime.TransportManager");
var UPGRADE_TIMEOUT = 6E4;
var DELAY_BEFORE_SENDING_EXTRA_REQUESTS = 5E3;
var BYTES_SENT_HEALTHY_OVERRIDE = 10 * 1024;
var BYTES_RECEIVED_HEALTHY_OVERRIDE = 100 * 1024;
var REALTIME_STATE_CONNECTING = 0;
var REALTIME_STATE_CONNECTED = 1;
var REALTIME_STATE_DISCONNECTED = 2;
var MESSAGE_TYPE = "t";
var MESSAGE_DATA = "d";
var CONTROL_SHUTDOWN = "s";
var CONTROL_RESET = "r";
var CONTROL_ERROR = "e";
var CONTROL_PONG = "o";
var SWITCH_ACK = "a";
var END_TRANSMISSION = "n";
var PING = "p";
var SERVER_HELLO = "h";
fb.realtime.Connection = function(connId, repoInfo, onMessage, onReady, onDisconnect, onKill) {
  this.id = connId;
  this.log_ = fb.core.util.logWrapper("c:" + this.id + ":");
  this.onMessage_ = onMessage;
  this.onReady_ = onReady;
  this.onDisconnect_ = onDisconnect;
  this.onKill_ = onKill;
  this.repoInfo_ = repoInfo;
  this.pendingDataMessages = [];
  this.connectionCount = 0;
  this.transportManager_ = new fb.realtime.TransportManager(repoInfo);
  this.state_ = REALTIME_STATE_CONNECTING;
  this.log_("Connection created");
  this.start_();
};
fb.realtime.Connection.prototype.start_ = function() {
  var conn = this.transportManager_.initialTransport();
  this.conn_ = new conn(this.nextTransportId_(), this.repoInfo_);
  this.primaryResponsesRequired_ = conn["responsesRequiredToBeHealthy"] || 0;
  var onMessageReceived = this.connReceiver_(this.conn_);
  var onConnectionLost = this.disconnReceiver_(this.conn_);
  this.tx_ = this.conn_;
  this.rx_ = this.conn_;
  this.secondaryConn_ = null;
  this.isHealthy_ = false;
  var self = this;
  setTimeout(function() {
    self.conn_ && self.conn_.open(onMessageReceived, onConnectionLost);
  }, Math.floor(0));
  var healthyTimeout_ms = conn["healthyTimeout"] || 0;
  if (healthyTimeout_ms > 0) {
    this.healthyTimeout_ = setTimeout(function() {
      self.healthyTimeout_ = null;
      if (!self.isHealthy_) {
        if (self.conn_ && self.conn_.bytesReceived > BYTES_RECEIVED_HEALTHY_OVERRIDE) {
          self.log_("Connection exceeded healthy timeout but has received " + self.conn_.bytesReceived + " bytes.  Marking connection healthy.");
          self.isHealthy_ = true;
          self.conn_.markConnectionHealthy();
        } else {
          if (self.conn_ && self.conn_.bytesSent > BYTES_SENT_HEALTHY_OVERRIDE) {
            self.log_("Connection exceeded healthy timeout but has sent " + self.conn_.bytesSent + " bytes.  Leaving connection alive.");
          } else {
            self.log_("Closing unhealthy connection after timeout.");
            self.close();
          }
        }
      }
    }, Math.floor(healthyTimeout_ms));
  }
};
fb.realtime.Connection.prototype.nextTransportId_ = function() {
  return "c:" + this.id + ":" + this.connectionCount++;
};
fb.realtime.Connection.prototype.disconnReceiver_ = function(conn) {
  var self = this;
  return function(everConnected) {
    if (conn === self.conn_) {
      self.onConnectionLost_(everConnected);
    } else {
      if (conn === self.secondaryConn_) {
        self.log_("Secondary connection lost.");
        self.onSecondaryConnectionLost_();
      } else {
        self.log_("closing an old connection");
      }
    }
  };
};
fb.realtime.Connection.prototype.connReceiver_ = function(conn) {
  var self = this;
  return function(message) {
    if (self.state_ != REALTIME_STATE_DISCONNECTED) {
      if (conn === self.rx_) {
        self.onPrimaryMessageReceived_(message);
      } else {
        if (conn === self.secondaryConn_) {
          self.onSecondaryMessageReceived_(message);
        } else {
          self.log_("message on old connection");
        }
      }
    }
  };
};
fb.realtime.Connection.prototype.sendRequest = function(dataMsg) {
  var msg = {"t":"d", "d":dataMsg};
  this.sendData_(msg);
};
fb.realtime.Connection.prototype.tryCleanupConnection = function() {
  if (this.tx_ === this.secondaryConn_ && this.rx_ === this.secondaryConn_) {
    this.log_("cleaning up and promoting a connection: " + this.secondaryConn_.connId);
    this.conn_ = this.secondaryConn_;
    this.secondaryConn_ = null;
  }
};
fb.realtime.Connection.prototype.onSecondaryControl_ = function(controlData) {
  if (MESSAGE_TYPE in controlData) {
    var cmd = controlData[MESSAGE_TYPE];
    if (cmd === SWITCH_ACK) {
      this.upgradeIfSecondaryHealthy_();
    } else {
      if (cmd === CONTROL_RESET) {
        this.log_("Got a reset on secondary, closing it");
        this.secondaryConn_.close();
        if (this.tx_ === this.secondaryConn_ || this.rx_ === this.secondaryConn_) {
          this.close();
        }
      } else {
        if (cmd === CONTROL_PONG) {
          this.log_("got pong on secondary.");
          this.secondaryResponsesRequired_--;
          this.upgradeIfSecondaryHealthy_();
        }
      }
    }
  }
};
fb.realtime.Connection.prototype.onSecondaryMessageReceived_ = function(parsedData) {
  var layer = fb.core.util.requireKey("t", parsedData);
  var data = fb.core.util.requireKey("d", parsedData);
  if (layer == "c") {
    this.onSecondaryControl_(data);
  } else {
    if (layer == "d") {
      this.pendingDataMessages.push(data);
    } else {
      throw new Error("Unknown protocol layer: " + layer);
    }
  }
};
fb.realtime.Connection.prototype.upgradeIfSecondaryHealthy_ = function() {
  if (this.secondaryResponsesRequired_ <= 0) {
    this.log_("Secondary connection is healthy.");
    this.isHealthy_ = true;
    this.secondaryConn_.markConnectionHealthy();
    this.proceedWithUpgrade_();
  } else {
    this.log_("sending ping on secondary.");
    this.secondaryConn_.send({"t":"c", "d":{"t":PING, "d":{}}});
  }
};
fb.realtime.Connection.prototype.proceedWithUpgrade_ = function() {
  this.secondaryConn_.start();
  this.log_("sending client ack on secondary");
  this.secondaryConn_.send({"t":"c", "d":{"t":SWITCH_ACK, "d":{}}});
  this.log_("Ending transmission on primary");
  this.conn_.send({"t":"c", "d":{"t":END_TRANSMISSION, "d":{}}});
  this.tx_ = this.secondaryConn_;
  this.tryCleanupConnection();
};
fb.realtime.Connection.prototype.onPrimaryMessageReceived_ = function(parsedData) {
  var layer = fb.core.util.requireKey("t", parsedData);
  var data = fb.core.util.requireKey("d", parsedData);
  if (layer == "c") {
    this.onControl_(data);
  } else {
    if (layer == "d") {
      this.onDataMessage_(data);
    }
  }
};
fb.realtime.Connection.prototype.onDataMessage_ = function(message) {
  this.onPrimaryResponse_();
  this.onMessage_(message);
};
fb.realtime.Connection.prototype.onPrimaryResponse_ = function() {
  if (!this.isHealthy_) {
    this.primaryResponsesRequired_--;
    if (this.primaryResponsesRequired_ <= 0) {
      this.log_("Primary connection is healthy.");
      this.isHealthy_ = true;
      this.conn_.markConnectionHealthy();
    }
  }
};
fb.realtime.Connection.prototype.onControl_ = function(controlData) {
  var cmd = fb.core.util.requireKey(MESSAGE_TYPE, controlData);
  if (MESSAGE_DATA in controlData) {
    var payload = controlData[MESSAGE_DATA];
    if (cmd === SERVER_HELLO) {
      this.onHandshake_(payload);
    } else {
      if (cmd === END_TRANSMISSION) {
        this.log_("recvd end transmission on primary");
        this.rx_ = this.secondaryConn_;
        for (var i = 0;i < this.pendingDataMessages.length;++i) {
          this.onDataMessage_(this.pendingDataMessages[i]);
        }
        this.pendingDataMessages = [];
        this.tryCleanupConnection();
      } else {
        if (cmd === CONTROL_SHUTDOWN) {
          this.onConnectionShutdown_(payload);
        } else {
          if (cmd === CONTROL_RESET) {
            this.onReset_(payload);
          } else {
            if (cmd === CONTROL_ERROR) {
              fb.core.util.error("Server Error: " + payload);
            } else {
              if (cmd === CONTROL_PONG) {
                this.log_("got pong on primary.");
                this.onPrimaryResponse_();
                this.sendPingOnPrimaryIfNecessary_();
              } else {
                fb.core.util.error("Unknown control packet command: " + cmd);
              }
            }
          }
        }
      }
    }
  }
};
fb.realtime.Connection.prototype.onHandshake_ = function(handshake) {
  var timestamp = handshake["ts"];
  var version = handshake["v"];
  var host = handshake["h"];
  this.sessionId = handshake["s"];
  this.repoInfo_.updateHost(host);
  if (this.state_ == REALTIME_STATE_CONNECTING) {
    this.conn_.start();
    this.onConnectionEstablished_(this.conn_, timestamp);
    if (fb.realtime.Constants.PROTOCOL_VERSION !== version) {
      fb.core.util.warn("Protocol version mismatch detected");
    }
    this.tryStartUpgrade_();
  }
};
fb.realtime.Connection.prototype.tryStartUpgrade_ = function() {
  var conn = this.transportManager_.upgradeTransport();
  if (conn) {
    this.startUpgrade_(conn);
  }
};
fb.realtime.Connection.prototype.startUpgrade_ = function(conn) {
  this.secondaryConn_ = new conn(this.nextTransportId_(), this.repoInfo_, this.sessionId);
  this.secondaryResponsesRequired_ = conn["responsesRequiredToBeHealthy"] || 0;
  var onMessage = this.connReceiver_(this.secondaryConn_);
  var onDisconnect = this.disconnReceiver_(this.secondaryConn_);
  this.secondaryConn_.open(onMessage, onDisconnect);
  var self = this;
  setTimeout(function() {
    if (self.secondaryConn_) {
      self.log_("Timed out trying to upgrade.");
      self.secondaryConn_.close();
    }
  }, Math.floor(UPGRADE_TIMEOUT));
};
fb.realtime.Connection.prototype.onReset_ = function(host) {
  this.log_("Reset packet received.  New host: " + host);
  this.repoInfo_.updateHost(host);
  if (this.state_ === REALTIME_STATE_CONNECTED) {
    this.close();
  } else {
    this.closeConnections_();
    this.start_();
  }
};
fb.realtime.Connection.prototype.onConnectionEstablished_ = function(conn, timestamp) {
  this.log_("Realtime connection established.");
  this.conn_ = conn;
  this.state_ = REALTIME_STATE_CONNECTED;
  if (this.onReady_) {
    this.onReady_(timestamp);
    this.onReady_ = null;
  }
  var self = this;
  if (this.primaryResponsesRequired_ === 0) {
    this.log_("Primary connection is healthy.");
    this.isHealthy_ = true;
  } else {
    setTimeout(function() {
      self.sendPingOnPrimaryIfNecessary_();
    }, Math.floor(DELAY_BEFORE_SENDING_EXTRA_REQUESTS));
  }
};
fb.realtime.Connection.prototype.sendPingOnPrimaryIfNecessary_ = function() {
  if (!this.isHealthy_ && this.state_ === REALTIME_STATE_CONNECTED) {
    this.log_("sending ping on primary.");
    this.sendData_({"t":"c", "d":{"t":PING, "d":{}}});
  }
};
fb.realtime.Connection.prototype.onSecondaryConnectionLost_ = function() {
  var conn = this.secondaryConn_;
  this.secondaryConn_ = null;
  if (this.tx_ === conn || this.rx_ === conn) {
    this.close();
  }
};
fb.realtime.Connection.prototype.onConnectionLost_ = function(everConnected) {
  this.conn_ = null;
  if (!everConnected && this.state_ === REALTIME_STATE_CONNECTING) {
    this.log_("Realtime connection failed.");
    if (this.repoInfo_.isCacheableHost()) {
      fb.core.storage.PersistentStorage.remove("host:" + this.repoInfo_.host);
      this.repoInfo_.internalHost = this.repoInfo_.host;
    }
  } else {
    if (this.state_ === REALTIME_STATE_CONNECTED) {
      this.log_("Realtime connection lost.");
    }
  }
  this.close();
};
fb.realtime.Connection.prototype.onConnectionShutdown_ = function(reason) {
  this.log_("Connection shutdown command received. Shutting down...");
  if (this.onKill_) {
    this.onKill_(reason);
    this.onKill_ = null;
  }
  this.onDisconnect_ = null;
  this.close();
};
fb.realtime.Connection.prototype.sendData_ = function(data) {
  if (this.state_ !== REALTIME_STATE_CONNECTED) {
    throw "Connection is not connected";
  } else {
    this.tx_.send(data);
  }
};
fb.realtime.Connection.prototype.close = function() {
  if (this.state_ !== REALTIME_STATE_DISCONNECTED) {
    this.log_("Closing realtime connection.");
    this.state_ = REALTIME_STATE_DISCONNECTED;
    this.closeConnections_();
    if (this.onDisconnect_) {
      this.onDisconnect_();
      this.onDisconnect_ = null;
    }
  }
};
fb.realtime.Connection.prototype.closeConnections_ = function() {
  this.log_("Shutting down all connections");
  if (this.conn_) {
    this.conn_.close();
    this.conn_ = null;
  }
  if (this.secondaryConn_) {
    this.secondaryConn_.close();
    this.secondaryConn_ = null;
  }
  if (this.healthyTimeout_) {
    clearTimeout(this.healthyTimeout_);
    this.healthyTimeout_ = null;
  }
};
goog.provide("fb.core.PersistentConnection");
goog.require("fb.core.ServerActions");
goog.require("fb.core.util");
goog.require("fb.core.util.OnlineMonitor");
goog.require("fb.core.util.VisibilityMonitor");
goog.require("fb.login.util.environment");
goog.require("fb.realtime.Connection");
goog.require("fb.util.json");
goog.require("fb.util.jwt");
var RECONNECT_MIN_DELAY = 1E3;
var RECONNECT_MAX_DELAY_DEFAULT = 60 * 5 * 1E3;
var RECONNECT_MAX_DELAY_FOR_ADMINS = 30 * 1E3;
var RECONNECT_DELAY_MULTIPLIER = 1.3;
var RECONNECT_DELAY_RESET_TIMEOUT = 3E4;
fb.core.PersistentConnection = function(repoInfo, onDataUpdate, onConnectStatus, onServerInfoUpdate) {
  this.id = fb.core.PersistentConnection.nextPersistentConnectionId_++;
  this.log_ = fb.core.util.logWrapper("p:" + this.id + ":");
  this.interrupted_ = false;
  this.killed_ = false;
  this.listens_ = {};
  this.outstandingPuts_ = [];
  this.outstandingPutCount_ = 0;
  this.onDisconnectRequestQueue_ = [];
  this.connected_ = false;
  this.reconnectDelay_ = RECONNECT_MIN_DELAY;
  this.maxReconnectDelay_ = RECONNECT_MAX_DELAY_DEFAULT;
  this.onDataUpdate_ = onDataUpdate;
  this.onConnectStatus_ = onConnectStatus;
  this.onServerInfoUpdate_ = onServerInfoUpdate;
  this.repoInfo_ = repoInfo;
  this.securityDebugCallback_ = null;
  this.requestCBHash_ = {};
  this.requestNumber_ = 0;
  this.firstConnection_ = true;
  this.lastConnectionAttemptTime_ = null;
  this.lastConnectionEstablishedTime_ = null;
  this.scheduleConnect_(0);
  fb.core.util.VisibilityMonitor.getInstance().on("visible", this.onVisible_, this);
  if (repoInfo.host.indexOf("fblocal") === -1) {
    fb.core.util.OnlineMonitor.getInstance().on("online", this.onOnline_, this);
  }
};
fb.core.PersistentConnection.nextPersistentConnectionId_ = 0;
fb.core.PersistentConnection.nextConnectionId_ = 0;
fb.core.PersistentConnection.prototype.sendRequest = function(action, body, onResponse) {
  var curReqNum = ++this.requestNumber_;
  var msg = {"r":curReqNum, "a":action, "b":body};
  this.log_(fb.util.json.stringify(msg));
  fb.core.util.assert(this.connected_, "sendRequest call when we're not connected not allowed.");
  this.realtime_.sendRequest(msg);
  if (onResponse) {
    this.requestCBHash_[curReqNum] = onResponse;
  }
};
fb.core.PersistentConnection.prototype.listen = function(query, currentHashFn, tag, onComplete) {
  var queryId = query.queryIdentifier();
  var pathString = query.path.toString();
  this.log_("Listen called for " + pathString + " " + queryId);
  this.listens_[pathString] = this.listens_[pathString] || {};
  fb.core.util.assert(!this.listens_[pathString][queryId], "listen() called twice for same path/queryId.");
  var listenSpec = {onComplete:onComplete, hashFn:currentHashFn, query:query, tag:tag};
  this.listens_[pathString][queryId] = listenSpec;
  if (this.connected_) {
    this.sendListen_(listenSpec);
  }
};
fb.core.PersistentConnection.prototype.sendListen_ = function(listenSpec) {
  var query = listenSpec.query;
  var pathString = query.path.toString();
  var queryId = query.queryIdentifier();
  var self = this;
  this.log_("Listen on " + pathString + " for " + queryId);
  var req = {"p":pathString};
  var action = "q";
  if (listenSpec.tag) {
    req["q"] = query.queryObject();
    req["t"] = listenSpec.tag;
  }
  req["h"] = listenSpec.hashFn();
  this.sendRequest(action, req, function(message) {
    var payload = message["d"];
    var status = message["s"];
    self.warnOnListenWarnings_(payload, query);
    var currentListenSpec = self.listens_[pathString] && self.listens_[pathString][queryId];
    if (currentListenSpec === listenSpec) {
      self.log_("listen response", message);
      if (status !== "ok") {
        self.removeListen_(pathString, queryId);
      }
      if (listenSpec.onComplete) {
        listenSpec.onComplete(status, payload);
      }
    }
  });
};
fb.core.PersistentConnection.prototype.warnOnListenWarnings_ = function(payload, query) {
  if (payload && typeof payload === "object" && fb.util.obj.contains(payload, "w")) {
    var warnings = fb.util.obj.get(payload, "w");
    if (goog.isArray(warnings) && goog.array.contains(warnings, "no_index")) {
      var indexSpec = '".indexOn": "' + query.getQueryParams().getIndex().toString() + '"';
      var indexPath = query.path.toString();
      fb.core.util.warn("Using an unspecified index. Consider adding " + indexSpec + " at " + indexPath + " to your security rules for better performance");
    }
  }
};
fb.core.PersistentConnection.prototype.auth = function(cred, opt_callback, opt_cancelCallback) {
  this.credential_ = {cred:cred, firstRequestSent:false, callback:opt_callback, cancelCallback:opt_cancelCallback};
  this.log_("Authenticating using credential: " + cred);
  this.tryAuth();
  this.reduceReconnectDelayIfAdminCredential_(cred);
};
fb.core.PersistentConnection.prototype.reduceReconnectDelayIfAdminCredential_ = function(credential) {
  var isFirebaseSecret = credential.length == 40;
  if (isFirebaseSecret || fb.util.jwt.isAdmin(credential)) {
    this.log_("Admin auth credential detected.  Reducing max reconnect time.");
    this.maxReconnectDelay_ = RECONNECT_MAX_DELAY_FOR_ADMINS;
  }
};
fb.core.PersistentConnection.prototype.unauth = function(onComplete) {
  delete this.credential_;
  if (this.connected_) {
    this.sendRequest("unauth", {}, function(result) {
      var status = result["s"];
      var errorReason = result["d"];
      onComplete(status, errorReason);
    });
  }
};
fb.core.PersistentConnection.prototype.tryAuth = function() {
  var authdata = this.credential_;
  var self = this;
  if (this.connected_ && authdata) {
    var requestData = {"cred":authdata.cred};
    this.sendRequest("auth", requestData, function(res) {
      var status = res["s"];
      var data = res["d"] || "error";
      if (status !== "ok" && self.credential_ === authdata) {
        delete self.credential_;
      }
      if (!authdata.firstRequestSent) {
        authdata.firstRequestSent = true;
        if (authdata.callback) {
          authdata.callback(status, data);
        }
      } else {
        if (status !== "ok" && authdata.cancelCallback) {
          authdata.cancelCallback(status, data);
        }
      }
    });
  }
};
fb.core.PersistentConnection.prototype.unlisten = function(query, tag) {
  var pathString = query.path.toString();
  var queryId = query.queryIdentifier();
  this.log_("Unlisten called for " + pathString + " " + queryId);
  var listen = this.removeListen_(pathString, queryId);
  if (listen && this.connected_) {
    this.sendUnlisten_(pathString, queryId, query.queryObject(), tag);
  }
};
fb.core.PersistentConnection.prototype.sendUnlisten_ = function(pathString, queryId, queryObj, tag) {
  this.log_("Unlisten on " + pathString + " for " + queryId);
  var self = this;
  var req = {"p":pathString};
  var action = "n";
  if (tag) {
    req["q"] = queryObj;
    req["t"] = tag;
  }
  this.sendRequest(action, req);
};
fb.core.PersistentConnection.prototype.onDisconnectPut = function(pathString, data, opt_onComplete) {
  if (this.connected_) {
    this.sendOnDisconnect_("o", pathString, data, opt_onComplete);
  } else {
    this.onDisconnectRequestQueue_.push({pathString:pathString, action:"o", data:data, onComplete:opt_onComplete});
  }
};
fb.core.PersistentConnection.prototype.onDisconnectMerge = function(pathString, data, opt_onComplete) {
  if (this.connected_) {
    this.sendOnDisconnect_("om", pathString, data, opt_onComplete);
  } else {
    this.onDisconnectRequestQueue_.push({pathString:pathString, action:"om", data:data, onComplete:opt_onComplete});
  }
};
fb.core.PersistentConnection.prototype.onDisconnectCancel = function(pathString, opt_onComplete) {
  if (this.connected_) {
    this.sendOnDisconnect_("oc", pathString, null, opt_onComplete);
  } else {
    this.onDisconnectRequestQueue_.push({pathString:pathString, action:"oc", data:null, onComplete:opt_onComplete});
  }
};
fb.core.PersistentConnection.prototype.sendOnDisconnect_ = function(action, pathString, data, opt_onComplete) {
  var self = this;
  var request = {"p":pathString, "d":data};
  self.log_("onDisconnect " + action, request);
  this.sendRequest(action, request, function(response) {
    if (opt_onComplete) {
      setTimeout(function() {
        opt_onComplete(response["s"], response["d"]);
      }, Math.floor(0));
    }
  });
};
fb.core.PersistentConnection.prototype.put = function(pathString, data, opt_onComplete, opt_hash) {
  this.putInternal("p", pathString, data, opt_onComplete, opt_hash);
};
fb.core.PersistentConnection.prototype.merge = function(pathString, data, onComplete, opt_hash) {
  this.putInternal("m", pathString, data, onComplete, opt_hash);
};
fb.core.PersistentConnection.prototype.putInternal = function(action, pathString, data, opt_onComplete, opt_hash) {
  var request = {"p":pathString, "d":data};
  if (goog.isDef(opt_hash)) {
    request["h"] = opt_hash;
  }
  this.outstandingPuts_.push({action:action, request:request, onComplete:opt_onComplete});
  this.outstandingPutCount_++;
  var index = this.outstandingPuts_.length - 1;
  if (this.connected_) {
    this.sendPut_(index);
  } else {
    this.log_("Buffering put: " + pathString);
  }
};
fb.core.PersistentConnection.prototype.sendPut_ = function(index) {
  var self = this;
  var action = this.outstandingPuts_[index].action;
  var request = this.outstandingPuts_[index].request;
  var onComplete = this.outstandingPuts_[index].onComplete;
  this.outstandingPuts_[index].queued = this.connected_;
  this.sendRequest(action, request, function(message) {
    self.log_(action + " response", message);
    delete self.outstandingPuts_[index];
    self.outstandingPutCount_--;
    if (self.outstandingPutCount_ === 0) {
      self.outstandingPuts_ = [];
    }
    if (onComplete) {
      onComplete(message["s"], message["d"]);
    }
  });
};
fb.core.PersistentConnection.prototype.reportStats = function(stats) {
  if (this.connected_) {
    var request = {"c":stats};
    this.log_("reportStats", request);
    this.sendRequest("s", request, function(result) {
      var status = result["s"];
      if (status !== "ok") {
        var errorReason = result["d"];
        this.log_("reportStats", "Error sending stats: " + errorReason);
      }
    });
  }
};
fb.core.PersistentConnection.prototype.onDataMessage_ = function(message) {
  if ("r" in message) {
    this.log_("from server: " + fb.util.json.stringify(message));
    var reqNum = message["r"];
    var onResponse = this.requestCBHash_[reqNum];
    if (onResponse) {
      delete this.requestCBHash_[reqNum];
      onResponse(message["b"]);
    }
  } else {
    if ("error" in message) {
      throw "A server-side error has occurred: " + message["error"];
    } else {
      if ("a" in message) {
        this.onDataPush_(message["a"], message["b"]);
      }
    }
  }
};
fb.core.PersistentConnection.prototype.onDataPush_ = function(action, body) {
  this.log_("handleServerMessage", action, body);
  if (action === "d") {
    this.onDataUpdate_(body["p"], body["d"], false, body["t"]);
  } else {
    if (action === "m") {
      this.onDataUpdate_(body["p"], body["d"], true, body["t"]);
    } else {
      if (action === "c") {
        this.onListenRevoked_(body["p"], body["q"]);
      } else {
        if (action === "ac") {
          this.onAuthRevoked_(body["s"], body["d"]);
        } else {
          if (action === "sd") {
            this.onSecurityDebugPacket_(body);
          } else {
            fb.core.util.error("Unrecognized action received from server: " + fb.util.json.stringify(action) + "\nAre you using the latest client?");
          }
        }
      }
    }
  }
};
fb.core.PersistentConnection.prototype.onReady_ = function(timestamp) {
  this.log_("connection ready");
  this.connected_ = true;
  this.lastConnectionEstablishedTime_ = (new Date).getTime();
  this.handleTimestamp_(timestamp);
  if (this.firstConnection_) {
    this.sendConnectStats_();
  }
  this.restoreState_();
  this.firstConnection_ = false;
  this.onConnectStatus_(true);
};
fb.core.PersistentConnection.prototype.scheduleConnect_ = function(timeout) {
  fb.core.util.assert(!this.realtime_, "Scheduling a connect when we're already connected/ing?");
  if (this.establishConnectionTimer_) {
    clearTimeout(this.establishConnectionTimer_);
  }
  var self = this;
  this.establishConnectionTimer_ = setTimeout(function() {
    self.establishConnectionTimer_ = null;
    self.establishConnection_();
  }, Math.floor(timeout));
};
fb.core.PersistentConnection.prototype.onVisible_ = function(visible) {
  if (visible && !this.visible_ && this.reconnectDelay_ === this.maxReconnectDelay_) {
    this.log_("Window became visible.  Reducing delay.");
    this.reconnectDelay_ = RECONNECT_MIN_DELAY;
    if (!this.realtime_) {
      this.scheduleConnect_(0);
    }
  }
  this.visible_ = visible;
};
fb.core.PersistentConnection.prototype.onOnline_ = function(online) {
  if (online) {
    this.log_("Browser went online.");
    this.reconnectDelay_ = RECONNECT_MIN_DELAY;
    if (!this.realtime_) {
      this.scheduleConnect_(0);
    }
  } else {
    this.log_("Browser went offline.  Killing connection.");
    if (this.realtime_) {
      this.realtime_.close();
    }
  }
};
fb.core.PersistentConnection.prototype.onRealtimeDisconnect_ = function() {
  this.log_("data client disconnected");
  this.connected_ = false;
  this.realtime_ = null;
  this.cancelSentTransactions_();
  this.requestCBHash_ = {};
  if (this.shouldReconnect_()) {
    if (!this.visible_) {
      this.log_("Window isn't visible.  Delaying reconnect.");
      this.reconnectDelay_ = this.maxReconnectDelay_;
      this.lastConnectionAttemptTime_ = (new Date).getTime();
    } else {
      if (this.lastConnectionEstablishedTime_) {
        var timeSinceLastConnectSucceeded = (new Date).getTime() - this.lastConnectionEstablishedTime_;
        if (timeSinceLastConnectSucceeded > RECONNECT_DELAY_RESET_TIMEOUT) {
          this.reconnectDelay_ = RECONNECT_MIN_DELAY;
        }
        this.lastConnectionEstablishedTime_ = null;
      }
    }
    var timeSinceLastConnectAttempt = (new Date).getTime() - this.lastConnectionAttemptTime_;
    var reconnectDelay = Math.max(0, this.reconnectDelay_ - timeSinceLastConnectAttempt);
    reconnectDelay = Math.random() * reconnectDelay;
    this.log_("Trying to reconnect in " + reconnectDelay + "ms");
    this.scheduleConnect_(reconnectDelay);
    this.reconnectDelay_ = Math.min(this.maxReconnectDelay_, this.reconnectDelay_ * RECONNECT_DELAY_MULTIPLIER);
  }
  this.onConnectStatus_(false);
};
fb.core.PersistentConnection.prototype.establishConnection_ = function() {
  if (this.shouldReconnect_()) {
    this.log_("Making a connection attempt");
    this.lastConnectionAttemptTime_ = (new Date).getTime();
    this.lastConnectionEstablishedTime_ = null;
    var onDataMessage = goog.bind(this.onDataMessage_, this);
    var onReady = goog.bind(this.onReady_, this);
    var onDisconnect = goog.bind(this.onRealtimeDisconnect_, this);
    var connId = this.id + ":" + fb.core.PersistentConnection.nextConnectionId_++;
    var self = this;
    this.realtime_ = new fb.realtime.Connection(connId, this.repoInfo_, onDataMessage, onReady, onDisconnect, function(reason) {
      fb.core.util.warn(reason + " (" + self.repoInfo_.toString() + ")");
      self.killed_ = true;
    });
  }
};
fb.core.PersistentConnection.prototype.interrupt = function() {
  this.interrupted_ = true;
  if (this.realtime_) {
    this.realtime_.close();
  } else {
    if (this.establishConnectionTimer_) {
      clearTimeout(this.establishConnectionTimer_);
      this.establishConnectionTimer_ = null;
    }
    if (this.connected_) {
      this.onRealtimeDisconnect_();
    }
  }
};
fb.core.PersistentConnection.prototype.resume = function() {
  this.interrupted_ = false;
  this.reconnectDelay_ = RECONNECT_MIN_DELAY;
  if (!this.realtime_) {
    this.scheduleConnect_(0);
  }
};
fb.core.PersistentConnection.prototype.handleTimestamp_ = function(timestamp) {
  var delta = timestamp - (new Date).getTime();
  this.onServerInfoUpdate_({"serverTimeOffset":delta});
};
fb.core.PersistentConnection.prototype.cancelSentTransactions_ = function() {
  for (var i = 0;i < this.outstandingPuts_.length;i++) {
    var put = this.outstandingPuts_[i];
    if (put && "h" in put.request && put.queued) {
      if (put.onComplete) {
        put.onComplete("disconnect");
      }
      delete this.outstandingPuts_[i];
      this.outstandingPutCount_--;
    }
  }
  if (this.outstandingPutCount_ === 0) {
    this.outstandingPuts_ = [];
  }
};
fb.core.PersistentConnection.prototype.onListenRevoked_ = function(pathString, opt_query) {
  var queryId;
  if (!opt_query) {
    queryId = "default";
  } else {
    queryId = goog.array.map(opt_query, function(q) {
      return fb.core.util.ObjectToUniqueKey(q);
    }).join("$");
  }
  var listen = this.removeListen_(pathString, queryId);
  if (listen && listen.onComplete) {
    listen.onComplete("permission_denied");
  }
};
fb.core.PersistentConnection.prototype.removeListen_ = function(pathString, queryId) {
  var normalizedPathString = (new fb.core.util.Path(pathString)).toString();
  var listen;
  if (goog.isDef(this.listens_[normalizedPathString])) {
    listen = this.listens_[normalizedPathString][queryId];
    delete this.listens_[normalizedPathString][queryId];
    if (goog.object.getCount(this.listens_[normalizedPathString]) === 0) {
      delete this.listens_[normalizedPathString];
    }
  } else {
    listen = undefined;
  }
  return listen;
};
fb.core.PersistentConnection.prototype.onAuthRevoked_ = function(statusCode, explanation) {
  var cred = this.credential_;
  delete this.credential_;
  if (cred && cred.cancelCallback) {
    cred.cancelCallback(statusCode, explanation);
  }
};
fb.core.PersistentConnection.prototype.onSecurityDebugPacket_ = function(body) {
  if (this.securityDebugCallback_) {
    this.securityDebugCallback_(body);
  } else {
    if ("msg" in body && typeof console !== "undefined") {
      console.log("FIREBASE: " + body["msg"].replace("\n", "\nFIREBASE: "));
    }
  }
};
fb.core.PersistentConnection.prototype.restoreState_ = function() {
  this.tryAuth();
  var self = this;
  goog.object.forEach(this.listens_, function(queries, pathString) {
    goog.object.forEach(queries, function(listenSpec) {
      self.sendListen_(listenSpec);
    });
  });
  for (var i = 0;i < this.outstandingPuts_.length;i++) {
    if (this.outstandingPuts_[i]) {
      this.sendPut_(i);
    }
  }
  while (this.onDisconnectRequestQueue_.length) {
    var request = this.onDisconnectRequestQueue_.shift();
    this.sendOnDisconnect_(request.action, request.pathString, request.data, request.onComplete);
  }
};
fb.core.PersistentConnection.prototype.sendConnectStats_ = function() {
  var stats = {};
  stats["sdk.js." + CLIENT_VERSION.replace(/\./g, "-")] = 1;
  if (fb.login.util.environment.isMobileCordova()) {
    stats["framework.cordova"] = 1;
  }
  this.reportStats(stats);
};
fb.core.PersistentConnection.prototype.shouldReconnect_ = function() {
  var online = fb.core.util.OnlineMonitor.getInstance().currentlyOnline();
  return!this.killed_ && !this.interrupted_ && online;
};
goog.provide("fb.api.INTERNAL");
goog.require("fb.core.PersistentConnection");
goog.require("fb.realtime.Connection");
goog.require("fb.login.transports.PopupReceiver");
goog.require("fb.login.Constants");
fb.api.INTERNAL = {};
fb.api.INTERNAL.forceLongPolling = function() {
  fb.realtime.WebSocketConnection.forceDisallow();
  fb.realtime.BrowserPollConnection.forceAllow();
};
goog.exportProperty(fb.api.INTERNAL, "forceLongPolling", fb.api.INTERNAL.forceLongPolling);
fb.api.INTERNAL.forceWebSockets = function() {
  fb.realtime.BrowserPollConnection.forceDisallow();
};
goog.exportProperty(fb.api.INTERNAL, "forceWebSockets", fb.api.INTERNAL.forceWebSockets);
fb.api.INTERNAL.setSecurityDebugCallback = function(ref, callback) {
  ref.repo.persistentConnection_.securityDebugCallback_ = callback;
};
goog.exportProperty(fb.api.INTERNAL, "setSecurityDebugCallback", fb.api.INTERNAL.setSecurityDebugCallback);
fb.api.INTERNAL.stats = function(ref, showDelta) {
  ref.repo.stats(showDelta);
};
goog.exportProperty(fb.api.INTERNAL, "stats", fb.api.INTERNAL.stats);
fb.api.INTERNAL.statsIncrementCounter = function(ref, metric) {
  ref.repo.statsIncrementCounter(metric);
};
goog.exportProperty(fb.api.INTERNAL, "statsIncrementCounter", fb.api.INTERNAL.statsIncrementCounter);
fb.api.INTERNAL.dataUpdateCount = function(ref) {
  return ref.repo.dataUpdateCount;
};
goog.exportProperty(fb.api.INTERNAL, "dataUpdateCount", fb.api.INTERNAL.dataUpdateCount);
fb.api.INTERNAL.interceptServerData = function(ref, callback) {
  return ref.repo.interceptServerData_(callback);
};
goog.exportProperty(fb.api.INTERNAL, "interceptServerData", fb.api.INTERNAL.interceptServerData);
fb.api.INTERNAL.onLoginPopupOpen = function(callback) {
  new fb.login.transports.PopupReceiver(callback);
};
goog.exportProperty(fb.api.INTERNAL, "onPopupOpen", fb.api.INTERNAL.onLoginPopupOpen);
fb.api.INTERNAL.setAuthenticationServer = function(host) {
  fb.login.Constants.SERVER_HOST = host;
};
goog.exportProperty(fb.api.INTERNAL, "setAuthenticationServer", fb.api.INTERNAL.setAuthenticationServer);
goog.provide("fb.api.DataSnapshot");
goog.require("fb.core.snap");
goog.require("fb.core.util.SortedMap");
goog.require("fb.core.util.validation");
fb.api.DataSnapshot = function(node, ref, index) {
  this.node_ = node;
  this.query_ = ref;
  this.index_ = index;
};
fb.api.DataSnapshot.prototype.val = function() {
  fb.util.validation.validateArgCount("Firebase.DataSnapshot.val", 0, 0, arguments.length);
  return this.node_.val();
};
goog.exportProperty(fb.api.DataSnapshot.prototype, "val", fb.api.DataSnapshot.prototype.val);
fb.api.DataSnapshot.prototype.exportVal = function() {
  fb.util.validation.validateArgCount("Firebase.DataSnapshot.exportVal", 0, 0, arguments.length);
  return this.node_.val(true);
};
goog.exportProperty(fb.api.DataSnapshot.prototype, "exportVal", fb.api.DataSnapshot.prototype.exportVal);
fb.api.DataSnapshot.prototype.exists = function() {
  fb.util.validation.validateArgCount("Firebase.DataSnapshot.exists", 0, 0, arguments.length);
  return!this.node_.isEmpty();
};
goog.exportProperty(fb.api.DataSnapshot.prototype, "exists", fb.api.DataSnapshot.prototype.exists);
fb.api.DataSnapshot.prototype.child = function(childPathString) {
  fb.util.validation.validateArgCount("Firebase.DataSnapshot.child", 0, 1, arguments.length);
  if (goog.isNumber(childPathString)) {
    childPathString = String(childPathString);
  }
  fb.core.util.validation.validatePathString("Firebase.DataSnapshot.child", 1, childPathString, false);
  var childPath = new fb.core.util.Path(childPathString);
  var childRef = this.query_.child(childPath);
  return new fb.api.DataSnapshot(this.node_.getChild(childPath), childRef, fb.core.snap.PriorityIndex);
};
goog.exportProperty(fb.api.DataSnapshot.prototype, "child", fb.api.DataSnapshot.prototype.child);
fb.api.DataSnapshot.prototype.hasChild = function(childPathString) {
  fb.util.validation.validateArgCount("Firebase.DataSnapshot.hasChild", 1, 1, arguments.length);
  fb.core.util.validation.validatePathString("Firebase.DataSnapshot.hasChild", 1, childPathString, false);
  var childPath = new fb.core.util.Path(childPathString);
  return!this.node_.getChild(childPath).isEmpty();
};
goog.exportProperty(fb.api.DataSnapshot.prototype, "hasChild", fb.api.DataSnapshot.prototype.hasChild);
fb.api.DataSnapshot.prototype.getPriority = function() {
  fb.util.validation.validateArgCount("Firebase.DataSnapshot.getPriority", 0, 0, arguments.length);
  return(this.node_.getPriority().val());
};
goog.exportProperty(fb.api.DataSnapshot.prototype, "getPriority", fb.api.DataSnapshot.prototype.getPriority);
fb.api.DataSnapshot.prototype.forEach = function(action) {
  fb.util.validation.validateArgCount("Firebase.DataSnapshot.forEach", 1, 1, arguments.length);
  fb.util.validation.validateCallback("Firebase.DataSnapshot.forEach", 1, action, false);
  if (this.node_.isLeafNode()) {
    return false;
  }
  var childrenNode = (this.node_);
  var self = this;
  return!!childrenNode.forEachChild(this.index_, function(key, node) {
    return action(new fb.api.DataSnapshot(node, self.query_.child(key), fb.core.snap.PriorityIndex));
  });
};
goog.exportProperty(fb.api.DataSnapshot.prototype, "forEach", fb.api.DataSnapshot.prototype.forEach);
fb.api.DataSnapshot.prototype.hasChildren = function() {
  fb.util.validation.validateArgCount("Firebase.DataSnapshot.hasChildren", 0, 0, arguments.length);
  if (this.node_.isLeafNode()) {
    return false;
  } else {
    return!this.node_.isEmpty();
  }
};
goog.exportProperty(fb.api.DataSnapshot.prototype, "hasChildren", fb.api.DataSnapshot.prototype.hasChildren);
fb.api.DataSnapshot.prototype.name = function() {
  fb.core.util.warn("Firebase.DataSnapshot.name() being deprecated. " + "Please use Firebase.DataSnapshot.key() instead.");
  fb.util.validation.validateArgCount("Firebase.DataSnapshot.name", 0, 0, arguments.length);
  return this.key();
};
goog.exportProperty(fb.api.DataSnapshot.prototype, "name", fb.api.DataSnapshot.prototype.name);
fb.api.DataSnapshot.prototype.key = function() {
  fb.util.validation.validateArgCount("Firebase.DataSnapshot.key", 0, 0, arguments.length);
  return this.query_.key();
};
goog.exportProperty(fb.api.DataSnapshot.prototype, "key", fb.api.DataSnapshot.prototype.key);
fb.api.DataSnapshot.prototype.numChildren = function() {
  fb.util.validation.validateArgCount("Firebase.DataSnapshot.numChildren", 0, 0, arguments.length);
  return this.node_.numChildren();
};
goog.exportProperty(fb.api.DataSnapshot.prototype, "numChildren", fb.api.DataSnapshot.prototype.numChildren);
fb.api.DataSnapshot.prototype.ref = function() {
  fb.util.validation.validateArgCount("Firebase.DataSnapshot.ref", 0, 0, arguments.length);
  return this.query_;
};
goog.exportProperty(fb.api.DataSnapshot.prototype, "ref", fb.api.DataSnapshot.prototype.ref);
goog.provide("fb.core.Repo");
goog.require("fb.api.DataSnapshot");
goog.require("fb.core.PersistentConnection");
goog.require("fb.core.ReadonlyRestClient");
goog.require("fb.core.SnapshotHolder");
goog.require("fb.core.SparseSnapshotTree");
goog.require("fb.core.SyncTree");
goog.require("fb.core.stats.StatsCollection");
goog.require("fb.core.stats.StatsListener");
goog.require("fb.core.stats.StatsManager");
goog.require("fb.core.stats.StatsReporter");
goog.require("fb.core.util");
goog.require("fb.core.util.ServerValues");
goog.require("fb.core.util.Tree");
goog.require("fb.core.view.EventQueue");
goog.require("fb.login.AuthenticationManager");
goog.require("fb.util.json");
goog.require("fb.util.jwt");
goog.require("goog.string");
fb.core.Repo = function(repoInfo, forceRestClient) {
  this.repoInfo_ = repoInfo;
  this.stats_ = fb.core.stats.StatsManager.getCollection(repoInfo);
  this.eventQueue_ = new fb.core.view.EventQueue;
  this.nextWriteId_ = 1;
  this.persistentConnection_ = null;
  this.server_;
  if (forceRestClient || fb.core.util.beingCrawled()) {
    this.server_ = new fb.core.ReadonlyRestClient(this.repoInfo_, goog.bind(this.onDataUpdate_, this));
    setTimeout(goog.bind(this.onConnectStatus_, this, true), 0);
  } else {
    this.persistentConnection_ = new fb.core.PersistentConnection(this.repoInfo_, goog.bind(this.onDataUpdate_, this), goog.bind(this.onConnectStatus_, this), goog.bind(this.onServerInfoUpdate_, this));
    this.server_ = this.persistentConnection_;
  }
  this.statsReporter_ = fb.core.stats.StatsManager.getOrCreateReporter(repoInfo, goog.bind(function() {
    return new fb.core.stats.StatsReporter(this.stats_, this.server_);
  }, this));
  this.transactions_init_();
  this.infoData_ = new fb.core.SnapshotHolder;
  var self = this;
  this.infoSyncTree_ = new fb.core.SyncTree({startListening:function(query, tag, currentHashFn, onComplete) {
    var infoEvents = [];
    var node = self.infoData_.getNode(query.path);
    if (!node.isEmpty()) {
      infoEvents = self.infoSyncTree_.applyServerOverwrite(query.path, node);
      setTimeout(function() {
        onComplete("ok");
      }, 0);
    }
    return infoEvents;
  }, stopListening:goog.nullFunction});
  this.updateInfo_("connected", false);
  this.onDisconnect_ = new fb.core.SparseSnapshotTree;
  this.auth = new fb.login.AuthenticationManager(repoInfo, goog.bind(this.server_.auth, this.server_), goog.bind(this.server_.unauth, this.server_), goog.bind(this.onAuthStatus_, this));
  this.dataUpdateCount = 0;
  this.interceptServerDataCallback_ = null;
  this.serverSyncTree_ = new fb.core.SyncTree({startListening:function(query, tag, currentHashFn, onComplete) {
    self.server_.listen(query, currentHashFn, tag, function(status, data) {
      var events = onComplete(status, data);
      self.eventQueue_.raiseEventsForChangedPath(query.path, events);
    });
    return[];
  }, stopListening:function(query, tag) {
    self.server_.unlisten(query, tag);
  }});
};
fb.core.Repo.prototype.toString = function() {
  return(this.repoInfo_.secure ? "https://" : "http://") + this.repoInfo_.host;
};
fb.core.Repo.prototype.name = function() {
  return this.repoInfo_.namespace;
};
fb.core.Repo.prototype.serverTime = function() {
  var offsetNode = this.infoData_.getNode(new fb.core.util.Path(".info/serverTimeOffset"));
  var offset = (offsetNode.val()) || 0;
  return(new Date).getTime() + offset;
};
fb.core.Repo.prototype.generateServerValues = function() {
  return fb.core.util.ServerValues.generateWithValues({"timestamp":this.serverTime()});
};
fb.core.Repo.prototype.onDataUpdate_ = function(pathString, data, isMerge, tag) {
  this.dataUpdateCount++;
  var path = new fb.core.util.Path(pathString);
  data = this.interceptServerDataCallback_ ? this.interceptServerDataCallback_(pathString, data) : data;
  var events = [];
  if (tag) {
    if (isMerge) {
      var taggedChildren = goog.object.map((data), function(raw) {
        return fb.core.snap.NodeFromJSON(raw);
      });
      events = this.serverSyncTree_.applyTaggedQueryMerge(path, taggedChildren, tag);
    } else {
      var taggedSnap = fb.core.snap.NodeFromJSON(data);
      events = this.serverSyncTree_.applyTaggedQueryOverwrite(path, taggedSnap, tag);
    }
  } else {
    if (isMerge) {
      var changedChildren = goog.object.map((data), function(raw) {
        return fb.core.snap.NodeFromJSON(raw);
      });
      events = this.serverSyncTree_.applyServerMerge(path, changedChildren);
    } else {
      var snap = fb.core.snap.NodeFromJSON(data);
      events = this.serverSyncTree_.applyServerOverwrite(path, snap);
    }
  }
  var affectedPath = path;
  if (events.length > 0) {
    affectedPath = this.rerunTransactions_(path);
  }
  this.eventQueue_.raiseEventsForChangedPath(affectedPath, events);
};
fb.core.Repo.prototype.interceptServerData_ = function(callback) {
  this.interceptServerDataCallback_ = callback;
};
fb.core.Repo.prototype.onConnectStatus_ = function(connectStatus) {
  this.updateInfo_("connected", connectStatus);
  if (connectStatus === false) {
    this.runOnDisconnectEvents_();
  }
};
fb.core.Repo.prototype.onServerInfoUpdate_ = function(updates) {
  var self = this;
  fb.core.util.each(updates, function(value, key) {
    self.updateInfo_(key, value);
  });
};
fb.core.Repo.prototype.onAuthStatus_ = function(authStatus) {
  this.updateInfo_("authenticated", authStatus);
};
fb.core.Repo.prototype.updateInfo_ = function(pathString, value) {
  var path = new fb.core.util.Path("/.info/" + pathString);
  var newNode = fb.core.snap.NodeFromJSON(value);
  this.infoData_.updateSnapshot(path, newNode);
  var events = this.infoSyncTree_.applyServerOverwrite(path, newNode);
  this.eventQueue_.raiseEventsForChangedPath(path, events);
};
fb.core.Repo.prototype.getNextWriteId_ = function() {
  return this.nextWriteId_++;
};
fb.core.Repo.prototype.setWithPriority = function(path, newVal, newPriority, onComplete) {
  this.log_("set", {path:path.toString(), value:newVal, priority:newPriority});
  var serverValues = this.generateServerValues();
  var newNodeUnresolved = fb.core.snap.NodeFromJSON(newVal, newPriority);
  var newNode = fb.core.util.ServerValues.resolveDeferredValueSnapshot(newNodeUnresolved, serverValues);
  var writeId = this.getNextWriteId_();
  var events = this.serverSyncTree_.applyUserOverwrite(path, newNode, writeId, true);
  this.eventQueue_.queueEvents(events);
  var self = this;
  this.server_.put(path.toString(), newNodeUnresolved.val(true), function(status, errorReason) {
    var success = status === "ok";
    if (!success) {
      fb.core.util.warn("set at " + path + " failed: " + status);
    }
    var clearEvents = self.serverSyncTree_.ackUserWrite(writeId, !success);
    self.eventQueue_.raiseEventsForChangedPath(path, clearEvents);
    self.callOnCompleteCallback(onComplete, status, errorReason);
  });
  var affectedPath = this.abortTransactions_(path);
  this.rerunTransactions_(affectedPath);
  this.eventQueue_.raiseEventsForChangedPath(affectedPath, []);
};
fb.core.Repo.prototype.update = function(path, childrenToMerge, onComplete) {
  this.log_("update", {path:path.toString(), value:childrenToMerge});
  var empty = true;
  var serverValues = this.generateServerValues();
  var changedChildren = {};
  goog.object.forEach(childrenToMerge, function(changedValue, changedKey) {
    empty = false;
    var newNodeUnresolved = fb.core.snap.NodeFromJSON(changedValue);
    changedChildren[changedKey] = fb.core.util.ServerValues.resolveDeferredValueSnapshot(newNodeUnresolved, serverValues);
  });
  if (!empty) {
    var writeId = this.getNextWriteId_();
    var events = this.serverSyncTree_.applyUserMerge(path, changedChildren, writeId);
    this.eventQueue_.queueEvents(events);
    var self = this;
    this.server_.merge(path.toString(), childrenToMerge, function(status, errorReason) {
      var success = status === "ok";
      if (!success) {
        fb.core.util.warn("update at " + path + " failed: " + status);
      }
      var clearEvents = self.serverSyncTree_.ackUserWrite(writeId, !success);
      var affectedPath = path;
      if (clearEvents.length > 0) {
        affectedPath = self.rerunTransactions_(path);
      }
      self.eventQueue_.raiseEventsForChangedPath(affectedPath, clearEvents);
      self.callOnCompleteCallback(onComplete, status, errorReason);
    });
    var affectedPath = this.abortTransactions_(path);
    this.rerunTransactions_(affectedPath);
    this.eventQueue_.raiseEventsForChangedPath(path, []);
  } else {
    fb.core.util.log("update() called with empty data.  Don't do anything.");
    this.callOnCompleteCallback(onComplete, "ok");
  }
};
fb.core.Repo.prototype.runOnDisconnectEvents_ = function() {
  this.log_("onDisconnectEvents");
  var self = this;
  var serverValues = this.generateServerValues();
  var resolvedOnDisconnectTree = fb.core.util.ServerValues.resolveDeferredValueTree(this.onDisconnect_, serverValues);
  var events = [];
  resolvedOnDisconnectTree.forEachTree(fb.core.util.Path.Empty, function(path, snap) {
    events = events.concat(self.serverSyncTree_.applyServerOverwrite(path, snap));
    var affectedPath = self.abortTransactions_(path);
    self.rerunTransactions_(affectedPath);
  });
  this.onDisconnect_ = new fb.core.SparseSnapshotTree;
  this.eventQueue_.raiseEventsForChangedPath(fb.core.util.Path.Empty, events);
};
fb.core.Repo.prototype.onDisconnectCancel = function(path, onComplete) {
  var self = this;
  this.server_.onDisconnectCancel(path.toString(), function(status, errorReason) {
    if (status === "ok") {
      self.onDisconnect_.forget(path);
    }
    self.callOnCompleteCallback(onComplete, status, errorReason);
  });
};
fb.core.Repo.prototype.onDisconnectSet = function(path, value, onComplete) {
  var self = this;
  var newNode = fb.core.snap.NodeFromJSON(value);
  this.server_.onDisconnectPut(path.toString(), newNode.val(true), function(status, errorReason) {
    if (status === "ok") {
      self.onDisconnect_.remember(path, newNode);
    }
    self.callOnCompleteCallback(onComplete, status, errorReason);
  });
};
fb.core.Repo.prototype.onDisconnectSetWithPriority = function(path, value, priority, onComplete) {
  var self = this;
  var newNode = fb.core.snap.NodeFromJSON(value, priority);
  this.server_.onDisconnectPut(path.toString(), newNode.val(true), function(status, errorReason) {
    if (status === "ok") {
      self.onDisconnect_.remember(path, newNode);
    }
    self.callOnCompleteCallback(onComplete, status, errorReason);
  });
};
fb.core.Repo.prototype.onDisconnectUpdate = function(path, childrenToMerge, onComplete) {
  var empty = true;
  for (var childName in childrenToMerge) {
    empty = false;
  }
  if (empty) {
    fb.core.util.log("onDisconnect().update() called with empty data.  Don't do anything.");
    this.callOnCompleteCallback(onComplete, "ok");
    return;
  }
  var self = this;
  this.server_.onDisconnectMerge(path.toString(), childrenToMerge, function(status, errorReason) {
    if (status === "ok") {
      for (var childName in childrenToMerge) {
        var newChildNode = fb.core.snap.NodeFromJSON(childrenToMerge[childName]);
        self.onDisconnect_.remember(path.child(childName), newChildNode);
      }
    }
    self.callOnCompleteCallback(onComplete, status, errorReason);
  });
};
fb.core.Repo.prototype.addEventCallbackForQuery = function(query, eventRegistration) {
  var events;
  if (query.path.getFront() === ".info") {
    events = this.infoSyncTree_.addEventRegistration(query, eventRegistration);
  } else {
    events = this.serverSyncTree_.addEventRegistration(query, eventRegistration);
  }
  this.eventQueue_.raiseEventsAtPath(query.path, events);
};
fb.core.Repo.prototype.removeEventCallbackForQuery = function(query, eventRegistration) {
  var events;
  if (query.path.getFront() === ".info") {
    events = this.infoSyncTree_.removeEventRegistration(query, eventRegistration);
  } else {
    events = this.serverSyncTree_.removeEventRegistration(query, eventRegistration);
  }
  this.eventQueue_.raiseEventsAtPath(query.path, events);
};
fb.core.Repo.prototype.interrupt = function() {
  if (this.persistentConnection_) {
    this.persistentConnection_.interrupt();
  }
};
fb.core.Repo.prototype.resume = function() {
  if (this.persistentConnection_) {
    this.persistentConnection_.resume();
  }
};
fb.core.Repo.prototype.stats = function(showDelta) {
  if (typeof console === "undefined") {
    return;
  }
  var stats;
  if (showDelta) {
    if (!this.statsListener_) {
      this.statsListener_ = new fb.core.stats.StatsListener(this.stats_);
    }
    stats = this.statsListener_.get();
  } else {
    stats = this.stats_.get();
  }
  var longestName = goog.array.reduce(goog.object.getKeys(stats), function(previousValue, currentValue, index, array) {
    return Math.max(currentValue.length, previousValue);
  }, 0);
  for (var stat in stats) {
    var value = stats[stat];
    for (var i = stat.length;i < longestName + 2;i++) {
      stat += " ";
    }
    console.log(stat + value);
  }
};
fb.core.Repo.prototype.statsIncrementCounter = function(metric) {
  this.stats_.incrementCounter(metric);
  this.statsReporter_.includeStat(metric);
};
fb.core.Repo.prototype.log_ = function(var_args) {
  var prefix = "";
  if (this.persistentConnection_) {
    prefix = this.persistentConnection_.id + ":";
  }
  fb.core.util.log(prefix, arguments);
};
fb.core.Repo.prototype.callOnCompleteCallback = function(callback, status, errorReason) {
  if (callback) {
    fb.core.util.exceptionGuard(function() {
      if (status == "ok") {
        callback(null);
      } else {
        var code = (status || "error").toUpperCase();
        var message = code;
        if (errorReason) {
          message += ": " + errorReason;
        }
        var error = new Error(message);
        error.code = code;
        callback(error);
      }
    });
  }
};
goog.provide("fb.core.Repo_transaction");
goog.require("fb.core.Repo");
goog.require("fb.core.snap.PriorityIndex");
goog.require("fb.core.util");
fb.core.TransactionStatus = {RUN:1, SENT:2, COMPLETED:3, SENT_NEEDS_ABORT:4, NEEDS_ABORT:5};
fb.core.Repo.MAX_TRANSACTION_RETRIES_ = 25;
fb.core.Transaction;
fb.core.Repo.prototype.transactions_init_ = function() {
  this.transactionQueueTree_ = new fb.core.util.Tree;
};
fb.core.Repo.prototype.startTransaction = function(path, transactionUpdate, onComplete, applyLocally) {
  this.log_("transaction on " + path);
  var valueCallback = function() {
  };
  var watchRef = new Firebase(this, path);
  watchRef.on("value", valueCallback);
  var unwatcher = function() {
    watchRef.off("value", valueCallback);
  };
  var transaction = ({path:path, update:transactionUpdate, onComplete:onComplete, status:null, order:fb.core.util.LUIDGenerator(), applyLocally:applyLocally, retryCount:0, unwatcher:unwatcher, abortReason:null, currentWriteId:null, currentInputSnapshot:null, currentOutputSnapshotRaw:null, currentOutputSnapshotResolved:null});
  var currentState = this.getLatestState_(path);
  transaction.currentInputSnapshot = currentState;
  var newVal = transaction.update(currentState.val());
  if (!goog.isDef(newVal)) {
    transaction.unwatcher();
    transaction.currentOutputSnapshotRaw = null;
    transaction.currentOutputSnapshotResolved = null;
    if (transaction.onComplete) {
      var snapshot = new fb.api.DataSnapshot((transaction.currentInputSnapshot), new Firebase(this, transaction.path), fb.core.snap.PriorityIndex);
      transaction.onComplete(null, false, snapshot);
    }
  } else {
    fb.core.util.validation.validateFirebaseData("transaction failed: Data returned ", newVal, transaction.path);
    transaction.status = fb.core.TransactionStatus.RUN;
    var queueNode = this.transactionQueueTree_.subTree(path);
    var nodeQueue = queueNode.getValue() || [];
    nodeQueue.push(transaction);
    queueNode.setValue(nodeQueue);
    var priorityForNode;
    if (typeof newVal === "object" && newVal !== null && fb.util.obj.contains(newVal, ".priority")) {
      priorityForNode = fb.util.obj.get(newVal, ".priority");
      fb.core.util.assert(fb.core.util.validation.isValidPriority(priorityForNode), "Invalid priority returned by transaction. " + "Priority must be a valid string, finite number, server value, or null.");
    } else {
      var currentNode = this.serverSyncTree_.calcCompleteEventCache(path) || fb.core.snap.EMPTY_NODE;
      priorityForNode = currentNode.getPriority().val();
    }
    priorityForNode = (priorityForNode);
    var serverValues = this.generateServerValues();
    var newNodeUnresolved = fb.core.snap.NodeFromJSON(newVal, priorityForNode);
    var newNode = fb.core.util.ServerValues.resolveDeferredValueSnapshot(newNodeUnresolved, serverValues);
    transaction.currentOutputSnapshotRaw = newNodeUnresolved;
    transaction.currentOutputSnapshotResolved = newNode;
    transaction.currentWriteId = this.getNextWriteId_();
    var events = this.serverSyncTree_.applyUserOverwrite(path, newNode, transaction.currentWriteId, transaction.applyLocally);
    this.eventQueue_.raiseEventsForChangedPath(path, events);
    this.sendReadyTransactions_();
  }
};
fb.core.Repo.prototype.getLatestState_ = function(path, excludeSets) {
  return this.serverSyncTree_.calcCompleteEventCache(path, excludeSets) || fb.core.snap.EMPTY_NODE;
};
fb.core.Repo.prototype.sendReadyTransactions_ = function(opt_node) {
  var node = (opt_node || this.transactionQueueTree_);
  if (!opt_node) {
    this.pruneCompletedTransactionsBelowNode_(node);
  }
  if (node.getValue() !== null) {
    var queue = this.buildTransactionQueue_(node);
    fb.core.util.assert(queue.length > 0, "Sending zero length transaction queue");
    var allRun = goog.array.every(queue, function(transaction) {
      return transaction.status === fb.core.TransactionStatus.RUN;
    });
    if (allRun) {
      this.sendTransactionQueue_(node.path(), queue);
    }
  } else {
    if (node.hasChildren()) {
      var self = this;
      node.forEachChild(function(childNode) {
        self.sendReadyTransactions_(childNode);
      });
    }
  }
};
fb.core.Repo.prototype.sendTransactionQueue_ = function(path, queue) {
  var setsToIgnore = goog.array.map(queue, function(txn) {
    return txn.currentWriteId;
  });
  var latestState = this.getLatestState_(path, setsToIgnore);
  var snapToSend = latestState;
  var latestHash = latestState.hash();
  for (var i = 0;i < queue.length;i++) {
    var txn = queue[i];
    fb.core.util.assert(txn.status === fb.core.TransactionStatus.RUN, "tryToSendTransactionQueue_: items in queue should all be run.");
    txn.status = fb.core.TransactionStatus.SENT;
    txn.retryCount++;
    var relativePath = fb.core.util.Path.relativePath(path, txn.path);
    snapToSend = snapToSend.updateChild(relativePath, (txn.currentOutputSnapshotRaw));
  }
  var dataToSend = snapToSend.val(true);
  var pathToSend = path;
  var self = this;
  this.server_.put(pathToSend.toString(), dataToSend, function(status) {
    self.log_("transaction put response", {path:pathToSend.toString(), status:status});
    var events = [];
    if (status === "ok") {
      var callbacks = [];
      for (i = 0;i < queue.length;i++) {
        queue[i].status = fb.core.TransactionStatus.COMPLETED;
        events = events.concat(self.serverSyncTree_.ackUserWrite(queue[i].currentWriteId));
        if (queue[i].onComplete) {
          var node = (queue[i].currentOutputSnapshotResolved);
          var ref = new Firebase(self, queue[i].path);
          var snapshot = new fb.api.DataSnapshot(node, ref, fb.core.snap.PriorityIndex);
          callbacks.push(goog.bind(queue[i].onComplete, null, null, true, snapshot));
        }
        queue[i].unwatcher();
      }
      self.pruneCompletedTransactionsBelowNode_(self.transactionQueueTree_.subTree(path));
      self.sendReadyTransactions_();
      self.eventQueue_.raiseEventsForChangedPath(path, events);
      for (i = 0;i < callbacks.length;i++) {
        fb.core.util.exceptionGuard(callbacks[i]);
      }
    } else {
      if (status === "datastale") {
        for (i = 0;i < queue.length;i++) {
          if (queue[i].status === fb.core.TransactionStatus.SENT_NEEDS_ABORT) {
            queue[i].status = fb.core.TransactionStatus.NEEDS_ABORT;
          } else {
            queue[i].status = fb.core.TransactionStatus.RUN;
          }
        }
      } else {
        fb.core.util.warn("transaction at " + pathToSend.toString() + " failed: " + status);
        for (i = 0;i < queue.length;i++) {
          queue[i].status = fb.core.TransactionStatus.NEEDS_ABORT;
          queue[i].abortReason = status;
        }
      }
      self.rerunTransactions_(path);
    }
  }, latestHash);
};
fb.core.Repo.prototype.rerunTransactions_ = function(changedPath) {
  var rootMostTransactionNode = this.getAncestorTransactionNode_(changedPath);
  var path = rootMostTransactionNode.path();
  var queue = this.buildTransactionQueue_(rootMostTransactionNode);
  this.rerunTransactionQueue_(queue, path);
  return path;
};
fb.core.Repo.prototype.rerunTransactionQueue_ = function(queue, path) {
  if (queue.length === 0) {
    return;
  }
  var callbacks = [];
  var events = [];
  var setsToIgnore = goog.array.map(queue, function(q) {
    return q.currentWriteId;
  });
  for (var i = 0;i < queue.length;i++) {
    var transaction = queue[i];
    var relativePath = fb.core.util.Path.relativePath(path, transaction.path);
    var abortTransaction = false, abortReason;
    fb.core.util.assert(relativePath !== null, "rerunTransactionsUnderNode_: relativePath should not be null.");
    if (transaction.status === fb.core.TransactionStatus.NEEDS_ABORT) {
      abortTransaction = true;
      abortReason = transaction.abortReason;
      events = events.concat(this.serverSyncTree_.ackUserWrite(transaction.currentWriteId, true));
    } else {
      if (transaction.status === fb.core.TransactionStatus.RUN) {
        if (transaction.retryCount >= fb.core.Repo.MAX_TRANSACTION_RETRIES_) {
          abortTransaction = true;
          abortReason = "maxretry";
          events = events.concat(this.serverSyncTree_.ackUserWrite(transaction.currentWriteId, true));
        } else {
          var currentNode = this.getLatestState_(transaction.path, setsToIgnore);
          transaction.currentInputSnapshot = currentNode;
          var newData = queue[i].update(currentNode.val());
          if (goog.isDef(newData)) {
            fb.core.util.validation.validateFirebaseData("transaction failed: Data returned ", newData, transaction.path);
            var newDataNode = fb.core.snap.NodeFromJSON(newData);
            var hasExplicitPriority = typeof newData === "object" && newData != null && fb.util.obj.contains(newData, ".priority");
            if (!hasExplicitPriority) {
              newDataNode = newDataNode.updatePriority(currentNode.getPriority());
            }
            var oldWriteId = transaction.currentWriteId;
            var serverValues = this.generateServerValues();
            var newNodeResolved = fb.core.util.ServerValues.resolveDeferredValueSnapshot(newDataNode, serverValues);
            transaction.currentOutputSnapshotRaw = newDataNode;
            transaction.currentOutputSnapshotResolved = newNodeResolved;
            transaction.currentWriteId = this.getNextWriteId_();
            goog.array.remove(setsToIgnore, oldWriteId);
            events = events.concat(this.serverSyncTree_.applyUserOverwrite(transaction.path, newNodeResolved, transaction.currentWriteId, transaction.applyLocally));
            events = events.concat(this.serverSyncTree_.ackUserWrite(oldWriteId, true));
          } else {
            abortTransaction = true;
            abortReason = "nodata";
            events = events.concat(this.serverSyncTree_.ackUserWrite(transaction.currentWriteId, true));
          }
        }
      }
    }
    this.eventQueue_.raiseEventsForChangedPath(path, events);
    events = [];
    if (abortTransaction) {
      queue[i].status = fb.core.TransactionStatus.COMPLETED;
      (function(unwatcher) {
        setTimeout(unwatcher, Math.floor(0));
      })(queue[i].unwatcher);
      if (queue[i].onComplete) {
        if (abortReason === "nodata") {
          var ref = new Firebase(this, queue[i].path);
          var lastInput = (queue[i].currentInputSnapshot);
          var snapshot = new fb.api.DataSnapshot(lastInput, ref, fb.core.snap.PriorityIndex);
          callbacks.push(goog.bind(queue[i].onComplete, null, null, false, snapshot));
        } else {
          callbacks.push(goog.bind(queue[i].onComplete, null, new Error(abortReason), false, null));
        }
      }
    }
  }
  this.pruneCompletedTransactionsBelowNode_(this.transactionQueueTree_);
  for (i = 0;i < callbacks.length;i++) {
    fb.core.util.exceptionGuard(callbacks[i]);
  }
  this.sendReadyTransactions_();
};
fb.core.Repo.prototype.getAncestorTransactionNode_ = function(path) {
  var front;
  var transactionNode = this.transactionQueueTree_;
  while ((front = path.getFront()) !== null && transactionNode.getValue() === null) {
    transactionNode = transactionNode.subTree(front);
    path = path.popFront();
  }
  return transactionNode;
};
fb.core.Repo.prototype.buildTransactionQueue_ = function(transactionNode) {
  var transactionQueue = [];
  this.aggregateTransactionQueuesForNode_(transactionNode, transactionQueue);
  transactionQueue.sort(function(a, b) {
    return a.order - b.order;
  });
  return transactionQueue;
};
fb.core.Repo.prototype.aggregateTransactionQueuesForNode_ = function(node, queue) {
  var nodeQueue = node.getValue();
  if (nodeQueue !== null) {
    for (var i = 0;i < nodeQueue.length;i++) {
      queue.push(nodeQueue[i]);
    }
  }
  var self = this;
  node.forEachChild(function(child) {
    self.aggregateTransactionQueuesForNode_(child, queue);
  });
};
fb.core.Repo.prototype.pruneCompletedTransactionsBelowNode_ = function(node) {
  var queue = node.getValue();
  if (queue) {
    var to = 0;
    for (var from = 0;from < queue.length;from++) {
      if (queue[from].status !== fb.core.TransactionStatus.COMPLETED) {
        queue[to] = queue[from];
        to++;
      }
    }
    queue.length = to;
    node.setValue(queue.length > 0 ? queue : null);
  }
  var self = this;
  node.forEachChild(function(childNode) {
    self.pruneCompletedTransactionsBelowNode_(childNode);
  });
};
fb.core.Repo.prototype.abortTransactions_ = function(path) {
  var affectedPath = this.getAncestorTransactionNode_(path).path();
  var transactionNode = this.transactionQueueTree_.subTree(path);
  var self = this;
  transactionNode.forEachAncestor(function(node) {
    self.abortTransactionsOnNode_(node);
  });
  this.abortTransactionsOnNode_(transactionNode);
  transactionNode.forEachDescendant(function(node) {
    self.abortTransactionsOnNode_(node);
  });
  return affectedPath;
};
fb.core.Repo.prototype.abortTransactionsOnNode_ = function(node) {
  var queue = node.getValue();
  if (queue !== null) {
    var callbacks = [];
    var events = [];
    var lastSent = -1;
    for (var i = 0;i < queue.length;i++) {
      if (queue[i].status === fb.core.TransactionStatus.SENT_NEEDS_ABORT) {
      } else {
        if (queue[i].status === fb.core.TransactionStatus.SENT) {
          fb.core.util.assert(lastSent === i - 1, "All SENT items should be at beginning of queue.");
          lastSent = i;
          queue[i].status = fb.core.TransactionStatus.SENT_NEEDS_ABORT;
          queue[i].abortReason = "set";
        } else {
          fb.core.util.assert(queue[i].status === fb.core.TransactionStatus.RUN, "Unexpected transaction status in abort");
          queue[i].unwatcher();
          events = events.concat(this.serverSyncTree_.ackUserWrite(queue[i].currentWriteId, true));
          if (queue[i].onComplete) {
            var snapshot = null;
            callbacks.push(goog.bind(queue[i].onComplete, null, new Error("set"), false, snapshot));
          }
        }
      }
    }
    if (lastSent === -1) {
      node.setValue(null);
    } else {
      queue.length = lastSent + 1;
    }
    this.eventQueue_.raiseEventsForChangedPath(node.path(), events);
    for (i = 0;i < callbacks.length;i++) {
      fb.core.util.exceptionGuard(callbacks[i]);
    }
  }
};
goog.provide("fb.core.RepoManager");
goog.require("fb.core.Repo");
goog.require("fb.core.Repo_transaction");
goog.require("fb.util.obj");
fb.core.RepoManager = function() {
  this.repos_ = {};
  this.useRestClient_ = false;
};
goog.addSingletonGetter(fb.core.RepoManager);
fb.core.RepoManager.prototype.interrupt = function() {
  for (var repo in this.repos_) {
    this.repos_[repo].interrupt();
  }
};
goog.exportProperty(fb.core.RepoManager.prototype, "interrupt", fb.core.RepoManager.prototype.interrupt);
fb.core.RepoManager.prototype.resume = function() {
  for (var repo in this.repos_) {
    this.repos_[repo].resume();
  }
};
goog.exportProperty(fb.core.RepoManager.prototype, "resume", fb.core.RepoManager.prototype.resume);
fb.core.RepoManager.prototype.getRepo = function(repoInfo) {
  var repoHashString = repoInfo.toString();
  var repo = fb.util.obj.get(this.repos_, repoHashString);
  if (!repo) {
    repo = new fb.core.Repo(repoInfo, this.useRestClient_);
    this.repos_[repoHashString] = repo;
  }
  return repo;
};
fb.core.RepoManager.prototype.forceRestClient = function() {
  this.useRestClient_ = true;
};
goog.provide("fb.api.OnDisconnect");
goog.require("fb.constants");
goog.require("fb.core.Repo");
goog.require("fb.core.util.validation");
goog.require("fb.util.validation");
fb.api.OnDisconnect = function(repo, path) {
  this.repo_ = repo;
  this.path_ = path;
};
fb.api.OnDisconnect.prototype.cancel = function(opt_onComplete) {
  fb.util.validation.validateArgCount("Firebase.onDisconnect().cancel", 0, 1, arguments.length);
  fb.util.validation.validateCallback("Firebase.onDisconnect().cancel", 1, opt_onComplete, true);
  this.repo_.onDisconnectCancel(this.path_, opt_onComplete || null);
};
goog.exportProperty(fb.api.OnDisconnect.prototype, "cancel", fb.api.OnDisconnect.prototype.cancel);
fb.api.OnDisconnect.prototype.remove = function(opt_onComplete) {
  fb.util.validation.validateArgCount("Firebase.onDisconnect().remove", 0, 1, arguments.length);
  fb.core.util.validation.validateWritablePath("Firebase.onDisconnect().remove", this.path_);
  fb.util.validation.validateCallback("Firebase.onDisconnect().remove", 1, opt_onComplete, true);
  this.repo_.onDisconnectSet(this.path_, null, opt_onComplete);
};
goog.exportProperty(fb.api.OnDisconnect.prototype, "remove", fb.api.OnDisconnect.prototype.remove);
fb.api.OnDisconnect.prototype.set = function(value, opt_onComplete) {
  fb.util.validation.validateArgCount("Firebase.onDisconnect().set", 1, 2, arguments.length);
  fb.core.util.validation.validateWritablePath("Firebase.onDisconnect().set", this.path_);
  fb.core.util.validation.validateFirebaseDataArg("Firebase.onDisconnect().set", 1, value, this.path_, false);
  fb.util.validation.validateCallback("Firebase.onDisconnect().set", 2, opt_onComplete, true);
  this.repo_.onDisconnectSet(this.path_, value, opt_onComplete);
};
goog.exportProperty(fb.api.OnDisconnect.prototype, "set", fb.api.OnDisconnect.prototype.set);
fb.api.OnDisconnect.prototype.setWithPriority = function(value, priority, opt_onComplete) {
  fb.util.validation.validateArgCount("Firebase.onDisconnect().setWithPriority", 2, 3, arguments.length);
  fb.core.util.validation.validateWritablePath("Firebase.onDisconnect().setWithPriority", this.path_);
  fb.core.util.validation.validateFirebaseDataArg("Firebase.onDisconnect().setWithPriority", 1, value, this.path_, false);
  fb.core.util.validation.validatePriority("Firebase.onDisconnect().setWithPriority", 2, priority, false);
  fb.util.validation.validateCallback("Firebase.onDisconnect().setWithPriority", 3, opt_onComplete, true);
  this.repo_.onDisconnectSetWithPriority(this.path_, value, priority, opt_onComplete);
};
goog.exportProperty(fb.api.OnDisconnect.prototype, "setWithPriority", fb.api.OnDisconnect.prototype.setWithPriority);
fb.api.OnDisconnect.prototype.update = function(objectToMerge, opt_onComplete) {
  fb.util.validation.validateArgCount("Firebase.onDisconnect().update", 1, 2, arguments.length);
  fb.core.util.validation.validateWritablePath("Firebase.onDisconnect().update", this.path_);
  if (goog.isArray(objectToMerge)) {
    var newObjectToMerge = {};
    for (var i = 0;i < objectToMerge.length;++i) {
      newObjectToMerge["" + i] = objectToMerge[i];
    }
    objectToMerge = newObjectToMerge;
    fb.core.util.warn("Passing an Array to Firebase.onDisconnect().update() is deprecated. Use set() if you want to overwrite the " + "existing data, or an Object with integer keys if you really do want to only update some of the children.");
  }
  fb.core.util.validation.validateFirebaseMergeDataArg("Firebase.onDisconnect().update", 1, objectToMerge, this.path_, false);
  fb.util.validation.validateCallback("Firebase.onDisconnect().update", 2, opt_onComplete, true);
  this.repo_.onDisconnectUpdate(this.path_, objectToMerge, opt_onComplete);
};
goog.exportProperty(fb.api.OnDisconnect.prototype, "update", fb.api.OnDisconnect.prototype.update);
goog.provide("fb.api.Query");
goog.require("fb.api.DataSnapshot");
goog.require("fb.core.snap");
goog.require("fb.core.util");
goog.require("fb.core.util.validation");
goog.require("fb.core.view.EventRegistration");
goog.require("fb.core.view.QueryParams");
goog.require("fb.util.json");
goog.require("fb.util.validation");
fb.api.Query = function(repo, path, queryParams, orderByCalled) {
  this.repo = repo;
  this.path = path;
  this.queryParams_ = queryParams;
  this.orderByCalled_ = orderByCalled;
};
fb.api.Query.prototype.validateQueryEndpoints_ = function(params) {
  var startNode = null;
  var endNode = null;
  if (params.hasStart()) {
    startNode = params.getIndexStartValue();
  }
  if (params.hasEnd()) {
    endNode = params.getIndexEndValue();
  }
  if (params.getIndex() === fb.core.snap.KeyIndex) {
    var tooManyArgsError = "Query: When ordering by key, you may only pass one argument to " + "startAt(), endAt(), or equalTo().";
    var wrongArgTypeError = "Query: When ordering by key, the argument passed to startAt(), endAt()," + "or equalTo() must be a string.";
    if (params.hasStart()) {
      var startName = params.getIndexStartName();
      if (startName != fb.core.util.MIN_NAME) {
        throw new Error(tooManyArgsError);
      } else {
        if (typeof startNode !== "string") {
          throw new Error(wrongArgTypeError);
        }
      }
    }
    if (params.hasEnd()) {
      var endName = params.getIndexEndName();
      if (endName != fb.core.util.MAX_NAME) {
        throw new Error(tooManyArgsError);
      } else {
        if (typeof endNode !== "string") {
          throw new Error(wrongArgTypeError);
        }
      }
    }
  } else {
    if (params.getIndex() === fb.core.snap.PriorityIndex) {
      if (startNode != null && !fb.core.util.validation.isValidPriority(startNode) || endNode != null && !fb.core.util.validation.isValidPriority(endNode)) {
        throw new Error("Query: When ordering by priority, the first argument passed to startAt(), " + "endAt(), or equalTo() must be a valid priority value (null, a number, or a string).");
      }
    } else {
      fb.core.util.assert(params.getIndex() instanceof fb.core.snap.SubKeyIndex || params.getIndex() === fb.core.snap.ValueIndex, "unknown index type.");
      if (startNode != null && typeof startNode === "object" || endNode != null && typeof endNode === "object") {
        throw new Error("Query: First argument passed to startAt(), endAt(), or equalTo() cannot be " + "an object.");
      }
    }
  }
};
fb.api.Query.prototype.validateLimit_ = function(params) {
  if (params.hasStart() && params.hasEnd() && params.hasLimit() && !params.hasAnchoredLimit()) {
    throw new Error("Query: Can't combine startAt(), endAt(), and limit(). Use limitToFirst() or limitToLast() instead.");
  }
};
fb.api.Query.prototype.validateNoPreviousOrderByCall_ = function(fnName) {
  if (this.orderByCalled_ === true) {
    throw new Error(fnName + ": You can't combine multiple orderBy calls.");
  }
};
fb.api.Query.prototype.getQueryParams = function() {
  return this.queryParams_;
};
fb.api.Query.prototype.ref = function() {
  fb.util.validation.validateArgCount("Query.ref", 0, 0, arguments.length);
  return new Firebase(this.repo, this.path);
};
goog.exportProperty(fb.api.Query.prototype, "ref", fb.api.Query.prototype.ref);
fb.api.Query.prototype.on = function(eventType, callback, cancelCallbackOrContext, context) {
  fb.util.validation.validateArgCount("Query.on", 2, 4, arguments.length);
  fb.core.util.validation.validateEventType("Query.on", 1, eventType, false);
  fb.util.validation.validateCallback("Query.on", 2, callback, false);
  var ret = this.getCancelAndContextArgs_("Query.on", cancelCallbackOrContext, context);
  if (eventType === "value") {
    this.onValueEvent(callback, ret.cancel, ret.context);
  } else {
    var callbacks = {};
    callbacks[eventType] = callback;
    this.onChildEvent(callbacks, ret.cancel, ret.context);
  }
  return callback;
};
goog.exportProperty(fb.api.Query.prototype, "on", fb.api.Query.prototype.on);
fb.api.Query.prototype.onValueEvent = function(callback, cancelCallback, context) {
  var container = new fb.core.view.ValueEventRegistration(callback, cancelCallback || null, context || null);
  this.repo.addEventCallbackForQuery(this, container);
};
fb.api.Query.prototype.onChildEvent = function(callbacks, cancelCallback, context) {
  var container = new fb.core.view.ChildEventRegistration(callbacks, cancelCallback, context);
  this.repo.addEventCallbackForQuery(this, container);
};
fb.api.Query.prototype.off = function(eventType, callback, opt_context) {
  fb.util.validation.validateArgCount("Query.off", 0, 3, arguments.length);
  fb.core.util.validation.validateEventType("Query.off", 1, eventType, true);
  fb.util.validation.validateCallback("Query.off", 2, callback, true);
  fb.util.validation.validateContextObject("Query.off", 3, opt_context, true);
  var container = null;
  var callbacks = null;
  if (eventType === "value") {
    var valueCallback = (callback) || null;
    container = new fb.core.view.ValueEventRegistration(valueCallback, null, opt_context || null);
  } else {
    if (eventType) {
      if (callback) {
        callbacks = {};
        callbacks[eventType] = callback;
      }
      container = new fb.core.view.ChildEventRegistration(callbacks, null, opt_context || null);
    }
  }
  this.repo.removeEventCallbackForQuery(this, container);
};
goog.exportProperty(fb.api.Query.prototype, "off", fb.api.Query.prototype.off);
fb.api.Query.prototype.once = function(eventType, userCallback) {
  fb.util.validation.validateArgCount("Query.once", 2, 4, arguments.length);
  fb.core.util.validation.validateEventType("Query.once", 1, eventType, false);
  fb.util.validation.validateCallback("Query.once", 2, userCallback, false);
  var ret = this.getCancelAndContextArgs_("Query.once", arguments[2], arguments[3]);
  var self = this, firstCall = true;
  var onceCallback = function(snapshot) {
    if (firstCall) {
      firstCall = false;
      self.off(eventType, onceCallback);
      goog.bind(userCallback, ret.context)(snapshot);
    }
  };
  this.on(eventType, onceCallback, function(err) {
    self.off(eventType, onceCallback);
    if (ret.cancel) {
      goog.bind(ret.cancel, ret.context)(err);
    }
  });
};
goog.exportProperty(fb.api.Query.prototype, "once", fb.api.Query.prototype.once);
fb.api.Query.prototype.limit = function(limit) {
  fb.core.util.warn("Query.limit() being deprecated. " + "Please use Query.limitToFirst() or Query.limitToLast() instead.");
  fb.util.validation.validateArgCount("Query.limit", 1, 1, arguments.length);
  if (!goog.isNumber(limit) || Math.floor(limit) !== limit || limit <= 0) {
    throw new Error("Query.limit: First argument must be a positive integer.");
  }
  if (this.queryParams_.hasLimit()) {
    throw new Error("Query.limit: Limit was already set (by another call to limit, limitToFirst, or" + "limitToLast.");
  }
  var newParams = this.queryParams_.limit(limit);
  this.validateLimit_(newParams);
  return new fb.api.Query(this.repo, this.path, newParams, this.orderByCalled_);
};
goog.exportProperty(fb.api.Query.prototype, "limit", fb.api.Query.prototype.limit);
fb.api.Query.prototype.limitToFirst = function(limit) {
  fb.util.validation.validateArgCount("Query.limitToFirst", 1, 1, arguments.length);
  if (!goog.isNumber(limit) || Math.floor(limit) !== limit || limit <= 0) {
    throw new Error("Query.limitToFirst: First argument must be a positive integer.");
  }
  if (this.queryParams_.hasLimit()) {
    throw new Error("Query.limitToFirst: Limit was already set (by another call to limit, " + "limitToFirst, or limitToLast).");
  }
  return new fb.api.Query(this.repo, this.path, this.queryParams_.limitToFirst(limit), this.orderByCalled_);
};
goog.exportProperty(fb.api.Query.prototype, "limitToFirst", fb.api.Query.prototype.limitToFirst);
fb.api.Query.prototype.limitToLast = function(limit) {
  fb.util.validation.validateArgCount("Query.limitToLast", 1, 1, arguments.length);
  if (!goog.isNumber(limit) || Math.floor(limit) !== limit || limit <= 0) {
    throw new Error("Query.limitToLast: First argument must be a positive integer.");
  }
  if (this.queryParams_.hasLimit()) {
    throw new Error("Query.limitToLast: Limit was already set (by another call to limit, " + "limitToFirst, or limitToLast).");
  }
  return new fb.api.Query(this.repo, this.path, this.queryParams_.limitToLast(limit), this.orderByCalled_);
};
goog.exportProperty(fb.api.Query.prototype, "limitToLast", fb.api.Query.prototype.limitToLast);
fb.api.Query.prototype.orderByChild = function(key) {
  fb.util.validation.validateArgCount("Query.orderByChild", 1, 1, arguments.length);
  if (key === "$key") {
    throw new Error('Query.orderByChild: "$key" is invalid.  Use Query.orderByKey() instead.');
  } else {
    if (key === "$priority") {
      throw new Error('Query.orderByChild: "$priority" is invalid.  Use Query.orderByPriority() instead.');
    } else {
      if (key === "$value") {
        throw new Error('Query.orderByChild: "$value" is invalid.  Use Query.orderByValue() instead.');
      }
    }
  }
  fb.core.util.validation.validateKey("Query.orderByChild", 1, key, false);
  this.validateNoPreviousOrderByCall_("Query.orderByChild");
  var index = new fb.core.snap.SubKeyIndex(key);
  var newParams = this.queryParams_.orderBy(index);
  this.validateQueryEndpoints_(newParams);
  return new fb.api.Query(this.repo, this.path, newParams, true);
};
goog.exportProperty(fb.api.Query.prototype, "orderByChild", fb.api.Query.prototype.orderByChild);
fb.api.Query.prototype.orderByKey = function() {
  fb.util.validation.validateArgCount("Query.orderByKey", 0, 0, arguments.length);
  this.validateNoPreviousOrderByCall_("Query.orderByKey");
  var newParams = this.queryParams_.orderBy(fb.core.snap.KeyIndex);
  this.validateQueryEndpoints_(newParams);
  return new fb.api.Query(this.repo, this.path, newParams, true);
};
goog.exportProperty(fb.api.Query.prototype, "orderByKey", fb.api.Query.prototype.orderByKey);
fb.api.Query.prototype.orderByPriority = function() {
  fb.util.validation.validateArgCount("Query.orderByPriority", 0, 0, arguments.length);
  this.validateNoPreviousOrderByCall_("Query.orderByPriority");
  var newParams = this.queryParams_.orderBy(fb.core.snap.PriorityIndex);
  this.validateQueryEndpoints_(newParams);
  return new fb.api.Query(this.repo, this.path, newParams, true);
};
goog.exportProperty(fb.api.Query.prototype, "orderByPriority", fb.api.Query.prototype.orderByPriority);
fb.api.Query.prototype.orderByValue = function() {
  fb.util.validation.validateArgCount("Query.orderByValue", 0, 0, arguments.length);
  this.validateNoPreviousOrderByCall_("Query.orderByValue");
  var newParams = this.queryParams_.orderBy(fb.core.snap.ValueIndex);
  this.validateQueryEndpoints_(newParams);
  return new fb.api.Query(this.repo, this.path, newParams, true);
};
goog.exportProperty(fb.api.Query.prototype, "orderByValue", fb.api.Query.prototype.orderByValue);
fb.api.Query.prototype.startAt = function(value, name) {
  fb.util.validation.validateArgCount("Query.startAt", 0, 2, arguments.length);
  fb.core.util.validation.validateFirebaseDataArg("Query.startAt", 1, value, this.path, true);
  fb.core.util.validation.validateKey("Query.startAt", 2, name, true);
  var newParams = this.queryParams_.startAt(value, name);
  this.validateLimit_(newParams);
  this.validateQueryEndpoints_(newParams);
  if (this.queryParams_.hasStart()) {
    throw new Error("Query.startAt: Starting point was already set (by another call to startAt " + "or equalTo).");
  }
  if (!goog.isDef(value)) {
    value = null;
    name = null;
  }
  return new fb.api.Query(this.repo, this.path, newParams, this.orderByCalled_);
};
goog.exportProperty(fb.api.Query.prototype, "startAt", fb.api.Query.prototype.startAt);
fb.api.Query.prototype.endAt = function(value, name) {
  fb.util.validation.validateArgCount("Query.endAt", 0, 2, arguments.length);
  fb.core.util.validation.validateFirebaseDataArg("Query.endAt", 1, value, this.path, true);
  fb.core.util.validation.validateKey("Query.endAt", 2, name, true);
  var newParams = this.queryParams_.endAt(value, name);
  this.validateLimit_(newParams);
  this.validateQueryEndpoints_(newParams);
  if (this.queryParams_.hasEnd()) {
    throw new Error("Query.endAt: Ending point was already set (by another call to endAt or " + "equalTo).");
  }
  return new fb.api.Query(this.repo, this.path, newParams, this.orderByCalled_);
};
goog.exportProperty(fb.api.Query.prototype, "endAt", fb.api.Query.prototype.endAt);
fb.api.Query.prototype.equalTo = function(value, name) {
  fb.util.validation.validateArgCount("Query.equalTo", 1, 2, arguments.length);
  fb.core.util.validation.validateFirebaseDataArg("Query.equalTo", 1, value, this.path, false);
  fb.core.util.validation.validateKey("Query.equalTo", 2, name, true);
  if (this.queryParams_.hasStart()) {
    throw new Error("Query.equalTo: Starting point was already set (by another call to endAt or " + "equalTo).");
  }
  if (this.queryParams_.hasEnd()) {
    throw new Error("Query.equalTo: Ending point was already set (by another call to endAt or " + "equalTo).");
  }
  return this.startAt(value, name).endAt(value, name);
};
goog.exportProperty(fb.api.Query.prototype, "equalTo", fb.api.Query.prototype.equalTo);
fb.api.Query.prototype.toString = function() {
  fb.util.validation.validateArgCount("Query.toString", 0, 0, arguments.length);
  var url = this.repo.toString() + this.path.toUrlEncodedString();
  var querystring = fb.util.querystring(this.queryParams_.toRestQueryStringParameters());
  url += querystring.replace(/^&/, "");
  return url;
};
goog.exportProperty(fb.api.Query.prototype, "toString", fb.api.Query.prototype.toString);
fb.api.Query.prototype.queryObject = function() {
  return this.queryParams_.getQueryObject();
};
fb.api.Query.prototype.queryIdentifier = function() {
  var obj = this.queryObject();
  var id = fb.core.util.ObjectToUniqueKey(obj);
  return id === "{}" ? "default" : id;
};
fb.api.Query.prototype.getCancelAndContextArgs_ = function(fnName, cancelOrContext, context) {
  var ret = {cancel:null, context:null};
  if (cancelOrContext && context) {
    ret.cancel = (cancelOrContext);
    fb.util.validation.validateCallback(fnName, 3, ret.cancel, true);
    ret.context = context;
    fb.util.validation.validateContextObject(fnName, 4, ret.context, true);
  } else {
    if (cancelOrContext) {
      if (typeof cancelOrContext === "object" && cancelOrContext !== null) {
        ret.context = cancelOrContext;
      } else {
        if (typeof cancelOrContext === "function") {
          ret.cancel = cancelOrContext;
        } else {
          throw new Error(fb.util.validation.errorPrefix(fnName, 3, true) + " must either be a cancel callback or a context object.");
        }
      }
    }
  }
  return ret;
};
goog.provide("fb.api.TEST_ACCESS");
goog.require("fb.core.PersistentConnection");
fb.api.TEST_ACCESS.DataConnection = fb.core.PersistentConnection;
goog.exportProperty(fb.api.TEST_ACCESS, "DataConnection", fb.api.TEST_ACCESS.DataConnection);
fb.core.PersistentConnection.prototype.simpleListen = function(pathString, onComplete) {
  this.sendRequest("q", {"p":pathString}, onComplete);
};
goog.exportProperty(fb.api.TEST_ACCESS.DataConnection.prototype, "simpleListen", fb.api.TEST_ACCESS.DataConnection.prototype.simpleListen);
fb.core.PersistentConnection.prototype.echo = function(data, onEcho) {
  this.sendRequest("echo", {"d":data}, onEcho);
};
goog.exportProperty(fb.api.TEST_ACCESS.DataConnection.prototype, "echo", fb.api.TEST_ACCESS.DataConnection.prototype.echo);
goog.exportProperty(fb.core.PersistentConnection.prototype, "interrupt", fb.core.PersistentConnection.prototype.interrupt);
fb.api.TEST_ACCESS.RealTimeConnection = fb.realtime.Connection;
goog.exportProperty(fb.api.TEST_ACCESS, "RealTimeConnection", fb.api.TEST_ACCESS.RealTimeConnection);
goog.exportProperty(fb.realtime.Connection.prototype, "sendRequest", fb.realtime.Connection.prototype.sendRequest);
goog.exportProperty(fb.realtime.Connection.prototype, "close", fb.realtime.Connection.prototype.close);
fb.api.TEST_ACCESS.hijackHash = function(newHash) {
  var oldPut = fb.core.PersistentConnection.prototype.put;
  fb.core.PersistentConnection.prototype.put = function(pathString, data, opt_onComplete, opt_hash) {
    if (goog.isDef(opt_hash)) {
      opt_hash = newHash();
    }
    oldPut.call(this, pathString, data, opt_onComplete, opt_hash);
  };
  return function() {
    fb.core.PersistentConnection.prototype.put = oldPut;
  };
};
goog.exportProperty(fb.api.TEST_ACCESS, "hijackHash", fb.api.TEST_ACCESS.hijackHash);
fb.api.TEST_ACCESS.ConnectionTarget = fb.core.RepoInfo;
goog.exportProperty(fb.api.TEST_ACCESS, "ConnectionTarget", fb.api.TEST_ACCESS.ConnectionTarget);
fb.api.TEST_ACCESS.queryIdentifier = function(query) {
  return query.queryIdentifier();
};
goog.exportProperty(fb.api.TEST_ACCESS, "queryIdentifier", fb.api.TEST_ACCESS.queryIdentifier);
fb.api.TEST_ACCESS.listens = function(firebaseRef) {
  return firebaseRef.repo.persistentConnection_.listens_;
};
goog.exportProperty(fb.api.TEST_ACCESS, "listens", fb.api.TEST_ACCESS.listens);
fb.api.TEST_ACCESS.forceRestClient = function(repoManager) {
  repoManager.forceRestClient();
};
goog.exportProperty(fb.api.TEST_ACCESS, "forceRestClient", fb.api.TEST_ACCESS.forceRestClient);
goog.provide("Firebase");
goog.require("fb.api.INTERNAL");
goog.require("fb.api.OnDisconnect");
goog.require("fb.api.Query");
goog.require("fb.api.TEST_ACCESS");
goog.require("fb.constants");
goog.require("fb.core.Repo");
goog.require("fb.core.RepoManager");
goog.require("fb.core.storage");
goog.require("fb.core.util");
goog.require("fb.core.util.nextPushId");
goog.require("fb.core.util.validation");
goog.require("goog.string");
Firebase = function(urlOrRepo, pathOrContext) {
  var repo, path, repoManager;
  if (urlOrRepo instanceof fb.core.Repo) {
    repo = urlOrRepo;
    path = (pathOrContext);
  } else {
    fb.util.validation.validateArgCount("new Firebase", 1, 2, arguments.length);
    var parsedUrl = fb.core.util.parseRepoInfo(arguments[0]), repoInfo = parsedUrl.repoInfo;
    fb.core.util.validation.validateUrl("new Firebase", 1, parsedUrl);
    if (pathOrContext) {
      if (pathOrContext instanceof fb.core.RepoManager) {
        repoManager = (pathOrContext);
      } else {
        if (goog.isString(pathOrContext)) {
          repoManager = fb.core.RepoManager.getInstance();
          repoInfo.persistenceKey = pathOrContext;
        } else {
          throw new Error("Expected a valid Firebase.Context for second argument to new Firebase()");
        }
      }
    } else {
      repoManager = fb.core.RepoManager.getInstance();
    }
    repo = repoManager.getRepo(repoInfo);
    path = parsedUrl.path;
  }
  fb.api.Query.call(this, repo, path, fb.core.view.QueryParams.DEFAULT, false);
};
goog.inherits(Firebase, fb.api.Query);
if (NODE_CLIENT) {
  module["exports"] = Firebase;
}
Firebase.prototype.name = function() {
  fb.core.util.warn("Firebase.name() being deprecated. Please use Firebase.key() instead.");
  fb.util.validation.validateArgCount("Firebase.name", 0, 0, arguments.length);
  return this.key();
};
Firebase.prototype.key = function() {
  fb.util.validation.validateArgCount("Firebase.key", 0, 0, arguments.length);
  if (this.path.isEmpty()) {
    return null;
  } else {
    return this.path.getBack();
  }
};
Firebase.prototype.child = function(pathString) {
  fb.util.validation.validateArgCount("Firebase.child", 1, 1, arguments.length);
  if (goog.isNumber(pathString)) {
    pathString = String(pathString);
  } else {
    if (!(pathString instanceof fb.core.util.Path)) {
      if (this.path.getFront() === null) {
        fb.core.util.validation.validateRootPathString("Firebase.child", 1, pathString, false);
      } else {
        fb.core.util.validation.validatePathString("Firebase.child", 1, pathString, false);
      }
    }
  }
  return new Firebase(this.repo, this.path.child(pathString));
};
Firebase.prototype.parent = function() {
  fb.util.validation.validateArgCount("Firebase.parent", 0, 0, arguments.length);
  var parentPath = this.path.parent();
  return parentPath === null ? null : new Firebase(this.repo, parentPath);
};
Firebase.prototype.root = function() {
  fb.util.validation.validateArgCount("Firebase.ref", 0, 0, arguments.length);
  var ref = this;
  while (ref.parent() !== null) {
    ref = ref.parent();
  }
  return ref;
};
Firebase.prototype.set = function(newVal, onComplete) {
  fb.util.validation.validateArgCount("Firebase.set", 1, 2, arguments.length);
  fb.core.util.validation.validateWritablePath("Firebase.set", this.path);
  fb.core.util.validation.validateFirebaseDataArg("Firebase.set", 1, newVal, this.path, false);
  fb.util.validation.validateCallback("Firebase.set", 2, onComplete, true);
  this.repo.setWithPriority(this.path, newVal, null, onComplete || null);
};
Firebase.prototype.update = function(objectToMerge, onComplete) {
  fb.util.validation.validateArgCount("Firebase.update", 1, 2, arguments.length);
  fb.core.util.validation.validateWritablePath("Firebase.update", this.path);
  if (goog.isArray(objectToMerge)) {
    var newObjectToMerge = {};
    for (var i = 0;i < objectToMerge.length;++i) {
      newObjectToMerge["" + i] = objectToMerge[i];
    }
    objectToMerge = newObjectToMerge;
    fb.core.util.warn("Passing an Array to Firebase.update() is deprecated. Use set() if you want to overwrite the existing data, or " + "an Object with integer keys if you really do want to only update some of the children.");
  }
  fb.core.util.validation.validateFirebaseMergeDataArg("Firebase.update", 1, objectToMerge, this.path, false);
  fb.util.validation.validateCallback("Firebase.update", 2, onComplete, true);
  this.repo.update(this.path, objectToMerge, onComplete || null);
};
Firebase.prototype.setWithPriority = function(newVal, newPriority, onComplete) {
  fb.util.validation.validateArgCount("Firebase.setWithPriority", 2, 3, arguments.length);
  fb.core.util.validation.validateWritablePath("Firebase.setWithPriority", this.path);
  fb.core.util.validation.validateFirebaseDataArg("Firebase.setWithPriority", 1, newVal, this.path, false);
  fb.core.util.validation.validatePriority("Firebase.setWithPriority", 2, newPriority, false);
  fb.util.validation.validateCallback("Firebase.setWithPriority", 3, onComplete, true);
  if (this.key() === ".length" || this.key() === ".keys") {
    throw "Firebase.setWithPriority failed: " + this.key() + " is a read-only object.";
  }
  this.repo.setWithPriority(this.path, newVal, newPriority, onComplete || null);
};
Firebase.prototype.remove = function(onComplete) {
  fb.util.validation.validateArgCount("Firebase.remove", 0, 1, arguments.length);
  fb.core.util.validation.validateWritablePath("Firebase.remove", this.path);
  fb.util.validation.validateCallback("Firebase.remove", 1, onComplete, true);
  this.set(null, onComplete);
};
Firebase.prototype.transaction = function(transactionUpdate, onComplete, applyLocally) {
  fb.util.validation.validateArgCount("Firebase.transaction", 1, 3, arguments.length);
  fb.core.util.validation.validateWritablePath("Firebase.transaction", this.path);
  fb.util.validation.validateCallback("Firebase.transaction", 1, transactionUpdate, false);
  fb.util.validation.validateCallback("Firebase.transaction", 2, onComplete, true);
  fb.core.util.validation.validateBoolean("Firebase.transaction", 3, applyLocally, true);
  if (this.key() === ".length" || this.key() === ".keys") {
    throw "Firebase.transaction failed: " + this.key() + " is a read-only object.";
  }
  if (typeof applyLocally === "undefined") {
    applyLocally = true;
  }
  this.repo.startTransaction(this.path, transactionUpdate, onComplete || null, applyLocally);
};
Firebase.prototype.setPriority = function(priority, opt_onComplete) {
  fb.util.validation.validateArgCount("Firebase.setPriority", 1, 2, arguments.length);
  fb.core.util.validation.validateWritablePath("Firebase.setPriority", this.path);
  fb.core.util.validation.validatePriority("Firebase.setPriority", 1, priority, false);
  fb.util.validation.validateCallback("Firebase.setPriority", 2, opt_onComplete, true);
  this.repo.setWithPriority(this.path.child(".priority"), priority, null, opt_onComplete);
};
Firebase.prototype.push = function(value, onComplete) {
  fb.util.validation.validateArgCount("Firebase.push", 0, 2, arguments.length);
  fb.core.util.validation.validateWritablePath("Firebase.push", this.path);
  fb.core.util.validation.validateFirebaseDataArg("Firebase.push", 1, value, this.path, true);
  fb.util.validation.validateCallback("Firebase.push", 2, onComplete, true);
  var now = this.repo.serverTime();
  var name = fb.core.util.nextPushId(now);
  var pushedRef = this.child(name);
  if (typeof value !== "undefined" && value !== null) {
    pushedRef.set(value, onComplete);
  }
  return pushedRef;
};
Firebase.prototype.onDisconnect = function() {
  fb.core.util.validation.validateWritablePath("Firebase.onDisconnect", this.path);
  return new fb.api.OnDisconnect(this.repo, this.path);
};
Firebase.prototype.auth = function(cred, opt_onComplete, opt_onCancel) {
  fb.core.util.warn("FirebaseRef.auth() being deprecated. " + "Please use FirebaseRef.authWithCustomToken() instead.");
  fb.util.validation.validateArgCount("Firebase.auth", 1, 3, arguments.length);
  fb.core.util.validation.validateCredential("Firebase.auth", 1, cred, false);
  fb.util.validation.validateCallback("Firebase.auth", 2, opt_onComplete, true);
  fb.util.validation.validateCallback("Firebase.auth", 3, opt_onComplete, true);
  var clientOptions = {};
  clientOptions[fb.login.Constants.CLIENT_OPTION_SESSION_PERSISTENCE] = "none";
  this.repo.auth.authenticate(cred, {}, clientOptions, opt_onComplete, opt_onCancel);
};
Firebase.prototype.unauth = function(opt_onComplete) {
  fb.util.validation.validateArgCount("Firebase.unauth", 0, 1, arguments.length);
  fb.util.validation.validateCallback("Firebase.unauth", 1, opt_onComplete, true);
  this.repo.auth.unauthenticate(opt_onComplete);
};
Firebase.prototype.getAuth = function() {
  fb.util.validation.validateArgCount("Firebase.getAuth", 0, 0, arguments.length);
  return this.repo.auth.getAuth();
};
Firebase.prototype.onAuth = function(callback, opt_context) {
  fb.util.validation.validateArgCount("Firebase.onAuth", 1, 2, arguments.length);
  fb.util.validation.validateCallback("Firebase.onAuth", 1, callback, false);
  fb.util.validation.validateContextObject("Firebase.onAuth", 2, opt_context, true);
  this.repo.auth.on("auth_status", callback, opt_context);
};
Firebase.prototype.offAuth = function(callback, opt_context) {
  fb.util.validation.validateArgCount("Firebase.offAuth", 1, 2, arguments.length);
  fb.util.validation.validateCallback("Firebase.offAuth", 1, callback, false);
  fb.util.validation.validateContextObject("Firebase.offAuth", 2, opt_context, true);
  this.repo.auth.off("auth_status", callback, opt_context);
};
Firebase.prototype.authWithCustomToken = function(token, onComplete, opt_options) {
  fb.util.validation.validateArgCount("Firebase.authWithCustomToken", 2, 3, arguments.length);
  fb.core.util.validation.validateCredential("Firebase.authWithCustomToken", 1, token, false);
  fb.util.validation.validateCallback("Firebase.authWithCustomToken", 2, onComplete, false);
  fb.core.util.validation.validateObject("Firebase.authWithCustomToken", 3, opt_options, true);
  this.repo.auth.authenticate(token, {}, opt_options || {}, onComplete);
};
Firebase.prototype.authWithOAuthPopup = function(provider, onComplete, opt_options) {
  fb.util.validation.validateArgCount("Firebase.authWithOAuthPopup", 2, 3, arguments.length);
  fb.core.util.validation.validateString("Firebase.authWithOAuthPopup", 1, provider, false);
  fb.util.validation.validateCallback("Firebase.authWithOAuthPopup", 2, onComplete, false);
  fb.core.util.validation.validateObject("Firebase.authWithOAuthPopup", 3, opt_options, true);
  this.repo.auth.authWithPopup(provider, opt_options, onComplete);
};
Firebase.prototype.authWithOAuthRedirect = function(provider, onErr, opt_options) {
  fb.util.validation.validateArgCount("Firebase.authWithOAuthRedirect", 2, 3, arguments.length);
  fb.core.util.validation.validateString("Firebase.authWithOAuthRedirect", 1, provider, false);
  fb.util.validation.validateCallback("Firebase.authWithOAuthRedirect", 2, onErr, false);
  fb.core.util.validation.validateObject("Firebase.authWithOAuthRedirect", 3, opt_options, true);
  this.repo.auth.authWithRedirect(provider, opt_options, onErr);
};
Firebase.prototype.authWithOAuthToken = function(provider, params, onComplete, opt_options) {
  fb.util.validation.validateArgCount("Firebase.authWithOAuthToken", 3, 4, arguments.length);
  fb.core.util.validation.validateString("Firebase.authWithOAuthToken", 1, provider, false);
  fb.util.validation.validateCallback("Firebase.authWithOAuthToken", 3, onComplete, false);
  fb.core.util.validation.validateObject("Firebase.authWithOAuthToken", 4, opt_options, true);
  if (goog.isString(params)) {
    fb.core.util.validation.validateString("Firebase.authWithOAuthToken", 2, params, false);
    this.repo.auth.authWithCredential(provider + "/token", {"access_token":params}, opt_options, onComplete);
  } else {
    fb.core.util.validation.validateObject("Firebase.authWithOAuthToken", 2, params, false);
    this.repo.auth.authWithCredential(provider + "/token", params, opt_options, onComplete);
  }
};
Firebase.prototype.authAnonymously = function(onComplete, opt_options) {
  fb.util.validation.validateArgCount("Firebase.authAnonymously", 1, 2, arguments.length);
  fb.util.validation.validateCallback("Firebase.authAnonymously", 1, onComplete, false);
  fb.core.util.validation.validateObject("Firebase.authAnonymously", 2, opt_options, true);
  this.repo.auth.authWithCredential("anonymous", {}, opt_options, onComplete);
};
Firebase.prototype.authWithPassword = function(params, onComplete, opt_options) {
  fb.util.validation.validateArgCount("Firebase.authWithPassword", 2, 3, arguments.length);
  fb.core.util.validation.validateObject("Firebase.authWithPassword", 1, params, false);
  fb.core.util.validation.validateObjectContainsKey("Firebase.authWithPassword", 1, params, "email", false, "string");
  fb.core.util.validation.validateObjectContainsKey("Firebase.authWithPassword", 1, params, "password", false, "string");
  fb.util.validation.validateCallback("Firebase.authAnonymously", 2, onComplete, false);
  fb.core.util.validation.validateObject("Firebase.authAnonymously", 3, opt_options, true);
  this.repo.auth.authWithCredential("password", params, opt_options, onComplete);
};
Firebase.prototype.createUser = function(params, onComplete) {
  fb.util.validation.validateArgCount("Firebase.createUser", 2, 2, arguments.length);
  fb.core.util.validation.validateObject("Firebase.createUser", 1, params, false);
  fb.core.util.validation.validateObjectContainsKey("Firebase.createUser", 1, params, "email", false, "string");
  fb.core.util.validation.validateObjectContainsKey("Firebase.createUser", 1, params, "password", false, "string");
  fb.util.validation.validateCallback("Firebase.createUser", 2, onComplete, false);
  this.repo.auth.createUser(params, onComplete);
};
Firebase.prototype.removeUser = function(params, onComplete) {
  fb.util.validation.validateArgCount("Firebase.removeUser", 2, 2, arguments.length);
  fb.core.util.validation.validateObject("Firebase.removeUser", 1, params, false);
  fb.core.util.validation.validateObjectContainsKey("Firebase.removeUser", 1, params, "email", false, "string");
  fb.core.util.validation.validateObjectContainsKey("Firebase.removeUser", 1, params, "password", false, "string");
  fb.util.validation.validateCallback("Firebase.removeUser", 2, onComplete, false);
  this.repo.auth.removeUser(params, onComplete);
};
Firebase.prototype.changePassword = function(params, onComplete) {
  fb.util.validation.validateArgCount("Firebase.changePassword", 2, 2, arguments.length);
  fb.core.util.validation.validateObject("Firebase.changePassword", 1, params, false);
  fb.core.util.validation.validateObjectContainsKey("Firebase.changePassword", 1, params, "email", false, "string");
  fb.core.util.validation.validateObjectContainsKey("Firebase.changePassword", 1, params, "oldPassword", false, "string");
  fb.core.util.validation.validateObjectContainsKey("Firebase.changePassword", 1, params, "newPassword", false, "string");
  fb.util.validation.validateCallback("Firebase.changePassword", 2, onComplete, false);
  this.repo.auth.changePassword(params, onComplete);
};
Firebase.prototype.changeEmail = function(params, onComplete) {
  fb.util.validation.validateArgCount("Firebase.changeEmail", 2, 2, arguments.length);
  fb.core.util.validation.validateObject("Firebase.changeEmail", 1, params, false);
  fb.core.util.validation.validateObjectContainsKey("Firebase.changeEmail", 1, params, "oldEmail", false, "string");
  fb.core.util.validation.validateObjectContainsKey("Firebase.changeEmail", 1, params, "newEmail", false, "string");
  fb.core.util.validation.validateObjectContainsKey("Firebase.changeEmail", 1, params, "password", false, "string");
  fb.util.validation.validateCallback("Firebase.changeEmail", 2, onComplete, false);
  this.repo.auth.changeEmail(params, onComplete);
};
Firebase.prototype.resetPassword = function(params, onComplete) {
  fb.util.validation.validateArgCount("Firebase.resetPassword", 2, 2, arguments.length);
  fb.core.util.validation.validateObject("Firebase.resetPassword", 1, params, false);
  fb.core.util.validation.validateObjectContainsKey("Firebase.resetPassword", 1, params, "email", false, "string");
  fb.util.validation.validateCallback("Firebase.resetPassword", 2, onComplete, false);
  this.repo.auth.resetPassword(params, onComplete);
};
Firebase.goOffline = function() {
  fb.util.validation.validateArgCount("Firebase.goOffline", 0, 0, arguments.length);
  fb.core.RepoManager.getInstance().interrupt();
};
Firebase.goOnline = function() {
  fb.util.validation.validateArgCount("Firebase.goOnline", 0, 0, arguments.length);
  fb.core.RepoManager.getInstance().resume();
};
Firebase.enableLogging = function(logger, persistent) {
  fb.core.util.assert(!persistent || (logger === true || logger === false), "Can't turn on custom loggers persistently.");
  if (logger === true) {
    if (typeof console !== "undefined") {
      if (typeof console.log === "function") {
        fb.core.util.logger = goog.bind(console.log, console);
      } else {
        if (typeof console.log === "object") {
          fb.core.util.logger = function(message) {
            console.log(message);
          };
        }
      }
    }
    if (persistent) {
      fb.core.storage.SessionStorage.set("logging_enabled", true);
    }
  } else {
    if (logger) {
      fb.core.util.logger = logger;
    } else {
      fb.core.util.logger = null;
      fb.core.storage.SessionStorage.remove("logging_enabled");
    }
  }
};
Firebase.ServerValue = {"TIMESTAMP":{".sv":"timestamp"}};
Firebase.SDK_VERSION = CLIENT_VERSION;
Firebase.INTERNAL = fb.api.INTERNAL;
Firebase.Context = fb.core.RepoManager;
Firebase.TEST_ACCESS = fb.api.TEST_ACCESS;

Firebase.SDK_VERSION = '2.2.4';

