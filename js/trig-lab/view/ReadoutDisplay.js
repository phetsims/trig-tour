/**
 * Created by dubson on 6/10/2015.
 */
define( function( require ) {
  'use strict';

  // modules
  var AccordionBox = require( 'SUN/AccordionBox' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Node = require( 'SCENERY/nodes/Node' );
  var Line = require( 'SCENERY/nodes/Line' );
  var PhetFont = require( 'SCENERY_PHET/PhetFont' );
  var Property = require( 'AXON/Property' );
  var ReadoutNode = require( 'TRIG_LAB/trig-lab/view/ReadoutNode' );
  var Text = require( 'SCENERY/nodes/Text' );

  //constants
  var DISPLAY_FONT = new PhetFont( 20 );


  /**
   * Constructor for
   * @param {TrigLabModel} model is the main model of the sim
   * @constructor
   */
  function ReadoutDisplay( model, properties  ) {

    var readoutDisplay = this;
    this.model = model;
    this.properties = properties;


    var contentNode = new ReadoutNode( model, properties );

    this.expanded = new Property( true );

    // Call the super constructor
    AccordionBox.call( this, contentNode, {
      titleNode: new Text( 'Readouts', { font: DISPLAY_FONT } ),
      titleAlignX: 'center',
      contentAlign: 'left',
      fill: 'white',
      showTitleWhenExpanded: false,
      contentXMargin: 8,
      contentYMargin: 25,
      contentYSpacing: 30,
      expandedProperty: this.expanded
    } );

  }

  return inherit( AccordionBox, ReadoutDisplay );
} );