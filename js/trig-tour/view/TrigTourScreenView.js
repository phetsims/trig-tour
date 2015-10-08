// Copyright 2002-2015, University of Colorado Boulder

/**
 * Main screen view, master layout of view on stage
 *
 * @author Michael Dubson (PhET)
 */
define( function( require ) {
  'use strict';

  // modules
  var ControlPanel = require( 'TRIG_TOUR/trig-tour/view/ControlPanel' );
  var GraphView = require( 'TRIG_TOUR/trig-tour/view/GraphView' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Image = require( 'SCENERY/nodes/Image' );
  var ReadoutDisplay = require( 'TRIG_TOUR/trig-tour/view/ReadoutDisplay' );
  var Rectangle = require( 'SCENERY/nodes/Rectangle' );
  var ResetAllButton = require( 'SCENERY_PHET/buttons/ResetAllButton' );
  var ScreenView = require( 'JOIST/ScreenView' );
  var UnitCircleView = require( 'TRIG_TOUR/trig-tour/view/UnitCircleView' );
  var ViewProperties = require( 'TRIG_TOUR/trig-tour/view/ViewProperties' );

  //images
  var dizzyPhetGirlImage = require( 'mipmap!TRIG_TOUR/dizzy-phet-girl.png' );

  /**
   * Constructor for TrigTourScreenView.
   *
   * @param {TrigTourModel} trigTourModel - main model for sim
   * @constructor
   */
  function TrigTourScreenView( trigTourModel ) {

    ScreenView.call( this );
    var thisScreenView = this;

    var viewProperties = new ViewProperties();

    var unitCircleView = new UnitCircleView( trigTourModel, viewProperties.specialAnglesVisibleProperty );
    unitCircleView.x = this.layoutBounds.centerX;
    unitCircleView.top = this.layoutBounds.top + 20;

    var graphView = new GraphView( trigTourModel, 0.25 * this.layoutBounds.height, 0.92 * this.layoutBounds.width, viewProperties );
    graphView.x = this.layoutBounds.centerX;
    graphView.y = this.layoutBounds.bottom - graphView.graphAxesNode.bottom - 15;

    // for i18n, calculate the maximum width for the readoutNode and the control panel.
    var maxPanelWidth = this.layoutBounds.right - unitCircleView.right - 60;

    var readoutDisplay = new ReadoutDisplay( trigTourModel, viewProperties, maxPanelWidth );
    readoutDisplay.left = this.layoutBounds.left + 30;
    readoutDisplay.top = 30;

    var controlPanel = new ControlPanel( viewProperties, maxPanelWidth );
    controlPanel.centerX = 0.5 * ( unitCircleView.right + this.layoutBounds.right );
    controlPanel.top = this.layoutBounds.top + 30;

    this.dizzyPhetGirlImage = new Image( dizzyPhetGirlImage, { scale: 0.6 } );
    this.dizzyPhetGirlImage.right = this.layoutBounds.right;
    this.dizzyPhetGirlImage.bottom = this.layoutBounds.bottom;

    // white sheet placed under unitCircleView to prevent background color bleeding through transparent cover of
    // unitCircle View. Want graphView under unitCircleView so tangent curve appears to be underneath unitCircle
    var width = 2.4 * 160;
    var height = 2.4 * 160;
    var arcRadius = 8;
    var whiteSheet = new Rectangle( -width / 2, -height / 2, width, height, arcRadius, arcRadius, { fill: 'white' } );
    whiteSheet.x = unitCircleView.x;
    whiteSheet.y = unitCircleView.y;

    this.addChild( whiteSheet );
    this.addChild( graphView );
    this.addChild( unitCircleView );
    this.addChild( readoutDisplay );
    this.addChild( controlPanel );
    this.addChild( this.dizzyPhetGirlImage );

    // Set up callbacks
    viewProperties.graphProperty.link( function( graph ) {

      // set visibility of horizontal and vertical arrows on x-y-R triangle in UnitCircleView
      unitCircleView.horizontalIndicatorArrow.visible = ( graph === 'cos' || graph === 'tan' );
      unitCircleView.horizontalLine.visible = ( graph === 'sin' );
      unitCircleView.verticalIndicatorArrow.visible = ( graph === 'sin' || graph === 'tan' );
      unitCircleView.verticalLine.visible = ( graph === 'cos' );

      // visibility of trig function readout
      readoutDisplay.readoutNode.setTrigRowVisibility( graph );
    } );

    viewProperties.labelsVisibleProperty.link( function( isVisible ) {
      unitCircleView.setLabelVisibility( isVisible );
    } );

    viewProperties.gridVisibleProperty.link( function( isVisible ) {
      unitCircleView.grid.visible = isVisible;
    } );

    viewProperties.angleUnitsProperty.link( function( units ) {
      readoutDisplay.readoutNode.radiansDisplayed = ( units === 'radians');
      readoutDisplay.readoutNode.setUnits( units );
      if ( units === 'radians' && readoutDisplay.readoutNode.specialAnglesOnly ) {
        readoutDisplay.readoutNode.fullAngleFractionNode.visible = true;
        readoutDisplay.readoutNode.angleReadoutFraction.visible = true;
        readoutDisplay.readoutNode.angleReadoutDecimal.visible = false;
      }
      else {
        readoutDisplay.readoutNode.fullAngleFractionNode.visible = false;
        readoutDisplay.readoutNode.angleReadoutFraction.visible = false;
        readoutDisplay.readoutNode.angleReadoutDecimal.visible = true;
      }
      readoutDisplay.readoutNode.setAngleReadout();
    } );

    viewProperties.specialAnglesVisibleProperty.link( function( specialAnglesVisible ) {
      unitCircleView.specialAnglesNode.visible = specialAnglesVisible;
      readoutDisplay.readoutNode.specialAnglesOnly = specialAnglesVisible;

      //select correct trig readouts
      readoutDisplay.readoutNode.coordinatesHBox.visible = specialAnglesVisible;
      readoutDisplay.readoutNode.coordinatesReadout.visible = !specialAnglesVisible;
      readoutDisplay.readoutNode.sinFractionHolder2.visible = specialAnglesVisible;
      readoutDisplay.readoutNode.cosFractionHolder2.visible = specialAnglesVisible;
      readoutDisplay.readoutNode.tanReadoutFraction.visible = specialAnglesVisible;
      readoutDisplay.readoutNode.sinReadoutText.visible = !specialAnglesVisible;
      readoutDisplay.readoutNode.cosReadoutText.visible = !specialAnglesVisible;
      readoutDisplay.readoutNode.tanReadoutText.visible = !specialAnglesVisible;

      //select correct angle readout
      if ( specialAnglesVisible && readoutDisplay.readoutNode.radiansDisplayed ) {
        readoutDisplay.readoutNode.fullAngleFractionNode.visible = true;
        readoutDisplay.readoutNode.angleReadoutFraction.visible = true;
        readoutDisplay.readoutNode.angleReadoutDecimal.visible = false;
      }
      else {
        readoutDisplay.readoutNode.fullAngleFractionNode.visible = false;
        readoutDisplay.readoutNode.angleReadoutFraction.visible = false;
        readoutDisplay.readoutNode.angleReadoutDecimal.visible = true;
      }

      // set precision of angle readout in degrees:
      // in special angles mode, zero decimal places (e.g. 45 deg), otherwise 1 decimal place (e.g. 45.0 deg)
      if ( specialAnglesVisible ) {
        var currentSmallAngle = trigTourModel.getSmallAngleInRadians();
        trigTourModel.setSpecialAngleWithSmallAngle( currentSmallAngle );
        readoutDisplay.readoutNode.setAngleReadoutPrecision( 0 );   //integer display of special angles
      }
      else {
        // 1 decimal place precision for continuous angles
        readoutDisplay.readoutNode.setAngleReadoutPrecision( 1 );
      }
      readoutDisplay.readoutNode.setAngleReadout();
      readoutDisplay.readoutNode.setTrigReadout();
    } );

    // if user exceeds max allowed angle in UnitCircleView, image of dizzy PhET girl appears
    trigTourModel.maxAngleExceededProperty.link( function( maxAngleExceeded ) {
      thisScreenView.dizzyPhetGirlImage.visible = maxAngleExceeded;
    } );

    // Create and add the Reset All Button in the bottom right, which resets the model
    var resetAllButton = new ResetAllButton( {
      listener: function() {
        viewProperties.reset();
        graphView.expandedProperty.value = true;
        readoutDisplay.expandedProperty.value = true;
        trigTourModel.setFullAngleInRadians( 0 );
        thisScreenView.dizzyPhetGirlImage.visible = false;
      },
      right: this.layoutBounds.maxX - 60,
      top: controlPanel.bottom + 10,
      radius: 18   // Dubson prefers button smaller than default
    } );
    this.addChild( resetAllButton );
  }

  return inherit( ScreenView, TrigTourScreenView, {} );
} );