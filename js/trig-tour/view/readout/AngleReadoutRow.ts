// Copyright 2016-2025, University of Colorado Boulder

/**
 * Creates the second row for the ReadoutNode of Trig Tour.  This row contains a label for the angle and the value
 * of the model angle, in degrees or radians.
 *
 * TODO: Re-implement value readout with AngleReadoutValue.ts, see https://github.com/phetsims/trig-tour/issues/107.
 *
 * @author Michael Dubson (PhET developer) on 6/10/2015
 * @author Jesse Greenberg
 */

import DerivedProperty from '../../../../../axon/js/DerivedProperty.js';
import PatternStringProperty from '../../../../../axon/js/PatternStringProperty.js';
import StringProperty from '../../../../../axon/js/StringProperty.js';
import TReadOnlyProperty from '../../../../../axon/js/TReadOnlyProperty.js';
import FluentUtils from '../../../../../chipper/js/browser/FluentUtils.js';
import Utils from '../../../../../dot/js/Utils.js';
import MathSymbols from '../../../../../scenery-phet/js/MathSymbols.js';
import PhetFont from '../../../../../scenery-phet/js/PhetFont.js';
import { HighlightFromNode, Node, NodeOptions, ReadingBlock, ReadingBlockHighlight, Text } from '../../../../../scenery/js/imports.js';
import TrigTourMessages from '../../../strings/TrigTourMessages.js';
import trigTour from '../../../trigTour.js';
import TrigTourStrings from '../../../TrigTourStrings.js';
import TrigTourModel from '../../model/TrigTourModel.js';
import SpecialAngles, { SpecialAngle } from '../../SpecialAngles.js';
import TrigTourMathStrings from '../../TrigTourMathStrings.js';
import TrigTourColors from '../TrigTourColors.js';
import ViewProperties, { AngleUnits } from '../ViewProperties.js';
import AngleReadoutValue from './AngleReadoutValue.js';
import FractionNode from './FractionNode.js';

//strings
const angleStringProperty = TrigTourStrings.angleStringProperty;
const radsStringProperty = TrigTourStrings.radsStringProperty;
const valueUnitPatternStringProperty = TrigTourStrings.valueUnitPatternStringProperty;

// non-translatable string
const equalString = TrigTourMathStrings.EQUALS_STRING;

//constants
const DISPLAY_FONT = new PhetFont( 20 );
const TEXT_COLOR = TrigTourColors.TEXT_COLOR;

class AngleReadoutRow extends ReadingBlock( Node ) {

  // number of decimal places for display of fullAngle, = 0 for special angles
  private decimalPrecision: number;
  private viewProperties: ViewProperties;
  private trigTourModel: TrigTourModel;

  private readonly angleReadoutDecimal: Text;
  private readonly fullAngleFractionNode: FractionNode;
  private readonly angleReadoutFraction: FractionNode;

