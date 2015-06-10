/**
 * 
 * View of Graph of sin, cos, or tan vs. theta
 * Grabbable pointer indicates current value of theta and the function
 * Created by Dubson on 6/3/2015.
 */
define( function( require ) {
    'use strict';

    // modules
    var ArrowNode = require( 'SCENERY_PHET/ArrowNode' );
    var Circle = require( 'SCENERY/nodes/Circle' );
    var FractionNode = require( 'TRIG_LAB/trig-lab/view/FractionNode' );
    var inherit = require( 'PHET_CORE/inherit' );
    var Line = require( 'SCENERY/nodes/Line' );
    var Node = require( 'SCENERY/nodes/Node' );
    var Path = require( 'SCENERY/nodes/Path' );
    var PhetFont = require( 'SCENERY_PHET/PhetFont' );
    var Shape = require( 'KITE/Shape' );
    var SimpleDragHandler = require( 'SCENERY/input/SimpleDragHandler' );
    var SubSupText = require( 'SCENERY_PHET/SubSupText' );
    var Text = require( 'SCENERY/nodes/Text' );
    //var Vector2 = require( 'DOT/Vector2' );
    /**
     * Constructor for RotorNode which renders rotor as a scenery node.
     * @param {TrigLabModel} model is the main model of the sim
     * @constructor
     */

    //strings
    var theta = '\u03b8' ; // \u03b8 = unicode for theta
    var cosTheta = 'cos' + theta ;
    var sinTheta = 'sin' + theta ;
    var tanTheta = 'tan' + theta ;
    var pi ='\u03c0';
    //var radiansPiLabels = [ '-3'+pi, '-2'+pi, -'1'+pi, '', '1'+pi, '2'+pi, '3'+pi ];
    //var radiansHalfPiLabels = [ '-5'+pi+'/2', '-3'+pi+'/2', '-'+pi+'/2', '', pi+'/2', '3'+pi+'/2', '5'+pi+'/2' ];
    //var degreesLabels;

    //constants
    var COS_COLOR = '#00c';
    var SIN_COLOR = '#0c0';
    var TAN_COLOR = '#d00';
    var DISPLAY_FONT = new PhetFont( 20 );
    var DISPLAY_FONT_SMALL = new PhetFont( 18 );


    function GraphView( model, height, width  ) {      //height and width of this view

        var graphView = this;
        this.model = model;
        this.trigFunction = '';  //{string} 'cos'|/'sin'/'tan' set by Control Panel
        this.labelsVisible = 'false';  //set by Control Panel
        //console.log( 'GraphView height = ' + height + '   GraphView.width = ' + width );

        // console.log( 'superscript test: ' + testText.getText() );

        // Call the super constructor
        Node.call( graphView, { } );


        var wavelength = width/4;  //wavelength of sinusoidal curve in pixels
        this.amplitude = 0.45*height;  //amplitude of sinusiodal curve in pixels
        var nbrOfWavelengths = 2*2;  //number of full wavelengths displayed, must be even number to keep graph symmetric

        //draw x-, y-axes
        var xAxisLength = width; //0.9*stageW;
        var xAxis = new ArrowNode( -xAxisLength/2, 0, xAxisLength/2, 0, { tailWidth: 1 });  //tailX, tailY, tipX, tipY, options
        var yAxis = new ArrowNode( 0, 1.2*this.amplitude, 0, -1.3*this.amplitude, { tailWidth: 1 } );
        this.axesNode = new Node();   //axes bounds are used in layout
        this.axesNode.children = [ xAxis, yAxis ];
        graphView.addChild( this.axesNode );

        //draw tic marks on x-, y-axes
        var ticLength = 5;
        for( var i = -nbrOfWavelengths; i < nbrOfWavelengths; i++ ){
            var xTic = new Line( 0, ticLength, 0, -ticLength, { lineWidth: 2, stroke: '#000'});
            xTic.x = i*wavelength/2;
            xAxis.addChild( xTic );
        }
        for( i = -1; i <=1; i+=2 ){
            var yTic = new Line( -ticLength, 0, ticLength, 0, { lineWidth: 2, stroke: '#000'} );
            yTic.y = i*this.amplitude;
            yAxis.addChild( yTic );
        }

        //draw tic mark labels in degrees
        this.tickMarkLabelsInDegrees = new Node();
        for( var j = -nbrOfWavelengths; j <= nbrOfWavelengths; j++ ){
            var nbrDegrees = 180*j.toFixed(0);
            //console.log('j = '+j+'   nbrDegrees = '+nbrDegrees );
            nbrDegrees = nbrDegrees.toString();
            var label = new SubSupText( nbrDegrees+'<sup>o</sup>', { font: DISPLAY_FONT_SMALL } );
            label.centerX = j*wavelength/2;
            label.top = xAxis.bottom;
            if( j != 0 ){
                this.tickMarkLabelsInDegrees.addChild( label ) ;
            }
        }
        graphView.addChild( this.tickMarkLabelsInDegrees );


        //Tick mark labels in radians
        this.tickMarkLabelsInRadians = new Node();
        var labelStr = '' ;
        var labelStrings = [ '-3' + pi,  '-2' + pi, '-' + pi, pi, '2' + pi, '3' + pi ];
        var xPositions = [ -3, -2, -1, 1, 2, 3 ];
        for ( i = 0; i < 6; i++ ){
            labelStr = labelStrings[i];
            var label = new Text( labelStr, { font: DISPLAY_FONT_SMALL } );
            label.centerX = xPositions[i]*wavelength/2;
            label.top = xAxis.bottom;
            this.tickMarkLabelsInRadians.addChild( label );
        }


        graphView.addChild( this.tickMarkLabelsInRadians );
        this.tickMarkLabelsInDegrees.visible = false;   //visibility set by Labels control in Control Panel and by degs/rads RBs in Readout Panel
        this.tickMarkLabelsInRadians.visible = false;

        //Axes labels
        var fontInfo = { font: DISPLAY_FONT };
        var thetaLabel = new Text( theta, fontInfo );
        //xAxis.addChild( thetaLabel );
        graphView.addChild( thetaLabel );
        thetaLabel.left = this.axesNode.right + 10; //= xAxis.right;
        thetaLabel.centerY = xAxis.centerY;
        this.cosThetaLabel = new Text( cosTheta, fontInfo );
        this.sinThetaLabel = new Text( sinTheta, fontInfo );
        this.tanThetaLabel = new Text( tanTheta, fontInfo );
        graphView.addChild( this.cosThetaLabel );
        graphView.addChild( this.sinThetaLabel );
        graphView.addChild( this.tanThetaLabel );
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


        this.sinPath = new Path( sinShape, { stroke: '#090', lineWidth: 3} );
        this.cosPath = new Path( cosShape, { stroke: '#00f', lineWidth: 3} );
        this.tanPath = new Path( tanShape, { stroke: '#f00', lineWidth: 3} );

        //indicatorLine is a vertical line on sine curve showing current value of angle and trigFunction(angle)
        //a red dot on top of the indicator line echoes red dot on unit circle
        this.indicatorLine = new Line( 0, 0, 0, this.amplitude, { stroke: '#0f0', lineWidth: 6 } );
        this.redDotHandle = new Circle( 7, { stroke: '#000', fill: "red", cursor: 'pointer' } ) ;
        this.indicatorLine.addChild( this.redDotHandle );

        graphView.addChild( this.sinPath );
        graphView.addChild( this.cosPath );
        graphView.addChild( this.tanPath );
        graphView.addChild( this.indicatorLine );

        // When dragging, move the sample element
        this.redDotHandle.addInputListener( new SimpleDragHandler(
                {
                    // When dragging across it in a mobile device, pick it up
                    allowTouchSnag: true,

                    start: function ( e ) {
                        console.log( 'mouse down' );
                        var mouseDownPosition = e.pointer.point;
                        console.log( 'GraphView mouseDownPos = '  + mouseDownPosition );
                    },

                    drag: function ( e ) {
                        //console.log('drag event follows: ');
                        var v1 = graphView.indicatorLine.globalToParentPoint( e.pointer.point );   //returns Vector2
                        var angle = 2*Math.PI*v1.x / wavelength;
                        //console.log( 'angle is ' + angle );
                        //model.angle = angle;
                        model.setAngle( angle );
                    }
                } ) );

        this.setLabelVisibility = function( tOrF ){
            this.labelsVisible = tOrF;
            console.log( 'graph labels visibility is ' + this.labelsVisible );
        };

        // Register for synchronization with model.
        model.angleProperty.link( function( angle ) {
            var xPos = angle/(2*Math.PI)*wavelength;
            graphView.indicatorLine.x = xPos;
            graphView.setIndicatorLine();
        } );

    }

    return inherit( Node, GraphView, {
        setIndicatorLine: function(){
            //var amplitude = 70;
            var angle = this.model.getAngleInRadians();
            var cos = Math.cos( angle );
            var sin = Math.sin( angle );
            var tan = Math.tan( angle );
            if( this.trigFunction == 'cos'){
                this.indicatorLine.setPoint2( 0, -cos*this.amplitude );
                this.indicatorLine.stroke = COS_COLOR;
                this.redDotHandle.y = -cos*this.amplitude;
            }else if ( this.trigFunction == 'sin' ){
                this.indicatorLine.setPoint2( 0, -sin*this.amplitude );
                this.indicatorLine.stroke = SIN_COLOR;
                this.redDotHandle.y = -sin*this.amplitude;
            }else if ( this.trigFunction == 'tan' ){
                this.indicatorLine.setPoint2( 0, -tan*this.amplitude );
                this.indicatorLine.stroke = TAN_COLOR;
                this.redDotHandle.y = -tan*this.amplitude;
            }else { console.log( 'ERROR in GraphView.setIndicatorLine()'); }
        }
    }
        );
} );