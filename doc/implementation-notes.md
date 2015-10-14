# Trig Tour - Implementation Notes

This document contains notes that will be helpful to developers and future maintainers of this simulation.

## Model

Start by reading the model description in TODO: link to model notes

The `TrigTourModel` type contains all of the model logic for this simulation.








Type `Spring` is the heart of the model, start there. Type `SeriesSystem` and `ParallelSystem` expand
the model to describe series and parallel configurations of 2 springs.

The model is 1 dimensional. Everything occurs along the x (horizontal) axis, with positive values to the right.

Since the model is 1-dimensional, various "vectors" (e.g. `appliedForceVector`) are implemented as scalars.
This simplifies the implementation, and allows us to use simple numbers rather than allocating Vector objects.

For systems of springs, the classical model equations use subscripts '1' and '2' to refer to the springs
in a system (e.g. k<sub>1</sub>, k<sub>2</sub>). Rather than use subscripts, this implementations
uses "left" and "right" (for 2 springs in series), "top" and "bottom" (for 2 springs in parallel).

For systems containing more than one spring, you'll see the term "equivalent spring". This is the
single spring that is equivalent to the system.

The model is general and supports some things that springs shouldn't do when in a system. For example,
the general model supports moving the left end of a spring. But in a series system, the left end of
the left spring should remain connected to the wall at all times.  Throughout the implementation,
assertions are used to guard against these types of violations.
