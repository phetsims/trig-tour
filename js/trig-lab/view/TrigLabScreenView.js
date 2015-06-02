// Copyright 2002-2015, University of Colorado Boulder

/**
 *
 * @author Michael Dubson (PhET)
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var ScreenView = require( 'JOIST/ScreenView' );
  var ResetAllButton = require( 'SCENERY_PHET/buttons/ResetAllButton' );

  /**
   * @param {TrigLabModel} trigLabModel
   * @constructor
   */
  function TrigLabScreenView( trigLabModel ) {

    ScreenView.call( this );

    // Create and add the Reset All Button in the bottom right, which resets the model
    var resetAllButton = new ResetAllButton( {
      listener: function() {
        trigLabModel.reset();
      },
      right:  this.layoutBounds.maxX - 10,
      bottom: this.layoutBounds.maxY - 10
    } );
    this.addChild( resetAllButton );
    //Test Code follows
    trigLabModel.setAngleInDegrees( 45 );
    console.log( 'trigLabModel.angle is ' + trigLabModel.angle );
    console.log( 'angle in degrees is ' + trigLabModel.getAngleInDegrees());
      console.log( ' cos of ' + trigLabModel.getAngleInDegrees() + ' is ' + trigLabModel.cos() );

  }

  return inherit( ScreenView, TrigLabScreenView, {


  } );
} );