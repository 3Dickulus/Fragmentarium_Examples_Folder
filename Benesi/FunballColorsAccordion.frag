#version 120
#info  Funball. Benesi.
#define providesInit
const float pi=2.*1.570796326794897;
const float pi2=2.*pi;

//#include "FeedBack.frag"
#include "MathUtils.frag"
//  Change the raytracer if you don't have this one!!!
// colors are set up for it though...
//#include "Fast-Raytracer-with-Textures.frag"
#include "Fast-Raytracer-with-Palette.frag"

float sr32=1.2247448713915890491;   
uniform float time;
 float dummy(vec3 p) {
p*=time;
return time;
} 
const float sr13=sqrt(1./3.);
const float sr23=sqrt (2./3.);



// Number of fractal iterations.
uniform int Iterations;  slider[0,5,100]

//uniform int ColorIterations;  slider[0,8,100]

uniform float lengthC; slider[0,10,30]
uniform float widthC;slider[-2,0,2]


//   NOTE:
//  going to add a polygon (not polyhedral!) to circle
// transform later, for application at some iteration/iterations
// it will hopefully... do neat stuff like it did in M3D
//  Benesi

//uniform int StellIter; slider[0,0,30]
//uniform float starangle;slider[-3.1416,0.0,3.1416]
//uniform float starangle2;slider[-3.1416,0.00,3.1416]

//set both sides to 3 for a tetra hedron, 4 for a cube, and that's it for the Platonics from this set
//uniform float sides;slider[2.0,6.0,15.0]
//uniform float sides2;slider[2.0,8.0,15.0]
/*
vec3 Stellate (inout vec3 z) {  
	
	float rCyz=abs(atan(z.z,z.y));  
	 float i=1.;
	while (rCyz>pi/sides && i<sides) {rCyz-=pi2/sides; i++;}
	rCyz=abs(rCyz);
		z.yz*=(cos(pi/sides*.5)*cos(rCyz-starangle))/cos(pi/(sides)*.5-starangle);
		float rCxyz;
		
	  rCxyz= abs(atan(sqrt(z.y*z.y+z.z*z.z),z.x));
		i=1.;
		while (rCxyz>pi/sides2 && i<sides2) {rCxyz-=pi2/sides2; i++;}
		rCxyz=abs(rCxyz);
		 z*=(cos(pi/sides2*.5)*cos(rCxyz-starangle2))/cos(pi/(sides2)*.5-starangle2);
		
 	rCyz= (z.y*z.y)/(z.z*z.z);

	if (rCyz<1.) {rCyz=sqrt(rCyz+1.);} else {rCyz=sqrt(1./rCyz+1.);}

		 rCxyz= (z.y*z.y+z.z*z.z)/(z.x*z.x);
		if (rCxyz<1.) {rCxyz=sqrt(rCxyz+1.);} else {rCxyz=sqrt(1./rCxyz+1.);}
		z*=rCxyz;  
	
	z.yz*=rCyz;  
	return(z);

}

*/


//uniform vec3 RotVector; slider[(-1,-1,-1),(1,1,1),(1,1,1)]
//uniform float RotAngle; slider[-360.00,0,360]

uniform float RotXYangle; slider[-360.00,0,360]
uniform int RotIter;slider[0,1,99]

//mat3 rot;
mat3 rotxy;
//mat3 rotinv;
void init() {
	rotxy = rotationMatrix3(vec3(0,0,1), RotXYangle);
	//rot = rotationMatrix3(normalize(RotVector), RotAngle);
	//rotinv= rotationMatrix3(normalize(RotVector), -RotAngle);
}


uniform int Splits1; slider[1,4,33]
uniform int splititer1; slider[0,1,20]

uniform int Splits2; slider[1,4,33]
uniform int splititer2; slider[0,1,20]

uniform int Splits3; slider[1,4,33]
uniform int splititer3; slider[0,1,20]

uniform int Splits4; slider[1,4,33]
uniform int splititer4; slider[0,1,20]

int spliti2=splititer1+splititer2;
int spliti3=spliti2+splititer3;
int spliti4=spliti3+splititer4;

//increase the limits if you want too.....
uniform float Splitrad1; slider[-20,1,80]
uniform float Splitrad2; slider[-20,1,80]
uniform float Splitrad3; slider[-20,1,80]
uniform float Splitrad4; slider[-20,1,80]

float splits=Splits1;
float splitrad=Splitrad1;


vec3 split(inout vec3 z,inout vec4 ot) {   //int split version!!!!!

	float ryz; 
	float ratrack=pi2-pi2/splits;
	float rotadjust=-pi/splits;  
	float pintrack=pi/splits;
	float pi2splits=pi2/splits;
	float  i=0.0;
	float omega=atan(z.z,z.y);
	if (omega<0.0) {omega+=pi2;}

	while (omega>pi2splits && i<floor(splits+1.0)) {
			i+=1.0;
			rotadjust+=ratrack;
			pintrack+=pi2splits;
			omega-=pi2splits;
			}
	
		 	z.y-=cos(pintrack)*splitrad;
			z.z-=sin(pintrack)*splitrad;
			 ot.xy=vec2(min(ot.x,z.y),min(ot.y,z.z));
			
		
		 	ryz=sqrt(z.y*z.y+z.z*z.z);
	 		omega=atan(z.z,z.y)+rotadjust;
			z.y=cos(omega)*ryz;
			z.z=sin(omega)*ryz;
			ot.zw=vec2(min(ot.z,z.y),min(ot.w,z.z));
	
	return z;
}

#group CarpetExtension

uniform float AccStart1y; slider[-20,-1,20]
uniform float AccCycle1y; slider[0.1,.6,10.]
uniform float AccEnd1y; slider[-50,-7,50]
uniform int AccIter1y; slider[0,0,20]
uniform float AccStartz; slider[-20,-1,20]
uniform float AccCyclez; slider[0.1,.6,10.]
uniform float AccEndz; slider[-50,-7,50]
uniform bool AccZBool; checkbox[false]
uniform float AccStart2y; slider[-20,-1,20]
uniform float AccCycle2y; slider[0.1,.6,10.]
uniform float AccEnd2y; slider[-50,-7,50]
uniform int AccIter2y; slider[0,0,20]
uniform float AccStart3y; slider[-20,-1,20]
uniform float AccCycle3y; slider[0.1,.6,10.]
uniform float AccEnd3y; slider[-50,-7,50]
uniform int AccIter3y; slider[0,0,20]

