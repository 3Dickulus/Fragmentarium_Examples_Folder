#include "MathUtils.frag"
#include "Complex.frag"
#include "Progressive2D.frag"
#info Plot Biomorph
#info Inspired by the July 89 issue of Scientific American article in Computer Recreations titled 'Catch of the day:' about fractals by A. K. Dewdney.
#info by "The Pattern Book" Clifford A. Pickover 1995
#info and by the good folks at FractalForums.com 2013-2017
#info introduced to fragment code 01/21/17 3Dickulus
#group BioMorph

// Number of iterations
uniform int  Iterations; slider[10,200,10000]

uniform float R; slider[0,0,1]
uniform float G; slider[0,0.4,1]
uniform float B; slider[0,0.7,1]

uniform float  Power; slider[1,2,10]
uniform float Bailout; slider[0,6,384]
uniform float ColDiv; slider[1,256,384]
// 0=Zn+C 1=Z+Zn+C 2=sin(Zn)+C 3=cos(Zn)+C 4=MetaBrot
uniform int  Formula; slider[0,0,4]

uniform int  PreIter; slider[0,0,1000]

uniform bool Julia; checkbox[false]
uniform vec2 JuliaXY; slider[(-2,-2),(-0.6,1.3),(2,2)]

vec2 c2 = vec2(JuliaXY);
float dist = 0.;
// Pickover's Stalks
uniform bool StalksInside; checkbox[false]
uniform bool StalksOutside; checkbox[false]

uniform bool Invert; checkbox[false]
// coordinate to invert to infinity
uniform vec2 InvertC; slider[(-5,-5),(0,0),(5,5)]
// performs the active c = T(s)
vec2 domainMap(vec2 c)
{
  float s = dot(c,c);
  return c/s + InvertC;
}

vec3 IQColor(float i, vec2 z) {
      // The color scheme here is based on one from Inigo Quilez's Shader Toy:
      // http://www.iquilezles.org/www/articles/mset_smooth/mset_smooth.htm
      float co;
      float p = Power*Power;

      if(Formula == 0 || Formula == 1 )
        co = 3.1415+i - log(log2(length(z)))/log(Power);  // equivalent optimized smooth interation count
      else
      if(Formula == 4 )
        co = 3.1415+i - log(.5*log(dist) / log(p))/log(p);
      else
        co =  3.1415*i - (log2(.5*log2(dist)*2.)- log2(.5*log2(p))) / log(p);
      
      co = 6.2831*sqrt(co/float(ColDiv));

      return .5+.5*cos(co+vec3(R,G,B) );
}

vec3 StalkColor( float i,vec2 zmin) {
      vec3 c;
      c.x = max(zmin.x, zmin.y)*R;
      c.y = min(zmin.x, zmin.y)*G;
      c.z = length(zmin)*B;
      c = sqrt(c*i);
      float p = sqrt(min(zmin.x, zmin.y)*16.);
      return sqrt(c * vec3(p));
}

vec3 color(vec2 c) {

    if(Invert) c = domainMap(-c);

    vec2 zmin = vec2(1000000.0);
    vec2 z = Julia ?  c : vec2(0.0,0.0);

    c = (Julia ? c2 : c);

    int i;

    for(i=0;i<PreIter;i++)
      z = cPow(z, Power) + c;

    if( Formula == 0 ) {
        for (i = PreIter; i < Iterations; i++) {
          z = cPow(z, Power) + c;
          dist = dot(z,z);
          zmin = min(zmin, abs(z));
          if (dist> Bailout) break;
        }
    }
    else if( Formula == 1 ) {
      for (i = PreIter; i < Iterations; i++) {
        z += cPow(z, Power) + c;
        dist = dot(z,z);
        zmin = min(zmin, abs(z));
        if (dist> Bailout) break;
      }
    }
    else if( Formula == 2 ) {
      for (i = PreIter; i < Iterations; i++) {
        z = cSin(cPow(z, Power)) + c;
        dist = dot(z,z);
        zmin = min(zmin, abs(z));
        if (dist > Bailout) break;
      }
    }
    else if( Formula == 3 ) {
      for (i = PreIter; i < Iterations; i++) {
        z = cCos(cPow(z, Power)) + c;
        dist = dot(z,z);
        zmin = min(zmin, abs(z));
        if (dist > Bailout) break;
      }
    }
    else if( Formula == 4 ) {
      for (i = PreIter; i < Iterations; i++) {
        z = cPow(cPow(z, Power)+c, Power)+cPow(c, Power)+z;
        dist = dot(z,z);
        zmin = min(zmin, abs(z));
        if (dist > Bailout) break;
      }
    }

    vec3 rColor=vec3(.0);

    if (i < Iterations) {
      rColor = StalksOutside?StalkColor((float(i+PreIter)+.5)*.01,zmin): IQColor(float(i),z);
    }  else {
      rColor = StalksInside?StalkColor((float(i+PreIter)+.5)*.01,zmin): vec3(.0);
    }

    return rColor;
}

