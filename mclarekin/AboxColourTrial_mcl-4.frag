// Output generated from file: D:/fragmentarium_old/AboxColourTrial_mclarekinA.frag
// Created: Thu Sep 21 13:29:25 2017
#info ABOX_palette_trials
// Abox made from examples/historical/mandelbox.frag (& other frags)
// Some color controls from Mandelbulber dev V2.12
/* There are 6 color inputs, these are placed along a palette
 starting at dist = 0, at the distances selected. 
The maths uses a "s" shaped cosine curve to transistion the RGB between
these colors. THIS PART SHOULD BE DONE WITH A LOOK-UP TABLE!

The color of the point is determined by one or more controls.

The color for the point is either the color at termination or the minimum
value recorded during the iteration if minValueMode is enabled.

ToolXYZ allows final global color changing and ToolW controls black to grey. 
On the original Coloring tab, set both OrbitStrength and NewColor sliders 
to 1 to enable only the new color controls.

Setting of the components will vary greatly depending on  the fractals
and whether minValueMode is enabled. 
Components can be pos or neg.

Current slider settings are just a guess for an Abox fractal

These are just a few of the coloring components that can be coded.
mclarekin 21-09-2017
*/
#define providesInit
//#include "DE-Raytracer.frag"
#include "MathUtils.frag"
#include "DE-RaytracerColour.frag"
#group Abox

/*
The distance estimator below was originalled devised by Buddhi.
See this thread for more info: http://www.fractalforums.com/3d-fractal-generation/a-mandelbox-distance-estimate-formula/15/
*/

// Number of fractal iterations.
uniform int Iterations;  slider[0,60,300]
uniform float Bailout;  slider[0,100,1000]

uniform vec3 tgladLimit; slider[(-5.0,-5.0,-5.0),(1.0,1.0,1.0),(5.0,5.0,5.0)]
uniform bool ZYXswap;  checkbox[false]
uniform vec3 reverseOffset; slider[(-5.0,-5.0,-5.0),(0.0,0.0,0.0),(5.0,5.0,5.0)]

//standard controls
uniform float MinR2;  slider[0,0.25,2.0]
uniform float MaxR2;  slider[0,1.0,2.0]
float MxMnR2 = MaxR2/MinR2;
uniform int StartStandard;  slider[0,0,100]
uniform int StopStandard;  slider[0,100,100]

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

#group new color
// Background color
uniform bool minValueMode; checkbox[true]
uniform vec3 scaleColorBase; slider[(-1.0,-1.0,-1.0),(1.0,1.0,1.0),(2.0,2.0,2.0)]

uniform int ColorIterations; slider[0,10,300]

uniform bool Radius; checkbox[false]
uniform bool divideRadiusDE;  checkbox[false]
uniform float scaleRadius; slider[-10.0,1.0,10.0]

uniform bool DotP3;  checkbox[false]
uniform float scaleDot; slider[-10.0,1.0,10.0]

uniform bool DotC3; checkbox[false]
uniform float scaleDotC3; slider[-10.0,1.0,10.0]

uniform bool SphereBias; checkbox[false]
uniform bool noSphAbs; checkbox[false]
uniform bool sphereDiff2Min; checkbox[false]
uniform bool sphereDiff2Max; checkbox[false]
uniform float sphereR2; slider[0.0,1.0,5.0]
uniform float scaleSphere; slider[-10.0,1.0,5.0]

uniform bool DistEst; checkbox[false]
uniform bool divideIde; checkbox[false]
uniform bool divideIIde; checkbox[false]
uniform float scaleDistEst; slider[-10.0,1.0,10.0]

uniform bool MaximumAxis; checkbox[false]
uniform float scaleMaximumAxis; slider[-10.0,1.0,10.0]

uniform bool MinimumAxis; checkbox[false]
uniform float scaleMinimumAxis; slider[-10.0,1.0,10.0]

uniform bool BoxTrap; checkbox[false]
uniform bool noBoxTrapAbs; checkbox[false]
uniform float scaleBoxTrap; slider[-10.0,1.0,10.0]
uniform vec3 limitsBox; slider[(-5.0,-5.0,-5.0),(1.0,1.0,1.0),(5.0,5.0,5.0)]

