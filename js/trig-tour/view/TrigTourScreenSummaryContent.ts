// Copyright 2024-2025, University of Colorado Boulder

/**
 * Implements the screen summary for trig-tour.
 *
 * @author Jesse Greenberg (PhET Interactive Simulations)
 */

import DerivedProperty from '../../../../axon/js/DerivedProperty.js';
import DerivedStringProperty from '../../../../axon/js/DerivedStringProperty.js';
import PatternStringProperty from '../../../../axon/js/PatternStringProperty.js';
import { toFixedNumber } from '../../../../dot/js/util/toFixedNumber.js';
import ScreenSummaryContent from '../../../../joist/js/ScreenSummaryContent.js';
import trigTour from '../../trigTour.js';
import TrigTourStrings from '../../TrigTourStrings.js';
import TrigTourModel from '../model/TrigTourModel.js';
import TrigTourDescriber from './TrigTourDescriber.js';
import ViewProperties from './ViewProperties.js';

export default class TrigTourScreenSummaryContent extends ScreenSummaryContent {
  public constructor( model: TrigTourModel, viewProperties: ViewProperties, trigTourDescriber: TrigTourDescriber ) {

    const trigInfoStringProperty = new DerivedProperty(
      [
        viewProperties.graphProperty,
        TrigTourStrings.a11y.screenSummary.details.cosSelectedStringProperty,
        TrigTourStrings.a11y.screenSummary.details.sinSelectedStringProperty,
        TrigTourStrings.a11y.screenSummary.details.tanSelectedStringProperty
      ], ( graph, cosString, sinString, tanString ) => {
        return graph === 'cos' ? cosString : graph === 'sin' ? sinString : tanString;
      }
    );

    // Describes the point quadrant in the unit circle.
    const quadrantInfoStringProperty = new PatternStringProperty(
      TrigTourStrings.a11y.screenSummary.details.quadrantInfoPatternStringProperty, {
        n: model.quadrantProperty
      }
    );

    // Describes when the point is exactly on an axis. The value is null when the point is not on an axis.
    const axisStringProperty = DerivedProperty.fromRecord( model.axisProperty, {
      x: TrigTourStrings.a11y.screenSummary.details.pointOnXAxisStringProperty,
      y: TrigTourStrings.a11y.screenSummary.details.pointOnYAxisStringProperty,
      off: null
    } );

    // Information about the point - If the point is on an axis, that string will be used. Otherwise,
    // the quadrant string will be used.
    const pointInfoStringProperty = new DerivedStringProperty(
      [ quadrantInfoStringProperty, axisStringProperty ],
      ( quadrantString, axisString ) => {
        return axisString ? axisString : quadrantString;
      }
    );

    // Describes the rotation direction on the unit circle to create the angle theta.
    // Linked to the string Properties themselves to support dynamic locales.
    const rotationDirectionStringProperty = new DerivedStringProperty(
      [
        model.fullAngleProperty,
        TrigTourStrings.a11y.screenSummary.details.counterClockwiseAngleStringProperty,
        TrigTourStrings.a11y.screenSummary.details.clockwiseAngleStringProperty
      ],
      ( fullAngle, counterClockwiseString, clockwiseString ) => {

        // Control precision so that negative numbers very close to 0 are treated as 0.
        return toFixedNumber( fullAngle, 2 ) >= 0 ? counterClockwiseString : clockwiseString;
      }
    );

    super( {
      playAreaContent: TrigTourStrings.a11y.screenSummary.playAreaStringProperty,
      controlAreaContent: TrigTourStrings.a11y.screenSummary.controlAreaStringProperty,
      currentDetailsContent: [
        trigInfoStringProperty,
        pointInfoStringProperty,
        rotationDirectionStringProperty
      ],
      interactionHintContent: TrigTourStrings.a11y.screenSummary.interactionHintStringProperty
    } );
  }
}

trigTour.register( 'TrigTourScreenSummaryContent', TrigTourScreenSummaryContent );