// Copyright 2025, University of Colorado Boulder

/**
 * Live readout of the trig function with its fraction and value.
 *
 * @author Jesse Greenberg (PhET Interactive Simulations)
 */

import { Node, ReadingBlock, ReadingBlockHighlight } from '../../../../../scenery/js/imports.js';
import trigTour from '../../../trigTour.js';
import TrigTourModel from '../../model/TrigTourModel.js';
import ViewProperties from '../ViewProperties.js';
import LabelFractionValueRow from './LabelFractionValueRow.js';

export default class TrigFunctionRow extends ReadingBlock( Node ) {
  public constructor( model: TrigTourModel, viewProperties: ViewProperties, maxPanelWidth: number ) {

    const sinLabelFractionValueRow = new LabelFractionValueRow( 'sin', model, viewProperties );
    const cosLabelFractionValueRow = new LabelFractionValueRow( 'cos', model, viewProperties );
    const tanLabelFractionValueRow = new LabelFractionValueRow( 'tan', model, viewProperties );

    super( {
      children: [ sinLabelFractionValueRow, cosLabelFractionValueRow, tanLabelFractionValueRow ],
      maxWidth: maxPanelWidth
    } );

    // Synchronize visibility properties with the view
    viewProperties.graphProperty.link( graph => {
      sinLabelFractionValueRow.visible = ( graph === 'sin' );
      cosLabelFractionValueRow.visible = ( graph === 'cos' );
      tanLabelFractionValueRow.visible = ( graph === 'tan' );

      const descriptionProperty = graph === 'sin' ? sinLabelFractionValueRow.descriptionStringProperty :
                                  graph === 'cos' ? cosLabelFractionValueRow.descriptionStringProperty :
                                  tanLabelFractionValueRow.descriptionStringProperty;

      this.readingBlockNameResponse = descriptionProperty;
      this.descriptionContent = descriptionProperty;

      this.updateFocusHighlight();
    } );

    const boundUpdateFocusHighlight = this.updateFocusHighlight.bind( this );
    sinLabelFractionValueRow.visibleBoundsChangedEmitter.addListener( boundUpdateFocusHighlight );
    cosLabelFractionValueRow.visibleBoundsChangedEmitter.addListener( boundUpdateFocusHighlight );
    tanLabelFractionValueRow.visibleBoundsChangedEmitter.addListener( boundUpdateFocusHighlight );

    this.readingBlockDisabledTagName = 'p';
  }

  //
  // when visible components of this ReadingBlock change.
  /**
   * Workaround for a scenery issue - There is no visibleBoundsProperty so we need to manually update the highlight. When
   * visible components of this ReadingBlock change, we need to recreate the focus highlight so it accurately reflects
   * the bounds.
   */
  private updateFocusHighlight(): void {

    // If there is an old focusHighlight, dispose it.
    if ( this.focusHighlight instanceof ReadingBlockHighlight ) {
      this.focusHighlight.dispose();
    }

    this.focusHighlight = new ReadingBlockHighlight( this );
  }
}

trigTour.register( 'TrigFunctionRow', TrigFunctionRow );