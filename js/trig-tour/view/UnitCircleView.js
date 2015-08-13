/**
 * Unit Circle View
 * Created by Michael Dubson (PhET developer) on 6/2/2015.
 */
define( function( require ) {
  'use strict';

  // modules
  var ArrowLine = require( 'TRIG_TOUR/trig-tour/view/ArrowLine' );
  var ArrowNode = require( 'SCENERY_PHET/ArrowNode' );
  var Bounds2 = require( 'DOT/Bounds2' );
  var Circle = require( 'SCENERY/nodes/Circle' );
  //var Image = require( 'SCENERY/nodes/Image');
  var inherit = require( 'PHET_CORE/inherit' );
  var Line = require( 'SCENERY/nodes/Line' );
  var Node = require( 'SCENERY/nodes/Node' );
  var Path = require( 'SCENERY/nodes/Path' );
  var Property = require('AXON/Property');
  var PhetFont = require( 'SCENERY_PHET/PhetFont' );
  var Rectangle = require( 'SCENERY/nodes/Rectangle' );
  var Shape = require( 'KITE/Shape' );
  var SimpleDragHandler = require( 'SCENERY/input/SimpleDragHandler' );
  var Text = require( 'SCENERY/nodes/Text' );
  var UtilTrig = require( 'TRIG_TOUR/trig-tour/common/Util' );
  var Vector2 = require( 'DOT/Vector2' );

  //strings
  var xStr = 'x';
  var yStr = 'y';
  var oneStr = '1';
  //var plusOneStr = '+1';
  var minusOneStr = '-1';
  var thetaStr = require( 'string!TRIG_TOUR/theta' );

  //constants
  var DISPLAY_FONT = new PhetFont( 20 );
  var DISPLAY_FONT_LARGE = new PhetFont( 22 );
  var DISPLAY_FONT_SMALL = new PhetFont( 18 );
  var DISPLAY_FONT_ITALIC = new PhetFont( { size: 20, style: 'italic' } );
  var LINE_COLOR = UtilTrig.LINE_COLOR;
  var TEXT_COLOR = UtilTrig.TEXT_COLOR;
  var TEXT_COLOR_GRAY = UtilTrig.TEXT_COLOR_GRAY;
  var COS_COLOR = UtilTrig.COS_COLOR;
  var SIN_COLOR = UtilTrig.SIN_COLOR;
  var VIEW_BACKGROUND_COLOR = UtilTrig.VIEW_BACKGROUND_COLOR;



  /**
   * View of the unit circle with grabbable radial arm, called the rotor arm
   * @param {TrigTourModel} model is the main model of the sim
   * @constructor
   */

  function UnitCircleView( model ) {

    var unitCircleView = this;
    this.model = model;
    var trigLabModel = model;

    // Call the super constructor
    Node.call( unitCircleView );

    //Draw Unit Circle
    var radius = 160; //radius of unit circle in pixels
    //provides parent node and origin for rotorGraphic
    var circleGraphic = new Circle( radius, { stroke: LINE_COLOR, lineWidth: 3 } );

    //Draw 'special angle' locations on unit circle
    //special angles are at 0, 30, 45, 60, 90, 120, 135, 150, 180, -30, ...
    this.specialAnglesNode = new Node();
    var angles = [ 0, 30, 45, 60, 90, 120, 135, 150, 180, -30, -45, -60, -90, -120, -135, -150 ];
    var xPos, yPos; //x and y coordinates of special angle on unit circle
    for ( var i = 0; i < angles.length; i++ ) {
      xPos = radius * Math.cos( angles[ i ] * Math.PI / 180 );
      yPos = radius * Math.sin( angles[ i ] * Math.PI / 180 );
      this.specialAnglesNode.addChild( new Circle(
        5,
        { stroke: LINE_COLOR, fill: 'white', lineWidth: 1, x: xPos, y: yPos }
      ) );
    }

    //draw background Rectangle( x, y, width, height, arcWidth, arcHeight, options )
    var bWidth = 2.4 * radius;
    var bHeight = 2.4 * radius;
    var arcRadius = 8;
    this.background = new Rectangle(
      -bWidth / 2,
      -bHeight / 2,
      bWidth,
      bHeight,
      arcRadius,
      arcRadius,
      { fill: VIEW_BACKGROUND_COLOR, opacity: 0.7, stroke: TEXT_COLOR_GRAY, lineWidth: 2 }
    );

    //Draw x-, y-axes with x and y labels
    //ArrowNode( tailX, tailY, tipX, tipY, options )
    var yAxis = new ArrowNode( 0, 1.2 * radius, 0, -1.2 * radius, { tailWidth: 0.3, headHeight: 12, headWidth: 8 } );
    var xAxis = new ArrowNode( -1.2 * radius, 0, 1.2 * radius, 0, { tailWidth: 0.3, headHeight: 12, headWidth: 8 } );

    //Draw and position x-, y-axis labels
    var fontInfo = { font: DISPLAY_FONT, fill: TEXT_COLOR };
    var xText = new Text( xStr, fontInfo );
    var yText = new Text( yStr, fontInfo );
    xAxis.addChild( xText );
    yAxis.addChild( yText );
    xText.left = 1.2 * radius + 5;
    xText.centerY = yAxis.centerY;
    yText.right = -12;
    yText.top = -1.2 * radius - 2;

    //Draw Grid, simple square grid, visibility set by Control Panel;
    var r = radius;
    var gridShape = new Shape();
    gridShape.moveTo( -r, -r );
    gridShape.lineTo( r, -r ).lineTo( r, r ).lineTo( -r, r ).lineTo( -r, -r );
    gridShape.moveTo( -r, -r / 2 ).lineTo( r, -r / 2 ).moveTo( -r, r / 2 ).lineTo( r, r / 2 );
    gridShape.moveTo( -r / 2, -r ).lineTo( -r / 2, r ).moveTo( r / 2, -r ).lineTo( r / 2, r );
    this.grid = new Path( gridShape, { lineWidth: 2, stroke: TEXT_COLOR_GRAY } );
    this.grid.visible = false;

    //draw vertical (sine) line on rotor triangle
    //displayed line is either simple Line (no arrow head) or ArrowLine (with arrow head)
    this.vLine = new Line( 0, 0, 0, -radius, { lineWidth: 4, stroke: 'black' } );
    this.vArrowLine = new ArrowLine( radius, 'v', { lineWidth: 6, stroke: SIN_COLOR } );

    //draw horizontal (cosine) line on rotor triangle
    this.hLine = new Line( 0, 0, radius, 0, { lineWidth: 4, stroke: 'black' } );
    this.hArrowLine = new ArrowLine( radius, 'h', { lineWidth: 6, stroke: COS_COLOR } );

    //Draw rotor arm with draggable red dot at end
    var rotorGraphic = new Node();
    rotorGraphic.addChild( new Line( 0, 0, radius, 0, { lineWidth: 4, stroke: '#000' } ) );
    rotorGraphic.addChild( new Circle(
      7,
      { stroke: LINE_COLOR, fill: "red", x: radius, y: 0, cursor: 'pointer' }
    ) );
    var hitBound = 30;
    //Bounds2( minX, minY, maxX, maxY )
    rotorGraphic.mouseArea = new Bounds2( radius - hitBound, -hitBound, radius + hitBound, hitBound );
    rotorGraphic.touchArea = new Bounds2( radius - hitBound, -hitBound, radius + hitBound, hitBound );

    //Draw x, y, and '1' labels on the xyR triangle
    var labelCanvas = new Node();
    fontInfo = { font: DISPLAY_FONT_LARGE, fill: TEXT_COLOR };
    var oneText = new Text( oneStr, fontInfo );
    xText = new Text( xStr, fontInfo );            //xText, yText already defined above
    yText = new Text( yStr, fontInfo );
    fontInfo = { font: DISPLAY_FONT_ITALIC, fill: TEXT_COLOR };
    var thetaText = new Text( thetaStr, fontInfo );
    //+1, -1 labels on axes
    fontInfo = { font: DISPLAY_FONT_SMALL, fill: TEXT_COLOR_GRAY };
    var oneXText = new Text( oneStr, fontInfo );
    var minusOneXText = new Text( minusOneStr, fontInfo );
    var oneYText = new Text( oneStr, fontInfo );
    var minusOneYText = new Text( minusOneStr, fontInfo );

    //position +1/-1 labels on xy axes
    oneXText.left = this.grid.right + 5;
    oneXText.top = 7;
    minusOneXText.right = this.grid.left - 5;
    minusOneXText.top = 7;
    oneYText.bottom = this.grid.top;
    oneYText.left = 5;
    minusOneYText.top = this.grid.bottom;
    minusOneYText.right = -5;

    labelCanvas.children = [ oneText, xText, yText, thetaText, oneXText, minusOneXText, oneYText, minusOneYText ];


    //add the children to parent node
    //var content = new Node();
    unitCircleView.children =[
      this.background,
      this.grid,
      circleGraphic,
      xAxis,
      yAxis,
      this.hArrowLine,
      this.hLine,
      this.vArrowLine,
      this.vLine,
      this.specialAnglesNode,
      rotorGraphic,
      labelCanvas
    ];


    //If user exceeds maximum allowed angle of +/-25.25 rotations, then image of dizzy PhET girl appears in
    // TrigTourScreenView (the main view) and user cannot increase magnitude of angle any further.
    // User can then only decrease magnitude of angle.
    this.maxAngleExceededProperty = new Property( false );
    var maxAllowedSmallAngle = 0.5 * Math.PI;
    var maxAllowedAngle = 2 * 2 * Math.PI + maxAllowedSmallAngle;

    var mouseDownPosition = new Vector2( 0, 0 );
    rotorGraphic.addInputListener( new SimpleDragHandler(
      {
        // When dragging across it in a mobile device, pick it up
        allowTouchSnag: true,
        //start function for testing only
        start: function( e ) {
          mouseDownPosition = e.pointer.point;
        },

        drag: function( e ) {
          var v1 = rotorGraphic.globalToParentPoint( e.pointer.point );   //returns Vector2
          var smallAngle = -v1.angle(); //model angle is negative of xy screen coordinates angle
          if ( !unitCircleView.maxAngleExceededProperty.value ) {
            if ( !model.specialAnglesMode ) {
              model.setAngle( smallAngle );
            }
            else {
              model.setSpecialAngleWithSmallAngle( smallAngle );
            }
          }
          else {  //if maxAngleExceeded, update only if user decreases angle
            if ( Math.abs( smallAngle ) < maxAllowedSmallAngle ) {
              model.setAngle( smallAngle );
            }
          }
          unitCircleView.maxAngleExceededProperty.value = ( Math.abs( model.getAngleInRadians() ) > maxAllowedAngle );
        }
      } ) );

    //draw angle arc on unit circle
    arcRadius = 0.2 * radius;   //initial arc radius = 0.2 of rotor radius
    var arcShape = new Shape();
    var angleArcPath = new Path( arcShape, { stroke: LINE_COLOR, lineWidth: 2 } );

    //following code is to speed up drawing
    var emptyBounds = new Bounds2( 0, 0, 0, 0 );
    angleArcPath.computeShapeBounds = function() {
      return emptyBounds;
    };

    //draw Arrow Head on Angle Arc
    var arrowHeadShape = new Shape();
    var hW = 7;     //arrow head width
    var hL = 12;    //arrow head length
    arrowHeadShape.moveTo( 0, 0 ).lineTo( -hW / 2, hL ).lineTo( hW / 2, hL ).close();
    var angleArcArrowHead = new Path( arrowHeadShape, { lineWidth: 1, fill: LINE_COLOR } );
    angleArcPath.addChild( angleArcArrowHead );
    circleGraphic.addChild( angleArcPath );

    //draw angle arc with gradually increasing radius
    var drawAngleArc = function() {
      var arcShape = new Shape();  //This seems wasteful, but there is no Shape.clear() function
      arcRadius = 0.2 * radius;
      arcShape.moveTo( arcRadius, 0 );
      var totalAngle = model.getAngleInRadians();
      var deltaAngle = 0.1;  //delta-angle in radians
      if ( Math.abs( totalAngle ) < 0.5 ) {
        deltaAngle = 0.02;
      }
      var angle = 0;  //short for angle
      if ( totalAngle > 0 ) {
        for ( angle = 0; angle <= totalAngle; angle += deltaAngle ) {
          arcRadius += deltaAngle;
          arcShape.lineTo( arcRadius * Math.cos( angle ), -arcRadius * Math.sin( angle ) );
        }
      }
      else {
        for ( angle = 0; angle >= totalAngle; angle -= deltaAngle ) {
          arcRadius += deltaAngle;
          arcShape.lineTo( arcRadius * Math.cos( angle ), -arcRadius * Math.sin( angle ) );
        }
      }

      angleArcPath.setShape( arcShape );

      //show arrow head on angle arc if angle is > 45 degs
      if ( Math.abs( totalAngle ) < 45 * Math.PI / 180 ) {
        angleArcArrowHead.visible = false;
      }
      else {
        angleArcArrowHead.visible = true;
      }
      angleArcArrowHead.x = arcRadius * Math.cos( totalAngle );
      angleArcArrowHead.y = -arcRadius * Math.sin( totalAngle );
      //orient arrow head on angle arc correctly
      if ( totalAngle < 0 ) {
        angleArcArrowHead.rotation = Math.PI - totalAngle - ( 6 / arcRadius );
      }
      else {
        angleArcArrowHead.rotation = -totalAngle + ( 6 / arcRadius );
      }
    };   //end drawAngleArc


    //visibility of x,y, and '1' labels on xyR triangle
    this.setLabelVisibility = function( isVisible ) {
      positionLabels();
      labelCanvas.visible = isVisible;
    };

    //position the x, y, '1', and theta labels on the xyR triangle of the unit circle
    var positionLabels = function() {
      var smallAngle = trigLabModel.getSmallAngleInRadians();
      var totalAngle = trigLabModel.getAngleInRadians();
      var pi = Math.PI;
      //set visibility of the labels
      if ( Math.abs( totalAngle ) < 40 * pi / 180 ) {
        thetaText.visible = false;
      }
      else {
        thetaText.visible = true;
      }
      var sAngle = Math.abs( smallAngle * 180 / pi );  //small angle in degrees
      if ( sAngle < 10 || (180 - sAngle) < 10 ) {
        yText.visible = false;
      }
      else {
        yText.visible = true;
      }
      if ( Math.abs( 90 - sAngle ) < 5 ) {
        xText.visible = false;
      }
      else {
        xText.visible = true;
      }

      //position one-label
      var angleOffset = 9 * pi / 180;
      var sign = 1; //if sign = +1, one-label is to right of radius, if sign = -1 then to the left
      if ( ( smallAngle > pi / 2 && smallAngle <= pi ) || ( smallAngle >= -pi / 2 && smallAngle < 0 ) ) {
        sign = -1;
      }
      var xInPix = radius * Math.cos( smallAngle + sign * angleOffset );
      var yInPix = radius * Math.sin( smallAngle + sign * angleOffset );
      oneText.centerX = 0.6 * xInPix;
      oneText.centerY = -0.6 * yInPix;

      //position x-label
      var xPos = 0.5 * radius * Math.cos( smallAngle );
      var yPos = 0.6 * xText.height;
      if ( smallAngle < 0 ) { yPos = -0.6 * xText.height; }
      xText.centerX = xPos;
      xText.centerY = yPos;

      //position y-label
      sign = 1;
      if ( ( smallAngle > pi / 2 && smallAngle < pi ) || ( smallAngle > -pi && smallAngle < -pi / 2 ) ) {
        sign = -1;
      }
      xPos = radius * Math.cos( smallAngle ) + sign * xText.width;
      yPos = -0.5 * radius * Math.sin( smallAngle );
      yText.centerX = xPos;
      yText.centerY = yPos;

      //show and position theta-label on angle arc if arc is greater than 20 degs
      xPos = ( arcRadius + 10 ) * Math.cos( totalAngle / 2 );
      yPos = -( arcRadius + 10 ) * Math.sin( totalAngle / 2 );
      thetaText.centerX = xPos;
      thetaText.centerY = yPos;
    };//end positionLabels()


    // Register for synchronization with model.
    model.angleProperty.link( function( angle ) {
      rotorGraphic.rotation = -angle;  //model angle is negative of xy screen coords angle
      var cos = Math.cos( angle );
      var sin = Math.sin( angle );
      unitCircleView.vLine.x = radius * cos;
      unitCircleView.vLine.setPoint2( 0, -radius * sin );
      unitCircleView.hLine.setPoint2( radius * cos, 0 );
      unitCircleView.vArrowLine.x = radius * cos;
      unitCircleView.vArrowLine.setEndPoint( radius * sin );
      unitCircleView.hArrowLine.setEndPoint( radius * cos );
      drawAngleArc();
      positionLabels();
    } );
  }//end constructor

  return inherit( Node, UnitCircleView );
} );