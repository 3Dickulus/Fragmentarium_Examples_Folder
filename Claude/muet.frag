#version 130

#info MuET (c) Claude Heiland-Allen 2019, license AGPL3+

#include "MathUtils.frag"
#include "Progressive2D.frag" 

#group MuET

uniform int Iterations; slider[0,100,1000]
uniform float EscapeRadius; slider[0.0,2.0,100.0]
uniform int Power; slider[2,2,16]

#group Formula1

uniform bool Active1; checkbox[true]
uniform bool AbsX1; checkbox[false]
uniform bool AbsY1; checkbox[false]
uniform bool NegX1; checkbox[false]
uniform bool NegY1; checkbox[false]
uniform bool Swap1; checkbox[false]

#group Formula2

uniform bool Active2; checkbox[false]
uniform bool AbsX2; checkbox[false]
uniform bool AbsY2; checkbox[false]
uniform bool NegX2; checkbox[false]
uniform bool NegY2; checkbox[false]
uniform bool Swap2; checkbox[false]

#group Formula3

uniform bool Active3; checkbox[false]
uniform bool AbsX3; checkbox[false]
uniform bool AbsY3; checkbox[false]
uniform bool NegX3; checkbox[false]
uniform bool NegY3; checkbox[false]
uniform bool Swap3; checkbox[false]

#group Formula4

uniform bool Active4; checkbox[false]
uniform bool AbsX4; checkbox[false]
uniform bool AbsY4; checkbox[false]
uniform bool NegX4; checkbox[false]
uniform bool NegY4; checkbox[false]
uniform bool Swap4; checkbox[false]

float EscapeRadius2 = pow(2.0, EscapeRadius);
int NActive = int(Active1) + int(Active2) + int(Active3) + int(Active4);
int IterationsN = NActive == 0 ? 0 : Iterations / NActive;
int IterationsM = NActive * IterationsN;

vec2 cMul(vec2 a, vec2 b)
{
  return vec2(a.x * b.x - a.y * b.y, a.x * b.y + a.y * b.x);
}

vec2 cPow(vec2 a, int n)
{
  // assert(n >= 2);
  vec2 p = a;
  for (int m = 2; m <= n; ++m)
  {
    p = cMul(p, a);
  }
  return p;
}

float dwell(vec2 c)
{
  int i = 0;
  vec2 z = vec2(0.0);
  for (; i < IterationsM;)
  {
    if (Active1)
    {
      if (AbsX1) z.x = abs(z.x);
      if (AbsY1) z.y = abs(z.y);
      if (NegX1) z.x = -z.x;
      if (NegY1) z.y = -z.y;
      if (Swap1) z.xy = z.yx;
      z = cPow(z, Power) + c;
      ++i;
      if (! (dot(z, z) < EscapeRadius2)) break;
    }
    if (Active2)
    {
      if (AbsX2) z.x = abs(z.x);
      if (AbsY2) z.y = abs(z.y);
      if (NegX2) z.x = -z.x;
      if (NegY2) z.y = -z.y;
      if (Swap2) z.xy = z.yx;
      z = cPow(z, Power) + c;
      ++i;
      if (! (dot(z, z) < EscapeRadius2)) break;
    }
    if (Active3)
    {
      if (AbsX3) z.x = abs(z.x);
      if (AbsY3) z.y = abs(z.y);
      if (NegX3) z.x = -z.x;
      if (NegY3) z.y = -z.y;
      if (Swap3) z.xy = z.yx;
      z = cPow(z, Power) + c;
      ++i;
      if (! (dot(z, z) < EscapeRadius2)) break;
    }
    if (Active4)
    {
      if (AbsX4) z.x = abs(z.x);
      if (AbsY4) z.y = abs(z.y);
      if (NegX4) z.x = -z.x;
      if (NegY4) z.y = -z.y;
      if (Swap4) z.xy = z.yx;
      z = cPow(z, Power) + c;
      ++i;
      if (! (dot(z, z) < EscapeRadius2)) break;
    }
  }
  if (i == IterationsM)
  {
    return 0.0;
  }
  else
  {
    return float(i) + 1.0 - log(length(z)) / log(float(Power));
  }
}

vec3 color(vec2 p)
{
  vec2 x = dFdx(p) * 0.25;
  vec2 y = dFdy(p) * 0.25;
  float d00 = dwell(p - x - y);
  float d01 = dwell(p - x + y);
  float d10 = dwell(p + x - y);
  float d11 = dwell(p + x + y);
  vec2 e = vec2(d00 - d11, d01 - d10);
  float de = 1.0 / (log(2.0) * length(e));
  if (0.0 == d00 * d01 * d10 * d11 || isinf(de) || isnan(de)) return vec3(0.0);
  return vec3(tanh(clamp(de, 0.0, 4.0)));
}

#preset Default
Center = -0.677947188,0.360972752
Zoom = 426.136 Logarithmic
EnableTransform = true
RotateAngle = 0
StretchAngle = 0
StretchAmount = 0
Gamma = 2.2
ToneMapping = 1
Exposure = 1
Brightness = 1
Contrast = 1
Saturation = 1
AARange = 2
AAExp = 1
GaussianAA = true
Iterations = 424
EscapeRadius = 2
Power = 2
Active1 = true
AbsX1 = false
AbsY1 = false
NegX1 = false
NegY1 = false
Swap1 = false
Active2 = false
AbsX2 = false
AbsY2 = false
NegX2 = false
NegY2 = false
Swap2 = false
Active3 = false
AbsX3 = false
AbsY3 = false
NegX3 = false
NegY3 = false
Swap3 = false
Active4 = false
AbsX4 = false
AbsY4 = false
NegX4 = false
NegY4 = false
Swap4 = false
#endpreset
