// Copyright 2015-2025, University of Colorado Boulder

/**
 * Live readout of angle, and values of sin, cos, tan.
 *
 * @author Michael Dubson (PhET developer) on 6/10/2015.\
 * @author Jesse Greenberg
 */

import PhetFont from '../../../../../scenery-phet/js/PhetFont.js';
import { HSeparator, Node, Spacer, Text, VBox } from '../../../../../scenery/js/imports.js';
import AquaRadioButtonGroup, { AquaRadioButtonGroupItem } from '../../../../../sun/js/AquaRadioButtonGroup.js';
import trigTour from '../../../trigTour.js';
import TrigTourStrings from '../../../TrigTourStrings.js';
import TrigTourModel from '../../model/TrigTourModel.js';
import TrigTourColors from '../TrigTourColors.js';
import TrigTourDescriber from '../TrigTourDescriber.js';
import ViewProperties, { AngleUnits } from '../ViewProperties.js';
import AngleReadoutRow from './AngleReadoutRow.js';
import CoordinatesRow from './CoordinatesRow.js';
import LabelFractionValueRow from './LabelFractionValueRow.js';

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
    const sinLabelFractionValueRow = new LabelFractionValueRow( 'sin', model, viewProperties );
    const cosLabelFractionValueRow = new LabelFractionValueRow( 'cos', model, viewProperties );
    const tanLabelFractionValueRow = new LabelFractionValueRow( 'tan', model, viewProperties );

    const row3 = new Node( {
      children: [ sinLabelFractionValueRow, cosLabelFractionValueRow, tanLabelFractionValueRow ],
      maxWidth: maxPanelWidth
    } );

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
        new Spacer( 0, 8 ),
        row2,
        new Spacer( 0, 8 ),
        row3
      ],

      // pdom - a paragraph that describes all values
      accessibleParagraph: describer.valuesDescriptionStringProperty,

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

    // Synchronize visibility properties with the view
    viewProperties.graphProperty.link( graph => {
      sinLabelFractionValueRow.visible = ( graph === 'sin' );
      cosLabelFractionValueRow.visible = ( graph === 'cos' );
      tanLabelFractionValueRow.visible = ( graph === 'tan' );
    } );
  }
}

trigTour.register( 'ReadoutNode', ReadoutNode );

export default ReadoutNode;