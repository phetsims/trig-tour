// Copyright 2015, University of Colorado Boulder

/**
 * Unit Circle View. Has a grabbable radial arm called a rotor.
 *
 * @author Michael Dubson (PhET developer) on 6/2/2015.
 */
define( function( require ) {
  'use strict';

  // modules
  var TrigIndicatorArrowNode = require( 'TRIG_TOUR/trig-tour/view/TrigIndicatorArrowNode' );
  var TrigTourSpiralNode = require( 'TRIG_TOUR/trig-tour/view/TrigTourSpiralNode' );
  var ArrowNode = require( 'SCENERY_PHET/ArrowNode' );
  var Bounds2 = require( 'DOT/Bounds2' );
  var Circle = require( 'SCENERY/nodes/Circle' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Line = require( 'SCENERY/nodes/Line' );
  var Node = require( 'SCENERY/nodes/Node' );
  var Path = require( 'SCENERY/nodes/Path' );
  var PhetFont = require( 'SCENERY_PHET/PhetFont' );
  var Rectangle = require( 'SCENERY/nodes/Rectangle' );
  var Shape = require( 'KITE/Shape' );
  var SimpleDragHandler = require( 'SCENERY/input/SimpleDragHandler' );
  var Text = require( 'SCENERY/nodes/Text' );
  var TrigTourColors = require( 'TRIG_TOUR/trig-tour/view/TrigTourColors' );
  var Util = require( 'DOT/Util' );
  var TrigTourModel = require( 'TRIG_TOUR/trig-tour/model/TrigTourModel' );
  var TrigTourMathStrings = require( 'TRIG_TOUR/trig-tour/TrigTourMathStrings' );
  var SpecialAngles = require( 'TRIG_TOUR/trig-tour/SpecialAngles' );

  // strings
  var thetaString = require( 'string!TRIG_TOUR/theta' );
  var xString = require( 'string!TRIG_TOUR/x' );
  var yString = require( 'string!TRIG_TOUR/y' );

  // constants
  var DISPLAY_FONT = new PhetFont( 20 );
  var DISPLAY_FONT_LARGE = new PhetFont( 22 );
  var DISPLAY_FONT_SMALL = new PhetFont( 18 );
  var DISPLAY_FONT_ITALIC = new PhetFont( { size: 20, style: 'italic' } );
  var LINE_COLOR = TrigTourColors.LINE_COLOR;
  var TEXT_COLOR = TrigTourColors.TEXT_COLOR;
  var TEXT_COLOR_GRAY = TrigTourColors.TEXT_COLOR_GRAY;
  var COS_COLOR = TrigTourColors.COS_COLOR;
  var SIN_COLOR = TrigTourColors.SIN_COLOR;
  var VIEW_BACKGROUND_COLOR = TrigTourColors.VIEW_BACKGROUND_COLOR;
  var ARROW_HEAD_WIDTH = 8;
  var MAX_LABEL_WIDTH = ARROW_HEAD_WIDTH * 3;

  /**
   * Constructor for the UnitCircleView.
   *
   * @param {TrigTourModel} trigTourModel - the main model of the sim
   * @param {PropertySet} viewProperties - propertyset handling visibility of elements on screen
   * @constructor
   */
  function UnitCircleView( trigTourModel, viewProperties ) {

    var thisView = this;

    // Call the super constructor
    Node.call( thisView );

    // Draw Unit Circle
    var radius = 160; //radius of unit circle in pixels
    //provides parent node and origin for rotorGraphic
    var circleGraphic = new Circle( radius, { stroke: LINE_COLOR, lineWidth: 3 } );

    // Draw 'special angle' locations on unit circle
    // special angles are at 0, 30, 45, 60, 90, 120, 135, 150, 180, -30, ...
    this.specialAnglesNode = new Node();
    var angles = SpecialAngles.SPECIAL_ANGLES;

    //x and y coordinates of special angle on unit circle
    var xPos;
    var yPos;
    for ( var i = 0; i < angles.length; i++ ) {
      xPos = radius * Math.cos( Util.toRadians( angles[ i ] ) );
      yPos = radius * Math.sin( Util.toRadians( angles[ i ] ) );
      this.specialAnglesNode.addChild( new Circle(
        5,
        { stroke: LINE_COLOR, fill: 'white', lineWidth: 1, x: xPos, y: yPos }
      ) );
    }

    // draw background
    var backgroundWidth = 2.4 * radius;
    var bHeight = 2.4 * radius;
    var arcRadius = 8;
    this.backgroundRectangle = new Rectangle(
      -backgroundWidth / 2,
      -bHeight / 2,
      backgroundWidth,
      bHeight,
      arcRadius,
      arcRadius,
      { fill: VIEW_BACKGROUND_COLOR, opacity: 0.7, stroke: TEXT_COLOR_GRAY, lineWidth: 2 }
    );

    // Draw x-, y-axes with x and y labels
    var yAxis = new ArrowNode( 0, 1.2 * radius, 0, -1.2 * radius, {
      tailWidth: 0.3,
      headHeight: 12,
      headWidth: ARROW_HEAD_WIDTH
    } );
    var xAxis = new ArrowNode( -1.2 * radius, 0, 1.2 * radius, 0, {
      tailWidth: 0.3,
      headHeight: 12,
      headWidth: ARROW_HEAD_WIDTH
    } );

    // Draw and position x-, y-axis labels
    var fontInfo = { font: DISPLAY_FONT, fill: TEXT_COLOR, maxWidth: MAX_LABEL_WIDTH };
    var xText = new Text( xString, fontInfo );
    var yText = new Text( yString, fontInfo );
    xAxis.addChild( xText );
    yAxis.addChild( yText );
    xText.left = 1.2 * radius + 5;
    xText.centerY = yAxis.centerY;
    yText.right = -12;
    yText.top = -1.2 * radius - 2;

    // Draw Grid, simple square grid, visibility set by Control Panel;
    var gridShape = new Shape();
    gridShape.moveTo( -radius, -radius );
    gridShape.lineTo( radius, -radius ).lineTo( radius, radius ).lineTo( -radius, radius ).lineTo( -radius, -radius );
    gridShape.moveTo( -radius, -radius / 2 ).lineTo( radius, -radius / 2 ).moveTo( -radius, radius / 2 ).lineTo( radius, radius / 2 );
    gridShape.moveTo( -radius / 2, -radius ).lineTo( -radius / 2, radius ).moveTo( radius / 2, -radius ).lineTo( radius / 2, radius );
    this.grid = new Path( gridShape, { lineWidth: 2, stroke: TEXT_COLOR_GRAY } );
    this.grid.visible = false;

    // draw vertical (sine) line on rotor triangle
    // displayed line is either simple Line (no arrow head) or TrigIndicatorArrowNode (with arrow head)
    this.verticalLine = new Line( 0, 0, 0, -radius, { lineWidth: 4, stroke: 'black' } );
    this.verticalIndicatorArrow = new TrigIndicatorArrowNode( radius, 'vertical', { tailWidth: 6, fill: SIN_COLOR } );

    // draw horizontal (cosine) line on rotor triangle
    this.horizontalLine = new Line( 0, 0, radius, 0, { lineWidth: 4, stroke: 'black' } );
    this.horizontalIndicatorArrow = new TrigIndicatorArrowNode( radius, 'horizontal', {
      tailWidth: 6,
      fill: COS_COLOR
    } );

    // Draw rotor arm with draggable red dot at end
    var rotorGraphic = new Node();
    rotorGraphic.addChild( new Line( 0, 0, radius, 0, { lineWidth: 4, stroke: TrigTourColors.LINE_COLOR } ) );
    rotorGraphic.addChild( new Circle(
      7,
      { stroke: LINE_COLOR, fill: 'red', x: radius, y: 0, cursor: 'pointer' }
    ) );
    var hitBound = 30;
    rotorGraphic.mouseArea = new Bounds2( radius - hitBound, -hitBound, radius + hitBound, hitBound );
    rotorGraphic.touchArea = new Bounds2( radius - hitBound, -hitBound, radius + hitBound, hitBound );

    // Draw x, y, and '1' labels on the xyR triangle
    var labelCanvas = new Node();
    fontInfo = { font: DISPLAY_FONT_LARGE, fill: TEXT_COLOR, maxWidth: MAX_LABEL_WIDTH };
    var oneText = new Text( TrigTourMathStrings.ONE_STRING, fontInfo );
    xText = new Text( xString, fontInfo );            //xText, yText already defined above
    yText = new Text( yString, fontInfo );
    fontInfo = { font: DISPLAY_FONT_ITALIC, fill: TEXT_COLOR, maxWidth: MAX_LABEL_WIDTH };
    var thetaText = new Text( thetaString, fontInfo );
    // +1, -1 labels on axes
    fontInfo = { font: DISPLAY_FONT_SMALL, fill: TEXT_COLOR_GRAY, maxWidth: MAX_LABEL_WIDTH };
    var oneXText = new Text( TrigTourMathStrings.ONE_STRING, fontInfo );
    var minusOneXText = new Text( TrigTourMathStrings.MINUS_ONE_STRING, fontInfo );
    var oneYText = new Text( TrigTourMathStrings.ONE_STRING, fontInfo );
    var minusOneYText = new Text( TrigTourMathStrings.MINUS_ONE_STRING, fontInfo );

    // position +1/-1 labels on xy axes
    oneXText.left = this.grid.right + 5;
    oneXText.top = 7;
    minusOneXText.right = this.grid.left - 5;
    minusOneXText.top = 7;
    oneYText.bottom = this.grid.top;
    oneYText.left = 5;
    minusOneYText.top = this.grid.bottom;
    minusOneYText.right = -5;

    labelCanvas.children = [ oneText, xText, yText, thetaText, oneXText, minusOneXText, oneYText, minusOneYText ];

    rotorGraphic.addInputListener( new SimpleDragHandler(
      {
        // When dragging across it in a mobile device, pick it up
        allowTouchSnag: true,
        // start function for testing only
        start: function( e ) {
        },

        drag: function( e ) {
          var v1 = rotorGraphic.globalToParentPoint( e.pointer.point );
          var smallAngle = -v1.angle(); // model angle is negative of xy screen coordinates angle

          // make sure the full angle does not exceed max allowed angle
          trigTourModel.checkMaxAngleExceeded();

          if ( !trigTourModel.maxAngleExceeded ) {
            if ( !viewProperties.specialAnglesVisibleProperty.value ) {
              trigTourModel.setFullAngleWithSmallAngle( smallAngle );
            }
            else {
              trigTourModel.setSpecialAngleWithSmallAngle( smallAngle );
            }
          }
          else {
            // maximum angle exceeded, only update full angle if abs val of small angle is deacreasing
            if( Math.abs( smallAngle ) < Math.abs( trigTourModel.previousAngle ) ) {
              trigTourModel.setFullAngleWithSmallAngle( smallAngle );
            }
          }
        }
      } ) );

    // create the spiral nodes
    var initialSpiralRadius = 0.2 * radius;
    var counterClockWiseSpiralNode = new TrigTourSpiralNode( trigTourModel, initialSpiralRadius, TrigTourModel.MAX_ANGLE_LIMIT + Math.PI );
    var clockWiseSpiralNode = new TrigTourSpiralNode( trigTourModel, initialSpiralRadius, -TrigTourModel.MAX_ANGLE_LIMIT - Math.PI );


    // function to update which spiral is visible
    var updateVisibleSpiral = function( angle ) {
      counterClockWiseSpiralNode.visible = angle > 0;
      clockWiseSpiralNode.visible = !counterClockWiseSpiralNode.visible;
    };

    var setLabelVisibility = function( isVisible ) {
      positionLabels();
      labelCanvas.visible = isVisible;
    };

    // position the x, y, '1', and theta labels on the xyR triangle of the unit circle
    var positionLabels = function() {
      var smallAngle = trigTourModel.getSmallAngleInRadians();
      var totalAngle = trigTourModel.getFullAngleInRadians();
      var pi = Math.PI;

      // set visibility of the labels, dependent on angle magnitude to avoid occlusion
      thetaText.visible = !( Math.abs( totalAngle ) < Util.toRadians( 40 ) );
      var sAngle = Math.abs( Util.toDegrees( smallAngle ) );  //small angle in degrees
      yText.visible = !( sAngle < 10 || (180 - sAngle) < 10 );
      xText.visible = !( Math.abs( 90 - sAngle ) < 5 );

      // position one-label
      var angleOffset = Util.toRadians( 9 );
      var sign = 1; // if sign = +1, one-label is to right of radius, if sign = -1 then to the left
      if ( ( smallAngle > pi / 2 && smallAngle <= pi ) || ( smallAngle >= -pi / 2 && smallAngle < 0 ) ) {
        sign = -1;
      }
      var xInPix = radius * Math.cos( smallAngle + sign * angleOffset );
      var yInPix = radius * Math.sin( smallAngle + sign * angleOffset );
      oneText.centerX = 0.6 * xInPix;
      oneText.centerY = -0.6 * yInPix;

      // position x-label
      var xPos = 0.5 * radius * Math.cos( smallAngle );
      var yPos = 0.6 * xText.height;
      if ( smallAngle < 0 ) { yPos = -0.6 * xText.height; }
      xText.centerX = xPos;
      xText.centerY = yPos;

      // position y-label
      sign = 1;
      if ( ( smallAngle > pi / 2 && smallAngle < pi ) || ( smallAngle > -pi && smallAngle < -pi / 2 ) ) {
        sign = -1;
      }
      xPos = radius * Math.cos( smallAngle ) + sign * xText.width;
      yPos = -0.5 * radius * Math.sin( smallAngle );
      yText.centerX = xPos;
      yText.centerY = yPos;

      // show and position theta-label on angle arc if arc is greater than 20 degs
      xPos = ( arcRadius + 10 ) * Math.cos( totalAngle / 2 );
      yPos = -( arcRadius + 10 ) * Math.sin( totalAngle / 2 );
      thetaText.centerX = xPos;
      thetaText.centerY = yPos;
    };

    // add the children to parent node
    thisView.children = [
      this.backgroundRectangle,
      this.grid,
      circleGraphic,
      xAxis,
      yAxis,
      counterClockWiseSpiralNode,
      clockWiseSpiralNode,
      this.horizontalIndicatorArrow,
      this.horizontalLine,
      this.verticalIndicatorArrow,
      this.verticalLine,
      this.specialAnglesNode,
      rotorGraphic,
      labelCanvas
    ];

    // Register for synchronization with model.
    trigTourModel.fullAngleProperty.link( function( angle ) {
      rotorGraphic.rotation = -angle;  // model angle is negative of xy screen coords angle
      var cos = Math.cos( angle );
      var sin = Math.sin( angle );
      thisView.verticalLine.x = radius * cos;
      thisView.verticalLine.setPoint2( 0, -radius * sin );
      thisView.horizontalLine.setPoint2( radius * cos, 0 );
      thisView.verticalIndicatorArrow.x = radius * cos;
      thisView.verticalIndicatorArrow.setEndPoint( radius * sin );
      thisView.horizontalIndicatorArrow.setEndPoint( radius * cos );
      updateVisibleSpiral( angle );
      positionLabels();
    } );

    viewProperties.graphProperty.link( function( graph ) {
      thisView.horizontalIndicatorArrow.visible = ( graph === 'cos' || graph === 'tan' );
      thisView.horizontalLine.visible = ( graph === 'sin' );
      thisView.verticalIndicatorArrow.visible = ( graph === 'sin' || graph === 'tan' );
      thisView.verticalLine.visible = ( graph === 'cos' );
    } );

    viewProperties.labelsVisibleProperty.link( function( isVisible ) {
      setLabelVisibility( isVisible );
    } );

    viewProperties.gridVisibleProperty.link( function( isVisible ) {
      thisView.grid.visible = isVisible;
    } );

    viewProperties.specialAnglesVisibleProperty.link( function( specialAnglesVisible ) {
      thisView.specialAnglesNode.visible = specialAnglesVisible;
    } );

  }

  return inherit( Node, UnitCircleView );
} );