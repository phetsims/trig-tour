// Copyright 2015-2024, University of Colorado Boulder

/**
 * View of Graph of sin, cos, or tan vs. theta, at bottom of stage, below unit circle
 *
 * The graph exists in a panel that can be minimized so that the graph is hidden on the display.  Since the
 * panel needs to shrink down to the size of the title when minimized, AccordionBox could not be used.
 *
 * The GraphView is constructed with TrigPlotsNode and TrigTourGraphAxesNode.  The TrigTourGraphAxesNode contains
 * the axes and labels and the TrigTourPlotsNode handles drawing the plot shape and path rendering.  This file
 * puts them together with a grabbable indicator arrow that points to the current value of theta and the function.
 *
 * @author Michael Dubson (PhET developer) on 6/3/2015.
 */

import Property from '../../../../axon/js/Property.js';
import Bounds2 from '../../../../dot/js/Bounds2.js';
import Orientation from '../../../../phet-core/js/Orientation.js';
import MathSymbols from '../../../../scenery-phet/js/MathSymbols.js';
import PhetFont from '../../../../scenery-phet/js/PhetFont.js';
import SoundRichDragListener from '../../../../scenery-phet/js/SoundRichDragListener.js';
import { Circle, DragListener, HBox, KeyboardDragListener, Line, Node, Rectangle, SceneryEvent, Spacer, Text, TPaint } from '../../../../scenery/js/imports.js';
import ExpandCollapseButton from '../../../../sun/js/ExpandCollapseButton.js';
import Panel from '../../../../sun/js/Panel.js';
import trigTour from '../../trigTour.js';
import TrigTourStrings from '../../TrigTourStrings.js';
import TrigTourModel from '../model/TrigTourModel.js';
import TrigTourConstants from '../TrigTourConstants.js';
import AngleSoundGenerator from './AngleSoundGenerator.js';
import TrigFunctionLabelText from './TrigFunctionLabelText.js';
import TrigIndicatorArrowNode from './TrigIndicatorArrowNode.js';
import TrigPlotsNode from './TrigPlotsNode.js';
import TrigTourColors from './TrigTourColors.js';
import TrigTourGraphAxesNode from './TrigTourGraphAxesNode.js';
import ViewProperties, { Graph } from './ViewProperties.js';

//strings
const cosString = TrigTourStrings.cos;
const sinString = TrigTourStrings.sin;
const tanString = TrigTourStrings.tan;
const vsString = TrigTourStrings.vs;

//constants
const BACKGROUND_COLOR = TrigTourColors.BACKGROUND_COLOR;
const COS_COLOR = TrigTourColors.COS_COLOR;
const SIN_COLOR = TrigTourColors.SIN_COLOR;
const TAN_COLOR = TrigTourColors.TAN_COLOR;
const LINE_COLOR = TrigTourColors.LINE_COLOR;
const TEXT_COLOR_GRAY = TrigTourColors.TEXT_COLOR_GRAY;
const VIEW_BACKGROUND_COLOR = TrigTourColors.VIEW_BACKGROUND_COLOR;
const DISPLAY_FONT = new PhetFont( 20 );
const ITALIC_DISPLAY_FONT = new PhetFont( { size: 20, style: 'italic' } );

class GraphView extends Node {

  private readonly trigTourModel: TrigTourModel;
  private readonly viewProperties: ViewProperties;

  // Supports hiding/showing the graph with an ExpandCollapseButton
  public readonly expandedProperty: Property<boolean>;

  // amplitude of sinusoidal curve in view coordinates
  private readonly amplitude: number;

  private graphTitle: Node;
  private readonly titleDisplayHBox: Node;
  private readonly titleDisplayPanel: Node;
  private readonly expandCollapseButton: Node;

  // axes node for displaying axes on the graph - public for layout
  public readonly graphAxesNode: TrigTourGraphAxesNode;

  // node containing paths of the trig curves sin, cos, and tan
  private readonly trigPlotsNode: Node;
  private readonly singularityIndicator: Node;
  private readonly singularityRectangle: Node;
  private readonly redDotHandle: Node;

  // A vertical arrow on the trig curve showing current value of angle and trigFunction(angle),
  // and a red dot on top of the indicator line that echoes the red dot on unit circle.
  private readonly trigIndicatorArrowNode: TrigIndicatorArrowNode;

