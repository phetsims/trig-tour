/**
 * Created by Dubson on 6/16/2015.
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
    var Util = require( 'TRIG_LAB/trig-lab/common/Util' );

    //var SIN_COLOR = Util.SIN_COLOR;
    //var COS_COLOR = Util.COS_COLOR;
    //var TAN_COLOR = Util.TAN_COLOR;


    /**
     * Constructor for ArrowLine which renders rotor as a scenery node.
     * @param {Number} x1, y1 is start point of arrow
     * @param {Number} y1, y1 is start point of arrow
     * @param {Number} x2, y1 is start point of arrow
     * @param {Number} y2, y1 is start point of arrow
     * @param {Object} options passed to Line
     * @constructor
     */
    function ArrowLine( x1, y1, x2, y2,  options  ) {

        var arrowLine = this;
        // Call the super constructor
        Node.call( arrowLine );

        var arrowHeadShape = new Shape();
        var hW = 20;     //arrow head width
        this.hL = 30;    //arrow head length

        this.vertical = ( y2 !== y1 );  //true if arrowLine is vertical
        if( this.vertical ){
            y2 += this.hL;
        }else{
            x2 -= this.hL;
        }
        this.myLine = new Line( x1, x2, y1, y2, options );
        if( this.vertical ){     //if arrow is vertical
            // arrow head initially pointing tip up, origin of arrow head at tip
            arrowHeadShape.moveTo( 0, 0 ).lineTo( -hW/2, this.hL ).lineTo( hW/2, this.hL ).close();
        }else{
            // arrow head initially pointing tip right, origin of arrow head at tip
            arrowHeadShape.moveTo( 0, 0 ).lineTo( -this.hL, hW/2 ).lineTo( -this.hL, -hW/2 ).close();
        }
        this.arrowHead = new Path( arrowHeadShape, { lineWidth: 1, fill: this.myLine.stroke });
        if( this.vertical ){
            this.arrowHead.y = y2 - this.hL;  //assumes y2 < y1, i.e. arrow is pointing up
        }else{
            this.arrowHead.x = x2 + this.hL;
        }

        arrowLine.addChild( this.arrowHead );
        arrowLine.addChild( this.myLine );



    }//end constructor

    return inherit( Node, ArrowLine, {
        setColor: function( color ){
            this.myLine.stroke = color;
            this.arrowHead.fill = color;
        },
        setPoint2: function( x2, y2 ){

            if( this.vertical ){
                this.myLine.setPoint2( x2, y2 + this.hL );
               this.arrowHead.y = y2 - this.hL;
            }else{
                this.arrowHead.x = x2 + this.hL ;
            }
        }
    } ); //end return inherit
} );
