// Copyright 2015-2019, University of Colorado Boulder

/**
 * AccordionBox container of ReadoutNode.  ReadoutNode contains all viewable values for the simulation.
 *
 * @author Michael Dubson on 6/10/2015.
 */
define( require => {
  'use strict';

  // modules
  const AccordionBox = require( 'SUN/AccordionBox' );
  const inherit = require( 'PHET_CORE/inherit' );
  const PhetFont = require( 'SCENERY_PHET/PhetFont' );
  const ReadoutNode = require( 'TRIG_TOUR/trig-tour/view/readout/ReadoutNode' );
  const Text = require( 'SCENERY/nodes/Text' );
  const trigTour = require( 'TRIG_TOUR/trigTour' );
  const TrigTourColors = require( 'TRIG_TOUR/trig-tour/view/TrigTourColors' );

  //constants
  const DISPLAY_FONT = new PhetFont( 20 );
  const PANEL_COLOR = TrigTourColors.PANEL_COLOR;
  const BUTTON_X_MARGIN = 12;
  const TITLE_X_SPACING = 10.5;
  const CONTENT_X_MARGIN = 20;
  const CLOSE_BUTTON_WIDTH = 16;

  //strings
  const valuesString = require( 'string!TRIG_TOUR/values' );

  /**
   * Constructor for
   * @param {TrigTourModel} model is the main model of the sim
   * @param {ViewProperties} viewProperties
   * @param {number} maxPanelWidth - max width for the panel, determined by layout of the screen view
   * @constructor
   */
  function ReadoutDisplay( model, viewProperties, maxPanelWidth ) {

    // for i18n, restrict the width of the panel content by the max panel with minus the spacing params
    const maxContentWidth = maxPanelWidth - ( BUTTON_X_MARGIN + TITLE_X_SPACING + CONTENT_X_MARGIN );
    const readoutNode = new ReadoutNode( model, viewProperties, maxContentWidth );

    // dilation for the close button touch/click areas
    const buttonDilation = 30 - CLOSE_BUTTON_WIDTH / 2;

    // Call the super constructor
    AccordionBox.call( this, readoutNode, {
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

  trigTour.register( 'ReadoutDisplay', ReadoutDisplay );
   
  return inherit( AccordionBox, ReadoutDisplay );
} );