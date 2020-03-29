#info This fragment is based on code created by knighty in May 1, 2010
#info Part of a series of IFS equations
#info http://www.fractalforums.com/sierpinski-gasket/kaleidoscopic-(escape-time-ifs)/
#info License unknown

#define providesInit

#include "MathUtils.frag"
#include "DE-Raytracer.frag"

#define float3 vec3
#define float4 vec4

#group Geode

uniform int MaxSteps; slider[5,20,60]
uniform float Scale; slider[100,150,300]
uniform float CY; slider[0.01,0.5,2]
uniform float Angle1; slider[-3,0,3]
uniform float Angle2; slider[-3,0,3]
uniform float Angle3; slider[-3,0,3]

float3 rotatePosition(float3 pos, int axis, float angle) {
   float ss = sin(angle);
   float cc = cos(angle);
   float qt;
    
   if(axis == 0) {
	  qt = pos.x;
	  pos.x = pos.x * cc - pos.y * ss;
	  pos.y =    qt * ss + pos.y * cc;
   }
   
   if(axis == 1) {
	  qt = pos.x;
	  pos.x = pos.x * cc - pos.z * ss;
	  pos.z =    qt * ss + pos.z * cc;
   }
   
   if(axis == 2) {
	  qt = pos.y;
	  pos.y = pos.y * cc - pos.z * ss;
	  pos.z =    qt * ss + pos.z * cc;
   }
   
   return pos;
}

float scale;
float3 n1;
float3 n2;

void init() {
   scale = Scale / 100.0;
   n1 = normalize(float3(-1.0, CY - 1.0, 1.0/CY - 1.0));
   n2 = n1 * (scale - 1.0);
}

float DE(float3 pos) {
	int i;

	for(i=0;i < MaxSteps; ++i) {
		pos = rotatePosition(pos,0,Angle1);
		
		if(pos.x - pos.y < 0.0) pos.xy = pos.yx;
		if(pos.x - pos.z < 0.0) pos.xz = pos.zx;
		if(pos.y - pos.z < 0.0) pos.zy = pos.yz;
		
		pos = rotatePosition(pos,1,Angle2);
		pos = rotatePosition(pos,2,Angle3);
		pos = pos * scale - n2;

		if(length(pos) > 4.0) break;

		orbitTrap = min(orbitTrap, float4(abs(pos),dot(pos,pos)));
	}

	return length(pos) * pow(scale, -float(i));
}

#preset Default 

FOV = 0.114369502
Eye = -7.54571421,-2.03048839,-0.060651958
Target = 29.1383855,7.77755928,-0.616498641
Up = 0.077280688,-0.290643284,-0.028192494
EquiRectangular = false
AutoFocus = false
FocalPlane = 2.37315875
Aperture = 0
Stereo = 0
EyeSeparation = 0.51020408
ProjectionPlane = 165.441177
AnaglyphLeft = 1,0,0
AnaglyphRight = 0,1,1
Gamma = 0.49270073
ToneMapping = 1
Exposure = 1.22803738
Brightness = 2.12643678
Contrast = 1.80811808
AvgLumin = 0.5,0.5,0.5
Saturation = 3.25421133
LumCoeff = 0.212500006,0.715399981,0.0720999986
Hue = 0
GaussianWeight = 0
AntiAliasScale = 0
DepthToAlpha = false
ShowDepth = false
DepthMagnitude = 1
Detail = -3.35599284
DetailAO = -6.68361581
FudgeFactor = 0.325396826
MaxDistance = 159.235671
MaxRaySteps = 360
Dither = 1 Locked
NormalBackStep = 0 NotLocked
AO = 0,0,0,0.08565737
Specular = 0.082191781
SpecularExp = 25.4945056
SpecularMax = 31.4159293
SpotLight = 1,1,1,0.506787331
SpotLightDir = -0.279317696,1
CamLight = 1,1,1,0.357466064
CamLightMin = 0.098333334
Glow = 1,1,1,0.07231405
GlowMax = 62
Fog = 0
HardShadow = 0 NotLocked
ShadowSoft = 0
QualityShadows = false
Reflection = 0 NotLocked
DebugSun = false NotLocked
BaseColor = 1,1,1
OrbitStrength = 0.536585366
X = 0.5,0.6,0.6,-0.308550185
Y = 1,0.333333333,0.498039216,-0.881040892
Z = 1,1,0,-0.769516729
R = 0,1,0,0.378026072
BackgroundColor = 0.05882353,0.07843137,0.1019608
GradientBackground = 0
CycleColors = true
Cycles = 5.82704172
EnableFloor = false
FloorNormal = 0,0,1
FloorHeight = 0
FloorColor = 1,1,1
MaxSteps = 15
Scale = 121.129326
Angle1 = 0.262773726
Angle2 = -0.985401453
Angle3 = 0.317518249
CY = 1.15717647

#endpreset

