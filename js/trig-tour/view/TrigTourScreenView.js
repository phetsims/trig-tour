// Copyright 2015, University of Colorado Boulder

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
  var ReadoutDisplay = require( 'TRIG_TOUR/trig-tour/view/readout/ReadoutDisplay' );
  var Rectangle = require( 'SCENERY/nodes/Rectangle' );
  var ResetAllButton = require( 'SCENERY_PHET/buttons/ResetAllButton' );
  var ScreenView = require( 'JOIST/ScreenView' );
  var UnitCircleView = require( 'TRIG_TOUR/trig-tour/view/UnitCircleView' );
  var ViewProperties = require( 'TRIG_TOUR/trig-tour/view/ViewProperties' );
  var trigTour = require( 'TRIG_TOUR/trigTour' );
  var TrigTourColors = require( 'TRIG_TOUR/trig-tour/view/TrigTourColors' );

  //images
  var dizzyPhetGirlImage = require( 'mipmap!TRIG_TOUR/dizzy-phet-girl.png' );

  // constants
  var TEXT_COLOR_GRAY = TrigTourColors.TEXT_COLOR_GRAY;

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

    // white sheet placed under unitCircleView to prevent background color bleeding through transparent cover of
    // unitCircle View. Want graphView under unitCircleView so tangent curve appears to be underneath unitCircle
    var width = 2.4 * 175;
    var height = 2.4 * 160;
    var arcRadius = 8;
    var xOffset = 10; // we want the width in the x direction to be offset slightly to include the 'x' label
    var whiteSheet = new Rectangle( -width / 2, -height / 2, width + xOffset, height, arcRadius, arcRadius, { 
      fill: 'white',
      stroke: TEXT_COLOR_GRAY,
      lineWidth: 2 
    } );
    whiteSheet.x = this.layoutBounds.centerX;
    whiteSheet.top = this.layoutBounds.top + 20;

    var unitCircleView = new UnitCircleView( trigTourModel, whiteSheet, xOffset, viewProperties );
    unitCircleView.center = whiteSheet.center;

    var graphView = new GraphView( trigTourModel, 0.25 * this.layoutBounds.height, 0.92 * this.layoutBounds.width, viewProperties );
    graphView.x = this.layoutBounds.centerX;
    graphView.y = this.layoutBounds.bottom - graphView.graphAxesNode.bottom - 15;

    // for i18n, calculate the maximum width for the readoutNode and the control panel.
    var maxPanelWidth = this.layoutBounds.right - unitCircleView.right - 60;

    // small buffer between edges of the layout and panels on the screen view, for layout calculations
    var layoutBuffer = this.layoutBounds.width * 0.015;

    var readoutDisplay = new ReadoutDisplay( trigTourModel, viewProperties, maxPanelWidth );
    readoutDisplay.left = layoutBuffer;
    readoutDisplay.top = unitCircleView.top;

    var controlPanel = new ControlPanel( viewProperties, maxPanelWidth );
    controlPanel.right = this.layoutBounds.right - layoutBuffer;
    controlPanel.top = unitCircleView.top;

    this.dizzyPhetGirlImage = new Image( dizzyPhetGirlImage, { scale: 0.6 } );
    this.dizzyPhetGirlImage.right = this.layoutBounds.right;
    this.dizzyPhetGirlImage.bottom = this.layoutBounds.bottom;

    this.addChild( whiteSheet );
    this.addChild( graphView );
    this.addChild( unitCircleView );
    this.addChild( readoutDisplay );
    this.addChild( controlPanel );
    this.addChild( this.dizzyPhetGirlImage );

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
      right: controlPanel.right,
      top: controlPanel.bottom + 10,
      radius: 21,
      touchAreaDilation: 3,
      mouseAreaDilation: 3
    } );
    this.addChild( resetAllButton );
  }

  trigTour.register( 'TrigTourScreenView', TrigTourScreenView );

  return inherit( ScreenView, TrigTourScreenView, {} );
} );