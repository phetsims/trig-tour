// Copyright 2016-2022, University of Colorado Boulder

/**
 * A convenience type that builds up a trig function as a label.  Normal text cannot be used because the desired look
 * of the label is a trig function and a theta symbol, where the theta symbol has a unique font style.  HTMLText
 * cannot be used for this because it is performance intensive for stings that are meant ot be dynamic.  The trig
 * function label should look something like 'cos θ' .
 *
 * @author Jesse Greenberg
 */

import merge from '../../../../phet-core/js/merge.js';
import MathSymbols from '../../../../scenery-phet/js/MathSymbols.js';
import PhetFont from '../../../../scenery-phet/js/PhetFont.js';
import { HBox, Text } from '../../../../scenery/js/imports.js';
import trigTour from '../../trigTour.js';

// constants
const DISPLAY_FONT = new PhetFont( { size: 20 } );
const DISPLAY_FONT_ITALIC = new PhetFont( { size: 20, style: 'italic' } );

class TrigFunctionLabelText extends HBox {
  /**
   * Constructor.
   *
   * @param {string} trigFunctionString - label for the trig function
   * @param {Object} [options]
   */
  constructor( trigFunctionString, options ) {

    options = merge( {
      trigFunctionLabelFont: DISPLAY_FONT,
      thetaLabelFont: DISPLAY_FONT_ITALIC
    }, options );

    // build the text for the trig function label
    const trigTitleText = new Text( trigFunctionString, { font: options.trigFunctionLabelFont } );

    // create the text for the mathematical symbol theta
    const trigThetaText = new Text( MathSymbols.THETA, { font: options.thetaLabelFont } );

    // build the text, placing both function and theta labels in an HBox
    super( { children: [ trigTitleText, trigThetaText ], spacing: 0, resize: false } );

  }
}

trigTour.register( 'TrigFunctionLabelText', TrigFunctionLabelText );

export default TrigFunctionLabelText;