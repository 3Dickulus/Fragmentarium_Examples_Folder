// Mandelbox2D_ParamViz_v1
// This is a baseline 2D Mandelbox that can be used
//     as a start on which to test modifications
// Includes overlay display for visualization of params:
//     boxfold limit, circle of inversion, min radius of inversion, 
//     and plot of a specified iterated point through stages of single iteration
// Implemented by CozyG (aka Gregg Helt)
//   2D framework and coloring based on approach used in Fragmentarium/Examples/Kali.frag

#define providesInit
#info Mandelbox2D_ParamViz_v1

#include "MathUtils.frag"
#include "Progressive2DColoring.frag"

#group Mandelboxen
uniform float Scale; slider[-5,2,5]
uniform float BoxFoldLimit; slider[-5,1,5]
uniform vec2 BoxCenter; slider[(-5,-5),(0,0),(5,5)]
uniform float InvRadius; slider[0.001,1.2,5]
uniform float MinRadius; slider[0.0,0.4,5]
uniform vec2 InvCenter; slider[(-5,-5),(0,0),(5,5)]

#group ParamOverlay
uniform bool ShowInversionOverlay; checkbox[false]
uniform bool ShowBoxfoldOverlay; checkbox[false]
uniform bool ShowTestPoint; checkbox[false]
uniform vec2 TestPoint; slider[(-10,-10),(0.3846,1.5),(10,10)]

// TestPoint Mode == 0, test point is point before boxfold
// TestPoint Mode == 1, test point is point after boxfold (allows more direct testing of inversion effect)
uniform int TestPointMode; slider[0,0,1]    

uniform vec3 InvColor; color[1,1,0]
uniform vec3 MinColor; color[1,0,0]
uniform vec3 BoxColor; color[0,1,1]
uniform vec3 TestPointColor; color[1,0,1]
uniform vec3 ScaleColor; color[1,0.5,0.5]
uniform vec3 OffsetColor; color[1,0.54902,0.0784314]
                        
uniform float OverlayLineWidth; slider[3,5,30]
uniform float OverlayPointSize; slider[5,10,60]

const float PI =  3.14159265359;
const float PI2 = 6.28318530718;

float overlayLineCoordWidth;
float overlayPointCoordRadius;
float invRadius2;
float minRadius2;

void init() {
  invRadius2 = InvRadius * InvRadius;
  minRadius2 = MinRadius * MinRadius;
    // trying to keep overlay constant pixel size
  overlayLineCoordWidth = OverlayLineWidth * pixelSize.x / 2.0;
  overlayPointCoordRadius = OverlayPointSize * pixelSize.x;
}

void boxFold(inout vec2 p) {
  p -= BoxCenter;
  // fold x
  if (p.x > BoxFoldLimit) { p.x = 2.0*BoxFoldLimit - p.x; } 
  else if (p.x < -BoxFoldLimit) { p.x = -2.0*BoxFoldLimit - p.x; }
  // fold y
  if (p.y > BoxFoldLimit) { p.y = 2.0*BoxFoldLimit - p.y; }
  else if (p.y < -BoxFoldLimit) { p.y = -2.0*BoxFoldLimit -p.y; }
  p += BoxCenter;
}

void inversion(inout vec2 p) {
  p -= InvCenter;
  float pointRadius2 = dot(p,p);
  if (pointRadius2 < minRadius2) {
    // scale by constant
    p *= invRadius2/minRadius2;  
  }
  else if (pointRadius2 < invRadius2) {
    // circle inversion
    p *= invRadius2/pointRadius2;
  }
  p += InvCenter;
}

// Mandelbox2D iteration function
//   (called iteratively in Progessive2DColoring.frag)
// for every iteration:
//   p' = (Scale(Inversion(Boxfold(p))) + c
vec2 formula(vec2 p, vec2 c) {
  boxFold(p);
  inversion(p);
  p *= Scale;
  p += c;
  return p;
}


bool colorCircle(vec2 p, float radius, vec3 drawColor, inout vec3 color) {
  vec2 pc = p;
  pc -= InvCenter;
  bool hit = false;
  if (abs(length(pc) - radius) <= overlayLineCoordWidth) {
    color = drawColor;
    hit = true;
  }
  return hit;
}

