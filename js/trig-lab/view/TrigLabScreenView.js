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
    var ReadoutDisplay = require( 'TRIG_LAB/trig-lab/view/ReadoutDisplay' );
    var GraphView = require( 'TRIG_LAB/trig-lab/view/GraphView' );
    var ViewProperties = require( 'TRIG_LAB/trig-lab/view/ViewProperties' );

    /**
     * @param {TrigLabModel} trigLabModel
     * @constructor
     */
    function TrigLabScreenView( trigLabModel ) {

        ScreenView.call( this );
        var trigLabScreenView = this;
        this.labelsVisible = false;  //set by Control Panel

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
        var readoutDisplay = new ReadoutDisplay( trigLabModel, viewProperties );
        var graphView = new GraphView( trigLabModel, 0.25*this.layoutBounds.height, 0.9*this.layoutBounds.width );
        var controlPanel = new ControlPanel( viewProperties );
        this.addChild( unitCircleView );
        //this.addChild( readOutView );
        this.addChild( readoutDisplay );
        this.addChild( graphView );
        this.addChild( controlPanel );

        //Layout children Views
        unitCircleView.x = this.layoutBounds.centerX;
        unitCircleView.top = this.layoutBounds.top + 20;
        //readOutView.left = this.layoutBounds.left + 30 ;
        //readOutView.top = 30;
        readoutDisplay.left = this.layoutBounds.left + 30 ;
        readoutDisplay.top = 30;
        graphView.x = this.layoutBounds.centerX;
        graphView.y = this.layoutBounds.bottom - graphView.axesNode.bottom - 15;
        controlPanel.right = this.layoutBounds.right - 30;
        controlPanel.top = this.layoutBounds.top + 30;
        //console.log( 'layoutBounds = '+this.layoutBounds );

        viewProperties.graphProperty.link( function( graph ) {
            unitCircleView.hArrowLine.visible = ( graph === 'cos' || graph === 'tan' );
            unitCircleView.hLine.visible = ( graph === 'sin' );
            unitCircleView.vArrowLine.visible = ( graph === 'sin' || graph === 'tan' );
            unitCircleView.vLine.visible = ( graph === 'cos' );

            graphView.trigFunction = graph;
            graphView.cosPath.visible = ( graph === 'cos' );
            graphView.sinPath.visible = ( graph === 'sin' );
            graphView.tanPath.visible = ( graph === 'tan' );
            graphView.sinThetaLabel.visible = ( graph === 'sin' );
            graphView.cosThetaLabel.visible = ( graph === 'cos' );
            graphView.tanThetaLabel.visible = ( graph === 'tan' );
            graphView.setIndicatorLine();
            readoutDisplay.readoutNode.setTrigRowVisibility( graph );
        } );

        viewProperties.labelsVisibleProperty.link( function( isVisible ){
            trigLabScreenView.labelsVisible = isVisible;
            unitCircleView.setLabelVisibility( isVisible );
            if( isVisible ){
                graphView.tickMarkLabelsInRadians.visible = readoutDisplay.readoutNode.radiansDisplayed;
                graphView.tickMarkLabelsInDegrees.visible = !readoutDisplay.readoutNode.radiansDisplayed;
            }else{
                graphView.tickMarkLabelsInRadians.visible = false;
                graphView.tickMarkLabelsInDegrees.visible = false;
            }
        });

        viewProperties.gridVisibleProperty.link( function( isVisible ){
            unitCircleView.grid.visible = isVisible;
        });

        viewProperties.angleUnitsProperty.link ( function( units ){
            readoutDisplay.readoutNode.radiansDisplayed = ( units === 'radians');
            readoutDisplay.readoutNode.setUnits( units );
            if( trigLabScreenView.labelsVisible ){
                graphView.tickMarkLabelsInRadians.visible = ( units === 'radians');
                graphView.tickMarkLabelsInDegrees.visible = ( units !== 'radians');
            }
            if( units === 'radians' && readoutDisplay.readoutNode.specialAnglesOnly  ) {
                //readoutDisplay.readoutNode.nbrFullTurnsText.visible = true;
                readoutDisplay.readoutNode.nbrFullTurnsNode.visible = true;
                readoutDisplay.readoutNode.angleReadoutFraction.visible = true;
                readoutDisplay.readoutNode.angleReadout.visible = false;
            }else{
                //readoutDisplay.readoutNode.nbrFullTurnsText.visible = false;
                readoutDisplay.readoutNode.nbrFullTurnsNode.visible = false;
                readoutDisplay.readoutNode.angleReadoutFraction.visible = false;
                readoutDisplay.readoutNode.angleReadout.visible = true;
            }
            readoutDisplay.readoutNode.setAngleReadout();
            //readOutView.setUnits( units );
        });//end viewProperties.angleUnitsProperty.link

        viewProperties.specialAnglesVisibleProperty.link( function( specialAnglesVisible ){
            unitCircleView.specialAnglesNode.visible = specialAnglesVisible;
            readoutDisplay.readoutNode.specialAnglesOnly = specialAnglesVisible;
            trigLabModel.specialAnglesMode = specialAnglesVisible;
            //select correct trig readouts
            //readoutDisplay.readoutNode.sinReadoutFraction.visible = specialAnglesVisible;
            //readoutDisplay.readoutNode.cosReadoutFraction.visible = specialAnglesVisible;
            readoutDisplay.readoutNode.coordinatesHBox.visible = specialAnglesVisible;
            readoutDisplay.readoutNode.coordinatesReadout.visible = !specialAnglesVisible;
            readoutDisplay.readoutNode.sinFractionHolder2.visible = specialAnglesVisible;
            readoutDisplay.readoutNode.cosFractionHolder2.visible = specialAnglesVisible;
            readoutDisplay.readoutNode.tanReadoutFraction.visible = specialAnglesVisible;
            readoutDisplay.readoutNode.sinReadoutText.visible = !specialAnglesVisible;
            readoutDisplay.readoutNode.cosReadoutText.visible = !specialAnglesVisible;
            readoutDisplay.readoutNode.tanReadoutText.visible = !specialAnglesVisible;
            //select correct angle readout
            if( specialAnglesVisible && readoutDisplay.readoutNode.radiansDisplayed ){
                //readoutDisplay.readoutNode.nbrFullTurnsText.visible = true;
                readoutDisplay.readoutNode.nbrFullTurnsNode.visible = true;
                readoutDisplay.readoutNode.angleReadoutFraction.visible = true;
                readoutDisplay.readoutNode.angleReadout.visible = false;
            }else{
                //readoutDisplay.readoutNode.nbrFullTurnsText.visible = false;
                readoutDisplay.readoutNode.nbrFullTurnsNode.visible = false;
                readoutDisplay.readoutNode.angleReadoutFraction.visible = false;
                readoutDisplay.readoutNode.angleReadout.visible = true;
            }
            //set precision of angle readout in degrees: special angles mode angle = 45 degrees, otherwise 45.0 degrees
            if( specialAnglesVisible ){
                var currentSmallAngle = trigLabModel.getSmallAngleInRadians();
                trigLabModel.setSpecialAngle( currentSmallAngle );
                readoutDisplay.readoutNode.setAngleReadoutPrecision( 0 );     //integer display of special angles: 0, 30, 45, etc
            }else{
                readoutDisplay.readoutNode.setAngleReadoutPrecision( 1 );     //1 decimal place precision for continuous angles.setAngleReadoutPrecision( 1 );     //1 decimal place precision for continuous angles
            }
            readoutDisplay.readoutNode.setAngleReadout();
            readoutDisplay.readoutNode.setTrigReadout();

        });//viewProperties.specialAnglesVisibleProperty.link

    }

    return inherit( ScreenView, TrigLabScreenView, {} );
} );