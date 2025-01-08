// Copyright 2015-2025, University of Colorado Boulder

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
import Orientation from '../../../../phet-core/js/Orientation.js';
import ArrowNode, { ArrowNodeOptions } from '../../../../scenery-phet/js/ArrowNode.js';
import { TPaint, Voicing } from '../../../../scenery/js/imports.js';
import trigTour from '../../trigTour.js';

class TrigIndicatorArrowNode extends ArrowNode {

  // Is this arrow vertical or horizontal?
  private readonly orientation: Orientation;

  /**
   * @param defaultLength - arrow length in view coordinates
   * @param orientation
   * @param [providedOptions] - passed to ArrowNode
   */
  public constructor( defaultLength: number, orientation: Orientation, providedOptions: ArrowNodeOptions ) {

    let tipX = 0;
    let tipY = 0;

    if ( orientation === Orientation.VERTICAL ) {
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
    }, providedOptions ) );

    this.orientation = orientation;

    // override for performance
    const emptyBounds = new Bounds2( 0, 0, 0, 0 );
    this.computeShapeBounds = () => emptyBounds;
  }

  /**
   * Sets the color of this arrow, with no stroke this is just the fill.
   */
  public setColor( color: TPaint ): void {
    this.fill = color;
    this.stroke = color;
  }

  /**
   * Sets the endpoint for the arrow.  Dependent on sign and magnitude of end point displacement.
   */
  public setEndPoint( displacement: number ): void {

    // determine the sign of displacement if displacement is non zero
    // sign is positive if arrow is pointing up or right, negative if pointing down or left
    const sign = displacement === 0 ? 0 : Utils.roundSymmetric( displacement / Math.abs( displacement ) );

    const arrowLength = Math.abs( displacement );
    if ( this.orientation === Orientation.VERTICAL ) {
      this.setTailAndTip( this.tailX, this.tailY, this.tipX, -sign * arrowLength );
    }
    else {
      this.setTailAndTip( this.tailX, this.tailY, sign * arrowLength, this.tipY );
    }
  }
}

/**
 * A TrigIndicatorArrowNode that is composed with Voicing to support speech with the Voicing feature.
 */
class VoicingTrigIndicatorArrowNode extends Voicing( TrigIndicatorArrowNode ) {
  public constructor( defaultLength: number, orientation: Orientation, providedOptions: ArrowNodeOptions ) {
    super( defaultLength, orientation, providedOptions );
  }
}

trigTour.register( 'TrigIndicatorArrowNode', TrigIndicatorArrowNode );
export default TrigIndicatorArrowNode;
export { VoicingTrigIndicatorArrowNode };