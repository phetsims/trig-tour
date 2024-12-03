// Copyright 2015-2024, University of Colorado Boulder

/**
 * View property set, passed to control panel.
 *
 * @author Michael Dubson (PhET developer) on 6/5/2015.
 */

import BooleanProperty from '../../../../axon/js/BooleanProperty.js';
import Property from '../../../../axon/js/Property.js';
import trigTour from '../../trigTour.js';

export type Graph = 'cos' | 'sin' | 'tan';
type AngleUnits = 'degrees' | 'radians';

class ViewProperties {

  // which graph is visible
  public readonly graphProperty: Property<Graph>;

  // which angle units are being used
  public readonly angleUnitsProperty: Property<AngleUnits>;

  public readonly labelsVisibleProperty: BooleanProperty;
  public readonly gridVisibleProperty: BooleanProperty;
  public readonly specialAnglesVisibleProperty: BooleanProperty;

  public constructor() {
    this.graphProperty = new Property<Graph>( 'cos' );
    this.angleUnitsProperty = new Property<AngleUnits>( 'degrees' );

    this.labelsVisibleProperty = new BooleanProperty( false );
    this.gridVisibleProperty = new BooleanProperty( false );
    this.specialAnglesVisibleProperty = new BooleanProperty( false );
  }

  public reset(): void {
    this.graphProperty.reset();
    this.angleUnitsProperty.reset();
    this.labelsVisibleProperty.reset();
    this.gridVisibleProperty.reset();
    this.specialAnglesVisibleProperty.reset();
  }
}

trigTour.register( 'ViewProperties', ViewProperties );

export default ViewProperties;