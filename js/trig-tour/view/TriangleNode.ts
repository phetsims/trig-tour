// Copyright 2015-2024, University of Colorado Boulder

/**
 * Simple triangle graphic
 * Used as arrow heads on curves in GraphView.
 *
 * Note that there is a TriangleNode in scenery-phet, but it has a different origin and
 * rotation support. I decided not to use it here, see https://github.com/phetsims/trig-tour/issues/104
 *
 * @author Michael Dubson (PhET developer) on 6/23/2015.
 */

import Utils from '../../../../dot/js/Utils.js';
import { Shape } from '../../../../kite/js/imports.js';
import { Node, Path, TPaint } from '../../../../scenery/js/imports.js';
import trigTour from '../../trigTour.js';

class TriangleNode extends Node {

  /**
   * Constructor for TriangleNode, which draws a simple triangle with center of base at (0, 0)
   * Used as arrow heads on ends of curves in GraphView
   *
   * @param length - length triangle in view coordinates
   * @param width - width of triangle in view coordinates
   * @param color
   * @param rotationInDegrees - rotation of node about (0,0)
   */
  public constructor( length: number, width: number, color: TPaint, rotationInDegrees: number ) {

    // Call the super constructor
    super();

    this.rotation = Utils.toRadians( rotationInDegrees ); // Node.rotation is in radians

    // draw horizontal arrow pointing right
    const triangleShape = new Shape();
    triangleShape.moveTo( 0, 0 ).lineTo( 0, width / 2 ).lineTo( length, 0 ).lineTo( 0, -width / 2 ).close();
    const trianglePath = new Path( triangleShape, { lineWidth: 1, fill: color } );
    this.addChild( trianglePath );
    trianglePath.x = -1; // reference point is 1 pixel inside the arrow head, to guarantee connection with adjacent line

  }
}

trigTour.register( 'TriangleNode', TriangleNode );

export default TriangleNode;