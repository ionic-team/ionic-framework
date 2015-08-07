"format register";
System.register("angular2/src/router/route_definition", [], false, function(__require, __exports, __module) {
  System.get("@@global-helpers").prepareGlobal(__module.id, []);
  (function() {}).call(System.global);
  return System.get("@@global-helpers").retrieveGlobal(__module.id, false);
});

System.register("angular2/src/router/lifecycle_annotations_impl", ["angular2/src/facade/lang"], function($__export) {
  "use strict";
  var __moduleName = "angular2/src/router/lifecycle_annotations_impl";
  var __decorate,
      __metadata,
      CONST,
      CONST_EXPR,
      RouteLifecycleHook,
      CanActivate,
      canReuse,
      canDeactivate,
      onActivate,
      onReuse,
      onDeactivate;
  return {
    setters: [function($__m) {
      CONST = $__m.CONST;
      CONST_EXPR = $__m.CONST_EXPR;
    }],
    execute: function() {
      __decorate = (this && this.__decorate) || function(decorators, target, key, desc) {
        if (typeof Reflect === "object" && typeof Reflect.decorate === "function")
          return Reflect.decorate(decorators, target, key, desc);
        switch (arguments.length) {
          case 2:
            return decorators.reduceRight(function(o, d) {
              return (d && d(o)) || o;
            }, target);
          case 3:
            return decorators.reduceRight(function(o, d) {
              return (d && d(target, key)), void 0;
            }, void 0);
          case 4:
            return decorators.reduceRight(function(o, d) {
              return (d && d(target, key, o)) || o;
            }, desc);
        }
      };
      __metadata = (this && this.__metadata) || function(k, v) {
        if (typeof Reflect === "object" && typeof Reflect.metadata === "function")
          return Reflect.metadata(k, v);
      };
      RouteLifecycleHook = (($traceurRuntime.createClass)(function(name) {
        this.name = name;
      }, {}, {}));
      $__export("RouteLifecycleHook", RouteLifecycleHook);
      $__export("RouteLifecycleHook", RouteLifecycleHook = __decorate([CONST(), __metadata('design:paramtypes', [String])], RouteLifecycleHook));
      CanActivate = (($traceurRuntime.createClass)(function(fn) {
        this.fn = fn;
      }, {}, {}));
      $__export("CanActivate", CanActivate);
      $__export("CanActivate", CanActivate = __decorate([CONST(), __metadata('design:paramtypes', [Function])], CanActivate));
      canReuse = CONST_EXPR(new RouteLifecycleHook("canReuse"));
      $__export("canReuse", canReuse);
      canDeactivate = CONST_EXPR(new RouteLifecycleHook("canDeactivate"));
      $__export("canDeactivate", canDeactivate);
      onActivate = CONST_EXPR(new RouteLifecycleHook("onActivate"));
      $__export("onActivate", onActivate);
      onReuse = CONST_EXPR(new RouteLifecycleHook("onReuse"));
      $__export("onReuse", onReuse);
      onDeactivate = CONST_EXPR(new RouteLifecycleHook("onDeactivate"));
      $__export("onDeactivate", onDeactivate);
    }
  };
});

System.register("angular2/src/router/instruction", ["angular2/src/facade/collection", "angular2/src/facade/lang"], function($__export) {
  "use strict";
  var __moduleName = "angular2/src/router/instruction";
  var StringMapWrapper,
      isPresent,
      isBlank,
      normalizeBlank,
      RouteParams,
      Instruction;
  return {
    setters: [function($__m) {
      StringMapWrapper = $__m.StringMapWrapper;
    }, function($__m) {
      isPresent = $__m.isPresent;
      isBlank = $__m.isBlank;
      normalizeBlank = $__m.normalizeBlank;
    }],
    execute: function() {
      RouteParams = (function() {
        function RouteParams(params) {
          this.params = params;
        }
        return ($traceurRuntime.createClass)(RouteParams, {get: function(param) {
            return normalizeBlank(StringMapWrapper.get(this.params, param));
          }}, {});
      }());
      $__export("RouteParams", RouteParams);
      Instruction = (function() {
        function Instruction(component, capturedUrl, _recognizer) {
          var child = arguments[3] !== (void 0) ? arguments[3] : null;
          var _params = arguments[4] !== (void 0) ? arguments[4] : null;
          this.component = component;
          this.capturedUrl = capturedUrl;
          this._recognizer = _recognizer;
          this.child = child;
          this._params = _params;
          this.reuse = false;
          this.accumulatedUrl = capturedUrl;
          this.specificity = _recognizer.specificity;
          if (isPresent(child)) {
            this.child = child;
            this.specificity += child.specificity;
            var childUrl = child.accumulatedUrl;
            if (isPresent(childUrl)) {
              this.accumulatedUrl += childUrl;
            }
          }
        }
        return ($traceurRuntime.createClass)(Instruction, {params: function() {
            if (isBlank(this._params)) {
              this._params = this._recognizer.parseParams(this.capturedUrl);
            }
            return this._params;
          }}, {});
      }());
      $__export("Instruction", Instruction);
    }
  };
});

System.register("angular2/src/router/lifecycle_annotations", ["angular2/src/util/decorators", "angular2/src/router/lifecycle_annotations_impl"], function($__export) {
  "use strict";
  var __moduleName = "angular2/src/router/lifecycle_annotations";
  var makeDecorator,
      CanActivateAnnotation,
      CanActivate;
  return {
    setters: [function($__m) {
      makeDecorator = $__m.makeDecorator;
    }, function($__m) {
      CanActivateAnnotation = $__m.CanActivate;
      $__export("canReuse", $__m.canReuse);
      $__export("canDeactivate", $__m.canDeactivate);
      $__export("onActivate", $__m.onActivate);
      $__export("onReuse", $__m.onReuse);
      $__export("onDeactivate", $__m.onDeactivate);
    }],
    execute: function() {
      CanActivate = makeDecorator(CanActivateAnnotation);
      $__export("CanActivate", CanActivate);
    }
  };
});

System.register("angular2/src/router/location_strategy", ["angular2/src/facade/lang"], function($__export) {
  "use strict";
  var __moduleName = "angular2/src/router/location_strategy";
  var BaseException,
      LocationStrategy;
  function _abstract() {
    return new BaseException('This method is abstract');
  }
  return {
    setters: [function($__m) {
      BaseException = $__m.BaseException;
    }],
    execute: function() {
      LocationStrategy = (function() {
        function LocationStrategy() {}
        return ($traceurRuntime.createClass)(LocationStrategy, {
          path: function() {
            throw _abstract();
          },
          pushState: function(ctx, title, url) {
            throw _abstract();
          },
          forward: function() {
            throw _abstract();
          },
          back: function() {
            throw _abstract();
          },
          onPopState: function(fn) {
            throw _abstract();
          },
          getBaseHref: function() {
            throw _abstract();
          }
        }, {});
      }());
      $__export("LocationStrategy", LocationStrategy);
    }
  };
});

System.register("angular2/src/router/helpers", ["angular2/src/facade/lang"], function($__export) {
  "use strict";
  var __moduleName = "angular2/src/router/helpers";
  var isPresent;
  function parseAndAssignParamString(splitToken, paramString, keyValueMap) {
    var first = paramString[0];
    if (first == '?' || first == ';') {
      paramString = paramString.substring(1);
    }
    paramString.split(splitToken).forEach((function(entry) {
      var tuple = entry.split('=');
      var key = tuple[0];
      if (!isPresent(keyValueMap[key])) {
        var value = tuple.length > 1 ? tuple[1] : true;
        keyValueMap[key] = value;
      }
    }));
  }
  $__export("parseAndAssignParamString", parseAndAssignParamString);
  return {
    setters: [function($__m) {
      isPresent = $__m.isPresent;
    }],
    execute: function() {
    }
  };
});

System.register("angular2/src/router/url", ["angular2/src/facade/lang"], function($__export) {
  "use strict";
  var __moduleName = "angular2/src/router/url";
  var RegExpWrapper,
      StringWrapper,
      specialCharacters,
      escapeRe;
  function escapeRegex(string) {
    return StringWrapper.replaceAllMapped(string, escapeRe, (function(match) {
      return "\\" + match;
    }));
  }
  $__export("escapeRegex", escapeRegex);
  return {
    setters: [function($__m) {
      RegExpWrapper = $__m.RegExpWrapper;
      StringWrapper = $__m.StringWrapper;
    }],
    execute: function() {
      specialCharacters = ['/', '.', '*', '+', '?', '|', '(', ')', '[', ']', '{', '}', '\\'];
      escapeRe = RegExpWrapper.create('(\\' + specialCharacters.join('|\\') + ')', 'g');
    }
  };
});

