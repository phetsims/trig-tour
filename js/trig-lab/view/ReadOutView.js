/**
 * Live readout of angle, and values of sin, cos, tan.
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
    var Text = require( 'SCENERY/nodes/Text' );


    /**
     * Constructor for ReadOutView which displays live values of angle, sin, cos, and tan
     * @param {TrigLabModel} model is the main model of the sim
     * @constructor
     */
    function ReadOutView( model  ) {

        var readOutView = this;
        this.model = model;

        // Call the super constructor
        Node.call( readOutView, {
        } );

        var angleReadout = model.angle.toFixed( 1 );      //read from model
        var sineReadout = model.sin().toFixed( 3 );
        var cosineReadout = model.cos().toFixed( 3 );

        //console.log( 'ReadOutView initialized.  angleReadout is ' + angleReadout );
        var radius = 200; //radius of unit circle in pixels
        var stageGraphic = new Node();  //provides parent and coord origin children
        var coordinatesLabel = new Text( '(x,y) = ', {
            font: '25px sans-serif'
        } );
        var coordinatesText = new Text( '( 0, 0 )',{
            font: '25px sans-serif'
        });
        var angleLabel = new Text( 'angle = ', {
            font: '25px sans-serif'
        } );
        var cosLabel = new Text('cosine = ', {
            font: '25px sans-serif'
        } );
        var angleReadoutText = new Text( angleReadout, {
            font: '25px sans-serif'
        }  );
        var sineReadoutText = new Text( sineReadout, {
            font: '25px sans-serif'
        } );
        var cosineReadoutText = new Text( cosineReadout, {
            font: '25px sans-serif'
        } );
        //onTopOfStageGraphic.translation = new Vector2( 0, -30 );
        var originLocation = new Vector2( 2.5*radius, 0.2*radius );
        stageGraphic.translation = originLocation;

        readOutView.addChild( stageGraphic );

        stageGraphic.addChild( coordinatesLabel );
        coordinatesText.translation = new Vector2( coordinatesLabel.right, 0 );
        coordinatesLabel.addChild( coordinatesText );
        angleLabel.translation = new Vector2( 0, 30 );
        stageGraphic.addChild( angleLabel );
        angleReadoutText.translation = new Vector2( angleLabel.right, 0 );
        angleLabel.addChild( angleReadoutText );
        cosLabel.translation = new Vector2( 0, 2*30 );
        stageGraphic.addChild( cosLabel );
        cosineReadoutText.translation = new Vector2( cosLabel.right, 0 );
        cosLabel.addChild( cosineReadoutText )



        // Register for synchronization with model.
        model.angleProperty.link( function( angle ) {
            var angleInDegrees = angle*180/Math.PI;
            var sinText = model.sin().toFixed( 3 ) ;
            var cosText =  model.cos().toFixed( 3 );
            coordinatesText.text = '( '+ cosText + ', ' + sinText + ' )';
            angleReadoutText.text = angleInDegrees.toFixed( 1 ) + ' degrees';
            sineReadoutText.text = sinText;
            cosineReadoutText.text = cosText;
        } );

    }

    return inherit( Node, ReadOutView );
} );