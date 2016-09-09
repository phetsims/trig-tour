// Copyright 2015, University of Colorado Boulder

/**
 *
 * @author Michael Dubson (PhET)
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var Screen = require( 'JOIST/Screen' );
  var TrigTourModel = require( 'TRIG_TOUR/trig-tour/model/TrigTourModel' );
  var TrigTourScreenView = require( 'TRIG_TOUR/trig-tour/view/TrigTourScreenView' );
  var TrigTourColors = require( 'TRIG_TOUR/trig-tour/view/TrigTourColors' );
  var trigTour = require( 'TRIG_TOUR/trigTour' );

  //constants
  var BACKGROUND_COLOR = TrigTourColors.BACKGROUND_COLOR;

  /**
   * @constructor
   */
  function TrigTourScreen() {
    Screen.call( this,
      function() { return new TrigTourModel(); },
      function( model ) { return new TrigTourScreenView( model ); },
      { backgroundColor: BACKGROUND_COLOR }
    );
  }

  trigTour.register( 'TrigTourScreen', TrigTourScreen );
  return inherit( Screen, TrigTourScreen );
} );