// Copyright 2002-2015, University of Colorado Boulder

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

  // strings
  var trigLabSimString = require( 'string!TRIG_TOUR/trig-tour.title' );

  //constants
  var BACKGROUND_COLOR = TrigTourColors.BACKGROUND_COLOR;

  /**
   * @constructor
   */
  function TrigTourScreen() {

    // If this is a single-screen sim, no icon is necessary.
    var icon = null;

    Screen.call( this, trigLabSimString, icon,
      function() { return new TrigTourModel(); },
      function( model ) { return new TrigTourScreenView( model ); },
      { backgroundColor: BACKGROUND_COLOR }
    );
  }

  return inherit( Screen, TrigTourScreen );
} );