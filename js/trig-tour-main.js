// Copyright 2015-2020, University of Colorado Boulder

/**
 * Main entry point for the sim.
 *
 * @author Michael Dubson (PhET)
 */

import Sim from '../../joist/js/Sim.js';
import SimLauncher from '../../joist/js/SimLauncher.js';
import trigTourStrings from './trig-tour-strings.js';
import TrigTourScreen from './trig-tour/TrigTourScreen.js';

const trigTourTitleString = trigTourStrings[ 'trig-tour' ].title;

const simOptions = {
  credits: {
    leadDesign: 'Michael Dubson, Amanda McGarry',
    softwareDevelopment: 'Michael Dubson, Jesse Greenberg',
    team: 'Ariel Paul, Kathy Perkins',
    qualityAssurance: 'Steele Dalton, Elise Morgan, Oliver Orejola, Bryan Yoelin'
  }
};

SimLauncher.launch( function() {
  const sim = new Sim( trigTourTitleString, [ new TrigTourScreen() ], simOptions );
  sim.start();
} );