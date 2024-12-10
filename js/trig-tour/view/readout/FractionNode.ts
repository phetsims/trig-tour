// Copyright 2015-2024, University of Colorado Boulder

/**
 * Displays a built-up fraction, used in the ReadoutNode of Trig Tour.  This node is only ever used in the
 * readout panel.
 *
 * @author Michael Dubson (PhET developer) on 6/10/2015.
 */

import ReadOnlyProperty from '../../../../../axon/js/ReadOnlyProperty.js';
import TReadOnlyProperty from '../../../../../axon/js/TReadOnlyProperty.js';
import { Shape } from '../../../../../kite/js/imports.js';
import optionize from '../../../../../phet-core/js/optionize.js';
import PhetFont from '../../../../../scenery-phet/js/PhetFont.js';
import { Line, Node, NodeOptions, Path, Text, TextOptions } from '../../../../../scenery/js/imports.js';
import trigTour from '../../../trigTour.js';
import TrigTourColors from '../TrigTourColors.js';

type SelfOptions = {

  // does this fraction contain a radical in the numerator?
  radical?: boolean;

  // fonts for numerator and denominator text
  textOptions?: TextOptions;
};

type ParentOptions = NodeOptions;
export type FractionNodeOptions = SelfOptions & ParentOptions;

type FractionValue = string | number | TReadOnlyProperty<string | number>;

class FractionNode extends Node {
  private _numerator: FractionValue;
  private _denominator: FractionValue;
  private _radical: boolean;

  // A callback that will update the layout of the fraction components.
  private boundSetFraction = this.setFraction.bind( this );

  // options for Text
  private readonly textOptions: TextOptions;

  /**
   * Constructor for FractionNode which takes two string parameters, A and B, and creates built-up fraction A/B:
   *    A
   *    -
   *    B
   *    If either A or B (but not both) is negative, a minus sign is displayed at the same level as the divider bar
   *    If numerator includes the string 'q' , then a square root symbol is placed on the numerator
   *    If the denominator is '' (empty string), then the numerator is displayed as an ordinary number (not a fraction).
   */
  public constructor( numerator: FractionValue, denominator: FractionValue, providedOptions: FractionNodeOptions ) {

    const options = optionize<FractionNodeOptions, SelfOptions, ParentOptions>()( {
      radical: false,
      textOptions: {
        font: new PhetFont( 20 ),
        fill: TrigTourColors.TEXT_COLOR,
        fontWeight: 'normal',

        // Found by inspection, the maximum width of the text in the fraction node.
        maxWidth: 12
      }
    }, providedOptions );

    // call the super constructor
    super( options );

    this.textOptions = options.textOptions;

    this.setValues( numerator, denominator, options.radical );

    // Set in setValues, but defined here so TypeScript is happy.
    this._numerator = numerator;
    this._denominator = denominator;
    this._radical = options.radical

    // create the fraction
    this.setFraction();

    this.mutate( options );
  }

  /**
   * Getter for the numerator of this fractionNode.
   */
  public get numerator(): FractionValue {
    return this._numerator;
  }

  /**
   * Getter for the denominator of this fractionNode.
   */
  public getDenominator(): FractionValue {
    return this._denominator;
  }

  /**
   * Getter for the radical property of this fractionNode.
   */
  public isRadical(): boolean {
    return this._radical;
  }

  /**
   * Set the numerator and denominator of this fractionNode.
   *
   * @param numerator
   * @param denominator
   * @param [radical] - optional parameter, does the numerator contain a radical?
   */
  public setValues( numerator: FractionValue, denominator: FractionValue, radical?: boolean ): void {

    // Remove the bound setFraction callback from the previous numerator and denominator, if they
    // were Properties.
    if ( this._numerator instanceof ReadOnlyProperty ) {
      assert && assert( this._numerator.hasListener( this.boundSetFraction ), 'numerator should have the layout listener' );
      this._numerator.unlink( this.boundSetFraction );
    }
    if ( this._denominator instanceof ReadOnlyProperty ) {
      assert && assert( this._denominator.hasListener( this.boundSetFraction ), 'denominator should have the layout listener' );
      this._denominator.unlink( this.boundSetFraction );
    }

    this._numerator = numerator;
    this._denominator = denominator;

    if ( typeof radical !== 'undefined' ) {
      this._radical = radical;
    }

    this.setFraction();

    // Add the bound layout callback to the new numerator and denominator, if they are Properties.
    if ( this._numerator instanceof ReadOnlyProperty ) {
      this._numerator.link( this.boundSetFraction );
    }
    if ( this._denominator instanceof ReadOnlyProperty ) {
      this._denominator.link( this.boundSetFraction );
    }
  }

  private static getStringValue( fractionValue: FractionValue ): string {
    if ( fractionValue instanceof ReadOnlyProperty ) {
      return fractionValue.value.toString();
    }
    else {
      return fractionValue.toString();
    }
  }

