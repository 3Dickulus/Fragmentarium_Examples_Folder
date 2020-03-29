#include "MathUtils.frag"
#include "Complex.frag"
#include "Progressive2D.frag"
#info Plot Misc

#group Misc

// Number of iterations
uniform int  Iterations; slider[10,200,1000]

uniform float R; slider[0,0,1]
uniform float G; slider[0,0.4,1]
uniform float B; slider[0,0.7,1]

uniform float Bailout; slider[0,6,384]
uniform float ColDiv; slider[1,256,384]
uniform int  Formula; slider[0,0,3]

uniform vec2 XY; slider[(-2,-2),(-0.6,1.3),(2,2)]
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

vec3 color(vec2 c) {

float dist = 0.;
float p=1.;
float q=1.;
float a;
float b=abs(c2.x)+c2.y;

    if(Invert) c = domainMap(-c);

    vec2 z = c;

    int i = 0;

    if( Formula == 0 ) {
        for (i = 0; i < Iterations; i++) {
    a = exp (-z.y);
    q = z.y = a * sin(z.x);
    p = z.x = a * cos(z.x);
    a = z.x * z.x + z.y * z.y;
    z.x = ((z.x / a) + p) * b;
    z.y = ((-z.y / a) + q) * b;
    
				dist = abs(max(dist,dot(z,z)));
				if (dist > Bailout) break;
        }
    }
    else if( Formula == 1 ) {
      for (i = 0; i < Iterations; i++) {
    a = exp(-z.y);
    q = z.y = a * sin(z.x);
    p = z.x = a * cos(z.x);
    a = z.x * z.x + z.y * z.y;
    z.x = z.x / a;
    z.y = -z.y / a;
    a = (z.y - q) / 2.;
    z.y = -(z.x - p) / 2.;
    z.x = a;
    a = z.x - z.y * b;
    z.y = z.y + z.x * b;
    z.x = a;
				dist = abs(max(dist,dot(z,z)));
				if (dist > Bailout) break;
      }
    }
    else if( Formula == 2 ) {
      for (i = 0; i < Iterations; i++) {
    a = exp(z.x) * b;
    z.x = a * sin(z.y);
    z.y = a * cos(z.y);
				dist = abs(max(dist,dot(z,z)));
				if (dist > Bailout) break;
      }
    }
    else if( Formula == 3 ) {
  p = c.x;
  q = c.y;
  a = p * p + q * q;

      for (i = 0; i < Iterations; i++) {
     a  = p;
     p += q;
     p *= (a - q);
     q *= (a + a);
     p += ( a / (c2.x + exp( -q ))); //r;
     q += ( a * (c2.y - q)); //i;
				dist = abs(max(dist,dot(vec2(p,q),vec2(p,q))));
				if (p * p + q * q > Bailout) break;
      }
    }

    if (i < Iterations) {
      float co = i - log2(log2(dist));  // equivalent optimized smooth interation count
		// float co =  i + 1. - log2(.5*log2(dot(z,z)));
		co = 6.2831*sqrt(co/ColDiv);
		return 1.-(.5+.5*vec3( cos(co+R),cos(co+G),cos(co+B)) );
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
Bailout = 384
ColDiv = 256.3333
Formula = 0
XY = 0.8965517,0.5747126
#endpreset

#preset esinzfunc
Gamma = 2.08335
Brightness = 1
Contrast = 1
Saturation = 1
Center = -0.1343795,0.0921344
Zoom = 0.3517636
ToneMapping = 3
Exposure = 0.6522
AARange = 2
AAExp = 1
GaussianAA = true
Iterations = 256
R = 0
G = 0.4
B = 0.7
Bailout = 384
ColDiv = 256.3333
Formula = 1
XY = 0.091954,0.045977
#endpreset

#preset lexpzfunc
Gamma = 2.08335
Brightness = 1
Contrast = 1
Saturation = 1
Center = -0.4328754,-1.664885
Zoom = 0.3517636
ToneMapping = 3
Exposure = 0.6522
AARange = 2
AAExp = 1
GaussianAA = true
Iterations = 256
R = 0
G = 0.4
B = 0.7
Bailout = 384
ColDiv = 256.3333
Formula = 2
XY = -0.8275862,-1.37931
#endpreset

#preset Sigm
Gamma = 2.08335
Brightness = 1
Contrast = 1
Saturation = 1
Center = 0.0504037,-0.1052833
Zoom = 0.6152366
ToneMapping = 3
Exposure = 0.6522
AARange = 2
AAExp = 1
GaussianAA = true
Iterations = 256
R = 0
G = 0.4
B = 0.7
Bailout = 14
ColDiv = 384
Formula = 3
XY = -0.3908046,-0.9195402
#endpreset
