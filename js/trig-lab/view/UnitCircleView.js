/**
 * Created by Dubson on 6/2/2015.
 */
define( function( require ) {
    'use strict';

    // modules
    var inherit = require( 'PHET_CORE/inherit' );
    var Node = require( 'SCENERY/nodes/Node' );
    var SimpleDragHandler = require( 'SCENERY/input/SimpleDragHandler' );
    var Circle = require( 'SCENERY/nodes/Circle' );
    var Line = require( 'SCENERY/nodes/Line' );
    var Rectangle = require( 'SCENERY/nodes/Rectangle' );
    var Vector2 = require( 'DOT/Vector2' );
    var Shape = require( 'KITE/Shape' );
    var Path = require( 'SCENERY/nodes/Path' );


    /**
     * Constructor for RotorNode which renders rotor as a scenery node.
     * @param {TrigLabModel} model is the main model of the sim
     * @constructor
     */
    function UnitCircleView( model  ) {

        var unitCircleView = this;
        this.model = model;

        // Call the super constructor
        Node.call( unitCircleView, {
        } );

        var radius = 150; //radius of unit circle in pixels
        var circleGraphic = new Circle( radius, { stroke:'#000', lineWidth: 3 } );    //provides origin for rotorGraphic
        var rotorWidth = 10
        var rotorGraphic = new Rectangle( 0, -rotorWidth/2, radius, rotorWidth, { fill: '#090', cursor: 'pointer' } );
        //rotorGraphic.translation = new Vector2( 0, -30 );
        var axleLocation = new Vector2( 1.5*radius, 1.2*radius );
        var mouseDownPosition = new Vector2( 0, 0 );   //just for testing
        circleGraphic.translation = axleLocation;

        unitCircleView.addChild( circleGraphic );

        //Draw x-, y-axes on circleGraphic
        var axesShape = new Shape();
        axesShape.moveTo( -1.2*radius, 0 ).lineTo( +1.2*radius, 0 );
        axesShape.moveTo( 0, -1.2*radius ).lineTo( 0, 1.2*radius );
        var axesPath = new Path( axesShape, { stroke: '#000', lineWidth: 3} );
        circleGraphic.addChild( axesPath );

        circleGraphic.addChild( rotorGraphic );

        // When dragging, move the sample element
        rotorGraphic.addInputListener( new SimpleDragHandler(
                {
                    // When dragging across it in a mobile device, pick it up
                    allowTouchSnag: true,

                    start: function (e){
                        console.log( 'mouse down' );
                        mouseDownPosition = e.pointer.point;
                        console.log( mouseDownPosition );
                    },

                    drag: function(e){
                        //console.log('drag event follows: ');
                        var v1 =  rotorGraphic.globalToParentPoint( e.pointer.point );   //returns Vector2
                        var angle = v1.angle();
                        //console.log( 'angle is ' + angle );
                        model.angle = angle;
                    }
                } ) );

        // Register for synchronization with model.
        model.angleProperty.link( function( angle ) {
            rotorGraphic.rotation = angle;
        } );

    }

    return inherit( Node, UnitCircleView );
} );