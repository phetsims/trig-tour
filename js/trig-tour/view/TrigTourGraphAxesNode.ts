// Copyright 2015-2025, University of Colorado Boulder

/**
 * Axes and labels for the GraphView in trig-tour.  The axes and labels are broken into two nodes which are publicly
 * accessible so that the graph can be correctly layered in GraphView.  In order for the graph to be layered correctly,
 * the axes must be rendered first with the trig plots second, followed by the labels.
 *
 * @author Michael Dubson (PhET developer) on 6/3/2015.
 * @author Jesse Greenberg
 */

import PatternStringProperty from '../../../../axon/js/PatternStringProperty.js';
import Utils from '../../../../dot/js/Utils.js';
import ArrowNode from '../../../../scenery-phet/js/ArrowNode.js';
import MathSymbols from '../../../../scenery-phet/js/MathSymbols.js';
import PhetFont from '../../../../scenery-phet/js/PhetFont.js';
import Line from '../../../../scenery/js/nodes/Line.js';
import Node from '../../../../scenery/js/nodes/Node.js';
import Text from '../../../../scenery/js/nodes/Text.js';
import TPaint from '../../../../scenery/js/util/TPaint.js';
import trigTour from '../../trigTour.js';
import TrigTourStrings from '../../TrigTourStrings.js';
import TrigTourMathStrings from '../TrigTourMathStrings.js';
import TrigFunctionLabelText from './TrigFunctionLabelText.js';
import TrigTourColors from './TrigTourColors.js';
import ViewProperties from './ViewProperties.js';

// constants
const LINE_COLOR = TrigTourColors.LINE_COLOR;
const DISPLAY_FONT_SMALL = new PhetFont( 18 );
const TEXT_COLOR = TrigTourColors.TEXT_COLOR;
const DISPLAY_FONT_ITALIC = new PhetFont( { size: 20, style: 'italic' } );
const DISPLAY_FONT_SMALL_ITALIC = new PhetFont( { size: 18, family: 'Arial', style: 'italic' } );

const cosStringProperty = TrigTourStrings.cosStringProperty;
const numberPiPatternStringProperty = TrigTourStrings.numberPiPatternStringProperty;
const sinStringProperty = TrigTourStrings.sinStringProperty;
const tanStringProperty = TrigTourStrings.tanStringProperty;

// Collection of fields that will be used to style label Text instances.
type StyleInfo = {
  font: PhetFont;
  fill: TPaint;
  maxWidth?: number;
};

class TrigTourGraphAxesNode extends Node {

  // Break into layers because we need to to layer things on the graph view in order: Axis, plots, labels
  public readonly axisNode: Node;
  public readonly labelsNode: Node;

