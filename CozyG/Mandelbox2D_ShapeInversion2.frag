// Mandelbox2D_ShapeInversion
//   a 2D version of the Mandelbox that generalizes circle inversion step to allow inversion in alternate shapes
//   initial version by CozyG (aka Gregg Helt)
//   2D framework and coloring based on approach used in Fragmentarium/Examples/Kali.frag

#define providesInit
#info Mandelbox2D_ShapeInversion1

#include "MathUtils.frag"
#include "Progressive2DColoring.frag"

#group Mandelboxen
uniform float Scale; slider[-5,0,5]
uniform float BoxFoldLimit; slider[0,1,5]
uniform vec2 InvCenter; slider[(-5,-5),(0,0),(5,5)]
uniform float InvMinRadius; slider[-3,0,3]
uniform float InvParamA; slider[-5,1,5]
uniform float InvParamB; slider[-5,4,20]
uniform float InvParamC; slider[0.0001,1.5,8]
uniform int ShapeMode; slider[0,0,3]
                       // shape 0 => circle
                       // shape 1 => ellipse
                       // shape 2 => polygon
                       // shape 3 => superellipse
uniform float ZFactor1; slider[-5,0,5]
uniform float ZFactor2; slider[-5,0,5]

uniform bool ShowOverlay; checkbox[false]
uniform float OverlayLineWidth; slider[0.001,2,100]
uniform vec3 OverlayColor; color[1.0,0.0,0.0]

const float PI =  3.14159265359;
const float PI2 = 6.28318530718;
float z1, z2;
float overlayWidth;
float minDistanceSqr;

void init() {
  z1 = ZFactor1 * ZFactor1;
  if (ZFactor1 < 0.0) { z1 = -z1; }
  z2 = ZFactor2 * ZFactor2;
  if (ZFactor2 < 0.0) { z2 = -z2; }
  // OverlayLineWidth is pixels
  // pixelSize should be in coords/pixel
  // so overlayWidth is in coords (not working that way though?) 
  overlayWidth = OverlayLineWidth * (pixelSize.x + pixelSize.y)/2.0;
  minDistanceSqr = InvMinRadius * InvMinRadius;
}

// standard Mandelbox box fold but in 2D
void boxFold(inout vec2 p) {
  // fold x
  if (p.x > BoxFoldLimit) { p.x = 2.0*BoxFoldLimit - p.x; } 
  else if (p.x < -BoxFoldLimit) { p.x = -2.0*BoxFoldLimit - p.x; }
  // fold y
  if (p.y > BoxFoldLimit) { p.y = 2.0*BoxFoldLimit - p.y; }
  else if (p.y < -BoxFoldLimit) { p.y = -2.0*BoxFoldLimit -p.y; }
}

vec2 getShapeIntersect(vec2 p) {
  float t = atan(p.y, p.x);
  vec2 intersectP;
  if (ShapeMode == 0) { // circle
    float r = InvParamA;
    intersectP = vec2(r*cos(t), r*sin(t));
  }
  else if (ShapeMode == 1) {  // ellipse
    float sinA2 = InvParamA * InvParamA * sin(t) * sin(t);
    float cosB2 = InvParamB * InvParamB * cos(t) * cos(t);
    float r = (InvParamA * InvParamB) / sqrt(sinA2 + cosB2);
    intersectP = vec2(r*cos(t), r*sin(t));
  }
  else if (ShapeMode == 2) { // polygon
    float n = floor(InvParamB);
    float r = cos(PI/n) / cos(mod(t,PI2/n) - PI/n);
    r *= InvParamA;
    intersectP =  vec2(r*cos(t), r*sin(t));
  }
  else if (ShapeMode == 3) { // superellipse
    float sinAPow = pow(abs(InvParamA*sin(t)), InvParamC);
    float cosBPow = pow(abs(InvParamB*cos(t)), InvParamC);
    float r = (InvParamA * InvParamB) / pow((sinAPow + cosBPow), 1.0/InvParamC);
    // if (p.x < 0.0) { r *= -1.0; }
    intersectP =  vec2(r*cos(t), r*sin(t));
    // if (p.x < 0.0) { intersectP.x *= -1.0; }
    // if (p.y < 0.0) { intersectP.y *= -1.0; }
  }
  else {  // out of range for ShapeModes
    intersectP =  vec2(1.0, 1.0);
  }
  return intersectP;
}