float AccStart;
float AccCycle;
float AccEnd;

float Accordion (inout float zx) {
		float cycle=abs(AccCycle);
		if (cycle<.06) {cycle=.06;}
		float i=0.0;						//why did he use a float here?  :p
		float cyclemod= mod(abs(AccEnd-AccStart),AccCycle);
		if ((cycle)>abs(AccEnd-AccStart)) {cycle=abs(AccEnd-AccStart);}
			
	if (AccEnd-AccStart<0.0) {
			cycle=-cycle;
			cyclemod=-cyclemod;
			
			if (zx>AccStart) {
				// do nothing
			}  else if (zx<(AccStart+cycle) && zx>(AccEnd-cyclemod)){
				zx=zx-AccStart;
				while (zx<(cycle) && i<3000.0) {
					zx-=cycle;i+=1.0;
				}
					if (zx<(cycle/2.)) {
						zx=cycle-zx+AccStart;
					} else {zx+=AccStart;}
				//done
			}
			 else if (zx>AccStart+cycle && zx<AccStart) {
				zx=zx-AccStart;
				if (zx<cycle/2.) {
					zx=cycle-zx+AccStart;
				} else {
					zx=zx+AccStart;
				}
			} 
			 else if (zx<(AccEnd- cyclemod)  && zx>AccEnd) {
				zx=AccEnd-zx;
				if (zx<cyclemod/2.0) {
					zx=cyclemod-zx+AccStart;
				} else {
					zx=zx+AccStart;
				}
			}  
			 else if (zx<AccEnd) {
				zx=zx-AccEnd+AccStart;
			}
		} else {
			cycle=abs(cycle);
			cyclemod=abs(cyclemod);
			
			if (zx<AccStart) {
				// do nothing
			}  else if (zx>(AccStart+cycle) && zx<(AccEnd-cyclemod)){
				zx=zx-AccStart;
				while (zx>(cycle) && i<3000.0) {
					zx-=cycle;i+=1.0;
				}
					if (zx>(cycle/2.)) {
						zx=cycle-zx+AccStart;
					} else {zx+=AccStart;}
				//done
			}
			 else if (zx<AccStart+cycle && zx>AccStart) {
				zx=zx-AccStart;
				if (zx>cycle/2.) {
					zx=cycle-zx+AccStart;
				} else {
					zx=zx+AccStart;
				}
			} 
			 else if (zx>(AccEnd- cyclemod)  && zx<AccEnd) {
				zx=AccEnd-zx;
				if (zx>cyclemod/2.0) {
					zx=cyclemod-zx+AccStart;
				} else {
					zx=zx+AccStart;
				}
			}  
			 else if (zx>AccEnd) {
				zx=zx-AccEnd+AccStart;
			}
		}
	
	return zx;
}

//uniform vec3 tester;slider[(-50,-2,-2),(0,0,0),(50,2,2)]
//uniform bool testmorph;checkbox[true]

float DE(vec3 z)
{
	int n = 1;
	int m=n;
	z=z;
	float r2;
float sc=1.0;
			if (AccZBool) {
					AccStart=AccStartz;
					AccCycle=AccCyclez;
					AccEnd=AccEndz;
					Accordion(z.z);}
	while (n <= Iterations) {
	
			if (n>=RotIter) {z*=rotxy;}
			
			if (n==AccIter1y) {
					AccStart=AccStart1y;
					AccCycle=AccCycle1y;
					AccEnd=AccEnd1y;
					Accordion(z.y);}

			if (n==AccIter2y) {
					AccStart=AccStart2y;
					AccCycle=AccCycle2y;
					AccEnd=AccEnd2y;
					Accordion(z.y);}
			if (n==AccIter3y) {
					AccStart=AccStart3y;
					AccCycle=AccCycle3y;
					AccEnd=AccEnd3y;
					Accordion(z.y);}

			if (m<=splititer1) {splits=Splits1;splitrad=Splitrad1; split(z,orbitTrap);}
			else if (m<spliti2) {splits=Splits2;splitrad=Splitrad2; split(z,orbitTrap);}
			else if (m<spliti3) {splits=Splits3; splitrad=Splitrad3;split(z,orbitTrap);}
			else if (m<spliti4) {splits=Splits4;splitrad=Splitrad4; split(z,orbitTrap);}
			else {split(z,orbitTrap);m=0;}
			m++;
			
		//orbitTrap = min(orbitTrap, vec4(abs(z),length(z)));
		
		n++;
	}
	//return length(z-vec3(widthC,0,widthC))-lengthC;
	//z=(z)/length(z)*max(length(z.xz)-widthC,abs(z.y)-lengthC);
	//return length(z);
	z/=sc;
			return max(length(z.xz)-widthC,abs(z.y)-lengthC);  //yup, it's a cylinder
	
//return max(length(tester.yz-z.xz)-tester.x,abs(z.y)-lengthC);  
}
#preset Carpet1
FOV = 0.4
Eye = -34.12244,1.809213,27.88367
Target = -28.75743,1.430425,23.40336
Up = -0.6373749,-0.18757,-0.7473761
DepthToAlpha = true
depthMag = 1
ShowDepth = false
AntiAlias = 1
Detail = -3
DetailAO = -0.5
FudgeFactor = 0.9
MaxRaySteps = 111
BoundingSphere = 2
Dither = 0.5
NormalBackStep = 1
AO = 0,0,0,0.7
Specular = 4
SpecularExp = 16
SpotLight = 1,1,1,0.4
SpotLightDir = 0.1,0.1
CamLight = 1,1,1,1
CamLightMin = 0
Glow = 1,1,1,0
GlowMax = 20
Fog = 0
HardShadow = 0
ShadowSoft = 2
Reflection = 0
EnableFloor = false
FloorNormal = 0,0,0
FloorHeight = 0
FloorColor = 1,1,1
BackgroundColor = 0.0627451,0.09803922,0.2392157
GradientBackground = 0.3
pBaseColor = 0,0,0
BaseStrength = 0.3
cSpeed = 10
pOffset = 0
pIntensity = 2
color0 = 0.8156863,0.8156863,0.8156863
Sharp0to1 = false
Dist0to1 = 1
color1 = 0,0.5411765,0.07058824
Sharp1to2 = false
Dist1to2 = 1
color2 = 0.8156863,0.8156863,0.4901961
Sharp2to3 = false
Dist2to3 = 1
color3 = 1,0.8588235,0.5215686
Sharp3to0 = false
Dist3to0 = 1
orbitStrengthXYZR = 0,0,1,0
Iterations = 12
lengthC = 10
widthC = 0
RotXYangle = 0
RotIter = 1
Splits1 = 4
splititer1 = 3
Splits2 = 6
splititer2 = 2
Splits3 = 5
splititer3 = 1
Splits4 = 4
splititer4 = 1
Splitrad1 = 1.153846
Splitrad2 = 0.1923076
Splitrad3 = 2.115385
Splitrad4 = 0.1923076
AccStart1y = -1.935484
AccCycle1y = 4.6
AccEnd1y = 6
AccIter1y = 4
AccStartz = 3.2
AccCyclez = 4.758823
AccEndz = -7
AccZBool = true
AccStart2y = -1
AccCycle2y = 0.6
AccEnd2y = -7
AccIter2y = 0
AccStart3y = 2
AccCycle3y = 2.288421
AccEnd3y = -1
AccIter3y = 0
#endpreset

