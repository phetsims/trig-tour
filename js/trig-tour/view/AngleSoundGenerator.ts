// Copyright 2024, University of Colorado Boulder

/**
 * AngleSoundGenerator is a sound generator specifically designed to produce sounds for the
 * controls that change the angle in trig-tour.
 *
 * @author Jesse Greenberg (PhET Interactive Simulations)
 */

import Range from '../../../../dot/js/Range.js';
import Utils from '../../../../dot/js/Utils.js';
import ValueChangeSoundPlayer from '../../../../tambo/js/sound-generators/ValueChangeSoundPlayer.js';
import trigTour from '../../trigTour.js';
import TrigTourModel from '../model/TrigTourModel.js';

class AngleSoundGenerator extends ValueChangeSoundPlayer {
  public constructor() {

    const range = new Range( -TrigTourModel.MAX_ANGLE_LIMIT, TrigTourModel.MAX_ANGLE_LIMIT );
    super( range, {

      // Limit precision so that comparison against the range limits works consistently.
      constrainValue: ( value: number ) => Utils.toFixedNumber( value, 1 ),

      // Arbitrary, but creates a consistent sound as the user interacts with the angle.
      numberOfMiddleThresholds: 700
    } );
  }
}

trigTour.register( 'AngleSoundGenerator', AngleSoundGenerator );

export default AngleSoundGenerator;