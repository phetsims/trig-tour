// Copyright 2015, University of Colorado Boulder

/**
 * Vertical or horizontal arrow, consisting of a line and a triangular arrow-head.
 *
 * @author Michael Dubson (PhET developer) on 6/16/2015.
 * @author Jesse Greenberg
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var Util = require( 'DOT/Util' );
  var ArrowNode = require( 'SCENERY_PHET/ArrowNode' );
  var Bounds2 = require( 'DOT/Bounds2' );
  var trigTour = require( 'TRIG_TOUR/trigTour' );

  /**
   * Constructor for TrigIndicatorArrowNode which is an arrow node with a head that dynamically resizes to a fraction
   * of the tail length.
   *
   * @param {number} defaultLength of arrow in pixels
   * @param {string} orientation =  one of 'vertical' or 'horizontal'
   * @param {Object} options passed to ArrowNode
   * @constructor
   */
  function TrigIndicatorArrowNode( defaultLength, orientation, options ) {

    var tipX = 0;
    var tipY = 0;
    this.orientation = orientation; // @private, 'horizontal' or 'vertical' orientation

    if ( orientation === 'vertical' ) {
      tipY = defaultLength;
    }
    else {
      tipX = defaultLength;
    }

    ArrowNode.call( this, 0, 0, tipX, tipY, _.extend( {
      isHeadDynamic: true,
      fractionalHeadHeight: 3 / 5,
      headHeight: 25,
      headWidth: 15,
      lineWidth: 0
    }, options ) );

    var emptyBounds = new Bounds2( 0, 0, 0, 0 );
    this.computeShapeBounds = function() {
      return emptyBounds;
    };
  }

  trigTour.register( 'TrigIndicatorArrowNode', TrigIndicatorArrowNode );

  return inherit( ArrowNode, TrigIndicatorArrowNode, {

    /**
     * @public Set the color of this arrow, with no stroke this is just the fill.
     * @param {string | Color} color
     */
    setColor: function( color ) {
      this.fill = color;
      this.stroke = color;
    },

    /**
     * Set the endpoint for the arrow.  Dependent on sign and magnitude of end point displacement.
     * @param displacement
     */
    setEndPoint: function( displacement ) {
      // determine the sign of displacement if displacement is non zero
      // sign is positive if arrow is pointing up or right, negative if pointing down or left
      var sign = displacement === 0 ? 0 : Util.roundSymmetric( displacement / Math.abs( displacement ) );

      var arrowLength = Math.abs( displacement );
      if ( this.orientation === 'vertical' ) {
        this.setTailAndTip( this.tailX, this.tailY, this.tipX, -sign * arrowLength );
      }
      else if ( this.orientation === 'horizontal' ) {
        this.setTailAndTip( this.tailX, this.tailY, sign * arrowLength, this.tipY );
      }
    }

  } );
} );
