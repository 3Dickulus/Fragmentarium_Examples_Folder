// Output generated from file: D:/fragmentarium/AboxMinR2BiasCuboid55.frag
// Created: Tue Aug 8 05:18:26 2017
#info ABOX_MINR2_CUBOID_XYZBIAS
// Abox made from examples/historical/mandelbox.frag (& other frags)
// Tweaks coded by mclarekin from Mandelbulber V2.12

#define providesInit
#include "MathUtils.frag"
#include "DE-Raytracer.frag"
#group AboxMinR2CuboidXYZBias

/*
The distance estimator below was originalled devised by Buddhi.
See this thread for more info: http://www.fractalforums.com/3d-fractal-generation/a-mandelbox-distance-estimate-formula/15/
*/

// Number of fractal iterations.
uniform int Iterations;  slider[0,60,300]
uniform float Bailout;  slider[0,100,1000]
uniform int ColorIterations;  slider[0,3,300]
uniform vec3 tgladLimit; slider[(-5.0,-5.0,-5.0),(1.0,1.0,1.0),(5.0,5.0,5.0)]
uniform bool ZYXswap;  checkbox[false]
uniform vec3 reverseOffset; slider[(-5.0,-5.0,-5.0),(0.0,0.0,0.0),(5.0,5.0,5.0)]

//standard controls
uniform float MinR2;  slider[0,0.25,2.0]
uniform float MaxR2;  slider[0,1.0,2.0]
float MxMnR2 = MaxR2/MinR2;
uniform int StartStandard;  slider[0,0,100]
uniform int StopStandard;  slider[0,100,100]

// cuboid controls
uniform bool useCuboid;  checkbox[false]
uniform bool CuboidZ2mode;  checkbox[false]
uniform int StartCuboid;  slider[0,0,100]
uniform int StopCuboid;  slider[0,60,100]
uniform vec3 limitMinR2; slider[(0.0,0.0,0.0),(0.2,0.2,0.2),(3.0,3.0,3.0)]

// XYZbias controls
uniform bool useXYZbias;  checkbox[false]
uniform bool maxR2LimitMode;  checkbox[false]
uniform int StartXYZbias;  slider[0,0,100]
uniform int StopXYZbias;  slider[0,60,100]
uniform vec3 biasScale; slider[(-5.0,-5.0,-5.0),(0.0,0.0,0.0),(5.0,5.0,5.0)]

// addition constants
uniform vec3 c3Mul; slider[(-5.0,-5.0,-5.0),(1.0,1.0,1.0),(5.0,5.0,5.0)]
uniform vec3 cJulia; slider[(-5.0,-5.0,-5.0),(0.0,0.0,0.0),(5.0,5.0,5.0)]

// rotation controls
uniform vec3 RotVector; slider[(0,0,0),(1,1,1),(1,1,1)] 
uniform float RotAngle; slider[0.00,0,180]

// scale controls
uniform float Scale;  slider[-5.0,2.0,5.0]
uniform float varyScale; slider[-1.0,0.0,1.0] 
uniform float varyOffset; slider[-1.0,1.0,1.0] 
uniform int StartVary;  slider[0,0,100]
uniform int StopVary;  slider[0,60,100]

uniform bool mode1;  checkbox[false]
float r2;
int i = 0;
mat3 rot;
float Dd;
float compound = 0.0;
float useScale = 0.0;
float vary = 0.0;
//vec3 initialPoint;
void init() {
	 rot = rotationMatrix3(normalize(RotVector), RotAngle);
}


void standardMode(inout vec3 p3,int i, inout float Dd)
{
	if (i >= StartStandard && i < StopStandard)
	{
		float minR2 = MinR2;
		r2 = dot(p3,p3);
		p3 += reverseOffset;	
		if (r2 < minR2)
		{
			float tglad_factor1 = MaxR2 / minR2;
			p3 *= tglad_factor1;
			Dd = Dd * tglad_factor1 + 1.0;
		}
		else if (r2 < MaxR2)
		{
			float tglad_factor2 = MaxR2 / r2;
			p3 *= tglad_factor2;
			Dd = Dd * tglad_factor2 + 1.0;
		}
		p3 -= reverseOffset;
	}
}

void cuboidMode(inout vec3 p3, int i, inout float Dd)
{
	if (i >= StartCuboid && i < StopCuboid)
	{
		vec3 temp3;
		vec3 R2;
		float minR2 = MinR2;
		float m = 1.0;

		r2 = dot(p3,p3);
		p3 += reverseOffset;
		if (CuboidZ2mode) {temp3 = p3 * p3;}
		else	temp3 = abs(p3);

		if (temp3.x < limitMinR2.x && temp3.y < limitMinR2.y && temp3.z < limitMinR2.z)
		{ // if inside cuboid
			R2.x = limitMinR2.x / temp3.x;
			R2.y = limitMinR2.y / temp3.y;
			R2.z = limitMinR2.z / temp3.z;
			float First = min(R2.x, min(R2.y, R2.z));
			minR2 = r2 * First;

			if (minR2 > MaxR2)
			{ // stop overlapping potential
				minR2 = MaxR2;
			}
			m *= MaxR2 / minR2;				
		}
		else if (r2 < MaxR2)
		{
			m *= MaxR2 / r2;		
		}
		p3 = p3 * m;
		Dd = Dd * abs(m) + 1.0;
		p3 -= reverseOffset;
	}
}

