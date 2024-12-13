// Copyright 2024, University of Colorado Boulder

/**
 * Constants for the Trig Tour simulation.
 *
 * @author Jesse Greenberg (PhET Interactive Simulations)
 */

import Utils from '../../../dot/js/Utils.js';

const TrigTourConstants = {
  KEYBOARD_DRAG_LISTENER_OPTIONS: {
    moveOnHoldInterval: 75,
    dragDelta: Utils.toRadians( 5 ),
    shiftDragDelta: Utils.toRadians( 0.5 )
  },

  // A larger delta in radians to apply when special angles are visible so that
  // we always move to the next special angle.
  SPECIAL_ANGLE_DELTA: Utils.toRadians( 20 )
};

export default TrigTourConstants;