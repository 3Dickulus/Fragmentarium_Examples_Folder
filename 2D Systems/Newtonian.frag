
#include "MathUtils.frag"
#include "Progressive2D.frag"
#info Newtonian

#group Newtonian

// Number of iterations
uniform int  Iterations; slider[10,200,1000]

uniform float R; slider[0,0,1]
uniform float G; slider[0,0.4,1]
uniform float B; slider[0,0.7,1]
uniform vec2 C; slider[(-1,-1),(0,0),(1,1)]
uniform float Escape; slider[0,0.1,1]
uniform int Formula; slider[0,0,2]
#group SmoothIters
uniform float Exponent; slider[-16,2,16]
uniform float Radius; slider[0.000001,2,16]
uniform float ColorSpeed; slider[0.000001,1,16]

float g(float x, float R, float p) {
     float y = (1. - x/R);
     if(y<0.0) y = 0.;
     return pow(y,p);
}

vec3 color(vec2 z) {
	
  int count = 0;
  float r = z.x;
  float i = z.y;
  float p = 1.;
  float q = 1.;
  float a;
  float b;
  float m, n;
  float az;
  float acc = 0.;
  float it = 1.;

if(Formula == 0)
  while ( count++ < Iterations)
  {
    a = (r * r - i * i);
    b = (r * i + r * i);
    m = (r * a - i * b) - 1.0;
    n = (r * b + i * a) + 1.0;
    p = (a * a + b * b) * 3.0;
    q = (n * a - m * b) / p+C.x;
    p = (m * a + n * b) / p+C.y;
    r -= p;
    i -= q;

  az = length(vec2(r,i));
  if(az <= Radius) {
     acc = (it*acc + g(az,Radius,Exponent))/(it+1.);
     it++;
  }
    if(length(vec2(p,q)) < Escape) break;
  }

if(Formula == 1)
  while ( count++ < Iterations)
  {
    a = (p * q) + (r * r - i * i);
    b = (q * p) + (r * i + r * i);
    m = (r * a - i * b) - 1.0;
    n = (r * b + i * a) + 1.0;
    p = (a * a + b * b) * 3.0;
    q = (n * a - m * b) / p+C.x;
    p = (m * a + n * b) / p+C.y;

    r -= p;
    i -= q;

  az = length(vec2(r,i));
  if(az <= Radius) {
     acc = (it*acc + g(az,Radius,Exponent))/(it+1.);
     it++;
  }
    if(length(vec2(p,q)) < Escape) break;
  }

if(Formula == 2)
  while ( count++ < Iterations)
  {
    a = (p * p - q * q) + (r * r - i * i);
    b = (p * q + p * q) + (r * i + r * i);

    m = (r * a - i * b) - 1.0;
    n = (r * b + i * a) + 1.0;
    p = (a * a + b * b) * 3.0;
    q = (n * a - m * b) / p+C.x;
    p = (m * a + n * b) / p+C.y;

    r -= p;
    i -= q;

  az = length(vec2(r,i));
  if(az <= Radius) {
     acc = (it*acc + g(az,Radius,Exponent))/(it+1.);
     it++;
  }
    if(length(vec2(p,q)) < Escape) break;
  }

	return vec3(acc * ColorSpeed);

}


#preset Default
Gamma = 1
Brightness = 2
Contrast = 2
Saturation = 1
Center = 0,0
Zoom = 0.682366739
ToneMapping = 1
Exposure = 1
AARange = 2.21599985
AAExp = 8.20348837
GaussianAA = true
Iterations = 50
R = 0
G = 0.4
B = 0.7
Julia = false
C = 0,0
K = 0,1
KolorDiv = 256
Escape = 0
Formula = 0
Exponent = 5
Radius = 1.123
ColorSpeed = 10
#endpreset

#preset nice
Center = 0.545183287,-0.244355888
Zoom = 0.682366739
EnableTransform = false
RotateAngle = 0
StretchAngle = 0
StretchAmount = 0
Gamma = 1
ToneMapping = 1
Exposure = 1
Brightness = 2
Contrast = 2
Saturation = 1
AARange = 2.21599985
AAExp = 8.20348837
GaussianAA = true
Iterations = 80
R = 0
G = 0.4
B = 0.7
Julia = false
C = -0.2899729,0.53387536
K = 0,1
KolorDiv = 256
Escape = 0
Formula = 0
Exponent = 16
Radius = 4.25174901
ColorSpeed = 16
#endpreset
