/*! document-register-element, 1.5.0
https://github.com/WebReflection/document-register-element
(C) Andrea Giammarchi - @WebReflection - Mit Style License */
(function(e,t){"use strict";function Ht(){var e=wt.splice(0,wt.length);Et=0;while(e.length)e.shift().call(null,e.shift())}function Bt(e,t){for(var n=0,r=e.length;n<r;n++)Jt(e[n],t)}function jt(e){for(var t=0,n=e.length,r;t<n;t++)r=e[t],Pt(r,A[It(r)])}function Ft(e){return function(t){ut(t)&&(Jt(t,e),O.length&&Bt(t.querySelectorAll(O),e))}}function It(e){var t=ht.call(e,"is"),n=e.nodeName.toUpperCase(),r=_.call(L,t?N+t.toUpperCase():T+n);return t&&-1<r&&!qt(n,t)?-1:r}function qt(e,t){return-1<O.indexOf(e+'[is="'+t+'"]')}function Rt(e){var t=e.currentTarget,n=e.attrChange,r=e.attrName,i=e.target,s=e[y]||2,o=e[w]||3;kt&&(!i||i===t)&&t[h]&&r!=="style"&&(e.prevValue!==e.newValue||e.newValue===""&&(n===s||n===o))&&t[h](r,n===s?null:e.prevValue,n===o?null:e.newValue)}function Ut(e){var t=Ft(e);return function(e){wt.push(t,e.target),Et&&clearTimeout(Et),Et=setTimeout(Ht,1)}}function zt(e){Ct&&(Ct=!1,e.currentTarget.removeEventListener(S,zt)),O.length&&Bt((e.target||n).querySelectorAll(O),e.detail===l?l:a),st&&Vt()}function Wt(e,t){var n=this;vt.call(n,e,t),Lt.call(n,{target:n})}function Xt(e,t){nt(e,t),Mt?Mt.observe(e,yt):(Nt&&(e.setAttribute=Wt,e[o]=Ot(e),e[u](x,Lt)),e[u](E,Rt)),e[m]&&kt&&(e.created=!0,e[m](),e.created=!1)}function Vt(){for(var e,t=0,n=at.length;t<n;t++)e=at[t],M.contains(e)||(n--,at.splice(t--,1),Jt(e,l))}function $t(e){throw new Error("A "+e+" type is already registered")}function Jt(e,t){var n,r=It(e);-1<r&&(Dt(e,A[r]),r=0,t===a&&!e[a]?(e[l]=!1,e[a]=!0,r=1,st&&_.call(at,e)<0&&at.push(e)):t===l&&!e[l]&&(e[a]=!1,e[l]=!0,r=1),r&&(n=e[t+f])&&n.call(e))}function Kt(){}function Qt(e,t,r){var i=r&&r[c]||"",o=t.prototype,u=tt(o),a=t.observedAttributes||j,f={prototype:u};ot(u,m,{value:function(){if(Q)Q=!1;else if(!this[W]){this[W]=!0,new t(this),o[m]&&o[m].call(this);var e=G[Z.get(t)];(!V||e.create.length>1)&&Zt(this)}}}),ot(u,h,{value:function(e){-1<_.call(a,e)&&o[h].apply(this,arguments)}}),o[d]&&ot(u,p,{value:o[d]}),o[v]&&ot(u,g,{value:o[v]}),i&&(f[c]=i),e=e.toUpperCase(),G[e]={constructor:t,create:i?[i,et(e)]:[e]},Z.set(t,e),n[s](e.toLowerCase(),f),en(e),Y[e].r()}function Gt(e){var t=G[e.toUpperCase()];return t&&t.constructor}function Yt(e){return typeof e=="string"?e:e&&e.is||""}function Zt(e){var t=e[h],n=t?e.attributes:j,r=n.length,i;while(r--)i=n[r],t.call(e,i.name||i.nodeName,null,i.value||i.nodeValue)}function en(e){return e=e.toUpperCase(),e in Y||(Y[e]={},Y[e].p=new K(function(t){Y[e].r=t})),Y[e].p}function tn(){X&&delete e.customElements,B(e,"customElements",{configurable:!0,value:new Kt}),B(e,"CustomElementRegistry",{configurable:!0,value:Kt});for(var t=function(t){var r=e[t];if(r){e[t]=function(t){var i,s;return t||(t=this),t[W]||(Q=!0,i=G[Z.get(t.constructor)],s=V&&i.create.length===1,t=s?Reflect.construct(r,j,i.constructor):n.createElement.apply(n,i.create),t[W]=!0,Q=!1,s||Zt(t)),t},e[t].prototype=r.prototype;try{r.prototype.constructor=e[t]}catch(i){z=!0,B(r,W,{value:e[t]})}}},r=i.get(/^HTML[A-Z]*[a-z]/),o=r.length;o--;t(r[o]));n.createElement=function(e,t){var n=Yt(t);return n?gt.call(this,e,et(n)):gt.call(this,e)},St||(Tt=!0,n[s](""))}var n=e.document,r=e.Object,i=function(e){var t=/^[A-Z]+[a-z]/,n=function(e){var t=[],n;for(n in s)e.test(n)&&t.push(n);return t},i=function(e,t){t=t.toLowerCase(),t in s||(s[e]=(s[e]||[]).concat(t),s[t]=s[t.toUpperCase()]=e)},s=(r.create||r)(null),o={},u,a,f,l;for(a in e)for(l in e[a]){f=e[a][l],s[l]=f;for(u=0;u<f.length;u++)s[f[u].toLowerCase()]=s[f[u].toUpperCase()]=l}return o.get=function(r){return typeof r=="string"?s[r]||(t.test(r)?[]:""):n(r)},o.set=function(n,r){return t.test(n)?i(n,r):i(r,n),o},o}({collections:{HTMLAllCollection:["all"],HTMLCollection:["forms"],HTMLFormControlsCollection:["elements"],HTMLOptionsCollection:["options"]},elements:{Element:["element"],HTMLAnchorElement:["a"],HTMLAppletElement:["applet"],HTMLAreaElement:["area"],HTMLAttachmentElement:["attachment"],HTMLAudioElement:["audio"],HTMLBRElement:["br"],HTMLBaseElement:["base"],HTMLBodyElement:["body"],HTMLButtonElement:["button"],HTMLCanvasElement:["canvas"],HTMLContentElement:["content"],HTMLDListElement:["dl"],HTMLDataElement:["data"],HTMLDataListElement:["datalist"],HTMLDetailsElement:["details"],HTMLDialogElement:["dialog"],HTMLDirectoryElement:["dir"],HTMLDivElement:["div"],HTMLDocument:["document"],HTMLElement:["element","abbr","address","article","aside","b","bdi","bdo","cite","code","command","dd","dfn","dt","em","figcaption","figure","footer","header","i","kbd","mark","nav","noscript","rp","rt","ruby","s","samp","section","small","strong","sub","summary","sup","u","var","wbr"],HTMLEmbedElement:["embed"],HTMLFieldSetElement:["fieldset"],HTMLFontElement:["font"],HTMLFormElement:["form"],HTMLFrameElement:["frame"],HTMLFrameSetElement:["frameset"],HTMLHRElement:["hr"],HTMLHeadElement:["head"],HTMLHeadingElement:["h1","h2","h3","h4","h5","h6"],HTMLHtmlElement:["html"],HTMLIFrameElement:["iframe"],HTMLImageElement:["img"],HTMLInputElement:["input"],HTMLKeygenElement:["keygen"],HTMLLIElement:["li"],HTMLLabelElement:["label"],HTMLLegendElement:["legend"],HTMLLinkElement:["link"],HTMLMapElement:["map"],HTMLMarqueeElement:["marquee"],HTMLMediaElement:["media"],HTMLMenuElement:["menu"],HTMLMenuItemElement:["menuitem"],HTMLMetaElement:["meta"],HTMLMeterElement:["meter"],HTMLModElement:["del","ins"],HTMLOListElement:["ol"],HTMLObjectElement:["object"],HTMLOptGroupElement:["optgroup"],HTMLOptionElement:["option"],HTMLOutputElement:["output"],HTMLParagraphElement:["p"],HTMLParamElement:["param"],HTMLPictureElement:["picture"],HTMLPreElement:["pre"],HTMLProgressElement:["progress"],HTMLQuoteElement:["blockquote","q","quote"],HTMLScriptElement:["script"],HTMLSelectElement:["select"],HTMLShadowElement:["shadow"],HTMLSlotElement:["slot"],HTMLSourceElement:["source"],HTMLSpanElement:["span"],HTMLStyleElement:["style"],HTMLTableCaptionElement:["caption"],HTMLTableCellElement:["td","th"],HTMLTableColElement:["col","colgroup"],HTMLTableElement:["table"],HTMLTableRowElement:["tr"],HTMLTableSectionElement:["thead","tbody","tfoot"],HTMLTemplateElement:["template"],HTMLTextAreaElement:["textarea"],HTMLTimeElement:["time"],HTMLTitleElement:["title"],HTMLTrackElement:["track"],HTMLUListElement:["ul"],HTMLUnknownElement:["unknown","vhgroupv","vkeygen"],HTMLVideoElement:["video"]},nodes:{Attr:["node"],Audio:["audio"],CDATASection:["node"],CharacterData:["node"],Comment:["#comment"],Document:["#document"],DocumentFragment:["#document-fragment"],DocumentType:["node"],HTMLDocument:["#document"],Image:["img"],Option:["option"],ProcessingInstruction:["node"],ShadowRoot:["#shadow-root"],Text:["#text"],XMLDocument:["xml"]}});t||(t="auto");var s="registerElement",o="__"+s+(e.Math.random()*1e5>>0),u="addEventListener",a="attached",f="Callback",l="detached",c="extends",h="attributeChanged"+f,p=a+f,d="connected"+f,v="disconnected"+f,m="created"+f,g=l+f,y="ADDITION",b="MODIFICATION",w="REMOVAL",E="DOMAttrModified",S="DOMContentLoaded",x="DOMSubtreeModified",T="<",N="=",C=/^[A-Z][A-Z0-9]*(?:-[A-Z0-9]+)+$/,k=["ANNOTATION-XML","COLOR-PROFILE","FONT-FACE","FONT-FACE-SRC","FONT-FACE-URI","FONT-FACE-FORMAT","FONT-FACE-NAME","MISSING-GLYPH"],L=[],A=[],O="",M=n.documentElement,_=L.indexOf||function(e){for(var t=this.length;t--&&this[t]!==e;);return t},D=r.prototype,P=D.hasOwnProperty,H=D.isPrototypeOf,B=r.defineProperty,j=[],F=r.getOwnPropertyDescriptor,I=r.getOwnPropertyNames,q=r.getPrototypeOf,R=r.setPrototypeOf,U=!!r.__proto__,z=!1,W="__dreCEv1",X=e.customElements,V=t!=="force"&&!!(X&&X.define&&X.get&&X.whenDefined),$=r.create||r,J=e.Map||function(){var t=[],n=[],r;return{get:function(e){return n[_.call(t,e)]},set:function(e,i){r=_.call(t,e),r<0?n[t.push(e)-1]=i:n[r]=i}}},K=e.Promise||function(e){function i(e){n=!0;while(t.length)t.shift()(e)}var t=[],n=!1,r={"catch":function(){return r},then:function(e){return t.push(e),n&&setTimeout(i,1),r}};return e(i),r},Q=!1,G=$(null),Y=$(null),Z=new J,et=function(e){return e.toLowerCase()},tt=r.create||function sn(e){return e?(sn.prototype=e,new sn):this},nt=R||(U?function(e,t){return e.__proto__=t,e}:I&&F?function(){function e(e,t){for(var n,r=I(t),i=0,s=r.length;i<s;i++)n=r[i],P.call(e,n)||B(e,n,F(t,n))}return function(t,n){do e(t,n);while((n=q(n))&&!H.call(n,t));return t}}():function(e,t){for(var n in t)e[n]=t[n];return e}),rt=e.MutationObserver||e.WebKitMutationObserver,it=(e.HTMLElement||e.Element||e.Node).prototype,st=!H.call(it,M),ot=st?function(e,t,n){return e[t]=n.value,e}:B,ut=st?function(e){return e.nodeType===1}:function(e){return H.call(it,e)},at=st&&[],ft=it.attachShadow,lt=it.cloneNode,ct=it.dispatchEvent,ht=it.getAttribute,pt=it.hasAttribute,dt=it.removeAttribute,vt=it.setAttribute,mt=n.createElement,gt=mt,yt=rt&&{attributes:!0,characterData:!0,attributeOldValue:!0},bt=rt||function(e){Nt=!1,M.removeEventListener(E,bt)},wt,Et=0,St=s in n,xt=!0,Tt=!1,Nt=!0,Ct=!0,kt=!0,Lt,At,Ot,Mt,_t,Dt,Pt;St||(R||U?(Dt=function(e,t){H.call(t,e)||Xt(e,t)},Pt=Xt):(Dt=function(e,t){e[o]||(e[o]=r(!0),Xt(e,t))},Pt=Dt),st?(Nt=!1,function(){var e=F(it,u),t=e.value,n=function(e){var t=new CustomEvent(E,{bubbles:!0});t.attrName=e,t.prevValue=ht.call(this,e),t.newValue=null,t[w]=t.attrChange=2,dt.call(this,e),ct.call(this,t)},r=function(e,t){var n=pt.call(this,e),r=n&&ht.call(this,e),i=new CustomEvent(E,{bubbles:!0});vt.call(this,e,t),i.attrName=e,i.prevValue=n?r:null,i.newValue=t,n?i[b]=i.attrChange=1:i[y]=i.attrChange=0,ct.call(this,i)},i=function(e){var t=e.currentTarget,n=t[o],r=e.propertyName,i;n.hasOwnProperty(r)&&(n=n[r],i=new CustomEvent(E,{bubbles:!0}),i.attrName=n.name,i.prevValue=n.value||null,i.newValue=n.value=t[r]||null,i.prevValue==null?i[y]=i.attrChange=0:i[b]=i.attrChange=1,ct.call(t,i))};e.value=function(e,s,u){e===E&&this[h]&&this.setAttribute!==r&&(this[o]={className:{name:"class",value:this.className}},this.setAttribute=r,this.removeAttribute=n,t.call(this,"propertychange",i)),t.call(this,e,s,u)},B(it,u,e)}()):rt||(M[u](E,bt),M.setAttribute(o,1),M.removeAttribute(o),Nt&&(Lt=function(e){var t=this,n,r,i;if(t===e.target){n=t[o],t[o]=r=Ot(t);for(i in r){if(!(i in n))return At(0,t,i,n[i],r[i],y);if(r[i]!==n[i])return At(1,t,i,n[i],r[i],b)}for(i in n)if(!(i in r))return At(2,t,i,n[i],r[i],w)}},At=function(e,t,n,r,i,s){var o={attrChange:e,currentTarget:t,attrName:n,prevValue:r,newValue:i};o[s]=e,Rt(o)},Ot=function(e){for(var t,n,r={},i=e.attributes,s=0,o=i.length;s<o;s++)t=i[s],n=t.name,n!=="setAttribute"&&(r[n]=t.value);return r})),n[s]=function(t,r){p=t.toUpperCase(),xt&&(xt=!1,rt?(Mt=function(e,t){function n(e,t){for(var n=0,r=e.length;n<r;t(e[n++]));}return new rt(function(r){for(var i,s,o,u=0,a=r.length;u<a;u++)i=r[u],i.type==="childList"?(n(i.addedNodes,e),n(i.removedNodes,t)):(s=i.target,kt&&s[h]&&i.attributeName!=="style"&&(o=ht.call(s,i.attributeName),o!==i.oldValue&&s[h](i.attributeName,i.oldValue,o)))})}(Ft(a),Ft(l)),_t=function(e){return Mt.observe(e,{childList:!0,subtree:!0}),e},_t(n),ft&&(it.attachShadow=function(){return _t(ft.apply(this,arguments))})):(wt=[],n[u]("DOMNodeInserted",Ut(a)),n[u]("DOMNodeRemoved",Ut(l))),n[u](S,zt),n[u]("readystatechange",zt),it.cloneNode=function(e){var t=lt.call(this,!!e),n=It(t);return-1<n&&Pt(t,A[n]),e&&O.length&&jt(t.querySelectorAll(O)),t});if(Tt)return Tt=!1;-2<_.call(L,N+p)+_.call(L,T+p)&&$t(t);if(!C.test(p)||-1<_.call(k,p))throw new Error("The type "+t+" is invalid");var i=function(){return o?n.createElement(f,p):n.createElement(f)},s=r||D,o=P.call(s,c),f=o?r[c].toUpperCase():p,p,d;return o&&-1<_.call(L,T+f)&&$t(f),d=L.push((o?N:T)+p)-1,O=O.concat(O.length?",":"",o?f+'[is="'+t.toLowerCase()+'"]':f),i.prototype=A[d]=P.call(s,"prototype")?s.prototype:tt(it),O.length&&Bt(n.querySelectorAll(O),a),i},n.createElement=gt=function(e,t){var r=Yt(t),i=r?mt.call(n,e,et(r)):mt.call(n,e),s=""+e,o=_.call(L,(r?N:T)+(r||s).toUpperCase()),u=-1<o;return r&&(i.setAttribute("is",r=r.toLowerCase()),u&&(u=qt(s.toUpperCase(),r))),kt=!n.createElement.innerHTMLHelper,u&&Pt(i,A[o]),i}),Kt.prototype={constructor:Kt,define:V?function(e,t,n){if(n)Qt(e,t,n);else{var r=e.toUpperCase();G[r]={constructor:t,create:[r]},Z.set(t,r),X.define(e,t)}}:Qt,get:V?function(e){return X.get(e)||Gt(e)}:Gt,whenDefined:V?function(e){return K.race([X.whenDefined(e),en(e)])}:en};if(!X||t==="force")tn();else try{(function(t,r,i){r[c]="a",t.prototype=tt(HTMLAnchorElement.prototype),t.prototype.constructor=t,e.customElements.define(i,t,r);if(ht.call(n.createElement("a",{is:i}),"is")!==i||V&&ht.call(new t,"is")!==i)throw r})(function on(){return Reflect.construct(HTMLAnchorElement,[],on)},{},"document-register-element-a")}catch(nn){tn()}try{mt.call(n,"a","a")}catch(rn){et=function(e){return{is:e.toLowerCase()}}}})(window);

