squareRootPattern = root { $value }

negativePattern = negative { $value }

fractionPattern = { $numerator } over { $denominator }

# The pattern that reads out an angle in degrees.
angleDegreesPattern = Angle equals { $value } degrees.

# The pattern that reads out the angle in radians.
angleRadiansPattern = Angle equals { $value } radians.

# The pattern that reads out the angle in radians but without any units.
angleEqualsSpecialAngle = Angle equals { $value }.

valueMinusValuePattern = { $value1 } minus { $value2 }
valuePlusValuePattern = { $value1 } plus { $value2 }

trigReadoutPattern = { $trigFunction ->
  [ cos ] Cosine
  [ sin ] Sine
  *[tan] Tangent
} theta equals { $trigFraction } or { $value }.

infinity = plus or minus infinity

pi = pi

coordinatesPattern = x equals { $xValue }, y equals { $yValue }.