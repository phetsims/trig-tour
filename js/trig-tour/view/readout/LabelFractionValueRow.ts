// Copyright 2016-2025, University of Colorado Boulder

/**
 * Creates the third row for the ReadoutNode of Trig Tour.  This row contains a label for the trig function,
 * a fraction representation of the value, and the numeric value.  This row is organized, separated by the equality
 * sign.  It looks like this:
 *
 * trig function label = trig fraction = trig value
 *
 * @author Michael Dubson (PhET developer) on 6/10/2015
 * @author Jesse Greenberg
 */

import DerivedProperty from '../../../../../axon/js/DerivedProperty.js';
import Emitter from '../../../../../axon/js/Emitter.js';
import TReadOnlyProperty from '../../../../../axon/js/TReadOnlyProperty.js';
import Utils from '../../../../../dot/js/Utils.js';
import StringUtils from '../../../../../phetcommon/js/util/StringUtils.js';
import MathSymbols from '../../../../../scenery-phet/js/MathSymbols.js';
import PhetFont from '../../../../../scenery-phet/js/PhetFont.js';
import Node, { NodeOptions } from '../../../../../scenery/js/nodes/Node.js';
import Text from '../../../../../scenery/js/nodes/Text.js';
import trigTour from '../../../trigTour.js';
import TrigTourStrings from '../../../TrigTourStrings.js';
import TrigTourModel from '../../model/TrigTourModel.js';
import SpecialAngles, { SpecialAngle, SpecialAngleMap } from '../../SpecialAngles.js';
import TrigTourMathStrings from '../../TrigTourMathStrings.js';
import TrigTourUtils from '../../TrigTourUtils.js';
import TrigFunctionLabelText from '../TrigFunctionLabelText.js';
import TrigTourColors from '../TrigTourColors.js';
import ViewProperties, { Graph } from '../ViewProperties.js';
import FractionNode from './FractionNode.js';

const cosStringProperty = TrigTourStrings.cosStringProperty;
const sinStringProperty = TrigTourStrings.sinStringProperty;
const tanStringProperty = TrigTourStrings.tanStringProperty;
const xStringProperty = TrigTourStrings.xStringProperty;
const yStringProperty = TrigTourStrings.yStringProperty;

// non translatable string
const equalString = TrigTourMathStrings.EQUALS_STRING;

//constants
const DISPLAY_FONT = new PhetFont( 20 );
const DISPLAY_FONT_LARGE = new PhetFont( 30 );
const DISPLAY_FONT_LARGE_BOLD = new PhetFont( { size: 20, weight: 'bold' } );
const DISPLAY_FONT_LARGE_BOLD_ITALIC = new PhetFont( { size: 20, weight: 'bold', style: 'italic' } );
const TEXT_COLOR = TrigTourColors.TEXT_COLOR;

class LabelFractionValueRow extends Node {

  private readonly trigTourModel: TrigTourModel;
  private readonly viewProperties: ViewProperties;
  private readonly graphType: Graph;

  // Describes the math represented in this row for accessibility.
  public readonly descriptionStringProperty: TReadOnlyProperty<string>;

  // collection of special angles for this trig function
  private readonly specialAngles: SpecialAngleMap;

  // For layout purposes, indicate whenever the visible bounds of this component change (there is no such Property in scenery).
  public readonly visibleBoundsChangedEmitter = new Emitter();

