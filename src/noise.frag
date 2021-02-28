
// GLSL version of 2D periodic seamless perlin noise.
// https://github.com/g-truc/glm/blob/master/glm/gtc/noise.inl

precision highp float;
uniform vec2 resolution;
uniform float scale;

vec4 taylorInvSqrt(vec4 r) {
  return 1.79284291400159 - 0.85373472095314 * r;
}

vec4 mod289(vec4 x){
    return x-floor(x * (1.0 / 289.0)) * 289.0;
}

vec4 permute(vec4 x){
    return mod289(((x * 34.0) + 1.0) * x);
}

vec2 fade(vec2 t){
    return (t * t * t) * (t * (t * 6.0 - 15.0) + 10.0);
}

float perlin(vec2 Position, vec2 rep) {
  vec4 Pi = floor(vec4(Position.x, Position.y, Position.x, Position.y)) + vec4(0.0, 0.0, 1.0, 1.0);
  vec4 Pf = fract(vec4(Position.x, Position.y, Position.x, Position.y)) - vec4(0.0, 0.0, 1.0, 1.0);
  Pi = mod(Pi, vec4(rep.x, rep.y, rep.x, rep.y)); // To create noise with explicit period
  Pi = mod(Pi, vec4(289)); // To avoid truncation effects in permutation
  vec4 ix = vec4(Pi.x, Pi.z, Pi.x, Pi.z);
  vec4 iy = vec4(Pi.y, Pi.y, Pi.w, Pi.w);
  vec4 fx = vec4(Pf.x, Pf.z, Pf.x, Pf.z);
  vec4 fy = vec4(Pf.y, Pf.y, Pf.w, Pf.w);

  vec4 i = permute(permute(ix) + iy);

  vec4 gx = float(2) * fract(i / float(41)) - float(1);
  vec4 gy = abs(gx) - float(0.5);
  vec4 tx = floor(gx + float(0.5));
  gx = gx - tx;

  vec2 g00 = vec2(gx.x, gy.x);
  vec2 g10 = vec2(gx.y, gy.y);
  vec2 g01 = vec2(gx.z, gy.z);
  vec2 g11 = vec2(gx.w, gy.w);

  vec4 norm = taylorInvSqrt(vec4(dot(g00, g00), dot(g01, g01), dot(g10, g10), dot(g11, g11)));
  g00 *= norm.x;
  g01 *= norm.y;
  g10 *= norm.z;
  g11 *= norm.w;

  float n00 = dot(g00, vec2(fx.x, fy.x));
  float n10 = dot(g10, vec2(fx.y, fy.y));
  float n01 = dot(g01, vec2(fx.z, fy.z));
  float n11 = dot(g11, vec2(fx.w, fy.w));

  vec2 fade_xy = fade(vec2(Pf.x, Pf.y));
  vec2 n_x = mix(vec2(n00, n01), vec2(n10, n11), fade_xy.x);
  float n_xy = mix(n_x.x, n_x.y, fade_xy.y);
  return float(2.3) * n_xy;
}

void main() {
  vec2 uv = gl_FragCoord.xy / resolution;
  float noise = perlin(scale * uv, vec2(scale));
  gl_FragColor = vec4(vec3(0.5 + 0.5 * noise), 1.0);
}
