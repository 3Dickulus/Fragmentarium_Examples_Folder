#info Mixed IFS
#define providesInit
#include "MathUtils.frag"
#include "DE-Raytracer.frag"
#group TryptaIFS

uniform float Scale; slider[0.0,2.0,4.0]
uniform float Fatness; slider[0.0,0.0,1.0]
uniform float PhiMult; slider[0.0,1.0,2.0]

uniform vec3 Offset; slider[(-4.0,-4.0,-4.0),(0.0,0.0,0.0),(4.0,4.0,4.0)]
vec3 offset = Offset + vec3(1.0,0.0,0.0);

uniform vec3 Position; slider[(-10.0,-10.0,-10.0),(0.0,0.0,0.0),(10.0,10.0,10.0)]
uniform vec3 BoxPosition; slider[(-2.0,-2.0,-2.0),(0.0,0.0,0.0),(2.0,2.0,2.0)]
uniform vec3 BoxSize; slider[(0.0,0.0,0.0),(1.0,1.0,1.0),(2.0,2.0,2.0)] 
uniform int Tile; slider[0,0,3]
uniform vec3 TileOffset; slider[(0.0,0.0,0.0),(2.0,2.0,2.0),(10.0,10.0,10.0)]


uniform vec3 Julia; slider[(-2.0,-2.0,-2.0),(0.0,0.0,0.0),(2.0,2.0,2.0)]
uniform vec3 Fold; slider[(-2.0,-2.0,-2.0),(0.0,0.0,0.0),(2.0,2.0,2.0)]
uniform int Mode; slider[0,0,3]

uniform vec3 Rotate1; slider[(-1,-1,-1),(0,0,1),(1,1,1)]
uniform float Rotate1Angle;  slider[00.0,0.0,360.0]
uniform int Rotate1MinIter; slider[1,1,30]
uniform int Rotate1MaxIter; slider[1,30,30]

uniform vec3 Rotate2; slider[(-1,-1,-1),(1,1,1),(1,1,1)]
uniform float Rotate2Angle;  slider[0.0,0.0,360.0]
uniform int Rotate2MinIter; slider[1,1,30]
uniform int Rotate2MaxIter; slider[1,30,30]

uniform vec3 Rotate; slider[(-360.0,-360.0,-360.0),(0.0,0.0,0.0),(360.0,360.0,360.0)]

uniform int Iterations; slider[1,6,30]
uniform int ColorIterations; slider[1,6,30]
uniform float ColorScale; slider[0.0,1.0,2.0]
uniform float ColorOffset; slider[-2.0,1.0,2.0]
 
 
float Phi = 1.61803398875 * PhiMult;
vec3 n1 = normalize(vec3(-1.0,Phi-1.0,1.0/(Phi-1.0)));
vec3 n2 = normalize(vec3(Phi-1.0,1.0/(Phi-1.0),-1.0));
vec3 n3 = normalize(vec3(1.0/(Phi-1.0),-1.0,Phi-1.0));

mat3 fracRotation2;
mat3 fracRotation1;

void init() {
	fracRotation2 = rotationMatrix3(normalize(Rotate2.xyz),Rotate2Angle);
	fracRotation1 = rotationMatrix3(normalize(Rotate1.xyz),Rotate1Angle);
}

mat3 fullRotate = rotationMatrixXYZ(Rotate);

	
float sdBox( vec3 p, vec3 b )
{
  vec3 d = abs(p) - b;
  return min(max(d.x,max(d.y,d.z)),0.0) +
         length(max(d,0.0));
}

vec3 pyramid(vec3 z){
	if (z.x+z.y<0.0) z.xy = -z.yx;
	if (z.x-z.y<0.0) z.xy = z.yx;
	if (z.x-z.z<0.0) z.xz = z.zx;
	return z;
	}
	
vec3 menger(vec3 z){
	z = abs(z);
	if (z.x<z.y){ z.xy = z.yx;}
	if (z.x< z.z){ z.xz = z.zx;}
	if (z.y<z.z){ z.yz = z.zy;}
	return z;
	}
	
