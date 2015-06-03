/**
 * 
 * View of Graph of sin, cos, or tan vs. theta
 * Grabbable pointer indicates current value of theta and the function
 * Created by Dubson on 6/3/2015.
 */
define( function( require ) {
    'use strict';

    // modules
    var inherit = require( 'PHET_CORE/inherit' );
    var Node = require( 'SCENERY/nodes/Node' );
    var SimpleDragHandler = require( 'SCENERY/input/SimpleDragHandler' );
    //var Circle = require( 'SCENERY/nodes/Circle' );
    var Line = require( 'SCENERY/nodes/Line' );
    //var Rectangle = require( 'SCENERY/nodes/Rectangle' );
    var Vector2 = require( 'DOT/Vector2' );
    var Shape = require( 'KITE/Shape' );
    var Path = require( 'SCENERY/nodes/Path' );


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
        var wavelength = stageW/6;  //wavelength of sinusoidal curve in pixels
        var amplitude = stageH/15;  //amplitude of sinusiodal curve in pixels
        var stageGraphic = new Node();    //provides origin for onTopOfStageGraphics
        var originLocation = new Vector2( 0.5*stageW, 0.7*stageH );
        stageGraphic.translation = originLocation;

        //var axesGraphic = new Node();
        var axesShape = new Shape();
        axesShape.moveTo( -0.4*stageW, 0 ).lineTo( +0.4*stageW, 0 );
        axesShape.moveTo( 0, -0.15*stageH ).lineTo( 0, 0.15*stageH );
        var axesPath = new Path( axesShape, { stroke: '#000', lineWidth: 2} );
        stageGraphic.addChild( axesPath );
        
        //Draw sinusoidal curves
        var cosShape = new Shape();
        var sinShape = new Shape();
        var tanShape = new Shape();

        var nbrOfWavelengths = 2*3;
        var dx = wavelength/40;
        var nbrOfPoints = (nbrOfWavelengths)*wavelength/dx;
        var xOrigin = 0;
        var yOrigin = 0;
        var xPos = xOrigin - nbrOfPoints*dx/2 ;
        sinShape.moveTo( xPos, yOrigin - amplitude*Math.sin( 2*Math.PI*(xPos - xOrigin)/wavelength ) );
        cosShape.moveTo( xPos, yOrigin - amplitude*Math.cos( 2*Math.PI*(xPos - xOrigin)/wavelength ) );

        //draw sinusoidal curves
        for (var i = 0; i < nbrOfPoints; i++ ){
            xPos += dx;
            sinShape.lineTo( xPos, yOrigin - amplitude*Math.sin( 2*Math.PI*(xPos - xOrigin)/wavelength ));
            cosShape.lineTo( xPos, yOrigin - amplitude*Math.cos( 2*Math.PI*(xPos - xOrigin)/wavelength ));
        }


        var sinPath = new Path( sinShape, { stroke: '#090', lineWidth: 3} );//{fill: '#ff0'} );
        stageGraphic.addChild( sinPath );
        var myCosPath = new Path( cosShape, { stroke: '#00f', lineWidth: 3} );//{fill: '#ff0'} );
        stageGraphic.addChild( myCosPath );
        
        var angleIndicatorGraphic = new Node();

        graphView.addChild( stageGraphic );


        stageGraphic.addChild( axesPath );

        // When dragging, move the sample element
        angleIndicatorGraphic.addInputListener( new SimpleDragHandler(
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
                        var angle = v1.angle();
                        //console.log( 'angle is ' + angle );
                        model.angle = angle;
                    }
                } ) );

        // Register for synchronization with model.
        model.angleProperty.link( function( angle ) {
            angleIndicatorGraphic.translation = angle;
        } );

    }

    return inherit( Node, GraphView );
} );