  public constructor( width: number, wavelength: number, numberOfWavelengths: number, amplitude: number, viewProperties: ViewProperties ) {
    super();

    this.axisNode = new Node();
    this.labelsNode = new Node();

    // draw x-axis and y-axis, represented by ArrowNodes
    const xAxisLength = width;
    const xAxis = new ArrowNode( -xAxisLength / 2, 0, xAxisLength / 2, 0, {
      tailWidth: 0.3,
      fill: LINE_COLOR,
      headHeight: 12,
      headWidth: 8
    } );
    const yAxis = new ArrowNode( 0, 1.18 * amplitude, 0, -1.3 * amplitude, {
      tailWidth: 0.3,
      fill: LINE_COLOR,
      headHeight: 12,
      headWidth: 8
    } );

    // draw tic marks for x and y axes
    const ticLength = 5;
    const xTics = new Node();
    const yTics = new Node();
    let xTic;
    let yTic;
    for ( let i = -2 * numberOfWavelengths; i <= 2 * numberOfWavelengths; i++ ) {
      xTic = new Line( 0, ticLength, 0, -ticLength, { lineWidth: 2, stroke: LINE_COLOR } );
      xTic.x = i * wavelength / 4;
      xTics.addChild( xTic );
    }
    for ( let i = -1; i <= 1; i += 2 ) {
      yTic = new Line( -ticLength, 0, ticLength, 0, { lineWidth: 2, stroke: LINE_COLOR } );
      yTic.y = i * amplitude;
      yTics.addChild( yTic );
    }

    this.children = [ xAxis, yAxis ];

    // draw 1/-1 labels on y-axis
    const onesNode = new Node();
    let styleInfo: StyleInfo = { font: DISPLAY_FONT_SMALL, fill: TEXT_COLOR };
    const oneLabel = new Text( TrigTourMathStrings.ONE_STRING, styleInfo );
    const minusOneLabel = new Text( TrigTourMathStrings.MINUS_ONE_STRING, styleInfo );
    onesNode.children = [ oneLabel, minusOneLabel ];
    const xOffset = 8;
    oneLabel.left = xOffset;
    minusOneLabel.right = -xOffset;
    oneLabel.centerY = -amplitude - 5;
    minusOneLabel.centerY = amplitude + 5;

    // draw tic mark labels in degrees
    const tickMarkLabelsInDegrees = new Node();
    for ( let j = -numberOfWavelengths; j <= numberOfWavelengths; j++ ) {
      let degrees = Utils.toFixed( 180 * j, 0 );
      degrees = degrees.toString();
      const label = new Text( `${degrees}\u00B0`, { font: DISPLAY_FONT_SMALL } );
      label.centerX = j * wavelength / 2;
      label.top = xAxis.bottom;
      if ( j !== 0 ) {
        tickMarkLabelsInDegrees.addChild( label );
      }
    }

    // tic mark labels in radians
    const tickMarkLabelsInRadians = new Node();
    const pi = MathSymbols.PI;
    const labelStrings = [
      new PatternStringProperty( numberPiPatternStringProperty, {
        value: '-4',
        pi: pi
      }, {
        formatNames: [ 'value', 'pi' ]
      } ),
      new PatternStringProperty( numberPiPatternStringProperty, {
        value: '-3',
        pi: pi
      }, {
        formatNames: [ 'value', 'pi' ]
      } ),
      new PatternStringProperty( numberPiPatternStringProperty, {
        value: '-2',
        pi: pi
      }, {
        formatNames: [ 'value', 'pi' ]
      } ),
      new PatternStringProperty( numberPiPatternStringProperty, {
        value: '-',
        pi: pi
      }, {
        formatNames: [ 'value', 'pi' ]
      } ),
      pi,
      new PatternStringProperty( numberPiPatternStringProperty, {
        value: '2',
        pi: pi
      }, {
        formatNames: [ 'value', 'pi' ]
      } ),
      new PatternStringProperty( numberPiPatternStringProperty, {
        value: '3',
        pi: pi
      }, {
        formatNames: [ 'value', 'pi' ]
      } ),
      new PatternStringProperty( numberPiPatternStringProperty, {
        value: '4',
        pi: pi
      }, {
        formatNames: [ 'value', 'pi' ]
      } )
    ];
    const xPositions = [ -4, -3, -2, -1, 1, 2, 3, 4 ];
    for ( let i = 0; i < xPositions.length; i++ ) {
      const labelStringProperty = labelStrings[ i ];
      const label = new Text( labelStringProperty, {
        font: DISPLAY_FONT_SMALL_ITALIC,
        fill: TEXT_COLOR,
        maxWidth: 30
      } );
      tickMarkLabelsInRadians.addChild( label );

      label.boundsProperty.link( () => {
        const centerPosition = xPositions[ i ] * wavelength / 2;
        label.centerX = centerPosition;
        label.top = xAxis.bottom;
      } );
    }

    // visibility set by Labels control in Control Panel and by degs/rads RBs in Readout Panel
    onesNode.visible = false;
    tickMarkLabelsInDegrees.visible = false;
    tickMarkLabelsInRadians.visible = false;

    // Axes labels
    const maxThetaWidth = ticLength * 3; // restrict for i18n
    styleInfo = { font: DISPLAY_FONT_ITALIC, fill: TEXT_COLOR, maxWidth: maxThetaWidth };
    const thetaLabel = new Text( MathSymbols.THETA, styleInfo );
    thetaLabel.left = this.right + 5;
    thetaLabel.centerY = xAxis.centerY;
    const maxTrigLabelWidth = xAxis.width / 4;
    const cosThetaLabel = new TrigFunctionLabelText( cosStringProperty, { maxWidth: maxTrigLabelWidth } );
    const sinThetaLabel = new TrigFunctionLabelText( sinStringProperty, { maxWidth: maxTrigLabelWidth } );
    const tanThetaLabel = new TrigFunctionLabelText( tanStringProperty, { maxWidth: maxTrigLabelWidth } );
    cosThetaLabel.right = sinThetaLabel.right = tanThetaLabel.right = yAxis.left - 10;
    cosThetaLabel.top = sinThetaLabel.top = tanThetaLabel.top = yAxis.top;

    this.axisNode.children = [ xAxis, yAxis, thetaLabel, cosThetaLabel, sinThetaLabel, tanThetaLabel ];
    this.labelsNode.children = [ onesNode, tickMarkLabelsInDegrees, tickMarkLabelsInRadians, xTics, yTics ];

    // sync visibility with view properties
    viewProperties.graphProperty.link( graph => {
      sinThetaLabel.visible = ( graph === 'sin' );
      cosThetaLabel.visible = ( graph === 'cos' );
      tanThetaLabel.visible = ( graph === 'tan' );
    } );

    viewProperties.labelsVisibleProperty.link( isVisible => {
      onesNode.visible = isVisible;
      if ( isVisible ) {
        tickMarkLabelsInRadians.visible = viewProperties.angleUnitsProperty.value === 'radians';
        tickMarkLabelsInDegrees.visible = viewProperties.angleUnitsProperty.value === 'degrees';
      }
      else {
        tickMarkLabelsInRadians.visible = false;
        tickMarkLabelsInDegrees.visible = false;
      }
    } );

    viewProperties.angleUnitsProperty.link( angleUnits => {
      if ( viewProperties.labelsVisibleProperty.value ) {
        tickMarkLabelsInRadians.visible = ( angleUnits === 'radians' );
        tickMarkLabelsInDegrees.visible = ( angleUnits !== 'radians' );
      }
    } );

  }
}

trigTour.register( 'TrigTourGraphAxesNode', TrigTourGraphAxesNode );
export default TrigTourGraphAxesNode;