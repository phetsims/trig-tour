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
  "en": "squareRootablePattern = { $squareRoot ->\n  [ TRUE ] root { $value }\n  *[ FALSE ] { $value }\n}\n\nfractionPattern = { $numeratorSquareRoot ->\n  [ TRUE ] root { $value }\n *[ VALUE ] { $value }\n} over { $denominatorSquareRoot ->\n  [ TRUE ] root { $value }\n *[ VALUE ] { $value }\n}\n\nangleDegreesPattern = Angle equals { $degrees } degrees.\n\nangleRadiansPattern = Angle equals { $radians } radians.\n\nangleRadiansFractionPattern = Angle equals { fractionPattern } radians."
} ) as TrigTourFluentType;

trigTour.register( 'TrigTourMessages', TrigTourMessages );

export default TrigTourMessages;