#preset Splitrad2Change
FBTarget = 0,0,0
ApplyOnIteration = 0
FormulaType = 1
ApplicationType = 1
FeedbackRadius = 0.25
FeedbackStrength = 0.2
feednormdist = 0.01
FBRotVector = 0,0,0
FBRotAngle = 0
FeedBackCutOff = 60
MaxFeedbackValue = 10
TargetDepthMult = 0.1
FeedbackVariable1 = 1
FeedbackVariable2 = 1
FeedbackVariable3 = 1
FOV = 0.4
Eye = 49.99399,-2.519363,-2.744651
Target = 28.33597,-1.403465,-1.783529
DepthToAlpha = true
depthMag = 1
ShowDepth = false
AntiAlias = 1
Detail = -2.3
DetailAO = -0.5
FudgeFactor = 1
MaxRaySteps = 110
BoundingSphere = 4
Dither = 0.5
NormalBackStep = 1
AO = 0,0,0,0.7
Specular = 4
SpecularExp = 16
SpotLight = 1,1,1,0.4
SpotLightDir = 0.1,0.1
CamLight = 1,1,1,1
CamLightMin = 0
Glow = 1,1,1,0
GlowMax = 20
Fog = 0
HardShadow = 0
ShadowSoft = 2
Reflection = 0
EnableFloor = false
FloorNormal = 0,0,0
FloorHeight = 0
FloorColor = 1,1,1
PalettePercent = 100
BackgroundColor = 0.0627451,0.0627451,0.04313725
GradientBackground = 0.3
pBaseColor = 0,0,0
BaseStrength = 0.3
cSpeed = 13
pOffset = 40.60151
pIntensity = 1.395349
color0 = 0,0.7294118,0.9490196
Sharp0to1 = false
Dist0to1 = 1
color1 = 0.01176471,1,0.8862745
Sharp1to2 = false
Dist1to2 = 1
color2 = 0.007843137,0.7019608,0.9960784
Sharp2to3 = false
Dist2to3 = 1
color3 = 0.1568627,1,0.01176471
Sharp3to0 = false
Dist3to0 = 1
orbitStrengthXYZR = 1,1,1,1
BaseColorTex = 1
tex1 = C:/Users/MBenesi/Desktop/Fragmentarium-1.0.13-Qt_5_3_2_MinGW/burning-fire-.jpg
tex2 = C:/Users/MBenesi/Desktop/Fragmentarium-1.0.13-Qt_5_3_2_MinGW/maps/1005.jpg
tex3 = C:/Users/MBenesi/Desktop/Fragmentarium-1.0.13-Qt_5_3_2_MinGW/maps/1025.PNG
tex4 = C:/Users/MBenesi/Desktop/Fragmentarium-1.0.13-Qt_5_3_2_MinGW/maps/1034.jpg
SpeedMult = 1
TextureSpeed = 1.216216
intensity = 2.5
orbitTexX = 0,0,0,0.1
orbitTexY = 0,0,0,1
TextureOffset = 76,28
BaseMapType = 0
testA = false
tsides = 4
tsides2 = 4
HeightMapType = 0
HeightMap1Tex = 1
HeightIter = 0
HighStrength1 = 1
hTextureOffset1 = 0,0
hTextureSpeed1 = 1
HeightMap2Tex = 1
HeightIter2 = 0
HighStrength2 = 1
hTextureOffset2 = 0,0
hTextureSpeed2 = 1
HeightMap3Tex = 1
HeightIter3 = 0
HighStrength3 = 1
hTextureOffset3 = 0,0
hTextureSpeed3 = 1
HeightAngle3 = 3.14
HeightVector3 = 1,0,0
HeightStart3 = -1
HeightEnd3 = 1
HeightTextSpeed3 = 1
HeightTextIntensity3 = 1
DropOff = 1
Iterations = 26
lengthC = 22
widthC = 0
RotXYangle = 0
RotIter = 0
Splits1 = 5
splititer1 = 7
Splits2 = 2
splititer2 = 5
Splits3 = 4
splititer3 = 3
Splits4 = 7
splititer4 = 4
Splitrad1 = 3.157895
Splitrad2 = -20
Splitrad3 = 9.473684
Splitrad4 = 13.68421
Up = -0.0270479,-0.6769899,0.1765097
#endpreset

