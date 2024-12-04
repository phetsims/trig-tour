// Copyright 2015-2024, University of Colorado Boulder

/**
 * Control Panel for Trig Tour sim, on right side of screenView
 *
 * @author Michael Dubson (PhET developer) on 6/4/2015.
 */

import PhetFont from '../../../../scenery-phet/js/PhetFont.js';
import { HSeparator, Node, Text, VBox } from '../../../../scenery/js/imports.js';
import AquaRadioButtonGroup, { AquaRadioButtonGroupItem } from '../../../../sun/js/AquaRadioButtonGroup.js';
import Checkbox from '../../../../sun/js/Checkbox.js';
import Panel from '../../../../sun/js/Panel.js';
import trigTour from '../../trigTour.js';
import TrigTourStrings from '../../TrigTourStrings.js';
import TrigTourColors from './TrigTourColors.js';
import ViewProperties, { Graph } from './ViewProperties.js';

// constants
const DISPLAY_FONT = new PhetFont( 20 );
const TEXT_COLOR = TrigTourColors.TEXT_COLOR;
const PANEL_COLOR = TrigTourColors.PANEL_COLOR;
const RADIO_BUTTON_RADIUS = 10;
const SPACING = 15;

//strings
const cosString = TrigTourStrings.cos;
const gridString = TrigTourStrings.grid;
const labelsString = TrigTourStrings.labels;
const sinString = TrigTourStrings.sin;
const specialAnglesString = TrigTourStrings.specialAngles;
const tanString = TrigTourStrings.tan;

class ControlPanel extends Panel {

  // Groups of controls are available to place in the sim traversal order.
  public readonly radioButtonGroup: Node;
  public readonly checkboxGroup: Node;


  /**
   * Constructor for the control panel
   *
   * @param viewProperties
   * @param maxPanelWidth - The maximum width of this panel, calculated in the screenView
   */
  public constructor( viewProperties: ViewProperties, maxPanelWidth: number ) {

    // create the text nodes, determining their max width from the panel width and the width of the buttons
    const maxWidth = maxPanelWidth - 4 * RADIO_BUTTON_RADIUS;
    const fontInfo = { font: DISPLAY_FONT, fill: TEXT_COLOR, maxWidth: maxWidth };
    const labelsText = new Text( labelsString, fontInfo );
    const gridText = new Text( gridString, fontInfo );
    const specialAnglesText = new Text( specialAnglesString, fontInfo );

    // A cluster of 3 radio buttons for displaying either cos, sin or tan
    const radioButtonItems: AquaRadioButtonGroupItem<Graph>[] = [
      { value: 'cos', createNode: () => new Text( cosString, fontInfo ) },
      { value: 'sin', createNode: () => new Text( sinString, fontInfo ) },
      { value: 'tan', createNode: () => new Text( tanString, fontInfo ) }
    ];

    const radioButtonGroup = new AquaRadioButtonGroup( viewProperties.graphProperty, radioButtonItems, {
      radioButtonOptions: {
        radius: RADIO_BUTTON_RADIUS
      },
      spacing: SPACING
    } );

    // 3 checkboxes: Labels, Grid, Special Angles
    const checkboxOptions = { checkboxColorBackground: 'white' };
    const labelsCheckbox = new Checkbox( viewProperties.labelsVisibleProperty, labelsText, checkboxOptions );
    const gridCheckbox = new Checkbox( viewProperties.gridVisibleProperty, gridText, checkboxOptions );
    const specialAnglesCheckbox = new Checkbox( viewProperties.specialAnglesVisibleProperty, specialAnglesText, checkboxOptions );

    const checkboxGroup = new VBox( {
      children: [ labelsCheckbox, gridCheckbox, specialAnglesCheckbox ],
      align: 'left',
      spacing: SPACING
    } );

    const content = new VBox( {
      children: [
        radioButtonGroup,
        new HSeparator(),
        checkboxGroup
      ],
      align: 'left',
      spacing: SPACING,
      resize: false
    } );

    super( content, {
      xMargin: 15,
      yMargin: 15,
      lineWidth: 1,
      fill: PANEL_COLOR,
      resize: false
    } );

    this.radioButtonGroup = radioButtonGroup;
    this.checkboxGroup = checkboxGroup;
  }
}

trigTour.register( 'ControlPanel', ControlPanel );
export default ControlPanel;