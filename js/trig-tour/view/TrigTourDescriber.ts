// Copyright 2025, University of Colorado Boulder

/**
 * Implements descriptions about Trig Tour for screen readers and Voicing.
 *
 * @author Jesse Greenberg (PhET Interactive Simulations)
 */

import DerivedStringProperty from '../../../../axon/js/DerivedStringProperty.js';
import PatternStringProperty from '../../../../axon/js/PatternStringProperty.js';
import { TReadOnlyProperty } from '../../../../axon/js/TReadOnlyProperty.js';
import trigTour from '../../trigTour.js';
import TrigTourStrings from '../../TrigTourStrings.js';
import TrigTourModel from '../model/TrigTourModel.js';
import AngleReadoutValue from './readout/AngleReadoutValue.js';
import ViewProperties from './ViewProperties.js';

export default class TrigTourDescriber {

  public readonly valuesDescriptionStringProperty: TReadOnlyProperty<string>;

  public constructor( model: TrigTourModel, viewProperties: ViewProperties ) {

    // Produces a value of the angle readout, with units, precision, and value.
    const angleReadout = new AngleReadoutValue( model, viewProperties );

    // The trig function string that is currently being displayed. "sine", "cosine", or "tangent".
    const trigFunctionStringProperty = new DerivedStringProperty( [
      viewProperties.graphProperty,
      TrigTourStrings.a11y.math.sinFunctionStringProperty,
      TrigTourStrings.a11y.math.cosFunctionStringProperty,
      TrigTourStrings.a11y.math.tanFunctionStringProperty
    ], ( graph, sinString, cosString, tanString ) => {
      return graph === 'sin' ? sinString :
             graph === 'cos' ? cosString :
             tanString;
    } );

    // The evaluated value of the selected trig function for the current angle.
    const trigValueStringProperty = new DerivedStringProperty( [
      viewProperties.graphProperty,
      model.sinValueStringProperty,
      model.cosValueStringProperty,
      model.tanValueStringProperty
    ], ( graph, sinValue, cosValue, tanValue ) => {
      return graph === 'sin' ? sinValue :
             graph === 'cos' ? cosValue :
             tanValue;
    } );

    // An overall description of the important values of the simulation. Something like:
    // "The angle is {{angle}}. For this angle, x equals {{xValue}}; y equals {{yValue}}; {{trigFunction}} equals {{trigValue}}."
    this.valuesDescriptionStringProperty = new PatternStringProperty(
      TrigTourStrings.a11y.screenSummary.details.valuesDescriptionPatternStringProperty, {
        angle: angleReadout.naturalLanguageAngleReadoutWithUnitsStringProperty,
        xValue: model.cosValueStringProperty,
        yValue: model.sinValueStringProperty,
        trigFunction: trigFunctionStringProperty,
        trigValue: trigValueStringProperty
      } );
  }
}

trigTour.register( 'TrigTourDescriber', TrigTourDescriber );