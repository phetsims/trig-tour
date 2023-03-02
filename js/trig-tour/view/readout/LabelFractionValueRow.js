// Copyright 2016-2023, University of Colorado Boulder

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

import Utils from '../../../../../dot/js/Utils.js';
import MathSymbols from '../../../../../scenery-phet/js/MathSymbols.js';
import PhetFont from '../../../../../scenery-phet/js/PhetFont.js';
import { Node, Text } from '../../../../../scenery/js/imports.js';
import trigTour from '../../../trigTour.js';
import TrigTourStrings from '../../../TrigTourStrings.js';
import SpecialAngles from '../../SpecialAngles.js';
import TrigTourMathStrings from '../../TrigTourMathStrings.js';
import TrigFunctionLabelText from '../TrigFunctionLabelText.js';
import TrigTourColors from '../TrigTourColors.js';
import FractionNode from './FractionNode.js';

const cosString = TrigTourStrings.cos;
const sinString = TrigTourStrings.sin;
const tanString = TrigTourStrings.tan;
const xString = TrigTourStrings.x;
const yString = TrigTourStrings.y;

// non translatable string
const equalString = TrigTourMathStrings.EQUALS_STRING;

//constants
const DISPLAY_FONT = new PhetFont( 20 );
const DISPLAY_FONT_LARGE = new PhetFont( 30 );
const DISPLAY_FONT_LARGE_BOLD = new PhetFont( { size: 20, weight: 'bold' } );
const DISPLAY_FONT_LARGE_BOLD_ITALIC = new PhetFont( { size: 20, weight: 'bold', style: 'italic' } );
const TEXT_COLOR = TrigTourColors.TEXT_COLOR;

class LabelFractionValueRow extends Node {
  /**
   * Constructor.
   *
   * @param {string} trigLabelString - string representing the trig function for this row
   * @param {TrigTourModel} trigTourModel
   * @param {ViewProperties} viewProperties
   * @param {Object} [options]
   */
  constructor( trigLabelString, trigTourModel, viewProperties, options ) {

    super( options );

    // prevent block fitting of this row as a performance optimization
    this.preventFit = true;

    this.trigTourModel = trigTourModel; // @private
    this.viewProperties = viewProperties; // @private
    this.trigLabelString = trigLabelString; // @private

    const fontOptions = { font: DISPLAY_FONT, fill: TEXT_COLOR };

    // initialize strings and variables for the row, depending on trigLabelString
    let trigString;
    let numeratorString;
    let denominatorString;
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
      default:
        throw new Error( `invalid trigLabelString: ${trigLabelString}` );
    }

    // label section of the row, something like 'Cos θ ='
    const trigLabelText = new TrigFunctionLabelText( trigString, {
      trigFunctionLabelFont: DISPLAY_FONT_LARGE_BOLD,
      thetaLabelFont: DISPLAY_FONT_LARGE_BOLD_ITALIC
    } );
    const leftEqualText = new Text( equalString, { font: DISPLAY_FONT_LARGE_BOLD } );

    // label fraction for the row defining the shown value, something like 'x/1'
    const trigFraction = new FractionNode( numeratorString, denominatorString, { size: 20, fontWeight: 'bold' } );

    // value presented by this row as a number, updates with the model and depends on the angle
    const trigValueNumberText = new Text( 'trigModelValue', fontOptions );

    // value presented by this row as a fraction, updates with the model and depends on the angle
    const trigValueFraction = new FractionNode( '', '', fontOptions );

    // create an text representation of the equal sign
    const rightEqualText = new Text( equalString, { font: DISPLAY_FONT_LARGE_BOLD } );

    this.children = [ trigLabelText, leftEqualText, trigFraction, rightEqualText, trigValueNumberText, trigValueFraction ];

    // layout
    const space = 4;
    leftEqualText.leftCenter = trigLabelText.rightCenter.plusXY( space, 0 );
    trigFraction.leftCenter = leftEqualText.rightCenter.plusXY( space, 0 );
    rightEqualText.leftCenter = trigFraction.rightCenter.plusXY( space, 0 );
    trigValueNumberText.leftCenter = rightEqualText.rightCenter.plusXY( space, 0 );
    trigValueFraction.leftCenter = rightEqualText.rightCenter.plusXY( space, 0 );

    // if this row is for 'tan', create and add an infinity symbol to represent the singularity
    if ( trigLabelString === 'tan' ) {
      const plusMinusInfinityNode = new Node();
      const plusMinusText = new Text( MathSymbols.PLUS_MINUS, { font: DISPLAY_FONT, fill: TEXT_COLOR } );
      const infinityText = new Text( MathSymbols.INFINITY, { font: DISPLAY_FONT_LARGE, fill: TEXT_COLOR } );
      plusMinusInfinityNode.children = [ plusMinusText, infinityText ];
      plusMinusText.left = 0;
      infinityText.left = plusMinusText.right;
      infinityText.centerY = -5;
      plusMinusInfinityNode.leftCenter = rightEqualText.rightCenter;
      this.addChild( plusMinusInfinityNode );

      trigTourModel.singularityProperty.link( singularity => {
        plusMinusInfinityNode.visible = singularity;
        if ( !viewProperties.specialAnglesVisibleProperty.value ) {
          trigValueNumberText.visible = !singularity;
        }
      } );
    }

    // synchronize row values with model
    trigTourModel.fullAngleProperty.link( fullAngle => {
      this.setTrigReadout( trigValueNumberText, trigValueFraction );
    } );

    // synchronize component visibility with view properties
    viewProperties.specialAnglesVisibleProperty.link( specialAnglesVisible => {
      trigValueFraction.visible = specialAnglesVisible;
      trigValueNumberText.visible = !specialAnglesVisible;
      this.setTrigReadout( trigValueNumberText, trigValueFraction );
    } );
  }


  /**
   * Set the value of the trig value.
   * @private
   *
   * @param {Text} trigValueNumberText
   * @param {FractionNode} trigValueFraction
   */
  setTrigReadout( trigValueNumberText, trigValueFraction ) {
    if ( this.viewProperties.specialAnglesVisibleProperty.value ) {
      this.setSpecialAngleTrigReadout( trigValueFraction );
    }
    let trigValue;
    if ( this.trigLabelString === 'sin' ) {
      trigValue = this.trigTourModel.sin();
    }
    else if ( this.trigLabelString === 'cos' ) {
      trigValue = this.trigTourModel.cos();
    }
    else if ( this.trigLabelString === 'tan' ) {
      trigValue = this.trigTourModel.tan();
    }
    assert && assert( typeof trigValue !== 'undefined', 'trigLabelString must be one of cos, tan, or sin' );

    trigValueNumberText.string = Utils.toFixed( trigValue, 3 );
  }

  /**
   * Set the special angle readout display.
   * @private
   *
   * @param {FractionNode} trigValueFraction
   */
  setSpecialAngleTrigReadout( trigValueFraction ) {
    const smallAngleInDegrees = Utils.roundSymmetric( this.trigTourModel.getSmallAngle0To360() );

    // get the values needed to represent the special angle as a fraction.
    const specialFraction = this.specialAngles[ smallAngleInDegrees ];

    const setFractionValues = ( readoutFraction, specialFraction ) => {
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
}

trigTour.register( 'LabelFractionValueRow', LabelFractionValueRow );

export default LabelFractionValueRow;