bool colorBox(vec2 p, inout vec3 color) {
  vec2 pc = p;
  pc -= BoxCenter;
  bool hit = false;
  if ((abs(pc.x - BoxFoldLimit) <= overlayLineCoordWidth) ||
      (abs(pc.y - BoxFoldLimit) <= overlayLineCoordWidth) ||
      (abs(pc.x + BoxFoldLimit) <= overlayLineCoordWidth) ||
      (abs(pc.y + BoxFoldLimit) <= overlayLineCoordWidth)) {
    color = BoxColor;
    hit = true;
  }
  return hit;
}

bool colorTestPoint(vec2 p, inout vec3 color) {
  bool hit = false;
  vec2 offset = vec2(TestPoint.x, TestPoint.y);
  vec2 q = vec2(TestPoint.x, TestPoint.y);
  if (TestPointMode == 0) {
    if (distance(q, p) < overlayPointCoordRadius) {
      color = TestPointColor;
      hit = true;
    }
    if (!hit) {
      boxFold(q);
      if (distance(q, p) < overlayPointCoordRadius) {
        color = BoxColor;
        hit = true;
      }
    }
  }
  else {
    if (distance(q, p) < overlayPointCoordRadius) {
      color = BoxColor;
      hit = true;
    }
  }
  if (!hit) {
    inversion(q);
    if (distance(q, p) < overlayPointCoordRadius) {
      color = InvColor;
      hit = true;
    }
  }
  if (!hit) {
    q *= Scale;
    if (distance(q, p) < overlayPointCoordRadius) {
      color = ScaleColor;
      hit = true;
    }
  }
  if (!hit) {
    q += offset;
    if (distance(q, p) < overlayPointCoordRadius) {
      color = OffsetColor;
      hit = true;
    }
  }
  return hit;
}


bool applyColorOverlay(vec2 p, inout vec3 color) {
  bool hit = false;
  if (ShowTestPoint) {
    hit = colorTestPoint(p, color);
  }
  if (!hit && ShowInversionOverlay) {
    hit = colorCircle(p, InvRadius, InvColor, color);
    if (!hit) { hit = colorCircle(p, MinRadius, MinColor, color); }
  }
  if (!hit && ShowBoxfoldOverlay) {
    hit = colorBox(p, color);
  }
  return hit;
}

#preset Default
Center = 0,0
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
GrayScale = false
Fade = 1
EscapeColor = 0,0,0
Scale = 2
BoxFoldLimit = 1
BoxCenter = 0,0
InvRadius = 1.2
MinRadius = 0.4
InvCenter = 0,0
ShowInversionOverlay = false
ShowBoxfoldOverlay = false
ShowTestPoint = false
TestPoint = 0.3846,1.5
TestPointMode = 0
InvColor = 1,1,0
MinColor = 1,0,0
BoxColor = 0,1,1
TestPointColor = 1,0,1
ScaleColor = 1,0.5,0.5
OffsetColor = 1,0.54902,0.0784314
OverlayLineWidth = 10
OverlayPointSize = 20
#endpreset

#preset ParamViz_All
Center = 0,0
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
GrayScale = true
Fade = 0.5
EscapeColor = 0,0,0
Scale = 2
BoxFoldLimit = 1
BoxCenter = 0,0
InvRadius = 1.2
MinRadius = 0.4
InvCenter = 0,0
ShowInversionOverlay = true
ShowBoxfoldOverlay = true
ShowTestPoint = true
TestPoint = 1.8,1.4
TestPointMode = 0
InvColor = 1,1,0
MinColor = 1,0,0
BoxColor = 0,1,1
TestPointColor = 1,0,1
ScaleColor = 1,0.466667,0.360784
OffsetColor = 0.584314,0.211765,0.219608
OverlayLineWidth = 10
OverlayPointSize = 20
#endpreset

#preset ParamViz_TestPointOff
Center = 0,0
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
GrayScale = true
Fade = 0.5
EscapeColor = 0,0,0
Scale = 2
BoxFoldLimit = 1
BoxCenter = 0,0
InvRadius = 1.2
MinRadius = 0.4
InvCenter = 0,0
ShowInversionOverlay = true
ShowBoxfoldOverlay = true
ShowTestPoint = false
TestPoint = 1.8,1.4
TestPointMode = 0
InvColor = 1,1,0
MinColor = 1,0,0
BoxColor = 0,1,1
TestPointColor = 1,0,1
ScaleColor = 1,0.466667,0.360784
OffsetColor = 0.584314,0.211765,0.219608
OverlayLineWidth = 10
OverlayPointSize = 20
#endpreset
