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
     * Convex polygon geometry
     * @module geometries/convex-polygon
     */
    Physics.geometry('convex-polygon', function( parent ){
    
        var ERROR_NOT_CONVEX = 'Error: The vertices specified do not match that of a _convex_ polygon.';
    
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
    
                this.setVertices( options.vertices || [] );
            },
    
            /**
             * Set the vertices of the polygon shape. Vertices will be converted to be relative to the calculated centroid
             * @param {Array} hull The hull definition. Array of vectorish objects
             * @return {self}
             */
            setVertices: function( hull ){
    
                var scratch = Physics.scratchpad()
                    ,transl = scratch.transform()
                    ,verts = this.vertices = []
                    ;
    
                if ( !Physics.geometry.isPolygonConvex( hull ) ){
                    throw ERROR_NOT_CONVEX;
                }
    
                transl.setRotation( 0 );
                transl.setTranslation( Physics.geometry.getPolygonCentroid( hull ).negate() );
    
                // translate each vertex so that the centroid is at the origin
                // then add the vertex as a vector to this.vertices
                for ( var i = 0, l = hull.length; i < l; ++i ){
                    
                    verts.push( Physics.vector( hull[ i ] ).translate( transl ) );
                }
    
                this._area = Physics.geometry.getPolygonArea( verts );
    
                this._aabb = false;
                scratch.done();
                return this;
            },
            
            /**
             * Get axis-aligned bounding box for this object (rotated by angle if specified).
             * @param  {Number} angle (optional) The angle to rotate the geometry.
             * @return {Object}       Bounding box values
             */
            aabb: function( angle ){
    
                if (!angle && this._aabb){
                    return this._aabb.get();
                }
    
                var scratch = Physics.scratchpad()
                    ,p = scratch.vector()
                    ,trans = scratch.transform().setRotation( angle || 0 )
                    ,xaxis = scratch.vector().clone(Physics.vector.axis[0]).rotateInv( trans )
                    ,yaxis = scratch.vector().clone(Physics.vector.axis[1]).rotateInv( trans )
                    ,xmax = this.getFarthestHullPoint( xaxis, p ).proj( xaxis )
                    ,xmin = - this.getFarthestHullPoint( xaxis.negate(), p ).proj( xaxis )
                    ,ymax = this.getFarthestHullPoint( yaxis, p ).proj( yaxis )
                    ,ymin = - this.getFarthestHullPoint( yaxis.negate(), p ).proj( yaxis )
                    ,aabb
                    ;
    
                aabb = new Physics.aabb( xmin, ymin, xmax, ymax );
    
                if (!angle){
                    this._aabb = aabb;
                }
    
                scratch.done();
                return aabb.get();
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
            getFarthestHullPoint: function( dir, result, data ){
    
                var verts = this.vertices
                    ,val
                    ,prev
                    ,l = verts.length
                    ,i = 2
                    ,idx
                    ;
    
                result = result || Physics.vector();
    
                if ( l < 2 ){
                    if ( data ){
                        data.idx = 0;
                    }
                    return result.clone( verts[0] );
                }
    
                prev = verts[ 0 ].dot( dir );
                val = verts[ 1 ].dot( dir );
    
                if ( l === 2 ){
                    idx = (val >= prev) ? 1 : 0;
                    if ( data ){
                        data.idx = idx;
                    }
                    return result.clone( verts[ idx ] );
                }
    
                if ( val >= prev ){
                    // go up
                    // search until the next dot product 
                    // is less than the previous
                    while ( i < l && val >= prev ){
                        prev = val;
                        val = verts[ i ].dot( dir );
                        i++;
                    }
    
                    if (val >= prev){
                        i++;
                    }
    
                    // return the previous (furthest with largest dot product)
                    idx = i - 2;
                    if ( data ){
                        data.idx = i - 2;
                    }
                    return result.clone( verts[ idx ] );
    
                } else {
                    // go down
    
                    i = l;
                    while ( i > 1 && prev >= val ){
                        i--;
                        val = prev;
                        prev = verts[ i ].dot( dir );
                    }
    
                    // return the previous (furthest with largest dot product)
                    idx = (i + 1) % l;
                    if ( data ){
                        data.idx = idx;
                    }
                    return result.clone( verts[ idx ] );                
                }
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
    
                var norm
                    ,scratch = Physics.scratchpad()
                    ,next = scratch.vector()
                    ,prev = scratch.vector()
                    ,verts = this.vertices
                    ,l = verts.length
                    ,mag
                    ,sign = this._area > 0
                    ,data = {}
                    ;
    
                result = this.getFarthestHullPoint( dir, result, data );
    
                // get normalized directions to next and previous vertices
                next.clone( verts[ (data.idx + 1) % l ] ).vsub( result ).normalize().perp( !sign );
                prev.clone( verts[ (data.idx - 1 + l) % l ] ).vsub( result ).normalize().perp( sign );
    
                // get the magnitude of a vector from the result vertex 
                // that splits down the middle
                // creating a margin of "m" to each edge
                mag = margin / (1 + next.dot(prev));
    
                result.vadd( next.vadd( prev ).mult( mag ) );
                scratch.done();
                return result;
            }
        };
    });
    
    // end module: geometries/convex-polygon.js
    return Physics;
}));// UMD