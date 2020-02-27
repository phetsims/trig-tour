// Copyright 2015-2020, University of Colorado Boulder

/**
 * Special angles use throughout trig-tour.  The special angles can be represented in radians and degrees.  The first
 * arrays represent the special angle in degrees.  The structures below hold the information necessary for
 * FractionNode to build up the fractions which represent special angles in radians.
 *
 * @author Jesse Greenberg
 */

import MathSymbols from '../../../scenery-phet/js/MathSymbols.js';
import trigTour from '../trigTour.js';

// constants
const PI = MathSymbols.PI;

const SpecialAngles = {

  // an array containing the 'special' angles around the unit circle
  SPECIAL_ANGLES: [ 0, 30, 45, 60, 90, 120, 135, 150, 180, 210, 225, 240, 270, 300, 315, 330, 360 ],

  // an array containing the 'special' angles, offset by PI - needed because the smallAngle is bound to this range,
  // see TrigTourModel.setSpecialAngleWithSmallAngle() for further documentation
  SPECIAL_ANGLES_FROM_PI: [ -150, -135, -120, -90, -60, -45, -30, 0, 30, 45, 60, 90, 120, 135, 150, 180 ],

  // an array containing the border angles.  Needed by the drag handler to snap the angle to the closest special angle
  BORDER_ANGLES: [ 15, 37.5, 52.5, 75, 105, 127.5, 142.5, 165, 195, 217.5, 232.5, 255, 285, 307.5, 322.5, 345 ],

  // an array containing the border angles for the special angles offset from PI
  BORDER_ANGLES_FROM_PI: [ -165, -142.5, -127.5, -105, -75, -52.5, -37.5, -15, 15, 37.5, 52.5, 75, 105, 127.5, 142.5, 165 ],

  // the following array holds objects with the information needed for FractionNode to build fractions representing
  // the special angles in fractional form.  The first key is the angle in degrees to be represented by the fraction.
  SPECIAL_ANGLE_FRACTIONS: {
    0: {
      numerator: 0,
      denominator: ''
    },
    30: {
      numerator: PI,
      denominator: 6
    },
    45: {
      numerator: PI,
      denominator: 4
    },
    60: {
      numerator: PI,
      denominator: 3
    },
    90: {
      numerator: PI,
      denominator: 2
    },
    120: {
      numerator: 2 + PI,
      denominator: 3
    },
    135: {
      numerator: 3 + PI,
      denominator: 4
    },
    150: {
      numerator: 5 + PI,
      denominator: 6
    },
    180: {
      numerator: PI,
      denominator: ''
    },
    210: {
      numerator: 7 + PI,
      denominator: 6
    },
    225: {
      numerator: 5 + PI,
      denominator: 4
    },
    240: {
      numerator: 4 + PI,
      denominator: 3
    },
    270: {
      numerator: 3 + PI,
      denominator: 2
    },
    300: {
      numerator: 5 + PI,
      denominator: 3
    },
    315: {
      numerator: 7 + PI,
      denominator: 4
    },
    330: {
      numerator: 11 + PI,
      denominator: 6
    },
    360: {
      numerator: 2 + PI,
      denominator: ''
    }
  },

  // object containing information needed by FractionNode to build the fractional form of cos evaluated at special
  // angles - the first keys are the angle in degrees which are represented by the fraction.
  SPECIAL_COS_FRACTIONS: {
    0: {
      numerator: 1,
      denominator: '',
      radical: false
    },
    30: {
      numerator: 3,
      denominator: 2,
      radical: true
    },
    45: {
      numerator: 2,
      denominator: 2,
      radical: true
    },
    60: {
      numerator: 1,
      denominator: 2,
      radical: false
    },
    90: {
      numerator: 0,
      denominator: '',
      radical: false
    },
    120: {
      numerator: -1,
      denominator: 2,
      radical: false
    },
    135: {
      numerator: -2,
      denominator: 2,
      radical: true
    },
    150: {
      numerator: -3,
      denominator: 2,
      radical: true
    },
    180: {
      numerator: -1,
      denominator: '',
      radical: false
    },
    210: {
      numerator: -3,
      denominator: 2,
      radical: true
    },
    225: {
      numerator: -2,
      denominator: 2,
      radical: true
    },
    240: {
      numerator: -1,
      denominator: 2,
      radical: false
    },
    270: {
      numerator: 0,
      denominator: '',
      radical: false
    },
    300: {
      numerator: 1,
      denominator: 2,
      radical: false
    },
    315: {
      numerator: 2,
      denominator: 2,
      radical: true
    },
    330: {
      numerator: 3,
      denominator: 2,
      radical: true
    },
    360: {
      numerator: 1,
      denominator: '',
      radical: false
    }
  },

  // object containing information needed by FractionNode to build the fractional form of sin evaluated at special
  // angles - the first keys are the angle in degrees which are represented by the fraction.
  SPECIAL_SIN_FRACTIONS: {
    0: {
      numerator: 0,
      denominator: '',
      radical: false
    },
    30: {
      numerator: 1,
      denominator: 2,
      radical: false
    },
    45: {
      numerator: 2,
      denominator: 2,
      radical: true
    },
    60: {
      numerator: 3,
      denominator: 2,
      radical: true
    },
    90: {
      numerator: 1,
      denominator: '',
      radical: false
    },
    120: {
      numerator: 3,
      denominator: 2,
      radical: true
    },
    135: {
      numerator: 2,
      denominator: 2,
      radical: true
    },
    150: {
      numerator: 1,
      denominator: 2,
      radical: false
    },
    180: {
      numerator: 0,
      denominator: '',
      radical: false
    },
    210: {
      numerator: -1,
      denominator: 2,
      radical: false
    },
    225: {
      numerator: -2,
      denominator: 2,
      radical: true
    },
    240: {
      numerator: -3,
      denominator: 2,
      radical: true
    },
    270: {
      numerator: -1,
      denominator: '',
      radical: false
    },
    300: {
      numerator: -3,
      denominator: 2,
      radical: true
    },
    315: {
      numerator: -2,
      denominator: 2,
      radical: true
    },
    330: {
      numerator: -1,
      denominator: 2,
      radical: false
    },
    360: {
      numerator: 0,
      denominator: '',
      radical: false
    }
  },

  // object containing information needed by FractionNode to build the fractional form of sin evaluated at special
  // angles - the first keys are the angle in degrees which are represented by the fraction.
  SPECIAL_TAN_FRACTIONS: {
    0: {
      numerator: 0,
      denominator: '',
      radical: false
    },
    30: {
      numerator: 3,
      denominator: 3,
      radical: true
    },
    45: {
      numerator: 1,
      denominator: '',
      radical: false
    },
    60: {
      numerator: 3,
      denominator: '',
      radical: true
    },
    90: {
      numerator: '', // blank, tan function at singularity, represented by infinity symbol
      denominator: '',
      radical: false
    },
    120: {
      numerator: -3,
      denominator: '',
      radical: true
    },
    135: {
      numerator: -1,
      denominator: '',
      radical: false
    },
    150: {
      numerator: -3,
      denominator: 3,
      radical: true
    },
    180: {
      numerator: 0,
      denominator: '',
      radical: false
    },
    210: {
      numerator: 3,
      denominator: 3,
      radical: true
    },
    225: {
      numerator: 1,
      denominator: '',
      radical: false
    },
    240: {
      numerator: 3,
      denominator: '',
      radical: true
    },
    270: {
      numerator: '', // blank, tan function at singularity, represented by infinity symbol
      denominator: '',
      radical: false
    },
    300: {
      numerator: -3,
      denominator: '',
      radical: true
    },
    315: {
      numerator: -1,
      denominator: '',
      radical: false
    },
    330: {
      numerator: -3,
      denominator: 3,
      radical: true
    },
    360: {
      numerator: 0,
      denominator: '',
      radical: false
    }
  }
};

trigTour.register( 'SpecialAngles', SpecialAngles );

export default SpecialAngles;