// Copyright 2015-2024, University of Colorado Boulder

/**
 * Control Panel for Trig Tour sim, on right side of screenView
 *
 * @author Michael Dubson (PhET developer) on 6/4/2015.
 */

import PhetFont from '../../../../scenery-phet/js/PhetFont.js';
import { HBox, HSeparator, Line, Node, Text, TPaint, VBox } from '../../../../scenery/js/imports.js';
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

// By inspection, max width of contents for layout and i18n.
const CONTENT_MAX_WIDTH = 300;

//strings
const cosStringProperty = TrigTourStrings.cosStringProperty;
const gridStringProperty = TrigTourStrings.gridStringProperty;
const labelsStringProperty = TrigTourStrings.labelsStringProperty;
const sinStringProperty = TrigTourStrings.sinStringProperty;
const specialAnglesStringProperty = TrigTourStrings.specialAnglesStringProperty;
const tanStringProperty = TrigTourStrings.tanStringProperty;

class ControlPanel extends Panel {

  // Groups of controls are available to place in the sim traversal order.
  public readonly radioButtonGroup: Node;
  public readonly checkboxGroup: Node;


  /**
   * Constructor for the control panel
   *
   * @param viewProperties
   */
  public constructor( viewProperties: ViewProperties ) {

    // create the text nodes, determining their max width from the panel width and the width of the buttons
    const maxWidth = CONTENT_MAX_WIDTH - 8 * RADIO_BUTTON_RADIUS;
    const fontInfo = { font: DISPLAY_FONT, fill: TEXT_COLOR, maxWidth: maxWidth };
    const labelsText = new Text( labelsStringProperty, fontInfo );
    const gridText = new Text( gridStringProperty, fontInfo );
    const specialAnglesText = new Text( specialAnglesStringProperty, fontInfo );

    // A cluster of 3 radio buttons for displaying either cos, sin or tan
    const radioButtonItems: AquaRadioButtonGroupItem<Graph>[] = [
      { value: 'cos', createNode: () => ControlPanel.createGraphRadioButtonIcon( 'cos', maxWidth ) },
      { value: 'sin', createNode: () => ControlPanel.createGraphRadioButtonIcon( 'sin', maxWidth ) },
      { value: 'tan', createNode: () => ControlPanel.createGraphRadioButtonIcon( 'tan', maxWidth ) }
    ];

    const radioButtonGroup = new AquaRadioButtonGroup( viewProperties.graphProperty, radioButtonItems, {
      radioButtonOptions: {
        radius: RADIO_BUTTON_RADIUS
      },
      spacing: SPACING,

      // pdom
      accessibleName: TrigTourStrings.a11y.graphRadioButtons.accessibleNameStringProperty,
      helpText: TrigTourStrings.a11y.graphRadioButtons.helpTextStringProperty
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

  public static createGraphRadioButtonIcon( graph: Graph, maxTextWidth: number ): Node {
    const fontInfo = { font: DISPLAY_FONT, fill: TEXT_COLOR, maxWidth: maxTextWidth };

    let labelString: string;
    let iconColor: TPaint;

    if ( graph === 'cos' ) {
      labelString = cosStringProperty;
      iconColor = TrigTourColors.COS_COLOR;
    }
    else if ( graph === 'sin' ) {
      labelString = sinStringProperty;
      iconColor = TrigTourColors.SIN_COLOR;
    }
    else {
      labelString = tanStringProperty;
      iconColor = TrigTourColors.TAN_COLOR;
    }

    const labelText = new Text( labelString, fontInfo );
    const iconLine = new Line( 0, 0, 40, 0, { stroke: iconColor, lineWidth: 2 } );

    return new HBox( {
      children: [ labelText, iconLine ],
      spacing: 5
    } );
  }
}

trigTour.register( 'ControlPanel', ControlPanel );
export default ControlPanel;