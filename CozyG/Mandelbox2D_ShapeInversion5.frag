// Mandelbox2D_ShapeInversion v5
//   a 2D version of the Mandelbox that generalizes circle inversion step to allow inversion in alternate shapes
//   initial version by CozyG (aka Gregg Helt)
//   2D framework and coloring based on approach ued in Fragmentarium/Examples/Kali.frag
// improvements in this version:
//   in addition to parameters to set the inversion shape,
//   replaced the min radius (used to determine whether to apply inversion or scaling) with parameterized minShape
//   added new shape maxShape to determine outer bound of region where inversion is applied)
//   for now both minShape and maxShape have same origin as invShape

#define providesInit
#info Mandelbox2D_ShapeInversion5

#include "MathUtils.frag"
#include "Progressive2DColoring.frag"

#group Overlay
uniform bool ShowOverlay; checkbox[false]
uniform vec3 InvShapeColor; color[1.0,0.0,0.0]
uniform vec3 MinShapeColor; color[0.0,1.0,0.0]
uniform vec3 MaxShapeColor; color[0.0,0.0,1.0]
uniform float OverlayLineWidth; slider[0.001,2,100]

#group InversionShapes
                       // shape types:
                       // 0 => circle
                       // 1 => ellipse
                       // 2 => polygon
                       // 3 => superellipse
uniform int InvShapeType; slider[0,0,3]
uniform vec2 InvCenter; slider[(-5,-5),(0,0),(5,5)]
uniform float InvShapeScale; slider[-5,1,5]
uniform float InvShapeParamA; slider[-5,1,20]
uniform float InvShapeParamB; slider[-5,4,20]
uniform float InvShapeParamC; slider[0.0001,1.5,8]

uniform int MinShapeType; slider[0,0,3]
                          // uniform vec2 MinShapeCenter; slider[(-5,-5),(0,0),(5,5)]
uniform float MinShapeScale; slider[-5,1,5]
uniform float MinShapeParamA; slider[-5,1,20]
uniform float MinShapeParamB; slider[-5,4,20]
uniform float MinShapeParamC; slider[0.0001,1.5,8]

uniform int MaxShapeType; slider[0,0,3]
                          //uniform vec2 MaxShapeCenter; slider[(-5,-5),(0,0),(5,5)]
uniform float MaxShapeScale; slider[-5,1,5]
uniform float MaxShapeParamA; slider[-5,1,20]
uniform float MaxShapeParamB; slider[-5,4,20]
uniform float MaxShapeParamC; slider[0.0001,1.5,8]


#group Mandelboxen
uniform float Scale; slider[-5,0,5]
                     // uniform float BoxFoldLimit; slider[0,1,5]
uniform float BoxFoldLimit; slider[-5,1,5]
uniform bool UseMinScalingConstant; checkbox[false]
uniform float MinScalingConstant; slider[-10,2,10]
uniform bool UseMaxScalingConstant; checkbox[false]
uniform float MaxScalingConstant; slider[-10,1,10]
uniform bool UseMaxShape; checkbox[false]
uniform float ZFactor1; slider[-5,0,5]
uniform float ZFactor2; slider[-5,0,5]


const float PI =  3.14159265359;
const float PI2 = 6.28318530718;
float z1, z2;
float overlayWidth;

struct Shape {
  int stype;
  vec2 origin;
  float scale;
  vec3 drawColor;
  float a;
  float b;
  float c;
};

Shape minShape;
Shape maxShape;
Shape invShape;

void init() {
  z1 = ZFactor1 * ZFactor1;
  if (ZFactor1 < 0.0) { z1 = -z1; }
  z2 = ZFactor2 * ZFactor2;
  if (ZFactor2 < 0.0) { z2 = -z2; }
  // OverlayLineWidth is pixels
  // pixelSize should be in coords/pixel
  // so overlayWidth is in coords (not working that way though?) 
  overlayWidth = OverlayLineWidth * (pixelSize.x + pixelSize.y)/2.0;
  invShape = Shape(InvShapeType, InvCenter, InvShapeScale, InvShapeColor, InvShapeParamA, InvShapeParamB, InvShapeParamC);
  minShape = Shape(MinShapeType, InvCenter, MinShapeScale, MinShapeColor, MinShapeParamA, MinShapeParamB, MinShapeParamC);
  maxShape = Shape(MaxShapeType, InvCenter, MaxShapeScale, MaxShapeColor, MaxShapeParamA, MaxShapeParamB, MaxShapeParamC);
}

