//#version 130
// Output generated from file: /home/claude/code/borok/fractal-bits/inflection-mapping/inflection.frag
// Created: Thu Feb 2 00:26:31 2017
// http://www.fractalforums.com/images-showcase-(rate-my-fractal)/fruity-(inflection-mapping)/
#include "MathUtils.frag"
#include "Complex.frag"
#include "Progressive2D.frag"

const vec2 cs[8] = vec2[8]
  ( vec2(-1.5, 0.0)
  , vec2(-2.0, 0.0)
  , vec2(-1.5, 0.0)
  , vec2(-2.0, 0.0)
  , vec2(-1.5, 0.0)
  , vec2(-2.0, 0.0)
  , vec2(-1.5, 0.0)
  , vec2(-2.0, 0.0)
  );

vec3 color(vec2 c0)
{
  float px = length(vec4(dFdx(c0), dFdy(c0)));
  vec4 c = vec4(c0, px, 0.0);
  for (int i = 8-1; i >= 0; --i)
  {
    vec4 f = vec4(cs[i], 0.0, 0.0);
    vec4 d = c - f;
    c = f + cSqr(d);
  }
  int n = 0;
  vec4 z = vec4(0.0, 0.0, 0.0, 0.0);
  for (n = 0; n < 1000; ++n)
  {
    if (dot(z.xy, z.xy) >= 65536.0)
      break;
    z = cSqr(z) + c;
  }
  if (dot(z.xy, z.xy) < 65536.0)
    return vec3(1.0, 0.0, 0.0);
  float r = length(z.xy);
  float dr = length(z.zw);
  float de = 2.0 * r * log(r) / dr;
  float g = tanh(clamp(de, 0.0, 4.0));
  if (isnan(de) || isinf(de) || isnan(g) || isinf(g))
    g = 1.0;
  return vec3(g);
}


#preset Default
Center = -2,0
Zoom = 1
Gamma = 2.2
ToneMapping = 1
Exposure = 1
Brightness = 1
Contrast = 1
Saturation = 1
AARange = 2
AAExp = 1
GaussianAA = true
#endpreset

