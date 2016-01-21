
// Copyright 2015, University of Colorado Boulder

/**
 * Creates the first row for the ReadoutNode of Trig Tour.
 *
 * @author Michael Dubson (PhET developer) on 6/10/2015
 * @author Jesse Greenberg
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var Node = require( 'SCENERY/nodes/Node' );
  var Text = require( 'SCENERY/nodes/Text' );
  var StringUtils = require( 'PHETCOMMON/util/StringUtils' );
  var Util = require( 'DOT/Util' );
  var FractionNode = require( 'TRIG_TOUR/trig-tour/view/readout/FractionNode' );
  var TrigTourMathStrings = require( 'TRIG_TOUR/trig-tour/TrigTourMathStrings' );
  var TrigTourColors = require( 'TRIG_TOUR/trig-tour/view/TrigTourColors' );
  var PhetFont = require( 'SCENERY_PHET/PhetFont' );
  var SpecialAngles = require( 'TRIG_TOUR/trig-tour/SpecialAngles' );
  var HBox = require( 'SCENERY/nodes/HBox' );
  var trigTour = require( 'TRIG_TOUR/trigTour' );

  // strings
  var xString = require( 'string!TRIG_TOUR/x' );
  var yString = require( 'string!TRIG_TOUR/y' );

  // non translatable string
  var equalString = TrigTourMathStrings.EQUALS_STRING;

  //constants
  var DISPLAY_FONT = new PhetFont( 20 );
  var DISPLAY_FONT_LARGE = new PhetFont( 30 );
  var TEXT_COLOR = TrigTourColors.TEXT_COLOR;

  var SPECIAL_COS_FRACTIONS = SpecialAngles.SPECIAL_COS_FRACTIONS;
  var SPECIAL_SIN_FRACTIONS = SpecialAngles.SPECIAL_SIN_FRACTIONS;

  /**
   * Constructor.
   *
   * @param {string} trigLabelString - string representing the trig function for this row
   * @param {number} trigModelValue - the value of the trig function for the model
   * @constructor
   */
  function CoordinatesRow( trigTourModel, viewProperties, options  ) {

    Node.call( this, options );
    var thisNode = this;

    this.trigTourModel = trigTourModel; // @private
    this.viewProperties = viewProperties; // @private

    // initialize fonts for this row
    var fontInfo = { font: DISPLAY_FONT, fill: TEXT_COLOR };
    var largeFontInfo = { font: DISPLAY_FONT_LARGE, fill: TEXT_COLOR };
    var fontBoldInfo = { font: DISPLAY_FONT, fill: TEXT_COLOR, fontWeight: 'bold' };

    // string pattern for the axis readout
    var XYEqualsPattern = '(' + '{0}' + ',' + '{1}' + ')' + equalString;
    var XYEqualString = StringUtils.format( XYEqualsPattern, xString, yString );
    var coordinatesLabel = new Text( XYEqualString, fontBoldInfo );

    // fraction values set below
    this.sinReadoutFraction = new FractionNode( '', '', fontInfo );
    this.cosReadoutFraction = new FractionNode( '', '', fontInfo );
    this.coordinatesReadout = new Text( '', fontInfo ); // text provided by model.fullAngleProperty.link, below

    // create the text for the parentheses.  Comma uses different font options, so a pattern cannot be used.
    var leftParensText = new Text( '( ', largeFontInfo );
    var commaText = new Text( ' ,  ', fontInfo );
    var rightParensText = new Text( ' )', largeFontInfo );

    // Assemble pieces into '( cos fraction value, sin fraction value )'
    this.coordinatesHBox = new HBox( {
      children: [
        leftParensText,
        this.cosReadoutFraction,
        commaText,
        this.sinReadoutFraction,
        rightParensText
      ],
      align: 'center',
      spacing: 0
      // resize: false
    } );

    // coordinatesHBox is visible in Special Angles mode, coordinatesReadout visible otherwise
    this.children = [ coordinatesLabel, this.coordinatesReadout, this.coordinatesHBox ];
    this.coordinatesReadout.left = coordinatesLabel.right;
    this.coordinatesHBox.left = coordinatesLabel.right;
    this.coordinatesHBox.centerY = coordinatesLabel.centerY;

    // Register for synchronization with model.
    trigTourModel.fullAngleProperty.link( function( fullAngle ) {
      var sinText = Util.toFixed( trigTourModel.sin(), 3 );
      var cosText = Util.toFixed( trigTourModel.cos(), 3 );
      thisNode.coordinatesReadout.text = '(' + cosText + ', ' + sinText + ')';
      thisNode.setSpecialAngleTrigReadout( thisNode.sinReadoutFraction, SPECIAL_SIN_FRACTIONS );
      thisNode.setSpecialAngleTrigReadout( thisNode.cosReadoutFraction, SPECIAL_COS_FRACTIONS );
    } );

    viewProperties.specialAnglesVisibleProperty.link( function( specialAnglesVisible ) {
      thisNode.coordinatesHBox.visible = specialAnglesVisible;
      thisNode.coordinatesReadout.visible = !specialAnglesVisible;
    } );

  }

  trigTour.register( 'CoordinatesRow', CoordinatesRow );

  return inherit( Node, CoordinatesRow, {

    /**
     * Set the special angle readout display.
     * 
     * @private
     */
    setSpecialAngleTrigReadout: function( trigValueFraction, specialFractions ) {
      var smallAngleInDegrees = Util.roundSymmetric( this.trigTourModel.getSmallAngle0To360() );

      var specialFraction = specialFractions[ smallAngleInDegrees ];

      var setFractionValues = function( readoutFraction, specialFraction ) {
        // sanity check to make sure that the special fraction is defined in the special fractions objects above
        if ( specialFraction ) {
          readoutFraction.setValues(
            specialFraction.numerator,
            specialFraction.denominator,
            specialFraction.radical,
            specialFraction.negative
          );
        }
      };
      setFractionValues( trigValueFraction, specialFraction );
    }
  } );
} );