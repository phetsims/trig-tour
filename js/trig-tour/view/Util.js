/**
 * Layout bounds constant and color constants
 * Created by Michael Dubson (PhET developer) on 6/16/2015.
 */

define( function( require ) {
    'use strict';

    // modules
    var Bounds2 = require( 'DOT/Bounds2' );

    return {
        // layout bounds used throughout the simulation for laying out the screens
        LAYOUT_BOUNDS: new Bounds2( 0, 0, 768, 464 ),
        BACKGROUND_COLOR: '#fff6cc',
        VIEW_BACKGROUND_COLOR: '#FFF',
        TEXT_COLOR: '#000',
        TEXT_COLOR_GRAY: '#AAA',
        LINE_COLOR: '#000',
        PANEL_COLOR: '#f9f9f9',
        SIN_COLOR: '#008700',  //color-blind green
        COS_COLOR: '#00D',     //normal blue
        TAN_COLOR: '#ff5500'   //color-blind red
    };
} );