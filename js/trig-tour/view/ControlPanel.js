// Copyright 2015, University of Colorado Boulder

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
  var RADIO_BUTTON_RADIUS = 10;

  //strings
  var cosString = require( 'string!TRIG_TOUR/cos' );
  var sinString = require( 'string!TRIG_TOUR/sin' );
  var tanString = require( 'string!TRIG_TOUR/tan' );
  var labelsString = require( 'string!TRIG_TOUR/labels' );
  var gridString = require( 'string!TRIG_TOUR/grid' );
  var specialAnglesString = require( 'string!TRIG_TOUR/specialAngles' );

  /**
   * Constructor for the control panel
   *
   * @param {ViewProperties} viewProperties
   * @param {number} maxPanelWidth - The maximum width of this panel, calculated in the screenView
   * @param {object} options
   * @constructor
   */
  function ControlPanel( viewProperties, maxPanelWidth, options ) {

    options = _.extend( {
      xMargin: 15,
      yMargin: 15,
      lineWidth: 1,
      fill: PANEL_COLOR,
      resize: false
    }, options );

    this.viewProperties = viewProperties;

    // create the text nodes, determining their max width from the panel width and the width of the buttons
    var maxWidth = maxPanelWidth - 4 * RADIO_BUTTON_RADIUS;
    var fontInfo = { font: DISPLAY_FONT, fill: TEXT_COLOR, maxWidth: maxWidth };
    var cosText = new Text( cosString, fontInfo );
    var sinText = new Text( sinString, fontInfo );
    var tanText = new Text( tanString, fontInfo );
    var labelsText = new Text( labelsString, fontInfo );
    var gridText = new Text( gridString, fontInfo );
    var specialAnglesText = new Text( specialAnglesString, fontInfo );

    // A cluster of 3 radio buttons for displaying either cos, sin or tan
    // viewProperties.graph = 'cos'|'sin'|'tan'
    var radioButtonOptions = { radius: RADIO_BUTTON_RADIUS, fontSize: 15, deselectedColor: 'white' };
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
      spacing: spacing,
      resize: false
    } );

    Panel.call( this, content, options );

  }

  return inherit( Panel, ControlPanel );
} );