vec3 dodecahedron(vec3 z, vec3 n1, vec3 n2, vec3 n3){
	z-=2.0 * min(0.0, dot(z, n1)) * n1;
	z-=	2.0 * min(0.0, dot(z, n2)) * n2;
	z-=	2.0 * min(0.0, dot(z, n3)) * n3;
	z-=2.0 * min(0.0, dot(z, n1)) * n1;
	z-=	2.0 * min(0.0, dot(z, n2)) * n2;
	z-=	2.0 * min(0.0, dot(z, n3)) * n3;
	z-=2.0 * min(0.0, dot(z, n1)) * n1;
	z-=	2.0 * min(0.0, dot(z, n2)) * n2;
	z-=	2.0 * min(0.0, dot(z, n3)) * n3;
	return z;
	}

vec3 hybrid0(vec3 z, vec3 julia){
	z = menger(z);
	z += Julia;
	z = pyramid(z);
	return z;
}

vec3 hybrid1(vec3 z, vec3 julia){
	z = menger(z);
	z += Julia;
	z = dodecahedron(z,n1,n2,n3);
	return z;
}

vec3 hybrid2(vec3 z, vec3 julia){
	z = pyramid(z);
	z += Julia;
	z = dodecahedron(z,n1,n2,n3);
	return z;
}

vec3 hybrid3(vec3 z, vec3 julia){
	z = menger(z);
	z += Julia;
	z = pyramid(z);		
	z = dodecahedron(z,n1,n2,n3);
	return z;
}

vec3 Hybrid(vec3 z, vec3 julia){
	if (Mode == 0) z = hybrid0(z,julia);
	else if (Mode == 1) z = hybrid1(z,julia);
	else if (Mode == 2) z = hybrid2(z,julia);
	else if (Mode == 3) z = hybrid3(z,julia);
	
	return z;
}


// The fractal distance estimation calculation
float DE(vec3 z)
{
	float r;
	
	z += Position;
	
	if (Tile == 1) z = abs(-TileOffset-mod(z,2.0* -TileOffset));
	else if (Tile == 2) z = abs(2.0*TileOffset-mod(z-TileOffset,TileOffset*4.0))-TileOffset;
	else if (Tile == 3) {
		vec3 tileSc =TileOffset/3.0;
		z += tileSc;	
		z = -(clamp( -(clamp( z + TileOffset, -z, z) - TileOffset) + tileSc, -z, z) - tileSc);
	}
	z = z * fullRotate;
	
	// Iterate to compute the distance estimator.

	int n = 0;
	while (n < Iterations) {
		if (n >= Rotate1MinIter && n <= Rotate1MaxIter) z *= fracRotation1;
		
		z = Hybrid(z,Julia);
		
		z.xyz=abs(z.xyz+Fold)-Fold;
		z -= Julia;
		
		z = z*Scale - offset*(Scale-1.0);
		if (n >= Rotate2MinIter && n <= Rotate2MaxIter) z *= fracRotation2;
		
		r = dot(z, z);
        if (n< ColorIterations)  orbitTrap = min(orbitTrap, abs(vec4(z,r)));
        
		n++;
	}
	orbitTrap= orbitTrap * ColorScale+ColorOffset;
	return sdBox(z-BoxPosition,BoxSize) * pow(Scale, -float(n))-(Fatness * 0.1);

}

#preset Mode0_A
FOV = 0.373464
Eye = -1.90586,-3.05716,-1.52924
Target = 0.0920614,0.0164069,-0.0394998
Up = 0.192068,0.317177,-0.928713
AntiAlias = 1
Detail = -4.39824
DetailAO = -1.33
FudgeFactor = 1
MaxRaySteps = 198
BoundingSphere = 45.283
Dither = 0.40351
NormalBackStep = 1
AO = 0,0,0,0.77869
Specular = 0.8333
SpecularExp = 16
SpotLight = 1,1,1,0.32609
SpotLightDir = -0.4074,0.75308
CamLight = 1,1,1,1.26882
CamLightMin = 0.15151
Glow = 1,1,1,0.17778
GlowMax = 52
Fog = 0
HardShadow = 0
ShadowSoft = 12.5806
Reflection = 0
BaseColor = 1,1,1
OrbitStrength = 0.49505
X = 0.0862745,0.6,0.584314,0.47572
Y = 1,0.6,0,-0.35922
Z = 0.8,0.78,1,-0.20388
R = 0.4,0.7,1,0.31372
BackgroundColor = 0.666667,0.333333,0
GradientBackground = 0.3
CycleColors = true
Cycles = 11.6434
EnableFloor = false
FloorNormal = 0,0,0
FloorHeight = 0
FloorColor = 1,1,1
Scale = 2
Fatness = 0
PhiMult = 1
Position = 0,0,0
BoxPosition = 0,0,0
BoxSize = 1,1,1
Julia = 0.0495,-0.14852,0.28712
Fold = 0,0,-0.45098
Mode = 0
Rotate1 = 0.03614,0,1
Rotate = 0,0,0
Iterations = 6
ColorIterations = 6
ColorScale = 1
ColorOffset = 0
Rotate2 = 0,0,1
Rotate1Angle = 0
Rotate2Angle = 0
Tile = 3
Rotate1MinIter = 1
Rotate1MaxIter = 1
Rotate2MinIter = 2
Rotate2MaxIter = 2
TileOffset = 0,0,0
Offset = -0.21976,0.92304,0.04392
#endpreset

