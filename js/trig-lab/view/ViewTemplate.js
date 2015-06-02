/**
 * General template for View file of a PhET sim
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
    function ViewTemplate( model  ) {

        var viewTemplate = this;
        this.model = model;

        // Call the super constructor
        Node.call( viewTemplate, {
        } );

        var radius = 200; //radius of unit circle in pixels
        var stageGraphic = new Circle( radius, { stroke:'#000', lineWidth: 3 } );    //provides origin for onTopOfStageGraphic
        var onTopOfStageGraphic = new Rectangle( 0, 0, radius, 15, { fill: '#090', cursor: 'pointer' } );
        //onTopOfStageGraphic.translation = new Vector2( 0, -30 );
        var originLocation = new Vector2( 1.5*radius, 1.2*radius );
        stageGraphic.translation = originLocation;

        viewTemplate.addChild( stageGraphic );


        stageGraphic.addChild( onTopOfStageGraphic );

        // When dragging, move the sample element
        onTopOfStageGraphic.addInputListener( new SimpleDragHandler(
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
                        var v1 =  onTopOfStageGraphic.globalToParentPoint( e.pointer.point );   //returns Vector2
                        var angle = v1.angle();
                        //console.log( 'angle is ' + angle );
                        model.angle = angle;
                    }
                } ) );

        // Register for synchronization with model.
        model.angleProperty.link( function( angle ) {
            onTopOfStageGraphic.rotation = angle;
        } );

    }

    return inherit( Node, ViewTemplate );
} );