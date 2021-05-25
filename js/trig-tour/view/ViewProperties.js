// Copyright 2015-2021, University of Colorado Boulder

/**
 * View property set, passed to control panel.
 *
 * @author Michael Dubson (PhET developer) on 6/5/2015.
 */

import BooleanProperty from '../../../../axon/js/BooleanProperty.js';
import Property from '../../../../axon/js/Property.js';
import trigTour from '../../trigTour.js';

// constants
const VALID_ANGLE_UNITS = [ 'degrees', 'radians' ];
const VALID_GRAPH = [ 'cos', 'sin', 'tan' ];

class ViewProperties {
  constructor() {

    // @public {Property.<string>} which graph is visible, 'cos'|'sin' |'tan'
    this.graphProperty = new Property( 'cos' );

    // @public{Property.<string>} which angle units, 'degrees'|'radians'
    this.angleUnitsProperty = new Property( 'degrees' );

    // @public {Property.<boolean>}
    this.labelsVisibleProperty = new BooleanProperty( false );

    // @public {Property.<boolean>}
    this.gridVisibleProperty = new BooleanProperty( false );

    // @public {Property.<boolean>}
    this.specialAnglesVisibleProperty = new BooleanProperty( false );

    // validate the graph values
    this.graphProperty.link( graph => {
      assert && assert( _.includes( VALID_GRAPH, graph ), `this graph is invalid:${graph}` );
    } );

    // validate the angle units
    this.angleUnitsProperty.link( angleUnit => {
      assert && assert( _.includes( VALID_ANGLE_UNITS, angleUnit ), `this angleUnit is invalid:${angleUnit}` );
    } );
  }

  /**
   * @public
   */
  reset() {
    this.graphProperty.reset();
    this.angleUnitsProperty.reset();
    this.labelsVisibleProperty.reset();
    this.gridVisibleProperty.reset();
    this.specialAnglesVisibleProperty.reset();
  }
}

trigTour.register( 'ViewProperties', ViewProperties );

export default ViewProperties;