System.register("angular2/src/router/route_config_impl", ["angular2/src/facade/lang"], function($__export) {
  "use strict";
  var __moduleName = "angular2/src/router/route_config_impl";
  var __decorate,
      __metadata,
      CONST,
      RouteConfig,
      Route,
      AsyncRoute,
      Redirect;
  return {
    setters: [function($__m) {
      CONST = $__m.CONST;
    }],
    execute: function() {
      __decorate = (this && this.__decorate) || function(decorators, target, key, desc) {
        if (typeof Reflect === "object" && typeof Reflect.decorate === "function")
          return Reflect.decorate(decorators, target, key, desc);
        switch (arguments.length) {
          case 2:
            return decorators.reduceRight(function(o, d) {
              return (d && d(o)) || o;
            }, target);
          case 3:
            return decorators.reduceRight(function(o, d) {
              return (d && d(target, key)), void 0;
            }, void 0);
          case 4:
            return decorators.reduceRight(function(o, d) {
              return (d && d(target, key, o)) || o;
            }, desc);
        }
      };
      __metadata = (this && this.__metadata) || function(k, v) {
        if (typeof Reflect === "object" && typeof Reflect.metadata === "function")
          return Reflect.metadata(k, v);
      };
      RouteConfig = (($traceurRuntime.createClass)(function(configs) {
        this.configs = configs;
      }, {}, {}));
      $__export("RouteConfig", RouteConfig);
      $__export("RouteConfig", RouteConfig = __decorate([CONST(), __metadata('design:paramtypes', [Object])], RouteConfig));
      Route = (($traceurRuntime.createClass)(function($__2) {
        var $__3 = $__2,
            path = $__3.path,
            component = $__3.component,
            as = $__3.as;
        this.path = path;
        this.component = component;
        this.as = as;
        this.loader = null;
        this.redirectTo = null;
      }, {}, {}));
      $__export("Route", Route);
      $__export("Route", Route = __decorate([CONST(), __metadata('design:paramtypes', [Object])], Route));
      AsyncRoute = (($traceurRuntime.createClass)(function($__2) {
        var $__3 = $__2,
            path = $__3.path,
            loader = $__3.loader,
            as = $__3.as;
        this.path = path;
        this.loader = loader;
        this.as = as;
      }, {}, {}));
      $__export("AsyncRoute", AsyncRoute);
      $__export("AsyncRoute", AsyncRoute = __decorate([CONST(), __metadata('design:paramtypes', [Object])], AsyncRoute));
      Redirect = (($traceurRuntime.createClass)(function($__2) {
        var $__3 = $__2,
            path = $__3.path,
            redirectTo = $__3.redirectTo;
        this.as = null;
        this.path = path;
        this.redirectTo = redirectTo;
      }, {}, {}));
      $__export("Redirect", Redirect);
      $__export("Redirect", Redirect = __decorate([CONST(), __metadata('design:paramtypes', [Object])], Redirect));
    }
  };
});

System.register("angular2/src/router/async_route_handler", ["angular2/src/facade/lang"], function($__export) {
  "use strict";
  var __moduleName = "angular2/src/router/async_route_handler";
  var isPresent,
      AsyncRouteHandler;
  return {
    setters: [function($__m) {
      isPresent = $__m.isPresent;
    }],
    execute: function() {
      AsyncRouteHandler = (function() {
        function AsyncRouteHandler(_loader) {
          this._loader = _loader;
          this._resolvedComponent = null;
        }
        return ($traceurRuntime.createClass)(AsyncRouteHandler, {resolveComponentType: function() {
            var $__0 = this;
            if (isPresent(this._resolvedComponent)) {
              return this._resolvedComponent;
            }
            return this._resolvedComponent = this._loader().then((function(componentType) {
              $__0.componentType = componentType;
              return componentType;
            }));
          }}, {});
      }());
      $__export("AsyncRouteHandler", AsyncRouteHandler);
    }
  };
});

System.register("angular2/src/router/sync_route_handler", ["angular2/src/facade/async"], function($__export) {
  "use strict";
  var __moduleName = "angular2/src/router/sync_route_handler";
  var PromiseWrapper,
      SyncRouteHandler;
  return {
    setters: [function($__m) {
      PromiseWrapper = $__m.PromiseWrapper;
    }],
    execute: function() {
      SyncRouteHandler = (function() {
        function SyncRouteHandler(componentType) {
          this.componentType = componentType;
          this._resolvedComponent = null;
          this._resolvedComponent = PromiseWrapper.resolve(componentType);
        }
        return ($traceurRuntime.createClass)(SyncRouteHandler, {resolveComponentType: function() {
            return this._resolvedComponent;
          }}, {});
      }());
      $__export("SyncRouteHandler", SyncRouteHandler);
    }
  };
});

System.register("angular2/src/router/route_config_decorator", ["angular2/src/router/route_config_impl", "angular2/src/util/decorators"], function($__export) {
  "use strict";
  var __moduleName = "angular2/src/router/route_config_decorator";
  var RouteConfigAnnotation,
      makeDecorator,
      RouteConfig;
  return {
    setters: [function($__m) {
      RouteConfigAnnotation = $__m.RouteConfig;
      $__export("Route", $__m.Route);
      $__export("Redirect", $__m.Redirect);
      $__export("AsyncRoute", $__m.AsyncRoute);
    }, function($__m) {
      makeDecorator = $__m.makeDecorator;
    }],
    execute: function() {
      RouteConfig = makeDecorator(RouteConfigAnnotation);
      $__export("RouteConfig", RouteConfig);
    }
  };
});

System.register("angular2/src/router/hash_location_strategy", ["angular2/src/dom/dom_adapter", "angular2/di", "angular2/src/router/location_strategy"], function($__export) {
  "use strict";
  var __moduleName = "angular2/src/router/hash_location_strategy";
  var __decorate,
      __metadata,
      DOM,
      Injectable,
      LocationStrategy,
      HashLocationStrategy;
  return {
    setters: [function($__m) {
      DOM = $__m.DOM;
    }, function($__m) {
      Injectable = $__m.Injectable;
    }, function($__m) {
      LocationStrategy = $__m.LocationStrategy;
    }],
    execute: function() {
      __decorate = (this && this.__decorate) || function(decorators, target, key, desc) {
        if (typeof Reflect === "object" && typeof Reflect.decorate === "function")
          return Reflect.decorate(decorators, target, key, desc);
        switch (arguments.length) {
          case 2:
            return decorators.reduceRight(function(o, d) {
              return (d && d(o)) || o;
            }, target);
          case 3:
            return decorators.reduceRight(function(o, d) {
              return (d && d(target, key)), void 0;
            }, void 0);
          case 4:
            return decorators.reduceRight(function(o, d) {
              return (d && d(target, key, o)) || o;
            }, desc);
        }
      };
      __metadata = (this && this.__metadata) || function(k, v) {
        if (typeof Reflect === "object" && typeof Reflect.metadata === "function")
          return Reflect.metadata(k, v);
      };
      HashLocationStrategy = (function($__super) {
        function $__0() {
          $traceurRuntime.superConstructor($__0).call(this);
          this._location = DOM.getLocation();
          this._history = DOM.getHistory();
        }
        return ($traceurRuntime.createClass)($__0, {
          onPopState: function(fn) {
            DOM.getGlobalEventTarget('window').addEventListener('popstate', fn, false);
          },
          getBaseHref: function() {
            return '';
          },
          path: function() {
            var path = this._location.hash;
            return path.length > 0 ? path.substring(1) : path;
          },
          pushState: function(state, title, url) {
            this._history.pushState(state, title, '#' + url);
          },
          forward: function() {
            this._history.forward();
          },
          back: function() {
            this._history.back();
          }
        }, {}, $__super);
      }(LocationStrategy));
      $__export("HashLocationStrategy", HashLocationStrategy);
      $__export("HashLocationStrategy", HashLocationStrategy = __decorate([Injectable(), __metadata('design:paramtypes', [])], HashLocationStrategy));
    }
  };
});

System.register("angular2/src/router/html5_location_strategy", ["angular2/src/dom/dom_adapter", "angular2/di", "angular2/src/router/location_strategy"], function($__export) {
  "use strict";
  var __moduleName = "angular2/src/router/html5_location_strategy";
  var __decorate,
      __metadata,
      DOM,
      Injectable,
      LocationStrategy,
      HTML5LocationStrategy;
  return {
    setters: [function($__m) {
      DOM = $__m.DOM;
    }, function($__m) {
      Injectable = $__m.Injectable;
    }, function($__m) {
      LocationStrategy = $__m.LocationStrategy;
    }],
    execute: function() {
      __decorate = (this && this.__decorate) || function(decorators, target, key, desc) {
        if (typeof Reflect === "object" && typeof Reflect.decorate === "function")
          return Reflect.decorate(decorators, target, key, desc);
        switch (arguments.length) {
          case 2:
            return decorators.reduceRight(function(o, d) {
              return (d && d(o)) || o;
            }, target);
          case 3:
            return decorators.reduceRight(function(o, d) {
              return (d && d(target, key)), void 0;
            }, void 0);
          case 4:
            return decorators.reduceRight(function(o, d) {
              return (d && d(target, key, o)) || o;
            }, desc);
        }
      };
      __metadata = (this && this.__metadata) || function(k, v) {
        if (typeof Reflect === "object" && typeof Reflect.metadata === "function")
          return Reflect.metadata(k, v);
      };
      HTML5LocationStrategy = (function($__super) {
        function $__0() {
          $traceurRuntime.superConstructor($__0).call(this);
          this._location = DOM.getLocation();
          this._history = DOM.getHistory();
          this._baseHref = DOM.getBaseHref();
        }
        return ($traceurRuntime.createClass)($__0, {
          onPopState: function(fn) {
            DOM.getGlobalEventTarget('window').addEventListener('popstate', fn, false);
          },
          getBaseHref: function() {
            return this._baseHref;
          },
          path: function() {
            return this._location.pathname;
          },
          pushState: function(state, title, url) {
            this._history.pushState(state, title, url);
          },
          forward: function() {
            this._history.forward();
          },
          back: function() {
            this._history.back();
          }
        }, {}, $__super);
      }(LocationStrategy));
      $__export("HTML5LocationStrategy", HTML5LocationStrategy);
      $__export("HTML5LocationStrategy", HTML5LocationStrategy = __decorate([Injectable(), __metadata('design:paramtypes', [])], HTML5LocationStrategy));
    }
  };
});

