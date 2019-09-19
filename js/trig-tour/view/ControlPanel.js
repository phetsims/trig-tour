// Copyright 2015-2018, University of Colorado Boulder

/**
 * Control Panel for Trig Tour sim, on right side of screenView
 *
 * @author Michael Dubson (PhET developer) on 6/4/2015.
 */
define( require => {
  'use strict';

  // modules
  const AquaRadioButton = require( 'SUN/AquaRadioButton' );
  const Checkbox = require( 'SUN/Checkbox' );
  const HSeparator = require( 'SUN/HSeparator' );
  const inherit = require( 'PHET_CORE/inherit' );
  const Panel = require( 'SUN/Panel' );
  const PhetFont = require( 'SCENERY_PHET/PhetFont' );
  const Text = require( 'SCENERY/nodes/Text' );
  const trigTour = require( 'TRIG_TOUR/trigTour' );
  const TrigTourColors = require( 'TRIG_TOUR/trig-tour/view/TrigTourColors' );
  const VBox = require( 'SCENERY/nodes/VBox' );

  // constants
  var DISPLAY_FONT = new PhetFont( 20 );
  var TEXT_COLOR = TrigTourColors.TEXT_COLOR;
  var PANEL_COLOR = TrigTourColors.PANEL_COLOR;
  var RADIO_BUTTON_RADIUS = 10;

  //strings
  const cosString = require( 'string!TRIG_TOUR/cos' );
  const gridString = require( 'string!TRIG_TOUR/grid' );
  const labelsString = require( 'string!TRIG_TOUR/labels' );
  const sinString = require( 'string!TRIG_TOUR/sin' );
  const specialAnglesString = require( 'string!TRIG_TOUR/specialAngles' );
  const tanString = require( 'string!TRIG_TOUR/tan' );

  /**
   * Constructor for the control panel
   *
   * @param {ViewProperties} viewProperties
   * @param {number} maxPanelWidth - The maximum width of this panel, calculated in the screenView
   * @param {Object} [options]
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
    var checkboxOptions = { checkboxColorBackground: 'white' };
    var labelsCheckbox = new Checkbox( labelsText, viewProperties.labelsVisibleProperty, checkboxOptions );
    var gridCheckbox = new Checkbox( gridText, viewProperties.gridVisibleProperty, checkboxOptions );
    var specialAnglesCheckbox = new Checkbox(
      specialAnglesText,
      viewProperties.specialAnglesVisibleProperty,
      checkboxOptions
    );

    // Adjust touch areas
    var spacing = 15;
    var separatorWidth = specialAnglesCheckbox.width + 10;
    var content = new VBox( {
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

    Panel.call( this, content, options );

  }

  trigTour.register( 'ControlPanel', ControlPanel );

  return inherit( Panel, ControlPanel );
} );