#preset Mode0_B
FOV = 0.368126
Eye = 0.0945804,-1.11393,0.0831085
Target = 1.33008,2.42693,1.34549
Up = 0.0775654,0.304366,-0.949392
AntiAlias = 1
Detail = -4.39824
DetailAO = -1.33
FudgeFactor = 1
MaxRaySteps = 198
BoundingSphere = 45.283
Dither = 0.40351
NormalBackStep = 1
AO = 0,0,0,0.77869
Specular = 0.8333
SpecularExp = 16
SpotLight = 1,1,1,0.32609
SpotLightDir = -0.4074,0.75308
CamLight = 1,1,1,1.26882
CamLightMin = 0.15151
Glow = 1,1,1,0.17778
GlowMax = 52
Fog = 0
HardShadow = 0
ShadowSoft = 12.5806
Reflection = 0
BaseColor = 1,1,1
OrbitStrength = 0.49505
X = 0.0862745,0.6,0.584314,0.47572
Y = 1,0.6,0,-0.35922
Z = 0.8,0.78,1,-0.20388
R = 0.4,0.7,1,0.31372
BackgroundColor = 0.666667,0.333333,0
GradientBackground = 0.3
CycleColors = true
Cycles = 11.6434
EnableFloor = false
FloorNormal = 0,0,0
FloorHeight = 0
FloorColor = 1,1,1
Scale = 2
Fatness = 0
PhiMult = 1
Position = 0,0,0
BoxPosition = 0,0,0
BoxSize = 1,1,1
Julia = -0.0495,-0.0099,0.12872
Fold = 0.0196,-0.11764,-0.4902
Mode = 0
Rotate1 = 0.03614,0,1
Rotate = 0,0,0
Iterations = 8
ColorIterations = 6
ColorScale = 1
ColorOffset = 0
Rotate2 = 0,0,1
Rotate1Angle = 0
Rotate2Angle = 0
Tile = 3
Rotate1MinIter = 1
Rotate1MaxIter = 1
Rotate2MinIter = 2
Rotate2MaxIter = 2
TileOffset = 0,0,0
Offset = 0.04392,1.80216,1.53848
#endpreset

#preset Mode0_C
FOV = 0.367105
Eye = -2.01905,-1.95129,-1.88327
Target = 0.0551268,-0.10829,-0.494203
Up = 0.25396,0.295433,-0.920991
AntiAlias = 1
Detail = -4.39824
DetailAO = -1.33
FudgeFactor = 1
MaxRaySteps = 198
BoundingSphere = 45.283
Dither = 0.40351
NormalBackStep = 1
AO = 0,0,0,0.77869
Specular = 0.8333
SpecularExp = 16
SpotLight = 1,1,1,0.32609
SpotLightDir = -0.4074,0.75308
CamLight = 1,1,1,1.26882
CamLightMin = 0.15151
Glow = 1,1,1,0.17778
GlowMax = 52
Fog = 0
HardShadow = 0
ShadowSoft = 12.5806
Reflection = 0
BaseColor = 1,1,1
OrbitStrength = 0.49505
X = 0.0862745,0.6,0.584314,0.47572
Y = 1,0.6,0,-0.35922
Z = 0.8,0.78,1,-0.20388
R = 0.4,0.7,1,0.31372
BackgroundColor = 0.666667,0.333333,0
GradientBackground = 0.3
CycleColors = true
Cycles = 11.6434
EnableFloor = false
FloorNormal = 0,0,0
FloorHeight = 0
FloorColor = 1,1,1
Scale = 2.099
Fatness = 0
PhiMult = 1
Position = 0,0,0
BoxPosition = -0.92536,-1.10448,0.20896
BoxSize = 1,1,1
Julia = -0.0297,0.0099,0.28712
Mode = 0
Rotate1 = 0.03614,0,1
Rotate = 0,0,0
Iterations = 8
ColorIterations = 6
ColorScale = 1
ColorOffset = 0
Rotate2 = 0,0,1
Rotate1Angle = 0
Rotate2Angle = 0
Tile = 0
Rotate1MinIter = 1
Rotate1MaxIter = 1
Rotate2MinIter = 2
Rotate2MaxIter = 2
TileOffset = 0,0,0
Offset = 0.93144,1.69512,0.31952
Fold = 0.27452,0.15688,0.23528
#endpreset

