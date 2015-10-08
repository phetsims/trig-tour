// Copyright 2002-2015, University of Colorado Boulder

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
  var TrigIndicatorArrowNode = require( 'TRIG_TOUR/trig-tour/view/TrigIndicatorArrowNode' );
  var Bounds2 = require( 'DOT/Bounds2' );
  var Circle = require( 'SCENERY/nodes/Circle' );
  var ExpandCollapseButton = require( 'SUN/ExpandCollapseButton' );
  var HBox = require( 'SCENERY/nodes/HBox' );
  var HTMLText = require( 'SCENERY/nodes/HTMLText' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Line = require( 'SCENERY/nodes/Line' );
  var Node = require( 'SCENERY/nodes/Node' );
  var Panel = require( 'SUN/Panel' );
  var PhetFont = require( 'SCENERY_PHET/PhetFont' );
  var Property = require( 'AXON/Property' );
  var Rectangle = require( 'SCENERY/nodes/Rectangle' );
  var SimpleDragHandler = require( 'SCENERY/input/SimpleDragHandler' );
  var TrigTourColors = require( 'TRIG_TOUR/trig-tour/view/TrigTourColors' );
  var TrigTourModel = require( 'TRIG_TOUR/trig-tour/model/TrigTourModel' );
  var TrigTourGraphAxesNode = require( 'TRIG_TOUR/trig-tour/view/TrigTourGraphAxesNode' );
  var TrigPlotsNode = require( 'TRIG_TOUR/trig-tour/view/TrigPlotsNode' );
  var HSeparator = require( 'SUN/HSeparator' );
  var StringUtils = require( 'PHETCOMMON/util/StringUtils' );

  //strings
  var thetaString = require( 'string!TRIG_TOUR/theta' );
  var cosString = require( 'string!TRIG_TOUR/cos' );
  var sinString = require( 'string!TRIG_TOUR/sin' );
  var tanString = require( 'string!TRIG_TOUR/tan' );
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
    var thisGraphView = this;
    Node.call( thisGraphView );

    // @private
    this.trigTourModel = trigTourModel;
    this.viewProperties = viewProperties;
    this.expandedProperty = new Property( true ); // @private, Graph can be hidden with expandCollapse button

    var marginWidth = 25;   // distance in pixels between edge of Node and edge of nearest full wavelength
    var wavelength = ( width - 2 * marginWidth ) / 4;  //wavelength of sinusoidal curve in pixels
    this.amplitude = 0.45 * height;  // @private amplitude of sinusoidal curve in pixels
    var numberOfWavelengths = 2 * 2;    // number of full wavelengths displayed, must be even to keep graph symmetric

    var buttonSeparator = new HSeparator( 17, { stroke: BACKGROUND_COLOR } );
    var graphTitlePattern = '{0}' + '<i>' + '{1}' + '</i>' + ' ' + '{2}' + '<i>' + ' ' + '{3}' + '</i>';
    // @private
    this.cosThetaVsThetaString = StringUtils.format( graphTitlePattern, cosString, thetaString, vsString, thetaString );
    this.sinThetaVsThetaString = StringUtils.format( graphTitlePattern, sinString, thetaString, vsString, thetaString );
    this.tanThetaVsThetaString = StringUtils.format( graphTitlePattern, tanString, thetaString, vsString, thetaString );

    // @private
    this.graphTitle = new HTMLText( this.tanThetaVsThetaString, { font: DISPLAY_FONT, maxWidth: width / 3 } );
    var titleDisplayHBox = new HBox( { children: [ buttonSeparator, this.graphTitle ], spacing: 5 } );

    var panelOptions = {
      fill: 'white',
      stroke: TEXT_COLOR_GRAY,
      lineWidth: 2, // width of the background border
      xMargin: 12,
      yMargin: 5,
      cornerRadius: 5, // radius of the rounded corners on the background
      resize: false, // dynamically resize when content bounds change
      backgroundPickable: false,
      align: 'left', // {string} horizontal of content in the pane, left|center|right
      minWidth: 0 // minimum width of the panel
    };

    // @private when graph is collapsed/hidden, a title is displayed
    this.titleDisplayPanel = new Panel( titleDisplayHBox, panelOptions );
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
    var backgroundRectangle = new Rectangle( -backgroundWidth / 2, -(backgroundHeight / 2) - 5, backgroundWidth, backgroundHeight, arcRadius, arcRadius, {
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
    this.singularityIndicator = new Line( 0, -800, 0, 400, { stroke: TAN_COLOR, lineWidth: 2, lineDash: [ 10, 5 ] } );
    hitBound = 20;
    midX = this.singularityIndicator.centerX;
    var minY = this.singularityIndicator.bottom;
    var maxY = this.singularityIndicator.top;
    this.singularityIndicator.mouseArea = new Bounds2( midX - hitBound, minY, midX + hitBound, maxY );
    this.singularityIndicator.touchArea = new Bounds2( midX - hitBound, minY, midX + hitBound, maxY );
    this.singularityIndicator.visible = false;
    this.trigPlotsNode.addChild( this.singularityIndicator );

    // trigIndicatorArrowNode is a vertical arrow on the trig curve showing current value of angle and trigFunction(angle)
    // a red dot on top of the indicator line echoes red dot on unit circle
    hitBound = 30;
    this.trigIndicatorArrowNode = new TrigIndicatorArrowNode( this.amplitude, 'vertical', {
      tailWidth: 5,
      headWidth: 12,
      headHeight: 20,
      cursor: 'pointer'
    } );
    this.trigIndicatorArrowNode.touchArea = new Bounds2( -hitBound, -300, hitBound, +100 );
    this.trigIndicatorArrowNode.mouseArea = new Bounds2( -hitBound, -300, hitBound, +100 );
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

    thisGraphView.children = [
      backgroundRectangle,
      this.titleDisplayPanel,
      this.expandCollapseButton,
      displayNode
    ];

    // link visibility to the expandCollapseButton
    this.expandCollapseButton.expandedProperty.link( function( expanded ) {
      backgroundRectangle.visible = expanded;
      displayNode.visible = expanded;
      thisGraphView.titleDisplayPanel.visible = !expanded;
    } );

    // add a drag handler to the indicatorArrowNode
    this.trigIndicatorArrowNode.addInputListener( new SimpleDragHandler(
      {
        allowTouchSnag: true,

        drag: function( e ) {
          var position = thisGraphView.trigIndicatorArrowNode.globalToParentPoint( e.pointer.point );   //returns Vector2
          var fullAngle = ( 2 * Math.PI * position.x / wavelength );   // in radians

          // make sure the full angle does not exceed max allowed angle
          trigTourModel.checkMaxAngleExceeded();

          if ( !trigTourModel.maxAngleExceeded ) {
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
      } ) );

    // Register for synchronization with model
    // function that reduces the indicator arrow tail width around the tan function singularity
    var setIndicatorTailWidth = function() {
      var tanSize = Math.abs( trigTourModel.tan() );
      if ( thisGraphView.viewProperties.graphProperty.value === 'tan' && tanSize > 1.5 ) {
        thisGraphView.trigIndicatorArrowNode.setTailWidth( Math.max( 2, 5 - 0.1 * tanSize ) );
      }
      else {
        thisGraphView.trigIndicatorArrowNode.setTailWidth( 5 );
      }
    };

    trigTourModel.fullAngleProperty.link( function( fullAngle ) {
      var xPos = fullAngle / (2 * Math.PI) * wavelength;
      thisGraphView.trigIndicatorArrowNode.x = xPos;
      thisGraphView.singularityIndicator.x = xPos;
      setIndicatorTailWidth();
      thisGraphView.setTrigIndicatorArrowNode();
    } );

    viewProperties.graphProperty.link( function( graph ) {
      // whenever the graph changes, make sure that the trigIndicatorArrowNode has a correctly sized tail width
      setIndicatorTailWidth();

      // set title bar in GraphView
      thisGraphView.setTitleBar( graph );
      if ( trigTourModel.singularity ) {
        if ( graph === 'cos' || graph === 'sin' ) {
          thisGraphView.trigIndicatorArrowNode.opacity = 1;
          thisGraphView.singularityIndicator.visible = false;
        }
        else {
          // always want indicatorLine grabbable, so do NOT want indicatorLine.visible = false
          thisGraphView.trigIndicatorArrowNode.opacity = 0;
          thisGraphView.singularityIndicator.visible = true;
        }
      }
      thisGraphView.setTrigIndicatorArrowNode();
    } );

    trigTourModel.singularityProperty.link( function( singularity ) {
      if ( thisGraphView.viewProperties.graphProperty.value === 'tan' ) {
        thisGraphView.singularityIndicator.visible = singularity;
        // trigIndicatorArrowNode must always be draggable, so it must adjust visibility by setting opacity
        if ( singularity ) {
          thisGraphView.trigIndicatorArrowNode.opacity = 0;
        }
        else {
          thisGraphView.trigIndicatorArrowNode.opacity = 1;
        }
      }
    } );
  }

  return inherit( Node, GraphView, {

    /**
     * Set the indicator line, which is a draggable, vertical arrow indicating current location on graph.
     */
    setTrigIndicatorArrowNode: function() {
      var thisGraphView = this;

      var cosNow = this.trigTourModel.cos();
      var sinNow = this.trigTourModel.sin();
      var tanNow = this.trigTourModel.tan();

      var setIndicatorAndHandle = function( trigValue, indicatorColor ) {
        thisGraphView.trigIndicatorArrowNode.setEndPoint( trigValue * thisGraphView.amplitude );
        thisGraphView.trigIndicatorArrowNode.setColor( indicatorColor );
        thisGraphView.redDotHandle.y = -trigValue * thisGraphView.amplitude;
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
     * Set the title bar text.
     *
     * @param {string} trigString
     */
    setTitleBar: function( trigString ) {
      if ( trigString === 'cos' ) {
        this.graphTitle.text = this.cosThetaVsThetaString;
      }
      else if ( trigString === 'sin' ) {
        this.graphTitle.text = this.sinThetaVsThetaString;
      }
      else if ( trigString === 'tan' ) {
        this.graphTitle.text = this.tanThetaVsThetaString;
      }
    }
  } );
} );