uniform bool XYZbias; checkbox[false]
uniform bool noXYZbiasAbsX; checkbox[false]
uniform bool noXYZbiasAbsY; checkbox[false]
uniform bool noXYZbiasAbsZ; checkbox[false]
uniform vec3 scaleXYZbias; slider[(-5.0,-5.0,-5.0),(1.0,1.0,1.0),(5.0,5.0,5.0)]

uniform bool BiasXY_YZ_ZX; checkbox[false]
uniform bool noBiasAbs; checkbox[false]
uniform vec3 scaleBias; slider[(-5.0,-5.0,-5.0),(1.0,1.0,1.0),(5.0,5.0,5.0)]

// global controls
uniform bool cosCurve; checkbox[false]
uniform float scaleCosCurve; slider[-10.0,1.0,10.0]
uniform bool divideI; checkbox[false]
uniform float scaleDivideI; slider[-10.0,1.0,10.0]
uniform bool addI; checkbox[false]
uniform float scaleAddI; slider[-10.0,1.0,10.0]
uniform bool divideDE; checkbox[false]
uniform float scaleDivideDE; slider[-10.0,1.0,10.0]

// palette controls
uniform float scaleColorValue; slider[0.0,1.0,20.0]
uniform vec3 ColorBase; color[1,1,1]
uniform float ColDist1; slider[0.0,0.0,100.0]
uniform vec3 Color1; color[1.0,0.5,0.0]
uniform float ColDist2; slider[0.0,5.0,100.0]
uniform vec3 Color2; color[0.2,0.8,1.0]
uniform float ColDist3; slider[0.0,10.0,100.0]
uniform vec3 Color3; color[0.1,1.0,0.1]
uniform float ColDist4; slider[0.0,15.0,100.0]
uniform vec3 Color4; color[0.7,0.2,0.2]
uniform float ColDist5; slider[0.0,20.0,100.0]
uniform vec3 Color5; color[0.1,0.3,0.9]



