// Copyright 2002-2015, University of Colorado Boulder

/**
 * AccordionBox container of ReadoutNode,
 * ReadoutNode contains all the user-viewed content.
 *
 * @author Michael Dubson on 6/10/2015.
 */
define( function( require ) {
  'use strict';

  // modules
  var AccordionBox = require( 'SUN/AccordionBox' );
  var inherit = require( 'PHET_CORE/inherit' );
  var PhetFont = require( 'SCENERY_PHET/PhetFont' );
  var Property = require( 'AXON/Property' );
  var ReadoutNode = require( 'TRIG_TOUR/trig-tour/view/ReadoutNode' );
  var Text = require( 'SCENERY/nodes/Text' );
  var TrigTourColors = require( 'TRIG_TOUR/trig-tour/view/TrigTourColors' );

  //constants
  var DISPLAY_FONT = new PhetFont( 20 );
  var PANEL_COLOR = TrigTourColors.PANEL_COLOR;

  //strings
  var valuesString = require( 'string!TRIG_TOUR/values' );

  /**
   * Constructor for
   * @param {TrigTourModel} model is the main model of the sim
   * @param {ViewProperties} viewProperties
   * @constructor
   */
  function ReadoutDisplay( model, viewProperties ) {

    this.model = model;
    this.viewProperties = viewProperties;

    this.readoutNode = new ReadoutNode( model, viewProperties );

    this.expandedProperty = new Property( true );

    // Call the super constructor
    AccordionBox.call( this, this.readoutNode, {
      lineWidth: 1,
      cornerRadius: 10,
      buttonXMargin: 12, // horizontal space between button and left|right edge of box
      buttonYMargin: 12,
      titleNode: new Text( valuesString, { font: DISPLAY_FONT, fontWeight: 'bold' } ),
      titleXSpacing: 10.5,
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