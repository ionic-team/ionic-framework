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
     * Sweep and Prune implementation for broad phase collision detection
     * @module behaviors/sweep-prune
     */
    Physics.behavior('sweep-prune', function( parent ){
    
        var PUBSUB_CANDIDATES = 'collisions:candidates';
        var uid = 1;
    
        /**
         * Get a unique numeric id for internal use
         * @return {Number} Unique id
         */
        var getUniqueId = function getUniqueId(){
    
            return uid++;
        };
    
        // add z: 2 to get this to work in 3D
        var dof = { x: 0, y: 1 }; // degrees of freedom
    
        /**
         * return hash for a pair of ids
         * @param  {Number} id1 First id
         * @param  {Number} id2 Second id
         * @return {Number}     Hash id
         */
        function pairHash( id1, id2 ){
    
            if ( id1 === id2 ){
    
                return false;
            }
    
            // valid for values < 2^16
            return id1 > id2? 
                (id1 << 16) | (id2 & 0xFFFF) : 
                (id2 << 16) | (id1 & 0xFFFF)
                ;
        }
        
        return {
    
            /**
             * Initialization
             * @param  {Object} options Configuration object
             * @return {void}
             */
            init: function( options ){
    
                parent.init.call(this, options);
    
                this.clear();
            },
    
            /**
             * Refresh tracking data
             * @return {void}
             */
            clear: function(){
    
                this.tracked = [];
                this.pairs = []; // pairs selected as candidate collisions by broad phase
                this.intervalLists = {}; // stores lists of aabb projection intervals to be sorted
                
                // init intervalLists
                for ( var xyz in dof ){
    
                    this.intervalLists[ xyz ] = [];
                }
            },
    
            /**
             * Connect to world. Automatically called when added to world by the setWorld method
             * @param  {Object} world The world to connect to
             * @return {void}
             */
            connect: function( world ){
    
                world.subscribe( 'add:body', this.trackBody, this );
                world.subscribe( 'remove:body', this.untrackBody, this );
                world.subscribe( 'integrate:velocities', this.sweep, this );
    
                // add current bodies
                var bodies = world.getBodies();
                for ( var i = 0, l = bodies.length; i < l; ++i ){
                    
                    this.trackBody({ body: bodies[ i ] });
                }
            },
    
            /**
             * Disconnect from world
             * @param  {Object} world The world to disconnect from
             * @return {void}
             */
            disconnect: function( world ){
    
                world.unsubscribe( 'add:body', this.trackBody );
                world.unsubscribe( 'remove:body', this.untrackBody );
                world.unsubscribe( 'integrate:velocities', this.sweep );
                this.clear();
            },
    
            /**
             * Execute the broad phase and get candidate collisions
             * @return {Array} List of candidates
             */
            broadPhase: function(){
    
                this.updateIntervals();
                this.sortIntervalLists();
                return this.checkOverlaps();
            },
    
            /**
             * Simple insertion sort for each axis
             * @return {void}
             */
            sortIntervalLists: function(){
    
                var list
                    ,len
                    ,i
                    ,hole
                    ,bound
                    ,boundVal
                    ,left
                    ,leftVal
                    ,axis
                    ;
    
                // for each axis...
                for ( var xyz in dof ){
    
                    // get the intervals for that axis
                    list = this.intervalLists[ xyz ];
                    i = 0;
                    len = list.length;
                    axis = dof[ xyz ];
    
                    // for each interval bound...
                    while ( (++i) < len ){
    
                        // store bound
                        bound = list[ i ];
                        boundVal = bound.val.get( axis );
                        hole = i;
    
                        left = list[ hole - 1 ];
                        leftVal = left && left.val.get( axis );
    
                        // while others are greater than bound...
                        while ( 
                            hole > 0 && 
                            (
                                leftVal > boundVal ||
                                // if it's an equality, only move it over if 
                                // the hole was created by a minimum
                                // and the previous is a maximum
                                // so that we detect contacts also
                                leftVal === boundVal &&
                                ( left.type && !bound.type )
                            )
                        ) {
    
                            // move others greater than bound to the right
                            list[ hole ] = left;
                            hole--;
                            left = list[ hole - 1 ];
                            leftVal = left && left.val.get( axis );
                        }
    
                        // insert bound in the hole
                        list[ hole ] = bound;
                    }
                }
            },
    
            /**
             * Get a pair object for the tracker objects
             * @param  {Object} tr1      First tracker
             * @param  {Object} tr2      Second tracker
             * @param  {Boolean} doCreate Create if not already found
             * @return {Mixed}          Pair object or null if not found
             */
            getPair: function(tr1, tr2, doCreate){
    
                var hash = pairHash( tr1.id, tr2.id );
    
                if ( hash === false ){
                    return null;
                }
    
                var c = this.pairs[ hash ];
    
                if ( !c ){
    
                    if ( !doCreate ){
                        return null;
                    }
    
                    c = this.pairs[ hash ] = {
                        bodyA: tr1.body,
                        bodyB: tr2.body,
                        flag: 0
                    };
                }
    
                return c;
            },
    
            /**
             * Check each axis for overlaps of bodies AABBs
             * @return {Array} List of candidate collisions 
             */
            checkOverlaps: function(){
    
                var isX
                    ,hash
                    ,tr1
                    ,tr2
                    ,bound
                    ,list
                    ,len
                    ,i
                    ,j
                    ,c
                    // determine which axis is the last we need to check
                    ,collisionFlag = ( dof.z || dof.y || dof.x )
                    ,encounters = []
                    ,enclen = 0
                    ,candidates = []
                    ;
    
                for ( var xyz in dof ){
    
                    // is the x coord
                    isX = (xyz === 'x');
                    // get the interval list for this axis
                    list = this.intervalLists[ xyz ];
                    i = -1;
                    len = list.length;
    
                    // for each interval bound
                    while ( (++i) < len ){
                        
                        bound = list[ i ];
                        tr1 = bound.tracker;
    
                        if ( bound.type ){
    
                            // is a max
    
                            j = enclen;
    
                            while ( (--j) >= 0 ){
    
                                tr2 = encounters[ j ];
    
                                // if they are the same tracked interval
                                if ( tr2 === tr1 ){
    
                                    // remove the interval from the encounters list
                                    // faster than .splice()
                                    if ( j < enclen - 1 ) {
                                        
                                        encounters[ j ] = encounters.pop();
    
                                    } else {
    
                                        // encountered a max right after a min... no overlap
                                        encounters.pop();
                                    }
    
                                    enclen--;
    
                                } else {
    
                                    // check if we have flagged this pair before
                                    // if it's the x axis, create a pair
                                    c = this.getPair( tr1, tr2, isX );
    
                                    if ( c ){
                                        
                                        // if it's the x axis, set the flag
                                        // to = 1.
                                        // if not, increment the flag by one.
                                        c.flag = isX? 0 : c.flag + 1;
    
                                        // c.flag will equal collisionFlag 
                                        // if we've incremented the flag
                                        // enough that all axes are overlapping
                                        if ( c.flag === collisionFlag ){
    
                                            // overlaps on all axes.
                                            // add it to possible collision
                                            // candidates list for narrow phase
    
                                            candidates.push( c );
                                        }
                                    }
                                }
                            }
    
                        } else {
    
                            // is a min
                            // just add this minimum to the encounters list
                            enclen = encounters.push( tr1 );
                        }
                    }
                }
    
                return candidates;
            },
    
            /**
             * Update position intervals on each axis
             * @return {[type]} [description]
             */
            updateIntervals: function(){
    
                var tr
                    ,intr
                    ,scratch = Physics.scratchpad()
                    ,pos = scratch.vector()
                    ,aabb = scratch.vector()
                    ,list = this.tracked
                    ,i = list.length
                    ;
    
                // for all tracked bodies
                while ( (--i) >= 0 ){
    
                    tr = list[ i ];
                    intr = tr.interval;
                    pos.clone( tr.body.state.pos );
                    aabb.clone( tr.body.aabb() );
    
                    // copy the position (plus or minus) the aabb bounds
                    // into the min/max intervals
                    intr.min.val.clone( pos ).vsub( aabb );
                    intr.max.val.clone( pos ).vadd( aabb );
                }
    
                scratch.done();
            },
    
            /**
             * Add body to list of those tracked by sweep and prune
             * @param  {Object} data Event data
             * @return {void}
             */
            trackBody: function( data ){
    
                var body = data.body
                    ,tracker = {
    
                        id: getUniqueId(),
                        body: body
                    }
                    ,intr = {
    
                        min: {
                            type: false, //min
                            val: Physics.vector(),
                            tracker: tracker
                        },
    
                        max: {
                            type: true, //max
                            val: Physics.vector(),
                            tracker: tracker
                        }
                    }
                    ;
    
                tracker.interval = intr;
                this.tracked.push( tracker );
                
                for ( var xyz in dof ){
    
                    this.intervalLists[ xyz ].push( intr.min, intr.max );
                }
            },
    
            /**
             * Remove body from list of those tracked
             * @param  {Object} data Event data
             * @return {void}
             */
            untrackBody: function( data ){
    
                var body = data.body
                    ,list
                    ,minmax
                    ,trackedList = this.tracked
                    ,tracker
                    ,count
                    ;
    
                for ( var i = 0, l = trackedList.length; i < l; ++i ){
    
                    tracker = trackedList[ i ];
                    
                    if ( tracker.body === body ){
    
                        // remove the tracker at this index
                        trackedList.splice(i, 1);
    
                        for ( var xyz in dof ){
    
                            count = 0;
                            list = this.intervalLists[ xyz ];
    
                            for ( var j = 0, m = list.length; j < m; ++j ){
                                    
                                minmax = list[ j ];
    
                                if ( minmax === tracker.interval.min || minmax === tracker.interval.max ){
    
                                    // remove interval from list
                                    list.splice(j, 1);
                                    j--;
                                    l--;
    
                                    if (count > 0){
                                        break;
                                    }
    
                                    count++;
                                }
                            }
                        }
    
                        break;
                    }
                }            
            },
    
            /**
             * Sweep and publish event if any candidate collisions are found
             * @param  {Object} data Event data
             * @return {void}
             */
            sweep: function( data ){
    
                var self = this
                    ,bodies = data.bodies
                    ,dt = data.dt
                    ,candidates
                    ;
    
                candidates = self.broadPhase();
                
                if ( candidates.length ){
    
                    this._world.publish({
                        topic: PUBSUB_CANDIDATES,
                        candidates: candidates
                    });
                }
            }
        };
    });
    // end module: behaviors/sweep-prune.js
    return Physics;
}));// UMD