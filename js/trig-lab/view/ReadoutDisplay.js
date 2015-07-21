/**
 * Created by dubson on 6/10/2015.
 */
define( function( require ) {
  'use strict';

  // modules
  var AccordionBox = require( 'SUN/AccordionBox' );
  var inherit = require( 'PHET_CORE/inherit' );
  var PhetFont = require( 'SCENERY_PHET/PhetFont' );
  var Property = require( 'AXON/Property' );
  var ReadoutNode = require( 'TRIG_LAB/trig-lab/view/ReadoutNode' );
  var Text = require( 'SCENERY/nodes/Text' );
  var Util = require( 'TRIG_LAB/trig-lab/common/Util' );

  //constants
  var DISPLAY_FONT = new PhetFont( 20 );
  var PANEL_COLOR = Util.PANEL_COLOR;


  /**
   * Constructor for
   * @param {TrigLabModel} model is the main model of the sim
   * @constructor
   */
  function ReadoutDisplay( model, properties  ) {

    //var readoutDisplay = this;
    this.model = model;
    this.properties = properties;


    this.readoutNode = new ReadoutNode( model, properties );

    this.expanded = new Property( true );

    // Call the super constructor
    AccordionBox.call( this, this.readoutNode, {
      lineWidth: 1,
      cornerRadius: 10,
      buttonXMargin: 12, // horizontal space between button and left|right edge of box
      buttonYMargin: 12,
      titleNode: new Text( '  Values', { font: DISPLAY_FONT, fontWeight: 'bold' } ),
      titleAlignX: 'left',
      //contentAlign: 'left',
      fill: PANEL_COLOR,
      showTitleWhenExpanded: true,
      contentXMargin: 20,
      contentYMargin: 15,
      contentYSpacing: 8,
      expandedProperty: this.expanded
    } );

  }

  return inherit( AccordionBox, ReadoutDisplay );
} );