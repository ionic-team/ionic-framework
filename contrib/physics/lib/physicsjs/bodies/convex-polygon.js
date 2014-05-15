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
        define(['physicsjs','../geometries/convex-polygon'], factory);
    } else if (typeof exports === 'object') {
        module.exports = factory.apply(root, ['physicsjs','../geometries/convex-polygon'].map(require));
    } else {
        factory.call(root, root.Physics);
    }
}(this, function (Physics) {
    'use strict';
    /**
     * Convex Polygon Body
     * @module bodies/convex-polygon
     * @requires geometries/convex-polygon
     */
    Physics.body('convex-polygon', function( parent ){
    
        var defaults = {
            
        };
    
        return {
    
            /**
             * Initialization
             * @param  {Object} options Configuration options
             * @return {void}
             */
            init: function( options ){
    
                // call parent init method
                parent.init.call(this, options);
    
                options = Physics.util.extend({}, defaults, options);
    
                this.geometry = Physics.geometry('convex-polygon', {
                    vertices: options.vertices
                });
    
                this.recalc();
            },
    
            /**
             * Recalculate properties. Call when body physical properties are changed.
             * @return {this}
             */
            recalc: function(){
                parent.recalc.call(this);
                // moment of inertia
                this.moi = Physics.geometry.getPolygonMOI( this.geometry.vertices );
            }
        };
    });
    
    // end module: bodies/convex-polygon.js
    return Physics;
}));// UMD