void boxFold(inout vec2 p) {
  // fold x
  if (p.x > BoxFoldLimit) { p.x = 2.0*BoxFoldLimit - p.x; } 
  else if (p.x < -BoxFoldLimit) { p.x = -2.0*BoxFoldLimit - p.x; }
  // fold y
  if (p.y > BoxFoldLimit) { p.y = 2.0*BoxFoldLimit - p.y; }
  else if (p.y < -BoxFoldLimit) { p.y = -2.0*BoxFoldLimit -p.y; }
}

vec2 getShapeIntersect(vec2 p, Shape shp) {
  float t = atan(p.y, p.x);  // theta angle
  vec2 intersectP;
  if (shp.stype == 0) { // circle
    float r = shp.scale;
    intersectP = vec2(r*cos(t), r*sin(t));
  }
  else if (shp.stype == 1) {  // ellipse
    float sinA2 = shp.a * shp.a * sin(t) * sin(t);
    float cosB2 = shp.b * shp.b * cos(t) * cos(t);
    float r = shp.scale * (shp.a * shp.b) / sqrt(sinA2 + cosB2);
    intersectP = vec2(r*cos(t), r*sin(t));
  }
  else if (shp.stype == 2) { // polygon
    // param A => number of sides to the polygon
    float n = floor(shp.a);
    float r = cos(PI/n) / cos(mod(t,PI2/n) - PI/n);
    r *= shp.scale;;
    intersectP =  vec2(r*cos(t), r*sin(t));
  }
  else if (shp.stype == 3) { // superellipse
    float sinAPow = pow(abs(shp.a*sin(t)), shp.c);
    float cosBPow = pow(abs(shp.b*cos(t)), shp.c);
    float r = (shp.a * shp.b) / pow((sinAPow + cosBPow), 1.0/shp.c);
    r *= shp.scale;
    // if (p.x < 0.0) { r *= -1.0; }
    intersectP =  vec2(r*cos(t), r*sin(t));
    // if (p.x < 0.0) { intersectP.x *= -1.0; }
    // if (p.y < 0.0) { intersectP.y *= -1.0; }
  }
  else {  // out of range for shape types, should never get here but if do, just return a constant
    intersectP =  vec2(1.0, 1.0);
  }
  return intersectP;
  return vec2(1.0,1.0);
}