  /**
   * Constructor for view of Graph, which displays sin, cos, or tan vs angle theta in either degrees or radians, and
   * has a draggable handle for changing the angle.
   *
   * @param trigTourModel
   * @param height of y-axis on graph
   * @param width of x-axis on graph
   * @param viewProperties
   * @param angleSoundGenerator
   */
  public constructor( trigTourModel: TrigTourModel, height: number, width: number, viewProperties: ViewProperties, angleSoundGenerator: AngleSoundGenerator ) {
    super();

    this.trigTourModel = trigTourModel;
    this.viewProperties = viewProperties;
    this.expandedProperty = new Property( true );

    // Graph drawing code is determined empirically, numbers are chosen based on what 'looks good'.
    const marginWidth = 25; // distance between edge of Node and edge of nearest full wavelength
    const wavelength = ( width - 2 * marginWidth ) / 4; // wavelength of sinusoidal curve in view coordinates
    this.amplitude = 0.475 * height;
    const numberOfWavelengths = 2 * 2; // number of full wavelengths displayed, must be even to keep graph symmetric

    const buttonSpacer = new Spacer( 17, 0 );

    this.graphTitle = new Text( '', { font: DISPLAY_FONT, maxWidth: width / 3 } );
    this.titleDisplayHBox = new HBox( { children: [ buttonSpacer, this.graphTitle ], spacing: 5 } );

    // when graph is collapsed/hidden, a title is displayed
    this.titleDisplayPanel = new Panel( this.titleDisplayHBox, {
      fill: 'white',
      stroke: TEXT_COLOR_GRAY,
      lineWidth: 2, // width of the background border
      xMargin: 12,
      yMargin: 5,
      cornerRadius: 5,
      backgroundPickable: false,
      align: 'left',
      minWidth: 0
    } );
    this.expandCollapseButton = new ExpandCollapseButton( this.expandedProperty, {
      sideLength: 15,
      cursor: 'pointer',

      // pdom
      accessibleName: TrigTourStrings.a11y.graphViewAccordionBox.accessibleNameStringProperty,
      helpText: TrigTourStrings.a11y.graphViewAccordionBox.helpTextStringProperty
    } );
    let hitBound = 30;
    let midX = this.expandCollapseButton.centerX;
    const midY = this.expandCollapseButton.centerY;
    this.expandCollapseButton.mouseArea = new Bounds2( midX - hitBound, midY - hitBound, midX + hitBound, midY + hitBound );
    this.expandCollapseButton.touchArea = new Bounds2( midX - hitBound, midY - hitBound, midX + hitBound, midY + hitBound );

    // draw white background
    const backgroundHeight = 1.2 * height;
    const backgroundWidth = 1.05 * width;
    const arcRadius = 10;
    const backgroundRectangle = new Rectangle( -backgroundWidth / 2, -( backgroundHeight / 2 ) - 5, backgroundWidth, backgroundHeight, arcRadius, arcRadius, {
      fill: VIEW_BACKGROUND_COLOR,
      stroke: TEXT_COLOR_GRAY,
      lineWidth: 2
    } );

    // align expandCollapseButton and titleDisplayButton
    this.expandCollapseButton.left = backgroundRectangle.left + 7;
    this.expandCollapseButton.top = backgroundRectangle.top + 7;
    this.titleDisplayPanel.left = backgroundRectangle.left;
    this.titleDisplayPanel.top = backgroundRectangle.top;

    // draw right and left border rectangles, which serve to hide indicator line when it is off the graph
    const borderWidth = 400;
    const borderHeight = 1000;
    const rightBorder = new Rectangle(
      -backgroundWidth / 2 - borderWidth - 1,
      -0.8 * borderHeight, borderWidth,
      borderHeight,
      { fill: BACKGROUND_COLOR }
    );
    const leftBorder = new Rectangle(
      backgroundWidth / 2 + 1,
      -0.8 * borderHeight,
      borderWidth,
      borderHeight,
      { fill: BACKGROUND_COLOR }
    );

    this.graphAxesNode = new TrigTourGraphAxesNode( width, wavelength, numberOfWavelengths, this.amplitude, viewProperties );
    this.trigPlotsNode = new TrigPlotsNode( wavelength, numberOfWavelengths, this.amplitude, viewProperties.graphProperty );

    // SingularityIndicator is a dashed vertical line indicating singularity in tan function at angle = +/- 90 deg
    this.singularityIndicator = new Line( 0, -800, 0, 400, {
      stroke: TAN_COLOR,
      lineWidth: 2,
      lineDash: [ 10, 5 ],
      cursor: 'pointer'
    } );

    // Lines are not draggable.  An invisible rectangle needs to cover the singularity indicator so that the user
    // can  drag it once it appears.
    hitBound = 20;
    const minY = this.singularityIndicator.bottom;
    const maxY = this.singularityIndicator.top;
    midX = this.singularityIndicator.centerX;

    this.singularityRectangle = new Rectangle( midX - hitBound, minY, midX + 2 * hitBound, -maxY, {
      cursor: 'pointer',
      visible: false,
      opacity: 0, // this needs to be completely invisible
      center: this.singularityIndicator.center,

      // This Node will become visible/invisible when there is a singularity, but that should not interrupt
      // input with the graph. See https://github.com/phetsims/trig-tour/issues/106.
      interruptSubtreeOnInvisible: false
    } );

    this.singularityIndicator.visible = false;
    this.trigPlotsNode.addChild( this.singularityIndicator );
    this.trigPlotsNode.addChild( this.singularityRectangle );

    this.trigIndicatorArrowNode = new TrigIndicatorArrowNode( this.amplitude, Orientation.VERTICAL, {
      tailWidth: 4,
      lineWidth: 1,
      headWidth: 12,
      headHeight: 20,
      cursor: 'pointer',

      // pdom - this is the Node that receives the input listener so it needs to be focusable
      tagName: 'div',
      focusable: true,
      accessibleName: TrigTourStrings.a11y.graphLine.accessibleNameStringProperty,
      helpText: TrigTourStrings.a11y.graphLine.helpTextStringProperty
    } );

    const interactionArea = new Bounds2( -hitBound, -height / 2, hitBound, height / 2 );
    this.trigIndicatorArrowNode.mouseArea = interactionArea;
    this.trigIndicatorArrowNode.touchArea = interactionArea;
    this.redDotHandle = new Circle( 7, { stroke: LINE_COLOR, fill: 'red', cursor: 'pointer' } );
    this.trigIndicatorArrowNode.addChild( this.redDotHandle );

    // All graphic elements, curves, axes, labels, etc are placed on display node, with visibility set by
    // expandCollapseButton
    const displayNode = new Node();

    // Rendering order for display children.
    displayNode.children = [
      this.graphAxesNode.axisNode,
      this.trigPlotsNode,
      this.graphAxesNode.labelsNode,
      this.trigIndicatorArrowNode,
      rightBorder,
      leftBorder
    ];

    this.children = [
      backgroundRectangle,
      this.titleDisplayPanel,
      this.expandCollapseButton,
      displayNode
    ];

    // link visibility to the expandCollapseButton
    this.expandedProperty.link( expanded => {
      backgroundRectangle.visible = expanded;
      displayNode.visible = expanded;
      this.titleDisplayPanel.visible = !expanded;
    } );

    const dragHandler = new SoundRichDragListener(
      {
        keyboardDragListenerOptions: TrigTourConstants.KEYBOARD_DRAG_LISTENER_OPTIONS,
        drag: ( event: SceneryEvent, listener: KeyboardDragListener | DragListener ) => {
          let fullAngle;

          // make sure the full angle does not exceed max allowed angle
          trigTourModel.checkMaxAngleExceeded();

          const oldValue = trigTourModel.getFullAngleInRadians();

          // For alt input, use modelDelta to increment/decrement the full angle
          if ( event.isFromPDOM() ) {
            fullAngle = trigTourModel.getNextFullDeltaFromKeyboardInput( listener.modelDelta, viewProperties.specialAnglesVisibleProperty.value );
          }
          else {

            // With mouse movement, calculate the full angle based on the x position of the indicator arrow
            const position = this.trigIndicatorArrowNode.globalToParentPoint( event.pointer.point );   //returns Vector2
            fullAngle = ( 2 * Math.PI * position.x / wavelength );   // in radians
          }

          trigTourModel.setNewFullAngle( fullAngle, viewProperties.specialAnglesVisibleProperty.value );

          // After the new value has been computed, play the sound if the value has changed
          const newValue = trigTourModel.getFullAngleInRadians();
          if ( oldValue !== newValue ) {
            if ( event.isFromPDOM() ) {
              angleSoundGenerator.playSoundForValueChange( newValue, oldValue );
            }
            else {
              angleSoundGenerator.playSoundIfThresholdReached( newValue, oldValue );
            }
          }
        }
      } );

    // add a drag handler to the indicatorArrowNode
    this.trigIndicatorArrowNode.addInputListener( dragHandler );
    this.singularityRectangle.addInputListener( dragHandler );

    // Register for synchronization with model
    // function that reduces the indicator arrow tail width around the tan function singularity
    const setIndicatorTailWidth = () => {
      const tanSize = Math.abs( trigTourModel.tan() );
      if ( this.viewProperties.graphProperty.value === 'tan' && tanSize > 1.5 ) {
        this.trigIndicatorArrowNode.setTailWidth( Math.max( 2, 5 - 0.1 * tanSize ) );
      }
      else {
        this.trigIndicatorArrowNode.setTailWidth( 5 );
      }
    };

    trigTourModel.fullAngleProperty.link( fullAngle => {
      const xPos = fullAngle / ( 2 * Math.PI ) * wavelength;
      this.trigIndicatorArrowNode.x = xPos;
      this.singularityIndicator.x = xPos;
      this.singularityRectangle.x = xPos;
      setIndicatorTailWidth();
      this.setTrigIndicatorArrowNode();
    } );

    viewProperties.graphProperty.link( graph => {
      // whenever the graph changes, make sure that the trigIndicatorArrowNode has a correctly sized tail width
      setIndicatorTailWidth();

      // set title bar in GraphView
      this.setTitleBarText( graph );
      if ( trigTourModel.singularityProperty.value ) {
        if ( graph === 'cos' || graph === 'sin' ) {
          this.trigIndicatorArrowNode.opacity = 1;
          this.singularityIndicator.visible = false;
          this.singularityRectangle.visible = false;
        }
        else {
          // always want indicatorLine grabbable, so do NOT want indicatorLine.visible = false
          this.trigIndicatorArrowNode.opacity = 0;
          this.singularityIndicator.visible = true;
          this.singularityRectangle.visible = true;
        }
      }
      this.setTrigIndicatorArrowNode();
    } );

    trigTourModel.singularityProperty.link( singularity => {
      if ( this.viewProperties.graphProperty.value === 'tan' ) {
        this.singularityIndicator.visible = singularity;
        this.singularityRectangle.visible = singularity;
        // trigIndicatorArrowNode must always be draggable, so it must adjust visibility by setting opacity
        if ( singularity ) {
          this.trigIndicatorArrowNode.opacity = 0;
        }
        else {
          this.trigIndicatorArrowNode.opacity = 1;
        }
      }
    } );
  }


