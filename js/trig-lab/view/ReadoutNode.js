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
   * This node is the content of AccordionBox ReadoutDisplay
   * @param {TrigLabModel} model is the main model of the sim
   * @constructor
   */
  function ReadoutNode( model, properties ) {

    var readoutNode = this;
    this.model = model;
    this.properties = properties;
    this.nbrDecimalPlaces = 1;      //number of decimal places for display of angle, = 0 for special angles
    this.radiansDisplayed = false; //{boolean} set by ControlPanel
    this.specialAnglesOnly = false; //{boolean} set by ControlPanel
    this.units = 'degrees';         //{string} 'degrees'|'radians' set by ControlPanel

    // Call the super constructor
    Node.call( readoutNode, { } );
    var row1 = new Node();  //coordinates readout: (x, y) = ( cos, sin )
    var row2 = new Node();  //angle = angle value in degrees or radians
    var row3 = new Node();  //trig function = trig value, trig function = 'sin'|'cos'|'tan'

    var angleValue = model.angle.toFixed( 1 );      //read from model
    var sinValue = model.sin().toFixed( 3 );
    var cosValue = model.cos().toFixed( 3 );
    var tanValue = model.tan().toFixed( 3 );

    //console.log( 'ReadOutView initialized.  angleValue is ' + angleValue );
    var fontInfo = { font: DISPLAY_FONT }; //{ font: '20px sans-serif' };

    //Row 1: (x, y) = ( cos, sin )
    var coordinatesLabel = new Text( xyEqualsStr, fontInfo );
    var coordinatesReadout = new Text( '', fontInfo );
    row1.children = [ coordinatesLabel, coordinatesReadout ];
    //layout
    coordinatesReadout.left = coordinatesLabel.right;

    //Row 2: angle = value in degs or rads
    var angleLabel = new Text( angleEqualsStr, fontInfo );
    this.angleReadout = new Text( angleValue, fontInfo );
    this.angleReadoutFraction = new FractionNode( 'A', 'B', fontInfo );  //used to display angle as FractionNode in Special angles mode
    this.angleReadout.visible = true;
    this.angleReadoutFraction.visible = false;
    row2.children = [ angleLabel, this.angleReadout, this.angleReadoutFraction ];
    //layout
    this.angleReadout.left =  angleLabel.right ;
    this.angleReadoutFraction.left =  angleLabel.right ;


    //Row 3: trig function = trig fraction = trig value
    // trig function = 'sin'|'cos'|'tan', trig fraction = 'y/1'|'x/1'|'y/x'
    this.sinLabel = new Text( sinEqualsStr, fontInfo );
    this.cosLabel = new Text( cosEqualsStr, fontInfo );
    this.tanLabel = new Text( tanEqualsStr, fontInfo );
    var cosFraction = new FractionNode( xStr, 1, fontInfo ) ;
    var sinFraction = new FractionNode( yStr, 1, fontInfo ) ;
    var tanFraction = new FractionNode( yStr, xStr, fontInfo );
    var equalsText = new Text( '    ' + equalStr + '', fontInfo );
    sinFraction.addChild( equalsText );
    cosFraction.addChild( equalsText );
    tanFraction.addChild( equalsText );
    var spacer = 4;
    //equalsText.left = sinFraction.right;
    //equalsText.left = cosFraction.right;
    //equalsText.left = tanFraction.right;
    this.sinLabel.addChild( sinFraction );
    sinFraction.left = this.sinLabel.right;
    this.cosLabel.addChild( cosFraction );
    cosFraction.left = this.cosLabel.right;
    this.tanLabel.addChild( tanFraction );
    tanFraction.left = this.tanLabel.right;

    var sinReadout = new Text( sinValue, fontInfo );
    var cosReadout = new Text( cosValue, fontInfo );
    var tanReadout = new Text( tanValue, fontInfo );
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


        //or angle display is FractionNode
    this.cosLabel.addChild( cosReadout ) ;
    this.sinLabel.addChild( sinReadout ) ;
    this.tanLabel.addChild( tanReadout ) ;

    //layout text





    this.cosLabel.top = this.sinLabel.top = this.tanLabel.top = 2*30;
    var space = 4
    cosReadout.left =  this.cosLabel.right + space ;
    sinReadout.left =  this.sinLabel.right + space ;
    tanReadout.left =  this.tanLabel.right + space ;

    //arrays needed for display of special angles in radians
    this.angles = [ 0, 30, 45, 60, 90, 120, 135, 150, 180, 210, 225, 240, 270, 300, 315, 330, 360 ];
    this.fractions = [
      [ '0', '' ],
      [ pi, 6 ],
      [ pi, 4 ],
      [ pi, 3 ],
      [ pi, 2 ],
      [ 2 + pi, 3 ],
      [ 3 + pi, 4 ],
      [ 5 + pi, 6 ],
      [ pi, '' ]
    ];//end anglesInRadsFractions

    //Test Code
    //this.angleReadoutFraction = new FractionNode( 11, 3 );
    //this.angleReadoutFraction.visible = true;
    //this.angleReadout.visible = false;

    // Adjust touch areas
    var spacing = 10;

    this.content = new VBox( {
      children: [
        row1,
        row2,
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
      coordinatesReadout.text = '( '+ cosText + ', ' + sinText + ' )';
      //readoutNode.angleReadout.text = angleInDegrees.toFixed( readoutNode.nbrDecimalPlaces ) + ' ' + readoutNode.units;
      //readoutNode.angleReadoutFraction.visible = false;
      //readoutNode.angleReadout.visible = true;
      if( readoutNode.radiansDisplayed && !readoutNode.specialAnglesOnly ){
        readoutNode.angleReadout.text = angle.toFixed( 3 ) + ' ' + readoutNode.units;
      }else if( !readoutNode.radiansDisplayed ){
        readoutNode.angleReadout.text = angleInDegrees.toFixed( readoutNode.nbrDecimalPlaces ) + ' ' + readoutNode.units;
      }
      if( readoutNode.radiansDisplayed && readoutNode.specialAnglesOnly  ) {
        readoutNode.angleReadoutFraction.visible = true;
        readoutNode.angleReadout.visible = false;
        readoutNode.setSpecialAngleReadout();
        //readoutNode.angleReadout.text = angle.toFixed( 3 ) + ' ' + readoutNode.units;
      }else{
        readoutNode.angleReadoutFraction.visible = false;
        readoutNode.angleReadout.visible = true;
      }
      sinReadout.text = sinText;
      cosReadout.text = cosText;
      if( model.tan() < 1000 && model.tan() > -1000 ){
        tanReadout.text = tanText;
      }else if( model.tan() > 1000 ){
        tanReadout.text = infinityStr;
      }else if( model.tan() < -1000 ){
        tanReadout.text = '-' + infinityStr;
      }
    } );
  }


  return inherit( Node, ReadoutNode, {
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

      var angleInDegs = Math.round( this.model.getAngleInDegrees() );  //need interger value of angle, internal arimetic can give nearly integer
      console.log('ReadoutNode.setSpecialAngle() called. angleDegs = ' + angleInDegs );
      for( var i = 0; i < this.fractions.length; i++ ){
        if ( this.angles[i] == angleInDegs ){
          this.angleReadoutFraction.setValues( this.fractions[i] );
        }
      }
    }//end setSpecialAngle
  } );
} );
