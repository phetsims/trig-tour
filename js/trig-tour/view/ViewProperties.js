/**
 * View property set, passed to control panel
 * Created by Michael Dubson (PhET developer) on 6/5/2015.
 */

define( function( require ) {
    'use strict';

    // modules
    var inherit = require( 'PHET_CORE/inherit' );
    var PropertySet = require( 'AXON/PropertySet' );

    /**
     * @constructor
     */
    function ViewProperties() {
        this.viewProperties = this;

        PropertySet.call( this, {
            graph: 'cos',          //{string} which graph is visible, 'cos'|'sin' |'tan'
            angleUnits: 'degrees', //{string} which angle units, 'degrees'|'radians'
            labelsVisible: false,
            gridVisible: false,
            specialAnglesVisible: false
        } );
    }

    return inherit( PropertySet, ViewProperties, {
        reset: function() {
            this.graph = 'cos';
            this.angleUnits = 'degrees';
            this.labelsVisible = false;
            this.gridVisible = false;
            this.specialAnglesVisible = false;
        }
    } );
} );