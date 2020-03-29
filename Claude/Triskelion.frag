#version 330 compatibility

#info Pauldelbrot's Triskelion extended to "dial-a-Julia" by Claude 2019-12-20

#include "MathUtils.frag"
#include "Complex.frag"
#include "Progressive2D.frag"

#group Triskelion

// Iteration count
uniform int Iterations; slider[1,100,10000]

// Points in quadratic Mandelbrot set frame of reference
uniform vec2 A; slider[(-2,-2),(0,0),(2,2)]
uniform vec2 B; slider[(-2,-2),(0,0),(2,2)]
uniform vec2 C; slider[(-2,-2),(0,0),(2,2)]

vec2 W0 = vec2( 1.0,  0.0);
vec2 W1 = vec2(-0.5,  0.5 * sqrt(3.0));
vec2 W2 = vec2(-0.5, -0.5 * sqrt(3.0));

vec2 S = vec2(1.0, 0.0);

vec2 a = 2.0 * S + (vec2(1.0, 0.0) - cSqrt(vec2(1.0, 0.0) - 4.0 * A));
vec2 b = 2.0 * S + (vec2(1.0, 0.0) - cSqrt(vec2(1.0, 0.0) - 4.0 * B));
vec2 c = 2.0 * S + (vec2(1.0, 0.0) - cSqrt(vec2(1.0, 0.0) - 4.0 * C));

vec4 h(vec4 z) { return cSqr(z) + z + cConst(vec2(1.0, 0.0)); }
vec4 g(vec4 z) { return cMul(z, cDiv(h(z), a) + cMul(W1, cDiv(h(cMul(W2, z)), b)) + cMul(W2, cDiv(h(cMul(W1, z)), c))); }
vec4 f(vec4 z) { return cDiv(S, cSqr(z)) + cDiv(cMul(z, cSqr(z)) - cConst(vec2(1.0, 0.0)), g(z)); }

vec3 color(vec2 p)
{
  vec4 z = cVar(p);
  vec3 t = vec3(10000.0);
  for (int i = 0; i < Iterations; ++i)
  {
    z = f(z);
    t = min(t, vec3
      ( length(z.xy - W0) / length(z.zw)
      , length(z.xy - W1) / length(z.zw)
      , length(z.xy - W2) / length(z.zw)
      ));
  }
  return vec3(max(max(t.x, t.y), t.z) / length(dFdx(p)));
}

#preset Default
TrigIter = 5
TrigLimit = 1.10000000000000009
Center = 0,0
Zoom = 1
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
Iterations = 4000
A = 0,0.6494346
B = 0.30048468,-0.01615508
C = -0.77022652,0.09061492
#endpreset
