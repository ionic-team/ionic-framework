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
        define(['physicsjs','../geometries/circle'], factory);
    } else if (typeof exports === 'object') {
        module.exports = factory.apply(root, ['physicsjs','../geometries/circle'].map(require));
    } else {
        factory.call(root, root.Physics);
    }
}(this, function (Physics) {
    'use strict';
    /**
     * Circle body definition
     * @module bodies/circle
     * @requires geometries/circle
     */
    Physics.body('circle', function( parent ){
    
        var defaults = {
            radius: 1.0
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
    
                this.geometry = Physics.geometry('circle', {
                    radius: options.radius
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
                this.moi = this.mass * this.geometry.radius * this.geometry.radius / 2;
            }
        };
    });
    
    // end module: bodies/circle.js
    return Physics;
}));// UMD