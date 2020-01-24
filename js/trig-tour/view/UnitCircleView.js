// Copyright 2015-2019, University of Colorado Boulder

/**
 * Unit Circle View. Has a grabbable radial arm called a rotor.
 *
 * @author Michael Dubson (PhET developer) on 6/2/2015.
 */
define( require => {
  'use strict';

  // modules
  const ArrowNode = require( 'SCENERY_PHET/ArrowNode' );
  const Circle = require( 'SCENERY/nodes/Circle' );
  const inherit = require( 'PHET_CORE/inherit' );
  const Line = require( 'SCENERY/nodes/Line' );
  const MathSymbols = require( 'SCENERY_PHET/MathSymbols' );
  const Node = require( 'SCENERY/nodes/Node' );
  const Path = require( 'SCENERY/nodes/Path' );
  const PhetFont = require( 'SCENERY_PHET/PhetFont' );
  const Rectangle = require( 'SCENERY/nodes/Rectangle' );
  const Shape = require( 'KITE/Shape' );
  const SimpleDragHandler = require( 'SCENERY/input/SimpleDragHandler' );
  const SpecialAngles = require( 'TRIG_TOUR/trig-tour/SpecialAngles' );
  const Text = require( 'SCENERY/nodes/Text' );
  const TrigIndicatorArrowNode = require( 'TRIG_TOUR/trig-tour/view/TrigIndicatorArrowNode' );
  const trigTour = require( 'TRIG_TOUR/trigTour' );
  const TrigTourColors = require( 'TRIG_TOUR/trig-tour/view/TrigTourColors' );
  const TrigTourMathStrings = require( 'TRIG_TOUR/trig-tour/TrigTourMathStrings' );
  const TrigTourModel = require( 'TRIG_TOUR/trig-tour/model/TrigTourModel' );
  const TrigTourSpiralNode = require( 'TRIG_TOUR/trig-tour/view/TrigTourSpiralNode' );
  const Utils = require( 'DOT/Utils' );

  // strings
  const xString = require( 'string!TRIG_TOUR/x' );
  const yString = require( 'string!TRIG_TOUR/y' );

  // constants
  const DISPLAY_FONT = new PhetFont( 20 );
  const DISPLAY_FONT_LARGE = new PhetFont( 22 );
  const DISPLAY_FONT_SMALL = new PhetFont( 18 );
  const DISPLAY_FONT_ITALIC = new PhetFont( { size: 20, style: 'italic' } );
  const LINE_COLOR = TrigTourColors.LINE_COLOR;
  const TEXT_COLOR = TrigTourColors.TEXT_COLOR;
  const TEXT_COLOR_GRAY = TrigTourColors.TEXT_COLOR_GRAY;
  const COS_COLOR = TrigTourColors.COS_COLOR;
  const SIN_COLOR = TrigTourColors.SIN_COLOR;
  const VIEW_BACKGROUND_COLOR = TrigTourColors.VIEW_BACKGROUND_COLOR;
  const ARROW_HEAD_WIDTH = 8;
  const MAX_LABEL_WIDTH = ARROW_HEAD_WIDTH * 3;

  /**
   * Constructor for the UnitCircleView.
   *
   * @param {TrigTourModel} trigTourModel - the main model of the sim
   * @param {Rectangle} backgroundRectangle - Bounds for the background rectangle of the unit circle
   * @param {number} backgroundOffset - Offset of the background rectangle behind the unit circle view
   * @param {ViewProperties} viewProperties - collection of properties handling visibility of elements on screen
   * @constructor
   */
  function UnitCircleView( trigTourModel, backgroundRectangle, backgroundOffset, viewProperties ) {

    const self = this;

    // Call the super constructor
    Node.call( self );

    // Draw Unit Circle
    const radius = 160; //radius of unit circle in view coordinates
    const circleGraphic = new Circle( radius, { stroke: LINE_COLOR, lineWidth: 3 } );

    // Draw 'special angle' locations on unit circle
    // special angles are at 0, 30, 45, 60, 90, 120, 135, 150, 180, -30, ...
    const specialAnglesNode = new Node();
    const angles = SpecialAngles.SPECIAL_ANGLES;

    //x and y coordinates of special angle on unit circle
    let xPos;
    let yPos;
    for ( let i = 0; i < angles.length; i++ ) {
      xPos = radius * Math.cos( Utils.toRadians( angles[ i ] ) );
      yPos = radius * Math.sin( Utils.toRadians( angles[ i ] ) );
      specialAnglesNode.addChild( new Circle(
        5,
        { stroke: LINE_COLOR, fill: 'white', lineWidth: 1, x: xPos, y: yPos }
      ) );
    }

    // draw background, a slightly transparent rectangle placed over the unit circle so that the tangent 
    // curves do not occlude this node.
    const backgroundLineWidth = backgroundRectangle.lineWidth;
    const backgroundWidth = backgroundRectangle.width;
    const bHeight = backgroundRectangle.height;
    const arcRadius = backgroundRectangle.cornerRadius;
    this.backgroundRectangle = new Rectangle(
      -backgroundWidth / 2 + backgroundLineWidth + backgroundOffset / 2,
      -bHeight / 2 + backgroundLineWidth,
      backgroundWidth - 3 * backgroundLineWidth,
      bHeight - 3 * backgroundLineWidth,
      arcRadius,
      arcRadius,
      { fill: VIEW_BACKGROUND_COLOR, opacity: 0.7 }
    );

    // Draw x-, y-axes with x and y labels
    const arrowOptions = { tailWidth: 0.3, headHeight: 12, headWidth: ARROW_HEAD_WIDTH };
    const yAxis = new ArrowNode( 0, 1.18 * radius, 0, -1.2 * radius, arrowOptions );
    const xAxis = new ArrowNode( -1.2 * radius, 0, 1.2 * radius, 0, arrowOptions );

    // Draw and position x-, y-axis labels
    let fontInfo = { font: DISPLAY_FONT, fill: TEXT_COLOR, maxWidth: MAX_LABEL_WIDTH };
    const xAxisText = new Text( xString, fontInfo );
    const yAxisText = new Text( yString, fontInfo );
    xAxisText.left = 1.2 * radius + 5;
    xAxisText.centerY = yAxis.centerY;
    yAxisText.right = -12;
    yAxisText.top = -1.2 * radius - 2;

    // Draw Grid, simple square grid, visibility set by Control Panel;
    const gridShape = new Shape();
    gridShape.moveTo( -radius, -radius );
    gridShape.lineTo( radius, -radius ).lineTo( radius, radius ).lineTo( -radius, radius ).lineTo( -radius, -radius );
    gridShape.moveTo( -radius, -radius / 2 ).lineTo( radius, -radius / 2 ).moveTo( -radius, radius / 2 ).lineTo( radius, radius / 2 );
    gridShape.moveTo( -radius / 2, -radius ).lineTo( -radius / 2, radius ).moveTo( radius / 2, -radius ).lineTo( radius / 2, radius );
    const grid = new Path( gridShape, { lineWidth: 2, stroke: TEXT_COLOR_GRAY } );
    grid.visible = false;

    // draw vertical (sine) line on rotor triangle
    // displayed line is either simple Line (no arrow head) or TrigIndicatorArrowNode (with arrow head)
    const verticalLine = new Line( 0, 0, 0, -radius, { lineWidth: 4, stroke: 'black' } );
    const verticalIndicatorArrow = new TrigIndicatorArrowNode( radius, 'vertical', {
      tailWidth: 5,
      lineWidth: 1,
      fill: SIN_COLOR,
      stroke: SIN_COLOR
    } );

    // draw horizontal (cosine) line on rotor triangle
    const horizontalLine = new Line( 0, 0, radius, 0, { lineWidth: 4, stroke: 'black' } );
    const horizontalIndicatorArrow = new TrigIndicatorArrowNode( radius, 'horizontal', {
      tailWidth: 5,
      lineWidth: 1,
      fill: COS_COLOR,
      stroke: COS_COLOR
    } );

    // Draw rotor arm with draggable red pin at end
    const rotorArm = new Line( 0, 0, radius, 0, { lineWidth: 4, stroke: TrigTourColors.LINE_COLOR } );
    const rotorPin = new Circle( 7, { stroke: LINE_COLOR, fill: 'red', cursor: 'pointer' } );
    const hitBound = 25;
    rotorPin.mouseArea = rotorPin.bounds.dilated( hitBound );
    rotorPin.touchArea = rotorPin.mouseArea;

    // Draw x, y, and '1' labels on the xyR triangle
    const labelCanvas = new Node();
    fontInfo = { font: DISPLAY_FONT_LARGE, fill: TEXT_COLOR, maxWidth: MAX_LABEL_WIDTH };
    const oneText = new Text( TrigTourMathStrings.ONE_STRING, fontInfo );
    const xLabelText = new Text( xString, fontInfo );
    const yLabelText = new Text( yString, fontInfo );
    fontInfo = { font: DISPLAY_FONT_ITALIC, fill: TEXT_COLOR, maxWidth: MAX_LABEL_WIDTH };
    const thetaText = new Text( MathSymbols.THETA, fontInfo );
    // +1, -1 labels on axes
    fontInfo = { font: DISPLAY_FONT_SMALL, fill: TEXT_COLOR_GRAY, maxWidth: MAX_LABEL_WIDTH };
    const oneXText = new Text( TrigTourMathStrings.ONE_STRING, fontInfo );
    const minusOneXText = new Text( TrigTourMathStrings.MINUS_ONE_STRING, fontInfo );
    const oneYText = new Text( TrigTourMathStrings.ONE_STRING, fontInfo );
    const minusOneYText = new Text( TrigTourMathStrings.MINUS_ONE_STRING, fontInfo );

    // position +1/-1 labels on xy axes
    const xOffset = 5;
    const yOffset = 7;
    oneXText.left = grid.right + xOffset;
    oneXText.top = yOffset;
    minusOneXText.right = grid.left - xOffset;
    minusOneXText.top = yOffset;
    oneYText.bottom = grid.top;
    oneYText.left = xOffset;
    minusOneYText.top = grid.bottom;
    minusOneYText.right = -xOffset;

    labelCanvas.children = [ oneText, xLabelText, yLabelText, thetaText, oneXText, minusOneXText, oneYText, minusOneYText ];

    rotorPin.addInputListener( new SimpleDragHandler(
      {
        // When dragging across it in a mobile device, pick it up
        allowTouchSnag: true,

        drag: function( e ) {
          const v1 = rotorPin.globalToParentPoint( e.pointer.point );
          const smallAngle = -v1.angle; // model angle is negative of xy screen coordinates angle

          // make sure the full angle does not exceed max allowed angle
          trigTourModel.checkMaxAngleExceeded();

          const setFullAngle = function( dragAngle ) {
            if ( !viewProperties.specialAnglesVisibleProperty.value ) {
              trigTourModel.setFullAngleWithSmallAngle( smallAngle );
            }
            else {
              trigTourModel.setSpecialAngleWithSmallAngle( smallAngle );
            }
          };

          if ( !trigTourModel.maxAngleExceededProperty.value ) {
            setFullAngle( smallAngle );
          }
          else {
            // maximum angle exceeded, only update full angle if abs val of small angle is decreasing
            if ( Math.abs( smallAngle ) < Math.abs( trigTourModel.previousAngle ) ) {
              // if the difference between angles is too large, rotor was dragged across Math.PI and small angle
              // changed signs. Immediately return because this can allow the user to drag to far. 
              if ( Math.abs( smallAngle - trigTourModel.previousAngle ) > Math.PI / 2 ) {
                return;
              }
              setFullAngle( smallAngle );
            }
          }
        }
      } ) );

    // create the spiral nodes
    const initialSpiralRadius = 0.2 * radius;
    const counterClockWiseSpiralNode = new TrigTourSpiralNode( trigTourModel, initialSpiralRadius, TrigTourModel.MAX_ANGLE_LIMIT + Math.PI );
    const clockWiseSpiralNode = new TrigTourSpiralNode( trigTourModel, initialSpiralRadius, -TrigTourModel.MAX_ANGLE_LIMIT - Math.PI );

    // function to update which spiral is visible
    const updateVisibleSpiral = function( angle ) {
      counterClockWiseSpiralNode.visible = angle > 0;
      clockWiseSpiralNode.visible = !counterClockWiseSpiralNode.visible;
    };

    const setLabelVisibility = function( isVisible ) {
      positionLabels();
      labelCanvas.visible = isVisible;
    };

    // position the x, y, '1', and theta labels on the xyR triangle of the unit circle
    var positionLabels = function() {
      const smallAngle = trigTourModel.getSmallAngleInRadians();
      const totalAngle = trigTourModel.getFullAngleInRadians();
      const pi = Math.PI;

      // set visibility of the labels, dependent on angle magnitude to avoid occlusion
      thetaText.visible = !( Math.abs( totalAngle ) < Utils.toRadians( 40 ) );
      const sAngle = Math.abs( Utils.toDegrees( smallAngle ) );  //small angle in degrees
      yLabelText.visible = !( sAngle < 10 || ( 180 - sAngle ) < 10 );
      xLabelText.visible = !( Math.abs( 90 - sAngle ) < 5 );

      // position one-label
      const angleOffset = Utils.toRadians( 9 );
      let sign = 1; // if sign = +1, one-label is to right of radius, if sign = -1 then to the left
      if ( ( smallAngle > pi / 2 && smallAngle <= pi ) || ( smallAngle >= -pi / 2 && smallAngle < 0 ) ) {
        sign = -1;
      }
      const xInPix = radius * Math.cos( smallAngle + sign * angleOffset );
      const yInPix = radius * Math.sin( smallAngle + sign * angleOffset );
      oneText.centerX = 0.6 * xInPix;
      oneText.centerY = -0.6 * yInPix;

      // position x-label
      let xPos = 0.5 * radius * Math.cos( totalAngle );
      let yPos = 0.6 * xLabelText.height;
      if ( smallAngle < 0 ) { yPos = -0.6 * xLabelText.height; }
      xLabelText.centerX = xPos;
      xLabelText.centerY = yPos;

      // position y-label
      sign = 1;
      if ( ( smallAngle > pi / 2 && smallAngle < pi ) || ( smallAngle > -pi && smallAngle < -pi / 2 ) ) {
        sign = -1;
      }
      xPos = radius * Math.cos( totalAngle ) + sign * xLabelText.width;
      yPos = -0.5 * radius * Math.sin( totalAngle );
      yLabelText.centerX = xPos;
      yLabelText.centerY = yPos;

      // show and position theta-label on angle arc if arc is greater than 20 degs
      const thetaPositionRadius = counterClockWiseSpiralNode.endPointRadius;
      xPos = ( thetaPositionRadius + 10 ) * Math.cos( totalAngle / 2 );
      yPos = -( thetaPositionRadius + 10 ) * Math.sin( totalAngle / 2 );
      thetaText.centerX = xPos;
      thetaText.centerY = yPos;
    };

    // add the children to parent node
    self.children = [
      this.backgroundRectangle,
      grid,
      circleGraphic,
      xAxis,
      yAxis,
      xAxisText,
      yAxisText,
      counterClockWiseSpiralNode,
      clockWiseSpiralNode,
      horizontalIndicatorArrow,
      horizontalLine,
      verticalIndicatorArrow,
      verticalLine,
      specialAnglesNode,
      rotorArm,
      rotorPin,
      labelCanvas
    ];

    // Register for synchronization with model.
    trigTourModel.fullAngleProperty.link( function( angle ) {

      // convenience refactor
      const newX = radius * Math.cos( angle );
      const newY = -radius * Math.sin( angle );

      // transform the rotor, model angle is negative of xy screen coords angle
      rotorPin.resetTransform();
      rotorPin.translate( newX, newY );
      rotorArm.rotation = -angle;

      // transform the vertical and horizontal lines
      verticalLine.x = newX;
      verticalLine.setPoint2( 0, newY );
      horizontalLine.setPoint2( newX, 0 );
      verticalIndicatorArrow.x = newX;
      verticalIndicatorArrow.setEndPoint( -newY );
      horizontalIndicatorArrow.setEndPoint( newX );

      // update the visible spiral and set position of the labels
      updateVisibleSpiral( angle );
      positionLabels();

    } );

    viewProperties.graphProperty.link( function( graph ) {
      horizontalIndicatorArrow.visible = ( graph === 'cos' || graph === 'tan' );
      horizontalLine.visible = ( graph === 'sin' );
      verticalIndicatorArrow.visible = ( graph === 'sin' || graph === 'tan' );
      verticalLine.visible = ( graph === 'cos' );
    } );

    viewProperties.labelsVisibleProperty.link( function( isVisible ) {
      setLabelVisibility( isVisible );
    } );

    viewProperties.gridVisibleProperty.link( function( isVisible ) {
      grid.visible = isVisible;
    } );

    viewProperties.specialAnglesVisibleProperty.link( function( specialAnglesVisible ) {
      specialAnglesNode.visible = specialAnglesVisible;
    } );

  }

  trigTour.register( 'UnitCircleView', UnitCircleView );
  return inherit( Node, UnitCircleView );
} );