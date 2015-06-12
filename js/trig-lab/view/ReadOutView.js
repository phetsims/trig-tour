/**
 * Live readout of angle, and values of sin, cos, tan.
 * Created by Dubson on 6/2/2015.
 */
define( function( require ) {
    'use strict';

    // modules
    var AquaRadioButton = require( 'SUN/AquaRadioButton' );
    var FractionNode = require( 'TRIG_LAB/trig-lab/view/FractionNode' );
    var HBox = require( 'SCENERY/nodes/HBox' );
    var HSeparator = require( 'SUN/HSeparator' );
    var inherit = require( 'PHET_CORE/inherit' );
    var Node = require( 'SCENERY/nodes/Node' );
    var Panel = require( 'SUN/Panel' );
    var PhetFont = require( 'SCENERY_PHET/PhetFont' );
    var Text = require( 'SCENERY/nodes/Text' );
    var VBox = require( 'SCENERY/nodes/VBox' );

    //strings
    var xyEqualsStr = '(x,y) = ';
    var equalStr = '=';
    var angleEqualsStr = 'angle = ';
    var sinEqualsStr = 'sin = ';
    var cosEqualsStr = 'cos = ';
    var tanEqualsStr = 'tan = ';
    var degreesStr = 'degrees';
    var radiansStr = 'radians';
    var infinityStr = 'infinity'; //'\u221E';   //
    var xStr = 'x';
    var yStr = 'y';

    //constants
    var DISPLAY_FONT = new PhetFont( 20 );
    /**
     * Constructor for ReadOutView which displays live values of angle, sin, cos, and tan
     * @param {TrigLabModel} model is the main model of the sim
     * @constructor
     */
    function ReadOutView( model, properties ) {

        var readOutView = this;
        this.model = model;
        this.properties = properties;
        this.nbrDecimalPlaces = 1;  //number of decimal places for display of angle, controlled by Control Panel
        this.radiansDisplayed = 'false'; //{boolean} set by ControlPanel
        this.units = 'degrees';  //{string} 'degrees'|'radians' set by ControlPanel

        // Call the super constructor
        Node.call( readOutView, { } );

        var angleReadout = model.angle.toFixed( 1 );      //read from model
        var sinReadout = model.sin().toFixed( 3 );
        var cosReadout = model.cos().toFixed( 3 );
        var tanReadout = model.tan().toFixed( 3 );

        //console.log( 'ReadOutView initialized.  angleReadout is ' + angleReadout );
        var fontInfo = { font: DISPLAY_FONT }; //{ font: '20px sans-serif' };
        var coordinatesLabel = new Text( xyEqualsStr, fontInfo );
        var coordinatesReadoutText = new Text( '', fontInfo );
        var angleLabel = new Text( angleEqualsStr, fontInfo );
        this.angleReadout = new Text( angleReadout, fontInfo );
        this.sinLabel = new Text( sinEqualsStr, fontInfo );
        this.cosLabel = new Text( cosEqualsStr, fontInfo );
        this.tanLabel = new Text( tanEqualsStr, fontInfo );
        var cosFraction = new FractionNode( xStr, 1, fontInfo ) ;
        var sinFraction = new FractionNode( yStr, 1, fontInfo ) ;
        var tanFraction = new FractionNode( yStr, xStr, fontInfo );
        var equalsText = new Text( '  ' + equalStr + ' ', fontInfo );
        sinFraction.addChild( equalsText );
        cosFraction.addChild( equalsText );
        tanFraction.addChild( equalsText );
        sinFraction.right = equalsText.left;
        cosFraction.right = equalsText.left;
        tanFraction.right = equalsText.left;
        this.sinLabel.addChild( sinFraction );
        sinFraction.left = this.sinLabel.right;
        this.cosLabel.addChild( cosFraction );
        cosFraction.left = this.cosLabel.right;
        this.tanLabel.addChild( tanFraction );
        tanFraction.left = this.tanLabel.right;

        var sinReadoutText = new Text( sinReadout, fontInfo );
        var cosReadoutText = new Text( cosReadout, fontInfo );
        var tanReadoutText = new Text( tanReadout, fontInfo );
        var degText = new Text( degreesStr, fontInfo ) ;
        var radText = new Text( radiansStr, fontInfo );

        // 2 radio buttons for display in degrees or radians
        var myRadioButtonOptions = { radius: 10, fontSize: 15 } ;
        var degreesRadioButton = new AquaRadioButton( properties.angleUnitsProperty, degreesStr, degText, myRadioButtonOptions );
        var radiansRadioButton = new AquaRadioButton( properties.angleUnitsProperty, radiansStr, radText, myRadioButtonOptions );

        //arrange text
        this.trigLabel = new Node();  //set from Control Panel
        this.trigLabel.children = [ this.sinLabel, this.cosLabel, this.tanLabel ];
        this.sinLabel.top = 0;
        this.cosLabel.top = 0;
        this.tanLabel.top = 0;
        coordinatesLabel.addChild( coordinatesReadoutText );
        angleLabel.addChild( this.angleReadout );
        this.cosLabel.addChild( cosReadoutText ) ;
        this.sinLabel.addChild( sinReadoutText ) ;
        this.tanLabel.addChild( tanReadoutText ) ;

        //layout text
        coordinatesLabel.top = 0;  //shouldn't this be unnecesary? But needed otherwise coordsLable too high
        coordinatesReadoutText.left = coordinatesLabel.right;
        angleLabel.top = 30;
        this.angleReadout.left =  angleLabel.right ;
        this.cosLabel.top = this.sinLabel.top = this.tanLabel.top = 2*30;
        cosReadoutText.left =  this.cosLabel.right ;
        sinReadoutText.left =  this.sinLabel.right ;
        tanReadoutText.left =  this.tanLabel.right ;

        // Adjust touch areas
        var spacing = 20;

        this.content = new VBox( {
            children: [
                coordinatesLabel,
                angleLabel,
                readOutView.trigLabel,
                new HSeparator( 100 ), //maxControlWidth ),
                degreesRadioButton,
                radiansRadioButton
            ],
            align: 'left',
            spacing: spacing
        } );

        //{xMargin: 10, yMargin: 10, lineWidth: 2}
        Panel.call( this, this.content, { xMargin: 15, yMargin: 15, lineWidth: 2 } );

        //WHY does the following not work?
         ///this.mutate({xMargin: 10, yMargin: 10, lineWidth: 2}) ;
        //readOutView.mutate({xMargin: 10, yMargin: 10, lineWidth: 2}) ;
        //readOutView.xMargin = 30;
        //readOutView.lineWidth = 2;

        // Register for synchronization with model.
        model.angleProperty.link( function( angle ) {    //angle is in radians
            var angleInDegrees = angle*180/Math.PI;
            var sinText = model.sin().toFixed( 3 ) ;
            var cosText =  model.cos().toFixed( 3 );
            var tanText =  model.tan().toFixed( 3 );
            coordinatesReadoutText.text = '( '+ cosText + ', ' + sinText + ' )';
            if( readOutView.radiansDisplayed ){
                readOutView.angleReadout.text = angle.toFixed( 3 ) + ' ' + readOutView.units;
            }else{
                readOutView.angleReadout.text = angleInDegrees.toFixed( readOutView.nbrDecimalPlaces ) + ' ' + readOutView.units;
            }
            sinReadoutText.text = sinText;
            cosReadoutText.text = cosText;
            if( model.tan() < 1000 && model.tan() > -1000 ){
                tanReadoutText.text = tanText;
            }else if( model.tan() > 1000 ){
                tanReadoutText.text = infinityStr;
            }else if( model.tan() < -1000 ){
                tanReadoutText.text = '-' + infinityStr;
            }
        } );
    }


    return inherit( Panel, ReadOutView, {
        setUnits: function ( units ) {
            this.units = units;
            if ( units === 'radians' ) {
                this.angleReadout.text = this.model.getAngleInRadians().toFixed( 3 ) + ' ' + units;
            }
            else {
                this.angleReadout.text = this.model.getAngleInDegrees().toFixed( this.nbrDecimalPlaces ) + ' ' + units;
            }
            //console.log(' ReadOutView called. units = ' + units );
        },
        setTrigRowVisibility: function ( graph ) {
            //console.log( 'setTrigRowVisibility called.  graph = ' + graph );
            this.trigLabel.children[0].visible = ( graph == 'sin' );
            this.trigLabel.children[1].visible = ( graph == 'cos' );
            this.trigLabel.children[2].visible = ( graph == 'tan' );
        } ,
        setAngleReadoutPrecision: function( nbrDecimalPlaces ){
            this.nbrDecimalPlaces = nbrDecimalPlaces;
            //console.log( 'setAngleReadoutPrecision called. precision is ' + this.nbrDecimalPlaces );
        }
    } );
} );