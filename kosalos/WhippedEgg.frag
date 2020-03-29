#version 120
#info written by kosalos, based on many other frags from many sources
#info License Creative Commons Attribution-NonCommercial-ShareAlike 3.0 Unported License.
#define providesInit
#include "MathUtils.frag"
#include "DE-Raytracer-Layers.frag"

uniform float time;

#group Egg
uniform int MaxSteps; slider[1,1,4];
uniform vec3 C; slider[(-10,-10,-10),(0,0,0),(10,10,10)]
uniform float Cw; slider[0.01,1,4]

uniform vec3 Log; slider[(0,0,0),(0,0,0),(5,5,5)]
uniform vec3 Scale; slider[(0,0,0),(0,0,0),(4,4,4)]
uniform vec3 Offset; slider[(-20,-20,-20),(0,0,0),(20,20,20)]
uniform vec3 Slope; slider[(-1,-1,-1),(0,0,0),(1,1,1)]
uniform vec2 Angle; slider[(0,0),(0,0),(3,3)]
uniform float Smooth; slider[1,1,10]
uniform float SFactor; slider[1,2,20]

uniform bool doInversion; checkbox[true]
uniform vec3 InvPt; slider[(-5,-5,-5),(0,0,0),(5,5,5)]
uniform float InvRadius; slider[0.1,4.01,10]
uniform float InvAngle; slider[-10,1.34,10]

uniform float AnimSpeed; slider[0.01,0.1,1]
uniform float AnimScale; slider[0,1,10]

uniform float OpacityEgg; slider[0,1,1]
uniform float OpacityTetra; slider[0,1,1]
uniform float OpacityStar; slider[0,1,1]
uniform float OpacityWater; slider[0,1,1]

float timeOffset;
float freqOffset;
float positionOffset;

#include "HalfTetraLayers.frag"
#include "StarBurstLayers.frag"
#include "WaterLayers.frag"

