/**
 * Vertical or horizontal arrow,
 * consisting of a line and a triangular arrow-head,
 * used in UnitCircleView and GraphView
 * Created by Michael Dubson (PhET developer) on 6/16/2015.
 */

define( function( require ) {
    'use strict';

    // modules
    var inherit = require( 'PHET_CORE/inherit' );
    var Node = require( 'SCENERY/nodes/Node' );
    var Line = require( 'SCENERY/nodes/Line' );
    var Rectangle = require( 'SCENERY/nodes/Rectangle' );
    var Shape = require( 'KITE/Shape' );
    var Path = require( 'SCENERY/nodes/Path' );
    var Util = require( 'DOT/Util' );

    /**
     * Constructor for ArrowLine which renders rotor as a scenery node.
     * @param {Number} defaultLength of arrow in pixels
     * @param {String} orientation = 'v' or 'h' for vertical or horizontal
     * @param {Object} options passed to Line, plus extra options
     * @constructor
     */
    function ArrowLine( defaultLength, orientation,  options  ) {

        var arrowLine = this;
        this.vertical = ( orientation === 'v' );
        options = _.extend( {
            //if arrow length shorter than criticalFactor times arrow head length, then start scaling arrowLine
            criticalFactor: 2,
            arrowHeadLength: 25     //arrow head length in pixels
        }, options );
        this.options = options;

        Node.call( arrowLine );
        this.criticalFactor = options.criticalFactor;
        this.arrowHeadLength = options.arrowHeadLength;
        this.arrowHeadWidth = (3/5)*this.arrowHeadLength;

        //arrowLine consists of Line and triangular arrowHead Path
        this.line = new Line( 0, 0, 0, 0, options );
        this.arrowHeadShape = new Shape();
        this.arrowHead = new Path( this.arrowHeadShape, { lineWidth: 1, fill: this.line.stroke });

        arrowLine.drawArrowHead( this.arrowHeadLength );

        //place arrowHead on end of Line
        if( this.vertical ){
            this.arrowHead.y = defaultLength;
        }else{
            this.arrowHead.x = defaultLength;
        }
        this.canvas = new Node();
        this.line.addChild( this.arrowHead );

        //overlay invisible rectangle on top of line, to activate mouse cursor
        //Rectangle( x, y, width, height, arcWidth, arcHeight, options )
        this.mouseMarker = new Rectangle( -10, -50, 20, 100, { fill: 'green', opacity: 0, cursor: 'pointer' });

        //need mouse pointer active only for vertical line in graphView
        if( orientation === 'v'){
            this.line.addChild( this.mouseMarker );
        }

        this.canvas.addChild( this.line );
        arrowLine.addChild( this.canvas );
    }//end constructor

    return inherit( Node, ArrowLine, {
        setColor: function( color ){
            this.line.stroke = color;
            this.arrowHead.fill = color;
        },

        //set position of tip of arrow head and size arrow appropriately
        //displacement is signed length of arrow, displacement is + if arrow points right, or - if arrow points left
        setEndPoint: function( displacement ){
            var sign = 0;  //+1, -1, or zero depending on sign of displacement
            if( displacement !== 0 ){
                //sign = +1 if arrow pointing up or right, -1 if pointing down or left
                sign = Util.roundSymmetric( displacement / Math.abs( displacement ) );
            }
            this.arrowHead.setRotation( (sign - 1)*Math.PI/2 );
            var length = Math.abs( displacement );
            var scaleFactor;
            if( this.vertical ){
                if( length > this.criticalFactor*this.arrowHeadLength ){   //if arrow long enough
                    this.drawArrowHead( this.arrowHeadLength);
                    //factor of 0.9 so that arrowHead overlaps line slightly
                    this.line.setPoint2( 0, -displacement + 0.9*sign*this.arrowHeadLength );
                    if( sign > 0 ){
                        this.mouseMarker.setRect( -10, -length, 20, length );
                    }else{
                        this.mouseMarker.setRect( -10, 0, 20, length );
                    }
                    this.arrowHead.y = -displacement;
                }else{    //if arrow too small for arrowHead to fit
                    scaleFactor = Math.max( 0.1, length/( this.criticalFactor*this.arrowHeadLength ));
                    this.drawArrowHead( this.arrowHeadLength*scaleFactor );
                    this.arrowHead.y = -displacement;
                    this.line.setPoint2( 0, -displacement + 0.9*sign*this.arrowHead.height );
                }
            }else{  //if horizontal
                if( length > this.criticalFactor*this.arrowHeadLength ){    //if arrow long enough
                    this.drawArrowHead( this.arrowHeadLength );
                    this.line.setPoint2( displacement - 0.9*sign*this.arrowHeadLength, 0 );
                    this.arrowHead.x = displacement;
                }else{  //if too small for arrowHead to fit
                    scaleFactor = Math.max( 0.1, length/( this.criticalFactor*this.arrowHeadLength ));
                    this.drawArrowHead( this.arrowHeadLength*scaleFactor );
                    this.arrowHead.x = displacement;
                    this.line.setPoint2( displacement - 0.9*sign*this.arrowHead.width, 0 );
                }
            }
        },//end setEndPoint()
        drawArrowHead: function( arrowHeadLength ){
            this.arrowHeadShape = new Shape();
            var hW = this.arrowHeadWidth;
            var hL = arrowHeadLength;
            if( this.vertical ){
                this.arrowHeadShape.moveTo( 0, 0 ).lineTo( -hW/2, hL ).lineTo( hW/2, hL ).close();
            }else{
                this.arrowHeadShape.moveTo( 0, 0 ).lineTo( -hL, hW/2 ).lineTo( -hL, -hW/2 ).close();
            }
            this.arrowHead.setShape( this.arrowHeadShape );
        },
        setLineWidth: function( lineWidth ){
            this.line.lineWidth = lineWidth;
        }
    } ); //end return inherit
} );
