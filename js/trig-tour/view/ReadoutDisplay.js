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

    this.model = model;
    this.viewProperties = viewProperties;

    // for i18n, restrict the width of the panel content by the max panel with minus the spacing params
    var maxContentWidth = maxPanelWidth - ( BUTTON_X_MARGIN + TITLE_X_SPACING + CONTENT_X_MARGIN );
    var readoutNode = new ReadoutNode( model, viewProperties, maxContentWidth );

    this.expandedProperty = new Property( true );

    // Call the super constructor
    AccordionBox.call( this, readoutNode, {
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
      readoutNode.setTrigRowVisibility( graph );
    } );

    viewProperties.angleUnitsProperty.link( function( units ) {
      readoutNode.radiansDisplayed = ( units === 'radians');
      readoutNode.setUnits( units );
      if ( units === 'radians' && readoutNode.specialAnglesOnly ) {
        readoutNode.fullAngleFractionNode.visible = true;
        readoutNode.angleReadoutFraction.visible = true;
        readoutNode.angleReadoutDecimal.visible = false;
      }
      else {
        readoutNode.fullAngleFractionNode.visible = false;
        readoutNode.angleReadoutFraction.visible = false;
        readoutNode.angleReadoutDecimal.visible = true;
      }
      readoutNode.setAngleReadout();
    } );

    viewProperties.specialAnglesVisibleProperty.link( function( specialAnglesVisible ) {
      readoutNode.specialAnglesOnly = specialAnglesVisible;

      //select correct trig readouts
      readoutNode.coordinatesHBox.visible = specialAnglesVisible;
      readoutNode.coordinatesReadout.visible = !specialAnglesVisible;
      readoutNode.sinFractionHolder2.visible = specialAnglesVisible;
      readoutNode.cosFractionHolder2.visible = specialAnglesVisible;
      readoutNode.tanReadoutFraction.visible = specialAnglesVisible;
      readoutNode.sinReadoutText.visible = !specialAnglesVisible;
      readoutNode.cosReadoutText.visible = !specialAnglesVisible;
      readoutNode.tanReadoutText.visible = !specialAnglesVisible;

      //select correct angle readout
      if ( specialAnglesVisible && readoutNode.radiansDisplayed ) {
        readoutNode.fullAngleFractionNode.visible = true;
        readoutNode.angleReadoutFraction.visible = true;
        readoutNode.angleReadoutDecimal.visible = false;
      }
      else {
        readoutNode.fullAngleFractionNode.visible = false;
        readoutNode.angleReadoutFraction.visible = false;
        readoutNode.angleReadoutDecimal.visible = true;
      }

      // set precision of angle readout in degrees:
      // in special angles mode, zero decimal places (e.g. 45 deg), otherwise 1 decimal place (e.g. 45.0 deg)
      if ( specialAnglesVisible ) {
        var currentSmallAngle = model.getSmallAngleInRadians();
        model.setSpecialAngleWithSmallAngle( currentSmallAngle );
        readoutNode.setAngleReadoutPrecision( 0 );   //integer display of special angles
      }
      else {
        // 1 decimal place precision for continuous angles
        readoutNode.setAngleReadoutPrecision( 1 );
      }
      readoutNode.setAngleReadout();
      readoutNode.setTrigReadout();
    } );
  }

  return inherit( AccordionBox, ReadoutDisplay );
} );