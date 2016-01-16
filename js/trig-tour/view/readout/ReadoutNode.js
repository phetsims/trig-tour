// Copyright 2015, University of Colorado Boulder

/**
 * Live readout of angle, and values of sin, cos, tan.
 *
 * @author Michael Dubson (PhET developer) on 6/10/2015.\
 * @author Jesse Greenberg
 */
define( function( require ) {
  'use strict';

  // modules
  var AquaRadioButton = require( 'SUN/AquaRadioButton' );
  var LabelFractionValueRow = require( 'TRIG_TOUR/trig-tour/view/readout/LabelFractionValueRow' );
  var CoordinatesRow = require( 'TRIG_TOUR/trig-tour/view/readout/CoordinatesRow' );
  var AngleReadoutRow = require( 'TRIG_TOUR/trig-tour/view/readout/AngleReadoutRow' );
  var HSeparator = require( 'SUN/HSeparator' );
  var VSeparator = require( 'SUN/VSeparator' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Node = require( 'SCENERY/nodes/Node' );
  var PhetFont = require( 'SCENERY_PHET/PhetFont' );
  var Text = require( 'SCENERY/nodes/Text' );
  var TrigTourColors = require( 'TRIG_TOUR/trig-tour/view/TrigTourColors' );
  var VBox = require( 'SCENERY/nodes/VBox' );

  //strings
  var degreesString = require( 'string!TRIG_TOUR/degrees' );
  var radiansString = require( 'string!TRIG_TOUR/radians' );

  //constants
  var DISPLAY_FONT = new PhetFont( 20 );
  var TEXT_COLOR = TrigTourColors.TEXT_COLOR;

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

    var thisReadoutNode = this;

    // Call the super constructor
    Node.call( thisReadoutNode );

    // create the first two rows
    var row1 = new CoordinatesRow( model, viewProperties, { maxWidth: maxPanelWidth } );
    var row2 = new AngleReadoutRow( model, viewProperties, { maxWidth: maxPanelWidth } );

    // Row 3: trig function label = trig fraction = trig value
    var sinLabelFractionValueRow = new LabelFractionValueRow( 'sin', model, viewProperties );
    var cosLabelFractionValueRow = new LabelFractionValueRow( 'cos', model, viewProperties );
    var tanLabelFractionValueRow = new LabelFractionValueRow( 'tan', model, viewProperties );

    var row3 = new Node( { 
      children: [ sinLabelFractionValueRow, cosLabelFractionValueRow, tanLabelFractionValueRow ],
      maxWidth: maxPanelWidth
    } );

    // 2 radio buttons for display in degrees or radians, located at bottom of Readout Panel
    var fontInfo = { font: DISPLAY_FONT, fill: TEXT_COLOR };
    var myRadioButtonOptions = { radius: 10, fontSize: 15, deselectedColor: 'white', maxWidth: maxPanelWidth };
    var degreeText = new Text( degreesString, fontInfo );
    var radiansText = new Text( radiansString, fontInfo );
    var degreesRadioButton = new AquaRadioButton(
      viewProperties.angleUnitsProperty,
      'degrees',
      degreeText,
      myRadioButtonOptions
    );
    var radiansRadioButton = new AquaRadioButton(
      viewProperties.angleUnitsProperty,
      'radians',
      radiansText,
      myRadioButtonOptions
    );

    // Layout rows of Readout Panel. Entire panel is content of ReadoutDisplay AccordionBox
    var spacing = 10;
    var rowSpacing = 4;
    var separatorOptions = { lineWidth: 0 };
    var contentVBox = new VBox( {
      children: [
        new VSeparator( rowSpacing, separatorOptions ),
        row1,
        new VSeparator( rowSpacing, separatorOptions ),
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

    thisReadoutNode.addChild( contentVBox );

    // Synchronize visibility properties with the view
    viewProperties.graphProperty.link( function( graph ) {
      sinLabelFractionValueRow.visible = ( graph === 'sin' );
      cosLabelFractionValueRow.visible = ( graph === 'cos' );
      tanLabelFractionValueRow.visible = ( graph === 'tan' );
    } );
  }

  return inherit( Node, ReadoutNode );
} );