  /**
   * @param trigTourModel is the main model of the sim
   * @param viewProperties
   * @param [providedOptions] to pass the maximum width of content in the ReadoutNode panel in the screen view.
   */
  public constructor( trigTourModel: TrigTourModel, viewProperties: ViewProperties, providedOptions: NodeOptions ) {
    super( providedOptions );

    this.decimalPrecision = 1;
    this.viewProperties = viewProperties;
    this.trigTourModel = trigTourModel;

    // initialize font styles
    const fontInfo = { font: DISPLAY_FONT, fill: TEXT_COLOR, maxWidth: 100 };
    const boldTextOptions = { font: DISPLAY_FONT, fill: TEXT_COLOR, fontWeight: 'bold', maxWidth: 55 };

    // full angle for the trigTourModel
    const fullAngleValue = Utils.toFixed( trigTourModel.fullAngleProperty.value, 1 );

    //  value is decimal number or exact fraction of radians (in special angle mode)
    const angleLabelText = new Text( angleStringProperty, boldTextOptions );
    const angleLabelEqualsText = new Text( equalString, boldTextOptions );
    this.angleReadoutDecimal = new Text( fullAngleValue, fontInfo ); // angle readout as decimal number
    this.fullAngleFractionNode = new FractionNode( '', '', { textOptions: fontInfo } );  // node representing fractional form of full angle

    // used to display angle as FractionNode in Special angles mode
    this.angleReadoutFraction = new FractionNode( '', '', { textOptions: fontInfo } );
    this.angleReadoutDecimal.visible = true;
    this.angleReadoutFraction.visible = false;

    // Either angleReadoutDecimal visible (decimal number values)
    // or (fullAngleFractionNode + angleReadoutFraction) visible in Special angles mode
    this.children = [ angleLabelText, angleLabelEqualsText, this.angleReadoutDecimal, this.fullAngleFractionNode, this.angleReadoutFraction ];

    // row 2 layout - needs to update whenever the label changes for dynamic layout
    angleLabelText.boundsProperty.link( bounds => {
      const spacing = 4;
      angleLabelEqualsText.left = angleLabelText.right + spacing;
      this.angleReadoutDecimal.left = angleLabelEqualsText.right + spacing;
      this.fullAngleFractionNode.left = angleLabelEqualsText.right + spacing;
      this.angleReadoutFraction.left = this.fullAngleFractionNode.right + spacing;
    } );

    trigTourModel.fullAngleProperty.link( fullAngle => {    // fullAngle is in radians
      this.setAngleReadout();
    } );

    viewProperties.angleUnitsProperty.link( units => {
      this.setUnits( units );
      if ( units === 'radians' && viewProperties.specialAnglesVisibleProperty.value ) {
        this.fullAngleFractionNode.visible = true;
        this.angleReadoutFraction.visible = true;
        this.angleReadoutDecimal.visible = false;
      }
      else {
        this.fullAngleFractionNode.visible = false;
        this.angleReadoutFraction.visible = false;
        this.angleReadoutDecimal.visible = true;
      }
      this.setAngleReadout();

      this.updateReadingBlockHighlight();
    } );

    viewProperties.specialAnglesVisibleProperty.link( specialAnglesVisible => {

      // select correct angle readout
      if ( specialAnglesVisible && viewProperties.angleUnitsProperty.value === 'radians' ) {
        this.fullAngleFractionNode.visible = true;
        this.angleReadoutFraction.visible = true;
        this.angleReadoutDecimal.visible = false;
      }
      else {
        this.fullAngleFractionNode.visible = false;
        this.angleReadoutFraction.visible = false;
        this.angleReadoutDecimal.visible = true;
      }

      // set precision of angle readout in degrees:
      // in special angles mode, zero decimal places (e.g. 45 deg), otherwise 1 decimal place (e.g. 45.0 deg)
      if ( specialAnglesVisible ) {
        const currentSmallAngle = trigTourModel.getSmallAngleInRadians();
        trigTourModel.setSpecialAngleWithSmallAngle( currentSmallAngle );
        this.setAngleReadoutPrecision( 0 );   //integer display of special angles
      }
      else {
        // 1 decimal place precision for continuous angles
        this.setAngleReadoutPrecision( 1 );
      }
      this.setAngleReadout();
      this.updateReadingBlockHighlight();
    } );

    const angleReadout = new AngleReadoutValue( trigTourModel, viewProperties );

    const descriptionStringProperty = new DerivedProperty( [
      this.fullAngleFractionNode.descriptionStringProperty,
      this.angleReadoutFraction.descriptionStringProperty,
      viewProperties.angleUnitsProperty,
      viewProperties.specialAnglesVisibleProperty,
      angleReadout.angleReadoutStringProperty,
      TrigTourMessages.valueMinusValuePatternMessageProperty,
      TrigTourMessages.valuePlusValuePatternMessageProperty,
      TrigTourMessages.angleEqualsSpecialAngleMessageProperty,
      TrigTourMessages.angleRadiansPatternMessageProperty,
      TrigTourMessages.angleDegreesPatternMessageProperty
    ], (
      fullAngleString,
      angleReadoutString,
      angleUnits,
      specialAnglesVisible,
      angleReadout
    ) => {
      return this.createDescriptionString( fullAngleString, angleReadoutString, angleUnits, specialAnglesVisible, angleReadout );
    } );
    this.readingBlockNameResponse = descriptionStringProperty;
    this.descriptionContent = descriptionStringProperty;
    this.readingBlockDisabledTagName = 'p';
  }

