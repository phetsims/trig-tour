// Copyright 2002-2015, University of Colorado Boulder

/**
 *
 * @author Michael Dubson (PhET)
 */
define( function ( require ) {
    'use strict';

    // modules
    var ControlPanel = require( 'TRIG_LAB/trig-lab/view/ControlPanel' );
    var inherit = require( 'PHET_CORE/inherit' );
    var ScreenView = require( 'JOIST/ScreenView' );
    var ResetAllButton = require( 'SCENERY_PHET/buttons/ResetAllButton' );
    var UnitCircleView = require( 'TRIG_LAB/trig-lab/view/UnitCircleView' );
    var ReadOutView = require( 'TRIG_LAB/trig-lab/view/ReadOutView' );
    var GraphView = require( 'TRIG_LAB/trig-lab/view/GraphView' );
    var Vector2 = require( 'DOT/Vector2' );
    var ViewProperties = require( 'TRIG_LAB/trig-lab/view/ViewProperties' );

    /**
     * @param {TrigLabModel} trigLabModel
     * @constructor
     */
    function TrigLabScreenView( trigLabModel ) {

        ScreenView.call( this );

        // Create and add the Reset All Button in the bottom right, which resets the model
        var resetAllButton = new ResetAllButton( {
            listener: function () {
                trigLabModel.reset();
            },
            right: this.layoutBounds.maxX - 10,
            bottom: this.layoutBounds.maxY - 10
        } );
        this.addChild( resetAllButton )
        var unitCircleView = new UnitCircleView( trigLabModel );
        var readOutView = new ReadOutView( trigLabModel );
        var graphView = new GraphView( trigLabModel );
        var viewProperties = new ViewProperties();
        //console.log('viewProperties.graph is '+viewProperties.graph);
        var controlPanel = new ControlPanel( viewProperties );
        this.addChild( unitCircleView );
        this.addChild( readOutView );
        this.addChild( graphView );
        this.addChild( controlPanel );

        //Layout children Views
        var widthView = unitCircleView.width;
        //unitCircleView.translation = new Vector2( this.layoutBounds.centerX, 1.1*widthView/2 );
        //readOutView.translation = new Vector2( 1.2*widthView, 30 );
        unitCircleView.left = readOutView.right;
        unitCircleView.top = this.layoutBounds.top + 20
        readOutView.left = this.layoutBounds.left + 20 ;
        readOutView.top = 30;
        graphView.x = this.layoutBounds.centerX - 20;
        graphView.bottom = this.layoutBounds.bottom;
        controlPanel.right = this.layoutBounds.right - 40;
        controlPanel.top = this.layoutBounds.top + 40;
        console.log( 'layoutBounds = '+this.layoutBounds );
        //Test Code follows
        trigLabModel.setAngleInDegrees( 0 );
        //console.log( 'trigLabModel.angle is ' + trigLabModel.angle );
        //console.log( 'angle in degrees is ' + trigLabModel.getAngleInDegrees() );
        //console.log( ' cos of ' + trigLabModel.getAngleInDegrees() + ' is ' + trigLabModel.cos() );
        console.log('this.layoutBounds = '+this.layoutBounds );

        viewProperties.graphProperty.link( function( graph ) {
            graphView.cosPath.visible = ( graph === 'cos' );
            graphView.sinPath.visible = ( graph === 'sin' );
            graphView.tanPath.visible = ( graph === 'tan' );
            readOutView.sinLabel.visible = ( graph === 'sin' );
            readOutView.cosLabel.visible = ( graph === 'cos' );
            readOutView.tanLabel.visible = ( graph === 'tan' );
            graphView.sinThetaLabel.visible = ( graph === 'sin' );
            graphView.cosThetaLabel.visible = ( graph === 'cos' );
            graphView.tanThetaLabel.visible = ( graph === 'tan' );
        } );

        viewProperties.gridVisibleProperty.link( function( isVisible ){
            unitCircleView.grid.visible = isVisible;
        });

    }

    return inherit( ScreenView, TrigLabScreenView, {} );
} );