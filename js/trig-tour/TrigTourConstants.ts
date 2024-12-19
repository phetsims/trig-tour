// Copyright 2024, University of Colorado Boulder

/**
 * Constants for the Trig Tour simulation.
 *
 * @author Jesse Greenberg (PhET Interactive Simulations)
 */

import Utils from '../../../dot/js/Utils.js';
import PhetFont from '../../../scenery-phet/js/PhetFont.js';
import { AccordionBoxOptions } from '../../../sun/js/AccordionBox.js';
import TrigTourColors from './view/TrigTourColors.js';

const ACCORDION_BOX_BUTTON_X_MARGIN = 12;
const ACCORDION_BOX_TITLE_X_SPACING = 10.5;
const ACCORDION_BOX_CONTENT_X_MARGIN = 20;
const ACCORDION_BOX_CLOSE_BUTTON_WIDTH = 16;
const ACCORDION_BOX_CLOSE_BUTTON_Y_MARGIN = 12;
const ACCORDION_BOX_CORNER_RADIUS = 10;
const ACCORDION_BOX_LINE_WIDTH = 1;
const ACCORDION_BOX_BUTTON_DILATION = ACCORDION_BOX_CLOSE_BUTTON_WIDTH / 2;

const TrigTourConstants = {
  KEYBOARD_DRAG_LISTENER_OPTIONS: {
    moveOnHoldInterval: 75,
    dragDelta: Utils.toRadians( 5 ),
    shiftDragDelta: Utils.toRadians( 0.5 )
  },

  // A larger delta in radians to apply when special angles are visible so that
  // we always move to the next special angle.
  SPECIAL_ANGLE_DELTA: Utils.toRadians( 20 ),

  ACCORDION_BOX_OPTIONS: {
    fill: TrigTourColors.PANEL_COLOR,
    buttonXMargin: ACCORDION_BOX_BUTTON_X_MARGIN,
    titleXSpacing: ACCORDION_BOX_TITLE_X_SPACING,
    contentXMargin: ACCORDION_BOX_CONTENT_X_MARGIN,
    titleAlignX: 'left',
    expandCollapseButtonOptions: {
      sideLength: ACCORDION_BOX_CLOSE_BUTTON_WIDTH,
      touchAreaXDilation: ACCORDION_BOX_BUTTON_DILATION,
      touchAreaYDilation: ACCORDION_BOX_BUTTON_DILATION,
      mouseAreaXDilation: ACCORDION_BOX_BUTTON_DILATION,
      mouseAreaYDilation: ACCORDION_BOX_BUTTON_DILATION
    },
    buttonYMargin: ACCORDION_BOX_CLOSE_BUTTON_Y_MARGIN,
    cornerRadius: ACCORDION_BOX_CORNER_RADIUS,
    lineWidth: ACCORDION_BOX_LINE_WIDTH
  } as AccordionBoxOptions,

  DISPLAY_FONT: new PhetFont( 20 ),
  ITALIC_DISPLAY_FONT: new PhetFont( { size: 20, style: 'italic' } ),
  ACCORDION_BOX_TITLE_WEIGHT: 'bold',

  // Number of full wavelengths displayed in the graph.
  // Must be even to keep graph symmetric.
  GRAPH_NUMBER_OF_WAVELENGTHS: 2 * 2
};

export default TrigTourConstants;