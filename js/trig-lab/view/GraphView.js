/**
 * 
 * View of Graph of sin, cos, or tan vs. theta
 * Grabbable pointer indicates current value of theta and the function
 * Created by Dubson on 6/3/2015.
 */
define( function( require ) {
    'use strict';

    // modules
    var ArrowLine = require( 'TRIG_LAB/trig-lab/view/ArrowLine' );
    var ArrowNode = require( 'SCENERY_PHET/ArrowNode' );
    var Bounds2 = require( 'DOT/Bounds2' );
    var Circle = require( 'SCENERY/nodes/Circle' );
    var HTMLText = require( 'SCENERY/nodes/HTMLText' );
    var inherit = require( 'PHET_CORE/inherit' );
    var Line = require( 'SCENERY/nodes/Line' );
    var Node = require( 'SCENERY/nodes/Node' );
    var Path = require( 'SCENERY/nodes/Path' );
    var PhetFont = require( 'SCENERY_PHET/PhetFont' );
    var Shape = require( 'KITE/Shape' );
    var SimpleDragHandler = require( 'SCENERY/input/SimpleDragHandler' );
    var SubSupText = require( 'SCENERY_PHET/SubSupText' );
    var Text = require( 'SCENERY/nodes/Text' );
    var Util = require( 'TRIG_LAB/trig-lab/common/Util' );

    //strings
    var theta = require( 'string!TRIG_LAB/theta' );
    var cosStr = require( 'string!TRIG_LAB/cos' );
    var sinStr = require( 'string!TRIG_LAB/sin' );
    var tanStr = require( 'string!TRIG_LAB/tan' );
    //var cosTheta = require( 'string!TRIG_LAB/cos' ) + theta ;
    //var sinTheta = require( 'string!TRIG_LAB/sin' ) + theta ;
    //var tanTheta = require( 'string!TRIG_LAB/tan' ) + theta ;
    var pi = require( 'string!TRIG_LAB/pi' );

    //constants
    var COS_COLOR = Util.COS_COLOR;
    var SIN_COLOR = Util.SIN_COLOR;
    var TAN_COLOR = Util.TAN_COLOR;
    var LINE_COLOR = Util.LINE_COLOR;
    var TEXT_COLOR = Util.TEXT_COLOR;
    var DISPLAY_FONT = new PhetFont( 20 );
    var DISPLAY_FONT_SMALL = new PhetFont( 18 );
    var DISPLAY_FONT_ITALIC = new PhetFont( { size: 20, style: 'italic' } );
    var DISPLAY_FONT_SMALL_ITALIC = new PhetFont({ size: 18, family: 'Arial', style: 'italic' } );

    /**
     * Constructor for view of Graph, which displays sin, cos, or tan vs angle theta in either degrees or radians,
     * has a draggable handle for changing the angle
     * @param {TrigLabModel} model of the sim
     *
     *
     * @param {Number} height of this view node in pixels
     * @param {Number} width of this view node in pixels
     * @constructor
     */

    function GraphView( model, height, width  ) {      //height and width of this view

        var graphView = this;
        this.model = model;
        this.trigFunction = '';  //{string} 'cos'|/'sin'/'tan' set by Control Panel
        this.labelsVisible = 'false';  //set by Control Panel

        // Call the super constructor
        Node.call( graphView );

        var wavelength = (width - 2*25)/4;  //wavelength of sinusoidal curve in pixels
        this.amplitude = 0.45*height;  //amplitude of sinusiodal curve in pixels
        var nbrOfWavelengths = 2*2;  //number of full wavelengths displayed, must be even number to keep graph symmetric

        //draw x-, y-axes
        var xAxisLength = width;
        var xAxis = new ArrowNode( -xAxisLength/2, 0, xAxisLength/2, 0, { tailWidth: 1, fill: LINE_COLOR });  //tailX, tailY, tipX, tipY, options
        var yAxis = new ArrowNode( 0, 1.2*this.amplitude, 0, -1.3*this.amplitude, { tailWidth: 1, fill: LINE_COLOR } );

        //draw tic marks for x-, y-axes
        var ticLength = 5;
        var xTics = new Node();
        var yTics = new Node();
        var xTic;
        var yTic;
        for( var i = -2*nbrOfWavelengths; i <= 2*nbrOfWavelengths; i++ ){
            xTic = new Line( 0, ticLength, 0, -ticLength, { lineWidth: 2, stroke: LINE_COLOR});
            xTic.x = i*wavelength/4;
            xTics.addChild( xTic );
        }
        for( i = -1; i <=1; i+=2 ){
            yTic = new Line( -ticLength, 0, ticLength, 0, { lineWidth: 2, stroke: LINE_COLOR} );
            yTic.y = i*this.amplitude;
            yTics.addChild( yTic );
        }

        this.axesNode = new Node();   //axes bounds of this are used in layout
        this.axesNode.children = [ xAxis, yAxis ];

        //draw tic mark labels in degrees
        this.tickMarkLabelsInDegrees = new Node();
        var label;
        for( var j = -nbrOfWavelengths; j <= nbrOfWavelengths; j++ ){
            var nbrDegrees = 180*j.toFixed(0);
            //console.log('j = '+j+'   nbrDegrees = '+nbrDegrees );
            nbrDegrees = nbrDegrees.toString();
            label = new SubSupText( nbrDegrees+'<sup>o</sup>', { font: DISPLAY_FONT_SMALL } );
            label.centerX = j*wavelength/2;
            label.top = xAxis.bottom;
            if( j !== 0 ){
                this.tickMarkLabelsInDegrees.addChild( label ) ;
            }
        }

        //Tic mark labels in radians
        this.tickMarkLabelsInRadians = new Node();
        var labelStr = '' ;
        var labelStrings = [ '-4' + pi, '-3' + pi,  '-2' + pi, '-' + pi, pi, '2' + pi, '3' + pi, '4' + pi ];
        var xPositions = [ -4, -3, -2, -1, 1, 2, 3, 4 ];
        for ( i = 0; i < xPositions.length; i++ ){
            labelStr = labelStrings[i];
            label = new Text( labelStr, { font: DISPLAY_FONT_SMALL_ITALIC, fill: TEXT_COLOR } );
            label.centerX = xPositions[i]*wavelength/2;
            label.top = xAxis.bottom;
            this.tickMarkLabelsInRadians.addChild( label );
        }
        //visibility set by Labels control in Control Panel and by degs/rads RBs in Readout Panel
        this.tickMarkLabelsInDegrees.visible = false;
        this.tickMarkLabelsInRadians.visible = false;

        //Axes labels
        var fontInfo = { font: DISPLAY_FONT_ITALIC, fill: TEXT_COLOR };
        var thetaLabel = new Text( theta, fontInfo );
        thetaLabel.left = this.axesNode.right + 10; //= xAxis.right;
        thetaLabel.centerY = xAxis.centerY;
        this.cosThetaLabel = new HTMLText( cosStr + '<i>' + theta + '</i>',{ font: DISPLAY_FONT });
        this.sinThetaLabel = new HTMLText( sinStr + '<i>' + theta + '</i>',{ font: DISPLAY_FONT });
        this.tanThetaLabel = new HTMLText( tanStr + '<i>' + theta + '</i>',{ font: DISPLAY_FONT });
        this.cosThetaLabel.right = this.sinThetaLabel.right = this.tanThetaLabel.right  = yAxis.left - 10;
        this.cosThetaLabel.top = this.sinThetaLabel.top = this.tanThetaLabel.top =  yAxis.top;

        //Draw sinusoidal curves
        var cosShape = new Shape();
        var sinShape = new Shape();
        var tanShape = new Shape();
        var dx = wavelength/60;
        var nbrOfPoints = (nbrOfWavelengths)*wavelength/dx;
        var xOrigin = 0;
        var yOrigin = 0;
        var xPos = xOrigin - nbrOfPoints*dx/2 ;
        sinShape.moveTo( xPos, yOrigin - this.amplitude*Math.sin( 2*Math.PI*(xPos - xOrigin)/wavelength ) );
        cosShape.moveTo( xPos, yOrigin - this.amplitude*Math.cos( 2*Math.PI*(xPos - xOrigin)/wavelength ) );
        tanShape.moveTo( xPos, yOrigin - this.amplitude*Math.tan( 2*Math.PI*(xPos - xOrigin)/wavelength ) );

        //draw sin and cos curves
        for ( i = 0; i < nbrOfPoints; i++ ){
            xPos += dx;
            sinShape.lineTo( xPos, yOrigin - this.amplitude*Math.sin( 2*Math.PI*(xPos - xOrigin)/wavelength ));
            cosShape.lineTo( xPos, yOrigin - this.amplitude*Math.cos( 2*Math.PI*(xPos - xOrigin)/wavelength ));
        }

        xPos = xOrigin - nbrOfPoints*dx/2;
        var tanValue = Math.tan( 2*Math.PI*(xPos - xOrigin)/wavelength ) ;

        //draw tangent curve cut off at upper and lower limits
        for ( i = 0; i < nbrOfPoints; i++ ) {
            tanValue = Math.tan( 2 * Math.PI * (xPos - xOrigin) / wavelength );
            if ( (tanValue < 2) && (tanValue > -2) ) {
                tanShape.lineTo( xPos, yOrigin - this.amplitude * tanValue );
            }
            else {
                tanShape.moveTo( xPos, yOrigin - this.amplitude * tanValue );
            }
            xPos += dx;
        }

        this.sinPath = new Path( sinShape, { stroke: SIN_COLOR, lineWidth: 3} );
        this.cosPath = new Path( cosShape, { stroke: COS_COLOR, lineWidth: 3} );
        this.tanPath = new Path( tanShape, { stroke: TAN_COLOR, lineWidth: 3} );
        this.singularityIndicator = new Line( 0, -800, 0, 400, {stroke: TAN_COLOR, lineWidth: 2, lineDash: [10, 5] }  );
        this.singularityIndicator.visible = true;
        this.tanPath.addChild( this.singularityIndicator );

        //indicatorLine is a vertical arrow on the trig curve showing current value of angle and trigFunction(angle)
        //a red dot on top of the indicator line echoes red dot on unit circle
        this.indicatorLine = new ArrowLine( this.amplitude, 'v', { stroke: '#0d0', lineWidth: 5, criticalFactor: 2, arrowHeadLength: 20 }  );
        var hitBound = 30;
        this.redDotHandle = new Circle( 7, { stroke: LINE_COLOR, fill: "red", cursor: 'pointer' } ) ;
        this.redDotHandle.touchArea = new Bounds2( - hitBound, -hitBound, hitBound, hitBound ) ;
        this.indicatorLine.addChild( this.redDotHandle );

        //Order children views
        graphView.children = [
            this.axesNode,
            thetaLabel,
            this.cosThetaLabel,
            this.sinThetaLabel,
            this.tanThetaLabel,
            this.sinPath,
            this.cosPath,
            this.tanPath,
            this.tickMarkLabelsInDegrees,
            this.tickMarkLabelsInRadians,
            xTics,
            yTics,
            this.indicatorLine
        ];

        // When dragging, move the sample element
        this.redDotHandle.addInputListener( new SimpleDragHandler(
                {
                    allowTouchSnag: true,

                    start: function ( e ) {
                        console.log( 'mouse down' );
                        //var mouseDownPosition = e.pointer.point;
                        //console.log( 'GraphView mouseDownPos = '  + mouseDownPosition );
                    },

                    drag: function ( e ) {
                        var position = graphView.indicatorLine.globalToParentPoint( e.pointer.point );   //returns Vector2
                        var fullAngle = (2*Math.PI*position.x / wavelength);   //in radians

                        //Need small angle (-pi < angle < pi ) to set special angle
                        var smallAngleInRadians = fullAngle%(2*Math.PI);
                        var smallAngleInDegrees = smallAngleInRadians*180/(Math.PI);
                        if( smallAngleInDegrees > 0 && smallAngleInDegrees > 180 ){
                            smallAngleInDegrees -= 360;
                        }
                        if( smallAngleInDegrees < 0 && smallAngleInDegrees < -180 ){
                            smallAngleInDegrees += 360;
                        }
                        smallAngleInRadians = smallAngleInDegrees*Math.PI/180;

                        if( !model.specialAnglesMode ){
                            model.setFullAngleInRadians( fullAngle );
                        }else{
                            model.setSpecialAngle( smallAngleInRadians );
                        }
                    }
                } ) );

        this.setLabelVisibility = function( tOrF ){
            this.labelsVisible = tOrF;
        };

        // Register for synchronization with model.
        model.angleProperty.link( function( angle ) {
            var xPos = angle/(2*Math.PI)*wavelength;
            graphView.indicatorLine.x = xPos;
            graphView.singularityIndicator.x = xPos;
            graphView.setIndicatorLine();
        } );

        model.singularityProperty.link( function( singularity ) {
            graphView.singularityIndicator.visible = singularity;
            graphView.indicatorLine.visible = !singularity;
        } );

    }//end constructor

    return inherit( Node, GraphView, {
          setIndicatorLine: function() {
              var angle = this.model.getAngleInRadians();
              var cos = Math.cos( angle );
              var sin = Math.sin( angle );
              var tan = Math.tan( angle );
              if ( this.trigFunction === 'cos' ) {
                  this.indicatorLine.setEndPoint( cos * this.amplitude );
                  this.indicatorLine.setColor( COS_COLOR );
                  this.redDotHandle.y = -cos * this.amplitude;
              }
              else if ( this.trigFunction === 'sin' ) {
                  this.indicatorLine.setEndPoint( sin * this.amplitude );
                  this.indicatorLine.setColor( SIN_COLOR );
                  this.redDotHandle.y = -sin * this.amplitude;
              }
              else if ( this.trigFunction === 'tan' ) {
                  this.indicatorLine.setEndPoint( tan * this.amplitude );
                  this.indicatorLine.setColor( TAN_COLOR );
                  this.redDotHandle.y = -tan * this.amplitude;
              }
              else { console.log( 'ERROR in GraphView.setIndicatorLine()' ); }
          }
      }
    );
} );