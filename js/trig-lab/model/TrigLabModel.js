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

  /**
   * @constructor
   *
   */
  function TrigLabModel() {

    PropertySet.call( this, {
      angle: 0,               //@private, total angle in radians, can be greater than 2*pi radians, or less than -2*pi radians
      singularity: false      //@private, indicates singularity in tan function at theta = +/- 90 degrees
    } );
    this.smallAngle = 0;     //@private, smallAngle is between -pi and +pi = angle modulo 2*pi with 180 offset
    this.previousAngle = 0;  //@private, smallAngle in previous step, needed to compute total angle from smallAngle
    this.nbrFullTurns = 0;   //@private, nbr of turns around the unit circle incremented at 180 deg; needed to compute total angle from smallAngle
    this.fullTurnCount = 0;  //@private, nbr of full turns around unit circle, incremented at theta = 0 deg
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
      //Cut off value at =/-1000 or else Safari Browser won't display properly
      var tanValue = Math.tan( this.angle );
      this.singularity = false;
      var returnValue;
      if( tanValue > 1000 ){
         returnValue = 1000;
        this.singularity = true;
      }else if( tanValue < -1000 ){
        returnValue= -1000;
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
      this.fullTurnCount = Math.round( ( angleInRads - remainderAngle )/(2*Math.PI ));
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
      this.halfTurnCount = Math.round( ( angleInRads - remainderAngle )/(Math.PI ));
      this.angle = angleInRads;
    } ,

    setAngle: function ( smallAngle ){    //smallAngle in rads
      this.smallAngle = smallAngle;
      var critAngle = 149*Math.PI/180;
      if( ( this.smallAngle < 0 ) && (this.previousAngle > critAngle) ){
        this.nbrFullTurns += 1;
      }else if ( this.smallAngle > 0 && this.previousAngle < -critAngle ) {
        this.nbrFullTurns -= 1;
      }

      var angleTarget = this.nbrFullTurns*2*Math.PI + this.smallAngle;  //don't want to trigger angle update yet
      var remainderAngle = angleTarget%( 2*Math.PI );
      this.fullTurnCount = Math.round( ( angleTarget - remainderAngle )/(2*Math.PI ));
      remainderAngle = angleTarget%( Math.PI );
      this.halfTurnCount = Math.round( ( angleTarget - remainderAngle )/(Math.PI ));

      this.angle = angleTarget;  //now can trigger angle update
      //console.log( 'Model.setAngle called. angleInDeg = ' + this.getAngleInDegrees() );
      this.previousAngle = smallAngle;
    },
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
    }//end setSpecialAngle()
  } );
} );