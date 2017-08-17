/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
"use strict";
function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
var compiler_host_1 = require("./src/compiler_host");
exports.MetadataWriterHost = compiler_host_1.MetadataWriterHost;
var main_1 = require("./src/main");
exports.UserError = main_1.UserError;
exports.main = main_1.main;
__export(require("./src/bundler"));
__export(require("./src/cli_options"));
__export(require("./src/collector"));
__export(require("./src/index_writer"));
__export(require("./src/schema"));
//# sourceMappingURL=index.js.map