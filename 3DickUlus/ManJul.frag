#include "MathUtils.frag"
#include "Progressive2D.frag"
#info Cubic Julia
#info Zn+1=(Zn+c)^3
#group CubicJulia

// Number of iterations
uniform int  Iterations; slider[10,200,1000]

uniform float R; slider[0,0,1]
uniform float G; slider[0,0.4,1]
uniform float B; slider[0,0.7,1]
uniform vec2 C; slider[(-3.141,-3.141),(0.0,0.0),(3.141,3.141)]
uniform float ColorDiv; slider[-10,1,10]
uniform float Escape; slider[0,100,256]
uniform float StripeDensity; slider[-10,1,10]

vec3 color(vec2 z) {
	
  int count = 0;

  float a,b;
  float p=0.0,q=0.0;
  float len=0.0;
  float avg=0.0;
  float sum=0.0;
  float lastAdded = 0.0;

  for ( count = 0; count < Iterations; count++)
  {

    a = (p+q) * (p-q);
    b = q * (p+p);

    p = a + z.x;
    q = b + z.y;

    a = (p+q) * (p-q);
    b = q * (p+p);

    p =  a + C.x;
    q =  b + C.y;

    len = length(vec2(p,q));
    if( len > Escape*Escape ) break;
    lastAdded = 0.5+0.5*sin(StripeDensity*atan(p,q));
    avg += lastAdded;
    sum+=len;
  }

      float prevAvg = (avg -lastAdded)/(float(count-1));
      avg /= float(count);
	if (count < Iterations) {
		// The color scheme here is based on one
		// from Inigo Quilez's Shader Toy:
		float co = 1.0 - log(log(len)/log(Escape*Escape))/log(4.0);
	   float ca = co*avg+(1.0-co)*prevAvg;
		co = 6.2831*sqrt(ca)/ColorDiv;
		return vec3( .5+.5*sin(co + vec3(R,G,B)));
	}  else {
      b = 6.2831*sqrt(len*(avg+prevAvg))/ColorDiv;
      return vec3( .5+.5*cos(b + vec3(B,G,R)));
	}
}



#preset Default
Center = -0.061271857,-0.0722517
Zoom = 0.657516231
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
R = 0
G = 0.4
B = 0.7
C = 0,0
ColorDiv = 1
Escape = 100
StripeDensity = 1
#endpreset