  /**
   * Set the indicator line, which is a draggable, vertical arrow indicating current position on graph.
   */
  private setTrigIndicatorArrowNode(): void {
    const cosNow = this.trigTourModel.cos();
    const sinNow = this.trigTourModel.sin();
    const tanNow = this.trigTourModel.tan();

    const setIndicatorAndHandle = ( trigValue: number, indicatorColor: TPaint ) => {
      this.trigIndicatorArrowNode.setEndPoint( trigValue * this.amplitude );
      this.trigIndicatorArrowNode.setColor( indicatorColor );
      this.redDotHandle.y = -trigValue * this.amplitude;
    };

    const selectedGraph = this.viewProperties.graphProperty.value;
    if ( selectedGraph === 'cos' ) {
      setIndicatorAndHandle( cosNow, COS_COLOR );
    }
    else if ( selectedGraph === 'sin' ) {
      setIndicatorAndHandle( sinNow, SIN_COLOR );
    }
    else if ( selectedGraph === 'tan' ) {
      setIndicatorAndHandle( tanNow, TAN_COLOR );
    }
  }

  /**
   * Set the title bar text.  Different strings in the title require different font styles. HTML text should be
   * avoided because it causes issues in performance.  So the text is built up here.
   *
   * @param trigString - the type of trig function to be displayed in the title
   */
  private setTitleBarText( trigString: Graph ): void {

    // determine the appropriate trig function string for the title.
    let trigTitleString: string;
    if ( trigString === 'cos' ) {
      trigTitleString = cosString;
    }
    if ( trigString === 'sin' ) {
      trigTitleString = sinString;
    }
    else if ( trigString === 'tan' ) {
      trigTitleString = tanString;
    }

    const definedTrigTitleString = trigTitleString!;
    assert && assert( definedTrigTitleString, `trigTitleString is not defined for trigString: ${trigString}` );

    // create each text component
    const variableThetaText = new Text( MathSymbols.THETA, { font: ITALIC_DISPLAY_FONT } );
    const vsText = new Text( vsString, { font: DISPLAY_FONT } );

    // build up and format the title
    const trigFunctionLabelText = new TrigFunctionLabelText( definedTrigTitleString );

    // everything formatted in an HBox
    const titleTextHBox = new HBox( {
      children: [ trigFunctionLabelText, vsText, variableThetaText ],
      spacing: 6,
      resize: false
    } );

    // update the content of the title HBox, removing the title child, and inserting it back after update
    this.titleDisplayHBox.removeChildWithIndex( this.graphTitle, this.titleDisplayHBox.children.indexOf( this.graphTitle ) );
    this.graphTitle = titleTextHBox;
    this.titleDisplayHBox.insertChild( this.titleDisplayHBox.children.length, this.graphTitle );
  }
}

trigTour.register( 'GraphView', GraphView );

export default GraphView;