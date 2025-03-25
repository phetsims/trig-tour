// Copyright 2024, University of Colorado Boulder

/**
 * Query parameters for this simulation.
 *
 * @author Jesse Greenberg (PhET Interactive Simulations)
 */

import { QueryStringMachine } from '../../../query-string-machine/js/QueryStringMachineModule.js';
import trigTour from '../trigTour.js';

const TrigTourQueryParameters = QueryStringMachine.getAll( {

  // Reduces the number of rotations in the unit circle so that it is easier to find the limit.s
  maxRotations: {
    type: 'number',

    // Value must be an integer becase it is used in a multiple of PI. It must be an even
    // number because the drag handlers in this sim assume that in their calculations.
    isValidValue: ( value: number ) => value < 60 && Number.isInteger( value ) && value % 2 === 0,
    defaultValue: 50 // High number makes it difficult and whimsical to find the limit.
  }
} );

trigTour.register( 'TrigTourQueryParameters', TrigTourQueryParameters );
export default TrigTourQueryParameters;