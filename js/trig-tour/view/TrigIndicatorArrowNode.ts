// Copyright 2015-2020, University of Colorado Boulder

/**
 * Vertical or horizontal arrow, consisting of a line and a triangular arrow-head. The head dynamically resizes to a
 * fraction of the tail length.
 *
 * @author Michael Dubson (PhET developer) on 6/16/2015.
 * @author Jesse Greenberg
 */

import Bounds2 from '../../../../dot/js/Bounds2.js';
import Utils from '../../../../dot/js/Utils.js';
import merge from '../../../../phet-core/js/merge.js';
import ArrowNode from '../../../../scenery-phet/js/ArrowNode.js';
import trigTour from '../../trigTour.js';

class TrigIndicatorArrowNode extends ArrowNode {

  /**
   * Constructor for TrigIndicatorArrowNode which is an arrow node with a
   *
   * @param {number} defaultLength - arrow in view coordinates
   * @param {string} orientation -  one of 'vertical' or 'horizontal'
   * @param {Object} [options] - passed to ArrowNode
   */
  constructor( defaultLength, orientation, options ) {

    let tipX = 0;
    let tipY = 0;

    if ( orientation === 'vertical' ) {
      tipY = defaultLength;
    }
    else {
      tipX = defaultLength;
    }

    super( 0, 0, tipX, tipY, merge( {
      isHeadDynamic: true,
      fractionalHeadHeight: 3 / 5,
      headHeight: 25,
      headWidth: 15,
      lineWidth: 0
    }, options ) );

    this.orientation = orientation; // @private, 'horizontal' or 'vertical' orientation

    const emptyBounds = new Bounds2( 0, 0, 0, 0 );
    this.computeShapeBounds = () => emptyBounds;
  }

  /**
   * Sets the color of this arrow, with no stroke this is just the fill.
   * @public
   * @param {string | Color} color
   */
  setColor( color ) {
    this.fill = color;
    this.stroke = color;
  }

  /**
   * Sets the endpoint for the arrow.  Dependent on sign and magnitude of end point displacement.
   * @param displacement
   * @public
   */
  setEndPoint( displacement ) {

    // determine the sign of displacement if displacement is non zero
    // sign is positive if arrow is pointing up or right, negative if pointing down or left
    const sign = displacement === 0 ? 0 : Utils.roundSymmetric( displacement / Math.abs( displacement ) );

    const arrowLength = Math.abs( displacement );
    if ( this.orientation === 'vertical' ) {
      this.setTailAndTip( this.tailX, this.tailY, this.tipX, -sign * arrowLength );
    }
    else {
      this.setTailAndTip( this.tailX, this.tailY, sign * arrowLength, this.tipY );
    }
  }
}

trigTour.register( 'TrigIndicatorArrowNode', TrigIndicatorArrowNode );
export default TrigIndicatorArrowNode;