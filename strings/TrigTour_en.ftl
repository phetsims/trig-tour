# The pattern used to create a string for a square root. Produces something like
# "root 3" or "3".
squareRootablePattern = { $squareRoot ->
  [ TRUE ] root { $value }
  *[ FALSE ] { $value }
}

# The pattern used to create a string for a fraction with square roots.
# Produces something like "x over 1" or "root 3 over 2".
fractionPattern = { $numeratorSquareRoot ->
  [ TRUE ] root { $value }
 *[ VALUE ] { $value }
} over { $denominatorSquareRoot ->
  [ TRUE ] root { $value }
 *[ VALUE ] { $value }
}

# The pattern that reads out an angle in degrees.
angleDegreesPattern = Angle equals { $degrees } degrees.

# The pattern that reads out the angle in radians.
angleRadiansPattern = Angle equals { $radians } radians.

# The pattern that reads out the angle in radians when there
# is a fraction.
angleRadiansFractionPattern = Angle equals { fractionPattern } radians.