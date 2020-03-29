// Output generated from file: C:/Users/graeme/Downloads/Fragmentarium-2.5.0-181027-winex/Fragmentarium-2.5.0-181027.winex/Examples/mclarekin/mengerVaryScale2.frag
// Created: Sat Feb 23 22:15:06 2019
// Output generated from file: C:/D/Fractals/Fragmentarium2.5.0/Fragmentarium-2.5.0-190217-winex/Examples/Kaleidoscopic IFS/Menger.frag

#info Menger Distance Estimator.
#define providesInit
#include "MathUtils.frag"
#include "DE-Raytracer.frag"
#group Menger
// Based on Knighty's Kaleidoscopic IFS 3D Fractals, described here:
// http://www.fractalforums.com/3d-fractal-generation/kaleidoscopic-%28escape-time-ifs%29/
// rearranged
// added two similar types of variable scale
// placed an additional 3 angle rotation before the offset
//   mclarekin 23-02-19

// Pre_Rotation
uniform vec3 RotVector; slider[(0,0,0),(1,1,1),(1,1,1)]
uniform float RotAngle; slider[0.00,0,180]

// Scale parameter. A perfect Menger is 3.0
uniform float Scale; slider[0.00,3.0,4.00]
uniform float scaleVary; slider[-2.00,0.0,2.00]
uniform float scaleOffset; slider[-2.00,0.0,2.00]
uniform bool varyMode2; checkbox[false]

// 3 angle rotation
uniform vec3 Rotation; slider[(-180,-180,-180),(0,0,0),(180,180,180)]

// Scaling center
uniform vec3 Offset; slider[(0,0,0),(1,1,1),(5,5,5)]

mat3 rotA;
mat3 rotB;
void init() {

	rotA = rotationMatrix3(normalize(RotVector), RotAngle);
	rotB = rotationMatrixXYZ(Rotation);
}

// Number of fractal iterations.
uniform int Iterations;  slider[0,8,100]
uniform int ColorIterations;  slider[0,8,100]
uniform float Bailout;  slider[0,20,100]
uniform float DEtweak;  slider[0,2,5]

float DE(vec3 z)
{
	int i = 0;
	float useScale = 1.0;
	float addScale = 0.0;
	float Dd = 1.0;
	float rr = dot(z,z);

	while(rr<Bailout && (i<Iterations))  {
		// pre-rotation
		z = rotA *z;

		// MENGER SPONGE
		// menger sponge abs and swizzle
		z = abs(z);
		if (z.x<z.y){ z.xy = z.yx;}
		if (z.x<z.z){ z.xz = z.zx;}
		if (z.y<z.z){ z.yz = z.zy;}

		// menger sponge scale
		useScale = addScale + Scale;
		z *= useScale;
		Dd = Dd * abs(useScale);

		// update addScale for next iteration
		float vary = scaleVary * (abs(addScale) - scaleOffset);
		if (varyMode2) 	addScale = -vary;
		else	addScale -= vary;

		// rotation inside menger sponge
		z = rotB *z;

 		// menger sponge conditional offset
		z -= Offset;
		if( z.z<-0.5*Offset.z)  z.z+=Offset.z;


		//orbitTrap color
		rr = dot(z,z);
		if (i<ColorIterations) orbitTrap = min(orbitTrap, (vec4(abs(z),rr)));
			
		i++;
	}

	return sqrt(rr) / (Dd + DEtweak);
}









#preset Default
FOV = 0.4
Eye = 0,0,-4.599996
Target = 0,0,5.399996
Up = 0,1,0
EquiRectangular = false
AutoFocus = false
FocalPlane = 1
Aperture = 0
Gamma = 2
ToneMapping = 4
Exposure = 1
Brightness = 1
Contrast = 1
Saturation = 1
GaussianWeight = 1
AntiAliasScale = 2
DepthToAlpha = false
ShowDepth = false
DepthMagnitude = 1
Detail = -2.3
DetailAO = -0.5
FudgeFactor = 1
MaxDistance = 1000
MaxRaySteps = 56
Dither = 0.5
NormalBackStep = 1
AO = 0,0,0,0.7
Specular = 0.4
SpecularExp = 16
SpecularMax = 10
SpotLight = 1,1,1,0.4
SpotLightDir = 0.1,0.1
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
BaseColor = 1,0.8666667,0.6980392
OrbitStrength = 0.6067416
X = 0.5,0.6,0.6,-0.1570248
Y = 1,0.6,0,0.3278689
Z = 0.8,0.78,1,0.5245902
R = 0.4,0.7,1,0.4876033
BackgroundColor = 0.6,0.6,0.45
GradientBackground = 0
CycleColors = false
Cycles = 1.1
EnableFloor = false
FloorNormal = 0,0,1
FloorHeight = 0
FloorColor = 1,1,1
RotVector = 1,1,1
RotAngle = 0
Scale = 2
scaleVary = -2
scaleOffset = 0.4489796
varyMode2 = true
Rotation = 0,0,0
Offset = 1,1,1
Iterations = 8
ColorIterations = 8
DEtweak = 2
Bailout = 100
#endpreset

