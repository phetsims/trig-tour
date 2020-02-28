// Copyright 2015-2020, University of Colorado Boulder

/**
 *
 * @author Michael Dubson (PhET)
 */

import Property from '../../../axon/js/Property.js';
import Screen from '../../../joist/js/Screen.js';
import inherit from '../../../phet-core/js/inherit.js';
import trigTour from '../trigTour.js';
import TrigTourModel from './model/TrigTourModel.js';
import TrigTourColors from './view/TrigTourColors.js';
import TrigTourScreenView from './view/TrigTourScreenView.js';

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
inherit( Screen, TrigTourScreen );
export default TrigTourScreen;