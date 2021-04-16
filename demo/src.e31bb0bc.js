parcelRequire=function(e,r,t,n){var i,o="function"==typeof parcelRequire&&parcelRequire,u="function"==typeof require&&require;function f(t,n){if(!r[t]){if(!e[t]){var i="function"==typeof parcelRequire&&parcelRequire;if(!n&&i)return i(t,!0);if(o)return o(t,!0);if(u&&"string"==typeof t)return u(t);var c=new Error("Cannot find module '"+t+"'");throw c.code="MODULE_NOT_FOUND",c}p.resolve=function(r){return e[t][1][r]||r},p.cache={};var l=r[t]=new f.Module(t);e[t][0].call(l.exports,p,l,l.exports,this)}return r[t].exports;function p(e){return f(p.resolve(e))}}f.isParcelRequire=!0,f.Module=function(e){this.id=e,this.bundle=f,this.exports={}},f.modules=e,f.cache=r,f.parent=o,f.register=function(r,t){e[r]=[function(e,r){r.exports=t},{}]};for(var c=0;c<t.length;c++)try{f(t[c])}catch(e){i||(i=e)}if(t.length){var l=f(t[t.length-1]);"object"==typeof exports&&"undefined"!=typeof module?module.exports=l:"function"==typeof define&&define.amd?define(function(){return l}):n&&(this[n]=l)}if(parcelRequire=f,i)throw i;return f}({"JEbG":[function(require,module,exports) {
"use strict";Object.defineProperty(exports,"__esModule",{value:!0}),exports.default=void 0;var t={create:function(){return[1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1]},perspective:function(t,n,r,o){var e=Math.tan(.5*Math.PI-.5*t),u=1/(r-o);return[e/n,0,0,0,0,e,0,0,0,0,(r+o)*u,-1,0,0,r*o*u*2,0]},projection:function(t,n,r){return[2/t,0,0,0,0,-2/n,0,0,0,0,2/r,0,-1,1,0,1]},transpose:function(t,n){if(t===n){var r=n[1],o=n[2],e=n[3],u=n[6],a=n[7],i=n[11];t[1]=n[4],t[2]=n[8],t[3]=n[12],t[4]=r,t[6]=n[9],t[7]=n[13],t[8]=o,t[9]=u,t[11]=n[14],t[12]=e,t[13]=a,t[14]=i}else t[0]=n[0],t[1]=n[4],t[2]=n[8],t[3]=n[12],t[4]=n[1],t[5]=n[5],t[6]=n[9],t[7]=n[13],t[8]=n[2],t[9]=n[6],t[10]=n[10],t[11]=n[14],t[12]=n[3],t[13]=n[7],t[14]=n[11],t[15]=n[15];return t},invert:function(t,n){var r=n[0],o=n[1],e=n[2],u=n[3],a=n[4],i=n[5],c=n[6],s=n[7],l=n[8],f=n[9],v=n[10],p=n[11],m=n[12],y=n[13],M=n[14],h=n[15],R=r*i-o*a,z=r*c-e*a,x=r*s-u*a,d=o*c-e*i,b=o*s-u*i,V=e*s-u*c,g=l*y-f*m,j=l*M-v*m,P=l*h-p*m,_=f*M-v*y,k=f*h-p*y,q=v*h-p*M,A=R*q-z*k+x*_+d*P-b*j+V*g;return A?(A=1/A,t[0]=(i*q-c*k+s*_)*A,t[1]=(e*k-o*q-u*_)*A,t[2]=(y*V-M*b+h*d)*A,t[3]=(v*b-f*V-p*d)*A,t[4]=(c*P-a*q-s*j)*A,t[5]=(r*q-e*P+u*j)*A,t[6]=(M*x-m*V-h*z)*A,t[7]=(l*V-v*x+p*z)*A,t[8]=(a*k-i*P+s*g)*A,t[9]=(o*P-r*k-u*g)*A,t[10]=(m*b-y*x+h*R)*A,t[11]=(f*x-l*b-p*R)*A,t[12]=(i*j-a*_-c*g)*A,t[13]=(r*_-o*j+e*g)*A,t[14]=(y*z-m*d-M*R)*A,t[15]=(l*d-f*z+v*R)*A,t):null},multiply:function(t,n){var r=t[0],o=t[1],e=t[2],u=t[3],a=t[4],i=t[5],c=t[6],s=t[7],l=t[8],f=t[9],v=t[10],p=t[11],m=t[12],y=t[13],M=t[14],h=t[15],R=n[0],z=n[1],x=n[2],d=n[3],b=n[4],V=n[5],g=n[6],j=n[7],P=n[8],_=n[9],k=n[10],q=n[11],A=n[12],I=n[13],O=n[14],w=n[15];return[R*r+z*a+x*l+d*m,R*o+z*i+x*f+d*y,R*e+z*c+x*v+d*M,R*u+z*s+x*p+d*h,b*r+V*a+g*l+j*m,b*o+V*i+g*f+j*y,b*e+V*c+g*v+j*M,b*u+V*s+g*p+j*h,P*r+_*a+k*l+q*m,P*o+_*i+k*f+q*y,P*e+_*c+k*v+q*M,P*u+_*s+k*p+q*h,A*r+I*a+O*l+w*m,A*o+I*i+O*f+w*y,A*e+I*c+O*v+w*M,A*u+I*s+O*p+w*h]},translation:function(t,n,r){return[1,0,0,0,0,1,0,0,0,0,1,0,t,n,r,1]},xRotation:function(t){var n=Math.cos(t),r=Math.sin(t);return[1,0,0,0,0,n,r,0,0,-r,n,0,0,0,0,1]},yRotation:function(t){var n=Math.cos(t),r=Math.sin(t);return[n,0,-r,0,0,1,0,0,r,0,n,0,0,0,0,1]},zRotation:function(t){var n=Math.cos(t),r=Math.sin(t);return[n,r,0,0,-r,n,0,0,0,0,1,0,0,0,0,1]},scaling:function(t,n,r){return[t,0,0,0,0,n,0,0,0,0,r,0,0,0,0,1]},translate:function(n,r,o,e){return t.multiply(n,t.translation(r,o,e))},xRotate:function(n,r){return t.multiply(n,t.xRotation(r))},yRotate:function(n,r){return t.multiply(n,t.yRotation(r))},zRotate:function(n,r){return t.multiply(n,t.zRotation(r))},scale:function(n,r,o,e){return t.multiply(n,t.scaling(r,o,e))},inverse:function(t){var n=t[0],r=t[1],o=t[2],e=t[3],u=t[4],a=t[5],i=t[6],c=t[7],s=t[8],l=t[9],f=t[10],v=t[11],p=t[12],m=t[13],y=t[14],M=t[15],h=f*M,R=y*v,z=i*M,x=y*c,d=i*v,b=f*c,V=o*M,g=y*e,j=o*v,P=f*e,_=o*c,k=i*e,q=s*m,A=p*l,I=u*m,O=p*a,w=u*l,B=s*a,C=n*m,D=p*r,E=n*l,F=s*r,G=n*a,H=u*r,J=h*a+x*l+d*m-(R*a+z*l+b*m),K=R*r+V*l+P*m-(h*r+g*l+j*m),L=z*r+g*a+_*m-(x*r+V*a+k*m),N=b*r+j*a+k*l-(d*r+P*a+_*l),Q=1/(n*J+u*K+s*L+p*N);return[Q*J,Q*K,Q*L,Q*N,Q*(R*u+z*s+b*p-(h*u+x*s+d*p)),Q*(h*n+g*s+j*p-(R*n+V*s+P*p)),Q*(x*n+V*u+k*p-(z*n+g*u+_*p)),Q*(d*n+P*u+_*s-(b*n+j*u+k*s)),Q*(q*c+O*v+w*M-(A*c+I*v+B*M)),Q*(A*e+C*v+F*M-(q*e+D*v+E*M)),Q*(I*e+D*c+G*M-(O*e+C*c+H*M)),Q*(B*e+E*c+H*v-(w*e+F*c+G*v)),Q*(I*f+B*y+A*i-(w*y+q*i+O*f)),Q*(E*y+q*o+D*f-(C*f+F*y+A*o)),Q*(C*i+H*y+O*o-(G*y+I*o+D*i)),Q*(G*f+w*o+F*i-(E*i+H*f+B*o))]},cross:function(t,n){return[t[1]*n[2]-t[2]*n[1],t[2]*n[0]-t[0]*n[2],t[0]*n[1]-t[1]*n[0]]},subtractVectors:function(t,n){return[t[0]-n[0],t[1]-n[1],t[2]-n[2]]},normalize:function(t){var n=Math.sqrt(t[0]*t[0]+t[1]*t[1]+t[2]*t[2]);return n>1e-5?[t[0]/n,t[1]/n,t[2]/n]:[0,0,0]},lookAt:function(n,r,o){var e=t.normalize(t.subtractVectors(n,r)),u=t.normalize(t.cross(o,e)),a=t.normalize(t.cross(e,u));return[u[0],u[1],u[2],0,a[0],a[1],a[2],0,e[0],e[1],e[2],0,n[0],n[1],n[2],1]},transformVector:function(t,n){for(var r=[],o=0;o<4;++o){r[o]=0;for(var e=0;e<4;++e)r[o]+=n[e]*t[4*e+o]}return r}},n=t;exports.default=n;
},{}],"sN+3":[function(require,module,exports) {
module.exports="precision highp float;\n#define GLSLIFY 1\nattribute vec3 position;\nattribute vec2 vertexCoordinate;\n\nvarying vec2 uv;\n\nuniform mat4 modelMatrix;\nuniform mat4 viewMatrix;\nuniform mat4 projectionMatrix;\n\nuniform sampler2D perlinNoiseTexture;\n\nuniform float time;\nuniform float waveSpeed;\nuniform float waveHeight;\n\nuniform float scale;\nconst int limit = 3;\n\nconst float angle = 0.0;\n\nconst float s = sin(angle);\nconst float c = cos(angle);\nconst mat2 rotation = mat2(c, s, -s, c);\n\nfloat getPerlinNoise(vec2 p){\n  return 2.0 * texture2D(perlinNoiseTexture, p).x - 1.0;\n}\n\nfloat fbm(vec2 pos){\n  float res = 0.0;\n  float freq = 1.0;\n  float amp = 1.0;\n  float ampSum = 0.0;\n  \n  for(int i = 0; i < limit; i++){ \n    float offset = time * float(limit-i);\n    res += getPerlinNoise(freq*(pos+offset)) * amp;\n    ampSum += amp;\n\n    freq *= 2.0;\n    amp *= 0.5;\n    \n    pos *= rotation;\n  }\n  return res/ampSum;\n}\n\nvoid main(){ \n  float noiseH = waveHeight * fbm(scale * position.xz);\n  vec3 offset = vec3(noiseH, 0.0, 0.0);\n  float noiseV = waveHeight * fbm(scale * (position.xz + offset.xz));\n  offset.y += noiseV;\n\n  vec4 pos = projectionMatrix * viewMatrix * modelMatrix * vec4(position + offset, 1.0);\n  uv = vertexCoordinate;\n  gl_Position = pos;\n}\n";
},{}],"zosk":[function(require,module,exports) {
module.exports="#define GLSLIFY 1\nattribute vec2 position;\n\nvoid main() { \n  gl_Position = vec4(position, 0.0, 1.0);\n}\n";
},{}],"cfs6":[function(require,module,exports) {
module.exports="\n// GLSL version of 2D periodic seamless perlin noise.\n// https://github.com/g-truc/glm/blob/master/glm/gtc/noise.inl\n\nprecision highp float;\n#define GLSLIFY 1\nuniform vec2 resolution;\nuniform float scale;\n\nvec4 taylorInvSqrt(vec4 r) {\n  return 1.79284291400159 - 0.85373472095314 * r;\n}\n\nvec4 mod289(vec4 x){\n    return x-floor(x * (1.0 / 289.0)) * 289.0;\n}\n\nvec4 permute(vec4 x){\n    return mod289(((x * 34.0) + 1.0) * x);\n}\n\nvec2 fade(vec2 t){\n    return (t * t * t) * (t * (t * 6.0 - 15.0) + 10.0);\n}\n\nfloat perlin(vec2 Position, vec2 rep) {\n  vec4 Pi = floor(vec4(Position.x, Position.y, Position.x, Position.y)) + vec4(0.0, 0.0, 1.0, 1.0);\n  vec4 Pf = fract(vec4(Position.x, Position.y, Position.x, Position.y)) - vec4(0.0, 0.0, 1.0, 1.0);\n  Pi = mod(Pi, vec4(rep.x, rep.y, rep.x, rep.y)); // To create noise with explicit period\n  Pi = mod(Pi, vec4(289)); // To avoid truncation effects in permutation\n  vec4 ix = vec4(Pi.x, Pi.z, Pi.x, Pi.z);\n  vec4 iy = vec4(Pi.y, Pi.y, Pi.w, Pi.w);\n  vec4 fx = vec4(Pf.x, Pf.z, Pf.x, Pf.z);\n  vec4 fy = vec4(Pf.y, Pf.y, Pf.w, Pf.w);\n\n  vec4 i = permute(permute(ix) + iy);\n\n  vec4 gx = float(2) * fract(i / float(41)) - float(1);\n  vec4 gy = abs(gx) - float(0.5);\n  vec4 tx = floor(gx + float(0.5));\n  gx = gx - tx;\n\n  vec2 g00 = vec2(gx.x, gy.x);\n  vec2 g10 = vec2(gx.y, gy.y);\n  vec2 g01 = vec2(gx.z, gy.z);\n  vec2 g11 = vec2(gx.w, gy.w);\n\n  vec4 norm = taylorInvSqrt(vec4(dot(g00, g00), dot(g01, g01), dot(g10, g10), dot(g11, g11)));\n  g00 *= norm.x;\n  g01 *= norm.y;\n  g10 *= norm.z;\n  g11 *= norm.w;\n\n  float n00 = dot(g00, vec2(fx.x, fy.x));\n  float n10 = dot(g10, vec2(fx.y, fy.y));\n  float n01 = dot(g01, vec2(fx.z, fy.z));\n  float n11 = dot(g11, vec2(fx.w, fy.w));\n\n  vec2 fade_xy = fade(vec2(Pf.x, Pf.y));\n  vec2 n_x = mix(vec2(n00, n01), vec2(n10, n11), fade_xy.x);\n  float n_xy = mix(n_x.x, n_x.y, fade_xy.y);\n  return float(2.3) * n_xy;\n}\n\nvoid main() {\n  vec2 uv = gl_FragCoord.xy / resolution;\n  float noise = perlin(scale * uv, vec2(scale));\n  gl_FragColor = vec4(vec3(0.5 + 0.5 * noise), 1.0);\n}\n";
},{}],"epB2":[function(require,module,exports) {
"use strict";Object.defineProperty(exports,"__esModule",{value:!0}),exports.default=exports.getProperties=exports.getConfig=void 0;var e=i(require("./m4.js")),t=i(require("./main.vert")),r=i(require("./noise.vert")),a=i(require("./noise.frag"));function i(e){return e&&e.__esModule?e:{default:e}}function n(e,t){var r=Object.keys(e);if(Object.getOwnPropertySymbols){var a=Object.getOwnPropertySymbols(e);t&&(a=a.filter(function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable})),r.push.apply(r,a)}return r}function o(e){for(var t=1;t<arguments.length;t++){var r=null!=arguments[t]?arguments[t]:{};t%2?n(Object(r),!0).forEach(function(t){c(e,t,r[t])}):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(r)):n(Object(r)).forEach(function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(r,t))})}return e}function c(e,t,r){return t in e?Object.defineProperty(e,t,{value:r,enumerable:!0,configurable:!0,writable:!0}):e[t]=r,e}var u=function(e){return o({width:1440,height:900,dpr:window.devicePixelRatio},e)};exports.getConfig=u;var f=function(e){return o({cameraPitch:0,cameraYaw:1.5,cameraDist:1.8,scaleZ:2,translateZ:-.1,meshRows:128,meshColumns:256,framesToFade:15,lineSpacing:200,lineWidth:55,waveSpeed:.2,waveSpeedD:.001,waveSpeedMinI:.002,waveSpeedMaxI:.003,waveHeight:.3,waveHeightD:.094,waveHeightMinI:.1,waveHeightMaxI:.2,scale:.3},e)};function s(i,n,o){n=u(n),o=f(o);var c=n,s=c.width,l=c.height,v=c.dpr,h=o,d=h.meshRows,E=h.meshColumns,T=h.lineSpacing,R=h.lineWidth;"string"==typeof i&&(i=document.querySelector(i));var m=document.createElement("canvas");m.style.width="100%",m.style.height="100%",m.width=Math.round(s*v),m.height=Math.round(l*v),i.appendChild(m);var p=m.getContext("webgl",{antialias:!0});p||console.error("Unable to initialize WebGL.");var g,A,w,x,b,_,S,M,P=!1,F={x:.5,y:.5},D={x:1,y:0,z:1};_=(b=o).cameraYaw,S=b.cameraPitch,M=o.cameraPitch=Math.max(-Math.PI/2,Math.min(Math.PI/2,S)),D.x=Math.sin(_),D.z=Math.cos(_),D.y=-Math.sin(M),w=D,x=Math.sqrt(w.x*w.x+w.y*w.y+w.z*w.z),D={x:w.x/x,y:w.y/x,z:w.z/x},function(){var t=45*Math.PI/180,r=p.canvas.clientWidth/p.canvas.clientHeight;g=e.default.perspective(t,r,.1,100);var a,i=e.default.lookAt([(a=o.cameraDist)*D.x,a*D.y,a*D.z],[0,0,0],[0,1,0]);A=e.default.inverse(i)}();for(var y=[],U=[],I=6*(E-1)*(d-1),O=0;O<d;O++)for(var B=0;B<E;B++)y.push(B/E-.5,0,O/d-.5),U.push(B/E,O/d);for(var L=[],C=0;C<d-1;C++)for(var H=0;H<E-1;H++)L.push(H+C*E,H+C*E+1,H+(1+C)*E),L.push(H+C*E+1,H+(C+1)*E+1,H+(1+C)*E);function X(e){var t=String(e);return t.includes(".")||(t+=".0"),t}var j="\n    precision highp float;\n    uniform sampler2D perlinNoiseTexture;\n    const float lineSpacing = ".concat(X(T),";\n    const float lineWidth = ").concat(X(R),";\n    varying vec2 uv;\n    \n    void main() {\n      float col = 0.5 + 0.5 * sin(uv.x * lineSpacing);\n      float alpha = pow(col, lineWidth);\n      gl_FragColor = vec4(vec3(0.5 * alpha), alpha);\n    }");function N(e,t){var r=p.createShader(t);if(p.shaderSource(r,e),p.compileShader(r),!p.getShaderParameter(r,p.COMPILE_STATUS))throw"Shader compile failed with: ".concat(p.getShaderInfoLog(r));return r}function Y(e,t){var r=p.getAttribLocation(e,t);if(-1===r)throw"Cannot find attribute ".concat(t);return r}function W(e,t){var r=p.getUniformLocation(e,t);if(-1===r)throw"Cannot find uniform ".concat(t);return r}function G(e,t,r){return e*(1-r)+t*r}function z(e){var t=e.clientX,r=e.clientY;e instanceof TouchEvent&&(t=e.changedTouches[0].pageX,r=e.changedTouches[0].pageY),P=!0;var a=m.getBoundingClientRect();F.x=(t-a.left)/a.width,F.y=(r-a.top)/a.height}function q(){P=!1}function V(){P=!0}function k(){var e=arguments.length>0&&void 0!==arguments[0]&&arguments[0],t=m[e?"removeEventListener":"addEventListener"].bind(m);t("mouseenter",V),t("mousemove",z),t("mouseleave",q),t("touchstart",V,{passive:!0}),t("touchmove",z,{passive:!0}),t("touchend",q,{passive:!0})}var Z=function(){return k(!1)},J=function(){return k(!0)};J(),Z();var K={},Q=N(r.default,p.VERTEX_SHADER),$=N(a.default,p.FRAGMENT_SHADER),ee=N(t.default,p.VERTEX_SHADER),te=N(j,p.FRAGMENT_SHADER),re=p.createProgram();p.attachShader(re,Q),p.attachShader(re,$),p.linkProgram(re),p.useProgram(re);var ae=new Float32Array([-1,1,-1,-1,1,1,1,-1]),ie=p.createBuffer();p.bindBuffer(p.ARRAY_BUFFER,ie),p.bufferData(p.ARRAY_BUFFER,new Float32Array(ae),p.STATIC_DRAW),K.noisePosition=Y(re,"position"),p.vertexAttribPointer(K.noisePosition,2,p.FLOAT,!1,8,0),p.enableVertexAttribArray(K.noisePosition),K.noiseScale=p.getUniformLocation(re,"scale"),K.noiseResolution=p.getUniformLocation(re,"resolution");var ne=p.createFramebuffer();ne.width=256,ne.height=256,p.bindFramebuffer(p.FRAMEBUFFER,ne);var oe=function(e){var t=e.createTexture();return e.bindTexture(e.TEXTURE_2D,t),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_WRAP_S,e.REPEAT),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_WRAP_T,e.REPEAT),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_MIN_FILTER,e.LINEAR),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_MAG_FILTER,e.LINEAR),t}(p);p.texImage2D(p.TEXTURE_2D,0,p.RGBA,ne.width,ne.height,0,p.RGBA,p.UNSIGNED_BYTE,null),p.framebufferTexture2D(p.FRAMEBUFFER,p.COLOR_ATTACHMENT0,p.TEXTURE_2D,oe,0),p.useProgram(re),p.uniform1f(K.noiseScale,8),p.uniform2f(K.noiseResolution,256,256),p.viewport(0,0,256,256),p.clearColor(0,0,0,0),p.clear(p.COLOR_BUFFER_BIT),p.drawArrays(p.TRIANGLE_STRIP,0,4);var ce=p.createProgram();p.attachShader(ce,ee),p.attachShader(ce,te),p.linkProgram(ce),p.useProgram(ce);var ue=p.createBuffer();p.bindBuffer(p.ARRAY_BUFFER,ue),p.bufferData(p.ARRAY_BUFFER,new Float32Array(y),p.STATIC_DRAW),K.position=Y(ce,"position"),p.vertexAttribPointer(K.position,3,p.FLOAT,!1,0,0),p.enableVertexAttribArray(K.position);var fe=p.createBuffer();p.bindBuffer(p.ARRAY_BUFFER,fe),p.bufferData(p.ARRAY_BUFFER,new Float32Array(U),p.STATIC_DRAW),K.uv=Y(ce,"vertexCoordinate"),p.vertexAttribPointer(K.uv,2,p.FLOAT,!1,0,0),p.enableVertexAttribArray(K.uv);var se,le,ve,he,de=p.createBuffer();p.bindBuffer(p.ELEMENT_ARRAY_BUFFER,de),p.bufferData(p.ELEMENT_ARRAY_BUFFER,new Uint16Array(L),p.STATIC_DRAW),K.time=W(ce,"time"),K.scale=W(ce,"scale"),K.projectionMatrix=W(ce,"projectionMatrix"),K.viewMatrix=W(ce,"viewMatrix"),K.modelMatrix=W(ce,"modelMatrix"),K.noiseTexture=W(ce,"noiseTexture"),K.waveHeight=W(ce,"waveHeight"),K.waveSpeed=W(ce,"waveSpeed"),p.useProgram(ce),p.activeTexture(p.TEXTURE0),p.bindTexture(p.TEXTURE_2D,oe),p.uniform1i(K.noiseTexture,0),p.uniformMatrix4fv(K.projectionMatrix,!1,g),p.uniformMatrix4fv(K.viewMatrix,!1,A),p.uniformMatrix4fv(K.modelMatrix,!1,(le=(se=o).scaleZ,ve=se.translateZ,he=e.default.create(),he=e.default.zRotate(he,Math.PI/2),he=e.default.scale(he,1,1,le),he=e.default.translate(he,0,0,ve)));var Ee,Te=0,Re=0,me=Date.now();this.draw=function(){var e,t,r,a,i,n,c,u,f=o,s=f.framesToFade,l=f.waveSpeed,v=f.waveHeight,h=f.scale;Re=P?Math.min(s,Re+1):Math.max(0,Re-1),e=Re/s,r=(t=o).waveSpeedD,a=t.waveSpeedMinI,i=t.waveSpeedMaxI,n=t.waveHeightD,c=t.waveHeightMinI,u=t.waveHeightMaxI,o.waveSpeed=G(r,G(a,i,F.x),e),o.waveHeight=G(n,G(c,u,F.y),e),Ee=Date.now(),Te+=25*l*(Ee-me)/1e3,me=Ee,p.useProgram(ce),p.viewport(0,0,p.canvas.width,p.canvas.height),p.bindFramebuffer(p.FRAMEBUFFER,null),p.activeTexture(p.TEXTURE0),p.uniform1i(K.noiseTexture,0),p.bindTexture(p.TEXTURE_2D,oe),p.uniform1f(K.time,Te),p.uniform1f(K.scale,h),p.uniform1f(K.waveSpeed,l),p.uniform1f(K.waveHeight,v),p.clearColor(0,0,0,0),p.enable(p.DEPTH_TEST),p.clear(p.COLOR_BUFFER_BIT),p.drawElements(p.TRIANGLES,I,p.UNSIGNED_SHORT,0)},this.toggleInteraction=function(e){return e?Z():J()},this.destroy=function(){J()}}exports.getProperties=f;var l=s;exports.default=l;
},{"./m4.js":"JEbG","./main.vert":"sN+3","./noise.vert":"zosk","./noise.frag":"cfs6"}],"Focm":[function(require,module,exports) {
"use strict";var e=i(require("./main.js"));function i(e){return e&&e.__esModule?e:{default:e}}var n=new e.default("#desktopViz",{dpr:2},{lineSpacing:200,lineWidth:55,meshRows:128,meshColumns:256}),s=new e.default("#mobileViz",{dpr:1},{lineSpacing:100,lineWidth:25,meshRows:64,meshColumns:128});function t(){n.draw(),requestAnimationFrame(t)}requestAnimationFrame(t);
},{"./main.js":"epB2"}]},{},["Focm"], null)
//# sourceMappingURL=src.e31bb0bc.js.map