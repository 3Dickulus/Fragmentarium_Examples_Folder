#include "MathUtils.frag"
#include "Complex.frag"
#include "Progressive2D.frag"
#info Plot Cyclic
#info Inspired by the July 89 issue of Scientific American article in Computer Recreations titled 'Catch of the day:' about fractals by A. K. Dewdney.
#info introduced to fragment code 01/21/17 3Dickulus

#group Cyclic

// Number of iterations
uniform int  Iterations; slider[10,200,1000]

uniform float R; slider[0,0,1]
uniform float G; slider[0,0.4,1]
uniform float B; slider[0,0.7,1]

uniform int  Power; slider[1,2,10]
uniform float Bailout; slider[0,230,384]
uniform float ColDiv; slider[1,256,384]
uniform int  Formula; slider[0,0,3]
uniform vec2 XY; slider[(-2,-2),(-0.6,1.3),(2,2)]

vec2 c2 = vec2(XY);

vec3 color(vec2 c) {

float dist = 0.;
    vec2 z = c;

    int i = 0;
    if( Formula == 0 ) {

        for (i = 0; i < Iterations; i++) {
				vec2 b = z/float(Power)*.5;
				vec2 d;
				d.x=sin(b.y)*1.5;
				d.y=sin(b.x)*1.5;
				for(int e = 0; e < Power-1; e++) {
					d.x *= d.x;
					d.y *= d.y;
				}
 				z.x -= (c2.x * sin(b.y+d.x));
				z.y -= (c2.y * sin(b.x+d.y));
				dist = abs(max(dist,dot(z,z)));
				if (dist > Bailout) break;
        }
    }
    else if( Formula == 1 ) {
      for (i = 0; i < Iterations; i++) {
				vec2 b = z/float(Power);
				vec2 d;
				d.x=cos(b.y)*1.5;
				d.y=cos(b.x)*1.5;
				for(int e = 0; e < Power-1; e++) {
					d.x *= d.x;
					d.y *= d.y;
				}
 				z.x -= (c2.x * sin(b.y+d.x));
				z.y -= (c2.y * sin(b.x+d.y));
				dist = abs(max(dist,dot(z,z)));
				if (dist> Bailout) break;
      }
    }
    else if( Formula == 2 ) {
      for (i = 0; i < Iterations; i++) {
				vec2 b = z*.125;
				vec2 d;
				d.x=tan(sin(b.y)*1.5);
				d.y=tan(sin(b.x)*1.5);
				for(int e = 0; e < Power-1; e++) {
					d.x *= b.x;
					d.y *= b.y;
				}
 				z.x -= (c2.x * sin(b.y+d.x));
				z.y -= (c2.y * sin(b.x+d.y));
				dist = abs(max(dist,dot(z,z)));
				if (dist> Bailout) break;
      }
    }
    else if( Formula == 3 ) {

      for (i = 0; i < Iterations; i++) {
				vec2 b = z/float(Power);
				vec2 d;
				d.x=sin(b.y*1.5);
				d.y=sin(b.x*1.5);
				for(int e = 0; e < Power-1; e++) {
					d.x *= d.x;
					d.y *= d.y;
				}
 				z.x -= (c2.x * sin(b.y+d.x));
				z.y -= (c2.y * sin(b.x+d.y));
				dist = abs(max(dist,dot(z,z)));
				if (dist> Bailout) break;
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
Center = 0,0
Zoom = 0.0611002
Gamma = 2.2
ToneMapping = 1
Exposure = 1
Brightness = 1
Contrast = 1
Saturation = 1
AARange = 2
AAExp = 1
GaussianAA = true
Iterations = 1000
R = 0
G = 0.4
B = 0.7
Power = 1
Bailout = 230
ColDiv = 384
Formula = 0
XY = -0.2298851,-0.2068966
#endpreset

