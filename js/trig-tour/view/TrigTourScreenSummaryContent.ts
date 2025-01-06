// Copyright 2024-2025, University of Colorado Boulder

/**
 * Implements the screen summary for trig-tour.
 *
 * @author Jesse Greenberg (PhET Interactive Simulations)
 */

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

    // Describes the current quadrant of the point in the unit circle.
    const quadrantDetailsStringProperty = new PatternStringProperty(
      TrigTourStrings.a11y.screenSummary.details.quadrantInfoPatternStringProperty, {
        n: model.quadrantProperty
      }
    );

    // Describes the rotation direction on the unit circle to create the angle theta.
    // Linked to the string Properties themselves to support dynamic locales.
    const thetaDetailsStringProperty = new DerivedStringProperty(
      [
        model.fullAngleProperty,
        TrigTourStrings.a11y.screenSummary.details.counterClockwiseAngleStringProperty,
        TrigTourStrings.a11y.screenSummary.details.clockwiseAngleStringProperty
      ],
      ( fullAngle, counterClockwiseString, clockwiseString ) => {
        return fullAngle > 0 ? counterClockwiseString : clockwiseString;
      }
    );

    super( {
      playAreaContent: TrigTourStrings.a11y.screenSummary.playAreaStringProperty,
      controlAreaContent: TrigTourStrings.a11y.screenSummary.controlAreaStringProperty,
      interactionHintContent: TrigTourStrings.a11y.screenSummary.interactionHintStringProperty
    } );

    // When collapsed, the details summary does not include any of the inforamtion about values.
    model.valuesExpandedProperty.link( expanded => {
      const content = expanded ? [
        quadrantDetailsStringProperty,
        thetaDetailsStringProperty,
        trigTourDescriber.valuesDescriptionStringProperty
      ] : [
        quadrantDetailsStringProperty,
        thetaDetailsStringProperty
      ];

      this.setCurrentDetailsContent( content );
    } );
  }
}

trigTour.register( 'TrigTourScreenSummaryContent', TrigTourScreenSummaryContent );