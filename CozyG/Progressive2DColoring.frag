#donotrun
#include "Progressive2D.frag"

#group EscapeTime2D
// Number of iterations
uniform int  Iterations; slider[1,8,100]
// Skip this number of iterations before starting coloring
uniform int  PreIterations; slider[0,1,100]
uniform float R; slider[0,0,1]
uniform float G; slider[0,0.5,1]
uniform float B; slider[0,1.0,1]
uniform float C; slider[0,0.3,2]
uniform float EscapeSize; slider[0,1.2,11]
uniform int ColoringType; slider[0,1,2]
uniform float ColorFactor; slider[0,0.15,1]
uniform bool FlattenEscapeColor; checkbox[true]
uniform bool GrayScale; checkbox[false]
uniform float Fade; slider[0,1,1]
uniform vec3 EscapeColor; color[0.0,0.0,0.0]

vec2 formula(vec2 p, vec2 c);
bool applyColorOverlay(vec2 p, inout vec3 color);

vec3 oColor = vec3(0,0,0);
float escape = pow(10.0,EscapeSize);

vec3 color(vec2 c) {
  vec2 p = vec2(c.x, c.y); // p.xy = c.xy
  int i = 0;
  float col = 0.0;
  float dist;
  if (ColoringType == 0) {
    float dsum = 0.0;
    for (i=0; i<Iterations; i++) {
      p = formula(p,c);
      dist = length(p);
      if (i > PreIterations) {
        dsum += dist;
        // if (dot(p,p)>escape) break;
        if (dist > escape) break;
      }
    }
    float avg = float(i-PreIterations)/dsum;
    col =  1.0 - log2(.5*log2(avg/C));
  }
  else if (ColoringType == 1) {
    float m = 0.0;
    for (i = 0; i < Iterations; i++) {
      p = formula(p,c);
      dist = length(p);
      if (i > PreIterations) {
        m = mix(m, dist, ColorFactor);
        if (dist > escape) break;
      }
    }
    col =  1.0 - log2(.5*log2(m/C));
  }
  else if (ColoringType == 2) {
    for (i = 0; i < Iterations; i++) {
      p = formula(p,c);
      dist = length(p);
      if (i > PreIterations) {
        if (dist > escape) break;
      }
    }
    col =  float(i) + 1.0 - log2(.5*log2(dist*dist));	
  }
  if (applyColorOverlay(c, oColor)) {
    return oColor;
  }
  else if (dist >= escape && FlattenEscapeColor) {
    return EscapeColor;
  }
  else if (GrayScale) {
    return vec3((0.5 + 0.5*cos(6.*col))*Fade, 
                (0.5 + 0.5*cos(6.*col))*Fade, 
                (0.5 + 0.5*cos(6.*col))*Fade);
  }
  else {
    return vec3((0.5 + 0.5*cos(6.*col + R))*Fade, 
                (0.5 + 0.5*cos(6.*col + G))*Fade, 
                (0.5 + 0.5*cos(6.*col + B))*Fade);
  }
}