System.register("angular2/src/router/pipeline", ["angular2/src/facade/async", "angular2/di"], function($__export) {
  "use strict";
  var __moduleName = "angular2/src/router/pipeline";
  var __decorate,
      __metadata,
      PromiseWrapper,
      Injectable,
      Pipeline;
  return {
    setters: [function($__m) {
      PromiseWrapper = $__m.PromiseWrapper;
    }, function($__m) {
      Injectable = $__m.Injectable;
    }],
    execute: function() {
      __decorate = (this && this.__decorate) || function(decorators, target, key, desc) {
        if (typeof Reflect === "object" && typeof Reflect.decorate === "function")
          return Reflect.decorate(decorators, target, key, desc);
        switch (arguments.length) {
          case 2:
            return decorators.reduceRight(function(o, d) {
              return (d && d(o)) || o;
            }, target);
          case 3:
            return decorators.reduceRight(function(o, d) {
              return (d && d(target, key)), void 0;
            }, void 0);
          case 4:
            return decorators.reduceRight(function(o, d) {
              return (d && d(target, key, o)) || o;
            }, desc);
        }
      };
      __metadata = (this && this.__metadata) || function(k, v) {
        if (typeof Reflect === "object" && typeof Reflect.metadata === "function")
          return Reflect.metadata(k, v);
      };
      Pipeline = (($traceurRuntime.createClass)(function() {
        this.steps = [(function(instruction) {
          return instruction.router.activateOutlets(instruction);
        })];
      }, {process: function(instruction) {
          var steps = this.steps,
              currentStep = 0;
          function processOne() {
            var result = arguments[0] !== (void 0) ? arguments[0] : true;
            if (currentStep >= steps.length) {
              return PromiseWrapper.resolve(result);
            }
            var step = steps[currentStep];
            currentStep += 1;
            return PromiseWrapper.resolve(step(instruction)).then(processOne);
          }
          return processOne();
        }}, {}));
      $__export("Pipeline", Pipeline);
      $__export("Pipeline", Pipeline = __decorate([Injectable(), __metadata('design:paramtypes', [])], Pipeline));
    }
  };
});

System.register("angular2/src/router/location", ["angular2/src/router/location_strategy", "angular2/src/facade/lang", "angular2/src/facade/async", "angular2/di"], function($__export) {
  "use strict";
  var __moduleName = "angular2/src/router/location";
  var __decorate,
      __metadata,
      __param,
      LocationStrategy,
      isPresent,
      CONST_EXPR,
      EventEmitter,
      ObservableWrapper,
      BaseException,
      isBlank,
      OpaqueToken,
      Injectable,
      Optional,
      Inject,
      appBaseHrefToken,
      Location;
  function stripIndexHtml(url) {
    if (/\/index.html$/g.test(url)) {
      return url.substring(0, url.length - 11);
    }
    return url;
  }
  function stripTrailingSlash(url) {
    if (/\/$/g.test(url)) {
      url = url.substring(0, url.length - 1);
    }
    return url;
  }
  return {
    setters: [function($__m) {
      LocationStrategy = $__m.LocationStrategy;
    }, function($__m) {
      isPresent = $__m.isPresent;
      CONST_EXPR = $__m.CONST_EXPR;
      BaseException = $__m.BaseException;
      isBlank = $__m.isBlank;
    }, function($__m) {
      EventEmitter = $__m.EventEmitter;
      ObservableWrapper = $__m.ObservableWrapper;
    }, function($__m) {
      OpaqueToken = $__m.OpaqueToken;
      Injectable = $__m.Injectable;
      Optional = $__m.Optional;
      Inject = $__m.Inject;
    }],
    execute: function() {
      __decorate = (this && this.__decorate) || function(decorators, target, key, desc) {
        if (typeof Reflect === "object" && typeof Reflect.decorate === "function")
          return Reflect.decorate(decorators, target, key, desc);
        switch (arguments.length) {
          case 2:
            return decorators.reduceRight(function(o, d) {
              return (d && d(o)) || o;
            }, target);
          case 3:
            return decorators.reduceRight(function(o, d) {
              return (d && d(target, key)), void 0;
            }, void 0);
          case 4:
            return decorators.reduceRight(function(o, d) {
              return (d && d(target, key, o)) || o;
            }, desc);
        }
      };
      __metadata = (this && this.__metadata) || function(k, v) {
        if (typeof Reflect === "object" && typeof Reflect.metadata === "function")
          return Reflect.metadata(k, v);
      };
      __param = (this && this.__param) || function(paramIndex, decorator) {
        return function(target, key) {
          decorator(target, key, paramIndex);
        };
      };
      appBaseHrefToken = CONST_EXPR(new OpaqueToken('locationHrefToken'));
      $__export("appBaseHrefToken", appBaseHrefToken);
      Location = (($traceurRuntime.createClass)(function(_platformStrategy, href) {
        var $__0 = this;
        this._platformStrategy = _platformStrategy;
        this._subject = new EventEmitter();
        var browserBaseHref = isPresent(href) ? href : this._platformStrategy.getBaseHref();
        if (isBlank(browserBaseHref)) {
          throw new BaseException("No base href set. Either provide a binding to \"appBaseHrefToken\" or add a base element.");
        }
        this._baseHref = stripTrailingSlash(stripIndexHtml(browserBaseHref));
        this._platformStrategy.onPopState((function(_) {
          return $__0._onPopState(_);
        }));
      }, {
        _onPopState: function(_) {
          ObservableWrapper.callNext(this._subject, {
            'url': this.path(),
            'pop': true
          });
        },
        path: function() {
          return this.normalize(this._platformStrategy.path());
        },
        normalize: function(url) {
          return stripTrailingSlash(this._stripBaseHref(stripIndexHtml(url)));
        },
        normalizeAbsolutely: function(url) {
          if (!url.startsWith('/')) {
            url = '/' + url;
          }
          return stripTrailingSlash(this._addBaseHref(url));
        },
        _stripBaseHref: function(url) {
          if (this._baseHref.length > 0 && url.startsWith(this._baseHref)) {
            return url.substring(this._baseHref.length);
          }
          return url;
        },
        _addBaseHref: function(url) {
          if (!url.startsWith(this._baseHref)) {
            return this._baseHref + url;
          }
          return url;
        },
        go: function(url) {
          var finalUrl = this.normalizeAbsolutely(url);
          this._platformStrategy.pushState(null, '', finalUrl);
        },
        forward: function() {
          this._platformStrategy.forward();
        },
        back: function() {
          this._platformStrategy.back();
        },
        subscribe: function(onNext) {
          var onThrow = arguments[1] !== (void 0) ? arguments[1] : null;
          var onReturn = arguments[2] !== (void 0) ? arguments[2] : null;
          ObservableWrapper.subscribe(this._subject, onNext, onThrow, onReturn);
        }
      }, {}));
      $__export("Location", Location);
      $__export("Location", Location = __decorate([Injectable(), __param(1, Optional()), __param(1, Inject(appBaseHrefToken)), __metadata('design:paramtypes', [LocationStrategy, String])], Location));
    }
  };
});