  /**
   * Create a description string for this row. Describes the angle readout in degrees/radians, and reads the fraction
   * values in natural language.
   *
   * @param fullAngleString - The fullAngleFractionNode description string
   * @param angleReadoutString - The angleReadoutFraction description string
   * @param angleUnits - The selected units.
   * @param specialAnglesVisible - Are special angles visible?
   * @param angleReadout - The angle readout string with the correct precision.
   */
  private createDescriptionString(
    fullAngleString: string,
    angleReadoutString: string,
    angleUnits: AngleUnits,
    specialAnglesVisible: boolean,
    angleReadout: string
  ): string {
    if ( specialAnglesVisible && angleUnits === 'radians' ) {

      // Hack alert - If the angleReadoutString includes the 'A' character, it is only used for layout
      // purposes. See the setSpecialAngleReadout method.
      if ( angleReadoutString && fullAngleString && !angleReadoutString.includes( 'A' ) ) {

        const patternMessageProperty = this.angleReadoutFraction.isNegative() ? TrigTourMessages.valueMinusValuePatternMessageProperty : TrigTourMessages.valuePlusValuePatternMessageProperty;
        const terms = FluentUtils.formatMessage( patternMessageProperty, {
          value1: fullAngleString,
          value2: angleReadoutString
        } );
        return FluentUtils.formatMessage( TrigTourMessages.angleEqualsSpecialAngleMessageProperty, {
          value: terms
        } );
      }
      else if ( fullAngleString ) {

        // The full angle string is used to display the special angle at intervals of 0 or pi.
        return FluentUtils.formatMessage( TrigTourMessages.angleEqualsSpecialAngleMessageProperty, {
          value: fullAngleString
        } );
      }
      else {

        // The angle readout string is used to display the other special angles.
        return FluentUtils.formatMessage( TrigTourMessages.angleEqualsSpecialAngleMessageProperty, {
          value: angleReadoutString
        } );
      }
    }
    else {
      if ( angleUnits === 'radians' ) {
        return FluentUtils.formatMessage( TrigTourMessages.angleRadiansPatternMessageProperty, {
          value: angleReadout
        } );
      }
      else {
        return FluentUtils.formatMessage( TrigTourMessages.angleDegreesPatternMessageProperty, {
          value: angleReadout
        } );
      }
    }
  }

  /**
   * Set readout units to either degrees or radians.
   */
  private setUnits( units: AngleUnits ): void {
    if ( units === 'radians' ) {
      this.angleReadoutDecimal.stringProperty = this.getAngleNumberInRadiansStringProperty();
    }
    else {
      this.angleReadoutDecimal.stringProperty = this.getAngleNumberInDegreesStringProperty();
    }
  }

  /**
   * Set the fullAngle readout precision.
   */
  private setAngleReadoutPrecision( decimalPrecision: number ): void {
    this.decimalPrecision = decimalPrecision;
  }

  /**
   * Sets the unit format of angle readout of readout panel in degrees, radians, or special angles.
   */
  private setAngleReadout(): void {
    const radiansDisplayed = this.viewProperties.angleUnitsProperty.value === 'radians';
    const specialAnglesVisible = this.viewProperties.specialAnglesVisibleProperty.value;
    if ( !radiansDisplayed ) {
      this.angleReadoutDecimal.stringProperty = this.getAngleNumberInDegreesStringProperty();
    }
    if ( radiansDisplayed && !specialAnglesVisible ) {
      this.angleReadoutDecimal.stringProperty = this.getAngleNumberInRadiansStringProperty();
    }
    if ( radiansDisplayed && specialAnglesVisible ) {
      this.setSpecialAngleReadout();
    }
  }

  /**
   * Returns a string Property (that will update with dynamic locales) for the angle readout as a numerical
   * value in radians.
   *
   * Remember to dispose the old Property before setting a new one!
   */
  private getAngleNumberInRadiansStringProperty(): TReadOnlyProperty<string> {
    const radiansValue = Utils.toFixed( this.trigTourModel.getFullAngleInRadians(), 3 );
    const patternStringProperty = new PatternStringProperty( valueUnitPatternStringProperty, {
      value: radiansValue,
      unit: radsStringProperty
    }, {
      formatNames: [ 'value', 'unit' ]
    } );

    return patternStringProperty;
  }

  /**
   * Returns a string Property for the angle readout as a numerical value in degrees. Since values for this Text
   * may need to change dynamically, all strings must use StringProperty (even though this one does not update).
   *
   * Remember to dispose the old Property before setting a new one!
   */
  private getAngleNumberInDegreesStringProperty(): TReadOnlyProperty<string> {
    return new StringProperty( `${Utils.toFixed(
      this.trigTourModel.getFullAngleInDegrees(),
      this.decimalPrecision )
    }\u00B0` );
  }

