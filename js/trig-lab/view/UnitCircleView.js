/**
 * Unit Circle View
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
    var PhetFont = require( 'SCENERY_PHET/PhetFont' );
    var Shape = require( 'KITE/Shape' );
    var SimpleDragHandler = require( 'SCENERY/input/SimpleDragHandler' );
    var Text = require( 'SCENERY/nodes/Text' );
    var Vector2 = require( 'DOT/Vector2' );

    //strings
    var xStr = 'x';
    var yStr = 'y';
    var oneStr = '1';
    var plusOneStr = '+1';
    var minusOneStr = '-1';
    var thetaStr = '\u03b8' ; // \u03b8 = unicode for theta

    //constants
    var DISPLAY_FONT = new PhetFont( 20 );
    var DISPLAY_FONT_SMALL = new PhetFont( 18 );

    /**
     * View of the unit circle with grabbable radial arm, called the rotor arm
     * @param {TrigLabModel} model is the main model of the sim
     * @constructor
     */

    function UnitCircleView( model  ) {

        var unitCircleView = this;
        this.model = model;
        var trigLabModel = model;
        //this.labelsVisible = 'false';  //set by Control Panel

        // Call the super constructor
        Node.call( unitCircleView );

        //Draw Unit Circle
        var radius = 160; //radius of unit circle in pixels
        var circleGraphic = new Circle( radius, { stroke:'#000', lineWidth: 3 } );    //provides parent node and origin for rotorGraphic
        //unitCircleView.addChild( circleGraphic );

        //Draw 'special angle' locations on unit circle
        //special angles are at 0, 30, 45, 60, 90, 120, 135, 150, 180, -30, ...
        this.specialAnglesNode = new Node();
        var anglesArray = [ 0, 30, 45, 60, 90, 120, 135, 150, 180, -30, -45, -60, -90, -120, -135, -150 ];
        var xPos, yPos; //x and y coordinates of special angle on unit circle
        for (var i = 0; i < anglesArray.length; i++ ){
            xPos = radius*Math.cos( anglesArray[i]*Math.PI/180 );
            yPos = radius*Math.sin( anglesArray[i]*Math.PI/180 );
            this.specialAnglesNode.addChild( new Circle( 5, { stroke:'#000', fill:'#fff', lineWidth: 1, x: xPos, y: yPos }));
        }

        //Draw x-, y-axes with x and y labels
        var yAxis = new ArrowNode( 0, 1.2*radius, 0, -1.2*radius, { tailWidth: 1 });//function ArrowNode( tailX, tailY, tipX, tipY, options ) {
        var xAxis = new ArrowNode( -1.2*radius, 0, 1.2*radius, 0, { tailWidth: 1 });//function ArrowNode( tailX, tailY, tipX, tipY, options ) {

        //Draw and position x-, y-axis labels
        var fontInfo = { font: DISPLAY_FONT }//'20px sans-serif' };
        var xText = new Text( xStr, fontInfo );
        var yText = new Text( yStr, fontInfo );
        xAxis.addChild( xText );
        yAxis.addChild( yText );
        xText.left = 1.2*radius + 5;
        xText.centerY = yAxis.centerY;
        yText.right = -12;
        yText.top = -1.2*radius - 2;


        //Draw Grid, simple square grid, with labels x = +/-1, y = +/-1;
        var r = radius;
        var gridShape = new Shape();
        gridShape.moveTo( -r, -r );
        gridShape.lineTo( r, -r ).lineTo( r, r ).lineTo( -r, r ).lineTo( -r, -r );
        gridShape.moveTo( -r, -r/2 ).lineTo( r, -r/2 ).moveTo( -r, r/2 ).lineTo( r, r/2 );
        gridShape.moveTo( -r/2, -r ).lineTo( -r/2, r ).moveTo( r/2, -r ).lineTo( r/2, r );
        this.grid = new Path( gridShape, { lineWidth: 2, stroke: '#aaa' });
        //+1, -1 labels on grid axes
        fontInfo = { font: DISPLAY_FONT_SMALL }; //'18px sans-serif' };
        var plusOneXText = new Text( plusOneStr, fontInfo );
        var minusOneXText = new Text( minusOneStr, fontInfo );
        var plusOneYText = new Text( plusOneStr, fontInfo );
        var minusOneYText = new Text( minusOneStr, fontInfo );
        var oneLabels = [ plusOneXText, minusOneXText, plusOneYText, minusOneYText ];
        this.grid.children = oneLabels;

        //position one labels
        plusOneXText.left = this.grid.right + 5;
        plusOneXText.top = 7;
        minusOneXText.right = this.grid.left - 5;
        minusOneXText.top = 7;
        plusOneYText.bottom = this.grid.top;
        plusOneYText.left = 5;
        minusOneYText.top = this.grid.bottom;
        minusOneYText.right = -5;
        this.grid.visible = false;

        //draw vertical (sine) line on rotor triangle
        var vLine = new Line( 0, 0, 0, -radius, {lineWidth: 6, stroke: '#090'} );

        //draw horizontal (cosine) line on rotor triangle
        var hLine = new Line( 0, 0, radius, 0, {lineWidth: 8, stroke: '#00b'} );

        //Draw rotor arm with grabbable red dot at end
        var rotorGraphic = new Node();                  //Rectangle( 0, -rotorWidth/2, radius, rotorWidth, { fill: '#090', cursor: 'pointer' } );
        rotorGraphic.addChild( new Line( 0,0, radius, 0, { lineWidth: 3, stroke: '#000'} ) );
        rotorGraphic.addChild( new Circle( 7, { stroke: '#000', fill: "red", x: radius, y: 0, cursor: 'pointer' } )) ;
        var hitBound = 30;
        rotorGraphic.mouseArea = new Bounds2( radius - hitBound, -hitBound, radius + hitBound, hitBound ) ; //Bounds2( minX, minY, maxX, maxY )

        //lay on the children!
        unitCircleView.children = [ this.grid, circleGraphic, xAxis, yAxis, hLine, vLine, this.specialAnglesNode, rotorGraphic ];

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
        rotorGraphic.addInputListener( new SimpleDragHandler(
                {
                    // When dragging across it in a mobile device, pick it up
                    allowTouchSnag: true,

                    start: function (e){
                        console.log( 'mouse down' );
                        mouseDownPosition = e.pointer.point;
                    },

                    drag: function(e){
                        //console.log('drag event follows: ');
                        var v1 =  rotorGraphic.globalToParentPoint( e.pointer.point );   //returns Vector2
                        var angle = -v1.angle();  //model angle is negative of xy coords angle
                        //console.log( 'angle is ' + angle );
                        //console.log( 'UnitCircleView line 137, specialAngleMode = '+ model.specialAnglesMode )
                        if( !model.specialAnglesMode ){
                            model.setAngle( angle );
                        }else{
                            model.setSpecialAngle( angle );
                        }
                    }
                } ) );

        //draw angle arc on unit circle
        r = 0.3*radius;   //arc radius = 0.3 of rotor radius
        var arcShape = new Shape();
        var angleArcPath = new Path( arcShape, { stroke: '#000', lineWidth: 2} );
        //following code is to speed up drawing
        var emptyBounds = new Bounds2( 0, 0, 0, 0 );
        angleArcPath.computeShapeBounds = function(){
             return emptyBounds;
        } ;

        //draw AngleArcArrowHead
        var arrowHeadShape = new Shape();
        var hW = 7;     //arrow head width
        var hL = 12;    //arrow head length
        arrowHeadShape.moveTo( 0, 0 ).lineTo( -hW/2, hL ).lineTo( hW/2, hL ).close();
        var angleArcArrowHead = new Path( arrowHeadShape, { lineWidth: 1, fill: '#000'});
        angleArcPath.addChild( angleArcArrowHead );
        circleGraphic.addChild( angleArcPath );
        var drawAngleArc = function(){
            var arcShape = new Shape();  //This seems wasteful. But there is now Shape.clear() function
            r = 0.3*radius;
            arcShape.moveTo( r, 0 );
            var totalAngle = model.getAngleInRadians();

            var dAng = 0.1;  //delta-angle in radians
            if( Math.abs(totalAngle) < 0.5 ){
                dAng = 0.02;
            }
            var ang = 0;  //short for angle
            if( totalAngle >0 ){
                for( ang = 0; ang <= totalAngle; ang += dAng ){
                    //console.log( 'angle is '+ang );
                    r -= dAng;
                    arcShape.lineTo( r*Math.cos( ang ), -r*Math.sin( ang ) ) ;
                }
            }else{
                for( ang = 0; ang >= totalAngle; ang -= dAng ){
                    //console.log( 'angle is '+ang );
                    r -= dAng;
                    arcShape.lineTo( r*Math.cos( ang ), -r*Math.sin( ang ) );
                }
            }

            //console.log( 'drawAngleArc called. Angle = '+ model.getAngleInDegrees() );
            angleArcPath.setShape( arcShape );
            if( Math.abs( totalAngle ) < 20*Math.PI/180 ){
                angleArcArrowHead.visible = false;
            }else{
                angleArcArrowHead.visible = true;
            }
            angleArcArrowHead.x = r*Math.cos( totalAngle );
            angleArcArrowHead.y = -r*Math.sin( totalAngle );
            //angleArcArrowHead.rotation = 0;
            if( totalAngle < 0 ){
                angleArcArrowHead.rotation = Math.PI - totalAngle - (6/r); //model.smallAngle*180/Math.PI;
            }else{
                angleArcArrowHead.rotation = -totalAngle + (6/r); //-model.smallAngle*180/Math.PI;
            }
        };   //end drawAngleArc

        //position x, y, and '1' labels on the xyR triangle
        var labelCanvas = new Node();
        unitCircleView.addChild( labelCanvas );
        fontInfo = { font: DISPLAY_FONT };
        var oneText = new Text( oneStr, fontInfo );
        xText = new Text( xStr, fontInfo );            //xText, yText already defined above
        yText = new Text( yStr, fontInfo );
        var thetaText = new Text( thetaStr, fontInfo );
        var labelsArr = [ oneText, xText, yText, thetaText ] ;
        labelCanvas.children = labelsArr;

        this.setLabelVisibility = function( isVisible ){
            positionLabels();
            labelCanvas.visible = isVisible;
        };

        //position the x, y, and '1' labels on the xyR triangle of the unit circle
        var positionLabels = function( ){
            var smallAngle = trigLabModel.getSmallAngleInRadians();
            var totalAngle = trigLabModel.getAngleInRadians();
            var pi = Math.PI;
            //set visibility of the labels
            if( Math.abs( totalAngle ) < 20*pi/180 ){
                thetaText.visible = false;
            }else{
                thetaText.visible = true;
            }
            var sAngle = Math.abs( smallAngle*180/pi );
            if( sAngle < 10 || (180 - sAngle) < 10 ){
                yText.visible = false;
            } else{
                yText.visible = true;
            }
            if( Math.abs(90 - sAngle) < 5 ){
                xText.visible = false;
            }else{
                xText.visible = true;
            }
            //position one-label
            var angleOffset = 9*pi/180;
            var sign = 1;

            if( ( smallAngle > pi/2 && smallAngle < pi ) ||( smallAngle > -pi/2 && smallAngle < 0 )){
                sign = -1;
            }
            var xInPix = radius*Math.cos( smallAngle + sign*angleOffset );
            var yInPix = radius*Math.sin( smallAngle + sign*angleOffset );
            oneText.centerX = 0.6*xInPix;// - 0.5*oneText.width;
            oneText.centerY = - 0.6*yInPix;// -0.5*oneText.height;
            //position x-label
            var xPos = 0.5*radius*Math.cos( smallAngle );// - 0.5*xText.width;
            var yPos = 0.6*xText.height;
            if( smallAngle < 0 ){ yPos = -0.6*xText.height; }
            xText.centerX = xPos;
            xText.centerY = yPos;
            //position y-label
            sign = 1;
            if( ( smallAngle > pi/2 && smallAngle < pi ) ||( smallAngle > -pi && smallAngle < -pi/2 )){
                sign = -1;
            }
            xPos = radius*Math.cos(smallAngle)+ sign*xText.width; //- 0.5*xText.width
            yPos = -0.5*radius*Math.sin( smallAngle );// - 0.5*yText.height;
            yText.centerX = xPos;
            yText.centerY = yPos;
            //show and position theta-label on angle arc if arc is greater than 20 degs
            xPos = 0.37*radius*Math.cos( totalAngle/2 );// - 0.5*thetaText.width;
            yPos = -0.37*radius*Math.sin( totalAngle/2 );// - 0.5*thetaText.height;
            thetaText.centerX = xPos;
            thetaText.centerY = yPos;
        };//end positionLabels()



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
            positionLabels();
        } );
    }//end constructor

    return inherit( Node, UnitCircleView );
} );