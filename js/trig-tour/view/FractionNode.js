// Copyright 2002-2015, University of Colorado Boulder

/**
 * Displays a built-up fraction
 * Created by Michael Dubson (PhET developer) on 6/10/2015.
 */

define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var Line = require( 'SCENERY/nodes/Line' );
  var Node = require( 'SCENERY/nodes/Node' );
  var Path = require( 'SCENERY/nodes/Path' );
  var Shape = require( 'KITE/Shape' );
  var Text = require( 'SCENERY/nodes/Text' );

  /**
   * Constructor for FractionNode which takes two string parameters, A and B, and creates built-up fraction A/B:
   *    A
   *    -
   *    B
   *    If either A or B (but not both) is negative, a minus sign is displayed at the same level as the divider bar
   *    If numerator includes the string 'q' , then a square root symbol is placed on the numerator
   *    If the denominator is '' (empty string), then the numerator is displayed as an ordinary number (not a fraction).
   * @param {string} numerator
   * @param {string} denominator
   * @param {Object} options
   * @constructor
   */

  function FractionNode( numerator, denominator, options ) {   //numerator and denominator can be Numbers or Strings

    this.options = options;
    this.fractionNode = this;

    // Call the super constructor
    Node.call( this.fractionNode );

    this.numerator = numerator;
    this.denominator = denominator;

    //create the fraction
    this.setFraction( );

    this.mutate( options );

  }//end of constructor

  return inherit( Node, FractionNode, {
    setValues: function( numerator, denominator ){
      this.numerator = numerator ;
      this.denominator = denominator ;
      this.setFraction();
    },

    setFraction: function( ){
      var minusSign;                    //short horizontal line for minus sign, in front of divisor bar
      var numeratorNegative = false;    //true if numerator is negative
      var denominatorNegative = false;  //true if denominator is negative
      var minusSignNeeded = false;      //true if sign of over-all fraction is negative
      var squareRootSignNeeded = false; //true if square root symbol is needed over the numerator
      var noDenominator = false;        //true if only the numerator is displayed as a non-fraction number

      //Check that arguments are strings
      if( typeof this.numerator !== 'string' ){ this.numerator = this.numerator.toString(); }
      if( typeof this.denominator !== 'string' ){ this.denominator = this.denominator.toString(); }

      //Process leading minus sign and square root tag
      if( this.numerator.charAt( 0 ) === '-' ){  //remove minus sign, if found
        this.numerator = this.numerator.slice( 1 );
        numeratorNegative = true;
      }
      if( this.denominator.charAt( 0 ) === '-' ){  //remove minus sign, if found
        this.denominator = this.denominator.slice( 1 );
        denominatorNegative = true;
      }
      if( this.numerator.charAt( 0 ) === 'q' ){ //remove squareRoot tag, if found
        this.numerator = this.numerator.slice( 1 );
        squareRootSignNeeded = true;
      }

      var fontInfo = this.options;

      this.numeratorText = new Text( this.numerator, fontInfo );
      this.denominatorText = new Text( this.denominator, fontInfo );

      if(( numeratorNegative && !denominatorNegative ) || ( !numeratorNegative && denominatorNegative ) ){
        minusSignNeeded = true;
      }

      //Draw minus sign to go in front of fraction, if needed.
      var length = 8;
      var midHeight = 7;
      if( minusSignNeeded ){
          minusSign = new Line( 0, -midHeight, length, -midHeight, { stroke: '#000', lineWidth: 2, lineCap: 'round' } );
      }else{
          minusSign = new Line( 0, 0, 0, 0 );   //just a placeholder is no minus sign
      }

      //Draw horizontal line separating numerator and denominator
      if( squareRootSignNeeded ){
        length = 1.8*this.numeratorText.width;
      }else{
        length = 1.2*this.numeratorText.width;
      }

      //dividing bar
      var bar = new Line( 0, -midHeight, length, -midHeight, { stroke: '#000', lineWidth: 2, lineCap: 'round' } );

      //draw square root symbol
      var sqRtShape = new Shape();
      if( squareRootSignNeeded ){
        var W = 1.2*this.numeratorText.width;
        var h = 0.8*this.numeratorText.height;
        var w = h/4;
        sqRtShape.moveTo( -3*w/2, -h/2 ).lineTo( -w, 0 ).lineTo( 0, -h ).lineTo( W, -h );
      }
      var sqRtPath = new Path( sqRtShape, { stroke: '#000', lineWidth: 1, lineCap: 'round' } );

      //if no denominator argument is passed in, then display the numerator as a non-fraction number
      if ( this.denominator === undefined || this.denominator === '' ) {
        //make current children invisible so numerator is not obscured
        noDenominator = true;
        for ( var i = 0; i < this.children.length; i++ ) {
          this.children[i].visible = false;
        }

        this.fractionNode.children = [ minusSign, sqRtPath, this.numeratorText ];

        if( minusSignNeeded ){
          minusSign.left = 0;
          this.numeratorText.left = minusSign.right + 4;
        }
        if( squareRootSignNeeded && minusSignNeeded ){
          this.numeratorText.left = minusSign.right + 12;
          sqRtPath.centerX = this.numeratorText.centerX - 3;
        }
        if( squareRootSignNeeded && !minusSignNeeded ){
          sqRtPath.left = 0;
          this.numeratorText.centerX = sqRtPath.centerX + 3;
        }

        return; //have to break out
      } //end if

      if( !noDenominator ){
        this.fractionNode.children = [ sqRtPath, minusSign, this.numeratorText, bar, this.denominatorText ];
      }
      bar.left = 0;
      this.numeratorText.centerX = this.denominatorText.centerX = bar.centerX;
      var offset = 2;
      this.numeratorText.bottom = bar.top - offset;
      this.denominatorText.top = bar.bottom + offset;
      offset = 4;
      if( minusSignNeeded ){
        minusSign.left = 0;
        bar.left = minusSign.right + offset;
        this.numeratorText.centerX = this.denominatorText.centerX = bar.centerX;
      }
      if( noDenominator ){
        this.numeratorText.left = minusSign.right + offset;
      }
      if( squareRootSignNeeded ){
        sqRtPath.top = this.numeratorText.top;
        sqRtPath.centerX = this.numeratorText.centerX - 3;
      }
    }// end setFraction()
  });// end return inherit
} );