#preset Mode2A
FOV = 0.402288
Eye = -0.845544,0.438558,-1.06964
Target = 6.83344,1.90344,5.16632
Up = -0.0671821,0.986549,-0.14902
AntiAlias = 1
Detail = -4.83189
DetailAO = -0.5
FudgeFactor = 1
MaxRaySteps = 264
BoundingSphere = 12
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
BaseColor = 1,1,1
OrbitStrength = 1
X = 0.5,0.6,0.6,0.7
Y = 1,0.6,0,0.4
Z = 0.8,0.78,1,0.5
R = 0.4,0.7,1,0.12
BackgroundColor = 0.6,0.6,0.45
GradientBackground = 0.3
CycleColors = true
Cycles = 11.6434
EnableFloor = false
FloorNormal = 0,0,0
FloorHeight = 0
FloorColor = 1,1,1
Scale = 2
Fatness = 0.0113
PhiMult = 1
Offset = 0.48352,0.57144,1.36264
Position = 0,0,0
BoxPosition = -0.14924,-0.68656,0.68656
BoxSize = 1,1,1
Tile = 0
TileOffset = 2,2,2
Julia = 0.32674,-0.0099,-0.12872
Fold = -0.549,-0.0392,-0.07844
Mode = 2
Rotate1 = 0,0,1
Rotate1Angle = 0
Rotate1MinIter = 2
Rotate1MaxIter = 2
Rotate2 = 1,1,1
Rotate2Angle = 49.0896
Rotate2MinIter = 1
Rotate2MaxIter = 3
Rotate = 266.494,14.0256,42.0768
Iterations = 18
ColorIterations = 11
ColorScale = 0.89474
ColorOffset = 0
#endpreset

#preset Mode2_B
FOV = 0.401847
Eye = -1.73003,-0.209001,-1.84899
Target = 5.35553,0.0924179,5.20112
Up = 0.0304126,0.996855,-0.0731847
AntiAlias = 1
Detail = -4.83189
DetailAO = -0.5
FudgeFactor = 1
MaxRaySteps = 264
BoundingSphere = 12
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
BaseColor = 1,1,1
OrbitStrength = 1
X = 0.5,0.6,0.6,0.7
Y = 1,0.6,0,0.4
Z = 0.8,0.78,1,0.5
R = 0.4,0.7,1,0.12
BackgroundColor = 0.6,0.6,0.45
GradientBackground = 0.3
CycleColors = true
Cycles = 11.6434
EnableFloor = false
FloorNormal = 0,0,0
FloorHeight = 0
FloorColor = 1,1,1
Scale = 1.02972
Fatness = 0
PhiMult = 1
Offset = -1.89008,-2.24176,1.45056
Position = 0,0,0
BoxPosition = 0.32836,-0.14924,-0.20896
BoxSize = 1.15296,1.00696,0.58824
Tile = 0
TileOffset = 2,2.1918,3.8356
Julia = -0.50496,-0.0297,0.0891
Fold = 0.39216,-0.0052,-0.15688
Mode = 2
Rotate1 = -0.63856,-1,-0.03614
Rotate1MinIter = 1
Rotate1MaxIter = 30
Rotate2 = -0.06024,0.61446,1
Rotate2MinIter = 1
Rotate2MaxIter = 30
Rotate = 266.494,14.0256,42.0768
Iterations = 9
ColorIterations = 9
ColorScale = 0.89474
ColorOffset = 0
Rotate1Angle = 0
Rotate2Angle = 0
#endpreset

