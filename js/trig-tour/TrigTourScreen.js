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
  var TrigLabModel = require( 'TRIG_TOUR/trig-tour/model/TrigTourModel' );
  var TrigTourScreenView = require( 'TRIG_TOUR/trig-tour/view/TrigTourScreenView' );
  var Util = require( 'TRIG_TOUR/trig-tour/common/Util' );

  // strings
  var trigLabSimString = require( 'string!TRIG_TOUR/trig-tour.name' );

  //constants
  var BACKGROUND_COLOR = Util.BACKGROUND_COLOR;

  /**
   * @constructor
   */
  function TrigTourScreen() {

    //If this is a single-screen sim, no icon is necessary.

    var icon = null;
    console.log( 'background color is ' + BACKGROUND_COLOR );

    Screen.call( this, trigLabSimString, icon,
      function() { return new TrigLabModel(); },
      function( model ) { return new TrigTourScreenView( model ); },
      { backgroundColor: BACKGROUND_COLOR }
    );
  }

  return inherit( Screen, TrigTourScreen );
} );