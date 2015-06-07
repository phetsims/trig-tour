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

    //strings
    var xyEqualsStr = '(x,y) = ';
    var angleEqualsStr = ' angle = ';
    var sinEqualsStr = 'sin = ';
    var cosEqualsStr = 'cos = ';
    var tanEqualsStr = 'tan = ';
    var degreesStr = 'degrees';
    var radiansStr = 'radians';



    /**
     * Constructor for ReadOutView which displays live values of angle, sin, cos, and tan
     * @param {TrigLabModel} model is the main model of the sim
     * @constructor
     */
    function ReadOutView( model  ) {

        var readOutView = this;
        this.model = model;

        // Call the super constructor
        Node.call( readOutView, { } );

        var angleReadout = model.angle.toFixed( 1 );      //read from model
        var sinReadout = model.sin().toFixed( 3 );
        var cosReadout = model.cos().toFixed( 3 );
        var tanReadout = model.tan().toFixed( 3 );

        //console.log( 'ReadOutView initialized.  angleReadout is ' + angleReadout );
        //var radius = 200; //radius of unit circle in pixels
        //var stageGraphic = new Node();  //provides parent and coord origin children
        var fontInfo = { font: '25px sans-serif' };
        var coordinatesLabel = new Text( xyEqualsStr, fontInfo );
        var coordinatesReadoutText = new Text( '', fontInfo );
        var angleLabel = new Text( angleEqualsStr, fontInfo );
        var angleReadoutText = new Text( angleReadout, fontInfo );
        this.sinLabel = new Text( sinEqualsStr, fontInfo );
        this.cosLabel = new Text( cosEqualsStr, fontInfo );
        this.tanLabel = new Text( tanEqualsStr, fontInfo );
        var sinReadoutText = new Text( sinReadout, fontInfo );
        var cosReadoutText = new Text( cosReadout, fontInfo );
        var tanReadoutText = new Text( tanReadout, fontInfo );

        //onTopOfStageGraphic.translation = new Vector2( 0, -30 );
        //var originLocation = new Vector2( 2.5*radius, 0.2*radius );
        //stageGraphic.translation = originLocation;

        //readOutView.addChild( stageGraphic );

        //layout text
        readOutView.addChild( coordinatesLabel );
        readOutView.addChild( angleLabel );
        readOutView.addChild( this.cosLabel );
        readOutView.addChild( this.sinLabel );
        readOutView.addChild( this.tanLabel );
        coordinatesLabel.addChild( coordinatesReadoutText );
        angleLabel.addChild( angleReadoutText );
        this.cosLabel.addChild( cosReadoutText ) ;
        this.sinLabel.addChild( sinReadoutText ) ;
        this.tanLabel.addChild( tanReadoutText ) ;

        //layout text
        coordinatesLabel.top = 0;  //shouldn't this be unnecesary?
        //coordinatesReadoutText.translation = new Vector2( coordinatesLabel.right, 0 );
        coordinatesReadoutText.left = coordinatesLabel.right;
        //angleLabel.translation = new Vector2( 0, 30 );
        angleLabel.top = 30;

        //angleReadoutText.translation = new Vector2( angleLabel.right, 0 );
        angleReadoutText.left =  angleLabel.right ;
        //cosLabel.translation = new Vector2( 0, 2*30 );
        this.cosLabel.top = this.sinLabel.top = this.tanLabel.top = 2*30;
        //cosineReadoutText.translation = new Vector2( cosLabel.right, 0 );
        cosReadoutText.left =   this.cosLabel.right ;
        sinReadoutText.left =   this.sinLabel.right ;
        tanReadoutText.left =   this.tanLabel.right ;



        // Register for synchronization with model.
        model.angleProperty.link( function( angle ) {
            var angleInDegrees = angle*180/Math.PI;
            var sinText = model.sin().toFixed( 3 ) ;
            var cosText =  model.cos().toFixed( 3 );
            var tanText =  model.tan().toFixed( 3 );
            coordinatesReadoutText.text = '( '+ cosText + ', ' + sinText + ' )';
            angleReadoutText.text = angleInDegrees.toFixed( 1 ) + ' ' + degreesStr;
            sinReadoutText.text = sinText;
            cosReadoutText.text = cosText;
            tanReadoutText.text = tanText;
        } );

    }

    return inherit( Node, ReadOutView );
} );