// Copyright 2002-2015, University of Colorado Boulder

/**
 * Master layout of view on stage
 * @author Michael Dubson (PhET)
 */
define( function ( require ) {
    'use strict';

    // modules
    var ControlPanel = require( 'TRIG_LAB/trig-lab/view/ControlPanel' );
    var GraphView = require( 'TRIG_LAB/trig-lab/view/GraphView' );
    var inherit = require( 'PHET_CORE/inherit' );
    var ReadoutDisplay = require( 'TRIG_LAB/trig-lab/view/ReadoutDisplay' );
    var Rectangle = require( 'SCENERY/nodes/Rectangle' );
    var ResetAllButton = require( 'SCENERY_PHET/buttons/ResetAllButton' );
    var ScreenView = require( 'JOIST/ScreenView' );
    var UnitCircleView = require( 'TRIG_LAB/trig-lab/view/UnitCircleView' );
    var ViewProperties = require( 'TRIG_LAB/trig-lab/view/ViewProperties' );

    /**
     * @param {TrigLabModel} trigLabModel, model for sim
     * @constructor
     */
    function TrigLabScreenView( trigLabModel ) {

        ScreenView.call( this );
        var trigLabScreenView = this;
        this.labelsVisible = false;  //set by Control Panel

        var viewProperties = new ViewProperties();
        var unitCircleView = new UnitCircleView( trigLabModel );
        var readoutDisplay = new ReadoutDisplay( trigLabModel, viewProperties );
        var graphView = new GraphView( trigLabModel, 0.25*this.layoutBounds.height, 0.92*this.layoutBounds.width );
        var controlPanel = new ControlPanel( viewProperties );

        //white sheet placed under unitCircleView to prevent background color bleeding through transparent cover of unitCircle View
        //want graphView under unitCircleView so tangent curve appears to be underneath unitCircle
        var width = 2.4*160;
        var height = 2.4*160;
        var arcRadius = 8;
        var whiteSheet = new Rectangle( -width/2, -height/2, width, height, arcRadius, arcRadius, { fill: 'white' });
        this.addChild( whiteSheet );
        this.addChild( graphView );
        this.addChild( unitCircleView );
        this.addChild( readoutDisplay );
        this.addChild( controlPanel );

        //Layout children Views
        unitCircleView.x = this.layoutBounds.centerX;
        unitCircleView.top = this.layoutBounds.top + 20;
        whiteSheet.x = unitCircleView.x;
        whiteSheet.y = unitCircleView.y;
        readoutDisplay.left = this.layoutBounds.left + 30 ;
        readoutDisplay.top = 30;
        graphView.x = this.layoutBounds.centerX;
        graphView.y = this.layoutBounds.bottom - graphView.axesNode.bottom - 15;
        controlPanel.right = this.layoutBounds.right - 60;
        controlPanel.top = this.layoutBounds.top + 30;
        //console.log( 'layoutBounds = '+this.layoutBounds );


        //Set up callbacks
        viewProperties.graphProperty.link( function( graph ) {
            //console.log('graphProperty called. graph = ' + graph);
            //set visibility of horizontal and vertical arrows on x-y-R triangle on unit circle
            unitCircleView.hArrowLine.visible = ( graph === 'cos' || graph === 'tan' );
            unitCircleView.hLine.visible = ( graph === 'sin' );
            unitCircleView.vArrowLine.visible = ( graph === 'sin' || graph === 'tan' );
            unitCircleView.vLine.visible = ( graph === 'cos' );
            //set visibility of curves on graph view
            graphView.trigFunction = graph;
            graphView.cosPath.visible = ( graph === 'cos' );
            graphView.sinPath.visible = ( graph === 'sin' );
            graphView.tanPath.visible = ( graph === 'tan' );
            graphView.sinThetaLabel.visible = ( graph === 'sin' );
            graphView.cosThetaLabel.visible = ( graph === 'cos' );
            graphView.tanThetaLabel.visible = ( graph === 'tan' );
            //set title bar on graph view
            graphView.setTitleBar( graph );
            if( trigLabModel.singularity ){
                if( graph === 'cos' || graph === 'sin'){
                    graphView.indicatorLine.opacity = 1;
                    graphView.singularityIndicator.visible = false;
                }else{
                    //always want indicatorLine grabbable, so do not want .visible = false
                    graphView.indicatorLine.opacity = 0;
                    graphView.singularityIndicator.visible = true;
                }
            }
            graphView.setIndicatorLine();
            //visibility of trig function readout
            readoutDisplay.readoutNode.setTrigRowVisibility( graph );
        } );

        viewProperties.labelsVisibleProperty.link( function( isVisible ){
            trigLabScreenView.labelsVisible = isVisible;
            unitCircleView.setLabelVisibility( isVisible );
            graphView.onesNode.visible = isVisible;
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
                readoutDisplay.readoutNode.nbrFullTurnsNode.visible = true;
                readoutDisplay.readoutNode.angleReadoutFraction.visible = true;
                readoutDisplay.readoutNode.angleReadoutDecimal.visible = false;
            }else{
                readoutDisplay.readoutNode.nbrFullTurnsNode.visible = false;
                readoutDisplay.readoutNode.angleReadoutFraction.visible = false;
                readoutDisplay.readoutNode.angleReadoutDecimal.visible = true;
            }
            readoutDisplay.readoutNode.setAngleReadout();
        });//end viewProperties.angleUnitsProperty.link

        viewProperties.specialAnglesVisibleProperty.link( function( specialAnglesVisible ){
            unitCircleView.specialAnglesNode.visible = specialAnglesVisible;
            readoutDisplay.readoutNode.specialAnglesOnly = specialAnglesVisible;
            trigLabModel.specialAnglesMode = specialAnglesVisible;

            //select correct trig readouts
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
                readoutDisplay.readoutNode.nbrFullTurnsNode.visible = true;
                readoutDisplay.readoutNode.angleReadoutFraction.visible = true;
                readoutDisplay.readoutNode.angleReadoutDecimal.visible = false;
            }else{
                readoutDisplay.readoutNode.nbrFullTurnsNode.visible = false;
                readoutDisplay.readoutNode.angleReadoutFraction.visible = false;
                readoutDisplay.readoutNode.angleReadoutDecimal.visible = true;
            }

            //set precision of angle readout in degrees:
            //in special angles mode, zero decimal places (e.g. 45 deg), otherwise 1 decimal place (e.g. 45.0 deg)
            if( specialAnglesVisible ){
                var currentSmallAngle = trigLabModel.getSmallAngleInRadians();
                trigLabModel.setSpecialAngle( currentSmallAngle );
                readoutDisplay.readoutNode.setAngleReadoutPrecision( 0 );   //integer display of special angles
            }else{
                readoutDisplay.readoutNode.setAngleReadoutPrecision( 1 );  //1 decimal place precision for continuous angles
            }
            readoutDisplay.readoutNode.setAngleReadout();
            readoutDisplay.readoutNode.setTrigReadout();
        });//end viewProperties.specialAnglesVisibleProperty.link

        // Create and add the Reset All Button in the bottom right, which resets the model
        var resetAllButton = new ResetAllButton( {
            listener: function () {
                viewProperties.reset();
                graphView.accordionBox.expandedProperty.value = true;
                trigLabModel.setFullAngleInRadians( 0 );
            },
            right: this.layoutBounds.maxX - 60,
            top: controlPanel.bottom + 10, //this.layoutBounds.maxY - 10,
            radius: 18   //Dubson wants button smaller than default
        } );
        this.addChild( resetAllButton );
    }

    return inherit( ScreenView, TrigLabScreenView, {} );
} );