#!/usr/bin/env node
"use strict";
require("reflect-metadata");
var tsc = require("@angular/tsc-wrapped");
var extractor_1 = require("./extractor");
function extract(ngOptions, cliOptions, program, host) {
    return extractor_1.Extractor.create(ngOptions, program, host, cliOptions.locale)
        .extract(cliOptions.i18nFormat, cliOptions.outFile);
}
// Entry point
if (require.main === module) {
    var args = require('minimist')(process.argv.slice(2));
    var project = args.p || args.project || '.';
    var cliOptions = new tsc.I18nExtractionCliOptions(args);
    tsc.main(project, cliOptions, extract, { noEmit: true })
        .then(function (exitCode) { return process.exit(exitCode); })
        .catch(function (e) {
        console.error(e.stack);
        console.error('Extraction failed');
        process.exit(1);
    });
}
//# sourceMappingURL=extract_i18n.js.map