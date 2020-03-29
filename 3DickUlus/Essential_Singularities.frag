#include "Complex.frag"
#include "MathUtils.frag"
#include "Progressive2D.frag"
#info Derived from formulae at...
#info https://fractalforums.org/fractal-mathematics-and-new-theories/28/essential-singularities/3234
#group Mandelbrot

// Number of iterations
uniform int  Iterations; slider[10,200,10000]

uniform vec3 RGB; color[0.7,0.4,0.0]

uniform float ColorDiv; slider[0.00001,256,512]
uniform float Bailout; slider[0.00001,16,32]
uniform bool Julia; checkbox[false]
uniform float JuliaX; slider[-2,-0.6,2]
uniform float JuliaY; slider[-2,1.3,2]
uniform vec2 A; slider[(-4,-4),(-1,-1),(4,4)]
uniform bool AbsX; checkbox[false]
uniform bool AbsY; checkbox[false]

vec2 c2 = vec2(JuliaX,JuliaY);


vec3 color(vec2 c) {
	c *= vec2(1.,-1.);
	vec2 z = c;
	vec2 a = A;
	float len = 0.0;
	int  i = 0;

	for (i = 0; i < Iterations; i++) {
		if(AbsX) z.x=abs(z.x);
		if(AbsY) z.y=abs(z.y);
		z = cMul(cMul(z,z), cExp(cDiv(a,z)) ) + (Julia ? c2 : c);
		len = max(len,length(z));
		if ( (len > Bailout)) break;
	}

	if ( len > Bailout ) {
		// The color scheme here is based on one from Inigo Quilez's Shader Toy:
		float co = float(i) + M_2PI - log2(.5*log2(length(z)));
		co = sqrt(co/ColorDiv);
		return .5+.5*cos(M_2PI*co+RGB);
	}

return vec3(0.0);

}

#preset Default
TrigIter = 5
TrigLimit = 1.10000000000000009
Center = -0.65477949,-0.003388196
Zoom = 0.756143667 Logarithmic
EnableTransform = true
RotateAngle = 0
StretchAngle = 0
StretchAmount = 0
Gamma = 2.2
ToneMapping = 1
Exposure = 1
Brightness = 1
Contrast = 1
Saturation = 1
AARange = 2
AAExp = 1
GaussianAA = true
Iterations = 200
Julia = false
JuliaX = -0.6
JuliaY = 1.3
A = 0,0
RGB = 0.701960784,0.407843137,0
ColorDiv = 4 Logarithmic
#endpreset

#preset Mandel2
TrigIter = 5
TrigLimit = 1.10000000000000009
Center = -0.511230564,0.015016967
Zoom = 0.756143667 Logarithmic
EnableTransform = true
RotateAngle = 0
StretchAngle = 0
StretchAmount = 0
Gamma = 2.2
ToneMapping = 1
Exposure = 1
Brightness = 1
Contrast = 1
Saturation = 1
AARange = 2
AAExp = 1
GaussianAA = true
Iterations = 200
Julia = false
JuliaX = 0
JuliaY = 0
A = -0.313315920,0.0
RGB = 0.701960784,0.407843137,0
ColorDiv = 4 Logarithmic
#endpreset

#preset Julia1
TrigIter = 5
TrigLimit = 1.10000000000
Center = 0.054821152,0
Zoom = 0.72327929 Logarithmic
EnableTransform = true
RotateAngle = 0
StretchAngle = 0
StretchAmount = 0
Gamma = 2.2
ToneMapping = 1
Exposure = 1
Brightness = 1
Contrast = 1
Saturation = 1
AARange = 2
AAExp = 1
GaussianAA = true
Iterations = 1400
Julia = true
JuliaX = 0.307828
JuliaY = -0.03225804
A = 0,0
RGB = 0.701960784,0.407843137,0
ColorDiv = 4 Logarithmic
#endpreset

#preset nice
Gamma = 2.2
Brightness = 1
Contrast = 1
Saturation = 1
TrigIter = 5
TrigLimit = 1.10000000000000009
Center = 0.021155213,0.007024236
Zoom = 0.854514 Logarithmic
EnableTransform = true
RotateAngle = 0
StretchAngle = 0
StretchAmount = 0
ToneMapping = 1
Exposure = 1
AARange = 2
AAExp = 1
GaussianAA = true
Iterations = 328
RGB = 0.701960784,0.407843137,0
ColorDiv = 64 Logarithmic
Bailout = 16
Julia = true
JuliaX = -0.14103224
JuliaY = -0.83870972
A = 0,0
AbsX = false
AbsY = false
#endpreset

#preset ThreeThirteen0A
TrigIter = 5
TrigLimit = 1.10000000000000009
Center = -0.133959547,0.020827426
Zoom = 0.796858869 Logarithmic
EnableTransform = true
RotateAngle = 0
StretchAngle = 0
StretchAmount = 0
Gamma = 2.2
ToneMapping = 1
Exposure = 1
Brightness = 1
Contrast = 1
Saturation = 1
AARange = 2
AAExp = 1
GaussianAA = true
Iterations = 2000
Julia = false
JuliaX = -0.46982408
JuliaY = -0.159524345
A = -1,0
RGB = 0.701960784,0.407843137,0
ColorDiv = 4 Logarithmic
#endpreset

#preset ThreeThirteenJ1
Gamma = 2.2
Brightness = 1
Contrast = 1
Saturation = 1
TrigIter = 5
TrigLimit = 1.10000000000000009
Center = 0.443664861,0.020827426
Zoom = 0.796858869 Logarithmic
EnableTransform = true
RotateAngle = 0
StretchAngle = 0
StretchAmount = 0
ToneMapping = 1
Exposure = 1
AARange = 2
AAExp = 1
GaussianAA = true
Iterations = 2000
RGB = 0.701960784,0.407843137,0
ColorDiv = 4 Logarithmic
Bailout = 16
Julia = true
JuliaX = -0.475824118
JuliaY = 0.159524345
A = -1,0
AbsX = false
AbsY = false
#endpreset

#preset ThreeThirteenCJ
TrigIter = 5
TrigLimit = 1.10000000000000009
Center = 0.533311022,-0.05690038
Zoom = 0.692920756 Logarithmic
EnableTransform = true
RotateAngle = 0
StretchAngle = 0
StretchAmount = 0
Gamma = 2.2
ToneMapping = 1
Exposure = 1
Brightness = 1
Contrast = 1
Saturation = 1
AARange = 2
AAExp = 1
GaussianAA = true
Iterations = 2000
RGB = 0.701960784,0.407843137,0
ColorDiv = 4 Logarithmic
Julia = true
JuliaX = -1
JuliaY = 0
A = -1,0
#endpreset