// modified inversion that can use shapes other than circles
void shapeInversion(inout vec2 p) {
  vec2 minp = vec2(p.x, p.y);
  vec2 maxp = vec2(p.x, p.y);
  p -= invShape.origin;
  minp -= minShape.origin;
  maxp -= maxShape.origin;
  float pointDistanceSqr = dot(p,p);
  vec2 invIntersect = getShapeIntersect(p, invShape);

  float invDistanceSqr = dot(invIntersect, invIntersect);
  vec2 minIntersect = getShapeIntersect(minp, minShape);
  float minDistanceSqr = dot(minIntersect, minIntersect);
  vec2 maxIntersect;
  float maxDistanceSqr;
  if (UseMaxShape) {
    maxIntersect = getShapeIntersect(maxp, maxShape);
    maxDistanceSqr = dot(maxIntersect, maxIntersect);
  }
  else { // don't use maxShape, consider max same as invShape
    maxIntersect = invIntersect;
    maxDistanceSqr = invDistanceSqr;
  }
  pointDistanceSqr += z1;
  invDistanceSqr += z2;
  if (pointDistanceSqr < minDistanceSqr) {
    if (UseMinScalingConstant)  {
      // if point is within min shape and constant option on, scale by constant
      p *= MinScalingConstant;
    } else {
      // if point is within min shape and constant option off,
      //    do inversion but as if point were at edge of min shape
      p *= invDistanceSqr / minDistanceSqr;
    }
  }
  else if (pointDistanceSqr < maxDistanceSqr) {
    // if point is outside minShape but with maxShape, do shape inversion relative to invShape
    p *= invDistanceSqr/pointDistanceSqr;
  }
  else if (UseMaxScalingConstant) {
    // try doing a conditional scaling if point is outside of maxShape?
    p *= MaxScalingConstant;
  }
  p += invShape.origin;
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


bool colorShape(vec2 p, Shape shp, inout vec3 color) {
  if (!ShowOverlay) { return false; }
  vec2 pc = p;
  pc -= shp.origin;  
  vec2 shpIntersect = getShapeIntersect(pc, shp);
  if (distance(pc, shpIntersect) <= overlayWidth) {
    color = shp.drawColor;
    return true;
  }
  else {
    return false;
  }
}

bool applyColorOverlay(vec2 p, inout vec3 color) {
  bool hit = colorShape(p, invShape, color);
  if (!hit) { hit = colorShape(p, minShape, color); }
  if (!hit && UseMaxShape) { hit = colorShape(p, maxShape, color); }
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
EscapeColor = 0,0,0
ShowOverlay = false
InvShapeColor = 1,1,0
MinShapeColor = 1,0,0
MaxShapeColor = 0,1,0
OverlayLineWidth = 20
InvCenter = 0,0
InvShapeType = 0
InvShapeScale = 1.3
InvShapeParamA = 1
InvShapeParamB = 1
InvShapeParamC = 1
MinShapeType = 0
MinShapeScale = 0.6
MinShapeParamA = 1
MinShapeParamB = 1
MinShapeParamC = 1
MaxShapeType = 0
MaxShapeScale = 1
MaxShapeParamA = 1
MaxShapeParamB = 1
MaxShapeParamC = 1
Scale = 2
BoxFoldLimit = 1
UseMinScalingConstant = false
MinScalingConstant = 1
UseMaxScalingConstant = false
MaxScalingConstant = 1
UseMaxShape = false
ZFactor1 = 0
ZFactor2 = 0
#endpreset

#preset circle_inversion
Gamma = 1.2
Brightness = 1.58537
Contrast = 1
Saturation = 0.972222
Center = 0,0
Zoom = 0.150352
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
ShowOverlay = true
InvShapeColor = 1,1,0
MinShapeColor = 1,0,0
MaxShapeColor = 0,1,0
OverlayLineWidth = 20
InvShapeType = 0
InvShapeScale = 1.3
InvShapeParamA = 1
InvShapeParamB = 1
InvShapeParamC = 1
MinShapeType = 0
MinShapeScale = 0.6
MinShapeParamA = 1
MinShapeParamB = 1
MinShapeParamC = 1
MaxShapeType = 0
MaxShapeScale = 1
MaxShapeParamA = 1
MaxShapeParamB = 1
MaxShapeParamC = 1
Scale = 2
BoxFoldLimit = 1
UseMinScalingConstant = false
MinScalingConstant = 1
UseMaxScalingConstant = false
MaxScalingConstant = 1
UseMaxShape = false
ZFactor1 = 0
ZFactor2 = 0
InvCenter = 0,0
#endpreset

#preset square_ellipse_inversion
Gamma = 1.2
Brightness = 1.58537
Contrast = 1
Saturation = 0.972222
Center = 0,0
Zoom = 0.150352
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
ShowOverlay = true
InvShapeColor = 1,1,0
MinShapeColor = 1,0,0
MaxShapeColor = 0,1,0
OverlayLineWidth = 30
InvShapeType = 2
InvCenter = 0,0
InvShapeScale = 1.3
InvShapeParamA = 4.16149
InvShapeParamB = 1
InvShapeParamC = 1
MinShapeType = 1
MinShapeScale = 0.1010102
MinShapeParamA = 6.464968
MinShapeParamB = 1.528662
MinShapeParamC = 1
MaxShapeType = 0
MaxShapeScale = 1
MaxShapeParamA = 1
MaxShapeParamB = 1
MaxShapeParamC = 1
Scale = 2
BoxFoldLimit = 1
UseMinScalingConstant = false
MinScalingConstant = 1
UseMaxScalingConstant = false
MaxScalingConstant = 1
UseMaxShape = false
ZFactor1 = 0
ZFactor2 = 0
#endpreset

#preset hexagon_superellipse_inversion
Gamma = 1.2
Brightness = 1.58537
Contrast = 1
Saturation = 0.972222
Center = 0,0
Zoom = 0.150352
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
ShowOverlay = true
InvShapeColor = 1,1,0
MinShapeColor = 1,0,0
MaxShapeColor = 0,1,0
OverlayLineWidth = 31.37324
InvShapeType = 2
InvCenter = 0,0
InvShapeScale = 1.3
InvShapeParamA = 6.490683
InvShapeParamB = 1
InvShapeParamC = 1
MinShapeType = 3
MinShapeScale = 0.909091
MinShapeParamA = 0.8917198
MinShapeParamB = 2.165605
MinShapeParamC = 0.5977937
MaxShapeType = 0
MaxShapeScale = 1
MaxShapeParamA = 1
MaxShapeParamB = 1
MaxShapeParamC = 1
Scale = 2
BoxFoldLimit = 1
UseMinScalingConstant = false
MinScalingConstant = 1
UseMaxScalingConstant = false
MaxScalingConstant = 1
UseMaxShape = false
ZFactor1 = 0
ZFactor2 = 0
#endpreset
  
