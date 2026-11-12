// GLSL for the silk: one fragment shader (shot-silk body, sheen, zari border,
// buttis, gold glints) shared by the hero cloth and the 360° drape.

const noise = /* glsl */ `
vec3 mod289(vec3 x){return x-floor(x*(1.0/289.0))*289.0;}
vec4 mod289(vec4 x){return x-floor(x*(1.0/289.0))*289.0;}
vec4 permute(vec4 x){return mod289(((x*34.0)+1.0)*x);}
vec4 taylorInvSqrt(vec4 r){return 1.79284291400159-0.85373472095314*r;}
float snoise(vec3 v){
  const vec2 C=vec2(1.0/6.0,1.0/3.0); const vec4 D=vec4(0.0,0.5,1.0,2.0);
  vec3 i=floor(v+dot(v,C.yyy)); vec3 x0=v-i+dot(i,C.xxx);
  vec3 g=step(x0.yzx,x0.xyz); vec3 l=1.0-g; vec3 i1=min(g.xyz,l.zxy); vec3 i2=max(g.xyz,l.zxy);
  vec3 x1=x0-i1+C.xxx; vec3 x2=x0-i2+C.yyy; vec3 x3=x0-D.yyy;
  i=mod289(i);
  vec4 p=permute(permute(permute(i.z+vec4(0.0,i1.z,i2.z,1.0))+i.y+vec4(0.0,i1.y,i2.y,1.0))+i.x+vec4(0.0,i1.x,i2.x,1.0));
  float n_=0.142857142857; vec3 ns=n_*D.wyz-D.xzx;
  vec4 j=p-49.0*floor(p*ns.z*ns.z);
  vec4 x_=floor(j*ns.z); vec4 y_=floor(j-7.0*x_);
  vec4 x=x_*ns.x+ns.yyyy; vec4 y=y_*ns.x+ns.yyyy; vec4 h=1.0-abs(x)-abs(y);
  vec4 b0=vec4(x.xy,y.xy); vec4 b1=vec4(x.zw,y.zw);
  vec4 s0=floor(b0)*2.0+1.0; vec4 s1=floor(b1)*2.0+1.0; vec4 sh=-step(h,vec4(0.0));
  vec4 a0=b0.xzyw+s0.xzyw*sh.xxyy; vec4 a1=b1.xzyw+s1.xzyw*sh.zzww;
  vec3 p0=vec3(a0.xy,h.x); vec3 p1=vec3(a0.zw,h.y); vec3 p2=vec3(a1.xy,h.z); vec3 p3=vec3(a1.zw,h.w);
  vec4 norm=taylorInvSqrt(vec4(dot(p0,p0),dot(p1,p1),dot(p2,p2),dot(p3,p3)));
  p0*=norm.x; p1*=norm.y; p2*=norm.z; p3*=norm.w;
  vec4 m=max(0.6-vec4(dot(x0,x0),dot(x1,x1),dot(x2,x2),dot(x3,x3)),0.0); m=m*m;
  return 42.0*dot(m*m,vec4(dot(p0,x0),dot(p1,x1),dot(p2,x2),dot(p3,x3)));
}
`

// Hero cloth: a flat plane pushed around by layered waves + noise ("wind"),
// with a soft bulge that follows the pointer / device tilt.
export const clothVertex = /* glsl */ `
uniform float uTime;
uniform float uAmp;
uniform vec2 uPointer;
varying vec2 vUv;
varying vec3 vNormal;
varying vec3 vViewPos;
varying float vElev;
${noise}
float wave(vec2 p){
  float t = uTime;
  float w = sin(p.x*1.25 + t*0.8)*0.2 + sin(p.y*1.9 + p.x*0.7 + t*0.6)*0.13;
  w += snoise(vec3(p*0.42, t*0.14))*0.5;
  w += snoise(vec3(p*1.1 + 7.0, t*0.22))*0.045;
  float d = distance(p, uPointer);
  w += exp(-d*d*0.55)*0.42;
  return w*uAmp;
}
void main(){
  vUv = uv;
  float e = 0.04;
  float h  = wave(position.xy);
  float hx = wave(position.xy + vec2(e, 0.0));
  float hy = wave(position.xy + vec2(0.0, e));
  vec3 p = vec3(position.xy, h);
  vec3 n = normalize(cross(vec3(e, 0.0, hx - h), vec3(0.0, e, hy - h)));
  vElev = h;
  vNormal = normalize(normalMatrix * n);
  vec4 mv = modelViewMatrix * vec4(p, 1.0);
  vViewPos = mv.xyz;
  gl_Position = projectionMatrix * mv;
}
`

