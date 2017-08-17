#!/usr/bin/env node
"use strict";
require("reflect-metadata");
var tsc = require("@angular/tsc-wrapped");
var compiler_1 = require("@angular/compiler");
var codegen_1 = require("./codegen");
function codegen(ngOptions, cliOptions, program, host) {
    return codegen_1.CodeGenerator.create(ngOptions, cliOptions, program, host).codegen();
}
function main(args, consoleError) {
    if (consoleError === void 0) { consoleError = console.error; }
    var project = args.p || args.project || '.';
    var cliOptions = new tsc.NgcCliOptions(args);
    return tsc.main(project, cliOptions, codegen).then(function () { return 0; }).catch(function (e) {
        if (e instanceof tsc.UserError || compiler_1.isSyntaxError(e)) {
            consoleError(e.message);
            return Promise.resolve(1);
        }
        else {
            consoleError(e.stack);
            consoleError('Compilation failed');
            return Promise.resolve(1);
        }
    });
}
exports.main = main;
// CLI entry point
if (require.main === module) {
    var args = require('minimist')(process.argv.slice(2));
    main(args).then(function (exitCode) { return process.exit(exitCode); });
}
//# sourceMappingURL=main.js.map