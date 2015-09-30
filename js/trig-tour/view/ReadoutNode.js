// Copyright 2002-2015, University of Colorado Boulder

/**
 * Live readout of angle, and values of sin, cos, tan.
 *
 * @author Michael Dubson (PhET developer) on 6/10/2015.
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
  var TrigTourColors = require( 'TRIG_TOUR/trig-tour/view/TrigTourColors' );
  var Util = require( 'DOT/Util' );
  var VBox = require( 'SCENERY/nodes/VBox' );
  var SpecialAngles = require( 'TRIG_TOUR/trig-tour/SpecialAngles' );
  var TrigTourMathStrings = require( 'TRIG_TOUR/trig-tour/TrigTourMathStrings' );

  //strings
  var thetaString = require( 'string!TRIG_TOUR/theta' );
  var angleString = require( 'string!TRIG_TOUR/angle' );
  var cosString = require( 'string!TRIG_TOUR/cos' );
  var degreesString = require( 'string!TRIG_TOUR/degrees' );
  var infinitySymbolString = require( 'string!TRIG_TOUR/infinitySymbol' );
  var pi = require( 'string!TRIG_TOUR/pi' );
  var plusMinusString = require( 'string!TRIG_TOUR/plusMinus' );
  var radsString = require( 'string!TRIG_TOUR/rads' );
  var radiansString = require( 'string!TRIG_TOUR/radians' );
  var sinString = require( 'string!TRIG_TOUR/sin' );
  var tanString = require( 'string!TRIG_TOUR/tan' );

  //constants
  var DISPLAY_FONT = new PhetFont( 20 );
  var DISPLAY_FONT_LARGE = new PhetFont( 30 );
  var TEXT_COLOR = TrigTourColors.TEXT_COLOR;

  /**
   * Constructor for ReadoutNode which displays live values of fullAngle, sin, cos, and tan
   * This node is the content of AccordionBox ReadoutDisplay
   *
   * @param {TrigTourModel} model is the main model of the sim
   * @param {ViewProperties} viewProperties
   * @constructor
   */
  function ReadoutNode( model, viewProperties ) {

    var readoutNode = this;

    // @private
    this.model = model;
    this.viewProperties = viewProperties;
    this.decimalPrecision = 1;      // number of decimal places for display of fullAngle, = 0 for special angles
    this.units = 'degrees';         // {string} 'degrees'|'radians' set by radio buttons on ReadoutNode

    // Call the super constructor
    Node.call( readoutNode );

    var row1 = new Node();    // coordinates readout: (x, y) = ( cos, sin )
    var row2 = new Node();    // fullAngle readout: fullAngle = value in degrees or radians
    // row 3 is this.trigRow3 declared below, 'sin'|'cos'|'tan'= trig value

    var fullAngleValue = Util.toFixed( model.fullAngle, 1 );
    var sinValue = Util.toFixed( model.sin(), 3 );
    var cosValue = Util.toFixed( model.cos(), 3 );
    var tanValue = Util.toFixed( model.tan(), 3 );

    var fontInfo = { font: DISPLAY_FONT, fill: TEXT_COLOR };
    var largeFontInfo = { font: DISPLAY_FONT_LARGE, fill: TEXT_COLOR };
    var fontBoldInfo = { font: DISPLAY_FONT, fill: TEXT_COLOR, fontWeight: 'bold' };

    // Row 1: Coordinates readout (x, y) = ( cos value, sin value )
    // cos and sin values are either decimal numbers ( this.coordinatesReadout )
    // or, in Special Angle mode, they are built-up fractions of number of rads ( this.coordinatesHBox )
    var coordinatesLabel = new Text( TrigTourMathStrings.X_Y_EQUALS_STRING, fontBoldInfo );
    this.sinReadoutFraction = new FractionNode( '-A', 'B', fontInfo );  // dummy arguments to set bounds
    this.cosReadoutFraction = new FractionNode( '-c', 'd', fontInfo );
    this.tanReadoutFraction = new FractionNode( '-1', '2', fontInfo );  // don't need till row 3, trig function readout
    this.coordinatesReadout = new Text( '', fontInfo );     // text provided by model.fullAngleProperty.link, below
    var leftParensText = new Text( '( ', largeFontInfo );
    var commaText = new Text( ' ,  ', fontInfo );
    var rightParensText = new Text( ' )', largeFontInfo );
    var cosFractionHolder1 = new Node();    // parent holder for cosReadoutFraction; cosFractionHolder2 defined below;
    var sinFractionHolder1 = new Node();    // parent holder for sinReadoutFraction; sinFractionHolder2 defined below;
    cosFractionHolder1.addChild( this.cosReadoutFraction );
    sinFractionHolder1.addChild( this.sinReadoutFraction );

    // Assemble pieces into '( cos fraction value, sin fraction value )'
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
    } );

    // coordinatesHBox is visible in Special Angles mode, coordinatesReadout visible otherwise
    row1.children = [ coordinatesLabel, this.coordinatesReadout, this.coordinatesHBox ];
    this.coordinatesReadout.left = coordinatesLabel.right;
    this.coordinatesHBox.left = coordinatesLabel.right;
    this.coordinatesHBox.centerY = coordinatesLabel.centerY;

    // Row 2: 'angle = ' value in degrees or radians;
    //  value is decimal number or exact fraction of radians (in special angle mode)
    var angleEqualsString = angleString + ' = ';
    var angleLabel = new Text( angleEqualsString, fontBoldInfo );
    this.angleReadoutDecimal = new SubSupText( fullAngleValue, fontInfo ); // angle readout as decimal number
    this.fullAngleFractionNode = new FractionNode( 'A', '', fontInfo );  // node representing fractional form of full angle

    // used to display angle as FractionNode in Special angles mode
    this.angleReadoutFraction = new FractionNode( '-A', 'B', fontInfo );
    this.angleReadoutDecimal.visible = true;
    this.angleReadoutFraction.visible = false;

    // Either angleReadoutDecimal visible (decimal number values)
    // or (fullAngleFractionNode + angleReadoutFraction) visible in Special angles mode
    row2.children = [ angleLabel, this.angleReadoutDecimal, this.fullAngleFractionNode, this.angleReadoutFraction ];

    // row 2 layout
    this.angleReadoutDecimal.left = angleLabel.right;
    this.fullAngleFractionNode.left = angleLabel.right;
    this.angleReadoutFraction.left = this.fullAngleFractionNode.right;

    // Row 3: trig function label = trig fraction = trig value
    // trig function label = 'sin'|'cos'|'tan', trig fraction = 'y/1'|'x/1'|'y/x'
    var equalString = TrigTourMathStrings.EQUALS_STRING;
    var xString = TrigTourMathStrings.X_STRING;
    var yString = TrigTourMathStrings.Y_STRING;
    var sinLabel = new HTMLText( sinString + '<i>' + thetaString + '</i>' + equalString, fontBoldInfo );
    var cosLabel = new HTMLText( cosString + '<i>' + thetaString + '</i>' + equalString, fontBoldInfo );
    var tanLabel = new HTMLText( tanString + '<i>' + thetaString + '</i>' + equalString, fontBoldInfo );
    var cosFraction = new FractionNode( xString, 1, fontBoldInfo );
    var sinFraction = new FractionNode( yString, 1, fontBoldInfo );
    var tanFraction = new FractionNode( yString, xString, fontBoldInfo );

    // trig readout is either decimal number (type Text) or built-up fraction (type FractionNode)
    this.sinReadoutText = new Text( sinValue, fontInfo );
    this.cosReadoutText = new Text( cosValue, fontInfo );
    this.tanReadoutText = new Text( tanValue, fontInfo );
    this.cosFractionHolder2 = new Node(); // cosFractionHolder1 used in row 1 above
    this.sinFractionHolder2 = new Node();
    this.cosFractionHolder2.addChild( this.cosReadoutFraction );
    this.sinFractionHolder2.addChild( this.sinReadoutFraction );
    var equalText1 = new Text( equalString, fontBoldInfo );
    var equalText2 = new Text( equalString, fontBoldInfo );
    var equalText3 = new Text( equalString, fontBoldInfo );
    // either ReadoutText or FractionHolder2 visible, FractionHolder2 visible in Special Angles mode
    this.sinRow = new Node(
      {
        children: [ sinLabel, sinFraction, equalText1, this.sinReadoutText, this.sinFractionHolder2 ]
      } );
    this.cosRow = new Node(
      {
        children: [ cosLabel, cosFraction, equalText2, this.cosReadoutText, this.cosFractionHolder2 ]
      } );
    this.tanReadoutFraction.visible = false;

    // Special symbol node to show +/- infinity value of tan when at singularity
    this.plusMinusInfinityNode = new Node();
    var plusMinusText = new Text( plusMinusString, { font: DISPLAY_FONT, fill: TEXT_COLOR } );
    var infinityText = new Text( infinitySymbolString, { font: DISPLAY_FONT_LARGE, fill: TEXT_COLOR } );
    this.plusMinusInfinityNode.children = [ plusMinusText, infinityText ];
    plusMinusText.left = 0;
    infinityText.left = plusMinusText.right;
    infinityText.centerY = -5;
    this.tanRow = new Node(
      {
        children: [
          tanLabel,
          tanFraction,
          equalText3,
          this.tanReadoutText,
          this.tanReadoutFraction,
          this.plusMinusInfinityNode
        ]
      } );

    // trig row layout
    sinFraction.left = sinLabel.right;
    cosFraction.left = cosLabel.right;
    tanFraction.left = tanLabel.right;
    var space = 4;
    equalText1.left = sinFraction.right + space;
    equalText2.left = cosFraction.right + space;
    equalText3.left = tanFraction.right + space;
    this.sinReadoutText.left = equalText1.right + space;
    this.cosReadoutText.left = equalText2.right + space;
    this.tanReadoutText.left = equalText3.right + space;
    this.sinFractionHolder2.left = equalText1.right + space;
    this.cosFractionHolder2.left = equalText2.right + space;
    this.tanReadoutFraction.left = equalText3.right + space;
    this.plusMinusInfinityNode.left = equalText3.right;

    // visibility of trigRow3 set from Control Panel
    this.trigRow3 = new Node( { children: [ this.sinRow, this.cosRow, this.tanRow ] } );

    // 2 radio buttons for display in degrees or radians, located at bottom of Readout Panel
    var myRadioButtonOptions = { radius: 10, fontSize: 15, deselectedColor: 'white' };
    var degreeText = new Text( degreesString, fontInfo );
    var radiansText = new Text( radiansString, fontInfo );
    var degreesRadioButton = new AquaRadioButton(
      viewProperties.angleUnitsProperty,
      'degrees',
      degreeText,
      myRadioButtonOptions
    );
    var radiansRadioButton = new AquaRadioButton(
      viewProperties.angleUnitsProperty,
      'radians',
      radiansText,
      myRadioButtonOptions
    );

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
    model.fullAngleProperty.link( function( fullAngle ) {    // fullAngle is in radians
      var sinText = Util.toFixed( model.sin(), 3 );
      var cosText = Util.toFixed( model.cos(), 3 );
      readoutNode.coordinatesReadout.text = '(' + cosText + ', ' + sinText + ')';
      readoutNode.setAngleReadout();
      readoutNode.setTrigReadout();
    } );

    model.singularityProperty.link( function( singularity ) {
      readoutNode.plusMinusInfinityNode.visible = singularity;
      if ( !readoutNode.viewProperties.specialAnglesVisible ) {
        readoutNode.tanReadoutText.visible = !singularity;
      }
    } );
  }

  return inherit( Node, ReadoutNode, {
    /**
     * Set readout units to either degrees or radians.
     *
     * @param {string} units one of 'degrees' || 'radians'
     */
    setUnits: function( units ) {
      this.units = units;
      if ( units === 'radians' ) {
        this.angleReadoutDecimal.text = Util.toFixed( this.model.getFullAngleInRadians(), 3 ) + ' ' + radsString;
      }
      else {
        var roundedAngle = Util.toFixed( this.model.getFullAngleInDegrees(), this.decimalPrecision );
        this.angleReadoutDecimal.text = roundedAngle + '<sup>o</sup>';
      }
    },

    /**
     * Set which type of trig display is visible.  Trig row is row 3 of the readout panel.  Displays value of either
     * sin, cos, or tan.
     *
     * @param {string} graph
     */
    setTrigRowVisibility: function( graph ) {
      this.trigRow3.children[ 0 ].visible = ( graph === 'sin' );
      this.trigRow3.children[ 1 ].visible = ( graph === 'cos' );
      this.trigRow3.children[ 2 ].visible = ( graph === 'tan' );
    },

    /**
     * Set the fullAngle readout precision.
     *
     * @param {number} decimalPrecision
     */
    setAngleReadoutPrecision: function( decimalPrecision ) {
      this.decimalPrecision = decimalPrecision;
    },

    /**
     * Sets the unit format of angle readout of readout panel in degrees, radians, or special angles.
     */
    setAngleReadout: function() {
      var radiansDisplayed = this.viewProperties.angleUnits === 'radians';
      var specialAnglesVisible = this.viewProperties.specialAnglesVisible === true;
      if ( !radiansDisplayed ) {
        this.angleReadoutDecimal.text = Util.toFixed( this.model.getFullAngleInDegrees(), this.decimalPrecision ) + '<sup>o</sup>';
      }
      if ( radiansDisplayed && !specialAnglesVisible ) {
        this.angleReadoutDecimal.text = Util.toFixed( this.model.fullAngle, 3 ) + ' ' + radsString;
      }
      if ( radiansDisplayed && specialAnglesVisible ) {
        this.setSpecialAngleReadout();
      }
    },

    /**
     * Set the special angle readout.
     */
    setSpecialAngleReadout: function() {
      var thisNode = this;

      this.angleReadoutFraction.visible = true;

      // need integer value of angle, since internal arithmetic often not-quite integer
      var angleInDegs = Util.roundSymmetric( this.model.getFullAngleInDegrees() );
      if ( Math.abs( angleInDegs ) > 360 ) {
        angleInDegs = angleInDegs % 360;
      }

      // number of full turns around unit circle, incremented at theta = 0
      var fullTurnCount = this.model.fullTurnCount;
      var piRadiansCount = 2 * fullTurnCount; // number of half turns around unit circle; half-turn = pi radians
      var fullTurnString = ''; // angle readout has format theta = 4pi + (1/2)pi = fullTurnString + small angle
      if ( piRadiansCount !== 0 ) {
        if ( fullTurnCount > 0 ) {
          fullTurnString = piRadiansCount + pi + ' + ';
        }
        else {
          // if angle negative, minus sign is constructed in FractionNode
          fullTurnString = piRadiansCount + pi + ' ';
        }
      }
      else {
        // if zero turns, set full turn string to null string.
        fullTurnString = '';
      }

      this.fullAngleFractionNode.setValues( fullTurnString, '', false );
      this.angleReadoutFraction.left = this.fullAngleFractionNode.right;

      // set the angle readout, making sure that the angle is defined in the special fractions object
      var specialAngleFractions = SpecialAngles.SPECIAL_ANGLE_FRACTIONS;
      if ( specialAngleFractions[ angleInDegs ] || specialAngleFractions[ -angleInDegs ] ) {
        // correct for negative angles, fraction must reflect if negative and objects in SpecialAngles do not track
        // this information
        var sign = angleInDegs >= 0 ? '' : '-';
        var coefficient = angleInDegs >= 0 ? +1 : -1;
        thisNode.angleReadoutFraction.setValues(
          sign + specialAngleFractions[ coefficient * angleInDegs ].numerator, // string concatenation
          specialAngleFractions[ coefficient * angleInDegs ].denominator,
          false /* no radicals for special angle fractions */
        );
      }

      // Must handle smallAngle = 0 or pi as special cases
      var roundedAngle = Util.roundSymmetric( this.model.getSmallAngleInDegrees() );
      if ( roundedAngle === 0 || roundedAngle === 180 ) {
        var nbrPiRads = this.model.halfTurnCount;
        var angleString = nbrPiRads + pi;
        if ( nbrPiRads === 0 ) {
          angleString = '0';
        }
        else if ( nbrPiRads === 1 ) {
          angleString = pi;
        }
        else if ( nbrPiRads === -1 ) {
          angleString = '-' + pi;
        }
        this.fullAngleFractionNode.setValues( angleString, '' );

        // dummy angleReadoutFraction is set to ensure bounds remain constant and readoutDisplay does not jump around
        this.angleReadoutFraction.setValues( 'A', 'B' );
        this.angleReadoutFraction.visible = false;
      }
    },

    /**
     * Set the trig readout display.
     */
    setTrigReadout: function() {
      var sinText = Util.toFixed( this.model.sin(), 3 );
      var cosText = Util.toFixed( this.model.cos(), 3 );
      var tanText = Util.toFixed( this.model.tan(), 3 );
      if ( this.viewProperties.specialAnglesVisible ) {
        this.setSpecialAngleTrigReadout();
      }
      else {
        this.sinReadoutText.text = sinText;
        this.cosReadoutText.text = cosText;
        this.tanReadoutText.text = tanText;
      }
    },

    /**
     * Set the special angle readout display.
     */
    setSpecialAngleTrigReadout: function() {
      var smallAngleInDegrees = Util.roundSymmetric( this.model.getSmallAngle0To360() );

      // get the values needed to represent the special angle as a fraction.
      var specialCosFraction = SpecialAngles.SPECIAL_COS_FRACTIONS[ smallAngleInDegrees ];
      var specialSinFraction = SpecialAngles.SPECIAL_SIN_FRACTIONS[ smallAngleInDegrees ];
      var specialTanFraction = SpecialAngles.SPECIAL_TAN_FRACTIONS[ smallAngleInDegrees ];

      var setFractionValues = function( readoutFraction, specialFraction ) {
        // sanity check to make sure that the special fraction is defined in the special fractions objects above
        if ( specialFraction ) {
          readoutFraction.setValues(
            specialFraction.numerator,
            specialFraction.denominator,
            specialFraction.radical,
            specialFraction.negative
          );
        }
      };
      setFractionValues( this.sinReadoutFraction, specialSinFraction );
      setFractionValues( this.cosReadoutFraction, specialCosFraction );
      setFractionValues( this.tanReadoutFraction, specialTanFraction );
    }
  } );
} );