#preset Default
Gamma = 2
Brightness = 1
Contrast = 1
Saturation = 1
Center = -0.4955488,-0.0089606
Zoom = 0.8545196
ToneMapping = 3
Exposure = 1
AARange = 1.5
AAExp = 10
GaussianAA = true
Iterations = 256
R = 0.4619565
G = 0.65
B = 1
Power = 2
Bailout = 45
ColDiv = 16
Formula = 0
PreIter = 0
Julia = false
JuliaXY = -0.3333333,-0.6666667
StalksInside = false
StalksOutside = false
Invert = false
InvertC = -0.5045111,0.9027778
#endpreset


#preset Mandel2
Gamma = 2
Brightness = 1
Contrast = 1
Saturation = 1
Center = -0.4977077,0.0414333
Zoom = 0.9861511
ToneMapping = 1
Exposure = 1
AARange = 1.5
AAExp = 10
GaussianAA = true
Iterations = 1000
R = 0.25
G = 0.5
B = 0.75
Power = 2
Bailout = 45
ColDiv = 16
Formula = 2
PreIter = 0
Julia = false
JuliaXY = -0.4444444,0.6666667
StalksInside = false
StalksOutside = false
Invert = false
InvertC = 0,0
#endpreset


#preset Julia1
Gamma = 2
Brightness = 1
Contrast = 1
Saturation = 1
Center = -0.519633,-0.0140222
Zoom = 0.7456719
ToneMapping = 1
Exposure = 1
AARange = 1.5
AAExp = 10
GaussianAA = true
Iterations = 1000
R = 0.25
G = 0.5
B = 0.75
Power = 2
Bailout = 200
ColDiv = 10
Formula = 1
PreIter = 0
Julia = true
JuliaXY = -0.4444444,0.6666667
StalksInside = false
StalksOutside = false
Invert = false
InvertC = 0,0
#endpreset

#preset ZeeCreature
Gamma = 2
Brightness = 1
Contrast = 1
Saturation = 1
Center = 0.0233788,0.0779768
Zoom = 0.7430605
ToneMapping = 1
Exposure = 1
AARange = 1.5
AAExp = 3
GaussianAA = true
Iterations = 2447
R = 0.25
G = 0.4808743
B = 0.7405405
Power = 3
Bailout = 24
ColDiv = 24
Formula = 3
PreIter = 1
Julia = true
JuliaXY = -0.1944423,0.362231
StalksInside = true
StalksOutside = false
Invert = false
InvertC = 0,0
#endpreset

#preset MetaBrot2
Gamma = 2
Brightness = 1
Contrast = 1
Saturation = 1
Center = -0.1869168,0.0022874
Zoom = 0.854514
ToneMapping = 3
Exposure = 1
AARange = 1.5
AAExp = 1
GaussianAA = true
Iterations = 1000
R = 0.25
G = 0.5
B = 0.75
Power = 4
Bailout = 16
ColDiv = 8
Formula = 1
PreIter = 0
Julia = true
JuliaXY = 0.0555556,0
StalksInside = false
StalksOutside = false
Invert = false
InvertC = 0,0
#endpreset

