// Copyright 2015-2019, University of Colorado Boulder

/**
 * The following is a collection of strings used in trig-tour that are not meant to be translatable, including some
 * numbers and math symbols.
 *
 * @author Michael Dubson (PhET developer) on 6/3/2015.
 * @author Jesse Greenberg
 */
define( require => {
  'use strict';

  const trigTour = require( 'TRIG_TOUR/trigTour' );

  // strings
  const TrigTourMathStrings = {
    ONE_STRING: '1',
    MINUS_ONE_STRING: '-1',
    MINUS_STRING: '-',
    EQUALS_STRING: ' = '
  };

  trigTour.register( 'TrigTourMathStrings', TrigTourMathStrings );

  return TrigTourMathStrings;
} );