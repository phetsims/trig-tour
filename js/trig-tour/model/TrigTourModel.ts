// Copyright 2015-2021, University of Colorado Boulder

/**
 * Main model for Trig Tour Sim
 *
 * @author Michael Dubson (PhET)
 */

import BooleanProperty from '../../../../axon/js/BooleanProperty.js';
import NumberProperty from '../../../../axon/js/NumberProperty.js';
import Utils from '../../../../dot/js/Utils.js';
import trigTour from '../../trigTour.js';
import SpecialAngles from '../SpecialAngles.js';

// constants
const MAX_SMALL_ANGLE_LIMIT = 0.5 * Math.PI;
const MAX_ANGLE_LIMIT = 50 * Math.PI + MAX_SMALL_ANGLE_LIMIT; // must be ( integer+0.5) number of full rotations

class TrigTourModel {
  constructor() {

    // @public {Property.<Number>} total (full) angle in radians, can be greater than 2*pi, or less than -2*pi
    this.fullAngleProperty = new NumberProperty( 0 );

    // @public {Property.<boolean>} indicates singularity in tan function at theta = +/- 90 degrees
    // true if fullAngle is close to +/-90 degrees
    this.singularityProperty = new BooleanProperty( false );

    // @public {Property.<boolean>} (read-only) true if user exceeds maximum allowed angle
    this.maxAngleExceededProperty = new BooleanProperty( false );


    this.smallAngle = 0;    // @private, fullAngle modulo 2*pi with 180 offset, is between -pi and +pi
    this.previousAngle = 0; // @private, smallAngle in previous step, needed to compute total fullAngle from smallAngle
    this.rotationNumberFromPi = 0;  //@private, number of turns around the unit circle, incremented at +/-180 deg,
                                    //needed to compute fullAngle from smallAngle
    this.fullTurnCount = 0; // @public, number of turns around unit circle, incremented at fullAngle = 0 deg
    this.halfTurnCount = 0; // @public, number of half turns around unit circle, incremented at smallAngle = 0 and 180
  }


  /**
   * Resets the properties of the model
   * @public
   */
  reset() {
    this.fullAngleProperty.reset();
    this.singularityProperty.reset();
    this.maxAngleExceededProperty.reset();
  }

  /**
   * Returns cos of the total model fullAngle in radians.
   * @public
   *
   * @returns {number}
   */
  cos() {
    return Math.cos( this.fullAngleProperty.value );
  }

  /**
   * Returns sin of the total model fullAngle in radians.
   * @public
   *
   * @returns {number}
   */
  sin() {
    return Math.sin( this.fullAngleProperty.value );
  }

  /**
   * Returns tangent of current model fullAngle in radians. When near +/-90 degrees, cuts off tan value at +/- maxValue.
   * Must cut off value at +/- maxValue or else Safari Browser won't display properly.
   * @public
   *
   * @returns {number}
   */
  tan() {
    const tanValue = Math.tan( this.fullAngleProperty.value );
    const maxValue = 350;
    this.singularityProperty.value = false;
    let returnValue;
    if ( tanValue > maxValue ) {
      returnValue = maxValue;
      this.singularityProperty.value = true;
    }
    else if ( tanValue < -maxValue ) {
      returnValue = -maxValue;
      this.singularityProperty.value = true;
    }
    else {
      returnValue = tanValue;
    }
    return returnValue;
  }

  /**
   * Get the current model fullAngle in radians.
   * @public
   *
   * @returns {number}
   */
  getFullAngleInRadians() {
    return this.fullAngleProperty.value;
  }

  /**
   * Get the current model fullAngle in degrees.
   * @public
   *
   * @returns {number}
   */
  getFullAngleInDegrees() {
    return Utils.toDegrees( this.fullAngleProperty.value );
  }

  /**
   * Returns the small angle in radians, between -pi and +pi
   * @public
   *
   * @returns {number}
   */
  getSmallAngleInRadians() {
    return this.smallAngle;
  }

