// Copyright 2002-2015, University of Colorado Boulder

/**
 * Main model for Trig Tour Sim
 * @author Michael Dubson (PhET)
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var PropertySet = require( 'AXON/PropertySet' );
  var Util = require( 'DOT/Util' );

  /**
   * @constructor
   * No parameter
   */
  function TrigTourModel() {

    PropertySet.call( this, {
      angle: 0,             // @public, total angle in radians, can be greater than 2*pi, or less than -2*pi
      singularity: false    // @public, indicates singularity in tan function at theta = +/- 90 degrees
                            // true if angle is close to +/-90 degrees
    } );
    this.smallAngle = 0;    // @private, smallAngle = angle modulo 2*pi with 180 offset, is between -pi and +pi
    this.previousAngle = 0; // @private, smallAngle in previous step, needed to compute total angle from smallAngle
    this.rotationNumberFromPi = 0;  //@private, nbr of turns around the unit circle, incremented at +/-180 deg,
                                    //needed to compute (full) angle from smallAngle
    this.fullTurnCount = 0; // @public, nbr of turns around unit circle, incremented at angle = 0 deg
    this.halfTurnCount = 0; // @public, nbr of half turns around unit circle, incremented at small angle = 0 and 180
    this.specialAnglesMode = false;  //{boolean} true if special angles only (0, 30, 45, 60, 90...)
  }

  return inherit( PropertySet, TrigTourModel, {
    cos: function() {
      return Math.cos( this.angle );
    },
    sin: function() {
      return Math.sin( this.angle );
    },

    //Returns tangent of current angle. But when near +/-90 degrees, cuts off tan value at +/- maxValue.
    //Must cut off value at +/- maxValue or else Safari Browser won't display properly.
    tan: function() {
      var tanValue = Math.tan( this.angle );
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

    getAngleInRadians: function() {
      return this.angle;
    },
    getAngleInDegrees: function() {
      return this.angle * 180 / Math.PI;
    },

    //small angle in rads, between -pi and +pi
    getSmallAngleInRadians: function() {
      return this.smallAngle;
    },

    //small angle in degrees between -180 and +180
    getSmallAngleInDegrees: function() {
      return this.smallAngle * 180 / Math.PI;
    },

    //small angle in degrees 0 to +360
    getSmallAngle0To360: function() {
      if ( this.smallAngle > 0 ) {
        return this.smallAngle * 180 / Math.PI;
      }
      else {
        return 360 + this.smallAngle * 180 / Math.PI;
      }
    },

    //set the full angle, the small angle and various turns counts, given the current full angle
    setFullAngleInRadians: function( angleInRads ) {   //argument is total angle, not small angle
      var remainderAngle = angleInRads % ( 2 * Math.PI );
      this.fullTurnCount = Util.roundSymmetric( ( angleInRads - remainderAngle ) / (2 * Math.PI ) );
      if ( Math.abs( remainderAngle ) <= Math.PI ) {
        this.rotationNumberFromPi = this.fullTurnCount;
      }
      else {
        if ( angleInRads > 0 ) {
          this.rotationNumberFromPi = this.fullTurnCount + 1;
        }
        else {
          this.rotationNumberFromPi = this.fullTurnCount - 1;
        }
      }
      this.smallAngle = angleInRads - this.rotationNumberFromPi * 2 * Math.PI;
      remainderAngle = angleInRads % ( Math.PI );
      this.halfTurnCount = Util.roundSymmetric( ( angleInRads - remainderAngle ) / ( Math.PI ) );
      this.angle = angleInRads;
    },

    //set the full angle, and various turns counts, given the current small angle
    setAngle: function( smallAngle ) {    //smallAngle in rads
      this.smallAngle = smallAngle;
      var comparisonAngle = 149 * Math.PI / 180; //must be less than (180-30)deg in order to handle special angle correctly
      if ( ( this.smallAngle < 0 ) && (this.previousAngle > comparisonAngle) ) {
        this.rotationNumberFromPi += 1;
      }
      else if ( this.smallAngle > 0 && this.previousAngle < -comparisonAngle ) {
        this.rotationNumberFromPi -= 1;
      }

      var targetAngle = this.rotationNumberFromPi * 2 * Math.PI + this.smallAngle;  //don't want to trigger angle update yet

      //round to nearest half-degree; to do this, must convert to degrees and then back to rads 
      var roundedTargetAngle = targetAngle * 180 / Math.PI;
      var deltaDeg = 0.5;
      var roundFactor = Util.roundSymmetric( 1 / deltaDeg );
      roundedTargetAngle = Util.roundSymmetric( roundedTargetAngle * roundFactor ) / roundFactor;
      targetAngle = roundedTargetAngle * Math.PI / 180;
      var remainderAngle = targetAngle % ( 2 * Math.PI );
      this.fullTurnCount = Util.roundSymmetric( ( targetAngle - remainderAngle ) / ( 2 * Math.PI ) );
      remainderAngle = targetAngle % ( Math.PI );
      this.halfTurnCount = Util.roundSymmetric( ( targetAngle - remainderAngle ) / ( Math.PI ) );
      this.angle = targetAngle;  //now can trigger angle update
      this.previousAngle = smallAngle;
    },

    //given the small angle in rads, sets current angle to nearest special angle in rads; called from UnitCircleView
    setSpecialAngleWithSmallAngle: function( smallAngle ) {   //smallAngle in rads
      var smallAngleInDegs = smallAngle * 180 / Math.PI;
      var nearestSpecialAngleInRads = 0;
      var specialAngles = [ -150, -135, -120, -90, -60, -45, -30, 0, 30, 45, 60, 90, 120, 135, 150, 180 ];

      //borders are angles half-way between special angles
      var borders = [ -165, -142.5, -127.5, -105, -75, -52.5, -37.5, -15, 15, 37.5, 52.5, 75, 105, 127.5, 142.5, 165 ];
      for ( var i = 0; i < specialAngles.length; i++ ) {
        if ( smallAngleInDegs >= borders[ i ] && smallAngleInDegs < borders[ i + 1 ] ) {
          nearestSpecialAngleInRads = specialAngles[ i ] * Math.PI / 180;
        }
        //Must deal with angle = 180 deg  as a special case.
        if ( smallAngleInDegs >= 165 || smallAngleInDegs < -165 ) {
          nearestSpecialAngleInRads = Math.PI;
        }
      }
      this.setAngle( nearestSpecialAngleInRads );
    },


    //Given the full angle, set angle to the nearest special angle; called from GraphView
    setSpecialAngleWithFullAngle: function( fullAngle ) {   //full angle in radians
      var remainderAngle = fullAngle % ( 2 * Math.PI );
      var fullTurnsAngle = fullAngle - remainderAngle;
      var remainderInDegrees = remainderAngle * 180 / Math.PI;
      var nearestSpecialAngleInDegrees = 0;

      //Notice these are not the same special angles as in setSpecialAngle() above
      var specialAngles = [ 0, 30, 45, 60, 90, 120, 135, 150, 180, 210, 225, 240, 270, 300, 315, 330, 360 ];

      //borders are angles half-way between special angles
      var borders = [ 15, 37.5, 52.5, 75, 105, 127.5, 142.5, 165, 195, 217.5, 232.5, 255, 285, 307.5, 322.5, 345 ];

      for ( var i = 0; i <= specialAngles.length - 1; i++ ) {
        if ( remainderInDegrees >= borders[ i ] && remainderInDegrees < borders[ i + 1 ] ) {
          nearestSpecialAngleInDegrees = specialAngles[ i + 1 ];// * Math.PI / 180;
        }
        if ( remainderInDegrees <= -borders[ i ] && remainderInDegrees > -borders[ i + 1 ] ) {
          nearestSpecialAngleInDegrees = -specialAngles[ i + 1 ];// * Math.PI / 180;
        }
      }
      //Must handle 0 and +/-360 deg angles as special cases.
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