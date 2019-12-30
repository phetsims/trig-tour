// Copyright 2015-2019, University of Colorado Boulder

/**
 * Vertical or horizontal arrow, consisting of a line and a triangular arrow-head.
 *
 * @author Michael Dubson (PhET developer) on 6/16/2015.
 * @author Jesse Greenberg
 */
define( require => {
  'use strict';

  // modules
  const ArrowNode = require( 'SCENERY_PHET/ArrowNode' );
  const Bounds2 = require( 'DOT/Bounds2' );
  const inherit = require( 'PHET_CORE/inherit' );
  const merge = require( 'PHET_CORE/merge' );
  const trigTour = require( 'TRIG_TOUR/trigTour' );
  const Utils = require( 'DOT/Utils' );

  /**
   * Constructor for TrigIndicatorArrowNode which is an arrow node with a head that dynamically resizes to a fraction
   * of the tail length.
   *
   * @param {number} defaultLength - arrow in view coordinates
   * @param {string} orientation -  one of 'vertical' or 'horizontal'
   * @param {Object} [options] - passed to ArrowNode
   * @constructor
   */
  function TrigIndicatorArrowNode( defaultLength, orientation, options ) {

    let tipX = 0;
    let tipY = 0;
    this.orientation = orientation; // @private, 'horizontal' or 'vertical' orientation

    if ( orientation === 'vertical' ) {
      tipY = defaultLength;
    }
    else {
      tipX = defaultLength;
    }

    ArrowNode.call( this, 0, 0, tipX, tipY, merge( {
      isHeadDynamic: true,
      fractionalHeadHeight: 3 / 5,
      headHeight: 25,
      headWidth: 15,
      lineWidth: 0
    }, options ) );

    const emptyBounds = new Bounds2( 0, 0, 0, 0 );
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
      const sign = displacement === 0 ? 0 : Utils.roundSymmetric( displacement / Math.abs( displacement ) );

      const arrowLength = Math.abs( displacement );
      if ( this.orientation === 'vertical' ) {
        this.setTailAndTip( this.tailX, this.tailY, this.tipX, -sign * arrowLength );
      }
      else if ( this.orientation === 'horizontal' ) {
        this.setTailAndTip( this.tailX, this.tailY, sign * arrowLength, this.tipY );
      }
    }

  } );
} );