  /**
   * Return the small angle in degrees between -180 and +180.
   * @public
   *
   * @returns {number}
   */
  getSmallAngleInDegrees() {
    return Utils.toDegrees( this.smallAngle );
  }

  /**
   * Convenience function, return the small angle in degrees bound by 0 to +360
   * @public
   *
   * @returns {number}
   */
  getSmallAngle0To360() {
    if ( this.smallAngle > 0 ) {
      return Utils.toDegrees( this.smallAngle );
    }
    else {
      return 360 + Utils.toDegrees( this.smallAngle );
    }
  }

  /**
   * Set the full angle, and the associated small angle and various turn counts.
   * @public
   *
   * @param {number} fullAngleInRads - requested new angle
   */
  setFullAngleInRadians( fullAngleInRads ) {
    let remainderAngle = fullAngleInRads % ( 2 * Math.PI );
    this.fullTurnCount = Utils.roundSymmetric( ( fullAngleInRads - remainderAngle ) / ( 2 * Math.PI ) );

    if ( Math.abs( remainderAngle ) <= Math.PI ) {
      this.rotationNumberFromPi = this.fullTurnCount;
    }
    else {
      if ( fullAngleInRads > 0 ) {
        this.rotationNumberFromPi = this.fullTurnCount + 1;
      }
      else {
        this.rotationNumberFromPi = this.fullTurnCount - 1;
      }
    }
    this.smallAngle = fullAngleInRads - this.rotationNumberFromPi * 2 * Math.PI;
    remainderAngle = fullAngleInRads % ( Math.PI );
    this.halfTurnCount = Utils.roundSymmetric( ( fullAngleInRads - remainderAngle ) / ( Math.PI ) );
    this.fullAngleProperty.value = fullAngleInRads;
  }

  /**
   * Set the full angle and its associated small angle and turn counts from a desired small angle.
   * @public
   *
   * @param {number} smallAngle
   */
  setFullAngleWithSmallAngle( smallAngle ) {
    this.smallAngle = smallAngle;

    // must be less than (180-30)deg in order to handle special angle correctly
    const comparisonAngle = Utils.toRadians( 149 );
    if ( ( this.smallAngle < 0 ) && ( this.previousAngle > comparisonAngle ) ) {
      this.rotationNumberFromPi += 1;
    }
    else if ( this.smallAngle > 0 && this.previousAngle < -comparisonAngle ) {
      this.rotationNumberFromPi -= 1;
    }

    // don't want to trigger angle update yet
    let targetAngle = this.rotationNumberFromPi * 2 * Math.PI + this.smallAngle;

    // round to nearest half-degree; to do this, must convert to degrees and then back to rads
    let roundedTargetAngle = Utils.toDegrees( targetAngle );
    const deltaDeg = 0.5;
    const roundFactor = Utils.roundSymmetric( 1 / deltaDeg );
    roundedTargetAngle = Utils.roundSymmetric( roundedTargetAngle * roundFactor ) / roundFactor;
    targetAngle = Utils.toRadians( roundedTargetAngle );
    let remainderAngle = targetAngle % ( 2 * Math.PI );

    // set turn counts and angles
    this.fullTurnCount = Utils.roundSymmetric( ( targetAngle - remainderAngle ) / ( 2 * Math.PI ) );
    remainderAngle = targetAngle % ( Math.PI );
    this.halfTurnCount = Utils.roundSymmetric( ( targetAngle - remainderAngle ) / ( Math.PI ) );
    this.fullAngleProperty.value = targetAngle;  // now can trigger angle update
    this.previousAngle = smallAngle;
  }

