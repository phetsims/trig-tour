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
    var Bounds2 = require( 'DOT/Bounds2' );


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

        //Draw Unit Circle
        var radius = 150; //radius of unit circle in pixels
        var circleGraphic = new Circle( radius, { stroke:'#000', lineWidth: 3 } );    //provides origin for rotorGraphic
        var axleLocation = new Vector2( 1.5*radius, 1.2*radius );
        circleGraphic.translation = axleLocation;
        unitCircleView.addChild( circleGraphic );

        //Draw x-, y-axes on circleGraphic
        var axesShape = new Shape();
        axesShape.moveTo( -1.2*radius, 0 ).lineTo( +1.2*radius, 0 );
        axesShape.moveTo( 0, -1.2*radius ).lineTo( 0, 1.2*radius );
        var axesPath = new Path( axesShape, { stroke: '#000', lineWidth: 3} );
        circleGraphic.addChild( axesPath );

        //draw vertical line
        var vLine = new Line( 0, 0, 0, -radius, {lineWidth: 3, stroke: '#090'} );
        circleGraphic.addChild( vLine );

        //draw horizontal line
        var hLine = new Line( 0, 0, radius, 0, {lineWidth: 6, stroke: '#00f'} );
        circleGraphic.addChild( hLine );

        //Draw rotor arm
        var rotorWidth = 10
        var rotorGraphic = new Node();                  //Rectangle( 0, -rotorWidth/2, radius, rotorWidth, { fill: '#090', cursor: 'pointer' } );
        rotorGraphic.addChild( new Line( 0,0, radius, 0, { lineWidth: 3, stroke: '#000'} ) );
        rotorGraphic.addChild( new Circle( 7, { stroke: '#000', fill: "red", x: radius, y: 0, cursor: 'pointer' } )) ;
        var hitBound = 30;
        rotorGraphic.mouseArea = new Bounds2( radius - hitBound, -hitBound, radius + hitBound, hitBound ) ; //Bounds2( minX, minY, maxX, maxY )
        circleGraphic.addChild( rotorGraphic );
        //var mouseDownPosition = new Vector2( 0, 0 );   //just for testing



        ////draw horizontal (cosine) arrow
        //var hArrowShape = new Shape();
        //var w1 = 6;
        //var w2 = 8;
        //var hL = 25;
        //hArrowShape.moveTo( 0, w1/2 ).lineTo( 0, -w1/2 ).lineTo( radius- hL, -w1/2 ).lineTo( radius - hL, -w2 );
        //hArrowShape.lineTo( radius, 0 ).lineTo( radius - hL, w2 ).lineTo( radius - hL, w1/2 ).lineTo( 0, w1/2 );
        //var hArrow = new Path( hArrowShape, { fill: '#009'} );
        //circleGraphic.addChild( hArrow );



        var mouseDownPosition = new Vector2( 0, 0 );
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
                        var angle = -v1.angle();  //model angle is negative of xy coords angle
                        //console.log( 'angle is ' + angle );
                        model.setAngle( angle );
                    }
                } ) );

        // Register for synchronization with model.
        model.angleProperty.link( function( angle ) {
            rotorGraphic.rotation = -angle;  //model angle is negative of xy coords angle
            var cos = Math.cos( angle );
            var sin = Math.sin( angle );
            //hArrow.setScaleMagnitude( cos, 1 ) ;
            vLine.x = radius*cos;
            vLine.setPoint2( 0, -radius*sin  );
            hLine.setPoint2( radius*cos, 0 );
        } );

    }

    return inherit( Node, UnitCircleView );
} );