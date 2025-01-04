// Copyright 2024-2025, University of Colorado Boulder

/**
 * Implements the screen summary for trig-tour.
 *
 * @author Jesse Greenberg (PhET Interactive Simulations)
 */

import DerivedStringProperty from '../../../../axon/js/DerivedStringProperty.js';
import PatternStringProperty from '../../../../axon/js/PatternStringProperty.js';
import ScreenSummaryContent from '../../../../joist/js/ScreenSummaryContent.js';
import StringUtils from '../../../../phetcommon/js/util/StringUtils.js';
import trigTour from '../../trigTour.js';
import TrigTourStrings from '../../TrigTourStrings.js';
import TrigTourModel from '../model/TrigTourModel.js';
import ViewProperties from './ViewProperties.js';

export default class TrigTourScreenSummaryContent extends ScreenSummaryContent {
  public constructor( model: TrigTourModel, viewProperties: ViewProperties ) {

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

    const xValuePatternStringProperty = new PatternStringProperty( TrigTourStrings.a11y.screenSummary.details.xValuePatternStringProperty, {
      value: model.cosValueStringProperty
    } );
    const yValuePatternStringProperty = new PatternStringProperty( TrigTourStrings.a11y.screenSummary.details.yValuePatternStringProperty, {
      value: model.sinValueStringProperty
    } );

    const trigFunctionStringProperty = new DerivedStringProperty( [
      viewProperties.graphProperty,
      TrigTourStrings.a11y.screenSummary.details.trigValuePatternStringProperty,
      TrigTourStrings.a11y.screenSummary.details.sinFunctionStringProperty,
      TrigTourStrings.a11y.screenSummary.details.cosFunctionStringProperty,
      TrigTourStrings.a11y.screenSummary.details.tanFunctionStringProperty
    ], ( graph, patternString, sinString, cosString, tanString ) => {
      const functionString = graph === 'sin' ? sinString : graph === 'cos' ? cosString : tanString;
      const valueStringProperty = graph === 'sin' ? model.sinValueStringProperty : graph === 'cos' ? model.cosValueStringProperty : model.tanValueStringProperty;
      return StringUtils.fillIn( patternString, {
        trigFunction: functionString,
        value: valueStringProperty
      } );
    } );

    model.valuesExpandedProperty.link( expanded => {
      const content = expanded ? [
        quadrantDetailsStringProperty,
        thetaDetailsStringProperty,
        TrigTourStrings.a11y.screenSummary.details.forThisAngleStringProperty,
        xValuePatternStringProperty,
        yValuePatternStringProperty,
        trigFunctionStringProperty
      ] : [
        quadrantDetailsStringProperty,
        thetaDetailsStringProperty
      ];

      this.setCurrentDetailsContent( content );
    } );
  }
}

trigTour.register( 'TrigTourScreenSummaryContent', TrigTourScreenSummaryContent );