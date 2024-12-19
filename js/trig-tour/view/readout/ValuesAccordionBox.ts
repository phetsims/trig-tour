// Copyright 2020-2024, University of Colorado Boulder

/**
 * AccordionBox container of ReadoutNode.  ReadoutNode contains all viewable values for the simulation.
 *
 * @author Michael Dubson on 6/10/2015.
 */

import { combineOptions } from '../../../../../phet-core/js/optionize.js';
import { Text } from '../../../../../scenery/js/imports.js';
import AccordionBox, { AccordionBoxOptions } from '../../../../../sun/js/AccordionBox.js';
import trigTour from '../../../trigTour.js';
import TrigTourStrings from '../../../TrigTourStrings.js';
import TrigTourModel from '../../model/TrigTourModel.js';
import TrigTourConstants from '../../TrigTourConstants.js';
import ViewProperties from '../ViewProperties.js';
import ReadoutNode from './ReadoutNode.js';

// Found by inspection, maximum width for accordion box content for i18n layout purposes.
const MAX_CONTENT_WIDTH = 220;

//strings
const valuesStringProperty = TrigTourStrings.valuesStringProperty;

class ValuesAccordionBox extends AccordionBox {
  public constructor( model: TrigTourModel, viewProperties: ViewProperties ) {
    const readoutNode = new ReadoutNode( model, viewProperties, MAX_CONTENT_WIDTH );

    // dilation for the close button touch/click areas
    super( readoutNode, combineOptions<AccordionBoxOptions>( {}, {
      titleNode: new Text( valuesStringProperty, {
        font: TrigTourConstants.DISPLAY_FONT,
        fontWeight: TrigTourConstants.ACCORDION_BOX_TITLE_WEIGHT,
        maxWidth: MAX_CONTENT_WIDTH * 3 / 4
      } ),
      contentYMargin: 15,
      contentYSpacing: 8
    }, TrigTourConstants.ACCORDION_BOX_OPTIONS ) );
  }
}

trigTour.register( 'ValuesAccordionBox', ValuesAccordionBox );
export default ValuesAccordionBox;