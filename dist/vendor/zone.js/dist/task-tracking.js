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
 * A `TaskTrackingZoneSpec` allows one to track all outstanding Tasks.
 *
 * This is useful in tests. For example to see which tasks are preventing a test from completing
 * or an automated way of releasing all of the event listeners at the end of the test.
 */
var TaskTrackingZoneSpec = (function () {
    function TaskTrackingZoneSpec() {
        this.name = 'TaskTrackingZone';
        this.microTasks = [];
        this.macroTasks = [];
        this.eventTasks = [];
        this.properties = { 'TaskTrackingZone': this };
    }
    TaskTrackingZoneSpec.get = function () {
        return Zone.current.get('TaskTrackingZone');
    };
    TaskTrackingZoneSpec.prototype.getTasksFor = function (type) {
        switch (type) {
            case 'microTask':
                return this.microTasks;
            case 'macroTask':
                return this.macroTasks;
            case 'eventTask':
                return this.eventTasks;
        }
        throw new Error('Unknown task format: ' + type);
    };
    TaskTrackingZoneSpec.prototype.onScheduleTask = function (parentZoneDelegate, currentZone, targetZone, task) {
        task['creationLocation'] = new Error("Task '" + task.type + "' from '" + task.source + "'.");
        var tasks = this.getTasksFor(task.type);
        tasks.push(task);
        return parentZoneDelegate.scheduleTask(targetZone, task);
    };
    TaskTrackingZoneSpec.prototype.onCancelTask = function (parentZoneDelegate, currentZone, targetZone, task) {
        var tasks = this.getTasksFor(task.type);
        for (var i = 0; i < tasks.length; i++) {
            if (tasks[i] == task) {
                tasks.splice(i, 1);
                break;
            }
        }
        return parentZoneDelegate.cancelTask(targetZone, task);
    };
    TaskTrackingZoneSpec.prototype.onInvokeTask = function (parentZoneDelegate, currentZone, targetZone, task, applyThis, applyArgs) {
        if (task.type === 'eventTask')
            return parentZoneDelegate.invokeTask(targetZone, task, applyThis, applyArgs);
        var tasks = this.getTasksFor(task.type);
        for (var i = 0; i < tasks.length; i++) {
            if (tasks[i] == task) {
                tasks.splice(i, 1);
                break;
            }
        }
        return parentZoneDelegate.invokeTask(targetZone, task, applyThis, applyArgs);
    };
    TaskTrackingZoneSpec.prototype.clearEvents = function () {
        while (this.eventTasks.length) {
            Zone.current.cancelTask(this.eventTasks[0]);
        }
    };
    return TaskTrackingZoneSpec;
}());
// Export the class so that new instances can be created with proper
// constructor params.
Zone['TaskTrackingZoneSpec'] = TaskTrackingZoneSpec;

})));
