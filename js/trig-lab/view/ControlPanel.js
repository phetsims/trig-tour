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
  var Property = require( 'AXON/Property' );
  var Text = require( 'SCENERY/nodes/Text' );
  var VBox = require( 'SCENERY/nodes/VBox' );


  //strings
  var cosText = new Text( 'cos' );
  var sinText = new Text( 'sin' );
  var tanText = new Text( 'tan' );
  var labelsText =  new Text( 'Labels', { fontSize: 20 } );
  var gridText = new Text( 'Grid', { fontSize: 20 } );
  var specialAnglesText = new Text( 'Special Angles', { fontSize: 20 } );


  /**
   * Constructor for RotorNode which renders rotor as a scenery node.
   * @param {TrigLabModel} model is the main model of the sim
   * @constructor
   */
  function ControlPanel( properties  ) {

    var controlPanel = this;
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
    var cosRadioButton = new AquaRadioButton( properties.graphProperty, 'cos', new Text( 'Cos', { fontSize: 20 } ));
    var sinRadioButton = new AquaRadioButton( properties.graphProperty, 'sin', new Text( 'Sin', { fontSize: 20 } ));
    var tanRadioButton = new AquaRadioButton( properties.graphProperty, 'tan', new Text( 'Tan', { fontSize: 20 } ));



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
        new HSeparator( 50 ), //maxControlWidth ),
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
} )