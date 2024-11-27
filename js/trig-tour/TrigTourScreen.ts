// Copyright 2015-2021, University of Colorado Boulder

/**
 *
 * @author Michael Dubson (PhET)
 */

import Property from '../../../axon/js/Property.js';
import Screen from '../../../joist/js/Screen.js';
import trigTour from '../trigTour.js';
import TrigTourModel from './model/TrigTourModel.js';
import TrigTourColors from './view/TrigTourColors.js';
import TrigTourScreenView from './view/TrigTourScreenView.js';

class TrigTourScreen extends Screen {
  constructor() {
    super(
      () => new TrigTourModel(),
      model => new TrigTourScreenView( model ),
      { backgroundColorProperty: new Property( TrigTourColors.BACKGROUND_COLOR ) }
    );
  }
}

trigTour.register( 'TrigTourScreen', TrigTourScreen );
export default TrigTourScreen;