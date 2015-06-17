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
     * @param {Number} maxLength of arrow in pixels
     * @param {String} orientation = 'v' or 'h' for vertical or horizontal
     * @param {Object} options passed to Line
     * @constructor
     */
    function ArrowLine( maxLength, orientation,  options  ) {

        var arrowLine = this;
        this.maxLength = maxLength;
        this.vertical = ( orientation === 'v' );
        this.options = options;
        // Call the super constructor
        Node.call( arrowLine );

        var arrowHeadShape = new Shape();
        var hW = 20;     //arrow head width
        this.hL = 30;    //arrow head length

        if( this.vertical ){
            this.line = new Line( 0, 0, 0, 0, options );
            arrowHeadShape.moveTo( 0, 0 ).lineTo( -hW/2, this.hL ).lineTo( hW/2, this.hL ).close();
        }else{
            this.line = new Line( 0, 0, 0, 0, options );
            arrowHeadShape.moveTo( 0, 0 ).lineTo( -this.hL, hW/2 ).lineTo( -this.hL, -hW/2 ).close();
        }

        this.arrowHead = new Path( arrowHeadShape, { lineWidth: 1, fill: this.line.stroke });
        if( this.vertical ){
            this.arrowHead.y = maxLength;  //assumes y2 < y1, i.e. arrow is pointing up
        }else{
            this.arrowHead.x = maxLength;
        }
        this.line.addChild( this.arrowHead );
        arrowLine.addChild( this.line );
    }//end constructor

    return inherit( Node, ArrowLine, {
        setColor: function( color ){
            this.line.stroke = color;
            this.arrowHead.fill = color;
        },
        setEndPoint: function( displacement ){
            console.log( 'vertical = ' + this.vertical + '   displacement = ' + displacement );
            var sign = 0;  //+1, -1, or zero depending on sign of displacement
            if( displacement !== 0 ){
                sign = Math.round( displacement / Math.abs( displacement ) ); //+1 if pointing up/right, -1 if pointing down/left
            }
            this.arrowHead.rotation = (sign - 1)*Math.PI/2;
            this.scale( 1, 1 );
            var length = Math.abs( displacement );
            var critFraction = 0.4;
            var scaleFactor = 1;
            if( this.vertical ){
                if( length > 0.4*this.maxLength ){
                    this.line.setPoint2( 0, -displacement + sign*this.hL );
                    this.arrowHead.y = -displacement;
                }else{  //if too small for arrowHead to fit
                    this.line.setPoint2( 0, sign*critFraction*this.maxLength + sign*this.hL );
                    this.arrowHead.y = sign*critFraction*this.maxLength;
                    scaleFactor = length/( critFraction*this.maxLength );
                    this.scale( 1, scaleFactor );
                }
            }else{  //if horizontal
                if( Math.abs( displacement ) > critFraction*this.maxLength ){
                    this.line.setPoint2( displacement - sign*this.hL, 0 );
                    this.arrowHead.x = displacement;
                }else{  //if too small for arrowHead to fit
                    this.line.setPoint2( sign*critFraction*this.maxLength - sign*this.hL, 0  );
                    this.arrowHead.x = sign*critFraction*this.maxLength;
                    scaleFactor = length/( critFraction*this.maxLength );
                    this.scale( scaleFactor, 1 );
                }

            }
        }
    } ); //end return inherit
} );
