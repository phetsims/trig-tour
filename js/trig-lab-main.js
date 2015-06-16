// Copyright 2002-2015, University of Colorado Boulder

/**
 * Main entry point for the sim.
 *
 * @author Michael Dubson (PhET)
 */
define( function( require ) {
  'use strict';

  // modules
  var TrigLabScreen = require( 'TRIG_LAB/trig-lab/TrigLabScreen' );
  var Sim = require( 'JOIST/Sim' );
  var SimLauncher = require( 'JOIST/SimLauncher' );

  // strings
  var simTitle = require( 'string!TRIG_LAB/trig-lab.name' );

  var simOptions = {
    credits: {
      //TODO fill in proper credits, all of these fields are optional, see joist.AboutDialog
      leadDesign: 'Amanda McGarry and Michael Dubson',
      softwareDevelopment: 'Michael Dubson',
      team: 'Michael Dubson, Amanda McGarry',
      //qualityAssurance: '',
      //graphicArts: '',
      //thanks: ''
    }
  };

  // Appending '?dev' to the URL will enable developer-only features.
  if ( phet.chipper.getQueryParameter( 'dev' ) ) {
    simOptions = _.extend( {
      // add dev-specific options here
    }, simOptions );
  }

  SimLauncher.launch( function() {
    var sim = new Sim( simTitle, [ new TrigLabScreen() ], simOptions );
    sim.start();
  } );
} );