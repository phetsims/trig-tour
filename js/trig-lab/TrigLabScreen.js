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
  var TrigLabModel = require( 'TRIG_LAB/trig-lab/model/TrigLabModel' );
  var TrigLabScreenView = require( 'TRIG_LAB/trig-lab/view/TrigLabScreenView' );
  var Util = require( 'TRIG_LAB/trig-lab/common/Util' );

  // strings
  var trigLabSimString = require( 'string!TRIG_LAB/trig-lab.name' );

  //constants
  var BACKGROUND_COLOR = Util.BACKGROUND_COLOR;

  /**
   * @constructor
   */
  function TrigLabScreen() {

    //If this is a single-screen sim, then no icon is necessary.
    //If there are multiple screens, then the icon must be provided here.
    var icon = null;
    console.log( 'background color is ' + BACKGROUND_COLOR );

    Screen.call( this, trigLabSimString, icon,
      function() { return new TrigLabModel(); },
      function( model ) { return new TrigLabScreenView( model ); },
      { backgroundColor: BACKGROUND_COLOR }    //beige '#FFDEAD'
    );
  }

  return inherit( Screen, TrigLabScreen );
} );