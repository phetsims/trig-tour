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

  //strings
  var numeratorStr = '';
  var denominatorStr = '';

  //constants
  var DISPLAY_FONT = new PhetFont( 20 );

  /**
   * Constructor for RotorNode which renders rotor as a scenery node.
   * @param {TrigLabModel} model is the main model of the sim
   * @constructor
   */
  function FractionNode( numerator, denominator, options  ) {

    var fractionNode = this;

    // Call the super constructor
    Node.call( fractionNode, { } );
    var fontInfo = { font: DISPLAY_FONT };
    var numeratorText = new Text( numerator.toString(), fontInfo );
    var denominatorText = new Text ( denominator.toString(), fontInfo );
    var length = 1.2*numeratorText.width;
    var bar = new Line( -length/2, 0, length/2, 0, { stroke: '#000', lineWidth: 2, lineCap: 'round' } ); //dividing bar
    fractionNode.children = [ numeratorText, bar, denominatorText ];

    //layout
    numeratorText.centerX = denominatorText.centerX = bar.centerX = 0;
    var offset = 2;
    numeratorText.bottom = bar.top - offset;
    denominatorText.top = bar.bottom + offset;


  }

  return inherit( Node, FractionNode );
} );