// Copyright 2015-2022, University of Colorado Boulder

/**
 * Handles drawing the shapes and creating the paths for the trig plots on the graph of Trig Tour.
 *
 * @author Michael Dubson (PhET developer) on 6/3/2015.
 * @author Jesse Greenberg
 */

import Utils from '../../../../dot/js/Utils.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import { Shape } from '../../../../kite/js/imports.js';
import { Node, Path } from '../../../../scenery/js/imports.js';
import trigTour from '../../trigTour.js';
import TriangleNode from './TriangleNode.js';
import TrigTourColors from './TrigTourColors.js';

// constants
const COS_COLOR = TrigTourColors.COS_COLOR;
const SIN_COLOR = TrigTourColors.SIN_COLOR;
const TAN_COLOR = TrigTourColors.TAN_COLOR;

class TrigPlotsNode extends Node {

  /**
   * Constructor.
   *
   * @param {number} wavelength
   * @param {number} numberOfWavelengths
   * @param {number} amplitude
   * @param {Property.<string>} graphProperty - which graph is visible, one of 'cos', 'sin', or 'tan'
   */
  constructor( wavelength, numberOfWavelengths, amplitude, graphProperty ) {

    super();

    const cosShape = new Shape();
    const sinShape = new Shape();
    const tanShape = new Shape();

    // shape origins and calculate number of points
    let dx = wavelength / 100;
    let numberOfPoints = ( numberOfWavelengths + 0.08 ) * wavelength / dx;
    const xOrigin = 0;
    const yOrigin = 0;
    let xPos = xOrigin - numberOfPoints * dx / 2;
    sinShape.moveTo( xPos, yOrigin - amplitude * Math.sin( 2 * Math.PI * ( xPos - xOrigin ) / wavelength ) );
    cosShape.moveTo( xPos, yOrigin - amplitude * Math.cos( 2 * Math.PI * ( xPos - xOrigin ) / wavelength ) );
    tanShape.moveTo( xPos, yOrigin - amplitude * Math.tan( 2 * Math.PI * ( xPos - xOrigin ) / wavelength ) );

    // draw sin and cos curves
    for ( let i = 0; i < numberOfPoints; i++ ) {
      xPos += dx;
      sinShape.lineTo( xPos, yOrigin - amplitude * Math.sin( 2 * Math.PI * ( xPos - xOrigin ) / wavelength ) );
      cosShape.lineTo( xPos, yOrigin - amplitude * Math.cos( 2 * Math.PI * ( xPos - xOrigin ) / wavelength ) );
    }

    // draw tangent curve - cut off at upper and lower limits, need more resolution due to steep slope
    xPos = xOrigin - numberOfPoints * dx / 2;  //start at left edge
    let tanValue = Math.tan( 2 * Math.PI * ( xPos - xOrigin ) / wavelength );

    dx = wavelength / 600;  //x-distance between points on curve
    numberOfPoints = ( numberOfWavelengths + 0.08 ) * wavelength / dx;
    const maxTanValue = 1.15;
    const minTanValue = -1.0;
    let yPos;
    for ( let i = 0; i < numberOfPoints; i++ ) {
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

    const sinPath = new Path( sinShape, { stroke: SIN_COLOR, lineWidth: 3 } );
    const cosPath = new Path( cosShape, { stroke: COS_COLOR, lineWidth: 3 } );
    const tanPath = new Path( tanShape, { stroke: TAN_COLOR, lineWidth: 3 } );

    // Add TriangleNode arrow heads at ends of curves
    const pi = Math.PI;
    const leftEnd = -( numberOfWavelengths + 0.08 ) * wavelength / 2;
    const rightEnd = ( numberOfWavelengths + 0.08 ) * wavelength / 2;
    const arrowHeadLength = 15;
    const arrowHeadWidth = 8;

    // Place arrow heads on left and right ends of sin curve
    let slopeLeft = ( amplitude * 2 * pi / wavelength ) * Math.cos( 2 * pi * leftEnd / wavelength );
    let slopeRight = ( amplitude * 2 * pi / wavelength ) * Math.cos( 2 * pi * rightEnd / wavelength );
    let angleLeft = Utils.toDegrees( Math.atan( slopeLeft ) );
    let angleRight = Utils.toDegrees( Math.atan( slopeRight ) );
    const sinArrowLeft = new TriangleNode( arrowHeadLength, arrowHeadWidth, SIN_COLOR, -angleLeft + 180 );
    const sinArrowRight = new TriangleNode( arrowHeadLength, arrowHeadWidth, SIN_COLOR, -angleRight );
    sinArrowLeft.x = leftEnd;
    sinArrowRight.x = rightEnd;
    sinArrowLeft.y = -amplitude * Math.sin( 2 * pi * leftEnd / wavelength );
    sinArrowRight.y = -amplitude * Math.sin( 2 * pi * rightEnd / wavelength );
    sinPath.children = [ sinArrowLeft, sinArrowRight ];

    // Place arrow heads on ends of cos curve
    slopeLeft = ( amplitude * 2 * pi / wavelength ) * Math.sin( 2 * pi * leftEnd / wavelength );
    slopeRight = ( amplitude * 2 * pi / wavelength ) * Math.sin( 2 * pi * rightEnd / wavelength );
    angleLeft = Utils.toDegrees( Math.atan( slopeLeft ) );
    angleRight = Utils.toDegrees( Math.atan( slopeRight ) );
    const cosArrowLeft = new TriangleNode( arrowHeadLength, arrowHeadWidth, COS_COLOR, angleLeft + 180 );
    const cosArrowRight = new TriangleNode( arrowHeadLength, arrowHeadWidth, COS_COLOR, angleRight );
    cosArrowLeft.x = leftEnd;
    cosArrowRight.x = rightEnd;
    cosArrowLeft.y = -amplitude * Math.cos( 2 * pi * leftEnd / wavelength );
    cosArrowRight.y = -amplitude * Math.cos( 2 * pi * rightEnd / wavelength );
    cosPath.children = [ cosArrowLeft, cosArrowRight ];

    //Place arrow heads on ends of all tan curve segments. This is pretty tricky
    const arrowHeads = []; //array of arrow heads

    // x and y coordinates of ends of the 'central' tan segment, in view coordinates.
    // 'Central' segment is the one centered on the origin.
    const xTanMax = Math.atan( maxTanValue ) * wavelength / ( 2 * pi );
    const xTanMin = Math.atan( minTanValue ) * wavelength / ( 2 * pi );
    let xPosMax;
    let xPosMin;
    let yPosMax;
    let yPosMin;
    for ( let i = -numberOfWavelengths; i <= numberOfWavelengths; i++ ) {
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
    const yLeftEnd = -Math.tan( leftEnd * 2 * pi / wavelength ) * amplitude;
    const yRightEnd = -Math.tan( rightEnd * 2 * pi / wavelength ) * amplitude;
    arrowHeads.splice( arrowHeads.length - 2, 1, new Vector2( rightEnd, yRightEnd ) );
    arrowHeads.splice( 1, 1, new Vector2( leftEnd, yLeftEnd ) );
    let triangleNode;
    let rotationAngle;
    for ( let i = 0; i < arrowHeads.length; i++ ) {
      const xPix = arrowHeads[ i ].x;
      const yPix = arrowHeads[ i ].y;
      const xTan = xPix * 2 * pi / wavelength;

      // Derivative of tan is 1 + tan^2
      const tanSlope = ( amplitude * 2 * pi / wavelength ) * ( 1 + Math.tan( xTan ) * Math.tan( xTan ) );
      rotationAngle = -Utils.toDegrees( Math.atan( tanSlope ) );
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
    graphProperty.link( visibleGraph => {
      cosPath.visible = ( visibleGraph === 'cos' );
      sinPath.visible = ( visibleGraph === 'sin' );
      tanPath.visible = ( visibleGraph === 'tan' );
    } );
  }
}

trigTour.register( 'TrigPlotsNode', TrigPlotsNode );

export default TrigPlotsNode;