/*! Built with http://stenciljs.com */
const { h, Context } = window.App;

class GestureController {
    constructor() {
        this.gestureId = 0;
        this.requestedStart = new Map();
        this.disabledGestures = new Map();
        this.disabledScroll = new Set();
        this.capturedId = null;
    }
    createGesture(gestureName, gesturePriority, disableScroll) {
        return new GestureDelegate(this, this.newID(), gestureName, gesturePriority, disableScroll);
    }
    createBlocker(opts = {}) {
        return new BlockerDelegate(this.newID(), this, opts.disable, !!opts.disableScroll);
    }
    newID() {
        return this.gestureId++;
    }
    start(gestureName, id, priority) {
        if (!this.canStart(gestureName)) {
            this.requestedStart.delete(id);
            return false;
        }
        this.requestedStart.set(id, priority);
        return true;
    }
    capture(gestureName, id, priority) {
        if (!this.start(gestureName, id, priority)) {
            return false;
        }
        const requestedStart = this.requestedStart;
        let maxPriority = -10000;
        for (const value of requestedStart.values()) {
            maxPriority = Math.max(maxPriority, value);
        }
        if (maxPriority === priority) {
            this.capturedId = id;
            this.requestedStart.clear();
            return true;
        }
        requestedStart.delete(id);
        return false;
    }
    release(id) {
        this.requestedStart.delete(id);
        if (this.capturedId && id === this.capturedId) {
            this.capturedId = null;
        }
    }
    disableGesture(gestureName, id) {
        let set = this.disabledGestures.get(gestureName);
        if (!set) {
            set = new Set();
            this.disabledGestures.set(gestureName, set);
        }
        set.add(id);
    }
    enableGesture(gestureName, id) {
        const set = this.disabledGestures.get(gestureName);
        if (set) {
            set.delete(id);
        }
    }
    disableScroll(id) {
        // let isEnabled = !this.isScrollDisabled();
        this.disabledScroll.add(id);
        // if (this._app && isEnabled && this.isScrollDisabled()) {
        //   console.debug('GestureController: Disabling scrolling');
        //   this._app._setDisableScroll(true);
        // }
    }
    enableScroll(id) {
        // let isDisabled = this.isScrollDisabled();
        this.disabledScroll.delete(id);
        // if (this._app && isDisabled && !this.isScrollDisabled()) {
        //   console.debug('GestureController: Enabling scrolling');
        //   this._app._setDisableScroll(false);
        // }
    }
    canStart(gestureName) {
        if (this.capturedId) {
            // a gesture already captured
            return false;
        }
        if (this.isDisabled(gestureName)) {
            return false;
        }
        return true;
    }
    isCaptured() {
        return !!this.capturedId;
    }
    isScrollDisabled() {
        return this.disabledScroll.size > 0;
    }
    isDisabled(gestureName) {
        const disabled = this.disabledGestures.get(gestureName);
        if (disabled && disabled.size > 0) {
            return true;
        }
        return false;
    }
}
class GestureDelegate {
    constructor(ctrl, gestureDelegateId, name, priority, disableScroll) {
        this.gestureDelegateId = gestureDelegateId;
        this.name = name;
        this.priority = priority;
        this.disableScroll = disableScroll;
        this.ctrl = ctrl;
    }
    canStart() {
        if (!this.ctrl) {
            return false;
        }
        return this.ctrl.canStart(this.name);
    }
    start() {
        if (!this.ctrl) {
            return false;
        }
        return this.ctrl.start(this.name, this.gestureDelegateId, this.priority);
    }
    capture() {
        if (!this.ctrl) {
            return false;
        }
        const captured = this.ctrl.capture(this.name, this.gestureDelegateId, this.priority);
        if (captured && this.disableScroll) {
            this.ctrl.disableScroll(this.gestureDelegateId);
        }
        return captured;
    }
    release() {
        if (this.ctrl) {
            this.ctrl.release(this.gestureDelegateId);
            if (this.disableScroll) {
                this.ctrl.enableScroll(this.gestureDelegateId);
            }
        }
    }
    destroy() {
        this.release();
        this.ctrl = null;
    }
}
class BlockerDelegate {
    constructor(blockerDelegateId, ctrl, disable, disableScroll) {
        this.blockerDelegateId = blockerDelegateId;
        this.disable = disable;
        this.disableScroll = disableScroll;
        this.blocked = false;
        this.ctrl = ctrl;
    }
    block() {
        if (!this.ctrl) {
            return;
        }
        if (this.disable) {
            for (const gesture of this.disable) {
                this.ctrl.disableGesture(gesture, this.blockerDelegateId);
            }
        }
        if (this.disableScroll) {
            this.ctrl.disableScroll(this.blockerDelegateId);
        }
        this.blocked = true;
    }
    unblock() {
        if (!this.ctrl) {
            return;
        }
        if (this.disable) {
            for (const gesture of this.disable) {
                this.ctrl.enableGesture(gesture, this.blockerDelegateId);
            }
        }
        if (this.disableScroll) {
            this.ctrl.enableScroll(this.blockerDelegateId);
        }
        this.blocked = false;
    }
    destroy() {
        this.unblock();
        this.ctrl = null;
    }
}
const BLOCK_ALL = {
    disable: ['menu-swipe', 'goback-swipe'],
    disableScroll: true
};

export { GestureController, BLOCK_ALL };
