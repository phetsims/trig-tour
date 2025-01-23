// Copyright 2025, University of Colorado Boulder
    
/* eslint-disable */
/* @formatter:off */

/**
 * Auto-generated from modulify, DO NOT manually modify.
 */

import getFluentModule from '../../../chipper/js/browser/getFluentModule.js';
import trigTour from '../../js/trigTour.js';
import LocalizedMessageProperty from '../../../chipper/js/browser/LocalizedMessageProperty.js';

type TrigTourFluentType = {
  'squareRootablePatternMessageProperty': LocalizedMessageProperty;
  'fractionPatternMessageProperty': LocalizedMessageProperty;
  'angleDegreesPatternMessageProperty': LocalizedMessageProperty;
  'angleRadiansPatternMessageProperty': LocalizedMessageProperty;
  'angleRadiansFractionPatternMessageProperty': LocalizedMessageProperty;
};

const TrigTourMessages = getFluentModule( {
  "en": "squareRootablePattern = { $squareRoot ->\r\n  [ TRUE ] root { $value }\r\n  *[ FALSE ] { $value }\r\n}\r\n\r\nfractionPattern = { $numeratorSquareRoot ->\r\n  [ TRUE ] root { $value }\r\n *[ VALUE ] { $value }\r\n} over { $denominatorSquareRoot ->\r\n  [ TRUE ] root { $value }\r\n *[ VALUE ] { $value }\r\n}\r\n\r\nangleDegreesPattern = Angle equals { $degrees } degrees.\r\n\r\nangleRadiansPattern = Angle equals { $radians } radians.\r\n\r\nangleRadiansFractionPattern = Angle equals { fractionPattern } radians."
} ) as TrigTourFluentType;

trigTour.register( 'TrigTourMessages', TrigTourMessages );

export default TrigTourMessages;
