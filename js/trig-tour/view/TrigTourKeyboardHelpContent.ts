// Copyright 2025, University of Colorado Boulder

/**
 * Content for the keyboard help dialog for this sim.
 *
 * @author Jesse Greenberg (PhET Interactive Simulations)
 */

import BasicActionsKeyboardHelpSection from '../../../../scenery-phet/js/keyboard/help/BasicActionsKeyboardHelpSection.js';
import MoveDraggableItemsKeyboardHelpSection from '../../../../scenery-phet/js/keyboard/help/MoveDraggableItemsKeyboardHelpSection.js';
import TwoColumnKeyboardHelpContent from '../../../../scenery-phet/js/keyboard/help/TwoColumnKeyboardHelpContent.js';
import trigTour from '../../trigTour.js';
import trigTourStrings from '../../TrigTourStrings.js';

class TrigTourKeyboardHelpContent extends TwoColumnKeyboardHelpContent {
  public constructor() {

    // general help section
    const basicActionsHelpSection = new BasicActionsKeyboardHelpSection( {
      withCheckboxContent: true
    } );

    const dragHelpSection = new MoveDraggableItemsKeyboardHelpSection( {
      headingStringProperty: trigTourStrings.movePointOnCircleOrGraphStringProperty
    } );

    super( [ dragHelpSection ], [ basicActionsHelpSection ] );
  }
}

trigTour.register( 'TrigTourKeyboardHelpContent', TrigTourKeyboardHelpContent );
export default TrigTourKeyboardHelpContent;