/**
 * AccordionBox container of ReadoutNode,
 * ReadoutNode contains all the user-viewed content.
 * Created by Michael Dubson on 6/10/2015.
 */
define( function( require ) {
  'use strict';

  // modules
  var AccordionBox = require( 'SUN/AccordionBox' );
  var Bounds2 = require( 'DOT/Bounds2' );
  var inherit = require( 'PHET_CORE/inherit' );
  var PhetFont = require( 'SCENERY_PHET/PhetFont' );
  var Property = require( 'AXON/Property' );
  var ReadoutNode = require( 'TRIG_TOUR/trig-tour/view/ReadoutNode' );
  var Text = require( 'SCENERY/nodes/Text' );
  var Util = require( 'TRIG_TOUR/trig-tour/common/Util' );

  //constants
  var DISPLAY_FONT = new PhetFont( 20 );
  var PANEL_COLOR = Util.PANEL_COLOR;

  //strings
  var valuesStr = require( 'string!TRIG_TOUR/values' );

  /**
   * Constructor for
   * @param {TrigTourModel} model is the main model of the sim
   * @constructor
   */
  function ReadoutDisplay( model, properties  ) {

    //var readoutDisplay = this;
    this.model = model;
    this.properties = properties;


    this.readoutNode = new ReadoutNode( model, properties );

    this.expandedProperty = new Property( true );

    // Call the super constructor
    AccordionBox.call( this, this.readoutNode, {
      lineWidth: 1,
      cornerRadius: 10,
      buttonXMargin: 12, // horizontal space between button and left|right edge of box
      buttonYMargin: 12,
      titleNode: new Text( ' ' + valuesStr, { font: DISPLAY_FONT, fontWeight: 'bold' } ), //need space for button
      titleAlignX: 'left',
      fill: PANEL_COLOR,
      showTitleWhenExpanded: true,
      contentXMargin: 20,
      contentYMargin: 15,
      contentYSpacing: 8,
      expandedProperty: this.expandedProperty
    } );

  }

  return inherit( AccordionBox, ReadoutDisplay );
} );