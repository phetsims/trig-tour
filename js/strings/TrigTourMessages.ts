// Copyright 2025, University of Colorado Boulder
    
/* eslint-disable */
/* @formatter:off */

/**
 * Auto-generated from modulify, DO NOT manually modify.
 */

import getFluentModule from '../../../chipper/js/browser/getFluentModule.js';
import trigTour from '../../js/trigTour.js';
import LocalizedMessageProperty from '../../../chipper/js/browser/LocalizedMessageProperty.js';
import type TReadOnlyProperty from '../../../axon/js/TReadOnlyProperty.js';

type TrigTourFluentType = {
  'squareRootPatternMessageProperty': LocalizedMessageProperty;
  'negativePatternMessageProperty': LocalizedMessageProperty;
  'fractionPatternMessageProperty': LocalizedMessageProperty;
  'angleDegreesPatternMessageProperty': LocalizedMessageProperty;
  'angleRadiansPatternMessageProperty': LocalizedMessageProperty;
  'angleEqualsSpecialAngleMessageProperty': LocalizedMessageProperty;
  'valueMinusValuePatternMessageProperty': LocalizedMessageProperty;
  'valuePlusValuePatternMessageProperty': LocalizedMessageProperty;
  'trigReadoutPatternMessageProperty': LocalizedMessageProperty;
  'infinityMessageProperty': TReadOnlyProperty<string>;
  'coordinatesPatternMessageProperty': LocalizedMessageProperty;
};

const TrigTourMessages = getFluentModule( {
  "en": "squareRootPattern = root { $value }\n\nnegativePattern = minus { $value }\n\nfractionPattern = { $numerator } over { $denominator }\n\nangleDegreesPattern = Angle equals { $value } degrees.\n\nangleRadiansPattern = Angle equals { $value } radians.\n\nangleEqualsSpecialAngle = Angle equals { $value }.\n\nvalueMinusValuePattern = { $value1 } { $value2 }\n\nvaluePlusValuePattern = { $value1 } plus { $value2 }\n\ntrigReadoutPattern = { $trigFunction ->\n  [ cos ] Cosine\n  [ sin ] Sine\n  *[tan] Tangent\n} theta equals { $trigFraction } or { $value }.\n\ninfinity = plus or minus infinity\n\ncoordinatesPattern = x equals { $xValue }, y equals { $yValue }."
} ) as unknown as TrigTourFluentType;

trigTour.register( 'TrigTourMessages', TrigTourMessages );

export default TrigTourMessages;
