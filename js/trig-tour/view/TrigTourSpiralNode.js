// Copyright 2002-2015, University of Colorado Boulder

/**
 * Node for the spiral in Trig Tour.  The spiral in this sim grows with the angle of the simulation.
 *
 * @author Jesse Greenberg
 * @author Michael Dubson (PhET developer) on 6/2/2015
 */
define( function( require ) {
  'use strict';

  // modules
  var Bounds2 = require( 'DOT/Bounds2' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Path = require( 'SCENERY/nodes/Path' );
  var Shape = require( 'KITE/Shape' );
  var Util = require( 'DOT/Util' );

  // NOTE: initialRadius  should be 0.2 times rotor radius.
  /**
   * Constructor.
   * @param {TrigTourModel} trigTourModel
   * @param {number} initialRadius - initial radius of the spiral
   * @param {number} spiralAngle - total angle of the spiral shape
   * @param {object} options
   * @constructor
   */
  function TrigTourSpiralNode( trigTourModel, initialRadius, spiralAngle, options ) {
    options = _.extend( {
      stroke: 'black',
      arrowHeadColor: 'black',
      arrowHeadLineWidth: 1,
      lineWidth: 2
    }, options );

    Path.call( this, null, options );
    var thisNode = this;

    // watch the current radius which points to the end point of the spiral
    this.endPointRadius = initialRadius; // @private
    this.initialRadius = initialRadius; // @private

    // override computeShapeBounds function to speed drawing of the shape
    var emptyBounds = new Bounds2( 0, 0, 0, 0 );
    this.computeShapeBounds = function() {
      return emptyBounds;
    };

    // draw an arrow head which will be placed at the outer end of the spiral
    var arrowHeadShape = new Shape();
    var arrowHeadWidth = 7;
    var arrowHeadLength = 12;    //arrow head length
    arrowHeadShape.moveTo( 0, 0 )
      .lineTo( -arrowHeadWidth / 2, arrowHeadLength )
      .lineTo( arrowHeadWidth / 2, arrowHeadLength )
      .close();
    this.angleArcArrowHead = new Path( arrowHeadShape, {
      lineWidth: options.arrowHeadLineWidth,
      fill: options.arrowHeadColor
    } );
    this.addChild( this.angleArcArrowHead );

    // draw the spiral with gradually increasing radius
    var arcShape = new Shape();
    arcShape.moveTo( this.endPointRadius, 0 ); // initial position of the spiral
    var totalAngle = trigTourModel.getFullAngleInRadians();

    // if the total angle is less than 0.5 radians, delta should be smaller for smoother lines
    var deltaAngle = 0.1;
    if ( Math.abs( totalAngle ) < 0.5 ) {
      deltaAngle = 0.02;
    }

    // approximate the spiral shape with line segments
    var angle = 0;
    if ( spiralAngle > 0 ) {
      for ( angle = 0; angle <= spiralAngle; angle += deltaAngle ) {
        if ( Math.abs( totalAngle ) < 0.5 ) {
          deltaAngle = 0.02;
        }
        this.endPointRadius += deltaAngle;
        arcShape.lineTo( this.endPointRadius * Math.cos( angle ), -this.endPointRadius * Math.sin( angle ) );
      }
    }
    else {
      for ( angle = 0; angle >= spiralAngle; angle -= deltaAngle ) {
        if ( Math.abs( totalAngle ) < 0.5 ) {
          deltaAngle = 0.02;
        }

        this.endPointRadius += deltaAngle;
        arcShape.lineTo( this.endPointRadius * Math.cos( angle ), -this.endPointRadius * Math.sin( angle ) );
      }
    }

    // set the spiral shape to this path
    this.setShape( arcShape );

    // update the position of the arrow node whenever the full model angle changes
    trigTourModel.fullAngleProperty.link( function( fullAngle ) {
      thisNode.updateEndPointRadius( fullAngle );
      thisNode.updateClipArea( fullAngle );
      thisNode.updateArrowHead( fullAngle );
    } );
  }

  return inherit( Path, TrigTourSpiralNode, {

    updateArrowHead: function( fullAngle ) {
      // show arrow head on angle arc if angle is > 45 degrees
      this.angleArcArrowHead.visible = Math.abs( fullAngle ) > Util.toRadians( 45 );

      // position the arrow head
      this.angleArcArrowHead.x = this.endPointRadius * Math.cos( fullAngle );
      this.angleArcArrowHead.y = -this.endPointRadius * Math.sin( fullAngle );
      // orient arrow head on angle arc correctly
      if ( fullAngle < 0 ) {
        this.angleArcArrowHead.rotation = Math.PI - fullAngle - ( 6 / this.endPointRadius );
      }
      else {
        this.angleArcArrowHead.rotation = -fullAngle + ( 6 / this.endPointRadius );
      }
    },

    updateEndPointRadius: function( fullAngle ) {
      this.endPointRadius = this.initialRadius;
      var deltaAngle;
      var angle;
      if ( Math.abs( fullAngle ) < 0.5 ) {
        deltaAngle = 0.02;
      }
      else {
        deltaAngle = 0.1;
      }
      if ( fullAngle > 0 ) {
        for ( angle = 0; angle <= fullAngle; angle += deltaAngle ) {
          this.endPointRadius += deltaAngle;
        }
      }
      else {
        for ( angle = 0; angle >= fullAngle; angle -= deltaAngle ) {
          this.endPointRadius += deltaAngle;
        }
      }
    },

    /**
     * Draws a single loop of the spiral in order
     * @param fullAngle
     */
    updateClipArea: function( fullAngle ) {

      var clipShape = new Shape();

      var clipAngle = fullAngle; // the current model angle
      var finalAngle; // the current model angle plus or minus 2 pi depending on direction of rotation
      var clipRadius = this.endPointRadius - 2; // the current end point radius minus a small offset
      var deltaAngle = 0.2; // delta for the shape angle.  Smaller results in more precise spiral shape.

      clipShape.moveTo( clipRadius * Math.cos( clipAngle ), -clipRadius * Math.sin( clipAngle ) ); // initial position of the clipping spiral
      if ( fullAngle > 0 ) {
        finalAngle = clipAngle + 2 * Math.PI;
        for ( clipAngle; clipAngle <= finalAngle; clipAngle += deltaAngle ) {
          clipRadius += deltaAngle;
          clipShape.lineTo( clipRadius * Math.cos( clipAngle ), -clipRadius * Math.sin( clipAngle ) );
        }
      }
      else {
        finalAngle = clipAngle - 2 * Math.PI;
        for ( clipAngle; clipAngle >= finalAngle; clipAngle -= deltaAngle ) {
          clipRadius += deltaAngle;
          clipShape.lineTo( clipRadius * Math.cos( clipAngle ), -clipRadius * Math.sin( clipAngle ) );
        }
      }

      clipShape.close();
      this.clipArea = clipShape;
    }
  } );
} );