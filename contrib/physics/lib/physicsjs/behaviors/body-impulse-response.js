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
     * Body collision response
     * @module behaviors/body-collision-response
     */
    Physics.behavior('body-impulse-response', function( parent ){
        
        var defaults = {
    
        };
    
        var PUBSUB_COLLISION = 'collisions:detected';
    
        return {
    
            /**
             * Connect to world. Automatically called when added to world by the setWorld method
             * @param  {Object} world The world to connect to
             * @return {void}
             */
            connect: function( world ){
    
                world.subscribe( PUBSUB_COLLISION, this.respond, this );
            },
    
            /**
             * Disconnect from world
             * @param  {Object} world The world to disconnect from
             * @return {void}
             */
            disconnect: function( world ){
    
                world.unsubscribe( PUBSUB_COLLISION, this.respond );
            },
    
            /**
             * Collide two bodies by modifying their positions and velocities to conserve momentum
             * @param  {Object} bodyA   First Body
             * @param  {Object} bodyB   Second body
             * @param  {Vector} normal  Normal vector of the collision surface
             * @param  {Vector} point   Contact point of the collision
             * @param  {Vector} mtrans  Minimum transit vector that is the smallest displacement to separate the bodies
             * @param  {Boolean} contact Are the bodies in resting contact relative to each other
             * @return {void}
             */
            collideBodies: function(bodyA, bodyB, normal, point, mtrans, contact){
    
                var fixedA = bodyA.fixed
                    ,fixedB = bodyB.fixed
                    ,scratch = Physics.scratchpad()
                    // minimum transit vector for each body
                    ,mtv = scratch.vector().clone( mtrans )
                    ;
    
                // do nothing if both are fixed
                if ( fixedA && fixedB ){
                    scratch.done();
                    return;
                }
    
                if ( fixedA ){
    
                    // extract bodies
                    bodyB.state.pos.vadd( mtv );
                    
                } else if ( fixedB ){
    
                    // extract bodies
                    bodyA.state.pos.vsub( mtv );
    
                } else {
    
                    // extract bodies
                    mtv.mult( 0.5 );
                    bodyA.state.pos.vsub( mtv );
                    bodyB.state.pos.vadd( mtv );
                }
    
                // inverse masses and moments of inertia.
                // give fixed bodies infinite mass and moi
                var invMoiA = fixedA ? 0 : 1 / bodyA.moi
                    ,invMoiB = fixedB ? 0 : 1 / bodyB.moi
                    ,invMassA = fixedA ? 0 : 1 / bodyA.mass
                    ,invMassB = fixedB ? 0 : 1 / bodyB.mass
                    // coefficient of restitution between bodies
                    ,cor = contact ? 0 : bodyA.restitution * bodyB.restitution
                    // coefficient of friction between bodies
                    ,cof = bodyA.cof * bodyB.cof
                    // normal vector
                    ,n = scratch.vector().clone( normal )
                    // vector perpendicular to n
                    ,perp = scratch.vector().clone( n ).perp( true )
                    // collision point from A's center
                    ,rA = scratch.vector().clone( point )
                    // collision point from B's center
                    ,rB = scratch.vector().clone( point ).vadd( bodyA.state.pos ).vsub( bodyB.state.pos )
                    ,tmp = scratch.vector()
                    ,angVelA = bodyA.state.angular.vel
                    ,angVelB = bodyB.state.angular.vel
                    // relative velocity towards B at collision point
                    ,vAB = scratch.vector().clone( bodyB.state.vel )
                            .vadd( tmp.clone(rB).perp( true ).mult( angVelB ) )
                            .vsub( bodyA.state.vel )
                            .vsub( tmp.clone(rA).perp( true ).mult( angVelA ) )
                    // break up components along normal and perp-normal directions
                    ,rAproj = rA.proj( n )
                    ,rAreg = rA.proj( perp )
                    ,rBproj = rB.proj( n )
                    ,rBreg = rB.proj( perp )
                    ,vproj = vAB.proj( n ) // projection of vAB along n
                    ,vreg = vAB.proj( perp ) // rejection of vAB along n (perp of proj)
                    ,impulse
                    ,sign
                    ,max
                    ,inContact = false
                    ;
    
                // if moving away from each other... don't bother.
                if (vproj >= 0){
                    scratch.done();
                    return;
                }
    
                impulse =  - ((1 + cor) * vproj) / ( invMassA + invMassB + (invMoiA * rAreg * rAreg) + (invMoiB * rBreg * rBreg) );
                // vproj += impulse * ( invMass + (invMoi * rreg * rreg) );
                // angVel -= impulse * rreg * invMoi;
    
                
                if ( fixedA ){
    
                    // apply impulse
                    bodyB.state.vel.vadd( n.mult( impulse * invMassB ) );
                    bodyB.state.angular.vel -= impulse * invMoiB * rBreg;
                    
                } else if ( fixedB ){
    
                    // apply impulse
                    bodyA.state.vel.vsub( n.mult( impulse * invMassA ) );
                    bodyA.state.angular.vel += impulse * invMoiA * rAreg;
    
                } else {
    
                    // apply impulse
                    bodyB.state.vel.vadd( n.mult( impulse * invMassB ) );
                    bodyB.state.angular.vel -= impulse * invMoiB * rBreg;
                    bodyA.state.vel.vsub( n.mult( invMassA * bodyB.mass ) );
                    bodyA.state.angular.vel += impulse * invMoiA * rAreg;
                }
    
                // inContact = (impulse < 0.004);
                
                // if we have friction and a relative velocity perpendicular to the normal
                if ( cof && vreg ){
    
    
                    // TODO: here, we could first assume static friction applies
                    // and that the tangential relative velocity is zero.
                    // Then we could calculate the impulse and check if the
                    // tangential impulse is less than that allowed by static
                    // friction. If not, _then_ apply kinetic friction.
    
                    // instead we're just applying kinetic friction and making
                    // sure the impulse we apply is less than the maximum
                    // allowed amount
    
                    // maximum impulse allowed by kinetic friction
                    max = vreg / ( invMassA + invMassB + (invMoiA * rAproj * rAproj) + (invMoiB * rBproj * rBproj) );
    
                    if (!inContact){
                        // the sign of vreg ( plus or minus 1 )
                        sign = vreg < 0 ? -1 : 1;
    
                        // get impulse due to friction
                        impulse *= sign * cof;
                        // make sure the impulse isn't giving the system energy
                        impulse = (sign === 1) ? Math.min( impulse, max ) : Math.max( impulse, max );
                        
                    } else {
    
                        impulse = max;
                    }
    
                    if ( fixedA ){
    
                        // apply frictional impulse
                        bodyB.state.vel.vsub( perp.mult( impulse * invMassB ) );
                        bodyB.state.angular.vel -= impulse * invMoiB * rBproj;
                        
                    } else if ( fixedB ){
    
                        // apply frictional impulse
                        bodyA.state.vel.vadd( perp.mult( impulse * invMassA ) );
                        bodyA.state.angular.vel += impulse * invMoiA * rAproj;
    
                    } else {
    
                        // apply frictional impulse
                        bodyB.state.vel.vsub( perp.mult( impulse * invMassB ) );
                        bodyB.state.angular.vel -= impulse * invMoiB * rBproj;
                        bodyA.state.vel.vadd( perp.mult( invMassA * bodyB.mass ) );
                        bodyA.state.angular.vel += impulse * invMoiA * rAproj;
                    }  
                }
    
                scratch.done();
            },
    
            /**
             * Respond to collision event
             * @param  {Object} data Event data
             * @return {void}
             */
            respond: function( data ){
    
                var self = this
                    ,col
                    ,collisions = Physics.util.shuffle(data.collisions)
                    ;
    
                for ( var i = 0, l = collisions.length; i < l; ++i ){
                    
                    col = collisions[ i ];
                    self.collideBodies( 
                        col.bodyA,
                        col.bodyB,
                        col.norm,
                        col.pos,
                        col.mtv
                    );
                }
            }
        };
    });
    
    // end module: behaviors/body-impulse-response.js
    return Physics;
}));// UMD