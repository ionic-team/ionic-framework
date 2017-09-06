(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    /**
     * @hidden
     */
    var QueryParams = (function () {
        function QueryParams() {
            this.data = {};
        }
        /**
         * @param {?} url
         * @return {?}
         */
        QueryParams.prototype.parseUrl = function (url) {
            if (url) {
                var /** @type {?} */ startIndex = url.indexOf('?');
                if (startIndex > -1) {
                    var /** @type {?} */ queries = url.slice(startIndex + 1).split('&');
                    for (var /** @type {?} */ i = 0; i < queries.length; i++) {
                        if (queries[i].indexOf('=') > 0) {
                            var /** @type {?} */ split = queries[i].split('=');
                            if (split.length > 1) {
                                this.data[split[0].toLowerCase()] = split[1].split('#')[0];
                            }
                        }
                    }
                }
            }
        };
        /**
         * @param {?} key
         * @return {?}
         */
        QueryParams.prototype.get = function (key) {
            return this.data[key.toLowerCase()];
        };
        return QueryParams;
    }());
    exports.QueryParams = QueryParams;
    function QueryParams_tsickle_Closure_declarations() {
        /** @type {?} */
        QueryParams.prototype.data;
    }
});
//# sourceMappingURL=query-params.js.map