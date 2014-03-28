/**
 * PhysicsJS v0.5.4 - 2014-02-03
 * A modular, extendable, and easy-to-use physics engine for javascript
 * http://wellcaffeinated.net/PhysicsJS
 *
 * Copyright (c) 2014 Jasper Palfree <jasper@wellcaffeinated.net>
 * Licensed MIT
 */
(function (root, factory) {
    if (typeof define === 'function' && define.amd) {
        define(['physicsjs'], factory);
    } else if (typeof exports === 'object') {
        module.exports = factory.apply(root, ['physicsjs'].map(require));
    } else {
        factory.call(root, root.Physics);
    }
}(this, function (Physics) {
    'use strict';
    /**
     * A pathetically simple dom renderer
     */
    Physics.renderer('dom', function( proto ){
    
        if ( !document ){
            // must be in node environment
            return {};
        }
    
        // utility methods
        var thePrefix = {}
            ,tmpdiv = document.createElement("div")
            ,toTitleCase = function toTitleCase(str) {
                return str.replace(/(?:^|\s)\w/g, function(match) {
                    return match.toUpperCase();
                });
            }
            // return the prefixed name for the specified css property
            ,pfx = function pfx(prop) {
    
                if (thePrefix[prop]){
                    return thePrefix[prop];
                }
    
                var arrayOfPrefixes = ['Webkit', 'Moz', 'Ms', 'O']
                    ,name
                    ;
    
                for (var i = 0, l = arrayOfPrefixes.length; i < l; ++i) {
    
                    name = arrayOfPrefixes[i] + toTitleCase(prop);
    
                    if (name in tmpdiv.style){
                        return thePrefix[prop] = name;
                    }
                }
    
                if (name in tmpdiv.style){
                    return thePrefix[prop] = prop;
                }
    
                return false;
            }
            ;
    
        var classpfx = 'pjs-'
            ,px = 'px'
            ,cssTransform = pfx('transform')
            ;
    
        var newEl = function( node, content ){
                var el = document.createElement(node || 'div');
                if (content){
                    el.innerHTML = content;
                }
                return el;
            }
            ,drawBody
            ;
    
        // determine which drawBody method we can use
        if (cssTransform){
            drawBody = function( body, view ){
    
                var pos = body.state.pos;
                view.style[cssTransform] = 'translate('+pos.get(0)+'px,'+pos.get(1)+'px) rotate('+body.state.angular.pos+'rad)';
            };
        } else {
            drawBody = function( body, view ){
    
                var pos = body.state.pos;
                view.style.left = pos.get(0) + px;
                view.style.top = pos.get(1) + px;
            };
        }
    
        return {
    
            /**
             * Initialization
             * @param  {Object} options Config options passed by initializer
             * @return {void}
             */
            init: function( options ){
    
                // call proto init
                proto.init.call(this, options);
    
                var viewport = this.el;
                viewport.style.position = 'relative';
                viewport.style.overflow = 'hidden';
                viewport.style[cssTransform] = 'translateZ(0)'; // force GPU accel
                viewport.style.width = this.options.width + px;
                viewport.style.height = this.options.height + px;
    
                this.els = {};
    
                if (options.meta){
                    var stats = newEl();
                    stats.className = 'pjs-meta';
                    this.els.fps = newEl('span');
                    this.els.ipf = newEl('span');
                    stats.appendChild(newEl('span', 'fps: '));
                    stats.appendChild(this.els.fps);
                    stats.appendChild(newEl('br'));
                    stats.appendChild(newEl('span', 'ipf: '));
                    stats.appendChild(this.els.ipf);
    
                    viewport.appendChild(stats);
                }
            },
    
            /**
             * Set dom element style properties for a circle
             * @param  {HTMLElement} el       The element
             * @param  {Geometry} geometry The body's geometry
             * @return {void}
             */
            circleProperties: function( el, geometry ){
    
                var aabb = geometry.aabb();
    
                el.style.width = (aabb.halfWidth * 2) + px;
                el.style.height = (aabb.halfHeight * 2) + px;
                el.style.marginLeft = (-aabb.halfWidth) + px;
                el.style.marginTop = (-aabb.halfHeight) + px;
            },
    
            /**
             * Create a dom element for the specified geometry
             * @param  {Geometry} geometry The body's geometry
             * @return {HTMLElement}          The element
             */
            createView: function( geometry ){
    
                var el = newEl()
                    ,fn = geometry.name + 'Properties'
                    ;
    
                el.className = classpfx + geometry.name;
                el.style.position = 'absolute';            
                el.style.top = '0px';
                el.style.left = '0px';
                
                if (this[ fn ]){
                    this[ fn ](el, geometry);
                }
                
                this.el.appendChild( el );
                return el;
            },
    
            /**
             * Connect to world. Automatically called when added to world by the setWorld method
             * @param  {Object} world The world to connect to
             * @return {void}
             */
            connect: function( world ){
    
                world.subscribe( 'add:body', this.attach, this );
                world.subscribe( 'remove:body', this.detach, this );
            },
    
            /**
             * Disconnect from world
             * @param  {Object} world The world to disconnect from
             * @return {void}
             */
            disconnect: function( world ){
    
                world.unsubscribe( 'add:body', this.attach );
                world.unsubscribe( 'remove:body', this.detach );
            },
    
            /**
             * Detach a node from the DOM
             * @param  {HTMLElement|Object} data DOM node or event data (data.body)
             * @return {self}
             */
            detach: function( data ){
    
                // interpred data as either dom node or event data
                var el = (data.nodeType && data) || (data.body && data.body.view)
                    ,par = el && el.parentNode
                    ;
    
                if ( el && par ){
                    // remove view from dom
                    par.removeChild( el );
                }
    
                return this;
            },
    
            /**
             * Attach a node to the viewport
             * @param  {HTMLElement|Object} data DOM node or event data (data.body)
             * @return {self}
             */
            attach: function( data ){
    
                // interpred data as either dom node or event data
                var el = (data.nodeType && data) || (data.body && data.body.view)
                    ;
    
                if ( el ){
                    // attach to viewport
                    this.el.appendChild( el );
                }
    
                return this;
            },
    
            /**
             * Draw the meta data
             * @param  {Object} meta The meta data
             * @return {void}
             */
            drawMeta: function( meta ){
    
                this.els.fps.innerHTML = meta.fps.toFixed(2);
                this.els.ipf.innerHTML = meta.ipf;
            },
    
            /**
             * Update dom element to reflect body's current state
             * @param  {Body} body The body to draw
             * @param  {HTMLElement} view The view for that body
             * @return {void}
             */
            drawBody: drawBody
        };
    });
    
    // end module: renderers/dom.js
    return Physics;
}));// UMD