/*! Built with http://stenciljs.com */

(function (window, document, globalNamespace) {
    "use strict";

    function createConfigController(configObj, platforms) {
        configObj = configObj || {};
        function get(key, fallback) {
            if (configObj[key] !== undefined) {
                return configObj[key];
            }
            var settings = null;
            for (var i = 0; i < platforms.length; i++) {
                settings = platforms[i]['settings'];
                if (settings && settings[key] !== undefined) {
                    return settings[key];
                }
            }
            return fallback !== undefined ? fallback : null;
        }
        function getBoolean(key, fallback) {
            var val = get(key);
            if (val === null) {
                return fallback !== undefined ? fallback : false;
            }
            if (typeof val === 'string') {
                return val === 'true';
            }
            return !!val;
        }
        function getNumber(key, fallback) {
            var val = parseFloat(get(key));
            return isNaN(val) ? fallback !== undefined ? fallback : NaN : val;
        }
        return {
            get: get,
            getBoolean: getBoolean,
            getNumber: getNumber
        };
    }

    function createDomApi(document) {
        // using the $ prefix so that closure if
        // cool with property renaming each of these
        return {
            $documentElement: document.documentElement,
            $head: document.head,
            $body: document.body,
            $nodeType: function nodeType(node) {
                return node.nodeType;
            },
            $createEvent: function createEvent() {
                return document.createEvent('CustomEvent');
            },
            $createElement: function createElement(tagName) {
                return document.createElement(tagName);
            },
            $createElementNS: function createElementNS(namespace, tagName) {
                return document.createElementNS(namespace, tagName);
            },
            $createTextNode: function createTextNode(text) {
                return document.createTextNode(text);
            },
            $createComment: function createComment(data) {
                return document.createComment(data);
            },
            $insertBefore: function insertBefore(parentNode, childNode, referenceNode) {
                parentNode.insertBefore(childNode, referenceNode);
            },
            $removeChild: function removeChild(parentNode, childNode) {
                return parentNode.removeChild(childNode);
            },
            $appendChild: function appendChild(parentNode, childNode) {
                parentNode.appendChild(childNode);
            },
            $childNodes: function childNodes(node) {
                return node.childNodes;
            },
            $parentNode: function parentNode(node) {
                return node.parentNode;
            },
            $nextSibling: function nextSibling(node) {
                return node.nextSibling;
            },
            $tagName: function tagName(elm) {
                return elm.tagName;
            },
            $getTextContent: function (node) {
                return node.textContent;
            },
            $setTextContent: function setTextContent(node, text) {
                node.textContent = text;
            },
            $getAttribute: function getAttribute(elm, key) {
                return elm.getAttribute(key);
            },
            $setAttribute: function setAttribute(elm, key, val) {
                elm.setAttribute(key, val);
            },
            $setAttributeNS: function $setAttributeNS(elm, namespaceURI, qualifiedName, val) {
                elm.setAttributeNS(namespaceURI, qualifiedName, val);
            },
            $removeAttribute: function removeAttribute(elm, key) {
                elm.removeAttribute(key);
            }
        };
    }

    function createDomControllerClient(win) {
        var readCBs = [];
        var writeCBs = [];
        var rafPending = false;
        function now() {
            return win.performance.now();
        }
        function raf(cb) {
            return win.requestAnimationFrame(cb);
        }
        function domRead(cb) {
            readCBs.push(cb);
            if (!rafPending) {
                rafPending = true;
                raf(rafFlush);
            }
        }
        function domWrite(cb) {
            writeCBs.push(cb);
            if (!rafPending) {
                rafPending = true;
                raf(rafFlush);
            }
        }
        function rafFlush(timeStamp, startTime, cb, err) {
            try {
                startTime = now();
                // ******** DOM READS ****************
                while (cb = readCBs.shift()) {
                    cb(timeStamp);
                }
                // ******** DOM WRITES ****************
                while (cb = writeCBs.shift()) {
                    cb(timeStamp);
                    if (now() - startTime > 8) {
                        break;
                    }
                }
            } catch (e) {
                err = e;
            }
            if (rafPending = readCBs.length > 0 || writeCBs.length > 0) {
                raf(rafFlush);
            }
            if (err) {
                console.error(err);
            }
        }
        return {
            read: domRead,
            write: domWrite,
            raf: raf,
            now: now
        };
    }

    /**
     * This constants file is largely for minification tricks, and to
     * have easy to read variable names. Enums would make more sense
     * in most cases, but doing values like this as constants allows
     * minifiers to just place the raw value directly in source, and in
     * production there is no variable at all. For example, the minifier
     * turns data[BUNDLE_ID] turns into data[0] for production builds.
     */
    /**
     * Prop Change Meta Indexes
     */
    var PROP_CHANGE_PROP_NAME = 0;
    var PROP_CHANGE_METHOD_NAME = 1;
    /**
     * Property Types
     */

    var TYPE_BOOLEAN = 1;
    var TYPE_NUMBER = 2;
    /**
     * JS Property to Attribute Name Options
     */

    var ATTR_LOWER_CASE = 1;
    /**
     * Priority Levels
     */
    var PRIORITY_HIGH = 3;

    var PRIORITY_LOW = 1;
    /**
     * Slot Meta
     */
    var SLOT_TAG = 0;
    var HAS_SLOTS = 1;
    var HAS_NAMED_SLOTS = 2;
    /**
     * SSR Attribute Names
     */
    var SSR_VNODE_ID = 'ssrv';
    var SSR_CHILD_ID = 'ssrc';
    /**
     * Node Types
     */
    var ELEMENT_NODE = 1;
    var TEXT_NODE = 3;
    var COMMENT_NODE = 8;
    /**
     * Key Name to Key Code Map
     */
    var KEY_CODE_MAP = {
        'enter': 13,
        'escape': 27,
        'space': 32,
        'tab': 9
    };
    /**
     * CSS class that gets added to the host element
     * after the component has fully hydrated
     */
    var HYDRATED_CSS = 'hydrated';
    /**
     * Namespaces
     */

    /**
     * File names and value
     */

    var VNode = function VNode() {}

    /**
     * Production h() function based on Preact by
     * Jason Miller (@developit)
     * Licensed under the MIT License
     * https://github.com/developit/preact/blob/master/LICENSE
     *
     * Modified for Stencil's compiler and vdom
     */
    var stack = [];
    function h(nodeName, vnodeData, child) {
        var children = void 0,
            lastSimple = void 0,
            simple = void 0,
            i = void 0;
        for (i = arguments.length; i-- > 2;) {
            stack.push(arguments[i]);
        }
        while (stack.length) {
            if ((child = stack.pop()) && child.pop !== undefined) {
                for (i = child.length; i--;) {
                    stack.push(child[i]);
                }
            } else {
                if (typeof child === 'boolean') child = null;
                if (simple = typeof nodeName !== 'function') {
                    if (child == null) child = '';else if (typeof child === 'number') child = String(child);else if (typeof child !== 'string') simple = false;
                }
                if (simple && lastSimple) {
                    children[children.length - 1].vtext += child;
                } else if (children === undefined) {
                    children = [simple ? t(child) : child];
                } else {
                    children.push(simple ? t(child) : child);
                }
                lastSimple = simple;
            }
        }
        var vnode = new VNode();
        vnode.vtag = nodeName;
        vnode.vchildren = children;
        if (vnodeData) {
            // data object was provided
            vnode.vattrs = vnodeData.a;
            vnode.vprops = vnodeData.p;
            vnode.vclass = vnodeData.c;
            vnode.vstyle = vnodeData.s;
            vnode.vlisteners = vnodeData.o;
            vnode.vkey = vnodeData.k;
            vnode.vnamespace = vnodeData.n;
            // x = undefined: always check both data and children
            // x = 0 skip checking only data on update
            // x = 1 skip checking only children on update
            // x = 2 skip checking both data and children on update
            vnode.skipDataOnUpdate = vnodeData.x === 0 || vnodeData.x === 2;
            vnode.skipChildrenOnUpdate = vnodeData.x > 0;
        } else {
            // no data object was provided
            // so no data, so don't both checking data
            vnode.skipDataOnUpdate = true;
            // since no data was provided, than no x was provided
            // if no x was provided then we need to always check children
            // if if there are no children at all, then we know never to check children
            vnode.skipChildrenOnUpdate = !children || children.length === 0;
        }
        return vnode;
    }
    function t(textValue) {
        var vnode = new VNode();
        vnode.vtext = textValue;
        return vnode;
    }

    function createVNodesFromSsr(domApi, rootElm) {
        var allSsrElms = rootElm.querySelectorAll('[' + SSR_VNODE_ID + ']'),
            elm,
            ssrVNodeId,
            ssrVNode,
            i,
            ilen = allSsrElms.length,
            j,
            jlen;
        if (rootElm._hasLoaded = ilen > 0) {
            for (i = 0; i < ilen; i++) {
                elm = allSsrElms[i];
                ssrVNodeId = domApi.$getAttribute(elm, SSR_VNODE_ID);
                ssrVNode = elm._vnode = new VNode();
                ssrVNode.vtag = domApi.$tagName(ssrVNode.elm = elm).toLowerCase();
                for (j = 0, jlen = elm.childNodes.length; j < jlen; j++) {
                    addChildSsrVNodes(domApi, elm.childNodes[j], ssrVNode, ssrVNodeId, true);
                }
            }
        }
    }
    function addChildSsrVNodes(domApi, node, parentVNode, ssrVNodeId, checkNestedElements) {
        var nodeType = domApi.$nodeType(node);
        var previousComment;
        var childVNodeId, childVNodeSplt, childVNode;
        if (checkNestedElements && nodeType === ELEMENT_NODE) {
            childVNodeId = domApi.$getAttribute(node, SSR_CHILD_ID);
            if (childVNodeId) {
                // split the start comment's data with a period
                childVNodeSplt = childVNodeId.split('.');
                // ensure this this element is a child element of the ssr vnode
                if (childVNodeSplt[0] === ssrVNodeId) {
                    // cool, this element is a child to the parent vnode
                    childVNode = new VNode();
                    childVNode.vtag = domApi.$tagName(childVNode.elm = node).toLowerCase();
                    // this is a new child vnode
                    // so ensure its parent vnode has the vchildren array
                    if (!parentVNode.vchildren) {
                        parentVNode.vchildren = [];
                    }
                    // add our child vnode to a specific index of the vnode's children
                    parentVNode.vchildren[childVNodeSplt[1]] = childVNode;
                    // this is now the new parent vnode for all the next child checks
                    parentVNode = childVNode;
                    // if there's a trailing period, then it means there aren't any
                    // more nested elements, but maybe nested text nodes
                    // either way, don't keep walking down the tree after this next call
                    checkNestedElements = childVNodeSplt[2] !== '';
                }
            }
            // keep drilling down through the elements
            for (var i = 0; i < node.childNodes.length; i++) {
                addChildSsrVNodes(domApi, node.childNodes[i], parentVNode, ssrVNodeId, checkNestedElements);
            }
        } else if (nodeType === TEXT_NODE && (previousComment = node.previousSibling) && domApi.$nodeType(previousComment) === COMMENT_NODE) {
            // split the start comment's data with a period
            childVNodeSplt = domApi.$getTextContent(previousComment).split('.');
            // ensure this is an ssr text node start comment
            // which should start with an "s" and delimited by periods
            if (childVNodeSplt[0] === 's' && childVNodeSplt[1] === ssrVNodeId) {
                // cool, this is a text node and it's got a start comment
                childVNode = t(domApi.$getTextContent(node));
                childVNode.elm = node;
                // this is a new child vnode
                // so ensure its parent vnode has the vchildren array
                if (!parentVNode.vchildren) {
                    parentVNode.vchildren = [];
                }
                // add our child vnode to a specific index of the vnode's children
                parentVNode.vchildren[childVNodeSplt[2]] = childVNode;
            }
        }
    }
    function assignHostContentSlots(domApi, elm, slotMeta) {
        // compiler has already figured out if this component has slots or not
        // if the component doesn't even have slots then we'll skip over all of this code
        var childNodes = elm.childNodes;
        if (slotMeta === HAS_NAMED_SLOTS) {
            // looks like this component has named slots
            // so let's loop through each of the childNodes to the host element
            // and pick out the ones that have a slot attribute
            // if it doesn't have a slot attribute, than it's a default slot
            var slotName = void 0;
            var defaultSlot = void 0;
            var namedSlots = void 0;
            for (var i = 0, childNodeLen = childNodes.length; i < childNodeLen; i++) {
                var childNode = childNodes[i];
                if (domApi.$nodeType(childNode) === 1 && (slotName = domApi.$getAttribute(childNode, 'slot')) != null) {
                    // is element node
                    // this element has a slot name attribute
                    // so this element will end up getting relocated into
                    // the component's named slot once it renders
                    namedSlots = namedSlots || {};
                    if (namedSlots[slotName]) {
                        namedSlots[slotName].push(childNode);
                    } else {
                        namedSlots[slotName] = [childNode];
                    }
                } else {
                    // this is a text node
                    // or it's an element node that doesn't have a slot attribute
                    // let's add this node to our collection for the default slot
                    if (defaultSlot) {
                        defaultSlot.push(childNode);
                    } else {
                        defaultSlot = [childNode];
                    }
                }
            }
            // keep a reference to all of the initial nodes
            // found as immediate childNodes to the host element
            elm._hostContentNodes = {
                defaultSlot: defaultSlot,
                namedSlots: namedSlots
            };
        } else if (slotMeta === HAS_SLOTS) {
            // this component doesn't have named slots, but it does
            // have at least a default slot, so the work here is alot easier than
            // when we're not looping through each element and reading attribute values
            elm._hostContentNodes = {
                defaultSlot: childNodes.length ? Array.apply(null, childNodes) : null
            };
        }
    }

    function isDef(v) {
        return v !== undefined && v !== null;
    }
    function isUndef(v) {
        return v === undefined || v === null;
    }

    function isObject(v) {
        return v !== null && typeof v === 'object';
    }

    function isFunction(v) {
        return typeof v === 'function';
    }

    function toDashCase(str) {
        return str.replace(/([A-Z])/g, function (g) {
            return '-' + g[0].toLowerCase();
        });
    }

    function noop() {}

    function getElementReference(elm, ref) {
        if (ref === 'child') {
            return elm.firstElementChild;
        }
        if (ref === 'parent') {
            return getParentElement(elm) || elm;
        }
        if (ref === 'body') {
            return elm.ownerDocument.body;
        }
        if (ref === 'document') {
            return elm.ownerDocument;
        }
        if (ref === 'window') {
            return elm.ownerDocument.defaultView;
        }
        return elm;
    }
    function getParentElement(elm) {
        if (elm.parentElement) {
            // normal element with a parent element
            return elm.parentElement;
        }
        if (elm.parentNode && elm.parentNode.host) {
            // shadow dom's document fragment
            return elm.parentNode.host;
        }
        return null;
    }

    var EMPTY = {};
    var DEFAULT_OPTS = null;
    function updateElement(plt, nodeOps, oldVnode, newVnode) {
        var isUpdate = oldVnode != null;
        oldVnode = oldVnode || EMPTY;
        newVnode = newVnode || EMPTY;
        var key,
            cur,
            elm = newVnode.elm,
            oldData,
            newData;
        // update attrs
        if (oldVnode.vattrs || newVnode.vattrs) {
            oldData = oldVnode.vattrs || EMPTY;
            newData = newVnode.vattrs || EMPTY;
            // update modified attributes, add new attributes
            for (key in newData) {
                cur = newData[key];
                if (oldData[key] !== cur) {
                    if (BOOLEAN_ATTRS[key] === 1) {
                        if (cur) {
                            nodeOps.$setAttribute(elm, key, '');
                        } else {
                            nodeOps.$removeAttribute(elm, key);
                        }
                    } else {
                        if (key.charCodeAt(0) !== 120 /* xChar */) {
                                nodeOps.$setAttribute(elm, key, cur);
                            } else if (key.charCodeAt(3) === 58 /* colonChar */) {
                                // Assume xml namespace
                                nodeOps.$setAttributeNS(elm, XML_NS$1, key, cur);
                            } else if (key.charCodeAt(5) === 58 /* colonChar */) {
                                // Assume xlink namespace
                                nodeOps.$setAttributeNS(elm, XLINK_NS$1, key, cur);
                            } else {
                            nodeOps.$setAttribute(elm, key, cur);
                        }
                    }
                }
            }
            // remove removed attributes
            // use `in` operator since the previous `for` iteration uses it (.i.e. add even attributes with undefined value)
            // the other option is to remove all attributes with value == undefined
            if (isUpdate) {
                for (key in oldData) {
                    if (!(key in newData)) {
                        nodeOps.$removeAttribute(elm, key);
                    }
                }
            }
        }
        // update class
        if (oldVnode.vclass || newVnode.vclass) {
            oldData = oldVnode.vclass || EMPTY;
            newData = newVnode.vclass || EMPTY;
            if (isUpdate) {
                for (key in oldData) {
                    if (!newData[key]) {
                        elm.classList.remove(key);
                    }
                }
            }
            for (key in newData) {
                cur = newData[key];
                if (cur !== oldData[key]) {
                    elm.classList[newData[key] ? 'add' : 'remove'](key);
                }
            }
        }
        // update props
        if (oldVnode.vprops || newVnode.vprops) {
            oldData = oldVnode.vprops || EMPTY;
            newData = newVnode.vprops || EMPTY;
            if (isUpdate) {
                for (key in oldData) {
                    if (newData[key] === undefined) {
                        // only delete the old property when the
                        // new property is undefined, otherwise we'll
                        // end up deleting getters/setters
                        delete elm[key];
                    }
                }
            }
            for (key in newData) {
                cur = newData[key];
                if (oldData[key] !== cur && (key !== 'value' || elm[key] !== cur)) {
                    elm[key] = cur;
                }
            }
        }
        // update style
        if (oldVnode.vstyle || newVnode.vstyle) {
            oldData = oldVnode.vstyle || EMPTY;
            newData = newVnode.vstyle || EMPTY;
            if (isUpdate) {
                for (key in oldData) {
                    if (!newData[key]) {
                        elm.style[key] = '';
                    }
                }
            }
            for (key in newData) {
                cur = newData[key];
                if (cur !== oldData[key]) {
                    elm.style[key] = cur;
                }
            }
        }
        // update event listeners
        oldData = oldVnode.vlisteners;
        newData = newVnode.vlisteners;
        if (oldData || newData) {
            if (!DEFAULT_OPTS) {
                DEFAULT_OPTS = plt.getEventOptions();
            }
            // remove existing listeners which no longer used
            if (isUpdate && oldData && oldVnode.assignedListener) {
                // if element changed or deleted we remove all existing listeners unconditionally
                for (key in oldData) {
                    // remove listener if existing listener removed
                    if (!newData || !newData[key]) {
                        oldVnode.elm.removeEventListener(key, oldVnode.assignedListener, DEFAULT_OPTS);
                    }
                }
            }
            // add new listeners which has not already attached
            if (newData) {
                // reuse existing listener or create new
                cur = newVnode.assignedListener = oldVnode.assignedListener || createListener();
                // update vnode for listener
                cur.vnode = newVnode;
                // if element changed or added we add all needed listeners unconditionally
                for (key in newData) {
                    // add listener if new listener added
                    if (!oldData || !oldData[key]) {
                        elm.addEventListener(key, cur, DEFAULT_OPTS);
                    }
                }
            }
        }
    }
    function createListener() {
        return function handler(event) {
            handleEvent(event, handler.vnode);
        };
    }
    function handleEvent(event, vnode) {
        var eventName = event.type,
            on = vnode.vlisteners;
        // call event handler(s) if they exists
        if (on && on[eventName]) {
            invokeHandler(on[eventName], vnode, event);
        }
    }
    function invokeHandler(handler, vnode, event) {
        if (isFunction(handler)) {
            // call function handler
            handler.call(vnode, event, vnode);
        } else if (isObject(handler)) {
            // call handler with arguments
            if (isFunction(handler[0])) {
                // special case for single argument for performance
                if (handler.length === 2) {
                    handler[0].call(vnode, handler[1], event, vnode);
                } else {
                    var args = handler.slice(1);
                    args.push(event);
                    args.push(vnode);
                    handler[0].apply(vnode, args);
                }
            } else {
                // call multiple handlers
                for (var i = 0; i < handler.length; i++) {
                    invokeHandler(handler[i]);
                }
            }
        }
    }
    var BOOLEAN_ATTRS = {
        'allowfullscreen': 1,
        'async': 1,
        'autofocus': 1,
        'autoplay': 1,
        'checked': 1,
        'controls': 1,
        'disabled': 1,
        'enabled': 1,
        'formnovalidate': 1,
        'hidden': 1,
        'multiple': 1,
        'noresize': 1,
        'readonly': 1,
        'required': 1,
        'selected': 1,
        'spellcheck': 1
    };
    var XLINK_NS$1 = 'http://www.w3.org/1999/xlink';
    var XML_NS$1 = 'http://www.w3.org/XML/1998/namespace';

    /**
     * Virtual DOM patching algorithm based on Snabbdom by
     * Simon Friis Vindum (@paldepind)
     * Licensed under the MIT License
     * https://github.com/snabbdom/snabbdom/blob/master/LICENSE
     *
     * Modified for Stencil's renderer and slot projection
     */
    function createRenderer(plt, domApi) {
        // createRenderer() is only created once per app
        // the patch() function which createRenderer() returned is the function
        // which gets called numerous times by each component
        function createElm(vnode, parentElm, childIndex) {
            var i = 0;
            if (vnode.vtag === SLOT_TAG) {
                if (hostContentNodes) {
                    // special case for manually relocating host content nodes
                    // to their new home in either a named slot or the default slot
                    var namedSlot = vnode.vattrs && vnode.vattrs.name;
                    var slotNodes = void 0;
                    if (isDef(namedSlot)) {
                        // this vnode is a named slot
                        slotNodes = hostContentNodes.namedSlots && hostContentNodes.namedSlots[namedSlot];
                    } else {
                        // this vnode is the default slot
                        slotNodes = hostContentNodes.defaultSlot;
                    }
                    if (isDef(slotNodes)) {
                        // the host element has some nodes that need to be moved around
                        // we have a slot for the user's vnode to go into
                        // while we're moving nodes around, temporarily disable
                        // the disconnectCallback from working
                        plt.tmpDisconnected = true;
                        for (; i < slotNodes.length; i++) {
                            // remove the host content node from it's original parent node
                            // then relocate the host content node to its new slotted home
                            domApi.$appendChild(parentElm, domApi.$removeChild(domApi.$parentNode(slotNodes[i]), slotNodes[i]));
                        }
                        // done moving nodes around
                        // allow the disconnect callback to work again
                        plt.tmpDisconnected = false;
                    }
                }
                // this was a slot node, we do not create slot elements, our work here is done
                // no need to return any element to be added to the dom
                return null;
            }
            if (isDef(vnode.vtext)) {
                // create text node
                vnode.elm = domApi.$createTextNode(vnode.vtext);
            } else {
                // create element
                var elm = vnode.elm = vnode.vnamespace ? domApi.$createElementNS(vnode.vnamespace, vnode.vtag) : domApi.$createElement(vnode.vtag);
                // add css classes, attrs, props, listeners, etc.
                updateElement(plt, domApi, null, vnode);
                var children = vnode.vchildren;
                if (isDef(ssrId)) {
                    // SSR ONLY: this is an SSR render and this
                    // logic does not run on the client
                    // give this element the SSR child id that can be read by the client
                    domApi.$setAttribute(vnode.elm, SSR_CHILD_ID, ssrId + '.' + childIndex + (hasChildNodes(children) ? '' : '.'));
                }
                if (children) {
                    var childNode = void 0;
                    for (; i < children.length; ++i) {
                        // create the node
                        childNode = createElm(children[i], elm, i);
                        // return node could have been null
                        if (childNode) {
                            if (isDef(ssrId) && childNode.nodeType === 3) {
                                // SSR ONLY: add the text node's start comment
                                domApi.$appendChild(elm, domApi.$createComment('s.' + ssrId + '.' + i));
                            }
                            // append our new node
                            domApi.$appendChild(elm, childNode);
                            if (isDef(ssrId) && childNode.nodeType === 3) {
                                // SSR ONLY: add the text node's end comment
                                domApi.$appendChild(elm, domApi.$createComment('/'));
                            }
                        }
                    }
                }
            }
            return vnode.elm;
        }
        function addVnodes(parentElm, before, vnodes, startIdx, endIdx) {
            var childNode = void 0;
            for (; startIdx <= endIdx; ++startIdx) {
                var vnodeChild = vnodes[startIdx];
                if (isDef(vnodeChild)) {
                    if (isDef(vnodeChild.vtext)) {
                        childNode = domApi.$createTextNode(vnodeChild.vtext);
                    } else {
                        childNode = createElm(vnodeChild, parentElm, startIdx);
                    }
                    if (isDef(childNode)) {
                        vnodeChild.elm = childNode;
                        domApi.$insertBefore(parentElm, childNode, before);
                    }
                }
            }
        }
        function removeVnodes(parentElm, vnodes, startIdx, endIdx) {
            for (; startIdx <= endIdx; ++startIdx) {
                var vnode = vnodes[startIdx];
                if (isDef(vnode)) {
                    if (isDef(vnode.elm)) {
                        invokeDestroy(vnode);
                    }
                    domApi.$removeChild(parentElm, vnode.elm);
                }
            }
        }
        function updateChildren(parentElm, oldCh, newCh) {
            var oldStartIdx = 0,
                newStartIdx = 0;
            var oldEndIdx = oldCh.length - 1;
            var oldStartVnode = oldCh[0];
            var oldEndVnode = oldCh[oldEndIdx];
            var newEndIdx = newCh.length - 1;
            var newStartVnode = newCh[0];
            var newEndVnode = newCh[newEndIdx];
            var oldKeyToIdx = void 0;
            var idxInOld = void 0;
            var elmToMove = void 0;
            var node = void 0;
            while (oldStartIdx <= oldEndIdx && newStartIdx <= newEndIdx) {
                if (oldStartVnode == null) {
                    oldStartVnode = oldCh[++oldStartIdx]; // Vnode might have been moved left
                } else if (oldEndVnode == null) {
                    oldEndVnode = oldCh[--oldEndIdx];
                } else if (newStartVnode == null) {
                    newStartVnode = newCh[++newStartIdx];
                } else if (newEndVnode == null) {
                    newEndVnode = newCh[--newEndIdx];
                } else if (isSameVnode(oldStartVnode, newStartVnode)) {
                    patchVNode(oldStartVnode, newStartVnode);
                    oldStartVnode = oldCh[++oldStartIdx];
                    newStartVnode = newCh[++newStartIdx];
                } else if (isSameVnode(oldEndVnode, newEndVnode)) {
                    patchVNode(oldEndVnode, newEndVnode);
                    oldEndVnode = oldCh[--oldEndIdx];
                    newEndVnode = newCh[--newEndIdx];
                } else if (isSameVnode(oldStartVnode, newEndVnode)) {
                    patchVNode(oldStartVnode, newEndVnode);
                    domApi.$insertBefore(parentElm, oldStartVnode.elm, domApi.$nextSibling(oldEndVnode.elm));
                    oldStartVnode = oldCh[++oldStartIdx];
                    newEndVnode = newCh[--newEndIdx];
                } else if (isSameVnode(oldEndVnode, newStartVnode)) {
                    patchVNode(oldEndVnode, newStartVnode);
                    domApi.$insertBefore(parentElm, oldEndVnode.elm, oldStartVnode.elm);
                    oldEndVnode = oldCh[--oldEndIdx];
                    newStartVnode = newCh[++newStartIdx];
                } else {
                    if (isUndef(oldKeyToIdx)) {
                        oldKeyToIdx = createKeyToOldIdx(oldCh, oldStartIdx, oldEndIdx);
                    }
                    idxInOld = oldKeyToIdx[newStartVnode.vkey];
                    if (isUndef(idxInOld)) {
                        // new element
                        node = createElm(newStartVnode, parentElm, newStartIdx);
                        newStartVnode = newCh[++newStartIdx];
                    } else {
                        elmToMove = oldCh[idxInOld];
                        if (elmToMove.vtag !== newStartVnode.vtag) {
                            node = createElm(newStartVnode, parentElm, idxInOld);
                        } else {
                            patchVNode(elmToMove, newStartVnode);
                            oldCh[idxInOld] = undefined;
                            node = elmToMove.elm;
                        }
                        newStartVnode = newCh[++newStartIdx];
                    }
                    if (node) {
                        domApi.$insertBefore(parentElm, node, oldStartVnode.elm);
                    }
                }
            }
            if (oldStartIdx > oldEndIdx) {
                addVnodes(parentElm, newCh[newEndIdx + 1] == null ? null : newCh[newEndIdx + 1].elm, newCh, newStartIdx, newEndIdx);
            } else if (newStartIdx > newEndIdx) {
                removeVnodes(parentElm, oldCh, oldStartIdx, oldEndIdx);
            }
        }
        function isSameVnode(vnode1, vnode2) {
            // compare if two vnode to see if they're "technically" the same
            // need to have the same element tag, and same key to be the same
            return vnode1.vtag === vnode2.vtag && vnode1.vkey === vnode2.vkey;
        }
        function createKeyToOldIdx(children, beginIdx, endIdx) {
            var i = void 0,
                map = {},
                key = void 0,
                ch = void 0;
            for (i = beginIdx; i <= endIdx; ++i) {
                ch = children[i];
                if (ch != null) {
                    key = ch.vkey;
                    if (key !== undefined) {
                        map.k = i;
                    }
                }
            }
            return map;
        }
        function patchVNode(oldVnode, newVnode) {
            var elm = newVnode.elm = oldVnode.elm;
            var oldChildren = oldVnode.vchildren;
            var newChildren = newVnode.vchildren;
            if (isUndef(newVnode.vtext)) {
                // element node
                if ((!isUpdate || !newVnode.skipDataOnUpdate) && newVnode.vtag !== SLOT_TAG) {
                    // either this is the first render of an element OR it's an update
                    // AND we already know it's possible it could have changed
                    // this updates the element's css classes, attrs, props, listeners, etc.
                    updateElement(plt, domApi, oldVnode, newVnode);
                }
                if (isDef(oldChildren) && isDef(newChildren)) {
                    // looks like there's child vnodes for both the old and new vnodes
                    if (!isUpdate || !newVnode.skipChildrenOnUpdate) {
                        // either this is the first render of an element OR it's an update
                        // AND we already know it's possible that the children could have changed
                        updateChildren(elm, oldChildren, newChildren);
                    }
                } else if (isDef(newChildren)) {
                    // no old child vnodes, but there are new child vnodes to add
                    if (isDef(oldVnode.vtext)) {
                        // the old vnode was text, so be sure to clear it out
                        domApi.$setTextContent(elm, '');
                    }
                    // add the new vnode children
                    addVnodes(elm, null, newChildren, 0, newChildren.length - 1);
                } else if (isDef(oldChildren)) {
                    // no new child vnodes, but there are old child vnodes to remove
                    removeVnodes(elm, oldChildren, 0, oldChildren.length - 1);
                }
            } else if (elm._hostContentNodes && elm._hostContentNodes.defaultSlot) {
                // this element has slotted content
                var parentElement = elm._hostContentNodes.defaultSlot[0].parentElement;
                domApi.$setTextContent(parentElement, newVnode.vtext);
                elm._hostContentNodes.defaultSlot = [parentElement.childNodes[0]];
            } else {
                // update the text content for the text only vnode
                domApi.$setTextContent(elm, newVnode.vtext);
            }
        }
        // internal variables to be reused per patch() call
        var isUpdate = void 0,
            hostContentNodes = void 0,
            ssrId = void 0;
        return function patch(oldVnode, newVnode, isUpdatePatch, hostElementContentNodes, ssrPatchId) {
            // patchVNode() is synchronous
            // so it is safe to set these variables and internally
            // the same patch() call will reference the same data
            isUpdate = isUpdatePatch;
            hostContentNodes = hostElementContentNodes;
            ssrId = ssrPatchId;
            // synchronous patch
            patchVNode(oldVnode, newVnode);
            if (isDef(ssrId)) {
                // SSR ONLY: we've been given an SSR id, so the host element
                // should be given the ssr id attribute
                domApi.$setAttribute(oldVnode.elm, SSR_VNODE_ID, ssrId);
            }
            // return our new vnode
            return newVnode;
        };
    }
    function invokeDestroy(vnode) {
        if (vnode.vlisteners && vnode.assignedListener) {
            for (var key in vnode.vlisteners) {
                vnode.elm.removeEventListener(key, vnode.vlisteners, false);
            }
        }
        if (isDef(vnode.vchildren)) {
            for (var i = 0; i < vnode.vchildren.length; ++i) {
                vnode.vchildren[i] && invokeDestroy(vnode.vchildren[i]);
            }
        }
    }
    function hasChildNodes(children) {
        // SSR ONLY: check if there are any more nested child elements
        // if there aren't, this info is useful so the client runtime
        // doesn't have to climb down and check so many elements
        if (children) {
            for (var i = 0; i < children.length; i++) {
                if (children[i].vtag !== SLOT_TAG || hasChildNodes(children[i].vchildren)) {
                    return true;
                }
            }
        }
        return false;
    }

    function getMode(domApi, config, elm) {
        var attrMode = domApi.$getAttribute(elm, 'mode');
        // first let's see if they set the mode directly on the property
        if (isDef(elm.mode)) {
            return elm.mode;
        }
        // next let's see if they set the mode on the elements attribute
        if (isDef(attrMode)) {
            return attrMode;
        }
        // ok fine, let's just get the values from the config
        return config.get('mode', 'md');
    }

    function attachListeners(plt, listeners, elm, instance) {
        if (listeners) {
            for (var i = 0; i < listeners.length; i++) {
                var listener = listeners[i];
                if (listener.eventEnabled !== false) {
                    (elm._listeners = elm._listeners || {})[listener.eventName] = addEventListener(plt, elm, listener.eventName, instance[listener.eventMethodName].bind(instance), listener);
                }
            }
        }
    }
    function enableListener(plt, elm, instance, eventName, shouldEnable, attachTo) {
        if (instance) {
            var listenerMeta = plt.getComponentMeta(elm).listenersMeta;
            if (listenerMeta) {
                var deregisterFns = elm._listeners = elm._listeners || {};
                for (var i = 0; i < listenerMeta.length; i++) {
                    var listener = listenerMeta[i];
                    if (listener.eventName === eventName) {
                        if (shouldEnable && !deregisterFns[eventName]) {
                            var attachToEventName = attachTo ? attachTo + ':' + eventName : eventName;
                            deregisterFns[eventName] = addEventListener(plt, instance.$el, attachToEventName, instance[listener.eventMethodName].bind(instance), listener);
                        } else if (!shouldEnable && deregisterFns[eventName]) {
                            deregisterFns[eventName]();
                            delete elm._listeners[eventName];
                        }
                        return;
                    }
                }
            }
        }
    }
    function addEventListener(plt, elm, eventName, userEventListener, opts) {
        if (!elm) {
            return noop;
        }
        var splt = eventName.split(':');
        if (splt.length > 1) {
            // document:mousemove
            // parent:touchend
            // body:keyup.enter
            elm = getElementReference(elm, splt[0]);
            eventName = splt[1];
        }
        if (!elm) {
            return noop;
        }
        splt = eventName.split('.');
        var testKeyCode = 0;
        if (splt.length > 1) {
            // keyup.enter
            eventName = splt[0];
            testKeyCode = KEY_CODE_MAP[splt[1]];
        }
        var eventListener = function (ev) {
            if (testKeyCode > 0 && ev.keyCode !== testKeyCode) {
                // we're looking for a specific keycode but this wasn't it
                return;
            }
            // fire the component's event listener callback
            userEventListener(ev);
            // test if this is the user's interaction
            if (isUserInteraction(eventName)) {
                // so it's very important to flush the queue now
                // so that the app reflects whatever they just did
                // basically don't let requestIdleCallback delay the important
                plt.queue.flush();
            }
        };
        var eventListenerOpts = plt.getEventOptions(opts);
        elm.addEventListener(eventName, eventListener, eventListenerOpts);
        return function removeListener() {
            if (elm) {
                elm.removeEventListener(eventName, eventListener, eventListenerOpts);
            }
        };
    }
    function isUserInteraction(eventName) {
        for (var i = 0; i < USER_INTERACTIONS.length; i++) {
            if (eventName.indexOf(USER_INTERACTIONS[i]) > -1) {
                return true;
            }
        }
        return false;
    }
    var USER_INTERACTIONS = ['touch', 'mouse', 'pointer', 'key', 'focus', 'blur', 'drag'];
    function detachListeners(elm) {
        var deregisterFns = elm._listeners;
        if (deregisterFns) {
            var eventNames = Object.keys(deregisterFns);
            for (var i = 0; i < eventNames.length; i++) {
                deregisterFns[eventNames[i]]();
            }
            elm._listeners = null;
        }
    }

    function parseComponentRegistry(cmpRegistryData, registry) {
        // tag name will always be upper case
        var cmpMeta = {
            tagNameMeta: cmpRegistryData[0],
            propsMeta: [
            // every component defaults to always have
            // the mode and color properties
            // but only observe the color attribute
            // mode cannot change after the component was created
            { propName: 'color', attribName: 'color' }, { propName: 'mode' }]
        };
        cmpMeta.moduleId = cmpRegistryData[1];
        // map of the modes w/ bundle id and style data
        cmpMeta.styleIds = cmpRegistryData[2] || {};
        // slot
        cmpMeta.slotMeta = cmpRegistryData[3];
        if (cmpRegistryData[4]) {
            // parse prop meta
            for (var i = 0; i < cmpRegistryData[4].length; i++) {
                var data = cmpRegistryData[4][i];
                cmpMeta.propsMeta.push({
                    propName: data[0],
                    attribName: data[1] === ATTR_LOWER_CASE ? data[0].toLowerCase() : toDashCase(data[0]),
                    propType: data[2],
                    isStateful: !!data[3]
                });
            }
        }
        // bundle load priority
        cmpMeta.loadPriority = cmpRegistryData[5];
        return registry[cmpMeta.tagNameMeta] = cmpMeta;
    }
    function parseComponentMeta(registry, moduleImports, cmpMetaData) {
        // tag name will always be upper case
        var cmpMeta = registry[cmpMetaData[0]];
        // get the component class which was added to moduleImports
        // using the tag as the key on the export object
        cmpMeta.componentModuleMeta = moduleImports[cmpMeta.tagNameMeta];
        // host
        cmpMeta.hostMeta = cmpMetaData[1];
        // component listeners
        if (cmpMetaData[2]) {
            cmpMeta.listenersMeta = [];
            for (var i = 0; i < cmpMetaData[2].length; i++) {
                var data = cmpMetaData[2][i];
                cmpMeta.listenersMeta.push({
                    eventMethodName: data[0],
                    eventName: data[1],
                    eventCapture: !!data[2],
                    eventPassive: !!data[3],
                    eventEnabled: !!data[4]
                });
            }
        }
        // component states
        cmpMeta.statesMeta = cmpMetaData[3];
        // component instance prop WILL change methods
        cmpMeta.propWillChangeMeta = cmpMetaData[4];
        // component instance prop DID change methods
        cmpMeta.propDidChangeMeta = cmpMetaData[5];
        // component methods
        cmpMeta.methodsMeta = cmpMetaData[6];
        return cmpMeta;
    }
    function parsePropertyValue(propType, propValue) {
        // ensure this value is of the correct prop type
        if (isDef(propValue)) {
            if (propType === TYPE_BOOLEAN) {
                // per the HTML spec, any string value means it is a boolean "true" value
                // but we'll cheat here and say that the string "false" is the boolean false
                return propValue === 'false' ? false : propValue === '' || !!propValue;
            }
            if (propType === TYPE_NUMBER) {
                // force it to be a number
                return parseFloat(propValue);
            }
        }
        // not sure exactly what type we want
        // so no need to change to a different type
        return propValue;
    }

    function attributeChangedCallback(plt, elm, attribName, oldVal, newVal) {
        // only react if the attribute values actually changed
        if (oldVal !== newVal) {
            // normalize the attribute name w/ lower case
            attribName = attribName.toLowerCase();
            // using the known component meta data
            // look up to see if we have a property wired up to this attribute name
            var prop = plt.getComponentMeta(elm).propsMeta.find(function (p) {
                return p.attribName === attribName;
            });
            if (prop) {
                // cool we've got a prop using this attribute name the value will
                // be a string, so let's convert it to the correct type the app wants
                // below code is ugly yes, but great minification ;)
                elm[prop.propName] = parsePropertyValue(prop.propType, newVal);
            }
        }
    }

    function connectedCallback(plt, elm) {
        // do not reconnect if we've already created an instance for this element
        if (!elm._hasConnected) {
            // first time we've connected
            elm._hasConnected = true;
            // if somehow this node was reused, ensure we've removed this property
            delete elm._hasDestroyed;
            // add to the queue to load the bundle
            // it's important to have an async tick in here so we can
            // ensure the "mode" attribute has been added to the element
            // place in high priority since it's not much work and we need
            // to know as fast as possible, but still an async tick in between
            plt.queue.add(function () {
                // get the component meta data about this component
                var cmpMeta = plt.getComponentMeta(elm);
                // async tick has happened, so all of the child
                // nodes and host attributes should now be in the DOM
                collectHostContent(plt, elm);
                // only collects slot references if this component even has slots
                plt.connectHostElement(elm, cmpMeta.slotMeta);
                // start loading this component mode's bundle
                // if it's already loaded then the callback will be synchronous
                plt.loadBundle(cmpMeta, elm, function loadComponentCallback() {
                    // we've fully loaded the component mode data
                    // let's queue it up to be rendered next
                    elm._queueUpdate();
                });
            }, PRIORITY_HIGH);
        }
    }
    function collectHostContent(plt, elm) {
        // find the first ancestor host element (if there is one) and register
        // this element as one of the actively loading child elements for its ancestor
        var ancestorHostElement = elm;
        while (ancestorHostElement = getParentElement(ancestorHostElement)) {
            // climb up the ancestors looking for the first registered component
            if (plt.getComponentMeta(ancestorHostElement)) {
                // we found this elements the first ancestor host element
                // if the ancestor already loaded then do nothing, it's too late
                if (!ancestorHostElement._hasLoaded) {
                    // keep a reference to this element's ancestor host element
                    elm._ancestorHostElement = ancestorHostElement;
                    // ensure there is an array to contain a reference to each of the child elements
                    // and set this element as one of the ancestor's child elements it should wait on
                    if (ancestorHostElement._activelyLoadingChildren) {
                        ancestorHostElement._activelyLoadingChildren.push(elm);
                    } else {
                        ancestorHostElement._activelyLoadingChildren = [elm];
                    }
                }
                break;
            }
        }
    }

    function disconnectedCallback(plt, elm) {
        // only disconnect if we're not temporarily disconnected
        // tmpDisconnected will happen when slot nodes are being relocated
        if (!plt.tmpDisconnected) {
            // ok, let's officially destroy this thing
            // set this to true so that any of our pending async stuff
            // doesn't continue since we already decided to destroy this node
            elm._hasDestroyed = true;
            // call instance Did Unload and destroy instance stuff
            // if we've created an instance for this
            var instance = elm.$instance;
            if (instance) {
                // call the user's componentDidUnload if there is one
                instance.componentDidUnload && instance.componentDidUnload();
                elm.$instance = instance.$el = instance.__values = instance.__values.__propWillChange = instance.__values.__propDidChange = null;
            }
            // detatch any event listeners that may have been added
            // this will also set _listeners to null if there are any
            detachListeners(elm);
            // destroy the vnode and child vnodes if they exist
            elm._vnode && invokeDestroy(elm._vnode);
            if (elm._hostContentNodes) {
                // overreacting here just to reduce any memory leak issues
                elm._hostContentNodes = elm._hostContentNodes.defaultSlot = elm._hostContentNodes.namedSlots = null;
            }
            // fuhgeddaboudit
            // set it all to null to ensure we forget references
            // and reset values incase this node gets reused somehow
            // (possible that it got disconnected, but the node was reused)
            elm._root = elm._vnode = elm._ancestorHostElement = elm._activelyLoadingChildren = elm._hasConnected = elm._isQueuedForUpdate = elm._hasLoaded = null;
        }
    }

    function queueUpdate(plt, elm) {
        // only run patch if it isn't queued already
        if (!elm._isQueuedForUpdate) {
            elm._isQueuedForUpdate = true;
            // run the patch in the next tick
            plt.queue.add(function queueUpdateNextTick() {
                // no longer queued
                elm._isQueuedForUpdate = false;
                // vdom diff and patch the host element for differences
                update(plt, elm);
            });
        }
    }
    function update(plt, elm) {
        // everything is async, so somehow we could have already disconnected
        // this node, so be sure to do nothing if we've already disconnected
        if (!elm._hasDestroyed) {
            var isInitialLoad = !elm.$instance;
            if (isInitialLoad) {
                // haven't created a component instance for this host element yet
                initInstance(plt, elm);
            }
            // if this component has a render function, let's fire
            // it off and generate a vnode for this
            elm._render(!isInitialLoad);
            if (isInitialLoad) {
                elm._initLoad();
            }
        }
    }

    function initProxy(plt, elm, instance, cmpMeta) {
        var i = 0;
        if (cmpMeta.methodsMeta) {
            // instances will already have the methods on them
            // but you can also expose methods to the proxy element
            // using @Method(). Think of like .focus() for an element.
            for (; i < cmpMeta.methodsMeta.length; i++) {
                initMethod(cmpMeta.methodsMeta[i], elm, instance);
            }
        }
        // used to store instance data internally so that we can add
        // getters/setters with the same name, and then do change detection
        var values = instance.__values = {};
        if (cmpMeta.propWillChangeMeta) {
            // this component has prop WILL change methods, so init the object to store them
            values.__propWillChange = {};
        }
        if (cmpMeta.propDidChangeMeta) {
            // this component has prop DID change methods, so init the object to store them
            values.__propDidChange = {};
        }
        if (cmpMeta.statesMeta) {
            // add getters/setters to instance properties that are not already set as @Prop()
            // these are instance properties that should trigger a render update when
            // they change. Like @Prop(), except data isn't passed in and is only state data.
            // Unlike @Prop, state properties do not add getters/setters to the proxy element
            // and initial values are not checked against the proxy element or config
            for (i = 0; i < cmpMeta.statesMeta.length; i++) {
                initProperty(false, true, '', cmpMeta.statesMeta[i], 0, instance, values, plt, elm, cmpMeta.propWillChangeMeta, cmpMeta.propDidChangeMeta);
            }
        }
        if (cmpMeta.propsMeta) {
            for (i = 0; i < cmpMeta.propsMeta.length; i++) {
                // add getters/setters for @Prop()s
                initProperty(true, cmpMeta.propsMeta[i].isStateful, cmpMeta.propsMeta[i].attribName, cmpMeta.propsMeta[i].propName, cmpMeta.propsMeta[i].propType, instance, instance.__values, plt, elm, cmpMeta.propWillChangeMeta, cmpMeta.propDidChangeMeta);
            }
        }
    }
    function initMethod(methodName, elm, instance) {
        // add a getter on the dom's element instance
        // pointed at the instance's method
        Object.defineProperty(elm, methodName, {
            configurable: true,
            value: instance[methodName].bind(instance)
        });
    }
    function initProperty(isProp, isStateful, attrName, propName, propType, instance, internalValues, plt, elm, propWillChangeMeta, propDidChangeMeta) {
        if (isProp) {
            // @Prop() property, so check initial value from the proxy element, instance
            // and config, before we create getters/setters on this same property name
            var hostAttrValue = elm.getAttribute(attrName);
            if (hostAttrValue !== null) {
                // looks like we've got an initial value from the attribute
                internalValues[propName] = parsePropertyValue(propType, hostAttrValue);
            } else if (elm[propName] !== undefined) {
                // looks like we've got an initial value on the proxy element
                internalValues[propName] = parsePropertyValue(propType, elm[propName]);
            } else if (instance[propName] !== undefined) {
                // looks like we've got an initial value on the instance already
                internalValues[propName] = instance[propName];
            } else if (propName === 'mode') {
                // special case for just "mode" property
                // which all component automatically get
                internalValues[propName] = plt.config.get(propName);
            }
        } else {
            // @State() property, so copy the value directly from the instance
            // before we create getters/setters on this same property name
            internalValues[propName] = instance[propName];
        }
        var i = 0;
        if (propWillChangeMeta) {
            // there are prop WILL change methods for this component
            for (i = 0; i < propWillChangeMeta.length; i++) {
                if (propWillChangeMeta[i][PROP_CHANGE_PROP_NAME] === propName) {
                    // cool, we should watch for changes to this property
                    // let's bind their watcher function and add it to our list
                    // of watchers, so any time this property changes we should
                    // also fire off their @PropWillChange() method
                    internalValues.__propWillChange[propName] = instance[propWillChangeMeta[i][PROP_CHANGE_METHOD_NAME]].bind(instance);
                }
            }
        }
        if (propDidChangeMeta) {
            // there are prop DID change methods for this component
            for (i = 0; i < propDidChangeMeta.length; i++) {
                if (propDidChangeMeta[i][PROP_CHANGE_PROP_NAME] === propName) {
                    // cool, we should watch for changes to this property
                    // let's bind their watcher function and add it to our list
                    // of watchers, so any time this property changes we should
                    // also fire off their @PropDidChange() method
                    internalValues.__propDidChange[propName] = instance[propDidChangeMeta[i][PROP_CHANGE_METHOD_NAME]].bind(instance);
                }
            }
        }
        function getValue() {
            // get the property value directly from our internal values
            return internalValues[propName];
        }
        function setValue(newVal) {
            // check our new property value against our internal value
            var oldVal = internalValues[propName];
            // TODO: account for Arrays/Objects
            if (newVal !== oldVal) {
                // gadzooks! the property's value has changed!!
                if (internalValues.__propWillChange && internalValues.__propWillChange[propName]) {
                    // this instance is watching for when this property WILL change
                    internalValues.__propWillChange[propName](newVal, oldVal);
                }
                // set our new value!
                internalValues[propName] = newVal;
                if (internalValues.__propDidChange && internalValues.__propDidChange[propName]) {
                    // this instance is watching for when this property DID change
                    internalValues.__propDidChange[propName](newVal, oldVal);
                }
                // looks like this value actually changed, we've got work to do!
                // queue that we need to do an update, don't worry
                // about queuing up millions cuz this function
                // ensures it only runs once
                queueUpdate(plt, elm);
            }
        }
        if (isProp) {
            // dom's element instance
            // only place getters/setters on element for props
            // state getters/setters should not be assigned to the element
            Object.defineProperty(elm, propName, {
                configurable: true,
                get: getValue,
                set: setValue
            });
        }
        // user's component class instance
        var instancePropDesc = {
            configurable: true,
            get: getValue
        };
        if (isStateful) {
            // this is a state property, or it's a prop that can keep state
            // for props it's mainly used for props on inputs like "checked"
            instancePropDesc.set = setValue;
        } else {
            // dev mode warning only
            instancePropDesc.set = function invalidSetValue() {
                // this is not a stateful prop
                // so do not update the instance or host element
                console.warn('@Prop() "' + propName + '" on "' + elm.tagName.toLowerCase() + '" cannot be modified.');
            };
        }
        // define on component class instance
        Object.defineProperty(instance, propName, instancePropDesc);
    }

    function createThemedClasses(mode, color, classList) {
        var allClassObj = {};
        return classList.split(' ').reduce(function (classObj, classString) {
            classObj[classString] = true;
            if (mode) {
                classObj[classString + '-' + mode] = true;
                if (color) {
                    classObj[classString + '-' + color] = true;
                    classObj[classString + '-' + mode + '-' + color] = true;
                }
            }
            return classObj;
        }, allClassObj);
    }

    function render(plt, elm, isUpdateRender) {
        var instance = elm.$instance;
        var cmpMeta = plt.getComponentMeta(elm);
        if (isUpdateRender) {
            // fire off the user's componentWillUpdate method (if one was provided)
            // componentWillUpdate runs BEFORE render() has been called
            // but only BEFORE an UPDATE and not before the intial render
            instance.componentWillUpdate && instance.componentWillUpdate();
        }
        // if this component has a render function, let's fire
        // it off and generate the child vnodes for this host element
        // note that we do not create the host element cuz it already exists
        var vnodeChildren = instance.render && instance.render();
        var vnodeHostData = instance.hostData && instance.hostData();
        var hostMeta = cmpMeta.hostMeta;
        if (vnodeChildren || vnodeHostData || hostMeta) {
            if (hostMeta) {
                vnodeHostData = Object.keys(hostMeta).reduce(function (hostData, key) {
                    switch (key) {
                        case 'theme':
                            hostData['class'] = hostData['class'] || {};
                            hostData['class'] = Object.assign(hostData['class'], createThemedClasses(instance.mode, instance.color, hostMeta['theme']));
                    }
                    return hostData;
                }, vnodeHostData || {});
            }
            // looks like we've got child nodes to render into this host element
            // or we need to update the css class/attrs on the host element
            // if we haven't already created a vnode, then we give the renderer the actual element
            // if this is a re-render, then give the renderer the last vnode we already created
            var oldVNode = elm._vnode || new VNode();
            oldVNode.elm = elm;
            // normalize host data keys to abbr. key
            if (vnodeHostData) {
                vnodeHostData.a = vnodeHostData['attrs'];
                vnodeHostData.c = vnodeHostData['class'];
                vnodeHostData.s = vnodeHostData['style'];
                vnodeHostData.o = vnodeHostData['on'];
            }
            // each patch always gets a new vnode
            // the host element itself isn't patched because it already exists
            // kick off the actual render and any DOM updates
            elm._vnode = plt.render(oldVNode, h(null, vnodeHostData, vnodeChildren), isUpdateRender, elm._hostContentNodes);
        }
        if (isUpdateRender) {
            // fire off the user's componentDidUpdate method (if one was provided)
            // componentDidUpdate runs AFTER render() has been called
            // but only AFTER an UPDATE and not after the intial render
            instance.componentDidUpdate && instance.componentDidUpdate();
        }
    }

    function initHostConstructor(plt, HostElementConstructor) {
        Object.defineProperties(HostElementConstructor, {
            'connectedCallback': {
                value: function () {
                    connectedCallback(plt, this);
                }
            },
            'attributeChangedCallback': {
                value: function (attribName, oldVal, newVal) {
                    attributeChangedCallback(plt, this, attribName, oldVal, newVal);
                }
            },
            'disconnectedCallback': {
                value: function () {
                    disconnectedCallback(plt, this);
                }
            },
            _queueUpdate: {
                value: function () {
                    queueUpdate(plt, this);
                }
            },
            _initLoad: {
                value: function () {
                    initLoad(plt, this);
                }
            },
            _render: {
                value: function (isInitialRender) {
                    render(plt, this, isInitialRender);
                }
            }
        });
    }
    function initInstance(plt, elm) {
        // using the component's class, let's create a new instance
        var cmpMeta = plt.getComponentMeta(elm);
        var instance = elm.$instance = new cmpMeta.componentModuleMeta();
        // let's automatically add a reference to the host element on the instance
        instance.$el = elm;
        // so we've got an host element now, and a actual instance
        // let's wire them up together with getter/settings
        // the setters are use for change detection and knowing when to re-render
        initProxy(plt, elm, instance, cmpMeta);
        // fire off the user's componentWillLoad method (if one was provided)
        // componentWillLoad only runs ONCE, after instance.$el has been assigned
        // the host element, but BEFORE render() has been called
        instance.componentWillLoad && instance.componentWillLoad();
    }
    function initLoad(plt, elm) {
        var instance = elm.$instance;
        // it's possible that we've already decided to destroy this element
        // check if this element has any actively loading child elements
        if (instance && !elm._hasDestroyed && (!elm._activelyLoadingChildren || !elm._activelyLoadingChildren.length)) {
            // cool, so at this point this element isn't already being destroyed
            // and it does not have any child elements that are still loading
            // ensure we remove any child references cuz it doesn't matter at this point
            elm._activelyLoadingChildren = null;
            // the element is within the DOM now, so let's attach the event listeners
            attachListeners(plt, plt.getComponentMeta(elm).listenersMeta, elm, instance);
            // sweet, this particular element is good to go
            // all of this element's children have loaded (if any)
            elm._hasLoaded = true;
            // fire off the user's componentDidLoad method (if one was provided)
            // componentDidLoad only runs ONCE, after instance.$el has been assigned
            // the host element, and AFTER render() has been called
            instance.componentDidLoad && instance.componentDidLoad();
            // add the css class that this element has officially hydrated
            elm.classList.add(HYDRATED_CSS);
            // ( •_•)
            // ( •_•)>⌐■-■
            // (⌐■_■)
            // load events fire from bottom to top, the deepest elements first then bubbles up
            // if this element did have an ancestor host element
            if (elm._ancestorHostElement) {
                // ok so this element already has a known ancestor host element
                // let's make sure we remove this element from its ancestor's
                // known list of child elements which are actively loading
                var ancestorsActivelyLoadingChildren = elm._ancestorHostElement._activelyLoadingChildren;
                var index = ancestorsActivelyLoadingChildren && ancestorsActivelyLoadingChildren.indexOf(elm);
                if (index > -1) {
                    // yup, this element is in the list of child elements to wait on
                    // remove it so we can work to get the length down to 0
                    ancestorsActivelyLoadingChildren.splice(index, 1);
                }
                // the ancestor's initLoad method will do the actual checks
                // to see if the ancestor is actually loaded or not
                // then let's call the ancestor's initLoad method if there's no length
                // (which actually ends up as this method again but for the ancestor)
                !ancestorsActivelyLoadingChildren.length && elm._ancestorHostElement._initLoad();
                // fuhgeddaboudit, no need to keep a reference after this element loaded
                delete elm._ancestorHostElement;
            }
        }
    }

    function initGlobal(Gbl, win, domApi, plt, config, domCtrl) {
        if (typeof win.CustomEvent !== 'function') {
            // CustomEvent polyfill
            var CustomEvent = function (event, params) {
                params = params || { bubbles: false, cancelable: false, detail: undefined };
                var evt = domApi.$createEvent();
                evt.initCustomEvent(event, params.bubbles, params.cancelable, params.detail);
                return evt;
            };

            CustomEvent.prototype = win.Event.prototype;
            win.CustomEvent = CustomEvent;
        }
        // properties that can stay hidden from public use
        var controllers = Gbl.controllers = {};
        Gbl.isClient = true;
        Gbl.isServer = false;
        // properties to be exposed to public
        // in actuality it's the exact same object
        Gbl.config = config;
        Gbl.dom = domCtrl;
        Gbl.emit = function (instance, eventName, data) {
            data = data || {};
            if (data.bubbles === undefined) {
                data.bubbles = true;
            }
            if (data.composed === undefined) {
                // https://developers.google.com/web/fundamentals/getting-started/primers/shadowdom#events
                data.composed = true;
            }
            if (Gbl.eventNameFn) {
                eventName = Gbl.eventNameFn(eventName);
            }
            instance && instance.$el && instance.$el.dispatchEvent(new win.CustomEvent(eventName, data));
        };
        Gbl.listener = {
            enable: function (instance, eventName, shouldEnable, attachTo) {
                enableListener(plt, instance.$el, instance, eventName, shouldEnable, attachTo);
            },
            add: function (elm, eventName, cb, opts) {
                return addEventListener(plt, elm, eventName, cb, opts);
            }
        };
        // used to store the queued controller promises to
        // be resolved when the controller finishes loading
        var queuedCtrlResolves = {};
        Gbl.controller = function (ctrlName, opts) {
            // loading a controller is always async so return a promise
            return new Promise(function (resolve) {
                // see if we already have the controller loaded
                var ctrl = controllers[ctrlName];
                if (ctrl) {
                    // we've already loaded this controller
                    resolveController(ctrl, resolve, opts);
                } else {
                    // oh noz! we haven't already loaded this controller yet!
                    var ctrlResolveQueue = queuedCtrlResolves[ctrlName];
                    if (ctrlResolveQueue) {
                        // cool we've already "started" to load the controller
                        // but it hasn't finished loading yet, so let's add
                        // this one also to the queue of to-be resolved promises
                        ctrlResolveQueue.push(resolve, opts);
                    } else {
                        // looks like we haven't even started the request
                        // yet lets add the component to the DOM and create
                        // a queue for this controller
                        queuedCtrlResolves[ctrlName] = [resolve, opts];
                        domApi.$appendChild(domApi.$body, domApi.$createElement('ion-' + ctrlName + '-controller'));
                    }
                }
            });
        };
        Gbl.loadController = function (ctrlName, ctrl) {
            // this method is called when the singleton
            // instance of our controller initially loads
            // add this controller instance to our map of controller singletons
            controllers[ctrlName] = ctrl;
            // check for to-be resolved controller promises
            var pendingCtrlResolves = queuedCtrlResolves[ctrlName];
            if (pendingCtrlResolves) {
                for (var i = 0; i < pendingCtrlResolves.length; i += 2) {
                    // first arg is the original promise's resolve
                    // which still needs to be resolved
                    // second arg was the originally passed in options
                    resolveController(ctrl, pendingCtrlResolves[i], pendingCtrlResolves[i + 1]);
                }
                // all good, go ahead and remove from the queue
                delete queuedCtrlResolves[ctrlName];
            }
        };
        function resolveController(ctrl, resolve, opts) {
            if (opts) {
                // if the call had options passed in then
                // it should run the controller's load() method
                // and let the controller's load() do the resolve
                // which then will resolve the user's promise
                ctrl.load(opts).then(resolve);
            } else {
                // no options passed in, so resolve with
                // the actual controller instance
                resolve(ctrl);
            }
        }
        return Gbl;
    }

    function createPlatformClient(Gbl, win, domApi, config, domCtrl, queue, staticDir) {
        var registry = { 'HTML': {} };
        var moduleImports = {};
        var moduleCallbacks = {};
        var loadedModules = {};
        var pendingModuleRequests = {};
        // create the platform api which will be passed around for external use
        var plt = {
            registerComponents: registerComponents,
            defineComponent: defineComponent,
            getComponentMeta: getComponentMeta,
            loadBundle: loadBundle,
            config: config,
            queue: queue,
            connectHostElement: connectHostElement,
            getEventOptions: getEventOptions
        };
        // create the renderer that will be used
        plt.render = createRenderer(plt, domApi);
        // create the global which will be injected into the user's instances
        var injectedGlobal = initGlobal(Gbl, win, domApi, plt, config, domCtrl);
        // setup the root element which is the mighty <html> tag
        // the <html> has the final say of when the app has loaded
        var rootElm = domApi.$documentElement;
        rootElm._activelyLoadingChildren = [];
        rootElm._initLoad = function appLoadedCallback() {
            // this will fire when all components have finished loaded
            rootElm._hasLoaded = true;
        };
        // if the HTML was generated from SSR
        // then let's walk the tree and generate vnodes out of the data
        createVNodesFromSsr(domApi, rootElm);
        function getComponentMeta(elm) {
            // get component meta using the element
            // important that the registry has upper case tag names
            return registry[elm.tagName];
        }
        function connectHostElement(elm, slotMeta) {
            // host element has been connected to the DOM
            if (!domApi.$getAttribute(elm, SSR_VNODE_ID)) {
                // this host element was NOT created with SSR
                // let's pick out the inner content for slot projection
                assignHostContentSlots(domApi, elm, slotMeta);
            }
        }
        function registerComponents(components) {
            // this is the part that just registers the minimal amount of data
            // it's basically a map of the component tag name to its associated external bundles
            return (components || []).map(function (data) {
                return parseComponentRegistry(data, registry);
            });
        }
        function defineComponent(cmpMeta, HostElementConstructor) {
            // initialize the properties on the component module prototype
            initHostConstructor(plt, HostElementConstructor.prototype);
            // add which attributes should be observed
            HostElementConstructor.observedAttributes = cmpMeta.propsMeta.filter(function (p) {
                return p.attribName;
            }).map(function (p) {
                return p.attribName;
            });
            // define the custom element
            win.customElements.define(cmpMeta.tagNameMeta.toLowerCase(), HostElementConstructor);
        }
        Gbl.defineComponents = function defineComponents(moduleId, importFn) {
            var args = arguments;
            // import component function
            // inject globals
            importFn(moduleImports, h, t, injectedGlobal);
            for (var i = 2; i < args.length; i++) {
                parseComponentMeta(registry, moduleImports, args[i]);
            }
            // fire off all the callbacks waiting on this module to load
            var callbacks = moduleCallbacks[moduleId];
            if (callbacks) {
                for (i = 0; i < callbacks.length; i++) {
                    callbacks[i]();
                }
                delete moduleCallbacks[moduleId];
            }
            // remember that we've already loaded this module
            loadedModules[moduleId] = true;
        };
        function loadBundle(cmpMeta, elm, cb) {
            var moduleId = cmpMeta.moduleId;
            if (loadedModules[moduleId]) {
                // sweet, we've already loaded this module
                cb();
            } else {
                // never seen this module before, let's start the request
                // and add it to the callbacks to fire when it has loaded
                if (moduleCallbacks[moduleId]) {
                    moduleCallbacks[moduleId].push(cb);
                } else {
                    moduleCallbacks[moduleId] = [cb];
                }
                // create the url we'll be requesting
                var url = getBundlePath(moduleId + '.js');
                if (!pendingModuleRequests[url]) {
                    // not already actively requesting this url
                    // remember that we're now actively requesting this url
                    pendingModuleRequests[url] = true;
                    // let's kick off the module request
                    jsonp(url);
                }
                // we also need to load the css file in the head
                var styleId = cmpMeta.styleIds[getMode(domApi, config, elm)] || cmpMeta.styleIds.$;
                if (styleId && !loadedModules[styleId]) {
                    // this style hasn't been added to the head yet
                    loadedModules[styleId] = true;
                    // append this link element to the head, which starts the request for the file
                    var linkElm = domApi.$createElement('link');
                    linkElm.href = getBundlePath(styleId + '.css');
                    linkElm.rel = 'stylesheet';
                    domApi.$insertBefore(domApi.$head, linkElm, domApi.$head.firstChild);
                }
            }
        }
        function getBundlePath(fileName) {
            return '' + staticDir + fileName;
        }
        function jsonp(url) {
            // create a sript element to add to the document.head
            var scriptElm = domApi.$createElement('script');
            scriptElm.charset = 'utf-8';
            scriptElm.async = true;
            scriptElm.src = url;
            // create a fallback timeout if something goes wrong
            var tmrId = setTimeout(onScriptComplete, 120000);
            function onScriptComplete() {
                clearTimeout(tmrId);
                scriptElm.onerror = scriptElm.onload = null;
                domApi.$removeChild(scriptElm.parentNode, scriptElm);
                // remove from our list of active requests
                delete pendingModuleRequests[url];
            }
            // add script completed listener to this script element
            scriptElm.onerror = scriptElm.onload = onScriptComplete;
            // inject a script tag in the head
            // kick off the actual request
            domApi.$appendChild(domApi.$head, scriptElm);
        }
        // test if this browser supports event options or not
        var supportsEventOptions = false;
        try {
            win.addEventListener('evopt', null, Object.defineProperty({}, 'passive', {
                get: function () {
                    supportsEventOptions = true;
                }
            }));
        } catch (e) {}
        function getEventOptions(opts) {
            return supportsEventOptions ? {
                'capture': !!(opts && opts.capture),
                'passive': !(opts && opts.passive === false)
            } : !!(opts && opts.capture);
        }
        return plt;
    }

    function createQueueClient(domCtrl) {
        var now = domCtrl.now;
        var raf = domCtrl.raf;
        var highPromise = Promise.resolve();
        var highCallbacks = [];
        var mediumCallbacks = [];
        var lowCallbacks = [];
        var resolvePending = false;
        var ricPending = false;
        function doHighPriority() {
            // holy geez we need to get this stuff done and fast
            // all high priority callbacks should be fired off immediately
            while (highCallbacks.length > 0) {
                highCallbacks.shift()();
            }
            resolvePending = false;
        }
        function doWork() {
            var start = now();
            // always run all of the high priority work if there is any
            doHighPriority();
            while (mediumCallbacks.length > 0 && now() - start < 40) {
                mediumCallbacks.shift()();
            }
            if (mediumCallbacks.length === 0) {
                // we successfully drained the medium queue or the medium queue is empty
                // so now let's drain the low queue with our remaining time
                while (lowCallbacks.length > 0 && now() - start < 40) {
                    lowCallbacks.shift()();
                }
            }
            // check to see if we still have work to do
            if (ricPending = mediumCallbacks.length > 0 || lowCallbacks.length > 0) {
                // everyone just settle down now
                // we already don't have time to do anything in this callback
                // let's throw the next one in a requestAnimationFrame
                // so we can just simmer down for a bit
                raf(flush);
            }
        }
        function flush() {
            // always run all of the high priority work if there is any
            doHighPriority();
            // always force a bunch of medium callbacks to run, but still have
            // a throttle on how many can run in a certain time
            var start = now();
            while (mediumCallbacks.length > 0 && now() - start < 4) {
                mediumCallbacks.shift()();
            }
            if (ricPending = mediumCallbacks.length > 0 || lowCallbacks.length > 0) {
                // still more to do yet, but we've run out of time
                // let's let this thing cool off and try again in the next ric
                raf(doWork);
            }
        }
        function add(cb, priority) {
            if (priority === PRIORITY_HIGH) {
                // uses Promise.resolve() for next tick
                highCallbacks.push(cb);
                if (!resolvePending) {
                    // not already pending work to do, so let's tee it up
                    resolvePending = true;
                    highPromise.then(doHighPriority);
                }
            } else {
                if (priority === PRIORITY_LOW) {
                    lowCallbacks.push(cb);
                } else {
                    // defaults to medium priority
                    // uses requestIdleCallback
                    mediumCallbacks.push(cb);
                }
                if (!ricPending) {
                    // not already pending work to do, so let's tee it up
                    ricPending = true;
                    raf(doWork);
                }
            }
        }
        return {
            add: add,
            flush: flush
        };
    }

    function detectPlatforms(url, userAgent, platforms, defaultPlatform) {
        // bracket notation to ensure they're not property renamed
        var validPlatforms = platforms.filter(function (p) {
            return p['isMatch'] && p['isMatch'](url, userAgent);
        });
        if (!validPlatforms.length) {
            validPlatforms = platforms.filter(function (p) {
                return p['name'] === defaultPlatform;
            });
        }
        return validPlatforms;
    }
    function isPlatformMatch(url, userAgent, platformName, userAgentAtLeastHas, userAgentMustNotHave) {
        var queryValue = queryParam(url, 'ionicplatform');
        if (queryValue) {
            return queryValue === platformName;
        }
        if (userAgent) {
            userAgent = userAgent.toLowerCase();
            for (var i = 0; i < userAgentAtLeastHas.length; i++) {
                if (userAgent.indexOf(userAgentAtLeastHas[i]) > -1) {
                    for (var j = 0; j < userAgentMustNotHave.length; j++) {
                        if (userAgent.indexOf(userAgentMustNotHave[j]) > -1) {
                            return false;
                        }
                    }
                    return true;
                }
            }
        }
        return false;
    }
    function queryParam(url, key) {
        key = key.replace(/[\[]/, '\\[').replace(/[\]]/, '\\]');
        var regex = new RegExp('[\\?&]' + key + '=([^&#]*)');
        var results = regex.exec(url);
        return results ? decodeURIComponent(results[1].replace(/\+/g, ' ')) : null;
    }

    // order from most specifc to least specific
    var PLATFORM_CONFIGS = [{
        'name': 'ipad',
        'isMatch': function (url, userAgent) {
            return isPlatformMatch(url, userAgent, 'ipad', ['ipad'], ['windows phone']);
        }
    }, {
        'name': 'iphone',
        'isMatch': function (url, userAgent) {
            return isPlatformMatch(url, userAgent, 'iphone', ['iphone'], ['windows phone']);
        }
    }, {
        'name': 'ios',
        'settings': {
            'mode': 'ios'
        },
        'isMatch': function (url, userAgent) {
            return isPlatformMatch(url, userAgent, 'ios', ['iphone', 'ipad', 'ipod'], ['windows phone']);
        }
    }, {
        'name': 'android',
        'settings': {
            'activator': 'ripple',
            'mode': 'md'
        },
        'isMatch': function (url, userAgent) {
            return isPlatformMatch(url, userAgent, 'android', ['android', 'silk'], ['windows phone']);
        }
    }, {
        'name': 'windows',
        'settings': {
            'mode': 'wp'
        },
        'isMatch': function (url, userAgent) {
            return isPlatformMatch(url, userAgent, 'windows', ['windows phone'], []);
        }
    }, {
        'name': 'core',
        'settings': {
            'mode': 'md'
        }
    }];

    var Gbl = window[globalNamespace] = window[globalNamespace] || {};
    var domCtrl = createDomControllerClient(window);
    var plt = createPlatformClient(Gbl, window, createDomApi(document), createConfigController(Gbl.config, detectPlatforms(window.location.href, window.navigator.userAgent, PLATFORM_CONFIGS, 'core')), domCtrl, createQueueClient(domCtrl), Gbl.staticDir);
    plt.registerComponents(Gbl.components).forEach(function (cmpMeta) {
        function HostElement(self) {
            return HTMLElement.call(this, self);
        }
        HostElement.prototype = Object.create(HTMLElement.prototype, { constructor: { value: HostElement, configurable: true } });
        plt.defineComponent(cmpMeta, HostElement);
    });
})(window, document, "App");