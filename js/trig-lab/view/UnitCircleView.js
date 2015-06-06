/**
 * Created by Dubson on 6/2/2015.
 */
define( function( require ) {
    'use strict';

    // modules
    var ArrowNode = require( 'SCENERY_PHET/ArrowNode' );
    var Bounds2 = require( 'DOT/Bounds2' );
    var Circle = require( 'SCENERY/nodes/Circle' );
    var inherit = require( 'PHET_CORE/inherit' );
    var Line = require( 'SCENERY/nodes/Line' );
    var Node = require( 'SCENERY/nodes/Node' );
    var Path = require( 'SCENERY/nodes/Path' );
    var Rectangle = require( 'SCENERY/nodes/Rectangle' );
    var Shape = require( 'KITE/Shape' );
    var SimpleDragHandler = require( 'SCENERY/input/SimpleDragHandler' );
    var Vector2 = require( 'DOT/Vector2' );

    /**
     * View of the unit circle with grabbable radial arm, called the rotor arm
     * @param {TrigLabModel} model is the main model of the sim
     * @constructor
     */
    function UnitCircleView( model  ) {

        var unitCircleView = this;
        this.model = model;

        // Call the super constructor
        Node.call( unitCircleView );

        //Draw Unit Circle
        var radius = 150; //radius of unit circle in pixels
        var circleGraphic = new Circle( radius, { stroke:'#000', lineWidth: 3 } );    //provides parent node and origin for rotorGraphic
        //var axleLocation = new Vector2( 1.5*radius, 1.2*radius );
        //circleGraphic.translation = axleLocation;
        unitCircleView.addChild( circleGraphic );

        //Draw x-, y-axes
        var yAxis = new ArrowNode( 0, 1.2*radius, 0, -1.2*radius, { tailWidth: 2 });//function ArrowNode( tailX, tailY, tipX, tipY, options ) {
        var xAxis = new ArrowNode( -1.2*radius, 0, 1.2*radius, 0, { tailWidth: 2 });//function ArrowNode( tailX, tailY, tipX, tipY, options ) {
        circleGraphic.addChild( yAxis );
        circleGraphic.addChild( xAxis );


        //draw vertical (sine) line on rotor triangle
        var vLine = new Line( 0, 0, 0, -radius, {lineWidth: 3, stroke: '#090'} );

        circleGraphic.addChild( vLine );

        //draw horizontal (cosine) line on rotor triangle
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

        //draw angle arc on unit circle
        var r = 0.3*radius;   //arc radius
        var arcShape = new Shape();
        //arcShape.moveTo( r, 0 );
        var angleArcPath = new Path( arcShape, { stroke: '#000', lineWidth: 1} );
        circleGraphic.addChild( angleArcPath );
        var drawAngleArc = function(){
            var arcShape = new Shape();
            arcShape.moveTo( r, 0 );
            var totalAngle = model.getAngleInRadians();
            for( var ang = 0; ang <= totalAngle; ang += 0.02 ){
                //console.log( 'angle is '+ang );
                arcShape.lineTo( r*Math.cos( ang ), -r*Math.sin( ang ) )
            };
            //console.log( 'drawAngleArc called. Angle = '+ model.getAngleInDegrees() );
            angleArcPath.setShape( arcShape );

        };

        // Register for synchronization with model.
        model.angleProperty.link( function( angle ) {
            rotorGraphic.rotation = -angle;  //model angle is negative of xy coords angle
            var cos = Math.cos( angle );
            var sin = Math.sin( angle );
            //hArrow.setScaleMagnitude( cos, 1 ) ;
            vLine.x = radius*cos;
            vLine.setPoint2( 0, -radius*sin  );
            hLine.setPoint2( radius*cos, 0 );
            drawAngleArc();
        } );

    }

    return inherit( Node, UnitCircleView );
} );