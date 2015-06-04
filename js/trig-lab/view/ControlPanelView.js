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
  function ControlPanelView( model  ) {

    var controlPanelView = this;
    this.model = model;

    // Call the super constructor
    Panel.call( this, content, options );
    Node.call( controlPanelView, { } );

    //A cluster of 3 radio buttons for displaying either cos, sin or tan
    var cosRadioButton = new AquaRadioButton();
    var sinRadioButton = new AquaRadioButton();
    var tanRadioButton = new AquaRadioButton();

    //3 checkboxes: Labels, Grid, Special Angles
    var labelsCheckBox = new CheckBox();
    var gridCheckBox = new CheckBox();
    var specialAnglesCheckBox = new CheckBox();


    // Register for synchronization with model.
    model.angleProperty.link( function( angle ) {
      onTopOfStageGraphic.rotation = angle;
    } );

    // Adjust touch areas
    var spacing = 20;

    var content = new VBox( {
      children: [
        cosRadioButton,
        sinRadioButton,
        tanRadioButton
        new HSeparator( 50 ), //maxControlWidth ),
        labelsCheckBox,
        gridCheckBox,
        specialAnglesCheckBox
      ],
      align: 'left',
      spacing: spacing
    } );

    Panel.call( this, content, options );

  }

  return inherit( Panel, ControlPanelView );
} )