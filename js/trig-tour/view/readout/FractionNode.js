// Copyright 2015-2022, University of Colorado Boulder

/**
 * Displays a built-up fraction, used in the ReadoutNode of Trig Tour.  This node is only ever used in the
 * readout panel.
 *
 * @author Michael Dubson (PhET developer) on 6/10/2015.
 */

import { Shape } from '../../../../../kite/js/imports.js';
import merge from '../../../../../phet-core/js/merge.js';
import PhetFont from '../../../../../scenery-phet/js/PhetFont.js';
import { Line, Node, Path, Text } from '../../../../../scenery/js/imports.js';
import trigTour from '../../../trigTour.js';
import TrigTourColors from '../TrigTourColors.js';

class FractionNode extends Node {

  /**
   * Constructor for FractionNode which takes two string parameters, A and B, and creates built-up fraction A/B:
   *    A
   *    -
   *    B
   *    If either A or B (but not both) is negative, a minus sign is displayed at the same level as the divider bar
   *    If numerator includes the string 'q' , then a square root symbol is placed on the numerator
   *    If the denominator is '' (empty string), then the numerator is displayed as an ordinary number (not a fraction).
   * @param {string|number} numerator
   * @param {string|number} denominator
   * @param {Object} [options]
   */
  constructor( numerator, denominator, options ) {

    options = merge( {
      radical: false, // does this fraction contain a radical in the numerator?

      // fonts for numerator and denominator text
      font: new PhetFont( 20 ),
      fill: TrigTourColors.TEXT_COLOR,
      fontWeight: 'normal'
    }, options );

    // call the super constructor
    super( options );

    this.numerator = numerator; // @public (read-only)
    this.denominator = denominator; // @public (read-only)
    this.radical = options.radical; // @public (read-only)
    this.fontOptions = _.pick( options, 'font', 'fill', 'fontWeight' ); // @private options for text

    // create the fraction
    this.setFraction();

    this.mutate( options );
  }


  /**
   * Set the numerator and denominator of this fractionNode.
   * @public
   *
   * @param {string|number} numerator
   * @param {string|number} denominator
   * @param {boolean} [radical] - optional parameter, does the numerator contain a radical?
   */
  setValues( numerator, denominator, radical ) {

    this.numerator = numerator;
    this.denominator = denominator;

    if ( typeof radical !== 'undefined' ) {
      this.radical = radical;
    }

    this.setFraction();
  }

  /**
   * Set the fraction node and draw its various parts.
   * @private
   */
  setFraction() {
    let minusSign;                            // short horizontal line for minus sign, in front of divisor bar
    let numeratorNegative = false;            // true if numerator is negative
    let denominatorNegative = false;          // true if denominator is negative
    let minusSignNeeded = false;              // true if sign of over-all fraction is negative
    const squareRootSignNeeded = this.radical;  // true if square root symbol is needed over the numerator
    let denominatorNeeded = true;             // true if only the numerator is displayed as a fractional number

    // Check that arguments are strings
    if ( typeof this.numerator !== 'string' ) { this.numerator = this.numerator.toString(); }
    if ( typeof this.denominator !== 'string' ) { this.denominator = this.denominator.toString(); }

    // Process leading minus sign and determine overall sign.
    if ( this.numerator.charAt( 0 ) === '-' ) {
      // remove minus sign, if found
      this.numerator = this.numerator.slice( 1 );
      numeratorNegative = true;
    }
    if ( this.denominator.charAt( 0 ) === '-' ) {
      // remove minus sign, if found
      this.denominator = this.denominator.slice( 1 );
      denominatorNegative = true;
    }
    // JavaScript does not have an xor operator
    minusSignNeeded = ( numeratorNegative && !denominatorNegative ) || ( !numeratorNegative && denominatorNegative );

    const fontOptions = this.fontOptions;
    const numeratorText = new Text( this.numerator, fontOptions );
    const denominatorText = new Text( this.denominator, fontOptions );

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
    if ( typeof this.denominator === 'undefined' || this.denominator === '' ) {
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