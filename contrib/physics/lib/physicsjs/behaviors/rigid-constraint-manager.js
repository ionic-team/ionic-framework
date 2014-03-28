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
     * Rigid constraints manager.
     * Handles distance constraints
     * @module behaviors/rigid-constraint-manager
     */
    Physics.behavior('rigid-constraint-manager', function( parent ){
    
        var defaults = {
    
            // set a default target length
            targetLength: 20
        };
    
        return {
    
            /**
             * Initialization
             * @param  {Object} options Configuration object
             * @return {void}
             */
            init: function( options ){
    
                parent.init.call(this, options);
    
                Physics.util.extend(this.options, defaults, options);
    
                this._constraints = [];
            },
    
            /**
             * Connect to world. Automatically called when added to world by the setWorld method
             * @param  {Object} world The world to connect to
             * @return {void}
             */
            connect: function( world ){
    
                var intg = world.integrator();
    
                if ( intg && intg.name.indexOf('verlet') < 0 ){
    
                    throw 'The rigid constraint manager needs a world with a "verlet" compatible integrator.';
                }
    
                world.subscribe('integrate:positions', this.resolve, this);
            },
    
            /**
             * Disconnect from world
             * @param  {Object} world The world to disconnect from
             * @return {void}
             */
            disconnect: function( world ){
    
                world.unsubscribe('integrate:positions', this.resolve);
            },
    
            /**
             * Remove all constraints
             * @return {self}
             */
            drop: function(){
    
                // drop the current constraints
                this._constraints = [];
                return this;
            },
    
            /**
             * Constrain two bodies to a target relative distance
             * @param  {Object} bodyA        First body
             * @param  {Object} bodyB        Second body
             * @param  {Number} targetLength (optional) Target length. defaults to target length specified in configuration options
             * @return {object}              The constraint object, which holds .bodyA and .bodyB references to the bodies, .id the string ID of the constraint, .targetLength the target length
             */
            constrain: function( bodyA, bodyB, targetLength ){
    
                var cst;
    
                if (!bodyA || !bodyB){
    
                    return false;
                }
    
                this._constraints.push(cst = {
                    id: Physics.util.uniqueId('rigid-constraint'),
                    bodyA: bodyA,
                    bodyB: bodyB,
                    targetLength: targetLength || this.options.targetLength
                });
    
                return cst;
            },
    
            /**
             * Remove a constraint
             * @param  {Mixed} indexCstrOrId Either the constraint object, the constraint id, or the numeric index of the constraint
             * @return {self}
             */
            remove: function( indexCstrOrId ){
    
                var constraints = this._constraints
                    ,isObj
                    ;
    
                if (typeof indexCstrOrId === 'number'){
    
                    constraints.splice( indexCstrOrId, 1 );
                    return this;   
                }
    
                isObj = Physics.util.isObject( indexCstrOrId );
                
                for ( var i = 0, l = constraints.length; i < l; ++i ){
                    
                    if ( (isObj && constraints[ i ] === indexCstrOrId) ||
                        ( !isObj && constraints[ i ].id === indexCstrOrId) ){
    
                        constraints.splice( i, 1 );
                        return this;
                    }
                }
    
                return this;
            },
    
            /**
             * Resolve constraints
             * @return {void}
             */
            resolve: function(){
    
                var constraints = this._constraints
                    ,scratch = Physics.scratchpad()
                    ,A = scratch.vector()
                    ,BA = scratch.vector()
                    ,con
                    ,len
                    ,corr
                    ,proportion
                    ;
    
                for ( var i = 0, l = constraints.length; i < l; ++i ){
                
                    con = constraints[ i ];
    
                    // move constrained bodies to target length based on their
                    // mass proportions
                    A.clone( con.bodyA.state.pos );
                    BA.clone( con.bodyB.state.pos ).vsub( A );
                    len = BA.norm();
                    corr = ( len - con.targetLength ) / len;
                    
                    BA.mult( corr );
                    proportion = con.bodyB.mass / (con.bodyA.mass + con.bodyB.mass);
    
                    if ( !con.bodyA.fixed ){
    
                        BA.mult( proportion );
                        con.bodyA.state.pos.vadd( BA );
                        BA.mult( 1 / proportion );
                    }
    
                    if ( !con.bodyB.fixed ){
    
                        BA.mult( 1 - proportion );
                        con.bodyB.state.pos.vsub( BA );
                    }
                }
    
                scratch.done();
            },
    
            /**
             * Get an array of all constraints
             * @return {Array} The array of constraint objects
             */
            getConstraints: function(){
    
                return [].concat(this._constraints);
            }
        };
    });
    
    // end module: behaviors/rigid-constraint-manager.js
    return Physics;
}));// UMD