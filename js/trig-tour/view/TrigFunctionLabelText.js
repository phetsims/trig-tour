// Copyright 2015, University of Colorado Boulder

/**
 * A convenience type that builds up a trig function as a label.  Normal text cannot be used because the desired look
 * of the label is a trig function and a theta symbol, where the theta symbol has a unique font style.  HTMLText
 * cannot be used for this because it is performance intensive for stings that are meant ot be dynamic.  The trig 
 * function label should look something like 'cos θ' .
 *
 * @author Jesse Greenberg
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var PhetFont = require( 'SCENERY_PHET/PhetFont' );
  var Text = require( 'SCENERY/nodes/Text' );
  var HBox = require( 'SCENERY/nodes/HBox' );

  // constants
  var DISPLAY_FONT = new PhetFont( {size: 20 } );
  var DISPLAY_FONT_ITALIC = new PhetFont( { size: 20, style: 'italic' } );

  // strings
  var thetaString = require( 'string!TRIG_TOUR/theta' );

  /**
   * Constructor.
   *
   * @param {string} trigFunction, label for the trig function
   * @constructor
   */
  function TrigFunctionLabelText( trigFunctionString, options ) {

    options = _.extend( {
      trigFunctionLabelFont: DISPLAY_FONT,
      thetaLabelFont: DISPLAY_FONT_ITALIC
    }, options );

    // build the text for the trig function label
    var trigTitleText = new Text( trigFunctionString, options.trigFunctionLabelFont );

    // create the text for the mathematical symbol theta
    var trigThetaText = new Text( thetaString, options.thetaLabelFont );

    // build the text, placing both function and theta labels in an HBox
    HBox.call( this, { children: [ trigTitleText, trigThetaText ], spacing: 0, resize: false } );

  }

  return inherit( HBox, TrigFunctionLabelText );

} );