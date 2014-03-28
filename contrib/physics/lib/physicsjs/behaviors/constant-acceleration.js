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
     * Constant acceleration behavior
     * @module behaviors/constant-acceleration
     */
    Physics.behavior('constant-acceleration', function( parent ){
    
        var defaults = {
    
            acc: { x : 0, y: 0.0004 }
        };
    
        return {
    
            /**
             * Initialization
             * @param  {Object} options Configuration object
             * @return {void}
             */
            init: function( options ){
    
                parent.init.call(this, options);
    
                // extend options
                this.options = Physics.util.extend(this.options, defaults, options);
                this._acc = Physics.vector();
                this.setAcceleration( this.options.acc );
            },
    
            /**
             * Set the acceleration of the behavior
             * @param {Vectorish} acc The acceleration vector
             * @return {self}
             */
            setAcceleration: function( acc ){
    
                this._acc.clone( acc );
                return this;
            },
    
            /**
             * Callback run on integrate:positions event
             * @param  {Object} data Event data
             * @return {void}
             */
            behave: function( data ){
    
                var bodies = data.bodies;
    
                for ( var i = 0, l = bodies.length; i < l; ++i ){
                    
                    bodies[ i ].accelerate( this._acc );
                }
            }
        };
    });
    // end module: behaviors/constant-acceleration.js
    return Physics;
}));// UMD