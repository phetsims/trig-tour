// Copyright 2015-2025, University of Colorado Boulder

/**
 * Main screen view, main layout of view on stage
 *
 * Layout calculations are done empirically, numbers used in all layout calculations were chosen because
 * they 'look good'.
 *
 * @author Michael Dubson (PhET)
 */

import Vector2 from '../../../../dot/js/Vector2.js';
import ScreenView from '../../../../joist/js/ScreenView.js';
import ResetAllButton from '../../../../scenery-phet/js/buttons/ResetAllButton.js';
import { Image, Node, Rectangle } from '../../../../scenery/js/imports.js';
import dizzyPhetGirl_png from '../../../mipmaps/dizzyPhetGirl_png.js';
import trigTour from '../../trigTour.js';
import TrigTourModel from '../model/TrigTourModel.js';
import AngleSoundGenerator from './AngleSoundGenerator.js';
import ControlPanel from './ControlPanel.js';
import GraphView from './GraphView.js';
import ValuesAccordionBox from './readout/ValuesAccordionBox.js';
import TrigTourColors from './TrigTourColors.js';
import TrigTourDescriber from './TrigTourDescriber.js';
import TrigTourScreenSummaryContent from './TrigTourScreenSummaryContent.js';
import UnitCircleView from './UnitCircleView.js';
import ViewProperties from './ViewProperties.js';

// constants
const TEXT_COLOR_GRAY = TrigTourColors.TEXT_COLOR_GRAY;

class TrigTourScreenView extends ScreenView {

  private readonly dizzyPhetGirlImage: Node;

  /**
   * @param trigTourModel - main model for sim
   */
  public constructor( trigTourModel: TrigTourModel ) {
    const viewProperties = new ViewProperties();

    const trigTourDescriber = new TrigTourDescriber( trigTourModel, viewProperties );

    super( {
      screenSummaryContent: new TrigTourScreenSummaryContent( trigTourModel, viewProperties, trigTourDescriber )
    } );

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

    // A reusable sound generator for the UI components that can control the angle.
    const angleSoundGenerator = new AngleSoundGenerator();

    const unitCircleView = new UnitCircleView( trigTourModel, whiteSheet, xOffset, viewProperties, angleSoundGenerator );
    unitCircleView.center = whiteSheet.center;

    // small buffer between edges of the layout and panels on the screen view, for layout calculations
    const layoutBuffer = this.layoutBounds.width * 0.015;

    const readoutDisplay = new ValuesAccordionBox( trigTourModel, viewProperties, trigTourDescriber );
    readoutDisplay.left = layoutBuffer;
    readoutDisplay.top = unitCircleView.top;

    const graphView = new GraphView( trigTourModel, 0.25 * this.layoutBounds.height, 0.90 * this.layoutBounds.width, viewProperties, angleSoundGenerator );
    const initialPosition = new Vector2( readoutDisplay.left, unitCircleView.bottom + 10 );

    // Position the GraphView relative to its accordion box. It has siblings that surround
    // the AccordionBox that change bounds so we need to compute a position that is relative to the AccordionBox.
    // In addition, the graph needs to be centered with the unit circle. Computing the bounds of the plot was
    // difficult (see https://github.com/phetsims/trig-tour/issues/120), so this offset is applied to center
    // the graph with the unit circle.
    graphView.leftTop = initialPosition.minus( graphView.getPositionOffset() ).plusXY( 8.5, 0 );

    const controlPanel = new ControlPanel( viewProperties );
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
        trigTourModel.reset();
        this.dizzyPhetGirlImage.visible = false;
      },
      right: controlPanel.right,
      top: controlPanel.bottom + 10,
      radius: 21
    } );
    this.addChild( resetAllButton );

    // Play area focus order
    this.pdomPlayAreaNode.pdomOrder = [
      readoutDisplay,
      unitCircleView,
      graphView,
      controlPanel.radioButtonGroup
    ];

    // Control area focus order
    this.pdomControlAreaNode.pdomOrder = [
      controlPanel.checkboxGroup,
      resetAllButton
    ];
  }
}

trigTour.register( 'TrigTourScreenView', TrigTourScreenView );
export default TrigTourScreenView;