#preset Default
FOV = 0.4
Eye = 29.14345,-1.519427,-2.139277
Target = 4.300402,0.4048966,-0.2264567
DepthToAlpha = true
depthMag = 1
ShowDepth = false
AntiAlias = 1
Detail = -2.3
DetailAO = -0.5
FudgeFactor = 1
MaxRaySteps = 110
BoundingSphere = 4
Dither = 0.5
NormalBackStep = 1
AO = 0,0,0,0.7
Specular = 4
SpecularExp = 16
SpotLight = 1,1,1,0.4
SpotLightDir = 0.1,0.1
CamLight = 1,1,1,1
CamLightMin = 0
Glow = 1,1,1,0
GlowMax = 20
Fog = 0
HardShadow = 0
ShadowSoft = 2
Reflection = 0
EnableFloor = false
FloorNormal = 0,0,0
FloorHeight = 0
FloorColor = 1,1,1
PalettePercent = 100
BackgroundColor = 0.0627451,0.0627451,0.04313725
GradientBackground = 0.3
pBaseColor = 0,0,0
BaseStrength = 0.3
cSpeed = 13
pOffset = 40.60151
pIntensity = 1.395349
color0 = 0,0.7294118,0.9490196
Sharp0to1 = false
Dist0to1 = 1
color1 = 0.01176471,1,0.8862745
Sharp1to2 = false
Dist1to2 = 1
color2 = 0.007843137,0.7019608,0.9960784
Sharp2to3 = false
Dist2to3 = 1
color3 = 0.1568627,1,0.01176471
Sharp3to0 = false
Dist3to0 = 1
orbitStrengthXYZR = 1,1,1,1
BaseColorTex = 1
tex1 = C:/Users/MBenesi/Desktop/Fragmentarium-1.0.13-Qt_5_3_2_MinGW/burning-fire-.jpg
tex2 = C:/Users/MBenesi/Desktop/Fragmentarium-1.0.13-Qt_5_3_2_MinGW/maps/1005.jpg
tex3 = C:/Users/MBenesi/Desktop/Fragmentarium-1.0.13-Qt_5_3_2_MinGW/maps/1025.PNG
tex4 = C:/Users/MBenesi/Desktop/Fragmentarium-1.0.13-Qt_5_3_2_MinGW/maps/1034.jpg
SpeedMult = 1
TextureSpeed = 1.216216
intensity = 2.5
orbitTexX = 0,0,0,0.1
orbitTexY = 0,0,0,1
TextureOffset = 76,28
BaseMapType = 0
testA = false
tsides = 4
tsides2 = 4
HeightMapType = 0
HeightMap1Tex = 1
HeightIter = 0
HighStrength1 = 1
hTextureOffset1 = 0,0
hTextureSpeed1 = 1
HeightMap2Tex = 1
HeightIter2 = 0
HighStrength2 = 1
hTextureOffset2 = 0,0
hTextureSpeed2 = 1
HeightMap3Tex = 1
HeightIter3 = 0
HighStrength3 = 1
hTextureOffset3 = 0,0
hTextureSpeed3 = 1
HeightAngle3 = 3.14
HeightVector3 = 1,0,0
HeightStart3 = -1
HeightEnd3 = 1
HeightTextSpeed3 = 1
HeightTextIntensity3 = 1
DropOff = 1
cylinder = 0.01,9,0.2
Iterations = 22
ColorIterations = 8
FBTarget = 0,0,0
ApplyOnIteration = 0
FormulaType = 1
ApplicationType = 1
FeedbackRadius = 0.25
FeedbackStrength = 0.2
feednormdist = 0.01
FBRotVector = 0,0,0
FBRotAngle = 0
FeedBackCutOff = 60
MaxFeedbackValue = 10
TargetDepthMult = 0.1
FeedbackVariable1 = 1
FeedbackVariable2 = 1
FeedbackVariable3 = 1
RotVector = 0,0,1
RotAngle = 0
RotIter = 1
Splits1 = 5
splititer1 = 6
Splits2 = 3
splititer2 = 9
Splits3 = 4
splititer3 = 1
Splits4 = 7
splititer4 = 4
rotaddin = 0
Splitrad1 = 1.492537
Splitrad2 = 2.208955
Splitrad3 = 1.492537
Splitrad4 = 1.134328
RotXYangle = 18.60656
Up = -0.058801,-0.9699836,0.2121306
#endpreset

#preset CrazyBall2
FOV = 0.4
Eye = 45.92135,19.41448,-3.782594
Target = 0,0,0
DepthToAlpha = true
depthMag = 1
ShowDepth = false
AntiAlias = 1
Detail = -2.3
DetailAO = -0.5
FudgeFactor = 1
MaxRaySteps = 110
BoundingSphere = 4
Dither = 0.5
NormalBackStep = 1
AO = 0,0,0,0.7
Specular = 4
SpecularExp = 16
SpotLight = 1,1,1,0.4
SpotLightDir = 0.1,0.1
CamLight = 1,1,1,1
CamLightMin = 0
Glow = 1,1,1,0
GlowMax = 20
Fog = 0
HardShadow = 0
ShadowSoft = 2
Reflection = 0
EnableFloor = false
FloorNormal = 0,0,0
FloorHeight = 0
FloorColor = 1,1,1
PalettePercent = 100
BackgroundColor = 0.0627451,0.0627451,0.04313725
GradientBackground = 0.3
pBaseColor = 0,0,0
BaseStrength = 0.3
cSpeed = 13
pOffset = 40.60151
pIntensity = 1.395349
color0 = 0,0.7294118,0.9490196
Sharp0to1 = false
Dist0to1 = 1
color1 = 0.01176471,1,0.8862745
Sharp1to2 = false
Dist1to2 = 1
color2 = 0.007843137,0.7019608,0.9960784
Sharp2to3 = false
Dist2to3 = 1
color3 = 0.1568627,1,0.01176471
Sharp3to0 = false
Dist3to0 = 1
orbitStrengthXYZR = 1,1,1,1
BaseColorTex = 1
tex1 = C:/Users/MBenesi/Desktop/Fragmentarium-1.0.13-Qt_5_3_2_MinGW/burning-fire-.jpg
tex2 = C:/Users/MBenesi/Desktop/Fragmentarium-1.0.13-Qt_5_3_2_MinGW/maps/1005.jpg
tex3 = C:/Users/MBenesi/Desktop/Fragmentarium-1.0.13-Qt_5_3_2_MinGW/maps/1025.PNG
tex4 = C:/Users/MBenesi/Desktop/Fragmentarium-1.0.13-Qt_5_3_2_MinGW/maps/1034.jpg
SpeedMult = 1
TextureSpeed = 1.216216
intensity = 2.5
orbitTexX = 0,0,0,0.1
orbitTexY = 0,0,0,1
TextureOffset = 76,28
BaseMapType = 0
testA = false
tsides = 4
tsides2 = 4
HeightMapType = 0
HeightMap1Tex = 1
HeightIter = 0
HighStrength1 = 1
hTextureOffset1 = 0,0
hTextureSpeed1 = 1
HeightMap2Tex = 1
HeightIter2 = 0
HighStrength2 = 1
hTextureOffset2 = 0,0
hTextureSpeed2 = 1
HeightMap3Tex = 1
HeightIter3 = 0
HighStrength3 = 1
hTextureOffset3 = 0,0
hTextureSpeed3 = 1
HeightAngle3 = 3.14
HeightVector3 = 1,0,0
HeightStart3 = -1
HeightEnd3 = 1
HeightTextSpeed3 = 1
HeightTextIntensity3 = 1
DropOff = 1
cylinder = 0.01,9,0.2
Iterations = 22
ColorIterations = 8
FBTarget = 0,0,0
ApplyOnIteration = 0
FormulaType = 1
ApplicationType = 1
FeedbackRadius = 0.25
FeedbackStrength = 0.2
feednormdist = 0.01
FBRotVector = 0,0,0
FBRotAngle = 0
FeedBackCutOff = 60
MaxFeedbackValue = 10
TargetDepthMult = 0.1
FeedbackVariable1 = 1
FeedbackVariable2 = 1
FeedbackVariable3 = 1
RotVector = 0,0,1
RotAngle = 0
RotIter = 0
Splits1 = 5
splititer1 = 7
Splits2 = 2
splititer2 = 5
Splits3 = 4
splititer3 = 3
Splits4 = 7
splititer4 = 4
rotaddin = 0
Splitrad1 = 6.597015
Splitrad2 = 3.641792
Splitrad3 = -0.2089552
Splitrad4 = 1.850746
RotXYangle = -22.42857
Up = 0.2868111,-0.6445413,0.1737745
#endpreset

