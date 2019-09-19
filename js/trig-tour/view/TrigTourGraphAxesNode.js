// Copyright 2015-2018, University of Colorado Boulder

/**
 * Axes and labels for the GraphView in trig-tour.  The axes and labels are broken into two nodes which are publicly
 * accessible so that the graph can be correctly layered in GraphView.  In order for the graph to be layered correctly,
 * the axes must be rendered first with the trig plots second, followed by the labels.
 *
 * @author Michael Dubson (PhET developer) on 6/3/2015.
 * @author Jesse Greenberg
 */
define( require => {
  'use strict';

  // modules
  const ArrowNode = require( 'SCENERY_PHET/ArrowNode' );
  const inherit = require( 'PHET_CORE/inherit' );
  const Line = require( 'SCENERY/nodes/Line' );
  const MathSymbols = require( 'SCENERY_PHET/MathSymbols' );
  const Node = require( 'SCENERY/nodes/Node' );
  const PhetFont = require( 'SCENERY_PHET/PhetFont' );
  const StringUtils = require( 'PHETCOMMON/util/StringUtils' );
  const Text = require( 'SCENERY/nodes/Text' );
  const TrigFunctionLabelText = require( 'TRIG_TOUR/trig-tour/view/TrigFunctionLabelText' );
  const trigTour = require( 'TRIG_TOUR/trigTour' );
  const TrigTourColors = require( 'TRIG_TOUR/trig-tour/view/TrigTourColors' );
  const TrigTourMathStrings = require( 'TRIG_TOUR/trig-tour/TrigTourMathStrings' );
  const Util = require( 'DOT/Util' );

  // constants
  var LINE_COLOR = TrigTourColors.LINE_COLOR;
  var DISPLAY_FONT_SMALL = new PhetFont( 18 );
  var TEXT_COLOR = TrigTourColors.TEXT_COLOR;
  var DISPLAY_FONT_ITALIC = new PhetFont( { size: 20, style: 'italic' } );
  var DISPLAY_FONT_SMALL_ITALIC = new PhetFont( { size: 18, family: 'Arial', style: 'italic' } );

  // strings
  const cosString = require( 'string!TRIG_TOUR/cos' );
  const numberPiPatternString = require( 'string!TRIG_TOUR/numberPiPattern' );
  const sinString = require( 'string!TRIG_TOUR/sin' );
  const tanString = require( 'string!TRIG_TOUR/tan' );

  /**
   * Constructor.
   *
   * @param {number} width
   * @param {number} wavelength
   * @param {number} numberOfWavelengths
   * @param {number} amplitude
   * @param {ViewProperties} viewProperties
   * @constructor
   */
  function TrigTourGraphAxesNode( width, wavelength, numberOfWavelengths, amplitude, viewProperties ) {

    Node.call( this );

    // Break into layers because we need to to layer things on the graph view in order: Axis, plots, labels
    this.axisNode = new Node(); // @public (read-only)
    this.labelsNode = new Node(); // @public (read-only)

    // draw x-axis and y-axis, represented by ArrowNodes
    var xAxisLength = width;
    var xAxis = new ArrowNode( -xAxisLength / 2, 0, xAxisLength / 2, 0, {
      tailWidth: 0.3,
      fill: LINE_COLOR,
      headHeight: 12,
      headWidth: 8
    } );
    var yAxis = new ArrowNode( 0, 1.18 * amplitude, 0, -1.3 * amplitude, {
      tailWidth: 0.3,
      fill: LINE_COLOR,
      headHeight: 12,
      headWidth: 8
    } );

    // draw tic marks for x and y axes
    var ticLength = 5;
    var xTics = new Node();
    var yTics = new Node();
    var xTic;
    var yTic;
    for ( var i = -2 * numberOfWavelengths; i <= 2 * numberOfWavelengths; i++ ) {
      xTic = new Line( 0, ticLength, 0, -ticLength, { lineWidth: 2, stroke: LINE_COLOR } );
      xTic.x = i * wavelength / 4;
      xTics.addChild( xTic );
    }
    for ( i = -1; i <= 1; i += 2 ) {
      yTic = new Line( -ticLength, 0, ticLength, 0, { lineWidth: 2, stroke: LINE_COLOR } );
      yTic.y = i * amplitude;
      yTics.addChild( yTic );
    }

    this.children = [ xAxis, yAxis ];

    // draw 1/-1 labels on y-axis
    var onesNode = new Node(); // @public (read-only)
    var fontInfo = { font: DISPLAY_FONT_SMALL, fill: TEXT_COLOR };
    var oneLabel = new Text( TrigTourMathStrings.ONE_STRING, fontInfo );
    var minusOneLabel = new Text( TrigTourMathStrings.MINUS_ONE_STRING, fontInfo );
    onesNode.children = [ oneLabel, minusOneLabel ];
    var xOffset = 8;
    oneLabel.left = xOffset;
    minusOneLabel.right = -xOffset;
    oneLabel.centerY = -amplitude - 5;
    minusOneLabel.centerY = amplitude + 5;

    // draw tic mark labels in degrees
    var tickMarkLabelsInDegrees = new Node();
    var label;
    for ( var j = -numberOfWavelengths; j <= numberOfWavelengths; j++ ) {
      var degrees = Util.toFixed( 180 * j, 0 );
      degrees = degrees.toString();
      label = new Text( degrees + '\u00B0', { font: DISPLAY_FONT_SMALL } );
      label.centerX = j * wavelength / 2;
      label.top = xAxis.bottom;
      if ( j !== 0 ) {
        tickMarkLabelsInDegrees.addChild( label );
      }
    }

    // tic mark labels in radians
    var tickMarkLabelsInRadians = new Node();
    var labelString = '';
    var pi = MathSymbols.PI; 
    var labelStrings = [
      StringUtils.format( numberPiPatternString, '-4', pi ),
      StringUtils.format( numberPiPatternString, '-3', pi ),
      StringUtils.format( numberPiPatternString, '-2', pi ),
      StringUtils.format( numberPiPatternString, '-', pi ),
      pi,
      StringUtils.format( numberPiPatternString, '2', pi ),
      StringUtils.format( numberPiPatternString, '3', pi ),
      StringUtils.format( numberPiPatternString, '4', pi )
    ];
    var xPositions = [ -4, -3, -2, -1, 1, 2, 3, 4 ];
    for ( i = 0; i < xPositions.length; i++ ) {
      labelString = labelStrings[ i ];
      label = new Text( labelString, { font: DISPLAY_FONT_SMALL_ITALIC, fill: TEXT_COLOR } );
      label.centerX = xPositions[ i ] * wavelength / 2;
      label.top = xAxis.bottom;
      tickMarkLabelsInRadians.addChild( label );
    }

    // visibility set by Labels control in Control Panel and by degs/rads RBs in Readout Panel
    onesNode.visible = false;
    tickMarkLabelsInDegrees.visible = false;
    tickMarkLabelsInRadians.visible = false;

    // Axes labels
    var maxThetaWidth = ticLength * 3; // restrict for i18n
    fontInfo = { font: DISPLAY_FONT_ITALIC, fill: TEXT_COLOR, maxWidth: maxThetaWidth };
    var thetaLabel = new Text( MathSymbols.THETA, fontInfo );
    thetaLabel.left = this.right + 5;
    thetaLabel.centerY = xAxis.centerY;
    var maxTrigLabelWidth = xAxis.width / 4;
    var cosThetaLabel = new TrigFunctionLabelText( cosString, { maxWidth: maxTrigLabelWidth } );
    var sinThetaLabel = new TrigFunctionLabelText( sinString, { maxWidth: maxTrigLabelWidth } );
    var tanThetaLabel = new TrigFunctionLabelText( tanString, { maxWidth: maxTrigLabelWidth } );
    cosThetaLabel.right = sinThetaLabel.right = tanThetaLabel.right = yAxis.left - 10;
    cosThetaLabel.top = sinThetaLabel.top = tanThetaLabel.top = yAxis.top;

    this.axisNode.children = [ xAxis, yAxis, thetaLabel, cosThetaLabel, sinThetaLabel, tanThetaLabel ];
    this.labelsNode.children = [ onesNode, tickMarkLabelsInDegrees, tickMarkLabelsInRadians, xTics, yTics ];

    // sync visibility with view properties
    viewProperties.graphProperty.link( function( graph ) {
      sinThetaLabel.visible = ( graph === 'sin' );
      cosThetaLabel.visible = ( graph === 'cos' );
      tanThetaLabel.visible = ( graph === 'tan' );
    } );

    viewProperties.labelsVisibleProperty.link( function( isVisible ) {
      onesNode.visible = isVisible;
      if ( isVisible ) {
        tickMarkLabelsInRadians.visible = viewProperties.angleUnitsProperty.value === 'radians';
        tickMarkLabelsInDegrees.visible = viewProperties.angleUnitsProperty.value === 'degrees';
      }
      else {
        tickMarkLabelsInRadians.visible = false;
        tickMarkLabelsInDegrees.visible = false;
      }
    } );

    viewProperties.angleUnitsProperty.link( function( angleUnits ) {
      if ( viewProperties.labelsVisibleProperty.value ) {
        tickMarkLabelsInRadians.visible = ( angleUnits === 'radians');
        tickMarkLabelsInDegrees.visible = ( angleUnits !== 'radians');
      }
    } );

  }

  trigTour.register( 'TrigTourGraphAxesNode', TrigTourGraphAxesNode );
  return inherit( Node, TrigTourGraphAxesNode );

} );