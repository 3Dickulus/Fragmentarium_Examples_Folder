#version 130
// Output generated from file: /home/claude/eva/slides/_/bs-44_Files/bs-44.frag
// Created: Tue May 21 17:19:29 2019
#define WANG_HASH
#include "MathUtils.frag"
#include "Complex.frag"
#include "Progressive2D.frag"

#group Variations

void formula(vec2 c, inout vec2 z)
{
  vec2 a = vec2(3.0, 3.0);
  z = cDiv(cSqr(z) + a, cSqr(z) + vec2(1.0, 0.0)) + c;
}

// Number of iterations
uniform int  Iterations; slider[1,200,10000]
uniform bool Julia; checkbox[false]
uniform vec2 C; slider[(-4,-4),(0,0),(4,4)]

// http://lolengine.net/blog/2013/07/27/rgb-to-hsv-in-glsl
vec3 hsv2rgb(vec3 c)
{
    vec4 K = vec4(1.0, 2.0 / 3.0, 1.0 / 3.0, 3.0);
    vec3 p = abs(fract(c.xxx + K.xyz) * 6.0 - K.www);
    return c.z * mix(K.xxx, clamp(p - K.xxx, 0.0, 1.0), c.y);
}

ivec3 color1(vec2 c0, vec2 C) {
  vec2 c = Julia ? C : c0;
  vec2 z = Julia ? c0 : vec2(0.0, 0.0);
  float m = 1.0 / 0.0;
  int n = 0;
  for (int i = 1; i <= Iterations; ++i) {
    formula(c, z);
    float z2 = dot(z, z);
    if (isnan(z2)) break;
    if (isinf(z2)) break;
    if (z2 < m) { m = z2; n = i; }
  }
  return ivec3(n);
}

vec3 color(vec2 c0)
{
  vec2 c1 = C;
  vec2 x = dFdx(c0) * 0.5;
  vec2 y = dFdy(c0) * 0.5;
  vec2 c[4] = vec2[4](c0 - x - y, c0 - x + y, c0 + x - y, c0 + x + y);
  ivec3 e[4] = ivec3[4](color1(c[0], c1), color1(c[1], c1), color1(c[2], c1), color1(c[3], c1));
  bool edge = e[0] != e[3] || e[1] != e[2];
  float hue = float(e[0].x) / float(5.6789);
  hue -= floor(hue);
  return edge ? vec3(0.0) : hsv2rgb(vec3(hue, 0.3, 1.0));
}




#preset Default
TrigIter = 5
TrigLimit = 1.10000000000000009
Center = -1.7,-1.5
Zoom = 0.2
Gamma = 2.2
ToneMapping = 1
Exposure = 1
Brightness = 1
Contrast = 1
Saturation = 1
AARange = 2
AAExp = 1
GaussianAA = true
Iterations = 200
Julia = false
C = 0,0
#endpreset