// modified inversion that can use shapes other than circles
void shapeInversion(inout vec2 p) {
  p -= InvCenter;
  float pointDistanceSqr = dot(p,p);
  vec2 shapeIntersect = getShapeIntersect(p);
  float shapeDistanceSqr = dot(shapeIntersect, shapeIntersect);
  pointDistanceSqr += z1;
  shapeDistanceSqr += z2;
  if (pointDistanceSqr < minDistanceSqr) {
    // if distance < minradius, scale by constant
    p *= InvParamA * InvParamA / minDistanceSqr;
  }
  else if (pointDistanceSqr < shapeDistanceSqr) {
    // shape inversion
    p *= shapeDistanceSqr/pointDistanceSqr;
  }
  p += InvCenter;
}

// Mandelbox2D iteration function
//   (called iteratively in Progessive2DColoring.frag)
// for every iteration:
//   p' = (Scale(Inversion(Boxfold(p))) + c
vec2 formula(vec2 p, vec2 c) {
  boxFold(p);
  shapeInversion(p);
  p *= Scale;
  p += c;
  return p;
}

bool applyColorOverlay(vec2 p, inout vec3 color) {
  if (!ShowOverlay) { return false; }
  p = p-InvCenter;
  vec2 intersectP = getShapeIntersect(p);
  if (distance(p, intersectP) <= overlayWidth) {
    color =  OverlayColor;
    return true;
  }
  else {
    return false;
  }
}

#preset Default
Gamma = 1.2
Brightness = 1.585366
Contrast = 1
Saturation = 0.9722222
Center = 0.038115,0
Zoom = 0.1503518
ToneMapping = 1
Exposure = 1
AARange = 2
AAExp = 1
GaussianAA = true
Iterations = 8
PreIterations = 1
R = 0.13235
G = 0.55807
B = 1
C = 0.3
EscapeSize = 1.2
ColoringType = 1
ColorFactor = 0.15
FlattenEscapeColor = true
EscapeColor = 0,0,0
Scale = 2
BoxFoldLimit = 1
InvCenter = 0,0
InvMinRadius = 0.614
InvParamA = 1.3
InvParamB = 1
ShapeMode = 0
ZFactor1 = 0
ZFactor2 = 0
ShowOverlay = false
OverlayLineWidth = 30
OverlayColor = 1,0,0
#endpreset

#preset circle_inversion
Gamma = 1.2
Brightness = 1.585366
Contrast = 1
Saturation = 0.9722222
Center = 0.038115,0
Zoom = 0.1503518
ToneMapping = 1
Exposure = 1
AARange = 2
AAExp = 1
GaussianAA = true
Iterations = 8
PreIterations = 1
R = 0.13235
G = 0.55807
B = 1
C = 0.3
EscapeSize = 1.2
ColoringType = 1
ColorFactor = 0.15
FlattenEscapeColor = true
EscapeColor = 0,0,0
Scale = 2
BoxFoldLimit = 1
InvCenter = 0,0
InvMinRadius = 0.614
InvParamA = 1.3
InvParamB = 1
ShapeMode = 0
ZFactor1 = 0
ZFactor2 = 0
ShowOverlay = true
OverlayLineWidth = 30
OverlayColor = 1,0,0
#endpreset

#preset ellipse_inversion
Gamma = 1.2
Brightness = 1.585366
Contrast = 1
Saturation = 0.9722222
Center = 0.038115,0
Zoom = 0.1503518
ToneMapping = 1
Exposure = 1
AARange = 2
AAExp = 1
GaussianAA = true
Iterations = 8
PreIterations = 1
R = 0.13235
G = 0.55807
B = 1
C = 0.3
EscapeSize = 1.2
ColoringType = 1
ColorFactor = 0.15
FlattenEscapeColor = true
EscapeColor = 0,0,0
Scale = 2
BoxFoldLimit = 1
InvCenter = 0,0
InvMinRadius = 0.614
InvParamA = 1.3
InvParamB = 0.65
ShapeMode = 1
ZFactor1 = 0
ZFactor2 = 0
ShowOverlay = true
OverlayLineWidth = 30
OverlayColor = 1,0,0
#endpreset