// 360° drape: a cylinder shaped into falling pleats that flare at the hem.
export const drapeVertex = /* glsl */ `
uniform float uTime;
uniform float uAmp;
varying vec2 vUv;
varying vec3 vNormal;
varying vec3 vViewPos;
varying float vElev;
void main(){
  vUv = uv;
  float fall = 1.0 - uv.y;                      // 0 at the top, 1 at the hem
  float ang = uv.x * 6.2831853;
  float pleat = sin(ang*16.0 + fall*1.5)*0.075*fall
              + sin(ang*5.0 + uTime*0.7)*0.035*fall*uAmp
              + sin(ang*2.0 - uTime*0.4 + fall*3.0)*0.05*fall*uAmp;
  vec3 p = position;
  vec2 dir = normalize(position.xz + vec2(0.0001));
  p.xz += dir * pleat;
  p.x += sin(uTime*0.6 + position.y*1.4)*0.03*fall*uAmp;
  vElev = pleat*3.0;
  vNormal = normalMatrix * normal;
  vec4 mv = modelViewMatrix * vec4(p, 1.0);
  vViewPos = mv.xyz;
  gl_Position = projectionMatrix * mv;
}
`

export const silkFragment = /* glsl */ `
uniform vec3 uColorA;
uniform vec3 uColorB;
uniform vec3 uGold;
uniform float uTime;
uniform float uSheen;
uniform vec2 uRepeat;
varying vec2 vUv;
varying vec3 vNormal;
varying vec3 vViewPos;
varying float vElev;

float hash(vec2 p){ return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }

void main(){
  #ifdef FLAT_NORMALS
    vec3 N = normalize(cross(dFdx(vViewPos), dFdy(vViewPos)));
  #else
    vec3 N = normalize(vNormal);
    if (!gl_FrontFacing) N = -N;
  #endif
  vec3 V = normalize(-vViewPos);
  vec3 L = normalize(vec3(0.45, 0.7, 0.9));
  vec3 L2 = normalize(vec3(-0.8, 0.15, 0.5));
  float ndl = max(dot(N, L), 0.0);
  float ndl2 = max(dot(N, L2), 0.0);
  float ndh = max(dot(N, normalize(L + V)), 0.0);
  float fres = pow(1.0 - max(dot(N, V), 0.0), 2.5);

  // Shot silk: the second colour shows on folds and at glancing angles.
  vec3 body = mix(uColorA, uColorB, clamp(fres*1.3 + vElev*0.55, 0.0, 1.0) * 0.85);
  float weave = 0.95 + 0.05 * sin(vUv.x*uRepeat.x*700.0) * sin(vUv.y*uRepeat.y*500.0);
  vec3 col = body * (0.22 + 0.8*ndl + 0.18*ndl2) * weave;
  col += mix(uColorA, vec3(1.0), 0.4) * pow(ndh, 46.0) * 0.38 * uSheen;   // soft specular sheen
  col += uColorB * fres * 0.3 * uSheen;

  // Zari: temple border along both edges + scattered buttis.
  float edge = min(vUv.y, 1.0 - vUv.y);
  float e = edge / 0.1;
  float tri = abs(fract(vUv.x*uRepeat.x*26.0) - 0.5) * 2.0;
  float zari = step(e, 0.62 + 0.38*tri);
  zari *= 1.0 - step(0.2, e) * step(e, 0.27);
  zari *= 1.0 - step(0.36, e) * step(e, 0.4);
  zari = max(zari, step(1.14, e) * step(e, 1.22));
  vec2 g = vUv * uRepeat * vec2(16.0, 10.0);
  g.x += 0.5 * mod(floor(g.y), 2.0);
  vec2 c = fract(g) - 0.5;
  float butti = (1.0 - smoothstep(0.1, 0.13, abs(c.x) + abs(c.y)*0.8)) * step(1.5, e);
  float goldMask = clamp(zari + butti, 0.0, 1.0);

  float tw = hash(floor(vUv * uRepeat * vec2(520.0, 360.0)));
  float glint = pow(tw, 22.0) * (0.5 + 0.5*sin(uTime*2.6 + tw*60.0)) * (0.35 + ndh*2.2);
  vec3 gold = uGold * (0.28 + 0.78*ndl + 0.22*ndl2)
            + vec3(1.0, 0.86, 0.56) * (pow(ndh, 60.0)*1.3 + glint*3.0);
  col = mix(col, gold, goldMask);

  gl_FragColor = vec4(col, 1.0);
  #include <colorspace_fragment>
}
`
