#info BuffaloBulb Distance Estimator
#info Original formula by user youhn @ http://www.fractalforums.com/gallery-b177/buffalo-fractals
#define providesInit

#include "MathUtils.frag"
#include "DE-Raytracer.frag"
//#include "DE-Kn2cr11.frag"

#group Raytracer
uniform bool UseDeltaDE; checkbox[false]
uniform float DEScale; slider[0.0000001,0.001,0.050000]

#group BuffaloBulb

// Number of fractal iterations.
uniform int Iterations;  slider[0,9,100]

// Number of color iterations.
uniform int ColorIterations;  slider[0,9,100]

// Mandelbulb exponent (8 is standard)
uniform float Power; slider[0,8,16]

// Bailout radius
uniform float Bailout; slider[0,5,30]

uniform vec3 RotVector; slider[(0,0,0),(1,1,1),(1,1,1)]

uniform float RotAngle; slider[0.00,0,360]

uniform bool Julia; checkbox[false]
uniform vec3 JuliaC; slider[(-2,-2,-2),(0,0,0),(2,2,2)]

uniform float time;
mat3 rot;
void init() {
	 rot = rotationMatrix3(normalize(RotVector), RotAngle);
}

uniform bool preabsx; checkbox[false]
uniform bool preabsy; checkbox[false]
uniform bool preabsz; checkbox[false]
uniform bool absx; checkbox[false]
uniform bool absy; checkbox[false]
uniform bool absz; checkbox[false]
/**
 * Mandelbulber v2, a 3D fractal generator
 * Copyright (C) 2017 Mandelbulber Team
 *
 * Buffalo fractal ported to FragM by 3Dickulus
 */
void BuffaloIteration(inout vec3 z, float r, inout float r_dz)
{
	r_dz = r_dz * 2.0 * r;

	float x2 = z.x * z.x;
	float y2 = z.y * z.y;
	float z2 = z.z * z.z;
	float temp = 1.0 - (z2 / (x2 + y2));
	float newx = (x2 - y2) * temp;
	float newy = 2.0 * z.x * z.y * temp;
	float newz = -2.0 * z.z * sqrt(x2 + y2);

	z.x = absx ? abs(newx) : newx;
	z.y = absy ? abs(newy) : newy;
	z.z = absz ? abs(newz) : newz;
}

// Compute the distance from `pos` to the bulb.
vec3 DE1(vec3 pos) {
	vec3 z=pos;
	float r = length(z);
	float dr=1.0;
	int i=0;

	if (preabsx)
        z.x = abs(z.x);
	if (preabsy)
        z.y = abs(z.y);
	if (preabsz)
        z.z = abs(z.z);

	while(r<Bailout && (i<Iterations)) {
		BuffaloIteration(z,r,dr);
		z+=(Julia ? JuliaC : pos);
		r=length(z);
		z*=rot;
		if (i<ColorIterations) orbitTrap = min(orbitTrap, abs(vec4(z.x,z.y,z.z,r*r)));
		i++;
	}

	return z;
}

float DE(vec3 p) {
	vec3 z=p;
   if(UseDeltaDE){
   // Author: Krzysztof Marczak (buddhi1980@gmail.com) from  MandelbulberV2
	float deltavalue = max(length(z) * 0.000001, DEScale * 0.1);
	vec3 deltaX = vec3 (deltavalue, 0.0, 0.0);
	vec3 deltaY = vec3 (0.0, deltavalue, 0.0);
	vec3 deltaZ = vec3 (0.0, 0.0, deltavalue);

	vec3 zCenter = DE1(z);
	float r = length(zCenter);

	vec3 d;
	vec3 zx1 = DE1(z + deltaX);
	vec3 zx2 = DE1(z - deltaX);
	d.x = min(abs(length(zx1) - r), abs(length(zx2) - r)) / deltavalue;

	vec3 zy1 = DE1(z + deltaY);
	vec3 zy2 = DE1(z - deltaY);
	d.y = min(abs(length(zy1) - r), abs(length(zy2) - r)) / deltavalue;

	vec3 zz1 = DE1(z + deltaZ);
	vec3 zz2 = DE1(z - deltaZ);
	d.z = min(abs(length(zz1) - r), abs(length(zz2) - r)) / deltavalue;
	
	float dr = length(d);
	
	return 0.5 * r * log(r)/dr;  //logarythmic DeltaDE
	//return 0.5 * r/dr; //linear DeltaDE
   }

	float r = length(z);
	float dr=1.0;
	int i=0;

	if (preabsx)
        z.x = abs(z.x);
	if (preabsy)
        z.y = abs(z.y);
	if (preabsz)
        z.z = abs(z.z);

	while(r<Bailout && (i<Iterations)) {
		BuffaloIteration(z,r,dr);
		z+=(Julia ? JuliaC : p);
		r=length(z);
		z*=rot;
		if (i<ColorIterations) orbitTrap = min(orbitTrap, abs(vec4(z.x,z.y,z.z,r*r)));
		i++;
	}

	return 0.5*log(r)*r/dr;
	/*
	Use this code for some nice intersections (Power=2)
	float a =  max(0.5*log(r)*r/dr, abs(pos.y));
	float b = 1000;
	if (pos.y>0)  b = 0.5*log(r)*r/dr;
	return min(min(a, b),
		max(0.5*log(r)*r/dr, abs(pos.z)));
	*/

}


