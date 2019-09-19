// Copyright 2015-2017, University of Colorado Boulder

/**
 * Main entry point for the sim.
 *
 * @author Michael Dubson (PhET)
 */
define( require => {
  'use strict';

  // modules
  const Sim = require( 'JOIST/Sim' );
  const SimLauncher = require( 'JOIST/SimLauncher' );
  const TrigTourScreen = require( 'TRIG_TOUR/trig-tour/TrigTourScreen' );

  // strings
  const trigTourTitleString = require( 'string!TRIG_TOUR/trig-tour.title' );

  var simOptions = {
    credits: {
      leadDesign: 'Michael Dubson, Amanda McGarry',
      softwareDevelopment: 'Michael Dubson, Jesse Greenberg',
      team: 'Ariel Paul, Kathy Perkins',
      qualityAssurance: 'Steele Dalton, Elise Morgan, Oliver Orejola, Bryan Yoelin'
    }
  };

  SimLauncher.launch( function() {
    var sim = new Sim( trigTourTitleString, [ new TrigTourScreen() ], simOptions );
    sim.start();
  } );
} );