// Copyright 2015, University of Colorado Boulder

/**
 * Handles drawing the shapes and creating the paths for the trig plots on the graph of Trig Tour.
 *
 * @author Michael Dubson (PhET developer) on 6/3/2015.
 * @author Jesse Greenberg
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var Path = require( 'SCENERY/nodes/Path' );
  var TriangleNode = require( 'TRIG_TOUR/trig-tour/view/TriangleNode' );
  var Node = require( 'SCENERY/nodes/Node' );
  var Util = require( 'DOT/Util' );
  var TrigTourColors = require( 'TRIG_TOUR/trig-tour/view/TrigTourColors' );
  var Shape = require( 'KITE/Shape' );
  var Vector2 = require( 'DOT/Vector2' );
  var trigTour = require( 'TRIG_TOUR/trigTour' );

  // constants
  var COS_COLOR = TrigTourColors.COS_COLOR;
  var SIN_COLOR = TrigTourColors.SIN_COLOR;
  var TAN_COLOR = TrigTourColors.TAN_COLOR;

  /**
   * Constructor.
   *
   * @param {number} wavelength
   * @param {number} numberOfWavelengths
   * @param {number} amplitude
   * @param {Property.<string>} graphProperty - which graph is visible, one of 'cos', 'sin', or 'tan'
   * @constructor
   */
  function TrigPlotsNode( wavelength, numberOfWavelengths, amplitude, graphProperty ) {

    Node.call( this );

    var cosShape = new Shape();
    var sinShape = new Shape();
    var tanShape = new Shape();

    // shape origins and calculate number of points
    var dx = wavelength / 100;
    var numberOfPoints = ( numberOfWavelengths + 0.08 ) * wavelength / dx;
    var xOrigin = 0;
    var yOrigin = 0;
    var xPos = xOrigin - numberOfPoints * dx / 2;
    sinShape.moveTo( xPos, yOrigin - amplitude * Math.sin( 2 * Math.PI * (xPos - xOrigin) / wavelength ) );
    cosShape.moveTo( xPos, yOrigin - amplitude * Math.cos( 2 * Math.PI * (xPos - xOrigin) / wavelength ) );
    tanShape.moveTo( xPos, yOrigin - amplitude * Math.tan( 2 * Math.PI * (xPos - xOrigin) / wavelength ) );

    // draw sin and cos curves
    for ( var i = 0; i < numberOfPoints; i++ ) {
      xPos += dx;
      sinShape.lineTo( xPos, yOrigin - amplitude * Math.sin( 2 * Math.PI * (xPos - xOrigin) / wavelength ) );
      cosShape.lineTo( xPos, yOrigin - amplitude * Math.cos( 2 * Math.PI * (xPos - xOrigin) / wavelength ) );
    }

    // draw tangent curve - cut off at upper and lower limits, need more resolution due to steep slope
    xPos = xOrigin - numberOfPoints * dx / 2;  //start at left edge
    var tanValue = Math.tan( 2 * Math.PI * (xPos - xOrigin) / wavelength );

    dx = wavelength / 600;  //x-distance between points on curve
    numberOfPoints = ( numberOfWavelengths + 0.08 ) * wavelength / dx;
    var maxTanValue = 1.15;
    var minTanValue = -1.0;
    var yPos;
    for ( i = 0; i < numberOfPoints; i++ ) {
      tanValue = Math.tan( 2 * Math.PI * ( xPos - xOrigin ) / wavelength );
      yPos = yOrigin - amplitude * tanValue;
      if ( ( tanValue <= maxTanValue ) && ( tanValue > minTanValue ) ) {
        tanShape.lineTo( xPos, yPos );
      }
      else {
        tanShape.moveTo( xPos, yPos );
      }
      xPos += dx;
    }

    var sinPath = new Path( sinShape, { stroke: SIN_COLOR, lineWidth: 3 } );
    var cosPath = new Path( cosShape, { stroke: COS_COLOR, lineWidth: 3 } );
    var tanPath = new Path( tanShape, { stroke: TAN_COLOR, lineWidth: 3 } );

    // Add TriangleNode arrow heads at ends of curves
    var pi = Math.PI;
    var leftEnd = -( numberOfWavelengths + 0.08 ) * wavelength / 2;
    var rightEnd = ( numberOfWavelengths + 0.08 ) * wavelength / 2;
    var arrowHeadLength = 15;
    var arrowHeadWidth = 8;

    // Place arrow heads on left and right ends of sin curve
    var slopeLeft = ( amplitude * 2 * pi / wavelength ) * Math.cos( 2 * pi * leftEnd / wavelength );
    var slopeRight = ( amplitude * 2 * pi / wavelength ) * Math.cos( 2 * pi * rightEnd / wavelength );
    var angleLeft = Util.toDegrees( Math.atan( slopeLeft ) );
    var angleRight = Util.toDegrees( Math.atan( slopeRight ) );
    var sinArrowLeft = new TriangleNode( arrowHeadLength, arrowHeadWidth, SIN_COLOR, -angleLeft + 180 );
    var sinArrowRight = new TriangleNode( arrowHeadLength, arrowHeadWidth, SIN_COLOR, -angleRight );
    sinArrowLeft.x = leftEnd;
    sinArrowRight.x = rightEnd;
    sinArrowLeft.y = -amplitude * Math.sin( 2 * pi * leftEnd / wavelength );
    sinArrowRight.y = -amplitude * Math.sin( 2 * pi * rightEnd / wavelength );
    sinPath.children = [ sinArrowLeft, sinArrowRight ];

    // Place arrow heads on ends of cos curve
    slopeLeft = ( amplitude * 2 * pi / wavelength ) * Math.sin( 2 * pi * leftEnd / wavelength );
    slopeRight = ( amplitude * 2 * pi / wavelength ) * Math.sin( 2 * pi * rightEnd / wavelength );
    angleLeft = Util.toDegrees( Math.atan( slopeLeft ) );
    angleRight = Util.toDegrees( Math.atan( slopeRight ) );
    var cosArrowLeft = new TriangleNode( arrowHeadLength, arrowHeadWidth, COS_COLOR, angleLeft + 180 );
    var cosArrowRight = new TriangleNode( arrowHeadLength, arrowHeadWidth, COS_COLOR, angleRight );
    cosArrowLeft.x = leftEnd;
    cosArrowRight.x = rightEnd;
    cosArrowLeft.y = -amplitude * Math.cos( 2 * pi * leftEnd / wavelength );
    cosArrowRight.y = -amplitude * Math.cos( 2 * pi * rightEnd / wavelength );
    cosPath.children = [ cosArrowLeft, cosArrowRight ];

    //Place arrow heads on ends of all tan curve segments. This is pretty tricky
    var arrowHeads = []; //array of arrow heads

    // x and y coordinates of ends of the 'central' tan segment, in view coordinates.
    // 'Central' segment is the one centered on the origin.
    var xTanMax = Math.atan( maxTanValue ) * wavelength / ( 2 * pi );
    var xTanMin = Math.atan( minTanValue ) * wavelength / ( 2 * pi );
    var xPosMax;
    var xPosMin;
    var yPosMax;
    var yPosMin;
    for ( i = -numberOfWavelengths; i <= numberOfWavelengths; i++ ) {
      xPosMax = i * wavelength / 2 + xTanMax;
      xPosMin = i * wavelength / 2 + xTanMin;
      yPosMax = -Math.tan( xPosMax * 2 * pi / wavelength ) * amplitude;
      yPosMin = -Math.tan( xPosMin * 2 * pi / wavelength ) * amplitude;
      arrowHeads.push( new Vector2( xPosMax, yPosMax ) );
      arrowHeads.push( new Vector2( xPosMin, yPosMin ) );
    }

    // The left and right end arrow heads are special cases.
    // Remove extraneous left- and right-end arrow heads created in previous for-loop
    // and replace with correct arrow heads
    var yLeftEnd = -Math.tan( leftEnd * 2 * pi / wavelength ) * amplitude;
    var yRightEnd = -Math.tan( rightEnd * 2 * pi / wavelength ) * amplitude;
    arrowHeads.splice( arrowHeads.length - 2, 1, new Vector2( rightEnd, yRightEnd ) );
    arrowHeads.splice( 1, 1, new Vector2( leftEnd, yLeftEnd ) );
    var triangleNode;
    var rotationAngle;
    for ( i = 0; i < arrowHeads.length; i++ ) {
      var xPix = arrowHeads[ i ].x;
      var yPix = arrowHeads[ i ].y;
      var xTan = xPix * 2 * pi / wavelength;

      // Derivative of tan is 1 + tan^2
      var tanSlope = ( amplitude * 2 * pi / wavelength ) * ( 1 + Math.tan( xTan ) * Math.tan( xTan ) );
      rotationAngle = -Util.toDegrees( Math.atan( tanSlope ) );
      if ( i % 2 !== 0 ) {
        rotationAngle += 180;
      }

      triangleNode = new TriangleNode( arrowHeadLength, arrowHeadWidth, TAN_COLOR, rotationAngle );
      tanPath.addChild( triangleNode );
      triangleNode.x = xPix;
      triangleNode.y = yPix + 1;
    }

    // finally add the trig plots as children of this node
    this.children = [ cosPath, sinPath, tanPath ];

    // link plot visibility with model view property
    graphProperty.link( function( visibleGraph ) {
      cosPath.visible = ( visibleGraph === 'cos' );
      sinPath.visible = ( visibleGraph === 'sin' );
      tanPath.visible = ( visibleGraph === 'tan' );
    } );
  }

  trigTour.register( 'TrigPlotsNode', TrigPlotsNode );
  
  return inherit( Node, TrigPlotsNode );

} );