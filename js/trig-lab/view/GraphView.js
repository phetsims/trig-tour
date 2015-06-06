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
    var inherit = require( 'PHET_CORE/inherit' );
    var Line = require( 'SCENERY/nodes/Line' );
    var Node = require( 'SCENERY/nodes/Node' );
    var Path = require( 'SCENERY/nodes/Path' );
    var Shape = require( 'KITE/Shape' );
    var SimpleDragHandler = require( 'SCENERY/input/SimpleDragHandler' );
    var Vector2 = require( 'DOT/Vector2' );
    /**
     * Constructor for RotorNode which renders rotor as a scenery node.
     * @param {TrigLabModel} model is the main model of the sim
     * @constructor
     */
    function GraphView( model  ) {

        var graphView = this;
        this.model = model;

        // Call the super constructor
        Node.call( graphView, { } );

        var stageW = 1054; //width of main stage in pixels
        var stageH = 614;  //height of main stage in pixels
        var wavelength = stageW/5;  //wavelength of sinusoidal curve in pixels
        var amplitude = stageH/8;  //amplitude of sinusiodal curve in pixels
        this.cosVisible = true;
        this.sinVisible = false;
        this.tanVisible = false;

        //draw x-, y-axes
        var xAxis = new ArrowNode( -0.45*stageW, 0, 0.45*stageW, 0, { tailWidth: 2 });  //tailX, tailY, tipX, tipY, options
        var yAxis = new ArrowNode( 0, 1.2*amplitude, 0, -1.3*amplitude, { tailWidth: 2 } );
        graphView.addChild( xAxis );
        graphView.addChild( yAxis );
        //var axesShape = new Shape();
        //axesShape.moveTo( -0.4*stageW, 0 ).lineTo( +0.4*stageW, 0 );
        //axesShape.moveTo( 0, -0.15*stageH ).lineTo( 0, 0.15*stageH );
        //var axesPath = new Path( axesShape, { stroke: '#000', lineWidth: 2} );
        //graphView.addChild( axesPath );

        //Draw sinusoidal curves
        var cosShape = new Shape();
        var sinShape = new Shape();
        var tanShape = new Shape();

        var nbrOfWavelengths = 2*2;
        var dx = wavelength/30;
        var nbrOfPoints = (nbrOfWavelengths)*wavelength/dx;
        var xOrigin = 0;
        var yOrigin = 0;
        var xPos = xOrigin - nbrOfPoints*dx/2 ;
        sinShape.moveTo( xPos, yOrigin - amplitude*Math.sin( 2*Math.PI*(xPos - xOrigin)/wavelength ) );
        cosShape.moveTo( xPos, yOrigin - amplitude*Math.cos( 2*Math.PI*(xPos - xOrigin)/wavelength ) );
        tanShape.moveTo( xPos, yOrigin - amplitude*Math.tan( 2*Math.PI*(xPos - xOrigin)/wavelength ) );

        //draw sinusoidal curves
        for (var i = 0; i < nbrOfPoints; i++ ){
            xPos += dx;
            sinShape.lineTo( xPos, yOrigin - amplitude*Math.sin( 2*Math.PI*(xPos - xOrigin)/wavelength ));
            cosShape.lineTo( xPos, yOrigin - amplitude*Math.cos( 2*Math.PI*(xPos - xOrigin)/wavelength ));
            tanShape.lineTo( xPos, yOrigin - amplitude*Math.tan( 2*Math.PI*(xPos - xOrigin)/wavelength ));
        }


        this.sinPath = new Path( sinShape, { stroke: '#090', lineWidth: 3} );
        this.cosPath = new Path( cosShape, { stroke: '#00f', lineWidth: 3} );
        this.tanPath = new Path( tanShape, { stroke: '#f00', lineWidth: 3} );
        var sinIndicator = new Line( 0, 0, 0, amplitude, { stroke: '#0f0', lineWidth: 6 } );
        var cosIndicator = new Line( 0, 0, 0, amplitude, { stroke: '#00f', lineWidth: 6 } );
        var tanIndicator = new Line( 0, 0, 0, amplitude, { stroke: '#f00', lineWidth: 6 } )

        graphView.addChild( this.sinPath );
        graphView.addChild( this.cosPath );
        graphView.addChild( this.tanPath );
        this.sinPath.addChild( sinIndicator );
        this.cosPath.addChild( cosIndicator );
        this.tanPath.addChild( tanIndicator );
        //graphView.addChild( axesPath );

        // When dragging, move the sample element
        sinIndicator.addInputListener( new SimpleDragHandler(
                {
                    // When dragging across it in a mobile device, pick it up
                    allowTouchSnag: true,

                    start: function (e){
                        console.log( 'mouse down' );
                        var mouseDownPosition = e.pointer.point;
                        console.log( mouseDownPosition );
                    },

                    drag: function(e){
                        //console.log('drag event follows: ');
                        var v1 =  angleIndicatorGraphic.globalToParentPoint( e.pointer.point );   //returns Vector2
                        var angle = -v1.angle();        //model angle is opposite of xy coords angle
                        //console.log( 'angle is ' + angle );
                        //model.angle = angle;
                        model.setAngle( angle );
                    }
                } ) );

        // Register for synchronization with model.
        model.angleProperty.link( function( angle ) {
            var cos = Math.cos( angle );
            var sin = Math.sin( angle );
            var tan = Math.tan( angle );
            var xPos = angle/(2*Math.PI)*wavelength;
            sinIndicator.x = xPos;
            cosIndicator.x = xPos;
            tanIndicator.x = xPos;
            sinIndicator.setPoint2( 0, -sin*amplitude );  //in model, +y is up; in screenCoords, +y is down, hence the minus sign
            cosIndicator.setPoint2( 0, -cos*amplitude );
            tanIndicator.setPoint2( 0, -tan*amplitude );
        } );

    }

    return inherit( Node, GraphView );
} );