#preset SplitPlane
FOV = 0.4
Eye = 50,30.75957,-5.800992
Target = 22.36615,15.47297,-3.041924
DepthToAlpha = true
depthMag = 1
ShowDepth = false
AntiAlias = 1
Detail = -2.3
DetailAO = -0.5
FudgeFactor = 1
MaxRaySteps = 110
BoundingSphere = 4
Dither = 0.5
NormalBackStep = 1
AO = 0,0,0,0.7
Specular = 4
SpecularExp = 16
SpotLight = 1,1,1,0.4
SpotLightDir = 0.1,0.1
CamLight = 1,1,1,1
CamLightMin = 0
Glow = 1,1,1,0
GlowMax = 20
Fog = 0
HardShadow = 0
ShadowSoft = 2
Reflection = 0
EnableFloor = false
FloorNormal = 0,0,0
FloorHeight = 0
FloorColor = 1,1,1
PalettePercent = 100
BackgroundColor = 0.0627451,0.0627451,0.04313725
GradientBackground = 0.3
pBaseColor = 0,0,0
BaseStrength = 0.3
cSpeed = 13
pOffset = 40.60151
pIntensity = 1.395349
color0 = 0,0.7294118,0.9490196
Sharp0to1 = false
Dist0to1 = 1
color1 = 0.01176471,1,0.8862745
Sharp1to2 = false
Dist1to2 = 1
color2 = 0.007843137,0.7019608,0.9960784
Sharp2to3 = false
Dist2to3 = 1
color3 = 0.1568627,1,0.01176471
Sharp3to0 = false
Dist3to0 = 1
orbitStrengthXYZR = 1,1,1,1
BaseColorTex = 1
tex1 = C:/Users/MBenesi/Desktop/Fragmentarium-1.0.13-Qt_5_3_2_MinGW/burning-fire-.jpg
tex2 = C:/Users/MBenesi/Desktop/Fragmentarium-1.0.13-Qt_5_3_2_MinGW/maps/1005.jpg
tex3 = C:/Users/MBenesi/Desktop/Fragmentarium-1.0.13-Qt_5_3_2_MinGW/maps/1025.PNG
tex4 = C:/Users/MBenesi/Desktop/Fragmentarium-1.0.13-Qt_5_3_2_MinGW/maps/1034.jpg
SpeedMult = 1
TextureSpeed = 1.216216
intensity = 2.5
orbitTexX = 0,0,0,0.1
orbitTexY = 0,0,0,1
TextureOffset = 76,28
BaseMapType = 0
testA = false
tsides = 4
tsides2 = 4
HeightMapType = 0
HeightMap1Tex = 1
HeightIter = 0
HighStrength1 = 1
hTextureOffset1 = 0,0
hTextureSpeed1 = 1
HeightMap2Tex = 1
HeightIter2 = 0
HighStrength2 = 1
hTextureOffset2 = 0,0
hTextureSpeed2 = 1
HeightMap3Tex = 1
HeightIter3 = 0
HighStrength3 = 1
hTextureOffset3 = 0,0
hTextureSpeed3 = 1
HeightAngle3 = 3.14
HeightVector3 = 1,0,0
HeightStart3 = -1
HeightEnd3 = 1
HeightTextSpeed3 = 1
HeightTextIntensity3 = 1
DropOff = 1
cylinder = 0,9,0.2
Iterations = 23
ColorIterations = 8
FBTarget = 0,0,0
ApplyOnIteration = 0
FormulaType = 1
ApplicationType = 1
FeedbackRadius = 0.25
FeedbackStrength = 0.2
feednormdist = 0.01
FBRotVector = 0,0,0
FBRotAngle = 0
FeedBackCutOff = 60
MaxFeedbackValue = 10
TargetDepthMult = 0.1
FeedbackVariable1 = 1
FeedbackVariable2 = 1
FeedbackVariable3 = 1
RotVector = 0,0,1
RotAngle = 0
RotIter = 0
Splits1 = 5
splititer1 = 7
Splits2 = 2
splititer2 = 5
Splits3 = 4
splititer3 = 3
Splits4 = 7
splititer4 = 4
rotaddin = 0
Splitrad1 = 10
Splitrad2 = 4
Splitrad3 = 4.985075
Splitrad4 = 3.641791
RotXYangle = 0
Up = 0.3494966,-0.6016051,0.1672464
#endpreset

