// Copyright 2016-2025, University of Colorado Boulder

/**
 * A convenience type that builds up a trig function as a label.  Normal text cannot be used because the desired look
 * of the label is a trig function and a theta symbol, where the theta symbol has a unique font style.  HTMLText
 * cannot be used for this because it is performance intensive for stings that are meant ot be dynamic.  The trig
 * function label should look something like 'cos θ' .
 *
 * @author Jesse Greenberg
 */

import { TReadOnlyProperty } from '../../../../axon/js/TReadOnlyProperty.js';
import optionize from '../../../../phet-core/js/optionize.js';
import MathSymbols from '../../../../scenery-phet/js/MathSymbols.js';
import PhetFont from '../../../../scenery-phet/js/PhetFont.js';
import HBox, { HBoxOptions } from '../../../../scenery/js/layout/nodes/HBox.js';
import Text from '../../../../scenery/js/nodes/Text.js';
import trigTour from '../../trigTour.js';

// constants
const DISPLAY_FONT = new PhetFont( { size: 20 } );
const DISPLAY_FONT_ITALIC = new PhetFont( { size: 20, style: 'italic' } );

type SelfOptions = {
  trigFunctionLabelFont?: PhetFont;
  thetaLabelFont?: PhetFont;

  // Max width for the trig function label.
  labelMaxWidth?: number;
};
type ParentOptions = HBoxOptions;

export type TrigFunctionLabelTextOptions = SelfOptions & ParentOptions;

class TrigFunctionLabelText extends HBox {

  // A reference for the title text so that it can be disposed.
  private readonly trigTitleText: Text;

  /**
   * @param trigFunctionString - displayed label for the trig function
   * @param [providedOptions]
   */
  public constructor( trigFunctionString: string | TReadOnlyProperty<string>, providedOptions?: TrigFunctionLabelTextOptions ) {

    const options = optionize<TrigFunctionLabelTextOptions, SelfOptions, ParentOptions>()( {
      trigFunctionLabelFont: DISPLAY_FONT,
      thetaLabelFont: DISPLAY_FONT_ITALIC,
      labelMaxWidth: 32 // by inspection, for i18n
    }, providedOptions );

    // build the text for the trig function label
    const trigTitleText = new Text( trigFunctionString, {
      font: options.trigFunctionLabelFont,
      maxWidth: options.labelMaxWidth
    } );

    // create the text for the mathematical symbol theta
    const trigThetaText = new Text( MathSymbols.THETA, { font: options.thetaLabelFont } );

    // build the text, placing both function and theta labels in an HBox
    super( { children: [ trigTitleText, trigThetaText ], spacing: 0 } );

    this.trigTitleText = trigTitleText;
  }

  public override dispose(): void {
    this.trigTitleText.dispose();
    super.dispose();
  }
}

trigTour.register( 'TrigFunctionLabelText', TrigFunctionLabelText );

export default TrigFunctionLabelText;