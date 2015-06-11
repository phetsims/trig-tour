/**
 * Live readout of angle, and values of sin, cos, tan.
 * This
 * Created by Dubson on 6/10/2015.
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
  //var Panel = require( 'SUN/Panel' );
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
  var infinityStr = '\u221E';   //'infinity'; //
  var pi ='\u03c0';
  var xStr = 'x';
  var yStr = 'y';

  //constants
  var DISPLAY_FONT = new PhetFont( 20 );
  /**
   * Constructor for ReadoutNode which displays live values of angle, sin, cos, and tan
   * This is a node which is the content of AccordionBox ReadoutDisplay
   * @param {TrigLabModel} model is the main model of the sim
   * @constructor
   */
  function ReadoutNode( model, properties ) {

    var readoutNode = this;
    this.model = model;
    this.properties = properties;
    this.nbrDecimalPlaces = 1;  //number of decimal places for display of angle, controlled by Control Panel
    this.radiansDisplayed = 'false'; //{boolean} set by ControlPanel
    this.specialAnglesOnly = 'false'; //{boolean} set by ControlPanel
    this.units = 'degrees';  //{string} 'degrees'|'radians' set by ControlPanel

    // Call the super constructor
    Node.call( readoutNode, { } );

    var angleReadout = model.angle.toFixed( 1 );      //read from model
    var sinReadout = model.sin().toFixed( 3 );
    var cosReadout = model.cos().toFixed( 3 );
    var tanReadout = model.tan().toFixed( 3 );

    //console.log( 'ReadOutView initialized.  angleReadout is ' + angleReadout );
    var fontInfo = { font: DISPLAY_FONT }; //{ font: '20px sans-serif' };
    var coordinatesLabel = new Text( xyEqualsStr, fontInfo );
    var coordinatesReadoutText = new Text( '', fontInfo );
    var angleLabel = new Text( angleEqualsStr, fontInfo );
    this.angleReadoutText = new Text( angleReadout, fontInfo );
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
    cosReadoutText.left =  this.cosLabel.right ;
    sinReadoutText.left =  this.sinLabel.right ;
    tanReadoutText.left =  this.tanLabel.right ;

    // Adjust touch areas
    var spacing = 10;

    this.content = new VBox( {
      children: [
        coordinatesLabel,
        angleLabel,
        readoutNode.trigLabel,
        new HSeparator( 100 ), //maxControlWidth ),
        degreesRadioButton,
        radiansRadioButton
      ],
      align: 'left',
      spacing: spacing
    } );

    readoutNode.addChild( this.content );

    //{xMargin: 10, yMargin: 10, lineWidth: 2}
    //Panel.call( this, this.content, { xMargin: 15, yMargin: 15, lineWidth: 2 } );

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
      if( readoutNode.radiansDisplayed && !readoutNode.specialAnglesOnly ){
        readoutNode.angleReadoutText.text = angle.toFixed( 3 ) + ' ' + readoutNode.units;
      }else if( !readoutNode.radiansDisplayed ){
        readoutNode.angleReadoutText.text = angleInDegrees.toFixed( readoutNode.nbrDecimalPlaces ) + ' ' + readoutNode.units;
      }else if( readoutNode.radiansDisplayed && readoutNode.specialAnglesOnly ) {
        //readoutNode.setSpecialAngleReadout();

        readoutNode.angleReadoutText.text = angle.toFixed( 3 ) + ' ' + readoutNode.units;
      }else{
        readoutNode.angleReadoutText.text = angleInDegrees.toFixed( readoutNode.nbrDecimalPlaces ) + ' ' + readoutNode.units;
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


  return inherit( Node, ReadoutNode, {
    setUnits: function ( units ) {
      this.units = units;
      if ( units === 'radians' ) {
        this.angleReadoutText.text = this.model.getAngleInRadians().toFixed( 3 ) + ' ' + units;
      }
      else {
        this.angleReadoutText.text = this.model.getAngleInDegrees().toFixed( this.nbrDecimalPlaces ) + ' ' + units;
      }
      //console.log(' ReadOutView called. units = ' + units );
    },
    setTrigLabel: function ( graph ) {
      //console.log( 'setTrigLabel called.  graph = ' + graph );
      this.trigLabel.children[0].visible = ( graph == 'sin' );
      this.trigLabel.children[1].visible = ( graph == 'cos' );
      this.trigLabel.children[2].visible = ( graph == 'tan' );
    } ,
    setAngleReadoutPrecision: function( nbrDecimalPlaces ){
      this.nbrDecimalPlaces = nbrDecimalPlaces;
      //console.log( 'setAngleReadoutPrecision called. precision is ' + this.nbrDecimalPlaces );
    },
    setSpecialAngleReadout: function(){
      console.log('ReadoutNode.setSpecialAngle() called.');
      var angleInDegs = this.model.getAngleInDegrees();
      var angles = [ 0, 30, 45, 60, 90, 120, 135, 150, 180, 210, 225, 240, 270, 300, 315, 330, 360 ];
      var fractions = [
        new Text( '0' ),
        new FractionNode( pi, 6 ),
        new FractionNode( pi, 4),
        new FractionNode( pi, 3 ),
        new FractionNode( pi, 2 ),
        new FractionNode( 2 + pi, 3 ),
        new FractionNode( 3 + pi, 4 ),
        new FractionNode( 5 + pi, 6 ),
        new Text( pi )
      ];//end anglesInRadsFractions
      for( var i = 0; i < fractions.length; i++ ){
        if ( angles[i] == angleInDegs ){
          this.angleReadoutText = fractions[ i ];
        }
      }
    }//end setSpecialAngle
  } );
} );
