// Copyright 2015, University of Colorado Boulder

/**
 * Creates the third row for the ReadoutNode of Trig Tour.  This row contains a label for the trig function, 
 * a fraction representation of the value, and the numeric value.  This row is organized, separated by the equality 
 * sign.  It looks like this:
 *
 * trig function label = trig fraction = trig value
 *
 * @author Michael Dubson (PhET developer) on 6/10/2015
 * @author Jesse Greenberg
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var Node = require( 'SCENERY/nodes/Node' );
  var TrigFunctionLabelText = require( 'TRIG_TOUR/trig-tour/view/TrigFunctionLabelText' );
  var Text = require( 'SCENERY/nodes/Text' );
  var Util = require( 'DOT/Util' );
  var FractionNode = require( 'TRIG_TOUR/trig-tour/view/readout/FractionNode' );
  var TrigTourMathStrings = require( 'TRIG_TOUR/trig-tour/TrigTourMathStrings' );
  var TrigTourColors = require( 'TRIG_TOUR/trig-tour/view/TrigTourColors' );
  var PhetFont = require( 'SCENERY_PHET/PhetFont' );
  var SpecialAngles = require( 'TRIG_TOUR/trig-tour/SpecialAngles' );
  var trigTour = require( 'TRIG_TOUR/trigTour' );

  // strings
  var cosString = require( 'string!TRIG_TOUR/cos' );
  var infinitySymbolString = require( 'string!TRIG_TOUR/infinitySymbol' );
  var plusMinusString = require( 'string!TRIG_TOUR/plusMinus' );
  var sinString = require( 'string!TRIG_TOUR/sin' );
  var tanString = require( 'string!TRIG_TOUR/tan' );
  var xString = require( 'string!TRIG_TOUR/x' );
  var yString = require( 'string!TRIG_TOUR/y' );

  // non translatable string
  var equalString = TrigTourMathStrings.EQUALS_STRING;

  //constants
  var DISPLAY_FONT = new PhetFont( 20 );
  var DISPLAY_FONT_LARGE = new PhetFont( 30 );
  var DISPLAY_FONT_LARGE_BOLD = new PhetFont( { size: 20, weight: 'bold' } );
  var DISPLAY_FONT_LARGE_BOLD_ITALIC = new PhetFont( { size: 20, weight: 'bold', style: 'italic' } );
  var TEXT_COLOR = TrigTourColors.TEXT_COLOR;

  /**
   * Constructor.
   *
   * @param {string} trigLabelString - string representing the trig function for this row
   * @param {number} trigModelValue - the value of the trig function for the model
   * @constructor
   */
  function LabelFractionValueRow( trigLabelString, trigTourModel, viewProperties, options  ) {

    Node.call( this, options );
    var thisNode = this;

    // prevent block fitting of this row as a performance optimization
    this.preventFit = true;

    this.trigTourModel = trigTourModel; // @private
    this.viewProperties = viewProperties; // @private
    this.trigLabelString = trigLabelString; // @private

    var fontOptions = { font: DISPLAY_FONT, fill: TEXT_COLOR };

    // initialize strings and variables for the row, depending on trigLabelString
    var trigString;
    var numeratorString;
    var denominatorString;
    this.trigModelFunction; // @private - trig function for this value
    this.specialAngles; // @private - collection of special angles for this trig function

    // get the values needed to represent the special angle as a fraction, dependent on trig function type
    switch( trigLabelString ) {
      case 'sin': {
        trigString = sinString;
        numeratorString = yString;
        denominatorString = '1';
        this.specialAngles = SpecialAngles.SPECIAL_SIN_FRACTIONS;
        break;
      }
      case 'cos': {
        trigString = cosString;
        numeratorString = xString;
        denominatorString = '1';
        this.specialAngles = SpecialAngles.SPECIAL_COS_FRACTIONS;
        break;
      }
      case 'tan': {
        trigString = tanString;
        numeratorString = yString;
        denominatorString = xString;
        this.specialAngles = SpecialAngles.SPECIAL_TAN_FRACTIONS;
        break;
      }
    }
    assert && assert( trigString && numeratorString && denominatorString, 'trigLabel must be one of "cos", "sin", or "tan"' );

    // label section of the row, something like 'Cos θ ='
    var trigLabelText = new TrigFunctionLabelText( trigString, { 
      trigFunctionLabelFont: DISPLAY_FONT_LARGE_BOLD,
      thetaLabelFont: DISPLAY_FONT_LARGE_BOLD_ITALIC
    } );
    var leftEqualText = new Text( equalString, DISPLAY_FONT_LARGE_BOLD );

    // label fraction for the row defining the shown value, something like 'x/1'
    var trigFraction = new FractionNode( numeratorString, denominatorString, { size: 20, fontWeight: 'bold' } );

    // value presented by this row as a number, updates with the model and depends on the angle
    var trigValueNumberText = new Text( 'trigModelValue', fontOptions );

    // value presented by this row as a fraction, updates with the model and depends on the angle
    var trigValueFraction = new FractionNode( '', '', fontOptions );

    // create an text representation of the equal sign
    var rightEqualText = new Text( equalString, DISPLAY_FONT_LARGE_BOLD );

    this.children = [ trigLabelText, leftEqualText, trigFraction, rightEqualText, trigValueNumberText, trigValueFraction ];

    // layout
    var space = 4;
    leftEqualText.left = trigLabelText.right + space; 
    trigFraction.left = leftEqualText.right + space;
    rightEqualText.left = trigFraction.right + space;
    trigValueNumberText.left = rightEqualText.right + space;
    trigValueFraction.left = rightEqualText.right + space;

    // if this row is for 'tan', create and add an infinity symbol to represent the singularity
    if( trigLabelString === 'tan' ) {
      var plusMinusInfinityNode = new Node();
      var plusMinusText = new Text( plusMinusString, { font: DISPLAY_FONT, fill: TEXT_COLOR } );
      var infinityText = new Text( infinitySymbolString, { font: DISPLAY_FONT_LARGE, fill: TEXT_COLOR } );
      plusMinusInfinityNode.children = [ plusMinusText, infinityText ];
      plusMinusText.left = 0;
      infinityText.left = plusMinusText.right;
      infinityText.centerY = -5;
      plusMinusInfinityNode.left = rightEqualText.right;
      this.addChild( plusMinusInfinityNode );
    }

    // synchronize row values with model
    trigTourModel.fullAngleProperty.link( function( fullAngle ) {
      thisNode.setTrigReadout( trigValueNumberText, trigValueFraction );
    } );

    // if this row has a node for infinity, link its visibility to the singularity
    if( plusMinusInfinityNode ) {
      trigTourModel.singularityProperty.link( function( singularity ) {
        plusMinusInfinityNode.visible = singularity;
        if ( !viewProperties.specialAnglesVisible ) {
          trigValueNumberText.visible = !singularity;
        }
      } );
    }

    // synchronize component visibility with view properties
    viewProperties.specialAnglesVisibleProperty.link( function( specialAnglesVisible ) {
      trigValueFraction.visible = specialAnglesVisible;
      trigValueNumberText.visible = !specialAnglesVisible;
      thisNode.setTrigReadout( trigValueNumberText, trigValueFraction );
    } );
  }

  trigTour.register( 'LabelFractionValueRow', LabelFractionValueRow );

  return inherit( Node, LabelFractionValueRow, {

    /**
     * Set the value of the trig value.
     * 
     * @param {Text} trigValueNumberText
     * @param {FractionNode} trigValueFraction 
     */
    setTrigReadout: function( trigValueNumberText, trigValueFraction ){
      if( this.viewProperties.specialAnglesVisibleProperty.value ) {
        this.setSpecialAngleTrigReadout( trigValueFraction );
      }
      var trigValue;
      if( this.trigLabelString === 'sin' ) {
        trigValue = this.trigTourModel.sin();
      }
      else if( this.trigLabelString === 'cos' ) {
        trigValue = this.trigTourModel.cos();
      }
      else if( this.trigLabelString === 'tan' ) {
        trigValue = this.trigTourModel.tan();
      }
      assert && assert( typeof trigValue !== 'undefined', 'trigLabelString must be one of cos, tan, or sin' );

      var trigValueString = Util.toFixed( trigValue, 3 );
      trigValueNumberText.text = trigValueString;
    },

    /**
     * Set the special angle readout display.
     *
     * @param {FractionNode} trigValueFraction
     * @private
     */
    setSpecialAngleTrigReadout: function( trigValueFraction ) {
      var smallAngleInDegrees = Util.roundSymmetric( this.trigTourModel.getSmallAngle0To360() );

      // get the values needed to represent the special angle as a fraction.
      var specialFraction = this.specialAngles[ smallAngleInDegrees ];

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