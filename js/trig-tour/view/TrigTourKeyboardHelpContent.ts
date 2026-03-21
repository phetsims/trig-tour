// Copyright 2025-2026, University of Colorado Boulder

/**
 * Content for the keyboard help dialog for this sim.
 *
 * @author Jesse Greenberg (PhET Interactive Simulations)
 */

import BasicActionsKeyboardHelpSection from '../../../../scenery-phet/js/keyboard/help/BasicActionsKeyboardHelpSection.js';
import MoveDraggableItemsKeyboardHelpSection from '../../../../scenery-phet/js/keyboard/help/MoveDraggableItemsKeyboardHelpSection.js';
import TwoColumnKeyboardHelpContent from '../../../../scenery-phet/js/keyboard/help/TwoColumnKeyboardHelpContent.js';
import TrigTourStrings from '../../TrigTourStrings.js';

class TrigTourKeyboardHelpContent extends TwoColumnKeyboardHelpContent {
  public constructor() {

    // general help section
    const basicActionsHelpSection = new BasicActionsKeyboardHelpSection( {
      withCheckboxContent: true
    } );

    const dragHelpSection = new MoveDraggableItemsKeyboardHelpSection( {
      headingStringProperty: TrigTourStrings.movePointOnCircleOrGraphStringProperty
    } );

    super( [ dragHelpSection ], [ basicActionsHelpSection ] );
  }
}

export default TrigTourKeyboardHelpContent;
