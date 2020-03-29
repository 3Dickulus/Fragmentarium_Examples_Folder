#version 400 compatibility
// Output generated from file: /home/toonfish/Fragmentarium/Examples/2D Systems/Metabrot.frag
// Created: Sat Mar 21 23:19:15 2020
#define USE_DOUBLE
#include "MathUtils.frag"
#include "Complex.frag"
#include "Progressive2D-4.frag"
#info MetaBrot inspired by the good folks at FractalForums.com 2013-2017
#group Metabrot

uniform double R; slider[0,0,1]
uniform double G; slider[0,0.4,1]
uniform double B; slider[0,0.7,1]
uniform double ColDiv; slider[1,256,384]
uniform double bailout; slider[0,6,160]
uniform int  maxiters; slider[10,100,1000]
uniform dvec2 C; slider[(-2,-2),(-0.2,0.0),(2,2)]
uniform bool PreIter; checkbox[false]
// z = csqr(z)+c; before entering the iteration loop
uniform int  preiterations; slider[1,2,10]
uniform int  Type; slider[0,0,2]

double dist = 0.0;

dvec2 csqr( dvec2 a ) {
 if(Type==0) return dvec2(a.x*a.x-a.y*a.y, 2.0*a.x*a.y );
 if(Type==1) return dvec2(a.x*a.x-a.y*a.y, 2.0*a.x*a.y) + a;
 if(Type==2) return dvec2(a.x*a.x-a.y*a.y, 2.0*a.x*a.y) - a;
}
dvec2 c = C;
dvec3 color(dvec2 p)
{
   //z from current pixel
	dvec2 z = p;
	if(PreIter) {
		for(int i=0; i<preiterations; i++) {
   c.x+=z.x*float(i)/float(maxiters+i);
   c.y+=z.y*float(i)/float(maxiters+i);
			z = csqr(z)+c;
		}
	}
   int i;
   for(i=0; i<maxiters; i++)
   {
   c.x+=z.x*float(i)/float(maxiters+i);
   c.y+=z.y*float(i)/float(maxiters+i);
     // http://www.fractalforums.com/images-showcase-(rate-my-fractal)/meta-mandelbrot-(mandeljulia)/
     z = csqr( csqr(z)+c ) + csqr(c)+z;

     dist=max(dist,length(z));
     if (dist>bailout) break;
   }

   if (i < maxiters) {
      // The color scheme here is based on one from Inigo Quilez's Shader Toy:
      double co =  double(i) + 1. - (log(.5*log(dist))- log(.5*log(bailout))) / log(bailout);
      co = 6.2831*sqrt(co/ColDiv)-bailout;
      return .5+.5*dvec3( cos(co+R), cos(co+G), cos(co+B) );
   }  else {
      double ld = log(log(6.2831*dist))-log(length(vec2(z)));
      return dvec3(ld+R,ld+G,ld+B)*(double(dist));
   }
}







#preset Default
EnableTransform = true
RotateAngle = 0
StretchAngle = 0
StretchAmount = 0
Gamma = 2
ToneMapping = 3
Exposure = 1
Brightness = 1
Contrast = 1
Saturation = 1
AARange = 1.5
AAExp = 6
GaussianAA = false
TrigIter = 5
TrigLimit = 1.10000000000000009
Zoom = 0.886956521739130532
Center = -0.0593449477124182445,0.0154548747276686584
R = 0
G = 0.468489900000000015
B = 1
ColDiv = 4
bailout = 4
maxiters = 1000
C = -0.255000000000000004,0
PreIter = false
preiterations = 1
Type = 0
#endpreset

