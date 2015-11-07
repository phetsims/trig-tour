// Copyright 2015, University of Colorado Boulder

/**
 * Main entry point for the sim.
 *
 * @author Michael Dubson (PhET)
 */
define( function( require ) {
  'use strict';

  // modules
  var TrigTourScreen = require( 'TRIG_TOUR/trig-tour/TrigTourScreen' );
  var Sim = require( 'JOIST/Sim' );
  var SimLauncher = require( 'JOIST/SimLauncher' );

  // strings
  var trigTourTitleString = require( 'string!TRIG_TOUR/trig-tour.title' );

  var simOptions = {
    credits: {
      leadDesign: 'Michael Dubson, Amanda McGarry',
      softwareDevelopment: 'Michael Dubson',
      team: 'Ariel Paul, Kathy Perkins',
      qualityAssurance: 'Steele Dalton, Elise Morgan, Oliver Orejola, Bryan Yoelin'
    }
  };

  // Appending '?dev' to the URL will enable developer-only features.
  if ( phet.chipper.getQueryParameter( 'dev' ) ) {
    simOptions = _.extend( {
      // add dev-specific options here
    }, simOptions );
  }

  SimLauncher.launch( function() {
    var sim = new Sim( trigTourTitleString, [ new TrigTourScreen() ], simOptions );
    sim.start();
  } );
} );