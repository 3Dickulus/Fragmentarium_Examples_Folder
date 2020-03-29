#info Mandelbulb Distance Estimator
#define providesInit

#include "MathUtils.frag"
#include "DE-Raytracer.frag"
#group Mandelbulb_Sabine

// Number of fractal iterations.
uniform int Iterations;  slider[0,9,100]

// Number of color iterations.
uniform int ColorIterations;  slider[0,9,100]

// Mandelbulb exponent (8 is standard)
//uniform float Power; slider[0,8,16]

// Bailout radius
uniform float Bailout; slider[0,5,30]

// Alternate is slightly different, but looks more like a Mandelbrot for Power=2
//uniform bool AlternateVersion; checkbox[false]

uniform vec3 RotVector; slider[(-180,-180,-180),(0,0,0),(180,180,180)]
//uniform float RotAngle; slider[0.00,0,180]


uniform vec3 JuliaC; slider[(-2,-2,-2),(0,0,0),(2,2,2)]
uniform vec3 cPixelMul; slider[(-2,-2,-2),(0,0,0),(2,2,2)]
uniform bool one; checkbox[true]
uniform bool two; checkbox[true]
uniform bool three; checkbox[true]
uniform bool four; checkbox[true]
uniform vec4 w8ts; slider[(-2,-2,-2,-2),(1,1,1,1),(2,2,2,2)]
mat3 rot;
void init() {
	 rot = rotationMatrixXYZ(RotVector);
}
float atan2(in float y, in float x)
{
    return x == 0.0 ? sign(y)*PI/2.0 : atan(y, x);
}
float r;
vec3 powN4(inout vec3 z, inout float dr) {
	// extract polar coordinates
	r=length(z);
	float theta = asin(z.z/r);
	float phi = atan2(z.y,z.x);
	dr =  r*r*r*4.*dr + 1.0;

	// scale and rotate the point
	float zr = r*r*r*r;
	theta = theta*4.;
	phi = phi*4.;

	// convert back to cartesian coordinates
	z = zr*vec3(sin(theta)*cos(phi), sin(phi)*sin(theta), cos(theta));
	vec3 z4=z;
	return z4;
}

vec3 powN3(inout vec3 z, inout float dr) {
	// extract polar coordinates
	r=length(z);
	float theta = asin(z.z/r);
	float phi = atan2(z.y,z.x);
	dr =  r*r*3.*dr + 1.0;

	// scale and rotate the point
	float zr = r*r*r;
	theta = theta*3.;
	phi = phi*3.;

	// convert back to cartesian coordinates
	z = zr*vec3(sin(theta)*cos(phi), sin(phi)*sin(theta), cos(theta));
	vec3 z3=z;
	return z3;
}
vec3 powN2(inout vec3 z, inout float dr) {
	// extract polar coordinates
	r=length(z);
	float theta = asin(z.z/r);
	float phi = atan2(z.y,z.x);
	dr =  r*2.*dr + 1.0;

	// scale and rotate the point
	float zr = r*r;
	theta = theta*2.;
	phi = phi*2.;

	// convert back to cartesian coordinates
	z = zr*vec3(sin(theta)*cos(phi), sin(phi)*sin(theta), cos(theta));
	vec3 z2=z;
	return z2;
}
vec3 powN1(inout vec3 z, inout float dr) {
	// extract polar coordinates
	r=length(z);
	float theta = asin(z.z/r);
	float phi = atan2(z.y,z.x);
	dr =  r * dr + 1.0;

	// scale and rotate the point
	float zr = r;
	theta = theta;
	phi = phi;

	// convert back to cartesian coordinates
	z = zr*vec3(sin(theta)*cos(phi), sin(phi)*sin(theta), cos(theta));
	vec3 z1=z;
	return z1;
}

float DE(vec3 pos) {
	vec3 cPixel=pos*cPixelMul;
	vec3 z = pos;
	float r;
	float dr=1.0;
	int i=0;
	r=length(z);
	
	vec3 z1,z2,z3,z4;
  vec3 zer0 = vec3(0.0,0.0,0.0);
	vec3 zorg1=zer0;
	vec3 zorg2=zer0;
	vec3 zorg3=zer0;
	vec3 zorg4=zer0;
 
	float dr1 = 0.;
	float dr2 = 0.;
	float dr3 = 0.;
	float dr4 = 0.;
	while(r<Bailout && (i<Iterations)) {



	/*	if (one)
		{
			zorg1=z;
			dr1 = dr;
			powN1(zorg1, dr1);
			z1=zorg1;
		}
		if (two)
		{
			zorg2=z;
			dr2 = dr;
			powN2(zorg2, dr2);
			z2=zorg2;
		}
		if (three)
		{	
			zorg3=z;
			dr3 = dr;
			powN3(zorg3, dr3);
			z3=zorg3;
		}
		if (four)
		{	
			zorg4=z;
			dr4 = dr;
			powN4(zorg4, dr4);
			z4=zorg4;
		}*/





		if (four)
		{	
			zorg4=z;
			dr4 = dr;
			powN4(zorg4, dr4);
			z4=zorg4;
		}


		if (three)
		{	
			zorg3=z;
			dr3 = dr;
			powN3(zorg3, dr3);
			z3=zorg3;
		}
		if (two)
		{
			zorg2=z;
			dr2 = dr;
			powN2(zorg2, dr2);
			z2=zorg2;
		}
		if (one)
		{
			zorg1=z;
			dr1 = dr;
			powN1(zorg1, dr1);
			z1=zorg1;
		}
		//z = z1+z2+z3+z4;
		//dr = dr1+dr2+dr3+dr4;;

	z = (z1*w8ts.x)+(z2*w8ts.y)+(z3*w8ts.z)+(z4*w8ts.w);
	dr = (dr1*w8ts.x)+(dr2*w8ts.y)+(dr3*w8ts.z)+(dr4*w8ts.w);
		z*=rot;
		z+= JuliaC + cPixel;
		
		r=length(z);
		z *= -rot;
		if (i<ColorIterations) orbitTrap = min(orbitTrap, abs(vec4(z.x,z.y,z.z,r*r)));
		i++;
	}
//	if ((type==1) && r<Bailout) return 0.0;
	return 0.5*log(r)*r/dr;
	
}


#preset 13
FOV = 0.4
Eye = -0.311673403,-0.491046041,-4.38735676
Target = 0.432904214,0.918275952,6.75879574
Up = 0.003412176,0.991675735,-0.125615641
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
RotVector = 0,74.4169611,0
JuliaC = 0,0,0
cPixelMul = 0,0.112956811,0
one = true
two = false
three = true
four = false
w8ts = 1,1,1,1
#endpreset

#preset 24
FOV = 0.4
Eye = 0,-4.30000257,0
Target = 0,3.70000219,0
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
RotVector = 90,90,90
JuliaC = 0,0,0
cPixelMul = 0,0,0
one = false
two = true
three = false
four = true
w8ts = 1,1,1,1
#endpreset
