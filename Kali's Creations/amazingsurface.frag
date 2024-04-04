#info Amazing Surface by Kali - Based on Tglad's Amazing Box
#define providesInit
#include "MathUtils.frag"
#include "DE-Raytracer.frag"


#group AmazingSurface


uniform int Iterations;  slider[0,17,300]
uniform int ColorIterations;  slider[0,3,300]
uniform float MinRad2;  slider[0.00001,0.25,2.0]
uniform float Scale;  slider[-3,1.5,3.0]
uniform int FoldType; slider[1,1,3]
uniform vec3 PreTranslation; slider[(-5,-5,-5),(0,0,0),(5,5,5)]
uniform vec2 FoldValues; slider[(0,0),(1,1),(5,5)]
uniform bool Julia; checkbox[false]
uniform vec3 JuliaValues; slider[(-5,-5,-5),(-1,-1,-1),(5,5,5)]
uniform vec3 RotVector; slider[(-1,-1,-1),(1,1,1),(1,1,1)]
uniform float RotAngle; slider[-180,0,180]

mat3 rot;

void init() {
	 rot = rotationMatrix3(normalize(RotVector), RotAngle);
}

vec4 scale = vec4(Scale, Scale, Scale, abs(Scale));
float absScalem1 = abs(1.-Scale);
float AbsScaleRaisedTo1mIters = pow(abs(Scale), float(1-Iterations));

float DE(vec3 pos) {
	vec4 p = vec4(pos,1);
	vec4 c = Julia?vec4(JuliaValues,1):p;
	for (int i=0; i<Iterations; i++) {
		if (FoldType==1) p.xy=abs(p.xy+FoldValues)-abs(p.xy-FoldValues)-p.xy;
		if (FoldType==2) p.xy=FoldValues-abs(abs(p.xy)-FoldValues);
		if (FoldType==3) p.xy=abs(p.xy+FoldValues);
		p.xyz+=PreTranslation;
		float r2 = dot(p.xyz, p.xyz);
		if (i<ColorIterations) orbitTrap = min(orbitTrap, abs(vec4(p.xyz,r2)));
		p*= scale/clamp(r2,MinRad2,1.0);
		p+=c;
		p.xyz*=rot;
	}
	return ((length(p.xyz) - absScalem1) / p.w - AbsScaleRaisedTo1mIters);
}




#preset Default
FOV = 0.6
Eye = -2.51515,-3.42744,-1.25686
Target = -0.400956,-2.26435,0.787021
Up = 0.100804,0.0424643,-0.128436
EquiRectangular = false
FocalPlane = 1
Aperture = 0
Gamma = 1
ToneMapping = 1
Exposure = 1
Brightness = 1
Contrast = 1
Saturation = 1
GaussianWeight = 1
AntiAliasScale = 2
Detail = -3.53094
DetailAO = -2.21431
FudgeFactor = 1
MaxRaySteps = 242
Dither = 0
NormalBackStep = 1.8333 NotLocked
AO = 0,0,0,0.95062
SpecularExp = 10.909
SpecularMax = 10
SpotLight = 1,1,1,0.54902
SpotLightDir = -0.375,0.1
CamLight = 1,1,1,1
CamLightMin = 0
Glow = 1,1,1,0.15068
GlowMax = 124
Fog = 0.57408
HardShadow = 0 NotLocked
ShadowSoft = 2
Reflection = 0
DebugSun = false
BaseColor = 1,1,1
OrbitStrength = 1
X = 0.5,0.6,0.6,0.53398
Y = 1,0.6,0,0.57282
Z = 0.8,0.78,1,0.5534
R = 0.4,0.7,1,0
BackgroundColor = 0.490196,0.564706,0.6
GradientBackground = 0.76085
CycleColors = false
Cycles = 1.1
EnableFloor = false
FloorNormal = 0,0,1
FloorHeight = 0
FloorColor = 1,1,1
Iterations = 20
ColorIterations = 8
MinRad2 = 0.25
Scale = 1.7
FoldType = 1
PreTranslation = 0,0,0
FoldValues = 1,1
Julia = true
JuliaValues = 0.5,0.2,-0.75
RotVector = 0,1,0
RotAngle = -65.4552
#endpreset


