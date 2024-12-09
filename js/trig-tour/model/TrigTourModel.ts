// Copyright 2015-2024, University of Colorado Boulder

/**
 * Main model for Trig Tour Sim
 *
 * @author Michael Dubson (PhET)
 */

import BooleanProperty from '../../../../axon/js/BooleanProperty.js';
import NumberProperty from '../../../../axon/js/NumberProperty.js';
import Property from '../../../../axon/js/Property.js';
import Utils from '../../../../dot/js/Utils.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import trigTour from '../../trigTour.js';
import SpecialAngles from '../SpecialAngles.js';
import TrigTourConstants from '../TrigTourConstants.js';
import TrigTourQueryParameters from '../TrigTourQueryParameters.js';

// constants
const MAX_SMALL_ANGLE_LIMIT = 0.5 * Math.PI;

// must be ( integer+0.5) number of full rotations
const MAX_ANGLE_LIMIT = TrigTourQueryParameters.maxRotations * Math.PI + MAX_SMALL_ANGLE_LIMIT;

class TrigTourModel {

  // Total (full) angle in radians, can be greater than 2*pi, or less than -2*pi
  public readonly fullAngleProperty: Property<number>;

  // Indicates singularity in tan function at theta = +/- 90 degrees, true if fullAngle is close
  // to +/-90 degrees
  public readonly singularityProperty: Property<boolean>;

  // True if user exceeds maximum allowed angle
  public readonly maxAngleExceededProperty: Property<boolean>;

  private smallAngle = 0; // fullAngle modulo 2*pi with 180 offset, is between -pi and +pi
  public previousAngle = 0; // smallAngle in previous step, needed to compute total fullAngle from smallAngle

  // number of turns around the unit circle, incremented at +/-180 deg, needed to compute fullAngle from smallAngle
  private rotationNumberFromPi = 0;

  private _fullTurnCount = 0; // Number of turns around unit circle, incremented at fullAngle = 0 deg
  private _halfTurnCount = 0; // Number of half turns around unit circle, incremented at smallAngle = 0 and 180

  public constructor() {
    this.fullAngleProperty = new NumberProperty( 0 );
    this.singularityProperty = new BooleanProperty( false );
    this.maxAngleExceededProperty = new BooleanProperty( false );
  }

  /**
   * Resets the properties of the model
   */
  public reset(): void {
    this.fullAngleProperty.reset();
    this.singularityProperty.reset();
    this.maxAngleExceededProperty.reset();
  }

  /**
   * Returns cos of the total model fullAngle in radians.
   */
  public cos(): number {
    return Math.cos( this.fullAngleProperty.value );
  }

  /**
   * Returns sin of the total model fullAngle in radians.
   */
  public sin(): number {
    return Math.sin( this.fullAngleProperty.value );
  }

