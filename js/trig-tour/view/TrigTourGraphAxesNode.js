// Copyright 2002-2015, University of Colorado Boulder

/**
 * Axes and labels for the GraphView in trig-tour.  The axes and labels are broken into two nodes which are publicly
 * accessible so that the graph can be correctly layered in GraphView.  In order for the graph to be layered correctly,
 * the axes must be rendered first with the trig plots second, followed by the labels.
 *
 * @author Michael Dubson (PhET developer) on 6/3/2015.
 * @author Jesse Greenberg
 */
define( function( require ) {
  'use strict';

  // modules
  var ArrowNode = require( 'SCENERY_PHET/ArrowNode' );
  var HTMLText = require( 'SCENERY/nodes/HTMLText' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Line = require( 'SCENERY/nodes/Line' );
  var Node = require( 'SCENERY/nodes/Node' );
  var PhetFont = require( 'SCENERY_PHET/PhetFont' );
  var SubSupText = require( 'SCENERY_PHET/SubSupText' );
  var Text = require( 'SCENERY/nodes/Text' );
  var Util = require( 'DOT/Util' );
  var TrigTourColors = require( 'TRIG_TOUR/trig-tour/view/TrigTourColors' );
  var TrigTourMathStrings = require( 'TRIG_TOUR/trig-tour/TrigTourMathStrings' );
  var StringUtils = require( 'PHETCOMMON/util/StringUtils' );

  // constants
  var LINE_COLOR = TrigTourColors.LINE_COLOR;
  var DISPLAY_FONT = new PhetFont( 20 );
  var DISPLAY_FONT_SMALL = new PhetFont( 18 );
  var TEXT_COLOR = TrigTourColors.TEXT_COLOR;
  var DISPLAY_FONT_ITALIC = new PhetFont( { size: 20, style: 'italic' } );
  var DISPLAY_FONT_SMALL_ITALIC = new PhetFont( { size: 18, family: 'Arial', style: 'italic' } );

  // strings
  var piString = require( 'string!TRIG_TOUR/pi' );
  var thetaString = require( 'string!TRIG_TOUR/theta' );
  var cosString = require( 'string!TRIG_TOUR/cos' );
  var sinString = require( 'string!TRIG_TOUR/sin' );
  var tanString = require( 'string!TRIG_TOUR/tan' );
  var trigThetaPatternString = require( 'string!TRIG_TOUR/trigThetaPattern' );

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
    var yAxis = new ArrowNode( 0, 1.2 * amplitude, 0, -1.3 * amplitude, {
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
      label = new SubSupText( degrees + '<sup>o</sup>', { font: DISPLAY_FONT_SMALL } );
      label.centerX = j * wavelength / 2;
      label.top = xAxis.bottom;
      if ( j !== 0 ) {
        tickMarkLabelsInDegrees.addChild( label );
      }
    }

    // tic mark labels in radians
    var tickMarkLabelsInRadians = new Node();
    var labelString = '';
    var labelStrings = [
      '-4' + piString,
      '-3' + piString,
      '-2' + piString,
      '-' + piString,
      piString,
      '2' + piString,
      '3' + piString,
      '4' + piString
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
    var thetaLabel = new Text( thetaString, fontInfo );
    thetaLabel.left = this.right + 5;
    thetaLabel.centerY = xAxis.centerY;
    var maxTrigLabelWidth = xAxis.width / 4;
    var trigLabelOptions = { font: DISPLAY_FONT, maxWidth: maxTrigLabelWidth };
    var cosThetaLabel = new HTMLText( StringUtils.format( trigThetaPatternString, cosString, thetaString ), trigLabelOptions );
    var sinThetaLabel = new HTMLText( StringUtils.format( trigThetaPatternString, sinString, thetaString ), trigLabelOptions );
    var tanThetaLabel = new HTMLText( StringUtils.format( trigThetaPatternString, tanString, thetaString ), trigLabelOptions );
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
        tickMarkLabelsInRadians.visible = viewProperties.angleUnits === 'radians';
        tickMarkLabelsInDegrees.visible = viewProperties.angleUnits === 'degrees';
      }
      else {
        tickMarkLabelsInRadians.visible = false;
        tickMarkLabelsInDegrees.visible = false;
      }
    } );

    viewProperties.angleUnitsProperty.link( function( angleUnits ) {
      if ( viewProperties.labelsVisible ) {
        tickMarkLabelsInRadians.visible = ( angleUnits === 'radians');
        tickMarkLabelsInDegrees.visible = ( angleUnits !== 'radians');
      }
    } );

  }

  return inherit( Node, TrigTourGraphAxesNode );

} );