
#info Ultimate Anti-Buddhagram (c) 2019 Claude Heiland-Allen
#info <https://mathr.co.uk/blog.2019-11-20_ultimate_anti-buddhagram.html>

#define providesInit
#define providesColor
#define WANG_HASH
#include "MathUtils.frag"
#include "DE-Raytracer.frag"
#include "Complex.frag"

#group Buddhagram

uniform int MaxPeriod; slider[1,10,1000]
uniform float SliceBase; slider[-2,0,2]
uniform float SliceDepth; slider[0,4,8]
float Slice;
uniform float Thickness; slider[1e-5,1e-2,1] Logarithmic

uniform float Angle1; slider[-1,0,1]
uniform vec3 Rotation1; slider[(-1,-1,-1),(0,0,1),(1,1,1)]
uniform float Angle2; slider[-1,0,1]
uniform vec3 Rotation2; slider[(-1,-1,-1),(0,0,1),(1,1,1)]
uniform vec4 Center; slider[(-2,-2,-2,-2),(0,0,0,0),(2,2,2,2)]
uniform float Zoom; slider[1e-5,1,1e5] Logarithmic

uniform float ColorSpeed; slider[0,0.5,10]

uniform float time;

const float pi = 3.141592653589793;

// quaternion exponential
vec4 qExp(vec4 q)
{
  float s   = q[0];
  float v0  = q[1];
  float v1  = q[2];
  float v2  = q[3];
  float vn  = sqrt(v0*v0 + v1*v1 + v2*v2);
  float vnc = cos(vn);
  float vns = vn > 0.0 ? sin(vn) / vn : 0.0;
  float se  = exp(s);
  vec4 r;
  r[0] = se * vnc;
  r[1] = v0 * vns;
  r[2] = v1 * vns;
  r[3] = v2 * vns;
  return r;
}

// 4D rotation matrix from two quaternions
mat4 qMatrix(vec4 p, vec4 q)
{
  mat4 m;
  float q0, q1, q2, q3, p0, p1, p2, p3;
  q0 = q[0]; q1 = q[1]; q2 = q[2]; q3 = q[3];
  p0 = p[0]; p1 = p[1]; p2 = p[2]; p3 = p[3];
  m[0][0] =   q0*p0 + q1*p1 + q2*p2 + q3*p3;
  m[0][1] =   q1*p0 - q0*p1 - q3*p2 + q2*p3;
  m[0][2] =   q2*p0 + q3*p1 - q0*p2 - q1*p3;
  m[0][3] =   q3*p0 - q2*p1 + q1*p2 - q0*p3;
  m[1][0] = - q1*p0 + q0*p1 - q3*p2 + q2*p3;
  m[1][1] =   q0*p0 + q1*p1 - q2*p2 - q3*p3;
  m[1][2] = - q3*p0 + q2*p1 + q1*p2 - q0*p3;
  m[1][3] =   q2*p0 + q3*p1 + q0*p2 + q1*p3;
  m[2][0] = - q2*p0 + q3*p1 + q0*p2 - q1*p3;
  m[2][1] =   q3*p0 + q2*p1 + q1*p2 + q0*p3;
  m[2][2] =   q0*p0 - q1*p1 + q2*p2 - q3*p3;
  m[2][3] = - q1*p0 - q0*p1 + q3*p2 + q2*p3;
  m[3][0] = - q3*p0 - q2*p1 + q1*p2 + q0*p3;
  m[3][1] = - q2*p0 + q3*p1 - q0*p2 + q1*p3;
  m[3][2] =   q1*p0 + q0*p1 + q3*p2 + q2*p3;
  m[3][3] =   q0*p0 - q1*p1 - q2*p2 + q3*p3;
  return m;
}

mat4 M;
void init(void)
{
  float phi1 = (sqrt(5.0) - 1.0) / 2.0;
  float random = rand(time + rand(gl_FragCoord.x + rand(gl_FragCoord.y)));
  float dither = mod(phi1 * (float(subframe) + random) + 0.5, 1.0) - 0.5;
  Slice = SliceBase + SliceDepth * dither;
  M = qMatrix
    ( qExp(vec4(0.0, pi * Angle1 * normalize(Rotation1)))
    , qExp(vec4(0.0, pi * Angle2 * normalize(Rotation2)))
    );
}

