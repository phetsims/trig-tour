// Copyright 2015-2017, University of Colorado Boulder

/**
 * View property set, passed to control panel.
 *
 * @author Michael Dubson (PhET developer) on 6/5/2015.
 */

define( require => {
  'use strict';

  // modules
  const BooleanProperty = require( 'AXON/BooleanProperty' );
  const inherit = require( 'PHET_CORE/inherit' );
  const Property = require( 'AXON/Property' );
  const trigTour = require( 'TRIG_TOUR/trigTour' );

  // constants
  var VALID_ANGLE_UNITS = [ 'degrees', 'radians' ];
  var VALID_GRAPH = [ 'cos', 'sin', 'tan' ];

  /**
   * Constructor for trig-tour ViewProperties.
   *
   * @constructor
   */
  function ViewProperties() {

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
    this.graphProperty.link( function( graph ) {
      assert && assert( _.includes( VALID_GRAPH, graph ), 'this graph is invalid:' + graph );
    } );

    // validate the angle units
    this.angleUnitsProperty.link( function( angleUnit ) {
      assert && assert( _.includes( VALID_ANGLE_UNITS, angleUnit ), 'this angleUnit is invalid:' + angleUnit );
    } );
  }

  trigTour.register( 'ViewProperties', ViewProperties );

  return inherit( Object, ViewProperties, {
    reset: function() {
      this.graphProperty.reset();
      this.angleUnitsProperty.reset();
      this.labelsVisibleProperty.reset();
      this.gridVisibleProperty.reset();
      this.specialAnglesVisibleProperty.reset();

    }
  } )
    ;
} );