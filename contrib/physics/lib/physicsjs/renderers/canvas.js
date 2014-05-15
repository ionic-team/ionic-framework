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
     * A simple canvas renderer.
     * Renders circles and convex-polygons
     */
    Physics.renderer('canvas', function( proto ){
    
        if ( !document ){
            // must be in node environment
            return {};
        }
    
        var Pi2 = Math.PI * 2
            // helper to create new dom elements
            ,newEl = function( node, content ){
                var el = document.createElement(node || 'div');
                if (content){
                    el.innerHTML = content;
                }
                return el;
            }
            ;
    
        var defaults = {
    
            // draw aabbs of bodies for debugging
            debug: false,
            // the element to place meta data into
            metaEl: null,
            // default styles of drawn objects
            styles: {
    
                'point' : 'rgba(80, 50, 100, 0.7)',
    
                'circle' : {
                    strokeStyle: 'rgba(70, 50, 100, 0.7)',
                    lineWidth: 1,
                    fillStyle: 'rgba(44, 105, 44, 0.7)',
                    angleIndicator: 'rgba(69, 51, 78, 0.7)'
                },
    
                'convex-polygon' : {
                    strokeStyle: 'rgba(80, 50, 100, 0.7)',
                    lineWidth: 1,
                    fillStyle: 'rgba(114, 105, 124, 0.7)',
                    angleIndicator: 'rgba(69, 51, 78, 0.7)'
                }
            },
            offset: {x: 0, y: 0}
        };
    
        // deep copy callback to extend deeper into options
        var deep = function( a, b ){
    
            if ( Physics.util.isPlainObject( b ) ){
    
                return Physics.util.extend({}, a, b, deep );
            }
    
            return b !== undefined ? b : a;
        };
    
        return {
    
            /**
             * Initialization
             * @param  {Object} options Config options passed by initializer
             * @return {void}
             */
            init: function( options ){
    
                // call proto init
                proto.init.call(this, options);
    
                // further options
                this.options = Physics.util.extend({}, defaults, this.options, deep);
                this.options.offset = Physics.vector( this.options.offset );
    
    
                // hidden canvas
                this.hiddenCanvas = document.createElement('canvas');
                this.hiddenCanvas.width = this.hiddenCanvas.height = 100;
                
                if (!this.hiddenCanvas.getContext){
                    throw "Canvas not supported";
                }
    
                this.hiddenCtx = this.hiddenCanvas.getContext('2d');
    
                // actual viewport
                var viewport = this.el;
                if (viewport.nodeName.toUpperCase() !== "CANVAS"){
    
                    viewport = document.createElement('canvas');
                    this.el.appendChild( viewport );
                    if (typeof this.options.el === 'string' && this.el === document.body){
                        viewport.id = this.options.el;
                    }
                    this.el = viewport;
                }
    
                viewport.width = this.options.width;
                viewport.height = this.options.height;
    
                this.ctx = viewport.getContext("2d");
    
                this.els = {};
    
                if (this.options.meta){
                    var stats = this.options.metaEl || newEl();
                    stats.className = 'pjs-meta';
                    this.els.fps = newEl('span');
                    this.els.ipf = newEl('span');
                    stats.appendChild(newEl('span', 'fps: '));
                    stats.appendChild(this.els.fps);
                    stats.appendChild(newEl('br'));
                    stats.appendChild(newEl('span', 'ipf: '));
                    stats.appendChild(this.els.ipf);
    
                    viewport.parentNode.insertBefore(stats, viewport);
                }
            },
    
            /**
             * Set the styles of specified context
             * @param {Object|String} styles Styles configuration for body drawing
             * @param {Canvas2DContext} ctx    (optional) Defaults to visible canvas context
             */
            setStyle: function( styles, ctx ){
    
                ctx = ctx || this.ctx;
    
                if ( Physics.util.isObject(styles) ){
    
                    ctx.strokeStyle = styles.strokeStyle;
                    ctx.fillStyle = styles.fillStyle;
                    ctx.lineWidth = styles.lineWidth;
    
                } else {
    
                    ctx.fillStyle = ctx.strokeStyle = styles;
                    ctx.lineWidth = 1;
                }
            },
    
            /**
             * Draw a circle to specified canvas context
             * @param  {Number} x      The x coord
             * @param  {Number} y      The y coord
             * @param  {Number} r      The circle radius
             * @param  {Object|String} styles The styles configuration
             * @param  {Canvas2DContext} ctx    (optional) The canvas context
             * @return {void}
             */
            drawCircle: function(x, y, r, styles, ctx){
    
                ctx = ctx || this.ctx;
    
                ctx.beginPath();
                this.setStyle( styles, ctx );
                ctx.arc(x, y, r, 0, Pi2, false);
                ctx.closePath();
                ctx.stroke();
                ctx.fill();
            },
    
            /**
             * Draw a polygon to specified canvas context
             * @param  {Array} verts  Array of vectorish vertices
             * @param  {Object|String} styles The styles configuration
             * @param  {Canvas2DContext} ctx    (optional) The canvas context
             * @return {void}
             */
            drawPolygon: function(verts, styles, ctx){
    
                var vert = verts[0]
                    ,x = vert.x === undefined ? vert.get(0) : vert.x
                    ,y = vert.y === undefined ? vert.get(1) : vert.y
                    ,l = verts.length
                    ;
    
                ctx = ctx || this.ctx;
                ctx.beginPath();
                this.setStyle( styles, ctx );
    
                ctx.moveTo(x, y);
    
                for ( var i = 1; i < l; ++i ){
                    
                    vert = verts[ i ];
                    x = vert.x === undefined ? vert.get(0) : vert.x;
                    y = vert.y === undefined ? vert.get(1) : vert.y;
                    ctx.lineTo(x, y);
                }
    
                if (l > 2){
                    ctx.closePath();
                }
    
                ctx.stroke();
                ctx.fill();
            },
    
            /**
             * Draw a line onto specified canvas context
             * @param  {Vectorish} from   Starting point
             * @param  {Vectorish} to     Ending point
             * @param  {Object|String} styles The styles configuration
             * @param  {Canvas2DContext} ctx    (optional) The canvas context
             * @return {void}
             */
            drawLine: function(from, to, styles, ctx){
    
                var x = from.x === undefined ? from.get(0) : from.x
                    ,y = from.y === undefined ? from.get(1) : from.y
                    ;
    
                ctx = ctx || this.ctx;
    
                ctx.beginPath();
                this.setStyle( styles, ctx );
    
                ctx.moveTo(x, y);
    
                x = to.x === undefined ? to.get(0) : to.x;
                y = to.y === undefined ? to.get(1) : to.y;
                
                ctx.lineTo(x, y);
                
                ctx.stroke();
                ctx.fill();
            },
    
            /**
             * Create a view for specified geometry.
             * @param  {Geometry} geometry The geometry
             * @param  {Object|String} styles The styles configuration
             * @return {Image}          An image cache of the geometry
             */
            createView: function( geometry, styles ){
    
                var view = new Image()
                    ,aabb = geometry.aabb()
                    ,hw = aabb.halfWidth + Math.abs(aabb.pos.x)
                    ,hh = aabb.halfHeight + Math.abs(aabb.pos.y)
                    ,x = hw + 1
                    ,y = hh + 1
                    ,hiddenCtx = this.hiddenCtx
                    ,hiddenCanvas = this.hiddenCanvas
                    ,name = geometry.name
                    ;
    
                styles = styles || this.options.styles[ name ];
    
                x += styles.lineWidth | 0;
                y += styles.lineWidth | 0;
                
                // clear
                hiddenCanvas.width = 2 * hw + 2 + (2 * styles.lineWidth|0);
                hiddenCanvas.height = 2 * hh + 2 + (2 * styles.lineWidth|0);
    
                hiddenCtx.save();
                hiddenCtx.translate(x, y);
    
                if (name === 'circle'){
    
                    this.drawCircle(0, 0, geometry.radius, styles, hiddenCtx);
    
                } else if (name === 'convex-polygon'){
    
                    this.drawPolygon(geometry.vertices, styles, hiddenCtx);
                }
    
                if (styles.angleIndicator){
    
                    hiddenCtx.beginPath();
                    this.setStyle( styles.angleIndicator, hiddenCtx );
                    hiddenCtx.moveTo(0, 0);
                    hiddenCtx.lineTo(hw, 0);
                    hiddenCtx.closePath();
                    hiddenCtx.stroke();
                }
    
                hiddenCtx.restore();
    
                view.src = hiddenCanvas.toDataURL("image/png");
                view.width = hiddenCanvas.width;
                view.height = hiddenCanvas.height;
                return view;
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
             * Callback to be run before rendering
             * @private
             * @return {void}
             */
            beforeRender: function(){
    
                // clear canvas
                this.ctx.clearRect(0, 0, this.el.width, this.el.height);
            },
    
            /**
             * Draw a body to canvas
             * @param  {Body} body The body to draw
             * @param  {Image} view The view for that body
             * @return {void}
             */
            drawBody: function( body, view ){
    
                var ctx = this.ctx
                    ,pos = body.state.pos
                    ,offset = this.options.offset
                    ,aabb = body.aabb()
                    ;
    
                ctx.save();
                ctx.translate(pos.get(0) + offset.get(0), pos.get(1) + offset.get(1));
                ctx.rotate(body.state.angular.pos);
                ctx.drawImage(view, -view.width/2, -view.height/2);
                ctx.restore();
    
                if ( this.options.debug ){
                    // draw bounding boxes
                    ctx.save();
                    ctx.translate(offset.get(0), offset.get(1));
                    this.drawPolygon([
                            { x: aabb.pos.x - aabb.x, y: aabb.pos.y - aabb.y },
                            { x: aabb.pos.x + aabb.x, y: aabb.pos.y - aabb.y },
                            { x: aabb.pos.x + aabb.x, y: aabb.pos.y + aabb.y },
                            { x: aabb.pos.x - aabb.x, y: aabb.pos.y + aabb.y }
                        ], 'rgba(100, 255, 100, 0.3)');
                    ctx.restore();
                }
            }
        };
    });
    
    // end module: renderers/canvas.js
    return Physics;
}));// UMD