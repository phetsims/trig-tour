// Copyright 2015-2017, University of Colorado Boulder

/**
 *
 * @author Michael Dubson (PhET)
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var Property = require( 'AXON/Property' );
  var Screen = require( 'JOIST/Screen' );
  var trigTour = require( 'TRIG_TOUR/trigTour' );
  var TrigTourColors = require( 'TRIG_TOUR/trig-tour/view/TrigTourColors' );
  var TrigTourModel = require( 'TRIG_TOUR/trig-tour/model/TrigTourModel' );
  var TrigTourScreenView = require( 'TRIG_TOUR/trig-tour/view/TrigTourScreenView' );

  //constants
  var BACKGROUND_COLOR = TrigTourColors.BACKGROUND_COLOR;

  /**
   * @constructor
   */
  function TrigTourScreen() {
    Screen.call( this,
      function() { return new TrigTourModel(); },
      function( model ) { return new TrigTourScreenView( model ); },
      { backgroundColorProperty: new Property( BACKGROUND_COLOR ) }
    );
  }

  trigTour.register( 'TrigTourScreen', TrigTourScreen );
  return inherit( Screen, TrigTourScreen );
} );
