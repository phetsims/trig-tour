/**
 * Live readout of angle, and values of sin, cos, tan.
 * Created by Dubson on 6/2/2015.
 */
define( function( require ) {
    'use strict';

    // modules
    var inherit = require( 'PHET_CORE/inherit' );
    var Node = require( 'SCENERY/nodes/Node' );
    var Text = require( 'SCENERY/nodes/Text' );

    //strings
    var xyEqualsStr = '(x,y) = ';
    var angleEqualsStr = 'angle = ';
    var sinEqualsStr = 'sin = ';
    var cosEqualsStr = 'cos = ';
    var tanEqualsStr = 'tan = ';
    //var degreesStr = 'degrees';
    //var radiansStr = 'radians';

    /**
     * Constructor for ReadOutView which displays live values of angle, sin, cos, and tan
     * @param {TrigLabModel} model is the main model of the sim
     * @constructor
     */
    function ReadOutView( model  ) {

        var readOutView = this;
        this.model = model;
        this.radiansDisplayed = 'false'; //{boolean} set by ControlPanel
        this.units = 'degrees';  //{string} 'degrees'|'radians' set by ControlPanel

        // Call the super constructor
        Node.call( readOutView, { } );

        var angleReadout = model.angle.toFixed( 1 );      //read from model
        var sinReadout = model.sin().toFixed( 3 );
        var cosReadout = model.cos().toFixed( 3 );
        var tanReadout = model.tan().toFixed( 3 );

        //console.log( 'ReadOutView initialized.  angleReadout is ' + angleReadout );
        //var radius = 200; //radius of unit circle in pixels
        //var stageGraphic = new Node();  //provides parent and coord origin children
        var fontInfo = { font: '20px sans-serif' };
        var coordinatesLabel = new Text( xyEqualsStr, fontInfo );
        var coordinatesReadoutText = new Text( '', fontInfo );
        var angleLabel = new Text( angleEqualsStr, fontInfo );
        this.angleReadoutText = new Text( angleReadout, fontInfo );
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

        //arrange text
        this.addChild( coordinatesLabel );
        this.addChild( angleLabel );
        this.addChild( this.cosLabel );
        this.addChild( this.sinLabel );
        this.addChild( this.tanLabel );
        coordinatesLabel.addChild( coordinatesReadoutText );
        angleLabel.addChild( this.angleReadoutText );
        this.cosLabel.addChild( cosReadoutText ) ;
        this.sinLabel.addChild( sinReadoutText ) ;
        this.tanLabel.addChild( tanReadoutText ) ;

        //layout text
        coordinatesLabel.top = 0;  //shouldn't this be unnecesary? But needed otherwise coordsLable too high
        coordinatesReadoutText.left = coordinatesLabel.right;
        angleLabel.top = 30;
        this.angleReadoutText.left =  angleLabel.right ;
        this.cosLabel.top = this.sinLabel.top = this.tanLabel.top = 2*30;
        cosReadoutText.left =   this.cosLabel.right ;
        sinReadoutText.left =   this.sinLabel.right ;
        tanReadoutText.left =   this.tanLabel.right ;



        // Register for synchronization with model.
        model.angleProperty.link( function( angle ) {    //angle is in radians
            var angleInDegrees = angle*180/Math.PI;
            var sinText = model.sin().toFixed( 3 ) ;
            var cosText =  model.cos().toFixed( 3 );
            var tanText =  model.tan().toFixed( 3 );
            coordinatesReadoutText.text = '( '+ cosText + ', ' + sinText + ' )';
            if( readOutView.radiansDisplayed ){
                readOutView.angleReadoutText.text = angle.toFixed( 3 ) + ' ' + readOutView.units;
            }else{
                readOutView.angleReadoutText.text = angleInDegrees.toFixed( 1 ) + ' ' + readOutView.units;
            }
            sinReadoutText.text = sinText;
            cosReadoutText.text = cosText;
            tanReadoutText.text = tanText;
        } );

    }

    return inherit( Node, ReadOutView, {
        setUnits: function( units ){
        this.units = units;
        if( units === 'radians'){
            this.angleReadoutText.text = this.model.getAngleInRadians().toFixed( 3 ) + ' ' + units;
        }else{
            this.angleReadoutText.text = this.model.getAngleInDegrees().toFixed( 1 ) + ' ' + units;
        }
            //console.log(' ReadOutView called. units = ' + units );
    }
    } );
} );