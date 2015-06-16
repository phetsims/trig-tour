/**
 * View property set, passed to control panel
 * Created by Dubson on 6/5/2015.
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
        PropertySet.call( this, {
            graph: 'cos', // {string} which graph is visible, 'cos'|'sin' |'tan'
            angleUnits: 'degrees', //{string} which angle units, 'degrees'|'radians'
            labelsVisible: false,
            gridVisible: false,
            specialAnglesVisible: false
        } );
    }

    return inherit( PropertySet, ViewProperties );
} );