  /**
   * Given the small angle in radians, set the current fullAngle to nearest special angle in radians. The small angle
   * is bound in the range of -PI to PI due to the delta of the drag handler, so the list of special angles is
   * also bound to this range.
   * @public
   *
   * @param {number} smallAngle - small angle in radians
   */
  setSpecialAngleWithSmallAngle( smallAngle ) {
    const smallAngleInDegrees = Utils.toDegrees( smallAngle );
    let nearestSpecialAngleInRads = 0;
    const specialAnglesFromPi = SpecialAngles.SPECIAL_ANGLES_FROM_PI;

    // borders are angles half-way between special angles
    const borderAnglesFromPi = SpecialAngles.BORDER_ANGLES_FROM_PI;
    for ( let i = 0; i < specialAnglesFromPi.length; i++ ) {
      if ( smallAngleInDegrees >= borderAnglesFromPi[ i ] && smallAngleInDegrees < borderAnglesFromPi[ i + 1 ] ) {
        nearestSpecialAngleInRads = Utils.toRadians( specialAnglesFromPi[ i ] );
      }
      // Must deal with angle = 180 deg  as a special case.
      if ( smallAngleInDegrees >= 165 || smallAngleInDegrees < -165 ) {
        nearestSpecialAngleInRads = Math.PI;
      }
    }
    this.setFullAngleWithSmallAngle( nearestSpecialAngleInRads );
  }

  /**
   * Given the full angle, set angle to the nearest special angle.
   * @public
   *
   * @param {number} fullAngle - full angle in radians
   */
  setSpecialAngleWithFullAngle( fullAngle ) {
    const remainderAngle = fullAngle % ( 2 * Math.PI );
    const fullTurnsAngle = fullAngle - remainderAngle;
    const remainderInDegrees = Utils.toDegrees( remainderAngle );
    let nearestSpecialAngleInDegrees = 0;

    // Notice these are not the same special angles as in setSpecialAngle() above
    const specialAngles = SpecialAngles.SPECIAL_ANGLES;

    // borders are angles half-way between special angles
    const borderAngles = SpecialAngles.BORDER_ANGLES;

    for ( let i = 0; i <= specialAngles.length - 1; i++ ) {
      if ( remainderInDegrees >= borderAngles[ i ] && remainderInDegrees < borderAngles[ i + 1 ] ) {
        nearestSpecialAngleInDegrees = specialAngles[ i + 1 ];
      }
      if ( remainderInDegrees <= -borderAngles[ i ] && remainderInDegrees > -borderAngles[ i + 1 ] ) {
        nearestSpecialAngleInDegrees = -specialAngles[ i + 1 ];
      }
    }

    // Must handle 0 and +/-360 deg angles as special cases.
    if ( remainderInDegrees < 15 && remainderInDegrees >= -15 ) {
      nearestSpecialAngleInDegrees = 0;
    }
    else if ( remainderInDegrees >= 345 ) {
      nearestSpecialAngleInDegrees = 360;
    }
    else if ( remainderInDegrees < -345 ) {
      nearestSpecialAngleInDegrees = -360;
    }

    const nearestSpecialAngleInRadians = Utils.toRadians( nearestSpecialAngleInDegrees );
    const nearestFullAngle = fullTurnsAngle + nearestSpecialAngleInRadians;
    this.setFullAngleInRadians( nearestFullAngle );
  }

  /**
   * Checks to see if the user exceeds max number of rotations.  If the user exceeds +/- 25.25 rotations, the
   * fullAngle can not grow in magnitude. Sets the max angleExceeded property and is called whenever user tries to
   * change the fullAngle.
   *
   * @public
   */
  checkMaxAngleExceeded() {
    // determine if max angle is exceeded and set the property.
    this.maxAngleExceededProperty.value = ( Math.abs( this.getFullAngleInRadians() ) > MAX_ANGLE_LIMIT );
  }
}


// statics
TrigTourModel.MAX_SMALL_ANGLE_LIMIT = MAX_SMALL_ANGLE_LIMIT;
TrigTourModel.MAX_ANGLE_LIMIT = MAX_ANGLE_LIMIT;

trigTour.register( 'TrigTourModel', TrigTourModel );

export default TrigTourModel;