  /**
   * Set the fraction node and draw its various parts.
   */
  private setFraction(): void {
    let minusSign;                            // short horizontal line for minus sign, in front of divisor bar
    let numeratorNegative = false;            // true if numerator is negative
    let denominatorNegative = false;          // true if denominator is negative
    let minusSignNeeded = false;              // true if sign of over-all fraction is negative
    const squareRootSignNeeded = this._radical;  // true if square root symbol is needed over the numerator
    let denominatorNeeded = true;             // true if only the numerator is displayed as a fractional number

    // Resolve to the string value of the numerator and denominator.
    let numerator = FractionNode.getStringValue( this._numerator );
    let denominator = FractionNode.getStringValue( this._denominator );

    // Process leading minus sign and determine overall sign.
    if ( numerator.startsWith( '-' ) ) {

      // remove minus sign, if found
      numerator = numerator.slice( 1 );
      numeratorNegative = true;
    }
    if ( denominator.startsWith( '-' ) ) {

      // remove minus sign, if found
      denominator = denominator.slice( 1 );
      denominatorNegative = true;
    }

    // JavaScript does not have an xor operator
    minusSignNeeded = ( numeratorNegative && !denominatorNegative ) || ( !numeratorNegative && denominatorNegative );

    const textOptions = this.textOptions;
    const numeratorText = new Text( numerator, textOptions );
    const denominatorText = new Text( denominator, textOptions );

    // Draw minus sign to go in front of fraction, if needed.
    let length = 8;
    const midHeight = 7;
    if ( minusSignNeeded ) {
      minusSign = new Line( 0, -midHeight, length, -midHeight, {
        stroke: TrigTourColors.LINE_COLOR,
        lineWidth: 2,
        lineCap: 'round'
      } );
    }
    else {

      // just a placeholder is no minus sign
      minusSign = new Line( 0, 0, 0, 0 );
    }

    // Draw horizontal line separating numerator and denominator
    if ( squareRootSignNeeded ) {
      length = 1.8 * numeratorText.width;
    }
    else {
      length = 1.2 * numeratorText.width;
    }

    // dividing bar
    const bar = new Line( 0, -midHeight, length, -midHeight, {
      stroke: TrigTourColors.LINE_COLOR,
      lineWidth: 2,
      lineCap: 'round'
    } );

    // draw square root symbol
    const sqRtShape = new Shape();
    if ( squareRootSignNeeded ) {
      const W = 1.2 * numeratorText.width;
      const h = 0.8 * numeratorText.height;
      const w = h / 4;
      sqRtShape.moveTo( -3 * w / 2, -h / 2 ).lineTo( -w, 0 ).lineTo( 0, -h ).lineTo( W, -h );
    }
    const sqRtPath = new Path( sqRtShape, { stroke: TrigTourColors.LINE_COLOR, lineWidth: 1, lineCap: 'round' } );

    // if no denominator argument is passed in, then display the numerator as a non-fraction number
    if ( typeof denominator === 'undefined' || denominator === '' ) {

      // make current children invisible so numerator is not obscured
      denominatorNeeded = false;
      for ( let i = 0; i < this.children.length; i++ ) {
        this.children[ i ].visible = false;
      }

      this.children = [ minusSign, sqRtPath, numeratorText ];

      if ( minusSignNeeded ) {
        minusSign.left = 0;
        numeratorText.left = minusSign.right + 4;
      }
      if ( squareRootSignNeeded && minusSignNeeded ) {
        numeratorText.left = minusSign.right + 12;
        sqRtPath.centerX = numeratorText.centerX - 3;
      }
      if ( squareRootSignNeeded && !minusSignNeeded ) {
        sqRtPath.left = 0;
        numeratorText.centerX = sqRtPath.centerX + 3;
      }

      return; // have to break out
    }

    if ( denominatorNeeded ) {
      this.children = [ sqRtPath, minusSign, numeratorText, bar, denominatorText ];
    }
    bar.left = 0;
    numeratorText.centerX = denominatorText.centerX = bar.centerX;
    let offset = 2;
    numeratorText.bottom = bar.top - offset;
    denominatorText.top = bar.bottom + offset;
    offset = 4;
    if ( minusSignNeeded ) {
      minusSign.left = 0;
      bar.left = minusSign.right + offset;
      numeratorText.centerX = denominatorText.centerX = bar.centerX;
    }
    else if ( !denominatorNeeded ) {
      numeratorText.left = minusSign.right + offset;
    }
    if ( squareRootSignNeeded ) {
      sqRtPath.top = numeratorText.top;
      sqRtPath.centerX = numeratorText.centerX - 3;
    }
  }
}

trigTour.register( 'FractionNode', FractionNode );

export default FractionNode;