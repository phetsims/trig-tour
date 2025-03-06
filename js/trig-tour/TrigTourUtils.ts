// Copyright 2025, University of Colorado Boulder

/**
 * Utility functions for trig-tour.
 *
 * @author Jesse Greenberg
 */

import StringUtils from '../../../phetcommon/js/util/StringUtils.js';
import trigTour from '../trigTour.js';
import TrigTourStrings from '../TrigTourStrings.js';
import TrigTourMathStrings from './TrigTourMathStrings.js';

const TrigTourUtils = {

  /**
   * Returns true if a string represents a negative value by including a minus sign.
   */
  isNegativeValueString( valueString: string ): boolean {
    return valueString.includes( TrigTourMathStrings.MINUS_STRING );
  },

  /**
   * Remove the minus sign from a math string.
   */
  removeMinusSign( value: string ): string {
    const regex = new RegExp( TrigTourMathStrings.MINUS_STRING, 'g' );
    return value.replace( regex, '' ).trim();
  },

  /**
   * Returns a natural language readable string for a value string. For example, "-45" becomes "negative 45".
   * Assistive technology reads the negative sign as "minus" which is not accurate enough for a learning context.
   */
  getNaturalLanguageValueString( valueString: string ): string {
    if ( TrigTourUtils.isNegativeValueString( valueString ) ) {
      const withoutMinus = TrigTourUtils.removeMinusSign( valueString );
      return StringUtils.fillIn( TrigTourStrings.a11y.math.negativePatternStringProperty, {
        value: withoutMinus
      } );
    }
    else {
      return valueString;
    }
  }
};

trigTour.register( 'TrigTourUtils', TrigTourUtils );

export default TrigTourUtils;