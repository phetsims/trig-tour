// Copyright 2015-2025, University of Colorado Boulder

/**
 * Control Panel for Trig Tour sim, on right side of screenView
 *
 * @author Michael Dubson (PhET developer) on 6/4/2015.
 */

import { TReadOnlyProperty } from '../../../../axon/js/TReadOnlyProperty.js';
import { combineOptions } from '../../../../phet-core/js/optionize.js';
import PhetFont from '../../../../scenery-phet/js/PhetFont.js';
import HBox from '../../../../scenery/js/layout/nodes/HBox.js';
import HSeparator from '../../../../scenery/js/layout/nodes/HSeparator.js';
import VBox from '../../../../scenery/js/layout/nodes/VBox.js';
import Line from '../../../../scenery/js/nodes/Line.js';
import Node from '../../../../scenery/js/nodes/Node.js';
import Text from '../../../../scenery/js/nodes/Text.js';
import TPaint from '../../../../scenery/js/util/TPaint.js';
import AquaRadioButtonGroup, { AquaRadioButtonGroupItem } from '../../../../sun/js/AquaRadioButtonGroup.js';
import Checkbox, { CheckboxOptions } from '../../../../sun/js/Checkbox.js';
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
    const fontInfo = { font: DISPLAY_FONT, fill: TEXT_COLOR, maxWidth: 132 };
    const labelsText = new Text( labelsStringProperty, fontInfo );
    const gridText = new Text( gridStringProperty, fontInfo );
    const specialAnglesText = new Text( specialAnglesStringProperty, fontInfo );

    // A cluster of 3 radio buttons for displaying either cos, sin or tan
    const radioButtonItems: AquaRadioButtonGroupItem<Graph>[] = [
      { value: 'cos', createNode: () => ControlPanel.createGraphRadioButtonIcon( 'cos' ), options: { accessibleName: TrigTourStrings.a11y.graphRadioButtons.cosButton.accessibleNameStringProperty } },
      { value: 'sin', createNode: () => ControlPanel.createGraphRadioButtonIcon( 'sin' ), options: { accessibleName: TrigTourStrings.a11y.graphRadioButtons.sinButton.accessibleNameStringProperty } },
      { value: 'tan', createNode: () => ControlPanel.createGraphRadioButtonIcon( 'tan' ), options: { accessibleName: TrigTourStrings.a11y.graphRadioButtons.tanButton.accessibleNameStringProperty } }
    ];

    const radioButtonGroup = new AquaRadioButtonGroup( viewProperties.graphProperty, radioButtonItems, {
      radioButtonOptions: {
        radius: RADIO_BUTTON_RADIUS
      },
      spacing: SPACING,

      // pdom
      accessibleName: TrigTourStrings.a11y.graphRadioButtons.accessibleNameStringProperty,
      accessibleHelpText: TrigTourStrings.a11y.graphRadioButtons.accessibleHelpTextStringProperty
    } );

    // 3 checkboxes: Labels, Grid, Special Angles
    const checkboxOptions = { checkboxColorBackground: 'white' };
    const labelsCheckbox = new Checkbox( viewProperties.labelsVisibleProperty, labelsText, combineOptions<CheckboxOptions>( {
      accessibleHelpText: TrigTourStrings.a11y.labelsCheckbox.accessibleHelpTextStringProperty
    }, checkboxOptions ) );
    const gridCheckbox = new Checkbox( viewProperties.gridVisibleProperty, gridText, combineOptions<CheckboxOptions>( {
      accessibleHelpText: TrigTourStrings.a11y.gridCheckbox.accessibleHelpTextStringProperty
    }, checkboxOptions ) );
    const specialAnglesCheckbox = new Checkbox( viewProperties.specialAnglesVisibleProperty, specialAnglesText, combineOptions<CheckboxOptions>( {
      accessibleHelpText: TrigTourStrings.a11y.specialAnglesCheckbox.accessibleHelpTextStringProperty
    }, checkboxOptions ) );

    const checkboxGroup = new VBox( {
      children: [ specialAnglesCheckbox, labelsCheckbox, gridCheckbox ],
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

  public static createGraphRadioButtonIcon( graph: Graph ): Node {
    const fontInfo = { font: DISPLAY_FONT, fill: TEXT_COLOR, maxWidth: 75 };

    let labelStringProperty: TReadOnlyProperty<string>;
    let iconColor: TPaint;

    if ( graph === 'cos' ) {
      labelStringProperty = cosStringProperty;
      iconColor = TrigTourColors.COS_COLOR;
    }
    else if ( graph === 'sin' ) {
      labelStringProperty = sinStringProperty;
      iconColor = TrigTourColors.SIN_COLOR;
    }
    else {
      labelStringProperty = tanStringProperty;
      iconColor = TrigTourColors.TAN_COLOR;
    }

    const labelText = new Text( labelStringProperty, fontInfo );
    const iconLine = new Line( 0, 0, 40, 0, { stroke: iconColor, lineWidth: 2 } );

    return new HBox( {
      children: [ labelText, iconLine ],
      spacing: 5
    } );
  }
}

trigTour.register( 'ControlPanel', ControlPanel );
export default ControlPanel;