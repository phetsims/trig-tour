/**
 * Control Panel for Trig Lab sim
 * Created by dubson on 6/4/2015.
 */
define( function( require ) {
  'use strict';

  // modules
  var AquaRadioButton = require( 'SUN/AquaRadioButton' );
  var CheckBox = require( 'SUN/CheckBox' );
  var HBox = require( 'SCENERY/nodes/HBox' );
  var HSeparator = require( 'SUN/HSeparator' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Panel = require( 'SUN/Panel' );
  var Text = require( 'SCENERY/nodes/Text' );
  var VBox = require( 'SCENERY/nodes/VBox' );


  //strings
  var cosStr = 'cos';
  var sinStr = 'sin';
  var tanStr = 'tan';
  //var degreesStr = 'degrees';
  //var radiansStr = 'radians';
  var degStr = 'deg';
  var radStr = 'rad';
  var labelsStr = 'Labels';
  var gridStr = 'Grid';
  var specialAnglesStr = 'Special angles';

  // Text nodes
  var fontInfo = { fontSize: 20 };
  var cosText = new Text( cosStr, fontInfo );
  var sinText = new Text( sinStr, fontInfo );
  var tanText = new Text( tanStr, fontInfo );
  //var degreesText = new Text( degreesStr, fontInfo );
  //var radiansText = new Text( radiansStr, fontInfo );
  //var degText = new Text( degStr, fontInfo ) ;
  //var radText = new Text( radStr, fontInfo );
  var labelsText =  new Text( labelsStr, fontInfo );
  var gridText = new Text( gridStr, fontInfo );
  var specialAnglesText = new Text( specialAnglesStr, fontInfo );


  /**
   * Constructor for RotorNode which renders rotor as a scenery node.
   * @param {TrigLabModel} model is the main model of the sim
   * @constructor
   */
  function ControlPanel( properties  ) {

    //var controlPanel = this;
    this.properties = properties;
    //graph: 'cos', // {string} which graph is visible, 'cos'|'sin' |'tan'
    //labelsVisible: false,
    //gridVisible: false,
    //specialAnglesVisible: false

    //this.model = model;

    // Call the super constructor
    //Node.call( controlPanel, { } );



    //A cluster of 3 radio buttons for displaying either cos, sin or tan
    //properties.graph , properties.graph , properties.graph
    var myRadioButtonOptions = { radius: 10, fontSize: 15 } ;
    var cosRadioButton = new AquaRadioButton( properties.graphProperty, cosStr, cosText, myRadioButtonOptions );
    var sinRadioButton = new AquaRadioButton( properties.graphProperty, sinStr, sinText, myRadioButtonOptions );
    var tanRadioButton = new AquaRadioButton( properties.graphProperty, tanStr, tanText, myRadioButtonOptions );

    //// 2 radio buttons for display in degrees or radians
    //var degreesRadioButton = new AquaRadioButton( properties.angleUnitsProperty, degreesStr, degText, myRadioButtonOptions );
    //var radiansRadioButton = new AquaRadioButton( properties.angleUnitsProperty, radiansStr, radText, myRadioButtonOptions );

    //3 checkboxes: Labels, Grid, Special Angles
    var labelsCheckBox = new CheckBox( labelsText, properties.labelsVisibleProperty );
    var gridCheckBox = new CheckBox( gridText, properties.gridVisibleProperty );
    var specialAnglesCheckBox = new CheckBox( specialAnglesText, properties.specialAnglesVisibleProperty );



    // Adjust touch areas
    var spacing = 20;


    var content = new VBox( {
      children: [
        cosRadioButton,
        sinRadioButton,
        tanRadioButton,
        //new HSeparator( 100 ), //maxControlWidth ),
        //new HBox( {
        //children: [
        //  degreesRadioButton,
        //  radiansRadioButton,
        //  ]}),
        new HSeparator( 100 ), //maxControlWidth ),
        labelsCheckBox,
        gridCheckBox,
        specialAnglesCheckBox
      ],
      align: 'left',
      spacing: spacing
    } );


    Panel.call( this, content );

  }

  return inherit( Panel, ControlPanel );
} );