#preset square_inversion
Gamma = 1.2
Brightness = 1.585366
Contrast = 1
Saturation = 0.9722222
Center = 0.038115,0
Zoom = 0.1503518
ToneMapping = 1
Exposure = 1
AARange = 2
AAExp = 1
GaussianAA = true
Iterations = 8
PreIterations = 1
R = 0.13235
G = 0.55807
B = 1
C = 0.3
EscapeSize = 1.2
ColoringType = 1
ColorFactor = 0.15
FlattenEscapeColor = true
EscapeColor = 0,0,0
Scale = 2
BoxFoldLimit = 1
InvCenter = 0,0
InvMinRadius = 0.614
InvParamA = 1.3
InvParamB = 4
ShapeMode = 2
ZFactor1 = 0
ZFactor2 = 0
ShowOverlay = true
OverlayLineWidth = 30
OverlayColor = 1,0,0
#endpreset

#preset hexagon_inversion
Gamma = 1.2
Brightness = 1.585366
Contrast = 1
Saturation = 0.9722222
Center = 0.038115,0
Zoom = 0.1503518
ToneMapping = 1
Exposure = 1
AARange = 2
AAExp = 1
GaussianAA = true
Iterations = 8
PreIterations = 1
R = 0.13235
G = 0.55807
B = 1
C = 0.3
EscapeSize = 1.2
ColoringType = 1
ColorFactor = 0.15
FlattenEscapeColor = true
EscapeColor = 0,0,0
Scale = 2
BoxFoldLimit = 1
InvCenter = 0,0
InvMinRadius = 0.614
InvParamA = 1.3
InvParamB = 6
ShapeMode = 2
ZFactor1 = 0
ZFactor2 = 0
ShowOverlay = true
OverlayLineWidth = 30
OverlayColor = 1,0,0
#endpreset

#preset octagon_inversion
Gamma = 1.2
Brightness = 1.585366
Contrast = 1
Saturation = 0.9722222
Center = 0.038115,0
Zoom = 0.1503518
ToneMapping = 1
Exposure = 1
AARange = 2
AAExp = 1
GaussianAA = true
Iterations = 8
PreIterations = 1
R = 0.13235
G = 0.55807
B = 1
C = 0.3
EscapeSize = 1.2
ColoringType = 1
ColorFactor = 0.15
FlattenEscapeColor = true
EscapeColor = 0,0,0
Scale = 2
BoxFoldLimit = 1
InvCenter = 0,0
InvMinRadius = 0.614
InvParamA = 1.3
InvParamB = 8.321168
ShapeMode = 2
ZFactor1 = 0
ZFactor2 = 0
ShowOverlay = true
OverlayLineWidth = 30
OverlayColor = 1,0,0
#endpreset

#preset superellipse_inversion
Center = 0.038115,0
Zoom = 0.150352
Gamma = 1.2
ToneMapping = 1
Exposure = 1
Brightness = 1.58537
Contrast = 1
Saturation = 0.972222
AARange = 2
AAExp = 1
GaussianAA = true
Iterations = 8
PreIterations = 1
R = 0.13235
G = 0.55807
B = 1
C = 0.3
EscapeSize = 1.2
ColoringType = 1
ColorFactor = 0.15
FlattenEscapeColor = true
EscapeColor = 0,0,0
Scale = 2
BoxFoldLimit = 1
InvCenter = 0,0
InvMinRadius = 0.614
InvParamA = 1.1111
InvParamB = 2.03125
InvParamC = 0.66281
ShapeMode = 3
ZFactor1 = 0
ZFactor2 = 0
ShowOverlay = true
OverlayLineWidth = 30
OverlayColor = 1,0,0
#endpreset
