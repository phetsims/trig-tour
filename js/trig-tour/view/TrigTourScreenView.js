// Copyright 2015-2022, University of Colorado Boulder

/**
 * Main screen view, master layout of view on stage
 *
 * Layout calculations are done empirically, numbers used in all layout calculations were chosen because
 * they 'look good'.
 *
 * @author Michael Dubson (PhET)
 */

import ScreenView from '../../../../joist/js/ScreenView.js';
import ResetAllButton from '../../../../scenery-phet/js/buttons/ResetAllButton.js';
import { Image, Rectangle } from '../../../../scenery/js/imports.js';
import dizzyPhetGirl_png from '../../../mipmaps/dizzyPhetGirl_png.js';
import trigTour from '../../trigTour.js';
import ControlPanel from './ControlPanel.js';
import GraphView from './GraphView.js';
import ValuesAccordionBox from './readout/ValuesAccordionBox.js';
import TrigTourColors from './TrigTourColors.js';
import UnitCircleView from './UnitCircleView.js';
import ViewProperties from './ViewProperties.js';

//images

// constants
const TEXT_COLOR_GRAY = TrigTourColors.TEXT_COLOR_GRAY;

class TrigTourScreenView extends ScreenView {

  /**
   * @param {TrigTourModel} trigTourModel - main model for sim
   */
  constructor( trigTourModel ) {

    super();
    const viewProperties = new ViewProperties();

    // white sheet placed under unitCircleView to prevent background color bleeding through transparent cover of
    // unitCircle View. Want graphView under unitCircleView so tangent curve appears to be underneath unitCircle
    const width = 2.4 * 175;
    const height = 2.4 * 160;
    const arcRadius = 8;
    const xOffset = 10; // we want the width in the x direction to be offset slightly to include the 'x' label
    const whiteSheet = new Rectangle( -width / 2, -height / 2, width + xOffset, height, arcRadius, arcRadius, {
      fill: 'white',
      stroke: TEXT_COLOR_GRAY,
      lineWidth: 2
    } );
    whiteSheet.x = this.layoutBounds.centerX;
    whiteSheet.top = this.layoutBounds.top + 20;

    const unitCircleView = new UnitCircleView( trigTourModel, whiteSheet, xOffset, viewProperties );
    unitCircleView.center = whiteSheet.center;

    const graphView = new GraphView( trigTourModel, 0.25 * this.layoutBounds.height, 0.92 * this.layoutBounds.width, viewProperties );
    graphView.x = this.layoutBounds.centerX;
    graphView.y = this.layoutBounds.bottom - graphView.graphAxesNode.bottom - 15;

    // for i18n, calculate the maximum width for the readoutNode and the control panel.
    const maxPanelWidth = this.layoutBounds.right - unitCircleView.right - 60;

    // small buffer between edges of the layout and panels on the screen view, for layout calculations
    const layoutBuffer = this.layoutBounds.width * 0.015;

    const readoutDisplay = new ValuesAccordionBox( trigTourModel, viewProperties, maxPanelWidth );
    readoutDisplay.left = layoutBuffer;
    readoutDisplay.top = unitCircleView.top;

    const controlPanel = new ControlPanel( viewProperties, maxPanelWidth );
    controlPanel.right = this.layoutBounds.right - layoutBuffer;
    controlPanel.top = unitCircleView.top;

    this.dizzyPhetGirlImage = new Image( dizzyPhetGirl_png, { scale: 0.6 } );
    this.dizzyPhetGirlImage.right = this.layoutBounds.right;
    this.dizzyPhetGirlImage.bottom = this.layoutBounds.bottom;

    this.addChild( whiteSheet );
    this.addChild( graphView );
    this.addChild( unitCircleView );
    this.addChild( readoutDisplay );
    this.addChild( controlPanel );
    this.addChild( this.dizzyPhetGirlImage );

    // if user exceeds max allowed angle in UnitCircleView, image of dizzy PhET girl appears
    trigTourModel.maxAngleExceededProperty.link( maxAngleExceeded => {
      this.dizzyPhetGirlImage.visible = maxAngleExceeded;
    } );

    // Create and add the Reset All Button in the bottom right, which resets the model
    const resetAllButton = new ResetAllButton( {
      listener: () => {
        viewProperties.reset();
        graphView.expandedProperty.value = true;
        readoutDisplay.expandedProperty.value = true;
        trigTourModel.setFullAngleInRadians( 0 );
        this.dizzyPhetGirlImage.visible = false;
      },
      right: controlPanel.right,
      top: controlPanel.bottom + 10,
      radius: 21
    } );
    this.addChild( resetAllButton );
  }
}

trigTour.register( 'TrigTourScreenView', TrigTourScreenView );
export default TrigTourScreenView;