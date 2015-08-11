/**
 * Live readout of angle, and values of sin, cos, tan.
 * Created by Michael Dubson (PhET developer) on 6/10/2015.
 */
define( function( require ) {
  'use strict';

  // modules
  var AquaRadioButton = require( 'SUN/AquaRadioButton' );
  var FractionNode = require( 'TRIG_TOUR/trig-tour/view/FractionNode' );
  var HBox = require( 'SCENERY/nodes/HBox' );
  var HSeparator = require( 'SUN/HSeparator' );
  var HTMLText = require( 'SCENERY/nodes/HTMLText' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Node = require( 'SCENERY/nodes/Node' );
  var PhetFont = require( 'SCENERY_PHET/PhetFont' );
  var Text = require( 'SCENERY/nodes/Text' );
  var SubSupText = require( 'SCENERY_PHET/SubSupText' );
  var UtilTrig = require( 'TRIG_TOUR/trig-tour/common/Util' );
  var Util = require( 'DOT/Util' );
  var VBox = require( 'SCENERY/nodes/VBox' );

  //strings
  //next two strings used in definitions of succeeding strings, so not in alpha order
  var equalStr = ' = ';
  var theta = require( 'string!TRIG_TOUR/theta' );
  var angleStr = require( 'string!TRIG_TOUR/angle' );
  var cosStr = require( 'string!TRIG_TOUR/cos' );
  var degreesStr = require( 'string!TRIG_TOUR/degrees' );
  var infinitySymbolStr = require( 'string!TRIG_TOUR/infinitySymbol' );
  var pi = require( 'string!TRIG_TOUR/pi' );
  var plusMinusStr =  require( 'string!TRIG_TOUR/plusMinus' );
  var radsStr = require( 'string!TRIG_TOUR/rads' );
  var radiansStr = require( 'string!TRIG_TOUR/radians' );
  var sinStr = require( 'string!TRIG_TOUR/sin' );
  var tanStr = require( 'string!TRIG_TOUR/tan');
  var xyEqualsStr = '(x,y) = ';

  var xStr = 'x';
  var yStr = 'y';

  //constants
  var DISPLAY_FONT = new PhetFont( 20 );
  var DISPLAY_FONT_LARGE = new PhetFont( 30 );
  var TEXT_COLOR = UtilTrig.TEXT_COLOR;

  /**
   * Constructor for ReadoutNode which displays live values of angle, sin, cos, and tan
   * This node is the content of AccordionBox ReadoutDisplay
   * @param {TrigTourModel} model is the main model of the sim
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
    this.units = 'degrees';         //{string} 'degrees'|'radians' set by radio buttons on ReadoutNode

    // Call the super constructor
    Node.call( readoutNode );

    var row1 = new Node();    //coordinates readout: (x, y) = ( cos, sin )
    var row2 = new Node();    //angle readout: angle = value in degrees or radians
    //row 3 is this.trigRow3 declared below, 'sin'|'cos'|'tan'= trig value

    var angleValue = Util.toFixed( model.angle, 1 );      //read from model
    var sinValue = Util.toFixed( model.sin(), 3 );
    var cosValue = Util.toFixed( model.cos(), 3 );
    var tanValue = Util.toFixed( model.tan(), 3 );

    var fontInfo = { font: DISPLAY_FONT, fill: TEXT_COLOR };
    var largeFontInfo = { font: DISPLAY_FONT_LARGE, fill: TEXT_COLOR };
    var fontBoldInfo = { font: DISPLAY_FONT, fill: TEXT_COLOR, fontWeight: 'bold' };

    //Row 1: Coordinates readout (x, y) = ( cos value, sin value )
    //cos and sin values are either decimal numbers ( this.coordinatesReadout )
    //or, in Special Angle mode, they are built-up fractions of number of rads ( this.coordinatesHBox )
    var coordinatesLabel = new Text( xyEqualsStr, fontBoldInfo );
    this.sinReadoutFraction = new FractionNode( '-A', 'B', fontInfo );  //dummy arguments to set bounds
    this.cosReadoutFraction = new FractionNode( '-c', 'd', fontInfo );
    this.tanReadoutFraction = new FractionNode( '-1', '2', fontInfo );  //don't need this till row 3, trig function readout
    this.coordinatesReadout = new Text( '', fontInfo );     //text provided by model synchronization below: model.angleProperty.link
    var leftParensText = new Text( '( ', largeFontInfo );
    var commaText = new Text( ' ,  ', fontInfo );
    var rightParensText = new Text( ' )', largeFontInfo );
    var cosFractionHolder1 = new Node();    //parent holder for cosReadoutFraction; cosFractionHolder2 defined below;
    var sinFractionHolder1 = new Node();    //parent holder for sinReadoutFraction; sinFractionHolder2 defined below;
    cosFractionHolder1.addChild( this.cosReadoutFraction );
    sinFractionHolder1.addChild( this.sinReadoutFraction );

    //Assemble pieces into '( cos fraction value, sin fraction value )'
    this.coordinatesHBox = new HBox( {
      children: [
        leftParensText,
        cosFractionHolder1,
        commaText,
        sinFractionHolder1,
        rightParensText
      ],
      align: 'center',
      spacing: 0
      });
    //coordinatesHBox is visible in Special Angles mode, coordinatesReadout visible otherwise
    row1.children = [ coordinatesLabel, this.coordinatesReadout, this.coordinatesHBox ];
    this.coordinatesReadout.left = coordinatesLabel.right;
    this.coordinatesHBox.left = coordinatesLabel.right;
    this.coordinatesHBox.centerY = coordinatesLabel.centerY;

    //Row 2: 'angle = ' value in degrees or radians; value is decimal number or exact fraction of radians (in special angle mode)
    var angleEqualsStr = angleStr + ' = ';
    var angleLabel = new Text( angleEqualsStr, fontBoldInfo );
    this.angleReadoutDecimal = new SubSupText( angleValue, fontInfo );    //angle readout as decimal number
    this.nbrFullTurnsNode = new FractionNode( 'A', '', fontInfo );  //needed in Special angles mode
    this.angleReadoutFraction = new FractionNode( '-A', 'B', fontInfo );  //used to display angle as FractionNode in Special angles mode
    this.angleReadoutDecimal.visible = true;
    this.angleReadoutFraction.visible = false;
    //either angleReadoutDecimal visible (decimal number values)
    //or (nbrFullTurnsNode + angleReadoutFraction) visible in Special angles mode
    row2.children = [ angleLabel, this.angleReadoutDecimal, this.nbrFullTurnsNode, this.angleReadoutFraction ];
    //row 2 layout
    this.angleReadoutDecimal.left =  angleLabel.right ;
    this.nbrFullTurnsNode.left = angleLabel.right;
    this.angleReadoutFraction.left =  this.nbrFullTurnsNode.right ;

    //Row 3: trig function label = trig fraction = trig value
    // trig function label = 'sin'|'cos'|'tan', trig fraction = 'y/1'|'x/1'|'y/x'
    var sinLabel = new HTMLText ( sinStr + '<i>' + theta + '</i>' + equalStr, fontBoldInfo );
    var cosLabel = new HTMLText ( cosStr + '<i>' + theta + '</i>' + equalStr, fontBoldInfo );
    var tanLabel = new HTMLText ( tanStr + '<i>' + theta + '</i>' + equalStr, fontBoldInfo );
    var cosFraction = new FractionNode( xStr, 1, fontBoldInfo ) ;
    var sinFraction = new FractionNode( yStr, 1, fontBoldInfo ) ;
    var tanFraction = new FractionNode( yStr, xStr, fontBoldInfo );

    //trig readout is either decimal number (type Text) or built-up fraction (type FractionNode)
    this.sinReadoutText = new Text( sinValue, fontInfo );
    this.cosReadoutText = new Text( cosValue, fontInfo );
    this.tanReadoutText = new Text( tanValue, fontInfo );
    this.cosFractionHolder2 = new Node();    //cosFractionHolder1 used in row 1 above
    this.sinFractionHolder2 = new Node();
    this.cosFractionHolder2.addChild( this.cosReadoutFraction );
    this.sinFractionHolder2.addChild( this.sinReadoutFraction );
    var equalText1 = new Text( equalStr, fontBoldInfo );
    var equalText2 = new Text( equalStr, fontBoldInfo );
    var equalText3 = new Text( equalStr, fontBoldInfo );
    //either ReadoutText or FractionHolder2 visible, FractionHolder2 visible in Special Angles mode
    this.sinRow = new Node( {children: [ sinLabel, sinFraction, equalText1, this.sinReadoutText, this.sinFractionHolder2 ]});
    this.cosRow = new Node( {children: [ cosLabel, cosFraction, equalText2, this.cosReadoutText, this.cosFractionHolder2 ]});
    //this.tanRow = new Node( {children: [ tanLabel, tanFraction, equalText3, this.tanReadoutText, this.tanReadoutFraction ]});
    this.tanReadoutFraction.visible = false;

    //Special symbol node to show +/- infinity value of tan when at singularity
    this.plusMinusInfinityNode = new Node();
    var plusMinusText = new Text( plusMinusStr, { font: DISPLAY_FONT, fill: TEXT_COLOR } );
    var infinityText = new Text( infinitySymbolStr, { font: DISPLAY_FONT_LARGE, fill: TEXT_COLOR });
    this.plusMinusInfinityNode.children = [ plusMinusText, infinityText ];
    plusMinusText.left = 0;
    infinityText.left = plusMinusText.right;
    infinityText.centerY = -5;
    this.tanRow = new Node( {children: [ tanLabel, tanFraction, equalText3, this.tanReadoutText, this.tanReadoutFraction, this.plusMinusInfinityNode ]});

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
    this.sinFractionHolder2.left = equalText1.right + space ;
    this.cosFractionHolder2.left = equalText2.right + space ;
    this.tanReadoutFraction.left = equalText3.right + space ;
    this.plusMinusInfinityNode.left = equalText3.right ;

    this.trigRow3 = new Node( { children: [ this.sinRow, this.cosRow, this.tanRow ] } );  //visibility set from Control Panel

    // 2 radio buttons for display in degrees or radians, located at bottom of Readout Panel
    var myRadioButtonOptions = { radius: 10, fontSize: 15, deselectedColor: 'white' } ;
    var degText = new Text( degreesStr, fontInfo ) ;
    var radText = new Text( radiansStr, fontInfo );
    var degreesRadioButton = new AquaRadioButton( properties.angleUnitsProperty, 'degrees', degText, myRadioButtonOptions );
    var radiansRadioButton = new AquaRadioButton( properties.angleUnitsProperty, 'radians', radText, myRadioButtonOptions );

    //Arrays needed for display of special angles
    //Special angles in degrees
    this.angles = [ 0, 30, 45, 60, 90, 120, 135, 150, 180, 210, 225, 240, 270, 300, 315, 330, 360 ];
    //Corresponding special angles in radians
    this.angleFractions = [
      [ 0, '' ],
      [ pi, 6 ],
      [ pi, 4 ],
      [ pi, 3 ],
      [ pi, 2 ],
      [ 2 + pi, 3 ],   //Remember: it's string concatenation, so 2 + pi = 2*pi
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
      [ -1, 2 ],
      [ 0, '' ],
      [ 1, 2 ],
      [ 'q' + 2, 2 ],
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
      [ ' ', ''], //leave blank for display of plusMinusInfinityNode
      [ '-q' + 3, '' ],
      [ -1, '' ],
      [ '-q' + 3, 3 ],
      [ 0, '' ],
      [ 'q' + 3, 3 ],
      [ 1, '' ],
      [ 'q' + 3, '' ],
      [ ' ', ''], //leave blank for display of plusMinusInfinityNode
      [ '-q' + 3, '' ],
      [ -1, '' ],
      [ '-q' + 3, 3 ],
      [ 0, '' ]
    ];


    // Layout rows of Readout Panel. Entire panel is content of ReadoutDisplay AccordionBox
    var spacing = 10;

    var contentVBox = new VBox( {
      children: [
        row1,
        row2,
        readoutNode.trigRow3,
        new HSeparator( 180 ),
        degreesRadioButton,
        radiansRadioButton
      ],
      align: 'left',
      spacing: spacing,
      resize: false
    } );

    readoutNode.addChild( contentVBox );

    // Register for synchronization with model.
    model.angleProperty.link( function( angle ) {    //angle is in radians
      var sinText = Util.toFixed( model.sin(), 3 ) ;
      var cosText =  Util.toFixed( model.cos(), 3 );
      readoutNode.coordinatesReadout.text = '('+ cosText + ', ' + sinText + ')';
      readoutNode.setAngleReadout();
      readoutNode.setTrigReadout();
    } );

    model.singularityProperty.link( function( singularity ) {
      readoutNode.plusMinusInfinityNode.visible = singularity;
      if( !readoutNode.specialAnglesOnly ){
        readoutNode.tanReadoutText.visible = !singularity;
      }

    } );


  }//end constructor


  return inherit( Node, ReadoutNode, {
    //set readout units to either degrees or radians
    setUnits: function ( units ) {
      this.units = units;
      if ( units === 'radians' ) {
        this.angleReadoutDecimal.text = Util.toFixed( this.model.getAngleInRadians(), 3 ) + ' ' + radsStr;
      }
      else {
        this.angleReadoutDecimal.text = Util.toFixed( this.model.getAngleInDegrees(), this.nbrDecimalPlaces ) + '<sup>o</sup>';
      }
    },
    //Trig Row is row 3 of the readout panel, displays value of either sin, cos, or tan
    setTrigRowVisibility: function ( graph ) {
      this.trigRow3.children[0].visible = ( graph === 'sin' );
      this.trigRow3.children[1].visible = ( graph === 'cos' );
      this.trigRow3.children[2].visible = ( graph === 'tan' );
    } ,
    setAngleReadoutPrecision: function( nbrDecimalPlaces ){
      this.nbrDecimalPlaces = nbrDecimalPlaces;
    },
    //sets format of angle readout (row 2) of readout panel: degrees, radians, or special angles
    setAngleReadout: function(){
      if( !this.radiansDisplayed ){
        this.angleReadoutDecimal.text = Util.toFixed( this.model.getAngleInDegrees(), this.nbrDecimalPlaces ) + '<sup>o</sup>';
      }
      if( this.radiansDisplayed && !this.specialAnglesOnly ){
        this.angleReadoutDecimal.text = Util.toFixed( this.model.angle, 3 ) + ' ' + radsStr;
      }
      if( this.radiansDisplayed && this.specialAnglesOnly ){
        this.setSpecialAngleReadout();
      }
    },
    setSpecialAngleReadout: function(){
      this.angleReadoutFraction.visible = true;
      var angleInDegs = Util.roundSymmetric( this.model.getAngleInDegrees() );  //need integer value of angle, internal arithmetic often not-quite integer
      if( Math.abs( angleInDegs ) > 360 ){
        angleInDegs = angleInDegs%360;
      }
      var fullTurnCount = this.model.getFullTurnCount();  //number of full turns around unit circle, incremented at theta = 0
      var piRadsCount = 2*fullTurnCount;                  //number of half turns around unit circle; half-turn = pi radians
      var fullTurnStr = '';   //Angle readout has format theta = 4pi + (1/2)pi = fullTurnStr + small angle
      if( piRadsCount !== 0 ){
        if( fullTurnCount > 0 ){  //if angle positive
          fullTurnStr = piRadsCount + pi + ' + ';
        }else{                    //if angle negative, minus sign is constructed in FractionNode
          fullTurnStr = piRadsCount + pi + ' ';
        }
      }else{  //if zero turns
        fullTurnStr = '';
      }
      this.nbrFullTurnsNode.setValues( fullTurnStr, '' );
      this.angleReadoutFraction.left =  this.nbrFullTurnsNode.right; //this.nbrFullTurnsText.right;
      for( var i = 0; i < this.angleFractions.length; i++ ){
        //if angle positive
        if ( this.angles[i] === angleInDegs ){
          this.angleReadoutFraction.setValues( this.angleFractions[i][0], this.angleFractions[i][1] );
        //if angle negative
        } else if ( this.angles[i] === -1*angleInDegs ){
          this.angleReadoutFraction.setValues( '-' + this.angleFractions[i][0], this.angleFractions[i][1] );
        }
      }
      //Must handle smallAngle = 0 or pi as special cases
      if( Util.roundSymmetric( this.model.getSmallAngleInDegrees() ) === 0 || Util.roundSymmetric( this.model.getSmallAngle0To360() ) === 180 ){
        var nbrPiRads = this.model.getHalfTurnCount();
        var angleStr = nbrPiRads + pi;
        if( nbrPiRads === 0 ){
          angleStr = '0';
        }else if( nbrPiRads === 1 ){
          angleStr = pi;
        }else if( nbrPiRads === -1 ){
          angleStr = '-' + pi;
        }
        this.nbrFullTurnsNode.setValues( angleStr, '' );

        //dummy angleReadoutFraction is set to ensure bounds remain constant and readoutDisplay does not jump around
        this.angleReadoutFraction.setValues( 'A', 'B' );
        this.angleReadoutFraction.visible = false;
      }
    }, //end setSpecialAngleReadout()
    setTrigReadout: function(){
      var sinText = Util.toFixed( this.model.sin(), 3 );
      var cosText = Util.toFixed( this.model.cos(), 3 );
      var tanText = Util.toFixed( this.model.tan(), 3 );
      if( this.specialAnglesOnly ){
        this.setSpecialAngleTrigReadout();
      }else{
        this.sinReadoutText.text = sinText;
        this.cosReadoutText.text = cosText;
        this.tanReadoutText.text = tanText;
      }
    },
    setSpecialAngleTrigReadout: function(){
      var smallAngleInDegrees = Util.roundSymmetric( this.model.getSmallAngle0To360() );
      for ( var i = 0; i < this.angles.length; i++ ){
        if( this.angles[i] === smallAngleInDegrees ){
          this.sinReadoutFraction.setValues( this.sinFractions[i][0], this.sinFractions[i][1] );
          this.cosReadoutFraction.setValues( this.cosFractions[i][0], this.cosFractions[i][1] );
          this.tanReadoutFraction.setValues( this.tanFractions[i][0], this.tanFractions[i][1] );
        }
      }//end for
      //console.log( 'this.coordinatesHBox.top = ' + this.coordinatesHBox.top );
      this.coordinatesHBox.centerY = -7;   //hack to prevent coordinatesHBox layout from wandering, don't know why this line needed
    }//end setSpecialAngleTrigReadout()
  } );
} );
