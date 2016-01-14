// Copyright 2015, University of Colorado Boulder

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
  var BUTTON_X_MARGIN = 12;
  var TITLE_X_SPACING = 10.5;
  var CONTENT_X_MARGIN = 20;

  //strings
  var valuesString = require( 'string!TRIG_TOUR/values' );

  /**
   * Constructor for
   * @param {TrigTourModel} model is the main model of the sim
   * @param {ViewProperties} viewProperties
   * @constructor
   */
  function ReadoutDisplay( model, viewProperties, maxPanelWidth ) {

    var thisNode = this;

    this.model = model;
    this.viewProperties = viewProperties;

    // for i18n, restrict the width of the panel content by the max panel with minus the spacing params
    var maxContentWidth = maxPanelWidth - ( BUTTON_X_MARGIN + TITLE_X_SPACING + CONTENT_X_MARGIN );
    this.readoutNode = new ReadoutNode( model, viewProperties, maxContentWidth );

    this.expandedProperty = new Property( true );

    // Call the super constructor
    AccordionBox.call( this, this.readoutNode, {
      lineWidth: 1,
      cornerRadius: 10,
      buttonXMargin: BUTTON_X_MARGIN, // horizontal space between button and left|right edge of box
      buttonYMargin: 12,
      titleNode: new Text( valuesString, { font: DISPLAY_FONT, fontWeight: 'bold', maxWidth: maxContentWidth } ),
      titleXSpacing: TITLE_X_SPACING,
      titleAlignX: 'left',
      fill: PANEL_COLOR,
      showTitleWhenExpanded: true,
      contentXMargin: CONTENT_X_MARGIN,
      contentYMargin: 15,
      contentYSpacing: 8,
      expandedProperty: this.expandedProperty
    } );

    // link visibility of trig row readout
    viewProperties.graphProperty.link( function( graph ) {
      thisNode.readoutNode.setTrigRowVisibility( graph );
    } );

    viewProperties.angleUnitsProperty.link( function( units ) {
      thisNode.readoutNode.radiansDisplayed = ( units === 'radians');
      thisNode.readoutNode.setUnits( units );
      if ( units === 'radians' && thisNode.readoutNode.specialAnglesOnly ) {
        thisNode.readoutNode.fullAngleFractionNode.visible = true;
        thisNode.readoutNode.angleReadoutFraction.visible = true;
        thisNode.readoutNode.angleReadoutDecimal.visible = false;
      }
      else {
        thisNode.readoutNode.fullAngleFractionNode.visible = false;
        thisNode.readoutNode.angleReadoutFraction.visible = false;
        thisNode.readoutNode.angleReadoutDecimal.visible = true;
      }
      thisNode.readoutNode.setAngleReadout();
    } );

    viewProperties.specialAnglesVisibleProperty.link( function( specialAnglesVisible ) {
      thisNode.readoutNode.specialAnglesOnly = specialAnglesVisible;

      //select correct trig readouts
      thisNode.readoutNode.coordinatesHBox.visible = specialAnglesVisible;
      thisNode.readoutNode.coordinatesReadout.visible = !specialAnglesVisible;
      thisNode.readoutNode.sinFractionHolder2.visible = specialAnglesVisible;
      thisNode.readoutNode.cosFractionHolder2.visible = specialAnglesVisible;
      thisNode.readoutNode.tanReadoutFraction.visible = specialAnglesVisible;
      thisNode.readoutNode.sinReadoutText.visible = !specialAnglesVisible;
      thisNode.readoutNode.cosReadoutText.visible = !specialAnglesVisible;
      thisNode.readoutNode.tanReadoutText.visible = !specialAnglesVisible;

      //select correct angle readout
      if ( specialAnglesVisible && thisNode.readoutNode.radiansDisplayed ) {
        thisNode.readoutNode.fullAngleFractionNode.visible = true;
        thisNode.readoutNode.angleReadoutFraction.visible = true;
        thisNode.readoutNode.angleReadoutDecimal.visible = false;
      }
      else {
        thisNode.readoutNode.fullAngleFractionNode.visible = false;
        thisNode.readoutNode.angleReadoutFraction.visible = false;
        thisNode.readoutNode.angleReadoutDecimal.visible = true;
      }

      // set precision of angle readout in degrees:
      // in special angles mode, zero decimal places (e.g. 45 deg), otherwise 1 decimal place (e.g. 45.0 deg)
      if ( specialAnglesVisible ) {
        var currentSmallAngle = model.getSmallAngleInRadians();
        model.setSpecialAngleWithSmallAngle( currentSmallAngle );
        thisNode.readoutNode.setAngleReadoutPrecision( 0 );   //integer display of special angles
      }
      else {
        // 1 decimal place precision for continuous angles
        thisNode.readoutNode.setAngleReadoutPrecision( 1 );
      }
      thisNode.readoutNode.setAngleReadout();
      thisNode.readoutNode.setTrigReadout();
    } );
  }

  return inherit( AccordionBox, ReadoutDisplay );
} );