System.register("angular2/src/router/path_recognizer", ["angular2/src/facade/lang", "angular2/src/facade/collection", "angular2/src/router/helpers", "angular2/src/router/url"], function($__export) {
  "use strict";
  var __moduleName = "angular2/src/router/path_recognizer";
  var __decorate,
      __metadata,
      RegExpWrapper,
      StringWrapper,
      isPresent,
      isBlank,
      BaseException,
      StringMapWrapper,
      ListWrapper,
      IMPLEMENTS,
      parseAndAssignParamString,
      escapeRegex,
      Segment,
      TouchMap,
      ContinuationSegment,
      StaticSegment,
      DynamicSegment,
      StarSegment,
      paramMatcher,
      wildcardMatcher,
      RESERVED_CHARS,
      PathRecognizer;
  function normalizeString(obj) {
    if (isBlank(obj)) {
      return null;
    } else {
      return obj.toString();
    }
  }
  function parsePathString(route) {
    if (StringWrapper.startsWith(route, "/")) {
      route = StringWrapper.substring(route, 1);
    }
    var segments = splitBySlash(route);
    var results = [];
    var specificity = 0;
    if (segments.length > 98) {
      throw new BaseException(("'" + route + "' has more than the maximum supported number of segments."));
    }
    var limit = segments.length - 1;
    for (var i = 0; i <= limit; i++) {
      var segment = segments[i],
          match = void 0;
      if (isPresent(match = RegExpWrapper.firstMatch(paramMatcher, segment))) {
        results.push(new DynamicSegment(match[1]));
        specificity += (100 - i);
      } else if (isPresent(match = RegExpWrapper.firstMatch(wildcardMatcher, segment))) {
        results.push(new StarSegment(match[1]));
      } else if (segment == '...') {
        if (i < limit) {
          throw new BaseException(("Unexpected \"...\" before the end of the path for \"" + route + "\"."));
        }
        results.push(new ContinuationSegment());
      } else if (segment.length > 0) {
        results.push(new StaticSegment(segment));
        specificity += 100 * (100 - i);
      }
    }
    var result = StringMapWrapper.create();
    StringMapWrapper.set(result, 'segments', results);
    StringMapWrapper.set(result, 'specificity', specificity);
    return result;
  }
  function splitBySlash(url) {
    return url.split('/');
  }
  function assertPath(path) {
    if (StringWrapper.contains(path, '#')) {
      throw new BaseException(("Path \"" + path + "\" should not include \"#\". Use \"HashLocationStrategy\" instead."));
    }
    var illegalCharacter = RegExpWrapper.firstMatch(RESERVED_CHARS, path);
    if (isPresent(illegalCharacter)) {
      throw new BaseException(("Path \"" + path + "\" contains \"" + illegalCharacter[0] + "\" which is not allowed in a route config."));
    }
  }
  return {
    setters: [function($__m) {
      RegExpWrapper = $__m.RegExpWrapper;
      StringWrapper = $__m.StringWrapper;
      isPresent = $__m.isPresent;
      isBlank = $__m.isBlank;
      BaseException = $__m.BaseException;
      IMPLEMENTS = $__m.IMPLEMENTS;
    }, function($__m) {
      StringMapWrapper = $__m.StringMapWrapper;
      ListWrapper = $__m.ListWrapper;
    }, function($__m) {
      parseAndAssignParamString = $__m.parseAndAssignParamString;
    }, function($__m) {
      escapeRegex = $__m.escapeRegex;
    }],
    execute: function() {
      __decorate = (this && this.__decorate) || function(decorators, target, key, desc) {
        if (typeof Reflect === "object" && typeof Reflect.decorate === "function")
          return Reflect.decorate(decorators, target, key, desc);
        switch (arguments.length) {
          case 2:
            return decorators.reduceRight(function(o, d) {
              return (d && d(o)) || o;
            }, target);
          case 3:
            return decorators.reduceRight(function(o, d) {
              return (d && d(target, key)), void 0;
            }, void 0);
          case 4:
            return decorators.reduceRight(function(o, d) {
              return (d && d(target, key, o)) || o;
            }, desc);
        }
      };
      __metadata = (this && this.__metadata) || function(k, v) {
        if (typeof Reflect === "object" && typeof Reflect.metadata === "function")
          return Reflect.metadata(k, v);
      };
      Segment = (function() {
        function Segment() {}
        return ($traceurRuntime.createClass)(Segment, {generate: function(params) {
            return '';
          }}, {});
      }());
      $__export("Segment", Segment);
      TouchMap = (function() {
        function TouchMap(map) {
          var $__0 = this;
          this.map = StringMapWrapper.create();
          this.keys = StringMapWrapper.create();
          if (isPresent(map)) {
            StringMapWrapper.forEach(map, (function(value, key) {
              $__0.map[key] = isPresent(value) ? value.toString() : null;
              $__0.keys[key] = true;
            }));
          }
        }
        return ($traceurRuntime.createClass)(TouchMap, {
          get: function(key) {
            StringMapWrapper.delete(this.keys, key);
            return this.map[key];
          },
          getUnused: function() {
            var $__0 = this;
            var unused = StringMapWrapper.create();
            var keys = StringMapWrapper.keys(this.keys);
            ListWrapper.forEach(keys, (function(key) {
              unused[key] = StringMapWrapper.get($__0.map, key);
            }));
            return unused;
          }
        }, {});
      }());
      ContinuationSegment = (function($__super) {
        function ContinuationSegment() {
          $traceurRuntime.superConstructor(ContinuationSegment).apply(this, arguments);
        }
        return ($traceurRuntime.createClass)(ContinuationSegment, {}, {}, $__super);
      }(Segment));
      StaticSegment = (function($__super) {
        function StaticSegment(string) {
          $traceurRuntime.superConstructor(StaticSegment).call(this);
          this.string = string;
          this.name = '';
          this.regex = escapeRegex(string);
          this.regex += '(;[^\/]+)?';
        }
        return ($traceurRuntime.createClass)(StaticSegment, {generate: function(params) {
            return this.string;
          }}, {}, $__super);
      }(Segment));
      DynamicSegment = (($traceurRuntime.createClass)(function(name) {
        this.name = name;
        this.regex = "([^/]+)";
      }, {generate: function(params) {
          if (!StringMapWrapper.contains(params.map, this.name)) {
            throw new BaseException(("Route generator for '" + this.name + "' was not included in parameters passed."));
          }
          return normalizeString(params.get(this.name));
        }}, {}));
      DynamicSegment = __decorate([IMPLEMENTS(Segment), __metadata('design:paramtypes', [String])], DynamicSegment);
      StarSegment = (function() {
        function StarSegment(name) {
          this.name = name;
          this.regex = "(.+)";
        }
        return ($traceurRuntime.createClass)(StarSegment, {generate: function(params) {
            return normalizeString(params.get(this.name));
          }}, {});
      }());
      paramMatcher = /^:([^\/]+)$/g;
      wildcardMatcher = /^\*([^\/]+)$/g;
      RESERVED_CHARS = RegExpWrapper.create('//|\\(|\\)|;|\\?|=');
      PathRecognizer = (function() {
        function PathRecognizer(path, handler) {
          var isRoot = arguments[2] !== (void 0) ? arguments[2] : false;
          var $__0 = this;
          this.path = path;
          this.handler = handler;
          this.isRoot = isRoot;
          this.terminal = true;
          assertPath(path);
          var parsed = parsePathString(path);
          var specificity = parsed['specificity'];
          var segments = parsed['segments'];
          var regexString = '^';
          ListWrapper.forEach(segments, (function(segment) {
            if (segment instanceof ContinuationSegment) {
              $__0.terminal = false;
            } else {
              regexString += '/' + segment.regex;
            }
          }));
          if (this.terminal) {
            regexString += '$';
          }
          this.regex = RegExpWrapper.create(regexString);
          this.segments = segments;
          this.specificity = specificity;
        }
        return ($traceurRuntime.createClass)(PathRecognizer, {
          parseParams: function(url) {
            var segmentsLimit = this.segments.length - 1;
            var containsStarSegment = segmentsLimit >= 0 && this.segments[segmentsLimit] instanceof StarSegment;
            var paramsString,
                useQueryString = this.isRoot && this.terminal;
            if (!containsStarSegment) {
              var matches = RegExpWrapper.firstMatch(useQueryString ? PathRecognizer.queryRegex : PathRecognizer.matrixRegex, url);
              if (isPresent(matches)) {
                url = matches[1];
                paramsString = matches[2];
              }
              url = StringWrapper.replaceAll(url, /(;[^\/]+)(?=(\/|$))/g, '');
            }
            var params = StringMapWrapper.create();
            var urlPart = url;
            for (var i = 0; i <= segmentsLimit; i++) {
              var segment = this.segments[i];
              if (segment instanceof ContinuationSegment) {
                continue;
              }
              var match = RegExpWrapper.firstMatch(RegExpWrapper.create('/' + segment.regex), urlPart);
              urlPart = StringWrapper.substring(urlPart, match[0].length);
              if (segment.name.length > 0) {
                params[segment.name] = match[1];
              }
            }
            if (isPresent(paramsString) && paramsString.length > 0) {
              var expectedStartingValue = useQueryString ? '?' : ';';
              if (paramsString[0] == expectedStartingValue) {
                parseAndAssignParamString(expectedStartingValue, paramsString, params);
              }
            }
            return params;
          },
          generate: function(params) {
            var paramTokens = new TouchMap(params);
            var applyLeadingSlash = false;
            var useQueryString = this.isRoot && this.terminal;
            var url = '';
            for (var i = 0; i < this.segments.length; i++) {
              var segment = this.segments[i];
              var s = segment.generate(paramTokens);
              applyLeadingSlash = applyLeadingSlash || (segment instanceof ContinuationSegment);
              if (s.length > 0) {
                url += (i > 0 ? '/' : '') + s;
              }
            }
            var unusedParams = paramTokens.getUnused();
            if (!StringMapWrapper.isEmpty(unusedParams)) {
              url += useQueryString ? '?' : ';';
              var paramToken = useQueryString ? '&' : ';';
              var i = 0;
              StringMapWrapper.forEach(unusedParams, (function(value, key) {
                if (i++ > 0) {
                  url += paramToken;
                }
                url += key;
                if (!isPresent(value) && useQueryString) {
                  value = 'true';
                }
                if (isPresent(value)) {
                  url += '=' + value;
                }
              }));
            }
            if (applyLeadingSlash) {
              url += '/';
            }
            return url;
          },
          resolveComponentType: function() {
            return this.handler.resolveComponentType();
          }
        }, {});
      }());
      $__export("PathRecognizer", PathRecognizer);
      PathRecognizer.matrixRegex = RegExpWrapper.create('^(.*\/[^\/]+?)(;[^\/]+)?\/?$');
      PathRecognizer.queryRegex = RegExpWrapper.create('^(.*\/[^\/]+?)(\\?[^\/]+)?$');
    }
  };
});

System.register("angular2/src/router/route_config_nomalizer", ["angular2/src/router/route_config_decorator", "angular2/src/facade/lang"], function($__export) {
  "use strict";
  var __moduleName = "angular2/src/router/route_config_nomalizer";
  var AsyncRoute,
      Route,
      Redirect,
      BaseException;
  function normalizeRouteConfig(config) {
    if (config instanceof Route || config instanceof Redirect || config instanceof AsyncRoute) {
      return config;
    }
    if ((!config.component) == (!config.redirectTo)) {
      throw new BaseException("Route config should contain exactly one 'component', or 'redirectTo' property");
    }
    if (config.component) {
      if (typeof config.component == 'object') {
        var componentDefinitionObject = config.component;
        if (componentDefinitionObject.type == 'constructor') {
          return new Route({
            path: config.path,
            component: componentDefinitionObject.constructor,
            as: config.as
          });
        } else if (componentDefinitionObject.type == 'loader') {
          return new AsyncRoute({
            path: config.path,
            loader: componentDefinitionObject.loader,
            as: config.as
          });
        } else {
          throw new BaseException(("Invalid component type '" + componentDefinitionObject.type + "'. Valid types are \"constructor\" and \"loader\"."));
        }
      }
      return new Route(config);
    }
    if (config.redirectTo) {
      return new Redirect({
        path: config.path,
        redirectTo: config.redirectTo
      });
    }
    return config;
  }
  $__export("normalizeRouteConfig", normalizeRouteConfig);
  return {
    setters: [function($__m) {
      AsyncRoute = $__m.AsyncRoute;
      Route = $__m.Route;
      Redirect = $__m.Redirect;
    }, function($__m) {
      BaseException = $__m.BaseException;
    }],
    execute: function() {
    }
  };
});

