// Copyright 2002-2015, University of Colorado Boulder

/**
 * Control Panel for Trig Tour sim, on right side of screenView
 *
 * @author Michael Dubson (PhET developer) on 6/4/2015.
 */
define( function( require ) {
  'use strict';

  // modules
  var AquaRadioButton = require( 'SUN/AquaRadioButton' );
  var CheckBox = require( 'SUN/CheckBox' );
  var HSeparator = require( 'SUN/HSeparator' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Panel = require( 'SUN/Panel' );
  var PhetFont = require( 'SCENERY_PHET/PhetFont' );
  var Text = require( 'SCENERY/nodes/Text' );
  var VBox = require( 'SCENERY/nodes/VBox' );
  var TrigTourColors = require( 'TRIG_TOUR/trig-tour/view/TrigTourColors' );

  // constants
  var DISPLAY_FONT = new PhetFont( 20 );
  var TEXT_COLOR = TrigTourColors.TEXT_COLOR;
  var PANEL_COLOR = TrigTourColors.PANEL_COLOR;

  //strings
  var cosStr = require( 'string!TRIG_TOUR/cos' );
  var sinStr = require( 'string!TRIG_TOUR/sin' );
  var tanStr = require( 'string!TRIG_TOUR/tan' );
  var labelsStr = require( 'string!TRIG_TOUR/labels' );
  var gridStr = require( 'string!TRIG_TOUR/grid' );
  var specialAnglesStr = require( 'string!TRIG_TOUR/specialAngles' );

  /**
   * Constructor for the control panel
   *
   * @param {ViewProperties} viewProperties
   * @constructor
   */
  function ControlPanel( viewProperties ) {

    this.viewProperties = viewProperties;

    // create the text nodes
    var fontInfo = { font: DISPLAY_FONT, fill: TEXT_COLOR };
    var cosText = new Text( cosStr, fontInfo );
    var sinText = new Text( sinStr, fontInfo );
    var tanText = new Text( tanStr, fontInfo );
    var labelsText = new Text( labelsStr, fontInfo );
    var gridText = new Text( gridStr, fontInfo );
    var specialAnglesText = new Text( specialAnglesStr, fontInfo );

    // A cluster of 3 radio buttons for displaying either cos, sin or tan
    // viewProperties.graph = 'cos'|'sin'|'tan'
    var radioButtonOptions = { radius: 10, fontSize: 15, deselectedColor: 'white' };
    var cosRadioButton = new AquaRadioButton( viewProperties.graphProperty, 'cos', cosText, radioButtonOptions );
    var sinRadioButton = new AquaRadioButton( viewProperties.graphProperty, 'sin', sinText, radioButtonOptions );
    var tanRadioButton = new AquaRadioButton( viewProperties.graphProperty, 'tan', tanText, radioButtonOptions );

    // 3 checkboxes: Labels, Grid, Special Angles
    var checkBoxOptions = { checkBoxColorBackground: 'white' };
    var labelsCheckBox = new CheckBox( labelsText, viewProperties.labelsVisibleProperty, checkBoxOptions );
    var gridCheckBox = new CheckBox( gridText, viewProperties.gridVisibleProperty, checkBoxOptions );
    var specialAnglesCheckBox = new CheckBox(
      specialAnglesText,
      viewProperties.specialAnglesVisibleProperty,
      checkBoxOptions
    );

    // Adjust touch areas
    var spacing = 15;
    var separatorWidth = specialAnglesCheckBox.width + 10;
    var content = new VBox( {
      children: [
        cosRadioButton,
        sinRadioButton,
        tanRadioButton,
        new HSeparator( separatorWidth ),
        specialAnglesCheckBox,
        labelsCheckBox,
        gridCheckBox
      ],
      align: 'left',
      spacing: spacing
    } );

    Panel.call( this, content, { xMargin: 15, yMargin: 15, lineWidth: 1, fill: PANEL_COLOR } );

  }

  return inherit( Panel, ControlPanel );
} );