float DE(vec4 cz)
{
  vec2 c = cz.xy;
  vec2 z0 = cz.zw;
  vec2 z = z0;
  vec2 dz = vec2(1.0, 0.0);
  float de = 1.0 / 0.0;
  for (int p = 0; p < MaxPeriod; ++p)
  {
    dz = 2.0 * cMul(dz, z);
    z = cSqr(z) + c;
    if (dot(z, z) > 1000.0) break;
    if (dot(dz, dz) > 1000.0) break;
    float de1 = max(length(z - z0), length(dz) - 1.0);
    de = min(de, de1);
  }
  return 0.25 * (de - Thickness);
}

vec3 periodColor(int p)
{
  vec3 ColorBase = vec3(3.0,2.0,1.0) * pi / 3.0;
  vec3 adj = vec3(ColorSpeed * float(p - 1));
  return (vec3(0.5) + 0.5 * cos(ColorBase + adj)) / float(p);
}

vec3 baseColor(vec3 pos, vec3 normal) {
  vec4 cz = vec4(pos, Slice);
  cz *= M;
  cz *= Zoom;
  cz += Center;
  vec2 c = cz.xy;
  vec2 z0 = cz.zw;
  vec2 z = z0;
  vec2 dz = vec2(1.0, 0.0);
  vec4 color = vec4(0.0);
  for (int p = 1; p <= MaxPeriod; ++p)
  {
    dz = 2.0 * cMul(dz, z);
    z = cSqr(z) + c;
    if (dot(z, z) > 1000.0) break;
    if (dot(dz, dz) > 1000.0) break;
    float de1 = max(length(z - z0), length(dz) - 1.0) - Thickness;
    color += clamp(vec4(periodColor(p), 1.0) / (1e-10 + abs(de1)), 0.0, 1e20);
  }
  return color.rgb / color.a * 20.0;
}

float DE(vec3 pos) {
  vec4 cz = vec4(pos, Slice);
  cz *= M;
  cz *= Zoom;
  cz += Center;
  return DE(cz);
}

#preset Mandelbrot
FOV = 0.4
Eye = 0,0,-4
Target = 0,0,0
Up = 0,1,0
EquiRectangular = false
AutoFocus = false
FocalPlane = 1.025
Aperture = 0
Gamma = 2
ToneMapping = 4
Exposure = 3
Brightness = 5
Contrast = 1
AvgLumin = 0.5,0.5,0.5
Saturation = 1
LumCoeff = 0.212500006,0.715399981,0.0720999986
Hue = 0
GaussianWeight = 1
AntiAliasScale = 2
DepthToAlpha = false
ShowDepth = false
DepthMagnitude = 1
Detail = -5
DetailAO = -4
FudgeFactor = 1
MaxDistance = 1000
MaxRaySteps = 256
Dither = 0.5 Locked
NormalBackStep = 1
AO = 0,0,0,0.64795919
Specular = 0.4
SpecularExp = 41.884817
SpecularMax = 10
SpotLight = 1,1,1,0.400000006
SpotLightDir = 0.100000001,0.34476846
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
BaseColor = 1,1,1
OrbitStrength = 1
X = 0.5,0.600000024,0.600000024,0.699999988
Y = 1,0.600000024,0,0.400000006
Z = 0.800000012,0.779999971,1,0.5
R = 0.400000006,0.699999988,1,0.119999997
BackgroundColor = 0,0,0
GradientBackground = 0.3
CycleColors = false
Cycles = 1.1
EnableFloor = false
FloorNormal = 0,0,1
FloorHeight = 0
FloorColor = 1,1,1
TrigIter = 5
TrigLimit = 1.10000000000000009
MaxPeriod = 60
SliceDepth = 4
SliceBase = 0
Thick = 0.01
Angle1 = -1
Rotation1 = 0,0,1
Angle2 = 0
Rotation2 = 0,0,1
Center = -0.400000006,0,-0.400000006,0
Zoom = 1
#endpreset



