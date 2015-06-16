/**
 * Color constants
 * Created by Dubson on 6/16/2015.
 */

define( function( require ) {
    'use strict';

    // modules
    var Bounds2 = require( 'DOT/Bounds2' );

    return {
        // layout bounds used throughout the simulation for laying out the screens
        LAYOUT_BOUNDS: new Bounds2( 0, 0, 768, 464 ),
        BACKGROUND_COLOR: '#fff',
        TEXT_COLOR: '#000',
        LINE_COLOR: '#000',
        PANEL_COLOR:'#000'
    };
} );