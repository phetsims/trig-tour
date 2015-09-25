// Copyright 2002-2015, University of Colorado Boulder

/**
 * Main model for Trig Tour Sim
 *
 * @author Michael Dubson (PhET)
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var PropertySet = require( 'AXON/PropertySet' );
  var Util = require( 'DOT/Util' );

  /**
   * Constructor for TrigTourModel.
   *
   * @constructor
   */
  function TrigTourModel() {

    // @public
    PropertySet.call( this, {
      fullAngle: 0,             // total (full) angle in radians, can be greater than 2*pi, or less than -2*pi
      singularity: false    // indicates singularity in tan function at theta = +/- 90 degrees
                            // true if fullAngle is close to +/-90 degrees
    } );

    this.smallAngle = 0;    // @private, fullAngle modulo 2*pi with 180 offset, is between -pi and +pi
    this.previousAngle = 0; // @private, smallAngle in previous step, needed to compute total fullAngle from smallAngle
    this.rotationNumberFromPi = 0;  //@private, number of turns around the unit circle, incremented at +/-180 deg,
                                    //needed to compute fullAngle from smallAngle
    this.fullTurnCount = 0; // @public, number of turns around unit circle, incremented at fullAngle = 0 deg
    this.halfTurnCount = 0; // @public, number of half turns around unit circle, incremented at smallAngle = 0 and 180
  }

  return inherit( PropertySet, TrigTourModel, {

    /**
     * Returns cos of the total model fullAngle in radians.
     *
     * @returns {number}
     */
    cos: function() {
      return Math.cos( this.fullAngle );
    },

    /**
     * Returns sin of the total model fullAngle in radians.
     *
     * @returns {number}
     */
    sin: function() {
      return Math.sin( this.fullAngle );
    },

    /**
     * Returns tangent of current model fullAngle in radians. When near +/-90 degrees, cuts off tan value at +/- maxValue.
     * Must cut off value at +/- maxValue or else Safari Browser won't display properly.
     *
     * @returns {number}
     */
    tan: function() {
      var tanValue = Math.tan( this.fullAngle );
      var maxValue = 350;
      this.singularity = false;
      var returnValue;
      if ( tanValue > maxValue ) {
        returnValue = maxValue;
        this.singularity = true;
      }
      else if ( tanValue < -maxValue ) {
        returnValue = -maxValue;
        this.singularity = true;
      }
      else {
        returnValue = tanValue;
      }
      return returnValue;
    },

    /**
     * Get the current model fullAngle in radians.
     *
     * @returns {number}
     */
    getFullAngleInRadians: function() {
      return this.fullAngle;
    },

    /**
     * Get the current model fullAngle in degrees.
     *
     * @returns {number}
     */
    getFullAngleInDegrees: function() {
      return Util.toDegrees( this.fullAngle );
    },

    /**
     * Returns the small angle in radians, between -pi and +pi
     *
     * @returns {number}
     */
    getSmallAngleInRadians: function() {
      return this.smallAngle;
    },

    /**
     * Return the small angle in degrees between -180 and +180.
     *
     * @returns {number}
     */
    getSmallAngleInDegrees: function() {
      return Util.toDegrees( this.smallAngle );
    },

    /**
     * Convenience function, return the small angle in degrees bound by 0 to +360
     *
     * @returns {number}
     */
    getSmallAngle0To360: function() {
      if ( this.smallAngle > 0 ) {
        return Util.toDegrees( this.smallAngle );
      }
      else {
        return 360 + Util.toDegrees( this.smallAngle );
      }
    },

    /**
     * Set the full angle, and the associated small angle and various turn counts.
     *
     * @param {number} fullAngleInRads - requested new angle
     */
    setFullAngleInRadians: function( fullAngleInRads ) {
      var remainderAngle = fullAngleInRads % ( 2 * Math.PI );
      this.fullTurnCount = Util.roundSymmetric( ( fullAngleInRads - remainderAngle ) / ( 2 * Math.PI ) );

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
      this.halfTurnCount = Util.roundSymmetric( ( fullAngleInRads - remainderAngle ) / ( Math.PI ) );
      this.fullAngle = fullAngleInRads;
    },

    /**
     * Set the full angle and its associated small angle and turn counts from a desired small angle.
     *
     * @param {number} smallAngle
     */
    setFullAngle: function( smallAngle ) {
      this.smallAngle = smallAngle;

      // must be less than (180-30)deg in order to handle special angle correctly
      var comparisonAngle = 149 * Math.PI / 180;
      if ( ( this.smallAngle < 0 ) && (this.previousAngle > comparisonAngle) ) {
        this.rotationNumberFromPi += 1;
      }
      else if ( this.smallAngle > 0 && this.previousAngle < -comparisonAngle ) {
        this.rotationNumberFromPi -= 1;
      }

      // don't want to trigger angle update yet
      var targetAngle = this.rotationNumberFromPi * 2 * Math.PI + this.smallAngle;

      // round to nearest half-degree; to do this, must convert to degrees and then back to rads
      var roundedTargetAngle = targetAngle * 180 / Math.PI;
      var deltaDeg = 0.5;
      var roundFactor = Util.roundSymmetric( 1 / deltaDeg );
      roundedTargetAngle = Util.roundSymmetric( roundedTargetAngle * roundFactor ) / roundFactor;
      targetAngle = roundedTargetAngle * Math.PI / 180;
      var remainderAngle = targetAngle % ( 2 * Math.PI );

      // set turn counts and angles
      this.fullTurnCount = Util.roundSymmetric( ( targetAngle - remainderAngle ) / ( 2 * Math.PI ) );
      remainderAngle = targetAngle % ( Math.PI );
      this.halfTurnCount = Util.roundSymmetric( ( targetAngle - remainderAngle ) / ( Math.PI ) );
      this.fullAngle = targetAngle;  // now can trigger angle update
      this.previousAngle = smallAngle;
    },

    /**
     * Given the small angle in radians, set the current fullAngle to nearest special angle in radians.
     *
     * @param {number} smallAngle - small angle in radians
     */
    setSpecialAngleWithSmallAngle: function( smallAngle ) {
      var smallAngleInDegs = smallAngle * 180 / Math.PI;
      var nearestSpecialAngleInRads = 0;
      var specialAngles = [ -150, -135, -120, -90, -60, -45, -30, 0, 30, 45, 60, 90, 120, 135, 150, 180 ];

      // borders are angles half-way between special angles
      var borders = [ -165, -142.5, -127.5, -105, -75, -52.5, -37.5, -15, 15, 37.5, 52.5, 75, 105, 127.5, 142.5, 165 ];
      for ( var i = 0; i < specialAngles.length; i++ ) {
        if ( smallAngleInDegs >= borders[ i ] && smallAngleInDegs < borders[ i + 1 ] ) {
          nearestSpecialAngleInRads = specialAngles[ i ] * Math.PI / 180;
        }
        // Must deal with angle = 180 deg  as a special case.
        if ( smallAngleInDegs >= 165 || smallAngleInDegs < -165 ) {
          nearestSpecialAngleInRads = Math.PI;
        }
      }
      this.setFullAngle( nearestSpecialAngleInRads );
    },

    /**
     * Given the full angle, set angle to the nearest special angle.
     *
     * @param {number} fullAngle - full angle in radians
     */
    setSpecialAngleWithFullAngle: function( fullAngle ) {
      var remainderAngle = fullAngle % ( 2 * Math.PI );
      var fullTurnsAngle = fullAngle - remainderAngle;
      var remainderInDegrees = remainderAngle * 180 / Math.PI;
      var nearestSpecialAngleInDegrees = 0;

      // Notice these are not the same special angles as in setSpecialAngle() above
      var specialAngles = [ 0, 30, 45, 60, 90, 120, 135, 150, 180, 210, 225, 240, 270, 300, 315, 330, 360 ];

      // borders are angles half-way between special angles
      var borders = [ 15, 37.5, 52.5, 75, 105, 127.5, 142.5, 165, 195, 217.5, 232.5, 255, 285, 307.5, 322.5, 345 ];

      for ( var i = 0; i <= specialAngles.length - 1; i++ ) {
        if ( remainderInDegrees >= borders[ i ] && remainderInDegrees < borders[ i + 1 ] ) {
          nearestSpecialAngleInDegrees = specialAngles[ i + 1 ];
        }
        if ( remainderInDegrees <= -borders[ i ] && remainderInDegrees > -borders[ i + 1 ] ) {
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

      var nearestSpecialAngleInRadians = nearestSpecialAngleInDegrees * Math.PI / 180;
      var nearestFullAngle = fullTurnsAngle + nearestSpecialAngleInRadians;
      this.setFullAngleInRadians( nearestFullAngle );
    }
  } );
} );