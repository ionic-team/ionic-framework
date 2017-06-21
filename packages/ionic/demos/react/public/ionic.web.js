(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? factory() :
	typeof define === 'function' && define.amd ? define(factory) :
	(factory());
}(this, (function () { 'use strict';

function isDef(s) { return s !== undefined && s !== null; }
function isUndef(s) { return s === undefined; }
const isArray = Array.isArray;
function isPrimitive(s) {
    return isString(s) || isNumber(s);
}

function isString(val) { return typeof val === 'string'; }
function isNumber(val) { return typeof val === 'number'; }
function toCamelCase(str) {
    return str.replace(/-([a-z])/g, (g) => g[1].toUpperCase());
}
function defineElements(win, elements) {
    const tags = Object.keys(elements);
    for (var i = 0, l = tags.length; i < l; i++) {
        win.customElements.define(tags[i], elements[tags[i]]);
    }
}

const $annotations = '$annotations';

const Component = function (opts) {
    return function (target) {
        if (opts) {
            const annotations = target[$annotations] = target[$annotations] || {};
            annotations.tag = opts.tag;
            annotations.styleUrl = opts.styleUrl;
        }
    };
};
const Prop = function (opts) {
    return function (target, propKey) {
        const annotations = target[$annotations] = target[$annotations] || {};
        annotations.props = annotations.props || {};
        annotations.props[propKey] = opts || {};
        annotations.obsAttrs = annotations.obsAttrs || [];
        annotations.obsAttrs.push(propKey);
    };
};

class Config {
    constructor(config) {
        this.c = config;
    }
    get(key, fallback = null) {
        if (key === 'mode') {
            return 'md';
        }
        return fallback;
    }
}

class PlatformClient {
    constructor(d) {
        this.d = d;
        this.css = {};
    }
    createElement(tagName) {
        return this.d.createElement(tagName);
    }
    createElementNS(namespaceURI, qualifiedName) {
        return this.d.createElementNS(namespaceURI, qualifiedName);
    }
    createTextNode(text) {
        return this.d.createTextNode(text);
    }
    createComment(text) {
        return this.d.createComment(text);
    }
    insertBefore(parentNode, newNode, referenceNode) {
        parentNode.insertBefore(newNode, referenceNode);
    }
    removeChild(node, child) {
        node.removeChild(child);
    }
    appendChild(node, child) {
        node.appendChild(child);
    }
    parentNode(node) {
        return node.parentNode;
    }
    nextSibling(node) {
        return node.nextSibling;
    }
    tag(elm) {
        return (elm.tagName || '').toLowerCase();
    }
    setTextContent(node, text) {
        node.textContent = text;
    }
    getTextContent(node) {
        return node.textContent;
    }
    getAttribute(elm, attrName) {
        return elm.getAttribute(attrName);
    }
    getProperty(node, propName) {
        return node[propName];
    }
    getPropOrAttr(elm, name) {
        const val = elm[toCamelCase(name)];
        return isDef(val) ? val : elm.getAttribute(name);
    }
    setStyle(elm, styleName, styleValue) {
        elm.style[toCamelCase(styleName)] = styleValue;
    }
    isElement(node) {
        return node.nodeType === 1;
    }
    isText(node) {
        return node.nodeType === 3;
    }
    isComment(node) {
        return node.nodeType === 8;
    }
    hasElementCss(tag) {
        return !!this.css[tag];
    }
    appendElementCss(tag, styleUrl) {
        this.css[tag] = true;
        if (styleUrl) {
            const cssId = `css-${tag}`;
            const head = this.d.getElementsByTagName('head')[0];
            if (!head.querySelector(`#${cssId}`)) {
                const linkEle = this.createElement('link');
                linkEle.id = cssId;
                linkEle.href = styleUrl;
                linkEle.rel = 'stylesheet';
                head.insertBefore(linkEle, head.firstChild);
            }
        }
    }
    nextTick(cb) {
        const obs = new MutationObserver(() => {
            cb && cb();
        });
        const textNode = this.createTextNode('');
        obs.observe(textNode, { characterData: true });
        textNode.data = '1';
    }
}

function vnode(sel, data, children, text, elm) {
    let key = data === undefined ? undefined : data.key;
    return { sel: sel, data: data, children: children,
        text: text, elm: elm, key: key };
}

const NamespaceURIs = {
    "xlink": "http://www.w3.org/1999/xlink"
};
const booleanAttrs = ["allowfullscreen", "async", "autofocus", "autoplay", "checked", "compact", "controls", "declare",
    "default", "defaultchecked", "defaultmuted", "defaultselected", "defer", "disabled", "draggable",
    "enabled", "formnovalidate", "hidden", "indeterminate", "inert", "ismap", "itemscope", "loop", "multiple",
    "muted", "nohref", "noresize", "noshade", "novalidate", "nowrap", "open", "pauseonexit", "readonly",
    "required", "reversed", "scoped", "seamless", "selected", "sortable", "spellcheck", "translate",
    "truespeed", "typemustmatch", "visible"];
const booleanAttrsDict = Object.create(null);
for (let i = 0, len = booleanAttrs.length; i < len; i++) {
    booleanAttrsDict[booleanAttrs[i]] = true;
}
function updateAttrs(oldVnode, vnode) {
    var key, cur, old, elm = vnode.elm, oldAttrs = oldVnode.data.attrs, attrs = vnode.data.attrs, namespaceSplit;
    if (!oldAttrs && !attrs)
        return;
    if (oldAttrs === attrs)
        return;
    oldAttrs = oldAttrs || {};
    attrs = attrs || {};
    // update modified attributes, add new attributes
    for (key in attrs) {
        cur = attrs[key];
        old = oldAttrs[key];
        if (old !== cur) {
            if (!cur && booleanAttrsDict[key])
                elm.removeAttribute(key);
            else {
                namespaceSplit = key.split(":");
                if (namespaceSplit.length > 1 && NamespaceURIs.hasOwnProperty(namespaceSplit[0]))
                    elm.setAttributeNS(NamespaceURIs[namespaceSplit[0]], key, cur);
                else
                    elm.setAttribute(key, cur);
            }
        }
    }
    //remove removed attributes
    // use `in` operator since the previous `for` iteration uses it (.i.e. add even attributes with undefined value)
    // the other option is to remove all attributes with value == undefined
    for (key in oldAttrs) {
        if (!(key in attrs)) {
            elm.removeAttribute(key);
        }
    }
}
const attributesModule = { create: updateAttrs, update: updateAttrs };

function updateClass(oldVnode, vnode) {
    var cur, name, elm = vnode.elm, oldClass = oldVnode.data.class, klass = vnode.data.class;
    if (!oldClass && !klass)
        return;
    if (oldClass === klass)
        return;
    oldClass = oldClass || {};
    klass = klass || {};
    for (name in oldClass) {
        if (!klass[name]) {
            elm.classList.remove(name);
        }
    }
    for (name in klass) {
        cur = klass[name];
        if (cur !== oldClass[name]) {
            elm.classList[cur ? 'add' : 'remove'](name);
        }
    }
}
const classModule = { create: updateClass, update: updateClass };

function invokeHandler(handler, vnode, event) {
    if (typeof handler === "function") {
        // call function handler
        handler.call(vnode, event, vnode);
    }
    else if (typeof handler === "object") {
        // call handler with arguments
        if (typeof handler[0] === "function") {
            // special case for single argument for performance
            if (handler.length === 2) {
                handler[0].call(vnode, handler[1], event, vnode);
            }
            else {
                var args = handler.slice(1);
                args.push(event);
                args.push(vnode);
                handler[0].apply(vnode, args);
            }
        }
        else {
            // call multiple handlers
            for (var i = 0; i < handler.length; i++) {
                invokeHandler(handler[i]);
            }
        }
    }
}
function handleEvent(event, vnode) {
    var name = event.type, on = vnode.data.on;
    // call event handler(s) if exists
    if (on && on[name]) {
        invokeHandler(on[name], vnode, event);
    }
}
function createListener() {
    return function handler(event) {
        handleEvent(event, handler.vnode);
    };
}
function updateEventListeners(oldVnode, vnode) {
    var oldOn = oldVnode.data.on, oldListener = oldVnode.listener, oldElm = oldVnode.elm, on = vnode && vnode.data.on, elm = (vnode && vnode.elm), name;
    // optimization for reused immutable handlers
    if (oldOn === on) {
        return;
    }
    // remove existing listeners which no longer used
    if (oldOn && oldListener) {
        // if element changed or deleted we remove all existing listeners unconditionally
        if (!on) {
            for (name in oldOn) {
                // remove listener if element was changed or existing listeners removed
                oldElm.removeEventListener(name, oldListener, false);
            }
        }
        else {
            for (name in oldOn) {
                // remove listener if existing listener removed
                if (!on[name]) {
                    oldElm.removeEventListener(name, oldListener, false);
                }
            }
        }
    }
    // add new listeners which has not already attached
    if (on) {
        // reuse existing listener or create new
        var listener = vnode.listener = oldVnode.listener || createListener();
        // update vnode for listener
        listener.vnode = vnode;
        // if element changed or added we add all needed listeners unconditionally
        if (!oldOn) {
            for (name in on) {
                // add listener if element was changed or new listeners added
                elm.addEventListener(name, listener, false);
            }
        }
        else {
            for (name in on) {
                // add listener if new listener added
                if (!oldOn[name]) {
                    elm.addEventListener(name, listener, false);
                }
            }
        }
    }
}
const eventListenersModule = {
    create: updateEventListeners,
    update: updateEventListeners,
    destroy: updateEventListeners
};

function updateStyle(oldVnode, vnode) {
    var cur, name, elm = vnode.elm, oldStyle = oldVnode.data.style, style = vnode.data.style;
    if (!oldStyle && !style)
        return;
    if (oldStyle === style)
        return;
    oldStyle = oldStyle || {};
    style = style || {};
    for (name in oldStyle) {
        if (!style[name]) {
            if (name[0] === '-' && name[1] === '-') {
                elm.style.removeProperty(name);
            }
            else {
                elm.style[name] = '';
            }
        }
    }
    for (name in style) {
        cur = style[name];
        if (name !== 'remove' && cur !== oldStyle[name]) {
            if (name[0] === '-' && name[1] === '-') {
                elm.style.setProperty(name, cur);
            }
            else {
                elm.style[name] = cur;
            }
        }
    }
}
function applyDestroyStyle(vnode) {
    var style, name, elm = vnode.elm, s = vnode.data.style;
    if (!s || !(style = s.destroy))
        return;
    for (name in style) {
        elm.style[name] = style[name];
    }
}
function applyRemoveStyle(vnode, rm) {
    var s = vnode.data.style;
    if (!s || !s.remove) {
        rm();
        return;
    }
    var name, elm = vnode.elm, i = 0, compStyle, style = s.remove, amount = 0, applied = [];
    for (name in style) {
        applied.push(name);
        elm.style[name] = style[name];
    }
    compStyle = getComputedStyle(elm);
    var props = compStyle['transition-property'].split(', ');
    for (; i < props.length; ++i) {
        if (applied.indexOf(props[i]) !== -1)
            amount++;
    }
    elm.addEventListener('transitionend', function (ev) {
        if (ev.target === elm)
            --amount;
        if (amount === 0)
            rm();
    });
}
const styleModule = {
    create: updateStyle,
    update: updateStyle,
    destroy: applyDestroyStyle,
    remove: applyRemoveStyle
};

function addNS(data, children, sel) {
    data.ns = 'http://www.w3.org/2000/svg';
    if (sel !== 'foreignObject' && children !== undefined) {
        for (let i = 0; i < children.length; ++i) {
            let childData = children[i].data;
            if (childData !== undefined) {
                addNS(childData, children[i].children, children[i].sel);
            }
        }
    }
}
function h(sel, b, c) {
    var data = {}, children, text, i;
    var elm = undefined;
    if (sel.nodeType) {
        elm = sel;
    }
    if (c !== undefined) {
        data = b;
        if (isArray(c)) {
            children = c;
        }
        else if (isPrimitive(c)) {
            text = c;
        }
        else if (c && c.sel) {
            children = [c];
        }
    }
    else if (b !== undefined) {
        if (isArray(b)) {
            children = b;
        }
        else if (isPrimitive(b)) {
            text = b;
        }
        else if (b && b.sel) {
            children = [b];
        }
        else {
            data = b;
        }
    }
    if (isArray(children)) {
        for (i = 0; i < children.length; ++i) {
            if (isPrimitive(children[i]))
                children[i] = vnode(undefined, undefined, undefined, children[i]);
        }
    }
    if (sel[0] === 's' && sel[1] === 'v' && sel[2] === 'g' &&
        (sel.length === 3 || sel[3] === '.' || sel[3] === '#')) {
        addNS(data, children, sel);
    }
    return vnode(sel, data, children, text, elm);
}

const emptyNode = vnode('', {}, [], undefined, undefined);
function sameVnode(vnode1, vnode2) {
    return vnode1.key === vnode2.key && vnode1.sel === vnode2.sel;
}
function isVnode(vnode$$1) {
    return vnode$$1.sel !== undefined || vnode$$1.elm !== undefined;
}
function createKeyToOldIdx(children, beginIdx, endIdx) {
    let i, map = {}, key, ch;
    for (i = beginIdx; i <= endIdx; ++i) {
        ch = children[i];
        if (ch != null) {
            key = ch.key;
            if (key !== undefined)
                map[key] = i;
        }
    }
    return map;
}
const hooks = ['create', 'update', 'remove', 'destroy', 'pre', 'post'];
function initRenderer(modules, api) {
    let i, j, cbs = {};
    for (i = 0; i < hooks.length; ++i) {
        cbs[hooks[i]] = [];
        for (j = 0; j < modules.length; ++j) {
            const hook = modules[j][hooks[i]];
            if (hook !== undefined) {
                cbs[hooks[i]].push(hook);
            }
        }
    }
    function emptyNodeAt(elm) {
        const id = elm.id ? '#' + elm.id : '';
        const c = elm.className ? '.' + elm.className.split(' ').join('.') : '';
        return vnode(api.tag(elm) + id + c, {}, [], undefined, elm);
    }
    function createRmCb(childElm, listeners) {
        return function rmCb() {
            if (--listeners === 0) {
                const parent = api.parentNode(childElm);
                api.removeChild(parent, childElm);
            }
        };
    }
    function createElm(parentElm, vnode$$1, insertedVnodeQueue, slotContentNodes) {
        let i, data = vnode$$1.data;
        if (data !== undefined) {
            if (isDef(i = data.hook) && isDef(i = i.init)) {
                i(vnode$$1);
                data = vnode$$1.data;
            }
        }
        let children = vnode$$1.children, sel = vnode$$1.sel;
        if (sel === 'slot') {
            if (slotContentNodes) {
                const contentNodes = vnode$$1.data.select ? slotContentNodes.selected[vnode$$1.data.select] : slotContentNodes.$;
                let contentNode;
                while (contentNode = contentNodes.shift()) {
                    // remove the host content node from it's original parent node
                    api.removeChild(contentNode.parentNode, contentNode);
                    if (!contentNodes.length) {
                        // return the last node that gets appended
                        // like any other Node that was created
                        return contentNode;
                    }
                    // relocate the node to it's new home
                    api.appendChild(parentElm, contentNode);
                }
                return api.createComment('');
            }
        }
        else if (sel === '!') {
            if (isUndef(vnode$$1.text)) {
                vnode$$1.text = '';
            }
            vnode$$1.elm = api.createComment(vnode$$1.text);
        }
        else if (sel !== undefined) {
            // Parse selector
            const hashIdx = sel.indexOf('#');
            const dotIdx = sel.indexOf('.', hashIdx);
            const hash = hashIdx > 0 ? hashIdx : sel.length;
            const dot = dotIdx > 0 ? dotIdx : sel.length;
            const tag = hashIdx !== -1 || dotIdx !== -1 ? sel.slice(0, Math.min(hash, dot)) : sel;
            const elm = vnode$$1.elm = isDef(data) && isDef(i = data.ns) ? api.createElementNS(i, tag)
                : api.createElement(tag);
            if (hash < dot)
                elm.id = sel.slice(hash + 1, dot);
            if (dotIdx > 0)
                elm.className = sel.slice(dot + 1).replace(/\./g, ' ');
            for (i = 0; i < cbs.create.length; ++i)
                cbs.create[i](emptyNode, vnode$$1);
            if (isArray(children)) {
                for (i = 0; i < children.length; ++i) {
                    const ch = children[i];
                    if (ch != null) {
                        api.appendChild(elm, createElm(elm, ch, insertedVnodeQueue, slotContentNodes));
                    }
                }
            }
            else if (isPrimitive(vnode$$1.text)) {
                api.appendChild(elm, api.createTextNode(vnode$$1.text));
            }
            i = vnode$$1.data.hook; // Reuse variable
            if (isDef(i)) {
                if (i.create)
                    i.create(emptyNode, vnode$$1);
                if (i.insert)
                    insertedVnodeQueue.push(vnode$$1);
            }
        }
        else {
            vnode$$1.elm = api.createTextNode(vnode$$1.text);
        }
        return vnode$$1.elm;
    }
    function addVnodes(parentElm, before, vnodes, startIdx, endIdx, insertedVnodeQueue, slotContentNodes) {
        for (; startIdx <= endIdx; ++startIdx) {
            const ch = vnodes[startIdx];
            if (ch != null) {
                api.insertBefore(parentElm, createElm(parentElm, ch, insertedVnodeQueue, slotContentNodes), before);
            }
        }
    }
    function invokeDestroyHook(vnode$$1) {
        let i, j, data = vnode$$1.data;
        if (data !== undefined) {
            if (isDef(i = data.hook) && isDef(i = i.destroy))
                i(vnode$$1);
            for (i = 0; i < cbs.destroy.length; ++i)
                cbs.destroy[i](vnode$$1);
            if (vnode$$1.children !== undefined) {
                for (j = 0; j < vnode$$1.children.length; ++j) {
                    i = vnode$$1.children[j];
                    if (i != null && typeof i !== "string") {
                        invokeDestroyHook(i);
                    }
                }
            }
        }
    }
    function removeVnodes(parentElm, vnodes, startIdx, endIdx) {
        for (; startIdx <= endIdx; ++startIdx) {
            let i, listeners, rm, ch = vnodes[startIdx];
            if (ch != null) {
                if (isDef(ch.sel)) {
                    invokeDestroyHook(ch);
                    listeners = cbs.remove.length + 1;
                    rm = createRmCb(ch.elm, listeners);
                    for (i = 0; i < cbs.remove.length; ++i)
                        cbs.remove[i](ch, rm);
                    if (isDef(i = ch.data) && isDef(i = i.hook) && isDef(i = i.remove)) {
                        i(ch, rm);
                    }
                    else {
                        rm();
                    }
                }
                else {
                    api.removeChild(parentElm, ch.elm);
                }
            }
        }
    }
    function updateChildren(parentElm, oldCh, newCh, insertedVnodeQueue, slotContentNodes) {
        let oldStartIdx = 0, newStartIdx = 0;
        let oldEndIdx = oldCh.length - 1;
        let oldStartVnode = oldCh[0];
        let oldEndVnode = oldCh[oldEndIdx];
        let newEndIdx = newCh.length - 1;
        let newStartVnode = newCh[0];
        let newEndVnode = newCh[newEndIdx];
        let oldKeyToIdx;
        let idxInOld;
        let elmToMove;
        let before;
        while (oldStartIdx <= oldEndIdx && newStartIdx <= newEndIdx) {
            if (oldStartVnode == null) {
                oldStartVnode = oldCh[++oldStartIdx]; // Vnode might have been moved left
            }
            else if (oldEndVnode == null) {
                oldEndVnode = oldCh[--oldEndIdx];
            }
            else if (newStartVnode == null) {
                newStartVnode = newCh[++newStartIdx];
            }
            else if (newEndVnode == null) {
                newEndVnode = newCh[--newEndIdx];
            }
            else if (sameVnode(oldStartVnode, newStartVnode)) {
                patchVnode(oldStartVnode, newStartVnode, insertedVnodeQueue, slotContentNodes);
                oldStartVnode = oldCh[++oldStartIdx];
                newStartVnode = newCh[++newStartIdx];
            }
            else if (sameVnode(oldEndVnode, newEndVnode)) {
                patchVnode(oldEndVnode, newEndVnode, insertedVnodeQueue, slotContentNodes);
                oldEndVnode = oldCh[--oldEndIdx];
                newEndVnode = newCh[--newEndIdx];
            }
            else if (sameVnode(oldStartVnode, newEndVnode)) {
                patchVnode(oldStartVnode, newEndVnode, insertedVnodeQueue, slotContentNodes);
                api.insertBefore(parentElm, oldStartVnode.elm, api.nextSibling(oldEndVnode.elm));
                oldStartVnode = oldCh[++oldStartIdx];
                newEndVnode = newCh[--newEndIdx];
            }
            else if (sameVnode(oldEndVnode, newStartVnode)) {
                patchVnode(oldEndVnode, newStartVnode, insertedVnodeQueue, slotContentNodes);
                api.insertBefore(parentElm, oldEndVnode.elm, oldStartVnode.elm);
                oldEndVnode = oldCh[--oldEndIdx];
                newStartVnode = newCh[++newStartIdx];
            }
            else {
                if (oldKeyToIdx === undefined) {
                    oldKeyToIdx = createKeyToOldIdx(oldCh, oldStartIdx, oldEndIdx);
                }
                idxInOld = oldKeyToIdx[newStartVnode.key];
                if (isUndef(idxInOld)) {
                    api.insertBefore(parentElm, createElm(parentElm, newStartVnode, insertedVnodeQueue, slotContentNodes), oldStartVnode.elm);
                    newStartVnode = newCh[++newStartIdx];
                }
                else {
                    elmToMove = oldCh[idxInOld];
                    if (elmToMove.sel !== newStartVnode.sel) {
                        api.insertBefore(parentElm, createElm(parentElm, newStartVnode, insertedVnodeQueue, slotContentNodes), oldStartVnode.elm);
                    }
                    else {
                        patchVnode(elmToMove, newStartVnode, insertedVnodeQueue, slotContentNodes);
                        oldCh[idxInOld] = undefined;
                        api.insertBefore(parentElm, elmToMove.elm, oldStartVnode.elm);
                    }
                    newStartVnode = newCh[++newStartIdx];
                }
            }
        }
        if (oldStartIdx > oldEndIdx) {
            before = newCh[newEndIdx + 1] == null ? null : newCh[newEndIdx + 1].elm;
            addVnodes(parentElm, before, newCh, newStartIdx, newEndIdx, insertedVnodeQueue, slotContentNodes);
        }
        else if (newStartIdx > newEndIdx) {
            removeVnodes(parentElm, oldCh, oldStartIdx, oldEndIdx);
        }
    }
    function patchVnode(oldVnode, vnode$$1, insertedVnodeQueue, slotContentNodes) {
        if (!slotContentNodes && oldVnode.sel === 'slot') {
            return;
        }
        let i, hook;
        if (isDef(i = vnode$$1.data) && isDef(hook = i.hook) && isDef(i = hook.prepatch)) {
            i(oldVnode, vnode$$1);
        }
        const elm = vnode$$1.elm = oldVnode.elm;
        let oldCh = oldVnode.children;
        let ch = vnode$$1.children;
        if (oldVnode === vnode$$1)
            return;
        if (vnode$$1.data !== undefined) {
            for (i = 0; i < cbs.update.length; ++i)
                cbs.update[i](oldVnode, vnode$$1);
            i = vnode$$1.data.hook;
            if (isDef(i) && isDef(i = i.update))
                i(oldVnode, vnode$$1);
        }
        if (isUndef(vnode$$1.text)) {
            if (isDef(oldCh) && isDef(ch)) {
                if (oldCh !== ch) {
                    updateChildren(elm, oldCh, ch, insertedVnodeQueue, slotContentNodes);
                }
            }
            else if (isDef(ch)) {
                if (isDef(oldVnode.text))
                    api.setTextContent(elm, '');
                addVnodes(elm, null, ch, 0, ch.length - 1, insertedVnodeQueue, null);
            }
            else if (isDef(oldCh)) {
                removeVnodes(elm, oldCh, 0, oldCh.length - 1);
            }
            else if (isDef(oldVnode.text)) {
                api.setTextContent(elm, '');
            }
        }
        else if (oldVnode.text !== vnode$$1.text) {
            api.setTextContent(elm, vnode$$1.text);
        }
        if (isDef(hook) && isDef(i = hook.postpatch)) {
            i(oldVnode, vnode$$1);
        }
    }
    function collectSlots(vnode$$1, slotContentNodes) {
        if (vnode$$1.sel === 'slot') {
            if (vnode$$1.data && vnode$$1.data.select) {
                slotContentNodes.selectNames.push(vnode$$1.data.select);
                slotContentNodes.selected[vnode$$1.data.select] = [];
            }
            else {
                slotContentNodes.$ = [];
            }
        }
        else if (vnode$$1.children) {
            for (var i = 0; i < vnode$$1.children.length; i++) {
                if (isVnode(vnode$$1.children[i])) {
                    collectSlots(vnode$$1.children[i], slotContentNodes);
                }
            }
        }
    }
    return function patch(oldVnode, vnode$$1, slotProjection) {
        let i, elm, parent;
        const insertedVnodeQueue = [];
        for (i = 0; i < cbs.pre.length; ++i)
            cbs.pre[i]();
        if (!isVnode(oldVnode)) {
            oldVnode = emptyNodeAt(oldVnode);
        }
        if (vnode$$1.isHost || sameVnode(oldVnode, vnode$$1)) {
            let slotContentNodes;
            if (slotProjection && isArray(vnode$$1.children)) {
                slotContentNodes = {
                    selectNames: [],
                    selected: {},
                    $: []
                };
                collectSlots(vnode$$1, slotContentNodes);
                let j;
                let selected;
                let childNodes = oldVnode.elm.childNodes;
                for (i = 0; i < childNodes.length; i++) {
                    selected = false;
                    if (childNodes[i].nodeType === 1) {
                        for (j = 0; j < slotContentNodes.selectNames.length; j++) {
                            if (childNodes[i].matches(slotContentNodes.selectNames[j])) {
                                slotContentNodes.selected[slotContentNodes.selectNames[j]].push(oldVnode.elm.childNodes[i]);
                                selected = true;
                                break;
                            }
                        }
                    }
                    if (!selected) {
                        slotContentNodes.$.push(oldVnode.elm.childNodes[i]);
                    }
                }
            }
            patchVnode(oldVnode, vnode$$1, insertedVnodeQueue, slotContentNodes);
        }
        else {
            elm = oldVnode.elm;
            parent = api.parentNode(elm);
            createElm(parent, vnode$$1, insertedVnodeQueue, null);
            if (parent !== null) {
                api.insertBefore(parent, vnode$$1.elm, api.nextSibling(elm));
                removeVnodes(parent, [oldVnode], 0, 0);
            }
        }
        for (i = 0; i < insertedVnodeQueue.length; ++i) {
            insertedVnodeQueue[i].data.hook.insert(insertedVnodeQueue[i]);
        }
        for (i = 0; i < cbs.post.length; ++i)
            cbs.post[i]();
        return vnode$$1;
    };
}

function Ionic(opts) {
    const GLOBAL = typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : Function('return this;')();
    const ionic = (GLOBAL.ionic = GLOBAL.ionic || {});
    if (opts) {
        if (opts.api) {
            ionic.api = opts.api;
        }
        if (opts.config) {
            ionic.config = opts.config;
        }
    }
    if (!ionic.api) {
        ionic.api = new PlatformClient(document);
    }
    if (!ionic.renderer) {
        ionic.renderer = initRenderer([
            attributesModule,
            classModule,
            eventListenersModule,
            styleModule
        ], ionic.api);
    }
    if (!ionic.config) {
        ionic.config = new Config();
    }
    return ionic;
}

function initProperties(elm, props) {
    props = props || {};
    // all components have mode and color props
    props.mode = true;
    props.color = true;
    const propValues = {};
    Object.keys(props).forEach(propName => {
        propName = toCamelCase(propName);
        Object.defineProperty(elm, propName, {
            get: () => {
                return propValues[propName];
            },
            set: (value) => {
                value = getValue(props[propName], value);
                if (propValues[propName] !== value) {
                    propValues[propName] = value;
                    elm.update();
                }
            }
        });
    });
}
function getValue(propOpts, value) {
    if (propOpts.type === 'boolean') {
        if (isString(value)) {
            return true;
        }
        return !!value;
    }
    else if (propOpts.type === 'number') {
        if (isNumber(value)) {
            return value;
        }
        return parseFloat(value);
    }
    return value;
}

function patchHostElement(config, api, renderer, elm) {
    elm.mode = getValue$1('mode', config, api, elm);
    elm.color = getValue$1('color', config, api, elm);
    const newVnode = elm.render();
    if (!newVnode) {
        return;
    }
    newVnode.elm = elm;
    newVnode.isHost = true;
    const hostCss = newVnode.data.class = newVnode.data.class || {};
    let componentPrefix;
    const cssClasses = newVnode.sel.split('.');
    if (cssClasses.length > 1) {
        componentPrefix = cssClasses[1] + '-';
        for (var i = 1; i < cssClasses.length; i++) {
            hostCss[cssClasses[i]] = true;
        }
    }
    else {
        componentPrefix = '';
    }
    newVnode.sel = undefined;
    hostCss[`${componentPrefix}${elm.mode}`] = true;
    if (elm.color) {
        hostCss[`${componentPrefix}${elm.mode}-${elm.color}`] = true;
    }
    // if we already have a vnode then use it
    // otherwise, elm is the initial patch and
    // we need it to pass it the actual host element
    if (!elm._vnode) {
        elm._vnode = renderer(elm, newVnode, true);
    }
    else {
        elm._vnode = renderer(elm._vnode, newVnode, false);
    }
}
function getValue$1(name, config, api, elm, fallback = null) {
    const val = api.getPropOrAttr(elm, name);
    return isDef(val) ? val : config.get(name, fallback);
}

class IonElement extends getBaseElement() {
    constructor() {
        super();
        /** @internal */
        this._q = true;
        const ctorPrototype = this.constructor.prototype;
        initProperties(this, ctorPrototype[$annotations]);
        const styleUrl = ctorPrototype.styleUrl;
        if (styleUrl) {
            const api = Ionic().api;
            const tag = ctorPrototype.tag || api.tag(this);
            if (!api.hasElementCss(tag)) {
                api.appendElementCss(tag, styleUrl);
            }
        }
    }
    connectedCallback() {
        this._q = false;
        this.update();
    }
    static get observedAttributes() {
        const annotations = this.prototype[$annotations] = this.prototype[$annotations] || {};
        annotations.obsAttrs = annotations.obsAttrs || [];
        // all components have mode and color props
        annotations.obsAttrs.push('mode', 'color');
        return annotations.obsAttrs;
    }
    static set observedAttributes(attrs) {
        const annotations = this.prototype[$annotations] = this.prototype[$annotations] || {};
        if (annotations.obsAttrs) {
            Array.prototype.push.apply(annotations.obsAttrs, attrs);
        }
        else {
            annotations.obsAttrs = attrs;
        }
    }
    update() {
        const elm = this;
        // only run patch if it isn't queued already
        if (!elm._q) {
            elm._q = true;
            // run the patch in the next tick
            const ionic = Ionic();
            ionic.api.nextTick(() => {
                // vdom diff and patch the host element for differences
                patchHostElement(ionic.config, ionic.api, ionic.renderer, elm);
                // no longer queued
                elm._q = false;
            });
        }
    }
    attributeChangedCallback(attrName, oldVal, newVal) {
        if (oldVal !== newVal) {
            this[toCamelCase(attrName)] = newVal;
        }
    }
    render() { return null; }
    ;
}
function getBaseElement() {
    if (typeof HTMLElement !== 'function') {
        const BaseElement = function () { };
        BaseElement.prototype = Ionic().api.createElement('div');
        return BaseElement;
    }
    return HTMLElement;
}

class IonApp extends IonElement {
    render() {
        return h('.app');
    }
}
IonApp.annotations = {
    tag: 'ion-app'
};

class IonBadge extends IonElement {
    render() {
        return h('.badge');
    }
}

var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
let IonButton = class IonButton extends IonElement {
    constructor() {
        super(...arguments);
        this.role = 'button';
    }
    render() {
        const vnodeData = { class: {} };
        const hostCss = vnodeData.class;
        const host = this;
        const role = host.role;
        const mode = host.mode;
        function setCssClass(type) {
            if (type) {
                type = type.toLocaleLowerCase();
                hostCss[`${role}-${type}`] = true;
                hostCss[`${role}-${type}-${mode}`] = true;
            }
        }
        hostCss[role] = true;
        hostCss[`${role}-${mode}`] = true;
        let size = host.large ? 'large' : host.small ? 'small' : 'default';
        setCssClass(size);
        let style = host.outline ? 'outline' : host.clear ? 'clear' : host.solid ? 'solid' : null;
        style = (role !== 'bar-button' && style === 'solid' ? 'default' : style);
        setCssClass(style);
        let display = host.block ? 'block' : host.full ? 'full' : null;
        setCssClass(display);
        if (host.round) {
            setCssClass('round');
        }
        if (host.strong) {
            setCssClass('strong');
        }
        return h('.button', vnodeData, [
            h('span.button-inner', [
                h('slot')
            ]),
            h('div.button-effect')
        ]);
    }
};
__decorate([
    Prop()
], IonButton.prototype, "role", void 0);
__decorate([
    Prop({ type: 'boolean' })
], IonButton.prototype, "large", void 0);
__decorate([
    Prop({ type: 'boolean' })
], IonButton.prototype, "small", void 0);
__decorate([
    Prop({ type: 'boolean' })
], IonButton.prototype, "default", void 0);
__decorate([
    Prop({ type: 'boolean' })
], IonButton.prototype, "outline", void 0);
__decorate([
    Prop({ type: 'boolean' })
], IonButton.prototype, "clear", void 0);
__decorate([
    Prop({ type: 'boolean' })
], IonButton.prototype, "solid", void 0);
__decorate([
    Prop({ type: 'boolean' })
], IonButton.prototype, "round", void 0);
__decorate([
    Prop({ type: 'boolean' })
], IonButton.prototype, "block", void 0);
__decorate([
    Prop({ type: 'boolean' })
], IonButton.prototype, "full", void 0);
__decorate([
    Prop({ type: 'boolean' })
], IonButton.prototype, "strong", void 0);
IonButton = __decorate([
    Component({
        tag: 'ion-button',
        styleUrl: 'button.css',
        preprocessStyles: [
            'button.scss'
        ]
    })
], IonButton);

class IonContent extends IonElement {
    render() {
        return h('.content');
    }
}

class IonHeader extends IonElement {
    render() {
        return h('.header');
    }
}

class IonItem extends IonElement {
    render() {
        return h('.item', [
            h('slot', { select: '[item-left],ion-checkbox:not([item-right])' }),
            h('div.item-inner', [
                h('div.input-wrapper', [
                    h('ion-label', [
                        h('slot')
                    ]),
                    h('slot', { select: 'ion-select,ion-input,ion-textarea,ion-datetime,ion-range,[item-content]' })
                ]),
                h('slot', { select: '[item-right],ion-radio,ion-toggle' }),
                h('ion-reorder')
            ]),
            h('button-effect')
        ]);
    }
}

class IonList extends IonElement {
    render() {
        return h('.list');
    }
}

class IonTitle extends IonElement {
    render() {
        return h('.title');
    }
}

class IonToolbar extends IonElement {
    render() {
        return h('.toolbar');
    }
}

if (!customElements) {
    throw new Error('Ionic requires custom element support');
}
defineElements(window, {
    'ion-app': IonApp,
    'ion-badge': IonBadge,
    'ion-button': IonButton,
    'ion-content': IonContent,
    'ion-header': IonHeader,
    'ion-icon': IonIcon,
    'ion-item': IonItem,
    'ion-list': IonList,
    'ion-scroll': IonScroll,
    'ion-title': IonTitle,
    'ion-toolbar': IonToolbar
});

})));
