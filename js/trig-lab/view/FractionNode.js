/**
 * Displays a built-up fraction
 * Created by dubson on 6/10/2015.
 */

define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var Line = require( 'SCENERY/nodes/Line' );
  var Node = require( 'SCENERY/nodes/Node' );
  var Path = require( 'SCENERY/nodes/Path' );
  var PhetFont = require( 'SCENERY_PHET/PhetFont' );
  var Shape = require( 'KITE/Shape' );
  var Text = require( 'SCENERY/nodes/Text' );


  /**
   * Constructor for FractionNode which takes two string inputs, A and B, and creates built-up fraction A/B:
   *    A
   *    -
   *    B
   *    If either A or B (but not both) is negative, a minus sign is displayed at the same level as the divider bar
   * @param {string} numerator
   * @param {string} denominator
   * @param {object} options
   * @constructor
   */
  function FractionNode( numerator, denominator, options ) {       //inputs can be strings or not

    var fractionNode = this;

    // Call the super constructor
    Node.call( fractionNode, { } );

    var numeratorText;
    var denominatorText;
    var minusSign;       //short horizontal line for minus sign, only displayed if needed
    var numeratorNegative = false;    //true if numerator is negative
    var denominatorNegative = false;
    var minusSignNeeded = false;      //true if sign of over-all fraction is negative

    if( typeof numerator != 'string' ){ numerator = numerator.toString(); }

    if( numerator.charAt( 0 ) == '-' ){  //remove minus sign, if found
        numerator = numerator.slice( 1 );
        numeratorNegative = true;
    }

    numeratorText = new Text( numerator, options );

    if( typeof denominator != 'string' ){ denominator = denominator.toString(); }

    if( denominator.charAt( 0 ) == '-' ){  //remove minus sign, if found
      denominator = denominator.slice( 1 );
      denominatorNegative = true;
    }


    denominatorText = new Text( denominator, options );

    if((numeratorNegative && !denominatorNegative) || ( !numeratorNegative && denominatorNegative )){
      minusSignNeeded = true;
    }

    //Draw minus sign to go in front of fraction.  Only displayed if needed.
    var length = 8;
    var midHeight = 7;
    minusSign = new Line( -length/2, -midHeight, length/2, -midHeight, { stroke: '#000', lineWidth: 2, lineCap: 'round' } );

    //Draw horizontal line separating numerator and denominator
    length = 1.2*numeratorText.width;
    var bar = new Line( -length/2, -midHeight, length/2, -midHeight, { stroke: '#000', lineWidth: 2, lineCap: 'round' } ); //dividing bar

    if( minusSignNeeded ){
      fractionNode.children = [ minusSign, numeratorText, bar, denominatorText ];
    }else{
      fractionNode.children = [ numeratorText, bar, denominatorText ];
    }

    //layout
    numeratorText.centerX = denominatorText.centerX = bar.centerX = 0;
    var offset = 2;
    numeratorText.bottom = bar.top - offset;
    denominatorText.top = bar.bottom + offset;
    if( minusSignNeeded ){
      minusSign.centerX = 0;
      minusSign.right = bar.left - 3;
    }

  }//end of constructor

  return inherit( Node, FractionNode );
} );