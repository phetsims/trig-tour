// Copyright 2002-2015, University of Colorado Boulder

/**
 * View of Graph of sin, cos, or tan vs. theta, at bottom of stage, below unit circle
 * Grabbable pointer indicates current value of theta and the function.
 *
 * @author Michael Dubson (PhET developer) on 6/3/2015.
 */
define( function( require ) {
  'use strict';

  // modules
  var ArrowLine = require( 'TRIG_TOUR/trig-tour/view/ArrowLine' );
  var ArrowNode = require( 'SCENERY_PHET/ArrowNode' );
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
  var SubSupText = require( 'SCENERY_PHET/SubSupText' );
  var Text = require( 'SCENERY/nodes/Text' );
  var TriangleNode = require( 'TRIG_TOUR/trig-tour/view/TriangleNode' );
  var Util = require( 'DOT/Util' );
  var TrigTourColors = require( 'TRIG_TOUR/trig-tour/view/TrigTourColors' );
  var Vector2 = require( 'DOT/Vector2' );

  //strings
  var oneStr = '1';
  var minusOneStr = '-1';
  var theta = require( 'string!TRIG_TOUR/theta' );
  var cosStr = require( 'string!TRIG_TOUR/cos' );
  var sinStr = require( 'string!TRIG_TOUR/sin' );
  var tanStr = require( 'string!TRIG_TOUR/tan' );
  var vsStr = require( 'string!TRIG_TOUR/vs' );
  var piStr = require( 'string!TRIG_TOUR/pi' );

  //constants
  var BACKGROUND_COLOR = TrigTourColors.BACKGROUND_COLOR;
  var COS_COLOR = TrigTourColors.COS_COLOR;
  var SIN_COLOR = TrigTourColors.SIN_COLOR;
  var TAN_COLOR = TrigTourColors.TAN_COLOR;
  var LINE_COLOR = TrigTourColors.LINE_COLOR;
  var TEXT_COLOR = TrigTourColors.TEXT_COLOR;
  var TEXT_COLOR_GRAY = TrigTourColors.TEXT_COLOR_GRAY;
  var VIEW_BACKGROUND_COLOR = TrigTourColors.VIEW_BACKGROUND_COLOR;
  var DISPLAY_FONT = new PhetFont( 20 );
  var DISPLAY_FONT_SMALL = new PhetFont( 18 );
  var DISPLAY_FONT_ITALIC = new PhetFont( { size: 20, style: 'italic' } );
  var DISPLAY_FONT_SMALL_ITALIC = new PhetFont( { size: 18, family: 'Arial', style: 'italic' } );

  /**
   * Constructor for view of Graph, which displays sin, cos, or tan vs angle theta in either degrees or radians, and
   * has a draggable handle for changing the angle.
   *
   * @param {TrigTourModel} model of the sim
   * @param {number} height of y-axis on graph
   * @param {number} width of x-axis on graph
   * @param {Property} specialAnglesVisibleProperty
   * @constructor
   */
  function GraphView( model, height, width, specialAnglesVisibleProperty ) {

    var graphView = this;
    this.model = model;
    this.trigFunction = 'cos'; // @public, {string} 'cos'|'sin'|'tan' set by Control Panel
    this.expandedProperty = new Property( true ); // @private, Graph can be hidden with expandCollapse button

    // Call the super constructor
    Node.call( graphView );

    var marginWidth = 25;   // distance in pixels between edge of Node and edge of nearest full wavelength
    var wavelength = ( width - 2 * marginWidth ) / 4;  //wavelength of sinusoidal curve in pixels
    this.amplitude = 0.45 * height;  // @private amplitude of sinusoidal curve in pixels
    var nbrOfWavelengths = 2 * 2;    // number of full wavelengths displayed, must be even to keep graph symmetric

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

    // draw white background Rectangle( x, y, width, height, arcWidth, arcHeight, options )
    var bHeight = 1.2 * height;
    var bWidth = 1.05 * width;
    var arcRadius = 10;
    var background = new Rectangle( -bWidth / 2, -(bHeight / 2) - 5, bWidth, bHeight, arcRadius, arcRadius, {
      fill: VIEW_BACKGROUND_COLOR,
      stroke: TEXT_COLOR_GRAY,
      lineWidth: 2
    } );

    // align expandCollapseButton and titleDisplayButton
    this.expandCollapseButton.left = background.left + 7;
    this.expandCollapseButton.top = background.top + 7;
    this.titleDisplayPanel.left = background.left;
    this.titleDisplayPanel.top = background.top;

    // draw right and left border rectangles, which serve to hide indicator line when it is off the graph
    var borderWidth = 400;
    var borderHeight = 1000;
    var rightBorder = new Rectangle(
      -bWidth / 2 - borderWidth - 1,
      -0.8 * borderHeight, borderWidth,
      borderHeight,
      { fill: BACKGROUND_COLOR }
    );
    var leftBorder = new Rectangle(
      bWidth / 2 + 1,
      -0.8 * borderHeight,
      borderWidth,
      borderHeight,
      { fill: BACKGROUND_COLOR }
    );

    // draw x-, y-axes
    var xAxisLength = width;
    var xAxis = new ArrowNode( -xAxisLength / 2, 0, xAxisLength / 2, 0,
      { tailWidth: 0.3, fill: LINE_COLOR, headHeight: 12, headWidth: 8 } );
    var yAxis = new ArrowNode( 0, 1.2 * this.amplitude, 0, -1.3 * this.amplitude,
      { tailWidth: 0.3, fill: LINE_COLOR, headHeight: 12, headWidth: 8 } );

    // draw tic marks for x-, y-axes
    var ticLength = 5;
    var xTics = new Node();
    var yTics = new Node();
    var xTic;
    var yTic;
    for ( var i = -2 * nbrOfWavelengths; i <= 2 * nbrOfWavelengths; i++ ) {
      xTic = new Line( 0, ticLength, 0, -ticLength, { lineWidth: 2, stroke: LINE_COLOR } );
      xTic.x = i * wavelength / 4;
      xTics.addChild( xTic );
    }
    for ( i = -1; i <= 1; i += 2 ) {
      yTic = new Line( -ticLength, 0, ticLength, 0, { lineWidth: 2, stroke: LINE_COLOR } );
      yTic.y = i * this.amplitude;
      yTics.addChild( yTic );
    }

    this.axesNode = new Node();
    this.axesNode.children = [ xAxis, yAxis ];

    // draw 1/-1 labels on y-axis
    this.onesNode = new Node();
    var fontInfo = { font: DISPLAY_FONT_SMALL, fill: TEXT_COLOR };
    var oneLabel = new Text( oneStr, fontInfo );
    var minusOneLabel = new Text( minusOneStr, fontInfo );
    this.onesNode.children = [ oneLabel, minusOneLabel ];
    var xOffset = 8;
    oneLabel.left = xOffset;
    minusOneLabel.right = -xOffset;
    oneLabel.centerY = -this.amplitude - 5;
    minusOneLabel.centerY = this.amplitude + 5;

    // draw tic mark labels in degrees
    this.tickMarkLabelsInDegrees = new Node();
    var label;
    for ( var j = -nbrOfWavelengths; j <= nbrOfWavelengths; j++ ) {
      var nbrDegrees = Util.toFixed( 180 * j, 0 );
      nbrDegrees = nbrDegrees.toString();
      label = new SubSupText( nbrDegrees + '<sup>o</sup>', { font: DISPLAY_FONT_SMALL } );
      label.centerX = j * wavelength / 2;
      label.top = xAxis.bottom;
      if ( j !== 0 ) {
        this.tickMarkLabelsInDegrees.addChild( label );
      }
    }

    // tic mark labels in radians
    this.tickMarkLabelsInRadians = new Node();
    var labelStr = '';
    var labelStrings = [
      '-4' + piStr,
      '-3' + piStr,
      '-2' + piStr,
      '-' + piStr,
      piStr,
      '2' + piStr,
      '3' + piStr,
      '4' + piStr
    ];
    var xPositions = [ -4, -3, -2, -1, 1, 2, 3, 4 ];
    for ( i = 0; i < xPositions.length; i++ ) {
      labelStr = labelStrings[ i ];
      label = new Text( labelStr, { font: DISPLAY_FONT_SMALL_ITALIC, fill: TEXT_COLOR } );
      label.centerX = xPositions[ i ] * wavelength / 2;
      label.top = xAxis.bottom;
      this.tickMarkLabelsInRadians.addChild( label );
    }

    // visibility set by Labels control in Control Panel and by degs/rads RBs in Readout Panel
    this.onesNode.visible = false;
    this.tickMarkLabelsInDegrees.visible = false;
    this.tickMarkLabelsInRadians.visible = false;

    // Axes labels
    fontInfo = { font: DISPLAY_FONT_ITALIC, fill: TEXT_COLOR };
    var thetaLabel = new Text( theta, fontInfo );
    thetaLabel.left = this.axesNode.right + 5; //= xAxis.right;
    thetaLabel.centerY = xAxis.centerY;
    this.cosThetaLabel = new HTMLText( cosStr + '<i>' + theta + '</i>', { font: DISPLAY_FONT } );
    this.sinThetaLabel = new HTMLText( sinStr + '<i>' + theta + '</i>', { font: DISPLAY_FONT } );
    this.tanThetaLabel = new HTMLText( tanStr + '<i>' + theta + '</i>', { font: DISPLAY_FONT } );
    this.cosThetaLabel.right = this.sinThetaLabel.right = this.tanThetaLabel.right = yAxis.left - 10;
    this.cosThetaLabel.top = this.sinThetaLabel.top = this.tanThetaLabel.top = yAxis.top;

    // Draw sinusoidal curves
    var cosShape = new Shape();
    var sinShape = new Shape();
    var tanShape = new Shape();
    var dx = wavelength / 100;
    var nbrOfPoints = ( nbrOfWavelengths + 0.08 ) * wavelength / dx;
    var xOrigin = 0;
    var yOrigin = 0;
    var xPos = xOrigin - nbrOfPoints * dx / 2;
    sinShape.moveTo( xPos, yOrigin - this.amplitude * Math.sin( 2 * Math.PI * (xPos - xOrigin) / wavelength ) );
    cosShape.moveTo( xPos, yOrigin - this.amplitude * Math.cos( 2 * Math.PI * (xPos - xOrigin) / wavelength ) );
    tanShape.moveTo( xPos, yOrigin - this.amplitude * Math.tan( 2 * Math.PI * (xPos - xOrigin) / wavelength ) );

    // draw sin and cos curves
    for ( i = 0; i < nbrOfPoints; i++ ) {
      xPos += dx;
      sinShape.lineTo( xPos, yOrigin - this.amplitude * Math.sin( 2 * Math.PI * (xPos - xOrigin) / wavelength ) );
      cosShape.lineTo( xPos, yOrigin - this.amplitude * Math.cos( 2 * Math.PI * (xPos - xOrigin) / wavelength ) );
    }

    xPos = xOrigin - nbrOfPoints * dx / 2;  //start at left edge
    var tanValue = Math.tan( 2 * Math.PI * (xPos - xOrigin) / wavelength );

    // draw tangent curve cut off at upper and lower limits, need more resolution due to steep slope
    dx = wavelength / 600;  //x-distance between points on curve
    nbrOfPoints = ( nbrOfWavelengths + 0.08 ) * wavelength / dx;
    var maxTanValue = 1.2;
    var minTanValue = -1.0;
    var yPos;
    for ( i = 0; i < nbrOfPoints; i++ ) {
      tanValue = Math.tan( 2 * Math.PI * (xPos - xOrigin) / wavelength );
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
    var leftEnd = -( nbrOfWavelengths + 0.08 ) * wavelength / 2;
    var rightEnd = ( nbrOfWavelengths + 0.08 ) * wavelength / 2;
    var arrowL = 15;     //arrow head length
    var arrowW = 8;      //arrow head width

    // Place arrow heads on left and right ends of sin curve
    var slopeLeft = ( this.amplitude * 2 * pi / wavelength ) * Math.cos( 2 * pi * leftEnd / wavelength );
    var slopeRight = ( this.amplitude * 2 * pi / wavelength ) * Math.cos( 2 * pi * rightEnd / wavelength );
    var angleLeft = Math.atan( slopeLeft ) * 180 / pi;
    var angleRight = Math.atan( slopeRight ) * 180 / pi;
    var sinArrowLeft = new TriangleNode( arrowL, arrowW, SIN_COLOR, -angleLeft + 180 );
    var sinArrowRight = new TriangleNode( arrowL, arrowW, SIN_COLOR, -angleRight );
    sinArrowLeft.x = leftEnd;
    sinArrowRight.x = rightEnd;
    sinArrowLeft.y = -this.amplitude * Math.sin( 2 * pi * leftEnd / wavelength );
    sinArrowRight.y = -this.amplitude * Math.sin( 2 * pi * rightEnd / wavelength );
    this.sinPath.children = [ sinArrowLeft, sinArrowRight ];

    // Place arrow heads on ends of cos curve
    slopeLeft = ( this.amplitude * 2 * pi / wavelength ) * Math.sin( 2 * pi * leftEnd / wavelength );
    slopeRight = ( this.amplitude * 2 * pi / wavelength ) * Math.sin( 2 * pi * rightEnd / wavelength );
    angleLeft = Math.atan( slopeLeft ) * 180 / pi;
    angleRight = Math.atan( slopeRight ) * 180 / pi;
    var cosArrowLeft = new TriangleNode( arrowL, arrowW, COS_COLOR, angleLeft + 180 );
    var cosArrowRight = new TriangleNode( arrowL, arrowW, COS_COLOR, angleRight );
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
    for ( i = -nbrOfWavelengths; i <= nbrOfWavelengths; i++ ) {
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
      rotationAngle = -Math.atan( tanSlope ) * 180 / pi;
      if ( i % 2 !== 0 ) {
        rotationAngle += 180;
      }

      triangleNode = new TriangleNode( arrowL, arrowW, TAN_COLOR, rotationAngle );
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

    // indicatorLine is a vertical arrow on the trig curve showing current value of angle and trigFunction(angle)
    // a red dot on top of the indicator line echoes red dot on unit circle
    hitBound = 30;
    this.indicatorLine = new ArrowLine( this.amplitude, 'vertical', {
      tailWidth: 5,
      headWidth: 12,
      headHeight: 20,
      cursor: 'pointer'
    } );
    this.indicatorLine.touchArea = new Bounds2( -hitBound, -300, hitBound, +100 );
    this.indicatorLine.mouseArea = new Bounds2( -hitBound, -300, hitBound, +100 );
    this.redDotHandle = new Circle( 7, { stroke: LINE_COLOR, fill: "red", cursor: 'pointer' } );
    this.indicatorLine.addChild( this.redDotHandle );

    // All graphic elements, curves, axes, labels, etc are placed on display node,
    // with visibility set by expandCollapseButton
    var displayNode = new Node();

    // Order children views
    displayNode.children = [
      this.axesNode,
      thetaLabel,
      this.cosThetaLabel,
      this.sinThetaLabel,
      this.tanThetaLabel,
      this.sinPath,
      this.cosPath,
      this.tanPath,
      this.onesNode,
      this.tickMarkLabelsInDegrees,
      this.tickMarkLabelsInRadians,
      xTics,
      yTics,
      this.indicatorLine,
      rightBorder,
      leftBorder
    ];

    graphView.children = [
      background,
      this.titleDisplayPanel,
      this.expandCollapseButton,
      displayNode
    ];

    this.expandCollapseButton.expandedProperty.link( function( tOrF ) {
      background.visible = tOrF;
      displayNode.visible = tOrF;
      graphView.titleDisplayPanel.visible = !tOrF;
    } );

    this.indicatorLine.addInputListener( new SimpleDragHandler(
      {
        allowTouchSnag: true,

        drag: function( e ) {
          var position = graphView.indicatorLine.globalToParentPoint( e.pointer.point );   //returns Vector2
          var fullAngle = ( 2 * Math.PI * position.x / wavelength );   // in radians

          if ( !specialAnglesVisibleProperty.value ) {
            model.setFullAngleInRadians( fullAngle );
          }
          else {
            model.setSpecialAngleWithFullAngle( fullAngle );
          }
        }
      } ) );

    // Register for synchronization with model.
    model.fullAngleProperty.link( function( fullAngle ) {
      var xPos = fullAngle / (2 * Math.PI) * wavelength;
      graphView.indicatorLine.x = xPos;
      var tanSize = Math.abs( model.tan() );
      if ( graphView.trigFunction === 'tan' && tanSize > 1.5 ) {
        graphView.indicatorLine.setTailWidth( Math.max( 2, 5 - 0.1 * tanSize ) );
      }
      else {
        graphView.indicatorLine.setTailWidth( 5 );
      }
      graphView.singularityIndicator.x = xPos;
      graphView.setIndicatorLine();
    } );

    model.singularityProperty.link( function( singularity ) {
      if ( graphView.trigFunction === 'tan' ) {
        graphView.singularityIndicator.visible = singularity;
        //indicatorLine must always be draggable, so it must have .visible = true,
        //and so, adjust visibility by setting opacity
        if ( singularity ) {
          graphView.indicatorLine.opacity = 0;
        }
        else {
          graphView.indicatorLine.opacity = 1;
        }
      }
    } );
  }

  return inherit( Node, GraphView, {

    /**
     * Set the indicator line, which is a draggable, vertical arrow indicating current location on graph.
     */
    setIndicatorLine: function() {
      var cosNow = this.model.cos();
      var sinNow = this.model.sin();
      var tanNow = this.model.tan();
      if ( this.trigFunction === 'cos' ) {
        this.indicatorLine.setEndPoint( cosNow * this.amplitude );
        this.indicatorLine.setColor( COS_COLOR );
        this.redDotHandle.y = -cosNow * this.amplitude;
      }
      else if ( this.trigFunction === 'sin' ) {
        this.indicatorLine.setEndPoint( sinNow * this.amplitude );
        this.indicatorLine.setColor( SIN_COLOR );
        this.redDotHandle.y = -sinNow * this.amplitude;
      }
      else if ( this.trigFunction === 'tan' ) {
        this.indicatorLine.setEndPoint( tanNow * this.amplitude );
        this.indicatorLine.setColor( TAN_COLOR );
        this.redDotHandle.y = -tanNow * this.amplitude;
      }
      else {
        //Do nothing, following line for debugging only
        console.error( 'ERROR in GraphView.setIndicatorLine()' );
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