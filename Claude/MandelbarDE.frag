#version 150

#group Burning Ship
#include "Progressive2DJuliaDE.frag"

//  Burning Ship Fractal
// (Implementation by Syntopia)
// (derivatives implementation by Claude)

vec2 formula(in vec2 z, in vec2 c, inout mat2 d, in float j) {
  d = mat2
    ( 2.0 * (z[0] * d[0][0] - z[1] * d[0][1]) + j
    , 2.0 * (z[0] * d[1][0] - z[1] * d[1][1])
    , -2.0 * (z[0] * d[0][1] + z[1] * d[0][0])
    , -2.0 * (z[0] * d[1][1] + z[1] * d[1][0]) + j
    );
	z = cSqr(cConj(z)) + c;
	return z;
}