#preset 1
FOV = 0.60162
Eye = 2.78918,0.824937,1.32186
Target = 0.673547,-1.05863,-0.0839674
Up = -0.3338,-0.289855,0.890693
EquiRectangular = false
FocalPlane = 1
Aperture = 0
Gamma = 1
ToneMapping = 1
Exposure = 1
Brightness = 1
Contrast = 1
Saturation = 1
GaussianWeight = 1
AntiAliasScale = 2
Detail = -2.53981
DetailAO = -0.92855
FudgeFactor = 0.66265
MaxRaySteps = 264
Dither = 0
NormalBackStep = 1.8333 NotLocked
AO = 0,0,0,1
SpecularExp = 10.909
SpecularMax = 10
SpotLight = 1,1,1,0.41176
SpotLightDir = 0.1,0.1
CamLight = 1,1,1,1
CamLightMin = 0
Glow = 1,1,1,0.15068
GlowMax = 124
Fog = 0.4074
HardShadow = 0
ShadowSoft = 2
Reflection = 0
DebugSun = false
BaseColor = 1,1,1
OrbitStrength = 1
X = 0.5,0.6,0.6,0.53398
Y = 1,0.6,0,0.57282
Z = 0.8,0.78,1,0.5534
R = 0.4,0.7,1,0
BackgroundColor = 0.490196,0.564706,0.6
GradientBackground = 0.76085
CycleColors = false
Cycles = 1.1
EnableFloor = false
FloorNormal = 0,0,1
FloorHeight = 0
FloorColor = 1,1,1
Iterations = 30
ColorIterations = 11
FoldValues = 0.6989,2.69735
Julia = true
JuliaValues = -1.7045,-3.75,-0.2273
RotVector = 1,0,1
RotAngle = 180
Scale = 1.89474
MinRad2 = 0.23539
FoldType = 1
PreTranslation = 0,0,0
#endpreset



#preset 2
FOV = 0.4
Eye = 1.29284,1.71798,-0.439624
Target = 0.148572,-1.22997,-0.425003
Up = 0.231612,-0.0850954,0.969043
EquiRectangular = false
FocalPlane = 1
Aperture = 0
Gamma = 1
ToneMapping = 1
Exposure = 1
Brightness = 1
Contrast = 1
Saturation = 1
GaussianWeight = 1
AntiAliasScale = 2
Detail = -3.59289
DetailAO = -1.7857
FudgeFactor = 0.42169
MaxRaySteps = 264
Dither = 0
NormalBackStep = 1.8333 NotLocked
AO = 0,0,0,1
SpecularExp = 10.909
SpecularMax = 10
SpotLight = 1,0.976471,0.776471,0.37255
SpotLightDir = 0.15626,0.1
CamLight = 1,1,1,0.5
CamLightMin = 0
Glow = 1,1,1,0.35616
GlowMax = 247
Fog = 0.57408
HardShadow = 0
ShadowSoft = 2
Reflection = 0
DebugSun = false
BaseColor = 1,1,1
OrbitStrength = 1
X = 0.5,0.6,0.6,0.53398
Y = 1,0.654902,0.309804,0.72816
Z = 0.8,0.78,1,0.5534
R = 0.4,0.7,1,-0.03922
BackgroundColor = 1,1,1
GradientBackground = 0.5435
CycleColors = false
Cycles = 1.1
EnableFloor = false
FloorNormal = 0,0,1
FloorHeight = 0
FloorColor = 1,1,1
Iterations = 30
ColorIterations = 15
FoldValues = 1.66665,1.7742
Julia = false
JuliaValues = -1.7045,-1.25,-0.2273
RotVector = 0.3913,-1,0.02174
RotAngle = 23.8572
Scale = 1.89474
MinRad2 = 0.11773
FoldType = 1
PreTranslation = 0,0,0
#endpreset