#preset IncreaseSplitrad3
FOV = 0.4
Eye = 50,30.75957,-5.800992
Target = 22.36615,15.47297,-3.041924
DepthToAlpha = true
depthMag = 1
ShowDepth = false
AntiAlias = 1
Detail = -2.3
DetailAO = -0.5
FudgeFactor = 1
MaxRaySteps = 110
BoundingSphere = 4
Dither = 0.5
NormalBackStep = 1
AO = 0,0,0,0.7
Specular = 4
SpecularExp = 16
SpotLight = 1,1,1,0.4
SpotLightDir = 0.1,0.1
CamLight = 1,1,1,1
CamLightMin = 0
Glow = 1,1,1,0
GlowMax = 20
Fog = 0
HardShadow = 0
ShadowSoft = 2
Reflection = 0
EnableFloor = false
FloorNormal = 0,0,0
FloorHeight = 0
FloorColor = 1,1,1
PalettePercent = 100
BackgroundColor = 0.0627451,0.0627451,0.04313725
GradientBackground = 0.3
pBaseColor = 0,0,0
BaseStrength = 0.3
cSpeed = 13
pOffset = 40.60151
pIntensity = 1.395349
color0 = 0,0.7294118,0.9490196
Sharp0to1 = false
Dist0to1 = 1
color1 = 0.01176471,1,0.8862745
Sharp1to2 = false
Dist1to2 = 1
color2 = 0.007843137,0.7019608,0.9960784
Sharp2to3 = false
Dist2to3 = 1
color3 = 0.1568627,1,0.01176471
Sharp3to0 = false
Dist3to0 = 1
orbitStrengthXYZR = 1,1,1,1
BaseColorTex = 1
tex1 = C:/Users/MBenesi/Desktop/Fragmentarium-1.0.13-Qt_5_3_2_MinGW/burning-fire-.jpg
tex2 = C:/Users/MBenesi/Desktop/Fragmentarium-1.0.13-Qt_5_3_2_MinGW/maps/1005.jpg
tex3 = C:/Users/MBenesi/Desktop/Fragmentarium-1.0.13-Qt_5_3_2_MinGW/maps/1025.PNG
tex4 = C:/Users/MBenesi/Desktop/Fragmentarium-1.0.13-Qt_5_3_2_MinGW/maps/1034.jpg
SpeedMult = 1
TextureSpeed = 1.216216
intensity = 2.5
orbitTexX = 0,0,0,0.1
orbitTexY = 0,0,0,1
TextureOffset = 76,28
BaseMapType = 0
testA = false
tsides = 4
tsides2 = 4
HeightMapType = 0
HeightMap1Tex = 1
HeightIter = 0
HighStrength1 = 1
hTextureOffset1 = 0,0
hTextureSpeed1 = 1
HeightMap2Tex = 1
HeightIter2 = 0
HighStrength2 = 1
hTextureOffset2 = 0,0
hTextureSpeed2 = 1
HeightMap3Tex = 1
HeightIter3 = 0
HighStrength3 = 1
hTextureOffset3 = 0,0
hTextureSpeed3 = 1
HeightAngle3 = 3.14
HeightVector3 = 1,0,0
HeightStart3 = -1
HeightEnd3 = 1
HeightTextSpeed3 = 1
HeightTextIntensity3 = 1
DropOff = 1
Iterations = 26
ColorIterations = 8
FBTarget = 0,0,0
ApplyOnIteration = 0
FormulaType = 1
ApplicationType = 1
FeedbackRadius = 0.25
FeedbackStrength = 0.2
feednormdist = 0.01
FBRotVector = 0,0,0
FBRotAngle = 0
FeedBackCutOff = 60
MaxFeedbackValue = 10
TargetDepthMult = 0.1
FeedbackVariable1 = 1
FeedbackVariable2 = 1
FeedbackVariable3 = 1
RotVector = 0,0,1
RotAngle = 0
RotIter = 0
Splits1 = 5
splititer1 = 7
Splits2 = 2
splititer2 = 5
Splits3 = 4
splititer3 = 3
Splits4 = 7
splititer4 = 7
RotXYangle = 0
Splitrad1 = 1.538461
Splitrad2 = -4.615385
Splitrad3 = -10.76923
Splitrad4 = 2.769231
lengthC = 18.34532
widthC = 0
Up = 0.3494966,-0.6016051,0.1672464
#endpreset

#preset Splitrad
FOV = 0.4
Eye = 29.14345,-1.519427,-2.139277
Target = 4.300402,0.4048966,-0.2264567
DepthToAlpha = true
depthMag = 1
ShowDepth = false
AntiAlias = 1
Detail = -2.3
DetailAO = -0.5
FudgeFactor = 1
MaxRaySteps = 110
BoundingSphere = 4
Dither = 0.5
NormalBackStep = 1
AO = 0,0,0,0.7
Specular = 4
SpecularExp = 16
SpotLight = 1,1,1,0.4
SpotLightDir = 0.1,0.1
CamLight = 1,1,1,1
CamLightMin = 0
Glow = 1,1,1,0
GlowMax = 20
Fog = 0
HardShadow = 0
ShadowSoft = 2
Reflection = 0
EnableFloor = false
FloorNormal = 0,0,0
FloorHeight = 0
FloorColor = 1,1,1
PalettePercent = 100
BackgroundColor = 0.0627451,0.0627451,0.04313725
GradientBackground = 0.3
pBaseColor = 0,0,0
BaseStrength = 0.3
cSpeed = 13
pOffset = 40.60151
pIntensity = 1.395349
color0 = 0,0.7294118,0.9490196
Sharp0to1 = false
Dist0to1 = 1
color1 = 0.01176471,1,0.8862745
Sharp1to2 = false
Dist1to2 = 1
color2 = 0.007843137,0.7019608,0.9960784
Sharp2to3 = false
Dist2to3 = 1
color3 = 0.1568627,1,0.01176471
Sharp3to0 = false
Dist3to0 = 1
orbitStrengthXYZR = 1,1,1,1
BaseColorTex = 1
tex1 = C:/Users/MBenesi/Desktop/Fragmentarium-1.0.13-Qt_5_3_2_MinGW/burning-fire-.jpg
tex2 = C:/Users/MBenesi/Desktop/Fragmentarium-1.0.13-Qt_5_3_2_MinGW/maps/1005.jpg
tex3 = C:/Users/MBenesi/Desktop/Fragmentarium-1.0.13-Qt_5_3_2_MinGW/maps/1025.PNG
tex4 = C:/Users/MBenesi/Desktop/Fragmentarium-1.0.13-Qt_5_3_2_MinGW/maps/1034.jpg
SpeedMult = 1
TextureSpeed = 1.216216
intensity = 2.5
orbitTexX = 0,0,0,0.1
orbitTexY = 0,0,0,1
TextureOffset = 76,28
BaseMapType = 0
testA = false
tsides = 4
tsides2 = 4
HeightMapType = 0
HeightMap1Tex = 1
HeightIter = 0
HighStrength1 = 1
hTextureOffset1 = 0,0
hTextureSpeed1 = 1
HeightMap2Tex = 1
HeightIter2 = 0
HighStrength2 = 1
hTextureOffset2 = 0,0
hTextureSpeed2 = 1
HeightMap3Tex = 1
HeightIter3 = 0
HighStrength3 = 1
hTextureOffset3 = 0,0
hTextureSpeed3 = 1
HeightAngle3 = 3.14
HeightVector3 = 1,0,0
HeightStart3 = -1
HeightEnd3 = 1
HeightTextSpeed3 = 1
HeightTextIntensity3 = 1
DropOff = 1
Iterations = 22
ColorIterations = 8
FBTarget = 0,0,0
ApplyOnIteration = 0
FormulaType = 1
ApplicationType = 1
FeedbackRadius = 0.25
FeedbackStrength = 0.2
feednormdist = 0.01
FBRotVector = 0,0,0
FBRotAngle = 0
FeedBackCutOff = 60
MaxFeedbackValue = 10
TargetDepthMult = 0.1
FeedbackVariable1 = 1
FeedbackVariable2 = 1
FeedbackVariable3 = 1
RotVector = 0,0,1
RotAngle = 0
RotIter = 1
Splits1 = 5
splititer1 = 6
Splits2 = 3
splititer2 = 9
Splits3 = 4
splititer3 = 1
Splits4 = 7
splititer4 = 4
RotXYangle = 18.60656
lengthC = 25.46763
widthC = 0
Splitrad1 = 6.153846
Splitrad2 = 37.69231
Splitrad3 = 43.84615
Splitrad4 = 11.53846
Up = -0.058801,-0.9699836,0.2121306
#endpreset

