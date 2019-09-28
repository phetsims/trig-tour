// Copyright 2015-2019, University of Colorado Boulder

/**
 * Live readout of angle, and values of sin, cos, tan.
 *
 * @author Michael Dubson (PhET developer) on 6/10/2015.\
 * @author Jesse Greenberg
 */
define( require => {
  'use strict';

  // modules
  const AngleReadoutRow = require( 'TRIG_TOUR/trig-tour/view/readout/AngleReadoutRow' );
  const AquaRadioButton = require( 'SUN/AquaRadioButton' );
  const CoordinatesRow = require( 'TRIG_TOUR/trig-tour/view/readout/CoordinatesRow' );
  const HSeparator = require( 'SUN/HSeparator' );
  const inherit = require( 'PHET_CORE/inherit' );
  const LabelFractionValueRow = require( 'TRIG_TOUR/trig-tour/view/readout/LabelFractionValueRow' );
  const Node = require( 'SCENERY/nodes/Node' );
  const PhetFont = require( 'SCENERY_PHET/PhetFont' );
  const Text = require( 'SCENERY/nodes/Text' );
  const trigTour = require( 'TRIG_TOUR/trigTour' );
  const TrigTourColors = require( 'TRIG_TOUR/trig-tour/view/TrigTourColors' );
  const VBox = require( 'SCENERY/nodes/VBox' );
  const VSeparator = require( 'SUN/VSeparator' );

  //strings
  const degreesString = require( 'string!TRIG_TOUR/degrees' );
  const radiansString = require( 'string!TRIG_TOUR/radians' );

  //constants
  const DISPLAY_FONT = new PhetFont( 20 );
  const TEXT_COLOR = TrigTourColors.TEXT_COLOR;
  const PANEL_COLOR = TrigTourColors.PANEL_COLOR;

  /**
   * Constructor for ReadoutNode which displays live values of fullAngle, sin, cos, and tan
   * This node is the content of AccordionBox ReadoutDisplay
   *
   * @param {TrigTourModel} model is the main model of the sim
   * @param {ViewProperties} viewProperties
   * @param {number} maxPanelWidth - maximum width of content in the ReadoutNode panel in the screen view.
   * @constructor
   */
  function ReadoutNode( model, viewProperties, maxPanelWidth ) {

    const self = this;

    // Call the super constructor
    Node.call( self );

    // create the first two rows
    const row1 = new CoordinatesRow( model, viewProperties, { maxWidth: maxPanelWidth } );
    const row2 = new AngleReadoutRow( model, viewProperties, { maxWidth: maxPanelWidth } );

    // Row 3: trig function label = trig fraction = trig value
    const sinLabelFractionValueRow = new LabelFractionValueRow( 'sin', model, viewProperties );
    const cosLabelFractionValueRow = new LabelFractionValueRow( 'cos', model, viewProperties );
    const tanLabelFractionValueRow = new LabelFractionValueRow( 'tan', model, viewProperties );

    const row3 = new Node( {
      children: [ sinLabelFractionValueRow, cosLabelFractionValueRow, tanLabelFractionValueRow ],
      maxWidth: maxPanelWidth
    } );

    // 2 radio buttons for display in degrees or radians, located at bottom of Readout Panel
    const fontInfo = { font: DISPLAY_FONT, fill: TEXT_COLOR };
    const myRadioButtonOptions = { radius: 10, fontSize: 15, deselectedColor: 'white', maxWidth: maxPanelWidth };
    const degreeText = new Text( degreesString, fontInfo );
    const radiansText = new Text( radiansString, fontInfo );
    const degreesRadioButton = new AquaRadioButton(
      viewProperties.angleUnitsProperty,
      'degrees',
      degreeText,
      myRadioButtonOptions
    );
    const radiansRadioButton = new AquaRadioButton(
      viewProperties.angleUnitsProperty,
      'radians',
      radiansText,
      myRadioButtonOptions
    );

    // Layout rows of Readout Panel. Entire panel is content of ReadoutDisplay AccordionBox
    const spacing = 10;
    const rowSpacing = 5;
    const separatorOptions = { lineWidth: 0, stroke: PANEL_COLOR };
    const contentVBox = new VBox( {
      children: [
        new VSeparator( rowSpacing, separatorOptions ),
        row1,
        new VSeparator( rowSpacing + 5, separatorOptions ),
        row2,
        new VSeparator( rowSpacing, separatorOptions ),
        row3,
        new HSeparator( 180 ),
        degreesRadioButton,
        radiansRadioButton
      ],
      align: 'left',
      spacing: spacing,
      resize: false
    } );

    self.addChild( contentVBox );

    // Synchronize visibility properties with the view
    viewProperties.graphProperty.link( function( graph ) {
      sinLabelFractionValueRow.visible = ( graph === 'sin' );
      cosLabelFractionValueRow.visible = ( graph === 'cos' );
      tanLabelFractionValueRow.visible = ( graph === 'tan' );
    } );
  }

  trigTour.register( 'ReadoutNode', ReadoutNode );

  return inherit( Node, ReadoutNode );
} );