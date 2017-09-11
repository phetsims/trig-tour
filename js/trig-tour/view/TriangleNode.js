// Copyright 2015, University of Colorado Boulder

/**
 * Simple triangle graphic
 * Used as arrow heads on curves in GraphView
 *
 * @author Michael Dubson (PhET developer) on 6/23/2015.
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var Node = require( 'SCENERY/nodes/Node' );
  var Path = require( 'SCENERY/nodes/Path' );
  var Shape = require( 'KITE/Shape' );
  var trigTour = require( 'TRIG_TOUR/trigTour' );
  var Util = require( 'DOT/Util' );

  /**
   * Constructor for TriangleNode, which draws a simple triangle with center of base at (0, 0)
   * Used as arrow heads on ends of curves in GraphView
   *
   * @param {number} length - length triangle in view coordinates
   * @param {number} width - width of triangle in view coordinates
   * @param {string} color - string, e.g. '#0F0'
   * @param {number} rotationInDegrees - rotation of node about (0,0)
   * @constructor
   */
  function TriangleNode( length, width, color, rotationInDegrees ) {

    // Call the super constructor
    Node.call( this );

    this.rotation = Util.toRadians( rotationInDegrees ); // Node.rotation is in radians

    // draw horizontal arrow pointing right
    var triangleShape = new Shape();
    triangleShape.moveTo( 0, 0 ).lineTo( 0, width / 2 ).lineTo( length, 0 ).lineTo( 0, -width / 2 ).close();
    var trianglePath = new Path( triangleShape, { lineWidth: 1, fill: color } );
    this.addChild( trianglePath );
    trianglePath.x = -1; // reference point is 1 pixel inside the arrow head, to guarantee connection with adjacent line

  }

  trigTour.register( 'TriangleNode', TriangleNode );

  return inherit( Node, TriangleNode );
} );