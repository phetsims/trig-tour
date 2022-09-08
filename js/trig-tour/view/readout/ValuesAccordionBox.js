// Copyright 2020-2022, University of Colorado Boulder

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
import TrigTourColors from '../TrigTourColors.js';
import ReadoutNode from './ReadoutNode.js';

//constants
const DISPLAY_FONT = new PhetFont( 20 );
const PANEL_COLOR = TrigTourColors.PANEL_COLOR;
const BUTTON_X_MARGIN = 12;
const TITLE_X_SPACING = 10.5;
const CONTENT_X_MARGIN = 20;
const CLOSE_BUTTON_WIDTH = 16;

//strings
const valuesString = TrigTourStrings.values;

class ValuesAccordionBox extends AccordionBox {

  /**
   * @param {TrigTourModel} model is the main model of the sim
   * @param {ViewProperties} viewProperties
   * @param {number} maxPanelWidth - max width for the panel, determined by layout of the screen view
   */
  constructor( model, viewProperties, maxPanelWidth ) {

    // for i18n, restrict the width of the panel content by the max panel with minus the spacing params
    const maxContentWidth = maxPanelWidth - ( BUTTON_X_MARGIN + TITLE_X_SPACING + CONTENT_X_MARGIN );
    const readoutNode = new ReadoutNode( model, viewProperties, maxContentWidth );

    // dilation for the close button touch/click areas
    const buttonDilation = 30 - CLOSE_BUTTON_WIDTH / 2;

    super( readoutNode, {
      lineWidth: 1,
      cornerRadius: 10,
      buttonXMargin: BUTTON_X_MARGIN, // horizontal space between button and left|right edge of box
      buttonYMargin: 12,
      titleNode: new Text( valuesString, { font: DISPLAY_FONT, fontWeight: 'bold', maxWidth: maxContentWidth } ),
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