#preset Mode3_C
FOV = 0.399585
Eye = -0.608519,1.02383,-1.37988
Target = 4.9175,-3.01788,5.909
Up = 0.138981,0.990252,-0.00927426
AntiAlias = 1
Detail = -4.83189
DetailAO = -0.5
FudgeFactor = 1
MaxRaySteps = 264
BoundingSphere = 12
Dither = 0.5
NormalBackStep = 1
AO = 0,0,0,0.7
Specular = 4
SpecularExp = 16
SpotLight = 1,1,1,0.5
SpotLightDir = 0.28396,-0.06172
CamLight = 1,1,1,1.71014
CamLightMin = 0
Glow = 1,1,1,0
GlowMax = 20
Fog = 0
HardShadow = 0
ShadowSoft = 2
Reflection = 0
BaseColor = 1,1,1
OrbitStrength = 1
X = 0.5,0.6,0.6,0.7
Y = 1,0.6,0,0.4
Z = 0.8,0.78,1,0.5
R = 0.4,0.7,1,0.12
BackgroundColor = 0.6,0.6,0.45
GradientBackground = 0.3
CycleColors = true
Cycles = 11.6434
EnableFloor = false
FloorNormal = 0,0,0
FloorHeight = 0
FloorColor = 1,1,1
Scale = 1.74256
Fatness = 0
PhiMult = 1
Offset = 0.04392,0.8352,-0.12384
Position = 0,0,0
BoxPosition = -0.02984,0.32836,1.34328
Tile = 0
TileOffset = 2,2.1918,3.8356
Julia = 0.72278,0.78218,0.88118
Fold = -1.41176,-1.41176,-0.5098
Mode = 3
Rotate1 = -0.63856,-1,-0.03614
Rotate1MinIter = 1
Rotate1MaxIter = 30
Rotate2 = -0.06024,0.61446,1
Rotate2MinIter = 1
Rotate2MaxIter = 30
Rotate = 266.494,14.0256,42.0768
Iterations = 6
ColorIterations = 9
ColorScale = 0.89474
ColorOffset = 0
Rotate1Angle = 0
Rotate2Angle = 0
BoxSize = 1.15296,1.00696,0.58824
#endpreset

#preset Mode3_D
FOV = 0.397017
Eye = 0.749,2.06731,-1.12807
Target = -1.78522,-6.39053,3.56689
Up = 0.597091,0.540513,0.592729
AntiAlias = 1
Detail = -4.83189
DetailAO = -0.5
FudgeFactor = 1
MaxRaySteps = 264
BoundingSphere = 12
Dither = 0.5
NormalBackStep = 1
AO = 0,0,0,0.7
Specular = 4
SpecularExp = 16
SpotLight = 1,1,1,0.5
SpotLightDir = 0.28396,-0.06172
CamLight = 1,1,1,1.71014
CamLightMin = 0
Glow = 1,1,1,0
GlowMax = 20
Fog = 0
HardShadow = 0
ShadowSoft = 2
Reflection = 0
BaseColor = 1,1,1
OrbitStrength = 1
X = 0.5,0.6,0.6,0.7
Y = 1,0.6,0,0.4
Z = 0.8,0.78,1,0.5
R = 0.4,0.7,1,0.12
BackgroundColor = 0.6,0.6,0.45
GradientBackground = 0.3
CycleColors = true
Cycles = 11.6434
EnableFloor = false
FloorNormal = 0,0,0
FloorHeight = 0
FloorColor = 1,1,1
Scale = 1.74256
Fatness = 0
PhiMult = 1
Offset = 0.04392,0.8352,0.13184
Position = 0,0,0
BoxPosition = -0.02984,0.32836,1.34328
Tile = 0
TileOffset = 2,2.1918,3.8356
Julia = 0.72278,0.78218,0.88118
Fold = -1.41176,-1.41176,-0.5098
Mode = 3
Rotate1 = -0.63856,-1,-0.03614
Rotate1MinIter = 1
Rotate1MaxIter = 30
Rotate2 = -0.06024,0.61446,1
Rotate2MinIter = 1
Rotate2MaxIter = 30
Rotate = 266.494,14.0256,42.0768
Iterations = 6
ColorIterations = 9
ColorScale = 0.89474
ColorOffset = 0
Rotate1Angle = 0
Rotate2Angle = 0
BoxSize = 1.15296,1.00696,0.58824
#endpreset

