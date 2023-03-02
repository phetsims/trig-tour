// Copyright 2016-2023, University of Colorado Boulder

/**
 * Creates the first row for the ReadoutNode of Trig Tour.
 *
 * @author Michael Dubson (PhET developer) on 6/10/2015
 * @author Jesse Greenberg
 */

import Utils from '../../../../../dot/js/Utils.js';
import PhetFont from '../../../../../scenery-phet/js/PhetFont.js';
import { HBox, Node, Text } from '../../../../../scenery/js/imports.js';
import trigTour from '../../../trigTour.js';
import TrigTourStrings from '../../../TrigTourStrings.js';
import SpecialAngles from '../../SpecialAngles.js';
import TrigTourMathStrings from '../../TrigTourMathStrings.js';
import TrigTourColors from '../TrigTourColors.js';
import FractionNode from './FractionNode.js';

const xString = TrigTourStrings.x;
const yString = TrigTourStrings.y;

// non translatable string
const equalString = TrigTourMathStrings.EQUALS_STRING;

//constants
const DISPLAY_FONT = new PhetFont( 20 );
const DISPLAY_FONT_LARGE = new PhetFont( 30 );
const TEXT_COLOR = TrigTourColors.TEXT_COLOR;

const SPECIAL_COS_FRACTIONS = SpecialAngles.SPECIAL_COS_FRACTIONS;
const SPECIAL_SIN_FRACTIONS = SpecialAngles.SPECIAL_SIN_FRACTIONS;

class CoordinatesRow extends Node {

  /**
   * Constructor.
   *
   * @param {TrigTourModel} trigTourModel
   * @param {ViewProperties} viewProperties
   * @param {Object} [options]
   * @constructor
   */
  constructor( trigTourModel, viewProperties, options ) {
    super( options );

    this.trigTourModel = trigTourModel; // @private
    this.viewProperties = viewProperties; // @private

    // initialize fonts for this row
    const fontInfo = { font: DISPLAY_FONT, fill: TEXT_COLOR };
    const largeFontInfo = { font: DISPLAY_FONT_LARGE, fill: TEXT_COLOR };
    const fontBoldInfo = { font: DISPLAY_FONT, fill: TEXT_COLOR, fontWeight: 'bold' };

    // string pattern for the axis readout
    const xyEqualString = `(${xString},${yString})${equalString}`;
    const coordinatesLabel = new Text( xyEqualString, fontBoldInfo );

    // fraction values set below
    this.sinReadoutFraction = new FractionNode( '', '', fontInfo );
    this.cosReadoutFraction = new FractionNode( '', '', fontInfo );
    this.coordinatesReadout = new Text( '', fontInfo ); // text provided by model.fullAngleProperty.link, below

    // create the text for the parentheses.  Comma uses different font options, so a pattern cannot be used.
    const leftParensText = new Text( '( ', largeFontInfo );
    const commaText = new Text( ' ,  ', fontInfo );
    const rightParensText = new Text( ' )', largeFontInfo );

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
    const setRowLayout = () => {
      const spacing = 4;
      this.coordinatesReadout.left = coordinatesLabel.right + spacing;
      this.coordinatesHBox.left = coordinatesLabel.right + spacing;
      this.coordinatesHBox.centerY = coordinatesLabel.centerY;
    };

    // Register for synchronization with model.
    trigTourModel.fullAngleProperty.link( fullAngle => {
      const sinText = Utils.toFixed( trigTourModel.sin(), 3 );
      const cosText = Utils.toFixed( trigTourModel.cos(), 3 );
      this.coordinatesReadout.string = `(${cosText}, ${sinText})`;
      this.setSpecialAngleTrigReadout( this.sinReadoutFraction, SPECIAL_SIN_FRACTIONS );
      this.setSpecialAngleTrigReadout( this.cosReadoutFraction, SPECIAL_COS_FRACTIONS );

      // update the layout accordingly
      setRowLayout();
    } );

    viewProperties.specialAnglesVisibleProperty.link( specialAnglesVisible => {
      this.coordinatesHBox.visible = specialAnglesVisible;
      this.coordinatesReadout.visible = !specialAnglesVisible;
    } );
  }

  /**
   * Set the special angle readout display.
   *
   * @private
   */
  setSpecialAngleTrigReadout( trigValueFraction, specialFractions ) {
    const smallAngleInDegrees = Utils.roundSymmetric( this.trigTourModel.getSmallAngle0To360() );
    const specialFraction = specialFractions[ smallAngleInDegrees ];

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

trigTour.register( 'CoordinatesRow', CoordinatesRow );
export default CoordinatesRow;