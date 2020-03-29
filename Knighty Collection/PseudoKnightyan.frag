 
// pseudo_knightyan by Knighty (Fractalforums.com/Fractalforums.org)

#define WANG_HASH
#define USE_IQ_CLOUDS
#define KN_VOLUMETRIC
#define USE_EIFFIE_SHADOW
#define MULTI_SAMPLE_AO

#include "MathUtils.frag"
#include "DE-Kn2cr11.frag"

#group Pseudo_Knightyan
uniform vec3 CSize;slider[(-2,-2,-2),(0,0,0),(2,2,2)]
uniform float Size;slider[-2,0.70968,2]
uniform float DEfactor;slider[0,1,10]
uniform float TwiddleRXY;slider[-2,0.92784,2]
uniform int Iter;slider[0,9,100]
uniform int ColorIterations;slider[0,9,100]


float DE(vec3 p)
	{
		float j=DEfactor;
		for(int i=0;i<Iter;i++){
			p = 2.*clamp(p, -CSize, CSize)-p;
			float k = max(Size/dot(p,p),1.);
			p *= k;
			j *= k + 0.05;
			float r2 = dot(p, p);
			if (i<ColorIterations) orbitTrap = min(orbitTrap, abs(vec4(p.xyz,r2)));
		}
	float rxy=length(p.xy);
	return max(rxy-TwiddleRXY, abs(rxy*p.z) / length(p))/j;
	}



#preset Default
FOV = 0.7280757
Eye = -0.2225915,0.3560253,1.94843
Target = 4.863723,-8.019526,2.133084
Up = 0.0745643,0.0244658,-0.9441572
EquiRectangular = false
Gamma = 1
ToneMapping = 5
Exposure = 1
Brightness = 1
Contrast = 1
Saturation = 1
GaussianWeight = 1
AntiAliasScale = 1
DepthToAlpha = false
ShowDepth = false
DepthMagnitude = 1
Detail = -3.5
FudgeFactor = 1
NormalBackStep = 1
CamLight = 1,0.8470588,0.6313725,1.692492
BaseColor = 1,1,1
OrbitStrength = 1
X = 0.5,0.6,0.6,0.0652034
Y = 1,0.6,0,0.5171078
Z = 0.8,0.78,1,-0.1736604
R = 0.4,0.7,1,0.6136951
BackgroundColor = 0.9019608,0.9647059,0.9921569
GradientBackground = 1.259947
CycleColors = true
Cycles = 1.893691
EnableFloor = false
FloorNormal = 0,0,0
FloorHeight = 0
FloorColor = 1,1,1
FocalPlane = 0.9621905
Aperture = 0.0724734
InFocusAWidth = 1
DofCorrect = true
ApertureNbrSides = 7
ApertureRot = 0
ApStarShaped = false
Bloom = false
BloomIntensity = 1.019737
BloomPow = 4.899154
BloomTaps = 36
BloomStrong = 3.255082
RotXYZ = 0,0,0
MovXYZ = 0,0,0
FineMove = 0,0,0
TerrIter = 10
TerrSlope = -0.7
TerrFreq = 2
TerrOffset = 0.4
TerrAmp = 0.3
WaveDir = 0,0,1
WaveSpeed = 1
RefineSteps = 4
MaxRaySteps = 201
MaxDistance = 24
Dither = 0
DetailAO = -0.8381271
coneApertureAO = 0.1036745
maxIterAO = 11
FudgeAO = 0.8522727
AO_ambient = 1.462888
AO_camlight = 1.573261
AO_pointlight = 0.2127371
AoCorrect = 0.2030831
Specular = 1.4
SpecularExp = 16
AmbiantLight = 0.7098039,0.8862745,1,0
Reflection = 0.5490196,0.5490196,0.5490196
ReflectionsNumber = 2
SpotGlow = true
SpotLight = 1,0.9098039,0.7921569,0.8421751
LightPos = 1.061419,1.490757,2.16436
LightSize = 0.2763073
LightFallOff = 0.1291866
LightGlowRad = 1.125171
LightGlowExp = 3.127047
HardShadow = 0.9849673
ShadowSoft = 0
ShadowBlur = 0
perf = false
SSS = false
sss1 = 0.0210191
sss2 = 0.5350318
HF_Fallof = 2.800458
HF_Const = 0.0641849
HF_Intensity = 0.0434219
HF_Dir = 0,0,1
HF_Offset = 2.142395
HF_Color = 0.2705882,0.3843137,0.4352941,0.9633748
HF_Scatter = 0
HF_Anisotropy = 0,0,0
HF_FogIter = 1
HF_CastShadow = false
EnCloudsDir = false
CloudDir = 0,0,1
CloudScale = 1
CloudFlatness = 0
CloudTops = 1
CloudBase = -1
CloudDensity = 1
CloudRoughness = 1
CloudContrast = 1
CloudColor = 0.65,0.68,0.7
CloudColor2 = 0.07,0.17,0.24
SunLightColor = 0.7,0.5,0.3
Cloudvar1 = 0.99
Cloudvar2 = 1
CloudIter = 5
CloudBgMix = 1
WindDir = 0,0,1
WindSpeed = 1
CSize = 0.485771,0.8034414,1.062872
Size = 0.70968
DEfactor = 1
TwiddleRXY = 0.8412322
Iter = 9
ColorIterations = 3
#endpreset