System.register("angular2/src/router/route_lifecycle_reflector", ["angular2/src/facade/lang", "angular2/src/router/lifecycle_annotations_impl", "angular2/src/reflection/reflection"], function($__export) {
  "use strict";
  var __moduleName = "angular2/src/router/route_lifecycle_reflector";
  var Type,
      CanActivate,
      reflector;
  function hasLifecycleHook(e, type) {
    if (!(type instanceof Type))
      return false;
    return e.name in type.prototype;
  }
  function getCanActivateHook(type) {
    var annotations = reflector.annotations(type);
    for (var i = 0; i < annotations.length; i += 1) {
      var annotation = annotations[i];
      if (annotation instanceof CanActivate) {
        return annotation.fn;
      }
    }
    return null;
  }
  $__export("hasLifecycleHook", hasLifecycleHook);
  $__export("getCanActivateHook", getCanActivateHook);
  return {
    setters: [function($__m) {
      Type = $__m.Type;
    }, function($__m) {
      CanActivate = $__m.CanActivate;
    }, function($__m) {
      reflector = $__m.reflector;
    }],
    execute: function() {
    }
  };
});

System.register("angular2/src/router/router_link", ["angular2/src/core/annotations/decorators", "angular2/src/router/router", "angular2/src/router/location"], function($__export) {
  "use strict";
  var __moduleName = "angular2/src/router/router_link";
  var __decorate,
      __metadata,
      Directive,
      Router,
      Location,
      RouterLink;
  return {
    setters: [function($__m) {
      Directive = $__m.Directive;
    }, function($__m) {
      Router = $__m.Router;
    }, function($__m) {
      Location = $__m.Location;
    }],
    execute: function() {
      __decorate = (this && this.__decorate) || function(decorators, target, key, desc) {
        if (typeof Reflect === "object" && typeof Reflect.decorate === "function")
          return Reflect.decorate(decorators, target, key, desc);
        switch (arguments.length) {
          case 2:
            return decorators.reduceRight(function(o, d) {
              return (d && d(o)) || o;
            }, target);
          case 3:
            return decorators.reduceRight(function(o, d) {
              return (d && d(target, key)), void 0;
            }, void 0);
          case 4:
            return decorators.reduceRight(function(o, d) {
              return (d && d(target, key, o)) || o;
            }, desc);
        }
      };
      __metadata = (this && this.__metadata) || function(k, v) {
        if (typeof Reflect === "object" && typeof Reflect.metadata === "function")
          return Reflect.metadata(k, v);
      };
      RouterLink = (($traceurRuntime.createClass)(function(_router, _location) {
        this._router = _router;
        this._location = _location;
      }, {
        set routeParams(changes) {
          this._routeParams = changes;
          this._navigationHref = this._router.generate(this._routeParams);
          this.visibleHref = this._location.normalizeAbsolutely(this._navigationHref);
        },
        onClick: function() {
          this._router.navigate(this._navigationHref);
          return false;
        }
      }, {}));
      $__export("RouterLink", RouterLink);
      $__export("RouterLink", RouterLink = __decorate([Directive({
        selector: '[router-link]',
        properties: ['routeParams: routerLink'],
        host: {
          '(^click)': 'onClick()',
          '[attr.href]': 'visibleHref'
        }
      }), __metadata('design:paramtypes', [Router, Location])], RouterLink));
    }
  };
});

System.register("angular2/src/router/route_recognizer", ["angular2/src/facade/lang", "angular2/src/facade/collection", "angular2/src/router/path_recognizer", "angular2/src/router/route_config_impl", "angular2/src/router/async_route_handler", "angular2/src/router/sync_route_handler", "angular2/src/router/helpers"], function($__export) {
  "use strict";
  var __moduleName = "angular2/src/router/route_recognizer";
  var RegExpWrapper,
      isBlank,
      isPresent,
      isType,
      isStringMap,
      BaseException,
      Map,
      MapWrapper,
      StringMapWrapper,
      PathRecognizer,
      Route,
      AsyncRoute,
      Redirect,
      AsyncRouteHandler,
      SyncRouteHandler,
      parseAndAssignParamString,
      RouteRecognizer,
      RouteMatch;
  function configObjToHandler(config) {
    if (isType(config)) {
      return new SyncRouteHandler(config);
    } else if (isStringMap(config)) {
      if (isBlank(config['type'])) {
        throw new BaseException("Component declaration when provided as a map should include a 'type' property");
      }
      var componentType = config['type'];
      if (componentType == 'constructor') {
        return new SyncRouteHandler(config['constructor']);
      } else if (componentType == 'loader') {
        return new AsyncRouteHandler(config['loader']);
      } else {
        throw new BaseException("oops");
      }
    }
    throw new BaseException(("Unexpected component \"" + config + "\"."));
  }
  return {
    setters: [function($__m) {
      RegExpWrapper = $__m.RegExpWrapper;
      isBlank = $__m.isBlank;
      isPresent = $__m.isPresent;
      isType = $__m.isType;
      isStringMap = $__m.isStringMap;
      BaseException = $__m.BaseException;
    }, function($__m) {
      Map = $__m.Map;
      MapWrapper = $__m.MapWrapper;
      StringMapWrapper = $__m.StringMapWrapper;
    }, function($__m) {
      PathRecognizer = $__m.PathRecognizer;
    }, function($__m) {
      Route = $__m.Route;
      AsyncRoute = $__m.AsyncRoute;
      Redirect = $__m.Redirect;
    }, function($__m) {
      AsyncRouteHandler = $__m.AsyncRouteHandler;
    }, function($__m) {
      SyncRouteHandler = $__m.SyncRouteHandler;
    }, function($__m) {
      parseAndAssignParamString = $__m.parseAndAssignParamString;
    }],
    execute: function() {
      RouteRecognizer = (function() {
        function RouteRecognizer() {
          var isRoot = arguments[0] !== (void 0) ? arguments[0] : false;
          this.isRoot = isRoot;
          this.names = new Map();
          this.redirects = new Map();
          this.matchers = new Map();
        }
        return ($traceurRuntime.createClass)(RouteRecognizer, {
          config: function(config) {
            var handler;
            if (config instanceof Redirect) {
              var path = config.path == '/' ? '' : config.path;
              this.redirects.set(path, config.redirectTo);
              return true;
            } else if (config instanceof Route) {
              handler = new SyncRouteHandler(config.component);
            } else if (config instanceof AsyncRoute) {
              handler = new AsyncRouteHandler(config.loader);
            }
            var recognizer = new PathRecognizer(config.path, handler, this.isRoot);
            MapWrapper.forEach(this.matchers, (function(matcher, _) {
              if (recognizer.regex.toString() == matcher.regex.toString()) {
                throw new BaseException(("Configuration '" + config.path + "' conflicts with existing route '" + matcher.path + "'"));
              }
            }));
            this.matchers.set(recognizer.regex, recognizer);
            if (isPresent(config.as)) {
              this.names.set(config.as, recognizer);
            }
            return recognizer.terminal;
          },
          recognize: function(url) {
            var solutions = [];
            if (url.length > 0 && url[url.length - 1] == '/') {
              url = url.substring(0, url.length - 1);
            }
            MapWrapper.forEach(this.redirects, (function(target, path) {
              if (path == '/' || path == '') {
                if (path == url) {
                  url = target;
                }
              } else if (url.startsWith(path)) {
                url = target + url.substring(path.length);
              }
            }));
            var queryParams = StringMapWrapper.create();
            var queryString = '';
            var queryIndex = url.indexOf('?');
            if (queryIndex >= 0) {
              queryString = url.substring(queryIndex + 1);
              url = url.substring(0, queryIndex);
            }
            if (this.isRoot && queryString.length > 0) {
              parseAndAssignParamString('&', queryString, queryParams);
            }
            MapWrapper.forEach(this.matchers, (function(pathRecognizer, regex) {
              var match;
              if (isPresent(match = RegExpWrapper.firstMatch(regex, url))) {
                var matchedUrl = '/';
                var unmatchedUrl = '';
                if (url != '/') {
                  matchedUrl = match[0];
                  unmatchedUrl = url.substring(match[0].length);
                }
                var params = null;
                if (pathRecognizer.terminal && !StringMapWrapper.isEmpty(queryParams)) {
                  params = queryParams;
                  matchedUrl += '?' + queryString;
                }
                solutions.push(new RouteMatch(pathRecognizer, matchedUrl, unmatchedUrl, params));
              }
            }));
            return solutions;
          },
          hasRoute: function(name) {
            return this.names.has(name);
          },
          generate: function(name, params) {
            var pathRecognizer = this.names.get(name);
            if (isBlank(pathRecognizer)) {
              return null;
            }
            var url = pathRecognizer.generate(params);
            return {
              url: url,
              'nextComponent': pathRecognizer.handler.componentType
            };
          }
        }, {});
      }());
      $__export("RouteRecognizer", RouteRecognizer);
      RouteMatch = (function() {
        function RouteMatch(recognizer, matchedUrl, unmatchedUrl) {
          var p = arguments[3] !== (void 0) ? arguments[3] : null;
          this.recognizer = recognizer;
          this.matchedUrl = matchedUrl;
          this.unmatchedUrl = unmatchedUrl;
          this._paramsParsed = false;
          this._params = isPresent(p) ? p : StringMapWrapper.create();
        }
        return ($traceurRuntime.createClass)(RouteMatch, {params: function() {
            var $__0 = this;
            if (!this._paramsParsed) {
              this._paramsParsed = true;
              StringMapWrapper.forEach(this.recognizer.parseParams(this.matchedUrl), (function(value, key) {
                StringMapWrapper.set($__0._params, key, value);
              }));
            }
            return this._params;
          }}, {});
      }());
      $__export("RouteMatch", RouteMatch);
    }
  };
});

