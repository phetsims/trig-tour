// Copyright 2016-2019, University of Colorado Boulder

/**
 * Creates the second row for the ReadoutNode of Trig Tour.  This row contains a label for the angle and the value
 * of the model angle, in degrees or radians.
 *
 * @author Michael Dubson (PhET developer) on 6/10/2015
 * @author Jesse Greenberg
 */
define( require => {
  'use strict';

  // modules
  const FractionNode = require( 'TRIG_TOUR/trig-tour/view/readout/FractionNode' );
  const inherit = require( 'PHET_CORE/inherit' );
  const MathSymbols = require( 'SCENERY_PHET/MathSymbols' );
  const Node = require( 'SCENERY/nodes/Node' );
  const PhetFont = require( 'SCENERY_PHET/PhetFont' );
  const SpecialAngles = require( 'TRIG_TOUR/trig-tour/SpecialAngles' );
  const StringUtils = require( 'PHETCOMMON/util/StringUtils' );
  const Text = require( 'SCENERY/nodes/Text' );
  const trigTour = require( 'TRIG_TOUR/trigTour' );
  const TrigTourColors = require( 'TRIG_TOUR/trig-tour/view/TrigTourColors' );
  const TrigTourMathStrings = require( 'TRIG_TOUR/trig-tour/TrigTourMathStrings' );
  const Util = require( 'DOT/Util' );

  //strings
  const angleString = require( 'string!TRIG_TOUR/angle' );
  const radsString = require( 'string!TRIG_TOUR/rads' );
  const valueUnitPatternString = require( 'string!TRIG_TOUR/valueUnitPattern' );

  // non-translatable string
  const equalString = TrigTourMathStrings.EQUALS_STRING;

  //constants
  const DISPLAY_FONT = new PhetFont( 20 );
  const TEXT_COLOR = TrigTourColors.TEXT_COLOR;

  /**
   * Constructor.
   *
   * @param {TrigTourModel} trigTourModel is the main model of the sim
   * @param {ViewProperties} viewProperties
   * @param {Object} [options] to pass the maximum width of content in the ReadoutNode panel in the screen view.
   * @constructor
   */
  function AngleReadoutRow( trigTourModel, viewProperties, options ) {

    Node.call( this, options );
    const self = this;

    // @private
    this.decimalPrecision = 1; // number of decimal places for display of fullAngle, = 0 for special angles
    this.units = 'degrees'; // {string} 'degrees'|'radians' set by radio buttons on ReadoutNode
    this.viewProperties = viewProperties;
    this.trigTourModel = trigTourModel;

    // initialize font styles
    const fontInfo = { font: DISPLAY_FONT, fill: TEXT_COLOR };
    const fontBoldInfo = { font: DISPLAY_FONT, fill: TEXT_COLOR, fontWeight: 'bold' };

    // full angle for the trigTourModel
    const fullAngleValue = Util.toFixed( trigTourModel.fullAngleProperty.value, 1 );

    //  value is decimal number or exact fraction of radians (in special angle mode)
    const angleLabelText = new Text( angleString, fontBoldInfo );
    const angleLabelEqualsText = new Text( equalString, fontBoldInfo );
    this.angleReadoutDecimal = new Text( fullAngleValue, fontInfo ); // angle readout as decimal number
    this.fullAngleFractionNode = new FractionNode( '', '', fontInfo );  // node representing fractional form of full angle

    // used to display angle as FractionNode in Special angles mode
    this.angleReadoutFraction = new FractionNode( '', '', fontInfo );
    this.angleReadoutDecimal.visible = true;
    this.angleReadoutFraction.visible = false;

    // Either angleReadoutDecimal visible (decimal number values)
    // or (fullAngleFractionNode + angleReadoutFraction) visible in Special angles mode
    this.children = [ angleLabelText, angleLabelEqualsText, this.angleReadoutDecimal, this.fullAngleFractionNode, this.angleReadoutFraction ];

    // row 2 layout
    const spacing = 4;
    angleLabelEqualsText.left = angleLabelText.right + spacing;
    this.angleReadoutDecimal.left = angleLabelEqualsText.right + spacing;
    this.fullAngleFractionNode.left = angleLabelEqualsText.right + spacing;
    this.angleReadoutFraction.left = this.fullAngleFractionNode.right + spacing;

    trigTourModel.fullAngleProperty.link( function( fullAngle ) {    // fullAngle is in radians
      self.setAngleReadout();
    } );

    viewProperties.angleUnitsProperty.link( function( units ) {
      self.setUnits( units );
      if ( units === 'radians' && viewProperties.specialAnglesVisibleProperty.value ) {
        self.fullAngleFractionNode.visible = true;
        self.angleReadoutFraction.visible = true;
        self.angleReadoutDecimal.visible = false;
      }
      else {
        self.fullAngleFractionNode.visible = false;
        self.angleReadoutFraction.visible = false;
        self.angleReadoutDecimal.visible = true;
      }
      self.setAngleReadout();
    } );

    viewProperties.specialAnglesVisibleProperty.link( function( specialAnglesVisible ) {

      //select correct angle readout
      if ( specialAnglesVisible && viewProperties.angleUnitsProperty.value === 'radians' ) {
        self.fullAngleFractionNode.visible = true;
        self.angleReadoutFraction.visible = true;
        self.angleReadoutDecimal.visible = false;
      }
      else {
        self.fullAngleFractionNode.visible = false;
        self.angleReadoutFraction.visible = false;
        self.angleReadoutDecimal.visible = true;
      }

      // set precision of angle readout in degrees:
      // in special angles mode, zero decimal places (e.g. 45 deg), otherwise 1 decimal place (e.g. 45.0 deg)
      if ( specialAnglesVisible ) {
        const currentSmallAngle = trigTourModel.getSmallAngleInRadians();
        trigTourModel.setSpecialAngleWithSmallAngle( currentSmallAngle );
        self.setAngleReadoutPrecision( 0 );   //integer display of special angles
      }
      else {
        // 1 decimal place precision for continuous angles
        self.setAngleReadoutPrecision( 1 );
      }
      self.setAngleReadout();
    } );
  }

  trigTour.register( 'AngleReadoutRow', AngleReadoutRow );

  return inherit( Node, AngleReadoutRow, {

    /**
     * Set readout units to either degrees or radians.
     *
     * @param {string} units one of 'degrees' || 'radians'
     */
    setUnits: function( units ) {
      this.units = units;
      if ( units === 'radians' ) {
        const radiansValue = Util.toFixed( this.trigTourModel.getFullAngleInRadians(), 3 );
        const unitsString = StringUtils.format( valueUnitPatternString, radiansValue, radsString );
        this.angleReadoutDecimal.text = unitsString;
      }
      else {
        const roundedAngle = Util.toFixed( this.trigTourModel.getFullAngleInDegrees(), this.decimalPrecision );
        this.angleReadoutDecimal.text = roundedAngle + '\u00B0';
      }
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
      const radiansDisplayed = this.viewProperties.angleUnitsProperty.value === 'radians';
      const specialAnglesVisible = this.viewProperties.specialAnglesVisibleProperty.value === true;
      if ( !radiansDisplayed ) {
        this.angleReadoutDecimal.text = Util.toFixed( this.trigTourModel.getFullAngleInDegrees(), this.decimalPrecision ) + '\u00B0';
      }
      if ( radiansDisplayed && !specialAnglesVisible ) {
        this.angleReadoutDecimal.text = Util.toFixed( this.trigTourModel.fullAngleProperty.value, 3 ) + ' ' + radsString;
      }
      if ( radiansDisplayed && specialAnglesVisible ) {
        this.setSpecialAngleReadout();
      }
    },

    /**
     * Set the special angle readout.
     */
    setSpecialAngleReadout: function() {
      const self = this;

      this.angleReadoutFraction.visible = true;

      // need integer value of angle, since internal arithmetic often not-quite integer
      let angleInDegs = Util.roundSymmetric( this.trigTourModel.getFullAngleInDegrees() );
      if ( Math.abs( angleInDegs ) > 360 ) {
        angleInDegs = angleInDegs % 360;
      }

      // number of full turns around unit circle, incremented at theta = 0
      const fullTurnCount = this.trigTourModel.fullTurnCount;
      const piRadiansCount = 2 * fullTurnCount; // number of half turns around unit circle; half-turn = pi radians
      let fullTurnString = ''; // angle readout has format theta = 4pi + (1/2)pi = fullTurnString + small angle
      if ( piRadiansCount !== 0 ) {
        if ( fullTurnCount > 0 ) {
          fullTurnString = piRadiansCount + MathSymbols.PI + ' + ';
        }
        else {
          // if angle negative, minus sign is constructed in FractionNode
          fullTurnString = piRadiansCount + MathSymbols.PI + ' ';
        }
      }
      else {
        // if zero turns, set full turn string to null string.
        fullTurnString = '';
      }

      this.fullAngleFractionNode.setValues( fullTurnString, '', false );
      this.angleReadoutFraction.left = this.fullAngleFractionNode.right;

      // set the angle readout, making sure that the angle is defined in the special fractions object
      const specialAngleFractions = SpecialAngles.SPECIAL_ANGLE_FRACTIONS;
      if ( specialAngleFractions[ angleInDegs ] || specialAngleFractions[ -angleInDegs ] ) {
        // correct for negative angles, fraction must reflect if negative and objects in SpecialAngles do not track
        // this information
        const sign = angleInDegs >= 0 ? '' : '-';
        const coefficient = angleInDegs >= 0 ? +1 : -1;
        self.angleReadoutFraction.setValues(
          sign + specialAngleFractions[ coefficient * angleInDegs ].numerator, // string concatenation
          specialAngleFractions[ coefficient * angleInDegs ].denominator,
          false /* no radicals for special angle fractions */
        );
      }

      // Must handle smallAngle = 0 or pi as special cases
      const roundedAngle = Util.roundSymmetric( this.trigTourModel.getSmallAngleInDegrees() );
      if ( roundedAngle === 0 || roundedAngle === 180 ) {
        const nbrPiRads = this.trigTourModel.halfTurnCount;
        let angleRadianString = nbrPiRads + MathSymbols.PI;
        if ( nbrPiRads === 0 ) {
          angleRadianString = '0';
        }
        else if ( nbrPiRads === 1 ) {
          angleRadianString = MathSymbols.PI;
        }
        else if ( nbrPiRads === -1 ) {
          angleRadianString = '-' + MathSymbols.PI;
        }
        this.fullAngleFractionNode.setValues( angleRadianString, '' );

        // dummy angleReadoutFraction is set to ensure bounds remain constant and readoutDisplay does not jump around
        this.angleReadoutFraction.setValues( 'A', 'B' );
        this.angleReadoutFraction.visible = false;
      }
    }
  } );
} );
