// Copyright 2015-2024, University of Colorado Boulder

/**
 * Main entry point for the sim.
 *
 * @author Michael Dubson (PhET)
 */

import Sim, { SimOptions } from '../../joist/js/Sim.js';
import simLauncher from '../../joist/js/simLauncher.js';
import TrigTourScreen from './trig-tour/TrigTourScreen.js';
import TrigTourStrings from './TrigTourStrings.js';

const trigTourTitleStringProperty = TrigTourStrings[ 'trig-tour' ].titleStringProperty;

const simOptions: SimOptions = {
  credits: {
    leadDesign: 'Michael Dubson, Amanda McGarry',
    softwareDevelopment: 'Michael Dubson, Jesse Greenberg',
    team: 'Ariel Paul, Kathy Perkins',
    qualityAssurance: 'Steele Dalton, Matthew Moore, Elise Morgan,  Ashton Morris, Oliver Orejola, Nancy Salpepi, Kathryn Woessner, Bryan Yoelin'
  }
};

simLauncher.launch( () => {
  const sim = new Sim( trigTourTitleStringProperty, [ new TrigTourScreen() ], simOptions );
  sim.start();
} );