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
     * Newtonian attraction between bodies (inverse square law)
     * @module behaviors/newtonian
     */
    Physics.behavior('newtonian', function( parent ){
    
        var defaults = {
    
            strength: 1
        };
    
        return {
    
            /**
             * Initialization
             * @param  {Object} options Configuration object
             * @return {void}
             */
            init: function( options ){
    
                // call parent init method
                parent.init.call(this, options);
    
                options = Physics.util.extend({}, defaults, options);
    
                this.strength = options.strength;
                this.tolerance = options.tolerance || 100 * this.strength;
            },
            
            /**
             * Apply newtonian acceleration between all bodies
             * @param  {Object} data Event data
             * @return {void}
             */
            behave: function( data ){
    
                var bodies = data.bodies
                    ,body
                    ,other
                    ,strength = this.strength
                    ,tolerance = this.tolerance
                    ,scratch = Physics.scratchpad()
                    ,pos = scratch.vector()
                    ,normsq
                    ,g
                    ;
    
                for ( var j = 0, l = bodies.length; j < l; j++ ){
                    
                    body = bodies[ j ];
    
                    for ( var i = j + 1; i < l; i++ ){
                        
                        other = bodies[ i ];
                        // clone the position
                        pos.clone( other.state.pos );
                        pos.vsub( body.state.pos );
                        // get the square distance
                        normsq = pos.normSq();
    
                        if (normsq > tolerance){
    
                            g = strength / normsq;
    
                            body.accelerate( pos.normalize().mult( g * other.mass ) );
                            other.accelerate( pos.mult( body.mass/other.mass ).negate() );
                        }
                    }
                }
    
                scratch.done();
            }
        };
    });
    
    // end module: behaviors/newtonian.js
    return Physics;
}));// UMD