// Copyright 2002-2015, University of Colorado Boulder

/**
 *
 * @author Michael Dubson (PhET)
 */
define( function( require ) {
  'use strict';

  // modules
  var TrigLabModel = require( 'TRIG_LAB/trig-lab/model/TrigLabModel' );
  var TrigLabScreenView = require( 'TRIG_LAB/trig-lab/view/TrigLabScreenView' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Screen = require( 'JOIST/Screen' );

  // strings
  var trigLabSimString = require( 'string!TRIG_LAB/trig-lab.name' );

  /**
   * @constructor
   */
  function TrigLabScreen() {

    //If this is a single-screen sim, then no icon is necessary.
    //If there are multiple screens, then the icon must be provided here.
    var icon = null;

    Screen.call( this, trigLabSimString, icon,
      function() { return new TrigLabModel(); },
      function( model ) { return new TrigLabScreenView( model ); },
      { backgroundColor: 'white' }
    );
  }

  return inherit( Screen, TrigLabScreen );
} );