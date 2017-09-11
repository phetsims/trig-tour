// Copyright 2015, University of Colorado Boulder

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
define( function( require ) {
  'use strict';

  // modules
  var Bounds2 = require( 'DOT/Bounds2' );
  var Circle = require( 'SCENERY/nodes/Circle' );
  var ExpandCollapseButton = require( 'SUN/ExpandCollapseButton' );
  var HBox = require( 'SCENERY/nodes/HBox' );
  var HSeparator = require( 'SUN/HSeparator' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Line = require( 'SCENERY/nodes/Line' );
  var Node = require( 'SCENERY/nodes/Node' );
  var Panel = require( 'SUN/Panel' );
  var PhetFont = require( 'SCENERY_PHET/PhetFont' );
  var Property = require( 'AXON/Property' );
  var Rectangle = require( 'SCENERY/nodes/Rectangle' );
  var SimpleDragHandler = require( 'SCENERY/input/SimpleDragHandler' );
  var Text = require( 'SCENERY/nodes/Text' );
  var TrigFunctionLabelText = require( 'TRIG_TOUR/trig-tour/view/TrigFunctionLabelText' );
  var TrigIndicatorArrowNode = require( 'TRIG_TOUR/trig-tour/view/TrigIndicatorArrowNode' );
  var TrigPlotsNode = require( 'TRIG_TOUR/trig-tour/view/TrigPlotsNode' );
  var trigTour = require( 'TRIG_TOUR/trigTour' );
  var TrigTourColors = require( 'TRIG_TOUR/trig-tour/view/TrigTourColors' );
  var TrigTourGraphAxesNode = require( 'TRIG_TOUR/trig-tour/view/TrigTourGraphAxesNode' );
  var TrigTourModel = require( 'TRIG_TOUR/trig-tour/model/TrigTourModel' );

  //strings
  var cosString = require( 'string!TRIG_TOUR/cos' );
  var sinString = require( 'string!TRIG_TOUR/sin' );
  var tanString = require( 'string!TRIG_TOUR/tan' );
  var thetaString = require( 'string!TRIG_TOUR/theta' );
  var vsString = require( 'string!TRIG_TOUR/vs' );

  //constants
  var BACKGROUND_COLOR = TrigTourColors.BACKGROUND_COLOR;
  var COS_COLOR = TrigTourColors.COS_COLOR;
  var SIN_COLOR = TrigTourColors.SIN_COLOR;
  var TAN_COLOR = TrigTourColors.TAN_COLOR;
  var LINE_COLOR = TrigTourColors.LINE_COLOR;
  var TEXT_COLOR_GRAY = TrigTourColors.TEXT_COLOR_GRAY;
  var VIEW_BACKGROUND_COLOR = TrigTourColors.VIEW_BACKGROUND_COLOR;
  var DISPLAY_FONT = new PhetFont( 20 );
  var ITALIC_DISPLAY_FONT = new PhetFont( { size: 20, style: 'italic' } );

  /**
   * Constructor for view of Graph, which displays sin, cos, or tan vs angle theta in either degrees or radians, and
   * has a draggable handle for changing the angle.
   *
   * @param {TrigTourModel} trigTourModel
   * @param {number} height of y-axis on graph
   * @param {number} width of x-axis on graph
   * @param {ViewProperties} viewProperties - which graph is visible, one of 'cos', 'sin', or 'tan'
   * @constructor
   */
  function GraphView( trigTourModel, height, width, viewProperties ) {

    // Call the super constructor
    var self = this;
    Node.call( self );

    // @private
    this.trigTourModel = trigTourModel;
    this.viewProperties = viewProperties;
    this.expandedProperty = new Property( true ); // @private, Graph can be hidden with expandCollapse button

    // Graph drawing code is determined empirically, numbers are chosen based on what 'looks good'.
    var marginWidth = 25;   // distance between edge of Node and edge of nearest full wavelength
    var wavelength = ( width - 2 * marginWidth ) / 4;  //wavelength of sinusoidal curve in view coordinates
    this.amplitude = 0.475 * height;  // @private amplitude of sinusoidal curve in view coordinates
    var numberOfWavelengths = 2 * 2;    // number of full wavelengths displayed, must be even to keep graph symmetric

    var buttonSeparator = new HSeparator( 17, { stroke: BACKGROUND_COLOR } );

    // @private
    this.graphTitle = new Text( '', { font: DISPLAY_FONT, maxWidth: width / 3 } );
    this.titleDisplayHBox = new HBox( { children: [ buttonSeparator, this.graphTitle ], spacing: 5 } );

    var panelOptions = {
      fill: 'white',
      stroke: TEXT_COLOR_GRAY,
      lineWidth: 2, // width of the background border
      xMargin: 12,
      yMargin: 5,
      cornerRadius: 5, // radius of the rounded corners on the background
      // resize: false, // dynamically resize when content bounds change
      backgroundPickable: false,
      align: 'left', // {string} horizontal of content in the pane, left|center|right
      minWidth: 0 // minimum width of the panel
    };

    // @private when graph is collapsed/hidden, a title is displayed
    this.titleDisplayPanel = new Panel( this.titleDisplayHBox, panelOptions );
    this.expandCollapseButton = new ExpandCollapseButton( this.expandedProperty, {
      sideLength: 15,
      cursor: 'pointer'
    } );
    var hitBound = 30;
    var midX = this.expandCollapseButton.centerX;
    var midY = this.expandCollapseButton.centerY;
    this.expandCollapseButton.mouseArea = new Bounds2( midX - hitBound, midY - hitBound, midX + hitBound, midY + hitBound );
    this.expandCollapseButton.touchArea = new Bounds2( midX - hitBound, midY - hitBound, midX + hitBound, midY + hitBound );

    // draw white background
    var backgroundHeight = 1.2 * height;
    var backgroundWidth = 1.05 * width;
    var arcRadius = 10;
    var backgroundRectangle = new Rectangle( -backgroundWidth / 2, -( backgroundHeight / 2 ) - 5, backgroundWidth, backgroundHeight, arcRadius, arcRadius, {
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
    var borderWidth = 400;
    var borderHeight = 1000;
    var rightBorder = new Rectangle(
      -backgroundWidth / 2 - borderWidth - 1,
      -0.8 * borderHeight, borderWidth,
      borderHeight,
      { fill: BACKGROUND_COLOR }
    );
    var leftBorder = new Rectangle(
      backgroundWidth / 2 + 1,
      -0.8 * borderHeight,
      borderWidth,
      borderHeight,
      { fill: BACKGROUND_COLOR }
    );

    // @public (read-only) axes node for displaying axes on the graph
    this.graphAxesNode = new TrigTourGraphAxesNode( width, wavelength, numberOfWavelengths, this.amplitude, viewProperties );

    // @public (read-only) node containing paths of the trig curves sin, cos, and tan
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
    var minY = this.singularityIndicator.bottom;
    var maxY = this.singularityIndicator.top;
    midX = this.singularityIndicator.centerX;

    // debugger;
    this.singularityRectangle = new Rectangle( midX - hitBound, minY, midX + 2 * hitBound, -maxY, {
      cursor: 'pointer',
      visible: false,
      opacity: 0, // this needs to be completely invisible
      center: this.singularityIndicator.center
    } );

    this.singularityIndicator.visible = false;
    this.trigPlotsNode.addChild( this.singularityIndicator );
    this.trigPlotsNode.addChild( this.singularityRectangle );

    // trigIndicatorArrowNode is a vertical arrow on the trig curve showing current value of angle and
    // trigFunction(angle) a red dot on top of the indicator line echoes red dot on unit circle
    this.trigIndicatorArrowNode = new TrigIndicatorArrowNode( this.amplitude, 'vertical', {
      tailWidth: 4,
      lineWidth: 1,
      headWidth: 12,
      headHeight: 20,
      cursor: 'pointer'
    } );

    var interactionArea = new Bounds2( -hitBound, -height / 2, hitBound, height / 2 );
    this.trigIndicatorArrowNode.mouseArea = interactionArea;
    this.trigIndicatorArrowNode.touchArea = interactionArea;
    this.redDotHandle = new Circle( 7, { stroke: LINE_COLOR, fill: 'red', cursor: 'pointer' } );
    this.trigIndicatorArrowNode.addChild( this.redDotHandle );

    // All graphic elements, curves, axes, labels, etc are placed on display node, with visibility set by
    // expandCollapseButton
    var displayNode = new Node();

    // Rendering order for display children.
    displayNode.children = [
      this.graphAxesNode.axisNode,
      this.trigPlotsNode,
      this.graphAxesNode.labelsNode,
      this.trigIndicatorArrowNode,
      rightBorder,
      leftBorder
    ];

    self.children = [
      backgroundRectangle,
      this.titleDisplayPanel,
      this.expandCollapseButton,
      displayNode
    ];

    // link visibility to the expandCollapseButton
    this.expandCollapseButton.expandedProperty.link( function( expanded ) {
      backgroundRectangle.visible = expanded;
      displayNode.visible = expanded;
      self.titleDisplayPanel.visible = !expanded;
    } );

    var dragHandler = new SimpleDragHandler(
      {
        allowTouchSnag: true,

        drag: function( e ) {
          var position = self.trigIndicatorArrowNode.globalToParentPoint( e.pointer.point );   //returns Vector2
          var fullAngle = ( 2 * Math.PI * position.x / wavelength );   // in radians

          // make sure the full angle does not exceed max allowed angle
          trigTourModel.checkMaxAngleExceeded();

          if ( !trigTourModel.maxAngleExceededProperty.value ) {
            if ( !viewProperties.specialAnglesVisibleProperty.value ) {
              trigTourModel.setFullAngleInRadians( fullAngle );
            }
            else {
              trigTourModel.setSpecialAngleWithFullAngle( fullAngle );
            }
          }
          else {
            // max angle exceeded, ony update if user tries to decrease magnitude of fullAngle
            if ( Math.abs( fullAngle ) < TrigTourModel.MAX_FULL_ANGLE ) {
              trigTourModel.setFullAngleInRadians( fullAngle );
            }
          }

        }
      } );

    // add a drag handler to the indicatorArrowNode
    this.trigIndicatorArrowNode.addInputListener( dragHandler );
    this.singularityRectangle.addInputListener( dragHandler );

    // Register for synchronization with model
    // function that reduces the indicator arrow tail width around the tan function singularity
    var setIndicatorTailWidth = function() {
      var tanSize = Math.abs( trigTourModel.tan() );
      if ( self.viewProperties.graphProperty.value === 'tan' && tanSize > 1.5 ) {
        self.trigIndicatorArrowNode.setTailWidth( Math.max( 2, 5 - 0.1 * tanSize ) );
      }
      else {
        self.trigIndicatorArrowNode.setTailWidth( 5 );
      }
    };

    trigTourModel.fullAngleProperty.link( function( fullAngle ) {
      var xPos = fullAngle / (2 * Math.PI) * wavelength;
      self.trigIndicatorArrowNode.x = xPos;
      self.singularityIndicator.x = xPos;
      self.singularityRectangle.x = xPos;
      setIndicatorTailWidth();
      self.setTrigIndicatorArrowNode();
    } );

    viewProperties.graphProperty.link( function( graph ) {
      // whenever the graph changes, make sure that the trigIndicatorArrowNode has a correctly sized tail width
      setIndicatorTailWidth();

      // set title bar in GraphView
      self.setTitleBarText( graph );
      if ( trigTourModel.singularityProperty.value ) {
        if ( graph === 'cos' || graph === 'sin' ) {
          self.trigIndicatorArrowNode.opacity = 1;
          self.singularityIndicator.visible = false;
          self.singularityRectangle.visible = false;
        }
        else {
          // always want indicatorLine grabbable, so do NOT want indicatorLine.visible = false
          self.trigIndicatorArrowNode.opacity = 0;
          self.singularityIndicator.visible = true;
          self.singularityRectangle.visible = true;
        }
      }
      self.setTrigIndicatorArrowNode();
    } );

    trigTourModel.singularityProperty.link( function( singularity ) {
      if ( self.viewProperties.graphProperty.value === 'tan' ) {
        self.singularityIndicator.visible = singularity;
        self.singularityRectangle.visible = singularity;
        // trigIndicatorArrowNode must always be draggable, so it must adjust visibility by setting opacity
        if ( singularity ) {
          self.trigIndicatorArrowNode.opacity = 0;
        }
        else {
          self.trigIndicatorArrowNode.opacity = 1;
        }
      }
    } );
  }

  trigTour.register( 'GraphView', GraphView );

  return inherit( Node, GraphView, {

    /**
     * Set the indicator line, which is a draggable, vertical arrow indicating current location on graph.
     */
    setTrigIndicatorArrowNode: function() {
      var self = this;

      var cosNow = this.trigTourModel.cos();
      var sinNow = this.trigTourModel.sin();
      var tanNow = this.trigTourModel.tan();

      var setIndicatorAndHandle = function( trigValue, indicatorColor ) {
        self.trigIndicatorArrowNode.setEndPoint( trigValue * self.amplitude );
        self.trigIndicatorArrowNode.setColor( indicatorColor );
        self.redDotHandle.y = -trigValue * self.amplitude;
      };
      if ( this.viewProperties.graphProperty.value === 'cos' ) {
        setIndicatorAndHandle( cosNow, COS_COLOR );
      }
      else if ( this.viewProperties.graphProperty.value === 'sin' ) {
        setIndicatorAndHandle( sinNow, SIN_COLOR );
      }
      else if ( this.viewProperties.graphProperty.value === 'tan' ) {
        setIndicatorAndHandle( tanNow, TAN_COLOR );
      }
      else {
        //Do nothing, following line for debugging only
        console.error( 'ERROR in GraphView.setTrigIndicatorArrowNode()' );
      }
    },

    /**
     * Set the title bar text.  Different strings in the title require different font styles.  HTML text should be
     * avoided because it causes issues in performance.  So the text is built up here.
     *
     * @param {string} trigString - the label for the trig function
     *
     */
    setTitleBarText: function( trigString ) {

      // determine the appropriate trig function string for the title.
      var trigTitleString;
      if ( trigString === 'cos' ) {
        trigTitleString = cosString;
      }
      if ( trigString === 'sin' ) {
        trigTitleString = sinString;
      }
      else if ( trigString === 'tan' ) {
        trigTitleString = tanString;
      }

      // create each text component
      var variableThetaText = new Text( thetaString, { font: ITALIC_DISPLAY_FONT } );
      var vsText = new Text( vsString, { font: DISPLAY_FONT } );

      // build up and format the title
      var trigFunctionLabelText = new TrigFunctionLabelText( trigTitleString );

      // everything formatted in an HBox
      var titleTextHBox = new HBox( {
        children: [ trigFunctionLabelText, vsText, variableThetaText ],
        spacing: 6,
        resize: false
      } );

      // update the content of the title HBox, removing the title child, and inserting it back after update
      this.titleDisplayHBox.removeChildWithIndex( this.graphTitle, this.titleDisplayHBox.children.indexOf( this.graphTitle ) );
      this.graphTitle = titleTextHBox;
      this.titleDisplayHBox.insertChild( this.titleDisplayHBox.children.length, this.graphTitle );

    }
  } );
} );