// final controls
uniform vec3 ToolXYZ; slider[(-1.0,-1.0,-1.0),(1.0,1.0,1.0),(1.0,1.0,1.0)]
uniform float ToolW; slider[0.0,1.0,20.0]

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

		//  = abs(c3);
		p3 +=  cJulia + c3;

		 // new color .................................
		vec3 Part = vec3(0.0,0.0,0.0);
		vec3 tempP3 = p3;
		vec3 absP3 = abs(p3);
		float RR =  dot(p3,p3);
		float ColorValue = 0.0;


		if (Radius) {
			float Rad = length(p3);
			if (divideRadiusDE) Rad /= Dd;
			ColorValue += Rad * 0.01 * scaleRadius;}

		if (DotP3) {
			ColorValue += RR * 0.01 * scaleDot;}

		if (DotC3) {
			float dotC = dot(c3,c3);
			ColorValue += dotC * .01 *scaleDotC3;}

		if (SphereBias) {
			float Diff = sphereR2 - RR;
			float DiffA = abs(Diff);
			if ( noSphAbs) DiffA = Diff;
			if ( sphereDiff2Min && sphereR2 < r2 ) DiffA *= Diff;
			if ( sphereDiff2Max && sphereR2 > r2 ) DiffA *= Diff;
			ColorValue -= DiffA * scaleSphere * 0.01;}

		if (DistEst) {
			float disEs = Dd;
			if (divideIde) disEs /= (i + 1.0);
			if (divideIIde) disEs /= (i*i + 1.0);
			ColorValue += disEs * .01 *scaleDistEst;}

		if(MaximumAxis) {
			float MaxA = max(max(absP3.x,absP3.y),absP3.z);
			ColorValue += MaxA * 0.01 *scaleMaximumAxis;}

		if(MinimumAxis) {
			float MinA = min(min(absP3.x,absP3.y),absP3.z);
			ColorValue += MinA * 0.01 *scaleMinimumAxis;}

		if(BoxTrap) {
			vec3 box = limitsBox;
			vec3 tempB = absP3;
			if (noBoxTrapAbs) tempB = p3;
			tempB = box - tempB;
			float tempMax = max(max(tempB.x, tempB.y), tempB.z);
			//float tempMin = min(min(tempB.x, tempB.y), tempB.z);
			//temp36 = temp36 + temp37 * fractal->transformCommon.offsetB0;
			ColorValue += tempMax * 0.1 * scaleBoxTrap;}

		if(XYZbias) {
			vec3 tempC = p3;
			if(noXYZbiasAbsX) {	tempC.x *= p3.x; }
			else	{ 	tempC.x = absP3.x; }

			if(noXYZbiasAbsY) {	tempC.y *= p3.y; }
			else	{ 	tempC.y = absP3.y; }

			if(noXYZbiasAbsZ) {	tempC.z *= p3.z; }
			else	{	tempC.z = absP3.z; }

			tempC *= scaleXYZbias * 0.01;
			ColorValue += tempC.x + tempC.y + tempC.z;}

			// bias deform based on original point
		if (BiasXY_YZ_ZX) {	
			vec3 C3A = abs(c3);
			if (noBiasAbs) C3A = c3;
			tempP3.x += C3A.x * C3A.y;
			tempP3.y += C3A.y * C3A.z;
			tempP3.z += C3A.z * C3A.x;
			tempP3 *= scaleBias;
			ColorValue += tempP3.x + tempP3.y + tempP3.z;}


 		// global controls
		if (cosCurve) ColorValue = (0.5+(0.5*cos(ColorValue))) * scaleCosCurve;
		if (divideI) ColorValue *= 100 * scaleDivideI /(( i * i + 1.0) );
		if (addI) ColorValue += i * scaleAddI;
		if (divideDE) ColorValue *= 100 * scaleDivideDE/Dd;

		ColorValue *= scaleColorValue;
		Part = ColorBase;
		/*if( ColorValue < ColDist1 )
		{ 
			vec3 ColorDiff = Color1-ColorBase;
			float ColorValueDiff = ColorValue;
			ColorValueDiff =  0.5 - cos(ColorValueDiff*3.148) * 0.5;
			Part = ColorBase + ColorValueDiff*ColorDiff;
		}
		if( ColorValue < ColDist2 && ColorValue >= ColDist1)
		{ 
			vec3 ColorDiff = Color2-Color1;
			float ColorValueDiff = ColorValue-ColDist1;
			ColorValueDiff =  0.5 - cos(ColorValueDiff*3.148) * 0.5;
			Part = Color1 + ColorValueDiff*ColorDiff;
		}
		if(ColorValue < ColDist3 && ColorValue >= ColDist2)
		{ 
			vec3 ColorDiff = Color3-Color2;
			float ColorValueDiff = ColorValue-ColDist2;
			ColorValueDiff =  0.5 - cos(ColorValueDiff*3.148) * 0.5;
			Part = Color2 + ColorValueDiff*ColorDiff;
		}
		if(ColorValue < ColDist4 && ColorValue >= ColDist3)
		{ 
			vec3 ColorDiff = Color4-Color3;
			float ColorValueDiff = ColorValue-ColDist3;
			ColorValueDiff =  0.5 - cos(ColorValueDiff*3.148) * 0.5;
			Part = Color3 + ColorValueDiff*ColorDiff;
		}
		if(ColorValue < ColDist5 && ColorValue >= ColDist4)
		{ 
			vec3 ColorDiff = Color5-Color4;
			float ColorValueDiff = ColorValue-ColDist4;
			ColorValueDiff =  0.5 - cos(ColorValueDiff*3.148) * 0.5;
			Part = Color4 + ColorValueDiff*ColorDiff;
		}*/
		if( ColorValue < ColDist1 )
		{ 
			vec3 ColorDiff = Color1-ColorBase;
			float ColorValueDiff = ColorValue;
			ColorValueDiff /= ColDist1;
			Part = ColorBase + ColorValueDiff*ColorDiff;
		}
		if( ColorValue < ColDist2 && ColorValue >= ColDist1)
		{ 
			vec3 ColorDiff = Color2-Color1;
			float ColorValueDiff = ColorValue-ColDist1;
			ColorValueDiff /= ColDist2 - ColDist1;
			Part = Color1 + ColorValueDiff*ColorDiff;
		}
		if(ColorValue < ColDist3 && ColorValue >= ColDist2)
		{ 
			vec3 ColorDiff = Color3-Color2;
			float ColorValueDiff = ColorValue-ColDist2;
			ColorValueDiff /= ColDist3 - ColDist2;
			Part = Color2 + ColorValueDiff*ColorDiff;
		}
		if(ColorValue < ColDist4 && ColorValue >= ColDist3)
		{ 
			vec3 ColorDiff = Color4-Color3;
			float ColorValueDiff = ColorValue-ColDist3;
			ColorValueDiff /= ColDist4 - ColDist3;
			Part = Color3 + ColorValueDiff*ColorDiff;
		}
		if(ColorValue < ColDist5 && ColorValue >= ColDist4)
		{ 
			vec3 ColorDiff = Color5-Color4;
			float ColorValueDiff = ColorValue-ColDist4;
			ColorValueDiff /= ColDist5 - ColDist4;
			Part = Color4 + ColorValueDiff*ColorDiff;
		}


		// original color
		if (i<ColorIterations) orbitTrap = min(orbitTrap, abs(vec4(p3.x,p3.y,p3.z,r2)));

		// new color
		float PartW = ToolW * 0.1;	
		Part *= ToolXYZ;	
		if (minValueMode)
			{if (i<ColorIterations) orbitTrap2 = min(orbitTrap2, abs(vec4(Part,PartW )));}
		else
			{if (i<ColorIterations) orbitTrap2 = vec4(Part,PartW ); }


	//r2 = dot(p3, p3);
	 // can remove & bailout using the r2 after tglad fold. Smoothes the shape?
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
Eye = 9.836527,-11.13478,9.812807
Target = -5.521271,3.927282,-2.92581
Up = 0.7795659,0.3635163,-0.5100323
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
DepthToAlpha = false
ShowDepth = false
DepthMagnitude = 1
Detail = -3.014235
DetailAO = -1.35716
FudgeFactor = 0.9473684
MaxDistance = 1000
MaxRaySteps = 164
Dither = 0.51754 Locked
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
QualityShadows = false
Reflection = 0
DebugSun = false
BaseColor = 1,1,1
OrbitStrength = 1
NewColor = 1
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
Iterations = 60
Bailout = 100
tgladLimit = 1,1,1
ZYXswap = false
reverseOffset = 0,0,0
MinR2 = 0.25
MaxR2 = 1
StartStandard = 0
StopStandard = 100
c3Mul = 1,1,1
cJulia = 0,0,0
RotVector = 1,1,1
RotAngle = 0
Scale = 2
varyScale = 0
varyOffset = 1
StartVary = 0
StopVary = 60
mode1 = false
minValueMode = true
scaleColorBase = 1,1,1
ColorIterations = 91
Radius = false
divideRadiusDE = false
scaleRadius = 1.013216
DotP3 = true
scaleDot = 0.7053942
DotC3 = false
scaleDotC3 = 2.212389
SphereBias = false
noSphAbs = false
sphereDiff2Min = false
sphereDiff2Max = false
sphereR2 = 1.356275
scaleSphere = 0.5479452
DistEst = false
divideIde = false
divideIIde = false
scaleDistEst = 0.0440529
MaximumAxis = false
scaleMaximumAxis = 2.747253
MinimumAxis = false
scaleMinimumAxis = 3.315789
BoxTrap = false
noBoxTrapAbs = false
scaleBoxTrap = 1
limitsBox = 1,1,1
XYZbias = false
noXYZbiasAbsX = false
noXYZbiasAbsY = false
noXYZbiasAbsZ = false
scaleXYZbias = 5,1.126126,2.792793
BiasXY_YZ_ZX = false
noBiasAbs = false
scaleBias = 0.8196721,0.4098361,0.2868852
cosCurve = false
scaleCosCurve = 6.504854
divideI = false
scaleDivideI = 0.9009009
addI = false
scaleAddI = 0.3418804
divideDE = false
scaleDivideDE = 1
scaleColorValue = 1
ColorBase = 0,0,0
ColDist1 = 0.1
Color1 = 0.3058824,0.945098,1
ColDist2 = 9.543569
Color2 = 0.7764706,0.03529412,0.172549
ColDist3 = 12.03319
Color3 = 0.9607843,0.854902,0.05098039
ColDist4 = 11.61826
Color4 = 1,1,1
ColDist5 = 100
Color5 = 0.01568627,0.4078431,0.02745098
ToolXYZ = 1,1,1
ToolW = 10.27237
#endpreset

