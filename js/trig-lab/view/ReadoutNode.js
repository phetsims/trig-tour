/**
 * Live readout of angle, and values of sin, cos, tan.
 * Created by Dubson on 6/10/2015.
 */
define( function( require ) {
  'use strict';

  // modules
  var AquaRadioButton = require( 'SUN/AquaRadioButton' );
  var FractionNode = require( 'TRIG_LAB/trig-lab/view/FractionNode' );
  //var HBox = require( 'SCENERY/nodes/HBox' );
  var HSeparator = require( 'SUN/HSeparator' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Node = require( 'SCENERY/nodes/Node' );
  //var Panel = require( 'SUN/Panel' );
  var PhetFont = require( 'SCENERY_PHET/PhetFont' );
  var Text = require( 'SCENERY/nodes/Text' );
  var Util = require( 'TRIG_LAB/trig-lab/common/Util' );
  var VBox = require( 'SCENERY/nodes/VBox' );

  //strings
  var xyEqualsStr = require( 'string!TRIG_LAB/xyEquals' ) + ' ';  //extra space added after equal sign for pleasant layout
  var equalStr = require( 'string!TRIG_LAB/equals' ) + ' ';
  var angleEqualsStr = require( 'string!TRIG_LAB/angleEquals' ) + ' ';
  var sinEqualsStr = require( 'string!TRIG_LAB/sin' ) + equalStr;
  var cosEqualsStr = require( 'string!TRIG_LAB/cos' ) + equalStr;
  var tanEqualsStr = require( 'string!TRIG_LAB/tan') + equalStr;
  var degreesStr = require( 'string!TRIG_LAB/degrees' );
  var radiansStr = require( 'string!TRIG_LAB/radians' );
  //var infinitySymbolStr = require( 'string!TRIG_LAB/infinitySymbol' );
  var infinityWordStr = require( 'string!TRIG_LAB/infinityWord' );
  var pi = require( 'string!TRIG_LAB/pi' );
  var sqRt = require( 'string!TRIG_LAB/squareRoot' );
  var xStr = 'x';
  var yStr = 'y';

  //constants
  var DISPLAY_FONT = new PhetFont( 20 );
  //var LINE_COLOR = Util.LINE_COLOR;
  var TEXT_COLOR = Util.TEXT_COLOR;
  var PANEL_COLOR = Util.PANEL_COLOR;
  /**
   * Constructor for ReadoutNode which displays live values of angle, sin, cos, and tan
   * This node is the content of AccordionBox ReadoutDisplay
   * @param {TrigLabModel} model is the main model of the sim
   * @param {Object} properties
   * @constructor
   */
  function ReadoutNode( model, properties ) {

    var readoutNode = this;
    this.model = model;
    this.properties = properties;
    this.nbrDecimalPlaces = 1;      //number of decimal places for display of angle, = 0 for special angles
    this.radiansDisplayed = false;  //{boolean} set by ControlPanel
    this.specialAnglesOnly = false; //{boolean} set by ControlPanel
    this.units = 'degrees';         //{string} 'degrees'|'radians' set by Readout panel

    // Call the super constructor
    Node.call( readoutNode );
    var row1 = new Node();  //coordinates readout: (x, y) = ( cos, sin )
    var row2 = new Node( { fill: '##770000'} );  //angle = angle value in degrees or radians
    //row 3 is this.trigRow3 declared below, trig function = trig value, trig function = 'sin'|'cos'|'tan'

    var angleValue = model.angle.toFixed( 1 );      //read from model
    var sinValue = model.sin().toFixed( 3 );
    var cosValue = model.cos().toFixed( 3 );
    var tanValue = model.tan().toFixed( 3 );

    //console.log( 'ReadOutView initialized.  angleValue is ' + angleValue );
    var fontInfo = { font: DISPLAY_FONT, fill: TEXT_COLOR }; //{ font: '20px sans-serif' };
    var fontBoldInfo = { font: DISPLAY_FONT, fill: TEXT_COLOR, fontWeight: 'bold' };

    //Row 1: (x, y) = ( cos, sin )
    var coordinatesLabel = new Text( xyEqualsStr, fontBoldInfo );
    var coordinatesReadout = new Text( '', fontInfo );     //text provided by model synchronization below: model.angleProperty.link
    row1.children = [ coordinatesLabel, coordinatesReadout ];
    //layout
    coordinatesReadout.left = coordinatesLabel.right;

    //Row 2: angle = value in degs or rads
    var angleLabel = new Text( angleEqualsStr, fontBoldInfo );
    this.angleReadout = new Text( angleValue, fontInfo );
    this.nbrFullTurnsNode = new FractionNode( 'A', '', fontInfo );
    //this.nbrFullTurnsText = new Text( '', fontInfo );  //for example, text '4pi + '
    this.angleReadoutFraction = new FractionNode( '-A', 'B', fontInfo );  //used to display angle as FractionNode in Special angles mode
    this.angleReadout.visible = true;
    this.angleReadoutFraction.visible = false;
    row2.children = [ angleLabel, this.angleReadout, this.nbrFullTurnsNode, this.angleReadoutFraction ];
    //layout
    this.angleReadout.left =  angleLabel.right ;
    this.nbrFullTurnsNode.left = angleLabel.right;
    this.angleReadoutFraction.left =  this.nbrFullTurnsNode.right ;
    //this.nbrFullTurnsText.left = angleLabel.right;
    //this.angleReadoutFraction.left =  this.nbrFullTurnsText.right ;

    //Row 3: trig function label = trig fraction = trig value
    // trig function label = 'sin'|'cos'|'tan', trig fraction = 'y/1'|'x/1'|'y/x'
    var sinLabel = new Text( sinEqualsStr, fontBoldInfo );
    var cosLabel = new Text( cosEqualsStr, fontBoldInfo );
    var tanLabel = new Text( tanEqualsStr, fontBoldInfo );
    var cosFraction = new FractionNode( xStr, 1, fontBoldInfo ) ;
    var sinFraction = new FractionNode( yStr, 1, fontBoldInfo ) ;
    var tanFraction = new FractionNode( yStr, xStr, fontBoldInfo );

    //trig readout is either decimal number (type Text) or built-up fraction (type FractionNode)
    this.sinReadoutText = new Text( sinValue, fontInfo );
    this.cosReadoutText = new Text( cosValue, fontInfo );
    this.tanReadoutText = new Text( tanValue, fontInfo );
    this.sinReadoutFraction = new FractionNode( '-A', 'B', fontInfo );
    this.cosReadoutFraction = new FractionNode( '-c', 'd', fontInfo );
    this.tanReadoutFraction = new FractionNode( '-1', '2', fontInfo );
    var equalText1 = new Text( equalStr, fontBoldInfo );
    var equalText2 = new Text( equalStr, fontBoldInfo );
    var equalText3 = new Text( equalStr, fontBoldInfo );
    var degText = new Text( degreesStr, fontInfo ) ;
    var radText = new Text( radiansStr, fontInfo );
    this.sinRow = new Node( {children: [ sinLabel, sinFraction, equalText1, this.sinReadoutText, this.sinReadoutFraction ]});
    this.cosRow = new Node( {children: [ cosLabel, cosFraction, equalText2, this.cosReadoutText, this.cosReadoutFraction ]});
    this.tanRow = new Node( {children: [ tanLabel, tanFraction, equalText3, this.tanReadoutText, this.tanReadoutFraction ]});
    this.sinReadoutFraction.visible = false;
    this.cosReadoutFraction.visible = false;
    this.tanReadoutFraction.visible = false;
    //trig row layout
    sinFraction.left = sinLabel.right;
    cosFraction.left = cosLabel.right;
    tanFraction.left = tanLabel.right;
    var space = 4;
    equalText1.left = sinFraction.right + space;
    equalText2.left = cosFraction.right + space;
    equalText3.left = tanFraction.right + space;
    this.sinReadoutText.left =  equalText1.right + space ;
    this.cosReadoutText.left =  equalText2.right + space ;
    this.tanReadoutText.left =  equalText3.right + space ;
    this.sinReadoutFraction.left = equalText1.right + space ;
    this.cosReadoutFraction.left = equalText2.right + space ;
    this.tanReadoutFraction.left = equalText3.right + space ;

    this.trigRow3 = new Node( { children: [ this.sinRow, this.cosRow, this.tanRow ] } );  //visibility set from Control Panel

    // 2 radio buttons for display in degrees or radians
    var myRadioButtonOptions = { radius: 10, fontSize: 15, deselectedColor: PANEL_COLOR } ;
    var degreesRadioButton = new AquaRadioButton( properties.angleUnitsProperty, degreesStr, degText, myRadioButtonOptions );
    var radiansRadioButton = new AquaRadioButton( properties.angleUnitsProperty, radiansStr, radText, myRadioButtonOptions );

    //arrays needed for display of special angles
    //Special angles in degrees
    this.angles = [ 0, 30, 45, 60, 90, 120, 135, 150, 180, 210, 225, 240, 270, 300, 315, 330, 360 ];
    //Corresponding special angles in radians
    this.angleFractions = [
      [ 0, '' ],
      [ pi, 6 ],
      [ pi, 4 ],
      [ pi, 3 ],
      [ pi, 2 ],
      [ 2 + pi, 3 ],   //Remember it's all string concatenation, so 2 + pi = 2pi
      [ 3 + pi, 4 ],
      [ 5 + pi, 6 ],
      [ pi, '' ],
      [ 7 + pi, 6 ],
      [ 5 + pi, 4 ],
      [ 4 + pi, 3 ],
      [ 3 + pi, 2 ],
      [ 5 + pi, 3 ],
      [ 7 + pi, 4 ],
      [ 11 + pi, 6 ],
      [ 2 + pi, '' ]
    ];//end anglesInRadsFractions

    //'q' is the flag which informs FractionNode that a square root symbol is required in the numerator
    this.cosFractions = [
      [ 1, '' ],
      [ 'q' + 3, 2 ],
      [ 'q' + 2, 2 ],
      [ 1, 2 ],
      [ 0, '' ],
      [ -1, 2 ],
      [ '-q' + 2, 2 ],
      [ '-q' + 3, 2 ],
      [ -1, '' ],
      [ '-q' + 3, 2 ],
      [ '-q' + 2, 2 ],
      [ 0, '' ],
      [ 1, 2 ],
      [ 'q' + 2, 2 ],
      [ 1, 2 ],
      [ 'q' + 3, 2 ],
      [ 1, '' ]
    ];
    this.sinFractions = [
      [ 0, '' ],
      [ 1, 2 ],
      [ 'q' + 2, 2 ],
      [ 'q' + 3, 2 ],
      [ 1, '' ],
      [ 'q' + 3, 2 ],
      [ 'q' + 2, 2 ],
      [ 1, 2 ],
      [ 0, '' ],
      [ -1, 2 ],
      [ '-q' + 2, 2 ],
      [ '-q' + 3, 2 ],
      [ -1, '' ],
      [ '-q' + 3, 2 ],
      [ '-q' + 2, 2 ],
      [ -1, 2 ],
      [ 0, '' ]
    ];
    this.tanFractions = [
      [ 0, '' ],
      [ 'q' + 3, 3 ],
      [ 1, '' ],
      [ 'q' + 3, '' ],
      [ infinityWordStr, '' ],
      [ '-q' + 3, '' ],
      [ -1, '' ],
      [ '-q' + 3, 3 ],
      [ 0, '' ],
      [ 'q' + 3, 3 ],
      [ 1, '' ],
      [ 'q' + 3, '' ],
      [ '-' + infinityWordStr, '' ],
      [ '-q' + 3, '' ],
      [ -1, '' ],
      [ '-q' + 3, 3 ],
      [ 0, '' ]
    ];


    // Adjust touch areas
    var spacing = 10;

    var contentVBox = new VBox( {
      children: [
        row1,
        row2,
        readoutNode.trigRow3,
        new HSeparator( 100 ),
        degreesRadioButton,
        radiansRadioButton
      ],
      align: 'left',
      spacing: spacing
    } );

    readoutNode.addChild( contentVBox );

    // Register for synchronization with model.
    model.angleProperty.link( function( angle ) {    //angle is in radians
      var sinText = model.sin().toFixed( 3 ) ;
      var cosText =  model.cos().toFixed( 3 );
      //var tanText =  model.tan().toFixed( 3 );
      coordinatesReadout.text = '( '+ cosText + ', ' + sinText + ' )';
      readoutNode.setAngleReadout();
      readoutNode.setTrigReadout();
    } ); //end model.angleProperty.link
  }//end constructor


  return inherit( Node, ReadoutNode, {
    setUnits: function ( units ) {
      this.units = units;
      if ( units === 'radians' ) {
        this.angleReadout.text = this.model.getAngleInRadians().toFixed( 3 ) + ' ' + units;
      }
      else {
        this.angleReadout.text = this.model.getAngleInDegrees().toFixed( this.nbrDecimalPlaces ) + ' ' + units;
      }
    },
    setTrigRowVisibility: function ( graph ) {
      this.trigRow3.children[0].visible = ( graph === 'sin' );
      this.trigRow3.children[1].visible = ( graph === 'cos' );
      this.trigRow3.children[2].visible = ( graph === 'tan' );
    } ,
    setAngleReadoutPrecision: function( nbrDecimalPlaces ){
      this.nbrDecimalPlaces = nbrDecimalPlaces;
    },
    setAngleReadout: function(){
      if( !this.radiansDisplayed ){
        this.angleReadout.text = this.model.getAngleInDegrees().toFixed( this.nbrDecimalPlaces ) + ' ' + this.units;
      }
      if( this.radiansDisplayed && !this.specialAnglesOnly ){
        this.angleReadout.text = this.model.angle.toFixed( 3 ) + ' ' + this.units;
      }
      if( this.radiansDisplayed && this.specialAnglesOnly ){
        this.setSpecialAngleReadout();
      }
    },
    setSpecialAngleReadout: function(){
      this.angleReadoutFraction.visible = true;
      var angleInDegs = Math.round( this.model.getAngleInDegrees() );  //need integer value of angle, internal arithmetic can give not quite integer
      if( Math.abs( angleInDegs ) > 360 ){
        angleInDegs = angleInDegs%360;
      }
      //console.log('ReadoutNode.setSpecialAngle() called. angleDegs = ' + angleInDegs );
      //console.log('nbrFullTurns = ' + nbrFullTurns );
      var fullTurnCount = this.model.getFullTurnCount();
      var piRadsCount = 2*fullTurnCount;
      var fullTurnStr = '';
      //console.log('setSpecialAngleReadout called. piRadsCount = ' + piRadsCount );
      if( piRadsCount !== 0 ){
        if( fullTurnCount > 0 ){
          fullTurnStr = piRadsCount + pi + ' + ';
        }else{
          fullTurnStr = piRadsCount + pi + ' ';
        }
      }else{  //if zero turns
        fullTurnStr = '';
      }
      this.nbrFullTurnsNode.setValues( fullTurnStr, '' );
      this.angleReadoutFraction.left =  this.nbrFullTurnsNode.right; //this.nbrFullTurnsText.right;
      for( var i = 0; i < this.angleFractions.length; i++ ){
        if ( this.angles[i] === angleInDegs ){
          this.angleReadoutFraction.setValues( this.angleFractions[i][0], this.angleFractions[i][1] );
        } else if ( this.angles[i] === -1*angleInDegs ){
          this.angleReadoutFraction.setValues( '-' + this.angleFractions[i][0], this.angleFractions[i][1] );
        }
      }
      //Must handle smallAngle = 0 or pi as special cases
      if( Math.round( this.model.getSmallAngleInDegrees() ) === 0 || Math.round( this.model.getSmallAngle0To360() ) === 180 ){
        var nbrPiRads = this.model.getHalfTurnCount();
        var angleStr = nbrPiRads + pi;
       // console.log( 'angle is 0 or 180. angleStr = ' + angleStr );
        if( nbrPiRads === 0 ){
          angleStr = '0';
        }else if( nbrPiRads === 1 ){
          angleStr = pi;
        }else if( nbrPiRads === -1 ){
          angleStr = '-' + pi;
        }
        this.nbrFullTurnsNode.setValues( angleStr, '' );
        //this.nbrFullTurnsText.text = angleStr;
        //dummy angleReadoutFraction is set to ensure bounds remain constant and readoutDisplay does not jump around
        this.angleReadoutFraction.setValues( 'A', 'B' );
        this.angleReadoutFraction.visible = false;
      }
    }, //end setSpecialAngleReadout()
    setTrigReadout: function(){
      var sinText = this.model.sin().toFixed( 3 ) ;
      var cosText = this.model.cos().toFixed( 3 );
      var tanText = this.model.tan().toFixed( 3 );
      if( this.specialAnglesOnly ){
        this.setSpecialAngleTrigReadout();
      }else{
        this.sinReadoutText.text = sinText;
        this.cosReadoutText.text = cosText;
        this.tanReadoutText.text = tanText;
      }
      var tanValue = this.model.tan();
      if( tanValue < 1000 && tanValue > -1000 ){
        this.tanReadoutText.text = tanText;
      }else if( tanValue > 1000 ){
        this.tanReadoutText.text = infinityWordStr;
      }else if( tanValue < -1000 ){
        this.tanReadoutText.text = '-' + infinityWordStr;
      }
    },
    setSpecialAngleTrigReadout: function(){
      var smallAngleInDegrees = Math.round( this.model.getSmallAngle0To360() );
      for ( var i = 0; i < this.angles.length; i++ ){
        if( this.angles[i] === smallAngleInDegrees ){
          //console.log( 'angle changed, angle is ' + smallAngleInDegrees );
          this.sinReadoutFraction.setValues( this.sinFractions[i][0], this.sinFractions[i][1] );
          this.cosReadoutFraction.setValues( this.cosFractions[i][0], this.cosFractions[i][1] );
          this.tanReadoutFraction.setValues( this.tanFractions[i][0], this.tanFractions[i][1] );
          //this.coordinatesReadout.text = '( '+ this.cosReadoutFraction + ', ' + this.sinReadoutFraction + ' )';
        }
      }//end for
    }//end setSpecialAngleTrigReadout()
  } );
} );
