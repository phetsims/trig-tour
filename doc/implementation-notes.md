# Trig Tour model

This document describes the model for the Trig Tour simulation.<br>
@author Michael Dubson (PhET)
@author Jesse Greenberg (PhET)

## Trig Tour Model

The trig tour model tracks the angle and trigonometry evaluations for each of the functions sin, cos, and tan.
It can be restricted to 'special angles', angles which result in 'neat' trigonometric values.

The model is capable of evaluating its current angle in units of degrees or radians.  The tangent function produces
singularities at +/- 90 degrees.  The model restricts the singularity to a maximum value around these angles.

Both a 'full' angle and a 'small' angle are tracked by the model.  The 'full' angle represents the total angle and the
number of rotations around the unit circle. The 'small' angle is used to track the delta of theta as the user changes
the angle by dragging the icon on the unit circle and graph.  The small angle is limited from -PI to PI to track the
dragging delta.

## Trig Tour View

A graph of the trig functions against theta serves as a visual representation of the trig function evaluated at theta.
The graph has an indication arrow which 'points' to the result of the trig function evaluated at theta.

A unit circle plot exists to represent the position along the unit circle for the angle tracked by the model.  The value
of the angle is determined by the number of rotations around the unit circle.  As the user changes the full angle,
a spiral shape appears and changes to represent the number of rotations and current full angle.

The full angle can be changed by the unit circle and trigonometry graph.  Both of these view elements have circular
nodes and arrows which can be dragged by the user to change the full angle.  The arrows can be dragged completely off of
the graph to allows for at most 25 rotations.

The model angle is limited to +/- 25.25 rotations around the unit circle.  When the user exceeds this limit, a
dizzy PhET Girl icon appears.  This prevents the user from creating a rotation spiral that exceeds the bounds of the
unit circle.

At +/- 90 degrees, the tangent function produces a singularity.  This is represented in the view by a vertical dotted
line.  The indication arrow on the graph fades into the dotted line as the value approaches infinity.

A visibility panel exists to control the visibility of special angles, labels, and a grid on the unit circle.  This
panel also lets the user control which trig function is evaluating the current full angle.

A readout panel exists to present the x and y position of the angle along the unit circle, the value of the full angle,
and the value of the angle evaluated by the current trig function.  This panel also allows the user to control the units
of the full angle in radians or degrees.