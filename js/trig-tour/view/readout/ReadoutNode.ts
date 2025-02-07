// Copyright 2015-2025, University of Colorado Boulder

/**
 * Live readout of angle, and values of sin, cos, tan.
 *
 * @author Michael Dubson (PhET developer) on 6/10/2015.\
 * @author Jesse Greenberg
 */

import PhetFont from '../../../../../scenery-phet/js/PhetFont.js';
import HSeparator from '../../../../../scenery/js/layout/nodes/HSeparator.js';
import VBox from '../../../../../scenery/js/layout/nodes/VBox.js';
import Node from '../../../../../scenery/js/nodes/Node.js';
import Spacer from '../../../../../scenery/js/nodes/Spacer.js';
import Text from '../../../../../scenery/js/nodes/Text.js';
import AquaRadioButtonGroup, { AquaRadioButtonGroupItem } from '../../../../../sun/js/AquaRadioButtonGroup.js';
import trigTour from '../../../trigTour.js';
import TrigTourStrings from '../../../TrigTourStrings.js';
import TrigTourModel from '../../model/TrigTourModel.js';
import TrigTourColors from '../TrigTourColors.js';
import TrigTourDescriber from '../TrigTourDescriber.js';
import ViewProperties, { AngleUnits } from '../ViewProperties.js';
import AngleReadoutRow from './AngleReadoutRow.js';
import CoordinatesRow from './CoordinatesRow.js';
import TrigFunctionRow from './TrigFunctionRow.js';

//strings
const degreesStringProperty = TrigTourStrings.degreesStringProperty;
const radiansStringProperty = TrigTourStrings.radiansStringProperty;

//constants
const DISPLAY_FONT = new PhetFont( 20 );
const TEXT_COLOR = TrigTourColors.TEXT_COLOR;
const SPACING = 10;

class ReadoutNode extends Node {

  /**
   * Constructor for ReadoutNode which displays live values of fullAngle, sin, cos, and tan
   * This node is the content of ValuesAccordionBox.
   *
   * @param model
   * @param viewProperties
   * @param maxPanelWidth - maximum width of content in the ReadoutNode panel in the screen view.
   * @param describer - Describes values for accessibility.
   */
  public constructor( model: TrigTourModel, viewProperties: ViewProperties, maxPanelWidth: number, describer: TrigTourDescriber ) {
    super();

    // create the first two rows
    const row1 = new AngleReadoutRow( model, viewProperties, { maxWidth: maxPanelWidth } );
    const row2 = new CoordinatesRow( model, viewProperties, { maxWidth: maxPanelWidth } );

    // Row 3: trig function label = trig fraction = trig value
    const row3 = new TrigFunctionRow( model, viewProperties, maxPanelWidth );

    // 2 radio buttons for display in degrees or radians, located at bottom of Readout Panel
    const fontInfo = { font: DISPLAY_FONT, fill: TEXT_COLOR, maxWidth: 150 };

    const radioButtonItems: AquaRadioButtonGroupItem<AngleUnits>[] = [
      { value: 'degrees', createNode: () => new Text( degreesStringProperty, fontInfo ) },
      { value: 'radians', createNode: () => new Text( radiansStringProperty, fontInfo ) }
    ];

    const radioButtonGroup = new AquaRadioButtonGroup( viewProperties.angleUnitsProperty, radioButtonItems, {
      radioButtonOptions: {
        radius: 10
      },
      spacing: SPACING,

      // pdom
      accessibleName: TrigTourStrings.a11y.unitsRadioButtons.accessibleNameStringProperty,
      helpText: TrigTourStrings.a11y.unitsRadioButtons.helpTextStringProperty
    } );

    // Layout rows of Readout Panel.
    const readouts = new VBox( {
      children: [
        new Spacer( 0, 5 ),
        row1,
        new Spacer( 0, 15 ),
        row2,
        new Spacer( 0, 8 ),
        row3
      ],

      align: 'left',
      spacing: SPACING,
      resize: false
    } );

    // Entire panel is content of ValuesAccordionBox
    const contentVBox = new VBox( {
      children: [
        readouts,
        new HSeparator(),
        radioButtonGroup
      ],
      align: 'left',
      spacing: SPACING,
      resize: false
    } );

    this.addChild( contentVBox );
  }
}

trigTour.register( 'ReadoutNode', ReadoutNode );

export default ReadoutNode;