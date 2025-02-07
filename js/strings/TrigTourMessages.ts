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
  'piMessageProperty': TReadOnlyProperty<string>;
  'coordinatesPatternMessageProperty': LocalizedMessageProperty;
};

const TrigTourMessages = getFluentModule( {
  "en": "squareRootPattern = root { $value }\r\n\r\nnegativePattern = minus { $value }\r\n\r\nfractionPattern = { $numerator } over { $denominator }\r\n\r\nangleDegreesPattern = Angle equals { $value } degrees.\r\n\r\nangleRadiansPattern = Angle equals { $value } radians.\r\n\r\nangleEqualsSpecialAngle = Angle equals { $value }.\r\n\r\nvalueMinusValuePattern = { $value1 } { $value2 }\r\n\r\nvaluePlusValuePattern = { $value1 } plus { $value2 }\r\n\r\ntrigReadoutPattern = { $trigFunction ->\r\n  [ cos ] Cosine\r\n  [ sin ] Sine\r\n  *[tan] Tangent\r\n} theta equals { $trigFraction } or { $value }.\r\n\r\ninfinity = plus or minus infinity\r\n\r\npi = pi\r\n\r\ncoordinatesPattern = x equals { $xValue }, y equals { $yValue }."
} ) as unknown as TrigTourFluentType;

trigTour.register( 'TrigTourMessages', TrigTourMessages );

export default TrigTourMessages;
