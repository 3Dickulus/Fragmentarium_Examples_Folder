// Sine atan2 Mandelbulb, mix integer powers 1,2,3,4
// z = z^4 + z^3 + z^2 + z + c
// deviated away from work by 3DickUlus and sabine62
// https://fractalforums.org/fractal-mathematics-and-new-theories/28/is-there-a-name-for-this-fractal/2748/msg14759#msg14759
// mclarekin 2/6/19


#info Mandelbulb Distance Estimator
#define providesInit

#include "MathUtils.frag"
#include "DE-Raytracer.frag"
//#include "DE-Kn2cr11.frag"
#group Mandelbulb
// Number of fractal iterations.
uniform int Iterations;  slider[0,9,100]

// Number of color iterations.
uniform int ColorIterations;  slider[0,9,100]

// Bailout radius
uniform float Bailout; slider[0,5,30]

uniform vec3 RotAngle; slider[(-180,-180,-180),(0,0,0),(180,180,180)]

uniform vec3 JuliaC; slider[(-2,-2,-2),(0,0,0),(2,2,2)]
uniform vec3 cPixelMul; slider[(-2,-2,-2),(0,0,0),(2,2,2)]
uniform bool one; checkbox[true]
uniform bool two; checkbox[true]
uniform bool three; checkbox[true]
uniform bool four; checkbox[true]
uniform vec4 w8ts; slider[(-2,-2,-2,-2),(1,1,1,1),(2,2,2,2)]
uniform float DEoffset; slider[-4,0,4]
float r;

mat3 rot;
void init() {
	 rot = rotationMatrixXYZ(RotAngle);
}
float atan2(in float y, in float x)
{
    return x == 0.0 ? sign(y)*PI/2.0 : atan(y, x);
}
vec3 cos3(float theta, float phi)
{
	float costh = cos(theta);
	return vec3(costh*sin(phi), cos(phi)*costh, sin(theta));
}
vec3 sin3(float theta, float phi)
{
	float sinth = sin(theta);
	return vec3(sinth*cos(phi), sin(phi)*sinth, cos(theta));
}
vec3 powN4(inout vec3 z, float theta,	 float phi, inout float dr) {
	float Rs = r*r*r;
	dr =  Rs*4.*dr + 1.0;
	float zr = Rs*r;
	theta = theta*4.;
	phi = phi*4.;
	z = zr*cos3(theta, phi);
	//z = zr*sin3(theta, phi);
	vec3 z4=z;
	return z4;
}
vec3 powN3(inout vec3 z, float theta,	 float phi, inout float dr) {
	float Rs = r*r;
	dr =  Rs*3.*dr + 1.0;
	float zr = Rs*r;
	theta = theta*3.;
	phi = phi*3.;
	z = zr*cos3(theta, phi);
	//z = zr*sin3(theta, phi);
	vec3 z3=z;
	return z3;
}
vec3 powN2(inout vec3 z, float theta,	 float phi, inout float dr) {
	dr =  r*2.*dr + 1.0;
	float zr = r*r;
	theta = theta*2.;
	phi = phi*2.;
	z = zr*cos3(theta, phi);
	//z = zr*sin3(theta, phi);
	vec3 z2=z;
	return z2;
}

float DE(vec3 pos) {
	vec3 cPixel=pos*cPixelMul;
	vec3 z = pos;
	r = length(z);
	float dr=1.0;
	int i=0;

	vec3 z1,z2,z3,z4;
  vec3 zer0 = vec3(0.0,0.0,0.0);
	vec3 zorg2=zer0;
	vec3 zorg3=zer0;
	vec3 zorg4=zer0;
	float dr1 = 0.; 
	float dr2 = 0.;
	float dr3 = 0.;
	float dr4 = 0.;
	while(r<Bailout && (i<Iterations)) {

	float theta = asin(z.z/r);
	float phi = atan2(z.y,z.x);

	//float theta = acos(z.z/r);
	//float phi = atan(z.y,z.x);


		if (four)
		{	
			zorg4=z;
			dr4 = dr;
			powN4(zorg4, theta, phi, dr4);
			z4=zorg4;
		}
		if (three)
		{	
			zorg3=z;
			dr3 = dr;
			powN3(zorg3, theta, phi, dr3);
			z3=zorg3;
		}
		if (two)
		{
			zorg2=z;
			dr2 = dr;
			powN2(zorg2, theta, phi, dr2);
			z2=zorg2;
		}
		if (one)
		{
			z1=z;
			dr1 = r;
		}
		//z = z1+z2+z3+z4;
		//dr = dr1+dr2+dr3+dr4;

		z = (z1*w8ts.x)+(z2*w8ts.y)+(z3*w8ts.z)+(z4*w8ts.w);
		dr =abs((dr1*w8ts.x) + (dr2*w8ts.y)+(dr3*w8ts.z)+(dr4*w8ts.w) + DEoffset);
		//z*=rot;
		z+= JuliaC + cPixel;
		
		r=length(z);
		z *= rot;
		if (i<ColorIterations) orbitTrap = min(orbitTrap, abs(vec4(z.x,z.y,z.z,r*r)));
		i++;
	}
	return 0.5*log(r)*r/dr;	
}









#preset 24
FOV = 0.4
Eye = 0,-4.28750229,0
Target = 0,3.71250224,0
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
Detail = -3.35502958
DetailAO = 0
FudgeFactor = 0.746710527
MaxDistance = 1000
MaxRaySteps = 2464
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
BaseColor = 0.717647076,1,0.666666687
OrbitStrength = 0.204697986
X = 0.5,0.600000024,0.600000024,0.699999988
Y = 1,0.600000024,0,0.400000006
Z = 0.800000012,0.779999971,1,0.5
R = 0.400000006,0.699999988,1,0.119999997
BackgroundColor = 0.600000024,0.5,0.449999988
GradientBackground = 0.3
CycleColors = false
Cycles = 1.1
EnableFloor = false
FloorNormal = 0,0,1
FloorHeight = 0
FloorColor = 1,1,1
Iterations = 9
ColorIterations = 9
Bailout = 15
RotAngle = 90,90,90
JuliaC = 0,0,0
cPixelMul = 0,0,0
one = false
two = true
three = false
four = true
w8ts = 1,1,1,1
DEoffset = 0
#endpreset

#preset 13
FOV = 0.4
Eye = -0.311673403,-0.491046041,-4.38735676
Target = 0.592350721,1.03523362,6.73156929
Up = 0.002707441,0.990285814,-0.136155322
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
Detail = -2.89940828
DetailAO = 0
FudgeFactor = 0.746710527
MaxDistance = 1000
MaxRaySteps = 2464
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
BaseColor = 0.717647076,1,0.666666687
OrbitStrength = 0.204697986
X = 0.5,0.600000024,0.600000024,0.699999988
Y = 1,0.600000024,0,0.400000006
Z = 0.800000012,0.779999971,1,0.5
R = 0.400000006,0.699999988,1,0.119999997
BackgroundColor = 0.600000024,0.5,0.449999988
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
RotAngle = 0,74.4169611,0
JuliaC = 0,0,0
cPixelMul = 0,0.112956811,0
one = true
two = false
three = true
four = false
w8ts = 1,1,1,1
DEoffset = 0
#endpreset