  /**
   * Set the special angle readout.
   */
  private setSpecialAngleReadout(): void {
    this.angleReadoutFraction.visible = true;

    // need integer value of angle, since internal arithmetic often not-quite integer
    let angleInDegs = Utils.roundSymmetric( this.trigTourModel.getFullAngleInDegrees() );
    if ( Math.abs( angleInDegs ) > 360 ) {
      angleInDegs = angleInDegs % 360;
    }

    // number of full turns around unit circle, incremented at theta = 0
    const fullTurnCount = this.trigTourModel.fullTurnCount;
    const piRadiansCount = 2 * fullTurnCount; // number of half turns around unit circle; half-turn = pi radians
    let fullTurnString = ''; // angle readout has format theta = 4pi + (1/2)pi = fullTurnString + small angle
    if ( piRadiansCount !== 0 ) {
      if ( fullTurnCount > 0 ) {
        fullTurnString = `${piRadiansCount + MathSymbols.PI} + `;
      }
      else {
        // if angle negative, minus sign is constructed in FractionNode
        fullTurnString = `${piRadiansCount + MathSymbols.PI} `;
      }
    }
    else {
      // if zero turns, set full turn string to null string.
      fullTurnString = '';
    }

    this.fullAngleFractionNode.setValues( fullTurnString, '', false );
    this.angleReadoutFraction.left = this.fullAngleFractionNode.right + 4;

    // set the angle readout, making sure that the angle is defined in the special fractions object
    const specialAngleFractions = SpecialAngles.SPECIAL_ANGLE_FRACTIONS;
    if ( specialAngleFractions[ angleInDegs as SpecialAngle ] || specialAngleFractions[ -angleInDegs as SpecialAngle ] ) {

      // correct for negative angles, fraction must reflect if negative and objects in SpecialAngles do not track
      // this information
      const sign = angleInDegs >= 0 ? '' : '-';
      const coefficient = angleInDegs >= 0 ? +1 : -1;

      const specialAngle = coefficient * angleInDegs as SpecialAngle;
      this.angleReadoutFraction.setValues(
        sign + specialAngleFractions[ specialAngle ].numerator, // string concatenation
        specialAngleFractions[ specialAngle ].denominator,
        false /* no radicals for special angle fractions */
      );
    }

    // Must handle smallAngle = 0 or pi as special cases
    let useFractionNode = false;
    const roundedAngle = Utils.roundSymmetric( this.trigTourModel.getSmallAngleInDegrees() );
    if ( roundedAngle === 0 || roundedAngle === 180 ) {
      const halfTurnCount = this.trigTourModel.halfTurnCount;
      let numberOfPiRadiansString;

      if ( halfTurnCount === 0 ) {

        // No turns, so we just show '0'
        numberOfPiRadiansString = '0';
      }
      else if ( halfTurnCount === 1 ) {

        // At 180 degrees, we show pi radians
        numberOfPiRadiansString = MathSymbols.PI;
      }
      else if ( halfTurnCount === -1 ) {

        // At -180 degrees, we show -pi radians
        numberOfPiRadiansString = `-${MathSymbols.PI}`;
      }
      else if ( roundedAngle === 180 ) {

        // In this special case, we show the number of radians like 2pi + pi. Displaying the equivalent like 3pi
        // was confusing to the student because it is a different representation when there is usually a fraction
        // representing the remaining angle. See https://github.com/phetsims/trig-tour/issues/80.
        const angleNegative = this.trigTourModel.getFullAngleInRadians() < 0;

        // The display needs to change if the angle is negative. For example, it should be
        // 2pi + pi (angle positive) OR
        // -2pi - pi (angle negative)

        // If negative, a minus sign is added - BUT NOTE: Its presence will make the FractionNode draw a custom line.
        const fractionNodeMinusSign = angleNegative ? '-' : '';

        // If positive, an addition plus sign is needed before the Pi sign from the FractionNode. (A minus sign is drawn
        // by FractionNode if necessary).
        const positivePlusSign = angleNegative ? '' : ' +'; // Spacing needed for conditional formatting.
        numberOfPiRadiansString = `${fractionNodeMinusSign}${Math.abs( halfTurnCount ) - 1}${MathSymbols.PI}${positivePlusSign}`;

        // The fraction Node will be used to show the additional pi sign.
        useFractionNode = true;
        this.angleReadoutFraction.setValues( `${fractionNodeMinusSign}${MathSymbols.PI}`, '' );
      }
      else {

        // Otherwise, the remaining angle is displayed as a fraction so show the number of half turns.
        numberOfPiRadiansString = `${halfTurnCount}${MathSymbols.PI}`;
      }

      this.fullAngleFractionNode.setValues( numberOfPiRadiansString, '' );

      // dummy angleReadoutFraction is set to ensure bounds remain constant and readoutDisplay does not jump around
      if ( useFractionNode ) {
        this.angleReadoutFraction.visible = true;
        this.angleReadoutFraction.left = this.fullAngleFractionNode.right + 9.5;
      }
      else {
        this.angleReadoutFraction.setValues( 'A', 'B' );
        this.angleReadoutFraction.visible = false;
      }
    }

    this.updateReadingBlockHighlight();
  }

  /**
   * This is a workaround - Scenery does not support an observable "visible" bounds Property and so the focus highlight
   * cannot adjust as components are made visible/invisible. As a workaround, manually update the focus highlight.
   *
   * This needs to be called when children visibility changes.
   */
  private updateReadingBlockHighlight(): void {

    // If there is an old focusHighlight, dispose it.
    if ( this.focusHighlight instanceof HighlightFromNode ) {
      this.focusHighlight.dispose();
    }

    this.focusHighlight = new ReadingBlockHighlight( this );
  }
}

trigTour.register( 'AngleReadoutRow', AngleReadoutRow );

export default AngleReadoutRow;