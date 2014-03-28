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
     * Body collision detection
     * @module behaviors/body-collision-detection
     */
    Physics.behavior('body-collision-detection', function( parent ){
    
        var PUBSUB_CANDIDATES = 'collisions:candidates';
        var PUBSUB_COLLISION = 'collisions:detected';
    
        /**
         * Get a general support function for use with GJK algorithm
         * @param  {Object} bodyA First body
         * @param  {Object} bodyB Second body
         * @return {Function}       The support function
         */
        var getSupportFn = function getSupportFn( bodyA, bodyB ){
    
            var fn;
    
            fn = function( searchDir ){
    
                var scratch = Physics.scratchpad()
                    ,tA = scratch.transform().setTranslation( bodyA.state.pos ).setRotation( bodyA.state.angular.pos )
                    ,tB = scratch.transform().setTranslation( bodyB.state.pos ).setRotation( bodyB.state.angular.pos )
                    ,vA = scratch.vector()
                    ,vB = scratch.vector()
                    ,method = fn.useCore? 'getFarthestCorePoint' : 'getFarthestHullPoint'
                    ,marginA = fn.marginA
                    ,marginB = fn.marginB
                    ,ret
                    ;
    
                vA = bodyA.geometry[ method ]( searchDir.rotateInv( tA ), vA, marginA ).transform( tA );
                vB = bodyB.geometry[ method ]( searchDir.rotate( tA ).rotateInv( tB ).negate(), vB, marginB ).transform( tB );
    
                searchDir.negate().rotate( tB );
    
                ret = {
                    a: vA.values(),
                    b: vB.values(),
                    pt: vA.vsub( vB ).values() 
                };
                scratch.done();
                return ret;
            };
    
            fn.useCore = false;
            fn.margin = 0;
    
            return fn;
        };
    
        /**
         * Use GJK algorithm to check arbitrary bodies for collisions
         * @param  {Object} bodyA First body
         * @param  {Object} bodyB Second body
         * @return {Object}       Collision result
         */
        var checkGJK = function checkGJK( bodyA, bodyB ){
    
            var scratch = Physics.scratchpad()
                ,d = scratch.vector()
                ,tmp = scratch.vector()
                ,overlap
                ,result
                ,support
                ,collision = false
                ,aabbA = bodyA.aabb()
                ,dimA = Math.min( aabbA.halfWidth, aabbA.halfHeight )
                ,aabbB = bodyB.aabb()
                ,dimB = Math.min( aabbB.halfWidth, aabbB.halfHeight )
                ;
    
            // just check the overlap first
            support = getSupportFn( bodyA, bodyB );
            d.clone( bodyA.state.pos ).vsub( bodyB.state.pos );
            result = Physics.gjk(support, d, true);
    
            if ( result.overlap ){
    
                // there is a collision. let's do more work.
                collision = {
                    bodyA: bodyA,
                    bodyB: bodyB
                };
    
                // first get the min distance of between core objects
                support.useCore = true;
                support.marginA = 0;
                support.marginB = 0;
    
                while ( result.overlap && (support.marginA < dimA || support.marginB < dimB) ){
                    if ( support.marginA < dimA ){
                        support.marginA += 1;
                    }
                    if ( support.marginB < dimB ){
                        support.marginB += 1;
                    }
    
                    result = Physics.gjk(support, d);
                }
    
                if ( result.overlap || result.maxIterationsReached ){
                    scratch.done();
                    // This implementation can't deal with a core overlap yet
                    return false;
                }
    
                // calc overlap
                overlap = Math.max(0, (support.marginA + support.marginB) - result.distance);
                collision.overlap = overlap;
                // @TODO: for now, just let the normal be the mtv
                collision.norm = d.clone( result.closest.b ).vsub( tmp.clone( result.closest.a ) ).normalize().values();
                collision.mtv = d.mult( overlap ).values();
                // get a corresponding hull point for one of the core points.. relative to body A
                collision.pos = d.clone( collision.norm ).mult( support.margin ).vadd( tmp.clone( result.closest.a ) ).vsub( bodyA.state.pos ).values();
            }
    
            scratch.done();
            return collision;
        };
    
        /**
         * Check two circles for collisions
         * @param  {Object} bodyA First circle
         * @param  {Object} bodyB Second circle
         * @return {Object}       Collision result
         */
        var checkCircles = function checkCircles( bodyA, bodyB ){
    
            var scratch = Physics.scratchpad()
                ,d = scratch.vector()
                ,tmp = scratch.vector()
                ,overlap
                ,collision = false
                ;
            
            d.clone( bodyB.state.pos ).vsub( bodyA.state.pos );
            overlap = d.norm() - (bodyA.geometry.radius + bodyB.geometry.radius);
    
            // hmm... they overlap exactly... choose a direction
            if ( d.equals( Physics.vector.zero ) ){
    
                d.set( 1, 0 );
            }
    
            // if ( overlap > 0 ){
            //     // check the future
            //     d.vadd( tmp.clone(bodyB.state.vel).mult( dt ) ).vsub( tmp.clone(bodyA.state.vel).mult( dt ) );
            //     overlap = d.norm() - (bodyA.geometry.radius + bodyB.geometry.radius);
            // }
    
            if ( overlap <= 0 ){
    
                collision = {
                    bodyA: bodyA,
                    bodyB: bodyB,
                    norm: d.normalize().values(),
                    mtv: d.mult( -overlap ).values(),
                    pos: d.normalize().mult( bodyA.geometry.radius ).values(),
                    overlap: -overlap
                };
            }
        
            scratch.done();
            return collision;
        };
    
        /**
         * Check a pair for collisions
         * @param  {Object} bodyA First body
         * @param  {Object} bodyB Second body
         * @return {Object}       Collision result
         */
        var checkPair = function checkPair( bodyA, bodyB ){
    
            if ( bodyA.geometry.name === 'circle' && bodyB.geometry.name === 'circle' ){
    
                return checkCircles( bodyA, bodyB );
    
            } else {
    
                return checkGJK( bodyA, bodyB );
            }
        };
    
        var defaults = {
    
            // force check every pair of bodies in the world
            checkAll: false
        };
    
        return {
    
            /**
             * Initialization
             * @param  {Object} options Configuration options
             * @return {void}
             */
            init: function( options ){
    
                parent.init.call(this, options);
    
                this.options = Physics.util.extend({}, this.options, defaults, options);
            },
    
            /**
             * Connect to world. Automatically called when added to world by the setWorld method
             * @param  {Object} world The world to connect to
             * @return {void}
             */
            connect: function( world ){
    
                if ( this.options.checkAll ){
    
                    world.subscribe( 'integrate:velocities', this.checkAll, this );
    
                } else {
    
                    world.subscribe( PUBSUB_CANDIDATES, this.check, this );
                }
            },
    
            /**
             * Disconnect from world
             * @param  {Object} world The world to disconnect from
             * @return {void}
             */
            disconnect: function( world ){
    
                if ( this.options.checkAll ){
    
                    world.unsubscribe( 'integrate:velocities', this.checkAll );
    
                } else {
    
                    world.unsubscribe( PUBSUB_CANDIDATES, this.check );
                }
            },
    
            /**
             * Check pairs of objects that have been flagged by broad phase for possible collisions.
             * @param  {Object} data Event data
             * @return {void}
             */
            check: function( data ){
    
                var candidates = data.candidates
                    ,pair
                    ,collisions = []
                    ,ret
                    ;
    
                for ( var i = 0, l = candidates.length; i < l; ++i ){
                    
                    pair = candidates[ i ];
    
                    ret = checkPair( pair.bodyA, pair.bodyB );
    
                    if ( ret ){
                        collisions.push( ret );
                    }
                }
    
                if ( collisions.length ){
    
                    this._world.publish({
                        topic: PUBSUB_COLLISION,
                        collisions: collisions
                    });
                }
            },
    
            /**
             * Check all pairs of objects in the list for collisions
             * @param  {Object} data Event data
             * @return {void}
             */
            checkAll: function( data ){
    
                var bodies = data.bodies
                    ,dt = data.dt
                    ,bodyA
                    ,bodyB
                    ,collisions = []
                    ,ret
                    ;
    
                for ( var j = 0, l = bodies.length; j < l; j++ ){
                    
                    bodyA = bodies[ j ];
    
                    for ( var i = j + 1; i < l; i++ ){
    
                        bodyB = bodies[ i ];
    
                        // don't detect two fixed bodies
                        if ( !bodyA.fixed || !bodyB.fixed ){
                            
                            ret = checkPair( bodyA, bodyB );
    
                            if ( ret ){
                                collisions.push( ret );
                            }
                        }
                    }
                }
    
                if ( collisions.length ){
    
                    this._world.publish({
                        topic: PUBSUB_COLLISION,
                        collisions: collisions
                    });
                }
            }
        };
    
    });
    // end module: behaviors/body-collision-detection.js
    return Physics;
}));// UMD