#preset Lobster
FOV = 0.4
Eye = -0.316849924,-2.01670454,1.52978143
Target = -0.23872563,0.857424268,-1.25109615
Up = -0.203022354,-0.678014877,-0.706454352
EquiRectangular = false
Gamma = 2
ToneMapping = 4
Exposure = 3
Brightness = 5
Contrast = 1
Saturation = 1
GaussianWeight = 1
AntiAliasScale = 2
DepthToAlpha = false
ShowDepth = false
DepthMagnitude = 1
Detail = -5
FudgeFactor = 1
NormalBackStep = 1
CamLight = 1,1,1,2
BaseColor = 1,1,1
OrbitStrength = 1
X = 0.5,0.600000024,0.600000024,0.699999988
Y = 1,0.600000024,0,0.400000006
Z = 0.800000012,0.779999971,1,0.5
R = 0.400000006,0.699999988,1,0.119999997
BackgroundColor = 0,0,0
GradientBackground = 0.3
CycleColors = false
Cycles = 1.1
EnableFloor = false
FloorNormal = 0,0,1
FloorHeight = 0
FloorColor = 1,1,1
TrigIter = 5
TrigLimit = 1.10000000000000009
MaxPeriod = 360
SliceDepth = 0.5
SliceBase = -0.95254832
Thick = 0.01
Angle1 = -0.0648464
Rotation1 = 0,-0.54929578,0.08450706
Angle2 = 0.2013652
Rotation2 = 0,0,1
Center = 0,0,0,0
Zoom = 1
AutoFocus = false
FocalPlane = 1
Aperture = 0
AvgLumin = 0.5,0.5,0.5
LumCoeff = 0.212500006,0.715399981,0.0720999986
Hue = 0
DetailAO = -4
MaxDistance = 1000
MaxRaySteps = 256
Dither = 0.5 Locked
AO = 0,0,0,0.699999988
Specular = 0.4
SpecularExp = 29.62963
SpecularMax = 10
SpotLight = 1,1,1,0.400000006
SpotLightDir = 0.100000001,0.100000001
CamLightMin = 0
Glow = 1,1,1,0
GlowMax = 20
Fog = 0
HardShadow = 0
ShadowSoft = 2
QualityShadows = false
Reflection = 0
DebugSun = false
Angle11:Linear:0:-1:1:1:101:0.3:1:1.7:1:0
#endpreset

#preset Default
FOV = 0.4
Eye = 0,0,-4
Target = 0,0,0
Up = 0,1,0
EquiRectangular = false
AutoFocus = false
FocalPlane = 1.025
Aperture = 0
Gamma = 2
ToneMapping = 4
Exposure = 3
Brightness = 5
Contrast = 1
AvgLumin = 0.5,0.5,0.5
Saturation = 1
LumCoeff = 0.212500006,0.715399981,0.0720999986
Hue = 0
GaussianWeight = 1
AntiAliasScale = 2
DepthToAlpha = false
ShowDepth = false
DepthMagnitude = 1
Detail = -5
DetailAO = -4
FudgeFactor = 1
MaxDistance = 1000
MaxRaySteps = 256
Dither = 0.5 Locked
NormalBackStep = 1
AO = 0,0,0,0.64795919
Specular = 0.4
SpecularExp = 41.884817
SpecularMax = 10
SpotLight = 1,1,1,0.400000006
SpotLightDir = 0.100000001,0.34476846
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
BaseColor = 1,1,1
OrbitStrength = 1
X = 0.5,0.600000024,0.600000024,0.699999988
Y = 1,0.600000024,0,0.400000006
Z = 0.800000012,0.779999971,1,0.5
R = 0.400000006,0.699999988,1,0.119999997
BackgroundColor = 0,0,0
GradientBackground = 0.3
CycleColors = false
Cycles = 1.1
EnableFloor = false
FloorNormal = 0,0,1
FloorHeight = 0
FloorColor = 1,1,1
TrigIter = 5
TrigLimit = 1.10000000000000009
MaxPeriod = 60
SliceBase = 0
SliceDepth = 4
Thickness = 0.01
Angle1 = -1
Rotation1 = 0,0,1
Angle2 = 0
Rotation2 = 0,0,1
Center = -0.400000006,0,-0.400000006,0
Zoom = 1
ColorSpeed = 0.5
#endpreset