#preset Mode3_E
FOV = 0.398853
Eye = 0.191329,1.31638,-0.624547
Target = -3.13492,-7.0604,3.70738
Up = 0.591534,0.490293,0.640078
AntiAlias = 1
Detail = -4.83189
DetailAO = -0.5
FudgeFactor = 1
MaxRaySteps = 264
BoundingSphere = 12
Dither = 0.5
NormalBackStep = 1
AO = 0,0,0,0.7
Specular = 4
SpecularExp = 16
SpotLight = 1,1,1,0.5
SpotLightDir = 0.28396,-0.06172
CamLight = 1,1,1,1.71014
CamLightMin = 0
Glow = 1,1,1,0
GlowMax = 20
Fog = 0
HardShadow = 0
ShadowSoft = 2
Reflection = 0
BaseColor = 1,1,1
OrbitStrength = 1
X = 0.5,0.6,0.6,0.7
Y = 1,0.6,0,0.4
Z = 0.8,0.78,1,0.5
R = 0.4,0.7,1,0.12
BackgroundColor = 0.6,0.6,0.45
GradientBackground = 0.3
CycleColors = true
Cycles = 11.6434
EnableFloor = false
FloorNormal = 0,0,0
FloorHeight = 0
FloorColor = 1,1,1
Scale = 1.74256
Fatness = 0
PhiMult = 1
Offset = 0.04392,0.8352,0.13184
Position = 0,0,0
BoxPosition = -0.02984,0.32836,1.34328
Tile = 0
TileOffset = 2,2.1918,3.8356
Julia = 0.72278,0.78218,0.88118
Fold = -1.41176,-1.41176,-0.5098
Mode = 3
Rotate1 = -0.63856,-1,-0.03614
Rotate1MinIter = 1
Rotate1MaxIter = 30
Rotate2 = -0.06024,0.61446,1
Rotate2MinIter = 1
Rotate2MaxIter = 30
Rotate = 266.494,14.0256,42.0768
Iterations = 8
ColorIterations = 9
ColorScale = 0.89474
ColorOffset = 0
Rotate1Angle = 0
Rotate2Angle = 0
BoxSize = 1.15296,1.00696,0.58824
#endpreset





#preset Default
FOV = 0.373464
Eye = -1.674736,-1.718905,-1.984118
Target = 0.3979786,0.4816383,0.5691726
Up = 0.3572327,0.5442386,-0.7590449
Detail = -4.39824
FudgeFactor = 1
MaxRaySteps = 198
Dither = 0.40351
NormalBackStep = 1
AO = 0,0,0,0.77869
SpecularExp = 16
SpotLight = 1,1,1,0.32609
SpotLightDir = -0.4074,0.75308
CamLight = 1,1,1,1.26882
CamLightMin = 0.15151
Glow = 1,1,1,0.17778
GlowMax = 52
Fog = 0
HardShadow = 0
ShadowSoft = 12.5806
Reflection = 0
BaseColor = 1,1,1
OrbitStrength = 0.4878049
X = 0.0862745,0.6,0.584314,0.47572
Y = 1,0.6,0,-0.35922
Z = 0.8,0.78,1,-0.20388
R = 0.4,0.7,1,0.31372
BackgroundColor = 0.666667,0.333333,0
GradientBackground = 0.3
CycleColors = true
Cycles = 26.02727
EnableFloor = false
FloorNormal = 0,0,0
FloorHeight = 0
FloorColor = 1,1,1
Scale = 2
Fatness = 0
PhiMult = 1
Offset = -0.21976,0.92304,0.04392
Position = 0,0,0
BoxPosition = 0,0,0
BoxSize = 1,1,1
Tile = 3
TileOffset = 0,0,0
Julia = 0.0495,-0.14852,0.28712
Fold = 0,0,-0.45098
Mode = 0
Rotate1 = 0.03614,0,1
Rotate1Angle = 0
Rotate1MinIter = 1
Rotate1MaxIter = 1
Rotate2 = 0,0,1
Rotate2Angle = 0
Rotate2MinIter = 2
Rotate2MaxIter = 2
Rotate = 0,0,0
Iterations = 6
ColorIterations = 6
ColorScale = 1
ColorOffset = 0
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
DetailAO = -1.33
MaxDistance = 1000
Specular = 0.8333
SpecularMax = 10
QualityShadows = false
DebugSun = false
#endpreset
