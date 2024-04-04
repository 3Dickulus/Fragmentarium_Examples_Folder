// Output generated from file: D:/fragmentarium/Abox InvCyl3.frag
// Created: Thu Mar 2 22:33:55 2017
#info ABOX_FOLD_TWEAK
// Abox made from examples/historical/mandelbox.frag (& other frags)
// Tweak from Mandelbulber V2.10
#define providesInit
#include "MathUtils.frag"
#include "DE-Raytracer.frag"
#group AboxFoldTweak

/*
The distance estimator below was originalled devised by Buddhi.
This optimized version was created by Rrrola (Jan Kadlec), http://rrrola.wz.cz/

See this thread for more info: http://www.fractalforums.com/3d-fractal-generation/a-mandelbox-distance-estimate-formula/15/
*/

// Number of fractal iterations.
uniform int Iterations;  slider[0,60,300]
uniform float Bailout;  slider[0,100,1000]
uniform int ColorIterations;  slider[0,3,300]

uniform vec3 limit; slider[(-5.0,-5.0,-5.0),(1.0,1.0,1.0),(5.0,5.0,5.0)]
uniform float MinRad2;  slider[0,0.25,2.0]
uniform float ScaleY;  slider[-5.0,1.0,5.0]
uniform float ScaleZ;  slider[-5.0,1.0,5.0]
uniform float ScaleInv;  slider[-5.0,1.0,5.0]
uniform float Scale;  slider[-5.0,2.0,5.0]
float SdmR2 = Scale/MinRad2;
uniform vec3 c3Mul; slider[(-5.0,-5.0,-5.0),(1.0,1.0,1.0),(5.0,5.0,5.0)]
uniform vec3 cJulia; slider[(-5.0,-5.0,-5.0),(0.0,0.0,0.0),(5.0,5.0,5.0)]
uniform int iterA;  slider[0,6,300]
uniform int iterB;  slider[0,300,300]


uniform vec3 RotVector; slider[(0,0,0),(1,1,1),(1,1,1)] 
uniform float RotAngle; slider[0.00,0,180]
mat3 rot;

void init() {
	 rot = rotationMatrix3(normalize(RotVector), RotAngle);
}
//float absScalem1 = abs(Scale - 1.0);
//float AbsScaleRaisedTo1mIters = pow(abs(Scale), float(1-Iterations));


float DE(vec3 pos)
{
	float Dd = 1.0;	
	vec3 p3 = pos;
	vec3 c3 = pos * c3Mul;	
	float r2;	

	for (int i=0; i<Iterations; i++)
 {
		p3 = abs(p3 + limit) - abs(p3 - limit) - p3;




		//if (i<ColorIterations) orbitTrap = min(orbitTrap, abs(vec4(p3,r2)));
		// spherical fold		
		r2 = dot(p3, p3); // radius squared

		p3 *= clamp(max(MinRad2/r2, MinRad2), 0.0, 1.0);  // dp3,div,max.sat,mul
		Dd *= clamp(max(MinRad2/r2, MinRad2), 0.0, 1.0);  // dp3,div,max.sat,mul

		p3 = (p3 * SdmR2);
		Dd = (Dd * abs(SdmR2)) +1.0;
		p3 *=rot;	
		p3 += cJulia + c3;
		if (i == iterA || i == iterB)

		{

			p3 = vec3(p3.x * cos(p3.y * ScaleY), p3.x * sin(p3.y * ScaleY), p3.z * ScaleZ) * ScaleInv;

			Dd = Dd * abs(ScaleInv);	
		}




		if (i<ColorIterations) orbitTrap = min(orbitTrap, abs(vec4(p3,r2)));

		//r2 = dot(p3, p3);
	 // can remove & bailout using the r2 after tglad fold. Smooths the shape?

	   if ( r2>Bailout)		
		{
		float r = length(p3);
		return r / Dd;
		break;
		}
	}
}


















#preset Default
FOV = 0.5
Eye = -1.568609,0.0135927,-0.0040032
Target = 14.9014,0.3789983,2.955099
Up = 0.1163255,0.1292958,-0.6634203
EquiRectangular = false
AutoFocus = false
FocalPlane = 1
Aperture = 0
Gamma = 2.08335
ToneMapping = 3
Exposure = 0.6522
Brightness = 1
Contrast = 1
Saturation = 1
GaussianWeight = 1
AntiAliasScale = 2
Detail = -2.35396
DetailAO = -0.28574
FudgeFactor = 0.8255814
Dither = 0.5
NormalBackStep = 1
AO = 0,0,0,0.7
Specular = 1
SpecularExp = 16
SpecularMax = 10
SpotLight = 1,1,1,0.4
SpotLightDir = -0.33334,0.1
CamLight = 1,1,1,1
CamLightMin = 0.4697
Glow = 1,1,1,0.17808
GlowMax = 52
Fog = 0
HardShadow = 0
ShadowSoft = 12.5806
Reflection = 0
DebugSun = false
BaseColor = 0.9333333,0.9607843,1
OrbitStrength = 0.734127
X = 0.5,0.6,0.6,0
Y = 1,0.6,0,0.4035088
Z = 0.8,0.78,1,0.0877193
R = 0.4,0.7,1,0.9225352
BackgroundColor = 0.596078,0.6,0.513725
GradientBackground = 0.3
CycleColors = false Locked
Cycles = 7.03846 Locked
EnableFloor = false
FloorNormal = 0,0,0
FloorHeight = 0
FloorColor = 1,1,1
MaxRaySteps = 105
Iterations = 100
Bailout = 100
ColorIterations = 3
limit = 1,1,1
MinRad2 = 0.25
ScaleY = 0.3159851
ScaleZ = 1
ScaleInv = 0.8
Scale = -1.5
c3Mul = 0.9,0.9,0.9
cJulia = -0.615942,0,0
iterA = 5
iterB = 6
RotVector = 1,1,1
RotAngle = 0
#endpreset