  /**
   * Returns tangent of current model fullAngle in radians. When near +/-90 degrees, cuts off tan value at +/- maxValue.
   * Must cut off value at +/- maxValue or else Safari Browser won't display properly.
   */
  public tan(): number {
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
   */
  public getFullAngleInRadians(): number {
    return this.fullAngleProperty.value;
  }

  /**
   * Get the current model fullAngle in degrees.
   */
  public getFullAngleInDegrees(): number {
    return Utils.toDegrees( this.fullAngleProperty.value );
  }

  /**
   * Returns the small angle in radians, between -pi and +pi
   */
  public getSmallAngleInRadians(): number {
    return this.smallAngle;
  }

  /**
   * Return the small angle in degrees between -180 and +180.
   */
  public getSmallAngleInDegrees(): number {
    return Utils.toDegrees( this.smallAngle );
  }

  public get fullTurnCount(): number {
    return this._fullTurnCount;
  }

  public get halfTurnCount(): number {
    return this._halfTurnCount;
  }

  /**
   * Convenience function, return the small angle in degrees bound by 0 to +360
   */
  public getSmallAngle0To360(): number {
    if ( this.smallAngle > 0 ) {
      return Utils.toDegrees( this.smallAngle );
    }
    else {
      return 360 + Utils.toDegrees( this.smallAngle );
    }
  }

  /**
   * Set the full angle, and the associated small angle and various turn counts.
   *
   * @param fullAngleInRads - requested new angle
   */
  public setFullAngleInRadians( fullAngleInRads: number ): void {
    let remainderAngle = fullAngleInRads % ( 2 * Math.PI );
    this._fullTurnCount = Utils.roundSymmetric( ( fullAngleInRads - remainderAngle ) / ( 2 * Math.PI ) );

    if ( Math.abs( remainderAngle ) <= Math.PI ) {
      this.rotationNumberFromPi = this._fullTurnCount;
    }
    else {
      if ( fullAngleInRads > 0 ) {
        this.rotationNumberFromPi = this._fullTurnCount + 1;
      }
      else {
        this.rotationNumberFromPi = this._fullTurnCount - 1;
      }
    }
    this.smallAngle = fullAngleInRads - this.rotationNumberFromPi * 2 * Math.PI;
    remainderAngle = fullAngleInRads % ( Math.PI );
    this._halfTurnCount = Utils.roundSymmetric( ( fullAngleInRads - remainderAngle ) / ( Math.PI ) );
    this.fullAngleProperty.value = this.constrainFullAngle( fullAngleInRads );
  }

  private constrainFullAngle( fullAngle: number ): number {
    return Utils.clamp( fullAngle, -MAX_ANGLE_LIMIT, MAX_ANGLE_LIMIT );
  }

  /**
   * Set the full angle and its associated small angle and turn counts from a desired small angle.
   *
   * @param smallAngle
   */
  public setFullAngleWithSmallAngle( smallAngle: number ): void {
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
    this._fullTurnCount = Utils.roundSymmetric( ( targetAngle - remainderAngle ) / ( 2 * Math.PI ) );
    remainderAngle = targetAngle % ( Math.PI );

    // If the remainderAngle is very close to Math.PI or 2 * Math.PI, set to 0 so that the halfTurnCount is not off by 1.
    // See https://github.com/phetsims/trig-tour/issues/97.
    if ( Math.abs( remainderAngle - Math.PI ) < 1e-10 || Math.abs( remainderAngle - 2 * Math.PI ) < 1e10 ) {
      remainderAngle = 0;
    }
    this._halfTurnCount = Utils.roundSymmetric( ( targetAngle - remainderAngle ) / ( Math.PI ) );
    this.fullAngleProperty.value = this.constrainFullAngle( targetAngle );  // now can trigger angle update
    this.previousAngle = smallAngle;
  }

  public getNextFullDeltaFromKeyboardInput( keyboardDelta: Vector2, specialAnglesVisible: boolean ): number {
    let nextFullAngle = 0;

    // By default, the modelDelta will provided by the delta of the keyboard listener.
    let modelDelta = Math.abs( keyboardDelta.x ) || Math.abs( keyboardDelta.y );

    // If special angles are visible, use the larger increment to move far enough to get
    // to the next special angle.
    if ( specialAnglesVisible ) {
      modelDelta = TrigTourConstants.SPECIAL_ANGLE_DELTA;
    }

    // Positive y is down, so we are increasing if y is negative.
    const increasing = keyboardDelta.x > 0 || keyboardDelta.y < 0;
    if ( increasing ) {
      nextFullAngle = this.fullAngleProperty.value + modelDelta;
    }
    else {
      nextFullAngle = this.fullAngleProperty.value - modelDelta;
    }

    return nextFullAngle;
  }

  /**
   * Set a new full angle, from a proposed full angle. Applies the correct angle
   * based on whether the max angle is exceeded and whether special angles are visible.
   */
  public setNewFullAngle( newFullAngle: number, specialAnglesVisible: boolean ): void {
    if ( !this.maxAngleExceededProperty.value ) {
      if ( !specialAnglesVisible ) {
        this.setFullAngleInRadians( newFullAngle );
      }
      else {
        this.setSpecialAngleWithFullAngle( newFullAngle );
      }
    }
    else {

      // max angle exceeded, ony update if user tries to decrease magnitude of fullAngle
      if ( Math.abs( newFullAngle ) < TrigTourModel.MAX_ANGLE_LIMIT ) {
        this.setFullAngleInRadians( newFullAngle );
      }
    }
  }

  /**
   * Given the small angle in radians, set the current fullAngle to nearest special angle in radians. The small angle
   * is bound in the range of -PI to PI due to the delta of the drag handler, so the list of special angles is
   * also bound to this range.
   *
   * @param smallAngle - small angle in radians
   */
  public setSpecialAngleWithSmallAngle( smallAngle: number ): void {
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
   *
   * @param fullAngle - full angle in radians
   */
  public setSpecialAngleWithFullAngle( fullAngle: number ): void {
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
   */
  public checkMaxAngleExceeded(): void {

    // determine if max angle is exceeded and set the property.
    this.maxAngleExceededProperty.value = ( Math.abs( this.getFullAngleInRadians() ) >= MAX_ANGLE_LIMIT );
  }

  public static readonly MAX_SMALL_ANGLE_LIMIT = MAX_SMALL_ANGLE_LIMIT;
  public static readonly MAX_ANGLE_LIMIT = MAX_ANGLE_LIMIT;
}

trigTour.register( 'TrigTourModel', TrigTourModel );

export default TrigTourModel;