System.register("angular2/src/router/router", ["angular2/src/facade/async", "angular2/src/facade/collection", "angular2/src/facade/lang", "angular2/src/router/route_lifecycle_reflector"], function($__export) {
  "use strict";
  var __moduleName = "angular2/src/router/router";
  var PromiseWrapper,
      EventEmitter,
      ObservableWrapper,
      ListWrapper,
      isBlank,
      isString,
      StringWrapper,
      isPresent,
      BaseException,
      getCanActivateHook,
      _resolveToTrue,
      _resolveToFalse,
      Router,
      RootRouter,
      ChildRouter,
      SLASH;
  function splitAndFlattenLinkParams(linkParams) {
    return ListWrapper.reduce(linkParams, (function(accumulation, item) {
      if (isString(item)) {
        return ListWrapper.concat(accumulation, StringWrapper.split(item, SLASH));
      }
      accumulation.push(item);
      return accumulation;
    }), []);
  }
  function canActivateOne(nextInstruction, currentInstruction) {
    var next = _resolveToTrue;
    if (isPresent(nextInstruction.child)) {
      next = canActivateOne(nextInstruction.child, isPresent(currentInstruction) ? currentInstruction.child : null);
    }
    return next.then((function(res) {
      if (res == false) {
        return false;
      }
      if (nextInstruction.reuse) {
        return true;
      }
      var hook = getCanActivateHook(nextInstruction.component);
      if (isPresent(hook)) {
        return hook(nextInstruction, currentInstruction);
      }
      return true;
    }));
  }
  return {
    setters: [function($__m) {
      PromiseWrapper = $__m.PromiseWrapper;
      EventEmitter = $__m.EventEmitter;
      ObservableWrapper = $__m.ObservableWrapper;
    }, function($__m) {
      ListWrapper = $__m.ListWrapper;
    }, function($__m) {
      isBlank = $__m.isBlank;
      isString = $__m.isString;
      StringWrapper = $__m.StringWrapper;
      isPresent = $__m.isPresent;
      BaseException = $__m.BaseException;
    }, function($__m) {
      getCanActivateHook = $__m.getCanActivateHook;
    }],
    execute: function() {
      _resolveToTrue = PromiseWrapper.resolve(true);
      _resolveToFalse = PromiseWrapper.resolve(false);
      Router = (function() {
        function Router(registry, _pipeline, parent, hostComponent) {
          this.registry = registry;
          this._pipeline = _pipeline;
          this.parent = parent;
          this.hostComponent = hostComponent;
          this.navigating = false;
          this._currentInstruction = null;
          this._currentNavigation = _resolveToTrue;
          this._outlet = null;
          this._subject = new EventEmitter();
        }
        return ($traceurRuntime.createClass)(Router, {
          childRouter: function(hostComponent) {
            return new ChildRouter(this, hostComponent);
          },
          registerOutlet: function(outlet) {
            this._outlet = outlet;
            if (isPresent(this._currentInstruction)) {
              return outlet.commit(this._currentInstruction);
            }
            return _resolveToTrue;
          },
          config: function(definitions) {
            var $__0 = this;
            definitions.forEach((function(routeDefinition) {
              $__0.registry.config($__0.hostComponent, routeDefinition, $__0 instanceof RootRouter);
            }));
            return this.renavigate();
          },
          navigate: function(url) {
            var _skipLocationChange = arguments[1] !== (void 0) ? arguments[1] : false;
            var $__0 = this;
            return this._currentNavigation = this._currentNavigation.then((function(_) {
              $__0.lastNavigationAttempt = url;
              $__0._startNavigating();
              return $__0._afterPromiseFinishNavigating($__0.recognize(url).then((function(matchedInstruction) {
                if (isBlank(matchedInstruction)) {
                  return false;
                }
                return $__0._reuse(matchedInstruction).then((function(_) {
                  return $__0._canActivate(matchedInstruction);
                })).then((function(result) {
                  if (!result) {
                    return false;
                  }
                  return $__0._canDeactivate(matchedInstruction).then((function(result) {
                    if (result) {
                      return $__0.commit(matchedInstruction, _skipLocationChange).then((function(_) {
                        $__0._emitNavigationFinish(matchedInstruction.accumulatedUrl);
                        return true;
                      }));
                    }
                  }));
                }));
              })));
            }));
          },
          _emitNavigationFinish: function(url) {
            ObservableWrapper.callNext(this._subject, url);
          },
          _afterPromiseFinishNavigating: function(promise) {
            var $__0 = this;
            return PromiseWrapper.catchError(promise.then((function(_) {
              return $__0._finishNavigating();
            })), (function(err) {
              $__0._finishNavigating();
              throw err;
            }));
          },
          _reuse: function(instruction) {
            var $__0 = this;
            if (isBlank(this._outlet)) {
              return _resolveToFalse;
            }
            return this._outlet.canReuse(instruction).then((function(result) {
              instruction.reuse = result;
              if (isPresent($__0._outlet.childRouter) && isPresent(instruction.child)) {
                return $__0._outlet.childRouter._reuse(instruction.child);
              }
            }));
          },
          _canActivate: function(instruction) {
            return canActivateOne(instruction, this._currentInstruction);
          },
          _canDeactivate: function(instruction) {
            var $__0 = this;
            if (isBlank(this._outlet)) {
              return _resolveToTrue;
            }
            var next;
            if (isPresent(instruction) && instruction.reuse) {
              next = _resolveToTrue;
            } else {
              next = this._outlet.canDeactivate(instruction);
            }
            return next.then((function(result) {
              if (result == false) {
                return false;
              }
              if (isPresent($__0._outlet.childRouter)) {
                return $__0._outlet.childRouter._canDeactivate(isPresent(instruction) ? instruction.child : null);
              }
              return true;
            }));
          },
          commit: function(instruction) {
            var _skipLocationChange = arguments[1] !== (void 0) ? arguments[1] : false;
            this._currentInstruction = instruction;
            if (isPresent(this._outlet)) {
              return this._outlet.commit(instruction);
            }
            return _resolveToTrue;
          },
          _startNavigating: function() {
            this.navigating = true;
          },
          _finishNavigating: function() {
            this.navigating = false;
          },
          subscribe: function(onNext) {
            ObservableWrapper.subscribe(this._subject, onNext);
          },
          deactivate: function(instruction) {
            if (isPresent(this._outlet)) {
              return this._outlet.deactivate(instruction);
            }
            return _resolveToTrue;
          },
          recognize: function(url) {
            return this.registry.recognize(url, this.hostComponent);
          },
          renavigate: function() {
            if (isBlank(this.lastNavigationAttempt)) {
              return this._currentNavigation;
            }
            return this.navigate(this.lastNavigationAttempt);
          },
          generate: function(linkParams) {
            var normalizedLinkParams = splitAndFlattenLinkParams(linkParams);
            var first = ListWrapper.first(normalizedLinkParams);
            var rest = ListWrapper.slice(normalizedLinkParams, 1);
            var router = this;
            if (first == '') {
              while (isPresent(router.parent)) {
                router = router.parent;
              }
            } else if (first == '..') {
              router = router.parent;
              while (ListWrapper.first(rest) == '..') {
                rest = ListWrapper.slice(rest, 1);
                router = router.parent;
                if (isBlank(router)) {
                  throw new BaseException(("Link \"" + ListWrapper.toJSON(linkParams) + "\" has too many \"../\" segments."));
                }
              }
            } else if (first != '.') {
              throw new BaseException(("Link \"" + ListWrapper.toJSON(linkParams) + "\" must start with \"/\", \"./\", or \"../\""));
            }
            if (rest[rest.length - 1] == '') {
              ListWrapper.removeLast(rest);
            }
            if (rest.length < 1) {
              var msg = ("Link \"" + ListWrapper.toJSON(linkParams) + "\" must include a route name.");
              throw new BaseException(msg);
            }
            var url = '';
            if (isPresent(router.parent) && isPresent(router.parent._currentInstruction)) {
              url = router.parent._currentInstruction.capturedUrl;
            }
            return url + '/' + this.registry.generate(rest, router.hostComponent);
          }
        }, {});
      }());
      $__export("Router", Router);
      RootRouter = (function($__super) {
        function RootRouter(registry, pipeline, location, hostComponent) {
          var $__0;
          $traceurRuntime.superConstructor(RootRouter).call(this, registry, pipeline, null, hostComponent);
          this._location = location;
          this._location.subscribe(($__0 = this, function(change) {
            return $__0.navigate(change['url'], isPresent(change['pop']));
          }));
          this.registry.configFromComponent(hostComponent, true);
          this.navigate(location.path());
        }
        return ($traceurRuntime.createClass)(RootRouter, {commit: function(instruction) {
            var _skipLocationChange = arguments[1] !== (void 0) ? arguments[1] : false;
            var $__0 = this;
            var promise = $traceurRuntime.superGet(this, RootRouter.prototype, "commit").call(this, instruction);
            if (!_skipLocationChange) {
              promise = promise.then((function(_) {
                $__0._location.go(instruction.accumulatedUrl);
              }));
            }
            return promise;
          }}, {}, $__super);
      }(Router));
      $__export("RootRouter", RootRouter);
      ChildRouter = (function($__super) {
        function ChildRouter(parent, hostComponent) {
          $traceurRuntime.superConstructor(ChildRouter).call(this, parent.registry, parent._pipeline, parent, hostComponent);
          this.parent = parent;
        }
        return ($traceurRuntime.createClass)(ChildRouter, {navigate: function(url) {
            var _skipLocationChange = arguments[1] !== (void 0) ? arguments[1] : false;
            return this.parent.navigate(url, _skipLocationChange);
          }}, {}, $__super);
      }(Router));
      SLASH = new RegExp('/');
    }
  };
});