#preset MetaBrot3
Gamma = 2
Brightness = 1
Contrast = 1
Saturation = 1
Center = -0.0033551,-0.0053282
Zoom = 0.95
ToneMapping = 3
Exposure = 1
AARange = 1.5
AAExp = 10
GaussianAA = true
Iterations = 1000
R = 0.25
G = 0.5
B = 0.75
Power = 2
Bailout = 16
ColDiv = 16
Formula = 4
PreIter = 0
Julia = true
JuliaXY = -0.2777778,0
StalksInside = false
StalksOutside = false
Invert = false
InvertC = 0,0
#endpreset

#preset StalkJ0
Gamma = 2
Brightness = 1
Contrast = 1
Saturation = 1
Center = 0.0239816,0.0146943
Zoom = 0.2803257
ToneMapping = 1
Exposure = 1
AARange = 1.5
AAExp = 10
GaussianAA = true
Iterations = 3360
R = 0.4673913
G = 0.6939891
B = 1
Power = 2
Bailout = 6
ColDiv = 24
Formula = 0
PreIter = 0
Julia = true
JuliaXY = -0.7389,-0.0785956
StalksInside = true
StalksOutside = false
Invert = true
InvertC = 0,0
#endpreset

#preset f1p2s
Gamma = 2
Brightness = 1
Contrast = 1
Saturation = 1
Center = -0.4955488,-0.0089606
Zoom = 0.8545196
ToneMapping = 3
Exposure = 1
AARange = 1.5
AAExp = 10
GaussianAA = true
Iterations = 256
R = 0.4619565
G = 0.65
B = 1
Power = 2
Bailout = 100
ColDiv = 16
Formula = 1
PreIter = 0
Julia = true
JuliaXY = -0.3333333,-0.6666667
StalksInside = true
StalksOutside = false
Invert = false
InvertC = -0.5045111,0.9027778
#endpreset

#preset GravityWell
Gamma = 2
Brightness = 1
Contrast = 1
Saturation = 1
Center = -1.53247,-2.15594
Zoom = 0.0600431
ToneMapping = 3
Exposure = 1
AARange = 1.5
AAExp = 10
GaussianAA = true
Iterations = 70
R = 0.4619565
G = 0.65
B = 1
Power = 2
Bailout = 6
ColDiv = 16
Formula = 2
PreIter = 0
Julia = true
JuliaXY = -0.6666667,-0.3333333
StalksInside = true
StalksOutside = false
Invert = true
InvertC = 0.0694444,0.5555556
#endpreset

#preset ISJ22
Gamma = 2
Brightness = 1
Contrast = 1
Saturation = 1
Center = -0.009916,-0.0012859
Zoom = 0.5618605
ToneMapping = 3
Exposure = 1
AARange = 1.5
AAExp = 10
GaussianAA = true
Iterations = 500
R = 0.3
G = 0.6
B = 1
Power = 2
Bailout = 50
ColDiv = 12
Formula = 2
PreIter = 0
Julia = true
JuliaXY = -0.8055556,0.0833333
StalksInside = true
StalksOutside = false
Invert = true
InvertC = 0,0
#endpreset

#preset ISJ02
Gamma = 2
Brightness = 1
Contrast = 1
Saturation = 1
Center = 0.0239816,0.0146943
Zoom = 0.2803257
ToneMapping = 1
Exposure = 1
AARange = 1.5
AAExp = 10
GaussianAA = true
R = 0.4456522
G = 0.6666667
B = 1
Power = 2
Bailout = 384
ColDiv = 9.448529
Formula = 0
PreIter = 0
Julia = true
JuliaXY = -0.75,0.0878
Invert = true
InvertC = 0,0
Iterations = 88
StalksInside = true
StalksOutside = true
#endpreset

#preset ISJ03
Gamma = 2
Brightness = 1
Contrast = 1
Saturation = 1
Center = 3.022134,-0.7589664
Zoom = 0.1050157
ToneMapping = 3
Exposure = 1
AARange = 1.5
AAExp = 10
GaussianAA = true
Iterations = 512
R = 0.4619565
G = 0.65
B = 1
Power = 3
Bailout = 4
ColDiv = 12
Formula = 0
PreIter = 0
Julia = true
JuliaXY = 0.4428767,0.0276778
StalksInside = true
StalksOutside = false
Invert = true
InvertC = 0.7638889,0
#endpreset
