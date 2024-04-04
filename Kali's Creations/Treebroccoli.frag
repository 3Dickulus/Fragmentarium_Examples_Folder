// Output generated from file: C:/Fractales/Fragmentarium/surfkifs.frag
// Created: dom 5. feb 14:04:32 2012
// Output generated from file: C:/Fractales/Fragmentarium/Examples/SurfaceKIFS.frag
// Created: mié 25. ene 22:59:36 2012
#info Mandelbox Distance Estimator (Rrrola's version).

#include "MathUtils.frag"
#include "DE-Raytracer.frag" 

#group Mandelbox

/*
The distance estimator below was originalled devised by Buddhi.
This optimized version was created by Rrrola (Jan Kadlec), http://rrrola.wz.cz/

See this thread for more info: http://www.fractalforums.com/3d-fractal-generation/a-mandelbox-distance-estimate-formula/15/
*/

// Number of fractal iterations.
uniform int Iterations;  slider[0,17,300]
uniform int ColorIterations;  slider[0,3,300]

//uniform float MinRad2;  slider[0,0.25,2.0]

// Scale parameter. A perfect Menger is 3.0
uniform float Scale;  slider[0,1.5,3.0]
//uniform float bailout;  slider[0,2.0,50]
uniform vec3 Fold; slider[(0,0,0),(0,0,0),(1,1,1)]
uniform vec3 Julia; slider[(-2,-2,-2),(-0.5,-0.5,-0.5),(1,1,1)]
vec4 scale = vec4(Scale, Scale, Scale, abs(Scale));

// precomputed constants

uniform vec3 RotVector; slider[(-1,-1,-1),(1,1,1),(1,1,1)]


// Scale parameter. A perfect Menger is 3.0
uniform float RotAngle; slider[-180,0,180]

mat3 rot;


//float absScalem1 = abs(Scale - 1.0);
//float AbsScaleRaisedTo1mIters = pow(abs(Scale), float(1-Iterations));
float expsmoothing = 0.0;
float l = 0.0;



// Compute the distance from `pos` to the Mandelbox.
float DE(vec3 pos) {
	 rot = rotationMatrix3(normalize(RotVector), RotAngle);
	vec3 p = pos, p0 = Julia;  // p.w is the distance estimate
	
	int i=0;
	for (i=0; i<Iterations; i++) {
		p*=rot;
		p.xy=abs(p.xy+Fold.xy)-Fold.xy;
		p=p*Scale+p0;
		l=length(p);
		if (i<ColorIterations) orbitTrap = min(orbitTrap, abs(vec4(p.xyz,expsmoothing)));
	}
	return (l)*pow(Scale, -float(i));
}

#preset Default
FOV = 0.4
Eye = 2.24024,-0.914052,1.26689
Target = -2.33559,2.99323,-2.33041
Up = 0.740733,0.611624,-0.277898
EquiRectangular = false
AutoFocus = false
FocalPlane = 1
Aperture = 0
Gamma = 2.08335
ToneMapping = 3
Exposure = 0.6522
Brightness = 1
Contrast = 1
AvgLumin = 0.5,0.5,0.5
Saturation = 1
LumCoeff = 0.2125,0.7154,0.0721
Hue = 0
GaussianWeight = 1
AntiAliasScale = 2
DepthToAlpha = false
ShowDepth = false
DepthMagnitude = 1
Detail = -3.30909089
DetailAO = -1.49641317
FudgeFactor = 0.39201184
MaxDistance = 1000
MaxRaySteps = 440
Dither = 0.5
NormalBackStep = 1
AO = 0,0,0,0.66916168
Specular = 1
SpecularExp = 7.273
SpecularMax = 10
SpotLight = 1,1,1,1
SpotLightDir = -0.47633136,-0.77218934
CamLight = 1,1,1,1.34616
CamLightMin = 0
Glow = 1,1,1,0.09589
GlowMax = 52
Fog = 0.369146
HardShadow = 1 NotLocked
ShadowSoft = 10.83947
QualityShadows = false
Reflection = 0.11538 NotLocked
DebugSun = false
BaseColor = 1,1,1
OrbitStrength = 0.85714
X = 0.588235,0.6,0.380392,-0.3398
Y = 1,0.6,0,0.06796
Z = 1,0.231373,0.207843,0.20388
R = 0.470588,0.509804,0.854902,-0.05882
BackgroundColor = 0.117647,0.14902,0.227451
GradientBackground = 0.5435
CycleColors = false
Cycles = 4.04901
EnableFloor = true
FloorNormal = -0.68292,-1,0.12196
FloorHeight = -0.0563
FloorColor = 1,1,1
Iterations = 20
ColorIterations = 14
Scale = 1.44915
Fold = 0.13008,0.04564315,0.02489627
Julia = -0.03034482,-0.80827584,-0.15862068
RotVector = 0.2174,1,0.02174
RotAngle = 93.2544
#endpreset

