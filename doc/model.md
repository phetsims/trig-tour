# Trig Tour model

This document describes the model for the Trig Tour simulation.<br>
@author Michael Dubson (PhET)
@author Jesse Greenberg (PhET)

## Trig Tour Model

The trig tour model tracks the angle for trigonometry evaluations for each of the functions sin, cos, and tan. The model
angle can be restricted to 'special angles', angles which result in 'neat' trigonometric values.

The model is capable of evaluating its current angle in units of degrees and radians.  The tangent function produces
singularities at +/- 90 degrees.  The model restricts the singularity to a maximum value around these angles.
