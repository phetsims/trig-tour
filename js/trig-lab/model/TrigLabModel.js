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
      angle: 0               //@private, total angle in radians, can be greater than 2*pi radians, or less than -2*pi radians
    } );
    this.smallAngle = 0;     //@private, smallAngle is between -pi and +pi = angle modulo 2*pi
    this.previousAngle = 0;  //@private, needed to compute angle from smallAngle
    this.nbrFullTurns = 0;   //@private, nbr of turns around the unit circle incremented at 180 deg; needed to compute angle from smallAngle
    this.fullTurnCount = 0;  //@private, nbr of full turns around unit circle, incremented at theta = 0 deg
    this.specialAnglesMode = false;  //{boolean} true if special angles (0, 30,45, 60, 90...) only
  }

  return inherit( PropertySet, TrigLabModel, {
    cos: function () {
      return Math.cos( this.angle );
    },
    sin: function () {
      return Math.sin( this.angle );
    },
    tan: function () {
      return Math.tan( this.angle );
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
    //small angle (0 to 360) in degrees is 0 to +360
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
    setAngleInDegrees: function( angleInDegrees ){
        this.angle = angleInDegrees*Math.PI/180;
    },
    setAngleInRadians: function( angleInRads ){
      this.angle = angleInRads;
    } ,
    setAngle: function ( smallAngle ){    //smallAngle in rads
      //console.log('TrigLabModel.setAngle() called.');
      this.smallAngle = smallAngle;
      if( this.smallAngle < 0  && this.previousAngle > 2.60 ){
        this.nbrFullTurns += 1;
        //console.log( 'nbrFullTurns = ' + this.nbrFullTurns );
      } else if ( this.smallAngle > 0 && this.previousAngle < -2.60) {
        this.nbrFullTurns -= 1;
        //console.log( 'nbrFullTurns = ' + this.nbrFullTurns );
      }
      this.angle = this.nbrFullTurns*2*Math.PI + this.smallAngle;
      if( (this.smallAngle >= 0 && this.previousAngle < 0 )||( this.smallAngle <= 0 && this.previousAngle > 0 )){
        var remainderAngle = this.angle%( 2*Math.PI );
        this.fullTurnCount = Math.round( ( this.angle - remainderAngle )/(2*Math.PI ));
        console.log( 'this.fullTurnCount = ' + this.fullTurnCount );
      }
      this.previousAngle = smallAngle;
    },
    //takes any small angle in rads and sets current angle to nearest special angle in rads
    setSpecialAngle: function ( smallAngle ){   //smallAngle in rads
      var smallAngleInDegs = smallAngle*180/Math.PI;
      var nearestSpecialAngleInRads = 0;
      var angles = [-150, -135, -120, -90, -60, -45, -30, 0, 30, 45, 60, 90, 120, 135, 150, 180 ];
      var borders = [-165, -142.5, -127.5, -105, -75, -52.5, -37.5, -15, 15, 37.5, 52.5, 75, 105, 127.5, 142.5, 165 ] ;
      for ( var i = 0; i < angles.length; i++ ){
        if( smallAngleInDegs > borders[i] && smallAngleInDegs < borders[i + 1] ){
          nearestSpecialAngleInRads = angles[i]*Math.PI/180;
        }
        //Must deal with 180 deg angle as a special case.
        if( smallAngleInDegs > 165 || smallAngleInDegs < -165 ){
          nearestSpecialAngleInRads = Math.PI;
        }
      }//end for
      this.setAngle( nearestSpecialAngleInRads );
    }//end setSpecialAngle()
    
    
  } );
} );