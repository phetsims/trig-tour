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

    var unitCircleView = new UnitCircleView( trigTourModel, viewProperties );
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