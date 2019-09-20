// Copyright 2015-2019, University of Colorado Boulder

/**
 *
 * @author Michael Dubson (PhET)
 */
define( require => {
  'use strict';

  // modules
  const inherit = require( 'PHET_CORE/inherit' );
  const Property = require( 'AXON/Property' );
  const Screen = require( 'JOIST/Screen' );
  const trigTour = require( 'TRIG_TOUR/trigTour' );
  const TrigTourColors = require( 'TRIG_TOUR/trig-tour/view/TrigTourColors' );
  const TrigTourModel = require( 'TRIG_TOUR/trig-tour/model/TrigTourModel' );
  const TrigTourScreenView = require( 'TRIG_TOUR/trig-tour/view/TrigTourScreenView' );

  //constants
  const BACKGROUND_COLOR = TrigTourColors.BACKGROUND_COLOR;

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
