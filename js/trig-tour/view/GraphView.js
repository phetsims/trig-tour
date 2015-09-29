// Copyright 2002-2015, University of Colorado Boulder

/**
 * View of Graph of sin, cos, or tan vs. theta, at bottom of stage, below unit circle
 * Grabbable pointer indicates current value of theta and the function.
 *
 * The graph exists in a panel that can be minimized so that the graph is hidden on the display.  Since the
 * panel needs to shrink down to the size of the title when minimized, AccordionBox could not be used.
 *
 * @author Michael Dubson (PhET developer) on 6/3/2015.
 */
define( function( require ) {
  'use strict';

  // modules
  var TrigIndicatorArrowNode = require( 'TRIG_TOUR/trig-tour/view/TrigIndicatorArrowNode' );
  var Bounds2 = require( 'DOT/Bounds2' );
  var Circle = require( 'SCENERY/nodes/Circle' );
  var ExpandCollapseButton = require( 'SUN/ExpandCollapseButton' );
  var HBox = require( 'SCENERY/nodes/HBox' );
  var HTMLText = require( 'SCENERY/nodes/HTMLText' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Line = require( 'SCENERY/nodes/Line' );
  var Node = require( 'SCENERY/nodes/Node' );
  var Panel = require( 'SUN/Panel' );
  var Path = require( 'SCENERY/nodes/Path' );
  var PhetFont = require( 'SCENERY_PHET/PhetFont' );
  var Property = require( 'AXON/Property' );
  var Rectangle = require( 'SCENERY/nodes/Rectangle' );
  var Shape = require( 'KITE/Shape' );
  var SimpleDragHandler = require( 'SCENERY/input/SimpleDragHandler' );
  var Text = require( 'SCENERY/nodes/Text' );
  var TriangleNode = require( 'TRIG_TOUR/trig-tour/view/TriangleNode' );
  var Util = require( 'DOT/Util' );
  var TrigTourColors = require( 'TRIG_TOUR/trig-tour/view/TrigTourColors' );
  var Vector2 = require( 'DOT/Vector2' );
  var TrigTourModel = require( 'TRIG_TOUR/trig-tour/model/TrigTourModel' );
  var TrigTourGraphAxesNode = require( 'TRIG_TOUR/trig-tour/view/TrigTourGraphAxesNode' );

  //strings
  var theta = require( 'string!TRIG_TOUR/theta' );
  var cosStr = require( 'string!TRIG_TOUR/cos' );
  var sinStr = require( 'string!TRIG_TOUR/sin' );
  var tanStr = require( 'string!TRIG_TOUR/tan' );
  var vsStr = require( 'string!TRIG_TOUR/vs' );

  //constants
  var BACKGROUND_COLOR = TrigTourColors.BACKGROUND_COLOR;
  var COS_COLOR = TrigTourColors.COS_COLOR;
  var SIN_COLOR = TrigTourColors.SIN_COLOR;
  var TAN_COLOR = TrigTourColors.TAN_COLOR;
  var LINE_COLOR = TrigTourColors.LINE_COLOR;
  var TEXT_COLOR_GRAY = TrigTourColors.TEXT_COLOR_GRAY;
  var VIEW_BACKGROUND_COLOR = TrigTourColors.VIEW_BACKGROUND_COLOR;
  var DISPLAY_FONT = new PhetFont( 20 );

  /**
   * Constructor for view of Graph, which displays sin, cos, or tan vs angle theta in either degrees or radians, and
   * has a draggable handle for changing the angle.
   *
   * @param {TrigTourModel} trigTourModel
   * @param {number} height of y-axis on graph
   * @param {number} width of x-axis on graph
   * @param {ViewProperties} viewProperties - which graph is visible, one of 'cos', 'sin', or 'tan'
   * @constructor
   */
  function GraphView( trigTourModel, height, width, viewProperties ) {

    var thisGraphView = this;
    this.trigTourModel = trigTourModel;
    this.viewProperties = viewProperties;
    this.expandedProperty = new Property( true ); // @private, Graph can be hidden with expandCollapse button

    // Call the super constructor
    Node.call( thisGraphView );

    var marginWidth = 25;   // distance in pixels between edge of Node and edge of nearest full wavelength
    var wavelength = ( width - 2 * marginWidth ) / 4;  //wavelength of sinusoidal curve in pixels
    this.amplitude = 0.45 * height;  // @private amplitude of sinusoidal curve in pixels
    var numberOfWavelengths = 2 * 2;    // number of full wavelengths displayed, must be even to keep graph symmetric

    var emptyNode = new Text( '   ', { font: DISPLAY_FONT } );    //to make space for expandCollapseButton
    this.cosThetaVsThetaText = cosStr + '<i>' + theta + '</i>' + ' ' + vsStr + ' ' + '<i>' + theta + '</i>';
    this.sinThetaVsThetaText = sinStr + '<i>' + theta + '</i>' + ' ' + vsStr + ' ' + '<i>' + theta + '</i>';
    this.tanThetaVsThetaText = tanStr + '<i>' + theta + '</i>' + ' ' + vsStr + ' ' + '<i>' + theta + '</i>';

    this.graphTitle = new HTMLText( this.cosThetaVsThetaText, { font: DISPLAY_FONT } );
    var titleDisplayHBox = new HBox( { children: [ emptyNode, this.graphTitle ], spacing: 5 } );

    var panelOptions = {
      fill: 'white',
      stroke: TEXT_COLOR_GRAY,
      lineWidth: 2, // width of the background border
      xMargin: 12,
      yMargin: 5,
      cornerRadius: 5, // radius of the rounded corners on the background
      resize: false, // dynamically resize when content bounds change
      backgroundPickable: false,
      align: 'left', // {string} horizontal of content in the pane, left|center|right
      minWidth: 0 // minimum width of the panel
    };

    // when graph is collapsed/hidden, a title is displayed
    this.titleDisplayPanel = new Panel( titleDisplayHBox, panelOptions );
    this.expandCollapseButton = new ExpandCollapseButton( this.expandedProperty, {
      sideLength: 15,
      cursor: 'pointer'
    } );

    var hitBound = 30;
    var midX = this.expandCollapseButton.centerX;
    var midY = this.expandCollapseButton.centerY;
    this.expandCollapseButton.mouseArea = new Bounds2( midX - hitBound, midY - hitBound, midX + hitBound, midY + hitBound );
    this.expandCollapseButton.touchArea = new Bounds2( midX - hitBound, midY - hitBound, midX + hitBound, midY + hitBound );

    // draw white background
    var backgroundHeight = 1.2 * height;
    var backgroundWidth = 1.05 * width;
    var arcRadius = 10;
    var backgroundRectangle = new Rectangle( -backgroundWidth / 2, -(backgroundHeight / 2) - 5, backgroundWidth, backgroundHeight, arcRadius, arcRadius, {
      fill: VIEW_BACKGROUND_COLOR,
      stroke: TEXT_COLOR_GRAY,
      lineWidth: 2
    } );

    // align expandCollapseButton and titleDisplayButton
    this.expandCollapseButton.left = backgroundRectangle.left + 7;
    this.expandCollapseButton.top = backgroundRectangle.top + 7;
    this.titleDisplayPanel.left = backgroundRectangle.left;
    this.titleDisplayPanel.top = backgroundRectangle.top;

    // draw right and left border rectangles, which serve to hide indicator line when it is off the graph
    var borderWidth = 400;
    var borderHeight = 1000;
    var rightBorder = new Rectangle(
      -backgroundWidth / 2 - borderWidth - 1,
      -0.8 * borderHeight, borderWidth,
      borderHeight,
      { fill: BACKGROUND_COLOR }
    );
    var leftBorder = new Rectangle(
      backgroundWidth / 2 + 1,
      -0.8 * borderHeight,
      borderWidth,
      borderHeight,
      { fill: BACKGROUND_COLOR }
    );

    // @public (read-only)
    this.graphAxesNode = new TrigTourGraphAxesNode( width, wavelength, numberOfWavelengths, this.amplitude, viewProperties );

    // Draw sinusoidal curves
    var cosShape = new Shape();
    var sinShape = new Shape();
    var tanShape = new Shape();
    var dx = wavelength / 100;
    var numberOfPoints = ( numberOfWavelengths + 0.08 ) * wavelength / dx;
    var xOrigin = 0;
    var yOrigin = 0;
    var xPos = xOrigin - numberOfPoints * dx / 2;
    sinShape.moveTo( xPos, yOrigin - this.amplitude * Math.sin( 2 * Math.PI * (xPos - xOrigin) / wavelength ) );
    cosShape.moveTo( xPos, yOrigin - this.amplitude * Math.cos( 2 * Math.PI * (xPos - xOrigin) / wavelength ) );
    tanShape.moveTo( xPos, yOrigin - this.amplitude * Math.tan( 2 * Math.PI * (xPos - xOrigin) / wavelength ) );

    // draw sin and cos curves
    for ( var i = 0; i < numberOfPoints; i++ ) {
      xPos += dx;
      sinShape.lineTo( xPos, yOrigin - this.amplitude * Math.sin( 2 * Math.PI * (xPos - xOrigin) / wavelength ) );
      cosShape.lineTo( xPos, yOrigin - this.amplitude * Math.cos( 2 * Math.PI * (xPos - xOrigin) / wavelength ) );
    }

    xPos = xOrigin - numberOfPoints * dx / 2;  //start at left edge
    var tanValue = Math.tan( 2 * Math.PI * (xPos - xOrigin) / wavelength );

    // draw tangent curve cut off at upper and lower limits, need more resolution due to steep slope
    dx = wavelength / 600;  //x-distance between points on curve
    numberOfPoints = ( numberOfWavelengths + 0.08 ) * wavelength / dx;
    var maxTanValue = 1.2;
    var minTanValue = -1.0;
    var yPos;
    for ( i = 0; i < numberOfPoints; i++ ) {
      tanValue = Math.tan( 2 * Math.PI * ( xPos - xOrigin ) / wavelength );
      yPos = yOrigin - this.amplitude * tanValue;
      if ( ( tanValue <= maxTanValue ) && ( tanValue > minTanValue ) ) {
        tanShape.lineTo( xPos, yPos );
      }
      else {
        tanShape.moveTo( xPos, yPos );
      }
      xPos += dx;
    }

    this.sinPath = new Path( sinShape, { stroke: SIN_COLOR, lineWidth: 3 } );
    this.cosPath = new Path( cosShape, { stroke: COS_COLOR, lineWidth: 3 } );
    this.tanPath = new Path( tanShape, { stroke: TAN_COLOR, lineWidth: 3 } );

    // Add TriangleNode arrow heads at ends of curves
    var pi = Math.PI;
    var leftEnd = -( numberOfWavelengths + 0.08 ) * wavelength / 2;
    var rightEnd = ( numberOfWavelengths + 0.08 ) * wavelength / 2;
    var arrowHeadLength = 15;
    var arrowHeadWidth = 8;

    // Place arrow heads on left and right ends of sin curve
    var slopeLeft = ( this.amplitude * 2 * pi / wavelength ) * Math.cos( 2 * pi * leftEnd / wavelength );
    var slopeRight = ( this.amplitude * 2 * pi / wavelength ) * Math.cos( 2 * pi * rightEnd / wavelength );
    var angleLeft = Util.toDegrees( Math.atan( slopeLeft ) );
    var angleRight = Util.toDegrees( Math.atan( slopeRight ) );
    var sinArrowLeft = new TriangleNode( arrowHeadLength, arrowHeadWidth, SIN_COLOR, -angleLeft + 180 );
    var sinArrowRight = new TriangleNode( arrowHeadLength, arrowHeadWidth, SIN_COLOR, -angleRight );
    sinArrowLeft.x = leftEnd;
    sinArrowRight.x = rightEnd;
    sinArrowLeft.y = -this.amplitude * Math.sin( 2 * pi * leftEnd / wavelength );
    sinArrowRight.y = -this.amplitude * Math.sin( 2 * pi * rightEnd / wavelength );
    this.sinPath.children = [ sinArrowLeft, sinArrowRight ];

    // Place arrow heads on ends of cos curve
    slopeLeft = ( this.amplitude * 2 * pi / wavelength ) * Math.sin( 2 * pi * leftEnd / wavelength );
    slopeRight = ( this.amplitude * 2 * pi / wavelength ) * Math.sin( 2 * pi * rightEnd / wavelength );
    angleLeft = Util.toDegrees( Math.atan( slopeLeft ) );
    angleRight = Util.toDegrees( Math.atan( slopeRight ) );
    var cosArrowLeft = new TriangleNode( arrowHeadLength, arrowHeadWidth, COS_COLOR, angleLeft + 180 );
    var cosArrowRight = new TriangleNode( arrowHeadLength, arrowHeadWidth, COS_COLOR, angleRight );
    cosArrowLeft.x = leftEnd;
    cosArrowRight.x = rightEnd;
    cosArrowLeft.y = -this.amplitude * Math.cos( 2 * pi * leftEnd / wavelength );
    cosArrowRight.y = -this.amplitude * Math.cos( 2 * pi * rightEnd / wavelength );
    this.cosPath.children = [ cosArrowLeft, cosArrowRight ];

    //Place arrow heads on ends of all tan curve segments. This is pretty tricky
    var arrowHeads = []; //array of arrow heads

    // x and y coordinates of ends of the 'central' tan segment, in pixels.
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
      yPosMax = -Math.tan( xPosMax * 2 * pi / wavelength ) * this.amplitude;
      yPosMin = -Math.tan( xPosMin * 2 * pi / wavelength ) * this.amplitude;
      arrowHeads.push( new Vector2( xPosMax, yPosMax ) );
      arrowHeads.push( new Vector2( xPosMin, yPosMin ) );
    }

    // The left and right end arrow heads are special cases.
    // Remove extraneous left- and right-end arrow heads created in previous for-loop
    // and replace with correct arrow heads
    var yLeftEnd = -Math.tan( leftEnd * 2 * pi / wavelength ) * this.amplitude;
    var yRightEnd = -Math.tan( rightEnd * 2 * pi / wavelength ) * this.amplitude;
    arrowHeads.splice( arrowHeads.length - 2, 1, new Vector2( rightEnd, yRightEnd ) );
    arrowHeads.splice( 1, 1, new Vector2( leftEnd, yLeftEnd ) );
    var triangleNode;
    var rotationAngle;
    for ( i = 0; i < arrowHeads.length; i++ ) {
      var xPix = arrowHeads[ i ].x;
      var yPix = arrowHeads[ i ].y;
      var xTan = xPix * 2 * pi / wavelength;

      // Derivative of tan is 1 + tan^2
      var tanSlope = ( this.amplitude * 2 * pi / wavelength ) * ( 1 + Math.tan( xTan ) * Math.tan( xTan ) );
      rotationAngle = -Util.toDegrees( Math.atan( tanSlope ) );
      if ( i % 2 !== 0 ) {
        rotationAngle += 180;
      }

      triangleNode = new TriangleNode( arrowHeadLength, arrowHeadWidth, TAN_COLOR, rotationAngle );
      this.tanPath.addChild( triangleNode );
      triangleNode.x = xPix;
      triangleNode.y = yPix + 1;
    }

    // SingularityIndicator is a dashed vertical line indicating singularity in tan function at angle = +/- 90 deg
    this.singularityIndicator = new Line( 0, -800, 0, 400, { stroke: TAN_COLOR, lineWidth: 2, lineDash: [ 10, 5 ] } );
    hitBound = 20;
    midX = this.singularityIndicator.centerX;
    var minY = this.singularityIndicator.bottom;
    var maxY = this.singularityIndicator.top;
    this.singularityIndicator.mouseArea = new Bounds2( midX - hitBound, minY, midX + hitBound, maxY );
    this.singularityIndicator.touchArea = new Bounds2( midX - hitBound, minY, midX + hitBound, maxY );
    this.singularityIndicator.visible = false;
    this.tanPath.addChild( this.singularityIndicator );

    // trigIndicatorArrowNode is a vertical arrow on the trig curve showing current value of angle and trigFunction(angle)
    // a red dot on top of the indicator line echoes red dot on unit circle
    hitBound = 30;
    this.trigIndicatorArrowNode = new TrigIndicatorArrowNode( this.amplitude, 'vertical', {
      tailWidth: 5,
      headWidth: 12,
      headHeight: 20,
      cursor: 'pointer'
    } );
    this.trigIndicatorArrowNode.touchArea = new Bounds2( -hitBound, -300, hitBound, +100 );
    this.trigIndicatorArrowNode.mouseArea = new Bounds2( -hitBound, -300, hitBound, +100 );
    this.redDotHandle = new Circle( 7, { stroke: LINE_COLOR, fill: "red", cursor: 'pointer' } );
    this.trigIndicatorArrowNode.addChild( this.redDotHandle );

    // All graphic elements, curves, axes, labels, etc are placed on display node, with visibility set by
    // expandCollapseButton
    var displayNode = new Node();

    // Rendering order for display children.
    displayNode.children = [
      this.graphAxesNode.axisNode,
      this.sinPath,
      this.cosPath,
      this.tanPath,
      this.graphAxesNode.labelsNode,
      this.trigIndicatorArrowNode,
      rightBorder,
      leftBorder
    ];

    thisGraphView.children = [
      backgroundRectangle,
      this.titleDisplayPanel,
      this.expandCollapseButton,
      displayNode
    ];

    this.expandCollapseButton.expandedProperty.link( function( expanded ) {
      backgroundRectangle.visible = expanded;
      displayNode.visible = expanded;
      thisGraphView.titleDisplayPanel.visible = !expanded;
    } );

    this.trigIndicatorArrowNode.addInputListener( new SimpleDragHandler(
      {
        allowTouchSnag: true,

        drag: function( e ) {
          var position = thisGraphView.trigIndicatorArrowNode.globalToParentPoint( e.pointer.point );   //returns Vector2
          var fullAngle = ( 2 * Math.PI * position.x / wavelength );   // in radians

          // make sure the full angle does not exceed max allowed angle
          trigTourModel.checkMaxAngleExceeded();

          if ( !trigTourModel.maxAngleExceeded ) {
            if ( !viewProperties.specialAnglesVisibleProperty.value ) {
              trigTourModel.setFullAngleInRadians( fullAngle );
            }
            else {
              trigTourModel.setSpecialAngleWithFullAngle( fullAngle );
            }
          }
          else {
            // max angle exceeded, ony update if user tries to decrease magnitude of fullAngle
            if ( Math.abs( fullAngle ) < TrigTourModel.MAX_FULL_ANGLE ) {
              trigTourModel.setFullAngleInRadians( fullAngle );
            }
          }
        }
      } ) );

    // Register for synchronization with model
    // function that reduces the indicator arrow tail width around the tan function singularity
    var setIndicatorTailWidth = function() {
      var tanSize = Math.abs( trigTourModel.tan() );
      if ( thisGraphView.viewProperties.graphProperty.value === 'tan' && tanSize > 1.5 ) {
        thisGraphView.trigIndicatorArrowNode.setTailWidth( Math.max( 2, 5 - 0.1 * tanSize ) );
      }
      else {
        thisGraphView.trigIndicatorArrowNode.setTailWidth( 5 );
      }
    };

    trigTourModel.fullAngleProperty.link( function( fullAngle ) {
      var xPos = fullAngle / (2 * Math.PI) * wavelength;
      thisGraphView.trigIndicatorArrowNode.x = xPos;
      thisGraphView.singularityIndicator.x = xPos;
      setIndicatorTailWidth();
      thisGraphView.setTrigIndicatorArrowNode();
    } );

    viewProperties.graphProperty.link( function( graph ) {
      // whenever the graph changes, make sure that the trigIndicatorArrowNode has a correctly sized tail width
      setIndicatorTailWidth();

      //set visibility of curves on graph view
      thisGraphView.cosPath.visible = ( graph === 'cos' );
      thisGraphView.sinPath.visible = ( graph === 'sin' );
      thisGraphView.tanPath.visible = ( graph === 'tan' );

      // set title bar in GraphView
      thisGraphView.setTitleBar( graph );
      if ( trigTourModel.singularity ) {
        if ( graph === 'cos' || graph === 'sin' ) {
          thisGraphView.trigIndicatorArrowNode.opacity = 1;
          thisGraphView.singularityIndicator.visible = false;
        }
        else {
          // always want indicatorLine grabbable, so do NOT want indicatorLine.visible = false
          thisGraphView.trigIndicatorArrowNode.opacity = 0;
          thisGraphView.singularityIndicator.visible = true;
        }
      }
      thisGraphView.setTrigIndicatorArrowNode();
    } );

    trigTourModel.singularityProperty.link( function( singularity ) {
      if ( thisGraphView.viewProperties.graphProperty.value === 'tan' ) {
        thisGraphView.singularityIndicator.visible = singularity;
        // trigIndicatorArrowNode must always be draggable, so it must adjust visibility by setting opacity
        if ( singularity ) {
          thisGraphView.trigIndicatorArrowNode.opacity = 0;
        }
        else {
          thisGraphView.trigIndicatorArrowNode.opacity = 1;
        }
      }
    } );
  }

  return inherit( Node, GraphView, {

    /**
     * Set the indicator line, which is a draggable, vertical arrow indicating current location on graph.
     */
    setTrigIndicatorArrowNode: function() {
      var cosNow = this.trigTourModel.cos();
      var sinNow = this.trigTourModel.sin();
      var tanNow = this.trigTourModel.tan();
      if ( this.viewProperties.graphProperty.value === 'cos' ) {
        this.trigIndicatorArrowNode.setEndPoint( cosNow * this.amplitude );
        this.trigIndicatorArrowNode.setColor( COS_COLOR );
        this.redDotHandle.y = -cosNow * this.amplitude;
      }
      else if ( this.viewProperties.graphProperty.value === 'sin' ) {
        this.trigIndicatorArrowNode.setEndPoint( sinNow * this.amplitude );
        this.trigIndicatorArrowNode.setColor( SIN_COLOR );
        this.redDotHandle.y = -sinNow * this.amplitude;
      }
      else if ( this.viewProperties.graphProperty.value === 'tan' ) {
        this.trigIndicatorArrowNode.setEndPoint( tanNow * this.amplitude );
        this.trigIndicatorArrowNode.setColor( TAN_COLOR );
        this.redDotHandle.y = -tanNow * this.amplitude;
      }
      else {
        //Do nothing, following line for debugging only
        console.error( 'ERROR in GraphView.setTrigIndicatorArrowNode()' );
      }
    },

    /**
     * Set the title bar text.
     *
     * @param {string} trigString
     */
    setTitleBar: function( trigString ) {
      if ( trigString === 'cos' ) {
        this.graphTitle.text = this.cosThetaVsThetaText;
      }
      else if ( trigString === 'sin' ) {
        this.graphTitle.text = this.sinThetaVsThetaText;
      }
      else if ( trigString === 'tan' ) {
        this.graphTitle.text = this.tanThetaVsThetaText;
      }
    }
  } );
} );