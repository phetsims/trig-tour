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

  var DISPLAY_FONT = new PhetFont( 20 );
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

    this.fractionNode = this;

    // Call the super constructor
    Node.call( this.fractionNode, { } );
    this.numerator = numerator;
    this.denominator = denominator;
    this.setFraction( );

  }//end of constructor

  return inherit( Node, FractionNode, {
    setValues: function( valuesArray ){
      this.numerator = valuesArray[ 0 ];
      this.denominator = valuesArray[ 1 ];
      //console.log( 'FractionNode.setValues called. numerator = ' + this.numerator + '   denominator = ' + this.denominator );
      this.setFraction();
    },
    setFraction: function( ){
      var numeratorText;
      var denominatorText;
      var minusSign;       //short horizontal line for minus sign, only displayed if needed
      var numeratorNegative = false;    //true if numerator is negative
      var denominatorNegative = false;
      var minusSignNeeded = false;      //true if sign of over-all fraction is negative
      var fontInfo = { font: DISPLAY_FONT };

      if( this.denominator == undefined || this.denominator == '' ){
        if( typeof this.numerator != 'string' ){ this.numerator = this.numerator.toString(); }
        this.fractionNode.addChild( new Text( this.numerator, fontInfo ) );
        return; //have to break out somehow
      }

      if( typeof this.numerator != 'string' ){ this.numerator = this.numerator.toString(); }
      if( typeof this.denominator != 'string' ){ this.denominator = this.denominator.toString(); }

      if( this.numerator.charAt( 0 ) == '-' ){  //remove minus sign, if found
        this.numerator = this.numerator.slice( 1 );
        numeratorNegative = true;
      }
      if( this.denominator.charAt( 0 ) == '-' ){  //remove minus sign, if found
        this.denominator = this.denominator.slice( 1 );
        denominatorNegative = true;
      }

      numeratorText = new Text( this.numerator, fontInfo );
      denominatorText = new Text( this.denominator, fontInfo );

      if((numeratorNegative && !denominatorNegative) || ( !numeratorNegative && denominatorNegative )){
        minusSignNeeded = true;
      }

      //Draw minus sign to go in front of fraction.  Only displayed if needed.
      var length = 8;
      var midHeight = 7;
      minusSign = new Line( 0, -midHeight, length, -midHeight, { stroke: '#000', lineWidth: 2, lineCap: 'round' } );

      //Draw horizontal line separating numerator and denominator
      length = 1.2*numeratorText.width;
      var bar = new Line( 0, -midHeight, length, -midHeight, { stroke: '#000', lineWidth: 2, lineCap: 'round' } ); //dividing bar

      if( minusSignNeeded ){
        this.fractionNode.children = [ minusSign, numeratorText, bar, denominatorText ];
      }else{
        this.fractionNode.children = [ numeratorText, bar, denominatorText ];
      }

      //layout
      bar.left = 0;
      numeratorText.centerX = denominatorText.centerX = bar.centerX;
      var offset = 2;
      numeratorText.bottom = bar.top - offset;
      denominatorText.top = bar.bottom + offset;
      if( minusSignNeeded ){
        minusSign.right = bar.left - 3;
      }
    }//end createFraction()
  }); //end return inherit..
} );