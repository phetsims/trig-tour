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
    this.nbrFullTurns = 0;   //@private, nbr of turns around the unit circle; needed to compute angle from smallAngle
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
    getAngleInDegrees: function () {
       return this.angle*180/Math.PI;
    },
    setAngleInDegrees: function( angleInDegrees ){
        this.angle = angleInDegrees*Math.PI/180;
    },
    setAngleInRadians: function( angleInRads ){
      this.angle = angleInRads;
    } ,
    setAngle: function ( smallAngle ){
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
      this.previousAngle = smallAngle;
    }
    
    
  } );
} );