System.register("angular2/src/router/route_registry", ["angular2/src/router/route_recognizer", "angular2/src/router/instruction", "angular2/src/facade/collection", "angular2/src/facade/async", "angular2/src/facade/lang", "angular2/src/router/route_config_impl", "angular2/src/reflection/reflection", "angular2/di", "angular2/src/router/route_config_nomalizer"], function($__export) {
  "use strict";
  var __moduleName = "angular2/src/router/route_registry";
  var __decorate,
      __metadata,
      RouteRecognizer,
      Instruction,
      ListWrapper,
      Map,
      PromiseWrapper,
      isPresent,
      isBlank,
      isType,
      isString,
      isStringMap,
      BaseException,
      getTypeNameForDebugging,
      RouteConfig,
      Route,
      reflector,
      Injectable,
      normalizeRouteConfig,
      RouteRegistry;
  function mostSpecific(instructions) {
    var mostSpecificSolution = instructions[0];
    for (var solutionIndex = 1; solutionIndex < instructions.length; solutionIndex++) {
      var solution = instructions[solutionIndex];
      if (solution.specificity > mostSpecificSolution.specificity) {
        mostSpecificSolution = solution;
      }
    }
    return mostSpecificSolution;
  }
  function assertTerminalComponent(component, path) {
    if (!isType(component)) {
      return ;
    }
    var annotations = reflector.annotations(component);
    if (isPresent(annotations)) {
      for (var i = 0; i < annotations.length; i++) {
        var annotation = annotations[i];
        if (annotation instanceof RouteConfig) {
          throw new BaseException(("Child routes are not allowed for \"" + path + "\". Use \"...\" on the parent's route path."));
        }
      }
    }
  }
  return {
    setters: [function($__m) {
      RouteRecognizer = $__m.RouteRecognizer;
    }, function($__m) {
      Instruction = $__m.Instruction;
    }, function($__m) {
      ListWrapper = $__m.ListWrapper;
      Map = $__m.Map;
    }, function($__m) {
      PromiseWrapper = $__m.PromiseWrapper;
    }, function($__m) {
      isPresent = $__m.isPresent;
      isBlank = $__m.isBlank;
      isType = $__m.isType;
      isString = $__m.isString;
      isStringMap = $__m.isStringMap;
      BaseException = $__m.BaseException;
      getTypeNameForDebugging = $__m.getTypeNameForDebugging;
    }, function($__m) {
      RouteConfig = $__m.RouteConfig;
      Route = $__m.Route;
    }, function($__m) {
      reflector = $__m.reflector;
    }, function($__m) {
      Injectable = $__m.Injectable;
    }, function($__m) {
      normalizeRouteConfig = $__m.normalizeRouteConfig;
    }],
    execute: function() {
      __decorate = (this && this.__decorate) || function(decorators, target, key, desc) {
        if (typeof Reflect === "object" && typeof Reflect.decorate === "function")
          return Reflect.decorate(decorators, target, key, desc);
        switch (arguments.length) {
          case 2:
            return decorators.reduceRight(function(o, d) {
              return (d && d(o)) || o;
            }, target);
          case 3:
            return decorators.reduceRight(function(o, d) {
              return (d && d(target, key)), void 0;
            }, void 0);
          case 4:
            return decorators.reduceRight(function(o, d) {
              return (d && d(target, key, o)) || o;
            }, desc);
        }
      };
      __metadata = (this && this.__metadata) || function(k, v) {
        if (typeof Reflect === "object" && typeof Reflect.metadata === "function")
          return Reflect.metadata(k, v);
      };
      RouteRegistry = (($traceurRuntime.createClass)(function() {
        this._rules = new Map();
      }, {
        config: function(parentComponent, config) {
          var isRootLevelRoute = arguments[2] !== (void 0) ? arguments[2] : false;
          config = normalizeRouteConfig(config);
          var recognizer = this._rules.get(parentComponent);
          if (isBlank(recognizer)) {
            recognizer = new RouteRecognizer(isRootLevelRoute);
            this._rules.set(parentComponent, recognizer);
          }
          var terminal = recognizer.config(config);
          if (config instanceof Route) {
            if (terminal) {
              assertTerminalComponent(config.component, config.path);
            } else {
              this.configFromComponent(config.component);
            }
          }
        },
        configFromComponent: function(component) {
          var isRootComponent = arguments[1] !== (void 0) ? arguments[1] : false;
          var $__0 = this;
          if (!isType(component)) {
            return ;
          }
          if (this._rules.has(component)) {
            return ;
          }
          var annotations = reflector.annotations(component);
          if (isPresent(annotations)) {
            for (var i = 0; i < annotations.length; i++) {
              var annotation = annotations[i];
              if (annotation instanceof RouteConfig) {
                ListWrapper.forEach(annotation.configs, (function(config) {
                  return $__0.config(component, config, isRootComponent);
                }));
              }
            }
          }
        },
        recognize: function(url, parentComponent) {
          var $__0 = this;
          var componentRecognizer = this._rules.get(parentComponent);
          if (isBlank(componentRecognizer)) {
            return PromiseWrapper.resolve(null);
          }
          var possibleMatches = componentRecognizer.recognize(url);
          var matchPromises = ListWrapper.map(possibleMatches, (function(candidate) {
            return $__0._completeRouteMatch(candidate);
          }));
          return PromiseWrapper.all(matchPromises).then((function(solutions) {
            var fullSolutions = ListWrapper.filter(solutions, (function(solution) {
              return isPresent(solution);
            }));
            if (fullSolutions.length > 0) {
              return mostSpecific(fullSolutions);
            }
            return null;
          }));
        },
        _completeRouteMatch: function(partialMatch) {
          var $__0 = this;
          var recognizer = partialMatch.recognizer;
          var handler = recognizer.handler;
          return handler.resolveComponentType().then((function(componentType) {
            $__0.configFromComponent(componentType);
            if (partialMatch.unmatchedUrl.length == 0) {
              if (recognizer.terminal) {
                return new Instruction(componentType, partialMatch.matchedUrl, recognizer, null, partialMatch.params());
              } else {
                return null;
              }
            }
            return $__0.recognize(partialMatch.unmatchedUrl, componentType).then((function(childInstruction) {
              if (isBlank(childInstruction)) {
                return null;
              } else {
                return new Instruction(componentType, partialMatch.matchedUrl, recognizer, childInstruction);
              }
            }));
          }));
        },
        generate: function(linkParams, parentComponent) {
          var url = '';
          var componentCursor = parentComponent;
          for (var i = 0; i < linkParams.length; i += 1) {
            var segment = linkParams[i];
            if (isBlank(componentCursor)) {
              throw new BaseException(("Could not find route named \"" + segment + "\"."));
            }
            if (!isString(segment)) {
              throw new BaseException(("Unexpected segment \"" + segment + "\" in link DSL. Expected a string."));
            } else if (segment == '' || segment == '.' || segment == '..') {
              throw new BaseException(("\"" + segment + "/\" is only allowed at the beginning of a link DSL."));
            }
            var params = null;
            if (i + 1 < linkParams.length) {
              var nextSegment = linkParams[i + 1];
              if (isStringMap(nextSegment)) {
                params = nextSegment;
                i += 1;
              }
            }
            var componentRecognizer = this._rules.get(componentCursor);
            if (isBlank(componentRecognizer)) {
              throw new BaseException(("Component \"" + getTypeNameForDebugging(componentCursor) + "\" has no route config."));
            }
            var response = componentRecognizer.generate(segment, params);
            if (isBlank(response)) {
              throw new BaseException(("Component \"" + getTypeNameForDebugging(componentCursor) + "\" has no route named \"" + segment + "\"."));
            }
            url += response['url'];
            componentCursor = response['nextComponent'];
          }
          return url;
        }
      }, {}));
      $__export("RouteRegistry", RouteRegistry);
      $__export("RouteRegistry", RouteRegistry = __decorate([Injectable(), __metadata('design:paramtypes', [])], RouteRegistry));
    }
  };
});

