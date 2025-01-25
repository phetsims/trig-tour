squareRootPattern = root { $value }

megativePattern = minus { $value }

fractionPattern = { $numerator } over { $denominator }

# The pattern that reads out an angle in degrees.
angleDegreesPattern = Angle equals { $value } degrees.

# The pattern that reads out the angle in radians.
angleRadiansPattern = Angle equals { $value } radians.

# The pattern that reads out the angle in radians but without any units.
angleEqualsSpecialAngle = Angle equals { $value }.

# The minus between values is built into the negativePattern so it is not included here.
valueMinusValuePattern = { $value1 } { $value2 }

valuePlusValuePattern = { $value1 } plus { $value2 }