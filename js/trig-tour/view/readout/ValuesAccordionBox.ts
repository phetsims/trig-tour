// Copyright 2020-2024, University of Colorado Boulder

/**
 * AccordionBox container of ReadoutNode.  ReadoutNode contains all viewable values for the simulation.
 *
 * @author Michael Dubson on 6/10/2015.
 */

import PhetFont from '../../../../../scenery-phet/js/PhetFont.js';
import { Text } from '../../../../../scenery/js/imports.js';
import AccordionBox from '../../../../../sun/js/AccordionBox.js';
import trigTour from '../../../trigTour.js';
import TrigTourStrings from '../../../TrigTourStrings.js';
import TrigTourModel from '../../model/TrigTourModel.js';
import TrigTourColors from '../TrigTourColors.js';
import ViewProperties from '../ViewProperties.js';
import ReadoutNode from './ReadoutNode.js';

//constants
const DISPLAY_FONT = new PhetFont( 20 );
const PANEL_COLOR = TrigTourColors.PANEL_COLOR;
const BUTTON_X_MARGIN = 12;
const TITLE_X_SPACING = 10.5;
const CONTENT_X_MARGIN = 20;
const CLOSE_BUTTON_WIDTH = 16;

// Found by inspection, maximum width for accordion box content for i18n layout purposes.
const MAX_CONTENT_WIDTH = 220;

//strings
const valuesStringProperty = TrigTourStrings.valuesStringProperty;

class ValuesAccordionBox extends AccordionBox {
  public constructor( model: TrigTourModel, viewProperties: ViewProperties ) {
    const readoutNode = new ReadoutNode( model, viewProperties, MAX_CONTENT_WIDTH );

    // dilation for the close button touch/click areas
    const buttonDilation = 30 - CLOSE_BUTTON_WIDTH / 2;

    super( readoutNode, {
      lineWidth: 1,
      cornerRadius: 10,
      buttonXMargin: BUTTON_X_MARGIN, // horizontal space between button and left|right edge of box
      buttonYMargin: 12,
      titleNode: new Text( valuesStringProperty, { font: DISPLAY_FONT, fontWeight: 'bold', maxWidth: MAX_CONTENT_WIDTH * 3 / 4 } ),
      titleXSpacing: TITLE_X_SPACING,
      titleAlignX: 'left',
      fill: PANEL_COLOR,
      showTitleWhenExpanded: true,
      contentXMargin: CONTENT_X_MARGIN,
      contentYMargin: 15,
      contentYSpacing: 8,
      expandCollapseButtonOptions: {
        touchAreaXDilation: buttonDilation,
        touchAreaYDilation: buttonDilation,
        mouseAreaXDilation: buttonDilation,
        mouseAreaYDilation: buttonDilation
      }
    } );
  }
}

trigTour.register( 'ValuesAccordionBox', ValuesAccordionBox );
export default ValuesAccordionBox;