vec3 rotatePosition(vec3 pos, int axis, float angle) {
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

//-------------------------------------------

vec4 c;
float invRadius2;
vec3 offset;
float sFactor;

void init() {
	float animFactor = sin(time * AnimSpeed) * AnimScale;
	
	c = 0.5 * vec4(C,Cw) * animFactor;
	offset = Offset;
	offset.y += animFactor;
	
	invRadius2 = InvRadius * InvRadius;
	sFactor = SFactor * 0.001;
	
	halfTetraInit();
	waterInit();
}

//-------------------------------------------

float DE_EggInner(vec3 zIn) {
	float md2 = 1.0;
	vec4 z = vec4(zIn,0);
	vec4 nz,oldZ = z;
	float mz2 = dot(z,z);
	md2 *= 4.0 * mz2;
	
	for(int i=0;i<MaxSteps;++i) {
		 nz.x = z.x * z.x - dot(z.yzw, z.xyz); // yzw);
	  nz.yzw = 2.0 * z.x * z.yzw;
	  z = nz+c;
	
	  z.xyz = Log * log(z.xyz + sqrt(dot(z.xyz,z.xyz)+1.0));
	  z.xyz = Scale * sin(z.xyz + offset) + z.xyz * Slope;
	
	  z.xyz = rotatePosition(z.xyw,0,Angle.x);
	  z.xyz = rotatePosition(z.yzx,1,Angle.y);
	
	  z += (z - oldZ) / Smooth;
	  oldZ = z;
	
	  mz2 = dot(z,z);
	  orbitTrap = min(orbitTrap, mz2);
 }

  return 0.3 * sqrt(mz2 * sFactor) * log(mz2);
}

float DE_Egg(vec3 pos) {
  if(doInversion) {
	  pos = pos - InvPt;
	  float r = length(pos);
	  float r2 = r*r;
	  pos = (invRadius2 / r2 ) * pos + InvPt;
	
	  float an = atan(pos.y,pos.x) + InvAngle;
	  float ra = sqrt(pos.y * pos.y + pos.x * pos.x);
	  pos.x = cos(an)*ra;
	  pos.y = sin(an)*ra;
	
	  float de = DE_EggInner(pos);
	
	  de = r2 * de / (invRadius2 + r * de);
	  return de;
  }

  return DE_EggInner(pos);
}

// LAYERS $$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$

float DE(vec3 pos) {
  switch(layerIndex) {
    case 0 : return DE_Egg(pos);
    case 1 : return DE_HALF_TETRA(pos);
    case 2 : return StarBurstDE(pos);
    case 3 :
     timeOffset = 0;
     freqOffset = 0;    
     positionOffset = 0;
     return WaterDE(pos);
   case 4 :
     timeOffset = 30;
     freqOffset = 0.2;
     positionOffset = 15.0;
     return WaterDE(pos);
    default : return NO_MORE_LAYERS;
  }
}

// LAYERS $$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$

#preset Default

FOV = 0.33373064
Eye = 14.8071029,13.3756257,0.453654711
Target = 5.73436673,7.15870529,1.93970356
Up = 0.261296632,-0.363895033,0.072924218
EquiRectangular = false
AutoFocus = false
FocalPlane = 1
Aperture = 0
Stereo = 0
EyeSeparation = 3.73063175
ProjectionPlane = 8.68486
AnaglyphLeft = 1,0,0
AnaglyphRight = 0,1,1
Gamma = 0.66746125
ToneMapping = 3
Exposure = 0.6579261
Brightness = 1.2455304
Contrast = 1.4958284
AvgLumin = 0.5,0.5,0.5
Saturation = 1.7631225
LumCoeff = 0.212500006,0.715399981,0.0720999986
Hue = 0
GaussianWeight = 0
AntiAliasScale = 0
DepthToAlpha = false
ShowDepth = false
DepthMagnitude = 2.1574344
Detail = -2.85559561
DetailAO = -7
FudgeFactor = 0.16805721
MaxDistance = 651.36475
MaxRaySteps = 309
Dither = 1 Locked
NormalBackStep = 0 NotLocked
AO = 0,0,0,0
Specular = 0.31942789
SpecularExp = 0
SpecularMax = 39.412485
SpotLight = 1,1,1,0.10488677
SpotLightDir = 0.59326114,-0.6654633
CamLight = 1,1,1,1.44934448
CamLightMin = 0.46722289
Glow = 1,1,1,0
GlowMax = 125
Fog = 0
HardShadow = 0 NotLocked
ShadowSoft = 6.6908214
QualityShadows = false
Reflection = 0 NotLocked
DebugSun = false NotLocked
BaseColor = 1,1,1
OrbitStrength = 0.44219309
X = 0.5,0.6,0.6,-0.12394704
Y = 1,0.6,0,0.4608905
Z = 0.8,0.78,1,-0.22984356
R = 0.4,0.7,1,-0.06137184
BackgroundColor = 0.05882353,0.07843137,0.1019608
GradientBackground = 0
CycleColors = false
Cycles = 0.1
EnableFloor = false NotLocked
FloorNormal = 0,0,1
FloorHeight = 0
FloorColor = 1,1,1
useActalDepth = false
Depth_1_3 = -0.804878,-2.2195122,-0.3902438
Depth_4_6 = -3.8292682,-1.8780486,0
Depth_7_9 = 0,0,0
Opacity_1_3 = 0.74016687,0.19427891,0.45649583
Opacity_4_6 = 0.12634088,0.46245531,1
Opacity_7_9 = 1,1,1
MaxSteps = 1
C = 4.4146342,2.3658538,-5.097561
Cw = 0.371430257
Log = 3.6233612,1.2693683,3.7127533
Scale = 3.25625748,2.45053636,0.10965436
Offset = 8.1951224,2.0975612,-13.609756
Slope = -0.85293498,-0.90529002,-0.69193742
Angle = 2.24195472,0.32896305
Smooth = 6.83482617
SFactor = 3.29468588
doInversion = false
InvPt = 1.4741276,-2.3044524,-1.0770156
InvRadius = 9.33043488
InvAngle = -1.707317
AnimSpeed = 0.166936829
AnimScale = 1.0628019
OpacityEgg = 0.14302742
OpacityTetra = 0.61859357
OpacityStar = 0.22765197
OpacityWater = 0.4636472
htMaxSteps = 24
htScale = 92.9008575
htCY = 2.32598331
htAngle1 = -1.93020456
htAngle2 = -1.7954272
htdoInversion = false
htinvX = -3.22984352
htinvY = 1.91095072
htinvZ = 1.26594472
htinvRadius = 3.14398092
htinvAngle = 0.56919375
sbSpeed = 0.230655546
sbSize = 2.69565201
WaterPosition = 1.7027678,2.2924188,-1.9915764
WaterTiltY = 2.29792613
WaterTiltZ = 0.285411207
WaveHeight = 0.116197854
WaveFreq = 0.379332538
WaveSpeed = 0.117377835
sbPosition = -8.6829268,-8.7317072,-2
sbThick = 1
#endpreset

#preset HaveASip
FOV = 0.33373064
Eye = 18.0715886,14.0724937,-5.80204608
Target = 10.3233234,6.92061947,-2.33966779
Up = 0.322130207,-0.308783974,0.083054515
EquiRectangular = false
AutoFocus = false
FocalPlane = 1
Aperture = 0
Gamma = 0.66746125
ToneMapping = 3
Exposure = 0.6579261
Brightness = 1.2455304
Contrast = 1.4958284
AvgLumin = 0.5,0.5,0.5
Saturation = 1.7631225
LumCoeff = 0.212500006,0.715399981,0.0720999986
Hue = 0
GaussianWeight = 1.9444445
AntiAliasScale = 1.4756447
DepthToAlpha = false
ShowDepth = false
DepthMagnitude = 6.578561
Detail = -2.85559561
DetailAO = -7
FudgeFactor = 0.16805721
MaxDistance = 651.36475
MaxRaySteps = 309
Dither = 1 Locked
NormalBackStep = 0 NotLocked
AO = 0,0,0,0.47659575
Specular = 0.02312925
SpecularExp = 41
SpecularMax = 39.412485
SpotLight = 1,1,1,0.54491019
SpotLightDir = 0.59326114,-0.6654633
CamLight = 1,1,1,1.30642752
CamLightMin = 0.31408451
Glow = 1,1,1,0.24098124
GlowMax = 125
Fog = 0.12057668
HardShadow = 0.08169014 NotLocked
ShadowSoft = 3.8983052
QualityShadows = false
Reflection = 0 NotLocked
DebugSun = false NotLocked
BaseColor = 1,1,1
OrbitStrength = 0.44219309
X = 0.5,0.6,0.6,-0.12394704
Y = 1,0.6,0,0.4608905
Z = 0.8,0.78,1,-0.22984356
R = 0.4,0.7,1,-0.06137184
BackgroundColor = 0.05882353,0.07843137,0.1019608
GradientBackground = 0
CycleColors = false
Cycles = 0.1
EnableFloor = false NotLocked
FloorNormal = 1,-1,0
FloorHeight = -0.8184319
FloorColor = 1,1,1
Depth_1_3 = -2.2797202,-1.6643356,-1.2447552
Depth_4_6 = -1.949509,10,10
Depth_7_9 = 10,10,10
useActalDepth = true
Opacity_1_3 = 1,1,0.67224547
Opacity_4_6 = 0.82377623,0.27132867,1
Opacity_7_9 = 1,1,1
MaxSteps = 1
C = 1.4882508,-2.8198432,-3.994778
Cw = 0.811121235
Log = 4.82961995,1.65137615,2.3591088
Scale = 1.6741722,2.95629144,1.13377484
Offset = 9.3080056,-13.595658,-13.7584804
Slope = -0.03871828,-0.69559412,-0.69193742
Angle = 2.11037235,0.26728725
Smooth = 1.89631647
SFactor = 5.14168918
doInversion = true
InvPt = 1.4741276,-2.3044524,-1.0770156
InvRadius = 9.33043488
InvAngle = -1.707317
AnimSpeed = 0.166936829
AnimScale = 1.0628019
OpacityEgg = 0.14302742
OpacityTetra = 0.61859357
OpacityStar = 0.22765197
OpacityWater = 0.4636472
htMaxSteps = 22
htScale = 93.8271609
htCY = 1.47749997
htAngle1 = -1.40273968
htAngle2 = -1.7954272
htdoInversion = true
htinvX = 1.1726908
htinvY = 1.82597064
htinvZ = 1.26594472
htinvRadius = 3.14398092
htinvAngle = 0.56919375
sbPosition = -8.2419128,-9.0295356,-3.7412096
sbThick = 20.5737708
sbSpeed = 0.542765668
sbSize = 3.9776725
WaterPosition = 2.1611984,3.9443653,2.3038517
WaterTiltY = 2.29792613
WaterTiltZ = 0.304882744
WaveHeight = 1
WaveFreq = 0.395679012
WaveSpeed = 0.078941501
#endpreset
