#include "MathUtils.frag"
#include "Complex.frag"
#include "Progressive2D.frag"
#info Plot Newtonian

#group Newt

// Number of iterations
uniform int  Iterations; slider[10,200,1000]

uniform float R; slider[0,0,1]
uniform float G; slider[0,0.4,1]
uniform float B; slider[0,0.7,1]

uniform float Mult; slider[0,2,6]
uniform float ColDiv; slider[1,256,384]
uniform int  Formula; slider[0,0,3]

uniform vec2 XY; slider[(-2,-2),(-0.6,1.3),(2,2)]
uniform vec2 C; slider[(-2,-2),(-0.6,1.3),(2,2)]
uniform bool Invert; checkbox[false]
// coordinate to invert to infinity
uniform vec2 InvertC; slider[(-5,-5),(0,0),(5,5)]
// performs the active c = T(s)
vec2 domainMap(vec2 c)
{
  float s = dot(c,c);
  return c/s + InvertC;
}

vec2 c2 = vec2(XY);

float dist = 0.;
float p=1.;
float q=1.;
float a;
float b;
float m, n;

vec2 Plot(vec2 z) {

    m = (a * z.x - b * z.y) - 2.;
    n = (z.x * b + z.y * a) + 2.;
    p = (a * a + b * b) * Mult;
    q = (n * a - m * b) / p+c2.x;
    p = (m * a + n * b) / p+c2.y;
    z.x -= p;
    z.y -= q;
    dist = max(dist,dot(z,z));

  return z;
}

vec3 color(vec2 c) {

    if(Invert) c = domainMap(-c);
    vec2 z = c;

    int i = 0;

    if( Formula == 0 ) {
        for (i = 0; i < Iterations; i++) {
				a = (z.x * z.x - z.y * z.y);
				b = (z.x * z.y); b += b;

				z = Plot(z);
    
				if(p*p+q*q < 0.000000001) break;
        }
    }
    else if( Formula == 1 ) {
      for (i = 0; i < Iterations; i++) {
				a = (p * p - q * q)+(z.x * z.x - z.y * z.y);
				b = (2. * (p * q))+(2.*(z.x * z.y));

				z = Plot(z);
    
				if(p*p+q*q < 0.000000001) break;
      }
    }
    else if( Formula == 2 ) {
      for (i = 0; i < Iterations; i++) {
				a = sin(z.x) + (z.x * z.x - z.y * z.y);
				b = sin(z.y) + (2. * (z.x * z.y));

				z = Plot(z);
    
				if(p*p+q*q < 0.000000001) break;
      }
    }
    else if( Formula == 3 ) {
      for (i = 0; i < Iterations; i++) {
				a = exp(z.x) + (z.x * z.x - z.y * z.y);
				b = exp(z.y) + (2. * (z.x * z.y));

				z = Plot(z);
    
				if(p*p+q*q < 0.000000001) break;
      }
    }
    else if( Formula == 4 ) {
      for (i = 0; i < Iterations; i++) {
				a = exp(z.x) + (z.x * z.x - z.y * z.y);
				b = exp(z.y) + (2. * (z.x * z.y));

				z = Plot(z);
    
				if(p*p+q*q < 0.000000001) break;
      }
    }

    if (i < Iterations) {
      // The color scheme here is based on one from Inigo Quilez's Shader Toy:
      float co =  float(i) + 1. - log(.5*log(dist));
      co = 6.2831*sqrt(co/ColDiv);
      return 1.0-(.5+.5*vec3( cos(co+R), cos(co+G), cos(co+B) ));
       }  else {
      return vec3(0.0);
  }
}


#preset Default
Gamma = 2.08335
Brightness = 1
Contrast = 1
Saturation = 1
Center = -0.1343795,0.0921344
Zoom = 0.4045281
ToneMapping = 3
Exposure = 0.6522
AARange = 2
AAExp = 1
GaussianAA = true
Iterations = 256
R = 0
G = 0.4
B = 0.7
Mult = 2
ColDiv = 256
Formula = 0
XY = 0,0
#endpreset
