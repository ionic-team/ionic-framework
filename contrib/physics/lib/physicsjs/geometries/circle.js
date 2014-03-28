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
     * Circle geometry
     * @module geometries/circle
     */
    Physics.geometry('circle', function( parent ){
    
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
                this.radius = options.radius;
                this._aabb = Physics.aabb();
            },
                    
            /**
             * Get axis-aligned bounding box for this object (rotated by angle if specified).
             * @param  {Number} angle (optional) The angle to rotate the geometry.
             * @return {Object}       Bounding box values
             */
            aabb: function( angle ){
    
                var r = this.radius
                    ,aabb = this._aabb
                    ;
    
                // circles are symetric... so angle has no effect
                if ( aabb.halfWidth() === r ){
                    // don't recalculate
                    return aabb.get();
                }
    
                return aabb.set( -r, -r, r, r ).get();
            },
    
            /**
             * Get farthest point on the hull of this geometry
             * along the direction vector "dir"
             * returns local coordinates
             * replaces result if provided
             * @param {Vector} dir Direction to look
             * @param {Vector} result (optional) A vector to write result to
             * @return {Vector} The farthest hull point in local coordinates
             */
            getFarthestHullPoint: function( dir, result ){
    
                result = result || Physics.vector();
    
                return result.clone( dir ).normalize().mult( this.radius );
            },
    
            /**
             * Get farthest point on the core of this geometry
             * along the direction vector "dir"
             * returns local coordinates
             * replaces result if provided
             * @param {Vector} dir Direction to look
             * @param {Vector} result (optional) A vector to write result to
             * @return {Vector} The farthest core point in local coordinates
             */
            getFarthestCorePoint: function( dir, result, margin ){
    
                result = result || Physics.vector();
    
                // we can use the center of the circle as the core object
                // because we can project a point to the hull in any direction
                // ... yay circles!
                // but since the caller is expecting a certain margin... give it
                // to them
                return result.clone( dir ).normalize().mult( this.radius - margin );
            }
        };
    });
    
    // end module: geometries/circle.js
    return Physics;
}));// UMD