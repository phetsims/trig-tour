// Copyright 2025, University of Colorado Boulder

/**
 * Logic representing an angle readout value string. Updates string Properties from dependencies like
 * the units, angle value, and whether "special angles" are visible.
 *
 * @author Michael Dubson (PhET developer) on 6/10/2015
 * @author Jesse Greenberg
 */

import DerivedProperty from '../../../../../axon/js/DerivedProperty.js';
import PatternStringProperty from '../../../../../axon/js/PatternStringProperty.js';
import TReadOnlyProperty from '../../../../../axon/js/TReadOnlyProperty.js';
import StringUtils from '../../../../../phetcommon/js/util/StringUtils.js';
import trigTour from '../../../trigTour.js';
import TrigTourStrings from '../../../TrigTourStrings.js';
import TrigTourModel from '../../model/TrigTourModel.js';
import TrigTourUtils from '../../TrigTourUtils.js';
import ViewProperties, { AngleUnits } from '../ViewProperties.js';

const radsStringProperty = TrigTourStrings.radsStringProperty;
const valueUnitPatternStringProperty = TrigTourStrings.valueUnitPatternStringProperty;

export default class AngleReadoutValue {

  // The string representation of the angle, with the correct units and decimal places.
  public readonly angleReadoutWithUnitsStringProperty: TReadOnlyProperty<string>;

  // The string representation of the angle, with correct decimal places but without units.
  public readonly angleReadoutStringProperty: TReadOnlyProperty<string>;

  // The natural language representation of the angle, with units. Something like
  // "45 degrees" or "negative 45 degrees".
  public readonly naturalLanguageAngleReadoutWithUnitsStringProperty: TReadOnlyProperty<string>;

  // The natural language representation of the angle, without units. Something like
  // "45" or "negative 45".
  public readonly naturalLanguageAngleReadoutStringProperty: TReadOnlyProperty<string>;

  public constructor( model: TrigTourModel, viewProperties: ViewProperties ) {

    // number of decimal places for display of fullAngle, = 0 for special angles
    // in special angles mode, zero decimal places (e.g. 45 deg), otherwise 1 decimal place (e.g. 45.0 deg)
    // Only relevant for degrees.
    const decimalPrecisionProperty = new DerivedProperty( [ viewProperties.specialAnglesVisibleProperty ], visible => {
      return visible ? 0 : 1;
    } );

    // The readout for angles in radians (decimalPrecisionProperty is only used for degrees).
    const angleInRadiansStringProperty = new DerivedProperty( [ model.fullAngleProperty ], angleInRadians => {
      return StringUtils.toFixedLTR( angleInRadians, 3 );
    } );

    // The readout value in radians.
    const angleRadiansWithUnitsStringProperty = new PatternStringProperty( valueUnitPatternStringProperty, {
      value: model.fullAngleProperty,
      unit: radsStringProperty
    }, {
      formatNames: [ 'value', 'unit' ],
      decimalPlaces: 3
    } );

    const angleInDegreesStringProperty = new DerivedProperty(
      [ model.fullAngleProperty, decimalPrecisionProperty ],
      ( fullAngle, decimalPrecision ) => {
        return StringUtils.toFixedLTR( model.getFullAngleInDegrees(), decimalPrecision );
      }
    );

    // The value in degrees, with the correct number of decimal places.
    const angleDegreesWithUnitsStringProperty = new DerivedProperty( [ angleInDegreesStringProperty ], angleInDegrees => {
      return `${angleInDegrees}\u00B0`;
    } );

    // Assemble the final readout value.
    this.angleReadoutWithUnitsStringProperty = new DerivedProperty( [
      viewProperties.angleUnitsProperty,
      angleRadiansWithUnitsStringProperty,
      angleDegreesWithUnitsStringProperty
    ], ( units: AngleUnits, radiansString: string, degreesString: string ) => {
      return units === 'radians' ? radiansString : degreesString;
    } );

    this.angleReadoutStringProperty = new DerivedProperty( [
      viewProperties.angleUnitsProperty,
      angleInRadiansStringProperty,
      angleInDegreesStringProperty
    ], ( units: AngleUnits, radiansString: string, degreesString: string ) => {
      return units === 'radians' ? radiansString : degreesString;
    } );

    this.naturalLanguageAngleReadoutWithUnitsStringProperty = new DerivedProperty(
      [ this.angleReadoutWithUnitsStringProperty ],
      readoutWithUnits => {
        return TrigTourUtils.getNaturalLanguageValueString( readoutWithUnits );
      }
    );

    this.naturalLanguageAngleReadoutStringProperty = new DerivedProperty(
      [ this.angleReadoutStringProperty ],
      readout => {
        return TrigTourUtils.getNaturalLanguageValueString( readout );
      }
    );
  }
}

trigTour.register( 'AngleReadoutValue', AngleReadoutValue );