  public constructor( graphType: Graph, trigTourModel: TrigTourModel, viewProperties: ViewProperties, providedOptions?: NodeOptions ) {
    super( providedOptions );

    // prevent block fitting of this row as a performance optimization
    this.preventFit = true;

    // exclude invisible children from bounds, so that the highlight accurately surrounds the visible content
    this.excludeInvisibleChildrenFromBounds = true;

    this.trigTourModel = trigTourModel;
    this.viewProperties = viewProperties;
    this.graphType = graphType;

    const fontOptions = { font: DISPLAY_FONT, fill: TEXT_COLOR };

    // initialize strings and variables for the row, depending on graphType
    let trigString;
    let numeratorString;
    let denominatorString;

    // get the values needed to represent the special angle as a fraction, dependent on trig function type
    switch( graphType ) {
      case 'sin': {
        trigString = sinStringProperty;
        numeratorString = yStringProperty;
        denominatorString = '1';
        this.specialAngles = SpecialAngles.SPECIAL_SIN_FRACTIONS;
        break;
      }
      case 'cos': {
        trigString = cosStringProperty;
        numeratorString = xStringProperty;
        denominatorString = '1';
        this.specialAngles = SpecialAngles.SPECIAL_COS_FRACTIONS;
        break;
      }
      default:

        // 'tan' case
        trigString = tanStringProperty;
        numeratorString = yStringProperty;
        denominatorString = xStringProperty;
        this.specialAngles = SpecialAngles.SPECIAL_TAN_FRACTIONS;
        break;
    }

    // label section of the row, something like 'Cos θ ='
    const trigLabelText = new TrigFunctionLabelText( trigString, {
      trigFunctionLabelFont: DISPLAY_FONT_LARGE_BOLD,
      thetaLabelFont: DISPLAY_FONT_LARGE_BOLD_ITALIC
    } );
    const leftEqualText = new Text( equalString, { font: DISPLAY_FONT_LARGE_BOLD } );

    // label fraction for the row defining the shown value, something like 'x/1'
    const trigFraction = new FractionNode( numeratorString, denominatorString, {
      textOptions: { font: new PhetFont( 20 ), fontWeight: 'bold' }
    } );

    // value presented by this row as a number, updates with the model and depends on the angle
    const trigValueNumberText = new Text( 'trigModelValue', fontOptions );

    // value presented by this row as a fraction, updates with the model and depends on the angle
    const trigValueFraction = new FractionNode( '', '', { textOptions: fontOptions } );

    // create an text representation of the equal sign
    const rightEqualText = new Text( equalString, { font: DISPLAY_FONT_LARGE_BOLD } );

    this.children = [ trigLabelText, leftEqualText, trigFraction, rightEqualText, trigValueNumberText, trigValueFraction ];

    // layout
    const space = 4;
    leftEqualText.leftCenter = trigLabelText.rightCenter.plusXY( space, 0 );
    trigFraction.leftCenter = leftEqualText.rightCenter.plusXY( space, 0 );
    rightEqualText.leftCenter = trigFraction.rightCenter.plusXY( space, 0 );
    trigValueNumberText.leftCenter = rightEqualText.rightCenter.plusXY( space, 0 );
    trigValueFraction.leftCenter = rightEqualText.rightCenter.plusXY( space, 0 );

    // if this row is for 'tan', create and add an infinity symbol to represent the singularity
    if ( graphType === 'tan' ) {
      const plusMinusInfinityNode = new Node();
      const plusMinusText = new Text( MathSymbols.PLUS_MINUS, { font: DISPLAY_FONT, fill: TEXT_COLOR } );
      const infinityText = new Text( MathSymbols.INFINITY, { font: DISPLAY_FONT_LARGE, fill: TEXT_COLOR } );
      plusMinusInfinityNode.children = [ plusMinusText, infinityText ];
      plusMinusText.left = 0;
      infinityText.left = plusMinusText.right;
      infinityText.centerY = -5;
      plusMinusInfinityNode.leftCenter = rightEqualText.rightCenter;
      this.addChild( plusMinusInfinityNode );

      trigTourModel.singularityProperty.link( singularity => {
        plusMinusInfinityNode.visible = singularity;
        if ( !viewProperties.specialAnglesVisibleProperty.value ) {
          trigValueNumberText.visible = !singularity;
        }

        this.visibleBoundsChangedEmitter.emit();
      } );
    }

    // synchronize row values with model
    trigTourModel.fullAngleProperty.link( () => {
      this.setTrigReadout( trigValueNumberText, trigValueFraction );
    } );

    // synchronize component visibility with view properties
    viewProperties.specialAnglesVisibleProperty.link( specialAnglesVisible => {
      trigValueFraction.visible = specialAnglesVisible;
      trigValueNumberText.visible = !specialAnglesVisible;
      this.setTrigReadout( trigValueNumberText, trigValueFraction );

      this.visibleBoundsChangedEmitter.emit();
    } );

    this.descriptionStringProperty = new DerivedProperty( [
      trigTourModel.fullAngleProperty,
      trigValueFraction.descriptionStringProperty,
      viewProperties.specialAnglesVisibleProperty,
      trigTourModel.singularityProperty
    ], (
      fullAngle: number,
      trigValueFractionString: string,
      specialAnglesVisible: boolean,
      singularity
    ) => {

      const trigFunctionProperty = graphType === 'sin' ? TrigTourStrings.a11y.translatable.math.sinFunctionStringProperty :
                                   graphType === 'cos' ? TrigTourStrings.a11y.translatable.math.cosFunctionStringProperty :
                                   TrigTourStrings.a11y.translatable.math.tanFunctionStringProperty;

      const trigValue = ( graphType === 'tan' && singularity ) ? TrigTourStrings.a11y.translatable.math.infinityStringProperty :
                        specialAnglesVisible ? trigValueFractionString :
                        TrigTourUtils.getNaturalLanguageValueString( trigValueNumberText.string );

      return StringUtils.fillIn( TrigTourStrings.a11y.translatable.math.trigReadoutPatternStringProperty, {
        trigFunction: trigFunctionProperty,
        trigFraction: trigFraction.descriptionStringProperty,
        value: trigValue
      } );
    } );
  }

  /**
   * Set the value of the trig value.
   */
  private setTrigReadout( trigValueNumberText: Text, trigValueFraction: FractionNode ): void {
    if ( this.viewProperties.specialAnglesVisibleProperty.value ) {
      this.setSpecialAngleTrigReadout( trigValueFraction );
    }

    let trigValue;
    if ( this.graphType === 'sin' ) {
      trigValue = this.trigTourModel.sin();
    }
    else if ( this.graphType === 'cos' ) {
      trigValue = this.trigTourModel.cos();
    }
    else {
      trigValue = this.trigTourModel.tan();
    }

    trigValueNumberText.string = Utils.toFixed( trigValue, 3 );
  }

  /**
   * Set the special angle readout display.
   */
  private setSpecialAngleTrigReadout( trigValueFraction: FractionNode ): void {
    const smallAngleInDegrees = Utils.roundSymmetric( this.trigTourModel.getSmallAngle0To360() );

    // get the values needed to represent the special angle as a fraction.
    const specialFraction = this.specialAngles[ smallAngleInDegrees as SpecialAngle ];

    // sanity check to make sure that the special fraction is defined in the special fractions objects above
    if ( specialFraction ) {
      trigValueFraction.setValues(
        specialFraction.numerator,
        specialFraction.denominator,
        specialFraction.radical
      );
    }
  }
}

trigTour.register( 'LabelFractionValueRow', LabelFractionValueRow );

export default LabelFractionValueRow;