#preset funplane3
FOV = 0.4
Eye = -50,8.982328,-3.998503
Target = -37.35087,5.781198,-2.798055
DepthToAlpha = true
depthMag = 1
ShowDepth = false
AntiAlias = 1
Detail = -2.3
DetailAO = -0.5
FudgeFactor = 1
MaxRaySteps = 110
BoundingSphere = 4
Dither = 0.5
NormalBackStep = 1
AO = 0,0,0,0.7
Specular = 4
SpecularExp = 16
SpotLight = 1,1,1,0.4
SpotLightDir = 0.1,0.1
CamLight = 1,1,1,1
CamLightMin = 0
Glow = 1,1,1,0
GlowMax = 20
Fog = 0
HardShadow = 0
ShadowSoft = 2
Reflection = 0
EnableFloor = false
FloorNormal = 0,0,0
FloorHeight = 0
FloorColor = 1,1,1
PalettePercent = 100
BackgroundColor = 0.0627451,0.0627451,0.04313725
GradientBackground = 0.3
pBaseColor = 0,0,0
BaseStrength = 0.3
cSpeed = 13
pOffset = 40.60151
pIntensity = 1.395349
color0 = 0,0.7294118,0.9490196
Sharp0to1 = false
Dist0to1 = 1
color1 = 0.01176471,1,0.8862745
Sharp1to2 = false
Dist1to2 = 1
color2 = 0.007843137,0.7019608,0.9960784
Sharp2to3 = false
Dist2to3 = 1
color3 = 0.1568627,1,0.01176471
Sharp3to0 = false
Dist3to0 = 1
orbitStrengthXYZR = 1,1,1,1
BaseColorTex = 1
tex1 = C:/Users/MBenesi/Desktop/Fragmentarium-1.0.13-Qt_5_3_2_MinGW/burning-fire-.jpg
tex2 = C:/Users/MBenesi/Desktop/Fragmentarium-1.0.13-Qt_5_3_2_MinGW/maps/1005.jpg
tex3 = C:/Users/MBenesi/Desktop/Fragmentarium-1.0.13-Qt_5_3_2_MinGW/maps/1025.PNG
tex4 = C:/Users/MBenesi/Desktop/Fragmentarium-1.0.13-Qt_5_3_2_MinGW/maps/1034.jpg
SpeedMult = 1
TextureSpeed = 1.216216
intensity = 2.5
orbitTexX = 0,0,0,0.1
orbitTexY = 0,0,0,1
TextureOffset = 76,28
BaseMapType = 0
testA = false
tsides = 4
tsides2 = 4
HeightMapType = 0
HeightMap1Tex = 1
HeightIter = 0
HighStrength1 = 1
hTextureOffset1 = 0,0
hTextureSpeed1 = 1
HeightMap2Tex = 1
HeightIter2 = 0
HighStrength2 = 1
hTextureOffset2 = 0,0
hTextureSpeed2 = 1
HeightMap3Tex = 1
HeightIter3 = 0
HighStrength3 = 1
hTextureOffset3 = 0,0
hTextureSpeed3 = 1
HeightAngle3 = 3.14
HeightVector3 = 1,0,0
HeightStart3 = -1
HeightEnd3 = 1
HeightTextSpeed3 = 1
HeightTextIntensity3 = 1
DropOff = 1
Iterations = 22
lengthC = 30
widthC = -0.05
RotXYangle = 0
RotIter = 0
Splits1 = 3
splititer1 = 6
Splits2 = 5
splititer2 = 5
Splits3 = 3
splititer3 = 3
Splits4 = 7
splititer4 = 5
Splitrad1 = 7.368421
Splitrad2 = -1.052632
Splitrad3 = -5.263158
Splitrad4 = 3.157895
Up = 0.1713706,0.6539851,-0.0618091
#endpreset

