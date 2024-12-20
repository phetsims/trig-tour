// Copyright 2024, University of Colorado Boulder

/**
 * Implements the screen summary for trig-tour.
 *
 * @author Jesse Greenberg (PhET Interactive Simulations)
 */

import DerivedStringProperty from '../../../../axon/js/DerivedStringProperty.js';
import PatternStringProperty from '../../../../axon/js/PatternStringProperty.js';
import TReadOnlyProperty from '../../../../axon/js/TReadOnlyProperty.js';
import ScreenSummaryContent from '../../../../joist/js/ScreenSummaryContent.js';
import trigTour from '../../trigTour.js';
import TrigTourStrings from '../../TrigTourStrings.js';
import { Quadrant } from '../model/TrigTourModel.js';

export default class TrigTourScreenSummaryContent extends ScreenSummaryContent {
  public constructor( quadrantProperty: TReadOnlyProperty<Quadrant>, fullAngleProperty: TReadOnlyProperty<number> ) {

    // Describes the current quadrant of the point in the unit circle.
    const quadrantDetailsStringProperty = new PatternStringProperty(
      TrigTourStrings.a11y.screenSummary.quadrantInfoDetailsPatternStringProperty, {
        n: quadrantProperty
      }
    );

    // Describes the rotation direction on the unit circle to create the angle theta.
    // Linked to the string Properties themselves to support dynamic locales.
    const thetaDetailsStringProperty = new DerivedStringProperty(
      [
        fullAngleProperty,
        TrigTourStrings.a11y.screenSummary.counterclockwiseAngleDetailsStringProperty,
        TrigTourStrings.a11y.screenSummary.clockwiseAngleDetailsStringProperty
      ],
      ( ( fullAngle, counterClockwiseString, clockwiseString ) => {
        return fullAngle > 0 ? counterClockwiseString : clockwiseString;
      } ) );

    super( [
      TrigTourStrings.a11y.screenSummary.playAreaStringProperty,
      TrigTourStrings.a11y.screenSummary.controlAreaStringProperty,
      quadrantDetailsStringProperty,
      thetaDetailsStringProperty,
      TrigTourStrings.a11y.screenSummary.interactionHintStringProperty
    ] );
  }
}

trigTour.register( 'TrigTourScreenSummaryContent', TrigTourScreenSummaryContent );