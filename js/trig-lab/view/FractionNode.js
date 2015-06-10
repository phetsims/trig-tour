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

  //strings
  //var numeratorStr = '';
  //var denominatorStr = '';

  //constants
  //var DISPLAY_FONT = new PhetFont( 20 );

  /**
   * Constructor for FractionNode which takes two sting inputs, A and B, and creates built-up fraction A/B:
   *    A
   *    -
   *    B
   * @param {string} numerator
   * @param {string} denominator
   * @param {object} options
   * @constructor
   */
  function FractionNode( numerator, denominator, options ) {       //inputs can be strings or not

    var fractionNode = this;

    // Call the super constructor

    Node.call( fractionNode, { } );
    //var fontInfo = { font: DISPLAY_FONT };
    var numeratorText;
    var denominatorText;
    if( typeof numerator == 'string' ){
      numeratorText = new Text( numerator, options );
    }else{
      numeratorText = new Text( numerator.toString(), options );
    }
    if( typeof denominator == 'string' ){
      denominatorText = new Text( denominator, options );
    }else{
      denominatorText = new Text( denominator.toString(), options );
    }

    var length = 1.2*numeratorText.width;
    var midHeight = 7;
    var bar = new Line( -length/2, -midHeight, length/2, -midHeight, { stroke: '#000', lineWidth: 2, lineCap: 'round' } ); //dividing bar
    fractionNode.children = [ numeratorText, bar, denominatorText ];

    //layout
    numeratorText.centerX = denominatorText.centerX = bar.centerX = 0;
    var offset = 2;
    numeratorText.bottom = bar.top - offset;
    denominatorText.top = bar.bottom + offset;


  }

  return inherit( Node, FractionNode );
} );