// Copyright 2015-2020, University of Colorado Boulder

/**
 * Control Panel for Trig Tour sim, on right side of screenView
 *
 * @author Michael Dubson (PhET developer) on 6/4/2015.
 */

import merge from '../../../../phet-core/js/merge.js';
import PhetFont from '../../../../scenery-phet/js/PhetFont.js';
import Text from '../../../../scenery/js/nodes/Text.js';
import VBox from '../../../../scenery/js/nodes/VBox.js';
import AquaRadioButton from '../../../../sun/js/AquaRadioButton.js';
import Checkbox from '../../../../sun/js/Checkbox.js';
import HSeparator from '../../../../sun/js/HSeparator.js';
import Panel from '../../../../sun/js/Panel.js';
import trigTour from '../../trigTour.js';
import trigTourStrings from '../../trigTourStrings.js';
import TrigTourColors from './TrigTourColors.js';

// constants
const DISPLAY_FONT = new PhetFont( 20 );
const TEXT_COLOR = TrigTourColors.TEXT_COLOR;
const PANEL_COLOR = TrigTourColors.PANEL_COLOR;
const RADIO_BUTTON_RADIUS = 10;

//strings
const cosString = trigTourStrings.cos;
const gridString = trigTourStrings.grid;
const labelsString = trigTourStrings.labels;
const sinString = trigTourStrings.sin;
const specialAnglesString = trigTourStrings.specialAngles;
const tanString = trigTourStrings.tan;

class ControlPanel extends Panel {

  /**
   * Constructor for the control panel
   *
   * @param {ViewProperties} viewProperties
   * @param {number} maxPanelWidth - The maximum width of this panel, calculated in the screenView
   * @param {Object} [options]
   */
  constructor( viewProperties, maxPanelWidth, options ) {

    options = merge( {
      xMargin: 15,
      yMargin: 15,
      lineWidth: 1,
      fill: PANEL_COLOR,
      resize: false
    }, options );

    // create the text nodes, determining their max width from the panel width and the width of the buttons
    const maxWidth = maxPanelWidth - 4 * RADIO_BUTTON_RADIUS;
    const fontInfo = { font: DISPLAY_FONT, fill: TEXT_COLOR, maxWidth: maxWidth };
    const cosText = new Text( cosString, fontInfo );
    const sinText = new Text( sinString, fontInfo );
    const tanText = new Text( tanString, fontInfo );
    const labelsText = new Text( labelsString, fontInfo );
    const gridText = new Text( gridString, fontInfo );
    const specialAnglesText = new Text( specialAnglesString, fontInfo );

    // A cluster of 3 radio buttons for displaying either cos, sin or tan
    // viewProperties.graph = 'cos'|'sin'|'tan'
    const radioButtonOptions = { radius: RADIO_BUTTON_RADIUS, fontSize: 15, deselectedColor: 'white' };
    const cosRadioButton = new AquaRadioButton( viewProperties.graphProperty, 'cos', cosText, radioButtonOptions );
    const sinRadioButton = new AquaRadioButton( viewProperties.graphProperty, 'sin', sinText, radioButtonOptions );
    const tanRadioButton = new AquaRadioButton( viewProperties.graphProperty, 'tan', tanText, radioButtonOptions );

    // 3 checkboxes: Labels, Grid, Special Angles
    const checkboxOptions = { checkboxColorBackground: 'white' };
    const labelsCheckbox = new Checkbox( labelsText, viewProperties.labelsVisibleProperty, checkboxOptions );
    const gridCheckbox = new Checkbox( gridText, viewProperties.gridVisibleProperty, checkboxOptions );
    const specialAnglesCheckbox = new Checkbox(
      specialAnglesText,
      viewProperties.specialAnglesVisibleProperty,
      checkboxOptions
    );

    // Adjust touch areas
    const spacing = 15;
    const separatorWidth = specialAnglesCheckbox.width + 10;
    const content = new VBox( {
      children: [
        cosRadioButton,
        sinRadioButton,
        tanRadioButton,
        new HSeparator( separatorWidth ),
        specialAnglesCheckbox,
        labelsCheckbox,
        gridCheckbox
      ],
      align: 'left',
      spacing: spacing,
      resize: false
    } );

    super( content, options );
  }
}

trigTour.register( 'ControlPanel', ControlPanel );
export default ControlPanel;