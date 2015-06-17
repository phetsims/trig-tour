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
    //var FractionNode = require( 'TRIG_LAB/trig-lab/view/FractionNode' );
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
    //var Vector2 = require( 'DOT/Vector2' );



    //strings
    var theta = require( 'string!TRIG_LAB/theta' );
    var cosTheta = require( 'string!TRIG_LAB/cos' ) + theta ;
    var sinTheta = require( 'string!TRIG_LAB/sin' ) + theta ;
    var tanTheta = require( 'string!TRIG_LAB/tan' ) + theta ;
    var pi = require( 'string!TRIG_LAB/pi' );

    //constants
    var COS_COLOR = Util.COS_COLOR;
    var SIN_COLOR = Util.SIN_COLOR;
    var TAN_COLOR = Util.TAN_COLOR;
    var LINE_COLOR = Util.LINE_COLOR;
    var TEXT_COLOR = Util.TEXT_COLOR;
    //var DISPLAY_FONT = new PhetFont( 20 );
    var DISPLAY_FONT_SMALL = new PhetFont( 18 );
    var DISPLAY_FONT_ITALIC = new PhetFont( { size: 20, style: 'italic' } );
    var DISPLAY_FONT_SMALL_ITALIC = new PhetFont({ size: 18, family: 'Arial', style: 'italic' } );

    /**
     * Constructor for view of Graph, which displays sin, cos, or tan vs angle theta in either degrees or radians,
     * has a draggable handle for changing the angle
     * @param {TrigLabModel} main model of the sim
     * @param {Number} height of this view node in pixels
     * @param {Number} width of this view node in pixels
     * @constructor
     */

    function GraphView( model, height, width  ) {      //height and width of this view

        var graphView = this;
        this.model = model;
        this.trigFunction = '';  //{string} 'cos'|/'sin'/'tan' set by Control Panel
        this.labelsVisible = 'false';  //set by Control Panel
        //console.log( 'GraphView height = ' + height + '   GraphView.width = ' + width );
        //console.log( 'line color is ' + LINE_COLOR );
        //console.log( 'superscript test: ' + testText.getText() );

        // Call the super constructor
        Node.call( graphView );

        var wavelength = (width - 2*25)/4;  //wavelength of sinusoidal curve in pixels
        this.amplitude = 0.45*height;  //amplitude of sinusiodal curve in pixels
        var nbrOfWavelengths = 2*2;  //number of full wavelengths displayed, must be even number to keep graph symmetric

        //draw x-, y-axes
        var xAxisLength = width;
        var xAxis = new ArrowNode( -xAxisLength/2, 0, xAxisLength/2, 0, { tailWidth: 1, fill: LINE_COLOR });  //tailX, tailY, tipX, tipY, options
        var yAxis = new ArrowNode( 0, 1.2*this.amplitude, 0, -1.3*this.amplitude, { tailWidth: 1, fill: LINE_COLOR } );
        this.axesNode = new Node();   //axes bounds are used in layout
        this.axesNode.children = [ xAxis, yAxis ];
        graphView.addChild( this.axesNode );

        //draw tic marks on x-, y-axes
        var ticLength = 5;
        for( var i = -nbrOfWavelengths; i <= nbrOfWavelengths; i++ ){
            var xTic = new Line( 0, ticLength, 0, -ticLength, { lineWidth: 2, fill: LINE_COLOR});
            xTic.x = i*wavelength/2;
            xAxis.addChild( xTic );
        }
        for( i = -1; i <=1; i+=2 ){
            var yTic = new Line( -ticLength, 0, ticLength, 0, { lineWidth: 2, fill: LINE_COLOR} );
            yTic.y = i*this.amplitude;
            yAxis.addChild( yTic );
        }

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
        graphView.addChild( this.tickMarkLabelsInDegrees );


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


        graphView.addChild( this.tickMarkLabelsInRadians );
        this.tickMarkLabelsInDegrees.visible = false;   //visibility set by Labels control in Control Panel and by degs/rads RBs in Readout Panel
        this.tickMarkLabelsInRadians.visible = false;

        //Axes labels
        var fontInfo = { font: DISPLAY_FONT_ITALIC, fill: TEXT_COLOR };
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
        //this.indicatorLine = new Line( 0, 0, 0, this.amplitude, { stroke: '#0B0', lineWidth: 6 } );
        this.indicatorLine = new ArrowLine( this.amplitude, 'v', { stroke: '#0d0', lineWidth: 6 }  );
        var hitBound = 30;
        this.redDotHandle = new Circle( 7, { stroke: LINE_COLOR, fill: "red", cursor: 'pointer' } ) ;
        this.redDotHandle.touchArea = new Bounds2( - hitBound, -hitBound, hitBound, hitBound ) ;
        this.indicatorLine.addChild( this.redDotHandle );

        graphView.addChild( this.sinPath );
        graphView.addChild( this.cosPath );
        graphView.addChild( this.tanPath );
        graphView.addChild( this.indicatorLine );

        // When dragging, move the sample element
        this.redDotHandle.addInputListener( new SimpleDragHandler(
                {
                    allowTouchSnag: true,

                    start: function ( e ) {
                        console.log( 'mouse down' );
                        var mouseDownPosition = e.pointer.point;
                        //console.log( 'GraphView mouseDownPos = '  + mouseDownPosition );
                    },

                    drag: function ( e ) {
                        //console.log('drag event follows: ');
                        var v1 = graphView.indicatorLine.globalToParentPoint( e.pointer.point );   //returns Vector2
                        var angle = (2*Math.PI*v1.x / wavelength);
                        //console.log( 'graphView drag. angle is ' + angle );
                        if( !model.specialAnglesMode ){
                            model.setFullAngleInRadians( angle );
                        }else{
                            model.setFullAngleInRadians( angle );
                            model.setSpecialAngle( model.getSmallAngleInRadians() );
                        }
                        //model.setAngle( angle );
                    }
                } ) );

        this.setLabelVisibility = function( tOrF ){
            this.labelsVisible = tOrF;
            //console.log( 'graph labels visibility is ' + this.labelsVisible );
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
            var angle = this.model.getAngleInRadians();
            var cos = Math.cos( angle );
            var sin = Math.sin( angle );
            var tan = Math.tan( angle );
            if( this.trigFunction === 'cos'){
                //this.indicatorLine.setPoint2( 0, -cos*this.amplitude );
                this.indicatorLine.setEndPoint( cos*this.amplitude );
                //this.indicatorLine.stroke = COS_COLOR;
                this.indicatorLine.setColor( COS_COLOR );
                this.redDotHandle.y = -cos*this.amplitude;
            }else if ( this.trigFunction === 'sin' ){
                //this.indicatorLine.setPoint2( 0, -sin*this.amplitude );
                this.indicatorLine.setEndPoint( sin*this.amplitude );
                //this.indicatorLine.stroke = SIN_COLOR;
                this.indicatorLine.setColor( SIN_COLOR );
                this.redDotHandle.y = -sin*this.amplitude;
            }else if ( this.trigFunction === 'tan' ){
                //this.indicatorLine.setPoint2( 0, -tan*this.amplitude );
                this.indicatorLine.setEndPoint( tan*this.amplitude );
                //this.indicatorLine.stroke = TAN_COLOR;
                this.indicatorLine.setColor( TAN_COLOR );
                this.redDotHandle.y = -tan*this.amplitude;
            }else { console.log( 'ERROR in GraphView.setIndicatorLine()'); }
        }
    }
        );
} );