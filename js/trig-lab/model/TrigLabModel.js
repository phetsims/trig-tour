// Copyright 2002-2015, University of Colorado Boulder

/**
 * Main model for Trig Lab Sim
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
   *
   */
  function TrigLabModel() {

    PropertySet.call( this, {
      angle: 0,               //@private, total angle in radians, can be greater than 2*pi radians, or less than -2*pi radians
      singularity: false      //@private, indicates singularity in tan function at theta = +/- 90 degrees,true is angle is close to +/-90 degrees
    } );
    this.smallAngle = 0;     //@private, smallAngle is between -pi and +pi = angle modulo 2*pi, with 180 offset
    this.previousAngle = 0;  //@private, smallAngle in previous step, needed to compute total angle from smallAngle
    this.nbrFullTurns = 0;   //@private, nbr of turns around the unit circle incremented at angle = 180 deg; needed to compute total angle from smallAngle
    this.fullTurnCount = 0;  //@private, nbr of full turns around unit circle, incremented at angle = 0 deg
    this.halfTurnCount = 0;  //@private, nbr of half turns around unit circle, incremented at small angle = 0 and 180
    this.specialAnglesMode = false;  //{boolean} true if special angles only (0, 30,45, 60, 90...)
  }

  return inherit( PropertySet, TrigLabModel, {
    cos: function () {
      return Math.cos( this.angle );
    },
    sin: function () {
      return Math.sin( this.angle );
    },
    tan: function () {
      //Cut off value at +/- maxValue or else Safari Browser won't display properly
      var tanValue = Math.tan( this.angle );
      var maxValue = 350;
      this.singularity = false;
      var returnValue;
      if( tanValue > maxValue ){
         returnValue = maxValue;
        this.singularity = true;
      }else if( tanValue < -maxValue ){
        returnValue= -maxValue;
        this.singularity = true;
      }else{
         returnValue = tanValue;
      }
      return returnValue;
    },
    getAngleInRadians: function(){
      return this.angle;
    },
    getAngleInDegrees: function () {
       return this.angle*180/Math.PI;
    },
    //small angle in rads is -pi to +pi
    getSmallAngleInRadians: function(){
        return this.smallAngle;
    },
    //small angle in degrees is -180 to +180
    getSmallAngleInDegrees: function(){
      return this.smallAngle*180/Math.PI;
    },
    //small angle in degrees 0 to +360
    getSmallAngle0To360: function(){
      if( this.smallAngle > 0 ){
        return this.smallAngle*180/Math.PI;
      }else{
        return 360 + this.smallAngle*180/Math.PI;
      }
    },
    getFullTurnCount: function(){
      return this.fullTurnCount;
    },
    getHalfTurnCount: function(){
      return this.halfTurnCount;
    },
    setAngleInDegrees: function( angleInDegrees ){
        this.angle = angleInDegrees*Math.PI/180;
    },
    setFullAngleInRadians: function( angleInRads ){   //argument is total angle, not small angle
      var remainderAngle = angleInRads%( 2*Math.PI );
      this.fullTurnCount = Util.roundSymmetric( ( angleInRads - remainderAngle )/(2*Math.PI ));
      if( Math.abs( remainderAngle ) <= Math.PI ){
        this.nbrFullTurns = this.fullTurnCount;
      }else{
        if( angleInRads > 0 ){
          this.nbrFullTurns = this.fullTurnCount + 1;
        }else{
          this.nbrFullTurns = this.fullTurnCount - 1;
        }
      }
      this.smallAngle = angleInRads - this.nbrFullTurns*2*Math.PI;
      remainderAngle = angleInRads%( Math.PI );
      this.halfTurnCount = Util.roundSymmetric( ( angleInRads - remainderAngle )/(Math.PI ));
      this.angle = angleInRads;
    } ,
    //set the full angle, and various turns counts, given the current small angle
    setAngle: function ( smallAngle ){    //smallAngle in rads
      this.smallAngle = smallAngle;
      var comparisonAngle = 149*Math.PI/180;  //chosen somewhat arbitrarily but want this rather far from angle = 180 deg
      if( ( this.smallAngle < 0 ) && (this.previousAngle > comparisonAngle) ){
        this.nbrFullTurns += 1;
      }else if ( this.smallAngle > 0 && this.previousAngle < -comparisonAngle ) {
        this.nbrFullTurns -= 1;
      }

      var angleTarget = this.nbrFullTurns*2*Math.PI + this.smallAngle;  //don't want to trigger angle update yet
      //round to nearest half-degree,;must convert to degrees and then back to rads for this
      var roundedAngleTarget = angleTarget*180/Math.PI;
      var deltaDeg = 0.5;
      var roundFactor = Util.roundSymmetric( 1/deltaDeg );
      roundedAngleTarget = Util.roundSymmetric( roundedAngleTarget*roundFactor )/roundFactor;
      angleTarget = roundedAngleTarget*Math.PI/180;
      var remainderAngle = angleTarget%( 2*Math.PI );
      this.fullTurnCount = Util.roundSymmetric( ( angleTarget - remainderAngle )/(2*Math.PI ));
      remainderAngle = angleTarget%( Math.PI );
      this.halfTurnCount = Util.roundSymmetric( ( angleTarget - remainderAngle )/(Math.PI ));
      this.angle = angleTarget;  //now can trigger angle update
      //console.log( 'Model.setAngle called. angleInDeg = ' + this.getAngleInDegrees() );
      this.previousAngle = smallAngle;
    },//end setAngle()
    //takes small angle in rads and sets current angle to nearest special angle in rads
    setSpecialAngle: function ( smallAngle ){   //smallAngle in rads
      var smallAngleInDegs = smallAngle*180/Math.PI;
      var nearestSpecialAngleInRads = 0;
      var angles = [ -150, -135, -120, -90, -60, -45, -30, 0, 30, 45, 60, 90, 120, 135, 150, 180 ];
      var borders = [ -165, -142.5, -127.5, -105, -75, -52.5, -37.5, -15, 15, 37.5, 52.5, 75, 105, 127.5, 142.5, 165 ] ;
      for ( var i = 0; i < angles.length; i++ ){
        if( smallAngleInDegs >= borders[i] && smallAngleInDegs < borders[i + 1] ){
          nearestSpecialAngleInRads = angles[i]*Math.PI/180;
        }
        //Must deal with 180 deg angle as a special case.
        if( smallAngleInDegs >= 165 || smallAngleInDegs < -165 ){
          nearestSpecialAngleInRads = Math.PI;
        }
      }//end for
      this.setAngle( nearestSpecialAngleInRads );
    },//end setSpecialAngle()

    //takes small angle in rads and sets current angle to nearest special angle in rads
    getNearestSpecialAngle: function ( smallAngle ){   //smallAngle in rads
      var smallAngleInDegs = smallAngle*180/Math.PI;
      var nearestSpecialAngleInRads = 0;
      var angles = [ -150, -135, -120, -90, -60, -45, -30, 0, 30, 45, 60, 90, 120, 135, 150, 180 ];
      var borders = [ -165, -142.5, -127.5, -105, -75, -52.5, -37.5, -15, 15, 37.5, 52.5, 75, 105, 127.5, 142.5, 165 ] ;
      for ( var i = 0; i < angles.length; i++ ){
        if( smallAngleInDegs >= borders[i] && smallAngleInDegs < borders[i + 1] ){
          nearestSpecialAngleInRads = angles[i]*Math.PI/180;
        }
        //Must deal with 180 deg angle as a special case.
        if( smallAngleInDegs >= 165 || smallAngleInDegs < -165 ){
          nearestSpecialAngleInRads = Math.PI;
        }
      }//end for
      return nearestSpecialAngleInRads ;
    },//end getNearestSpecialAngle()

    setNearestSpecialAngle: function( fullAngle ) {   //full angle in radians
      var remainderAngle = fullAngle % ( 2 * Math.PI );
      var fullTurnsAngle = fullAngle - remainderAngle;
      var remainderInDegrees = remainderAngle * 180 / Math.PI;
      //console.log( 'remainderInDegrees = ' + remainderInDegrees );
      var nearestSpecialAngleInDegrees = 0;
      var angles = [ 0, 30, 45, 60, 90, 120, 135, 150, 180, 210, 225, 240, 270, 300, 315, 330, 360 ];
      var borders = [ 15, 37.5, 52.5, 75, 105, 127.5, 142.5, 165, 195, 217.5, 232.5, 255, 285, 307.5, 322.5, 345 ];
      for ( var i = 0; i <= angles.length - 1; i++ ) {
        if ( remainderInDegrees >= borders[ i ] && remainderInDegrees < borders[ i + 1 ] ) {
          nearestSpecialAngleInDegrees = angles[ i + 1 ];// * Math.PI / 180;
        }
        if ( remainderInDegrees <= -borders[ i ] && remainderInDegrees > -borders[ i + 1 ] ) {
          nearestSpecialAngleInDegrees = -angles[ i + 1 ];// * Math.PI / 180;
        }
      }
      //Must handle 0 deg and +/-360 deg angle as special cases.
      if ( remainderInDegrees < 15 && remainderInDegrees >= -15 ) {
        nearestSpecialAngleInDegrees = 0;
      }else if( remainderInDegrees >= 345 ){
        nearestSpecialAngleInDegrees = 360;
      }else if( remainderInDegrees < -345 ){
        nearestSpecialAngleInDegrees = -360;
      }
      var nearestSpecialAngleInRadians = nearestSpecialAngleInDegrees*Math.PI/180;
      var nearestFullAngle = fullTurnsAngle + nearestSpecialAngleInRadians;
      this.setFullAngleInRadians( nearestFullAngle );
    }//end setNearestSpecialAngle
  } );
} );