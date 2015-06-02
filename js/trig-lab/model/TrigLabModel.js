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
      angle: 0          //angle in radians
    } );
    //this.angle = 0;     //angle is radians
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
    }
    
    
  } );
} );