#preset 3
FOV = 0.4
Eye = 0.0548953,-1.55221,2.63175
Target = -0.911411,-0.615107,-0.229753
Up = 0.951872,0.118745,-0.282553
EquiRectangular = false
FocalPlane = 1
Aperture = 0
Gamma = 1
ToneMapping = 1
Exposure = 1
Brightness = 1
Contrast = 1
Saturation = 1
GaussianWeight = 1
AntiAliasScale = 2
Detail = -2.97346
DetailAO = -0.85715
FudgeFactor = 0.46988
MaxRaySteps = 286
Dither = 0
NormalBackStep = 1.8333 NotLocked
AO = 0,0,0,0.7284
SpecularExp = 16.364
SpecularMax = 10
SpotLight = 1,1,1,0.5098
SpotLightDir = 0,0.03126
CamLight = 1,1,1,0.38462
CamLightMin = 0
Glow = 1,1,1,0.38356
GlowMax = 289
Fog = 0.5
HardShadow = 0
ShadowSoft = 2
Reflection = 0
DebugSun = false
BaseColor = 1,1,1
OrbitStrength = 0.83117
X = 0.5,0.6,0.6,1
Y = 1,0.6,0,0.51456
Z = 0.8,0.78,1,0.32038
R = 0.4,0.7,1,-0.03922
BackgroundColor = 0.439216,0.478431,0.552941
GradientBackground = 1.19565
CycleColors = false
Cycles = 1.1
EnableFloor = false
FloorNormal = 0,0,1
FloorHeight = 0
FloorColor = 1,1,1
Iterations = 30
ColorIterations = 20
FoldValues = 0,0.7527
Julia = true
JuliaValues = -2.6136,-1.1364,-1.2836
RotVector = -0.32608,-0.02174,0.02174
RotAngle = 46.1484
Scale = 1.48614
MinRad2 = 0.11765
FoldType = 1
PreTranslation = 0,0,0
#endpreset




#preset 4
FOV = 0.4
Eye = -1.74368,0.274082,0.214375
Target = -2.94118,-2.44933,-0.857582
Up = -0.197446,-0.282654,0.938681
EquiRectangular = false
FocalPlane = 1
Aperture = 0
Gamma = 1
ToneMapping = 1
Exposure = 1
Brightness = 1
Contrast = 1
Saturation = 1
GaussianWeight = 1
AntiAliasScale = 2
Detail = -3.28321
DetailAO = -1.28569
FudgeFactor = 0.49398
MaxRaySteps = 352
Dither = 0
NormalBackStep = 1.8333 NotLocked
AO = 0,0,0,1
SpecularExp = 14.545
SpecularMax = 10
SpotLight = 1,1,1,0.54902
SpotLightDir = 0.1875,0.46876
CamLight = 1,1,1,0.61538
CamLightMin = 0.21212
Glow = 1,1,1,0
GlowMax = 289
Fog = 0.44444
HardShadow = 0
ShadowSoft = 2
Reflection = 0
DebugSun = false
BaseColor = 1,1,1
OrbitStrength = 0.8961
X = 0.5,0.6,0.6,1
Y = 1,0.6,0,1
Z = 0.8,0.78,1,0.20388
R = 0.4,0.7,1,-0.05882
BackgroundColor = 0.54902,0.509804,0.447059
GradientBackground = 1.30435
CycleColors = false
Cycles = 1.1
EnableFloor = false
FloorNormal = 0,0,1
FloorHeight = 0
FloorColor = 1,1,1
Iterations = 25
ColorIterations = 20
FoldValues = 1.57895,0.7237
Julia = false
JuliaValues = -1.338,-1.1364,-1.2836
RotVector = 1,-1,0.6
RotAngle = -38.1816
Scale = 1.39176
MinRad2 = 0.05753
FoldType = 3
PreTranslation = -0.8182,-0.8182,0
#endpreset



#preset 5
FOV = 0.4
Eye = -2.02194,-1.26618,-0.0876938
Target = -2.07079,1.8166,-0.790659
Up = -0.00266045,0.21878,0.95962
EquiRectangular = false
FocalPlane = 1
Aperture = 0
Gamma = 1
ToneMapping = 1
Exposure = 1
Brightness = 1
Contrast = 1
Saturation = 1
GaussianWeight = 1
AntiAliasScale = 2
Detail = -3.28321
DetailAO = -1.14289
FudgeFactor = 0.44578
MaxRaySteps = 352
Dither = 0
NormalBackStep = 1.8333 NotLocked
AO = 0,0,0,0.88889
SpecularExp = 14.545
SpecularMax = 10
SpotLight = 1,0.909804,0.584314,0.52941
SpotLightDir = -0.125,-1
CamLight = 1,1,1,1.11538
CamLightMin = 0.5
Glow = 1,1,1,0
GlowMax = 289
Fog = 0.51852
HardShadow = 0
ShadowSoft = 2
Reflection = 0
DebugSun = false
BaseColor = 1,1,1
OrbitStrength = 1
X = 0.5,0.6,0.6,1
Y = 1,0.596078,0.0313725,0.84466
Z = 0.8,0.78,1,0.26214
R = 0.4,0.7,1,-0.0196
BackgroundColor = 0.54902,0.509804,0.447059
GradientBackground = 0
CycleColors = false
Cycles = 1.1
EnableFloor = false
FloorNormal = 0,0,1
FloorHeight = 0
FloorColor = 1,1,1
Iterations = 25
ColorIterations = 20
FoldValues = 2.03945,0.5921
Julia = true
JuliaValues = -1.4789,-0.9155,-0.3521
RotVector = 1,-0.6,0.14666
RotAngle = -32.2632
Scale = 1.3299
MinRad2 = 0.25883
FoldType = 3
PreTranslation = -0.8182,-0.8182,0
#endpreset