void XYZbiasMode(inout vec3 p3, vec3 c3, int i, inout float Dd)
{
	if (i >= StartXYZbias && i < StopXYZbias)
	{
		float minR2 = MinR2;

		vec3 xyzBias = biasScale;
		xyzBias *= abs(c3) / 10.0;
		minR2 = minR2 + (xyzBias.x + xyzBias.y + xyzBias.z);

		if (maxR2LimitMode && minR2 > MaxR2)
		{ 
				minR2 = MaxR2; // stop overlapping potential
		}

		r2 = dot(p3,p3);
		p3 += reverseOffset;
			if (r2 < minR2)
			{
				float tglad_factor1 = MaxR2 / minR2;
				p3 *= tglad_factor1;
				Dd = Dd * tglad_factor1 + 1.0;
			}
			else if (r2 < MaxR2)
			{
				float tglad_factor2 = MaxR2 / r2;
				p3 *= tglad_factor2;
				Dd = Dd * tglad_factor2;
			}
			p3 -= reverseOffset;
		}
	}

float DE(vec3 pos)
{
	vec3 p3 = pos;
	//vec3 initialPoint = pos;
	vec3 c3 = pos * c3Mul;	
	Dd = 1.0;	

	for (int i=0; i<Iterations; i++)
	{
		p3 = abs(p3 + tgladLimit) - abs(p3 - tgladLimit) - p3;
		if (ZYXswap) p3 = vec3(p3.z, p3.y, p3.x);

		r2 = dot(p3,p3);
		if (useCuboid) 
		{
			cuboidMode(p3,i,Dd);
		}

		if (useXYZbias) 
		{
			XYZbiasMode(p3,c3,i,Dd);
		}
		else 
		{
			standardMode(p3,i,Dd);
		}


		p3 *=rot;

		float useScale =  Scale + compound;	
		p3 *= useScale;
		Dd = Dd * abs(useScale) + 1.0;

		// update compound for next iteration
		if (i >=  StartVary	&& i <  StopVary)
		{
			vary = varyScale * (abs(compound) - varyOffset);
			if (mode1)
			{ compound = -vary;}
			else {compound = compound - vary;}
		}


		p3 +=  cJulia + c3;

		if (i<ColorIterations) orbitTrap = min(orbitTrap, abs(vec4(p3,r2)));

		//r2 = dot(p3, p3);
	 // can remove & bailout using the r2 after tglad fold. Smooths the shape?

	   if ( r2>Bailout)		
		{
		float r = length(p3);
		return r / abs(Dd);
		break;
		}
	}
}











#preset Default
FOV = 0.62536
Eye = 1.498485,-2.030095,-1.846831
Target = -4.316285,6.469949,10.39807
Up = 0.9310666,0.2355314,0.2786391
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
Detail = -2.84956
DetailAO = -1.35716
FudgeFactor = 0.8527132
Dither = 0.51754
NormalBackStep = 1
AO = 0,0,0,0.85185
Specular = 1
SpecularExp = 16.364
SpecularMax = 10
SpotLight = 1,1,1,1
SpotLightDir = 0.63626,0.5
CamLight = 1,1,1,1.53846
CamLightMin = 0.12121
Glow = 1,1,1,0.43836
GlowMax = 52
Fog = 0
HardShadow = 0.35385
ShadowSoft = 12.5806
Reflection = 0
DebugSun = false
BaseColor = 1,1,1
OrbitStrength = 0.6309524
X = 1,0.5294118,0.6156863,0.0985915
Y = 0.3411765,0.2980392,0.6666667,0.1087719
Z = 0.7098039,0.7098039,0.7098039,0.5929825
R = 0.6980392,0.7764706,0.3058824,0.1971831
BackgroundColor = 0.9529412,0.9529412,0.9529412
GradientBackground = 0.3261
CycleColors = false
Cycles = 4.04901
EnableFloor = false
FloorNormal = 0,0,0
FloorHeight = 0
FloorColor = 1,1,1
MaxRaySteps = 164
Iterations = 60
Bailout = 90
ColorIterations = 8
tgladLimit = 1,1,1e-05
ZYXswap = true
reverseOffset = 0,0,0
MinR2 = 0.1
MaxR2 = 1
StartStandard = 0
StopStandard = 100
useCuboid = true
CuboidZ2mode = false
StartCuboid = 0
StopCuboid = 6
limitMinR2 = 0.2,0.2,0.2
useXYZbias = true
maxR2LimitMode = false
StartXYZbias = 0
StopXYZbias = 5
biasScale = -0.5731225,0.4545455,0.3
c3Mul = 1,1,1
cJulia = 0,0,0
RotVector = 1,1,1
RotAngle = 3.728745
Scale = -1.231884
varyScale = -0.0238095
varyOffset = 0.5261044
StartVary = 0
StopVary = 70
mode1 = false
#endpreset

