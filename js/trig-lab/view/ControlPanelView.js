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
  var Text = require( 'SCENERY/nodes/Text' );
  var VBox = require( 'SCENERY/nodes/VBox' );


  //strings
  var cosString = 'cos';
  var sinString = 'sin';
  var tanString = 'tan';
  var labelsString = 'Labels' ;
  var gridString = 'Grid';
  var specialAnglesString = 'Special Angles';


  /**
   * Constructor for RotorNode which renders rotor as a scenery node.
   * @param {TrigLabModel} model is the main model of the sim
   * @constructor
   */
  function ControlPanelView( properties  ) {

    var controlPanelView = this;
    this.properties = properties;
    //graph: 'cos', // {string} which graph is visible, 'cos'|'sin' |'tan'
    //labelsVisible: false,
    //gridVisible: false,
    //specialAnglesVisible: false

    //this.model = model;

    // Call the super constructor
    //Node.call( controlPanelView, { } );

    //A cluster of 3 radio buttons for displaying either cos, sin or tan
    var cosRadioButton = new AquaRadioButton( properties.graph, 'cos', new Text( 'Cos' ));
    var sinRadioButton = new AquaRadioButton( properties.graph, 'sin', new Text( 'Sin' ));
    var tanRadioButton = new AquaRadioButton( properties.graph, 'tan', new Text( 'Tan' ));

    //3 checkboxes: Labels, Grid, Special Angles
    var labelsCheckBox = new CheckBox( labelsString, properties.labelsVisible );
    var gridCheckBox = new CheckBox( gridString, properties.gridVisible );
    var specialAnglesCheckBox = new CheckBox( specialAnglesString, properties.specialAnglesVisible );


    // Register for synchronization with model.
    //model.angleProperty.link( function( angle ) {
    //  onTopOfStageGraphic.rotation = angle;
    //} );

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

  return inherit( Panel, ControlPanelView );
} )