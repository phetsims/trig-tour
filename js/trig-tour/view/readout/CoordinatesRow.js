// Copyright 2016-2017, University of Colorado Boulder

/**
 * Creates the first row for the ReadoutNode of Trig Tour.
 *
 * @author Michael Dubson (PhET developer) on 6/10/2015
 * @author Jesse Greenberg
 */
define( function( require ) {
  'use strict';

  // modules
  var FractionNode = require( 'TRIG_TOUR/trig-tour/view/readout/FractionNode' );
  var HBox = require( 'SCENERY/nodes/HBox' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Node = require( 'SCENERY/nodes/Node' );
  var PhetFont = require( 'SCENERY_PHET/PhetFont' );
  var SpecialAngles = require( 'TRIG_TOUR/trig-tour/SpecialAngles' );
  var StringUtils = require( 'PHETCOMMON/util/StringUtils' );
  var Text = require( 'SCENERY/nodes/Text' );
  var trigTour = require( 'TRIG_TOUR/trigTour' );
  var TrigTourColors = require( 'TRIG_TOUR/trig-tour/view/TrigTourColors' );
  var TrigTourMathStrings = require( 'TRIG_TOUR/trig-tour/TrigTourMathStrings' );
  var Util = require( 'DOT/Util' );

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
   * @param {TrigTourModel} trigTourModel
   * @param {ViewProperties} viewProperties
   * @param {Object} [options]
   * @constructor
   */
  function CoordinatesRow( trigTourModel, viewProperties, options ) {

    Node.call( this, options );
    var self = this;

    this.trigTourModel = trigTourModel; // @private
    this.viewProperties = viewProperties; // @private

    // initialize fonts for this row
    var fontInfo = { font: DISPLAY_FONT, fill: TEXT_COLOR };
    var largeFontInfo = { font: DISPLAY_FONT_LARGE, fill: TEXT_COLOR };
    var fontBoldInfo = { font: DISPLAY_FONT, fill: TEXT_COLOR, fontWeight: 'bold' };

    //TODO #92 replace StringUtils.format with string concatenation or ES6 template string.
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
    } );

    // coordinatesHBox is visible in Special Angles mode, coordinatesReadout visible otherwise
    this.children = [ coordinatesLabel, this.coordinatesReadout, this.coordinatesHBox ];

    // set the row layout.  Needs to be called every update so that pieces of the row do not wander.
    var setRowLayout = function() {
      var spacing = 4;
      self.coordinatesReadout.left = coordinatesLabel.right + spacing;
      self.coordinatesHBox.left = coordinatesLabel.right + spacing;
      self.coordinatesHBox.centerY = coordinatesLabel.centerY;
    };

    // Register for synchronization with model.
    trigTourModel.fullAngleProperty.link( function( fullAngle ) {
      var sinText = Util.toFixed( trigTourModel.sin(), 3 );
      var cosText = Util.toFixed( trigTourModel.cos(), 3 );
      self.coordinatesReadout.text = '(' + cosText + ', ' + sinText + ')';
      self.setSpecialAngleTrigReadout( self.sinReadoutFraction, SPECIAL_SIN_FRACTIONS );
      self.setSpecialAngleTrigReadout( self.cosReadoutFraction, SPECIAL_COS_FRACTIONS );

      // update the layout accordingly
      setRowLayout();
    } );

    viewProperties.specialAnglesVisibleProperty.link( function( specialAnglesVisible ) {
      self.coordinatesHBox.visible = specialAnglesVisible;
      self.coordinatesReadout.visible = !specialAnglesVisible;
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