#preset anim
FBTarget = 0,0,0
ApplyOnIteration = 0
FormulaType = 1
ApplicationType = 1
FeedbackRadius = 0.25
FeedbackStrength = 0.2
feednormdist = 0.01
FBRotVector = 0,0,0
FBRotAngle = 0
FeedBackCutOff = 60
MaxFeedbackValue = 10
TargetDepthMult = 0.1
FeedbackVariable1 = 1
FeedbackVariable2 = 1
FeedbackVariable3 = 1
FOV = 0.4
Eye = -50,8.982328,-3.998503
Target = -37.35087,5.781198,-2.798055
DepthToAlpha = true
depthMag = 1
ShowDepth = false
AntiAlias = 1
Detail = -2.3
DetailAO = -0.5
FudgeFactor = 1
MaxRaySteps = 110
BoundingSphere = 4
Dither = 0.5
NormalBackStep = 1
AO = 0,0,0,0.7
Specular = 4
SpecularExp = 16
SpotLight = 1,1,1,0.4
SpotLightDir = 0.1,0.1
CamLight = 1,1,1,1
CamLightMin = 0
Glow = 1,1,1,0
GlowMax = 20
Fog = 0
HardShadow = 0
ShadowSoft = 2
Reflection = 0
EnableFloor = false
FloorNormal = 0,0,0
FloorHeight = 0
FloorColor = 1,1,1
PalettePercent = 100
BackgroundColor = 0.0627451,0.0627451,0.04313725
GradientBackground = 0.3
pBaseColor = 0,0,0
BaseStrength = 0.3
cSpeed = 11
pOffset = 44.85981
pIntensity = 1.747573
color0 = 0,1,0.1647059
Sharp0to1 = false
Dist0to1 = 1
color1 = 0.01176471,1,0.8862745
Sharp1to2 = false
Dist1to2 = 1
color2 = 0.9098039,0,0.9921569
Sharp2to3 = false
Dist2to3 = 1
color3 = 0,0.6,1
Sharp3to0 = false
Dist3to0 = 1
orbitStrengthXYZR = 0,0,0.4,0
BaseColorTex = 1
tex1 = C:/Users/MBenesi/Desktop/Fragmentarium-1.0.13-Qt_5_3_2_MinGW/burning-fire-.jpg
tex2 = C:/Users/MBenesi/Desktop/Fragmentarium-1.0.13-Qt_5_3_2_MinGW/maps/1005.jpg
tex3 = C:/Users/MBenesi/Desktop/Fragmentarium-1.0.13-Qt_5_3_2_MinGW/maps/1025.PNG
tex4 = C:/Users/MBenesi/Desktop/Fragmentarium-1.0.13-Qt_5_3_2_MinGW/maps/1034.jpg
SpeedMult = 1
TextureSpeed = 1.216216
intensity = 2.5
orbitTexX = 0,0,0,0.1
orbitTexY = 0,0,0,1
TextureOffset = 76,28
BaseMapType = 0
testA = false
tsides = 4
tsides2 = 4
HeightMapType = 0
HeightMap1Tex = 1
HeightIter = 0
HighStrength1 = 1
hTextureOffset1 = 0,0
hTextureSpeed1 = 1
HeightMap2Tex = 1
HeightIter2 = 0
HighStrength2 = 1
hTextureOffset2 = 0,0
hTextureSpeed2 = 1
HeightMap3Tex = 1
HeightIter3 = 0
HighStrength3 = 1
hTextureOffset3 = 0,0
hTextureSpeed3 = 1
HeightAngle3 = 3.14
HeightVector3 = 1,0,0
HeightStart3 = -1
HeightEnd3 = 1
HeightTextSpeed3 = 1
HeightTextIntensity3 = 1
DropOff = 1
Iterations = 22
lengthC = 30
widthC = 0
RotXYangle = 0
RotIter = 0
Splits1 = 3
splititer1 = 5
Splits2 = 4
splititer2 = 5
Splits3 = 7
splititer3 = 5
Splits4 = 2
splititer4 = 4
Splitrad1 = 3.461539
Splitrad2 = 20
Splitrad3 = 20
Splitrad4 = 0
Up = 0.1713707,0.6539851,-0.0618091
#endpreset

#preset Splitrad2n20to80
FOV = 0.4
Eye = -84.54467,-4.047152,-1.580062
Target = -71.44679,-3.969363,-1.221818
DepthToAlpha = true
depthMag = 1
ShowDepth = false
AntiAlias = 1
Detail = -2.3
DetailAO = -0.5
FudgeFactor = 1
MaxRaySteps = 110
BoundingSphere = 4
Dither = 0.5
NormalBackStep = 1
AO = 0,0,0,0.7
Specular = 4
SpecularExp = 16
SpotLight = 1,1,1,0.4
SpotLightDir = 0.1,0.1
CamLight = 1,1,1,1
CamLightMin = 0
Glow = 1,1,1,0
GlowMax = 20
Fog = 0
HardShadow = 0
ShadowSoft = 2
Reflection = 0
EnableFloor = false
FloorNormal = 0,0,0
FloorHeight = 0
FloorColor = 1,1,1
BackgroundColor = 0.0627451,0.0627451,0.04313725
GradientBackground = 0.3
pBaseColor = 0,0,0
BaseStrength = 0.3
cSpeed = 11
pOffset = 44.85981
pIntensity = 1.747573
color0 = 0,1,0.1647059
Sharp0to1 = false
Dist0to1 = 1
color1 = 0.01176471,1,0.8862745
Sharp1to2 = false
Dist1to2 = 1
color2 = 0.9098039,0,0.9921569
Sharp2to3 = false
Dist2to3 = 1
color3 = 0,0.6,1
Sharp3to0 = false
Dist3to0 = 1
orbitStrengthXYZR = 0,0,0.4,0
Iterations = 22
lengthC = 30
widthC = 0
RotXYangle = 0
RotIter = 0
Splits1 = 3
splititer1 = 5
Splits2 = 4
splititer2 = 5
Splits3 = 7
splititer3 = 5
Splits4 = 2
splititer4 = 4
Splitrad1 = 2.115385
Splitrad2 = 10.76923
Splitrad3 = 15.57692
Splitrad4 = 5
AccStart1y = 0.2150538
AccCycle1y = 1.6
AccEnd1y = 6.565657
AccIter1y = 4
AccStart2y = -4.946237
AccCycle2y = 4.16421
AccEnd2y = -3.535354
AccIter2y = 3
AccStartz = 5.2
AccCyclez = 4.467647
AccEndz = 5.660378
AccZBool = false
AccStart3y = -2.795699
AccCycle3y = 2.496842
AccEnd3y = 5.555556
AccIter3y = 2
Up = -0.0019374,0.6746529,-0.0756603
#endpreset

#preset PaletteSet
BackgroundColor = 0.0627451,0.0627451,0.04313725
GradientBackground = 0.3
pBaseColor = 0,0,0
BaseStrength = 0.3
cSpeed = 13
pOffset = 40.60151
pIntensity = 1.395349
color0 = 0.6666667,0,0.9490196
Sharp0to1 = false
Dist0to1 = 1
color1 = 0,0.06666667,1
Sharp1to2 = false
Dist1to2 = 1.267241
color2 = 0,0.9921569,0.1647059
Sharp2to3 = true
Dist2to3 = 1
color3 = 0,0.7843137,1
Sharp3to0 = true
Dist3to0 = 1
orbitStrengthXYZR = 0,0,0.4,0.5
#endpreset

#preset KeyFrame.001
FOV = 0.4
Eye = -50,8.982328,-3.998503
FBTarget = 0,0,0
TargetDepthMult = 0.1
Target = -37.19853,6.505407,-2.703831
Up = 0.1347201,0.6621786,-0.0652287
#endpreset

#preset KeyFrame.002
FOV = 0.4
Eye = -50,8.982328,-3.998503
FBTarget = 0,0,0
TargetDepthMult = 0.1
Target = -37.19853,6.505407,-2.703831
Up = 0.1347201,0.6621786,-0.0652287
#endpreset
