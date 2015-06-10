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
        this.addChild( resetAllButton );

        var viewProperties = new ViewProperties();
        var unitCircleView = new UnitCircleView( trigLabModel );
        var readOutView = new ReadOutView( trigLabModel, viewProperties );
        var graphView = new GraphView( trigLabModel, 0.25*this.layoutBounds.height, 0.8*this.layoutBounds.width );
        var controlPanel = new ControlPanel( viewProperties );
        this.addChild( unitCircleView );
        this.addChild( readOutView );
        this.addChild( graphView );
        this.addChild( controlPanel );

        //Layout children Views
        unitCircleView.x = this.layoutBounds.centerX;
        unitCircleView.top = this.layoutBounds.top + 20;
        readOutView.left = this.layoutBounds.left + 30 ;
        readOutView.top = 30;
        graphView.x = this.layoutBounds.centerX;
        graphView.y = this.layoutBounds.bottom - graphView.axesNode.bottom - 15;
        controlPanel.right = this.layoutBounds.right - 30;
        controlPanel.top = this.layoutBounds.top + 30;
        console.log( 'layoutBounds = '+this.layoutBounds );

        //Test Code follows
        //trigLabModel.setAngleInDegrees( 0 );
        //console.log( 'trigLabModel.angle is ' + trigLabModel.angle );
        //console.log( 'angle in degrees is ' + trigLabModel.getAngleInDegrees() );
        //console.log( ' cos of ' + trigLabModel.getAngleInDegrees() + ' is ' + trigLabModel.cos() );
        //console.log('this.layoutBounds = '+this.layoutBounds );

        viewProperties.graphProperty.link( function( graph ) {
            graphView.trigFunction = graph;
            graphView.cosPath.visible = ( graph === 'cos' );
            graphView.sinPath.visible = ( graph === 'sin' );
            graphView.tanPath.visible = ( graph === 'tan' );
            graphView.sinThetaLabel.visible = ( graph === 'sin' );
            graphView.cosThetaLabel.visible = ( graph === 'cos' );
            graphView.tanThetaLabel.visible = ( graph === 'tan' );
            graphView.setIndicatorLine();
            //readOutView.sinLabel.visible = ( graph === 'sin' );
            //readOutView.cosLabel.visible = ( graph === 'cos' );
            //readOutView.tanLabel.visible = ( graph === 'tan' );
            readOutView.setTrigLabel( graph );
        } );

        viewProperties.labelsVisibleProperty.link( function( isVisible ){
            unitCircleView.labelsVisible = isVisible;
            unitCircleView.setLabelVisibility();
            //unitCircleView.positionLabels( isVisible );
        });

        viewProperties.gridVisibleProperty.link( function( isVisible ){
            unitCircleView.grid.visible = isVisible;
        });

        viewProperties.angleUnitsProperty.link ( function( units ){
            readOutView.radiansDisplayed = ( units === 'radians');
            readOutView.setUnits( units );
            //readOutView.setUnits( units );
        });

        viewProperties.specialAnglesVisibleProperty.link( function( tOrF ){
            unitCircleView.specialAnglesNode.visible = tOrF;
            trigLabModel.specialAnglesMode = tOrF;
            if( tOrF ){
                var currentSmallAngle = trigLabModel.getSmallAngleInRadians();
                trigLabModel.setSpecialAngle( currentSmallAngle );
                readOutView.setAngleReadoutPrecision( 0 );     //integer display of special angles: 0, 30, 45, etc
            }else{
                readOutView.setAngleReadoutPrecision( 1 );     //1 decimal place precision for continuous angles
            }
        });

    }

    return inherit( ScreenView, TrigLabScreenView, {} );
} );