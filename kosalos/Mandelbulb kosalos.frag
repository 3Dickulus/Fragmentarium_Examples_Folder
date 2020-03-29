
// based on formula by kosalos
// https://fractalforums.org/fractal-mathematics-and-new-theories/28/julia-sets-and-altering-the-iterate-afterwards/2871/msg16342#msg16342
// have also added some other options used in MandelbulberV2
// mclarekin 2-09-19

#info Mandelbulb Distance Estimator
#define providesInit

#include "MathUtils.frag"
#include "DE-Raytracer.frag"
#group Mbulb_Kosalos

// Number of fractal iterations.
uniform int Iterations;  slider[0,9,100]

// Number of color iterations.
uniform int ColorIterations;  slider[0,9,100]

// Bailout radius
uniform float Bailout; slider[0,5,30]


// Mandelbulb exponent Power0 = initial power at i = 0, 
uniform float Power0; slider[0,9,30]
uniform float PowerScale; slider[-4,0,30]
uniform float alphaAngleOffset; slider[-180.00,0,180]
uniform float betaAngleOffset; slider[-180.00,0,180]
uniform float thetaScale; slider[0,1,3]
uniform float thetaTweakOffset; slider[-5,0.2,5]
uniform float radialAngle; slider[0,1,2]
uniform bool convSine; checkbox[false]

uniform vec3 RotVector; slider[(0,0,0),(1,1,1),(1,1,1)]
uniform float RotAngle; slider[0,0,180]

uniform vec3 JuliaC; slider[(-2,-2,-2),(0,0,0),(2,2,2)]

uniform vec3 OrigPtScale; slider[(-5,-5,-5),(0,0,0),(0,0,0)]
uniform float time;

float Power = 0.0;
mat3 rot;
void init() {
	 rot = rotationMatrix3(normalize(RotVector), RotAngle);
}

// Compute the distance from `pos` to the Mandelbulb.
float DE(vec3 pos) {
	vec3 z=pos;
	vec3 oldZ=pos;
	float r;
	vec3 OrigPt = pos * OrigPtScale;


	float dr=1.0;
	int i=0;
	r=length(z);
	while(r<Bailout && (i<Iterations))
	{
		Power = Power0 + float(i) * PowerScale;
 
		vec3 diffVec = vec3(0.001, 0.001, 0.001) + oldZ - z;
		oldZ = z;
		float diffLen = length(diffVec); // > 3.16e-5
		float thetaTweak = radialAngle / 100.0 /(diffLen + thetaTweakOffset / 100.0);
		thetaTweak = (1.0 - thetaTweak);
		float xyL = length(z.xy);

		float theta = atan(xyL * thetaTweak, z.z) + betaAngleOffset;

		float phi = atan(z.y,z.x) + alphaAngleOffset;
		dr +=  pow( r, Power-1.0)*Power*dr + 1.0;

	// scale and rotate the point
		float zr = pow( r,Power);
		theta = theta*Power * thetaScale;
		phi = phi*Power;

	// convert back to cartesian coordinates
		if (convSine)
		{
			float sth = sin(theta);
			z += zr*vec3(sth*cos(phi), sth*sin(phi), cos(theta));
		}
		else
		{
			float cth = cos(theta);
			z += zr*vec3(cth*cos(phi), cth*sin(phi), sin(theta));
		}
		z+=JuliaC + OrigPt;
		r=length(z);
		z*=rot;
		if (i<ColorIterations) orbitTrap = min(orbitTrap, abs(vec4(z.x,z.y,z.z,r*r)));
		i++;
	}
	return 0.5*log(r)*r/dr;
}

#preset fr1
FOV = 0.4
Eye = 0,-3.80000114,0
Target = 0,1.20000017,0
Up = 0,0,1
EquiRectangular = false
AutoFocus = false
FocalPlane = 1
Aperture = 0
Gamma = 2
ToneMapping = 4
Exposure = 1
Brightness = 1
Contrast = 1
AvgLumin = 0.5,0.5,0.5
Saturation = 1
LumCoeff = 0.212500006,0.715399981,0.0720999986
Hue = 0
GaussianWeight = 1
AntiAliasScale = 2
DepthToAlpha = false
ShowDepth = false
DepthMagnitude = 1
Detail = -2.9408284
DetailAO = -0.5
FudgeFactor = 0.842105264
MaxDistance = 159.010603
MaxRaySteps = 56
Dither = 0.5
NormalBackStep = 1
AO = 0,0,0,0.699999988
Specular = 0.4
SpecularExp = 16
SpecularMax = 10
SpotLight = 1,1,1,0.400000006
SpotLightDir = 0.100000001,0.100000001
CamLight = 1,1,1,1
CamLightMin = 0
Glow = 1,1,1,0
GlowMax = 20
Fog = 0
HardShadow = 0
ShadowSoft = 2
QualityShadows = false
Reflection = 0
DebugSun = false
BaseColor = 0.97647059,1,0.686274529
OrbitStrength = 0.61409396
X = 0.5,0.600000024,0.600000024,0.080000002
Y = 1,0.600000024,0,0.574750831
Z = 0.800000012,0.779999971,1,0.009966778
R = 0.400000006,0.699999988,1,-0.013333332
BackgroundColor = 0.600000024,0.600000024,0.449999988
GradientBackground = 0.3
CycleColors = false
Cycles = 1.1
EnableFloor = false
FloorNormal = 0,0,1
FloorHeight = 0
FloorColor = 1,1,1
Iterations = 9
ColorIterations = 9
Bailout = 5
Power0 = 9
PowerScale = 0
alphaAngleOffset = 0
betaAngleOffset = 0
thetaScale = 1
thetaTweakOffset = 0.2
radialAngle = 1
convSine = false
RotVector = 1,1,1
RotAngle = 0
JuliaC = 0,0,0
OrigPtScale = 0,0,0
#endpreset