#preset Default
FOV = 0.62536
Eye = 2.696639,-0.8161848,0.2129048
Target = -5.818878,1.564758,-0.3750964
Up = 0.0639562,-0.017249,-0.9960679
EquiRectangular = false
AutoFocus = false
FocalPlane = 1
Aperture = 0
Gamma = 1
ToneMapping = 3
Exposure = 1
Brightness = 1
Contrast = 1
Saturation = 1
GaussianWeight = 1
AntiAliasScale = 2
DepthToAlpha = false
ShowDepth = false
DepthMagnitude = 1
Detail = -3
DetailAO = -1.5
FudgeFactor = 0.5
MaxDistance = 4
MaxRaySteps = 300
Dither = 0.5
NormalBackStep = 1
AO = 0,0,0,0.9232996
Specular = 0.4105409
SpecularExp = 9.475219
SpecularMax = 8.211144
SpotLight = 1,1,1,1
SpotLightDir = 0.5114943,0.1436782
CamLight = 1,1,1,1
CamLightMin = 0
Glow = 1,1,1,0.5
GlowMax = 52
Fog = 0.2376502
HardShadow = 0.512931 NotLocked
ShadowSoft = 0.6628242
QualityShadows = false
Reflection = 0 NotLocked
DebugSun = false
BaseColor = 1,1,1
OrbitStrength = 0.14286
X = 1,1,1,1
Y = 0.345098,0.666667,0,0.02912
Z = 1,0.666667,0,1
R = 0.0784314,1,0.941176,-0.0194
BackgroundColor = 0.607843,0.866667,0.560784
GradientBackground = 0.3261
CycleColors = false
Cycles = 4.04901
EnableFloor = false
FloorNormal = 0,0,0
FloorHeight = 0
FloorColor = 1,1,1
Iterations = 20
ColorIterations = 8
Power = 2
Bailout = 2
RotVector = 1,1,1
RotAngle = 0
Julia = true
JuliaC = 0.3695652,-0.3423913,-0.423913
preabsx = false
preabsy = false
preabsz = false
absx = false
absy = true
absz = true
UseDeltaDE = false
DEScale = 0.01
#endpreset

#preset Details
FOV = 0.62536
Eye = 1.326251,-0.5076888,0.1096753
Target = -7.291693,1.295265,-0.8948426
Up = 0.1072364,-0.0399404,-0.9916876
EquiRectangular = false
Gamma = 1
ToneMapping = 3
Exposure = 1
Brightness = 1
Contrast = 1
Saturation = 1
GaussianWeight = 1
AntiAliasScale = 2
DepthToAlpha = false
ShowDepth = false
DepthMagnitude = 1
Detail = -2.5
FudgeFactor = 1
NormalBackStep = 1
CamLight = 1,1,1,1
BaseColor = 1,1,1
OrbitStrength = 0.14286
X = 1,1,1,1
Y = 0.345098,0.666667,0,0.02912
Z = 1,0.666667,0,1
R = 0.0784314,1,0.941176,-0.0194
BackgroundColor = 0.607843,0.866667,0.560784
GradientBackground = 0.3261
CycleColors = false
Cycles = 4.04901
EnableFloor = false
FloorNormal = 0,0,0
FloorHeight = 0
FloorColor = 1,1,1
AutoFocus = false
FocalPlane = 1
Aperture = 0
DetailAO = -1.5
MaxDistance = 4
MaxRaySteps = 1005
Dither = 0.5
AO = 0,0,0,0.9232996
Specular = 0.4105409
SpecularExp = 9.475219
SpecularMax = 8.211144
SpotLight = 1,1,1,1
SpotLightDir = 0.5114943,0.1436782
CamLightMin = 0
Glow = 1,1,1,0.5
GlowMax = 52
Fog = 0.2376502
HardShadow = 0.512931 NotLocked
ShadowSoft = 0.6628242
QualityShadows = false
Reflection = 0 NotLocked
DebugSun = false
UseDeltaDE = true
Iterations = 20
ColorIterations = 8
Power = 2
Bailout = 2
RotVector = 1,1,1
RotAngle = 0
Julia = true
JuliaC = 0.3695652,-0.3423913,-0.423913
preabsx = false
preabsy = false
preabsz = false
absx = false
absy = true
absz = true
DEScale = 0.0037828
#endpreset
