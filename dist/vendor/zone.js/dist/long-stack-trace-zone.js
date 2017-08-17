/**
* @license
* Copyright Google Inc. All Rights Reserved.
*
* Use of this source code is governed by an MIT-style license that can be
* found in the LICENSE file at https://angular.io/license
*/
(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? factory() :
	typeof define === 'function' && define.amd ? define(factory) :
	(factory());
}(this, (function () { 'use strict';

/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
/**
 * @fileoverview
 * @suppress {globalThis}
 */
var NEWLINE = '\n';
var IGNORE_FRAMES = {};
var creationTrace = '__creationTrace__';
var ERROR_TAG = 'STACKTRACE TRACKING';
var SEP_TAG = '__SEP_TAG__';
var sepTemplate = SEP_TAG + '@[native]';
var LongStackTrace = (function () {
    function LongStackTrace() {
        this.error = getStacktrace();
        this.timestamp = new Date();
    }
    return LongStackTrace;
}());
function getStacktraceWithUncaughtError() {
    return new Error(ERROR_TAG);
}
function getStacktraceWithCaughtError() {
    try {
        throw getStacktraceWithUncaughtError();
    }
    catch (err) {
        return err;
    }
}
// Some implementations of exception handling don't create a stack trace if the exception
// isn't thrown, however it's faster not to actually throw the exception.
var error = getStacktraceWithUncaughtError();
var caughtError = getStacktraceWithCaughtError();
var getStacktrace = error.stack ?
    getStacktraceWithUncaughtError :
    (caughtError.stack ? getStacktraceWithCaughtError : getStacktraceWithUncaughtError);
function getFrames(error) {
    return error.stack ? error.stack.split(NEWLINE) : [];
}
function addErrorStack(lines, error) {
    var trace = getFrames(error);
    for (var i = 0; i < trace.length; i++) {
        var frame = trace[i];
        // Filter out the Frames which are part of stack capturing.
        if (!IGNORE_FRAMES.hasOwnProperty(frame)) {
            lines.push(trace[i]);
        }
    }
}
function renderLongStackTrace(frames, stack) {
    var longTrace = [stack ? stack.trim() : ''];
    if (frames) {
        var timestamp = new Date().getTime();
        for (var i = 0; i < frames.length; i++) {
            var traceFrames = frames[i];
            var lastTime = traceFrames.timestamp;
            var separator = "____________________Elapsed " + (timestamp - lastTime.getTime()) + " ms; At: " + lastTime;
            separator = separator.replace(/[^\w\d]/g, '_');
            longTrace.push(sepTemplate.replace(SEP_TAG, separator));
            addErrorStack(longTrace, traceFrames.error);
            timestamp = lastTime.getTime();
        }
    }
    return longTrace.join(NEWLINE);
}
Zone['longStackTraceZoneSpec'] = {
    name: 'long-stack-trace',
    longStackTraceLimit: 10,
    // add a getLongStackTrace method in spec to
    // handle handled reject promise error.
    getLongStackTrace: function (error) {
        if (!error) {
            return undefined;
        }
        var task = error[Zone.__symbol__('currentTask')];
        var trace = task && task.data && task.data[creationTrace];
        if (!trace) {
            return error.stack;
        }
        return renderLongStackTrace(trace, error.stack);
    },
    onScheduleTask: function (parentZoneDelegate, currentZone, targetZone, task) {
        if (Error.stackTraceLimit > 0) {
            // if Error.stackTraceLimit is 0, means stack trace
            // is disabled, so we don't need to generate long stack trace
            // this will improve performance in some test(some test will
            // set stackTraceLimit to 0, https://github.com/angular/zone.js/issues/698
            var currentTask = Zone.currentTask;
            var trace = currentTask && currentTask.data && currentTask.data[creationTrace] || [];
            trace = [new LongStackTrace()].concat(trace);
            if (trace.length > this.longStackTraceLimit) {
                trace.length = this.longStackTraceLimit;
            }
            if (!task.data)
                task.data = {};
            task.data[creationTrace] = trace;
        }
        return parentZoneDelegate.scheduleTask(targetZone, task);
    },
    onHandleError: function (parentZoneDelegate, currentZone, targetZone, error) {
        if (Error.stackTraceLimit > 0) {
            // if Error.stackTraceLimit is 0, means stack trace
            // is disabled, so we don't need to generate long stack trace
            // this will improve performance in some test(some test will
            // set stackTraceLimit to 0, https://github.com/angular/zone.js/issues/698
            var parentTask = Zone.currentTask || error.task;
            if (error instanceof Error && parentTask) {
                var longStack = renderLongStackTrace(parentTask.data && parentTask.data[creationTrace], error.stack);
                try {
                    error.stack = error.longStack = longStack;
                }
                catch (err) {
                }
            }
        }
        return parentZoneDelegate.handleError(targetZone, error);
    }
};
function captureStackTraces(stackTraces, count) {
    if (count > 0) {
        stackTraces.push(getFrames((new LongStackTrace()).error));
        captureStackTraces(stackTraces, count - 1);
    }
}
function computeIgnoreFrames() {
    if (Error.stackTraceLimit <= 0) {
        return;
    }
    var frames = [];
    captureStackTraces(frames, 2);
    var frames1 = frames[0];
    var frames2 = frames[1];
    for (var i = 0; i < frames1.length; i++) {
        var frame1 = frames1[i];
        if (frame1.indexOf(ERROR_TAG) == -1) {
            var match = frame1.match(/^\s*at\s+/);
            if (match) {
                sepTemplate = match[0] + SEP_TAG + ' (http://localhost)';
                break;
            }
        }
    }
    for (var i = 0; i < frames1.length; i++) {
        var frame1 = frames1[i];
        var frame2 = frames2[i];
        if (frame1 === frame2) {
            IGNORE_FRAMES[frame1] = true;
        }
        else {
            break;
        }
    }
}
computeIgnoreFrames();

})));
