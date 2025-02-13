// Copyright 2024-2025, University of Colorado Boulder

/**
 * Implements the screen summary for trig-tour.
 *
 * @author Jesse Greenberg (PhET Interactive Simulations)
 */

import DerivedProperty from '../../../../axon/js/DerivedProperty.js';
import DerivedStringProperty from '../../../../axon/js/DerivedStringProperty.js';
import PatternStringProperty from '../../../../axon/js/PatternStringProperty.js';
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
        TrigTourStrings.a11y.translatable.screenSummary.details.cosSelectedStringProperty,
        TrigTourStrings.a11y.translatable.screenSummary.details.sinSelectedStringProperty,
        TrigTourStrings.a11y.translatable.screenSummary.details.tanSelectedStringProperty
      ], ( graph, cosString, sinString, tanString ) => {
        return graph === 'cos' ? cosString : graph === 'sin' ? sinString : tanString;
      }
    );

    // Describes the current quadrant of the point in the unit circle.
    const quadrantInfoStringProperty = new PatternStringProperty(
      TrigTourStrings.a11y.translatable.screenSummary.details.quadrantInfoPatternStringProperty, {
        n: model.quadrantProperty
      }
    );

    // Describes the rotation direction on the unit circle to create the angle theta.
    // Linked to the string Properties themselves to support dynamic locales.
    const rotationDirectionStringProperty = new DerivedStringProperty(
      [
        model.fullAngleProperty,
        TrigTourStrings.a11y.translatable.screenSummary.details.counterClockwiseAngleStringProperty,
        TrigTourStrings.a11y.translatable.screenSummary.details.clockwiseAngleStringProperty
      ],
      ( fullAngle, counterClockwiseString, clockwiseString ) => {
        return fullAngle > 0 ? counterClockwiseString : clockwiseString;
      }
    );

    super( {
      playAreaContent: TrigTourStrings.a11y.translatable.screenSummary.playAreaStringProperty,
      controlAreaContent: TrigTourStrings.a11y.translatable.screenSummary.controlAreaStringProperty,
      currentDetailsContent: [
        trigInfoStringProperty,
        quadrantInfoStringProperty,
        rotationDirectionStringProperty
      ],
      interactionHintContent: TrigTourStrings.a11y.translatable.screenSummary.interactionHintStringProperty
    } );
  }
}

trigTour.register( 'TrigTourScreenSummaryContent', TrigTourScreenSummaryContent );