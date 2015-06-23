/**
 * Simple triangle graphic
 * Created by dubson on 6/23/2015.
 */

define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var Line = require( 'SCENERY/nodes/Line' );
  var Node = require( 'SCENERY/nodes/Node' );
  var Path = require( 'SCENERY/nodes/Path' );
  //var PhetFont = require( 'SCENERY_PHET/PhetFont' );
  var Shape = require( 'KITE/Shape' );
  //var Text = require( 'SCENERY/nodes/Text' );


  /**
   * Constructor for TriangleNode, which draws a simple triangle with center of base at (0, 0)
   * @param {Number} length of triangle in pixels
   * @param {Number} width of triangle in pixels
   * @param {String} color string, e.g. '#0F0'
   * @param {Number} rotationInDegrees = rotation of node
   * @constructor
   */
  function TriangleNode( length, width, color, rotationInDegrees ) {
    console.log( 'TriangleNode called.' );
    this.triangleNode = this;

    // Call the super constructor
    Node.call( this.triangleNode );

    this.tLength = length;
    this.tWidth = width;
    this.color = color;
    this.rotation = rotationInDegrees*Math.PI/180;  //Node.rotation is in radians

    //draw Arrow Head on Angle Arc
    var triangleShape = new Shape();
    var hW = this.tWidth;     //arrow head width
    var hL = this.tLength;    //arrow head length
    triangleShape.moveTo( 0, 0 ).lineTo( 0, hW/2 ).lineTo( hL, 0 ).lineTo( 0, -hW/2 ).close();
    var trianglePath = new Path( triangleShape, { lineWidth: 1, fill: this.color });
    this.triangleNode.addChild( trianglePath );
    //this.addChild( trianglePath );  //WHY doesn't this work

  }//end constuctor


  return inherit( Node, TriangleNode );
} );