#preset 6
FOV = 0.4878
Eye = -2.53692,-0.465105,-0.00992148
Target = -2.51804,-3.61506,-0.288198
Up = 0.0322806,-0.0877623,0.995618
EquiRectangular = false
FocalPlane = 1
Aperture = 0
Gamma = 1
ToneMapping = 1
Exposure = 1
Brightness = 1
Contrast = 1
Saturation = 1
GaussianWeight = 1
AntiAliasScale = 2
Detail = -4.70799
DetailAO = -1.00002
FudgeFactor = 0.49398
MaxRaySteps = 396
Dither = 0.33333
NormalBackStep = 1.8333 NotLocked
AO = 0,0,0,1
SpecularExp = 14.545
SpecularMax = 10
SpotLight = 1,1,1,0.45098
SpotLightDir = 0.34376,1
CamLight = 1,1,1,1
CamLightMin = 0.21212
Glow = 1,1,1,0
GlowMax = 82
Fog = 0.72222
HardShadow = 0.53846
ShadowSoft = 20
Reflection = 0
DebugSun = false
BaseColor = 1,1,1
OrbitStrength = 0.77922
X = 0.5,0.6,0.6,1
Y = 1,0.6,0,0.37864
Z = 0.8,0.78,1,-0.3398
R = 0.4,0.7,1,-0.0196
BackgroundColor = 0.568627,0.568627,0.568627
GradientBackground = 1.19565
CycleColors = false
Cycles = 1.1
EnableFloor = false
FloorNormal = 0,0,1
FloorHeight = 0
FloorColor = 1,1,1
Iterations = 30
ColorIterations = 25
FoldValues = 1.51315,0.78945
Julia = false
JuliaValues = -1.338,-1.1364,-1.2836
RotVector = 0.84,-0.30666,1
RotAngle = -31.2444
Scale = 1.26066
MinRad2 = 1e-05
FoldType = 3
PreTranslation = -1,-0.7082,0
#endpreset



#preset 7
FOV = 1.00814
Eye = -0.849631,-1.98402,-0.224024
Target = -1.06375,0.644351,1.52121
Up = -0.0874477,0.546086,-0.833152
EquiRectangular = false
FocalPlane = 1
Aperture = 0
Gamma = 1
ToneMapping = 1
Exposure = 1
Brightness = 1
Contrast = 1
Saturation = 1
GaussianWeight = 1
AntiAliasScale = 2
Detail = -2.78761
DetailAO = -1.00002
FudgeFactor = 0.77108
MaxRaySteps = 396
Dither = 0.33333
NormalBackStep = 1.8333 NotLocked
AO = 0,0,0,1
SpecularExp = 14.545
SpecularMax = 10
SpotLight = 1,1,1,0
SpotLightDir = 0.59376,-0.15624
CamLight = 1,1,1,0.65384
CamLightMin = 0.21212
Glow = 1,1,1,0.21918
GlowMax = 82
Fog = 0.66666
HardShadow = 0.55385
ShadowSoft = 8.387
Reflection = 0
DebugSun = false
BaseColor = 1,1,1
OrbitStrength = 0.49351
X = 0.5,0.6,0.6,-0.96116
Y = 1,0.6,0,1
Z = 0.8,0.78,1,-0.4369
R = 0.4,0.7,1,0.29412
BackgroundColor = 0.568627,0.568627,0.568627
GradientBackground = 0.5435
CycleColors = false
Cycles = 1.1
EnableFloor = false
FloorNormal = 0,0,1
FloorHeight = 0
FloorColor = 1,1,1
Iterations = 25
ColorIterations = 9
MinRad2 = 1e-05
Scale = 1.39176
FoldType = 2
PreTranslation = -1,-0.6364,0.0909
FoldValues = 2.03945,0.85525
Julia = true
JuliaValues = -0.6338,-1.1952,-1.4789
RotVector = 1,0,0
RotAngle = -125.453
#endpreset