System.register("angular2/src/router/router_outlet", ["angular2/src/facade/async", "angular2/src/facade/collection", "angular2/src/facade/lang", "angular2/src/core/annotations/decorators", "angular2/core", "angular2/di", "angular2/src/router/router", "angular2/src/router/instruction", "angular2/src/router/lifecycle_annotations", "angular2/src/router/route_lifecycle_reflector"], function($__export) {
  "use strict";
  var __moduleName = "angular2/src/router/router_outlet";
  var __decorate,
      __metadata,
      __param,
      PromiseWrapper,
      StringMapWrapper,
      isBlank,
      isPresent,
      Directive,
      Attribute,
      DynamicComponentLoader,
      ElementRef,
      Injector,
      bind,
      routerMod,
      RouteParams,
      hookMod,
      hasLifecycleHook,
      RouterOutlet;
  return {
    setters: [function($__m) {
      PromiseWrapper = $__m.PromiseWrapper;
    }, function($__m) {
      StringMapWrapper = $__m.StringMapWrapper;
    }, function($__m) {
      isBlank = $__m.isBlank;
      isPresent = $__m.isPresent;
    }, function($__m) {
      Directive = $__m.Directive;
      Attribute = $__m.Attribute;
    }, function($__m) {
      DynamicComponentLoader = $__m.DynamicComponentLoader;
      ElementRef = $__m.ElementRef;
    }, function($__m) {
      Injector = $__m.Injector;
      bind = $__m.bind;
    }, function($__m) {
      routerMod = $__m;
    }, function($__m) {
      RouteParams = $__m.RouteParams;
    }, function($__m) {
      hookMod = $__m;
    }, function($__m) {
      hasLifecycleHook = $__m.hasLifecycleHook;
    }],
    execute: function() {
      __decorate = (this && this.__decorate) || function(decorators, target, key, desc) {
        if (typeof Reflect === "object" && typeof Reflect.decorate === "function")
          return Reflect.decorate(decorators, target, key, desc);
        switch (arguments.length) {
          case 2:
            return decorators.reduceRight(function(o, d) {
              return (d && d(o)) || o;
            }, target);
          case 3:
            return decorators.reduceRight(function(o, d) {
              return (d && d(target, key)), void 0;
            }, void 0);
          case 4:
            return decorators.reduceRight(function(o, d) {
              return (d && d(target, key, o)) || o;
            }, desc);
        }
      };
      __metadata = (this && this.__metadata) || function(k, v) {
        if (typeof Reflect === "object" && typeof Reflect.metadata === "function")
          return Reflect.metadata(k, v);
      };
      __param = (this && this.__param) || function(paramIndex, decorator) {
        return function(target, key) {
          decorator(target, key, paramIndex);
        };
      };
      RouterOutlet = (($traceurRuntime.createClass)(function(_elementRef, _loader, _parentRouter, nameAttr) {
        this._elementRef = _elementRef;
        this._loader = _loader;
        this._parentRouter = _parentRouter;
        this.childRouter = null;
        this._componentRef = null;
        this._currentInstruction = null;
        this._parentRouter.registerOutlet(this);
      }, {
        commit: function(instruction) {
          var $__0 = this;
          var next;
          if (instruction.reuse) {
            next = this._reuse(instruction);
          } else {
            next = this.deactivate(instruction).then((function(_) {
              return $__0._activate(instruction);
            }));
          }
          return next.then((function(_) {
            return $__0._commitChild(instruction);
          }));
        },
        _commitChild: function(instruction) {
          if (isPresent(this.childRouter)) {
            return this.childRouter.commit(instruction.child);
          } else {
            return PromiseWrapper.resolve(true);
          }
        },
        _activate: function(instruction) {
          var $__0 = this;
          var previousInstruction = this._currentInstruction;
          this._currentInstruction = instruction;
          this.childRouter = this._parentRouter.childRouter(instruction.component);
          var bindings = Injector.resolve([bind(RouteParams).toValue(new RouteParams(instruction.params())), bind(routerMod.Router).toValue(this.childRouter)]);
          return this._loader.loadNextToLocation(instruction.component, this._elementRef, bindings).then((function(componentRef) {
            $__0._componentRef = componentRef;
            if (hasLifecycleHook(hookMod.onActivate, instruction.component)) {
              return $__0._componentRef.instance.onActivate(instruction, previousInstruction);
            }
          }));
        },
        canDeactivate: function(nextInstruction) {
          if (isBlank(this._currentInstruction)) {
            return PromiseWrapper.resolve(true);
          }
          if (hasLifecycleHook(hookMod.canDeactivate, this._currentInstruction.component)) {
            return PromiseWrapper.resolve(this._componentRef.instance.canDeactivate(nextInstruction, this._currentInstruction));
          }
          return PromiseWrapper.resolve(true);
        },
        canReuse: function(nextInstruction) {
          var result;
          if (isBlank(this._currentInstruction) || this._currentInstruction.component != nextInstruction.component) {
            result = false;
          } else if (hasLifecycleHook(hookMod.canReuse, this._currentInstruction.component)) {
            result = this._componentRef.instance.canReuse(nextInstruction, this._currentInstruction);
          } else {
            result = nextInstruction == this._currentInstruction || StringMapWrapper.equals(nextInstruction.params(), this._currentInstruction.params());
          }
          return PromiseWrapper.resolve(result);
        },
        _reuse: function(instruction) {
          var previousInstruction = this._currentInstruction;
          this._currentInstruction = instruction;
          return PromiseWrapper.resolve(hasLifecycleHook(hookMod.onReuse, this._currentInstruction.component) ? this._componentRef.instance.onReuse(instruction, previousInstruction) : true);
        },
        deactivate: function(nextInstruction) {
          var $__0 = this;
          return (isPresent(this.childRouter) ? this.childRouter.deactivate(isPresent(nextInstruction) ? nextInstruction.child : null) : PromiseWrapper.resolve(true)).then((function(_) {
            if (isPresent($__0._componentRef) && isPresent($__0._currentInstruction) && hasLifecycleHook(hookMod.onDeactivate, $__0._currentInstruction.component)) {
              return $__0._componentRef.instance.onDeactivate(nextInstruction, $__0._currentInstruction);
            }
          })).then((function(_) {
            if (isPresent($__0._componentRef)) {
              $__0._componentRef.dispose();
              $__0._componentRef = null;
            }
          }));
        }
      }, {}));
      $__export("RouterOutlet", RouterOutlet);
      $__export("RouterOutlet", RouterOutlet = __decorate([Directive({selector: 'router-outlet'}), __param(3, Attribute('name')), __metadata('design:paramtypes', [ElementRef, DynamicComponentLoader, routerMod.Router, String])], RouterOutlet));
    }
  };
});

System.register("angular2/router", ["angular2/src/router/router", "angular2/src/router/router_outlet", "angular2/src/router/router_link", "angular2/src/router/instruction", "angular2/src/router/route_registry", "angular2/src/router/location_strategy", "angular2/src/router/hash_location_strategy", "angular2/src/router/html5_location_strategy", "angular2/src/router/location", "angular2/src/router/pipeline", "angular2/src/router/route_config_decorator", "angular2/src/router/route_definition", "angular2/src/router/lifecycle_annotations", "angular2/src/core/application_tokens", "angular2/di", "angular2/src/facade/lang"], function($__export) {
  "use strict";
  var __moduleName = "angular2/router";
  var LocationStrategy,
      HTML5LocationStrategy,
      Router,
      RootRouter,
      RouterOutlet,
      RouterLink,
      RouteRegistry,
      Pipeline,
      Location,
      appComponentTypeToken,
      bind,
      CONST_EXPR,
      routerDirectives,
      routerInjectables;
  var $__exportNames = {
    routerDirectives: true,
    routerInjectables: true,
    undefined: true
  };
  var $__exportNames = {
    routerDirectives: true,
    routerInjectables: true,
    undefined: true
  };
  return {
    setters: [function($__m) {
      Router = $__m.Router;
      RootRouter = $__m.RootRouter;
      $__export("Router", $__m.Router);
      $__export("RootRouter", $__m.RootRouter);
    }, function($__m) {
      RouterOutlet = $__m.RouterOutlet;
      $__export("RouterOutlet", $__m.RouterOutlet);
    }, function($__m) {
      RouterLink = $__m.RouterLink;
      $__export("RouterLink", $__m.RouterLink);
    }, function($__m) {
      $__export("RouteParams", $__m.RouteParams);
      $__export("Instruction", $__m.Instruction);
    }, function($__m) {
      RouteRegistry = $__m.RouteRegistry;
      $__export("RouteRegistry", $__m.RouteRegistry);
    }, function($__m) {
      LocationStrategy = $__m.LocationStrategy;
      $__export("LocationStrategy", $__m.LocationStrategy);
    }, function($__m) {
      $__export("HashLocationStrategy", $__m.HashLocationStrategy);
    }, function($__m) {
      HTML5LocationStrategy = $__m.HTML5LocationStrategy;
      $__export("HTML5LocationStrategy", $__m.HTML5LocationStrategy);
    }, function($__m) {
      Location = $__m.Location;
      $__export("Location", $__m.Location);
      $__export("appBaseHrefToken", $__m.appBaseHrefToken);
    }, function($__m) {
      Pipeline = $__m.Pipeline;
      $__export("Pipeline", $__m.Pipeline);
    }, function($__m) {
      Object.keys($__m).forEach(function(p) {
        if (!$__exportNames[p])
          $__export(p, $__m[p]);
      });
    }, function($__m) {
      Object.keys($__m).forEach(function(p) {
        if (!$__exportNames[p])
          $__export(p, $__m[p]);
      });
    }, function($__m) {
      $__export("CanActivate", $__m.CanActivate);
    }, function($__m) {
      appComponentTypeToken = $__m.appComponentTypeToken;
    }, function($__m) {
      bind = $__m.bind;
    }, function($__m) {
      CONST_EXPR = $__m.CONST_EXPR;
    }],
    execute: function() {
      routerDirectives = CONST_EXPR([RouterOutlet, RouterLink]);
      $__export("routerDirectives", routerDirectives);
      routerInjectables = [RouteRegistry, Pipeline, bind(LocationStrategy).toClass(HTML5LocationStrategy), Location, bind(Router).toFactory((function(registry, pipeline, location, appRoot) {
        return new RootRouter(registry, pipeline, location, appRoot);
      }), [RouteRegistry, Pipeline, Location, appComponentTypeToken])];
      $__export("routerInjectables", routerInjectables);
    }
  };
});

//# sourceMappingURL=router.dev.js.map