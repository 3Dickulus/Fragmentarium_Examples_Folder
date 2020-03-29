#include "MathUtils.frag"
#include "Progressive2D.frag"
#info Burt's bisector
#info zn+1=-zn^3+zn^2+zn^1+0
#info https://fractalforums.org/fractal-mathematics-and-new-theories/28/is-there-a-name-for-this-fractal/2748/msg13955#msg13955
#group Burt

// Number of iterations
uniform int  Iterations; slider[10,200,1000]

uniform float R; slider[0,0,1]
uniform float G; slider[0,0.4,1]
uniform float B; slider[0,0.7,1]
uniform bool Julia; checkbox[false]
uniform vec2 C; slider[(-1,-1),(0,0),(1,1)]
uniform vec2 O; slider[(-6.282,-6.282),(3.141,3.141),(6.282,6.282)]
uniform float ColorDiv; slider[0,1,10]
uniform float Escape; slider[0,100,1500]
uniform float StripeDensity; slider[-10,1,10]

vec3 color(vec2 z) {
	
  int count = 0;
  float r=z.x;
  float i=z.y;
  float a,b;
  float m,n;
  float len=0.0;
  float avg=0.0;
  float sum=0.0;
  float lastAdded = 0.0;

  for ( count = 0; count < Iterations; count++)
  {
    a = (r * r - i * i) + (Julia ? C.x : r);
    b = 2.0*(r * i) + (Julia ? C.y : i);
    m = (a * r - b * i);
    n = (r * b + i * a);
    r -= m + O.x;
    i -= n + O.y;
    len = length(vec2(r,i));
    if( len > Escape*Escape ) break;
    lastAdded = 0.5+0.5*sin(StripeDensity*atan(i,r));
    avg += lastAdded;
    sum+=len;
  }

	if (count < Iterations) {
      float prevAvg = (avg -lastAdded)/(float(count-1));
      avg /= float(count);
		// The color scheme here is based on one
		// from Inigo Quilez's Shader Toy:
		float co = 1.0 - log(log(len)/log(Escape*Escape))/log(3.0);
	   float ca = co*avg+(1.0-co)*prevAvg;
		co = 6.2831*sqrt(ca)/ColorDiv;
		return vec3( .5+.5*sin(co + vec3(R,G,B)));
	}  else {
      sum = avg+(sum/ColorDiv)/float(count);
      return vec3( .5+.5*sin(sum + vec3(B,G,R)));
	}
}


#preset Default
Center = -0.335846007,0.005017444
Zoom = 0.902430827
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
Julia = false
C = 0,0
O = 0,0
Escape = 500
StripeDensity = 1
ColorDiv = 1
#endpreset

#preset checkone
Center = -0.023583435,0.057090193
Zoom = 1.01330455
Gamma = 2
ToneMapping = 4
Exposure = 1
Brightness = 1
Contrast = 1
Saturation = 2
AARange = 1.5
AAExp = 4.28953488
GaussianAA = true
Iterations = 200
R = 0
G = 0.4
B = 0.7
Julia = true
C = 0.201492537,-0.034825871
O = 0,0.156658355
Escape = 1500
StripeDensity = 1
ColorDiv = 0.977542931
#endpreset

#preset CurlyQ
Center = 0.330985188,0.022641571
Zoom = 9.48211986
Gamma = 1
ToneMapping = 1
Exposure = 1
Brightness = 1
Contrast = 1
Saturation = 1
AARange = 1.5
AAExp = 4.28953488
GaussianAA = true
Iterations = 347
R = 0
G = 0.4
B = 0.7
Julia = true
C = 0.201492386,0.001174068
O = -0.009626912,-0.163522605
Escape = 1500
StripeDensity = -1
ColorDiv = 0.171730518
#endpreset

#preset checktwo
Center = -0.722934604,-0.724167705
Zoom = 9.48211979
Gamma = 2
ToneMapping = 4
Exposure = 1
Brightness = 1
Contrast = 1
Saturation = 2
AARange = 1.5
AAExp = 4.28953488
GaussianAA = true
Iterations = 317
R = 0
G = 0.4
B = 0.7
Julia = true
C = 0.882646745,-0.82640793
O = -0.131998794,0.360314222
ColorDiv = 0.379998935
Escape = 1500
StripeDensity = 2
#endpreset

#preset Burt's Bisector
Center = 0.304314256,-0.000235878
Zoom = 1.57835716
Gamma = 2.2
ToneMapping = 1
Exposure = 1
Brightness = 1
Contrast = 1
Saturation = 1
AARange = 0.75
AAExp = 4.46744187
GaussianAA = true
Iterations = 32
R = 0
G = 0.161290322
B = 0.354399009
Julia = false
C = 0,0
O = 0.052997456,0.06866329
ColorDiv = 0.733999442
Escape = 1500
StripeDensity = 2
#endpreset

#preset Average plus sum
Center = -0.048644066,0.035206236
Zoom = 0.902430827
Gamma = 2.2
ToneMapping = 1
Exposure = 1
Brightness = 1
Contrast = 1
Saturation = 1
AARange = 1.5
AAExp = 5.21860465
GaussianAA = true
Iterations = 302
R = 0
G = 0.4
B = 0.7
Julia = true
C = 0.399910478,-0.510825912
O = 0.252319409,0.187990022
ColorDiv = 1
Escape = 1500
StripeDensity = -1
#endpreset

#preset RGBYW
Center = -1.15379858,0.080715701
Zoom = 3.8092956
Gamma = 1
ToneMapping = 1
Exposure = 1
Brightness = 1
Contrast = 1
Saturation = 1
AARange = 1.33218997
AAExp = 4.28953488
GaussianAA = true
Iterations = 370
R = 0
G = 0.661290322
B = 0.639405205
Julia = true
C = 0.157492477,-0.012825893
O = -0.009626912,-0.163522605
ColorDiv = 0.951122856
Escape = 1500
StripeDensity = -1
#endpreset

#preset Tree of no ledge
Center = -0.106998146,-0.0147653
Zoom = 4.82823063
Gamma = 2.2
ToneMapping = 1
Exposure = 1
Brightness = 1
Contrast = 1
Saturation = 1
AARange = 1.5
AAExp = 5.21860465
GaussianAA = true
Iterations = 416
R = 0.596534654
G = 0.130272953
B = 0.127633209
Julia = true
C = 0.399910478,-0.510825912
O = 0.252319409,0.187990022
ColorDiv = 0.739762215
Escape = 1500
StripeDensity = 1
#endpreset
