/**
 * Control Panel for Trig Lab sim
 * Created by dubson on 6/4/2015.
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

  //strings
  var cosStr = require( 'string!TRIG_LAB/cos' );
  var sinStr = require( 'string!TRIG_LAB/sin' );
  var tanStr = require( 'string!TRIG_LAB/tan' );
  var labelsStr = require( 'string!TRIG_LAB/labels' );
  var gridStr = require( 'string!TRIG_LAB/grid' );
  var specialAnglesStr = require( 'string!TRIG_LAB/specialAngles' );

  // constants
  var DISPLAY_FONT = new PhetFont( 20 );

  // Text nodes
  var fontInfo = { font: DISPLAY_FONT }; //{ fontSize: 20 };
  var cosText = new Text( cosStr, fontInfo );
  var sinText = new Text( sinStr, fontInfo );
  var tanText = new Text( tanStr, fontInfo );
  var labelsText =  new Text( labelsStr, fontInfo );
  var gridText = new Text( gridStr, fontInfo );
  var specialAnglesText = new Text( specialAnglesStr, fontInfo );


  /**
   * Constructor for RotorNode which renders rotor as a scenery node.
   * @param {TrigLabModel} model is the main model of the sim
   * @constructor
   */
  function ControlPanel( properties  ) {

    this.properties = properties;

    //A cluster of 3 radio buttons for displaying either cos, sin or tan
    //properties.graph = 'cos'|'sin'|'tan'
    var myRadioButtonOptions = { radius: 10, fontSize: 15 } ;
    var cosRadioButton = new AquaRadioButton( properties.graphProperty, cosStr, cosText, myRadioButtonOptions );
    var sinRadioButton = new AquaRadioButton( properties.graphProperty, sinStr, sinText, myRadioButtonOptions );
    var tanRadioButton = new AquaRadioButton( properties.graphProperty, tanStr, tanText, myRadioButtonOptions );

    //3 checkboxes: Labels, Grid, Special Angles
    var labelsCheckBox = new CheckBox( labelsText, properties.labelsVisibleProperty );
    var gridCheckBox = new CheckBox( gridText, properties.gridVisibleProperty );
    var specialAnglesCheckBox = new CheckBox( specialAnglesText, properties.specialAnglesVisibleProperty );

    // Adjust touch areas
    var spacing = 15;

    var content = new VBox( {
      children: [
        cosRadioButton,
        sinRadioButton,
        tanRadioButton,
        new HSeparator( 100 ), //maxControlWidth ),
        labelsCheckBox,
        gridCheckBox,
        specialAnglesCheckBox
      ],
      align: 'left',
      spacing: spacing
    } );


    Panel.call( this, content, {xMargin: 15, yMargin: 15, lineWidth: 2} );

  } // end ControlPanel constructor

  return inherit( Panel, ControlPanel );
} );