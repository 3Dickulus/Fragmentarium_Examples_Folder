//#version 130
// http://www.fractalforums.com/index.php?topic=25237.msg99697#msg99697
#include "MathUtils.frag"
#include "Complex.frag"
#include "Progressive2D.frag"

#define N 6
const vec2 cs[N] = vec2[N]
  ( vec2(-0.75, 0.1)
  , vec2(-0.7780062, 0.9591821)
  , vec2(-0.7186571, 1.0251421)
  , vec2(-0.5475953, 0.6401844)
  , vec2(-0.5129835, 0.6237739)
  , vec2(-0.4531227, 0.8943247)
  );

vec3 color(vec2 c0)
{
  float px = length(vec4(dFdx(c0), dFdy(c0)));
  vec4 c = vec4(c0, px, 0.0);
  for (int i = N-1; i >= 0; --i)
  {
    vec4 f = vec4(cs[i], 0.0, 0.0);
    vec4 d = c - f;
    c = cSqr(d) + f;
  }
  int n = 0;
  vec4 z = c;
  for (n = 0; n < 1000; ++n)
  {
    if (dot(z.xy, z.xy) >= 1.0e10)
      break;
    z = cSqr(z) + vec4(cs[0], 0.0, 0.0);
  }
  if (dot(z.xy, z.xy) < 1.0e10)
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
TrigIter = 5
TrigLimit = 1.10000000000000009
Center = -0.368737489,0.856368542
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
