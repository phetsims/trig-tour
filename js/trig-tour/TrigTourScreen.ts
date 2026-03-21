// Copyright 2015-2026, University of Colorado Boulder

/**
 *
 * @author Michael Dubson (PhET)
 */

import Property from '../../../axon/js/Property.js';
import Screen from '../../../joist/js/Screen.js';
import Tandem from '../../../tandem/js/Tandem.js';
import TrigTourModel from './model/TrigTourModel.js';
import TrigTourColors from './view/TrigTourColors.js';
import TrigTourKeyboardHelpContent from './view/TrigTourKeyboardHelpContent.js';
import TrigTourScreenView from './view/TrigTourScreenView.js';

class TrigTourScreen extends Screen<TrigTourModel, TrigTourScreenView> {
  public constructor() {
    super(
      () => new TrigTourModel(),
      ( model: TrigTourModel ) => new TrigTourScreenView( model ),
      {
        backgroundColorProperty: new Property( TrigTourColors.BACKGROUND_COLOR ),
        createKeyboardHelpNode: () => new TrigTourKeyboardHelpContent(),
        tandem: Tandem.OPT_OUT
      }
    );
  }
}

export default TrigTourScreen;
