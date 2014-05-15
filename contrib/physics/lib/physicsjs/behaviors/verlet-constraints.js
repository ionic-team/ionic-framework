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
     * Verlet constraints manager.
     * Handles distance constraints, and angle constraints
     * @module behaviors/rigid-constraint-manager
     */
    Physics.behavior('verlet-constraints', function( parent ){
    
        var TWOPI = 2 * Math.PI;
    
        var defaults = {
    
            // number of iterations to resolve constraints
            iterations: 2
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
    
                this._distanceConstraints = [];
                this._angleConstraints = [];
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
                this._distanceConstraints = [];
                this._angleConstraints = [];
                return this;
            },
    
            /**
             * Constrain two bodies to a target relative distance
             * @param  {Object} bodyA        First body
             * @param  {Object} bodyB        Second body
             * @param  {Number} targetLength (optional) Target length. defaults to target length specified in configuration options
             * @return {object}              The constraint object, which holds .bodyA and .bodyB references to the bodies, .id the string ID of the constraint, .targetLength the target length
             */
            distanceConstraint: function( bodyA, bodyB, stiffness, targetLength ){
    
                var cst;
    
                if (!bodyA || !bodyB){
    
                    return false;
                }
    
                cst = {
                    id: Physics.util.uniqueId('dis-constraint'),
                    type: 'dis',
                    bodyA: bodyA,
                    bodyB: bodyB,
                    stiffness: stiffness || 0.5,
                    targetLength: targetLength || bodyB.state.pos.dist( bodyA.state.pos )
                };
    
                cst.targetLengthSq = cst.targetLength * cst.targetLength;
    
                this._distanceConstraints.push( cst );
                return cst;
            },
    
            /**
             * Constrain three bodies to a target relative angle
             * @param  {Object} bodyA        First body
             * @param  {Object} bodyB        Second body
             * @param  {Object} bodyC        Third body
             * @param  {Number} targetLength (optional) Target length. defaults to target length specified in configuration options
             * @return {object}              The constraint object, which holds .bodyA and .bodyB references to the bodies, .id the string ID of the constraint, .targetLength the target length
             */
            angleConstraint: function( bodyA, bodyB, bodyC, stiffness, targetAngle ){
    
                var cst;
    
                if (!bodyA || !bodyB){
    
                    return false;
                }
    
                cst = {
                    id: Physics.util.uniqueId('ang-constraint'),
                    type: 'ang',
                    bodyA: bodyA,
                    bodyB: bodyB,
                    bodyC: bodyC,
                    stiffness: stiffness || 0.5,
                    targetAngle: targetAngle || bodyB.state.pos.angle2( bodyA.state.pos, bodyC.state.pos )
                };
    
                this._angleConstraints.push( cst );
                return cst;
            },
    
            /**
             * Remove a constraint
             * @param  {Mixed} indexCstrOrId Either the constraint object or the constraint id
             * @return {self}
             */
            remove: function( cstrOrId ){
    
                var constraints
                    ,type
                    ,isObj
                    ,i
                    ,l
                    ;
    
                isObj = Physics.util.isObject( cstrOrId );
    
                type = (isObj) ? cstrOrId.type : cstrOrId.substr(0, 3);
                constraints = ( type === 'ang' ) ? this._angleConstraints : this._distanceConstraints;
    
                if ( isObj ){
    
                    for ( i = 0, l = constraints.length; i < l; ++i ){
                        
                        if ( constraints[ i ] === cstrOrId ){
    
                            constraints.splice( i, 1 );
                            return this;
                        }
                    }
                } else {
    
                    for ( i = 0, l = constraints.length; i < l; ++i ){
                        
                        if ( constraints[ i ].id === cstrOrId ){
    
                            constraints.splice( i, 1 );
                            return this;
                        }
                    }
                }
    
                return this;
            },
    
            resolveAngleConstraints: function( coef ){
    
                var constraints = this._angleConstraints
                    ,scratch = Physics.scratchpad()
                    ,trans = scratch.transform()
                    ,con
                    ,ang
                    ,corr
                    ,proportion
                    ,invMassSum
                    ;
    
                for ( var i = 0, l = constraints.length; i < l; ++i ){
                
                    con = constraints[ i ];
    
                    ang = con.bodyB.state.pos.angle2( con.bodyA.state.pos, con.bodyC.state.pos );
                    corr = ang - con.targetAngle;
    
                    if (!corr){
    
                        continue;
    
                    } else if (corr <= -Math.PI){
                    
                        corr += TWOPI;
    
                    } else if (corr >= Math.PI){
                    
                        corr -= TWOPI;
                    }
    
                    trans.setTranslation( con.bodyB.state.pos );
    
                    corr *= -coef * con.stiffness;
    
                    if ( !con.bodyA.fixed && !con.bodyB.fixed && !con.bodyC.fixed ){
                        invMassSum = 1 / (con.bodyA.mass + con.bodyB.mass + con.bodyC.mass);
                    }
    
                    if ( !con.bodyA.fixed ){
    
                        if ( !con.bodyB.fixed && !con.bodyC.fixed ){
                            
                            ang = corr * (con.bodyB.mass + con.bodyC.mass) * invMassSum;
    
                        } else if ( con.bodyB.fixed ){
    
                            ang = corr * con.bodyC.mass / ( con.bodyC.mass + con.bodyA.mass );
    
                        } else {
    
                            ang = corr * con.bodyB.mass / ( con.bodyB.mass + con.bodyA.mass );
                        }
    
                        // ang = corr;
    
                        trans.setRotation( ang );
                        con.bodyA.state.pos.translateInv( trans );
                        con.bodyA.state.pos.rotate( trans );
                        con.bodyA.state.pos.translate( trans );
                    }
    
                    if ( !con.bodyC.fixed ){
    
                        if ( !con.bodyA.fixed && !con.bodyB.fixed ){
                            
                            ang = -corr * (con.bodyB.mass + con.bodyA.mass) * invMassSum;
    
                        } else if ( con.bodyB.fixed ){
    
                            ang = -corr * con.bodyA.mass / ( con.bodyC.mass + con.bodyA.mass );
                            
                        } else {
    
                            ang = -corr * con.bodyB.mass / ( con.bodyB.mass + con.bodyC.mass );
                        }
    
                        // ang = -corr;
    
                        trans.setRotation( ang );
                        con.bodyC.state.pos.translateInv( trans );
                        con.bodyC.state.pos.rotate( trans );
                        con.bodyC.state.pos.translate( trans );
                    }
    
                    if ( !con.bodyB.fixed ){
    
                        if ( !con.bodyA.fixed && !con.bodyC.fixed ){
                            
                            ang = corr * (con.bodyA.mass + con.bodyC.mass) * invMassSum;
    
                        } else if ( con.bodyA.fixed ){
    
                            ang = corr * con.bodyC.mass / ( con.bodyC.mass + con.bodyB.mass );
                            
                        } else {
    
                            ang = corr * con.bodyA.mass / ( con.bodyA.mass + con.bodyC.mass );
                        }
    
                        // ang = corr;
    
                        trans.setRotation( ang ).setTranslation( con.bodyA.state.pos );
                        con.bodyB.state.pos.translateInv( trans );
                        con.bodyB.state.pos.rotate( trans );
                        con.bodyB.state.pos.translate( trans );
    
                        trans.setTranslation( con.bodyC.state.pos );
                        con.bodyB.state.pos.translateInv( trans );
                        con.bodyB.state.pos.rotateInv( trans );
                        con.bodyB.state.pos.translate( trans );
                    }
                }
    
                scratch.done();
            },
    
            resolveDistanceConstraints: function( coef ){
    
                var constraints = this._distanceConstraints
                    ,scratch = Physics.scratchpad()
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
                    BA.clone( con.bodyB.state.pos ).vsub( con.bodyA.state.pos );
                    len = BA.normSq() || Math.random() * 0.0001;
                    corr = coef * con.stiffness * ( len - con.targetLengthSq ) / len;
                    
                    BA.mult( corr );
                    proportion = (con.bodyA.fixed || con.bodyB.fixed) ? 1 : con.bodyB.mass / (con.bodyA.mass + con.bodyB.mass);
    
                    if ( !con.bodyA.fixed ){
    
                        if ( !con.bodyB.fixed ){
                            BA.mult( proportion );
                        }
    
                        con.bodyA.state.pos.vadd( BA );
    
                        if ( !con.bodyB.fixed ){
                            BA.mult( 1 / proportion );
                        }
                    }
    
                    if ( !con.bodyB.fixed ){
    
                        if ( !con.bodyA.fixed ){
                            BA.mult( 1 - proportion );
                        }
    
                        con.bodyB.state.pos.vsub( BA );
                    }
                }
    
                scratch.done();
            },
    
            shuffleConstraints: function(){
    
                this._distanceConstraints = Physics.util.shuffle( this._distanceConstraints );
                this._angleConstraints = Physics.util.shuffle( this._angleConstraints );
            },
    
            /**
             * Resolve constraints
             * @return {void}
             */
            resolve: function(){
    
                var its = this.options.iterations
                    ,coef = 1 / its
                    ;
    
                for (var i = 0; i < its; i++){
    
                    // this.shuffleConstraints();
                    this.resolveDistanceConstraints( coef );
                    this.resolveAngleConstraints( coef );
                }
            },
    
            /**
             * Get all constraints
             * @return {Object} The object containing copied arrays of the constraints
             */
            getConstraints: function(){
    
                return {
                    distanceConstraints: [].concat(this._distanceConstraints),
                    angleConstraints: [].concat(this._angleConstraints)
                };
            }
        };
    });
    
    // end module: behaviors/verlet-constraints.js
    return Physics;
}));// UMD